// A colour ROLE resolved to a CSS value has exactly one implementation. It used to have 59, hand-
// copied across 25 files, and they had drifted: one built the variable name from the role
// (`bg-surface` became `var(--background-surface)`, which mise defines nowhere), and the header's
// text arm let `none` through its `!= blank and != 'inherit' and != 'primary'` guard and shipped
// `var(--text-none)`. Both are unrepresentable now, and this stops the 60th copy.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => readFileSync(join(root, p), "utf8");
const SNIPPET = "snippets/role-color-value.liquid";

// Every template that could paint a role, found by listing rather than naming, so a new one counts.
const templates = ["blocks", "sections", "snippets", "layout"].flatMap((dir) =>
  readdirSync(join(root, dir))
    .filter((f) => f.endsWith(".liquid"))
    .map((f) => `${dir}/${f}`)
);

test("no template resolves a palette or gradient role to a value itself", () => {
  // Anchoring on `assign x = 'var(--palette-` scored clean while five sites spelled the same thing
  // through `push:` — the token reference is the tell, wherever it is spent.
  const offenders = templates
    .filter((f) => f !== SNIPPET && f !== "snippets/theme_variables.liquid")
    .filter((f) => /var\(--(?:palette|gradient)-\s*\{\{/.test(read(f)));

  assert.deepEqual(offenders, [], `these spell the resolver inline; render '${SNIPPET}' instead`);
});

test("no template builds a slot variable name rather than naming it", () => {
  // A slot's variable is a LITERAL. Interpolating the name is how `--background-surface` shipped,
  // and it hid a second time behind an intermediate `assign slot = role | replace: …`.
  const allowed = /var\(--(?:space|palette|gradient)-\{\{/; // a TIER or TOKEN id, not a slot name
  const offenders = templates
    .filter((f) => f !== SNIPPET && f !== "snippets/theme_variables.liquid")
    .filter((f) => {
      const src = read(f);
      return [...src.matchAll(/var\(--[a-z-]*\{\{[^)]*\)/g)].some((m) => !allowed.test(m[0]));
    });

  assert.deepEqual(offenders, [], "a slot's variable is looked up, never assembled");
});

test("the resolver names a variable the theme actually defines", () => {
  // The theme emits `--<slot>` per surface slot; the resolver must not name anything else.
  // The slot arms only: the palette and gradient arms name a TOKEN, which is not a surface slot.
  const arms = read(SNIPPET).slice(read(SNIPPET).indexOf("slots and kind"));
  const vars = [...arms.matchAll(/var\(--([a-z-]+)[^)]*\)/g)].map((m) => m[1]);
  const slots = read("snippets/theme_variables.liquid")
    .match(/'(background\|[^']+)'/)[1]
    .split("|")
    .map((s) => s.replace(/_/g, "-"));

  const unknown = vars.filter((v) => !slots.includes(v));
  assert.deepEqual(unknown, [], `the theme defines no --${unknown.join(", --")}`);
});

test("every slot the theme paints can be asked for by name", () => {
  // The mirror: a slot the resolver cannot answer is a role the editor offers and nothing paints.
  const snippet = read(SNIPPET);
  const painted = read("snippets/theme_variables.liquid")
    .match(/'(background\|[^']+)'/)[1]
    .split("|")
    .filter((s) => s !== "shadow"); // carries a colour but has no role name

  const unanswerable = painted.filter(
    (slot) => !new RegExp(`--${slot.replace(/_/g, "-")}[^a-z)-]`).test(snippet)
  );
  assert.deepEqual(unanswerable, [], "these slots have no arm in the resolver");
});

test("a call passes every arg the field's own picker can produce", () => {
  // An arm whose arg never arrives resolves to blank — the shape the inline copies failed at, where
  // an arm the body never compared against emitted nothing for that half of the picker.
  const sites = templates.flatMap((file) => {
    const src = readFileSync(join(root, file), "utf8");
    const schema = src.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
    const byId = new Map(
      schema
        ? JSON.parse(schema[1])
            .settings.filter((f) => f?.id)
            .map((f) => [f.id, f])
        : []
    );
    return [...src.matchAll(/render 'role-color-value',([\s\S]*?)-%\}/g)].flatMap(([, args]) => {
      const field = args.match(/role:\s*s\.(\w+)/)?.[1];
      const picker = field && byId.get(field);
      return picker?.options ? [{ file, field, args, picker }] : [];
    });
  });

  assert.ok(sites.length >= 60, `only found ${sites.length} resolver calls to check`);
  const dropped = sites.flatMap(({ file, field, args, picker }) =>
    ["palette", "custom", "gradient"]
      .filter((arm) => picker.options.some((o) => o.value === arm) && !args.includes(`${arm}:`))
      .map((arm) => `${file} ${field} offers '${arm}' and is passed none`)
  );

  assert.deepEqual(dropped, []);
});

test("a capture holding a resolved colour controls its own whitespace", () => {
  // "Paints nothing" is a BLANK capture, and every caller gates on `!= blank`. Let the capture tags
  // keep their newline and a role of `none` captures whitespace instead — not blank, so the guard
  // passes and the element paints. Measured: it fails ROS's `a role of none paints nothing`.
  const loose = templates.flatMap((file) => {
    const src = readFileSync(join(root, file), "utf8");
    return [...src.matchAll(/\{%(-?)\s*capture\s+(\w+)\s*(-?)%\}([\s\S]*?)\{%(-?)\s*endcapture/g)]
      .filter(([, , , , inner]) => inner.includes("role-color-value"))
      .filter(([, open, name, close, inner, end]) => {
        const stripped = new RegExp(`assign\\s+\\w+\\s*=\\s*${name}\\s*\\|\\s*strip`).test(src);
        return !stripped && !(close === "-" && end === "-");
      })
      .map(([, , name]) => `${file} ${name}`);
  });

  assert.deepEqual(loose, [], "these capture whitespace, which reads as a colour");
});

test("the slot arms are opt-in, so a caller keeps the class route by default", () => {
  // mise sends a slot out as a `bg-*` / `text-*` CLASS. An inline declaration would outrank the
  // class rules that paint a component's states — the `_tab-head` lesson.
  const snippet = read(SNIPPET);

  for (const kind of ["bg", "border", "text"]) {
    assert.match(
      snippet,
      new RegExp(`elsif slots and kind == '${kind}'`),
      `${kind} slot arm must be guarded by \`slots\``
    );
  }
});

test("a caller that opts into slots is one that paints through a custom property", () => {
  const optedIn = templates.filter((f) =>
    /render 'role-color-value'[^%]*slots: true/.test(read(f))
  );

  for (const file of optedIn) {
    assert.match(
      read(file),
      /--[a-z-]+:/,
      `${file} asks for slot values but declares no custom property to put them in`
    );
  }
});

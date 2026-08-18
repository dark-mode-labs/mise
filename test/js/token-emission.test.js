// The per-theme token sheet loads AFTER theme.css, so at equal specificity it wins. A tier rule may
// therefore only set what the tier is ABOUT. `display: revert` in a by-bp width arm discarded the
// element's own `.flex`/`.block` and handed it the UA default at every breakpoint — invisible to a
// box comparison, because reverting a flex container changes its CHILDREN, not its own width.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const src = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../../snippets/theme_variables.liquid"),
  "utf8"
);

// Every `.width-… { … }` rule body the snippet emits. Scoped by SELECTOR, not by position: mise's
// own responsive rules (`.header-nav`, `.chip-strip`) set display legitimately, on their own classes.
const widthRuleBodies = [...src.matchAll(/\.width-\{\{[^{]*\{([^}]*)\}/g)].map((m) => m[1]);

test("a tier rule never resets a property back to the user-agent default", () => {
  assert.equal(src.includes("revert"), false);
});

test("a hover tier transitions named properties, never `all`", () => {
  // `all` also animates a geometry change the element makes for its own reasons — a tab head
  // swapping state classes resizes by its border width, and `all` turns that into a visible wiggle.
  assert.doesNotMatch(src, /transition(-property)?:\s*all\b/);
});

test("every field the hover applies is a field it transitions", () => {
  // Two readings of one list: what `:hover` sets, and what the transition names. A field in the
  // first but not the second snaps while its siblings animate.
  // `rest` reads `text_role_palette`/`_custom` where `moved` reads `text_role`; normalise to the
  // dim so the colour fields are COMPARED rather than dropped.
  const fields = (block) =>
    new Set(
      [...block.matchAll(/\bef\.(\w+)/g)].map((m) =>
        m[1].replace(/_role_(palette|custom|gradient)$/, "_role")
      )
    );
  const applied = fields(
    src.slice(
      src.indexOf("{% capture rest %}"),
      src.indexOf("{% endcapture %}", src.indexOf("{% capture rest %}"))
    )
  );
  const transitioned = fields(
    src.slice(src.indexOf("{% assign moved ="), src.indexOf("{% if ef.type == 'static' %}"))
  );

  assert.deepEqual([...applied].sort(), [...transitioned].sort());
});

// The test above compares field NAMES, which agree even when the conditions around them do not:
// `text_role` defaults to `inherit`, a value the `case` has no arm for, so the paint gated on
// `text_var` emitted nothing while the transition and the re-assert gated on `!= blank and != none`
// and fired anyway. That shipped `--text:;` — an empty custom property, so `color: var(--text)`
// turned invalid on hover and the element took its PARENT's colour. Compare the predicates.
const DIMS = [
  ["text", "color"],
  ["bg", "background"],
  ["border", "border-color"],
];

test("a colour is painted, transitioned and re-asserted under one predicate", () => {
  const rest = src.slice(
    src.indexOf("{% capture rest %}"),
    src.indexOf("{% endcapture %}", src.indexOf("{% capture rest %}"))
  );
  const moved = src.slice(
    src.indexOf("{% assign moved ="),
    src.indexOf("{% if ef.type == 'static' %}")
  );

  for (const [dim, prop] of DIMS) {
    const guard = `hover_${dim}_value != blank`;

    const paint = rest.match(new RegExp(`\\{%\\s*if ([^%]*?)%\\}${prop}:`));
    assert.ok(paint, `${prop} is no longer painted from a single guarded value`);
    assert.equal(paint[1].trim(), guard, `${prop} paints on a different condition`);

    const push = moved.match(
      new RegExp(`\\{%\\s*if ([^%]*?)%\\}\\s*\\{%\\s*assign moved = moved \\| push: '${prop}'`)
    );
    assert.ok(push, `${prop} is no longer pushed onto the transition list`);
    assert.equal(push[1].trim(), guard, `${prop} transitions on a different condition`);
  }
});

test("the hover re-assert of `--text` fires only when there is a colour to assert", () => {
  // `--text` is re-asserted so descendants inherit the hover colour; with no colour it must not
  // be written at all, because an empty custom property is not the same as an absent one.
  const at = src.indexOf("assign hover_inherit = '--text:");
  assert.ok(at > 0, "the --text re-assert is gone");
  const guard = src.slice(src.lastIndexOf("{%- if", at), at);
  assert.match(guard, /hover_text_value != blank/, "the re-assert can emit an empty --text");
});

test("the only display a width tier sets is the one a `0` width means", () => {
  assert.ok(widthRuleBodies.length, "no width-tier rules found — did the emission change shape?");
  const displays = new Set(
    widthRuleBodies.flatMap((b) => [...b.matchAll(/display:\s*([a-z-]+)/g)].map((m) => m[1]))
  );

  assert.deepEqual([...displays], ["none"]);
});

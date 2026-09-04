// A panel is the source's own mobile nav dropped in flow, so it must not carry the drawer's chrome
// and must not be squeezed: the bar's bottom inset closes ABOVE it, a source divider rules every link
// but the last, and an action control never compresses below its content — the same invariant the
// cart and toggle already carry, without which a narrow bar wrapped a CTA's label onto two lines.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => readFileSync(join(root, p), "utf8");
const schema = (p) =>
  JSON.parse(read(p).match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/)[1]);

test("every header action control refuses to shrink", () => {
  const header = read("sections/header.liquid");

  for (const [what, anchor] of [
    ["toggle", /assign toggle_classes = '([^']*)'/],
    ["cart", /assign cart_btn_class = '([^']*)'/],
  ]) {
    assert.match(
      header.match(anchor)[1],
      /\bshrink-0\b/,
      `${what} may be flex-squeezed below its content`
    );
  }
  // The row itself is floored by the grid instead: `shrink-0` on the row fought `min-width: 0`,
  // which the grid sets so the middle column stays centred. The floor belongs with that rule.
  assert.match(
    read("assets/css/theme.css"),
    /\.header-grid > \*:has\(\.header-actions\)\s*\{\s*min-width: min-content;/,
    "nothing stops the actions column shrinking past its controls"
  );
});

test("a panel drops the drawer's own chrome", () => {
  const src = read("snippets/header-drawer.liquid");
  const guarded = [
    ...src.matchAll(/\{%\s*if nav_mode != 'panel'\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g),
  ]
    .map((m) => m[1])
    .join("\n");

  for (const fragment of ["aria-label='Close Menu'", "shop.name"]) {
    assert.ok(src.includes(fragment), `${fragment} is gone from the drawer entirely`);
    assert.ok(
      guarded.includes(fragment),
      `${fragment} renders in panel mode, where the source draws no such chrome`
    );
  }
  // The backdrop stays in the markup for drawer mode; panel mode hides it in CSS instead.
  assert.match(
    read("assets/css/theme.css"),
    /\.header-drawer\.is-panel \.drawer-backdrop \{\s*@apply hidden;/
  );
});

test("the trigger toggles, and only an overlaying drawer locks the page", () => {
  const src = read("assets/js/components/header.js");
  const handler = src.match(/toggle-drawer[\s\S]*?addEventListener\("click",([\s\S]*?)\);/);

  assert.ok(handler, "no click handler on the drawer trigger");
  assert.doesNotMatch(
    handler[1],
    /toggleDrawer\(\s*(true|false)\s*\)/,
    "the trigger passes a constant, so it can open but never close"
  );
  assert.match(handler[1], /is-open/, "the next state is not read from the current one");
  assert.match(
    src,
    /if\s*\([^)]+\)\s*document\.body\.classList\.toggle\(\s*"overflow-hidden"/,
    "the scroll lock is unguarded, so a panel freezes a page it never covered"
  );
  assert.match(src, /const overlays = !drawer\.classList\.contains\("is-panel"\)/);
});

// A role field offers slot roles, a palette token and a raw colour, and all three must reach the
// element — moving the drawer render once dropped the slot arm, leaving six of nine enum values
// painting nothing, invisible while the transpiler only ever emitted `custom`. The resolution now
// lives in `role-color-value`, so what this guards is that every field REACHES it, with the slot
// arms asked for wherever the field paints through a custom property.
test("every header role field is resolved by the one resolver", () => {
  const src = read("sections/header.liquid");
  const fields = [...src.matchAll(/role:\s*s\.(\w+_role)\b/g)].map((m) => m[1]);

  assert.ok(fields.length >= 5, `only found ${fields.length} role fields reaching the resolver`);
  for (const field of new Set(fields)) {
    const call = src.match(new RegExp(`role:\\s*s\\.${field}\\b[\\s\\S]{0,220}?-%\\}`));
    assert.ok(call, `${field} names no resolver call`);
    const kind = field.includes("text") ? "text" : field.includes("border") ? "border" : "bg";
    assert.match(
      src,
      new RegExp(`kind: '${kind}',\\s*role: s\\.${field}\\b`),
      `${field} is passed as the wrong kind, so it would read the wrong variable family`
    );
  }
});

test("every header role field answers its slot arms one of the two ways", () => {
  // A slot role reaches an element as a `bg-*` / `text-*` / `border-*` CLASS, or as a value from the
  // resolver's opt-in slot arms. Neither, and most of that field's picker paints nothing. The field
  // list and its arms are the schema's own, and the class half is looked for in this section and the
  // snippets it renders — the drawer takes the raw role across that boundary and pushes the class there.
  const src = read("sections/header.liquid");
  const rendered = [...src.matchAll(/render '([\w-]+)'/g)].map((m) => `snippets/${m[1]}.liquid`);
  const scope =
    src +
    rendered
      .filter((f) => existsSync(join(root, f)))
      .map(read)
      .join("");
  const byId = new Map(schema("sections/header.liquid").settings.map((f) => [f.id, f]));
  const valueOnly = new Set(["none", "inherit", "palette", "custom", "gradient"]);

  const sites = [...src.matchAll(/render 'role-color-value',([\s\S]*?)-%\}/g)];
  assert.ok(sites.length >= 9, `only found ${sites.length} role fields reaching the resolver`);

  for (const [, args] of sites) {
    const field = args.match(/role:\s*s\.(\w+)/)[1];
    const kind = args.match(/kind:\s*'(\w+)'/)[1];
    const arms = (byId.get(field)?.options ?? [])
      .map((o) => o.value)
      .filter((v) => !valueOnly.has(v));
    if (!arms.length) continue;

    const asClass = new RegExp(`\\b${kind}-\\{\\{\\s*(?:s\\.)?${field}\\s*\\}\\}`);
    assert.ok(
      args.includes("slots: true") || asClass.test(scope),
      `${field} offers ${arms.length} slot roles that reach the element neither as a class nor as a value`
    );
  }
});

test("panel mode moves the bar's bottom inset onto the grid row", () => {
  const src = read("sections/header.liquid");
  const branch = src.match(
    /\{%\s*if s\.mobile_nav_mode == 'panel'\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/
  )[1];

  assert.match(branch, /assign bar_pb = ''/);
  assert.match(branch, /assign grid_pb = 'pb-\{\{ s\.padding_bottom \}\}'/);
  // The bar layer must consume the variable, not the setting, or the move is a no-op.
  assert.match(src, /\| push: bar_pb/);
  assert.match(src, /header-grid limit-width \{\{ grid_pb \}\}/);
});

test("the bar shares its free space instead of centring the middle group", () => {
  // `1fr auto 1fr` pins the middle to viewport centre whatever the sides weigh, which put every
  // brand's nav tens of px off its source: est 94, whitelabel 77, inka 27.
  const css = read("assets/css/theme.css");
  const rule = css.match(/\.header-section \.header-grid \{([^}]*)\}/)[1];

  assert.match(rule, /grid-template-columns:\s*auto auto auto/);
  assert.match(rule, /justify-content:\s*space-between/);
  assert.doesNotMatch(rule, /minmax\(0, ?1fr\)/);
});

test("nothing in the bar asserts spacing the source did not ask for", () => {
  const header = read("sections/header.liquid");
  const css = read("assets/css/theme.css");

  // A fixed margin on the logo padded it away from a centred nav; distribution spaces it now.
  assert.doesNotMatch(
    header,
    /class='mr-8[^']*header-logo-desktop|header-logo-desktop[^']*mr-8/,
    "the logo wrapper carries a hardcoded margin again"
  );
  // An empty group is still a flex item, so it spends a gap on nothing.
  assert.match(
    css,
    /\.header-actions:not\(:has\(\.header-actions-children > \*\)\)\s*\{\s*display: none;/,
    "an actions group with no children still consumes a gap"
  );
});

// A blank arg interpolated into a class renders the PREFIX alone (`pt-`), which matches no rule and
// reads as "no padding" — so a source stating one side would silently lose the others' meaning.
test("the drawer pushes a padding side only when that side is stated", () => {
  const src = read("snippets/header-drawer.liquid");
  for (const side of ["top", "right", "bottom", "left"]) {
    const short = side[0] === "b" ? "pb" : `p${side[0]}`;
    const push = new RegExp(`${short}-\\{\\{ drawer_pad_${side} \\}\\}`);
    assert.match(src, push, `the panel never pushes its ${side} inset`);
    const guarded = [
      ...src.matchAll(/\{%\s*if drawer_pad_(\w+) != blank\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g),
    ]
      .filter((m) => m[1] === side)
      .map((m) => m[2])
      .join("\n");
    assert.match(guarded, push, `${short}- is pushed outside its own != blank guard`);
  }
});

// Snippets are atomic — no `| default:` backfill — so an arg the section forgets renders as a
// half-written class, not as a fallback.
test("the header section hands the drawer every arg the drawer reads", () => {
  const snippet = read("snippets/header-drawer.liquid");
  const section = read("sections/header.liquid");
  const passed = new Set(
    [
      ...(section.match(/\{%\s*render 'header-drawer',([\s\S]*?)%\}/)?.[1] ?? "").matchAll(
        /(\w+):/g
      ),
    ].map((m) => m[1])
  );
  const reads = new Set([...snippet.matchAll(/\{\{\s*(\w+)/g)].map((m) => m[1]));
  for (const m of snippet.matchAll(/\{%\s*(?:if|unless|elsif)\s+(\w+)/g)) reads.add(m[1]);
  for (const m of snippet.matchAll(/\{%\s*for \w+ in (\w+)/g)) reads.add(m[1]);
  const locals = new Set(
    [...snippet.matchAll(/\{%-?\s*(?:assign|capture|for)\s+(\w+)/g)].map((m) => m[1])
  );

  assert.ok(passed.size && reads.size, "read no args at all — the render or the scan broke");
  assert.deepEqual(
    [...reads].filter((v) => !passed.has(v) && !locals.has(v) && v !== "forloop" && v !== "shop"),
    []
  );
});

// An element with `backdrop-filter` is a BACKDROP ROOT for its descendants, so a panel nested inside
// the frosted bar blurs nothing while still computing `blur(8px)` — invisible to any style read. An
// overlay must therefore render OUTSIDE the bar layer; a panel stays inside it, dropping in flow.
test("an overlay drawer renders outside the frosted bar, a panel inside it", () => {
  const src = read("sections/header.liquid");
  const bar = src.indexOf("{{ bg_layer_class_str }}");
  assert.ok(bar > 0, "the bar layer is gone from the header");
  const headerClose = src.lastIndexOf("</header>");
  const barClose = src.lastIndexOf("</div>", headerClose);
  assert.ok(bar < barClose && barClose < headerClose, "could not locate the bar's own close");

  const insideBar = src.slice(bar, barClose);
  const outsideBar = src.slice(barClose, headerClose);

  // The panel arm drops in flow, so it belongs to the bar; the overlay arm must escape it.
  assert.match(
    insideBar,
    /\{%\s*if s\.mobile_nav_mode == 'panel'\s*%\}\s*\{\{ drawer_html \}\}/,
    "panel mode must render in flow inside the bar"
  );
  assert.match(
    outsideBar,
    /\{%\s*unless s\.mobile_nav_mode == 'panel'\s*%\}\s*\{\{ drawer_html \}\}/,
    "an overlay rendered inside the bar inherits its backdrop root and cannot blur"
  );
  assert.doesNotMatch(
    insideBar,
    /\{%\s*unless s\.mobile_nav_mode == 'panel'\s*%\}\s*\{\{ drawer_html \}\}/,
    "the overlay arm is still inside the bar layer"
  );
});

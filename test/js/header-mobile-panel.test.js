// A panel is the source's own mobile nav dropped in flow, so it must not carry the drawer's chrome
// and must not be squeezed: the bar's bottom inset closes ABOVE it, a source divider rules every link
// but the last, and an action control never compresses below its content — the same invariant the
// cart and toggle already carry, without which a narrow bar wrapped a CTA's label onto two lines.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => readFileSync(join(root, p), "utf8");

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

test("the divider skips the last link, so the strip ends flush", () => {
  const src = read("blocks/_header-menu.liquid");
  const guard = src.match(/\{%\s*if forloop\.index0 == last_link\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/);

  assert.ok(guard, "the per-link divider is not guarded against the last link");
  assert.match(
    guard[1],
    /replace: 'group-border-custom-bottom'/,
    "the last link keeps the divider class it should be stripped of"
  );
  assert.match(src, /assign last_link = s\.nav\.links \| size \| minus: 1/);
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

// A role field offers slot roles, a palette token and a raw colour. Palette and custom resolve to a
// CSS value; a slot role resolves through its own variable and so must reach the element as a class
// (border) or a `var(--text-…)` (text). Moving the drawer render dropped the text one, leaving six of
// nine enum values painting nothing — invisible while the transpiler only ever emits `custom`.
test("every header role field handles its slot roles, not just palette and custom", () => {
  const src = read("sections/header.liquid");
  const roles = [...src.matchAll(/s\.(\w*text_role|\w*border_role) == 'palette'/g)].map(
    (m) => m[1]
  );

  assert.ok(roles.length >= 5, `only found ${roles.length} role resolutions to check`);
  for (const role of new Set(roles)) {
    // Liquid wraps long conditions across lines, so the terms are matched, not their layout.
    const slotArm = role.endsWith("text_role")
      ? new RegExp(`s\\.${role} != 'primary'`)
      : new RegExp(`s\\.${role} != 'custom'[\\s\\S]{0,80}s\\.${role} != 'palette'`);
    assert.match(src, slotArm, `${role} resolves palette/custom but drops its slot roles`);
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

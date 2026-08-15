// A nav link's box is the block's own settings, never a literal in the markup. A hardcoded
// `items-center` on the row OR on the link re-centres a link the source stretches, which lifts the
// current-page label above its siblings wherever that link is taller — an underline does exactly that.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const src = readFileSync(join(root, "blocks/_header-menu.liquid"), "utf8");

// Each element between the strip and the label, as the class text it ends up carrying. A bag is
// assembled from several `push` calls, so the whole assign chain is the unit — not one literal.
const classSources = () => {
  const out = { row: src.match(/<li class='([^']*)'/)[1] };
  for (const bag of ["link_classes", "active_classes"]) {
    const decl = src.match(new RegExp(`assign ${bag} = '([\\s\\S]*?)%\\}`));
    assert.ok(decl, `${bag} is gone`);
    out[bag] = decl[1];
  }
  return out;
};

test("nothing between the strip and the label pins the cross axis", () => {
  for (const [where, classes] of Object.entries(classSources())) {
    assert.doesNotMatch(classes, /\bitems-\w+/, `${where} hardcodes a cross-axis alignment`);
    assert.match(classes, /vertical-\{\{ s\.link_align \}\}/, `${where} ignores link_align`);
  }
});

test("a `vertical-*` class always ships its `direction-row` companion", () => {
  // Without it the rule never matches: theme.css scopes every arm to `.direction-row`.
  for (const [where, classes] of Object.entries(classSources())) {
    assert.match(classes, /direction-row/, `${where} has no direction-row companion`);
  }
  const css = readFileSync(join(root, "assets/css/theme.css"), "utf8");
  assert.match(css, /\.direction-row\.vertical-stretch \{\s*align-items: stretch;/);
});

test("the link radius is a setting, and both states claim it", () => {
  // A pill nav link had no home at all, so the current page's chip rendered square corners.
  assert.match(
    src,
    /push_if: 'rounded-custom', s\.border_radius_override[\s\S]*?assign link_class_str/
  );
  assert.match(
    src,
    /assign active_classes[\s\S]*?push_if: 'rounded-custom', s\.border_radius_override/
  );
  assert.match(src, /--radius-custom: \{\{ s\.border_radius \}\}px', s\.border_radius_override/);

  const schema = JSON.parse(src.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/)[1]);
  const byId = Object.fromEntries(schema.settings.filter((s) => s.id).map((s) => [s.id, s]));
  assert.equal(byId.border_radius_override.type, "checkbox");
  assert.equal(byId.border_radius.unit, "px");
  assert.equal(byId.border_radius.conditional, "setting.border_radius_override");
});

test("a bag with no declared paint is never swapped in", () => {
  // The drawer renders its own `_header-menu`, and it was given no bag at all — so the current link
  // took the SCHEMA defaults: no padding, no divider, a 20px stub where a 49px row belongs.
  assert.match(
    src,
    /\{% if s\.text_role_active != blank or s\.bg_role_active != blank or s\.link_border_role_active != blank %\}/
  );
  assert.match(src, /assign has_active_state = false/);
  const swap = src.match(/\{% if ([^%]*link\.link_id == page\.uuid)[^%]*%\}/);
  assert.ok(swap, "the current-page swap is gone");
  assert.match(swap[1], /has_active_state and/, "the swap does not check for a declared state");
});

test("the last link ends flush whichever bag it renders with", () => {
  // Stripping before the swap left a current LAST link carrying a divider its siblings' rule removes.
  const body = src.slice(src.indexOf("{% for link in s.nav.links %}"));
  const swapAt = body.indexOf("assign this_link_class = active_class_str");
  const stripAt = body.indexOf("replace: 'group-border-custom-bottom'");
  assert.ok(swapAt > 0 && stripAt > 0, "swap or strip is gone");
  assert.ok(stripAt > swapAt, "the divider is stripped before the active bag is chosen");
  assert.match(
    body.slice(stripAt - 200, stripAt + 80),
    /this_link_class \| replace/,
    "the strip rewrites the literal resting bag rather than the chosen one"
  );
});

test("a role that paints a colour is never also pushed as a class", () => {
  // `custom` and `palette` resolve to a VALUE the caller paints inline; only a slot role names a
  // class. Without the guard the current link carried a literal `bg-custom`, matching no rule at all.
  const pushes = [...src.matchAll(/push: '(?:bg|border)-\{\{ s\.(\w+) \}\}'/g)].map((m) => m[1]);

  assert.deepEqual(
    [...new Set(pushes)].sort(),
    ["bg_role_active", "border_role", "link_border_role", "link_border_role_active"],
    "the set of role fields pushed as a class changed — re-check each one's guard"
  );
  for (const role of new Set(pushes)) {
    // The guard may sit on the same `if` as the blank/none test or on its own; only the terms matter.
    const before = src.slice(
      0,
      src.indexOf(`push: 'bg-{{ s.${role} }}'`) + 1 ||
        src.indexOf(`push: 'border-{{ s.${role} }}'`) + 1
    );
    const guard = before.slice(before.lastIndexOf("{% if"));
    assert.ok(guard.includes(`s.${role} != 'custom'`), `${role} may be pushed as bg-custom`);
    assert.ok(guard.includes(`s.${role} != 'palette'`), `${role} may be pushed as bg-palette`);
  }
});

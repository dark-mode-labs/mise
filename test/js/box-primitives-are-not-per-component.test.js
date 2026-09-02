// A block that draws a BOX has to carry the box vocabulary, and two gaps shipped because it didn't:
// the menu cards declared no `effect`, so a source's `hover:border-…` was computed by the transpiler
// and then dropped as an invalid field — inexpressible on every brand; and no block could say "I may
// shrink past my content", which a flex/grid item needs because its automatic minimum is its content.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => readFileSync(join(root, p), "utf8");

function schema(file) {
  const m = read(file).match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  assert.ok(m, `${file} has no schema`);
  return JSON.parse(m[1]);
}

const ids = (file) => new Set((schema(file).settings ?? []).map((f) => f.id));

// Every block whose root is a card — found by what it RENDERS, so a new card variant is covered.
const CARDS = ["blocks/menu-card-compact.liquid", "blocks/menu-card-full.liquid"];

test("every menu card declares the effect field its box needs", () => {
  for (const file of CARDS) {
    assert.ok(ids(file).has("effect"), `${file} cannot express a hover`);
  }
});

test("every menu card actually renders the effects it declares", () => {
  // Declaring the field without the loop is the same silence, one layer further on.
  for (const file of CARDS) {
    assert.match(
      read(file),
      /\{%\s*for\s+ef_id\s+in\s+s\.effect\s*%\}/,
      `${file} declares effects and never pushes an ef- class`
    );
    assert.match(
      read(file),
      /push:\s*'ef-\{\{\s*ef_id\s*\}\}'/,
      `${file} pushes a malformed ef- class`
    );
  }
});

test("a card's effect field matches the group's, so one tier renders alike on both", () => {
  const group = (schema("blocks/group.liquid").settings ?? []).find((f) => f.id === "effect");
  for (const file of CARDS) {
    const own = (schema(file).settings ?? []).find((f) => f.id === "effect");
    assert.equal(own.type, group.type, `${file} effect is a different field type`);
    assert.deepEqual(own.default, group.default, `${file} effect defaults differently`);
  }
});

// A flex/grid item's automatic minimum is its CONTENT, so one nowrap child floors its whole track and
// starves its siblings. The width SCALE states that floor with its own flag — the same shape the
// height scale already uses — so no component gains a second min-width setting to contradict.
test("the width scale can state a floor, the way the height scale already does", () => {
  const schema = JSON.parse(readFileSync(join(root, "config/settings_schema.json"), "utf8"));
  const groups = [];
  (function walk(o) {
    if (Array.isArray(o)) return o.forEach(walk);
    if (o && typeof o === "object") {
      if (o.id === "container_scale" || o.id === "height_scale") groups.push(o);
      Object.values(o).forEach(walk);
    }
  })(schema);

  for (const id of ["container_scale", "height_scale"]) {
    const g = groups.find((x) => x.id === id);
    assert.ok(g, `${id} is not in the settings schema`);
    const flags = (g.settings ?? []).map((f) => f.id);
    assert.ok(flags.includes("floor"), `${id} tiers cannot declare themselves a floor`);
  }
});

test("a width tier that declares a floor renders min-width, not a width or a cap", () => {
  const src = read("snippets/theme_variables.liquid");
  const arm = src.match(/\{%\s*if c\[1\]\.settings\.floor\s*%\}([\s\S]{0,160}?)\{%\s*els/);
  assert.ok(arm, "the container_scale loop has no floor arm");
  assert.match(arm[1], /min-width:/, "a floor tier must render min-width");
  assert.doesNotMatch(
    arm[1],
    /--limit-width|(^|[^-])\bwidth:/,
    "a floor states a minimum only — capping or locking it defeats the growth it exists to allow"
  );
});

test("no component carries a second min-width setting beside the scale's", () => {
  // Two owners for one property is the drift shape: the scale is the only place a floor is stated.
  for (const f of ["blocks/group.liquid", ...CARDS]) {
    assert.equal(ids(f).has("min_width"), false, `${f} duplicates the scale's floor`);
    assert.equal(ids(f).has("shrink_content"), false, `${f} duplicates the scale's floor`);
  }
});

test("a floor tier states its minimum at every breakpoint it declares", () => {
  // A floor stated only at the base renders as a width above every breakpoint it declares.
  const src = read("snippets/theme_variables.liquid");
  const arms = [...src.matchAll(/\{%\s*if c\[1\]\.settings\.floor\s*%\}([\s\S]*?)\{%\s*els/g)].map(
    (m) => m[1]
  );
  assert.equal(arms.length, 2, "a floor is stated once for the base and once per breakpoint");
  assert.match(arms[1], /@media \(min-width:/, "the by-bp floor is not scoped to its breakpoint");
  for (const arm of arms) {
    assert.match(arm, /min-width:/);
    assert.doesNotMatch(arm, /--limit-width|(^|[^-])\bwidth:/, "a floor must not also cap or lock");
  }
});

test("a rail aligns its own label from a property, not a rule about rails", () => {
  // Where a rail sits its own label is the source's statement, not a default every rail inherits.
  const schema = JSON.parse(
    read("blocks/tab-group.liquid").match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/)[1]
  );
  const find = (o, id) => {
    if (Array.isArray(o)) return o.map((x) => find(x, id)).find(Boolean);
    if (o && typeof o === "object") {
      if (o.id === id) return o;
      return Object.values(o)
        .map((x) => find(x, id))
        .find(Boolean);
    }
  };
  const field = find(schema.settings, "chip_strip_vertical_align");
  assert.ok(field, "the strip cannot state where its label sits");
  assert.equal(
    field.subtype,
    "vertical_align",
    "a prefixed id needs its subtype to reach the editor"
  );
  assert.deepEqual(
    field.options.map((o) => o.value),
    ["top", "middle", "bottom", "baseline", "stretch"],
    "the strip invents a second alignment vocabulary"
  );
  assert.match(
    read("blocks/tab-group.liquid"),
    /'vertical-\{\{ s\.chip_strip_vertical_align \}\}'/,
    "the strip pushes its own class instead of the shared one"
  );
});

test("a prefixed field with a generic type names the subtype it renders by", () => {
  // A specific `type` resolves on its own; a bare `select` needs the subtype to find its control.
  const src = read("blocks/tab-group.liquid");
  const schema = JSON.parse(src.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/)[1]);
  const field = (function find(o) {
    if (Array.isArray(o)) return o.map(find).find(Boolean);
    if (o && typeof o === "object") {
      if (o.id === "chip_strip_vertical_align") return o;
      return Object.values(o).map(find).find(Boolean);
    }
  })(schema.settings);
  assert.equal(field.type, "select", "the field stopped being a generic select");
  assert.equal(
    field.subtype,
    "vertical_align",
    "a generic select needs its subtype to render right"
  );
});

test("the button's wrapper stretches it without stating a height", () => {
  // The wrapper carries margins and width; the button IS its content, so `align-items` stretches it.
  const src = read("blocks/button.liquid");
  assert.match(
    src,
    /push: 'flex width-\{\{ s\.width \}\} limit-width'/,
    "the wrapper is not a flex box"
  );
  const unconditional = src.match(/\{%\s*assign inner_classes_height = '([^']*)'\s*%\}\s*\{%\s*if/);
  assert.equal(unconditional, null, "the inner states a height before any height is asked for");
});

test("a floor survives the rule that lets a grown item shrink", () => {
  // The two-class shrink rule outranks a one-class floor tier and cancels it.
  const css = read("assets/css/theme.css");
  const rule = css.match(/\.group-block\.flex-1([^{]*)\{\s*min-width: 0;/);
  assert.ok(rule, "the shrink rule is gone; a floor tier may now be fighting something else");
  assert.match(rule[1], /:not\(\[class\*="width-minw-"\]\)/, "the shrink rule cancels every floor");
});

test("the chip strip renders the effects it declares", () => {
  // Declaring the field without the loop is silence: a sticky bar's backdrop blur never reached it.
  const src = read("blocks/tab-group.liquid");
  assert.match(
    src,
    /\{%\s*for ef_id in s\.chip_strip_effect\s*%\}/,
    "the strip declares effects it never applies"
  );
  assert.match(
    src,
    /chip_strip_classes \| push: 'ef-\{\{ ef_id \}\}'/,
    "the strip pushes a malformed ef- class"
  );
});

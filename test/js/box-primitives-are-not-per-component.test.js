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

// A tab pane's selected paint travels the same way its head's does: a state bag the controller
// applies on `setState`. A bag the template emits and the controller never reads is silent, and a
// border painted on the pane itself would draw a second box around the card it wraps.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => readFileSync(join(root, p), "utf8");

const body = (p) => read(p).split("{% schema %}")[0];
const schema = (p) =>
  JSON.parse(read(p).match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/)[1]);

const emitted = (src) =>
  new Set([...src.matchAll(/(data-tab-(?:in)?active-[\w-]+)=/g)].map((m) => m[1]));
const consumed = (src) =>
  new Set([...src.matchAll(/"(data-tab-(?:in)?active-[\w-]+)"/g)].map((m) => m[1]));

for (const [block, controller] of [
  ["blocks/_tab-head.liquid", "assets/js/components/tab-head.js"],
  ["blocks/_tab-content.liquid", "assets/js/components/tab-content.js"],
]) {
  test(`every state bag ${block} emits is one ${controller} applies`, () => {
    const bags = [...emitted(body(block))].sort();

    assert.ok(
      bags.length,
      `${block} emits no state bag at all — the selected state is unpaintable`
    );
    assert.deepEqual(bags, [...consumed(read(controller))].sort());
  });
}

test("a pane rebinds ONLY the base border var, and paints no border of its own", () => {
  const src = body("blocks/_tab-content.liquid");

  assert.match(src, /--border:/);
  assert.doesNotMatch(
    src,
    /--border-emphasis:/,
    "the pane rebinds the emphasis slot again — descendants reading it get the selected colour"
  );
  assert.equal(src.match(/group-border-|--border-width|border-style/g), null);
});

test("a pane's selected border resolves every arm of its own enum", () => {
  // An arm the body never compares against silently emits nothing for that half of the picker.
  const src = body("blocks/_tab-content.liquid");
  const field = schema("blocks/_tab-content.liquid").settings.find(
    (s) => s.id === "active_border_role"
  );
  const arms = field.options.map((o) => o.value).filter((v) => v !== "none");

  assert.ok(arms.length, "the picker offers no colour at all — the schema read has broken");
  assert.deepEqual(
    arms.filter((v) => !src.includes(`s.active_border_role == '${v}'`)),
    []
  );
});

test("a pane's selected effect rides the bag that only the selected state carries", () => {
  const src = body("blocks/_tab-content.liquid");
  const bag = src.match(/\{%\s*assign\s+(\w+)\s*=\s*\1[^%]*push:\s*'ef-\{\{ ef_id \}\}'/);

  assert.equal(bag[1], "active_state_classes");
});

test("both halves of the pair let the render name which tab starts selected", () => {
  // A visitor's own location has to lead, and only the render knows it — left to the schema the
  // FIRST tab wins whatever they chose. The pane needs its own because a page whose picker is
  // per-location artwork has no head to defer to.
  for (const block of ["blocks/_tab-head.liquid", "blocks/_tab-content.liquid"]) {
    const schema = JSON.parse(
      read(block).match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/)[1]
    );
    const field = schema.settings.find((f) => f.id === "default_tab_id");
    assert.ok(field, `${block}: no default_tab_id`);
    assert.equal(field.default, undefined, "blank must mean `the first`, so it takes no default");

    const src = body(block);
    const state = block.includes("head") ? "aria-selected" : "aria-expanded";
    const emitted = src.match(new RegExp(`${state}='([^']*)'`));
    assert.ok(emitted, `${block}: emits no ${state}`);
    assert.match(
      emitted[1],
      /s\.tab_id == s\.default_tab_id/,
      `${block}: ${state} does not compare the tab against the named default`
    );
  }
});

test("a pane never asserts selected when nothing named it", () => {
  // A `true` on every pane would paint them all; the head, when there is one, owns the state after.
  const src = body("blocks/_tab-content.liquid");
  const emitted = src.match(/aria-expanded='([^']*)'/)[1];

  assert.match(emitted, /s\.default_tab_id != blank/);
  assert.match(emitted, /\{%\s*else\s*%\}false/);
});

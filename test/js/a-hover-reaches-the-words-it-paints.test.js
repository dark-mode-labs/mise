import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (name) => readFileSync(join(root, "blocks", name), "utf8");

test("a footer link carries its colour and its link effect, and its label inherits", () => {
  const src = read("_nav-group.liquid");
  const bags = [...src.matchAll(/assign link_class = '([^']*)'/g)].map((m) => m[1]);
  assert.equal(
    bags.length,
    2,
    "the link's class is no longer built as one bag with an effect and one without"
  );
  for (const bag of bags) {
    assert.match(bag, /\{\{ link_color \}\}/, "the link no longer carries the words' colour");
  }
  assert.match(
    src,
    /assign link_class = '[^']*\{\{ link_effect_cls \}\}/,
    "the link effect is not on the link"
  );
  assert.match(
    src,
    /render 'typography',[\s\S]*?color_role: 'inherit'/,
    "the label states a colour of its own"
  );
  assert.match(src, /"id": "link_effect"/, "the footer list offers no link effect");
});

test("a group states the colour its own words inherit, beside its effect", () => {
  const src = read("group.liquid");
  assert.match(src, /render 'text-color-class', color_role: s\.text_role/);
  assert.match(
    src,
    /push: '--text: \{\{ text_value \}\}'/,
    "a custom or palette words colour paints nothing"
  );
  for (const id of ["text_role", "text_role_palette", "text_role_custom"]) {
    assert.match(src, new RegExp(`"id": "${id}"`), `${id} is not in the schema`);
  }
});

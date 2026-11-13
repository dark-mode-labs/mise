import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => readFileSync(join(root, p), "utf8");
const body = (p) => read(p).split("{% schema %}")[0];
const schema = (p) => JSON.parse(read(p).split("{% schema %}")[1].split("{% endschema %}")[0]);

test("a media mask rides the frame, so it moves with the frame's own effects", () => {
  const src = body("blocks/media.liquid");
  const frameStyles = src.split("{% assign block_styles = styles | join")[0];
  assert.match(frameStyles, /'mask-image: \{\{ s\.mask_image \}\}'/);
  assert.match(frameStyles, /'-webkit-mask-image: \{\{ s\.mask_image \}\}'/);
  assert.match(frameStyles, /when 'intersect' %\}\{% assign webkit_composite = 'source-in'/);
  assert.match(src, /<div\s+class='\{\{ block_classes \}\}'\s+style='\{\{ block_styles \}\}'/);
});

test("a button aligns its wrapped label's lines only when asked", () => {
  const src = body("blocks/button.liquid");
  assert.match(src, /\{% if s\.text_align != blank %\}.*'text-align-\{\{ s\.text_align \}\}'/);
  const field = schema("blocks/button.liquid").settings.find((f) => f.id === "text_align");
  assert.equal(field.default, "");
});

test("an action group that names itself is a button; one that does not stays a wrapper", () => {
  const src = body("blocks/group.liquid");
  const named = src
    .split("{% elsif s.trigger == 'action' and s.accessible_name != blank %}")[1]
    .split("{% else %}")[0];
  assert.match(named, /<button\s+type='button'/);
  assert.match(named, /aria-label='\{\{ s\.accessible_name \| escape \}\}'/);
  assert.match(named, /data-action='\{\{ s\.action \| escape \}\}'/);
  const wrapper = src
    .split("{% elsif s.trigger == 'action' and s.accessible_name != blank %}")[1]
    .split("{% else %}")[1];
  assert.match(wrapper, /<div\s/);
  assert.match(read("assets/css/theme.css"), /\.group-control \{\s*text-align: inherit;/);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const src = readFileSync(join(root, "blocks/media.liquid"), "utf8").split("{% schema %}")[0];

test("a frame effect turns the frame, and a picture effect moves the picture inside it", () => {
  const frame = src.split("{% assign block_classes = classes | join")[0];
  const picture = (src.match(/\{%\s*render 'media',([\s\S]*?)%\}/) || [])[1] || "";
  assert.match(
    src,
    /<div\s+class='\{\{ block_classes \}\}'/,
    "the frame's classes are not the outer box's"
  );
  assert.match(frame, /render 'effect-classes', ids: s\.frame_effect/);
  assert.doesNotMatch(frame, /ids: s\.effect\b/);
  assert.match(picture, /effect:\s*s\.effect\b/);
  assert.doesNotMatch(picture, /frame_effect/);
});

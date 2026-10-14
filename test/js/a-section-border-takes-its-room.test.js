import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const css = readFileSync(join(root, "assets/css/theme.css"), "utf8");
const sections = readdirSync(join(root, "sections"))
  .filter((f) => f.endsWith(".liquid"))
  .map((f) => [f, readFileSync(join(root, "sections", f), "utf8")]);

const ABSOLUTE = new Set(
  [...css.matchAll(/\.([\w-]+)\s*\{[^}]*position:\s*absolute/g)].map((m) => m[1])
);

function besideTheBorder(src) {
  const literal = (name) => (src.match(new RegExp(`assign ${name} = '([^']*)'`)) || [])[1] || "";
  const found = [];
  for (const m of src.matchAll(/class='([^']*\{\{ border_class_str \}\}[^']*)'/g)) found.push(m[1]);
  for (const m of src.matchAll(/assign (\w+) = ('[^']*'|\w+)([^%]*)%\}/g)) {
    if (!m[3].includes("border_class_str")) continue;
    found.push(m[2].startsWith("'") ? m[2].slice(1, -1) : literal(m[1]));
    found.push(...[...m[3].matchAll(/push:\s*'([^']*)'/g)].map((p) => p[1]));
  }
  return found.join(" ");
}

const classes = (text) =>
  text
    .replace(/\{\{[^}]*\}\}/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const states = (src, id) => new RegExp(`"id":\\s*"${id}"`).test(src.split("{% schema %}")[1] || "");

test("a section paints its border on a box in flow, so the border takes its room", () => {
  const bordered = sections.filter(([, src]) => classes(besideTheBorder(src)).length);
  assert.ok(
    bordered.length >= 6,
    `only ${bordered.length} bordered sections found; the scan is broken`
  );
  const outOfFlow = bordered.filter(([, src]) =>
    classes(besideTheBorder(src)).some((c) => ABSOLUTE.has(c))
  );
  assert.deepEqual(
    outOfFlow.map(([f]) => f),
    []
  );
});

test("a section's height rides the box that draws its border, so a min-height counts the border", () => {
  const sized = sections.filter(
    ([, src]) => states(src, "height") && states(src, "border_top") && besideTheBorder(src)
  );
  assert.ok(
    sized.length >= 2,
    `only ${sized.length} sections state a height and a border; the scan is broken`
  );
  assert.deepEqual(
    sized
      .filter(([, src]) => !/height-\{\{ s\.height \}\}/.test(besideTheBorder(src)))
      .map(([f]) => f),
    []
  );
});

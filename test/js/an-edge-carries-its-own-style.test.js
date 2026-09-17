// An edge class resolves `border-*-style: var(--border-style)` with NO fallback, so a component
// that draws edges and never writes that property computes `style: none`, which collapses the
// width to 0 — the border is absent, silently, with the payload reading correct. Measured in the
// live render: `bt-hairline` alone is `0px / none`, and with `--border-style: solid` it is `1px`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const EDGE_SNIPPET = "box-border-edges";
const STYLE_SNIPPET = "box-border-style";

function templates(dirs) {
  return dirs.flatMap((dir) =>
    readdirSync(join(root, dir))
      .filter((f) => f.endsWith(".liquid"))
      .map((f) => [`${dir}/${f}`, readFileSync(join(root, dir, f), "utf8")])
  );
}

const components = templates(["sections", "blocks"]);
// A template draws edges through the snippet or by spelling a class itself; both owe the style.
const drawsEdges = components.filter(
  ([, src]) => src.includes(`render '${EDGE_SNIPPET}'`) || /\bb[trbl]-(\{\{|[a-z0-9])/.test(src)
);

test("every component that draws edges also writes --border-style", () => {
  assert.ok(drawsEdges.length >= 15, `only ${drawsEdges.length} edge-drawing components found`);
  const silent = drawsEdges
    .filter(
      ([, src]) => !src.includes("--border-style") && !src.includes(`render '${STYLE_SNIPPET}'`)
    )
    .map(([path]) => path);

  assert.deepEqual(silent, [], "these draw edges whose style nothing sets, so they draw nothing");
});

test("the two halves are rendered in pairs, so every state carries its own", () => {
  // Two states render the pair twice; one style half would let the second inherit the first's.
  const count = (src, snippet) => (src.match(new RegExp(`render '${snippet}'`, "g")) || []).length;

  for (const [path, src] of drawsEdges) {
    const edges = count(src, EDGE_SNIPPET);
    const inline = (src.match(/push: '--border-style/g) || []).length;

    assert.equal(
      count(src, STYLE_SNIPPET) + inline,
      edges,
      `${path}: ${edges} edge renders against ${count(src, STYLE_SNIPPET) + inline} style halves`
    );
  }
});

test("the value half always states the style, because the edge classes have no fallback", () => {
  const src = readFileSync(join(root, "snippets", `${STYLE_SNIPPET}.liquid`), "utf8");
  const body = src.replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, "");
  const push = body.match(/push:\s*'--border-style[^']*'/);

  assert.ok(push, "box-border-style must push --border-style");
  assert.ok(
    !/\{%-?\s*(if|unless)[^%]*%\}[\s\S]*?push:\s*'--border-style/.test(body),
    "--border-style must not sit behind a condition: an edge with no style draws nothing"
  );
});

test("an edge class reads --border-style, so theme_variables must emit both halves per tier", () => {
  // Read as the ENGINE reads it: line layout is not the contract, `{{-` joins across a newline.
  const rendered = readFileSync(join(root, "snippets", "theme_variables.liquid"), "utf8")
    .replace(/\s*\{\{-/g, "{{")
    .replace(/-\}\}\s*/g, "}}")
    .replace(/\s+/g, " ");

  for (const [edge, side] of [
    ["bt", "top"],
    ["bb", "bottom"],
    ["bl", "left"],
    ["br", "right"],
  ]) {
    const tier = "{{ s[0] }}";
    const width = `border-${side}-width: var(--space-${tier});`;
    const style = `border-${side}-style: var(--border-style);`;

    assert.ok(
      rendered.includes(`.${edge}-${tier} { ${width} ${style} }`),
      `.${edge}- must emit exactly \`${width} ${style}\` — a width with no style draws nothing`
    );
  }
});

// An effect class has to ride the element whose paint it changes, and the class bag that carries
// the state it belongs to. A hover tier setting `border-color` is inert on a wrapper whose border
// lives one level down, and a tab head's per-state effect is inert in the always-on bag: TabHead
// rebuilds `className` from base + the active OR inactive bag, so only those two toggle.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => readFileSync(join(root, p), "utf8");

// The bag each `| push: 'ef-…'` / `| push: 'group-border-…'` line assigns into.
function bagsPushing(src, fragment) {
  const re = /\{%\s*assign\s+(\w+)\s*=\s*\1\b([\s\S]*?)%\}/g;
  return new Set([...src.matchAll(re)].filter((m) => m[2].includes(fragment)).map((m) => m[1]));
}

test("a button paints its border and its effect on the same element", () => {
  const src = read("blocks/button.liquid");

  assert.deepEqual([...bagsPushing(src, "ef-{{ ef_id }}")], ["inner_classes"]);
  assert.deepEqual([...bagsPushing(src, "group-border-{{ s.border_mode }}")], ["inner_classes"]);
});

test("a tab head's effects ride the bag of the state they belong to", () => {
  const src = read("blocks/_tab-head.liquid");
  const active = src.match(/\{%\s*for ef_id in s\.effect\s*%\}[\s\S]*?\{%\s*endfor\s*%\}/)[0];
  const inactive = src.match(
    /\{%\s*for ef_id in s\.effect_inactive\s*%\}[\s\S]*?\{%\s*endfor\s*%\}/
  )[0];

  assert.match(active, /active_state_classes/);
  assert.match(inactive, /inactive_state_classes/);
  // The always-on bag would apply one state's hover in both.
  assert.doesNotMatch(active + inactive, /=\s*classes\s*\|/);
});

test("a tab head's state background is class-consumed, never inline", () => {
  // `TabHead.setState` writes state styles to `el.style.cssText`, and an inline declaration beats
  // any class rule — so a background painted inline can never be overridden by a hover effect.
  const src = read("blocks/_tab-head.liquid");
  const tags = src.matchAll(/\{%-?\s*assign\s+(\w*state_styles)\s*=\s*\1\b([\s\S]*?)-?%\}/g);
  const stateStyles = [...tags].flatMap((m) =>
    [...m[2].matchAll(/push:\s*'([^']*)'/g)].map((d) => d[1])
  );

  assert.ok(stateStyles.length, "no state styles found — did the assembly change shape?");
  for (const decl of stateStyles) {
    assert.match(
      decl,
      /^--/,
      `state style '${decl}' is a plain property; a hover effect cannot win`
    );
  }
});

test("the state background variable and the class that reads it are pushed together", () => {
  const src = read("blocks/_tab-head.liquid");

  assert.equal((src.match(/--tab-bg:/g) || []).length, (src.match(/'tab-head-bg'/g) || []).length);
});

test("nothing paints a background layer above the tab head's own", () => {
  // An absolutely-positioned fill sits over the root's background and masks a hover effect. Each
  // condition is tested against the whole tag, so attribute order cannot hide one.
  const body = read("blocks/_tab-head.liquid").split("{% schema %}")[0];
  const layers = [...body.matchAll(/<(?:div|span)\b[^>]*>/g)]
    .map((m) => m[0])
    .filter((t) => /\babsolute\b/.test(t) && /\binset-0\b/.test(t) && /background/.test(t));

  assert.deepEqual(layers, []);
});

test("both tab-head effect fields are declared, or one state silently loses its hover", () => {
  const schema = JSON.parse(
    read("blocks/_tab-head.liquid").match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/)[1]
  );
  const effects = schema.settings.filter((s) => s.type === "effect").map((s) => s.id);

  assert.deepEqual(effects.sort(), ["effect", "effect_inactive"]);
});

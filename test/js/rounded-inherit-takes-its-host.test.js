// `.rounded-inherit` resolved to `var(--radius-custom, var(--radius-global))`. That variable INHERITS,
// so a card's 8px reached a background layer whose own host has no radius — a rounded photo inside a
// square box, on every brand. All three consumers are `absolute inset-0` layers filling their host.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const themeCss = readFileSync(join(root, "assets/css/theme.css"), "utf8");

test("rounded-inherit takes its HOST's radius, not an inherited variable", () => {
  const rule = themeCss.match(/\.rounded-inherit\s*\{([^}]*)\}/);
  assert.ok(rule, "rule present");
  assert.match(rule[1], /border-radius:\s*inherit/);
  assert.doesNotMatch(
    rule[1],
    /--radius-custom/,
    "--radius-custom inherits, so reading it here rounds a square host's layer"
  );
});

test("every consumer is a layer that FILLS its host, which is what inherit assumes", () => {
  // Every template in the repo, not a named list: a new consumer elsewhere is exactly what a
  // hardcoded file list cannot see, and `inherit` is only correct for a full-bleed layer.
  const consumers = [];
  for (const dir of ["blocks", "snippets", "sections", "layout"]) {
    const d = join(root, dir);
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d)) {
      if (!f.endsWith(".liquid")) continue;
      for (const line of readFileSync(join(d, f), "utf8").split("\n")) {
        if (line.includes("rounded-inherit")) consumers.push(`${dir}/${f}: ${line.trim()}`);
      }
    }
  }
  assert.ok(consumers.length >= 3, `expected the known consumers, found ${consumers.length}`);
  for (const c of consumers) {
    assert.match(c, /absolute inset-0/, `not a full-bleed layer: ${c}`);
  }
});

// Two header axes a source can author that the bar could not express, each guarded so switching one
// on never rewrites a store that leaves it alone: the grid balances its side tracks only when asked,
// and the cart takes per-side padding only when a side is set — an unset set emitting `p-none` would
// override the `p-2` every other store renders with.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => readFileSync(join(root, p), "utf8");

test("the balanced nav track is a setting, a class and a rule that agree", () => {
  const header = read("sections/header.liquid");
  const css = read("assets/css/theme.css");

  const field = JSON.parse(
    header.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/)[1]
  ).settings.find((f) => f.id === "nav_track");

  assert.ok(field, "no nav_track setting");
  assert.equal(field.default, "shared", "balanced must be opt-in, not the default");
  assert.match(
    header,
    /s\.nav_track == 'balanced'.*?nav-track-balanced/s,
    "the balanced class is not derived from the setting"
  );
  assert.doesNotMatch(
    header,
    /nav-track-shared/,
    "a `shared` class would rewrite every existing store's markup for a rule that does nothing"
  );
  assert.match(
    css,
    /\.header-grid\.nav-track-balanced\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto\s+minmax\(0,\s*1fr\)/,
    "the class the template emits paints no balanced track"
  );
});

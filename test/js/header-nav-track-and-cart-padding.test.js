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

test("cart padding reaches the button only when a side is set", () => {
  const header = read("sections/header.liquid");

  const settings = JSON.parse(
    header.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/)[1]
  ).settings;

  for (const side of ["top", "bottom", "left", "right"]) {
    const field = settings.find((f) => f.id === `cart_padding_${side}`);
    assert.ok(field, `no cart_padding_${side}`);
    assert.equal(field.default, "none", "an unset side must not paint over the `p-2` default");
  }
  // Every side must gate the flag, or a cart padded on one axis alone renders unpadded. Matched
  // across whitespace: `npm run build` reformats liquid, so anything line-anchored is a false red.
  for (const side of ["top", "bottom", "left", "right"]) {
    assert.match(
      header,
      new RegExp(`s\\.cart_padding_${side} == 'none'[\\s\\S]{0,60}?cart_has_padding = true`),
      `cart_padding_${side} does not set the flag`
    );
  }
  assert.match(
    header,
    /if cart_has_padding[\s\S]*?pt-\{\{ s\.cart_padding_top \}\}/,
    "the padding classes are not gated on the flag"
  );
  // The default path is what every store without cart padding renders; it must survive untouched.
  assert.match(
    header,
    /\{% else %\}\s*\{% assign cart_btn_class = cart_btn_class \| append: ' p-2 hover:opacity-70' %\}/,
    "the unpadded cart lost its p-2 default"
  );
});

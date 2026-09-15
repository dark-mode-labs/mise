// `.cart-count-badge` once declared the chip's whole look — font-family, font-size, font-weight,
// line-height, border, padding-inline, text-align. Every one of those outranked the transpiled value,
// because a block's own class and this rule tie on specificity and theme.css wins on source order.
// The tell was subtle: the chip centred its digit purely by `line-height` matching the box height, so
// the moment a source's real leading landed the digit slid to the top of the box.
//
// What belongs here is what a count chip IS — where it hangs off the cart, that it centres, how it
// collapses when empty — plus paint the block's own inline style can override. Anything else is a
// pre-conversion style, and a transpiler that cannot beat its own engine's defaults is pointless.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const css = readFileSync(join(root, "assets/css/theme.css"), "utf8");

const rule = () => {
  const m = css.match(/\.cart-count-badge\s*\{([^}]*)\}/);
  assert.ok(m, ".cart-count-badge has no rule at all");
  return m[1];
};

// Properties the cart-badge BLOCK states from the source. Declared here, the source loses.
const BLOCK_OWNED = [
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "border-width",
  "border-style",
  "border-color",
  "padding-inline",
  "padding-left",
  "padding-right",
  "text-align",
];

test("the badge rule declares nothing the block states from source", () => {
  const body = rule();

  for (const prop of BLOCK_OWNED) {
    assert.doesNotMatch(
      body,
      new RegExp(`(^|[;{\\s])${prop}\\s*:`),
      `${prop} is baked into .cart-count-badge, so a source stating it is overruled`
    );
  }
  // `border:` shorthand sets all three longhands at once and is the form that actually shipped.
  assert.doesNotMatch(
    body,
    /(^|[;{\s])border\s*:/,
    "the border shorthand is baked in, so a source's ring never reaches the chip"
  );
});

test("the badge rule still owns the chip's own structure", () => {
  const body = rule();

  for (const prop of ["position", "top", "right", "min-width", "height", "transition"]) {
    assert.match(
      body,
      new RegExp(`(^|[;{\\s])${prop}\\s*:`),
      `${prop} is what makes this a corner count chip; without it the block has no anchor`
    );
  }
  // A chip CENTRES its digit. Left to line-height it only looks centred while that equals the height.
  assert.match(body, /display\s*:\s*inline-flex/);
  assert.match(body, /align-items\s*:\s*center/);
  assert.match(body, /justify-content\s*:\s*center/);
});

test("the empty chip still collapses", () => {
  assert.match(css, /\.cart-count-badge\[data-empty\]\s*\{[^}]*opacity:\s*0/);
  assert.match(css, /\.cart-count-badge\[data-empty\]:has\(\[data-cart-count\]:not\(:empty\)\)/);
});

import { test } from "node:test";
import assert from "node:assert/strict";

const { computeScrollTarget, DEFAULT_SCROLL_OFFSET_PX } =
  await import("../../assets/js/lib/menu-spy-math.js");

test("computeScrollTarget: simple case with default offset", () => {
  // element at y=300 in viewport, page already scrolled 1000 → 300+1000-120
  assert.equal(computeScrollTarget(300, 1000), 1180);
});

test("computeScrollTarget: explicit offset overrides default", () => {
  assert.equal(computeScrollTarget(300, 1000, 50), 1250);
});

test("computeScrollTarget: zero offset", () => {
  assert.equal(computeScrollTarget(300, 1000, 0), 1300);
});

test("computeScrollTarget: never returns negative", () => {
  assert.equal(computeScrollTarget(0, 0, DEFAULT_SCROLL_OFFSET_PX), 0);
  assert.equal(computeScrollTarget(50, 0, 200), 0);
});

test("computeScrollTarget: handles non-finite inputs", () => {
  assert.equal(computeScrollTarget(NaN, 1000), 1000 - DEFAULT_SCROLL_OFFSET_PX);
  assert.equal(computeScrollTarget(300, NaN), Math.max(0, 300 - DEFAULT_SCROLL_OFFSET_PX));
});

test("DEFAULT_SCROLL_OFFSET_PX is 120 (matches the literal in original controller)", () => {
  assert.equal(DEFAULT_SCROLL_OFFSET_PX, 120);
});

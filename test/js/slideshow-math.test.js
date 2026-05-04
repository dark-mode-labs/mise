import { test } from "node:test";
import assert from "node:assert/strict";

const {
  computeExactSlideWidth,
  getPageCount,
  getCurrentPageFromIndex,
  getNextSlideIndex,
  getPrevSlideIndex,
  clampPageIndex,
} = await import("../../assets/js/lib/slideshow-math.js");

test("computeExactSlideWidth: 3 cols, no peek, no gap", () => {
  assert.equal(computeExactSlideWidth(900, 3, 0, 0), 300);
});

test("computeExactSlideWidth: 3 cols with 20px gaps (2 visible gaps)", () => {
  // 900 - 2*20 = 860; 860 / 3 = 286.666...
  assert.ok(Math.abs(computeExactSlideWidth(900, 3, 0, 20) - 286.666) < 0.01);
});

test("computeExactSlideWidth: with peek shows 3 visible gaps", () => {
  // peek > 0 → visibleGaps = cols (3); (900 - 3*20) / (3 + 0.15)
  const w = computeExactSlideWidth(900, 3, 0.15, 20);
  assert.ok(Math.abs(w - (900 - 60) / 3.15) < 0.01);
});

test("computeExactSlideWidth: clamps cols to >= 1", () => {
  assert.equal(computeExactSlideWidth(900, 0, 0, 0), 900);
  assert.equal(computeExactSlideWidth(900, -2, 0, 0), 900);
});

test("computeExactSlideWidth: tolerates non-finite inputs", () => {
  assert.equal(computeExactSlideWidth(NaN, 1, 0, 0), 0);
  assert.equal(computeExactSlideWidth(900, 1, NaN, NaN), 900);
});

test("getPageCount: ceiling division", () => {
  assert.equal(getPageCount(7, 3), 3);
  assert.equal(getPageCount(6, 3), 2);
  assert.equal(getPageCount(0, 3), 0);
});

test("getPageCount: clamps cols to 1", () => {
  assert.equal(getPageCount(5, 0), 5);
  assert.equal(getPageCount(5, -1), 5);
});

test("getCurrentPageFromIndex: integer floor div", () => {
  assert.equal(getCurrentPageFromIndex(0, 3), 0);
  assert.equal(getCurrentPageFromIndex(2, 3), 0);
  assert.equal(getCurrentPageFromIndex(3, 3), 1);
  assert.equal(getCurrentPageFromIndex(7, 3), 2);
});

test("getNextSlideIndex: advances by cols when room", () => {
  assert.equal(getNextSlideIndex(0, 3, 9, false), 3);
  assert.equal(getNextSlideIndex(3, 3, 9, false), 6);
});

test("getNextSlideIndex: stops at last page when not infinite", () => {
  // total=9, cols=3 → maxLeftIndex=6. From idx=6, next would overflow.
  assert.equal(getNextSlideIndex(6, 3, 9, false), null);
});

test("getNextSlideIndex: wraps to 0 when infinite", () => {
  assert.equal(getNextSlideIndex(6, 3, 9, true), 0);
});

test("getNextSlideIndex: empty list returns null/0 by mode", () => {
  assert.equal(getNextSlideIndex(0, 3, 0, false), null);
  assert.equal(getNextSlideIndex(0, 3, 0, true), 0);
});

test("getPrevSlideIndex: snaps to start of current page when mid-page", () => {
  assert.equal(getPrevSlideIndex(7, 3, 9, false), 6);
});

test("getPrevSlideIndex: steps back a full page when at page boundary", () => {
  assert.equal(getPrevSlideIndex(6, 3, 9, false), 3);
  assert.equal(getPrevSlideIndex(3, 3, 9, false), 0);
});

test("getPrevSlideIndex: returns null at start when not infinite", () => {
  assert.equal(getPrevSlideIndex(0, 3, 9, false), null);
});

test("getPrevSlideIndex: wraps to last slide when infinite", () => {
  assert.equal(getPrevSlideIndex(0, 3, 9, true), 8);
  assert.equal(getPrevSlideIndex(0, 3, 0, true), 0);
});

test("clampPageIndex: returns 0 for empty list", () => {
  assert.equal(clampPageIndex(5, 0), 0);
});

test("clampPageIndex: clamps to range", () => {
  assert.equal(clampPageIndex(-3, 5), 0);
  assert.equal(clampPageIndex(0, 5), 0);
  assert.equal(clampPageIndex(4, 5), 4);
  assert.equal(clampPageIndex(99, 5), 4);
});

import { test } from "node:test";
import assert from "node:assert/strict";

const { shouldBeTransparent, shouldHideHeader, evaluateHeaderState, TRANSPARENT_TOP_THRESHOLD } =
  await import("../../assets/js/lib/header-scroll.js");

test("shouldBeTransparent: null when transparency is disabled", () => {
  assert.equal(shouldBeTransparent(0, false), null);
  assert.equal(shouldBeTransparent(500, false), null);
});

test("shouldBeTransparent: true at top of page", () => {
  assert.equal(shouldBeTransparent(0, true), true);
  assert.equal(shouldBeTransparent(TRANSPARENT_TOP_THRESHOLD - 1, true), true);
});

test("shouldBeTransparent: false past the top threshold", () => {
  assert.equal(shouldBeTransparent(TRANSPARENT_TOP_THRESHOLD, true), false);
  assert.equal(shouldBeTransparent(500, true), false);
});

test("shouldHideHeader: null when sticky mode is not on_scroll_up", () => {
  assert.equal(shouldHideHeader(100, 50, 80, undefined), null);
  assert.equal(shouldHideHeader(100, 50, 80, "always"), null);
});

test("shouldHideHeader: true when scrolling down past header height", () => {
  assert.equal(shouldHideHeader(150, 100, 80, "on_scroll_up"), true);
});

test("shouldHideHeader: false when scrolling up", () => {
  assert.equal(shouldHideHeader(100, 150, 80, "on_scroll_up"), false);
});

test("shouldHideHeader: null while still inside the header height (no change)", () => {
  // y=50 is inside headerHeight=80 — header doesn't translate yet.
  assert.equal(shouldHideHeader(50, 30, 80, "on_scroll_up"), null);
});

test("shouldHideHeader: false on equal-y (treated as not scrolling down)", () => {
  assert.equal(shouldHideHeader(100, 100, 80, "on_scroll_up"), false);
});

test("evaluateHeaderState: ignores negative scrollY (overscroll)", () => {
  const out = evaluateHeaderState(
    { y: -5, prevY: 0, headerHeight: 80 },
    { sticky: "on_scroll_up", transparent: true }
  );
  assert.deepEqual(out, { transparent: null, hidden: null });
});

test("evaluateHeaderState: combines transparency + hide rules", () => {
  const out = evaluateHeaderState(
    { y: 200, prevY: 100, headerHeight: 80 },
    { sticky: "on_scroll_up", transparent: true }
  );
  assert.deepEqual(out, { transparent: false, hidden: true });
});

test("evaluateHeaderState: at top with transparent, scrolling up", () => {
  const out = evaluateHeaderState(
    { y: 5, prevY: 50, headerHeight: 80 },
    { sticky: "on_scroll_up", transparent: true }
  );
  assert.deepEqual(out, { transparent: true, hidden: false });
});

test("evaluateHeaderState: non-sticky non-transparent → all-null state", () => {
  const out = evaluateHeaderState(
    { y: 200, prevY: 100, headerHeight: 80 },
    { sticky: undefined, transparent: false }
  );
  assert.deepEqual(out, { transparent: null, hidden: null });
});

test("evaluateHeaderState: handles missing inputs gracefully", () => {
  assert.deepEqual(evaluateHeaderState(null, {}), {
    transparent: null,
    hidden: null,
  });
});

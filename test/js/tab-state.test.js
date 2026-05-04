import { test } from "node:test";
import assert from "node:assert/strict";

const { shouldBeActiveTab } = await import("../../assets/js/lib/tab-state.js");

test("explicitActive always wins", () => {
  assert.equal(
    shouldBeActiveTab({ explicitActive: true, anySiblingActive: true, isFirst: false }),
    true
  );
});

test("first sibling becomes active when nobody else is", () => {
  assert.equal(
    shouldBeActiveTab({ explicitActive: false, anySiblingActive: false, isFirst: true }),
    true
  );
});

test("non-first sibling stays inactive when nobody is active (only the first auto-activates)", () => {
  assert.equal(
    shouldBeActiveTab({ explicitActive: false, anySiblingActive: false, isFirst: false }),
    false
  );
});

test("not active when a sibling is already active", () => {
  assert.equal(
    shouldBeActiveTab({ explicitActive: false, anySiblingActive: true, isFirst: true }),
    false
  );
  assert.equal(
    shouldBeActiveTab({ explicitActive: false, anySiblingActive: true, isFirst: false }),
    false
  );
});

test("handles null/undefined defensively", () => {
  assert.equal(shouldBeActiveTab(null), false);
  assert.equal(shouldBeActiveTab(undefined), false);
});

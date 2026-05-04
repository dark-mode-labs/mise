import { test } from "node:test";
import assert from "node:assert/strict";

const { matchesSearch, matchesTags, isItemVisible, isFiltering } =
  await import("../../assets/js/lib/menu-filter-predicates.js");

const ITEM = {
  name: "spicy chicken sandwich",
  description: "fried chicken with chili crunch",
  tags: ["lunch", "spicy"],
};

test("matchesSearch: empty query matches everything", () => {
  assert.equal(matchesSearch(ITEM, ""), true);
  assert.equal(matchesSearch(ITEM, undefined), true);
});

test("matchesSearch: matches name substring", () => {
  assert.equal(matchesSearch(ITEM, "chicken"), true);
});

test("matchesSearch: matches description substring", () => {
  assert.equal(matchesSearch(ITEM, "chili"), true);
});

test("matchesSearch: no match returns false", () => {
  assert.equal(matchesSearch(ITEM, "tofu"), false);
});

test("matchesSearch: missing item fields don't crash", () => {
  assert.equal(matchesSearch({}, "x"), false);
  assert.equal(matchesSearch(null, "x"), false);
});

test("matchesTags: empty tag set matches everything", () => {
  assert.equal(matchesTags(ITEM, new Set()), true);
  assert.equal(matchesTags(ITEM, []), true);
});

test("matchesTags: AND semantics — every active tag must be present", () => {
  assert.equal(matchesTags(ITEM, new Set(["lunch"])), true);
  assert.equal(matchesTags(ITEM, new Set(["lunch", "spicy"])), true);
  assert.equal(matchesTags(ITEM, new Set(["lunch", "vegan"])), false);
});

test("matchesTags: accepts plain arrays as input", () => {
  assert.equal(matchesTags(ITEM, ["lunch", "spicy"]), true);
});

test("matchesTags: missing item.tags treated as []", () => {
  assert.equal(matchesTags({ name: "x" }, new Set(["lunch"])), false);
});

test("isItemVisible: combines search AND tags", () => {
  assert.equal(isItemVisible(ITEM, { search: "chicken", activeTags: new Set(["spicy"]) }), true);
  assert.equal(isItemVisible(ITEM, { search: "tofu", activeTags: new Set(["spicy"]) }), false);
  assert.equal(isItemVisible(ITEM, { search: "chicken", activeTags: new Set(["vegan"]) }), false);
});

test("isItemVisible: defaults missing state fields", () => {
  assert.equal(isItemVisible(ITEM, {}), true);
});

test("isFiltering: false for blank state", () => {
  assert.equal(isFiltering({ search: "", activeTags: new Set() }), false);
  assert.equal(isFiltering({}), false);
  assert.equal(isFiltering(null), false);
});

test("isFiltering: true when search has any chars", () => {
  assert.equal(isFiltering({ search: "x", activeTags: new Set() }), true);
});

test("isFiltering: true when any tag is active", () => {
  assert.equal(isFiltering({ search: "", activeTags: new Set(["spicy"]) }), true);
  assert.equal(isFiltering({ search: "", activeTags: ["spicy"] }), true);
});

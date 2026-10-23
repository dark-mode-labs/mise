import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

const declarationsFor = (css, selector) =>
  [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)]
    .filter((m) => m[1].split(",").some((s) => s.trim() === selector))
    .map((m) => m[2])
    .join("");

test("a capped height tier caps the box at every breakpoint, never fixes or floors it", () => {
  const vars = read("snippets/theme_variables.liquid");
  const arms = [...vars.matchAll(/settings\.cap %\}\s*([\s\S]*?)\{% else %\}/g)].map((m) => m[1]);

  assert.equal(arms.length, 2, "the base rule and the per-breakpoint rule each need a cap arm");
  for (const arm of arms) {
    assert.match(arm, /max-height:/);
    assert.doesNotMatch(arm, /(^|[^-])height:/, "a cap that also sets height fixes the box");
    assert.doesNotMatch(
      arm,
      /--tier-height/,
      "a section layout reads --tier-height as its min-height"
    );
  }
});

test("a scrolling column scrolls its own content", () => {
  assert.match(
    declarationsFor(read("assets/css/theme.css"), ".group-scroll-y"),
    /overflow-y: auto/
  );
  assert.match(read("blocks/group.liquid"), /push_if: 'group-scroll-y', s\.scroll_y/);
});

test("what a scrolling column holds keeps its own height, or there is nothing to scroll", () => {
  assert.match(
    declarationsFor(read("assets/css/theme.css"), ".group-scroll-y > *"),
    /flex-shrink: 0/,
    "a flex item shrinks by default, squashing the content it should scroll"
  );
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const css = readFileSync(join(root, "assets/css/theme.css"), "utf8");

const TRAPS = /(^|[;\s])(will-change|transform|filter|backdrop-filter|perspective|contain)\s*:/;
const SLIDES = /\[data-sticky="on_scroll_up"\]|\.-translate-y-full/;

const headerRulesThatTrap = () =>
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, , body]) => TRAPS.test(body))
    .flatMap(([, sel]) => sel.replace(/\/\*[\s\S]*?\*\//g, "").split(","))
    .map((s) => s.trim())
    .filter((s) => /\.header-section[^\s>+~]*$/.test(s));

test("a header that does not slide leaves a fixed child pinned to the viewport", () => {
  const rules = headerRulesThatTrap();
  assert.ok(rules.length > 0, "no header rule found; the selector scan is broken");
  assert.deepEqual(
    rules.filter((s) => !SLIDES.test(s)),
    []
  );
});

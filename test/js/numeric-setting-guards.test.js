// A numeric setting whose "unset" value is 0 cannot be guarded by a bare `{% if s.x %}`:
// Liquid treats 0 as truthy, so the guard passes and the template emits the zero. `cart_size`
// shipped that way — schema `info` said "0 = default icon-only sizing" while the header rendered
// `width: 0rem; height: 0rem` and collapsed the button on every brand that left it unset.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function templates() {
  return ["sections", "blocks"].flatMap((dir) =>
    readdirSync(join(root, dir))
      .filter((f) => f.endsWith(".liquid"))
      .map((f) => [`${dir}/${f}`, readFileSync(join(root, dir, f), "utf8")])
  );
}

// Settings whose schema default is a number — 0 among them is "unset", never "zero". An
// unparseable schema THROWS rather than yielding none: a silent skip shrinks the sweep's coverage
// while it still reports green.
function numericSettings(path, src) {
  const m = src.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!m) return { ids: [], body: src };
  let schema;
  try {
    schema = JSON.parse(m[1]);
  } catch (e) {
    throw new Error(`${path}: schema is not valid JSON — ${e.message}`);
  }
  const ids = (schema.settings || []).filter((s) => typeof s.default === "number").map((s) => s.id);
  return { ids, body: src.slice(0, m.index) };
}

// Every `and`/`or` term of every if/unless condition. Judged by SHAPE, not by position in the tag:
// a term that is bare `s.x` is a truthiness test wherever it sits, and `{% if a and s.x %}` reads 0
// as true exactly as `{% if s.x %}` does.
function conditionTerms(body) {
  const tags = body.matchAll(/\{%-?\s*(?:if|unless|elsif)\s+([^%]*?)-?%\}/g);
  return [...tags].flatMap((m) => m[1].split(/\s+(?:and|or)\s+/).map((t) => t.trim()));
}

test("no numeric setting is gated on bare truthiness", () => {
  const offenders = [];
  let swept = 0;
  for (const [path, src] of templates()) {
    const { ids, body } = numericSettings(path, src);
    swept += ids.length;
    const bare = new Set(ids.map((id) => `s.${id}`));
    for (const term of conditionTerms(body)) {
      if (bare.has(term)) offenders.push(`${path}: {% if ${term} %} — compare against 0`);
    }
  }
  assert.ok(swept > 0, "swept no numeric settings at all — the schema read has broken");
  assert.deepEqual(offenders, []);
});

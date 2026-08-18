// An image's candidates must be keyed to the LAID-OUT width, not the viewport.
//
// The sources were `<source media='(min-width: Npx)' srcset='<one url>'>` — art direction, not
// resolution switching. With no `w` descriptors a `sizes` attribute is inert, so the browser had no
// say and the width came from a hardcoded `bp_px * 2`: the item modal, 672px wide, requested 3072px.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const src = readFileSync(join(root, "snippets/media.liquid"), "utf8");

test("every srcset candidate carries a `w` descriptor", () => {
  const srcsets = [...src.matchAll(/srcset='([^']*)'/g)].map((m) => m[1]);
  assert.ok(srcsets.length, "no srcset is emitted at all");
  for (const s of srcsets) {
    assert.match(s, /\{\{\s*srcset_\w+\s*\}\}/, "srcset is not built from a candidate list");
  }
  for (const cap of ["srcset_desktop", "srcset_mobile"]) {
    const at = src.indexOf(`{% capture ${cap} %}`);
    assert.ok(at > 0, `${cap} is gone`);
    const block = src.slice(at, src.indexOf("{% endcapture %}", at));
    // Every emitted URL needs its own descriptor — one survivor is enough to fool a bare match.
    const urls = [...block.matchAll(/image_url:\s*width:/g)].length;
    const descriptors = [...block.matchAll(/\}\}\s*(?:\{\{[^}]*\}\}|\d+)w/g)].length;
    assert.equal(
      descriptors,
      urls,
      `${cap}: ${urls} candidate(s) but ${descriptors} w descriptor(s)`
    );
  }
});

test("a `sizes` accompanies every candidate list", () => {
  // Without it the browser assumes 100vw and picks the largest candidate on every element.
  for (const m of src.matchAll(/srcset='[^']*'/g)) {
    const tail = src.slice(src.indexOf(m[0]) + m[0].length, src.indexOf(m[0]) + m[0].length + 120);
    assert.match(tail, /sizes='\{\{\s*sizes_attr\s*\}\}'/, "a srcset ships without sizes");
  }
});

test("only a rem width tier becomes a px `sizes`", () => {
  // A structural tier's max_width is a PERCENTAGE, and Liquid coerces `'100%' | times: 16` by its
  // leading digits — so dropping the unit guard turned `fill` into a 1600px sizes on 13 elements.
  // A sizes that under-picks is worse than none: the browser fetches an image too small and blurs.
  const guard = src.match(/\{%\s*if width_max contains 'rem'\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/);
  assert.ok(guard, "the rem guard is gone — percentage tiers will coerce to a bogus px width");
  assert.match(guard[1], /remove: 'rem'\s*\|\s*times: 16/, "the rem value is not converted to px");

  const fallback = src.match(/assign sizes_attr = '([^']*)'/);
  assert.equal(
    fallback[1],
    "100vw",
    "the honest fallback for an unknown width is the full viewport"
  );
});

test("the width tier arrives as an argument, so every caller can narrow it", () => {
  // The derivation lived in `blocks/media.liquid`, leaving the six direct callers of this snippet
  // unable to reach it. One owner, one argument.
  assert.match(src, /settings\.container_scale\[width_tier\]/);
  const block = readFileSync(join(root, "blocks/media.liquid"), "utf8");
  assert.match(block, /width_tier: s\.width/, "the block no longer passes its own width tier");
  assert.doesNotMatch(block, /sizes_attr|media_sizes/, "the block re-derives sizes itself");
});

test("no image ships width/height attributes the platform never fills", () => {
  // They rendered as `width='' height=''` on every image.
  assert.doesNotMatch(src, /width='\{\{ src\.width \}\}'/);
  assert.doesNotMatch(src, /height='\{\{ src\.height \}\}'/);
});

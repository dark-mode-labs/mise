// `autoplay_speed` says how long a slide RESTS; nothing said how long the CHANGE takes, or what
// shape it has. Both rails always scrolled a side-by-side track, so a source that dissolves one
// photo into the next shipped as a sideways shove — a different motion, not a mistimed one.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => readFileSync(join(root, p), "utf8");

// The fade lives where a rail can TIME it: `carousel` carries an `effect` field, and the slideshow
// section does not — a motion it cannot state a duration for is one it must not offer.
const RAILS = ["blocks/carousel.liquid"];

function schema(file) {
  const m = read(file).match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  assert.ok(m, `${file} has no schema`);
  return JSON.parse(m[1]);
}

const field = (file, id) => (schema(file).settings ?? []).find((f) => f.id === id);

test("both rails can say how the change moves, and how long it takes", () => {
  for (const file of RAILS) {
    const style = field(file, "transition_style");
    assert.ok(style, `${file} cannot say whether it slides or fades`);
    assert.deepEqual(
      (style.options ?? []).map((o) => o.value).sort(),
      ["fade", "slide"],
      `${file} offers the wrong motions`
    );
    assert.equal(style.default, "slide", `${file} changed the motion every existing rail renders`);

    // The TIMING is not the rail's to state: duration and curve are the effect scale's vocabulary,
    // and a seconds field beside it is a second axis that cannot carry a curve at all.
    assert.equal(
      field(file, "transition_speed"),
      undefined,
      `${file} states a duration the effect scale already owns`
    );
    assert.ok(field(file, "effect"), `${file} has no effect field to time the fade with`);
  }
});

test("a fading rail drops the scroll rail's own classes rather than fighting them", () => {
  for (const file of RAILS) {
    const src = read(file);
    const fade = src.match(/track_classes\s*=\s*'slideshow-track slideshow-track-fade[^']*'/);
    assert.ok(fade, `${file} builds no fade track`);
    for (const cls of ["overflow-x-auto", "snap-x", "scroll-smooth", "cursor-grab"]) {
      assert.ok(
        !fade[0].includes(cls),
        `${file}'s fade track keeps \`${cls}\`, which a stacked rail must not scroll with`
      );
    }
  }
});

test("the track is one tag, not an opening tag split across a conditional", () => {
  // Branching around `<div ...>` leaves the tags unbalanced in the SOURCE: the closing tag belongs
  // to whichever branch ran, so a formatter, a tag matcher and a reader all lose the structure.
  for (const file of RAILS) {
    const body = read(file).split("{% schema %}")[0];
    assert.equal(
      (body.match(/<div\b/g) ?? []).length,
      (body.match(/<\/div>/g) ?? []).length,
      `${file} opens and closes a different number of divs`
    );
    assert.equal(
      (body.match(/class='\{\{ track_classes \}\}'/g) ?? []).length,
      1,
      `${file} renders the track from more than one tag`
    );
  }
});

test("the stacked track paints only the active slide, and lets only it be clicked", () => {
  const css = read("assets/css/theme.css");
  const block = css.match(/\.slideshow-track-fade\s*\{[^}]*\}/);
  assert.ok(block, "no fade-track rule");
  assert.match(block[0], /display:\s*grid/, "a fade track must STACK its slides, not lay them out");

  // The reduced-motion arm shares the selector, so the rule is picked by what it STATES.
  const slides = [
    ...css.matchAll(/\[data-behavior="slideshow"\] \.slideshow-track-fade > \*,[\s\S]{0,260}?\}/g),
  ]
    .map((m) => m[0])
    .find((r) => r.includes("grid-area"));
  assert.ok(slides, "no fade-slide rule");
  assert.match(slides, /grid-area:\s*1\s*\/\s*1/, "the slides do not share one cell");
  assert.match(slides, /opacity:\s*0/);
  assert.match(slides, /pointer-events:\s*none/, "a hidden slide still swallows clicks");

  // The dissolve itself is armed separately, once the rail is live — see the load test below.
  assert.match(
    css,
    /transition:\s*opacity var\(--ef-duration[^)]*\) var\(--ef-timing/,
    "the dissolve does not read the tier's own duration AND curve"
  );

  assert.match(
    css,
    /\.slideshow-track-fade > \.is-active[\s\S]{0,160}?opacity:\s*1/,
    "nothing raises the active slide"
  );
});

test("nothing dissolves IN on load — the first slide is up before the rail is live", () => {
  // The source ships slide one opaque. Ours is raised by the behaviour, and an opacity that CHANGES
  // in the same recalc that arms the transition animates: the hero dissolved in from its own dark
  // overlay on every page load, a fade the source never performs.
  const css = read("assets/css/theme.css");

  // Keyed on nothing being ACTIVE, not on the rail not being live: `scrollToIndex` bails when the
  // track reads empty and `data-loaded` is set anyway, and a `:not([data-loaded])` fallback then
  // leaves EVERY slide at 0 — the hero rendered as its own overlay and nothing else.
  assert.match(
    css,
    /\.slideshow-track-fade:not\(:has\(\.is-active\)\) > \*:first-child[\s\S]{0,240}?opacity:\s*1/,
    "no slide is raised when the behaviour raises none, so the hero can render blank"
  );
  assert.doesNotMatch(
    css,
    /:not\(\[data-loaded\]\) \.slideshow-track-fade > \*:first-child/,
    "the fallback is keyed on load rather than on nothing being active"
  );

  // And the transition itself may only exist once the rail is live.
  const armed = [
    ...css.matchAll(
      /\[data-behavior="slideshow"\]([^\s]*) \.slideshow-track-fade > \*[^{]*\{[^}]*\}/g
    ),
  ].filter((m) => /transition:\s*opacity/.test(m[0]));
  assert.ok(armed.length, "the dissolve is never armed at all");
  for (const rule of armed) {
    assert.match(
      rule[0],
      /\[data-loaded\]/,
      "the dissolve is armed before the rail is live, so the first raise animates"
    );
  }
});

test("a fade rail reads its position from the index, never from a scroll it does not have", () => {
  const js = read("assets/js/components/slideshow.js");

  assert.match(js, /this\.fade\s*=\s*[^\n]*slideshow-track-fade/, "fade mode is never detected");
  assert.match(
    js,
    /getCurrentIndex\(\)\s*\{\s*\n\s*if \(this\.fade\) return this\.index;/,
    "the index is not the position in fade mode — scrollLeft is always 0, so every slide reads as 0"
  );
  assert.match(
    js,
    /if \(this\.fade\) \{[\s\S]{0,200}?classList\.toggle\("is-active"/,
    "the move never swaps the active slide"
  );
  assert.match(js, /if \(!this\.fade\) this\.initDragPhysics\(\)/, "a stacked rail is dragged");

  // Both ends are read off scrollLeft for a rail; stacked, that reads "at the start" forever and
  // the next arrow is disabled on load.
  assert.match(js, /atStart = this\.fade \?/, "the start of a fade rail is read from scrollLeft");
  assert.match(js, /atEnd = this\.fade \?/, "the end of a fade rail is read from scrollLeft");
});

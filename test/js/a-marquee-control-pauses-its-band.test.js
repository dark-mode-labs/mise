import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const section = readFileSync(join(root, "sections/marquee.liquid"), "utf8");
const css = readFileSync(join(root, "assets/css/theme.css"), "utf8");

function fakeElement(attrs = {}) {
  const store = { ...attrs };
  return {
    store,
    dataset: {},
    setAttribute: (k, v) => {
      store[k] = String(v);
    },
    hasAttribute: (k) => k in store,
    toggleAttribute(k, on) {
      if (on) store[k] = "";
      else delete store[k];
    },
  };
}

function harness(actionArgs) {
  const label = { data: "❚❚" };
  const control = { ...fakeElement(), closest: () => control };
  control.dataset = actionArgs ? { actionArgs } : {};
  const band = fakeElement();
  let onClick;
  Object.assign(band, {
    querySelectorAll: () => [control],
    contains: (n) => n === control,
    addEventListener: (_type, fn) => {
      onClick = fn;
    },
  });
  globalThis.NodeFilter = { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_SKIP: 3 };
  globalThis.document = { createTreeWalker: () => ({ nextNode: () => label }) };
  return { band, control, label, click: () => onClick({ target: control }) };
}

test("pressing the band's control holds the track, says so, and shows the paused label", async () => {
  const { default: Marquee } = await import("../../assets/js/components/marquee.js");
  const h = harness("▶");
  new Marquee(h.band);
  assert.equal(h.control.store["aria-pressed"], "false");
  h.click();
  assert.ok(h.band.hasAttribute("data-paused"));
  assert.equal(h.control.store["aria-pressed"], "true");
  assert.equal(h.label.data, "▶");
  h.click();
  assert.ok(!h.band.hasAttribute("data-paused"));
  assert.equal(h.control.store["aria-pressed"], "false");
  assert.equal(h.label.data, "❚❚");
});

test("a control that carries no paused label keeps its own", async () => {
  const { default: Marquee } = await import("../../assets/js/components/marquee.js");
  const h = harness(null);
  new Marquee(h.band);
  h.click();
  assert.equal(h.label.data, "❚❚");
});

test("the band holds its control and loads the behaviour that answers it", () => {
  const body = section.split("{% schema %}")[0];
  assert.match(body, /data-behavior='marquee'/);
  assert.match(body, /\{% content_for 'blocks' %\}\s*<\/section>/);
  assert.match(css, /\.section-marquee\[data-paused\] \.marquee-track/);
});

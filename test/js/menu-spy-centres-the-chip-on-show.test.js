import { test } from "node:test";
import assert from "node:assert/strict";

const MenuSpy = (await import("../../assets/js/components/menu-spy.js")).default;

globalThis.document ??= { dispatchEvent() {} };

function head(tabId, left) {
  const shown = left !== null;
  return {
    dataset: { tabId },
    getAttribute: (name) => (name === "data-tab-group" ? "rail" : null),
    getClientRects: () => (shown ? [{}] : []),
    getBoundingClientRect: () =>
      shown
        ? { left, right: left + 80, top: 0, bottom: 40 }
        : { left: 0, right: 0, top: 0, bottom: 0 },
    classList: { add() {}, remove() {} },
  };
}

function strip(heads) {
  const scrolled = [];
  const nav = {
    scrollWidth: 1200,
    clientWidth: 375,
    scrollHeight: 40,
    clientHeight: 40,
    getBoundingClientRect: () => ({ left: 0, right: 375, top: 0, bottom: 40 }),
    querySelectorAll: (sel) => heads.filter((h) => sel.includes(`"${h.dataset.tabId}"`)),
    scrollBy: (opts) => scrolled.push(opts.left),
  };
  const spy = Object.create(MenuSpy.prototype);
  spy.nav = nav;
  spy.triggers = heads;
  return { spy, scrolled };
}

test("a phone slides its rail to the pill it shows, not to the sidebar head it hides", () => {
  const { spy, scrolled } = strip([head("pollo", null), head("pollo", 620)]);

  spy.activateTrigger("pollo");

  assert.deepEqual(scrolled, [660 - 187.5]);
});

test("a rail with one head per section still slides to it", () => {
  const { spy, scrolled } = strip([head("sopas", 500)]);

  spy.activateTrigger("sopas");

  assert.deepEqual(scrolled, [540 - 187.5]);
});

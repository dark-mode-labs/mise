// Effects are armed per inserted subtree, not once per document. A Turbo render or a Turbo Stream
// swaps in content whose effects start at `opacity: 0`; an element nobody observes never receives
// `animate`, so it simply stays invisible. Behaviors already re-bootstrap through the same
// MutationObserver — the effects half was the one that only ran at DOMContentLoaded.
import { test } from "node:test";
import assert from "node:assert/strict";

function element(className, { opacity = "0", animationName = "none" } = {}) {
  return {
    nodeType: 1,
    className,
    dataset: {},
    style: { opacity, animationName },
    matches(selector) {
      if (selector.includes("ef-")) return /(^|\s)ef-/.test(this.className);
      if (selector === "[data-behavior]") return Boolean(this.dataset.behavior);
      return false;
    },
    querySelectorAll: () => [],
  };
}

// Stands the module up against a DOM that starts empty, so anything observed came from an insert.
let observed = [];
let onDomLoaded;
let onMutation;

globalThis.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe(el) {
    observed.push(el);
  }
  unobserve() {}
};

globalThis.MutationObserver = class {
  constructor(callback) {
    onMutation = callback;
  }
  observe() {}
};

globalThis.getComputedStyle = (el) => el.style;

globalThis.document = {
  addEventListener: (type, fn) => {
    if (type === "DOMContentLoaded") onDomLoaded = fn;
  },
  querySelectorAll: () => [],
  documentElement: {},
};

await import("../../assets/js/theme.js");

// Re-running the load handler builds fresh observers, the way a new document would.
function boot() {
  observed = [];
  onDomLoaded();
  return { insert: (node) => onMutation([{ addedNodes: [node] }]) };
}

test("an effect swapped in after load is observed, or it never becomes visible", () => {
  const { insert } = boot();
  assert.deepEqual(observed, [], "the document starts empty; nothing to arm yet");

  const hero = element("ef-rise-in-1-d0_15-t28 group-block");
  insert(hero);

  assert.deepEqual(
    observed,
    [hero],
    "streamed content stays at opacity 0 unless something observes it"
  );
});

test("content already showing is left alone, so it cannot animate a second time", () => {
  const { insert } = boot();

  insert(element("ef-rise-in-1-d0_15-t28", { opacity: "1" }));
  insert(element("ef-held-ghc83d99", { opacity: "0", animationName: "rise-in" }));

  assert.deepEqual(
    observed,
    [],
    "only an element that is invisible AND unanimated is waiting on us"
  );
});

test("an insert carrying no effect arms nothing", () => {
  const { insert } = boot();

  insert(element("group-block flex"));

  assert.deepEqual(observed, []);
});

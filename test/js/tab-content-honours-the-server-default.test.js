// A pane's `default_tab_id` is resolved SERVER-side against real state (`request.location.uuid`),
// and `init` threw that away: with a matching head present it guessed "the first head in the group
// wins", so the selected location's card never took its paint. Two tab-groups in one section share
// `section.id`, so the location chips and the card panes are one group and the guess always fired —
// the same page worked wherever no chip strip existed, because then `myHead` was null and the
// `aria-expanded` branch ran. The server's answer outranks a head that names no `aria-selected`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const src = readFileSync(join(root, "assets/js/components/tab-content.js"), "utf8");

/** A DOM just big enough for TabContent: heads with no aria-selected, panes the server marked. */
function harness({ expandedIndex, heads = true, paneCount = 3 }) {
  const made = [];
  const el = (attrs, cls = "") => {
    const store = { ...attrs };
    const node = {
      className: cls,
      style: { cssText: "" },
      classList: { contains: (c) => cls.split(" ").includes(c) },
      parentElement: null,
      getAttribute: (k) => (k in store ? store[k] : null),
      setAttribute: (k, v) => {
        store[k] = String(v);
      },
      hasAttribute: (k) => k in store,
      _store: store,
    };
    made.push(node);
    return node;
  };
  const panes = Array.from({ length: paneCount }, (_, i) =>
    el(
      {
        "data-tab-id": `t${i}`,
        "data-tab-group": "g",
        "aria-expanded": i === expandedIndex ? "true" : "false",
        "data-tab-active-styles": "--border:#gold",
        "data-tab-active-class": "ef-glow",
      },
      "tab-content"
    )
  );
  // Panes are siblings under one region, which is the scope the server-default check reads.
  const region = { children: panes, classList: { contains: () => false } };
  panes.forEach((pane) => {
    pane.parentElement = region;
  });
  const headNodes = heads
    ? Array.from({ length: paneCount }, (_, i) =>
        el({ "data-tab-id": `t${i}`, "data-tab-group": "g", "data-behavior": "tab-head" })
      )
    : [];
  const doc = {
    querySelector(sel) {
      if (sel.includes("tab-head")) {
        const m = sel.match(/data-tab-id="([^"]+)"/);
        return m
          ? headNodes.find((h) => h.getAttribute("data-tab-id") === m[1]) || null
          : headNodes[0] || null;
      }
      return null;
    },
    querySelectorAll: (sel) => (sel.includes("tab-content") ? panes : headNodes),
    addEventListener() {},
  };
  return { panes, doc };
}

let loads = 0;

async function loadTabContent(doc) {
  // A FRESH module per case: `document` is closed over at import, and an identical data: URL is
  // module-cached — reusing it silently answered the second case from the first case's DOM.
  const tag = `__doc${++loads}`;
  globalThis[tag] = doc;
  const shim =
    `const document = globalThis.${tag};\n` +
    `${src.replace(/^export default /m, "")}\n` +
    `globalThis.__TabContent${loads} = TabContent;`;
  await import("data:text/javascript;base64," + Buffer.from(shim).toString("base64"));
  return globalThis[`__TabContent${loads}`];
}

test("the pane the server named wins over a head that declares no aria-selected", async () => {
  const { panes, doc } = harness({ expandedIndex: 2 });
  const TabContent = await loadTabContent(doc);
  panes.forEach((p) => new TabContent(p));
  const active = panes.map((p) => p.getAttribute("aria-expanded"));
  assert.deepEqual(
    active,
    ["false", "false", "true"],
    "the server marked pane 3, so pane 3 must be the one painted — a head's first-in-group guess " +
      "must not overrule `default_tab_id`"
  );
  assert.match(panes[2].style.cssText, /--border:#gold/, "the named pane took no active styles");
  assert.equal(
    panes[0].style.cssText.includes("--border:#gold"),
    false,
    "an unselected pane was painted"
  );
});

test("with no server default the first head still decides", async () => {
  const { panes, doc } = harness({ expandedIndex: -1 });
  const TabContent = await loadTabContent(doc);
  panes.forEach((p) => new TabContent(p));
  assert.equal(
    panes[0].getAttribute("aria-expanded"),
    "true",
    "nothing named a default, so the fallback must still pick the first"
  );
});

test("a nested group's outer default does not silence the inner panes", async () => {
  // inka's menu nests collection panes inside menu panes, and `section.id` gives BOTH levels the
  // same group id. Reading "did the server name a default" group-WIDE let the outer pane answer for
  // the inner ones: every inner pane reported false and the menu went blank until a chip was
  // re-clicked. The question is only ever about a pane's own siblings.
  const outer = harness({ expandedIndex: 0, paneCount: 2 });
  const inner = harness({ expandedIndex: -1, paneCount: 3 });
  const all = [...outer.panes, ...inner.panes];
  const doc = {
    querySelector: (sel) => outer.doc.querySelector(sel),
    querySelectorAll: (sel) => (sel.includes("tab-content") ? all : []),
    addEventListener() {},
  };
  const TabContent = await loadTabContent(doc);
  all.forEach((p) => new TabContent(p));
  assert.equal(
    inner.panes.some((p) => p.getAttribute("aria-expanded") === "true"),
    true,
    "no inner pane is active — the outer level's default answered for a group it does not belong to, " +
      "so the nested content renders blank until re-clicked"
  );
});

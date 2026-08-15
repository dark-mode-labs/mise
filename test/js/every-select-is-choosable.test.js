// Every `select` in every schema must offer options, and must not borrow another field's picker.
//
// The editor keys its rich pickers on `subtype || id` and each of them maps `options` — so a select
// declaring none threw and took the whole settings pane down (`toggle_border_size` did exactly that).
// A `subtype` is worse than useless here: those pickers also read the UNSUFFIXED companion settings,
// so `text_role_active` with `subtype: text_role` edits the RESTING link's colour.
//
// Scoped to every block and section, not to the one being worked on: the first fix swept only
// `_header-menu` and left the identical defect in `header.liquid`, from the same change.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function schemas() {
  const out = [];
  for (const dir of ["blocks", "sections"]) {
    for (const name of readdirSync(join(root, dir))) {
      if (!name.endsWith(".liquid")) continue;
      const src = readFileSync(join(root, dir, name), "utf8");
      const m = src.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
      if (!m) continue;
      let parsed;
      try {
        parsed = JSON.parse(m[1]);
      } catch {
        assert.fail(`${dir}/${name}: schema is not valid JSON`);
      }
      out.push([`${dir}/${name}`, (parsed.settings || []).filter((f) => f && f.id)]);
    }
  }
  return out;
}

test("a select always offers something to select", () => {
  const empty = [];
  for (const [file, fields] of schemas()) {
    for (const f of fields) {
      if (f.type === "select" && !(f.options || []).length) empty.push(`${file}:${f.id}`);
    }
  }
  assert.deepEqual(
    empty,
    [],
    "these render as an empty dropdown, or crash a picker that maps them"
  );
});

// A colour or size field must reach the SAME control its base does — the role/palette/swatch picker,
// not a bare dropdown. `subtype` is what routes it there, and the pickers key their companion
// settings on the field's own id, so `drawer_bg_role` edits `drawer_bg_role_custom`.
const CONCERNS = ["text_role", "bg_role", "border_role", "border_size"];

const variantOf = (id) =>
  CONCERNS.find((c) => id !== c && new RegExp(`^(\\w+_)?${c}(_active|_inactive)?$`).test(id));

// Variants that predate this rule and still render as a bare dropdown. The list may only SHRINK:
// converting one is a UI change to a working control, so it is done deliberately, not by a sweep.
const BARE_VARIANTS = new Set([
  "blocks/_tab-head.liquid:border_role_inactive",
  "blocks/_tab-head.liquid:text_role_inactive",
]);

test("a colour or size variant reaches the same picker its base does", () => {
  const bare = [];
  for (const [file, fields] of schemas()) {
    const ids = new Set(fields.map((f) => f.id));
    for (const f of fields) {
      const c = variantOf(f.id);
      // Only where the base concern is declared alongside it: a lone reduced-choice field is its own.
      if (c && ids.has(c) && f.type === "select" && f.subtype !== c) bare.push(`${file}:${f.id}`);
    }
  }
  const added = bare.filter((b) => !BARE_VARIANTS.has(b));
  assert.deepEqual(added, [], "new bare dropdowns where the colour control belongs");

  const fixed = [...BARE_VARIANTS].filter((b) => !bare.includes(b));
  assert.deepEqual(fixed, [], `these were converted — drop them from BARE_VARIANTS: ${fixed}`);
});

test("a state twin offers exactly what the state it overrides offers", () => {
  for (const [file, fields] of schemas()) {
    const byId = Object.fromEntries(fields.map((f) => [f.id, f]));
    const vals = (f) => (f?.options || []).map((o) => o.value);
    for (const f of fields) {
      const base =
        /_(active|inactive)$/.test(f.id) && byId[f.id.replace(/_(active|inactive)$/, "")];
      if (!base || base.type !== "select" || f.type !== "select") continue;
      assert.deepEqual(vals(f), vals(base), `${file}:${f.id} differs from ${base.id}`);
    }
  }
});

// `custom` / `palette` / `gradient` are not values in themselves — each names a COMPANION field that
// carries the actual colour or width. Offering one with no companion gives an author a dead choice;
// `cart_border_size` and `toggle_border_size` both did, from copying a base field's options wholesale.
// `border_mode`'s `custom` is the exception: it selects per-side flags, not a `<id>_custom` value.
// A state twin names its companion `<base>_custom_<state>`, not `<id>_custom`, so both are accepted.
const selectsSides = (id) => /(^|_)border_mode(_\w+)?$/.test(id);
const companionNames = (id, v) => {
  const m = id.match(/^(.*)_(active|inactive)$/);
  return m ? [`${id}_${v}`, `${m[1]}_${v}_${m[2]}`] : [`${id}_${v}`];
};

test("every option that names a companion field has one", () => {
  const dead = [];
  for (const [file, fields] of schemas()) {
    const ids = new Set(fields.map((f) => f.id));
    for (const f of fields) {
      if (f.type !== "select" || selectsSides(f.id)) continue;
      for (const v of ["palette", "custom", "gradient"]) {
        if (!(f.options || []).some((o) => o.value === v)) continue;
        const names = companionNames(f.id, v);
        if (!names.some((n) => ids.has(n)))
          dead.push(`${file}:${f.id} offers '${v}', no ${names[0]}`);
      }
    }
  }
  assert.deepEqual(dead, [], "these choices resolve to nothing");
});

// Pre-existing, and not safe to guess: `_nav-group.text_role` defaults to `button` while offering
// `on-button`. Either fixing the typo or falling back to `inherit` changes what existing blocks paint.
const ORPHANED_DEFAULTS = new Set(["blocks/_nav-group.liquid:text_role"]);

test("every select can still show the value it defaults to", () => {
  // Widening a field's options by copying a base's list dropped `none` from two cart fields, whose
  // default is `none` — the control would open on a value it could not display.
  const orphaned = [];
  for (const [file, fields] of schemas()) {
    for (const f of fields) {
      if (f.type !== "select" || !(f.options || []).length || f.default === undefined) continue;
      if (
        !f.options.some((o) => o.value === f.default) &&
        !ORPHANED_DEFAULTS.has(`${file}:${f.id}`)
      ) {
        orphaned.push(`${file}:${f.id} defaults to '${f.default}'`);
      }
    }
  }
  assert.deepEqual(orphaned, [], "these default to a value not in their own option list");
});

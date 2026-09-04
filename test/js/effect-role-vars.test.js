// A colour role resolves to a slot variable in `role-color-value`, and the .text-* / .bg-* /
// .border-* classes resolve the SAME roles in theme.css — two halves of one mapping, on either side
// of the class/value split. Assert they agree, and that every role the schema offers is painted.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(here, "../..", p), "utf8");

const css = read("assets/css/theme.css");
const resolver = read("snippets/role-color-value.liquid");
const schema = JSON.parse(read("config/settings_schema.json"));

// `.bg-surface { background: var(--surface); }` -> ["surface", "--surface"]
function classMap(prefix, property) {
  const re = new RegExp(
    `\\.${prefix}-([a-z0-9-]+)\\s*\\{\\s*${property}:\\s*var\\((--[a-z0-9-]+)`,
    "g"
  );
  return new Map([...css.matchAll(re)].map((m) => [m[1], m[2]]));
}

// One kind's arm of the resolver: `{%- when 'surface' -%}var(--surface…` -> ["surface", "--surface"]
function emissionMap(kind) {
  const arm = resolver.match(new RegExp(`slots and kind == '${kind}'[\\s\\S]*?\\{%-?\\s*endcase`));
  assert.ok(arm, `the resolver has no ${kind} arm`);
  const re = /\{%-?\s*when\s*'([a-z0-9-]+)'\s*-?%\}var\((--[a-z0-9-]+)/g;
  return new Map([...arm[0].matchAll(re)].map((m) => [m[1], m[2]]));
}

const CASES = [
  { role: "text", cssPrefix: "text", property: "color", kind: "text" },
  { role: "bg", cssPrefix: "bg", property: "background", kind: "bg" },
  { role: "border", cssPrefix: "border", property: "border-color", kind: "border" },
];

for (const { role, cssPrefix, property, kind } of CASES) {
  test(`${role} roles resolve to the same variable in the emission as in the classes`, () => {
    const fromCss = classMap(cssPrefix, property);
    const fromEmission = emissionMap(kind);

    assert.ok(fromEmission.size > 0, `no ${kind} slot mapping found in the resolver`);

    for (const [roleName, variable] of fromEmission) {
      assert.equal(
        fromCss.get(roleName),
        variable,
        `${cssPrefix}-${roleName} paints ${fromCss.get(roleName)} but the effect paints ${variable}`
      );
    }
  });
}

const effects = schema.schema.find((s) => s.id === "effect_scale");
const optionValues = (id) => effects.settings.find((f) => f.id === id).options.map((o) => o.value);

// Values the emission handles outside the slot map.
const NON_SLOT = new Set(["none", "inherit", "palette", "custom"]);

for (const { role, kind } of CASES) {
  test(`every ${role} role the editor offers is one the emission can paint`, () => {
    const painted = emissionMap(kind);
    for (const value of optionValues(`${role}_role`)) {
      assert.ok(
        NON_SLOT.has(value) || painted.has(value),
        `${role}_role offers "${value}" but nothing paints it`
      );
    }
  });
}

test("a hover value that reads a slot falls back to the property's own initial value", () => {
  // `color: var(--text)` paints NOTHING where the surface leaves that slot empty, so the rule has
  // to name what it means instead. A background is the exception: an unresolved `var()` there
  // computes to transparent, which is already "no paint".
  const emission = read("snippets/theme_variables.liquid");

  for (const [kind, initial] of [
    ["text", "currentColor"],
    ["border", "transparent"],
  ]) {
    const call = emission.match(new RegExp(`kind: '${kind}', role: ef\\.[\\s\\S]*?-%\\}`));
    assert.ok(call, `the hover emission resolves no ${kind} role`);
    assert.match(
      call[0],
      new RegExp(`fallback: '${initial}'`),
      `a ${kind} hover can paint nothing`
    );
  }
});

test("each role's palette and raw companions are gated on that role", () => {
  for (const { role } of CASES) {
    const palette = effects.settings.find((f) => f.id === `${role}_role_palette`);
    const custom = effects.settings.find((f) => f.id === `${role}_role_custom`);
    assert.equal(palette.type, "palette");
    assert.equal(custom.type, "color");
    assert.equal(palette.conditional, `setting.${role}_role == 'palette'`);
    assert.equal(custom.conditional, `setting.${role}_role == 'custom'`);
  }
});

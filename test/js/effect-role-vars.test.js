// The effects axis resolves a colour role to a slot variable in
// theme_variables.liquid; the .text-* / .bg-* / .border-* classes resolve the
// SAME roles in theme.css. Two copies of one mapping — assert they agree, and
// that every role the schema offers is one the emission can actually paint.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(here, "../..", p), "utf8");

const css = read("assets/css/theme.css");
const emission = read("snippets/theme_variables.liquid");
const schema = JSON.parse(read("config/settings_schema.json"));

// `.bg-surface { background: var(--surface); }` -> ["surface", "--surface"]
function classMap(prefix, property) {
  const re = new RegExp(
    `\\.${prefix}-([a-z0-9-]+)\\s*\\{\\s*${property}:\\s*var\\((--[a-z0-9-]+)`,
    "g"
  );
  return new Map([...css.matchAll(re)].map((m) => [m[1], m[2]]));
}

// `{% when 'surface' %} … {%- assign bg_var = '--surface' %}` -> ["surface", "--surface"]
function emissionMap(varName) {
  const re = new RegExp(
    `\\{%-?\\s*when\\s*'([a-z0-9-]+)'\\s*-?%\\}\\s*\\{%-?\\s*assign\\s+${varName}\\s*=\\s*'(--[a-z0-9-]+)'`,
    "g"
  );
  return new Map([...emission.matchAll(re)].map((m) => [m[1], m[2]]));
}

const CASES = [
  { role: "text", cssPrefix: "text", property: "color", liquidVar: "text_var" },
  { role: "bg", cssPrefix: "bg", property: "background", liquidVar: "bg_var" },
  { role: "border", cssPrefix: "border", property: "border-color", liquidVar: "border_var" },
];

for (const { role, cssPrefix, property, liquidVar } of CASES) {
  test(`${role} roles resolve to the same variable in the emission as in the classes`, () => {
    const fromCss = classMap(cssPrefix, property);
    const fromEmission = emissionMap(liquidVar);

    assert.ok(fromEmission.size > 0, `no ${liquidVar} mapping found in theme_variables.liquid`);

    for (const [roleName, variable] of fromEmission) {
      assert.equal(
        fromCss.get(roleName),
        variable,
        `${cssPrefix}-${roleName} paints ${fromCss.get(roleName)} but the effect paints ${variable}`
      );
    }
  });
}

const effects = schema.schema.find((s) => s.id === "transformation_scale");
const optionValues = (id) => effects.settings.find((f) => f.id === id).options.map((o) => o.value);

// Values the emission handles outside the slot map.
const NON_SLOT = new Set(["none", "inherit", "palette", "custom"]);

for (const { role, liquidVar } of CASES) {
  test(`every ${role} role the editor offers is one the emission can paint`, () => {
    const painted = emissionMap(liquidVar);
    for (const value of optionValues(`${role}_role`)) {
      assert.ok(
        NON_SLOT.has(value) || painted.has(value),
        `${role}_role offers "${value}" but nothing paints it`
      );
    }
  });
}

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

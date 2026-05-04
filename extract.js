const fs = require("fs");
const path = require("path");

const SCHEMA_REGEX = /{% schema %}([\s\S]*?){% endschema %}/;

function extractSchemasFromDir(dir) {
  const out = {};
  if (!fs.existsSync(dir)) return out;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".liquid")) continue;
    const content = fs.readFileSync(path.join(dir, file), "utf8");
    const match = SCHEMA_REGEX.exec(content);
    if (!match) continue;
    try {
      out[file] = JSON.parse(match[1]);
    } catch (e) {
      console.error(`extract: bad JSON in ${dir}/${file}: ${e.message}`);
    }
  }
  return out;
}

function extractSchemas(outFile = "dist/config/schemas.json") {
  const results = {
    global: null,
    sections: extractSchemasFromDir("sections"),
    blocks: extractSchemasFromDir("blocks"),
  };

  const settings = "config/settings_schema.json";
  if (fs.existsSync(settings)) {
    results.global = JSON.parse(fs.readFileSync(settings, "utf8"));
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log(
    `📋 Schemas: ${Object.keys(results.sections).length} sections, ${Object.keys(results.blocks).length} blocks → ${outFile}`
  );
}

module.exports = { extractSchemas };

if (require.main === module) {
  try {
    extractSchemas();
  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
  }
}

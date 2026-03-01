const fs = require('fs');
const path = require('path');

const schemaRegex = /{% schema %}([\s\S]*?){% endschema %}/;

const results = {
  global: null,
  sections: {},
  blocks: {}
};

try {
  // Config
  const configFile = 'config/settings_schema.json';
  if (fs.existsSync(configFile)) {
    console.log(`Processing ${configFile}...`);
    results.global = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  }

  // Sections
  const sectionsDir = 'sections';
  if (fs.existsSync(sectionsDir)) {
    fs.readdirSync(sectionsDir).forEach(file => {
      if (!file.endsWith('.liquid')) return;
      const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
      const match = schemaRegex.exec(content);
      if (match) {
        try {
          console.log(`Processing section: ${file}`);
          const schema = JSON.parse(match[1]);
          results.sections[file] = schema; // Key by filename for clarity
        } catch (e) {
          console.error(`Error parsing JSON in ${file}:`, e.message);
        }
      } else {
        console.warn(`No schema found in ${file}`);
      }
    });
  }

  // Blocks
  const blocksDir = 'blocks';
  if (fs.existsSync(blocksDir)) {
    fs.readdirSync(blocksDir).forEach(file => {
      if (!file.endsWith('.liquid')) return;
      const content = fs.readFileSync(path.join(blocksDir, file), 'utf8');
      const match = schemaRegex.exec(content);
      if (match) {
        try {
          console.log(`Processing block: ${file}`);
          const schema = JSON.parse(match[1]);
          results.blocks[file] = schema;
        } catch (e) {
          console.error(`Error parsing JSON in ${file}:`, e.message);
        }
      } else {
         console.warn(`No schema found in ${file}`);
      }
    });
  }

  // Write output
  fs.writeFileSync('all_schemas.json', JSON.stringify(results, null, 2));
  console.log('Extraction complete. Written to all_schemas.json');

} catch (err) {
  console.error('Fatal error:', err);
}

const esbuild = require('esbuild');
const importGlobPlugin = require('esbuild-plugin-import-glob').default;
const fs = require('fs-extra');
const chokidar = require('chokidar');
const { spawn } = require('child_process');
const path = require('path');

const isWatch = process.argv.includes('--watch');

// CONFIGURATION
const distDir = './dist';

const themeFolders = [
  'config', 'layout', 'sections', 'blocks', 'snippets', 'templates', 'locales'
];

async function build() {
  console.time('⚡ Build');

  // 1. Clean Dist
  if (!isWatch) {
    await fs.remove(distDir);
  }
  await fs.ensureDir(distDir);
  await fs.ensureDir(`${distDir}/assets`);

  // 2. Sync Theme Folders
  console.log('📂 Syncing theme folders...');
  for (const folder of themeFolders) {
    if (await fs.pathExists(folder)) {
      await fs.copy(folder, `${distDir}/${folder}`);
    }
  }

  // 3. Sync Static Assets
  console.log('🖼️  Syncing static assets...');
  if (await fs.pathExists('assets')) {
    await fs.copy('assets', `${distDir}/assets`, {
      filter: (src) => {
        const cleanSrc = src.replace(/\\/g, '/');
        return !cleanSrc.includes('assets/css') && !cleanSrc.includes('assets/js');
      }
    });
  }

  // 4. Bundle JS
  const jsEntry = 'assets/js/theme.js';
  if (await fs.pathExists(jsEntry)) {
    console.log('🔨 Bundling Javascript...');
    const ctx = await esbuild.context({
      entryPoints: [jsEntry],
      bundle: true,
      splitting: true,
      format: 'esm',
      outdir: `${distDir}/assets`,
      plugins: [
        importGlobPlugin()
      ],
      minify: !isWatch,
      sourcemap: isWatch,
      logLevel: 'info',
    });

    if (isWatch) await ctx.watch();
    else {
      await ctx.rebuild();
      await ctx.dispose();
    }
  } else {
    console.error(`⚠️  Missing JS Entry: ${jsEntry}`);
  }

  // 5. Compile CSS
  const cssEntry = 'assets/css/base.css';
  if (await fs.pathExists(cssEntry)) {
    console.log('🎨 Compiling Tailwind...');
    const tailwindArgs = [
      '-i', cssEntry,
      '-o', `${distDir}/assets/theme.css`,
      '--config', 'tailwind.config.js'
    ];
    if (isWatch) tailwindArgs.push('--watch');
    if (!isWatch) tailwindArgs.push('--minify');

    const tailwind = spawn('npx', ['tailwindcss', ...tailwindArgs], { 
      stdio: 'inherit', 
      shell: true 
    });
    
    tailwind.on('error', (err) => console.error('❌ Tailwind Error:', err));
  } else {
    console.error(`⚠️  Missing CSS Entry: ${cssEntry}`);
  }

  // 6. Watcher
  if (isWatch) {
    console.log('👀 Watching root files...');
    const watcher = chokidar.watch([
      ...themeFolders.map(f => `${f}/**/*.{liquid,json}`),
      'assets/**/*.{jpg,png,svg,woff,woff2}'
    ], { ignoreInitial: true });

    watcher.on('all', async (event, filePath) => {
      if (filePath.includes('assets/js') || filePath.includes('assets/css')) return;
      const dest = path.join(distDir, filePath);
      if (event === 'unlink') await fs.remove(dest);
      else await fs.copy(filePath, dest);
    });
  }
  
  console.timeEnd('⚡ Build');
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
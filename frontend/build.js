const esbuild = require('esbuild');
const fs = require('fs');

const isDev = process.argv.includes('--serve');

async function run() {
  const options = {
    entryPoints: ['src/index.jsx'],
    bundle: true,
    outfile: 'public/dist/app.js',
    format: 'esm',
    jsx: 'automatic',
    loader: { '.js': 'jsx', '.jsx': 'jsx', '.png': 'file', '.svg': 'file' },
    define: { 'process.env.NODE_ENV': isDev ? '"development"' : '"production"' },
    minify: !isDev,
    sourcemap: isDev,
  };

  if (isDev) {
    const context = await esbuild.context(options);
    await context.watch();
    let { host, port } = await context.serve({
      servedir: 'public',
      fallback: 'index.html',
      port: 3000,
    });
    console.log(`🚀 Serveur de développement lancé sur http://localhost:${port}`);
  } else {
    await esbuild.build(options);
    fs.copyFileSync('public/dist/app.js', 'public/dist/index.js');
    console.log('✅ Build terminé (app.js & index.js synchronisés sur le disque) !');
    process.exit(0);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

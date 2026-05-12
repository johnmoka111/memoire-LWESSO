const esbuild = require('esbuild');
const { join } = require('path');

const isDev = process.argv.includes('--serve');

async function run() {
  const context = await esbuild.context({
    entryPoints: ['src/index.jsx'],
    bundle: true,
    outfile: 'public/dist/index.js',
    format: 'esm',
    jsx: 'automatic',
    loader: { '.js': 'jsx', '.jsx': 'jsx', '.png': 'file', '.svg': 'file' },
    define: { 'process.env.NODE_ENV': isDev ? '"development"' : '"production"' },
    minify: !isDev,
    sourcemap: isDev,
  });

  if (isDev) {
    await context.watch();
    let { host, port } = await context.serve({
      servedir: 'public',
      fallback: 'index.html',
      port: 3000,
    });
    console.log(`🚀 Serveur de développement lancé sur http://localhost:${port}`);
  } else {
    await context.rebuild();
    console.log('✅ Build terminé !');
    process.exit(0);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

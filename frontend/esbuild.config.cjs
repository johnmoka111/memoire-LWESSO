const esbuild = require('esbuild');
const path = require('path');

const isDev = process.argv.includes('--dev');

async function run() {
  const context = await esbuild.context({
    entryPoints: [path.join(__dirname, 'src/main.tsx')],
    bundle: true,
    minify: !isDev,
    sourcemap: isDev,
    outfile: path.join(__dirname, 'public/bundle.js'),
    conditions: ['style'],
    define: {
      'process.env.NODE_ENV': isDev ? '"development"' : '"production"',
    },
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
      '.js': 'js',
      '.jsx': 'jsx',
      '.css': 'css',
      '.svg': 'file',
    },
    plugins: [],
  });

  if (isDev) {
    console.log('⚡ [esbuild] Démarrage du serveur de développement...');
    await context.watch();
    
    const { host, port } = await context.serve({
      servedir: 'public',
      port: 3001,
    });

    console.log(`🚀 [esbuild] Serveur lancé sur http://${host}:${port}`);
  } else {
    console.log('📦 [esbuild] Création du bundle de production...');
    await context.rebuild();
    await context.dispose();
    console.log('✅ [esbuild] Build terminé !');
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

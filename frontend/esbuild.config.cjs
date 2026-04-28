const esbuild = require('esbuild');
const path = require('path');
const http = require('http');
const fs = require('fs');

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
    jsx: 'automatic',
    plugins: [],
  });

  if (isDev) {
    console.log('⚡ [esbuild] Démarrage du serveur de développement...');
    await context.watch();

    // Serveur HTTP simple avec fallback SPA sur le port 3005
    const PORT = 3005;
    http.createServer((req, res) => {
      const publicDir = path.join(__dirname, 'public');
      let url = req.url === '/' ? '/index.html' : req.url;
      let filePath = path.join(publicDir, url);

      // Si le fichier n'existe pas, on renvoie index.html (SPA Fallback)
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(publicDir, 'index.html');
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Erreur serveur');
          return;
        }
        
        // Content-Type basique
        const ext = path.extname(filePath);
        const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
        res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
        res.end(data);
      });
    }).listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 [KivuMarket+] Serveur lancé sur http://localhost:${PORT}`);
    });

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

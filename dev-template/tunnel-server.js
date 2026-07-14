#!/usr/bin/env node
// ================================================================
//  BILIA-V4 — dev-template/tunnel-server.js
//  Serveur de développement + Tunnel sécurisé automatisé
//
//  Usage :
//    node tunnel-server.js              → mode DEV (watch + tunnel)
//    node tunnel-server.js --preview    → mode PREVIEW (tunnel seul)
//    node tunnel-server.js --publish    → mode PUBLISH (envoi au game-service)
//
//  Le tunnel utilise localtunnel (aucun compte requis).
//  Pour un tunnel plus stable, installez ngrok et mettez
//  BILIA_TUNNEL_PROVIDER=ngrok dans .env
// ================================================================

import { createServer }   from 'http';
import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, extname, resolve } from 'path';
import { fileURLToPath }  from 'url';
import express            from 'express';
import chokidar           from 'chokidar';
import { WebSocketServer } from 'ws';
import open               from 'open';
import chalk              from 'chalk';
import qrcode             from 'qrcode-terminal';
import localtunnel        from 'localtunnel';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const args      = process.argv.slice(2);
const MODE      = args.includes('--publish') ? 'publish'
                : args.includes('--preview') ? 'preview'
                : 'dev';

// ── Config ────────────────────────────────────────────────────────
const GAME_DIR       = resolve(__dirname, '.');
const GAME_PORT      = parseInt(process.env.BILIA_DEV_PORT  || '7000');
const GAME_SERVICE   = process.env.BILIA_GAME_SERVICE_URL   || 'http://localhost:5003';
const TUNNEL_SUBDOMAIN = process.env.BILIA_TUNNEL_SUBDOMAIN || `bilia-game-${Date.now().toString(36)}`;

// Lit le manifest du jeu
function readManifest() {
  const path = join(GAME_DIR, 'bilia.config.json');
  if (!existsSync(path)) {
    console.error(chalk.red(' bilia.config.json introuvable dans ce dossier.'));
    process.exit(1);
  }
  return JSON.parse(readFileSync(path, 'utf-8'));
}

// ── MIME types ────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.mp3':  'audio/mpeg',
  '.ogg':  'audio/ogg',
  '.wav':  'audio/wav',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
};

// ── Injection HMR dans le HTML ─────────────────────────────────────
const HMR_SCRIPT = `
<script>
  (function() {
    const ws = new WebSocket('ws://' + location.hostname + ':${GAME_PORT}/__hmr__');
    ws.onmessage = (e) => { if (e.data === 'reload') { console.log('[BILIA HMR] Rechargement...'); location.reload(); } };
    ws.onclose   = () => setTimeout(() => location.reload(), 1000);
    console.log('[BILIA DEV] Hot Reload actif ');
  })();
</script>
`;

// ── Serveur HTTP statique ─────────────────────────────────────────
const app = express();

// Headers CORS / sécurité dev
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy',   'same-origin');
  next();
});

// Route healthcheck (pour le game-service)
app.get('/__bilia_health__', (_req, res) => {
  const manifest = readManifest();
  res.json({ status: 'ok', game: manifest.gameId || manifest.name, version: manifest.version });
});

// Route info manifest
app.get('/__bilia_manifest__', (_req, res) => {
  res.json(readManifest());
});

// Serveur de fichiers statiques avec injection HMR
app.use((req, res) => {
  let filePath = join(GAME_DIR, req.path === '/' ? 'index.html' : req.path);

  // Fallback index.html (SPA)
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(GAME_DIR, 'index.html');
  }

  if (!existsSync(filePath)) {
    res.status(404).send('<h1>404 — Fichier introuvable</h1>');
    return;
  }

  const ext  = extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  res.setHeader('Content-Type', mime);

  // Injecter HMR uniquement en mode dev et dans les HTML
  if (MODE === 'dev' && ext === '.html') {
    let html = readFileSync(filePath, 'utf-8');
    html = html.replace('</body>', HMR_SCRIPT + '</body>');
    res.send(html);
  } else {
    res.sendFile(filePath);
  }
});

// ── Démarrage ─────────────────────────────────────────────────────
const httpServer = createServer(app);

// WebSocket HMR (mode dev seulement)
let wss = null;
if (MODE === 'dev') {
  wss = new WebSocketServer({ server: httpServer, path: '/__hmr__' });
  wss.on('connection', (ws) => {
    console.log(chalk.dim('[HMR] Client connecté'));
    ws.on('error', () => {});
  });
}

function broadcastReload() {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send('reload');
  });
}

// Watcher fichiers (mode dev)
if (MODE === 'dev') {
  const watcher = chokidar.watch([
    join(GAME_DIR, '**/*.html'),
    join(GAME_DIR, '**/*.js'),
    join(GAME_DIR, '**/*.mjs'),
    join(GAME_DIR, '**/*.css'),
    join(GAME_DIR, '**/*.json'),
  ], {
    ignored: /node_modules|dist|\\.git/,
    ignoreInitial: true,
  });

  watcher.on('change', (filePath) => {
    console.log(chalk.yellow(`\n Modifié : ${filePath.replace(GAME_DIR, '.')}`));
    broadcastReload();
  });

  watcher.on('add', (filePath) => {
    console.log(chalk.green(`\n Ajouté  : ${filePath.replace(GAME_DIR, '.')}`));
    broadcastReload();
  });
}

// ── Tunnel sécurisé ───────────────────────────────────────────────
async function startTunnel(port) {
  console.log(chalk.cyan('\n Ouverture du tunnel sécurisé...\n'));
  try {
    const tunnel = await localtunnel({
      port,
      subdomain: TUNNEL_SUBDOMAIN,
    });

    tunnel.on('close', () => {
      console.log(chalk.yellow('\n  Tunnel fermé. Redémarrez le serveur.'));
    });

    tunnel.on('error', (err) => {
      console.error(chalk.red('\n Erreur tunnel : ' + err.message));
      console.log(chalk.dim('   → Conseil : essayez BILIA_TUNNEL_SUBDOMAIN=un-autre-nom\n'));
    });

    return tunnel.url;
  } catch (err) {
    console.error(chalk.red(' Impossible d\'ouvrir le tunnel : ' + err.message));
    console.log(chalk.dim('   → Le jeu reste accessible localement.\n'));
    return null;
  }
}

// ── Publication vers game-service ────────────────────────────────
async function publishGame(tunnelUrl) {
  const manifest = readManifest();
  console.log(chalk.blue('\n Publication du jeu vers le game-service...\n'));

  try {
    const payload = {
      ...manifest,
      tunnelUrl,
      publishedAt: new Date().toISOString(),
    };

    const res = await fetch(`${GAME_SERVICE}/api/games/register-dev`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log(chalk.green('Jeu publié avec succès !'));
    console.log(chalk.dim(`   ID : ${data.gameId || manifest.gameId}`));
    return data;
  } catch (err) {
    console.log(chalk.yellow(`  game-service indisponible (${err.message})`));
    console.log(chalk.dim('   → Le jeu reste accessible via le tunnel.\n'));
    return null;
  }
}

// ── Banner de démarrage ────────────────────────────────────────────
function printBanner(manifest, localUrl, tunnelUrl) {
  const mode = MODE === 'dev' ? '🔧 DÉVELOPPEMENT' : MODE === 'preview' ? '👁️  PRÉVISUALISATION' : '📤 PUBLICATION';
  console.log('\n' + chalk.cyan('═'.repeat(58)));
  console.log(chalk.bold.cyan(`  BILIA DEV STUDIO — ${mode}`));
  console.log(chalk.cyan('═'.repeat(58)));
  console.log(chalk.white(`  Jeu     : ${chalk.yellow(manifest.name || manifest.gameId || 'Sans nom')}`));
  console.log(chalk.white(`  Version : ${manifest.version || '0.0.1'}`));
  console.log(chalk.cyan('─'.repeat(58)));
  console.log(chalk.white(`  Local   : ${chalk.green(localUrl)}`));
  if (tunnelUrl) {
    console.log(chalk.white(`  Tunnel  : ${chalk.green.bold(tunnelUrl)}`));
    console.log('');
    console.log(chalk.dim('  QR Code (accès mobile) :'));
    qrcode.generate(tunnelUrl, { small: true });
  }
  console.log(chalk.cyan('─'.repeat(58)));
  if (MODE === 'dev') {
    console.log(chalk.dim('  Hot Reload actif — Ctrl+C pour arrêter'));
  }
  console.log(chalk.cyan('═'.repeat(58)) + '\n');
}

// ── Main ──────────────────────────────────────────────────────────
httpServer.listen(GAME_PORT, async () => {
  const manifest  = readManifest();
  const localUrl  = `http://localhost:${GAME_PORT}`;
  const tunnelUrl = await startTunnel(GAME_PORT);

  printBanner(manifest, localUrl, tunnelUrl);

  if (MODE === 'dev') {
    // Ouvrir le navigateur automatiquement
    try { await open(localUrl); } catch {}
  }

  if (MODE === 'publish' && tunnelUrl) {
    await publishGame(tunnelUrl);
  }
});

#!/usr/bin/env node
// scripts/install-all.js
// Installe les dépendances dans chaque sous-projet séquentiellement.
// Compatible Windows, macOS et Linux.

const { execSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

const ROOT = path.resolve(__dirname, '..');

const PROJECTS = [
  'services/auth-service',
  'services/core-service',
  'services/game-service',
  'services/socket-service',
  'apps/child-pwa',
  'apps/parent-dashboard',
  'dev-template',
];

console.log('\n🚀 BILIA-V4 — Installation de toutes les dépendances\n');
console.log('='.repeat(55));

let success = 0;
let failed  = [];

for (const proj of PROJECTS) {
  const dir = path.join(ROOT, proj);
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Dossier introuvable, ignoré : ${proj}`);
    continue;
  }
  console.log(`\n📦 Installation dans : ${proj}`);
  console.log('-'.repeat(45));
  try {
    execSync('npm install', { cwd: dir, stdio: 'inherit' });
    console.log(`✅ ${proj} — OK`);
    success++;
  } catch (err) {
    console.error(`❌ ERREUR dans ${proj}`);
    failed.push(proj);
  }
}

// Installer concurrently à la racine
console.log('\n📦 Installation de concurrently à la racine...');
try {
  execSync('npm install', { cwd: ROOT, stdio: 'inherit' });
  console.log('✅ Racine — OK');
} catch (e) {
  console.error('❌ Erreur installation racine');
}

console.log('\n' + '='.repeat(55));
console.log(`\n✅ Succès : ${success}/${PROJECTS.length} projets`);
if (failed.length) {
  console.error(`❌ Échecs  : ${failed.join(', ')}`);
  process.exit(1);
} else {
  console.log('\n🎉 Tous les modules sont installés !');
  console.log('👉 Lance le projet avec : npm run demarrer:local\n');
}

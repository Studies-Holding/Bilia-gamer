#!/usr/bin/env node
// scripts/build-all.js  [services|apps|all]
const { execSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

const ROOT   = path.resolve(__dirname, '..');
const target = process.argv[2] || 'all';

const SERVICES = [
  'services/auth-service',
  'services/core-service',
  'services/game-service',
  'services/socket-service',
];
const APPS = [
  'apps/Bilia-Child',
  'apps/Bilia-Parent',
  'landing-page',
];

const list = target === 'services' ? SERVICES
           : target === 'apps'     ? APPS
           : [...SERVICES, ...APPS];

console.log(`\n BILIA — Build [${target}]\n`);
let failed = [];

for (const proj of list) {
  const dir = path.join(ROOT, proj);
  if (!fs.existsSync(dir)) { console.log(` Ignoré (absent): ${proj}`); continue; }
  if (!fs.existsSync(path.join(dir, 'package.json'))) { console.log(`⏭️  Ignoré (pas encore initialisé): ${proj}`); continue; }
  console.log(`\n🔨 Build : ${proj}`);
  try {
    execSync('npm run build', { cwd: dir, stdio: 'inherit' });
    console.log(`succès de  ${proj}`);
  } catch {
    console.error(`échec de  ${proj}`);
    failed.push(proj);
  }
}

if (failed.length) {
  console.error(`\n Échecs : ${failed.join(', ')}`);
  process.exit(1);
}
console.log('\n Build complet\n');

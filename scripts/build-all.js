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
  'apps/child-pwa',
  'apps/parent-dashboard',
];

const list = target === 'services' ? SERVICES
           : target === 'apps'     ? APPS
           : [...SERVICES, ...APPS];

console.log(`\n🔨 BILIA-V4 — Build [${target}]\n`);
let failed = [];

for (const proj of list) {
  const dir = path.join(ROOT, proj);
  if (!fs.existsSync(dir)) { console.log(`⚠️  Ignoré (absent): ${proj}`); continue; }
  console.log(`\n🔨 Build : ${proj}`);
  try {
    execSync('npm run build', { cwd: dir, stdio: 'inherit' });
    console.log(`✅ ${proj}`);
  } catch {
    console.error(`❌ ${proj}`);
    failed.push(proj);
  }
}

if (failed.length) {
  console.error(`\n❌ Échecs : ${failed.join(', ')}`);
  process.exit(1);
}
console.log('\n✅ Build complet\n');

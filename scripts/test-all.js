#!/usr/bin/env node
// scripts/test-all.js
// Lance `npm test` dans chaque module backend qui possède une suite Jest.
const { execSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

const ROOT = path.resolve(__dirname, '..');

const PROJECTS = [
  'shared',
  'services/auth-service',
  'services/core-service',
  'services/game-service',
  'services/socket-service',
];

console.log('\n BILIA-V4 — Exécution des tests\n');
console.log('='.repeat(55));

let failed = [];

for (const proj of PROJECTS) {
  const dir = path.join(ROOT, proj);
  if (!fs.existsSync(path.join(dir, 'package.json'))) {
    console.log(`  Pas de package.json, ignoré : ${proj}`);
    continue;
  }
  console.log(`\n Tests : ${proj}`);
  console.log('-'.repeat(45));
  try {
    execSync('npm test -- --ci', { cwd: dir, stdio: 'inherit' });
    console.log(` ${proj} — OK`);
  } catch {
    console.error(` ÉCHEC dans ${proj}`);
    failed.push(proj);
  }
}

console.log('\n' + '='.repeat(55));
if (failed.length) {
  console.error(`\n Modules en échec : ${failed.join(', ')}`);
  process.exit(1);
}
console.log('\n Tous les tests passent !\n');

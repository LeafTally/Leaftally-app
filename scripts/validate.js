#!/usr/bin/env node
// ============================================================
// LeafTally — pre-build validation
// Checks: duplicate builders, trial balance, missing panels
// ============================================================

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, '..', 'src', 'leaftally.html'), 'utf8');

let errors = 0;
let warnings = 0;

// 1. Duplicate panel IDs
const panelIds = [...src.matchAll(/id="p-(\w+)"/g)].map(m => m[1]);
const dupes = panelIds.filter((id, i) => panelIds.indexOf(id) !== i);
if (dupes.length) {
  console.error('✗ Duplicate panel IDs:', dupes);
  errors++;
} else {
  console.log('✓ Panel IDs: no duplicates');
}

// 2. Nav items without matching panels
const navIds  = [...src.matchAll(/nav\(this,'(\w+)'\)/g)].map(m => m[1]);
const missing = navIds.filter(id => !src.includes(`id="p-${id}"`));
if (missing.length) {
  console.error('✗ Nav items with no panel:', missing);
  errors++;
} else {
  console.log(`✓ Nav items: all ${navIds.length} have panels`);
}

// 3. Basic trial balance check (DR assets+expenses = CR liabilities+equity+income)
const accts = [...src.matchAll(/'(\d+)':\s*\{name:'([^']+)',\s*type:'([^']+)',\s*normal:'([^']+)',\s*balance:([-\d]+)/g)];
let dr = 0, cr = 0;
for (const [, , , type, , bal] of accts) {
  if (['Asset','Expense'].includes(type)) dr += parseInt(bal);
  else cr += Math.abs(parseInt(bal));
}
if (Math.abs(dr - cr) > 1) {
  console.error(`✗ Trial balance: DR ${dr.toLocaleString()} ≠ CR ${cr.toLocaleString()}`);
  errors++;
} else {
  console.log(`✓ Trial balance: DR ₦${dr.toLocaleString()} = CR ₦${cr.toLocaleString()}`);
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
if (errors > 0) process.exit(1);

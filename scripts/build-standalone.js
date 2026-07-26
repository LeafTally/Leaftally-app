#!/usr/bin/env node
// ============================================================
// LeafTally — Build standalone single-file HTML
// Usage: npm run build:standalone
// Output: dist/LeafTally_ERP.html
// ============================================================

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Read the pre-built monolith (kept as source-of-truth)
const src = readFileSync(join(ROOT, 'src', 'leaftally.html'), 'utf8');

mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'LeafTally_ERP.html'), src);

console.log('✓ Standalone build: dist/LeafTally_ERP.html');
console.log('  Deploy to Hostinger: upload dist/LeafTally_ERP.html as index.html');

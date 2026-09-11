import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {v406UiPolishDelta} from './v4-06-ui-polish-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'frontend/gewitterradar.js'), 'utf8');
const polished = v406UiPolishDelta(source);

assert.ok(polished.includes('V4.06 accepted UI polish: premium frame and symmetric action tiles.'));
assert.ok(polished.includes('@media(max-width:520px) and (orientation:portrait)'));
assert.ok(polished.includes('grid-template-columns:repeat(2,minmax(0,1fr))'));
assert.ok(polished.includes('.about-dialog summary:after{margin-right:22px}'));
assert.ok(polished.includes('.about-dialog summary:after{margin-right:18px}'));
assert.ok(polished.includes('@media(hover:none) and (pointer:coarse) and (min-width:700px) and (max-width:1100px)'));
assert.ok(polished.includes('.about-dedication-copy{transform:translateY(7px)}'));
assert.ok(polished.includes("' meiner Begeisterung für Technik,'"));
assert.ok(polished.includes("' Wetter und all den Ideen dazwischen'"));
assert.equal((polished.match(/V4\.06 accepted UI polish: premium frame and symmetric action tiles\./g) || []).length, 1);
assert.equal((polished.match(/V4\.06 accepted UI polish: About chevron spacing, iPad focus rendering, mobile dedication\./g) || []).length, 1);
assert.ok(polished.includes("const CARD_VERSION = '4.06';"));

console.log('PASS: accepted V4.06 UI polish applies once with mobile-portrait and touch-tablet guards.');

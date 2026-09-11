import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {v406ReleaseHistoryDelta} from './v4-06-release-history-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'frontend/gewitterradar.js'), 'utf8');
const output = v406ReleaseHistoryDelta(source);

const mustInclude = [
  'const BUILD_YYYY_MM = (() => {',
  '<span class="about-dev">${BUILD_YYYY_MM} · V${CARD_VERSION} · Gewitterradar · by CK</span>',
  '<div class="settings-footer-version" title="Kartenversion">${BUILD_YYYY_MM} · V${CARD_VERSION}</div>',
  '<span class="release-history-current">${BUILD_YYYY_MM} · V${CARD_VERSION}</span>',
  'V4.07 · PLANNED',
  'Worldwide location search',
  'V4.06 · 2026/09',
  'V4.05 · 2026/09',
  'V4.04 · 2026/09',
  'V4.03 · 2026/09',
  'V4.02 · 2026/09',
  'V4.01 · 2026/09',
  'V4.00 · 2026/09',
  'V3.997 · 2026/08',
  'V3.996 · 2026/08',
  'V3.994 · 2026/08',
  'V3.993 · 2026/08',
  'V3.98 · 2026/08',
  '15 languages plus 4 German dialect variants',
];
for (const needle of mustInclude) {
  if (!output.includes(needle)) throw new Error(`Missing final release-history marker: ${needle}`);
}

const mustExclude = [
  'V4.06 · Visual V2 · Gewitterradar · by CK',
  '<div class="release-history-version">V4.04</div>',
  '<div class="release-history-version">V3.98</div>',
];
for (const needle of mustExclude) {
  if (output.includes(needle)) throw new Error(`Obsolete release-history marker remains: ${needle}`);
}

if (v406ReleaseHistoryDelta(source) !== output) throw new Error('Release-history delta is not deterministic.');
console.log('V4.06 release/date/history delta assertions passed.');

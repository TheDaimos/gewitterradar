import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {v406UiPolishDelta} from './v4-06-ui-polish-delta.mjs';
import {v406UiPolishPass2Delta} from './v4-06-ui-polish-pass2-delta.mjs';
import {v406UiPolishPass3Delta} from './v4-06-ui-polish-pass3-delta.mjs';
import {v406UiPolishPass4Delta} from './v4-06-ui-polish-pass4-delta.mjs';
import {v406UiPolishPass5Delta} from './v4-06-ui-polish-pass5-delta.mjs';
import {v406ReleaseHistoryDelta} from './v4-06-release-history-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'frontend/gewitterradar.js'), 'utf8');
const stage1 = v406UiPolishDelta(source);
const stage2 = v406UiPolishPass2Delta(stage1);
const stage3 = v406UiPolishPass3Delta(stage2);
const stage4 = v406UiPolishPass4Delta(stage3);
const stage5 = v406UiPolishPass5Delta(stage4);
const output = v406ReleaseHistoryDelta(stage5);

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

let rejected = false;
try { v406ReleaseHistoryDelta(output); } catch { rejected = true; }
if (!rejected) throw new Error('Already-finalized release-history source must fail closed.');

console.log('V4.06 release/date/history delta assertions passed.');

import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {v406ReleaseHistoryDelta} from './v4-06-release-history-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
  'frontend/gewitterradar.js',
  'custom_components/gewitterradar/frontend/gewitterradar.js',
  'dashboard/dist/gewitterradar.js',
];

const inputs = await Promise.all(targets.map((relative) => readFile(resolve(root, relative), 'utf8')));
if (!inputs.every((value) => value === inputs[0])) {
  throw new Error('Frontend deliveries differ before release-history preview; aborting without writes.');
}
if (!inputs[0].includes('V4.06 pass5: final footer/version placement')) {
  throw new Error('V4.06 UI-polish pass5 must be applied before release-history metadata.');
}
if (inputs[0].includes('const BUILD_YYYY_MM')) {
  console.log('V4.06 release-history metadata preview is already applied; no files changed.');
  process.exit(0);
}

const output = v406ReleaseHistoryDelta(inputs[0]);
for (const relative of targets) await writeFile(resolve(root, relative), output, 'utf8');

console.log('Applied final V4.06 release/date/history metadata byte-identically to all three frontend deliveries.');
console.log('Current labels use YYYY/MM · Vx.xx; historical entries use Vx.xx · YYYY/MM.');
console.log('Release History now includes V4.05, the 15-language + 4-dialect scope, and planned V4.07 worldwide location search.');

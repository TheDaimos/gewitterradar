import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
import {v406UiPolishDelta} from './v4-06-ui-polish-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
  'frontend/gewitterradar.js',
  'custom_components/gewitterradar/frontend/gewitterradar.js',
  'dashboard/dist/gewitterradar.js',
];

const inputs = await Promise.all(targets.map((relative) => readFile(resolve(root, relative), 'utf8')));
if (!inputs.every((value) => value === inputs[0])) {
  throw new Error('Frontend deliveries differ before UI-polish preview; aborting without writes.');
}
if (inputs[0].includes('V4.06 accepted UI polish: premium frame and symmetric action tiles.')) {
  console.log('V4.06 UI-polish preview is already applied; no files changed.');
  process.exit(0);
}

const output = v406UiPolishDelta(inputs[0]);
for (const relative of targets) await writeFile(resolve(root, relative), output, 'utf8');

console.log('Applied V4.06 UI-polish preview byte-identically to all three frontend deliveries.');
console.log('Preview changes: premium Settings frame, symmetric tiles, About chevron inset, touch-tablet close focus fix, German mobile-portrait dedication flow.');
console.log('SHA256SUMS_FRONTEND.txt is intentionally not updated during visual preview.');

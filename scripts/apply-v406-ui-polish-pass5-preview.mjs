import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {v406UiPolishPass5Delta} from './v4-06-ui-polish-pass5-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
  'frontend/gewitterradar.js',
  'custom_components/gewitterradar/frontend/gewitterradar.js',
  'dashboard/dist/gewitterradar.js',
];

const inputs = await Promise.all(targets.map((relative) => readFile(resolve(root, relative), 'utf8')));
if (!inputs.every((value) => value === inputs[0])) {
  throw new Error('Frontend deliveries differ before UI-polish pass5 preview; aborting without writes.');
}
if (!inputs[0].includes('V4.06 pass4: keep programmatic dialog focus invisible')) {
  throw new Error('V4.06 UI-polish pass4 must be applied before pass5.');
}
if (inputs[0].includes('V4.06 pass5: final footer/version placement')) {
  console.log('V4.06 UI-polish pass5 preview is already applied; no files changed.');
  process.exit(0);
}

const output = v406UiPolishPass5Delta(inputs[0]);
for (const relative of targets) await writeFile(resolve(root, relative), output, 'utf8');

console.log('Applied V4.06 UI-polish pass5 byte-identically to all three frontend deliveries.');
console.log('Pass5 changes: enlarge/recenter Welcome signature, place compact version line below it, move Settings version to bottom-left, enlarge and vertically center the three radius value badges by 25%.');
console.log('SHA256SUMS_FRONTEND.txt is intentionally not updated during visual preview.');

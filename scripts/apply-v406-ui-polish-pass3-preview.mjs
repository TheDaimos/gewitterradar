import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {v406UiPolishPass3Delta} from './v4-06-ui-polish-pass3-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
  'frontend/gewitterradar.js',
  'custom_components/gewitterradar/frontend/gewitterradar.js',
  'dashboard/dist/gewitterradar.js',
];

const inputs = await Promise.all(targets.map((relative) => readFile(resolve(root, relative), 'utf8')));
if (!inputs.every((value) => value === inputs[0])) {
  throw new Error('Frontend deliveries differ before UI-polish pass3 preview; aborting without writes.');
}
if (!inputs[0].includes('V4.06 pass2: Welcome-derived 2px metal frame')) {
  throw new Error('V4.06 UI-polish pass2 must be applied before pass3.');
}
if (inputs[0].includes("V4.06 pass3: suppress WebKit's reopen focus frame")) {
  console.log('V4.06 UI-polish pass3 preview is already applied; no files changed.');
  process.exit(0);
}

const output = v406UiPolishPass3Delta(inputs[0]);
for (const relative of targets) await writeFile(resolve(root, relative), output, 'utf8');

console.log('Applied V4.06 UI-polish pass3 byte-identically to all three frontend deliveries.');
console.log('Pass3 changes: iPad/iPad Pro Settings -> About reopen focuses the dialog instead of the premium close button and suppresses WebKit focus chrome.');
console.log('SHA256SUMS_FRONTEND.txt is intentionally not updated during visual preview.');

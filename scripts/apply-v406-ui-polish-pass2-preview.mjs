import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {v406UiPolishPass2Delta} from './v4-06-ui-polish-pass2-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
  'frontend/gewitterradar.js',
  'custom_components/gewitterradar/frontend/gewitterradar.js',
  'dashboard/dist/gewitterradar.js',
];

const inputs = await Promise.all(targets.map((relative) => readFile(resolve(root, relative), 'utf8')));
if (!inputs.every((value) => value === inputs[0])) {
  throw new Error('Frontend deliveries differ before UI-polish pass2 preview; aborting without writes.');
}
if (!inputs[0].includes('V4.06 accepted UI polish: premium frame and symmetric action tiles.')) {
  throw new Error('V4.06 UI-polish pass1 must be applied before pass2.');
}
if (inputs[0].includes('V4.06 pass2: Welcome-derived 2px metal frame')) {
  console.log('V4.06 UI-polish pass2 preview is already applied; no files changed.');
  process.exit(0);
}

const output = v406UiPolishPass2Delta(inputs[0]);
for (const relative of targets) await writeFile(resolve(root, relative), output, 'utf8');

console.log('Applied V4.06 UI-polish pass2 byte-identically to all three frontend deliveries.');
console.log('Pass2 changes: stronger Welcome-derived frames, exact Welcome gear in Mainview and Help, reduced diffuse gold shadow.');
console.log('SHA256SUMS_FRONTEND.txt is intentionally not updated during visual preview.');

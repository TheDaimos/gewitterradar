#!/usr/bin/env node

import { readFile, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(scriptDir, 'build-v40802-diagnostic-weather-lab.mjs');
const runtime = path.join(scriptDir, '.build-v40802-diagnostic-weather-lab.runtime.mjs');

let text = await readFile(source, 'utf8');
const bad = "remaining=\\`${Math.max(0,(timeout-(Date.now()-this._statusClusterBrowseLastInteraction))/1000).toFixed(1)} s\\`;";
const good = "remaining=\\`\\${Math.max(0,(timeout-(Date.now()-this._statusClusterBrowseLastInteraction))/1000).toFixed(1)} s\\`;";

const occurrences = text.split(bad).length - 1;
if (occurrences !== 1) {
  throw new Error(`V4.08.02 guarded runner expected exactly one known template escape issue, found ${occurrences}`);
}
text = text.replace(bad, good);

await writeFile(runtime, text, 'utf8');
try {
  await import(`${pathToFileURL(runtime).href}?v=${Date.now()}`);
} finally {
  await unlink(runtime).catch(() => {});
}

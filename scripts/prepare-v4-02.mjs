import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source401Path = resolve(projectRoot, 'gewitterradar-card-v4_01.js');
const source402JsPath = resolve(projectRoot, 'gewitterradar-card-v4_02.js');
const source402TxtPath = resolve(projectRoot, 'gewitterradar-card-v4_02.txt');
const distPath = resolve(projectRoot, 'dist', 'gewitterradar.js');

let source = await readFile(source401Path, 'utf8');

function replaceExactly(input, from, to, expected = 1) {
  const count = input.split(from).length - 1;
  if (count !== expected) {
    throw new Error(`Expected ${expected} occurrence(s) of ${JSON.stringify(from)}, found ${count}.`);
  }
  return input.replaceAll(from, to);
}

source = replaceExactly(
  source,
  '/* Gewitterradar Card V4.01 – konservatives Asset-Optimierungsrelease auf Basis des eingefrorenen V4.00-Stands.',
  '/* Gewitterradar Card V4.02 – HACS-Paketierungsfix auf Basis des eingefrorenen V4.01-Stands.'
);
source = replaceExactly(source, "const CARD_VERSION = '4.01';", "const CARD_VERSION = '4.02';");
source = replaceExactly(
  source,
  "const GEWITTERRADAR_BUILD = 'V4.01-2026-09-02';",
  "const GEWITTERRADAR_BUILD = 'V4.02-2026-09-02';"
);
source = replaceExactly(source, '?v=401', '?v=402', 4);

const release401Marker = `              <article class="release-history-entry">\n                <div class="release-history-version">V4.01</div>`;
const release402Entry = `              <article class="release-history-entry">\n                <div class="release-history-version">V4.02</div>\n                <h3>HACS packaging fix</h3>\n                <p>Corrected the HACS distribution so the card and all four external PNG assets are installed together. Card behavior, helper IDs, layouts and lightning-processing logic remain unchanged.</p>\n              </article>\n`;
source = replaceExactly(source, release401Marker, `${release402Entry}${release401Marker}`);
source = replaceExactly(
  source,
  '/* END Gewitterradar Card V4.01 */',
  '/* END Gewitterradar Card V4.02 */'
);

await writeFile(source402JsPath, source, 'utf8');
await writeFile(source402TxtPath, source, 'utf8');

let dist = source;
const assets = [
  'gewitterradar-trend-medallion.png',
  'gewitterradar-trend-arrow.png',
  'gewitterradar-compass-frame-v1.png',
  'gewitterradar-compass-frame-v2.png',
];
for (const asset of assets) {
  const manualUrl = `'/local/gewitterradar/assets/${asset}?v=402'`;
  const hacsUrl = `new URL('./assets/${asset}?v=402', import.meta.url).href`;
  dist = replaceExactly(dist, manualUrl, hacsUrl);
}
await writeFile(distPath, dist, 'utf8');

const checksumPaths = [
  'gewitterradar-card-v4_02.js',
  'gewitterradar-card-v4_02.txt',
  'dist/gewitterradar.js',
  'dist/assets/gewitterradar-compass-frame-v1.png',
  'dist/assets/gewitterradar-compass-frame-v2.png',
  'dist/assets/gewitterradar-trend-arrow.png',
  'dist/assets/gewitterradar-trend-medallion.png',
  'home-assistant/app_gewitterradar_pkg.yaml',
  'hacs.json',
];
const checksumLines = [];
for (const relativePath of checksumPaths) {
  const bytes = await readFile(resolve(projectRoot, relativePath));
  const hash = createHash('sha256').update(bytes).digest('hex');
  checksumLines.push(`${hash}  ${relativePath}`);
}
await writeFile(resolve(projectRoot, 'SHA256SUMS.txt'), `${checksumLines.join('\n')}\n`, 'utf8');

console.log('Prepared V4.02 sources, HACS distribution and SHA256SUMS.txt deterministically.');

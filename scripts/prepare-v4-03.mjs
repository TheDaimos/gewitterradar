import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source402Path = resolve(projectRoot, 'gewitterradar-card-v4_02.js');
const source403JsPath = resolve(projectRoot, 'gewitterradar-card-v4_03.js');
const source403TxtPath = resolve(projectRoot, 'gewitterradar-card-v4_03.txt');
const distPath = resolve(projectRoot, 'dist', 'gewitterradar.js');

let source = await readFile(source402Path, 'utf8');

function replaceExactly(input, from, to, expected = 1) {
  const count = input.split(from).length - 1;
  if (count !== expected) {
    throw new Error(`Expected ${expected} occurrence(s) of ${JSON.stringify(from)}, found ${count}.`);
  }
  return input.replaceAll(from, to);
}

source = replaceExactly(
  source,
  '/* Gewitterradar Card V4.02 – HACS-Paketierungsfix auf Basis des eingefrorenen V4.01-Stands.',
  '/* Gewitterradar Card V4.03 – HACS-Release-Asset-Prioritätsfix auf Basis des eingefrorenen V4.02-Stands.'
);
source = replaceExactly(source, "const CARD_VERSION = '4.02';", "const CARD_VERSION = '4.03';");
source = replaceExactly(
  source,
  "const GEWITTERRADAR_BUILD = 'V4.02-2026-09-02';",
  "const GEWITTERRADAR_BUILD = 'V4.03-2026-09-02';"
);
source = replaceExactly(source, '?v=402', '?v=403', 4);

const release402Marker = `              <article class="release-history-entry">\n                <div class="release-history-version">V4.02</div>`;
const release403Entry = `              <article class="release-history-entry">\n                <div class="release-history-version">V4.03</div>\n                <h3>HACS release asset priority fix</h3>\n                <p>Removed custom GitHub release assets from the HACS release so HACS falls through to the tagged dist tree and installs the card together with the complete assets directory. Application logic and helper behavior remain unchanged.</p>\n              </article>\n`;
source = replaceExactly(source, release402Marker, `${release403Entry}${release402Marker}`);
source = replaceExactly(source, '/* END Gewitterradar Card V4.02 */', '/* END Gewitterradar Card V4.03 */');

await writeFile(source403JsPath, source, 'utf8');
await writeFile(source403TxtPath, source, 'utf8');

let dist = source;
const assets = [
  'gewitterradar-trend-medallion.png',
  'gewitterradar-trend-arrow.png',
  'gewitterradar-compass-frame-v1.png',
  'gewitterradar-compass-frame-v2.png',
];
for (const asset of assets) {
  const manualUrl = `'/local/gewitterradar/assets/${asset}?v=403'`;
  const hacsUrl = `new URL('./assets/${asset}?v=403', import.meta.url).href`;
  dist = replaceExactly(dist, manualUrl, hacsUrl);
}
await writeFile(distPath, dist, 'utf8');

const checksumPaths = [
  'gewitterradar-card-v4_03.js',
  'gewitterradar-card-v4_03.txt',
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

console.log('Prepared V4.03 sources, HACS distribution and SHA256SUMS.txt deterministically.');

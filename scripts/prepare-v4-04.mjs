import { createHash } from 'node:crypto';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source403Path = resolve(projectRoot, 'gewitterradar-card-v4_03.js');
const source404JsPath = resolve(projectRoot, 'gewitterradar-card-v4_04.js');
const source404TxtPath = resolve(projectRoot, 'gewitterradar-card-v4_04.txt');
const distPath = resolve(projectRoot, 'dist', 'gewitterradar.js');
const packageSourcePath = resolve(projectRoot, 'home-assistant', 'app_gewitterradar_pkg.yaml');
const packageDistPath = resolve(projectRoot, 'dist', 'app_gewitterradar_pkg.yaml');

let source = await readFile(source403Path, 'utf8');

function replaceExactly(input, from, to, expected = 1) {
  const count = input.split(from).length - 1;
  if (count !== expected) {
    throw new Error(`Expected ${expected} occurrence(s) of ${JSON.stringify(from)}, found ${count}.`);
  }
  return input.replaceAll(from, to);
}

source = replaceExactly(
  source,
  '/* Gewitterradar Card V4.03 – HACS-Release-Asset-Prioritätsfix auf Basis des eingefrorenen V4.02-Stands.',
  '/* Gewitterradar Card V4.04 – HACS-Package-Staging auf Basis des eingefrorenen V4.03-Stands.'
);
source = replaceExactly(source, "const CARD_VERSION = '4.03';", "const CARD_VERSION = '4.04';");
source = replaceExactly(
  source,
  "const GEWITTERRADAR_BUILD = 'V4.03-2026-09-02';",
  "const GEWITTERRADAR_BUILD = 'V4.04-2026-09-02';"
);
source = replaceExactly(source, '?v=403', '?v=404', 4);

const release403Marker = `              <article class="release-history-entry">\n                <div class="release-history-version">V4.03</div>`;
const release404Entry = `              <article class="release-history-entry">\n                <div class="release-history-version">V4.04</div>\n                <h3>HACS package staging</h3>\n                <p>HACS now places the required Home Assistant helper package next to the installed card as app_gewitterradar_pkg.yaml. Users still copy or move that file manually to /config/packages/ because a HACS Dashboard repository cannot write outside its own www/community directory. Application logic and helper behavior remain unchanged.</p>\n              </article>\n`;
source = replaceExactly(source, release403Marker, `${release404Entry}${release403Marker}`);
source = replaceExactly(source, '/* END Gewitterradar Card V4.03 */', '/* END Gewitterradar Card V4.04 */');

await writeFile(source404JsPath, source, 'utf8');
await writeFile(source404TxtPath, source, 'utf8');

let dist = source;
const assets = [
  'gewitterradar-trend-medallion.png',
  'gewitterradar-trend-arrow.png',
  'gewitterradar-compass-frame-v1.png',
  'gewitterradar-compass-frame-v2.png',
];
for (const asset of assets) {
  const manualUrl = `'/local/gewitterradar/assets/${asset}?v=404'`;
  const hacsUrl = `new URL('./assets/${asset}?v=404', import.meta.url).href`;
  dist = replaceExactly(dist, manualUrl, hacsUrl);
}
await writeFile(distPath, dist, 'utf8');
await copyFile(packageSourcePath, packageDistPath);

const checksumPaths = [
  'gewitterradar-card-v4_04.js',
  'gewitterradar-card-v4_04.txt',
  'dist/gewitterradar.js',
  'dist/app_gewitterradar_pkg.yaml',
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

console.log('Prepared V4.04 sources, HACS distribution, staged package and SHA256SUMS.txt deterministically.');

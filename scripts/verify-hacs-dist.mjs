import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(projectRoot, 'gewitterradar-card-v4_01.js'), 'utf8');
let normalizedDist = await readFile(resolve(projectRoot, 'dist', 'gewitterradar.js'), 'utf8');
const checksumLines = (await readFile(resolve(projectRoot, 'SHA256SUMS.txt'), 'utf8')).trim().split('\n');
const checksums = new Map(checksumLines.map((line) => {
  const [hash, path] = line.trim().split(/\s+/, 2);
  return [path, hash];
}));

const assets = [
  'gewitterradar-trend-medallion.png',
  'gewitterradar-trend-arrow.png',
  'gewitterradar-compass-frame-v1.png',
  'gewitterradar-compass-frame-v2.png',
];

for (const asset of assets) {
  const manualUrl = `'/local/gewitterradar/assets/${asset}?v=401'`;
  const hacsUrl = `new URL('./assets/${asset}?v=401', import.meta.url).href`;
  const occurrences = normalizedDist.split(hacsUrl).length - 1;

  if (occurrences !== 1) {
    throw new Error(`Expected exactly one HACS reference for ${asset}, found ${occurrences}.`);
  }

  normalizedDist = normalizedDist.replace(hacsUrl, manualUrl);

  const relativePath = `dist/assets/${asset}`;
  const assetBytes = await readFile(resolve(projectRoot, relativePath));
  const actualHash = createHash('sha256').update(assetBytes).digest('hex');

  if (checksums.get(relativePath) !== actualHash) {
    throw new Error(`Checksum mismatch for ${relativePath}.`);
  }
}

if (normalizedDist !== source) {
  throw new Error('HACS JavaScript differs from the approved V4.01 source beyond asset URL resolution.');
}

const manifest = JSON.parse(await readFile(resolve(projectRoot, 'hacs.json'), 'utf8'));

if (manifest.name !== 'Gewitterradar' || manifest.filename !== 'gewitterradar.js') {
  throw new Error('hacs.json does not identify the expected HACS entry point.');
}

console.log('HACS distribution verified: card logic, manifest and four asset checksums are consistent.');

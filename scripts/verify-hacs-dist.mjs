import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(projectRoot, 'gewitterradar-card-v4_02.js'), 'utf8');
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
  const manualUrl = `'/local/gewitterradar/assets/${asset}?v=402'`;
  const hacsUrl = `new URL('./assets/${asset}?v=402', import.meta.url).href`;
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
  throw new Error('HACS JavaScript differs from the approved V4.02 source beyond asset URL resolution.');
}

for (const relativePath of [
  'gewitterradar-card-v4_02.js',
  'gewitterradar-card-v4_02.txt',
  'dist/gewitterradar.js',
  'home-assistant/app_gewitterradar_pkg.yaml',
  'hacs.json',
]) {
  const bytes = await readFile(resolve(projectRoot, relativePath));
  const actualHash = createHash('sha256').update(bytes).digest('hex');
  if (checksums.get(relativePath) !== actualHash) {
    throw new Error(`Checksum mismatch for ${relativePath}.`);
  }
}

const manifest = JSON.parse(await readFile(resolve(projectRoot, 'hacs.json'), 'utf8'));
if (manifest.name !== 'Gewitterradar' || manifest.filename !== 'gewitterradar.js') {
  throw new Error('hacs.json does not identify the expected HACS entry point.');
}

const workflow = await readFile(resolve(projectRoot, '.github', 'workflows', 'validate.yml'), 'utf8');
const releaseCreateBlock = workflow.split('gh release create v4.02', 2)[1] ?? '';
if (!releaseCreateBlock) {
  throw new Error('V4.02 release creation command was not found.');
}
const commandBlock = releaseCreateBlock.split('--notes-file RELEASE_NOTES_V4_02.md', 1)[0];
if (commandBlock.includes('dist/gewitterradar.js')) {
  throw new Error('Regression: standalone gewitterradar.js must not be published as a V4.02 release asset.');
}

console.log('HACS V4.02 distribution verified: card logic, manifest, four assets, checksums and release layout are consistent.');

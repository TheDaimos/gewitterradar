import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(projectRoot, 'gewitterradar-card-v4_04.js'), 'utf8');
let normalizedDist = await readFile(resolve(projectRoot, 'dist', 'gewitterradar.js'), 'utf8');
const packageSource = await readFile(resolve(projectRoot, 'home-assistant', 'app_gewitterradar_pkg.yaml'));
const packageDist = await readFile(resolve(projectRoot, 'dist', 'app_gewitterradar_pkg.yaml'));
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
  const manualUrl = `'/local/gewitterradar/assets/${asset}?v=404'`;
  const hacsUrl = `new URL('./assets/${asset}?v=404', import.meta.url).href`;
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
  throw new Error('HACS JavaScript differs from the approved V4.04 source beyond asset URL resolution.');
}

if (!packageSource.equals(packageDist)) {
  throw new Error('Staged dist/app_gewitterradar_pkg.yaml differs from home-assistant/app_gewitterradar_pkg.yaml.');
}

for (const relativePath of [
  'gewitterradar-card-v4_04.js',
  'gewitterradar-card-v4_04.txt',
  'dist/gewitterradar.js',
  'dist/app_gewitterradar_pkg.yaml',
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
if (!/gh release create v4\.04 \\\n\s+--repo/.test(workflow)) {
  throw new Error('V4.04 release creation must contain no custom release assets before --repo.');
}
const releaseCreateBlock = workflow.split('gh release create v4.04', 2)[1] ?? '';
const commandBlock = releaseCreateBlock.split('--notes-file RELEASE_NOTES_V4_04.md', 1)[0];
for (const forbidden of ['dist/gewitterradar.js', 'app_gewitterradar_pkg.yaml', 'gewitterradar-v4_04.zip', 'RUNNER_TEMP']) {
  if (commandBlock.includes(forbidden)) {
    throw new Error(`Regression: V4.04 GitHub release must contain zero custom assets; found ${forbidden}.`);
  }
}

console.log('HACS V4.04 distribution verified: card logic, four graphics, staged helper package, checksums and zero-custom-release-asset layout are consistent.');

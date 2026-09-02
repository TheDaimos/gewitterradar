import { access, copyFile, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = resolve(projectRoot, 'gewitterradar-card-v4_04.js');
const distPath = resolve(projectRoot, 'dist', 'gewitterradar.js');
const packageSourcePath = resolve(projectRoot, 'home-assistant', 'app_gewitterradar_pkg.yaml');
const packageDistPath = resolve(projectRoot, 'dist', 'app_gewitterradar_pkg.yaml');

const assets = [
  'gewitterradar-trend-medallion.png',
  'gewitterradar-trend-arrow.png',
  'gewitterradar-compass-frame-v1.png',
  'gewitterradar-compass-frame-v2.png',
];

let card = await readFile(sourcePath, 'utf8');

for (const asset of assets) {
  await access(resolve(projectRoot, 'dist', 'assets', asset));

  const manualUrl = `'/local/gewitterradar/assets/${asset}?v=404'`;
  const hacsUrl = `new URL('./assets/${asset}?v=404', import.meta.url).href`;
  const occurrences = card.split(manualUrl).length - 1;

  if (occurrences !== 1) {
    throw new Error(`Expected exactly one source reference for ${asset}, found ${occurrences}.`);
  }

  card = card.replace(manualUrl, hacsUrl);
}

await writeFile(distPath, card, 'utf8');
await copyFile(packageSourcePath, packageDistPath);
console.log(`Built ${distPath} with ${assets.length} verified asset references and staged app_gewitterradar_pkg.yaml for V4.04.`);

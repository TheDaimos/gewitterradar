#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const sourcePath = path.join(root, 'frontend', 'gewitterradar.js');
const integrationPath = path.join(root, 'custom_components', 'gewitterradar', 'frontend', 'gewitterradar.js');
const dashboardPath = path.join(root, 'dashboard', 'dist', 'gewitterradar.js');

// Reproduce the complete V4.08.02 test candidate first. V4.08.03 is a
// deliberately small repair transform and must never patch an unknown input.
await import('./run-v40802-diagnostic-weather-lab.mjs');
await import('./build-v40802-diagnostic-weather-lab-pass2.mjs');

const V40802_SHA256 = '3699d76bba248c4f89bd24135947c3033057967a03894e978d1da0eaef3d3e6a';
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

let card = await readFile(sourcePath, 'utf8');
const inputHash = sha256(card);
if (inputHash !== V40802_SHA256) {
  throw new Error(`V4.08.03 builder refuses unknown V4.08.02 input: ${inputHash}`);
}

function replaceOnce(label, needle, replacement) {
  const first = card.indexOf(needle);
  if (first < 0) throw new Error(`Missing V4.08.03 anchor: ${label}`);
  if (card.indexOf(needle, first + needle.length) >= 0) {
    throw new Error(`Non-unique V4.08.03 anchor: ${label}`);
  }
  card = card.slice(0, first) + replacement + card.slice(first + needle.length);
}

replaceOnce(
  'header version',
  '/* Gewitterradar Card V4.08.02 TEST',
  '/* Gewitterradar Card V4.08.03 TEST'
);
replaceOnce('CARD_VERSION', "const CARD_VERSION = '4.08.02';", "const CARD_VERSION = '4.08.03';");
replaceOnce('CARD_DISPLAY_VERSION', "const CARD_DISPLAY_VERSION = '4.08.02';", "const CARD_DISPLAY_VERSION = '4.08.03';");
replaceOnce(
  'GEWITTERRADAR_BUILD',
  "const GEWITTERRADAR_BUILD = 'V4.08.02-DIAGNOSTIC-WEATHER-LAB-2026-09-16';",
  "const GEWITTERRADAR_BUILD = 'V4.08.03-STORM-RADIUS-FIX-2026-09-17';"
);
replaceOnce("weather lab version", "version:'4.08.02',seed:40802", "version:'4.08.03',seed:40802");
replaceOnce('weather lab title', 'Wetter-Labor · V4.08.02', 'Wetter-Labor · V4.08.03');

replaceOnce(
  'render map marker radius chain',
  `      const observationRadius = this._currentObservationRadius ?? this._observationRadiusValue();\n      const dangerRadius = this._currentDangerRadius ?? Math.min(this._dangerRadiusValue(),observationRadius);\n      const zoom = this._map.getZoom();`,
  `      const observationRadius = this._currentObservationRadius ?? this._observationRadiusValue();\n      const stormRadius = this._currentStormRadius ?? Math.min(this._stormRadiusValue(),observationRadius);\n      const dangerRadius = this._currentDangerRadius ?? Math.min(this._dangerRadiusValue(),stormRadius);\n      const zoom = this._map.getZoom();`
);

for (const marker of [
  "const CARD_VERSION = '4.08.03';",
  "V4.08.03-STORM-RADIUS-FIX-2026-09-17",
  'const stormRadius = this._currentStormRadius ?? Math.min(this._stormRadiusValue(),observationRadius);',
  'const dangerRadius = this._currentDangerRadius ?? Math.min(this._dangerRadiusValue(),stormRadius);',
  'const inStorm = s.distance != null && s.distance <= stormRadius;',
  '_diagnosticClusterSplitMergeStressV40802',
  '_diagnosticInjectStressCellV40802'
]) {
  if (!card.includes(marker)) throw new Error(`Missing V4.08.03 result marker: ${marker}`);
}

const inStormIndex = card.indexOf('const inStorm = s.distance != null && s.distance <= stormRadius;');
const stormDeclarationIndex = card.lastIndexOf(
  'const stormRadius = this._currentStormRadius ?? Math.min(this._stormRadiusValue(),observationRadius);',
  inStormIndex
);
if (inStormIndex < 0 || stormDeclarationIndex < 0 || stormDeclarationIndex > inStormIndex) {
  throw new Error('V4.08.03 runtime guard: stormRadius is not declared before cluster policy use');
}

await writeFile(sourcePath, card, 'utf8');
await copyFile(sourcePath, integrationPath);
await copyFile(sourcePath, dashboardPath);

console.log(`V4.08.03 frontend built: ${Buffer.byteLength(card)} bytes`);
console.log(`SHA256 ${sha256(card)}`);
console.log('Fix: stormRadius is declared in _renderMapMarkers before zoned cluster policy evaluation.');

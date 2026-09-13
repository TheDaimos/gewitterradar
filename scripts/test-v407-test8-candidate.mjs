import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const candidate = await readFile(resolve(root,'artifacts/v407/gewitterradar.js'),'utf8');

const required = [
  "const CARD_VERSION = '4.07';",
  "const GEWITTERRADAR_BUILD = 'V4.07-TEST8-2026-09-13';",
  "external_services:'<svg viewBox=\"0 0 24 24\"",
  'M12 2.8c2.25 1.76 4.62 2.75 7.35 3.06v5.25c0 4.72-2.88 8.27-7.35 10.09',
  '<rect x=\"7.15\" y=\"8\" width=\"2.25\" height=\"1.7\"',
  'M13.2 8.95h3.25m-1.15-1.15 1.2 1.15-1.2 1.15',
  'M16.5 13.55h-3.25m1.15-1.15-1.2 1.15 1.2 1.15',
  'release-history-language-toggle',
  'data-release-history-lang=\"de\"',
  'data-release-history-lang=\"en\"',
  "document.addEventListener('pointerdown',this._v407LocationOutsidePointerHandler,true);"
];
for (const needle of required) {
  if (!candidate.includes(needle)) throw new Error(`V4.07 TEST8 contract missing: ${needle}`);
}

const rejectedNetworkIconNeedle = 'M7.2 7.4 10.5 10.6M16.8 7.4l-3.3 3.2M12 14.4v2.7';
if (candidate.includes(rejectedNetworkIconNeedle)) {
  throw new Error('Rejected TEST7 connected-node external-services icon must not remain in TEST8');
}

const iconMatch = candidate.match(/external_services:'(<svg viewBox="0 0 24 24"[\s\S]*?<\/svg>)'/);
if (!iconMatch) throw new Error('TEST8 external-services icon could not be isolated');
const icon = iconMatch[1];
const shieldCount = (icon.match(/M12 2\.8c/g) || []).length;
const brickCount = (icon.match(/<rect /g) || []).length;
if (shieldCount !== 1) throw new Error(`Expected one firewall shield outline, got ${shieldCount}`);
if (brickCount !== 6) throw new Error(`Expected six firewall brick blocks, got ${brickCount}`);
if (!icon.includes('currentColor')) throw new Error('Firewall icon must inherit the Help premium currentColor treatment');

console.log('V4.07 TEST8 selected firewall icon contract: PASS');
console.log(`Firewall bricks: ${brickCount}`);
console.log('Shield + bidirectional traffic arrows: PRESENT');
console.log('TEST7 Release History DE/EN and outside-click behavior: PRESERVED');

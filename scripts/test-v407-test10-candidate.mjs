import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const candidate = await readFile(resolve(root,'artifacts/v407/gewitterradar.js'),'utf8');

const required = [
  "const CARD_VERSION = '4.07';",
  "const GEWITTERRADAR_BUILD = 'V4.07-TEST10-2026-09-13';",
  'const V407_LOCATION_TEXTS = Object.freeze',
  'v407PatchExternalHelpLocales',
  'v407-location-query-clear',
  'const v407ClearQueryLabel',
  "queryInput.addEventListener('input',syncV407QueryClear);",
  "clearQueryButton.addEventListener('click',() => {",
  "queryInput.value='';",
  'results.replaceChildren();',
  "queryInput.focus({preventScroll:true});",
  'release-history-language-toggle',
  "document.addEventListener('pointerdown',this._v407LocationOutsidePointerHandler,true);",
  'M12 2.8c2.25 1.76 4.62 2.75 7.35 3.06v5.25c0 4.72-2.88 8.27-7.35 10.09',
  'M9.35 9v1.55M10.7 9v1.55M12 9v1.55M13.3 9v1.55M14.65 9v1.55',
  '<rect x="7.7" y="7.55" width="8.6" height="8.15" rx="1"'
];
for (const needle of required) {
  if (!candidate.includes(needle)) throw new Error(`V4.07 TEST10 contract missing: ${needle}`);
}

if (candidate.includes('v407-location-query-wrap')) throw new Error('TEST10 must preserve the accepted TEST9R2 query DOM without a wrapper');
if (candidate.includes("queryInput.closest('.v407-location-search-field')")) throw new Error('TEST10 must preserve the accepted TEST8/TEST9R2 label lookup');
if (candidate.includes('x="7.15" y="8" width="2.25" height="1.7"')) throw new Error('TEST10 still contains the rejected detailed brick/firewall interior');
if (candidate.includes('M13.2 8.95h3.25m-1.15-1.15')) throw new Error('TEST10 still contains the rejected TEST8 bidirectional-arrow interior');
if (candidate.includes('v407IsGermanUi')) throw new Error('TEST10 regressed to the German/English-only location-text path');

const clearMarkup = candidate.match(/<input id="v407-location-query"[^>]*><button type="button" class="v407-location-query-clear"[^>]*>×<\/button>/)?.[0] || '';
if (!clearMarkup.includes('aria-label="${v407ClearQueryLabel()}"')) throw new Error('TEST10 clear button lost its localized aria-label');
if (!clearMarkup.includes('title="${v407ClearQueryLabel()}"')) throw new Error('TEST10 clear button lost its localized title');

const urlLiterals = [...new Set(candidate.match(/https?:\/\/[^\"'`\s)]+/g) || [])].sort();
const expectedUrlLiterals = [
  'http://www.w3.org/2000/svg',
  'https://geocoding-api.open-meteo.com/v1/search',
  'https://nominatim.openstreetmap.org/search',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
].sort();
if (JSON.stringify(urlLiterals) !== JSON.stringify(expectedUrlLiterals)) {
  throw new Error(`TEST10 external URL inventory changed: ${JSON.stringify(urlLiterals)}`);
}
if ((candidate.match(/wss?:\/\//g) || []).length) throw new Error('TEST10 unexpectedly added a WebSocket URL');

console.log('V4.07 TEST10 stabilization contract: PASS');
console.log('TEST9R2 clear control: PRESERVED');
console.log('19-language runtime matrix: PRESENT');
console.log('Firewall shield variant 2 / RJ45 motif: PRESENT');
console.log(`External URL literals: ${urlLiterals.length} (unchanged)`);

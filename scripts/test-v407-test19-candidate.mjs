import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const js=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.19.js'),'utf8');
const must=[
  "const CARD_DISPLAY_VERSION = '4.07.19';",
  "V4.07-TEST19-2026-09-14",
  "notes:[copy.ln.join(' ')]",
  'id="v407-location-country" type="text" inputmode="search" enterkeyhint="search"',
  'class="v407-location-country-clear"',
  "const clearCountryButton = backdrop.querySelector('.v407-location-country-clear');",
  'const syncV407CountryClear = () => {',
  "countryInput.addEventListener(eventName,syncV407CountryClear)",
  "clearCountryButton.addEventListener('click'",
  "countryInput.dataset.countryCode='';",
  'radii:HELP_REFINED_ICONS_V6.radii',
  "const HELP_PREMIUM_ICON_VARIANT = 'B';"
];
for(const marker of must)if(!js.includes(marker))throw new Error(`TEST19 missing marker: ${marker}`);
if(js.includes('id="v407-location-country" type="search"'))throw new Error('TEST19 still relies on native WebKit country searchfield clear control');
if(!js.includes('.v407-location-query-clear,.v407-location-country-clear {'))throw new Error('TEST19 country clear button does not inherit accepted query-clear styling');
console.log('V4.07.19 iPad country-clear + Help-runtime regression contract PASS');

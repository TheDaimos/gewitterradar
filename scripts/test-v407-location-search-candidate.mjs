import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const candidate = await readFile(resolve(root,'artifacts/v407/gewitterradar.js'),'utf8');

const mustContain = [
  "const CARD_VERSION = '4.07';",
  "const GEWITTERRADAR_BUILD = 'V4.07-TEST-2026-09-12';",
  "people:'Personen'",
  "zones:'Zonen'",
  "searchAction:'Ort suchen …'",
  "savedPlaces:'Gespeicherte Orte'",
  "https://geocoding-api.open-meteo.com/v1/search",
  "https://nominatim.openstreetmap.org/search",
  "url.searchParams.set('countryCode',countryCode)",
  "url.searchParams.set('countrycodes',countryCode.toLowerCase())",
  "this._hass.callService('gewitterradar','set_reference_coordinates',data)",
  "script.gewitterradar_set_reference_coordinates_dashboard",
  "reference_name",
  "save.disabled=true",
  "Blitzortung bereits passende Live-Daten",
  "V407_ISO_COUNTRY_CODES"
];
for (const needle of mustContain) {
  if (!candidate.includes(needle)) throw new Error(`V4.07 candidate contract missing: ${needle}`);
}

if (candidate.includes('device_tracker.see')) throw new Error('Deprecated device_tracker.see must not appear in V4.07 candidate');
if (candidate.includes("callService('todo','add_item'")) throw new Error('Saved-place persistence must not be implemented in this frontend step');

const order = ["people:'Personen'","zones:'Zonen'","searchAction:'Ort suchen …'","savedPlaces:'Gespeicherte Orte'"]
  .map((needle) => candidate.indexOf(needle));
if (order.some((value) => value < 0) || order.some((value,index) => index > 0 && value <= order[index-1])) {
  throw new Error('V4.07 dropdown order contract failed');
}

const isoLine = candidate.match(/const V407_ISO_COUNTRY_CODES = '([^']+)'\.split\(' '\);/);
if (!isoLine) throw new Error('ISO country-code table missing');
const codes = isoLine[1].split(' ');
if (codes.length !== 249 || new Set(codes).size !== 249) throw new Error(`Expected 249 unique ISO country codes, got ${codes.length}/${new Set(codes).size}`);

console.log('V4.07 location-search candidate contract: PASS');
console.log(`ISO countries: ${codes.length}`);

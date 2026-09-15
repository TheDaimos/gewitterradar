import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {v407Test36CoordinateInputDelta} from './v4-07-test36-coordinate-input-delta.mjs';

const root=process.cwd(),dir=resolve(root,'artifacts/v407');
const sha=value=>createHash('sha256').update(value).digest('hex');
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const sourceBuffer=await readFile(resolve(dir,'gewitterradar-v4.07.35.js'));
const candidateBuffer=await readFile(resolve(dir,'gewitterradar-v4.07.36.js'));
const localeBuffer=await readFile(resolve(dir,'locales/about-locales.js'));
const assetBuffer=await readFile(resolve(dir,'assets/gewitterradar-coordinate-target.svg'));
assert(sourceBuffer.length===1781842,'V4.07.35 baseline byte drift');
assert(sha(sourceBuffer)==='ec997a2a992681398209883990183035b9c38eccad49d363e80e20a3ab7d5447','V4.07.35 baseline SHA drift');
assert(localeBuffer.length===401387&&sha(localeBuffer)==='898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb','external locale drift');
assert(assetBuffer.length===2561&&sha(assetBuffer)==='c93699f52ad39237ba23e297fabb63eb2fb51013a9b9432b6b8dbc9a6474195b','coordinate target asset drift');
const source=sourceBuffer.toString('utf8'),candidate=candidateBuffer.toString('utf8');
assert(candidate===v407Test36CoordinateInputDelta(source),'V4.07.36 is not deterministic from exact V4.07.35');
assert(candidate.includes("const CARD_DISPLAY_VERSION = '4.07.36';"),'display version missing');
assert(candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST36-2026-09-15';"),'build marker missing');

for(const fingerprint of [
  '.settings-close.settings-close-premium{position:absolute!important;top:10px!important;right:10px!important;',
  '.help-close{position:absolute!important;top:10px!important;right:10px!important;',
  '.about-dialog .about-close{position:absolute;right:10px;top:10px;',
  'const helpTokenQuotePattern=',
  '.location-saved-remove { color:#d6a08e;border:0;background:transparent;box-shadow:none;',
  '@supports(-webkit-touch-callout:none){@media(min-width:700px)'
]) assert(candidate.includes(fingerprint),`accepted prior fingerprint changed: ${fingerprint}`);

assert(candidate.includes('v407-location-mode-address')&&candidate.includes('aria-pressed="true"'),'Ort/PLZ default mode missing');
assert(candidate.includes('v407-location-mode-coordinates')&&candidate.includes('<span>Lat / Lon</span>'),'Lat/Lon mode missing');
assert(candidate.includes('V407_COORDINATE_TARGET_ICON'),'coordinate target asset not wired');
assert(candidate.includes('v407-coordinate-name')&&candidate.includes('v407-coordinate-latitude')&&candidate.includes('v407-coordinate-longitude'),'coordinate input fields missing');
assert(candidate.includes("provider:'Lat / Lon'"),'coordinate candidate provider missing');
assert(candidate.includes('label||fallback'),'free label fallback missing');
assert(candidate.includes('latitude>=-90&&latitude<=90&&longitude>=-180&&longitude<=180'),'coordinate range validation missing');
assert(candidate.includes("event.clipboardData?.getData('text')"),'coordinate paste handling missing');
assert(candidate.includes("replace(',','.')"),'decimal-comma normalization missing');

assert(candidate.includes('https://www.maptiler.com/tools/coordinates/'),'MapTiler coordinate helper link missing');
assert(candidate.includes('Koordinaten verwenden'),'German coordinate help missing');
assert(candidate.includes('Google Maps'),'Google Maps copy guidance missing');
assert(candidate.includes('help-coordinate-guide'),'coordinate help guide missing');

const expectedLanguages=['Deutsch','English','Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
const tableMatch=candidate.match(/const V407_COORDINATE_TEXTS = Object\.freeze\((\{.*?\})\);\n  \/\/ Kept byte-for-byte/s);
assert(tableMatch,'coordinate translation table not found');
const table=JSON.parse(tableMatch[1]);
assert(JSON.stringify(Object.keys(table))===JSON.stringify(expectedLanguages),'coordinate language set/order drift');
for(const language of expectedLanguages){for(const key of ['label','labelPlaceholder','latitude','longitude','apply','invalid','hint','helpTitle','helpBefore','helpAfter'])assert(String(table[language]?.[key]||'').trim(),`${language}.${key} missing`);}

assert(candidate.includes("this._hass.callService('gewitterradar','set_reference_coordinates',data)"),'reference-coordinate service path missing');
assert(candidate.includes('description:v407SavedPlaceDescription(candidate)'),'saved-place persistence path missing');
assert(candidate.includes('HELP_EXTERNAL_LOCALES_V40731'),'accepted external locale registry changed');
const imported=await import(pathToFileURL(resolve(dir,'locales/about-locales.js')).href+'?v40736-test');
assert(imported.HELP_EXTERNAL_LOCALES_V40731,'external locale registry unavailable');

console.log(`V4.07.36 regression contract PASS: ${candidateBuffer.length} bytes / ${sha(candidateBuffer)}`);
console.log(`Coordinate asset PASS: ${assetBuffer.length} bytes / ${sha(assetBuffer)}`);

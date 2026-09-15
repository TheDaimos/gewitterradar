import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {v407Test36CoordinateInputDelta} from './v4-07-test36-coordinate-input-delta.mjs';
import {buildV407CoordinateTexts,V407_COORDINATE_TEXT_KEYS} from './v4-07-test36-coordinate-texts.mjs';

const root=process.cwd(),dir=resolve(root,'artifacts/v407');
const sha=value=>createHash('sha256').update(value).digest('hex');
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const sourceBuffer=await readFile(resolve(dir,'gewitterradar-v4.07.35.js'));
const candidateBuffer=await readFile(resolve(dir,'gewitterradar-v4.07.36.js'));
const localeBuffer=await readFile(resolve(dir,'locales/about-locales.js'));
const assetBuffer=await readFile(resolve(dir,'assets/gewitterradar-coordinate-target.svg'));
const masterBuffer=await readFile(resolve(dir,'artwork/gewitterradar-coordinate-target-master.svg'));
assert(sourceBuffer.length===1781842,'V4.07.35 baseline byte drift');
assert(sha(sourceBuffer)==='ec997a2a992681398209883990183035b9c38eccad49d363e80e20a3ab7d5447','V4.07.35 baseline SHA drift');
assert(localeBuffer.length===401387&&sha(localeBuffer)==='898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb','external locale drift');
assert(assetBuffer.length===2560&&sha(assetBuffer)==='12500f325ecf038a1d1c1c113d5ab8d5825af3eff9167afc10e6db59c0a48ea5','coordinate target asset drift');
assert(masterBuffer.length===2821&&sha(masterBuffer)==='b7aad6f0b05ec85456b58e3d175825be3050d5e41883a923dbce93327086c273','coordinate target Hi-Res master drift');
const source=sourceBuffer.toString('utf8'),candidate=candidateBuffer.toString('utf8');
assert(candidate===v407Test36CoordinateInputDelta(source),'V4.07.36 is not deterministic from exact V4.07.35');
assert(candidate.includes("const CARD_DISPLAY_VERSION = '4.07.36';"),'display version missing');
assert(candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST36-2026-09-15';"),'build marker missing');

// Accepted V4.07.34/V35 work must survive untouched.
for(const fingerprint of [
  '.settings-close.settings-close-premium{position:absolute!important;top:10px!important;right:10px!important;',
  '.help-close{position:absolute!important;top:10px!important;right:10px!important;',
  '.about-dialog .about-close{position:absolute;right:10px;top:10px;',
  'const helpTokenQuotePattern=',
  '.location-saved-remove { color:#d6a08e;border:0;background:transparent;box-shadow:none;',
  '@supports(-webkit-touch-callout:none){@media(min-width:700px)'
]) assert(candidate.includes(fingerprint),`accepted prior fingerprint changed: ${fingerprint}`);

// Approved premium two-mode location-search layout.
for(const fingerprint of [
  'v407-location-search-emblem',
  'v407-location-search-subtitle',
  'v407-location-mode-switch',
  'v407-location-mode-address',
  'v407-location-mode-coordinates',
  'aria-pressed="true"',
  '<span>Lat / Lon</span>',
  'v407-location-search-divider',
  'v407-location-safety-medallion',
  'v407-location-advice-medallion',
  'MapTiler Coordinates ↗',
  '<img src="${ABOUT_CLOSE_IMAGE}"'
]) assert(candidate.includes(fingerprint),`approved premium dialog fingerprint missing: ${fingerprint}`);
assert(candidate.includes('width:min(760px,calc(100vw - 24px))'),'approved wider dialog geometry missing');
assert(candidate.includes('border-color:#4ba8f3'),'approved blue active-mode accent missing');
assert(candidate.includes('V407_COORDINATE_TARGET_ICON'),'coordinate target asset not wired');

// New coordinate mode: free label + latitude + longitude + direct Apply.
assert(candidate.includes('v407-coordinate-name')&&candidate.includes('v407-coordinate-latitude')&&candidate.includes('v407-coordinate-longitude'),'coordinate fields missing');
assert(candidate.includes("provider:'Lat / Lon'"),'coordinate candidate provider missing');
assert(candidate.includes('label||fallback'),'free-label fallback missing');
assert(candidate.includes('latitude>=-90&&latitude<=90&&longitude>=-180&&longitude<=180'),'coordinate pair range validation missing');
assert(candidate.includes('latitude<-90||latitude>90')&&candidate.includes('longitude<-180||longitude>180'),'coordinate form range validation missing');
assert(candidate.includes("event.clipboardData?.getData('text')"),'coordinate-pair paste support missing');
assert(candidate.includes("replace(',','.')"),'decimal-comma normalization missing');
assert(candidate.includes('const ok=await v407UseCandidate(candidate)'),'Apply does not reuse the accepted reference-location service pipeline');
assert(candidate.includes('close();v407FocusCandidate(candidate)'),'Apply does not close/focus after success');
assert(!candidate.includes("renderResults([candidate],{preferredCountryCode:'',countryCode:''})"),'coordinate Apply unexpectedly requires an extra result-card click');

// Existing address search stays the default path.
assert(candidate.includes('setSearchMode(\'address\',{focus:false})'),'Ort / PLZ is not the default mode');
assert(candidate.includes("form.addEventListener('submit',async (event) => {"),'existing address-search submit pipeline missing');
assert(candidate.includes("v407SearchOpenMeteo(query,countryCode)"),'existing Open-Meteo search pipeline missing');
assert(candidate.includes("v407SearchNominatim(query,countryCode,preferredCountryCode,records)"),'existing Nominatim fallback missing');

// The coordinate copy/help strings remain complete for all 19 product language variants.
const expectedLanguages=['Deutsch','English','Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
const expectedKeys=['label','labelPlaceholder','latitude','longitude','apply','invalid','hint','helpTitle','helpBefore','helpAfter','subtitle','adviceTitle'];
assert(JSON.stringify(V407_COORDINATE_TEXT_KEYS)===JSON.stringify(expectedKeys),'coordinate text schema drift');
const table=buildV407CoordinateTexts();
assert(JSON.stringify(Object.keys(table))===JSON.stringify(expectedLanguages),'coordinate language set/order drift');
for(const language of expectedLanguages){for(const key of expectedKeys)assert(String(table[language]?.[key]||'').trim(),`${language}.${key} missing`);}
assert(candidate.includes('https://www.maptiler.com/tools/coordinates/'),'MapTiler coordinate helper link missing');
assert(candidate.includes('Google Maps'),'Google Maps copy guidance missing');

// Service, persistence and external Help-locale architecture remain untouched.
assert(candidate.includes("this._hass.callService('gewitterradar','set_reference_coordinates',data)"),'reference-coordinate service path missing');
assert(candidate.includes("description:v407SavedPlaceDescription(candidate)"),'saved-place persistence path missing');
assert(candidate.includes('HELP_EXTERNAL_LOCALES_V40731'),'accepted external locale registry changed');
const imported=await import(pathToFileURL(resolve(dir,'locales/about-locales.js')).href+'?v40736-test');
assert(imported.HELP_EXTERNAL_LOCALES_V40731,'external locale registry unavailable');

console.log(`V4.07.36 regression contract PASS: ${candidateBuffer.length} bytes / ${sha(candidateBuffer)}`);
console.log(`Coordinate asset PASS: ${assetBuffer.length} bytes / ${sha(assetBuffer)}`);
console.log(`Coordinate Hi-Res master PASS: ${masterBuffer.length} bytes / ${sha(masterBuffer)}`);

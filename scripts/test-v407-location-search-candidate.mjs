import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const candidate = await readFile(resolve(root,'artifacts/v407/gewitterradar.js'),'utf8');

const mustContain = [
  "const CARD_VERSION = '4.07';",
  "const GEWITTERRADAR_BUILD = 'V4.07-TEST3-2026-09-12';",
  "people:'Personen'",
  "zones:'Zonen'",
  "searchAction:'Ort suchen …'",
  "savedPlaces:'Gespeicherte Orte'",
  "https://geocoding-api.open-meteo.com/v1/search",
  "https://nominatim.openstreetmap.org/search",
  "url.searchParams.set('countryCode',countryCode)",
  "url.searchParams.set('countrycodes',countryCode.toLowerCase())",
  "url.searchParams.set('q',query)",
  "this._hass.callService('gewitterradar','set_reference_coordinates',data)",
  "script.gewitterradar_set_reference_coordinates_dashboard",
  "reference_name",
  "GEWITTERRADAR_PLACE_V1",
  "callService('todo','get_items'",
  "callService('todo','add_item'",
  "todo.gewitterradar_orte",
  "location-saved-option",
  "v407FocusCandidate(candidate)",
  "close();",
  "v407-country-filterbar",
  "v407-country-group",
  "allCountries:'Alle Länder'",
  "homeCountry:'Heimatland'",
  "showMore:'Weitere {count} Treffer anzeigen'",
  "score += 2000",
  "score += 55",
  "renderResults(ranked,{preferredCountryCode,countryCode})",
  "Blitzortung bereits passende Live-Daten",
  "V407_ISO_COUNTRY_CODES",
  "muss Blitzortung selbst diesen Tracker als Standortquelle verfolgen",
  "Als Konfigurationstyp „Location entity“ wählen",
  "den Eintrag „Gewitterradar Dashboard“ auswählen",
  "lässt er sich über „Neu konfigurieren“ nicht auf eine Standort-Entität umstellen",
  "500 km Erfassungsradius, 120 Minuten Zeitfenster und 200 Blitze",
  "lokale To-do-Liste mit dem Namen „Gewitterradar Orte“",
  "Externe Dienste & Netzwerkfreigaben",
  "geocoding-api.open-meteo.com · HTTPS/TCP 443",
  "nominatim.openstreetmap.org · HTTPS/TCP 443",
  "unpkg.com · HTTPS/TCP 443",
  "*.tile.openstreetmap.org · HTTPS/TCP 443",
  "device_tracker.gewitterradar verwendet"
];
for (const needle of mustContain) {
  if (!candidate.includes(needle)) throw new Error(`V4.07 candidate contract missing: ${needle}`);
}

if (candidate.includes('device_tracker.see')) throw new Error('Deprecated device_tracker.see must not appear in V4.07 candidate');
if (candidate.includes('save.disabled=true; save.title=text.saveLater')) throw new Error('Save button must be active in TEST3');
if (candidate.includes('const biasedQuery =')) throw new Error('Soft home-country preference must not rewrite the worldwide Nominatim query');

const order = ["people:'Personen'","zones:'Zonen'","searchAction:'Ort suchen …'","savedPlaces:'Gespeicherte Orte'"]
  .map((needle) => candidate.indexOf(needle));
if (order.some((value) => value < 0) || order.some((value,index) => index > 0 && value <= order[index-1])) {
  throw new Error('V4.07 dropdown order contract failed');
}

const isoLine = candidate.match(/const V407_ISO_COUNTRY_CODES = '([^']+)'\.split\(' '\);/);
if (!isoLine) throw new Error('ISO country-code table missing');
const codes = isoLine[1].split(' ');
if (codes.length !== 249 || new Set(codes).size !== 249) throw new Error(`Expected 249 unique ISO country codes, got ${codes.length}/${new Set(codes).size}`);

// Regression contract for the observed "Tokio" ambiguity: a famous exact global
// result must be able to outrank a tiny home-country namesake when no hard country
// filter is selected. An explicit country selection must still dominate.
const rankStart = candidate.indexOf('      const v407Rank =');
const rankEnd = candidate.indexOf('      const v407PrimaryIsGood =',rankStart);
if (rankStart < 0 || rankEnd < 0) throw new Error('V4.07 rank function not found');
const rankSource = candidate.slice(rankStart,rankEnd).trim();
const normalize = (value) => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').trim().toLocaleLowerCase();
const rank = new Function('v407NormalizeText',`${rankSource}\nreturn v407Rank;`)(normalize);
const tokioCandidates = [
  {name:'Tokio',displayLabel:'Tokio, Baden-Württemberg, Deutschland',admin1:'Baden-Württemberg',countryCode:'DE',importance:0,postcodes:[],postcode:''},
  {name:'Tokio',displayLabel:'Tokio, Präfektur Tokio, Japan',admin1:'Präfektur Tokio',countryCode:'JP',importance:14000000,postcodes:[],postcode:''}
];
const worldwideTokio = rank(tokioCandidates,'Tokio','', 'DE');
if (worldwideTokio[0]?.countryCode !== 'JP') throw new Error('TEST3 ranking regression: famous Tokio/Japan must outrank the German namesake without an explicit country filter');
const hardGermanTokio = rank(tokioCandidates,'Tokio','DE','');
if (hardGermanTokio[0]?.countryCode !== 'DE') throw new Error('TEST3 ranking regression: explicit DE country filter must remain dominant');

console.log('V4.07 location-search TEST3 contract: PASS');
console.log(`ISO countries: ${codes.length}`);
console.log(`Tokio worldwide ranking: ${worldwideTokio.map((item) => item.countryCode).join(' > ')}`);

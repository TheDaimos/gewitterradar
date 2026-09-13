import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const candidate = await readFile(resolve(root,'artifacts/v407/gewitterradar.js'),'utf8');

const mustContain = [
  "const CARD_VERSION = '4.07';",
  "const GEWITTERRADAR_BUILD = 'V4.07-TEST7-2026-09-13';",
  '"people":"Personen"',
  '"zones":"Zonen"',
  '"searchAction":"Ort suchen …"',
  '"savedPlaces":"Gespeicherte Orte"',
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
  "callService('todo','update_item'",
  "status:['needs_action','completed']",
  "todo.gewitterradar_orte",
  "location-saved-option",
  "location-saved-remove",
  "location-saved-restore",
  '"removedPlaces":"Entfernte Orte"',
  "v407RemoveSavedPlace",
  "v407RestoreSavedPlace",
  "v407UpdateSavedPlaceStatus(place,'completed')",
  "v407UpdateSavedPlaceStatus(place,'needs_action')",
  "v407FocusCandidate(candidate)",
  "close();",
  "v407-country-filterbar",
  "v407-country-group",
  '"allCountries":"Alle Länder"',
  '"homeCountry":"Heimatland"',
  '"showMore":"Weitere {count} Treffer anzeigen"',
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
  "Einstellungen → Geräte & Dienste → Integration hinzufügen → „Local to-do“ suchen/auswählen → Liste exakt „Gewitterradar Orte“ nennen",
  "Speicherliste einrichten: Einstellungen → Geräte & Dienste → Integration hinzufügen → nach „Local to-do“ suchen und diese Integration auswählen",
  "Unter „Entfernte Orte“ kann er mit ↶ jederzeit wiederhergestellt werden",
  "Settings → Devices & services → Add integration → search/select “Local to-do” → name the list exactly “Gewitterradar Orte”",
  "Externe Dienste & Netzwerkfreigaben",
  "geocoding-api.open-meteo.com · HTTPS/TCP 443",
  "nominatim.openstreetmap.org · HTTPS/TCP 443",
  "unpkg.com · HTTPS/TCP 443",
  "a.tile.openstreetmap.org, b.tile.openstreetmap.org und c.tile.openstreetmap.org · HTTPS/TCP 443",
  "blitzortung.ha.sed.pl · MQTT/TCP 1883",
  "HTTPS-Proxy, TLS-Inspection, Inhaltsfilter",
  "http://www.w3.org/2000/svg ist lediglich der SVG-Namensraum",
  "device_tracker.gewitterradar verwendet",
  "external_services:'<svg viewBox=\"0 0 24 24\"",
  "V4.07: Release History inherits the accepted Settings/Help premium metal treatment.",
  ".release-history-close img",
  "<button class=\"release-history-close\" id=\"release-history-close\" type=\"button\" aria-label=\"Close release history\"><img src=\"${ABOUT_CLOSE_IMAGE}\"",
  "release-history-language-toggle",
  "data-release-history-language=\"de\"",
  "data-release-history-language=\"en\"",
  "data-release-history-lang=\"de\"",
  "data-release-history-lang=\"en\"",
  "syncReleaseHistoryLanguage",
  "releaseHistoryGermanLanguages",
  "Gewitterradar · Versionsverlauf",
  "Worldwide reference locations & saved places",
  "Weltweite Referenzstandorte & gespeicherte Orte",
  "V4.07 · 2026/09",
  "const viewport = window.visualViewport;",
  "const viewportCap = Math.max(1,Math.floor(viewportHeight * 0.88));",
  "const belowAvailable = Math.max(0,viewportBottom-rect.bottom-gap-margin);",
  "const aboveAvailable = Math.max(0,rect.top-viewportTop-gap-margin);",
  "locationDropdown.style.maxHeight = `${maxHeight}px`;",
  "document.addEventListener('pointerdown',this._v407LocationOutsidePointerHandler,true);",
  "path.includes(locationDropdown) || path.includes(settingsLocationButton) || path.includes(locationMainButton)"
];
for (const needle of mustContain) {
  if (!candidate.includes(needle)) throw new Error(`V4.07 candidate contract missing: ${needle}`);
}

if (candidate.includes('device_tracker.see')) throw new Error('Deprecated device_tracker.see must not appear in V4.07 candidate');
if (candidate.includes('save.disabled=true; save.title=text.saveLater')) throw new Error('Save button must be active in TEST7');
if (candidate.includes('const biasedQuery =')) throw new Error('Soft home-country preference must not rewrite the worldwide Nominatim query');
if (candidate.includes("savedSetup:'Zum Speichern einmalig eine lokale To-do-Liste")) throw new Error('Old incomplete Local to-do setup hint must not remain in TEST7');
if (candidate.includes("callService('todo','remove_item'")) throw new Error('Saved-place removal must stay reversible and must not delete To-do items');
if (candidate.includes('aria-label="Close release history">×</button>')) throw new Error('Release History must use the accepted premium image close control');
if (candidate.includes('V4.07 · PLANNED')) throw new Error('Release History must describe the implemented V4.07 candidate, not PLANNED scope');

const languageButtons = candidate.match(/data-release-history-language="(?:de|en)"/g) || [];
if (languageButtons.length !== 2) throw new Error(`Expected exactly two Release History language buttons, got ${languageButtons.length}`);
const languagePanels = candidate.match(/data-release-history-lang="(?:de|en)"/g) || [];
if (languagePanels.length !== 2) throw new Error(`Expected exactly two Release History language panels, got ${languagePanels.length}`);
const v407HistoryEntries = candidate.match(/<div class="release-history-version">V4\.07 · 2026\/09<\/div>/g) || [];
if (v407HistoryEntries.length !== 2) throw new Error(`Expected bilingual V4.07 Release History entries, got ${v407HistoryEntries.length}`);

const settingsOpenStart = candidate.indexOf('      const openSettings = () => {');
const settingsOpenEnd = candidate.indexOf('      const closeSettings = () => {',settingsOpenStart);
if (settingsOpenStart < 0 || settingsOpenEnd < 0) throw new Error('Settings open handler not found');
const settingsOpenBlock = candidate.slice(settingsOpenStart,settingsOpenEnd);
const dropdownCloseIndex = settingsOpenBlock.indexOf('closeLocationDropdown(false);');
const settingsBackdropIndex = settingsOpenBlock.indexOf("settingsBackdrop?.classList.add('open');");
if (dropdownCloseIndex < 0 || settingsBackdropIndex < 0 || dropdownCloseIndex > settingsBackdropIndex) {
  throw new Error('Settings must close the location dropdown before the Settings backdrop opens');
}

const locationPositionStart = candidate.indexOf('      const positionLocationDropdown = (anchor = settingsLocationButton) => {');
const locationPositionEnd = candidate.indexOf('      const renderLocationDropdown = () => {',locationPositionStart);
if (locationPositionStart < 0 || locationPositionEnd < 0) throw new Error('Location dropdown positioning block not found');
const locationPositionBlock = candidate.slice(locationPositionStart,locationPositionEnd);
if (!locationPositionBlock.includes('window.visualViewport')) throw new Error('Location dropdown must size against the visible viewport');
if (!locationPositionBlock.includes('viewportHeight * 0.88')) throw new Error('Location dropdown viewport cap missing');
if (!locationPositionBlock.includes('belowAvailable >= aboveAvailable')) throw new Error('Location dropdown must choose the side with more usable space when needed');

const outsideHandlerStart = candidate.indexOf('      this._v407LocationOutsidePointerHandler = (event) => {');
const outsideHandlerEnd = candidate.indexOf("      document.addEventListener('pointerdown',this._v407LocationOutsidePointerHandler,true);",outsideHandlerStart);
if (outsideHandlerStart < 0 || outsideHandlerEnd < 0) throw new Error('Location dropdown outside-pointer handler not found');
const outsideHandlerBlock = candidate.slice(outsideHandlerStart,outsideHandlerEnd);
if (!outsideHandlerBlock.includes("if (!locationDropdown?.classList.contains('open')) return;")) throw new Error('Outside-pointer handler must ignore a closed location dropdown');
if (!outsideHandlerBlock.includes("const path = typeof event.composedPath === 'function' ? event.composedPath() : [];")) throw new Error('Outside-pointer handler must use composedPath for shadow-DOM-safe hit testing');
if (!outsideHandlerBlock.includes('path.includes(locationDropdown) || path.includes(settingsLocationButton) || path.includes(locationMainButton)')) throw new Error('Outside-pointer handler must preserve menu and trigger interactions');
if (!outsideHandlerBlock.includes('closeLocationDropdown(false);')) throw new Error('Outside-pointer handler must close the location dropdown');

const historyRuntimeStart = candidate.indexOf("      const releaseHistoryGermanLanguages = new Set(['Deutsch'");
const historyRuntimeEnd = candidate.indexOf('      const openReleaseHistory = () => {',historyRuntimeStart);
if (historyRuntimeStart < 0 || historyRuntimeEnd < 0) throw new Error('Release History language runtime not found');
const historyRuntimeBlock = candidate.slice(historyRuntimeStart,historyRuntimeEnd);
for (const dialect of ['Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch']) {
  if (!historyRuntimeBlock.includes(`'${dialect}'`)) throw new Error(`German Release History default mapping missing dialect: ${dialect}`);
}
if (!historyRuntimeBlock.includes("panel.hidden = panel.dataset.releaseHistoryLang !== language;")) throw new Error('Release History must hide the inactive language panel');
if (!historyRuntimeBlock.includes("button.setAttribute('aria-pressed'")) throw new Error('Release History language buttons must expose pressed state');

const order = ['"people":"Personen"','"zones":"Zonen"','"searchAction":"Ort suchen …"','"savedPlaces":"Gespeicherte Orte"']
  .map((needle) => candidate.indexOf(needle));
if (order.some((value) => value < 0) || order.some((value,index) => index > 0 && value <= order[index-1])) {
  throw new Error('V4.07 German dropdown-order contract failed');
}

const isoLine = candidate.match(/const V407_ISO_COUNTRY_CODES = '([^']+)'\.split\(' '\);/);
if (!isoLine) throw new Error('ISO country-code table missing');
const codes = isoLine[1].split(' ');
if (codes.length !== 249 || new Set(codes).size !== 249) throw new Error(`Expected 249 unique ISO country codes, got ${codes.length}/${new Set(codes).size}`);

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
  throw new Error(`External URL inventory changed. Expected ${JSON.stringify(expectedUrlLiterals)}, got ${JSON.stringify(urlLiterals)}`);
}
if ((candidate.match(/wss?:\/\//g) || []).length) throw new Error('Unexpected WebSocket URL literal added to V4.07 frontend');

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
if (worldwideTokio[0]?.countryCode !== 'JP') throw new Error('TEST7 ranking regression: famous Tokio/Japan must outrank the German namesake without an explicit country filter');
const hardGermanTokio = rank(tokioCandidates,'Tokio','DE','');
if (hardGermanTokio[0]?.countryCode !== 'DE') throw new Error('TEST7 ranking regression: explicit DE country filter must remain dominant');

console.log('V4.07 location-search TEST7 contract: PASS');
console.log(`ISO countries: ${codes.length}`);
console.log(`Tokio worldwide ranking: ${worldwideTokio.map((item) => item.countryCode).join(' > ')}`);
console.log(`External URL literals: ${urlLiterals.length} (including non-network SVG namespace)`);
console.log('Location dropdown outside-pointer dismissal: GUARDED');
console.log('External-services premium network icon: PRESENT');
console.log('Release History DE/EN switch and bilingual V4.07 entry: GUARDED');

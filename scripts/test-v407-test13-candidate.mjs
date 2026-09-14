import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>readFile(resolve(root,'artifacts/v407',name),'utf8');
const [candidate,defaultAlias,legacyAlias,b12]=await Promise.all([
  read('gewitterradar-v4.07.13.js'),
  read('gewitterradar.js'),
  read('gewitterradar-v4.07-test.js'),
  read('gewitterradar-v4.07.12B.js'),
]);

if (candidate!==defaultAlias || candidate!==legacyAlias) throw new Error('TEST13 default/legacy aliases must equal V4.07.13');
if (candidate===b12) throw new Error('TEST13 must differ from TEST12B');

const required=[
  "const CARD_DISPLAY_VERSION = '4.07.13';",
  "const GEWITTERRADAR_BUILD = 'V4.07-TEST13-2026-09-14';",
  "const HELP_PREMIUM_ICON_VARIANT = 'B';",
  'const HELP_REFINED_ICONS = Object.freeze',
  'data:image/svg+xml;base64,',
  "HELP_REFINED_ICONS.question",
  "troubleshooting:HELP_REFINED_ICONS.troubleshooting",
  `<img src="' + ABOUT_CLOSE_IMAGE + '" alt="" width="34" height="34" draggable="false">`,
  '.help-close{position:relative!important;top:-4px!important;right:-4px!important}',
  '.help-close img{width:34px!important;height:34px!important;filter:none!important}',
  '.help-section-icon[data-help-icon="troubleshooting"] img',
  '.help-network-highlight{color:#f2cf82;',
  'const helpNetworkTokenPattern=',
  'release-history-language-toggle',
  'v407-location-query-clear',
];
for (const needle of required) if (!candidate.includes(needle)) throw new Error(`TEST13 missing ${needle}`);

const forbidden=[
  "const CARD_DISPLAY_VERSION = '4.07.12B';",
  "const GEWITTERRADAR_BUILD = 'V4.07-TEST12B-2026-09-14';",
  `<button class="help-close" type="button" aria-label="Close"><img src="' + HELP_PREMIUM_ICONS.close + '"`,
];
for (const needle of forbidden) if (candidate.includes(needle)) throw new Error(`TEST13 still contains obsolete marker ${needle}`);

for (const stable of [
  'geocoding-api.open-meteo.com',
  'nominatim.openstreetmap.org',
  'blitzortung.ha.sed.pl',
  'HTTPS/TCP 443',
  'MQTT/TCP 1883',
  'Open-Meteo Geocoding',
  'OpenStreetMap Nominatim',
  'Leaflet 1.9.4',
  'Blitzortung v1.7.1',
  'GitHub/HACS',
  'device_tracker.gewitterradar_dashboard',
  'gewitterradar.set_reference_coordinates',
  'V407_HELP_COPY = Object.freeze',
]) {
  if (!candidate.includes(stable)) throw new Error(`TEST13 lost stable TEST12 content: ${stable}`);
}

console.log('V4.07.13 Help polish contract: PASS');
console.log('Selected TEST12B network shield preserved; question and troubleshooting masters refined; legacy premium close restored and shifted 4px up/right.');

import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>readFile(resolve(root,'artifacts/v407',name),'utf8');
const [a,b,defaultAlias,legacyAlias]=await Promise.all([
  read('gewitterradar-v4.07.12A.js'),
  read('gewitterradar-v4.07.12B.js'),
  read('gewitterradar.js'),
  read('gewitterradar-v4.07-test.js'),
]);
if (a!==defaultAlias || a!==legacyAlias) throw new Error('TEST12 default/legacy aliases must equal variant A');

for (const [label,text,display,build,variant] of [
  ['A',a,'4.07.12A','V4.07-TEST12A-2026-09-14','A'],
  ['B',b,'4.07.12B','V4.07-TEST12B-2026-09-14','B'],
]) {
  const required=[
    `const CARD_DISPLAY_VERSION = '${display}';`,
    `const GEWITTERRADAR_BUILD = '${build}';`,
    `const HELP_PREMIUM_ICON_VARIANT = '${variant}';`,
    '.help-network-highlight{color:#f2cf82;',
    'const helpNetworkTokenPattern=',
    "token.className='help-network-highlight'",
    'setHelpDiagnosticText(p,text)',
    'setHelpDiagnosticText(li,text)',
    'setHelpDiagnosticText(dt,term)',
    'setHelpDiagnosticText(dd,text)',
    'geocoding-api.open-meteo.com',
    'nominatim.openstreetmap.org',
    'unpkg.com',
    'a.tile.openstreetmap.org',
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
    'release-history-language-toggle',
    'v407-location-query-clear',
  ];
  for (const needle of required) if (!text.includes(needle)) throw new Error(`TEST12${label} missing ${needle}`);
  if (text.includes(`const CARD_DISPLAY_VERSION = '4.07.11${variant}';`)) throw new Error(`TEST12${label} still exposes V4.07.11`);
}
if (a===b) throw new Error('TEST12A and TEST12B must retain distinct external-services premium shields');
console.log('V4.07.12 golden Help network diagnostic highlighting contract: PASS');
console.log('Domains, ports/protocols, named network services and local service/entity identifiers are highlighted without changing the underlying help text.');

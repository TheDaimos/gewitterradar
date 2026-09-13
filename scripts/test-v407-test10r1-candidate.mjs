import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const bytes = await readFile(resolve(root,'artifacts/v407/gewitterradar.js'));
const candidate = bytes.toString('utf8');
const digest = createHash('sha256').update(bytes).digest('hex');

const required = [
  "const CARD_VERSION = '4.07';",
  "const CARD_DISPLAY_VERSION = '4.07.10';",
  "const GEWITTERRADAR_BUILD = 'V4.07-TEST10R1-2026-09-13';",
  'v407-location-query-clear',
  '.v407-location-query-clear.is-visible,',
  '#v407-location-query:not(:placeholder-shown) + .v407-location-query-clear',
  "['input','change','keyup','search','focus'].forEach((eventName) => queryInput.addEventListener(eventName,syncV407QueryClear));",
  "clearQueryButton.classList.toggle('is-visible',visible);",
  "clearQueryButton.setAttribute('aria-hidden',visible ? 'false' : 'true');",
  'clearQueryButton.tabIndex = visible ? 0 : -1;',
  'aria-hidden="true" tabindex="-1">×</button>',
  '>V${CARD_DISPLAY_VERSION}</span></h1>',
  '${BUILD_YYYY_MM} · V${CARD_DISPLAY_VERSION}',
  "version:CARD_DISPLAY_VERSION,releaseVersion:CARD_VERSION",
  'const V407_LOCATION_TEXTS = Object.freeze',
  'M9.35 9v1.55M10.7 9v1.55'
];
for (const needle of required) if (!candidate.includes(needle)) throw new Error(`TEST10R1 contract missing: ${needle}`);
if (candidate.includes('v407-location-query-clear[hidden]')) throw new Error('Desktop clear must not depend on hidden attribute CSS');
if (candidate.includes('class="v407-location-query-clear" aria-label="${v407ClearQueryLabel()}" title="${v407ClearQueryLabel()}" hidden')) throw new Error('Desktop clear markup still starts hidden');
if (candidate.includes('v407-location-query-wrap')) throw new Error('TEST10R1 must preserve accepted query DOM without wrapper');

const expectedDigest='358ce310c14ba609b9d840f39a28ef6499cdbcae24f6672cfc8001ec5acba0aa';
if (digest !== expectedDigest) throw new Error(`TEST10R1 byte contract changed: expected ${expectedDigest}, got ${digest}`);
if (bytes.length !== 1769874) throw new Error(`TEST10R1 byte length changed: expected 1769874, got ${bytes.length}`);

console.log('V4.07 TEST10R1 desktop clear + visible version contract: PASS');
console.log(`Bytes: ${bytes.length}`);
console.log(`SHA256: ${digest}`);

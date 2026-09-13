import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>readFile(resolve(root,'artifacts/v407',name),'utf8');
const [a,b,defaultAlias,legacyAlias]=await Promise.all([
  read('gewitterradar-v4.07.11A.js'),read('gewitterradar-v4.07.11B.js'),read('gewitterradar.js'),read('gewitterradar-v4.07-test.js')
]);
if (a!==defaultAlias || a!==legacyAlias) throw new Error('TEST11 default/legacy aliases must equal variant A');
for (const [label,text,display,build,variant] of [
  ['A',a,'4.07.11A','V4.07-TEST11A-2026-09-13','A'],
  ['B',b,'4.07.11B','V4.07-TEST11B-2026-09-13','B'],
]) {
  const required=[
    `const CARD_DISPLAY_VERSION = '${display}';`,
    `const GEWITTERRADAR_BUILD = '${build}';`,
    `const HELP_PREMIUM_ICON_VARIANT = '${variant}';`,
    'const HELP_PREMIUM_ICONS = Object.freeze',
    'data:image/svg+xml;base64,',
    'premiumHelpIconImages=HELP_PREMIUM_ICONS.sections',
    'help-section-icon img',
    '>V${CARD_DISPLAY_VERSION}</span></h1>',
    'release-history-language-toggle',
    'v407-location-query-clear',
  ];
  for (const needle of required) if (!text.includes(needle)) throw new Error(`TEST11${label} missing ${needle}`);
  for (const key of ['prerequisites','radii','location','external_services','functions','defaults','troubleshooting','recorder']) {
    if (!text.includes(`"${key}":"data:image/svg+xml;base64,`)) throw new Error(`TEST11${label} missing premium icon ${key}`);
  }
  if (text.includes('<span class="help-emblem" aria-hidden="true">?</span>')) throw new Error(`TEST11${label} still uses text question emblem`);
  if (text.includes(`<img src="' + ABOUT_CLOSE_IMAGE + '" alt="" width="34" height="34" draggable="false"></button></header><div class="help-content"></div></dialog>`)) throw new Error(`TEST11${label} still uses old Help close image`);
}
if (a===b) throw new Error('TEST11A and TEST11B must differ');
console.log('V4.07.11 premium Help icon contract: PASS');
console.log('A: premium shield variant 2');
console.log('B: premium RJ45/network-plug shield');

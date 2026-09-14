import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const read=name=>readFile(resolve(outDir,name),'utf8');
const [candidate,alias,legacy]=await Promise.all([
  read('gewitterradar-v4.07.14.js'),
  read('gewitterradar.js'),
  read('gewitterradar-v4.07-test.js'),
]);
if (candidate!==alias || candidate!==legacy) throw new Error('TEST14 aliases must equal V4.07.14 candidate');

const required=[
  "const CARD_DISPLAY_VERSION = '4.07.14';",
  "const GEWITTERRADAR_BUILD = 'V4.07-TEST14-2026-09-14';",
  "const HELP_PREMIUM_ICON_VARIANT = 'B';",
  'const HELP_REFINED_ICONS_V3 = Object.freeze',
  "HELP_REFINED_ICONS_V3.question",
  'troubleshooting:HELP_REFINED_ICONS_V3.troubleshooting',
  '.help-close{position:relative!important;top:-10px!important;right:-6px!important}',
  '.help-emblem img{width:44px!important;height:44px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:none!important}',
  '.help-section-icon[data-help-icon="troubleshooting"] img{width:36px!important;height:36px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:none!important}',
  '.help-network-highlight{color:#f2cf82;',
  'release-history-language-toggle',
  'v407-location-query-clear',
];
for (const needle of required) if (!candidate.includes(needle)) throw new Error(`TEST14 missing ${needle}`);

if (!candidate.includes('data:image/svg+xml;base64,')) throw new Error('TEST14 embedded refined icons missing');
if (candidate.includes("const CARD_DISPLAY_VERSION = '4.07.13';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST13-2026-09-14';")) throw new Error('TEST14 still exposes TEST13 display/build marker');
if (!candidate.includes("<img src=\"' + ABOUT_CLOSE_IMAGE + '\" alt=\"\" width=\"34\" height=\"34\" draggable=\"false\">")) throw new Error('TEST14 legacy premium close image not retained');

console.log('V4.07.14 Help icon clarity/placement contract: PASS');
console.log('Question and troubleshooting use V3 Hi-Res masters; selected network shield B and golden diagnostics remain intact; close control is moved nearer the upper-right edge.');

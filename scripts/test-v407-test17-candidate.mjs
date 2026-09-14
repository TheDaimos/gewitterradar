import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const js=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.17.js'),'utf8');
const must=[
  "const CARD_DISPLAY_VERSION = '4.07.17';",
  "V4.07-TEST17-2026-09-14",
  "HELP_REFINED_ICONS_V6",
  "radii:HELP_REFINED_ICONS_V6.radii",
  "troubleshooting:HELP_REFINED_ICONS_V5.troubleshooting",
  "HELP_REFINED_ICONS_V5.question",
  "const HELP_PREMIUM_ICON_VARIANT = 'B';",
  "top:-18px!important;right:-10px!important"
];
for(const marker of must)if(!js.includes(marker))throw new Error(`TEST17 missing marker: ${marker}`);
if(!js.includes('data:image/svg+xml;base64,'))throw new Error('TEST17 embedded SVG data missing');
if(js.includes('const premiumHelpIconImages={...HELP_PREMIUM_ICONS.sections,troubleshooting:HELP_REFINED_ICONS_V5.troubleshooting};'))throw new Error('TEST17 old radius map still active');
console.log('V4.07.17 radius icon contract PASS');

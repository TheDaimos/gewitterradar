import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const js=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.18.js'),'utf8');
const must=[
  "const CARD_DISPLAY_VERSION = '4.07.18';",
  "V4.07-TEST18-2026-09-14",
  'radii:HELP_REFINED_ICONS_V6.radii',
  'HELP_REFINED_ICONS_V5.question',
  'HELP_REFINED_ICONS_V5.troubleshooting',
  "const HELP_PREMIUM_ICON_VARIANT = 'B';",
  'id="v407-location-query" type="text" inputmode="search" enterkeyhint="search"',
  '#v407-location-query { padding-right:40px;-webkit-appearance:none;appearance:none;position:relative;z-index:1; }',
  'z-index:4;touch-action:manipulation;-webkit-tap-highlight-color:transparent;'
];
for(const marker of must)if(!js.includes(marker))throw new Error(`TEST18 missing marker: ${marker}`);
if(js.includes('id="v407-location-query" type="search"'))throw new Error('TEST18 still uses native WebKit searchfield for the query input');
if(!js.includes("clearQueryButton.addEventListener('click'"))throw new Error('TEST18 lost custom clear click behavior');
if(!js.includes("['input','change','keyup','search','focus'].forEach"))throw new Error('TEST18 lost clear visibility synchronization');
console.log('V4.07.18 iPad postcode clear-control contract PASS');

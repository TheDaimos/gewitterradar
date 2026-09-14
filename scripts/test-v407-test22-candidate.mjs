import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const js=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.22.js'),'utf8');

const must=[
  "const CARD_DISPLAY_VERSION = '4.07.22';",
  'V4.07-TEST22-2026-09-14',
  '.settings-collapsible[open] > .settings-section-content {',
  'max-height:clamp(132px,calc(100vh - 440px),520px);',
  'max-height:clamp(132px,calc(100dvh - 440px),520px);',
  'overflow-y:auto;',
  'overflow-x:hidden;',
  'overscroll-behavior-y:contain;',
  '-webkit-overflow-scrolling:touch;',
  '.settings-collapsible[open] > .settings-section-content::-webkit-scrollbar',
  '.settings-body {\n            flex:1 1 auto;\n            min-height:0;\n            overflow-y:auto;',
  'diagnostic-main-cell',
  'v407LocationDialogLanguage',
  'class="v407-location-country-clear"',
  'radii:HELP_REFINED_ICONS_V6.radii'
];
for(const marker of must)if(!js.includes(marker))throw new Error(`TEST22 missing marker: ${marker}`);

const selector='.settings-collapsible[open] > .settings-section-content {';
if(js.split(selector).length!==2)throw new Error('TEST22 zoom-safe accordion rule must exist exactly once');
const block=js.slice(js.indexOf(selector),js.indexOf('}',js.indexOf(selector))+1);
if(block.includes('overflow-y:scroll'))throw new Error('TEST22 must not force a scrollbar when content fits');
if(!block.includes('overflow-y:auto'))throw new Error('TEST22 must use conditional overflow-y:auto');
if(!block.includes('100dvh'))throw new Error('TEST22 must respond to dynamic viewport height / browser zoom');

if(!js.includes('@media (orientation:landscape) and (hover:none) and (pointer:coarse) and (max-height:600px)'))throw new Error('TEST22 lost existing touch-landscape compatibility path');
if(!js.includes("this._diagnostics.enabled=false;this._diagnostics.selecting=false;this._diagnostics.live=false"))throw new Error('TEST22 lost diagnostic deterministic cleanup');

console.log('V4.07.22 zoom-safe Settings accordion scroll contract PASS');

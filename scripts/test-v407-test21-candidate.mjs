import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const js=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.21.js'),'utf8');

const must=[
  "const CARD_DISPLAY_VERSION = '4.07.21';",
  'V4.07-TEST21-2026-09-14',
  '.diagnostic-console.open { display:flex;flex-direction:column; }',
  '.diagnostic-console-head { position:relative;z-index:3;display:flex;flex:0 0 auto;',
  'padding:8px 8px 14px;min-height:0;max-height:none;box-sizing:border-box;overflow:auto;',
  '.diagnostic-console-body { display:block;min-height:0;max-height:none;flex:1 1 auto; }',
  "const requestedLanguage = String(this._languageValue() || 'English');",
  'backdrop && backdrop.dataset.v407Language === requestedLanguage',
  'if (backdrop) { backdrop.remove(); backdrop = null; }',
  'backdrop.dataset.v407Language = requestedLanguage;',
  '<span class="kpi-label">Treffer · 60 Min</span>',
  "this._renderDiagnosticMainGrid(overlay);",
  'class="v407-location-country-clear"',
  'radii:HELP_REFINED_ICONS_V6.radii'
];
for(const marker of must)if(!js.includes(marker))throw new Error(`TEST21 missing marker: ${marker}`);

if(js.includes('.diagnostic-console.open { display:block; }'))throw new Error('TEST21 still uses clipped block console layout');
if(js.includes('.diagnostic-console-body { display:block;max-height:calc(100dvh - 94px); }'))throw new Error('TEST21 still uses brittle compact diagnostic max-height');
if(js.includes("let backdrop = this.shadow.getElementById('v407-location-search-backdrop');\n        if (backdrop) return backdrop;"))throw new Error('TEST21 still returns a stale translated location dialog');

const ensure=js.match(/const v407EnsureLocationSearchDialog = \(\) => \{([\s\S]*?)\n      \};\n      const openV407LocationSearch/);
if(!ensure)throw new Error('TEST21 location-search ensure function not found');
const body=ensure[1];
for(const marker of ['requestedLanguage','dataset.v407Language','backdrop.remove()','const text = v407Text()'])if(!body.includes(marker))throw new Error(`TEST21 locale invalidation missing ${marker}`);
if(body.indexOf('backdrop.remove()')>body.indexOf('const text = v407Text()'))throw new Error('TEST21 must invalidate stale modal before resolving fresh translated text');

const scrollBlock=js.match(/\.diagnostic-console-body \{ display:grid;([^}]*)\}/);
if(!scrollBlock)throw new Error('TEST21 diagnostic scroll body not found');
for(const marker of ['min-height:0','max-height:none','overflow:auto','flex:1 1 auto','scroll-padding-bottom:14px'])if(!scrollBlock[1].includes(marker))throw new Error(`TEST21 diagnostic scroll contract missing ${marker}`);

console.log('V4.07.21 diagnostic bottom-scroll + runtime location-language invalidation contract PASS');

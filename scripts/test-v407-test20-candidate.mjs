import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const js=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.20.js'),'utf8');

const must=[
  "const CARD_DISPLAY_VERSION = '4.07.20';",
  'V4.07-TEST20-2026-09-14',
  '<span class="kpi-label">Treffer · 60 Min</span>',
  "['Treffer · 60 Min','kpi.hits_60']",
  "const main=this.shadow?.querySelector('.main-grid')",
  'const columns=10,rows=10',
  "'MAIN · A1–J10'",
  'cell.dataset.diagnosticMainCell=label',
  'this._renderDiagnosticMainGrid(overlay);',
  '.diagnostic-main-frame',
  '.diagnostic-main-cell',
  'class="v407-location-country-clear"',
  "notes:[copy.ln.join(' ')]",
  'radii:HELP_REFINED_ICONS_V6.radii',
  "const HELP_PREMIUM_ICON_VARIANT = 'B';"
];
for(const marker of must)if(!js.includes(marker))throw new Error(`TEST20 missing marker: ${marker}`);
if(js.includes('<span class="kpi-label">Treffer · 60 min</span>'))throw new Error('TEST20 still contains the lower-case KPI source text that bypasses static i18n');

const hits=[...js.matchAll(/["']kpi\.hits_60["']\s*:\s*["']([^"']+)["']/g)].map(match=>match[1]);
if(hits.length!==19)throw new Error(`TEST20 expected 19 kpi.hits_60 translations, got ${hits.length}`);
if(hits.some(value=>!value.trim()))throw new Error('TEST20 contains an empty kpi.hits_60 translation');
if(!hits.includes('Κεραυνοί · 60 λεπτά'))throw new Error('TEST20 lost Greek kpi.hits_60 translation');

const mainGridBlock=js.match(/_renderDiagnosticMainGrid\(overlay\) \{([\s\S]*?)\n    \}\n\n    _renderDiagnosticOverlay/);
if(!mainGridBlock)throw new Error('TEST20 Main diagnostic-grid renderer not found');
for(const guard of ["!this._diagnostics.enabled","!this._diagnostics.visualsVisible","this._diagnostics.grid==='off'"]){if(!mainGridBlock[1].includes(guard))throw new Error(`TEST20 Main grid lost DEV-only guard: ${guard}`);}
if(!js.includes("this.shadow?.getElementById('diagnostic-overlay')?.replaceChildren();"))throw new Error('TEST20 lost deterministic diagnostic overlay cleanup');
if(!js.includes("this._diagnostics.enabled=false;this._diagnostics.selecting=false;this._diagnostics.live=false"))throw new Error('TEST20 lost diagnostic stop state cleanup');

console.log(`V4.07.20 KPI i18n + addressable Main diagnostic grid contract PASS (${hits.length} KPI languages, A1–J10)`);

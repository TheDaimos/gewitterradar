import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.25.js'),'utf8');

if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.25';")||!source.includes('V4.07-TEST25-2026-09-14'))throw new Error('TEST25 version/build marker missing');
if(source.includes("const CARD_DISPLAY_VERSION = '4.07.24';")||source.includes('V4.07-TEST24-2026-09-14'))throw new Error('TEST24 version/build marker leaked into TEST25');

/* Accepted TEST24 content and semantics remain frozen. */
for(const marker of [
  "title:'Standort & gespeicherte Orte'",
  "title:'Location & saved places'",
  'Mit × wird ein Ort nicht sofort gelöscht, sondern zur Löschung vorgemerkt.',
  '× does not delete a place immediately; it marks the place for removal.',
  "help-action-token help-action-save",
  "help-action-token help-action-delete",
  "help-action-token help-action-restore",
  "help-process-highlight",
  'radii:HELP_REFINED_ICONS_V6.radii',
  'max-height:clamp(132px,calc(100dvh - 440px),520px);'
])if(!source.includes(marker))throw new Error(`Accepted TEST24 marker regressed: ${marker}`);

/* V4.07.25 clarity contract: crisp filled controls instead of metallic gradient glyphs. */
for(const marker of [
  '.help-action-token{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box',
  '.help-action-save{min-height:1.48em;padding:.10em .42em;border:1px solid #f4cc70',
  '.help-action-delete,.help-action-restore{width:1.42em;height:1.42em',
  '.help-action-delete{border:1px solid #f18378;background:linear-gradient(180deg,#bf5147',
  '.help-action-restore{border:1px solid #8ed0fa;background:linear-gradient(180deg,#4b99cc',
  '.help-process-highlight{display:inline-block;padding:1px 7px;border:1px solid rgba(255,213,116,.88)',
  'color:#fff!important;-webkit-background-clip:border-box!important;background-clip:border-box!important'
])if(!source.includes(marker))throw new Error(`TEST25 clarity marker missing: ${marker}`);

for(const obsolete of [
  'color:transparent!important;filter:drop-shadow(0 1px 1px rgba(0,0,0,.75))',
  '.help-action-delete{background:linear-gradient(180deg,#ffd8d1 0%,#e86a5d',
  '.help-action-restore{background:linear-gradient(180deg,#e1f4ff 0%,#75bcea'
])if(source.includes(obsolete))throw new Error(`TEST24 indistinct token styling leaked into TEST25: ${obsolete}`);

if(!source.includes('ABOUT_EXTERNAL_LANGUAGE_NAMES'))throw new Error('External Help-locale architecture marker regressed');

console.log('V4.07.25 inline Help token clarity contract PASS');
console.log('TEST25 is based on exact immutable V4.07.24 and only sharpens the semantic inline controls plus version/build bump.');

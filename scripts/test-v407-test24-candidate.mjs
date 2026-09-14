import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.24.js'),'utf8');

if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.24';")||!source.includes('V4.07-TEST24-2026-09-14'))throw new Error('TEST24 version/build marker missing');
if(source.includes("const CARD_DISPLAY_VERSION = '4.07.23';")||source.includes('V4.07-TEST23-2026-09-14'))throw new Error('TEST23 version/build marker leaked into TEST24');

/* TEST23 accepted content remains frozen. */
for(const marker of [
  "title:'Standort & gespeicherte Orte'",
  "title:'Location & saved places'",
  'radii:HELP_REFINED_ICONS_V6.radii',
  'help-radius-list',
  'help-radius-item',
  'help-radius-bullet',
  'help-recorder-priority',
  'max-height:clamp(132px,calc(100dvh - 440px),520px);',
  '#settings-diagnostic-section[open]>.settings-section-content{padding-bottom:72px!important;scroll-padding-bottom:72px}'
])if(!source.includes(marker))throw new Error(`Accepted TEST23 marker regressed: ${marker}`);

/* V4.07.24 change set: saved-place semantics and premium action tokens. */
if(!source.includes('Mit × wird ein Ort nicht sofort gelöscht, sondern zur Löschung vorgemerkt.'))throw new Error('German TEST24 removal wording missing');
if(source.includes('Mit × wird ein Ort weich entfernt; der zugehörige To-do-Eintrag wird lediglich als erledigt markiert.'))throw new Error('Old German soft-removal wording still present');
if(!source.includes('× does not delete a place immediately; it marks the place for removal.'))throw new Error('English TEST24 removal wording missing');
if(source.includes('× performs a soft removal by marking the matching to-do item completed.'))throw new Error('Old English soft-removal wording still present');

for(const marker of [
  '★ Speichern|★ Save|Location entity|×|↶|device_tracker',
  "help-action-token help-action-save",
  "help-action-token help-action-delete",
  "help-action-token help-action-restore",
  "help-process-highlight",
  '.help-dialog{height:auto!important;min-height:0!important;max-height:min(900px,calc(100dvh - 16px))!important}',
  '.help-content{flex:0 1 auto}',
  '.help-action-save{background:linear-gradient',
  '.help-action-delete{background:linear-gradient',
  '.help-action-restore{background:linear-gradient'
])if(!source.includes(marker))throw new Error(`TEST24 semantic/visual marker missing: ${marker}`);

/* Architecture remains unchanged: DE/EN native, other Help locales external. */
if(!source.includes('ABOUT_EXTERNAL_LANGUAGE_NAMES'))throw new Error('External Help-locale architecture marker regressed');

console.log('V4.07.24 Help review contract PASS');
console.log('TEST24 is based on exact immutable V4.07.23 and contains only the intended review delta plus version/build bump.');

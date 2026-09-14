import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.26.js'),'utf8');

if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.26';")||!source.includes('V4.07-TEST26-2026-09-14'))throw new Error('TEST26 version/build marker missing');
if(source.includes("const CARD_DISPLAY_VERSION = '4.07.25';")||source.includes('V4.07-TEST25-2026-09-14'))throw new Error('TEST25 version/build marker leaked into TEST26');

for(const marker of [
  "title:'Standort & gespeicherte Orte'",
  "title:'Location & saved places'",
  'Mit × wird ein Ort nicht sofort gelöscht, sondern zur Löschung vorgemerkt.',
  '× does not delete a place immediately; it marks the place for removal.',
  'help-action-token help-action-save',
  'help-action-token help-action-delete',
  'help-action-token help-action-restore',
  'help-process-highlight',
  'radii:HELP_REFINED_ICONS_V6.radii',
  'max-height:clamp(132px,calc(100dvh - 440px),520px);'
])if(!source.includes(marker))throw new Error(`Accepted TEST25 marker regressed: ${marker}`);

for(const marker of [
  '.help-action-save{min-height:1.40em;padding:.08em .38em;border:1px solid #c7ad68;border-radius:.24em',
  'background:linear-gradient(165deg,#6f5929 0%,#a58b4f 34%,#8a713b 58%,#655025 100%)',
  '.help-action-delete,.help-action-restore{width:1.34em;height:1.34em',
  '.help-action-delete{border:1px solid #b97770;background:linear-gradient(165deg,#6d3733 0%,#99564f 36%,#7f4540 60%,#5b2c29 100%)}',
  '.help-action-restore{border:1px solid #789db4;background:linear-gradient(165deg,#35576c 0%,#577d95 36%,#456a80 60%,#2d495b 100%)}',
  'box-shadow:inset 0 1px rgba(255,255,255,.14),inset 0 -1px rgba(0,0,0,.28),0 1px 1px rgba(0,0,0,.52)'
])if(!source.includes(marker))throw new Error(`TEST26 satin-metal marker missing: ${marker}`);

for(const obsolete of [
  '.help-action-save{min-height:1.48em;padding:.10em .42em;border:1px solid #f4cc70',
  '.help-action-delete{border:1px solid #f18378;background:linear-gradient(180deg,#bf5147',
  '.help-action-restore{border:1px solid #8ed0fa;background:linear-gradient(180deg,#4b99cc',
  '0 0 5px rgba(229,177,65,.30)',
  '0 0 5px rgba(227,85,72,.28)',
  '0 0 5px rgba(83,164,219,.30)'
])if(source.includes(obsolete))throw new Error(`Glossy TEST25 token styling leaked into TEST26: ${obsolete}`);

if(!source.includes('ABOUT_EXTERNAL_LANGUAGE_NAMES'))throw new Error('External Help-locale architecture marker regressed');

console.log('V4.07.26 satin metallic Help token contract PASS');
console.log('TEST26 is based on exact immutable V4.07.25 and only refines save/delete/restore visual treatment plus version/build bump.');

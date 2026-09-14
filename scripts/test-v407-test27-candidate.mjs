import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.27.js'),'utf8');

if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.27';")||!source.includes('V4.07-TEST27-2026-09-14'))throw new Error('TEST27 version/build marker missing');
if(source.includes("const CARD_DISPLAY_VERSION = '4.07.26';")||source.includes('V4.07-TEST26-2026-09-14'))throw new Error('TEST26 version/build marker leaked into TEST27');

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
])if(!source.includes(marker))throw new Error(`Accepted TEST26 marker regressed: ${marker}`);

for(const marker of [
  '.help-action-save{height:1.48em;min-height:1.48em;padding:0 .46em;border:1px solid #9e8348;border-radius:.26em',
  'repeating-linear-gradient(96deg,rgba(255,255,255,.028) 0 1px,rgba(0,0,0,.030) 1px 3px)',
  'inset 0 -1px 0 rgba(28,19,6,.72)',
  '.help-action-delete,.help-action-restore{width:1.48em;height:1.48em;flex:0 0 1.48em',
  'text-indent:-9999px;color:transparent!important;text-shadow:none!important',
  '.help-action-delete:before,.help-action-restore:before{position:absolute;left:50%;top:50%;text-indent:0',
  '.help-action-delete:before{content:"×";transform:translate(-50%,-53%)',
  '.help-action-restore:before{content:"↶";transform:translate(-50%,-52%)',
  'background-blend-mode:soft-light,soft-light,normal'
])if(!source.includes(marker))throw new Error(`TEST27 machined-metal marker missing: ${marker}`);

for(const obsolete of [
  '.help-action-save{min-height:1.40em;padding:.08em .38em;border:1px solid #c7ad68',
  '.help-action-delete,.help-action-restore{width:1.34em;height:1.34em',
  '.help-action-delete{border:1px solid #b97770;background:linear-gradient(165deg,#6d3733',
  '.help-action-restore{border:1px solid #789db4;background:linear-gradient(165deg,#35576c'
])if(source.includes(obsolete))throw new Error(`Flat TEST26 token styling leaked into TEST27: ${obsolete}`);

if(!source.includes('ABOUT_EXTERNAL_LANGUAGE_NAMES'))throw new Error('External Help-locale architecture marker regressed');

console.log('V4.07.27 deep machined-metal Help token contract PASS');
console.log('TEST27 is based on exact immutable V4.07.26 and only refines save/delete/restore depth, texture, detailing and glyph centering plus version/build bump.');

import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.28.js'),'utf8');

if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.28';")||!source.includes('V4.07-TEST28-2026-09-14'))throw new Error('TEST28 version/build marker missing');
if(source.includes("const CARD_DISPLAY_VERSION = '4.07.27';")||source.includes('V4.07-TEST27-2026-09-14'))throw new Error('TEST27 version/build marker leaked into TEST28');

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
])if(!source.includes(marker))throw new Error(`Accepted TEST27 marker regressed: ${marker}`);

for(const marker of [
  '★ Speichern legt gefundene Orte dauerhaft lokal ab.',
  '.help-action-save{height:1.56em;min-height:1.56em;padding:0 .52em;border:1px solid #b49753',
  'repeating-linear-gradient(0deg,rgba(255,255,255,.026) 0 1px,rgba(0,0,0,.025) 1px 3px)',
  'inset 0 0 0 2px rgba(238,210,141,.07)',
  '.help-action-save:before{content:"";position:absolute;inset:2px',
  '.help-action-delete,.help-action-restore{width:1.56em;height:1.56em;flex:0 0 1.56em',
  'repeating-conic-gradient(from 12deg,rgba(255,255,255,.022) 0deg 2deg,rgba(0,0,0,.030) 2deg 5deg)',
  '.help-action-delete:after,.help-action-restore:after{content:"";position:absolute;inset:2px',
  '.help-action-restore:before{content:"↶";top:43%;transform:translate(-50%,-50%)',
  'background-blend-mode:soft-light,soft-light,normal'
])if(!source.includes(marker))throw new Error(`TEST28 premium-plus marker missing: ${marker}`);

for(const obsolete of [
  '„★ Speichern“ legt gefundene Orte dauerhaft lokal ab.',
  '.help-action-save{height:1.48em;min-height:1.48em;padding:0 .46em;border:1px solid #9e8348',
  '.help-action-delete,.help-action-restore{width:1.48em;height:1.48em;flex:0 0 1.48em',
  '.help-action-restore:before{content:"↶";transform:translate(-50%,-52%)'
])if(source.includes(obsolete))throw new Error(`TEST27 styling/text leaked into TEST28: ${obsolete}`);

if(!source.includes('ABOUT_EXTERNAL_LANGUAGE_NAMES'))throw new Error('External Help-locale architecture marker regressed');

console.log('V4.07.28 premium-plus Help control contract PASS');
console.log('TEST28 is based on exact immutable V4.07.27 and only refines save/delete/restore metal depth/detail, raises the undo glyph optically, removes German save-button quotation marks, and bumps version/build.');

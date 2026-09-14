import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=await readFile(resolve(root,'artifacts/v407/gewitterradar-v4.07.23.js'),'utf8');

const required=[
  'Mit × wird ein Ort nicht sofort gelöscht, sondern zur Löschung vorgemerkt.',
  '× does not delete a place immediately; it marks the place for removal.',
  'help-action-save',
  'help-action-delete',
  'help-action-restore',
  'help-process-highlight',
  "tokenText==='Location entity'",
  '.help-dialog{height:auto!important;min-height:0!important;max-height:min(900px,calc(100dvh - 16px))!important}',
  '.help-content{flex:0 1 auto}'
];
for(const marker of required)if(!source.includes(marker))throw new Error(`V4.07.23 review-3 marker missing: ${marker}`);

if(source.includes('weich entfernt'))throw new Error('German soft-removal wording still present');
if(source.includes('performs a soft removal'))throw new Error('English soft-removal wording still present');

const patternStart=source.indexOf('const helpNetworkTokenPattern='),patternEnd=source.indexOf(';',patternStart);
if(patternStart<0||patternEnd<0)throw new Error('Help semantic token pattern missing');
const pattern=source.slice(patternStart,patternEnd);
for(const marker of ['★ Speichern','★ Save','Location entity','×','↶'])if(!pattern.includes(marker))throw new Error(`Semantic Help token missing from pattern: ${marker}`);

/* The already approved radius presentation must remain untouched. */
for(const marker of ['help-radius-bullet','conic-gradient(from 215deg','#6fb7e866','#d65a5066'])if(!source.includes(marker))throw new Error(`Approved radius marker regressed: ${marker}`);

/* DE/EN stay native; external locale file remains separate for later global rollout. */
if(!source.includes('ABOUT_EXTERNAL_LANGUAGE_NAMES')||!source.includes("Deutsch: {")||!source.includes("English: {"))throw new Error('Locale architecture regressed');

console.log('V4.07.23 Help review-3 contract PASS');

import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {v407Test30HelpUseTokenDelta} from './v4-07-test30-help-use-token-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const source=await readFile(resolve(outDir,'gewitterradar-v4.07.30.js'),'utf8');
const input=await readFile(resolve(outDir,'gewitterradar-v4.07.29.js'),'utf8');
const regenerated=v407Test30HelpUseTokenDelta(input).replace(/\r\n?/g,'\n');
if(source!==regenerated)throw new Error('TEST30 output is not a deterministic delta from exact TEST29');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.30';")||!source.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST30-2026-09-14';"))throw new Error('TEST30 version/build marker missing');
if(source.includes('„Nutzen“ übernimmt'))throw new Error('German Nutzen action still has quotation marks');
if(!source.includes('Nutzen übernimmt den gewählten Ort sofort als Bezugsstandort, schließt die Ortssuche automatisch und fährt die Karte direkt zum neuen Standort.'))throw new Error('German Nutzen Help copy missing');
if(!source.includes('Use applies the selected place immediately, closes place search and moves the map directly to the new reference location.'))throw new Error('English Use Help copy changed unexpectedly');
if(!source.includes("section.key==='location'&&entryIndex===2")||!source.includes("action.className='help-action-token help-action-use'"))throw new Error('Location Use/Nutzen action renderer missing');
if(!source.includes(`replace(/^[„“"'«»‹›]+|[„“"'«»‹›]+$/g,'')`))throw new Error('Action-label quote sanitizer missing');
if(!source.includes('.help-action-use{height:1.56em;min-height:1.56em;padding:0 .52em;border:1px solid #5d849c;border-radius:.29em;color:#e5edf2!important'))throw new Error('Blue premium Use/Nutzen button styling missing');
if(!source.includes('.help-process-highlight{display:inline-block;padding:1px 6px;border:1px solid rgba(225,190,110,.46)'))throw new Error('Subtle Location entity styling missing');
if(source.includes('.help-process-highlight{display:inline-block;padding:1px 7px;border:1px solid rgba(255,213,116,.88)'))throw new Error('Overly prominent TEST29 Location entity styling still present');
for(const fingerprint of [
  "{key:'radii',title:'Die Radien',paragraphs:['Die Radien bauen aufeinander auf:",
  "if(section.key==='radii')ul.className='help-radius-list'",
  "li.dataset.radiusTone=['observation','storm','danger'][itemIndex]||''",
  '.help-radius-bullet'
])if(!source.includes(fingerprint))throw new Error(`Accepted radii fingerprint missing: ${fingerprint}`);
if(!source.includes('module.HELP_EXTERNAL_LOCALES_V40729'))throw new Error('External 17-locale architecture changed unexpectedly');

const localePath=resolve(outDir,'locales/about-locales.js');
const localeBytes=await readFile(localePath);
const localeDigest=createHash('sha256').update(localeBytes).digest('hex');
if(localeBytes.length!==402169||localeDigest!=='f88f3c00e2f4e888e0354f9bf1cddea7035730d2771e0eac4f3f948271a7f189')throw new Error('TEST29 external locale module was modified');
const {HELP_EXTERNAL_LOCALES_V40729}=await import(pathToFileURL(localePath).href+'?test30');
if(Object.keys(HELP_EXTERNAL_LOCALES_V40729||{}).length!==17)throw new Error('Expected 17 external Help locales');
for(const [name,help] of Object.entries(HELP_EXTERNAL_LOCALES_V40729)){
  const location=help.sections.find(section=>section.key==='location');
  const text=location?.entries?.[2]?.[1];
  if(typeof text!=='string'||text.indexOf(' ')<1)throw new Error(`Location action copy cannot be tokenized: ${name}`);
}
console.log('V4.07.30 Help Use/Nutzen token + subtle Location entity regression PASS.');

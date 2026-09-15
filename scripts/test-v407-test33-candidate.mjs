import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {v407Test33ReviewPolishDelta} from './v4-07-test33-review-polish-delta.mjs';

const root=process.cwd();
const dir=resolve(root,'artifacts/v407');
const sourcePath=resolve(dir,'gewitterradar-v4.07.31.js');
const candidatePath=resolve(dir,'gewitterradar-v4.07.33.js');
const localePath=resolve(dir,'locales/about-locales.js');

const EXPECTED_SOURCE_BYTES=1779464;
const EXPECTED_SOURCE_SHA='2d13746361d52af29be279f0c273d7fc3ca381a531a82f26efe8c82f3a871b31';
const EXPECTED_LOCALE_BYTES=401387;
const EXPECTED_LOCALE_SHA='898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb';
const sha=value=>createHash('sha256').update(value).digest('hex');
const assert=(condition,message)=>{if(!condition)throw new Error(message);};

const sourceBuffer=await readFile(sourcePath);
const candidateBuffer=await readFile(candidatePath);
const localeBuffer=await readFile(localePath);
assert(sourceBuffer.length===EXPECTED_SOURCE_BYTES,'V4.07.31 baseline byte drift');
assert(sha(sourceBuffer)===EXPECTED_SOURCE_SHA,'V4.07.31 baseline SHA drift');
assert(localeBuffer.length===EXPECTED_LOCALE_BYTES,'V4.07.31 locale byte drift');
assert(sha(localeBuffer)===EXPECTED_LOCALE_SHA,'V4.07.31 locale SHA drift');

const source=sourceBuffer.toString('utf8');
const candidate=candidateBuffer.toString('utf8');
assert(candidate===v407Test33ReviewPolishDelta(source),'V4.07.33 is not the deterministic delta from exact V4.07.31');
assert(candidate.includes("const CARD_DISPLAY_VERSION = '4.07.33';"),'V4.07.33 display version missing');
assert(candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST33-2026-09-15';"),'V4.07.33 build marker missing');
assert(!candidate.includes("const CARD_DISPLAY_VERSION = '4.07.32';"),'rejected V4.07.32 marker leaked into V4.07.33');
assert(!candidate.includes('/* V4.07.32 accepted review polish'),'rejected V4.07.32 CSS injection leaked into V4.07.33');

for(const fingerprint of [
  "section.key==='location'&&(entryIndex===2||entryIndex===4)",
  "entryIndex===4?'help-action-token help-action-save':'help-action-token help-action-use'",
  "const rest=value.slice(actionMatch[0].length).replace(",
  '.location-saved-star { display:inline-grid;place-items:center;',
  '.location-saved-remove { color:#d99a85;border:1px solid rgba(191,135,76,.42);',
  '.settings-close.settings-close-premium{position:absolute!important;top:10px!important;right:10px!important;',
  '.help-close{position:absolute!important;top:10px!important;right:10px!important;',
  '.about-dialog .about-close{position:absolute;right:10px;top:10px;'
]) assert(candidate.includes(fingerprint),`V4.07.33 fingerprint missing: ${fingerprint}`);

// Accepted V4.07.31 locale payload remains byte-identical and uses the same registry.
assert(candidate.includes('HELP_EXTERNAL_LOCALES_V40731'),'V4.07.31 locale registry no longer used');
assert(!candidate.includes('HELP_EXTERNAL_LOCALES_V40733'),'V4.07.33 must not duplicate the external locale registry');
const imported=await import(pathToFileURL(localePath).href+'?v40733-test');
const registry=imported.HELP_EXTERNAL_LOCALES_V40731;
const names=['Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
assert(JSON.stringify(Object.keys(registry||{}))===JSON.stringify(names),'external locale registry set/order changed');
const quote=/[„“\"'«»‹›]/;
for(const name of names){
  const help=registry[name];
  const location=help?.sections?.find(section=>section.key==='location');
  assert(location,`${name}: location section missing`);
  assert(location.entries?.length>=5,`${name}: location entries incomplete`);
  const useText=String(location.entries[2][1]??'').trim();
  const saveText=String(location.entries[4][1]??'').trim();
  const normalizedUse=useText.replace(/^[„“\"'«»‹›]+\s*/,'');
  const useAction=(normalizedUse.match(/^\S+/)?.[0]??'').replace(/^[„“\"'«»‹›]+|[„“\"'«»‹›]+$/g,'');
  const useRest=normalizedUse.slice(normalizedUse.match(/^\S+/)?.[0]?.length??0).replace(/^[\s„“\"'«»‹›]+/,'');
  assert(useAction.length>0,`${name}: localized Use action missing`);
  assert(!quote.test(useAction),`${name}: localized Use token still contains a quote`);
  assert(!/^[„“\"'«»‹›]/.test(useRest),`${name}: stray quote remains after localized Use action`);
  assert(/^★\s+\S+/.test(saveText.replace(/^[„“\"'«»‹›]+\s*/,'')),`${name}: localized Save action does not start with star + action word`);
}

console.log(`V4.07.33 regression contract PASS: ${candidateBuffer.length} bytes / ${sha(candidateBuffer)}`);
console.log(`External locales unchanged: ${localeBuffer.length} bytes / ${sha(localeBuffer)}`);

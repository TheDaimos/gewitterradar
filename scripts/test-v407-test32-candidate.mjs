import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {v407Test32ReviewPolishDelta} from './v4-07-test32-review-polish-delta.mjs';

const root=process.cwd();
const dir=resolve(root,'artifacts/v407');
const sourcePath=resolve(dir,'gewitterradar-v4.07.31.js');
const candidatePath=resolve(dir,'gewitterradar-v4.07.32.js');
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
const rebuilt=v407Test32ReviewPolishDelta(source);
assert(candidate===rebuilt,'V4.07.32 is not the deterministic delta from exact V4.07.31');

assert(candidate.includes("const CARD_VERSION = '4.07.32';"),'V4.07.32 card version missing');
assert(candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST32-2026-09-15';"),'V4.07.32 build marker missing');
assert(!candidate.includes("const CARD_VERSION = '4.07.31';"),'old V4.07.31 card version still active');
assert(candidate.includes('HELP_EXTERNAL_LOCALES_V40731'),'V4.07.31 external locale registry must remain the runtime source');
assert(!candidate.includes('HELP_EXTERNAL_LOCALES_V40732'),'V4.07.32 must not create a duplicate external locale registry');

// Help action renderer: localized Use and Save actions are positional semantics of the
// location section, not hard-coded German/English words.
assert(candidate.includes("section.key==='location'&&(entryIndex===2||entryIndex===4)"),'generalized localized location action renderer missing');
assert(candidate.includes("entryIndex===4?'help-action-token help-action-save':'help-action-token help-action-use'"),'localized Save/Use premium token classes missing');
assert(candidate.includes("replace(/^[\\s„“\\\"'«»‹›]+/,'')"),'leading quote cleanup for localized action remainder missing');
assert(!candidate.includes("section.key==='location'&&entryIndex===2){const value=String(text??'');"),'old TEST30 Use-only renderer still active');

// Accepted Use token styling must remain untouched.
for(const fingerprint of [
  '.help-action-use{height:1.56em;min-height:1.56em;',
  '.help-action-use:before{',
  '.help-action-token help-action-save',
  '.help-action-token help-action-use'
]) assert(candidate.includes(fingerprint),`accepted action-token fingerprint missing: ${fingerprint}`);

// Review polish CSS. The artwork itself remains untouched; only close placement is unified.
for(const fingerprint of [
  '.settings-close.settings-close-premium,.help-close,.about-close{position:absolute!important;top:10px!important;right:10px!important;',
  '.location-saved-star{',
  'background:linear-gradient(180deg,#fff4bf 0%,#f5d46f 24%,#a86f1d 51%,#ffdc7c 72%,#956015 100%);',
  '.location-saved-remove{',
  'border:1px solid rgba(191,135,76,.42)!important;',
  'width:30px;',
  'height:30px;'
]) assert(candidate.includes(fingerprint),`V4.07.32 UI polish fingerprint missing: ${fingerprint}`);
assert(candidate.includes("ABOUT_CLOSE_IMAGE"),'accepted premium close artwork reference missing');

// External locale payload stays byte-identical. Validate all 17 location entries against
// the renderer contract so no language silently falls back to plain Save text or a stray quote.
const moduleUrl=pathToFileURL(localePath).href+`?v32=${Date.now()}`;
const localeModule=await import(moduleUrl);
const registry=localeModule.HELP_EXTERNAL_LOCALES_V40731;
assert(registry&&typeof registry==='object','HELP_EXTERNAL_LOCALES_V40731 export missing');
const expectedNames=['Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
assert(JSON.stringify(Object.keys(registry).sort())===JSON.stringify([...expectedNames].sort()),'external locale name set changed');

const leadingQuote=/^[„“"'«»‹›]/;
const trailingQuote=/[„“"'«»‹›]$/;
for(const name of expectedNames){
  const help=registry[name]?.help;
  const location=help?.sections?.find(section=>section.key==='location');
  assert(location,`${name}: location section missing`);
  assert(location.entries?.length>=5,`${name}: location entries incomplete`);
  const useText=String(location.entries[2][1]??'').trim();
  const saveText=String(location.entries[4][1]??'').trim();
  const useNormalized=useText.replace(/^[„“"'«»‹›]+\s*/,'');
  const useAction=(useNormalized.match(/^\S+/)?.[0]??'').replace(/^[„“"'«»‹›]+|[„“"'«»‹›]+$/g,'');
  const useRest=useNormalized.slice(useNormalized.match(/^\S+/)?.[0]?.length??0).replace(/^[\s„“"'«»‹›]+/,'');
  assert(useAction.length>0,`${name}: localized Use action missing`);
  assert(!leadingQuote.test(useRest),`${name}: stray leading quote remains after localized Use action`);
  assert(!trailingQuote.test(useAction),`${name}: localized Use token keeps closing quote`);
  assert(/^★\s+\S+/.test(saveText.replace(/^[„“"'«»‹›]+\s*/,'')),`${name}: localized Save action does not start with star + action word`);
}

console.log(`V4.07.32 regression contract passed: ${candidateBuffer.length} bytes / ${sha(candidateBuffer)}`);
console.log(`External locales unchanged: ${localeBuffer.length} bytes / ${sha(localeBuffer)}`);

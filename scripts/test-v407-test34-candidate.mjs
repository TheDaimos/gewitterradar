import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {v407Test34ReviewPolishR2Delta} from './v4-07-test34-review-polish-r2-delta.mjs';

const root=process.cwd();
const dir=resolve(root,'artifacts/v407');
const sourcePath=resolve(dir,'gewitterradar-v4.07.33.js');
const candidatePath=resolve(dir,'gewitterradar-v4.07.34.js');
const localePath=resolve(dir,'locales/about-locales.js');

const EXPECTED_SOURCE_BYTES=1780866;
const EXPECTED_SOURCE_SHA='8cced2c68dd52ef31cc4ff471c669dc2b17595363530bf8157d322f59971040a';
const EXPECTED_LOCALE_BYTES=401387;
const EXPECTED_LOCALE_SHA='898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb';
const sha=value=>createHash('sha256').update(value).digest('hex');
const assert=(condition,message)=>{if(!condition)throw new Error(message);};

const sourceBuffer=await readFile(sourcePath);
const candidateBuffer=await readFile(candidatePath);
const localeBuffer=await readFile(localePath);
assert(sourceBuffer.length===EXPECTED_SOURCE_BYTES,'V4.07.33 baseline byte drift');
assert(sha(sourceBuffer)===EXPECTED_SOURCE_SHA,'V4.07.33 baseline SHA drift');
assert(localeBuffer.length===EXPECTED_LOCALE_BYTES,'external locale byte drift');
assert(sha(localeBuffer)===EXPECTED_LOCALE_SHA,'external locale SHA drift');

const source=sourceBuffer.toString('utf8');
const candidate=candidateBuffer.toString('utf8');
assert(candidate===v407Test34ReviewPolishR2Delta(source),'V4.07.34 is not the deterministic delta from exact V4.07.33');
assert(candidate.includes("const CARD_DISPLAY_VERSION = '4.07.34';"),'V4.07.34 display version missing');
assert(candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST34-2026-09-15';"),'V4.07.34 build marker missing');

// The user explicitly accepted the V4.07.33 dialog-close alignment; V4.07.34 must preserve it.
for(const fingerprint of [
  '.settings-close.settings-close-premium{position:absolute!important;top:10px!important;right:10px!important;',
  '.help-close{position:absolute!important;top:10px!important;right:10px!important;',
  '.about-dialog .about-close{position:absolute;right:10px;top:10px;'
]) assert(candidate.includes(fingerprint),`accepted dialog-close placement changed: ${fingerprint}`);

// V4.07.34 must cover the right-double-quote and related Unicode quote characters seen in real locales.
// Keep these checks semantic rather than depending on JS escaping of quote characters in the generated source.
assert(candidate.includes('const helpTokenQuotePattern='),'generic token quote cleaner missing');
assert(candidate.includes('while(cursor<source.length&&helpTokenQuotePattern.test(source[cursor]))cursor++;'),'trailing token quote cleaner missing');
assert(candidate.includes('let before=source.slice(cursor,match.index).replace('),'leading token quote cleaner missing');
assert(candidate.includes("trimStart().replace(/^[„“”‚‘’"),'localized Use/Save leading quote class missing right-double-quote coverage');
assert(candidate.includes("action.textContent=actionMatch[0].replace(/^[„“”‚‘’"),'localized Use/Save token quote class missing right-double-quote coverage');
assert(candidate.includes("const rest=value.slice(actionMatch[0].length).replace(/^[\\s„“”‚‘’"),'localized Use/Save trailing quote class missing right-double-quote coverage');

// Reject the over-dominant V4.07.33 saved-place styling and require the quieter V4.07.34 treatment.
assert(!candidate.includes('.location-saved-star { display:inline-grid;place-items:center;width:14px;'), 'V4.07.33 heavy saved-place star survived');
assert(candidate.includes('.location-saved-star { color:#f6c344;font-size:13px;line-height:1;font-weight:800;'), 'V4.07.34 subtle metallic star missing');
assert(!candidate.includes('.location-saved-remove { color:#d99a85;border:1px solid rgba(191,135,76,.42);'), 'V4.07.33 permanent remove button frame survived');
assert(candidate.includes('.location-saved-remove { color:#c98f80;border:0;background:transparent;box-shadow:none;'), 'V4.07.34 quiet remove control missing');

// The external locale registry itself remains exactly the accepted V4.07.31 payload.
assert(candidate.includes('HELP_EXTERNAL_LOCALES_V40731'),'accepted V4.07.31 external locale registry no longer used');
assert(!candidate.includes('HELP_EXTERNAL_LOCALES_V40734'),'V4.07.34 must not duplicate the external locale registry');
const imported=await import(pathToFileURL(localePath).href+'?v40734-test');
const registry=imported.HELP_EXTERNAL_LOCALES_V40731;
const names=['Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
assert(JSON.stringify(Object.keys(registry||{}))===JSON.stringify(names),'external locale registry set/order changed');

// Representative real locale source strings remain untouched; V4.07.34 fixes their presentation at render time.
const italian=registry.Italiano?.sections?.find(section=>section.key==='location');
const czech=registry['Čeština']?.sections?.find(section=>section.key==='location');
assert(italian&&czech,'representative external location sections missing');
assert(String(italian.entries?.[2]?.[1]??'').includes('”'),'Italian Use source no longer exercises right-double-quote case');
assert(String(czech.entries?.[2]?.[1]??'').includes('”'),'Czech Use source no longer exercises right-double-quote case');
assert((italian.entries||[]).some(([,text])=>String(text).includes('“Location entity”')),'Italian Location entity quote source missing');
assert((czech.entries||[]).some(([,text])=>String(text).includes('“Location entity”')),'Czech Location entity quote source missing');

// Model the token-boundary cleanup with representative strings. Exact technical names outside tokens are intentionally not stripped.
const q=/[„“”‚‘’"'«»‹›]/;
const cleanTokenBoundary=(text,token)=>{
  const sourceText=String(text);
  const index=sourceText.indexOf(token);
  assert(index>=0,`test token missing: ${token}`);
  const before=sourceText.slice(0,index).replace(/[„“”‚‘’"'«»‹›](\s*)$/,'$1');
  let cursor=index+token.length;
  while(cursor<sourceText.length&&q.test(sourceText[cursor]))cursor++;
  return before+token+sourceText.slice(cursor);
};
assert(cleanTokenBoundary('scegli “Location entity” e poi','Location entity')==='scegli Location entity e poi','Italian Location entity quote cleanup model failed');
assert(cleanTokenBoundary('zvolte “Location entity” a pokračujte','Location entity')==='zvolte Location entity a pokračujte','Czech Location entity quote cleanup model failed');
assert(cleanTokenBoundary('“Usa” adotta il luogo','Usa')==='Usa adotta il luogo','Italian Use quote cleanup model failed');
assert(cleanTokenBoundary('“Použít” převezme místo','Použít')==='Použít převezme místo','Czech Use quote cleanup model failed');

console.log(`V4.07.34 regression contract PASS: ${candidateBuffer.length} bytes / ${sha(candidateBuffer)}`);
console.log(`External locales unchanged: ${localeBuffer.length} bytes / ${sha(localeBuffer)}`);

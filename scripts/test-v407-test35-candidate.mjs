import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {v407Test35IpadInlineFavoritesPolishDelta} from './v4-07-test35-ipad-inline-favorites-polish-delta.mjs';

const root=process.cwd();
const dir=resolve(root,'artifacts/v407');
const sourcePath=resolve(dir,'gewitterradar-v4.07.34.js');
const candidatePath=resolve(dir,'gewitterradar-v4.07.35.js');
const localePath=resolve(dir,'locales/about-locales.js');

const EXPECTED_SOURCE_BYTES=1780583;
const EXPECTED_SOURCE_SHA='490e193991a232af0c9c77ef7e4896e2acc106077c95cd9bcb0c4f9194a0d4ed';
const EXPECTED_LOCALE_BYTES=401387;
const EXPECTED_LOCALE_SHA='898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb';
const sha=value=>createHash('sha256').update(value).digest('hex');
const assert=(condition,message)=>{if(!condition)throw new Error(message);};

const sourceBuffer=await readFile(sourcePath);
const candidateBuffer=await readFile(candidatePath);
const localeBuffer=await readFile(localePath);
assert(sourceBuffer.length===EXPECTED_SOURCE_BYTES,'V4.07.34 baseline byte drift');
assert(sha(sourceBuffer)===EXPECTED_SOURCE_SHA,'V4.07.34 baseline SHA drift');
assert(localeBuffer.length===EXPECTED_LOCALE_BYTES,'external locale byte drift');
assert(sha(localeBuffer)===EXPECTED_LOCALE_SHA,'external locale SHA drift');

const source=sourceBuffer.toString('utf8');
const candidate=candidateBuffer.toString('utf8');
assert(candidate===v407Test35IpadInlineFavoritesPolishDelta(source),'V4.07.35 is not the deterministic delta from exact V4.07.34');
assert(candidate.includes("const CARD_DISPLAY_VERSION = '4.07.35';"),'V4.07.35 display version missing');
assert(candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST35-2026-09-15';"),'V4.07.35 build marker missing');

// Preserve accepted V4.07.34 quote cleanup and dialog close alignment exactly in behavior/fingerprints.
for(const fingerprint of [
  'const helpTokenQuotePattern=',
  'while(cursor<source.length&&helpTokenQuotePattern.test(source[cursor]))cursor++;',
  '.settings-close.settings-close-premium{position:absolute!important;top:10px!important;right:10px!important;',
  '.help-close{position:absolute!important;top:10px!important;right:10px!important;',
  '.about-dialog .about-close{position:absolute;right:10px;top:10px;'
]) assert(candidate.includes(fingerprint),`accepted V4.07.34 behavior changed: ${fingerprint}`);

// Android inline controls are accepted: keep their original generic CSS and add only an iPad/WebKit-width override.
const androidDelete='.help-action-delete:before{content:"×";top:50%;transform:translate(-50%,-54%);font-size:1.10em;color:#f0e5e1}';
const androidRestore='.help-action-restore:before{content:"↶";top:43%;transform:translate(-50%,-50%);font-size:1.04em;color:#e5edf2}';
assert(candidate.includes(androidDelete),'accepted Android delete token CSS changed');
assert(candidate.includes(androidRestore),'accepted Android restore token CSS changed');
assert(candidate.includes('@supports(-webkit-touch-callout:none){@media(min-width:700px){'),'iPad/WebKit-scoped override missing');
assert(candidate.includes('.help-action-delete:before{top:50%;transform:translate(-50%,-50%);font-size:1.08em}'),'iPad delete optical centering missing');
assert(candidate.includes('.help-action-restore:before{content:"";top:50%;width:1.04em;height:1.04em;transform:translate(-50%,-50%);background:url("data:image/svg+xml,'),'iPad custom undo symbol missing');
assert(candidate.includes('stroke-width=%222.35%22'),'iPad undo premium foreground stroke missing');
assert(candidate.includes('stroke-width=%224.2%22'),'iPad undo depth under-stroke missing');

// Saved-place remove glyph: stronger metal/depth, but no visible background, border or button shell in any state.
assert(candidate.includes('.location-saved-remove { color:#d6a08e;border:0;background:transparent;box-shadow:none;font-family:Arial,Helvetica,sans-serif;font-weight:900;line-height:1;'),'stronger background-free saved-place remove glyph missing');
assert(candidate.includes('-webkit-text-stroke:.22px rgba(255,224,209,.28);'),'saved-place remove metal thickness missing');
assert(candidate.includes('.location-saved-remove:hover,.location-saved-remove:focus-visible { outline:none;border:0;background:transparent;'),'saved-place remove hover must remain background-free');
assert(!candidate.includes('background:rgba(214,91,91,.07)'), 'old V4.07.34 saved-place hover background survived');
assert(!candidate.includes('.location-saved-remove { color:#d99a85;border:1px'), 'V4.07.33 framed saved-place remove styling returned');

// V4.07.34 subtle star remains untouched in this round.
assert(candidate.includes('.location-saved-star { color:#f6c344;font-size:13px;line-height:1;font-weight:800;'),'saved-place star changed unexpectedly');

// External locale payload remains exactly accepted V4.07.31 payload.
assert(candidate.includes('HELP_EXTERNAL_LOCALES_V40731'),'accepted external locale registry no longer used');
const imported=await import(pathToFileURL(localePath).href+'?v40735-test');
const registry=imported.HELP_EXTERNAL_LOCALES_V40731;
assert(Object.keys(registry||{}).length===17,'external locale registry count changed');

console.log(`V4.07.35 regression contract PASS: ${candidateBuffer.length} bytes / ${sha(candidateBuffer)}`);
console.log(`External locales unchanged: ${localeBuffer.length} bytes / ${sha(localeBuffer)}`);

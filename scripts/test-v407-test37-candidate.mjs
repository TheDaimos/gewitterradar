import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {v407Test37CoordinateSavePremiumDelta} from './v4-07-test37-coordinate-save-premium-delta.mjs';

const root=process.cwd(),dir=resolve(root,'artifacts/v407');
const sha=value=>createHash('sha256').update(value).digest('hex');
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const sourceBuffer=await readFile(resolve(dir,'gewitterradar-v4.07.36.js'));
const candidateBuffer=await readFile(resolve(dir,'gewitterradar-v4.07.37.js'));
const localeBuffer=await readFile(resolve(dir,'locales/about-locales.js'));
const assetBuffer=await readFile(resolve(dir,'assets/gewitterradar-coordinate-target.svg'));
const masterBuffer=await readFile(resolve(dir,'artwork/gewitterradar-coordinate-target-master.svg'));
assert(sourceBuffer.length===1812815,'V4.07.36 baseline byte drift');
assert(sha(sourceBuffer)==='74a8f9e4d74edce77af6a52207fdca495713a62a7eae270c018f53c3ded3e958','V4.07.36 baseline SHA drift');
assert(localeBuffer.length===401387&&sha(localeBuffer)==='898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb','external locale drift');
assert(assetBuffer.length===2560&&sha(assetBuffer)==='12500f325ecf038a1d1c1c113d5ab8d5825af3eff9167afc10e6db59c0a48ea5','runtime target asset drift');
assert(masterBuffer.length===2821&&sha(masterBuffer)==='b7aad6f0b05ec85456b58e3d175825be3050d5e41883a923dbce93327086c273','Hi-Res target master drift');
const source=sourceBuffer.toString('utf8'),candidate=candidateBuffer.toString('utf8');
assert(candidate===v407Test37CoordinateSavePremiumDelta(source,assetBuffer.toString('base64')),'V4.07.37 is not deterministic from exact V4.07.36');
assert(candidate.includes("const CARD_DISPLAY_VERSION = '4.07.37';"),'display version missing');
assert(candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST37-2026-09-15';"),'build marker missing');
assert(candidate.includes("const V407_COORDINATE_TARGET_ICON = 'data:image/svg+xml;base64,"),'embedded coordinate target missing');
assert(!candidate.includes("new URL('./assets/gewitterradar-coordinate-target.svg?v=40736'"),'external runtime coordinate icon reference survived');
assert(candidate.includes('v407-location-coordinate-save'),'coordinate save button missing');
assert(candidate.includes('coordinateSave.addEventListener'),'coordinate save handler missing');
assert(candidate.includes('await v407SaveCandidate(candidate)'),'coordinate save does not use existing saved-place persistence');
assert(candidate.includes("result.restored?text.savedRestored:(result.duplicate?text.savedDuplicate:text.savedOk)"),'duplicate/restore save feedback missing');
assert(candidate.includes('#v407-location-address-form,.v407-location-coordinate-form { position:relative;padding:13px;border:1px solid transparent'),'premium input frame missing');
assert(candidate.includes('linear-gradient(120deg,rgba(112,79,28,.66),rgba(224,185,101,.58) 24%'),'premium mode frame missing');
assert(candidate.includes('.v407-location-coordinate-save { border-color:rgba(211,164,74,.72)!important'),'gold save treatment missing');
for(const fingerprint of [
  '.settings-close.settings-close-premium{position:absolute!important;top:10px!important;right:10px!important;',
  '.help-close{position:absolute!important;top:10px!important;right:10px!important;',
  '.about-dialog .about-close{position:absolute;right:10px;top:10px;',
  'const helpTokenQuotePattern=',
  '.location-saved-remove { color:#d6a08e;border:0;background:transparent;box-shadow:none;',
  '@supports(-webkit-touch-callout:none){@media(min-width:700px)',
  'https://www.maptiler.com/tools/coordinates/',
  'HELP_EXTERNAL_LOCALES_V40731'
]) assert(candidate.includes(fingerprint),`accepted prior fingerprint changed: ${fingerprint}`);
assert(candidate.includes("this._hass.callService('gewitterradar','set_reference_coordinates',data)"),'reference-coordinate service path missing');
assert(candidate.includes('description:v407SavedPlaceDescription(candidate)'),'saved-place persistence path missing');
const imported=await import(pathToFileURL(resolve(dir,'locales/about-locales.js')).href+'?v40737-test');
assert(imported.HELP_EXTERNAL_LOCALES_V40731,'external locale registry unavailable');
console.log(`V4.07.37 regression contract PASS: ${candidateBuffer.length} bytes / ${sha(candidateBuffer)}`);
console.log('Embedded coordinate target + save + premium frame PASS');

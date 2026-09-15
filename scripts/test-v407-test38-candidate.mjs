import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {v407Test38LocationWordingTargetDelta,V40738_LOCATION_USE_LABELS,V40738_HELP_ACTIONS} from './v4-07-test38-location-wording-target-delta.mjs';

const root=process.cwd(),dir=resolve(root,'artifacts/v407');
const sha=value=>createHash('sha256').update(value).digest('hex');
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const sourceBuffer=await readFile(resolve(dir,'gewitterradar-v4.07.37.js'));
const candidateBuffer=await readFile(resolve(dir,'gewitterradar-v4.07.38.js'));
const localeBuffer=await readFile(resolve(dir,'locales/about-locales.js'));
const assetBuffer=await readFile(resolve(dir,'assets/gewitterradar-coordinate-target.svg'));
const masterBuffer=await readFile(resolve(dir,'artwork/gewitterradar-coordinate-target-master.svg'));
assert(sourceBuffer.length===1819263,'V4.07.37 baseline byte drift');
assert(sha(sourceBuffer)==='758246f38e7905fe5e3f91b25ab7767e074bb6e7708017abfe3cd4cd281bc1c2','V4.07.37 baseline SHA drift');
const source=sourceBuffer.toString('utf8'),candidate=candidateBuffer.toString('utf8'),asset=assetBuffer.toString('utf8'),master=masterBuffer.toString('utf8');
assert(candidate===v407Test38LocationWordingTargetDelta(source,assetBuffer.toString('base64')),'V4.07.38 is not deterministic from exact V4.07.37 + runtime asset');
assert(candidate.includes("const CARD_DISPLAY_VERSION = '4.07.38';"),'display version missing');
assert(candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST38-2026-09-15';"),'build marker missing');
assert(candidate.includes(`const V407_COORDINATE_TARGET_ICON = 'data:image/svg+xml;base64,${assetBuffer.toString('base64')}';`),'polished embedded target does not match runtime asset');
assert(candidate.includes('"use":"Übernehmen"'),'German Übernehmen action missing');
assert(!candidate.includes('"use":"Nutzen"'),'German Nutzen action survived');
assert(candidate.includes("['Ort übernehmen','Übernehmen setzt den gewählten Ort sofort als Bezugsstandort"),'German native help wording missing');
assert(!candidate.includes("['Ort verwenden','Nutzen übernimmt"),'old German native help wording survived');
assert(candidate.includes('["Apply location","Apply sets the selected place immediately as the reference location'),'English native help wording missing');
assert(candidate.includes('"helpTitle":"Koordinaten übernehmen"'),'German coordinate help title not aligned');
for(const [language,label] of Object.entries(V40738_LOCATION_USE_LABELS)) assert(candidate.includes(`"use":"${label}"`),`location action label missing (${language}: ${label})`);
for(const fingerprint of [
  'v407-location-coordinate-save','coordinateSave.addEventListener','await v407SaveCandidate(candidate)',
  '#v407-location-address-form,.v407-location-coordinate-form { position:relative;padding:13px;border:1px solid transparent',
  'linear-gradient(120deg,rgba(112,79,28,.66),rgba(224,185,101,.58) 24%',
  '.settings-close.settings-close-premium{position:absolute!important;top:10px!important;right:10px!important;',
  '.help-close{position:absolute!important;top:10px!important;right:10px!important;',
  '.about-dialog .about-close{position:absolute;right:10px;top:10px;',
  'const helpTokenQuotePattern=',
  '@supports(-webkit-touch-callout:none){@media(min-width:700px)',
  'https://www.maptiler.com/tools/coordinates/'
]) assert(candidate.includes(fingerprint),`accepted prior fingerprint changed: ${fingerprint}`);
assert(asset.includes('id="ruby"')&&asset.includes('id="flightRed"')&&asset.includes('id="blueMetal"'),'runtime target premium color gradients missing');
assert(asset.includes('M920 952V866M920 1268v86M762 1110h-86M1078 1110h86'),'runtime target precision marks missing');
assert(asset.includes('#d94750')&&asset.includes('#ff6b70'),'runtime bullseye and flight reds are not deliberately distinct');
assert(master.includes('M808 998L748 938')&&master.includes('M895 505H945'),'Hi-Res precision/detail structure missing');
assert(master.includes('#e1faff')&&master.includes('#ff7b80'),'Hi-Res blue metal / red flight highlight structure missing');
const imported=await import(pathToFileURL(resolve(dir,'locales/about-locales.js')).href+'?v40738-test');
assert(imported.HELP_EXTERNAL_LOCALES_V40731,'V4.07.38 external locale registry unavailable');
for(const [language,expected] of Object.entries(V40738_HELP_ACTIONS)){
  const locale=imported.HELP_EXTERNAL_LOCALES_V40731[language];
  const section=locale?.sections?.find((entry)=>entry?.key==='location');
  assert(section&&Array.isArray(section.entries?.[2]),`external location help missing (${language})`);
  assert(JSON.stringify(section.entries[2])===JSON.stringify(expected),`external location help wording drift (${language})`);
}
for(const dialect of ['Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch']){
  const section=imported.HELP_EXTERNAL_LOCALES_V40731[dialect].sections.find((entry)=>entry.key==='location');
  assert(!section.entries[2][1].includes('Nutzen'),`old Nutzen wording survived in ${dialect}`);
}
console.log(`V4.07.38 regression contract PASS: ${candidateBuffer.length} bytes / ${sha(candidateBuffer)}`);
console.log(`V4.07.38 locale registry PASS: ${localeBuffer.length} bytes / ${sha(localeBuffer)}`);
console.log(`V4.07.38 target runtime PASS: ${assetBuffer.length} bytes / ${sha(assetBuffer)}`);
console.log(`V4.07.38 target Hi-Res PASS: ${masterBuffer.length} bytes / ${sha(masterBuffer)}`);

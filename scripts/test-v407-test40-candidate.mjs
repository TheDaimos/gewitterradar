import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {v407Test40TargetReadabilityDelta} from './v4-07-test40-target-readability-delta.mjs';

const dir=resolve(process.cwd(),'artifacts/v407');
const sha=value=>createHash('sha256').update(value).digest('hex');
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const sourceBuffer=await readFile(resolve(dir,'gewitterradar-v4.07.39.js'));
const candidateBuffer=await readFile(resolve(dir,'gewitterradar-v4.07.40.js'));
const localeBuffer=await readFile(resolve(dir,'locales/about-locales.js'));
const tabBuffer=await readFile(resolve(dir,'assets/gewitterradar-coordinate-target-tab-v2.svg'));
const listBuffer=await readFile(resolve(dir,'assets/gewitterradar-coordinate-target-list-v2.svg'));
assert(sourceBuffer.length===1820819,'V4.07.39 baseline byte drift');
assert(sha(sourceBuffer)==='c90e802bb2ce41ce428b8483b91942d7925a2a7d36c90c10a996b0b4d881f585','V4.07.39 baseline SHA drift');
assert(localeBuffer.length===436872&&sha(localeBuffer)==='fd219e4f0e8e0b495af5f9ce2add2aaf8bc1369075c8b309b6e4d83fff49b2ea','V4.07.39 locale drift');
assert(tabBuffer.length===1900&&sha(tabBuffer)==='17031c604077491fff8a101a2e6c76f844a65598680aaa7fc9efbc3afeeaf3c1','tab target drift');
assert(listBuffer.length===805&&sha(listBuffer)==='1bc47d02e8ebc81f540999ec456b3ed0214c624d02ae360706fe5ff2e5b09f4c','list target drift');
const source=sourceBuffer.toString('utf8'),candidate=candidateBuffer.toString('utf8');
assert(candidate===v407Test40TargetReadabilityDelta(source,tabBuffer.toString('base64'),listBuffer.toString('base64')),'V4.07.40 is not deterministic from exact V4.07.39 + split target assets');
assert(candidateBuffer.length===1820450,'V4.07.40 candidate byte drift');
assert(sha(candidateBuffer)==='176252737ed5ddaf66c701296cf67c5fb984160b0da6878d527a4ac3caa3de0e','V4.07.40 candidate SHA drift');
assert(candidate.includes("const CARD_DISPLAY_VERSION = '4.07.40';"),'display version missing');
assert(candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST40-2026-09-15';"),'build marker missing');
assert(candidate.includes(`const V407_COORDINATE_TARGET_TAB_ICON = 'data:image/svg+xml;base64,${tabBuffer.toString('base64')}';`),'tab icon embedding mismatch');
assert(candidate.includes(`const V407_COORDINATE_TARGET_LIST_ICON = 'data:image/svg+xml;base64,${listBuffer.toString('base64')}';`),'list icon embedding mismatch');
assert(!candidate.includes('const V407_COORDINATE_TARGET_ICON ='),'old generic target constant survived');
assert(candidate.includes('targetImage.src = V407_COORDINATE_TARGET_LIST_ICON;'),'saved coordinate does not use simplified list target');
assert(candidate.includes('src="${V407_COORDINATE_TARGET_TAB_ICON}"'),'Lat / Lon tab does not use dedicated tab target');
assert(candidate.includes('.location-saved-target { width:17px;height:17px;'),'saved target is not enlarged to 17px');
assert(!candidate.includes('drop-shadow(0 0 1px rgba(86,170,236,.28))'),'old blue list-icon overlay survived');
assert(tabBuffer.toString('utf8').includes('#a71622')&&tabBuffer.toString('utf8').includes('#ff7a7e')&&tabBuffer.toString('utf8').includes('#8cd9ff'),'tab target color hierarchy missing');
assert(listBuffer.toString('utf8').includes('#9f1822')&&listBuffer.toString('utf8').includes('#ef4652')&&listBuffer.toString('utf8').includes('#78cfff'),'list target color hierarchy missing');
for(const fingerprint of [
  '"use":"Übernehmen"',
  "['Ort übernehmen','Übernehmen setzt den gewählten Ort sofort als Bezugsstandort",
  'v407-location-coordinate-save',
  'coordinateSave.addEventListener',
  "const coordinateSaved = String(place.provider || '').trim().toLowerCase() === 'lat / lon';",
  "savedIcon.className = 'location-saved-star';",
  'https://www.maptiler.com/tools/coordinates/'
]) assert(candidate.includes(fingerprint),`accepted V4.07.39 fingerprint changed: ${fingerprint}`);
console.log(`V4.07.40 regression contract PASS: ${candidateBuffer.length} bytes / ${sha(candidateBuffer)}`);
console.log('Split target rendering PASS: 27px tab icon + simplified 17px saved-place icon.');

import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {v407Test39CoordinateSavedTargetDelta} from './v4-07-test39-coordinate-saved-target-delta.mjs';

const dir=resolve(process.cwd(),'artifacts/v407');
const sha=value=>createHash('sha256').update(value).digest('hex');
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const sourceBuffer=await readFile(resolve(dir,'gewitterradar-v4.07.38.js'));
const candidateBuffer=await readFile(resolve(dir,'gewitterradar-v4.07.39.js'));
const localeBuffer=await readFile(resolve(dir,'locales/about-locales.js'));
const assetBuffer=await readFile(resolve(dir,'assets/gewitterradar-coordinate-target.svg'));
const masterBuffer=await readFile(resolve(dir,'artwork/gewitterradar-coordinate-target-master.svg'));
assert(sourceBuffer.length===1820015,'V4.07.38 baseline byte drift');
assert(sha(sourceBuffer)==='24366537370b242f0abbdbfc540f9710bbc3510998b75c283260d94034cbb81c','V4.07.38 baseline SHA drift');
assert(localeBuffer.length===436872&&sha(localeBuffer)==='fd219e4f0e8e0b495af5f9ce2add2aaf8bc1369075c8b309b6e4d83fff49b2ea','V4.07.38 locale drift');
assert(assetBuffer.length===3047&&sha(assetBuffer)==='fead7f3fc9508b119be62af490752bfc0746951dacb59af29e7d8fd1915cbddb','runtime target drift');
assert(masterBuffer.length===4701&&sha(masterBuffer)==='f74c980dfe4157aed0302d5136d5cb5494b065724605211fd343ae1ac61346e8','Hi-Res target drift');
const source=sourceBuffer.toString('utf8'),candidate=candidateBuffer.toString('utf8');
assert(candidate===v407Test39CoordinateSavedTargetDelta(source),'V4.07.39 is not deterministic from exact V4.07.38');
assert(candidate.includes("const CARD_DISPLAY_VERSION = '4.07.39';"),'display version missing');
assert(candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST39-2026-09-15';"),'build marker missing');
assert(candidate.includes("const coordinateSaved = String(place.provider || '').trim().toLowerCase() === 'lat / lon';"),'coordinate saved-place detection missing');
assert(candidate.includes("savedIcon.className = 'location-saved-target';"),'coordinate target class missing');
assert(candidate.includes('targetImage.src = V407_COORDINATE_TARGET_ICON;'),'saved coordinate target does not use embedded target');
assert(candidate.includes("savedIcon.className = 'location-saved-star';"),'normal saved-place star fallback missing');
assert(candidate.includes("savedIcon.textContent = '★';"),'normal saved-place star glyph missing');
assert(candidate.includes('.location-saved-target { width:15px;height:15px;'),'saved coordinate target CSS missing');
for(const fingerprint of [
  '"use":"Übernehmen"',
  "['Ort übernehmen','Übernehmen setzt den gewählten Ort sofort als Bezugsstandort",
  'v407-location-coordinate-save',
  'coordinateSave.addEventListener',
  'V407_COORDINATE_TARGET_ICON',
  'https://www.maptiler.com/tools/coordinates/'
]) assert(candidate.includes(fingerprint),`accepted V4.07.38 fingerprint changed: ${fingerprint}`);
console.log(`V4.07.39 regression contract PASS: ${candidateBuffer.length} bytes / ${sha(candidateBuffer)}`);
console.log('Manual Lat/Lon saved places use target icon; searched saved places keep star.');

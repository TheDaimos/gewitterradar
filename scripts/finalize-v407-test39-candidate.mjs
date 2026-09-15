import {readFile,writeFile,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {v407Test39CoordinateSavedTargetDelta} from './v4-07-test39-coordinate-saved-target-delta.mjs';

const root=process.cwd();
const dir=resolve(root,'artifacts/v407');
const sourcePath=resolve(dir,'gewitterradar-v4.07.38.js');
const localePath=resolve(dir,'locales/about-locales.js');
const assetPath=resolve(dir,'assets/gewitterradar-coordinate-target.svg');
const masterPath=resolve(dir,'artwork/gewitterradar-coordinate-target-master.svg');

const EXPECTED_SOURCE_BYTES=1820015;
const EXPECTED_SOURCE_SHA='24366537370b242f0abbdbfc540f9710bbc3510998b75c283260d94034cbb81c';
const EXPECTED_LOCALE_BYTES=436872;
const EXPECTED_LOCALE_SHA='fd219e4f0e8e0b495af5f9ce2add2aaf8bc1369075c8b309b6e4d83fff49b2ea';
const EXPECTED_ASSET_BYTES=3047;
const EXPECTED_ASSET_SHA='fead7f3fc9508b119be62af490752bfc0746951dacb59af29e7d8fd1915cbddb';
const EXPECTED_MASTER_BYTES=4701;
const EXPECTED_MASTER_SHA='f74c980dfe4157aed0302d5136d5cb5494b065724605211fd343ae1ac61346e8';
const sha=value=>createHash('sha256').update(value).digest('hex');
const assertExact=(buffer,bytes,digest,label)=>{
  if(buffer.length!==bytes) throw new Error(`${label} byte drift: ${buffer.length} != ${bytes}`);
  const actual=sha(buffer); if(actual!==digest) throw new Error(`${label} SHA drift: ${actual} != ${digest}`);
};

const sourceBuffer=await readFile(sourcePath);
const localeBuffer=await readFile(localePath);
const assetBuffer=await readFile(assetPath);
const masterBuffer=await readFile(masterPath);
assertExact(sourceBuffer,EXPECTED_SOURCE_BYTES,EXPECTED_SOURCE_SHA,'V4.07.38 main baseline');
assertExact(localeBuffer,EXPECTED_LOCALE_BYTES,EXPECTED_LOCALE_SHA,'V4.07.38 locale baseline');
assertExact(assetBuffer,EXPECTED_ASSET_BYTES,EXPECTED_ASSET_SHA,'V4.07.38 runtime target');
assertExact(masterBuffer,EXPECTED_MASTER_BYTES,EXPECTED_MASTER_SHA,'V4.07.38 Hi-Res target');

const candidate=v407Test39CoordinateSavedTargetDelta(sourceBuffer.toString('utf8'));
const candidateBuffer=Buffer.from(candidate,'utf8');
const out=resolve(dir,'gewitterradar-v4.07.39.js');
await writeFile(out,candidateBuffer);
await copyFile(out,resolve(dir,'gewitterradar.js'));
await copyFile(out,resolve(dir,'gewitterradar-v4.07-test.js'));
const sums=[
  `${sha(candidateBuffer)}  gewitterradar.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07-test.js`,
  `${EXPECTED_SOURCE_SHA}  gewitterradar-v4.07.38.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07.39.js`,
  `${EXPECTED_LOCALE_SHA}  locales/about-locales.js`,
  `${EXPECTED_ASSET_SHA}  assets/gewitterradar-coordinate-target.svg`,
  `${EXPECTED_MASTER_SHA}  artwork/gewitterradar-coordinate-target-master.svg`
].join('\n')+'\n';
await writeFile(resolve(dir,'SHA256SUMS.txt'),sums);
console.log(`V4.07.39 bytes: ${candidateBuffer.length}`);
console.log(`V4.07.39 sha256: ${sha(candidateBuffer)}`);
console.log(`Locale unchanged: ${localeBuffer.length} bytes / ${sha(localeBuffer)}`);
console.log(`Runtime target unchanged: ${assetBuffer.length} bytes / ${sha(assetBuffer)}`);
console.log(`Hi-Res target unchanged: ${masterBuffer.length} bytes / ${sha(masterBuffer)}`);

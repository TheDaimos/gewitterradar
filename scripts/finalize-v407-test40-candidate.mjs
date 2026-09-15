import {readFile,writeFile,copyFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {v407Test40TargetReadabilityDelta} from './v4-07-test40-target-readability-delta.mjs';

const root=process.cwd();
const dir=resolve(root,'artifacts/v407');
const sourcePath=resolve(dir,'gewitterradar-v4.07.39.js');
const localePath=resolve(dir,'locales/about-locales.js');
const legacyAssetPath=resolve(dir,'assets/gewitterradar-coordinate-target.svg');
const legacyMasterPath=resolve(dir,'artwork/gewitterradar-coordinate-target-master.svg');
const tabSourcePath=resolve(root,'assets/gewitterradar-coordinate-target-tab-v2.svg');
const listSourcePath=resolve(root,'assets/gewitterradar-coordinate-target-list-v2.svg');
const tabArtifactPath=resolve(dir,'assets/gewitterradar-coordinate-target-tab-v2.svg');
const listArtifactPath=resolve(dir,'assets/gewitterradar-coordinate-target-list-v2.svg');

const EXPECTED_SOURCE_BYTES=1820819;
const EXPECTED_SOURCE_SHA='c90e802bb2ce41ce428b8483b91942d7925a2a7d36c90c10a996b0b4d881f585';
const EXPECTED_LOCALE_BYTES=436872;
const EXPECTED_LOCALE_SHA='fd219e4f0e8e0b495af5f9ce2add2aaf8bc1369075c8b309b6e4d83fff49b2ea';
const EXPECTED_LEGACY_ASSET_BYTES=3047;
const EXPECTED_LEGACY_ASSET_SHA='fead7f3fc9508b119be62af490752bfc0746951dacb59af29e7d8fd1915cbddb';
const EXPECTED_LEGACY_MASTER_BYTES=4701;
const EXPECTED_LEGACY_MASTER_SHA='f74c980dfe4157aed0302d5136d5cb5494b065724605211fd343ae1ac61346e8';
const EXPECTED_TAB_BYTES=1900;
const EXPECTED_TAB_SHA='17031c604077491fff8a101a2e6c76f844a65598680aaa7fc9efbc3afeeaf3c1';
const EXPECTED_LIST_BYTES=805;
const EXPECTED_LIST_SHA='1bc47d02e8ebc81f540999ec456b3ed0214c624d02ae360706fe5ff2e5b09f4c';
const sha=value=>createHash('sha256').update(value).digest('hex');
const assertExact=(buffer,bytes,digest,label)=>{
  if(buffer.length!==bytes) throw new Error(`${label} byte drift: ${buffer.length} != ${bytes}`);
  const actual=sha(buffer); if(actual!==digest) throw new Error(`${label} SHA drift: ${actual} != ${digest}`);
};

const sourceBuffer=await readFile(sourcePath);
const localeBuffer=await readFile(localePath);
const legacyAssetBuffer=await readFile(legacyAssetPath);
const legacyMasterBuffer=await readFile(legacyMasterPath);
const tabBuffer=await readFile(tabSourcePath);
const listBuffer=await readFile(listSourcePath);
assertExact(sourceBuffer,EXPECTED_SOURCE_BYTES,EXPECTED_SOURCE_SHA,'V4.07.39 main baseline');
assertExact(localeBuffer,EXPECTED_LOCALE_BYTES,EXPECTED_LOCALE_SHA,'V4.07.39 locale baseline');
assertExact(legacyAssetBuffer,EXPECTED_LEGACY_ASSET_BYTES,EXPECTED_LEGACY_ASSET_SHA,'V4.07.39 runtime target');
assertExact(legacyMasterBuffer,EXPECTED_LEGACY_MASTER_BYTES,EXPECTED_LEGACY_MASTER_SHA,'V4.07.39 Hi-Res target');
assertExact(tabBuffer,EXPECTED_TAB_BYTES,EXPECTED_TAB_SHA,'V4.07.40 tab target');
assertExact(listBuffer,EXPECTED_LIST_BYTES,EXPECTED_LIST_SHA,'V4.07.40 list target');

const candidate=v407Test40TargetReadabilityDelta(sourceBuffer.toString('utf8'),tabBuffer.toString('base64'),listBuffer.toString('base64'));
const candidateBuffer=Buffer.from(candidate,'utf8');
const out=resolve(dir,'gewitterradar-v4.07.40.js');
await writeFile(out,candidateBuffer);
await copyFile(out,resolve(dir,'gewitterradar.js'));
await copyFile(out,resolve(dir,'gewitterradar-v4.07-test.js'));
await mkdir(resolve(dir,'assets'),{recursive:true});
await copyFile(tabSourcePath,tabArtifactPath);
await copyFile(listSourcePath,listArtifactPath);
const sums=[
  `${sha(candidateBuffer)}  gewitterradar.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07-test.js`,
  `${EXPECTED_SOURCE_SHA}  gewitterradar-v4.07.39.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07.40.js`,
  `${EXPECTED_LOCALE_SHA}  locales/about-locales.js`,
  `${EXPECTED_LEGACY_ASSET_SHA}  assets/gewitterradar-coordinate-target.svg`,
  `${EXPECTED_TAB_SHA}  assets/gewitterradar-coordinate-target-tab-v2.svg`,
  `${EXPECTED_LIST_SHA}  assets/gewitterradar-coordinate-target-list-v2.svg`,
  `${EXPECTED_LEGACY_MASTER_SHA}  artwork/gewitterradar-coordinate-target-master.svg`
].join('\n')+'\n';
await writeFile(resolve(dir,'SHA256SUMS.txt'),sums);
console.log(`V4.07.40 bytes: ${candidateBuffer.length}`);
console.log(`V4.07.40 sha256: ${sha(candidateBuffer)}`);
console.log(`Tab target: ${tabBuffer.length} bytes / ${sha(tabBuffer)}`);
console.log(`List target: ${listBuffer.length} bytes / ${sha(listBuffer)}`);

import {readFile,writeFile,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {v407Test37CoordinateSavePremiumDelta} from './v4-07-test37-coordinate-save-premium-delta.mjs';

const root=process.cwd();
const dir=resolve(root,'artifacts/v407');
const sourcePath=resolve(dir,'gewitterradar-v4.07.36.js');
const localePath=resolve(dir,'locales/about-locales.js');
const assetPath=resolve(dir,'assets/gewitterradar-coordinate-target.svg');
const masterPath=resolve(dir,'artwork/gewitterradar-coordinate-target-master.svg');

const EXPECTED_SOURCE_BYTES=1812815;
const EXPECTED_SOURCE_SHA='74a8f9e4d74edce77af6a52207fdca495713a62a7eae270c018f53c3ded3e958';
const EXPECTED_LOCALE_BYTES=401387;
const EXPECTED_LOCALE_SHA='898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb';
const EXPECTED_ASSET_BYTES=2560;
const EXPECTED_ASSET_SHA='12500f325ecf038a1d1c1c113d5ab8d5825af3eff9167afc10e6db59c0a48ea5';
const EXPECTED_MASTER_BYTES=2821;
const EXPECTED_MASTER_SHA='b7aad6f0b05ec85456b58e3d175825be3050d5e41883a923dbce93327086c273';
const sha=value=>createHash('sha256').update(value).digest('hex');
const assertExact=(buffer,bytes,digest,label)=>{
  if(buffer.length!==bytes) throw new Error(`${label} byte drift: ${buffer.length} != ${bytes}`);
  const actual=sha(buffer); if(actual!==digest) throw new Error(`${label} SHA drift: ${actual} != ${digest}`);
};

const sourceBuffer=await readFile(sourcePath);
const localeBuffer=await readFile(localePath);
const assetBuffer=await readFile(assetPath);
const masterBuffer=await readFile(masterPath);
assertExact(sourceBuffer,EXPECTED_SOURCE_BYTES,EXPECTED_SOURCE_SHA,'V4.07.36 main baseline');
assertExact(localeBuffer,EXPECTED_LOCALE_BYTES,EXPECTED_LOCALE_SHA,'external locale baseline');
assertExact(assetBuffer,EXPECTED_ASSET_BYTES,EXPECTED_ASSET_SHA,'coordinate target runtime asset');
assertExact(masterBuffer,EXPECTED_MASTER_BYTES,EXPECTED_MASTER_SHA,'coordinate target Hi-Res master');

const candidate=v407Test37CoordinateSavePremiumDelta(sourceBuffer.toString('utf8'),assetBuffer.toString('base64'));
const candidateBuffer=Buffer.from(candidate,'utf8');
const out=resolve(dir,'gewitterradar-v4.07.37.js');
await writeFile(out,candidateBuffer);
await copyFile(out,resolve(dir,'gewitterradar.js'));
await copyFile(out,resolve(dir,'gewitterradar-v4.07-test.js'));
const sums=[
  `${sha(candidateBuffer)}  gewitterradar.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07-test.js`,
  `${EXPECTED_SOURCE_SHA}  gewitterradar-v4.07.36.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07.37.js`,
  `${EXPECTED_LOCALE_SHA}  locales/about-locales.js`,
  `${EXPECTED_ASSET_SHA}  assets/gewitterradar-coordinate-target.svg`,
  `${EXPECTED_MASTER_SHA}  artwork/gewitterradar-coordinate-target-master.svg`
].join('\n')+'\n';
await writeFile(resolve(dir,'SHA256SUMS.txt'),sums);
console.log(`V4.07.37 bytes: ${candidateBuffer.length}`);
console.log(`V4.07.37 sha256: ${sha(candidateBuffer)}`);
console.log(`Coordinate runtime asset retained: ${assetBuffer.length} bytes / ${sha(assetBuffer)}`);
console.log(`Coordinate Hi-Res master retained: ${masterBuffer.length} bytes / ${sha(masterBuffer)}`);
console.log(`Locale unchanged: ${localeBuffer.length} bytes / ${sha(localeBuffer)}`);

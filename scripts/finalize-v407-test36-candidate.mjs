import {readFile, writeFile, mkdir, copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {v407Test36CoordinateInputDelta} from './v4-07-test36-coordinate-input-delta.mjs';

const root=process.cwd();
const dir=resolve(root,'artifacts/v407');
const localeDir=resolve(dir,'locales');
const assetDir=resolve(dir,'assets');
const artworkDir=resolve(dir,'artwork');
const sourcePath=resolve(dir,'gewitterradar-v4.07.35.js');
const localePath=resolve(localeDir,'about-locales.js');
const coordinateAssetSource=resolve(root,'artwork/location-search/runtime/gewitterradar-coordinate-target.svg');
const coordinateAssetOut=resolve(assetDir,'gewitterradar-coordinate-target.svg');
const coordinateMasterSource=resolve(root,'artwork/location-search/hires/gewitterradar-coordinate-target-master.svg');
const coordinateMasterOut=resolve(artworkDir,'gewitterradar-coordinate-target-master.svg');

const EXPECTED_SOURCE_BYTES=1781842;
const EXPECTED_SOURCE_SHA='ec997a2a992681398209883990183035b9c38eccad49d363e80e20a3ab7d5447';
const EXPECTED_LOCALE_BYTES=401387;
const EXPECTED_LOCALE_SHA='898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb';
const EXPECTED_COORDINATE_ASSET_BYTES=2560;
const EXPECTED_COORDINATE_ASSET_SHA='12500f325ecf038a1d1c1c113d5ab8d5825af3eff9167afc10e6db59c0a48ea5';
const EXPECTED_COORDINATE_MASTER_BYTES=2821;
const EXPECTED_COORDINATE_MASTER_SHA='b7aad6f0b05ec85456b58e3d175825be3050d5e41883a923dbce93327086c273';
const sha=value=>createHash('sha256').update(value).digest('hex');
const assertExact=(buffer,bytes,digest,label)=>{
  if(buffer.length!==bytes) throw new Error(`${label} byte drift: ${buffer.length} != ${bytes}`);
  const actual=sha(buffer); if(actual!==digest) throw new Error(`${label} SHA drift: ${actual} != ${digest}`);
};

await mkdir(localeDir,{recursive:true});
await mkdir(assetDir,{recursive:true});
await mkdir(artworkDir,{recursive:true});
const sourceBuffer=await readFile(sourcePath);
const localeBuffer=await readFile(localePath);
const coordinateAssetBuffer=await readFile(coordinateAssetSource);
const coordinateMasterBuffer=await readFile(coordinateMasterSource);
assertExact(sourceBuffer,EXPECTED_SOURCE_BYTES,EXPECTED_SOURCE_SHA,'V4.07.35 main baseline');
assertExact(localeBuffer,EXPECTED_LOCALE_BYTES,EXPECTED_LOCALE_SHA,'V4.07.31 locale baseline');
assertExact(coordinateAssetBuffer,EXPECTED_COORDINATE_ASSET_BYTES,EXPECTED_COORDINATE_ASSET_SHA,'coordinate target runtime asset');
assertExact(coordinateMasterBuffer,EXPECTED_COORDINATE_MASTER_BYTES,EXPECTED_COORDINATE_MASTER_SHA,'coordinate target Hi-Res master');

const candidate=v407Test36CoordinateInputDelta(sourceBuffer.toString('utf8'));
const candidateBuffer=Buffer.from(candidate,'utf8');
const out=resolve(dir,'gewitterradar-v4.07.36.js');
await writeFile(out,candidateBuffer);
await copyFile(out,resolve(dir,'gewitterradar.js'));
await copyFile(out,resolve(dir,'gewitterradar-v4.07-test.js'));
await copyFile(coordinateAssetSource,coordinateAssetOut);
await copyFile(coordinateMasterSource,coordinateMasterOut);

const sums=[
  `${sha(candidateBuffer)}  gewitterradar.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07-test.js`,
  `${EXPECTED_SOURCE_SHA}  gewitterradar-v4.07.35.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07.36.js`,
  `${EXPECTED_LOCALE_SHA}  locales/about-locales.js`,
  `${EXPECTED_COORDINATE_ASSET_SHA}  assets/gewitterradar-coordinate-target.svg`,
  `${EXPECTED_COORDINATE_MASTER_SHA}  artwork/gewitterradar-coordinate-target-master.svg`
].join('\n')+'\n';
await writeFile(resolve(dir,'SHA256SUMS.txt'),sums);
console.log(`V4.07.36 bytes: ${candidateBuffer.length}`);
console.log(`V4.07.36 sha256: ${sha(candidateBuffer)}`);
console.log(`Coordinate target asset: ${coordinateAssetBuffer.length} bytes / ${sha(coordinateAssetBuffer)}`);
console.log(`Coordinate target Hi-Res master: ${coordinateMasterBuffer.length} bytes / ${sha(coordinateMasterBuffer)}`);
console.log(`Locale unchanged: ${localeBuffer.length} bytes / ${sha(localeBuffer)}`);

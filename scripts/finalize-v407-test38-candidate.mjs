import {readFile,writeFile,copyFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {v407Test38LocationWordingTargetDelta} from './v4-07-test38-location-wording-target-delta.mjs';
import {v407Test38SerializeExternalLocalesFixed} from './v4-07-test38-locale-serializer.mjs';

const root=process.cwd();
const dir=resolve(root,'artifacts/v407');
const localeDir=resolve(dir,'locales');
const assetDir=resolve(dir,'assets');
const artworkDir=resolve(dir,'artwork');
const sourcePath=resolve(dir,'gewitterradar-v4.07.37.js');
const localePath=resolve(localeDir,'about-locales.js');
const runtimeSource=resolve(root,'artwork/location-search/runtime/gewitterradar-coordinate-target-v40738.svg');
const masterSource=resolve(root,'artwork/location-search/hires/gewitterradar-coordinate-target-master-v40738.svg');
const runtimeOut=resolve(assetDir,'gewitterradar-coordinate-target.svg');
const masterOut=resolve(artworkDir,'gewitterradar-coordinate-target-master.svg');

const EXPECTED_SOURCE_BYTES=1819263;
const EXPECTED_SOURCE_SHA='758246f38e7905fe5e3f91b25ab7767e074bb6e7708017abfe3cd4cd281bc1c2';
const EXPECTED_LOCALE_BYTES=401387;
const EXPECTED_LOCALE_SHA='898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb';
const sha=value=>createHash('sha256').update(value).digest('hex');
const assertExact=(buffer,bytes,digest,label)=>{
  if(buffer.length!==bytes) throw new Error(`${label} byte drift: ${buffer.length} != ${bytes}`);
  const actual=sha(buffer); if(actual!==digest) throw new Error(`${label} SHA drift: ${actual} != ${digest}`);
};

await mkdir(localeDir,{recursive:true});await mkdir(assetDir,{recursive:true});await mkdir(artworkDir,{recursive:true});
const sourceBuffer=await readFile(sourcePath);
const localeBaselineBuffer=await readFile(localePath);
const runtimeBuffer=await readFile(runtimeSource);
const masterBuffer=await readFile(masterSource);
assertExact(sourceBuffer,EXPECTED_SOURCE_BYTES,EXPECTED_SOURCE_SHA,'V4.07.37 main baseline');
assertExact(localeBaselineBuffer,EXPECTED_LOCALE_BYTES,EXPECTED_LOCALE_SHA,'V4.07.31 external locale baseline');
if(!runtimeBuffer.toString('utf8').includes('id="ruby"')||!runtimeBuffer.toString('utf8').includes('id="flightRed"')||!runtimeBuffer.toString('utf8').includes('id="blueMetal"')) throw new Error('V4.07.38 runtime target color hierarchy missing');
if(!masterBuffer.toString('utf8').includes('M808 998L748 938')||!masterBuffer.toString('utf8').includes('M895 505H945')) throw new Error('V4.07.38 Hi-Res target detail structure missing');

const localeBaselineUrl=pathToFileURL(localePath).href+`?v40738=${Date.now()}`;
const localeModule=await import(localeBaselineUrl);
const localeCandidate=v407Test38SerializeExternalLocalesFixed(localeModule);
const localeCandidateBuffer=Buffer.from(localeCandidate,'utf8');
const candidate=v407Test38LocationWordingTargetDelta(sourceBuffer.toString('utf8'),runtimeBuffer.toString('base64'));
const candidateBuffer=Buffer.from(candidate,'utf8');
const out=resolve(dir,'gewitterradar-v4.07.38.js');
await writeFile(out,candidateBuffer);
await copyFile(out,resolve(dir,'gewitterradar.js'));
await copyFile(out,resolve(dir,'gewitterradar-v4.07-test.js'));
await writeFile(localePath,localeCandidateBuffer);
await copyFile(runtimeSource,runtimeOut);
await copyFile(masterSource,masterOut);

const sums=[
  `${sha(candidateBuffer)}  gewitterradar.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07-test.js`,
  `${EXPECTED_SOURCE_SHA}  gewitterradar-v4.07.37.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07.38.js`,
  `${sha(localeCandidateBuffer)}  locales/about-locales.js`,
  `${sha(runtimeBuffer)}  assets/gewitterradar-coordinate-target.svg`,
  `${sha(masterBuffer)}  artwork/gewitterradar-coordinate-target-master.svg`
].join('\n')+'\n';
await writeFile(resolve(dir,'SHA256SUMS.txt'),sums);
console.log(`V4.07.38 bytes: ${candidateBuffer.length}`);
console.log(`V4.07.38 sha256: ${sha(candidateBuffer)}`);
console.log(`V4.07.38 locale bytes: ${localeCandidateBuffer.length}`);
console.log(`V4.07.38 locale sha256: ${sha(localeCandidateBuffer)}`);
console.log(`V4.07.38 runtime target: ${runtimeBuffer.length} bytes / ${sha(runtimeBuffer)}`);
console.log(`V4.07.38 Hi-Res target: ${masterBuffer.length} bytes / ${sha(masterBuffer)}`);

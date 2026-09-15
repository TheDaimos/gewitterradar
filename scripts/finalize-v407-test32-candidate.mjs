import {readFile, writeFile, mkdir, copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {v407Test32ReviewPolishDelta} from './v4-07-test32-review-polish-delta.mjs';

const root=process.cwd();
const dir=resolve(root,'artifacts/v407');
const localeDir=resolve(dir,'locales');
const sourcePath=resolve(dir,'gewitterradar-v4.07.31.js');
const localePath=resolve(localeDir,'about-locales.js');

const EXPECTED_SOURCE_BYTES=1779464;
const EXPECTED_SOURCE_SHA='2d13746361d52af29be279f0c273d7fc3ca381a531a82f26efe8c82f3a871b31';
const EXPECTED_LOCALE_BYTES=401387;
const EXPECTED_LOCALE_SHA='898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb';

const sha=value=>createHash('sha256').update(value).digest('hex');
const assertExact=(buffer,bytes,digest,label)=>{
  if(buffer.length!==bytes) throw new Error(`${label} byte drift: ${buffer.length} != ${bytes}`);
  const actual=sha(buffer);
  if(actual!==digest) throw new Error(`${label} SHA drift: ${actual} != ${digest}`);
};

await mkdir(localeDir,{recursive:true});
const sourceBuffer=await readFile(sourcePath);
const localeBuffer=await readFile(localePath);
assertExact(sourceBuffer,EXPECTED_SOURCE_BYTES,EXPECTED_SOURCE_SHA,'V4.07.31 main baseline');
assertExact(localeBuffer,EXPECTED_LOCALE_BYTES,EXPECTED_LOCALE_SHA,'V4.07.31 locale baseline');

const source=sourceBuffer.toString('utf8');
const candidate=v407Test32ReviewPolishDelta(source);
const candidateBuffer=Buffer.from(candidate,'utf8');

const out=resolve(dir,'gewitterradar-v4.07.32.js');
await writeFile(out,candidateBuffer);
await copyFile(out,resolve(dir,'gewitterradar.js'));
await copyFile(out,resolve(dir,'gewitterradar-v4.07-test.js'));

const sums=[
  `${sha(candidateBuffer)}  gewitterradar.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07-test.js`,
  `${EXPECTED_SOURCE_SHA}  gewitterradar-v4.07.31.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07.32.js`,
  `${EXPECTED_LOCALE_SHA}  locales/about-locales.js`
].join('\n')+'\n';
await writeFile(resolve(dir,'SHA256SUMS.txt'),sums);

console.log(`V4.07.32 bytes: ${candidateBuffer.length}`);
console.log(`V4.07.32 sha256: ${sha(candidateBuffer)}`);
console.log(`Locale unchanged: ${localeBuffer.length} bytes / ${sha(localeBuffer)}`);

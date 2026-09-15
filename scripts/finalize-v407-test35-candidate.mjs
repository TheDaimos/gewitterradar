import {readFile, writeFile, mkdir, copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {v407Test35IpadInlineFavoritesPolishDelta} from './v4-07-test35-ipad-inline-favorites-polish-delta.mjs';

const root=process.cwd();
const dir=resolve(root,'artifacts/v407');
const localeDir=resolve(dir,'locales');
const sourcePath=resolve(dir,'gewitterradar-v4.07.34.js');
const localePath=resolve(localeDir,'about-locales.js');

const EXPECTED_SOURCE_BYTES=1780583;
const EXPECTED_SOURCE_SHA='490e193991a232af0c9c77ef7e4896e2acc106077c95cd9bcb0c4f9194a0d4ed';
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
assertExact(sourceBuffer,EXPECTED_SOURCE_BYTES,EXPECTED_SOURCE_SHA,'V4.07.34 main baseline');
assertExact(localeBuffer,EXPECTED_LOCALE_BYTES,EXPECTED_LOCALE_SHA,'V4.07.31 locale baseline');

const source=sourceBuffer.toString('utf8');
const candidate=v407Test35IpadInlineFavoritesPolishDelta(source);
const candidateBuffer=Buffer.from(candidate,'utf8');

const out=resolve(dir,'gewitterradar-v4.07.35.js');
await writeFile(out,candidateBuffer);
await copyFile(out,resolve(dir,'gewitterradar.js'));
await copyFile(out,resolve(dir,'gewitterradar-v4.07-test.js'));

const sums=[
  `${sha(candidateBuffer)}  gewitterradar.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07-test.js`,
  `${EXPECTED_SOURCE_SHA}  gewitterradar-v4.07.34.js`,
  `${sha(candidateBuffer)}  gewitterradar-v4.07.35.js`,
  `${EXPECTED_LOCALE_SHA}  locales/about-locales.js`
].join('\n')+'\n';
await writeFile(resolve(dir,'SHA256SUMS.txt'),sums);

console.log(`V4.07.35 bytes: ${candidateBuffer.length}`);
console.log(`V4.07.35 sha256: ${sha(candidateBuffer)}`);
console.log(`Locale unchanged: ${localeBuffer.length} bytes / ${sha(localeBuffer)}`);

import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407Test20RegressionDelta} from './v4-07-test20-regression-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputPath=resolve(outDir,'gewitterradar-v4.07.19.js');
const inputBytes=await readFile(inputPath);
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1845550||inputDigest!=='1a1446a11eb5a4574712de0370f6204a4948d173f9f67c1110d28ded79b3a152')throw new Error(`TEST20 requires exact TEST19 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.19';"))throw new Error('TEST20 expected visible V4.07.19 baseline');
if(!source.includes('class="v407-location-country-clear"'))throw new Error('TEST20 requires accepted V4.07.19 iPad country clear control');
if(!source.includes("notes:[copy.ln.join(' ')]"))throw new Error('TEST20 requires accepted V4.07.19 Help runtime locale schema');
if(!source.includes('radii:HELP_REFINED_ICONS_V6.radii'))throw new Error('TEST20 requires accepted radius icon');

const output=v407Test20RegressionDelta(source).replace(/\r\n?/g,'\n');
const bytes=Buffer.from(output,'utf8');
const digest=hash(bytes);
await Promise.all([
  writeFile(resolve(outDir,'gewitterradar.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07-test.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07.20.js'),bytes),
]);
await mkdir(resolve(outDir,'locales'),{recursive:true});
await copyFile(resolve(root,'frontend/locales/about-locales.js'),resolve(outDir,'locales/about-locales.js'));
const localeBytes=await readFile(resolve(outDir,'locales/about-locales.js'));
const localeDigest=hash(localeBytes);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n${digest}  gewitterradar-v4.07.20.js\n${inputDigest}  gewitterradar-v4.07.19.js\n${localeDigest}  locales/about-locales.js\n`);
console.log(`Finalized V4.07.20: ${bytes.length} bytes, sha256 ${digest}`);
console.log(`Locales: ${localeBytes.length} bytes, sha256 ${localeDigest}`);

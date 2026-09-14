import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407Test19RegressionDelta} from './v4-07-test19-regression-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputPath=resolve(outDir,'gewitterradar-v4.07.18.js');
const inputBytes=await readFile(inputPath);
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1844153||inputDigest!=='49d66d83f5ebea3fef809b1e384127ae9dfe2820def589aed8b2da01be601f88')throw new Error(`TEST19 requires exact TEST18 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.18';"))throw new Error('TEST19 expected visible V4.07.18 baseline');
if(!source.includes('radii:HELP_REFINED_ICONS_V6.radii'))throw new Error('TEST19 requires accepted V4.07.17 radius icon');
if(!source.includes("const HELP_PREMIUM_ICON_VARIANT = 'B';"))throw new Error('TEST19 requires accepted Help network variant B');

const output=v407Test19RegressionDelta(source).replace(/\r\n?/g,'\n');
const bytes=Buffer.from(output,'utf8');
const digest=hash(bytes);
await Promise.all([
  writeFile(resolve(outDir,'gewitterradar.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07-test.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07.19.js'),bytes),
]);
await mkdir(resolve(outDir,'locales'),{recursive:true});
await copyFile(resolve(root,'frontend/locales/about-locales.js'),resolve(outDir,'locales/about-locales.js'));
const localeBytes=await readFile(resolve(outDir,'locales/about-locales.js'));
const localeDigest=hash(localeBytes);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n${digest}  gewitterradar-v4.07.19.js\n${inputDigest}  gewitterradar-v4.07.18.js\n${localeDigest}  locales/about-locales.js\n`);
console.log(`Finalized V4.07.19: ${bytes.length} bytes, sha256 ${digest}`);
console.log(`Locales: ${localeBytes.length} bytes, sha256 ${localeDigest}`);

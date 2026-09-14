import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407Test24HelpReviewDelta} from './v4-07-test24-help-review-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputBytes=await readFile(resolve(outDir,'gewitterradar-v4.07.23.js'));
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1854294||inputDigest!=='061b79c11e5507c27ec62dc552b9a7ec1e0caccc9a10e3b3d7ccd928113a786e')throw new Error(`TEST24 requires exact accepted TEST23 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.23';"))throw new Error('TEST24 expected visible V4.07.23 baseline');
if(!source.includes('V4.07-TEST23-2026-09-14'))throw new Error('TEST24 requires accepted TEST23 build marker');
if(!source.includes("title:'Standort & gespeicherte Orte'"))throw new Error('TEST24 requires accepted TEST23 German location Help');
if(!source.includes("title:'Location & saved places'"))throw new Error('TEST24 requires accepted TEST23 English location Help');
if(!source.includes('radii:HELP_REFINED_ICONS_V6.radii'))throw new Error('TEST24 requires frozen premium radii header icon');

const output=v407Test24HelpReviewDelta(source).replace(/\r\n?/g,'\n');
const bytes=Buffer.from(output,'utf8');
const digest=hash(bytes);
await Promise.all([
  writeFile(resolve(outDir,'gewitterradar.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07-test.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07.24.js'),bytes),
]);
await mkdir(resolve(outDir,'locales'),{recursive:true});
await copyFile(resolve(root,'frontend/locales/about-locales.js'),resolve(outDir,'locales/about-locales.js'));
const localeBytes=await readFile(resolve(outDir,'locales/about-locales.js'));
const localeDigest=hash(localeBytes);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n${digest}  gewitterradar-v4.07.24.js\n${inputDigest}  gewitterradar-v4.07.23.js\n${localeDigest}  locales/about-locales.js\n`);
console.log(`Finalized V4.07.24: ${bytes.length} bytes, sha256 ${digest}`);
console.log('V4.07.24: adaptive Help height, semantic saved-place action styling and refined removal wording on exact V4.07.23 baseline.');

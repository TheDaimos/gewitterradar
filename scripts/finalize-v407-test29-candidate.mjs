import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407Test29ExternalHelpLocalesDelta} from './v4-07-test29-external-help-locales-delta.mjs';
import {buildV407Test29ExternalHelpLocales} from './v4-07-test29-build-external-help-locales.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputBytes=await readFile(resolve(outDir,'gewitterradar-v4.07.28.js'));
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1858624||inputDigest!=='d3c67dbcc2a9c25bec71eb6deb0ecd1085b054d61435b366a7c442f4a4d169f8')throw new Error(`TEST29 requires exact accepted TEST28 input; got ${inputBytes.length} bytes / ${inputDigest}`);
const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.28';")||!source.includes('V4.07-TEST28-2026-09-14'))throw new Error('TEST29 expected visible V4.07.28 baseline');
if(!source.includes('const V407_HELP_COPY = Object.freeze(')||!source.includes('v407PatchExternalHelpLocales'))throw new Error('TEST29 expected bundled external Help patch in TEST28 input');

const output=v407Test29ExternalHelpLocalesDelta(source).replace(/\r\n?/g,'\n');
const bytes=Buffer.from(output,'utf8');
const digest=hash(bytes);
await Promise.all([
  writeFile(resolve(outDir,'gewitterradar.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07-test.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07.29.js'),bytes),
]);
await mkdir(resolve(outDir,'locales'),{recursive:true});
const sourceLocalePath=resolve(root,'frontend/locales/about-locales.js');
const sourceLocaleText=await readFile(sourceLocalePath,'utf8');
const {moduleText}=await buildV407Test29ExternalHelpLocales(source,sourceLocaleText,sourceLocalePath);
const localeBytes=Buffer.from(moduleText.replace(/\r\n?/g,'\n'),'utf8');
await writeFile(resolve(outDir,'locales/about-locales.js'),localeBytes);
const localeDigest=hash(localeBytes);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n${digest}  gewitterradar-v4.07.29.js\n${inputDigest}  gewitterradar-v4.07.28.js\n${localeDigest}  locales/about-locales.js\n`);
console.log(`Finalized V4.07.29: ${bytes.length} bytes, sha256 ${digest}`);
console.log(`External locale module: ${localeBytes.length} bytes, sha256 ${localeDigest}`);
console.log('V4.07.29: approved V4.07.28 Help content rolled out to all 17 external locales; only DE/EN Help remains native in the main JS.');

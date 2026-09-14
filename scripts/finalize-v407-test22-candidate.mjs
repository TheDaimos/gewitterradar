import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407Test22SettingsAccordionScrollDelta} from './v4-07-test22-settings-accordion-scroll-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputBytes=await readFile(resolve(outDir,'gewitterradar-v4.07.21.js'));
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1848338||inputDigest!=='241808eb2d9924f3dc737cc4eabce053ebc57883245e1a0bfaf8d1f864b669c7')throw new Error(`TEST22 requires exact real-tested TEST21 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.21';"))throw new Error('TEST22 expected visible V4.07.21 baseline');
if(!source.includes('diagnostic-main-cell'))throw new Error('TEST22 requires accepted A1-J10 Main diagnostic grid');
if(!source.includes('v407LocationDialogLanguage'))throw new Error('TEST22 requires accepted runtime language-cache fix');
if(!source.includes("max-height:calc(100dvh - 92px)"))throw new Error('TEST22 requires accepted diagnostic scroll fix');
if(!source.includes('class="v407-location-country-clear"'))throw new Error('TEST22 requires accepted iPad country clear control');
if(!source.includes('radii:HELP_REFINED_ICONS_V6.radii'))throw new Error('TEST22 requires accepted radius icon');

const output=v407Test22SettingsAccordionScrollDelta(source).replace(/\r\n?/g,'\n');
const bytes=Buffer.from(output,'utf8');
const digest=hash(bytes);
await Promise.all([
  writeFile(resolve(outDir,'gewitterradar.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07-test.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07.22.js'),bytes),
]);
await mkdir(resolve(outDir,'locales'),{recursive:true});
await copyFile(resolve(root,'frontend/locales/about-locales.js'),resolve(outDir,'locales/about-locales.js'));
const localeBytes=await readFile(resolve(outDir,'locales/about-locales.js'));
const localeDigest=hash(localeBytes);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n${digest}  gewitterradar-v4.07.22.js\n${inputDigest}  gewitterradar-v4.07.21.js\n${localeDigest}  locales/about-locales.js\n`);
console.log(`Finalized V4.07.22: ${bytes.length} bytes, sha256 ${digest}`);
console.log('V4.07.22: opened Settings accordion content scrolls only when viewport/zoom height requires it.');

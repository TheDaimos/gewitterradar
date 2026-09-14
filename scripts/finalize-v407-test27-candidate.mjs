import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407Test27HelpMachinedMetalTokensDelta} from './v4-07-test27-help-machined-metal-tokens-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputBytes=await readFile(resolve(outDir,'gewitterradar-v4.07.26.js'));
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1856322||inputDigest!=='885bb0783592bc2500f5524e74f419de95bd58da9d3e86c744f11206b003181b')throw new Error(`TEST27 requires exact accepted TEST26 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.26';"))throw new Error('TEST27 expected visible V4.07.26 baseline');
if(!source.includes('V4.07-TEST26-2026-09-14'))throw new Error('TEST27 requires accepted TEST26 build marker');
if(!source.includes('help-action-token help-action-save')||!source.includes('help-action-token help-action-delete')||!source.includes('help-action-token help-action-restore'))throw new Error('TEST27 requires accepted TEST26 semantic action rendering');

const output=v407Test27HelpMachinedMetalTokensDelta(source).replace(/\r\n?/g,'\n');
const bytes=Buffer.from(output,'utf8');
const digest=hash(bytes);
await Promise.all([
  writeFile(resolve(outDir,'gewitterradar.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07-test.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07.27.js'),bytes),
]);
await mkdir(resolve(outDir,'locales'),{recursive:true});
await copyFile(resolve(root,'frontend/locales/about-locales.js'),resolve(outDir,'locales/about-locales.js'));
const localeBytes=await readFile(resolve(outDir,'locales/about-locales.js'));
const localeDigest=hash(localeBytes);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n${digest}  gewitterradar-v4.07.27.js\n${inputDigest}  gewitterradar-v4.07.26.js\n${localeDigest}  locales/about-locales.js\n`);
console.log(`Finalized V4.07.27: ${bytes.length} bytes, sha256 ${digest}`);
console.log('V4.07.27: deeper machined-metal Help action tokens with restrained highlights and optically centered glyphs.');

import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407Test26HelpSatinMetalTokensDelta} from './v4-07-test26-help-satin-metal-tokens-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputBytes=await readFile(resolve(outDir,'gewitterradar-v4.07.25.js'));
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1856472||inputDigest!=='2a41b28790d729103775066ae9cdc00d21fab4e1b456b7caf538a049488c7d52')throw new Error(`TEST26 requires exact accepted TEST25 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.25';"))throw new Error('TEST26 expected visible V4.07.25 baseline');
if(!source.includes('V4.07-TEST25-2026-09-14'))throw new Error('TEST26 requires accepted TEST25 build marker');
if(!source.includes('help-action-token help-action-save')||!source.includes('help-action-token help-action-delete')||!source.includes('help-action-token help-action-restore'))throw new Error('TEST26 requires accepted TEST25 semantic action rendering');

const output=v407Test26HelpSatinMetalTokensDelta(source).replace(/\r\n?/g,'\n');
const bytes=Buffer.from(output,'utf8');
const digest=hash(bytes);
await Promise.all([
  writeFile(resolve(outDir,'gewitterradar.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07-test.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07.26.js'),bytes),
]);
await mkdir(resolve(outDir,'locales'),{recursive:true});
await copyFile(resolve(root,'frontend/locales/about-locales.js'),resolve(outDir,'locales/about-locales.js'));
const localeBytes=await readFile(resolve(outDir,'locales/about-locales.js'));
const localeDigest=hash(localeBytes);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n${digest}  gewitterradar-v4.07.26.js\n${inputDigest}  gewitterradar-v4.07.25.js\n${localeDigest}  locales/about-locales.js\n`);
console.log(`Finalized V4.07.26: ${bytes.length} bytes, sha256 ${digest}`);
console.log('V4.07.26: restrained satin metallic Help action tokens; no glossy badge effect.');

import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407Test28HelpPremiumMetalTokensDelta} from './v4-07-test28-help-premium-metal-tokens-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputBytes=await readFile(resolve(outDir,'gewitterradar-v4.07.27.js'));
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1857668||inputDigest!=='5672842a135c00189805079346d0b9fc0f38b13863c019106e6dc66b355c1938')throw new Error(`TEST28 requires exact accepted TEST27 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.27';"))throw new Error('TEST28 expected visible V4.07.27 baseline');
if(!source.includes('V4.07-TEST27-2026-09-14'))throw new Error('TEST28 requires accepted TEST27 build marker');
if(!source.includes('„★ Speichern“ legt gefundene Orte dauerhaft lokal ab.'))throw new Error('TEST28 expected quoted German save-token baseline');
if(!source.includes('help-action-token help-action-save')||!source.includes('help-action-token help-action-delete')||!source.includes('help-action-token help-action-restore'))throw new Error('TEST28 requires accepted TEST27 semantic action rendering');

const output=v407Test28HelpPremiumMetalTokensDelta(source).replace(/\r\n?/g,'\n');
const bytes=Buffer.from(output,'utf8');
const digest=hash(bytes);
await Promise.all([
  writeFile(resolve(outDir,'gewitterradar.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07-test.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07.28.js'),bytes),
]);
await mkdir(resolve(outDir,'locales'),{recursive:true});
await copyFile(resolve(root,'frontend/locales/about-locales.js'),resolve(outDir,'locales/about-locales.js'));
const localeBytes=await readFile(resolve(outDir,'locales/about-locales.js'));
const localeDigest=hash(localeBytes);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n${digest}  gewitterradar-v4.07.28.js\n${inputDigest}  gewitterradar-v4.07.27.js\n${localeDigest}  locales/about-locales.js\n`);
console.log(`Finalized V4.07.28: ${bytes.length} bytes, sha256 ${digest}`);
console.log('V4.07.28: premium-plus machined Help controls, higher optical undo centering and unquoted save-button rendering.');

import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407Test25HelpTokenClarityDelta} from './v4-07-test25-help-token-clarity-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputBytes=await readFile(resolve(outDir,'gewitterradar-v4.07.24.js'));
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1855999||inputDigest!=='049bc765796bc323ddd62bd61a4106291ec67648a1df941c2465b6db861dcb01')throw new Error(`TEST25 requires exact accepted TEST24 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.24';"))throw new Error('TEST25 expected visible V4.07.24 baseline');
if(!source.includes('V4.07-TEST24-2026-09-14'))throw new Error('TEST25 requires accepted TEST24 build marker');
if(!source.includes('help-action-token help-action-delete')||!source.includes('help-action-token help-action-restore'))throw new Error('TEST25 requires accepted TEST24 semantic action rendering');
if(!source.includes('Mit × wird ein Ort nicht sofort gelöscht, sondern zur Löschung vorgemerkt.'))throw new Error('TEST25 requires accepted TEST24 removal wording');

const output=v407Test25HelpTokenClarityDelta(source).replace(/\r\n?/g,'\n');
const bytes=Buffer.from(output,'utf8');
const digest=hash(bytes);
await Promise.all([
  writeFile(resolve(outDir,'gewitterradar.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07-test.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07.25.js'),bytes),
]);
await mkdir(resolve(outDir,'locales'),{recursive:true});
await copyFile(resolve(root,'frontend/locales/about-locales.js'),resolve(outDir,'locales/about-locales.js'));
const localeBytes=await readFile(resolve(outDir,'locales/about-locales.js'));
const localeDigest=hash(localeBytes);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n${digest}  gewitterradar-v4.07.25.js\n${inputDigest}  gewitterradar-v4.07.24.js\n${localeDigest}  locales/about-locales.js\n`);
console.log(`Finalized V4.07.25: ${bytes.length} bytes, sha256 ${digest}`);
console.log('V4.07.25: sharper premium inline action badges for save/delete/restore and stronger Location entity contrast.');

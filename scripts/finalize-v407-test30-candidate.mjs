import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407Test30HelpUseTokenDelta} from './v4-07-test30-help-use-token-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputBytes=await readFile(resolve(outDir,'gewitterradar-v4.07.29.js'));
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1777891||inputDigest!=='0a65b11e59bae32ec267a3269f0f3c5aceec28adb4b7a8d040fd1d5bec327c93')throw new Error(`TEST30 requires exact accepted TEST29 input; got ${inputBytes.length} bytes / ${inputDigest}`);
const localeBytes=await readFile(resolve(outDir,'locales/about-locales.js'));
const localeDigest=hash(localeBytes);
if(localeBytes.length!==402169||localeDigest!=='f88f3c00e2f4e888e0354f9bf1cddea7035730d2771e0eac4f3f948271a7f189')throw new Error(`TEST30 requires exact TEST29 external locale module; got ${localeBytes.length} bytes / ${localeDigest}`);
const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.29';")||!source.includes('V4.07-TEST29-2026-09-14'))throw new Error('TEST30 expected visible V4.07.29 baseline');
if(!source.includes('module.HELP_EXTERNAL_LOCALES_V40729'))throw new Error('TEST30 expected external TEST29 Help registry loader');

const output=v407Test30HelpUseTokenDelta(source).replace(/\r\n?/g,'\n');
const bytes=Buffer.from(output,'utf8');
const digest=hash(bytes);
await Promise.all([
  writeFile(resolve(outDir,'gewitterradar.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07-test.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07.30.js'),bytes),
]);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n${digest}  gewitterradar-v4.07.30.js\n${inputDigest}  gewitterradar-v4.07.29.js\n${localeDigest}  locales/about-locales.js\n`);
console.log(`Finalized V4.07.30: ${bytes.length} bytes, sha256 ${digest}`);
console.log(`External locale module preserved: ${localeBytes.length} bytes, sha256 ${localeDigest}`);
console.log('V4.07.30: blue Use/Nutzen Help action button plus a quieter Location entity highlight; accepted radii remain untouched.');

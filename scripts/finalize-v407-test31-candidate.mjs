import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {buildV40731ExternalHelpLocales,replaceV40729RegistryWithV40731,v407Test31HelpI18nDelta} from './v4-07-test31-help-i18n-r2.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

const inputBytes=await readFile(resolve(outDir,'gewitterradar-v4.07.30.js'));
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1779464||inputDigest!=='858d2d21026814d916d9358fb11bcb39805fd4f0f6104553dbcf4f7a5c454cb0')throw new Error(`TEST31 requires exact accepted TEST30 input; got ${inputBytes.length} bytes / ${inputDigest}`);
const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.30';")||!source.includes('V4.07-TEST30-2026-09-14'))throw new Error('TEST31 expected visible V4.07.30 baseline');
if(!source.includes('module.HELP_EXTERNAL_LOCALES_V40729'))throw new Error('TEST31 expected TEST29 external Help registry loader in TEST30 baseline');

const localePath=resolve(outDir,'locales/about-locales.js');
const localeBytes=await readFile(localePath);
const localeDigest=hash(localeBytes);
if(localeBytes.length!==402169||localeDigest!=='f88f3c00e2f4e888e0354f9bf1cddea7035730d2771e0eac4f3f948271a7f189')throw new Error(`TEST31 requires exact TEST30 external locale module; got ${localeBytes.length} bytes / ${localeDigest}`);
const imported=await import(pathToFileURL(localePath).href+'?v40731-finalize');
const base=imported.HELP_EXTERNAL_LOCALES_V40729;
if(!base||Object.keys(base).length!==17)throw new Error('TEST31 expected complete TEST29 external Help registry');
const v40731=buildV40731ExternalHelpLocales(base);
const nextLocaleText=replaceV40729RegistryWithV40731(localeBytes.toString('utf8'),v40731).replace(/\r\n?/g,'\n');
const nextLocaleBytes=Buffer.from(nextLocaleText,'utf8');
const nextLocaleDigest=hash(nextLocaleBytes);

const output=v407Test31HelpI18nDelta(source).replace(/\r\n?/g,'\n');
const bytes=Buffer.from(output,'utf8');
const digest=hash(bytes);
await Promise.all([
  writeFile(resolve(outDir,'gewitterradar.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07-test.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07.31.js'),bytes),
  writeFile(localePath,nextLocaleBytes),
]);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n${digest}  gewitterradar-v4.07.31.js\n${inputDigest}  gewitterradar-v4.07.30.js\n${nextLocaleDigest}  locales/about-locales.js\n`);
console.log(`Finalized V4.07.31: ${bytes.length} bytes, sha256 ${digest}`);
console.log(`External locale module V4.07.31: ${nextLocaleBytes.length} bytes, sha256 ${nextLocaleDigest}`);
console.log('V4.07.31: complete Help i18n regression fix; DE/EN remain native, 17 external locales use the V40731 registry, and all four dialects no longer inherit Standard German Help blocks.');

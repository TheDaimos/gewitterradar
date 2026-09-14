import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407Test21RegressionDelta} from './v4-07-test21-regression-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputPath=resolve(outDir,'gewitterradar-v4.07.20.js');
const inputBytes=await readFile(inputPath);
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1847939||inputDigest!=='ba3d45b6362c40572a9e8da97182a8dddc42fc7baac28a823d6269224e6742ca')throw new Error(`TEST21 requires exact TEST20 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.20';"))throw new Error('TEST21 expected visible V4.07.20 baseline');
if(!source.includes("this._renderDiagnosticMainGrid(overlay);"))throw new Error('TEST21 requires accepted A1-J10 Main diagnostic grid');
if(!source.includes('<span class="kpi-label">Treffer · 60 Min</span>'))throw new Error('TEST21 requires accepted KPI i18n source key');
if(!source.includes('class="v407-location-country-clear"'))throw new Error('TEST21 requires accepted iPad country clear control');
if(!source.includes('radii:HELP_REFINED_ICONS_V6.radii'))throw new Error('TEST21 requires accepted radius icon');

const output=v407Test21RegressionDelta(source).replace(/\r\n?/g,'\n');
const bytes=Buffer.from(output,'utf8');
const digest=hash(bytes);
await Promise.all([
  writeFile(resolve(outDir,'gewitterradar.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07-test.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07.21.js'),bytes),
]);
await mkdir(resolve(outDir,'locales'),{recursive:true});
await copyFile(resolve(root,'frontend/locales/about-locales.js'),resolve(outDir,'locales/about-locales.js'));
const localeBytes=await readFile(resolve(outDir,'locales/about-locales.js'));
const localeDigest=hash(localeBytes);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n${digest}  gewitterradar-v4.07.21.js\n${inputDigest}  gewitterradar-v4.07.20.js\n${localeDigest}  locales/about-locales.js\n`);
console.log(`Finalized V4.07.21: ${bytes.length} bytes, sha256 ${digest}`);
console.log(`Locales: ${localeBytes.length} bytes, sha256 ${localeDigest}`);

import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407Test23HelpContentDelta} from './v4-07-test23-help-content-delta.mjs';
import {v407Test23ExternalHelpDelta} from './v4-07-test23-external-help-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputBytes=await readFile(resolve(outDir,'gewitterradar-v4.07.22.js'));
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1849560||inputDigest!=='ec883d20eea8db95b22884b001cdf85c0c20e8cdec39ab3caf9fedb079f795fe')throw new Error(`TEST23 requires exact accepted TEST22 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.22';"))throw new Error('TEST23 expected visible V4.07.22 baseline');
if(!source.includes('V4.07-TEST22-2026-09-14'))throw new Error('TEST23 requires accepted TEST22 build marker');
if(!source.includes("{key:'radii',title:'Die Radien'"))throw new Error('TEST23 requires accepted radii Help baseline');
if(!source.includes("{key:'location',title:'Referenzstandort'"))throw new Error('TEST23 requires pre-change German location heading');
if(!source.includes("title:'Externe Dienste & Netzwerkfreigaben'"))throw new Error('TEST23 requires pre-change German network heading');
if(!source.includes("['Gewittersimulation','ist ausschließlich für Test und Diagnose gedacht"))throw new Error('TEST23 requires pre-change storm simulation Help entry');
if(!source.includes('radii:HELP_REFINED_ICONS_V6.radii'))throw new Error('TEST23 requires accepted premium radii header icon');
if(!source.includes('max-height:clamp(132px,calc(100dvh - 440px),520px);'))throw new Error('TEST23 requires accepted TEST22 zoom-safe Settings scroll');

const nativeOutput=v407Test23HelpContentDelta(source);
const output=v407Test23ExternalHelpDelta(nativeOutput).replace(/\r\n?/g,'\n');
const bytes=Buffer.from(output,'utf8');
const digest=hash(bytes);
await Promise.all([
  writeFile(resolve(outDir,'gewitterradar.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07-test.js'),bytes),
  writeFile(resolve(outDir,'gewitterradar-v4.07.23.js'),bytes),
]);
await mkdir(resolve(outDir,'locales'),{recursive:true});
await copyFile(resolve(root,'frontend/locales/about-locales.js'),resolve(outDir,'locales/about-locales.js'));
const localeBytes=await readFile(resolve(outDir,'locales/about-locales.js'));
const localeDigest=hash(localeBytes);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n${digest}  gewitterradar-v4.07.23.js\n${inputDigest}  gewitterradar-v4.07.22.js\n${localeDigest}  locales/about-locales.js\n`);
console.log(`Finalized V4.07.23: ${bytes.length} bytes, sha256 ${digest}`);
console.log('V4.07.23: bundled accepted Help wording, radius ring bullets, location/network headings, calibration/diagnostics and recommended defaults across all 19 runtime languages.');

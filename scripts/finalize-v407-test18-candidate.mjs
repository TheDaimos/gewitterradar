import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407IpadQueryClearTest18Delta} from './v4-07-ipad-query-clear-test18-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const readBytes=name=>readFile(resolve(outDir,name));
const writeBytes=(name,bytes)=>writeFile(resolve(outDir,name),bytes);

const inputBytes=await readBytes('gewitterradar-v4.07.17.js');
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1843980||inputDigest!=='11d9d350d13eb62a3a02a7567f1f2eba94d83bf93d409e23b7100f5f40a44dd2')throw new Error(`TEST18 requires exact real-tested TEST17 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.17';"))throw new Error('TEST18 expected visible V4.07.17 baseline');
if(!source.includes('radii:HELP_REFINED_ICONS_V6.radii'))throw new Error('TEST18 requires accepted V4.07.17 radius icon');
if(!source.includes('HELP_REFINED_ICONS_V5.question')||!source.includes('HELP_REFINED_ICONS_V5.troubleshooting'))throw new Error('TEST18 requires accepted question/troubleshooting icons');
if(!source.includes("const HELP_PREMIUM_ICON_VARIANT = 'B';"))throw new Error('TEST18 requires accepted network shield variant B');

const output=v407IpadQueryClearTest18Delta(source).replace(/\r\n?/g,'\n');
const outputBytes=Buffer.from(output,'utf8');
const outputDigest=hash(outputBytes);
await Promise.all([writeBytes('gewitterradar.js',outputBytes),writeBytes('gewitterradar-v4.07-test.js',outputBytes),writeBytes('gewitterradar-v4.07.18.js',outputBytes)]);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${outputDigest}  gewitterradar.js\n${outputDigest}  gewitterradar-v4.07-test.js\n${outputDigest}  gewitterradar-v4.07.18.js\n${inputDigest}  gewitterradar-v4.07.17.js\n`);
console.log(`Finalized V4.07.18 from exact TEST17: ${outputBytes.length} bytes, sha256 ${outputDigest}`);
console.log('V4.07.18: iPad/WebKit-safe custom clear control for the Ort / PLZ query field; accepted V4.07.17 visuals remain unchanged.');

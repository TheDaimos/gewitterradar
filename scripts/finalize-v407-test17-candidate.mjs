import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407HelpRadiiTest17Delta} from './v4-07-help-radii-test17-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const iconDir=resolve(root,'artwork/help-icons/hires');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const readBytes=name=>readFile(resolve(outDir,name));
const writeBytes=(name,bytes)=>writeFile(resolve(outDir,name),bytes);
const toDataUri=async name=>`data:image/svg+xml;base64,${(await readFile(resolve(iconDir,name))).toString('base64')}`;

const inputBytes=await readBytes('gewitterradar-v4.07.16.js');
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1842239||inputDigest!=='56cfd3bafa6a2379baedb2d90b27d09b7d00c4abca90bfe650f24a3ef0c868f0')throw new Error(`TEST17 requires exact real-tested TEST16 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.16';"))throw new Error('TEST17 expected visible V4.07.16 baseline');
if(!source.includes("const HELP_PREMIUM_ICON_VARIANT = 'B';"))throw new Error('TEST17 requires selected network shield variant B');
if(!source.includes('HELP_REFINED_ICONS_V5.question')||!source.includes('HELP_REFINED_ICONS_V5.troubleshooting'))throw new Error('TEST17 requires accepted V4.07.16 question/troubleshooting icons');

const radiiData=await toDataUri('help-radii-v2.svg');
const output=v407HelpRadiiTest17Delta(source,radiiData).replace(/\r\n?/g,'\n');
const outputBytes=Buffer.from(output,'utf8');
const outputDigest=hash(outputBytes);
await Promise.all([writeBytes('gewitterradar.js',outputBytes),writeBytes('gewitterradar-v4.07-test.js',outputBytes),writeBytes('gewitterradar-v4.07.17.js',outputBytes)]);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${outputDigest}  gewitterradar.js\n${outputDigest}  gewitterradar-v4.07-test.js\n${outputDigest}  gewitterradar-v4.07.17.js\n${inputDigest}  gewitterradar-v4.07.16.js\n`);
console.log(`Finalized V4.07.17 from exact TEST16: ${outputBytes.length} bytes, sha256 ${outputDigest}`);
console.log('V4.07.17: three airy radius rings; outer circle is the outer radius, with wider spacing and refined 48-unit strokes.');

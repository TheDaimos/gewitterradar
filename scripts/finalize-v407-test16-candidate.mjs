import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407HelpPolishTest16Delta} from './v4-07-help-polish-test16-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const iconDir=resolve(root,'artwork/help-icons/hires');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const readBytes=name=>readFile(resolve(outDir,name));
const writeBytes=(name,bytes)=>writeFile(resolve(outDir,name),bytes);
const toDataUri=async name=>`data:image/svg+xml;base64,${(await readFile(resolve(iconDir,name))).toString('base64')}`;

const inputBytes=await readBytes('gewitterradar-v4.07.15.js');
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1835806||inputDigest!=='4d5cdd2f5fe7f0a0e987d978cead6cc5ff78d3cf6123d226f3e8787fdd3db986')throw new Error(`TEST16 requires exact real-tested TEST15 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const iconData=Object.freeze({question:await toDataUri('help-question-v5.svg'),troubleshooting:await toDataUri('help-troubleshooting-v5.svg')});
const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.15';"))throw new Error('TEST16 expected visible V4.07.15 baseline');
if(!source.includes("const HELP_PREMIUM_ICON_VARIANT = 'B';"))throw new Error('TEST16 requires selected network shield variant B');

const output=v407HelpPolishTest16Delta(source,iconData).replace(/\r\n?/g,'\n');
const outputBytes=Buffer.from(output,'utf8');
const outputDigest=hash(outputBytes);
await Promise.all([writeBytes('gewitterradar.js',outputBytes),writeBytes('gewitterradar-v4.07-test.js',outputBytes),writeBytes('gewitterradar-v4.07.16.js',outputBytes)]);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${outputDigest}  gewitterradar.js\n${outputDigest}  gewitterradar-v4.07-test.js\n${outputDigest}  gewitterradar-v4.07.16.js\n${inputDigest}  gewitterradar-v4.07.15.js\n`);
console.log(`Finalized V4.07.16 from exact TEST15: ${outputBytes.length} bytes, sha256 ${outputDigest}`);
console.log('V4.07.16: smaller question emblem and filled high-contrast troubleshooting exclamation optimized for 36-42px rendering.');

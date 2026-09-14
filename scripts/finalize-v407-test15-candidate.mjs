import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407HelpPolishTest15Delta} from './v4-07-help-polish-test15-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const iconDir=resolve(root,'artwork/help-icons/hires');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const readBytes=name=>readFile(resolve(outDir,name));
const writeBytes=(name,bytes)=>writeFile(resolve(outDir,name),bytes);
const toDataUri=async name=>`data:image/svg+xml;base64,${(await readFile(resolve(iconDir,name))).toString('base64')}`;

const inputBytes=await readBytes('gewitterradar-v4.07.14.js');
const inputDigest=hash(inputBytes);
if(inputBytes.length!==1829315||inputDigest!=='c19dc98fc5e52ce53489e08130b64e0997a83d66ad0fb8b02bbf8c37efaa15f6')throw new Error(`TEST15 requires exact real-tested TEST14 input; got ${inputBytes.length} bytes / ${inputDigest}`);

const iconData=Object.freeze({question:await toDataUri('help-question-v4.svg'),troubleshooting:await toDataUri('help-troubleshooting-v4.svg')});
const source=inputBytes.toString('utf8');
if(!source.includes("const CARD_DISPLAY_VERSION = '4.07.14';"))throw new Error('TEST15 expected visible V4.07.14 baseline');
if(!source.includes("const HELP_PREMIUM_ICON_VARIANT = 'B';"))throw new Error('TEST15 requires selected network shield variant B');

const output=v407HelpPolishTest15Delta(source,iconData).replace(/\r\n?/g,'\n');
const outputBytes=Buffer.from(output,'utf8');
const outputDigest=hash(outputBytes);
await Promise.all([writeBytes('gewitterradar.js',outputBytes),writeBytes('gewitterradar-v4.07-test.js',outputBytes),writeBytes('gewitterradar-v4.07.15.js',outputBytes)]);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),`${outputDigest}  gewitterradar.js\n${outputDigest}  gewitterradar-v4.07-test.js\n${outputDigest}  gewitterradar-v4.07.15.js\n${inputDigest}  gewitterradar-v4.07.14.js\n`);
console.log(`Finalized V4.07.15 from exact TEST14: ${outputBytes.length} bytes, sha256 ${outputDigest}`);
console.log('V4.07.15: micro-optimized question/warning masters and close shifted further toward upper-right edge.');

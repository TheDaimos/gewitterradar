import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407HelpPolishTest13Delta} from './v4-07-help-polish-test13-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const iconDir=resolve(root,'artwork/help-icons/hires');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const readBytes=name=>readFile(resolve(outDir,name));
const writeBytes=(name,bytes)=>writeFile(resolve(outDir,name),bytes);
const toDataUri=async name=>`data:image/svg+xml;base64,${(await readFile(resolve(iconDir,name))).toString('base64')}`;

const inputBytes=await readBytes('gewitterradar-v4.07.12B.js');
const inputDigest=hash(inputBytes);
if (inputBytes.length!==1811635 || inputDigest!=='6fd6003fc9fa54b620648bb9067c3f3d2ae0cf7a082d0d63594fd11b60bcc4f9') {
  throw new Error(`TEST13 requires exact selected TEST12B input; got ${inputBytes.length} bytes / ${inputDigest}`);
}

const iconData=Object.freeze({
  question:await toDataUri('help-question-v2.svg'),
  troubleshooting:await toDataUri('help-troubleshooting-v2.svg'),
});

const source=inputBytes.toString('utf8');
if (!source.includes("const CARD_DISPLAY_VERSION = '4.07.12B';")) throw new Error('TEST13 expected visible V4.07.12B baseline');
if (!source.includes("const HELP_PREMIUM_ICON_VARIANT = 'B';")) throw new Error('TEST13 requires selected premium network-shield variant B');
if (!source.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST12B-2026-09-14';")) throw new Error('TEST13 expected TEST12B build marker');

const output=v407HelpPolishTest13Delta(source,iconData).replace(/\r\n?/g,'\n');
const outputBytes=Buffer.from(output,'utf8');
const outputDigest=hash(outputBytes);

await Promise.all([
  writeBytes('gewitterradar.js',outputBytes),
  writeBytes('gewitterradar-v4.07-test.js',outputBytes),
  writeBytes('gewitterradar-v4.07.13.js',outputBytes),
]);

const a12Bytes=await readBytes('gewitterradar-v4.07.12A.js');
const b12Bytes=await readBytes('gewitterradar-v4.07.12B.js');
await writeFile(resolve(outDir,'SHA256SUMS.txt'),
  `${outputDigest}  gewitterradar.js\n`+
  `${outputDigest}  gewitterradar-v4.07-test.js\n`+
  `${outputDigest}  gewitterradar-v4.07.13.js\n`+
  `${hash(a12Bytes)}  gewitterradar-v4.07.12A.js\n`+
  `${hash(b12Bytes)}  gewitterradar-v4.07.12B.js\n`
);

console.log(`Finalized V4.07.13 Help polish from selected TEST12B: ${outputBytes.length} bytes, sha256 ${outputDigest}`);
console.log('V4.07.13: refined premium question icon, warning-triangle troubleshooting icon, restored legacy premium close asset, close shifted 4px up/right.');

import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407HelpPolishTest14Delta} from './v4-07-help-polish-test14-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const iconDir=resolve(root,'artwork/help-icons/hires');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const readBytes=name=>readFile(resolve(outDir,name));
const writeBytes=(name,bytes)=>writeFile(resolve(outDir,name),bytes);
const toDataUri=async name=>`data:image/svg+xml;base64,${(await readFile(resolve(iconDir,name))).toString('base64')}`;

const inputBytes=await readBytes('gewitterradar-v4.07.13.js');
const inputDigest=hash(inputBytes);
if (inputBytes.length!==1821053 || inputDigest!=='17c567e3a500aa61cac3acc20d70f8146316a9884c13f37549a4b3b1275c3da6') {
  throw new Error(`TEST14 requires exact TEST13 input; got ${inputBytes.length} bytes / ${inputDigest}`);
}

const iconData=Object.freeze({
  question:await toDataUri('help-question-v3.svg'),
  troubleshooting:await toDataUri('help-troubleshooting-v3.svg'),
});

const source=inputBytes.toString('utf8');
if (!source.includes("const CARD_DISPLAY_VERSION = '4.07.13';")) throw new Error('TEST14 expected visible V4.07.13 baseline');
if (!source.includes("const HELP_PREMIUM_ICON_VARIANT = 'B';")) throw new Error('TEST14 requires selected premium network-shield variant B');
if (!source.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST13-2026-09-14';")) throw new Error('TEST14 expected TEST13 build marker');

const output=v407HelpPolishTest14Delta(source,iconData).replace(/\r\n?/g,'\n');
const outputBytes=Buffer.from(output,'utf8');
const outputDigest=hash(outputBytes);

await Promise.all([
  writeBytes('gewitterradar.js',outputBytes),
  writeBytes('gewitterradar-v4.07-test.js',outputBytes),
  writeBytes('gewitterradar-v4.07.14.js',outputBytes),
]);

const b12Bytes=await readBytes('gewitterradar-v4.07.12B.js');
const v13Bytes=await readBytes('gewitterradar-v4.07.13.js');
await writeFile(resolve(outDir,'SHA256SUMS.txt'),
  `${outputDigest}  gewitterradar.js\n`+
  `${outputDigest}  gewitterradar-v4.07-test.js\n`+
  `${outputDigest}  gewitterradar-v4.07.14.js\n`+
  `${hash(v13Bytes)}  gewitterradar-v4.07.13.js\n`+
  `${hash(b12Bytes)}  gewitterradar-v4.07.12B.js\n`
);

console.log(`Finalized V4.07.14 Help polish from exact TEST13: ${outputBytes.length} bytes, sha256 ${outputDigest}`);
console.log('V4.07.14: clearer centered premium question mark with strong dot, clearer warning symbol, legacy close moved nearer the upper-right edge.');

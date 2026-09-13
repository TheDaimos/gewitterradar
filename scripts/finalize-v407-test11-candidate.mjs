import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407HelpPremiumIconsDelta} from './v4-07-help-premium-icons-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir = resolve(root,'artifacts/v407');
const inputPath = resolve(outDir,'gewitterradar.js');
const defaultPath = resolve(outDir,'gewitterradar.js');
const legacyAliasPath = resolve(outDir,'gewitterradar-v4.07-test.js');
const variantAPath = resolve(outDir,'gewitterradar-v4.07.11A.js');
const variantBPath = resolve(outDir,'gewitterradar-v4.07.11B.js');
const checksumPath = resolve(outDir,'SHA256SUMS.txt');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const iconDir = resolve(root,'artwork/help-icons/hires');
const iconFile = (name) => resolve(iconDir,`help-${name}.svg`);
const toDataUri = async (name) => `data:image/svg+xml;base64,${(await readFile(iconFile(name))).toString('base64')}`;

const sourceBytes = await readFile(inputPath);
const sourceDigest = hash(sourceBytes);
if (sourceBytes.length !== 1769874 || sourceDigest !== '358ce310c14ba609b9d840f39a28ef6499cdbcae24f6672cfc8001ec5acba0aa') {
  throw new Error(`TEST11 requires exact TEST10R1 input; got ${sourceBytes.length} bytes / ${sourceDigest}`);
}
const source = sourceBytes.toString('utf8');
if (!source.includes("const CARD_DISPLAY_VERSION = '4.07.10';")) throw new Error('TEST11 expected visible V4.07.10 TEST10R1 baseline');
if (!source.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST10R1-2026-09-13';")) throw new Error('TEST11 expected TEST10R1 build marker');

const iconData = Object.freeze({
  question:await toDataUri('question'),
  close:await toDataUri('close'),
  prerequisites:await toDataUri('prerequisites'),
  radii:await toDataUri('radii'),
  location:await toDataUri('location'),
  external_shield2:await toDataUri('external-shield2'),
  external_rj45:await toDataUri('external-rj45'),
  functions:await toDataUri('functions'),
  defaults:await toDataUri('defaults'),
  troubleshooting:await toDataUri('troubleshooting'),
  recorder:await toDataUri('recorder'),
});

const a = v407HelpPremiumIconsDelta(source,iconData,'A').replace(/\r\n?/g,'\n');
const b = v407HelpPremiumIconsDelta(source,iconData,'B').replace(/\r\n?/g,'\n');
const aBytes=Buffer.from(a,'utf8'), bBytes=Buffer.from(b,'utf8');
const aDigest=hash(aBytes), bDigest=hash(bBytes);
await writeFile(defaultPath,aBytes);
await writeFile(legacyAliasPath,aBytes);
await writeFile(variantAPath,aBytes);
await writeFile(variantBPath,bBytes);
await writeFile(checksumPath,
  `${aDigest}  gewitterradar.js\n${aDigest}  gewitterradar-v4.07-test.js\n${aDigest}  gewitterradar-v4.07.11A.js\n${bDigest}  gewitterradar-v4.07.11B.js\n`
);
console.log(`Finalized V4.07.11A premium Help icons: ${aBytes.length} bytes, sha256 ${aDigest}`);
console.log(`Finalized V4.07.11B premium Help icons: ${bBytes.length} bytes, sha256 ${bDigest}`);

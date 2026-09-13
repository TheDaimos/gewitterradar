import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407FirewallIconDelta} from './v4-07-firewall-icon-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir = resolve(root,'artifacts/v407');
const outputPath = resolve(outDir,'gewitterradar.js');
const versionedPath = resolve(outDir,'gewitterradar-v4.07-test.js');
const checksumPath = resolve(outDir,'SHA256SUMS.txt');

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

const source = await readFile(outputPath,'utf8');
if (!source.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST7-2026-09-13';")) {
  throw new Error('TEST8 finalizer expected the validated TEST7 candidate as input');
}

const candidate = v407FirewallIconDelta(source).replace(/\r\n?/g,'\n');
if (!candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST8-2026-09-13';")) {
  throw new Error('TEST8 build marker missing after firewall-icon finalization');
}

const bytes = Buffer.from(candidate,'utf8');
const digest = hash(bytes);
await writeFile(outputPath,bytes);
await writeFile(versionedPath,bytes);
await writeFile(checksumPath,`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n`);

console.log(`Finalized V4.07 TEST8 selected firewall icon: ${bytes.length} bytes, sha256 ${digest}`);

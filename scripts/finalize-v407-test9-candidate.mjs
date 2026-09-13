import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407LocationQueryClearDelta} from './v4-07-location-query-clear-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir = resolve(root,'artifacts/v407');
const outputPath = resolve(outDir,'gewitterradar.js');
const versionedPath = resolve(outDir,'gewitterradar-v4.07-test.js');
const checksumPath = resolve(outDir,'SHA256SUMS.txt');

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

const source = await readFile(outputPath,'utf8');
if (!source.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST8-2026-09-13';")) {
  throw new Error('TEST9R2 finalizer expected the validated byte-identical TEST8 candidate as input');
}

const candidate = v407LocationQueryClearDelta(source).replace(/\r\n?/g,'\n');
if (!candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST9R2-2026-09-13';")) {
  throw new Error('TEST9R2 build marker missing after query-clear finalization');
}

const bytes = Buffer.from(candidate,'utf8');
const digest = hash(bytes);
await writeFile(outputPath,bytes);
await writeFile(versionedPath,bytes);
await writeFile(checksumPath,`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n`);

console.log(`Finalized V4.07 TEST9R2 isolated location-query clear control: ${bytes.length} bytes, sha256 ${digest}`);

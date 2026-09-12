import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407LocationSearchDelta} from './v4-07-location-search-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir = resolve(root,'artifacts/v407');
const sourcePath = resolve(root,'frontend/gewitterradar.js');
const outputPath = resolve(outDir,'gewitterradar.js');
const versionedPath = resolve(outDir,'gewitterradar-v4.07-test.js');
const checksumPath = resolve(outDir,'SHA256SUMS.txt');

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

export async function buildV407Candidate() {
  const source = await readFile(sourcePath,'utf8');
  if (!source.includes("const CARD_VERSION = '4.06';")) throw new Error('Canonical source is not the expected V4.06 frontend');
  const candidate = v407LocationSearchDelta(source).replace(/\r\n?/g,'\n');
  if (candidate === source) throw new Error('V4.07 delta produced no change');
  const bytes = Buffer.from(candidate,'utf8');
  await mkdir(outDir,{recursive:true});
  await writeFile(outputPath,bytes);
  await writeFile(versionedPath,bytes);
  const digest = hash(bytes);
  await writeFile(checksumPath,`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n`);
  console.log(`Built V4.07 TEST CANDIDATE JS: ${bytes.length} bytes, sha256 ${digest}`);
  return {candidate,bytes,digest,outputPath,versionedPath};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildV407Candidate();

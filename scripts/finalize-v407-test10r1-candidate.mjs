import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407DesktopQueryClearVersionDelta} from './v4-07-desktop-query-clear-version-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir = resolve(root,'artifacts/v407');
const outputPath = resolve(outDir,'gewitterradar.js');
const versionedPath = resolve(outDir,'gewitterradar-v4.07-test.js');
const checksumPath = resolve(outDir,'SHA256SUMS.txt');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

const sourceBytes = await readFile(outputPath);
const sourceDigest = hash(sourceBytes);
if (sourceBytes.length !== 1769200 || sourceDigest !== 'a95e7b3346089f45e51c7ceebfc3d813b6bebac8cef56d3fa4cfa8dff37bd076') {
  throw new Error(`TEST10R1 requires the real-accepted TEST10 candidate as exact input; got ${sourceBytes.length} bytes / ${sourceDigest}`);
}
const source = sourceBytes.toString('utf8');
if (!source.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST10-2026-09-13';")) {
  throw new Error('TEST10R1 expected TEST10 build marker');
}

const candidate = v407DesktopQueryClearVersionDelta(source).replace(/\r\n?/g,'\n');
if (!candidate.includes("const CARD_DISPLAY_VERSION = '4.07.10';")) throw new Error('Visible V4.07.10 display version missing');
if (!candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST10R1-2026-09-13';")) throw new Error('TEST10R1 build marker missing');

const bytes = Buffer.from(candidate,'utf8');
const digest = hash(bytes);
await writeFile(outputPath,bytes);
await writeFile(versionedPath,bytes);
await writeFile(checksumPath,`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n`);
console.log(`Finalized V4.07 TEST10R1 desktop clear + visible V4.07.10: ${bytes.length} bytes, sha256 ${digest}`);

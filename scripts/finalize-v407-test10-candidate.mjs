import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407FullI18nDelta} from './v4-07-full-i18n-delta.mjs';
import {v407FirewallIconVariant2Delta} from './v4-07-firewall-icon-variant2-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir = resolve(root,'artifacts/v407');
const outputPath = resolve(outDir,'gewitterradar.js');
const versionedPath = resolve(outDir,'gewitterradar-v4.07-test.js');
const checksumPath = resolve(outDir,'SHA256SUMS.txt');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

const sourceBytes = await readFile(outputPath);
const sourceDigest = hash(sourceBytes);
if (sourceBytes.length !== 1651359 || sourceDigest !== '9d7f23d6307f1f232338446aabee19c88a1ddce1a0be1d534acea2b019fcf3b9') {
  throw new Error(`TEST10 requires the real-accepted TEST9R2 byte baseline; got ${sourceBytes.length} bytes / ${sourceDigest}`);
}

const source = sourceBytes.toString('utf8');
if (!source.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST9R2-2026-09-13';")) {
  throw new Error('TEST10 expected the real-accepted TEST9R2 marker');
}

// The existing full-i18n delta was intentionally authored against the pre-TEST9
// search-text block. TEST9R2 added only this accessibility-label helper directly
// before v407NormalizeText. Temporarily lift that exact helper out, apply the
// already-audited 19-language delta, then put the helper back at the same runtime
// boundary. This keeps TEST9R2 behaviour intact instead of modifying the accepted
// clear-control DOM or silently changing its implementation.
const clearLabelMatch = source.match(/      const v407ClearQueryLabel = \(\) => \(\{[\s\S]*?\}\[this\._languageValue\(\)\] \|\| 'Clear input'\);\n/);
if (!clearLabelMatch) throw new Error('TEST10 could not isolate the accepted TEST9R2 clear-label helper');
const clearLabelHelper = clearLabelMatch[0];
const sourceForI18n = source.replace(clearLabelHelper,'');
if (sourceForI18n.includes('const v407ClearQueryLabel')) throw new Error('TEST10 clear-label helper isolation was not unique');

let localized = v407FullI18nDelta(sourceForI18n);
const normalizeAnchor = `      const v407NormalizeText = (value) =>`;
if (localized.split(normalizeAnchor).length !== 2) throw new Error('TEST10 normalize anchor changed after full-i18n delta');
localized = localized.replace(normalizeAnchor,`${clearLabelHelper}${normalizeAnchor}`);

const candidate = v407FirewallIconVariant2Delta(localized).replace(/\r\n?/g,'\n');
if (!candidate.includes("const GEWITTERRADAR_BUILD = 'V4.07-TEST10-2026-09-13';")) {
  throw new Error('TEST10 build marker missing');
}
if (!candidate.includes('const V407_LOCATION_TEXTS = Object.freeze')) {
  throw new Error('TEST10 full language matrix missing');
}
if (!candidate.includes('M9.35 9v1.55M10.7 9v1.55')) {
  throw new Error('TEST10 shield variant 2 network-port motif missing');
}
if (!candidate.includes('const v407ClearQueryLabel')) {
  throw new Error('TEST10 regressed the accepted TEST9R2 clear-control labels');
}

const bytes = Buffer.from(candidate,'utf8');
const digest = hash(bytes);
await writeFile(outputPath,bytes);
await writeFile(versionedPath,bytes);
await writeFile(checksumPath,`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n`);

console.log(`Finalized V4.07 TEST10 full i18n + firewall shield variant 2: ${bytes.length} bytes, sha256 ${digest}`);

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const contractPath = path.join(root, 'tests/contracts/hires-asset-retention-v4.07.56.json');

function fail(message) {
  console.error(`HIRES-ASSET-RETENTION: FAIL: ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(contractPath)) {
  console.error(`HIRES-ASSET-RETENTION: FAIL: missing contract ${contractPath}`);
  process.exit(1);
}

const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const storageClasses = Array.isArray(contract.storageClasses) ? contract.storageClasses : [];
const protectedBlobs = Array.isArray(contract.protectedBlobs) ? contract.protectedBlobs : [];
const requiredMetadataPaths = Array.isArray(contract.requiredMetadataPaths)
  ? contract.requiredMetadataPaths
  : [];

if (contract.contractVersion !== 1) fail(`unsupported contractVersion ${contract.contractVersion}`);
if (storageClasses.length === 0) fail('storageClasses must not be empty');
if (protectedBlobs.length === 0) fail('protectedBlobs must not be empty');

for (const metadataPath of requiredMetadataPaths) {
  const absolute = path.join(root, metadataPath);
  if (!fs.existsSync(absolute)) {
    fail(`required metadata missing: ${metadataPath}`);
    continue;
  }
  if (fs.statSync(absolute).size === 0) fail(`required metadata is empty: ${metadataPath}`);
}

let treeOutput = '';
try {
  treeOutput = execFileSync(
    'git',
    ['ls-tree', '-r', '-l', '--full-tree', 'HEAD', 'artwork'],
    { cwd: root, encoding: 'utf8' },
  );
} catch (error) {
  console.error('HIRES-ASSET-RETENTION: FAIL: unable to enumerate Git artwork tree');
  throw error;
}

const entries = treeOutput
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const match = line.match(/^(\d+)\s+(\w+)\s+([0-9a-f]{40})\s+(-|\d+)\t(.+)$/);
    if (!match) throw new Error(`Unexpected git ls-tree line: ${line}`);
    return {
      mode: match[1],
      type: match[2],
      sha: match[3],
      size: match[4] === '-' ? null : Number(match[4]),
      file: match[5],
    };
  })
  .filter((entry) => entry.type === 'blob');

const artworkExtensions = new Set([
  '.png', '.webp', '.svg', '.jpg', '.jpeg', '.tif', '.tiff', '.psd', '.xcf', '.ai', '.eps',
]);

function insideStorageClass(file) {
  return storageClasses.some((prefix) => file === prefix || file.startsWith(`${prefix}/`));
}

const protectedCandidates = entries.filter((entry) => {
  if (!insideStorageClass(entry.file)) return false;
  return artworkExtensions.has(path.extname(entry.file).toLowerCase());
});

const contractBySha = new Map();
for (const item of protectedBlobs) {
  if (!item || typeof item !== 'object') {
    fail('protectedBlobs contains a non-object entry');
    continue;
  }
  const { label, preferredPath, gitBlobSha1, sizeBytes } = item;
  if (!label || !preferredPath || !/^[0-9a-f]{40}$/.test(gitBlobSha1 ?? '')) {
    fail(`invalid protected blob record: ${JSON.stringify(item)}`);
    continue;
  }
  if (!Number.isInteger(sizeBytes) || sizeBytes < 1) {
    fail(`invalid sizeBytes for ${label}`);
    continue;
  }
  if (!insideStorageClass(preferredPath)) {
    fail(`preferredPath outside protected storage classes: ${preferredPath}`);
  }
  const previous = contractBySha.get(gitBlobSha1);
  if (previous && previous.sizeBytes !== sizeBytes) {
    fail(`same blob SHA has conflicting sizes: ${gitBlobSha1}`);
  }
  contractBySha.set(gitBlobSha1, item);
}

const candidatesBySha = new Map();
for (const entry of protectedCandidates) {
  const list = candidatesBySha.get(entry.sha) ?? [];
  list.push(entry);
  candidatesBySha.set(entry.sha, list);
}

for (const item of protectedBlobs) {
  if (!item?.gitBlobSha1) continue;
  const matches = candidatesBySha.get(item.gitBlobSha1) ?? [];
  if (matches.length === 0) {
    fail(`${item.label} disappeared from all protected master/legacy storage classes; expected blob ${item.gitBlobSha1}`);
    continue;
  }
  if (!matches.some((entry) => entry.size === item.sizeBytes)) {
    fail(`${item.label} exists by blob id but size contract does not match ${item.sizeBytes} bytes`);
  }
}

for (const entry of protectedCandidates) {
  if (!contractBySha.has(entry.sha)) {
    fail(
      `unregistered master/legacy artwork detected: ${entry.file} (${entry.sha}, ${entry.size} bytes). ` +
      'Add it to the retention contract before it can become part of the protected repository state.',
    );
  }
}

if (process.exitCode) process.exit(process.exitCode);

console.log('HIRES-ASSET-RETENTION: PASS');
console.log(`  contract: ${path.relative(root, contractPath)}`);
console.log(`  protected content identities: ${contractBySha.size}`);
console.log(`  protected artwork paths currently present: ${protectedCandidates.length}`);
console.log(`  metadata files checked: ${requiredMetadataPaths.length}`);
console.log('  rule: protected content may move between approved master/legacy storage classes, but may not disappear');
console.log('  rule: newly introduced unique master/legacy content must first be registered in the contract');

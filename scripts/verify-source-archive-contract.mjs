import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const errors = [];
const fail = (message) => errors.push(message);
const mustContain = (text, needle, label = needle) => {
  if (!text.includes(needle)) fail(`missing ${label}`);
};
const read = (path) => readFile(resolve(root, path), 'utf8');

const contract = JSON.parse(await read('tests/contracts/source-archive-contract-v1.json'));
for (const path of contract.requiredFiles) {
  try {
    await read(path);
  } catch {
    fail(`required file missing: ${path}`);
  }
}

const [policy, releaseProcess, defaults, script, workflow] = await Promise.all([
  read('docs/GOLDEN_MASTER_POLICY.md'),
  read('docs/RELEASE_PROCESS.md'),
  read('PROJECT_DEFAULTS.md'),
  read('scripts/create-source-archive.sh'),
  read('.github/workflows/source-archive.yml')
]);

for (const marker of [
  'PRE-MERGE-Snapshot',
  'Golden Master',
  'Ein Freeze-/Feature-Branch, Release Candidate oder PRE-MERGE-Snapshot darf niemals als Golden Master bezeichnet werden.',
  'Der Golden Master ist **kein HACS-Paket**.',
  'Ein erzeugter PRE-MERGE-Snapshot oder Golden Master wird niemals stillschweigend überschrieben',
  'sämtliche aktiven Hi-Res-Master',
  'legacy/',
  '.bundle'
]) mustContain(policy, marker, `policy invariant: ${marker}`);

for (const marker of [
  'Phase A – vor dem Merge',
  'PRE-MERGE-Snapshot aus exakt diesem Commit erzeugen',
  'Ein fehlender oder nicht verifizierbarer PRE-MERGE-Snapshot blockiert die Promotion.',
  'Phase B – nach dem Merge',
  'Golden-Master-ZIP aus genau diesem Commit erzeugen',
  'Golden Master und HACS-/Installationspaket bleiben ausdrücklich unterschiedliche Artefakte.'
]) mustContain(releaseProcess, marker, `release invariant: ${marker}`);

for (const marker of [
  'Verbindliche PRE-MERGE- und Golden-Master-Regel',
  'Ein Kandidat, Freeze-/Feature-Branch oder PRE-MERGE-Snapshot ist niemals ein Golden Master.',
  'docs/GOLDEN_MASTER_POLICY.md',
  'scripts/create-source-archive.sh',
  '.github/workflows/source-archive.yml'
]) mustContain(defaults, marker, `defaults invariant: ${marker}`);

for (const marker of [
  'PRE_MERGE',
  'GOLDEN_MASTER',
  'git rev-parse',
  'git archive',
  'git bundle create',
  'sha256sum',
  'unzip -tq',
  'FILE_SHA256SUMS.txt',
  'TRACKED_FILES.txt',
  'MANIFEST.txt',
  'immutable archives are never overwritten'
]) mustContain(script, marker, `archiver invariant: ${marker}`);

for (const marker of [
  'workflow_dispatch:',
  'PRE_MERGE',
  'GOLDEN_MASTER',
  'fetch-depth: 0',
  "refs/remotes/origin/main",
  'actions/upload-artifact@v4',
  'sha256sum -c',
  'git bundle verify'
]) mustContain(workflow, marker, `workflow invariant: ${marker}`);

if (errors.length) {
  console.error('Source archive contract FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Source archive contract PASS (v${contract.contractVersion})`);

import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407LocationSearchDelta} from './v4-07-location-search-delta.mjs';
import {v407HelpNotesDelta} from './v4-07-help-notes-delta.mjs';
import {v407SavedPlacesDelta} from './v4-07-saved-places-delta.mjs';
import {v407CountryGroupsDelta} from './v4-07-country-groups-delta.mjs';
import {v407NetworkSecurityDelta} from './v4-07-network-security-delta.mjs';
import {v407TodoSetupHelpDelta} from './v4-07-todo-setup-help-delta.mjs';
import {v407SavedPlacesSoftDeleteDelta} from './v4-07-saved-places-soft-delete-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir = resolve(root,'artifacts/v407-settings-regression-probes');
const source = (await readFile(resolve(root,'frontend/gewitterradar.js'),'utf8')).replace(/\r\n?/g,'\n');
if (!source.includes("const CARD_VERSION = '4.06';")) throw new Error('Canonical source is not V4.06');

const stage1 = v407LocationSearchDelta(source);
const stage2 = v407HelpNotesDelta(stage1);
const stage3 = v407SavedPlacesDelta(stage2);
const stage4 = v407CountryGroupsDelta(stage3);
const stage5 = v407NetworkSecurityDelta(stage4);
const stage6 = v407TodoSetupHelpDelta(stage5);
const stage7 = v407SavedPlacesSoftDeleteDelta(stage6);

const probes = [
  ['A_EXACT_V4.06.js', source, 'Exact canonical V4.06 frontend; control sample.'],
  ['B_V4.07_AFTER_SAVED_PLACES.js', stage3, 'V4.07 after location search + help + saved places; before country grouping/network/todo-help/soft-delete.'],
  ['C_V4.07_TEST5_PRE_SOFT_DELETE.js', stage6, 'V4.07 TEST5 state; all current features except saved-place soft-delete/restore.'],
  ['D_V4.07_TEST6_CURRENT.js', stage7, 'V4.07 TEST6 current functional candidate; diagnostic reference only.']
];

const hash = (text) => createHash('sha256').update(Buffer.from(text,'utf8')).digest('hex');
await mkdir(outDir,{recursive:true});
let sums = '';
let manifest = '# V4.07 settings regression probes\n\nTest order: A → B → C. D is the already-known current reference.\n\n';
for (const [name,text,note] of probes) {
  await writeFile(resolve(outDir,name),text,'utf8');
  const digest = hash(text);
  sums += `${digest}  ${name}\n`;
  manifest += `- ${name}\n  - ${note}\n  - SHA256: ${digest}\n`;
  console.log(`${name}: ${Buffer.byteLength(text,'utf8')} bytes sha256 ${digest}`);
}
await writeFile(resolve(outDir,'SHA256SUMS.txt'),sums,'utf8');
await writeFile(resolve(outDir,'README.md'),manifest,'utf8');

if (stage7 !== (await readFile(resolve(root,'artifacts/v407/gewitterradar.js'),'utf8')).replace(/\r\n?/g,'\n')) {
  throw new Error('Probe D is not byte-identical to the current generated TEST6 artifact in the repository');
}
console.log('Settings regression probes built successfully; TEST6 identity check PASS');

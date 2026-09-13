import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v406UiPolishDelta} from './v4-06-ui-polish-delta.mjs';
import {v406UiPolishPass2Delta} from './v4-06-ui-polish-pass2-delta.mjs';
import {v406UiPolishPass3Delta} from './v4-06-ui-polish-pass3-delta.mjs';
import {v406UiPolishPass4Delta} from './v4-06-ui-polish-pass4-delta.mjs';
import {v406UiPolishPass5Delta} from './v4-06-ui-polish-pass5-delta.mjs';
import {v406ReleaseHistoryDelta} from './v4-06-release-history-delta.mjs';
import {v407LocationSearchDelta} from './v4-07-location-search-delta.mjs';
import {v407HelpNotesDelta} from './v4-07-help-notes-delta.mjs';
import {v407SavedPlacesDelta} from './v4-07-saved-places-delta.mjs';
import {v407CountryGroupsDelta} from './v4-07-country-groups-delta.mjs';
import {v407NetworkSecurityDelta} from './v4-07-network-security-delta.mjs';
import {v407TodoSetupHelpDelta} from './v4-07-todo-setup-help-delta.mjs';
import {v407SavedPlacesSoftDeleteDelta} from './v4-07-saved-places-soft-delete-delta.mjs';
import {v407UiRegressionPolishDelta} from './v4-07-ui-regression-polish-delta.mjs';

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

  // V4.07 must inherit the actually accepted V4.06 visual/release state, not only
  // the earlier frozen V4.06 frontend blob. These six deterministic passes are
  // the real-device accepted V4.06 endpoint and therefore the mandatory base.
  const acceptedV406 = v406ReleaseHistoryDelta(
    v406UiPolishPass5Delta(
      v406UiPolishPass4Delta(
        v406UiPolishPass3Delta(
          v406UiPolishPass2Delta(
            v406UiPolishDelta(source)
          )
        )
      )
    )
  );

  if (!acceptedV406.includes('settings-close settings-close-premium')) throw new Error('Accepted V4.06 premium close control missing');
  if (!acceptedV406.includes('V4.06 pass2: Welcome-derived 2px metal frame')) throw new Error('Accepted V4.06 premium settings frame missing');
  if (!acceptedV406.includes('settings-footer-version')) throw new Error('Accepted V4.06 footer version placement missing');
  if (!acceptedV406.includes('BUILD_YYYY_MM')) throw new Error('Accepted V4.06 release/date metadata missing');
  if (!acceptedV406.includes('V4.06 · 2026/09')) throw new Error('Accepted V4.06 release-history chronology missing');

  const candidate = v407UiRegressionPolishDelta(
    v407SavedPlacesSoftDeleteDelta(
      v407TodoSetupHelpDelta(
        v407NetworkSecurityDelta(
          v407CountryGroupsDelta(
            v407SavedPlacesDelta(
              v407HelpNotesDelta(
                v407LocationSearchDelta(acceptedV406)
              )
            )
          )
        )
      )
    )
  ).replace(/\r\n?/g,'\n');

  if (candidate === source) throw new Error('V4.07 delta produced no change');
  if (!candidate.includes('settings-close settings-close-premium')) throw new Error('V4.07 regressed the accepted premium settings close control');
  if (!candidate.includes('V4.06 pass2: Welcome-derived 2px metal frame')) throw new Error('V4.07 regressed the accepted premium settings frame');
  if (!candidate.includes('settings-footer-version')) throw new Error('V4.07 regressed the accepted footer version placement');
  if (!candidate.includes('BUILD_YYYY_MM')) throw new Error('V4.07 regressed accepted date/version metadata');
  if (!candidate.includes('V4.06 · 2026/09')) throw new Error('V4.07 regressed accepted release-history chronology');
  if (!candidate.includes('V4.07: Release History inherits the accepted Settings/Help premium metal treatment.')) throw new Error('V4.07 premium Release History polish missing');
  if (!candidate.includes('closeLocationDropdown(false);\n        this._syncHelpMenu();')) throw new Error('Settings must close an open location dropdown before opening');

  const bytes = Buffer.from(candidate,'utf8');
  await mkdir(outDir,{recursive:true});
  await writeFile(outputPath,bytes);
  await writeFile(versionedPath,bytes);
  const digest = hash(bytes);
  await writeFile(checksumPath,`${digest}  gewitterradar.js\n${digest}  gewitterradar-v4.07-test.js\n`);
  console.log(`Built V4.07 TEST CANDIDATE JS on accepted V4.06 UI base: ${bytes.length} bytes, sha256 ${digest}`);
  return {candidate,bytes,digest,outputPath,versionedPath};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildV407Candidate();

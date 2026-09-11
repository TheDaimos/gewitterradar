import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {v406UiPolishDelta} from './v4-06-ui-polish-delta.mjs';
import {v406UiPolishPass2Delta} from './v4-06-ui-polish-pass2-delta.mjs';
import {v406UiPolishPass3Delta} from './v4-06-ui-polish-pass3-delta.mjs';
import {v406UiPolishPass4Delta} from './v4-06-ui-polish-pass4-delta.mjs';
import {v406UiPolishPass5Delta} from './v4-06-ui-polish-pass5-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'frontend/gewitterradar.js'), 'utf8');
const stage1 = v406UiPolishDelta(source);
const stage2 = v406UiPolishPass2Delta(stage1);
const stage3 = v406UiPolishPass3Delta(stage2);
const stage4 = v406UiPolishPass4Delta(stage3);
const polished = v406UiPolishPass5Delta(stage4);

assert.ok(polished.includes('V4.06 pass5: final footer/version placement'));
assert.ok(polished.includes('V4.06 · Visual V2 · Gewitterradar · by CK'));
assert.ok(!polished.includes('V4.06 · Visual V2<br>Gewitterradar · Home Assistant'));
assert.ok(polished.includes('.about-footer-signature{width:196px!important'));
assert.ok(polished.includes('.about-footer-signature{width:165px!important'));
assert.ok(polished.includes('@media(hover:none) and (pointer:coarse) and (min-width:700px) and (min-height:700px)'));
assert.ok(polished.includes('.about-footer-left .about-dev{transform:translateY(14px)}'));
assert.ok(polished.includes('.about-radius output{position:absolute;right:0;top:50%;transform:translateY(-50%);min-width:58px'));
assert.ok(polished.includes('font-size:1.25em'));
assert.ok(polished.includes('class="settings-footer-version" title="Kartenversion">V${CARD_VERSION}</div>'));
assert.ok(!polished.includes('<span class="settings-version" title="Kartenversion">V${CARD_VERSION}</span>'));
assert.ok(polished.includes('settings-signature about-footer-signature'));
assert.ok(polished.includes('about-footer-signature-image'));
assert.ok(polished.includes('.about-dialog.about-touch-tablet:focus,.about-dialog.about-touch-tablet:focus-visible{outline:none!important}'));

let rejected=false;
try { v406UiPolishPass5Delta(polished); } catch { rejected=true; }
assert.equal(rejected,true,'already-pass5-polished source must fail closed');

console.log('PASS: V4.06 UI polish pass5 places the reused signature/version, keeps the iPad footer note visible and lower, enlarges the mobile signature, moves Settings version, and enlarges/centers all three radius badges without touching accepted visual assets.');

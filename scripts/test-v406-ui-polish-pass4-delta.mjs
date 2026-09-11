import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {v406UiPolishDelta} from './v4-06-ui-polish-delta.mjs';
import {v406UiPolishPass2Delta} from './v4-06-ui-polish-pass2-delta.mjs';
import {v406UiPolishPass3Delta} from './v4-06-ui-polish-pass3-delta.mjs';
import {v406UiPolishPass4Delta} from './v4-06-ui-polish-pass4-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'frontend/gewitterradar.js'), 'utf8');
const stage1 = v406UiPolishDelta(source);
const stage2 = v406UiPolishPass2Delta(stage1);
const stage3 = v406UiPolishPass3Delta(stage2);
const polished = v406UiPolishPass4Delta(stage3);

assert.ok(polished.includes('V4.06 pass4: keep programmatic dialog focus invisible'));
assert.ok(polished.includes('.about-dialog.about-touch-tablet:focus,.about-dialog.about-touch-tablet:focus-visible{outline:none!important}'));
assert.ok(polished.includes('about-footer-left'));
assert.ok(polished.includes('about-footer-signature-image'));
assert.ok(polished.includes('settings-signature about-footer-signature'));
assert.ok(polished.includes('viewBox="0 0 1982 563"'));
assert.ok(polished.includes("_uiAsset7VerifiedUri().then((uri) =>"));
assert.ok(polished.includes('.about-footer button:before{inset:5px 0!important}'));
assert.ok(polished.includes('.about-footer button>span,.about-footer button>.about-icon{transform:none!important}'));
assert.ok(polished.includes('gewitterradar-about-close-premium.webp'));
assert.ok(polished.includes('V4.06 pass2: Welcome-derived 2px metal frame'));

let rejected=false;
try { v406UiPolishPass4Delta(polished); } catch { rejected=true; }
assert.equal(rejected,true,'already-pass4-polished source must fail closed');

console.log('PASS: V4.06 UI polish pass4 removes the touch-tablet dialog outline, centers Welcome footer controls, and reuses the exact Settings signature asset.');

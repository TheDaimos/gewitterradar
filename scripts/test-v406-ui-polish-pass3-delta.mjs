import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {v406UiPolishDelta} from './v4-06-ui-polish-delta.mjs';
import {v406UiPolishPass2Delta} from './v4-06-ui-polish-pass2-delta.mjs';
import {v406UiPolishPass3Delta} from './v4-06-ui-polish-pass3-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'frontend/gewitterradar.js'), 'utf8');
const stage1 = v406UiPolishDelta(source);
const stage2 = v406UiPolishPass2Delta(stage1);
const polished = v406UiPolishPass3Delta(stage2);

assert.ok(polished.includes('V4.06 pass3: suppress WebKit\'s reopen focus frame'));
assert.ok(polished.includes("addEventListener('click', () => this._openAbout(true))"));
assert.ok(polished.includes('_openAbout(fromSettings = false)'));
assert.ok(polished.includes('navigator.maxTouchPoints > 0 && Math.min(window.innerWidth, window.innerHeight) >= 700'));
assert.ok(polished.includes("dialog.classList.toggle('about-touch-tablet', touchTablet)"));
assert.ok(polished.includes("dialog.focus({preventScroll:true})"));
assert.ok(polished.includes('.about-dialog.about-touch-tablet .about-close:focus'));
assert.ok(polished.includes('outline:none!important;box-shadow:none!important'));
assert.ok(polished.includes('gewitterradar-about-close-premium.webp'));
assert.ok(polished.includes('V4.06 pass2: Welcome-derived 2px metal frame'));

let rejected=false;
try { v406UiPolishPass3Delta(polished); } catch { rejected=true; }
assert.equal(rejected,true,'already-pass3-polished source must fail closed');

console.log('PASS: V4.06 UI polish pass3 fixes only the touch-tablet About reopen focus target and preserves accepted premium visuals.');

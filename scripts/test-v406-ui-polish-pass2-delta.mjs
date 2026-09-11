import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {v406UiPolishDelta} from './v4-06-ui-polish-delta.mjs';
import {v406UiPolishPass2Delta} from './v4-06-ui-polish-pass2-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'frontend/gewitterradar.js'), 'utf8');
const stage1 = v406UiPolishDelta(source);
const polished = v406UiPolishPass2Delta(stage1);

const welcomeGearPath = 'M27 7Q32 5 37 7L38 14L43 17L50 14Q55 18 57 23L52 28V36L57 41Q55 46 50 50L43 47L38 50L37 57Q32 59 27 57L26 50L21 47L14 50Q9 46 7 41L12 36V28L7 23Q9 18 14 14L21 17L26 14Z';

assert.ok(polished.includes('V4.06 pass2: Welcome-derived 2px metal frame'));
assert.ok(polished.includes('border:2px solid transparent'));
assert.ok(polished.includes('linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c) border-box'));
assert.ok(polished.includes('.settings-dialog::after{content:none!important}'));
assert.ok(polished.includes('settings-chip settings-chip-premium'));
assert.ok(polished.includes('id="mainview-settings-metal"'));
assert.ok(polished.includes(welcomeGearPath));
assert.ok(!polished.includes('<span class="gear gear-glyph">⚙</span>'));
assert.ok(!polished.includes('<ha-icon class="gear gear-ipad"'));
assert.ok(polished.includes('id="help-functions-welcome-metal"'));
assert.ok(polished.includes('.help-dialog::after{content:none!important}'));
assert.ok(polished.includes('.help-section-icon[data-help-icon="functions"] svg{width:27px;height:27px'));
assert.ok(polished.includes('gewitterradar-about-close-premium.webp'));
assert.ok(polished.includes('gewitterradar-about-copy-scroll.webp'));

let rejected=false;
try { v406UiPolishPass2Delta(polished); } catch { rejected=true; }
assert.equal(rejected,true,'already-pass2-polished source must fail closed');

console.log('PASS: V4.06 UI polish pass2 reuses the exact Welcome gear geometry/material and strengthens frames without touching accepted controls.');

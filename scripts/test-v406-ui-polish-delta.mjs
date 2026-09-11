import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {v406UiPolishDelta} from './v4-06-ui-polish-delta.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'frontend/gewitterradar.js'), 'utf8');
const polished = v406UiPolishDelta(source);

// Previously accepted real-device work remains exactly in the polish layer.
assert.ok(polished.includes('V4.06 accepted UI polish: premium frame and symmetric action tiles.'));
assert.ok(polished.includes('@media(max-width:520px) and (orientation:portrait)'));
assert.ok(polished.includes('grid-template-columns:repeat(2,minmax(0,1fr))'));
assert.ok(polished.includes('.about-dialog summary:after{margin-right:22px}'));
assert.ok(polished.includes('.about-dialog summary:after{margin-right:18px}'));
assert.ok(polished.includes('@media(hover:none) and (pointer:coarse) and (min-width:700px) and (max-width:1100px)'));
assert.ok(polished.includes('.about-dedication-copy{transform:translateY(7px)}'));
assert.ok(polished.includes("' meiner Begeisterung für Technik,'"));
assert.ok(polished.includes("' Wetter und all den Ideen dazwischen'"));

// New small polish block: stronger stable frames and shared premium controls.
assert.ok(polished.includes('border-color:rgba(232,188,96,.92)'));
assert.ok(polished.includes(".settings-dialog::after{content:''"));
assert.ok(polished.includes('settings-close settings-close-premium'));
assert.ok(polished.includes('src="${ABOUT_CLOSE_IMAGE}"'));
assert.ok(polished.includes('V4.06 accepted UI polish: stable Help frame and shared premium controls.'));
assert.ok(polished.includes('.help-dialog::after{content:""'));
assert.ok(polished.includes("ABOUT_CLOSE_IMAGE + '\" alt=\"\" width=\"34\" height=\"34\" draggable=\"false\""));
assert.ok(polished.includes('copyImage.src=ABOUT_COPY_IMAGE'));
assert.ok(polished.includes('.help-copy img{display:block;width:34px;height:34px'));
assert.ok(polished.includes('premiumFunctionsIcon=\'<svg viewBox="0 0 96 96"'));
assert.ok(polished.includes('id="helpFunctionsMetal"'));
assert.ok(polished.includes('if(section.key===\'functions\')icon.innerHTML=premiumFunctionsIcon'));
assert.ok(polished.includes('M48 21l4 2 5-1 5 9 4 3 8 1v10'));

// Legacy generic visual controls must not survive this preview layer.
assert.ok(!polished.includes('aria-label="Einstellungen schließen">×</button>'));
assert.ok(!polished.includes('aria-label="Close">×</button></header><div class="help-content"'));
assert.ok(!polished.includes("button.textContent='⧉'"));

assert.equal((polished.match(/V4\.06 accepted UI polish: premium frame and symmetric action tiles\./g) || []).length, 1);
assert.equal((polished.match(/V4\.06 accepted UI polish: About chevron spacing, iPad focus rendering, mobile dedication\./g) || []).length, 1);
assert.equal((polished.match(/V4\.06 accepted UI polish: stable Help frame and shared premium controls\./g) || []).length, 1);
assert.ok(polished.includes("const CARD_VERSION = '4.06';"));

let rejected=false;
try { v406UiPolishDelta(polished); } catch { rejected=true; }
assert.equal(rejected,true,'already-polished source must fail closed');

console.log('PASS: accepted V4.06 UI polish stays narrow, preserves accepted mobile/iPad work and adds only frame/control harmonization plus isolated gear trial.');

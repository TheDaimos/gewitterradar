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

// Current review block: brighter Welcome-like shimmer, stronger desktop Help curves and deterministic Help icons.
assert.ok(polished.includes('border:1px solid transparent'));
assert.ok(polished.includes('conic-gradient(from 214deg'));
assert.ok(polished.includes('rgba(255,236,168,1) 29deg'));
assert.ok(!polished.includes('rgba(104,70,18,.88) 0deg'));
assert.ok(polished.includes(".settings-dialog::after{content:''"));
assert.ok(polished.includes('settings-close settings-close-premium'));
assert.ok(polished.includes('src="${ABOUT_CLOSE_IMAGE}"'));
assert.ok(polished.includes('V4.06 accepted UI polish: stable Help frame and shared premium controls.'));
assert.ok(polished.includes('.help-dialog::after{content:""'));
assert.ok(polished.includes('0 0 0 1px rgba(246,203,110,.42)'));
assert.ok(polished.includes("ABOUT_CLOSE_IMAGE + '\" alt=\"\" width=\"34\" height=\"34\" draggable=\"false\""));
assert.ok(polished.includes('copyImage.src=ABOUT_COPY_IMAGE'));
assert.ok(polished.includes('.help-copy img{display:block;width:34px;height:34px'));
assert.ok(polished.includes('helpFunctionsRingV3'));
assert.ok(polished.includes('fill="#c99b3f" stroke="#efcb73"'));
assert.ok(polished.includes('const deterministicHelpIcons={prerequisites:'));
assert.ok(polished.includes('icon.dataset.helpIcon=section.key'));
assert.ok(polished.includes('icon.innerHTML=deterministicHelpIcons[section.key]'));
assert.ok(polished.includes('.help-section-icon[data-help-icon="prerequisites"] svg{width:27px;height:27px}'));
assert.ok(polished.includes('<circle cx="12" cy="12" r="8.2"'));
assert.ok(polished.includes('<rect x="5" y="3.8" width="14" height="16.4"'));
assert.ok(polished.includes('M39.2,26.8 L42.4,25.7 L42.8,18.5'));
assert.ok(polished.includes('<circle cx="48" cy="48" r="16.5"'));
assert.ok(!polished.includes('id="helpFunctionsMetalV2"'));
assert.ok(!polished.includes('M48 21l4 2 5-1 5 9 4 3 8 1v10'));

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

console.log('PASS: V4.06 UI polish preserves accepted controls, brightens the Settings shimmer, strengthens desktop Help curves and removes platform-dependent Help glyph alignment.');

// V4.14.16 additive visual contracts: no backend, SQLite, or Local To-do writes.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const wizard=readFileSync(new URL('frontend/modules/monitored-areas/migration-wizard.js',root),'utf8');
const manager=readFileSync(new URL('frontend/modules/monitored-areas/location-manager.js',root),'utf8');
const cleanup=readFileSync(new URL('frontend/modules/monitored-areas/index.js',root),'utf8');
const grSettings=readFileSync(new URL('frontend/modules/ui/skeleton.js',root),'utf8');
const frame='linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c) border-box';
assert.ok(grSettings.includes(frame),'use native GR metallic chrome, not an approximated thin border');
for(const [name,source] of [['wizard',wizard],['manager',manager],['cleanup',cleanup]]){
  assert.ok(source.includes(frame),name+' missing full-depth metal frame');
  assert.match(source,/border:2px solid transparent/,name+' needs visible 2px metallic edge');
  assert.match(source,/getElementById\(["']settings-close["']\)\?\.querySelector\(["']img["']\)\?\.src/,name+' must retain exact settings close artwork');
}
assert.match(wizard,/scrollbar-gutter:auto/,'remove right-sided permanent reserved gutter');
assert.match(wizard,/wizard-content\{padding-inline:18px/,'symmetric content margins');
assert.match(wizard,/ma-view-tabs button\[aria-pressed="true"\]/);
assert.match(wizard,/ma-letter-bar button\[aria-pressed="true"\]/);
assert.match(wizard,/font-family:Georgia,"Times New Roman",serif/,'embossed character face');
assert.match(wizard,/box-shadow:inset 0 1px 1px #fff3bf/,'raised gold active state');
assert.match(wizard,/sql-preview summary::after/,'premium chevron on SQLite accordion');
assert.match(wizard,/\.sql-preview details\[open\]>summary::after/);
assert.match(manager,/\.gr-ma-accordion>summary::after/);
assert.match(manager,/width:13px;height:13px/,'GR settings chevron proportions');
assert.match(manager,/scrollbar-gutter:auto/,'manager must not have uneven inset');
assert.match(manager,/padding-inline:0/,'manager content inset must be balanced');
assert.match(wizard,/data-finalize>Finalisierung prüfen/);
assert.match(wizard,/data-remove disabled>Jetzt Einträge leeren/);
assert.match(wizard,/if\(decisions\.some\(x=>x\.action==="skip"\)\)/);
console.log('PASS MA V4.14.16 metallic chrome, premium chevrons, balanced margins and safety');

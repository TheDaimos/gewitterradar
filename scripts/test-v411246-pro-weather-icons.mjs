import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(new URL('../frontend/'+path, import.meta.url), 'utf8');
const hub = read('modules/weather/eye-hub.js');
const view = read('modules/weather/eye-hub-view.js');
const registry = read('modules/weather/eye-hub-registry.js');

assert.match(hub, /const available=this\.__proBranding\?\.eyeReady===true;[\s\S]*card\.dataset\.eyeProReady=String\(available\)/,
  'The quick-icon visibility contract must follow the same confirmed PRO status as the Eye');
assert.match(view, /#map-card:not\(\[data-eye-pro-ready=true\]\)>:is\(([^)]+)\)\{display:none!important\}/,
  'Weather icons must be CSS-hidden even when their own display rules are present');
const hideRule = view.match(/#map-card:not\(\[data-eye-pro-ready=true\]\)>:is\(([^)]+)\)\{display:none!important\}/)[1];
const ids = [...registry.matchAll(/button:'([^']+)'/g)].map(match => match[1]);
for(const id of ids)assert.ok(hideRule.includes('#'+id), `Missing PRO weather icon in hide rule: ${id}`);
assert.equal(ids.length, 7, 'All seven registered Eye functions must be accounted for');
assert.match(hub, /if\(!available\)\{[\s\S]*root\.hidden=true/, 'Eye bubbles must remain hidden when PRO is unavailable');
assert.doesNotMatch(hub, /button\.hidden=!available/, 'Do not alter the persisted per-icon hidden state');
assert.match(hub, /if\(assigned\.has\(id\)&&!button\.hidden\)buttons\.push/, 'Existing quick-icon layout and visibility remains intact');

console.log('PASS GR 4.11.246: Eye and all seven PRO weather controls are hidden without ready WeatherRouter; existing icon state is preserved.');

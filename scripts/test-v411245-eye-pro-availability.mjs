import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(new URL('../frontend/'+path, import.meta.url), 'utf8');
const skeleton = read('modules/ui/skeleton.js');
const eye = read('modules/weather/eye-hub.js');
const eyeView = read('modules/weather/eye-hub-view.js');

assert.match(skeleton, /reply\.router\?\.ready === true[\s\S]*reply\.router\.enabled === true[\s\S]*reply\.router\.status === 'ready'/,
  'Eye availability must follow the existing authoritative PRO discovery contract');
assert.match(skeleton, /setEyeAvailability\(true\)/, 'Confirmed WR readiness enables Eye');
assert.ok((skeleton.match(/setEyeAvailability\(false\)/g) || []).length >= 4,
  'Disconnect, timeout, not-ready and missing replies must disable Eye');
assert.match(eye, /eye\.hidden=true;eye\.setAttribute/, 'Eye must be initially hidden until discovery');
assert.match(eye, /const available=this\.__proBranding\?\.eyeReady===true;[\s\S]*eye\.hidden=!available/,
  'Eye must be visible only after confirmed discovery');
assert.match(eye, /if\(!available\)\{[\s\S]*root\.hidden=true;[\s\S]*s\.view\.close\(\)/,
  'Open Eye bubbles and settings must close when WR becomes unavailable');
assert.match(eye, /if\(!this\.__proBranding\?\.eyeReady\)return;const s=this\._eyeHubState\(\)/,
  'Eye interactions must be gated while WR is unavailable');
assert.match(eyeView, /\.weather-display-eye-control\.gr-eye-hub\[hidden\]\{display:none!important\}/,
  'Eye must honor its hidden flag despite the existing display:block rule');
assert.match(eye, /if\(assigned\.has\(id\)&&!button\.hidden\)buttons\.push/,
  'Independent weather quick-control positioning remains unchanged');

console.log('PASS GR 4.11.245: Eye Hub requires confirmed WeatherRouter readiness, hides on loss and restores on reconnect.');

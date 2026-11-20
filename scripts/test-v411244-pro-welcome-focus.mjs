import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const code=readFileSync('frontend/modules/ui/pro-welcome.js','utf8');
assert.match(code,/<dialog class="gr-pro-welcome[^\n]*tabindex="-1"/);
assert.doesNotMatch(code,/<button class="gr-pro-close"[^>]*\bautofocus\b/);
assert.match(code,/dialog\.showModal\(\);\s*\/\/[^]*?dialog\.focus\(\{preventScroll:true\}\);/);
assert.match(code,/\.gr-pro-welcome :focus-visible\{outline:2px solid #76e2ff/);
assert.match(code,/\.gr-pro-close img\{width:100%;height:100%;pointer-events:none\}/);
for(const root of ['custom_components/gewitterradar/frontend','dashboard/dist']){
  assert.equal(readFileSync(root+'/modules/ui/pro-welcome.js','utf8'),code,root+' mirror');
}
console.log('PASS: PRO welcome focuses dialog on open, leaves original gold close image unchanged and retains keyboard focus-visible');

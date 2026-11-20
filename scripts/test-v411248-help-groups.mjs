import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(new URL('../'+path, import.meta.url), 'utf8');
const topics = read('frontend/modules/ui/help-topics.js');
const view = read('frontend/modules/ui/i18n-settings.js');
const vault = read('custom_components/gewitterradar/vault_schema.py');
const before = read('frontend/modules/ui/help-topics.js');
assert.match(topics,/gewitterradar-brand-icon\.png/,'Original standard branding required');
assert.match(topics,/gewitterradar-pro-wordmark-v1\.png/,'Original PRO artwork required');
assert.match(topics,/standardTopics,proTopics,setConnected/,'Two independent topic containers required');
assert.match(topics,/button\.addEventListener\('click',[\s\S]*onToggle\(name,next\)/,'Chevron toggles only topics');
assert.match(topics,/button\.setAttribute\('aria-expanded',String\(!isCollapsed\)\)/);
assert.match(topics,/body\.hidden=isCollapsed/);
assert.match(view,/appendWeatherHelp\(sections\.proTopics/,'PRO sections remain in PRO group');
assert.match(view, /\(proOnly\?sections\.proTopics:sections\.standardTopics\)\.append\(details\)/);
assert.match(view,/gr\.help\.group\.standard\.v1/);
assert.match(view,/gr\.help\.group\.pro\.v1/);
for(const name of ['standard','pro'])assert.match(vault,new RegExp('"gr\\.help\\.group\\.'+name+'\\.v1": BIT'));
assert.match(view,/\.help-group-topics\[hidden\]\{display:none!important\}/);
assert.match(view,/\.help-pro-header::before\{content:"";display:block;position:absolute;inset:0 0 auto;height:5px/,
  'Original blue PRO rule must remain unchanged');
assert.match(view,/linear-gradient\(180deg,#88b6ec,#3969a5 24%,#1a366b 56%,#14254c 78%,#45648d\)/);
assert.match(view,/\.help-pro::after\{background:radial-gradient/);
assert.match(view,/\.help-standard::after\{background:radial-gradient/);
assert.ok(before.includes("const standardLogo=new URL('../../assets/gewitterradar-brand-icon.png'"));
console.log('PASS GR 4.11.248: independent help topic groups, original branding, protected PRO line and two Vault keys.');

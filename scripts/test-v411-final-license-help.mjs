import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const read=path=>readFileSync(path);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const licence=read('LICENSE').toString('utf8');
assert.match(licence,/Gemeinschaftslizenz \(Modell B\)/);
assert.match(licence,/Originalentwicklung und ursprünglicher Urheber:/);
assert.match(licence,/Christian Köhler/);
assert.match(licence,/Früher rechtmäßig unter GPL-3\.0-only/);
const historical=read('docs/licenses/GPL-3.0-only-historical.txt');
assert.match(historical.toString('utf8'),/GNU GENERAL PUBLIC LICENSE/);
for(const root of ['custom_components/gewitterradar/frontend/help','dashboard/dist/help']){
  assert.equal(sha(read(root+'/LICENSE')),sha(read('LICENSE')),root+' licence mirror');
  assert.equal(sha(read(root+'/index.html')),sha(read('docs/gewitterradar-overview.html')),root+' help mirror');
  assert.equal(sha(read(root+'/assets/pro-showcase/pro-locales.js')),sha(read('docs/assets/pro-showcase/pro-locales.js')),root+' locale mirror');
}
const script=read('docs/assets/pro-showcase/pro-locales.js').toString('utf8');
for(const lang of ['de','en','da','es','fr','nl','pl','pt','sv','it','no','fi','cs','el','hu']){
  assert.match(script,new RegExp('\\b'+lang+': [\\x27\\x22]'),lang+' licence copy');
}
assert.match(script,/legal\.replaceChildren/);
assert.match(script,/a\.href='LICENSE'/);
console.log('PASS: Model B licence, preserved historical GPL, 15 online/offline help language bindings and both release mirrors');

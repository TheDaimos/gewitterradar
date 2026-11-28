import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateManualLocation,candidateMatches} from '../frontend/modules/monitored-areas/location-create.js';
const c=validateManualLocation(' Hamburg ','53.55, 10.02');
assert.deepEqual(c,{name:'Hamburg',latitude:53.55,longitude:10.02});
assert.equal(candidateMatches([{name:'Home A',latitude:53.55,longitude:10.02},
{name:'Home B',latitude:53.55,longitude:10.02}],c).length,2);
assert.deepEqual(candidateMatches([{latitude:53.56,longitude:10.02}],c),[]);
for(const [n,p] of [['','53, 10'],['H','91, 10'],['H','10, 181'],['X'.repeat(121),'10, 10']]){
 assert.throws(()=>validateManualLocation(n,p));
}
const source=readFileSync(new URL('../frontend/modules/monitored-areas/location-create.js',import.meta.url),'utf8');
const controls=readFileSync(new URL('../frontend/modules/ui/controls.js',import.meta.url),'utf8');
assert.match(source,/window\.confirm\(t\.confirm\)/);
assert.match(source,/candidateMatches\(places,candidate\)/);
assert.match(controls,/port\.saveCandidate\(candidate,migrationRequestUUID\(\)\)/);
assert.doesNotMatch(source,/callService\(|callWS\(|innerHTML/);
console.log('PASS MA-024 manual SQLite create scoped consent and duplicate preview');

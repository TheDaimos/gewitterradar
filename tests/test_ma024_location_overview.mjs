import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const raw=readFileSync(new URL('../frontend/modules/monitored-areas/location-overview.js',import.meta.url),'utf8');
const m=await import('data:text/javascript;base64,'+Buffer.from(raw).toString('base64'));
assert.deepEqual(m.projectLocation({latitude:0,longitude:0}),{x:500,y:240});
assert.equal(m.projectLocation({latitude:90,longitude:180}).x,1000);
assert.equal(m.projectLocation({latitude:0,longitude:181}),null);
assert.equal(m.projectLocation({latitude:NaN,longitude:0}),null);
const locations=[
 {uid:'a',name:'Hamburg',latitude:53.55,longitude:10,archived:false},
 {uid:'b',name:'Hamburg 2',latitude:53.550000001,longitude:10,archived:true},
 {uid:'c',name:'Havanna',latitude:23.1,longitude:-82.3,archived:false},
 {uid:'d',name:'Invalid',latitude:120,longitude:0,archived:false}
];
assert.equal(m.overviewInventory(locations).length,2);
assert.equal(m.overviewInventory(locations,'burg','all').length,2);
assert.equal(m.overviewInventory(locations,'','archived').length,1);
assert.deepEqual(m.locationOverlapGroups(locations).map(x=>x.map(p=>p.uid)),[['a','b']]);
assert.match(raw,/aria-modal/);
assert.match(raw,/schematische Projektion/);
assert.doesNotMatch(raw,/fetch\(|callService\(|callWS\(|localStorage|innerHTML/);
console.log('PASS MA-024 overview projection, filter, overlaps, privacy and read-only');

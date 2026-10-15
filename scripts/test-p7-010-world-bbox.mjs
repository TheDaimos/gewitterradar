// P7-010 regression: Leaflet world wrapping must not collapse Consumer V1 bbox.
// Run: node scripts/test-p7-010-world-bbox.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source=readFileSync(new URL("../frontend/modules/weather/precipitation-layer.js",import.meta.url),"utf8");
const start=source.indexOf("  _weatherRadarViewport(){");
const end=source.indexOf("\n  _weatherRadarEnsureMapHooks(){",start);
assert.ok(start>=0&&end>start,"viewport method must exist");
const method=source.slice(start,end).trim().replace(/^_weatherRadarViewport\(\)\{/,"").replace(/\},?\s*$/,"");
const evaluate=new Function(method);
function viewport(west,east,center=10){
 const bounds={getWest:()=>west,getEast:()=>east,getSouth:()=>-40,getNorth:()=>70};
 return evaluate.call({_map:{getBounds:()=>bounds,getCenter:()=>({lat:12,lng:center})}});
}
for(const span of [360,360.01,420,720]){
 const value=viewport(-90,-90+span,-75);
 assert.deepEqual([value.context.west,value.context.east],[-180,180]);
 assert.equal(value.world,true);
 assert.equal(value.focus.longitude,-75);
}
const almost=viewport(-179.95,179.95,9);
assert.equal(almost.world,false);
assert.notEqual(almost.context.west,almost.context.east);
const crossing=viewport(170,190,179);
assert.ok(crossing.context.west>crossing.context.east);
assert.equal(crossing.world,false);
const shift=viewport(-90,270,37);
assert.notEqual(shift.signature,viewport(-90,270,-75).signature);
assert.equal(viewport(-90,270).context.type,"bbox");
console.log("P7-010 world bbox regression PASS");

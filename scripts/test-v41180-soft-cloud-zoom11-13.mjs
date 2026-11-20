// V4.11.80: Synthetic-only, no real coordinates, private traces or imagery.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {weatherDisplaySoftRasterTuning as soft,
 weatherDisplayAutoRasterTuning as auto,
 weatherDisplayBalancedRasterTuning as balanced}
 from "../frontend/modules/weather/display-menu.js";
const cap=(n,min,max)=>Math.min(max,Math.max(min,n));
const smooth=(a,b,x)=>{const t=cap((x-a)/(b-a),0,1);return t*t*(3-2*t);};
function previousSoft(zoom,native){
 const rel=6-native+2;
 const over=cap(rel,0,5), cloud=smooth(-1.8,1.6,rel);
 const base=1.05+(cap(8+(2**over-1)*12,8,220)-1.05)*cloud;
 const extra=cap(zoom-8,0,5);
 const reference=2**cap(8-native,0,5),current=2**cap(zoom-native,0,5);
 const added=Math.max(extra*Math.max(4,Math.min(12,base*.30)),
   6*Math.max(0,current-reference));
 return Math.min(Math.max(48,base),base+added);
}
for(const native of [4,5,7,9,11]){
 for(const zoom of [7,8,9,10]){
  assert.ok(Math.abs(soft(zoom,native).blur-previousSoft(zoom,native))<1e-8,
   `Zoom ${zoom}, native ${native} must be byte-for-byte numerically protected`);
 }
 for(const zoom of [11,12,13,14]){
  const now=soft(zoom,native);
  assert.ok(now.blur>=previousSoft(zoom,native)-1e-8,"Never reduce previous detail blur");
  assert.equal(now.multiscale,undefined,
   "Near zoom uses one CSS filter; no Chrome SVG multiscale fallback");
  assert.ok(now.blur<=Math.max(205,auto(6,native).blur)+1e-8,
   "Bound expensive near-zoom blur");
 }
}
const z=[10,11,12,13].map(n=>soft(n,7).blur);
assert.ok(Math.abs(z[0]-48)<1e-8);
assert.ok(z[1]>80&&z[2]>140&&z[3]>=200,
 "Materially stronger cloud transitions, not incremental six-pixel changes");
assert.ok(z[0]<z[1]&&z[1]<z[2]&&z[2]<z[3]);
assert.ok(z[3]<auto(13,7).blur,"Weich must remain weaker than Auto");
assert.equal(soft(10,7).multiscale?.broadWeight,.32,
 "Existing approved zoom-10 Chromium rendering must remain");
assert.equal(balanced(9,7).blur,11.2);
const source=await readFile(new URL("../frontend/modules/weather/display-menu.js",import.meta.url),"utf8");
assert.match(source,/zoomBeyondTen===0&&extraZoom>0/);
assert.match(source,/weatherDisplayChromiumSoftFilterAllowed\(browser\)/);
assert.doesNotMatch(source,/setInterval\(/);
assert.doesNotMatch(source,/node\.style\.transform=/);
console.log("PASS: V4.11.80 zoom 10 protected, pronounced 11-13 cloud melting, single-filter performance guard.");

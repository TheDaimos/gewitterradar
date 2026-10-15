import assert from "node:assert/strict";
import {weatherDisplaySoftRasterTuning as soft} from "../frontend/modules/weather/display-menu.js";
const smoothstep=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
for(const nativeZoom of [5,7,9,11]){
 const old=(zoom)=>{
  const base=(()=>{const rel=6-nativeZoom+2, over=Math.max(0,Math.min(5,rel));const c=smoothstep(-1.8,1.6,rel);const b=Math.min(220,Math.max(8,8+(2**over-1)*12));return 1.05+(b-1.05)*c;})();
  const extra=Math.max(0,Math.min(5,zoom-8));
  const oldGrowth=Math.max(0,2**Math.max(0,Math.min(5,zoom-nativeZoom))-2**Math.max(0,Math.min(5,8-nativeZoom)));
  return Math.min(Math.max(48,base),base+Math.max(extra*Math.max(4,Math.min(12,base*.30)),6*oldGrowth));
 };
 for(const zoom of [8,9,10])assert.ok(Math.abs(soft(zoom,nativeZoom).blur-old(zoom))<1e-8);
 for(const zoom of [11,12,13]) {
  const updated=soft(zoom,nativeZoom).blur;
  assert.ok(updated>=old(zoom)-1e-8 && updated<=Math.max(54,old(zoom))+1e-8);
 }
}
console.log("Soft zoom 10 protected / bounded near-zoom tuning PASS");

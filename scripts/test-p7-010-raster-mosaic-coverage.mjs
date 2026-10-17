import assert from "node:assert/strict";
import {measureRasterViewportCoverage,measureRasterTileCoverage}
 from "../src/p7-010/raster-mosaic-coverage.js";

const full={west:-180,east:180,south:-90,north:90};
const germany={west:5,east:16,south:46,north:56};
const cube={west:-90,east:9,south:15,north:56};
const source=(id,coverage,scope="bbox",minZoom=0)=>({
 source_id:id,coverage,coverage_scope:scope,coverage_verified:true,
 render:{min_zoom:minZoom,max_zoom:11,opacity:0.65}
});
const regional=source("regional",germany);
const global=source("global",full,"global");
const tiny=measureRasterViewportCoverage([regional],cube,8);
assert.equal(tiny.complete,false,"regional edge does not cover Cuba and Europe");
assert.ok(tiny.fraction>0&&tiny.fraction<0.1);
assert.equal(tiny.covered_sources,1);
const both=measureRasterViewportCoverage([regional,global],cube,8);
assert.equal(both.complete,true);
assert.equal(both.fraction,1,"global foundation covers whole viewport");
assert.equal(both.covered_sources,2,"two sources have overlapping coverage");
const within=measureRasterViewportCoverage([regional],{west:8,east:12,south:47,north:51},10);
assert.equal(within.complete,true,"all-regional viewport may be safely covered");
assert.equal(measureRasterViewportCoverage([regional],{west:8,east:12,south:47,north:51},9).complete,true);
assert.equal(measureRasterViewportCoverage([source("future",germany,"bbox",12)],
 {west:8,east:12,south:47,north:51},10).complete,false);
assert.equal(measureRasterViewportCoverage([{...regional,render:{...regional.render,opacity:0}}],
 {west:8,east:12,south:47,north:51},10).complete,false);
const adjacent=[
 source("west",{west:-20,east:0,south:20,north:30}),
 source("east",{west:0,east:20,south:20,north:30})
];
assert.equal(measureRasterViewportCoverage(adjacent,{west:-20,east:20,south:20,north:30},8).complete,true);
assert.equal(measureRasterViewportCoverage([source("overlap",{west:-20,east:5,south:20,north:30}),
 source("overlap2",{west:0,east:20,south:20,north:30})],
 {west:-20,east:20,south:20,north:30},8).fraction,1,"overlap must not double-count");
const dateline={west:170,east:-170,south:-15,north:15};
assert.equal(measureRasterViewportCoverage([global],dateline,9).complete,true);
assert.equal(measureRasterViewportCoverage([source("east",{west:170,east:180,south:-15,north:15}),
 source("west",{west:-180,east:-170,south:-15,north:15})],dateline,9).complete,true);
assert.equal(measureRasterViewportCoverage([],cube,8).complete,false);
// Regression: source-native zoom 11 is NOT a display-zoom ceiling. A global
// foundation remains geographically eligible at 12, 13, 15 and 17.
for(const displayZoom of [12,13,15,17]){
 assert.equal(measureRasterViewportCoverage([global],cube,displayZoom).complete,true,
  "global z11 native source must remain usable at display zoom "+displayZoom);
 assert.equal(measureRasterViewportCoverage([regional],cube,displayZoom).complete,false,
  "a DWD edge may not claim full coverage at zoom "+displayZoom);
 assert.equal(measureRasterViewportCoverage([global,regional],cube,displayZoom).complete,true,
  "global foundation and regional DWD overlay must coexist at zoom "+displayZoom);
}
// Provider-neutral regional union is valid without a global source when the
// individual sources jointly cover the entire viewport.
assert.equal(measureRasterViewportCoverage(adjacent,
 {west:-20,east:20,south:20,north:30},17).complete,true);

// Success means actual drawImage crop geometry, not merely any tile callback.
const left={sx:0,sy:0,sw:128,sh:256};
const right={sx:128,sy:0,sw:128,sh:256};
assert.equal(measureRasterTileCoverage([left],256).fraction,0.5);
assert.equal(measureRasterTileCoverage([left],256).complete,false);
assert.equal(measureRasterTileCoverage([left,right],256).complete,true);
assert.equal(measureRasterTileCoverage([left,left],256).fraction,0.5,"overlap cannot be counted twice");
assert.equal(measureRasterTileCoverage([],256).complete,false);
assert.equal(measureRasterTileCoverage([{sx:100,sy:0,sw:156,sh:256}],256).complete,false);
assert.equal(measureRasterTileCoverage([{sx:-20,sy:-20,sw:296,sh:296}],256).complete,true);
console.log("P7-010 geographical viewport and successfully drawn raster tile crop union PASS");

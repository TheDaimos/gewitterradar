// Synthetic-only regression of the new two-scale filter; no real locations or images.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {
  weatherDisplayAutoRasterTuning,
  weatherDisplayBalancedRasterTuning,
  weatherDisplaySoftRasterTuning
} from '../frontend/modules/weather/display-menu.js';
const display=await readFile(new URL('../frontend/modules/weather/display-menu.js',import.meta.url),'utf8');
const tileSource=await readFile(new URL('../frontend/modules/weather/precipitation-layer.js',import.meta.url),'utf8');
assert.match(display, /_weatherDisplayEnsureSoftFilter\(pane,tuning\)/);
assert.match(display, /feGaussianBlur/);
assert.match(display, /feComposite/);
assert.match(display, /operator","arithmetic"/);
assert.match(display, /_weatherDisplayReleaseSoftFilter/);
assert.match(display, /if\(mixFilter&&!pane\.style\.filter\.includes\("url\("\)\)/);
assert.match(display, /this\._weatherDisplayReleaseSoftFilter\(pane\)/);
assert.match(tileSource,/maxNativeZoom:maxZoom/);
assert.match(tileSource,/keepBuffer:1/);
assert.doesNotMatch(display,/node\.style\.transform=/);
assert.doesNotMatch(display,/setInterval\(/);
for(const native of [5,6,7,8,9,10,11]){
 const old8=weatherDisplayAutoRasterTuning(6,native);
 const now8=weatherDisplaySoftRasterTuning(8,native);
 assert.deepEqual(now8,old8,'Zoom 8 muss unveraendert bleiben');
 for(const zoom of [9,10]){
   const now=weatherDisplaySoftRasterTuning(zoom,native);
   assert.ok(now.blur<=Math.max(48,old8.blur)+1e-9,'Einzelprofil-Budget konstant');
   assert.ok(now.blur<weatherDisplayAutoRasterTuning(zoom,native).blur+1e-9,'Auto bleibt separat');
   if(now.multiscale){
     assert.ok(old8.blur<48,'Keine Zweifilter-Verarbeitung bei bereits hoher Ausgangsglaettung');
     assert.ok(now.multiscale.detailBlur===now.blur);
     assert.ok(now.multiscale.broadBlur>now.blur);
     assert.ok(now.multiscale.broadBlur<=64);
     assert.ok(now.multiscale.broadWeight>0&&now.multiscale.broadWeight<=.32);
   }
 }
}
const nine=weatherDisplaySoftRasterTuning(9,7),ten=weatherDisplaySoftRasterTuning(10,7);
assert.ok(nine.multiscale&&ten.multiscale,'Zoom 9/10 brauchen mehrere Skalen');
assert.ok(ten.multiscale.broadBlur>nine.multiscale.broadBlur);
assert.ok(ten.multiscale.broadWeight>nine.multiscale.broadWeight);
assert.ok(ten.multiscale.broadBlur<weatherDisplayAutoRasterTuning(10,7).blur/3,'Deutlich schwächer als Auto');
assert.equal(weatherDisplayBalancedRasterTuning(9,7).blur,11.2,'Ausgewogen unverändert');
assert.equal(weatherDisplaySoftRasterTuning(8,7).multiscale,undefined);
assert.equal(weatherDisplaySoftRasterTuning(10,5).multiscale,undefined,'Hoher Referenzfilter bleibt einzeln');

// A simulated orthogonal precipitation band: the broad fraction must reduce
// local step contrast compared with the accepted single-scale V4.11.75 filter.
const gaussian=(v,s)=>Math.exp(-v*v/(2*s*s));
const stepValue=(pos,sigma)=>{let sum=0,on=0;for(let i=-Math.ceil(3*sigma);i<=Math.ceil(3*sigma);i++){const v=gaussian(i,sigma);sum+=v;if(pos+i>=0)on+=v;}return on/sum;};
const detail=ten.blur,broad=ten.multiscale.broadBlur,w=ten.multiscale.broadWeight;
const oldEdge=stepValue(0,detail)-stepValue(-20,detail);
const blendedEdge=(1-w)*(stepValue(0,detail)-stepValue(-20,detail))+w*(stepValue(0,broad)-stepValue(-20,broad));
assert.ok(blendedEdge<oldEdge,'Orthogonale Kante wird flacher');
assert.ok(blendedEdge>oldEdge*.85,'Reststruktur bleibt nachvollziehbar');
console.log('PASS: V4.11.76 Mehrskalen-Glättung, Zoom-Schutz, Leistungsgrenzen und Rückfallprofil.');

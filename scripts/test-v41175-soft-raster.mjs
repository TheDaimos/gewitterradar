// V4.11.75 legacy envelope, retained for V4.11.78: synthetic source-raster regression, no user images or locations.
// CSS blur is modelled as a one-dimensional Gaussian over an artificial raster
// edge; this checks the intended relative effect, not real browser pixels.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {weatherDisplayAutoRasterTuning,weatherDisplayBalancedRasterTuning,weatherDisplaySoftRasterTuning} from '../frontend/modules/weather/display-menu.js';

const source=await readFile(new URL('../frontend/modules/weather/display-menu.js',import.meta.url),'utf8');
const tiles=await readFile(new URL('../frontend/modules/weather/precipitation-layer.js',import.meta.url),'utf8');
assert.match(source,/pane\.style\.filter="blur\(/,'Glättung muss auf der zusammengesetzten Ebene bleiben');
assert.match(tiles,/maxNativeZoom:maxZoom/,'Quellzoom muss Leaflet erhalten bleiben');
assert.match(tiles,/keepBuffer:1/,'Speicher- und Kachelbudget darf nicht wachsen');
assert.match(source,/node\.style\.filter="none"/,'Keine getrennte Kachelweichzeichnung, die Naehte sichtbar machen kann');
assert.doesNotMatch(source,/node\.style\.transform=/,'Leaflet-Kacheltransformationen bleiben geschuetzt');
assert.doesNotMatch(source,/setInterval\(/,'Keine neue dauerhafte Animations-/Filterberechnung');

const epsilon=1e-9;
for(const nativeZoom of [5,6,7,8,9,10,11]){
  const base=weatherDisplayAutoRasterTuning(6,nativeZoom);
  const z8=weatherDisplaySoftRasterTuning(8,nativeZoom);
  const z9=weatherDisplaySoftRasterTuning(9,nativeZoom);
  const z10=weatherDisplaySoftRasterTuning(10,nativeZoom);
  assert.ok(Math.abs(z8.blur-base.blur)<epsilon,'Zoom 8 muss gleich bleiben');
  assert.ok(Math.abs(z8.contrast-base.contrast)<epsilon,'Zoom-8-Kontrast muss gleich bleiben');
  assert.ok(z9.blur>=z8.blur&&z10.blur>=z9.blur,'Keine Ruecknahme der Zoomglaettung');
  assert.ok(z10.blur<=Math.max(48,base.blur)+epsilon,'Altes iPad-Filterbudget bleibt erhalten');
  assert.ok(z10.blur<weatherDisplayAutoRasterTuning(10,nativeZoom).blur+epsilon,'Weich bleibt unter Auto');
  assert.ok(z10.contrast<=z8.contrast&&z10.contrast>=.93-epsilon,'Begrenzte Kantendämpfung');
}
const before74=(z,n)=>{
  const base=weatherDisplayAutoRasterTuning(6,n),increment=Math.max(0,Math.min(5,z-8))*Math.max(4,Math.min(12,base.blur*.30));
  return Math.min(Math.max(48,base.blur),base.blur+increment);
};
for(const native of [7,8,9]){
  for(const zoom of [9,10]){
    assert.ok(weatherDisplaySoftRasterTuning(zoom,native).blur+epsilon>=before74(zoom,native),'Kein Rueckschritt zur V4.11.74-Glättung');
  }
}
const n7=weatherDisplaySoftRasterTuning(10,7);
assert.ok(n7.blur>before74(10,7)+8,'Zoom-10-Quellraster vergroessert: deutlich bessere Glättung');
assert.ok(n7.blur<=48,'Keine Erhöhung des bisherigen Maximalfilters');
assert.ok(n7.blur<weatherDisplayAutoRasterTuning(10,7).blur*.25,'Deutlich weniger Wolkenbildung als Auto');
assert.equal(weatherDisplayBalancedRasterTuning(9,7).blur,11.2,'Ausgewogen unverändert');

// Model a synthetic hard edge: Gaussian blur must reduce the gradient
// while the broad precipitation core remains distinguishable.
const gaussian=(x,sigma)=>Math.exp(-x*x/(2*sigma*sigma));
function blurredPulse(x,left,right,sigma){
  let weighted=0,sum=0;
  const radius=Math.ceil(3*sigma);
  for(let off=-radius;off<=radius;off++){
    const weight=gaussian(off,sigma);
    if(x+off>=left&&x+off<=right)weighted+=weight;
    sum+=weight;
  }
  return weighted/sum;
}
const prev=before74(10,7),next=n7.blur;
const oldStep=Math.abs(blurredPulse(120,120,400,prev)-blurredPulse(112,120,400,prev));
const newStep=Math.abs(blurredPulse(120,120,400,next)-blurredPulse(112,120,400,next));
assert.ok(newStep<oldStep*.82,'Raster-Stufenkante muss deutlich flacher werden');
assert.ok(blurredPulse(260,120,400,next)>.99,'Breites Niederschlagszentrum muss erhalten bleiben');
assert.equal(weatherDisplayAutoRasterTuning(10,7).blur,220,'Auto-Referenz unverändert');
console.log('PASS: V4.11.78 synthetische Rasterkante, Zoom 8/9/10, Quellenauflösung, Leistung und Fremdmodi.');

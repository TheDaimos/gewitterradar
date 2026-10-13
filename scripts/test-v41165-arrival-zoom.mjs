// V4.11.65: real reference-focus module chooses exact arrival zoom or original radius fit.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const source=await read('frontend/modules/map/clusters-recent.js');
const controls=await read('frontend/modules/ui/controls.js');
assert.match(source,/"version": "1.0.7"/);
assert.match(controls,/"version": "1.1.24"/);
for(const marker of ["gr-reference-arrival-zoom","Zoomstufe nach Standortwechsel","Automatisch (Radius)","length:11","selectedReferenceZoom='8'","referenceZoomChoice.row","referenceZoomChoice.close()"]){
  assert.ok(controls.includes(marker),'Missing settings dropdown marker: '+marker);
}
const raw=source.replace(/^import [^\n]+\n/,'').replaceAll('export const','const');
const install=new Function('defineModule',raw+'\nreturn installClustersRecent;')(
  (_meta,factory)=>()=>factory({finiteNumber:value=>{const n=Number(value);return Number.isFinite(n)?n:null;}})
);
const methods=install();
const events=[];
const calls=[];
const bounds={isValid:()=>true,getCenter:()=>({lat:48.85,lng:2.35})};
global.window={L:{latLng:()=>({toBounds:()=>bounds})}};
const map={
  flyTo:(...args)=>calls.push(['flyTo',...args]),
  flyToBounds:(...args)=>calls.push(['flyToBounds',...args]),
  getZoom:()=>5,getMinZoom:()=>2,getMaxZoom:()=>17
};
const ctx={_map:map,_mapDiagnosticLog:(type,data)=>events.push({type,data}),_observationRadiusValue:()=>200,_stormRadiusValue:()=>100};
const reference={lat:48.85,lon:2.35};
function focus(choice){
  calls.length=0;events.length=0;
  global.localStorage={getItem:()=>choice};
  methods._focusReferenceStormRadius.call(ctx,reference);
  return calls[0];
}
assert.deepEqual(focus(null).slice(0,3),['flyTo',[48.85,2.35],8]);
assert.equal(focus('12')[2],12);
assert.equal(focus('5')[2],5);
assert.equal(focus('15')[2],15);
assert.equal(focus('auto')[0],'flyToBounds');
assert.equal(focus('nonsense')[0],'flyToBounds');
assert.equal(events.find(e=>e.type==='geo.focus.method')?.data.method,'flyToBounds');
assert.equal(focus('8')[0],'flyTo');
assert.equal(events.find(e=>e.type==='geo.focus.method')?.data.mode,'configured-zoom');
console.log('PASS V4.11.65: dropdown choices, saved arrival zoom, fixed zoom flight, auto-radius fallback');

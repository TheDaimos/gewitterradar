import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const read=async p=>String(await readFile(p)),frontend=['gewitterradar.js','version.js','module-manifest.js','assets/gewitterradar-runtime-manifest.json','modules/location/radii-map.js','modules/ui/controls.js','modules/map/clusters-recent.js','modules/diagnostics/map-diagnostics.js'];
for(const p of frontend){
  const a=await read('frontend/'+p);
  assert.equal(await read('dashboard/dist/'+p),a,'Dashboard mirror '+p);
  assert.equal(await read('custom_components/gewitterradar/frontend/'+p),a,'Integration mirror '+p);
  if(p.endsWith('.js'))execFileSync(process.execPath,['--check','--input-type=module'],{input:a,stdio:['pipe','pipe','pipe']});
}
const mapSource=await read('frontend/modules/location/radii-map.js');
const diag=await read('frontend/modules/diagnostics/map-diagnostics.js');
const version=await read('frontend/version.js'),manifest=await read('frontend/module-manifest.js');
const runtime=JSON.parse(await read('frontend/assets/gewitterradar-runtime-manifest.json'));
const provenance=JSON.parse(await read('custom_components/gewitterradar/dra-deployment-provenance.json'));
assert.ok(version.includes('version:"4.11.39"')&&version.includes('runtimeRevision:"41139r1"'));
assert.equal(runtime.productVersion,'4.11.39');
assert.equal(runtime.runtimeRevision,'41139r1');
assert.equal(runtime.moduleSetId,'E411-39A1');
assert.equal(runtime.modules.length,31);
for(const [id,v] of [['location.radii-map','1.0.19'],['diagnostics.map','1.0.5'],['core.manifest','1.2.110']]){
  assert.equal(runtime.modules.find(m=>m.id===id)?.version,v);
  assert.ok(manifest.includes('"id": "'+id+'"'));
}
assert.ok((await read('custom_components/gewitterradar/build_info.py')).includes('BUILD_VERSION = "4.11.39"'));
assert.equal(provenance.productVersion,'4.11.39');
assert.equal(provenance.moduleSetId,'E411-39A1');
// Funktionaler Test: Ein Doppeltipp rueckt den geografischen Ort in die Kartenmitte.
const a=mapSource.indexOf('const anchorForDoubleTap='),b=mapSource.indexOf(';\n      const mapDoubleTap=',a);
assert.ok(a>=0&&b>a,'Anchoring function missing');
const anchorFn=new Function(mapSource.slice(a,b)+';return anchorForDoubleTap;')();
const L={point:(x,y)=>({x,y})};
const map={
  getContainer:()=>({getBoundingClientRect:()=>({left:20,top:40,width:400,height:600})}),
  getSize:()=>({x:400,y:600}),
  containerPointToLatLng:p=>({lat:50+(p.y-300)/256,lng:10+(p.x-200)/256}),
  project:(geo,z)=>({x:geo.lng*Math.pow(2,z),y:geo.lat*Math.pow(2,z)}),
  unproject:(p,z)=>({lat:p.y/Math.pow(2,z),lng:p.x/Math.pow(2,z)})
};
const zoom=anchorFn(map,L,120,200,9);
assert.ok(zoom,'Valid inside-map tap must resolve');
assert.deepEqual(zoom.center,zoom.geographicPoint,'Tapped coordinate becomes the geographic center');
assert.notDeepEqual(zoom.point,{x:200,y:300},'Test tap must be away from the visual center');
assert.equal(zoom.point.x,100);
assert.equal(zoom.point.y,160);
assert.equal(anchorFn(map,L,-100,200,9),null,'Out-of-bounds taps fall back to center');
assert.ok(mapSource.includes('map.setView(view.center,target,{animate:true})'));
assert.ok(mapSource.includes('anchor:view?"tap-geographic-centered"'),'Geographic centering must be diagnosed');
assert.ok(mapSource.includes('const center=geographicPoint;'),'Double tap must center the selected place');
assert.ok(mapSource.includes('map.setZoom(target,{animate:true})'));
// Der WebView meldet nach System-Screenshot touches=2, changedTouches=1,
// aber KEINE Pointer. Zwei einfache Taps muessen erkannt werden.
for(const marker of ['prepareTouchTap(event,stamp)','finishTouchTap(event,now())',
  'markTouchTapMove(event)','state.touchTapCandidate=null;state.lastSingleTap=null;',
  'observeTap(tap.x,tap.y,stamp,"touch")','gesture.touch-tap.end',
  'gesture.doubletap.zoom','gesture.doubletap.native-suppressed']){
    assert.ok(mapSource.includes(marker),'Missing touch-only recovery: '+marker);
}
assert.ok(diag.includes('changedTouchPositions'),'Touch coordinates missing from diagnostics');
assert.ok(diag.includes('lastSingleTap:state.lastSingleTap?'),'Tap state missing from diagnostics');
assert.ok(mapSource.includes('combinedGestureCenter('),'Original pinch and pan must remain');
console.log('PASS V4.11.39: centered geographic double-tap, touch-only post-screenshot recognition, preserving pinch+pan, mirror parity, identity and syntax');

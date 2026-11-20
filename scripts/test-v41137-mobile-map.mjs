import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const read=path=>readFile(path);
const frontend=['gewitterradar.js','version.js','module-manifest.js','assets/gewitterradar-runtime-manifest.json','modules/location/radii-map.js','modules/ui/controls.js','modules/map/clusters-recent.js','modules/diagnostics/map-diagnostics.js'];
for(const relative of frontend){
  const [src,integration,dashboard]=await Promise.all([
    read('frontend/'+relative),
    read('custom_components/gewitterradar/frontend/'+relative),
    read('dashboard/dist/'+relative)
  ]);
  assert.deepEqual(integration,src,'Integration package differs: '+relative);
  assert.deepEqual(dashboard,src,'Dashboard package differs: '+relative);
}
for(const relative of frontend.filter(f=>f.endsWith('.js'))){
  execFileSync(process.execPath,['--check','--input-type=module'],{input:await read('frontend/'+relative),stdio:['pipe','pipe','pipe']});
}
const version=String(await read('frontend/version.js'));
const manifest=String(await read('frontend/module-manifest.js'));
const runtime=JSON.parse(await read('frontend/assets/gewitterradar-runtime-manifest.json'));
assert.ok(version.includes('version:"4.11.37"'));
assert.match(version,/runtimeRevision:"41137r1"/);
assert.match(version,/moduleSetId:"E411-37A1"/);
assert.equal(runtime.productVersion,'4.11.37');
assert.equal(runtime.moduleSetId,'E411-37A1');
assert.equal(runtime.modules.length,31);
for(const [id,expected,path] of [
  ['core.manifest','1.2.108','frontend/module-manifest.js'],
  ['ui.controls','1.1.7','frontend/modules/ui/controls.js'],
  ['diagnostics.map','1.0.4','frontend/modules/diagnostics/map-diagnostics.js'],
  ['location.radii-map','1.0.17','frontend/modules/location/radii-map.js'],
  ['map.clusters-recent','1.0.4','frontend/modules/map/clusters-recent.js']
]){
  assert.equal(runtime.modules.find(m=>m.id===id)?.version,expected,'Runtime module: '+id);
  assert.ok(manifest.includes('"id": "'+id+'"'),'Manifest module missing: '+id);
  const source=String(await read(path));
  assert.ok(source.includes('version:"'+expected+'"')||source.includes('"version": "'+expected+'"'),'Module META missing: '+id);
}
const gesture=String(await read('frontend/modules/location/radii-map.js'));
const geo=String(await read('frontend/modules/map/clusters-recent.js'));
const control=String(await read('frontend/modules/ui/controls.js'));
const diag=String(await read('frontend/modules/diagnostics/map-diagnostics.js'));
for(const marker of ['event?.composedPath?.()','mapSurfaceEvent','gesture.browser-touch-count-mismatch','gesture.browser-touch-fallback-start','gesture.browser-touch-fallback-pinch','gesture.system-reset.coalesced'])assert.ok(gesture.includes(marker),'Touch guard missing: '+marker);
assert.ok(!gesture.includes('window.addEventListener(\'touchmove\''),'No global touchmove blockade');
assert.ok(control.includes('geo.button.click'));
for(const marker of ['geo.focus.skipped','geo.focus.request','geo.focus.method'])assert.ok(geo.includes(marker));
assert.ok(diag.includes('geo.focus.moveend'));
const buildInfo=String(await read('custom_components/gewitterradar/build_info.py'));
const provenance=JSON.parse(await read('custom_components/gewitterradar/dra-deployment-provenance.json'));
assert.ok(buildInfo.includes('BUILD_VERSION = "4.11.37"'));
assert.equal(provenance.productVersion,'4.11.37');
assert.equal(provenance.build,'V4.11.37-DEV-2026-10-08');
assert.equal(provenance.runtimeRevision,'41137r1');
assert.equal(provenance.moduleSetId,'E411-37A1');

assert.ok(gesture.includes('ghostPointerObserved')&&gesture.includes('newFallback("touch"')&&gesture.includes('newFallback("pointer"'),'Ghost recovery alternatives absent');
assert.ok(gesture.includes('applyFallbackFrame'),'Animation frame throttling absent');
assert.ok(gesture.includes('if(!staleLeaflet)'),'Passive mismatch observation missing');
assert.ok(!gesture.includes('fallback.virtualZoom'),'Old per-event zoom logic must be removed');
const diagSnapshot=String(await read('frontend/modules/diagnostics/map-diagnostics.js'));
assert.ok(diagSnapshot.includes('browserTouchFallback:state.browserTouchFallback?'),'Diagnostic ghost state absent');

const source=gesture;
const start=source.indexOf('const twoFingerMotion=');
const finish=source.indexOf(';\n      const applyFallbackFrame',start);
assert.ok(start>=0&&finish>start,'2-finger geometry function missing');
const motionFunction=new Function(source.slice(start,finish)+'; return twoFingerMotion;')();
const before=[{x:100,y:100},{x:200,y:100}];
const spread=motionFunction(before,[{x:90,y:100},{x:210,y:100}]);
assert.ok(spread.zoomDelta>0,'Fingers apart must zoom IN');
assert.equal(spread.centroidMove,0,'Symmetric spread must not pan');
const pinch=motionFunction(before,[{x:110,y:100},{x:190,y:100}]);
assert.ok(pinch.zoomDelta<0,'Fingers together must zoom OUT');
assert.equal(pinch.centroidMove,0,'Symmetric pinch must not pan');
const move=motionFunction(before,[{x:130,y:115},{x:230,y:115}]);
assert.equal(move.zoomDelta,0,'Two-finger translation must not zoom');
assert.equal(move.dx,30);
assert.equal(move.dy,15);
assert.ok(source.includes('map.options.zoomSnap=0')&&source.includes('map.options.zoomSnap=fallback.previousZoomSnap'),
  'Leaflet zoomSnap must allow fractions during fallback and restore afterward');
for(const marker of ['gesture.doubletap.zoom','observeTap(event.clientX,event.clientY,stamp)','state.handlers.dblclick','doubleClickZoom:true']){
  assert.ok(source.includes(marker),'Double-tap or double-click contract missing: '+marker);
}

const viewStart=source.indexOf('const combinedGestureCenter=');
const viewEnd=source.indexOf(';\n      const applyFallbackFrame',viewStart);
assert.ok(viewStart>=0&&viewEnd>viewStart,'combined map projection is missing');
const centerTransform=new Function(source.slice(viewStart,viewEnd)+';return combinedGestureCenter;')();
const fakeMap={
  getCenter:()=>({lat:50,lng:10}),
  project:({lat,lng},zoom)=>({x:lng*Math.pow(2,zoom),y:lat*Math.pow(2,zoom)}),
  unproject:([x,y],zoom)=>({lat:y/Math.pow(2,zoom),lng:x/Math.pow(2,zoom)})
};
const zoomOnly=centerTransform(fakeMap,8,0,0);
assert.deepEqual(zoomOnly,{lat:50,lng:10},'Zoom alone must not shift the geographical center');
const zoomAndPan=centerTransform(fakeMap,8,64,-32);
assert.equal(zoomAndPan.lng,10-64/256,'Two-finger horizontal travel must pan while zooming');
assert.equal(zoomAndPan.lat,50+32/256,'Two-finger vertical travel must pan while zooming');
assert.ok(source.includes('map.setView(nextCenter,target,{animate:false})'),'Combined zoom+pan needs a single view update');
assert.ok(!source.includes('map.setZoomAround([delta.center.x-rect.left'),'No indirect zoom-induced diagonal pan');
const dblStart=source.indexOf('const mapDoubleTap=');
const dblEnd=source.indexOf('const observeTap=',dblStart);
assert.ok(dblStart>=0&&dblEnd>dblStart,'Double tap handler absent');
const dblCode=source.slice(dblStart,dblEnd);
assert.ok(dblCode.includes('map.setZoom(target,{animate:true})'),'Doppeltipp must keep the geographical map center stable');
assert.ok(!dblCode.includes('map.setZoomAround('),'Doppeltipp must not call zoomAround with WebView coordinates');
const diagCode=String(await read('frontend/modules/diagnostics/map-diagnostics.js'));
assert.ok(diagCode.includes('suppressedSinceLast'),'Diagnostics must condense Leaflet motion noise');
const rx=/^leaflet\.(?:movestart|moveend|zoomstart|zoomend)$/;
assert.ok(rx.test('leaflet.zoomend')&&rx.test('leaflet.moveend')&&!rx.test('geo.focus.moveend'),
  'Motion samples are limited to transient Leaflet events');
console.log('PASS V4.11.37: stable double tap, combined pinch+pan, geographic center, mirrored modules and DRA identity');



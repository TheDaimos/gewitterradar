// V4.11.64: protect saved-location camera flights and preserve actual gesture recovery.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const radii=await readFile(new URL('../frontend/modules/location/radii-map.js',import.meta.url),'utf8');
const controls=await readFile(new URL('../frontend/modules/ui/controls.js',import.meta.url),'utf8');
assert.match(radii,/gesture\.lifecycle\.clean-skip/);
assert.match(radii,/if\(!lifecycleGestureDirty\(\)\)/);
assert.match(radii,/if\(!dirty\)\{/);
assert.match(controls,/geo\.reference\.handoff\.duplicate-suppressed/);
assert.match(controls,/if\(handoff\?\.phase==='flying'\)/);
assert.match(controls,/this\._v407SavedPlaceUseBusy=true/);
const moduleSource=radii.replace(/^import [^\n]+\n/,'').replaceAll('export const','const');
const install=new Function('defineModule',moduleSource+'\nreturn installLocationRadiiMap;')((_meta,factory)=>()=>factory({}));
const methods=install();
function recover({pinch=false,drag=false,touch=false}={}){
  let stops=0;
  const map={stop(){stops++},touchZoom:{_zooming:pinch,_moved:false,_animRequest:null},dragging:{_draggable:{_moving:drag,finishDrag(){}}}};
  const state={L:{DomEvent:{off(){}},Draggable:{_dragging:false}},pointers:new Map(),touchIds:new Set(touch?[1]:[]),globalPointers:new Set(),browserTouchFallback:null,recovering:false};
  const ctx={_map:map,_mapGestureRecovery:state,_mapGestureSurfacePointerCount(){return 0},_mapDiagnosticLog(){}};
  assert.equal(methods._recoverMapGestureState.call(ctx,'window-blur',{force:true}),true);
  return stops;
}
assert.equal(recover(),0,'clean focus change interrupted camera flight');
assert.equal(recover({pinch:true}),1,'stale pinch recovery must still stop');
assert.equal(recover({drag:true}),1,'stale drag recovery must still stop');
assert.equal(recover({touch:true}),1,'active map touch recovery must still stop');
console.log('PASS V4.11.64: clean focus does not stop flyToBounds; active gestures recover; duplicate saved flight protected');

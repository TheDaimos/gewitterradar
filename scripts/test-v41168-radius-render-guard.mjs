// V4.11.68: never send million-pixel radii to Leaflet's canvas or SVG.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const radii=await read('frontend/modules/location/radii-map.js');
const core=await read('frontend/modules/core/base-context.js');
assert.match(radii,/"version": "1.0.23"/);
assert.match(core,/version:"1.0.8"/);
assert.match(core,/if \(outer > safeOuter\) \{/);
assert.match(core,/Math\.min\(8192,Math\.max\(2048,4\*/);
assert.match(core,/radius-aura-svg-viewport-veil/);
assert.match(core,/circle\.radius-aura-svg-circle,rect\.radius-aura-svg-viewport-veil/);
const source=radii.replace(/^import [^\n]+\n/,'').replaceAll('export const','const');
const install=new Function('defineModule',source+'\nreturn installLocationRadiiMap;')(
  (_meta,factory)=>(deps)=>factory(deps)
);
const methods=install({projectedRadiusPixels:(_map,_reference,radius)=>Number(radius)});
const recorded=[];
const circle={setLatLng(value){recorded.push(['location',value])},setRadius(value){recorded.push(['radius',value])}};
const reference={lat:38.9,lon:-77.03};
const ctx={_map:{getSize(){return {x:1024,y:768}}},_home(){return reference}};
methods._setRadiusCircleVisual.call(ctx,circle,1200,reference);
assert.equal(recorded.at(-1)[1],1200,'normal radius must render unchanged');
methods._setRadiusCircleVisual.call(ctx,circle,1500000,reference);
assert.equal(recorded.at(-1)[1],0,'oversized radius must not reach Leaflet');
methods._setRadiusCircleVisual.call(ctx,circle,800,reference);
assert.equal(recorded.at(-1)[1],800,'visible ring must reappear after zoom-out');
console.log('PASS V4.11.68: radius drawing guarded, danger veil bounded and normal zoom restored');

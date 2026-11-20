import test from 'node:test';
import assert from 'node:assert/strict';
import {plannedSourceTiles,validateRadarMask,protectedRasterRects} from '../frontend/modules/weather/p7-010/radar-mask.js';
import {drawRasterMosaicTileFromUrls,RasterTileRequestBudget} from '../frontend/modules/weather/p7-010/raster-mosaic-tile-loader.js';
import {validateRasterMosaicV2} from '../frontend/modules/weather/p7-010/raster-mosaic-contract.js';
const mask=()=>({kind:'radar_observation_mask_v1',zoom:0,size:128,encoding:'base64_lsb',tiles:[{x:0,y:0,bits:Buffer.alloc(2048,15).toString('base64')}],exclusions:[],valid_until:null,unknown:false,opera:null});
const layer={source_id:'dwd/radar_precipitation',resource_type:'raster_tile',coverage_verified:true,coverage_scope:'global',coverage:{west:-180,east:180,south:-90,north:90},attribution:'Synthetic',semantics:{quantity:'precipitation_rate',unit:'mm/h',measurement_method:'radar',observation_kind:'observation'},legend:{title:'Synthetic'},times:{valid_at:'2026-11-06T10:00:00Z',valid_until:'2099-01-01T00:00:00Z',retrieved_at:'2026-11-06T10:00:00Z',reference_delta_seconds:0},render:{tile_size:256,min_zoom:0,max_zoom:18,opacity:1},tile_url:'https://example.invalid/{z}/{x}/{y}.png'};
const context=()=>({globalAlpha:1,drawImage(){}});
test('WR source plan maps descendants and ancestors identically on every world copy',()=>{
 const source={raster_plan:{zoom:2,tiles:[[0,1],[1,1],[2,1],[3,1]]}};
 const a=plannedSourceTiles(source,{z:0,x:0,y:0});assert.equal(a.length,4);
 for(const x of [-2,-1,1,2])assert.deepEqual(plannedSourceTiles(source,{z:0,x,y:0}),a);
 assert.deepEqual(plannedSourceTiles(source,{z:4,x:17,y:5}),[{z:2,x:0,y:1}]);
});
test('actual WR mask cuts dry/wet/unknown protection on all world copies and fails closed on expiry',()=>{
 const m=mask();validateRadarMask(m);const source={spatial_policy:{radar_mask:m}};
 const r=protectedRasterRects(source,{z:0,x:0,y:0});assert(r.length>0);assert(r.every(v=>v.sw<256));
 assert.deepEqual(protectedRasterRects(source,{z:0,x:-1,y:0}),r);
 assert.deepEqual(protectedRasterRects(source,{z:0,x:1,y:0}),r);
 m.valid_until='2000-01-01T00:00:00Z';assert.deepEqual(protectedRasterRects(source,{z:0,x:0,y:0}),[{sx:0,sy:0,sw:256,sh:256}]);
});
test('malformed masks and mismatched OPERA generations are rejected before rendering',()=>{
 for(const change of [{tiles:[{x:0,y:0,bits:'bad'}]},{size:256},{unknown:'false'}])assert.throws(()=>validateRadarMask({...mask(),...change}));
 const m=mask();m.opera={generation:'a'.repeat(64),valid_at:'2026-11-06T10:00:00Z',orientation:'north_first'};
 const opera={...layer,source_id:'opera/opera_rate_raster',observation_coverage:{generation:'b'.repeat(64)}};
 const nasa={...layer,source_id:'nasa_gibs/satellite_precipitation_imerg_30min',spatial_policy:{kind:'radar_mask_v2',zoom:0,tiles:[[0,0]],padding_factor:1.3,reservation_status:'verified_observation_mask',radar_mask:m}};
 assert.throws(()=>validateRasterMosaicV2({contract_version:2,capability:'weather.precipitation.layer',status:'partial',viewport:layer.coverage,layers:[opera,nasa]}),/generation mismatch/);
});
test('identical canonical images share a transport; unloading one world copy preserves another',async()=>{
 const budget=new RasterTileRequestBudget(48),a=new AbortController(),b=new AbortController();let loads=0,complete;
 const load=(_url,_source,{signal})=>new Promise((resolve,reject)=>{loads++;complete=()=>resolve({width:256,height:256});signal.addEventListener('abort',()=>reject(new Error('cancelled')));});
 const draw=(x,signal)=>drawRasterMosaicTileFromUrls({context:context(),tile:{z:0,x,y:0},layers:[layer],budget,signal,loadImage:load});
 const first=draw(0,a.signal),second=draw(1,b.signal);
 await new Promise(r=>setTimeout(r,10));assert.equal(loads,1);a.abort();complete();
 assert.equal((await first).drawn.length,0);assert.equal((await second).drawn.length,1);assert.equal(budget.used,1);assert.equal(budget.sharedRequests,1);budget.close();
});
test('WR-planned fragments coexist with ordinary sources without consuming extra provider slots',async()=>{
 const source={...layer,raster_plan:{kind:'source_tiles_v1',zoom:2,tiles:[[0,0],[1,0],[2,0],[3,0],[0,1],[1,1]],padding_factor:1.3,plan_complete:true}};
 const budget=new RasterTileRequestBudget(48);let loads=0;
 const result=await drawRasterMosaicTileFromUrls({context:context(),tile:{z:0,x:0,y:0},layers:[source,{...layer,source_id:'nasa_gibs/satellite_precipitation_imerg_30min'}],budget,loadImage:async()=>{loads++;return {width:256,height:256};}});
 assert.equal(loads,7);assert.equal(result.drawn.length,7);assert.deepEqual(result.rejected,[]);budget.close();
});

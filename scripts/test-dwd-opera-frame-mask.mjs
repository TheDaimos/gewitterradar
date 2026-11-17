import assert from 'node:assert/strict';
import {dwdNoDataRows} from '../frontend/modules/weather/p7-010/dwd-frame-mask.js';
import {drawVerifiedRasterMosaicTile} from '../frontend/modules/weather/p7-010/raster-compositor.js';
import {validateRasterMosaicV2} from '../frontend/modules/weather/p7-010/raster-mosaic-contract.js';
import {RasterTileRequestBudget,drawRasterMosaicTileFromUrls} from '../frontend/modules/weather/p7-010/raster-mosaic-tile-loader.js';
import {createRasterMosaicGridLayer} from '../frontend/modules/weather/p7-010/raster-mosaic-grid-layer.js';

const time=new Date(Date.now()-60000).toISOString(),dwdId='dwd/radar_precipitation',operaId='opera/opera_rate_raster';
const bounds={west:0,south:0,east:180,north:85.0511287798066},tile={x:1,y:0,z:1};
const mask={kind:'dwd_wcs_nodata_v1',valid_at:time,reference_at:time,width:4,height:1,
 bounds:[bounds.west,bounds.south,bounds.east,bounds.north],bits:btoa(String.fromCharCode(0b1100))};
const source=(id,url)=>({
 source_id:id,tile_url:url,resource_type:'raster_tile',coverage_verified:true,coverage_scope:'bbox',coverage:bounds,
 render:{tile_size:256,min_zoom:0,max_zoom:1,opacity:1},times:{valid_at:time,retrieved_at:time,reference_delta_seconds:0,valid_until:new Date(Date.now()+60000).toISOString()},
 attribution:id,legend:{title:id},semantics:{quantity:'rate',unit:'mm/h',measurement_method:'radar',observation_kind:'observation'}
});
const dwd={...source(dwdId,'https://maps.dwd.de/geoserver/dwd/wms?layers=Niederschlagsradar&bbox={bbox-epsg-3857}&time='+time+'&dim_reference_time='+time),
 dwd_nodata_mask:mask};
const opera={...source(operaId,'https://example.invalid/opera/{z}/{x}/{y}.png'),
 draw_exclusions:[{scope:'bbox',bbox:bounds,dwd_mask_source:dwdId}]};
const snapshot={contract_version:2,capability:'weather.precipitation.layer',status:'ready',viewport:bounds,layers:[opera,dwd]};
assert.equal(validateRasterMosaicV2(snapshot),snapshot);
assert.throws(()=>validateRasterMosaicV2({...snapshot,layers:[opera,{...dwd,dwd_nodata_mask:{...mask,reference_at:'2026-11-06T09:55:00Z'}}]}),/DWD validity/);
assert.throws(()=>validateRasterMosaicV2({...snapshot,layers:[opera]}),/overlap grant/);

function canvas(width=4,height=4){
 const pixels=new Map();
 const canvas={width,height,pixels,ownerDocument:{createElement:()=>canvasFactory()}};
 const context={canvas,globalAlpha:1,
  clearRect(sx,sy,sw,sh){for(let y=sy;y<sy+sh;y++)for(let x=sx;x<sx+sw;x++)pixels.delete(y*canvas.width+x);},
  drawImage(image,...args){
   const [sx,sy,sw,sh,dx,dy,dw,dh]=args.length===2?[0,0,image.width,image.height,...args,image.width,image.height]:args;
   for(let y=0;y<dh;y++)for(let x=0;x<dw;x++){
    const fromX=Math.floor(sx+x/dw*sw),fromY=Math.floor(sy+y/dh*sh);
    const value=image.pixels?.get(fromY*image.width+fromX)??image.columns?.[Math.floor(fromX/64)];
    if(value)pixels.set((dy+y)*canvas.width+dx+x,value);
   }
  }};
 canvas.getContext=()=>context;
 return canvas;
}
const canvasFactory=()=>canvas();
const visible=tileCanvas=>Array.from({length:4},(_,x)=>tileCanvas.pixels.get(x)??null);
const images={
 [dwdId]:{columns:['DWD rain',null,'DWD gray','DWD gray']},
 [operaId]:{columns:['OPERA rain','OPERA rain','OPERA rain',null]}
};

for(const first of [dwdId,operaId]){
 const target=canvas(),budget=new RasterTileRequestBudget(2),progress=[];
 const layers=[opera,{...dwd,tile_url:dwd.tile_url+'&fixture='+encodeURIComponent(first)}];
 const completions=new Map(),settled=[];
 const ready=new Promise(resolve=>{
  completions.ready=resolve;
 });
 const draw=drawRasterMosaicTileFromUrls({context:target.getContext(),tile,layers,tileSize:4,budget,
  loadImage:(_url,layer)=>new Promise(resolve=>{
   completions.set(layer.source_id,()=>resolve(images[layer.source_id]));
   if(completions.size===2)completions.ready();
  }),
  onProgress:({prepared})=>{
   target.getContext().clearRect(0,0,4,4);
   drawVerifiedRasterMosaicTile(target.getContext(),tile,prepared,4);
   progress.push(visible(target));
   settled.shift()?.();
  }});
 assert.equal(await Promise.race([ready.then(()=>null),draw]),null,'both sources must start');
 const nextProgress=new Promise(resolve=>settled.push(resolve));
 completions.get(first)();
 await nextProgress;
 completions.get(first===dwdId?operaId:dwdId)();
 assert.equal((await draw).requests_used,2);
 assert.deepEqual(progress[0],first===dwdId?['DWD rain',null,null,null]:['OPERA rain','OPERA rain','OPERA rain',null]);
 assert.deepEqual(visible(target),['DWD rain',null,'OPERA rain',null]);
 const panned=canvas();
 await drawRasterMosaicTileFromUrls({context:panned.getContext(),tile:{...tile,x:3},layers,tileSize:4,budget,
  loadImage:()=>{throw Error('identical wrapped tiles must hit the cache');}});
 assert.deepEqual(visible(panned),visible(target));
 assert.equal(budget.used,2);
}
assert.deepEqual(dwdNoDataRows(mask,{x:3,y:0,z:2},4)[0],[[0,4]]);
assert.deepEqual(dwdNoDataRows(mask,{x:0,y:0,z:1},4),[]);

const Leaflet={GridLayer:{extend(implementation){return class {
 constructor(options){this.options=options;Object.assign(this,implementation);}
 on(){}
};}}};
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const coldDwd={...dwd,dwd_nodata_mask:undefined,tile_url:dwd.tile_url.replace(/&dim_reference_time=.*/,'')};
const coldOpera={...opera,dwd_priority_source:dwdId,draw_exclusions:[{scope:'bbox',bbox:bounds}]};
const queue=new Map();
const oldGrid=createRasterMosaicGridLayer(Leaflet,{...snapshot,layers:[coldOpera,coldDwd]},{
 tileSize:4,createCanvas:canvasFactory,loadImage:(_url,layer)=>new Promise(resolve=>queue.set(layer.source_id,resolve))
});
const oldImage=oldGrid.createTile(tile);
await tick();
queue.get(operaId)(images[operaId]);
await tick();
assert.deepEqual(visible(oldImage),['OPERA rain','OPERA rain','OPERA rain',null]);
const replacement=new Map();
const newTime=new Date(Date.now()-30000).toISOString();
const nextDwd={...dwd,times:{...dwd.times,valid_at:newTime},dwd_nodata_mask:{...mask,valid_at:newTime,reference_at:newTime},
 tile_url:dwd.tile_url.replaceAll(time,newTime)};
const nextOpera={...opera,times:{...opera.times,valid_at:newTime},tile_url:opera.tile_url+'?replacement=1'};
const newGrid=createRasterMosaicGridLayer(Leaflet,{...snapshot,layers:[nextOpera,nextDwd]},{
 tileSize:4,createCanvas:canvasFactory,previousFragments:oldGrid._p7CaptureFragments(),
 loadImage:(_url,layer)=>new Promise(resolve=>replacement.set(layer.source_id,resolve))
});
const newImage=newGrid.createTile(tile);
assert.deepEqual(visible(newImage),visible(oldImage));
oldGrid._p7AbortPending();
await tick();
replacement.get(dwdId)(images[dwdId]);
await tick();
assert.deepEqual(visible(newImage),['DWD rain',null,'OPERA rain',null]);
replacement.get(operaId)({columns:[null,null,null,'new OPERA rain']});
await tick();
assert.deepEqual(visible(newImage),['DWD rain',null,null,'new OPERA rain']);
queue.get(dwdId)?.({columns:['obsolete DWD']});
await tick();
assert.deepEqual(visible(newImage),['DWD rain',null,null,'new OPERA rain']);
newGrid._p7AbortPending();
console.log('PASS DWD rain/zero/NoData, cold mask, progressive generation, late response, zoom, pan and cache');

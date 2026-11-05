import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {rasterTileUrl} from "../frontend/modules/weather/p7-010/raster-tile-url.js";
import {loadRasterImage} from "../frontend/modules/weather/p7-010/raster-mosaic-grid-layer.js";
import {RasterTileRequestBudget,drawRasterMosaicTileFromUrls} from "../frontend/modules/weather/p7-010/raster-mosaic-tile-loader.js";

const template="/api/weather_router/opera_tile/RATE/20261104T115500Z/{z}/{x}/{y}.png";

test("WR-authorised internal OPERA URL uses exact XYZ expansion",()=>{
 assert.equal(rasterTileUrl(template,{z:4,x:7,y:5}),
   "/api/weather_router/opera_tile/RATE/20261104T115500Z/4/7/5.png");
 assert.throws(()=>rasterTileUrl("/api/weather_router/opera_tile/RATE/abc/{z}/{x}/{y}.png",{z:4,x:7,y:5}));
 assert.throws(()=>rasterTileUrl("/api/other/{z}/{x}/{y}.png",{z:4,x:7,y:5}));
});

test("GR never treats an arbitrary internal URL as a raster source",()=>{
 const contract=readFileSync(new URL("../frontend/modules/weather/p7-010/raster-mosaic-contract.js",import.meta.url),"utf8");
 assert.match(contract,/source==="opera\/opera_rate_raster"/);
 assert.match(contract,/operaRateURL\(value,source\)/);
});

test("WR OPERA image transport never places a token in the tile URL",()=>{
 const grid=readFileSync(new URL("../frontend/modules/weather/p7-010/raster-mosaic-grid-layer.js",import.meta.url),"utf8");
 assert.match(grid,/getAccessToken/);
 assert.match(grid,/credentials:"omit"/);
 assert.match(grid,/Authorization:"Bearer "/);
 assert.match(grid,/URL\.revokeObjectURL/);
});

const source={source_id:'opera/opera_rate_raster',resource_type:'raster_tile',attribution:'Fixture',
 semantics:{observation_kind:'measurement'},times:{valid_at:'2026-11-05T15:30:00Z'},
 legend:{unit:'mm/h'},coverage_verified:true,coverage_scope:'global',
 render:{tile_size:256,min_zoom:0,max_zoom:2,opacity:1},
 tile_url:'/api/weather_router/opera_tile/RATE/20261105T153000Z/{z}/{x}/{y}.png'};
const coordinate={z:0,x:0,y:0};
const url=rasterTileUrl(source.tile_url,coordinate);
const surface=()=>({canvas:{width:256,height:256},save(){},restore(){},beginPath(){},
 rect(){},clip(){},clearRect(){},globalAlpha:1,drawImage(){this.paints=(this.paints||0)+1;}});

test('authenticated PNG is decoded from a private blob and drawn into the regular mosaic',async t=>{
 let revoked=0,requests=0,tokenReads=0;
 t.mock.method(globalThis,'fetch',async(actual,options)=>{
   requests++;
   assert.equal(actual,url);
   assert.equal(options.headers.Authorization,'Bearer fixture-access-token');
   assert.equal(options.headers.Accept,'image/png');
   assert.equal(options.credentials,'omit');
   assert.equal(options.redirect,'error');
   assert.equal(options.cache,'no-store');
   return new Response(new Uint8Array([137,80,78,71,13,10,26,10]),{headers:{'Content-Type':'image/png'}});
 });
 t.mock.method(URL,'createObjectURL',blob=>{assert.equal(blob.type,'image/png');return 'blob:fixture';});
 t.mock.method(URL,'revokeObjectURL',value=>{assert.equal(value,'blob:fixture');revoked++;});
 const previous=globalThis.Image;
 globalThis.Image=class {width=256;height=256;set src(value){assert.equal(value,'blob:fixture');queueMicrotask(()=>this.onload?.());}};
 t.after(()=>{if(previous===undefined)delete globalThis.Image;else globalThis.Image=previous;});
 const context=surface();
 const result=await drawRasterMosaicTileFromUrls({context,tile:coordinate,layers:[source],
   budget:new RasterTileRequestBudget(1),loadImage:(u,s,options)=>loadRasterImage(u,s,{...options,
     getAccessToken:async()=>{tokenReads++;return 'fixture-access-token';}})});
 assert.equal(requests,1);assert.equal(tokenReads,1);assert.equal(revoked,1);
 assert.equal(result.drawn[0].source_id,source.source_id);
 assert.equal(context.paints,1);assert.deepEqual(result.rejected,[]);
});

test('tile policy denials retain HTTP evidence and are distinct from credential rejection',async t=>{
 for(const [status,code,reason] of [[403,'insecure_transport','image_policy_rejected'],
   [403,'frame_expired','image_policy_rejected'],[403,'profile_not_authorized','image_auth_rejected'],
   [401,null,'image_auth_rejected'],[403,'untrusted arbitrary text','image_auth_rejected']]){
   let attempts=0;
   const mock=t.mock.method(globalThis,'fetch',async()=>{attempts++;
     return new Response(null,{status,headers:code?{'X-WeatherRouter-Tile-Denial':code}:{}});});
   const result=await drawRasterMosaicTileFromUrls({context:surface(),tile:coordinate,
     layers:[{...source,tile_url:source.tile_url.replace('153000','153500')}],
     budget:new RasterTileRequestBudget(1),loadImage:(u,s,options)=>loadRasterImage(u,s,{...options,
       getAccessToken:async()=>'fixture-access-token'})});
   assert.equal(attempts,1,'terminal denial must not start a retry loop');
   assert.equal(result.drawn.length,0);assert.equal(result.rejected[0].reason,reason);
   assert.equal(result.rejected[0].http_status,status);
   assert.equal(result.rejected[0].tile_denial_code,code==='untrusted arbitrary text'?undefined:code||undefined);
   mock.mock.restore();
 }
});

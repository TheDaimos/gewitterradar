import test from 'node:test';
import assert from 'node:assert/strict';
import {RasterTileRequestBudget,drawRasterMosaicTileFromUrls} from '../frontend/modules/weather/p7-010/raster-mosaic-tile-loader.js';

const makeLayer=(id)=>({
 source_id:id, resource_type:'raster_tile', attribution:'TEST', semantics:{observation_kind:'measurement'},times:{valid_at:'2026-11-04T10:00:00Z'},legend:{unit:'mm/h'},coverage_verified:true, coverage_scope:'global',
 render:{tile_size:256,min_zoom:0,max_zoom:2,opacity:1},tile_url:'https://example.org/'+id+'/{z}/{x}/{y}.png'
});
const tile={z:0,x:0,y:0};
const context={canvas:{width:256,height:256},save(){},restore(){},drawImage(){},beginPath(){},rect(){},clip(){},clearRect(){},globalAlpha:1};
const run=async(loadImage,budget,layers=[makeLayer('a')])=>
 drawRasterMosaicTileFromUrls({context,tile,layers,loadImage,budget,timeoutMs:100,tileSize:256});

test('TEST70-54: failed URL retries while successful sibling is fetched once',async()=>{
 const calls=new Map(), budget=new RasterTileRequestBudget(8);
 const response=await run(async(url)=>{
  const id=url.includes('/a/')?'a':'b';
  calls.set(id,(calls.get(id)||0)+1);
  if(id==='a'&&calls.get(id)===1)throw new Error('HTTP 503');
  return {width:256,height:256};
 },budget,[makeLayer('a'),makeLayer('b')]);
 assert.equal(calls.get('a'),2);
 assert.equal(calls.get('b'),1);
 assert.equal(budget.used,3);
 assert.equal(response.rejected.length,0);
});
test('TEST70-54: retry cannot exceed finite snapshot budget',async()=>{
 const budget=new RasterTileRequestBudget(2);
 let attempts=0;
 const response=await run(async()=>{attempts++;throw new Error('HTTP 503');},budget);
 assert.equal(attempts,2);
 assert.equal(budget.used,2);
 assert.equal(response.rejected[0].reason,'request_budget_exhausted');
});
test('TEST70-54: authentication rejection is not retried',async()=>{
 const budget=new RasterTileRequestBudget(5);
 let attempts=0;
 const response=await run(async()=>{attempts++;const e=new Error('unauthorized');e.httpStatus=403;throw e;},budget);
 assert.equal(attempts,1);
 assert.equal(response.rejected[0].reason,'image_auth_rejected');
});
test('TEST70-54: cached successful source is reused',async()=>{
 const budget=new RasterTileRequestBudget(4);
 let attempts=0;
 const load=async()=>{attempts++;return {width:256,height:256};};
 await run(load,budget);
 await run(load,budget);
 assert.equal(attempts,1);
});

test('OPERA retries an admitted coordinate beyond its initial attempt budget',async()=>{
 const budget=new RasterTileRequestBudget(1);
 let attempts=0;
 const opera={...makeLayer('opera/opera_rate_raster'),
  tile_url:'/api/weather_router/opera_tile/RATE/20261104T100000Z/{z}/{x}/{y}.png'};
 const result=await run(async()=>{
  if(++attempts<3){const error=new Error('temporarily unavailable');error.httpStatus=503;throw error;}
  return {width:256,height:256};
 },budget,[opera]);
 assert.equal(attempts,3);
 assert.equal(budget.used,1);
 assert.equal(budget.active,0);
 assert.equal(result.rejected.length,0);
});

test('OPERA retries stop on cancellation and release the transport slot',async()=>{
 const budget=new RasterTileRequestBudget(1);
 const controller=new AbortController();
 const opera={...makeLayer('opera/opera_rate_raster'),
  tile_url:'/api/weather_router/opera_tile/RATE/20261104T101500Z/{z}/{x}/{y}.png'};
 let attempts=0;
 const result=await drawRasterMosaicTileFromUrls({context,tile,layers:[opera],budget,
  timeoutMs:100,signal:controller.signal,loadImage:async()=>{
   attempts++;controller.abort();throw new Error('cancelled');
  }});
 assert.equal(attempts,1);
 assert.equal(budget.active,0);
 assert.equal(result.rejected[0].reason,'tile_cancelled');
});

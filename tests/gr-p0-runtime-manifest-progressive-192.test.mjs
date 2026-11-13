import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const roots=['custom_components/gewitterradar/frontend','frontend','dashboard/dist'];
const read=(root,path)=>readFileSync(root+'/'+path,'utf8');
const version='4.11.194',runtime='411194r1',moduleSet='E411-194A1';

test('installed runtime manifest matches loaded frontend, 36 modules, and all mirrored assets',()=>{
 for(const root of roots){
  const manifest=JSON.parse(read(root,'assets/gewitterradar-runtime-manifest.json'));
  const product=read(root,'version.js');
  const expected=read(root,'module-manifest.js');
  assert.equal(manifest.productVersion,version);
  assert.equal(manifest.runtimeRevision,runtime);
  assert.equal(manifest.moduleSetId,moduleSet);
  assert.equal(manifest.modules.length,36);
  assert.match(product,/version:"4\.11\.194"/);
  assert.match(product,/runtimeRevision:"411194r1"/);
  assert.match(product,/moduleSetId:"E411-194A1"/);
  assert.match(expected,/"id": "weather.precipitation-layer",\s*"version": "1\.3\.36"/);
  assert.equal(manifest.modules.find(row=>row.id==='weather.precipitation-layer')?.version,'1.3.36');
  assert.deepEqual(new Set(manifest.modules.map(x=>x.id)).size,36);
  const install=JSON.parse(readFileSync('custom_components/gewitterradar/manifest.json','utf8'));
  assert.equal(install.version,'0.25.101');
 }
 for(const file of ['version.js','gewitterradar.js','module-manifest.js',
   'assets/gewitterradar-runtime-manifest.json',
   'modules/weather/precipitation-layer.js',
   'modules/weather/p7-010/raster-mosaic-consumer.js',
   'modules/weather/p7-010/raster-mosaic-grid-layer.js',
   'modules/weather/p7-010/raster-mosaic-tile-loader.js']){
  const canonical=read(roots[0],file);
  for(const root of roots.slice(1))assert.equal(read(root,file),canonical,file);
 }
});

test('update-watch reads the installed manifest and retains actual version protection',()=>{
 const source=read(roots[0],'modules/core/update-watch.js');
 assert.match(source,/gewitterradar-runtime-manifest\.json/);
 assert.match(source,/cache:"no-store"/);
 assert.match(source,/installed\?\.runtimeRevision/);
 assert.match(source,/installed\?\.moduleSetId/);
 assert.match(source,/if\(mismatch\)this\._showInstalledRuntimeChanged\(installed\)/);
});

test('progressive callback receives already admitted fragments in WR order',async()=>{
 let source=read(roots[0],'modules/weather/p7-010/raster-mosaic-tile-loader.js');
 source=source.replace(/^\s*import[\s\S]*?from\s+["'][^"']+["'];/gm,'')
   .replace(/\bexport\s+(?=(?:const|let|function|class|async)\b)/g,'');
 const environment={
  plannedSourceTiles:()=>null,
  rasterMosaicRenderOrder:rows=>rows,
  rasterTilePixelCrops:()=>[{}],
  rasterTileUrl:url=>url,
  drawVerifiedRasterMosaicTile:(_ctx,_tile,rows)=>({drawn:rows.map(x=>({source_id:x.source_id})),rejected:[]}),
  setTimeout,clearTimeout,AbortController
 };
 const names=Object.keys(environment),values=Object.values(environment);
 const fn=vm.runInNewContext('(function('+names.join(',')+'){' +source+
  ';return {RasterTileRequestBudget,drawRasterMosaicTileFromUrls}})');
 const {RasterTileRequestBudget,drawRasterMosaicTileFromUrls}=fn(...values);
 const budget=new RasterTileRequestBudget(8);
 const frameTime='2026-11-13T11:00:00Z';
 const layers=['dwd/radar_precipitation','opera/opera_rate_raster'].map((source_id,i)=>({
  source_id,tile_url:'https://example.invalid/'+i,
  coverage_scope:'global',coverage_verified:true,
  render:{min_zoom:0,max_zoom:12},times:{valid_at:frameTime}
 }));
 for(const layer of layers)
  budget.imageCache.set(layer.source_id+'\n'+frameTime+'\n'+layer.tile_url,{pixels:true});
 const seen=[];
 const result=await drawRasterMosaicTileFromUrls({
  context:{clearRect(){}},tile:{z:2,x:0,y:0},layers,budget,
  loadImage:()=>{throw Error('unexpected download')},
  onProgress:p=>seen.push(p.prepared.map(x=>x.source_id))
 });
 assert.deepEqual(JSON.parse(JSON.stringify(seen)),[
  ['dwd/radar_precipitation'],
  ['dwd/radar_precipitation','opera/opera_rate_raster']
 ]);
 assert.deepEqual(JSON.parse(JSON.stringify(result.drawn.map(x=>x.source_id))),
  ['dwd/radar_precipitation','opera/opera_rate_raster']);
 assert.equal(budget.used,0);
 assert.match(read(roots[0],'modules/weather/p7-010/raster-mosaic-grid-layer.js'),/onProgress:deferredSource\?null:/);
 assert.match(read(roots[0],'modules/weather/p7-010/raster-mosaic-tile-loader.js'),/retryCount<1/);
 const retryLayer=layers[0];
 const failStatus=async status=>{
  const trial=new RasterTileRequestBudget(8);
  let attempts=0;
  const result=await drawRasterMosaicTileFromUrls({
   context:{},tile:{z:2,x:0,y:0},layers:[retryLayer],budget:trial,
   loadImage:async()=>{attempts++;const err=new Error('synthetic');err.httpStatus=status;throw err;}
  });
  return {attempts,reason:result.rejected[0]?.reason};
 };
 const notFound=await failStatus(404),temporary=await failStatus(503);
 assert.deepEqual(notFound,{attempts:1,reason:'image_http_unavailable'});
 assert.deepEqual(temporary,{attempts:2,reason:'image_retry_exhausted'});
});

// Run with PLAYWRIGHT_MODULE, LEAFLET_DIST and optional CHROME_PATH.
// BASELINE_GR_CHECKOUT adds an A/B comparison with the affected DEV build.
const http=require('node:http');
const fs=require('node:fs/promises');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..');
const leaflet=process.env.LEAFLET_DIST||path.dirname(require.resolve('leaflet'));
const baseline=process.env.BASELINE_GR_CHECKOUT;
const server=http.createServer(async(req,res)=>{
 try{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname==='/')return res.end('<!doctype html><script src="/leaflet.js"></script><link rel="stylesheet" href="/leaflet.css"><div id="map" style="width:256px;height:256px"></div>');
  const isLeaflet=/^\/leaflet\.(?:css|js)$/.test(pathname);
  const baseRequest=pathname.startsWith('/base/');
  const modulePath=baseRequest?pathname.slice(5):pathname;
  const validModule=/^\/frontend\/modules\/weather\/p7-010\/[a-z0-9-]+\.js$/.test(modulePath);
  if(!isLeaflet&&(!validModule||(baseRequest&&!baseline))){res.statusCode=404;return res.end();}
  const name=isLeaflet?path.join(leaflet,pathname.slice(1)):
   path.join(baseRequest?baseline:root,modulePath.slice(1));
  res.setHeader('Content-Type',pathname.endsWith('.css')?'text/css':'text/javascript');
  res.end(await fs.readFile(name));
 }catch(error){res.statusCode=404;res.end(String(error));}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});
 try{
  const page=await browser.newPage({viewport:{width:420,height:420},hasTouch:true,isMobile:true});
  await page.goto('http://127.0.0.1:'+server.address().port);
  const result=await page.evaluate(async(compareBaseline)=>{
   const map=L.map('map',{zoomControl:false,attributionControl:false,zoomAnimation:false}).setView([66.51326044311186,90],1);
   const rel='/frontend/modules/weather/p7-010/raster-mosaic-grid-layer.js';
   const next=await import(rel);
   const tile={x:1,y:0,z:1}, bounds={west:0,east:180,south:0,north:85.0511287798066};
   const D='dwd/radar_precipitation',O='opera/opera_rate_raster',N='nasa_gibs/satellite_precipitation_imerg_30min';
   const stamp=new Date(Date.now()-10000).toISOString(),later=new Date(Date.now()-5000).toISOString();
   const times={valid_at:stamp,retrieved_at:stamp,reference_delta_seconds:0,valid_until:new Date(Date.now()+60000).toISOString()};
   const source=(id,color)=>({source_id:id,resource_type:'raster_tile',coverage_verified:true,coverage_scope:'bbox',coverage:bounds,
    tile_url:'https://example.invalid/'+id+'/{z}/{x}/{y}.png',attribution:id,times,legend:{title:id},
    render:{opacity:1,min_zoom:0,max_zoom:1,tile_size:256},
    semantics:{quantity:'precipitation_rate',unit:'mm/h',observation_kind:'observation',measurement_method:color==='green'?'satellite':'radar'}});
   const dwd=source(D,'red'),opera={...source(O,'blue'),draw_exclusions:[{scope:'bbox',bbox:bounds}]};
   const nasa={...source(N,'green'),freshness_class:'older_background'};
   const snapshot=layers=>({contract_version:2,capability:'weather.precipitation.layer',status:'ready',viewport:bounds,layers});
   const surface=(paint)=>{
    const image=document.createElement('canvas');image.width=image.height=256;const context=image.getContext('2d');
    for(const [x,w,color] of paint){context.fillStyle=color;context.fillRect(x,0,w,256);}
    return image;
   };
   const pixels=grid=>{
    const canvas=grid._tiles['1:0:1']?.el;
    if(!canvas||getComputedStyle(canvas).visibility==='hidden'||Number(getComputedStyle(grid._container).opacity)===0)return null;
    const context=canvas.getContext('2d'),alpha=Number(getComputedStyle(canvas).opacity);
    return {rgb:[32,96,160,224].map(x=>Array.from(context.getImageData(x,64,1,1).data)),alpha};
   };
   const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
   const assert=(value,message)=>{if(!value)throw Error(message);};
   const beforeAfter=[];
   const builds=compareBaseline?[['baseline',await import('/base'+rel)],['candidate',next]]:[['candidate',next]];
   for(const [label,api] of builds){
    const begin=performance.now();
    const grid=api.createRasterMosaicGridLayer(L,snapshot([nasa,opera,dwd]),{loadImage:async(_url,row)=>{
     if(row.source_id===D){await wait(350);return surface([[0,64,'red']]);}
     if(row.source_id===N){await wait(180);return surface([[192,64,'lime']]);}
     await wait(35);return surface([[0,192,'blue']]);
    }});
    grid.addTo(map);
    const first={opera:null,nasa:null,dwd:null,full:null};
    while(performance.now()-begin<650){
     const sample=pixels(grid),elapsed=performance.now()-begin;
     if(sample?.alpha>.9){
      if(sample.rgb[2][2]===255)first.opera??=elapsed;
      if(sample.rgb[3][1]===255)first.nasa??=elapsed;
      if(sample.rgb[0][0]===255)first.dwd??=elapsed;
      if(Object.keys(first).filter(key=>key!=='full').every(key=>first[key]!==null)){
       first.full=elapsed;break;
      }
     }
     await wait(5);
    }
    const end=begin+450;
    while(performance.now()<end)await wait(5);
    beforeAfter.push({build:label,first_visible_ms:first,final:pixels(grid),
     transports:grid._p7SpatialDiagnostics().provider_transport});
    map.removeLayer(grid);
   }
   const mask={kind:'dwd_wcs_nodata_v1',width:4,height:1,valid_at:later,reference_at:later,
    bounds:[0,0,180,bounds.north],bits:btoa(String.fromCharCode(12))};
   const withMask={...dwd,dwd_nodata_mask:mask,times:{...times,valid_at:later},
    tile_url:'https://maps.dwd.de/geoserver/dwd/wms?layers=Niederschlagsradar&bbox={bbox-epsg-3857}&time='+later+'&dim_reference_time='+later};
   const gatedOpera={...opera,dwd_priority_source:D,times:{...times,valid_at:later},
    tile_url:opera.tile_url+'?replacement=1',draw_exclusions:[{scope:'bbox',bbox:bounds,dwd_mask_source:D}]};
   const active=next.createRasterMosaicGridLayer(L,snapshot([opera,dwd]),{loadImage:async(_url,row)=>
    row.source_id===O?surface([[0,192,'blue']]):surface([[0,64,'red']])});
   active.addTo(map);await wait(55);
   const replacement=next.createRasterMosaicGridLayer(L,snapshot([gatedOpera,withMask]),{
    previousFragments:()=>active._p7CaptureFragments(),
    loadImage:async(_url,row)=>{
     if(row.source_id===O){await wait(235);throw Object.assign(new Error('missing'),{httpStatus:404});}
     await wait(65);return surface([[0,64,'red'],[128,128,'grey']]);
    }});
   replacement.addTo(map);active.remove();await wait(25);
   const retained=pixels(replacement);
   await wait(95);
   const newDwd=pixels(replacement);
   await wait(200);
   const failedOpera=pixels(replacement);
   assert(retained.rgb[2][2]===255,'Previously visible OPERA must survive layer replacement');
   assert(newDwd.rgb[0][0]===255&&newDwd.rgb[1][3]===0&&newDwd.rgb[2][2]===255,'DWD rain/dry/NoData priority');
   assert(JSON.stringify(failedOpera)===JSON.stringify(newDwd),'OPERA HTTP failure must retain valid older pixels '+JSON.stringify({retained,newDwd,failedOpera}));
   replacement.remove();
   if(compareBaseline)assert(beforeAfter[0].first_visible_ms.opera===null,'Baseline must reproduce rectangle');
   assert(beforeAfter.at(-1).first_visible_ms.opera!==null&&beforeAfter.at(-1).first_visible_ms.opera<150,
    'OPERA must display before independent provider results');
   return {beforeAfter,retained,newDwd,failedOpera};
  },Boolean(baseline));
  console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});

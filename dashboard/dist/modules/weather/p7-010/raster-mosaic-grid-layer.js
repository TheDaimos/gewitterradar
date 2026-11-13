import {sourceTileGrant,sourceTileGrants,nasaTileDestination,leaseNasaTiles,configureNasaTransport,spatialTileBounds} from "./nasa-spatial.js?v=411147r1";
import {rasterTileUrl} from "./raster-tile-url.js?v=41188r1";
import {drawVerifiedRasterMosaicTile} from "./raster-compositor.js?v=411147r1";
import {plannedSourceTiles,retainProtectedRasterAreas} from './radar-mask.js?v=411147r1';
/* P7-010: Leaflet rendering adapter for the existing WR V2 mosaic contract.
 * WeatherRouter alone selects and orders sources; this file draws verified
 * snapshots using a strict shared per-snapshot tile budget.
 */
import {validateRasterMosaicV2} from "./raster-mosaic-contract.js?v=411147r1";
import {RasterTileRequestBudget,drawRasterMosaicTileFromUrls,operaTileHttpError}
  from "./raster-mosaic-tile-loader.js?v=411189r1";
import {rasterTilePixelCrops} from "./raster-tile-clip.js?v=41188r1";
import {rasterMosaicRenderOrder} from "./raster-compositor.js?v=411147r1";
import {measureRasterTileCoverage} from "./raster-mosaic-coverage.js?v=411147r1";

/** Geographically expected raster area, including partial boundary tiles.
 * A verified BBOX never implies opaque weather pixels.
 */
export function expectedRasterTileGeometry(layers,tile,tileSize=256){
  const crops=[];
  let selected=0;
  for(const item of layers||[]){
    if(item?.coverage_verified!==true||!item.render||item.render.opacity<=0
      ||tile.z<item.render.min_zoom)continue;
    const mask=item.coverage_scope==="global"?{scope:"global",verified:true}
      :item.coverage_scope==="bbox"&&item.coverage
        ?{scope:"bbox",bbox:item.coverage,verified:true}:null;
    if(!mask)continue;
    if(item.raster_plan&&plannedSourceTiles(item,tile).length===0)continue;
    const area=rasterTilePixelCrops(tile,mask,tileSize);
    if(!area.length)continue;
    if(selected++>=4)break; // Same four relevant sources as the tile loader.
    const planned=plannedSourceTiles(item,tile);
    if(planned===null)crops.push(...area);
    else for(const native of planned){
      const sourceArea=rasterTilePixelCrops(tile,{scope:'bbox',bbox:spatialTileBounds(native.z,native.x,native.y),verified:true},tileSize);
      for(const a of area)for(const b of sourceArea){const l=Math.max(a.sx,b.sx),t=Math.max(a.sy,b.sy),r=Math.min(a.sx+a.sw,b.sx+b.sw),bottom=Math.min(a.sy+a.sh,b.sy+b.sh);if(r>l&&bottom>t)crops.push({sx:l,sy:t,sw:r-l,sh:bottom-t});}
    }
  }
  return measureRasterTileCoverage(crops,tileSize);
}

/** An empty tile is valid only when geographic evidence expects no image.
 * Image/network failures inside the verified envelope remain failures.
 */
export function classifyRasterTileResult(layers,tile,tileSize,result){
  const expected=expectedRasterTileGeometry(layers,tile,tileSize);
  const actual=result?.tile_coverage?.fraction||0;
  const painted=(result?.drawn?.length||0)>0;
  const failedSource=result?.rejected?.some(item=>
    item.source_id==="opera/opera_rate_raster"&&
    !["outside_tile_coverage","outside_zoom_coverage"].includes(item.reason));
  const status=expected.fraction<=0?"expected_transparent"
    :failedSource?"image_load_failed"
    :painted&&actual+1e-5>=expected.fraction?"complete_verified_coverage"
    :painted?"incomplete_image_coverage":"image_load_failed";
  return {tile_status:status,expected_fraction:Number(expected.fraction.toFixed(6)),
    drawn_fraction:Number(actual.toFixed(6)),
    geographic_only:true,image_pixels_verified:false};
}

export async function loadRasterImage(url,source,{signal,getAccessToken}={}){
  if(source?.source_id==="nasa_gibs/satellite_precipitation_imerg_30min"){
    const response=await fetch(url,{method:"GET",mode:"cors",credentials:"omit",redirect:"error",cache:"no-store",signal,referrerPolicy:"strict-origin-when-cross-origin"});
    if(!response.ok){
      const raw=response.headers.get("Retry-After"),seconds=raw===null?NaN:Number(raw);
      const retryAfterMs=Number.isFinite(seconds)?Math.max(0,seconds*1000):raw?Math.max(0,Date.parse(raw)-Date.now()):undefined;
      throw Object.assign(new Error("NASA image HTTP failure"),{httpStatus:response.status,retryAfterMs});
    }
    if(!String(response.headers.get("content-type")||"").toLowerCase().includes("image/png"))throw new Error("NASA image content type invalid");
    const limit=1024*1024,chunks=[];let bytes=0;
    if(Number(response.headers.get("content-length"))>limit){await response.body?.cancel();throw new Error("NASA PNG exceeds live byte limit");}
    const reader=response.body?.getReader();
    if(reader){try{while(true){const next=await reader.read();if(next.done)break;bytes+=next.value.byteLength;if(bytes>limit){await reader.cancel();throw new Error("NASA PNG exceeds live byte limit");}chunks.push(next.value);}}finally{reader.releaseLock();}}
    else{const bytes=await response.arrayBuffer();if(bytes.byteLength>limit)throw new Error("NASA PNG exceeds live byte limit");chunks.push(bytes);}
    const objectURL=URL.createObjectURL(new Blob(chunks,{type:"image/png"}));
    try{return await new Promise((resolve,reject)=>{
      const image=new Image();let settled=false;
      const finish=error=>{if(settled)return;settled=true;image.onload=null;image.onerror=null;signal?.removeEventListener("abort",cancel);error?reject(error):resolve(image);};
      const cancel=()=>{image.src="";finish(new Error("NASA image cancelled"));};
      image.onload=()=>finish(null);image.onerror=()=>finish(new Error("NASA image decode failure"));
      if(signal?.aborted){cancel();return;}signal?.addEventListener("abort",cancel,{once:true});image.src=objectURL;
    });}finally{URL.revokeObjectURL(objectURL);}
  }
  // Authenticated HA OPERA route is never fetched by a naked <img>.
  // Tokens are obtained only from the HA session and never placed in URLs.
  if(url.startsWith("/api/weather_router/opera_tile/")){
    if(source?.source_id!=="opera/opera_rate_raster"||
       !/^\/api\/weather_router\/opera_tile\/RATE\/20\d{6}T\d{6}Z\/\d+\/\d+\/\d+\.png$/.test(url))
      throw new Error("untrusted_opera_tile_url");
    const token=typeof getAccessToken==="function"?await getAccessToken():null;
    if(!token){const error=new Error("missing_opera_tile_authorization");error.httpStatus=401;throw error;}
    const response=await fetch(url,{method:"GET",credentials:"omit",redirect:"error",
      cache:"no-store",signal,headers:{Authorization:"Bearer "+token,Accept:"image/png"}});
    if(!response.ok)throw operaTileHttpError(response);
    if(!String(response.headers.get("content-type")||"").toLowerCase().includes("image/png"))
      throw new Error("opera_tile_invalid_content_type");
    const blob=await response.blob();
    const objectURL=URL.createObjectURL(blob);
    try{
      return await new Promise((resolve,reject)=>{
        const image=new Image();
         let settled=false;
         const finish=error=>{
           if(settled)return;
           settled=true;image.onload=null;image.onerror=null;
           signal?.removeEventListener("abort",cancel);
           error?reject(error):resolve(image);
         };
         const cancel=()=>{image.src="";finish(new Error("opera_tile_cancelled"));};
         image.onload=()=>finish(null);
         image.onerror=()=>finish(new Error("opera_tile_invalid_png"));
         if(signal?.aborted){cancel();return;}
         signal?.addEventListener("abort",cancel,{once:true});
        image.src=objectURL;
      });
    }finally{URL.revokeObjectURL(objectURL);}
  }
  return new Promise((resolve,reject)=>{
    const image=new Image();
    let settled=false;
    function finish(error){
      if(settled)return;
      settled=true;
      image.onload=null;image.onerror=null;
      signal?.removeEventListener("abort",cancel);
      if(error)reject(error);else resolve(image);
    }
    function cancel(){try{image.src="";}catch(_){}finish(new Error("Image request cancelled"));}
    image.onload=()=>finish(null);
    image.onerror=()=>finish(new Error("Image request unavailable"));
    if(signal?.aborted){cancel();return;}
    signal?.addEventListener("abort",cancel,{once:true});
    image.referrerPolicy="strict-origin-when-cross-origin";
    image.src=url;
  });
}

export function createRasterMosaicGridLayer(L,snapshot,{
  maxLayers=12,maxTileRequests=48,maxConcurrent=4,tileSize=256,
  timeoutMs=8000,loadImage=loadRasterImage,getAccessToken=null,
  createCanvas=()=>document.createElement("canvas"),onTileDiagnostics=null,
  previousImageCache=null,previousSnapshot=null
}={}){
  if(!L?.GridLayer?.extend||typeof loadImage!=="function"||
    typeof createCanvas!=="function")throw new TypeError("Leaflet layer prerequisites missing");
  if(!Number.isInteger(tileSize)||tileSize<1||tileSize>512)
    throw new RangeError("Invalid tile size");
  const verified=validateRasterMosaicV2(snapshot,{maxLayers});
  if(verified.layers.some(layer=>layer.raster_plan?.plan_complete===false))throw new TypeError('Incomplete WR source plan cannot replace active generation');
  const deferredSource=verified.layers.find(layer=>["exclusive_tiles_v1","radar_mask_v2"].includes(layer.spatial_policy?.kind));
  const renderLayers=rasterMosaicRenderOrder(verified.layers.filter(layer=>layer!==deferredSource));
  let nasaLease=null,nasaRevoked=false;const nasaCanvases=new Map();
  const getLease=()=>nasaLease??=(leaseNasaTiles(deferredSource,
    tile=>rasterTileUrl(deferredSource.tile_url,tile),
    (url,source,options)=>loadImage(url,source,{...options,getAccessToken})));

  const budget=new RasterTileRequestBudget(maxTileRequests,{maxConcurrent});
  if(previousImageCache instanceof Map){
    const reusable=new Set(renderLayers.filter(source=>previousSnapshot?.layers?.some(old=>
      old.source_id===source.source_id&&old.tile_url===source.tile_url&&old.times?.valid_at===source.times?.valid_at)).map(source=>source.source_id));
    for(const [key,value] of previousImageCache)if(reusable.has(key.split("\n")[0])){
      budget.imageCache.set(key,value);if(budget.imageCache.size>=budget.maxCachedImages)break;
    }
  }
  const pending=new Set(),actualTiles=new Map();
  const Layer=L.GridLayer.extend({
    createTile(coords,done){
      const canvas=createCanvas();
      if(!canvas||typeof canvas.getContext!=="function")
        throw new TypeError("Canvas unavailable");
      const controller=typeof AbortController==="function"?new AbortController():null;
      if(controller){canvas._p7RasterAbort=()=>controller.abort();pending.add(controller);}
      canvas.width=tileSize;canvas.height=tileSize;canvas._p7Coords={...coords};
      const context=canvas.getContext("2d");
      if(!context){if(controller)pending.delete(controller);done?.(new Error("Canvas2D unavailable"),canvas);return canvas;}
      let radarSettled=false,nasaSettled=true;
      const finish=()=>{if(radarSettled&&nasaSettled){if(controller)pending.delete(controller);canvas._p7RasterAbort=null;}};
      if(deferredSource&&!nasaRevoked){
        const lease=getLease(),grants=sourceTileGrants(deferredSource,coords);
        if(grants.length){
          nasaSettled=false;nasaCanvases.set(canvas,grants);
          const radarExpected=expectedRasterTileGeometry(renderLayers,coords,tileSize).fraction>0;
          queueMicrotask(()=>{
            if(controller?.signal.aborted)return;
            try{onTileDiagnostics?.({deferred:true,radar_expected:radarExpected,tile_status:"deferred_authorized",drawn:[],rejected:[],tile:{...coords}});}catch(_){}
            if(!radarExpected)done?.(null,canvas);
          });
          let painted=0;
          Promise.allSettled(grants.map(native=>lease.image(native).then(image=>{
            if(nasaRevoked||controller?.signal.aborted||!sourceTileGrants(deferredSource,coords).some(t=>t.x===native.x&&t.y===native.y))return;
            const result=drawVerifiedRasterMosaicTile(context,coords,[{...deferredSource,image,_p7SourceTile:native}],tileSize);
            if(result.drawn.length)painted++;actualTiles.set(coords.z+"/"+coords.x+"/"+coords.y,{nasa_painted:painted,nasa_required:grants.length,mask_applied:result.drawn.some(d=>d.mask_applied)});
            try{onTileDiagnostics?.({...result,deferred:true,radar_expected:radarExpected,tile_status:painted===grants.length?"complete_verified_coverage":"deferred_partial",source_images_complete:painted===grants.length,observation_coverage_verified:false,mask_applied:result.drawn.some(d=>d.mask_applied),painted_source_tiles:painted,required_source_tiles:grants.length,tile:{...coords}});}catch(_){}
          },()=>{
            if(!controller?.signal.aborted)try{onTileDiagnostics?.({deferred:true,radar_expected:radarExpected,tile_status:"deferred_image_failed",drawn:[],rejected:[{source_id:deferredSource.source_id,reason:"nasa_image_failed"}],tile:{...coords}});}catch(_){}
          }))).finally(()=>{nasaSettled=true;finish();});
          if(!radarExpected){radarSettled=true;return canvas;}
        }
      }
      Promise.resolve().then(()=>drawRasterMosaicTileFromUrls({
        context,tile:coords,layers:renderLayers,
        loadImage:(url,source,options)=>loadImage(url,source,{...options,getAccessToken}),
        budget,tileSize,timeoutMs,
        signal:controller?.signal
      })).then(result=>{
        actualTiles.set(coords.z+"/"+coords.x+"/"+coords.y,{...actualTiles.get(coords.z+"/"+coords.x+"/"+coords.y),regular_sources:result.drawn.map(d=>({source_id:d.source_id,tile:d.source_tile})),failed:result.rejected});
        const classification=classifyRasterTileResult(renderLayers,coords,tileSize,result);
        if(!controller?.signal.aborted)try{
          onTileDiagnostics?.({...result,...classification,
            tile:{x:coords.x,y:coords.y,z:coords.z}});
        }catch(_){}
        const success=["expected_transparent","complete_verified_coverage"]
          .includes(classification.tile_status);
        const error=controller?.signal.aborted?new Error("Raster tile cancelled")
          :success?null:new Error("Raster tile missing verified image content");
        done?.(error,canvas);
      },error=>done?.(error,canvas)).finally(()=>{
        radarSettled=true;finish();
      });
      return canvas;
    }
  });
  // GridLayer retains the map's own zoom limits; no maxZoom display
  // ceiling is installed here. The canvas grid is clamped to native z18
  // and Leaflet enlarges it above z18. Each provider below z18 uses its
  // independently cropped ancestor image without sacrificing DWD detail.
  const layer=new Layer({tileSize,keepBuffer:1,updateWhenIdle:true,
    noWrap:false,maxNativeZoom:18});
  layer._p7Snapshot=verified;
  layer._p7DeferredNASA=Boolean(deferredSource);
  layer._p7ConfigureNASATransport=policy=>{if(deferredSource)configureNasaTransport(policy);};
  layer._p7NASADiagnostics=()=>nasaLease?.diagnostic()||{owned_tiles:0,persistent:false};
  layer._p7SpatialDiagnostics=()=>{
    const tiles=Object.values(layer._tiles||{}),worlds=new Set(),sources=new Set();
    for(const entry of tiles){const c=entry.coords,n=2**c.z;worlds.add(Math.floor(c.x/n));for(const source of verified.layers)for(const native of plannedSourceTiles(source,c)||[])sources.add(source.source_id+':'+native.z+'/'+native.x+'/'+native.y);}
    return {spatial_contract_version:verified.spatial_contract_version||1,map_zoom:layer._map?.getZoom?.(),world_copies:[...worlds].sort((a,b)=>a-b),
      world_copy_tiles:tiles.slice(0,256).map(entry=>{const c=entry.coords,n=2**c.z,x=((c.x%n)+n)%n;return {display:{...c},canonical:{x,y:c.y,z:c.z},paint:actualTiles.get(c.z+'/'+x+'/'+c.y)||null};}),display_tiles:tiles.length,canonical_required_sources:[...sources],
      actual_image_tiles:[...actualTiles.entries()].slice(-256),regular_images:budget.imageCache.size,regular_inflight:budget.inflight.size,cache_hits:budget.cacheHits,shared_requests:budget.sharedRequests,
      source_plans_complete:verified.layers.every(s=>s.raster_plan?.plan_complete!==false),nasa_plan:verified.nasa_mosaic||null,
      radar_mask:deferredSource?.spatial_policy?.radar_mask||null,spatial_planning:verified.spatial_planning||null};
  };
  layer._p7OperaGeneration=verified.layers.some(source=>source.source_id==="opera/opera_rate_raster");
  layer._p7RasterRenderOrder=renderLayers.map(x=>({source_id:x.source_id,
    freshness_class:x.freshness_class||"current"}));
  layer._p7RasterRequestBudget=budget;
  layer._p7RevokeDeferredNASA=()=>{nasaRevoked=true;nasaLease?.release();for(const [canvas,grants] of nasaCanvases){const ctx=canvas.getContext("2d");if(deferredSource.spatial_policy?.radar_mask){retainProtectedRasterAreas(ctx,deferredSource,canvas._p7Coords,tileSize);}else for(const native of grants){const r=nasaTileDestination(canvas._p7Coords,native,tileSize);ctx?.clearRect(r.x,r.y,r.width,r.height);}}nasaCanvases.clear();};
  layer._p7AbortPending=()=>{nasaLease?.release();budget.close();for(const controller of pending)controller.abort();};
  layer.on?.("tileunload",event=>{nasaCanvases.delete(event?.tile);const c=event?.tile?._p7Coords;if(c)actualTiles.delete(c.z+"/"+c.x+"/"+c.y);event?.tile?._p7RasterAbort?.();});
  layer.on?.("remove",()=>layer._p7AbortPending());
  return layer;
}

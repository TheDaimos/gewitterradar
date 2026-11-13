import {plannedSourceTiles} from './radar-mask.js?v=411147r1';
/*
 * P7-010 experimental provider-neutral raster tile loading.
 * Still isolated from Gewitterradar's active V1 precipitation display.
 *
 * The WR V2 endpoint chooses ordered sources. This consumer validates
 * geographic and zoom relevance, expands approved WMS/XYZ templates,
 * enforces a finite shared image-request budget and draws in source order.
 * No provider ranking is performed here.
 */
import {rasterTileUrl} from "./raster-tile-url.js?v=41188r1";
import {rasterTilePixelCrops} from "./raster-tile-clip.js?v=41188r1";
import {drawVerifiedRasterMosaicTile,rasterMosaicRenderOrder} from "./raster-compositor.js?v=411147r1";

const operaTileDenialCodes=new Set([
 "missing_authenticated_user","administrator_required","profile_not_authorized",
 "insecure_transport","diagnostic_route_disabled","provider_disabled",
 "diagnostic_registration_revoked","frame_expired","frame_in_future",
 "invalid_frame_time","invalid_route_or_stamp","frame_not_registered",
 "stamp_mismatch","scientific_admission_missing","missing_attribution",
 "frame_registration_revoked"
]);
export function operaTileHttpError(response){
 const error=new Error("opera_tile_http_"+response.status);
 error.httpStatus=response.status;
 const denial=response.headers.get("X-WeatherRouter-Tile-Denial");
 if((response.status===401||response.status===403)&&operaTileDenialCodes.has(denial))
   error.tileDenialCode=denial;
 return error;
}

// Completed OPERA frames have immutable timestamped URLs. Keep successful
// decoded images across GridLayer replacement/abort cycles, so only missing
// tiles require a network retry. This cache grants no validity: the current
// WR V2 response must still select and authorize the source before lookup.
const operaCompletedImages=new Map();
const OPERA_COMPLETED_CACHE_LIMIT=64;
/* Short-lived, bounded DWD-only decoded image reuse across viewport changes.
 * Frame time and full URL identify the pixel generation. A current WR-approved
 * V2 layer is still required before lookup; this never authorizes a frame.
 * NASA's no-store contract is deliberately excluded.
 */
const dwdCompletedImages=new Map();
const DWD_COMPLETED_LIMIT=96;
const DWD_COMPLETED_TTL_MS=180000;
function dwdCompletedKey(id,url,frameTime){
  return typeof id==="string"&&id.startsWith("dwd/")&&
    typeof url==="string"&&url.startsWith("https://")&&
    typeof frameTime==="string"&&/^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(frameTime)
    ?id+"\n"+frameTime+"\n"+url:null;
}
function getCompletedDWDImage(id,url,frameTime){
  const key=dwdCompletedKey(id,url,frameTime);
  if(!key)return null;
  const row=dwdCompletedImages.get(key);
  if(!row)return null;
  if(Date.now()-row.at>DWD_COMPLETED_TTL_MS){dwdCompletedImages.delete(key);return null;}
  dwdCompletedImages.delete(key);dwdCompletedImages.set(key,row);
  return row.image;
}
function retainCompletedDWDImage(id,url,frameTime,image){
  const key=dwdCompletedKey(id,url,frameTime);
  if(!key||!image)return;
  dwdCompletedImages.delete(key);
  dwdCompletedImages.set(key,{image,at:Date.now()});
  while(dwdCompletedImages.size>DWD_COMPLETED_LIMIT)
    dwdCompletedImages.delete(dwdCompletedImages.keys().next().value);
}

function operaCompletedKey(id,url){
  return id==="opera/opera_rate_raster" &&
    /^\/api\/weather_router\/opera_tile\/RATE\/20\d{6}T\d{6}Z\/\d+\/\d+\/\d+\.png$/.test(url)
    ?id+"\n"+url:null;
}
function retainCompletedOperaImage(id,url,image){
  const key=operaCompletedKey(id,url);
  if(!key||!image)return;
  operaCompletedImages.delete(key);
  operaCompletedImages.set(key,image);
  while(operaCompletedImages.size>OPERA_COMPLETED_CACHE_LIMIT)
    operaCompletedImages.delete(operaCompletedImages.keys().next().value);
}

export class RasterTileRequestBudget {
 constructor(maxRequests,{maxConcurrent=4}={}){
   if(!Number.isInteger(maxRequests)||maxRequests<1||maxRequests>256
      ||!Number.isInteger(maxConcurrent)||maxConcurrent<1||maxConcurrent>8)
     throw new RangeError("Invalid raster tile request budget");
   this.maxRequests=maxRequests;
   this.maxConcurrent=maxConcurrent;
   this.used=0;
   this.active=0;
   this.queue=[];
   this.closed=false;
   this.imageCache=new Map();this.inflight=new Map();this.cacheHits=0;this.sharedRequests=0;
   this.maxCachedImages=maxRequests;
 }
 async reserve(signal=null,{retry=false}={}){
   if(this.closed||signal?.aborted||(!retry&&this.used>=this.maxRequests))return null;
   // A waiting request holds no network slot and consumes no request budget.
   if(this.active>=this.maxConcurrent){
     const admitted=await new Promise(resolve=>{
       const entry={resolve,signal,onAbort:null};
       entry.onAbort=()=>{
         const index=this.queue.indexOf(entry);
         if(index>=0)this.queue.splice(index,1);
         resolve(false);
       };
       signal?.addEventListener("abort",entry.onAbort,{once:true});
       if(signal?.aborted)entry.onAbort();
       else this.queue.push(entry);
     });
     if(!admitted)return null;
   }else{
     this.active++;
   }
   if(this.closed||signal?.aborted||(!retry&&this.used>=this.maxRequests)){
     this._releaseSlot();
     return null;
   }
   if(!retry)this.used++;
   let released=false;
   return ()=>{
     if(released)return;
     released=true;
     this._releaseSlot();
   };
 }
 getCachedImage(id,url,frameTime=null){
   if(this.closed)return null;
   const key=id+"\n"+(frameTime||"unversioned")+"\n"+url;
   let img=this.imageCache.get(key);
   if(img){this.cacheHits++;this.imageCache.delete(key);this.imageCache.set(key,img);return img;}
   const completedKey=operaCompletedKey(id,url);
   img=completedKey?operaCompletedImages.get(completedKey):null;
   if(img){
     operaCompletedImages.delete(completedKey);
     operaCompletedImages.set(completedKey,img);
   }
   return img||getCompletedDWDImage(id,url,frameTime)||null;
 }
 cacheImage(id,url,img,frameTime=null){
   if(this.closed||!img)return;
   const key=id+"\n"+(frameTime||"unversioned")+"\n"+url;
   retainCompletedOperaImage(id,url,img);
   retainCompletedDWDImage(id,url,frameTime,img);
   this.imageCache.delete(key);this.imageCache.set(key,img);
   while(this.imageCache.size>this.maxCachedImages)this.imageCache.delete(this.imageCache.keys().next().value);
 }
 sharedImage(key,signal,load){
   if(this.closed||signal?.aborted)return Promise.reject(new Error('raster_tile_cancelled'));
   let entry=this.inflight.get(key);
   if(!entry){
     const controller=new AbortController();entry={controller,owners:new Set()};
     entry.promise=Promise.resolve().then(()=>load(controller.signal)).finally(()=>{if(this.inflight.get(key)===entry)this.inflight.delete(key);});
     entry.promise.catch(()=>{});this.inflight.set(key,entry);
   }else this.sharedRequests++;
   const owner=Symbol();entry.owners.add(owner);
   return new Promise((resolve,reject)=>{
     let ended=false;
     const finish=(error,image)=>{if(ended)return;ended=true;signal?.removeEventListener('abort',cancel);entry.owners.delete(owner);if(!entry.owners.size){entry.controller.abort();if(this.inflight.get(key)===entry)this.inflight.delete(key);}error?reject(error):resolve(image);};
     const cancel=()=>finish(new Error('raster_tile_cancelled'));
     signal?.addEventListener('abort',cancel,{once:true});if(signal?.aborted)cancel();
     entry.promise.then(image=>finish(null,image),error=>finish(error));
   });
 }
 close(){
   this.closed=true;for(const entry of this.inflight.values())entry.controller.abort();this.inflight.clear();
   this.imageCache.clear();
   for(const entry of this.queue.splice(0)){
     entry.signal?.removeEventListener("abort",entry.onAbort);
     entry.resolve(false);
   }
 }
 _releaseSlot(){
   if(this.closed){this.active=Math.max(0,this.active-1);return;}
   while(this.queue.length){
     const next=this.queue.shift();
     next.signal?.removeEventListener("abort",next.onAbort);
     if(next.signal?.aborted){next.resolve(false);continue;}
     next.resolve(true);
     return;
   }
   this.active=Math.max(0,this.active-1);
 }
}

/**
 * @param {object} context CanvasRenderingContext2D or test-compatible surface
 * @param {object} tile XYZ location, including wrapped-world coordinates
 * @param {object[]} layers ordered verified WR V2 raster layer descriptors
 * @param {function} loadImage asynchronous loader (url, layer) => Image
 * @param {RasterTileRequestBudget} budget shared for ONE V2 response snapshot
 *
 * Missing/failed overlays may not suppress a loaded global foundation.
 * All network metadata and images are supplied through explicit parameters,
 * so this helper performs no hidden browser or HA accesses.
 */
export async function drawRasterMosaicTileFromUrls({
 context,tile,layers,loadImage,budget,tileSize=256,timeoutMs=8000,signal=null
}={}){
 if(!Array.isArray(layers)||layers.length>12||typeof loadImage!=="function"
   ||!(budget instanceof RasterTileRequestBudget))
   throw new TypeError("Invalid bounded mosaic tile request");
 if(!Number.isInteger(timeoutMs)||timeoutMs<10||timeoutMs>15000)
   throw new RangeError("Invalid raster image timeout");
 // The WR snapshot may contain up to twelve sources across the whole map.
 // Only actually covering sources consume the bounded four-source tile budget.
 // Preserve the WR ordering; the consumer must never re-score providers.
 const startedAt=Date.now();
 const renderLayers=rasterMosaicRenderOrder(layers);
 let selectedForTile=0;
 const fragments=renderLayers.flatMap(layer=>{
   const planned=plannedSourceTiles(layer,tile);
   return planned===null?[layer]:planned.map(native=>({...layer,_p7PlannedTile:native}));
 });
 const selectedIDs=new Set();
 const results=await Promise.all(fragments.map(async layer=>{
   const source_id=typeof layer?.source_id==="string"?layer.source_id:"unbekannt";
   if(!layer||layer.coverage_verified!==true||!layer.render){
     return {source_id,reason:"unverified_or_incomplete_source"};
   }
   const spec=layer.render;
   if(tile.z<spec.min_zoom)
     return {source_id,reason:"outside_zoom_coverage"};
   // A provider's maximum native zoom is not its maximum DISPLAY zoom.
   // Fetch the verified ancestor raster and crop the appropriate child area;
   // high-resolution regional overlays retain their own native detail.
   const nativeZoom=Math.min(tile.z,Math.floor(spec.max_zoom));
   const difference=tile.z-nativeZoom;
   const ancestorScale=2**difference;
   const sourceTile=layer._p7PlannedTile||(difference>0
     ?{x:Math.floor(tile.x/ancestorScale),y:Math.floor(tile.y/ancestorScale),z:nativeZoom}
     :tile);
   const coverage=layer.coverage_scope==="global"
     ?{scope:"global",verified:true}
     :layer.coverage_scope==="bbox"&&layer.coverage
       ?{scope:"bbox",bbox:layer.coverage,verified:true}
       :null;
   if(!coverage||!rasterTilePixelCrops(tile,coverage,tileSize).length)
     return {source_id,reason:"outside_tile_coverage"};
   if(!selectedIDs.has(source_id)&&selectedIDs.size>=4)
     return {source_id,reason:"tile_source_budget_exhausted"};
   selectedForTile++;selectedIDs.add(source_id);
   let url;
   try{url=rasterTileUrl(layer.tile_url,sourceTile);}
   catch(_){return {source_id,reason:"invalid_raster_tile_url"};}
   const cached=budget.getCachedImage(source_id,url,layer?.times?.valid_at);
   if(cached&&!signal?.aborted)
     return {source_id,layer:{...layer,image:cached,_p7SourceTile:sourceTile}};
   try{
     const result=await budget.sharedImage(source_id+'\n'+String(layer?.times?.valid_at||'unversioned')+'\n'+url,signal,async sharedSignal=>{
   let retryCount=0;
   while(!budget.closed&&!sharedSignal?.aborted){
     // A retry reuses this admitted OPERA coordinate's request budget, while
     // every attempt still acquires a bounded concurrent transport slot.
     const opera=source_id==="opera/opera_rate_raster";
     const release=await budget.reserve(sharedSignal,{retry:opera&&retryCount>0});
     if(!release)return {source_id,reason:sharedSignal?.aborted?"tile_cancelled":"request_budget_exhausted"};
     let retry=false;
     try{
       let timer=null;
       let image;
       const controller=typeof AbortController==="function"?new AbortController():null;
       const abort=()=>controller?.abort();
       sharedSignal?.addEventListener("abort",abort,{once:true});
       if(sharedSignal?.aborted)abort();
       try{
         image=await Promise.race([
           Promise.resolve().then(()=>loadImage(url,layer,{signal:controller?.signal})),
           new Promise((_resolve,reject)=>{
             const cancelled=()=>reject(new Error("raster_tile_cancelled"));
             controller?.signal.addEventListener("abort",cancelled,{once:true});
             if(controller?.signal.aborted){cancelled();return;}
             timer=setTimeout(()=>{controller?.abort();reject(new Error("raster_image_timeout"));},timeoutMs);
           })
         ]);
       }finally{
         if(timer!==null)clearTimeout(timer);
         sharedSignal?.removeEventListener("abort",abort);
       }
       if(sharedSignal?.aborted)return {source_id,reason:"tile_cancelled"};
       if(!image)throw new Error("empty_raster_image");
       budget.cacheImage(source_id,url,image,layer?.times?.valid_at);
       return {source_id,image};
     }catch(error){
       if(sharedSignal?.aborted)return {source_id,reason:"tile_cancelled"};
       if(error?.httpStatus===401||error?.httpStatus===403){
         const code=operaTileDenialCodes.has(error.tileDenialCode)?error.tileDenialCode:null;
         const policy=code&&!['missing_authenticated_user','administrator_required',
           'profile_not_authorized'].includes(code)&&error.httpStatus!==401;
         return {source_id,reason:policy?"image_policy_rejected":"image_auth_rejected",
           http_status:error.httpStatus,...(code?{tile_denial_code:code}:{})};
       }
       retry=(opera||budget.used<budget.maxRequests)&&!budget.closed;
       if(!retry)return {source_id,reason:"request_budget_exhausted"};
       retryCount++;
     }finally{
       release();
     }
     if(retry){
       // Transport backpressure only. Successful source images remain cached.
       const delay=Math.min(5000,250*2**Math.min(retryCount-1,5));
       await new Promise(resolve=>{
         let settled=false;
         const finish=()=>{
           if(settled)return;
           settled=true;
           clearTimeout(timer);
           sharedSignal?.removeEventListener("abort",finish);
           resolve();
         };
         const timer=setTimeout(finish,delay);
         sharedSignal?.addEventListener("abort",finish,{once:true});
         if(sharedSignal?.aborted)finish();
       });
     }
   }
   return {source_id,reason:"tile_cancelled"};
     });
     return result.image?{source_id,layer:{...layer,image:result.image,_p7SourceTile:sourceTile}}:result;
   }catch(_){return {source_id,reason:'tile_cancelled'};}

 }));
 const prepared=results.filter(x=>x.layer).map(x=>x.layer);
 const rejected=results.filter(x=>!x.layer).map(({source_id,reason,http_status,tile_denial_code})=>
   ({source_id,reason,...(http_status?{http_status}:{}),...(tile_denial_code?{tile_denial_code}:{})}));
 const drawn=signal?.aborted
   ?{drawn:[],rejected:[]}
   :drawVerifiedRasterMosaicTile(context,tile,prepared,tileSize);
 return {
   ...drawn,
   render_order:drawn.drawn.map(x=>x.source_id),
   duration_ms:Math.max(0,Date.now()-startedAt),
   rejected:[...rejected,...drawn.rejected],
   requests_used:budget.used,
   requests_remaining:budget.maxRequests-budget.used,
 };
}

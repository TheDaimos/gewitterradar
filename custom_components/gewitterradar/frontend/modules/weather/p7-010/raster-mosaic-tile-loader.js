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
import {drawVerifiedRasterMosaicTile,rasterMosaicRenderOrder} from "./raster-compositor.js?v=41198r1";

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
   this.imageCache=new Map();
   this.maxCachedImages=24;
 }
 async reserve(signal=null){
   if(this.closed||signal?.aborted||this.used>=this.maxRequests)return null;
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
   if(this.closed||signal?.aborted||this.used>=this.maxRequests){
     this._releaseSlot();
     return null;
   }
   this.used++;
   let released=false;
   return ()=>{
     if(released)return;
     released=true;
     this._releaseSlot();
   };
 }
 getCachedImage(id,url){
   if(this.closed)return null;
   const key=id+"\n"+url,img=this.imageCache.get(key);
   if(img){this.imageCache.delete(key);this.imageCache.set(key,img);}
   return img||null;
 }
 cacheImage(id,url,img){
   if(this.closed||!img)return;
   const key=id+"\n"+url;
   this.imageCache.delete(key);this.imageCache.set(key,img);
   while(this.imageCache.size>this.maxCachedImages)this.imageCache.delete(this.imageCache.keys().next().value);
 }
 close(){
   this.closed=true;
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
 const results=await Promise.all(renderLayers.map(async layer=>{
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
   const sourceTile=difference>0
     ?{x:Math.floor(tile.x/ancestorScale),y:Math.floor(tile.y/ancestorScale),z:nativeZoom}
     :tile;
   const coverage=layer.coverage_scope==="global"
     ?{scope:"global",verified:true}
     :layer.coverage_scope==="bbox"&&layer.coverage
       ?{scope:"bbox",bbox:layer.coverage,verified:true}
       :null;
   if(!coverage||!rasterTilePixelCrops(tile,coverage,tileSize).length)
     return {source_id,reason:"outside_tile_coverage"};
   if(selectedForTile>=4)
     return {source_id,reason:"tile_source_budget_exhausted"};
   selectedForTile++;
   let url;
   try{url=rasterTileUrl(layer.tile_url,sourceTile);}
   catch(_){return {source_id,reason:"invalid_raster_tile_url"};}
   const cached=budget.getCachedImage(source_id,url);
   if(cached&&!signal?.aborted)
     return {source_id,layer:{...layer,image:cached,_p7SourceTile:sourceTile}};
   const release=await budget.reserve(signal);
   if(!release)return {source_id,reason:signal?.aborted?"tile_cancelled":"request_budget_exhausted"};
   try{
     let timer=null;
     let image;
     const controller=typeof AbortController==="function"
       ?new AbortController():null;
     const abort=()=>controller?.abort();
     signal?.addEventListener("abort",abort,{once:true});
     if(signal?.aborted)abort();
     try{
       image=await Promise.race([
         Promise.resolve().then(()=>loadImage(url,layer,{
           signal:controller?.signal
         })),
         new Promise((_resolve,reject)=>{
           const cancelled=()=>reject(new Error("raster_tile_cancelled"));
           controller?.signal.addEventListener("abort",cancelled,{once:true});
           if(controller?.signal.aborted){cancelled();return;}
           timer=setTimeout(()=>{
             controller?.abort();
             reject(new Error("raster_image_timeout"));
           },timeoutMs);
         })
       ]);
     }finally{
       if(timer!==null)clearTimeout(timer);
       signal?.removeEventListener("abort",abort);
     }
     if(signal?.aborted)return {source_id,reason:"tile_cancelled"};
     if(!image)return {source_id,reason:"empty_raster_image"};
     budget.cacheImage(source_id,url,image);
     return {source_id,layer:{...layer,image,_p7SourceTile:sourceTile}};
   }catch(_){
     return {source_id,reason:signal?.aborted?"tile_cancelled":"image_request_failed"};
   }finally{
     release();
   }
 }));
 const prepared=results.filter(x=>x.layer).map(x=>x.layer);
 const rejected=results.filter(x=>!x.layer).map(({source_id,reason})=>({source_id,reason}));
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

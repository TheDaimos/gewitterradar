/*
 * P7-010 experimental provider-neutral raster tile loading.
 * Still isolated from Gewitterradar's active V1 precipitation display.
 *
 * The WR V2 endpoint chooses ordered sources. This consumer validates
 * geographic and zoom relevance, expands approved WMS/XYZ templates,
 * enforces a finite shared image-request budget and draws in source order.
 * No provider ranking is performed here.
 */
import {rasterTileUrl} from "./raster-tile-url.js";
import {rasterTilePixelCrops} from "./raster-tile-clip.js";
import {drawVerifiedRasterMosaicTile} from "./raster-compositor.js";

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
 }
 async reserve(){
   if(this.used>=this.maxRequests)return null;
   this.used++;
   if(this.active<this.maxConcurrent){
     this.active++;
   }else{
     await new Promise(resolve=>this.queue.push(resolve));
   }
   let released=false;
   return ()=>{
     if(released)return;
     released=true;
     if(this.queue.length)this.queue.shift()();
     else this.active--;
   };
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
 context,tile,layers,loadImage,budget,tileSize=256,timeoutMs=8000
}={}){
 if(!Array.isArray(layers)||layers.length>4||typeof loadImage!=="function"
   ||!(budget instanceof RasterTileRequestBudget))
   throw new TypeError("Invalid bounded mosaic tile request");
 if(!Number.isInteger(timeoutMs)||timeoutMs<10||timeoutMs>15000)
   throw new RangeError("Invalid raster image timeout");
 const results=await Promise.all(layers.map(async layer=>{
   const source_id=typeof layer?.source_id==="string"?layer.source_id:"unbekannt";
   if(!layer||layer.coverage_verified!==true||!layer.render){
     return {source_id,reason:"unverified_or_incomplete_source"};
   }
   const spec=layer.render;
   if(tile.z<spec.min_zoom||tile.z>spec.max_zoom)
     return {source_id,reason:"outside_zoom_coverage"};
   const coverage=layer.coverage_scope==="global"
     ?{scope:"global",verified:true}
     :layer.coverage_scope==="bbox"&&layer.coverage
       ?{scope:"bbox",bbox:layer.coverage,verified:true}
       :null;
   if(!coverage||!rasterTilePixelCrops(tile,coverage,tileSize).length)
     return {source_id,reason:"outside_tile_coverage"};
   let url;
   try{url=rasterTileUrl(layer.tile_url,tile);}
   catch(_){return {source_id,reason:"invalid_raster_tile_url"};}
   const release=await budget.reserve();
   if(!release)return {source_id,reason:"request_budget_exhausted"};
   try{
     let timer=null;
     let image;
     try{
       image=await Promise.race([
         Promise.resolve().then(()=>loadImage(url,layer)),
         new Promise((_resolve,reject)=>{
           timer=setTimeout(()=>reject(new Error("raster_image_timeout")),timeoutMs);
         })
       ]);
     }finally{
       if(timer!==null)clearTimeout(timer);
     }
     if(!image)return {source_id,reason:"empty_raster_image"};
     return {source_id,layer:{...layer,image}};
   }catch(_){
     return {source_id,reason:"image_request_failed"};
   }finally{
     release();
   }
 }));
 const prepared=results.filter(x=>x.layer).map(x=>x.layer);
 const rejected=results.filter(x=>!x.layer).map(({source_id,reason})=>({source_id,reason}));
 const drawn=drawVerifiedRasterMosaicTile(context,tile,prepared,tileSize);
 return {
   ...drawn,
   rejected:[...rejected,...drawn.rejected],
   requests_used:budget.used,
   requests_remaining:budget.maxRequests-budget.used,
 };
}

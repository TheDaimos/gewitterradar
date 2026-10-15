/*
 * P7-010 experimental standalone Leaflet raster mosaic layer.
 * NOT registered in Gewitterradar's production module manifest.
 *
 * WeatherRouter decides which verified sources are ordered in a V2 snapshot.
 * This consumer ONLY validates, downloads and clips the supplied layers.
 */
import {validateRasterMosaicV2} from "./raster-mosaic-contract.js";
import {
 RasterTileRequestBudget,drawRasterMosaicTileFromUrls
} from "./raster-mosaic-tile-loader.js";

function defaultImageLoader(url,_layer,{signal}={}){
 return new Promise((resolve,reject)=>{
   const image=new Image();
   let completed=false;
   const cleanup=()=>{
     image.onload=null;
     image.onerror=null;
     signal?.removeEventListener("abort",cancel);
   };
   const finish=(fn,value)=>{
     if(completed)return;
     completed=true;
     cleanup();
     fn(value);
   };
   const cancel=()=>{
     image.src="";
     finish(reject,new Error("Raster image cancelled"));
   };
   image.onload=()=>finish(resolve,image);
   image.onerror=()=>finish(reject,new Error("Public raster image unavailable"));
   if(signal?.aborted){cancel();return;}
   signal?.addEventListener("abort",cancel,{once:true});
   // Deliberately no crossOrigin assumption. Display-only WMS imagery may
   // taint Canvas; pixel readback/export must not be inferred to be permitted.
   image.src=url;
 });
}

/**
 * Create a Leaflet GridLayer for one immutable WR V2 mosaic snapshot.
 *
 * @param {object} L Leaflet namespace with GridLayer.extend
 * @param {object} snapshot already returned by WR V2, no provider ranking
 * @param {object} options explicit budgets; pass max_tile_requests from
 *    the corresponding V2 request, not from a user-editable provider response.
 */
export function createRasterMosaicGridLayer(L,snapshot,{
 maxLayers=12,maxTileRequests=48,maxConcurrent=4,tileSize=256,timeoutMs=8000,
 pane="gr-weather-radar",opacity=1,
 loadImage=defaultImageLoader,
 createCanvas=()=>document.createElement("canvas"),
 onTileDiagnostics=null
}={}){
 if(!L?.GridLayer?.extend||typeof loadImage!=="function"
   ||typeof createCanvas!=="function")
   throw new TypeError("Leaflet GridLayer and raster loaders required");
 if(!Number.isInteger(tileSize)||tileSize<1||tileSize>512)
   throw new RangeError("Invalid destination tile size");
 if(typeof pane!=="string"||!pane.trim()||!Number.isFinite(opacity)
   ||opacity<0||opacity>1)
   throw new TypeError("Invalid renderer pane or opacity");
 const checked=validateRasterMosaicV2(snapshot,{maxLayers});
 const budget=new RasterTileRequestBudget(maxTileRequests,{maxConcurrent});
 const Composite=L.GridLayer.extend({
   createTile(coords,done){
     const canvas=createCanvas();
     if(!canvas||typeof canvas.getContext!=="function")
       throw new TypeError("Raster tile requires a Canvas surface");
     canvas.width=tileSize;
     canvas.height=tileSize;
     const ctx=canvas.getContext("2d");
     if(!ctx){
       done?.(new Error("Canvas2D not available"),canvas);
       return canvas;
     }
     // Leaflet requires createTile to return synchronously. This Promise
     // draws the exact ordered WR layers and calls done once settled.
     Promise.resolve().then(()=>drawRasterMosaicTileFromUrls({
       context:ctx,tile:coords,layers:checked.layers,
       budget,loadImage,tileSize,timeoutMs
     })).then(
       result=>{
         if(typeof onTileDiagnostics==="function"){
           // Diagnostic hooks may not interrupt the visible tile lifecycle.
           try{onTileDiagnostics(result);}catch(_){}
         }
         done?.(null,canvas);
       },
       error=>{done?.(error,canvas);}
     );
     return canvas;
   }
 });
 const layer=new Composite({
   tileSize,pane,opacity,
   attribution:checked.layers.map(item=>item.attribution).join(" · "),
   keepBuffer:1,
   updateWhenIdle:true,
 });
 layer._p7RasterRequestBudget=budget;
 return layer;
}

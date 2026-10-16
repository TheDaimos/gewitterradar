/* P7-010: Leaflet rendering adapter for the existing WR V2 mosaic contract.
 * WeatherRouter alone selects and orders sources; this file draws verified
 * snapshots using a strict shared per-snapshot tile budget.
 */
import {validateRasterMosaicV2} from "./raster-mosaic-contract.js";
import {RasterTileRequestBudget,drawRasterMosaicTileFromUrls}
  from "./raster-mosaic-tile-loader.js";

function loadRasterImage(url,_source,{signal}={}){
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
    function cancel(){finish(new Error("Image request cancelled"));}
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
  timeoutMs=8000,loadImage=loadRasterImage,
  createCanvas=()=>document.createElement("canvas"),onTileDiagnostics=null
}={}){
  if(!L?.GridLayer?.extend||typeof loadImage!=="function"||
    typeof createCanvas!=="function")throw new TypeError("Leaflet layer prerequisites missing");
  if(!Number.isInteger(tileSize)||tileSize<1||tileSize>512)
    throw new RangeError("Invalid tile size");
  const verified=validateRasterMosaicV2(snapshot,{maxLayers});
  const budget=new RasterTileRequestBudget(maxTileRequests,{maxConcurrent});
  const Layer=L.GridLayer.extend({
    createTile(coords,done){
      const canvas=createCanvas();
      if(!canvas||typeof canvas.getContext!=="function")
        throw new TypeError("Canvas unavailable");
      canvas.width=tileSize;canvas.height=tileSize;
      const context=canvas.getContext("2d");
      if(!context){done?.(new Error("Canvas2D unavailable"),canvas);return canvas;}
      Promise.resolve().then(()=>drawRasterMosaicTileFromUrls({
        context,tile:coords,layers:verified.layers,loadImage,budget,tileSize,timeoutMs
      })).then(result=>{
        try{onTileDiagnostics?.(result);}catch(_){}
        done?.(null,canvas);
      },error=>done?.(error,canvas));
      return canvas;
    }
  });
  const layer=new Layer({tileSize,keepBuffer:1,updateWhenIdle:true});
  layer._p7RasterRequestBudget=budget;
  return layer;
}

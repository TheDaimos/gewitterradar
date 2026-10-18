/* P7-010: Leaflet rendering adapter for the existing WR V2 mosaic contract.
 * WeatherRouter alone selects and orders sources; this file draws verified
 * snapshots using a strict shared per-snapshot tile budget.
 */
import {validateRasterMosaicV2} from "./raster-mosaic-contract.js?v=41191r1";
import {RasterTileRequestBudget,drawRasterMosaicTileFromUrls}
  from "./raster-mosaic-tile-loader.js?v=41192r1";
import {rasterTilePixelCrops} from "./raster-tile-clip.js?v=41188r1";
import {measureRasterTileCoverage} from "./raster-mosaic-coverage.js?v=41190r1";

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
    const area=rasterTilePixelCrops(tile,mask,tileSize);
    if(!area.length)continue;
    if(selected++>=4)break; // Same four relevant sources as the tile loader.
    crops.push(...area);
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
  const status=expected.fraction<=0?"expected_transparent"
    :painted&&actual+1e-5>=expected.fraction?"complete_verified_coverage"
    :painted?"incomplete_image_coverage":"image_load_failed";
  return {tile_status:status,expected_fraction:Number(expected.fraction.toFixed(6)),
    drawn_fraction:Number(actual.toFixed(6)),
    geographic_only:true,image_pixels_verified:false};
}

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
  maxDataAgeSeconds=900,maxBackgroundAgeSeconds=null,
  timeoutMs=8000,loadImage=loadRasterImage,
  createCanvas=()=>document.createElement("canvas"),onTileDiagnostics=null
}={}){
  if(!L?.GridLayer?.extend||typeof loadImage!=="function"||
    typeof createCanvas!=="function")throw new TypeError("Leaflet layer prerequisites missing");
  if(!Number.isInteger(tileSize)||tileSize<1||tileSize>512)
    throw new RangeError("Invalid tile size");
  const verified=validateRasterMosaicV2(snapshot,{maxLayers,maxDataAgeSeconds,maxBackgroundAgeSeconds});
  const budget=new RasterTileRequestBudget(maxTileRequests,{maxConcurrent});
  const pending=new Set();
  const Layer=L.GridLayer.extend({
    createTile(coords,done){
      const canvas=createCanvas();
      if(!canvas||typeof canvas.getContext!=="function")
        throw new TypeError("Canvas unavailable");
      const controller=typeof AbortController==="function"?new AbortController():null;
      if(controller){canvas._p7RasterAbort=()=>controller.abort();pending.add(controller);}
      canvas.width=tileSize;canvas.height=tileSize;
      const context=canvas.getContext("2d");
      if(!context){if(controller)pending.delete(controller);done?.(new Error("Canvas2D unavailable"),canvas);return canvas;}
      Promise.resolve().then(()=>drawRasterMosaicTileFromUrls({
        context,tile:coords,layers:verified.layers,loadImage,budget,tileSize,timeoutMs,
        signal:controller?.signal
      })).then(result=>{
        const classification=classifyRasterTileResult(verified.layers,coords,tileSize,result);
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
        if(controller)pending.delete(controller);
        canvas._p7RasterAbort=null;
      });
      return canvas;
    }
  });
  // GridLayer retains the map's own zoom limits; no maxZoom display
  // ceiling is installed here. The canvas grid is clamped to native z18
  // and Leaflet enlarges it above z18. Each provider below z18 uses its
  // independently cropped ancestor image without sacrificing DWD detail.
  const layer=new Layer({tileSize,keepBuffer:1,updateWhenIdle:true,
    maxNativeZoom:18});
  layer._p7RasterRequestBudget=budget;
  layer._p7AbortPending=()=>{budget.close();for(const controller of pending)controller.abort();};
  layer.on?.("tileunload",event=>event?.tile?._p7RasterAbort?.());
  layer.on?.("remove",()=>layer._p7AbortPending());
  return layer;
}

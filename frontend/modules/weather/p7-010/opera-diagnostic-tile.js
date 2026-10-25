/*
 * OPERA RATE: explicit administrator-only DEV diagnostic tile adapter.
 * Not wired to the production precipitation layer or automatic provider routing.
 * No caching, URL tokens, or scientific raster approval.
 */
import {buildRasterMosaicV2Request} from "./raster-mosaic-consumer.js?v=41198r1";

const TEMPLATE=/^\/api\/weather_router\/opera_tile\/RATE\/(20\d{6}T\d{6}Z)\/\{z\}\/\{x\}\/\{y\}\.png$/;
const NOTICE="OPERA-DIAGNOSE – GEOGRAFISCHE PIXELPOSITION UNGEPRÜFT";

export function validateOperaDiagnosticResponse(response, correlationId){
 const source=response?.source_request;
 // Explicit server-side rejection is not an invalid client request. Preserve
 // bounded, non-sensitive details for the operator without ever accepting tiles.
 if(response && response.status!=="diagnostic_unverified"){
   const status=String(response.status||"missing").slice(0,64);
   const reason=String(response.block_reason||"unspecified").slice(0,96);
   const error=new Error("WR OPERA gesperrt: "+status+" / "+reason);
   error.code="opera_server_denied";
   error.diagnostic={status,block_reason:reason,raster_approved:false,
     layer_count:Array.isArray(response.layers)?response.layers.length:0,
     admission_gates:response.diagnostic_gates&&typeof response.diagnostic_gates==="object"?response.diagnostic_gates:null};
   throw error;
 }
 if(!source||source.provider_id!=="opera"||source.product_id!=="RATE"
   ||source.diagnostic!==true||response.provider_id!=="opera"
   ||response.product_id!=="RATE"||response.correlation_id!==correlationId
   ||response.status!=="diagnostic_unverified"||response.diagnostic_only!==true
   ||response.raster_approved!==false||response.block_reason!=="scientific_evidence_missing"
   ||!Array.isArray(response.layers)||response.layers.length!==1
   ||!Array.isArray(response.tile_urls)||response.tile_urls.length!==1)
   throw new TypeError("OPERA diagnostic authorization or contract rejected");
 const layer=response.layers[0];
 if(layer.scientific_status!=="UNVERIFIED_DIAGNOSTIC"||layer.product_id!=="RATE"
   ||layer.provider_id!=="opera"||layer.render_mode!=="raster_tile"
   ||layer.unit!=="mm/h"||layer.tile_url!==response.tile_urls[0]
   ||!TEMPLATE.test(layer.tile_url))
   throw new TypeError("Unverified OPERA tile metadata rejected");
 return Object.freeze({template:layer.tile_url,notice:NOTICE,validAt:response.valid_at});
}

export function operaDiagnosticTileUrl(template,{z,x,y}){
 if(!TEMPLATE.test(template)||![z,x,y].every(Number.isSafeInteger)
   ||z<0||z>18||y<0||y>=2**z)
   throw new TypeError("Invalid authorized OPERA diagnostic tile");
 const xx=((x%(2**z))+(2**z))%(2**z);
 return template.replace("{z}",String(z)).replace("{x}",String(xx)).replace("{y}",String(y));
}

export async function fetchOperaDiagnosticPng({template,tile,token,fetchImpl=fetch,signal}={}){
 if(typeof token!=="string"||!token||typeof fetchImpl!=="function")
   throw new TypeError("HA user access token required");
 const url=operaDiagnosticTileUrl(template,tile);
 const response=await fetchImpl(url,{
   method:"GET",headers:{Authorization:"Bearer "+token,Accept:"image/png"},
   credentials:"omit",cache:"no-store",redirect:"error",signal
 });
 if(!response.ok||response.headers.get("content-type")?.split(";")[0].trim()!=="image/png"
   ||response.headers.get("x-weatherrouter-scientific-status")!=="unverified-diagnostic"){
   const error=new Error("OPERA diagnostic HTTP authorization or response rejected");
   error.httpStatus=Number.isInteger(response.status)?response.status:0;
   throw error;
 }
 const bytes=new Uint8Array(await response.arrayBuffer());
 if(bytes.length<8||bytes.length>512*1024
   ||[137,80,78,71,13,10,26,10].some((value,index)=>bytes[index]!==value))
   throw new Error("Invalid OPERA diagnostic PNG");
 // PNG IHDR must define a precisely 256 x 256 pixel tile, not just a signature.
 if(bytes.length<24||new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint32(16)!==256
   ||new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint32(20)!==256)
   throw new Error("OPERA diagnostic PNG dimensions rejected");
 return new Blob([bytes],{type:"image/png"});
}

/* Temporary controlled diagnostic pane; never shares V1/V2 tile caches. */
export function mountOperaDiagnosticPane({Leaflet,map,response,correlationId,
 accessToken,fetchImpl=fetch,documentRef=document,URLRef=URL}={}){
 const approved=validateOperaDiagnosticResponse(response,correlationId);
 if(!Leaflet?.GridLayer?.extend||!map?.addLayer||typeof accessToken!=="string")
   throw new TypeError("Diagnostic map and access token required");
 let disposed=false;
 const controllers=new Set();
 const urls=new Set();
 const metrics={requested:0,loaded:0,failed:0,mounted:0,http_statuses:{},last_error:null};
 const validMs=Date.parse(approved.validAt);
 if(!Number.isFinite(validMs)||validMs>Date.now()||Date.now()-validMs>=900000)
   throw new Error("opera_diagnostic_expired");
 const updateStatus=()=>{
   if(disposed)return;
   const age=Math.max(0,Math.floor((Date.now()-validMs)/60000));
   watermark.textContent="OPERA · UNGEPRÜFT · "+age+" Min. · "+(
      metrics.loaded?"PNG geladen: "+metrics.loaded:
      metrics.requested>metrics.failed?"Kacheln werden geladen":
      metrics.failed?"Keine gültigen Kacheln":"Aktiv");
 };
 const expiry=setTimeout(()=>{if(!disposed)closePane();},Math.max(1,validMs+900000-Date.now()));
 const Pane=Leaflet.GridLayer.extend({
   createTile(coords,done){
     const image=documentRef.createElement("img");
     image.alt=NOTICE;
     image.width=256;image.height=256;
     const controller=new AbortController();
     controllers.add(controller);
     metrics.requested++;updateStatus();
     fetchOperaDiagnosticPng({
       template:approved.template,tile:coords,token:accessToken,
       fetchImpl,signal:controller.signal
     }).then(blob=>{
       if(disposed||controller.signal.aborted)return;
       const objectUrl=URLRef.createObjectURL(blob);
       urls.add(objectUrl);
       image.src=objectUrl;
       image.onload=()=>{metrics.loaded++;metrics.mounted++;updateStatus();done(null,image);};
       image.onerror=()=>{metrics.failed++;metrics.last_error="diagnostic_png_decode_failed";updateStatus();done(new Error("diagnostic_png_decode_failed"),image);};
     }).catch(error=>{if(!disposed){metrics.failed++;if(Number.isInteger(error?.httpStatus)){const code=String(error.httpStatus);metrics.http_statuses[code]=(metrics.http_statuses[code]||0)+1;}metrics.last_error=String(error?.message||"opera_tile_failed").slice(0,80);updateStatus();done(error,image);}})
       .finally(()=>controllers.delete(controller));
     return image;
   }
 });
 const layer=new Pane({tileSize:256,opacity:0.7,updateWhenIdle:true});
 const watermark=documentRef.createElement("div");
 watermark.textContent=NOTICE;
 watermark.setAttribute("role","status");
 watermark.style.cssText="position:absolute;left:8px;bottom:8px;z-index:10000;background:#280c08;color:#fff;border:2px solid #dc9b43;padding:6px;font:bold 13px sans-serif;pointer-events:none";
 const container=map.getContainer();
 container.appendChild(watermark);
 map.addLayer(layer);
 updateStatus();
 function closePane(){
     if(disposed)return;
     disposed=true;
     clearTimeout(expiry);
     for(const controller of controllers)controller.abort();
     controllers.clear();
     map.removeLayer(layer);
     for(const url of urls)URLRef.revokeObjectURL(url);
     urls.clear();
     watermark.remove();
   }
 return {notice:NOTICE,layer,validAt:approved.validAt,metrics,close:closePane,
   get active(){return !disposed;}};
}

/** Explicit single-use diagnostic request; never activates normal precipitation. */
export async function requestOperaDiagnosticPane({callWS,Leaflet,map,viewport,focus,
 accessToken,correlationId,fetchImpl=fetch,documentRef=document,URLRef=URL}={}){
 if(typeof callWS!=="function"||typeof correlationId!=="string"||!correlationId)
   throw new TypeError("Authorized explicit diagnostic request required");
 const request=buildRasterMosaicV2Request({
   viewport,focus,correlationId,maxLayers:1,maxTileRequests:16,
   maxDataAgeSeconds:900
 });
 request.source_request={provider_id:"opera",product_id:"RATE",diagnostic:true};
 const response=await callWS(request);
 const ready=validateOperaDiagnosticResponse(response,correlationId);
 if(!ready)throw new Error("Invalid diagnostic authorization");
 return mountOperaDiagnosticPane({
   Leaflet,map,response,correlationId,accessToken,fetchImpl,documentRef,URLRef
 });
}

/*
 * OPERA RATE: explicit administrator-only DEV diagnostic tile adapter.
 * Not wired to the production precipitation layer or automatic provider routing.
 * No caching, URL tokens, or scientific raster approval.
 */
import {buildRasterMosaicV2Request} from "./raster-mosaic-consumer.js?v=41198r1";

const TEMPLATE=/^\/api\/weather_router\/opera_preview\/RATE\/(20\d{6}T\d{6}Z)\/(north_first|south_first)\/\{z\}\/\{x\}\/\{y\}\.png$/;
const NOTICE="UNVERIFIED / ENTWICKLUNGSVORSCHAU – geografische Orientierung nicht wissenschaftlich bestätigt";
const ORIENTATIONS=new Set(["north_first","south_first"]);

export function validateOperaDiagnosticResponse(response,correlationId,orientation="north_first"){
 if(!ORIENTATIONS.has(orientation))throw new TypeError("Ungültige OPERA-Orientierung");
 if(response?.status!=="UNVERIFIED_DEV_PREVIEW"){
   const error=new Error("OPERA-Vorschau gesperrt: "+String(response?.block_reason||response?.status||"keine Antwort").slice(0,110));
   error.code="opera_preview_blocked";throw error;
 }
 const layer=response?.layers?.[0];
 if(response.preview_only!==true||response.raster_approved!==false
   ||response.scientific_status!=="UNVERIFIED / ENTWICKLUNGSVORSCHAU"
   ||response.preview_orientation!==orientation||response.correlation_id!==correlationId
   ||response.cache_policy!=="no-store"||response.max_age_seconds!==900
   ||!Array.isArray(response.layers)||response.layers.length!==1
   ||!Array.isArray(response.tile_urls)||response.tile_urls.length!==1
   ||layer?.provider_id!=="opera"||layer?.product_id!=="RATE"
   ||layer?.render_mode!=="raster_tile"||layer?.tile_format!=="image/png"
   ||layer?.orientation_hypothesis!==orientation||layer?.quality_status!=="UNVERIFIED"
   ||layer?.nodata_handling!=="transparent_alpha_zero"
   ||layer?.tile_url!==response.tile_urls[0]||!TEMPLATE.test(layer.tile_url)
   ||!layer.tile_url.includes("/"+orientation+"/"))
   throw new TypeError("OPERA-Vorschauvertrag abgelehnt");
 return Object.freeze({template:layer.tile_url,notice:NOTICE,validAt:response.valid_at,
   source:"opera/RATE",orientation,scientificStatus:response.scientific_status});
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
   ||!String(response.headers.get("x-weatherrouter-scientific-status")||"").toLowerCase().includes("unverified")){
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
export function mountOperaDiagnosticPane({Leaflet,map,response,correlationId,orientation="north_first",opacity=0.7,
 accessToken,fetchImpl=fetch,documentRef=document,URLRef=URL}={}){
 const approved=validateOperaDiagnosticResponse(response,correlationId,orientation);
 if(!Number.isFinite(opacity)||opacity<0||opacity>1)throw new RangeError("Ungültige Transparenz");
 if(!Leaflet?.GridLayer?.extend||!map?.addLayer||typeof accessToken!=="string")
   throw new TypeError("Diagnostic map and access token required");
 let disposed=false;
 const controllers=new Set();
 const urls=new Set();
 const metrics={requested:0,loaded:0,failed:0,mounted:0,pending:0,http_statuses:{},last_error:null};
 const validMs=Date.parse(approved.validAt);
 if(!Number.isFinite(validMs)||validMs>Date.now()||Date.now()-validMs>=900000)
   throw new Error("opera_diagnostic_expired");
 const updateStatus=()=>{
   if(disposed)return;
   const age=Math.max(0,Math.floor((Date.now()-validMs)/60000));
   watermark.textContent="OPERA · "+approved.orientation+" · "+approved.validAt+" UTC · UNGEPRÜFT · "+age+" Min. · "+(
      metrics.loaded?"PNG geladen: "+metrics.loaded:
      metrics.pending>0?"Lade OPERA: "+metrics.loaded+" fertig · "+metrics.pending+" offen":
      metrics.failed?"Keine gültigen Kacheln":"Aktiv");
 };
 const expiry=setTimeout(()=>{if(!disposed)closePane();},Math.max(1,validMs+900000-Date.now()));
 const ageRefresh=setInterval(()=>updateStatus(),30000);
 const Pane=Leaflet.GridLayer.extend({
   createTile(coords,done){
     const image=documentRef.createElement("img");
     image.alt="";
      image.style.visibility="hidden";
     image.width=256;image.height=256;
     const controller=new AbortController();
     controllers.add(controller);
     metrics.requested++;metrics.pending++;updateStatus();
     fetchOperaDiagnosticPng({
       template:approved.template,tile:coords,token:accessToken,
       fetchImpl,signal:controller.signal
     }).then(blob=>{
       if(disposed||controller.signal.aborted)return;
       const objectUrl=URLRef.createObjectURL(blob);
       urls.add(objectUrl);
       image.src=objectUrl;
       image.onload=()=>{metrics.loaded++;metrics.mounted++;metrics.pending=Math.max(0,metrics.pending-1);image.style.visibility="visible";updateStatus();done(null,image);};
       image.onerror=()=>{metrics.failed++;metrics.pending=Math.max(0,metrics.pending-1);metrics.last_error="diagnostic_png_decode_failed";updateStatus();done(new Error("diagnostic_png_decode_failed"),image);};
     }).catch(error=>{if(!disposed){metrics.failed++;metrics.pending=Math.max(0,metrics.pending-1);if(Number.isInteger(error?.httpStatus)){const code=String(error.httpStatus);metrics.http_statuses[code]=(metrics.http_statuses[code]||0)+1;}metrics.last_error=String(error?.message||"opera_tile_failed").slice(0,80);updateStatus();done(error,image);}})
       .finally(()=>controllers.delete(controller));
     return image;
   }
 });
 const layer=new Pane({tileSize:256,opacity,updateWhenIdle:true});
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
     clearInterval(ageRefresh);
     for(const controller of controllers)controller.abort();
     controllers.clear();
     map.removeLayer(layer);
     for(const url of urls)URLRef.revokeObjectURL(url);
     urls.clear();
     watermark.remove();
   }
 return {notice:NOTICE,layer,validAt:approved.validAt,orientation,metrics,close:closePane,
   setOpacity(value){if(!Number.isFinite(value)||value<0||value>1)throw new RangeError("Ungültige Transparenz");opacity=value;if(metrics.pending===0&&metrics.loaded>0)layer.setOpacity(value);},
   get active(){return !disposed;}};
}

/** Explicit single-use diagnostic request; never activates normal precipitation. */
export async function requestOperaDiagnosticPane({callWS,Leaflet,map,viewport,focus,
 accessToken,correlationId,orientation="north_first",opacity=0.7,fetchImpl=fetch,documentRef=document,URLRef=URL}={}){
 if(typeof callWS!=="function"||typeof correlationId!=="string"||!correlationId)
   throw new TypeError("Authorized explicit diagnostic request required");
 const request=buildRasterMosaicV2Request({
   viewport,focus,correlationId,maxLayers:1,maxTileRequests:16,
   maxDataAgeSeconds:900
 });
 if(!ORIENTATIONS.has(orientation))throw new TypeError("Ungültige OPERA-Orientierung");
 request.source_request={provider_id:"opera",product_id:"RATE",diagnostic:true,preview_orientation:orientation};
 const response=await callWS(request);
 const ready=validateOperaDiagnosticResponse(response,correlationId,orientation);
 if(!ready)throw new Error("Invalid diagnostic authorization");
 return mountOperaDiagnosticPane({
   Leaflet,map,response,correlationId,orientation,opacity,accessToken,fetchImpl,documentRef,URLRef
 });
}

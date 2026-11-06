/*
 * OPERA RATE: explicit administrator-only DEV diagnostic tile adapter.
 * Not wired to the production precipitation layer or automatic provider routing.
 * No caching, URL tokens, or scientific raster approval.
 */
import {buildRasterMosaicV2Request} from "./raster-mosaic-consumer.js?v=411147r1";

const TEMPLATE=/^\/api\/weather_router\/opera_preview\/RATE\/(20\d{6}T\d{6}Z)\/(north_first|south_first)\/\{z\}\/\{x\}\/\{y\}\.png$/;
const NOTICE="OPERA RATE · isolierte Originaldiagnose · Einzelbild nicht für reguläre Bereitstellung zugelassen";
const ORIENTATIONS=new Set(["north_first"]);

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
   ||response.cache_policy!=="no-store"||(!Number.isInteger(response.max_age_seconds)||response.max_age_seconds<=0)
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
   source:"opera/RATE",orientation,maxAgeSeconds:response.max_age_seconds,ageStatus:response.preview_age_status==="stale"?"stale":"current",scientificStatus:response.scientific_status});
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
 accessToken,fetchImpl=fetch,documentRef=document,URLRef=URL,onLifecycle=()=>{}}={}){
 const approved=validateOperaDiagnosticResponse(response,correlationId,orientation);
 if(!Number.isFinite(opacity)||opacity<0||opacity>1)throw new RangeError("Ungültige Transparenz");
 if(!Leaflet?.GridLayer?.extend||!map?.addLayer||typeof accessToken!=="string")
   throw new TypeError("Diagnostic map and access token required");
 const emit=(event,details={})=>{try{onLifecycle(event,{valid_at:approved.validAt,...details});}catch(_){}};
 let disposed=false;
 const controllers=new Set();
 const retryTimers=new Set();
 let authRejected=false;
 const urls=new Set();
 const metrics={requested:0,loaded:0,failed:0,mounted:0,pending:0,http_statuses:{},last_error:null};
 const validMs=Date.parse(approved.validAt);
 if(!Number.isFinite(validMs))throw new Error("opera_diagnostic_invalid_valid_at");
 const updateStatus=()=>{
   if(disposed)return;
   const age=Math.max(0,Math.floor((Date.now()-validMs)/60000));
   watermark.textContent="OPERA · "+approved.orientation+" · "+approved.validAt+" UTC · UNGEPRÜFT · "+age+" Min. · "+(
      metrics.loaded?"PNG geladen: "+metrics.loaded:
      metrics.pending>0?"Lade OPERA: "+metrics.loaded+" fertig · "+metrics.pending+" offen":
      metrics.failed?"Keine gültigen Kacheln":"Aktiv");
   if(approved.ageStatus==="stale"){
     const warning=documentRef.createElement("span");
     warning.textContent=" ⚠️ 🕒";
     warning.title="OPERA Daten veraltet";
     warning.setAttribute("aria-label","OPERA Daten veraltet");
     warning.style.cssText="pointer-events:auto;cursor:help";
     watermark.appendChild(warning);
   }
 };
 // No client-side deadline; WR remains authoritative for validity.
 const ageRefresh=setInterval(()=>updateStatus(),30000);
 const Pane=Leaflet.GridLayer.extend({
   createTile(coords,done){
     const image=documentRef.createElement("img");
     if(authRejected){done(new Error("opera_diagnostic_auth_revoked"),image);return image;}
     image.alt="";
      image.style.visibility="hidden";
     image.width=256;image.height=256;
     const controller=new AbortController();
     controllers.add(controller);
     metrics.requested++;metrics.pending++;updateStatus();
     // General tile invariant: keep successful tiles and retry only this failed
     // coordinate. Never discard sibling tiles or restart a whole cycle for 503.
     let retries=0;
     const retry=(error)=>{
       if(disposed||controller.signal.aborted)return;
       if(error.httpStatus===401||error.httpStatus===403){
         authRejected=true;for(const pending of controllers)pending.abort();
         metrics.failed++;metrics.pending=Math.max(0,metrics.pending-1);
         controllers.delete(controller);
         emit("tile_auth_revoked",{http_status:error.httpStatus});
         done(error,image);return;
       }
       retries++;
       metrics.retry_attempts=(metrics.retry_attempts||0)+1;
       metrics.last_error=String(error?.message||"opera_tile_retry").slice(0,80);
       if(Number.isInteger(error?.httpStatus)){
         const code=String(error.httpStatus);
         metrics.http_statuses[code]=(metrics.http_statuses[code]||0)+1;
       }
       emit("tile_retry_scheduled",{z:coords.z,x:coords.x,y:coords.y,attempt:retries,http_status:error?.httpStatus||null});
       updateStatus();
       // Retry pacing is transport backpressure, never a data-age deadline.
       const delay=Math.min(5000,250*Math.pow(2,Math.min(retries-1,5)));
       const timer=setTimeout(()=>{retryTimers.delete(timer);void attempt();},delay);
       retryTimers.add(timer);
     };
     const attempt=async()=>{
       if(disposed||controller.signal.aborted)return;
       try{
         const blob=await fetchOperaDiagnosticPng({template:approved.template,tile:coords,
           token:accessToken,fetchImpl,signal:controller.signal});
         if(disposed||controller.signal.aborted)return;
         const objectUrl=URLRef.createObjectURL(blob);urls.add(objectUrl);
         image.onload=()=>{
           if(disposed||controller.signal.aborted)return;
           metrics.loaded++;metrics.mounted++;
           if(metrics.loaded===1)emit("first_png_decoded",{requested:metrics.requested,loaded:metrics.loaded,pending:metrics.pending});
           metrics.pending=Math.max(0,metrics.pending-1);controllers.delete(controller);
           image.style.visibility="visible";updateStatus();done(null,image);
         };
         image.onerror=()=>{URLRef.revokeObjectURL(objectUrl);urls.delete(objectUrl);retry(new Error("diagnostic_png_decode_failed"));};
         image.src=objectUrl;
       }catch(error){retry(error);}
     };
     void attempt();
     return image;
   }
 });
 // Previously loaded tiles remain visible during zoom transitions.
 // Each individual tile remains hidden until its image onload succeeds.
 const layer=new Pane({tileSize:256,opacity,updateWhenIdle:true});
 const watermark=documentRef.createElement("div");
 watermark.textContent=NOTICE;
 watermark.setAttribute("role","status");
 watermark.style.cssText="position:absolute;left:8px;bottom:8px;z-index:10000;background:#280c08;color:#fff;border:2px solid #dc9b43;padding:6px;font:bold 13px sans-serif;pointer-events:none";
 const container=map.getContainer();
 container.appendChild(watermark);
 map.addLayer(layer);
 emit("pane_mounted",{max_age_seconds:approved.maxAgeSeconds,opacity});
 updateStatus();
 function closePane(reason="explicit_close"){
     if(disposed)return;
     emit("pane_closed",{reason,loaded:metrics.loaded,pending:metrics.pending,failed:metrics.failed});
     disposed=true;

     clearInterval(ageRefresh);
     for(const timer of retryTimers)clearTimeout(timer);
     retryTimers.clear();
     for(const controller of controllers)controller.abort();
     controllers.clear();
     map.removeLayer(layer);
     for(const url of urls)URLRef.revokeObjectURL(url);
     urls.clear();
     watermark.remove();
   }
 return {notice:NOTICE,layer,validAt:approved.validAt,orientation,metrics,close:closePane,
   // Rendering gate: never remove the previous WR-authorized layer merely
   // because a new Leaflet layer was constructed. Wait for PNG onload.
   async waitUntilReady(){
     // Only switch when every requested PNG is decoded successfully.
     while(!disposed){
       if(authRejected)throw new Error("opera_diagnostic_auth_revoked");
       if(metrics.requested>0&&metrics.pending===0){
         const ready=metrics.loaded>0&&metrics.failed===0;
         emit(ready?"png_ready":"png_incomplete",{loaded:metrics.loaded,failed:metrics.failed,pending:metrics.pending});
         return ready;
       }
       await new Promise(resolve=>setTimeout(resolve,150));
     }
     return false;
   },
   setOpacity(value){if(!Number.isFinite(value)||value<0||value>1)throw new RangeError("Ungültige Transparenz");opacity=value;layer.setOpacity(value);emit("opacity_changed",{opacity:value});},
   get active(){return !disposed;}};
}

/** Explicit single-use diagnostic request; never activates normal precipitation. */
export async function requestOperaDiagnosticPane({callWS,Leaflet,map,viewport,focus,
 accessToken,correlationId,orientation="north_first",opacity=0.7,fetchImpl=fetch,documentRef=document,URLRef=URL,onLifecycle=()=>{}}={}){
 if(typeof callWS!=="function"||typeof correlationId!=="string"||!correlationId)
   throw new TypeError("Authorized explicit diagnostic request required");
 const request=buildRasterMosaicV2Request({
   viewport,focus,correlationId,maxLayers:1,maxTileRequests:16
 });
 if(!ORIENTATIONS.has(orientation))throw new TypeError("Ungültige OPERA-Orientierung");
 request.source_request={provider_id:"opera",product_id:"RATE",diagnostic:true,preview_orientation:orientation};
 // Explicit diagnostic contract: WeatherRouter alone owns freshness policy.
 const response=await callWS(request);
 const ready=validateOperaDiagnosticResponse(response,correlationId,orientation);
 if(!ready)throw new Error("Invalid diagnostic authorization");
 // Never fan out PNG requests with a missing, expired or revoked HA token:
 // an invalid Bearer token is counted as a failed login by HA's IP-ban policy.
 // A single same-origin authentication probe must succeed before GridLayer
 // can schedule any of its parallel requests.
 if(typeof accessToken!=="string"||!accessToken)
   throw new Error("opera_diagnostic_missing_auth");
 const authProbe=await fetchImpl("/api/",{
   method:"GET",headers:{Authorization:"Bearer "+accessToken,Accept:"application/json"},
   credentials:"omit",cache:"no-store",redirect:"error"
 });
 if(!authProbe.ok){
   const error=new Error("opera_diagnostic_auth_preflight_failed");
   error.httpStatus=Number.isInteger(authProbe.status)?authProbe.status:0;
   error.code="opera_auth_preflight_http_"+String(error.httpStatus);
   throw error;
 }
 return mountOperaDiagnosticPane({
   Leaflet,map,response,correlationId,orientation,opacity,accessToken,fetchImpl,documentRef,URLRef,onLifecycle
 });
}

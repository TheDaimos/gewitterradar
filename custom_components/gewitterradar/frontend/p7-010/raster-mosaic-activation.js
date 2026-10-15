/*
 * P7-010 opt-in raster promotion guard, independent of Leaflet internals.
 * Keep the installed V1 layer untouched until a V2 tile actually painted.
 * Never equate a WS descriptor or an empty Canvas tile with readiness.
 */
export function promotePreparedRasterMosaic({
 map,layer,hasPainted,isCurrent=()=>true,timeoutMs=9000
}={}){
 if(!map||typeof map.addLayer!=="function"||
   !layer||typeof layer.on!=="function"||typeof layer.off!=="function"||
   typeof hasPainted!=="function"||typeof isCurrent!=="function"||
   !Number.isInteger(timeoutMs)||timeoutMs<100||timeoutMs>15000)
   throw new TypeError("Invalid bounded raster promotion");
 return new Promise(resolve=>{
   let settled=false,timer=null;
   const cleanup=()=>{
     if(timer!==null)clearTimeout(timer);
     layer.off("tileload",onTile);
     layer.off("load",onLoad);
     layer.off("tileerror",onError);
   };
   const finish=success=>{
     if(settled)return;
     settled=true;cleanup();
     let acceptable=false;
     try{acceptable=success&&hasPainted()&&isCurrent();}catch(_){}
     if(!acceptable)try{layer.remove?.();}catch(_){}
     resolve(Boolean(acceptable));
   };
   const onTile=()=>{if(hasPainted())finish(true);};
   const onLoad=()=>finish(hasPainted());
   const onError=()=>{}; // Other tiles can still succeed independently.
   layer.on("tileload",onTile);
   layer.on("load",onLoad);
   layer.on("tileerror",onError);
   timer=setTimeout(()=>finish(false),timeoutMs);
   try{map.addLayer(layer);}
   catch(_){finish(false);}
 });
}

import { registerModule } from "../core/registry.js?v=41108r1";

export const MODULE_META=Object.freeze({
  id:"ui.project-hub",
  version:"1.0.0",
  group:"Oberfläche",
  function:"Daimos Project Hub",
  subfunctions:["Signatur-Einstieg","Health-Probe","Online-/Offline-Auflösung","Lokale Rückfallansicht"],
  file:"modules/ui/project-hub.js"
});
const PROJECT_HUB_BASE_URL=new URL("../../project-hub/",import.meta.url);
const PROJECT_HUB_CONFIG_URL=new URL("project-hub-config.json",PROJECT_HUB_BASE_URL);
const DEFAULT_FALLBACK_PATH="offline/index.html";
const DEFAULT_PROBE_TIMEOUT_MS=2500;
const isHttpsUrl=(value)=>{try{return new URL(value).protocol==="https:";}catch{return false;}};
const isLocalFallbackPath=(value)=>{if(typeof value!=="string")return false;const path=value.trim();return !!path&&!path.startsWith("/")&&!path.startsWith("//")&&!/^[a-z][a-z0-9+.-]*:/i.test(path);};
const normalizedTimeout=(value)=>Number.isFinite(value)?Math.max(500,Math.min(10000,Number(value))):DEFAULT_PROBE_TIMEOUT_MS;
export function normalizeProjectHubConfig(value){
  if(!value||typeof value!=="object")return null;
  return Object.freeze({
    schema_version:Number(value.schema_version)||1,
    runtime_version:String(value.runtime_version||"0.1.0-pre"),
    project_hub_url:typeof value.project_hub_url==="string"?value.project_hub_url.trim():"",
    health_asset_url:typeof value.health_asset_url==="string"?value.health_asset_url.trim():"",
    fallback_path:isLocalFallbackPath(value.fallback_path)?value.fallback_path.trim():DEFAULT_FALLBACK_PATH,
    probe_timeout_ms:normalizedTimeout(value.probe_timeout_ms),
    open_mode:"external"
  });
}
async function loadProjectHubConfig(){try{const response=await fetch(PROJECT_HUB_CONFIG_URL.href,{cache:"no-store",credentials:"same-origin"});if(!response.ok)return null;return normalizeProjectHubConfig(await response.json());}catch{return null;}}
function probeImage(url,timeoutMs){return new Promise((resolve)=>{const image=new Image();let done=false;const finish=(ok)=>{if(done)return;done=true;clearTimeout(timer);image.onload=null;image.onerror=null;resolve(ok);};const timer=setTimeout(()=>finish(false),timeoutMs);image.onload=()=>finish(true);image.onerror=()=>finish(false);const separator=url.includes("?")?"&":"?";image.src=`${url}${separator}project_hub_probe=${Date.now()}`;});}
export async function resolveProjectHub(config){
  const normalized=normalizeProjectHubConfig(config),fallback=normalized?.fallback_path||DEFAULT_FALLBACK_PATH,url=normalized?.project_hub_url||"",health=normalized?.health_asset_url||"";
  if(!normalized||!url||!health||!isHttpsUrl(url)||!isHttpsUrl(health))return Object.freeze({mode:"offline",target:fallback,reason:"not_configured"});
  const reachable=await probeImage(health,normalized.probe_timeout_ms);
  return Object.freeze(reachable?{mode:"online",target:url,reason:"reachable"}:{mode:"offline",target:fallback,reason:"unreachable"});
}
export function openResolvedProjectHub(result){
  if(!result?.target)return false;
  const target=result.mode==="online"?result.target:new URL(isLocalFallbackPath(result.target)?result.target:DEFAULT_FALLBACK_PATH,PROJECT_HUB_BASE_URL).href;
  if(result.mode==="online"&&!isHttpsUrl(target))return false;
  window.open(target,"_blank","noopener,noreferrer");
  return true;
}
function activateSignature(card){
  const signature=card?.shadow?.querySelector?.(".settings-signature-wrap");
  if(!signature||signature.dataset.projectHubBound==="1")return false;
  signature.dataset.projectHubBound="1";signature.removeAttribute("aria-hidden");signature.setAttribute("role","button");signature.setAttribute("tabindex","0");signature.setAttribute("aria-label","Daimos Project Hub öffnen");signature.setAttribute("title","Daimos Project Hub");signature.style.cursor="pointer";signature.style.touchAction="manipulation";signature.style.webkitTapHighlightColor="transparent";
  const open=(event)=>{event?.preventDefault?.();event?.stopPropagation?.();void card._openProjectHub?.();};
  signature.addEventListener("click",open);signature.addEventListener("keydown",(event)=>{if(event.key!=="Enter"&&event.key!==" ")return;open(event);});return true;
}
export function installProjectHub(CardClass){
  registerModule(MODULE_META);const proto=CardClass?.prototype;if(!proto)throw new TypeError("ui.project-hub requires a card class");if(proto.__projectHubInstalled)return CardClass;
  const originalBuildSkeleton=proto._buildSkeleton;if(typeof originalBuildSkeleton!=="function")throw new TypeError("ui.project-hub requires ui.skeleton before installation");
  Object.defineProperties(proto,{
    __projectHubInstalled:{value:true,configurable:false,enumerable:false,writable:false},
    _bindProjectHubSignature:{configurable:true,writable:true,value:function(){return activateSignature(this);}},
    _openProjectHub:{configurable:true,writable:true,value:async function(){if(this._projectHubOpening)return false;this._projectHubOpening=true;try{return openResolvedProjectHub(await resolveProjectHub(await loadProjectHubConfig()));}catch{return openResolvedProjectHub({mode:"offline",target:DEFAULT_FALLBACK_PATH,reason:"error"});}finally{this._projectHubOpening=false;}}},
    _buildSkeleton:{configurable:true,writable:true,value:function(...args){const result=originalBuildSkeleton.apply(this,args);this._bindProjectHubSignature();return result;}}
  });return CardClass;
}

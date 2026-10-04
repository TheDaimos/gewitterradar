import { registerModule } from "../core/registry.js?v=41108r1";
export const MODULE_META=Object.freeze({
  id:"ui.project-hub",version:"1.1.10",group:"Oberfläche",function:"Daimos Project Hub",
  subfunctions:["Signatur-Einstieg","Haupttitel-Einstieg","Host-Popup","Health-Probe","Online-/Offline-Status","Lokale RC12-Runtime"],
  file:"modules/ui/project-hub.js"
});
const PROJECT_HUB_BASE_URL=new URL("../../project-hub/",import.meta.url);
const PROJECT_HUB_CONFIG_URL=new URL("project-hub-config.json",PROJECT_HUB_BASE_URL);
const DEFAULT_FALLBACK_PATH="offline/index.html",DEFAULT_PROBE_TIMEOUT_MS=2500,POPUP_VERSION="0.2.0-rc12";
const isHttpsUrl=v=>{try{return new URL(v).protocol==="https:";}catch{return false;}};
const isLocalFallbackPath=v=>{if(typeof v!=="string")return false;const p=v.trim();return !!p&&!p.startsWith("/")&&!p.startsWith("//")&&!/^[a-z][a-z0-9+.-]*:/i.test(p);};
const normalizedTimeout=v=>Number.isFinite(v)?Math.max(500,Math.min(10000,Number(v))):DEFAULT_PROBE_TIMEOUT_MS;
export function normalizeProjectHubConfig(v){
  if(!v||typeof v!=="object")return null;
  return Object.freeze({schema_version:Number(v.schema_version)||1,runtime_version:String(v.runtime_version||POPUP_VERSION),
    project_hub_url:typeof v.project_hub_url==="string"?v.project_hub_url.trim():"",
    health_asset_url:typeof v.health_asset_url==="string"?v.health_asset_url.trim():"",
    fallback_path:isLocalFallbackPath(v.fallback_path)?v.fallback_path.trim():DEFAULT_FALLBACK_PATH,
    probe_timeout_ms:normalizedTimeout(v.probe_timeout_ms),open_mode:String(v.open_mode||"host-popup")});
}
async function loadProjectHubConfig(){try{const r=await fetch(PROJECT_HUB_CONFIG_URL.href,{cache:"no-store",credentials:"same-origin"});if(!r.ok)return null;return normalizeProjectHubConfig(await r.json());}catch{return null;}}
function probeImage(url,timeoutMs){return new Promise(resolve=>{const image=new Image();let done=false;const finish=ok=>{if(done)return;done=true;clearTimeout(timer);image.onload=null;image.onerror=null;resolve(ok);};const timer=setTimeout(()=>finish(false),timeoutMs);image.onload=()=>finish(true);image.onerror=()=>finish(false);image.src=`${url}${url.includes("?")?"&":"?"}project_hub_probe=${Date.now()}`;});}
export async function resolveProjectHub(config){const n=normalizeProjectHubConfig(config),fallback=n?.fallback_path||DEFAULT_FALLBACK_PATH,url=n?.project_hub_url||"",health=n?.health_asset_url||"";if(!n||!url||!health||!isHttpsUrl(url)||!isHttpsUrl(health))return Object.freeze({mode:"offline",target:fallback,reason:"not_configured"});const ok=await probeImage(health,n.probe_timeout_ms);return Object.freeze(ok?{mode:"online",target:url,reason:"reachable"}:{mode:"offline",target:fallback,reason:"unreachable"});}
function localViewUrl(status="checking",fallback=DEFAULT_FALLBACK_PATH){const safe=isLocalFallbackPath(fallback)?fallback:DEFAULT_FALLBACK_PATH,url=new URL(safe,PROJECT_HUB_BASE_URL);url.searchParams.set("v",POPUP_VERSION);if(status==="online"||status==="offline")url.searchParams.set("status",status);return url.href;}
function popupViewport(){const vv=window.visualViewport;return {width:Math.max(280,Math.round(vv?.width||window.innerWidth||760)),height:Math.max(240,Math.round(vv?.height||window.innerHeight||800))};}
function applyPopupGeometry(panel,overlay){const {width,height}=popupViewport(),edge=width>=700&&height>=700?6:4,panelWidth=Math.min(780,Math.max(280,width-edge*2)),panelHeight=Math.min(1080,Math.max(240,height-edge*2));overlay.style.padding=`${edge}px`;panel.style.width=`${panelWidth}px`;panel.style.height=`${panelHeight}px`;panel.style.maxHeight=`${panelHeight}px`;}
function closePopup(card){if(card?._projectHubResize){window.removeEventListener("resize",card._projectHubResize);window.visualViewport?.removeEventListener?.("resize",card._projectHubResize);}card?._projectHubOverlay?.remove?.();if(card){card._projectHubOverlay=null;card._projectHubFrame=null;card._projectHubClose=null;card._projectHubResize=null;}}
function showPopup(card,status="checking",fallback=DEFAULT_FALLBACK_PATH){
  if(card._projectHubOverlay?.isConnected){if(card._projectHubFrame)card._projectHubFrame.src=localViewUrl(status,fallback);card._projectHubResize?.();card._projectHubClose?.focus?.();return true;}
  const overlay=document.createElement("div");overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-label","Daimos Project Hub");
  Object.assign(overlay.style,{position:"fixed",inset:"0",zIndex:"2147483647",display:"grid",placeItems:"center",padding:"4px",background:"rgba(2,8,14,.76)",backdropFilter:"blur(5px)",overscrollBehavior:"contain"});
  const panel=document.createElement("div");Object.assign(panel.style,{position:"relative",width:"min(780px,calc(100vw - 8px))",height:"calc(100dvh - 8px)",maxHeight:"1080px",borderRadius:"20px",overflow:"hidden",background:"#08111b",boxShadow:"0 24px 80px rgba(0,0,0,.58),0 0 0 1px rgba(233,187,102,.28)"});
  const frame=document.createElement("iframe");frame.src=localViewUrl(status,fallback);frame.title="Daimos Project Hub";frame.setAttribute("loading","eager");frame.setAttribute("referrerpolicy","no-referrer");Object.assign(frame.style,{display:"block",width:"100%",height:"100%",border:"0",background:"#08111b"});
  const close=document.createElement("button");close.type="button";close.setAttribute("aria-label","Project Hub schließen");close.textContent="×";Object.assign(close.style,{position:"absolute",top:"10px",right:"10px",zIndex:"2",width:"40px",height:"40px",borderRadius:"50%",border:"1px solid rgba(233,187,102,.48)",background:"rgba(8,17,27,.92)",color:"#f3d49b",fontSize:"28px",lineHeight:"34px",cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,.35)"});
  close.addEventListener("click",()=>closePopup(card));overlay.addEventListener("pointerdown",e=>{if(e.target===overlay)closePopup(card);});overlay.addEventListener("keydown",e=>{if(e.key==="Escape"){e.preventDefault();closePopup(card);}});
  panel.append(frame,close);overlay.append(panel);document.body.append(overlay);card._projectHubOverlay=overlay;card._projectHubFrame=frame;card._projectHubClose=close;const resize=()=>applyPopupGeometry(panel,overlay);card._projectHubResize=resize;window.addEventListener("resize",resize,{passive:true});window.visualViewport?.addEventListener?.("resize",resize,{passive:true});resize();queueMicrotask(()=>close.focus());return true;
}
function activateSignature(card){const sig=card?.shadow?.querySelector?.(".settings-signature-wrap");if(!sig||sig.dataset.projectHubBound==="1")return false;sig.dataset.projectHubBound="1";sig.removeAttribute("aria-hidden");sig.setAttribute("role","button");sig.setAttribute("tabindex","0");sig.setAttribute("aria-label","Daimos Project Hub öffnen");sig.setAttribute("title","Daimos Project Hub");sig.style.cursor="pointer";sig.style.touchAction="manipulation";sig.style.webkitTapHighlightColor="transparent";const open=e=>{e?.preventDefault?.();e?.stopPropagation?.();void card._openProjectHub?.();};sig.addEventListener("click",open);sig.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;open(e);});return true;}
function activateMainTitle(card){const title=card?.shadow?.querySelector?.(".topbar .brand .title > span:first-child");if(!title||title.dataset.projectHubBound==="1")return false;title.dataset.projectHubBound="1";title.setAttribute("role","button");title.setAttribute("tabindex","0");title.setAttribute("aria-label","Daimos Project Hub öffnen");title.setAttribute("title","Daimos Project Hub");title.style.cursor="pointer";title.style.touchAction="manipulation";title.style.webkitTapHighlightColor="transparent";const open=e=>{e?.preventDefault?.();e?.stopPropagation?.();void card._openProjectHub?.();};title.addEventListener("click",open);title.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;open(e);});return true;}
export function installProjectHub(CardClass){registerModule(MODULE_META);const proto=CardClass?.prototype;if(!proto)throw new TypeError("ui.project-hub requires a card class");if(proto.__projectHubInstalled)return CardClass;const originalBuildSkeleton=proto._buildSkeleton;if(typeof originalBuildSkeleton!=="function")throw new TypeError("ui.project-hub requires ui.skeleton before installation");
  Object.defineProperties(proto,{__projectHubInstalled:{value:true,configurable:false,enumerable:false,writable:false},
    _bindProjectHubSignature:{configurable:true,writable:true,value:function(){return activateSignature(this);}},
    _bindProjectHubMainTitle:{configurable:true,writable:true,value:function(){return activateMainTitle(this);}},
    _closeProjectHub:{configurable:true,writable:true,value:function(){closePopup(this);}},
    _openProjectHub:{configurable:true,writable:true,value:async function(){showPopup(this,"checking",DEFAULT_FALLBACK_PATH);if(this._projectHubOpening)return true;this._projectHubOpening=true;try{const config=await loadProjectHubConfig();const resolved=await resolveProjectHub(config);if(this._projectHubFrame?.isConnected)this._projectHubFrame.src=localViewUrl(resolved.mode,config?.fallback_path||DEFAULT_FALLBACK_PATH);return true;}catch{if(this._projectHubFrame?.isConnected)this._projectHubFrame.src=localViewUrl("offline",DEFAULT_FALLBACK_PATH);return true;}finally{this._projectHubOpening=false;}}},
    _buildSkeleton:{configurable:true,writable:true,value:function(...args){const result=originalBuildSkeleton.apply(this,args);this._bindProjectHubSignature();this._bindProjectHubMainTitle();return result;}}});
  return CardClass;
}

import { defineModule } from "./runtime.js?v=41104r1";

export const MODULE_META=Object.freeze({
  id:"core.update-watch",
  version:"1.0.0",
  group:"Kern",
  function:"Frontend-Aktualisierung",
  subfunctions:["Installierten Stand prüfen","Aktualisierungshinweis","Kontrollierte Vollneuladung"],
  file:"modules/core/update-watch.js"
});

const RUNTIME_MANIFEST_URL=new URL("../../assets/gewitterradar-runtime-manifest.json",import.meta.url).href;
const CHECK_INTERVAL_MS=60000;
const AUTO_RELOAD_DELAY_MS=1800;
const AUTO_RELOAD_GUARD_PREFIX="gewitterradar:runtime-auto-reload:";

export const installUpdateWatch=defineModule(MODULE_META,(deps)=>{
  const {APPLICATION_META}=deps;
  return {
    _runtimeUpdateWatchState(){
      if(!this.__runtimeUpdateWatchState)this.__runtimeUpdateWatchState={timer:null,autoReloadTimer:null,visibilityHandler:null,pending:false,last:null};
      return this.__runtimeUpdateWatchState;
    },

    async _checkInstalledRuntime({force=false}={}){
      const state=this._runtimeUpdateWatchState();
      if(state.pending&&!force)return state.last;
      if(typeof fetch!=="function")return null;
      state.pending=true;
      try{
        const url=new URL(RUNTIME_MANIFEST_URL);
        url.searchParams.set("_gr_update_probe",String(Date.now()));
        const response=await fetch(url.href,{cache:"no-store",credentials:"same-origin"});
        if(!response.ok)throw new Error("HTTP "+response.status);
        const installed=await response.json();
        const mismatch=Boolean(
          installed?.productVersion&&String(installed.productVersion)!==String(APPLICATION_META.version)||
          installed?.build&&String(installed.build)!==String(APPLICATION_META.build)||
          installed?.runtimeRevision&&String(installed.runtimeRevision)!==String(APPLICATION_META.runtimeRevision)||
          installed?.moduleSetId&&String(installed.moduleSetId)!==String(APPLICATION_META.moduleSetId)
        );
        state.last={checkedAt:Date.now(),mismatch,installed};
        if(mismatch)this._showInstalledRuntimeChanged(installed);
        else this._hideInstalledRuntimeChanged();
        return state.last;
      }catch(error){
        state.last={checkedAt:Date.now(),mismatch:false,error:error instanceof Error?error.message:String(error)};
        return state.last;
      }finally{state.pending=false;}
    },

    _runtimeUpdateTargetKey(installed){
      return String(installed?.moduleSetId||installed?.runtimeRevision||installed?.build||installed?.productVersion||"").trim();
    },

    _scheduleInstalledRuntimeReload(installed){
      const state=this._runtimeUpdateWatchState();
      if(state.autoReloadTimer||typeof window==="undefined")return;
      if(typeof document!=="undefined"&&document.visibilityState==="hidden")return;
      const target=this._runtimeUpdateTargetKey(installed);if(!target)return;
      const guard=AUTO_RELOAD_GUARD_PREFIX+target;
      try{if(sessionStorage.getItem(guard)==="1")return;}catch(_error){}
      state.autoReloadTimer=setTimeout(()=>{
        state.autoReloadTimer=null;
        try{sessionStorage.setItem(guard,"1");}catch(_error){}
        this._reloadInstalledRuntime();
      },AUTO_RELOAD_DELAY_MS);
    },

    _showInstalledRuntimeChanged(installed){
      const root=this.shadow;
      if(!root)return;
      let banner=root.getElementById("gewitterradar-runtime-update-banner");
      if(!banner){
        banner=document.createElement("div");
        banner.id="gewitterradar-runtime-update-banner";
        banner.setAttribute("role","status");
        banner.style.cssText="display:flex;align-items:center;gap:9px;margin:8px 10px;padding:8px 10px;border:1px solid rgba(224,180,79,.5);border-radius:11px;background:rgba(45,34,12,.94);color:#f2dfae;font-size:11px;line-height:1.35;box-shadow:0 8px 22px rgba(0,0,0,.24)";
        const text=document.createElement("span");text.dataset.role="text";text.style.cssText="flex:1;min-width:0";
        const button=document.createElement("button");button.type="button";button.dataset.role="reload";button.textContent="↻";
        button.style.cssText="width:32px;height:30px;border-radius:9px;border:1px solid rgba(224,180,79,.55);background:rgba(224,180,79,.12);color:#f3d985;font-size:18px;font-weight:900;cursor:pointer";
        button.addEventListener("click",()=>this._reloadInstalledRuntime());
        banner.append(text,button);
        const card=root.querySelector("ha-card")||root.firstElementChild;
        if(card?.parentNode)card.parentNode.insertBefore(banner,card);else root.prepend(banner);
      }
      const loaded=APPLICATION_META.displayVersion||APPLICATION_META.version;
      const target=installed?.displayVersion||installed?.productVersion||installed?.build||installed?.moduleSetId||"";
      const phrase=this._t?.("modules.runtime_stale")||"Frontend-Neuladung erforderlich";
      const text=banner.querySelector('[data-role="text"]');
      if(text)text.textContent=target?phrase+" · "+loaded+" → "+target:phrase;
      const button=banner.querySelector('[data-role="reload"]');
      if(button){
        button.title=phrase;
        button.setAttribute("aria-label",phrase);
      }
      banner.hidden=false;
      this._scheduleInstalledRuntimeReload(installed);
    },

    _hideInstalledRuntimeChanged(){
      const state=this._runtimeUpdateWatchState();
      if(state.autoReloadTimer){clearTimeout(state.autoReloadTimer);state.autoReloadTimer=null;}
      const banner=this.shadow?.getElementById("gewitterradar-runtime-update-banner");
      if(banner)banner.hidden=true;
    },

    _reloadInstalledRuntime(){
      const button=this.shadow?.querySelector('#gewitterradar-runtime-update-banner [data-role="reload"]');
      if(button)button.disabled=true;
      try{window.location.reload();}catch(_error){try{window.location.href=window.location.href;}catch(_ignored){}}
    },

    _startRuntimeUpdateWatch(){
      const state=this._runtimeUpdateWatchState();
      if(state.timer)return;
      const check=()=>this._checkInstalledRuntime();
      setTimeout(check,2500);
      state.timer=setInterval(check,CHECK_INTERVAL_MS);
      if(typeof document!=="undefined"){
        state.visibilityHandler=()=>{if(document.visibilityState==="visible")this._checkInstalledRuntime({force:true});};
        document.addEventListener("visibilitychange",state.visibilityHandler);
      }
    },

    _stopRuntimeUpdateWatch(){
      const state=this._runtimeUpdateWatchState();
      if(state.timer){clearInterval(state.timer);state.timer=null;}
      if(state.autoReloadTimer){clearTimeout(state.autoReloadTimer);state.autoReloadTimer=null;}
      if(state.visibilityHandler&&typeof document!=="undefined")document.removeEventListener("visibilitychange",state.visibilityHandler);
      state.visibilityHandler=null;
    }
  };
});

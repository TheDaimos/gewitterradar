import { defineModule } from "../core/runtime.js?v=41110r1";

export const MODULE_META=Object.freeze({
  id:"weather.legend-overlay",
  version:"0.1.0",
  group:"Weather-Engine",
  function:"WeatherRouter-Darstellungslegende",
  subfunctions:["generisches Legendenmodell","Auto/Ein/Aus","WR-Metadaten","Bildlegenden","strukturierte Skalen","Kartenoverlay","mehrere aktive Legenden","sichere Kartenposition"],
  file:"modules/weather/legend-overlay.js"
});

const safeText=value=>typeof value==="string"&&value.trim()?value.trim():"";
const safeValueText=value=>typeof value==="number"&&Number.isFinite(value)?String(value):safeText(value);
const safeEntries=value=>Array.isArray(value)?value.map(entry=>({
  label:safeText(entry?.label),
  color:safeText(entry?.color),
  value:safeValueText(entry?.value)
})).filter(entry=>entry.label||entry.value):[];
const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));

const normalizeLegendModel=(source,input)=>{
  if(!input||typeof input!=="object")return null;
  const title=safeText(input.title)||safeText(input.label)||"WeatherRouter";
  const legendUrl=safeText(input.legendUrl);
  const entries=safeEntries(input.entries);
  if(!legendUrl&&!entries.length)return null;
  return Object.freeze({
    source:String(source||"weather-router"),
    family:safeText(input.family)||"weather",
    capability:safeText(input.capability),
    title,
    subtitle:safeText(input.subtitle),
    details:safeText(input.details),
    legendUrl,
    legendTitle:safeText(input.legendTitle)||title+" · Legende",
    unit:safeText(input.unit),
    entries,
    priority:Number.isFinite(Number(input.priority))?Number(input.priority):0,
    active:input.active!==false,
    updatedAt:Date.now()
  });
};

export const installWeatherLegendOverlay=defineModule(MODULE_META,()=>({
  _weatherLegendState(){
    if(!this.__weatherLegendState)this.__weatherLegendState={
      models:new Map(),
      resizeHandler:null,
      resizeObserver:null,
      mounted:false
    };
    return this.__weatherLegendState;
  },

  _weatherLegendMode(){
    const mode=this._weatherDisplayLegendMode?.();
    return ["auto","on","off"].includes(mode)?mode:"auto";
  },

  _weatherLegendSetModel(source,model){
    const state=this._weatherLegendState();
    const key=String(source||"weather-router");
    const normalized=normalizeLegendModel(key,model);
    if(normalized)state.models.set(key,normalized);else state.models.delete(key);
    this._weatherLegendSyncUi();
  },

  _weatherLegendClear(source){
    const state=this._weatherLegendState();
    if(source==null)state.models.clear();else state.models.delete(String(source));
    this._weatherLegendSyncUi();
  },

  _weatherLegendActiveModels(){
    return [...this._weatherLegendState().models.values()]
      .filter(model=>model.active)
      .sort((a,b)=>b.priority-a.priority||b.updatedAt-a.updatedAt||a.title.localeCompare(b.title,"de"));
  },

  _weatherLegendVisibleModels(){
    const mode=this._weatherLegendMode();
    if(mode==="off")return [];
    const active=this._weatherLegendActiveModels();
    return mode==="auto"?active.slice(0,1):active;
  },

  _weatherLegendEnsureStyle(){
    if(!this.shadow||this.shadow.getElementById("weather-legend-style"))return;
    const style=document.createElement("style");
    style.id="weather-legend-style";
    style.textContent=[
      ".weather-legend-overlay{position:absolute;z-index:710;left:50%;transform:translateX(-50%);width:min(620px,calc(100% - 20px));box-sizing:border-box;padding:7px 9px;border:1px solid rgba(231,190,96,.32);border-radius:13px;background:linear-gradient(155deg,rgba(13,17,23,.95),rgba(8,11,16,.93));box-shadow:0 12px 32px rgba(0,0,0,.44),0 0 18px rgba(219,161,51,.07);backdrop-filter:blur(13px);color:#e7ebf0;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent}",
      ".weather-legend-overlay[hidden]{display:none!important}.weather-legend-list{display:grid;gap:6px}.weather-legend-item{display:grid;grid-template-columns:minmax(92px,.7fr) minmax(120px,1.6fr) auto;align-items:center;gap:9px;min-width:0}.weather-legend-main{min-width:0}.weather-legend-title{font-size:10px;font-weight:850;color:#f1d38a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.weather-legend-subtitle{margin-top:2px;font-size:7.7px;line-height:1.25;color:#aeb7c2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".weather-legend-visual{min-width:0;display:flex;align-items:center;justify-content:center}.weather-legend-image{display:block;max-width:100%;width:auto;height:auto;max-height:34px;object-fit:contain;border-radius:4px;background:rgba(255,255,255,.90);box-shadow:inset 0 0 0 1px rgba(0,0,0,.10)}",
      ".weather-legend-entries{display:flex;align-items:flex-start;justify-content:center;gap:7px;min-width:0;overflow:hidden}.weather-legend-entry{display:grid;justify-items:center;gap:2px;min-width:0;font-size:7.2px;color:#c9d0d8}.weather-legend-swatch{width:28px;height:5px;border-radius:999px;background:var(--weather-legend-color,rgba(255,255,255,.18));box-shadow:0 0 7px color-mix(in srgb,var(--weather-legend-color,transparent) 35%,transparent)}.weather-legend-entry-label{max-width:56px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".weather-legend-side{display:flex;align-items:center;gap:6px}.weather-legend-unit{font-size:8px;font-weight:800;color:#d6c184;white-space:nowrap}.weather-legend-hide{appearance:none;width:28px;height:28px;padding:0;border:1px solid rgba(255,255,255,.10);border-radius:8px;background:rgba(255,255,255,.025);color:#d9c999;font:850 15px/1 inherit;cursor:pointer;touch-action:manipulation}.weather-legend-hide:hover{border-color:rgba(240,202,112,.42);background:rgba(145,105,31,.12)}",
      ".weather-legend-overlay.multiple{padding-block:8px}.weather-legend-overlay.multiple .weather-legend-item+.weather-legend-item{padding-top:6px;border-top:1px solid rgba(255,255,255,.07)}",
      "@media(max-width:720px){.weather-legend-overlay{width:calc(100% - 16px);padding:6px 7px;border-radius:12px}.weather-legend-item{grid-template-columns:minmax(78px,.68fr) minmax(100px,1.45fr) auto;gap:6px}.weather-legend-title{font-size:9px}.weather-legend-subtitle{font-size:6.9px}.weather-legend-image{max-height:28px}.weather-legend-unit{font-size:7.4px}.weather-legend-hide{width:30px;height:30px}.weather-legend-entry{font-size:6.7px}.weather-legend-swatch{width:23px}}",
      "@media(max-width:430px){.weather-legend-item{grid-template-columns:minmax(70px,.62fr) minmax(88px,1.35fr) auto}.weather-legend-subtitle{display:none}.weather-legend-image{max-height:25px}.weather-legend-entries{gap:4px}.weather-legend-swatch{width:18px}.weather-legend-entry-label{max-width:42px}}"
    ].join("");
    this.shadow.append(style);
  },

  _weatherLegendEnsureUi(){
    if(!this.shadow)return null;
    const card=this.shadow.getElementById("map-card");
    if(!card)return null;
    this._weatherLegendEnsureStyle();
    let host=this.shadow.getElementById("weather-legend-overlay");
    if(!host){
      host=document.createElement("section");
      host.id="weather-legend-overlay";
      host.className="weather-legend-overlay";
      host.hidden=true;
      host.setAttribute("role","region");
      host.setAttribute("aria-label","WeatherRouter-Legende");
      host.setAttribute("aria-live","polite");
      host.innerHTML='<div class="weather-legend-list" data-weather-legend-list></div>';
      host.addEventListener("click",event=>{
        const button=event.target?.closest?.("[data-weather-legend-hide]");
        if(!button)return;
        event.preventDefault();event.stopPropagation();
        this._weatherDisplaySetLegendMode?.("off");
      });
      card.append(host);
    }
    const state=this._weatherLegendState();
    if(!state.resizeHandler){
      state.resizeHandler=()=>requestAnimationFrame(()=>this._weatherLegendPosition());
      window.addEventListener("resize",state.resizeHandler,{passive:true});
      window.visualViewport?.addEventListener?.("resize",state.resizeHandler,{passive:true});
    }
    if(typeof ResizeObserver==="function"&&!state.resizeObserver){
      state.resizeObserver=new ResizeObserver(()=>requestAnimationFrame(()=>this._weatherLegendPosition()));
      state.resizeObserver.observe(card);
    }
    state.mounted=true;
    return host;
  },

  _weatherLegendPosition(){
    const host=this.shadow?.getElementById("weather-legend-overlay"),card=this.shadow?.getElementById("map-card"),mapEl=this.shadow?.getElementById("map");
    if(!host||host.hidden||!card||!mapEl)return;
    const cardRect=card.getBoundingClientRect(),mapRect=mapEl.getBoundingClientRect();
    const footerHeight=clamp(cardRect.bottom-mapRect.bottom,0,Math.max(0,cardRect.height));
    host.style.bottom=Math.round(footerHeight+10)+"px";
    host.style.maxWidth=Math.max(160,Math.round(mapRect.width-16))+"px";
    const timeline=this.shadow?.querySelector?.('[data-weather-radar-player="true"]');
    if(timeline&&typeof this._weatherRadarApplyTimelinePosition==="function")requestAnimationFrame(()=>this._weatherRadarApplyTimelinePosition(timeline));
  },

  _weatherLegendRenderVisual(model){
    if(model.legendUrl){
      const img=document.createElement("img");
      img.className="weather-legend-image";
      img.src=model.legendUrl;
      img.alt=model.legendTitle;
      img.loading="lazy";
      img.referrerPolicy="strict-origin-when-cross-origin";
      return img;
    }
    if(model.entries.length){
      const scale=document.createElement("div");
      scale.className="weather-legend-entries";
      for(const entry of model.entries){
        const node=document.createElement("span");node.className="weather-legend-entry";
        const swatch=document.createElement("i");swatch.className="weather-legend-swatch";
        if(entry.color)swatch.style.setProperty("--weather-legend-color",entry.color);
        const label=document.createElement("span");label.className="weather-legend-entry-label";label.textContent=entry.label||entry.value;
        node.append(swatch,label);scale.append(node);
      }
      return scale;
    }
    return null;
  },

  _weatherLegendSyncUi(){
    const host=this._weatherLegendEnsureUi();if(!host)return;
    const models=this._weatherLegendVisibleModels(),list=host.querySelector("[data-weather-legend-list]");
    if(!models.length){
      host.hidden=true;
      if(list)list.replaceChildren();
      const timeline=this.shadow?.querySelector?.('[data-weather-radar-player="true"]');
      if(timeline&&typeof this._weatherRadarApplyTimelinePosition==="function")requestAnimationFrame(()=>this._weatherRadarApplyTimelinePosition(timeline));
      return;
    }
    host.hidden=false;
    host.classList.toggle("multiple",models.length>1);
    const fragment=document.createDocumentFragment();
    models.forEach((model,index)=>{
      const item=document.createElement("div");item.className="weather-legend-item";item.dataset.weatherLegendSource=model.source;
      const main=document.createElement("div");main.className="weather-legend-main";
      const title=document.createElement("div");title.className="weather-legend-title";title.textContent=model.title;
      main.append(title);
      if(model.subtitle){const sub=document.createElement("div");sub.className="weather-legend-subtitle";sub.textContent=model.subtitle;main.append(sub);}
      const visual=document.createElement("div");visual.className="weather-legend-visual";
      const visualNode=this._weatherLegendRenderVisual(model);if(visualNode)visual.append(visualNode);
      const side=document.createElement("div");side.className="weather-legend-side";
      if(model.unit){const unit=document.createElement("span");unit.className="weather-legend-unit";unit.textContent=model.unit;side.append(unit);}
      if(index===0){
        const hide=document.createElement("button");hide.type="button";hide.className="weather-legend-hide";hide.dataset.weatherLegendHide="true";hide.setAttribute("aria-label","WeatherRouter-Legende ausblenden");hide.title="Legende ausblenden";hide.textContent="×";side.append(hide);
      }
      item.title=model.details||[model.title,model.subtitle].filter(Boolean).join(" · ");
      item.append(main,visual,side);fragment.append(item);
    });
    list?.replaceChildren(fragment);
    requestAnimationFrame(()=>this._weatherLegendPosition());
  },

  _weatherLegendDiagnostics(){
    const models=this._weatherLegendActiveModels();
    return {mode:this._weatherLegendMode(),visible:this._weatherLegendVisibleModels().map(model=>model.source),models:models.map(model=>({source:model.source,family:model.family,capability:model.capability,title:model.title,unit:model.unit,has_image:Boolean(model.legendUrl),entries:model.entries.length,priority:model.priority}))};
  },

  _resumeWeatherLegend(){
    this._weatherLegendEnsureUi();
    this._weatherLegendSyncUi();
  },

  _teardownWeatherLegend(){
    const state=this.__weatherLegendState;if(!state)return;
    if(state.resizeHandler){
      window.removeEventListener("resize",state.resizeHandler);
      window.visualViewport?.removeEventListener?.("resize",state.resizeHandler);
      state.resizeHandler=null;
    }
    state.resizeObserver?.disconnect?.();state.resizeObserver=null;state.mounted=false;
  }
}));
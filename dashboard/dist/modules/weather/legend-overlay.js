import { defineModule } from "../core/runtime.js?v=41114r1";

export const MODULE_META=Object.freeze({
  id:"weather.legend-overlay",
  version:"0.1.1",
  group:"Weather-Engine",
  function:"WeatherRouter-Darstellungslegende",
  subfunctions:["generisches Legendenmodell","Auto/Ein/Aus","WR-Metadaten","Bildlegenden","strukturierte Skalen","Kartenoverlay","mehrere aktive Legenden","sichere Kartenposition"],
  file:"modules/weather/legend-overlay.js"
});

// Presentation snapshot generated from WR 0.10.289 RATE_COLORS; no raster recoloring.
export const PRECIPITATION_LEGEND_ENTRIES=Object.freeze([{"value": 0.0, "label": ">0", "color": "#019934"}, {"value": 1.0, "label": "1", "color": "#4db31b"}, {"value": 2.0, "label": "2", "color": "#99cc01"}, {"value": 3.0, "label": "3", "color": "#cce601"}, {"value": 5.0, "label": "5", "color": "#ffff01"}, {"value": 7.5, "label": "7.5", "color": "#ffc401"}, {"value": 10.0, "label": "10", "color": "#ff8901"}, {"value": 15.0, "label": "15", "color": "#ff4501"}, {"value": 30.0, "label": "30", "color": "#fe0000"}, {"value": 45.0, "label": "45", "color": "#b20000"}, {"value": 75.0, "label": "75", "color": "#8b0000"}, {"value": 100.0, "label": "100", "color": "#6e0000"}, {"value": 150.0, "label": "150", "color": "#500000"}].map(Object.freeze));
const precipitationModel={family:"precipitation",title:"Niederschlag",unit:"mm/h",entries:PRECIPITATION_LEGEND_ENTRIES,priority:100,active:true};
const POSITION_KEY="gewitterradar:weather-legend-position:v1";
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
      position:(()=>{try{const p=JSON.parse(localStorage.getItem(POSITION_KEY));return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)?{x:clamp(p.x,0,1),y:clamp(p.y,0,1)}:null;}catch(_){return null;}})(),
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
    const normalized=normalizeLegendModel(key,key==="precipitation"&&model?{...model,legendUrl:"",unit:"mm/h",entries:PRECIPITATION_LEGEND_ENTRIES}:model);
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
    if(mode==="on"&&!active.some(model=>model.source==="precipitation"))active.unshift(normalizeLegendModel("precipitation",precipitationModel));
    return mode==="auto"?active.slice(0,1):active;
  },

  _weatherLegendEnsureStyle(){
    if(!this.shadow||this.shadow.getElementById("weather-legend-style"))return;
    const style=document.createElement("style");
    style.id="weather-legend-style";
    style.textContent=[
      ".weather-legend-overlay{position:absolute;z-index:710;left:50%;transform:translateX(-50%);width:min(430px,calc(100% - 20px));box-sizing:border-box;padding:8px 10px;border:1px solid rgba(231,190,96,.32);border-radius:13px;background:linear-gradient(155deg,rgba(13,17,23,.96),rgba(8,11,16,.94));box-shadow:0 12px 32px rgba(0,0,0,.44),0 0 18px rgba(219,161,51,.07);backdrop-filter:blur(13px);color:#e7ebf0;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent}",
      ".weather-legend-overlay[hidden]{display:none!important}.weather-legend-list{display:grid;gap:8px}.weather-legend-item{display:grid;grid-template-columns:1fr;gap:7px;min-width:0}.weather-legend-header{display:flex;align-items:center;justify-content:space-between;gap:10px;min-width:0}.weather-legend-main{min-width:0;flex:1 1 auto}.weather-legend-title{font-size:10px;font-weight:850;color:#f1d38a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.weather-legend-subtitle{margin-top:2px;font-size:7.7px;line-height:1.25;color:#aeb7c2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".weather-legend-visual{min-width:0;display:flex;align-items:center;justify-content:center;padding:1px 0 2px}.weather-legend-image{display:block;width:min(240px,100%);height:auto;object-fit:contain;border-radius:5px;background:rgba(255,255,255,.92);box-shadow:inset 0 0 0 1px rgba(0,0,0,.10),0 2px 8px rgba(0,0,0,.16)}",
      ".weather-legend-entries{display:flex;align-items:flex-start;justify-content:center;gap:7px;min-width:0;overflow:hidden;width:100%}.weather-legend-entry{display:grid;justify-items:center;gap:2px;min-width:0;font-size:7.2px;color:#c9d0d8}.weather-legend-swatch{width:32px;height:6px;border-radius:999px;background:var(--weather-legend-color,rgba(255,255,255,.18));box-shadow:0 0 7px color-mix(in srgb,var(--weather-legend-color,transparent) 35%,transparent)}.weather-legend-entry-label{max-width:64px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".weather-legend-side{display:flex;align-items:center;gap:7px;flex:0 0 auto}.weather-legend-unit{font-size:8px;font-weight:800;color:#d6c184;white-space:nowrap}.weather-legend-hide{appearance:none;width:28px;height:28px;padding:0;border:1px solid rgba(255,255,255,.10);border-radius:8px;background:rgba(255,255,255,.025);color:#d9c999;font:850 15px/1 inherit;cursor:pointer;touch-action:manipulation}.weather-legend-hide:hover{border-color:rgba(240,202,112,.42);background:rgba(145,105,31,.12)}",
      ".weather-legend-overlay.multiple{padding-block:8px}.weather-legend-overlay.multiple .weather-legend-item+.weather-legend-item{padding-top:8px;border-top:1px solid rgba(255,255,255,.07)}",
      "@media(max-width:720px){.weather-legend-overlay{width:min(390px,calc(100% - 16px));padding:7px 8px;border-radius:12px}.weather-legend-title{font-size:9.3px}.weather-legend-subtitle{font-size:7px}.weather-legend-image{width:min(220px,100%)}.weather-legend-unit{font-size:7.5px}.weather-legend-hide{width:30px;height:30px}.weather-legend-entry{font-size:6.8px}.weather-legend-swatch{width:26px}}",
      "@media(max-width:430px){.weather-legend-overlay{width:calc(100% - 14px)}.weather-legend-image{width:min(190px,100%)}.weather-legend-subtitle{max-width:220px}.weather-legend-entries{gap:4px}.weather-legend-swatch{width:20px}.weather-legend-entry-label{max-width:44px}}"
    ].join("");
    style.textContent+=".weather-legend-entries{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px 4px;overflow:visible}.weather-legend-swatch{width:100%;min-width:22px}.weather-legend-entry{width:100%;font-size:9px}.weather-legend-header{cursor:grab;touch-action:none}.weather-legend-subtitle{white-space:normal;overflow-wrap:anywhere}.weather-legend-overlay{max-height:calc(100% - 20px);overflow:auto}.weather-legend-note{font-size:9px;line-height:1.4;color:#aeb7c2}@media(max-width:430px){.weather-legend-entries{grid-template-columns:repeat(5,minmax(0,1fr))}}";
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
      this._weatherLegendBindDrag(host);
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
    host.style.maxWidth=Math.max(0,Math.round(mapRect.width-16))+"px";
    host.style.maxHeight=Math.max(0,Math.round(mapRect.height-16))+"px";
    const bounds=this._weatherLegendBounds(host);
    const position=this._weatherLegendState().position;
    host.style.transform="none";host.style.bottom="auto";
    host.style.left=(bounds.left+(bounds.right-bounds.left)*(position?.x??.5))+"px";
    host.style.top=(bounds.top+(bounds.bottom-bounds.top)*(position?.y??1))+"px";
    const timeline=this.shadow?.querySelector?.('[data-weather-radar-player="true"]');
    if(timeline&&typeof this._weatherRadarApplyTimelinePosition==="function")requestAnimationFrame(()=>this._weatherRadarApplyTimelinePosition(timeline));
  },

  _weatherLegendBounds(host){
    const card=this.shadow.getElementById("map-card").getBoundingClientRect();
    const map=this.shadow.getElementById("map").getBoundingClientRect();
    const left=Math.max(8,map.left-card.left+8),top=Math.max(8,map.top-card.top+8);
    return {left,top,right:Math.max(left,map.right-card.left-host.offsetWidth-8),
      bottom:Math.max(top,map.bottom-card.top-host.offsetHeight-8)};
  },
  _weatherLegendBindDrag(host){
    let drag=null;
    host.addEventListener("pointerdown",event=>{
      if((event.button!==undefined&&event.button!==0)||event.target.closest("button")||!event.target.closest(".weather-legend-header"))return;
      event.preventDefault();event.stopPropagation();
      drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:parseFloat(host.style.left)||0,top:parseFloat(host.style.top)||0};
      host.setPointerCapture?.(event.pointerId);
    });
    host.addEventListener("pointermove",event=>{
      if(!drag||drag.id!==event.pointerId)return;
      event.preventDefault();event.stopPropagation();
      const b=this._weatherLegendBounds(host);
      host.style.left=clamp(drag.left+event.clientX-drag.x,b.left,b.right)+"px";
      host.style.top=clamp(drag.top+event.clientY-drag.y,b.top,b.bottom)+"px";
    });
    const end=event=>{
      if(!drag||drag.id!==event.pointerId)return;
      event.stopPropagation();drag=null;
      const b=this._weatherLegendBounds(host);
      const position={x:b.right>b.left?clamp((parseFloat(host.style.left)-b.left)/(b.right-b.left),0,1):0,
        y:b.bottom>b.top?clamp((parseFloat(host.style.top)-b.top)/(b.bottom-b.top),0,1):0};
      this._weatherLegendState().position=position;
      try{localStorage.setItem(POSITION_KEY,JSON.stringify(position));}catch(_){}
      try{host.releasePointerCapture?.(event.pointerId);}catch(_){}
    };
    for(const type of ["pointerup","pointercancel","lostpointercapture"])host.addEventListener(type,end);
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
      const side=document.createElement("div");side.className="weather-legend-side";
      if(model.unit){const unit=document.createElement("span");unit.className="weather-legend-unit";unit.textContent=model.unit;side.append(unit);}
      if(index===0){
        const hide=document.createElement("button");hide.type="button";hide.className="weather-legend-hide";hide.dataset.weatherLegendHide="true";hide.setAttribute("aria-label","WeatherRouter-Legende ausblenden");hide.title="Legende ausblenden";hide.textContent="×";side.append(hide);
      }
      const header=document.createElement("div");header.className="weather-legend-header";header.append(main,side);
      const visual=document.createElement("div");visual.className="weather-legend-visual";
      const visualNode=this._weatherLegendRenderVisual(model);if(visualNode)visual.append(visualNode);
      item.title=model.details||[model.title,model.subtitle].filter(Boolean).join(" · ");
      item.append(header,visual);
      if(model.family==="precipitation"){
        const note=document.createElement("div");note.className="weather-legend-note";
        note.textContent="Intensitätsstufen in mm/h · DWD-Originalfarben können in Randbereichen abweichen. Zum Verschieben die Kopfzeile ziehen.";
        item.append(note);
      }
      fragment.append(item);
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

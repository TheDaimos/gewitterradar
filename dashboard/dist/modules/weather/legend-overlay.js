import {settingsStorage} from '../core/settings-vault.js?v=411184r1';
import { defineModule } from "../core/runtime.js?v=41114r1";
import {ensurePremiumUi,premiumAction} from './premium-ui.js?v=411184r1';

export const MODULE_META=Object.freeze({
  id:"weather.legend-overlay",
  version:"0.1.10",
  group:"Weather-Engine",
  function:"WeatherRouter-Darstellungslegende",
  subfunctions:["generisches Legendenmodell","Auto/Ein/Aus","WR-Metadaten","Bildlegenden","strukturierte Skalen","Kartenoverlay","mehrere aktive Legenden","sichere Kartenposition"],
  file:"modules/weather/legend-overlay.js"
});

// Presentation snapshot generated from WR 0.10.293 RATE_COLORS (forced reference only; active layers use WR metadata); no raster recoloring.
export const LEGACY_OPERA_ENTRIES=Object.freeze([{"value": 0.0, "label": ">0", "color": "#019934"}, {"value": 1.0, "label": "1", "color": "#4db31b"}, {"value": 2.0, "label": "2", "color": "#99cc01"}, {"value": 3.0, "label": "3", "color": "#cce601"}, {"value": 5.0, "label": "5", "color": "#ffff01"}, {"value": 7.5, "label": "7.5", "color": "#ffc401"}, {"value": 10.0, "label": "10", "color": "#ff8901"}, {"value": 15.0, "label": "15", "color": "#ff4501"}, {"value": 30.0, "label": "30", "color": "#fe0000"}, {"value": 45.0, "label": "45", "color": "#b20000"}, {"value": 75.0, "label": "75", "color": "#8b0000"}, {"value": 100.0, "label": "100", "color": "#6e0000"}, {"value": 150.0, "label": "150", "color": "#500000"}].map(Object.freeze));
export const PRECIPITATION_LEGEND_ENTRIES=Object.freeze([{"value": 0.0, "label": ">0–<0.2", "color": "#33ffff"}, {"value": 0.2, "label": "0.2–<0.4", "color": "#1acc9a"}, {"value": 0.4, "label": "0.4–<1", "color": "#019934"}, {"value": 1.0, "label": "1–<2", "color": "#4db31b"}, {"value": 2.0, "label": "2–<3", "color": "#99cc01"}, {"value": 3.0, "label": "3–<5", "color": "#cce601"}, {"value": 5.0, "label": "5–<7.5", "color": "#ffff01"}, {"value": 7.5, "label": "7.5–<10", "color": "#ffc401"}, {"value": 10.0, "label": "10–<15", "color": "#ff8901"}, {"value": 15.0, "label": "15–<30", "color": "#ff4501"}, {"value": 30.0, "label": "30–<45", "color": "#fe0000"}, {"value": 45.0, "label": "45–<75", "color": "#e5004c"}, {"value": 75.0, "label": "75–<100", "color": "#cc0098"}, {"value": 100.0, "label": "100–<150", "color": "#6600cb"}, {"value": 150.0, "label": "≥150", "color": "#0000fe"}].map(Object.freeze));
const precipitationModel={family:"precipitation",title:"Niederschlag",unit:"mm/h",entries:PRECIPITATION_LEGEND_ENTRIES,priority:100,active:true};

export function precipitationLegendScales(layers){
 const seen=new Set(),result=[];
 for(const layer of layers||[]){
  if(!layer?.source_id||seen.has(layer.source_id))continue;seen.add(layer.source_id);
  const legend=layer.legend||{},multi=Array.isArray(legend.scales)?legend.scales:[legend];
  for(const scale of multi){
   const quantity=scale.quantity||layer.semantics?.quantity||"precipitation_rate";
   const snow=scale.kind==="snow";
   if(snow&&!(quantity==="liquid_water_equivalent_snowfall_rate"&&["mm/h","mm/hr","mm/h SWE"].includes(scale.unit)||quantity==="snowfall_rate"&&["mm/h","cm/h","m/h"].includes(scale.unit)))continue;
   const entries=Array.isArray(scale.entries)?scale.entries:Array.isArray(scale.stops)?scale.stops:[];
   if(snow&&!entries.length)continue;
   const opera=layer.source_id==="opera/opera_rate_raster";
   result.push({id:layer.source_id+(multi.length>1?"#"+(snow?"snow":"rain"):""),kind:snow?"snow":"rain",quantity,
    title:scale.title||legend.title||layer.source_id,unit:scale.unit||layer.semantics?.unit||"",
    entries:entries.length?entries:opera?LEGACY_OPERA_ENTRIES:[{label:"Keine verifizierten Farbmetadaten",color:""}],
    ticks:Array.isArray(scale.ticks)?scale.ticks:[],
    radarComparison:entries.length?radarLegendIntervals(entries):null,
    legendTime:typeof layer.times?.valid_at==="string"?layer.times.valid_at:"",
    subtitle:(snow?(quantity==="liquid_water_equivalent_snowfall_rate"?"Schneerate · Wasseräquivalent, keine Schneehöhe":"Schneefallrate"):opera?"RATE · WR-Farbstufen":"Originalfarben der Quelle")+
      (layer.source_id.includes("nasa_gibs/")?" · Satellitenschätzung":"")+
      (layer.times?.valid_at?" · "+layer.times.valid_at:"")+
      (layer.freshness_class==="older_background"?" · älterer WR-Hintergrund":"")});
  }
 }
 return result;
}


export const legendProviders=models=>[...new Set(models.map(model=>{
 const id=model.source||model.id||"";
 return id.includes("dwd/")?"DWD":id.includes("opera/")?"OPERA":id.includes("nasa_gibs/")?"NASA":null;
}).filter(Boolean))].sort((a,b)=>["DWD","OPERA","NASA"].indexOf(a)-["DWD","OPERA","NASA"].indexOf(b));
// Compare the existing WR interval labels, not a second precipitation table.
// Unsupported/ambiguous metadata keep their separate source legends.
function radarLegendIntervals(entries){
 if(!Array.isArray(entries)||!entries.length)return null;
 const result=[];
 for(const entry of entries){
  if(!entry||Object.keys(entry).some(k=>!["value","label","color"].includes(k)))return null;
  const text=String(entry.label||"").trim().replaceAll(",",".");
  const raw=typeof entry.value==="string"?entry.value.trim():entry.value;
  const value=typeof raw==="number"?raw:typeof raw==="string"&&/^\d+(?:[.,]\d+)?$/.test(raw)?Number(raw.replace(",",".")):NaN;
  const interval=/^(>)?(\d+(?:\.\d+)?)\s*[–-]\s*<(\d+(?:\.\d+)?)$/.exec(text);
  const top=/^(?:≥|>=)(\d+(?:\.\d+)?)$/.exec(text);
  if(!Number.isFinite(value)||value<0||(!interval&&!top))return null;
  const lower=Number(interval?interval[2]:top[1]),upper=interval?Number(interval[3]):null;
  if(value!==lower||(upper!==null&&upper<=lower))return null;
  let color=String(entry.color||"").trim().toLowerCase();
  if(/^#[a-f\d]{3}$/.test(color))color="#"+[...color.slice(1)].map(c=>c+c).join("");
  if(!/^#[a-f\d]{6}$/.test(color))return null;
  const previous=result.at(-1);
  if(previous&&(previous.upper!==lower||interval?.[1]))return null;
  result.push({lower,upper,lowerInclusive:!interval?.[1],upperInclusive:false,color});
 }
 return result;
}
const radarProvider=model=>{
 const id=String(model.source||model.id||"").replace(/^precipitation:/,"");
 return id==="dwd/radar_precipitation"?"DWD":id==="opera/opera_rate_raster"?"OPERA":null;
};
function radarTimeNote(models){
 const times=models.map(model=>{
  const raw=model.legendTime;
  return typeof raw==="string"&&/(?:Z|[+-]\d\d:\d\d)$/i.test(raw)&&Number.isFinite(Date.parse(raw))?new Date(raw):null;
 });
 const differentDates=times.every(Boolean)&&times[0].toISOString().slice(0,10)!==times[1].toISOString().slice(0,10);
 return models.map((model,index)=>{
  const date=times[index];
  if(!date)return radarProvider(model)+" Zeitpunkt nicht angegeben";
  const iso=date.toISOString(),day=differentDates?iso.slice(8,10)+"."+iso.slice(5,7)+"."+iso.slice(0,4)+" ":"";
  const time=iso.slice(11,date.getUTCSeconds()||date.getUTCMilliseconds()?23:16).replace(/\.000$/,"");
  return radarProvider(model)+" "+day+time+" UTC";
 }).join(" · ");
}
export function groupIdenticalLegendScales(models){
 const result=models.map(model=>({...model}));
 const dwd=result.findIndex(model=>radarProvider(model)==="DWD"),opera=result.findIndex(model=>radarProvider(model)==="OPERA");
 if(dwd<0||opera<0)return result;
 const pair=[result[dwd],result[opera]],a=pair[0],b=pair[1];
 if(a.unit!=="mm/h"||b.unit!==a.unit||a.family!==b.family||a.quantity!==b.quantity||
   (a.family&&a.family!=="precipitation")||(a.quantity&&a.quantity!=="precipitation_rate")||
   JSON.stringify(a.ticks||[])!==JSON.stringify(b.ticks||[]))return result;
 const descriptors=pair.map(model=>Object.hasOwn(model,"radarComparison")?model.radarComparison:radarLegendIntervals(model.entries));
 const [left,right]=descriptors;
 if(!left||!right||left.length!==right.length)return result;
 const identical=JSON.stringify(left)===JSON.stringify(right);
 const lowerOnly=!identical&&left.length>1&&left.at(-1).upper===null&&right.at(-1).upper===null&&
   left[0].color===right[0].color&&left[0].upper===right[0].upper&&
   JSON.stringify(left.slice(1))===JSON.stringify(right.slice(1));
 if(!identical&&!lowerOnly)return result;
 // Use one of the received tables unchanged; the asterisk qualifies its
 // source-dependent first interval in both classes and bar presentation.
 const base=left[0].lower<right[0].lower?a:b;
 const number=value=>String(value).replace(".",",");
 const lowerNote=lowerOnly?pair.map((model,index)=>radarProvider(model)+" "+
   (descriptors[index][0].lowerInclusive?"ab ":">")+number(descriptors[index][0].lower)+" mm/h").join(" · "):"";
 const merged={...base,title:"DWD / OPERA · Radar-Niederschlag",subtitle:"",
   sources:pair.map(model=>model.source||model.id),sharedRadar:true,
   lowerBoundaryNote:lowerNote?"* "+lowerNote:"",timeNote:radarTimeNote(pair),
   details:pair.map(model=>[model.title,model.subtitle,model.legendTime].filter(Boolean).join(" · ")).join("\n")};
 const first=Math.min(dwd,opera),last=Math.max(dwd,opera);
 result[first]=merged;result.splice(last,1);return result;
}

const UI_KEY="gewitterradar:weather-legend-ui:v1";
function readLegendUi(owner){
 try{const value=JSON.parse(settingsStorage(owner).getItem(UI_KEY));return {view:value?.view==="classes"?"classes":"bar",rain:value?.rain===true,snow:value?.snow===true,minimized:value?.minimized===true};}
 catch(_){return {view:"bar",rain:false,snow:false};}
}
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
    unit:safeText(input.unit),quantity:safeText(input.quantity),
    radarComparison:input.radarComparison||null,legendTime:safeText(input.legendTime),
    ticks:Array.isArray(input.ticks)?input.ticks.filter(t=>Number.isFinite(t.position)&&t.position>=0&&t.position<=1&&typeof t.label==="string").slice(0,32):[],
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
      collapsed:false,anchor:null,ui:readLegendUi(this),
      position:(()=>{try{const p=JSON.parse(settingsStorage(this).getItem(POSITION_KEY));return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)?{x:clamp(p.x,0,1),y:clamp(p.y,0,1)}:null;}catch(_){return null;}})(),
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
    if(key==="precipitation"){
      for(const id of state.models.keys())if(id===key||id.startsWith(key+":"))state.models.delete(id);
      const scales=Array.isArray(model?.scales)?model.scales:null;
      if(scales){
        for(const scale of scales){
          const id=key+":"+scale.id;
          const item=normalizeLegendModel(id,{...model,...scale,scales:undefined,family:scale.kind==="snow"?"snow":"precipitation"});
          if(item)state.models.set(id,item);
        }
        this._weatherLegendSyncUi();return;
      }
    }
    const normalized=normalizeLegendModel(key,model);
    if(normalized)state.models.set(key,normalized);else state.models.delete(key);
    this._weatherLegendSyncUi();
  },

  _weatherLegendClear(source){
    const state=this._weatherLegendState();
    if(source==null)state.models.clear();else for(const id of state.models.keys())if(id===String(source)||id.startsWith(String(source)+":"))state.models.delete(id);
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
    if(mode==="on"&&!active.some(model=>model.family==="precipitation"))active.unshift(normalizeLegendModel("precipitation",precipitationModel));
    return mode==="auto"?(["precipitation","snow"].includes(active[0]?.family)?active.filter(model=>["precipitation","snow"].includes(model.family)):active.slice(0,1)):active;
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
    style.textContent+=".weather-legend-entries{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px 4px;overflow:visible}.weather-legend-swatch{width:100%;min-width:22px}.weather-legend-entry{width:100%;font-size:10px}.weather-legend-entry-label{max-width:100%;white-space:normal;overflow:visible;font-variant-numeric:tabular-nums}.weather-legend-header{cursor:grab;touch-action:none}.weather-legend-subtitle{white-space:normal;overflow-wrap:anywhere}.weather-legend-overlay{max-height:calc(100% - 20px);overflow:auto}.weather-legend-note{font-size:9px;line-height:1.4;color:#aeb7c2}@media(max-width:430px){.weather-legend-entries{grid-template-columns:repeat(3,minmax(0,1fr))}}";
    style.textContent+=".weather-legend-overlay.gr-premium-metal-surface{border-width:1px;overflow:hidden;padding:6px 8px;width:min(410px,calc(100% - 16px))}.weather-legend-global-head{min-height:32px;gap:5px}.weather-legend-global-head>.weather-legend-title{white-space:normal;line-height:1.35;font-size:10px}.weather-legend-toggle{display:grid;place-items:center;width:30px;height:28px;border:0;border-radius:6px;background:transparent;cursor:pointer}.weather-legend-toggle .release-history-future-chevron{pointer-events:none}.weather-legend-content{display:grid;grid-template-rows:1fr;transition:grid-template-rows .42s cubic-bezier(.22,1,.36,1)}.weather-legend-overlay.collapsed .weather-legend-content{grid-template-rows:0fr}.weather-legend-scroll{min-height:0;overflow:hidden}.weather-legend-list{max-height:min(260px,var(--weather-legend-list-max,45vh));overflow-y:auto;overscroll-behavior:contain;padding-top:5px;scrollbar-width:thin}.weather-legend-item{gap:4px}.weather-legend-visual{padding:0}.weather-legend-title{font-size:9px}.weather-legend-subtitle{font-size:8px}.weather-legend-swatch{height:6px}.weather-legend-entry{font-size:9px}.weather-legend-entries{gap:5px 3px}.weather-legend-source-link{font-size:10px;color:var(--premium-gold-bright,#f1d58c);padding:5px}.weather-legend-toggle:focus-visible{outline:2px solid #f1d58c}@media(max-width:430px){.weather-legend-entries{grid-template-columns:repeat(5,minmax(0,1fr))}.weather-legend-entry{font-size:9px}}@media(prefers-reduced-motion:reduce){.weather-legend-content{transition:none}}";
    style.textContent+=".gr-legend-actions{display:flex;align-items:center;gap:5px;flex-shrink:0}.gr-legend-actions button{width:29px;height:29px;display:grid;place-items:center;border:1px solid rgba(220,169,68,.65);border-radius:9px;background:linear-gradient(145deg,#1c242e,#0b1119);color:#f1d58c;box-shadow:inset 0 1px 0 #ffffff18;cursor:pointer;font-size:19px}.gr-legend-actions button:focus-visible,.weather-legend-view-picker button:focus-visible{outline:2px solid #f1d58c}.gr-legend-actions .weather-legend-hide img{width:19px;height:19px;object-fit:contain}.weather-legend-overlay.gr-legend-minimized .weather-legend-view-picker,.weather-legend-overlay.gr-legend-minimized .weather-legend-list{display:none!important}.gr-thermal-classes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:6px}.gr-thermal-classes span{font-size:10px;color:#f1d58c;padding:4px 2px;text-align:center;background:#16202a;border-radius:4px}.gr-advection-scale{display:flex;justify-content:space-between;gap:2px;color:#f1d58c;font-size:10px;margin:4px 0 8px}.gr-advection-scale.classes{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px}.gr-advection-scale.classes span{border-top:5px solid #e0b961;padding-top:4px;text-align:center;font-size:9px}.weather-legend-view-picker button.active{border-color:#eac46e!important;background:linear-gradient(140deg,#5b411a,#161f27)!important;color:#ffdc82!important;box-shadow:0 0 10px #d9a44555}.weather-legend-list{max-height:var(--weather-legend-list-max,70vh);gap:4px;padding-top:2px;overflow-y:auto}.weather-legend-view-picker{display:flex;justify-content:flex-end;gap:4px;padding:2px 0}.weather-legend-view-picker button{border:1px solid var(--premium-line,#b58e4955);border-radius:6px;background:#101820;color:#c8c1ad;padding:4px 8px;font-size:9px;cursor:pointer}.weather-legend-view-picker button.active{color:#f1d58c;background:#62471844}.weather-legend-section{border:0!important;background:transparent!important;border-radius:0!important;margin:0!important;padding:0!important;box-shadow:none!important}.weather-legend-section-head{display:flex;align-items:center;justify-content:space-between;min-height:26px;color:#f1d58c;font-size:10px}.weather-legend-section-head button{height:26px}.weather-legend-section-body{display:grid;grid-template-rows:1fr;transition:grid-template-rows .42s cubic-bezier(.22,1,.36,1)}.weather-legend-section.collapsed .weather-legend-section-body{grid-template-rows:0fr}.weather-legend-section-inner{min-height:0;overflow:hidden;display:grid;gap:5px}.weather-legend-item{gap:2px}.weather-legend-item .weather-legend-title{white-space:normal;overflow:visible}.weather-legend-subtitle{line-height:1.25}.weather-legend-discrete-bar{display:flex;width:100%;height:10px;border-radius:3px;overflow:hidden}.weather-legend-discrete-bar>span{flex:1;min-width:0}.weather-legend-bar-box{width:100%;min-width:0}.weather-legend-bar-ticks{position:relative;height:18px;margin-top:2px;font-size:8px;font-variant-numeric:tabular-nums;color:#d2d5d8}.weather-legend-bar-ticks>span{position:absolute;white-space:nowrap;transform:translateX(-35%)}.weather-legend-bar-ticks>span:first-child{transform:none}.weather-legend-bar-ticks>span.last{transform:translateX(-100%)}.weather-legend-class-inspector{display:flex;gap:5px;align-items:center;margin-top:3px}.weather-legend-class-inspector select{min-width:0;flex:1;background:#131b24;border:1px solid #b58e4955;border-radius:5px;color:#e4e1d7;font-size:10px;padding:3px}.weather-legend-inspected-color{width:26px;height:18px;border-radius:3px}.weather-legend-entries{gap:4px 3px}.weather-legend-swatch{height:5px}@media(prefers-reduced-motion:reduce){.weather-legend-section-body{transition:none}}";
    this.shadow.append(style);
  },

  _weatherLegendEnsureUi(){
    if(!this.shadow)return null;
    ensurePremiumUi(this.shadow);
    const card=this.shadow.getElementById("map-card");
    if(!card)return null;
    this._weatherLegendEnsureStyle();
    let host=this.shadow.getElementById("weather-legend-overlay");
    if(!host){
      host=document.createElement("section");
      host.id="weather-legend-overlay";
      host.className="weather-legend-overlay gr-premium-metal-surface";
      host.setAttribute("open","");
      host.hidden=true;
      host.setAttribute("role","region");
      host.setAttribute("aria-label","WeatherRouter-Legende");
      host.setAttribute("aria-live","polite");
      host.innerHTML='<div class="weather-legend-header weather-legend-global-head"><div class="weather-legend-title" data-weather-legend-heading>Intensitäten</div><div class="gr-legend-actions">'+premiumAction('legend-info','Erklärung','info').replace('data-premium-action="legend-info"','data-premium-legend-info')+premiumAction('legend-minimize','Legende minimieren','minimize').replace('data-premium-action="legend-minimize"','data-gr-legend-minimize')+premiumAction('legend-close','Legende schließen').replace('data-premium-action="legend-close"','data-weather-legend-hide')+'</div></div><div class="weather-legend-view-picker" role="group" aria-label="Legendenansicht"><button type="button" data-weather-legend-view="classes">Klassen</button><button type="button" data-weather-legend-view="bar">Balken</button></div><div class="weather-legend-list" data-weather-legend-list></div>';
      host.querySelector('[data-weather-legend-hide]').classList.add('weather-legend-hide');
      host.querySelector("[data-weather-legend-hide] img").src=this._weatherPremiumCloseAsset?.()||new URL("../../assets/gewitterradar-about-close-premium.webp",import.meta.url).href;
      host.addEventListener("transitionend",()=>this._weatherLegendPosition());
      host.addEventListener("click",event=>{
        const view=event.target.closest?.("[data-weather-legend-view]"),toggle=event.target.closest?.("[data-weather-section-toggle]");
        if(!view&&!toggle)return;
        event.preventDefault();event.stopPropagation();
        const state=this._weatherLegendState();state.anchor={left:parseFloat(host.style.left)||0,top:parseFloat(host.style.top)||0};
        if(view){state.ui.view=view.dataset.weatherLegendView;this._weatherLegendSyncUi();}
        else{
          const key=toggle.dataset.weatherSectionToggle;state.ui[key]=!state.ui[key];
          const section=toggle.closest(".weather-legend-section"),body=section.querySelector(".weather-legend-section-body");
          section.toggleAttribute("open",!state.ui[key]);section.classList.toggle("collapsed",state.ui[key]);
          toggle.setAttribute("aria-expanded",String(!state.ui[key]));body.inert=state.ui[key];
        }
        if(this._weatherLegendSaveUi)this._weatherLegendSaveUi(state.ui);
        else try{settingsStorage(this).setItem(UI_KEY,JSON.stringify(state.ui));}catch(_){}
      });
      host.addEventListener("click",event=>{
        const mini=event.target?.closest?.("[data-gr-legend-minimize]");if(mini){event.preventDefault();event.stopPropagation();const state=this._weatherLegendState(),minimized=state.ui.minimized=!state.ui.minimized;host.classList.toggle("gr-legend-minimized",minimized);mini.setAttribute("aria-label",minimized?"Legende maximieren":"Legende minimieren");mini.setAttribute("aria-expanded",String(!minimized));if(this._weatherLegendSaveUi)this._weatherLegendSaveUi(state.ui);else try{settingsStorage(this).setItem(UI_KEY,JSON.stringify(state.ui));}catch(_){}requestAnimationFrame(()=>this._weatherLegendPosition());return;}
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
      state.resizeHandler=()=>{state.anchor=null;requestAnimationFrame(()=>this._weatherLegendPosition());};
      window.addEventListener("resize",state.resizeHandler,{passive:true});
      window.visualViewport?.addEventListener?.("resize",state.resizeHandler,{passive:true});
    }
    if(typeof ResizeObserver==="function"&&!state.resizeObserver){
      state.resizeObserver=new ResizeObserver(()=>{state.anchor=null;requestAnimationFrame(()=>this._weatherLegendPosition());});
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
    host.style.setProperty("--weather-legend-list-max",Math.max(0,Math.round(mapRect.height-94))+"px");
    const bounds=this._weatherLegendBounds(host);
    const position=this._weatherLegendState().position;
    host.style.transform="none";host.style.bottom="auto";
    host.style.left=clamp(this._weatherLegendState().anchor?.left??(bounds.left+(bounds.right-bounds.left)*(position?.x??.5)),bounds.left,bounds.right)+"px";
    host.style.top=clamp(this._weatherLegendState().anchor?.top??(bounds.top+(bounds.bottom-bounds.top)*(position?.y??1)),bounds.top,bounds.bottom)+"px";
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
      this._weatherLegendState().anchor={left:parseFloat(host.style.left),top:parseFloat(host.style.top)};
      if(this._weatherLegendSavePosition)this._weatherLegendSavePosition(position);
      else try{settingsStorage(this).setItem(POSITION_KEY,JSON.stringify(position));}catch(_){}
      try{host.releasePointerCapture?.(event.pointerId);}catch(_){}
    };
    for(const type of ["pointerup","pointercancel","lostpointercapture"])host.addEventListener(type,end);
  },

  _weatherLegendRenderVisual(model){
    const entries=model.entries;
    if(!entries.length){const text=document.createElement("div");text.className="weather-legend-note";text.textContent="Keine verifizierten Farbmetadaten verfügbar";return text;}
    const classes=this._weatherLegendState().ui.view==="classes";
    if(classes&&entries.length<=24){
      const scale=document.createElement("div");scale.className="weather-legend-entries";
      for(const entry of entries){
        const node=document.createElement("span");node.className="weather-legend-entry";
        const swatch=document.createElement("i");swatch.className="weather-legend-swatch";
        if(entry.color)swatch.style.setProperty("--weather-legend-color",entry.color);
        const label=document.createElement("span");label.className="weather-legend-entry-label";label.textContent=(entry.label||entry.value)+(model.lowerBoundaryNote&&entry===entries[0]?"*":"");
        node.append(swatch,label);scale.append(node);
      }
      return scale;
    }
    const box=document.createElement("div");box.className="weather-legend-bar-box";
    const bar=document.createElement("div");bar.className="weather-legend-discrete-bar";bar.setAttribute("aria-label","Diskrete Originalfarbklassen; Segmentbreite ist keine lineare Messwertachse");
    for(const entry of entries){const segment=document.createElement("span");segment.style.backgroundColor=entry.color||"transparent";segment.title=(entry.label||entry.value)+" "+model.unit+(model.lowerBoundaryNote&&entry===entries[0]?" · "+model.lowerBoundaryNote:"");bar.append(segment);}
    box.append(bar);
    if(classes){
      // High-resolution original NASA tables remain inspectable class by class
      // without a 110-row scroll window or invented coarser numeric boundaries.
      const inspect=document.createElement("div");inspect.className="weather-legend-class-inspector";
      const select=document.createElement("select");select.setAttribute("aria-label",model.title+" · Originalklasse");
      entries.forEach((entry,index)=>{const option=document.createElement("option");option.value=String(index);option.textContent=(entry.label||entry.value)+" "+model.unit;select.append(option);});
      const swatch=document.createElement("span");swatch.className="weather-legend-inspected-color";swatch.style.backgroundColor=entries[0].color;
      select.addEventListener("change",()=>{swatch.style.backgroundColor=entries[Number(select.value)].color;});
      inspect.append(select,swatch);box.append(inspect);return box;
    }
    const ticks=document.createElement("div");ticks.className="weather-legend-bar-ticks";
    const labels=model.ticks.length?model.ticks:entries.filter((_entry,index)=>index===0||index===entries.length-1||index%2===0).map(entry=>({position:entries.indexOf(entry)/entries.length,label:entries.indexOf(entry)===entries.length-1?"≥"+entry.value:entry.value==="0"?">0":entry.value||entry.label}));
    for(const tick of labels){const label=document.createElement("span");label.style.left=(tick.position*100)+"%";label.textContent=tick.label+(model.lowerBoundaryNote&&tick===labels[0]?"*":"");if(tick.position>=.92)label.className="last";ticks.append(label);}
    box.append(ticks);return box;
  },

  _weatherLegendSyncUi(){
    const host=this._weatherLegendEnsureUi();if(!host)return;
    host.classList.toggle("gr-legend-minimized",this._weatherLegendState().ui.minimized===true);
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
    const heading=host.querySelector("[data-weather-legend-heading]");
    const providers=legendProviders(models);
    heading.textContent=(models.some(model=>model.family==="snow")?"Intensitäten":models.some(model=>model.family==="precipitation")?"Niederschlagsintensität":"Wetterlegende")+
      (providers.length?" · "+providers.join(" / "):" · Referenz");
    host.querySelectorAll("[data-weather-legend-view]").forEach(button=>{const active=button.dataset.weatherLegendView===this._weatherLegendState().ui.view;button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active));});
    for(const family of ["precipitation","snow"]){
      const members=models.filter(model=>model.family===family);
      if(!members.length)continue;
      const key=family==="snow"?"snow":"rain",collapsed=this._weatherLegendState().ui[key];
      const section=document.createElement("section");section.className="weather-legend-section release-history-future";section.classList.toggle("collapsed",collapsed);section.toggleAttribute("open",!collapsed);
      const sectionHead=document.createElement("div");sectionHead.className="weather-legend-section-head";
      const name=document.createElement("strong");name.textContent=family==="snow"?"Schneeintensität":"Niederschlagsintensität";
      const toggle=document.createElement("button");toggle.type="button";toggle.className="weather-legend-toggle";toggle.dataset.weatherSectionToggle=key;toggle.dataset.weatherLegendToggle="true";toggle.setAttribute("aria-label",name.textContent+" ein- oder ausklappen");toggle.setAttribute("aria-expanded",String(!collapsed));
      const chevron=document.createElement("span");chevron.className="release-history-future-chevron";chevron.setAttribute("aria-hidden","true");toggle.append(chevron);sectionHead.append(name,toggle);
      const body=document.createElement("div");body.className="weather-legend-section-body";body.inert=collapsed;
      const inner=document.createElement("div");inner.className="weather-legend-section-inner";body.append(inner);
      groupIdenticalLegendScales(members).forEach((model,index)=>{
      const item=document.createElement("div");item.className="weather-legend-item";item.dataset.weatherLegendSource=model.source;
      item.dataset.weatherLegendSources=(model.sources||[model.source]).join(" ");
      const main=document.createElement("div");main.className="weather-legend-main";
      const title=document.createElement("div");title.className="weather-legend-title";title.textContent=model.title;
      main.append(title);
      if(model.subtitle){const sub=document.createElement("div");sub.className="weather-legend-subtitle";sub.textContent=model.subtitle;main.append(sub);}
      const side=document.createElement("div");side.className="weather-legend-side";
      if(model.unit){const unit=document.createElement("span");unit.className="weather-legend-unit";unit.textContent=model.unit;side.append(unit);}
      const header=document.createElement("div");header.className="weather-legend-header";header.append(main,side);
      const visual=document.createElement("div");visual.className="weather-legend-visual";
      const visualNode=this._weatherLegendRenderVisual(model);if(visualNode)visual.append(visualNode);
      item.title=model.details||[model.title,model.subtitle].filter(Boolean).join(" · ");
      item.append(header,visual);
      for(const text of [model.lowerBoundaryNote,model.timeNote])if(text){
        const note=document.createElement("div");note.className="weather-legend-note";note.textContent=text;item.append(note);
      }
      inner.append(item);
      });
      section.append(sectionHead,body);fragment.append(section);
    }
    list?.replaceChildren(fragment);
    requestAnimationFrame(()=>this._weatherLegendPosition());
  },

  _weatherLegendDiagnostics(){
    const models=this._weatherLegendActiveModels();
    return {mode:this._weatherLegendMode(),visible:this._weatherLegendVisibleModels().map(model=>model.source),models:models.map(model=>({source:model.source,family:model.family,capability:model.capability,title:model.title,unit:model.unit,has_image:false,entries:model.entries.length,priority:model.priority}))};
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

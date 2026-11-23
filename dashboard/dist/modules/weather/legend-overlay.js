import {settingsStorage} from '../core/settings-vault.js?v=41214r1';
import { defineModule } from "../core/runtime.js?v=41114r1";
import {createLegendInstrument,instrumentBounds,instrumentScaleSpace} from './legend-instrument.js?v=41214r1';
import {legendOptions} from './legend-preferences.js?v=41214r1';
import {renderLegendScale} from './legend-scale.js?v=41213r1';

import {precipitationPresentation,precipitationMetadata,precipitationSourceId,precipitationKind,renderPrecipitationScales,lowerDetectionLimits} from './legend-precipitation.js?v=41213r1';
import {renderLegendInformation} from './legend-information.js?v=41210r1';

export const MODULE_META=Object.freeze({
  id:"weather.legend-overlay",
  version:"0.1.66",
  group:"Weather-Engine",
  function:"WeatherRouter-Darstellungslegende",
  subfunctions:["generisches Legendenmodell","Auto/Ein/Aus","WR-Metadaten","Bildlegenden","strukturierte Skalen","Kartenoverlay","mehrere aktive Legenden","sichere Kartenposition"],
  file:"modules/weather/legend-overlay.js"
});

// Presentation snapshot generated from WR 0.10.293 RATE_COLORS (forced reference only; active layers use WR metadata); no raster recoloring.
export const LEGACY_OPERA_ENTRIES=Object.freeze([{"value": 0.0, "label": ">0", "color": "#019934"}, {"value": 1.0, "label": "1", "color": "#4db31b"}, {"value": 2.0, "label": "2", "color": "#99cc01"}, {"value": 3.0, "label": "3", "color": "#cce601"}, {"value": 5.0, "label": "5", "color": "#ffff01"}, {"value": 7.5, "label": "7.5", "color": "#ffc401"}, {"value": 10.0, "label": "10", "color": "#ff8901"}, {"value": 15.0, "label": "15", "color": "#ff4501"}, {"value": 30.0, "label": "30", "color": "#fe0000"}, {"value": 45.0, "label": "45", "color": "#b20000"}, {"value": 75.0, "label": "75", "color": "#8b0000"}, {"value": 100.0, "label": "100", "color": "#6e0000"}, {"value": 150.0, "label": "150", "color": "#500000"}].map(Object.freeze));
export const PRECIPITATION_LEGEND_ENTRIES=Object.freeze([{"value": 0.0, "label": ">0–<0.2", "color": "#33ffff"}, {"value": 0.2, "label": "0.2–<0.4", "color": "#1acc9a"}, {"value": 0.4, "label": "0.4–<1", "color": "#019934"}, {"value": 1.0, "label": "1–<2", "color": "#4db31b"}, {"value": 2.0, "label": "2–<3", "color": "#99cc01"}, {"value": 3.0, "label": "3–<5", "color": "#cce601"}, {"value": 5.0, "label": "5–<7.5", "color": "#ffff01"}, {"value": 7.5, "label": "7.5–<10", "color": "#ffc401"}, {"value": 10.0, "label": "10–<15", "color": "#ff8901"}, {"value": 15.0, "label": "15–<30", "color": "#ff4501"}, {"value": 30.0, "label": "30–<45", "color": "#fe0000"}, {"value": 45.0, "label": "45–<75", "color": "#e5004c"}, {"value": 75.0, "label": "75–<100", "color": "#cc0098"}, {"value": 100.0, "label": "100–<150", "color": "#6600cb"}, {"value": 150.0, "label": "≥150", "color": "#0000fe"}].map(Object.freeze));
const precipitationModel={family:"precipitation",title:"Niederschlag",unit:"mm/h",entries:PRECIPITATION_LEGEND_ENTRIES,priority:100,active:true};

export function precipitationLegendScales(layers,t){
 const label=(key,fallback)=>t?t('weather.legend.'+key):fallback;
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
    entries:entries.length?entries:opera?LEGACY_OPERA_ENTRIES:[{label:label("missingColors","Keine verifizierten Farbmetadaten"),color:""}],
    ticks:Array.isArray(scale.ticks)?scale.ticks:[],
    radarComparison:entries.length?radarLegendIntervals(entries):null,
    legendTime:typeof layer.times?.valid_at==="string"?layer.times.valid_at:"",
    subtitle:(snow?(quantity==="liquid_water_equivalent_snowfall_rate"?label("snowEquivalent","Schneerate · Wasseräquivalent, keine Schneehöhe"):label("snowRate","Schneefallrate")):opera?label("operaScale","RATE · WR-Farbstufen"):label("originalColors","Originalfarben der Quelle"))+
      (layer.source_id.includes("nasa_gibs/")?" · "+label("estimatedSatellite","Satellitenschätzung"):"")+
      (layer.times?.valid_at?" · "+layer.times.valid_at:"")+
      (layer.freshness_class==="older_background"?" · "+label("olderBackground","älterer WR-Hintergrund"):"")});
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
function radarTimeNote(models,t){
 const times=models.map(model=>{
  const raw=model.legendTime;
  return typeof raw==="string"&&/(?:Z|[+-]\d\d:\d\d)$/i.test(raw)&&Number.isFinite(Date.parse(raw))?new Date(raw):null;
 });
 const differentDates=times.every(Boolean)&&times[0].toISOString().slice(0,10)!==times[1].toISOString().slice(0,10);
 return models.map((model,index)=>{
  const date=times[index];
  if(!date)return radarProvider(model)+" "+(t?t("weather.legend.notTimed"):"Zeitpunkt nicht angegeben");
  const iso=date.toISOString(),day=differentDates?iso.slice(8,10)+"."+iso.slice(5,7)+"."+iso.slice(0,4)+" ":"";
  const time=iso.slice(11,date.getUTCSeconds()||date.getUTCMilliseconds()?23:16).replace(/\.000$/,"");
  return radarProvider(model)+" "+day+time+" UTC";
 }).join(" · ");
}
export function groupIdenticalLegendScales(models,t){
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
   (descriptors[index][0].lowerInclusive
    ? (t?t("weather.legend.fromThreshold",{low:number(descriptors[index][0].lower)}):"ab "+number(descriptors[index][0].lower))
    : ">"+number(descriptors[index][0].lower))+" mm/h").join(" · "):"";
 const merged={...base,title:"DWD / OPERA · "+(t?t("weather.legend.radarPrecip"):"Radar-Niederschlag"),subtitle:"",
   sources:pair.map(model=>model.source||model.id),sharedRadar:true,
   lowerBoundaryNote:lowerNote?"* "+lowerNote:"",timeNote:radarTimeNote(pair,t),
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
        this._weatherLegendSyncUi();this._legendHubRefresh?.();return;
      }
    }
    const normalized=normalizeLegendModel(key,model);
    if(normalized)state.models.set(key,normalized);else state.models.delete(key);
    this._weatherLegendSyncUi();this._legendHubRefresh?.();
  },

  _weatherLegendClear(source){
    const state=this._weatherLegendState();
    if(source==null)state.models.clear();else for(const id of state.models.keys())if(id===String(source)||id.startsWith(String(source)+":"))state.models.delete(id);
    this._weatherLegendSyncUi();this._legendHubRefresh?.();
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
    if(mode==="on"&&!active.some(model=>["precipitation","snow"].includes(model.family)))active.unshift(normalizeLegendModel("precipitation",precipitationModel));
    return mode==="auto"?(["precipitation","snow"].includes(active[0]?.family)?active.filter(model=>["precipitation","snow"].includes(model.family)):active.slice(0,1)):active;
  },

  _weatherLegendEnsureStyle(){},
  _weatherLegendEnsureUi(){
    if(!this.shadow?.getElementById('map-card'))return null;
    const state=this._weatherLegendState();
    state.instrument||=createLegendInstrument(this,{id:'precipitation',inlineCaptions:true,elementId:'weather-legend-overlay',title:()=>this._t('weather.legend.precipitation'),position:state.position,savePosition:p=>{state.position=p;try{settingsStorage(this).setItem(POSITION_KEY,JSON.stringify(p));}catch(_){}},onResize:()=>this._weatherLegendSyncUi()});
    state.mounted=true;return state.instrument.host;
  },
  _weatherLegendPosition(){this._weatherLegendState().instrument?.place();},
  _weatherLegendBounds(host){return instrumentBounds(this,host).storage;},

  _weatherLegendRenderVisual(model,{nativeOnly=false,unitInCaption=false,view=this._weatherLegendState().ui.view}={}){
    const entries=model.entries;
    if(!entries.length){const text=document.createElement("div");text.className="weather-legend-note";text.textContent=this._t("weather.legend.missingColors");return text;}
    const classes=view==="classes";
    if(!nativeOnly){const c=legendOptions(this,['precipitation','snow'].includes(model.family)?'precipitation':'other'),map=this.shadow?.getElementById('map');return renderLegendScale(model,{...c,unitInCaption},Math.max(60,c.orientation==='vertical'?(map?.clientHeight||600)-55:(map?.clientWidth||430)-74));}
    if(classes&&entries.length<=24){
      const scale=document.createElement("div");scale.className="weather-legend-entries";
      for(const entry of entries){
        const node=document.createElement("span");node.className="weather-legend-entry";
        const swatch=document.createElement("i");swatch.className="weather-legend-swatch";
        if(entry.color)swatch.style.setProperty("--weather-legend-color",entry.color);
        const label=document.createElement("span");label.className="weather-legend-entry-label";label.textContent=(entry.label||entry.value);
        node.append(swatch,label);scale.append(node);
      }
      return scale;
    }
    const box=document.createElement("div");box.className="weather-legend-bar-box";
    const bar=document.createElement("div");bar.className="weather-legend-discrete-bar";bar.setAttribute("aria-label",this._t("weather.legend.discrete"));
    for(const entry of entries){const segment=document.createElement("span");segment.style.backgroundColor=entry.color||"transparent";segment.title=(entry.label||entry.value)+" "+model.unit+(model.lowerBoundaryNote&&entry===entries[0]?" · "+model.lowerBoundaryNote:"");bar.append(segment);}
    box.append(bar);
    if(classes){
      // High-resolution original NASA tables remain inspectable class by class
      // without a 110-row scroll window or invented coarser numeric boundaries.
      const inspect=document.createElement("div");inspect.className="weather-legend-class-inspector";
      const select=document.createElement("select");select.setAttribute("aria-label",model.title+" · "+this._t("weather.legend.originalClass"));
      entries.forEach((entry,index)=>{const option=document.createElement("option");option.value=String(index);option.textContent=(entry.label||entry.value)+" "+model.unit;select.append(option);});
      const swatch=document.createElement("span");swatch.className="weather-legend-inspected-color";swatch.style.backgroundColor=entries[0].color;
      select.addEventListener("change",()=>{swatch.style.backgroundColor=entries[Number(select.value)].color;});
      inspect.append(select,swatch);box.append(inspect);return box;
    }
    const ticks=document.createElement("div");ticks.className="weather-legend-bar-ticks";
    const labels=model.ticks.length?model.ticks:entries.filter((_entry,index)=>index===0||index===entries.length-1||index%2===0).map(entry=>({position:entries.indexOf(entry)/entries.length,label:entries.indexOf(entry)===entries.length-1?"≥"+entry.value:entry.value==="0"?">0":entry.value||entry.label}));
    for(const tick of labels){const label=document.createElement("span");label.style.left=(tick.position*100)+"%";label.textContent=tick.label;if(tick.position>=.92)label.className="last";ticks.append(label);}
    box.append(ticks);return box;
  },

  _weatherLegendPresentation(preview=false){
    const models=(preview?this._weatherLegendActiveModels():this._weatherLegendVisibleModels()).filter(m=>['precipitation','snow'].includes(m.family));
    // The existing forced reference is available only when there is no active
    // source at all. A metadata-deficient RY never borrows this palette.
    if(preview&&!models.length)models.push(normalizeLegendModel('precipitation',{...precipitationModel,title:this._t('weather.legend.rainIntensity')+' · '+this._t('weather.legend.reference')}));
    return precipitationPresentation(models,groupIdenticalLegendScales,this._t.bind(this));
  },
  _weatherLegendSyncUi(){
    const host=this._weatherLegendEnsureUi();if(!host)return;
    const state=this._weatherLegendState(),instrument=state.instrument,presentation=this._weatherLegendPresentation(),{models,omitted,originals}=presentation;
    instrument.setVisible(models.length+omitted.length>0);if(!models.length&&!omitted.length)return;
    const c=legendOptions(this,'precipitation'),nodes=[renderPrecipitationScales(models,c,instrumentScaleSpace(this,models.length,c))];
    if(!models.length&&c.showCaption){const caption=document.createElement('p');caption.className='lh-instrument-caption';caption.textContent=this._t('weather.legend.precipitation');nodes.push(caption);}
    instrument.update(nodes,box=>{
      const metadata=precipitationMetadata(this),seen=new Set(),sources=[];
      for(const model of originals){const id=precipitationSourceId(model);if(seen.has(id))continue;seen.add(id);const source=metadata.find(layer=>layer.source_id===id),status=omitted.find(m=>precipitationSourceId(m)===id)?.presentationStatus;
        sources.push({...source,source_id:id,title:source?.legend?.source_title||source?.legend?.title||model.title,legendTime:source?undefined:model.legendTime,presentationStatus:status});
      }
      const scales=models.map(model=>({title:model.title,unit:model.unit,visual:this._weatherLegendRenderVisual(model,{nativeOnly:true}),meaning:precipitationKind(model)==='snow'?this._t(model.quantity==='liquid_water_equivalent_snowfall_rate'?'weather.legend.snowEquivalent':'weather.legend.snowRate'):this._t(precipitationSourceId(model).startsWith('nasa_gibs/')?'weather.legend.estimatedSatellite':'weather.legend.originalColors')}));
      box.append(renderLegendInformation(this,{scales,sources,notes:[lowerDetectionLimits(originals,this._t.bind(this),this._locale?.())],technical:{models:originals,omitted}}));
    });
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
    const state=this.__weatherLegendState;if(!state)return;state.instrument?.destroy();state.instrument=null;state.mounted=false;
  }
}));

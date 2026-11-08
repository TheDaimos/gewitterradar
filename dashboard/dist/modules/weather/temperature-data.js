import {temperatureDisplayValue,temperatureUnitSymbol} from './temperature-units.js?v=411156r1';
export const TEMPERATURE_STORAGE='gewitterradar:temperature-ui:v1';
export const TEMPERATURE_STOPS=Object.freeze([-40,-20,0,10,20,30,40,45,50]);
export const TEMPERATURE_COLORS=Object.freeze(['#051b61','#1254d7','#10cbe2','#36b86d','#f1dc45','#f28a26','#dc3030','#dd237b','#8b38d9']);
export const DEFAULT_TEMPERATURE=Object.freeze({schema:1,visible:false,surface:true,labels:true,advection:false,flowForm:'classic',flowLength:100,opacity:45,scheme:'premium',range:'auto',minC:-40,maxC:50,stops:TEMPERATURE_STOPS,labelDensity:'auto',fontSize:14,labelBackground:true,unit:'C',quality:'balanced',contrast:1,tempo:'normal',density:'normal',arrowSize:14,arrowOpacity:80,advectionStrength:1,transport:'both',threshold:0,paused:false,quickVisibility:'fullscreen',quickPositions:{},temperatureLegend:true,advectionLegend:true,legendPositions:{},legendUi:{},inspector:false});
const choice=(v,options,fallback)=>options.includes(v)?v:fallback;
const clamp=(v,min,max,fallback)=>typeof v==='number'&&Number.isFinite(v)?Math.max(min,Math.min(max,v)):fallback;
export function normalizeTemperatureConfig(input={}){
 const c={...DEFAULT_TEMPERATURE};for(const k of ['visible','surface','labels','advection','labelBackground','paused','temperatureLegend','advectionLegend','inspector'])if(typeof input[k]==='boolean')c[k]=input[k];
 for(const [key,allowed] of Object.entries({flowForm:['classic','curved_arrows','curved_lines'],scheme:['premium','contrast'],range:['auto','manual'],unit:['C','F','K'],labelDensity:['low','normal','high','auto'],quality:['balanced','fine'],tempo:['slow','normal','fast'],density:['low','normal','high'],transport:['both','cold','warm'],quickVisibility:['fullscreen','all','nonfullscreen','hidden']}))c[key]=choice(input[key],allowed,c[key]);
 for(const [key,min,max] of [['flowLength',50,150],['opacity',0,100],['fontSize',10,24],['contrast',.7,1.3],['arrowSize',8,28],['arrowOpacity',0,100],['advectionStrength',.25,4],['threshold',0,10],['minC',-100,45],['maxC',-50,80]])c[key]=clamp(input[key],min,max,c[key]);
 if(c.minC>=c.maxC){c.minC=-40;c.maxC=50;}
 const stops=input.stops;if(Array.isArray(stops)&&stops.length===9&&stops.every((n,i)=>Number.isFinite(n)&&n>=-150&&n<=100&&(!i||n>stops[i-1]))&&stops[6]>=35&&stops[7]>=40&&stops[8]>=45)c.stops=[...stops];else c.stops=[...TEMPERATURE_STOPS];
 for(const key of ['quickPositions','legendPositions']){c[key]={};for(const [id,p] of Object.entries(input[key]||{}).slice(0,20))if(/^[a-z0-9:-]{1,80}$/.test(id)&&p&&[p.x,p.y].every(Number.isFinite))c[key][id]={x:clamp(p.x,0,1,0),y:clamp(p.y,0,1,0)};}
 c.legendUi={};for(const kind of ['temperature','advection']){const ui=input.legendUi?.[kind];c.legendUi[kind]={view:ui?.view==='classes'?'classes':'bar',rain:ui?.rain===true,snow:false};}
 return c;
}
export function readTemperatureConfig(storage=globalThis.localStorage){try{return normalizeTemperatureConfig(JSON.parse(storage.getItem(TEMPERATURE_STORAGE))||{});}catch(_){return normalizeTemperatureConfig();}}
const RGB=TEMPERATURE_COLORS.map(h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)));
export function writeTemperatureColor(kelvin,config,out,offset=0){
 if(!Number.isFinite(kelvin)||kelvin<=0){out[offset]=out[offset+1]=out[offset+2]=out[offset+3]=0;return;}
 const c=kelvin-273.15,stops=config.stops||TEMPERATURE_STOPS;let i=0;while(i<8&&c>=stops[i+1])i++;
 const t=i===8?0:Math.max(0,Math.min(1,(c-stops[i])/(stops[i+1]-stops[i]))),a=RGB[i],b=RGB[Math.min(i+1,8)],contrast=(config.contrast||1)*(config.scheme==='contrast'?1.1:1);
 for(let j=0;j<3;j++)out[offset+j]=Math.round(Math.max(0,Math.min(255,((a[j]*(1-t)+b[j]*t)-128)*contrast+128)));out[offset+3]=255;
}
export function temperatureColor(kelvin,config){const a=[0,0,0,0];writeTemperatureColor(kelvin,config,a);return `rgb(${a[0]},${a[1]},${a[2]})`;}
export function temperatureText(kelvin,unit='C',suffix=false,locale='de-DE'){if(!Number.isFinite(kelvin)||kelvin<=0)return '–';const value=temperatureDisplayValue(kelvin,unit);return (Math.round(value)||0).toLocaleString(locale)+(unit==='K'?' K':suffix?' '+temperatureUnitSymbol(unit):'°');}
export function advectionColor(rate,strength=1){const n=rate*strength,a=Math.abs(n);return a<.05?'#e8edf1':n<0?(a<.4?'#6edbff':'#247aff'):(a<.4?'#ffab50':a<2?'#fa413b':'#e9449a');}
export function temperatureLegendRange(field,c){const r=field?.temperature_range_kelvin;return c.range==='manual'?[c.minC,c.maxC]:r?[Math.floor((r.min-273.15)/10)*10,Math.ceil((r.max-273.15)/10)*10]:[c.stops[0],c.stops[8]];}

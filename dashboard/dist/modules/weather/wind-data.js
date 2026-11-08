import {normalizeSnakeConfig} from './snake-config.js?v=411162r1';
import { weatherSourceText } from './source-text.js?v=411150r1';
/* WR point-contract adapter and presentation math. No routing, age cutoff or field interpolation. */
export const WIND_SPEED='weather.point.wind_speed',WIND_DIRECTION='weather.point.wind_direction';
export const WIND_STORAGE='gewitterradar:wind-ui:v1';
export const WIND_COLORS=Object.freeze([
 ['black','Schwarz','#111318'],['white','Weiß','#ffffff'],['gold','Gold','#f4c65d'],['turquoise','Türkis','#24e4db'],
 ['violet','Violett','#a86bff'],['magenta','Magenta','#ff43c6'],['blue','Blau','#258cff'],['green','Grün','#38ec83']
].map(([id,label,hex])=>Object.freeze({id,label,hex})));
// WMO/JODC equivalent 10 m speed intervals, m/s; display conversion never changes source values.
export const BEAUFORT_LIMITS=Object.freeze([0,.3,1.6,3.4,5.5,8,10.8,13.9,17.2,20.8,24.5,28.5,32.7]);
export const DEFAULT_WIND=Object.freeze({schema:2,visible:false,enabled:true,snakeAnimationExplicit:false,barbsVisible:true,mode:'barbs',flowForm:'classic',flowLength:100,color:'white',colorMode:'uniform',highColor:'gold',lowColor:'violet',tempo:'normal',density:'normal',paused:false,animationExplicit:false,colorField:false,fieldOpacity:45,performanceDiagnostics:false,quickVisibility:'fullscreen',unit:'km/h',quickPositions:{},legendPosition:null,legendUi:{view:'classes',rain:false,snow:false}});
const member=(value,allowed,fallback)=>allowed.includes(value)?value:fallback;
export function normalizeWindConfig(input={}){
 const c={...DEFAULT_WIND};c.snake=normalizeSnakeConfig(input.snake);
 for(const key of ['enabled','snakeAnimationExplicit','barbsVisible','paused','animationExplicit','colorField','performanceDiagnostics'])if(typeof input[key]==='boolean')c[key]=input[key];
 // Schema 1 used the two feature flags as its only master switch. Preserve the
 // visible result; an entirely stopped legacy configuration gets ready-to-use barbs.
 if(typeof input.visible==='boolean')c.visible=input.visible;
 else{c.visible=input.enabled===true||input.colorField===true;if(!c.visible)c.enabled=true;}
 c.quickPositions={};for(const [key,p] of Object.entries(input.quickPositions||{}).slice(0,16))if(/^[a-z0-9:-]{1,80}$/.test(key)&&p&&[p.x,p.y].every(Number.isFinite))c.quickPositions[key]={x:Math.max(0,Math.min(1,p.x)),y:Math.max(0,Math.min(1,p.y))};
 c.quickVisibility=member(input.quickVisibility,['fullscreen','all','nonfullscreen','hidden'],'fullscreen');
 c.mode=member(input.mode,['barbs','arrows','animated','snake'],c.mode);
 c.flowForm=member(input.flowForm,['classic','curved_arrows','curved_lines'],'classic');
 if(typeof input.flowLength==='number'&&Number.isFinite(input.flowLength))c.flowLength=Math.max(50,Math.min(150,input.flowLength));
 for(const key of ['color','highColor','lowColor'])c[key]=member(input[key],WIND_COLORS.map(v=>v.id),c[key]);
 c.colorMode=member(input.colorMode,['uniform','pressure'],c.colorMode);
 c.tempo=member(input.tempo,['slow','normal','fast'],'normal');
 c.density=member(input.density,['low','normal','high'],'normal');
 c.unit=member(input.unit,['km/h','kn','Bft'],c.unit);
 if(typeof input.fieldOpacity==='number'&&Number.isFinite(input.fieldOpacity))c.fieldOpacity=Math.max(0,Math.min(100,input.fieldOpacity));
 const p=input.legendPosition;if(p&&[p.x,p.y].every(Number.isFinite))c.legendPosition={x:Math.max(0,Math.min(1,p.x)),y:Math.max(0,Math.min(1,p.y))};
 c.legendUi={view:input.legendUi?.view==='bar'?'bar':'classes',rain:input.legendUi?.rain===true,snow:false,minimized:input.legendUi?.minimized===true,explanation:input.legendUi?.explanation===true};
 return c;
}
export const windDisplayActive=c=>c.visible&&(c.enabled||c.colorField);
export const effectiveWindConfig=c=>c.visible?(c.mode==='barbs'&&!c.barbsVisible?{...c,enabled:false}:c):{...c,enabled:false,colorField:false};
export function readWindConfig(storage=globalThis.localStorage){try{return normalizeWindConfig(JSON.parse(storage.getItem(WIND_STORAGE))||{});}catch(_){return normalizeWindConfig();}}
export function beaufort(ms){if(!Number.isFinite(ms)||ms<0)return null;let n=0;for(let i=1;i<BEAUFORT_LIMITS.length;i++)if(ms>=BEAUFORT_LIMITS[i])n=i;return n;}
export function windSpeedText(ms,unit='km/h'){
 if(!Number.isFinite(ms)||ms<0)return 'keine Daten';
 return unit==='Bft'?beaufort(ms)+' Bft':(ms*(unit==='kn'?3.6/1.852:3.6)).toLocaleString('de-DE',{maximumFractionDigits:1})+' '+unit;
}
export function windBarbParts(ms){
 if(!Number.isFinite(ms)||ms<0)return null;
 const knots=ms*3.6/1.852,rounded=5*Math.floor(knots/5+.5);
 return {knots,rounded,calm:rounded===0,pennants:Math.floor(rounded/50),full:Math.floor((rounded%50)/10),half:(rounded%10)>=5?1:0};
}
export function windVector(ms,from){const a=from*Math.PI/180;return {u:-ms*Math.sin(a),v:-ms*Math.cos(a)};}
export const canonicalLongitude=lon=>((lon+180)%360+360)%360-180;
export function windDestination(lat,lon,from,distance=100){
 const a=(from+180)*Math.PI/180,r=distance/6371000,p=lat*Math.PI/180;
 const y=Math.asin(Math.sin(p)*Math.cos(r)+Math.cos(p)*Math.sin(r)*Math.cos(a));
 let x=lon+Math.atan2(Math.sin(a)*Math.sin(r)*Math.cos(p),Math.cos(r)-Math.sin(p)*Math.sin(y))*180/Math.PI;
 x+=360*Math.round((lon-x)/360);return {lat:y*180/Math.PI,lng:x};
}
const instant=value=>typeof value==='string'&&/(?:Z|[+-]\d\d:\d\d)$/i.test(value)&&Number.isFinite(Date.parse(value))?new Date(value).toISOString():null;
function pointValue(answer,id,quantity,unit){
 if(answer?.status!=='ready'||answer.capability!==id||answer.resource?.type!=='value'||answer.freshness?.stale===true){const code=String(answer?.unavailable?.code||answer?.status||'missing_response').replace(/[^a-z0-9_:-]/gi,'').slice(0,90);throw new Error('wr_wind_unavailable:'+code);}
 const s=answer.resource.semantics,v=answer.resource.payload?.values?.[id];
 if(s?.quantity!==quantity||typeof s.observation_kind!=='string'||!s.observation_kind||v?.unit!==unit||typeof v.value!=='number'||!Number.isFinite(v.value)||v.nodata===true||v.valid===false||v.quality_valid===false)throw new Error('wr_wind_invalid_value');
 const time=instant(v.valid_at||v.data_time||answer.freshness?.data_time),provider=answer.provenance?.provider_id;
 if(!time||typeof provider!=='string'||!provider)throw new Error('wr_wind_missing_provenance');
 return {value:v.value,time,provider,kind:s.observation_kind,attribution:weatherSourceText(answer.provenance.attribution||answer.provenance.provider_name||provider)};
}
export function combineWindPoint(speed,direction,point){
 const a=pointValue(speed,WIND_SPEED,'wind_speed','m/s');
 if(a.value<0||![point.latitude,point.longitude].every(Number.isFinite)||Math.abs(point.latitude)>85)throw new Error('wr_wind_invalid_point');
 let from=null;
 if(a.value!==0){const b=pointValue(direction,WIND_DIRECTION,'wind_from_direction','°');
  if(b.provider!==a.provider||b.time!==a.time||b.kind!==a.kind)throw new Error('wr_wind_incoherent_pair');
  if(b.value<0||b.value>360)throw new Error('wr_wind_invalid_direction');from=b.value%360;
 }
 const lon=canonicalLongitude(point.longitude),key=point.latitude.toFixed(6)+'/'+lon.toFixed(6);
 return Object.freeze({key,lat:point.latitude,lon,speed:a.value,from,validAt:a.time,provider:a.provider,kind:a.kind,attribution:a.attribution,height:10,...(from===null?{u:0,v:0}:windVector(a.value,from))});
}
export function windQueryPoints(map,maxPoints=9){
 const size=map.getSize(),points=new Map();
 // Sparse explicitly resolved points, not a GR-generated spatial wind field.
 for(const [fx,fy] of [[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75],[.5,.25],[.5,.75],[.25,.5],[.75,.5]]){
  const ll=map.containerPointToLatLng([size.x*fx,size.y*fy]);
  if(!ll||!Number.isFinite(ll.lat)||Math.abs(ll.lat)>85)continue;
  const point={type:'point',latitude:Number(ll.lat.toFixed(6)),longitude:Number(canonicalLongitude(ll.lng).toFixed(6))},key=point.latitude+'/'+point.longitude;
  points.set(key,point);if(points.size>=maxPoints)break;
 }
 return [...points.values()];
}

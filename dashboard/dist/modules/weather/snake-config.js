// Isolated visual settings. Values are CSS pixels, seconds and display factors.
export const SNAKE_DEFAULTS=Object.freeze({minLength:10,maxLength:76,lengthScale:1,headSize:1.5,bodyWidth:2.1,taper:1.3,tailStart:.67,opacity:85,density:1,speed:1,response:.65});
export const SNAKE_LIMITS=Object.freeze({minLength:[8,24,.5],maxLength:[30,120,1],lengthScale:[.25,3,.05],headSize:[1,2,.05],bodyWidth:[1,5,.1],taper:[.6,2.5,.05],tailStart:[.5,.8,.01],opacity:[10,100,1],density:[.35,5,.05],speed:[.25,2.5,.05],response:[.15,3,.05]});
export const SNAKE_LABELS=Object.freeze({minLength:'Mindestlänge',maxLength:'Maximallänge',lengthScale:'Längenskalierung',headSize:'Kopfgröße',bodyWidth:'Körperbreite',taper:'Schwanzverjüngung',tailStart:'Schwanzbeginn',opacity:'Deckkraft',density:'Partikeldichte',speed:'Animationsgeschwindigkeit',response:'Längenanpassung'});
export function snakeSettingText(key,value){if(key==='tailStart')return Math.round(value*100)+' %';return Number(value.toFixed(2))+(['minLength','maxLength','bodyWidth'].includes(key)?' px':key==='opacity'?' %':key==='response'?' s':'');}
export function normalizeSnakeConfig(input={}){const result={};for(const [key,[min,max]] of Object.entries(SNAKE_LIMITS)){const value=input?.[key];result[key]=typeof value==='number'&&Number.isFinite(value)?Math.max(min,Math.min(max,value)):SNAKE_DEFAULTS[key];}return result;}
export const snakeTargetLength=(speed,c)=>Number.isFinite(speed)&&speed>0?c.minLength+(c.maxLength-c.minLength)*(-Math.expm1(-speed*c.lengthScale/20)):0;
export const snakeVelocity=(speed,factor=1)=>Number.isFinite(speed)&&speed>0?96*(-Math.expm1(-speed/18))*factor:0;
export const smoothSnakeLength=(current,target,dt,response)=>current+(target-current)*(-Math.expm1(-Math.max(0,dt)/response));
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const snakeTailAlpha=(t,c)=>Math.pow(1-smooth((t-c.tailStart)/(1-c.tailStart)),.8);
export function snakeWidthFactor(t,c){const head=1+(c.headSize-1)*(1-smooth(t/.1)),body=1-.04*smooth(t/c.tailStart);return head*body*Math.pow(1-smooth((t-c.tailStart)/(1-c.tailStart)),c.taper);}
export function snakeDensityPlan(width,height,zoom,span,c,quality=1,lowMemory=false){
 const zoomFactor=1+Math.max(0,Math.min(1,(6-zoom)/3))*.65,lengthFactor=Math.max(.8,Math.min(1.2,Math.sqrt(76/c.maxLength))),unique=Math.min(1,360/Math.max(1,span)),cap=lowMemory?900:1800;
 const requested=Math.max(18,Math.round(width*height/3500*c.density*zoomFactor*lengthFactor*unique)),limited=Math.min(cap,requested),effective=Math.max(18,Math.round(limited*quality));
 return {requested,limited,effective,cap,zoomFactor,lengthFactor,userDensity:c.density};
}
// Temporary presentation limits; user settings never change. Recovery probes
// also run in the hysteresis band, avoiding a permanently latched low density.
export function adaptSnakeLoad(state,cost,time){
 state.cost=(state.cost||0)*.88+cost*.12;state.quality??=1;state.changedAt??=time;
 state.interval=state.cost>38?1000/15:state.cost>20?50:1000/30;
 if(time-state.changedAt>=1500&&state.cost>45){state.quality=Math.max(.6,state.quality-.1);state.changedAt=time;}
 else if(state.quality<1&&time-state.changedAt>=(state.cost<32?1500:5000)){state.quality=Math.min(1,state.quality+.05);state.changedAt=time;}
 return state;
}

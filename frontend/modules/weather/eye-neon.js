// Decorative runtime filaments, independent of weather data and the wind engine.
import {requestWeatherFrame,cancelWeatherFrame} from './frame-clock.js?v=411156r1';
import {visibleEyeSlots,eyeRingRadius,eyeGlowExtent,eyeAuraOn} from './eye-hub-model.js?v=411180r1';
const TAU=Math.PI*2,clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),fract=x=>x-Math.floor(x),smooth=x=>x*x*(3-2*x);
const hash=(x,y,seed)=>{let h=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(seed,1442695041);h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;};
function noise(x,y,seed){const a=Math.floor(x),b=Math.floor(y),u=smooth(x-a),v=smooth(y-b),p=hash(a,b,seed),q=hash(a+1,b,seed),r=hash(a,b+1,seed),s=hash(a+1,b+1,seed);return (p+(q-p)*u)*(1-v)+(r+(s-r)*u)*v;}
// Stable filament identity and coherent circular noise: no frame-random particles.
export function filamentPointInto(out,offset,radius,slot,id,angle,time,intensity){
 const seed=slot*31+id*17+11,phase=id*2.399+slot*.731,ca=Math.cos(angle),sa=Math.sin(angle),amplitude=(4+intensity*.075),family=noise(ca*1.3+time*.035,sa*1.3-time*.029,slot+5)-.5;
 const local=noise(ca*2.7+time*(.047+id*.003),sa*2.7+time*.019,seed)-.5,detail=noise(ca*5.1-time*.023,sa*5.1+time*.031,seed+41)-.5;
 const r=radius+(id-2)*1.05+amplitude*(family*.75+local*1.65+detail*.45)+Math.sin(angle*2+phase+time*.09)*2;
 const a=angle+.035*Math.sin(angle*3+phase+time*(.08+id*.007))+.026*(noise(time*.045,angle/TAU,seed+8)-.5);
 out[offset]=Math.cos(a)*r;out[offset+1]=Math.sin(a)*r;return out;
}
// Compatibility for the existing geometry test; rendering uses the full family.
export function neonPoint(radius,slot,angle,time,intensity){return filamentPointInto([0,0],0,radius,slot,0,angle,time,intensity);}
export function neonQualityStep(state,gap,cost,time){
 const bad=cost>5||gap>29,good=cost<2.8&&gap<21;
 if(bad){state.badSince??=time;state.goodSince=null;}else if(good){state.goodSince??=time;state.badSince=null;}else{state.badSince=state.goodSince=null;}
 if(time-state.changed>3000&&state.badSince!==null&&time-state.badSince>1400&&state.level<2){state.level++;state.changed=time;state.badSince=null;}
 if(time-state.changed>5000&&state.goodSince!==null&&time-state.goodSince>5000&&state.level>0){state.level--;state.changed=time;state.goodSince=null;}
 return state.level;
}
function curve(ctx,points,count){
 ctx.beginPath();ctx.moveTo(points[0],points[1]);
 for(let i=0;i<count;i++){const a=(i+count-1)%count,b=i,c=(i+1)%count,d=(i+2)%count;ctx.bezierCurveTo(points[b*2]+(points[c*2]-points[a*2])/6,points[b*2+1]+(points[c*2+1]-points[a*2+1])/6,points[c*2]-(points[d*2]-points[b*2])/6,points[c*2+1]-(points[d*2+1]-points[b*2+1])/6,points[c*2],points[c*2+1]);}ctx.closePath();
}
function along(out,points,count,angle){const u=fract(angle/TAU)*count,a=Math.floor(u),b=(a+1)%count,f=u-a;out[0]=points[a*2]*(1-f)+points[b*2]*f;out[1]=points[a*2+1]*(1-f)+points[b*2+1]*f;}
function sprite(color){const canvas=document.createElement('canvas');canvas.width=canvas.height=32;const c=canvas.getContext('2d'),g=c.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'#fff');g.addColorStop(.09,'#fff');g.addColorStop(.22,color);g.addColorStop(.45,color+'bb');g.addColorStop(1,color+'00');c.fillStyle=g;c.fillRect(0,0,32,32);return canvas;}
export class EyeNeon{
 constructor(){
  this.surfaces=[];this.frame=null;this.last=0;this.tickLast=0;this.gap=16.7;this.cost=0;this.detail=1;this.blurred=false;this.destroyed=false;this.scratch=new Float64Array(2);this.quality={level:0,changed:0,badSince:null,goodSince:null};this.metrics={frames:0,cpuMs:0,maxMs:0,cacheMs:0,paths:0,filaments:0,beads:0,quality:0};
  this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.visibility=()=>{if(document.hidden)this.stop();else this.schedule();};this.blur=()=>{this.blurred=true;this.stop();};this.focus=()=>{this.blurred=false;this.tickLast=0;this.schedule();};this.motionChange=()=>{for(const s of this.surfaces)this.draw(s,performance.now()/1000,0,true);this.schedule();};this.intersection=new IntersectionObserver(()=>this.schedule());
  this.motion.addEventListener('change',this.motionChange);document.addEventListener('visibilitychange',this.visibility);window.addEventListener('blur',this.blur);window.addEventListener('focus',this.focus);window.addEventListener('pagehide',this.blur);window.addEventListener('pageshow',this.focus);
 }
 visible(s){const r=s.host.getBoundingClientRect(),dialog=s.host.closest('dialog'),clip=dialog?.getBoundingClientRect();return (!dialog||dialog.open)&&s.host.isConnected&&r.width>0&&r.height>0&&r.bottom>(clip?.top||0)&&r.right>0&&r.top<Math.min(innerHeight,clip?.bottom||innerHeight)&&r.left<innerWidth&&!s.host.closest('[hidden],.minimized');}
 release(s){s.canvas.remove();s.canvas.width=s.canvas.height=1;for(const r of s.rings.values()){r.halo.width=r.halo.height=1;}s.rings.clear();}
 sync(items){
  const old=this.surfaces;this.surfaces=[];this.intersection.disconnect();
  for(const {host,config,statuses} of items){
   if(!host||!config.grouped||!config.aura||!config.intensity||!config.brightness)continue;
   const active=visibleEyeSlots(config).flatMap((slot,index)=>eyeAuraOn(config,statuses[slot.functionId]||{})?[{id:slot.functionId,index,color:config.colors[slot.functionId]}]:[]);
   let s=old.find(s=>s.host===host&&s.canvas.isConnected);
   if(!s&&!active.length)continue;
   if(!s){const canvas=document.createElement('canvas');canvas.className='eye-neon';canvas.setAttribute('aria-hidden','true');canvas.style.cssText='position:absolute;left:50%;top:50%;transform:translate3d(-50%,-50%,0);pointer-events:none;z-index:1';host.append(canvas);s={host,canvas,ctx:canvas.getContext('2d',{alpha:true}),rings:new Map(),extent:0,signature:'',config};}
   s.config=config;const extent=eyeGlowExtent(config),scale=host.closest('.eye-preview-scene')?Math.max(1,host.getBoundingClientRect().width/(host.offsetWidth||1)):1;
   const ratio=Math.min(globalThis.devicePixelRatio||1,2,640/(extent*2))*Math.min(scale,1.5),pixels=Math.min(640,Math.ceil(extent*2*ratio));
   if(s.canvas.width!==pixels||s.extent!==extent){s.canvas.width=s.canvas.height=pixels;s.canvas.style.width=s.canvas.style.height=extent*2+'px';s.extent=extent;s.ratio=pixels/(extent*2);s.signature='';}
   const signature=JSON.stringify([extent,config.size,config.intensity,config.brightness,config.glow,config.eyeAuraGap||0,config.auraRingGap||0,active]);const changed=s.signature!==signature;s.signature=signature;
   const live=config.glow==='living'&&!this.motion.matches;
   for(const r of s.rings.values())r.target=0;
   for(const a of active){let r=s.rings.get(a.id);if(!r){r={...a,visibility:live?.01:1,target:1,halo:document.createElement('canvas'),sprite:sprite(a.color),strands:Array.from({length:10},(_,id)=>({id,points:new Float32Array(128*2)}))};s.rings.set(a.id,r);}if(r.color!==a.color)r.sprite=sprite(a.color);Object.assign(r,a,{target:1,radius:eyeRingRadius(config.size,a.index,config.eyeAuraGap,config.auraRingGap)});}
   if(!live)for(const [id,r] of s.rings)if(!r.target){s.rings.delete(id);r.halo.width=r.halo.height=1;}
   if(changed){const start=performance.now();for(const r of s.rings.values())this.cacheHalo(s,r);this.metrics.cacheMs+=performance.now()-start;this.draw(s,performance.now()/1000,0,!live);}
   this.surfaces.push(s);this.intersection.observe(host);
  }
  for(const s of old)if(!this.surfaces.includes(s))this.release(s);this.schedule();
 }
 cacheHalo(s,r){
  // Cached coloured bloom survives every LOD/DPR. Internal buffers are bounded.
  const c=s.config,e=s.extent,px=Math.min(384,s.canvas.width),ctx=r.halo.getContext('2d'),ratio=px/(e*2);r.halo.width=r.halo.height=px;ctx.setTransform(ratio,0,0,ratio,px/2,px/2);const spread=5+c.intensity*.16;
  for(const [width,alpha,blur] of [[2+c.intensity*.035,.70,spread],[1.4+c.intensity*.014,.95,spread*.4],[.8+c.intensity*.008,1,0]]){ctx.beginPath();ctx.arc(0,0,r.radius,0,TAU);ctx.strokeStyle=r.color;ctx.globalAlpha=alpha;ctx.lineWidth=width;ctx.shadowColor=r.color;ctx.shadowBlur=blur*ratio;ctx.stroke();}
 }
 draw(s,time,dt,forceStatic=false){
  const ctx=s.ctx,c=s.config,e=s.extent,ratio=s.ratio,moving=c.glow==='living'&&!this.motion.matches&&!forceStatic,brightness=Math.pow(c.brightness/100,.72),detail=this.detail,visualSize=c.size*(s.host.closest('.eye-preview-scene')?1.8:1),requested=(4+c.intensity*.045)*detail*(visualSize>100?1:Math.max(.75,c.size/140)),count=clamp(Math.ceil(requested),3,9),samples=visualSize>100?112:80;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,s.canvas.width,s.canvas.height);ctx.setTransform(ratio,0,0,ratio,s.canvas.width/2,s.canvas.height/2);ctx.lineCap='round';ctx.lineJoin='round';
  let filaments=0,beads=0;
  for(const [id,r] of s.rings){r.visibility=moving?r.visibility+(r.target-r.visibility)*(-Math.expm1(-dt/.24)):r.target;if(r.visibility<.008&&!r.target){r.halo.width=r.halo.height=1;s.rings.delete(id);continue;}ctx.globalAlpha=brightness*r.visibility*(moving?.46:1);ctx.drawImage(r.halo,-e,-e,e*2,e*2);
   if(!moving){ctx.beginPath();ctx.arc(0,0,r.radius,0,TAU);ctx.strokeStyle=r.color;ctx.lineWidth=1.8;ctx.globalAlpha=brightness*r.visibility;ctx.stroke();ctx.strokeStyle='#fff6f5';ctx.lineWidth=.45;ctx.stroke();for(let i=0;i<3;i++){ctx.beginPath();const a=i*2.1+r.index*.83;ctx.arc(0,0,r.radius,a,a+.35);ctx.globalAlpha=brightness*r.visibility*.9;ctx.lineWidth=.75;ctx.stroke();}}else{ctx.beginPath();ctx.arc(0,0,r.radius,0,TAU);ctx.strokeStyle=r.color;ctx.lineWidth=.5;ctx.globalAlpha=brightness*r.visibility*.5;ctx.stroke();}
  }
  if(moving)for(let id=0;id<count;id++)for(const r of s.rings.values()){
   const light=brightness*clamp(requested-id,0,1);
   const points=r.strands[id].points;
   for(let j=0;j<samples;j++)filamentPointInto(points,j*2,r.radius,r.index,id,j/samples*TAU,time,c.intensity);
   curve(ctx,points,samples);ctx.strokeStyle=r.color;ctx.globalAlpha=light*r.visibility*.07;ctx.lineWidth=1.8;ctx.stroke();
   if(id%3){const phase=time*(id%2?.13:-.09)+id*1.73+r.index*.46,span=TAU*(.34+.06*(id%4));ctx.beginPath();for(let k=0;k<=48;k++){along(this.scratch,points,samples,phase+k/48*span);if(k)ctx.lineTo(this.scratch[0],this.scratch[1]);else ctx.moveTo(this.scratch[0],this.scratch[1]);}}
   ctx.globalAlpha=light*r.visibility*(.38+.08*(id%3));ctx.lineWidth=.22+(id%3)*.09;ctx.stroke();filaments++;
   const pearlCount=clamp(Math.round((visualSize*.10+c.intensity*.04)*detail),6,22),direction=id%2?1:-1,speed=.026+fract((id+1)*.618+r.index*.137)*.026;
   for(let j=0;j<pearlCount;j++){
    const phase=(j/pearlCount+id*.381+r.index*.173+direction*time*speed+.018*Math.sin(time*.17+id+r.index))*TAU;
    along(this.scratch,points,samples,phase);const glint=.25+.75*(.5+.5*Math.sin(j*2.399+time*.34+id)),radius=.25+fract(j*.754+id*.327)*.8;
    ctx.globalAlpha=light*r.visibility*glint;ctx.drawImage(r.sprite,this.scratch[0]-radius*2.5,this.scratch[1]-radius*2.5,radius*5,radius*5);beads++;
    if(j%4===0){ctx.beginPath();ctx.moveTo(this.scratch[0],this.scratch[1]);for(let k=1;k<=5;k++){along(this.scratch,points,samples,phase-direction*k*.017);ctx.lineTo(this.scratch[0],this.scratch[1]);}ctx.strokeStyle=r.color;ctx.lineWidth=.65;ctx.globalAlpha=light*r.visibility*.8;ctx.stroke();}
   }
  }
  s.stats={filaments,beads,colors:[...s.rings.values()].map(r=>r.color),activeColors:[...s.rings.values()].filter(r=>r.target).map(r=>r.color),samples,pixels:s.canvas.width,cacheBytes:[...s.rings.values()].reduce((sum,r)=>sum+r.halo.width*r.halo.height*4,0)};this.metrics.paths=s.rings.size;this.metrics.filaments=filaments;this.metrics.beads=beads;
 }
 schedule(){if(this.destroyed)return;const live=!document.hidden&&!this.blurred&&!this.motion.matches&&this.surfaces.some(s=>s.config.glow==='living'&&s.rings.size&&this.visible(s));if(!live){this.stop();return;}if(this.frame===null)this.frame=requestWeatherFrame(t=>this.tick(t));}
 tick(time){this.frame=null;const delta=this.tickLast?Math.min(150,time-this.tickLast):16.7;this.tickLast=time;this.gap=this.gap*.96+delta*.04;neonQualityStep(this.quality,this.gap,this.cost,time);const interval=[33,42,55][this.quality.level];if(time-this.last>=interval){const start=performance.now(),dt=Math.min(.12,(time-this.last)/1000);this.detail+=([1,.76,.55][this.quality.level]-this.detail)*(-Math.expm1(-dt/.8));for(const s of this.surfaces)if(s.config.glow==='living'&&this.visible(s))this.draw(s,time/1000,dt);const cpu=performance.now()-start;this.cost=this.cost*.9+cpu*.1;this.metrics.frames++;this.metrics.cpuMs+=cpu;this.metrics.maxMs=Math.max(this.metrics.maxMs,cpu);this.metrics.quality=this.quality.level;this.last=time;}this.schedule();}
 stop(){if(this.frame!==null)cancelWeatherFrame(this.frame);this.frame=null;this.tickLast=0;}
 destroy(){this.destroyed=true;this.stop();this.intersection.disconnect();this.motion.removeEventListener('change',this.motionChange);document.removeEventListener('visibilitychange',this.visibility);window.removeEventListener('blur',this.blur);window.removeEventListener('focus',this.focus);window.removeEventListener('pagehide',this.blur);window.removeEventListener('pageshow',this.focus);for(const s of this.surfaces)this.release(s);this.surfaces=[];}
}
export const NEON_CSS=`.eye-status-ring{background:none!important;box-shadow:none!important;opacity:0!important}.eye-preview-bubbles{pointer-events:none}.eye-preview-bubbles .eye-hub-bubble{pointer-events:auto!important;cursor:pointer}.eye-preview-bubbles .eye-hub-bubble:focus-visible{outline:2px solid #fff0b3;outline-offset:3px}.eye-glow-choice{grid-column:1/-1;display:flex;gap:8px;align-items:center;margin:8px 0}.eye-glow-choice button[aria-pressed=true]{border-color:#fff0b3;box-shadow:inset 0 0 10px #ffd45c44,0 0 4px #ffd45c66}.eye-color-button i,.eye-color-choice i{box-shadow:0 0 4px var(--eye-color),0 0 12px var(--eye-color),inset 0 0 3px #fff8}.eye-preview-caption{display:flex;align-items:center;gap:8px;justify-content:space-between;flex-wrap:wrap}.eye-preview-caption button{font-size:11px;min-height:36px}.eye-page-controls{position:absolute;top:8px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;color:#ffe5a1;pointer-events:auto;background:#0c141bdf;border:1px solid #c4a05b;border-radius:12px;padding:4px;z-index:5}.eye-page-controls button{min-width:44px;min-height:44px;border:1px solid #c4a05b;border-radius:8px;background:#16222c;color:#ffe5a1}`;

import { WIND_COLORS,windBarbParts,windDestination } from './wind-data.js?v=411149r1';

// Symbols are local to WR-resolved points. This is deliberately not a spatial field sampler.
export function drawWindGlyph(ctx,mode,speed,angle,color='#fff'){
 ctx.save();ctx.rotate(angle);ctx.lineCap='round';ctx.lineJoin='round';
 const stroke=(width,ink)=>{ctx.lineWidth=width;ctx.strokeStyle=ink;ctx.stroke();};
 const path=()=>{
  ctx.beginPath();
  if(mode==='arrows'){
   if(speed===0){ctx.arc(0,0,4,0,Math.PI*2);return;}
   ctx.moveTo(-13,0);ctx.lineTo(13,0);ctx.moveTo(5,-6);ctx.lineTo(13,0);ctx.lineTo(5,6);return;
  }
  const b=windBarbParts(speed);if(!b)return;
  if(b.calm){ctx.arc(0,0,4,0,Math.PI*2);return;}
  // angle is flow TO; the staff points towards wind FROM.
  ctx.moveTo(0,0);ctx.lineTo(-26,0);let x=-26;
  for(let i=0;i<Math.min(8,b.pennants);i++,x+=8){ctx.moveTo(x,0);ctx.lineTo(x-2,-10);ctx.lineTo(x+7,0);}
  if(b.pennants)x+=3;
  for(let i=0;i<b.full;i++,x+=5){ctx.moveTo(x,0);ctx.lineTo(x-4,-10);}
  if(b.half){if(!b.pennants&&!b.full)x+=5;ctx.moveTo(x,0);ctx.lineTo(x-2,-5);}
 };
 path();stroke(4.8,color==='#111318'?'#fff9':'#080c14cc');path();stroke(2,color);if(mode!=='arrows'&&windBarbParts(speed)?.pennants){ctx.fillStyle=color;ctx.fill();}ctx.restore();
}
export function projectedWind(map,point,lon=point.lon){
 const origin=map.latLngToContainerPoint([point.lat,lon]);
 const dest=windDestination(point.lat,lon,point.from??0);
 const end=map.latLngToContainerPoint([dest.lat,dest.lng]);
 return {x:origin.x,y:origin.y,angle:Math.atan2(end.y-origin.y,end.x-origin.x)};
}
export function visibleWindCopies(map,points){
 const bounds=map.getBounds(),west=bounds.getWest(),east=bounds.getEast(),size=map.getSize(),out=[];
 for(const p of points){
  const middle=Math.round(((west+east)/2-p.lon)/360),first=Math.max(middle-8,Math.ceil((west-p.lon)/360)),last=Math.min(middle+8,Math.floor((east-p.lon)/360));
  for(let k=first;k<=last;k++){
   const projected=projectedWind(map,p,p.lon+360*k);
   if(projected.x>=-35&&projected.y>=-35&&projected.x<=size.x+35&&projected.y<=size.y+35)out.push({...projected,point:p});
  }
 }
 return out;
}
const seed=key=>{let n=2166136261;for(const c of key)n=Math.imul(n^c.charCodeAt(0),16777619);return (n>>>0)/4294967296;};
export class WindCanvas {
 constructor(map,canvas,{raf=globalThis.requestAnimationFrame.bind(globalThis),cancel=globalThis.cancelAnimationFrame.bind(globalThis),now=()=>performance.now(),reduced=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true,onMetrics=()=>{}}={}){
  Object.assign(this,{map,canvas,raf,cancel,now,reduced,onMetrics});this.ctx=canvas.getContext('2d');this.points=[];this.phases=new Map();this.config={};this.clock=0;this.last=null;this.frame=null;this.destroyed=false;this.hidden=false;this.quality=1;this.cost=0;this.draws=0;
  this.invalidate=()=>this.schedule();this.visibility=()=>{this.hidden=document.hidden;this.last=null;if(this.hidden)this.stop();else this.schedule();};
  this.motion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');this.motionChange=()=>{this.last=null;this.schedule();};this.motion?.addEventListener?.('change',this.motionChange);
  map.on('move zoom resize rotate viewreset',this.invalidate);document.addEventListener('visibilitychange',this.visibility);this.hidden=document.hidden;
 }
 update(points,config){this.points=points;this.config=config;const keys=new Set(points.map(p=>p.key));for(const key of this.phases.keys())if(!keys.has(key))this.phases.delete(key);this.last=null;this.schedule();}
 moving(){return this.config.enabled&&this.config.mode==='animated'&&!this.config.paused&&(!this.reduced()||this.config.animationExplicit)&&!this.hidden&&this.points.some(p=>p.speed>0);}
 schedule(){if(!this.destroyed&&!this.hidden&&this.frame===null)this.frame=this.raf(t=>{this.frame=null;this.paint(t);});}
 stop(){if(this.frame!==null)this.cancel(this.frame);this.frame=null;this.last=null;}
 paint(time){
  if(this.destroyed||this.hidden)return;
  const start=this.now(),s=this.map.getSize(),ratio=Math.min(globalThis.devicePixelRatio||1,2,Math.sqrt(6000000/Math.max(1,s.x*s.y))),w=Math.max(1,Math.round(s.x*ratio)),h=Math.max(1,Math.round(s.y*ratio));
  if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}this.canvas.style.width=s.x+'px';this.canvas.style.height=s.y+'px';
  const ctx=this.ctx;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,s.x,s.y);
  const moving=this.moving();if(moving&&this.last!==null)this.clock+=Math.max(0,Math.min(.08,(time-this.last)/1000));this.last=moving?time:null;
  const copies=this.config.enabled?visibleWindCopies(this.map,this.points):[],color=WIND_COLORS.find(c=>c.id===this.config.color)?.hex||'#fff';let segments=0;
  for(const item of copies){
   const {x,y,angle,point:p}=item;ctx.save();ctx.translate(x,y);
   if(this.config.mode!=='animated'||p.speed===0){drawWindGlyph(ctx,this.config.mode==='arrows'?'arrows':'barbs',p.speed,angle,color);ctx.restore();continue;}
   ctx.rotate(angle);
   // Small local vector symbols, not trajectories between isolated forecast locations.
   const count=Math.max(3,Math.round(({low:6,normal:12,high:20}[this.config.density]||12)*this.quality));
   const rate=Math.min(1.2,.06+.1*Math.sqrt(p.speed))*({slow:.55,normal:1,fast:1.7}[this.config.tempo]||1);
   const phaseState=this.phases.get(p.key)||{phase:0,clock:this.clock};phaseState.phase=(phaseState.phase+(this.clock-phaseState.clock)*rate)%1;phaseState.clock=this.clock;this.phases.set(p.key,phaseState);
   for(let i=0;i<count;i++){
    const q=seed(p.key+'/'+i),phase=(q+phaseState.phase)%1,cross=(seed(p.key+'/cross/'+i)-.5)*35;
    const pos=-20+40*phase,alpha=Math.sin(Math.PI*phase)*.88,len=5+5*seed(p.key+'/len/'+i);
    ctx.globalAlpha=alpha;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(pos-len/2,cross);ctx.lineTo(pos+len/2,cross);
    ctx.lineWidth=3.4;ctx.strokeStyle=color==='#111318'?'#fff9':'#08101999';ctx.stroke();ctx.lineWidth=1.4;ctx.strokeStyle=color;ctx.stroke();segments++;
   }
   ctx.globalAlpha=.4;ctx.beginPath();ctx.arc(0,0,2,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.restore();
  }
  const cost=Math.max(0,this.now()-start);this.cost=this.cost*.95+cost*.05;this.draws++;
  if(this.cost>10)this.quality=Math.max(.3,this.quality-.025);else if(this.cost<4)this.quality=Math.min(1,this.quality+.002);
  this.onMetrics({segments,points:this.points.length,copies:copies.length,draws:this.draws,renderCostMs:this.cost,densityFactor:this.quality,moving});
  if(moving)this.schedule();
 }
 destroy(){this.destroyed=true;this.stop();this.map.off('move zoom resize rotate viewreset',this.invalidate);document.removeEventListener('visibilitychange',this.visibility);this.motion?.removeEventListener?.('change',this.motionChange);this.points=[];this.phases.clear();this.canvas.remove();this.canvas.width=this.canvas.height=1;}
}

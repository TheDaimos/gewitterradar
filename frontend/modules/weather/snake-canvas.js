import {requestWeatherFrame,cancelWeatherFrame} from './frame-clock.js?v=411156r1';
import {windViewportProjection,windMercatorLatitude} from './wind-canvas.js?v=411161r1';
import {sampleWindFieldInto,windFieldSnapshot,windFieldOverlaps,windFieldVisibleBounds} from './wind-field.js?v=411161r1';
import {SnakeGeometry,createSnakeParticle,SNAKE_HISTORY_CAPACITY} from './snake-geometry.js?v=411161r1';
import {normalizeSnakeConfig} from './snake-config.js?v=411161r1';
const fade=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export class SnakeCanvas{
 constructor(map,canvas,{raf=requestWeatherFrame,cancel=cancelWeatherFrame,onMetrics=()=>{},now=()=>performance.now(),random=Math.random}={}){
  Object.assign(this,{map,canvas,raf,cancel,onMetrics,now,random});this.ctx=canvas.getContext('2d');this.geometry=new SnakeGeometry();this.particles=[];this.field=null;this.config={};this.frame=null;this.last=null;this.nextId=0;this.quality=1;this.cost=0;this.hidden=document.hidden;this.destroyed=false;this.mapMoving=false;this.dirty=true;this.seedFailures=0;this.seedBlocked=false;this.metrics={};this.published=0;this.draws=0;this.costs=new Float32Array(120);this.costCount=0;this.costCursor=0;
  this.invalidate=()=>{this.dirty=true;this.seedBlocked=false;this.seedFailures=0;this.schedule();};this.start=()=>{this.mapMoving=true;this.last=null;};this.end=()=>{this.mapMoving=false;this.invalidate();};
  map.on('move zoom resize rotate viewreset',this.invalidate);map.on('movestart zoomstart',this.start);map.on('moveend zoomend',this.end);
  this.visibility=()=>{this.hidden=document.hidden;this.last=null;if(this.hidden)this.stop();else this.schedule();};document.addEventListener('visibilitychange',this.visibility);
  this.motion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');this.motionChange=()=>{this.last=null;this.schedule();};this.motion?.addEventListener?.('change',this.motionChange);
 }
 update(field,config){
  if(this.field&&field&&windFieldSnapshot(this.field)!==windFieldSnapshot(field))for(const a of this.particles)a.active=false;
  if(this.field!==field){this.seedBlocked=false;this.seedFailures=0;this.dirty=true;}this.field=field;this.config=config;this.snake=normalizeSnakeConfig(config.snake);this.last=null;this.canvas.hidden=!config.visible||!config.enabled;this.schedule();
 }
 authorized(){return this.field&&this.field.deadline>Date.now()&&this.config.visible&&this.config.enabled;}
 moving(){return this.authorized()&&!this.hidden&&!this.mapMoving&&!this.config.paused&&(!this.motion?.matches||this.config.animationExplicit)&&!this.seedBlocked&&this.overlap!==false&&Boolean(this.projection)&&this.field.hasMotion!==false;}
 schedule(){if(!this.destroyed&&!this.hidden&&this.frame===null)this.frame=this.raf(t=>{this.frame=null;this.paint(t);});}
 stop(){if(this.frame!==null)this.cancel(this.frame);this.frame=null;this.last=null;}
 spawn(a,p,size){
  const c=this.snake;for(let trial=0;trial<5;trial++){
   // Stratified screen seeds are a visual distribution, never generated wind.
   const slot=this.nextId+trial,x=((slot*.61803398875)%1)*size.x,y=((slot*.41421356237+this.random()*.09)%1)*size.y,lon=p.ox+p.ax*x+p.bx*y,my=p.oy+p.ay*x+p.by*y;
   a.id=++this.nextId;if(this.geometry.seed(this.field,a,p,lon,my,c)){a.life=10+this.random()*10;return true;}
  }return false;
 }
 paint(time){
  if(this.destroyed||this.hidden)return;const started=this.now(),size=this.map.getSize(),ratio=Math.min(globalThis.devicePixelRatio||1,2,Math.sqrt(4000000/Math.max(1,size.x*size.y))),w=Math.max(1,Math.round(size.x*ratio)),h=Math.max(1,Math.round(size.y*ratio));
  if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;this.canvas.style.width=size.x+'px';this.canvas.style.height=size.y+'px';this.dirty=true;}
  if(this.dirty){this.projection=windViewportProjection(this.map,size);this.overlap=this.field?windFieldOverlaps(this.field,windFieldVisibleBounds(this.map)):false;this.dirty=false;}
  const ctx=this.ctx;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,size.x,size.y);const p=this.projection,c=this.snake,moving=this.moving(),dt=moving&&this.last!==null?Math.max(0,Math.min(.05,(time-this.last)/1000)):0;this.last=moving?time:null;
  let active=0,drawn=0,minLength=Infinity,maxLength=0;const mobile=size.x<700||((globalThis.navigator?.deviceMemory||8)<=4),cap=mobile?180:420;
  const span=Math.max(1,this.map.getBounds().getEast()-this.map.getBounds().getWest()),unique=Math.min(1,360/span),target=Math.max(12,Math.min(cap,Math.round(size.x*size.y/7000*c.density*this.quality*unique)));
  let spawnBudget=moving?(this.cost>4?1:2):8;
  if(this.authorized()&&this.overlap&&p){
   const slots=Math.max(target,this.particles.length);for(let i=0;i<slots;i++){
    let a=this.particles[i];if(!a){a=createSnakeParticle(0);this.particles.push(a);}
    if(a.active&&i>=target&&!a.dying){a.dying=true;a.deathAge=a.age;}
    if(a.active&&(a.age>=a.life||a.dying&&a.age-a.deathAge>=.8))a.active=false;
    if(!a.active&&i<target&&spawnBudget>0){spawnBudget--;if(!this.spawn(a,p,size)){this.seedFailures++;continue;}this.seedFailures=0;if(!moving)a.age=.75;}
    if(!a.active)continue;active++;
    if(!this.geometry.advance(this.field,a,p,dt,c)){a.active=false;continue;}
    if(!this.geometry.build(this.field,a,p,c))continue;
    const x=this.geometry.xy[0],y=this.geometry.xy[1],margin=c.maxLength+8;
    if(x< -margin||x>size.x+margin||y< -margin||y>size.y+margin){a.active=false;continue;}
    const alpha=c.opacity/100*fade(a.age/.75)*fade((a.life-a.age)/.9)*(a.dying?fade(1-(a.age-a.deathAge)/.8):1);
    this.geometry.draw(ctx,this.config.symbolColor||'#ffffff',alpha);drawn++;minLength=Math.min(minLength,this.geometry.length);maxLength=Math.max(maxLength,this.geometry.length);
    if(span>360){const worlds=Math.min(8,Math.ceil(span/360));for(let k=1;k<=worlds;k++)for(const sign of [-1,1]){ctx.save();ctx.translate(sign*k*360*p.ex,sign*k*360*p.ey);this.geometry.draw(ctx,this.config.symbolColor||'#ffffff',alpha);ctx.restore();}}
   }
  }
  if(!active&&this.seedFailures>15)this.seedBlocked=true;
  const cost=Math.max(0,this.now()-started);this.cost=this.cost*.92+cost*.08;this.draws++;this.costs[this.costCursor]=cost;this.costCursor=(this.costCursor+1)%120;this.costCount=Math.min(120,this.costCount+1);
  if(this.cost>7)this.quality=Math.max(.35,this.quality-.008);else if(this.cost<3)this.quality=Math.min(1,this.quality+.002);
  if(time-this.published>=750||!moving){
   const values=Array.from(this.costs.subarray(0,this.costCount)).sort((a,b)=>a-b);Object.assign(this.metrics,{renderer:'snake',moving,particles:active,segments:drawn,targetParticles:target,particleCap:cap,historyCapacity:SNAKE_HISTORY_CAPACITY,historyBytes:this.particles.length*SNAKE_HISTORY_CAPACITY*16,meanRenderMs:values.reduce((a,b)=>a+b,0)/Math.max(1,values.length),p95RenderMs:values[Math.floor(values.length*.95)]||0,maxRenderMs:values.at(-1)||0,minLength:Number.isFinite(minLength)?minLength:0,maxLength,quality:this.quality,fieldNodes:this.field?.grid.u.length||0,seedBlocked:this.seedBlocked});this.published=time;this.onMetrics(this.metrics);
  }
  if(this.moving())this.schedule();
 }
 destroy(){this.destroyed=true;this.stop();this.map.off('move zoom resize rotate viewreset',this.invalidate);this.map.off('movestart zoomstart',this.start);this.map.off('moveend zoomend',this.end);document.removeEventListener('visibilitychange',this.visibility);this.motion?.removeEventListener?.('change',this.motionChange);this.particles.length=0;this.field=null;this.canvas.remove();this.canvas.width=this.canvas.height=1;}
}

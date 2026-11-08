import {requestWeatherFrame,cancelWeatherFrame} from './frame-clock.js?v=411156r1';
import {windViewportProjection} from './wind-canvas.js?v=411162r1';
import {windFieldSnapshot,windFieldOverlaps,windFieldVisibleBounds} from './wind-field.js?v=411162r1';
import {SnakeGeometry,createSnakeParticle,SNAKE_HISTORY_CAPACITY} from './snake-geometry.js?v=411162r1';
import {normalizeSnakeConfig,snakeDensityPlan,adaptSnakeLoad} from './snake-config.js?v=411162r1';
const fade=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export class SnakeCanvas{
 constructor(map,canvas,{raf=requestWeatherFrame,cancel=cancelWeatherFrame,onMetrics=()=>{},now=()=>performance.now(),random=Math.random}={}){
  Object.assign(this,{map,canvas,raf,cancel,onMetrics,now,random});this.ctx=canvas.getContext('2d');this.geometry=new SnakeGeometry();this.particles=[];this.field=null;this.config={};this.frame=null;this.last=null;this.lastPaint=null;this.nextId=0;this.quality=1;this.cost=0;this.load={cost:0,quality:1,interval:1000/30};this.occupancy=new Uint16Array(0);this.seedCursor=0;this.hidden=document.hidden;this.destroyed=false;this.mapMoving=false;this.dirty=true;this.force=true;this.seedFailures=0;this.seedBlocked=false;this.metrics={};this.published=0;this.draws=0;this.costs=new Float32Array(120);this.costCount=0;this.costCursor=0;
  this.invalidate=()=>{this.dirty=true;this.fillStalls=0;this.seedBlocked=false;this.seedFailures=0;this.schedule();};this.start=()=>{this.mapMoving=true;this.last=null;};this.end=()=>{this.mapMoving=false;this.invalidate();};
  map.on('move zoom resize rotate viewreset',this.invalidate);map.on('movestart zoomstart',this.start);map.on('moveend zoomend',this.end);
  this.visibility=()=>{this.hidden=document.hidden;this.last=null;if(this.hidden)this.stop();else this.schedule();};document.addEventListener('visibilitychange',this.visibility);
  this.motion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');this.motionChange=()=>{this.last=null;this.schedule();};this.motion?.addEventListener?.('change',this.motionChange);
 }
 update(field,config){
  if(this.field&&field&&windFieldSnapshot(this.field)!==windFieldSnapshot(field))for(const a of this.particles)a.active=false;
  if(this.field!==field){this.seedBlocked=false;this.seedFailures=0;this.dirty=true;}this.field=field;this.config=config;this.snake=normalizeSnakeConfig(config.snake);this.fillStalls=0;this.force=true;this.canvas.hidden=!config.visible||!config.enabled;this.schedule();
 }
 authorized(){return this.field&&this.field.deadline>Date.now()&&this.config.visible&&this.config.enabled;}
 moving(){return this.authorized()&&!this.hidden&&!this.mapMoving&&!this.config.paused&&(!this.motion?.matches||this.config.animationExplicit)&&!this.seedBlocked&&this.overlap!==false&&Boolean(this.projection)&&this.field.hasMotion!==false;}
 schedule(){if(!this.destroyed&&!this.hidden&&this.frame===null)this.frame=this.raf(t=>{this.frame=null;this.paint(t);});}
 stop(){if(this.frame!==null)this.cancel(this.frame);this.frame=null;this.last=null;}
 distribution(p,size,target,moving,rebalance){
  this.columns=Math.max(1,Math.round(Math.sqrt(target*size.x/size.y/2)));this.rows=Math.max(1,Math.ceil(target/2/this.columns));const cells=this.columns*this.rows;
  if(this.occupancy.length!==cells)this.occupancy=new Uint16Array(cells);else this.occupancy.fill(0);
  for(const a of this.particles)if(a.active)this.occupy(a,p,size);
  const limit=Math.ceil(target/cells)+1;
  if(rebalance)for(const a of this.particles)if(a.active&&!a.dying&&(a.age>1||!moving)){
   const cell=this.cell(a,p,size);if(cell>=0&&this.occupancy[cell]>limit){this.occupancy[cell]--;if(moving){a.dying=true;a.deathAge=a.age;}else a.active=false;}
  }
 }
 cell(a,p,size){const dx=a.lon+360*Math.round((p.ox-a.lon)/360)-p.ox,dy=a.my-p.oy,x=dx*p.ex+dy*p.nx,y=dx*p.ey+dy*p.ny;return x>=0&&y>=0&&x<size.x&&y<size.y?Math.floor(y/size.y*this.rows)*this.columns+Math.floor(x/size.x*this.columns):-1;}
 occupy(a,p,size){const cell=this.cell(a,p,size);if(cell>=0)this.occupancy[cell]++;}
 spawn(a,p,size){
  const c=this.snake,cells=this.occupancy.length;for(let trial=0;trial<4;trial++){
   // Prefer underoccupied screen cells. This changes seeds, never wind vectors.
   let cell=0,score=Infinity;for(let k=0;k<12;k++){const candidate=Math.floor(((++this.seedCursor*.61803398875)%1)*cells),value=this.occupancy[candidate];if(value<score){cell=candidate;score=value;if(!score)break;}}
   const x=(cell%this.columns+.15+this.random()*.7)/this.columns*size.x,y=(Math.floor(cell/this.columns)+.15+this.random()*.7)/this.rows*size.y,lon=p.ox+p.ax*x+p.bx*y,my=p.oy+p.ay*x+p.by*y;
   a.id=++this.nextId;if(this.geometry.seed(this.field,a,p,lon,my,c)){a.life=10+this.random()*10;this.occupy(a,p,size);return true;}
   this.occupancy[cell]++;
  }return false;
 }
 paint(time){
  if(this.destroyed||this.hidden)return;if(!this.force&&!this.dirty&&this.moving()&&this.lastPaint!==null&&time-this.lastPaint<this.load.interval-1){this.schedule();return;}this.force=false;this.lastPaint=time;
  const started=this.now(),size=this.map.getSize(),ratio=Math.min(globalThis.devicePixelRatio||1,2,Math.sqrt(4000000/Math.max(1,size.x*size.y))),w=Math.max(1,Math.round(size.x*ratio)),h=Math.max(1,Math.round(size.y*ratio));
  if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;this.canvas.style.width=size.x+'px';this.canvas.style.height=size.y+'px';this.dirty=true;}
  const reprojected=this.dirty;if(this.dirty){this.projection=windViewportProjection(this.map,size);this.overlap=this.field?windFieldOverlaps(this.field,windFieldVisibleBounds(this.map)):false;this.dirty=false;}
  const ctx=this.ctx;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,size.x,size.y);const p=this.projection,c=this.snake,moving=this.moving(),dt=moving&&this.last!==null?Math.max(0,Math.min(.1,(time-this.last)/1000)):0;this.last=moving?time:null;
  let active=0,drawn=0,spawned=0,minLength=Infinity,maxLength=0;const mobile=Math.min(size.x,size.y)<700||((globalThis.navigator?.deviceMemory||8)<=4),span=Math.max(1,this.map.getBounds().getEast()-this.map.getBounds().getWest()),plan=snakeDensityPlan(size.x,size.y,this.map.getZoom?.()??5,span,c,this.load.quality,mobile),target=plan.effective;
  const previous=this.particles.reduce((n,a)=>n+(a.active&&!a.dying?1:0),0),deficit=Math.max(0,target-previous),spawnBudget=Math.min(32,Math.max(3,Math.ceil(deficit*.2+target*dt/14)));let seedsLeft=spawnBudget;
  if(this.authorized()&&this.overlap&&p){
   const rebalance=reprojected||moving&&time-(this.lastRebalanced||0)>2500;if(rebalance)this.lastRebalanced=time;this.distribution(p,size,target,moving,rebalance);const slots=Math.max(target,this.particles.length);for(let i=0;i<slots;i++){
    let a=this.particles[i];if(!a){a=createSnakeParticle(0);this.particles.push(a);}
    if(!moving&&i>=target)a.active=false;
    if(a.active&&i>=target&&!a.dying){a.dying=true;a.deathAge=a.age;}
    if(a.active&&(a.age>=a.life||a.dying&&a.age-a.deathAge>=.8))a.active=false;
    if(!a.active&&i<target&&seedsLeft>0&&(spawned===0||this.now()-started<Math.max(4,this.load.interval*.2))){seedsLeft--;if(!this.spawn(a,p,size)){this.seedFailures++;continue;}spawned++;if(!moving)a.age=.75;}
    if(!a.active)continue;active++;
    if(!this.geometry.advance(this.field,a,p,dt,c)){a.active=false;active--;continue;}
    if(!this.geometry.build(this.field,a,p,c)){a.active=false;active--;this.seedFailures++;continue;}this.seedFailures=0;
    const x=this.geometry.xy[0],y=this.geometry.xy[1],margin=c.maxLength+8;
    if(x< -margin||x>size.x+margin||y< -margin||y>size.y+margin){a.active=false;active--;continue;}
    const alpha=c.opacity/100*fade(a.age/.75)*fade((a.life-a.age)/.9)*(a.dying?fade(1-(a.age-a.deathAge)/.8):1);
    this.geometry.draw(ctx,this.config.symbolColor||'#ffffff',alpha);drawn++;minLength=Math.min(minLength,this.geometry.length);maxLength=Math.max(maxLength,this.geometry.length);
    if(span>360){const worlds=Math.min(8,Math.ceil(span/360));for(let k=1;k<=worlds;k++)for(const sign of [-1,1]){ctx.save();ctx.translate(sign*k*360*p.ex,sign*k*360*p.ey);this.geometry.draw(ctx,this.config.symbolColor||'#ffffff',alpha);ctx.restore();}}
   }
  }
  if(!active&&this.seedFailures>15)this.seedBlocked=true;
  this.fillStalls=!moving&&active<target&&(spawned===0||active<=(this.lastActive||0))?(this.fillStalls||0)+1:0;this.lastActive=active;
  const cost=Math.max(0,this.now()-started);if(moving)adaptSnakeLoad(this.load,cost,time);this.cost=this.load.cost;this.quality=this.load.quality;this.draws++;this.costs[this.costCursor]=cost;this.costCursor=(this.costCursor+1)%120;this.costCount=Math.min(120,this.costCount+1);
  if(time-this.published>=750||!moving){
   const values=Array.from(this.costs.subarray(0,this.costCount)).sort((a,b)=>a-b);Object.assign(this.metrics,{renderer:'snake',moving,particles:active,segments:drawn,spawned,requestedParticles:plan.requested,targetParticles:target,particleCap:plan.cap,userDensity:c.density,zoomFactor:plan.zoomFactor,temporaryDensityLimit:this.quality<1?this.quality:null,capLimited:plan.requested>plan.cap,frameIntervalMs:this.load.interval,historyCapacity:SNAKE_HISTORY_CAPACITY,historyBytes:this.particles.length*SNAKE_HISTORY_CAPACITY*16,meanRenderMs:values.reduce((a,b)=>a+b,0)/Math.max(1,values.length),p95RenderMs:values[Math.floor(values.length*.95)]||0,maxRenderMs:values.at(-1)||0,minLength:Number.isFinite(minLength)?minLength:0,maxLength,quality:this.quality,fieldNodes:this.field?.grid.u.length||0,seedBlocked:this.seedBlocked});this.published=time;this.onMetrics(this.metrics);
  }
  if(this.moving()||this.authorized()&&this.overlap&&!this.seedBlocked&&active<target&&this.fillStalls<8)this.schedule();
 }
 destroy(){this.destroyed=true;this.stop();this.map.off('move zoom resize rotate viewreset',this.invalidate);this.map.off('movestart zoomstart',this.start);this.map.off('moveend zoomend',this.end);document.removeEventListener('visibilitychange',this.visibility);this.motion?.removeEventListener?.('change',this.motionChange);this.particles.length=0;this.field=null;this.canvas.remove();this.canvas.width=this.canvas.height=1;}
}

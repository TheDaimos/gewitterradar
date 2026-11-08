import {FlowGeometry,flowIsCurved,flowLength} from './flow-geometry.js?v=411157r1';
import { WIND_COLORS,windBarbParts,windDestination } from './wind-data.js?v=411159r1';
import { sampleWindField,sampleWindFieldInto,windFieldStepValid,writeWindFieldColor,windFieldGlyphs,windFieldSnapshot,windFieldVisibleBounds,windFieldOverlaps } from './wind-field.js?v=411153r1';

const DEG=Math.PI/180;
export const windMercatorY=lat=>Math.log(Math.tan(Math.PI/4+Math.max(-89.9,Math.min(89.9,lat))*DEG/2))/DEG;
export const windMercatorLatitude=y=>(2*Math.atan(Math.exp(y*DEG))-Math.PI/2)/DEG;
export function windViewportProjection(map,size=map.getSize()){
 if(map.options?.crs?.code!=='EPSG:3857')return null;
 const a=map.containerPointToLatLng([0,0]),b=map.containerPointToLatLng([size.x,0]),c=map.containerPointToLatLng([0,size.y]);
 const ox=a.lng,oy=windMercatorY(a.lat),ax=(b.lng-ox)/size.x,ay=(windMercatorY(b.lat)-oy)/size.x,bx=(c.lng-ox)/size.y,by=(windMercatorY(c.lat)-oy)/size.y,det=ax*by-ay*bx;
 if(!Number.isFinite(det)||Math.abs(det)<1e-20)return null;
 const ex=by/det,ey=-ay/det,nx=-bx/det,ny=ax/det,scale=Math.hypot(ex,ey);
 return {ox,oy,ax,ay,bx,by,ex,ey,nx,ny,eastX:ex/scale,eastY:ey/scale,northX:nx/scale,northY:ny/scale,
  screen(lon,y,out){const dx=lon-ox,dy=y-oy;out[0]=dx*ex+dy*nx;out[1]=dx*ey+dy*ny;return out;}};
}
export function smoothWindDirection(p,u,v,turn,epoch){
 if(p.epoch!==epoch||!Number.isFinite(p.du)){p.du=u;p.dv=v;p.epoch=epoch;return;}
 if(!turn)return;const dot=p.du*u+p.dv*v;
 if(dot<-.95){const angle=Math.atan2(p.du*v-p.dv*u,dot)*turn,c=Math.cos(angle),s=Math.sin(angle),du=p.du;p.du=du*c-p.dv*s;p.dv=du*s+p.dv*c;}
 else{p.du+=(u-p.du)*turn;p.dv+=(v-p.dv)*turn;const len=Math.hypot(p.du,p.dv);if(len){p.du/=len;p.dv/=len;}}
}

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
export function windScreenBasis(map){
 if(typeof map.project!=='function'||typeof map.unproject!=='function'||typeof map.getCenter!=='function'||map.options?.crs?.code!=='EPSG:3857')return null;
 const ll=map.getCenter(),a=map.project(ll),origin=map.latLngToContainerPoint(ll),east=map.latLngToContainerPoint(map.unproject([a.x+32,a.y])),south=map.latLngToContainerPoint(map.unproject([a.x,a.y+32]));
 return {ex:east.x-origin.x,ey:east.y-origin.y,sx:south.x-origin.x,sy:south.y-origin.y};
}
export function projectedWind(map,point,lon=point.lon,basis=null){
 const origin=map.latLngToContainerPoint([point.lat,lon]);
 if(basis){const angle=(point.from??0)*Math.PI/180,u=-Math.sin(angle),south=Math.cos(angle);return {x:origin.x,y:origin.y,angle:Math.atan2(u*basis.ey+south*basis.sy,u*basis.ex+south*basis.sx)};}
 const dest=windDestination(point.lat,lon,point.from??0);
 if(typeof map.project==='function'&&typeof map.unproject==='function'){
  // Leaflet rounds layer points to integer pixels. A 100 m endpoint may then
  // equal its origin at overview zooms, falsely turning every flow eastwards.
  // Preserve the unrounded geographic vector and map it through a 32 px basis,
  // including the map's actual rotation, rather than rounding the tiny vector.
  const a=map.project([point.lat,lon]),b=map.project([dest.lat,dest.lng]);
  const east=map.latLngToContainerPoint(map.unproject([a.x+32,a.y]));
  const south=map.latLngToContainerPoint(map.unproject([a.x,a.y+32]));
  const dx=(b.x-a.x)*(east.x-origin.x)+(b.y-a.y)*(south.x-origin.x);
  const dy=(b.x-a.x)*(east.y-origin.y)+(b.y-a.y)*(south.y-origin.y);
  return {x:origin.x,y:origin.y,angle:Math.atan2(dy,dx)};
 }
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
  Object.assign(this,{map,canvas,raf,cancel,now,reduced,onMetrics});this.ctx=canvas.getContext('2d');this.flowGeometry=new FlowGeometry();this.flowEpoch=0;this.flowQuality=.6;this.points=[];this.phases=new Map();this.config={};this.clock=0;this.last=null;this.frame=null;this.destroyed=false;this.hidden=false;this.quality=1;this.cost=0;this.draws=0;
  this.field=null;this.particles=[];this.pool=[];this.fieldImage=null;this.spareImage=null;this.fieldDirty=true;this.mapMoving=false;this.fieldRenders=0;this.advected=0;this.projectionDirty=true;this.projection=null;this.scratch=new Float64Array(5);this.screenScratch=new Float64Array(2);this.metrics={};this.directionEpoch=0;this.lookups=0;this.colorJob=null;this.colorCpuMs=0;this.colorWallMs=0;this.lastFieldChange=null;this.perfCosts=new Float32Array(180);this.perfIntervals=new Float32Array(180);this.perfCount=0;this.perfCursor=0;this.perfPublished=0;this.lastPerfTime=null;
  this.overlapsView=true;this.overlapDirty=true;this.seedRetry=new Float64Array(2200);this.imageProjection=new Float64Array(6);
  this.invalidate=()=>{this.fieldDirty=true;this.projectionDirty=true;this.overlapDirty=true;this.seedRetry.fill(0);this.schedule();};
  this.moveStart=()=>{this.mapMoving=true;};this.moveEnd=()=>{this.mapMoving=false;this.reseedFrames=12;this.invalidate();};
  map.on('movestart zoomstart',this.moveStart);map.on('moveend zoomend',this.moveEnd);
  this.visibility=()=>{this.hidden=document.hidden;this.last=this.lastPerfTime=null;if(this.hidden){this.cancelPreparation();this.stop();}else this.schedule();};
  this.motion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');this.motionChange=()=>{this.last=null;this.schedule();};this.motion?.addEventListener?.('change',this.motionChange);
  map.on('move zoom resize rotate viewreset',this.invalidate);document.addEventListener('visibilitychange',this.visibility);this.hidden=document.hidden;
 }
 update(points,config,field=this.field,prepared=null){
  if(flowIsCurved(this.config.flowForm)!==flowIsCurved(config.flowForm))this.flowEpoch++;
  const changed=this.field?.id!==field?.id,reset=changed||this.config.mode!==config.mode||this.config.paused!==config.paused||this.config.enabled!==config.enabled;
  this.points=points;if(changed){const before=this.field?windFieldSnapshot(this.field):null,after=field?windFieldSnapshot(field):null;if(before!==after){this.directionEpoch++;this.flowEpoch++;}this.fieldDirty=true;this.overlapDirty=true;this.seedRetry.fill(0);this.spareImage=this.fieldImage;this.fieldImage=prepared;this.lastFieldChange=Date.now();}else if(prepared)this.fieldImage=prepared;
  if(this.fieldImage&&field&&this.fieldImage.fieldId===field.id)this.fieldImage.deadline=field.deadline;
  this.field=field;this.config=config;if(!config.colorField)this.cancelPreparation();const keys=new Set(points.map(p=>p.key));for(const key of this.phases.keys())if(!keys.has(key))this.phases.delete(key);if(reset)this.last=null;this.schedule();
 }
 moving(){return this.config.enabled&&this.config.mode==='animated'&&!this.config.paused&&(!this.reduced()||this.config.animationExplicit)&&!this.hidden&&(this.field?this.overlapsView&&this.field.hasMotion!==false&&Date.now()<this.field.deadline:this.points.some(p=>p.speed>0));}
 schedule(){if(!this.destroyed&&!this.hidden&&this.frame===null)this.frame=this.raf(t=>{this.frame=null;this.paint(t);});}
 stop(){if(this.frame!==null)this.cancel(this.frame);this.frame=null;this.last=null;}
 paint(time){
  if(this.destroyed||this.hidden)return;
  this.flowGeometry.resetStats();
  const start=this.now(),s=this.map.getSize(),ratio=Math.min(globalThis.devicePixelRatio||1,2,Math.sqrt(6000000/Math.max(1,s.x*s.y))),w=Math.max(1,Math.round(s.x*ratio)),h=Math.max(1,Math.round(s.y*ratio));
  if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;this.canvas.style.width=s.x+'px';this.canvas.style.height=s.y+'px';this.projectionDirty=true;}
  if(this.projectionDirty){this.projection=windViewportProjection(this.map,s);this.projectionDirty=false;}
  if(this.overlapDirty){const b=this.map.getBounds?.();this.overlapsView=!this.field||!b?.getSouth||windFieldOverlaps(this.field,windFieldVisibleBounds(this.map));this.overlapDirty=false;}
  const ctx=this.ctx;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,s.x,s.y);
  const moving=this.moving(),dt=moving&&this.last!==null?Math.max(0,Math.min(.05,(time-this.last)/1000)):0;if(moving)this.clock+=dt;this.last=moving?time:null;
  const authorized=this.field&&Date.now()<this.field.deadline;
  if(authorized&&this.overlapsView&&this.config.colorField)this.paintField(s);
  const glyphs=authorized?(this.config.mode==='animated'?[]:windFieldGlyphs(this.map,this.field)):this.points;
  const copies=this.config.enabled?visibleWindCopies(this.map,glyphs):[],color=WIND_COLORS.find(c=>c.id===this.config.color)?.hex||'#fff';let segments=0;
  if(authorized&&this.overlapsView&&this.config.enabled&&this.config.mode==='animated')segments=this.paintParticles(s,dt,color);
  for(const item of copies){
   if(authorized&&this.config.mode==='animated')break;
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
  if(this.config.performanceDiagnostics){if(this.lastPerfTime!==null&&moving){this.perfCosts[this.perfCursor]=cost;this.perfIntervals[this.perfCursor]=time-this.lastPerfTime;this.perfCursor=(this.perfCursor+1)%180;this.perfCount=Math.min(180,this.perfCount+1);}this.lastPerfTime=moving?time:null;if(time-this.perfPublished>=1000&&this.perfCount){const costs=Array.from(this.perfCosts.subarray(0,this.perfCount)).sort((a,b)=>a-b),intervals=this.perfIntervals.subarray(0,this.perfCount),total=intervals.reduce((a,b)=>a+b,0);Object.assign(this.metrics,{fps:this.perfCount*1000/total,meanRenderMs:costs.reduce((a,b)=>a+b,0)/costs.length,p95RenderMs:costs[Math.floor(costs.length*.95)],maxRenderMs:costs.at(-1)});this.perfPublished=time;}}else{this.lastPerfTime=null;this.perfCount=this.perfCursor=0;}
  if(flowIsCurved(this.config.flowForm)&&this.config.mode==='animated'){if(this.cost>6)this.flowQuality=Math.max(.25,this.flowQuality-.007);else if(this.cost<3)this.flowQuality=Math.min(1,this.flowQuality+.0008);}
  else{if(this.cost>10)this.quality=Math.max(.3,this.quality-.025);else if(this.cost<4)this.quality=Math.min(1,this.quality+.002);}
  if(!moving||!this.config.performanceDiagnostics)this.metrics.fps=null;
  Object.assign(this.metrics,{diagnosticsEnabled:this.config.performanceDiagnostics===true,segments,points:this.points.length,copies:copies.length,draws:this.draws,renderCostMs:this.cost,densityFactor:flowIsCurved(this.config.flowForm)&&this.config.mode==='animated'?this.flowQuality:this.quality,curveQuality:this.flowQuality,moving,fieldNodes:authorized?this.field.grid.u.length:0,fieldRenders:this.fieldRenders,particles:this.particles.length,advected:this.advected,vectorLookups:this.lookups,curvePoints:this.flowGeometry.stats.points,curves:this.flowGeometry.stats.curves,curveSteps:this.flowGeometry.stats.steps,curveHistoryBudgetBytes:(this.particles.length+this.pool.length)*384,colorPreparationCpuMs:this.colorCpuMs,colorPreparationWallMs:this.colorWallMs,lastFieldChange:this.lastFieldChange,activeGenerations:authorized?1:0,preparingGeneration:!!this.colorJob});this.onMetrics(this.metrics);
  if(moving)this.schedule();
 }
 cancelPreparation(){const job=this.colorJob;if(job){job.cancelled=true;clearTimeout(job.timer);if(job.cache!==this.fieldImage)this.spareImage=job.cache;job.resolve(null);this.colorJob=null;}}
 imageCoversView(cache,size){
  if(!cache||cache.fieldId!==this.field?.id||cache.deadline<=Date.now())return false;
  if(this.map.getZoom&&this.map.getZoom()>cache.zoom+.5)return false;
  const p=this.projection,out=this.screenScratch;if(!p||!cache.projection)return false;
  for(const [x,y] of [[0,0],[size.x,0],[0,size.y],[size.x,size.y]]){let lon=p.ox+x*p.ax+y*p.bx;lon+=360*Math.round((cache.centerLon-lon)/360);cache.projection.screen(lon,p.oy+x*p.ay+y*p.by,out);if(out[0]<cache.left-1||out[0]>cache.left+cache.width+1||out[1]<cache.top-1||out[1]>cache.top+cache.height+1)return false;}return true;
 }
 prepareField(field){
  if(!this.config.colorField||this.destroyed)return Promise.resolve(null);
  const size=this.map.getSize(),projection=windViewportProjection(this.map,size),viewKey=JSON.stringify([field.id,size.x,size.y,projection?.ox,projection?.oy,projection?.ax,projection?.ay,projection?.bx,projection?.by]);
  if(this.colorJob?.key===viewKey)return this.colorJob.promise;this.cancelPreparation();
  const left=-size.x*.15,top=-size.y*.15,width=size.x*1.3,height=size.y*1.3,step=Math.max(3,Math.sqrt(size.x*size.y/70000)),w=Math.max(1,Math.ceil(width/step)),h=Math.max(1,Math.ceil(height/step));
  const spare=this.spareImage,image=spare?.image||document.createElement('canvas');this.spareImage=null;
  if(image.width!==w||image.height!==h){image.width=w;image.height=h;}const ctx=image.getContext('2d'),pixels=spare?.pixels?.width===w&&spare?.pixels?.height===h?spare.pixels:ctx.createImageData(w,h),scratch=new Float64Array(5),scaleX=width/w,scaleY=height/h,started=this.now();
  const cache={image,pixels,width,height,left,top,projection,fieldId:field.id,deadline:field.deadline,zoom:this.map.getZoom?.()||0,centerLon:projection?projection.ox+size.x*.5*projection.ax+size.y*.5*projection.bx:this.map.getCenter?.().lng||0};
  cache.world=projection?[[left,top],[left+width,top],[left,top+height]].map(([x,y])=>[projection.ox+x*projection.ax+y*projection.bx,projection.oy+x*projection.ay+y*projection.by]):null;
  cache.anchors=cache.world?null:[[left,top],[left+width,top],[left,top+height]].map(p=>this.map.containerPointToLatLng(p));
  const promise=new Promise(resolve=>{const job={key:viewKey,cache,resolve,row:0,cpu:0,cancelled:false};this.colorJob=job;
   const run=()=>{if(job.cancelled||this.destroyed||field.deadline<=Date.now()){if(this.colorJob===job)this.colorJob=null;resolve(null);return;}const begin=this.now();
    do{const y=top+(job.row+.5)*scaleY,plain=projection&&Math.abs(projection.ay)<1e-10&&Math.abs(projection.bx)<1e-10,lat=plain?windMercatorLatitude(projection.oy+y*projection.by):null;
     for(let x=0;x<w;x++){const sx=left+(x+.5)*scaleX,ll=projection?null:this.map.containerPointToLatLng([sx,y]),latitude=projection?(plain?lat:windMercatorLatitude(projection.oy+sx*projection.ay+y*projection.by)):ll.lat,lon=projection?projection.ox+sx*projection.ax+y*projection.bx:ll.lng,offset=(job.row*w+x)*4;
      if(sampleWindFieldInto(field,latitude,lon,scratch))writeWindFieldColor(scratch[2],pixels.data,offset);else pixels.data[offset]=pixels.data[offset+1]=pixels.data[offset+2]=pixels.data[offset+3]=0;
     }job.row++;
    }while(job.row<h&&this.now()-begin<4);job.cpu+=this.now()-begin;
    if(job.row<h){job.timer=setTimeout(run,0);return;}ctx.putImageData(pixels,0,0);this.fieldRenders++;this.colorCpuMs=job.cpu;this.colorWallMs=this.now()-started;if(this.colorJob===job)this.colorJob=null;resolve(cache);
   };job.timer=setTimeout(run,0);
  });if(this.colorJob)this.colorJob.promise=promise;return promise;
 }
 paintField(size){
  if(this.fieldDirty){if(this.imageCoversView(this.fieldImage,size))this.fieldDirty=false;else if(!this.mapMoving&&!this.colorJob){const field=this.field;this.prepareField(field).then(cache=>{if(cache&&!this.destroyed&&this.field===field){this.spareImage=this.fieldImage;this.fieldImage=cache;this.fieldDirty=false;this.schedule();}});}}
  const cache=this.fieldImage;if(!cache||cache.fieldId!==this.field?.id||cache.deadline<=Date.now())return;
  const points=this.imageProjection;if(cache.world&&this.projection){const p=this.projection,offset=360*Math.round(((p.ox+size.x*.5*p.ax+size.y*.5*p.bx)-cache.centerLon)/360);for(let i=0;i<3;i++){const v=cache.world[i];p.screen(v[0]+offset,v[1],this.screenScratch);points[i*2]=this.screenScratch[0];points[i*2+1]=this.screenScratch[1];}}else for(let i=0;i<3;i++){const v=this.map.latLngToContainerPoint(cache.anchors[i]);points[i*2]=v.x;points[i*2+1]=v.y;}
  const ctx=this.ctx;ctx.save();ctx.globalAlpha=this.config.fieldOpacity/100;ctx.transform((points[2]-points[0])/cache.width,(points[3]-points[1])/cache.width,(points[4]-points[0])/cache.height,(points[5]-points[1])/cache.height,points[0],points[1]);ctx.imageSmoothingEnabled=true;ctx.drawImage(cache.image,0,0,cache.width,cache.height);ctx.restore();
 }
 paintParticles(size,dt,color){
  const curves=flowIsCurved(this.config.flowForm)&&!!this.projection,geometry=this.flowGeometry;geometry.resetStats();
  const mobile=(globalThis.navigator?.hardwareConcurrency||4)<=4||size.x<650;
  const classicTarget=Math.min(mobile?900:2200,Math.max(20,Math.round(size.x*size.y/({low:1800,normal:1000,high:600}[this.config.density]||1000)*this.quality)));
  const target=curves?Math.min(mobile?450:1100,Math.max(20,Math.round(classicTarget/this.quality*this.flowQuality*.65))):classicTarget;
  if(this.particles.length>target){for(let i=target;i<this.particles.length;i++)if(this.particles[i])this.pool.push(this.particles[i]);this.particles.length=target;}
  const projection=this.projection,scratch=this.scratch,screen=this.screenScratch;
  const position=p=>{if(projection){if(p.my===undefined)p.my=windMercatorY(p.lat);projection.screen(p.lon,p.my,screen);if((screen[0]<-20||screen[0]>size.x+20)&&this.map.getCenter){const lon=p.lon+360*Math.round((this.map.getCenter().lng-p.lon)/360);projection.screen(lon,p.my,screen);if(screen[0]>=-20&&screen[0]<=size.x+20)p.lon=lon;else projection.screen(p.lon,p.my,screen);}return screen;}const xy=this.map.latLngToContainerPoint([p.lat,p.lon]);screen[0]=xy.x;screen[1]=xy.y;return screen;};
  const spawn=(index,initial=false,bucket=null,reuse=null)=>{
   const p=reuse||this.pool.pop()||{};if(p.flowPath)p.flowPath.count=0;
   // Stratified viewport seeding is visually uniform; only valid grid cells seed.
   const cols=Math.max(1,Math.ceil(Math.sqrt(target*size.x/size.y))),rows=Math.ceil(target/cols);
   for(let attempt=0;attempt<8;attempt++){
    const x=bucket?(bucket.x+Math.random()*bucket.w):((index%cols+Math.random())/cols)*size.x,y=bucket?(bucket.y+Math.random()*bucket.h):((Math.floor(index/cols)%rows+Math.random())/rows)*size.y;
    const my=projection?projection.oy+x*projection.ay+y*projection.by:null,ll=projection?null:this.map.containerPointToLatLng([x,y]),lat=projection?windMercatorLatitude(my):ll.lat,lon=projection?projection.ox+x*projection.ax+y*projection.bx:ll.lng;this.lookups++;
    if(sampleWindFieldInto(this.field,lat,lon,scratch)&&scratch[2]>0){this.seedRetry[index]=0;p.lat=lat;p.lon=lon;p.my=my??windMercatorY(lat);p.age=initial?Math.random()*3:0;p.life=3+Math.random()*2;p.brightness=.65+Math.random()*.3;p.du=scratch[0]/scratch[2];p.dv=scratch[1]/scratch[2];p.epoch=this.directionEpoch;return p;}
   }this.seedRetry[index]=this.clock+1;this.pool.push(p);return null;
  };
  while(this.particles.length<target)this.particles.push(spawn(this.particles.length,true));
  if(this.reseedFrames>0&&dt){
   // A zoom exposes new geography. Fill sparse screen cells gradually while
   // retaining established trajectories; never clear/refill the whole field.
   const cols=Math.ceil(size.x/64),rows=Math.ceil(size.y/64);if(this.reseedCounts?.length!==cols*rows)this.reseedCounts=new Uint16Array(cols*rows);const counts=this.reseedCounts;counts.fill(0);if(this.reseedCells?.length<target||!this.reseedCells)this.reseedCells=new Int16Array(target);const cells=this.reseedCells;
   for(let i=0;i<this.particles.length;i++){const p=this.particles[i];
    if(!p){cells[i]=-1;continue;}const xy=position(p);
    const cell=xy[0]>=0&&xy[0]<size.x&&xy[1]>=0&&xy[1]<size.y?Math.floor(xy[1]/64)*cols+Math.floor(xy[0]/64):-1;
    cells[i]=cell;if(cell>=0)counts[cell]++;
   }
   const desired=Math.max(1,Math.floor(target/counts.length)),holes=[];for(let i=0;i<counts.length;i++)for(let n=counts[i];n<desired;n++)holes.push(i);
   let changed=0;for(let i=0;i<this.particles.length&&holes.length&&changed<Math.ceil(target*.1);i++){
    const p=this.particles[i],cell=cells[i],phase=p?p.age/p.life:0;
    if(cell>=0&&(counts[cell]<=desired+1||phase>.15&&phase<.85))continue;
    const destination=holes.pop(),x=destination%cols*64,y=Math.floor(destination/cols)*64,next=spawn(i,false,{x,y,w:Math.min(64,size.x-x),h:Math.min(64,size.y-y)},p);
    this.particles[i]=next;if(cell>=0)counts[cell]--;if(next){counts[destination]++;changed++;}
   }this.reseedFrames--;
  }
  let drawn=0;const ctx=this.ctx,tempo={slow:.55,normal:1,fast:1.7}[this.config.tempo]||1,basis=projection?null:windScreenBasis(this.map),turn=1-Math.exp(-dt/.12),outline=color==='#111318'?'#ffffff88':'#12202a40';
  ctx.save();ctx.lineCap='round';
  for(let i=0;i<this.particles.length;i++){
   let p=this.particles[i];if(!p){if(dt&&this.clock>=this.seedRetry[i])this.particles[i]=spawn(i);continue;}
   const xy=position(p),x=xy[0],y=xy[1];this.lookups++;
   if(!sampleWindFieldInto(this.field,p.lat,p.lon,scratch)||!scratch[2]||p.age>=p.life||x<-20||y<-20||x>size.x+20||y>size.y+20){if(dt)this.particles[i]=spawn(i,false,null,p);continue;}
   if(curves){
    if(!geometry.advance(this.field,p,projection,dt,this.config.tempo,this.flowEpoch)){if(dt){this.pool.push(p);this.particles[i]=null;}continue;}
    if(dt){p.age+=dt;this.advected++;}
    const alpha=Math.sin(Math.PI*Math.min(1,p.age/p.life))*p.brightness;
    if(geometry.build(this.field,p,projection,flowLength(geometry.speed,this.config.flowLength),mobile?.6:this.flowQuality)&&geometry.draw(ctx,this.config.flowForm,color,alpha,outline))drawn++;
    continue;
   }
   const speed=scratch[2],u=scratch[0]/speed,v=scratch[1]/speed;
   smoothWindDirection(p,u,v,turn,this.directionEpoch);
   let dx,dy;if(projection){dx=p.du*projection.eastX+p.dv*projection.northX;dy=p.du*projection.eastY+p.dv*projection.northY;}else{const direction=projectedWind(this.map,{lat:p.lat,lon:p.lon,from:((Math.atan2(-p.du,-p.dv)/DEG)%360+360)%360},p.lon,basis);dx=Math.cos(direction.angle);dy=Math.sin(direction.angle);}
   const length=5+Math.min(12,Math.sqrt(speed)*2),alpha=Math.sin(Math.PI*Math.min(1,p.age/p.life))*p.brightness;
   ctx.globalAlpha=alpha;ctx.beginPath();ctx.moveTo(x-dx*length/2,y-dy*length/2);ctx.lineTo(x+dx*length/2,y+dy*length/2);
   ctx.lineWidth=2.5;ctx.strokeStyle=outline;ctx.stroke();ctx.lineWidth=1.25;ctx.strokeStyle=color;ctx.stroke();drawn++;
   if(dt){
    const distance=Math.min(75,3+Math.sqrt(speed)*10)*tempo*dt,my=projection?p.my+(dx*projection.ay+dy*projection.by)*distance:null,next=projection?null:this.map.containerPointToLatLng([x+dx*distance,y+dy*distance]),lat=projection?windMercatorLatitude(my):next.lat,lon=projection?p.lon+(dx*projection.ax+dy*projection.bx)*distance:next.lng;
    if(windFieldStepValid(this.field,p.lat,p.lon,lat,lon)){p.lat=lat;p.lon=lon;p.my=my??windMercatorY(lat);p.age+=dt;this.advected++;}else{this.pool.push(p);this.particles[i]=null;}
   }
  }ctx.restore();return drawn;
 }
 destroy(){this.destroyed=true;this.cancelPreparation();this.stop();this.map.off('move zoom resize rotate viewreset',this.invalidate);this.map.off('movestart zoomstart',this.moveStart);this.map.off('moveend zoomend',this.moveEnd);document.removeEventListener('visibilitychange',this.visibility);this.motion?.removeEventListener?.('change',this.motionChange);this.points=[];this.particles=[];this.pool=[];this.field=null;this.fieldImage=this.spareImage=null;this.projection=null;this.reseedCounts=this.reseedCells=null;this.phases.clear();this.canvas.remove();this.canvas.width=this.canvas.height=1;}
}

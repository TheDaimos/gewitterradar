import {FlowGeometry,flowIsCurved,flowLength} from './flow-geometry.js?v=411157r1';
import {requestWeatherFrame,cancelWeatherFrame} from './frame-clock.js?v=411156r1';
import {windViewportProjection,windMercatorY,windMercatorLatitude,smoothWindDirection} from './wind-canvas.js?v=411157r1';
import {prepareWindFieldLookup,windFieldStepValid} from './wind-field.js?v=411153r1';
import {sampleScalarInto} from './temperature-field.js?v=411156r1';
import {writeTemperatureColor,temperatureColor,temperatureText,advectionColor} from './temperature-data.js?v=411157r1';
const ADV_NAMES=Object.freeze(['u','v','rate']);
const paneSpecs=[['gr-temperature-surface',210],['gr-temperature-labels',432],['gr-temperature-advection',433]];
export class TemperatureCanvas{
 constructor(map,onMetrics=()=>{}){
  this.flowGeometry=new FlowGeometry();this.map=map;this.onMetrics=onMetrics;this.field=null;this.config={};this.frame=null;this.last=null;this.staticDirty=true;this.particles=[];this.scalar=new Float64Array(3);this.xy=new Float64Array(2);this.metrics={labels:0,arrows:0,draws:0,preparations:0};this.epoch=0;this.hidden=document.hidden;this.job=null;
  this.canvases=paneSpecs.map(([name,z])=>{const pane=map.getPane(name)||map.createPane(name);pane.style.zIndex=String(z);pane.style.pointerEvents='none';const c=document.createElement('canvas');c.className='weather-temperature-canvas';c.style.cssText='position:absolute;pointer-events:none;filter:none';pane.append(c);return c;});this.contexts=this.canvases.map(c=>c.getContext('2d'));
  this.invalidate=()=>{this.staticDirty=true;this.schedule();};map.on('move zoom resize rotate viewreset',this.invalidate);
  this.visibility=()=>{this.hidden=document.hidden;this.last=null;if(this.hidden){this.stop();this.cancelPreparation();}else this.invalidate();};document.addEventListener('visibilitychange',this.visibility);
  this.motion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');this.motionChanged=()=>this.invalidate();this.motion?.addEventListener?.('change',this.motionChanged);
 }
 signature(c){return JSON.stringify([c.stops,c.scheme,c.contrast,c.quality]);}
 cancelPreparation(){if(this.job){const job=this.job;this.job=null;job.cancelled=true;clearTimeout(job.timer);job.resolve(null);}}
 covers(image=this.image){
  if(!image||image.id!==this.field?.id||image.signature!==this.signature(this.config)||image.deadline<=Date.now()||this.map.getZoom()>image.zoom+.5)return false;
  const p=windViewportProjection(this.map),s=this.map.getSize();if(!p)return false;
  for(const [x,y] of [[0,0],[s.x,0],[0,s.y],[s.x,s.y]]){let lon=p.ox+x*p.ax+y*p.bx;lon+=360*Math.round((image.center-lon)/360);image.p.screen(lon,p.oy+x*p.ay+y*p.by,this.xy);if(this.xy[0]<image.left-1||this.xy[0]>image.left+image.width+1||this.xy[1]<image.top-1||this.xy[1]>image.top+image.height+1)return false;}return true;
 }
 async prepare(field,c){
  this.cancelPreparation();if(!c.surface||!c.visible)return null;
  if(this.image?.id===field.id&&this.signature(c)===this.image.signature&&this.covers())return this.image;
  const s=this.map.getSize(),p=windViewportProjection(this.map);if(!p)return null;
  const width=s.x*1.3,height=s.y*1.3,left=-s.x*.15,top=-s.y*.15,ratio=Math.min(1,Math.sqrt((c.quality==='fine'?240000:130000)/(width*height))),w=Math.max(2,Math.ceil(width*ratio)),h=Math.max(2,Math.ceil(height*ratio));
  const canvas=this.spare?.width===w&&this.spare.height===h?this.spare:document.createElement('canvas');this.spare=null;canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(w,h),started=performance.now(),v=new Float64Array(1);
  return new Promise(resolve=>{
   const job={resolve,row:0,canvas,cancelled:false,timer:null,cpu:0};this.job=job;
   const step=()=>{if(job.cancelled||this.destroyed)return;const begin=performance.now();
    do{const y=job.row,sy=top+(y+.5)*height/h;for(let x=0;x<w;x++){const sx=left+(x+.5)*width/w,lon=p.ox+sx*p.ax+sy*p.bx,lat=windMercatorLatitude(p.oy+sx*p.ay+sy*p.by),at=(y*w+x)*4;if(sampleScalarInto(field.grid,lat,lon,v))writeTemperatureColor(v[0],c,pixels.data,at);}
     job.row++;
    }while(job.row<h&&performance.now()-begin<4);job.cpu+=performance.now()-begin;
    if(job.row<h){job.timer=setTimeout(step,0);return;}
    ctx.putImageData(pixels,0,0);this.job=null;this.metrics.preparations++;this.metrics.prepareCpuMs=job.cpu;this.metrics.prepareWallMs=performance.now()-started;
    resolve({canvas,id:field.id,signature:this.signature(c),deadline:field.deadline,p,left,top,width,height,zoom:this.map.getZoom(),center:p.ox+s.x*.5*p.ax+s.y*.5*p.bx});
   };step();
  });
 }
 commit(field,c,image=null){
  if(this.field?.model_run!==field?.model_run||this.field?.valid_at!==field?.valid_at||flowIsCurved(this.config.flowForm)!==flowIsCurved(c.flowForm))this.epoch++;
  if(image&&image!==this.image){this.spare=this.image?.canvas;this.image=image;}
  this.field=field;this.config=c;this.staticDirty=true;this.last=null;
  if(field?.advection?.status==='ready'){const a=field.advection;if(!a.windView){a.windView={grid:a.grid};prepareWindFieldLookup(a.windView);}}
  if(!c.visible){this.stop();this.cancelPreparation();for(const [i,canvas] of this.canvases.entries()){this.contexts[i].clearRect(0,0,canvas.width,canvas.height);canvas.hidden=true;}this.metrics.labels=this.metrics.arrows=0;this.onMetrics(this.metrics);return;}
  this.schedule();
 }
 schedule(){if(!this.destroyed&&!this.hidden&&this.config.visible&&this.frame===null)this.frame=requestWeatherFrame(t=>{this.frame=null;this.paint(t);});}
 stop(){if(this.frame!==null)cancelWeatherFrame(this.frame);this.frame=null;this.last=null;}
 geometry(){const s=this.map.getSize(),ratio=Math.min(devicePixelRatio||1,2,Math.sqrt(6000000/Math.max(1,s.x*s.y))),origin=this.map.containerPointToLayerPoint([0,0]);
  for(const canvas of this.canvases){const w=Math.max(1,Math.round(s.x*ratio)),h=Math.max(1,Math.round(s.y*ratio));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;this.staticDirty=true;}canvas.style.width=s.x+'px';canvas.style.height=s.y+'px';canvas.style.left=origin.x+'px';canvas.style.top=origin.y+'px';canvas.hidden=!this.config.visible;}
  return {s,ratio,p:windViewportProjection(this.map)};
 }
 drawImage(ctx,image,p,s,ratio){
  const old=image.p,shift=360*Math.round((p.ox+s.x*.5*p.ax+s.y*.5*p.bx-image.center)/360),project=(x,y)=>{const out=new Float64Array(2);p.screen(old.ox+x*old.ax+y*old.bx+shift,old.oy+x*old.ay+y*old.by,out);return out;};
  const a=project(image.left,image.top),b=project(image.left+image.width,image.top),d=project(image.left,image.top+image.height),w=image.canvas.width,h=image.canvas.height;
  ctx.save();ctx.globalAlpha=this.config.opacity/100;ctx.setTransform(ratio*(b[0]-a[0])/w,ratio*(b[1]-a[1])/w,ratio*(d[0]-a[0])/h,ratio*(d[1]-a[1])/h,ratio*a[0],ratio*a[1]);ctx.imageSmoothingEnabled=true;ctx.drawImage(image.canvas,0,0);ctx.restore();
 }
 drawLabels(ctx,p,s){
  const c=this.config,g=this.field.grid,spacing=({low:160,normal:112,high:76,auto:Math.max(88,160-this.map.getZoom()*9)}[c.labelDensity]),nx=g.longitudes.length,cols=Math.ceil(s.x/spacing),cells=new Uint8Array(cols*Math.ceil(s.y/spacing));let count=0;
  ctx.font=`600 ${c.fontSize}px system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';const center=p.ox+s.x*.5*p.ax+s.y*.5*p.bx;
  for(let row=0;row<g.latitudes.length;row++){const my=windMercatorY(g.latitudes[row]);for(let col=0;col<nx-(g.cyclic?1:0);col++){const i=row*nx+col;if(!g.valid_mask[i])continue;const base=g.longitudes[col]+360*Math.round((center-g.longitudes[col])/360);
   for(let copy=-1;copy<=1;copy++){p.screen(base+copy*360,my,this.xy);const x=this.xy[0],y=this.xy[1];if(x<18||y<14||x>s.x-18||y>s.y-14)continue;const cell=Math.floor(y/spacing)*cols+Math.floor(x/spacing);if(cells[cell])continue;cells[cell]=1;
    const text=temperatureText(g.values[i],c.unit,false,c.locale),w=ctx.measureText(text).width;ctx.fillStyle='rgba(8,14,24,.75)';if(c.labelBackground)ctx.fillRect(x-w/2-4,y-c.fontSize/2-3,w+8,c.fontSize+6);ctx.strokeStyle='#08101c';ctx.lineWidth=3;ctx.strokeText(text,x,y);ctx.fillStyle=temperatureColor(g.values[i],c);ctx.fillText(text,x,y);count++;
   }
  }}return count;
 }
 seed(p,projection,s){
  const g=this.field.advection.grid;
  for(let k=0;k<12;k++){const x=Math.random()*s.x,y=Math.random()*s.y;p.lon=projection.ox+x*projection.ax+y*projection.bx;p.my=projection.oy+x*projection.ay+y*projection.by;
   if(sampleScalarInto(g,windMercatorLatitude(p.my),p.lon,this.scalar,ADV_NAMES)&&Math.hypot(this.scalar[0],this.scalar[1])>.01){p.life=2.5+Math.random()*2;p.age=Math.random()*p.life;p.valid=true;if(p.flowPath)p.flowPath.count=0;return true;}
  }p.valid=false;return false;
 }
 drawArrows(ctx,p,s,dt){
  const c=this.config,a=this.field.advection,g=a.grid,target=Math.min(s.x<650?180:420,Math.max(12,Math.round(s.x*s.y/8500*({low:.6,normal:1,high:1.5}[c.density]))));
  while(this.particles.length<target)this.particles.push({valid:false});if(this.particles.length>target)this.particles.length=target;
  const curves=flowIsCurved(c.flowForm),geometry=this.flowGeometry;geometry.resetStats();
  let count=0;ctx.lineCap='round';ctx.lineJoin='round';
  for(const particle of this.particles){
   if(!particle.valid||particle.age>particle.life){if(!this.seed(particle,p,s))continue;}
   const lat=windMercatorLatitude(particle.my);if(!sampleScalarInto(g,lat,particle.lon,this.scalar,ADV_NAMES)){particle.valid=false;continue;}
   const u=this.scalar[0],v=this.scalar[1],rate=this.scalar[2],speed=Math.hypot(u,v);if(speed<.01){particle.valid=false;continue;}p.screen(particle.lon,particle.my,this.xy);let x=this.xy[0],y=this.xy[1];
   if(x<0||y<0||x>s.x||y>s.y){particle.valid=false;continue;}
   if(curves){
    if(!geometry.advance(a.windView,particle,p,dt,c.tempo,this.epoch)){particle.valid=false;continue;}particle.age+=dt;
    if(Math.abs(rate)<c.threshold||c.transport==='cold'&&rate>=0||c.transport==='warm'&&rate<=0)continue;
    if(geometry.build(a.windView,particle,p,Math.min(64,flowLength(geometry.speed,c.flowLength)*c.arrowSize/14),s.x<650?.6:1)&&geometry.draw(ctx,c.flowForm,advectionColor(rate,c.advectionStrength),c.arrowOpacity/100*Math.sin(Math.PI*Math.min(1,particle.age/particle.life))))count++;
    continue;
   }
   const scale=Math.min(75,8+13*Math.sqrt(speed))*({slow:.55,normal:1,fast:1.6}[c.tempo]);smoothWindDirection(particle,u/speed,v/speed,1-Math.exp(-dt/.12),this.epoch);
   const dx=particle.du*p.eastX+particle.dv*p.northX,dy=particle.du*p.eastY+particle.dv*p.northY,nlon=particle.lon+dt*scale*(dx*p.ax+dy*p.bx),nmy=particle.my+dt*scale*(dx*p.ay+dy*p.by);
   if(!windFieldStepValid(a.windView,lat,particle.lon,windMercatorLatitude(nmy),nlon)){particle.valid=false;continue;}
   particle.lon=nlon;particle.my=nmy;particle.age+=dt;
   if(Math.abs(rate)<c.threshold||c.transport==='cold'&&rate>=0||c.transport==='warm'&&rate<=0)continue;
   const len=c.arrowSize,alpha=c.arrowOpacity/100*Math.sin(Math.PI*Math.min(1,particle.age/particle.life));ctx.globalAlpha=Math.max(0,alpha);ctx.strokeStyle='#09101c99';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-dx*len*.5,y-dy*len*.5);ctx.lineTo(x+dx*len*.5,y+dy*len*.5);ctx.stroke();ctx.strokeStyle=advectionColor(rate,c.advectionStrength);ctx.lineWidth=1.8;ctx.stroke();
   const tx=x+dx*len*.5,ty=y+dy*len*.5;ctx.beginPath();ctx.moveTo(tx-dx*4-dy*3,ty-dy*4+dx*3);ctx.lineTo(tx,ty);ctx.lineTo(tx-dx*4+dy*3,ty-dy*4-dx*3);ctx.stroke();count++;
  }ctx.globalAlpha=1;this.metrics.curvePoints=geometry.stats.points;this.metrics.curves=geometry.stats.curves;this.metrics.curveSteps=geometry.stats.steps;this.metrics.curveHistoryBudgetBytes=this.particles.length*384;return count;
 }
 paint(time){
  if(this.destroyed||this.hidden||!this.config.visible)return;this.flowGeometry.resetStats();const start=performance.now(),{s,ratio,p}=this.geometry(),c=this.config,f=this.field;if(!p)return;
  const valid=f&&f.deadline>Date.now(),moving=valid&&c.advection&&f.advection.status==='ready'&&!c.paused&&!this.motion?.matches,dt=moving&&this.last!==null?Math.min(.05,Math.max(0,(time-this.last)/1000)):0;this.last=moving?time:null;
  if(this.staticDirty){
   for(const i of [0,1]){const ctx=this.contexts[i];ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,s.x,s.y);}
   this.metrics.labels=0;if(valid){if(c.surface&&this.image)this.drawImage(this.contexts[0],this.image,p,s,ratio);if(c.labels)this.metrics.labels=this.drawLabels(this.contexts[1],p,s);}
   this.staticDirty=false;
   if(valid&&c.surface&&!this.covers()&&!this.job)this.prepare(f,c).then(image=>{if(image&&this.field===f&&this.config===c){this.spare=this.image?.canvas;this.image=image;this.staticDirty=true;this.schedule();}});
  }
  const ctx=this.contexts[2];ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,s.x,s.y);this.metrics.arrows=valid&&c.advection&&f.advection.status==='ready'?this.drawArrows(ctx,p,s,dt):0;
  this.metrics.curvePoints=this.flowGeometry.stats.points;this.metrics.curves=this.flowGeometry.stats.curves;this.metrics.curveSteps=this.flowGeometry.stats.steps;
  this.metrics.draws++;this.metrics.renderMs=performance.now()-start;this.metrics.moving=moving;this.metrics.fieldNodes=f?.grid.values.length||0;this.onMetrics(this.metrics);if(moving)this.schedule();
 }
 destroy(){this.destroyed=true;this.stop();this.cancelPreparation();this.map.off('move zoom resize rotate viewreset',this.invalidate);document.removeEventListener('visibilitychange',this.visibility);this.motion?.removeEventListener?.('change',this.motionChanged);this.canvases.forEach(c=>c.remove());this.particles.length=0;this.field=this.image=this.spare=null;}
}

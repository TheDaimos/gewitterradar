import { WIND_COLORS,windBarbParts,windDestination } from './wind-data.js?v=411151r1';
import { sampleWindField,windFieldColor,windFieldGlyphs } from './wind-field.js?v=411151r1';

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
  Object.assign(this,{map,canvas,raf,cancel,now,reduced,onMetrics});this.ctx=canvas.getContext('2d');this.points=[];this.phases=new Map();this.config={};this.clock=0;this.last=null;this.frame=null;this.destroyed=false;this.hidden=false;this.quality=1;this.cost=0;this.draws=0;
  this.field=null;this.particles=[];this.fieldImage=null;this.fieldDirty=true;this.mapMoving=false;this.fieldRenders=0;this.advected=0;
  this.invalidate=()=>{this.fieldDirty=true;this.schedule();};
  this.moveStart=()=>{this.mapMoving=true;};this.moveEnd=()=>{this.mapMoving=false;this.reseedFrames=12;this.invalidate();};
  map.on('movestart zoomstart',this.moveStart);map.on('moveend zoomend',this.moveEnd);
  this.visibility=()=>{this.hidden=document.hidden;this.last=null;if(this.hidden)this.stop();else this.schedule();};
  this.motion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');this.motionChange=()=>{this.last=null;this.schedule();};this.motion?.addEventListener?.('change',this.motionChange);
  map.on('move zoom resize rotate viewreset',this.invalidate);document.addEventListener('visibilitychange',this.visibility);this.hidden=document.hidden;
 }
 update(points,config,field=this.field){this.points=points;if(this.field?.id!==field?.id){this.fieldDirty=true;this.fieldImage=null;}this.field=field;this.config=config;const keys=new Set(points.map(p=>p.key));for(const key of this.phases.keys())if(!keys.has(key))this.phases.delete(key);this.last=null;this.schedule();}
 moving(){return this.config.enabled&&this.config.mode==='animated'&&!this.config.paused&&(!this.reduced()||this.config.animationExplicit)&&!this.hidden&&(this.field?this.field.hasMotion!==false&&Date.now()<this.field.deadline:this.points.some(p=>p.speed>0));}
 schedule(){if(!this.destroyed&&!this.hidden&&this.frame===null)this.frame=this.raf(t=>{this.frame=null;this.paint(t);});}
 stop(){if(this.frame!==null)this.cancel(this.frame);this.frame=null;this.last=null;}
 paint(time){
  if(this.destroyed||this.hidden)return;
  const start=this.now(),s=this.map.getSize(),ratio=Math.min(globalThis.devicePixelRatio||1,2,Math.sqrt(6000000/Math.max(1,s.x*s.y))),w=Math.max(1,Math.round(s.x*ratio)),h=Math.max(1,Math.round(s.y*ratio));
  if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}this.canvas.style.width=s.x+'px';this.canvas.style.height=s.y+'px';
  const ctx=this.ctx;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,s.x,s.y);
  const moving=this.moving(),dt=moving&&this.last!==null?Math.max(0,Math.min(.05,(time-this.last)/1000)):0;if(moving)this.clock+=dt;this.last=moving?time:null;
  const authorized=this.field&&Date.now()<this.field.deadline;
  if(authorized&&this.config.colorField)this.paintField(s);
  const glyphs=authorized?(this.config.mode==='animated'?[]:windFieldGlyphs(this.map,this.field)):this.points;
  const copies=this.config.enabled?visibleWindCopies(this.map,glyphs):[],color=WIND_COLORS.find(c=>c.id===this.config.color)?.hex||'#fff';let segments=0;
  if(authorized&&this.config.enabled&&this.config.mode==='animated')segments=this.paintParticles(s,dt,color);
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
  if(this.cost>10)this.quality=Math.max(.3,this.quality-.025);else if(this.cost<4)this.quality=Math.min(1,this.quality+.002);
  this.onMetrics({segments,points:this.points.length,copies:copies.length,draws:this.draws,renderCostMs:this.cost,densityFactor:this.quality,moving,fieldNodes:authorized?this.field.grid.u.length:0,fieldRenders:this.fieldRenders,particles:this.particles.length,advected:this.advected});
  if(moving)this.schedule();
 }
 paintField(size){
  // Rebuild only after field/viewport changes. During gestures transform the cached
  // geographic image; the animation never resamples a full raster per frame.
  if(!this.fieldImage||this.fieldDirty&&!this.mapMoving){
   const image=document.createElement('canvas'),step=Math.max(3,Math.sqrt(size.x*size.y/70000));
   image.width=Math.max(1,Math.ceil(size.x/step));image.height=Math.max(1,Math.ceil(size.y/step));
   const ctx=image.getContext('2d'),pixels=ctx.createImageData(image.width,image.height),scaleX=size.x/image.width,scaleY=size.y/image.height;
   for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++){
    const ll=this.map.containerPointToLatLng([(x+.5)*scaleX,(y+.5)*scaleY]),wind=sampleWindField(this.field,ll.lat,ll.lng);
    if(wind)pixels.data.set(windFieldColor(wind.speed),(y*image.width+x)*4);
   }
   ctx.putImageData(pixels,0,0);this.fieldImage={image,anchors:[[0,0],[size.x,0],[0,size.y]].map(p=>this.map.containerPointToLatLng(p)),width:size.x,height:size.y};this.fieldDirty=false;this.fieldRenders++;
  }
  const cache=this.fieldImage,[a,b,c]=cache.anchors.map(ll=>this.map.latLngToContainerPoint(ll)),ctx=this.ctx;
  ctx.save();ctx.globalAlpha=this.config.fieldOpacity/100;ctx.transform((b.x-a.x)/cache.width,(b.y-a.y)/cache.width,(c.x-a.x)/cache.height,(c.y-a.y)/cache.height,a.x,a.y);
  ctx.imageSmoothingEnabled=true;ctx.drawImage(cache.image,0,0,cache.width,cache.height);ctx.restore();
 }
 paintParticles(size,dt,color){
  const mobile=(globalThis.navigator?.hardwareConcurrency||4)<=4||size.x<650;
  const target=Math.min(mobile?900:2200,Math.max(20,Math.round(size.x*size.y/({low:1800,normal:1000,high:600}[this.config.density]||1000)*this.quality)));
  if(this.particles.length>target)this.particles.length=target;
  const spawn=(index,initial=false,bucket=null)=>{
   // Stratified viewport seeding is visually uniform; only valid grid cells seed.
   const cols=Math.max(1,Math.ceil(Math.sqrt(target*size.x/size.y))),rows=Math.ceil(target/cols);
   for(let attempt=0;attempt<8;attempt++){
    const x=bucket?(bucket.x+Math.random()*bucket.w):((index%cols+Math.random())/cols)*size.x,y=bucket?(bucket.y+Math.random()*bucket.h):((Math.floor(index/cols)%rows+Math.random())/rows)*size.y;
    const ll=this.map.containerPointToLatLng([x,y]),value=sampleWindField(this.field,ll.lat,ll.lng);
    if(value&&value.speed>0)return {lat:ll.lat,lon:ll.lng,age:initial?Math.random()*3:0,life:3+Math.random()*2,brightness:.65+Math.random()*.3};
   }return null;
  };
  while(this.particles.length<target)this.particles.push(spawn(this.particles.length,true));
  if(this.reseedFrames>0&&dt){
   // A zoom exposes new geography. Fill sparse screen cells gradually while
   // retaining established trajectories; never clear/refill the whole field.
   const cols=Math.ceil(size.x/64),rows=Math.ceil(size.y/64),counts=new Uint16Array(cols*rows),cells=[];
   for(const p of this.particles){
    if(!p){cells.push(-1);continue;}let pos=this.map.latLngToContainerPoint([p.lat,p.lon]);
    if((pos.x<0||pos.x>size.x)&&this.map.getCenter){p.lon+=360*Math.round((this.map.getCenter().lng-p.lon)/360);pos=this.map.latLngToContainerPoint([p.lat,p.lon]);}
    const cell=pos.x>=0&&pos.x<size.x&&pos.y>=0&&pos.y<size.y?Math.floor(pos.y/64)*cols+Math.floor(pos.x/64):-1;
    cells.push(cell);if(cell>=0)counts[cell]++;
   }
   const desired=Math.max(1,Math.floor(target/counts.length)),holes=[];for(let i=0;i<counts.length;i++)for(let n=counts[i];n<desired;n++)holes.push(i);
   let changed=0;for(let i=0;i<this.particles.length&&holes.length&&changed<Math.ceil(target*.1);i++){
    const p=this.particles[i],cell=cells[i],phase=p?p.age/p.life:0;
    if(cell>=0&&(counts[cell]<=desired+1||phase>.15&&phase<.85))continue;
    const destination=holes.pop(),x=destination%cols*64,y=Math.floor(destination/cols)*64,next=spawn(i,false,{x,y,w:Math.min(64,size.x-x),h:Math.min(64,size.y-y)});
    if(next){this.particles[i]=next;if(cell>=0)counts[cell]--;counts[destination]++;changed++;}
   }this.reseedFrames--;
  }
  let drawn=0;const ctx=this.ctx,tempo={slow:.55,normal:1,fast:1.7}[this.config.tempo]||1,basis=windScreenBasis(this.map);
  for(let i=0;i<this.particles.length;i++){
   let p=this.particles[i];if(!p){if(dt)this.particles[i]=spawn(i);continue;}
   const value=sampleWindField(this.field,p.lat,p.lon);let origin=this.map.latLngToContainerPoint([p.lat,p.lon]);
   if((origin.x<-20||origin.x>size.x+20)&&typeof this.map.getCenter==='function'){
    const lon=p.lon+360*Math.round((this.map.getCenter().lng-p.lon)/360),copy=this.map.latLngToContainerPoint([p.lat,lon]);
    if(copy.x>=-20&&copy.x<=size.x+20){p.lon=lon;origin=copy;}
   }
   if(!value||!value.speed||p.age>=p.life||origin.x<-20||origin.y<-20||origin.x>size.x+20||origin.y>size.y+20){if(dt)this.particles[i]=spawn(i);continue;}
   const direction=projectedWind(this.map,{lat:p.lat,lon:p.lon,from:value.from},p.lon,basis),dx=Math.cos(direction.angle),dy=Math.sin(direction.angle);
   const length=5+Math.min(12,Math.sqrt(value.speed)*2),alpha=Math.sin(Math.PI*Math.min(1,p.age/p.life))*p.brightness;
   ctx.save();ctx.globalAlpha=alpha;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(origin.x-dx*length/2,origin.y-dy*length/2);ctx.lineTo(origin.x+dx*length/2,origin.y+dy*length/2);
   ctx.lineWidth=2.5;ctx.strokeStyle=color==='#111318'?'#ffffff88':'#12202a40';ctx.stroke();ctx.lineWidth=1.25;ctx.strokeStyle=color;ctx.stroke();ctx.restore();drawn++;
   if(dt){
    const distance=Math.min(75,3+Math.sqrt(value.speed)*10)*tempo*dt;
    const next=this.map.containerPointToLatLng([origin.x+dx*distance,origin.y+dy*distance]);
    let valid=true;const steps=Math.max(1,Math.ceil(distance/.75));for(let j=1;j<=steps;j++){const ll=this.map.containerPointToLatLng([origin.x+dx*distance*j/steps,origin.y+dy*distance*j/steps]);if(!sampleWindField(this.field,ll.lat,ll.lng)){valid=false;break;}}
    if(valid){p.lat=next.lat;p.lon=next.lng;p.age+=dt;this.advected++;}else this.particles[i]=null;
   }
  }return drawn;
 }
 destroy(){this.destroyed=true;this.stop();this.map.off('move zoom resize rotate viewreset',this.invalidate);this.map.off('movestart zoomstart',this.moveStart);this.map.off('moveend zoomend',this.moveEnd);document.removeEventListener('visibilitychange',this.visibility);this.motion?.removeEventListener?.('change',this.motionChange);this.points=[];this.particles=[];this.field=null;this.fieldImage=null;this.phases.clear();this.canvas.remove();this.canvas.width=this.canvas.height=1;}
}

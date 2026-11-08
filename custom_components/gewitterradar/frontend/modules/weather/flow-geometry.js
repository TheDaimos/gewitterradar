/* Presentation-only short trajectories. Reuses WR vector cells and swept-mask safety.
 * No data requests, clocks, meteorological policy, noise or generated wind values. */
import {sampleWindFieldInto,windFieldStepValid} from './wind-field.js?v=411161r1';
const DEG=Math.PI/180,CAPACITY=24,boundsCache=new WeakMap();
const latitude=y=>(2*Math.atan(Math.exp(y*DEG))-Math.PI/2)/DEG;
const mercator=lat=>Math.log(Math.tan(Math.PI/4+Math.max(-89.9,Math.min(89.9,lat))*DEG/2))/DEG;
function bounds(field){let b=boundsCache.get(field);if(b?.lookup!==field.lookup){const g=field.grid,s=field.lookup;b={lookup:s,x0:s.x0,x1:s.x1,center:s.center,y0:mercator(g.latitudes[0]),y1:mercator(g.latitudes.at(-1)),cyclic:g.cyclic};boundsCache.set(field,b);}return b;}
function covered(b,lon,my){lon+=360*Math.round((b.center-lon)/360);return Number.isFinite(lon)&&Number.isFinite(my)&&my>=b.y0&&my<=b.y1&&(b.cyclic||lon>=b.x0&&lon<=b.x1);}
function safeStep(field,lon0,my0,lon1,my1){return field.lookup?.allValid?covered(bounds(field),lon0,my0)&&covered(bounds(field),lon1,my1):windFieldStepValid(field,latitude(my0),lon0,latitude(my1),lon1);}
function safeCurveSpan(field,x0,y0,x1,y1,x2,y2){return field.lookup?.allValid?safeStep(field,x0,y0,x2,y2):safeStep(field,Math.min(x0,x1,x2),Math.min(y0,y1,y2),Math.max(x0,x1,x2),Math.max(y0,y1,y2));}
export const flowLength=(speed,percent=100)=>Number.isFinite(speed)&&speed>0?Math.min(64,(7+33*(-Math.expm1(-speed/14)))*Math.max(.5,Math.min(1.5,(Number.isFinite(percent)?percent:100)/100))):0;
export const flowVelocity=(speed,tempo='normal')=>Number.isFinite(speed)&&speed>0?70*(-Math.expm1(-speed/17))*({slow:.55,normal:1,fast:1.7}[tempo]||1):0;
export const flowIsCurved=form=>form==='curved_arrows'||form==='curved_lines';

export class FlowGeometry{
 constructor(){this.sample=new Float64Array(5);this.xy=new Float64Array((CAPACITY+1)*2);this.world=new Float64Array((CAPACITY+1)*2);this.stats={steps:0,lookups:0,points:0,curves:0};this.dx=1;this.dy=0;this.speed=0;}
 resetStats(){this.stats.steps=this.stats.lookups=this.stats.points=this.stats.curves=0;}
 direction(field,lon,my,p){this.stats.lookups++;if(!sampleWindFieldInto(field,latitude(my),lon,this.sample)||this.sample[2]<=0)return false;this.speed=this.sample[2];const u=this.sample[0]/this.speed,v=this.sample[1]/this.speed;this.dx=u*p.eastX+v*p.northX;this.dy=u*p.eastY+v*p.northY;return Number.isFinite(this.dx)&&Number.isFinite(this.dy);}
 // Midpoint/RK2 in the local conformal Mercator basis, at most 2.5 CSS px per substep.
 step(field,lon,my,distance,p,depth=0){
  if(!this.direction(field,lon,my,p))return false;
  const dx=this.dx,dy=this.dy,ax=dx*p.ax+dy*p.bx,ay=dx*p.ay+dy*p.by,mx=lon+ax*distance*.5,mm=my+ay*distance*.5;
  if(!this.direction(field,mx,mm,p))return false;
  if(dx*this.dx+dy*this.dy<.99&&Math.abs(distance)>.12&&depth<4){
   if(!this.step(field,lon,my,distance*.5,p,depth+1))return false;const x=this.nextLon,y=this.nextMy;return this.step(field,x,y,distance*.5,p,depth+1);
  }
  const nx=lon+(this.dx*p.ax+this.dy*p.bx)*distance,ny=my+(this.dx*p.ay+this.dy*p.by)*distance;
  if(!Number.isFinite(nx)||!Number.isFinite(ny)||!safeStep(field,lon,my,nx,ny))return false;
  this.nextLon=nx;this.nextMy=ny;this.stats.steps++;return true;
 }
 append(path,lon,my){path.cursor=(path.cursor+1)%CAPACITY;path.coords[path.cursor*2]=lon;path.coords[path.cursor*2+1]=my;path.count=Math.min(CAPACITY,path.count+1);}
 initialize(field,particle,p,epoch){
  const path=particle.flowPath||(particle.flowPath={coords:new Float64Array(CAPACITY*2),cursor:-1,count:0,epoch:-1});path.count=0;path.cursor=-1;path.epoch=epoch;
  // A short valid backward streamline makes a paused/new selection visible.
  // It is only a seed; the moving body is subsequently actual trajectory history.
  const x=particle.lon,y=particle.my;let lon=x,my=y,n=0;const back=this.world;
  for(let i=0;i<3;i++){if(!this.step(field,lon,my,-2.5,p))break;lon=this.nextLon;my=this.nextMy;back[n*2]=lon;back[n*2+1]=my;n++;}
  for(let i=n-1;i>=0;i--)this.append(path,back[i*2],back[i*2+1]);this.append(path,x,y);return path;
 }
 advance(field,particle,p,dt,tempo,epoch){
  if(!p||!this.direction(field,particle.lon,particle.my,p))return false;
  let path=particle.flowPath;if(!path||!path.count||path.epoch!==epoch){path=this.initialize(field,particle,p,epoch);if(!this.direction(field,particle.lon,particle.my,p))return false;}
  const distance=flowVelocity(this.speed,tempo)*Math.max(0,Math.min(.05,Number.isFinite(dt)?dt:0)),steps=Math.max(1,Math.ceil(distance/2.5)),h=distance/steps;
  for(let i=0;h&&i<steps;i++){
   if(!this.step(field,particle.lon,particle.my,h,p))return false;particle.lon=this.nextLon;particle.my=this.nextMy;particle.lat=latitude(particle.my);
   const at=path.cursor*2,shift=360*Math.round((particle.lon-path.coords[at])/360),dx=particle.lon-path.coords[at]-shift,dy=particle.my-path.coords[at+1],pixels=Math.hypot(dx*p.ex+dy*p.nx,dx*p.ey+dy*p.ny);
   if(pixels>=2.5)this.append(path,particle.lon,particle.my);
  }
  return this.direction(field,particle.lon,particle.my,p);
 }
 // Head first, retaining only a bounded recent length and <140 degrees total turn.
 build(field,particle,p,length,quality=1){
  const path=particle.flowPath;if(!path?.count||!Number.isFinite(length)||length<=0)return 0;
  const w=this.world,xy=this.xy;w[0]=particle.lon;w[1]=particle.my;p.screen(w[0],w[1],xy);let count=1,total=0,turn=0,ux=this.dx,uy=this.dy;
  for(let k=0;k<path.count&&count<=CAPACITY;k++){
   const at=((path.cursor-k+CAPACITY)%CAPACITY)*2,lon=path.coords[at]+360*Math.round((particle.lon-path.coords[at])/360),my=path.coords[at+1],dx=lon-w[(count-1)*2],dy=my-w[(count-1)*2+1],sx=dx*p.ex+dy*p.nx,sy=dx*p.ey+dy*p.ny,dist=Math.hypot(sx,sy);
   if(dist<.25)continue;if(!Number.isFinite(dist)||dist>Math.max(80,length*2))break;
   const tx=-sx/dist,ty=-sy/dist;turn+=Math.abs(Math.atan2(ux*ty-uy*tx,ux*tx+uy*ty));if(turn>2.4)break;ux=tx;uy=ty;
   const prev=(count-1)*2,older=Math.max(0,count-2)*2;
   if(!safeCurveSpan(field,w[older],w[older+1],w[prev],w[prev+1],lon,my))break;
   const f=Math.min(1,(length-total)/dist);w[count*2]=w[prev]+dx*f;w[count*2+1]=w[prev+1]+dy*f;const x=w[count*2]-p.ox,y=w[count*2+1]-p.oy;xy[count*2]=x*p.ex+y*p.nx;xy[count*2+1]=x*p.ey+y*p.ny;total+=dist*f;count++;if(f<1||total>=length)break;
  }
  // Decimate rendering only; the full bounded geographic history remains intact.
  const budget=quality<.65?9:13;
  if(count>budget&&field.lookup?.allValid){const last=count-1;for(let i=1;i<budget;i++){const index=Math.round(i*last/(budget-1));xy[i*2]=xy[index*2];xy[i*2+1]=xy[index*2+1];}count=budget;}
  if(count>1){const d=Math.min(1.5,Math.hypot(xy[2]-xy[0],xy[3]-xy[1])*.35),lon=particle.lon-(this.dx*p.ax+this.dy*p.bx)*d,my=particle.my-(this.dx*p.ay+this.dy*p.by)*d;
   if(!safeCurveSpan(field,particle.lon,particle.my,w[2],w[3],lon,my))count=0;}
  this.count=count;this.stats.points+=count;if(count>1)this.stats.curves++;return count;
 }
 path(ctx,count=this.count,headOnly=false){
  if(count<2)return;const a=this.xy,start=headOnly?Math.min(count-1,Math.max(1,Math.floor(count*.35))):count-1;ctx.beginPath();ctx.moveTo(a[start*2],a[start*2+1]);
  for(let i=start-1;i>0;i--)ctx.quadraticCurveTo(a[i*2],a[i*2+1],(a[i*2]+a[(i-1)*2])*.5,(a[i*2+1]+a[(i-1)*2+1])*.5);
  const dist=Math.min(1.5,Math.hypot(a[2]-a[0],a[3]-a[1])*.35);ctx.quadraticCurveTo(a[0]-this.dx*dist,a[1]-this.dy*dist,a[0],a[1]);
 }
 draw(ctx,form,color,alpha,outline='#101c2966'){
  if(this.count<2)return false;ctx.lineCap='round';ctx.lineJoin='round';this.path(ctx);
  if(form==='curved_arrows'){const a=this.xy,x=a[0],y=a[1],dx=this.dx,dy=this.dy;ctx.moveTo(x-dx*4-dy*2.4,y-dy*4+dx*2.4);ctx.lineTo(x,y);ctx.lineTo(x-dx*4+dy*2.4,y-dy*4-dx*2.4);}
  ctx.globalAlpha=alpha;ctx.strokeStyle=outline;ctx.lineWidth=2.5;ctx.stroke();ctx.globalAlpha=alpha*(form==='curved_lines'?.48:1);ctx.strokeStyle=color;ctx.lineWidth=1.2;ctx.stroke();
  if(form==='curved_lines'){this.path(ctx,this.count,true);ctx.globalAlpha=alpha*.92;ctx.lineWidth=1.45;ctx.stroke();}ctx.globalAlpha=1;return true;
 }
}

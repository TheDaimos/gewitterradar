import {sampleWindFieldInto,windFieldStepValid} from './wind-field.js?v=411162r1';
import {windMercatorY,windMercatorLatitude} from './wind-canvas.js?v=411162r1';
import {snakeTargetLength,snakeVelocity,smoothSnakeLength,snakeWidthFactor,snakeTailAlpha} from './snake-config.js?v=411162r1';
export const SNAKE_HISTORY_CAPACITY=128,SNAKE_MESH_CAPACITY=40;
const colors=new Map(),cache=new WeakMap(),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function extent(field){let b=cache.get(field);if(!b){const g=field.grid;b={x0:g.longitudes[0],x1:g.longitudes.at(-1),center:(g.longitudes[0]+g.longitudes.at(-1))/2,y0:windMercatorY(g.latitudes[0]),y1:windMercatorY(g.latitudes.at(-1)),cyclic:g.cyclic};cache.set(field,b);}return b;}
export function snakeSafeSpan(field,x0,y0,x1,y1){
 if(!Number.isFinite(x0)||!Number.isFinite(y0)||!Number.isFinite(x1)||!Number.isFinite(y1))return false;
 if(field.lookup?.allValid){const b=extent(field),shift=360*Math.round((b.center-(x0+x1)/2)/360);return Math.min(y0,y1)>=b.y0&&Math.max(y0,y1)<=b.y1&&(b.cyclic||Math.min(x0,x1)+shift>=b.x0&&Math.max(x0,x1)+shift<=b.x1);}
 return windFieldStepValid(field,windMercatorLatitude(y0),x0,windMercatorLatitude(y1),x1);
}
export function createSnakeParticle(id){return {id,history:new Float64Array(SNAKE_HISTORY_CAPACITY*2),cursor:-1,count:0,lon:0,my:0,speed:0,length:0,targetLength:0,age:0,life:14,active:false,dying:false,deathAge:0};}
export class SnakeGeometry{
 constructor(){this.sample=new Float64Array(5);this.xy=new Float64Array(SNAKE_MESH_CAPACITY*2);this.edges=new Float64Array(SNAKE_MESH_CAPACITY*4);this.widths=new Float64Array(SNAKE_MESH_CAPACITY);this.arcs=new Float64Array(SNAKE_MESH_CAPACITY);this.raw=new Float64Array((SNAKE_HISTORY_CAPACITY+1)*2);this.rawArc=new Float64Array(SNAKE_HISTORY_CAPACITY+1);this.count=0;this.length=0;this.lookups=0;this.steps=0;}
 direction(field,x,y,p){this.lookups++;if(!sampleWindFieldInto(field,windMercatorLatitude(y),x,this.sample)||this.sample[2]<=0)return false;this.speed=this.sample[2];const u=this.sample[0]/this.speed,v=this.sample[1]/this.speed;this.dx=u*p.eastX+v*p.northX;this.dy=u*p.eastY+v*p.northY;return true;}
 append(a,x,y){a.cursor=(a.cursor+1)%SNAKE_HISTORY_CAPACITY;a.history[a.cursor*2]=x;a.history[a.cursor*2+1]=y;a.count=Math.min(SNAKE_HISTORY_CAPACITY,a.count+1);}
 // Bounded midpoint/RK2. Time integration also resamples local speed, not only direction.
 step(field,a,p,h,c,distance=null){
  if(!this.direction(field,a.lon,a.my,p))return false;const d=distance??snakeVelocity(this.speed,c.speed)*h,dx=this.dx,dy=this.dy;
  const mx=a.lon+(dx*p.ax+dy*p.bx)*d*.5,my=a.my+(dx*p.ay+dy*p.by)*d*.5;
  if(!this.direction(field,mx,my,p))return false;const travel=distance??snakeVelocity(this.speed,c.speed)*h;
  const nx=a.lon+(this.dx*p.ax+this.dy*p.bx)*travel,ny=a.my+(this.dx*p.ay+this.dy*p.by)*travel;
  if(!snakeSafeSpan(field,Math.min(a.lon,mx,nx),Math.min(a.my,my,ny),Math.max(a.lon,mx,nx),Math.max(a.my,my,ny)))return false;
  a.lon=nx;a.my=ny;this.steps++;
  const at=a.cursor*2,wx=nx-a.history[at],wy=ny-a.history[at+1];if(Math.hypot(wx*p.ex+wy*p.nx,wx*p.ey+wy*p.ny)>=1)this.append(a,nx,ny);
  if(!this.direction(field,nx,ny,p))return false;a.speed=this.speed;return true;
 }
 seed(field,a,p,x,y,c){
  a.lon=x;a.my=y;a.cursor=-1;a.count=0;a.age=0;a.dying=false;a.active=false;this.append(a,x,y);
  if(!this.direction(field,x,y,p))return false;
  // A bounded forward numerical pre-roll supplies a complete initial silhouette.
  // Every seed position follows the supplied field; no backward invented body.
  let travelled=0;for(let i=0;i<100&&travelled<snakeTargetLength(this.speed,c)+3;i++){if(!this.step(field,a,p,0,c,1.25))break;travelled+=1.25;}
  if(travelled<c.minLength||a.count<4)return false;
  a.targetLength=snakeTargetLength(a.speed,c);a.length=a.targetLength;a.active=true;return true;
 }
 advance(field,a,p,dt,c){
  if(!a.active)return false;dt=clamp(Number.isFinite(dt)?dt:0,0,.1);if(a.dying){a.age+=dt;return true;}
  if(!this.direction(field,a.lon,a.my,p))return false;
  const n=Math.max(1,Math.ceil(96*c.speed*dt/1.25)),h=dt/n;
  for(let i=0;i<n;i++){
   if(h&&!this.step(field,a,p,h,c)){a.dying=true;a.deathAge=a.age;break;}
   a.speed=this.speed;a.targetLength=snakeTargetLength(a.speed,c);a.length=smoothSnakeLength(a.length,a.targetLength,h,c.response);
  }a.age+=dt;return true;
 }
 build(field,a,p,c){
  if(!a.active||!this.direction(field,a.lon,a.my,p))return 0;
  const raw=this.raw,arc=this.rawArc;raw[0]=a.lon;raw[1]=a.my;arc[0]=0;let n=1,total=0;
  for(let k=0;k<a.count&&n<=SNAKE_HISTORY_CAPACITY;k++){
   const at=((a.cursor-k+SNAKE_HISTORY_CAPACITY)%SNAKE_HISTORY_CAPACITY)*2,x=a.history[at]+360*Math.round((a.lon-a.history[at])/360),y=a.history[at+1],dx=x-raw[(n-1)*2],dy=y-raw[(n-1)*2+1],d=Math.hypot(dx*p.ex+dy*p.nx,dx*p.ey+dy*p.ny);if(d<.01)continue;
   if(!Number.isFinite(d)||d>250||!snakeSafeSpan(field,raw[(n-1)*2],raw[(n-1)*2+1],x,y))break;raw[n*2]=x;raw[n*2+1]=y;total+=d;arc[n]=total;n++;if(total>=a.length+3)break;
  }
  const length=Math.min(clamp(a.length,c.minLength,c.maxLength),total);if(n<3||length<c.minLength*.75)return this.count=0;
  const ax=raw[2]-raw[0],ay=raw[3]-raw[1],bx=raw[(n-1)*2]-raw[(n-2)*2],by=raw[(n-1)*2+1]-raw[(n-2)*2+1],cos=(ax*bx+ay*by)/(Math.hypot(ax,ay)*Math.hypot(bx,by));
  const count=Math.min(SNAKE_MESH_CAPACITY,Math.max(14,Math.ceil(length/(cos<.7?2:4))+1)),shift=360*Math.round((p.ox-a.lon)/360),bodyEnd=Math.round((count-1)*c.tailStart);let j=1,prevX=a.lon,prevY=a.my;
  for(let i=0;i<count;i++){
   const t=i<=bodyEnd?c.tailStart*i/bodyEnd:c.tailStart+(1-c.tailStart)*(i-bodyEnd)/(count-1-bodyEnd),at=length*t;while(j<n-1&&arc[j]<at)j++;const q=clamp((at-arc[j-1])/(arc[j]-arc[j-1]),0,1),x=raw[(j-1)*2]+(raw[j*2]-raw[(j-1)*2])*q,y=raw[(j-1)*2+1]+(raw[j*2+1]-raw[(j-1)*2+1])*q;
   const dx=x+shift-p.ox,dy=y-p.oy;this.xy[i*2]=dx*p.ex+dy*p.nx;this.xy[i*2+1]=dx*p.ey+dy*p.ny;this.arcs[i]=t;
   this.widths[i]=Math.min(c.bodyWidth,length*.18)*.5*snakeWidthFactor(t,c);
   const radius=Math.max(this.widths[i],i?this.widths[i-1]:0)+.35,rx=(Math.abs(p.ax)+Math.abs(p.bx))*radius,ry=(Math.abs(p.ay)+Math.abs(p.by))*radius;
   if(!snakeSafeSpan(field,Math.min(x,prevX)-rx,Math.min(y,prevY)-ry,Math.max(x,prevX)+rx,Math.max(y,prevY)+ry))return this.count=0;prevX=x;prevY=y;
  }
  this.count=count;this.length=length;this.bodyEnd=bodyEnd;this.profile=c;return count;
 }
 // A variable-width, closed ribbon mesh. Each band's alpha is a continuous
 // local gradient, rather than a screen-wide fade that fails inside a vortex.
 draw(ctx,color,alpha){
  if(this.count<3||alpha<=0)return;const xy=this.xy,w=this.widths,n=this.count;ctx.save();ctx.lineJoin='round';
  let rgb=colors.get(color);if(!rgb){rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)).join(',');colors.set(color,rgb);}
  const edges=this.edges;
  for(let i=0;i<n;i++){
   const a=Math.max(0,i-1)*2,b=Math.min(n-1,i+1)*2,dx=xy[b]-xy[a],dy=xy[b+1]-xy[a+1],mag=Math.hypot(dx,dy)||1,nx=-dy/mag*w[i],ny=dx/mag*w[i];edges[i*4]=xy[i*2]+nx;edges[i*4+1]=xy[i*2+1]+ny;edges[i*4+2]=xy[i*2]-nx;edges[i*4+3]=xy[i*2+1]-ny;
  }
  // One continuous body polygon avoids thin seams and premature body fading.
  for(let start=0;start<n-1;){
   const end=start===0?this.bodyEnd:Math.min(n-1,start+2);
   if(!start)ctx.fillStyle=`rgba(${rgb},${alpha})`;
   else{const gradient=ctx.createLinearGradient(xy[start*2],xy[start*2+1],xy[end*2],xy[end*2+1]);gradient.addColorStop(0,`rgba(${rgb},${alpha*snakeTailAlpha(this.arcs[start],this.profile)})`);gradient.addColorStop(1,`rgba(${rgb},${alpha*snakeTailAlpha(this.arcs[end],this.profile)})`);ctx.fillStyle=gradient;}
   ctx.beginPath();ctx.moveTo(edges[start*4],edges[start*4+1]);for(let j=start+1;j<=end;j++)ctx.lineTo(edges[j*4],edges[j*4+1]);for(let j=end;j>=start;j--)ctx.lineTo(edges[j*4+2],edges[j*4+3]);ctx.closePath();ctx.fill();start=end;
  }
  const dx=xy[0]-xy[2],dy=xy[1]-xy[3],angle=Math.atan2(dy,dx);ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(xy[0],xy[1],Math.max(.45,w[0]*.85),Math.max(.5,w[0]),angle,0,Math.PI*2);ctx.fill();ctx.restore();
 }
}

// Optional presentation layers. The V177 renderer below remains the authority
// for the original geometry, colours, timing, status fading and scheduling.
import {EyeNeon,filamentPointInto} from './eye-neon.js?v=411178r1';
const TAU=Math.PI*2,clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),fract=x=>x-Math.floor(x);
const enabled=c=>c.neonBrilliance>0||c.neonBloom>0||c.neonOrganics>0;
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function point(out,p,n,angle){const f=fract(angle/TAU)*n,a=Math.floor(f),b=(a+1)%n,u=f-a;out[0]=p[a*2]*(1-u)+p[b*2]*u;out[1]=p[a*2+1]*(1-u)+p[b*2+1]*u;return out;}
function line(ctx,p,n,start=0,span=TAU){ctx.beginPath();for(let i=0;i<=n;i++){const u=fract((start+i/n*span)/TAU)*n,a=Math.floor(u),b=(a+1)%n,f=u-a,x=p[a*2]*(1-f)+p[b*2]*f,y=p[a*2+1]*(1-f)+p[b*2+1]*f;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);}}
function glowSprite(color){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#fff');g.addColorStop(.06,'#fff');g.addColorStop(.16,color);g.addColorStop(.36,color+'bb');g.addColorStop(1,color+'00');x.fillStyle=g;x.fillRect(0,0,64,64);return c;}
function dispose(w){w.canvas.remove();for(const c of [w.canvas,w.mask,w.bloom])c.width=c.height=1;for(const r of w.families.values())r.sprite.width=r.sprite.height=1;w.families.clear();w.bridges.length=0;}
export class EyeNeonWow extends EyeNeon{
 sync(items){
  // At zero, super.sync/draw run unchanged. No additional buffers or scheduler.
  super.sync(items);
  for(const s of this.surfaces){
   if(!enabled(s.config)){if(s.wow){dispose(s.wow);delete s.wow;this.draw(s,s.referenceTime??performance.now()/1000,0);}continue;}
   const signature=JSON.stringify([s.config.neonBrilliance,s.config.neonBloom,s.config.neonOrganics]);
   if(signature!==s.wow?.signature){this.draw(s,s.referenceTime??performance.now()/1000,0);s.wow.signature=signature;}
  }
 }
 release(s){if(s.wow)dispose(s.wow);super.release(s);}
 draw(s,time,dt,forceStatic=false){
  super.draw(s,time,dt,forceStatic);
  if(!enabled(s.config))return;
  s.referenceTime=time;
  const start=performance.now(),c=s.config,b=clamp(c.neonBrilliance/100),bloom=clamp(c.neonBloom/100),organic=clamp(c.neonOrganics/100),moving=c.glow==='living'&&!this.motion.matches&&!forceStatic;
  let w=s.wow;
  if(!w){const canvas=document.createElement('canvas'),mask=document.createElement('canvas'),halo=document.createElement('canvas');canvas.className='eye-neon-wow';canvas.setAttribute('aria-hidden','true');canvas.style.cssText='position:absolute;left:50%;top:50%;transform:translate3d(-50%,-50%,0);pointer-events:none;z-index:1';s.host.append(canvas);w=s.wow={canvas,mask,bloom:halo,halo:halo.getContext('2d'),lastBloom:-Infinity,ctx:canvas.getContext('2d'),ink:mask.getContext('2d'),families:new Map(),bridges:[],nextContact:0,serial:0,level:0,detail:1,cost:0,changed:time,goodSince:null,a:new Float64Array(2),z:new Float64Array(2),stats:{}};}
  const extent=s.extent+(9+c.size*.30)*bloom,px=Math.min(640,Math.ceil(extent*2*s.ratio)),ratio=px/(extent*2);
  if(w.canvas.width!==px){w.canvas.width=w.canvas.height=px;w.canvas.style.width=w.canvas.style.height=extent*2+'px';}
  // Low resolution light mask is composed at several radii. Never blur the Eye
  // PNG or weather, and never remove colour/bloom merely because of high DPR.
  const maskPx=Math.min(256,px),mr=maskPx/(extent*2);if(w.mask.width!==maskPx){w.mask.width=w.mask.height=maskPx;w.bloom.width=w.bloom.height=maskPx;w.lastBloom=-Infinity;}
  for(const [ctx,n,r] of [[w.ctx,px,ratio],[w.ink,maskPx,mr]]){ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,n,n);ctx.setTransform(r,0,0,r,n/2,n/2);ctx.lineJoin='round';ctx.lineCap='round';}
  if(moving){
   // Shed optional work before the inherited 1.4s base-quality window. Restore
   // slowly. Stored settings and all base filament parameters remain untouched.
   if(w.cost>3.5&&time-w.changed>.6&&w.level<2){w.level++;w.changed=time;w.goodSince=null;}
   if(w.cost<2){w.goodSince??=time;if(time-w.goodSince>5&&time-w.changed>5&&w.level){w.level--;w.changed=time;w.goodSince=null;}}else w.goodSince=null;
   w.detail+=([1,.72,.45][w.level]-w.detail)*(-Math.expm1(-Math.max(dt,0)/.65));
  }
  const ctx=w.ctx,ink=w.ink,light=Math.pow(c.brightness/100,.72),n=s.stats.samples,active=[...s.rings.values()].filter(r=>r.target&&r.visibility>.01),all=[...s.rings.values()],detail=w.detail,extraCount=moving?Math.ceil(organic*6*detail):0;
  let filaments=0,beads=0,transfers=0;
  for(const r of all){
   let family=w.families.get(r.id);if(!family){family={color:r.color,sprite:glowSprite(r.color),points:Array.from({length:6},()=>new Float32Array(256))};w.families.set(r.id,family);}if(family.color!==r.color){family.sprite.width=family.sprite.height=1;family.sprite=glowSprite(r.color);family.color=r.color;}
   const alpha=light*r.visibility;
   const paths=moving?r.strands.slice(0,Math.min(s.stats.filaments/Math.max(1,all.length),9)).map(v=>v.points):[];
   // Additional filaments use the SAME coherent geometry function, with their
   // own stable seeds. They never modify the protected r.strands arrays.
   for(let id=0;id<extraCount;id++){const p=family.points[id],seed=id+10;for(let j=0;j<n;j++)filamentPointInto(p,j*2,r.radius-(seed-2)*1.05,r.index,seed,j/n*TAU,time,c.intensity);paths.push(p);filaments++;}
   if(!moving){ctx.beginPath();ctx.arc(0,0,r.radius,0,TAU);ink.beginPath();ink.arc(0,0,r.radius,0,TAU);}
   for(let i=0;i<Math.max(1,paths.length);i++){
    const p=paths[i];if(p){line(ctx,p,n);line(ink,p,n);}
    if(bloom){ink.strokeStyle=r.color;ink.globalAlpha=alpha*(moving?.65:1);ink.lineWidth=1.4+2*bloom;ink.stroke();}
    if(b){ctx.strokeStyle=r.color;ctx.lineWidth=.65+b*.6;ctx.globalAlpha=alpha*b*(moving?.70:.95);ctx.stroke();ctx.strokeStyle='#fffafa';ctx.lineWidth=.12+b*.18;ctx.globalAlpha=alpha*b*.90;ctx.stroke();}
    if(p&&i>=paths.length-extraCount){ctx.strokeStyle=r.color;ctx.lineWidth=.45;ctx.globalAlpha=alpha*organic*.7;ctx.stroke();}
    if(p&&(b||i>=paths.length-extraCount))for(let j=0;j<Math.ceil((3+organic*5)*detail);j++){
     const phase=(j/(3+organic*5)+i*.381+r.index*.173+time*(i%2?-.043:.035))*TAU;point(w.a,p,n,phase);const size=(1.5+b*2.2)*(1+.28*Math.sin(time*.4+j*2.4+i));ctx.globalAlpha=alpha*Math.max(b,organic)*.95;ctx.drawImage(family.sprite,w.a[0]-size,w.a[1]-size,size*2,size*2);if(bloom){ink.globalAlpha=alpha*.9;ink.drawImage(family.sprite,w.a[0]-size*1.8,w.a[1]-size*1.8,size*3.6,size*3.6);}beads++;
    }
   }
  }
  if(moving&&organic){
   const limit=Math.max(1,Math.ceil(organic*12*detail));
   if(active.length>1&&time>=w.nextContact&&w.bridges.length<limit){this.contact(s,w,active,n,time,organic);w.nextContact=time+.15+(1-organic)*.7;}
   for(let k=w.bridges.length-1;k>=0;k--){const bridge=w.bridges[k],p=(time-bridge.start)/bridge.life,live=bridge.source.target&&bridge.target.target&&k<limit;
    bridge.fade=live?Math.min(1,bridge.fade+Math.max(dt,.016)*3):Math.max(0,bridge.fade-Math.max(dt,.016)*3);
    if(p>=1||!bridge.fade){w.bridges.splice(k,1);continue;}
    const a=point(w.a,bridge.source.strands[bridge.si].points,n,bridge.sa),z=point(w.z,bridge.target.strands[bridge.ti].points,n,bridge.ta),dx=z[0]-a[0],dy=z[1]-a[1],d=Math.hypot(dx,dy),bend=(3+Math.sin(time*.35+bridge.seed)*3),cx=(a[0]+z[0])/2-dy/(d||1)*bend,cy=(a[1]+z[1])/2+dx/(d||1)*bend;
    // Endpoints always follow the actual moving source/target filaments. A
    // contact that opens too far fades instead of becoming a long random ray.
    const envelope=smooth(p/.13)*(1-smooth((p-.67)/.33))*bridge.fade*clamp((35-d)/15),alpha=light*organic*envelope;
    for(const x of [ctx,ink]){x.beginPath();x.moveTo(a[0],a[1]);x.quadraticCurveTo(cx,cy,z[0],z[1]);x.strokeStyle=bridge.source.color;x.lineWidth=x===ink?3:.9+b*.6;x.globalAlpha=alpha*(x===ink?.9:1);x.stroke();}
    if(p<.58){const u=smooth(p/.58),v=1-u,x=v*v*a[0]+2*v*u*cx+u*u*z[0],y=v*v*a[1]+2*v*u*cy+u*u*z[1],size=3+b*3;ctx.globalAlpha=alpha;ctx.drawImage(w.families.get(bridge.source.id).sprite,x-size,y-size,size*2,size*2);beads++;}
    if(p>.43){const u=(p-.43)/.57,angle=bridge.ta+bridge.direction*u*1.7,fade=light*organic*bridge.fade*Math.sin(Math.PI*smooth(u)),target=bridge.target.strands[bridge.ti].points;
     // Temporary source-colour energy travels along an unchanged target path.
     line(ctx,target,n,angle-bridge.direction*.40,bridge.direction*.40);ctx.strokeStyle=bridge.source.color;ctx.lineWidth=1+b*.8;ctx.globalAlpha=fade;ctx.stroke();point(w.a,target,n,angle);const size=3+b*2;ctx.drawImage(w.families.get(bridge.source.id).sprite,w.a[0]-size,w.a[1]-size,size*2,size*2);if(bloom){line(ink,target,n,angle-bridge.direction*.45,bridge.direction*.45);ink.strokeStyle=bridge.source.color;ink.lineWidth=4;ink.globalAlpha=fade;ink.stroke();}transfers++;
    }
   }
  }else w.bridges.length=0;
  if(bloom){
   const key=JSON.stringify([c.neonBloom,c.brightness,c.neonOrganics,c.neonBrilliance,moving,all.map(r=>[r.color,r.target])]);
   if(w.bloomKey!==key||time<w.lastBloom||time-w.lastBloom>.12+w.level*.06){const halo=w.halo;halo.setTransform(1,0,0,1,0,0);halo.clearRect(0,0,maskPx,maskPx);for(const [blur,alpha] of [[18,.9],[8,.95],[2,.55]]){halo.filter=`blur(${blur*mr*(.35+bloom*.9)}px)`;halo.globalAlpha=bloom*alpha;halo.drawImage(w.mask,0,0);}halo.filter='none';w.lastBloom=time;w.bloomKey=key;}
   ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='destination-over';ctx.globalAlpha=1;ctx.drawImage(w.bloom,0,0,px,px);ctx.restore();
  }
  for(const [id,f] of w.families)if(!s.rings.has(id)&&!w.bridges.some(v=>v.source.id===id||v.target.id===id)){f.sprite.width=f.sprite.height=1;w.families.delete(id);}
  const cpu=performance.now()-start;w.cost=w.cost*.8+cpu*.2;this.wowCpu=(this.wowCpu||0)+cpu;w.cpuFrames=(w.cpuFrames||0)+1;w.cpuTotal=(w.cpuTotal||0)+cpu;w.cpuMax=Math.max(w.cpuMax||0,cpu);
  w.stats={cpuMs:cpu,cpuMeanMs:w.cpuTotal/w.cpuFrames,cpuMaxMs:w.cpuMax,filaments,beads,bridges:w.bridges.length,transfers,quality:w.level,canvasBytes:(px*px+2*maskPx*maskPx)*4,spriteBytes:w.families.size*64*64*4,geometryBytes:w.families.size*6*256*4,frameTime:time};
 }
 contact(s,w,rings,n,time,organic){
  // Bounded angular neighbourhood (not all-pairs point comparison), rotating
  // the deterministic pair order for balanced source/target energy transfer.
  const count=rings.length,start=w.serial++%count,threshold=8+organic*11;
  for(let off=0;off<count;off++){const source=rings[(start+off)%count],target=rings[(start+off+1)%count];if(source.color===target.color||w.bridges.some(v=>v.source===source&&v.target===target&&time-v.start<1))continue;
   let best=null,bestD=threshold*threshold;
   for(let si=0;si<3;si++)for(let ti=0;ti<3;ti++)for(let i=0;i<n;i+=8)for(let delta=-2;delta<=2;delta++){const j=(i+delta+n)%n,a=source.strands[si].points,z=target.strands[ti].points,dx=a[i*2]-z[j*2],dy=a[i*2+1]-z[j*2+1],d=dx*dx+dy*dy;if(d<bestD){bestD=d;best={source,target,si,ti,sa:i/n*TAU,ta:j/n*TAU};}}
   if(best){w.bridges.push({...best,start:time,life:3.8+fract(w.serial*.618)*1.3,seed:w.serial,direction:w.serial%2?1:-1,fade:.01});return;}
  }
 }
 tick(time){
  // Keep optional CPU cost out of the base cost EMA. Global frame gaps remain
  // real; the optional workload has its own earlier quality response above.
  if(!this.surfaces.some(s=>s.wow))return super.tick(time);
  const before=this.wowCpu||0;super.tick(time);
  this.cost=Math.max(0,this.cost-((this.wowCpu||0)-before)*.1);
 }
}

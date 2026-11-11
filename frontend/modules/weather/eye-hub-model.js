// UI configuration only. No weather decisions, requests or expiry rules.
export const EYE_HUB_KEY='gewitterradar:eye-bubble:v1';
export const EYE_UI_SLOTS=8,EYE_CAPACITY=12;
export const EYE_LEGACY_COLORS=Object.freeze(['#FF3DBB','#A66BFF','#377DFF','#28E3EA','#66FF66','#FFE84B','#FF9A32','#FF475D']);
export const EYE_COLORS=Object.freeze(['#FF00CC','#B000FF','#0066FF','#00FFF0','#39FF14','#FFFF00','#FF5F00','#FF003C']);
export const EYE_FUNCTIONS=Object.freeze(['wind','temperature','precipitation','weather-display']);
export const EYE_DEFAULT_COLORS=Object.freeze({wind:EYE_COLORS[3],temperature:EYE_COLORS[6],precipitation:EYE_COLORS[2],'weather-display':EYE_COLORS[0]});
// Keep authoritative stored pixels compatible: 42 CSS px = 100%. Only the
// UI uses percent, so legacy 72px is preserved exactly until an explicit edit.
export const eyeSizePercent=pixels=>pixels/42*100;
export const eyeSizePixels=percent=>Math.round(percent*42/100*1e6)/1e6;
const bounded=(value,fallback,min,max)=>Number.isFinite(Number(value))?Math.max(min,Math.min(max,Number(value))):fallback;
export function normalizeEyeConfig(input,ids=EYE_FUNCTIONS){
 const s=input&&typeof input==='object'&&!Array.isArray(input)?input:{},seen=new Set(),source=Array.isArray(s.slots)?s.slots:EYE_FUNCTIONS;
 const slots=source.slice(0,EYE_CAPACITY).map((item,i)=>{const id=typeof item==='string'?item:item?.functionId;const functionId=ids.includes(id)&&!seen.has(id)?id:null;if(functionId)seen.add(functionId);return {id:'slot-'+(i+1),functionId};});
 if(!slots.length)slots.push({id:'slot-1',functionId:null});
 const colors={};for(const id of ids){const color=String(s.colors?.[id]).toUpperCase(),legacy=EYE_LEGACY_COLORS.indexOf(color);colors[id]=EYE_COLORS.includes(color)?color:legacy>=0?EYE_COLORS[legacy]:EYE_DEFAULT_COLORS[id]||EYE_COLORS[0];}
 return {schema:1,grouped:s.grouped===true,aura:s.aura!==false,glow:s.glow==='living'?'living':'static',size:bounded(s.size,42,36,126),iconSize:bounded(s.iconSize,100,25,300),intensity:bounded(s.intensity,45,0,100),brightness:bounded(s.brightness,65,0,100),backdrop:bounded(s.backdrop,25,0,100),neonBrilliance:bounded(s.neonBrilliance,0,0,100),neonBloom:bounded(s.neonBloom,0,0,100),neonOrganics:bounded(s.neonOrganics,0,0,100),backdropExtent:bounded(s.backdropExtent,0,0,100),eyeAuraGap:Math.round(bounded(s.eyeAuraGap,0,0,30)),auraRingGap:Math.round(bounded(s.auraRingGap,0,0,8)),slots,colors};
}
export function assignEyeSlot(config,index,functionId,ids=EYE_FUNCTIONS){
 const c=normalizeEyeConfig(config,ids);if(index<0||index>=Math.min(c.slots.length,EYE_UI_SLOTS)||!ids.includes(functionId))return c;
 // Occupied targets are not overwritten. Moving an existing function is atomic.
 if(c.slots[index].functionId&&c.slots[index].functionId!==functionId)return c;
 for(const slot of c.slots)if(slot.functionId===functionId)slot.functionId=null;c.slots[index].functionId=functionId;return c;
}
export function resizeEyeSlots(config,delta,ids=EYE_FUNCTIONS){
 const c=normalizeEyeConfig(config,ids);if(delta>0&&c.slots.length<EYE_UI_SLOTS)c.slots.push({id:'slot-'+(c.slots.length+1),functionId:null});
 else if(delta<0&&c.slots.length>1&&c.slots.length<=EYE_UI_SLOTS){if(c.slots.at(-1).functionId)return {config:c,blocked:c.slots.length};c.slots.pop();}
 return {config:c,blocked:null};
}
export const visibleEyeSlots=c=>c.slots.slice(0,EYE_UI_SLOTS);
export const eyeRingRadius=(size,index,eyeAuraGap=0,auraRingGap=0)=>size/2+5+eyeAuraGap+index*(4+size/42+auraRingGap);
export const eyeGlowMargin=c=>14+c.intensity*.24;
export const eyeGlowExtent=c=>eyeRingRadius(c.size,Math.min(8,c.slots.length)-1,c.eyeAuraGap,c.auraRingGap)+eyeGlowMargin(c);
export const eyeAuraOn=(config,status)=>config.grouped&&config.aura&&status.active&&status.available;

// Compact occupied bubbles; empty slots never reserve a position. Prefer the
// direction with room toward the map centre, and reject overlaps/obstacles.
export function eyeBubbleLayout(count,center,bounds,obstacles=[],eyeSize=42,iconSize=100){
 const size=Math.max(50,50*iconSize/100),half=size/2,pad=9,minDistance=Math.max(58,eyeSize/2+half+12),firstRadius=Math.max(76,minDistance+4),angle=Math.atan2((bounds.top+bounds.bottom)/2-center.y,(bounds.left+bounds.right)/2-center.x),points=[];
 const clear=p=>p.x-size/2>=bounds.left+pad&&p.x+size/2<=bounds.right-pad&&p.y-size/2>=bounds.top+pad&&p.y+size/2<=bounds.bottom-pad&&
  Math.hypot(p.x-center.x,p.y-center.y)>minDistance&&!points.some(q=>Math.hypot(p.x-q.x,p.y-q.y)<size+9);
 const blocked=p=>obstacles.some(b=>p.x+half>b.left&&p.x-half<b.right&&p.y+half>b.top&&p.y-half<b.bottom);
 const candidates=[];for(const radius of [firstRadius,firstRadius+size+12,firstRadius+2*(size+12)])for(let i=0;i<24;i++){const a=angle+(i%2?1:-1)*Math.ceil(i/2)*Math.PI/12;candidates.push({x:center.x+Math.cos(a)*radius,y:center.y+Math.sin(a)*radius});}
 for(let i=0;i<count;i++){
  let point=candidates.find(p=>clear(p)&&!blocked(p))||candidates.find(clear);
  if(!point){for(let y=bounds.top+half+pad;y<=bounds.bottom-half-pad&&!point;y+=size+9)for(let x=bounds.left+half+pad;x<=bounds.right-half-pad&&!point;x+=size+9){const p={x,y};if(clear(p))point=p;}}
  if(point)points.push(point);
 }
 return points;
}

export const EYE_ICON_METRICS=Object.freeze({wind:{box:47*272/256,source:272,motif:256},temperature:{box:47*272/256,source:272,motif:256},precipitation:{box:47*1254/977,source:1254,motif:977},'weather-display':{box:47*1254/1145,source:1254,motif:1145}});
export const eyeIconBox=(id,percent=100)=>(EYE_ICON_METRICS[id]?.box||50)*percent/100;
export const eyeIconTarget=percent=>Math.max(50,50*percent/100);

// Optional visual bounds; at zero the V177 geometry remains unchanged.
export const eyeBackdropDiameter=c=>c.size*1.45+c.size*.020*(c.backdropExtent||0);
export const eyeStudioExtent=(c,bloom=c.neonBloom||0)=>Math.max(eyeGlowExtent(c)+(9+c.size*.30)*bloom/100,c.backdropExtent?eyeBackdropDiameter(c)/2:0);

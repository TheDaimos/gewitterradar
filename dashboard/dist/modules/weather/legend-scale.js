import {legendInk} from './legend-contrast.js?v=4124r1';
import {normalizeLegendOptions} from './legend-hub-model.js?v=4131r1';
let context;
const measure=text=>{context||=document.createElement('canvas').getContext('2d');context.font='11px system-ui';return context.measureText(String(text)).width;};
export function fitLegendLabels(ticks,length,{vertical=false,density='medium',measureText=text=>String(text).length*6.5}={}){
 const sorted=ticks.filter(t=>Number.isFinite(t.position)&&t.position>=0&&t.position<=1&&String(t.label).length).sort((a,b)=>a.position-b.position);
 if(!sorted.length)return [];
 const first=sorted[0],last=sorted.at(-1),middle=sorted.find(t=>t.center)||sorted.reduce((a,b)=>Math.abs(a.position-.5)<=Math.abs(b.position-.5)?a:b),priority=[first,last,...(density==='coarse'?[]:[middle])];
 if(density==='medium')for(const p of [.25,.75])priority.push(sorted.reduce((a,b)=>Math.abs(a.position-p)<=Math.abs(b.position-p)?a:b));
 if(density==='detailed')priority.push(...sorted);
 const chosen=[],box=t=>{const width=vertical?18:Math.min(length,measureText(t.label)+8),x=t.position*length;return {a:Math.max(0,Math.min(length-width,x-width/2)),b:Math.max(width,Math.min(length,x+width/2))};};
 for(const t of priority){if(chosen.includes(t))continue;const b=box(t);if(chosen.every(v=>{const a=box(v);return b.a>=a.b+5||b.b+5<=a.a;}))chosen.push(t);}
 return chosen.sort((a,b)=>a.position-b.position);
}

export function ensureLegendScaleStyle(shadow){
 if(shadow.getElementById('legend-scale-style'))return;
 const style=document.createElement('style');style.id='legend-scale-style';style.textContent=`
 .lh-scale{position:relative;box-sizing:border-box;flex:none;margin:0;font:11px/16px system-ui;font-variant-numeric:tabular-nums}.lh-color-bar{position:absolute;box-sizing:border-box;overflow:hidden;border-radius:4px;box-shadow:inset 0 0 0 1px #ffffff50}.lh-scale.thermometer .lh-color-bar{border-radius:999px;box-shadow:inset 0 2px 3px #fff7,inset 0 -2px 3px #0007,0 0 0 1px #cdd8e5}.lh-label{position:absolute;z-index:2;white-space:nowrap;line-height:16px;pointer-events:none}.lh-scale.horizontal .lh-label{transform:translateX(-50%)}.lh-scale.horizontal .lh-label[data-edge=first]{transform:none}.lh-scale.horizontal .lh-label[data-edge=last]{transform:translateX(-100%)}.lh-scale.vertical .lh-label{transform:translateY(-50%)}.lh-scale.vertical .lh-label[data-edge=first]{transform:none}.lh-scale.vertical .lh-label[data-edge=last]{transform:translateY(-100%)}.lh-mark{position:absolute;display:block;z-index:2;background:var(--lh-metal);box-shadow:0 0 1px #fff,0 1px 1px #000;pointer-events:none}.lh-scale.clean .lh-mark[data-priority=false]{opacity:.5}.lh-scale-split{position:absolute;z-index:1;background:#0b1520;pointer-events:none}.lh-scale-unit{position:absolute;bottom:0;right:0;font:10px/12px system-ui;color:#e3eaf0}
 `;shadow.append(style);
}
const SIZES={S:200,M:280,L:360,XL:440};
export function renderLegendScale(model,options={},available=430){
 const c=normalizeLegendOptions(options),vertical=c.orientation==='vertical',length=Math.max(60,Math.min(options.preview?Math.max(SIZES[c.size],available*({S:.72,M:.82,L:.92,XL:1})[c.size]):SIZES[c.size],available)),root=document.createElement('div'),split=c.labels==='inside'&&c.ticks==='inside';
 root.className='lh-scale '+c.orientation+' '+c.style;root.dataset.labels=c.labels;root.dataset.ticks=c.ticks;root.dataset.split=String(split);root.style.setProperty('--lh-length',length+'px');root.style.setProperty('--lh-metal',({brass:'#b99c57',platinum:'#e5e4e2',gold:'#f4c65d',silver:'#bfc7d1',black:'#111318'})[c.material]);
 const entries=model.entries||[],ticks=model.ticks?.length?model.ticks:entries.map((e,i)=>({position:i/Math.max(1,entries.length),label:String(e.value??e.label)})),labels=fitLegendLabels(ticks,length,{vertical,density:c.density,measureText:measure}),textWidth=Math.ceil(Math.max(0,...labels.map(t=>measure(t.label))))+4;
 const needsUnit=model.unit&&!labels.every(t=>String(t.label).includes(model.unit)),unitNeeded=needsUnit&&!options.unitInCaption,unitHeight=unitNeeded?14:0;root.dataset.unit=model.unit||'';root.dataset.needsUnit=String(!!needsUnit);
 const thick=c.style==='thermometer'?24:c.style==='precision'?18:14,barCross=vertical?(c.labels==='inside'?textWidth+(split?18:4):thick):(split?38:c.labels==='inside'?Math.max(thick,22):thick);
 const labelLane=vertical?textWidth+4:18,tickLane=14,before=(c.labels==='before'?labelLane:0)+(c.ticks==='before'?tickLane:0),after=(c.labels==='after'?labelLane:0)+(c.ticks==='after'?tickLane:0),cross=before+barCross+after;
 root.style.width=(vertical?cross:length)+'px';root.style.height=(vertical?length+unitHeight:cross+unitHeight)+'px';
 const bar=document.createElement('div');bar.className='lh-color-bar';bar.setAttribute('role','img');bar.setAttribute('aria-label',entries.map(e=>e.label??e.value).join(' · ')+' '+(model.unit||''));
 if(model.gradient)bar.style.background=model.gradient.replace('90deg',vertical?'180deg':'90deg');
 else bar.style.background='linear-gradient('+(vertical?'to bottom':'to right')+','+entries.flatMap((e,i)=>[e.color+' '+i/entries.length*100+'%',e.color+' '+(i+1)/entries.length*100+'%']).join(',')+')';
 Object.assign(bar.style,vertical?{top:'0px',left:before+'px',height:length+'px',width:barCross+'px'}:{left:'0px',top:before+'px',width:length+'px',height:barCross+'px'});root.append(bar);
 if(split){const lane=document.createElement('div');lane.className='lh-scale-split';Object.assign(lane.style,vertical?{top:'0px',height:length+'px',left:before+15+'px',width:barCross-15+'px',borderLeft:'1px solid #ffffff38'}:{left:'0px',width:length+'px',top:before+17+'px',height:barCross-17+'px',borderTop:'1px solid #ffffff38'});root.append(lane);}
 const markCross=c.ticks==='before'?before-12:c.ticks==='after'?before+barCross+2:before+3;
 for(const tick of ticks){const mark=document.createElement('i');mark.className='lh-mark';mark.style.setProperty('--p',tick.position*100+'%');mark.dataset.priority=String(labels.includes(tick));const major=labels.includes(tick),extent=major&&c.style!=='clean'?10:major?8:5,along=clampPosition(tick.position*length,0,length-2);Object.assign(mark.style,vertical?{top:along+'px',left:markCross+'px',height:c.style==='precision'?'2px':'1px',width:extent+'px'}:{left:along+'px',top:markCross+'px',width:c.style==='precision'?'2px':'1px',height:extent+'px'});root.append(mark);}
 const labelCross=c.labels==='before'?0:c.labels==='after'?before+barCross+(c.ticks==='after'?tickLane:0)+2:before+(vertical?(split?18:2):(split?19:Math.max(0,(barCross-16)/2)));
 for(const tick of labels){const label=document.createElement('span');label.className='lh-label';label.textContent=tick.label;label.style.setProperty('--p',tick.position*100+'%');label.dataset.edge=labels.length===1?'middle':tick===labels[0]?'first':tick===labels.at(-1)?'last':'middle';Object.assign(label.style,vertical?{top:tick.position*length+'px',left:labelCross+'px'}:{left:tick.position*length+'px',top:labelCross+'px'});
  const sample=model.sample?.(tick.position)||entries[Math.min(entries.length-1,Math.floor(tick.position*entries.length))]?.color||'#0b1520',background=c.labels==='inside'&&!split?sample:'#0b1520',ink=legendInk(background,c.foreground,c.autoInvert);label.style.color=ink.color;if(c.labels==='inside')label.style.backgroundColor=background;label.dataset.contrast=String(ink.ratio);label.style.textShadow=c.shadow?(ink.color==='#000000'?'0 1px 2px #ffffff99':'0 1px 3px #000'):'';label.style.webkitTextStroke=c.outline?'.25px '+(ink.color==='#000000'?'#ffffff88':'#00000088'):'';root.append(label);
 }
 if(unitNeeded){const unit=document.createElement('span');unit.className='lh-scale-unit';unit.textContent=model.unit;root.append(unit);}return root;
}
const clampPosition=(n,a,b)=>Math.max(a,Math.min(b,n));

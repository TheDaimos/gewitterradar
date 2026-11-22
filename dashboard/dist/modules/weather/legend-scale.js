import {legendInk} from './legend-contrast.js?v=4124r1';
import {normalizeLegendOptions} from './legend-hub-model.js?v=4124r1';
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
const SIZES={S:200,M:280,L:360,XL:440};
export function renderLegendScale(model,options={},available=430){
 const c=normalizeLegendOptions(options),vertical=c.orientation==='vertical',length=Math.max(100,Math.min(SIZES[c.size],available)),root=document.createElement('div');root.className='lh-scale '+c.orientation+' '+c.style;root.dataset.labels=c.labels;root.dataset.ticks=c.ticks;root.dataset.split=String(c.labels==='inside'&&c.ticks==='inside');root.style.setProperty('--lh-length',length+'px');root.style.setProperty('--lh-metal',({brass:'#b99c57',platinum:'#e5e4e2',gold:'#f4c65d',silver:'#bfc7d1',black:'#111318'})[c.material]);
 const entries=model.entries||[],bar=document.createElement('div');bar.className='lh-color-bar';bar.setAttribute('role','img');bar.setAttribute('aria-label',entries.map(e=>e.label??e.value).join(' · ')+' '+(model.unit||''));
 const direction=vertical?'to bottom':'to right';
 if(model.gradient){bar.style.background=model.gradient.replace('90deg',vertical?'180deg':'90deg');}
 else bar.style.background='linear-gradient('+direction+','+entries.flatMap((e,i)=>[e.color+' '+i/entries.length*100+'%',e.color+' '+(i+1)/entries.length*100+'%']).join(',')+')';
 root.append(bar);
 const ticks=model.ticks?.length?model.ticks:entries.map((e,i)=>({position:i/Math.max(1,entries.length),label:String(e.value??e.label)}));
 const labels=fitLegendLabels(ticks,length,{vertical,density:c.density,measureText:measure});
 for(const tick of ticks){const mark=document.createElement('i');mark.className='lh-mark';mark.style.setProperty('--p',tick.position*100+'%');mark.dataset.priority=String(labels.includes(tick));root.append(mark);}
 for(const tick of labels){const label=document.createElement('span');label.className='lh-label';label.textContent=tick.label;label.style.setProperty('--p',tick.position*100+'%');label.dataset.edge=labels.length===1?'middle':tick===labels[0]?'first':tick===labels.at(-1)?'last':'middle';
  const sample=model.sample?.(tick.position)||entries[Math.min(entries.length-1,Math.floor(tick.position*entries.length))]?.color||'#0b1520',background=c.labels==='inside'&&c.ticks!=='inside'?sample:'#0b1520',ink=legendInk(background,c.foreground,c.autoInvert);label.style.color=ink.color;if(c.labels==='inside')label.style.backgroundColor=background;label.dataset.contrast=String(ink.ratio);label.style.textShadow=c.shadow?(ink.color==='#000000'?'0 1px 2px #ffffff99':'0 1px 3px #000'):'';label.style.webkitTextStroke=c.outline?'.25px '+(ink.color==='#000000'?'#ffffff88':'#00000088'):'';root.append(label);
 }
 if(model.unit){const unit=document.createElement('span');unit.className='lh-scale-unit';unit.textContent=model.unit;root.append(unit);}
 root.title=entries.map(e=>e.label??e.value).join(' · ');return root;
}

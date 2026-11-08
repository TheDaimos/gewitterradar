import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {installWeatherDisplayMenu} from '../frontend/modules/weather/display-menu.js';
function harness(run){
 class Owner{}installWeatherDisplayMenu(Owner,{});const owner=new Owner(),events=new Map(),classes=new Set(),rect={left:0,top:0,right:800,bottom:600,width:800,height:600},eye={dataset:{},style:{},offsetWidth:50,offsetHeight:50,classList:{add:(...x)=>x.forEach(v=>classes.add(v)),remove:(...x)=>x.forEach(v=>classes.delete(v))},getBoundingClientRect:()=>({...rect,left:10,top:10,width:50,height:50}),addEventListener:(name,fn)=>events.set(name,fn),setPointerCapture(){},releasePointerCapture(){},hasPointerCapture:()=>true};owner.shadow={getElementById:()=>({getBoundingClientRect:()=>rect})};const state={eyeDrag:null};let clock=1000,id=0,opened=0,activated=0,saved=0,positioned=0;const tasks=new Map(),original={set:globalThis.setTimeout,clear:globalThis.clearTimeout,raf:globalThis.requestAnimationFrame,perf:globalThis.performance};
 globalThis.setTimeout=(fn,ms)=>{tasks.set(++id,{fn,at:clock+ms});return id;};globalThis.clearTimeout=id=>tasks.delete(id);globalThis.requestAnimationFrame=()=>0;globalThis.performance={now:()=>clock};
 const advance=ms=>{const end=clock+ms;while(true){const next=[...tasks].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;tasks.delete(next[0]);clock=next[1].at;next[1].fn();}clock=end;};
 const e=(kind='touch',x=10,y=10)=>({pointerId:1,isPrimary:true,pointerType:kind,button:0,clientX:x,clientY:y,detail:1,prevented:false,preventDefault(){this.prevented=true;},stopPropagation(){}});
 const options={element:eye,state:()=>state,longPress:()=>opened++,activate:()=>activated++,position:()=>positioned++,save:()=>saved++};owner._weatherDisplayBindEyeDrag(eye,options);
 try{run({owner,eye,state,events,classes,e,advance,tasks,counts:()=>({opened,activated,saved,positioned})});}finally{globalThis.setTimeout=original.set;globalThis.clearTimeout=original.clear;globalThis.requestAnimationFrame=original.raf;globalThis.performance=original.perf;}
}
test('touch jitter remains a press; exactly 600ms opens once without activating or dragging',()=>harness(h=>{
 h.events.get('pointerdown')(h.e());assert(h.classes.has('pressing'));assert(!h.classes.has('dragging'));h.advance(300);h.events.get('pointermove')(h.e('touch',18,11));h.advance(299);assert.equal(h.counts().opened,0);assert.equal(h.state.eyeDrag.phase,'pressing');h.advance(1);assert.equal(h.counts().opened,1);assert.equal(h.state.eyeDrag.phase,'longpress');h.advance(1500);assert.equal(h.counts().opened,1);h.events.get('pointermove')(h.e('touch',60,30));h.events.get('pointerup')(h.e('touch',60,30));assert.deepEqual(h.counts(),{opened:1,activated:0,saved:0,positioned:0});assert.equal(h.state.eyeDrag,null);
}));
test('one pointerup activates once; both compatibility click forms are suppressed, keyboard remains available',()=>harness(h=>{
 h.events.get('pointerdown')(h.e('mouse'));h.advance(100);h.events.get('pointerup')(h.e('mouse'));assert.equal(h.counts().activated,1);h.events.get('click')(h.e('mouse'));h.events.get('click')({...h.e('mouse'),detail:0});assert.equal(h.counts().activated,1);h.advance(601);h.events.get('click')({...h.e('mouse'),detail:0});assert.equal(h.counts().activated,2);assert.equal(h.counts().saved,0);
}));
test('native touch callout is canceled without canceling the active timer; a real drag cancels it',()=>harness(h=>{
 h.events.get('pointerdown')(h.e());const touch=h.e(),menu=h.e();h.events.get('touchstart')(touch);h.events.get('contextmenu')(menu);assert(touch.prevented&&menu.prevented);h.advance(400);h.events.get('pointermove')(h.e('touch',35,35));assert.equal(h.state.eyeDrag.phase,'dragging');assert(h.classes.has('dragging'));h.advance(800);assert.equal(h.counts().opened,0);h.events.get('pointerup')(h.e('touch',35,35));assert.deepEqual(h.counts(),{opened:0,activated:0,saved:1,positioned:1});assert.equal(h.eye.style.webkitTouchCallout,'none');
}));
test('pointercancel, capture loss and explicit lifecycle cancellation leave no pending press or action',()=>harness(h=>{
 for(const cancel of ['pointercancel','lostpointercapture','lifecycle']){h.events.get('pointerdown')(h.e());h.advance(400);if(cancel==='lifecycle')h.owner._weatherDisplayCancelEyeDrag({element:h.eye,state:()=>h.state,position(){}});else h.events.get(cancel)({...h.e(),type:cancel});h.advance(1000);assert.equal(h.state.eyeDrag,null);assert.equal(h.counts().opened,0);assert.equal(h.counts().activated,0);assert(!h.classes.has('pressing'));assert(!h.classes.has('dragging'));assert.equal(h.tasks.size,0);}
}));
test('Eye decoration and meteorological render/data paths remain exact except cache import identities',()=>{
 const before=p=>execFileSync('git',['show','7185af7779549e163c00f5012311732260da4ba0:'+p],{encoding:'utf8',maxBuffer:10000000}).replace(/\r/g,''),now=p=>readFileSync(p,'utf8').replace(/\r/g,''),norm=s=>s.replace(/(\.js\?v=)\d+r\d+/g,'$1CACHE');
 const p='frontend/modules/weather/display-menu.js',part=s=>s.slice(s.indexOf('  _weatherDisplayEnsureStyle(){'),s.indexOf('  _weatherDisplayEnsure',s.indexOf('  _weatherDisplayEnsureStyle(){')+15));assert.equal(part(now(p)),part(before(p)),'actual Eye styling remains unchanged');
 for(const name of ['wind-data.js','wind-field.js','wind-canvas.js','temperature-data.js','temperature-field.js','temperature-canvas.js','frame-clock.js','consumer-client.js','precipitation-layer.js']){const p='frontend/modules/weather/'+name;assert.equal(norm(now(p)),norm(before(p)),name);}
});

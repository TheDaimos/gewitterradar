/* Run with the same Playwright, Leaflet and optional CHROME_PATH as the other browser tests. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {fixture}=require('./wind-perf-browser-fixture.cjs');

const ref='e3fa9e5753ab7542217d624c54ae99f4b9738a7b';
const evidence=process.env.GR_EYE_EDGE_EVIDENCE;
const eyeId='#weather-display-eye-control';
const positions=[
 ['top-left',0,0],['bottom-right',1,1],['top-right',1,0],['bottom-left',0,1],
 ['top',.5,0],['bottom',.5,1],['left',0,.5],['right',1,.5],
];
const round=(x,n=3)=>Number(x.toFixed(n));
const frame=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
const rects=page=>page.evaluate(()=>{
 const r=id=>{const {left,top,right,bottom,width,height}=card.shadow.getElementById(id).getBoundingClientRect();return {left,top,right,bottom,width,height};};
 const eye=r('weather-display-eye-control');
 const hit=card.shadow.elementFromPoint(eye.left+eye.width/2,eye.top+eye.height/2);
 const m=card.shadow.querySelector('#weather-display-eye-control .eye-master').getBoundingClientRect();
 return {eye,map:r('map'),master:{left:m.left,top:m.top,right:m.right,bottom:m.bottom},
  hit:hit?.id==='weather-display-eye-control',hitInfo:{tag:hit?.tagName,id:hit?.id,cls:String(hit?.className),layers:card.shadow.elementsFromPoint(eye.left+eye.width/2,eye.top+eye.height/2).slice(0,5).map(n=>[n.tagName,n.id,String(n.className)])},saved:structuredClone(card._weatherDisplayState().config.eyePosition)};
});
const near=(actual,expected,message)=>assert(Math.abs(actual-expected)<.8,message+' '+[actual,expected]);
const unshifted=(a,b,where)=>{
 near(a.left,b.left,where+' x');
 near(a.top,b.top,where+' y');
};
function expected({eye,map,master,hit,hitInfo,saved},x,y,name){
 assert(hit,name+' hit test '+JSON.stringify({eye,map,hitInfo,saved}));
 near(eye.left,map.left+(map.width-eye.width)*x,name+' left');
 near(eye.top,map.top+(map.height-eye.height)*y,name+' top');
 assert(master.left>=map.left-.5&&master.top>=map.top-.5&&master.right<=map.right+.5&&master.bottom<=map.bottom+.5,name+' master fully visible');
 assert(Math.abs(saved.x-x)<.006&&Math.abs(saved.y-y)<.006,name+' normalized anchor '+JSON.stringify(saved));
}

async function open(browser,view,baseline=false){
 const f=fixture({ref:baseline?ref:null});
 await new Promise(resolve=>f.server.listen(0,'127.0.0.1',resolve));
 const context=await browser.newContext(view),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await f.route(page);
 const url='http://127.0.0.1:'+f.server.address().port;
 const ready=()=>page.waitForFunction(baseline=>window.ready&&card._mapReady&&card._eyeHubState()&&(baseline||card.__proBranding?.eyeReady),baseline);
 await page.goto(url);
 await ready();
 await page.evaluate(()=>{
  card._setMapDisplayMode('fullscreen',{persist:false});
  card._weatherDisplayPatch({rememberPosition:true,eyePosition:{x:.5,y:.5}});
 });
 await frame(page);
 const cdp=view.hasTouch&&await context.newCDPSession(page);
 const touch=(type,points=[])=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points});
 async function drag(x,y){
  assert(!await page.locator('#eye-hub-config').isVisible(),'edge drag starts without a modal');
  const {eye,map}=await rects(page);
  const start={x:eye.left+eye.width/2,y:eye.top+eye.height/2};
  const end={x:map.left+(x===0?2:x===1?map.width-2:map.width*x),y:map.top+(y===0?2:y===1?map.height-2:map.height*y)};
  if(cdp)await touch('touchStart',[start]);
  else{await page.mouse.move(start.x,start.y);await page.mouse.down();}
  for(let i=1;i<=7;i++){
   const point={x:start.x+(end.x-start.x)*i/7,y:start.y+(end.y-start.y)*i/7};
   if(cdp)await touch('touchMove',[point]);else await page.mouse.move(point.x,point.y);
  }
  const during=await rects(page);
  if(cdp)await touch('touchEnd');else await page.mouse.up();
  await frame(page);
  return {during,after:await rects(page)};
 }
 return {context,page,ready,drag,touch,async close(){await context.close();await new Promise(resolve=>f.server.close(resolve));assert.deepEqual(errors,[]);}};
}

async function setupAura(page){
 await page.evaluate(()=>{
  const state=card._eyeHubState(),original=card._eyeHubStatuses.bind(card);
  window.resetAura=()=>{card._eyeHubStatuses=original;};
  card._eyeHubStatuses=()=>Object.fromEntries([...state.registry.entries].map(([id])=>[id,{active:true,available:true}]));
  card._eyeHubPatch({grouped:true,size:72,aura:true,glow:'living',intensity:80,brightness:95,
   neonBrilliance:60,neonBloom:70,neonOrganics:65,eyeAuraGap:10,auraRingGap:3});
 });
 await frame(page);
}

async function measure(page){
 return page.evaluate(async()=>{
  const {EyeNeon}=await import('/frontend/modules/weather/eye-neon.js');
  const {neon}=card._eyeHubState();
  neon.stop();
  const schedule=neon.schedule;
  neon.schedule=()=>{};
  const s=neon.surfaces[0],ctx=s.ctx,drawImage=ctx.drawImage;
  const out={};
  // Trigger Chromium's readback backend selection before comparing pixels.
  for(let i=0;i<4;i++)ctx.getImageData(0,0,1,1);
  let imageCalls=0;
  ctx.drawImage=function(...args){imageCalls++;return drawImage.apply(this,args);};
  try{
   for(const [label,x,y] of [['centre',.5,.5],['edge',0,.5],['corner',0,0]]){
    card._weatherDisplayPatch({eyePosition:{x,y}});
    const clip=s.clip;
    const pixelRect=()=>{
     const {ratio,extent,canvas}=s,at=v=>Math.max(0,Math.min(canvas.width,Math.round((v+extent)*ratio)));
     const l=at(clip.left)+1,t=at(clip.top)+1;
     return [l,t,at(clip.right)-l-1,at(clip.bottom)-t-1];
    };
    const before=[],after=[];
    function batch(cull){
     s.clip=cull?clip:null;
     for(const ring of s.rings.values())ring.visibility=1;
     imageCalls=0;
     const start=performance.now();
     for(let i=0;i<32;i++)EyeNeon.prototype.draw.call(neon,s,20+i/30,1/30);
     return {cpu:(performance.now()-start)/32,drawImagePerFrame:imageCalls/32};
    }
    batch(false);batch(true);
    for(let i=0;i<5;i++){
     if(i%2){after.push(batch(true));before.push(batch(false));}
     else{before.push(batch(false));after.push(batch(true));}
    }
    s.clip=null;
    EyeNeon.prototype.draw.call(neon,s,28,1/30);
    const original=ctx.getImageData(...pixelRect()).data;
    s.clip=clip;
    EyeNeon.prototype.draw.call(neon,s,28,1/30);
    const cropped=ctx.getImageData(...pixelRect()).data;
    let differentChannels=0,maxChannelDelta=0;
    original.forEach((n,i)=>{if(cropped[i]!==n){differentChannels++;maxChannelDelta=Math.max(maxChannelDelta,Math.abs(cropped[i]-n));}});
    out[label]={before,after,visiblePixelsEqual:differentChannels===0,differentChannels,maxChannelDelta};
   }
  }finally{ctx.drawImage=drawImage;neon.schedule=schedule;neon.schedule();}
  return out;
 });
}

async function bubbles(page,{count,iconSize}){
 const eye=page.locator(eyeId);
 await page.evaluate(({count,iconSize})=>{
  const s=card._eyeHubState();
  for(let i=s.registry.entries.size;i<count;i++)s.registry.add({
   id:'test-edge-'+i,key:'wind',icon:s.registry.entries.get('wind').icon,
   button:'test-edge-'+i,tap(){},hold(){},status:()=>({active:false,available:true}),
  });
  card._eyeHubPatch({grouped:true,slots:[...s.registry.entries.keys()].slice(0,count),iconSize});
 },{count,iconSize});
 await eye.click();
 await frame(page);
 const seen=new Set();
 for(let p=0;p<count;p++){
  const tiles=await page.evaluate(()=>{
   const root=card.shadow.getElementById('eye-hub-bubbles'),map=card.shadow.getElementById('map').getBoundingClientRect();
   const control=card.shadow.querySelector('#weather-display-eye-control').getBoundingClientRect();
   const active=[...root.querySelectorAll('.eye-hub-bubble:not([hidden])')],pager=root.querySelector('.eye-page-controls');
   const rects=[control,...active.map(b=>b.getBoundingClientRect()),...(pager?[pager.getBoundingClientRect()]:[])];
   const contained=rects.every(r=>r.left>=map.left-.5&&r.right<=map.right+.5&&r.top>=map.top-.5&&r.bottom<=map.bottom+.5);
   const spaced=rects.every((a,i)=>rects.slice(i+1).every(b=>a.right<=b.left+.5||a.left>=b.right-.5||a.bottom<=b.top+.5||a.top>=b.bottom-.5));
   const reachable=active.every(b=>{
    const r=b.getBoundingClientRect();
    return card.shadow.elementFromPoint(r.left+r.width/2,r.top+r.height/2)===b;
   });
   return {ids:active.map(b=>b.dataset.function),contained,spaced,reachable,pager:Boolean(pager)};
  });
  assert(tiles.contained&&tiles.spaced&&tiles.reachable&&tiles.ids.length,JSON.stringify(tiles));
  for(const id of tiles.ids)seen.add(id);
  if(seen.size===count)break;
  assert(tiles.pager,'missing bubble pager '+JSON.stringify(tiles));
  await page.locator('[data-eye-page="1"]').click();
 }
 assert.equal(seen.size,count,'every assigned bubble is reachable');
 await eye.click();
}

async function run(){
 const {eyeBubbleLayout,eyePagerPosition}=await import('../frontend/modules/weather/eye-hub-model.js');
 for(const [width,height] of [[393,784],[851,326],[1280,830]]){
  const bounds={left:0,top:0,right:width,bottom:height};
  for(const [,x,y] of positions){
   const eye={x:63+(width-126)*x,y:63+(height-126)*y};
   const blockers=[{left:eye.x-63,top:eye.y-63,right:eye.x+63,bottom:eye.y+63}];
   assert.equal(eyeBubbleLayout(12,eye,bounds,blockers,126).length,12,'12-slot layout at '+[width,height,x,y]);
   const pager=eyePagerPosition(bounds,blockers);
   assert(pager,'pager fits '+[width,height,x,y]);
   const large=eyeBubbleLayout(12,eye,bounds,[...blockers,pager],126,300);
   assert(large.length>0&&large.length<=12);
  }
 }
 const phone={viewport:{width:393,height:851},hasTouch:true,isMobile:true,deviceScaleFactor:2};
 if(evidence)fs.mkdirSync(evidence,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 try{
  let baseline;
  if(evidence){
   const previous=await open(browser,phone,true);
   try{
    await setupAura(previous.page);
    baseline=await previous.drag(0,0);
    await previous.page.screenshot({path:path.join(evidence,'vorher-ecke.png'),scale:'css'});
   }finally{await previous.close();}
  }
  const matrix=[];
  for(const [label,view] of [['Android-Portrait',phone],['Android-Landscape',{...phone,viewport:{width:851,height:393}}],['Desktop',{viewport:{width:1280,height:900}}]]){
   const session=await open(browser,view);
   try{
    const {page}=session;
    await setupAura(page);
    const results=[];
    for(const size of [42,126]){
     await page.evaluate(size=>card._eyeHubPatch({size}),size);
     for(const [name,x,y] of positions){
      const drag=await session.drag(x,y);
      unshifted(drag.during.eye,drag.after.eye,label+' '+size+' '+name);
      expected(drag.after,x,y,name);
      if(size===126&&name==='bottom-right'){
       const toggle=page.locator('#map-display-menu-toggle'),menu=page.locator('#map-display-switch');
       await toggle.click();
       const r=await menu.boundingBox(),m=drag.after.map;
       assert(r&&r.x>=m.left-.5&&r.y>=m.top-.5&&r.x+r.width<=m.right+.5,'displaced map menu must fit');
       await toggle.click();
      }
      results.push({size,name,left:round(drag.after.eye.left),top:round(drag.after.eye.top),
       jumpX:round(drag.after.eye.left-drag.during.eye.left),jumpY:round(drag.after.eye.top-drag.during.eye.top)});
     }
    }
    await session.drag(0,0);
    const atCorner=await rects(page);
    await page.evaluate(()=>card._eyeHubPatch({grouped:false}));
    unshifted(atCorner.eye,(await rects(page)).eye,label+' ungrouped');
    const standalone=await page.evaluate(()=>{
     const nodes=[...card._eyeHubState().registry.entries.values()].map(entry=>card.shadow.getElementById(entry.button));
     return nodes.filter(b=>b?.getBoundingClientRect().width).map(b=>{
      const r=b.getBoundingClientRect();
      const hit=card.shadow.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
      return {id:b.id,hit:hit?.id,operable:b.contains(hit)};
     });
    });
    assert(standalone.length>=4&&standalone.every(b=>b.operable),label+' standalone '+JSON.stringify(standalone));
    await page.evaluate(()=>card._eyeHubPatch({grouped:true}));
    await bubbles(page,{count:8,iconSize:100});
    await bubbles(page,{count:8,iconSize:300});
    unshifted(atCorner.eye,(await rects(page)).eye,label+' bubble menu');
    // Simulated safe-area values feed the same CSS variables as the system insets.
    await page.locator(eyeId).evaluate(eye=>{eye.style.setProperty('--eye-safe-left','21px');eye.style.setProperty('--eye-safe-top','16px');});
    await page.evaluate(()=>card._eyeHubPosition());
    const safe=await rects(page);
    near(safe.eye.left,Math.max(safe.map.left,21),label+' left safe area');
    near(safe.eye.top,Math.max(safe.map.top,16),label+' top safe area');
    assert.deepEqual(safe.saved,{x:0,y:0});
    await page.locator(eyeId).evaluate(eye=>{eye.style.removeProperty('--eye-safe-left');eye.style.removeProperty('--eye-safe-top');});
    await page.evaluate(()=>card._eyeHubPosition());
    // Browser simulation of the three-contact stream. The OS screenshot itself is a device check.
    if(view.hasTouch){
     const {eye,map}=await rects(page);
     const a={x:eye.left+eye.width/2,y:eye.top+eye.height/2,id:1};
     const b={x:map.left+map.width*.5,y:map.top+map.height*.5,id:2};
     const c={x:b.x+40,y:b.y+20,id:3};
     await session.touch('touchStart',[a]);
     await session.touch('touchStart',[a,b]);
     await session.touch('touchStart',[a,b,c]);
     await session.touch('touchCancel');
     await page.locator(eyeId).tap();
     assert.equal(await page.locator(eyeId).getAttribute('aria-expanded'),'true');
     await page.locator(eyeId).tap();
     const again=await session.drag(0,1);
     expected(again.after,0,1,label+' after three contacts');
    }
    // Reload starts in the normal card; switch to the same map mode for geometry comparison.
    await page.reload();
    await session.ready();
    await page.evaluate(()=>card._setMapDisplayMode('fullscreen',{persist:false}));
    await frame(page);
    expected(await rects(page),0,view.hasTouch?1:0,label+' reload');
    if(view.hasTouch){
     const v=view.viewport;
     await page.setViewportSize({width:v.height,height:v.width});
     await frame(page);
     expected(await rects(page),0,1,label+' rotate');
    }
    if(label==='Desktop'){
     await page.evaluate(()=>card._setMapDisplayMode('standard',{persist:false}));
     await page.locator('#map').scrollIntoViewIfNeeded();
     await frame(page);
     const standard=await session.drag(1,1);
     unshifted(standard.during.eye,standard.after.eye,'standard bottom-right');
     expected(standard.after,1,1,'standard bottom-right');
    }
    matrix.push({label,results});
   }finally{await session.close();}
  }
  const sample=await open(browser,phone);
  try{
   await setupAura(sample.page);
   await sample.drag(0,0);
   const clip=await sample.page.locator(eyeId).evaluate(eye=>{
    const map=card.shadow.getElementById('map').getBoundingClientRect();
    const canvas=eye.querySelector('canvas.eye-neon').getBoundingClientRect();
    return {clipPath:getComputedStyle(eye).clipPath,canvasExtends:canvas.top<map.top&&canvas.left<map.left};
   });
   assert(!clip.clipPath.includes('none')&&clip.canvasExtends,JSON.stringify(clip));
   if(evidence)await sample.page.screenshot({path:path.join(evidence,'nachher-ecke.png'),scale:'css'});
   const timing=await measure(sample.page);
   for(const [name,sample] of Object.entries(timing))assert(sample.visiblePixelsEqual,name+' visible Canvas pixels differ '+JSON.stringify(sample));
   assert.equal(timing.centre.before[0].drawImagePerFrame,timing.centre.after[0].drawImagePerFrame);
   assert(timing.edge.after[0].drawImagePerFrame<timing.edge.before[0].drawImagePerFrame*.8);
   assert(timing.corner.after[0].drawImagePerFrame<timing.corner.before[0].drawImagePerFrame*.6);
   const report={browser:browser.version(),baseline,matrix,clip,timing};
   if(evidence)fs.writeFileSync(path.join(evidence,'messung.json'),JSON.stringify(report,null,2)+'\n');
   for(const [where,r] of Object.entries(timing)){
    const median=(list,key)=>round(list.map(a=>a[key]).sort((a,b)=>a-b)[2]);
    console.log(where,JSON.stringify({beforeMs:median(r.before,'cpu'),afterMs:median(r.after,'cpu'),
     beforeDraws:median(r.before,'drawImagePerFrame'),afterDraws:median(r.after,'drawImagePerFrame')}));
   }
   console.log('PASS Eye edge gestures, reload, rotation, eight occupied slots, safe areas, recoveries and Canvas parity');
  }finally{await sample.close();}
 }finally{await browser.close();}
}
run().catch(error=>{console.error(error);process.exitCode=1;});

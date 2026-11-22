/* Real card/Canvas/Leaflet with synthetic HA transport; no Android hardware claim. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {fixture}=require('./wind-perf-browser-fixture.cjs');
const out=process.env.GR_AURA_EVIDENCE||path.resolve('.task412-work/aura-evidence');
fs.mkdirSync(out,{recursive:true});
const frame=page=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
(async()=>{
 const f=fixture();await new Promise(r=>f.server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const results=[];
 try{for(const [name,width,height,touch] of [['desktop',1280,900,false],['portrait',393,851,true],['landscape',851,393,true]]){
  console.log('Aura scenario: '+name);
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,deviceScaleFactor:2}),page=await context.newPage(),errors=[];page.setDefaultTimeout(15000);
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.error(m.text());});await f.route(page);await page.goto('http://127.0.0.1:'+f.server.address().port);
  await page.waitForFunction(()=>window.ready&&card._mapReady&&card.__proBranding?.eyeReady).catch(async e=>{console.error(await page.evaluate(()=>({ready:window.ready,map:!!card._mapReady,branding:card.__proBranding&&{ready:card.__proBranding.eyeReady,installation:card.__proBranding.installation},connection:!!card._hass?.connection,body:document.body.innerHTML.slice(0,1500),boot:window.__GEWITTERRADAR_BOOT_DIAGNOSTICS})),errors);throw e;});
  await page.evaluate(()=>{
   card._setMapDisplayMode('fullscreen',{persist:false});
   const s=card._eyeHubState(),wind=s.registry.entries.get('wind');
   s.registry.add({...wind,id:'future',key:'wind'});
   window.testIds=['wind','temperature','precipitation','weather-display','synoptic','clouds','storm','future'];
   window.testStatuses=Object.fromEntries(testIds.map(id=>[id,{active:true,available:true}]));
   card._eyeHubStatuses=()=>structuredClone(testStatuses);
   card._weatherDisplayPatch({eyePosition:{x:.5,y:.5},rememberPosition:true});
   card._eyeHubPatch({grouped:true,auraLayout:'dynamic',glow:'static',slots:testIds,bubbleAura:Object.fromEntries(testIds.map(id=>[id,true]))});
  });await frame(page);
  for(let count=1;count<=8;count++){
   const result=await page.evaluate(count=>{
    const s=card._eyeHubState();card._eyeHubPatch({slots:testIds.slice(0,count)});
    const surface=s.neon.surfaces[0];
    return {rings:[...surface.rings.values()].filter(r=>r.target).map(r=>({id:r.id,index:r.index,visual:r.visualIndex,radius:r.targetRadius})),slots:s.config.slots.map(s=>s.functionId)};
   },count);
   assert.equal(result.rings.length,count);assert.deepEqual(result.rings.map(r=>r.visual),Array.from({length:count},(_,i)=>i));
  }
  await page.evaluate(()=>card._eyeHubPatch({slots:['wind',null,'temperature',null,'precipitation','weather-display']}));
  await page.waitForTimeout(350);
  const before=await page.evaluate(()=>{
   const s=card._eyeHubState();window.savedRadius=s.neon.surfaces[0].rings.get('weather-display').radius;
   card._eyeHubSetBubbleAura('temperature',false);
   const n=s.neon,surface=n.surfaces[0],r=surface.rings.get('weather-display'),current=r.radius;
   // Inspect the actual Canvas renderer at a deterministic midpoint. Wall-clock
   // sleeps can miss a 240-ms transition on a busy shared CI runner.
   n.stop();n.draw(surface,r.layoutStart+.12,.12);const middle=r.radius;
   n.draw(surface,r.layoutStart+.4,.12);n.schedule();
   return {from:savedRadius,current,middle,target:r.targetRadius};
  });
  assert(before.current>before.target,'radius begins at previous geometry');
  assert(before.middle<before.from&&before.middle>before.target,'finite smooth radius transition');
  await page.waitForTimeout(400);
  assert.equal(await page.evaluate(()=>card._eyeHubState().neon.frame),null,'static mode stops scheduling');
  await page.evaluate(()=>card._eyeHubToggle());await frame(page);
  const stable=await page.evaluate(()=>{
   const root=card.shadow.getElementById('eye-hub-bubbles');window.originalBubble=root.querySelector('[data-function=wind]');
   testStatuses.wind.active=false;card._eyeHubPatch({slots:[null,'weather-display','wind',null,'precipitation']});
   return {same:originalBubble===root.querySelector('[data-function=wind]'),ids:[...root.querySelectorAll('.eye-hub-bubble')].map(n=>n.dataset.function)};
  });
  assert(stable.same,'existing pointer target survives slot changes');
  assert.deepEqual(stable.ids,['weather-display','wind','precipitation'],'configured order and inactive icon retained');
  await page.waitForTimeout(350);
  assert(await page.evaluate(()=>{
   const button=card.shadow.querySelector('#eye-hub-bubbles [data-function=wind]'),cluster=card.shadow.getElementById('map-cluster-jump-overlay');
   const parent=cluster.offsetParent||card.shadow.getElementById('map-card'),r=button.getBoundingClientRect(),p=parent.getBoundingClientRect();
   const old={hidden:cluster.hidden,left:cluster.style.left,top:cluster.style.top};cluster.hidden=false;cluster.style.left=r.left-p.left+4+'px';cluster.style.top=r.top-p.top+4+'px';
   card._eyeHubPosition();const a=button.getBoundingClientRect(),b=cluster.getBoundingClientRect(),clear=a.right<=b.left||a.left>=b.right||a.bottom<=b.top||a.top>=b.bottom;
   cluster.hidden=old.hidden;cluster.style.left=old.left;cluster.style.top=old.top;card._eyeHubPosition();return clear;
  }),'new fixed obstacle is avoided immediately, including during transitions');
  for(const [x,y] of [[0,0],[1,0],[0,1],[1,1],[.5,0],[.5,1],[0,.5],[1,.5]]){
   await page.evaluate(({x,y})=>card._weatherDisplayPatch({eyePosition:{x,y}}),{x,y});await page.waitForTimeout(300);
   const hit=await page.evaluate(()=>{
    const root=card.shadow.getElementById('eye-hub-bubbles'),map=card.shadow.getElementById('map').getBoundingClientRect();
    return [...root.querySelectorAll('.eye-hub-bubble:not([hidden])')].map(n=>{const r=n.getBoundingClientRect();return {inside:r.left>=map.left-.5&&r.top>=map.top-.5&&r.right<=map.right+.5&&r.bottom<=map.bottom+.5,hit:card.shadow.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===n};});
   });assert(hit.length);assert(hit.every(r=>r.inside&&r.hit),name+' edge hit targets');
  }
  await page.screenshot({path:path.join(out,name+'.png')});console.log(name+': geometry and targets passed');
  await page.evaluate(()=>{card._eyeHubClose();card._eyeHubSetBubbleAura('temperature',true);card._eyeHubPatch({slots:['wind','temperature','precipitation','weather-display'],auraLayout:'dynamic'});});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>card._eyeHubState().neon.motion.matches);
  await page.evaluate(()=>card._eyeHubSetBubbleAura('wind',false));
  await page.waitForFunction(()=>{const s=card._eyeHubState();return s.neon.frame===null&&[...s.neon.surfaces[0].rings.values()].every(r=>r.radius===r.targetRadius);}).catch(async e=>{console.error(JSON.stringify(await page.evaluate(()=>{const n=card._eyeHubState().neon;return {frame:n.frame,motion:n.motion.matches,rings:n.surfaces.map(s=>[...s.rings.values()].map(r=>({id:r.id,radius:r.radius,target:r.targetRadius,from:r.fromRadius,start:r.layoutStart})))};})));throw e;});
  console.log(name+': reduced motion passed');
  await page.reload();await page.waitForFunction(()=>window.ready&&card._mapReady);
  assert.equal(await page.evaluate(()=>card._eyeHubState().config.auraLayout),'dynamic','profile reload');
  assert.deepEqual(errors,[]);
  results.push({name,counts:'1–8',sparse:true,transition:true,stableTargets:true,edges:8,reducedMotion:true,reload:true});await context.close();
 }}finally{await browser.close();f.server.closeAllConnections();await new Promise(r=>f.server.close(r));}
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2)+'\n');console.log('PASS V4.12 Aura browser: '+JSON.stringify(results));
})().catch(e=>{console.error(e);process.exitCode=1;});

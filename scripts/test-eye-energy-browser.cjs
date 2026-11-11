const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {flowFixture} = require('./flow-curves-browser-fixture.cjs');

const reference = '33500b7c1720d6b5bd623037bad5aa5e24dd8851';
const output = path.join(os.tmpdir(), 'gr-eye-181');
const views = [['desktop', 1280, 900, 1], ['android', 393, 851, 3], ['ipad', 820, 1180, 2]];
fs.mkdirSync(output, {recursive:true});

async function open(browser, fixture, width, height, dpr) {
 const page = await browser.newPage({viewport:{width,height}, deviceScaleFactor:dpr, hasTouch:dpr>1, isMobile:dpr>1});
 await fixture.route(page);
 await page.goto('http://127.0.0.1:'+fixture.server.address().port);
 await page.waitForFunction(()=>window.ready&&card._map);
 await page.evaluate(()=>card._setMapDisplayMode('fullscreen',{persist:false}));
 return page;
}

async function referencePixels(page) {
 return page.evaluate(async()=>{
  const {EyeNeonWow} = await import('/frontend/modules/weather/eye-neon-wow.js');
  const base = card._eyeHubState().config;
  const statuses = Object.fromEntries(base.slots.map(s=>[s.functionId,{active:true,available:true}]));
  const host = document.createElement('div');
  host.style.cssText='position:fixed;left:45%;top:45%;width:90px;height:90px';
  document.body.append(host);
  const frames = [];
  for (const [size,eyeAuraGap,auraRingGap,neonBloom] of [[42,0,0,0],[70,10,2,40],[126,30,8,100]]) {
   for (const glow of ['static','living']) {
    const renderer = new EyeNeonWow();
    renderer.schedule = ()=>{};
    renderer.sync([{host,statuses,config:{...base,grouped:true,aura:true,glow,size,eyeAuraGap,auraRingGap,
     intensity:100,brightness:100,neonBrilliance:neonBloom,neonBloom,neonOrganics:neonBloom,energyAccents:'off'}}]);
    const surface=renderer.surfaces[0];
    const wow=surface.wow;
    if (wow) Object.assign(wow,{bridges:[],serial:0,nextContact:0,lastBloom:-Infinity,changed:10});
    for(const ring of surface.rings.values())ring.visibility=1;
    for (let index=0;index<42;index++) {
     renderer.draw(surface,10+index/30,1/30);
     if (index%20!==0) continue;
     const png = surface.canvas.toDataURL();
     const nonempty = surface.canvas.getContext('2d').getImageData(0,0,surface.canvas.width,surface.canvas.height).data.some((v,i)=>i%4===3&&v>80);
     frames.push({nonempty,png,addon:wow?.canvas.toDataURL(),bloom:wow?.bloom.toDataURL(),
      bridges:wow?.bridges.map(b=>[b.source.id,b.target.id,b.sa,b.ta]),transfers:wow?.stats.transfers,hasEnergy:!!surface.energy});
    }
    renderer.destroy();
   }
  }
  host.remove();
  return frames;
 });
}

async function controls(page, name) {
 const panel = page.locator('#eye-hub-config');
 await page.evaluate(()=>{
  const hub=card._eyeHubState();
  for(const [id,entry] of hub.registry.entries)hub.registry.entries.set(id,{...entry,status:()=>({active:true,available:true})});
  card._eyeHubPatch({grouped:true,aura:true,glow:'static',size:72,neonBloom:55,neonBrilliance:80,neonOrganics:85,intensity:100,brightness:100});
  card._eyeHubOpen();
 });
 await panel.waitFor({state:'visible'});
 await panel.locator('[data-section=neon-studio]>summary').click();
 const energy=panel.locator('[data-eye-energy]');
 assert.deepEqual(await energy.locator('option').evaluateAll(options=>options.map(o=>o.value)),['off','subtle','normal','strong']);
 assert.equal(await energy.inputValue(),'off');
 for (const mode of ['subtle','normal','strong','off','strong']) {
  await energy.selectOption(mode);
  assert.equal(await page.evaluate(()=>card._eyeHubState().config.energyAccents),mode);
 }
 const palette = panel.locator('.eye-colors');
 for (const [id,color,label] of [['wind','#FFC442','Electric Gold'],['temperature','#D8E6F3',/Chrome/]]) {
  const opener=panel.locator(`[data-eye-color=${id}]`);
  await opener.click();
  assert.equal(await palette.locator('button').count(),10);
  assert(await palette.locator('[aria-pressed=true]').evaluate(node=>node.matches(':focus')));
  const swatch=palette.locator(`[data-eye-paint="${color}"]`);
  assert.match(await swatch.innerText(),new RegExp(label));
  if(name==='desktop') await swatch.press('Enter');
  else await swatch.tap();
  assert.equal(await page.evaluate(id=>card._eyeHubState().config.colors[id],id),color);
  assert(await opener.evaluate(node=>node.matches(':focus')));
 }
 const stage=panel.locator('[data-preview=closed]');
 await stage.scrollIntoViewIfNeeded();
 await stage.screenshot({path:path.join(output,name+'-gold-chrome-static.png')});
 await panel.locator('[data-eye-glow=living]').click();
 await stage.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>card._eyeHubState().neon.surfaces.some(s=>s.host.closest('[data-preview=closed]')&&s.wow?.stats.transfers));
 await stage.screenshot({path:path.join(output,name+'-gold-chrome-living.png')});
 const live=await page.waitForFunction(()=>{
  const surface=card._eyeHubState().neon.surfaces.find(s=>s.host.closest('[data-preview=closed]'));
  const flash=surface?.energy?.flash;
  return flash?.source&&{source:flash.source.id,target:flash.target.id,distance:flash.distance,
   x:flash.x,y:flash.y,extent:surface.extent,png:surface.canvas.toDataURL()};
 });
 const flash=await live.jsonValue();
 assert(flash.source!==flash.target&&flash.distance<=2.35**2&&Math.hypot(flash.x,flash.y)<flash.extent);
 fs.writeFileSync(path.join(output,name+'-contact.png'),Buffer.from(flash.png.split(',')[1],'base64'));
 const before=await page.evaluate(()=>card._eyeHubState().config);
 assert.equal(before.colors.precipitation,'#0066FF');
 assert.equal(before.colors['weather-display'],'#FF00CC');
 await panel.locator('[data-eye-action=restore177]').click();
 const after=await page.evaluate(()=>card._eyeHubState().config);
 assert.deepEqual(after,{...before,neonBrilliance:0,neonBloom:0,neonOrganics:0,backdropExtent:0});
 await page.reload();
 await page.waitForFunction(()=>window.ready&&card._map);
 assert.deepEqual(await page.evaluate(()=>card._eyeHubState().config),after);
}

async function contactTests(page, name) {
 const result=await page.evaluate(async()=>{
  const {paintEnergyAccents,filamentContact}=await import('/frontend/modules/weather/eye-neon-energy.js');
  const {EyeNeonWow}=await import('/frontend/modules/weather/eye-neon-wow.js');
  const host=document.createElement('div');
  host.style.cssText='position:fixed;left:40%;top:40%;width:110px;height:110px;z-index:99999';
  document.body.append(host);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=220;
  const ctx=canvas.getContext('2d');ctx.translate(110,110);host.append(canvas);
  const vector=(x1,y1,x2,y2)=>new Float32Array([x1,y1,x2,y2]);
  const ring=(id,color,points)=>({id,index:id==='a'?0:1,color,strands:[{points},{points}],target:1,visibility:1});
  const a=ring('a','#FFC442',vector(10,0,40,0)),b=ring('b','#D8E6F3',vector(25,-12,25,12));
  const direct={};filamentContact(direct,a.strands[0].points,0,b.strands[0].points,0,2);
  const s={config:{energyAccents:'strong',brightness:100,size:110,glow:'living'},ctx,canvas,host,extent:110,stats:{samples:2},rings:new Map([[a.id,a],[b.id,b]])};
  paintEnergyAccents(s,0,0);paintEnergyAccents(s,1.1,0);
  const event={x:s.energy.flash.x,y:s.energy.flash.y,distance:s.energy.flash.distance,life:s.energy.flash.life,events:s.energy.events};
  const alpha=()=>ctx.getImageData(135,110,1,1).data[3];
  const peak=alpha();ctx.clearRect(-110,-110,220,220);paintEnergyAccents(s,1.17,0);
  const after=alpha();ctx.clearRect(-110,-110,220,220);paintEnergyAccents(s,1.31,0);
  const expired=alpha(),one=s.energy.events===1&&s.energy.flash.source===null;
  const reset=(mode,rings,level=0)=>{
   delete s.energy;s.rings=new Map(rings.map(r=>[r.id,r]));s.config.energyAccents=mode;
   for (let i=0;i<=250;i++)paintEnergyAccents(s,i/10,level);
   return {events:s.energy?.events||0,searches:s.energy?.searches||0,state:!!s.energy};
  };
  const modes=Object.fromEntries(['off','subtle','normal','strong'].map(mode=>[mode,reset(mode,[a,b])]));
  // Supply more than one genuine contact so the repeat-location guard does
  // not intentionally suppress the test's fixed crossing after the first hit.
  const repeated={};
  for (const mode of ['subtle','normal','strong']) {
   delete s.energy;s.config.energyAccents=mode;s.rings=new Map([[a.id,a],[b.id,b]]);
   const times=[];
   for(let i=0;i<=440;i++){
    const time=i/10;
    a.strands[0].points.set([10,Math.sin(time)*20,40,Math.sin(time)*20]);
    b.strands[0].points.set([25,-30,25,30]);
    paintEnergyAccents(s,time,2);
    if(s.energy.events>times.length)times.push(time);
   }
   repeated[mode]=times;
  }
  b.color=a.color;
  const equalColours=reset('strong',[a,b],2);
  const single=reset('strong',[a]);
  b.strands[0].points.set([80,-30,80,30]);
  const separated=reset('strong',[a,b]);
  a.strands[0].points.set([130,0,160,0]);b.strands[0].points.set([145,-10,145,10]);
  const outside=reset('strong',[a,b]);
  const renderer=new EyeNeonWow();
  s.config.glow='static';renderer.drawEnergy(s,25,false);const still=!s.energy;
  s.config.glow='living';Object.defineProperty(renderer.motion,'matches',{value:true,configurable:true});
  renderer.drawEnergy(s,25,false);const reduced=!s.energy;
  delete renderer.motion.matches;host.hidden=true;
  renderer.drawEnergy(s,25,false);const hidden=!s.energy;
  renderer.destroy();host.remove();
  return {direct,event,peak,after,expired,one,modes,repeated,equalColours,single,separated,outside,still,reduced,hidden};
 });
 assert.deepEqual(result.direct,{x:25,y:0,distance:0});
 assert.deepEqual([result.event.x,result.event.y,result.event.distance],[25,0,0]);
 assert(result.event.life>=.07&&result.event.life<=.22);
 assert(result.peak>result.after&&result.after>0&&result.expired===0&&result.one);
 assert.deepEqual(result.modes.off,{events:0,searches:0,state:false});
 for(const mode of ['subtle','normal','strong'])assert(result.modes[mode].events>0);
 for(const [mode,min] of [['subtle',6],['normal',2],['strong',1]]) {
  const times=result.repeated[mode];assert(times.length>=2,JSON.stringify(result.repeated));
  for(let index=1;index<times.length;index++)assert(times[index]-times[index-1]>=min-1e-9);
 }
 assert(result.repeated.strong.length>result.repeated.normal.length&&result.repeated.normal.length>result.repeated.subtle.length);
 assert(result.equalColours.events>0&&result.separated.searches>0);
 for(const entry of ['single','separated','outside'])assert.equal(result[entry].events,0);
 assert(result.still&&result.reduced&&result.hidden);
 console.log(`${name}: verified contact, lifetime, palette persistence, four modes and budgets (${Object.values(result.repeated).map(a=>a.length).join('/')})`);
}

(async()=>{
 const fixtures=[flowFixture(),flowFixture({ref:reference})];
 for(const fixture of fixtures)await new Promise(resolve=>fixture.server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 try {
  for(const [name,width,height,dpr] of views) {
   if(process.env.GR_MENU_VIEW&&process.env.GR_MENU_VIEW!==name)continue;
   const prior=await open(browser,fixtures[1],width,height,dpr);
   const expected=await referencePixels(prior);
   await prior.close();
   const page=await open(browser,fixtures[0],width,height,dpr);
   const errors=[];page.on('pageerror',error=>errors.push(error.message));
   const actual=await referencePixels(page);
   assert(actual.every(frame=>frame.nonempty&&!frame.hasEnergy));
   for(let i=0;i<expected.length;i++)assert(JSON.stringify(actual[i])===JSON.stringify(expected[i]),`${name} V180 frame ${i}`);
   await controls(page,name);
   await contactTests(page,name);
   assert.deepEqual(errors,[]);
   console.log(`${name}: PASS Energy signature and ${actual.length} exact V180 frames`);
   await page.close();
  }
 } finally {await browser.close();for(const fixture of fixtures)fixture.server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

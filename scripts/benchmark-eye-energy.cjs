// Isolated Chromium comparison. Real GR renderers and scheduler, fixture WR data.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {flowFixture} = require('./flow-curves-browser-fixture.cjs');

const baseline = '33500b7c1720d6b5bd623037bad5aa5e24dd8851';
const output = path.join(os.tmpdir(), 'gr-eye-181');
const profiles = [
 ['off','off'], ['subtle','subtle'], ['normal','normal'], ['strong','strong'],
 ['metals','strong',{metals:true}], ['max-gap','strong',{gaps:true}],
 ['max-light','strong',{maxLight:true}], ['large-preview','strong',{preview:true}],
 ['wind','strong',{wind:true}]
];

async function measure(browser, fixture, version, name, mode, settings) {
 const page = await browser.newPage({viewport:{width:393,height:851},deviceScaleFactor:3,isMobile:true,hasTouch:true});
 try {
  await fixture.route(page);
  await page.goto('http://127.0.0.1:'+fixture.server.address().port);
  await page.waitForFunction(()=>window.ready&&card._map);
  await page.evaluate(({mode,settings})=>{
   card._setMapDisplayMode('fullscreen',{persist:false});
   if(settings.wind)card._weatherWindSet({visible:true,enabled:true,mode:'snake',snakeAnimationExplicit:true});
   const hub=card._eyeHubState();
   for(const [id,entry] of hub.registry.entries)hub.registry.entries.set(id,{...entry,status:()=>({active:true,available:true})});
   card._eyeHubPatch({grouped:true,aura:true,glow:'living',size:settings.preview?126:72,backdrop:75,intensity:100,brightness:100,
    neonBrilliance:settings.maxLight?100:65,neonBloom:settings.maxLight?100:50,neonOrganics:settings.maxLight?100:65,
    energyAccents:mode,eyeAuraGap:settings.gaps?30:0,auraRingGap:settings.gaps?8:0,
    ...(settings.metals?{colors:{...hub.config.colors,wind:'#FFC442',temperature:'#D8E6F3'}}:{})});
   if(settings.preview)card._eyeHubOpen();
  },{mode,settings});
  if(settings.wind)await page.waitForFunction(()=>card._weatherWindState().snakePainter);
  if(settings.preview)await page.locator('#eye-hub-config [data-preview=closed]').scrollIntoViewIfNeeded();
  await page.waitForFunction(preview=>card._eyeHubState().neon.surfaces.some(s=>
   Boolean(s.host.closest('[data-preview=closed]'))===Boolean(preview)&&s.stats?.filaments),settings.preview);
  const row=await page.evaluate(preview=>new Promise(resolve=>{
   const renderer=card._eyeHubState().neon;
   const selected=()=>renderer.surfaces.find(s=>Boolean(s.host.closest('[data-preview=closed]'))===Boolean(preview));
   const raf=[],render=[],wow=[],energy=[],contacts=[];
   let started,last,peak=0;
   const before=selected().energy?.events||0;
   const draw=renderer.draw;
   renderer.draw=function(surface,...args){
    const begin=performance.now();
    draw.call(this,surface,...args);
    if(surface!==selected())return;
    render.push(performance.now()-begin);
    wow.push(surface.wow?.stats.cpuMs||0);
    peak=Math.max(peak,Number(!!surface.energy?.flash.source));
   };
   const drawEnergy=renderer.drawEnergy;
   if(drawEnergy)renderer.drawEnergy=function(surface,...args){
    const begin=performance.now(), searches=surface.energy?.searches||0;
    drawEnergy.call(this,surface,...args);
    if(surface!==selected())return;
    const elapsed=performance.now()-begin;
    energy.push(elapsed);
    if(surface.energy?.searches>searches)contacts.push(elapsed);
   };
   const summary=samples=>{
    if(!samples.length)return {mean:0,p50:0,p95:0,n:0};
    samples.sort((a,b)=>a-b);
    return {mean:samples.reduce((a,b)=>a+b,0)/samples.length,p50:samples[Math.floor(samples.length*.5)],p95:samples[Math.floor(samples.length*.95)],n:samples.length};
   };
   function sample(now) {
    started??=now;
    if(last!==undefined)raf.push(now-last);
    last=now;
    if(now-started<8000){requestAnimationFrame(sample);return;}
    const surface=selected(), events=(surface.energy?.events||0)-before;
    resolve({raf:summary(raf),render:summary(render),wow:summary(wow),energy:summary(energy),contacts:summary(contacts),
     seconds:(now-started)/1000,events,eventsPerSecond:events/((now-started)/1000),peak,
     canvasBytes:surface.wow?.stats.canvasBytes||0,addedEffectBufferBytes:0,quality:surface.wow?.level||0});
   }
   requestAnimationFrame(sample);
  }),settings.preview);
  return {version,name,mode,...row};
 } finally {await page.close();}
}

(async()=>{
 const fixtures=[flowFixture({ref:baseline}),flowFixture()];
 for(const fixture of fixtures)await new Promise(resolve=>fixture.server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 try {
  fs.mkdirSync(output,{recursive:true});
  const rows=[];
  for(const [name,mode,settings={}] of profiles) {
   if(['off','max-gap','max-light','large-preview','wind'].includes(name))rows.push(await measure(browser,fixtures[0],'V180',name,'off',settings));
   rows.push(await measure(browser,fixtures[1],'V181',name,mode,settings));
   fs.writeFileSync(path.join(output,'benchmark.json'),JSON.stringify(rows,null,2));
   console.log(JSON.stringify(rows.at(-1)));
  }
 } finally {await browser.close();for(const fixture of fixtures)fixture.server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

/* Same actual Wind painter/density, before and alongside optional thermal rendering.
 * Browser CPU metrics only; no physical Android or GPU/FPS acceptance claim. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {temperatureFixture}=require('./temperature-browser-fixture.cjs');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const out=process.env.GR_TEMP_OUTPUT||path.join(os.tmpdir(),'gr-temperature-perf');fs.mkdirSync(out,{recursive:true});
(async()=>{const f=temperatureFixture();await new Promise(r=>f.server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})}),results=[];
 try{for(const [name,width,height,rate] of [['android-cpu6',393,851,6],['desktop',1280,850,1]]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:rate>1,hasTouch:rate>1}),page=await context.newPage();await f.route(page);await page.goto('http://127.0.0.1:'+f.server.address().port);await page.waitForFunction(()=>window.ready&&card._map);const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');await cdp.send('Emulation.setCPUThrottlingRate',{rate});
 await page.evaluate(()=>{card._setMapDisplayMode('fullscreen',{persist:false});card._map.setView([48,8],5,{animate:false});card._weatherWindSet({visible:true,enabled:true,mode:'animated',animationExplicit:true,density:'high',colorField:false});});await page.waitForFunction(()=>card._weatherWindState().metrics?.segments>0);
 await page.evaluate(()=>{const p=card._weatherWindState().painter;Object.defineProperty(p,'quality',{get:()=>1,set:()=>{}});const paint=p.paint;p.paint=function(t){const start=performance.now();paint.call(this,t);if(window.measuring)window.windSamples.push(performance.now()-start);};});
 for(const stage of ['wind-only','wind-with-temperature','wind-with-advection']){
  if(stage!=='wind-only'){await page.evaluate(adv=>card._weatherTemperatureSet({visible:true,surface:true,labels:true,advection:adv}),stage==='wind-with-advection');await page.waitForFunction(adv=>card._weatherTemperatureState().field&&card._weatherTemperatureState().painter?.image&&(!adv||card._weatherTemperatureState().metrics?.arrows>0),stage==='wind-with-advection');}
  await page.waitForTimeout(500);await page.evaluate(()=>{window.windSamples=[];window.measuring=true;});const before=await cdp.send('Performance.getMetrics'),requests=await page.evaluate(()=>requests.length);await page.waitForTimeout(4000);const after=await cdp.send('Performance.getMetrics'),summary=await page.evaluate(()=>{window.measuring=false;const a=[...windSamples].sort((a,b)=>a-b),s=card._weatherTemperatureState();return {windFrames:a.length,windMeanMs:a.reduce((a,b)=>a+b,0)/a.length,windP95Ms:a[Math.floor(a.length*.95)],windParticles:card._weatherWindState().painter.particles.length,temperature:s.metrics?{...s.metrics}:null,requests:window.requests.length};});
  const metric=(m,k)=>m.metrics.find(x=>x.name===k)?.value;results.push({name,stage,viewport:{width,height},cpuThrottle:rate,physicalDeviceMeasurement:false,...summary,requestsDuringMeasurement:summary.requests-requests,scriptSeconds:metric(after,'ScriptDuration')-metric(before,'ScriptDuration'),heapBytes:metric(after,'JSHeapUsedSize')});console.log(JSON.stringify(results.at(-1)));
 }
 await page.evaluate(()=>{card._weatherTemperatureOpen();card._weatherTemperatureSet({paused:true});});await page.screenshot({path:path.join(out,name+'.png')});await context.close();
 }fs.writeFileSync(path.join(out,'performance.json'),JSON.stringify(results,null,2));}finally{await browser.close();f.server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

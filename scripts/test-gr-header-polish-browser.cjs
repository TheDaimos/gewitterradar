const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {flowFixture}=require('./flow-curves-browser-fixture.cjs');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const out=path.join(os.tmpdir(),'gr-header-polish');fs.mkdirSync(out,{recursive:true});
(async()=>{const f=flowFixture({decorate:h=>h.replace('window.catalog=[cap(WIND),',"window.catalog=[cap('weather.precipitation.layer',{family:'radar',phenomena:['precipitation']}),cap(WIND),")});await new Promise(r=>f.server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
try{for(const [name,w,h,touch] of [['desktop',1280,900,false],['android',393,851,true],['ipad',820,1180,true]]){
 const c=await browser.newContext({viewport:{width:w,height:h},hasTouch:touch,isMobile:touch}),p=await c.newPage();await f.route(p);await p.goto('http://127.0.0.1:'+f.server.address().port);await p.waitForFunction(()=>window.ready&&card._map&&card._weatherDisplayState().status==='ready');
 for(const kind of ['wind','temperature']){
  await p.evaluate(k=>{card[k==='wind'?'_weatherWindOpen':'_weatherTemperatureOpen']();},kind);
  const panel=p.locator('#weather-'+kind+'-panel');await panel.waitFor({state:'visible'});
  const box=await panel.locator(':scope > header').evaluate(e=>{const icon=e.querySelector(':scope>img').getBoundingClientRect(),title=e.querySelector('strong').getBoundingClientRect(),close=e.querySelector('[data-'+(e.closest('#weather-wind-panel')?'wind':'temperature')+'-action=close]').getBoundingClientRect(),r=e.getBoundingClientRect();return {gap:title.left-icon.right,inset:r.right-close.right,overflow:e.scrollWidth-e.clientWidth};});assert(box.gap>=8,JSON.stringify(box));assert(box.inset>=10,JSON.stringify(box));assert(box.overflow<=1,JSON.stringify(box));await p.screenshot({path:path.join(out,name+'-'+kind+'.png')});await panel.locator('[data-'+kind+'-action=close]').click();
 }
 await p.evaluate(()=>card._weatherDisplayOpenFromLayerMenu());const eye=p.locator('#weather-display-panel');await eye.waitFor({state:'visible'});assert.equal(await eye.locator('.weather-display-panel-sub').textContent(),'WeatherRouter');assert(await eye.locator('.weather-display-panel-head > [data-weather-display-minimize]').evaluate(e=>e.classList.contains('gr-premium-action')));
 for(const mode of ['auto','on','off']){const b=eye.locator('[data-weather-display-legend-mode='+mode+']');assert.equal(await b.locator('img').count(),1);await b.click();assert.equal(await b.getAttribute('aria-pressed'),'true');}
 assert(await eye.evaluate(e=>e.scrollWidth<=e.clientWidth+1));await p.screenshot({path:path.join(out,name+'-eye.png')});await c.close();console.log(name+': header spacing, inset close, shared minimize, Eye subtitle and three legend options passed');
}}finally{await browser.close();f.server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

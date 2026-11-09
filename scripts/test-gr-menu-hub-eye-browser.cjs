/* Full registered GR module tree; HA/provider traffic stays in the existing fixture. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {fixture}=require('./wind-perf-browser-fixture.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const out=process.env.GR_MENU_OUTPUT||path.join(os.tmpdir(),'gr-menu-architecture-browser');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const f=fixture({extendHtml:html=>html.replace('window.catalog=[cap(WIND),',"window.catalog=[cap('weather.precipitation.layer',{family:'radar',phenomena:['precipitation']}),cap(WIND),")});await new Promise(r=>f.server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const results=[];
 try{for(const [name,width,height,touch] of [['desktop',1280,900,false],['android-small',320,740,true],['android-landscape',851,393,true],['ipad-portrait',820,1180,true],['ipad-landscape',1180,820,true]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await f.route(page);
  await page.route('**/frontend/project-hub/offline/index.html*',r=>r.fulfill({contentType:'text/html;charset=utf-8',body:fs.readFileSync(path.join(__dirname,'../frontend/project-hub/offline/index.html'))}));
  await page.goto('http://127.0.0.1:'+f.server.address().port);await page.waitForFunction(()=>window.ready&&card._map);
  await page.waitForFunction(()=>card._weatherDisplayState().status==='ready');
  await page.evaluate(()=>{card._setMapDisplayMode('fullscreen',{persist:false});card._weatherPrecipitationPatch({quickVisibility:'all'});card._weatherDisplayOpenFromLayerMenu();});
  const panel=page.locator('#weather-display-panel');await panel.waitFor({state:'visible'});
  const geometry=await panel.evaluate(e=>{
   const actions=[...e.querySelectorAll('.weather-display-panel-head > button')].map(b=>{const r=b.getBoundingClientRect();return {w:r.width,h:r.height,y:r.y+r.height/2};});
   const close=e.querySelector('[data-weather-display-close] img'),settings=card.shadow.getElementById('settings-close').querySelector('img'),info=getComputedStyle(e.querySelector('[data-weather-display-info]'));
   return {actions,exactClose:close.src===settings.src,infoBorder:info.borderTopWidth,infoShadow:info.boxShadow};
  });assert(geometry.exactClose);assert.equal(geometry.actions.length,3);for(const a of geometry.actions){assert.equal(a.w,40,JSON.stringify(geometry.actions));assert.equal(a.h,40);assert(Math.abs(a.y-geometry.actions[0].y)<1);}assert.equal(geometry.infoBorder,'0px');assert.equal(geometry.infoShadow,'none');
  await page.evaluate(()=>card._weatherPrecipitationOpen());const summary=panel.locator('[data-precipitation-control]>summary');await summary.waitFor({state:'visible'});
  const inset=await summary.evaluate(e=>{const a=e.getBoundingClientRect(),b=e.querySelector('.release-history-future-chevron').getBoundingClientRect();return {right:a.right-b.right,center:b.x+b.width/2,width:a.width};});assert(inset.right>=8&&inset.right<=25,JSON.stringify(inset));assert(inset.center>inset.width/2);
  const iconWidth=await page.locator('#weather-precipitation-toggle img').evaluate(e=>parseFloat(getComputedStyle(e).width));assert.equal(iconWidth,58,'desktop reduced, accepted touch size retained');
  await page.screenshot({path:path.join(out,name+'-eye.png')});
  const before=await page.evaluate(()=>{window.rasterRefreshCount=0;const original=card._weatherDisplayRefreshRenderedLayers;card._weatherDisplayRefreshRenderedLayers=function(...args){rasterRefreshCount++;return original.apply(this,args);};return card._weatherRadarState().enabled;});
  await panel.locator('[data-weather-display-close]').click();assert.equal(await page.evaluate(()=>rasterRefreshCount),0);assert.equal(await page.evaluate(()=>card._weatherRadarState().enabled),before);
  await page.evaluate(()=>{card._setMapDisplayMode('standard',{persist:false});card.shadow.getElementById('settings-open').click();});await page.locator('.settings-signature-wrap').click();
  const nav=page.locator('.project-hub-nav');await nav.waitFor({state:'visible'});assert.deepEqual(await nav.locator('a').allTextContents(),['Meine Projekte','Kontakt','GitHub']);assert.equal(await nav.locator('.project-hub-middledot').count(),2);
  assert.equal(await nav.getByRole('link',{name:'Meine Projekte',exact:true}).getAttribute('href'),'https://thedaimos.github.io/project-hub/');assert.equal(await nav.getByRole('link',{name:'Meine Projekte',exact:true}).getAttribute('target'),'_blank');assert.equal(await nav.getByRole('link',{name:'GitHub',exact:true}).getAttribute('href'),'https://github.com/TheDaimos/project-hub');
  const hub=await page.evaluate(()=>{const overlay=card._projectHubOverlay,frame=card._projectHubFrame,close=card._projectHubClose,cr=close.getBoundingClientRect();return {local:new URL(frame.src).pathname.endsWith('/frontend/project-hub/offline/index.html'),exactClose:close.querySelector('img').src===card.shadow.getElementById('settings-close').querySelector('img').src,overlap:[...overlay.querySelectorAll('.project-hub-nav a')].some(a=>{const r=a.getBoundingClientRect();return r.right>cr.left&&r.left<cr.right&&r.top<cr.bottom&&r.bottom>cr.top;})};});assert(hub.local);assert(hub.exactClose);assert(!hub.overlap);
  await page.frameLocator('iframe[title="Daimos Project Hub"]').locator('.contact').waitFor();await nav.getByRole('link',{name:'Kontakt',exact:true}).click();await page.locator('.project-hub-close-premium').click();assert.equal(await page.locator('.project-hub-nav').count(),0);
  await page.locator('.settings-signature-wrap').click();await nav.waitFor({state:'visible'});await page.screenshot({path:path.join(out,name+'-hub.png')});await page.locator('.project-hub-close-premium').click();
  assert.deepEqual(errors,[]);console.log(name+': exact round Settings X; equal Eye actions; right Chevron; ~45px desktop gold ring; local Hub links/dots/no overlap; no radar refresh on close');await context.close();
  results.push({name,passed:true,fullModuleTree:true,syntheticIO:true,physicalDeviceAcceptance:false});
 }fs.writeFileSync(path.join(out,'hub-eye-results.json'),JSON.stringify(results,null,2));}finally{await browser.close();f.server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

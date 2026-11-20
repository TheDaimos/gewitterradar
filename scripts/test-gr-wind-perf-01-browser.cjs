/* Actual complete card. Bbox-limited numeric fixtures exercise buffering and handover. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {fixture}=require('./wind-perf-browser-fixture.cjs');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const out=process.env.WIND_PERF_OUTPUT||path.join(os.tmpdir(),'gr-wind-perf01-browser');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const f=fixture();await new Promise(r=>f.server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})}),results=[];
 try{for(const [name,width,height,touch] of [['desktop',1280,850,false],['android-portrait',393,851,true],['android-landscape',851,393,true],['ipad-portrait',820,1180,true],['ipad-landscape',1180,820,true]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:1}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await f.route(page);
  await page.goto('http://127.0.0.1:'+f.server.address().port);await page.waitForFunction(()=>window.ready&&card._map);assert(await page.evaluate(()=>registry.ok));assert.equal(await page.evaluate(()=>registry.loadedCount),35);
  await page.evaluate(()=>{card._setMapDisplayMode('fullscreen',{persist:false});card._map.setView([48,8],6,{animate:false});});
  const press=loc=>touch?loc.tap():loc.click(),wind=page.locator('#weather-wind-panel');
  await press(page.locator('#weather-display-eye-control'));await page.locator('[data-weather-display-layer-select]').selectOption('wind');await wind.waitFor({state:'visible'});
  await wind.locator('[data-wind-setting=mode]').selectOption('animated');await wind.locator('[data-wind-setting=enabled]').check();await wind.locator('[data-wind-setting=colorField]').check();await press(wind.locator('summary').filter({hasText:'Performance-Diagnose'}));await wind.locator('[data-wind-setting=performanceDiagnostics]').check();
  await page.waitForFunction(()=>card._weatherWindState().field&&card._weatherWindState().painter?.fieldImage&&card._weatherWindState().metrics?.segments>10);
  // The fixture returns exactly the requested bbox: no accidental global cache hit.
  const padding=await page.evaluate(()=>{const b=windRequests[0].context.bbox,m=card._map,s=m.getSize(),a=m.latLngToContainerPoint([b.north,b.west]),z=m.latLngToContainerPoint([b.south,b.east]);return {left:a.x/s.x,top:a.y/s.y,right:z.x/s.x,bottom:z.y/s.y};});
  assert(Math.abs(padding.left+.15)<.01&&Math.abs(padding.top+.15)<.01&&Math.abs(padding.right-1.15)<.01&&Math.abs(padding.bottom-1.15)<.01,'130 percent of width and height');
  await page.evaluate(()=>card._weatherDisplayPatch({enabled:false}));await press(page.locator('#map-display-menu-toggle'));await press(page.locator('[data-weather-wind-entry]'));await wind.waitFor({state:'visible'});
  const icon=await wind.locator('header').evaluate(e=>{const buttons=[...e.querySelectorAll('.weather-wind-icon')];return buttons.map(b=>{const s=getComputedStyle(b),i=b.querySelector('img'),r=i.getBoundingClientRect();return {width:r.width,height:r.height,touch:b.getBoundingClientRect().width,border:s.borderTopWidth,background:s.backgroundColor,source:i.src.length};});});
  assert.equal(icon.length,2);assert(icon.every(i=>i.width===34&&i.height===34&&i.touch>=44&&i.border==='0px'&&i.background==='rgba(0, 0, 0, 0)'&&i.source>20),JSON.stringify(icon));
  assert(await page.evaluate(()=>card.shadow.querySelector('[data-wind-action=close] img').src===card.shadow.querySelector('#settings-close img').src),'reuse actual existing premium close asset');
  if(!touch){await page.keyboard.press('Tab');for(const action of ['legend','close']){const button=wind.locator('[data-wind-action='+action+']');await button.focus();assert.equal(await button.evaluate(e=>getComputedStyle(e).outlineWidth),'2px');assert(await button.getAttribute('aria-label'));}}
  const initial=await page.evaluate(()=>{window.initialField=card._weatherWindState().field;window.initialParticles=card._weatherWindState().painter.particles;return {requests:windRequests.length,renders:card._weatherWindState().painter.fieldRenders};});
  await page.evaluate(()=>card._weatherDisplayPatch({enabled:false}));await page.evaluate(()=>card._map.panBy([card._map.getSize().x*.05,0],{animate:false}));await page.waitForTimeout(600);
  assert.equal(await page.evaluate(()=>windRequests.length),initial.requests,'pan within L2 buffer has no WS request');assert(await page.evaluate(()=>initialField===card._weatherWindState().field&&initialParticles===card._weatherWindState().painter.particles));assert.equal(await page.evaluate(()=>card._weatherWindState().painter.fieldRenders),initial.renders,'reuse prepared geographic colour area');
  await page.evaluate(()=>{const c=card._map.getCenter();card._map.panTo([c.lat,c.lng+360],{animate:false});});await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>windRequests.length),initial.requests,'world copies reuse canonical data');
  await page.evaluate(()=>card._map.setZoom(7,{animate:false}));await page.waitForTimeout(600);assert.equal(await page.evaluate(()=>windRequests.length),initial.requests,'appropriate numeric resolution reused on zoom');
  await page.evaluate(()=>card._map.setZoom(6,{animate:false}));await page.waitForTimeout(350);
  // An out-of-buffer request is held while the current authorized generation animates.
  await page.evaluate(()=>{window.windTransport.mode='defer';card._map.panBy([card._map.getSize().x*.55,0],{animate:false});});await page.waitForFunction(()=>windPending.length>0);
  const loading=await page.evaluate(()=>({id:card._weatherWindState().field.id,advected:card._weatherWindState().painter.advected}));await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>card._weatherWindState().field.id),loading.id);assert((await page.evaluate(()=>card._weatherWindState().painter.advected))>loading.advected,'network delay does not reset or block existing flow');
  await page.evaluate(()=>windPending.splice(0).forEach(resolve=>resolve()));await page.waitForFunction(old=>card._weatherWindState().field.id!==old&&!card._weatherWindState().batch,loading.id);
  assert(await page.evaluate(()=>card._weatherWindState().painter.fieldImage.fieldId===card._weatherWindState().field.id),'numeric field and prepared colour generation switch together');
  const active=await page.evaluate(()=>card._weatherWindState().field.id);
  await page.evaluate(()=>{window.windTransport.mode='failure';window.windTransport.delay=150;card._weatherWindQueue({force:true});});await page.waitForFunction(()=>!card._weatherWindState().batch&&card._weatherWindState().fieldError);assert.equal(await page.evaluate(()=>card._weatherWindState().field.id),active,'transport failure retains previously authorized data');assert.match(await page.evaluate(()=>card._weatherWindState().status),/vorhandenes/);
  const failedRequests=await page.evaluate(()=>windRequests.length);await page.waitForTimeout(1100);assert.equal(await page.evaluate(()=>windRequests.length),failedRequests,'no busy retry loop after a failed renewal');
  // A real new provider/model run becomes one generation, never a blend.
  await page.evaluate(()=>{window.windTransport.mode='ready';window.windTransport.delay=0;window.windTransport.provider='synthetic-next';window.windTransport.run='2026-11-07T12:00:00Z';window.windTransport.validAt='2026-11-07T15:00:00Z';card._weatherWindQueue({force:true});});await page.waitForFunction(()=>card._weatherWindState().field?.provenance.provider_id==='synthetic-next'&&!card._weatherWindState().batch);assert.equal(await page.evaluate(()=>card._weatherWindState().painter.metrics.activeGenerations),1);
  await page.waitForFunction(()=>Number.isFinite(card._weatherWindState().metrics.fps)&&card._weatherWindState().metrics.fps>0);
  await page.evaluate(()=>card._weatherWindOpen());await wind.waitFor({state:'visible'});assert.equal(await wind.evaluate(e=>e.scrollWidth>e.clientWidth+1),false);assert.match(await wind.locator('[data-wind-performance]').textContent(),/FPS.*Browsercache/);
  await page.screenshot({path:path.join(out,name+'-performance-menu.png')});
  for(const mode of ['barbs','arrows','animated']){await wind.locator('[data-wind-setting=mode]').selectOption(mode);await page.waitForTimeout(80);assert.equal(await page.evaluate(()=>card._weatherWindState().config.mode),mode);}
  await wind.locator('[data-wind-setting=paused]').check();await page.waitForTimeout(80);assert.equal(await page.evaluate(()=>card._weatherWindState().painter.frame),null);await wind.locator('[data-wind-setting=paused]').uncheck();
  await wind.locator('[data-wind-setting=enabled]').uncheck();await page.waitForTimeout(80);assert.equal(await page.evaluate(()=>card._weatherWindState().metrics.segments),0,'colour area remains independently enabled');assert(await page.locator('.weather-wind-canvas').evaluate(c=>c.getContext('2d').getImageData(c.width/2,c.height/2,1,1).data[3]>0));await wind.locator('[data-wind-setting=enabled]').check();
  if(name==='desktop'){
   await page.evaluate(()=>{window.windTransport.mode='denied';card._weatherWindQueue({force:true});});await page.waitForFunction(()=>!card._weatherWindState().batch&&!card._weatherWindState().field);assert.equal(await page.evaluate(()=>card._weatherWindState().cache.entries.size),0,'explicit WR revocation clears field grants');
   await page.evaluate(()=>{window.windTransport.mode='ready';card._weatherWindQueue({force:true});});await page.waitForFunction(()=>card._weatherWindState().field&&!card._weatherWindState().batch);
   await page.evaluate(async()=>{const s=card._weatherWindState(),f={...s.field,valid_until:new Date(Date.now()+300).toISOString(),deadline:Date.now()+300};s.cache.put(f,card._map.getZoom());await card._weatherWindApplyField(f,[],++s.generation);window.windTransport.mode='failure';});await page.waitForFunction(()=>!card._weatherWindState().field);assert.equal(await page.evaluate(()=>card._weatherWindState().painter.field),null,'WR grant expiration cannot be extended by L2 or a failed request');
  }
  await page.evaluate(()=>card._weatherWindSet({color:'gold',unit:'kn',performanceDiagnostics:false,paused:true}));await page.reload();await page.waitForFunction(()=>window.ready&&card._map);assert.equal(await page.evaluate(()=>card._weatherWindState().config.color),'gold');assert.equal(await page.evaluate(()=>card._weatherWindState().config.unit),'kn');assert.equal(await page.evaluate(()=>card._weatherWindState().config.performanceDiagnostics),false);
  assert.deepEqual(errors,[]);results.push({name,width,height,status:'passed',physicalCompanionAcceptance:false});console.log(name+': local 130% buffer, seamless handover, transport independence, diagnostics and premium icons passed');await context.close();
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));
 }finally{await browser.close();f.server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

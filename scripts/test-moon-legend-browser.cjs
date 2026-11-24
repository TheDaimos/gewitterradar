/* Actual registered card and Leaflet; WR transport replays calculated ephemerides.
 * This is Chromium emulation, not physical Android or HA acceptance. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {temperatureFixture}=require('./temperature-browser-fixture.cjs');
const out=process.env.GR_MOON_EVIDENCE||path.resolve('.task412-moon/evidence');
const fixtures=JSON.parse(fs.readFileSync(process.env.GR_MOON_FIXTURES||'tests/fixtures/moon-ephemerides.json','utf8'));
fs.mkdirSync(out,{recursive:true});
const captureOnly=process.argv.includes('--capture-only');
async function assertMapFixed(page,before,label){
 // LatLng round-trips can change the last digits; reject even 0.001 CSS px
 // of projected motion, and require the zoom to remain exactly unchanged.
 const measured=await page.evaluate(before=>{const map=card._map;return {zoom:map.getZoom(),pixels:map.project(map.getCenter(),before.zoom).distanceTo(map.project(before.center,before.zoom))};},before);
 assert.equal(measured.zoom,before.zoom,label+' zoom unchanged');assert(measured.pixels<=.001,label+' projected drift '+measured.pixels+' CSS px');return measured.pixels;
}
(async()=>{
 const f=temperatureFixture({decorate:html=>html.replace('window.cleanSource=weatherSourceText;',`window.cleanSource=weatherSourceText;
 window.moonFixtures=${JSON.stringify(fixtures)};window.moonRequests=[];window.moonPending=[];window.moonTransport={mode:'ready'};
 `).replace('requests.push(structuredClone(query));',`requests.push(structuredClone(query));
 if(query.type==='weather_router/consumer/moon'){
  moonRequests.push(structuredClone(query));const mode=moonTransport.mode;
  const reply=structuredClone(query.longitude<-30?moonFixtures.new_york:query.longitude>100?moonFixtures.sydney:moonFixtures.berlin);
  reply.latitude=query.latitude;reply.longitude=query.longitude;
  if(mode==='defer')await new Promise(resolve=>moonPending.push(resolve));
  if(mode==='failure')throw Error('synthetic_moon_unavailable');
  if(mode==='invalid')reply.illumination_percent=NaN;
  if(moonTransport.phase)reply.phase=moonTransport.phase;
  return reply;
 }`)});
 await new Promise(r=>f.server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})}),results=[];
 try{
  for(const [name,width,height,touch] of [['desktop',1448,1086,false],['tablet',1024,768,true],['smartphone',393,851,true],['phone-landscape',851,393,true]]){
   const context=await browser.newContext({viewport:{width,height},hasTouch:touch,deviceScaleFactor:2}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));await page.clock.install();await f.route(page);
   await page.goto('http://127.0.0.1:'+f.server.address().port);
   await page.waitForFunction(()=>window.ready&&card._mapReady&&card.__proBranding?.eyeReady);
   await page.evaluate(async()=>{
    card._setMapDisplayMode('fullscreen',{persist:false});
    const revision=(await import('/frontend/version.js')).APPLICATION_RELEASE.runtimeRevision;
    window.moon=await import('/frontend/modules/weather/moon-legend.js?v='+revision);
    window.preferences=await import('/frontend/modules/weather/legend-preferences.js?v='+revision);
    preferences.saveLegendHub(card,{slots:['moon','wind','temperature','precipitation'],extraPositions:{...preferences.legendHubState(card).config.extraPositions,moon:{x:.12,y:.18}}});
    card._map.setView([52.52,13.405],8,{animate:false});
    moon.openMoon(card);
   });
   await page.waitForFunction(()=>card.__grMoon?.status.hidden===true);
   await page.locator('.gr-moon-hero').evaluate(async image=>{await image.decode();});
   await page.screenshot({path:path.join(out,name+'-moon.png')});
   if(captureOnly){results.push({name,captured:true});await context.close();continue;}
   assert.equal(await page.locator('.gr-moon-tile').count(),8);
   assert.equal(await page.locator('.gr-moon-tile[aria-current=true]').getAttribute('data-phase'),'full_moon');
   assert.equal(await page.locator('dialog.gr-moon-dialog,[aria-modal=true].gr-moon-dialog').count(),0);
   assert.match(await page.locator('.gr-moon-note').textContent(),/Europe\/Berlin/);
   if(name==='desktop'){
    for(const phase of ['new_moon','waxing_crescent','first_quarter','waxing_gibbous','full_moon','waning_gibbous','last_quarter','waning_crescent']){
     await page.evaluate(phase=>{moonTransport.phase=phase;card.__grMoon.update();},phase);
     await page.waitForFunction(phase=>card.__grMoon.status.hidden&&card.__grMoon.grid.querySelector('[aria-current=true]')?.dataset.phase===phase,phase);
     assert.equal(await page.locator('.gr-moon-hero').evaluate(async image=>{await image.decode();return image.naturalWidth;}),1254,'original-resolution hero '+phase);
    }
    await page.evaluate(()=>{delete moonTransport.phase;card.__grMoon.update();});await page.waitForFunction(()=>card.__grMoon.status.hidden);
   }
   const inside=()=>page.evaluate(()=>{const a=card.__grMoon.dialog.getBoundingClientRect(),b=card.shadow.getElementById('map').getBoundingClientRect();return a.left>=Math.max(0,b.left)-1&&a.top>=Math.max(0,b.top)-1&&a.right<=Math.min(innerWidth,b.right)+1&&a.bottom<=Math.min(innerHeight,b.bottom)+1;});
   assert(await inside(),'window inside map '+name);
   assert(await page.locator('.gr-moon-dialog').evaluate(n=>n.scrollWidth<=n.clientWidth+1),'no horizontal overflow '+name);
   await page.locator('.gr-moon-tile').last().scrollIntoViewIfNeeded();
   await page.screenshot({path:path.join(out,name+'-phases.png')});
   assert(await page.locator('.gr-moon-close').evaluate(n=>{const a=n.getBoundingClientRect(),b=n.closest('.gr-moon-dialog').getBoundingClientRect();return a.top>=b.top&&a.bottom<=b.bottom;}),'close remains inside scrolled window');
   await page.locator('.gr-moon-surface').evaluate(n=>n.scrollTop=0);
   // Invoke the actual scheduled refresh via the browser virtual clock.
   const timedCount=await page.evaluate(()=>moonRequests.length);
   // runFor preserves nested rAF/resize ordering; fastForward coalesces them.
   await page.clock.fastForward(60000);await page.clock.runFor(1000);
   await page.waitForFunction(n=>moonRequests.length>n,timedCount);
   await page.waitForFunction(()=>card.__grMoon.status.hidden);
   // Mouse pan on a free part of the map while the nonmodal window stays open.
   if(name==='desktop'){
    const old=await page.evaluate(()=>card._map.getCenter());
    await page.mouse.move(width-120,160);await page.mouse.down();await page.mouse.move(width-210,220,{steps:8});await page.mouse.up();
    await page.waitForFunction(old=>{const c=card._map.getCenter();return c.lat!==old.lat||c.lng!==old.lng;},old);
    await page.waitForTimeout(450);
   }else if(touch){
    const point=await page.evaluate(()=>{const map=card.shadow.getElementById('map'),r=map.getBoundingClientRect(),d=card.__grMoon.dialog.getBoundingClientRect();for(const y of [r.bottom-20,r.top+70,r.top+r.height*.5])for(const x of [r.left+90,r.right-30,r.left+r.width*.5]){if(x-60<=r.left)continue;let valid=true;for(let i=0;i<=6;i++){const px=x-i*10,n=card.shadow.elementFromPoint(px,y);if(px>=d.left&&px<=d.right&&y>=d.top&&y<=d.bottom||!map.contains(n)||n?.closest('button,a,input,.leaflet-control,.weather-display-panel'))valid=false;}if(valid)return {x,y};}return null;});assert(point,'real free map trajectory');const session=await context.newCDPSession(page),{x,y}=point;
    const old=await page.evaluate(()=>card._map.getCenter());
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
    for(let i=1;i<=6;i++)await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*10,y}]});
    await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach();
    await page.waitForFunction(old=>{const c=card._map.getCenter();return c.lat!==old.lat||c.lng!==old.lng;},old);await page.waitForFunction(()=>!card._map._panAnim?._inProgress);await page.waitForTimeout(100);
   }
   const modes=await page.evaluate(()=>({wind:card._weatherWindState().config.visible,temp:card._weatherTemperatureState().config.visible,radar:card._weatherRadarState().enabled}));
   // Real pointer-captured header drag, then pointer cancellation and viewport resize.
   const head=await page.locator('.gr-moon-header').boundingBox(),before=await page.evaluate(()=>({center:card._map.getCenter(),zoom:card._map.getZoom()}));
   await page.mouse.move(head.x+head.width*.45,head.y+head.height*.5);await page.mouse.down();await page.mouse.move(width-2,height-2,{steps:12});await page.mouse.up();
   assert(await inside(),'drag clamped '+name);let mapDrift=await assertMapFixed(page,before,'window drag does not pan map');
   const saved=await page.evaluate(()=>preferences.legendHubState(card).config.extraPositions.moon);
   assert(saved.x>=0&&saved.x<=1&&saved.y>=0&&saved.y<=1);
   // ResizeObserver delivery occurs outside the virtual clock. Let its rAF
   // measurement settle under real browser scheduling before the next gesture.
   const settleResize=async label=>{for(let i=0;i<20;i++){await page.waitForTimeout(50);await page.clock.runFor(100);if(await inside())return;}assert.fail(label+' '+JSON.stringify(await page.evaluate(()=>({dialog:card.__grMoon.dialog.getBoundingClientRect().toJSON(),map:card.shadow.getElementById('map').getBoundingClientRect().toJSON(),scale:card.__grMoon.scale,naturalHeight:card.__grMoon.naturalHeight}))));};
   await page.setViewportSize({width:height,height:width});await page.waitForTimeout(100);await page.clock.runFor(1000);await settleResize('orientation/resize remains bounded');
   await page.setViewportSize({width,height});await page.waitForTimeout(100);await page.clock.runFor(1000);await settleResize('restored viewport remains bounded');
   assert.deepEqual(await page.evaluate(()=>card.__legendHub.config.extraPositions.moon),saved,'temporary resize preserves stored position');
   if(touch){
    const touchHead=await page.locator('.gr-moon-header').boundingBox(),session=await context.newCDPSession(page);
    const x=touchHead.x+touchHead.width*.45,y=touchHead.y+touchHead.height*.5,old=await page.evaluate(()=>({center:card._map.getCenter(),zoom:card._map.getZoom()}));
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
    await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:Math.max(15,x-65),y:Math.max(15,y-45)}]});
    await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach();
    assert(await inside(),'real touch drag stays bounded');mapDrift=Math.max(mapDrift,await assertMapFixed(page,old,'touch window drag does not move map'));
   }
   // Cancellation exercises the same capture cleanup path.
   await page.locator('.gr-moon-header').dispatchEvent('pointerdown',{pointerId:31,pointerType:'touch',isPrimary:true,button:0,clientX:head.x+20,clientY:head.y+20});
   await page.locator('.gr-moon-header').dispatchEvent('pointercancel',{pointerId:31,pointerType:'touch',isPrimary:true,button:0});
   await page.evaluate(()=>card._map.setView([40.7128,-74.006],8,{animate:false}));
   await page.waitForFunction(()=>card.__grMoon.note.textContent.includes('America/New_York')&&card.__grMoon.status.hidden);
   // Two outstanding replies, resolved backwards: old data cannot win.
   await page.evaluate(()=>{moonTransport.mode='defer';card._map.setView([-33.87,151.21],8,{animate:false});});
   await page.waitForFunction(()=>moonPending.length===1);
   await page.evaluate(()=>card._map.setView([52.52,13.405],8,{animate:false}));await page.waitForFunction(()=>moonPending.length===2);
   await page.evaluate(()=>moonPending.pop()());await page.waitForFunction(()=>card.__grMoon.note.textContent.includes('Europe/Berlin')&&card.__grMoon.status.hidden);
   await page.evaluate(()=>moonPending.pop()());await page.waitForTimeout(150);
   assert.match(await page.locator('.gr-moon-note').textContent(),/Europe\/Berlin/);
   await page.evaluate(()=>{moonTransport.mode='ready';card._map.setZoom(4,{animate:false});});
   await page.waitForFunction(()=>card.__grMoon.status.dataset.zoom==='true');
   const zoomRequests=await page.evaluate(()=>moonRequests.length);await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>moonRequests.length),zoomRequests,'no request below zoom threshold');
   await page.screenshot({path:path.join(out,name+'-zoom.png')});
   await page.evaluate(()=>{moonTransport.mode='failure';card._map.setZoom(8,{animate:false});});
   await page.waitForFunction(()=>card.__grMoon.status.textContent.includes('nicht verfügbar'));
   await page.evaluate(()=>{moonTransport.mode='invalid';card.__grMoon.update();});
   await page.waitForFunction(()=>!card.__grMoon.status.hidden&&card.__grMoon.status.textContent.includes('nicht verfügbar'));
   assert.equal(await page.locator('.gr-moon-details').getByText('NaN').count(),0);
   await page.evaluate(()=>{moonTransport.mode='ready';card.__grMoon.update();});await page.waitForFunction(()=>card.__grMoon.status.hidden);
   await page.evaluate(()=>{moonTransport.mode='defer';card.__grMoon.update();});await page.waitForFunction(()=>moonPending.length===1);
   await page.clock.fastForward(15001);await page.waitForFunction(()=>!card.__grMoon.status.hidden&&card.__grMoon.status.textContent.includes('nicht verfügbar'));
   await page.evaluate(()=>moonPending.pop()());await page.waitForTimeout(50);
   assert(await page.locator('.gr-moon-status').isVisible(),'late reply after timeout stays unavailable');
   await page.evaluate(()=>{moonTransport.mode='ready';card.__grMoon.update();});await page.waitForFunction(()=>card.__grMoon.status.hidden);
   await page.emulateMedia({reducedMotion:'reduce'});
   assert.equal(await page.locator('.gr-moon-dialog').evaluate(n=>getComputedStyle(n).animationName),'none');
   const savedAfterTouch=await page.evaluate(()=>card.__legendHub.config.extraPositions.moon);
   await page.reload();await page.waitForFunction(()=>window.ready&&card._mapReady&&card.__grMoon?.open);
   assert.deepEqual(await page.evaluate(()=>card.__legendHub.config.extraPositions.moon),savedAfterTouch,'reload position');
   await page.evaluate(()=>{moonTransport.mode='defer';card.__grMoon.update();});await page.waitForFunction(()=>moonPending.length===1);
   await page.locator('.gr-moon-close').click();await page.evaluate(()=>moonPending.pop()());
   const closedCount=await page.evaluate(()=>moonRequests.length);
   await page.evaluate(()=>{card._map.panBy([80,30],{animate:false});card._map.setZoom(9,{animate:false});});await page.waitForTimeout(450);await page.clock.fastForward(61000);
   assert.equal(await page.evaluate(()=>moonRequests.length),closedCount,'closed window makes no requests');
   assert.equal(await page.locator('.gr-moon-dialog').count(),0);
   assert.equal(await page.locator('.gr-moon-window').count(),0,'scaled host is removed with the window');
   assert.equal(await page.evaluate(()=>card.__legendHub.config.legends.moon.mode),'off');
   assert.deepEqual(await page.evaluate(()=>({wind:card._weatherWindState().config.visible,temp:card._weatherTemperatureState().config.visible,radar:card._weatherRadarState().enabled})),modes);
   assert.deepEqual(errors,[]);
   results.push({name,phases:8,allHiResPhases:name==='desktop',nonmodal:true,dragBounds:true,viewportReflow:true,mapStableDuringDrag:true,mapDriftCssPx:mapDrift,realTouchDrag:touch,touchCancel:true,timerRefresh:true,realMapPan:true,locationTimezone:true,staleRepliesRejected:true,zoomGate:true,failureAndInvalidData:true,requestTimeout:true,reload:true,closeCleanup:true,weatherIsolation:true});
   await context.close();
  }
 }finally{await browser.close();f.server.closeAllConnections();await new Promise(r=>f.server.close(r));}
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2)+'\n');console.log('PASS Moon browser: '+JSON.stringify(results));
})().catch(error=>{console.error(error);process.exitCode=1;});

/* One touch viewport with the real card, Leaflet and Eye gesture handlers. */
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {fixture}=require('./wind-perf-browser-fixture.cjs');

async function run(){
 const router=fixture({extendHtml:html=>html
  .replace('window.routerReady=true','window.routerReady=localStorage.getItem("fixture-standard")!=="1"')
  .replace("states:{'switch.gewitterradar_language_initialized'","states:{'switch.gewitterradar_map_grouping':{state:'on'},'switch.gewitterradar_warning_animation':{state:'on'},'switch.gewitterradar_language_initialized'")});
 await new Promise(resolve=>router.server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
  const context=await browser.newContext({viewport:{width:393,height:851},hasTouch:true,isMobile:true,deviceScaleFactor:2});
  const page=await context.newPage(),errors=[];
  page.setDefaultTimeout(4000);
  page.on('pageerror',error=>errors.push(error.message));
  await router.route(page);
  const loaded=()=>page.waitForFunction(()=>window.card?._mapReady&&card.__weatherDisplayState?.discovery);
  await page.goto('http://127.0.0.1:'+router.server.address().port);
  await loaded();
  assert(await page.evaluate(()=>card._weatherStormAvailable()));
  await page.evaluate(()=>card._eyeHubOpen());
  const config=page.locator('#eye-hub-config');
  assert.equal(await config.locator('header h2').textContent(),'Eye Menü');
  const roundClose=await config.locator('header [data-premium-action=close] img').getAttribute('src');
  assert.match(roundClose,/^data:image\/webp;base64,/);
  await config.locator('[data-eye-action=plus]').tap();
  assert.equal(await config.locator('[data-eye-slot="4"] select').count(),0);
  await config.locator('[data-eye-assign="4"]').tap();
  await config.locator('[data-eye-pick=storm]').tap();
  assert.deepEqual(await page.evaluate(()=>card._eyeHubState().config.slots.map(slot=>slot.functionId)),['wind','temperature','precipitation','weather-display','storm']);
  assert.equal(await config.locator('[data-eye-slot-aura]').count(),5);
  const windAura=config.locator('[data-eye-slot-aura=wind]'),stormAura=config.locator('[data-eye-slot-aura=storm]');
  assert.equal(await windAura.inputValue(),'on');
  assert.equal(await stormAura.inputValue(),'off');
  await config.locator('[data-eye-key=grouped]').check();
  const stormRing=config.locator('[data-preview=closed] [data-ring-slot="5"]');
  assert.equal(await stormRing.count(),0);
  await stormAura.selectOption('on');
  assert.equal(await stormRing.count(),1);
  await stormAura.selectOption('off');
  assert.equal(await stormRing.count(),0);
  assert.equal(await windAura.inputValue(),'on');
  assert(await config.locator('[data-eye-slot="4"]').evaluate(row=>row.scrollWidth<=row.clientWidth+1));
  await config.locator('[data-eye-color=wind]').tap();
  await config.locator('[data-eye-bubble-aura]').uncheck();
  await config.locator('[data-eye-dismiss]').tap();
  assert.equal(await windAura.inputValue(),'off');
  assert.deepEqual(await page.evaluate(()=>[card._eyeHubState().config.bubbleAura.wind,card._eyeHubState().config.bubbleAura.storm]),[false,false]);
  await config.locator('header [data-premium-action=close]').tap();
  if(process.env.GR_STORM_VIEW!=='standard')await page.evaluate(()=>card._setMapDisplayMode('fullscreen',{persist:false}));
  const eye=page.locator('#weather-display-eye-control'),bubble=page.locator('#eye-hub-bubbles [data-function=storm]');
  const panel=page.locator('#weather-storm-panel');
  const state=()=>page.evaluate(()=>({
   display:card._weatherStormVisible(),
   grouped:card._hass.states[card._mapGroupingEntity()]?.state,
   animation:card._hass.states[card._animationEntity()]?.state,
   resolution:card._clusterResolutionProfileV40822,
   timeout:card._statusClusterBrowseTimeoutMs,
   plots:[card._individualStrikeLayer,card._markerLayer,card._stormCircle,card._dangerCircle].map(layer=>card._map.hasLayer(layer)),
   observation:card._map.hasLayer(card._radiusCircle),
   aura:card._eyeHubState().config.bubbleAura
  }));
  await eye.tap();
  await bubble.waitFor();
  assert.equal(await bubble.getAttribute('data-active'),'false');
  assert.equal(await bubble.locator('img').evaluate(async icon=>{await icon.decode();return icon.naturalWidth;}),1254);
  const original=await state();
  assert(original.grouped==='on'&&original.animation==='on');
  await bubble.tap();
  await page.waitForFunction(()=>!card._weatherStormVisible());
  const off=await state();
  assert.deepEqual(off,{...original,display:false,plots:[false,false,false,false]});
  const warning=await page.evaluate(()=>{
   const lastFlash=card._lastFlashAt,home=card._home(),id='geo_location.lightning_strike_storm_bubble_test';
   const originalPulse=card._pulseDangerCount;
   let alerts=0;
   card._pulseDangerCount=function(){alerts++;originalPulse.call(this);};
   try{
    card._ingestStrikes({states:{...card._hass.states,[id]:{attributes:{latitude:home.lat,longitude:home.lon}}}});
    card._renderMapMarkers();
    return {alerts,recorded:card._strikes.has(id),visualFlash:card._lastFlashAt!==lastFlash};
   }finally{card._pulseDangerCount=originalPulse;}
  });
  assert.deepEqual(warning,{alerts:1,recorded:true,visualFlash:false});
  assert.deepEqual(await state(),off);
  await eye.tap();
  const cdp=await context.newCDPSession(page);
  const box=await bubble.boundingBox();
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2}]});
  await panel.waitFor({timeout:2500});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await panel.locator('details').count(),5);
  assert.equal(await panel.locator('[data-premium-action=close] img').getAttribute('src'),roundClose);
  assert(await panel.evaluate(node=>node.scrollHeight>=node.clientHeight&&node.scrollWidth<=node.clientWidth+1));
  await panel.locator('[data-storm-setting=aura]').check();
  assert.equal((await state()).aura.storm,true);
  assert.equal((await state()).aura.wind,false);
  await panel.locator('[data-storm-setting=visible]').check();
  assert.deepEqual((await state()).plots,[true,true,true,true]);
  await panel.locator('[data-premium-action=close]').tap();
  await panel.waitFor({state:'hidden'});
  await eye.tap();
  assert.equal(await bubble.getAttribute('data-active'),'true');
  // Work with the visible map clip without Playwright scrolling the map itself.
  await page.waitForTimeout(200);
  const next=page.locator('#eye-hub-bubbles [data-eye-page="1"]');
  if(!await bubble.isVisible()&&await next.isVisible())await next.tap();
  const target=await bubble.boundingBox();
  assert(target,'Storm bubble must be reachable through the existing pager');
  await page.touchscreen.tap(target.x+target.width/2,target.y+target.height/2);
  await page.waitForFunction(()=>!card._weatherStormVisible());
  await page.reload();
  await loaded();
  await page.waitForFunction(()=>!card._weatherStormVisible());
  const restored=await state();
  assert.deepEqual(restored,{...off,aura:{...off.aura,storm:true}});
  await page.evaluate(()=>card._eyeHubOpen());
  assert.equal(await stormAura.inputValue(),'on');
  assert.equal(await windAura.inputValue(),'off');
  await page.evaluate(()=>localStorage.setItem('fixture-standard','1'));
  await page.reload();
  await loaded();
  assert.equal(await page.evaluate(()=>card._weatherStormAvailable()),false);
  assert.deepEqual((await state()).plots,[true,true,true,true]);
  assert(await page.evaluate(()=>card._weatherStormVisible()));
  await page.evaluate(()=>card._eyeHubOpen());
  assert.equal(await config.locator('[data-eye-function=storm]').count(),0);
  assert.equal(await stormAura.count(),0);
  assert.equal(await page.evaluate(()=>card._eyeHubState().config.slots[4].functionId),'storm');
  assert.deepEqual(errors,[]);
  console.log('PASS mobile Chromium: assignment, native hold, original close icon, layer-only toggle, existing preferences, separate auras, reload, Standard');
 }finally{
  if(browser)await browser.close();
  router.server.close();
 }
}
run().catch(error=>{console.error(error);process.exitCode=1;});

/* Actual complete GR card, shared pointer drag and synthetic authorized WR I/O. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {fixture}=require('./wind-perf-browser-fixture.cjs');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const out=process.env.GR_WIND_QUICK_OUTPUT||path.join(os.tmpdir(),'gr-wind-quick01-browser');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const f=fixture();await new Promise(r=>f.server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})}),results=[];
 try{for(const [name,width,height,touch] of [['desktop',1280,850,false],['android-portrait',393,851,true],['android-landscape',851,393,true],['ipad-portrait',820,1180,true],['ipad-landscape',1180,820,true]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:3}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await f.route(page);
  try{
   await page.goto('http://127.0.0.1:'+f.server.address().port);await page.waitForFunction(()=>window.ready&&card._map&&card._weatherLayerMenuState().catalog?.status==='ready');
   assert(await page.evaluate(()=>registry.ok));assert.equal(await page.evaluate(()=>registry.loadedCount),35);
   await page.evaluate(()=>{card._setMapDisplayMode('fullscreen',{persist:false});card._map.setView([48,8],6,{animate:false});});await page.waitForTimeout(200);
   const press=loc=>touch?loc.tap():loc.click(),toggle=page.locator('#weather-wind-toggle'),wind=page.locator('#weather-wind-panel');
   await toggle.waitFor({state:'visible'});assert.equal(await toggle.getAttribute('aria-pressed'),'false');assert.equal(await page.evaluate(()=>windRequests.length),0);
   await toggle.locator('img').evaluate(i=>i.decode());assert.match(await toggle.locator('img').getAttribute('src'),/gr-wind-animation-toggle-premium-v1-136.webp/);
   const placement=await toggle.evaluate(e=>{const a=e.getBoundingClientRect(),m=card.shadow.getElementById('map').getBoundingClientRect();return {width:a.width,height:a.height,x:a.left-m.left,y:a.top-m.top,within:a.left>=m.left&&a.top>=m.top&&a.right<=m.right&&a.bottom<=m.bottom,overlaps:[...card.shadow.querySelectorAll('.leaflet-control,#weather-display-eye-control,#map-location-overlay')].filter(n=>{const b=n.getBoundingClientRect();return b.width&&b.height&&a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;}).map(n=>n.id||n.className)};});assert(placement.width>=44&&placement.height>=44&&placement.within);assert.deepEqual(placement.overlaps,[]);assert(placement.x<270&&placement.y<220,JSON.stringify(placement));
   await press(toggle);await page.waitForFunction(()=>card._weatherWindState().points.length>0);assert.equal(await toggle.getAttribute('aria-pressed'),'true');await press(toggle);
   // Same retained renderer and L2 field across all three restored modes.
   for(const mode of ['barbs','arrows','animated']){
    await page.evaluate(mode=>card._weatherWindSet({visible:true,enabled:true,mode,animationExplicit:true,color:'turquoise',tempo:'fast',density:'normal',paused:mode==='animated',colorField:true,fieldOpacity:55,unit:'kn'}),mode);
    await page.waitForFunction(()=>card._weatherWindState().field&&card._weatherWindState().painter.fieldImage&&!card._weatherWindState().batch);await page.waitForTimeout(100);
    const before=await page.evaluate(()=>{const s=card._weatherWindState();window.quickPainter=s.painter;window.quickImage=s.painter.fieldImage;window.quickField=s.field;return {config:{...s.config},requests:windRequests.length};});
    await press(toggle);await page.waitForTimeout(100);assert.equal(await toggle.getAttribute('aria-pressed'),'false');
    assert(await page.evaluate(()=>{const s=card._weatherWindState();return s.painter===quickPainter&&s.painter.fieldImage===quickImage&&s.field===quickField&&s.painter.frame===null&&s.painter.canvas.hidden;}));
    const stopped=await page.evaluate(()=>card._weatherWindState().painter.draws);await page.evaluate(()=>card._map.panBy([4,0],{animate:false}));await page.waitForTimeout(180);assert.equal(await page.evaluate(()=>card._weatherWindState().painter.draws),stopped,'no hidden animation or render work');assert.equal(await page.evaluate(()=>windRequests.length),before.requests);
    const off=await page.evaluate(()=>card._weatherWindState().config);assert.deepEqual({...off,visible:true},before.config);
    await press(toggle);await page.waitForTimeout(200);assert.equal(await toggle.getAttribute('aria-pressed'),'true');assert.equal(await page.evaluate(()=>windRequests.length),before.requests,'toggle reuses valid 130 percent field without another request');
    assert(await page.evaluate(()=>card._weatherWindState().painter===quickPainter&&card._weatherWindState().painter.fieldImage===quickImage));
    if(mode==='animated')assert.equal(await page.evaluate(()=>card._weatherWindState().painter.frame),null,'saved pause remains effective');
    assert(await page.locator('.weather-wind-canvas').evaluate(c=>c.getContext('2d').getImageData(c.width/2,c.height/2,1,1).data[3]>0),'saved independent colour field is visible');
   }
   await page.evaluate(()=>card._weatherWindSet({paused:false}));await page.waitForFunction(()=>card._weatherWindState().metrics?.moving&&card._weatherWindState().metrics?.segments>0);
   // Actual menu gear and wind barb use the same global state and same panel.
   await press(page.locator('#map-display-menu-toggle'));await press(page.locator('[data-weather-layer-entry]'));
   const tile=page.locator('.weather-layer-wind-tile'),barb=tile.locator('[data-weather-layer-action=wind-toggle]'),gear=tile.locator('[data-weather-layer-action=wind-settings]');
   await tile.waitFor({state:'visible'});assert.equal(await barb.getAttribute('aria-pressed'),'true');assert.match(await barb.locator('img').getAttribute('src'),/gr-wind-barb-premium-v2-136.webp/);assert.match(await gear.locator('img').getAttribute('src'),/gr-wind-settings-premium-v2-136.webp/);
   for(const image of [barb.locator('img'),gear.locator('img')])await image.evaluate(i=>i.decode());
   await press(barb);assert.equal(await toggle.getAttribute('aria-pressed'),'false');await press(gear);await wind.waitFor({state:'visible'});assert.equal(await wind.locator('[data-wind-setting=visible]').isChecked(),false);await wind.locator('[data-wind-setting=visible]').check();assert.equal(await toggle.getAttribute('aria-pressed'),'true');
   assert.equal(await wind.locator('[data-wind-setting=tempo]').inputValue(),'fast');assert.equal(await wind.locator('[data-wind-setting=fieldOpacity]').inputValue(),'55');await press(wind.locator('[data-wind-action=close]'));await page.evaluate(()=>card._setMapDisplayMenuOpen(false));
   // A real pointer/touch drag must not synthesize an on/off operation.
   const rect=await toggle.boundingBox(),pressed=await toggle.getAttribute('aria-pressed'),x=rect.x+rect.width/2,y=rect.y+rect.height/2,dx=Math.min(120,width-x-45),dy=100;
   if(touch){const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=5;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/5,y:y+dy*i/5}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}
   else{await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+dx,y+dy,{steps:6});await page.mouse.up();}
   await page.waitForTimeout(500);assert.equal(await toggle.getAttribute('aria-pressed'),pressed);assert.equal(await page.evaluate(()=>Object.keys(card._weatherWindState().config.quickPositions).length),1);
   const savedPosition=await toggle.boundingBox();assert(Math.abs(savedPosition.y-rect.y)>60);await page.screenshot({path:path.join(out,name+'-map-toggle.png')});
   // Keyboard and premium menu state remain connected, including reload/orientation.
   if(!touch){await page.keyboard.press('Tab');await toggle.focus();assert(await toggle.evaluate(e=>e.matches(':focus-visible')));assert((await toggle.evaluate(e=>parseFloat(getComputedStyle(e).outlineWidth)))>=2);await page.keyboard.press('Space');assert.equal(await toggle.getAttribute('aria-pressed'),'false');await page.keyboard.press('Enter');assert.equal(await toggle.getAttribute('aria-pressed'),'true');}
   await page.evaluate(()=>card._weatherWindSet({visible:false,paused:true}));const saved=await page.evaluate(()=>card._weatherWindState().config);await page.reload();await page.waitForFunction(()=>window.ready&&card._map);assert.deepEqual(await page.evaluate(()=>card._weatherWindState().config),saved);assert.equal(await page.evaluate(()=>windRequests.length),0,'off preference prevents startup requests');
   await page.evaluate(()=>card._setMapDisplayMode('fullscreen',{persist:false}));await page.waitForTimeout(160);const restored=await toggle.boundingBox();assert(Math.abs(restored.x-savedPosition.x)<3&&Math.abs(restored.y-savedPosition.y)<3,'position restored in the same display mode');
   await page.setViewportSize({width:height,height:width});await page.waitForTimeout(250);assert(await toggle.evaluate(e=>{const r=e.getBoundingClientRect(),m=card.shadow.getElementById('map').getBoundingClientRect();return r.left>=m.left&&r.top>=m.top&&r.right<=m.right+1&&r.bottom<=m.bottom+1;}));await page.setViewportSize({width,height});await page.waitForTimeout(200);assert(Math.abs((await toggle.boundingBox()).x-savedPosition.x)<3);
   if(name==='desktop'){
    // Toggle while a transport is pending; a returned authorized field is cached,
    // then reused after the user's on/off/on without duplicate requests.
    await page.evaluate(()=>{windTransport.mode='defer';card._weatherWindSet({visible:true});});await page.waitForFunction(()=>windPending.length===1);await press(toggle);await press(toggle);await page.evaluate(()=>windPending.splice(0).forEach(r=>r()));await page.waitForFunction(()=>card._weatherWindState().field&&!card._weatherWindState().batch);assert.equal(await page.evaluate(()=>windRequests.length),1);
    await press(toggle);await page.evaluate(()=>{const s=card._weatherWindState();s.field.deadline=Date.now()-1;s.cache.prune();windTransport.mode='unavailable';});await press(toggle);await page.waitForFunction(()=>!card._weatherWindState().batch&&card._weatherWindState().fieldError);assert.equal(await toggle.getAttribute('aria-pressed'),'true','user intent survives unavailable data');assert.equal(await page.evaluate(()=>card._weatherWindState().field),null);assert.match(await page.evaluate(()=>card._weatherWindState().status),/Keine|Punkt/);
   }
   assert.deepEqual(errors,[]);results.push({name,status:'passed',physicalCompanionAcceptance:false});console.log(name+': original artwork, visibility/preferences, shared drag, cache, pause and synchronized menus passed');
  }catch(error){await page.screenshot({path:path.join(out,name+'-failure.png')});throw error;}finally{await context.close();}
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));
 }finally{await browser.close();f.server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

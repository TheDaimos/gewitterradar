const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),{temperatureFixture}=require('./temperature-browser-fixture.cjs');
const data={...require('../tests/fixtures/moon-ephemerides.json').berlin,distance_km:384388};
const out=process.env.GR_MOON_SCALE_EVIDENCE||'.task4133/evidence';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const f=temperatureFixture({decorate:h=>h.replace('window.cleanSource=weatherSourceText;',`window.cleanSource=weatherSourceText;window.moonFixture=${JSON.stringify(data)};`).replace('requests.push(structuredClone(query));',`requests.push(structuredClone(query));if(query.type==='weather_router/consumer/moon')return {...moonFixture,latitude:query.latitude,longitude:query.longitude};`)});
 await new Promise(r=>f.server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})}),results=[];
 try{for(const [name,width,height] of [['desktop',1366,768],['phone',390,844]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:name==='phone'}),p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await f.route(p);
  const open=async()=>{await p.goto('http://127.0.0.1:'+f.server.address().port);await p.waitForFunction(()=>window.ready&&card._mapReady);await p.evaluate(async()=>{card._setMapDisplayMode('fullscreen',{persist:false});const rev=(await import('/frontend/version.js')).APPLICATION_RELEASE.runtimeRevision;window.moon=await import('/frontend/modules/weather/moon-legend.js?v='+rev);window.prefs=await import('/frontend/modules/weather/legend-preferences.js?v='+rev);window.views=await import('/frontend/modules/weather/legend-hub-view.js?v='+rev);card._map.setView([52.52,13.405],8,{animate:false});moon.openMoon(card);});await p.waitForFunction(()=>card.__grMoon?.status.hidden);};
  await open();assert.equal(await p.evaluate(()=>card.__legendHub.config.moonUi.scaleIcon),'ruler');
  await p.evaluate(()=>views.openMoonConfig(card));
  for(const id of ['expand','moon','ruler']){await p.locator('.lh-moon-icons label').filter({has:p.locator('input[value="'+id+'"]')}).click();await p.waitForFunction(id=>card.__grMoon.scaleImage.src.includes('_'+id+'_256.png'),id);}
  await p.locator('.lh-moon-icons label').filter({has:p.locator('input[value="moon"]')}).click();await p.locator('[data-lh-close]').click();
  const original=await p.evaluate(()=>({position:{...card.__legendHub.config.extraPositions.moon},expanded:card.__legendHub.config.moonUi.phasesExpanded}));
  const trigger=p.locator('[data-moon-size]');await trigger.locator('img').click();
  assert.deepEqual(await p.locator('.gr-moon-size-menu button').evaluateAll(items=>items.map(i=>i.dataset.value)),['auto','130','120','110','100','90','80','70','60','50']);
  await p.locator('.gr-moon-size-menu [data-value="70"]').click();assert.equal(await p.evaluate(()=>card.__legendHub.config.moonUi.scalePercent),70);
  await trigger.locator('span').click();await p.locator('.gr-moon-size-menu [data-value="130"]').click();
  assert.equal(await p.evaluate(()=>card.__legendHub.config.moonUi.scalePercent),130);
  assert(await p.evaluate(()=>card.__grMoon.host.offsetWidth<=card.shadow.getElementById('map').offsetWidth));
  await trigger.focus();await p.keyboard.press('ArrowDown');await p.keyboard.press('Home');await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>card.__legendHub.config.moonUi.scaleMode),'auto');
  await trigger.click();await p.keyboard.press('Escape');assert.equal(await trigger.getAttribute('aria-expanded'),'false');assert(await p.evaluate(()=>!!card.__grMoon));
  await trigger.click();await p.locator('.gr-moon-size-menu [data-value="80"]').click();
  assert.deepEqual(await p.evaluate(()=>({position:{...card.__legendHub.config.extraPositions.moon},expanded:card.__legendHub.config.moonUi.phasesExpanded})),original);
  await open();assert.equal(await p.evaluate(()=>card.__legendHub.config.moonUi.scaleIcon),'moon');assert.equal(await p.evaluate(()=>card.__legendHub.config.moonUi.scalePercent),80);assert.equal(await p.evaluate(()=>card.__legendHub.config.moonUi.scaleMode),'manual');
  await p.screenshot({path:path.join(out,name+'.png')});await p.locator('[data-moon-size]').click();
  const box=await p.locator('.gr-moon-size-menu').boundingBox();assert(box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=height+1,JSON.stringify(box));
  await p.screenshot({path:path.join(out,name+'-dropdown.png')});await p.keyboard.press('Escape');
  assert.deepEqual(errors,[]);results.push({name,viewport:[width,height],iconChoices:3,storedIcon:'moon',storedPercent:80,keyboard:true,autoAndManual:true,positionAndPhasesPreserved:true,menuBounds:box,errors});await context.close();
 }}finally{await browser.close();f.server.closeAllConnections();await new Promise(r=>f.server.close(r));}
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2)+'\n');console.log('PASS desktop/phone: icon choices, Vault reload, presets, keyboard, Auto/manual, safe menu bounds, unchanged position/phases');
})().catch(e=>{console.error(e);process.exitCode=1;});

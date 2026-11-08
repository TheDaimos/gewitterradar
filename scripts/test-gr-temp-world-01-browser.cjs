/* Full registered card, native Leaflet, synthetic authenticated WR I/O. No device claims. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {temperatureFixture}=require('./temperature-browser-fixture.cjs');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const out=process.env.GR_TEMP_OUTPUT||path.join(os.tmpdir(),'gr-temp-world01-browser');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const f=temperatureFixture();await new Promise(r=>f.server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})}),results=[];
 try{for(const [name,width,height,touch] of [['desktop',1280,850,false],['android-portrait',393,851,true],['android-landscape',851,393,true],['ipad-portrait',820,1180,true],['ipad-landscape',1180,820,true]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:1}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await f.route(page);
  await page.goto('http://127.0.0.1:'+f.server.address().port);await page.waitForFunction(()=>window.ready&&card._map);assert(await page.evaluate(()=>registry.ok));assert.equal(await page.evaluate(()=>registry.loadedCount),36);
  await page.evaluate(()=>{card._setMapDisplayMode('fullscreen',{persist:false});card._map.setView([48,8],6,{animate:false});});
  // Fullscreen relocates floating controls asynchronously. Wait for that layout
  // before a touch gesture; tapping a moving control is correctly treated as drag.
  await page.waitForTimeout(250);
  const press=loc=>touch?loc.tap():loc.click();await press(page.locator('#weather-display-eye-control'));
  try{await page.waitForFunction(()=>!card.shadow.getElementById('weather-display-panel').hidden,{},{timeout:5000});}catch(error){await page.screenshot({path:path.join(out,name+'-menu-failure.png')});console.error('Eye/menu state: '+JSON.stringify(await page.evaluate(()=>{const s=card._weatherDisplayState();return {enabled:s.config.enabled,drag:!!s.eyeDrag,suppressedUntil:s.eyeSuppressClickUntil,now:performance.now(),mode:card._mapDisplayMode};})));throw error;}
  await page.locator('[data-weather-display-layer-select]').selectOption('temperature');
  await page.locator('#weather-temperature-panel').waitFor({state:'visible'});await press(page.locator('[data-temperature-action=close]'));
  await press(page.locator('#map-display-menu-toggle'));await press(page.locator('[data-weather-temperature-entry]'));await page.locator('#weather-temperature-panel').waitFor({state:'visible'});await press(page.locator('[data-temperature-action=close]'));
  await press(page.locator('#map-display-menu-toggle'));await press(page.locator('[data-weather-layer-entry]'));await press(page.locator('[data-weather-layer-action=category][data-category=weather]'));await press(page.locator('[data-weather-layer-action=subcategory][data-subcategory=temperature]'));await press(page.locator('[data-weather-layer-action=temperature-settings]'));

  const panel=page.locator('#weather-temperature-panel'),unit=panel.locator('[data-temperature-setting=unit]');await panel.waitFor({state:'visible'});assert.equal(await unit.inputValue(),'C');assert.match(await panel.textContent(),/Temperatureinheit/);assert.deepEqual(await unit.locator('option').allTextContents(),['Celsius (°C)','Fahrenheit (°F)','Kelvin (K)']);
  await panel.locator('[data-temperature-setting=visible]').check();await page.waitForFunction(()=>card._weatherTemperatureState().field&&card._weatherTemperatureState().metrics?.labels>0&&card._weatherTemperatureState().painter?.image);
  const original=await page.evaluate(()=>Array.from(card._weatherTemperatureState().field.grid.values)),id=await page.evaluate(()=>card._weatherTemperatureState().field.id),calls=await page.evaluate(()=>temperatureRequests.length);
  await page.evaluate(()=>card._weatherTemperatureInspect({lat:48,lng:8}));const popup=page.locator('#weather-temperature-point');await popup.waitFor({state:'visible'});assert.match(await popup.textContent(),/°C/);
  for(const u of ['F','K','C']){await unit.selectOption(u);await page.waitForTimeout(80);assert.equal(await page.evaluate(()=>temperatureRequests.length),calls,'unit change never fetches');assert.equal(await page.evaluate(()=>card._weatherTemperatureState().field.id),id);assert.deepEqual(await page.evaluate(()=>Array.from(card._weatherTemperatureState().field.grid.values)),original);const text=await popup.textContent();assert(text.includes(u==='K'?' K':'°'+u));assert(!text.includes('°K'));assert.match(await page.locator('#weather-temperature-legend-overlay').textContent(),u==='K'?/ K/:new RegExp('°'+u));}
  await unit.selectOption('K');assert.equal(await panel.locator('[data-temperature-setting=minC]').inputValue(),'233.15');
  await page.evaluate(()=>{card._languagePreview='English';card._applyStaticTranslations();});assert.match(await panel.textContent(),/Temperature unit/);assert.equal(await page.evaluate(()=>temperatureRequests.length),calls);
  if(name==='desktop'){
   const translations=await page.evaluate(async()=>{const {TEMPERATURE_UNIT_TRANSLATIONS:t}=await import('/frontend/modules/weather/temperature-units.js?v=411156r1');return Object.entries(t).map(([language,labels])=>{card._languagePreview=language;card._applyStaticTranslations();return {language,expected:labels[0],text:card.shadow.getElementById('weather-temperature-panel').textContent,options:[...card.shadow.querySelector('[data-temperature-setting=unit]').options].map(n=>n.textContent)};});});for(const row of translations){assert(row.text.includes(row.expected),row.language);assert.equal(row.options.length,3);assert(row.options[2].endsWith('(K)'));}
  }
  await page.evaluate(()=>{card._languagePreview='Deutsch';card._applyStaticTranslations();});
  await panel.locator('[data-temperature-setting=advection]').check();await page.waitForFunction(()=>card._weatherTemperatureState().metrics?.arrows>3);const a=await page.locator('.weather-temperature-canvas').nth(2).evaluate(e=>e.toDataURL());await page.waitForTimeout(180);assert.notEqual(await page.locator('.weather-temperature-canvas').nth(2).evaluate(e=>e.toDataURL()),a);const noFramesFetch=await page.evaluate(()=>temperatureRequests.length);await page.waitForTimeout(180);assert.equal(await page.evaluate(()=>temperatureRequests.length),noFramesFetch);
  await page.evaluate(()=>card._weatherTemperatureSet({paused:true}));await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>card._weatherTemperatureState().painter.frame),null);
  // Independent Wind field remains operational while temperature is active.
  await page.evaluate(()=>card._weatherWindSet({visible:true,enabled:true,mode:'animated',animationExplicit:true,colorField:false}));await page.waitForFunction(()=>card._weatherWindState().field&&card._weatherWindState().metrics?.segments>0);assert(await page.evaluate(()=>card._weatherTemperatureState().field.id));
  const fieldBefore=await page.evaluate(()=>card._weatherTemperatureState().field.id);await page.evaluate(()=>{temperatureTransport.mode='failure';card._weatherTemperatureQueue({force:true});});await page.waitForFunction(()=>card._weatherTemperatureState().error);assert.equal(await page.evaluate(()=>card._weatherTemperatureState().field.id),fieldBefore,'failed refresh keeps WR-authorized image');
  await page.evaluate(()=>{temperatureTransport.mode='ready';card._weatherTemperatureQueue({force:true});});await page.waitForFunction(()=>!card._weatherTemperatureState().error);await page.evaluate(()=>card._weatherTemperatureOpen());
  const bounds=await panel.evaluate(e=>({w:e.clientWidth,scroll:e.scrollWidth}));assert(bounds.scroll<=bounds.w+1,'no horizontal overflow');
  if(name==='desktop'){
   await page.evaluate(()=>card._map.setView([48,368],6,{animate:false}));await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>temperatureRequests.length),noFramesFetch+2,'world copy reuses the same cached field after the two explicit refreshes');
   await page.evaluate(()=>card._map.setView([48,8],6,{animate:false}));await page.waitForTimeout(350);
   await page.evaluate(()=>{temperatureTransport.mode='hole';card._weatherTemperatureQueue({force:true});});await page.waitForFunction(()=>card._weatherTemperatureState().field?.grid.valid_mask.some(n=>!n));await page.evaluate(()=>card._weatherTemperatureInspect({lat:48,lng:8}));assert(!await page.evaluate(()=>card._weatherTemperatureState().geoContext.available_capabilities.includes('weather.temperature.field_2m')),'NoData cannot invent an Inspector temperature');
   await page.evaluate(()=>{temperatureTransport.mode='no_advection';card._weatherTemperatureQueue({force:true});});await page.waitForFunction(()=>card._weatherTemperatureState().field?.advection.status==='unavailable');assert(await page.evaluate(()=>!!card._weatherTemperatureState().painter.image),'missing advection keeps scalar temperature');await page.evaluate(()=>{temperatureTransport.mode='ready';});
  }
  await page.screenshot({path:path.join(out,name+'.png')});
  await page.reload();await page.waitForFunction(()=>window.ready&&card._map);assert.equal(await page.evaluate(()=>card._weatherTemperatureState().config.unit),'K');assert.equal(await page.evaluate(()=>card._weatherTemperatureState().config.paused),true);assert.equal(await page.evaluate(()=>card._weatherTemperatureState().config.visible),true);
  await page.waitForFunction(()=>card._weatherTemperatureState().field);await page.evaluate(()=>{temperatureTransport.mode='denied';card._weatherTemperatureQueue({force:true});});await page.waitForFunction(()=>!card._weatherTemperatureState().field&&card._weatherTemperatureState().error);assert(await page.evaluate(()=>card._weatherWindState().field),'WR temperature denial does not clear Wind');
  await page.evaluate(()=>{card._weatherTemperatureSet({visible:false});card._teardownWeatherTemperature();});assert.equal(await page.locator('.weather-temperature-canvas').count(),0);assert.equal(await page.evaluate(()=>card._weatherTemperatureState().painter),null);
  assert.deepEqual(errors,[]);results.push({name,width,height,status:'passed',actualModules:36,syntheticIO:true,physicalDeviceAcceptance:false});console.log(name+': full card temperature C/F/K, GeoPoint, advection, Wind coexistence and lifecycle passed');await context.close();
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results},null,2));
 }finally{await browser.close();f.server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

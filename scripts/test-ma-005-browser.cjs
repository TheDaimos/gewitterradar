/* P00 smoke: actual registered card and Leaflet, synthetic HA/WR transport. */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {temperatureFixture}=require('./temperature-browser-fixture.cjs');
(async()=>{
 const f=temperatureFixture({decorate:html=>html.replace("const card=document.createElement('gewitterradar-card');","const card=document.createElement('gewitterradar-card');")});
 await new Promise(r=>f.server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[],maRequests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(/monitored[-_]areas/i.test(r.url()))maRequests.push(r.url())});
  await f.route(page);
  await page.goto('http://127.0.0.1:'+f.server.address().port);
  await page.waitForFunction(()=>window.ready&&card._mapReady&&card.__proBranding?.eyeReady);
  const initial=await page.evaluate(()=>({registry:window.registry,flag:card._config.monitored_areas_enabled,requests:requests.length}));
  assert.equal(initial.flag,undefined);assert.equal(initial.registry.ok,true);assert.equal(initial.registry.loadedCount,37);
  await page.evaluate(()=>{card._setMapDisplayMode('fullscreen',{persist:false});card._eyeHubOpen();});
  await page.locator('#eye-hub-config').waitFor({state:'visible'});
  await page.locator('#eye-hub-config [data-premium-action=close]').click();
  await page.locator('#legend-hub-control').waitFor({state:'visible'});
  await page.locator('#legend-hub-control').click();
  await page.locator('#legend-hub-popout').waitFor({state:'visible'});
  await page.locator('#legend-hub-control').click();
  await page.evaluate(()=>card._setMapDisplayMode('standard',{persist:false}));
  // No location helper in this fixture: the legacy protection must disable the control.
  const location=page.locator('#location-main-button');
  assert.equal(await location.count(),1);
  assert.equal(await location.isDisabled(),true,'missing location helper must keep legacy control disabled');
  assert.equal(await page.locator('#v407-location-search-backdrop').count(),0);
  console.log('PASS P00: legacy location guard with missing helper (configured search remains DEV smoke)');
  const result=await page.evaluate(()=>({maNodes:[...card.shadow.querySelectorAll('*')].filter(n=>/monitored[-_]areas/i.test(n.id+' '+(typeof n.className==='string'?n.className:''))).length,maWS:requests.filter(q=>/monitored[-_]areas/i.test(JSON.stringify(q))),wr:requests.some(q=>q.type==='weather_router/consumer/discovery'),maStorage:Object.keys(localStorage).filter(k=>/monitored[-_]areas/i.test(k))}));
  assert.equal(result.maNodes,0);assert.deepEqual(result.maWS,[]);assert.deepEqual(result.maStorage,[]);assert.equal(result.wr,true);assert.deepEqual(maRequests,[]);assert.deepEqual(errors,[]);
  console.log('PASS P00: actual card boot, 37 mandatory registrations, map, Eye Hub, Legend Hub, missing-helper location guard, WR discovery; no MA import/DOM/WS/storage');
 }finally{await browser.close();f.server.closeAllConnections();await new Promise(r=>f.server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});

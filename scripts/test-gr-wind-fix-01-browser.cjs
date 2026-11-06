/* Actual registered GR card, actual skeleton/menus/Leaflet; only HA/provider I/O is synthetic. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.GR_WIND_OUTPUT||path.join(os.tmpdir(),'gr-wind-fix01-browser');fs.mkdirSync(out,{recursive:true});
const leaflet=process.env.LEAFLET_JS||require.resolve('leaflet/dist/leaflet.js'),leafletCss=process.env.LEAFLET_CSS||require.resolve('leaflet/dist/leaflet.css');
const html=String.raw`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#121b24"><script src="/leaflet.js"></script><script type="module">
import '/frontend/gewitterradar.js';
import {EXPECTED_MODULES} from '/frontend/module-manifest.js?v=411150r1';
import {moduleDiagnostics} from '/frontend/modules/core/registry.js?v=41129r1';
import {weatherSourceText} from '/frontend/modules/weather/source-text.js?v=411150r1';
window.cleanSource=weatherSourceText;
localStorage.setItem('gewitterradar-about-onboarding-version','1');
const WIND='weather.model.wind_10m.layer';window.windId=WIND;window.mode='success';window.pointUnavailable=false;window.routerReady=true;window.requests=[];window.tileRequests=[];let sequence=0;
const cap=(id,extra={})=>({id,enabled:true,available:true,domain:'weather',family:'model',phenomena:['wind'],resource_types:['raster_tile'],spatial_contexts:['bbox'],title:'ICON · Wind 10 m',...extra});
window.catalog=[cap(WIND),cap('weather.point.wind_speed',{family:'point',resource_types:['value'],spatial_contexts:['point']}),cap('weather.point.wind_direction',{family:'point',resource_types:['value'],spatial_contexts:['point']})];
const card=document.createElement('gewitterradar-card');window.card=card;card.setConfig({initial_zoom:7});
const attribution='Daten: <a href="https://www.dwd.de/" target="_blank" rel="noopener noreferrer">Deutscher Wetterdienst (DWD)</a>';
card.hass={states:{'switch.gewitterradar_language_initialized':{state:'on'},'input_select.lightning_detection_language':{state:'Deutsch',attributes:{options:['Deutsch','English']}}},config:{latitude:50,longitude:8},locale:{language:'de'},callService:async()=>{},callWS:async query=>{
 requests.push(structuredClone(query));
 if(query.type.endsWith('/discovery'))return {schema:'weather_router.consumer.discovery.v1',contract:{name:'weather_router.consumer',supported_versions:[1]},router:{ready:routerReady,enabled:true}};
 if(query.type.endsWith('/capabilities'))return {schema:'weather_router.consumer.capabilities.v1',contract_version:1,capabilities:catalog};
 if(!query.type.endsWith('/resolve'))return {};
 const id=query.capability;
 if(id===WIND&&mode==='hang')return new Promise(()=>{});
 if(id===WIND&&mode==='throw')throw new Error('Synthetic WS transport failure');
 if((id===WIND&&mode==='unavailable')||(id!==WIND&&pointUnavailable))return {schema:'weather_router.consumer.resolution.v1',contract_version:1,capability:id,status:'unavailable',unavailable:{code:'source_unavailable',message:'Synthetic missing data'}};
 if(id===WIND)return {schema:'weather_router.consumer.resolution.v1',contract_version:1,capability:id,status:'ready',resource:{type:'raster_tile',payload:{tile_url:'https://tiles.wind.invalid/{z}/{x}/{y}.png?cycle='+(++sequence)+'&mode='+mode,tile_size:256,max_zoom:8,min_zoom:0,default_opacity:.65,attribution}},provenance:{provider_id:'dwd',provider_name:'Deutscher Wetterdienst (DWD)',attribution,spatial_coverage:{scope:'global'}},routing:{},freshness:{data_time:'2026-11-06T22:00:00Z',stale:false}};
 const speed=id.endsWith('wind_speed');return {schema:'weather_router.consumer.resolution.v1',contract_version:1,capability:id,status:'ready',resource:{type:'value',semantics:{quantity:speed?'wind_speed':'wind_from_direction',observation_kind:'forecast'},payload:{values:{[id]:{value:speed?10:270,unit:speed?'m/s':'°',valid_at:'2026-11-06T22:00:00Z'}}}},provenance:{provider_id:'dwd',attribution},routing:{},freshness:{stale:false}};
}};
document.body.append(card);window.registry=moduleDiagnostics(EXPECTED_MODULES);window.ready=true;
</script>`;
const server=http.createServer((req,res)=>{
 if(req.url==='/'){res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html);return;}
 const file=req.url.startsWith('/leaflet.js')?leaflet:req.url.startsWith('/leaflet.css')?leafletCss:path.resolve(root,'.'+req.url.split('?')[0]);
 if(file!==leaflet&&file!==leafletCss&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(e,data)=>{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'application/octet-stream');e?res.writeHead(404).end():res.end(data);});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});const results=[];
 try{for(const [name,width,height,touch] of [['desktop',1280,900,false],['android-portrait',375,812,true],['android-landscape',812,375,true],['ipad-portrait',768,1024,true],['ipad-landscape',1024,768,true]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch}),page=await context.newPage(),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error(name+' browser error: '+e.message);});
  await page.route('**/*',async route=>{const url=route.request().url();
   if(url.includes('leaflet.css')&&!url.startsWith('http://127.0.0.1'))return route.fulfill({contentType:'text/css',body:fs.readFileSync(leafletCss)});
   if(url.includes('tile.openstreetmap.org'))return route.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64')});
   if(url.startsWith('https://tiles.wind.invalid/')){
    await page.evaluate(url=>tileRequests.push(url),url);const mode=new URL(url).searchParams.get('mode');
    if(mode==='image401')return route.fulfill({status:401,headers:{'Access-Control-Allow-Origin':'*'},body:'Synthetic unauthorized'});
    const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#4e8ec8';ctx.fillRect(0,0,256,256);return c.toDataURL().split(',')[1];});
    return route.fulfill({contentType:'image/png',headers:{'Access-Control-Allow-Origin':'*','Cache-Control':'no-store'},body:Buffer.from(png,'base64')});
   }
   return route.continue();
  });
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.ready&&card._map&&card._weatherLayerMenuState().catalog?.status==='ready');
  assert.equal(await page.evaluate(()=>registry.ok),true);assert.equal(await page.evaluate(()=>registry.loadedCount),35);
  await page.evaluate(()=>card._setMapDisplayMode('fullscreen',{persist:false}));await page.waitForTimeout(200);
  const press=async locator=>touch?locator.tap():locator.click();
  const menuToggle=page.locator('#map-display-menu-toggle'),premium=page.locator('#weather-display-panel'),wind=page.locator('#weather-wind-panel');
  // Enter via the actual gold eye, not by calling _weatherWindOpen.
  await press(page.locator('#weather-display-eye-control'));await premium.waitFor({state:'visible'});
  assert.deepEqual(await premium.locator('[data-weather-display-layer-select] option').evaluateAll(nodes=>nodes.map(n=>n.value)),['precipitation','clouds','wind']);
  await premium.locator('[data-weather-display-layer-select]').selectOption('wind');await wind.waitFor({state:'visible'});assert.equal(await premium.locator('#weather-wind-panel').count(),1);
  await page.evaluate(()=>window.originalWindPanel=card.shadow.getElementById('weather-wind-panel'));
  await wind.locator('[data-wind-setting=enabled]').check();await page.waitForFunction(()=>card._weatherWindState().points.length===9);
  for(const type of ['barbs','arrows','animated']){await wind.locator('[data-wind-setting=mode]').selectOption(type);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>card._weatherWindState().config.mode),type);assert(await page.locator('.weather-wind-canvas').evaluate(canvas=>{const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;for(let i=3;i<data.length;i+=4)if(data[i])return true;return false;}),'visible wind pixels in '+type);}
  for(const color of ['black','white','gold','turquoise','violet','magenta','blue','green'])await press(wind.locator('[data-wind-color='+color+']'));
  await press(wind.locator('[data-wind-color=gold]'));await wind.locator('[data-wind-setting=tempo]').selectOption('fast');await wind.locator('[data-wind-setting=density]').selectOption('high');await wind.locator('[data-wind-setting=unit]').selectOption('kn');
  await page.screenshot({path:path.join(out,name+'-premium-wind.png')});
  console.log(name+' bounds '+JSON.stringify(await premium.evaluate(e=>({client:e.clientWidth,scroll:e.scrollWidth,children:[...e.querySelectorAll('*')].filter(n=>n.scrollWidth>n.clientWidth+1).map(n=>({tag:n.tagName,cls:n.className,client:n.clientWidth,scroll:n.scrollWidth,text:n.textContent?.slice(0,70)})).slice(0,15)}))));
  assert.equal(await wind.evaluate(e=>e.scrollWidth>e.clientWidth+1),false);assert.equal(await premium.evaluate(e=>e.scrollWidth>e.clientWidth+1),false);
  await press(wind.locator('[data-wind-action=legend]'));await page.locator('#weather-wind-legend-overlay').waitFor({state:'visible'});assert.match(await page.locator('#weather-wind-legend-overlay').textContent(),/Deutscher Wetterdienst.*2026-11-06T22:00:00.000Z/);assert.doesNotMatch(await page.locator('#weather-wind-legend-overlay').textContent(),/<a\b|href=/);
  await press(page.locator('#weather-wind-legend-overlay [data-weather-legend-hide]'));
  // All three menu paths reuse the very same wind configuration element.
  await press(menuToggle);await press(page.locator('[data-weather-wind-entry]'));await wind.waitFor({state:'visible'});assert.equal(await page.evaluate(()=>originalWindPanel===card.shadow.getElementById('weather-wind-panel')),true);await press(wind.locator('[data-wind-action=close]'));
  await press(menuToggle);await press(page.locator('[data-weather-layer-entry]'));await press(page.locator('[data-weather-layer-action=wind-settings]'));await wind.waitFor({state:'visible'});assert.equal(await page.evaluate(()=>card._weatherWindState().config.color),'gold');await press(wind.locator('[data-wind-action=close]'));
  const openSub=async()=>{await press(menuToggle);await press(page.locator('[data-weather-layer-entry]'));await press(page.locator('[data-weather-layer-action=category][data-category=weather]'));await press(page.locator('[data-weather-layer-action=subcategory][data-subcategory=wind]'));};
  await openSub();await press(page.locator('[data-weather-layer-action=wind-settings]'));await wind.waitFor({state:'visible'});assert.equal(await page.evaluate(()=>originalWindPanel===card.shadow.getElementById('weather-wind-panel')),true);await press(wind.locator('[data-wind-action=close]'));await openSub();
  const raster=page.locator('[data-weather-layer-action=toggle][data-capability="weather.model.wind_10m.layer"]');
  for(const [mode,expected] of [['success','ready'],['image401','failed'],['unavailable','unavailable'],['throw','unavailable']]){
   await page.evaluate(mode=>window.mode=mode,mode);await raster.click();try{await page.waitForFunction(expected=>card._weatherGenericState(windId).status===expected,expected,{timeout:5000});}catch(error){console.error('Raster '+mode+' '+JSON.stringify(await page.evaluate(()=>{const s=card._weatherGenericState(windId);return {status:s.status,error:s.error,enabled:s.enabled,loaded:s.loaded,failed:s.failed,gen:s.generation,layer:!!s.layer,layerLoading:s.layer?.isLoading?.(),tiles:Object.keys(s.layer?._tiles||{}),tileRequests,events:card._weatherEngineTraceStore().displayEvents.slice(-8)};})));throw error;}
   if(mode==='success'){assert((await page.evaluate(()=>card._weatherGenericState(windId).loaded))>0);assert.doesNotMatch(await page.locator('.weather-layer-panel').textContent(),/<a\b|href=|<script/);assert.match(await page.locator('.weather-layer-panel').textContent(),/Datenquelle: Deutscher Wetterdienst \(DWD\)/);}
   assert.equal(await page.evaluate(()=>card._weatherWindState().points.length),9,'raster outcome never blocks numeric points');await raster.click();assert.equal(await raster.textContent(),'Aus');
  }
  if(name==='desktop'){
   await page.evaluate(()=>{const original=setTimeout;window.restoreTimer=()=>window.setTimeout=original;window.setTimeout=(fn,ms,...args)=>original(fn,ms===20000||ms===30000?80:ms,...args);window.mode='hang';});
   await raster.click();await page.waitForFunction(()=>card._weatherGenericState(windId).status==='failed');assert.match(await page.locator('.weather-layer-panel').textContent(),/Zeitüberschreitung/);await raster.click();await page.evaluate(()=>restoreTimer());
   assert.equal(await page.evaluate(()=>cleanSource('Daten: <a href="javascript:alert(1)">Quelle</a><img src=x onerror="alert(2)"><script>alert(3)</script>')),'Datenquelle: Quelle');
   await page.evaluate(()=>{window.mode='success';});await raster.click();await page.waitForFunction(()=>card._weatherGenericState(windId).status==='ready');
   await page.evaluate(()=>{const s=card._weatherGenericState(windId),tile=Object.values(s.layer._tiles)[0].el;s.layer.fire('tileload',{tile});});assert.equal(await page.evaluate(()=>card._weatherGenericState(windId).status),'ready','late tile success does not regress a completed cycle');
   await page.evaluate(()=>{const original=setTimeout;window.restoreTimer=()=>window.setTimeout=original;window.setTimeout=(fn,ms,...args)=>original(fn,ms===30000?80:ms,...args);card._weatherGenericState(windId).layer.fire('loading');});await page.waitForFunction(()=>card._weatherGenericState(windId).status==='partial');await raster.click();await page.evaluate(()=>restoreTimer());
  }
  await page.evaluate(()=>{window.mode='success';});await raster.click();await page.waitForFunction(()=>card._weatherGenericState(windId).status==='ready');await page.evaluate(()=>card._map.setZoom(10,{animate:false}));await page.waitForFunction(()=>card._weatherGenericState(windId).status==='ready'&&card._map.getZoom()===10);await page.waitForTimeout(1200);await page.waitForFunction(()=>card._weatherGenericState(windId).status==='ready');
  assert((await page.evaluate(()=>tileRequests.map(u=>Number(new URL(u).pathname.split('/')[1])).every(z=>z<=8))),'source-native zoom remains bounded');
  await page.evaluate(()=>card._setMapDisplayMenuOpen(false));const calls=await page.evaluate(()=>requests.length),a=await page.locator('.weather-wind-canvas').evaluate(e=>e.toDataURL());await page.waitForTimeout(250);const b=await page.locator('.weather-wind-canvas').evaluate(e=>e.toDataURL());assert.notEqual(a,b);assert.equal(await page.evaluate(()=>requests.length),calls);
  await press(menuToggle);await press(page.locator('[data-weather-wind-entry]'));await wind.locator('[data-wind-setting=paused]').check();await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>card._weatherWindState().painter.frame),null);
  await page.screenshot({path:path.join(out,name+'-standalone-wind.png')});
  await page.evaluate(()=>{window.pointUnavailable=true;card._weatherWindQueue({force:true});});await page.waitForFunction(()=>card._weatherWindState().points.length===0);assert.equal(await wind.isVisible(),true);assert.match(await wind.textContent(),/Keine kohärenten/);
  await press(wind.locator('[data-wind-action=close]'));await page.evaluate(()=>card._weatherDisplayApplyAvailability({present:true,compatible:true,ready:false},null));await press(page.locator('#weather-display-eye-control'));await premium.waitFor({state:'visible'});await premium.locator('[data-weather-display-layer-select]').selectOption('wind');await wind.waitFor({state:'visible'});assert.equal(await wind.locator('[data-wind-setting=mode]').isEnabled(),true,'configuration remains available while WR is offline');
  await press(page.locator('#weather-display-eye-control'));await page.evaluate(async()=>{window.catalog=catalog.filter(c=>c.resource_types.includes('value'));await card._weatherLayerMenuProbe({refresh:true});});await openSub();await press(page.locator('[data-weather-layer-action=wind-settings]'));await wind.waitFor({state:'visible'});assert.equal(await page.evaluate(()=>originalWindPanel===card.shadow.getElementById('weather-wind-panel')),true,'wind settings do not require an available raster catalogue entry');
  await page.reload();await page.waitForFunction(()=>window.ready&&card._map);assert.equal(await page.evaluate(()=>card._weatherWindState().config.color),'gold');assert.equal(await page.evaluate(()=>card._weatherWindState().config.paused),true);assert.equal(await page.evaluate(()=>card._weatherWindState().config.unit),'kn');
  assert.deepEqual(errors,[]);results.push({name,status:'passed',width,height,physicalDeviceAcceptance:false});console.log(name+': passed actual GR card menus, raster states, sources and wind');await context.close();
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({syntheticIO:true,actualRegisteredCard:true,results},null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});

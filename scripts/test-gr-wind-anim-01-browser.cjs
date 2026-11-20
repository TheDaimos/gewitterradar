/* Full registered GR module tree + Leaflet. Synthetic HA/model transport only.
 * Optional GR_WIND_FIELD_FILE supplies a locally decoded real WR subset for visual comparison.
 */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.GR_WIND_OUTPUT||path.join(os.tmpdir(),'gr-wind-anim01-browser');fs.mkdirSync(out,{recursive:true});
const leaflet=process.env.LEAFLET_JS||require.resolve('leaflet/dist/leaflet.js'),leafletCss=process.env.LEAFLET_CSS||require.resolve('leaflet/dist/leaflet.css');
// Reuse the same real-card harness as the menu repair, not an isolated mock Card.
const baseline=fs.readFileSync(path.join(__dirname,'test-gr-wind-fix-01-browser.cjs'),'utf8');
let html=baseline.match(/const html=String.raw`([\s\S]*?)`;\r?\nconst server=/)[1].replaceAll('module-manifest.js?v=411150r1','module-manifest.js?v=411151r1');
html=html.replace("window.cleanSource=weatherSourceText;",`import {projectedWind} from '/frontend/modules/weather/wind-canvas.js?v=411151r1';window.projectedWind=projectedWind;
window.cleanSource=weatherSourceText;
window.fieldMode='ready';window.fieldSequence=0;
const modelField=()=>{
 const latitudes=Array.from({length:19},(_,i)=>-90+i*10),longitudes=Array.from({length:37},(_,i)=>-180+i*10),u=[],v=[],valid_mask=[];
 for(const lat of latitudes)for(const lon of longitudes){u.push(9+5*Math.sin(lat*Math.PI/60)+2*Math.cos(lon*Math.PI/180));v.push(3*Math.cos(lon*Math.PI/180)+4*Math.sin(lat*Math.PI/90));valid_mask.push(fieldMode==='hole'&&Math.abs(lat-50)<=10&&Math.abs(lon)<=10?0:1);}
 return {schema:'weather_router.consumer.wind_field.v2',contract_version:2,capability:'weather.wind.field_10m',status:'ready',frame:{id:'synthetic-native-field-'+(++fieldSequence),capability:'weather.wind.field_10m',unit:'m/s',height_m:10,kind:'model_forecast',model:'Synthetic coherent test grid',valid_at:'2026-11-07T06:00:00Z',model_run:'2026-11-07T00:00:00Z',valid_until:new Date(Date.now()+600000).toISOString(),refresh_after_seconds:300,native_resolution_degrees:.25,provenance:{provider_id:'synthetic-field',attribution:'Synthetic coherent field · browser test',source_url:'https://example.com/model',delivery_url:'https://example.com/delivery'},coverage:{west:-180,east:180,south:-90,north:90},grid:{crs:'EPSG:4326',layout:'row_major_south_first',latitudes,longitudes,u,v,valid_mask,cyclic:true}}};
};`);
html=html.replace("requests.push(structuredClone(query));",`requests.push(structuredClone(query));
 if(query.type==='weather_router/consumer/resolve_wind_field'){
  if(fieldMode==='unavailable')return {schema:'weather_router.consumer.wind_field.v2',contract_version:2,capability:query.capability,status:'unavailable',unavailable:{code:'provider_disabled'}};
  if(fieldMode==='throw')throw new Error('Synthetic field transport failure');
  if(fieldMode==='real')return (await fetch('/real-field.json')).json();
  return modelField();
 }`);
const server=http.createServer((req,res)=>{
 const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(name==='/'){res.setHeader('Content-Type','text/html;charset=utf-8');return res.end(html);}
 if(name==='/real-field.json'&&process.env.GR_WIND_FIELD_FILE){res.setHeader('Content-Type','application/json');return res.end(fs.readFileSync(process.env.GR_WIND_FIELD_FILE));}
 const file=name==='/leaflet.js'?leaflet:path.resolve(root,'.'+name);
 if(name!='/leaflet.js'&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 if(!fs.existsSync(file)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'application/octet-stream');res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})}),results=[];
 try{
 for(const [name,width,height,touch] of [['desktop',1280,850,false],['android-portrait',393,851,true],['android-landscape',851,393,true],['ipad-portrait',820,1180,true],['ipad-landscape',1180,820,true]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:1}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{const url=route.request().url();
   if(url.includes('leaflet.css')&&!url.startsWith('http://127.0.0.1'))return route.fulfill({contentType:'text/css',body:fs.readFileSync(leafletCss)});
   if(!url.startsWith('http://127.0.0.1'))return route.fulfill({status:204,body:''});return route.continue();
  });
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.ready&&card._map);assert(await page.evaluate(()=>registry.ok));assert.equal(await page.evaluate(()=>registry.loadedCount),35);
  await page.evaluate(()=>{card._setMapDisplayMode('fullscreen',{persist:false});card._map.setView([51,8],5,{animate:false});});
  assert(Math.abs(await page.evaluate(()=>projectedWind(card._map,{lat:51,lon:8,from:225}).angle)+Math.PI/4)<.06,'real Leaflet overview preserves subpixel wind direction');
  const press=async loc=>touch?loc.tap():loc.click(),wind=page.locator('#weather-wind-panel'),premium=page.locator('#weather-display-panel');
  await press(page.locator('#weather-display-eye-control'));await premium.locator('[data-weather-display-layer-select]').selectOption('wind');await wind.waitFor({state:'visible'});
  await wind.locator('[data-wind-setting=enabled]').check();await wind.locator('[data-wind-setting=mode]').selectOption('animated');await wind.locator('[data-wind-setting=colorField]').check();
  await page.waitForFunction(()=>card._weatherWindState().field&&card._weatherWindState().metrics?.segments>20);await page.waitForTimeout(100);
  const calls=await page.evaluate(()=>requests.length),first=await page.locator('.weather-wind-canvas').evaluate(c=>c.toDataURL()),metrics=await page.evaluate(()=>card._weatherWindState().metrics);await page.waitForTimeout(200);
  assert.notEqual(await page.locator('.weather-wind-canvas').evaluate(c=>c.toDataURL()),first,'actual animated field pixels move');assert.equal(await page.evaluate(()=>requests.length),calls,'no weather requests per frame');assert((await page.evaluate(()=>card._weatherWindState().metrics.advected))>metrics.advected);assert.equal(await page.evaluate(()=>card._weatherWindState().points.length),0,'no point-query mesh');
  assert.equal(await wind.evaluate(e=>e.scrollWidth>e.clientWidth+1),false);assert.equal(await premium.evaluate(e=>e.scrollWidth>e.clientWidth+1),false);
  for(const mode of ['barbs','arrows','animated']){await wind.locator('[data-wind-setting=mode]').selectOption(mode);await page.waitForTimeout(60);assert.equal(await page.evaluate(()=>card._weatherWindState().config.mode),mode);}
  for(const color of ['black','white','gold','turquoise','violet','magenta','blue','green'])await press(wind.locator('[data-wind-color='+color+']'));
  await press(wind.locator('[data-wind-color=white]'));await wind.locator('[data-wind-setting=tempo]').selectOption('slow');await wind.locator('[data-wind-setting=density]').selectOption('high');
  await wind.locator('[data-wind-setting=fieldOpacity]').fill('80');await wind.locator('[data-wind-setting=fieldOpacity]').dispatchEvent('change');
  await wind.locator('[data-wind-setting=unit]').selectOption('Bft');await wind.locator('[data-wind-setting=paused]').check();await page.waitForTimeout(60);assert.equal(await page.evaluate(()=>card._weatherWindState().painter.frame),null);
  const paused=await page.locator('.weather-wind-canvas').evaluate(c=>c.toDataURL());await page.waitForTimeout(100);assert.equal(await page.locator('.weather-wind-canvas').evaluate(c=>c.toDataURL()),paused);
  await press(wind.locator('[data-wind-action=legend]'));const legend=page.locator('#weather-wind-legend-overlay');await legend.waitFor({state:'visible'});const text=await legend.textContent();assert.match(text,/Windgeschwindigkeit.*Bft/);assert.match(text,/2026-11-07T06:00:00Z/);assert.match(text,/Modelllauf.*2026-11-07T00:00:00Z/);assert.doesNotMatch(text,/<a\b|href=/);assert.equal(await legend.evaluate(e=>e.scrollWidth>e.clientWidth+1),false);
  await page.screenshot({path:path.join(out,name+'-wind-legend.png')});await press(legend.locator('[data-weather-legend-hide]'));
  await press(page.locator('#weather-display-eye-control'));await premium.locator('[data-weather-display-layer-select]').selectOption('wind');await wind.waitFor({state:'visible'});await wind.locator('[data-wind-setting=paused]').uncheck();
  await page.evaluate(()=>card._weatherDisplayPatch({enabled:false}));
  await page.screenshot({path:path.join(out,name+'-flow.png')});
  if(name==='desktop'){
   // A longitude-only world copy reuses the native field without another request.
   await page.evaluate(()=>card._weatherWindQueue({force:true}));await page.waitForFunction(()=>!card._weatherWindState().batch&&!card._weatherWindState().pending);const before=await page.evaluate(()=>requests.length);
   await page.evaluate(()=>{const c=card._map.getCenter();card._map.panTo([c.lat,c.lng+360],{animate:false});});await page.waitForTimeout(700);assert.equal(await page.evaluate(()=>requests.length),before);
   await page.evaluate(()=>card._map.setView([51,8],5,{animate:false}));await page.waitForTimeout(700);
   // The colour field can render independently of every symbol mode.
   await page.evaluate(()=>card._weatherWindSet({enabled:false,colorField:true}));await page.waitForTimeout(60);assert.equal(await page.evaluate(()=>card._weatherWindState().metrics.segments),0);assert(await page.locator('.weather-wind-canvas').evaluate(c=>c.getContext('2d').getImageData(c.width/2,c.height/2,1,1).data[3]>0));
   await page.evaluate(()=>{window.fieldMode='hole';card._weatherWindQueue({force:true});});await page.waitForFunction(()=>card._weatherWindState().field?.grid.valid_mask.some(v=>v===0));await page.waitForTimeout(60);assert.equal(await page.locator('.weather-wind-canvas').evaluate(c=>c.getContext('2d').getImageData(c.width/2,c.height/2,1,1).data[3]),0,'NoData colour pixels stay transparent');
   for(const mode of ['unavailable','throw']){await page.evaluate(mode=>{window.fieldMode=mode;card._weatherWindQueue({force:true});},mode);await page.waitForFunction(()=>!card._weatherWindState().field&&!card._weatherWindState().batch);assert.equal(await page.evaluate(()=>card._weatherWindState().status.startsWith('WR-Windfeld verfügbar')),false);}
   await page.evaluate(()=>{window.fieldMode='ready';card._weatherWindSet({enabled:true,colorField:true,tempo:'normal'});card._weatherWindQueue({force:true});});await page.waitForFunction(()=>card._weatherWindState().field&&card._weatherWindState().metrics.advected>0);
   if(process.env.GR_WIND_FIELD_FILE){
    // Offline replay of a captured authorized WR answer: hold Date inside its
    // original grant. No changed model times, fabricated weather or live claim.
    const recorded=JSON.parse(fs.readFileSync(process.env.GR_WIND_FIELD_FILE,'utf8'));
    await page.clock.setFixedTime(new Date(Date.parse(recorded.frame.valid_until)-60000));
    await page.evaluate(()=>{window.fieldMode='real';card._weatherWindQueue({force:true});});await page.waitForFunction(()=>card._weatherWindState().field?.provenance.provider_id==='noaa_nws');await page.evaluate(()=>card._map.setView([48,-15],4,{animate:false}));await page.waitForTimeout(800);
   }
   await page.evaluate(()=>card._weatherDisplayPatch({enabled:false}));
   await page.waitForTimeout(3000);
   for(let i=0;i<8;i++){await page.screenshot({path:path.join(out,'comparison-'+i+'.png')});await page.waitForTimeout(100);}
   // Check scheduler disposal on the actual card, not a canvas mock.
   await page.evaluate(()=>card._weatherWindSet({enabled:false,colorField:false}));assert.equal(await page.locator('.weather-wind-canvas').count(),0);
  }
  await page.evaluate(()=>card._weatherWindSet({enabled:true,colorField:true,paused:true,color:'gold',unit:'kn'}));await page.reload();await page.waitForFunction(()=>window.ready&&card._map);assert.equal(await page.evaluate(()=>card._weatherWindState().config.colorField),true);assert.equal(await page.evaluate(()=>card._weatherWindState().config.color),'gold');assert.equal(await page.evaluate(()=>card._weatherWindState().config.paused),true);assert.equal(await page.evaluate(()=>card._weatherWindState().config.unit),'kn');
  assert.deepEqual(errors,[]);results.push({name,width,height,touch,status:'passed',physicalDeviceAcceptance:false,metrics});console.log(name+': full card field, colours, animation, legend, menus and persistence passed');await context.close();
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});

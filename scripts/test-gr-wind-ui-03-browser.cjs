/* Synthetic point-contract browser acceptance. No external provider or HA requests. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.env.GR_WIND_OUTPUT||path.join(os.tmpdir(),'gr-wind-ui03-browser');fs.mkdirSync(out,{recursive:true});
const leaflet=process.env.LEAFLET_JS||require.resolve('leaflet/dist/leaflet.js'),leafletCss=process.env.LEAFLET_CSS||require.resolve('leaflet/dist/leaflet.css');
const html=String.raw`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0"><script src="/leaflet.js"></script><script type="module">
import '/frontend/gewitterradar.js';
import {EXPECTED_MODULES} from '/frontend/module-manifest.js?v=411149r1';
import {moduleDiagnostics} from '/frontend/modules/core/registry.js?v=41129r1';
import {installWeatherWind} from '/frontend/modules/weather/wind-display.js?v=411149r1';
import {installWeatherRouter} from '/frontend/modules/weather/consumer-client.js';
import {installWeatherLegendOverlay,PRECIPITATION_LEGEND_ENTRIES} from '/frontend/modules/weather/legend-overlay.js?v=411149r1';
class Fixture extends HTMLElement{constructor(){super();this.shadow=this.attachShadow({mode:'open'});}}
installWeatherRouter(Fixture);installWeatherWind(Fixture);installWeatherLegendOverlay(Fixture);customElements.define('wind-fixture',Fixture);
const card=new Fixture();window.card=card;document.body.append(card);const css=await(await fetch('/leaflet.css')).text();
card.shadow.innerHTML='<style>'+css+'\n:host{display:block}#map-card{height:100dvh;position:relative;overflow:hidden;background:#172535}#map{height:100%;width:100%}.release-history-future-chevron{display:block;width:10px;height:10px;border-right:2px solid #e6c26a;border-bottom:2px solid #e6c26a;transform:rotate(45deg);transition:transform .4s}.collapsed>.weather-legend-section-head .release-history-future-chevron{transform:rotate(-135deg)}</style><div id="map-card"><div id="map"></div></div>';
card._map=L.map(card.shadow.getElementById('map'),{zoomControl:false,attributionControl:false}).setView([50,8],5);
window.ws=[];window.active=0;window.peak=0;window.bad=false;
card._hass={callWS:async request=>{ws.push(structuredClone(request));if(request.type.endsWith('/discovery'))return {schema:'weather_router.consumer.discovery.v1',contract:{name:'weather_router.consumer',supported_versions:[1]},router:{ready:true,enabled:true}};
active++;peak=Math.max(peak,active);await new Promise(r=>setTimeout(r,2));active--;
const id=request.capability,speed=id.endsWith('wind_speed'),value=speed?(bad?12:request.context.latitude>51?0:12):270;
return {schema:'weather_router.consumer.resolution.v1',contract_version:1,capability:id,status:'ready',resource:{type:'value',semantics:{quantity:speed?'wind_speed':'wind_from_direction',observation_kind:'forecast',unit:speed?'m/s':'°'},payload:{values:{[id]:{value,unit:speed?'m/s':'°',valid_at:bad&&!speed?'2026-11-06T22:00:00Z':'2026-11-06T21:00:00Z'}}}},provenance:{provider_id:'synthetic',attribution:'Synthetische Browser-Prüfdaten'},routing:{},freshness:{stale:false}};}};
card._weatherDisplayLegendMode=()=> 'on';card._weatherLegendSetModel('precipitation',{family:'precipitation',active:true,title:'Geschützte Niederschlagslegende',entries:PRECIPITATION_LEGEND_ENTRIES,unit:'mm/h'});
window.registry=moduleDiagnostics(EXPECTED_MODULES);card._weatherWindOpen();window.ready=true;
</script>`;
const server=http.createServer((req,res)=>{
 if(req.url==='/'){res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html);return;}
 const file=req.url.startsWith('/leaflet.js')?leaflet:req.url.startsWith('/leaflet.css')?leafletCss:path.resolve(root,'.'+req.url.split('?')[0]);
 if(file!==leaflet&&file!==leafletCss&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(e,data)=>{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.webp')?'image/webp':'application/octet-stream');e?res.writeHead(404).end():res.end(data);});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});const results=[];
 try{for(const [name,width,height,touch] of [['desktop',1280,900,false],['android-portrait',375,812,true],['android-landscape',812,375,true],['ipad-portrait',768,1024,true],['ipad-landscape',1024,768,true],['narrow',320,740,true]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch}),page=await context.newPage(),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('Browser error: '+JSON.stringify({message:e.message,name:e.name,stack:e.stack}));});page.on('console',m=>{if(m.type()==='error')console.error('Console: '+m.text());});page.on('requestfailed',r=>console.error('Request failed: '+r.url()+' '+r.failure()?.errorText));
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.ready);assert.equal(await page.evaluate(()=>window.innerWidth),width);
  assert.deepEqual(await page.evaluate(()=>({ok:registry.ok,count:registry.loadedCount,duplicates:registry.duplicateIds})),{ok:true,count:35,duplicates:[]});
  const panel=page.locator('#weather-wind-panel');assert.equal(await panel.isVisible(),true);assert.equal(await page.evaluate(()=>ws.length),0,'old raster behavior remains the default; no wind calls before opt-in');
  await panel.locator('[data-wind-setting=enabled]').check();await page.waitForFunction(()=>card._weatherWindState().points.length===9);
  assert.equal(await page.evaluate(()=>ws.filter(r=>r.type.endsWith('/resolve')).length),18);assert((await page.evaluate(()=>peak))<=4);
  await panel.locator('[data-wind-setting=mode]').selectOption('arrows');await page.waitForTimeout(120);
  assert.equal(await page.evaluate(()=>card._weatherWindState().metrics.moving),false);
  await panel.locator('[data-wind-setting=mode]').selectOption('animated');await page.waitForFunction(()=>card._weatherWindState().metrics?.moving);
  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>card._weatherWindSet({animationExplicit:false}));await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>card._weatherWindState().metrics.moving),false);
  await page.evaluate(()=>card._weatherWindSet({animationExplicit:true}));await page.waitForFunction(()=>card._weatherWindState().metrics.moving);await page.emulateMedia({reducedMotion:'no-preference'});
  await panel.locator('[data-wind-setting=density]').selectOption('high');await panel.locator('[data-wind-setting=tempo]').selectOption('fast');
  for(const color of ['black','white','gold','turquoise','violet','magenta','blue','green']){await panel.locator('[data-wind-color='+color+']').click();assert.equal(await panel.locator('[data-wind-color='+color+']').getAttribute('aria-pressed'),'true');}
  await panel.locator('[data-wind-color=white]').click();
  const count=await page.evaluate(()=>ws.length),before=await page.locator('.weather-wind-canvas').evaluate(e=>e.toDataURL());await page.waitForTimeout(450);const after=await page.locator('.weather-wind-canvas').evaluate(e=>e.toDataURL());assert.notEqual(before,after,'actual received vectors produce changing visible canvas pixels');assert.equal(await page.evaluate(()=>ws.length),count,'animation performs no weather requests');
  await panel.locator('[data-wind-setting=paused]').check();await page.waitForTimeout(100);const paused=await page.locator('.weather-wind-canvas').evaluate(e=>e.toDataURL());await page.waitForTimeout(150);assert.equal(await page.locator('.weather-wind-canvas').evaluate(e=>e.toDataURL()),paused);assert.equal(await page.evaluate(()=>card._weatherWindState().painter.frame),null);
  await panel.locator('[data-wind-setting=unit]').selectOption('kn');await panel.locator('[data-wind-setting=fieldOpacity]').evaluate(e=>{e.value=61;e.dispatchEvent(new Event('change',{bubbles:true}));});
  assert.equal(await panel.locator('fieldset').last().locator('input[type=checkbox]').isDisabled(),true);assert.match(await panel.textContent(),/kein numerisches WR-Windraster/);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('gewitterradar:wind-ui:v1')));assert.equal(saved.fieldOpacity,61);assert.equal(saved.unit,'kn');assert.equal(saved.mode,'animated');assert.equal(saved.paused,true);
  assert.equal(await panel.evaluate(e=>e.scrollWidth>e.clientWidth+1),false);const bounds=await panel.boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=width+1&&bounds.y+bounds.height<=height+1);
  await page.screenshot({path:path.join(out,name+'-settings.png')});
  // Separate wind and precipitation overlay position storage and chevrons.
  await panel.locator('[data-wind-action=legend]').click();const legend=page.locator('#weather-wind-legend-overlay');await legend.waitFor({state:'visible'});assert.equal(await panel.isVisible(),false);
  assert.match(await legend.textContent(),/lokalen|jeweils durch WR/);assert.match(await legend.textContent(),/2026-11-06T21:00:00.000Z/);assert.equal(await page.locator('#weather-legend-overlay').isVisible(),true);
  assert.equal(await legend.evaluate(e=>e.scrollWidth>e.clientWidth+1),false);const header=legend.locator('.weather-legend-global-head'),b=await header.boundingBox();const rainStorage=await page.evaluate(()=>localStorage.getItem('gewitterradar:weather-legend-position:v1'));
  await page.mouse.move(b.x+35,b.y+b.height/2);await page.mouse.down();await page.mouse.move(b.x+55,b.y+b.height/2-25,{steps:4});await page.mouse.up();assert(await page.evaluate(()=>JSON.parse(localStorage.getItem('gewitterradar:wind-ui:v1')).legendPosition));assert.equal(await page.evaluate(()=>localStorage.getItem('gewitterradar:weather-legend-position:v1')),rainStorage);
  const toggle=legend.locator('[data-weather-section-toggle]');await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'false');await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  await page.screenshot({path:path.join(out,name+'-legend.png')});
  const queryCount=await page.evaluate(()=>ws.length);await page.evaluate(()=>card._map.panTo([card._map.getCenter().lat,card._map.getCenter().lng+360],{animate:false}));await page.waitForTimeout(600);assert.equal(await page.evaluate(()=>ws.length),queryCount,'a wrapped copy reuses canonical point results');
  await page.evaluate(()=>card._map.setZoom(6,{animate:false}));await page.waitForFunction(count=>ws.length>count,queryCount);await page.waitForFunction(()=>card._weatherWindState().batch===null);
  await page.evaluate(()=>{bad=true;card._weatherWindQueue({force:true});});await page.waitForFunction(()=>card._weatherWindState().status.includes('Keine kohärenten'));assert.equal(await page.evaluate(()=>card._weatherWindState().points.length),0,'incoherent times never turn into visible vectors');
  await page.evaluate(()=>{bad=false;card._weatherWindQueue({force:true});});await page.waitForFunction(()=>card._weatherWindState().points.length===9);
  await page.evaluate(()=>{card._weatherWindSet({paused:false});});await page.waitForTimeout(300);const metrics=await page.evaluate(()=>card._weatherWindDiagnostics().metrics);
  await page.evaluate(()=>card._teardownWeatherWind());assert.equal(await page.locator('.weather-wind-canvas').count(),0);assert.equal(await page.evaluate(()=>card._weatherWindState().refreshTimer),null);
  await page.evaluate(()=>card._resumeWeatherWind());await page.waitForTimeout(450);assert.equal(await page.locator('.weather-wind-canvas').count(),1);
  // Re-read preferences after a page lifecycle; no old precipitation position overwrite.
  await page.reload();await page.waitForFunction(()=>window.ready);assert.equal(await page.evaluate(()=>card._weatherWindState().config.color),'white');assert.equal(await page.evaluate(()=>card._weatherWindState().config.fieldOpacity),61);
  assert.deepEqual(errors,[]);results.push({name,width,height,touchEmulation:touch,metrics,status:'passed',physicalCompanionAcceptance:false});console.log(name+': passed '+JSON.stringify(metrics));await context.close();
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({synthetic:true,physicalDeviceAcceptance:false,results},null,2));
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});

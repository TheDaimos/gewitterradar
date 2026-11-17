/* Registered GR card and Leaflet. Only WeatherRouter transport and raster bytes are fixtures. */
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {fixture}=require('./wind-perf-browser-fixture.cjs');

const clouds='weather.satellite.clouds';
const extendHtml=html=>html
 .replace('window.catalog=[cap(WIND)',`window.cloudsId='${clouds}';window.cloudFailure=false;window.catalog=[cap(cloudsId,{family:'satellite',phenomena:['clouds'],title:'Satellite clouds'}),cap(WIND)`)
 .replace(' const id=query.capability;',` const id=query.capability;
  if(id===cloudsId){
   const base={schema:'weather_router.consumer.resolution.v1',contract_version:1,capability:id};
   if(cloudFailure)return {...base,status:'unavailable',unavailable:{code:'source_unavailable'}};
   return {...base,status:'ready',resource:{type:'raster_tile',payload:{tile_url:'https://tiles.cloud-fixture.invalid/{z}/{x}/{y}.png',tile_size:256,max_zoom:8,min_zoom:0,default_opacity:.65,attribution:'Cloud test provider'}},
    provenance:{provider_id:'test',spatial_coverage:{scope:'global'}},routing:{},freshness:{data_time:new Date().toISOString(),stale:false}};
  }
 `);

async function run(){
 const f=fixture({extendHtml});
 await new Promise(resolve=>f.server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
  const context=await browser.newContext({viewport:{width:393,height:851},hasTouch:true,isMobile:true});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await f.route(page);
  let png;
  await page.route('https://tiles.cloud-fixture.invalid/**',route=>route.fulfill({
   contentType:'image/png',headers:{'Access-Control-Allow-Origin':'*'},body:png,
  }));
  const ready=()=>page.waitForFunction(()=>window.ready&&card._mapReady&&card._weatherLayerMenuState().catalog?.status==='ready');
  const layerReady=async()=>{
   await page.waitForFunction(()=>['ready','failed','unavailable'].includes(card._weatherGenericState(cloudsId).status),null,{timeout:8000});
   const state=await page.evaluate(()=>{const {status,error}=card._weatherGenericState(cloudsId);return {status,error};});
   assert.equal(state.status,'ready',JSON.stringify(state));
  };
  await page.goto('http://127.0.0.1:'+f.server.address().port);
  await ready();
  png=Buffer.from(await page.evaluate(()=>{
   const c=document.createElement('canvas');c.width=c.height=256;
   const ctx=c.getContext('2d');ctx.fillStyle='#ddd';ctx.fillRect(0,0,256,256);
   return c.toDataURL().split(',')[1];
  }),'base64');
  await page.evaluate(()=>{
   card._eyeHubResize(1);card._eyeHubAssign(4,'synoptic');
   card._eyeHubResize(1);card._eyeHubAssign(5,'clouds');
   card._eyeHubPatch({grouped:false});
   card._setMapDisplayMode('fullscreen',{persist:false});
  });
  const icon=page.locator('#weather-clouds-toggle'),panel=page.locator('#weather-clouds-panel');
  const wind=page.locator('#weather-wind-toggle'),eye=page.locator('#weather-display-eye-control');
  const beforeWind=await wind.getAttribute('aria-pressed');
  await icon.tap();
  await layerReady();
  assert.equal(await icon.getAttribute('aria-pressed'),'true');
  assert.equal(await wind.getAttribute('aria-pressed'),beforeWind);
  assert.equal(await page.evaluate(()=>card._eyeHubStatuses()['weather-display'].active),false);
  const cdp=await context.newCDPSession(page);
  const touch=(type,point)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:point?[point]:[]});
  const center=async locator=>{const b=await locator.boundingBox();return {x:b.x+b.width/2,y:b.y+b.height/2};};
  async function hold(locator){
   await touch('touchStart',await center(locator));
   await panel.waitFor({state:'visible',timeout:4000});
   await touch('touchEnd');
  }
  await hold(icon);
  assert.equal(await icon.getAttribute('aria-pressed'),'true');
  assert.match(await panel.locator('.clouds-description img').getAttribute('src'),/gr-clouds-help-premium-original\.png$/);
  assert(await panel.evaluate(p=>{
   const r=p.getBoundingClientRect(),parent=p.parentElement.getBoundingClientRect();
   return r.width<=parent.width&&p.scrollWidth===p.clientWidth&&getComputedStyle(p).backgroundImage!=='none';
  }));
  const otherOpacity=await page.evaluate(()=>card._weatherDisplayState().config.opacities.precipitation);
  await panel.locator('[data-cloud-opacity]').fill('37');
  assert.equal(await page.evaluate(()=>card._weatherGenericState(cloudsId).layer.options.opacity),.37);
  assert.equal(await page.evaluate(()=>card._weatherDisplayState().config.opacities.precipitation),otherOpacity);
  await panel.locator('[data-cloud-style]').selectOption('balanced');
  assert.equal(await page.evaluate(()=>card._map.getPane('gr-wr-clouds').dataset.weatherCloudBalanced),'true');
  const close=panel.locator('[data-premium-action=close]');
  assert.match(await close.locator('img').getAttribute('src'),/gewitterradar-about-close-premium\.webp$/);
  assert.equal(await close.evaluate(node=>getComputedStyle(node).borderRadius),'50%');
  assert.equal(await close.evaluate(node=>node.getBoundingClientRect().width),40);
  await close.tap();

  const start=await center(icon);
  await touch('touchStart',start);
  for(let i=1;i<=5;i++)await touch('touchMove',{x:start.x+12*i,y:start.y+14*i});
  await touch('touchEnd');
  assert.equal(await icon.getAttribute('aria-pressed'),'true','drag must not toggle clouds');
  assert(await page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('gewitterradar:clouds-ui:v1')).positions).length===1));

  await page.evaluate(()=>{card._eyeHubPatch({grouped:true});card._eyeHubOpen();});
  await page.locator('[data-eye-color=clouds]').tap();
  await page.locator('[data-eye-paint=none]').tap();
  assert.equal(await page.evaluate(()=>card._eyeHubState().config.colors.clouds),'none');
  await page.keyboard.press('Escape');
  await eye.tap();
  const bubble=page.locator('#eye-hub-bubbles [data-function=clouds]');
  assert.equal(await bubble.getAttribute('data-active'),'false','none disables the visible ring');
  assert.match(await bubble.getAttribute('aria-label'),/Aktiv|Active/);
  await bubble.tap();
  assert.equal(await page.evaluate(()=>card._weatherGenericState(cloudsId).enabled),false);
  await eye.tap();
  await hold(bubble);
  assert.equal(await panel.locator('[data-cloud-visible]').isChecked(),false);
  await panel.locator('[data-premium-action=close]').tap();

  await page.evaluate(()=>{card._setMapDisplayMenuOpen(true);card._weatherLayerMenuOpenHub();});
  const layerButton=page.locator('[data-weather-layer-action=toggle][data-capability="'+clouds+'"]').first();
  await layerButton.tap({timeout:5000});
  await layerReady();
  await page.reload();
  await ready();
  await layerReady();
  assert.equal(await page.evaluate(()=>card._eyeHubState().config.slots[4].functionId),'synoptic');
  assert.equal(await page.evaluate(()=>card._eyeHubState().config.slots[5].functionId),'clouds');
  assert.equal(await page.evaluate(()=>card._eyeHubState().config.colors.clouds),'none');
  assert.equal(await page.evaluate(()=>card._weatherGenericState(cloudsId).layer.options.opacity),.37);
  await page.evaluate(()=>{window.cloudFailure=true;void card._weatherGenericRefresh(cloudsId);});
  await page.waitForFunction(()=>card._eyeHubStatuses().clouds.available===false);
  assert.equal(await wind.getAttribute('aria-pressed'),beforeWind);
  assert.deepEqual(errors,[]);
  console.log('PASS clouds in Eye and WeatherRouter, touch tap / hold / drag, shared opacity, profile restore and provider unavailable');
 }finally{
  await browser?.close();
  await new Promise(resolve=>f.server.close(resolve));
 }
}

run().catch(error=>{console.error(error);process.exitCode=1;});

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const output = path.join(os.tmpdir(),'gr-premium-180');
fs.mkdirSync(output,{recursive:true});
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {flowFixture} = require('./flow-curves-browser-fixture.cjs');

const reference = '51fe26380bdd97b46fe7d979a2ef994b483cc430';
const decorate = html => html.replace('window.catalog=[cap(WIND),',
 "window.catalog=[cap('weather.precipitation.layer',{family:'radar',phenomena:['precipitation']}),cap('weather.satellite.clouds',{family:'satellite',phenomena:['clouds']}),cap(WIND),");

async function pageFor(browser, fixture, viewport, mobile) {
 const context = await browser.newContext({viewport, hasTouch:mobile, isMobile:mobile, deviceScaleFactor:mobile?3:1});
 const page = await context.newPage();
 await fixture.route(page);
 await page.goto('http://127.0.0.1:' + fixture.server.address().port);
 await page.waitForFunction(() => window.ready && card._map);
 await page.evaluate(() => card._setMapDisplayMode('fullscreen',{persist:false}));
 return page;
}

async function pixelsAndRadii(page, spacing) {
 return page.evaluate(async ({gap, spacing}) => {
  const {EyeNeonWow} = await import('/frontend/modules/weather/eye-neon-wow.js');
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;top:45%;left:45%;width:90px;height:90px';
  document.body.append(host);
  const base = card._eyeHubState().config;
  const statuses = Object.fromEntries(base.slots.map(slot=>[slot.functionId,{active:true,available:true}]));
  const result = [];
  async function digest(canvas) {
   const bytes = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
   return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)));
  }
  for (const glow of ['static','living']) {
   const renderer = new EyeNeonWow();
   renderer.schedule = () => {};
   renderer.sync([{host,statuses,config:{...base,grouped:true,aura:true,glow,size:90,
    intensity:100,brightness:100,neonBrilliance:70,neonBloom:100,neonOrganics:100,
    eyeAuraGap:gap,auraRingGap:spacing}}]);
   const surface = renderer.surfaces[0];
   for (const ring of surface.rings.values()) ring.visibility=1;
   const state = surface.wow;
   state.bridges.length=0;
   state.serial=0;
   state.nextContact=0;
   state.lastBloom=-Infinity;
   state.changed=100;
   for (let frame=0;frame<120;frame++) renderer.draw(surface,10+frame/30,1/30);
   result.push({glow, radii:[...surface.rings.values()].map(r=>r.radius), extent:surface.extent,
    base:await digest(surface.canvas), addon:await digest(state.canvas),
    bloom:await digest(state.bloom), size:state.canvas.width,
    bridges:state.bridges.map(b=>[b.source.id,b.target.id,b.sa,b.ta]), transfers:state.stats.transfers});
   renderer.destroy();
  }
  host.remove();
  return result;
 }, spacing);
}

async function controls(page) {
 const select = page.locator('#weather-display-panel [data-weather-display-layer-select]');
 await page.evaluate(() => {
  // Pre-update opacity values represent the rendered alpha.
  card._weatherDisplayPatch({opacities:{precipitation:.7,clouds:.8,windSymbols:.3}});
  card._weatherTemperatureSet({opacity:60});
  card._weatherDisplayOpenFromLayerMenu();
 });
 const range = page.locator('#weather-display-panel [data-quick=transparency]');
 const output = page.locator('#weather-display-panel [data-quick-transparency]');
 const set = (node,value) => node.evaluate((input,value) => {
  input.value=value;
  input.dispatchEvent(new Event('input',{bubbles:true}));
 },value);
 const presets = {precipitation:70,clouds:80,wind:30,temperature:60};
 for (const [layer,value] of Object.entries(presets)) {
  await select.selectOption(layer);
  assert.equal(await range.inputValue(),String(value));
 }
 for (const layer of Object.keys(presets)) {
  await select.selectOption(layer);
  for (const value of [0,30,50,70,100]) {
   await set(range,value);
   assert.equal(await output.innerText(),value+' %');
   const opacity=await page.evaluate(layer => layer==='temperature'
    ? card._weatherTemperatureState().config.opacity/100
    : card._weatherDisplayState().config.opacities[layer==='wind'?'windSymbols':layer],layer);
   assert.equal(opacity,value/100);
  }
  await set(range,presets[layer]);
 }
 for (const [layer,value] of Object.entries(presets)) {
  await select.selectOption(layer);
  assert.equal(await range.inputValue(),String(value));
 }
 await page.evaluate(()=>card._weatherWindSet({colorField:true,fieldOpacity:40}));
 await select.selectOption('wind');
 for (const value of [0,30,50,70,100]) {
  await set(range,value);
  assert.equal(await page.evaluate(()=>card._weatherWindState().config.fieldOpacity),value);
 }
 assert.equal(await page.evaluate(()=>card._weatherDisplayState().config.opacities.windSymbols),.3);
 const quick = page.locator('#weather-display-panel');
 for (const layer of Object.keys(presets)) {
  await select.selectOption(layer);
  await quick.locator('[data-quick-reset]').click();
  const expected=await page.evaluate(layer=>layer==='temperature'?45:layer==='wind'?45:
   Math.round(card._weatherDisplayNaturalOpacity(layer)*100),layer);
  assert.equal(await range.inputValue(),String(expected));
 }
 await select.selectOption('precipitation');
 await page.evaluate(()=>card._mountWeatherDisplaySettings());
 const legacy=page.locator('[data-weather-display-settings] [data-weather-display-transparency]');
 await set(legacy,30);
 assert.equal(await range.inputValue(),'30');
 assert.equal(await page.evaluate(()=>card._weatherDisplayState().config.opacities.precipitation),.3);
 const translations=await page.evaluate(async()=> (await import('/frontend/modules/weather/display-quick.js')).QUICK_TRANSLATIONS);
 assert.equal(translations.Deutsch.transparency,'Transparenz');
 assert.equal(translations.Deutsch.opacityHelp,'0 % = unsichtbar · 100 % = vollständig sichtbar');
 assert.equal(translations.English.opacityHelp,'0% = invisible · 100% = fully visible');
}

async function preview(page, view) {
 await page.evaluate(() => {
  const hub=card._eyeHubState();
  for (const [id,entry] of hub.registry.entries) hub.registry.entries.set(id,{...entry,status:()=>({active:true,available:true})});
  card._eyeHubPatch({grouped:true,aura:true,size:42,glow:'static',neonBrilliance:65,neonBloom:0,
   eyeAuraGap:0,auraRingGap:0});
  card._eyeHubOpen();
 });
 const panel=page.locator('#eye-hub-config');
 await panel.waitFor({state:'visible'});
 const stage=panel.locator('[data-preview=closed]');
 await stage.scrollIntoViewIfNeeded();
 const measures = [];
 for (const bloom of [0,25,50,75,100]) {
  await page.evaluate(neonBloom=>card._eyeHubPatch({neonBloom}),bloom);
  if (bloom===0||bloom===100) await stage.screenshot({path:path.join(output,view+"-bloom-"+bloom+".png")});
  measures.push(await stage.evaluate(node=>{
   const renderer=card._eyeHubState().neon;
   const surface=renderer.surfaces.find(s=>node.contains(s.host));
   return {width:node.querySelector('.eye-visual>img').getBoundingClientRect().width,
    radii:[...surface.rings.values()].map(r=>r.radius),
    halo:surface.wow?.canvas.getBoundingClientRect().width};
  }));
 }
 assert(measures[0].width>10);
 for (const row of measures) {
  assert.equal(row.width,measures[0].width);
  assert.deepEqual(row.radii,measures[0].radii);
 }
 assert(measures.at(-1).halo>measures[0].halo);
 await page.evaluate(()=>card._eyeHubPatch({eyeAuraGap:30,auraRingGap:8}));
 await panel.locator('[data-section=neon-studio]>summary').click();
 assert.equal(await panel.locator('[data-eye-key=eyeAuraGap]').inputValue(),'30');
 assert.equal(await panel.locator('[data-eye-key=auraRingGap]').inputValue(),'8');
 assert.match(await panel.locator('[data-eye-output=eyeAuraGap]').textContent(),/30 px/);
 await page.reload();
 await page.waitForFunction(()=>window.ready&&card._map);
 assert.deepEqual(await page.evaluate(()=>{
  const c=card._eyeHubState().config;
  return [c.eyeAuraGap,c.auraRingGap];
 }),[30,8]);
}

async function dragPanels(page) {
 const position = id => page.locator('#'+id).boundingBox();
 const saved = scope => page.evaluate(scope=>JSON.parse(localStorage.getItem('gewitterradar:premium-ui:v1:'+scope)||'{}').panelPosition,scope);
 const mapCenter = () => page.evaluate(()=>card._map.getCenter());
 for (const [id,scope,open,dx,dy] of [
  ['weather-wind-panel','wind-settings','_weatherWindOpen',-230,90],
  ['weather-temperature-panel','temperature-settings','_weatherTemperatureOpen',-130,170]
 ]) {
  await page.evaluate(open=>card[open](),open);
  const panel=page.locator('#'+id);
  await panel.waitFor({state:'visible'});
  const before=await position(id);
  const header=await panel.locator('header strong').boundingBox();
  const center=await mapCenter();
  await page.mouse.move(header.x+8,header.y+header.height/2);
  await page.mouse.down();
  await page.mouse.move(header.x+8+dx,header.y+header.height/2+dy,{steps:8});
  await page.mouse.up();
  const after=await position(id);
  assert(after.x < before.x-30 && after.y > before.y+25,JSON.stringify({id,before,after}));
  assert.deepEqual(await mapCenter(),center);
  const stored=await saved(scope);
  assert(stored.x>=0&&stored.x<=1&&stored.y>0&&stored.y<=1);
  const minimize=panel.locator('[data-premium-action=minimize]');
  await minimize.click();
  assert(await panel.evaluate(n=>n.classList.contains('minimized')));
  await minimize.click();
  assert.deepEqual(await saved(scope),stored);
  await panel.locator('[data-wind-action=close],[data-temperature-action=close]').click();
  await page.evaluate(open=>card[open](),open);
  assert(Math.abs((await position(id)).x-after.x)<2);
  await page.setViewportSize({width:660,height:470});
  await page.waitForFunction(id=>{
   const r=card.shadow.getElementById(id).getBoundingClientRect();
   return r.x>=0&&r.y>=0&&r.right<=innerWidth+.5&&r.bottom<=innerHeight+.5;
  },id);
  assert.deepEqual(await saved(scope),stored);
  await page.setViewportSize({width:1280,height:900});
 }
 assert.notDeepEqual(await saved('wind-settings'),await saved('temperature-settings'));
 const windPosition=await saved('wind-settings'),temperaturePosition=await saved('temperature-settings');
 await page.reload();
 await page.waitForFunction(()=>window.ready&&card._map);
 await page.evaluate(()=>{card._setMapDisplayMode('fullscreen',{persist:false});card._weatherTemperatureOpen();});
 assert.deepEqual(await saved('wind-settings'),windPosition);
 assert.deepEqual(await saved('temperature-settings'),temperaturePosition);
 const opacity=page.locator('#weather-temperature-panel [data-temperature-setting=opacity]');
 await opacity.press('End');
 assert.equal(await page.evaluate(()=>card._weatherTemperatureState().config.opacity),100);
 await page.evaluate(()=>{
  const map=card.shadow.getElementById('map-card');
  const slot=document.createElement('div');
  slot.id='embedded-fixture';
  map.append(slot);
  card._weatherWindOpen({container:slot});
 });
 assert(await page.locator('#weather-wind-panel').evaluate(n=>n.classList.contains('embedded')&&n.style.left===''));
}

(async()=>{
 const current=flowFixture({decorate}), previous=flowFixture({ref:reference,decorate});
 for (const f of [current,previous]) await new Promise(resolve=>f.server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 try {
  for (const [name,viewport,mobile] of [['desktop',{width:1280,height:900},false],['android',{width:393,height:851},true]]) {
   const prior=await pageFor(browser,previous,viewport,mobile);
   const baseline=await pixelsAndRadii(prior,{gap:0,spacing:0});
   await prior.context().close();
   const page=await pageFor(browser,current,viewport,mobile);
   const errors=[];
   page.on('pageerror', error=>errors.push(error.message));
   assert.deepEqual(await pixelsAndRadii(page,{gap:0,spacing:0}),baseline);
   const spaced=await pixelsAndRadii(page,{gap:30,spacing:8});
   assert(spaced.every(row=>row.size<=640&&row.extent>Math.max(...row.radii)));
   for(const row of spaced) row.radii.forEach((radius,index)=>assert(Math.abs(radius-baseline[0].radii[index]-30-index*8)<1e-9));
   assert(spaced.find(row=>row.glow==='living').bridges.length>0);
   assert(spaced.find(row=>row.glow==='living').transfers>0);
   await controls(page);
   await preview(page,name);
   if(!mobile) await dragPanels(page);
   else {
    await page.evaluate(()=>card._weatherTemperatureOpen());
    assert.equal(await page.locator('#weather-temperature-panel').evaluate(n=>n.style.left),'');
   }
   assert.deepEqual(errors,[]);
   console.log(name+': PASS V179 pixels and bridges, gap extremes, fixed Bloom projection, opacity endpoints and panel layout');
   await page.context().close();
  }
 } finally {await browser.close();for(const f of [current,previous])f.server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

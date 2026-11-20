/* Full actual card and module tree. Only Home Assistant/provider I/O is synthetic. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {flowFixture}=require('./flow-curves-browser-fixture.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const out=process.env.GR_MENU_OUTPUT||path.join(os.tmpdir(),'gr-menu-architecture-browser');fs.mkdirSync(out,{recursive:true});
const versionText=fs.readFileSync(path.join(__dirname,'../frontend/version.js'),'utf8'),version=versionText.match(/version:"([^"]+)"/)[1],set=versionText.match(/moduleSetId:"([^"]+)"/)[1];
const views=[['desktop',1440,1000,false],['android-small',320,568,true],['android-portrait',393,851,true],['android-landscape',851,393,true],['ipad-portrait',820,1180,true],['ipad-landscape',1180,820,true]];
const rootNames=['1. WEATHER-ENGINE','2. SPRACHE','3. STANDORT','4. KARTENDARSTELLUNG','5. EFFEKTE & ANIMATIONEN','6. RADIEN','7. DIAGNOSE TOOLS'];
const children=[['settings-calibration-section','7.1 KALIBRIERUNG'],['settings-weather-diagnostics-section','7.2 WEATHER-ENGINE'],['settings-data-sources-section','7.3 DATENQUELLEN & VERBINDUNGEN'],['settings-modules-section','7.4 MODULE & VERSIONEN']];
(async()=>{const f=flowFixture();await new Promise(r=>f.server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})}),results=[];
try{for(const [name,width,height,touch] of views){if(process.env.GR_MENU_VIEW&&process.env.GR_MENU_VIEW!==name)continue;
 for(const style of ['classic','modern']){
  console.log(name+'/'+style+': load full card');const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:1}),page=await context.newPage(),errors=[];
  page.setDefaultTimeout(15000);page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE',e.message);});await context.addInitScript(s=>localStorage.setItem('gr-settings-menu-style',s),style);await f.route(page);await page.goto('http://127.0.0.1:'+f.server.address().port);await page.waitForFunction(()=>window.ready&&card._map);assert(await page.evaluate(()=>registry.ok));
  const dialog=page.locator('#settings-dialog'),body=dialog.locator('.settings-body');
  const settled=()=>page.waitForFunction(()=>!card._settingsNavigationState().animating&&!card.shadow.querySelector('.gr-horizontal-transition'));
  const click=async loc=>{if(touch)await loc.tap();else await loc.click();await settled();};
  const open=async()=>{await page.evaluate(()=>card.shadow.getElementById('settings-open').click());await dialog.waitFor({state:'visible'});await settled();};
  const go=async id=>{await page.evaluate(id=>{if(!card._settingsNavigateTo(id))throw Error('Cannot navigate '+id);},id);await settled();};
  const pathNow=()=>page.evaluate(()=>card._settingsNavigationState().path);
  const bounds=async()=>{const b=await dialog.evaluate(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:e.clientWidth,scroll:e.scrollWidth,close:(()=>{const r=e.querySelector('#settings-close').getBoundingClientRect();return {top:r.top,bottom:r.bottom,right:r.right};})()};});assert(b.left>=-1&&b.right<=width+1,JSON.stringify(b));assert(b.scroll<=b.width+1,'horizontal overflow '+JSON.stringify(b));assert(b.close.top>=0&&b.close.bottom<=height+1&&b.close.right<=width+1,'close unreachable '+JSON.stringify(b));};
  await open();const startUrl=page.url();await bounds();
  assert.deepEqual((await dialog.locator('.gr-horizontal-root > [data-settings-target] .gr-horizontal-item-name').allTextContents()).map(s=>s.toUpperCase()),rootNames);
  assert.equal(await dialog.locator('.settings-footer-version > span').count(),2);assert.match(await dialog.locator('.settings-footer-version > span').nth(0).textContent(),new RegExp('^\\d{4}/\\d{2} · V'+version.replaceAll('.','\\.')+'$'));assert.equal(await dialog.locator('.settings-footer-version > span').nth(1).textContent(),'Modulsatz-ID: '+set);
  await page.evaluate(()=>{window.menuNodes=new Map([...card.shadow.querySelectorAll('#settings-dialog input,#settings-dialog select,#settings-dialog button[id]')].filter(n=>n.id).map(n=>[n.id,n]));});
  await click(dialog.locator('[data-settings-target=settings-diagnostic-section]'));assert.deepEqual(await pathNow(),['settings-diagnostic-section']);
  const submenu=dialog.locator('[data-settings-diagnostic-menu]');assert.deepEqual((await submenu.locator(':scope > [data-settings-target] .gr-horizontal-item-name').allTextContents()).map(s=>s.toUpperCase()),children.map(x=>x[1]));assert(!(await dialog.locator('.gr-horizontal-root').isVisible()));assert(!(await dialog.locator('.settings-premium-links').isVisible()));
  for(const [id,title] of children){
   if(style==='modern'&&id==='settings-weather-diagnostics-section'){
    await submenu.locator('[data-settings-target="'+id+'"]').click();
    const snapshot=await dialog.locator('.gr-horizontal-transition [data-settings-embedded="true"]').evaluate(e=>({position:getComputedStyle(e).position,display:getComputedStyle(e).display,head:getComputedStyle(e.querySelector('.we-diagnostic-head')).display}));
    assert.deepEqual(snapshot,{position:'static',display:'block',head:'none'},'embedded diagnostics stays a page in inert animated snapshot');await settled();
   }else await click(submenu.locator('[data-settings-target="'+id+'"]'));
   assert.deepEqual(await pathNow(),['settings-diagnostic-section',id]);assert.equal((await dialog.locator('#settings-dialog-title').textContent()).toUpperCase(),title);await bounds();
   assert.equal(await dialog.locator('.settings-body > details.settings-section:visible').count(),1,'one real page');
   assert(await page.evaluate(()=>[...menuNodes].every(([id,node])=>card.shadow.getElementById(id)===node)),'original control identity');
   const dup=await dialog.evaluate(e=>{const ids=[...e.querySelectorAll('[id]')].map(n=>n.id);return ids.filter((id,i)=>ids.indexOf(id)!==i);});assert.deepEqual(dup,[],'no cloned live IDs');
   if(id==='settings-weather-diagnostics-section'){
    assert.equal(await dialog.locator('#weather-engine-diagnostic-backdrop').count(),1);assert.equal(await dialog.locator('#weather-engine-diagnostic-backdrop').getAttribute('data-settings-embedded'),'true');assert(await dialog.locator('#weather-engine-check').isVisible());assert.equal(await page.locator('#weather-engine-diagnostic-backdrop .we-diagnostic-dialog').getAttribute('role'),'region');
    assert(await dialog.locator('#weather-engine-diagnostic-backdrop .we-diagnostic-body').isVisible(),'actual full diagnostics body remains visible');assert.equal(await dialog.locator('#weather-engine-diagnostic-backdrop').evaluate(e=>getComputedStyle(e).position),'static');assert(!(await dialog.locator('#weather-engine-diagnostic-backdrop .we-diagnostic-head').isVisible()));
    await body.evaluate(e=>e.scrollTop=Math.min(320,e.scrollHeight-e.clientHeight));const saved=await body.evaluate(e=>e.scrollTop);await click(dialog.locator('#gr-horizontal-back'));await click(submenu.locator('[data-settings-target="'+id+'"]'));assert(Math.abs(await body.evaluate(e=>e.scrollTop)-saved)<=2,'page scroll restored');
   }
   await click(dialog.locator('#gr-horizontal-back'));assert.deepEqual(await pathNow(),['settings-diagnostic-section']);
  }
  await click(dialog.locator('#gr-horizontal-back'));assert.deepEqual(await pathNow(),[]);await go('weather-engine-section');assert.equal(await dialog.locator('[data-weather-source-card]').count(),2);assert(!(await dialog.locator('#weather-engine-check').isVisible()));await bounds();
  const layout=await dialog.locator('#weather-engine-source-cards').evaluate(e=>{const c=[...e.children].map(x=>x.getBoundingClientRect());return {sameRow:Math.abs(c[0].top-c[1].top)<2,width:e.getBoundingClientRect().width};});assert.equal(layout.sameRow,width>460,'responsive source cards');
  await go('settings-aura-section');await click(dialog.locator('#gr-reference-arrival-zoom-button'));await click(page.locator('#gr-reference-arrival-zoom-dropdown [data-gr-menu-option="9"]'));await go('settings-radii-section');await go('settings-aura-section');assert.equal(await dialog.locator('#gr-reference-arrival-zoom-value').textContent(),'Zoomstufe 9');
  if(style==='modern'){
   await click(dialog.locator('#gr-menu-speed-button'));await click(page.locator('#gr-menu-speed-dropdown [data-gr-menu-option="Langsam"]'));assert.equal(await dialog.locator('#gr-menu-speed-value').textContent(),'Langsam');await go('settings-radii-section');await go('settings-aura-section');assert.equal(await dialog.locator('#gr-menu-speed-value').textContent(),'Langsam');
   await click(dialog.locator('#gr-menu-speed-button'));await click(page.locator('#gr-menu-speed-dropdown [data-gr-menu-option="Schnell"]'));
  }
  await go('settings-calibration-section');await page.goBack();await settled();assert.deepEqual(await pathNow(),['settings-diagnostic-section'],'browser back one level');assert.equal(page.url(),startUrl);
  await page.screenshot({path:path.join(out,name+'-'+style+'.png')});await click(dialog.locator('#settings-close'));assert(!(await dialog.isVisible()));await page.waitForTimeout(150);await open();assert.deepEqual(await pathNow(),[]);assert.equal(await page.evaluate(()=>card._settingsNavigationState().style),style);
  // Removing an open card tears down its one history listener and finite transition.
  await go('settings-diagnostic-section');await page.evaluate(()=>card.remove());
  assert.equal(await page.evaluate(()=>card._settingsNavigationState().listening),false);
  assert.equal(await page.evaluate(()=>card._settingsNavigationState().animating),false);
  await page.evaluate(()=>document.body.append(card));await page.waitForFunction(()=>card._settingsNavigationState().listening);await open();
  await go('settings-calibration-section');await page.goBack();await settled();assert.deepEqual(await pathNow(),['settings-diagnostic-section']);
  await click(dialog.locator('#settings-close'));await page.waitForTimeout(150);await page.reload();await page.waitForFunction(()=>window.ready&&card._map);await open();assert.equal(await page.evaluate(()=>card._settingsNavigationState().style),style);assert.equal(await page.evaluate(()=>localStorage.getItem('gr-reference-arrival-zoom')),'9');assert.deepEqual(errors,[]);
  results.push({name,style,passed:true,fullModuleTree:true,syntheticIO:true,physicalDeviceAcceptance:false});await context.close();console.log(name+'/'+style+': 7+4 navigation, forms, scroll, browser back, footer, status and persistence passed');
 }
}fs.writeFileSync(path.join(out,'menu-results.json'),JSON.stringify(results,null,2));}finally{await browser.close();f.server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

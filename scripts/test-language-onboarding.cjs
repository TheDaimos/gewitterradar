// Real browser checks for language confirmation before the existing About flow.
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),key='gewitterradar-language-onboarding-version',aboutKey='gewitterradar-about-onboarding-version';
const fixture=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#0b141c}#fixture{width:100%;max-width:1300px}</style><div id="fixture"></div><script type="module">
const params=new URLSearchParams(location.search);
await import(params.get('delivery')==='integration'?'/custom_components/gewitterradar/frontend/gewitterradar.js':'/dashboard/dist/gewitterradar.js');
window.calls=[];window.cards=[];window.fail=params.has('fail');window.defer=false;
const entity=params.get('entity')||'select.gewitterradar_language';
window.hass={language:params.get('ha')||'en',locale:params.has('locale')?{language:params.get('locale')}:undefined,config:{version:'test',unit_system:{length:'km'},latitude:0,longitude:0},themes:{theme:'dark'},states:params.has('missing')?{}:{[entity]:{state:params.get('chosen')||'English',attributes:{}}},callService:async(domain,service,data)=>{
 window.calls.push({domain,service,data});if(window.fail)throw Error('Service unavailable');
 if(window.defer)await new Promise(resolve=>window.finishWrite=resolve);
 window.hass={...window.hass,states:{...window.hass.states,[data.entity_id]:{state:data.option,attributes:{}}}};
 window.cards.forEach(card=>card.hass=window.hass);
}};
window.makeCard=()=>{const card=document.createElement('gewitterradar-card');card.setConfig(params.has('override')?{language_entity:entity}:{});window.cards.push(card);card.hass=window.hass;let host=document.querySelector('#fixture');if(params.has('preview')){const preview=document.createElement('hui-card-preview');host.append(preview);host=preview;}host.append(card);return card;};
window.card=window.makeCard();window.ready=true;
</script>`;
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/fixture'){res.setHeader('Content-Type','text/html');res.end(fixture);return;}
 const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.webp':'image/webp','.png':'image/png'})[path.extname(file)]||'text/plain');res.end(data);});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.argv[2],headless:true});
 const base='http://127.0.0.1:'+server.address().port;
 const out=process.argv[3];if(out)fs.mkdirSync(out,{recursive:true});
 const open=async(delivery,params={},options={})=>{
  const context=await browser.newContext({viewport:{width:900,height:850},...options});
  const page=await context.newPage();
  await page.goto(base+'/fixture?'+new URLSearchParams({delivery,...params}));await page.waitForFunction(()=>window.ready);
  return {context,page};
 };
 const confirm=async page=>{await page.getByRole('button',{name:'Weiter / Continue'}).click();await page.waitForFunction(()=>!window.card._languageOnboardingDialog);};
 try{
  for(const delivery of ['dashboard','integration']){
   for(const [locale,expected] of [['de','Deutsch'],['es-MX','Español'],['fr-FR','Français'],['ja-JP','English'],['de-DE','Deutsch'],['de_AT','Deutsch'],['de-CH','Deutsch'],['pt-BR','Português'],['nb-NO','Norsk bokmål'],['no','Norsk bokmål'],['bar','English']]){
    const {context,page}=await open(delivery,{locale});
    assert.equal(await page.locator('.language-onboarding input:checked').inputValue(),expected,locale);
    assert.equal(await page.locator('.about-dialog').count(),0);
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),null);
    assert.equal(await page.evaluate(()=>window.calls.length),0);
    await context.close();
   }
   console.log(delivery+': locale preselection PASS');
   // Public hass.language fallback and locale precedence, no browser-language inference.
   const {context,page}=await open(delivery,{ha:'fr-FR',locale:'es-MX'});
   assert.equal(await page.locator('.language-onboarding input:checked').inputValue(),'Español');
   await page.evaluate(()=>window.makeCard());assert.equal(await page.locator('.language-onboarding').count(),1);
   await page.keyboard.press('Escape');assert.equal(await page.locator('.language-onboarding').count(),1);
   await page.keyboard.press('Shift+Tab');assert.equal(await page.getByRole('button',{name:'Weiter / Continue'}).evaluate(n=>n===n.getRootNode().activeElement),true);
   await page.keyboard.press('Tab');assert.equal(await page.locator('.language-onboarding input:checked').evaluate(n=>n===n.getRootNode().activeElement),true);
   assert.equal(await page.locator('.language-onboarding input:checked').evaluate(n=>getComputedStyle(n).outlineStyle!=='none'),true);
   await page.getByRole('radio',{name:'English',exact:true}).check();
   // Explicit English is different from an unconfirmed English default.
   await page.evaluate(()=>window.defer=true);
   await page.getByRole('button',{name:'Weiter / Continue'}).click();
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),null);
   assert.equal(await page.locator('.about-dialog').count(),0);
   await page.evaluate(()=>window.finishWrite());
   await page.waitForFunction(()=>!window.card._languageOnboardingDialog);
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),'1');
   assert.equal(await page.evaluate(()=>window.card._languageValue()),'English');
   assert.deepEqual(await page.evaluate(()=>window.calls),[{domain:'select',service:'select_option',data:{entity_id:'select.gewitterradar_language',option:'English'}}]);
   assert.equal(await page.locator('.about-dialog').count(),1);
   assert.equal(await page.locator('.about-dialog h2').textContent(),'About Gewitterradar');
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),aboutKey),null);
   await page.reload();await page.waitForFunction(()=>window.ready);
   assert.equal(await page.locator('.language-onboarding').count(),0);
   assert.equal(await page.locator('.about-dialog').count(),1);
   await page.evaluate(()=>{window.hass={...window.hass,language:'de-DE',locale:{language:'de-DE'}};window.card.hass=window.hass;});
   assert.equal(await page.evaluate(()=>window.card._languageValue()),'English');assert.equal(await page.evaluate(()=>window.calls.length),0);
   await context.close();
   // Same write path for legacy helpers and explicit card overrides.
   for(const entity of ['input_select.lightning_detection_language','select.test_language']){
    const {context,page}=await open(delivery,{ha:'de-DE',entity,...(entity==='select.test_language'?{override:'1'}:{})});
    assert.equal(await page.locator('.language-onboarding input:checked').inputValue(),'Deutsch');
    await page.getByRole('radio',{name:'Boarisch',exact:true}).check();await confirm(page);
    assert.equal(await page.evaluate(()=>window.card._languageValue()),'Boarisch');
    assert.equal(await page.evaluate(()=>window.calls[0].data.entity_id),entity);
    assert.equal(await page.evaluate(()=>window.calls[0].domain),entity.split('.')[0]);
    await context.close();
   }
   // Failed/missing settings never acknowledge onboarding; retry succeeds.
   for(const mode of ['fail','missing']){
    const {context,page}=await open(delivery,{[mode]:'1',ha:'de'});
    await page.getByRole('button',{name:'Weiter / Continue'}).click();await page.locator('.language-error').filter({hasText:'Could not save'}).waitFor();
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),null);
    assert.equal(await page.locator('.about-dialog').count(),0);
    await page.evaluate(()=>{window.fail=false;window.hass.states['select.gewitterradar_language']={state:'English',attributes:{}};});
    await confirm(page);assert.equal(await page.locator('.about-dialog h2').textContent(),'Über Gewitterradar');
    await context.close();
   }
   // Preview exclusion and ownership release when a card is removed.
   const preview=await open(delivery,{preview:'1'});assert.equal(await preview.page.locator('dialog').count(),0);await preview.context.close();
   const detached=await open(delivery);await detached.page.evaluate(()=>{window.card.remove();window.card=window.makeCard();});assert.equal(await detached.page.locator('.language-onboarding').count(),1);await detached.context.close();
   const mobile=await open(delivery,{ha:'es'},{viewport:{width:320,height:568},hasTouch:true});
   assert.equal(await mobile.page.getByRole('radio').count(),19);
   for(const radio of await mobile.page.getByRole('radio').all()){
    await radio.scrollIntoViewIfNeeded();await radio.tap();
    assert.equal(await radio.isChecked(),true);
    assert.equal(await radio.evaluate(n=>{const r=n.getBoundingClientRect(),d=n.closest('dialog').getBoundingClientRect();return r.top>=d.top&&r.bottom<=d.bottom&&r.left>=d.left&&r.right<=d.right;}),true);
   }
   assert.equal(await mobile.page.locator('.language-onboarding').evaluate(d=>d.scrollWidth<=d.clientWidth&&d.getBoundingClientRect().bottom<=innerHeight),true);
   if(out&&delivery==='dashboard'){
    await mobile.page.getByRole('radio',{name:'Español',exact:true}).check();await mobile.page.locator('.language-options').evaluate(n=>n.scrollTop=0);
    await mobile.page.screenshot({path:path.join(out,'language-mobile.png')});
    const desktop=await open(delivery,{ha:'es'});await desktop.page.screenshot({path:path.join(out,'language-desktop.png')});await desktop.context.close();
   }
   await mobile.page.getByRole('button',{name:'Weiter / Continue'}).tap();await mobile.page.locator('.about-dialog').waitFor();await mobile.context.close();
   console.log(delivery+': locale/confirmation/reload/HA-change/write-path/failure/preview/ownership/keyboard/touch/mobile PASS');
  }
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
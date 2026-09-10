// Real browser checks for language confirmation before the existing About flow.
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),key='gewitterradar-language-onboarding-version',aboutKey='gewitterradar-about-onboarding-version';
const installations=new Map();
let installationId=0;
const fixture=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#0b141c}#fixture{width:100%;max-width:1300px}</style><div id="fixture"></div><script type="module">
const params=new URLSearchParams(location.search);
const delivery=params.get('delivery'),native=delivery==='integration';
await import(native?'/custom_components/gewitterradar/frontend/gewitterradar.js':'/dashboard/dist/gewitterradar.js');
window.calls=[];window.cards=[];window.fail=params.has('fail');window.defer=false;
const languages=['Deutsch','English','Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
const entity=params.get('entity')||(native?'select.gewitterradar_language':'input_select.lightning_detection_language');
const marker=params.get('marker')||(entity.startsWith('input_select.')?'input_boolean.lightning_detection_language_initialized':'switch.gewitterradar_language_initialized');
window.entity=entity;window.marker=marker;
if(params.has('oldLocal'))localStorage.setItem('gewitterradar-language-onboarding-version','1');
const globalState=await (await fetch('/global?'+params)).json();
const activeStates=params.has('missing')?{}:{[entity]:{state:globalState.language,attributes:{options:languages}},...(!params.has('missingMarker')?{[marker]:{state:globalState.initialized?'on':'off',attributes:{}}}:{})};
const staleNative=!native&&!params.has('missing')?{'select.gewitterradar_language':{state:'unavailable',attributes:{options:languages}},'switch.gewitterradar_language_initialized':{state:'unavailable',attributes:{}}}:{};
window.hass={language:params.get('ha')||'en',locale:params.has('locale')?{language:params.get('locale')}:undefined,config:{version:'test',unit_system:{length:'km'},latitude:0,longitude:0},themes:{theme:'dark'},states:{...staleNative,...activeStates},callService:async(domain,service,data)=>{
 const entityId=data?.entity_id,current=window.hass.states[entityId],entityDomain=String(entityId||'').split('.')[0];
 window.calls.push({domain,service,data});
 if(domain!==entityDomain||!current||['unknown','unavailable'].includes(current.state))throw Error('HA service target unavailable');
 const selecting=['select','input_select'].includes(domain)&&service==='select_option'&&Object.keys(data).sort().join()==='entity_id,option'&&current.attributes.options.includes(data.option);
 const toggling=['switch','input_boolean'].includes(domain)&&['turn_on','turn_off'].includes(service)&&Object.keys(data).join()==='entity_id';
 if(!selecting&&!toggling)throw Error('HA service contract mismatch');
 if(window.fail || (window.failMarker&&toggling&&service==='turn_on'))throw Error('Service unavailable');
 if(window.defer&&service==='select_option')await new Promise(resolve=>window.finishWrite=resolve);
 const nextState=selecting?data.option:service==='turn_on'?'on':'off';
 await fetch('/global?'+params,{method:'POST',body:JSON.stringify(selecting?{language:data.option}:{initialized:nextState==='on'})});
 window.hass={...window.hass,states:{...window.hass.states,[entityId]:{...current,state:nextState}}};
 window.cards.forEach(card=>card.hass=window.hass);
 return {context:{id:'strict-ha-service-response'}};
}};
window.makeCard=()=>{const card=document.createElement('gewitterradar-card');card.setConfig({...params.has('override')?{language_entity:entity}:{},...params.has('marker')?{language_initialized_entity:marker}:{}});window.cards.push(card);card.hass=window.hass;let host=document.querySelector('#fixture');if(params.has('preview')){const preview=document.createElement('hui-card-preview');host.append(preview);host=preview;}host.append(card);return card;};
window.card=window.makeCard();window.ready=true;
</script>`;
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/global'){
  const id=url.searchParams.get('installation');
  if(!installations.has(id))installations.set(id,{language:url.searchParams.get('chosen')||'English',initialized:false});
  const state=installations.get(id);res.setHeader('Content-Type','application/json');
  if(req.method==='POST'){let body='';req.on('data',chunk=>body+=chunk);req.on('end',()=>{Object.assign(state,JSON.parse(body));res.end(JSON.stringify(state));});}
  else res.end(JSON.stringify(state));return;
 }
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
  await page.goto(base+'/fixture?'+new URLSearchParams({delivery,installation:String(++installationId),...params}));await page.waitForFunction(()=>window.ready);
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
   const expectedEntity=delivery==='integration'?'select.gewitterradar_language':'input_select.lightning_detection_language';
   const expectedMarker=delivery==='integration'?'switch.gewitterradar_language_initialized':'input_boolean.lightning_detection_language_initialized';
   const german=await open(delivery,{ha:'de-DE'});
   assert.equal(await german.page.locator('.language-onboarding input:checked').inputValue(),'Deutsch');
   assert.deepEqual(await german.page.evaluate(()=>({language:window.card._languageEntity(),marker:window.card._languageInitializationEntity()})),{language:expectedEntity,marker:expectedMarker});
   await confirm(german.page);
   assert.equal(await german.page.evaluate(()=>window.card._languageValue()),'Deutsch');
   assert.equal(await german.page.locator('.language-error').count(),0);
   assert.deepEqual(await german.page.evaluate(()=>window.calls),[{domain:expectedEntity.split('.')[0],service:'select_option',data:{entity_id:expectedEntity,option:'Deutsch'}},{domain:expectedMarker.split('.')[0],service:'turn_on',data:{entity_id:expectedMarker}}]);
   await german.context.close();
   const introProfiles=[];
   for(const [profile,width,height,hasTouch] of [['desktop',900,850,false],['ipad-landscape',1024,768,true],['ipad-portrait',768,1024,true],['android-portrait',412,915,true],['android-landscape',915,412,true]]){
    const sample=await open(delivery,{ha:'en'},{viewport:{width,height},hasTouch});
    await sample.page.locator('.language-onboarding').waitFor();
    const metrics=await sample.page.evaluate(()=>{
     const dialog=window.card._languageOnboardingDialog,intro=dialog.querySelector('.language-intro'),options=dialog.querySelector('.language-options'),title=dialog.querySelector('h2'),style=getComputedStyle(intro),optionStyle=getComputedStyle(options);
     const number=value=>parseFloat(value)||0,lineWidths=[...intro.querySelectorAll(':scope > span')].flatMap(span=>{const range=document.createRange();range.selectNodeContents(span);const widths=[...range.getClientRects()].map(rect=>rect.width);range.detach();return widths;});
     return {fontSize:number(style.fontSize),lineHeight:number(style.lineHeight),titleFontSize:number(getComputedStyle(title).fontSize),introContentWidth:intro.clientWidth-number(style.paddingLeft)-number(style.paddingRight),optionsContentWidth:options.clientWidth-number(optionStyle.paddingLeft)-number(optionStyle.paddingRight),maxWidth:style.maxWidth,lineWidths,brCount:intro.querySelectorAll('br').length,overflow:dialog.scrollWidth>dialog.clientWidth||intro.scrollWidth>intro.clientWidth||options.scrollWidth>options.clientWidth,dialogBottom:dialog.getBoundingClientRect().bottom,viewportHeight:innerHeight};
    });
    assert.ok(metrics.fontSize>=13&&metrics.fontSize<=15&&metrics.lineHeight>=metrics.fontSize*1.4&&metrics.fontSize<metrics.titleFontSize,profile+' intro typography');
    assert.equal(metrics.maxWidth,'none',profile+' intro max-width');assert.equal(metrics.brCount,0,profile+' forced intro breaks');
    assert.ok(metrics.introContentWidth>=metrics.optionsContentWidth&&metrics.introContentWidth-metrics.optionsContentWidth<=20,profile+' intro/grid width');
    assert.equal(metrics.overflow,false,profile+' onboarding horizontal overflow');assert.ok(metrics.dialogBottom<=height+.5,profile+' onboarding viewport overflow');
    introProfiles.push({profile,...metrics});
    if(out&&delivery==='dashboard')await sample.page.screenshot({path:path.join(out,'language-'+profile+'.png')});
    await sample.context.close();
   }
   console.log(delivery+': onboarding readability '+JSON.stringify(introProfiles));
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
   assert.equal(await page.evaluate(()=>window.hass.states[window.card._languageInitializationEntity()].state),'on');
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),null);
   assert.equal(await page.evaluate(()=>window.card._languageValue()),'English');
   assert.deepEqual(await page.evaluate(()=>window.calls),[{domain:expectedEntity.split('.')[0],service:'select_option',data:{entity_id:expectedEntity,option:'English'}},{domain:expectedMarker.split('.')[0],service:'turn_on',data:{entity_id:expectedMarker}}]);
   assert.equal(await page.locator('.about-dialog').count(),1);
   assert.equal(await page.locator('.about-dialog h2').textContent(),'About Gewitterradar');
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),aboutKey),null);
   await page.reload();await page.waitForFunction(()=>window.ready);
   assert.equal(await page.locator('.language-onboarding').count(),0);
   assert.equal(await page.locator('.about-dialog').count(),1);
   await page.evaluate(()=>{window.hass={...window.hass,language:'de-DE',locale:{language:'de-DE'}};window.card.hass=window.hass;});
   assert.equal(await page.evaluate(()=>window.card._languageValue()),'English');assert.equal(await page.evaluate(()=>window.calls.length),0);
   await page.evaluate(()=>window.card._closeAbout(true,false));
   await page.evaluate(()=>window.hass.callService(window.marker.split('.')[0],'turn_off',{entity_id:window.marker}));
   assert.equal(await page.locator('.language-onboarding').count(),1);
   await page.reload();await page.waitForFunction(()=>window.ready);
   assert.equal(await page.locator('.language-onboarding').count(),1,'reset marker must reopen onboarding after reload');
   await context.close();
   // Two independent profiles share only the simulated HA installation, never storage.
   const first=await open(delivery,{ha:'es',oldLocal:'1'});
   assert.equal(await first.page.locator('.language-onboarding').count(),1,'old local marker cannot initialize HA');
   await first.page.getByRole('radio',{name:'Français',exact:true}).check();await confirm(first.page);
   const installation=new URL(first.page.url()).searchParams.get('installation');
   await first.page.evaluate(()=>window.card._closeAbout(true,false));
   const second=await open(delivery,{ha:'de-DE',installation});
   assert.equal(await second.page.locator('.language-onboarding').count(),0);
   assert.equal(await second.page.evaluate(()=>window.card._languageValue()),'Français');
   assert.equal(await second.page.locator('.about-dialog').count(),1);
   assert.equal(await second.page.evaluate(()=>window.calls.length),0);
   await first.page.reload();await first.page.waitForFunction(()=>window.ready);
   assert.equal(await first.page.locator('.language-onboarding').count(),0);
   assert.equal(await first.page.locator('.about-dialog').count(),0);
   await second.context.close();await first.context.close();
   const markerFailure=await open(delivery,{missingMarker:'1'});
   await markerFailure.page.getByRole('button',{name:'Weiter / Continue'}).click();
   await markerFailure.page.locator('.language-error').filter({hasText:'Could not save'}).waitFor();
   assert.equal(await markerFailure.page.evaluate(()=>window.calls.length),0);
   await markerFailure.context.close();
   const rejected=await open(delivery);
   await rejected.page.evaluate(()=>window.failMarker=true);
   await rejected.page.getByRole('button',{name:'Weiter / Continue'}).click();
   await rejected.page.locator('.language-error').filter({hasText:'Could not save'}).waitFor();
   assert.equal(await rejected.page.locator('.about-dialog').count(),0);
   assert.equal(await rejected.page.evaluate(()=>window.card._languageOnboardingComplete()),false);
   await rejected.context.close();
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
    await page.evaluate(()=>{window.fail=false;window.hass.states[window.entity]={state:'English',attributes:{options:[...window.card._languageOnboardingDialog.querySelectorAll('input')].map(input=>input.value)}};window.hass.states[window.marker]={state:'off',attributes:{}};window.cards.forEach(card=>card.hass=window.hass);});
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

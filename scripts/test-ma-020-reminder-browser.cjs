// MA-020: real Chromium contract, with mocked HA/Vault. Never touches HA data.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname==='/'){res.writeHead(200,{'Content-Type':'text/html'});res.end('<!doctype html><html lang="de"><body></body></html>');return;}
  const abs=path.resolve(root,'.'+pathname);
  if(!abs.startsWith(root+path.sep)||!fs.existsSync(abs)||fs.statSync(abs).isDirectory()){res.writeHead(404);res.end('not found');return;}
  res.setHeader('Content-Type',abs.endsWith('.js')?'text/javascript':'text/plain');res.end(fs.readFileSync(abs));
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:390,height:800}});
 const page=await context.newPage();
 try{
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.evaluate(async()=>{
    const module=await import('/frontend/modules/monitored-areas/index.js');
    const settings=new Map(),calls=[];
    const vault={keys:new Set([module.CLEANUP_DISMISSED]),profile:{id:'profile-1'},
      getItem:k=>settings.get(k)||null,
      setItem:(k,v)=>{settings.set(k,v);},
      removeItem:k=>{settings.delete(k);},
      flush:async()=>true};
    const hass={user:{id:'actor-1'},states:{[module.LEGACY_LIST]:{state:'0'}},
      callWS:async req=>{calls.push(req);return {capabilities:{saved_places_mode:'db_active'}};}};
    window.fixture={module,settings,vault,hass,calls,owners:[]};
    window.start=()=>{
      const shadow=document.createElement('div');document.body.append(shadow);
      const owner={isConnected:true,shadow,hass,_settingsVault:vault,_languageValue:()=>'Deutsch'};
      window.fixture.owners.push(owner);
      module.initializeMonitoredAreas(owner,true);return owner;
    };
    window.stop=()=>{
      const owner=window.fixture.owners.at(-1);
      module.initializeMonitoredAreas(owner,true).teardown();
      owner.shadow.remove();
    };
    window.start();
  });
  const dlg=page.locator('dialog.gr-ma-cleanup');
  await dlg.waitFor({state:'visible'});
  assert.match(await dlg.innerText(),/GewitterRadar Orte/);
  assert.equal(await dlg.locator('li').count(),6);
  await dlg.locator('input[type=checkbox]').check();
  await dlg.locator('.ma-confirm').click();
  await dlg.waitFor({state:'detached'});
  assert.equal(await page.evaluate(()=>window.fixture.settings.get('gewitterradar-ma020-cleanup-dismissed')),'1');

  await page.evaluate(()=>{window.stop();window.start();});
  await page.waitForTimeout(200);
  assert.equal(await page.locator('dialog.gr-ma-cleanup').count(),0,'dismissed start must stay silent');
  await page.evaluate(()=>window.fixture.owners.at(-1)._openMigrationCleanupHelp());
  await dlg.waitFor({state:'visible'});
  assert.equal(await dlg.locator('input[type=checkbox]').isChecked(),true);
  await dlg.locator('input[type=checkbox]').uncheck();
  await dlg.locator('.ma-confirm').click();
  await dlg.waitFor({state:'detached'});
  assert.equal(await page.evaluate(()=>window.fixture.settings.has('gewitterradar-ma020-cleanup-dismissed')),false);

  await page.evaluate(()=>{window.stop();window.start();});
  await dlg.waitFor({state:'visible'});
  await dlg.locator('.ma-close').click();
  await dlg.waitFor({state:'detached'});
  await page.evaluate(()=>{window.stop();window.start();});
  await dlg.waitFor({state:'visible'}); // closing without checkbox does not persist dismissal
  await page.evaluate(()=>{window.stop();delete window.fixture.hass.states['todo.gewitterradar_orte'];window.start();});
  await page.waitForTimeout(250);
  assert.equal(await dlg.count(),0,'removed list must suppress reminder');
  assert.ok(await page.evaluate(()=>window.fixture.calls.length)>=4);
  console.log('MA-020 real Chromium: startup, Vault dismissal, manual reopening, re-enable, removed-list PASS');
 }finally{await context.close();await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});

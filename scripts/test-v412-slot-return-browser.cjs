/* Focused UI smoke: real frontend, synthetic HA/WR; mobile/tablet are emulations. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {temperatureFixture}=require('./temperature-browser-fixture.cjs');
const out=process.env.GR_SLOT_RETURN_EVIDENCE||path.resolve('.task412-return/evidence');fs.mkdirSync(out,{recursive:true});
const nasa=JSON.parse(fs.readFileSync('tests/fixtures/legend-nasa-native-4129.json','utf8'));
const {readFileSync}=fs,{randomUUID}=require('node:crypto');
const legacy = JSON.parse(readFileSync(path.join(__dirname, '../tests/settings-vault-v181.json'), 'utf8'));
const build = readFileSync(path.join(__dirname, '../frontend/version.js'), 'utf8').match(/version:"([^"]+)"/)[1];
const EYE = 'gewitterradar:eye-bubble:v1';
const SYNOPTIC = 'gewitterradar:synoptic-ui:v1';
const CLOUDS = 'gewitterradar:clouds-ui:v1';
const HUB = 'gewitterradar:legend-hub:v1';
// Use the actual current server key contract, not the historical V181 subset.
const vaultSchema=JSON.parse(require('node:child_process').execFileSync('python',['-X','utf8','-c',"import runpy,json;m=runpy.run_path('custom_components/gewitterradar/vault_schema.py');print(json.dumps({'keys':m['SETTINGS_KEYS'],'json':list(m['JSON_SETTINGS'])}))"],{encoding:'utf8'}));
const settingsKeys=vaultSchema.keys,jsonKeys=vaultSchema.json;
const mock = {profiles: {}, migrationIssues: new Map(), receipts: new Map(), log: [], offline: false, deferGet: null, loseCreateReply: false};

const view = profile => Object.fromEntries(Object.entries(profile).filter(([key]) => key !== 'settings'));
const decode = (key, raw) => jsonKeys.includes(key) ? JSON.parse(raw) : raw;
function serverCall(user, message) {
  return (async () => {
    const op = message.type.split('/').at(-1);
    assert.equal(message.schema, 1);
    assert.match(message.build,/^4\.(?:12|13)\./);
    mock.log.push({user, op, request: message.request});
    if (mock.offline) return {error: 'disconnected'};
    const request = message.request;
    const profiles = mock.profiles[user] ||= {};
    if (op === 'get') {
      if (mock.deferGet) await mock.deferGet;
      const profile = profiles[request.profileId];
      if (request.profileId && !profile) return {error: 'settings_not_found'};
      return {
        schema: 1, settingsKeys, jsonSettingsKeys: jsonKeys,
        recovery: false, profiles: Object.values(profiles).map(view), profile,
        migrationIssues: mock.migrationIssues.get(request.profileId) || [],
      };
    }
    if (op === 'migration_preview') return {keys: Object.keys(request.legacy), issues: []};
    if (op === 'create' || op === 'copy') {
      const receipt = user + ':' + request.requestId;
      if (mock.receipts.has(receipt)) return {profile: profiles[mock.receipts.get(receipt)]};
      const id = randomUUID().replaceAll('-', '');
      const settings = op === 'copy' ? profiles[request.profileId].settings : Object.fromEntries(
        Object.entries(request.legacy || {}).map(([key, value]) => [key, decode(key, value)]),
      );
      const profile = {id, name: request.name, revision: 1, updatedAt: new Date().toISOString(), settings};
      profiles[id] = structuredClone(profile);
      mock.receipts.set(receipt, id);
      if (mock.loseCreateReply) {
        mock.loseCreateReply = false;
        return {error: 'settings_storage'};
      }
      return {profile};
    }
    if (op === 'patch') {
      const profile = profiles[request.profileId];
      if (!profile) return {error: 'settings_not_found'};
      for (const [key, pair] of Object.entries(request.changes)) {
        if (pair.after === null) delete profile.settings[key];
        else profile.settings[key] = decode(key, pair.after);
      }
      profile.revision++;
      return {profile};
    }
    return {error: 'unknown_command'};
  })();
}

async function install(page){await page.evaluate(async nasa=>{card._setMapDisplayMode('fullscreen',{persist:false});const revision=(await import('/frontend/version.js')).APPLICATION_RELEASE.runtimeRevision;window.prefs=await import('/frontend/modules/weather/legend-preferences.js?v='+revision);window.views=await import('/frontend/modules/weather/legend-hub-view.js?v='+revision);window.scales=await import('/frontend/modules/weather/legend-overlay.js?v='+revision);window.showOnly=id=>{for(const kind of ['precipitation','wind','temperature','advection','synoptic','other'])prefs.patchLegend(card,kind,{mode:kind===id?'on':'off'});};const layers=[{source_id:'dwd/radar_precipitation',semantics:{quantity:'precipitation_rate',unit:'mm/h'},legend:{title:'DWD / OPERA Â· Radar-Niederschlag',entries:scales.PRECIPITATION_LEGEND_ENTRIES},times:{valid_at:'2026-11-23T11:00:00Z'},attribution:'DWD'}, {source_id:'nasa_gibs/imerg',semantics:{quantity:'precipitation_rate',unit:'mm/h'},legend:{title:'NASA IMERG',scales:nasa.scales},attribution:'<a href="https://www.earthdata.nasa.gov/data/tools/gibs">NASA EOSDIS GIBS</a>',times:{valid_at:'2026-11-23T09:00:00Z'}}];card._weatherRadarState().v2Snapshot={layers};card._weatherLegendSetModel('precipitation',{family:'precipitation',title:'Niederschlag',scales:scales.precipitationLegendScales(layers,card._t.bind(card)),priority:100});showOnly('precipitation');},nasa);}
async function boot(browser,ref,width,height,touch){const user=randomUUID(),f=temperatureFixture({ref,decorate:html=>html.replace('card.hass={states:',"card.hass={user:{id:window.testUser},auth:{},connection:Object.assign(new EventTarget(),{connected:true,sendMessagePromise:query=>card.hass.callWS(query)}),connected:true,states:").replace('callWS:async query=>{',"callWS:async query=>{if(query.type.startsWith('gewitterradar/settings/')){const result=await window.settingsVaultTestCall(query);if(result.error)throw Object.assign(new Error(result.error),{code:result.error});return result;}")});await new Promise(r=>f.server.listen(0,'127.0.0.1',r));const context=await browser.newContext({viewport:{width,height},hasTouch:touch,deviceScaleFactor:1}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await context.addInitScript(user=>window.testUser=user,user);await page.exposeFunction('settingsVaultTestCall',q=>serverCall(user,q));await f.route(page);await page.goto('http://127.0.0.1:'+f.server.address().port);await page.getByRole('button',{name:'Mit Standardeinstellungen starten',exact:true}).click();await page.getByRole('button',{name:'Profil erstellen',exact:true}).click();await page.waitForFunction(()=>window.ready&&card._mapReady&&card.__proBranding?.eyeReady);await install(page);return {page,context,errors,async close(){await context.close();f.server.closeAllConnections();await new Promise(r=>f.server.close(r));}};}


const shot=(page,name)=>page.screenshot({path:path.join(out,name+'.png')});
const original='2557a7394060be686456597484d9779179ec6e59';
async function openHub(page){if(await page.locator('.lh-popout').evaluate(n=>n.hidden))await page.locator('.lh-main').click();await page.locator('.lh-popout').evaluate(n=>Promise.all(n.getAnimations().map(a=>a.finished.catch(()=>{}))));await page.locator('.lh-slot img').evaluateAll(ns=>Promise.all(ns.map(n=>n.decode())));}
async function setup(page,initialize=true){await page.evaluate(async initialize=>{card._closeAbout(true,false);const v=(await import('/frontend/version.js')).APPLICATION_RELEASE.runtimeRevision;window.prefs=await import('/frontend/modules/weather/legend-preferences.js?v='+v);window.views=await import('/frontend/modules/weather/legend-hub-view.js?v='+v);card._settingsVault.delay=5000;if(initialize)prefs.saveLegendHub(card,{slots:['precipitation','wind','temperature','advection','synoptic','other'],direction:'horizontal',autoClose:false,position:{x:.1,y:.25}});window.slotIdentity=[...card.__legendHub.popout.children];},initialize);await openHub(page);}
async function snapshot(page){return page.locator('.lh-popout').evaluate(popout=>{const p=popout.getBoundingClientRect(),s=card.__legendHub;return {order:[...s.config.slots],stored:JSON.parse(card._settingsVault.getItem('gewitterradar:legend-hub:v1')).slots,popout:{left:p.x,top:p.y,width:p.width,height:p.height},slots:[...popout.children].map((b,i)=>{const r=b.getBoundingClientRect(),clip=Math.max(0,Math.min(r.right,p.right)-Math.max(r.left,p.left))*Math.max(0,Math.min(r.bottom,p.bottom)-Math.max(r.top,p.top));return {id:b.dataset.legendId,connected:b.isConnected,same:b===slotIdentity[i],left:b.style.left,top:b.style.top,bottom:b.style.bottom,visibleRatio:clip/(r.width*r.height),image:b.querySelector('img')?.complete,pressed:b.getAttribute('aria-pressed'),dragging:b.classList.contains('dragging'),active:!!s.slotOptions[i]?.state().eyeDrag};}),gesture:!!card._weatherControlGesture,eye:JSON.stringify(card._eyeHubState().config),map:{center:card._map.getCenter(),zoom:card._map.getZoom()}};});}
async function assertPresent(page,order,identity=true){const s=await snapshot(page);assert.deepEqual(s.order,order);assert.deepEqual(s.stored,order);assert.equal(s.slots.length,order.length);assert(s.slots.every(n=>n.connected&&n.image&&n.visibleRatio>.98&&!n.left&&!n.top&&!n.bottom&&!n.dragging&&!n.active&&(!identity||n.same)),JSON.stringify(s));assert.equal(s.gesture,false);return s;}
async function pull(page,id,touch,finish='up'){const slot=page.locator('.lh-slot[data-legend-id='+id+']'),b=await slot.boundingBox(),from={x:b.x+b.width/2,y:b.y+b.height/2},to={x:Math.min(page.viewportSize().width-25,from.x+230),y:Math.min(page.viewportSize().height-90,from.y+210)};if(touch){const input=await page.context().newCDPSession(page);await input.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...from,id:1}]});for(let i=1;i<=6;i++)await input.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*i/6,y:from.y+(to.y-from.y)*i/6,id:1}]});await input.send('Input.dispatchTouchEvent',{type:finish==='cancel'?'touchCancel':'touchEnd',touchPoints:[]});await input.detach();}else{await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:6});if(finish==='cancel')await page.evaluate(()=>{const d=card._weatherControlGesture?.drag;if(d)d.eye.dispatchEvent(new PointerEvent('pointercancel',{pointerId:d.pointerId,pointerType:'mouse',isPrimary:true,bubbles:true,composed:true}));});if(finish==='capture')await page.evaluate(()=>{const d=card._weatherControlGesture?.drag;if(d?.eye.hasPointerCapture(d.pointerId))d.eye.releasePointerCapture(d.pointerId);});if(finish==='capture')await page.mouse.move(to.x+1,to.y+1);await page.mouse.up();}await page.evaluate(()=>new Promise(requestAnimationFrame));}
async function fallbackTouch(page,id,cancel){await page.locator('.lh-slot[data-legend-id='+id+']').evaluate((b,cancel)=>{const r=b.getBoundingClientRect(),t=new Touch({identifier:71,target:b,clientX:r.x+24,clientY:r.y+24}),m=new Touch({identifier:71,target:b,clientX:r.x+190,clientY:r.y+150});for(const [type,touches,changed]of [['touchstart',[t],[t]],['touchmove',[m],[m]],[cancel?'touchcancel':'touchend',[],[m]]])b.dispatchEvent(new TouchEvent(type,{touches,targetTouches:touches,changedTouches:changed,bubbles:true,composed:true,cancelable:true}));},cancel);await page.evaluate(()=>new Promise(requestAnimationFrame));}
async function settle(page){await page.evaluate(()=>card._settingsVault.flush());try{await page.waitForFunction(()=>!card._settingsVault.dirty&&card._settingsVault.status==='saved',null,{timeout:7000});}catch(error){console.error(await page.evaluate(()=>{const v=card._settingsVault;return {status:v.status,error:String(v.error),dirty:v.dirty,pending:v.pending,batch:v.batch,profile:v.profileId};}));throw error;}}
async function reload(page){await page.reload();await page.waitForFunction(()=>window.ready&&card._mapReady&&card.__legendHub);await setup(page,false);}
const closeDialog=async page=>{await page.locator('[data-lh-close]').click();await page.locator('.lh-dialog').waitFor({state:'detached'});};
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})}),results=[];try{
 if(!process.env.GR_SLOT_RETURN_SKIP_BEFORE){const f=await boot(browser,original,1280,900,false);try{await setup(f.page);const before=await snapshot(f.page);await pull(f.page,'wind',false);const broken=await snapshot(f.page);assert(broken.slots.some(n=>n.id==='wind'&&n.visibleRatio<.01&&n.left&&n.top),'historical bug must actually reproduce');assert.deepEqual(broken.order,before.order);assert.deepEqual(broken.stored,before.stored);assert(broken.slots.every(n=>n.connected&&n.same),'icon is not detached or removed');await shot(f.page,'before-lost-slot');await f.page.evaluate(()=>views.openHubConfig(card));await f.page.locator('[data-lh-move="0"][data-delta="1"]').click();await closeDialog(f.page);const recovered=await snapshot(f.page);assert(recovered.slots.every(n=>n.visibleRatio>.98&&!n.left&&!n.top));results.push({baseline:'4.12.13',source:original,before,broken,recovered});console.log('PASS historical lost-slot reproduction and reorder recovery');}finally{await f.close();}}
 if(process.env.GR_SLOT_RETURN_BEFORE_ONLY){fs.writeFileSync(path.join(out,'slot-return-results.json'),JSON.stringify(results,null,2)+'\n');return;}
 for(const [name,width,height,touch]of [['desktop',1280,900,false],['tablet',1024,768,true],['android',393,851,true]]){if(process.env.GR_SLOT_RETURN_SCENARIOS&&!process.env.GR_SLOT_RETURN_SCENARIOS.split(',').includes(name))continue;const f=await boot(browser,null,width,height,touch),{page}=f;try{await setup(page);const initial=await snapshot(page),order=initial.order,cases=[];for(const finish of touch?['up','cancel']:['up','cancel','capture']){for(const id of order){await pull(page,id,touch,finish);const state=await assertPresent(page,order);assert.deepEqual(state.map,initial.map);assert.equal(state.eye,initial.eye);assert.deepEqual(state.slots.map(n=>n.pressed),initial.slots.map(n=>n.pressed),'invalid drag never toggles a legend');}cases.push(finish);}
  if(touch)for(const cancel of [false,true]){await fallbackTouch(page,'wind',cancel);await assertPresent(page,order);}
  for(let i=0;i<8;i++){await pull(page,order[i%order.length],touch,i%3===0?'cancel':'up');await assertPresent(page,order);}
  for(const direction of ['vertical','dynamic','horizontal']){await page.evaluate(direction=>{card.__legendHub.locked=null;prefs.saveLegendHub(card,{direction});},direction);await openHub(page);await pull(page,'temperature',touch);await assertPresent(page,order);}
  await page.evaluate(()=>prefs.saveLegendHub(card,{autoClose:true}));await pull(page,'wind',touch);await openHub(page);await assertPresent(page,order);await page.evaluate(()=>prefs.saveLegendHub(card,{autoClose:false}));
  await page.locator('.lh-main').click();await page.locator('.lh-main').click();await openHub(page);await assertPresent(page,order);
  // Regular tap and long press still use the original protected binder.
  const wind=page.locator('.lh-slot[data-legend-id=wind]'),pressed=await wind.getAttribute('aria-pressed');if(touch)await wind.tap();else await wind.click();assert.notEqual(await wind.getAttribute('aria-pressed'),pressed);if(touch)await wind.tap();else await wind.click();const box=await wind.boundingBox(),point={x:box.x+24,y:box.y+24};if(touch){const input=await f.context.newCDPSession(page);await input.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await page.waitForTimeout(750);await input.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await input.detach();}else{await page.mouse.move(point.x,point.y);await page.mouse.down();await page.waitForTimeout(750);await page.mouse.up();}await page.locator('.lh-dialog').waitFor();await closeDialog(page);await assertPresent(page,order);if(name!=='tablet')await shot(page,name+'-after-repeated-drags');
  await page.evaluate(()=>views.openHubConfig(card));const rows=page.locator('[data-lh-row]');let expected;if(!touch){await rows.nth(0).locator('span[draggable=true]').dragTo(rows.nth(2).locator('span[draggable=true]'));expected=[order[2],order[1],order[0],...order.slice(3)];}else{await page.locator('[data-lh-move="0"][data-delta="1"]').tap();expected=[order[1],order[0],...order.slice(2)];}await closeDialog(page);await page.evaluate(()=>window.slotIdentity=[...card.__legendHub.popout.children]);await assertPresent(page,expected);await pull(page,'wind',touch);await assertPresent(page,expected);await settle(page);const profileA=await page.evaluate(()=>card._settingsVault.profileId);await reload(page);await assertPresent(page,expected);
  if(name!=='tablet'){await settle(page);const profileB=await page.evaluate(async()=>{const v=card._settingsVault;return (await v.create('copy',{profileId:v.profileId,name:'Slot return B'},{activate:false})).id;});await settle(page);await page.evaluate(id=>card._settingsVault.choose(id),profileB);await reload(page);await page.evaluate(()=>views.openHubConfig(card));await page.locator('[data-lh-move="0"][data-delta="1"]').click();await closeDialog(page);await page.evaluate(()=>window.slotIdentity=[...card.__legendHub.popout.children]);const b=[expected[1],expected[0],...expected.slice(2)];await assertPresent(page,b);await pull(page,'wind',touch,'cancel');await assertPresent(page,b);await settle(page);await page.evaluate(id=>card._settingsVault.choose(id),profileA);await reload(page);await assertPresent(page,expected);await pull(page,'wind',touch);await assertPresent(page,expected);}
  if(name==='desktop'){
   await page.evaluate(()=>{prefs.saveLegendHub(card,{slots:['moon',...card.__legendHub.config.slots],extraPositions:{...card.__legendHub.config.extraPositions,moon:{x:.72,y:.21}},moonUi:{phasesExpanded:false,scaleMode:'manual',scalePercent:75,frameMaterial:'gold',glass:'mineral',reflections:false,aura:23}});prefs.patchLegend(card,'moon',{mode:'on'});});
   await settle(page);await reload(page);await page.waitForFunction(()=>card.__grMoon?.open);
   assert.deepEqual(await page.evaluate(()=>({slot:card.__legendHub.config.slots[0],mode:card.__legendHub.config.legends.moon.mode,position:card.__legendHub.config.extraPositions.moon})),{slot:'moon',mode:'on',position:{x:.72,y:.21}},'authenticated Moon reload');
   assert.deepEqual(await page.evaluate(()=>card.__legendHub.config.moonUi),{phasesExpanded:false,scaleMode:'manual',scalePercent:75,frameMaterial:'gold',glass:'mineral',reflections:false,aura:23},'authenticated Moon scale and accordion reload');
   const moonProfileA=await page.evaluate(()=>card._settingsVault.profileId),moonProfileB=await page.evaluate(async()=>{const v=card._settingsVault;return (await v.create('copy',{profileId:v.profileId,name:'Moon position B'},{activate:false})).id;});
   await page.evaluate(id=>card._settingsVault.choose(id),moonProfileB);await reload(page);
   await page.evaluate(()=>{prefs.saveLegendHub(card,{extraPositions:{...card.__legendHub.config.extraPositions,moon:{x:.1,y:.9}},moonUi:{phasesExpanded:true,scaleMode:'auto',scalePercent:100}});prefs.patchLegend(card,'moon',{mode:'off'});});await settle(page);
   await page.evaluate(id=>card._settingsVault.choose(id),moonProfileA);await reload(page);await page.waitForFunction(()=>card.__grMoon?.open);
   assert.deepEqual(await page.evaluate(()=>card.__legendHub.config.extraPositions.moon),{x:.72,y:.21},'Moon position isolated across authenticated profiles');
   assert.equal(await page.evaluate(()=>card.__legendHub.config.legends.moon.mode),'on');
   assert.deepEqual(await page.evaluate(()=>card.__legendHub.config.moonUi),{phasesExpanded:false,scaleMode:'manual',scalePercent:75,frameMaterial:'gold',glass:'mineral',reflections:false,aura:23},'Moon scale and accordion isolated between authenticated profiles');
   await page.locator('.gr-moon-close').click();await settle(page);
  }
  assert.deepEqual(f.errors,[]);results.push({name,width,height,touchEmulation:touch,order,cases,allSix:true,rapidPulls:8,layouts:['vertical','dynamic','horizontal'],fallbackTouch:touch,domIdentity:true,orderUnchangedOnInvalidDrop:true,eyeAndMapUnchanged:true,closeReopen:true,tapAndLongPress:true,editorReorder:!touch?'native HTML drag/drop':'touch arrow',reload:true,profiles:name!=='tablet',authenticatedMoonProfiles:name==='desktop',errors:f.errors});console.log('PASS slot return '+name);
 }finally{await f.close();}}
 }finally{await browser.close();}fs.writeFileSync(path.join(out,'slot-return-results.json'),JSON.stringify(results,null,2)+'\n');})().catch(e=>{console.error(e);process.exitCode=1;});

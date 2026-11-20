const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {chromium} = require('playwright');
const {fixture} = require('./wind-perf-browser-fixture.cjs');

const EYE = 'gewitterradar:eye-bubble:v1';
const PROFILE_A = 'a'.repeat(32), PROFILE_B = 'b'.repeat(32);
const schema = JSON.parse(execFileSync('python', ['-B','-c',
  'import importlib.util,json;s=importlib.util.spec_from_file_location("schema","custom_components/gewitterradar/vault_schema.py");m=importlib.util.module_from_spec(s);s.loader.exec_module(m);print(json.dumps({"keys":m.SETTINGS_KEYS,"json":list(m.JSON_SETTINGS)}))',
], {encoding:'utf8'}));
const profiles = new Map([PROFILE_A,PROFILE_B].map((id,index) => [id, {
  id,name:'Phone '+index,revision:1,settings:{'gewitterradar-about-onboarding-version':'1'},
}]));
const helperStates = {
  'switch.gewitterradar_map_grouping':{state:'on'},
  'switch.gewitterradar_warning_animation':{state:'on'},
  'number.gewitterradar_observation_radius':{state:'1000',attributes:{min:1,max:20000,step:1}},
  'number.gewitterradar_storm_radius':{state:'250',attributes:{min:1,max:1000,step:1}},
  'number.gewitterradar_danger_radius':{state:'10',attributes:{min:1,max:1000,step:1}},
};

function initialize(states) {
  window.testStates = states;
  const slot = encodeURIComponent(JSON.stringify(['android-ui-test','','']));
  const key = 'gewitterradar:vault:v1:binding:'+slot;
  if (!localStorage.getItem(key)) localStorage.setItem(key,'a'.repeat(32));
  window.changeTestSetting = async (domain,service,data) => {
    const next = service === 'turn_on' ? 'on' : service === 'turn_off' ? 'off' : String(data.value ?? data.option);
    const previous = card.hass.states[data.entity_id];
    window.testStates[data.entity_id] = {...previous,state:next};
    await persistTestHelper(data.entity_id,window.testStates[data.entity_id]);
    card.hass = {...card.hass,states:{...card.hass.states,[data.entity_id]:testStates[data.entity_id]}};
  };
}

async function run() {
  const fixtureServer = fixture({delivery:'custom_components/gewitterradar/frontend',extendHtml:html => html
    .replace('background:#121b24','background:#121b24;font-family:system-ui')
    .replace('card.hass={states:{', "window.testStates=await loadTestHelpers();card.hass={user:{id:'android-ui-test',name:'Test'},states:{...window.testStates,")
    .replace('callService:async()=>{}', 'callService:window.changeTestSetting')
    .replace('callWS:async query=>{', "callWS:async query=>{if(query.type.startsWith('gewitterradar/settings/'))return testVault(query);")});
  await new Promise(resolve => fixtureServer.server.listen(0,'127.0.0.1',resolve));
  let browser;
  const results = [];
  try {
    browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
    const context = await browser.newContext({viewport:{width:393,height:851},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror',error => errors.push(error.message));
    await page.exposeFunction('persistTestHelper',(key,state) => { helperStates[key] = state; });
    await page.exposeFunction('loadTestHelpers',() => helperStates);
    await page.exposeFunction('testVault',({type,request}) => {
      const profile = profiles.get(request.profileId);
      assert(profile,type);
      if(type.endsWith('/patch')){
        for(const [key,{after}] of Object.entries(request.changes)){
          if(after===null)delete profile.settings[key];
          else profile.settings[key]=schema.json.includes(key)?JSON.parse(after):after;
        }
        profile.revision++;
      }else assert(type.endsWith('/get'),type);
      return {schema:1,settingsKeys:schema.keys,jsonSettingsKeys:schema.json,recovery:false,profiles:[...profiles.values()],profile};
    });
    await context.addInitScript(initialize,helperStates);
    await fixtureServer.route(page);
    const url = 'http://127.0.0.1:'+fixtureServer.server.address().port;
    await page.goto(url);
    const loaded = () => page.waitForFunction(() => window.card?._mapReady && card._weatherStormAvailable());
    await loaded();
    const panel = page.locator('#weather-storm-panel');
    const field = name => panel.locator(`[data-storm-setting=${name}]`);
    for(const width of [320,360,393,430])for(const landscape of [false,true]){
      const viewport = landscape ? {width:851,height:width} : {width,height:851};
      await page.setViewportSize(viewport);
      await page.evaluate(() => {card._setMapDisplayMode('fullscreen',{persist:false});card._weatherStormOpen();});
      for(const detail of await panel.locator('details').all()){
        if(!await detail.getAttribute('open')){
          if(!await detail.evaluate(node => node.open)) await detail.locator('summary').tap();
        }
        await detail.locator('summary').tap();
        await page.waitForFunction(() => !card.shadow.querySelector('#weather-storm-panel .gr-closing'));
        assert.equal(await detail.evaluate(node => node.open),false);
        await detail.locator('summary').tap();
      }
      const geometry = await panel.evaluate(node => {
        const collisions=[],overflows=[];
        const rect = el => el.getBoundingClientRect();
        for(const label of node.querySelectorAll('label')){
          const parts = [...label.children].map(rect);
          for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++){
            const a=parts[i],b=parts[j];
            if(a.left<b.right-.5&&a.right>b.left+.5&&a.top<b.bottom-.5&&a.bottom>b.top+.5)collisions.push(label.textContent);
          }
          for(const el of label.querySelectorAll('select,input,output')){
            const r=rect(el),p=rect(label);
            if(r.left<p.left-1||r.right>p.right+1)overflows.push(el.outerHTML);
          }
          if(rect(label).height<44)overflows.push('Touch row below 44px');
        }
        return {collisions,overflows,width:node.clientWidth,scrollWidth:node.scrollWidth};
      });
      assert.deepEqual(geometry.collisions,[],JSON.stringify(viewport));
      assert.deepEqual(geometry.overflows,[],JSON.stringify(viewport));
      assert(geometry.scrollWidth<=geometry.width+1);
      for(const name of ['visible','navigation','animation','aura']){
        const before = await field(name).isChecked();
        await field(name).setChecked(!before);
        assert.equal(await field(name).isChecked(),!before);
        await field(name).setChecked(before);
      }
      await field('grouping').selectOption('individual');
      assert.equal(await field('grouping').inputValue(),'individual');
      await field('grouping').selectOption('grouped');
      await field('resolution').selectOption('early');
      assert.equal(await field('resolution').inputValue(),'early');
      await field('infinite').setChecked(false);
      await field('timeout').fill('45');
      await field('timeout').press('Tab');
      assert.equal(await field('timeout').inputValue(),'45');
      await field('infinite').setChecked(true);
      assert(await field('timeout').isDisabled());
      await field('infinite').setChecked(false);
      for(const name of ['storm','danger']){
        await field(name).scrollIntoViewIfNeeded();
        const value = Number(await field(name).inputValue());
        await field(name).focus();
        await field(name).press('ArrowRight');
        await field(name).press('Tab');
        await page.waitForFunction(({name,value}) => Number(card.shadow.querySelector(`[data-storm-setting=${name}]`).value)>value,{name,value});
        assert.match(await field(name).locator('..').locator('output').textContent(),/km$/);
      }
      if(process.env.GR_UI_OUTPUT&&width===393&&!landscape){
        fs.mkdirSync(process.env.GR_UI_OUTPUT,{recursive:true});
        await panel.screenshot({path:path.join(process.env.GR_UI_OUTPUT,'storm-portrait.png')});
      }
      await panel.locator('[data-premium-action=close]').tap();
      await page.evaluate(() => card._setMapDisplayMode('standard',{persist:false}));
      await page.locator('#app-version-badge').tap();
      const history = page.locator('#release-history-dialog');
      for(const lang of ['de','en']){
        await history.locator(`[data-release-history-language=${lang}]`).tap();
        const check = await history.evaluate(node => {
          const kicker=node.querySelector('.release-history-kicker'),r=kicker.getBoundingClientRect(),range=document.createRange();
          range.selectNodeContents(kicker);
          const body=node.querySelector('.release-history-body');
          const content=body.querySelector('.release-history-lang-panel:not([hidden])');
          body.scrollTop=0;
          const top=body.scrollTop;
          const firstVisible=content.firstElementChild.getBoundingClientRect().top>=body.getBoundingClientRect().top-1;
          body.scrollTop=body.scrollHeight;
          const lastVisible=content.lastElementChild.getBoundingClientRect().bottom<=body.getBoundingClientRect().bottom+1;
          return {lines:range.getClientRects().length,overflow:kicker.scrollWidth>kicker.clientWidth+1,dialogOverflow:node.scrollWidth>node.clientWidth+1,firstVisible,lastVisible,top,bottom:body.scrollTop,max:body.scrollHeight-body.clientHeight,kickerWidth:r.width};
        });
        assert.equal(check.lines,1,JSON.stringify({viewport,lang,check}));
        assert.equal(check.overflow,false);
        assert.equal(check.dialogOverflow,false);
        assert(check.firstVisible&&check.lastVisible,JSON.stringify(check));
        assert.equal(check.top,0);
        assert(check.max>0);
        assert(Math.abs(check.bottom-check.max)<=1);
        if(process.env.GR_UI_OUTPUT&&width===393&&!landscape){
          await history.screenshot({path:path.join(process.env.GR_UI_OUTPUT,'history-'+lang+'.png')});
        }
      }
      await history.locator('#release-history-close').tap();
      results.push(viewport);
      console.log('PASS viewport '+viewport.width+' × '+viewport.height);
    }
    await page.evaluate(async () => {await card._settingsVault.flush();});
    const savedValues = await panel.evaluate(node => Object.fromEntries([...node.querySelectorAll('[data-storm-setting]')].map(input => [input.dataset.stormSetting,input.type==='checkbox'?input.checked:input.value])));
    const persisted = structuredClone(profiles.get(PROFILE_A).settings);
    assert(persisted[EYE]);
    await page.reload();
    await loaded();
    await page.evaluate(() => card._weatherStormOpen());
    assert.deepEqual(await panel.evaluate(node => Object.fromEntries([...node.querySelectorAll('[data-storm-setting]')].map(input => [input.dataset.stormSetting,input.type==='checkbox'?input.checked:input.value]))),savedValues);
    assert.equal(await field('resolution').inputValue(),'early');
    assert.equal(await field('timeout').inputValue(),'45');
    await panel.locator('[data-premium-action=close]').tap();
    await page.evaluate(async id => {await card._settingsVault.flush();await card._settingsVault.choose(id);location.reload();},PROFILE_B);
    await loaded();
    assert.equal(await page.evaluate(() => card._settingsVault.profileId),PROFILE_B);
    await page.evaluate(() => card._weatherStormOpen());
    assert.equal(await field('resolution').inputValue(),'classic');
    await panel.locator('[data-premium-action=close]').tap();
    await page.evaluate(async id => {await card._settingsVault.flush();await card._settingsVault.choose(id);location.reload();},PROFILE_A);
    await loaded();
    await page.evaluate(() => card._weatherStormOpen());
    assert.equal(await field('resolution').inputValue(),'early');
    await panel.locator('[data-premium-action=close]').tap();
    await page.evaluate(() => card._eyeHubOpen());
    const eye = page.locator('#eye-hub-config');
    await eye.locator('[data-eye-action=plus]').tap();
    await eye.locator('[data-eye-assign="4"]').tap();
    await eye.locator('[data-eye-pick=storm]').tap();
    await eye.locator('[data-eye-slot-aura=storm]').selectOption('on');
    assert.equal(await page.evaluate(() => card._eyeHubState().config.bubbleAura.storm),true);
    await eye.locator('header [data-premium-action=close]').tap();
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({passed:true,viewports:results,profileReload:true,eyeMenu:true}));
  }finally{
    await browser?.close();
    fixtureServer.server.close();
  }
}
run().catch(error => {console.error(error);process.exitCode=1;});

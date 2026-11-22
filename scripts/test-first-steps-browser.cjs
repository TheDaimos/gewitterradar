/* Actual delivered card/Leaflet/Vault. Only HA transport replies are synthetic. */
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const {chromium} = require('playwright');
const {fixture} = require('./wind-perf-browser-fixture.cjs');
const ABOUT = 'gewitterradar-about-onboarding-version';
const PRO = 'gewitterradar-pro-welcome-dismissed';
const FIRST = 'gewitterradar-first-steps-dismissed';

function initialize(options) {
  window.setupOptions = options;
  window.setupCalls = 0;
  window.setupMode = 'normal';
  window.setupResult = {schema:'gewitterradar.setup-status.v1',blitzortungInstalled:true,
    trackerLinked:false,recorderExcluded:null,localTodoCreated:true};
  window.setupUser = {id:'setup-test',name:'Synthetic test'};
  const profile = {id:'d'.repeat(32),name:'Test',revision:1,settings:{}};
  if (!options.about) profile.settings['gewitterradar-about-onboarding-version'] = '1';
  if (options.proDismissed) profile.settings['gewitterradar-pro-welcome-dismissed'] = '1';
  if (options.dismissed) profile.settings['gewitterradar-first-steps-dismissed'] = '1';
  window.setupProfile = JSON.parse(sessionStorage.getItem('test-setup-profile') || 'null') || profile;
  const slot = encodeURIComponent(JSON.stringify([setupUser.id, location.pathname.replace(/\/+$/,''), '']));
  localStorage.setItem('gewitterradar:vault:v1:binding:' + slot, profile.id);
  window.setupConnection = Object.assign(new EventTarget(), {
    connected:true,
    async sendMessagePromise() {
      if (options.brand === 'missing') throw {code:'unknown_command'};
      if (options.brand === 'failed') throw {code:'timeout'};
      if (options.brand === 'pending') return new Promise(resolve => { window.resolveBrand = resolve; });
      return {schema:'weather_router.consumer.discovery.v1',contract:{name:'weather_router.consumer',supported_versions:[1]},
        router:{ready:true,enabled:true,status:'ready'}};
    },
  });
  window.setupWS = async query => {
    if (query.type.startsWith('gewitterradar/settings/')) {
      if (query.type.endsWith('/patch')) {
        for (const [key, {after}] of Object.entries(query.request.changes)) {
          if (after === null) delete setupProfile.settings[key]; else setupProfile.settings[key] = after;
        }
        setupProfile.revision++;
        sessionStorage.setItem('test-setup-profile',JSON.stringify(setupProfile));
      }
      return {schema:1,settingsKeys:['gewitterradar-about-onboarding-version','gewitterradar-pro-welcome-dismissed','gewitterradar-first-steps-dismissed'],
        jsonSettingsKeys:[],recovery:false,profiles:[setupProfile],profile:setupProfile};
    }
    if (query.type === 'gewitterradar/setup_status') {
      setupCalls++;
      if (setupMode === 'failure') throw {code:'unauthorized'};
      if (setupMode === 'pending') return new Promise(resolve => { window.resolveSetup = resolve; });
      return setupResult;
    }
    return null;
  };
}

(async () => {
  for (const delivery of ['custom_components/gewitterradar/frontend','dashboard/dist']) {
    const f = fixture({onboarding:true,delivery,extendHtml:html => html
      .replace('card.hass={states:{', "card.hass={user:setupUser,connection:setupConnection,states:{")
      .replace("state:'Deutsch',attributes:{options:", "state:setupOptions.english?'English':'Deutsch',attributes:{options:")
      .replace('config:{latitude:50', "config:{state:'RUNNING',latitude:50")
      .replace('callWS:async query=>{', "callWS:async query=>{const setupAnswer=await setupWS(query);if(setupAnswer!==null)return setupAnswer;")});
    await new Promise(resolve => f.server.listen(0,'127.0.0.1',resolve));
    const browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
    try {
      const launch = async (options = {}, viewport = {width:1100,height:900}) => {
        const page = await browser.newPage({viewport,hasTouch:true,isMobile:true});
        const errors = []; page.on('pageerror', error => errors.push(error.message));
        await f.route(page); await page.addInitScript(initialize, {brand:'missing',...options});
        await page.goto('http://127.0.0.1:' + f.server.address().port + (options.mapWindow ? '/?gewitterradar_window=1' : ''));
        await page.waitForFunction(() => window.ready && card._mapReady);
        return {page,errors,dialog:page.locator('.gr-first-steps[open]')};
      };
      const ordered = await launch({about:true});
      await ordered.page.locator('.about-dialog[open]').waitFor();
      assert.equal(await ordered.dialog.count(),0);
      await ordered.page.locator('.about-later').click();
      await ordered.page.locator('.gr-pro-welcome[open]').waitFor();
      assert.equal(await ordered.dialog.count(),0);
      await ordered.page.locator('.gr-pro-later').click();
      await ordered.dialog.waitFor();
      assert.equal(await ordered.page.locator('dialog[open]').count(),1);
      assert.equal(await ordered.dialog.locator('.gr-first-scroll').evaluate(node => node.scrollTop),0,'start at branding/header');
      assert.equal(await ordered.dialog.locator('li').count(),4);
      assert.equal(await ordered.dialog.locator('.gr-first-item[open]').count(),0,'compact initial checklist');
      await ordered.dialog.locator('[data-check="recorder"] .gr-first-item>summary').click();
      assert.equal(await ordered.dialog.locator('.gr-first-item[open]').count(),1);
      assert.equal(await ordered.dialog.locator('[data-check="recorder"] .gr-first-why[open]').count(),0,'why initially collapsed');
      await ordered.dialog.locator('[data-check="recorder"] .gr-first-why>summary').click();
      assert(await ordered.dialog.locator('[data-check="recorder"] .gr-first-why p').isVisible());
      assert.match(await ordered.dialog.locator('[data-check="recorder"] .gr-first-why p').innerText(),/Blitzortung\.org/);
      assert(await ordered.dialog.locator('[data-check="recorder"] .gr-first-why img').evaluate(img => img.complete && img.naturalWidth > 0),'premium info asset');
      await ordered.dialog.locator('[data-check="todo"] .gr-first-item>summary').click();
      await ordered.page.waitForFunction(() => card._firstStepsDialog.querySelectorAll('.gr-first-item[open]').length === 1);
      assert.equal(await ordered.dialog.locator('[data-check="recorder"] .gr-first-item[open]').count(),0,'single expanded point');
      assert.match(await ordered.dialog.locator('[data-check="todo"] .gr-first-why p').textContent(),/Ortsfavoriten/);
      await ordered.page.waitForFunction(() => setupCalls === 1 && !card._firstStepsDialog.querySelector('[data-first-refresh]').disabled);
      assert.deepEqual(await ordered.dialog.locator('li').evaluateAll(rows => rows.map(row => row.dataset.state)),['complete','pending','unknown','complete']);
      assert.equal(await ordered.dialog.locator('.gr-first-check:visible').count(),2);
      assert.equal(await ordered.dialog.locator('.gr-first-brand').innerText(),'GewitterRadar');
      const colors = await ordered.dialog.locator('.gr-first-label').evaluateAll(rows => rows.map(row => getComputedStyle(row).color));
      assert.notEqual(colors[0],colors[1]); assert.equal(colors[0],colors[3]);
      await ordered.page.evaluate(() => { setupResult = {...setupResult,trackerLinked:true,recorderExcluded:true}; });
      await ordered.dialog.locator('[data-first-refresh]').click();
      await ordered.page.waitForFunction(() => card._firstStepsDialog.querySelectorAll('[data-state=complete]').length === 4);
      await ordered.page.evaluate(() => { setupMode = 'failure'; });
      await ordered.dialog.locator('[data-first-refresh]').click();
      await ordered.page.waitForFunction(() => card._firstStepsDialog.querySelectorAll('[data-state=unknown]').length === 4);
      await ordered.page.evaluate(() => { setupMode = 'normal'; setupResult = {...setupResult,trackerLinked:false}; });
      await ordered.dialog.locator('[data-first-refresh]').click();
      await ordered.page.waitForFunction(() => card._firstStepsDialog.querySelectorAll('[data-state=complete]').length === 3);
      if (process.env.GR_TEST_SCREENSHOTS) {
        fs.mkdirSync(process.env.GR_TEST_SCREENSHOTS,{recursive:true});
        await ordered.dialog.locator('.gr-first-scroll').evaluate(node => { node.scrollTop = 0; });
        await ordered.page.screenshot({path:path.join(process.env.GR_TEST_SCREENSHOTS,'first-steps-desktop.png')});
      }
      await ordered.dialog.locator('input').check();
      await ordered.page.waitForFunction(() => card._settingsVault.status === 'saved');
      assert.equal(await ordered.page.evaluate(key => setupProfile.settings[key],FIRST),'1');
      await ordered.dialog.locator('[data-first-done]').click();
      await ordered.page.evaluate(() => card._render()); assert.equal(await ordered.dialog.count(),0);
      await ordered.page.locator('#settings-open').click();
      assert(await ordered.page.locator('#settings-backdrop.open').isVisible());
      await ordered.page.evaluate(([about,pro]) => {
        setupProfile.settings[about] = '1'; setupProfile.settings[pro] = '1';
        sessionStorage.setItem('test-setup-profile',JSON.stringify(setupProfile));
      },[ABOUT,PRO]);
      await ordered.page.reload();
      await ordered.page.waitForFunction(() => window.ready && card._mapReady && !card.__proBranding.check);
      assert.equal(await ordered.dialog.count(),0,'persisted dismissal survives reload');
      await ordered.page.evaluate(() => card._reopenFirstStepsFromHelp());
      await ordered.dialog.waitFor();
      assert.equal(await ordered.dialog.locator('input[type=checkbox]').isChecked(),true,
        'manual reopening reflects persisted dismissal');
      await ordered.dialog.locator('input[type=checkbox]').uncheck();
      await ordered.page.waitForFunction(key => !Object.hasOwn(setupProfile.settings,key),FIRST);
      await ordered.dialog.locator('[data-first-done]').click();
      await ordered.page.reload();
      await ordered.page.waitForFunction(() => window.ready && card._mapReady && !card.__proBranding.check);
      await ordered.dialog.waitFor();
      assert.equal(await ordered.dialog.locator('input[type=checkbox]').isChecked(),false,
        'cleared dismissal reenables automatic opening');
      assert.deepEqual(ordered.errors,[]); await ordered.page.close();

      const multiple = await launch();
      await multiple.page.locator('.gr-pro-welcome[open]').waitFor();
      await multiple.page.evaluate(() => {
        const slot = encodeURIComponent(JSON.stringify([setupUser.id,location.pathname.replace(/\/+$/,''),'second']));
        localStorage.setItem('gewitterradar:vault:v1:binding:' + slot,setupProfile.id);
        const second = document.createElement('gewitterradar-card'); window.second = second;
        second.setConfig({initial_zoom:7,settings_vault_id:'second'});
        second.hass = card._vaultHass; document.body.append(second);
      });
      await multiple.page.waitForFunction(() => second._mapReady);
      assert.equal(await multiple.dialog.count(),0,'another card cannot bypass the open PRO notice');
      await multiple.page.locator('.gr-pro-later').click();
      await multiple.dialog.waitFor();
      assert.equal(await multiple.dialog.count(),1,'one first-steps dialog across both cards');
      await multiple.page.close();

      for (const [brand,viewport] of [['ready',{width:393,height:520}],['failed',{width:320,height:480}],['missing',{width:851,height:320}]]) {
        const current = await launch({brand,proDismissed:true,english:true},viewport);
        await current.dialog.waitFor();
        await current.page.waitForFunction(() => setupCalls === 1);
        assert.equal(await current.dialog.locator('.gr-first-pro').count(),brand === 'ready' ? 1 : 0);
        const scroll = current.dialog.locator('.gr-first-scroll');
        assert.equal(await scroll.evaluate(node => node.scrollTop),0,'mobile start at branding');
        assert(await current.dialog.evaluate(node => getComputedStyle(node).backgroundImage.includes('linear-gradient(145deg')),'metallic gold frame');
        assert(await scroll.evaluate(node => node.scrollWidth <= node.clientWidth), 'horizontal overflow');
        const close = current.dialog.locator('.gr-first-close'), before = await close.boundingBox();
        await scroll.evaluate(node => { node.scrollTop = node.scrollHeight; });
        assert.deepEqual(await close.boundingBox(),before);
        if (process.env.GR_TEST_SCREENSHOTS && brand === 'ready') {
          await scroll.evaluate(node => { node.scrollTop = 0; });
          await current.page.screenshot({path:path.join(process.env.GR_TEST_SCREENSHOTS,'first-steps-mobile-pro.png')});
        }
        await close.tap(); await current.dialog.waitFor({state:'hidden'});
        assert.deepEqual(current.errors,[]); await current.page.close();
      }
      for (const options of [{dismissed:true,proDismissed:true},{mapWindow:true},{brand:'pending'}]) {
        const current = await launch(options);
        if (options.brand === 'pending') {
          assert.equal(await current.dialog.count(),0);
          await current.dialog.waitFor({timeout:12000});
          assert.equal(await current.dialog.locator('.gr-first-pro').count(),0);
          await current.page.evaluate(() => resolveBrand({schema:'weather_router.consumer.discovery.v1',router:{ready:true,enabled:true,status:'ready'}}));
          assert.equal(await current.dialog.locator('.gr-first-pro').count(),0,'ignore expired branding');
        } else assert.equal(await current.dialog.count(),0);
        await current.page.close();
      }
      const cleanup = await launch({proDismissed:true}); await cleanup.dialog.waitFor();
      await cleanup.page.waitForFunction(() => !card._firstStepsDialog.querySelector('[data-first-refresh]').disabled);
      await cleanup.page.evaluate(() => { setupMode = 'pending'; });
      await cleanup.dialog.locator('[data-first-refresh]').click();
      await cleanup.page.waitForFunction(() => !card._firstStepsDialog.querySelector('[data-first-refresh]').disabled, null, {timeout:9000});
      assert.equal(await cleanup.dialog.locator('[data-state=complete]').count(),0,'timeout has no false green');
      await cleanup.page.evaluate(() => resolveSetup(setupResult));
      assert.equal(await cleanup.dialog.locator('[data-state=complete]').count(),0,'late status ignored');
      await cleanup.dialog.locator('[data-first-refresh]').click();
      await cleanup.page.evaluate(() => { setupConnection.connected = false; setupConnection.dispatchEvent(new Event('disconnected')); });
      assert.equal(await cleanup.dialog.locator('[data-state=complete]').count(),0);
      await cleanup.page.evaluate(() => { resolveSetup(setupResult); card.remove(); });
      await cleanup.dialog.waitFor({state:'hidden'}); assert.deepEqual(cleanup.errors,[]);
      await cleanup.page.close();

      const fallback = await launch({proDismissed:true}); await fallback.dialog.waitFor();
      await fallback.page.waitForFunction(() => !card._firstStepsDialog.querySelector('[data-first-refresh]').disabled);
      await fallback.page.evaluate(() => {
        const regular = card._hass.callWS;
        card._hass.callWS = async query => {
          if (query.type === 'gewitterradar/setup_status') throw {code:'unknown_command'};
          if (query.type === 'config/entity_registry/list') return [
            {entity_id:'sensor.test_lightning_counter',platform:'blitzortung'},
            {entity_id:'todo.test_places',platform:'local_todo',original_name:'Gewitterradar Orte'},
          ];
          return regular(query);
        };
        card._hass.states['todo.test_places'] = {state:'0',attributes:{friendly_name:'Gewitterradar Orte'}};
      });
      await fallback.dialog.locator('[data-first-refresh]').click();
      await fallback.page.waitForFunction(() => !card._firstStepsDialog.querySelector('[data-first-refresh]').disabled);
      assert.deepEqual(await fallback.dialog.locator('li').evaluateAll(rows => rows.map(row => row.dataset.state)),['complete','unknown','unknown','complete']);
      await fallback.page.close();
      console.log('PASS first steps:',delivery,'order, standard/PRO, four independent checks, errors, refresh, Vault, touch, timeout, cleanup');
    } finally { await browser.close(); await new Promise(resolve => f.server.close(resolve)); }
  }
})().catch(error => {console.error(error);process.exitCode=1;});

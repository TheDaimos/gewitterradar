const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');
const {fixture} = require('./wind-perf-browser-fixture.cjs');

const ABOUT = 'gewitterradar-about-onboarding-version';
const DISMISSED = 'gewitterradar-pro-welcome-dismissed';
const GITHUB = 'https://github.com/TheDaimos/weather-router-pub';
const ABOUT_FIRST = 'a'.repeat(32);
const PROFILE = 'b'.repeat(32);
const OTHER_PROFILE = 'c'.repeat(32);

function initialize({id, mode, language, state}) {
  const user = {id:'pro-welcome-test',name:'Test account'};
  const slot = encodeURIComponent(JSON.stringify([user.id, '', '']));
  window.welcomeTest = {user, mode, language, state, calls:0};
  localStorage.setItem('gewitterradar:vault:v1:binding:' + slot, id);
  window.welcomeConnection = Object.assign(new EventTarget(), {
    connected:true,
    async sendMessagePromise({type}) {
      if (type !== 'weather_router/consumer/discovery') throw Error('Unexpected discovery request');
      const test = window.welcomeTest;
      test.calls++;
      if (test.mode === 'pending') return new Promise((resolve, reject) => { test.reject = reject; });
      if (test.mode === 'failed') throw {code:'timeout'};
      if (test.mode === 'missing') throw {code:'unknown_command'};
      const ready = test.mode === 'ready';
      return {
        schema:'weather_router.consumer.discovery.v1',
        contract:{name:'weather_router.consumer',supported_versions:[1]},
        router:{ready,enabled:ready,status:ready ? 'ready' : 'starting'},
      };
    },
  });
}

async function run() {
  const profiles = new Map([
    [ABOUT_FIRST, {id:ABOUT_FIRST,name:'About first',revision:1,settings:{}}],
    [PROFILE, {id:PROFILE,name:'First profile',revision:1,settings:{[ABOUT]:'1'}}],
    [OTHER_PROFILE, {id:OTHER_PROFILE,name:'Second profile',revision:1,settings:{[ABOUT]:'1'}}],
  ]);
  const patches = [];
  const f = fixture({delivery:'custom_components/gewitterradar/frontend',extendHtml:html => html
    .replace('card.hass={states:{', 'card.hass={user:welcomeTest.user,connection:welcomeConnection,states:{')
    .replace("state:'Deutsch',attributes:{options:", "state:welcomeTest.language,attributes:{options:")
    .replace('config:{latitude:50', 'config:{state:welcomeTest.state,latitude:50')
    .replace('callWS:async query=>{', "callWS:async query=>{if(query.type.startsWith('gewitterradar/settings/'))return testVault(query);")});
  await new Promise(resolve => f.server.listen(0, '127.0.0.1', resolve));
  const url = 'http://127.0.0.1:' + f.server.address().port;
  let browser;
  try {
    browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
    const launch = async (options = {}, viewport = {width:1100,height:900}, touch = false) => {
      const page = await browser.newPage({viewport,hasTouch:touch,isMobile:touch});
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await f.route(page);
      await page.exposeFunction('testVault', ({type, request}) => {
        const profile = profiles.get(request.profileId);
        assert(profile);
        if (type.endsWith('/patch')) {
          patches.push(request);
          for (const [key, {after}] of Object.entries(request.changes)) {
            if (after === null) delete profile.settings[key];
            else profile.settings[key] = after;
          }
          profile.revision++;
        } else assert(type.endsWith('/get'));
        return {schema:1,settingsKeys:[ABOUT,DISMISSED],jsonSettingsKeys:[],recovery:false,profiles:[...profiles.values()],profile};
      });
      await page.addInitScript(initialize, {id:PROFILE,mode:'missing',language:'Deutsch',state:'RUNNING',...options});
      await page.goto(url + (options.mapWindow ? '/?gewitterradar_window=1' : ''));
      await page.waitForFunction(() => window.ready && card._mapReady && welcomeTest.calls === 1);
      return {page, errors, dialog:page.locator('dialog.gr-pro-welcome[open]')};
    };

    for (const mode of ['ready','starting','failed']) {
      const {page, dialog, errors} = await launch({mode});
      await page.waitForFunction(() => !card.__proBranding.check);
      assert.equal(await dialog.count(), 0, mode);
      assert.deepEqual(errors, []);
      await page.close();
    }
    const mapWindow = await launch({mapWindow:true});
    await mapWindow.page.waitForFunction(() => card._mapWindowMode && !card.__proBranding.check);
    assert.equal(await mapWindow.dialog.count(), 0);
    await mapWindow.page.close();

    const pending = await launch({mode:'pending'});
    assert.equal(await pending.dialog.count(), 0);
    await pending.page.waitForFunction(() => card.__proBranding.check?.expired, null, {timeout:10000});
    await pending.page.evaluate(() => welcomeTest.reject({code:'unknown_command'}));
    await pending.page.waitForFunction(() => !card.__proBranding.check);
    assert.equal(await pending.dialog.count(), 0, 'expired reply');
    assert.deepEqual(pending.errors, []);
    await pending.page.close();

    const starting = await launch({state:'STARTING'});
    await starting.page.waitForFunction(() => !card.__proBranding.check);
    assert.equal(await starting.dialog.count(), 0, 'HA startup');
    await starting.page.locator('#settings-open').click();
    await starting.page.evaluate(() => {
      card.hass = {...card.hass,config:{...card.hass.config,state:'RUNNING'}};
      welcomeConnection.dispatchEvent(new Event('ready'));
    });
    await starting.page.waitForFunction(() => card.__proBranding.installation === 'absent');
    assert.equal(await starting.dialog.count(), 0, 'while settings are open');
    await starting.page.locator('#settings-close').click();
    await starting.page.evaluate(() => card._render());
    await starting.dialog.waitFor();
    await starting.page.close();

    const initial = await launch({id:ABOUT_FIRST});
    const about = initial.page.locator('.about-dialog[open]');
    await about.waitFor();
    assert.equal(await initial.dialog.count(), 0);
    await about.locator('.about-later').click();
    await initial.dialog.getByRole('heading', {name:'Entdecke mehr Wetter'}).waitFor();
    assert.equal(await initial.dialog.getByRole('listitem').count(), 6);
    if (process.env.GR_TEST_SCREENSHOTS) await initial.page.screenshot({path:path.join(process.env.GR_TEST_SCREENSHOTS,'gr-411231-desktop.png')});
    const github = initial.dialog.getByRole('link', {name:'WeatherRouter auf GitHub ansehen'});
    assert.equal(await github.getAttribute('href'), GITHUB);
    assert.equal(await github.getAttribute('rel'), 'noopener noreferrer');
    await initial.page.context().route(GITHUB, route => route.fulfill({body:'Public WeatherRouter project'}));
    const popup = initial.page.waitForEvent('popup');
    await github.click();
    const project = await popup;
    await project.waitForURL(GITHUB);
    await project.close();
    assert.equal(patches.length, 0);
    await initial.dialog.getByRole('button', {name:'Später',exact:true}).click();
    await initial.page.evaluate(() => { card._render(); welcomeConnection.dispatchEvent(new Event('ready')); });
    await initial.page.waitForFunction(() => !card.__proBranding.check);
    assert.equal(await initial.dialog.count(), 0);
    await initial.page.locator('.gr-first-steps[open] [data-first-done]').click();
    await initial.page.locator('#settings-open').click();
    assert(await initial.page.locator('#settings-backdrop').isVisible());
    assert.deepEqual(initial.errors, []);
    await initial.page.close();

    const mobile = await launch({language:'English'}, {width:393,height:420}, true);
    await mobile.dialog.getByRole('heading', {name:'Discover more weather'}).waitFor();
    const close = mobile.dialog.locator('.gr-pro-close');
    const scroll = mobile.dialog.locator('.gr-pro-scroll');
    assert(await close.locator('img').evaluate(img => img.complete && img.naturalWidth === 112));
    if (process.env.GR_TEST_SCREENSHOTS) await mobile.page.screenshot({path:path.join(process.env.GR_TEST_SCREENSHOTS,'gr-411231-mobile.png')});
    const geometry = await scroll.evaluate(el => ({height:el.clientHeight,scrollHeight:el.scrollHeight,width:el.clientWidth,scrollWidth:el.scrollWidth}));
    assert(geometry.scrollHeight > geometry.height, JSON.stringify(geometry));
    assert.equal(geometry.scrollWidth, geometry.width, 'no horizontal scrolling');
    const atTop = await close.boundingBox();
    await scroll.evaluate(el => { el.scrollTop = el.scrollHeight; });
    assert.deepEqual(await close.boundingBox(), atTop);
    await close.tap();
    await mobile.dialog.waitFor({state:'hidden'});
    assert.equal(patches.length, 0);
    await mobile.page.reload();
    await mobile.dialog.getByRole('heading', {name:'Discover more weather'}).waitFor();
    await mobile.dialog.getByRole('checkbox', {name:'Don’t show this notice again'}).tap();
    await mobile.page.waitForFunction(() => card._settingsVault.status === 'saved');
    assert.equal(patches.length, 1);
    assert.deepEqual(patches[0].changes, {[DISMISSED]:{before:null,after:'1'}});
    assert.deepEqual(mobile.errors, []);
    await mobile.page.close();

    const restarted = await launch();
    await restarted.page.waitForFunction(() => !card.__proBranding.check);
    assert.equal(await restarted.dialog.count(), 0);
    await restarted.page.close();
    const other = await launch({id:OTHER_PROFILE}, {width:768,height:1024}, true);
    await other.dialog.waitFor();
    assert.equal(patches.length, 1);
    await other.dialog.getByRole('button', {name:'Später',exact:true}).tap();
    await other.dialog.waitFor({state:'hidden'});
    await other.page.close();
    console.log('PASS: discovery states and late results, About order, link, one display per launch, touch scrolling and close, profile persistence and base settings');
  } finally {
    await browser?.close();
    f.server.close();
  }
}

run().catch(error => {console.error(error);process.exitCode = 1;});

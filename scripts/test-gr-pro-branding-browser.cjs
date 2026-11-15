const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {fixture} = require('./wind-perf-browser-fixture.cjs');

function initBranding(mode) {
  const user = 'pro-browser-test';
  const about = 'gewitterradar-about-onboarding-version';
  const profile = {id:'a'.repeat(32),name:'Desktop and mobile',revision:1,settings:{[about]:'1'}};
  const slot = encodeURIComponent(JSON.stringify([user,location.pathname.replace(/\/+$/,''),'']));
  localStorage.setItem('gewitterradar:vault:v1:binding:'+slot,profile.id);
  window.proTestUser = {id:user,name:'Test account'};
  window.proTestSettings = {schema:1,settingsKeys:[about],jsonSettingsKeys:[],profiles:[profile],profile,recovery:false};
  window.proMode = mode;
  window.discoveryCalls = 0;
  window.proReply = {
    schema:'weather_router.consumer.discovery.v1',
    contract:{name:'weather_router.consumer',supported_versions:[1]},
    router:{ready:true,enabled:true,status:'ready',integration_version:'0.10.322'}
  };
  window.proConnection = Object.assign(new EventTarget(), {
    connected:true,
    async sendMessagePromise(command) {
      if (command.type !== 'weather_router/consumer/discovery') throw Error('Unexpected branding request');
      window.discoveryCalls++;
      if (window.proMode === 'pending') return new Promise(resolve => { window.finishDiscovery = resolve; });
      if (window.proMode === 'missing') throw {code:'unknown_command'};
      if (window.proMode === 'failed') throw Error('Connection error');
      if (window.proMode === 'loading') return {...window.proReply,router:{...window.proReply.router,ready:false,status:'loading'}};
      if (window.proMode === 'unknown') return {...window.proReply,router:{ready:true,enabled:true}};
      return window.proReply;
    }
  });
}

const logo = page => page.locator('#overview-title .pro-wordmark:visible');
const standard = page => page.locator('#overview-title .standard-wordmark:visible');
const reloadMode = (page, mode) => page.evaluate(value => { window.proMode=value; }, mode);
async function assertLayout(page) {
  await logo(page).waitFor();
  const layout = await logo(page).evaluate(img => {
    const root = img.getRootNode(),rect = node => node.getBoundingClientRect().toJSON();
    const other = ['app-version-badge','settings-open','location-main-button','radar-subtitle','animation-toggle','status-chip']
      .map(id => root.getElementById(id)).filter(el => el.getClientRects().length);
    const image = rect(img);
    return {
      image, width:innerWidth, ratio:img.naturalWidth/img.naturalHeight,
      collisions:other.filter(el => {
        const r = rect(el);
        return r.left < image.right && r.right > image.left && r.top < image.bottom && r.bottom > image.top;
      }).map(el => el.id),
      badge:root.getElementById('app-version-badge').textContent
    };
  });
  assert.equal(layout.ratio,1190/348);
  assert(Math.abs(layout.image.width/layout.image.height-layout.ratio)<.01);
  assert(layout.image.left>=0&&layout.image.right<=layout.width&&layout.image.width<=290);
  assert.deepEqual(layout.collisions,[]);
  assert.match(layout.badge,/^V4\.11\.\d+ DEV$/);
}

async function run() {
  const f = fixture({extendHtml:html => html
    .replace('background:#121b24','background:#121b24;font-family:system-ui')
    .replace('card.hass={states:{', `card.hass={user:window.proTestUser,connection:window.proConnection,states:{
      'zone.hamburg':{state:'0',attributes:{friendly_name:'Hamburg',latitude:53.55,longitude:10}},
      'select.gewitterradar_reference_location':{state:'zone.hamburg',attributes:{options:['zone.hamburg','zone.home']}},
      'switch.gewitterradar_show_location_selector':{state:'on'},`)
    .replace('callWS:async query=>{', "callWS:async query=>{if(query.type==='gewitterradar/settings/get')return window.proTestSettings;")
  });
  await new Promise(resolve => f.server.listen(0,'127.0.0.1',resolve));
  const base = 'http://127.0.0.1:'+f.server.address().port;
  let browser;
  try {
    browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
    const desktop = await browser.newPage({viewport:{width:1177,height:900}});
    await f.route(desktop);
    const assetRequests = [];
    const pageErrors = [];
    desktop.on('pageerror',error => pageErrors.push(error.stack));
    desktop.on('request',request => {if(request.url().includes('gewitterradar-pro-wordmark'))assetRequests.push(request.url());});
    await desktop.addInitScript(initBranding,'pending');
    await desktop.goto(base);
    await desktop.waitForFunction(() => window.ready && window.finishDiscovery).catch(async error => {
      const state = await desktop.evaluate(() => ({
        ready:window.ready,mode:window.proMode,calls:window.discoveryCalls,connection:!!window.card?._hass?.connection,
        vault:window.card?._settingsVault?.status
      }));
      throw new Error(JSON.stringify({state,pageErrors}),{cause:error});
    });
    assert(await standard(desktop).isVisible());
    assert.equal(assetRequests.length,0);
    await desktop.evaluate(() => finishDiscovery(proReply));
    await assertLayout(desktop);
    assert(await desktop.locator('#location-main-button').isVisible());
    assert.equal(assetRequests.length,1);
    await desktop.evaluate(() => {for(let i=0;i<3;i++)card.hass={...card._hass};});
    assert.equal(await desktop.evaluate(() => discoveryCalls),1);
    await desktop.locator('#app-version-badge').click();
    assert(await desktop.locator('#release-history-backdrop').isVisible());
    assert(await logo(desktop).isVisible());
    await desktop.keyboard.press('Escape');
    if(process.env.GR_TEST_SCREENSHOTS)await desktop.locator('.topbar').screenshot({path:path.join(process.env.GR_TEST_SCREENSHOTS,'gr-411211-desktop.png')});

    await desktop.evaluate(() => {
      proConnection.connected=false;
      proConnection.dispatchEvent(new Event('disconnected'));
    });
    assert(await standard(desktop).isVisible());
    await desktop.evaluate(() => {
      proMode='loading';
      proConnection.connected=true;
      proConnection.dispatchEvent(new Event('ready'));
    });
    await desktop.waitForFunction(() => discoveryCalls===2 && !card.__proBranding.check);
    assert(await standard(desktop).isVisible());
    for(const mode of ['unknown','failed','missing','ready']){
      await reloadMode(desktop,mode);
      await desktop.evaluate(() => proConnection.dispatchEvent(new Event('ready')));
      await desktop.waitForFunction(() => !card.__proBranding.check);
      assert.equal(await logo(desktop).isVisible(),mode==='ready');
    }
    await desktop.evaluate(() => {
      proMode='pending';
      window.finishDiscovery=null;
      proConnection.dispatchEvent(new Event('ready'));
    });
    assert(await logo(desktop).isVisible());
    await standard(desktop).waitFor({timeout:10000});
    await desktop.evaluate(() => finishDiscovery(proReply));
    await desktop.waitForFunction(() => !card.__proBranding.check);
    assert(await standard(desktop).isVisible());
    await desktop.reload();
    await desktop.waitForFunction(() => window.ready && window.finishDiscovery);
    assert(await standard(desktop).isVisible());
    await desktop.evaluate(() => finishDiscovery({...proReply,router:{...proReply.router,enabled:false}}));
    await desktop.waitForFunction(() => !card.__proBranding.check);
    assert(await standard(desktop).isVisible());

    const phone = await browser.newPage({viewport:{width:393,height:851},hasTouch:true,isMobile:true});
    await f.route(phone);
    await phone.addInitScript(initBranding,'ready');
    await phone.goto(base);
    for(const width of [320,360,393,412]){
      await phone.setViewportSize({width,height:851});
      await assertLayout(phone);
      assert(await phone.locator('#location-main-button').isVisible());
      if(width===393&&process.env.GR_TEST_SCREENSHOTS)await phone.locator('.topbar').screenshot({path:path.join(process.env.GR_TEST_SCREENSHOTS,'gr-411211-portrait.png')});
    }
    await phone.route('**/gewitterradar-pro-wordmark-v1.png',route => route.abort());
    await phone.reload();
    await phone.waitForFunction(() => window.ready && discoveryCalls===1 && !card.__proBranding.check);
    assert(await standard(phone).isVisible());
    assert(await phone.locator('#settings-open').isVisible());
    console.log('PASS: local and unavailable Discovery, transport timeout and reconnect, reload and failed asset, badge and layouts at 320–412 and 1177 px.');
  } finally {
    await browser?.close();
    f.server.close();
  }
}

run().catch(error => {console.error(error);process.exitCode=1;});

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

async function assertHubTriggers(page, useTouch=false){
  const title=logo(page);
  assert.equal(await title.getAttribute('role'),'button');
  assert.equal(await title.getAttribute('tabindex'),'0');
  if(useTouch)await title.tap();else await title.press('Enter');
  const hub=page.locator('iframe[title="Daimos Project Hub"]');
  await hub.waitFor();
  const target=await hub.getAttribute('src');
  await page.locator('.project-hub-close-premium').click();
  await page.locator('#settings-open').click();
  await page.locator('.settings-signature-wrap').click();
  await hub.waitFor();
  assert.equal(await hub.getAttribute('src'),target);
  await page.locator('.project-hub-close-premium').click();
  await page.locator('#settings-close').click();
}

async function assertHelp(page,connected,screenshots){
  const title=page.locator('#overview-title');
  assert.equal(await title.evaluate(node=>node.classList.contains('is-pro')),connected);
  const discoveries=await page.evaluate(()=>discoveryCalls);
  if(!await page.locator('#settings-backdrop.open').count())await page.locator('#settings-open').click();
  await page.locator('#settings-help').click();
  const dialog=page.locator('.help-dialog'),content=dialog.locator('.help-content');
  await dialog.waitFor({state:'visible'});
  const classic=content.locator('.help-standard'),pro=content.locator('.help-pro');
  const standardKeys=['prerequisites','radii','location','mapview','external_services','functions','defaults','troubleshooting','recorder','instruments-v410'];
  const topics=['eye-controls','wr-wind','wr-information','wr-precipitation','wr-temperature','wr-clouds','wr-synoptic','wr-display'];
  const display='weather-display-v411';
  const proKeys=[...topics.filter(key=>key!=='wr-information'),display,'wr-information'];
  const keys=section=>section.locator(':scope > details').evaluateAll(nodes=>nodes.map(n=>n.dataset.helpSection));
  assert.deepEqual(await keys(classic),standardKeys);
  assert.deepEqual(await keys(pro),connected?proKeys:[...proKeys,'wr-pro']);
  assert.deepEqual(await content.locator(':scope > section').evaluateAll(nodes=>nodes.map(node=>node.className)),['help-standard','help-pro']);
  assert.match(await pro.locator('header h3 img').getAttribute('src'),/pro-wordmark-v1/);
  const status=pro.locator('.help-pro-status');
  assert.equal(await status.getAttribute('data-connected'),String(connected));
  assert.match(await status.textContent(),connected?/^WeatherRouter verbunden$/:/Optionale Erweiterung/);
  assert.equal(await classic.locator('summary .help-pro-badge').count(),0);
  assert.equal(await pro.locator('summary .help-pro-badge').count(),proKeys.length-1);
  const upgrade=pro.locator('[data-help-section=wr-pro]');
  assert.equal(await upgrade.count(),connected?0:1);
  for(const key of standardKeys){
    const topic=classic.locator(`[data-help-section=${key}]`);
    const summary=topic.locator('summary');
    if(!await topic.evaluate(node=>node.open))await summary.click();
    assert((await topic.locator('.help-section-body').innerText()).length>40);
    if(key==='mapview'){
      const badge=topic.locator('.help-section-body .help-pro-badge-compact');
      assert.equal(await badge.count(),1);
      assert.match(await badge.locator('..').textContent(),/WeatherRouter/);
      assert.match(await topic.locator('.help-section-body p').last().textContent(),/verbundenem/);
      if(!connected&&screenshots){
        await badge.evaluate(node=>node.closest('p').scrollIntoView({block:'center'}));
        await dialog.screenshot({path:path.join(screenshots,'hilfe-standard-pro-hinweis.png')});
      }
    }
    await summary.click();
    assert.equal(await topic.evaluate(node=>node.open),false);
  }
  for(const width of [320,360,393,412,851,1177]){
    await page.setViewportSize({width,height:width===851?393:851});
    const layout=await content.evaluate(node=>{
      const issues=[];
      for(const badge of node.querySelectorAll('summary .help-pro-badge')){
        const r=badge.getBoundingClientRect();
        const summary=badge.closest('summary');
        const chevron=summary.lastElementChild.getBoundingClientRect();
        const icon=summary.firstElementChild.getBoundingClientRect();
        if(!badge.complete||!badge.naturalWidth||getComputedStyle(badge).pointerEvents!=='none'||r.right>chevron.left||r.left<icon.right){
          issues.push(summary.parentElement.dataset.helpSection);
        }
      }
      const articleIcons=[...node.querySelectorAll('.help-section:not(.help-pro-featurelist)>summary>.help-section-icon')];
      const iconSizes=articleIcons.map(icon=>{
        const {width,height}=icon.getBoundingClientRect();
        return [width,height];
      });
      return {issues,iconSizes,overflow:node.scrollWidth-node.clientWidth};
    });
    assert.deepEqual(layout.issues,[],`Badge geometry at ${width}px`);
    assert.equal(layout.iconSizes.length,proKeys.length+standardKeys.length);
    assert(layout.iconSizes.every(([w,h])=>w===44&&h===44),`Article icon slots at ${width}px`);
    assert(layout.overflow<=1,`Horizontal overflow at ${width}px`);
  }
  await page.setViewportSize({width:393,height:851});
  for(const key of topics){
    const topic=content.locator('[data-help-section='+key+']');
    await topic.locator('summary').click();
    const body=topic.locator('.help-section-body');
    assert((await body.locator('p').first().textContent()).length>45);
    const icon=topic.locator('summary .help-section-icon img');
    assert(await icon.evaluate(img=>img.complete&&img.naturalWidth>0));
    if(key==='eye-controls'){
      assert.match(await icon.getAttribute('src'),/gr-eye-open-master/);
      assert.equal(await topic.locator('.help-pro-badge').count(),0);
      assert.match(await body.textContent(),/gehört zu GewitterRadar Standard/);
      assert.match(await body.textContent(),/bis zu acht Slots/);
      for(const width of [320,393,851,1177]){
        await page.setViewportSize({width,height:width===851?393:851});
        const layout=await body.locator('.help-icon-paragraph > img').evaluateAll(imgs=>imgs.map(img=>{
          const paragraph=img.parentElement,box=img.getBoundingClientRect();
          const range=document.createRange();
          range.selectNodeContents(paragraph.lastChild);
          const lines=Array.from(range.getClientRects());
          return {
            file:img.src.split('/').at(-1),loaded:img.complete&&img.naturalWidth>0,
            height:box.height,lineHeight:parseFloat(getComputedStyle(paragraph).lineHeight),
            lineCount:lines.length,
            alongside:lines.filter(line=>line.top<box.bottom&&line.left>=box.right-1).length,
            beneath:lines.slice(2).every(line=>Math.abs(line.left-paragraph.getBoundingClientRect().left)<1),
            overflows:paragraph.scrollWidth>paragraph.clientWidth+1
          };
        }));
        assert.deepEqual(layout.map(img=>img.file),[
          'gr-eye-open-master-1254.png','gr-precipitation-premium-original.png','gr-weather-display-premium-original.png'
        ]);
        assert(layout.every(img=>img.loaded&&Math.abs(img.height-2*img.lineHeight)<1&&
          img.alongside===Math.min(2,img.lineCount)&&img.beneath&&!img.overflows),JSON.stringify({width,layout}));
        if(width===393&&connected&&screenshots)
          await topic.screenshot({path:path.join(screenshots,'hilfe-eye-icons.png'),animations:'disabled'});
      }
      await page.setViewportSize({width:393,height:851});
    }
    if(key==='wr-information'){
      assert.deepEqual(await body.locator('h4').allTextContents(),['Datenquelle und Status','Aktualisierung nach Kartenbewegung']);
      assert.equal(await body.locator('dt').count(),5);
      assert.match(await body.textContent(),/2 bis 60 Sekunden.*15 Sekunden/);
      assert.match(await body.textContent(),/manuell ausgelöste Aktualisierung/);
      assert.match(await icon.getAttribute('src'),/weather-router-emblem-v004-256\.png$/);
    }
    if(key==='wr-wind')assert.match(await icon.getAttribute('src'),/gr-wind-animation-toggle-premium-v1-272\.webp$/);
    if(key==='wr-precipitation')assert.match(await body.textContent(),/0 % Deckkraft.*transparent.*100 %.*deckend/);
    if(key==='wr-temperature')assert.match(await body.textContent(),/mit den gewählten Ansichten ein- oder auszuschalten/);
    if(key==='wr-clouds'){
      assert.match(await icon.getAttribute('src'),/gr-clouds-eye-premium-original/);
      assert.match(await body.locator('img').getAttribute('src'),/gr-clouds-help-premium-original/);
    }
    await topic.getByRole('button',{name:'Zur Übersicht'}).click();
  }
  const displayTopic=pro.locator(`[data-help-section=${display}]`);
  await displayTopic.locator('summary').click();
  assert((await displayTopic.locator('.help-section-body').innerText()).length>45);
  await displayTopic.locator('summary').click();
  if(!connected){
    assert.equal(await pro.locator(':scope > details').last().getAttribute('data-help-section'),'wr-pro');
    await upgrade.locator('summary').click();
    for(const label of ['Was ist WeatherRouter?','Wie bekomme ich GewitterRadar PRO?'])assert(await upgrade.getByText(label,{exact:true}).isVisible());
    assert.equal(await upgrade.locator('li').count(),6);
    assert.match(await upgrade.locator('summary img').getAttribute('src'),/pro-wordmark-v1/);
    assert(await upgrade.locator('summary').evaluate(node=>{
      const logo=node.querySelector('img').getBoundingClientRect();
      const label=node.children[1].getBoundingClientRect();
      return logo.right<=label.left&&label.width>70;
    }),'feature list wordmark and title need separate visual space');
    await upgrade.evaluate(node=>node.scrollIntoView({block:'start'}));
    if(screenshots)await dialog.screenshot({path:path.join(screenshots,'hilfe-standard-featurelist.png')});
    await upgrade.locator('summary').click();
  }
  assert(await dialog.evaluate(node=>{
    const content=node.querySelector('.help-content');
    const close=node.querySelector('.help-close img');
    return close?.complete&&close.naturalWidth>0&&content.scrollWidth<=content.clientWidth+1;
  }));
  assert.equal(await page.evaluate(()=>discoveryCalls),discoveries,'Help reuses the existing Discovery state');
  await classic.locator('details').nth(standardKeys.length-2).evaluate(node=>node.scrollIntoView({block:'start'}));
  if(screenshots)await dialog.screenshot({path:path.join(screenshots,connected?'hilfe-pro.png':'hilfe-standard.png')});
  if(connected){
    await pro.locator('[data-help-section=eye-controls] summary').click();
    await page.evaluate(()=>{proConnection.connected=false;proConnection.dispatchEvent(new Event('disconnected'));});
    await upgrade.waitFor();
    assert.equal(await status.getAttribute('data-connected'),'false');
    assert(await pro.locator('[data-help-section=eye-controls]').evaluate(node=>node.open));
    await page.evaluate(()=>{proConnection.connected=true;proConnection.dispatchEvent(new Event('ready'));});
    await upgrade.waitFor({state:'detached'});
    assert.equal(await status.getAttribute('data-connected'),'true');
  }
  await dialog.locator('.help-close').click();
  assert.equal(await dialog.count(),0);
  assert.equal(await page.locator('#help-shell').count(),0);
}

async function run() {
  const f = fixture({delivery:'custom_components/gewitterradar/frontend',extendHtml:html => html
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
    await assertHubTriggers(desktop);
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
    await phone.setViewportSize({width:393,height:851});
    await assertHubTriggers(phone,true);
    const output=process.env.GR_HELP_SCREENSHOTS;
    if(output)require('node:fs').mkdirSync(output,{recursive:true});
    await assertHelp(phone,true,output);
    await phone.evaluate(()=>{proMode='missing';proConnection.dispatchEvent(new Event('ready'));});
    await standard(phone).waitFor();
    await assertHelp(phone,false,output);
    await phone.evaluate(()=>card._eyeHubOpen());
    assert.match(await phone.locator('#eye-hub-config [data-eye-option=grouped]').textContent(),/Icon-Gruppierung/);
    await phone.locator('#eye-hub-config [data-premium-action=close]').click();
    console.log('PASS packaged Standard and PRO Help, all article controls, live connection state, badges at 320–1177 px, and localised Eye settings');
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

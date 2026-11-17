const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {fixture} = require('./wind-perf-browser-fixture.cjs');

const languageEntity = 'input_select.lightning_detection_language';
const topics = {
  'eye-controls':'eye', 'wr-wind':'wind', 'wr-information':'information',
  'wr-precipitation':'precipitation', 'wr-temperature':'temperature', 'wr-clouds':'clouds',
  'wr-synoptic':'synoptic', 'wr-display':'display'
};

function setup(html, languages) {
  const key = JSON.stringify(languageEntity);
  const options = JSON.stringify(languages);
  return html.replace("state:'Deutsch',attributes:{options:['Deutsch','English']}",
    `state:localStorage.getItem(${key})||'Deutsch',attributes:{options:${options}}`)
    .replace('callService:async()=>{},', `callService:async (domain,service,data) => {
      if (domain === 'input_select' && service === 'select_option' && data.entity_id === ${key}) {
        localStorage.setItem(${key},data.option);
        const hass = card._hass;
        card.hass = {...hass,states:{...hass.states,[${key}]:{state:data.option,attributes:{options:${options}}}}};
      }
    },`);
}

async function checkWeatherPanels(page, name, locale) {
  const panel = page.locator('#weather-synoptic-panel');
  await page.evaluate(() => card._weatherSynopticOpen());
  await panel.waitFor();
  const fronts = panel.locator('[data-section=fronts] > summary');
  assert((await fronts.textContent()).includes(locale['weather.synoptic.fronts']), name + ' fronts');
  assert.equal(await panel.locator('[data-synoptic-setting=isobarOpacity]').getAttribute('aria-label'),locale['weather.synoptic.isobarOpacity']);
  await panel.locator('header [data-premium-action=close]').click();

  await page.evaluate(() => card._weatherWindOpen());
  const wind = page.locator('#weather-wind-panel');
  await wind.waitFor();
  assert.equal(await wind.locator('header strong').textContent(),locale['weather.wind.title']);
  assert.equal(await wind.locator('[data-wind-action=legend]').getAttribute('aria-label'),locale['weather.wind.legend']);
  const performance = wind.locator('summary').filter({hasText:locale['diag.performance']});
  assert.equal(await performance.count(),1,name+' wind diagnostics heading');
  assert.equal(await wind.locator('[data-wind-performance]').textContent(),locale['diag.measureOff']);
  assert(await wind.evaluate(node=>node.scrollWidth-node.clientWidth)<=2,name+' wind panel horizontal overflow');
  await wind.locator('[data-wind-action=close]').click();

  await page.evaluate(() => card._weatherTemperatureOpen());
  const temperature = page.locator('#weather-temperature-panel');
  await temperature.waitFor();
  assert.equal(await temperature.locator('header strong').textContent(),locale['weather.temperature.title']);
  assert((await temperature.locator('[data-section=diagnostic] summary').textContent()).includes(locale['diag.displayDiagnostics']));
  assert.equal(typeof JSON.parse(await temperature.locator('[data-temperature-metrics]').textContent()),'object');
  assert(await temperature.evaluate(node=>node.scrollWidth-node.clientWidth)<=2,name+' temperature panel horizontal overflow');
  await temperature.locator('[data-temperature-action=close]').click();
}

async function checkDiagnostics(page, name, locale) {
  const t=key=>locale['diag.'+key];
  await page.locator('#settings-open').click();
  const navigation=page.locator('#settings-backdrop .gr-horizontal-root');
  assert((await navigation.textContent()).includes(t('weatherEngine')),name+' weather navigation');
  assert((await navigation.textContent()).includes(t('tools')),name+' diagnostic navigation');
  await page.evaluate(() => card._settingsNavigateTo('settings-calibration-section'));
  assert((await page.locator('#settings-calibration-section').innerText()).includes(t('layout')),name+' calibration');
  await page.evaluate(() => card._settingsNavigateTo('settings-weather-diagnostics-section'));
  const weather=page.locator('#settings-weather-diagnostics-section');
  await weather.waitFor({state:'visible'});
  for(const key of ['displayMonitor','interfaceTest','rawData','compareAge','copyDiagnostics']){
    assert.equal(await weather.locator('[data-presentation-text="diag.'+key+'"]').textContent(),t(key),name+' weather diagnostics '+key);
  }
  assert.equal(await weather.locator('#weather-engine-display-detail').getAttribute('aria-pressed'),'false');
  await weather.locator('#weather-engine-display-detail').click();
  assert.equal(await weather.locator('#weather-engine-display-detail').getAttribute('aria-pressed'),'true');
  await weather.locator('#weather-engine-display-detail').click();
  const raw=weather.locator('#weather-engine-diagnostic-raw');
  assert.equal(typeof JSON.parse(await raw.textContent()),'object');
  await page.evaluate(() => card._settingsNavigateTo('settings-data-sources-section'));
  await page.waitForFunction(() => card.shadow.getElementById('data-sources-content')?.childElementCount>=3);
  const sources=page.locator('#settings-data-sources-section');
  for(const key of ['copyJson','downloadJson','savedLocations','lastCheck']){
    assert((await sources.innerText()).includes(t(key)),name+' sources '+key);
  }
  const overflow=await page.locator('#settings-backdrop .settings-body').evaluate(el=>el.scrollWidth-el.clientWidth);
  assert(overflow<=2,name+' diagnostic settings overflow');
  await page.locator('#settings-close').click();
}

async function checkLanguage(page, name, locale) {
  const overlay = page.locator('.help-dialog');
  await page.waitForFunction(({title, key}) =>
    window.card?._helpDialog?.open && card._languageValue() === key &&
    card._helpDialog.querySelector('[data-help-section=wr-information] summary')?.textContent.includes(title),
  {key:name,title:locale.topics.information[0]});
  for (const [id, key] of Object.entries(topics)) {
    const article = overlay.locator(`[data-help-section=${id}]`);
    assert((await article.locator('summary').textContent()).includes(locale.topics[key][0]), name + ' ' + key);
    if (!await article.evaluate(el => el.open)) await article.locator('summary').click();
    assert((await article.locator('.help-section-body').innerText()).includes(
      key === 'eye' ? locale.topics.eye[1][0][1] :
      key === 'information' ? locale.topics.information[1][0][1][0] : locale.topics[key][1][0]
    ), name + ' ' + key + ' content');
    if (key === 'information') {
      assert.deepEqual(await article.locator('h4').allTextContents(),Array.from(locale.topics.information[1],part => part[0]));
      assert.equal(await article.locator('dt').count(),5);
      assert.equal(await article.locator('.help-topic-back').textContent(),locale.labels.back);
    }
    await article.locator('summary').click();
  }
  const profiles = overlay.locator('[data-help-section=weather-display-v411]');
  assert((await profiles.locator('summary').textContent()).includes(locale.profiles.title));
  const featureList = overlay.locator('[data-help-section=wr-pro]');
  if (await featureList.count()) {
    assert((await featureList.locator('summary').textContent()).includes(locale.topics.pro[0]));
    await featureList.locator('summary').click();
    assert((await featureList.innerText()).includes(locale.labels.features));
    await featureList.locator('summary').click();
  }
  const overflow = await overlay.locator('.help-content').evaluate(panel => {
    return [...panel.querySelectorAll('.help-section > summary')].flatMap(summary => {
      const title = summary.children[1];
      if (!title) return [];
      return title.scrollWidth > title.clientWidth + 1 ? [summary.textContent] : [];
    });
  });
  assert.deepEqual(overflow,[],name + ' title overflows');
}

async function run() {
  const fs = require('node:fs/promises');
  const {readExternalAboutLocales} = await import('./verify-about-locales.mjs');
  const {PRESENTATION_LOCALES} = await import('../frontend/modules/ui/presentation-locales.js');
  const ext = readExternalAboutLocales(await fs.readFile('frontend/locales/about-locales.js','utf8')).weatherHelp;
  const languages = ['Deutsch','English',...Object.keys(ext)];
  const browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
  try {
    for (const [delivery, width] of [['custom_components/gewitterradar/frontend',320],['dashboard/dist',1177]]) {
      const runner = fixture({delivery,extendHtml:html => setup(html,languages)});
      await new Promise(resolve => runner.server.listen(0,'127.0.0.1',resolve));
      const ctx = await browser.newContext({viewport:{width,height:820},isMobile:width===320,hasTouch:width===320});
      try {
        const page = await ctx.newPage();
        await runner.route(page);
        const errors = [];
        page.on('pageerror',error => errors.push(error.message));
        await page.goto('http://127.0.0.1:'+runner.server.address().port);
        await page.waitForFunction(() => window.ready && card._map, undefined, {timeout:10000}).catch(error => {
          throw Error('Test card failed to mount: ' + errors.join(', '), {cause:error});
        });
        await page.evaluate(() => card._openHelp());
        const info = page.locator('[data-help-section=wr-information]');
        await info.locator('summary').click();
        for (const language of languages) {
          await info.locator('summary').focus();
          await page.evaluate(async ({key,value}) => {
            const help = card._helpDialog;
            const body = help.querySelector('.help-content');
            body.scrollTop = 0;
            await card._hass.callService('input_select','select_option',{entity_id:key,option:value});
            if (!help.open || !help.querySelector('[data-help-section=wr-information]').open) throw Error('Help article lost its open state');
            if (card.shadow.activeElement !== help.querySelector('[data-help-section=wr-information] summary')) throw Error('Help article lost its focus');
          },{key:languageEntity,value:language});
          if (ext[language]) await checkLanguage(page,language,ext[language]);
          else await info.locator('summary').getByText(language==='Deutsch'?'Wetterinformationen':'Weather information',{exact:false}).first().waitFor();
          const slot = await page.evaluate(() => card._t('eye.choose',{slot:4}));
          assert(slot.includes('4')&&!slot.includes('{slot}'));
          if (ext[language]) assert.notEqual(slot,'Choose function for slot 4',language+' Eye fallback');
          if (!await info.evaluate(el => el.open)) await info.locator('summary').click();
        }
        await page.reload();
        await page.waitForFunction(() => window.ready && card._languageValue() === 'Schwäbisch');
        await page.evaluate(() => card._openHelp());
        await checkLanguage(page,'Schwäbisch',ext.Schwäbisch);
        await page.locator('.help-close').click();
        await page.evaluate(() => card._eyeHubOpen());
        const eye = page.locator('#eye-hub-config');
        await eye.waitFor();
        assert.match(await eye.locator('[data-eye-option=grouped]').textContent(),/zamma gruppiera/);
        const eyeWidth = await eye.evaluate(panel => panel.scrollWidth - panel.clientWidth);
        assert(eyeWidth<=1,'Eye panel overflows in Schwäbisch');
        await eye.locator('[data-premium-action=close]').click();
        for(const language of languages){
          await page.evaluate(({key,value})=>card._hass.callService('input_select','select_option',{entity_id:key,option:value}),{key:languageEntity,value:language});
          await page.waitForFunction(value=>card._languageValue()===value,language);
          await checkWeatherPanels(page,language,PRESENTATION_LOCALES[language]);
          await checkDiagnostics(page,language,PRESENTATION_LOCALES[language]);
        }
        await page.evaluate(()=>card._openProjectHub());
        const hub=page.frameLocator('iframe[title="Daimos Project Hub"]');
        await hub.getByText(PRESENTATION_LOCALES.Schwäbisch['weather.hub.projects'],{exact:true}).waitFor();
        await page.locator('.project-hub-close-premium').click();
        assert.deepEqual(errors,[]);
        console.log(`PASS: ${delivery}, ${width}px, open Help, Eye, synoptic, wind, temperature and HA-state fixture reload across 19 languages.`);
      } finally {
        await ctx.close();
        await new Promise(resolve => runner.server.close(resolve));
      }
    }
  } finally { await browser.close(); }
}

run().catch(error => { console.error(error); process.exitCode = 1; });

import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readAboutLocaleModel,readExternalAboutLocales} from './verify-about-locales.mjs';

const root = fileURLToPath(new URL('..',import.meta.url));
const source = await readFile(resolve(root,'frontend/gewitterradar.js'),'utf8');
const externalSource = await readFile(resolve(root,'frontend/locales/about-locales.js'),'utf8');
const model = readAboutLocaleModel(source,externalSource);
const clone = value => JSON.parse(JSON.stringify(value));
const validate = locales => model.validate(locales,model.settings,model.languages,model.recorderYaml);
const allLocales = {...model.locales,...model.externalLocales};
validate(allLocales);
assert.deepEqual(Object.keys(model.locales),['Deutsch','English']);
for (const table of Object.values(model.tables)) assert.deepEqual(Object.keys(table),['Deutsch','English']);
assert.equal(Object.keys(model.externalLocales).length,17);
assert.equal(model.resolve('Deutsch'),model.locales.Deutsch);
assert.equal(model.resolve('English'),model.locales.English);
for (const name of Object.keys(model.externalLocales)) assert.equal(model.resolve(name),model.locales.English);
assert.equal(model.resolve('__unknown__'),model.locales.English);
assert.equal(model.moduleUrl,'https://frontend.test/locales/about-locales.js');
let rejected = 0;
const invalid = mutate => {
  const locales = clone(allLocales);
  mutate(locales);
  assert.throws(() => validate(locales),/About|German/);
  rejected++;
};
for (const language of Object.keys(allLocales)) {
  for (const group of ['strings','settingLabels','settingPurposes','sourcePurposes']) {
    const key = Object.keys(allLocales[language][group])[0];
    invalid(locales => delete locales[language][group][key]);
    invalid(locales => locales[language][group].unexpected = 'Unexpected');
    invalid(locales => locales[language][group][key] = '  ');
    invalid(locales => locales[language][group][key] = null);
    invalid(locales => locales[language][group] = []);
  }
}
invalid(locales => delete locales.English);
invalid(locales => delete locales.Deutsch);
invalid(locales => locales.Englisch = clone(locales.English));
invalid(locales => locales.Dansk = {strings: clone(locales.English.strings)});
invalid(locales => locales.English.extraGroup = {});
// Exercise the strict build/verify entry point, not just a separately called validator.
assert.throws(() => readAboutLocaleModel(source.replace('strings: ABOUT_STRINGS.English,','strings: {},'),externalSource),/About keys differ/);
assert.throws(() => readExternalAboutLocales(externalSource.replace('export const ABOUT_EXTERNAL_LOCALES = ','const ABOUT_EXTERNAL_LOCALES = ')),/module shape changed/);

for (const group of ['strings','settingLabels','settingPurposes','sourcePurposes']) {
  const incomplete = clone(model.externalLocales);
  incomplete.Dansk = clone(incomplete.Dansk);
  delete incomplete.Dansk[group][Object.keys(incomplete.Dansk[group])[0]];
  assert.throws(() => model.installExternal(incomplete),/About keys differ/);
  assert.equal(model.resolve('Dansk'),model.locales.English);
  rejected++;
}
model.installExternal(model.externalLocales);
for (const {value: language} of model.languages) assert.equal(model.resolve(language),allLocales[language]);
console.log(`PASS: 2 native + 17 external complete bundles and ${rejected} invalid schema/runtime mutations; strict validation rejects every incomplete bundle.`);

const card = Object.create(model.Card.prototype);
let appChecks = 0;
for (const {value: language} of model.languages) {
  card._languageValue = () => language;
  const expected = allLocales[language];
  assert.equal(model.resolve(language),expected);
  for (const [key,value] of Object.entries(expected.strings)) assert.equal(card._t('about.'+key),value);
  const fallback = model.app[model.defaultLanguage]?.strings || {};
  const table = model.app[language]?.strings || fallback;
  for (const key of new Set([...Object.keys(table),...Object.keys(fallback),...Object.keys(model.app.Deutsch.strings)])) {
    if (key.startsWith('about.')) continue;
    assert.equal(card._t(key),String(table[key] ?? fallback[key] ?? model.app.Deutsch.strings[key] ?? key),language+': '+key);
    appChecks++;
  }
}
model.app.English.strings['about.__scope_probe'] = 'Must not leak into About';
card._languageValue = () => 'English';
assert.equal(card._t('about.__scope_probe'),'about.__scope_probe');
console.log(`PASS: all ${model.languages.length} About locales, unknown-language English fallback, About isolation and ${appChecks} unchanged general-I18N resolutions.`);

if (process.argv[2]) {
  const require = createRequire(import.meta.url);
  const {chromium} = require('playwright');
  const anchor = "  customElements.define('gewitterradar-card',GewitterradarCard);";
  const localeRequests = [];
  let localeFailuresRemaining = 0;
  const server = createServer(async (req,res) => {
    const url = new URL(req.url,'http://localhost');
    if (url.pathname === '/about-locale-lazy-probe.html') {
      const delivery = url.searchParams.get('delivery');
      const mainQuery = url.searchParams.get('mainQuery');
      const main = delivery === 'integration' ? '/custom_components/gewitterradar/frontend/gewitterradar.js' : '/dashboard/dist/gewitterradar.js';
      res.setHeader('Content-Type','text/html');
      res.end(`<script type="module">await import(${JSON.stringify(main+'?'+mainQuery)});window.probeReady=true;</script>`);
      return;
    }
    if (url.pathname.endsWith('/locales/about-locales.js')) {
      localeRequests.push({path:url.pathname,search:url.search});
      if (localeFailuresRemaining) { localeFailuresRemaining--; res.writeHead(503).end(); return; }
    }
    const file = resolve(root,'.'+decodeURIComponent(url.pathname));
    if (!file.startsWith(resolve(root)+sep)) {res.writeHead(403).end();return;}
    try {
      let bytes = await readFile(file);
      if (file.endsWith(sep+'gewitterradar.js')) {
        const js = bytes.toString();
        if (js.split(anchor).length !== 2) throw Error('Browser registry anchor changed');
        bytes = Buffer.from(js.replace(anchor,'  window.aboutLocaleRegistry = LANGUAGE_DEFINITIONS;\n  window.aboutLocaleDebug = {resolve:resolveAboutLocale};\n'+anchor));
      }
      res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.png':'image/png','.webp':'image/webp'})[extname(file)]||'text/plain');
      res.end(bytes);
    } catch {res.writeHead(404).end();}
  });
  await new Promise(done => server.listen(0,'127.0.0.1',done));
  let browser;
  try {
    browser = await chromium.launch({executablePath:process.argv[2],headless:true});
    for (const delivery of ['dashboard','integration']) {
      const context = await browser.newContext({viewport:{width:900,height:1000}});
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${server.address().port}/scripts/about-onboarding-harness.html?scenario=first&delivery=${delivery}`);
      await page.waitForFunction(() => window.aboutResult);
      assert.equal((await page.evaluate(() => window.aboutResult)).status,'PASS');
      const languages = await page.evaluate(() => window.aboutLocaleRegistry.map(entry => entry.value));
      assert.deepEqual(languages,clone(model.languages).map(entry => entry.value));
      for (const language of languages) {
        const locale = model.resolve(language);
        await page.evaluate(language => {
          const card = window.aboutCard;
          card._hass.states[card._languageEntity()].state = language;
          card.hass = {...card._hass};
        },language);
        try {
          await page.waitForFunction(expected => {
            const dialog=window.aboutCard._aboutDialog;
            return dialog.querySelector('[data-about-text="title"]').textContent===expected.title &&
              dialog.querySelector('[data-setting="language"] strong').textContent===expected.settingLabel &&
              dialog.querySelector('[data-source="geo_location.lightning_strike*"] .about-purpose').textContent===expected.sourcePurpose;
          },{title:locale.strings.title,settingLabel:locale.settingLabels.language,
            sourcePurpose:locale.sourcePurposes['geo_location.lightning_strike*']},{timeout:3000});
        } catch {
          const state=await page.evaluate(() => {const card=window.aboutCard,node=card._aboutDialog.querySelector('[data-setting="language"] strong'),setting=node.textContent;
            card._syncAbout();return {language:card._languageValue(),title:card._aboutDialog.querySelector('h2').textContent,setting,
              settingAfterSync:node.textContent,resolvedSetting:window.aboutLocaleDebug.resolve(card._languageValue()).settingLabels.language};});
          throw Error(`${delivery}: ${language} did not settle: ${JSON.stringify(state)}`);
        }
        const actual = await page.evaluate(() => {
          const card = window.aboutCard;
          const dialog = card._aboutDialog;
          return {
            title: dialog.querySelector('[data-about-text="title"]').textContent,
            dedicationTitle: dialog.querySelector('[data-about-text="dedicationTitle"]').textContent,
            dedicationText: dialog.querySelector('[data-about-text="dedicationText"]').textContent,
            settingLabel: dialog.querySelector('[data-setting="language"] strong').textContent,
            settingPurpose: dialog.querySelector('[data-setting="language"] .about-purpose').textContent,
            sourcePurposes: Object.fromEntries([...dialog.querySelectorAll('[data-source]')].map(row => [row.dataset.source,row.querySelector('.about-purpose').textContent])),
            signature: dialog.querySelector('.about-signature small').textContent,
            signatureHidden: dialog.querySelector('.about-signature').getAttribute('aria-hidden')
          };
        });
        assert.deepEqual(actual,{
          title:locale.strings.title,dedicationTitle:locale.strings.dedicationTitle,dedicationText:locale.strings.dedicationText,
          settingLabel:locale.settingLabels.language,settingPurpose:locale.settingPurposes.language,
          sourcePurposes:clone(locale.sourcePurposes),signature:'dass du immer an mich glaubst.',signatureHidden:'true'
        },delivery+': '+language);
      }
      console.log(`PASS: ${delivery} browser renders all four About groups for ${languages.length} registry languages.`);
      await context.close();
    }

    localeRequests.length = 0;
    const openProbe = async (delivery,mainQuery,language='Deutsch') => {
      const context = await browser.newContext({viewport:{width:900,height:1000}});
      const page = await context.newPage(), pageErrors = [];
      page.on('pageerror',error => pageErrors.push(String(error)));
      await page.goto(`http://127.0.0.1:${server.address().port}/about-locale-lazy-probe.html?delivery=${delivery}&mainQuery=${encodeURIComponent(mainQuery)}`);
      await page.waitForFunction(() => window.probeReady);
      await page.evaluate(language => {
        localStorage.setItem('gewitterradar-about-onboarding-version','1');
        const states = {
          'switch.gewitterradar_language_initialized':{state:'on',attributes:{}},
          'select.gewitterradar_language':{state:language,attributes:{}},
          'select.gewitterradar_distance_unit':{state:'KM',attributes:{}}
        };
        const hass={config:{version:'probe',unit_system:{length:'km'},latitude:0,longitude:0},states,themes:{theme:'dark'},callService:async()=>{}};
        const card=document.createElement('gewitterradar-card');card.setConfig({});card.hass=hass;document.body.append(card);
        window.probeCard=card;
      },language);
      return {context,page,pageErrors};
    };
    const select = async (page,language) => {
      await page.evaluate(language => {
        const card=window.probeCard;
        card._hass.states[card._languageEntity()].state=language;
        card.hass={...card._hass};
      },language);
      await page.waitForFunction(title => window.probeCard._aboutDialog?.querySelector('[data-about-text="title"]')?.textContent===title,
        allLocales[language].strings.title);
    };

    const native = await openProbe('dashboard','hactag=lazy-native');
    assert.equal(localeRequests.length,0,'normal card start loaded external locales');
    await native.page.evaluate(() => window.probeCard._openAbout());
    assert.equal(localeRequests.length,0,'German About loaded external locales');
    await select(native.page,'English');
    assert.equal(localeRequests.length,0,'English About loaded external locales');
    await select(native.page,'Dansk');
    assert.deepEqual(localeRequests,[{path:'/dashboard/dist/locales/about-locales.js',search:'?hactag=lazy-native'}]);
    await native.page.evaluate(text => {window.probeCard._aboutDialog.querySelector('.about-copy-status').textContent=text;},allLocales.Dansk.strings.copied);
    await select(native.page,'Français');
    assert.equal(await native.page.evaluate(() => window.probeCard._aboutDialog.querySelector('.about-copy-status').textContent),'');
    await native.page.evaluate(() => {window.probeCard._closeAbout();window.probeCard._openAbout();});
    await select(native.page,'Schwäbisch');
    assert.equal(localeRequests.length,1,'cached external locales were requested again');
    assert.deepEqual(native.pageErrors,[]);
    await native.context.close();

    const manual = await openProbe('integration','manual=d158c7e','Español');
    assert.equal(localeRequests.length,1,'external locales loaded during normal card start');
    await manual.page.evaluate(() => window.probeCard._openAbout());
    await manual.page.waitForFunction(title => window.probeCard._aboutDialog.querySelector('[data-about-text="title"]').textContent===title,
      allLocales.Español.strings.title);
    assert.deepEqual(localeRequests[1],{path:'/custom_components/gewitterradar/frontend/locales/about-locales.js',search:'?manual=d158c7e'});
    assert.deepEqual(manual.pageErrors,[]);
    await manual.context.close();

    localeFailuresRemaining = 1;
    const retry = await openProbe('dashboard','hactag=retry','Dansk');
    await retry.page.evaluate(() => window.probeCard._openAbout());
    await retry.page.waitForTimeout(150);
    assert.equal(localeRequests.length,3,'failed external import was not attempted exactly once');
    const fallback = await retry.page.evaluate(() => {
      const dialog=window.probeCard._aboutDialog;
      return {
        title:dialog.querySelector('[data-about-text="title"]').textContent,
        dedication:dialog.querySelector('[data-about-text="dedicationTitle"]').textContent,
        setting:dialog.querySelector('[data-setting="language"] strong').textContent,
        sources:Object.fromEntries([...dialog.querySelectorAll('[data-source]')].map(row=>[row.dataset.source,row.querySelector('.about-purpose').textContent]))
      };
    });
    assert.deepEqual(fallback,{title:model.locales.English.strings.title,dedication:model.locales.English.strings.dedicationTitle,
      setting:model.locales.English.settingLabels.language,sources:clone(model.locales.English.sourcePurposes)});
    await retry.page.evaluate(() => window.probeCard._syncAbout());
    await retry.page.waitForFunction(title => window.probeCard._aboutDialog.querySelector('[data-about-text="title"]').textContent===title,
      allLocales.Dansk.strings.title);
    assert.equal(localeRequests.length,4,'failed external import was not retried');
    assert.deepEqual(localeRequests.slice(2).map(request=>request.search),['?hactag=retry','?hactag=retry']);
    assert.deepEqual(retry.pageErrors,[],'external import failure escaped as an unhandled rejection');
    await retry.context.close();
    console.log('PASS: lazy native startup/About, external loading, caching, full English failure fallback, retry and cache-buster inheritance.');
  } finally {
    if (browser) await browser.close();
    await new Promise(done => server.close(done));
  }
}

import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readAboutLocaleModel,loadAboutLocaleRuntime} from './verify-about-locales.mjs';

const root = fileURLToPath(new URL('..',import.meta.url));
const source = await readFile(resolve(root,'frontend/gewitterradar.js'),'utf8');
const model = readAboutLocaleModel(source);
const clone = value => JSON.parse(JSON.stringify(value));
const validate = locales => model.validate(locales,model.settings,model.languages,model.recorderYaml);
validate(model.locales);
let rejected = 0;
const invalid = mutate => {
  const locales = clone(model.locales);
  mutate(locales);
  assert.throws(() => validate(locales),/About|German/);
  rejected++;
};
for (const language of ['Deutsch','English']) {
  for (const group of ['strings','settingLabels','settingPurposes','sourcePurposes']) {
    const key = Object.keys(model.locales[language][group])[0];
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
assert.throws(() => readAboutLocaleModel(source.replace('strings: ABOUT_STRINGS.English,','strings: {},')),/About keys differ/);
console.log(`PASS: German master/English fallback and ${rejected} invalid schema mutations; build/verify rejects an incomplete locale.`);

// The same declared incomplete bundle must survive registration but fail strict validation.
const localeAnchor = '  const ABOUT_LOCALES = {';
assert.equal(source.split(localeAnchor).length,2);
const incompleteSource = source.replace(localeAnchor,localeAnchor+'\n    Dansk: {strings: {}},');
let runtime;
assert.doesNotThrow(() => { runtime = loadAboutLocaleRuntime(incompleteSource); });
assert.equal(runtime.resolve('Deutsch'),runtime.locales.Deutsch);
assert.equal(runtime.resolve('English'),runtime.locales.English);
assert.doesNotThrow(() => assert.equal(runtime.resolve('Dansk'),runtime.locales.English));
assert.throws(() => readAboutLocaleModel(incompleteSource),/Invalid About bundle: Dansk/);
console.log('PASS: incomplete declared locale: Runtime -> English; Strict Validator -> rejected; production card registration succeeds.');

for (const group of ['strings','settingLabels','settingPurposes','sourcePurposes']) {
  const incomplete = clone(model.locales.English);
  delete incomplete[group][Object.keys(incomplete[group])[0]];
  model.locales.Dansk = incomplete;
  assert.doesNotThrow(() => assert.equal(model.resolve('Dansk'),model.locales.English));
  assert.throws(() => validate(model.locales),/About keys differ/);
}
delete model.locales.Dansk;

const card = Object.create(model.Card.prototype);
let appChecks = 0;
for (const {value: language} of model.languages) {
  card._languageValue = () => language;
  const expected = model.locales[language] || model.locales.English;
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
// A future complete registry locale works with no rendering branch changes.
const future = clone(model.locales.English);
future.strings.title = 'Future locale test';
future.settingLabels.language = 'Future setting label';
model.locales.Dansk = future;
validate(model.locales);
assert.equal(model.resolve('Dansk'),future);
delete model.locales.Dansk;
assert.equal(model.resolve('Dansk'),model.locales.English);
model.app.English.strings['about.__scope_probe'] = 'Must not leak into About';
card._languageValue = () => 'English';
assert.equal(card._t('about.__scope_probe'),'about.__scope_probe');
console.log(`PASS: ${model.languages.length} registry locales, future locale activation, About isolation and ${appChecks} unchanged general-I18N resolutions.`);

if (process.argv[2]) {
  const require = createRequire(import.meta.url);
  const {chromium} = require('playwright');
  const anchor = "  customElements.define('gewitterradar-card',GewitterradarCard);";
  const server = createServer(async (req,res) => {
    const url = new URL(req.url,'http://localhost');
    const file = resolve(root,'.'+decodeURIComponent(url.pathname));
    if (!file.startsWith(resolve(root)+sep)) {res.writeHead(403).end();return;}
    try {
      let bytes = await readFile(file);
      if (file.endsWith(sep+'gewitterradar.js')) {
        const js = bytes.toString();
        if (js.split(anchor).length !== 2) throw Error('Browser registry anchor changed');
        bytes = Buffer.from(js.replace(anchor,'  window.aboutLocaleRegistry = LANGUAGE_DEFINITIONS;\n'+anchor));
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
        const actual = await page.evaluate(language => {
          const card = window.aboutCard;
          card._hass.states[card._languageEntity()].state = language;
          card.hass = {...card._hass};
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
        },language);
        const locale = model.resolve(language);
        assert.deepEqual(actual,{
          title:locale.strings.title,dedicationTitle:locale.strings.dedicationTitle,dedicationText:locale.strings.dedicationText,
          settingLabel:locale.settingLabels.language,settingPurpose:locale.settingPurposes.language,
          sourcePurposes:clone(locale.sourcePurposes),signature:'dass du immer an mich glaubst.',signatureHidden:'true'
        },delivery+': '+language);
      }
      console.log(`PASS: ${delivery} browser renders all four About groups for ${languages.length} registry languages.`);
      await context.close();
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(done => server.close(done));
  }
}

import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';

export function readExternalAboutLocales(source) {
  const requiredExports = ['ABOUT_EXTERNAL_LOCALES','HELP_EXTERNAL_LOCALES','HELP_EXTERNAL_LOCALES_V40753'];
  for (const name of requiredExports) {
    const anchor = `export const ${name} = `;
    if (source.split(anchor).length !== 2) throw Error(`External About locale export changed: ${name}`);
  }
  if (!source.trimEnd().endsWith(';')) throw Error('External About locale module shape changed');
  const context = {};
  const executable = source.replace(/export const ([A-Za-z0-9_]+)\s*=/g,'globalThis.$1 =');
  runInNewContext(executable,context,{timeout:3000,filename:'about-locales.js'});
  if (!context.ABOUT_EXTERNAL_LOCALES || !context.HELP_EXTERNAL_LOCALES || !context.HELP_EXTERNAL_LOCALES_V40753) {
    throw Error('External About/Help locales were not exported');
  }
  return {
    about: context.ABOUT_EXTERNAL_LOCALES,
    help: context.HELP_EXTERNAL_LOCALES_V40753,
    genericHelp: context.HELP_EXTERNAL_LOCALES,
    historicalHelp: context.HELP_EXTERNAL_LOCALES_V40731 ?? null,
    weatherHelp: context.WEATHER_EXTERNAL_LOCALES ?? null
  };
}

export function validateWeatherHelp(locales, languages) {
  const fields = (object, keys, path) => {
    assert(object && typeof object === 'object' && !Array.isArray(object), path);
    assert.deepEqual(Object.keys(object).sort(), [...keys].sort(), path);
  };
  const list = (items, size, path) => {
    assert(Array.isArray(items), path);
    assert.equal(items.length, size, path);
    return items;
  };
  const string = (value, path) => assert(typeof value === 'string' && value.trim(), path);
  const strings = (items, size, path) => list(items, size, path).forEach(value => string(value, path));
  fields(locales, languages, 'Weather Help languages');
  for (const [language, locale] of Object.entries(locales)) {
    fields(locale, ['labels', 'topics', 'profiles'], language);
    const path = language + ' Weather Help';
    const {labels, topics, profiles} = locale;
    fields(labels, ['back','connected','disconnected','what','description','how','features','standard','mapNote'], path);
    Object.values(labels).forEach(value => string(value, path));
    assert.deepEqual(labels.mapNote.match(/\{[^}]*\}/g), ['{router}'], path);
    const simpleTopics = {wind:4, precipitation:4, temperature:3, clouds:2, synoptic:2, display:1};
    fields(topics, ['eye','information','pro', ...Object.keys(simpleTopics)], path);
    for (const [key, count] of Object.entries(simpleTopics)) {
      const [title, paragraphs] = list(topics[key], 2, path);
      string(title, path);
      strings(paragraphs, count, path);
    }
    const [eyeTitle, eyeParagraphs] = list(topics.eye, 2, path);
    string(eyeTitle, path);
    const iconByIndex = new Map([[0,'eye'],[2,'precipitation'],[3,'display']]);
    list(eyeParagraphs, 7, path).forEach((paragraph, index) => {
      if (!iconByIndex.has(index)) return string(paragraph, path);
      const [icon, content] = list(paragraph, 2, path);
      assert.equal(icon, iconByIndex.get(index), path);
      string(content, path);
    });
    const [infoTitle, information] = list(topics.information, 2, path);
    string(infoTitle, path);
    const [source, update] = list(information, 2, path);
    const [sourceTitle, sourceParagraphs] = list(source, 2, path);
    const [updateTitle, updateParagraphs, terms] = list(update, 3, path);
    string(sourceTitle, path);
    string(updateTitle, path);
    strings(sourceParagraphs, 2, path);
    strings(updateParagraphs, 1, path);
    list(terms, 5, path).forEach(term => strings(term, 2, path));
    const [proTitle, introduction, features] = list(topics.pro, 3, path);
    string(proTitle, path);
    strings(introduction, 2, path);
    strings(features, 6, path);
    fields(profiles, ['title','intro','entries'], path);
    string(profiles.title, path);
    string(profiles.intro, path);
    list(profiles.entries, 4, path).forEach(entry => {
      fields(entry, ['term','description'], path);
      string(entry.term, path);
      string(entry.description, path);
    });
  }
}

// Evaluate production registration without constructing a card or providing Home Assistant.
export function loadAboutLocaleRuntime(source,baseContextSource) {
  const anchor = "  customElements.define('gewitterradar-card',GewitterradarCard);";
  const iifeStart = source.indexOf('(function () {');
  const iifeEnd = source.lastIndexOf('})();');
  if (iifeStart < 0 || iifeEnd < iifeStart) throw Error('About verification app IIFE changed');
  let runtimeSource = source.slice(iifeStart,iifeEnd + 5)
    // The locale VM injects the exact legacy core from core/base-context.js below.
    // Strip only the production module-bootstrap shell; production preflight remains intact.
    .replace(/^\s*const __moduleDeps=.*;\s*$/gm,'')
    .replace(/^\s*if\(!__moduleDeps\s*\|\|\s*!Array\.isArray\(__moduleDeps\.LANGUAGE_DEFINITIONS\)\s*\|\|\s*!__moduleDeps\.LANGUAGE_DEFINITIONS\.length\)\{\s*\n\s*throw new Error\('Gewitterradar core\.base-context did not provide LANGUAGE_DEFINITIONS'\);\s*\n\s*\}\s*$/gm,'')
    .replace(/^\s*window\.__GEWITTERRADAR_BOOT_DIAGNOSTICS=.*__moduleDeps\.LANGUAGE_DEFINITIONS\.length.*;\s*$/gm,'')
    .replace(/^\s*Object\.(?:defineProperties|assign)\(__moduleDeps,.*;\s*$/gm,'')
    .replace(/^\s*install[A-Za-z0-9_]+\(GewitterradarCard,__moduleDeps\);\s*$/gm,'');
  if (runtimeSource.includes('__moduleDeps')) {
    throw Error('About verification module-bootstrap stripping is incomplete');
  }
  if(baseContextSource){
    const start='  // BEGIN GEWITTERRADAR LEGACY CORE',end='  // END GEWITTERRADAR LEGACY CORE';
    const a=baseContextSource.indexOf(start),b=baseContextSource.indexOf(end);
    if(a<0||b<=a)throw Error('About verification base-context markers changed');
    const core=baseContextSource.slice(a+start.length,b);
    runtimeSource=runtimeSource.replace('(function () {',`(function () {\n  const rootModuleUrl='https://frontend.test/gewitterradar.js';${core}`);
  }
  if (runtimeSource.split(anchor).length !== 2) throw Error('About verification registration anchor changed');
  const script = runtimeSource.replaceAll('import.meta.url', "'https://frontend.test/gewitterradar.js'")
    .replace(anchor, `  globalThis.aboutLocaleModel = {
      locales: ABOUT_LOCALES, settings: SETTING_ENTITIES, languages: LANGUAGE_DEFINITIONS,
      tables: {strings:ABOUT_STRINGS,settingLabels:ABOUT_SETTING_LABELS,settingPurposes:ABOUT_SETTING_PURPOSES,sourcePurposes:ABOUT_SOURCE_PURPOSES,help:HELP_STRINGS},
      recorderYaml: ABOUT_RECORDER_YAML, validate: validateAboutLocales,
      resolve: resolveAboutLocale,
      resolveWeatherHelp: typeof resolveWeatherHelpLocale === 'function' ? resolveWeatherHelpLocale : null,
      installExternal: typeof installAboutExternalLocales === 'function' ? installAboutExternalLocales : null,
      externalNames: typeof ABOUT_EXTERNAL_LANGUAGE_NAMES === 'undefined' ? new Set() : ABOUT_EXTERNAL_LANGUAGE_NAMES,
      moduleUrl: typeof ABOUT_LOCALE_MODULE_URL === 'undefined' ? null : ABOUT_LOCALE_MODULE_URL,
      Card: GewitterradarCard, app: I18N, defaultLanguage: LANGUAGE_DEFAULT
    };\n` + anchor);
  const registered = new Map();
  const context = {URL, HTMLElement: class {}, customElements: {
    get: name => registered.get(name), define: (name, card) => registered.set(name, card)
  }, window: {}};
  runInNewContext(script, context, {timeout: 3000, filename: 'gewitterradar.js'});
  const model = context.aboutLocaleModel;
  if (!model || registered.get('gewitterradar-card') !== model.Card) throw Error('About card registration was not reached');

  // V4.10: production translation methods are installed by ui.i18n-settings.
  // The isolated locale VM intentionally does not execute application modules,
  // so install the exact translation semantics needed by this locale contract.
  if (typeof model.Card.prototype._t !== 'function') {
    model.Card.prototype._t = function (key, vars = {}) {
      const language = this._languageValue();
      const fallback = model.app[model.defaultLanguage]?.strings || {};
      const table = model.app[language]?.strings || fallback;
      const aboutKey = key.startsWith('about.') ? key.slice(6) : null;
      let text = aboutKey
        ? model.resolve(language).strings[aboutKey] ?? key
        : table[key] ?? fallback[key] ?? model.app.Deutsch?.strings?.[key] ?? key;
      return String(text).replace(/\{([a-zA-Z0-9_]+)\}/g,(_,name) =>
        Object.prototype.hasOwnProperty.call(vars,name) ? String(vars[name]) : `{${name}}`
      );
    };
  }
  return model;
}

// Verify the exact production external Help bundle, but return an uninstalled runtime so
// the test suite can still exercise native fallback -> rejected install -> successful lazy install.
export function readAboutLocaleModel(source, externalSource, baseContextSource) {
  const model = loadAboutLocaleRuntime(source,baseContextSource);
  model.validate(model.locales,model.settings,model.languages,model.recorderYaml);
  if (externalSource !== undefined) {
    if (typeof model.installExternal !== 'function' || !model.moduleUrl) throw Error('External About locale runtime is missing');
    const external = readExternalAboutLocales(externalSource);
    const validationModel = loadAboutLocaleRuntime(source,baseContextSource);
    const installed = validationModel.installExternal(external.about,external.help,external.weatherHelp);
    const expected = model.languages.map(entry => entry.value).filter(name => !Object.hasOwn(model.locales,name));
    if (JSON.stringify(Object.keys(installed)) !== JSON.stringify(expected)) {
      throw Error('External About locales must exactly match non-native LANGUAGE_DEFINITIONS');
    }
    model.externalAboutLocales = external.about;
    model.externalHelpLocales = external.help;
    if (validationModel.resolveWeatherHelp) {
      validateWeatherHelp(external.weatherHelp, expected);
      for (const name of expected) assert.equal(validationModel.resolveWeatherHelp(name), external.weatherHelp[name]);
    }
    model.externalWeatherHelpLocales = external.weatherHelp;
    model.externalLocales = installed;
  }
  return model;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const source = await readFile(new URL('../frontend/gewitterradar.js',import.meta.url),'utf8');
  const externalSource = await readFile(new URL('../frontend/locales/about-locales.js',import.meta.url),'utf8');
  const baseContextSource = await readFile(new URL('../frontend/modules/core/base-context.js',import.meta.url),'utf8');
  const model = readAboutLocaleModel(source,externalSource,baseContextSource);
  console.log(`PASS: ${Object.keys(model.locales).length} native and ${Object.keys(model.externalLocales).length} external About bundles; ${model.languages.length} registered languages.`);
}

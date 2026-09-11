import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';

export function readExternalAboutLocales(source) {
  const aboutAnchor = 'export const ABOUT_EXTERNAL_LOCALES = ';
  const helpAnchor = 'export const HELP_EXTERNAL_LOCALES = ';
  if (source.split(aboutAnchor).length !== 2 || source.split(helpAnchor).length !== 2 || !source.trimEnd().endsWith(';')) {
    throw Error('External About locale module shape changed');
  }
  const context = {};
  runInNewContext(source.replace(aboutAnchor,'globalThis.externalAboutLocales = ')
    .replace(helpAnchor,'globalThis.externalHelpLocales = '),context,
    {timeout:3000,filename:'about-locales.js'});
  if (!context.externalAboutLocales || !context.externalHelpLocales) throw Error('External About/Help locales were not exported');
  return {about:context.externalAboutLocales,help:context.externalHelpLocales};
}

// Evaluate production registration without constructing a card or providing Home Assistant.
export function loadAboutLocaleRuntime(source) {
  const anchor = "  customElements.define('gewitterradar-card',GewitterradarCard);";
  if (source.split(anchor).length !== 2) throw Error('About verification registration anchor changed');
  const script = source.replaceAll('import.meta.url', "'https://frontend.test/gewitterradar.js'")
    .replace(anchor, `  globalThis.aboutLocaleModel = {
      locales: ABOUT_LOCALES, settings: SETTING_ENTITIES, languages: LANGUAGE_DEFINITIONS,
      tables: {strings:ABOUT_STRINGS,settingLabels:ABOUT_SETTING_LABELS,settingPurposes:ABOUT_SETTING_PURPOSES,sourcePurposes:ABOUT_SOURCE_PURPOSES,help:HELP_STRINGS},
      recorderYaml: ABOUT_RECORDER_YAML, validate: validateAboutLocales,
      resolve: resolveAboutLocale,
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
  return model;
}

// Build and verify always apply strict validation after evaluating the production module.
export function readAboutLocaleModel(source, externalSource) {
  const model = loadAboutLocaleRuntime(source);
  model.validate(model.locales,model.settings,model.languages,model.recorderYaml);
  if (externalSource !== undefined) {
    if (typeof model.installExternal !== 'function' || !model.moduleUrl) throw Error('External About locale runtime is missing');
    const external = readExternalAboutLocales(externalSource);
    const externalLocales = Object.fromEntries(Object.entries(external.about).map(([name,locale]) => [name,{...locale,help:external.help[name]}]));
    model.validate({...model.locales,...externalLocales},model.settings,model.languages,model.recorderYaml);
    const expected = model.languages.map(entry => entry.value).filter(name => !Object.hasOwn(model.locales,name));
    if (JSON.stringify(Object.keys(externalLocales)) !== JSON.stringify(expected)) {
      throw Error('External About locales must exactly match non-native LANGUAGE_DEFINITIONS');
    }
    model.externalAboutLocales = external.about;
    model.externalHelpLocales = external.help;
    model.externalLocales = externalLocales;
  }
  return model;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const source = await readFile(new URL('../frontend/gewitterradar.js',import.meta.url),'utf8');
  const externalSource = await readFile(new URL('../frontend/locales/about-locales.js',import.meta.url),'utf8');
  const model = readAboutLocaleModel(source,externalSource);
  console.log(`PASS: ${Object.keys(model.locales).length} native and ${Object.keys(model.externalLocales).length} external About bundles; ${model.languages.length} registered languages.`);
}

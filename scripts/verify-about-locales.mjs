import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';

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
    historicalHelp: context.HELP_EXTERNAL_LOCALES_V40731 ?? null
  };
}

// Evaluate production registration without constructing a card or providing Home Assistant.
export function loadAboutLocaleRuntime(source) {
  const anchor = "  customElements.define('gewitterradar-card',GewitterradarCard);";
  const iifeStart = source.indexOf('(function () {');
  const iifeEnd = source.lastIndexOf('})();');
  if (iifeStart < 0 || iifeEnd < iifeStart) throw Error('About verification app IIFE changed');
  const runtimeSource = source.slice(iifeStart,iifeEnd + 5)
    .replace(/^\s*const __moduleDeps=.*;\s*$/gm,'')
    .replace(/^\s*Object\.defineProperties\(__moduleDeps,.*;\s*$/gm,'')
    .replace(/^\s*install[A-Za-z0-9_]+\(GewitterradarCard,__moduleDeps\);\s*$/gm,'');
  if (runtimeSource.split(anchor).length !== 2) throw Error('About verification registration anchor changed');
  const script = runtimeSource.replaceAll('import.meta.url', "'https://frontend.test/gewitterradar.js'")
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

// Verify the exact production external Help bundle, but return an uninstalled runtime so
// the test suite can still exercise native fallback -> rejected install -> successful lazy install.
export function readAboutLocaleModel(source, externalSource) {
  const model = loadAboutLocaleRuntime(source);
  model.validate(model.locales,model.settings,model.languages,model.recorderYaml);
  if (externalSource !== undefined) {
    if (typeof model.installExternal !== 'function' || !model.moduleUrl) throw Error('External About locale runtime is missing');
    const external = readExternalAboutLocales(externalSource);
    const validationModel = loadAboutLocaleRuntime(source);
    const installed = validationModel.installExternal(external.about,external.help);
    const expected = model.languages.map(entry => entry.value).filter(name => !Object.hasOwn(model.locales,name));
    if (JSON.stringify(Object.keys(installed)) !== JSON.stringify(expected)) {
      throw Error('External About locales must exactly match non-native LANGUAGE_DEFINITIONS');
    }
    model.externalAboutLocales = external.about;
    model.externalHelpLocales = external.help;
    model.externalLocales = installed;
  }
  return model;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const source = await readFile(new URL('../frontend/gewitterradar.js',import.meta.url),'utf8');
  const externalSource = await readFile(new URL('../frontend/locales/about-locales.js',import.meta.url),'utf8');
  const model = readAboutLocaleModel(source,externalSource);
  console.log(`PASS: ${Object.keys(model.locales).length} native and ${Object.keys(model.externalLocales).length} external About bundles; ${model.languages.length} registered languages.`);
}

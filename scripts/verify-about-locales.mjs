import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';

// Evaluate production registration without constructing a card or providing Home Assistant.
export function loadAboutLocaleRuntime(source) {
  const anchor = "  customElements.define('gewitterradar-card',GewitterradarCard);";
  if (source.split(anchor).length !== 2) throw Error('About verification registration anchor changed');
  const script = source.replaceAll('import.meta.url', "'https://frontend.test/gewitterradar.js'")
    .replace(anchor, `  globalThis.aboutLocaleModel = {
      locales: ABOUT_LOCALES, settings: SETTING_ENTITIES, languages: LANGUAGE_DEFINITIONS,
      recorderYaml: ABOUT_RECORDER_YAML, validate: validateAboutLocales,
      resolve: resolveAboutLocale, Card: GewitterradarCard, app: I18N, defaultLanguage: LANGUAGE_DEFAULT
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
export function readAboutLocaleModel(source) {
  const model = loadAboutLocaleRuntime(source);
  model.validate(model.locales,model.settings,model.languages,model.recorderYaml);
  return model;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const source = await readFile(new URL('../frontend/gewitterradar.js',import.meta.url),'utf8');
  const model = readAboutLocaleModel(source);
  console.log(`PASS: About bundles ${Object.keys(model.locales).join(', ')}; ${model.languages.length} registered languages.`);
}

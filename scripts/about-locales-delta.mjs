// Exact, fail-closed additions to the existing approved frontend delta.
export function aboutLocalesDelta(source) {
  const once = (from, to) => {
    if (source.split(from).length !== 2) throw Error('About locale anchor changed: ' + from.slice(0, 80));
    source = source.replace(from, to);
  };
  const nextSection = '  // V3.99711 – sprachabhängige Kurzformen für die KPI-Zeitangabe "Zuletzt".\n  const AGE_SHORT_UNITS = {';
  once(nextSection, localeArchitecture + nextSection);
  once("      let text = (aboutKey ? ABOUT_STRINGS[language]?.[aboutKey] ?? ABOUT_STRINGS[LANGUAGE_DEFAULT]?.[aboutKey] : undefined)\n        ?? table[key] ?? fallback[key] ?? I18N['Deutsch']?.strings?.[key] ?? key;",
    "      let text = aboutKey\n        ? resolveAboutLocale(language).strings[aboutKey] ?? key\n        : table[key] ?? fallback[key] ?? I18N['Deutsch']?.strings?.[key] ?? key;");
  once('      const t = (key) => this._t(`about.${key}`);\n      for (const node',
    '      const locale = resolveAboutLocale(this._languageValue());\n      const t = (key) => locale.strings[key];\n      for (const node');
  once('      const labels = ABOUT_SETTING_LABELS[this._languageValue()] || ABOUT_SETTING_LABELS[LANGUAGE_DEFAULT];\n      const purposes = ABOUT_SETTING_PURPOSES[this._languageValue()] || ABOUT_SETTING_PURPOSES[LANGUAGE_DEFAULT];\n      const sourcePurposes = ABOUT_SOURCE_PURPOSES[this._languageValue()] || ABOUT_SOURCE_PURPOSES[LANGUAGE_DEFAULT];',
    '      const {settingLabels: labels, settingPurposes: purposes, sourcePurposes} = locale;');
  once('      const locale = resolveAboutLocale(this._languageValue());\n      const t = (key) => locale.strings[key];',
    '      const language = this._languageValue();\n      const locale = resolveAboutLocale(language);\n      const status = dialog.querySelector(\'.about-copy-status\');\n      if (this._aboutStatusLanguage !== language || this._aboutStatusLocale !== locale) status.textContent = \'\';\n      this._aboutStatusLanguage = language; this._aboutStatusLocale = locale;\n      const t = (key) => locale.strings[key];');
  once("      for (const row of dialog.querySelectorAll('[data-setting]')) {",
    "      requestAboutLocale(language, () => {\n        if (this._aboutDialog === dialog && this._languageValue() === language) this._syncAbout();\n      });\n      for (const row of dialog.querySelectorAll('[data-setting]')) {");
  once("      const dynamicRoots = new Set([\n        'header-status'",
    "      const dynamicRoots = new Set([\n        'about-shell','header-status'");
  return source;
}

const localeArchitecture = String.raw`  // One resolved bundle owns every About text. Existing tables are only data inputs.
  // Deutsch/English stay native; other registered languages are loaded as one module on About demand.
  const ABOUT_LOCALES = {
    Deutsch: {
      strings: ABOUT_STRINGS.Deutsch,
      settingLabels: ABOUT_SETTING_LABELS.Deutsch,
      settingPurposes: ABOUT_SETTING_PURPOSES.Deutsch,
      sourcePurposes: ABOUT_SOURCE_PURPOSES.Deutsch
    },
    English: {
      strings: ABOUT_STRINGS.English,
      settingLabels: ABOUT_SETTING_LABELS.English,
      settingPurposes: ABOUT_SETTING_PURPOSES.English,
      sourcePurposes: ABOUT_SOURCE_PURPOSES.English
    }
  };
  const ABOUT_EXTERNAL_LANGUAGE_NAMES = new Set(LANGUAGE_DEFINITIONS
    .map(entry => entry.value).filter(name => !Object.hasOwn(ABOUT_LOCALES,name)));
  const ABOUT_LOCALE_MODULE_URL = (() => {
    const main = new URL(import.meta.url), module = new URL('./locales/about-locales.js',main);
    module.search = main.search;
    return module.href;
  })();
  let aboutExternalLocales = null, aboutExternalLocalesLoading = null, aboutExternalLocaleAttempt = 0;

  function validateAboutLocales(locales, settings, languages, recorderYaml) {
    const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
    if (!object(locales) || !Object.hasOwn(locales,'Deutsch') || !Object.hasOwn(locales,'English')) {
      throw Error('About locales require Deutsch master and English fallback');
    }
    const master = locales.Deutsch;
    if (!object(master?.strings) || !Object.keys(master.strings).length || !object(master?.sourcePurposes)) {
      throw Error('Invalid German About master');
    }
    const sourceKeys = [...recorderYaml.matchAll(/^\s+- "?([^"\s]+)"?$/gm)].map(match => match[1]);
    const sameKeys = (value, keys) => object(value)
      && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value,key));
    if (sourceKeys.length !== 4 || new Set(sourceKeys).size !== 4 || !sameKeys(master.sourcePurposes,sourceKeys)) {
      throw Error('German About sources must match the four Recorder sources');
    }
    const groups = {
      strings: Object.keys(master.strings),
      settingLabels: Object.keys(settings),
      settingPurposes: Object.keys(settings),
      sourcePurposes: Object.keys(master.sourcePurposes)
    };
    for (const [name, locale] of Object.entries(locales)) {
      if (!languages.some(entry => entry.value === name)) throw Error('Unregistered About locale: ' + name);
      if (!sameKeys(locale,Object.keys(groups))) throw Error('Invalid About bundle: ' + name);
      for (const [group, keys] of Object.entries(groups)) {
        if (!sameKeys(locale[group],keys)) throw Error('About keys differ: ' + name + '.' + group);
        for (const key of keys) {
          if (typeof locale[group][key] !== 'string' || !locale[group][key].trim()) {
            throw Error('Empty/non-string About value: ' + name + '.' + group + '.' + key);
          }
        }
      }
    }
  }

  function isAboutLocaleComplete(locale) {
    try {
      // Reuse the strict schema for this candidate without validating other optional bundles.
      validateAboutLocales({Deutsch: ABOUT_LOCALES.Deutsch, English: locale},
        SETTING_ENTITIES, LANGUAGE_DEFINITIONS, ABOUT_RECORDER_YAML);
      return true;
    } catch {
      return false;
    }
  }

  function installAboutExternalLocales(locales) {
    const combined = {...ABOUT_LOCALES,...locales};
    validateAboutLocales(combined,SETTING_ENTITIES,LANGUAGE_DEFINITIONS,ABOUT_RECORDER_YAML);
    if (Object.keys(locales).length !== ABOUT_EXTERNAL_LANGUAGE_NAMES.size ||
        [...ABOUT_EXTERNAL_LANGUAGE_NAMES].some(name => !Object.hasOwn(locales,name))) {
      throw Error('External About locales must cover every non-native registered language');
    }
    aboutExternalLocales = locales;
    return locales;
  }

  function loadAboutExternalLocales() {
    if (aboutExternalLocales) return Promise.resolve(aboutExternalLocales);
    if (aboutExternalLocalesLoading) return aboutExternalLocalesLoading;
    const url = new URL(ABOUT_LOCALE_MODULE_URL), attempt = aboutExternalLocaleAttempt++;
    if (attempt) url.hash = 'retry-' + attempt;
    aboutExternalLocalesLoading = import(url.href)
      .then(module => installAboutExternalLocales(module.ABOUT_EXTERNAL_LOCALES))
      .catch(() => null)
      .finally(() => { aboutExternalLocalesLoading = null; });
    return aboutExternalLocalesLoading;
  }

  function requestAboutLocale(language, onLoaded) {
    if (!ABOUT_EXTERNAL_LANGUAGE_NAMES.has(language) || aboutExternalLocales?.[language]) return;
    loadAboutExternalLocales().then(locales => { if (locales?.[language]) onLoaded(); });
  }

  function resolveAboutLocale(language) {
    const candidate = LANGUAGE_DEFINITIONS.some(entry => entry.value === language)
      ? ABOUT_LOCALES[language] || aboutExternalLocales?.[language] : null;
    return isAboutLocaleComplete(candidate) ? candidate : ABOUT_LOCALES.English;
  }

`;

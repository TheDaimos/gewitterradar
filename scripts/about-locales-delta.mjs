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
  return source;
}

const localeArchitecture = String.raw`  // One resolved bundle owns every About text. Existing tables are only data inputs.
  // Add future translations here as complete bundles; LANGUAGE_DEFINITIONS owns names.
  const ABOUT_LOCALES = {
    Dansk: {
      strings: ABOUT_STRINGS.Dansk,
      settingLabels: ABOUT_SETTING_LABELS.Dansk,
      settingPurposes: ABOUT_SETTING_PURPOSES.Dansk,
      sourcePurposes: ABOUT_SOURCE_PURPOSES.Dansk
    },
    Nederlands: {
      strings: ABOUT_STRINGS.Nederlands,
      settingLabels: ABOUT_SETTING_LABELS.Nederlands,
      settingPurposes: ABOUT_SETTING_PURPOSES.Nederlands,
      sourcePurposes: ABOUT_SOURCE_PURPOSES.Nederlands
    },
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

  function resolveAboutLocale(language) {
    const candidate = LANGUAGE_DEFINITIONS.some(entry => entry.value === language) && Object.hasOwn(ABOUT_LOCALES,language)
      ? ABOUT_LOCALES[language] : null;
    return isAboutLocaleComplete(candidate) ? candidate : ABOUT_LOCALES.English;
  }

`;

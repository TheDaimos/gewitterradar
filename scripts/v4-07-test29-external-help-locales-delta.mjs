const replaceOnce=(source,from,to,label)=>{if(source.split(from).length!==2)throw new Error(`V4.07.29 external-help anchor changed (${label})`);return source.replace(from,to);};
const replaceRegexOnce=(source,regex,to,label)=>{const matches=[...source.matchAll(regex)];if(matches.length!==1)throw new Error(`V4.07.29 external-help regex anchor changed (${label}: ${matches.length})`);return source.replace(regex,to);};

export function v407Test29ExternalHelpLocalesDelta(source){
  let result=source;
  result=replaceOnce(result,"  const CARD_DISPLAY_VERSION = '4.07.28';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST28-2026-09-14';","  const CARD_DISPLAY_VERSION = '4.07.29';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST29-2026-09-14';",'display/build marker');
  result=replaceRegexOnce(result,/  const V407_HELP_COPY = Object\.freeze\([\s\S]*?\n  function installAboutExternalLocales/g,'  function installAboutExternalLocales','remove bundled external Help patch');
  result=replaceOnce(result,'    helpLocales = v407PatchExternalHelpLocales(helpLocales);\n','', 'remove external Help runtime patch call');
  result=replaceOnce(result,'.then(module => installAboutExternalLocales(module.ABOUT_EXTERNAL_LOCALES,module.HELP_EXTERNAL_LOCALES))','.then(module => installAboutExternalLocales(module.ABOUT_EXTERNAL_LOCALES,module.HELP_EXTERNAL_LOCALES_V40729))','load complete external Help registry');
  if(result.includes('V407_HELP_COPY')||result.includes('v407PatchExternalHelpLocales'))throw new Error('V4.07.29 must not bundle external Help copy in the main JS');
  return result;
}

import {V40738_HELP_ACTIONS} from './v4-07-test38-location-wording-target-delta.mjs';

const clone=(value)=>JSON.parse(JSON.stringify(value));
function patchHelpRegistry(registry,{strict=false}={}){
  const patched=clone(registry||{});
  for(const [language,[title,description]] of Object.entries(V40738_HELP_ACTIONS)){
    const locale=patched[language];
    if(!locale||!Array.isArray(locale.sections)){
      if(strict) throw new Error(`V4.07.38 external help locale missing (${language})`);
      continue;
    }
    const section=locale.sections.find((entry)=>entry?.key==='location');
    if(!section||!Array.isArray(section.entries)||!Array.isArray(section.entries[2])){
      if(strict) throw new Error(`V4.07.38 external help location entry missing (${language})`);
      continue;
    }
    section.entries[2]=[title,description];
  }
  return patched;
}

export function v407Test38SerializeExternalLocalesFixed(localeModule){
  const about=clone(localeModule.ABOUT_EXTERNAL_LOCALES||{});
  const help=patchHelpRegistry(localeModule.HELP_EXTERNAL_LOCALES||{});
  const help31=patchHelpRegistry(localeModule.HELP_EXTERNAL_LOCALES_V40731||{},{strict:true});
  return [
    '// V4.07.38 deterministic external locale registry. ABOUT content unchanged; location-help action wording aligned with Apply/Übernehmen.',
    `export const ABOUT_EXTERNAL_LOCALES = ${JSON.stringify(about,null,2)};`,
    `export const HELP_EXTERNAL_LOCALES = ${JSON.stringify(help,null,2)};`,
    `export const HELP_EXTERNAL_LOCALES_V40731 = ${JSON.stringify(help31,null,2)};`,
    ''
  ].join('\n');
}

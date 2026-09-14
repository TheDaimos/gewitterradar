const replaceOnce=(source,from,to,label)=>{if(source.split(from).length!==2)throw new Error(`V4.07.15 help-polish anchor changed (${label})`);return source.replace(from,to);};
const replaceRegexOnce=(source,regex,to,label)=>{const matches=[...source.matchAll(regex)];if(matches.length!==1)throw new Error(`V4.07.15 help-polish regex anchor changed (${label}: ${matches.length})`);return source.replace(regex,to);};

export function v407HelpPolishTest15Delta(source,iconData){
  if(!iconData||typeof iconData!=='object')throw new Error('V4.07.15 Help icon data missing');
  for(const key of ['question','troubleshooting'])if(!String(iconData[key]||'').startsWith('data:image/svg+xml;base64,'))throw new Error(`V4.07.15 invalid Help icon payload: ${key}`);
  let result=source;
  result=replaceOnce(result,"  const CARD_DISPLAY_VERSION = '4.07.14';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST14-2026-09-14';","  const CARD_DISPLAY_VERSION = '4.07.15';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST15-2026-09-14';",'display/build marker');
  result=replaceRegexOnce(result,/  const HELP_REFINED_ICONS_V3 = Object\.freeze\([^\n]+\);/g,match=>`${match}\n  const HELP_REFINED_ICONS_V4 = Object.freeze(${JSON.stringify(iconData)});`,'V4 icon payload');
  result=replaceOnce(result,"HELP_REFINED_ICONS_V3.question","HELP_REFINED_ICONS_V4.question",'question runtime reference');
  result=replaceOnce(result,"HELP_REFINED_ICONS_V3.troubleshooting","HELP_REFINED_ICONS_V4.troubleshooting",'troubleshooting runtime reference');
  result=replaceOnce(result,'.help-close{position:relative!important;top:-10px!important;right:-6px!important}', '.help-close{position:relative!important;top:-18px!important;right:-10px!important}', 'close placement');
  result=replaceOnce(result,'.help-emblem img{width:44px!important;height:44px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:none!important}', '.help-emblem img{width:48px!important;height:48px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:translateY(-1px)!important}', 'question rendering');
  result=replaceOnce(result,'.help-section-icon[data-help-icon="troubleshooting"] img{width:36px!important;height:36px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:none!important}@media(max-width:520px){.help-emblem img{width:38px!important;height:38px!important}.help-section-icon[data-help-icon="troubleshooting"] img{width:35px!important;height:35px!important}}', '.help-section-icon[data-help-icon="troubleshooting"] img{width:40px!important;height:40px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:none!important}@media(max-width:520px){.help-close{top:-12px!important;right:-6px!important}.help-emblem img{width:42px!important;height:42px!important}.help-section-icon[data-help-icon="troubleshooting"] img{width:38px!important;height:38px!important}}', 'micro-size rendering');
  return result;
}

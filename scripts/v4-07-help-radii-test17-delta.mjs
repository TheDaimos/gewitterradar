const replaceOnce=(source,from,to,label)=>{if(source.split(from).length!==2)throw new Error(`V4.07.17 radii anchor changed (${label})`);return source.replace(from,to);};
const replaceRegexOnce=(source,regex,to,label)=>{const matches=[...source.matchAll(regex)];if(matches.length!==1)throw new Error(`V4.07.17 radii regex anchor changed (${label}: ${matches.length})`);return source.replace(regex,to);};

export function v407HelpRadiiTest17Delta(source,radiiData){
  if(!String(radiiData||'').startsWith('data:image/svg+xml;base64,'))throw new Error('V4.07.17 invalid radii icon payload');
  let result=source;
  result=replaceOnce(result,"  const CARD_DISPLAY_VERSION = '4.07.16';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST16-2026-09-14';","  const CARD_DISPLAY_VERSION = '4.07.17';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST17-2026-09-14';",'display/build marker');
  result=replaceRegexOnce(result,/  const HELP_REFINED_ICONS_V5 = Object\.freeze\([^\n]+\);/g,match=>`${match}\n  const HELP_REFINED_ICONS_V6 = Object.freeze(${JSON.stringify({radii:radiiData})});`,'V6 radii payload');
  result=replaceOnce(result,'const premiumHelpIconImages={...HELP_PREMIUM_ICONS.sections,troubleshooting:HELP_REFINED_ICONS_V5.troubleshooting};','const premiumHelpIconImages={...HELP_PREMIUM_ICONS.sections,radii:HELP_REFINED_ICONS_V6.radii,troubleshooting:HELP_REFINED_ICONS_V5.troubleshooting};','radii runtime override');
  return result;
}

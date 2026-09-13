const replaceOnce = (source, from, to, label) => {
  if (source.split(from).length !== 2) throw new Error(`V4.07.11 premium-help anchor changed (${label})`);
  return source.replace(from,to);
};

export function v407HelpPremiumIconsDelta(source, iconData, variant = 'A') {
  if (!iconData || typeof iconData !== 'object') throw new Error('V4.07.11 premium-help icon data missing');
  if (!['A','B'].includes(variant)) throw new Error(`V4.07.11 unknown premium-help variant: ${variant}`);
  const externalKey = variant === 'A' ? 'external_shield2' : 'external_rj45';
  const displayVersion = `4.07.11${variant}`;
  const buildMarker = `V4.07-TEST11${variant}-2026-09-13`;

  const required = ['question','close','prerequisites','radii','location',externalKey,'functions','defaults','troubleshooting','recorder'];
  for (const key of required) {
    if (!String(iconData[key] || '').startsWith('data:image/svg+xml;base64,')) throw new Error(`V4.07.11 invalid icon payload: ${key}`);
  }

  const runtimeMap = {
    question:iconData.question,
    close:iconData.close,
    sections:{
      prerequisites:iconData.prerequisites,
      radii:iconData.radii,
      location:iconData.location,
      external_services:iconData[externalKey],
      functions:iconData.functions,
      defaults:iconData.defaults,
      troubleshooting:iconData.troubleshooting,
      recorder:iconData.recorder,
    },
  };

  let result = source;
  result = replaceOnce(
    result,
    "  const CARD_VERSION = '4.07';\n  const CARD_DISPLAY_VERSION = '4.07.10';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST10R1-2026-09-13';",
    "  const CARD_VERSION = '4.07';\n" +
    `  const CARD_DISPLAY_VERSION = '${displayVersion}';\n` +
    `  const GEWITTERRADAR_BUILD = '${buildMarker}';\n` +
    `  const HELP_PREMIUM_ICON_VARIANT = '${variant}';\n` +
    `  const HELP_PREMIUM_ICONS = Object.freeze(${JSON.stringify(runtimeMap)});`,
    'display/build marker'
  );

  result = replaceOnce(
    result,
    `<span class="help-emblem" aria-hidden="true">?</span>`,
    `<span class="help-emblem" aria-hidden="true"><img src="' + HELP_PREMIUM_ICONS.question + '" alt="" width="44" height="44" draggable="false"></span>`,
    'help header emblem'
  );

  result = replaceOnce(
    result,
    `<button class="help-close" type="button" aria-label="Close"><img src="' + ABOUT_CLOSE_IMAGE + '" alt="" width="34" height="34" draggable="false"></button>`,
    `<button class="help-close" type="button" aria-label="Close"><img src="' + HELP_PREMIUM_ICONS.close + '" alt="" width="38" height="38" draggable="false"></button>`,
    'help close image'
  );

  result = replaceOnce(
    result,
    `        help.sections.forEach((section,index)=>{`,
    `        const premiumHelpIconImages=HELP_PREMIUM_ICONS.sections;\n        help.sections.forEach((section,index)=>{`,
    'premium section icon map'
  );

  result = replaceOnce(
    result,
    `icon.className='help-section-icon';icon.dataset.helpIcon=section.key;icon.setAttribute('aria-hidden','true');icon.innerHTML=deterministicHelpIcons[section.key]||icons[section.key]||'•';title.textContent=section.title;`,
    `icon.className='help-section-icon';icon.dataset.helpIcon=section.key;icon.setAttribute('aria-hidden','true');icon.innerHTML=premiumHelpIconImages[section.key]?'<img src="'+premiumHelpIconImages[section.key]+'" alt="" draggable="false">':(deterministicHelpIcons[section.key]||icons[section.key]||'•');title.textContent=section.title;`,
    'premium section icon renderer'
  );

  const premiumCss = `.help-emblem{border:0!important;background:transparent!important;box-shadow:none!important;overflow:visible}.help-emblem img{display:block;width:44px;height:44px;object-fit:contain;filter:drop-shadow(0 2px 3px #0008) drop-shadow(0 0 4px #d8a54b44)}.help-close img{width:38px!important;height:38px!important;filter:drop-shadow(0 2px 3px #0009) drop-shadow(0 0 3px #d9a84b44)}.help-section-icon{width:34px!important;height:34px!important;border:0!important;background:transparent!important;box-shadow:none!important;overflow:visible}.help-section-icon img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;filter:drop-shadow(0 2px 3px #0009) drop-shadow(0 0 3px #d7a2463d);transform:translateZ(0)}.help-section-icon[data-help-icon="external_services"] img{width:35px;height:35px}.help-section-icon[data-help-icon="functions"] img{width:34px;height:34px}.help-chevron{border-color:#f1ca74!important;filter:drop-shadow(0 1px .5px #4c301c) drop-shadow(0 0 3px #d8a74a66)!important}@media(max-width:520px){.help-emblem img{width:38px;height:38px}.help-section-icon{width:33px!important;height:33px!important}.help-section-icon img{width:33px;height:33px}.help-section-icon[data-help-icon="external_services"] img{width:34px;height:34px}}`;
  result = replaceOnce(
    result,
    `        '</style><dialog class="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title">`,
    `        '${premiumCss}' +\n        '</style><dialog class="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title">`,
    'premium help css'
  );

  return result;
}

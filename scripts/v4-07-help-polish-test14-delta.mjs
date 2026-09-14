const replaceOnce = (source, from, to, label) => {
  if (source.split(from).length !== 2) throw new Error(`V4.07.14 help-polish anchor changed (${label})`);
  return source.replace(from, to);
};

const replaceRegexOnce = (source, regex, to, label) => {
  const matches = [...source.matchAll(regex)];
  if (matches.length !== 1) throw new Error(`V4.07.14 help-polish regex anchor changed (${label}: ${matches.length})`);
  return source.replace(regex, to);
};

export function v407HelpPolishTest14Delta(source, iconData) {
  if (!iconData || typeof iconData !== 'object') throw new Error('V4.07.14 refined Help icon data missing');
  for (const key of ['question','troubleshooting']) {
    if (!String(iconData[key] || '').startsWith('data:image/svg+xml;base64,')) {
      throw new Error(`V4.07.14 invalid refined Help icon payload: ${key}`);
    }
  }

  let result = source;

  result = replaceOnce(
    result,
    "  const CARD_DISPLAY_VERSION = '4.07.13';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST13-2026-09-14';",
    "  const CARD_DISPLAY_VERSION = '4.07.14';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST14-2026-09-14';",
    'display/build marker'
  );

  result = replaceRegexOnce(
    result,
    /  const HELP_REFINED_ICONS = Object\.freeze\([^\n]+\);/g,
    match => `${match}\n  const HELP_REFINED_ICONS_V3 = Object.freeze(${JSON.stringify(iconData)});`,
    'V3 refined icon payload'
  );

  result = replaceOnce(
    result,
    `<span class="help-emblem" aria-hidden="true"><img src="' + HELP_REFINED_ICONS.question + '" alt="" width="44" height="44" draggable="false"></span>`,
    `<span class="help-emblem" aria-hidden="true"><img src="' + HELP_REFINED_ICONS_V3.question + '" alt="" width="44" height="44" draggable="false"></span>`,
    'V3 question icon'
  );

  result = replaceOnce(
    result,
    `const premiumHelpIconImages={...HELP_PREMIUM_ICONS.sections,troubleshooting:HELP_REFINED_ICONS.troubleshooting};`,
    `const premiumHelpIconImages={...HELP_PREMIUM_ICONS.sections,troubleshooting:HELP_REFINED_ICONS_V3.troubleshooting};`,
    'V3 troubleshooting icon'
  );

  result = replaceOnce(
    result,
    `.help-close{position:relative!important;top:-4px!important;right:-4px!important}`,
    `.help-close{position:relative!important;top:-10px!important;right:-6px!important}`,
    'close position'
  );

  result = replaceOnce(
    result,
    `.help-emblem img{filter:drop-shadow(0 2px 4px #000b) drop-shadow(0 0 5px #d8a54b55)!important}`,
    `.help-emblem img{width:44px!important;height:44px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:none!important}`,
    'question rendering'
  );

  result = replaceOnce(
    result,
    `.help-section-icon[data-help-icon="troubleshooting"] img{width:34px!important;height:34px!important;filter:drop-shadow(0 2px 3px #000a) drop-shadow(0 0 4px #d7a24655)!important}`,
    `.help-section-icon[data-help-icon="troubleshooting"] img{width:36px!important;height:36px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:none!important}@media(max-width:520px){.help-emblem img{width:38px!important;height:38px!important}.help-section-icon[data-help-icon="troubleshooting"] img{width:35px!important;height:35px!important}}`,
    'troubleshooting rendering'
  );

  return result;
}

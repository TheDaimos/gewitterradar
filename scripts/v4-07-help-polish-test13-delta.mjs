const replaceOnce = (source, from, to, label) => {
  if (source.split(from).length !== 2) throw new Error(`V4.07.13 help-polish anchor changed (${label})`);
  return source.replace(from, to);
};

export function v407HelpPolishTest13Delta(source, iconData) {
  if (!iconData || typeof iconData !== 'object') throw new Error('V4.07.13 refined Help icon data missing');
  for (const key of ['question','troubleshooting']) {
    if (!String(iconData[key] || '').startsWith('data:image/svg+xml;base64,')) {
      throw new Error(`V4.07.13 invalid refined Help icon payload: ${key}`);
    }
  }

  let result = source;

  result = replaceOnce(
    result,
    "  const CARD_DISPLAY_VERSION = '4.07.12B';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST12B-2026-09-14';",
    "  const CARD_DISPLAY_VERSION = '4.07.13';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST13-2026-09-14';",
    'display/build marker'
  );

  result = replaceOnce(
    result,
    "  const HELP_PREMIUM_ICON_VARIANT = 'B';",
    "  const HELP_PREMIUM_ICON_VARIANT = 'B';\n" +
      `  const HELP_REFINED_ICONS = Object.freeze(${JSON.stringify(iconData)});`,
    'refined icon payload'
  );

  result = replaceOnce(
    result,
    `<span class="help-emblem" aria-hidden="true"><img src="' + HELP_PREMIUM_ICONS.question + '" alt="" width="44" height="44" draggable="false"></span>`,
    `<span class="help-emblem" aria-hidden="true"><img src="' + HELP_REFINED_ICONS.question + '" alt="" width="44" height="44" draggable="false"></span>`,
    'refined question icon'
  );

  result = replaceOnce(
    result,
    `const premiumHelpIconImages=HELP_PREMIUM_ICONS.sections;`,
    `const premiumHelpIconImages={...HELP_PREMIUM_ICONS.sections,troubleshooting:HELP_REFINED_ICONS.troubleshooting};`,
    'refined troubleshooting icon'
  );

  result = replaceOnce(
    result,
    `<button class="help-close" type="button" aria-label="Close"><img src="' + HELP_PREMIUM_ICONS.close + '" alt="" width="38" height="38" draggable="false"></button>`,
    `<button class="help-close" type="button" aria-label="Close"><img src="' + ABOUT_CLOSE_IMAGE + '" alt="" width="34" height="34" draggable="false"></button>`,
    'restore legacy premium close image'
  );

  const polishCss = `.help-close{position:relative!important;top:-4px!important;right:-4px!important}.help-close img{width:34px!important;height:34px!important;filter:none!important}.help-emblem img{filter:drop-shadow(0 2px 4px #000b) drop-shadow(0 0 5px #d8a54b55)!important}.help-section-icon[data-help-icon="troubleshooting"] img{width:34px!important;height:34px!important;filter:drop-shadow(0 2px 3px #000a) drop-shadow(0 0 4px #d7a24655)!important}`;
  result = replaceOnce(
    result,
    `        '</style><dialog class="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title">`,
    `        '${polishCss}' +\n        '</style><dialog class="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title">`,
    'V4.07.13 Help polish CSS'
  );

  return result;
}

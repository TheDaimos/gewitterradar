// Second real-device refinement pass for the accepted V4.06 visual preview.
// Applies only after v406UiPolishDelta and remains fail-closed on source drift.

function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.06 UI polish pass2 anchor changed (${label})`);
  }
  return source.replace(from, to);
}

function replaceRange(source, start, end, replacement, label) {
  const first = source.indexOf(start);
  if (first < 0 || source.indexOf(start, first + 1) >= 0) {
    throw new Error(`V4.06 UI polish pass2 start anchor changed (${label})`);
  }
  const last = source.indexOf(end, first + start.length);
  if (last < 0) throw new Error(`V4.06 UI polish pass2 end anchor changed (${label})`);
  return source.slice(0, first) + replacement + source.slice(last);
}

const welcomeMetalGradient = 'linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c)';
const welcomeGearPath = 'M27 7Q32 5 37 7L38 14L43 17L50 14Q55 18 57 23L52 28V36L57 41Q55 46 50 50L43 47L38 50L37 57Q32 59 27 57L26 50L21 47L14 50Q9 46 7 41L12 36V28L7 23Q9 18 14 14L21 17L26 14Z';

function welcomeGearSvg(id, className) {
  return `<svg class="${className}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#fff0bc"/><stop offset=".28" stop-color="#e8bd60"/><stop offset=".48" stop-color="#92703a"/><stop offset=".62" stop-color="#ffe2a0"/><stop offset="1" stop-color="#b58b44"/></linearGradient></defs><g stroke="url(#${id})"><path d="${welcomeGearPath}"/><circle cx="32" cy="32" r="11"/><circle cx="32" cy="32" r="17" opacity=".25"/></g></svg>`;
}

export function v406UiPolishPass2Delta(source) {
  let result = source;

  const settingsFrameStart = `          .settings-dialog{\n            border:1px solid transparent;`;
  const settingsFrameEnd = `          .settings-premium-link{display:flex!important;`;
  const settingsFrame = String.raw`          /* V4.06 pass2: Welcome-derived 2px metal frame, reduced diffuse gold shadow. */
          .settings-dialog{
            border:2px solid transparent;
            background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%) padding-box,linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995)) padding-box,${welcomeMetalGradient} border-box;
            box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,236,181,.08),inset 0 1px rgba(255,244,213,.10),0 0 8px rgba(215,164,67,.055)
          }
          .settings-dialog::after{content:none!important}
          .settings-chip.settings-chip-premium{width:40px!important;min-width:40px!important;height:40px!important;min-height:40px!important;flex:0 0 40px!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:visible}
          .settings-chip-premium .gear-welcome{display:block!important;width:30px;height:30px;min-width:30px;min-height:30px;overflow:visible;color:#e5bd69;stroke-width:3;filter:drop-shadow(0 1px .5px #4c301c) drop-shadow(0 2px 1.5px #0009) drop-shadow(0 -1px .4px #f5d5a555);transition:filter .16s ease,transform .16s ease}
          #card-root.ipad-device .settings-chip-premium .gear-welcome{display:block!important}
          @media(hover:hover) and (pointer:fine){.settings-chip-premium:hover .gear-welcome{filter:brightness(1.08) drop-shadow(0 1px .5px #4c301c) drop-shadow(0 2px 1.5px #0009) drop-shadow(0 0 3px #d9a84f55)}}
          .settings-chip-premium:active .gear-welcome{transform:scale(.97);filter:brightness(.92) drop-shadow(0 1px .5px #4c301c)}
`;
  result = replaceRange(result, settingsFrameStart, settingsFrameEnd, settingsFrame, 'settings-welcome-frame-main-gear-css');

  const mainGearAnchor = `                <button class="top-chip settings-chip" id="settings-open" type="button"\n                        title="Gewitterradar-Einstellungen öffnen" aria-label="Einstellungen öffnen">\n                  <span class="gear gear-glyph">⚙</span>\n                  <ha-icon class="gear gear-ipad" icon="mdi:cog-outline" aria-hidden="true"></ha-icon>\n                </button>`;
  const mainGearReplacement = `                <button class="top-chip settings-chip settings-chip-premium" id="settings-open" type="button"\n                        title="Gewitterradar-Einstellungen öffnen" aria-label="Einstellungen öffnen">\n                  ${welcomeGearSvg('mainview-settings-metal','gear gear-welcome')}\n                </button>`;
  result = once(result, mainGearAnchor, mainGearReplacement, 'mainview-exact-welcome-gear');

  const helpStyleAnchor = `@media(hover:none) and (pointer:coarse){.help-close:focus-visible{outline:none}}' +\n        '</style><dialog class="help-dialog"`;
  const helpStyleReplacement = `@media(hover:none) and (pointer:coarse){.help-close:focus-visible{outline:none}}` +
    `.help-dialog{border:2px solid transparent;background:radial-gradient(ellipse at 15% 0,#31445145,transparent 48%) padding-box,linear-gradient(#091219,#091219) padding-box,${welcomeMetalGradient} border-box;box-shadow:0 24px 90px #000c,inset 0 0 0 1px rgba(255,235,184,.07),inset 0 1px rgba(255,247,224,.10),0 0 8px rgba(215,164,67,.05)}.help-dialog::after{content:none!important}.help-section-icon[data-help-icon="functions"] svg{width:27px;height:27px;filter:drop-shadow(0 1px .5px #4c301c) drop-shadow(0 -1px .4px #f5d5a555)}` +
    `' +\n        '</style><dialog class="help-dialog"`;
  result = once(result, helpStyleAnchor, helpStyleReplacement, 'help-welcome-frame');

  const functionsStart = `        const premiumFunctionsIcon='<svg`;
  const functionsEnd = `        const deterministicHelpIcons=`;
  const premiumFunctions = `        const premiumFunctionsIcon='${welcomeGearSvg('help-functions-welcome-metal','help-functions-welcome-gear')}';\n`;
  result = replaceRange(result, functionsStart, functionsEnd, premiumFunctions, 'help-exact-welcome-gear');

  return result;
}

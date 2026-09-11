// Third real-device refinement pass for V4.06.
// Fixes only the iPad/iPad Pro About-dialog reopen focus ring observed after
// Settings -> About Gewitterradar. All accepted visual assets remain untouched.

function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.06 UI polish pass3 anchor changed (${label})`);
  }
  return source.replace(from, to);
}

export function v406UiPolishPass3Delta(source) {
  let result = source;

  const settingsAboutAnchor = `      this.shadow.getElementById('settings-about')?.addEventListener('click', () => this._openAbout());`;
  const settingsAboutReplacement = `      this.shadow.getElementById('settings-about')?.addEventListener('click', () => this._openAbout(true));`;
  result = once(result, settingsAboutAnchor, settingsAboutReplacement, 'about-settings-source');

  result = once(result, `    _openAbout() {`, `    _openAbout(fromSettings = false) {`, 'about-open-source-parameter');

  const ipadFocusCssAnchor = String.raw`        @media(hover:none) and (pointer:coarse) and (min-width:700px) and (max-width:1100px){
          .about-close{-webkit-appearance:none;appearance:none;-webkit-tap-highlight-color:transparent}
          .about-close:focus-visible{outline:none!important}
          .about-close:focus-visible img{filter:brightness(1.04) drop-shadow(0 0 3px rgba(224,173,76,.42))}
        }
`;
  const ipadFocusCssReplacement = ipadFocusCssAnchor + String.raw`        /* V4.06 pass3: suppress WebKit's reopen focus frame without changing the premium X asset. */
        .about-dialog.about-touch-tablet .about-close{-webkit-appearance:none;appearance:none;-webkit-tap-highlight-color:transparent}
        .about-dialog.about-touch-tablet .about-close:focus,.about-dialog.about-touch-tablet .about-close:focus-visible{outline:none!important;box-shadow:none!important}
`;
  result = once(result, ipadFocusCssAnchor, ipadFocusCssReplacement, 'about-ipad-reopen-focus-css');

  const focusAnchor = `      aboutClaimedVersion = ABOUT_ONBOARDING_VERSION;\n      dialog.querySelector('[data-about-close]').focus({preventScroll:true});`;
  const focusReplacement = `      aboutClaimedVersion = ABOUT_ONBOARDING_VERSION;\n      const aboutClose = dialog.querySelector('[data-about-close]');\n      const touchTablet = fromSettings && navigator.maxTouchPoints > 0 && Math.min(window.innerWidth, window.innerHeight) >= 700;\n      dialog.classList.toggle('about-touch-tablet', touchTablet);\n      if (touchTablet) {\n        dialog.tabIndex = -1;\n        dialog.focus({preventScroll:true});\n      } else {\n        aboutClose.focus({preventScroll:true});\n      }`;
  result = once(result, focusAnchor, focusReplacement, 'about-ipad-reopen-focus-target');

  return result;
}

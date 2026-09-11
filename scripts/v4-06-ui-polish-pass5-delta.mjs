// Fifth real-device refinement pass for V4.06.
// Refines only approved placement/scale details: Welcome footer signature/version,
// Settings version placement, the three Welcome radius value badges, and the
// Greek mobile-portrait header flow observed on a real device.

function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.06 UI polish pass5 anchor changed (${label})`);
  }
  return source.replace(from, to);
}

export function v406UiPolishPass5Delta(source) {
  let result = source;

  const pass4FooterCssAnchor = String.raw`        @media(max-width:620px){
          .about-footer-left{grid-column:1;grid-row:2;gap:4px}
          .about-footer-signature{width:105px!important;max-width:100%!important}
        }
`;
  const pass5Css = String.raw`        /* V4.06 pass5: final footer/version placement and 25% larger centered radius badges. */
        .about-footer-left{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-width:0}
        .about-footer-left .about-dev{grid-row:auto!important;text-align:center;white-space:nowrap;font-size:7.6px;line-height:1.2}
        .about-footer-signature{width:196px!important;max-width:100%!important;height:auto!important}
        .about-radius strong,.about-radius p{padding-right:74px}
        .about-radius output{position:absolute;right:0;top:50%;transform:translateY(-50%);min-width:58px;padding:2.5px 5px;font-size:1.25em;line-height:1.1;border-radius:5px;box-sizing:border-box}
        @media(min-width:621px){
          .about-footer{position:relative}
          .about-footer-left{position:relative;display:block!important;align-self:stretch!important;min-height:54px}
          .about-footer-signature-wrap{position:absolute;left:50%;top:50%;width:196px!important;max-width:none!important;transform:translate(-50%,-50%);margin:0!important}
          .about-footer-left .about-dev{position:absolute;left:6px;bottom:4px;text-align:left;white-space:nowrap}
        }
        @media(max-width:620px){
          .about-footer-left{grid-column:1;grid-row:2;gap:4px}
          .about-footer-left .about-dev{font-size:6.8px}
          .about-footer-signature{width:165px!important;max-width:100%!important}
        }
        @supports (-webkit-touch-callout:none){
          @media(hover:none) and (pointer:coarse) and (min-width:700px) and (min-height:700px){
            .about-footer-left .about-dev{transform:translateY(14px)}
          }
        }
        /* V4.06 pass5: Greek mobile portrait needs real text flow instead of an absolute claim overlay. */
        @media(max-width:620px) and (orientation:portrait){
          .about-dialog[data-about-language="Ελληνικά"] .about-head{display:grid;grid-template-columns:70px minmax(0,1fr);grid-template-rows:auto auto;align-items:start;column-gap:12px;row-gap:6px;height:auto;min-height:158px}
          .about-dialog[data-about-language="Ελληνικά"] .about-head>img{grid-column:1;grid-row:1;align-self:start}
          .about-dialog[data-about-language="Ελληνικά"] .about-head-copy{grid-column:2;grid-row:1;align-self:start;max-width:none}
          .about-dialog[data-about-language="Ελληνικά"] .about-head-copy p{max-width:none}
          .about-dialog[data-about-language="Ελληνικά"] .about-claim{position:static;grid-column:2;grid-row:2;justify-self:stretch;align-self:start;width:auto;max-width:none;margin:0;padding:2px 4px;font-size:9px;line-height:1.35;text-align:center}
        }
`;
  result = once(result, pass4FooterCssAnchor, pass4FooterCssAnchor + pass5Css, 'footer-version-radius-css');

  const languageDatasetAnchor = `      const language = this._languageValue();\n      const locale = resolveAboutLocale(language);\n      const status = dialog.querySelector('.about-copy-status');`;
  const languageDatasetReplacement = `      const language = this._languageValue();\n      dialog.dataset.aboutLanguage = language;\n      const locale = resolveAboutLocale(language);\n      const status = dialog.querySelector('.about-copy-status');`;
  result = once(result, languageDatasetAnchor, languageDatasetReplacement, 'about-language-dataset');

  const persistentSettingsCssAnchor = `          .settings-dialog::after{content:none!important}\n`;
  const persistentSettingsCss = String.raw`          /* V4.06 pass5: Settings version lives in the persistent dialog shell, not the transient About style. */
          .settings-footer-version{position:absolute;left:18px;bottom:18px;z-index:3;color:#747d8a;font-size:8.2px;font-weight:720;letter-spacing:.08em;white-space:nowrap;user-select:none}
          @media(max-width:720px){.settings-footer-version{left:14px;bottom:15px}}
`;
  result = once(result, persistentSettingsCssAnchor, persistentSettingsCssAnchor + persistentSettingsCss, 'persistent-settings-version-css');

  const footerAnchor = `<footer class="about-footer"><div class="about-footer-left"><span class="about-dev">V4.06 · Visual V2<br>Gewitterradar · Home Assistant</span><div class="settings-signature-wrap about-footer-signature-wrap" aria-hidden="true"><svg class="settings-signature about-footer-signature" viewBox="0 0 1982 563" focusable="false" aria-hidden="true" preserveAspectRatio="xMidYMid meet"><image id="about-footer-signature-image" x="0" y="0" width="1982" height="563" preserveAspectRatio="xMidYMid meet"></image></svg></div></div><button class="about-understood" type="button">\${icon('check')}<span data-about-text="understood"></span></button><button class="about-later" type="button">\${icon('clock')}<span data-about-text="later"></span></button><div class="about-footer-reminder">\${icon('settings')}<p data-about-text="footer"></p></div></footer>`;
  const footerReplacement = `<footer class="about-footer"><div class="about-footer-left"><div class="settings-signature-wrap about-footer-signature-wrap" aria-hidden="true"><svg class="settings-signature about-footer-signature" viewBox="0 0 1982 563" focusable="false" aria-hidden="true" preserveAspectRatio="xMidYMid meet"><image id="about-footer-signature-image" x="0" y="0" width="1982" height="563" preserveAspectRatio="xMidYMid meet"></image></svg></div><span class="about-dev">V4.06 · Visual V2 · Gewitterradar · by CK</span></div><button class="about-understood" type="button">\${icon('check')}<span data-about-text="understood"></span></button><button class="about-later" type="button">\${icon('clock')}<span data-about-text="later"></span></button><div class="about-footer-reminder">\${icon('settings')}<p data-about-text="footer"></p></div></footer>`;
  result = once(result, footerAnchor, footerReplacement, 'welcome-footer-signature-version-order');

  const settingsHeaderVersion = '                <span class="settings-version" title="Kartenversion">V${CARD_VERSION}</span>\n';
  result = once(result, settingsHeaderVersion, '', 'settings-version-remove-from-header');

  const settingsSignatureAnchor = '              <div class="settings-signature-wrap" aria-hidden="true">';
  const settingsSignatureReplacement = '              <div class="settings-footer-version" title="Kartenversion">V${CARD_VERSION}</div>\n\n' + settingsSignatureAnchor;
  result = once(result, settingsSignatureAnchor, settingsSignatureReplacement, 'settings-version-bottom-left');

  return result;
}

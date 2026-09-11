// Fourth real-device refinement pass for V4.06.
// Keeps the accepted premium visuals, removes the iPad/iPad Pro dialog focus outline,
// centers the Welcome footer controls, and reuses the exact Settings signature asset.

function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.06 UI polish pass4 anchor changed (${label})`);
  }
  return source.replace(from, to);
}

export function v406UiPolishPass4Delta(source) {
  let result = source;

  const pass3FocusCss = String.raw`        .about-dialog.about-touch-tablet .about-close{-webkit-appearance:none;appearance:none;-webkit-tap-highlight-color:transparent}
        .about-dialog.about-touch-tablet .about-close:focus,.about-dialog.about-touch-tablet .about-close:focus-visible{outline:none!important;box-shadow:none!important}
`;
  const pass4Css = String.raw`        /* V4.06 pass4: keep programmatic dialog focus invisible on touch tablets; center Welcome footer visuals. */
        .about-dialog.about-touch-tablet:focus,.about-dialog.about-touch-tablet:focus-visible{outline:none!important}
        .about-footer-left{display:grid;grid-template-columns:max-content minmax(0,1fr);align-items:center;gap:12px;min-width:0}
        .about-footer-left .about-dev{grid-row:auto!important}
        .about-footer-signature-wrap{min-height:0!important;padding:0!important;min-width:0;overflow:visible}
        .about-footer-signature{width:170px!important;max-width:100%!important;height:auto!important}
        @media(min-width:621px){
          .about-footer button:before{inset:5px 0!important}
          .about-footer button>span,.about-footer button>.about-icon{transform:none!important}
        }
        @media(max-width:620px){
          .about-footer-left{grid-column:1;grid-row:2;gap:4px}
          .about-footer-signature{width:105px!important;max-width:100%!important}
        }
`;
  result = once(result, pass3FocusCss, pass3FocusCss + pass4Css, 'touch-tablet-dialog-outline-and-footer-layout');

  const footerAnchor = `<footer class="about-footer"><span class="about-dev">V4.06 · Visual V2<br>Gewitterradar · Home Assistant</span><button class="about-understood" type="button">${'${icon(\'check\')}'}<span data-about-text="understood"></span></button><button class="about-later" type="button">${'${icon(\'clock\')}'}<span data-about-text="later"></span></button><div class="about-footer-reminder">${'${icon(\'settings\')}'}<p data-about-text="footer"></p></div></footer>`;
  const footerReplacement = `<footer class="about-footer"><div class="about-footer-left"><span class="about-dev">V4.06 · Visual V2<br>Gewitterradar · Home Assistant</span><div class="settings-signature-wrap about-footer-signature-wrap" aria-hidden="true"><svg class="settings-signature about-footer-signature" viewBox="0 0 1982 563" focusable="false" aria-hidden="true" preserveAspectRatio="xMidYMid meet"><image id="about-footer-signature-image" x="0" y="0" width="1982" height="563" preserveAspectRatio="xMidYMid meet"></image></svg></div></div><button class="about-understood" type="button">${'${icon(\'check\')}'}<span data-about-text="understood"></span></button><button class="about-later" type="button">${'${icon(\'clock\')}'}<span data-about-text="later"></span></button><div class="about-footer-reminder">${'${icon(\'settings\')}'}<p data-about-text="footer"></p></div></footer>`;
  result = once(result, footerAnchor, footerReplacement, 'welcome-footer-settings-signature');

  const appendAnchor = `      this.shadow.append(shell);\n      this._aboutDialog = dialog;`;
  const appendReplacement = `      this.shadow.append(shell);\n      const aboutFooterSignatureImage = shell.querySelector('#about-footer-signature-image');\n      _uiAsset7VerifiedUri().then((uri) => {\n        if (uri && aboutFooterSignatureImage?.isConnected) aboutFooterSignatureImage.setAttribute('href', uri);\n      });\n      this._aboutDialog = dialog;`;
  result = once(result, appendAnchor, appendReplacement, 'welcome-footer-signature-uri');

  return result;
}

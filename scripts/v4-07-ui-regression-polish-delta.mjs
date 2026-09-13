// V4.07 focused UI regression/polish pass.
// Scope is deliberately limited to:
// 1) close an open location dropdown before Settings opens;
// 2) reuse the accepted premium metal frame for Release History;
// 3) reuse the accepted premium close control for Release History.

function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.07 UI polish anchor changed (${label})`);
  }
  return source.replace(from, to);
}

export function v407UiRegressionPolishDelta(source) {
  let result = source;

  const openSettingsAnchor = `      const openSettings = () => {\n        this._syncHelpMenu();`;
  const openSettingsReplacement = `      const openSettings = () => {\n        closeLocationDropdown(false);\n        this._syncHelpMenu();`;
  result = once(result, openSettingsAnchor, openSettingsReplacement, 'settings-closes-location-dropdown');

  const releaseBodyAnchor = `          .release-history-body {`;
  const releasePremiumCss = String.raw`          /* V4.07: Release History inherits the accepted Settings/Help premium metal treatment. */
          .release-history-dialog{
            border:2px solid transparent;
            background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%) padding-box,linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995)) padding-box,linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c) border-box;
            box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,236,181,.08),inset 0 1px rgba(255,244,213,.10),0 0 8px rgba(215,164,67,.055)
          }
          .release-history-close{position:relative;display:grid!important;place-items:center;width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important;padding:0!important;border:0!important;border-radius:8px!important;background:transparent!important;color:transparent!important;font-size:0!important;line-height:0!important;overflow:visible;box-shadow:none!important}
          .release-history-close img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}
          .release-history-close:focus-visible{outline:2px solid #e7c16e!important;outline-offset:-2px!important}
          .release-history-close:active img{transform:scale(.97);filter:brightness(.92)}
          @media(hover:hover) and (pointer:fine){.release-history-close:hover{background:transparent!important}.release-history-close:hover img{filter:brightness(1.12) drop-shadow(0 0 2px #dba34c70)}}
          @media(hover:none) and (pointer:coarse){.release-history-close:focus-visible{outline:none!important}}
`;
  result = once(result, releaseBodyAnchor, releasePremiumCss + releaseBodyAnchor, 'release-history-premium-frame-and-close-css');

  const releaseCloseAnchor = `                <button class="release-history-close" id="release-history-close" type="button" aria-label="Close release history">×</button>`;
  const releaseCloseReplacement = `                <button class="release-history-close" id="release-history-close" type="button" aria-label="Close release history"><img src="${'${ABOUT_CLOSE_IMAGE}'}" alt="" width="34" height="34" draggable="false"></button>`;
  result = once(result, releaseCloseAnchor, releaseCloseReplacement, 'release-history-premium-close-markup');

  return result;
}

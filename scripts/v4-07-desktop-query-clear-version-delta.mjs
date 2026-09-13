const replaceOnce = (source, from, to, label) => {
  if (source.split(from).length !== 2) throw new Error(`V4.07 TEST10R1 anchor changed (${label})`);
  return source.replace(from,to);
};

export function v407DesktopQueryClearVersionDelta(source) {
  let result = source;

  result = replaceOnce(
    result,
    "  const CARD_VERSION = '4.07';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST10-2026-09-13';",
    "  const CARD_VERSION = '4.07';\n  const CARD_DISPLAY_VERSION = '4.07.10';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST10R1-2026-09-13';",
    'display/build version'
  );

  result = replaceOnce(
    result,
    `          .v407-location-query-clear {\n            appearance:none;-webkit-appearance:none;position:absolute;right:4px;bottom:4px;\n            width:30px;height:30px;display:grid;place-items:center;border:0;border-radius:7px;background:transparent;\n            color:#7891a7;font:700 18px/1 inherit;cursor:pointer;padding:0;transition:background .15s ease,color .15s ease,opacity .15s ease;\n          }\n          .v407-location-query-clear:hover,.v407-location-query-clear:focus-visible { outline:none;background:rgba(79,163,247,.10);color:#cfe8ff; }\n          .v407-location-query-clear[hidden] { display:none; }\n`,
    `          .v407-location-query-clear {\n            appearance:none;-webkit-appearance:none;position:absolute;right:4px;bottom:4px;z-index:3;\n            width:30px;height:30px;display:grid;place-items:center;border:0;border-radius:7px;background:transparent;\n            color:#9fb8ce;font:700 18px/1 inherit;cursor:pointer;padding:0;opacity:0;visibility:hidden;pointer-events:none;\n            transform:scale(.96);transition:background .15s ease,color .15s ease,opacity .15s ease,transform .15s ease;\n          }\n          .v407-location-query-clear.is-visible,\n          #v407-location-query:not(:placeholder-shown) + .v407-location-query-clear { opacity:1;visibility:visible;pointer-events:auto;transform:none; }\n          .v407-location-query-clear:hover,.v407-location-query-clear:focus-visible { outline:none;background:rgba(79,163,247,.10);color:#e7f4ff; }\n`,
    'desktop clear css'
  );

  result = replaceOnce(
    result,
    `<div class="v407-location-search-field"><label for="v407-location-query"></label><input id="v407-location-query" type="search" autocomplete="off" spellcheck="false"><button type="button" class="v407-location-query-clear" aria-label="\${v407ClearQueryLabel()}" title="\${v407ClearQueryLabel()}" hidden>×</button></div>`,
    `<div class="v407-location-search-field"><label for="v407-location-query"></label><input id="v407-location-query" type="search" autocomplete="off" spellcheck="false"><button type="button" class="v407-location-query-clear" aria-label="\${v407ClearQueryLabel()}" title="\${v407ClearQueryLabel()}" aria-hidden="true" tabindex="-1">×</button></div>`,
    'clear markup state'
  );

  result = replaceOnce(
    result,
    `        const syncV407QueryClear = () => { clearQueryButton.hidden = !String(queryInput.value || '').length; };\n        queryInput.addEventListener('input',syncV407QueryClear);\n`,
    `        const syncV407QueryClear = () => {\n          const visible = !!String(queryInput.value || '').length;\n          clearQueryButton.classList.toggle('is-visible',visible);\n          clearQueryButton.setAttribute('aria-hidden',visible ? 'false' : 'true');\n          clearQueryButton.tabIndex = visible ? 0 : -1;\n        };\n        ['input','change','keyup','search','focus'].forEach((eventName) => queryInput.addEventListener(eventName,syncV407QueryClear));\n`,
    'desktop clear sync'
  );

  result = replaceOnce(result,`>V\${CARD_VERSION}</span></h1>`,`>V\${CARD_DISPLAY_VERSION}</span></h1>`,'header visible version');
  result = replaceOnce(result,`<div class="settings-footer-version" title="Kartenversion">\${BUILD_YYYY_MM} · V\${CARD_VERSION}</div>`,`<div class="settings-footer-version" title="Kartenversion">\${BUILD_YYYY_MM} · V\${CARD_DISPLAY_VERSION}</div>`,'settings visible version');
  result = replaceOnce(result,`<span class="release-history-current">\${BUILD_YYYY_MM} · V\${CARD_VERSION}</span>`,`<span class="release-history-current">\${BUILD_YYYY_MM} · V\${CARD_DISPLAY_VERSION}</span>`,'history current visible version');
  result = replaceOnce(result,`<span class="about-dev">\${BUILD_YYYY_MM} · V\${CARD_VERSION} · Gewitterradar · by CK</span>`,`<span class="about-dev">\${BUILD_YYYY_MM} · V\${CARD_DISPLAY_VERSION} · Gewitterradar · by CK</span>`,'about visible version');
  result = replaceOnce(result,`summary:{app:'Gewitterradar',version:CARD_VERSION,status:summaryStatus`,`summary:{app:'Gewitterradar',version:CARD_DISPLAY_VERSION,releaseVersion:CARD_VERSION,status:summaryStatus`,'diagnostics visible version');

  return result;
}

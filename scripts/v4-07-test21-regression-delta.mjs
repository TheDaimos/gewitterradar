const replaceOnce=(source,from,to,label)=>{
  if(source.split(from).length!==2)throw new Error(`V4.07.21 anchor changed (${label})`);
  return source.replace(from,to);
};

export function v407Test21RegressionDelta(source){
  let result=source;
  result=replaceOnce(result,
    "  const CARD_DISPLAY_VERSION = '4.07.20';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST20-2026-09-14';",
    "  const CARD_DISPLAY_VERSION = '4.07.21';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST21-2026-09-14';",
    'version/build marker');

  // Keep the diagnostic header fixed while the body owns the remaining visible
  // height. The old content-box max-height could make the body's padding extend
  // below the console clip, leaving the final stop button only partly visible.
  result=replaceOnce(result,
    "          .diagnostic-console.open { display:block; }",
    "          .diagnostic-console.open { display:flex;flex-direction:column; }",
    'diagnostic console flex layout');
  result=replaceOnce(result,
    "          .diagnostic-console-head { position:relative;z-index:3;display:flex;align-items:center;gap:7px;padding:8px 10px;background:#0a1722;cursor:move;touch-action:none;border-bottom:1px solid rgba(255,68,178,.32); }",
    "          .diagnostic-console-head { position:relative;z-index:3;display:flex;flex:0 0 auto;align-items:center;gap:7px;padding:8px 10px;background:#0a1722;cursor:move;touch-action:none;border-bottom:1px solid rgba(255,68,178,.32); }",
    'diagnostic console fixed header');
  result=replaceOnce(result,
    "          .diagnostic-console-body { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;padding:8px;max-height:calc(100dvh - 70px);overflow:auto; }",
    "          .diagnostic-console-body { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;padding:8px 8px 14px;min-height:0;max-height:none;box-sizing:border-box;overflow:auto;overscroll-behavior:contain;scroll-padding-bottom:14px;flex:1 1 auto; }",
    'diagnostic body viewport-safe scrolling');
  result=replaceOnce(result,
    "            .diagnostic-console-body { display:block;max-height:calc(100dvh - 94px); }",
    "            .diagnostic-console-body { display:block;min-height:0;max-height:none;flex:1 1 auto; }",
    'diagnostic compact body viewport-safe scrolling');

  // The worldwide-search dialog is deliberately cached between openings. Its
  // event handlers therefore also retain the translation bundle that existed at
  // creation time. Rebuild only that dialog when the app language changes so a
  // Greek -> German switch is reflected immediately without an F5/full reload.
  result=replaceOnce(result,
    "      const v407EnsureLocationSearchDialog = () => {\n        let backdrop = this.shadow.getElementById('v407-location-search-backdrop');\n        if (backdrop) return backdrop;\n        const text = v407Text();",
    "      const v407EnsureLocationSearchDialog = () => {\n        const requestedLanguage = String(this._languageValue() || 'English');\n        let backdrop = this.shadow.getElementById('v407-location-search-backdrop');\n        if (backdrop && backdrop.dataset.v407Language === requestedLanguage) return backdrop;\n        if (backdrop) { backdrop.remove(); backdrop = null; }\n        const text = v407Text();",
    'location search locale cache invalidation');
  result=replaceOnce(result,
    "        backdrop.className = 'v407-location-search-backdrop';\n        backdrop.id = 'v407-location-search-backdrop';",
    "        backdrop.className = 'v407-location-search-backdrop';\n        backdrop.id = 'v407-location-search-backdrop';\n        backdrop.dataset.v407Language = requestedLanguage;",
    'location search locale cache marker');

  return result;
}

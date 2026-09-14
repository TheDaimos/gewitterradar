const replaceOnce=(source,from,to,label)=>{
  if(source.split(from).length!==2)throw new Error(`V4.07.22 anchor changed (${label})`);
  return source.replace(from,to);
};

export function v407Test22SettingsAccordionScrollDelta(source){
  let result=source;
  result=replaceOnce(
    result,
    "  const CARD_DISPLAY_VERSION = '4.07.21';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST21-2026-09-14';",
    "  const CARD_DISPLAY_VERSION = '4.07.22';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST22-2026-09-14';",
    'version/build marker'
  );

  const anchor='          @media(max-width:420px){.settings-premium-links{grid-template-columns:1fr}}';
  const css=`${anchor}\n          /* V4.07.22 – Zoom-/Viewport-sicheres Accordion.\n             Nur der Inhalt der aktuell geoeffneten Gruppe wird bei Bedarf\n             scrollbar. Bei ausreichender Hoehe bleibt die Darstellung 1:1\n             unveraendert; overflow-y:auto erzeugt keinen Scrollbereich, solange\n             der Inhalt unterhalb der dynamischen Maximalhoehe bleibt. */\n          .settings-collapsible[open] > .settings-section-content {\n            max-height:clamp(132px,calc(100vh - 440px),520px);\n            max-height:clamp(132px,calc(100dvh - 440px),520px);\n            overflow-y:auto;\n            overflow-x:hidden;\n            overscroll-behavior-y:contain;\n            -webkit-overflow-scrolling:touch;\n            scrollbar-width:thin;\n            scrollbar-color:rgba(120,138,160,.34) transparent;\n          }\n          .settings-collapsible[open] > .settings-section-content::-webkit-scrollbar { width:7px; }\n          .settings-collapsible[open] > .settings-section-content::-webkit-scrollbar-track { background:transparent; }\n          .settings-collapsible[open] > .settings-section-content::-webkit-scrollbar-thumb {\n            border-radius:999px;\n            background:rgba(120,138,160,.30);\n          }`;
  result=replaceOnce(result,anchor,css,'premium settings accordion CSS anchor');
  return result;
}

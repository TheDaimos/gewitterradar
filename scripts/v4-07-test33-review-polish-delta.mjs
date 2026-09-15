// V4.07.33: corrected review-polish delta on the exact accepted V4.07.31 candidate.
// V4.07.32 is rejected: its added CSS was inserted outside the existing Help CSS string.
// This candidate starts again from V4.07.31 and applies only the five approved review findings.

function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.07.33 anchor changed (${label})`);
  }
  return source.replace(from, to);
}

export function v407Test33ReviewPolishDelta(source) {
  let result = source;

  result = once(
    result,
    "  const CARD_DISPLAY_VERSION = '4.07.31';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST31-2026-09-14';",
    "  const CARD_DISPLAY_VERSION = '4.07.33';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST33-2026-09-15';",
    'display-and-build'
  );

  const oldEntryRenderer="if(section.entries?.length){const dl=document.createElement('dl');dl.className='help-entries';for(const [entryIndex,[term,text]] of section.entries.entries()){const dt=document.createElement('dt'),dd=document.createElement('dd');const recorderPriority=section.key==='defaults'&&/^Recorder\\b/i.test(String(term));if(recorderPriority){dt.className='help-recorder-priority';dd.className='help-recorder-priority';}setHelpDiagnosticText(dt,term);dt.append(document.createTextNode(':'));if(section.key==='location'&&entryIndex===2){const value=String(text??'');const split=value.indexOf(' ');if(split>0){const action=document.createElement('span');action.className='help-action-token help-action-use';action.textContent=value.slice(0,split).replace(/^[„“\"'«»‹›]+|[„“\"'«»‹›]+$/g,'');dd.append(action,document.createTextNode(' '));setHelpDiagnosticText(dd,value.slice(split+1));}else setHelpDiagnosticText(dd,text);}else setHelpDiagnosticText(dd,text);dl.append(dt,dd);}body.append(dl);}";
  const newEntryRenderer="if(section.entries?.length){const dl=document.createElement('dl');dl.className='help-entries';for(const [entryIndex,[term,text]] of section.entries.entries()){const dt=document.createElement('dt'),dd=document.createElement('dd');const recorderPriority=section.key==='defaults'&&/^Recorder\\b/i.test(String(term));if(recorderPriority){dt.className='help-recorder-priority';dd.className='help-recorder-priority';}setHelpDiagnosticText(dt,term);dt.append(document.createTextNode(':'));if(section.key==='location'&&(entryIndex===2||entryIndex===4)){const value=String(text??'').trimStart().replace(/^[„“\"'«»‹›]+\\s*/,'');const actionMatch=entryIndex===4?value.match(/^★\\s+\\S+/):value.match(/^\\S+/);if(actionMatch){const action=document.createElement('span');action.className=entryIndex===4?'help-action-token help-action-save':'help-action-token help-action-use';action.textContent=actionMatch[0].replace(/^[„“\"'«»‹›]+|[„“\"'«»‹›]+$/g,'');const rest=value.slice(actionMatch[0].length).replace(/^[\\s„“\"'«»‹›]+/,'');dd.append(action);if(rest){dd.append(document.createTextNode(' '));setHelpDiagnosticText(dd,rest);}}else setHelpDiagnosticText(dd,text);}else setHelpDiagnosticText(dd,text);dl.append(dt,dd);}body.append(dl);}";
  result = once(result, oldEntryRenderer, newEntryRenderer, 'localized-help-action-renderer');

  result = once(
    result,
    "          .location-saved-star { color:#f6c344;font-size:13px;line-height:1; }",
    "          .location-saved-star { display:inline-grid;place-items:center;width:14px;min-width:14px;height:18px;color:#f0c85f;font-size:13px;line-height:1;font-weight:900;background:linear-gradient(180deg,#fff4bf 0%,#f5d46f 24%,#a86f1d 51%,#ffdc7c 72%,#956015 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;text-shadow:0 1px 0 rgba(0,0,0,.9);filter:drop-shadow(0 1px 1px rgba(0,0,0,.76)) drop-shadow(0 0 2px rgba(227,176,66,.34)); }",
    'saved-star'
  );

  result = once(
    result,
    "          .location-saved-remove { color:#b98282; }\n          .location-saved-remove:hover,.location-saved-remove:focus-visible { outline:none;background:rgba(214,91,91,.11);color:#f0a0a0; }",
    "          .location-saved-remove { color:#d99a85;border:1px solid rgba(191,135,76,.42);background:linear-gradient(180deg,rgba(63,48,37,.82),rgba(27,22,20,.9));box-shadow:inset 0 1px rgba(255,229,194,.11),inset 0 -1px rgba(0,0,0,.5),0 1px 2px rgba(0,0,0,.46);text-shadow:0 1px 0 #000,0 0 4px rgba(222,120,91,.18); }\n          .location-saved-remove:hover,.location-saved-remove:focus-visible { outline:none;border-color:rgba(224,171,101,.62);background:linear-gradient(180deg,rgba(82,58,41,.92),rgba(37,27,23,.96));color:#f0b19b;box-shadow:inset 0 1px rgba(255,235,203,.15),inset 0 -1px rgba(0,0,0,.55),0 0 0 1px rgba(218,157,76,.08),0 2px 5px rgba(0,0,0,.5); }\n          .location-saved-remove:active { transform:scale(.94);filter:brightness(.92); }",
    'saved-remove'
  );

  result = once(
    result,
    "          .settings-close.settings-close-premium{position:relative;display:grid!important;place-items:center;width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important;border:0!important;border-radius:8px!important;background:transparent!important;color:transparent!important;font-size:0!important;line-height:0!important;overflow:visible;box-shadow:none!important}",
    "          .settings-dialog{position:relative}.settings-close.settings-close-premium{position:absolute!important;top:10px!important;right:10px!important;margin:0!important;z-index:60!important;display:grid!important;place-items:center;width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important;border:0!important;border-radius:8px!important;background:transparent!important;color:transparent!important;font-size:0!important;line-height:0!important;overflow:visible;box-shadow:none!important}",
    'settings-close-placement'
  );

  result = once(
    result,
    "        '.help-close{position:relative!important;top:-18px!important;right:-10px!important}.help-close img{width:34px!important;height:34px!important;filter:none!important}.help-emblem img{width:42px!important;height:42px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:none!important}.help-section-icon[data-help-icon=\"troubleshooting\"] img{width:38px!important;height:38px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:none!important}@media(max-width:520px){.help-close{top:-12px!important;right:-6px!important}.help-emblem img{width:38px!important;height:38px!important}.help-section-icon[data-help-icon=\"troubleshooting\"] img{width:36px!important;height:36px!important}}' +",
    "        '.help-dialog{position:relative}.help-close{position:absolute!important;top:10px!important;right:10px!important;margin:0!important;z-index:60!important}.help-head{padding-right:64px!important}.help-close img{width:34px!important;height:34px!important;filter:none!important}.help-emblem img{width:42px!important;height:42px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:none!important}.help-section-icon[data-help-icon=\"troubleshooting\"] img{width:38px!important;height:38px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:none!important}@media(max-width:520px){.help-emblem img{width:38px!important;height:38px!important}.help-section-icon[data-help-icon=\"troubleshooting\"] img{width:36px!important;height:36px!important}}' +",
    'help-close-placement'
  );

  result = once(
    result,
    "        .about-dialog .about-close{position:absolute;right:0;top:0;width:44px;height:44px;min-height:44px;padding:0;border:0;background:transparent;display:grid;place-items:center;z-index:2}",
    "        .about-dialog .about-close{position:absolute;right:10px;top:10px;width:44px;height:44px;min-height:44px;padding:0;border:0;background:transparent;display:grid;place-items:center;z-index:60}",
    'about-close-placement'
  );

  return result;
}

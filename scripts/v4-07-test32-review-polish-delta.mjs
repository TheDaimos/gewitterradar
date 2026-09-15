// V4.07.32: narrow review-polish delta on the exact accepted V4.07.31 candidate.
// Scope is intentionally limited to the five user-approved review findings:
// 1) localized Save action token rendering,
// 2) stray quote cleanup after localized Use action,
// 3) consistent premium dialog close placement,
// 4) premium saved-place remove control,
// 5) deeper metallic saved-place star.
// No location logic, persistence semantics, external locale payload or data model is changed.

function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.07.32 anchor changed (${label})`);
  }
  return source.replace(from, to);
}

export function v407Test32ReviewPolishDelta(source) {
  let result = source;

  result = once(
    result,
    "  const CARD_VERSION = '4.07.31';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST31-2026-09-14';",
    "  const CARD_VERSION = '4.07.32';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST32-2026-09-15';",
    'version-and-build'
  );

  const oldEntryRenderer = `if(section.entries?.length){const dl=document.createElement('dl');dl.className='help-entries';for(const [entryIndex,[term,text]] of section.entries.entries()){const dt=document.createElement('dt'),dd=document.createElement('dd');const recorderPriority=section.key==='defaults'&&/^Recorder\\b/i.test(String(term));if(recorderPriority){dt.className='help-recorder-priority';dd.className='help-recorder-priority';}setHelpDiagnosticText(dt,term);dt.append(document.createTextNode(':'));if(section.key==='location'&&entryIndex===2){const value=String(text??'');const split=value.indexOf(' ');if(split>0){const action=document.createElement('span');action.className='help-action-token help-action-use';action.textContent=value.slice(0,split).replace(/^[„“\\"'«»‹›]+|[„“\\"'«»‹›]+$/g,'');dd.append(action,document.createTextNode(' '));setHelpDiagnosticText(dd,value.slice(split+1));}else setHelpDiagnosticText(dd,text);}else setHelpDiagnosticText(dd,text);dl.append(dt,dd);}body.append(dl);}`;

  const newEntryRenderer = `if(section.entries?.length){const dl=document.createElement('dl');dl.className='help-entries';for(const [entryIndex,[term,text]] of section.entries.entries()){const dt=document.createElement('dt'),dd=document.createElement('dd');const recorderPriority=section.key==='defaults'&&/^Recorder\\b/i.test(String(term));if(recorderPriority){dt.className='help-recorder-priority';dd.className='help-recorder-priority';}setHelpDiagnosticText(dt,term);dt.append(document.createTextNode(':'));if(section.key==='location'&&(entryIndex===2||entryIndex===4)){const value=String(text??'').trimStart().replace(/^[„“\\"'«»‹›]+\\s*/,'');const actionMatch=entryIndex===4?value.match(/^★\\s+\\S+/):value.match(/^\\S+/);if(actionMatch){const action=document.createElement('span');action.className=entryIndex===4?'help-action-token help-action-save':'help-action-token help-action-use';action.textContent=actionMatch[0].replace(/^[„“\\"'«»‹›]+|[„“\\"'«»‹›]+$/g,'');const rest=value.slice(actionMatch[0].length).replace(/^[\\s„“\\"'«»‹›]+/,'');dd.append(action);if(rest){dd.append(document.createTextNode(' '));setHelpDiagnosticText(dd,rest);}}else setHelpDiagnosticText(dd,text);}else setHelpDiagnosticText(dd,text);dl.append(dt,dd);}body.append(dl);}`;

  result = once(result, oldEntryRenderer, newEntryRenderer, 'localized-help-action-renderer');

  const cssAnchor = `.help-action-use:before{content:'';position:absolute;left:1px;right:1px;top:1px;height:42%;border-radius:4px;background:linear-gradient(180deg,rgba(211,235,249,.18),rgba(211,235,249,0));pointer-events:none}`;
  const polishCss = String.raw`
/* V4.07.32 accepted review polish: consistent dialog close geometry and premium saved-place controls. */
.settings-dialog,.help-dialog,.about-dialog{position:relative}
.settings-close.settings-close-premium,.help-close,.about-close{position:absolute!important;top:10px!important;right:10px!important;margin:0!important;z-index:60!important}
.settings-head,.settings-header,.help-head{padding-right:56px!important}
.location-saved-star{
  display:inline-grid;
  place-items:center;
  width:14px;
  min-width:14px;
  height:18px;
  line-height:1;
  font-weight:900;
  color:#f0c85f;
  background:linear-gradient(180deg,#fff4bf 0%,#f5d46f 24%,#a86f1d 51%,#ffdc7c 72%,#956015 100%);
  -webkit-background-clip:text;
  background-clip:text;
  -webkit-text-fill-color:transparent;
  text-shadow:0 1px 0 rgba(0,0,0,.9);
  filter:drop-shadow(0 1px 1px rgba(0,0,0,.76)) drop-shadow(0 0 2px rgba(227,176,66,.34));
}
.location-saved-remove{
  border:1px solid rgba(191,135,76,.42)!important;
  background:linear-gradient(180deg,rgba(63,48,37,.82),rgba(27,22,20,.9))!important;
  color:#d99a85!important;
  box-shadow:inset 0 1px rgba(255,229,194,.11),inset 0 -1px rgba(0,0,0,.5),0 1px 2px rgba(0,0,0,.46)!important;
  text-shadow:0 1px 0 #000,0 0 4px rgba(222,120,91,.18);
}
.location-saved-remove:hover,.location-saved-remove:focus-visible{
  border-color:rgba(224,171,101,.62)!important;
  background:linear-gradient(180deg,rgba(82,58,41,.92),rgba(37,27,23,.96))!important;
  color:#f0b19b!important;
  box-shadow:inset 0 1px rgba(255,235,203,.15),inset 0 -1px rgba(0,0,0,.55),0 0 0 1px rgba(218,157,76,.08),0 2px 5px rgba(0,0,0,.5)!important;
}
.location-saved-remove:active{transform:scale(.94);filter:brightness(.92)}
`;
  result = once(result, cssAnchor, cssAnchor + polishCss, 'review-polish-css');

  return result;
}

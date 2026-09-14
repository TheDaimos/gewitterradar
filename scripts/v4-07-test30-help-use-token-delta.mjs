const replaceOnce=(source,from,to,label)=>{if(source.split(from).length!==2)throw new Error(`V4.07.30 anchor changed (${label})`);return source.replace(from,to);};

export function v407Test30HelpUseTokenDelta(source){
  let result=source;

  result=replaceOnce(
    result,
    "  const CARD_DISPLAY_VERSION = '4.07.29';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST29-2026-09-14';",
    "  const CARD_DISPLAY_VERSION = '4.07.30';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST30-2026-09-14';",
    'display/build marker'
  );

  result=replaceOnce(
    result,
    '„Nutzen“ übernimmt den gewählten Ort sofort als Bezugsstandort, schließt die Ortssuche automatisch und fährt die Karte direkt zum neuen Standort.',
    'Nutzen übernimmt den gewählten Ort sofort als Bezugsstandort, schließt die Ortssuche automatisch und fährt die Karte direkt zum neuen Standort.',
    'German use button quotation marks'
  );

  const oldEntryRenderer="if(section.entries?.length){const dl=document.createElement('dl');dl.className='help-entries';for(const [term,text] of section.entries){const dt=document.createElement('dt'),dd=document.createElement('dd');const recorderPriority=section.key==='defaults'&&/^Recorder\\b/i.test(String(term));if(recorderPriority){dt.className='help-recorder-priority';dd.className='help-recorder-priority';}setHelpDiagnosticText(dt,term);dt.append(document.createTextNode(':'));setHelpDiagnosticText(dd,text);dl.append(dt,dd);}body.append(dl);}";
  const newEntryRenderer="if(section.entries?.length){const dl=document.createElement('dl');dl.className='help-entries';for(const [entryIndex,[term,text]] of section.entries.entries()){const dt=document.createElement('dt'),dd=document.createElement('dd');const recorderPriority=section.key==='defaults'&&/^Recorder\\b/i.test(String(term));if(recorderPriority){dt.className='help-recorder-priority';dd.className='help-recorder-priority';}setHelpDiagnosticText(dt,term);dt.append(document.createTextNode(':'));if(section.key==='location'&&entryIndex===2){const value=String(text??'');const split=value.indexOf(' ');if(split>0){const action=document.createElement('span');action.className='help-action-token help-action-use';action.textContent=value.slice(0,split).replace(/^[„“\"'«»‹›]+|[„“\"'«»‹›]+$/g,'');dd.append(action,document.createTextNode(' '));setHelpDiagnosticText(dd,value.slice(split+1));}else setHelpDiagnosticText(dd,text);}else setHelpDiagnosticText(dd,text);dl.append(dt,dd);}body.append(dl);}";
  result=replaceOnce(result,oldEntryRenderer,newEntryRenderer,'location Use/Nutzen action renderer');

  const oldProcess='.help-process-highlight{display:inline-block;padding:1px 7px;border:1px solid rgba(255,213,116,.88);border-radius:5px;color:#fff0bd!important;background:linear-gradient(180deg,rgba(126,87,22,.62),rgba(58,37,9,.72));box-shadow:inset 0 1px rgba(255,243,197,.28),0 0 0 1px rgba(92,58,7,.32),0 0 8px rgba(228,177,70,.24);font-weight:900;text-shadow:0 1px 1px rgba(0,0,0,.9),0 0 4px rgba(244,199,99,.28)}';
  const newProcess='.help-process-highlight{display:inline-block;padding:1px 6px;border:1px solid rgba(225,190,110,.46);border-radius:5px;color:#e8d6a5!important;background:linear-gradient(180deg,rgba(104,76,29,.28),rgba(47,34,15,.32));box-shadow:inset 0 1px rgba(255,239,190,.10);font-weight:800;text-shadow:0 1px 1px rgba(0,0,0,.72)}';
  result=replaceOnce(result,oldProcess,newProcess,'subtle Location entity styling');

  const saveInset='.help-action-save:before{content:"";position:absolute;inset:2px;border:1px solid rgba(247,220,151,.11);border-radius:.18em;box-shadow:inset 0 1px 0 rgba(255,245,211,.08),inset 0 -1px 0 rgba(20,13,4,.32);pointer-events:none}';
  const useCss='.help-action-use{height:1.56em;min-height:1.56em;padding:0 .52em;border:1px solid #5d849c;border-radius:.29em;color:#e5edf2!important;letter-spacing:.008em;overflow:hidden;background:repeating-linear-gradient(0deg,rgba(255,255,255,.026) 0 1px,rgba(0,0,0,.025) 1px 3px),repeating-linear-gradient(96deg,rgba(255,255,255,.018) 0 1px,rgba(0,0,0,.020) 1px 4px),radial-gradient(ellipse at 30% 10%,rgba(219,241,255,.13) 0 8%,rgba(255,255,255,0) 40%),linear-gradient(180deg,#426d85 0%,#29495c 13%,#355d73 38%,#294b5f 63%,#1b3342 100%);background-blend-mode:soft-light,soft-light,soft-light,normal;box-shadow:inset 0 0 0 1px rgba(10,24,34,.62),inset 0 0 0 2px rgba(174,218,243,.07),inset 0 1px 0 rgba(225,246,255,.22),inset 0 -2px 2px rgba(7,18,25,.52),inset 1px 0 0 rgba(206,236,252,.06),inset -1px 0 0 rgba(7,17,24,.44),0 1px 2px rgba(0,0,0,.66),0 0 0 1px rgba(4,11,16,.28);text-shadow:0 1px 0 rgba(5,13,19,.98),0 -1px 0 rgba(222,244,255,.13),0 0 1px rgba(178,221,245,.16)}.help-action-use:before{content:"";position:absolute;inset:2px;border:1px solid rgba(174,218,243,.11);border-radius:.18em;box-shadow:inset 0 1px 0 rgba(226,246,255,.07),inset 0 -1px 0 rgba(7,18,25,.32);pointer-events:none}';
  result=replaceOnce(result,saveInset,saveInset+useCss,'blue Use/Nutzen premium button');

  return result;
}

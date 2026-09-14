const replaceOnce=(source,from,to,label)=>{if(source.split(from).length!==2)throw new Error(`V4.07.25 anchor changed (${label})`);return source.replace(from,to);};

export function v407Test25HelpTokenClarityDelta(source){
  let result=source;

  result=replaceOnce(
    result,
    "  const CARD_DISPLAY_VERSION = '4.07.24';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST24-2026-09-14';",
    "  const CARD_DISPLAY_VERSION = '4.07.25';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST25-2026-09-14';",
    'display/build marker'
  );

  const oldCss='.help-dialog{height:auto!important;min-height:0!important;max-height:min(900px,calc(100dvh - 16px))!important}.help-content{flex:0 1 auto}.help-process-highlight{display:inline-block;padding:1px 6px;border:1px solid rgba(245,202,111,.58);border-radius:5px;color:#ffe7a8!important;background:linear-gradient(180deg,rgba(229,182,82,.18),rgba(99,68,20,.16));box-shadow:inset 0 1px rgba(255,244,207,.16),0 0 8px rgba(218,166,67,.16);font-weight:800;text-shadow:0 0 5px rgba(223,177,78,.24)}.help-action-token{display:inline-block;font-weight:900;line-height:1;vertical-align:.02em;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;filter:drop-shadow(0 1px 1px rgba(0,0,0,.75))}.help-action-save{background:linear-gradient(180deg,#fff5c9 0%,#efc960 28%,#8a5511 55%,#ffd978 78%,#a56a17 100%);filter:drop-shadow(0 1px 1px #000b) drop-shadow(0 0 3px rgba(231,185,76,.42))}.help-action-delete{background:linear-gradient(180deg,#ffd8d1 0%,#e86a5d 28%,#7d211d 55%,#f58d80 78%,#8f2923 100%);filter:drop-shadow(0 1px 1px #000b) drop-shadow(0 0 3px rgba(222,78,66,.38))}.help-action-restore{background:linear-gradient(180deg,#e1f4ff 0%,#75bcea 28%,#245c8d 55%,#9ed8fb 78%,#2d6d9f 100%);filter:drop-shadow(0 1px 1px #000b) drop-shadow(0 0 3px rgba(87,164,218,.42))}';

  const newCss='.help-dialog{height:auto!important;min-height:0!important;max-height:min(900px,calc(100dvh - 16px))!important}.help-content{flex:0 1 auto}.help-process-highlight{display:inline-block;padding:1px 7px;border:1px solid rgba(255,213,116,.88);border-radius:5px;color:#fff0bd!important;background:linear-gradient(180deg,rgba(126,87,22,.62),rgba(58,37,9,.72));box-shadow:inset 0 1px rgba(255,243,197,.28),0 0 0 1px rgba(92,58,7,.32),0 0 8px rgba(228,177,70,.24);font-weight:900;text-shadow:0 1px 1px rgba(0,0,0,.9),0 0 4px rgba(244,199,99,.28)}.help-action-token{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;font-weight:950;line-height:1;vertical-align:-.10em;color:#fff!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;text-shadow:0 1px 1px rgba(0,0,0,.95)}.help-action-save{min-height:1.48em;padding:.10em .42em;border:1px solid #f4cc70;border-radius:.38em;color:#fff0b9!important;background:linear-gradient(180deg,#765018 0%,#b27a22 42%,#5d390d 100%);box-shadow:inset 0 1px rgba(255,239,185,.34),0 1px 2px rgba(0,0,0,.68),0 0 5px rgba(229,177,65,.30)}.help-action-delete,.help-action-restore{width:1.42em;height:1.42em;margin:0 .08em;border-radius:50%;font-size:1.08em;color:#fff!important;box-shadow:inset 0 1px rgba(255,255,255,.28),0 1px 2px rgba(0,0,0,.72)}.help-action-delete{border:1px solid #f18378;background:linear-gradient(180deg,#bf5147 0%,#7b2520 52%,#4a1412 100%);box-shadow:inset 0 1px rgba(255,224,220,.30),0 1px 2px rgba(0,0,0,.72),0 0 5px rgba(227,85,72,.28)}.help-action-restore{border:1px solid #8ed0fa;background:linear-gradient(180deg,#4b99cc 0%,#235f8e 52%,#163d5e 100%);box-shadow:inset 0 1px rgba(225,246,255,.30),0 1px 2px rgba(0,0,0,.72),0 0 5px rgba(83,164,219,.30)}';

  result=replaceOnce(result,oldCss,newCss,'semantic Help token styling');

  return result;
}

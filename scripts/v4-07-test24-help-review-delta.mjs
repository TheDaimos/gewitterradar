const replaceOnce=(source,from,to,label)=>{if(source.split(from).length!==2)throw new Error(`V4.07.24 anchor changed (${label})`);return source.replace(from,to);};

export function v407Test24HelpReviewDelta(source){
  let result=source;

  result=replaceOnce(
    result,
    "  const CARD_DISPLAY_VERSION = '4.07.23';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST23-2026-09-14';",
    "  const CARD_DISPLAY_VERSION = '4.07.24';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST24-2026-09-14';",
    'display/build marker'
  );

  result=replaceOnce(
    result,
    'Mit × wird ein Ort weich entfernt; der zugehörige To-do-Eintrag wird lediglich als erledigt markiert. Unter „Entfernte Orte“ stellt ↶ ihn jederzeit wieder her; Koordinaten und Metadaten bleiben erhalten.',
    'Mit × wird ein Ort nicht sofort gelöscht, sondern zur Löschung vorgemerkt. Unter „Entfernte Orte“ stellt ↶ ihn jederzeit wieder her; Koordinaten und Metadaten bleiben erhalten.',
    'German saved-place removal wording'
  );

  result=replaceOnce(
    result,
    '× performs a soft removal by marking the matching to-do item completed. Under Removed places, ↶ restores it at any time while keeping coordinates and metadata.',
    '× does not delete a place immediately; it marks the place for removal. Under Removed places, ↶ restores it at any time while keeping coordinates and metadata.',
    'English saved-place removal wording'
  );

  const oldPattern="const helpNetworkTokenPattern=/device_tracker\\.gewitterradar(?:_dashboard)?|gewitterradar\\.set_reference_coordinates|a\\/b\\/c\\.tile\\.openstreetmap\\.org|(?:\\*\\.)?(?:[a-z0-9-]+\\.)+[a-z]{2,24}(?::\\d{1,5})?|\\b(?:HTTPS|HTTP|MQTT)\\/TCP\\s+\\d{1,5}\\b|\\b(?:TCP|UDP)[ -]?\\d{1,5}\\b|\\b(?:Open-Meteo(?: Geocoding)?|OpenStreetMap(?: Nominatim|-Kacheln|-Kachelserver|-tiles| tiles)?|Nominatim|Leaflet(?: 1\\.9\\.4)?|GitHub\\/HACS|GitHub|HACS|Local(?:-|\\s)to-do(?:-Liste|-list)?|Dashboard-Setz-Script|Companion App|DNS|TLS-Inspection|CORS)\\b/gi;";
  const newPattern="const helpNetworkTokenPattern=/★ Speichern|★ Save|Location entity|×|↶|device_tracker\\.gewitterradar(?:_dashboard)?|gewitterradar\\.set_reference_coordinates|a\\/b\\/c\\.tile\\.openstreetmap\\.org|(?:\\*\\.)?(?:[a-z0-9-]+\\.)+[a-z]{2,24}(?::\\d{1,5})?|\\b(?:HTTPS|HTTP|MQTT)\\/TCP\\s+\\d{1,5}\\b|\\b(?:TCP|UDP)[ -]?\\d{1,5}\\b|\\b(?:Open-Meteo(?: Geocoding)?|OpenStreetMap(?: Nominatim|-Kacheln|-Kachelserver|-tiles| tiles)?|Nominatim|Leaflet(?: 1\\.9\\.4)?|GitHub\\/HACS|GitHub|HACS|Local(?:-|\\s)to-do(?:-Liste|-list)?|Dashboard-Setz-Script|Companion App|DNS|TLS-Inspection|CORS)\\b/gi;";
  result=replaceOnce(result,oldPattern,newPattern,'Help semantic token pattern');

  result=replaceOnce(
    result,
    "const token=document.createElement('span');token.className='help-network-highlight';token.textContent=match[0];target.append(token);cursor=match.index+match[0].length;",
    "const token=document.createElement('span'),tokenText=match[0];if(tokenText==='★ Speichern'||tokenText==='★ Save')token.className='help-action-token help-action-save';else if(tokenText==='×')token.className='help-action-token help-action-delete';else if(tokenText==='↶')token.className='help-action-token help-action-restore';else if(tokenText==='Location entity')token.className='help-process-highlight';else token.className='help-network-highlight';token.textContent=tokenText;target.append(token);cursor=match.index+tokenText.length;",
    'Help semantic token renderer'
  );

  const reviewCss='.help-dialog{height:auto!important;min-height:0!important;max-height:min(900px,calc(100dvh - 16px))!important}.help-content{flex:0 1 auto}.help-process-highlight{display:inline-block;padding:1px 6px;border:1px solid rgba(245,202,111,.58);border-radius:5px;color:#ffe7a8!important;background:linear-gradient(180deg,rgba(229,182,82,.18),rgba(99,68,20,.16));box-shadow:inset 0 1px rgba(255,244,207,.16),0 0 8px rgba(218,166,67,.16);font-weight:800;text-shadow:0 0 5px rgba(223,177,78,.24)}.help-action-token{display:inline-block;font-weight:900;line-height:1;vertical-align:.02em;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;filter:drop-shadow(0 1px 1px rgba(0,0,0,.75))}.help-action-save{background:linear-gradient(180deg,#fff5c9 0%,#efc960 28%,#8a5511 55%,#ffd978 78%,#a56a17 100%);filter:drop-shadow(0 1px 1px #000b) drop-shadow(0 0 3px rgba(231,185,76,.42))}.help-action-delete{background:linear-gradient(180deg,#ffd8d1 0%,#e86a5d 28%,#7d211d 55%,#f58d80 78%,#8f2923 100%);filter:drop-shadow(0 1px 1px #000b) drop-shadow(0 0 3px rgba(222,78,66,.38))}.help-action-restore{background:linear-gradient(180deg,#e1f4ff 0%,#75bcea 28%,#245c8d 55%,#9ed8fb 78%,#2d6d9f 100%);filter:drop-shadow(0 1px 1px #000b) drop-shadow(0 0 3px rgba(87,164,218,.42))}';
  result=replaceOnce(
    result,
    "        '</style><dialog class=\"help-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"help-title\">",
    "        '"+reviewCss+"' +\n        '</style><dialog class=\"help-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"help-title\">",
    'adaptive Help frame and process/action styling'
  );

  return result;
}

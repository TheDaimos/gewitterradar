function once(source,from,to,label){
  if(source.split(from).length!==2) throw new Error(`V4.07.40 anchor changed (${label})`);
  return source.replace(from,to);
}

export function v407Test40TargetReadabilityDelta(source,tabAssetBase64,listAssetBase64){
  if(!tabAssetBase64) throw new Error('V4.07.40 tab target base64 missing');
  if(!listAssetBase64) throw new Error('V4.07.40 list target base64 missing');
  let result=source;
  result=once(result,
    "  const CARD_DISPLAY_VERSION = '4.07.39';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST39-2026-09-15';",
    "  const CARD_DISPLAY_VERSION = '4.07.40';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST40-2026-09-15';",'version');

  const iconPattern=/  const V407_COORDINATE_TARGET_ICON = 'data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+';/g;
  const iconMatches=result.match(iconPattern)||[];
  if(iconMatches.length!==1) throw new Error(`V4.07.40 embedded target count changed (${iconMatches.length})`);
  result=result.replace(iconPattern,
    `  const V407_COORDINATE_TARGET_TAB_ICON = 'data:image/svg+xml;base64,${tabAssetBase64}';\n  const V407_COORDINATE_TARGET_LIST_ICON = 'data:image/svg+xml;base64,${listAssetBase64}';`);

  result=once(result,
    '              targetImage.src = V407_COORDINATE_TARGET_ICON;',
    '              targetImage.src = V407_COORDINATE_TARGET_LIST_ICON;',
    'saved-target-source');

  result=once(result,
    'src="${V407_COORDINATE_TARGET_ICON}"',
    'src="${V407_COORDINATE_TARGET_TAB_ICON}"',
    'tab-target-source');

  result=once(result,
    "          .location-saved-target { width:15px;height:15px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 15px;filter:drop-shadow(0 0 1px rgba(86,170,236,.28)); }\n          .location-saved-target img { display:block;width:15px;height:15px;object-fit:contain; }",
    "          .location-saved-target { width:17px;height:17px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 17px;filter:drop-shadow(0 1px 1px rgba(0,0,0,.62)); }\n          .location-saved-target img { display:block;width:17px;height:17px;object-fit:contain; }",
    'saved-target-css');

  result=once(result,
    "          .v407-location-mode-target img { width:27px;height:27px;display:block;object-fit:contain;filter:drop-shadow(0 2px 3px rgba(0,0,0,.52)); }",
    "          .v407-location-mode-target img { width:27px;height:27px;display:block;object-fit:contain;filter:drop-shadow(0 1px 2px rgba(0,0,0,.58)); }",
    'tab-target-css');

  return result;
}

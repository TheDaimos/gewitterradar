const replaceOnce=(source,from,to,label)=>{
  if(source.split(from).length!==2)throw new Error(`V4.07.18 iPad clear anchor changed (${label})`);
  return source.replace(from,to);
};

export function v407IpadQueryClearTest18Delta(source){
  let result=source;
  result=replaceOnce(
    result,
    "  const CARD_DISPLAY_VERSION = '4.07.17';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST17-2026-09-14';",
    "  const CARD_DISPLAY_VERSION = '4.07.18';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST18-2026-09-14';",
    'display/build marker'
  );
  result=replaceOnce(
    result,
    '<input id="v407-location-query" type="search" autocomplete="off" spellcheck="false"><button type="button" class="v407-location-query-clear"',
    '<input id="v407-location-query" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" spellcheck="false"><button type="button" class="v407-location-query-clear"',
    'query input avoids native WebKit searchfield layer'
  );
  result=replaceOnce(
    result,
    '#v407-location-query { padding-right:40px; }',
    '#v407-location-query { padding-right:40px;-webkit-appearance:none;appearance:none;position:relative;z-index:1; }',
    'deterministic query input appearance'
  );
  result=replaceOnce(
    result,
    'appearance:none;-webkit-appearance:none;position:absolute;right:4px;bottom:4px;z-index:3;',
    'appearance:none;-webkit-appearance:none;position:absolute;right:4px;bottom:4px;z-index:4;touch-action:manipulation;-webkit-tap-highlight-color:transparent;',
    'clear button WebKit touch layer'
  );
  return result;
}

const replaceOnce = (source, from, to, label) => {
  if (source.split(from).length !== 2) throw new Error(`V4.07.19 anchor changed (${label})`);
  return source.replace(from,to);
};

export function v407Test19RegressionDelta(source) {
  let result = source;
  result = replaceOnce(result,
    "  const CARD_DISPLAY_VERSION = '4.07.18';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST18-2026-09-14';",
    "  const CARD_DISPLAY_VERSION = '4.07.19';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST19-2026-09-14';",
    'version/build marker');

  result = replaceOnce(result,
    "    const location = {key:'location',title:copy.lt,paragraphs:copy.lp,notes:copy.ln};",
    "    const location = {key:'location',title:copy.lt,paragraphs:copy.lp,notes:[copy.ln.join(' ')]};",
    'external Help runtime schema');

  result = replaceOnce(result,
    '#v407-location-query { padding-right:40px;-webkit-appearance:none;appearance:none;position:relative;z-index:1; }\n          #v407-location-query::-webkit-search-cancel-button { -webkit-appearance:none;appearance:none; }',
    '#v407-location-query,#v407-location-country { padding-right:40px;-webkit-appearance:none;appearance:none;position:relative;z-index:1; }\n          #v407-location-query::-webkit-search-cancel-button,#v407-location-country::-webkit-search-cancel-button { -webkit-appearance:none;appearance:none; }',
    'query/country input appearance');

  result = replaceOnce(result,
    '.v407-location-query-clear {\n            appearance:none;',
    '.v407-location-query-clear,.v407-location-country-clear {\n            appearance:none;',
    'shared clear-button style');

  result = replaceOnce(result,
    '.v407-location-query-clear.is-visible,\n          #v407-location-query:not(:placeholder-shown) + .v407-location-query-clear { opacity:1;visibility:visible;pointer-events:auto;transform:none; }',
    '.v407-location-query-clear.is-visible,.v407-location-country-clear.is-visible,\n          #v407-location-query:not(:placeholder-shown) + .v407-location-query-clear { opacity:1;visibility:visible;pointer-events:auto;transform:none; }',
    'shared clear-button visibility');

  result = replaceOnce(result,
    '.v407-location-query-clear:hover,.v407-location-query-clear:focus-visible { outline:none;background:rgba(79,163,247,.10);color:#e7f4ff; }',
    '.v407-location-query-clear:hover,.v407-location-query-clear:focus-visible,.v407-location-country-clear:hover,.v407-location-country-clear:focus-visible { outline:none;background:rgba(79,163,247,.10);color:#e7f4ff; }',
    'shared clear-button focus');

  result = replaceOnce(result,
    '<div class="v407-location-search-field"><label for="v407-location-country"></label><input id="v407-location-country" type="search" autocomplete="off" spellcheck="false"><div class="v407-country-suggestions"></div></div>',
    '<div class="v407-location-search-field"><label for="v407-location-country"></label><input id="v407-location-country" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" spellcheck="false"><button type="button" class="v407-location-country-clear" aria-label="${v407ClearQueryLabel()}" title="${v407ClearQueryLabel()}" aria-hidden="true" tabindex="-1">×</button><div class="v407-country-suggestions"></div></div>',
    'country clear markup');

  result = replaceOnce(result,
    "        const countryInput = backdrop.querySelector('#v407-location-country');\n        const suggestions = backdrop.querySelector('.v407-country-suggestions');",
    "        const countryInput = backdrop.querySelector('#v407-location-country');\n        const clearCountryButton = backdrop.querySelector('.v407-location-country-clear');\n        const suggestions = backdrop.querySelector('.v407-country-suggestions');",
    'country clear DOM reference');

  result = replaceOnce(result,
    "        const renderSuggestions = () => {",
    "        const syncV407CountryClear = () => {\n          const visible = !!String(countryInput.value || '').length;\n          clearCountryButton.classList.toggle('is-visible',visible);\n          clearCountryButton.setAttribute('aria-hidden',visible ? 'false' : 'true');\n          clearCountryButton.tabIndex = visible ? 0 : -1;\n        };\n        const renderSuggestions = () => {",
    'country clear sync helper');

  result = replaceOnce(result,
    "            button.addEventListener('click',() => { countryInput.value=`${record.local} (${record.code})`; countryInput.dataset.countryCode=record.code; suggestions.classList.remove('open'); queryInput.focus(); });",
    "            button.addEventListener('click',() => { countryInput.value=`${record.local} (${record.code})`; countryInput.dataset.countryCode=record.code; suggestions.classList.remove('open'); syncV407CountryClear(); queryInput.focus(); });",
    'country suggestion clear sync');

  result = replaceOnce(result,
    "        countryInput.addEventListener('input',renderSuggestions);\n        countryInput.addEventListener('focus',renderSuggestions);\n        const setStatus =",
    "        countryInput.addEventListener('input',renderSuggestions);\n        countryInput.addEventListener('focus',renderSuggestions);\n        ['input','change','keyup','search','focus'].forEach((eventName) => countryInput.addEventListener(eventName,syncV407CountryClear));\n        clearCountryButton.addEventListener('click',() => {\n          countryInput.value='';\n          countryInput.dataset.countryCode='';\n          suggestions.classList.remove('open');\n          suggestions.replaceChildren();\n          syncV407CountryClear();\n          countryInput.focus({preventScroll:true});\n        });\n        syncV407CountryClear();\n        const setStatus =",
    'country clear runtime');

  return result;
}

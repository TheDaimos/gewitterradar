const replaceOnce = (source, from, to, label) => {
  if (source.split(from).length !== 2) throw new Error(`V4.07 TEST9 clear-query anchor changed (${label})`);
  return source.replace(from,to);
};

export function v407LocationQueryClearDelta(source) {
  let result = source;

  result = replaceOnce(
    result,
    "const GEWITTERRADAR_BUILD = 'V4.07-TEST8-2026-09-13';",
    "const GEWITTERRADAR_BUILD = 'V4.07-TEST9-2026-09-13';",
    'build marker'
  );

  result = replaceOnce(
    result,
    `          .v407-location-search-field input:focus { border-color:rgba(79,163,247,.62);box-shadow:0 0 0 2px rgba(79,163,247,.10); }\n          .v407-location-search-submit {`,
    `          .v407-location-search-field input:focus { border-color:rgba(79,163,247,.62);box-shadow:0 0 0 2px rgba(79,163,247,.10); }\n          .v407-location-query-wrap { position:relative; }\n          .v407-location-query-wrap input { padding-right:40px; }\n          .v407-location-query-wrap input::-webkit-search-cancel-button { -webkit-appearance:none;appearance:none; }\n          .v407-location-query-clear {\n            appearance:none;-webkit-appearance:none;position:absolute;right:4px;top:50%;transform:translateY(-50%);\n            width:30px;height:30px;display:grid;place-items:center;border:0;border-radius:7px;background:transparent;\n            color:#7891a7;font:700 18px/1 inherit;cursor:pointer;padding:0;transition:background .15s ease,color .15s ease,opacity .15s ease;\n          }\n          .v407-location-query-clear:hover,.v407-location-query-clear:focus-visible { outline:none;background:rgba(79,163,247,.10);color:#cfe8ff; }\n          .v407-location-query-clear[hidden] { display:none; }\n          .v407-location-search-submit {`,
    'clear-query css'
  );

  result = replaceOnce(
    result,
    `      const v407NormalizeText = (value) =>`,
    `      const v407ClearQueryLabel = () => ({\n        'Deutsch':'Eingabe löschen','English':'Clear input','Dansk':'Ryd indtastning','Español':'Borrar entrada','Français':'Effacer la saisie',\n        'Nederlands':'Invoer wissen','Polski':'Wyczyść wpis','Português':'Limpar entrada','Svenska':'Rensa inmatning','Italiano':'Cancella immissione',\n        'Norsk bokmål':'Tøm inntasting','Suomi':'Tyhjennä syöte','Čeština':'Vymazat zadání','Ελληνικά':'Εκκαθάριση εισαγωγής','Magyar':'Bevitel törlése',\n        'Boarisch':'Eingab löschn','Plattdüütsch':'Ingaav wegmaken','Sächs’sch':'Eingabe löschn','Schwäbisch':'Eingab löscha'\n      }[this._languageValue()] || 'Clear input');\n      const v407NormalizeText = (value) =>`,
    'clear-query labels'
  );

  result = replaceOnce(
    result,
    `<div class="v407-location-search-field"><label for="v407-location-query"></label><input id="v407-location-query" type="search" autocomplete="off" spellcheck="false"></div>`,
    `<div class="v407-location-search-field"><label for="v407-location-query"></label><div class="v407-location-query-wrap"><input id="v407-location-query" type="search" autocomplete="off" spellcheck="false"><button type="button" class="v407-location-query-clear" aria-label="\${v407ClearQueryLabel()}" title="\${v407ClearQueryLabel()}" hidden>×</button></div></div>`,
    'query field markup'
  );

  result = replaceOnce(
    result,
    `        const queryInput = backdrop.querySelector('#v407-location-query');\n        const countryInput = backdrop.querySelector('#v407-location-country');`,
    `        const queryInput = backdrop.querySelector('#v407-location-query');\n        const clearQueryButton = backdrop.querySelector('.v407-location-query-clear');\n        const countryInput = backdrop.querySelector('#v407-location-country');`,
    'query clear reference'
  );

  result = replaceOnce(
    result,
    `        let v407ActiveResultCountry = '';\n        const v407CountryFlag = (code) =>`,
    `        let v407ActiveResultCountry = '';\n        const syncV407QueryClear = () => { clearQueryButton.hidden = !String(queryInput.value || '').length; };\n        queryInput.addEventListener('input',syncV407QueryClear);\n        clearQueryButton.addEventListener('click',() => {\n          queryInput.value='';\n          v407ActiveResultCountry='';\n          results.replaceChildren();\n          setStatus('');\n          syncV407QueryClear();\n          queryInput.focus({preventScroll:true});\n        });\n        syncV407QueryClear();\n        const v407CountryFlag = (code) =>`,
    'query clear behavior'
  );

  return result;
}

import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const candidate = await readFile(resolve(root,'artifacts/v407/gewitterradar.js'),'utf8');

const required = [
  "const CARD_VERSION = '4.07';",
  "const GEWITTERRADAR_BUILD = 'V4.07-TEST9-2026-09-13';",
  'v407-location-query-wrap',
  'v407-location-query-clear',
  'v407ClearQueryLabel',
  "queryInput.addEventListener('input',syncV407QueryClear);",
  "clearQueryButton.addEventListener('click',() => {",
  "queryInput.value='';",
  "v407ActiveResultCountry='';",
  'results.replaceChildren();',
  "setStatus('');",
  'queryInput.focus({preventScroll:true});',
  "'Deutsch':'Eingabe löschen'",
  "'English':'Clear input'",
  "'Schwäbisch':'Eingab löscha'",
  'release-history-language-toggle',
  "document.addEventListener('pointerdown',this._v407LocationOutsidePointerHandler,true);",
  'M12 2.8c2.25 1.76 4.62 2.75 7.35 3.06v5.25c0 4.72-2.88 8.27-7.35 10.09'
];
for (const needle of required) {
  if (!candidate.includes(needle)) throw new Error(`V4.07 TEST9 contract missing: ${needle}`);
}

const clearMarkup = candidate.match(/<div class="v407-location-query-wrap">[\s\S]*?<\/div>/)?.[0] || '';
if (!clearMarkup.includes('aria-label="${v407ClearQueryLabel()}"')) throw new Error('TEST9 clear button must have localized aria-label');
if (!clearMarkup.includes('title="${v407ClearQueryLabel()}"')) throw new Error('TEST9 clear button must have localized title');
if (!clearMarkup.includes('hidden>×</button>')) throw new Error('TEST9 clear button must start hidden and use the compact × glyph');

const labelLanguages = ['Deutsch','English','Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
for (const language of labelLanguages) {
  if (!candidate.includes(`'${language}':`)) throw new Error(`TEST9 clear-query accessibility label missing language: ${language}`);
}

console.log('V4.07 TEST9 location-query clear control contract: PASS');
console.log(`Localized clear labels: ${labelLanguages.length}`);
console.log('TEST8 firewall icon, TEST7 Release History and outside-click behavior: PRESERVED');

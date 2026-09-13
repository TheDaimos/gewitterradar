import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const bytes = await readFile(resolve(root,'artifacts/v407/gewitterradar.js'));
const candidate = bytes.toString('utf8');
const digest = createHash('sha256').update(bytes).digest('hex');

const required = [
  "const CARD_VERSION = '4.07';",
  "const GEWITTERRADAR_BUILD = 'V4.07-TEST9R2-2026-09-13';",
  'v407-location-query-clear',
  'v407ClearQueryLabel',
  'queryInput.previousElementSibling.textContent = text.query;',
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
  if (!candidate.includes(needle)) throw new Error(`V4.07 TEST9R2 contract missing: ${needle}`);
}

if (candidate.includes('v407-location-query-wrap')) {
  throw new Error('TEST9R2 must not wrap the accepted TEST8 query input DOM');
}
if (candidate.includes("queryInput.closest('.v407-location-search-field')")) {
  throw new Error('TEST9R2 must preserve the accepted TEST8 label lookup');
}

const clearMarkup = candidate.match(/<input id="v407-location-query"[^>]*><button type="button" class="v407-location-query-clear"[^>]*>×<\/button>/)?.[0] || '';
if (!clearMarkup.includes('aria-label="${v407ClearQueryLabel()}"')) throw new Error('TEST9R2 clear button must have localized aria-label');
if (!clearMarkup.includes('title="${v407ClearQueryLabel()}"')) throw new Error('TEST9R2 clear button must have localized title');
if (!clearMarkup.includes('hidden>×</button>')) throw new Error('TEST9R2 clear button must start hidden and use the compact × glyph');

const labelLanguages = ['Deutsch','English','Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
for (const language of labelLanguages) {
  if (!candidate.includes(`'${language}':`)) throw new Error(`TEST9R2 clear-query accessibility label missing language: ${language}`);
}

const expectedDigest = '9d7f23d6307f1f232338446aabee19c88a1ddce1a0be1d534acea2b019fcf3b9';
if (digest !== expectedDigest) throw new Error(`TEST9R2 byte contract changed: expected ${expectedDigest}, got ${digest}`);
if (bytes.length !== 1651359) throw new Error(`TEST9R2 byte length changed: expected 1651359, got ${bytes.length}`);

console.log('V4.07 TEST9R2 isolated query-clear contract: PASS');
console.log(`Bytes: ${bytes.length}`);
console.log(`SHA256: ${digest}`);
console.log(`Localized clear labels: ${labelLanguages.length}`);
console.log('Accepted TEST8 query-field DOM and label lookup: PRESERVED');

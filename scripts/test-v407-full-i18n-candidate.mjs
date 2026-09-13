import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
const candidate = await readFile(resolve(root,'artifacts/v407/gewitterradar.js'),'utf8');

const languages = [
  'Deutsch','English','Dansk','Español','Français','Nederlands','Polski','Português','Svenska',
  'Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'
];
const keys = [
  'people','zones','searchAction','savedPlaces','savedEmpty','title','query','country','search','close',
  'queryPlaceholder','countryPlaceholder','searching','noResults','providerError','invalidCountry','use','save','saveTitle','saving',
  'saved','savedOk','savedDuplicate','saveFailed','savedSetup','savedPlaceFallback','removedPlaces','removeSaved','restoreSaved',
  'savedRestored','removeFailed','restoreFailed','using','used','backendMissing','useFailed','providerNote','safety','allCountries',
  'countryFilters','resultSummary','homeCountry','showMore','unknownCountry'
];

const locationMatch = candidate.match(/const V407_LOCATION_TEXTS = Object\.freeze\((\{.*?\})\);\n      const v407Text/s);
if (!locationMatch) throw new Error('V4.07 translated location-search table not found');
const locationTexts = JSON.parse(locationMatch[1]);
if (JSON.stringify(Object.keys(locationTexts)) !== JSON.stringify(languages)) {
  throw new Error(`Expected ${languages.length} ordered V4.07 search languages, got ${Object.keys(locationTexts).join(', ')}`);
}
for (const language of languages) {
  const bundle = locationTexts[language];
  if (!bundle) throw new Error(`Missing V4.07 search language: ${language}`);
  if (JSON.stringify(Object.keys(bundle)) !== JSON.stringify(keys)) throw new Error(`Search keys differ for ${language}`);
  if (Object.values(bundle).some(value => typeof value !== 'string' || !value.trim())) throw new Error(`Empty V4.07 search translation in ${language}`);
}
if (candidate.includes('v407IsGermanUi')) throw new Error('Old German/English-only V4.07 search fallback still present');

const helpMatch = candidate.match(/const V407_HELP_COPY = Object\.freeze\((\{.*?\})\);\n  const v407PatchExternalHelpLocales/s);
if (!helpMatch) throw new Error('V4.07 translated external Help table not found');
const help = JSON.parse(helpMatch[1]);
const externalLanguages = languages.slice(2);
if (JSON.stringify(Object.keys(help)) !== JSON.stringify(externalLanguages)) throw new Error('External Help translations do not cover all 17 non-native languages');
for (const language of externalLanguages) {
  const copy = help[language];
  if (!copy || typeof copy.lt !== 'string' || typeof copy.et !== 'string') throw new Error(`Missing Help headings for ${language}`);
  if (copy.lp?.length !== 4 || copy.ln?.length !== 3 || copy.ep?.length !== 2 || copy.lab?.length !== 8 || copy.d?.length !== 8 || copy.en?.length !== 5) {
    throw new Error(`V4.07 Help shape differs for ${language}`);
  }
  const all = [copy.lt,copy.et,...copy.lp,...copy.ln,...copy.ep,...copy.lab,...copy.d,...copy.en];
  if (all.some(value => typeof value !== 'string' || !value.trim())) throw new Error(`Empty V4.07 Help translation in ${language}`);
  for (const required of ['geocoding-api.open-meteo.com','nominatim.openstreetmap.org','unpkg.com','blitzortung.ha.sed.pl','Gewitterradar Orte']) {
    if (!JSON.stringify(copy).includes(required)) throw new Error(`${language} Help lost required runtime detail: ${required}`);
  }
}

const representative = {
  Dansk:'Global stedssøgning', Español:'Búsqueda mundial de lugares', Français:'Recherche mondiale de lieux',
  Nederlands:'Wereldwijd plaatsen zoeken', Polski:'Wyszukiwanie miejsc na świecie', Português:'Pesquisa mundial de locais',
  Svenska:'Global platssökning', Italiano:'Ricerca mondiale dei luoghi', 'Norsk bokmål':'Globalt stedsøk',
  Suomi:'Maailmanlaajuinen paikkahaku', Čeština:'Celosvětové vyhledávání míst', Ελληνικά:'Παγκόσμια αναζήτηση τοποθεσίας',
  Magyar:'Világszintű helykeresés', Boarisch:'Weltweite Ortssuach', Plattdüütsch:'Weltwiede Oortsöök',
  'Sächs’sch':'Weldweide Ordssuche', Schwäbisch:'Weltweite Ortssuach'
};
for (const [language,title] of Object.entries(representative)) {
  if (locationTexts[language].title !== title) throw new Error(`Representative translation mismatch: ${language}`);
}

console.log(`V4.07 full i18n contract: PASS (${languages.length} search languages, ${externalLanguages.length} patched Help languages)`);

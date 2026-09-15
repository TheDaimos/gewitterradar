function once(source,from,to,label){
  if(source.split(from).length!==2) throw new Error(`V4.07.38 anchor changed (${label})`);
  return source.replace(from,to);
}

function rewriteFrozenJson(source,constName,mutate){
  const anchor=`const ${constName} = Object.freeze(`;
  const start=source.indexOf(anchor);
  if(start<0) throw new Error(`V4.07.38 frozen JSON anchor missing (${constName})`);
  if(source.indexOf(anchor,start+1)>=0) throw new Error(`V4.07.38 frozen JSON anchor duplicated (${constName})`);
  const jsonStart=start+anchor.length;
  const end=source.indexOf(');',jsonStart);
  if(end<0) throw new Error(`V4.07.38 frozen JSON end missing (${constName})`);
  const value=JSON.parse(source.slice(jsonStart,end));
  mutate(value);
  return source.slice(0,jsonStart)+JSON.stringify(value)+source.slice(end);
}

export const V40738_LOCATION_USE_LABELS=Object.freeze({
  'Deutsch':'Übernehmen','English':'Apply','Dansk':'Anvend','Español':'Aplicar','Français':'Appliquer','Nederlands':'Overnemen','Polski':'Zastosuj','Português':'Aplicar','Svenska':'Tillämpa','Italiano':'Applica','Norsk bokmål':'Angi','Suomi':'Aseta','Čeština':'Nastavit','Ελληνικά':'Εφαρμογή','Magyar':'Alkalmaz','Boarisch':'Nehma','Plattdüütsch':'Övernehmen','Sächs’sch':'Übernähm','Schwäbisch':'Übernemma'
});

export const V40738_COORDINATE_HELP_TITLES=Object.freeze({
  'Deutsch':'Koordinaten übernehmen','English':'Apply coordinates','Dansk':'Anvend koordinater','Español':'Aplicar coordenadas','Français':'Appliquer les coordonnées','Nederlands':'Coördinaten overnemen','Polski':'Zastosuj współrzędne','Português':'Aplicar coordenadas','Svenska':'Tillämpa koordinater','Italiano':'Applicare le coordinate','Norsk bokmål':'Angi koordinater','Suomi':'Aseta koordinaatit','Čeština':'Nastavit souřadnice','Ελληνικά':'Εφαρμογή συντεταγμένων','Magyar':'Koordináták alkalmazása','Boarisch':'Koordinaten nehma','Plattdüütsch':'Koordinaten övernehmen','Sächs’sch':'Koordinaten übernähm','Schwäbisch':'Koordinate übernemma'
});

export const V40738_HELP_ACTIONS=Object.freeze({
  'Dansk':['Anvend sted','“Anvend” overtager stedet, lukker søgningen og flytter kortet.'],
  'Español':['Aplicar ubicación','“Aplicar” establece el lugar, cierra la búsqueda y centra el mapa.'],
  'Français':['Appliquer le lieu','« Appliquer » définit le lieu, ferme la recherche et centre la carte.'],
  'Nederlands':['Locatie overnemen','“Overnemen” neemt de plaats over, sluit de zoekopdracht en centreert de kaart.'],
  'Polski':['Zastosuj lokalizację','“Zastosuj” ustawia miejsce, zamyka wyszukiwanie i centruje mapę.'],
  'Português':['Aplicar local','“Aplicar” define o local, fecha a pesquisa e centra o mapa.'],
  'Svenska':['Tillämpa plats','“Tillämpa” tar över platsen, stänger sökningen och centrerar kartan.'],
  'Italiano':['Applicare il luogo','“Applica” imposta il luogo, chiude la ricerca e centra la mappa.'],
  'Norsk bokmål':['Angi sted','“Angi” setter stedet, lukker søket og sentrerer kartet.'],
  'Suomi':['Aseta sijainti','“Aseta” asettaa paikan, sulkee haun ja keskittää kartan.'],
  'Čeština':['Nastavit polohu','“Nastavit” nastaví místo, zavře hledání a vycentruje mapu.'],
  'Ελληνικά':['Εφαρμογή τοποθεσίας','Η «Εφαρμογή» ορίζει την τοποθεσία, κλείνει την αναζήτηση και κεντράρει τον χάρτη.'],
  'Magyar':['Hely alkalmazása','Az „Alkalmaz” beállítja a helyet, bezárja a keresést és középre viszi a térképet.'],
  'Boarisch':['Ort nehma','„Nehma“ übernimmt an gwählten Ort sofort ois Bezugsstandort, schließt de Ortssuach automatisch und fährt de Karte direkt zum neuen Standort.'],
  'Plattdüütsch':['Oort övernehmen','„Övernehmen“ nimmt den wählten Oort glieks as Bezugsoort över, maakt de Oortsöök to un föhrt de Koort direkt na den niegen Steed.'],
  'Sächs’sch':['Ord übernähm','„Übernähm“ setzt den gewählten Ord sofort als Bezugsord, schließt de Ordssuche und fährt de Karte direkt zum neuen Standord.'],
  'Schwäbisch':['Ort übernemma','„Übernemma“ setzt dr gwählte Ort direkt als Bezugsort, schließt d Ortssuach ond fährt d Karte direkt zum neie Standort.']
});

export function v407Test38LocationWordingTargetDelta(source,coordinateAssetBase64){
  if(!coordinateAssetBase64) throw new Error('V4.07.38 coordinate target base64 missing');
  let result=source;
  result=once(result,
    "  const CARD_DISPLAY_VERSION = '4.07.37';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST37-2026-09-15';",
    "  const CARD_DISPLAY_VERSION = '4.07.38';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST38-2026-09-15';",'version');

  const iconPattern=/  const V407_COORDINATE_TARGET_ICON = 'data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+';/g;
  const iconMatches=result.match(iconPattern)||[];
  if(iconMatches.length!==1) throw new Error(`V4.07.38 embedded target count changed (${iconMatches.length})`);
  result=result.replace(iconPattern,`  const V407_COORDINATE_TARGET_ICON = 'data:image/svg+xml;base64,${coordinateAssetBase64}';`);

  result=rewriteFrozenJson(result,'V407_LOCATION_TEXTS',(texts)=>{
    for(const [language,label] of Object.entries(V40738_LOCATION_USE_LABELS)){
      if(!texts[language]) throw new Error(`V4.07.38 location locale missing (${language})`);
      texts[language].use=label;
    }
  });

  result=rewriteFrozenJson(result,'V407_COORDINATE_TEXTS',(texts)=>{
    for(const [language,title] of Object.entries(V40738_COORDINATE_HELP_TITLES)){
      if(!texts[language]) throw new Error(`V4.07.38 coordinate locale missing (${language})`);
      texts[language].helpTitle=title;
    }
  });

  result=once(result,
    "['Ort verwenden','Nutzen übernimmt den gewählten Ort sofort als Bezugsstandort, schließt die Ortssuche automatisch und fährt die Karte direkt zum neuen Standort.']",
    "['Ort übernehmen','Übernehmen setzt den gewählten Ort sofort als Bezugsstandort, schließt die Ortssuche automatisch und fährt die Karte direkt zum neuen Standort.']",'native-help-de');
  result=once(result,
    '["Use location","Use applies the selected place immediately, closes place search and moves the map directly to the new reference location."]',
    '["Apply location","Apply sets the selected place immediately as the reference location, closes place search and moves the map directly to the new reference location."]','native-help-en');
  return result;
}

function clone(value){ return JSON.parse(JSON.stringify(value)); }
function patchHelpRegistry(registry){
  const patched=clone(registry||{});
  for(const [language,[title,description]] of Object.entries(V40738_HELP_ACTIONS)){
    const locale=patched[language];
    if(!locale||!Array.isArray(locale.sections)) continue;
    const section=locale.sections.find((entry)=>entry?.key==='location');
    if(!section||!Array.isArray(section.entries)||!Array.isArray(section.entries[2])) throw new Error(`V4.07.38 external help location entry missing (${language})`);
    section.entries[2]=[title,description];
  }
  return patched;
}

export function v407Test38SerializeExternalLocales(localeModule){
  const about=clone(localeModule.ABOUT_EXTERNAL_LOCALES||{});
  const help=patchHelpRegistry(localeModule.HELP_EXTERNAL_LOCALES||{});
  const help31=patchHelpRegistry(localeModule.HELP_EXTERNAL_LOCALES_V40731||{});
  return [
    '// V4.07.38 deterministic external locale registry. ABOUT content unchanged; location-help action wording aligned with Apply/Übernehmen.',
    `export const ABOUT_EXTERNAL_LOCALES = ${JSON.stringify(about,null,2)};`,
    `export const HELP_EXTERNAL_LOCALES = ${JSON.stringify(help,null,2)};`,
    `export const HELP_EXTERNAL_LOCALES_V40731 = ${JSON.stringify(help31,null,2)};`,
    ''
  ].join('\n');
}

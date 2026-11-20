const icons = {
 eye: new URL('../../assets/gr-eye-open-master-1254.png', import.meta.url).href,
 wind: new URL('../../assets/gr-wind-animation-toggle-premium-v1-272.webp', import.meta.url).href,
 information: new URL('../../assets/weather-router-emblem-v004-256.png', import.meta.url).href,
 precipitation: new URL('../../assets/gr-precipitation-premium-original.png', import.meta.url).href,
 temperature: new URL('../../assets/gr-temperature-premium-original.png', import.meta.url).href,
 clouds: new URL('../../assets/gr-clouds-eye-premium-original.png', import.meta.url).href,
 cloudsHelp: new URL('../../assets/gr-clouds-help-premium-original.png', import.meta.url).href,
 synoptic: new URL('../../assets/gr-synoptic-high-low-isobars-premium-original.png', import.meta.url).href,
 display: new URL('../../assets/gr-weather-display-premium-original.png', import.meta.url).href,
 pro: new URL('../../assets/gewitterradar-pro-wordmark-v1.png', import.meta.url).href
};
const standardLogo=new URL('../../assets/gewitterradar-brand-icon.png',import.meta.url).href;

const de = {
 eye:['Eye Hub & Wetter-Icons',
  [['eye','Tippen Sie auf das Eye-Icon, um die gruppierten Funktionsicons einzublenden.'],
   'Halten Sie das Eye-Icon länger gedrückt (Long-Press), um die Einstellungen für Position, Icon-Gruppierung, Aura-Ringe, Farben und Slot-Belegung zu öffnen. Diese Bedienung gehört zu GewitterRadar Standard.',
   ['precipitation','Halten Sie ein Funktionsicon wie das Niederschlags-Icon länger gedrückt, um seine Einstellungen zu öffnen. Mit verbundenem WeatherRouter schalten Sie die Wetterebenen über ihre zugewiesenen Funktionsicons ein und aus.'],
   ['display','Über das Darstellungs-Icon stellen Sie die Deckkraft einzelner Wetterebenen ein. In Eye Control können Sie die Darstellung anpassen und zusätzliche Slots hinzufügen und belegen.'],
   'Die Icon-Gruppierung hält die Karte übersichtlich. Bei deaktivierter Gruppierung erscheinen die zugewiesenen Funktionsicons einzeln. Ein Tipp auf das Eye-Icon öffnet dann die Eye-Einstellungen.',
   'Tippen Sie auf einen freien Slot oder ziehen Sie ein verfügbares Funktionsicon hinein. Die Benutzeroberfläche unterstützt bis zu acht Slots.',
   'Ein farbiger Statusring kennzeichnet eine aktive verfügbare Funktion. In den Glow-Einstellungen wählen Sie animierte Aura-Ringe, feststehende Statusringe oder deaktivieren die visuellen Effekte.']],
 wind:['Winddarstellung',
  ['Tippen Sie auf das Wind-Icon, um die Winddarstellung ein- oder auszuschalten. Halten Sie es länger gedrückt (Long-Press), um Darstellungsmodi, Farben, Animationen und Legende einzustellen.',
   'Windfahnen zeigen Windrichtung und Windstärke. Pfeile und animierte Strömungen zeigen die Richtung und Bewegung der Luftmassen. Die Wind-Farbflächen ordnen den Windgeschwindigkeiten Farben zu.',
   'Die schlangenförmige Strömungsanimation basiert auf meteorologischen Windvektoren. Die Länge der Strömungselemente kann sich mit der Windgeschwindigkeit ändern. Kürzere Elemente stehen für geringere, längere für höhere Geschwindigkeiten.',
   'Die Legende zeigt Maßeinheit, Datenquelle und Modellzeit. Modellwerte können von den vor Ort gemessenen Windverhältnissen abweichen.']],
 information:['Wetterinformationen',[
  ['Datenquelle und Status',[
   'Öffnen Sie die WetterRouter-Ebenen im Kartenmenü. Die Informationen zur Ebene zeigen Datenquelle, Daten- oder Modellzeit, Gültigkeit und Datenstatus, soweit geliefert.',
   'Beobachtungszeit, Modelllauf und Gültigkeitszeit haben unterschiedliche Bedeutungen. „Nicht verfügbar“ kann eine fehlende Quelle, Abdeckung oder gültige Ausgabe bedeuten. Eine leere Anzeige allein sagt nichts über das Wetter aus.']],
  ['Aktualisierung nach Kartenbewegung',[
   'Das Aktualisierungsintervall bestimmt, wie schnell GewitterRadar nach einer Kartenbewegung neue Wetterinformationen über WeatherRouter anfordern darf.'],[
   ['Aktualisierungsintervall','Einstellbar von 2 bis 60 Sekunden. Standard sind 15 Sekunden.'],
   ['Kleine Werte','2–5 Sekunden reagieren besonders schnell auf Kartenbewegungen, erzeugen aber mehr WeatherRouter-Anfragen.'],
   ['Standard','15 Sekunden ist der ausgewogene Standardwert für Reaktionszeit und Anfragelast.'],
   ['Große Werte','30–60 Sekunden reduzieren die Anzahl der Anfragen und sind besonders schonend.'],
   ['Bewegungsfilter und manuelle Aktualisierung','Der kurze Bewegungsfilter nach dem Verschieben der Karte bleibt unabhängig davon aktiv. Eine ausdrücklich manuell ausgelöste Aktualisierung wird nicht durch dieses Intervall ausgebremst.']]]]],
 precipitation:['Niederschlag',
  ['Tippen Sie auf das Niederschlags-Icon, um die Radar-Darstellung ein- oder auszuschalten. Halten Sie es länger gedrückt (Long-Press), um Darstellung, Farbskala und Deckkraft einzustellen. Bei 0 % Deckkraft ist die Ebene vollständig transparent, bei 100 % vollständig deckend.',
   'Die Farbskala ordnet den Niederschlagsintensitäten Farben zu. „Präzise“ grenzt Intensitätsbereiche deutlicher ab. „Ausgewogen“ zeigt weichere Farbübergänge.',
   'WeatherRouter kann Niederschlagsdaten des Deutschen Wetterdienstes (DWD) für Deutschland und des europäischen OPERA-Radarnetzwerks parallel vorbereiten. Verfügbare und aktivierte NASA-Daten können die Darstellung außerhalb der Radarbereiche ergänzen.',
   'WeatherRouter prüft Gültigkeit und geografische Abdeckung und wählt die Datenquelle. Beim progressiven Laden können Kartenbereiche nacheinander erscheinen und vorhandene Daten durch neuere oder geeignetere Daten ergänzt oder ersetzt werden. Quelle und Status zeigen die aktuell sichtbaren Daten.']],
 temperature:['Temperatur',
  ['Tippen Sie auf das Temperatur-Icon, um die Temperaturdarstellung mit den gewählten Ansichten ein- oder auszuschalten. Halten Sie das Icon länger gedrückt (Long-Press), um Farbfläche, Temperaturwerte, Maßeinheit und thermische Advektion einzustellen.',
   'Die Temperatur-Farbfläche unterscheidet Temperaturbereiche anhand ihrer Farben. Mit „Temperaturwerte“ können Sie die berechneten Temperaturen zusätzlich als Zahlen auf der Karte einblenden.',
   'Die thermische Advektion zeigt, wie der Wind wärmere oder kältere Luft horizontal transportiert. So lassen sich großräumige Temperaturverlagerungen und Veränderungen der Luftmassen erkennen.']],
 clouds:['Wolken',
  ['Das goldgerahmte Wolkenicon schaltet den WeatherRouter-Satellitenlayer. Halten Sie es gedrückt, um zwischen „Original“ und „Ausgewogen“ zu wählen oder die Deckkraft einzustellen.',
   'Die Ebene zeigt Wolken im verfügbaren Satellitenprodukt. Nutzen Sie Quellenzeit und Abdeckung. Die Wolkenebene ist separat von Wind und Niederschlag schaltbar.']],
 synoptic:['Hoch-/Tiefdruck, Isobaren & Fronten',
  ['Schalten Sie die Synoptik per Tipp ein. Gedrückthalten öffnet Einstellungen für H/T, Isobaren und verfügbare Fronten. H und T markieren Druckzentren. Isobaren verbinden Orte gleichen Luftdrucks in hPa.',
   'ECCC liefert die Druckzentren, NOAA/GFS die Isobaren und NOAA/WPC typisierte Fronten. Dreiecke und Halbkreise setzen eine belegte Symbolseite voraus. Liefert der Anbieter diese Seite nicht, zeigen Rauten und Punkte den Frontentyp ohne Zugrichtung. Abdeckung und Gültigkeit hängen vom Produkt ab.']],
 display:['Ebenen & Deckkraft',
  ['Öffnen Sie „Darstellung“ im Eye oder im Kartenmenü. Wählen Sie die WeatherRouter-Ebene und regeln Sie deren Deckkraft. Je nach Ebene stehen Darstellungsstile, Legenden und Details im eigenen Long-Press-Menü bereit.']],
 pro:['Featurelist',
  ['GewitterRadar PRO verbindet GewitterRadar mit einer betriebsbereiten WeatherRouter-Integration im selben Home Assistant.',
   'Installieren und konfigurieren Sie WeatherRouter anhand der Projektanleitung und aktivieren Sie die lokale Consumer-Schnittstelle. Sobald der Dienst betriebsbereit erkannt wird, erscheint das PRO-Branding automatisch.'],
  ['Niederschlag und Radar · DWD für Deutschland, OPERA für Europa und NASA ergänzend, soweit Quelle, Aktualität und Abdeckung passen. Freigegebene Quellen können parallel vorbereitet und progressiv angezeigt werden.',
   'Wind · Windfahnen, Richtungspfeile, Geschwindigkeitsflächen und animierte Schlangenströmung.',
   'Temperatur und Wolken · Modellwerte, Farbflächen, Advektion und ein eigener Satellitenwolken-Layer.',
   'Synoptik · Druckzentren, Isobaren und verfügbare typisierte Wetterfronten mit meteorologischen Symbolen.',
   'Wetterinformationen · Globale Daten je nach Produkt, Region und Modell. Die Legende zeigt Quelle, Aktualität und Verfügbarkeit.',
   'Bedienung und Profile · Eye-Shortcuts, individuelle Deckkraft, gespeicherte Einstellungen, Profile und Sicherungen.']]
};

const en = {
 eye:['Eye Hub & weather icons',[
  ['eye','Tap the Eye icon to reveal the grouped shortcuts. Hold it to configure position, grouping, aura rings, colours and slots. These controls are part of GewitterRadar Standard.'],
  ['precipitation','Hold a weather icon such as Precipitation to open its settings. With WeatherRouter connected, tap an assigned weather icon to toggle its layer.'],
  ['display','Use the Display icon to adjust the opacity of individual weather layers.'],
  'Grouping keeps the map clear. Turn it off to show assigned icons individually and open the Eye settings with a tap.',
  'Add slots in the Eye settings. Tap a free slot to assign it or drag an available icon into it. The interface supports up to eight slots. A coloured ring indicates an active available function. Use the glow settings for animated auras, fixed status rings or no effects.']],
 wind:['Wind display',[
  'Tap the wind icon to toggle wind. Hold it to configure display modes, colours, animations and the legend.',
  'Barbs show wind direction and speed. Arrows and animated streamlines show how air moves. The wind shading assigns colours to speed ranges.',
  'The animated snake flow uses meteorological wind vectors. Its elements can grow longer with higher wind speeds.',
  'The legend shows units, data source and model time. Model values can differ from local measurements.']],
 information:['Weather information',[
  ['Data source and status',[
   'Use the WeatherRouter layer menu to find the source, observation or model time, validity and availability. An unavailable layer can mean missing coverage or a source without a valid product.']],
  ['Updates after moving the map',[
   'The update interval controls how quickly GewitterRadar may request new weather information through WeatherRouter after the map is moved.'],[
   ['Update interval','Adjustable from 2 to 60 seconds. The default is 15 seconds.'],
   ['Low values','2–5 seconds responds quickly to map movement but increases WeatherRouter requests.'],
   ['Default','15 seconds balances responsiveness and request load.'],
   ['High values','30–60 seconds reduces the number of requests.'],
   ['Movement filter and manual refresh','The short movement debounce remains active independently. An explicitly triggered manual refresh is not delayed by this interval.']]]]],
 precipitation:['Precipitation',[
  'Tap the precipitation icon to toggle radar. Hold it to configure display, colour scale and opacity. At 0% the layer is fully transparent. At 100% it is fully opaque.',
  'Colours correspond to precipitation intensities. Precise mode separates the intensity bands, while Balanced mode uses softer transitions.',
  'WeatherRouter can prepare German Weather Service (DWD) and European OPERA radar data in parallel. Enabled NASA data can supplement uncovered areas when available.',
  'WeatherRouter checks coverage and validity and selects the source. As data loads, areas can appear in stages and newer or more suitable data can replace what is on screen. Check the source and status for the data currently shown.']],
 temperature:['Temperature',[
  'Tap the temperature icon to turn the selected views on or off. Hold it to configure shading, temperature values, units and thermal advection.',
  'Shading uses colours for different temperature ranges. Enable temperature values to add the modelled numbers to the map.',
  'Thermal advection shows the horizontal transport of warmer or colder air by wind. It helps identify large-scale temperature shifts and changes in air masses.']],
 clouds:['Clouds',['Tap the gold-rimmed icon to toggle WeatherRouter satellite clouds. Hold to choose Original or Balanced and set opacity. Check the satellite product’s source time and coverage.']],
 synoptic:['Highs, lows, isobars & fronts',['Tap to toggle synoptic overlays. Hold to configure H/L markers, equal-pressure lines in hPa and available fronts. ECCC supplies pressure centres, NOAA/GFS supplies isobars and NOAA/WPC supplies typed fronts. Triangles and semicircles require a confirmed symbol side. Otherwise diamonds and dots show the front type without indicating movement. Coverage and validity vary by product.']],
 display:['Layers & opacity',['Open Display in the Eye or map menu. Choose a WeatherRouter layer to adjust its opacity. Hold the individual weather icon for product-specific modes and legends.']],
 pro:['Featurelist',['Install and configure WeatherRouter in the same Home Assistant and enable its local consumer interface. The PRO artwork appears when the connection reports a ready runtime.'],
  ['Radar · DWD for Germany, OPERA for European coverage and optional NASA products. Sources can load in parallel and appear progressively where available.',
   'Wind · Barbs, direction arrows, speed shading and animated snake flow.',
   'Temperature and clouds · Shading, values, advection and a separate satellite cloud layer.',
   'Synoptic weather · Pressure centres, isobars and available typed front symbols.',
   'Coverage and data status · Global information depends on the product, region and model. Consult the source time and availability.',
   'Eye controls, saved settings, profiles and backups.']]
};

const weatherRouterLink='https://github.com/TheDaimos/weather-router-dev';
const grLink='https://github.com/TheDaimos/gewitterradar';
const proBadge=new URL('../../assets/gr-help-pro-badge.svg',import.meta.url).href;

function make(tag,text,className){
 const node=document.createElement(tag);
 if(text)node.textContent=text;
 if(className)node.className=className;
 return node;
}

function helpParagraph(content){
 if(typeof content==='string')return make('p',content);
 const [icon,text]=content;
 const paragraph=make('p',null,'help-icon-paragraph');
 const image=make('img');
 image.src=icons[icon];
 image.alt='';
 image.width=image.height=42;
 image.draggable=false;
 paragraph.append(image,document.createTextNode(text));
 return paragraph;
}

export function appendHelpProLabel(target,label,size='standard'){
 const end=label.lastIndexOf(' ')+1;
 target.append(document.createTextNode(label.slice(0,end)));
 const tail=make('span',label.slice(end),'help-pro-label');
 const badge=make('img',null,`help-pro-badge help-pro-badge-${size}`);
 badge.src=proBadge;
 badge.alt='PRO';
 badge.width=96;
 badge.height=42;
 badge.draggable=false;
 tail.append(badge);
 target.append(tail);
}

export function createHelpSections(content,language,weatherHelp,{collapsed={},onToggle=()=>{}}={}){
 const german=language==='Deutsch';
 const standard=make('section',null,'help-standard');
 const standardHeader=make('header',null,'help-standard-header');
 const standardHeading=make('h3',null,'help-standard-heading');
 standardHeading.id='gr-help-standard-heading';
 const standardImage=make('img');standardImage.src=standardLogo;standardImage.alt='';standardImage.width=48;standardImage.height=48;standardImage.draggable=false;
 standardHeading.append(standardImage,document.createTextNode('GewitterRadar Standard'));
 standard.setAttribute('aria-labelledby',standardHeading.id);
 standardHeader.append(standardHeading);

 const pro=make('section',null,'help-pro');
 const header=make('header',null,'help-pro-header');
 const proHeading=make('h3');
 proHeading.id='gr-help-pro-heading';
 const logo=make('img');
 logo.src=icons.pro;
 logo.alt='GewitterRadar PRO – powered by WeatherRouter';
 logo.width=1190;
 logo.height=348;
 logo.draggable=false;
 proHeading.append(logo);
 const status=make('p',null,'help-pro-status');
 status.setAttribute('role','status');
 header.append(proHeading,status);
 pro.setAttribute('aria-labelledby',proHeading.id);
 pro.append(header);
 const group=(section,head,name,label)=>{
  const body=make('div',null,'help-group-topics');body.id='gr-help-'+name+'-topics';
  const button=make('button',null,'help-group-toggle');button.type='button';button.setAttribute('aria-label',label);
  button.setAttribute('aria-controls',body.id);
  const chevron=make('span',null,'help-chevron');chevron.setAttribute('aria-hidden','true');button.append(chevron);
  const update=isCollapsed=>{button.setAttribute('aria-expanded',String(!isCollapsed));body.hidden=isCollapsed;section.dataset.collapsed=String(isCollapsed);};
  update(Boolean(collapsed[name]));
  button.addEventListener('click',()=>{const next=!body.hidden;update(next);onToggle(name,next);});
  head.append(button);section.append(body);
  return body;
 };
 const standardTopics=group(standard,standardHeader,'standard','GewitterRadar Standard');
 const proTopics=group(pro,header,'pro','GewitterRadar PRO');
 standard.prepend(standardHeader);
 content.append(standard,pro);
 return {standard,pro,standardTopics,proTopics,setConnected(connected){
  if(status.dataset.connected===String(connected))return;
  status.dataset.connected=String(connected);
  status.textContent=connected
   ? (weatherHelp?.labels.connected ?? (german?'WeatherRouter verbunden':'WeatherRouter connected'))
   : (weatherHelp?.labels.disconnected ?? (german?'Optionale Erweiterung · WeatherRouter derzeit nicht verbunden':'Optional extension · WeatherRouter currently disconnected'));
 }};
}

export function createHelpProMapNote(language,weatherHelp){
 const german=language==='Deutsch';
 if(weatherHelp){
  const [before,after]=weatherHelp.labels.mapNote.split('{router}');
  const note=make('p',before);
  appendHelpProLabel(note,'WeatherRouter','compact');
  note.append(document.createTextNode(after));
  return note;
 }
 const note=make('p',german?'Mit verbundenem ':'With a connection to ');
 appendHelpProLabel(note,'WeatherRouter','compact');
 note.append(document.createTextNode(german
  ? ' stehen zusätzliche Wetterebenen für Wind, Temperatur, Niederschlag, Wolken und Synoptik zur Verfügung. Die Abdeckung und Aktualität hängen von der jeweiligen Datenquelle ab.'
  : ', additional weather layers can show wind, temperature, precipitation, clouds and synoptic data. Coverage and currency depend on the data source.'));
 return note;
}

export function appendWeatherHelp(content,language,openKeys,{upgrade=false,weatherHelp}={}){
 const german=language==='Deutsch',copy=weatherHelp?.topics??(german?de:en);
 const labels=weatherHelp?.labels;
 const keys=upgrade?['pro']:Object.keys(copy).filter(key=>key!=='pro');
 for(const key of keys){
  const [label,paragraphs,features]=copy[key];
  const details=make('details',null,'help-section help-weather-topic');
  details.dataset.helpSection=key==='eye'?'eye-controls':'wr-'+key;
  details.open=openKeys.has(details.dataset.helpSection);
  const summary=make('summary'),icon=make('span',null,'help-section-icon'),title=make('span');
  const image=make('img');
  image.src=icons[key];image.alt='';image.draggable=false;
  if(upgrade){
   details.classList.add('help-pro-featurelist');
   icon.classList.add('help-pro-brand');
   image.alt='GewitterRadar PRO';
   title.textContent='– '+label;
  }else if(key==='eye')title.textContent=label;
  else appendHelpProLabel(title,'WeatherRouter · '+label);
  icon.append(image);
  const chevron=make('span',null,'help-chevron');chevron.setAttribute('aria-hidden','true');
  summary.append(icon,title,chevron);
  const body=make('div',null,'help-section-body');
  if(upgrade){
   body.append(make('h3',labels?.what??(german?'Was ist WeatherRouter?':'What is WeatherRouter?')));
   body.append(make('p',labels?.description??(german?'Ein zusätzlicher lokaler Datendienst in Home Assistant, der Wetterprodukte mehrerer Anbieter für GewitterRadar bereitstellt.':'An additional local data service in Home Assistant that provides weather products from multiple sources.')));
   body.append(make('h3',labels?.how??(german?'Wie bekomme ich GewitterRadar PRO?':'How do I get GewitterRadar PRO?')));
  }
  if(key==='clouds'){
   const graphic=make('img',null,'help-layer-graphic');
   graphic.src=icons.cloudsHelp;graphic.alt='';graphic.draggable=false;
   body.append(graphic);
  }
  if(key==='information'){
   for(const [heading,sectionParagraphs,entries] of paragraphs){
    body.append(make('h4',heading));
    for(const paragraph of sectionParagraphs)body.append(make('p',paragraph));
    if(!entries)continue;
    const list=make('dl',null,'help-entries');
    for(const [term,description] of entries)list.append(make('dt',term),make('dd',description));
    body.append(list);
   }
  }else{
   for(const text of paragraphs)body.append(helpParagraph(text));
  }
  if(upgrade){
   const links=make('p');
   for(const [url,text] of [[weatherRouterLink,'WeatherRouter'],[grLink,'GewitterRadar']]){
    const a=make('a',text,'help-maptiler-link');a.href=url;a.target='_blank';a.rel='noopener noreferrer';
    links.append(a,document.createTextNode('  '));
   }
   body.append(links,make('h3',labels?.features??(german?'Funktionen im Überblick':'Available features')));
   const ul=make('ul');for(const text of features)ul.append(make('li',text));body.append(ul);
   body.append(make('p',labels?.standard??(german?'Eye-Bedienung, Profile und Sicherungen sind bereits in GewitterRadar Standard verfügbar.':'Eye controls, profiles and backups are already available in GewitterRadar Standard.')));
  }
  if(key==='eye'&&!upgrade){
   const back=make('button',labels?.back??(german?'Zur Übersicht':'Back to topics'),'eye-metal-button help-topic-back');
   back.type='button';back.addEventListener('click',()=>{details.open=false;summary.focus();});
   body.append(back);
  }
  details.append(summary,body);content.append(details);
 }
}

const icons = {
 eye: new URL('../../assets/gr-eye-open-master-1254.png', import.meta.url).href,
 wind: new URL('../../assets/gr-wind-settings-original-master.png', import.meta.url).href,
 information: new URL('../../assets/weather-router-emblem-v004-256.png', import.meta.url).href,
 precipitation: new URL('../../assets/gr-precipitation-premium-original.png', import.meta.url).href,
 temperature: new URL('../../assets/gr-temperature-premium-original.png', import.meta.url).href,
 clouds: new URL('../../assets/gr-clouds-eye-premium-original.png', import.meta.url).href,
 cloudsHelp: new URL('../../assets/gr-clouds-help-premium-original.png', import.meta.url).href,
 synoptic: new URL('../../assets/gr-synoptic-high-low-isobars-premium-original.png', import.meta.url).href,
 display: new URL('../../assets/gr-weather-display-premium-original.png', import.meta.url).href,
 pro: new URL('../../assets/gewitterradar-pro-wordmark-v1.png', import.meta.url).href
};

const de = {
 eye:['Eye-Menü & Icon-Bedienung',
  ['Tippen Sie auf das Eye, um gruppierte Funktionsicons zu öffnen. Position, Icon-Gruppierung und Slot-Zuordnung gehören zu GewitterRadar Standard. Verbundene WeatherRouter-Ebenen lassen sich über ihre zugewiesenen Wetter-Icons schalten. „Darstellung“ öffnet die Ebenenregler.',
   'Halten Sie das Eye gedrückt, um die Eye-Einstellungen zu öffnen. Halten Sie ein Funktionsicon gedrückt, um dessen Einstellungen zu öffnen. Ziehen Sie das Eye oder einzelne Kartenicons an die gewünschte Position.',
   'Icon-Gruppierung verbessert die Usability: Sie bündelt die Funktionen am Eye und hält die Karte übersichtlich. Schalten Sie die Gruppierung aus, um die zugewiesenen Icons einzeln zu sehen. Ein Tipp auf das Eye öffnet dann die Einstellungen.',
   'Wählen Sie eine Funktion für einen leeren Slot oder ziehen Sie ein Icon hinein. Es stehen bis zu acht bedienbare Slots zur Verfügung. Die Datenstruktur kann zwölf speichern. Aura-Farbe und „Keine Farbe“ ändern das Erscheinungsbild. Ein aktiver farbiger Ring kennzeichnet eine aktive verfügbare Funktion. Sichtbarkeit und Deckkraft stellen Sie bei der jeweiligen Ebene ein.']],
 wind:['Winddarstellung',
  ['Tippen schaltet die Winddarstellung. Gedrückthalten öffnet Modi, Farben und Legende. Windfahnen zeigen Herkunft und Stärke. Pfeile und animierte Strömung zeigen den Verlauf der Bewegung.',
   'Die Wind-Farbfläche ordnet der Geschwindigkeit Farben zu. Die Schlangenströmung verwendet numerische Windvektoren. Nutzen Sie die Legende für Einheit, Quelle und Modellzeit. Modellwerte beziehen sich auf den angegebenen Lauf und können lokal vom beobachteten Wind abweichen.']],
 information:['Wetterinformationen',
  ['Öffnen Sie die WetterRouter-Ebenen im Kartenmenü. Die Informationen zur Ebene zeigen Datenquelle, Daten- oder Modellzeit, Gültigkeit und Datenstatus, soweit geliefert.',
   'Beobachtungszeit, Modelllauf und Gültigkeitszeit haben unterschiedliche Bedeutungen. „Nicht verfügbar“ kann eine fehlende Quelle, Abdeckung oder gültige Ausgabe bedeuten. Eine leere Anzeige allein sagt nichts über das Wetter aus.']],
 precipitation:['Niederschlag',
  ['Tippen Sie auf das Niederschlagsicon, um den Radar-Layer zu schalten. Gedrückthalten öffnet Darstellung und Deckkraft. Die Farbskala zeigt Intensitätsbereiche. Prüfen Sie Einheit und Zeit in der Legende.',
   'WeatherRouter kann DWD für Deutschland und OPERA für die europäische Abdeckung parallel vorbereiten. Ergänzende NASA-Daten können außerhalb der Radarbereiche verfügbar sein. Die tatsächliche Quellenwahl und Abdeckung meldet WeatherRouter. Beim progressiven Laden können Teilbereiche nacheinander erscheinen. Quelle und Status zeigen, welche Daten gerade sichtbar sind.']],
 temperature:['Temperatur',
  ['Tippen schaltet die Temperaturdarstellung. Im Long-Press-Menü wählen Sie Farbfläche, Werte oder Advektion. Die Farbfläche zeigt Temperatur, Zahlen geben die modellierte Temperatur in der gewählten Einheit an.',
   'Advektion visualisiert die Verlagerung warmer oder kalter Luft. Beachten Sie Modellzeit, Auflösung und die in der Legende angegebene Gültigkeit.']],
 clouds:['Wolken',
  ['Das goldgerahmte Wolkenicon schaltet den WeatherRouter-Satellitenlayer. Halten Sie es gedrückt, um zwischen „Original“ und „Ausgewogen“ zu wählen oder die Deckkraft einzustellen.',
   'Die Ebene zeigt Wolken im verfügbaren Satellitenprodukt. Nutzen Sie Quellenzeit und Abdeckung. Die Wolkenebene ist separat von Wind und Niederschlag schaltbar.']],
 synoptic:['Hoch-/Tiefdruck, Isobaren & Fronten',
  ['Schalten Sie die Synoptik per Tipp ein. Gedrückthalten öffnet Einstellungen für H/T, Isobaren und verfügbare Fronten. H und T markieren Druckzentren. Isobaren verbinden Orte gleichen Luftdrucks in hPa.',
   'ECCC liefert die verwendeten Druckzentren, NOAA/GFS die Isobaren und NOAA/WPC typisierte Fronten. Dreiecke kennzeichnen Kaltfronten, Halbkreise Warmfronten. Bei kombinierten Fronten unterscheiden Farbe und Symbolfolge den Typ. WPC-Abdeckung und Gültigkeit sind produktabhängig.']],
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
 eye:['Eye menu & icon controls',[
  'Tap the Eye to open the grouped functions. Positioning, icon grouping and slot assignments are part of GewitterRadar Standard. With WeatherRouter connected, tap an assigned weather icon to toggle its layer. Display opens layer controls.',
  'Hold the Eye to open its settings. Hold a weather icon to open its own settings. Drag the Eye or a standalone icon to position it.',
  'Icon grouping improves Usability by keeping the map clear. Turn grouping off to show assigned icons individually. A tap on the Eye then opens its settings.',
  'Assign a function to an empty slot or drag an icon into it. Up to eight slots are available in the UI. The saved format supports twelve. Choose an aura colour or No colour for each function.']],
 wind:['Wind display',['Tap to toggle wind. Hold for wind barbs, direction arrows, speed colours and animated snake flow. Barbs describe where the wind comes from. Streamlines show the airflow. Read the units, source and model time in the legend.']],
 information:['Weather information',['Use the WeatherRouter layer menu to find the source, observation or model time, validity and availability. An unavailable layer can mean missing coverage or a source without a valid product.']],
 precipitation:['Precipitation',['Tap to toggle radar, then read the colour scale and data time in the legend. Hold for appearance and opacity. WeatherRouter can prepare DWD for Germany and OPERA for European coverage in parallel. NASA is supplementary where available. Progressive loading can show supported areas in stages.']],
 temperature:['Temperature',['Tap to toggle. Hold to select temperature shading, numbers or advection. The colours and numbers show temperatures in the selected unit. Advection depicts transport of warmer or colder air. Check the model time.']],
 clouds:['Clouds',['Tap the gold-rimmed icon to toggle WeatherRouter satellite clouds. Hold to choose Original or Balanced and set opacity. Check the satellite product’s source time and coverage.']],
 synoptic:['Highs, lows, isobars & fronts',['Tap to toggle synoptic overlays. Hold to configure H/L markers, equal-pressure lines in hPa and available fronts. ECCC supplies pressure centres, NOAA/GFS supplies isobars and NOAA/WPC supplies typed fronts. Triangles indicate cold fronts and semicircles warm fronts. Coverage and validity vary by product.']],
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

export function createHelpSections(content,language){
 const german=language==='Deutsch';
 const standard=make('section',null,'help-standard');
 const standardHeading=make('h3','GewitterRadar Standard','help-standard-heading');
 standardHeading.id='gr-help-standard-heading';
 standard.setAttribute('aria-labelledby',standardHeading.id);
 standard.append(standardHeading);

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
 content.append(standard,pro);
 return {standard,pro,setConnected(connected){
  if(status.dataset.connected===String(connected))return;
  status.dataset.connected=String(connected);
  status.textContent=connected
   ? (german?'WeatherRouter verbunden':'WeatherRouter connected')
   : (german?'Optionale Erweiterung · WeatherRouter derzeit nicht verbunden':'Optional extension · WeatherRouter currently disconnected');
 }};
}

export function createHelpProMapNote(language){
 const german=language==='Deutsch';
 const note=make('p',german?'Mit verbundenem ':'With a connection to ');
 appendHelpProLabel(note,'WeatherRouter','compact');
 note.append(document.createTextNode(german
  ? ' stehen zusätzliche Wetterebenen für Wind, Temperatur, Niederschlag, Wolken und Synoptik zur Verfügung. Die Abdeckung und Aktualität hängen von der jeweiligen Datenquelle ab.'
  : ', additional weather layers can show wind, temperature, precipitation, clouds and synoptic data. Coverage and currency depend on the data source.'));
 return note;
}

export function appendWeatherHelp(content,language,openKeys,{upgrade=false}={}){
 const german=language==='Deutsch',copy=german?de:en;
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
   body.append(make('h3',german?'Was ist WeatherRouter?':'What is WeatherRouter?'));
   body.append(make('p',german?'Ein zusätzlicher lokaler Datendienst in Home Assistant, der Wetterprodukte mehrerer Anbieter für GewitterRadar bereitstellt.':'An additional local data service in Home Assistant that provides weather products from multiple sources.'));
   body.append(make('h3',german?'Wie bekomme ich GewitterRadar PRO?':'How do I get GewitterRadar PRO?'));
  }
  if(key==='clouds'){
   const graphic=make('img',null,'help-layer-graphic');
   graphic.src=icons.cloudsHelp;graphic.alt='';graphic.draggable=false;
   body.append(graphic);
  }
  for(const text of paragraphs)body.append(make('p',text));
  if(upgrade){
   const links=make('p');
   for(const [url,text] of [[weatherRouterLink,'WeatherRouter'],[grLink,'GewitterRadar']]){
    const a=make('a',text,'help-maptiler-link');a.href=url;a.target='_blank';a.rel='noopener noreferrer';
    links.append(a,document.createTextNode('  '));
   }
   body.append(links,make('h3',german?'Funktionen im Überblick':'Available features'));
   const ul=make('ul');for(const text of features)ul.append(make('li',text));body.append(ul);
   body.append(make('p',german?'Eye-Bedienung, Profile und Sicherungen sind bereits in GewitterRadar Standard verfügbar.':'Eye controls, profiles and backups are already available in GewitterRadar Standard.'));
  }
  const back=make('button',german?'Zur Übersicht':'Back to topics','eye-metal-button help-topic-back');
  back.type='button';back.addEventListener('click',()=>{details.open=false;summary.focus();});
  body.append(back);details.append(summary,body);content.append(details);
 }
}

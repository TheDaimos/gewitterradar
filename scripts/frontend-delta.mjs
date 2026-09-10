import {languageOnboardingDelta} from './language-onboarding-delta.mjs';
import {aboutLocalesDelta} from './about-locales-delta.mjs';
import {v406FinalDelta} from './v4-06-final-delta.mjs';
// Explicit, reviewable exceptions to the frozen public V4.05 frontend.
export function approvedDelta(baseline) {
  const once=(text,from,to)=>{if(text.split(from).length!==2)throw Error('Baseline anchor changed: '+from.slice(0,80));return text.replace(from,to);};
  let result=once(baseline,"  const ABOUT_DEDICATION = 'Danke, dass du mir die Zeit lässt, meinen Interessen und meiner Begeisterung für Technik, Wetter und all den Ideen dazwischen nachzugehen – und mich Projekten wie Gewitterradar mit so viel Freude und Ausdauer zu widmen.';", "  const ABOUT_CLOSE_IMAGE = new URL('./assets/gewitterradar-about-close-premium.webp', import.meta.url).href;\n  const ABOUT_COPY_IMAGE = new URL('./assets/gewitterradar-about-copy-scroll.webp', import.meta.url).href;");
  result=once(result,"      entities:'Verwendete Entitäten & Funktionen', entitiesSubtitle:'Eine Übersicht aller verwendeten Entitäten und ihrer Funktionen.', native:'Native Gewitterradar-Konfiguration', legacy:'Legacy-Fallback / Kompatibilität',", "      entities:'Verwendete Entitäten & Funktionen', entitiesSubtitle:'Eine Übersicht aller verwendeten Entitäten und ihrer Funktionen.', native:'Native Gewitterradar-Konfiguration', sourceNative:'Native', legacy:'Legacy-Fallback / Kompatibilität',");
  result=once(result,"      entities:'Entities & functions used', entitiesSubtitle:'An overview of the entities used and their functions.', native:'Native Gewitterradar configuration', legacy:'Legacy fallback / compatibility',", "      entities:'Entities & functions used', entitiesSubtitle:'An overview of the entities used and their functions.', native:'Native Gewitterradar configuration', sourceNative:'Native', legacy:'Legacy fallback / compatibility',");
  result=once(result,"      footer:'Jederzeit über Einstellungen → Über Gewitterradar erneut aufrufbar.'", "      dedicationTitle:'Für Alkje', dedicationText:'Danke, dass du mir die Zeit lässt, meinen Interessen und meiner Begeisterung für Technik, Wetter und all den Ideen dazwischen nachzugehen – und mich Projekten wie Gewitterradar mit so viel Freude und Ausdauer zu widmen.',\n      footer:'Jederzeit über Einstellungen → Über Gewitterradar erneut aufrufbar.'");
  result=once(result,"      footer:'Available any time under Settings → About Gewitterradar.'", "      dedicationTitle:'For Alkje', dedicationText:'Thank you for giving me the time to pursue the interests and enthusiasm I have for technology, weather, and all the ideas in between – and to devote myself to projects like Gewitterradar with so much joy and perseverance.',\n      footer:'Available any time under Settings → About Gewitterradar.'");
  result=once(result,'<h3>Für Alkje</h3><p></p>', '<h3 data-about-text="dedicationTitle"></h3><p data-about-text="dedicationText"></p>');
  result=once(result,'      shell.querySelector(\'.about-dedication p\').textContent = ABOUT_DEDICATION;\n','');
  result=once(result,"resolved === mapping.native ? 'Native' :", "resolved === mapping.native ? t('sourceNative') :");
  result=once(result,"  const ABOUT_SETTING_LABELS = {\n    Deutsch:['Sprache','Distanzeinheit','Kompassdesign','Referenzstandort','Beobachtungsradius','Gewitterradius','Gefahrenradius','Aura-Breite','Aura-Intensität','Aura-Effekte','Warnanimation','Gewittersimulation','Standortauswahl','Kompass: nächster Blitz','Geräteorientierung','Kartengruppierung'],\n    English:['Language','Distance unit','Compass design','Reference location','Observation radius','Storm radius','Danger radius','Aura width','Aura intensity','Aura effects','Warning animation','Storm simulation','Location selector','Compass: nearest strike','Device orientation','Map grouping']\n  };", "  const ABOUT_SETTING_LABELS = {\n    Deutsch:{language:'Sprache',distance_unit:'Distanzeinheit',compass_design:'Kompassdesign',reference_location:'Referenzstandort',observation_radius:'Beobachtungsradius',storm_radius:'Gewitterradius',danger_radius:'Gefahrenradius',aura_width:'Aura-Breite',aura_intensity:'Aura-Intensität',aura_effects:'Aura-Effekte',warning_animation:'Warnanimation',storm_simulation:'Gewittersimulation',show_location_selector:'Standortauswahl',compass_nearest_strike:'Kompass: nächster Blitz',compass_device_orientation:'Geräteorientierung',map_grouping:'Kartengruppierung'},\n    English:{language:'Language',distance_unit:'Distance unit',compass_design:'Compass design',reference_location:'Reference location',observation_radius:'Observation radius',storm_radius:'Storm radius',danger_radius:'Danger radius',aura_width:'Aura width',aura_intensity:'Aura intensity',aura_effects:'Aura effects',warning_animation:'Warning animation',storm_simulation:'Storm simulation',show_location_selector:'Location selector',compass_nearest_strike:'Compass: nearest strike',compass_device_orientation:'Device orientation',map_grouping:'Map grouping'}\n  };");
  result=once(result,"  const ABOUT_SETTING_PURPOSES = {\n    Deutsch:['Wählt die Sprache der Karte.','Legt KM oder MI fest.','Wählt das Kompassdesign.','Bestimmt den Referenzstandort.','Legt den äußeren Beobachtungsbereich fest.','Definiert den Bereich erhöhter Gewitteraktivität.','Definiert den unmittelbaren Gefahrenbereich.','Steuert die Breite des Aura-Effekts.','Steuert die Stärke des Aura-Effekts.','Schaltet Aura-Effekte ein oder aus.','Aktiviert die Warnanimation.','Aktiviert die Gewittersimulation.','Erlaubt die Standortauswahl.','Richtet den Kompass auf den nächsten Blitz.','Nutzt die Geräteausrichtung.','Gruppiert nahe Blitze auf der Karte.'],\n    English:['Selects the card language.','Sets KM or MI.','Selects the compass design.','Sets the reference location.','Sets the outer observation area.','Defines the area of increased storm activity.','Defines the immediate danger area.','Controls aura effect width.','Controls aura effect intensity.','Turns aura effects on or off.','Enables warning animation.','Enables storm simulation.','Enables location selection.','Points to the nearest strike.','Uses device orientation.','Groups nearby strikes on the map.']\n  };", "  const ABOUT_SETTING_PURPOSES = {\n    Deutsch:{language:'Wählt die Sprache der Karte.',distance_unit:'Legt KM oder MI fest.',compass_design:'Wählt das Kompassdesign.',reference_location:'Bestimmt den Referenzstandort.',observation_radius:'Legt den äußeren Beobachtungsbereich fest.',storm_radius:'Definiert den Bereich erhöhter Gewitteraktivität.',danger_radius:'Definiert den unmittelbaren Gefahrenbereich.',aura_width:'Steuert die Breite des Aura-Effekts.',aura_intensity:'Steuert die Stärke des Aura-Effekts.',aura_effects:'Schaltet Aura-Effekte ein oder aus.',warning_animation:'Aktiviert die Warnanimation.',storm_simulation:'Aktiviert die Gewittersimulation.',show_location_selector:'Erlaubt die Standortauswahl.',compass_nearest_strike:'Richtet den Kompass auf den nächsten Blitz.',compass_device_orientation:'Nutzt die Geräteausrichtung.',map_grouping:'Gruppiert nahe Blitze auf der Karte.'},\n    English:{language:'Selects the card language.',distance_unit:'Sets KM or MI.',compass_design:'Selects the compass design.',reference_location:'Sets the reference location.',observation_radius:'Sets the outer observation area.',storm_radius:'Defines the area of increased storm activity.',danger_radius:'Defines the immediate danger area.',aura_width:'Controls aura effect width.',aura_intensity:'Controls aura effect intensity.',aura_effects:'Turns aura effects on or off.',warning_animation:'Enables warning animation.',storm_simulation:'Enables storm simulation.',show_location_selector:'Enables location selection.',compass_nearest_strike:'Points the compass to the nearest strike.',compass_device_orientation:'Uses device orientation.',map_grouping:'Groups nearby strikes on the map.'}\n  };");
  result=once(result,"  const ABOUT_SOURCE_PURPOSES = {\n    Deutsch:['Liefert einzelne Blitzpositionen.','Liefert die Entfernung zum letzten Blitz.','Liefert die Richtung zum letzten Blitz.','Zählt erkannte Blitzereignisse.'],\n    English:['Provides individual strike positions.','Provides distance to the latest strike.','Provides direction to the latest strike.','Counts detected lightning events.']\n  };","  const ABOUT_SOURCE_PURPOSES = {\n    Deutsch:{'geo_location.lightning_strike*':'Liefert einzelne Blitzpositionen.','sensor.home_lightning_distance':'Liefert die Entfernung zum letzten Blitz.','sensor.home_lightning_azimuth':'Liefert die Richtung zum letzten Blitz.','sensor.home_lightning_counter':'Zählt erkannte Blitzereignisse.'},\n    English:{'geo_location.lightning_strike*':'Provides individual strike positions.','sensor.home_lightning_distance':'Provides distance to the latest strike.','sensor.home_lightning_azimuth':'Provides direction to the latest strike.','sensor.home_lightning_counter':'Counts detected lightning events.'}\n  };");
  result=once(result,"        row.innerHTML = '<code></code><p class=\"about-purpose\"></p>';\n        row.querySelector('code').textContent = match[1];","        row.innerHTML = '<code></code><p class=\"about-purpose\"></p>';\n        row.dataset.source = match[1];\n        row.querySelector('code').textContent = match[1];");
  result=once(result,"      dialog.querySelectorAll('.about-source-list .about-purpose').forEach((node, index) => setText(node, sourcePurposes[index]));","      dialog.querySelectorAll('.about-source-list [data-source]').forEach((row) => setText(row.querySelector('.about-purpose'), sourcePurposes[row.dataset.source]));");
  result=once(result,'      const keys = Object.keys(SETTING_ENTITIES);\n','');
  result=once(result,"        setText(row.querySelector('strong'), labels[keys.indexOf(key)]);", "        setText(row.querySelector('strong'), labels[key]);");
  result=once(result,"        setText(row.querySelector('.about-purpose'), purposes[keys.indexOf(key)]);", "        setText(row.querySelector('.about-purpose'), purposes[key]);");
  result=once(result,"        setText(row.querySelector('strong span'), labels[keys.indexOf(key)]);", "        setText(row.querySelector('strong span'), labels[key]);");
  result=once(result,'<span aria-hidden="true">×</span></button></header>','<span aria-hidden="true"><img src="${ABOUT_CLOSE_IMAGE}" alt="" width="34" height="34" draggable="false"></span></button></header>');
  result=once(result,'aria-label="Copy YAML">${icon(\'copy\')}</button>','aria-label="Copy YAML"><img src="${ABOUT_COPY_IMAGE}" alt="" width="28" height="28" draggable="false"></button>');
  result=once(result,'V4.05 DEV · Visual V2','V4.05 · Visual V2');
  result=once(result,"radiusInfo:'Die Radien helfen, Gewitter frühzeitig einzuschätzen und die aktuelle Situation schnell und übersichtlich zu beurteilen.'","radiusInfo:'Die Radien helfen, Gewitter frühzeitig einzuschätzen und die aktuelle Situation schnell und übersichtlich zu beurteilen. Die Radien bauen aufeinander auf: Ein Blitz im Gefahrenradius zählt zugleich zum Gewitter- und Beobachtungsradius.'");
  result=once(result,"subtitle:'Storms. Data. Safety. Our shared passion.'", "subtitle:'For weather enthusiasts who want to follow lightning activity in a clear and easy-to-understand way.'");
  result=once(result,"claim:'Observe nature. Live safely.'", "claim:'Observe thunderstorms, discover how they develop.'");
  result=once(result,"intro:'This project is for everyone fascinated by thunderstorms, lightning, weather and the dynamics of our atmosphere. Gewitterradar helps you understand nature, recognise developments early and observe them with respect. We are glad you are part of this community!'", "intro:'This project is for everyone fascinated by thunderstorms, lightning, weather phenomena and the fascinating dynamics of our atmosphere. Gewitterradar helps you understand nature better, recognise developments early and observe them with respect. It’s great to have you as part of this community!'");
  result=once(result,"quote:'“Every storm holds a story.”'", "quote:'Thunderstorms reveal just how powerful the atmosphere can be.'");
  result=once(result,"radiiTagline:'Three areas. A clear overview.'", "radiiTagline:'Three areas. One clear overview.'");
  result=once(result,"schematic:'Schematic radius diagram, not to scale'", "schematic:'Schematic representation of the radii, not to scale'");
  result=once(result,"observation:'Early observation of distant storms in the wider surroundings.'", "observation:'Early observation of distant thunderstorms in the wider area.'");
  result=once(result,"storm:'Closer storm activity calling for increased attention.'", "storm:'Closer thunderstorm activity that requires increased attention.'");
  result=once(result,"radiusInfo:'The radii help you assess approaching thunderstorms early and understand the current situation at a glance.'", "radiusInfo:'The radii help you assess thunderstorms early and understand the current situation quickly and clearly. The radii build on one another: a strike within the danger radius also counts within the storm and observation radii.'");
  result=once(result,"network:'Special thanks to Blitzortung.org and the worldwide network of volunteer station operators. The lightning data used by Gewitterradar is made possible by this community-operated detection network.'", "network:'Special thanks go to Blitzortung.org and its worldwide community of volunteer station operators. Gewitterradar uses lightning data provided by this community-operated detection network.'");
  result=once(result,"recorderText:'To prevent excessive Home Assistant database growth, exclude these four rapidly changing lightning sources from Recorder in configuration.yaml. Merge into any existing recorder: section — do not add a second top-level recorder: block. Live states remain available to Gewitterradar.'", "recorderText:'To limit database growth, we strongly recommend excluding these four sources from Recorder in configuration.yaml. Add them to an existing recorder: section – do not create a second top-level block. Live states remain available.'");
  result=once(result,"merge:'If a recorder: section already exists, merge these entries into it. Do NOT create a second top-level recorder: block.'", "merge:'If a recorder: section already exists, integrate these entries there. Do NOT create a second top-level recorder: block.'");
  result=once(result,"entitiesSubtitle:'An overview of the entities used and their functions.'", "entitiesSubtitle:'An overview of all entities used and their functions.'");
  result=once(result,"locationZone:'Provides selectable reference zones.'", "locationZone:'Provides selectable zones as reference locations.'");
  result=once(result,"legacyText:'Existing lightning_detection_* helpers provide compatibility. They are not required for a fresh native installation.'", "legacyText:'The existing lightning_detection_* helpers are provided for compatibility. They are not required for a fresh native installation.'");
  result=once(result,"footer:'Available any time under Settings → About Gewitterradar.'", "footer:'Available at any time under Settings → About Gewitterradar.'");
  result=once(result,'              <details class="settings-section settings-collapsible">\n                <summary class="settings-section-head">\n                  <div>\n                    <div class="settings-section-title" id="settings-diagnostic-section-title">Kalibrierung &amp; Diagnose</div>','              <details class="settings-section settings-collapsible" id="settings-diagnostic-section">\n                <summary class="settings-section-head">\n                  <div>\n                    <div class="settings-section-title" id="settings-diagnostic-section-title">Kalibrierung &amp; Diagnose</div>');
  const settingsCss=`          /* V4.06 menu polish: premium About icon and three-level diagnostic hierarchy. */
          #settings-about > span[aria-hidden="true"] {
            display:grid;
            place-items:center;
            flex:0 0 24px;
            width:24px;
            height:24px;
            font:700 21px/1 "Segoe UI Symbol","Arial Unicode MS",sans-serif;
            color:#e2b95d;
            background:linear-gradient(135deg,#926521 6%,#f8e4a5 35%,#c18a2c 60%,#f1cf75 82%,#8d5d1a);
            -webkit-background-clip:text;
            background-clip:text;
            -webkit-text-fill-color:transparent;
            filter:drop-shadow(0 1px 0 rgba(49,29,5,.92)) drop-shadow(0 0 2px rgba(232,181,65,.28));
            transition:filter .16s ease;
          }
          #settings-about:focus-visible { outline:none; }
          #settings-about:focus-visible > span[aria-hidden="true"] {
            outline:2px solid rgba(255,225,161,.92);
            outline-offset:2px;
            border-radius:50%;
            filter:brightness(1.13) drop-shadow(0 0 3px rgba(244,197,91,.42));
          }
          @media(hover:hover) and (pointer:fine) {
            #settings-about:hover > span[aria-hidden="true"] {
              filter:brightness(1.14) saturate(1.08) drop-shadow(0 1px 0 rgba(49,29,5,.92)) drop-shadow(0 0 3px rgba(238,188,72,.38));
            }
          }
          #settings-about:active > span[aria-hidden="true"] {
            filter:brightness(.9) saturate(1.08) drop-shadow(0 1px 0 rgba(49,29,5,.92));
          }
          #settings-diagnostic-section > .settings-section-content > .settings-row-label {
            box-sizing:border-box;
            width:100%;
            padding:9px 12px 4px 22px;
            color:#d7bd82;
            font-size:8.6px;
            font-weight:820;
            line-height:1.25;
            letter-spacing:.055em;
          }
          #settings-diagnostic-section > .settings-section-content > .settings-row {
            padding-left:34px;
            padding-right:12px;
          }
          #settings-diagnostic-section > .settings-section-content > .settings-test-grid {
            padding-left:34px;
            padding-right:12px;
          }
          @media(max-width:720px) {
            #settings-diagnostic-section > .settings-section-content > .settings-row-label { padding-left:20px; }
            #settings-diagnostic-section > .settings-section-content > .settings-row { padding-left:30px;padding-right:10px; }
            #settings-diagnostic-section > .settings-section-content > .settings-test-grid { padding-left:30px;padding-right:10px; }
          }
          @media(max-height:720px) {
            #settings-diagnostic-section > .settings-section-content > .settings-row-label { padding:7px 9px 3px 20px; }
            #settings-diagnostic-section > .settings-section-content > .settings-row { padding-left:30px;padding-right:9px; }
            #settings-diagnostic-section > .settings-section-content > .settings-test-grid { padding-left:30px;padding-right:9px; }
          }
          @media(max-width:520px) and (min-height:721px) {
            #settings-diagnostic-section > .settings-section-content > .settings-row-label { padding-left:18px; }
            #settings-diagnostic-section > .settings-section-content > .settings-row { padding-left:26px; }
            #settings-diagnostic-section > .settings-section-content > .settings-test-grid { padding-left:26px; }
          }
`;
  result=once(result,'        </style>\n\n        <ha-card id="card-root">',settingsCss+'        </style>\n\n        <ha-card id="card-root">');
  const css=`        /* Approved post-V4.05 controls: visual shell only; handlers/hit targets unchanged. */
        .about-close span{position:relative;border:0;background:none;overflow:visible}
        .about-close span img{position:absolute;left:50%;top:50%;width:34px;height:34px;max-width:none;object-fit:contain;transform:translate(-50%,-50%);filter:none;pointer-events:none}
        .about-dialog .about-code-meta .about-copy{appearance:none;border:0;background:none;box-shadow:none;outline:none;-webkit-tap-highlight-color:transparent}
        .about-code-wrap code{font-family:inherit}
        @media(max-width:620px){.about-dedication-copy p{max-width:60%}}
        .about-code-meta .about-copy::before{content:none}
        .about-copy>img{position:relative;display:block;width:28px;height:28px;object-fit:contain;pointer-events:none;filter:none}
        .about-close:focus-visible{outline:2px solid #ffe1a1;outline-offset:-2px;border-radius:5px}
        .about-copy:focus-visible>img{filter:brightness(1.15) drop-shadow(1px 0 0 #ffe1a1) drop-shadow(-1px 0 0 #ffe1a1) drop-shadow(0 1px 0 #ffe1a1) drop-shadow(0 -1px 0 #ffe1a1)}
        @media(hover:hover) and (pointer:fine){.about-close:hover img,.about-copy:hover:not(:focus-visible) img{filter:brightness(1.12) drop-shadow(0 0 2px #dba34c70)}}
        .about-close:active img{transform:translate(-50%,calc(-50% + .5px)) scale(.97);filter:brightness(.92)}.about-copy:active:not(:focus-visible) img{transform:translateY(.5px) scale(.97);filter:brightness(.92)}
`;
  return v406FinalDelta(aboutLocalesDelta(languageOnboardingDelta(once(result,'      </style>\n      <dialog class="about-dialog"',css+'      </style>\n      <dialog class="about-dialog"'))));
}

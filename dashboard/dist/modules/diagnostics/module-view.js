import { defineModule } from "../core/runtime.js?v=41002r1";

export const MODULE_META=Object.freeze({
  id:"diagnostics.module-view",
  version:"1.3.2",
  group:"Diagnose",
  function:"Module & Versionen",
  subfunctions:["Geladene Module","Soll/Ist-Vergleich","Versionsstatus","Modul-Details","Abweichungsdetails","Diagnose kopieren","JSON herunterladen"],
  file:"modules/diagnostics/module-view.js"
});

export const installModuleView=defineModule(MODULE_META,(deps)=>{
  const { APPLICATION_META, EXPECTED_MODULES, moduleDiagnostics, moduleRegistrySnapshot, ABOUT_CLOSE_IMAGE }=deps;

  const statusSymbol=(status)=>status==="ok"?"✓":status==="missing"?"✕":"!";
  const moduleSetFingerprint=(rows,key,revision=APPLICATION_META.runtimeRevision||APPLICATION_META.build||APPLICATION_META.version)=>{
    const packed=`${revision}|${[...(rows||[])].sort((a,b)=>String(a.id).localeCompare(String(b.id))).map(row=>`${row.id}@${row[key]||"—"}`).join("|")}`;
    let hash=0x811c9dc5;
    for(let index=0;index<packed.length;index+=1){hash^=packed.charCodeAt(index);hash=Math.imul(hash,0x01000193)>>>0;}
    const hex=hash.toString(16).padStart(8,"0").toUpperCase();
    return `${hex.slice(0,4)}-${hex.slice(4)}`;
  };
  const moduleRuntimeManifestUrl=()=>new URL('../../assets/gewitterradar-runtime-manifest.json', import.meta.url).href;
  const groupPriority=(group)=>group==="Diagnose"?-100:0;
  const groupTranslationKey=(group)=>({
    "Kern":"modules.group.core",
    "Vollbild":"modules.group.fullscreen",
    "Oberfläche":"modules.group.ui",
    "Instrumente":"modules.group.instruments",
    "Diagnose":"modules.group.diagnostics",
    "Standort & Radien":"modules.group.location",
    "Karte":"modules.group.map",
    "Verlauf":"modules.group.history"
  }[group]||"modules.group.other");

  const MODULE_VIEW_IDS=Object.freeze(["core.manifest","core.base-context","core.registry","core.runtime","core.card-lifecycle","fullscreen.map-display","ui.scroll-guard","ui.skeleton","instruments.compass-scale","ui.controls","ui.i18n-settings","core.source-status","instruments.compass-selector","diagnostics.module-view","diagnostics.cockpit","instruments.compass-design","location.radii-map","map.strikes-warnings","map.clusters-recent","ui.render","instruments.compass","history.chart"]);
  const MODULE_VIEW_META=Object.freeze({
  "Deutsch": [
    "Modulmanifest|Sollstand · Produktversion · Buildkennung",
    "Konstanten & gemeinsame Helfer|Assets · Konstanten · Sprache · Speichergrundlagen · Geometrie · Leaflet-Helfer",
    "Modulregister|Selbstregistrierung · Soll/Ist-Prüfung · Diagnoseexport",
    "Modul-Laufzeit|Selbstregistrierung · Methodeninstallation · Abhängigkeitsübergabe",
    "Karten-Lebenszyklus|Konfiguration · Verbinden · Trennen",
    "Kartendarstellung|Standard · Groß · Vollbild · separates Fenster · Instrumentpositionen",
    "Scrollschutz|Home-Assistant-Seitenleiste · Touch · iPad/WebKit · HA-State",
    "Grundgerüst|HTML · CSS · Dialoge · Menüstruktur",
    "Kompass-Skala|Skala · Geometrie",
    "Bedienbindungen|Klick · Touch · Formulare · Menüaktionen",
    "Sprache & Einstellungen|Übersetzung · About · Einstellungen · Hilfetexte",
    "Datenquellenstatus|Blitzortung-Status · Statusanzeige",
    "Kompassauswahl|Designauswahl · Popup · Rahmenwahl · Diagnosegeometrie",
    "Module & Versionen|Geladene Module · Soll/Ist-Vergleich · Versionsstatus · Modul-Details · Diagnose kopieren · JSON herunterladen",
    "Diagnose & Kalibrierung|Diagnosekonsole · Virtuelles Gewitter · Kompass-Kalibrierung · Medaillon-Kalibrierung · Leistung",
    "Kompassdesign|Design anwenden · Grafikgeometrie",
    "Standort, Radien & Kartenstart|Standort · Radien · Aura · Karteninitialisierung",
    "Blitze & Warnungen|Blitzaufnahme · Warnanimation · Geräteorientierung",
    "Cluster & letzte Blitze|Cluster · Marker · Recent-Liste · Navigation",
    "Hauptrendering|Status · KPI · Listen · UI-Synchronisierung",
    "Kompass|Bewegungsprofil · Animation · Rendering",
    "Trend & Verlauf|Trendberechnung · 120-Minuten-Diagramm"
  ],
  "English": [
    "Module manifest|Target state · Product version · Build identifier",
    "Constants & shared helpers|Assets · Constants · Language · Storage foundations · Geometry · Leaflet helpers",
    "Module registry|Self-registration · Target/actual check · Diagnostic export",
    "Module runtime|Self-registration · Method installation · Dependency injection",
    "Card lifecycle|Configuration · Connect · Disconnect",
    "Map display|Standard · Large · Fullscreen · Separate window · Instrument positions",
    "Scroll protection|Home Assistant sidebar · Touch · iPad/WebKit · HA state",
    "UI skeleton|HTML · CSS · Dialogs · Menu structure",
    "Compass scale|Scale · Geometry",
    "Control bindings|Click · Touch · Forms · Menu actions",
    "Language & settings|Translation · About · Settings · Help texts",
    "Data source status|Blitzortung status · Status display",
    "Compass selection|Design selection · Popup · Frame selection · Diagnostic geometry",
    "Modules & versions|Loaded modules · Target/actual comparison · Version status · Module details · Copy diagnostics · Download JSON",
    "Diagnostics & calibration|Diagnostic console · Virtual storm · Compass calibration · Medallion calibration · Performance",
    "Compass design|Apply design · Graphic geometry",
    "Location, radii & map start|Location · Radii · Aura · Map initialization",
    "Strikes & warnings|Strike intake · Warning animation · Device orientation",
    "Clusters & recent strikes|Clusters · Markers · Recent list · Navigation",
    "Main rendering|Status · KPI · Lists · UI synchronization",
    "Compass|Motion profile · Animation · Rendering",
    "Trend & history|Trend calculation · 120-minute chart"
  ],
  "Dansk": [
    "Modulmanifest|Måltilstand · Produktversion · Build-id",
    "Konstanter og fælles hjælpefunktioner|Aktiver · Konstanter · Sprog · Lagringsgrundlag · Geometri · Leaflet-hjælpere",
    "Modulregister|Selvregistrering · Mål/faktisk-kontrol · Diagnoseeksport",
    "Modulkørsel|Selvregistrering · Metodeinstallation · Overførsel af afhængigheder",
    "Kortets livscyklus|Konfiguration · Tilslut · Afbryd",
    "Kortvisning|Standard · Stor · Fuld skærm · Separat vindue · Instrumentplaceringer",
    "Rullebeskyttelse|Home Assistant-sidepanel · Berøring · iPad/WebKit · HA-tilstand",
    "Grundstruktur|HTML · CSS · Dialoger · Menustruktur",
    "Kompaskala|Skala · Geometri",
    "Betjeningsbindinger|Klik · Berøring · Formularer · Menuhandlinger",
    "Sprog og indstillinger|Oversættelse · Om · Indstillinger · Hjælpetekster",
    "Datakildestatus|Blitzortung-status · Statusvisning",
    "Kompasvalg|Designvalg · Popup · Rammevalg · Diagnosegeometri",
    "Moduler og versioner|Indlæste moduler · Mål/faktisk-sammenligning · Versionsstatus · Moduldetaljer · Kopiér diagnose · Download JSON",
    "Diagnose og kalibrering|Diagnosekonsol · Virtuelt tordenvejr · Kompaskalibrering · Medaljonkalibrering · Ydelse",
    "Kompasdesign|Anvend design · Grafikgeometri",
    "Placering, radier og kortstart|Placering · Radier · Aura · Kortinitialisering",
    "Lynnedslag og advarsler|Registrering af lynnedslag · Advarselsanimation · Enhedsorientering",
    "Klynger og seneste lynnedslag|Klynger · Markører · Liste over seneste · Navigation",
    "Hovedrendering|Status · KPI · Lister · UI-synkronisering",
    "Kompas|Bevægelsesprofil · Animation · Rendering",
    "Tendens og historik|Tendensberegning · 120-minutters diagram"
  ],
  "Español": [
    "Manifiesto de módulos|Estado objetivo · Versión del producto · Identificador de compilación",
    "Constantes y ayudas compartidas|Recursos · Constantes · Idioma · Bases de almacenamiento · Geometría · Ayudas de Leaflet",
    "Registro de módulos|Autorregistro · Comprobación objetivo/real · Exportación de diagnóstico",
    "Ejecución de módulos|Autorregistro · Instalación de métodos · Entrega de dependencias",
    "Ciclo de vida de la tarjeta|Configuración · Conectar · Desconectar",
    "Visualización del mapa|Estándar · Grande · Pantalla completa · Ventana separada · Posiciones de instrumentos",
    "Protección de desplazamiento|Barra lateral de Home Assistant · Táctil · iPad/WebKit · Estado de HA",
    "Estructura base|HTML · CSS · Diálogos · Estructura de menús",
    "Escala de la brújula|Escala · Geometría",
    "Enlaces de control|Clic · Táctil · Formularios · Acciones de menú",
    "Idioma y ajustes|Traducción · Acerca de · Ajustes · Textos de ayuda",
    "Estado de fuentes de datos|Estado de Blitzortung · Indicador de estado",
    "Selección de brújula|Selección de diseño · Ventana emergente · Selección de marco · Geometría de diagnóstico",
    "Módulos y versiones|Módulos cargados · Comparación objetivo/real · Estado de versiones · Detalles de módulos · Copiar diagnóstico · Descargar JSON",
    "Diagnóstico y calibración|Consola de diagnóstico · Tormenta virtual · Calibración de brújula · Calibración de medallón · Rendimiento",
    "Diseño de brújula|Aplicar diseño · Geometría gráfica",
    "Ubicación, radios e inicio del mapa|Ubicación · Radios · Aura · Inicialización del mapa",
    "Rayos y avisos|Recepción de rayos · Animación de aviso · Orientación del dispositivo",
    "Clústeres y rayos recientes|Clústeres · Marcadores · Lista reciente · Navegación",
    "Renderizado principal|Estado · KPI · Listas · Sincronización de interfaz",
    "Brújula|Perfil de movimiento · Animación · Renderizado",
    "Tendencia e historial|Cálculo de tendencia · Gráfico de 120 minutos"
  ],
  "Français": [
    "Manifeste des modules|État cible · Version du produit · Identifiant de build",
    "Constantes et aides communes|Ressources · Constantes · Langue · Bases de stockage · Géométrie · Aides Leaflet",
    "Registre des modules|Auto-enregistrement · Contrôle cible/réel · Export du diagnostic",
    "Exécution des modules|Auto-enregistrement · Installation des méthodes · Transmission des dépendances",
    "Cycle de vie de la carte|Configuration · Connexion · Déconnexion",
    "Affichage de la carte|Standard · Grande · Plein écran · Fenêtre séparée · Positions des instruments",
    "Protection du défilement|Barre latérale Home Assistant · Tactile · iPad/WebKit · État HA",
    "Structure de base|HTML · CSS · Dialogues · Structure des menus",
    "Échelle de la boussole|Échelle · Géométrie",
    "Liaisons de commande|Clic · Tactile · Formulaires · Actions de menu",
    "Langue et paramètres|Traduction · À propos · Paramètres · Textes d’aide",
    "État des sources de données|État Blitzortung · Affichage de l’état",
    "Sélection de la boussole|Choix du design · Fenêtre contextuelle · Choix du cadre · Géométrie de diagnostic",
    "Modules et versions|Modules chargés · Comparaison cible/réel · État des versions · Détails des modules · Copier le diagnostic · Télécharger le JSON",
    "Diagnostic et étalonnage|Console de diagnostic · Orage virtuel · Étalonnage de la boussole · Étalonnage du médaillon · Performances",
    "Design de la boussole|Appliquer le design · Géométrie graphique",
    "Emplacement, rayons et démarrage de la carte|Emplacement · Rayons · Aura · Initialisation de la carte",
    "Impacts et avertissements|Réception des impacts · Animation d’avertissement · Orientation de l’appareil",
    "Clusters et impacts récents|Clusters · Marqueurs · Liste récente · Navigation",
    "Rendu principal|État · KPI · Listes · Synchronisation de l’interface",
    "Boussole|Profil de mouvement · Animation · Rendu",
    "Tendance et historique|Calcul de tendance · Graphique sur 120 minutes"
  ],
  "Nederlands": [
    "Modulemanifest|Doelstatus · Productversie · Buildkenmerk",
    "Constanten en gedeelde helpers|Assets · Constanten · Taal · Opslagbasis · Geometrie · Leaflet-helpers",
    "Moduleregister|Zelfregistratie · Doel/werkelijk-controle · Diagnose-export",
    "Module-runtime|Zelfregistratie · Methode-installatie · Overdracht van afhankelijkheden",
    "Kaartlevenscyclus|Configuratie · Verbinden · Loskoppelen",
    "Kaartweergave|Standaard · Groot · Volledig scherm · Apart venster · Instrumentposities",
    "Scrollbeveiliging|Home Assistant-zijbalk · Aanraken · iPad/WebKit · HA-status",
    "Basisstructuur|HTML · CSS · Dialogen · Menustructuur",
    "Kompasschaal|Schaal · Geometrie",
    "Bedieningskoppelingen|Klik · Aanraken · Formulieren · Menuacties",
    "Taal en instellingen|Vertaling · Over · Instellingen · Helpteksten",
    "Status van gegevensbronnen|Blitzortung-status · Statusweergave",
    "Kompaskeuze|Ontwerpkeuze · Popup · Framekeuze · Diagnosegeometrie",
    "Modules en versies|Geladen modules · Doel/werkelijk-vergelijking · Versiestatus · Moduledetails · Diagnose kopiëren · JSON downloaden",
    "Diagnose en kalibratie|Diagnoseconsole · Virtueel onweer · Kompaskalibratie · Medaillonkalibratie · Prestaties",
    "Kompasontwerp|Ontwerp toepassen · Grafische geometrie",
    "Locatie, stralen en kaartstart|Locatie · Stralen · Aura · Kaartinitialisatie",
    "Bliksem en waarschuwingen|Bliksemopname · Waarschuwingsanimatie · Apparaatoriëntatie",
    "Clusters en recente bliksem|Clusters · Markeringen · Recente lijst · Navigatie",
    "Hoofdweergave|Status · KPI · Lijsten · UI-synchronisatie",
    "Kompas|Bewegingsprofiel · Animatie · Rendering",
    "Trend en geschiedenis|Trendberekening · Diagram van 120 minuten"
  ],
  "Polski": [
    "Manifest modułów|Stan docelowy · Wersja produktu · Identyfikator kompilacji",
    "Stałe i wspólne funkcje pomocnicze|Zasoby · Stałe · Język · Podstawy pamięci · Geometria · Pomocniki Leaflet",
    "Rejestr modułów|Samorejestracja · Kontrola stan docelowy/rzeczywisty · Eksport diagnostyki",
    "Środowisko modułów|Samorejestracja · Instalacja metod · Przekazywanie zależności",
    "Cykl życia karty|Konfiguracja · Połącz · Rozłącz",
    "Widok mapy|Standardowy · Duży · Pełny ekran · Osobne okno · Pozycje instrumentów",
    "Ochrona przewijania|Pasek boczny Home Assistant · Dotyk · iPad/WebKit · Stan HA",
    "Struktura podstawowa|HTML · CSS · Okna dialogowe · Struktura menu",
    "Skala kompasu|Skala · Geometria",
    "Powiązania sterowania|Kliknięcie · Dotyk · Formularze · Akcje menu",
    "Język i ustawienia|Tłumaczenie · O programie · Ustawienia · Teksty pomocy",
    "Stan źródeł danych|Stan Blitzortung · Wskaźnik stanu",
    "Wybór kompasu|Wybór wyglądu · Okno podręczne · Wybór ramki · Geometria diagnostyczna",
    "Moduły i wersje|Załadowane moduły · Porównanie stan docelowy/rzeczywisty · Stan wersji · Szczegóły modułu · Kopiuj diagnostykę · Pobierz JSON",
    "Diagnostyka i kalibracja|Konsola diagnostyczna · Wirtualna burza · Kalibracja kompasu · Kalibracja medalionu · Wydajność",
    "Wygląd kompasu|Zastosuj wygląd · Geometria grafiki",
    "Lokalizacja, promienie i start mapy|Lokalizacja · Promienie · Aura · Inicjalizacja mapy",
    "Wyładowania i ostrzeżenia|Odbiór wyładowań · Animacja ostrzeżenia · Orientacja urządzenia",
    "Klastry i ostatnie wyładowania|Klastry · Znaczniki · Lista ostatnich · Nawigacja",
    "Renderowanie główne|Stan · KPI · Listy · Synchronizacja interfejsu",
    "Kompas|Profil ruchu · Animacja · Renderowanie",
    "Trend i historia|Obliczanie trendu · Wykres 120-minutowy"
  ],
  "Português": [
    "Manifesto de módulos|Estado pretendido · Versão do produto · Identificador da compilação",
    "Constantes e auxiliares comuns|Recursos · Constantes · Idioma · Bases de armazenamento · Geometria · Auxiliares Leaflet",
    "Registo de módulos|Autorregisto · Verificação pretendido/real · Exportação de diagnóstico",
    "Execução de módulos|Autorregisto · Instalação de métodos · Transferência de dependências",
    "Ciclo de vida do cartão|Configuração · Ligar · Desligar",
    "Apresentação do mapa|Padrão · Grande · Ecrã inteiro · Janela separada · Posições dos instrumentos",
    "Proteção de deslocamento|Barra lateral do Home Assistant · Toque · iPad/WebKit · Estado do HA",
    "Estrutura base|HTML · CSS · Diálogos · Estrutura do menu",
    "Escala da bússola|Escala · Geometria",
    "Ligações de controlo|Clique · Toque · Formulários · Ações do menu",
    "Idioma e definições|Tradução · Acerca de · Definições · Textos de ajuda",
    "Estado das fontes de dados|Estado do Blitzortung · Indicação de estado",
    "Seleção da bússola|Seleção de design · Janela emergente · Seleção de moldura · Geometria de diagnóstico",
    "Módulos e versões|Módulos carregados · Comparação pretendido/real · Estado das versões · Detalhes dos módulos · Copiar diagnóstico · Transferir JSON",
    "Diagnóstico e calibração|Consola de diagnóstico · Trovoada virtual · Calibração da bússola · Calibração do medalhão · Desempenho",
    "Design da bússola|Aplicar design · Geometria gráfica",
    "Localização, raios e início do mapa|Localização · Raios · Aura · Inicialização do mapa",
    "Descargas e avisos|Receção de descargas · Animação de aviso · Orientação do dispositivo",
    "Clusters e descargas recentes|Clusters · Marcadores · Lista recente · Navegação",
    "Renderização principal|Estado · KPI · Listas · Sincronização da interface",
    "Bússola|Perfil de movimento · Animação · Renderização",
    "Tendência e histórico|Cálculo da tendência · Gráfico de 120 minutos"
  ],
  "Svenska": [
    "Modulmanifest|Måltillstånd · Produktversion · Byggidentifierare",
    "Konstanter och gemensamma hjälpfunktioner|Resurser · Konstanter · Språk · Lagringsgrunder · Geometri · Leaflet-hjälpare",
    "Modulregister|Självregistrering · Mål/faktisk-kontroll · Diagnostikexport",
    "Modulkörning|Självregistrering · Metodinstallation · Överföring av beroenden",
    "Kortets livscykel|Konfiguration · Anslut · Koppla från",
    "Kartvisning|Standard · Stor · Helskärm · Separat fönster · Instrumentpositioner",
    "Rullningsskydd|Home Assistant-sidofält · Pekning · iPad/WebKit · HA-tillstånd",
    "Grundstruktur|HTML · CSS · Dialoger · Menystruktur",
    "Kompasskala|Skala · Geometri",
    "Styrbindningar|Klick · Pekning · Formulär · Menyåtgärder",
    "Språk och inställningar|Översättning · Om · Inställningar · Hjälptexter",
    "Datakällestatus|Blitzortung-status · Statusvisning",
    "Kompassval|Designval · Popup · Ramval · Diagnostikgeometri",
    "Moduler och versioner|Laddade moduler · Mål/faktisk-jämförelse · Versionsstatus · Moduldetaljer · Kopiera diagnostik · Hämta JSON",
    "Diagnostik och kalibrering|Diagnostikkonsol · Virtuellt åskväder · Kompasskalibrering · Medaljongkalibrering · Prestanda",
    "Kompassdesign|Tillämpa design · Grafikgeometri",
    "Plats, radier och kartstart|Plats · Radier · Aura · Kartinitiering",
    "Blixtar och varningar|Blixtmottagning · Varningsanimation · Enhetsorientering",
    "Kluster och senaste blixtar|Kluster · Markörer · Senaste-lista · Navigering",
    "Huvudrendering|Status · KPI · Listor · UI-synkronisering",
    "Kompass|Rörelseprofil · Animation · Rendering",
    "Trend och historik|Trendberäkning · 120-minutersdiagram"
  ],
  "Italiano": [
    "Manifesto dei moduli|Stato previsto · Versione prodotto · Identificatore build",
    "Costanti e helper condivisi|Risorse · Costanti · Lingua · Basi di memorizzazione · Geometria · Helper Leaflet",
    "Registro moduli|Autoregistrazione · Controllo previsto/reale · Esportazione diagnostica",
    "Runtime dei moduli|Autoregistrazione · Installazione metodi · Passaggio dipendenze",
    "Ciclo di vita della scheda|Configurazione · Connetti · Disconnetti",
    "Visualizzazione mappa|Standard · Grande · Schermo intero · Finestra separata · Posizioni strumenti",
    "Protezione scorrimento|Barra laterale Home Assistant · Tocco · iPad/WebKit · Stato HA",
    "Struttura base|HTML · CSS · Finestre di dialogo · Struttura menu",
    "Scala bussola|Scala · Geometria",
    "Associazioni dei controlli|Clic · Tocco · Moduli · Azioni menu",
    "Lingua e impostazioni|Traduzione · Informazioni · Impostazioni · Testi di aiuto",
    "Stato fonti dati|Stato Blitzortung · Indicatore di stato",
    "Selezione bussola|Selezione design · Popup · Selezione cornice · Geometria diagnostica",
    "Moduli e versioni|Moduli caricati · Confronto previsto/reale · Stato versioni · Dettagli moduli · Copia diagnostica · Scarica JSON",
    "Diagnostica e calibrazione|Console diagnostica · Temporale virtuale · Calibrazione bussola · Calibrazione medaglione · Prestazioni",
    "Design bussola|Applica design · Geometria grafica",
    "Posizione, raggi e avvio mappa|Posizione · Raggi · Aura · Inizializzazione mappa",
    "Fulmini e avvisi|Ricezione fulmini · Animazione di avviso · Orientamento dispositivo",
    "Cluster e fulmini recenti|Cluster · Marcatori · Elenco recente · Navigazione",
    "Rendering principale|Stato · KPI · Elenchi · Sincronizzazione UI",
    "Bussola|Profilo di movimento · Animazione · Rendering",
    "Tendenza e cronologia|Calcolo tendenza · Grafico di 120 minuti"
  ],
  "Norsk bokmål": [
    "Modulmanifest|Måltilstand · Produktversjon · Bygg-ID",
    "Konstanter og felles hjelpere|Ressurser · Konstanter · Språk · Lagringsgrunnlag · Geometri · Leaflet-hjelpere",
    "Modulregister|Selvregistrering · Mål/faktisk-kontroll · Diagnoseeksport",
    "Modulkjøring|Selvregistrering · Metodeinstallasjon · Overføring av avhengigheter",
    "Kortets livssyklus|Konfigurasjon · Koble til · Koble fra",
    "Kartvisning|Standard · Stor · Fullskjerm · Eget vindu · Instrumentposisjoner",
    "Rullebeskyttelse|Home Assistant-sidefelt · Berøring · iPad/WebKit · HA-tilstand",
    "Grunnstruktur|HTML · CSS · Dialoger · Menystruktur",
    "Kompasskala|Skala · Geometri",
    "Kontrollbindinger|Klikk · Berøring · Skjemaer · Menyhandlinger",
    "Språk og innstillinger|Oversettelse · Om · Innstillinger · Hjelpetekster",
    "Datakildestatus|Blitzortung-status · Statusvisning",
    "Kompassvalg|Designvalg · Popup · Rammevalg · Diagnosegeometri",
    "Moduler og versjoner|Lastede moduler · Mål/faktisk-sammenligning · Versjonsstatus · Moduldetaljer · Kopier diagnose · Last ned JSON",
    "Diagnose og kalibrering|Diagnosekonsoll · Virtuelt tordenvær · Kompasskalibrering · Medaljongkalibrering · Ytelse",
    "Kompassdesign|Bruk design · Grafikkgeometri",
    "Plassering, radier og kartstart|Plassering · Radier · Aura · Kartinitialisering",
    "Lyn og advarsler|Lynmottak · Advarselsanimasjon · Enhetsorientering",
    "Klynger og siste lyn|Klynger · Markører · Siste-liste · Navigasjon",
    "Hovedrendering|Status · KPI · Lister · UI-synkronisering",
    "Kompass|Bevegelsesprofil · Animasjon · Rendering",
    "Trend og historikk|Trendberegning · 120-minuttersdiagram"
  ],
  "Suomi": [
    "Moduuliluettelo|Tavoitetila · Tuoteversio · Koontitunniste",
    "Vakiot ja yhteiset apufunktiot|Resurssit · Vakiot · Kieli · Tallennuksen perusteet · Geometria · Leaflet-apurit",
    "Moduulirekisteri|Itserekisteröinti · Tavoite/toteuma-tarkistus · Diagnostiikan vienti",
    "Moduulien suoritusympäristö|Itserekisteröinti · Menetelmien asennus · Riippuvuuksien välitys",
    "Kortin elinkaari|Määritys · Yhdistä · Katkaise yhteys",
    "Karttanäkymä|Vakio · Suuri · Koko näyttö · Erillinen ikkuna · Mittareiden sijainnit",
    "Vierityssuojaus|Home Assistant -sivupalkki · Kosketus · iPad/WebKit · HA-tila",
    "Perusrakenne|HTML · CSS · Dialogit · Valikkorakenne",
    "Kompassiasteikko|Asteikko · Geometria",
    "Ohjaussidokset|Napsautus · Kosketus · Lomakkeet · Valikkotoiminnot",
    "Kieli ja asetukset|Käännös · Tietoja · Asetukset · Ohjetekstit",
    "Tietolähteiden tila|Blitzortung-tila · Tilan näyttö",
    "Kompassin valinta|Ulkoasun valinta · Ponnahdusikkuna · Kehyksen valinta · Diagnostiikkageometria",
    "Moduulit ja versiot|Ladatut moduulit · Tavoite/toteuma-vertailu · Versiotila · Moduulin tiedot · Kopioi diagnostiikka · Lataa JSON",
    "Diagnostiikka ja kalibrointi|Diagnostiikkakonsoli · Virtuaalinen ukkonen · Kompassin kalibrointi · Medaljongin kalibrointi · Suorituskyky",
    "Kompassin ulkoasu|Käytä ulkoasua · Grafiikkageometria",
    "Sijainti, säteet ja kartan käynnistys|Sijainti · Säteet · Aura · Kartan alustus",
    "Salamat ja varoitukset|Salamoiden vastaanotto · Varoitusanimaatio · Laitteen suunta",
    "Klusterit ja viimeisimmät salamat|Klusterit · Merkit · Viimeisimmät-lista · Navigointi",
    "Päärenderöinti|Tila · KPI · Listat · Käyttöliittymän synkronointi",
    "Kompassi|Liikeprofiili · Animaatio · Renderöinti",
    "Trendi ja historia|Trendin laskenta · 120 minuutin kaavio"
  ],
  "Čeština": [
    "Manifest modulů|Cílový stav · Verze produktu · Identifikátor buildu",
    "Konstanty a společné pomocné funkce|Prostředky · Konstanty · Jazyk · Základy úložiště · Geometrie · Pomocníci Leaflet",
    "Registr modulů|Samoregistrace · Kontrola cílový/skutečný · Export diagnostiky",
    "Běh modulů|Samoregistrace · Instalace metod · Předání závislostí",
    "Životní cyklus karty|Konfigurace · Připojit · Odpojit",
    "Zobrazení mapy|Standardní · Velké · Celá obrazovka · Samostatné okno · Pozice přístrojů",
    "Ochrana posouvání|Postranní panel Home Assistant · Dotyk · iPad/WebKit · Stav HA",
    "Základní struktura|HTML · CSS · Dialogy · Struktura nabídky",
    "Stupnice kompasu|Stupnice · Geometrie",
    "Vazby ovládání|Kliknutí · Dotyk · Formuláře · Akce nabídky",
    "Jazyk a nastavení|Překlad · O aplikaci · Nastavení · Texty nápovědy",
    "Stav zdrojů dat|Stav Blitzortung · Zobrazení stavu",
    "Výběr kompasu|Výběr designu · Vyskakovací okno · Výběr rámečku · Diagnostická geometrie",
    "Moduly a verze|Načtené moduly · Porovnání cílový/skutečný · Stav verzí · Podrobnosti modulů · Kopírovat diagnostiku · Stáhnout JSON",
    "Diagnostika a kalibrace|Diagnostická konzole · Virtuální bouřka · Kalibrace kompasu · Kalibrace medailonu · Výkon",
    "Design kompasu|Použít design · Grafická geometrie",
    "Poloha, poloměry a start mapy|Poloha · Poloměry · Aura · Inicializace mapy",
    "Blesky a varování|Příjem blesků · Animace varování · Orientace zařízení",
    "Shluky a poslední blesky|Shluky · Značky · Seznam posledních · Navigace",
    "Hlavní vykreslování|Stav · KPI · Seznamy · Synchronizace UI",
    "Kompas|Profil pohybu · Animace · Vykreslování",
    "Trend a historie|Výpočet trendu · 120minutový graf"
  ],
  "Ελληνικά": [
    "Δηλωτικό λειτουργικών μονάδων|Αναμενόμενη κατάσταση · Έκδοση προϊόντος · Αναγνωριστικό build",
    "Σταθερές & κοινά βοηθήματα|Πόροι · Σταθερές · Γλώσσα · Βασικά αποθήκευσης · Γεωμετρία · Βοηθήματα Leaflet",
    "Μητρώο λειτουργικών μονάδων|Αυτοεγγραφή · Έλεγχος αναμενόμενου/πραγματικού · Εξαγωγή διαγνωστικών",
    "Χρόνος εκτέλεσης λειτουργικών μονάδων|Αυτοεγγραφή · Εγκατάσταση μεθόδων · Μεταβίβαση εξαρτήσεων",
    "Κύκλος ζωής κάρτας|Διαμόρφωση · Σύνδεση · Αποσύνδεση",
    "Προβολή χάρτη|Τυπική · Μεγάλη · Πλήρης οθόνη · Ξεχωριστό παράθυρο · Θέσεις οργάνων",
    "Προστασία κύλισης|Πλευρική γραμμή Home Assistant · Αφή · iPad/WebKit · Κατάσταση HA",
    "Βασικός σκελετός διεπαφής|HTML · CSS · Διάλογοι · Δομή μενού",
    "Κλίμακα πυξίδας|Κλίμακα · Γεωμετρία",
    "Συνδέσεις χειριστηρίων|Κλικ · Αφή · Φόρμες · Ενέργειες μενού",
    "Γλώσσα & ρυθμίσεις|Μετάφραση · Πληροφορίες · Ρυθμίσεις · Κείμενα βοήθειας",
    "Κατάσταση πηγών δεδομένων|Κατάσταση Blitzortung · Ένδειξη κατάστασης",
    "Επιλογή πυξίδας|Επιλογή σχεδίου · Αναδυόμενο παράθυρο · Επιλογή πλαισίου · Διαγνωστική γεωμετρία",
    "Λειτουργικές μονάδες & εκδόσεις|Φορτωμένες λειτουργικές μονάδες · Σύγκριση αναμενόμενου/πραγματικού · Κατάσταση εκδόσεων · Λεπτομέρειες λειτουργικής μονάδας · Αντιγραφή διαγνωστικών · Λήψη JSON",
    "Διαγνωστικά & βαθμονόμηση|Κονσόλα διαγνωστικών · Εικονική καταιγίδα · Βαθμονόμηση πυξίδας · Βαθμονόμηση μεταλλίου · Επιδόσεις",
    "Σχεδίαση πυξίδας|Εφαρμογή σχεδίου · Γεωμετρία γραφικών",
    "Τοποθεσία, ακτίνες & εκκίνηση χάρτη|Τοποθεσία · Ακτίνες · Άλως · Αρχικοποίηση χάρτη",
    "Κεραυνοί & προειδοποιήσεις|Λήψη κεραυνών · Κινούμενη προειδοποίηση · Προσανατολισμός συσκευής",
    "Συστάδες & πρόσφατοι κεραυνοί|Συστάδες · Δείκτες · Λίστα πρόσφατων · Πλοήγηση",
    "Κύρια απόδοση|Κατάσταση · KPI · Λίστες · Συγχρονισμός διεπαφής",
    "Πυξίδα|Προφίλ κίνησης · Κίνηση · Απόδοση",
    "Τάση & ιστορικό|Υπολογισμός τάσης · Διάγραμμα 120 λεπτών"
  ],
  "Magyar": [
    "Moduljegyzék|Célállapot · Termékverzió · Buildazonosító",
    "Konstansok és közös segédfunkciók|Erőforrások · Konstansok · Nyelv · Tárolási alapok · Geometria · Leaflet-segédek",
    "Modulregiszter|Önregisztráció · Cél/tényleges ellenőrzés · Diagnosztikai export",
    "Modulfuttatás|Önregisztráció · Metódustelepítés · Függőségek átadása",
    "Kártya életciklusa|Konfiguráció · Csatlakozás · Leválasztás",
    "Térképmegjelenítés|Normál · Nagy · Teljes képernyő · Külön ablak · Műszerpozíciók",
    "Görgetésvédelem|Home Assistant oldalsáv · Érintés · iPad/WebKit · HA-állapot",
    "Alapszerkezet|HTML · CSS · Párbeszédablakok · Menüstruktúra",
    "Iránytűskála|Skála · Geometria",
    "Vezérlési kötések|Kattintás · Érintés · Űrlapok · Menüparancsok",
    "Nyelv és beállítások|Fordítás · Névjegy · Beállítások · Súgószövegek",
    "Adatforrások állapota|Blitzortung-állapot · Állapotjelzés",
    "Iránytű kiválasztása|Kialakítás választása · Felugró ablak · Keretválasztás · Diagnosztikai geometria",
    "Modulok és verziók|Betöltött modulok · Cél/tényleges összehasonlítás · Verzióállapot · Modulrészletek · Diagnosztika másolása · JSON letöltése",
    "Diagnosztika és kalibrálás|Diagnosztikai konzol · Virtuális vihar · Iránytű kalibrálása · Medál kalibrálása · Teljesítmény",
    "Iránytű kialakítása|Kialakítás alkalmazása · Grafikai geometria",
    "Hely, sugarak és térképindítás|Hely · Sugarak · Aura · Térkép inicializálása",
    "Villámok és figyelmeztetések|Villámfogadás · Figyelmeztető animáció · Eszköz tájolása",
    "Klaszterek és legutóbbi villámok|Klaszterek · Jelölők · Legutóbbi lista · Navigáció",
    "Fő renderelés|Állapot · KPI · Listák · Felület szinkronizálása",
    "Iránytű|Mozgásprofil · Animáció · Renderelés",
    "Trend és előzmények|Trendszámítás · 120 perces diagram"
  ],
  "Boarisch": [
    "Modulmanifest|Sollstand · Produktversion · Build-Kennung",
    "Konstantn & gemeinsame Helfer|Assets · Konstantn · Sprach · Speichergrundlagn · Geometrie · Leaflet-Helfer",
    "Modulregister|Selbstregistrierung · Soll/Ist-Prüfung · Diagnoseexport",
    "Modul-Laufzeit|Selbstregistrierung · Methodeninstallation · Abhängigkeiten übergem",
    "Kartn-Lebenszyklus|Konfiguration · Verbinden · Trennen",
    "Kartndarstellung|Standard · Groß · Vollbild · eigenes Fenster · Instrumentpositionen",
    "Scrollschutz|Home-Assistant-Seitenleiste · Touch · iPad/WebKit · HA-Status",
    "Grundgerüst|HTML · CSS · Dialoge · Menüstruktur",
    "Kompass-Skala|Skala · Geometrie",
    "Bedienbindungen|Klick · Touch · Formulare · Menüaktionen",
    "Sprach & Einstellungen|Übersetzung · Über · Einstellungen · Hilfetexte",
    "Datenquellenstatus|Blitzortung-Status · Statusanzeige",
    "Kompassauswahl|Designauswahl · Popup · Rahmenauswahl · Diagnosegeometrie",
    "Module & Versionen|Geladene Module · Soll/Ist-Vergleich · Versionsstatus · Modul-Details · Diagnose kopiern · JSON runterladn",
    "Diagnose & Kalibrierung|Diagnosekonsole · Virtuelles Gewitter · Kompass-Kalibrierung · Medaillon-Kalibrierung · Leistung",
    "Kompassdesign|Design anwenden · Grafikgeometrie",
    "Standort, Radien & Kartnstart|Standort · Radien · Aura · Kartninitialisierung",
    "Blitze & Warnungen|Blitzaufnahme · Warnanimation · Geräteorientierung",
    "Cluster & letzte Blitze|Cluster · Marker · Letzte-Liste · Navigation",
    "Hauptrendering|Status · KPI · Listen · UI-Synchronisierung",
    "Kompass|Bewegungsprofil · Animation · Rendering",
    "Trend & Verlauf|Trendberechnung · 120-Minuten-Diagramm"
  ],
  "Plattdüütsch": [
    "Modulmanifest|Sollstand · Produktverschoon · Build-Kennen",
    "Konstanten un tosamen Hülpers|Assets · Konstanten · Spraak · Spiekergrundlagen · Geometrie · Leaflet-Hülpers",
    "Modulregister|Sülvstregistreren · Soll/Ist-Prööv · Diagnoseexport",
    "Modul-Lööptiet|Sülvstregistreren · Methoden installern · Afhängigkeiten övergeven",
    "Koort-Levensloop|Instellen · Verbinden · Trennen",
    "Koortdarstellung|Standard · Groot · Vullbild · egen Finster · Instrumentpositschonen",
    "Rullschutz|Home-Assistant-Sietbalken · Touch · iPad/WebKit · HA-Status",
    "Grundgerüst|HTML · CSS · Dialogen · Menüstruktur",
    "Kompass-Skala|Skala · Geometrie",
    "Bedienbinnen|Klick · Touch · Formularen · Menüaktionen",
    "Spraak un Instellen|Översetten · Över · Instellen · Hülptexten",
    "Datenquellenstatus|Blitzortung-Status · Statuswiesen",
    "Kompassutwahl|Designutwahl · Popup · Rahmenutwahl · Diagnosegeometrie",
    "Modulen un Verschoonen|Laden Modulen · Soll/Ist-Vergliek · Verschoonstatus · Modul-Details · Diagnose koperen · JSON dalladen",
    "Diagnose un Kalibreren|Diagnosekonsole · Virtuell Gewitter · Kompass-Kalibreren · Medaillon-Kalibreren · Leistung",
    "Kompassdesign|Design anwennen · Grafikgeometrie",
    "Steed, Radien un Koortstart|Steed · Radien · Aura · Koort initialiseren",
    "Blitze un Wohrschoen|Blitzopnahm · Wohrschoon-Animation · Reedschap-Utrichten",
    "Cluster un letzte Blitze|Cluster · Marker · Letzte-Liest · Navigation",
    "Hööftrendering|Status · KPI · Listen · UI-Synchroniseren",
    "Kompass|Bewegungsprofil · Animation · Rendering",
    "Trend un Verlauf|Trendbereken · 120-Minuten-Diagramm"
  ],
  "Sächs’sch": [
    "Modulmanifest|Sollstand · Produktversion · Buildkennung",
    "Konstanten un gemeinsame Helfer|Assets · Konstanten · Sprache · Speichergrundlagen · Geometrie · Leaflet-Helfer",
    "Modulregister|Selbstregistrierung · Soll/Ist-Prüfung · Diagnoseexport",
    "Modul-Laufzeit|Selbstregistrierung · Methodeninstallation · Abhängigkeiten weitergeben",
    "Karten-Lebenszyklus|Konfiguration · Verbinden · Trennen",
    "Kartendarstellung|Standard · Groß · Vollbild · eignes Fenster · Instrumentpositionen",
    "Scrollschutz|Home-Assistant-Seitenleiste · Touch · iPad/WebKit · HA-Status",
    "Grundgerüst|HTML · CSS · Dialoge · Menüstruktur",
    "Gombass-Skala|Skala · Geometrie",
    "Bedienbindungen|Klick · Touch · Formulare · Menüaktionen",
    "Sprache un Einstellungen|Übersetzung · Über · Einstellungen · Hilfetexte",
    "Datenquellenstatus|Blitzortung-Status · Statusanzeige",
    "Gombassauswahl|Designauswahl · Popup · Rahmenauswahl · Diagnosegeometrie",
    "Module un Versionen|Geladene Module · Soll/Ist-Vergleich · Versionsstatus · Modul-Details · Diagnose kopiern · JSON runterladen",
    "Diagnose un Kalibrierung|Diagnosekonsole · Virtuelles Gewitter · Gombass-Kalibrierung · Medaillon-Kalibrierung · Leistung",
    "Gombassdesign|Design anwenden · Grafikgeometrie",
    "Standort, Radien un Kartenstart|Standort · Radien · Aura · Karteninitialisierung",
    "Blitze un Warnungen|Blitzaufnahme · Warnanimation · Geräteorientierung",
    "Cluster un letzte Blitze|Cluster · Marker · Letzte-Liste · Navigation",
    "Hauptrendering|Status · KPI · Listen · UI-Synchronisierung",
    "Gombass|Bewegungsprofil · Animation · Rendering",
    "Trend un Verlauf|Trendberechnung · 120-Minuten-Diagramm"
  ],
  "Schwäbisch": [
    "Modulmanifest|Sollstand · Produktversion · Buildkennung",
    "Konstanta ond gemeinsame Helfer|Assets · Konstanta · Sproch · Speichergrundlaga · Geometrie · Leaflet-Helfer",
    "Modulregister|Selbstregistrierung · Soll/Ist-Prüfung · Diagnoseexport",
    "Modul-Laufzeit|Selbstregistrierung · Methodeninstallation · Abhängigkeit weitergeba",
    "Karta-Lebenszyklus|Konfiguration · Verbinda · Trenna",
    "Kartadarstellung|Standard · Groß · Vollbild · eiges Fenster · Instrumentpositiona",
    "Scrollschutz|Home-Assistant-Seitenleiste · Touch · iPad/WebKit · HA-Status",
    "Grundgerüst|HTML · CSS · Dialoge · Menüstruktur",
    "Kompass-Skala|Skala · Geometrie",
    "Bedienbindungen|Klick · Touch · Formulare · Menüaktiona",
    "Sproch ond Einstellungen|Übersetzung · Über · Einstellungen · Hilfetexte",
    "Datenquellenstatus|Blitzortung-Status · Statusanzeige",
    "Kompassauswahl|Designauswahl · Popup · Rahmenauswahl · Diagnosegeometrie",
    "Module ond Versiona|Geladene Module · Soll/Ist-Vergleich · Versionsstatus · Modul-Details · Diagnose kopiera · JSON runterlada",
    "Diagnose ond Kalibrierung|Diagnosekonsole · Virtuelles Gewitter · Kompass-Kalibrierung · Medaillon-Kalibrierung · Leistung",
    "Kompassdesign|Design anwenda · Grafikgeometrie",
    "Standort, Radia ond Kartastart|Standort · Radia · Aura · Kartainitialisierung",
    "Blitz ond Warnunga|Blitzaufnahme · Warnanimation · Geräteorientierung",
    "Cluster ond letzte Blitz|Cluster · Marker · Letzte-Liste · Navigation",
    "Hauptrendering|Status · KPI · Lista · UI-Synchronisierung",
    "Kompass|Bewegungsprofil · Animation · Rendering",
    "Trend ond Verlauf|Trendberechnung · 120-Minuta-Diagramm"
  ]
});
  const modulePresentation=(language,row)=>{
    const index=MODULE_VIEW_IDS.indexOf(row?.id);
    const table=MODULE_VIEW_META[language]||MODULE_VIEW_META.Deutsch;
    const packed=index>=0?table?.[index]:null;
    if(!packed)return {name:row?.function||row?.id||"—",functions:(row?.subfunctions||[]).join(" · ")||"—"};
    const divider=packed.indexOf("|");
    return divider<0
      ? {name:packed,functions:(row?.subfunctions||[]).join(" · ")||"—"}
      : {name:packed.slice(0,divider),functions:packed.slice(divider+1)||"—"};
  };


  return {
    _ensureModuleView(){
      if(!this.shadow)return null;
      let section=this.shadow.getElementById("settings-modules-section");
      if(section)return section;

      section=document.createElement("details");
      section.className="settings-section settings-collapsible";
      section.id="settings-modules-section";
      section.innerHTML=`
        <summary class="settings-section-head">
          <div>
            <div class="settings-section-title" id="settings-modules-title">Module &amp; Versionen</div>
            <div class="settings-section-sub" id="settings-modules-subtitle">Status der tatsächlich geladenen Komponenten</div>
          </div>
        </summary>
        <div class="settings-section-content gr-mod-compact-content">
          <style>
            #settings-modules-section .gr-mod-compact-content{padding:10px 12px 12px;overflow:visible!important;max-height:none!important}
            #settings-modules-section .gr-mod-summary{display:grid;gap:4px;padding:10px 11px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.025);font-size:9px}
            #settings-modules-section .gr-mod-summary strong{font-size:11px;color:#e9edf3}
            #settings-modules-section .gr-mod-state{font-weight:850}
            #settings-modules-section button.gr-mod-state{appearance:none;border:0;padding:0;background:transparent;font:inherit;text-align:left;cursor:pointer;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:2px}
            #settings-modules-section button.gr-mod-state:focus-visible{outline:2px solid rgba(255,225,161,.92);outline-offset:2px;border-radius:4px}
            #settings-modules-section .gr-mod-state[data-state="ok"]{color:#78d59b}
            #settings-modules-section .gr-mod-state[data-state="warn"]{color:#e0b44f}#settings-modules-section .gr-mod-fingerprint{font:800 8.5px/1.35 ui-monospace,SFMono-Regular,Consolas,monospace;color:#78d59b;letter-spacing:.02em}#settings-modules-section .gr-mod-fingerprint[data-state="warn"]{color:#e0b44f}
            #settings-modules-section .gr-mod-summary-compact{grid-template-columns:minmax(0,1fr) auto;align-items:center;column-gap:14px}
            #settings-modules-section .gr-mod-summary-copy{display:grid;gap:4px;min-width:0}
            #settings-modules-section .gr-mod-details-button,
            .gr-module-dialog .gr-mod-action{appearance:none;border:1px solid rgba(214,180,95,.42);border-radius:999px;padding:8px 13px;background:linear-gradient(180deg,rgba(205,158,64,.16),rgba(113,78,24,.12));color:#f0d58e;font-size:8.5px;font-weight:850;letter-spacing:.02em;cursor:pointer;box-shadow:inset 0 1px rgba(255,244,213,.07),0 0 10px rgba(208,158,55,.04)}
            #settings-modules-section .gr-mod-details-button:focus-visible,
            .gr-module-dialog .gr-mod-action:focus-visible{outline:2px solid rgba(255,225,161,.92);outline-offset:2px}
            @media(hover:hover) and (pointer:fine){#settings-modules-section .gr-mod-details-button:hover,.gr-module-dialog .gr-mod-action:hover{filter:brightness(1.12)}}
            @media(max-width:540px){#settings-modules-section .gr-mod-summary-compact{grid-template-columns:1fr;row-gap:9px}#settings-modules-section .gr-mod-summary-compact .gr-mod-details-button{justify-self:end}}

            .gr-module-backdrop{position:fixed;inset:0;z-index:2147483646;display:none;align-items:center;justify-content:center;padding:clamp(10px,2.5vw,28px);background:radial-gradient(circle at 50% 30%,rgba(31,44,66,.28),rgba(4,7,12,.76) 60%,rgba(1,2,4,.9) 100%);backdrop-filter:blur(10px) saturate(.86);-webkit-backdrop-filter:blur(10px) saturate(.86);overscroll-behavior:contain}
            .gr-module-backdrop.open{display:flex;animation:settingsBackdropIn .18s ease-out both}
            .gr-module-dialog{display:flex;flex-direction:column;width:min(660px,calc(100vw - 32px));max-height:min(760px,calc(100dvh - 32px));overflow:hidden;border:2px solid transparent;border-radius:22px;color:var(--b-text);background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%) padding-box,linear-gradient(180deg,rgb(20,28,38),rgb(7,12,18)) padding-box,linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c) border-box;box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,236,181,.08),0 0 22px rgba(215,164,67,.06)}
            .gr-module-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:13px 16px 11px;border-bottom:1px solid rgba(255,255,255,.07);background:linear-gradient(180deg,rgb(17,23,32),rgb(14,20,28))}
            .gr-module-kicker{color:var(--b-gold);font-size:8px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
            .gr-module-title{margin-top:2px;font-size:18px;line-height:1.05;font-weight:850;letter-spacing:-.02em}
            .gr-module-close{display:grid;place-items:center;flex:0 0 44px;width:44px;height:44px;padding:0;border:0;background:transparent;cursor:pointer}
            .gr-module-close img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;user-select:none;-webkit-user-drag:none}
            .gr-module-close:focus-visible{outline:2px solid rgba(255,225,161,.92);outline-offset:1px;border-radius:9px}
            .gr-module-body{min-height:0;overflow:auto;padding:14px 16px 18px;overscroll-behavior:contain}
            .gr-module-dialog .gr-mod-summary{display:flex;align-items:center;flex-wrap:wrap;gap:5px 8px;margin-bottom:12px;padding:10px 11px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.025);font-size:9px}
            .gr-module-dialog .gr-mod-summary strong{font-size:11px;color:#e9edf3}
            .gr-module-dialog .gr-mod-summary .gr-mod-state{font-weight:850}
            .gr-module-dialog .gr-mod-summary .gr-mod-state[data-state="ok"]{color:#78d59b}
            .gr-module-dialog .gr-mod-summary .gr-mod-state[data-state="warn"]{color:#e0b44f}.gr-module-dialog .gr-mod-fingerprint{font:800 8.5px/1.35 ui-monospace,SFMono-Regular,Consolas,monospace;color:#78d59b;letter-spacing:.02em}.gr-module-dialog .gr-mod-fingerprint[data-state="warn"]{color:#e0b44f}
            .gr-module-dialog .gr-mod-group{margin-top:13px}
            .gr-module-dialog .gr-mod-group:first-of-type{margin-top:0}
            .gr-module-dialog .gr-mod-group-title{padding:0 3px 6px;color:#d6b45f;font-size:8.5px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}
            .gr-module-dialog .gr-mod-row{margin:0 0 5px;border:1px solid rgba(255,255,255,.055);border-radius:11px;background:rgba(255,255,255,.018);overflow:hidden}
            .gr-module-dialog .gr-mod-row>summary{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;padding:9px 11px;cursor:pointer;list-style:none}
            .gr-module-dialog .gr-mod-row>summary::-webkit-details-marker{display:none}
            .gr-module-dialog .gr-mod-row>summary::after{content:'';grid-column:2;width:8px;height:8px;margin:2px 3px 0 8px;border-right:1.5px solid #b99449;border-bottom:1.5px solid #b99449;transform:rotate(45deg);transition:transform .15s ease}
            .gr-module-dialog .gr-mod-row[open]>summary::after{transform:rotate(225deg);margin-top:6px}
            .gr-module-dialog .gr-mod-heading{min-width:0;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
            .gr-module-dialog .gr-mod-name{font-size:10px;font-weight:820;color:#e0e5ec}
            .gr-module-dialog .gr-mod-id{font:7.5px/1.2 ui-monospace,SFMono-Regular,Consolas,monospace;color:#7f8996;overflow-wrap:anywhere}
            .gr-module-dialog .gr-mod-version{grid-column:2;grid-row:1;text-align:right;font:800 9px/1.35 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:nowrap;margin-right:22px}
            .gr-module-dialog .gr-mod-version[data-state="ok"]{color:#78d59b}
            .gr-module-dialog .gr-mod-version[data-state="version_mismatch"],.gr-module-dialog .gr-mod-version[data-state="unexpected"]{color:#e0b44f}
            .gr-module-dialog .gr-mod-version[data-state="missing"]{color:#ef7777}
            .gr-module-dialog .gr-mod-detail{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:4px 12px;padding:0 11px 11px;border-top:1px solid rgba(255,255,255,.045);font-size:8px;line-height:1.4;color:#9aa3af}
            .gr-module-dialog .gr-mod-detail dt{color:#6f7884;font-weight:800}
            .gr-module-dialog .gr-mod-detail dd{margin:0;overflow-wrap:anywhere}
            .gr-module-dialog .gr-mod-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:13px;border-top:1px solid rgba(255,255,255,.06)}
            .gr-deviation-backdrop{z-index:2147483647}
            .gr-deviation-list{display:grid;gap:9px}
            .gr-deviation-card{padding:11px 12px;border:1px solid rgba(224,180,79,.25);border-radius:13px;background:linear-gradient(180deg,rgba(224,180,79,.055),rgba(255,255,255,.018));box-shadow:inset 0 1px rgba(255,244,213,.035)}
            .gr-deviation-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}
            .gr-deviation-title{min-width:0}
            .gr-deviation-title strong{display:block;color:#e5e9ef;font-size:10.5px}
            .gr-deviation-title code{display:block;margin-top:2px;color:#7f8996;font:7.8px/1.3 ui-monospace,SFMono-Regular,Consolas,monospace;overflow-wrap:anywhere}
            .gr-deviation-badge{flex:0 0 auto;padding:4px 7px;border:1px solid rgba(224,180,79,.35);border-radius:999px;color:#e0b44f;background:rgba(224,180,79,.08);font-size:7.5px;font-weight:900}
            .gr-deviation-detail{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:4px 11px;margin:0;font-size:8px;line-height:1.45;color:#a0a9b5}
            .gr-deviation-detail dt{font-weight:850;color:#6f7884}.gr-deviation-detail dd{margin:0;overflow-wrap:anywhere}
            .gr-deviation-note{margin-top:8px;padding:7px 8px;border-left:2px solid rgba(120,213,155,.65);background:rgba(120,213,155,.045);color:#92cfa8;font-size:8px;line-height:1.4}
            .gr-deviation-registrations{display:grid;gap:5px;margin-top:8px}
            .gr-deviation-registration{padding:7px 8px;border:1px solid rgba(255,255,255,.055);border-radius:9px;background:rgba(0,0,0,.12);font:7.5px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace;color:#8e98a6;overflow-wrap:anywhere}
            @media(max-width:620px){.gr-module-backdrop{padding:7px}.gr-module-dialog{width:calc(100vw - 14px);max-height:calc(100dvh - 14px);border-radius:17px}.gr-module-head{padding:10px 11px}.gr-module-title{font-size:16px}.gr-module-body{padding:11px 10px 14px}.gr-module-dialog .gr-mod-row>summary{gap:7px;padding:9px}.gr-module-dialog .gr-mod-heading{display:grid;gap:2px}.gr-module-dialog .gr-mod-detail{grid-template-columns:1fr;gap:2px;padding:0 9px 10px}.gr-module-dialog .gr-mod-detail dd{margin-bottom:5px}}
          </style>
          <div class="gr-mod-summary gr-mod-summary-compact">
            <div id="settings-modules-summary" class="gr-mod-summary-copy"></div>
            <button id="settings-modules-details" class="gr-mod-details-button" type="button">Modul-Details</button>
          </div>
        </div>
        <div id="settings-modules-backdrop" class="gr-module-backdrop" aria-hidden="true">
          <section class="gr-module-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-modules-dialog-title" tabindex="-1">
            <header class="gr-module-head">
              <div>
                <div class="gr-module-kicker" id="settings-modules-kicker">Gewitterradar · Diagnose</div>
                <div class="gr-module-title" id="settings-modules-dialog-title">Modul-Details</div>
              </div>
              <button id="settings-modules-close" class="gr-module-close" type="button" aria-label="Modul-Details schließen"><img src="${ABOUT_CLOSE_IMAGE}" alt="" width="34" height="34" draggable="false"></button>
            </header>
            <div class="gr-module-body">
              <div id="settings-modules-dialog-summary" class="gr-mod-summary"></div>
              <div id="settings-modules-list"></div>
              <div class="gr-mod-actions">
                <button id="settings-modules-copy" class="gr-mod-action" type="button">Diagnose kopieren</button>
                <button id="settings-modules-download" class="gr-mod-action" type="button">JSON herunterladen</button>
              </div>
            </div>
          </section>
        </div>
        <div id="settings-modules-deviations-backdrop" class="gr-module-backdrop gr-deviation-backdrop" aria-hidden="true">
          <section class="gr-module-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-modules-deviations-title" tabindex="-1">
            <header class="gr-module-head">
              <div>
                <div class="gr-module-kicker">Gewitterradar · Diagnose</div>
                <div class="gr-module-title" id="settings-modules-deviations-title">Abweichungen</div>
              </div>
              <button id="settings-modules-deviations-close" class="gr-module-close" type="button" aria-label="Abweichungen schließen"><img src="${ABOUT_CLOSE_IMAGE}" alt="" width="34" height="34" draggable="false"></button>
            </header>
            <div class="gr-module-body">
              <div id="settings-modules-deviations-summary" class="gr-mod-summary"></div>
              <div id="settings-modules-deviations-list" class="gr-deviation-list"></div>
              <div class="gr-mod-actions">
                <button id="settings-modules-deviations-copy" class="gr-mod-action" type="button">Diagnose kopieren</button>
                <button id="settings-modules-deviations-download" class="gr-mod-action" type="button">JSON herunterladen</button>
              </div>
            </div>
          </section>
        </div>`;

      const diagnostic=this.shadow.getElementById("settings-diagnostic-section");
      const body=this.shadow.querySelector(".settings-body");
      if(diagnostic)diagnostic.after(section);else body?.append(section);
      this._registerSettingsAccordionSection?.(section);

      section.querySelector("#settings-modules-details")?.addEventListener("click",()=>this._openModuleDetails());
      section.querySelector("#settings-modules-close")?.addEventListener("click",()=>this._closeModuleDetails());
      section.querySelector("#settings-modules-copy")?.addEventListener("click",()=>this._copyModuleDiagnostics());
      section.querySelector("#settings-modules-download")?.addEventListener("click",()=>this._downloadModuleDiagnostics());
      section.querySelector("#settings-modules-deviations-copy")?.addEventListener("click",()=>this._copyModuleDeviationDiagnostics());
      section.querySelector("#settings-modules-deviations-download")?.addEventListener("click",()=>this._downloadModuleDeviationDiagnostics());
      section.querySelector("#settings-modules-deviations-close")?.addEventListener("click",()=>this._closeModuleDeviations());
      const backdrop=section.querySelector("#settings-modules-backdrop");
      const deviationBackdrop=section.querySelector("#settings-modules-deviations-backdrop");
      backdrop?.addEventListener("click",event=>{if(event.target===backdrop)this._closeModuleDetails();});
      backdrop?.addEventListener("keydown",event=>{if(event.key==="Escape"){event.preventDefault();this._closeModuleDetails();}});
      deviationBackdrop?.addEventListener("click",event=>{if(event.target===deviationBackdrop)this._closeModuleDeviations();});
      deviationBackdrop?.addEventListener("keydown",event=>{if(event.key==="Escape"){event.preventDefault();this._closeModuleDeviations();}});
      if(backdrop)this.shadow.append(backdrop);
      if(deviationBackdrop)this.shadow.append(deviationBackdrop);
      section.addEventListener("toggle",event=>{if(event.target===section&&section.open)this._syncModuleView();});
      this._syncModuleTranslations(section);
      return section;
    },

    _syncModuleTranslations(section=this.shadow?.getElementById("settings-modules-section")){
      if(!section)return;
      const setText=(selector,key,root=section)=>{const el=root?.querySelector?.(selector);if(el)el.textContent=this._t?.(key)||key;};
      setText("#settings-modules-title","modules.title");
      setText("#settings-modules-subtitle","modules.subtitle");
      setText("#settings-modules-details","modules.details");
      const backdrop=this.shadow?.getElementById("settings-modules-backdrop");
      setText("#settings-modules-kicker","modules.kicker",backdrop);
      setText("#settings-modules-dialog-title","modules.details",backdrop);
      setText("#settings-modules-copy","modules.copy",backdrop);
      setText("#settings-modules-download","modules.download",backdrop);
      const close=backdrop?.querySelector?.("#settings-modules-close");
      if(close)close.setAttribute("aria-label",this._t?.("modules.close")||"modules.close");
      const deviationBackdrop=this.shadow?.getElementById("settings-modules-deviations-backdrop");
      setText("#settings-modules-deviations-copy","modules.copy",deviationBackdrop);
      setText("#settings-modules-deviations-download","modules.download",deviationBackdrop);
      const deviationClose=deviationBackdrop?.querySelector?.("#settings-modules-deviations-close");
      if(deviationClose)deviationClose.setAttribute("aria-label",this._t?.("modules.close")||"modules.close");
    },

    _moduleStatusLabel(status){
      const key={
        ok:"modules.status.ok",
        missing:"modules.status.missing",
        version_mismatch:"modules.status.version_mismatch",
        unexpected:"modules.status.unexpected",
        duplicate:"modules.status.duplicate"
      }[status];
      return key?(this._t?.(key)||status):status;
    },

    _moduleDeviationIssues(result=moduleRegistrySnapshot(EXPECTED_MODULES)){
      const issues=[];
      for(const row of result?.rows||[]){
        if(row.status!=="ok")issues.push({type:row.status,id:row.id,row});
      }
      for(const duplicate of result?.duplicateDetails||[]){
        const row=(result?.rows||[]).find(item=>item.id===duplicate.id)||null;
        issues.push({type:"duplicate",id:duplicate.id,count:duplicate.count,registrations:duplicate.registrations||[],row});
      }
      const probe=this._moduleRuntimeProbe||null;
      if(probe?.stale)issues.push({type:"runtime_stale",id:"runtime",runtimeProbe:probe});
      return issues;
    },

    _moduleDiagnosticsPayload(){
      return {application:APPLICATION_META,capturedAt:new Date().toISOString(),runtimeProbe:this._moduleRuntimeProbe||null,diagnostics:moduleRegistrySnapshot(EXPECTED_MODULES)};
    },

    _moduleDeviationPayload(){
      const diagnostics=moduleRegistrySnapshot(EXPECTED_MODULES);
      const issues=this._moduleDeviationIssues(diagnostics);
      return {
        application:APPLICATION_META,
        capturedAt:new Date().toISOString(),
        runtimeProbe:this._moduleRuntimeProbe||null,
        summary:{
          loadedCount:diagnostics.loadedCount,
          expectedCount:diagnostics.expectedCount,
          issueCount:issues.length,
          moduleSetId:this._moduleRuntimeProbe?.loadedId||APPLICATION_META.moduleSetId||null,
        },
        deviations:issues
      };
    },

    _refreshModuleRuntimeProbe(result){
      const loadedId=moduleSetFingerprint(result.rows,"loadedVersion");
      const expectedId=moduleSetFingerprint(result.rows,"expectedVersion");
      const localRevision=APPLICATION_META.runtimeRevision||APPLICATION_META.build||APPLICATION_META.version;
      const signature=`${localRevision}|${loadedId}|${expectedId}`;
      if(this._moduleRuntimeProbePending===signature)return;
      if(this._moduleRuntimeProbe?.signature===signature&&Date.now()-(this._moduleRuntimeProbe.checkedAt||0)<5000)return;
      this._moduleRuntimeProbePending=signature;
      const probeUrl=new URL(moduleRuntimeManifestUrl());probeUrl.searchParams.set("_gr_probe",String(Date.now()));
      fetch(probeUrl.href,{cache:"no-store",credentials:"same-origin"}).then(response=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json();}).then(manifest=>{
        const installedId=String(manifest?.moduleSetId||"").trim(),installedRevision=String(manifest?.runtimeRevision||"").trim();
        this._moduleRuntimeProbe={available:Boolean(installedId),signature,checkedAt:Date.now(),loadedId,expectedId,installedId,installedRevision,localRevision:String(localRevision||""),stale:Boolean((installedId&&installedId!==loadedId)||(installedRevision&&String(localRevision||"")&&installedRevision!==String(localRevision)))};
      }).catch(error=>{
        this._moduleRuntimeProbe={available:false,signature,checkedAt:Date.now(),loadedId,expectedId,installedId:"",installedRevision:"",localRevision:String(localRevision||""),stale:false,error:error instanceof Error?error.message:String(error)};
      }).finally(()=>{
        if(this._moduleRuntimeProbePending===signature)this._moduleRuntimeProbePending=null;
        const current=moduleDiagnostics(EXPECTED_MODULES);
        this._renderModuleSummary(this.shadow?.getElementById("settings-modules-summary"),current);
        this._renderModuleSummary(this.shadow?.getElementById("settings-modules-dialog-summary"),current);
      });
    },

    _renderModuleSummary(target,result){
      if(!target)return;
      const issueCount=result.rows.filter(row=>row.status!=="ok").length+result.duplicateIds.length;
      const loadedId=moduleSetFingerprint(result.rows,"loadedVersion"),probe=this._moduleRuntimeProbe,runtimeStale=Boolean(probe?.stale);
      const installedId=probe?.installedId||APPLICATION_META.moduleSetId||moduleSetFingerprint(result.rows,"expectedVersion");
      target.replaceChildren();
      const title=document.createElement("strong");title.textContent=`Gewitterradar ${APPLICATION_META.displayVersion}`;
      const counts=document.createElement("span");counts.textContent=`· ${this._t?.("modules.loaded",{loaded:result.loadedCount,expected:result.expectedCount})||`${result.loadedCount} / ${result.expectedCount}`}`;
      const hasIssue=Boolean(issueCount||runtimeStale);
      const state=document.createElement(hasIssue?"button":"span");state.className="gr-mod-state";state.dataset.state=hasIssue?"warn":"ok";
      if(state.tagName==="BUTTON"){state.type="button";state.classList.add("gr-mod-deviation-trigger");state.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();this._openModuleDeviations();});}
      state.textContent=issueCount?`· ! ${this._t?.("modules.deviations",{count:issueCount})||issueCount}`:runtimeStale?`· ! ${this._t?.("modules.runtime_stale")||"Frontend-Neuladung erforderlich"}`:`· ✓ ${this._t?.("modules.consistent")||"modules.consistent"}`;
      const fingerprint=document.createElement("span");fingerprint.className="gr-mod-fingerprint";fingerprint.dataset.state=runtimeStale?"warn":"ok";
      fingerprint.textContent=runtimeStale?`· ${this._t?.("modules.set_id")||"ID"} ${loadedId} → ${installedId}`:`· ${this._t?.("modules.set_id")||"ID"} ${loadedId}`;
      fingerprint.title=runtimeStale?`${this._t?.("modules.detail.loaded")||"Loaded"}: ${loadedId} · ${this._t?.("modules.installed")||"Installed"}: ${installedId}`:`${this._t?.("modules.set_id")||"ID"}: ${loadedId}`;
      target.append(title,counts,state,fingerprint);
    },

    _moduleListSignature(result){
      const language=this._languageValue?.()||"";
      return JSON.stringify({
        language,
        duplicates:[...(result.duplicateIds||[])].sort(),
        rows:(result.rows||[]).map(row=>[
          row.id,row.status,row.loadedVersion||"",row.expectedVersion||"",row.loadedAt||"",
          row.group||"",row.function||"",row.file||"",(row.subfunctions||[]).join("|")
        ])
      });
    },

    _renderModuleList(target,result){
      if(!target)return;
      const openIds=new Set([...target.querySelectorAll(".gr-mod-row[open]")].map(item=>item.dataset.moduleId).filter(Boolean));
      target.replaceChildren();
      const grouped=new Map();
      for(const row of result.rows){
        const group=row.group||"Sonstige";
        if(!grouped.has(group))grouped.set(group,[]);
        grouped.get(group).push(row);
      }
      const groups=[...grouped.entries()].sort((a,b)=>groupPriority(a[0])-groupPriority(b[0])||a[0].localeCompare(b[0],"de"));
      for(const [group,rows] of groups){
        const block=document.createElement("div");
        block.className="gr-mod-group";
        const groupTitle=document.createElement("div");
        groupTitle.className="gr-mod-group-title";
        groupTitle.textContent=this._t?.(groupTranslationKey(group))||group;
        block.append(groupTitle);
        for(const row of rows.sort((a,b)=>modulePresentation(this._languageValue?.()||"Deutsch",a).name.localeCompare(modulePresentation(this._languageValue?.()||"Deutsch",b).name,this._locale?.()||"de"))){
          const item=document.createElement("details");
          item.className="gr-mod-row";
          item.dataset.moduleId=row.id;
          item.open=openIds.has(row.id);
          item.addEventListener("toggle",event=>event.stopPropagation());

          const head=document.createElement("summary");
          const heading=document.createElement("div");
          heading.className="gr-mod-heading";
          const presentation=modulePresentation(this._languageValue?.()||"Deutsch",row);
          const name=document.createElement("span");
          name.className="gr-mod-name";name.textContent=presentation.name;
          const id=document.createElement("span");
          id.className="gr-mod-id";id.textContent=row.id;
          heading.append(name,id);

          const version=document.createElement("div");
          version.className="gr-mod-version";
          version.dataset.state=row.status;
          const loaded=row.loadedVersion||"—";
          version.textContent=`${statusSymbol(row.status)} ${loaded}`;
          version.title=`${this._t?.("modules.detail.status")||"Status"}: ${this._moduleStatusLabel(row.status)} · ${this._t?.("modules.detail.expected")||"Expected"}: ${row.expectedVersion||"—"} · ${this._t?.("modules.detail.loaded")||"Loaded"}: ${loaded}`;
          head.append(heading,version);

          const detail=document.createElement("dl");
          detail.className="gr-mod-detail";
          const appendDetail=(label,value)=>{
            const dt=document.createElement("dt");dt.textContent=label;
            const dd=document.createElement("dd");dd.textContent=value||"—";
            detail.append(dt,dd);
          };
          appendDetail(this._t?.("modules.detail.status")||"Status",this._moduleStatusLabel(row.status));
          appendDetail(this._t?.("modules.detail.version")||"Version",loaded);
          appendDetail(this._t?.("modules.detail.expected")||"Expected",row.expectedVersion||"—");
          appendDetail(this._t?.("modules.detail.file")||"File",row.file||"—");
          appendDetail(this._t?.("modules.detail.loaded")||"Loaded",row.loadedAt||"—");
          appendDetail(this._t?.("modules.detail.functions")||"Functions",presentation.functions);

          item.append(head,detail);
          block.append(item);
        }
        target.append(block);
      }
    },

    _syncModuleView({forceList=false}={}){
      const section=this._ensureModuleView();if(!section)return;
      this._syncModuleTranslations(section);
      const result=moduleDiagnostics(EXPECTED_MODULES);
      this._renderModuleSummary(section.querySelector("#settings-modules-summary"),result);
      this._renderModuleSummary(this.shadow?.getElementById("settings-modules-dialog-summary"),result);
      if(this.shadow?.getElementById("settings-modules-deviations-backdrop")?.classList.contains("open"))this._renderModuleDeviationDialog(result);
      this._refreshModuleRuntimeProbe(result);
      const list=this.shadow?.getElementById("settings-modules-list"),signature=this._moduleListSignature(result);
      if(list&&(forceList||list.dataset.moduleSignature!==signature)){this._renderModuleList(list,result);list.dataset.moduleSignature=signature;}
    },

    _renderModuleDeviationDialog(result=moduleDiagnostics(EXPECTED_MODULES)){
      const backdrop=this.shadow?.getElementById("settings-modules-deviations-backdrop");
      if(!backdrop)return;
      const issues=this._moduleDeviationIssues(result);
      const title=backdrop.querySelector("#settings-modules-deviations-title");
      if(title)title.textContent=this._t?.("modules.deviations",{count:issues.length})||`${issues.length} Abweichung(en) erkannt`;
      const summary=backdrop.querySelector("#settings-modules-deviations-summary");
      if(summary){
        summary.replaceChildren();
        const strong=document.createElement("strong");strong.textContent=`Gewitterradar ${APPLICATION_META.displayVersion}`;
        const counts=document.createElement("span");counts.textContent=`· ${this._t?.("modules.loaded",{loaded:result.loadedCount,expected:result.expectedCount})||`${result.loadedCount} / ${result.expectedCount}`}`;
        const set=document.createElement("span");set.className="gr-mod-fingerprint";set.dataset.state="ok";set.textContent=`· ${this._t?.("modules.set_id")||"ID"} ${this._moduleRuntimeProbe?.loadedId||APPLICATION_META.moduleSetId||"—"}`;
        summary.append(strong,counts,set);
      }
      const list=backdrop.querySelector("#settings-modules-deviations-list");
      if(!list)return;
      list.replaceChildren();
      const appendDetail=(detail,label,value)=>{
        const dt=document.createElement("dt");dt.textContent=label;
        const dd=document.createElement("dd");dd.textContent=value==null||value===""?"—":String(value);
        detail.append(dt,dd);
      };
      for(const issue of issues){
        const card=document.createElement("article");card.className="gr-deviation-card";card.dataset.deviationType=issue.type;card.dataset.moduleId=issue.id;
        const head=document.createElement("div");head.className="gr-deviation-head";
        const heading=document.createElement("div");heading.className="gr-deviation-title";
        const row=issue.row||null;
        const presentation=row?modulePresentation(this._languageValue?.()||"Deutsch",row):{name:issue.id,functions:""};
        const name=document.createElement("strong");name.textContent=presentation.name||issue.id;
        const id=document.createElement("code");id.textContent=issue.id;
        heading.append(name,id);
        const badge=document.createElement("span");badge.className="gr-deviation-badge";badge.textContent=issue.type==="runtime_stale"?(this._t?.("modules.runtime_stale")||"Frontend-Neuladung erforderlich"):this._moduleStatusLabel(issue.type);
        head.append(heading,badge);card.append(head);
        const detail=document.createElement("dl");detail.className="gr-deviation-detail";
        if(issue.type==="duplicate"){
          appendDetail(detail,this._t?.("modules.detail.status")||"Status",this._moduleStatusLabel("duplicate"));
          appendDetail(detail,this._t?.("modules.detail.version")||"Version",row?.loadedVersion||"—");
          appendDetail(detail,this._t?.("modules.detail.expected")||"Erwartet",row?.expectedVersion||"—");
          appendDetail(detail,this._t?.("modules.deviation.registrations")||"Registrierungen",issue.count||issue.registrations?.length||0);
          appendDetail(detail,this._t?.("modules.detail.file")||"Datei",row?.file||issue.registrations?.[0]?.file||"—");
          card.append(detail);
          if(row?.status==="ok"){
            const note=document.createElement("div");note.className="gr-deviation-note";note.textContent=this._t?.("modules.deviation.active_matches")||"Aktive Modulversion entspricht dem Sollstand";card.append(note);
          }
          const registrations=document.createElement("div");registrations.className="gr-deviation-registrations";
          for(const registration of issue.registrations||[]){
            const entry=document.createElement("div");entry.className="gr-deviation-registration";
            entry.textContent=`#${registration.index||"?"} · v${registration.version||"—"} · ${registration.url||registration.file||"—"}`;
            registrations.append(entry);
          }
          card.append(registrations);
        }else if(issue.type==="runtime_stale"){
          const probe=issue.runtimeProbe||{};
          appendDetail(detail,this._t?.("modules.detail.loaded")||"Geladen",probe.loadedId||"—");
          appendDetail(detail,this._t?.("modules.installed")||"Installiert",probe.installedId||"—");
          appendDetail(detail,"Runtime",`${probe.localRevision||"—"} → ${probe.installedRevision||"—"}`);
          card.append(detail);
        }else{
          appendDetail(detail,this._t?.("modules.detail.status")||"Status",this._moduleStatusLabel(issue.type));
          appendDetail(detail,this._t?.("modules.detail.version")||"Version",row?.loadedVersion||"—");
          appendDetail(detail,this._t?.("modules.detail.expected")||"Erwartet",row?.expectedVersion||"—");
          appendDetail(detail,this._t?.("modules.detail.file")||"Datei",row?.file||"—");
          card.append(detail);
        }
        list.append(card);
      }
    },

    _openModuleDeviations(){
      this._ensureModuleView();
      const backdrop=this.shadow?.getElementById("settings-modules-deviations-backdrop");
      if(!backdrop)return;
      const result=moduleDiagnostics(EXPECTED_MODULES);
      const issues=this._moduleDeviationIssues(result);
      if(!issues.length)return;
      this._renderModuleDeviationDialog(result);
      backdrop.classList.add("open");
      backdrop.setAttribute("aria-hidden","false");
      requestAnimationFrame(()=>backdrop.querySelector("#settings-modules-deviations-close")?.focus());
    },

    _closeModuleDeviations(){
      const backdrop=this.shadow?.getElementById("settings-modules-deviations-backdrop");
      if(!backdrop)return;
      backdrop.classList.remove("open");
      backdrop.setAttribute("aria-hidden","true");
      requestAnimationFrame(()=>this.shadow?.querySelector(".gr-mod-deviation-trigger")?.focus());
    },

    _openModuleDetails(){
      this._ensureModuleView();
      const backdrop=this.shadow?.getElementById("settings-modules-backdrop");
      if(!backdrop)return;
      this._syncModuleView();
      backdrop.classList.add("open");
      backdrop.setAttribute("aria-hidden","false");
      requestAnimationFrame(()=>backdrop.querySelector("#settings-modules-close")?.focus());
    },

    _closeModuleDetails(){
      const backdrop=this.shadow?.getElementById("settings-modules-backdrop");
      if(!backdrop)return;
      backdrop.classList.remove("open");
      backdrop.setAttribute("aria-hidden","true");
      this.shadow?.getElementById("settings-modules-details")?.focus();
    },

    async _copyModuleDiagnostics(){
      const text=JSON.stringify(this._moduleDiagnosticsPayload(),null,2);
      try{
        await navigator.clipboard.writeText(text);
      }catch(_error){
        const area=document.createElement("textarea");
        area.value=text;area.style.position="fixed";area.style.opacity="0";
        document.body.append(area);area.select();document.execCommand("copy");area.remove();
      }
    },

    _downloadModuleDiagnostics(){
      const payload=JSON.stringify(this._moduleDiagnosticsPayload(),null,2);
      const blob=new Blob([payload],{type:"application/json;charset=utf-8"});
      const url=URL.createObjectURL(blob);
      const link=document.createElement("a");
      link.href=url;
      link.download=`gewitterradar-module-${APPLICATION_META.version}.json`;
      document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),0);
    },

    async _copyModuleDeviationDiagnostics(){
      const text=JSON.stringify(this._moduleDeviationPayload(),null,2);
      try{
        await navigator.clipboard.writeText(text);
      }catch(_error){
        const area=document.createElement("textarea");
        area.value=text;area.style.position="fixed";area.style.opacity="0";
        document.body.append(area);area.select();document.execCommand("copy");area.remove();
      }
    },

    _downloadModuleDeviationDiagnostics(){
      const payload=JSON.stringify(this._moduleDeviationPayload(),null,2);
      const blob=new Blob([payload],{type:"application/json;charset=utf-8"});
      const url=URL.createObjectURL(blob);
      const link=document.createElement("a");
      link.href=url;
      link.download=`gewitterradar-module-deviations-${APPLICATION_META.version}.json`;
      document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),0);
    }
  };
});

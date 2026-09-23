import { defineModule } from "../core/runtime.js?v=41002";
export const MODULE_META=Object.freeze({
  "id": "ui.i18n-settings",
  "version": "1.2.0",
  "group": "Oberfläche",
  "function": "Sprache & Einstellungen",
  "subfunctions": [
    "Übersetzung",
    "About",
    "Einstellungen",
    "Hilfetexte"
  ],
  "file": "modules/ui/i18n-settings.js"
});
const SETTINGS_UI_TRANSLATIONS=Object.freeze({
  "Deutsch": {
    "settings.cluster_resolution": "Cluster-Auflösung",
    "settings.cluster_resolution_note": "Wann Cluster in Einzelblitze aufgelöst werden",
    "settings.cluster_navigation_session": "Cluster-Navigation · Sitzungszeit",
    "settings.cluster_navigation_range": "5 - 3600 Sek.",
    "settings.cluster_navigation_infinite": "unendlich",
    "settings.map_display": "Kartendarstellung",
    "settings.map_startup": "Standardansicht",
    "settings.map_startup_note": "Nur auf diesem Gerät und in diesem Browserprofil gespeichert",
    "settings.map_startup_last": "Zuletzt verwendet",
    "settings.map_display_sub": "Kartengröße und separates Kartenfenster",
    "settings.map_window": "Eigenes Kartenfenster",
    "settings.map_window_note": "Karte mit ausgewähltem Kompass separat öffnen",
    "settings.map_window_open": "Öffnen",
    "settings.map_window_open_aria": "Karte in eigenem Fenster öffnen",
    "modules.title": "Module & Versionen",
    "modules.subtitle": "Status der tatsächlich geladenen Komponenten",
    "modules.details": "Modul-Details",
    "modules.kicker": "Gewitterradar · Diagnose",
    "modules.close": "Modul-Details schließen",
    "modules.copy": "Diagnose kopieren",
    "modules.download": "JSON herunterladen",
    "modules.loaded": "{loaded} / {expected} Module geladen",
    "modules.consistent": "Versionssatz konsistent",
    "modules.deviations": "{count} Abweichung(en) erkannt",
    "modules.status.ok": "korrekt",
    "modules.status.missing": "fehlt",
    "modules.status.version_mismatch": "abweichend",
    "modules.status.unexpected": "unerwartet",
    "modules.group.other": "Sonstige",
    "modules.group.core": "Kern",
    "modules.group.fullscreen": "Vollbild",
    "modules.group.ui": "Oberfläche",
    "modules.group.instruments": "Instrumente",
    "modules.group.diagnostics": "Diagnose",
    "modules.group.location": "Standort & Radien",
    "modules.group.map": "Karte",
    "modules.group.history": "Verlauf",
    "modules.detail.status": "Status",
    "modules.detail.version": "Version",
    "modules.detail.expected": "Erwartet",
    "modules.detail.file": "Datei",
    "modules.detail.loaded": "Geladen",
    "modules.detail.functions": "Funktionen"
  },
  "English": {
    "settings.cluster_resolution": "Cluster resolution",
    "settings.cluster_resolution_note": "When clusters split into individual strikes",
    "settings.cluster_navigation_session": "Cluster navigation · session time",
    "settings.cluster_navigation_range": "5 - 3600 sec.",
    "settings.cluster_navigation_infinite": "infinite",
    "settings.map_display": "Map display",
    "settings.map_startup": "Default view",
    "settings.map_startup_note": "Stored only on this device and browser profile",
    "settings.map_startup_last": "Last used",
    "settings.map_display_sub": "Map size and separate map window",
    "settings.map_window": "Separate map window",
    "settings.map_window_note": "Open the map with the selected compass separately",
    "settings.map_window_open": "Open",
    "settings.map_window_open_aria": "Open map in a separate window",
    "modules.title": "Modules & versions",
    "modules.subtitle": "Status of the components actually loaded",
    "modules.details": "Module details",
    "modules.kicker": "Gewitterradar · Diagnostics",
    "modules.close": "Close module details",
    "modules.copy": "Copy diagnostics",
    "modules.download": "Download JSON",
    "modules.loaded": "{loaded} / {expected} modules loaded",
    "modules.consistent": "Version set consistent",
    "modules.deviations": "{count} deviation(s) detected",
    "modules.status.ok": "correct",
    "modules.status.missing": "missing",
    "modules.status.version_mismatch": "mismatched",
    "modules.status.unexpected": "unexpected",
    "modules.group.other": "Other",
    "modules.group.core": "Core",
    "modules.group.fullscreen": "Fullscreen",
    "modules.group.ui": "Interface",
    "modules.group.instruments": "Instruments",
    "modules.group.diagnostics": "Diagnostics",
    "modules.group.location": "Location & radii",
    "modules.group.map": "Map",
    "modules.group.history": "History",
    "modules.detail.status": "Status",
    "modules.detail.version": "Version",
    "modules.detail.expected": "Expected",
    "modules.detail.file": "File",
    "modules.detail.loaded": "Loaded",
    "modules.detail.functions": "Functions"
  },
  "Dansk": {
    "settings.cluster_resolution": "Klyngeopløsning",
    "settings.cluster_resolution_note": "Hvornår klynger opdeles i enkelte lynnedslag",
    "settings.cluster_navigation_session": "Klyngenavigation · sessionstid",
    "settings.cluster_navigation_range": "5 - 3600 sek.",
    "settings.cluster_navigation_infinite": "uendelig",
    "settings.map_display": "Kortvisning",
    "settings.map_startup": "Standardvisning",
    "settings.map_startup_note": "Gemmes kun på denne enhed og i denne browserprofil",
    "settings.map_startup_last": "Senest brugt",
    "settings.map_display_sub": "Kortstørrelse og separat kortvindue",
    "settings.map_window": "Separat kortvindue",
    "settings.map_window_note": "Åbn kortet separat med det valgte kompas",
    "settings.map_window_open": "Åbn",
    "settings.map_window_open_aria": "Åbn kortet i et separat vindue",
    "modules.title": "Moduler og versioner",
    "modules.subtitle": "Status for de faktisk indlæste komponenter",
    "modules.details": "Moduldetaljer",
    "modules.kicker": "Gewitterradar · Diagnose",
    "modules.close": "Luk moduldetaljer",
    "modules.copy": "Kopiér diagnose",
    "modules.download": "Download JSON",
    "modules.loaded": "{loaded} / {expected} moduler indlæst",
    "modules.consistent": "Versionssættet er konsistent",
    "modules.deviations": "{count} afvigelse(r) fundet",
    "modules.status.ok": "korrekt",
    "modules.status.missing": "mangler",
    "modules.status.version_mismatch": "afvigende",
    "modules.status.unexpected": "uventet",
    "modules.group.other": "Andre",
    "modules.group.core": "Kerne",
    "modules.group.fullscreen": "Fuld skærm",
    "modules.group.ui": "Brugerflade",
    "modules.group.instruments": "Instrumenter",
    "modules.group.diagnostics": "Diagnose",
    "modules.group.location": "Placering og radier",
    "modules.group.map": "Kort",
    "modules.group.history": "Historik",
    "modules.detail.status": "Status",
    "modules.detail.version": "Version",
    "modules.detail.expected": "Forventet",
    "modules.detail.file": "Fil",
    "modules.detail.loaded": "Indlæst",
    "modules.detail.functions": "Funktioner"
  },
  "Español": {
    "settings.cluster_resolution": "Resolución de clústeres",
    "settings.cluster_resolution_note": "Cuándo los clústeres se dividen en rayos individuales",
    "settings.cluster_navigation_session": "Navegación de clústeres · duración de sesión",
    "settings.cluster_navigation_range": "5 - 3600 s",
    "settings.cluster_navigation_infinite": "infinito",
    "settings.map_display": "Visualización del mapa",
    "settings.map_startup": "Vista predeterminada",
    "settings.map_startup_note": "Se guarda solo en este dispositivo y perfil del navegador",
    "settings.map_startup_last": "Última utilizada",
    "settings.map_display_sub": "Tamaño del mapa y ventana de mapa separada",
    "settings.map_window": "Ventana de mapa separada",
    "settings.map_window_note": "Abrir el mapa por separado con la brújula seleccionada",
    "settings.map_window_open": "Abrir",
    "settings.map_window_open_aria": "Abrir el mapa en una ventana separada",
    "modules.title": "Módulos y versiones",
    "modules.subtitle": "Estado de los componentes cargados realmente",
    "modules.details": "Detalles de módulos",
    "modules.kicker": "Gewitterradar · Diagnóstico",
    "modules.close": "Cerrar detalles de módulos",
    "modules.copy": "Copiar diagnóstico",
    "modules.download": "Descargar JSON",
    "modules.loaded": "{loaded} / {expected} módulos cargados",
    "modules.consistent": "Conjunto de versiones coherente",
    "modules.deviations": "{count} desviación(es) detectada(s)",
    "modules.status.ok": "correcto",
    "modules.status.missing": "falta",
    "modules.status.version_mismatch": "diferente",
    "modules.status.unexpected": "inesperado",
    "modules.group.other": "Otros",
    "modules.group.core": "Núcleo",
    "modules.group.fullscreen": "Pantalla completa",
    "modules.group.ui": "Interfaz",
    "modules.group.instruments": "Instrumentos",
    "modules.group.diagnostics": "Diagnóstico",
    "modules.group.location": "Ubicación y radios",
    "modules.group.map": "Mapa",
    "modules.group.history": "Historial",
    "modules.detail.status": "Estado",
    "modules.detail.version": "Versión",
    "modules.detail.expected": "Esperado",
    "modules.detail.file": "Archivo",
    "modules.detail.loaded": "Cargado",
    "modules.detail.functions": "Funciones"
  },
  "Français": {
    "settings.cluster_resolution": "Résolution des clusters",
    "settings.cluster_resolution_note": "Quand les clusters se séparent en impacts individuels",
    "settings.cluster_navigation_session": "Navigation des clusters · durée de session",
    "settings.cluster_navigation_range": "5 - 3600 s",
    "settings.cluster_navigation_infinite": "infini",
    "settings.map_display": "Affichage de la carte",
    "settings.map_startup": "Vue par défaut",
    "settings.map_startup_note": "Enregistré uniquement sur cet appareil et dans ce profil de navigateur",
    "settings.map_startup_last": "Dernière utilisée",
    "settings.map_display_sub": "Taille de la carte et fenêtre de carte séparée",
    "settings.map_window": "Fenêtre de carte séparée",
    "settings.map_window_note": "Ouvrir la carte séparément avec la boussole sélectionnée",
    "settings.map_window_open": "Ouvrir",
    "settings.map_window_open_aria": "Ouvrir la carte dans une fenêtre séparée",
    "modules.title": "Modules et versions",
    "modules.subtitle": "État des composants réellement chargés",
    "modules.details": "Détails des modules",
    "modules.kicker": "Gewitterradar · Diagnostic",
    "modules.close": "Fermer les détails des modules",
    "modules.copy": "Copier le diagnostic",
    "modules.download": "Télécharger le JSON",
    "modules.loaded": "{loaded} / {expected} modules chargés",
    "modules.consistent": "Ensemble de versions cohérent",
    "modules.deviations": "{count} écart(s) détecté(s)",
    "modules.status.ok": "correct",
    "modules.status.missing": "manquant",
    "modules.status.version_mismatch": "différent",
    "modules.status.unexpected": "inattendu",
    "modules.group.other": "Autres",
    "modules.group.core": "Noyau",
    "modules.group.fullscreen": "Plein écran",
    "modules.group.ui": "Interface",
    "modules.group.instruments": "Instruments",
    "modules.group.diagnostics": "Diagnostic",
    "modules.group.location": "Emplacement et rayons",
    "modules.group.map": "Carte",
    "modules.group.history": "Historique",
    "modules.detail.status": "État",
    "modules.detail.version": "Version",
    "modules.detail.expected": "Attendu",
    "modules.detail.file": "Fichier",
    "modules.detail.loaded": "Chargé",
    "modules.detail.functions": "Fonctions"
  },
  "Nederlands": {
    "settings.cluster_resolution": "Clusterresolutie",
    "settings.cluster_resolution_note": "Wanneer clusters worden opgesplitst in afzonderlijke bliksems",
    "settings.cluster_navigation_session": "Clusternavigatie · sessieduur",
    "settings.cluster_navigation_range": "5 - 3600 sec.",
    "settings.cluster_navigation_infinite": "oneindig",
    "settings.map_display": "Kaartweergave",
    "settings.map_startup": "Standaardweergave",
    "settings.map_startup_note": "Alleen op dit apparaat en in dit browserprofiel opgeslagen",
    "settings.map_startup_last": "Laatst gebruikt",
    "settings.map_display_sub": "Kaartgrootte en apart kaartvenster",
    "settings.map_window": "Apart kaartvenster",
    "settings.map_window_note": "Open de kaart apart met het geselecteerde kompas",
    "settings.map_window_open": "Openen",
    "settings.map_window_open_aria": "Open de kaart in een apart venster",
    "modules.title": "Modules en versies",
    "modules.subtitle": "Status van de daadwerkelijk geladen componenten",
    "modules.details": "Moduledetails",
    "modules.kicker": "Gewitterradar · Diagnose",
    "modules.close": "Moduledetails sluiten",
    "modules.copy": "Diagnose kopiëren",
    "modules.download": "JSON downloaden",
    "modules.loaded": "{loaded} / {expected} modules geladen",
    "modules.consistent": "Versieset consistent",
    "modules.deviations": "{count} afwijking(en) gevonden",
    "modules.status.ok": "correct",
    "modules.status.missing": "ontbreekt",
    "modules.status.version_mismatch": "afwijkend",
    "modules.status.unexpected": "onverwacht",
    "modules.group.other": "Overige",
    "modules.group.core": "Kern",
    "modules.group.fullscreen": "Volledig scherm",
    "modules.group.ui": "Interface",
    "modules.group.instruments": "Instrumenten",
    "modules.group.diagnostics": "Diagnose",
    "modules.group.location": "Locatie en stralen",
    "modules.group.map": "Kaart",
    "modules.group.history": "Geschiedenis",
    "modules.detail.status": "Status",
    "modules.detail.version": "Versie",
    "modules.detail.expected": "Verwacht",
    "modules.detail.file": "Bestand",
    "modules.detail.loaded": "Geladen",
    "modules.detail.functions": "Functies"
  },
  "Polski": {
    "settings.cluster_resolution": "Rozdzielczość klastrów",
    "settings.cluster_resolution_note": "Kiedy klastry są rozdzielane na pojedyncze wyładowania",
    "settings.cluster_navigation_session": "Nawigacja klastrów · czas sesji",
    "settings.cluster_navigation_range": "5 - 3600 s",
    "settings.cluster_navigation_infinite": "bez końca",
    "settings.map_display": "Widok mapy",
    "settings.map_startup": "Widok domyślny",
    "settings.map_startup_note": "Zapisywane tylko na tym urządzeniu i w tym profilu przeglądarki",
    "settings.map_startup_last": "Ostatnio używany",
    "settings.map_display_sub": "Rozmiar mapy i osobne okno mapy",
    "settings.map_window": "Osobne okno mapy",
    "settings.map_window_note": "Otwórz mapę osobno z wybranym kompasem",
    "settings.map_window_open": "Otwórz",
    "settings.map_window_open_aria": "Otwórz mapę w osobnym oknie",
    "modules.title": "Moduły i wersje",
    "modules.subtitle": "Stan faktycznie załadowanych komponentów",
    "modules.details": "Szczegóły modułów",
    "modules.kicker": "Gewitterradar · Diagnostyka",
    "modules.close": "Zamknij szczegóły modułów",
    "modules.copy": "Kopiuj diagnostykę",
    "modules.download": "Pobierz JSON",
    "modules.loaded": "Załadowano {loaded} / {expected} modułów",
    "modules.consistent": "Zestaw wersji spójny",
    "modules.deviations": "Wykryto odchyleń: {count}",
    "modules.status.ok": "poprawny",
    "modules.status.missing": "brak",
    "modules.status.version_mismatch": "niezgodny",
    "modules.status.unexpected": "nieoczekiwany",
    "modules.group.other": "Inne",
    "modules.group.core": "Rdzeń",
    "modules.group.fullscreen": "Pełny ekran",
    "modules.group.ui": "Interfejs",
    "modules.group.instruments": "Instrumenty",
    "modules.group.diagnostics": "Diagnostyka",
    "modules.group.location": "Lokalizacja i promienie",
    "modules.group.map": "Mapa",
    "modules.group.history": "Historia",
    "modules.detail.status": "Stan",
    "modules.detail.version": "Wersja",
    "modules.detail.expected": "Oczekiwana",
    "modules.detail.file": "Plik",
    "modules.detail.loaded": "Załadowano",
    "modules.detail.functions": "Funkcje"
  },
  "Português": {
    "settings.cluster_resolution": "Resolução de clusters",
    "settings.cluster_resolution_note": "Quando os clusters se dividem em descargas individuais",
    "settings.cluster_navigation_session": "Navegação de clusters · duração da sessão",
    "settings.cluster_navigation_range": "5 - 3600 s",
    "settings.cluster_navigation_infinite": "infinito",
    "settings.map_display": "Apresentação do mapa",
    "settings.map_startup": "Vista predefinida",
    "settings.map_startup_note": "Guardado apenas neste dispositivo e neste perfil do navegador",
    "settings.map_startup_last": "Última utilizada",
    "settings.map_display_sub": "Tamanho do mapa e janela de mapa separada",
    "settings.map_window": "Janela de mapa separada",
    "settings.map_window_note": "Abrir o mapa separadamente com a bússola selecionada",
    "settings.map_window_open": "Abrir",
    "settings.map_window_open_aria": "Abrir o mapa numa janela separada",
    "modules.title": "Módulos e versões",
    "modules.subtitle": "Estado dos componentes realmente carregados",
    "modules.details": "Detalhes dos módulos",
    "modules.kicker": "Gewitterradar · Diagnóstico",
    "modules.close": "Fechar detalhes dos módulos",
    "modules.copy": "Copiar diagnóstico",
    "modules.download": "Transferir JSON",
    "modules.loaded": "{loaded} / {expected} módulos carregados",
    "modules.consistent": "Conjunto de versões consistente",
    "modules.deviations": "{count} desvio(s) detetado(s)",
    "modules.status.ok": "correto",
    "modules.status.missing": "em falta",
    "modules.status.version_mismatch": "divergente",
    "modules.status.unexpected": "inesperado",
    "modules.group.other": "Outros",
    "modules.group.core": "Núcleo",
    "modules.group.fullscreen": "Ecrã inteiro",
    "modules.group.ui": "Interface",
    "modules.group.instruments": "Instrumentos",
    "modules.group.diagnostics": "Diagnóstico",
    "modules.group.location": "Localização e raios",
    "modules.group.map": "Mapa",
    "modules.group.history": "Histórico",
    "modules.detail.status": "Estado",
    "modules.detail.version": "Versão",
    "modules.detail.expected": "Esperado",
    "modules.detail.file": "Ficheiro",
    "modules.detail.loaded": "Carregado",
    "modules.detail.functions": "Funções"
  },
  "Svenska": {
    "settings.cluster_resolution": "Klusterupplösning",
    "settings.cluster_resolution_note": "När kluster delas upp i enskilda blixtar",
    "settings.cluster_navigation_session": "Klusternavigering · sessionstid",
    "settings.cluster_navigation_range": "5 - 3600 sek.",
    "settings.cluster_navigation_infinite": "oändlig",
    "settings.map_display": "Kartvisning",
    "settings.map_startup": "Standardvy",
    "settings.map_startup_note": "Sparas endast på den här enheten och i den här webbläsarprofilen",
    "settings.map_startup_last": "Senast använd",
    "settings.map_display_sub": "Kartstorlek och separat kartfönster",
    "settings.map_window": "Separat kartfönster",
    "settings.map_window_note": "Öppna kartan separat med vald kompass",
    "settings.map_window_open": "Öppna",
    "settings.map_window_open_aria": "Öppna kartan i ett separat fönster",
    "modules.title": "Moduler och versioner",
    "modules.subtitle": "Status för de komponenter som faktiskt har lästs in",
    "modules.details": "Moduldetaljer",
    "modules.kicker": "Gewitterradar · Diagnostik",
    "modules.close": "Stäng moduldetaljer",
    "modules.copy": "Kopiera diagnostik",
    "modules.download": "Hämta JSON",
    "modules.loaded": "{loaded} / {expected} moduler inlästa",
    "modules.consistent": "Versionsuppsättningen är konsekvent",
    "modules.deviations": "{count} avvikelse(r) upptäckt(a)",
    "modules.status.ok": "korrekt",
    "modules.status.missing": "saknas",
    "modules.status.version_mismatch": "avvikande",
    "modules.status.unexpected": "oväntad",
    "modules.group.other": "Övriga",
    "modules.group.core": "Kärna",
    "modules.group.fullscreen": "Helskärm",
    "modules.group.ui": "Gränssnitt",
    "modules.group.instruments": "Instrument",
    "modules.group.diagnostics": "Diagnostik",
    "modules.group.location": "Plats och radier",
    "modules.group.map": "Karta",
    "modules.group.history": "Historik",
    "modules.detail.status": "Status",
    "modules.detail.version": "Version",
    "modules.detail.expected": "Förväntad",
    "modules.detail.file": "Fil",
    "modules.detail.loaded": "Inläst",
    "modules.detail.functions": "Funktioner"
  },
  "Italiano": {
    "settings.cluster_resolution": "Risoluzione cluster",
    "settings.cluster_resolution_note": "Quando i cluster vengono suddivisi in fulmini singoli",
    "settings.cluster_navigation_session": "Navigazione cluster · durata sessione",
    "settings.cluster_navigation_range": "5 - 3600 s",
    "settings.cluster_navigation_infinite": "infinito",
    "settings.map_display": "Visualizzazione mappa",
    "settings.map_startup": "Vista predefinita",
    "settings.map_startup_note": "Salvata solo su questo dispositivo e in questo profilo del browser",
    "settings.map_startup_last": "Ultima utilizzata",
    "settings.map_display_sub": "Dimensione mappa e finestra mappa separata",
    "settings.map_window": "Finestra mappa separata",
    "settings.map_window_note": "Apri la mappa separatamente con la bussola selezionata",
    "settings.map_window_open": "Apri",
    "settings.map_window_open_aria": "Apri la mappa in una finestra separata",
    "modules.title": "Moduli e versioni",
    "modules.subtitle": "Stato dei componenti effettivamente caricati",
    "modules.details": "Dettagli moduli",
    "modules.kicker": "Gewitterradar · Diagnostica",
    "modules.close": "Chiudi dettagli moduli",
    "modules.copy": "Copia diagnostica",
    "modules.download": "Scarica JSON",
    "modules.loaded": "{loaded} / {expected} moduli caricati",
    "modules.consistent": "Set di versioni coerente",
    "modules.deviations": "Rilevate {count} difformità",
    "modules.status.ok": "corretto",
    "modules.status.missing": "mancante",
    "modules.status.version_mismatch": "difforme",
    "modules.status.unexpected": "inatteso",
    "modules.group.other": "Altro",
    "modules.group.core": "Nucleo",
    "modules.group.fullscreen": "Schermo intero",
    "modules.group.ui": "Interfaccia",
    "modules.group.instruments": "Strumenti",
    "modules.group.diagnostics": "Diagnostica",
    "modules.group.location": "Posizione e raggi",
    "modules.group.map": "Mappa",
    "modules.group.history": "Cronologia",
    "modules.detail.status": "Stato",
    "modules.detail.version": "Versione",
    "modules.detail.expected": "Prevista",
    "modules.detail.file": "File",
    "modules.detail.loaded": "Caricato",
    "modules.detail.functions": "Funzioni"
  },
  "Norsk bokmål": {
    "settings.cluster_resolution": "Klyngeoppløsning",
    "settings.cluster_resolution_note": "Når klynger deles opp i enkeltutladninger",
    "settings.cluster_navigation_session": "Klyngenavigasjon · økttid",
    "settings.cluster_navigation_range": "5 - 3600 sek.",
    "settings.cluster_navigation_infinite": "uendelig",
    "settings.map_display": "Kartvisning",
    "settings.map_startup": "Standardvisning",
    "settings.map_startup_note": "Lagres bare på denne enheten og i denne nettleserprofilen",
    "settings.map_startup_last": "Sist brukt",
    "settings.map_display_sub": "Kartstørrelse og eget kartvindu",
    "settings.map_window": "Eget kartvindu",
    "settings.map_window_note": "Åpne kartet separat med valgt kompass",
    "settings.map_window_open": "Åpne",
    "settings.map_window_open_aria": "Åpne kartet i et eget vindu",
    "modules.title": "Moduler og versjoner",
    "modules.subtitle": "Status for komponentene som faktisk er lastet",
    "modules.details": "Moduldetaljer",
    "modules.kicker": "Gewitterradar · Diagnose",
    "modules.close": "Lukk moduldetaljer",
    "modules.copy": "Kopier diagnose",
    "modules.download": "Last ned JSON",
    "modules.loaded": "{loaded} / {expected} moduler lastet",
    "modules.consistent": "Versjonssettet er konsistent",
    "modules.deviations": "{count} avvik oppdaget",
    "modules.status.ok": "korrekt",
    "modules.status.missing": "mangler",
    "modules.status.version_mismatch": "avvikende",
    "modules.status.unexpected": "uventet",
    "modules.group.other": "Andre",
    "modules.group.core": "Kjerne",
    "modules.group.fullscreen": "Fullskjerm",
    "modules.group.ui": "Grensesnitt",
    "modules.group.instruments": "Instrumenter",
    "modules.group.diagnostics": "Diagnose",
    "modules.group.location": "Plassering og radier",
    "modules.group.map": "Kart",
    "modules.group.history": "Historikk",
    "modules.detail.status": "Status",
    "modules.detail.version": "Versjon",
    "modules.detail.expected": "Forventet",
    "modules.detail.file": "Fil",
    "modules.detail.loaded": "Lastet",
    "modules.detail.functions": "Funksjoner"
  },
  "Suomi": {
    "settings.cluster_resolution": "Klusterien erottelu",
    "settings.cluster_resolution_note": "Milloin klusterit jaetaan yksittäisiksi salamoiksi",
    "settings.cluster_navigation_session": "Klusterinavigointi · istunnon kesto",
    "settings.cluster_navigation_range": "5 - 3600 s",
    "settings.cluster_navigation_infinite": "rajaton",
    "settings.map_display": "Karttanäkymä",
    "settings.map_startup": "Oletusnäkymä",
    "settings.map_startup_note": "Tallennetaan vain tälle laitteelle ja tähän selainprofiiliin",
    "settings.map_startup_last": "Viimeksi käytetty",
    "settings.map_display_sub": "Kartan koko ja erillinen karttaikkuna",
    "settings.map_window": "Erillinen karttaikkuna",
    "settings.map_window_note": "Avaa kartta erikseen valitulla kompassilla",
    "settings.map_window_open": "Avaa",
    "settings.map_window_open_aria": "Avaa kartta erilliseen ikkunaan",
    "modules.title": "Moduulit ja versiot",
    "modules.subtitle": "Todellisuudessa ladattujen komponenttien tila",
    "modules.details": "Moduulin tiedot",
    "modules.kicker": "Gewitterradar · Diagnostiikka",
    "modules.close": "Sulje moduulin tiedot",
    "modules.copy": "Kopioi diagnostiikka",
    "modules.download": "Lataa JSON",
    "modules.loaded": "{loaded} / {expected} moduulia ladattu",
    "modules.consistent": "Versiokokonaisuus yhtenäinen",
    "modules.deviations": "Havaittu poikkeamia: {count}",
    "modules.status.ok": "oikein",
    "modules.status.missing": "puuttuu",
    "modules.status.version_mismatch": "poikkeava",
    "modules.status.unexpected": "odottamaton",
    "modules.group.other": "Muut",
    "modules.group.core": "Ydin",
    "modules.group.fullscreen": "Koko näyttö",
    "modules.group.ui": "Käyttöliittymä",
    "modules.group.instruments": "Mittarit",
    "modules.group.diagnostics": "Diagnostiikka",
    "modules.group.location": "Sijainti ja säteet",
    "modules.group.map": "Kartta",
    "modules.group.history": "Historia",
    "modules.detail.status": "Tila",
    "modules.detail.version": "Versio",
    "modules.detail.expected": "Odotettu",
    "modules.detail.file": "Tiedosto",
    "modules.detail.loaded": "Ladattu",
    "modules.detail.functions": "Toiminnot"
  },
  "Čeština": {
    "settings.cluster_resolution": "Rozlišení shluků",
    "settings.cluster_resolution_note": "Kdy se shluky rozdělí na jednotlivé výboje",
    "settings.cluster_navigation_session": "Navigace shluků · délka relace",
    "settings.cluster_navigation_range": "5 - 3600 s",
    "settings.cluster_navigation_infinite": "bez omezení",
    "settings.map_display": "Zobrazení mapy",
    "settings.map_startup": "Výchozí zobrazení",
    "settings.map_startup_note": "Ukládá se pouze v tomto zařízení a profilu prohlížeče",
    "settings.map_startup_last": "Naposledy použité",
    "settings.map_display_sub": "Velikost mapy a samostatné okno mapy",
    "settings.map_window": "Samostatné okno mapy",
    "settings.map_window_note": "Otevřít mapu samostatně s vybraným kompasem",
    "settings.map_window_open": "Otevřít",
    "settings.map_window_open_aria": "Otevřít mapu v samostatném okně",
    "modules.title": "Moduly a verze",
    "modules.subtitle": "Stav skutečně načtených komponent",
    "modules.details": "Podrobnosti modulů",
    "modules.kicker": "Gewitterradar · Diagnostika",
    "modules.close": "Zavřít podrobnosti modulů",
    "modules.copy": "Kopírovat diagnostiku",
    "modules.download": "Stáhnout JSON",
    "modules.loaded": "Načteno {loaded} / {expected} modulů",
    "modules.consistent": "Sada verzí je konzistentní",
    "modules.deviations": "Zjištěno odchylek: {count}",
    "modules.status.ok": "správně",
    "modules.status.missing": "chybí",
    "modules.status.version_mismatch": "odlišná verze",
    "modules.status.unexpected": "neočekávaný",
    "modules.group.other": "Ostatní",
    "modules.group.core": "Jádro",
    "modules.group.fullscreen": "Celá obrazovka",
    "modules.group.ui": "Rozhraní",
    "modules.group.instruments": "Přístroje",
    "modules.group.diagnostics": "Diagnostika",
    "modules.group.location": "Poloha a poloměry",
    "modules.group.map": "Mapa",
    "modules.group.history": "Historie",
    "modules.detail.status": "Stav",
    "modules.detail.version": "Verze",
    "modules.detail.expected": "Očekáváno",
    "modules.detail.file": "Soubor",
    "modules.detail.loaded": "Načteno",
    "modules.detail.functions": "Funkce"
  },
  "Ελληνικά": {
    "settings.cluster_resolution": "Ανάλυση συστάδων",
    "settings.cluster_resolution_note": "Πότε οι συστάδες χωρίζονται σε μεμονωμένους κεραυνούς",
    "settings.cluster_navigation_session": "Πλοήγηση συστάδων · διάρκεια συνεδρίας",
    "settings.cluster_navigation_range": "5 - 3600 δευτ.",
    "settings.cluster_navigation_infinite": "απεριόριστα",
    "settings.map_display": "Προβολή χάρτη",
    "settings.map_startup": "Προεπιλεγμένη προβολή",
    "settings.map_startup_note": "Αποθηκεύεται μόνο σε αυτή τη συσκευή και σε αυτό το προφίλ προγράμματος περιήγησης",
    "settings.map_startup_last": "Τελευταία χρησιμοποιημένη",
    "settings.map_display_sub": "Μέγεθος χάρτη και ξεχωριστό παράθυρο χάρτη",
    "settings.map_window": "Ξεχωριστό παράθυρο χάρτη",
    "settings.map_window_note": "Άνοιγμα του χάρτη ξεχωριστά με την επιλεγμένη πυξίδα",
    "settings.map_window_open": "Άνοιγμα",
    "settings.map_window_open_aria": "Άνοιγμα του χάρτη σε ξεχωριστό παράθυρο",
    "modules.title": "Μονάδες και εκδόσεις",
    "modules.subtitle": "Κατάσταση των στοιχείων που φορτώθηκαν πραγματικά",
    "modules.details": "Λεπτομέρειες μονάδων",
    "modules.kicker": "Gewitterradar · Διαγνωστικά",
    "modules.close": "Κλείσιμο λεπτομερειών μονάδων",
    "modules.copy": "Αντιγραφή διαγνωστικών",
    "modules.download": "Λήψη JSON",
    "modules.loaded": "Φορτώθηκαν {loaded} / {expected} μονάδες",
    "modules.consistent": "Το σύνολο εκδόσεων είναι συνεπές",
    "modules.deviations": "Εντοπίστηκαν αποκλίσεις: {count}",
    "modules.status.ok": "σωστό",
    "modules.status.missing": "λείπει",
    "modules.status.version_mismatch": "διαφορετική έκδοση",
    "modules.status.unexpected": "μη αναμενόμενο",
    "modules.group.other": "Άλλα",
    "modules.group.core": "Πυρήνας",
    "modules.group.fullscreen": "Πλήρης οθόνη",
    "modules.group.ui": "Διεπαφή",
    "modules.group.instruments": "Όργανα",
    "modules.group.diagnostics": "Διαγνωστικά",
    "modules.group.location": "Τοποθεσία και ακτίνες",
    "modules.group.map": "Χάρτης",
    "modules.group.history": "Ιστορικό",
    "modules.detail.status": "Κατάσταση",
    "modules.detail.version": "Έκδοση",
    "modules.detail.expected": "Αναμενόμενο",
    "modules.detail.file": "Αρχείο",
    "modules.detail.loaded": "Φορτώθηκε",
    "modules.detail.functions": "Λειτουργίες"
  },
  "Magyar": {
    "settings.cluster_resolution": "Klaszterfelbontás",
    "settings.cluster_resolution_note": "Mikor bomlanak a klaszterek egyedi villámokra",
    "settings.cluster_navigation_session": "Klaszternavigáció · munkamenet ideje",
    "settings.cluster_navigation_range": "5 - 3600 mp",
    "settings.cluster_navigation_infinite": "korlátlan",
    "settings.map_display": "Térképmegjelenítés",
    "settings.map_startup": "Alapértelmezett nézet",
    "settings.map_startup_note": "Csak ezen az eszközön és ebben a böngészőprofilban tárolva",
    "settings.map_startup_last": "Legutóbb használt",
    "settings.map_display_sub": "Térképméret és külön térképablak",
    "settings.map_window": "Külön térképablak",
    "settings.map_window_note": "Térkép külön megnyitása a kiválasztott iránytűvel",
    "settings.map_window_open": "Megnyitás",
    "settings.map_window_open_aria": "Térkép megnyitása külön ablakban",
    "modules.title": "Modulok és verziók",
    "modules.subtitle": "A ténylegesen betöltött összetevők állapota",
    "modules.details": "Modulrészletek",
    "modules.kicker": "Gewitterradar · Diagnosztika",
    "modules.close": "Modulrészletek bezárása",
    "modules.copy": "Diagnosztika másolása",
    "modules.download": "JSON letöltése",
    "modules.loaded": "{loaded} / {expected} modul betöltve",
    "modules.consistent": "A verziókészlet egységes",
    "modules.deviations": "Észlelt eltérések: {count}",
    "modules.status.ok": "helyes",
    "modules.status.missing": "hiányzik",
    "modules.status.version_mismatch": "eltérő",
    "modules.status.unexpected": "váratlan",
    "modules.group.other": "Egyéb",
    "modules.group.core": "Mag",
    "modules.group.fullscreen": "Teljes képernyő",
    "modules.group.ui": "Felület",
    "modules.group.instruments": "Műszerek",
    "modules.group.diagnostics": "Diagnosztika",
    "modules.group.location": "Hely és sugarak",
    "modules.group.map": "Térkép",
    "modules.group.history": "Előzmények",
    "modules.detail.status": "Állapot",
    "modules.detail.version": "Verzió",
    "modules.detail.expected": "Elvárt",
    "modules.detail.file": "Fájl",
    "modules.detail.loaded": "Betöltve",
    "modules.detail.functions": "Funkciók"
  },
  "Boarisch": {
    "settings.cluster_resolution": "Cluster-Auflösung",
    "settings.cluster_resolution_note": "Wann d'Cluster in einzelne Blitz aufglöst werdn",
    "settings.cluster_navigation_session": "Cluster-Navigation · Sitzungszeit",
    "settings.cluster_navigation_range": "5 - 3600 Sek.",
    "settings.cluster_navigation_infinite": "unendlich",
    "settings.map_display": "Kartndarstellung",
    "settings.map_startup": "Standardansicht",
    "settings.map_startup_note": "Nur auf dem Gerät und in dem Browserprofil gspeichert",
    "settings.map_startup_last": "Zuletzt benutzt",
    "settings.map_display_sub": "Kartngröß und eigenes Kartnfenster",
    "settings.map_window": "Eigenes Kartnfenster",
    "settings.map_window_note": "Kartn mitm ausgewählten Kompass extra aufmochn",
    "settings.map_window_open": "Aufmochn",
    "settings.map_window_open_aria": "Kartn in am eigenen Fenster aufmochn",
    "modules.title": "Module & Versionen",
    "modules.subtitle": "Status von de wirklich gladenen Komponenten",
    "modules.details": "Modul-Details",
    "modules.kicker": "Gewitterradar · Diagnose",
    "modules.close": "Modul-Details zua macha",
    "modules.copy": "Diagnose kopiern",
    "modules.download": "JSON owaladn",
    "modules.loaded": "{loaded} / {expected} Module gladen",
    "modules.consistent": "Versionssatz passt",
    "modules.deviations": "{count} Abweichung(en) gfundn",
    "modules.status.ok": "passt",
    "modules.status.missing": "fehlt",
    "modules.status.version_mismatch": "weicht ab",
    "modules.status.unexpected": "unerwartet",
    "modules.group.other": "Sonstige",
    "modules.group.core": "Kern",
    "modules.group.fullscreen": "Vollbild",
    "modules.group.ui": "Oberfläche",
    "modules.group.instruments": "Instrumente",
    "modules.group.diagnostics": "Diagnose",
    "modules.group.location": "Standort & Radien",
    "modules.group.map": "Kartn",
    "modules.group.history": "Verlauf",
    "modules.detail.status": "Status",
    "modules.detail.version": "Version",
    "modules.detail.expected": "Erwartet",
    "modules.detail.file": "Datei",
    "modules.detail.loaded": "Gladen",
    "modules.detail.functions": "Funktionen"
  },
  "Plattdüütsch": {
    "settings.cluster_resolution": "Cluster-Oplösen",
    "settings.cluster_resolution_note": "Wannehr Clusters in enkelte Blitzen oplööst warrt",
    "settings.cluster_navigation_session": "Cluster-Navigatschoon · Tied vun de Sitzung",
    "settings.cluster_navigation_range": "5 - 3600 Sek.",
    "settings.cluster_navigation_infinite": "ahn Enn",
    "settings.map_display": "Koortdarstellung",
    "settings.map_startup": "Standardansicht",
    "settings.map_startup_note": "Bloots op disse Reedschap un in dit Browserprofil spiekert",
    "settings.map_startup_last": "Tolest bruukt",
    "settings.map_display_sub": "Koortgrött un egen Koortfinster",
    "settings.map_window": "Egen Koortfinster",
    "settings.map_window_note": "Koort mit den utwählten Kompass extra opmaken",
    "settings.map_window_open": "Opmaken",
    "settings.map_window_open_aria": "Koort in en egen Finster opmaken",
    "modules.title": "Modulen & Verschoonen",
    "modules.subtitle": "Status vun de würklich laaden Komponenten",
    "modules.details": "Modul-Enkelheiten",
    "modules.kicker": "Gewitterradar · Diagnose",
    "modules.close": "Modul-Enkelheiten tomaken",
    "modules.copy": "Diagnose koperen",
    "modules.download": "JSON dalladen",
    "modules.loaded": "{loaded} / {expected} Modulen laadt",
    "modules.consistent": "Verschoonensett passt",
    "modules.deviations": "{count} Afwiekung(en) funnen",
    "modules.status.ok": "richtig",
    "modules.status.missing": "fehlt",
    "modules.status.version_mismatch": "afwiekend",
    "modules.status.unexpected": "nich verwacht",
    "modules.group.other": "Annere",
    "modules.group.core": "Kern",
    "modules.group.fullscreen": "Vullbild",
    "modules.group.ui": "Böversiet",
    "modules.group.instruments": "Instrumenten",
    "modules.group.diagnostics": "Diagnose",
    "modules.group.location": "Steed & Radien",
    "modules.group.map": "Koort",
    "modules.group.history": "Verloop",
    "modules.detail.status": "Status",
    "modules.detail.version": "Verschoon",
    "modules.detail.expected": "Verwacht",
    "modules.detail.file": "Datei",
    "modules.detail.loaded": "Laadt",
    "modules.detail.functions": "Funkschonen"
  },
  "Sächs’sch": {
    "settings.cluster_resolution": "Cluster-Ufflösung",
    "settings.cluster_resolution_note": "Wann de Cluster in einzelne Blitze uffgelöst werdn",
    "settings.cluster_navigation_session": "Cluster-Navigation · Sitzungszeit",
    "settings.cluster_navigation_range": "5 - 3600 Sek.",
    "settings.cluster_navigation_infinite": "ohne Ende",
    "settings.map_display": "Kartendarstellung",
    "settings.map_startup": "Standardansicht",
    "settings.map_startup_note": "Nur uff dem Gerät un in dem Browserprofil gespeichert",
    "settings.map_startup_last": "Zuletzt verwendet",
    "settings.map_display_sub": "Kartengröße un eigenes Kartenfenster",
    "settings.map_window": "Eignes Kartenfenster",
    "settings.map_window_note": "Karte mitm ausgewählten Kompass extra öffn",
    "settings.map_window_open": "Öffn",
    "settings.map_window_open_aria": "Karte in nem eignen Fenster öffn",
    "modules.title": "Module & Versionen",
    "modules.subtitle": "Status von de wirklich geladenen Komponenten",
    "modules.details": "Modul-Details",
    "modules.kicker": "Gewitterradar · Diagnose",
    "modules.close": "Modul-Details zumachen",
    "modules.copy": "Diagnose kopiern",
    "modules.download": "JSON runterladen",
    "modules.loaded": "{loaded} / {expected} Module geladen",
    "modules.consistent": "Versionssatz passt",
    "modules.deviations": "{count} Abweichung(en) gefunden",
    "modules.status.ok": "korrekt",
    "modules.status.missing": "fehlt",
    "modules.status.version_mismatch": "abweichend",
    "modules.status.unexpected": "unerwartet",
    "modules.group.other": "Sonstige",
    "modules.group.core": "Kern",
    "modules.group.fullscreen": "Vollbild",
    "modules.group.ui": "Oberfläche",
    "modules.group.instruments": "Instrumente",
    "modules.group.diagnostics": "Diagnose",
    "modules.group.location": "Standort & Radien",
    "modules.group.map": "Karte",
    "modules.group.history": "Verlauf",
    "modules.detail.status": "Status",
    "modules.detail.version": "Version",
    "modules.detail.expected": "Erwartet",
    "modules.detail.file": "Datei",
    "modules.detail.loaded": "Geladen",
    "modules.detail.functions": "Funktionen"
  },
  "Schwäbisch": {
    "settings.cluster_resolution": "Cluster-Uflösung",
    "settings.cluster_resolution_note": "Wann d'Cluster in einzelne Blitze ufg'löst werdet",
    "settings.cluster_navigation_session": "Cluster-Navigation · Sitzungszeit",
    "settings.cluster_navigation_range": "5 - 3600 Sek.",
    "settings.cluster_navigation_infinite": "endlos",
    "settings.map_display": "Kartadarstellung",
    "settings.map_startup": "Standardansicht",
    "settings.map_startup_note": "Nur auf dem Gerät ond in dem Browserprofil gspeichert",
    "settings.map_startup_last": "Zuletzt benutzt",
    "settings.map_display_sub": "Kartagröße ond eiges Kartafenster",
    "settings.map_window": "Eiges Kartafenster",
    "settings.map_window_note": "Karta mit em ausgewählta Kompass extra aufmacha",
    "settings.map_window_open": "Aufmacha",
    "settings.map_window_open_aria": "Karta in em eiga Fenster aufmacha",
    "modules.title": "Module & Versione",
    "modules.subtitle": "Status von de wirklich glade Komponente",
    "modules.details": "Modul-Details",
    "modules.kicker": "Gewitterradar · Diagnose",
    "modules.close": "Modul-Details zumacha",
    "modules.copy": "Diagnose kopiera",
    "modules.download": "JSON runterlada",
    "modules.loaded": "{loaded} / {expected} Module glade",
    "modules.consistent": "Versionssatz passt",
    "modules.deviations": "{count} Abweichung(en) gfunda",
    "modules.status.ok": "passt",
    "modules.status.missing": "fehlt",
    "modules.status.version_mismatch": "abweichend",
    "modules.status.unexpected": "unerwartet",
    "modules.group.other": "Sonschtige",
    "modules.group.core": "Kern",
    "modules.group.fullscreen": "Vollbild",
    "modules.group.ui": "Oberfläche",
    "modules.group.instruments": "Instrumente",
    "modules.group.diagnostics": "Diagnose",
    "modules.group.location": "Standort & Radie",
    "modules.group.map": "Karte",
    "modules.group.history": "Verlauf",
    "modules.detail.status": "Status",
    "modules.detail.version": "Version",
    "modules.detail.expected": "Erwartet",
    "modules.detail.file": "Datei",
    "modules.detail.loaded": "Glade",
    "modules.detail.functions": "Funktionen"
  }
});
export const installI18nSettings=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _languageEntity() {
      return this._resolveSettingEntity('language',this._config.language_entity);
    },

    _languageValue(hass = this._hass) {
      if (this._languagePreview && LANGUAGE_DEFINITIONS.some((entry) => entry.value === this._languagePreview)) return this._languagePreview;
      const raw = String(hass?.states?.[this._languageEntity()]?.state || '').trim();
      return LANGUAGE_DEFINITIONS.some((entry) => entry.value === raw) ? raw : LANGUAGE_DEFAULT;
    },

    _languageDefinition() {
      const value = this._languageValue();
      return LANGUAGE_DEFINITIONS.find((entry) => entry.value === value) || LANGUAGE_DEFINITIONS[1];
    },


    _distanceUnitEntity() {
      return this._resolveSettingEntity('distance_unit',this._config.distance_unit_entity);
    },

    _distanceUnitValue(hass = this._hass) {
      const preview = String(this._distanceUnitPreview || '').trim().toUpperCase();
      if (preview === 'MI' || preview === 'KM') return preview;
      const raw = String(hass?.states?.[this._distanceUnitEntity()]?.state || '').trim().toUpperCase();
      return raw === 'MI' ? 'MI' : 'KM';
    },

    _distanceUnitLabel() {
      return DISTANCE_UNIT_LABELS[this._languageValue()] || DISTANCE_UNIT_LABELS[LANGUAGE_DEFAULT];
    },

    _formatDistance(distanceKm,{nearUnits = true} = {}) {
      const km = finiteNumber(distanceKm);
      if (km == null) return { text:'–',value:'–',unit:'',near:false };
      const near = km < METRIC_NEAR_THRESHOLD_KM;
      if (this._distanceUnitValue() === 'MI') {
        const mi = Math.max(0,km * KM_TO_MI);
        if (nearUnits && mi < IMPERIAL_FEET_THRESHOLD_MI) {
          const feet = Math.max(0,Math.round(km * KM_TO_FT));
          return { text:`${feet} FT`,value:String(feet),unit:'FT',near };
        }
        const decimals = mi < 1 ? 2 : 1;
        const value = mi.toFixed(decimals);
        return { text:`${value} MI`,value,unit:'MI',near };
      }
      if (nearUnits && km < METRIC_NEAR_THRESHOLD_KM) {
        const meters = Math.max(0,Math.round(km * 1000));
        return { text:`${meters} M`,value:String(meters),unit:'M',near };
      }
      const value = km.toFixed(1);
      return { text:`${value} KM`,value,unit:'KM',near };
    },

    _formatRadiusDistance(distanceKm) {
      const km = finiteNumber(distanceKm);
      if (km == null) return { text:'–',value:'–',unit:this._distanceUnitValue() };
      if (this._distanceUnitValue() === 'MI') {
        const value = Math.max(0,km * KM_TO_MI).toFixed(1);
        return { text:`${value} MI`,value,unit:'MI' };
      }
      const value = fmtNumber(km,Number.isInteger(km) ? 0 : 1);
      return { text:`${value} KM`,value,unit:'KM' };
    },

    _displayRadiusToKm(value) {
      const raw = finiteNumber(value);
      if (raw == null) return null;
      return this._distanceUnitValue() === 'MI' ? raw / KM_TO_MI : raw;
    },

    _distanceMessage(key,distanceKm) {
      const formatted = this._formatDistance(distanceKm);
      return this._t(key,{distance:formatted.value}).replace(/\bKM\b/g,formatted.unit || 'KM');
    },

    _radiusRangeText(minKm,maxKm) {
      const min = this._formatRadiusDistance(minKm);
      const max = this._formatRadiusDistance(maxKm);
      const unit = min.unit || max.unit || this._distanceUnitValue();
      return this._t('radius.allowed_range',{min:min.value,max:max.value}).replace(/\bKM\b/g,unit);
    },

    _t(key, vars = {}) {
      const language = this._languageValue();
      const fallback = I18N[LANGUAGE_DEFAULT]?.strings || {};
      const table = I18N[language]?.strings || fallback;
      const extraFallback = SETTINGS_UI_TRANSLATIONS[LANGUAGE_DEFAULT] || SETTINGS_UI_TRANSLATIONS.English || {};
      const extra = SETTINGS_UI_TRANSLATIONS[language] || extraFallback;
      const aboutKey = key.startsWith('about.') ? key.slice(6) : null;
      let text = aboutKey
        ? resolveAboutLocale(language).strings[aboutKey] ?? key
        : extra[key] ?? table[key] ?? extraFallback[key] ?? fallback[key] ?? I18N['Deutsch']?.strings?.[key] ?? key;
      return String(text).replace(/\{([a-zA-Z0-9_]+)\}/g,(_,name) =>
        Object.prototype.hasOwnProperty.call(vars,name) ? String(vars[name]) : `{${name}}`
      );
    },

    _tp(base,count,vars = {}) {
      const n = Number(count) || 0;
      let suffix = n === 1 ? 'one' : 'many';
      if (this._languageValue() === 'Polski' && n !== 1) {
        const mod10 = Math.abs(n) % 10;
        const mod100 = Math.abs(n) % 100;
        suffix = mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14) ? 'few' : 'many';
      }
      return this._t(`${base}.${suffix}`,{count:n,...vars});
    },

    _locale() {
      return I18N[this._languageValue()]?.locale || 'en-GB';
    },

    _toCardinal(deg) {
      if (deg == null || Number.isNaN(Number(deg))) return '–';
      const n = ((Number(deg) % 360) + 360) % 360;
      const values = I18N[this._languageValue()]?.cardinals || I18N[LANGUAGE_DEFAULT].cardinals;
      return values[Math.round(n / 22.5) % 16];
    },

    _toCardinalName(deg) {
      if (deg == null || Number.isNaN(Number(deg))) return '–';
      const n = ((Number(deg) % 360) + 360) % 360;
      const values = I18N[this._languageValue()]?.cardinalNames || I18N[LANGUAGE_DEFAULT].cardinalNames;
      return values[Math.round(n / 22.5) % 16];
    },

    _applyStaticTranslations() {
      if (!this.shadow) return;
      this._i18nTextNodeKeys = this._i18nTextNodeKeys || new WeakMap();
      this._i18nAttrKeys = this._i18nAttrKeys || new WeakMap();

      const dynamicRoots = new Set([
        'about-shell','header-status','radar-subtitle-location','radar-subtitle-window','warn-text','animation-state',
        'settings-location-coordinates','location-main-current','location-main-button','settings-location-button','mode-main',
        'map-legend','recent-content','recent-filter-stack','kpi-cardinal','kpi-time','hit-live','footer-update','device-main',
        'compass-caption','history-sub','trend-value','trend-sub','radius-keypad-title','radius-keypad-limit'
      ]);
      const underDynamicRoot = (node) => {
        let el = node?.parentElement || null;
        while (el && el !== this.shadow) {
          if (el.id && dynamicRoots.has(el.id)) return true;
          el = el.parentElement;
        }
        return false;
      };

      const walker = document.createTreeWalker(this.shadow,NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (underDynamicRoot(node)) continue;
        let key = this._i18nTextNodeKeys.get(node);
        const raw = String(node.nodeValue || '');
        const trimmed = raw.trim();
        if (!key && trimmed) {
          key = I18N_STATIC_TEXT_KEYS.get(trimmed) || null;
          if (key) this._i18nTextNodeKeys.set(node,key);
        }
        if (!key) continue;
        const lead = raw.match(/^\s*/)?.[0] || '';
        const trail = raw.match(/\s*$/)?.[0] || '';
        let vars = {};
        if (key === 'subtitle.strikes_around') vars = {location:this._t('location.home')};
        else if (key === 'subtitle.last_minutes' || key === 'history.title') vars = {minutes:HISTORY_MINUTES};
        else if (key === 'history.bucket') vars = {minutes:HISTORY_BUCKET_MINUTES};
        else if (key === 'map.active_under') vars = {minutes:ACTIVE_MINUTES};
        else if (key === 'map.age_range') vars = {from:10,to:120};
        node.nodeValue = `${lead}${this._t(key,vars)}${trail}`;
      }

      const clusterCurrent=this.shadow.getElementById('settings-cluster-resolution-current');
      if(clusterCurrent){
        const profile=this._clusterResolutionProfileV40822||'balanced';
        clusterCurrent.textContent=getClusterResolutionProfileLabel(profile,this._languageValue());
      }
      this._syncModuleTranslations?.();
      if(this.shadow.getElementById('settings-modules-section')?.open)this._syncModuleView?.();

      this.shadow.querySelectorAll('[title],[aria-label]').forEach((el) => {
        if (el.id && ['status-chip','map-recenter','settings-tests-toggle','settings-location-main-toggle'].includes(el.id)) return;
        let store = this._i18nAttrKeys.get(el);
        if (!store) {
          store = {};
          this._i18nAttrKeys.set(el,store);
        }
        ['title','aria-label'].forEach((attr) => {
          if (!el.hasAttribute(attr)) return;
          let key = store[attr];
          if (!key) {
            key = I18N_STATIC_ATTR_KEYS.get(el.getAttribute(attr)) || null;
            if (key) store[attr] = key;
          }
          if (key) el.setAttribute(attr,this._t(key));
        });
      });
    },

    _resolveSettingEntity(key,configured) {
      if (configured) return configured;
      const mapping = SETTING_ENTITIES[key];
      if (!mapping) return null;
      const nativeState = this._hass?.states?.[mapping.native];
      const nativeUsable = nativeState
        && nativeState.state !== 'unavailable'
        && nativeState.state !== 'unknown';
      return nativeUsable ? mapping.native : mapping.legacy;
    },

    _languageOnboardingComplete() {
      return this._hass?.states?.[this._languageInitializationEntity()]?.state === 'on';
    },

    _languageInitializationEntity() {
      const mapping = LANGUAGE_INITIALIZATION_ENTITIES;
      if (this._config.language_initialized_entity) return this._config.language_initialized_entity;
      const nativeState = this._hass?.states?.[mapping.native];
      const nativeUsable = nativeState && !['unknown','unavailable'].includes(nativeState.state);
      return nativeUsable ? mapping.native : mapping.legacy;
    },

    _initialLanguageChoice() {
      const raw = this._hass?.locale?.language || this._hass?.language || '';
      const base = String(raw).trim().toLowerCase().replace(/_/g,'-').split('-')[0];
      const code = base === 'no' ? 'nb' : base;
      return LANGUAGE_DEFINITIONS.find(entry => entry.group === 'main' && entry.code === code)?.value || LANGUAGE_DEFAULT;
    },

    _openLanguageOnboarding() {
      if (this._languageOnboardingDialog || deps.languageOnboardingOwner?.isConnected || !this.shadow) return;
      deps.languageOnboardingOwner = this;
      const shell = document.createElement('div');
      shell.id = 'language-onboarding-shell';
      shell.innerHTML = '<style>' +
        '.language-onboarding{box-sizing:border-box;width:min(540px,calc(100vw - 24px));max-width:calc(100vw - 24px);max-height:calc(100dvh - 24px);padding:0;border:1px solid #c9a86a;border-radius:14px;color:#e7e3db;background:radial-gradient(ellipse at 100% 0,#263d4d66,transparent 60%),linear-gradient(145deg,#111e27,#081117);box-shadow:0 24px 70px #0009,inset 0 0 0 3px #b18b3520;font:14px/1.45 Segoe UI,Arial,sans-serif;overflow:hidden;color-scheme:dark}' +
        '.language-onboarding::backdrop{background:#03070bdd}.language-onboarding *{box-sizing:border-box}.language-onboarding form{display:flex;flex-direction:column;max-height:calc(100dvh - 26px);margin:0}.language-onboarding header{display:flex;align-items:center;gap:16px;padding:22px 22px 12px;flex:none}.language-onboarding header img{width:62px;height:62px;object-fit:contain}.language-onboarding h2{font-size:22px;line-height:1.2;color:#f5dfac;margin:0 0 4px}.language-onboarding header p{margin:0;color:#c5b58f}.language-onboarding .language-intro{width:100%;margin:0;padding:0 22px 16px;color:#c4cbd0;font-size:clamp(14px,calc(10px + 1.1vw),15px);line-height:1.5;flex:none}.language-onboarding .language-intro span{display:block}.language-onboarding .language-intro span+span{margin-top:6px}.language-onboarding .language-options{padding:0 22px 6px;overflow:auto;min-height:0;overscroll-behavior:contain;scrollbar-color:#a4864c #0a141c;touch-action:pan-y}.language-onboarding fieldset{border:0;padding:0;margin:0 0 14px;min-width:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.language-onboarding legend{padding:0 0 8px;color:#ddc28c;font-size:clamp(14px,calc(10px + 1.1vw),15px);line-height:1.35;font-weight:650}.language-onboarding label{display:flex;align-items:center;gap:10px;min-height:44px;padding:9px 12px;border:1px solid #a488453b;border-radius:7px;background:#101e28;cursor:pointer}.language-onboarding label:has(:checked){border-color:#e4c17b;background:linear-gradient(115deg,#6a51254a,#172630);color:#ffe4ad}.language-onboarding input{accent-color:#e7c274;margin:0;flex:none}.language-onboarding :focus-visible{outline:2px solid #ffe1a1;outline-offset:3px}.language-onboarding label:has(:focus-visible){outline:2px solid #ffe1a1;outline-offset:1px}.language-onboarding footer{padding:12px 22px 18px;border-top:1px solid #b99a483b;flex:none;background:#08131b}.language-onboarding button{min-height:44px;width:100%;border:1px solid #f3d18b;border-radius:7px;background:linear-gradient(#f3d28e,#bc9346);color:#211b10;font:600 14px Segoe UI,Arial,sans-serif;cursor:pointer;touch-action:manipulation}.language-onboarding button:disabled{opacity:.65;cursor:wait}.language-onboarding .language-error{margin:0 0 8px;color:#ffceaa;font-size:12px}.language-onboarding .language-error:empty{display:none}@media(hover:hover){.language-onboarding label:hover{background:#233442}.language-onboarding button:hover{filter:brightness(1.06)}}@media(max-width:380px){.language-onboarding fieldset{grid-template-columns:1fr}.language-onboarding header{padding:16px 16px 10px;gap:10px}.language-onboarding h2{font-size:19px}.language-onboarding .language-options{padding-left:16px;padding-right:16px}.language-onboarding .language-intro{padding-left:16px;padding-right:16px}}' +
        '</style><dialog class="language-onboarding" aria-modal="true" aria-labelledby="language-onboarding-title" aria-describedby="language-onboarding-intro"><form><header><img src="' + ABOUT_LOGO + '" alt="Gewitterradar" width="62" height="62"><div><h2 id="language-onboarding-title">Choose your language</h2><p lang="de">Sprache wählen</p></div></header><p id="language-onboarding-intro" class="language-intro"><span lang="en">Choose the language for Gewitterradar. You can change it again at any time in Settings.</span><span lang="de">Wähle die Sprache für Gewitterradar. Du kannst sie jederzeit in den Einstellungen ändern.</span></p><div class="language-options"></div><footer><p class="language-error" role="alert"></p><button type="submit">Weiter / Continue</button></footer></form></dialog>';
      const dialog = shell.querySelector('dialog'),choice = this._initialLanguageChoice();
      for (const [group,title] of [['main','Sprachen / Languages'],['fun','Deutsche Dialekte / German dialects']]) {
        const fieldset = document.createElement('fieldset'),legend = document.createElement('legend');
        legend.textContent = title;fieldset.append(legend);
        for (const entry of LANGUAGE_DEFINITIONS.filter(item => item.group === group)) {
          const label = document.createElement('label'),input = document.createElement('input'),text = document.createElement('span');
          input.type = 'radio';input.name = 'language';input.value = entry.value;input.checked = entry.value === choice;
          text.textContent = entry.value;label.append(input,text);fieldset.append(label);
        }
        shell.querySelector('.language-options').append(fieldset);
      }
      this._languageOnboardingReturnFocus = this.shadow.activeElement;
      this.shadow.append(shell);this._languageOnboardingDialog = dialog;
      dialog.addEventListener('cancel',event => { event.preventDefault();event.stopPropagation(); });
      dialog.addEventListener('keydown',event => {
        if (event.key === 'Escape') { event.preventDefault();event.stopPropagation(); }
        if (event.key !== 'Tab') return;
        const first = dialog.querySelector('input:checked'),last = dialog.querySelector('button');
        const active = this.shadow.activeElement;
        if (event.shiftKey && active === first) { event.preventDefault();last.focus(); }
        else if (!event.shiftKey && active === last) { event.preventDefault();first.focus(); }
      });
      dialog.querySelector('form').addEventListener('submit',event => {event.preventDefault();this._confirmLanguageOnboarding();});
      dialog.showModal();dialog.querySelector('input:checked').focus();
    },

    async _confirmLanguageOnboarding() {
      const dialog = this._languageOnboardingDialog;
      if (!dialog || this._languageOnboardingSubmitting) return;
      const value = dialog.querySelector('input:checked')?.value;
      if (!LANGUAGE_DEFINITIONS.some(entry => entry.value === value)) return;
      const button = dialog.querySelector('button'),error = dialog.querySelector('.language-error');
      this._languageOnboardingSubmitting = true;button.disabled = true;error.textContent = '';
      try {
        if (this._languageOnboardingComplete()) { this._closeLanguageOnboarding(true); return; }
        const marker = this._languageInitializationEntity(),markerState = this._hass?.states?.[marker]?.state;
        if (!['on','off'].includes(markerState) || !['switch','input_boolean'].includes(marker?.split('.')[0])) throw Error('Global language marker unavailable');
        const entity = this._languageEntity(),state = this._hass?.states?.[entity];
        if (!state || ['unknown','unavailable'].includes(state.state)) throw Error('Language setting unavailable');
        const written = await this._selectSetting(entity,value);
        if (written === false) throw Error('Language setting cannot be written');
        if (this._languageOnboardingDialog !== dialog || !this.isConnected) return;
        // Reuse the regular selector's transient preview until HA confirms its state.
        this._languagePreview = value;
        await this._hass.callService(marker.split('.')[0],'turn_on',{entity_id:marker});
        // Advance only after the global HA state is visible, never from a local marker.
        const deadline = Date.now() + 10000;
        while (!this._languageOnboardingComplete()) {
          if (this._languageOnboardingDialog !== dialog || !this.isConnected) return;
          if (Date.now() >= deadline) throw Error('Global language marker not confirmed');
          await new Promise(resolve => setTimeout(resolve,50));
        }
        this._closeLanguageOnboarding(true);
        this._render();this._maybeOpenAbout();
      } catch (_) {
        if (this._languageOnboardingDialog === dialog) {
          error.textContent = 'Sprache konnte nicht gespeichert werden. Bitte erneut versuchen. / Could not save the language. Please try again.';
          button.disabled = false;button.focus();
        }
      } finally { this._languageOnboardingSubmitting = false; if (this._languageOnboardingComplete()) this._maybeOpenAbout(); }
    },

    _closeLanguageOnboarding(restoreFocus = false) {
      const dialog = this._languageOnboardingDialog,previous = this._languageOnboardingReturnFocus;
      this._languageOnboardingDialog = null;this._languageOnboardingReturnFocus = null;
      if (dialog) { dialog.close();dialog.parentElement?.remove(); }
      if (deps.languageOnboardingOwner === this) deps.languageOnboardingOwner = null;
      if (restoreFocus && previous?.isConnected) previous.focus({preventScroll:true});
    },

    _maybeOpenAbout() {
      if (!this.isConnected || !this._built || !this._hass) return;
      // Editor previews must never consume the browser's first regular start.
      for (let node = this; node; node = node.parentElement || node.getRootNode?.().host) {
        if (/^(hui-card-preview|hui-dialog-edit-card|hui-card-element-editor)$/.test(node.localName || '')) return;
      }
      if (!this._languageOnboardingComplete()) { this._openLanguageOnboarding(); return; }
      if (deps.languageOnboardingOwner?._languageOnboardingSubmitting) return;
      this._closeLanguageOnboarding(true);
      if (deps.aboutClaimedVersion >= ABOUT_ONBOARDING_VERSION) return;
      let seen = 0;
      try { seen = Number(localStorage.getItem(ABOUT_STORAGE_KEY)) || 0; } catch (_) {}
      if (seen >= ABOUT_ONBOARDING_VERSION) return;
      this._openAbout();
    },

    _syncHelpMenu(loadExternal = true) {
      if (!this.shadow) return;
      const language = this._languageValue(), locale = resolveAboutLocale(language);
      const label = this.shadow.getElementById('settings-help-label');
      if (label) label.textContent = locale.help.menuTitle;
      if (loadExternal) requestAboutLocale(language, () => {
        if (this._languageValue() !== language) return;
        this._syncHelpMenu(false);
        if (this._helpDialog?.open) this._syncHelp();
      });
    },

    _openHelp() {
      if (this._helpDialog?.open || !this.isConnected || !this.shadow) return;
      const shell = document.createElement('div');
      shell.id = 'help-shell';
      shell.innerHTML = '<style>' +
        '.help-dialog{--help-gold:#dfbc72;--help-bright:#f7dfa1;box-sizing:border-box;width:min(760px,calc(100vw - 16px));max-width:calc(100vw - 16px);height:min(900px,calc(100dvh - 16px));max-height:calc(100dvh - 16px);padding:0;border:1px solid #c9a050;border-radius:13px;color:#d5dae0;background:radial-gradient(ellipse at 15% 0,#31445145,transparent 48%),#091219;box-shadow:0 24px 90px #000c,inset 0 0 0 3px #cda9500c;font:14px/1.48 Segoe UI,Arial,sans-serif;overflow:hidden;color-scheme:dark}' +
        '.help-dialog[open]{display:flex;flex-direction:column}.help-dialog::backdrop{background:#03070be0}.help-dialog *{box-sizing:border-box}.help-head{position:relative;display:grid;grid-template-columns:48px minmax(0,1fr) 44px;align-items:center;gap:14px;padding:16px 12px 14px 18px;border-bottom:1px solid #a9874755;background:linear-gradient(180deg,#162630,#0b151c)}' +
        '.help-emblem{display:grid;place-items:center;width:44px;height:44px;border:1px solid #bc974f88;border-radius:50%;color:#f4d58e;background:radial-gradient(circle at 35% 28%,#f8e3a847,#8d652a42 45%,#09131a 72%);box-shadow:inset 0 1px #fff4,0 0 12px #d69a2130;font:700 23px/1 Georgia,serif}.help-head h2{margin:0;color:#f6e9cc;font-size:25px;line-height:1.15}.help-head p{margin:4px 0 0;color:#bfc7cf;font-size:13px}.help-close{width:44px;height:44px;border:0;background:transparent;color:#efd391;font-size:27px;border-radius:7px}.help-close:focus-visible,.help-copy:focus-visible,.help-dialog summary:focus-visible{outline:2px solid #ffe1a1;outline-offset:-2px}' +
        '.help-content{min-height:0;overflow:auto;padding:10px;overscroll-behavior:contain;touch-action:pan-y;scrollbar-width:thin;scrollbar-color:#9a7f4755 transparent}.help-section{margin:0 0 8px;border:1px solid #8d713d70;border-radius:9px;background:linear-gradient(110deg,#a4843818,#0b171e70 30%,#15202645);box-shadow:inset 0 1px #ffe6ad0b;overflow:hidden}.help-section[open]{border-color:#c69d4f9c;box-shadow:inset 0 1px #fff2,0 0 11px #d69a2116}.help-dialog summary{display:grid;grid-template-columns:34px minmax(0,1fr) 20px;align-items:center;gap:11px;min-height:52px;padding:8px 13px;list-style:none;cursor:pointer;color:var(--help-bright);font-weight:700}.help-dialog summary::-webkit-details-marker{display:none}.help-section-icon{display:grid;place-items:center;width:31px;height:31px;border:1px solid #b68e486e;border-radius:50%;color:#e9c87e;background:linear-gradient(145deg,#8d672936,#071017);box-shadow:inset 0 1px #fff2;font-size:17px}.help-chevron{width:14px;height:14px;border-right:2px solid #dfbd72;border-bottom:2px solid #dfbd72;transform:rotate(45deg);transition:transform .16s ease,filter .16s ease;margin:-6px 3px 0 0;filter:drop-shadow(0 0 2px #d5a74955)}.help-section[open] .help-chevron{transform:rotate(225deg);margin-top:6px;filter:brightness(1.2) drop-shadow(0 0 3px #edc66d75)}' +
        '.help-section-body{padding:0 15px 15px 58px;border-top:1px solid #a9874728}.help-section-body p{margin:12px 0 0}.help-section-body ul{margin:10px 0 0;padding-left:19px}.help-section-body li{margin:6px 0}.help-note{padding:9px 11px;border-left:2px solid #c69d50;background:#050d127a;color:#d9caa9}.help-entries{margin:8px 0 0}.help-entries dt{margin-top:9px;color:#efd18c;font-weight:700}.help-entries dd{margin:2px 0 0;color:#cbd1d7}.help-network-highlight{color:#f2cf82;font-weight:700;text-shadow:0 0 6px rgba(218,166,67,.16)}.help-maptiler-link,.help-coordinate-example{color:#f4cf79!important;font-weight:800;text-shadow:0 0 6px rgba(218,166,67,.20)}.help-maptiler-link{text-decoration:none;border-bottom:1px solid rgba(244,207,121,.42)}.help-maptiler-link:hover,.help-maptiler-link:focus-visible{color:#ffe3a0!important;border-bottom-color:#ffe3a0;outline:none}.help-code-wrap{position:relative;margin-top:12px;border:1px solid #8b723e55;border-radius:7px;background:#061017;overflow:hidden}.help-code-wrap pre{margin:0;padding:12px 62px 12px 13px;white-space:pre-wrap;overflow-wrap:anywhere;color:#cbd5df;font:12px/1.45 Consolas,"Liberation Mono",monospace}.help-copy{position:absolute;right:5px;top:4px;width:44px;height:44px;border:0;background:transparent;color:#efd391;font-size:22px}.help-copy-status{position:absolute;right:9px;bottom:3px;color:#f7dfa1;font-size:10px;background:#061017e8}' +
        '@media(hover:hover) and (pointer:fine){.help-dialog summary:hover{background:#e1b85f0b}.help-close:hover,.help-copy:hover{color:#ffe4a3;filter:drop-shadow(0 0 3px #e0ad4c88)}}@media(max-width:520px){.help-dialog{font-size:13px}.help-head{grid-template-columns:42px minmax(0,1fr) 44px;gap:9px;padding-left:12px}.help-emblem{width:38px;height:38px}.help-head h2{font-size:21px}.help-head p{font-size:12px}.help-content{padding:7px}.help-section-body{padding:0 12px 13px}.help-dialog summary{grid-template-columns:31px minmax(0,1fr) 18px;padding:7px 10px}.help-code-wrap pre{font-size:10.5px;padding-left:9px}}' +
        /* V4.06 accepted UI polish: stable Help frame and shared premium controls. */
        '.help-dialog{position:relative;border-color:rgba(238,194,99,.94);box-shadow:0 24px 90px #000c,inset 0 0 0 1px rgba(255,235,184,.09),inset 0 1px rgba(255,247,224,.13),0 0 28px rgba(215,164,67,.14)}.help-dialog::after{content:"";position:absolute;inset:1px;border:1px solid rgba(255,222,148,.38);border-radius:11.75px;box-shadow:inset 0 0 0 1px rgba(120,76,12,.10),0 0 9px rgba(229,178,78,.08);pointer-events:none;z-index:40}.help-close{position:relative;display:grid;place-items:center;color:transparent;font-size:0;line-height:0;background:transparent}.help-close img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}.help-copy{display:grid;place-items:center;color:transparent;font-size:0;line-height:0}.help-copy img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}.help-section-icon{display:grid!important;place-items:center!important;line-height:0!important;text-align:center}.help-section-icon svg{display:block;width:24px;height:24px;overflow:visible;filter:drop-shadow(0 0 2px rgba(226,180,74,.22))}.help-section-icon[data-help-icon="prerequisites"] svg{width:27px;height:27px}.help-section-icon[data-help-icon="functions"] svg{width:25px;height:25px}.help-close:active img,.help-copy:active img{transform:scale(.97);filter:brightness(.92)}@media(hover:hover) and (pointer:fine){.help-dialog{border-color:rgba(244,201,108,.99);box-shadow:0 24px 90px #000c,inset 0 0 0 1px rgba(255,235,184,.10),inset 0 1px rgba(255,247,224,.14),0 0 0 1px rgba(246,203,110,.42),0 0 30px rgba(215,164,67,.16)}.help-dialog::after{border-color:rgba(255,228,158,.50);box-shadow:inset 0 0 0 1px rgba(120,76,12,.10),0 0 10px rgba(229,178,78,.11)}.help-close:hover,.help-copy:hover{filter:none;background:transparent}.help-close:hover img,.help-copy:hover img{filter:brightness(1.12) drop-shadow(0 0 2px #dba34c70)}}@media(hover:none) and (pointer:coarse){.help-close:focus-visible{outline:none}}.help-dialog{border:2px solid transparent;background:radial-gradient(ellipse at 15% 0,#31445145,transparent 48%) padding-box,linear-gradient(#091219,#091219) padding-box,linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c) border-box;box-shadow:0 24px 90px #000c,inset 0 0 0 1px rgba(255,235,184,.07),inset 0 1px rgba(255,247,224,.10),0 0 8px rgba(215,164,67,.05)}.help-dialog::after{content:none!important}.help-section-icon[data-help-icon="functions"] svg{width:27px;height:27px;filter:drop-shadow(0 1px .5px #4c301c) drop-shadow(0 -1px .4px #f5d5a555)}' +
        '.help-emblem{border:0!important;background:transparent!important;box-shadow:none!important;overflow:visible}.help-emblem img{display:block;width:44px;height:44px;object-fit:contain;filter:drop-shadow(0 2px 3px #0008) drop-shadow(0 0 4px #d8a54b44)}.help-close img{width:38px!important;height:38px!important;filter:drop-shadow(0 2px 3px #0009) drop-shadow(0 0 3px #d9a84b44)}.help-section-icon{width:34px!important;height:34px!important;border:0!important;background:transparent!important;box-shadow:none!important;overflow:visible}.help-section-icon img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;filter:drop-shadow(0 2px 3px #0009) drop-shadow(0 0 3px #d7a2463d);transform:translateZ(0)}.help-section-icon[data-help-icon="external_services"] img{width:35px;height:35px}.help-section-icon[data-help-icon="functions"] img{width:34px;height:34px}.help-chevron{border-color:#f1ca74!important;filter:drop-shadow(0 1px .5px #4c301c) drop-shadow(0 0 3px #d8a74a66)!important}@media(max-width:520px){.help-emblem img{width:38px;height:38px}.help-section-icon{width:33px!important;height:33px!important}.help-section-icon img{width:33px;height:33px}.help-section-icon[data-help-icon="external_services"] img{width:34px;height:34px}}' +
        '.help-dialog{position:relative}.help-close{position:absolute!important;top:10px!important;right:10px!important;margin:0!important;z-index:60!important}.help-head{padding-right:64px!important}.help-close img{width:34px!important;height:34px!important;filter:none!important}.help-emblem img{width:42px!important;height:42px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:none!important}.help-section-icon[data-help-icon="troubleshooting"] img{width:38px!important;height:38px!important;object-fit:contain!important;object-position:50% 50%!important;filter:none!important;transform:none!important}@media(max-width:520px){.help-emblem img{width:38px!important;height:38px!important}.help-section-icon[data-help-icon="troubleshooting"] img{width:36px!important;height:36px!important}}' +
        '.help-radius-list{list-style:none!important;padding-left:0!important;margin-top:11px!important}.help-radius-item{display:flex;align-items:flex-start;gap:10px;margin:8px 0!important}.help-radius-bullet{display:inline-block;width:14px;height:14px;flex:0 0 14px;margin-top:.28em;border-radius:50%;background:var(--help-radius-metal);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 2.5px),#000 calc(100% - 2.2px));mask:radial-gradient(farthest-side,transparent calc(100% - 2.5px),#000 calc(100% - 2.2px));filter:drop-shadow(0 1px 1px #000b) drop-shadow(0 0 3px var(--help-radius-glow))}.help-radius-item[data-radius-tone="observation"]{--help-radius-metal:conic-gradient(from 215deg,#6b400c 0deg,#d89d2c 48deg,#fff3b5 86deg,#bb7617 145deg,#5a350c 205deg,#e7b646 270deg,#fff0a0 315deg,#6b400c 360deg);--help-radius-glow:#d9a84b66}.help-radius-item[data-radius-tone="storm"]{--help-radius-metal:conic-gradient(from 215deg,#17385a 0deg,#5b9bd3 48deg,#d9f1ff 86deg,#3471aa 145deg,#102b47 205deg,#74b9ea 270deg,#e5f6ff 315deg,#17385a 360deg);--help-radius-glow:#6fb7e866}.help-radius-item[data-radius-tone="danger"]{--help-radius-metal:conic-gradient(from 215deg,#5a1717 0deg,#b94b42 48deg,#ffd2c9 86deg,#98332d 145deg,#471111 205deg,#d8675b 270deg,#ffe0d8 315deg,#5a1717 360deg);--help-radius-glow:#d65a5066}.help-section[data-help-section="location"] .help-entries dt{margin-top:13px;padding-top:8px;border-top:1px solid rgba(198,157,79,.16)}.help-section[data-help-section="location"] .help-entries dt:first-child{border-top:0;padding-top:0}.help-inline-subentry{margin-top:13px;padding-top:8px;border-top:1px solid rgba(198,157,79,.16)}.help-inline-subentry-title{color:#efd18c;font-weight:700}.help-inline-subentry-body{margin-top:2px;color:#cbd1d7}.help-recorder-priority{border-left:3px solid #e0ad4c;background:linear-gradient(90deg,rgba(224,173,76,.15),rgba(224,173,76,.025))}.help-entries dt.help-recorder-priority{margin-top:14px;padding:9px 11px 3px;color:#ffe2a0}.help-entries dd.help-recorder-priority{margin-top:0;padding:3px 11px 10px;color:#f0dfb9}.help-section[data-help-section="recorder"] summary{background:linear-gradient(90deg,rgba(224,173,76,.13),rgba(224,173,76,.025))}.help-feature-block{margin:15px 0 4px;padding:11px 0 0;border-top:1px solid rgba(198,157,79,.18)}.help-feature-block-title{margin:0 0 5px;color:#efd18c;font-weight:700}.help-feature-block-body{margin:0;color:#cbd1d7}.help-inline-infinity-gfx{display:inline-block;width:32px;height:22px;object-fit:contain;vertical-align:-.37em;margin:0 3px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.58));}.help-layer-graphic-card{margin:14px 0 5px;padding:4px 0 3px;display:grid;grid-template-columns:88px minmax(0,1fr);align-items:center;gap:14px;border:0;border-radius:0;background:transparent;box-shadow:none}.help-layer-graphic{display:block;width:82px;height:82px;object-fit:contain;filter:drop-shadow(0 6px 9px rgba(0,0,0,.52)) drop-shadow(0 0 6px rgba(246,195,68,.14))}.help-layer-graphic-caption{color:#d5dae0;font-weight:400;line-height:1.48}.help-section-icon[data-help-icon="mapview"]{width:34px!important;height:34px!important;border:1px solid rgba(205,164,79,.88)!important;border-radius:50%!important;background:radial-gradient(circle at 35% 28%,rgba(248,227,168,.18),rgba(141,101,42,.18) 48%,rgba(7,16,23,.96) 74%)!important;box-shadow:inset 0 1px rgba(255,240,195,.22),0 1px 3px rgba(0,0,0,.72),0 0 4px rgba(216,165,75,.20)!important;overflow:visible!important}.help-section-icon[data-help-icon="mapview"] img{width:25px;height:25px;object-fit:contain;filter:drop-shadow(0 1px 3px rgba(0,0,0,.58)) drop-shadow(0 0 2px rgba(218,166,67,.20))}@media(max-width:520px){.help-layer-graphic-card{grid-template-columns:88px minmax(0,1fr);gap:12px;padding:4px 0 3px}.help-layer-graphic{width:82px;height:82px}}' +
        '.help-dialog{height:auto!important;min-height:0!important;max-height:min(900px,calc(100dvh - 16px))!important}.help-content{flex:0 1 auto}.help-process-highlight{display:inline-block;padding:1px 6px;border:1px solid rgba(225,190,110,.46);border-radius:5px;color:#e8d6a5!important;background:linear-gradient(180deg,rgba(104,76,29,.28),rgba(47,34,15,.32));box-shadow:inset 0 1px rgba(255,239,190,.10);font-weight:800;text-shadow:0 1px 1px rgba(0,0,0,.72)}.help-action-token{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;position:relative;font-weight:900;line-height:1;vertical-align:-.10em;-webkit-background-clip:border-box!important;background-clip:border-box!important}.help-action-save{height:1.56em;min-height:1.56em;padding:0 .52em;border:1px solid #b49753;border-radius:.29em;color:#f1dfad!important;letter-spacing:.008em;overflow:hidden;background:repeating-linear-gradient(0deg,rgba(255,255,255,.026) 0 1px,rgba(0,0,0,.025) 1px 3px),repeating-linear-gradient(96deg,rgba(255,255,255,.018) 0 1px,rgba(0,0,0,.020) 1px 4px),radial-gradient(ellipse at 30% 10%,rgba(255,244,201,.13) 0 8%,rgba(255,255,255,0) 40%),linear-gradient(180deg,#9a8040 0%,#665025 13%,#8b7135 38%,#6d5426 63%,#4a3516 100%);background-blend-mode:soft-light,soft-light,soft-light,normal;box-shadow:inset 0 0 0 1px rgba(35,23,6,.62),inset 0 0 0 2px rgba(238,210,141,.07),inset 0 1px 0 rgba(255,241,194,.24),inset 0 -2px 2px rgba(26,17,5,.52),inset 1px 0 0 rgba(255,228,164,.06),inset -1px 0 0 rgba(18,12,4,.44),0 1px 2px rgba(0,0,0,.66),0 0 0 1px rgba(12,8,2,.28);text-shadow:0 1px 0 rgba(20,13,3,.98),0 -1px 0 rgba(255,239,188,.16),0 0 1px rgba(255,224,145,.18)}.help-action-save:before{content:"";position:absolute;inset:2px;border:1px solid rgba(247,220,151,.11);border-radius:.18em;box-shadow:inset 0 1px 0 rgba(255,245,211,.08),inset 0 -1px 0 rgba(20,13,4,.32);pointer-events:none}.help-action-use{height:1.56em;min-height:1.56em;padding:0 .52em;border:1px solid #5d849c;border-radius:.29em;color:#e5edf2!important;letter-spacing:.008em;overflow:hidden;background:repeating-linear-gradient(0deg,rgba(255,255,255,.026) 0 1px,rgba(0,0,0,.025) 1px 3px),repeating-linear-gradient(96deg,rgba(255,255,255,.018) 0 1px,rgba(0,0,0,.020) 1px 4px),radial-gradient(ellipse at 30% 10%,rgba(219,241,255,.13) 0 8%,rgba(255,255,255,0) 40%),linear-gradient(180deg,#426d85 0%,#29495c 13%,#355d73 38%,#294b5f 63%,#1b3342 100%);background-blend-mode:soft-light,soft-light,soft-light,normal;box-shadow:inset 0 0 0 1px rgba(10,24,34,.62),inset 0 0 0 2px rgba(174,218,243,.07),inset 0 1px 0 rgba(225,246,255,.22),inset 0 -2px 2px rgba(7,18,25,.52),inset 1px 0 0 rgba(206,236,252,.06),inset -1px 0 0 rgba(7,17,24,.44),0 1px 2px rgba(0,0,0,.66),0 0 0 1px rgba(4,11,16,.28);text-shadow:0 1px 0 rgba(5,13,19,.98),0 -1px 0 rgba(222,244,255,.13),0 0 1px rgba(178,221,245,.16)}.help-action-use:before{content:"";position:absolute;inset:2px;border:1px solid rgba(174,218,243,.11);border-radius:.18em;box-shadow:inset 0 1px 0 rgba(226,246,255,.07),inset 0 -1px 0 rgba(7,18,25,.32);pointer-events:none}.help-action-delete,.help-action-restore{width:1.56em;height:1.56em;flex:0 0 1.56em;margin:0 .09em;padding:0;border-radius:50%;overflow:hidden;text-indent:-9999px;color:transparent!important;text-shadow:none!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.045),inset 0 0 0 3px rgba(0,0,0,.13),inset 0 1px 0 rgba(255,255,255,.14),inset 0 -2px 2px rgba(0,0,0,.48),0 0 0 1px rgba(0,0,0,.46),0 1px 2px rgba(0,0,0,.64)}.help-action-delete:before,.help-action-restore:before{position:absolute;left:50%;text-indent:0;font-family:Arial,Helvetica,sans-serif;font-weight:800;line-height:1;z-index:2;text-shadow:0 1px 0 rgba(0,0,0,.86),0 -1px 0 rgba(255,255,255,.10)}.help-action-delete:after,.help-action-restore:after{content:"";position:absolute;inset:2px;border-radius:50%;pointer-events:none;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),inset 0 -1px 0 rgba(0,0,0,.34)}.help-action-delete{border:1px solid #a25e57;background:repeating-conic-gradient(from 12deg,rgba(255,255,255,.022) 0deg 2deg,rgba(0,0,0,.030) 2deg 5deg),radial-gradient(circle at 33% 23%,rgba(255,224,215,.11) 0 7%,rgba(255,255,255,0) 29%),linear-gradient(180deg,#8d463f 0%,#5d2925 29%,#77362f 54%,#421a18 100%);background-blend-mode:soft-light,soft-light,normal}.help-action-delete:after{border:1px solid rgba(255,187,176,.16)}.help-action-delete:before{content:"×";top:50%;transform:translate(-50%,-54%);font-size:1.10em;color:#f0e5e1}.help-action-restore{border:1px solid #5d849c;background:repeating-conic-gradient(from 12deg,rgba(255,255,255,.022) 0deg 2deg,rgba(0,0,0,.030) 2deg 5deg),radial-gradient(circle at 33% 23%,rgba(219,241,255,.11) 0 7%,rgba(255,255,255,0) 29%),linear-gradient(180deg,#426d85 0%,#29495c 29%,#355d73 54%,#1b3342 100%);background-blend-mode:soft-light,soft-light,normal}.help-action-restore:after{border:1px solid rgba(174,218,243,.16)}.help-action-restore:before{content:"↶";top:43%;transform:translate(-50%,-50%);font-size:1.04em;color:#e5edf2}@supports(-webkit-touch-callout:none){@media(min-width:700px){.help-action-delete:before{top:50%;transform:translate(-50%,-50%);font-size:1.08em}.help-action-restore:before{content:"";top:50%;width:1.04em;height:1.04em;transform:translate(-50%,-50%);background:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22%3E%3Cpath d=%22M9.5 5.5 5 10l4.5 4.5M5.6 10h6.9c3.9 0 6.5 2.2 6.5 5.4 0 2.9-2.2 5.1-5.3 5.1h-3.4%22 fill=%22none%22 stroke=%22%23121b21%22 stroke-width=%224.2%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3Cpath d=%22M9.5 5.5 5 10l4.5 4.5M5.6 10h6.9c3.9 0 6.5 2.2 6.5 5.4 0 2.9-2.2 5.1-5.3 5.1h-3.4%22 fill=%22none%22 stroke=%22%23e5edf2%22 stroke-width=%222.35%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E") center/contain no-repeat}}}' +
        '</style><dialog class="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title"><header class="help-head"><span class="help-emblem" aria-hidden="true"><img src="' + HELP_REFINED_ICONS_V5.question + '" alt="" width="44" height="44" draggable="false"></span><div><h2 id="help-title"></h2><p class="help-subtitle"></p></div><button class="help-close" type="button" aria-label="Close"><img src="' + ABOUT_CLOSE_IMAGE + '" alt="" width="34" height="34" draggable="false"></button></header><div class="help-content"></div></dialog>';
      this._helpReturnFocus = this.shadow.activeElement;
      this.shadow.append(shell);
      const dialog = shell.querySelector('dialog');
      this._helpDialog = dialog;
      dialog.querySelector('.help-close').addEventListener('click',() => this._closeHelp());
      dialog.addEventListener('cancel',event => { event.preventDefault();event.stopPropagation();this._closeHelp(); });
      dialog.addEventListener('keydown',event => {
        if (event.key === 'Escape') { event.preventDefault();event.stopPropagation();this._closeHelp();return; }
        if (event.key !== 'Tab') return;
        const stops=[...dialog.querySelectorAll('button,summary')].filter(node=>node.getClientRects().length),first=stops[0],last=stops[stops.length-1],active=this.shadow.activeElement;
        if(event.shiftKey&&active===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&active===last){event.preventDefault();first.focus();}
        event.stopPropagation();
      });
      this._syncHelp();
      dialog.showModal();
      dialog.querySelector('.help-close').focus({preventScroll:true});
    },

    _syncHelp() {
      const dialog=this._helpDialog;
      if(!dialog)return;
      const language=this._languageValue(),locale=resolveAboutLocale(language),help=locale.help;
      dialog.querySelector('h2').textContent=help.title;
      dialog.querySelector('.help-subtitle').textContent=help.subtitle;
      dialog.querySelector('.help-close').setAttribute('aria-label',help.close);
      if(this._helpLocale!==help){
        const content=dialog.querySelector('.help-content'),openKeys=new Set([...content.querySelectorAll('details[open]')].map(node=>node.dataset.helpSection)),scrollTop=content.scrollTop;
        content.textContent='';
        const icons={prerequisites:'⌂',radii:'◎',location:'⌖',mapview:'▱',functions:'⚙',defaults:'✓',troubleshooting:'!',recorder:'▤'};
        /* Deterministic Help icons remove platform font-baseline drift on iPad/iPad Pro. */
        const premiumFunctionsIcon='<svg class="help-functions-welcome-gear" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><defs><linearGradient id="help-functions-welcome-metal" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#fff0bc"/><stop offset=".28" stop-color="#e8bd60"/><stop offset=".48" stop-color="#92703a"/><stop offset=".62" stop-color="#ffe2a0"/><stop offset="1" stop-color="#b58b44"/></linearGradient></defs><g stroke="url(#help-functions-welcome-metal)"><path d="M27 7Q32 5 37 7L38 14L43 17L50 14Q55 18 57 23L52 28V36L57 41Q55 46 50 50L43 47L38 50L37 57Q32 59 27 57L26 50L21 47L14 50Q9 46 7 41L12 36V28L7 23Q9 18 14 14L21 17L26 14Z"/><circle cx="32" cy="32" r="11"/><circle cx="32" cy="32" r="17" opacity=".25"/></g></svg>';
        const deterministicHelpIcons={prerequisites:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 10.5 12 3.5l8.5 7v9h-6v-5h-5v5h-6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>',radii:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4.7" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="1.25" fill="currentColor"/></svg>',location:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 2.8v4M12 17.2v4M2.8 12h4M17.2 12h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',functions:premiumFunctionsIcon,defaults:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m4.8 12.5 4.2 4.2 10.2-10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',troubleshooting:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4.3v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="18.4" r="1.35" fill="currentColor"/></svg>',external_services:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.8c2.25 1.76 4.62 2.75 7.35 3.06v5.25c0 4.72-2.88 8.27-7.35 10.09-4.47-1.82-7.35-5.37-7.35-10.09V5.86C7.38 5.55 9.75 4.56 12 2.8Z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><rect x="7.7" y="7.55" width="8.6" height="8.15" rx="1" fill="none" stroke="currentColor" stroke-width="1.45"/><path d="M9.35 9v1.55M10.7 9v1.55M12 9v1.55M13.3 9v1.55M14.65 9v1.55M9.1 11.7h5.8v2.05h-1.35v1.05h-3.1v-1.05H9.1Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',recorder:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="3.8" width="14" height="16.4" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 8h8M8 12h8M8 16h8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'};
        const premiumHelpIconImages={...HELP_PREMIUM_ICONS.sections,radii:HELP_REFINED_ICONS_V6.radii,mapview:MAP_LAYER_SYMBOL_STACK3D_IMAGE,troubleshooting:HELP_PREMIUM_ICONS.sections.recorder,recorder:HELP_REFINED_ICONS_V5.troubleshooting};
        const helpNetworkTokenPattern=/https:\/\/www\.maptiler\.com\/tools\/coordinates\/|53\.837691,\s*9\.956105|★ Speichern|★ Save|Location entity|×|↶|device_tracker\.gewitterradar(?:_dashboard)?|gewitterradar\.set_reference_coordinates|a\/b\/c\.tile\.openstreetmap\.org|(?:\*\.)?(?:[a-z0-9-]+\.)+[a-z]{2,24}(?::\d{1,5})?|\b(?:HTTPS|HTTP|MQTT)\/TCP\s+\d{1,5}\b|\b(?:TCP|UDP)[ -]?\d{1,5}\b|\b(?:Open-Meteo(?: Geocoding)?|OpenStreetMap(?: Nominatim|-Kacheln|-Kachelserver|-tiles| tiles)?|Nominatim|Leaflet(?: 1\.9\.4)?|GitHub\/HACS|GitHub|HACS|Local(?:-|\s)to-do(?:-Liste|-list)?|Dashboard-Setz-Script|Companion App|DNS|TLS-Inspection|CORS)\b/gi;
        const helpTokenQuotePattern=/[„“”‚‘’"'«»‹›]/;
        const appendHelpNetworkText=(target,text)=>{
          const source=String(text??'');helpNetworkTokenPattern.lastIndex=0;let cursor=0,match;
          while((match=helpNetworkTokenPattern.exec(source))){
            let before=source.slice(cursor,match.index).replace(/[„“”‚‘’"'«»‹›](\s*)$/,'$1');
            if(before)target.append(document.createTextNode(before));
            const tokenText=match[0];let token;if(/^https:\/\/www\.maptiler\.com\/tools\/coordinates\/$/i.test(tokenText)){token=document.createElement('a');token.className='help-maptiler-link';token.href='https://www.maptiler.com/tools/coordinates/';token.target='_blank';token.rel='noopener noreferrer';}else{token=document.createElement('span');if(tokenText==='★ Speichern'||tokenText==='★ Save')token.className='help-action-token help-action-save';else if(tokenText==='×')token.className='help-action-token help-action-delete';else if(tokenText==='↶')token.className='help-action-token help-action-restore';else if(tokenText==='Location entity')token.className='help-process-highlight';else if(/^53\.837691,\s*9\.956105$/.test(tokenText))token.className='help-coordinate-example';else token.className='help-network-highlight';}token.textContent=tokenText;target.append(token);cursor=match.index+tokenText.length;
            while(cursor<source.length&&helpTokenQuotePattern.test(source[cursor]))cursor++;
            if(match[0].length===0)helpNetworkTokenPattern.lastIndex++;
          }
          if(cursor<source.length)target.append(document.createTextNode(source.slice(cursor)));
        };
        const setHelpDiagnosticText=(target,text)=>appendHelpNetworkText(target,text);
        const appendHelpEntryValue=(target,text)=>{
          const source=String(text??'');
          const match=source.match(/^([\s\S]*?)\n↳\s+([^:\n]+):\n([\s\S]*)$/);
          if(!match){setHelpDiagnosticText(target,source);return;}
          const intro=match[1].trimEnd();
          if(intro)setHelpDiagnosticText(target,intro);
          const sub=document.createElement('div');sub.className='help-inline-subentry';
          const subTitle=document.createElement('div');subTitle.className='help-inline-subentry-title';setHelpDiagnosticText(subTitle,'↳ '+match[2]);subTitle.append(document.createTextNode(':'));
          const subBody=document.createElement('div');subBody.className='help-inline-subentry-body';setHelpDiagnosticText(subBody,match[3].trim());
          sub.append(subTitle,subBody);target.append(sub);
        };
        help.sections.forEach((section,index)=>{
          const details=document.createElement('details');details.className='help-section';details.dataset.helpSection=section.key;details.open=openKeys.has(section.key)||(!this._helpLocale&&index===0);
          const summary=document.createElement('summary'),icon=document.createElement('span'),title=document.createElement('span'),chevron=document.createElement('span');
          icon.className='help-section-icon';icon.dataset.helpIcon=section.key;icon.setAttribute('aria-hidden','true');icon.innerHTML=premiumHelpIconImages[section.key]?'<img src="'+premiumHelpIconImages[section.key]+'" alt="" draggable="false">':(deterministicHelpIcons[section.key]||icons[section.key]||'•');title.textContent=section.title;chevron.className='help-chevron';chevron.setAttribute('aria-hidden','true');summary.append(icon,title,chevron);details.append(summary);
          const body=document.createElement('div');body.className='help-section-body';
          for(const text of section.paragraphs||[]){const p=document.createElement('p');setHelpDiagnosticText(p,text);body.append(p);}
          if(section.layerGraphic){const graphic=document.createElement('div');graphic.className='help-layer-graphic-card';const image=document.createElement('img');image.className='help-layer-graphic';image.src=MAP_LAYER_SYMBOL_STACK3D_IMAGE;image.alt=section.layerGraphicAlt||'3D layer';image.width=96;image.height=96;image.draggable=false;const caption=document.createElement('div');caption.className='help-layer-graphic-caption';setHelpDiagnosticText(caption,section.layerGraphicCaption||'');graphic.append(image,caption);body.append(graphic);}
          if(section.items?.length){const ul=document.createElement('ul');if(section.key==='radii')ul.className='help-radius-list';for(const [itemIndex,text] of section.items.entries()){const li=document.createElement('li');if(section.key==='radii'){li.className='help-radius-item';li.dataset.radiusTone=['observation','storm','danger'][itemIndex]||'';const ring=document.createElement('span');ring.className='help-radius-bullet';ring.setAttribute('aria-hidden','true');li.append(ring);}setHelpDiagnosticText(li,text);ul.append(li);}body.append(ul);}
          if(section.featureBlocks?.length){for(const block of section.featureBlocks){const wrap=document.createElement('div');wrap.className='help-feature-block';const blockTitle=document.createElement('div');blockTitle.className='help-feature-block-title';setHelpDiagnosticText(blockTitle,block.title);const blockBody=document.createElement('div');blockBody.className='help-feature-block-body';const parts=String(block.body||'').split('{{INFINITY}}');parts.forEach((part,partIndex)=>{if(part)setHelpDiagnosticText(blockBody,part);if(partIndex<parts.length-1){const infinity=document.createElement('img');infinity.className='help-inline-infinity-gfx';infinity.src=GEWITTERRADAR_INFINITY_GFX;infinity.alt=block.infinityAlt||'Unendlich';infinity.width=32;infinity.height=22;infinity.draggable=false;blockBody.append(infinity);}});wrap.append(blockTitle,blockBody);body.append(wrap);}}
          if(section.entries?.length){const dl=document.createElement('dl');dl.className='help-entries';for(const [entryIndex,[term,text]] of section.entries.entries()){const dt=document.createElement('dt'),dd=document.createElement('dd');const recorderPriority=section.key==='defaults'&&/^Recorder\b/i.test(String(term));if(recorderPriority){dt.className='help-recorder-priority';dd.className='help-recorder-priority';}setHelpDiagnosticText(dt,term);dt.append(document.createTextNode(':'));if(section.key==='location'&&(entryIndex===2||entryIndex===5)){const value=String(text??'').trimStart().replace(/^[„“”‚‘’"'«»‹›]+\s*/,'');const actionMatch=entryIndex===5?value.match(/^★\s+\S+/):value.match(/^\S+/);if(actionMatch){const action=document.createElement('span');action.className=entryIndex===5?'help-action-token help-action-save':'help-action-token help-action-use';action.textContent=actionMatch[0].replace(/^[„“”‚‘’"'«»‹›]+|[„“”‚‘’"'«»‹›]+$/g,'');const rest=value.slice(actionMatch[0].length).replace(/^[\s„“”‚‘’"'«»‹›]+/,'');dd.append(action);if(rest){dd.append(document.createTextNode(' '));setHelpDiagnosticText(dd,rest);}}else appendHelpEntryValue(dd,text);}else appendHelpEntryValue(dd,text);dl.append(dt,dd);}body.append(dl);}
          if(section.recorder){const wrap=document.createElement('div');wrap.className='help-code-wrap';const pre=document.createElement('pre'),code=document.createElement('code'),button=document.createElement('button'),status=document.createElement('span');code.textContent=ABOUT_RECORDER_YAML;pre.append(code);button.className='help-copy';button.type='button';button.setAttribute('aria-label',help.copy);const copyImage=document.createElement('img');copyImage.src=ABOUT_COPY_IMAGE;copyImage.alt='';copyImage.width=34;copyImage.height=34;copyImage.draggable=false;button.append(copyImage);status.className='help-copy-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');wrap.append(pre,button,status);body.append(wrap);button.addEventListener('click',()=>this._copyHelpRecorder());}
          for(const text of section.notes||[]){const p=document.createElement('p');p.className='help-note';setHelpDiagnosticText(p,text);body.append(p);}
          details.append(body);content.append(details);
        });
        content.scrollTop=scrollTop;this._helpLocale=help;
      }
      requestAboutLocale(language,()=>{if(this._helpDialog===dialog&&this._languageValue()===language)this._syncHelp();});
    },

    _closeHelp(restoreFocus = true) {
      if(!this._helpDialog)return;
      this._helpDialog.close();this._helpDialog.parentElement.remove();this._helpDialog=null;this._helpLocale=null;
      const focus=this._helpReturnFocus||this.shadow?.getElementById('settings-help');this._helpReturnFocus=null;
      if(restoreFocus&&focus?.isConnected)focus.focus({preventScroll:true});
    },

    _openAbout(fromSettings = false) {
      if (!this._languageOnboardingComplete()) { this._maybeOpenAbout(); return; }
      if (this._aboutDialog?.open || !this.isConnected || !this.shadow) return;
      const shell = document.createElement('div');
      shell.id = 'about-shell';
      // A native modal in the card's Shadow DOM supplies top-layer containment,
      // background inertness and focus isolation without mutating HA/global styles.
      const icon = (name, extra = '') => {
        const paths = {
          heart:'<path d="M29 56C26 48 10 38 7 26C3 13 12 6 21 10C25 12 28 16 30 21C35 8 47 5 54 14C63 26 49 38 40 46C35 50 31 54 29 56"/>',
          heartSmall:'<path d="M28 57C26 49 12 37 10 25C7 10 20 7 28 23C30 12 42 5 49 12C60 24 43 43 28 57"/><path d="M28 55C34 48 44 37 48 28" opacity=".45" stroke-width=".9"/>',
          people:'<circle cx="32" cy="16" r="8"/><circle cx="13" cy="23" r="6"/><circle cx="51" cy="23" r="6"/><path d="M21 52V38C21 25 43 25 43 38V52ZM5 49V37C5 29 15 29 18 34V49ZM46 49V34C49 29 59 29 59 37V49Z"/><path fill="none" stroke="#73502c" stroke-width="1.7" d="M26 31Q32 39 38 31M25 40L24 50M40 40L41 50M9 36V46M54 36V46"/><path fill="none" stroke="#fff0c4" stroke-width="1.25" opacity=".8" d="M26 15C26 11 30 9 33 10M9 22Q9 18 13 18M47 22Q47 18 51 18M23 39Q23 33 27 32M7 39Q7 34 10 33M48 38Q48 34 51 33"/>',
          radar:'<path d="M32 4L56 18V46L32 60L8 46V18Z"/><circle cx="32" cy="32" r="14"/><path d="M32 11V53M11 32H53M32 32L42 21"/><circle cx="32" cy="32" r="3"/>',
          globe:'<circle cx="32" cy="32" r="25"/><ellipse cx="32" cy="32" rx="12" ry="25"/><path d="M8 23H56M8 41H56M32 7V57"/>',
          database:'<path d="M10 14V45C10 57 54 57 54 45V14Z" fill="url(#about-metal-database)" fill-opacity=".38"/><path d="M10 26C10 38 54 38 54 26M10 37C10 49 54 49 54 37"/><ellipse cx="32" cy="14" rx="22" ry="9" fill="url(#about-metal-database)"/><ellipse cx="32" cy="13" rx="17" ry="5" stroke="#fff0cc" stroke-width=".9" opacity=".55"/><path d="M14 24V29M14 36V40M14 46V48" stroke="#ffe9bb" stroke-width="2"/><path d="M18 31Q33 37 48 31M18 42Q33 48 48 42M18 52Q33 57 48 52" stroke="#ffe4ae" stroke-width=".8" opacity=".8"/><path d="M50 24V28M50 36V39M50 46V48" stroke="#614321" stroke-width="1.5"/>',
          cube:'<path d="M32 5L56 18V46L32 59L8 46V18ZM8 18L32 32L56 18M32 32V59"/>',
          info:'<circle cx="32" cy="32" r="25"/><path d="M32 28V46M32 18V21"/>',
          warning:'<path d="M32 5L60 54H4ZM32 21V37M32 44V47"/>',
          settings:'<path d="M27 7Q32 5 37 7L38 14L43 17L50 14Q55 18 57 23L52 28V36L57 41Q55 46 50 50L43 47L38 50L37 57Q32 59 27 57L26 50L21 47L14 50Q9 46 7 41L12 36V28L7 23Q9 18 14 14L21 17L26 14Z"/><circle cx="32" cy="32" r="11"/><circle cx="32" cy="32" r="17" opacity=".25"/>',
          check:'<path d="M12 33L26 46L54 16"/>',
          clock:'<circle cx="32" cy="32" r="25"/><path d="M32 15V32L44 40"/>',
          copy:'<rect x="19" y="17" width="31" height="39" rx="4"/><path d="M39 17V8H10V46H19M26 8H34V21H26Z"/>'
        };
        const metallic = ['people','radar','globe','database','cube','settings'].includes(name);
        const heartMaterial = ['heart','heartSmall'].includes(name) ? '<defs><linearGradient id="about-heart-gold" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#93632e"/><stop offset=".2" stop-color="#f0c88c"/><stop offset=".44" stop-color="#ffe8bd"/><stop offset=".7" stop-color="#b88443"/><stop offset="1" stop-color="#e5b16c"/></linearGradient></defs>' : '';
        const material = metallic ? `<defs><linearGradient id="about-metal-${name}" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#fff0bc"/><stop offset=".28" stop-color="#e8bd60"/><stop offset=".48" stop-color="#92703a"/><stop offset=".62" stop-color="#ffe2a0"/><stop offset="1" stop-color="#b58b44"/></linearGradient></defs>` : '';
        return `<svg class="about-icon ${metallic ? 'about-emblem' : ''} ${extra}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${material}${heartMaterial}<g ${metallic ? `stroke="url(#about-metal-${name})"` : ['heart','heartSmall'].includes(name) ? 'stroke="url(#about-heart-gold)"' : ''}>${paths[name]}</g></svg>`;
      };
      shell.innerHTML = `<style>
        .about-dialog{--about-gold:#dfbc72;--about-bright:#f7dfa1;--about-line:#8d713d;--about-muted:#b6bdc5;box-sizing:border-box;color:#d1d4d9;background:radial-gradient(ellipse at 10% 25%,#24313945,transparent 65%),#091219;border:1px solid #c9a050;border-radius:11px;box-shadow:0 24px 90px #000c,inset 0 0 0 3px #cda95008;padding:0;width:min(860px,calc(100vw - 14px));max-width:calc(100vw - 14px);height:min(1040px,calc(100dvh - 10px));max-height:calc(100dvh - 10px);overflow:hidden;font:11.4px/1.3 'Segoe UI',Arial,sans-serif;color-scheme:dark;container-type:inline-size}
        .about-dialog[open]{display:flex;flex-direction:column}.about-dialog::backdrop{background:#03070be0;overscroll-behavior:none}
        .about-dialog *{box-sizing:border-box}.about-dialog h2,.about-dialog h3,.about-dialog p{margin:0}.about-dialog h3{font-size:14px;line-height:1.2;color:var(--about-bright);font-weight:650;letter-spacing:.015em}.about-dialog button{font:inherit;cursor:pointer;touch-action:manipulation;color:inherit}.about-dialog :focus-visible{outline:2px solid #ffe1a1;outline-offset:2px}.about-icon{width:28px;height:28px;flex:none;color:var(--about-gold)}
        .about-head{position:relative;display:flex;align-items:flex-start;gap:24px;height:113px;min-height:113px;padding:14px 16px;background:linear-gradient(90deg,#06111b30,#06111b10 60%,#06111b25),url('${ABOUT_HERO_IMAGE}') right 52%/70% auto no-repeat;flex:none}
        .about-head img{width:86px;height:86px;object-fit:contain;filter:drop-shadow(0 0 9px #e4b25435)}.about-head-copy{padding-top:5px;position:relative;z-index:1;min-width:0}.about-dialog h2{font-size:32px;line-height:1.2;font-weight:650;color:#f6e9cc;letter-spacing:-.015em;text-shadow:0 2px 5px #0008;white-space:nowrap}.about-head-copy p{font-size:11.2px;margin-top:3px;color:#dce0e9}.about-claim{position:absolute;right:18px;bottom:36px;width:115px;text-align:center;text-transform:uppercase;letter-spacing:.18em;font-size:8px;line-height:1.7;color:#e1c782;text-shadow:0 1px 3px #000}
        .about-dialog .about-close{position:absolute;right:10px;top:10px;width:44px;height:44px;min-height:44px;padding:0;border:0;background:transparent;display:grid;place-items:center;z-index:60}.about-close span{display:grid;place-items:center;width:27px;height:27px;font:22px/1 Arial,sans-serif;border:1px solid #a388535c;border-radius:4px;background:#071015b0;color:#ecdec4}.about-close:focus-visible{outline-offset:-3px}
        .about-content{padding:0 10px;overflow:auto;overscroll-behavior:contain;min-height:0;touch-action:pan-y;flex:1;scrollbar-width:thin;scrollbar-color:#9a7f4755 transparent}.about-content>section,.about-content>details{margin:0 0 6px;border:1px solid #8d713d87;border-radius:7px;background:linear-gradient(105deg,#a4843820,#0b171e45 28%,#15202636);box-shadow:inset 0 1px #ffe6ad08,0 2px 8px #0002}.about-content>section:last-child{margin-bottom:0}
        .about-content>.about-dedication{position:relative;display:grid;grid-template-columns:95px minmax(0,1fr) 172px;align-items:center;gap:4px;min-height:114px;padding:12px 12px 12px 13px;border-color:#cba152;background:linear-gradient(90deg,#08111632,#08111660 46%,#08111612),url('${ABOUT_DEDICATION_IMAGE}') center 55%/cover no-repeat;box-shadow:inset 0 0 0 1px #edc87915,0 0 12px #d69a2120}.about-dedication h3{font-family:Georgia,serif;font-size:28px;line-height:1.1;letter-spacing:0;color:#ffe8b6;text-shadow:0 2px 6px #0008;margin-bottom:7px}.about-dedication p{font-size:11.5px;line-height:1.3;color:#e5e5e8;text-shadow:0 1px 3px #000}.about-heart{width:64px;height:64px;justify-self:center;color:#ffe0a3;stroke-width:1.7;filter:drop-shadow(0 0 4px #ffc55c) drop-shadow(0 0 12px #c59442)}.about-signature{align-self:end;text-align:center;transform:rotate(-5deg);padding-bottom:2px;color:#e9c56f;font-family:'Segoe Script','URW Chancery L',cursive;font-style:italic;line-height:1.25;font-size:14px;text-shadow:0 1px 4px #000}.about-signature b{font-size:25px;font-weight:400;display:block}.about-signature small{font-size:9.8px}
        .about-welcome{display:grid;grid-template-columns:36px minmax(0,1fr) 114px;align-items:start;gap:11px;padding:9px 12px;min-height:84px}.about-welcome>.about-icon{margin-top:12px;fill:var(--about-gold);stroke-width:1}.about-welcome h3{margin-bottom:5px}.about-welcome p{font-size:10.8px;line-height:1.33}.about-quote{font:italic 12px/1.35 Georgia,serif;text-align:center;align-self:center;color:#d0c4ae}.about-quote:after{content:'';display:block;width:60px;height:1px;margin:14px auto 0;background:linear-gradient(90deg,transparent,#c3a464,transparent)}
        .about-radii{min-height:154px;padding:7px 11px}.about-section-head{display:flex;align-items:center;gap:19px;margin-bottom:3px}.about-section-head .about-icon{width:30px;height:22px}.about-section-head h3{flex:1}.about-section-head small{color:var(--about-muted);font-size:9px;font-weight:400}.about-radii-layout{display:grid;grid-template-columns:164px minmax(0,1fr) 143px;gap:8px;align-items:center}.about-radar-wrap{padding:0 0 0 8px;border-right:1px solid #b1a07013}.about-radar{width:110px;height:110px;display:block;margin:auto;filter:drop-shadow(0 0 12px #fff2)}.about-radius{position:relative;padding:3px 0 3px 38px;border-bottom:1px solid #c5a76b15;min-height:38px;--radius-color:#d9b45e}.about-radius[data-radius="storm_radius"]{--radius-color:#79b8e7}.about-radius[data-radius="danger_radius"]{--radius-color:#d74d43}.about-radius:before{content:'';position:absolute;width:23px;height:23px;left:1px;top:6px;border:1px solid var(--radius-color);border-radius:50%;background:radial-gradient(circle,var(--radius-color) 0 2px,#0000 3px),radial-gradient(circle at 30% 25%,#ffffff15,transparent);box-shadow:inset 0 0 8px #ffffff0a}.about-radius:last-child{border-bottom:0}.about-radius strong{display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:9.5px;line-height:1.1;color:#e7e7e4;font-weight:650}.about-radius p{font-size:8.2px;line-height:1.3;padding-top:3px;color:#b9c0c7}.about-radius output{white-space:nowrap;font-variant-numeric:tabular-nums;min-width:46px;text-align:center;padding:2px 4px;border:1px solid color-mix(in srgb,var(--radius-color) 55%,transparent);border-radius:4px;color:color-mix(in srgb,var(--radius-color) 55%,#fff);background:#040b1090;box-shadow:inset 0 0 5px #ffffff09}
        .about-radius-info{display:flex;align-self:stretch;align-items:flex-start;gap:9px;border:1px solid #a388472d;border-radius:7px;padding:10px 10px;background:linear-gradient(135deg,#070e13,#17222866);font-size:9.2px;line-height:1.3}.about-radius-info .about-icon{width:21px;height:21px}.about-radius-info p{padding-top:1px}
        .about-network{display:grid;grid-template-columns:36px minmax(0,1fr) 127px;gap:12px;padding:8px 12px;min-height:83px;align-items:start}.about-network>.about-icon{margin-top:3px}.about-network h3{margin-bottom:5px}.about-network p{font-size:10.6px;line-height:1.27}.about-network-plaque{align-self:stretch;border:1px solid #b698532f;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#d5b767;background:#050e1380}.about-network-plaque .about-icon{width:30px;height:30px;stroke-width:1.5}.about-network-plaque b{font-size:12px;font-weight:500;letter-spacing:.04em}.about-network-plaque small{font-size:6.5px;letter-spacing:.06em}
        .about-recorder{min-height:175px;padding:6px 11px;background:linear-gradient(120deg,#ab863325,#111b2080)!important;border-color:#bb944ccc!important}.about-recorder .about-section-head{position:relative;padding-left:48px;height:20px;margin-bottom:3px}.about-recorder .about-section-head .about-icon{position:absolute;left:0;top:0;height:30px}.about-recorder-intro{margin-left:48px!important;font-size:10.6px;line-height:1.2}.about-recorder-layout{display:grid;grid-template-columns:minmax(0,1fr) 140px;gap:9px;margin:4px 0 0 43px}.about-code-wrap{position:relative;min-width:0;border:1px solid #8b723e38;border-radius:4px;background:linear-gradient(120deg,#061017,#0a141aa6);box-shadow:inset 0 2px 10px #0005}.about-code-meta{position:absolute;right:8px;top:2px;display:flex;align-items:center;gap:6px;color:#aeb4bd;font-size:8px}.about-code-meta button{border:0;background:transparent;padding:0;display:grid;place-items:center;width:44px;height:44px;min-height:44px;margin:-5px -8px -10px 0}.about-code-meta .about-icon{width:15px;height:15px;color:#d1d3d4}.about-dialog pre{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;padding:5px 9px 7px;font:9.6px/1.24 Consolas,'Liberation Mono',monospace;letter-spacing:.025em;user-select:text;color:#cbd5df}.about-code-key{color:#75bde7}.about-code-glob{color:#edd251}.about-copy-status{position:absolute;bottom:2px;right:6px;font-size:9px;color:var(--about-bright);background:#0b151be8}.about-recorder-benefit{position:relative;display:flex;align-items:center;flex-direction:column;justify-content:center;gap:7px;padding:8px 12px;border:1px solid #ba964c99;border-radius:7px;background:linear-gradient(140deg,#ad863321,#10181d);color:#e2c17a}.about-recorder-benefit .about-icon{width:26px;height:26px}.about-recorder-benefit p{font-size:10.5px;line-height:1.3;text-wrap:balance;max-width:110px}.about-recorder-benefit .about-benefit-database{position:absolute;width:32px;height:32px;right:6px;bottom:6px;opacity:.25;stroke-width:1.5}
        .about-entities{margin-bottom:0!important}.about-dialog summary{cursor:pointer;min-height:46px;list-style:none;display:flex;align-items:center;gap:19px;padding:7px 12px;color:var(--about-bright);touch-action:manipulation}.about-dialog summary::-webkit-details-marker{display:none}.about-dialog summary .about-icon{width:30px;height:28px}.about-dialog summary strong{display:block;font-size:13px;font-weight:600}.about-dialog summary small{display:block;color:#b8c0c9;font-size:10px;line-height:1.25;margin-top:3px}.about-dialog summary:after{content:'';width:10px;height:10px;border-right:1.5px solid #e6cf91;border-bottom:1.5px solid #e6cf91;transform:rotate(45deg);margin:-5px 7px 0 auto;flex:none}.about-dialog details[open] summary:after{transform:rotate(225deg);margin-top:5px}.about-entity-groups{padding:0 18px 16px}.about-entity-groups h3{margin:16px 0 6px}.about-entity{padding:9px 0;border-bottom:1px solid #c5a76b20;overflow-wrap:anywhere;font-size:11px}.about-entity strong{display:block;color:#e0d0ae}.about-entity code{font-size:10px}.about-entity-status,.about-legacy-id{font-size:10px;color:#abb7c1}.about-purpose{color:#d5d9de;margin:2px 0 4px!important}.about-source-list,.about-location-list{padding-left:15px;overflow-wrap:anywhere}.about-source-list li,.about-location-list li{margin:8px 0}.about-source-list code,.about-location-list code{font-size:10px}
        .about-footer{display:grid;grid-template-columns:minmax(120px,1fr) 150px 154px 155px;align-items:center;gap:10px;padding:5px 10px max(5px,env(safe-area-inset-bottom));min-height:54px;flex:none;background:linear-gradient(#0c171a50,#091116);position:relative}.about-footer .about-dev{font-size:7.6px;line-height:1.5;color:#8d9dab}.about-footer button{min-height:44px;border:1px solid #9d7d3d;border-radius:6px;padding:6px 9px;display:flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(#101a20,#060f15);box-shadow:inset 0 1px 0 #ffffff08;font-size:10px;white-space:normal}.about-footer .about-icon{width:17px;height:17px}.about-footer .about-understood{background:linear-gradient(#ffd882,#e2b757 56%,#b5883b);border-color:#f6d68d;color:#241e10;font-size:12px;font-weight:600;box-shadow:0 0 15px #edb54a32,inset 0 0 0 2px #fff2}.about-understood .about-icon{color:#241e10}.about-footer-reminder{display:flex;align-items:center;gap:10px}.about-footer-reminder .about-icon{width:25px;height:25px}.about-footer-reminder p{font-size:8px;line-height:1.4;color:#a4b0bd}
        @media(min-width:621px){.about-footer button{position:relative;background:transparent!important;border-color:transparent!important;box-shadow:none!important}.about-footer button:before{content:'';position:absolute;inset:0 0 10px;border:1px solid #9d7d3d;border-radius:6px;background:linear-gradient(#101a20,#060f15);box-shadow:inset 0 1px #ffffff08}.about-footer .about-understood:before{background:linear-gradient(#ffd882,#e2b757 56%,#b5883b);border-color:#f6d68d;box-shadow:0 0 15px #edb54a32,inset 0 0 0 2px #fff2}.about-footer button>span,.about-footer button>.about-icon{position:relative;transform:translateY(-5px)}}
        @container(min-width:780px){.about-dialog h2{font-size:36px}.about-head{height:132px;min-height:132px;padding-top:20px}.about-head img{width:94px;height:94px}.about-head-copy p{font-size:12px}.about-content>.about-dedication{min-height:132px;grid-template-columns:105px minmax(0,1fr) 185px;padding:14px}.about-dedication h3{font-size:32px}.about-dedication p{font-size:13px}.about-welcome{min-height:94px}.about-welcome p,.about-network p{font-size:12px}.about-radii{min-height:172px}.about-radii-layout{grid-template-columns:168px minmax(0,1fr) 160px}.about-radar{width:130px;height:130px}.about-radius{min-height:42px}.about-radius strong{font-size:11px}.about-radius p{font-size:9.3px}.about-radius-info{font-size:11px}.about-network{min-height:94px}.about-recorder{min-height:205px}.about-recorder-intro{font-size:12px}.about-dialog pre{font-size:11px}.about-recorder-layout{grid-template-columns:minmax(0,1fr) 156px}.about-footer{min-height:64px}}
        @media(max-width:620px){.about-dialog{width:calc(100vw - 12px);max-width:calc(100vw - 12px);height:calc(100dvh - 12px);max-height:calc(100dvh - 12px);font-size:13px}.about-head{height:112px;min-height:112px;gap:12px;padding:16px 12px}.about-head img{width:70px;height:70px}.about-dialog h2{font-size:23px;white-space:normal;padding-right:15px}.about-head-copy p{font-size:10px;max-width:225px}.about-claim{display:none}.about-content{padding:0 8px}.about-content>.about-dedication{grid-template-columns:53px minmax(0,1fr);padding:15px 12px;gap:10px;min-height:160px;background-position:60% 55%}.about-heart{width:52px;height:52px}.about-dedication h3{font-size:27px}.about-dedication p{font-size:13px;line-height:1.4}.about-signature{grid-column:2;font-size:12px;text-align:right;padding-top:5px;transform:rotate(-3deg)}.about-signature b{font-size:20px;display:inline}.about-signature small{font-size:10px}.about-welcome{grid-template-columns:27px minmax(0,1fr);gap:10px;padding:13px 11px}.about-welcome p{font-size:12px;line-height:1.4}.about-quote{grid-column:2;text-align:right;font-size:11px;margin-top:5px}.about-quote:after{display:none}.about-section-head{gap:10px}.about-section-head small{display:none}.about-radii{padding:11px}.about-radii-layout{grid-template-columns:90px minmax(0,1fr);gap:7px}.about-radar-wrap{padding:0;border:0}.about-radar{width:86px;height:86px}.about-radius{padding-left:26px;min-height:48px}.about-radius:before{width:18px;height:18px;left:0}.about-radius strong{font-size:10px;flex-wrap:wrap;gap:3px}.about-radius p{font-size:9px}.about-radius output{font-size:10px}.about-radius-info{grid-column:1/-1;font-size:11px;line-height:1.4;padding:9px}.about-network{grid-template-columns:28px minmax(0,1fr);gap:9px;padding:12px}.about-network p{font-size:12px;line-height:1.4}.about-network-plaque{display:none}.about-recorder{padding:11px}.about-recorder-intro{margin-left:0!important;font-size:12px;line-height:1.4}.about-recorder-layout{margin-left:0;grid-template-columns:1fr}.about-dialog pre{font-size:10px;padding-top:28px;line-height:1.4}.about-recorder-benefit{flex-direction:row;justify-content:flex-start;padding:10px;gap:12px}.about-recorder-benefit p{max-width:none;font-size:12px}.about-benefit-database{display:none}.about-dialog summary{gap:10px;padding:10px}.about-dialog summary strong{font-size:13px}.about-dialog summary small{font-size:10px}.about-footer{grid-template-columns:1fr 1fr;gap:6px 10px;padding:8px 10px max(8px,env(safe-area-inset-bottom))}.about-footer .about-dev{grid-row:2;font-size:8px}.about-footer .about-understood{grid-column:1;grid-row:1}.about-footer .about-later{grid-column:2;grid-row:1}.about-footer-reminder{grid-column:2;grid-row:2;gap:6px}.about-footer-reminder p{font-size:8px}.about-footer-reminder .about-icon{width:18px;height:18px}.about-entity{font-size:12px}}
        @media(max-width:620px){.about-recorder .about-section-head{height:auto;min-height:30px;margin-bottom:7px;padding-left:38px}}
        @media(max-height:500px){.about-head{height:85px;min-height:85px;padding-top:8px}.about-head img{width:65px;height:65px}.about-head-copy{padding-top:3px}.about-head-copy h2{font-size:28px}.about-claim{bottom:16px}.about-footer{min-height:54px;padding-top:4px;padding-bottom:max(4px,env(safe-area-inset-bottom))}}

        /* Focused second visual pass: paint-only material and emblem refinement. */
        .about-dialog{--about-metal-frame:linear-gradient(125deg,#795926 0%,#ffe4a0 8%,#a17a38 18%,#584321 32%,#bd954b 45%,#fff0b8 58%,#795a2d 70%,#d5ae65 85%,#715126 94%,#e9ca88 100%);border-color:transparent}
        .about-dialog:before,.about-content>section:before,.about-content>details:before{content:'';position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:var(--about-metal-frame);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;z-index:3}
        .about-dialog:before{inset:0;padding:1px;background:linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c);filter:drop-shadow(0 0 2px #cda25855)}
        .about-content>section,.about-content>details{position:relative;border-color:transparent}
        .about-content>section:before,.about-content>details:before{opacity:.43}
        .about-content>.about-dedication:before{opacity:1;background:linear-gradient(110deg,#a37d37,#ffe9b0 13%,#7f5b28 30%,#d5b166 47%,#5e4724 58%,#fff1bb 74%,#c18e39 88%,#f5d48c);filter:drop-shadow(0 0 3px #dcb66460)}
        .about-content>.about-recorder:before{opacity:.7}.about-content>.about-recorder{border-color:transparent!important}
        .about-head-copy{max-width:calc(100% - 130px)}.about-head-copy p{max-width:385px;line-height:1.35;text-wrap:pretty}.about-claim{width:127px;bottom:15px;font-size:7.6px}
        .about-heart{transform:rotate(-8deg);overflow:visible;stroke-width:1.7;color:#fff0be;filter:drop-shadow(0 0 2px #fff2cb) drop-shadow(0 0 6px #efbe65) drop-shadow(0 0 13px #c593458c)}
        .about-signature{position:relative;transform:rotate(-6deg);padding-right:17px;padding-bottom:2px}.about-handwriting{display:block;width:137px;height:47px;margin:0 auto -3px;overflow:visible;filter:drop-shadow(0 1px 1px #0009)}.about-signature small{display:block;white-space:nowrap;font-family:'Segoe Script','URW Chancery L',cursive;font-size:9.2px;letter-spacing:.01em;transform:rotate(-2deg)}.about-small-heart{position:absolute;right:-2px;top:20px;width:22px;height:28px;transform:rotate(9deg);stroke-width:1.8;filter:drop-shadow(0 0 3px #e6b75b88)}
        .about-quote{font-size:11.1px;line-height:1.3;text-wrap:balance}.about-quote:after{margin-top:7px}
        .about-emblem{filter:drop-shadow(0 1px 1px #000c) drop-shadow(0 -1px .3px #ffe4a055);stroke-width:2.6;overflow:visible}
        .about-welcome>.about-icon,.about-network>.about-icon{width:34px;height:34px}.about-welcome>.about-icon{fill:#c69d50;stroke-width:1.2;margin-top:8px}
        .about-section-head{position:relative;min-height:22px}.about-section-head>.about-icon{width:34px;height:34px;margin-block:-6px}.about-section-head{gap:15px}.about-recorder .about-section-head>.about-icon{width:34px;height:34px;margin:0}
        .about-dialog summary>.about-icon{width:34px;height:34px;margin-block:-3px}.about-dialog summary{gap:15px}.about-footer-reminder>.about-icon{width:30px;height:30px}
        @media(max-width:620px){.about-head-copy{max-width:calc(100% - 87px)}.about-head-copy p{font-size:10px;line-height:1.35}.about-heart{filter:drop-shadow(0 0 2px #ffe6b5) drop-shadow(0 0 5px #dcac61aa)}.about-handwriting{width:115px;height:39px;margin:0 12px -2px auto}.about-signature{padding-right:20px;justify-self:end}.about-small-heart{width:18px;height:24px;top:14px}.about-signature small{font-size:9px}.about-welcome>.about-icon,.about-network>.about-icon{width:29px;height:29px}.about-section-head>.about-icon,.about-dialog summary>.about-icon{width:30px;height:30px}.about-footer-reminder>.about-icon{width:23px;height:23px}.about-quote{font-size:11px}.about-section-head{gap:10px}}

        /* Material/detail follow-up: preserve layout, brighten selective reflections. */
        .about-head{background-color:#091219;background-image:linear-gradient(90deg,#091219 0%,#091219 38%,#09121900 58%),url('${ABOUT_HERO_IMAGE}')}.about-claim{top:15px;bottom:auto;width:155px;line-height:1.45}
        @media(max-height:500px){.about-head{background-position:center,right 57%}.about-claim{top:6px}}

        .about-dialog:before{padding:1.5px;background:linear-gradient(145deg,#d4aa69 0%,#76502e 15%,#f3dcb0 29%,#76532f 43%,#bc9057 57%,#fce2b6 73%,#725031 87%,#c79b62 100%)}
        .about-content>section:before,.about-content>details:before{padding:1.25px;opacity:.52}
        .about-content>.about-dedication:before{padding:1.6px;opacity:1;background:linear-gradient(108deg,#8c5d2d 0%,#e7bd84 12%,#ffebc0 17%,#956335 32%,#b1834d 47%,#65482f 59%,#edc68d 71%,#fff0cc 75%,#b47e42 89%,#dab17c 100%);filter:drop-shadow(0 0 2px #ba854d70)}
        .about-content>.about-dedication{box-shadow:inset 0 0 0 1px #f2c59212,inset 0 -12px 22px #060b102a,0 0 12px #ae713822}
        .about-dedication h3{color:#e6c38d;background:linear-gradient(175deg,#f7dfb2 12%,#efcf98 36%,#b68b50 55%,#e7c48c 70%,#c39155 95%);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 1px 0 #624429) drop-shadow(0 2px 2px #0009);text-shadow:none}
        .about-heart{stroke-width:1.8;transform:rotate(-7deg);filter:drop-shadow(0 1px .7px #513018) drop-shadow(0 0 2px #f4d4a7aa) drop-shadow(-2px 1px 6px #c78a4899) drop-shadow(2px 3px 12px #ad6d3a70)}
        .about-signature{color:#dfb983;transform:rotate(-7deg)}.about-handwriting{filter:drop-shadow(0 1px .5px #4f321c) drop-shadow(0 0 2px #c8985225)}.about-handwriting>g{stroke-width:1.25}.about-signature small{letter-spacing:.025em;transform:rotate(-3deg);text-shadow:0 1px 1px #402c1c}
        .about-small-heart{transform:rotate(14deg) scale(.91,1.04);stroke-width:1.55;filter:drop-shadow(0 0 2px #bd834970)}
        .about-emblem{stroke-width:3;filter:drop-shadow(0 1px .5px #4c301c) drop-shadow(0 2px 1.5px #0009) drop-shadow(0 -1px .4px #f5d5a555)}
        .about-welcome>.about-icon,.about-network>.about-icon,.about-section-head>.about-icon,.about-recorder .about-section-head>.about-icon{width:36px;height:36px}.about-section-head{gap:13px}.about-dialog summary>.about-icon{width:35px;height:35px}.about-dialog summary{gap:14px}.about-footer-reminder>.about-icon{width:31px;height:31px}
        @media(max-width:620px){.about-heart{filter:drop-shadow(0 1px .5px #674021) drop-shadow(0 0 3px #e5b77c99) drop-shadow(0 1px 7px #b1774166)}.about-content>.about-dedication:before{padding:1.4px}.about-welcome>.about-icon,.about-network>.about-icon,.about-section-head>.about-icon,.about-recorder .about-section-head>.about-icon,.about-dialog summary>.about-icon{width:30px;height:30px}.about-section-head{gap:10px}.about-footer-reminder>.about-icon{width:24px;height:24px}}

        /* Third precision pass: retain composition and successful metal treatment. */
        .about-content>.about-dedication{background-position:center 35%}.about-forest{position:absolute;inset:0 auto 0 0;width:115px;border-radius:inherit;background:url('${ABOUT_DEDICATION_IMAGE}') 20% 70%/auto calc(100% + 100px) no-repeat;mask-image:linear-gradient(90deg,#000 0%,#000 60%,transparent);pointer-events:none}

        .about-claim{right:24%;width:105px;top:13px;text-shadow:0 1px 3px #020609,0 0 5px #02060977}
        .about-dialog:before{padding:1.7px}.about-content>section:before,.about-content>details:before{padding:1.4px}.about-content>.about-dedication:before{padding:1.8px}
        .about-dedication:after{content:'';position:absolute;left:18px;top:50%;transform:translateY(-50%);width:100px;height:94px;background:radial-gradient(ellipse,#b881382b,#90613012 46%,transparent 72%);pointer-events:none}.about-heart,.about-dedication-copy{position:relative;z-index:1}
        .about-heart{stroke-width:1.9;filter:drop-shadow(0 1px .6px #654021) drop-shadow(0 0 1px #fbe3bdcc) drop-shadow(0 0 4px #e2ae69b0) drop-shadow(-2px 2px 9px #b27a4090) drop-shadow(3px 4px 16px #98613250)}
        .about-dedication h3{background-image:linear-gradient(177deg,#fae3ba 8%,#dcb577 37%,#a8763f 47%,#f6d9a5 55%,#dfb77a 73%,#b68048 98%);-webkit-text-stroke:.2px #946c40;filter:drop-shadow(0 .6px 0 #f2d4a266) drop-shadow(0 1.3px 0 #593a20) drop-shadow(0 2.2px 2px #0008)}
        .about-handwriting>g{stroke-width:1.15}.about-small-heart{transform:rotate(11deg);stroke-width:1.5}.about-welcome>.about-icon{fill:url(#about-metal-people);stroke-width:1.2}
        .about-recorder h3{font-size:13.7px;font-weight:600;letter-spacing:.01em}.about-recorder-intro{font-size:10.8px;line-height:1.2}
        .about-dialog pre,.about-line-numbers{font:10.2px/1.2 Consolas,'Liberation Mono',monospace;letter-spacing:0}.about-dialog pre{padding:6px 9px 6px 30px;white-space:pre;overflow-x:auto}
        .about-line-numbers{position:absolute;left:0;top:0;width:23px;padding:6px 5px 6px 0;text-align:right;color:#6f7b85;border-right:1px solid #a18a5520;user-select:none;pointer-events:none}.about-line-numbers span{display:block}
        .about-code-meta{font-size:9px;color:#c3ccd3;top:4px;gap:8px}.about-code-meta button{position:relative;margin:-5px -8px -10px 0}.about-code-meta button:before{content:'';position:absolute;inset:8px;border:1px solid #9b895454;border-radius:4px;background:#19232d66}.about-code-meta .about-icon{position:relative;width:18px;height:18px;color:#e5e7e5}
        .about-recorder-benefit{padding:6px 10px 26px;gap:4px}.about-recorder-benefit p{max-width:none;font-size:9.4px;line-height:1.45;white-space:pre-line;text-wrap:initial;align-self:stretch}.about-recorder-benefit>.about-icon:first-child{width:24px;height:24px}.about-recorder-benefit .about-benefit-database{width:27px;height:27px;bottom:4px;right:6px;opacity:.72;stroke-width:2.5}
        @container(min-width:780px){.about-recorder-intro{font-size:12px}.about-dialog pre,.about-line-numbers{font-size:11px;line-height:1.2}.about-recorder-benefit p{font-size:10.2px}}
        @media(max-width:620px){.about-claim{display:block;top:86px;right:12px;width:153px;font-size:6px;line-height:1.45}.about-head-copy p{max-width:225px}.about-content>.about-dedication:before{padding:1.6px}.about-heart{filter:drop-shadow(0 1px .5px #674021) drop-shadow(0 0 2px #f5d5a8aa) drop-shadow(0 0 5px #cf945a88) drop-shadow(0 2px 9px #a76e3950)}.about-dialog pre,.about-line-numbers{font-size:10px;line-height:1.4;padding-top:28px}.about-recorder-intro{font-size:12px;line-height:1.4}.about-recorder-benefit{padding:10px 46px 10px 10px;gap:10px}.about-recorder-benefit p{font-size:11px;align-self:center}.about-recorder-benefit .about-benefit-database{display:block;right:9px;top:50%;bottom:auto;transform:translateY(-50%);width:28px;height:28px}}
        @media(min-width:621px) and (max-height:500px){.about-claim{top:8px}}
        /* Focused fourth pass: legible claim and warm, restrained material relief. */
        .about-claim{right:146px;top:13px;width:140px;padding:6px;font-size:11.5px;font-weight:600;line-height:1.45;letter-spacing:.015em;text-transform:none;color:#f3dab0;background:linear-gradient(110deg,#071017c9,#07101780);border-radius:5px;text-shadow:0 1px 2px #000;box-shadow:0 2px 10px #02070b35}
        .about-content>.about-dedication{background-image:linear-gradient(90deg,#07121b24,#07121b52 40%,#11151c0a 72%),linear-gradient(0deg,#06101866,transparent 55%),url('${ABOUT_DEDICATION_IMAGE}');background-position:center,center,center 32%;background-size:cover;background-repeat:no-repeat}
        .about-forest{width:130px;filter:brightness(1.65) contrast(1.07) saturate(.92);mask-image:linear-gradient(90deg,#000 0%,#000 65%,transparent)}
        .about-heart{filter:drop-shadow(0 1px .6px #654021) drop-shadow(0 0 2px #ffe1b5d9) drop-shadow(0 0 6px #dca066bd) drop-shadow(-2px 2px 12px #b5744399)}
        .about-small-heart{filter:drop-shadow(0 1px .5px #4b2c19) drop-shadow(0 0 3px #d7a16c99);stroke-width:1.7}.about-signature{color:#edc89b}
        .about-dialog:before{padding:1.9px}.about-content>section:before,.about-content>details:before{opacity:.65}.about-content>.about-dedication:before{opacity:1;padding:1.9px}
        .about-recorder .about-section-head>.about-icon{stroke-width:2.1;filter:drop-shadow(0 1px .6px #50341e) drop-shadow(0 2px 2px #0009) drop-shadow(0 0 4px #c6974d35)}
        .about-recorder-benefit .about-benefit-database{opacity:1;stroke-width:2.1;width:29px;height:29px}
        @media(max-width:620px){.about-head{height:132px;min-height:132px}.about-claim{top:99px;right:12px;width:270px;padding:3px 6px;font-size:9px;line-height:1.45;letter-spacing:.015em}.about-forest{width:105px;filter:brightness(1.5) contrast(1.07) saturate(.92)}.about-content>.about-dedication{background-position:center,center,60% 32%}.about-recorder-benefit .about-benefit-database{width:29px;height:29px}}
        @media(min-width:621px) and (max-height:500px){.about-claim{top:7px;font-size:10.5px;width:140px;padding:4px 6px}}
        /* Fifth pass: only integrate the slogan and replace the dedication scenery. */
        .about-claim{background:none;box-shadow:none;border:0;border-radius:0;font-size:12px;text-shadow:0 1px 2px #03080d,0 0 7px #03080dcc}
        @container(min-width:780px){.about-claim{right:190px}}
        .about-content>.about-dedication{background-position:center,center,center 25%}
        .about-forest{background-position:20% 70%;filter:brightness(1.08);mask-image:linear-gradient(90deg,#000 0%,#000 56%,transparent)}
        @media(max-width:620px){.about-claim{font-size:10px}.about-content>.about-dedication{background-position:center,center,60% 25%}.about-forest{filter:brightness(1.08)}}
        @media(min-width:621px) and (max-height:500px){.about-claim{font-size:11px}}
        /* Approved post-V4.05 controls: visual shell only; handlers/hit targets unchanged. */
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
        /* V4.06 localized-header and section-header alignment. */
        @media(min-width:621px){.about-head{display:grid;grid-template-columns:86px minmax(0,1fr) 170px;align-items:center;column-gap:24px}.about-head-copy{align-self:center;padding-top:0;min-width:0;max-width:none}.about-dialog h2{white-space:normal;text-wrap:balance}.about-claim{position:static;align-self:center;justify-self:end;width:140px;margin-right:32px}.about-head>img{align-self:center}@container(min-width:780px){.about-head{grid-template-columns:94px minmax(0,1fr) 185px}.about-claim{right:auto;margin-right:32px}}}
        .about-section-head{min-height:30px;align-items:center;gap:11px}.about-section-head .about-icon{width:30px;height:30px}.about-section-head h3{display:flex;align-items:center;min-height:30px}.about-welcome>.about-icon,.about-network>.about-icon{width:30px;height:30px;margin-top:0}.about-welcome h3,.about-network h3{display:flex;align-items:center;min-height:30px;margin-bottom:2px}.about-recorder .about-section-head{position:static;padding-left:0;height:auto;min-height:30px}.about-recorder .about-section-head .about-icon{position:static;left:auto;top:auto;height:30px}.about-dialog summary{gap:11px}.about-dialog summary:after{width:14px;height:14px;margin:-7px 13px 0 auto;border-width:2px;filter:drop-shadow(0 0 2px #d6aa4f55);transition:transform .16s ease,filter .16s ease}.about-dialog details[open] summary:after{margin-top:7px;filter:brightness(1.18) drop-shadow(0 0 3px #e6b95777)}
        /* V4.06 accepted UI polish: About chevron spacing, iPad focus rendering, mobile dedication. */
        .about-dialog summary:after{margin-right:22px}
        .about-mobile-break{display:none}
        @media(max-width:620px) and (orientation:portrait){
          .about-dialog summary:after{margin-right:18px}
          .about-dedication-copy{transform:translateY(7px)}
          .about-dedication-copy p{max-width:none}
          .about-mobile-break{display:block;height:0}
        }
        @media(hover:none) and (pointer:coarse) and (min-width:700px) and (max-width:1100px){
          .about-close{-webkit-appearance:none;appearance:none;-webkit-tap-highlight-color:transparent}
          .about-close:focus-visible{outline:none!important}
          .about-close:focus-visible img{filter:brightness(1.04) drop-shadow(0 0 3px rgba(224,173,76,.42))}
        }
        /* V4.06 pass3: suppress WebKit's reopen focus frame without changing the premium X asset. */
        .about-dialog.about-touch-tablet .about-close{-webkit-appearance:none;appearance:none;-webkit-tap-highlight-color:transparent}
        .about-dialog.about-touch-tablet .about-close:focus,.about-dialog.about-touch-tablet .about-close:focus-visible{outline:none!important;box-shadow:none!important}
        /* V4.06 pass4: keep programmatic dialog focus invisible on touch tablets; center Welcome footer visuals. */
        .about-dialog.about-touch-tablet:focus,.about-dialog.about-touch-tablet:focus-visible{outline:none!important}
        .about-footer-left{display:grid;grid-template-columns:max-content minmax(0,1fr);align-items:center;gap:12px;min-width:0}
        .about-footer-left .about-dev{grid-row:auto!important}
        .about-footer-signature-wrap{min-height:0!important;padding:0!important;min-width:0;overflow:visible}
        .about-footer-signature{width:170px!important;max-width:100%!important;height:auto!important}
        @media(min-width:621px){
          .about-footer button:before{inset:5px 0!important}
          .about-footer button>span,.about-footer button>.about-icon{transform:none!important}
        }
        @media(max-width:620px){
          .about-footer-left{grid-column:1;grid-row:2;gap:4px}
          .about-footer-signature{width:105px!important;max-width:100%!important}
        }
        /* V4.06 pass5: final footer/version placement and 25% larger centered radius badges. */
        .about-footer-left{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-width:0}
        .about-footer-left .about-dev{grid-row:auto!important;text-align:center;white-space:nowrap;font-size:7.6px;line-height:1.2}
        .about-footer-signature{width:196px!important;max-width:100%!important;height:auto!important}
        .about-radius strong,.about-radius p{padding-right:74px}
        .about-radius output{position:absolute;right:0;top:50%;transform:translateY(-50%);min-width:58px;padding:2.5px 5px;font-size:1.25em;line-height:1.1;border-radius:5px;box-sizing:border-box}
        @media(min-width:621px){
          .about-footer{position:relative}
          .about-footer-left{position:relative;display:block!important;align-self:stretch!important;min-height:54px}
          .about-footer-signature-wrap{position:absolute;left:50%;top:50%;width:196px!important;max-width:none!important;transform:translate(-50%,-50%);margin:0!important}
          .about-footer-left .about-dev{position:absolute;left:6px;bottom:4px;text-align:left;white-space:nowrap}
        }
        @media(max-width:620px){
          .about-footer-left{grid-column:1;grid-row:2;gap:4px}
          .about-footer-left .about-dev{font-size:6.8px}
          .about-footer-signature{width:165px!important;max-width:100%!important}
        }
        @supports (-webkit-touch-callout:none){
          @media(hover:none) and (pointer:coarse) and (min-width:700px) and (min-height:700px){
            .about-footer-left .about-dev{transform:translateY(14px)}
          }
        }
        /* V4.06 pass5: Greek mobile portrait needs real text flow instead of an absolute claim overlay. */
        @media(max-width:620px) and (orientation:portrait){
          .about-dialog[data-about-language="Ελληνικά"] .about-head{display:grid;grid-template-columns:70px minmax(0,1fr);grid-template-rows:auto auto;align-items:start;column-gap:12px;row-gap:6px;height:auto;min-height:158px}
          .about-dialog[data-about-language="Ελληνικά"] .about-head>img{grid-column:1;grid-row:1;align-self:start}
          .about-dialog[data-about-language="Ελληνικά"] .about-head-copy{grid-column:2;grid-row:1;align-self:start;max-width:none}
          .about-dialog[data-about-language="Ελληνικά"] .about-head-copy p{max-width:none}
          .about-dialog[data-about-language="Ελληνικά"] .about-claim{position:static;grid-column:2;grid-row:2;justify-self:stretch;align-self:start;width:auto;max-width:none;margin:0;padding:2px 4px;font-size:9px;line-height:1.35;text-align:center}
        }

      </style>
      <dialog class="about-dialog" role="dialog" aria-modal="true" aria-labelledby="about-title">
        <header class="about-head"><img src="${ABOUT_LOGO}" alt="Gewitterradar" width="86" height="86"><div class="about-head-copy"><h2 id="about-title" data-about-text="title"></h2><p data-about-text="subtitle"></p></div><div class="about-claim" data-about-text="claim"></div><button class="about-close" type="button" data-about-close aria-label="Close"><span aria-hidden="true"><img src="${ABOUT_CLOSE_IMAGE}" alt="" width="34" height="34" draggable="false"></span></button></header>
        <div class="about-content">
          <section class="about-dedication"><div class="about-forest" aria-hidden="true"></div>${icon('heart','about-heart')}<div class="about-dedication-copy"><h3 data-about-text="dedicationTitle"></h3><p data-about-text="dedicationText"></p></div><div class="about-signature" aria-hidden="true"><svg class="about-handwriting" viewBox="0 0 170 62" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" transform="skewX(-12)"><path d="M16 49C22 36 24 18 27 13M8 26C21 7 56 9 55 27C54 43 31 53 15 48M48 45C58 28 70 29 65 41C60 53 47 52 51 41C56 31 68 30 67 34L63 47C62 51 68 47 75 40M72 49L80 31L74 45C89 28 94 28 88 42C83 54 92 48 99 41M96 49C103 31 112 6 114 9C121 19 103 35 102 36L113 32C104 37 103 41 111 45C116 51 122 42 124 40M120 41C139 39 144 26 132 31C122 34 113 54 132 48L145 40M148 47C152 46 151 52 146 55"/><path d="M23 20C23 29 20 40 16 48M64 35L60 45M78 35L73 47M105 22L97 47M131 33C126 37 122 42 124 46" stroke-width="2.15" opacity=".45"/><path d="M9 57C43 49 85 61 137 50" opacity=".55" stroke-width=".65"/></g></svg>${icon('heartSmall','about-small-heart')}<small>dass du immer an mich glaubst.</small></div></section>
          <section class="about-welcome">${icon('people')}<div><h3 data-about-text="welcome"></h3><p data-about-text="intro"></p></div><aside class="about-quote" data-about-text="quote"></aside></section>
          <section class="about-radii"><div class="about-section-head">${icon('radar')}<h3 data-about-text="radii"></h3><small data-about-text="radiiTagline"></small></div><div class="about-radii-layout">
            <div class="about-radar-wrap"><svg class="about-radar" viewBox="0 0 120 120" role="img"><title data-about-text="schematic"></title><defs><radialGradient id="about-radar-observation"><stop stop-color="#d9b45e" stop-opacity=".05"/><stop offset=".62" stop-color="#d9b45e" stop-opacity=".03"/><stop offset="1" stop-color="#d9b45e" stop-opacity=".2"/></radialGradient><radialGradient id="about-radar-storm"><stop stop-color="#79b8e7" stop-opacity=".04"/><stop offset="1" stop-color="#79b8e7" stop-opacity=".13"/></radialGradient></defs><circle cx="60" cy="60" r="57" fill="url(#about-radar-observation)" stroke="#d9b45e" stroke-width=".75"/><circle cx="60" cy="60" r="36" fill="url(#about-radar-storm)" stroke="#79b8e7" stroke-width=".75"/><circle cx="60" cy="60" r="19" fill="#cf403912" stroke="#c4483b" stroke-width=".75"/><path d="M60 1V119M1 60H119" stroke="#dce0d4" stroke-opacity=".35" stroke-width=".65"/><circle cx="60" cy="60" r="3" fill="#fff5e5"/></svg></div>
            <div>${['observation','storm','danger'].map((key)=>`<div class="about-radius" data-radius="${key}_radius"><strong><span></span><output></output></strong><p data-about-text="${key}"></p></div>`).join('')}</div>
            <aside class="about-radius-info">${icon('info')}<p data-about-text="radiusInfo"></p></aside>
          </div></section>
          <section class="about-network">${icon('globe')}<div><h3 data-about-text="thanks"></h3><p data-about-text="network"></p></div><aside class="about-network-plaque" aria-hidden="true">${icon('globe')}<b>Blitzortung.org</b><small>COMMUNITY · LIGHTNING DATA</small></aside></section>
          <section class="about-recorder"><div class="about-section-head">${icon('database')}<h3 data-about-text="recorder"></h3></div><p class="about-recorder-intro" data-about-text="recorderText"></p><div class="about-recorder-layout"><div class="about-code-wrap"><div class="about-line-numbers" aria-hidden="true"></div><div class="about-code-meta"><span>YAML</span><button class="about-copy" type="button" aria-label="Copy YAML"><img src="${ABOUT_COPY_IMAGE}" alt="" width="28" height="28" draggable="false"></button></div><pre tabindex="0"><code></code></pre><span class="about-copy-status" role="status" aria-live="polite"></span></div><aside class="about-recorder-benefit">${icon('warning')}<p data-about-text="recorderBenefit"></p>${icon('database','about-benefit-database')}</aside></div></section>
          <details class="about-entities"><summary>${icon('cube')}<span><strong data-about-text="entities"></strong><small data-about-text="entitiesSubtitle"></small></span></summary><div class="about-entity-groups"><h3 data-about-text="native"></h3><div class="about-settings-list"></div><h3 data-about-text="legacy"></h3><p data-about-text="legacyText"></p><h3 data-about-text="sources"></h3><ul class="about-source-list"></ul><h3 data-about-text="locations"></h3><p data-about-text="dynamic"></p><ul class="about-location-list"><li><code>person.*</code><p class="about-purpose" data-about-text="locationPerson"></p></li><li><code>zone.*</code><p class="about-purpose" data-about-text="locationZone"></p></li></ul></div></details>
        </div>
        <footer class="about-footer"><div class="about-footer-left"><div class="settings-signature-wrap about-footer-signature-wrap" aria-hidden="true"><svg class="settings-signature about-footer-signature" viewBox="0 0 1982 563" focusable="false" aria-hidden="true" preserveAspectRatio="xMidYMid meet"><image id="about-footer-signature-image" x="0" y="0" width="1982" height="563" preserveAspectRatio="xMidYMid meet"></image></svg></div><span class="about-dev">${BUILD_YYYY_MM} · V${CARD_DISPLAY_VERSION} · Gewitterradar · by CK</span></div><button class="about-understood" type="button">${icon('check')}<span data-about-text="understood"></span></button><button class="about-later" type="button">${icon('clock')}<span data-about-text="later"></span></button><div class="about-footer-reminder">${icon('settings')}<p data-about-text="footer"></p></div></footer>
      </dialog>`;

      const dialog = shell.querySelector('dialog');
      const code = shell.querySelector('pre code');
      ABOUT_RECORDER_YAML.split('\n').forEach((line, index, lines) => {
        const span = document.createElement('span');
        span.className = line.includes('lightning_strike*') ? 'about-code-glob' : line.trimEnd().endsWith(':') ? 'about-code-key' : '';
        span.textContent = line + (index < lines.length - 1 ? '\n' : '');
        code.append(span);
        const number = document.createElement('span');
        number.textContent = String(index + 1);
        shell.querySelector('.about-line-numbers').append(number);
      });
      const list = shell.querySelector('.about-settings-list');
      for (const key of Object.keys(SETTING_ENTITIES)) {
        const row = document.createElement('div');
        row.className = 'about-entity'; row.dataset.setting = key;
        row.innerHTML = '<strong></strong><p class="about-purpose"></p><div><code class="about-native-id"></code></div><div class="about-legacy-id"></div><div class="about-entity-status"></div>';
        list.append(row);
      }
      for (const match of ABOUT_RECORDER_YAML.matchAll(/^\s+- "?([^"\n]+)"?$/gm)) {
        const row = document.createElement('li');
        row.innerHTML = '<code></code><p class="about-purpose"></p>';
        row.dataset.source = match[1];
        row.querySelector('code').textContent = match[1];
        shell.querySelector('.about-source-list').append(row);
      }
      this._aboutReturnFocus = this.shadow.activeElement;
      this.shadow.append(shell);
      const aboutFooterSignatureImage = shell.querySelector('#about-footer-signature-image');
      _uiAsset7VerifiedUri().then((uri) => {
        if (uri && aboutFooterSignatureImage?.isConnected) aboutFooterSignatureImage.setAttribute('href', uri);
      });
      this._aboutDialog = dialog;
      dialog.querySelector('[data-about-close]').addEventListener('click', () => this._closeAbout());
      dialog.querySelector('.about-understood').addEventListener('click', () => this._closeAbout(true));
      dialog.querySelector('.about-later').addEventListener('click', () => this._closeAbout());
      dialog.querySelector('.about-copy').addEventListener('click', () => this._copyAboutRecorder());
      dialog.addEventListener('cancel', (event) => { event.preventDefault(); event.stopPropagation(); this._closeAbout(); });
      dialog.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); this._closeAbout(); }
        if (event.key === 'Tab') {
          const stops = [...dialog.querySelectorAll('button,summary,[tabindex="0"]')].filter(node => node.getClientRects().length);
          const first = stops[0], last = stops[stops.length - 1], active = this.shadow.activeElement;
          if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
          event.stopPropagation();
        }
      });
      // Prevent wheel/touch scroll from escaping through header/footer/backdrop.
      dialog.addEventListener('wheel', (event) => { if (!event.target.closest('.about-content')) event.preventDefault(); }, {passive:false});
      dialog.addEventListener('touchmove', (event) => { if (!event.target.closest('.about-content')) event.preventDefault(); }, {passive:false});
      this._syncAbout();
      dialog.showModal();
      deps.aboutClaimedVersion = ABOUT_ONBOARDING_VERSION;
      const aboutClose = dialog.querySelector('[data-about-close]');
      const touchTablet = fromSettings && navigator.maxTouchPoints > 0 && Math.min(window.innerWidth, window.innerHeight) >= 700;
      dialog.classList.toggle('about-touch-tablet', touchTablet);
      if (touchTablet) {
        dialog.tabIndex = -1;
        dialog.focus({preventScroll:true});
      } else {
        aboutClose.focus({preventScroll:true});
      }
    },

    _syncAbout() {
      const dialog = this._aboutDialog;
      if (!dialog) return;
      const language = this._languageValue();
      dialog.dataset.aboutLanguage = language;
      const locale = resolveAboutLocale(language);
      const status = dialog.querySelector('.about-copy-status');
      if (this._aboutStatusLanguage !== language || this._aboutStatusLocale !== locale) status.textContent = '';
      this._aboutStatusLanguage = language; this._aboutStatusLocale = locale;
      const t = (key) => locale.strings[key];
      const mobileDedicationParts = [
        'Danke, dass du mir die Zeit',
        ' lässt, meinen Interessen und',
        ' meiner Begeisterung für Technik,',
        ' Wetter und all den Ideen dazwischen',
        ' nachzugehen – und mich Projekten',
        ' wie Gewitterradar mit so viel Freude',
        ' und Ausdauer zu widmen.'
      ];
      const mobileDedicationText = mobileDedicationParts.join('');
      for (const node of dialog.querySelectorAll('[data-about-text]')) {
        const text = t(node.dataset.aboutText);
        const isGermanDedication = node.dataset.aboutText === 'dedicationText' && language === 'Deutsch' && text === mobileDedicationText;
        if (isGermanDedication) {
          if (node.dataset.mobilePortraitLayout !== text) {
            node.replaceChildren();
            mobileDedicationParts.forEach((part, index) => {
              if (index) {
                const lineBreak = document.createElement('span');
                lineBreak.className = 'about-mobile-break';
                lineBreak.setAttribute('aria-hidden', 'true');
                node.append(lineBreak);
              }
              node.append(document.createTextNode(part));
            });
            node.dataset.mobilePortraitLayout = text;
          }
          continue;
        }
        if (node.dataset.mobilePortraitLayout) delete node.dataset.mobilePortraitLayout;
        if (node.textContent !== text) node.textContent = text;
      }
      dialog.querySelector('[data-about-close]').setAttribute('aria-label', t('close'));
      dialog.querySelector('.about-copy').setAttribute('aria-label', t('copy'));
      const {settingLabels: labels, settingPurposes: purposes, sourcePurposes} = locale;
      const setText = (node, value) => { if (node.textContent !== value) node.textContent = value; };
      dialog.querySelectorAll('.about-source-list [data-source]').forEach((row) => setText(row.querySelector('.about-purpose'), sourcePurposes[row.dataset.source]));
      requestAboutLocale(language, () => {
        if (this._aboutDialog === dialog && this._languageValue() === language) this._syncAbout();
      });
      for (const row of dialog.querySelectorAll('[data-setting]')) {
        const key = row.dataset.setting, mapping = SETTING_ENTITIES[key];
        const resolved = this[ABOUT_SETTING_ACCESSORS[key]]();
        const state = this._hass?.states?.[resolved]?.state;
        const available = state != null && !['unknown','unavailable',''].includes(state);
        const source = resolved === mapping.native ? t('sourceNative') : resolved === mapping.legacy ? t('legacy') : t('override');
        setText(row.querySelector('strong'), labels[key]);
        setText(row.querySelector('.about-purpose'), purposes[key]);
        setText(row.querySelector('.about-native-id'), mapping.native);
        setText(row.querySelector('.about-legacy-id'), `${t('legacy')}: ${mapping.legacy} · ${t('legacyPurpose')}`);
        setText(row.querySelector('.about-entity-status'), `${t('resolved')}: ${resolved} · ${source} · ${t(available ? 'available' : 'unavailable')}`);
      }
      for (const row of dialog.querySelectorAll('[data-radius]')) {
        const key = row.dataset.radius;
        const state = this._hass?.states?.[this[ABOUT_SETTING_ACCESSORS[key]]()]?.state;
        const value = state == null || String(state).trim() === '' ? null : finiteNumber(state);
        setText(row.querySelector('strong span'), labels[key]);
        setText(row.querySelector('output'), value == null ? '—' : this._formatRadiusDistance(value).text);
      }
    },

    _closeAbout(acknowledge = false, restoreFocus = true) {
      if (!this._aboutDialog) return;
      if (acknowledge) {
        try {
          const seen = Number(localStorage.getItem(ABOUT_STORAGE_KEY)) || 0;
          localStorage.setItem(ABOUT_STORAGE_KEY, String(Math.max(seen, ABOUT_ONBOARDING_VERSION)));
        } catch (_) {}
      }
      this._aboutDialog.close();
      this._aboutDialog.parentElement.remove();
      this._aboutDialog = null;
      const focus = this._aboutReturnFocus || this.shadow?.getElementById('settings-open');
      this._aboutReturnFocus = null;
      if (restoreFocus && focus?.isConnected) focus.focus({preventScroll:true});
    },

    async _copyRecorderYaml(dialog, buttonSelector, statusSelector, strings) {
      if (!dialog?.open) return;
      const button = dialog.querySelector(buttonSelector);
      let copied = false;
      try {
        await navigator.clipboard.writeText(ABOUT_RECORDER_YAML);
        copied = true;
      } catch (_) {
        if (!dialog.open) return;
        const area = document.createElement('textarea');
        area.value = ABOUT_RECORDER_YAML;
        area.readOnly = true;
        area.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;';
        dialog.append(area);
        try { area.select(); copied = document.execCommand('copy'); } catch (_) {}
        finally { area.remove(); button?.focus({preventScroll:true}); }
      }
      if (dialog.open) dialog.querySelector(statusSelector).textContent = strings[copied ? 'copied' : 'copyFailed'];
    },

    _copyAboutRecorder() {
      const locale = resolveAboutLocale(this._languageValue());
      return this._copyRecorderYaml(this._aboutDialog,'.about-copy','.about-copy-status',locale.strings);
    },

    _copyHelpRecorder() {
      const locale = resolveAboutLocale(this._languageValue());
      return this._copyRecorderYaml(this._helpDialog,'.help-copy','.help-copy-status',locale.help);
    },

    _settingEntityDomain(entityId) {
      return String(entityId || '').split('.',1)[0];
    },

    _selectSetting(entityId,option) {
      const domain = this._settingEntityDomain(entityId);
      if (!['select','input_select'].includes(domain)) return Promise.resolve(false);
      return this._hass.callService(domain,'select_option',{ entity_id:entityId,option });
    },

    _setLegacySelectOptions(entityId,options) {
      const domain = this._settingEntityDomain(entityId);
      if (domain !== 'input_select') return Promise.resolve(false);
      return this._hass.callService(domain,'set_options',{ entity_id:entityId,options });
    },

    _numberSetting(entityId,value) {
      const domain = this._settingEntityDomain(entityId);
      if (!['number','input_number'].includes(domain)) return Promise.resolve(false);
      this._settingNumberWriteQueue = (this._settingNumberWriteQueue || Promise.resolve())
        .catch(() => undefined)
        .then(() => this._hass.callService(domain,'set_value',{ entity_id:entityId,value }));
      return this._settingNumberWriteQueue;
    },

    _switchSetting(entityId,next) {
      const domain = this._settingEntityDomain(entityId);
      if (!['switch','input_boolean'].includes(domain)) return Promise.resolve(false);
      return this._hass.callService(domain,next ? 'turn_on' : 'turn_off',{ entity_id:entityId });
    },

    _toggleSetting(entityId) {
      return this._switchSetting(entityId,this._hass?.states?.[entityId]?.state !== 'on');
    },

    _auraEntity() { return this._resolveSettingEntity('aura_effects',this._config.aura_entity); },
    _auraWidthEntity() { return this._resolveSettingEntity('aura_width',this._config.aura_width_entity); },
    _auraIntensityEntity() { return this._resolveSettingEntity('aura_intensity',this._config.aura_intensity_entity); },
    _auraEnabled() {
      if (typeof this._settingsAuraEnabledPreview === 'boolean') return this._settingsAuraEnabledPreview;
      return this._hass?.states?.[this._auraEntity()]?.state === 'on';
    },
    _auraWidthValue() {
      // V3.9936 – null darf hier NICHT durch finiteNumber() laufen: Number(null)
      // ergibt 0 und hatte dadurch ohne aktive Vorschau permanent 15 % Breite
      // erzwungen. Ein lokaler Preview-Wert gilt nur, wenn er wirklich numerisch ist.
      const preview = Number.isFinite(this._settingsAuraWidthPreview)
        ? this._settingsAuraWidthPreview
        : null;
      const helper = finiteNumber(this._hass?.states?.[this._auraWidthEntity()]?.state);
      const raw = preview ?? helper ?? AURA_WIDTH_DEFAULT;
      return clamp(raw,AURA_WIDTH_MIN,AURA_WIDTH_MAX);
    },
    _auraIntensityValue() {
      // Derselbe Null->0-Fehler setzte die Aura-Intensität effektiv auf 0 % und
      // erklärte zugleich, warum trotz vorhandener Helfer keine Radius-Aura erschien.
      const preview = Number.isFinite(this._settingsAuraIntensityPreview)
        ? this._settingsAuraIntensityPreview
        : null;
      const helper = finiteNumber(this._hass?.states?.[this._auraIntensityEntity()]?.state);
      const raw = preview ?? helper ?? AURA_INTENSITY_DEFAULT;
      return clamp(raw,AURA_INTENSITY_MIN,AURA_INTENSITY_MAX);
    },

    _observationEntity() { return this._resolveSettingEntity('observation_radius',this._config.radius_entity || this._config.observation_radius_entity); },
    _stormEntity() { return this._resolveSettingEntity('storm_radius',this._config.storm_radius_entity); },
    _dangerEntity() { return this._resolveSettingEntity('danger_radius',this._config.danger_radius_entity); },
    _animationEntity() { return this._resolveSettingEntity('warning_animation',this._config.warning_animation_entity); },
    _stormSimulationEntity() { return this._resolveSettingEntity('storm_simulation',this._config.storm_simulation_entity); },
    _locationSelectEntity() { return this._resolveSettingEntity('reference_location',this._config.location_select_entity); },
    _locationMainViewEntity() { return this._resolveSettingEntity('show_location_selector',this._config.location_main_view_entity); },
    _modeEntity() { return this._resolveSettingEntity('compass_nearest_strike',this._config.compass_mode_entity); },
    _deviceOrientationEntity() { return this._resolveSettingEntity('compass_device_orientation',this._config.device_orientation_entity); },
    _mapGroupingEntity() { return this._resolveSettingEntity('map_grouping',this._config.map_grouping_entity); },
    _compassDesignEntity() { return this._resolveSettingEntity('compass_design',this._config.compass_design_entity); },
    _counterEntity() { return this._config.counter_entity || 'sensor.home_lightning_counter'; },

};});

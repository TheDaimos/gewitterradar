import { APPLICATION_RELEASE } from "./version.js?v=411199r1";
import { registerModule } from "./modules/core/registry.js?v=41108r1";
export const APPLICATION_META=APPLICATION_RELEASE;
export const EXPECTED_MODULES=Object.freeze([
  {
    "id": "core.manifest",
    "version": "1.2.206",
    "group": "Kern",
    "function": "Modulmanifest",
    "subfunctions": [
      "Sollstand",
      "Produktversion",
      "Buildkennung"
    ],
    "file": "module-manifest.js"
  },
  {
    "id": "core.base-context",
    "version": "1.0.8",
    "group": "Kern",
    "function": "Konstanten & gemeinsame Helfer",
    "subfunctions": [
      "Assets",
      "Konstanten",
      "Sprache",
      "Speichergrundlagen",
      "Geometrie",
      "Leaflet-Helfer"
    ],
    "file": "modules/core/base-context.js"
  },
  {
    "id": "core.registry",
    "version": "1.0.2",
    "group": "Kern",
    "function": "Modulregister",
    "subfunctions": [
      "Selbstregistrierung",
      "Soll/Ist-PrÃ¼fung",
      "Diagnoseexport"
    ],
    "file": "modules/core/registry.js"
  },
  {
    "id": "core.runtime",
    "version": "1.0.2",
    "group": "Kern",
    "function": "Modul-Laufzeit",
    "subfunctions": [
      "Selbstregistrierung",
      "Methodeninstallation",
      "AbhÃ¤ngigkeitsÃ¼bergabe"
    ],
    "file": "modules/core/runtime.js"
  },
  {
    "id": "core.card-lifecycle",
    "version": "1.0.16",
    "group": "Kern",
    "function": "Karten-Lebenszyklus",
    "subfunctions": [
      "Konfiguration",
      "Verbinden",
      "Trennen"
    ],
    "file": "modules/core/card-lifecycle.js"
  },
  {
    "id": "fullscreen.map-display",
    "version": "1.0.44",
    "group": "Vollbild",
    "function": "Kartendarstellung",
    "subfunctions": [
      "Standard",
      "GroÃŸ",
      "Vollbild",
      "separates Fenster",
      "Instrumentpositionen",
      "Medaillon-Augenreferenz",
      "Medaillon-Diagnose-Akkordeon",
      "Produktive Pfeilkalibrierung",
      "Vollbild-Instrumentskalierung"
    ],
    "file": "modules/fullscreen/map-display.js"
  },
  {
    "id": "ui.scroll-guard",
    "version": "1.0.1",
    "group": "OberflÃ¤che",
    "function": "Scrollschutz",
    "subfunctions": [
      "Home-Assistant-Seitenleiste",
      "Touch",
      "iPad/WebKit",
      "HA-State"
    ],
    "file": "modules/ui/scroll-guard.js"
  },
  {
    "id": "ui.skeleton",
    "version": "1.1.29",
    "group": "OberflÃ¤che",
    "function": "GrundgerÃ¼st",
    "subfunctions": [
      "HTML",
      "CSS",
      "Dialoge",
      "MenÃ¼struktur",
      "skalierbare Vollbild-Instrumente"
    ],
    "file": "modules/ui/skeleton.js"
  },
  {
    "id": "ui.project-hub",
    "version": "1.1.17",
    "group": "OberflÃ¤che",
    "function": "Daimos Project Hub",
    "subfunctions": [
      "Signatur-Einstieg",
      "Haupttitel-Einstieg",
      "Host-Popup",
      "Health-Probe",
      "Online-/Offline-Status",
      "Lokale RC14-Runtime"
    ],
    "file": "modules/ui/project-hub.js"
  },
  {
    "id": "instruments.compass-scale",
    "version": "1.0.1",
    "group": "Instrumente",
    "function": "Kompass-Skala",
    "subfunctions": [
      "Skala",
      "Geometrie"
    ],
    "file": "modules/instruments/compass-scale.js"
  },
  {
    "id": "ui.controls",
    "version": "1.1.35",
    "group": "OberflÃ¤che",
    "function": "Bedienbindungen",
    "subfunctions": [
      "Klick",
      "Touch",
      "Formulare",
      "MenÃ¼aktionen"
    ],
    "file": "modules/ui/controls.js"
  },
  {
    "id": "ui.i18n-settings",
    "version": "1.3.24",
    "group": "OberflÃ¤che",
    "function": "Sprache & Einstellungen",
    "subfunctions": [
      "Ãœbersetzung",
      "About",
      "Einstellungen",
      "Hilfetexte"
    ],
    "file": "modules/ui/i18n-settings.js"
  },
  {
    "id": "core.update-watch",
    "version": "1.0.1",
    "group": "Kern",
    "function": "Frontend-Aktualisierung",
    "subfunctions": [
      "Installierten Stand prÃ¼fen",
      "Aktualisierungshinweis",
      "Kontrollierte Vollneuladung"
    ],
    "file": "modules/core/update-watch.js"
  },
  {
    "id": "core.source-status",
    "version": "1.0.2",
    "group": "Kern",
    "function": "Datenquellenstatus",
    "subfunctions": [
      "Blitzortung-Status",
      "Statusanzeige"
    ],
    "file": "modules/core/source-status.js"
  },
  {
    "id": "instruments.compass-selector",
    "version": "1.1.6",
    "group": "Instrumente",
    "function": "Kompassauswahl",
    "subfunctions": [
      "Designauswahl",
      "Popup",
      "Aura-unabhÃ¤ngige Designauswahl"
    ],
    "file": "modules/instruments/compass-selector.js"
  },
  {
    "id": "instruments.medallion-designs",
    "version": "1.3.1",
    "group": "Instrumente",
    "function": "Medaillon-Designkatalog",
    "subfunctions": [
      "Designvarianten",
      "Assetzuordnung",
      "Diagnosegrundprofile",
      "Pfeilvarianten",
      "Pfeilauswahl",
      "Pfeil/Auge-Geometriedatenbank",
      "Zentrums-Kalibrierung",
      "Augen-Referenzkreis"
    ],
    "file": "modules/instruments/medallion-designs.js"
  },
  {
    "id": "diagnostics.module-view",
    "version": "1.3.10",
    "group": "Diagnose",
    "function": "Module & Versionen",
    "subfunctions": [
      "Geladene Module",
      "Soll/Ist-Vergleich",
      "Versionsstatus",
      "Modul-Details",
      "Diagnose kopieren",
      "JSON herunterladen"
    ],
    "file": "modules/diagnostics/module-view.js"
  },
  {
    "id": "diagnostics.data-sources",
    "version": "0.1.4",
    "group": "Datenquellen & Verbindungen",
    "function": "Datenquellen â€“ Ãœbersicht und Diagnose",
    "subfunctions": [
      "Blitzortung-Untermodul",
      "WeatherRouter-Status",
      "Standorte je Konfiguration",
      "Nur-Lesen-Einstellungen",
      "Aktualisieren",
      "JSON herunterladen"
    ],
    "file": "modules/diagnostics/data-sources.js"
  },
  {
    "id": "sources.blitzortung",
    "version": "0.1.0",
    "group": "Datenquellen & Verbindungen",
    "function": "Blitzortung.org â€“ Integration und Standorte",
    "subfunctions": [
      "Integrationsstatus",
      "Mehrere Standorte",
      "Tracker-Kopplung",
      "Einstellungen (Nur Lesen)",
      "Sensorstatus",
      "Diagnoseexport"
    ],
    "file": "modules/sources/blitzortung.js"
  },
  {
    "id": "diagnostics.map",
    "version": "1.0.6",
    "group": "Diagnose",
    "function": "Kartendiagnose",
    "subfunctions": [
      "Mobile Live-Diagnose",
      "Pointer- und Touch-Protokoll",
      "Leaflet-Zustand",
      "Gesten-Recovery",
      "Ereignisringpuffer",
      "JSON kopieren",
      "JSON herunterladen",
      "Minimierbare Diagnose"
    ],
    "file": "modules/diagnostics/map-diagnostics.js"
  },
  {
    "id": "diagnostics.cockpit",
    "version": "1.5.8",
    "group": "Diagnose",
    "function": "Diagnose & Kalibrierung",
    "subfunctions": [
      "Diagnosekonsole",
      "Virtuelles Gewitter",
      "Kompass-Kalibrierung",
      "Medaillon-Kalibrierung",
      "Pfeil/Auge-Fit-Matrix",
      "Visuelle Pfeilkalibrierung",
      "Augen-Referenzkreis",
      "Leistung"
    ],
    "file": "modules/diagnostics/cockpit.js"
  },
  {
    "id": "diagnostics.raster-lab",
    "version": "0.1.24",
    "group": "Diagnose",
    "function": "Raster-Labor",
    "subfunctions": [
      "Nummerierte Layerauswahl",
      "Live-Vorschau",
      "Zoomprofile",
      "Vergleich mit Referenz",
      "Zwischenablage",
      "JSON-Export",
      "Sicherer RÃ¼ckfall"
    ],
    "file": "modules/diagnostics/raster-lab.js"
  },
  {
    "id": "instruments.compass-design",
    "version": "1.0.1",
    "group": "Instrumente",
    "function": "Kompassdesign",
    "subfunctions": [
      "Design anwenden",
      "Grafikgeometrie"
    ],
    "file": "modules/instruments/compass-design.js"
  },
  {
    "id": "location.radii-map",
    "version": "1.0.25",
    "group": "Standort & Radien",
    "function": "Standort, Radien & Kartenstart",
    "subfunctions": [
      "Standort",
      "Radien",
      "Aura",
      "Karteninitialisierung"
    ],
    "file": "modules/location/radii-map.js"
  },
  {
    "id": "map.strikes-warnings",
    "version": "1.0.1",
    "group": "Karte",
    "function": "Blitze & Warnungen",
    "subfunctions": [
      "Blitzaufnahme",
      "Warnanimation",
      "GerÃ¤teorientierung"
    ],
    "file": "modules/map/strikes-warnings.js"
  },
  {
    "id": "map.clusters-recent",
    "version": "1.0.14",
    "group": "Karte",
    "function": "Cluster & letzte Blitze",
    "subfunctions": [
      "Cluster",
      "Marker",
      "Recent-Liste",
      "Navigation"
    ],
    "file": "modules/map/clusters-recent.js"
  },
  {
    "id": "ui.render",
    "version": "1.0.3",
    "group": "OberflÃ¤che",
    "function": "Hauptrendering",
    "subfunctions": [
      "Status",
      "KPI",
      "Listen",
      "UI-Synchronisierung"
    ],
    "file": "modules/ui/render.js"
  },
  {
    "id": "instruments.compass",
    "version": "1.0.1",
    "group": "Instrumente",
    "function": "Kompass",
    "subfunctions": [
      "Bewegungsprofil",
      "Animation",
      "Rendering"
    ],
    "file": "modules/instruments/compass.js"
  },
  {
    "id": "weather.consumer-client",
    "version": "1.2.16",
    "group": "Weather-Engine",
    "function": "WeatherRouter Consumer V1/V2",
    "subfunctions": [
      "Discovery",
      "Capability-Katalog",
      "Resolve",
      "Quellenstatus",
      "Diagnose-Trace",
      "Weather Engine Diagnose"
    ],
    "file": "modules/weather/consumer-client.js"
  },
  {
    "id": "weather.precipitation-layer",
    "version": "1.3.36",
    "group": "Weather-Engine",
    "function": "Niederschlags-Kartenebene",
    "subfunctions": [
      "Raster-Kacheladapter",
      "Web-Mercator-BBOX",
      "Quelle & AktualitÃ¤t",
      "Abdeckung",
      "Darstellungslegende",
      "Darstellungstransparenz",
      "FlÃ¤chenglÃ¤ttung",
      "Anfragebegrenzung",
      "RÃ¤umlicher Vorladepuffer",
      "Niederschlags-Zeitplayer",
      "Frame-Doppelpuffer",
      "Zeitachse ein/aus",
      "verschiebbare Zeitachse",
      "Ressourcenschutz"
    ],
    "file": "modules/weather/precipitation-layer.js"
  },
  {
    "id": "weather.layer-menu",
    "version": "1.1.17",
    "group": "Weather-Engine",
    "function": "WeatherRouter Layer Hub",
    "subfunctions": [
      "Consumer-V1-Erkennung",
      "KartenfÃ¤higkeiten",
      "Schnellzugriff",
      "Fachbereiche",
      "Niederschlags-Layer",
      "Zeitachse",
      "scrollbares MenÃ¼",
      "stabile Desktop-Navigation",
      "Status & RÃ¼cknavigation"
    ],
    "file": "modules/weather/layer-menu.js"
  },
  {
    "id": "weather.display-menu",
    "version": "0.4.47",
    "group": "Weather-Engine",
    "function": "WeatherRouter-Darstellung",
    "subfunctions": [
      "gemeinsamer Darstellungszustand",
      "Offline-Teaser",
      "Augen-Bedienelement",
      "schwebendes KartenmenÃ¼",
      "Pointer-Drag",
      "Positionsspeicherung",
      "Niederschlagsstile",
      "Legendenmodus",
      "finale Augenassets",
      "Leaflet-sichere Rasterstile",
      "flÃ¤chige GlÃ¤ttung",
      "Hotspot-Erhalt",
      "Transparenz im KartenmenÃ¼",
      "Transparenz je Darstellungsfamilie",
      "entkoppelter UI-Zustand",
      "Layer-Schnellzugriff"
    ],
    "file": "modules/weather/display-menu.js"
  },
  {
    "id": "weather.legend-overlay",
    "version": "0.1.13",
    "group": "Weather-Engine",
    "function": "WeatherRouter-Darstellungslegende",
    "subfunctions": [
      "generisches Legendenmodell",
      "Auto/Ein/Aus",
      "WR-Metadaten",
      "Bildlegenden",
      "strukturierte Skalen",
      "Kartenoverlay",
      "mehrere aktive Legenden",
      "sichere Kartenposition"
    ],
    "file": "modules/weather/legend-overlay.js"
  },
  {
    "id": "history.chart",
    "version": "1.0.1",
    "group": "Verlauf",
    "function": "Trend & Verlauf",
    "subfunctions": [
      "Trendberechnung",
      "120-Minuten-Diagramm"
    ],
    "file": "modules/history/chart.js"
  },
  {
    "id": "weather.wind-display",
    "version": "0.4.20",
    "group": "Weather-Engine",
    "function": "Konfigurierbare WR-Winddarstellung",
    "subfunctions": [
      "Windfahnen",
      "Richtungspfeile",
      "numerisches Windfeld",
      "Windgeschwindigkeits-FarbflÃ¤che",
      "persistente Symbolfarben",
      "Premium-Windlegende"
    ],
    "file": "modules/weather/wind-display.js"
  },
  {
    "id": "weather.temperature-display",
    "version": "0.1.13",
    "group": "Weather-Engine",
    "function": "Weltweite Temperatur und thermische Advektion",
    "subfunctions": [
      "Temperatur 2 m",
      "native Temperaturwerte",
      "Advektion 850 hPa",
      "GeoPointContext",
      "Premium-Kartenschalter"
    ],
    "file": "modules/weather/temperature-display.js"
  }
 ,{"id":"weather.synoptic-display","version":"0.1.5","group":"Weather-Engine","function":"Synoptik H/T und Isobaren","subfunctions":["WR V2 H/T","WR V2 Isobaren","geografische Vektordarstellung","Premium-Konfiguration"],"file":"modules/weather/synoptic-display.js"}
].map(item=>Object.freeze(item)));
export const MODULE_META=Object.freeze({id:"core.manifest",version:EXPECTED_MODULES.find(item=>item.id==="core.manifest")?.version,group:"Kern",function:"Modulmanifest",subfunctions:["Sollstand","Produktversion","Buildkennung"],file:"module-manifest.js",build:APPLICATION_META.build});registerModule(MODULE_META);

import { APPLICATION_RELEASE } from "./version.js?v=41139r1";
import { registerModule } from "./modules/core/registry.js?v=41108r1";
export const APPLICATION_META=APPLICATION_RELEASE;
export const EXPECTED_MODULES=Object.freeze([
  {
    "id": "core.manifest",
    "version": "1.2.110",
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
    "version": "1.0.7",
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
      "Soll/Ist-Prüfung",
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
      "Abhängigkeitsübergabe"
    ],
    "file": "modules/core/runtime.js"
  },
  {
    "id": "core.card-lifecycle",
    "version": "1.0.6",
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
    "version": "1.0.32",
    "group": "Vollbild",
    "function": "Kartendarstellung",
    "subfunctions": [
      "Standard",
      "Groß",
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
    "group": "Oberfläche",
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
    "version": "1.1.19",
    "group": "Oberfläche",
    "function": "Grundgerüst",
    "subfunctions": [
      "HTML",
      "CSS",
      "Dialoge",
      "Menüstruktur",
      "skalierbare Vollbild-Instrumente"
    ],
    "file": "modules/ui/skeleton.js"
  },
  {
    "id": "ui.project-hub",
    "version": "1.1.15",
    "group": "Oberfläche",
    "function": "Daimos Project Hub",
    "subfunctions": ["Signatur-Einstieg","Haupttitel-Einstieg","Host-Popup","Health-Probe","Online-/Offline-Status","Lokale RC14-Runtime"],
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
    "version": "1.1.7",
    "group": "Oberfläche",
    "function": "Bedienbindungen",
    "subfunctions": [
      "Klick",
      "Touch",
      "Formulare",
      "Menüaktionen"
    ],
    "file": "modules/ui/controls.js"
  },
  {
    "id": "ui.i18n-settings",
    "version": "1.3.6",
    "group": "Oberfläche",
    "function": "Sprache & Einstellungen",
    "subfunctions": [
      "Übersetzung",
      "About",
      "Einstellungen",
      "Hilfetexte"
    ],
    "file": "modules/ui/i18n-settings.js"
  },
  {
    "id": "core.update-watch",
    "version": "1.0.0",
    "group": "Kern",
    "function": "Frontend-Aktualisierung",
    "subfunctions": [
      "Installierten Stand prüfen",
      "Aktualisierungshinweis",
      "Kontrollierte Vollneuladung"
    ],
    "file": "modules/core/update-watch.js"
  },
  {
    "id": "core.source-status",
    "version": "1.0.1",
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
    "version": "1.1.0",
    "group": "Instrumente",
    "function": "Kompassauswahl",
    "subfunctions": [
      "Designauswahl",
      "Popup",
      "Aura-unabhängige Designauswahl"
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
    "version": "1.3.6",
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
    "id": "diagnostics.map",
    "version": "1.0.5",
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
    "version": "1.5.1",
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
    "version": "1.0.19",
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
      "Geräteorientierung"
    ],
    "file": "modules/map/strikes-warnings.js"
  },
  {
    "id": "map.clusters-recent",
    "version": "1.0.4",
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
    "group": "Oberfläche",
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
    "version": "1.2.1",
    "group": "Weather-Engine",
    "function": "WeatherRouter Consumer V1",
    "subfunctions": ["Discovery", "Capability-Katalog", "Resolve", "Quellenstatus", "Diagnose-Trace", "Weather Engine Diagnose"],
    "file": "modules/weather/consumer-client.js"
  },
  {
    "id": "weather.precipitation-layer",
    "version": "1.3.5",
    "group": "Weather-Engine",
    "function": "Niederschlags-Kartenebene",
    "subfunctions": [
      "Raster-Kacheladapter",
      "Web-Mercator-BBOX",
      "Quelle & Aktualität",
      "Abdeckung",
      "Darstellungslegende",
      "Darstellungstransparenz",
      "Flächenglättung",
      "Anfragebegrenzung",
      "Räumlicher Vorladepuffer",
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
    "version": "1.1.4",
    "group": "Weather-Engine",
    "function": "WeatherRouter Layer Hub",
    "subfunctions": [
      "Consumer-V1-Erkennung",
      "Kartenfähigkeiten",
      "Schnellzugriff",
      "Fachbereiche",
      "Niederschlags-Layer",
      "Zeitachse",
      "scrollbares Menü",
      "stabile Desktop-Navigation",
      "Status & Rücknavigation"
    ],
    "file": "modules/weather/layer-menu.js"
  },
  {
    "id": "weather.display-menu",
    "version": "0.4.9",
    "group": "Weather-Engine",
    "function": "WeatherRouter-Darstellung",
    "subfunctions": [
      "gemeinsamer Darstellungszustand",
      "Offline-Teaser",
      "Augen-Bedienelement",
      "schwebendes Kartenmenü",
      "Pointer-Drag",
      "Positionsspeicherung",
      "Niederschlagsstile",
      "Legendenmodus",
      "finale Augenassets",
      "Leaflet-sichere Rasterstile",
      "flächige Glättung",
      "Hotspot-Erhalt",
      "Transparenz im Kartenmenü",
      "Transparenz je Darstellungsfamilie",
      "entkoppelter UI-Zustand",
      "Layer-Schnellzugriff"
    ],
    "file": "modules/weather/display-menu.js"
  },
  {
    "id": "weather.legend-overlay",
    "version": "0.1.1",
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
  }
].map(item=>Object.freeze(item)));
export const MODULE_META=Object.freeze({id:"core.manifest",version:"1.2.108",group:"Kern",function:"Modulmanifest",subfunctions:["Sollstand","Produktversion","Buildkennung"],file:"module-manifest.js",build:APPLICATION_META.build});registerModule(MODULE_META);

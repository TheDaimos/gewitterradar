import { registerModule } from "./modules/core/registry.js?v=41002";
export const APPLICATION_META=Object.freeze({id:"gewitterradar",version:"4.10.02",displayVersion:"V4.10.02",build:"V4.10.02-MODULAR-DEV-2026-09-21"});
export const EXPECTED_MODULES=Object.freeze([
  {
    "id": "core.manifest",
    "version": "1.2.0",
    "group": "Kern",
    "function": "Modulmanifest",
    "subfunctions": ["Sollstand", "Produktversion", "Buildkennung"],
    "file": "module-manifest.js"
  },
  {
    "id": "core.base-context",
    "version": "1.0.2",
    "group": "Kern",
    "function": "Konstanten & gemeinsame Helfer",
    "subfunctions": ["Assets", "Konstanten", "Sprache", "Speichergrundlagen", "Geometrie", "Leaflet-Helfer"],
    "file": "modules/core/base-context.js"
  },
  {
    "id": "core.registry",
    "version": "1.0.0",
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
    "version": "1.0.0",
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
    "version": "1.0.0",
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
    "version": "1.0.0",
    "group": "Vollbild",
    "function": "Kartendarstellung",
    "subfunctions": [
      "Standard",
      "Groß",
      "Vollbild",
      "separates Fenster",
      "Instrumentpositionen"
    ],
    "file": "modules/fullscreen/map-display.js"
  },
  {
    "id": "ui.scroll-guard",
    "version": "1.0.0",
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
    "version": "1.1.1",
    "group": "Oberfläche",
    "function": "Grundgerüst",
    "subfunctions": [
      "HTML",
      "CSS",
      "Dialoge",
      "Menüstruktur"
    ],
    "file": "modules/ui/skeleton.js"
  },
  {
    "id": "instruments.compass-scale",
    "version": "1.0.0",
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
    "version": "1.1.1",
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
  },
  {
    "id": "core.source-status",
    "version": "1.0.0",
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
    "version": "1.0.0",
    "group": "Instrumente",
    "function": "Kompassauswahl",
    "subfunctions": [
      "Designauswahl",
      "Popup",
      "Rahmenwahl",
      "Diagnosegeometrie"
    ],
    "file": "modules/instruments/compass-selector.js"
  },
  {
    "id": "diagnostics.module-view",
    "version": "1.2.2",
    "group": "Diagnose",
    "function": "Module & Versionen",
    "subfunctions": ["Geladene Module", "Soll/Ist-Vergleich", "Versionsstatus", "Modul-Details", "Diagnose kopieren", "JSON herunterladen"],
    "file": "modules/diagnostics/module-view.js"
  },
  {
    "id": "diagnostics.cockpit",
    "version": "1.0.0",
    "group": "Diagnose",
    "function": "Diagnose & Kalibrierung",
    "subfunctions": [
      "Diagnosekonsole",
      "Virtuelles Gewitter",
      "Kompass-Kalibrierung",
      "Medaillon-Kalibrierung",
      "Leistung"
    ],
    "file": "modules/diagnostics/cockpit.js"
  },
  {
    "id": "instruments.compass-design",
    "version": "1.0.0",
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
    "version": "1.0.0",
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
    "version": "1.0.0",
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
    "version": "1.0.0",
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
    "version": "1.0.0",
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
    "version": "1.0.0",
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
    "id": "history.chart",
    "version": "1.0.0",
    "group": "Verlauf",
    "function": "Trend & Verlauf",
    "subfunctions": [
      "Trendberechnung",
      "120-Minuten-Diagramm"
    ],
    "file": "modules/history/chart.js"
  }
].map(item=>Object.freeze(item)));
export const MODULE_META=Object.freeze({id:"core.manifest",version:"1.2.0",group:"Kern",function:"Modulmanifest",subfunctions:["Sollstand","Produktversion","Buildkennung"],file:"module-manifest.js",build:APPLICATION_META.build});registerModule(MODULE_META);

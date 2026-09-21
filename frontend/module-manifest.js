import { registerModule } from "./modules/core/registry.js";

export const APPLICATION_META = Object.freeze({
  id: "gewitterradar",
  version: "4.10.02",
  displayVersion: "V4.10.02",
  build: "V4.10.02-MODULAR-DEV-2026-09-21",
});

export const EXPECTED_MODULES = Object.freeze([
  { id: "core.runtime", version: "1.0.0", group: "Kern", function: "Laufzeitbasis", subfunctions: ["Konstanten", "Assets", "gemeinsame Helfer"], file: "modules/core/runtime.js" },
  { id: "core.card-lifecycle", version: "1.0.0", group: "Kern", function: "Karten-Lebenszyklus", subfunctions: ["Konfiguration", "Verbinden", "Trennen"], file: "modules/core/card-lifecycle.js" },
  { id: "fullscreen.map-display", version: "1.0.0", group: "Vollbild", function: "Kartendarstellung", subfunctions: ["Standard", "Groß", "Vollbild", "separates Fenster", "Instrumentpositionen"], file: "modules/fullscreen/map-display.js" },
  { id: "ui.scroll-guard", version: "1.0.0", group: "Oberfläche", function: "Scrollschutz", subfunctions: ["Home-Assistant-Seitenleiste", "Touch", "iPad/WebKit"], file: "modules/ui/scroll-guard.js" },
  { id: "ui.skeleton", version: "1.0.0", group: "Oberfläche", function: "Grundgerüst", subfunctions: ["HTML", "CSS", "Dialoge", "Menüstruktur"], file: "modules/ui/skeleton.js" },
  { id: "instruments.compass-scale", version: "1.0.0", group: "Instrumente", function: "Kompass-Skala", subfunctions: ["Skala", "Geometrie"], file: "modules/instruments/compass-scale.js" },
  { id: "ui.controls", version: "1.0.0", group: "Oberfläche", function: "Bedienbindungen", subfunctions: ["Klick", "Touch", "Formulare", "Menüaktionen"], file: "modules/ui/controls.js" },
  { id: "ui.i18n-settings", version: "1.0.0", group: "Oberfläche", function: "Sprache & Einstellungen", subfunctions: ["Übersetzung", "About", "Einstellungen", "Hilfetexte"], file: "modules/ui/i18n-settings.js" },
  { id: "diagnostics.cockpit", version: "1.0.0", group: "Diagnose", function: "Diagnose & Kalibrierung", subfunctions: ["Diagnosekonsole", "Kompass-Kalibrierung", "Medaillon-Kalibrierung", "Leistung"], file: "modules/diagnostics/cockpit.js" },
  { id: "location.radii-map", version: "1.0.0", group: "Standort & Radien", function: "Standort/Radien/Kartenstart", subfunctions: ["Standort", "Radien", "Aura", "Karteninitialisierung"], file: "modules/location/radii-map.js" },
  { id: "map.strikes-warnings", version: "1.0.0", group: "Karte", function: "Blitze & Warnungen", subfunctions: ["Blitzaufnahme", "Warnanimation", "Geräteorientierung"], file: "modules/map/strikes-warnings.js" },
  { id: "map.clusters-recent", version: "1.0.0", group: "Karte", function: "Cluster & letzte Blitze", subfunctions: ["Cluster", "Marker", "Recent-Liste", "Navigation"], file: "modules/map/clusters-recent.js" },
  { id: "ui.render", version: "1.0.0", group: "Oberfläche", function: "Hauptrendering", subfunctions: ["Status", "KPI", "Listen", "UI-Synchronisierung"], file: "modules/ui/render.js" },
  { id: "instruments.compass", version: "1.0.0", group: "Instrumente", function: "Kompass", subfunctions: ["Bewegungsprofil", "Animation", "Rendering"], file: "modules/instruments/compass.js" },
  { id: "history.chart", version: "1.0.0", group: "Verlauf", function: "Trend & Verlauf", subfunctions: ["Trendberechnung", "120-Minuten-Diagramm"], file: "modules/history/chart.js" },
]);

export const MODULE_META = Object.freeze({
  id: "core.manifest",
  version: "1.0.0",
  group: "Kern",
  function: "Modulmanifest",
  subfunctions: ["Sollstand", "Produktversion", "Buildkennung"],
  file: "module-manifest.js",
  build: APPLICATION_META.build,
});

registerModule(MODULE_META);

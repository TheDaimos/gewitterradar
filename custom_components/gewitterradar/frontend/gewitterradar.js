/* Gewitterradar Card V4.10.02 MODULAR DEV – V4.09 FINAL als regressionsgeschützte Basis.
   Der sichtbare Projektname ist Gewitterradar; die stabile Home-Assistant-Helper-Schnittstelle bleibt lightning_detection_*.
   ZULETZT/Recent, Kompass, Cluster sowie die iPad/WebKit-Schutzpfade bleiben regressionsgeschützt.
   V4.09.10 verwendet die freigegebene freigestellte Messing-Kompassgrafik als verbindliche Mini-Darstellung für den Vollbild-Kompassschalter und zentriert beide Instrument-Schalter geometrisch. */
const CARD_VERSION = '4.10.02';
const CARD_DISPLAY_VERSION = '4.10.02';
const GEWITTERRADAR_BUILD = 'V4.10.02-MODULAR-DEV-R1-2026-09-24';
const GEWITTERRADAR_MODULE_CACHE = '41002r1';
const gewitterradarImport = async (path) => {
  try {
    return await import(`${path}?v=${GEWITTERRADAR_MODULE_CACHE}`);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error && error.stack ? `\n${error.stack}` : '';
    throw new Error(`Modul ${path}: ${detail}${stack}`, { cause:error });
  }
};

let APPLICATION_META, EXPECTED_MODULES, moduleDiagnostics, moduleRegistrySnapshot, createBaseContext;
let installCardLifecycle, installMapDisplay, installScrollGuard, installSkeleton;
let installCompassScale, installControls, installI18nSettings, installSourceStatus;
let installCompassSelector, installDiagnostics, installModuleView, installCompassDesign;
let installLocationRadiiMap, installStrikesWarnings, installClustersRecent, installRender;
let installCompass, installHistoryChart;
let GEWITTERRADAR_MODULE_LOAD_ERROR = null;

try {
  const manifest = await gewitterradarImport('./module-manifest.js');
  const registry = await gewitterradarImport('./modules/core/registry.js');
  const baseContext = await gewitterradarImport('./modules/core/base-context.js');
  const cardLifecycle = await gewitterradarImport('./modules/core/card-lifecycle.js');
  const mapDisplay = await gewitterradarImport('./modules/fullscreen/map-display.js');
  const scrollGuard = await gewitterradarImport('./modules/ui/scroll-guard.js');
  const skeleton = await gewitterradarImport('./modules/ui/skeleton.js');
  const compassScale = await gewitterradarImport('./modules/instruments/compass-scale.js');
  const controls = await gewitterradarImport('./modules/ui/controls.js');
  const i18nSettings = await gewitterradarImport('./modules/ui/i18n-settings.js');
  const sourceStatus = await gewitterradarImport('./modules/core/source-status.js');
  const compassSelector = await gewitterradarImport('./modules/instruments/compass-selector.js');
  const diagnostics = await gewitterradarImport('./modules/diagnostics/cockpit.js');
  const moduleView = await gewitterradarImport('./modules/diagnostics/module-view.js');
  const compassDesign = await gewitterradarImport('./modules/instruments/compass-design.js');
  const locationRadiiMap = await gewitterradarImport('./modules/location/radii-map.js');
  const strikesWarnings = await gewitterradarImport('./modules/map/strikes-warnings.js');
  const clustersRecent = await gewitterradarImport('./modules/map/clusters-recent.js');
  const render = await gewitterradarImport('./modules/ui/render.js');
  const compass = await gewitterradarImport('./modules/instruments/compass.js');
  const historyChart = await gewitterradarImport('./modules/history/chart.js');

  ({ APPLICATION_META, EXPECTED_MODULES } = manifest);
  ({ moduleDiagnostics, moduleRegistrySnapshot } = registry);
  ({ createBaseContext } = baseContext);
  ({ installCardLifecycle } = cardLifecycle);
  ({ installMapDisplay } = mapDisplay);
  ({ installScrollGuard } = scrollGuard);
  ({ installSkeleton } = skeleton);
  ({ installCompassScale } = compassScale);
  ({ installControls } = controls);
  ({ installI18nSettings } = i18nSettings);
  ({ installSourceStatus } = sourceStatus);
  ({ installCompassSelector } = compassSelector);
  ({ installDiagnostics } = diagnostics);
  ({ installModuleView } = moduleView);
  ({ installCompassDesign } = compassDesign);
  ({ installLocationRadiiMap } = locationRadiiMap);
  ({ installStrikesWarnings } = strikesWarnings);
  ({ installClustersRecent } = clustersRecent);
  ({ installRender } = render);
  ({ installCompass } = compass);
  ({ installHistoryChart } = historyChart);
} catch (error) {
  GEWITTERRADAR_MODULE_LOAD_ERROR = error instanceof Error ? error : new Error(String(error));
  console.error('[Gewitterradar] Modul-Ladefehler', GEWITTERRADAR_MODULE_LOAD_ERROR);
}

if (GEWITTERRADAR_MODULE_LOAD_ERROR) {
  const tag = 'gewitterradar-card';
  if (!customElements.get(tag)) {
    class GewitterradarModuleLoadError extends HTMLElement {
      setConfig() {}
      set hass(_value) {}
      connectedCallback() {
        const message = GEWITTERRADAR_MODULE_LOAD_ERROR?.message || String(GEWITTERRADAR_MODULE_LOAD_ERROR);
        this.innerHTML = `
          <ha-card style="display:block;padding:16px;border:1px solid rgba(224,180,79,.55);border-radius:16px">
            <div style="font-weight:800;color:#e0b44f;margin-bottom:8px">Gewitterradar · Modul-Ladefehler</div>
            <div style="font-size:13px;line-height:1.45">Mindestens ein V4.10-Modul konnte nicht geladen werden. Prüfe den installierten Modulbaum und lade das Frontend anschließend vollständig neu.</div>
            <code style="display:block;margin-top:10px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:11px;opacity:.78">${message}</code>
          </ha-card>`;
      }
      static getStubConfig() { return {}; }
    }
    customElements.define(tag, GewitterradarModuleLoadError);
    window.customCards = window.customCards || [];
    window.customCards.push({
      type: tag,
      name: 'Gewitterradar',
      description: 'Gewitterradar V4.10.02 · Modul-Ladefehler'
    });
  }
} else {

(function () {
  class GewitterradarCard extends HTMLElement {}
  window.__GEWITTERRADAR_BOOT_DIAGNOSTICS={phase:'base-context',version:CARD_VERSION,build:GEWITTERRADAR_BUILD};
  const __moduleDeps=createBaseContext(import.meta.url);
  if(!__moduleDeps || !Array.isArray(__moduleDeps.LANGUAGE_DEFINITIONS) || !__moduleDeps.LANGUAGE_DEFINITIONS.length){
    throw new Error('Gewitterradar core.base-context did not provide LANGUAGE_DEFINITIONS');
  }
  window.__GEWITTERRADAR_BOOT_DIAGNOSTICS={...window.__GEWITTERRADAR_BOOT_DIAGNOSTICS,phase:'install-modules',languageDefinitions:__moduleDeps.LANGUAGE_DEFINITIONS.length};
  Object.assign(__moduleDeps,{APPLICATION_META,EXPECTED_MODULES,moduleDiagnostics,moduleRegistrySnapshot});
  installCardLifecycle(GewitterradarCard,__moduleDeps);
  installMapDisplay(GewitterradarCard,__moduleDeps);
  installScrollGuard(GewitterradarCard,__moduleDeps);
  installSkeleton(GewitterradarCard,__moduleDeps);
  installCompassScale(GewitterradarCard,__moduleDeps);
  installControls(GewitterradarCard,__moduleDeps);
  installI18nSettings(GewitterradarCard,__moduleDeps);
  installSourceStatus(GewitterradarCard,__moduleDeps);
  installCompassSelector(GewitterradarCard,__moduleDeps);
  installDiagnostics(GewitterradarCard,__moduleDeps);
  installModuleView(GewitterradarCard,__moduleDeps);
  installCompassDesign(GewitterradarCard,__moduleDeps);
  installLocationRadiiMap(GewitterradarCard,__moduleDeps);
  installStrikesWarnings(GewitterradarCard,__moduleDeps);
  installClustersRecent(GewitterradarCard,__moduleDeps);
  installRender(GewitterradarCard,__moduleDeps);
  installCompass(GewitterradarCard,__moduleDeps);
  installHistoryChart(GewitterradarCard,__moduleDeps);

  window.__GEWITTERRADAR_BOOT_DIAGNOSTICS={...window.__GEWITTERRADAR_BOOT_DIAGNOSTICS,phase:'define-custom-element'};
  customElements.define('gewitterradar-card',GewitterradarCard);
  window.__GEWITTERRADAR_BOOT_DIAGNOSTICS={...window.__GEWITTERRADAR_BOOT_DIAGNOSTICS,phase:'registered'};

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:'gewitterradar-card',
    name:'Gewitterradar',
    description:`Gewitterradar V${CARD_VERSION} · Live-Blitz- und Gewitterdarstellung für Home Assistant`
  });
})();
}

/* END Gewitterradar Card V4.07.55 */

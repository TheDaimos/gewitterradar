import { defineModule } from "./runtime.js?v=41002";
export const MODULE_META=Object.freeze({
  "id": "core.card-lifecycle",
  "version": "1.0.1",
  "group": "Kern",
  "function": "Karten-Lebenszyklus",
  "subfunctions": [
    "Konfiguration",
    "Verbinden",
    "Trennen"
  ],
  "file": "modules/core/card-lifecycle.js"
});
export const installCardLifecycle=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    setConfig(config) {
      this._diagnosticTimings=this._diagnosticTimings||{elementConfiguredAt:performance.now()};
      this._config = config || {};
      this._strikes = this._strikes || new Map();
      this._built = !!this.shadowRoot;
      this._mapReady = !!this._map;
      this._initialIngestDone = this._initialIngestDone || false;
      this._lastFlashAt = this._lastFlashAt || 0;
      this._deviceHeading = this._deviceHeading ?? null;
      this._orientationReceived = this._orientationReceived || false;
      this._orientationListening = this._orientationListening || false;
      this._compassVisualAzimuth = Number.isFinite(this._compassVisualAzimuth) ? this._compassVisualAzimuth : null;
      this._compassTargetAzimuth = Number.isFinite(this._compassTargetAzimuth) ? this._compassTargetAzimuth : null;
      this._compassAnimationFrame = this._compassAnimationFrame || null;
      this._compassAngularVelocity = Number.isFinite(this._compassAngularVelocity) ? this._compassAngularVelocity : 0;
      this._compassMotionProfile = this._compassMotionProfile || { intensity:0, stiffness:34, damping:7.2, maxVelocity:220, kick:5 };
      this._compassFrameCallback = this._compassFrameCallback || null;
      this._compassLastFrameAt = Number.isFinite(this._compassLastFrameAt) ? this._compassLastFrameAt : null;

      // V3.550 – Zustand des Header-Ereignis-Browsers.
      // -1 bedeutet: noch kein Treffer aus der aktuellen Liste per Button gewählt.
      this._statusFocusList = Array.isArray(this._statusFocusList) ? this._statusFocusList : [];
      this._statusFocusIndex = Number.isInteger(this._statusFocusIndex) ? this._statusFocusIndex : -1;
      this._statusFocusSignature = this._statusFocusSignature || '';
      this._statusFocusMode = this._statusFocusMode || 'disabled';
      this._statusFocusBaseText = this._statusFocusBaseText || '';
      this._statusFocusKind = this._statusFocusKind || 'individual';

      // V3.555 – Im Cluster-Modus wird nicht nur die numerische Position,
      // sondern die stabile Cluster-ID gemerkt. So bleibt z.B. Cluster 8/30
      // ausgewählt, auch wenn ein neuer Einschlag einen bestehenden Cluster
      // vergrößert oder einen zusätzlichen Cluster erzeugt.
      this._statusFocusSelectedId = this._statusFocusSelectedId || null;

      // V3.99406 – der Cluster-Browser führt während eines begonnenen Durchlaufs
      // eine feste Reihenfolge 1..N. Karten-Zwischenzoom und Live-Neuclustering
      // dürfen diese Browserliste nicht mehr während einer flyTo-Animation ersetzen.
      this._statusClusterBrowseSnapshot = Array.isArray(this._statusClusterBrowseSnapshot)
        ? this._statusClusterBrowseSnapshot
        : [];
      this._statusClusterBrowseActive = !!this._statusClusterBrowseActive;
      this._statusClusterBrowseTimeoutMs = Number.isFinite(this._statusClusterBrowseTimeoutMs) ? this._statusClusterBrowseTimeoutMs : 10000;
      this._statusClusterBrowseFiniteTimeoutMs = Number.isFinite(this._statusClusterBrowseFiniteTimeoutMs) ? this._statusClusterBrowseFiniteTimeoutMs : 10000;
      this._statusClusterBrowseLastInteraction = Number(this._statusClusterBrowseLastInteraction)||0;
      this._statusClusterBrowseTimer = this._statusClusterBrowseTimer || null;
      this._statusClusterBrowseUiTimer = this._statusClusterBrowseUiTimer || null;
      try {
        const savedRaw = localStorage.getItem('gewitterradar:v40804:cluster-jump-timeout');
        const legacyRaw = localStorage.getItem('gewitterradar:v40802:cluster-jump-timeout');
        const savedSource = savedRaw != null ? savedRaw : legacyRaw;
        if (savedSource != null) {
          const savedBrowseTimeout = Number(savedSource);
          if (savedBrowseTimeout === 0 || (Number.isFinite(savedBrowseTimeout) && savedBrowseTimeout >= 5000 && savedBrowseTimeout <= 3600000)) {
            this._statusClusterBrowseTimeoutMs = Math.round(savedBrowseTimeout / 1000) * 1000;
          }
        }
        const savedFiniteRaw = localStorage.getItem('gewitterradar:v40804:cluster-jump-finite-timeout');
        const savedFinite = Number(savedFiniteRaw);
        if (Number.isFinite(savedFinite) && savedFinite >= 5000 && savedFinite <= 3600000) {
          this._statusClusterBrowseFiniteTimeoutMs = Math.round(savedFinite / 1000) * 1000;
        } else if (this._statusClusterBrowseTimeoutMs > 0) {
          this._statusClusterBrowseFiniteTimeoutMs = this._statusClusterBrowseTimeoutMs;
        }
      } catch (_error) {}

      this._renderedMapClusters = Array.isArray(this._renderedMapClusters)
        ? this._renderedMapClusters
        : [];

      // V3.99405 – Cluster-Identität wird sitzungsstabil und nicht mehr aus
      // Zoomstufe/Zellkoordinate abgeleitet. Kurz verschwundene Cluster-Snapshots
      // bleiben einige Sekunden erhalten, damit Zoom-/Live-Übergänge ruhig bleiben.
      this._clusterIdentityState = this._clusterIdentityState || { nextId:1, nextOrder:1, clusters:[] };
      if (!Number.isFinite(this._clusterIdentityState.nextId)) this._clusterIdentityState.nextId = 1;
      if (!Number.isFinite(this._clusterIdentityState.nextOrder)) this._clusterIdentityState.nextOrder = 1;
      if (!Array.isArray(this._clusterIdentityState.clusters)) this._clusterIdentityState.clusters = [];
      this._clusterRenderDebounceTimer = this._clusterRenderDebounceTimer || null;
      this._suppressClusterRender = !!this._suppressClusterRender;

      // V3.984 – ruhige Verlaufsdarstellung. Die Messdaten selbst bleiben exakt;
      // gespeichert werden ausschließlich die zuletzt verwendete visuelle Skala
      // und die Signatur der zuletzt tatsächlich in das SVG geschriebenen Ansicht.
      this._historyScaleMax = Number.isFinite(this._historyScaleMax) ? this._historyScaleMax : null;
      this._historyScalePendingMax = this._historyScalePendingMax ?? null;
      this._historyScalePendingSince = Number.isFinite(this._historyScalePendingSince) ? this._historyScalePendingSince : 0;
      this._historyScaleBucketMinutes = Number.isFinite(this._historyScaleBucketMinutes) ? this._historyScaleBucketMinutes : null;
      this._historyVisualSignature = this._historyVisualSignature || '';

      // V3.987 – die persistente Trefferliste ist bewusst wieder ein klarer
      // 120-Minuten-Browser. Gefiltert wird nur räumlich; LIVE/LETZTE entfällt
      // nach der Geräteabnahme wegen fehlenden Mehrwerts und Platzkonflikten.
      this._recentRadiusFilter = ['danger','storm','observation'].includes(this._recentRadiusFilter)
        ? this._recentRadiusFilter
        : 'observation';

      // V4.09.02 – Kartenansicht und Startdarstellung bleiben rein lokal.
      // Die Startdarstellung wird ausschließlich im Browserprofil dieses Geräts gespeichert.
      if (!['standard','large','fullscreen','last'].includes(this._mapStartupMode)) {
        let storedStartupMode = 'last';
        try {
          const savedStartup = localStorage.getItem(MAP_STARTUP_MODE_STORAGE_KEY);
          if (['standard','large','fullscreen','last'].includes(savedStartup)) storedStartupMode = savedStartup;
        } catch (_error) {}
        this._mapStartupMode = storedStartupMode;
      }
      if (!['standard','large','fullscreen'].includes(this._mapDisplayMode)) {
        let lastMapMode = 'standard';
        try {
          const savedLast = localStorage.getItem(MAP_LAST_DISPLAY_MODE_STORAGE_KEY);
          const legacySaved = localStorage.getItem(MAP_DISPLAY_MODE_STORAGE_KEY);
          if (['standard','large','fullscreen'].includes(savedLast)) lastMapMode = savedLast;
          else if (legacySaved === 'large' || legacySaved === 'standard') lastMapMode = legacySaved;
        } catch (_error) {}
        this._mapDisplayMode = this._mapStartupMode === 'last' ? lastMapMode : this._mapStartupMode;
      }
      this._mapDisplayMenuOpen = !!this._mapDisplayMenuOpen;
      // V4.09.12 – der 3D-Layerstapel ist die einzige produktive Darstellung.
      // Alte Classic-/Infinity-Werte werden aktiv migriert, damit kein Gerät
      // nach einem Update wieder auf eine entfernte Symbolvariante zurückfällt.
      this._mapLayerSymbolStyle = 'stack3d';
      try { localStorage.setItem(MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY,'stack3d'); } catch (_error) {}
      this._mapDisplayBeforeFullscreen = ['standard','large'].includes(this._mapDisplayBeforeFullscreen)
        ? this._mapDisplayBeforeFullscreen
        : (this._mapDisplayMode === 'large' ? 'large' : 'standard');
      if (!this._mapCompassPosition || !Number.isFinite(this._mapCompassPosition.x) || !Number.isFinite(this._mapCompassPosition.y)) {
        this._mapCompassPosition = { x:.96,y:.72 };
        try {
          const savedPosition = JSON.parse(localStorage.getItem(MAP_COMPASS_POSITION_STORAGE_KEY) || 'null');
          if (savedPosition && Number.isFinite(savedPosition.x) && Number.isFinite(savedPosition.y)) {
            this._mapCompassPosition = {
              x:clamp(savedPosition.x,0,1),
              y:clamp(savedPosition.y,0,1)
            };
          }
        } catch (_error) {}
      }
      if (typeof this._mapCompassVisible !== 'boolean') {
        this._mapCompassVisible = true;
        try {
          const saved = localStorage.getItem(MAP_COMPASS_VISIBLE_STORAGE_KEY);
          if (saved === '0' || saved === 'false') this._mapCompassVisible = false;
        } catch (_error) {}
      }
      if (typeof this._mapMedallionVisible !== 'boolean') {
        this._mapMedallionVisible = true;
        try {
          const saved = localStorage.getItem(MAP_MEDALLION_VISIBLE_STORAGE_KEY);
          if (saved === '0' || saved === 'false') this._mapMedallionVisible = false;
        } catch (_error) {}
      }
      if (!this._mapMedallionPosition || !Number.isFinite(this._mapMedallionPosition.x) || !Number.isFinite(this._mapMedallionPosition.y)) {
        this._mapMedallionPosition = { x:.04,y:.72 };
        try {
          const savedPosition = JSON.parse(localStorage.getItem(MAP_MEDALLION_POSITION_STORAGE_KEY) || 'null');
          if (savedPosition && Number.isFinite(savedPosition.x) && Number.isFinite(savedPosition.y)) {
            this._mapMedallionPosition = {x:clamp(savedPosition.x,0,1),y:clamp(savedPosition.y,0,1)};
          }
        } catch (_error) {}
      }
      if (!this._mapLocationPosition || !Number.isFinite(this._mapLocationPosition.x) || !Number.isFinite(this._mapLocationPosition.y)) {
        this._mapLocationPosition = {x:1,y:0};
        try {
          const savedPosition = JSON.parse(localStorage.getItem(MAP_LOCATION_POSITION_STORAGE_KEY) || 'null');
          if (savedPosition && Number.isFinite(savedPosition.x) && Number.isFinite(savedPosition.y)) {
            this._mapLocationPosition = {x:clamp(savedPosition.x,0,1),y:clamp(savedPosition.y,0,1)};
          }
        } catch (_error) {}
      }
      if (typeof this._mapClusterJumpVisible !== 'boolean') {
        this._mapClusterJumpVisible = true;
        try {
          const saved = localStorage.getItem('gewitterradar:v41002:map-cluster-jump-visible');
          if (saved === '0' || saved === 'false') this._mapClusterJumpVisible = false;
        } catch (_error) {}
      }
      if (this._mapClusterJumpPosition === undefined) {
        this._mapClusterJumpPosition = null;
        try {
          const savedPosition = JSON.parse(localStorage.getItem('gewitterradar:v41002:map-cluster-jump-position') || 'null');
          if (savedPosition && Number.isFinite(savedPosition.x) && Number.isFinite(savedPosition.y)) {
            this._mapClusterJumpPosition = {x:clamp(savedPosition.x,0,1),y:clamp(savedPosition.y,0,1)};
          }
        } catch (_error) {}
      }
      this._mapWindowMode = !!this._mapWindowMode;
      if (!this._mapWindowMode && typeof window !== 'undefined') {
        let requested = false;
        try {
          requested = new URL(window.location.href).searchParams.get(MAP_WINDOW_QUERY_KEY) === '1';
        } catch (_error) {}
        if (requested && (!window.__gewitterradarMapWindowOwner || window.__gewitterradarMapWindowOwner === this)) {
          window.__gewitterradarMapWindowOwner = this;
          this._mapWindowMode = true;
          this._mapDisplayMode = 'fullscreen';
        }
      }
      this._mapCompassDragState = null;
      this._mapCompassHomeParent = this._mapCompassHomeParent || null;
      this._mapMedallionDragState = null;
      this._mapLocationDragState = null;
      this._mapLocationDropdownRaf = null;
      this._mapLocationSuppressClickUntil = 0;

      // V3.990 – optional ausgewählter Treffer mit echter Cluster⇄Detail-
      // Umschaltung. Die Clusteransicht ist die ruhige erste Fokusstufe; erst der
      // zusätzliche Zielbutton fordert den tiefen Einzelblitz-Zoom explizit an.
      this._recentSelectedStrike = this._recentSelectedStrike || null;
      this._recentStrikeTargetMode = this._recentStrikeTargetMode === 'detail' ? 'detail' : 'cluster';
      this._recentStrikeClusterView = this._recentStrikeClusterView || null;


      // V3.9934 – Radius-Aura bleibt vollständig SVG-basiert. Die sichtbare
      // Bedienung besteht nur noch aus Ein/Aus sowie Breite und Intensität.
      // Die historische Sehr-stark-Ringdefinition bleibt weiter unten ausschließlich
      // als interne Referenz erhalten und wird nicht mehr aktiv gerendert.
      this._radiusAuraLayers = this._radiusAuraLayers || { observation:[],storm:[],danger:[] };
      this._radiusAuraSvgLayer = this._radiusAuraSvgLayer || null;

      // Lokale Vorschauwerte machen die Regler unmittelbar sichtbar, ohne während
      // des Ziehens fortlaufend Home-Assistant-Serviceaufrufe auszulösen.
      this._settingsAuraEnabledPreview = typeof this._settingsAuraEnabledPreview === 'boolean'
        ? this._settingsAuraEnabledPreview : null;
      this._settingsAuraWidthPreview = Number.isFinite(this._settingsAuraWidthPreview)
        ? this._settingsAuraWidthPreview : null;
      this._settingsAuraIntensityPreview = Number.isFinite(this._settingsAuraIntensityPreview)
        ? this._settingsAuraIntensityPreview : null;
      this._settingsLocationPreview = this._settingsLocationPreview || null;
      this._settingsAuraEnabledPreviewTimer = this._settingsAuraEnabledPreviewTimer || null;
      this._settingsAuraWidthPreviewTimer = this._settingsAuraWidthPreviewTimer || null;
      this._settingsAuraIntensityPreviewTimer = this._settingsAuraIntensityPreviewTimer || null;
      this._settingsLocationPreviewTimer = this._settingsLocationPreviewTimer || null;
      this._compassCalibrationEnabled = this._compassCalibrationEnabled ?? false;
      this._compassCalibrationResizeObserver = this._compassCalibrationResizeObserver || null;
      this._compassCalibrationFrame = this._compassCalibrationFrame || null;
      this._compassCalibrationFrameLoadHandler = this._compassCalibrationFrameLoadHandler || null;
      this._compassCalibrationFrameErrorHandler = this._compassCalibrationFrameErrorHandler || null;
      this._compassCalibrationOpening = this._compassCalibrationOpening || null;
      this._compassCalibrationMeasureToken = Number(this._compassCalibrationMeasureToken) || 0;
      this._compassCalibrationGeometryKey = this._compassCalibrationGeometryKey || '';
      this._compassCalibrationOverlayRenderer = this._compassCalibrationOverlayRenderer || null;
      this._localCompassDesign = this._localCompassDesign || null;
      this._compassStorageDiagnostics=this._compassStorageDiagnostics||{setConfigCalls:0,reads:0,writes:0,writeSuccesses:0,storageAvailable:null,lastReadValue:null,lastRestoredDesign:null,lastReadAt:null,lastWriteAt:null};
      this._compassStorageDiagnostics.setConfigCalls+=1;
      const restoredCompassDesign=this._restorePersistedCompassDesign();
      if(restoredCompassDesign!==undefined)this._persistedCompassDesign=restoredCompassDesign;
      this._compassSelectorFrameIndex = Number.isInteger(this._compassSelectorFrameIndex) ? this._compassSelectorFrameIndex : 1;
      this._compassSelectorDiagnostics = this._compassSelectorDiagnostics || {updates:0,resizeCallbacks:0,recent:[]};
      this._compassCalibrationFeedbackTimer = this._compassCalibrationFeedbackTimer || null;
      this._compassCalibrationQuickViewportHandler = this._compassCalibrationQuickViewportHandler || null;
      this._compassCalibrationQuickOutsideHandler = this._compassCalibrationQuickOutsideHandler || null;
      this._compassCalibrationQuickKeyHandler = this._compassCalibrationQuickKeyHandler || null;
      this._compassCalibrationQuickRaf = this._compassCalibrationQuickRaf || null;
      this._compassCalibrationReportText = this._compassCalibrationReportText || '';
      this._compassCalibrationDetailText = this._compassCalibrationDetailText || '';
      this._medallionCalibrationEnabled = this._medallionCalibrationEnabled ?? false;
      this._medallionCalibrationResizeObserver = this._medallionCalibrationResizeObserver || null;
      this._medallionCalibrationReportText = this._medallionCalibrationReportText || '';
      this._medallionCalibrationDetailText = this._medallionCalibrationDetailText || '';
      this._medallionCalibrationLastFocus = this._medallionCalibrationLastFocus || null;
      this._medallionCalibrationKeyHandler = this._medallionCalibrationKeyHandler || null;
      this._medallionDiagnostic = this._medallionDiagnostic || {mode:'normal',arrowVisible:null,animationEnabled:null,frozen:false,angle:45,driver:'production-css-transition'};
      this._medallionDiagnosticWindow = this._medallionDiagnosticWindow || {level:'full',dock:'right',left:null,top:null,drag:null};
      this._diagnostics = this._diagnostics || {
        enabled:false,visualsVisible:true,live:true,grid:'coarse',overlays:{ids:true,boxes:true,centers:true,axes:false,diagonals:false,baselines:false,padding:false,margin:false,spacing:false,safe:false,overflow:false,parent:false,alignment:false},
        selected:null,compare:null,renderCount:0,resizeCallbacks:0,mutationEvents:0,layoutShifts:[],longTasks:[],fps:null,snapshot:null,raf:null,
        startedAt:0,performanceObservers:[],position:null,columnMode:2,selecting:false,responsiveHistory:[],fpsRaf:null,fpsOverlayTimer:null,fpsSnapshot:null,fpsKeyHandler:null,assetDimensions:{},assetLoadPromise:null,compassMeasurements:{},mutationRegions:{map:0,diagnostics:0,app:0},
        virtualStorm:{scenario:'off',ownedIds:[],startedAt:0,count:0,cells:0,cellCount:1,extreme:false,extremeCells:0},
        weatherLab:{
          version:'4.08.22',seed:40802,
          lightning:{densityMultiplier:1,ageProfile:'mixed',pattern:'standard',boundaryCases:false,lastStressRenders:0,stressSerial:0,lastStressAction:'none'},
          precipitation:{prepared:true,enabled:false,model:'organic-scalar-field'},
          clouds:{prepared:true,enabled:false,model:'layered-density-field'}
        }
      };
      this._diagnostics.overlays={ids:true,boxes:true,centers:true,axes:false,diagonals:false,baselines:false,padding:false,margin:false,spacing:false,safe:false,overflow:false,parent:false,alignment:false,...(this._diagnostics.overlays||{})};
      this._diagnostics.responsiveHistory=Array.isArray(this._diagnostics.responsiveHistory)?this._diagnostics.responsiveHistory:[];
      this._diagnostics.assetDimensions=this._diagnostics.assetDimensions||{};
      this._diagnostics.compassMeasurements=this._diagnostics.compassMeasurements||{};
      this._compassLiveFits=this._compassLiveFits||{};
      this._diagnostics.columnMode=this._diagnostics.columnMode===1?1:2;
      this._diagnostics.mutationRegions={map:0,diagnostics:0,app:0,...(this._diagnostics.mutationRegions||{})};
      this._diagnostics.performanceObservers=Array.isArray(this._diagnostics.performanceObservers)?this._diagnostics.performanceObservers:[];
      this._diagnostics.virtualStorm=this._diagnostics.virtualStorm||{scenario:'off',ownedIds:[],startedAt:0,count:0,cells:0,cellCount:1,extreme:false,extremeCells:0};
      this._diagnostics.virtualStorm.ownedIds=Array.isArray(this._diagnostics.virtualStorm.ownedIds)?this._diagnostics.virtualStorm.ownedIds:[];this._diagnostics.virtualStorm.cellCount=Math.max(1,Math.min(5,Math.round(Number(this._diagnostics.virtualStorm.cellCount)||1)));this._diagnostics.virtualStorm.extreme=!!this._diagnostics.virtualStorm.extreme;
      this._compassCalibrationRings = this._compassCalibrationRings || {
        circle:false,ellipse:false,maximum:false,safety:false,cover:true,target:true,visual:true,protected:true,backing:true,bounding:false,gapring:true,outer:false,angles:false,centers:true,rays:true,
      };

      // V3.528 – Sichtbarkeit der Gewitter-Testwerkzeuge ist nicht mehr lokal,
      // sondern wird über input_boolean.lightning_detection_storm_simulation gespeichert.

      // V3.522 TEST – Radiusregler bleiben standardmäßig aus der Hauptansicht
      // entfernt, können aber im Popup jederzeit wieder eingeblendet werden.
      this._showMainRadii = this._showMainRadii ?? false;

      // V4.08.25 TEST – Cluster-Auflösung behält die Profillogik und den Dropdown-Stil der Sprachauswahl, das Auswahlmenü ist jetzt schmaler und weiter nach rechts eingerückt,
      // sondern ein lokal persistiertes Profil. Bestehende V4.08.01-Werte werden
      // verlustfrei migriert: zoned -> balanced, legacy -> classic.
      if (this._clusterResolutionProfileV40822 == null) {
        const allowedProfiles = new Set(['early','balanced','late','classic']);
        try {
          let storedProfile = localStorage.getItem('gewitterradar:v40822:cluster-resolution-profile');
          if (!allowedProfiles.has(storedProfile)) {
            const legacyPolicy = localStorage.getItem('gewitterradar:v40801:cluster-policy');
            storedProfile = legacyPolicy === 'zoned' ? 'balanced' : 'classic';
          }
          this._clusterResolutionProfileV40822 = allowedProfiles.has(storedProfile) ? storedProfile : 'classic';
        } catch (_error) {
          this._clusterResolutionProfileV40822 = 'classic';
        }
      }

      // V3.70 – Scrollposition wird bereits VOR einem HA-Update
      // kontinuierlich gemerkt. Der frühere V3.60-Fix sicherte erst im hass-Setter;
      // auf iPad/WebKit kann Home Assistant zu diesem Zeitpunkt bereits nach oben
      // gesprungen sein. Der letzte stabile Nutzerzustand bleibt deshalb separat erhalten.
      this._stableScrollSnapshot = Array.isArray(this._stableScrollSnapshot)
        ? this._stableScrollSnapshot
        : [];
      this._scrollWatchInterval = this._scrollWatchInterval || null;
      this._scrollRememberTimers = Array.isArray(this._scrollRememberTimers)
        ? this._scrollRememberTimers
        : [];
      this._scrollRestoreTimers = Array.isArray(this._scrollRestoreTimers)
        ? this._scrollRestoreTimers
        : [];
      this._scrollRestoreGeneration = Number.isInteger(this._scrollRestoreGeneration)
        ? this._scrollRestoreGeneration
        : 0;
      this._scrollUserIntentGeneration = Number.isInteger(this._scrollUserIntentGeneration)
        ? this._scrollUserIntentGeneration
        : 0;
      this._scrollUserIntentHandler = this._scrollUserIntentHandler || null;

      // V3.70 – Home Assistant kann auf iPadOS in einem internen
      // Shadow-DOM-Scrollcontainer scrollen, der über einen <slot> mit der
      // Lovelace-Ansicht verbunden ist. Dieser Container war in HOTFIX 2 nicht
      // zuverlässig erreichbar. Deshalb merken wir zusätzlich den Scroll-Target,
      // den der Nutzer beim tatsächlichen Scrollen verwendet hat.
      this._scrollCaptureHandler = this._scrollCaptureHandler || null;
      this._scrollUserGestureUntil = Number.isFinite(this._scrollUserGestureUntil)
        ? this._scrollUserGestureUntil
        : 0;
      this._lastUserScrollTarget = this._lastUserScrollTarget || null;

      // V3.71 – Spezieller visueller Scrollanker für das normale iPad mit
      // ausgeklappter HA-Seitenleiste. In genau diesem schmalen Zweispaltenzustand
      // springt Home Assistant/WebKit bei einem neuen Blitz reproduzierbar bis zur
      // KPI-Oberkante. Statt den internen HA-Scroller zu erraten, merken wir einen
      // sichtbaren Punkt INNERHALB unserer Karte und lassen den Browser diesen Punkt
      // nach dem Rendern wieder an exakt dieselbe Viewport-Position bringen.
      this._sidebarVisualScrollAnchor = this._sidebarVisualScrollAnchor || null;
      this._sidebarAnchorRestoreTimers = Array.isArray(this._sidebarAnchorRestoreTimers)
        ? this._sidebarAnchorRestoreTimers
        : [];
      this._sidebarAnchorRestoreGeneration = Number.isInteger(this._sidebarAnchorRestoreGeneration)
        ? this._sidebarAnchorRestoreGeneration
        : 0;


      // V3.72 – auf dem normalen iPad mit geöffneter HA-Seitenleiste ist der
      // tatsächlich maßgebliche Scrollzustand window.scrollY. Wichtig: dieser
      // Wert darf NUR aus echtem Benutzer-Scrollen gelernt werden, denn der
      // fehlerhafte HA-Sprung endet nicht bei 0, sondern an der KPI-Oberkante.
      this._lastStableWindowScrollY = Number.isFinite(this._lastStableWindowScrollY)
        ? this._lastStableWindowScrollY
        : null;
      this._windowScrollRestoreGeneration = Number.isInteger(this._windowScrollRestoreGeneration)
        ? this._windowScrollRestoreGeneration
        : 0;
      this._windowScrollRestoreTimers = Array.isArray(this._windowScrollRestoreTimers)
        ? this._windowScrollRestoreTimers
        : [];

      // V3.73 – letzter gezielter iPad/Sidebar-Ansatz:
      // Beim ausgeklappten HA-Seitenmenü kann der tatsächlich scrollende Container
      // tief in einem offenen Home-Assistant-Shadow-DOM liegen und weder window
      // noch ein composed Vorfahr unserer Karte sein. Deshalb speichern wir nach
      // echtem Benutzer-Scrollen zusätzlich ALLE aktuell wirklich gescrollten
      // Container aus den offenen Shadow-DOM-Bäumen und stellen exakt diese
      // Elementreferenzen bei einem neuen Blitz wieder her.
      this._deepUserScrollSnapshot = Array.isArray(this._deepUserScrollSnapshot)
        ? this._deepUserScrollSnapshot
        : [];
      this._deepScrollRestoreGeneration = Number.isInteger(this._deepScrollRestoreGeneration)
        ? this._deepScrollRestoreGeneration
        : 0;
      this._deepScrollRestoreTimers = Array.isArray(this._deepScrollRestoreTimers)
        ? this._deepScrollRestoreTimers
        : [];


      // V3.76 – gezielter Schutz für normales iPad + ausgeklappte HA-Seitenleiste.
      // Die Diagnose aus V3.75 hat gezeigt: der echte Scroller ist window/document
      // und der große Sprung findet bereits VOR set hass() statt. Deshalb muss der
      // Schutz direkt am window-scroll-Ereignis greifen und darf nicht vom Renderpfad
      // oder einem neu erkannten Blitz abhängen.
      this._sidebarGuardTouchActive = !!this._sidebarGuardTouchActive;
      this._sidebarGuardStartY = Number.isFinite(this._sidebarGuardStartY) ? this._sidebarGuardStartY : null;
      this._sidebarGuardLastY = Number.isFinite(this._sidebarGuardLastY) ? this._sidebarGuardLastY : null;
      this._sidebarGuardDirection = Number.isFinite(this._sidebarGuardDirection) ? this._sidebarGuardDirection : 0;
      this._sidebarProtectedY = Number.isFinite(this._sidebarProtectedY) ? this._sidebarProtectedY : null;
      this._sidebarAllowUpwardUntil = Number.isFinite(this._sidebarAllowUpwardUntil) ? this._sidebarAllowUpwardUntil : 0;
      this._sidebarGuardRestoring = !!this._sidebarGuardRestoring;
      this._sidebarGuardScrollHandler = this._sidebarGuardScrollHandler || null;
      this._sidebarGuardTouchStartHandler = this._sidebarGuardTouchStartHandler || null;
      this._sidebarGuardTouchEndHandler = this._sidebarGuardTouchEndHandler || null;
      this._sidebarGuardWheelHandler = this._sidebarGuardWheelHandler || null;
      this._sidebarGuardWheelUntil = Number.isFinite(this._sidebarGuardWheelUntil) ? this._sidebarGuardWheelUntil : 0;


      // V3.75 DIAG – Diagnoseanzeige bewusst auf ALLEN Geräten/Layouts sichtbar.
      // V3.75 war zu eng an die Sidebar-Erkennung gekoppelt und konnte deshalb
      // unsichtbar bleiben, obwohl die richtige Datei geladen war.

      // V3.86 PRE-FINAL – der iPad-Auto-Scroll wurde auf den vollständigen
      // innerHTML-Austausch von #recent-content eingegrenzt. Der produktive
      // Renderpfad läuft wieder vollständig; die Recent-Liste wird dauerhaft
      // inkrementell über stabile DOM-Knoten aktualisiert.
      this._diagnosticRenderTopInitialized = true;
      this._diagnosticRenderTopOnly = false;
      this._diagnosticAllowFullRender = true;
    },

    getCardSize() {
      return 12;
    },

    connectedCallback() {
      this._maybeOpenAbout();
      // V3.86 – normaler Produktivbetrieb wieder aktiv.
      // Die alten Scroll-Gegenmechanismen werden bewusst NICHT aktiviert;
      // die Ursache wird direkt im Recent-DOM behoben.
      this._tickInterval = setInterval(() => this._render(), 15000);
      this._setupOrientationCapabilityProbe();
    },

    disconnectedCallback() {
      this._closeLanguageOnboarding(false);
      this._closeHelp(false);
      this._closeAbout(false, false);
      this._closeCompassPicker(false);
      if (this._tickInterval) clearInterval(this._tickInterval);
      if (this._clusterRenderDebounceTimer) {
        clearTimeout(this._clusterRenderDebounceTimer);
        this._clusterRenderDebounceTimer = null;
      }
      this._teardownSidebarScrollGuard();
      if (this._resizeObserver) this._resizeObserver.disconnect();
      this._teardownCompassCalibrationMeasurement();
      this._closeCompassCalibrationQuick(false);
      this._teardownMedallionCalibration();
      this._stopDiagnostics();
      if (this._compassAnimationFrame) cancelAnimationFrame(this._compassAnimationFrame);
      this._compassAnimationFrame = null;
      this._teardownMapDisplayMode();
      this._removeOrientationListeners();
    },

};});

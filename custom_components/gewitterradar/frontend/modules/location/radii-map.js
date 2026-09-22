import { defineModule } from "../core/runtime.js?v=41002";
export const MODULE_META=Object.freeze({
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
});
export const installLocationRadiiMap=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _locationOption(hass = this._hass) {
      const helper = hass?.states?.[this._locationSelectEntity()];
      const raw = String(this._settingsLocationPreview || helper?.state || 'zone.home').trim();

      // Clean-install contract: the input_select stores direct Home Assistant entity IDs.
      return raw || 'zone.home';
    },

    _locationLabel(entityId,hass = this._hass) {
      // V3.534 – optionale Übersetzungstabelle direkt in der Karten-YAML:
      //
      // location_labels:
      //   zone.home: Zuhause
      //   person.alkje: Alkje
      //   person.chris: Chris
      //
      // Neue Standorte benötigen damit keine Änderung der JS-Datei.
      const configured = this._config.location_labels || {};
      if (
        configured &&
        Object.prototype.hasOwnProperty.call(configured,entityId) &&
        String(configured[entityId] ?? '').trim()
      ) {
        return String(configured[entityId]).trim();
      }

      // Sinnvoller Standard für die Home-Zone.
      if (entityId === 'zone.home') return this._t('location.home');

      const referenceName = hass?.states?.[entityId]?.attributes?.reference_name;
      if (referenceName) return String(referenceName);

      const friendly = hass?.states?.[entityId]?.attributes?.friendly_name;
      if (friendly) return String(friendly);

      // Sauberer Fallback für beliebige später hinzugefügte person.* / zone.*.
      const objectId = String(entityId || '').split('.').pop() || String(entityId || '');
      return objectId
        .replace(/_/g,' ')
        .replace(/\b\w/g,(m) => m.toUpperCase()) || this._t('location.generic');
    },

    _locationOptions(hass = this._hass) {
      const helper = hass?.states?.[this._locationSelectEntity()];
      const configured = Array.isArray(helper?.attributes?.options)
        ? helper.attributes.options.map((v) => String(v).trim()).filter(Boolean)
        : [];

      // V3.99402 – Clean-Install: geeignete HA-Standorte werden dynamisch ergänzt.
      // Keine Person wird im Package fest verdrahtet. Aufgenommen werden nur
      // person.* / zone.* mit numerischer Latitude + Longitude. zone.home bleibt
      // immer verfügbar, auch wenn der Helper gerade noch nicht geladen ist.
      const discovered = Object.entries(hass?.states || {})
        .filter(([entityId,state]) => {
          if (!(entityId.startsWith('person.') || entityId.startsWith('zone.'))) return false;
          return finiteNumber(state?.attributes?.latitude) != null && finiteNumber(state?.attributes?.longitude) != null;
        })
        .map(([entityId]) => entityId)
        .sort((a,b) => this._locationLabel(a,hass).localeCompare(this._locationLabel(b,hass),undefined,{sensitivity:'base'}));

      const merged = ['zone.home',...configured,...discovered];
      return [...new Set(merged.filter(Boolean))];
    },

    _syncLocationSelectOptions(select,current,hass = this._hass) {
      if (!select) return;
      // V3.993 – ein geöffneter nativer Select-Picker wird auf iPadOS durch
      // Options-/Value-Schreibzugriffe sichtbar geschlossen/geöffnet ("Flappen").
      // Während der Interaktion bleibt der DOM-Zustand deshalb unangetastet.
      const interacting = select.dataset.interacting === '1' || this.shadow?.activeElement === select;
      if (interacting) return;
      const options = this._locationOptions(hass);

      const signature = options.join('|');
      if (select.dataset.locationOptions !== signature) {
        select.innerHTML = options.map((entityId) =>
          `<option value="${entityId.replace(/"/g,'&quot;')}">${this._locationLabel(entityId,hass)}</option>`
        ).join('');
        select.dataset.locationOptions = signature;
      }

      if (options.includes(current)) {
        if (select.value !== current) select.value = current;
      } else if (options.length && select.value !== options[0]) {
        select.value = options[0];
      }
    },

    _home() {
      const entityId = this._locationOption();
      const state = this._hass?.states?.[entityId];
      const lat = finiteNumber(state?.attributes?.latitude);
      const lon = finiteNumber(state?.attributes?.longitude);
      const label = this._locationLabel(entityId);

      if (lat != null && lon != null) {
        return {
          lat,lon,
          option:entityId,
          label,
          entityId,
          available:true
        };
      }

      // zone.home darf zusätzlich auf die HA-Grundkonfiguration zurückfallen.
      if (entityId === 'zone.home') {
        const hassLat = finiteNumber(this._hass?.config?.latitude);
        const hassLon = finiteNumber(this._hass?.config?.longitude);
        return {
          lat:finiteNumber(this._config.latitude) ?? hassLat ?? 0,
          lon:finiteNumber(this._config.longitude) ?? hassLon ?? 0,
          option:entityId,
          label:this._t('location.home'),
          entityId,
          available:false
        };
      }

      // Fehlt bei einer Person / einem Gerät temporär die Position, verwenden
      // wir technisch Zuhause, kennzeichnen den gewählten Standort aber als
      // nicht verfügbar. So bleibt die Karte funktionsfähig.
      const homeState = this._hass?.states?.['zone.home'];
      return {
        lat:finiteNumber(homeState?.attributes?.latitude) ??
            finiteNumber(this._hass?.config?.latitude) ?? 0,
        lon:finiteNumber(homeState?.attributes?.longitude) ??
            finiteNumber(this._hass?.config?.longitude) ?? 0,
        option:entityId,
        label,
        entityId,
        available:false
      };
    },

    _rebaseStrike(strike,reference = this._home()) {
      if (!strike || strike.lat == null || strike.lon == null) return strike;
      strike.distance = distanceBetweenKm(reference.lat,reference.lon,strike.lat,strike.lon);
      strike.azimuth = bearingBetween(reference.lat,reference.lon,strike.lat,strike.lon);
      return strike;
    },

    _setRadiusCircleVisual(circle, radiusKm, reference = this._home()) {
      if (!circle || !this._map || !reference) return;
      const latLng = [reference.lat,reference.lon];
      circle.setLatLng(latLng);
      circle.setRadius(projectedRadiusPixels(this._map,reference,Number(radiusKm) || 0));
    },

    _radiusAuraSpecs(level,baseRadius = 1) {
      // V3.9934 – Historische Diskret-Ringdefinition ausschließlich als interne
      // Referenz des früheren "Sehr stark"-Standes. Sie wird nicht mehr aktiv
      // durch die sichtbare Aura-Bedienung angesprochen.
      const r = Math.max(1,Number(baseRadius) || 1);
      if (level === 'Very Strong') {
        // 1:1 konservierter V3.993_fixed2-Stand von "Strong".
        const depth = clamp(r*.28,28,120);
        return [
          { inset:1,          weight:Math.max(10,depth*.18),opacity:.115, blur:2.8 },
          { inset:depth*.10,  weight:Math.max(14,depth*.24),opacity:.087, blur:3.0 },
          { inset:depth*.25,  weight:Math.max(19,depth*.30),opacity:.063, blur:3.2 },
          { inset:depth*.43,  weight:Math.max(24,depth*.36),opacity:.043, blur:3.5 },
          { inset:depth*.64,  weight:Math.max(29,depth*.42),opacity:.026, blur:3.8 },
          { inset:depth*.86,  weight:Math.max(34,depth*.48),opacity:.012, blur:4.1 }
        ];
      }
      return [];
    },

    _clearRadiusAuraKind(kind) {
      const list = this._radiusAuraLayers?.[kind] || [];
      list.forEach(layer => {
        try { layer?.remove?.(); } catch (_) {}
      });
      if (this._radiusAuraLayers) this._radiusAuraLayers[kind] = [];
    },

    _clearAllRadiusAuraRings() {
      ['observation','storm','danger'].forEach(kind => this._clearRadiusAuraKind(kind));
    },

    _syncRadiusAuraSvg(reference = this._home(), force = false) {
      if (!this._map || !reference) return;
      const L = window.L;
      if ((!this._radiusAuraSvgLayer || !this._radiusAuraSvgLayer?.setData) && L?.radiusAuraSvgLayer) {
        try { this._radiusAuraSvgLayer = L.radiusAuraSvgLayer().addTo(this._map); } catch (_) {}
      }
      const layer = this._radiusAuraSvgLayer;
      if (!layer?.setData) return;
      const enabled = this._auraEnabled();
      const width = this._auraWidthValue();
      const intensity = this._auraIntensityValue();
      if (!enabled || intensity <= 0) {
        layer.setData({ enabled:false,width,intensity,reference,items:[] });
        return;
      }
      const observation = this._observationRadiusValue();
      const storm = Math.min(this._stormRadiusValue(),observation);
      const danger = Math.min(this._dangerRadiusValue(),storm,observation);
      layer.setData({
        enabled:true,
        width,
        intensity,
        reference:{ lat:reference.lat,lon:reference.lon },
        items:[
          { kind:'observation',radiusKm:observation,color:C.gold },
          { kind:'storm',radiusKm:storm,color:C.blue },
          { kind:'danger',radiusKm:danger,color:C.danger }
        ]
      });
      if (force) layer._scheduleRedraw?.();
    },

    _syncRadiusAuraKind(kind,radiusKm,reference,color) {
      if (!this._map || !window.L || !reference) return;
      // V3.9934 – aktive Radius-Aura ausschließlich als kontinuierliches SVG.
      // Alte Ring-Layer werden sicherheitshalber entfernt und bleiben nur als
      // Quellcode-Referenz erhalten.
      this._clearAllRadiusAuraRings();
      this._syncRadiusAuraSvg(reference);
    },

    _setObservationRadiusVisual(radiusKm, reference = this._home()) {
      this._setRadiusCircleVisual(this._radiusCircle,radiusKm,reference);
      this._syncRadiusAuraKind('observation',radiusKm,reference,C.gold);
    },

    _setStormRadiusVisual(radiusKm, reference = this._home()) {
      this._setRadiusCircleVisual(this._stormCircle,radiusKm,reference);
      this._syncRadiusAuraKind('storm',radiusKm,reference,C.blue);
    },

    _setDangerRadiusVisual(radiusKm, reference = this._home()) {
      this._setRadiusCircleVisual(this._dangerCircle,radiusKm,reference);
      this._syncRadiusAuraKind('danger',radiusKm,reference,C.danger);
    },

    _syncReferenceMap(reference = this._home()) {
      if (!this._map || !reference) return;
      const latLng = [reference.lat,reference.lon];

      this._homeMarker?.setLatLng(latLng);
      this._radiusCircle?.setLatLng(latLng);
      this._stormCircle?.setLatLng(latLng);
      this._dangerCircle?.setLatLng(latLng);

      if (this._homeMarker?.setTooltipContent) {
        this._homeMarker.setTooltipContent(
          reference.available
            ? this._t('location.reference_label',{location:reference.label})
            : this._t('location.label_unavailable',{location:reference.label})
        );
      }

      const signature = `${reference.option}:${reference.lat.toFixed(5)}:${reference.lon.toFixed(5)}`;
      const optionChanged = this._mapReferenceOption !== reference.option;

      if (optionChanged) {
        // Ein echter Wechsel des Bezugsstandorts darf weiterhin sofort dorthin
        // springen. Danach bleibt die Karte vollständig in Benutzerhand:
        // Zoomen/Verschieben wird auch dann NICHT mehr rückgängig gemacht, wenn
        // der Bezugsstandort außerhalb des sichtbaren Kartenausschnitts liegt.
        this._map.setView(latLng,this._map.getZoom(),{ animate:false });
      }

      this._mapReferenceOption = reference.option;
      this._mapReferenceSignature = signature;
    },

    _dangerRadiusValue(hass = this._hass) {
      return finiteNumber(hass?.states?.[this._dangerEntity()]?.state) ?? 20;
    },

    _stormRadiusMinimum(hass = this._hass, dangerOverride = null) {
      const helperMin = finiteNumber(hass?.states?.[this._stormEntity()]?.attributes?.min) ?? 1;
      const dangerState = finiteNumber(dangerOverride) ?? finiteNumber(hass?.states?.[this._dangerEntity()]?.state);
      return Math.max(5,helperMin,dangerState ?? 0);
    },

    _stormRadiusValue(hass = this._hass) {
      const value = finiteNumber(hass?.states?.[this._stormEntity()]?.state) ?? 100;
      return Math.max(this._stormRadiusMinimum(hass),value);
    },

    _observationRadiusValue(hass = this._hass) {
      return finiteNumber(hass?.states?.[this._observationEntity()]?.state) ?? 200;
    },

    _setInputNumber(entityId, value) {
      if (!this._hass || value == null) return;
      return this._numberSetting(entityId,value);
    },

    _radiusUiValue(kind, fallback = null) {
      const control = this.shadow?.getElementById?.(`settings-${kind}-input`);
      return finiteNumber(control?.dataset?.value ?? control?.value) ?? fallback;
    },

    _setRadiusDirect(kind, requestedValue) {
      if (!this._hass) return null;

      const obsState = this._hass.states[this._observationEntity()];
      const stormState = this._hass.states[this._stormEntity()];
      const dangerState = this._hass.states[this._dangerEntity()];

      const obsStateValue = finiteNumber(obsState?.state);
      const stormStateValue = finiteNumber(stormState?.state);
      const dangerStateValue = finiteNumber(dangerState?.state);

      // Bei sehr schneller Bedienung kann der HA-State dem gerade gesetzten
      // Popup-Wert noch einen Tick hinterherlaufen. Deshalb haben die sichtbaren
      // Radiuswerte Vorrang, sofern sie gültig sind.
      const obs = this._radiusUiValue('observation',obsStateValue);
      const storm = this._radiusUiValue('storm',stormStateValue);
      const danger = this._radiusUiValue('danger',dangerStateValue);

      let requested = finiteNumber(requestedValue);
      if (requested == null) return null;
      requested = Math.round(requested);

      if (kind === 'observation') {
        const min = finiteNumber(obsState?.attributes?.min) ?? 10;
        const max = finiteNumber(obsState?.attributes?.max) ?? 1000;
        const next = clamp(requested,min,max);

        const currentStorm = stormStateValue ?? storm;
        const currentDanger = dangerStateValue ?? danger;
        let nextStorm = currentStorm;
        if (currentStorm != null && currentStorm > next) {
          nextStorm = next;
        }

        const dangerMax = nextStorm != null ? Math.min(nextStorm,next) : next;
        if (currentDanger != null && currentDanger > dangerMax) {
          this._setInputNumber(this._dangerEntity(),dangerMax);
        }
        if (currentStorm != null && currentStorm > next) {
          this._setInputNumber(this._stormEntity(),next);
        }
        this._setInputNumber(this._observationEntity(),next);
        return next;
      }

      if (kind === 'storm') {
        const min = Math.max(5,finiteNumber(stormState?.attributes?.min) ?? 1);
        const helperMax = finiteNumber(stormState?.attributes?.max) ?? 1000;
        const max = obs != null ? Math.min(helperMax,obs) : helperMax;
        const next = clamp(requested,min,max);
        if (danger != null && danger > next) {
          this._setInputNumber(this._dangerEntity(),next);
        }
        this._setInputNumber(this._stormEntity(),next);
        return next;
      }

      const min = finiteNumber(dangerState?.attributes?.min) ?? 1;
      const helperMax = finiteNumber(dangerState?.attributes?.max) ?? 250;
      const maxByStorm = storm != null ? storm : obs;
      const max = maxByStorm != null ? Math.min(helperMax,maxByStorm) : helperMax;
      const next = clamp(requested,min,max);
      this._setInputNumber(this._dangerEntity(),next);
      return next;
    },

    _snapRadiusStep(value, direction, step) {
      const current = finiteNumber(value);
      const size = Math.abs(finiteNumber(step) ?? 1);
      if (current == null || !size) return current;

      const quotient = current / size;
      const onGrid = Math.abs(quotient - Math.round(quotient)) < 1e-9;

      if (direction > 0) {
        return onGrid ? current + size : Math.ceil(current / size) * size;
      }
      return onGrid ? current - size : Math.floor(current / size) * size;
    },

    _stepRadius(kind, direction) {
      if (!this._hass) return;

      const obsState = this._hass.states[this._observationEntity()];
      const stormState = this._hass.states[this._stormEntity()];
      const dangerState = this._hass.states[this._dangerEntity()];

      const obs = this._radiusUiValue('observation',finiteNumber(obsState?.state));
      const storm = this._radiusUiValue('storm',finiteNumber(stormState?.state));
      const danger = this._radiusUiValue('danger',finiteNumber(dangerState?.state));

      // V3.89 – Beobachtung und Gewitter: liegt der aktuelle Wert nicht auf dem
      // 5-km-Raster, springt +/- zuerst richtungsabhängig auf den nächsten 5er.
      // Danach geht es regulär in 5-km-Schritten weiter. Beispiele:
      // 73 + -> 75 -> 80; 73 - -> 70 -> 65.
      if (kind === 'observation') {
        if (obs == null) return;
        const step = finiteNumber(this._config.observation_button_step) ?? 5;
        const requested = this._snapRadiusStep(obs,direction,step);
        this._setRadiusDirect('observation',requested);
        return;
      }

      if (kind === 'storm') {
        if (storm == null) return;
        const step = finiteNumber(this._config.storm_button_step) ?? 5;
        const requested = this._snapRadiusStep(storm,direction,step);
        this._setRadiusDirect('storm',requested);
        return;
      }

      // Gefahrenradius bleibt bewusst fein: maximal 30 km und weiterhin exakt
      // 1 km pro Tastendruck (bzw. konfigurierter danger_button_step).
      if (danger == null) return;
      const step = finiteNumber(this._config.danger_button_step) ?? 1;
      this._setRadiusDirect('danger',danger + direction * step);
    },

    _setObservationUi(value) {
      const n = this.shadow.getElementById('observation-value');
      const m = this.shadow.getElementById('map-observation-radius');
      const button = this.shadow.getElementById('observation-input');
      const formatted = this._formatRadiusDistance(value);
      if (n) n.textContent = formatted.value;
      const unit = button?.querySelector?.('.radius-unit');
      if (unit) unit.textContent = formatted.unit;
      if (m) m.textContent = formatted.text;
    },

    _setStormUi(value) {
      const n = this.shadow.getElementById('storm-value');
      const m = this.shadow.getElementById('map-storm-radius');
      const l = this.shadow.getElementById('legend-storm-radius');
      const button = this.shadow.getElementById('storm-input');
      const formatted = this._formatRadiusDistance(value);
      if (n) n.textContent = formatted.value;
      const unit = button?.querySelector?.('.radius-unit');
      if (unit) unit.textContent = formatted.unit;
      if (m) m.textContent = formatted.text;
      if (l) l.textContent = formatted.text;
    },

    _setDangerUi(value) {
      const n = this.shadow.getElementById('danger-value');
      const m = this.shadow.getElementById('map-danger-radius');
      const l = this.shadow.getElementById('legend-danger-radius');
      const button = this.shadow.getElementById('danger-input');
      const formatted = this._formatRadiusDistance(value);
      if (n) n.textContent = formatted.value;
      const unit = button?.querySelector?.('.radius-unit');
      if (unit) unit.textContent = formatted.unit;
      if (m) m.textContent = formatted.text;
      if (l) l.textContent = formatted.text;
    },

    _initMap() {
      const cssLink = this.shadow.getElementById('leaflet-css-link');
      const cssReady = new Promise((resolve) => {
        if (cssLink.sheet) return resolve();
        cssLink.addEventListener('load', resolve, { once:true });
        cssLink.addEventListener('error', resolve, { once:true });
      });

      Promise.all([loadLeafletJs(), cssReady]).then(([L]) => {
        installLeafletStrikeCanvas(L);
        installLeafletRadiusAuraSvg(L);
        const mapEl = this.shadow.getElementById('map');
        if (!mapEl || this._map) return;

        const home = this._home();
        const initialZoom = finiteNumber(this._config.initial_zoom) ?? 7;
        this._map = L.map(mapEl,{
          scrollWheelZoom:true,
          zoomControl:true,
          attributionControl:true,
          preferCanvas:true
        }).setView([home.lat,home.lon],initialZoom);

        this._individualStrikeLayer = L.strikeCanvasLayer().addTo(this._map);
        this._radiusAuraSvgLayer = L.radiusAuraSvgLayer().addTo(this._map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
          attribution:'&copy; OpenStreetMap',
          referrerPolicy:'strict-origin-when-cross-origin',
          maxZoom:18
        }).addTo(this._map);

        const referenceIcon = L.divIcon({
          className:'reference-position-icon',
          html:'<span class="reference-position-marker" aria-hidden="true"></span>',
          iconSize:[24,24],
          iconAnchor:[12,12]
        });
        this._homeMarker = L.marker([home.lat,home.lon],{
          icon:referenceIcon,
          keyboard:false,
          riseOnHover:false
        }).addTo(this._map).bindTooltip(this._t('location.reference_label',{location:home.label}));

        // V3.985 – der freistehende Geo-Button gehört geometrisch zur Karte,
        // nicht mehr zur Zoomleiste bzw. zur darunterliegenden Legende.
        const mapActionButtons = [
          this.shadow.getElementById('map-recenter'),
          this.shadow.getElementById('map-strike-target')
        ].filter(Boolean);
        mapActionButtons.forEach((button) => {
          if (button.parentElement !== mapEl) mapEl.appendChild(button);
          L.DomEvent?.disableClickPropagation?.(button);
          L.DomEvent?.disableScrollPropagation?.(button);
        });

        // V3.987 – alle drei Radien werden screen-konzentrisch gerendert.
        // Dadurch teilen Gold, Blau und Rot auch bei großen Entfernungen exakt
        // denselben sichtbaren Standortmittelpunkt.
        this._radiusCircle = L.circleMarker([home.lat,home.lon],{
          radius:1,
          color:C.gold,weight:1.35,fillColor:C.gold,fillOpacity:.012,dashArray:'8 7'
        }).addTo(this._map);
        this._setObservationRadiusVisual(this._observationRadiusValue(),home);

        this._stormCircle = L.circleMarker([home.lat,home.lon],{
          radius:1,
          color:C.blue,weight:1.25,fillColor:C.blue,fillOpacity:.008,dashArray:'3 6'
        }).addTo(this._map);
        this._setStormRadiusVisual(Math.min(this._stormRadiusValue(),this._observationRadiusValue()),home);

        this._dangerCircle = L.circleMarker([home.lat,home.lon],{
          radius:1,
          color:C.danger,weight:1.45,fillColor:C.danger,fillOpacity:.018,dashArray:'5 6'
        }).addTo(this._map);
        this._setDangerRadiusVisual(Math.min(this._dangerRadiusValue(),this._stormRadiusValue(),this._observationRadiusValue()),home);

        this._markerLayer = L.layerGroup().addTo(this._map);
        this._mapReady = true;
        if(this._diagnosticTimings&&!Number.isFinite(this._diagnosticTimings.mapReadyAt))this._diagnosticTimings.mapReadyAt=performance.now();

        this._map.on('moveend',() => this._renderMapMarkers());
        // V3.99404 – ein durch den Cluster-Browser ausgelöster Zoom darf den
        // Browser nicht auf Cluster 1 zurücksetzen. Die Render-Aktualisierung
        // bleibt erhalten; die Auswahl wird weiter unten über Position/ID bewahrt.
        this._map.on('zoomend',() => {
          this._render();
        });

        const kick = () => {
          this._map?.invalidateSize();
          this._positionMapCompassOverlay();
        };
        requestAnimationFrame(kick);
        setTimeout(kick,100);
        setTimeout(kick,450);
        setTimeout(kick,1200);

        if (window.ResizeObserver) {
          this._resizeObserver = new ResizeObserver(kick);
          this._resizeObserver.observe(mapEl);
        }

        this._render();
      }).catch((err) => console.warn('Lightning Detection map: Leaflet could not be loaded.',err));
    },

};});

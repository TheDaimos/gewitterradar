import { defineModule } from "../core/runtime.js?v=41002";
export const MODULE_META=Object.freeze({
  "id": "fullscreen.map-display",
  "version": "1.0.1",
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
});
export const installMapDisplay=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _teardownMapDisplayMode() {
      this._setMapDisplayMenuOpen(false);
      this._closeMapStartupDropdown?.(false);
      if (this._mapStartupOutsidePointerHandler) {
        document.removeEventListener('pointerdown',this._mapStartupOutsidePointerHandler,true);
        this._mapStartupOutsidePointerHandler = null;
      }
      const dialog = this.shadow?.getElementById('map-fullscreen-dialog');
      this._setFullscreenAuxiliaryOverlayHost(false);
      try { if (dialog?.open) dialog.close(); } catch (_error) {}
      this._restoreCompassFromMapOverlay();
      this._restoreLocationFromMapOverlay();
      this._restoreMapCardHome();
      if (typeof window !== 'undefined' && window.__gewitterradarMapWindowOwner === this) {
        window.__gewitterradarMapWindowOwner = null;
      }
    },

    _restoreMapCardHome() {
      const mapCard = this.shadow?.getElementById('map-card');
      const anchor = this.shadow?.getElementById('map-card-anchor');
      if (mapCard && anchor && mapCard.previousElementSibling !== anchor) anchor.after(mapCard);
    },


    _syncCompassPicker() {
      const dialog = this._compassPickerDialog;
      if (!dialog) return;
      const descriptor = COMPASS_DESIGNS.find((entry) => entry.id === this._activeCompassDesign)
        || COMPASS_DESIGNS.find((entry) => entry.id === this._compassDesignValue())
        || COMPASS_DESIGNS[0];
      dialog.setAttribute('aria-label',this._t('compass.picker_title'));
      const closeButton=dialog.querySelector('[data-compass-picker-close]');
      if (closeButton) {
        const closeLabel=this._t('about.close');
        closeButton.setAttribute('aria-label',closeLabel);
        closeButton.setAttribute('title',closeLabel);
      }
      dialog.querySelector('.compass-picker-nav')?.setAttribute('aria-label',this._t('compass.picker_change'));
      const output = dialog.querySelector('[data-compass-picker-index]');
      if (output) output.textContent = descriptor.uiIndex + ' / ' + COMPASS_DESIGNS.length;
      const calibrationNavigation = this._compassCalibrationEnabled && (!this._diagnostics.enabled || this._diagnostics.live);
      const enabled = this._auraEnabled() || calibrationNavigation;
      const previous = dialog.querySelector('[data-compass-picker-prev]');
      const next = dialog.querySelector('[data-compass-picker-next]');
      if (previous) {
        previous.disabled = !enabled;
        previous.setAttribute('aria-disabled',enabled ? 'false' : 'true');
        previous.setAttribute('aria-label',this._t('compass.previous'));
        previous.title = this._t('compass.previous');
      }
      if (next) {
        next.disabled = !enabled;
        next.setAttribute('aria-disabled',enabled ? 'false' : 'true');
        next.setAttribute('aria-label',this._t('compass.next'));
        next.title = this._t('compass.next');
      }
    },

    _closeCompassPicker(restoreFocus = true) {
      const dialog = this._compassPickerDialog;
      if (!dialog) return;
      const instrument = this.shadow?.getElementById('compass-instrument');
      const returnParent = this._compassPickerReturnParent?.isConnected
        ? this._compassPickerReturnParent
        : (this._mapDisplayMode === 'fullscreen'
          ? this.shadow?.getElementById('map-compass-overlay')
          : this.shadow?.querySelector('.compass-wrap'));
      const returnNext = this._compassPickerReturnNext;
      if (instrument && returnParent) {
        if (returnNext?.parentNode === returnParent) returnParent.insertBefore(instrument,returnNext);
        else returnParent.appendChild(instrument);
      }
      try { if (dialog.open) dialog.close(); } catch (_error) {}
      dialog.parentElement?.remove();
      this._compassPickerDialog = null;
      this._compassPickerReturnParent = null;
      this._compassPickerReturnNext = null;
      const previousFocus = this._compassPickerReturnFocus;
      this._compassPickerReturnFocus = null;
      if (returnParent?.id === 'map-compass-overlay' && !returnParent.hidden) {
        requestAnimationFrame(() => this._positionMapCompassOverlay());
      }
      if (restoreFocus && previousFocus?.isConnected) previousFocus.focus?.({preventScroll:true});
    },

    _openCompassPicker() {
      if (this._compassPickerDialog?.open || !this.shadow || !this.isConnected) return;
      const instrument = this.shadow.getElementById('compass-instrument');
      if (!instrument) return;

      const shell = document.createElement('div');
      shell.id = 'compass-picker-shell-v41001';
      shell.innerHTML =
        '<style>' +
        '.compass-picker-dialog{--picker-gold:#dfbc72;--picker-bright:#f7dfa1;box-sizing:border-box;width:min(560px,calc(100vw - 20px));max-width:calc(100vw - 20px);margin:auto;padding:18px 18px 15px;border:1px solid #c9a050;border-radius:13px;color:#d1d4d9;background:radial-gradient(ellipse at 10% 20%,#24313945,transparent 64%),#091219;box-shadow:0 24px 90px #000c,inset 0 0 0 3px #cda9500c;overflow:visible;color-scheme:dark}' +
        '.compass-picker-dialog[open]{display:flex;flex-direction:column;align-items:center;gap:12px}.compass-picker-dialog::backdrop{background:#03070be0;backdrop-filter:blur(2px)}' +
        '.compass-picker-dialog *{box-sizing:border-box}.compass-picker-dialog button{font:inherit;cursor:pointer;touch-action:manipulation}.compass-picker-dialog :focus-visible{outline:2px solid #ffe1a1;outline-offset:2px}' +
        '.compass-picker-close{position:absolute;right:8px;top:8px;width:44px;height:44px;min-height:44px;padding:0;border:0;background:transparent;display:grid;place-items:center;z-index:5}.compass-picker-close img{width:34px;height:34px;object-fit:contain;filter:drop-shadow(0 0 7px #e4b25435)}' +
        '.compass-picker-stage{width:min(430px,72vmin);max-width:calc(100vw - 72px);aspect-ratio:1 / 1;display:grid;place-items:center;margin:10px auto 0;isolation:isolate}' +
        '.compass-picker-stage .compass-instrument{width:calc(100% / var(--compass-visual-stage-scale,1));max-width:none;flex:0 0 auto;cursor:default}.compass-picker-stage .compass-instrument,.compass-picker-stage .compass-instrument *{pointer-events:none!important;touch-action:none!important}' +
        '.compass-picker-nav{display:grid;grid-template-columns:60px 82px 60px;align-items:center;justify-content:center;gap:15px;margin-top:2px}' +
        '.compass-picker-nav-button{width:60px;height:48px;padding:0;border:1px solid #8d713d87;border-radius:11px;background:linear-gradient(145deg,#1b1b17,#0b1116 52%,#17130c);box-shadow:inset 0 1px #ffe6ad15,inset 0 -1px #5d431d75,0 7px 18px #0007;display:grid;place-items:center;color:var(--picker-gold)}' +
        '.compass-picker-nav-button:not(:disabled):hover{border-color:#d5ae5f;box-shadow:inset 0 1px #fff0bf25,0 0 18px #d1a54a20,0 7px 18px #0008}.compass-picker-nav-button:active:not(:disabled){transform:translateY(1px)}.compass-picker-nav-button:disabled{opacity:.38;cursor:default}' +
        '.compass-picker-nav-button svg{width:31px;height:31px;overflow:visible;filter:drop-shadow(0 1px 2px #000)}' +
        '.compass-picker-index{min-width:82px;text-align:center;color:#fff0b2;font:650 13px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-variant-numeric:tabular-nums;letter-spacing:.08em;text-shadow:0 1px 3px #000}' +
        '@media(max-width:520px){.compass-picker-dialog{padding:14px 12px 13px}.compass-picker-stage{width:min(390px,78vw);max-width:calc(100vw - 56px)}.compass-picker-nav{grid-template-columns:56px 72px 56px;gap:11px}.compass-picker-nav-button{width:56px;height:46px}}' +
        '</style>' +
        '<dialog class="compass-picker-dialog" role="dialog" aria-modal="true" aria-label="' + this._t('compass.picker_title') + '">' +
        '<button class="compass-picker-close" type="button" data-compass-picker-close aria-label="' + this._t('about.close') + '" title="' + this._t('about.close') + '"><img src="' + ABOUT_CLOSE_IMAGE + '" alt="" width="34" height="34" draggable="false"></button>' +
        '<div class="compass-picker-stage" data-compass-picker-stage></div>' +
        '<div class="compass-picker-nav" role="group" aria-label="' + this._t('compass.picker_change') + '">' +
        '<button class="compass-picker-nav-button" type="button" data-compass-picker-prev><svg viewBox="0 0 44 44" aria-hidden="true"><defs><linearGradient id="compass-picker-gold-prev" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0bc"/><stop offset=".28" stop-color="#e8bd60"/><stop offset=".48" stop-color="#92703a"/><stop offset=".68" stop-color="#ffe2a0"/><stop offset="1" stop-color="#b58b44"/></linearGradient></defs><path d="M28.5 8.5 15 22l13.5 13.5" fill="none" stroke="url(#compass-picker-gold-prev)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<output class="compass-picker-index" data-compass-picker-index aria-live="polite"></output>' +
        '<button class="compass-picker-nav-button" type="button" data-compass-picker-next><svg viewBox="0 0 44 44" aria-hidden="true"><defs><linearGradient id="compass-picker-gold-next" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0bc"/><stop offset=".28" stop-color="#e8bd60"/><stop offset=".48" stop-color="#92703a"/><stop offset=".68" stop-color="#ffe2a0"/><stop offset="1" stop-color="#b58b44"/></linearGradient></defs><path d="M15.5 8.5 29 22 15.5 35.5" fill="none" stroke="url(#compass-picker-gold-next)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '</div></dialog>';

      this._compassPickerReturnParent = instrument.parentElement;
      this._compassPickerReturnNext = instrument.nextSibling;
      this._compassPickerReturnFocus = this.shadow.activeElement;
      this.shadow.append(shell);
      const dialog = shell.querySelector('.compass-picker-dialog');
      const stage = shell.querySelector('[data-compass-picker-stage]');
      if (!dialog || !stage) { shell.remove(); return; }
      this._compassPickerDialog = dialog;
      stage.appendChild(instrument);

      shell.querySelector('[data-compass-picker-close]')?.addEventListener('click',() => this._closeCompassPicker());
      shell.querySelector('[data-compass-picker-prev]')?.addEventListener('click',(event) => {
        event.preventDefault(); event.stopPropagation();
        this._stepCompassDesign(-1);
        this._syncCompassPicker();
      });
      shell.querySelector('[data-compass-picker-next]')?.addEventListener('click',(event) => {
        event.preventDefault(); event.stopPropagation();
        this._stepCompassDesign(1);
        this._syncCompassPicker();
      });
      dialog.addEventListener('cancel',(event) => {
        event.preventDefault(); event.stopPropagation();
        this._closeCompassPicker();
      });
      dialog.addEventListener('pointerdown',(event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
          event.preventDefault();
          this._closeCompassPicker();
        }
      });

      try { dialog.showModal(); } catch (_error) { dialog.setAttribute('open',''); }
      this._syncCompassPicker();
      shell.querySelector('[data-compass-picker-close]')?.focus?.({preventScroll:true});
    },

    _setFullscreenAuxiliaryOverlayHost(useFullscreen = false) {
      const dialog = this.shadow?.getElementById('map-fullscreen-dialog');
      if (!this.shadow || !dialog) return;
      const host = useFullscreen ? dialog : this.shadow;
      ['radius-keypad-backdrop','v407-location-search-backdrop'].forEach((id) => {
        const overlay = this.shadow?.getElementById(id);
        if (!overlay || overlay.parentNode === host) return;
        try { host.appendChild(overlay); } catch (_error) {}
      });
    },

    _restoreCompassFromMapOverlay() {
      const instrument = this.shadow?.getElementById('compass-instrument');
      const overlay = this.shadow?.getElementById('map-compass-overlay');
      const fallback = this.shadow?.querySelector('.compass-wrap');
      const home = this._mapCompassHomeParent?.isConnected ? this._mapCompassHomeParent : fallback;
      if (instrument && home && instrument.parentElement !== home) home.appendChild(instrument);
      if (overlay) {
        overlay.hidden = true;
        overlay.classList.remove('dragging');
      }
      this._mapCompassDragState = null;
    },

    _attachCompassToMapOverlay() {
      const instrument = this.shadow?.getElementById('compass-instrument');
      const overlay = this.shadow?.getElementById('map-compass-overlay');
      if (!instrument || !overlay) return;
      if (!this._mapCompassHomeParent || !this._mapCompassHomeParent.isConnected) {
        this._mapCompassHomeParent = instrument.parentElement?.classList?.contains('compass-wrap')
          ? instrument.parentElement
          : (this.shadow?.querySelector('.compass-wrap') || null);
      }
      if (instrument.parentElement !== overlay) overlay.appendChild(instrument);
      overlay.hidden = !this._mapCompassVisible;
      if (!overlay.hidden) requestAnimationFrame(() => this._positionMapCompassOverlay());
    },

    _persistMapMedallionPosition() {
      try { localStorage.setItem(MAP_MEDALLION_POSITION_STORAGE_KEY,JSON.stringify(this._mapMedallionPosition)); } catch (_error) {}
    },

    _positionMapMedallionOverlay(position = this._mapMedallionPosition) {
      const overlay = this.shadow?.getElementById('map-medallion-overlay');
      const mapCard = this.shadow?.getElementById('map-card');
      const mapEl = this.shadow?.getElementById('map');
      if (!overlay || overlay.hidden || !mapCard || !mapEl) return;
      const cardRect = mapCard.getBoundingClientRect();
      const mapRect = mapEl.getBoundingClientRect();
      const width = overlay.offsetWidth || overlay.getBoundingClientRect().width || 0;
      const height = overlay.offsetHeight || overlay.getBoundingClientRect().height || 0;
      if (!cardRect.width || !mapRect.width || !width || !height) return;
      const inset = 10;
      const minLeft = Math.max(0,mapRect.left-cardRect.left+inset);
      const minTop = Math.max(0,mapRect.top-cardRect.top+inset);
      const maxLeft = Math.max(minLeft,mapRect.right-cardRect.left-width-inset);
      const maxTop = Math.max(minTop,mapRect.bottom-cardRect.top-height-inset);
      const x = clamp(Number(position?.x) || 0,0,1);
      const y = clamp(Number(position?.y) || 0,0,1);
      overlay.style.left = `${minLeft+(maxLeft-minLeft)*x}px`;
      overlay.style.top = `${minTop+(maxTop-minTop)*y}px`;
    },

    _syncMapMedallionState() {
      const source = this.shadow?.getElementById('trend-box');
      const overlay = this.shadow?.getElementById('map-medallion-overlay');
      if (!source || !overlay) return;
      const state = ['up','down','stable','none'].find(name => source.classList.contains(name)) || 'none';
      overlay.classList.remove('up','down','stable','none');
      overlay.classList.add(state);
    },

    _setMapLayerSymbolStyle(_style,{persist=true}={}) {
      // V4.09.12 – bewusst nur noch der verbindliche 3D-Layerstapel.
      this._mapLayerSymbolStyle = 'stack3d';
      if (persist) {
        try { localStorage.setItem(MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY,'stack3d'); } catch (_error) {}
      }
      this._syncMapDisplayUi();
    },

    _setMapInstrumentVisible(kind,visible) {
      const next = !!visible;
      if (kind === 'compass') {
        this._mapCompassVisible = next;
        try { localStorage.setItem(MAP_COMPASS_VISIBLE_STORAGE_KEY,next ? '1' : '0'); } catch (_error) {}
      } else if (kind === 'medallion') {
        this._mapMedallionVisible = next;
        try { localStorage.setItem(MAP_MEDALLION_VISIBLE_STORAGE_KEY,next ? '1' : '0'); } catch (_error) {}
      } else return;
      this._syncMapDisplayUi();
      this._scheduleMapDisplayResize();
    },

    _persistMapLocationPosition() {
      try { localStorage.setItem(MAP_LOCATION_POSITION_STORAGE_KEY,JSON.stringify(this._mapLocationPosition)); } catch (_error) {}
    },

    _positionMapLocationOverlay(position = this._mapLocationPosition) {
      const overlay = this.shadow?.getElementById('map-location-overlay');
      const mapCard = this.shadow?.getElementById('map-card');
      const mapEl = this.shadow?.getElementById('map');
      if (!overlay || overlay.hidden || !mapCard || !mapEl) return;
      const cardRect = mapCard.getBoundingClientRect();
      const mapRect = mapEl.getBoundingClientRect();
      const width = overlay.offsetWidth || overlay.getBoundingClientRect().width || 0;
      const height = overlay.offsetHeight || overlay.getBoundingClientRect().height || 0;
      if (!cardRect.width || !mapRect.width || !width || !height) return;
      const inset = 10;
      const minLeft = Math.max(0,mapRect.left-cardRect.left+inset);
      const minTop = Math.max(0,mapRect.top-cardRect.top+inset);
      const maxLeft = Math.max(minLeft,mapRect.right-cardRect.left-width-inset);
      const maxTop = Math.max(minTop,mapRect.bottom-cardRect.top-height-inset);
      const x = clamp(Number(position?.x) || 0,0,1);
      const y = clamp(Number(position?.y) || 0,0,1);
      overlay.style.left = `${minLeft+(maxLeft-minLeft)*x}px`;
      overlay.style.top = `${minTop+(maxTop-minTop)*y}px`;
    },

    _scheduleOpenLocationDropdownPosition() {
      if (this._mapLocationDropdownRaf || typeof requestAnimationFrame !== 'function') return;
      this._mapLocationDropdownRaf = requestAnimationFrame(() => {
        this._mapLocationDropdownRaf = null;
        const dropdown = this.shadow?.getElementById('location-dropdown');
        const button = this.shadow?.getElementById('location-main-button');
        if (!dropdown?.classList.contains('open') || !button) return;
        this._positionLocationDropdown?.(button);
      });
    },

    _restoreLocationFromMapOverlay() {
      const row = this.shadow?.getElementById('location-main-row');
      const overlay = this.shadow?.getElementById('map-location-overlay');
      const dropdown = this.shadow?.getElementById('location-dropdown');
      const rowHome = this._mapLocationHomeParent?.isConnected
        ? this._mapLocationHomeParent
        : (this.shadow?.querySelector('.header-control-row') || null);
      if (row && rowHome && row.parentElement !== rowHome) {
        const settingsButton = rowHome.querySelector?.('#settings-open') || null;
        rowHome.insertBefore(row,settingsButton);
      }
      const dropdownHome = this._mapLocationDropdownHomeParent?.isConnected
        ? this._mapLocationDropdownHomeParent
        : null;
      if (dropdown && dropdownHome && dropdown.parentElement !== dropdownHome) {
        dropdown.classList.remove('open','map-adaptive','multicolumn','open-up','open-down');
        dropdown.style.visibility = '';
        ['column-count','column-gap','column-fill','height','overflow-x'].forEach(name => dropdown.style.removeProperty(name));
        dropdownHome.appendChild(dropdown);
      }
      if (overlay) {
        overlay.hidden = true;
        overlay.classList.remove('dragging');
      }
      this._mapLocationDragState = null;
    },

    _attachLocationToMapOverlay() {
      const row = this.shadow?.getElementById('location-main-row');
      const overlay = this.shadow?.getElementById('map-location-overlay');
      const dropdown = this.shadow?.getElementById('location-dropdown');
      const dialog = this.shadow?.getElementById('map-fullscreen-dialog');
      if (!row || !overlay) return;
      if (!this._mapLocationHomeParent || !this._mapLocationHomeParent.isConnected) {
        this._mapLocationHomeParent = row.parentElement || this.shadow?.querySelector('.header-control-row') || null;
      }
      if (dropdown && (!this._mapLocationDropdownHomeParent || !this._mapLocationDropdownHomeParent.isConnected)) {
        this._mapLocationDropdownHomeParent = dropdown.parentElement || null;
      }
      if (row.parentElement !== overlay) overlay.appendChild(row);
      overlay.hidden = false;
      if (dropdown && dialog && dropdown.parentElement !== dialog) {
        dropdown.classList.remove('open');
        dropdown.style.visibility = '';
        dialog.appendChild(dropdown);
      }
      requestAnimationFrame(() => {
        this._positionMapLocationOverlay();
        this._scheduleOpenLocationDropdownPosition();
      });
    },

    _positionMapCompassOverlay(position = this._mapCompassPosition) {
      const overlay = this.shadow?.getElementById('map-compass-overlay');
      const mapCard = this.shadow?.getElementById('map-card');
      const mapEl = this.shadow?.getElementById('map');
      if (!overlay || overlay.hidden || !mapCard || !mapEl) return;
      const cardRect = mapCard.getBoundingClientRect();
      const mapRect = mapEl.getBoundingClientRect();
      const width = overlay.offsetWidth || overlay.getBoundingClientRect().width || 0;
      const height = overlay.offsetHeight || overlay.getBoundingClientRect().height || 0;
      if (!cardRect.width || !mapRect.width || !width || !height) return;
      const inset = 10;
      const minLeft = Math.max(0,mapRect.left-cardRect.left+inset);
      const minTop = Math.max(0,mapRect.top-cardRect.top+inset);
      const maxLeft = Math.max(minLeft,mapRect.right-cardRect.left-width-inset);
      const maxTop = Math.max(minTop,mapRect.bottom-cardRect.top-height-inset);
      const x = clamp(Number(position?.x) || 0,0,1);
      const y = clamp(Number(position?.y) || 0,0,1);
      overlay.style.left = `${minLeft+(maxLeft-minLeft)*x}px`;
      overlay.style.top = `${minTop+(maxTop-minTop)*y}px`;
    },

    _persistMapCompassPosition() {
      try { localStorage.setItem(MAP_COMPASS_POSITION_STORAGE_KEY,JSON.stringify(this._mapCompassPosition)); } catch (_error) {}
    },

    _positionMapDisplayControl() {
      const control = this.shadow?.getElementById('map-display-control');
      const mapCard = this.shadow?.getElementById('map-card');
      const mapEl = this.shadow?.getElementById('map');
      if (!control || !mapCard || !mapEl || this._mapWindowMode) return;
      const cardRect = mapCard.getBoundingClientRect();
      const mapRect = mapEl.getBoundingClientRect();
      const width = control.offsetWidth || 44;
      const height = control.offsetHeight || 44;
      if (!cardRect.width || !mapRect.width) return;
      const rightInset = 10;
      const attribution = mapEl.querySelector?.('.leaflet-control-attribution');
      const attributionHeight = attribution?.getBoundingClientRect?.().height || 18;
      const bottomInset = Math.max(8,attributionHeight+4);
      const left = Math.max(8,mapRect.right-cardRect.left-width-rightInset);
      const top = Math.max(mapRect.top-cardRect.top+8,mapRect.bottom-cardRect.top-height-bottomInset);
      control.style.left = `${left}px`;
      control.style.top = `${top}px`;
    },

    _setMapDisplayMenuOpen(open) {
      this._mapDisplayMenuOpen = !!open && !this._mapWindowMode;
      const menu = this.shadow?.getElementById('map-display-switch');
      const toggle = this.shadow?.getElementById('map-display-menu-toggle');
      const wrap = this.shadow?.getElementById('map-display-control');
      if (menu) menu.hidden = !this._mapDisplayMenuOpen;
      if (toggle) toggle.setAttribute('aria-expanded',this._mapDisplayMenuOpen ? 'true' : 'false');
      wrap?.classList.toggle('menu-open',this._mapDisplayMenuOpen);
    },

    _setMapStartupMode(mode) {
      if (!['standard','large','fullscreen','last'].includes(mode)) return;
      this._mapStartupMode = mode;
      try { localStorage.setItem(MAP_STARTUP_MODE_STORAGE_KEY,mode); } catch (_error) {}
      this._syncMapDisplayUi();
    },

    _scheduleMapDisplayResize() {
      const kick = () => {
        this._map?.invalidateSize?.();
        this._positionMapCompassOverlay();
        this._positionMapMedallionOverlay();
        this._positionMapLocationOverlay();
        this._positionMapDisplayControl();
        this._scheduleOpenLocationDropdownPosition();
      };
      requestAnimationFrame(() => requestAnimationFrame(kick));
      setTimeout(kick,120);
      setTimeout(kick,360);
    },

    _syncMapDisplayUi() {
      if (!this.shadow) return;
      const mapCard = this.shadow.getElementById('map-card');
      if (!mapCard) return;
      const fullscreenActive = this._mapDisplayMode === 'fullscreen' || this._mapWindowMode;
      this.classList.toggle('map-window-host',!!this._mapWindowMode);
      mapCard.classList.toggle('map-size-large',this._mapDisplayMode === 'large' && !fullscreenActive);
      mapCard.classList.toggle('map-size-fullscreen',fullscreenActive);
      mapCard.classList.toggle('map-window-mode',!!this._mapWindowMode);
      const labels = {
        standard:this._t('map.size_standard'),
        large:this._t('map.size_large'),
        fullscreen:this._t('map.size_fullscreen')
      };
      const activeMode = fullscreenActive ? 'fullscreen' : this._mapDisplayMode;
      const switcher = this.shadow.getElementById('map-display-switch');
      const menuToggle = this.shadow.getElementById('map-display-menu-toggle');
      const menuTitle = this.shadow.getElementById('map-display-menu-title');
      if (switcher) switcher.setAttribute('aria-label',this._t('map.view_menu_aria'));
      if (menuTitle) menuTitle.textContent = this._t('map.view_menu');
      if (menuToggle) {
        menuToggle.setAttribute('aria-label',`${this._t('map.view_menu_aria')} · ${labels[activeMode] || activeMode}`);
        menuToggle.setAttribute('title',`${this._t('map.view_menu')} · ${labels[activeMode] || activeMode}`);
        menuToggle.setAttribute('aria-expanded',this._mapDisplayMenuOpen ? 'true' : 'false');
      }
      if (switcher) switcher.hidden = !this._mapDisplayMenuOpen;
      // V4.09.12 – keine Layer-Symbolauswahl mehr: 3D-Layer ist fest gesetzt.
      menuToggle?.classList.remove('use-infinity');
      this.shadow.querySelectorAll('[data-map-display-mode]').forEach((button) => {
        const mode = button.dataset.mapDisplayMode;
        const active = mode === activeMode;
        button.textContent = labels[mode] || mode;
        button.classList.toggle('active',active);
        button.setAttribute('aria-checked',active ? 'true' : 'false');
        button.setAttribute('title',labels[mode] || mode);
      });
      this._positionMapDisplayControl();
      const overlay = this.shadow.getElementById('map-compass-overlay');
      const medallionOverlay = this.shadow.getElementById('map-medallion-overlay');
      const instrumentControls = this.shadow.getElementById('map-instrument-controls');
      const compassToggle = this.shadow.getElementById('map-compass-toggle');
      const medallionToggle = this.shadow.getElementById('map-medallion-toggle');
      if (overlay) {
        const moveCompass=this._t('map.compass_move');
        overlay.setAttribute('aria-label',moveCompass);
        overlay.setAttribute('title',moveCompass);
        overlay.hidden = !fullscreenActive || !this._mapCompassVisible;
      }
      if (medallionOverlay) {
        const moveMedallion=this._t('map.medallion_move');
        medallionOverlay.setAttribute('aria-label',moveMedallion);
        medallionOverlay.setAttribute('title',moveMedallion);
        medallionOverlay.classList.toggle('android-device',this._isAndroidLike());
        medallionOverlay.hidden = !fullscreenActive || !this._mapMedallionVisible;
      }
      if (instrumentControls) instrumentControls.hidden = !fullscreenActive;
      if (compassToggle) {
        compassToggle.classList.toggle('active',this._mapCompassVisible);
        compassToggle.setAttribute('aria-pressed',this._mapCompassVisible ? 'true' : 'false');
        compassToggle.setAttribute('aria-label',`${this._t('compass.device')} · ${this._t(this._mapCompassVisible ? 'toggle.on' : 'toggle.off')}`);
        compassToggle.title = compassToggle.getAttribute('aria-label');
      }
      if (medallionToggle) {
        medallionToggle.classList.toggle('active',this._mapMedallionVisible);
        medallionToggle.setAttribute('aria-pressed',this._mapMedallionVisible ? 'true' : 'false');
        medallionToggle.setAttribute('aria-label',`${this._t('trend.label')} · ${this._t(this._mapMedallionVisible ? 'toggle.on' : 'toggle.off')}`);
        medallionToggle.title = medallionToggle.getAttribute('aria-label');
      }
      this._syncMapMedallionState();
      const settingsTitle = this.shadow.getElementById('settings-map-section-title');
      const settingsSub = this.shadow.getElementById('settings-map-section-sub');
      const settingsStartupLabel = this.shadow.getElementById('settings-map-startup-label');
      const settingsStartupNote = this.shadow.getElementById('settings-map-startup-note');
      const settingsStartupButton = this.shadow.getElementById('settings-map-startup-button');
      const settingsStartupCurrent = this.shadow.getElementById('settings-map-startup-current');
      const settingsWindowLabel = this.shadow.getElementById('settings-map-window-label');
      const settingsWindowNote = this.shadow.getElementById('settings-map-window-note');
      const settingsWindowOpen = this.shadow.getElementById('settings-map-window-open');
      if (settingsTitle) settingsTitle.textContent = this._t('settings.map_display');
      if (settingsSub) settingsSub.textContent = this._t('settings.map_display_sub');
      if (settingsStartupLabel) settingsStartupLabel.textContent = this._t('settings.map_startup');
      if (settingsStartupNote) settingsStartupNote.textContent = this._t('settings.map_startup_note');
      const startupModeLabels = {
        standard:this._t('map.size_standard'),
        large:this._t('map.size_large'),
        fullscreen:this._t('map.size_fullscreen'),
        last:this._t('settings.map_startup_last')
      };
      const activeStartupMode = ['standard','large','fullscreen','last'].includes(this._mapStartupMode) ? this._mapStartupMode : 'last';
      if (settingsStartupCurrent) settingsStartupCurrent.textContent = startupModeLabels[activeStartupMode] || startupModeLabels.last;
      if (settingsStartupButton) {
        settingsStartupButton.setAttribute('aria-label',this._t('settings.map_startup'));
        settingsStartupButton.setAttribute('title',`${this._t('settings.map_startup')}: ${startupModeLabels[activeStartupMode] || startupModeLabels.last}`);
      }
      this.shadow.getElementById('settings-map-startup-dropdown')?.setAttribute('aria-label',this._t('settings.map_startup_select'));
      if (settingsWindowLabel) settingsWindowLabel.textContent = this._t('settings.map_window');
      if (settingsWindowNote) settingsWindowNote.textContent = this._t('settings.map_window_note');
      if (settingsWindowOpen) {
        settingsWindowOpen.textContent = this._t('settings.map_window_open');
        const windowLabel=this._t('settings.map_window_open_aria');
        settingsWindowOpen.setAttribute('aria-label',windowLabel);
        settingsWindowOpen.setAttribute('title',windowLabel);
      }
    },

    _setMapDisplayMode(mode,{persist=true,remember=true,closeMenu=true}={}) {
      if (!['standard','large','fullscreen'].includes(mode)) return;
      if (this._mapWindowMode && mode !== 'fullscreen') return;
      if (closeMenu) this._setMapDisplayMenuOpen(false);
      if (remember && !this._mapWindowMode) {
        try { localStorage.setItem(MAP_LAST_DISPLAY_MODE_STORAGE_KEY,mode); } catch (_error) {}
      }
      if (mode === 'fullscreen') {
        if (this._mapDisplayMode !== 'fullscreen') {
          this._mapDisplayBeforeFullscreen = this._mapDisplayMode === 'large' ? 'large' : 'standard';
        }
        this._mapDisplayMode = 'fullscreen';
        const dialog = this.shadow?.getElementById('map-fullscreen-dialog');
        const mapCard = this.shadow?.getElementById('map-card');
        if (dialog && mapCard) {
          if (mapCard.parentElement !== dialog) dialog.appendChild(mapCard);
          if (!dialog.open) {
            try { dialog.showModal(); } catch (_error) {
              try { dialog.setAttribute('open',''); } catch (__error) {}
            }
          }
          if (this._mapWindowMode && !dialog.hasAttribute('open')) {
            try { dialog.setAttribute('open',''); } catch (_error) {}
          }
          this._attachCompassToMapOverlay();
          this._attachLocationToMapOverlay();
          // V4.09.13 – Native <dialog>.showModal() lives in the browser top layer.
          // Auxiliary popups must be children of that dialog while fullscreen is active,
          // otherwise even a maximal z-index remains visually behind the map dialog.
          this._setFullscreenAuxiliaryOverlayHost(true);
        }
        this._syncMapDisplayUi();
        this._scheduleMapDisplayResize();
        return;
      }
      this._mapDisplayMode = mode;
      this._restoreCompassFromMapOverlay();
      this._restoreLocationFromMapOverlay();
      this._restoreMapCardHome();
      this._setFullscreenAuxiliaryOverlayHost(false);
      const dialog = this.shadow?.getElementById('map-fullscreen-dialog');
      if (dialog?.open) {
        try { dialog.close(); } catch (_error) {}
      } else if (dialog?.hasAttribute('open')) {
        dialog.removeAttribute('open');
      }
      if (persist) {
        try { localStorage.setItem(MAP_DISPLAY_MODE_STORAGE_KEY,mode); } catch (_error) {}
      }
      this._syncMapDisplayUi();
      this._scheduleMapDisplayResize();
    },

    _openMapWindow() {
      if (this._mapWindowMode || typeof window === 'undefined') return;
      let targetUrl = null;
      try {
        targetUrl = new URL(window.location.href);
        targetUrl.searchParams.set(MAP_WINDOW_QUERY_KEY,'1');
        targetUrl.searchParams.set(MAP_WINDOW_VERSION_QUERY_KEY,'41001');
      } catch (_error) {}
      if (!targetUrl) {
        this._setMapDisplayMode('fullscreen');
        return;
      }
      const popup = window.open(targetUrl.href,'gewitterradar-map-window','popup=yes,width=1280,height=820,resizable=yes,scrollbars=no');
      if (popup) {
        try { popup.focus(); } catch (_error) {}
      } else {
        this._setMapDisplayMode('fullscreen');
      }
    },

    _closeMapStartupDropdown(returnFocus = false) {
      const startupButton = this.shadow?.getElementById('settings-map-startup-button');
      const startupDropdown = this.shadow?.getElementById('settings-map-startup-dropdown');
      startupDropdown?.classList.remove('open');
      if (startupDropdown) startupDropdown.style.visibility = '';
      startupButton?.setAttribute('aria-expanded','false');
      if (returnFocus) startupButton?.focus?.({preventScroll:true});
    },

    _bindMapDisplayControls() {
      const dialog = this.shadow?.getElementById('map-fullscreen-dialog');
      const overlay = this.shadow?.getElementById('map-compass-overlay');
      const medallionOverlay = this.shadow?.getElementById('map-medallion-overlay');
      const locationOverlay = this.shadow?.getElementById('map-location-overlay');
      const locationMainButton = this.shadow?.getElementById('location-main-button');
      const compassToggle = this.shadow?.getElementById('map-compass-toggle');
      const medallionToggle = this.shadow?.getElementById('map-medallion-toggle');
      const menuToggle = this.shadow?.getElementById('map-display-menu-toggle');
      const menuWrap = this.shadow?.getElementById('map-display-control');
      const startupButton = this.shadow?.getElementById('settings-map-startup-button');
      const startupDropdown = this.shadow?.getElementById('settings-map-startup-dropdown');
      menuToggle?.addEventListener('click',(event) => {
        event.preventDefault();
        event.stopPropagation();
        this._setMapDisplayMenuOpen(!this._mapDisplayMenuOpen);
      });
      menuToggle?.addEventListener('keydown',(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          this._setMapDisplayMenuOpen(false);
        }
      });
      const startupModeLabels = () => ({
        standard:this._t('map.size_standard'),
        large:this._t('map.size_large'),
        fullscreen:this._t('map.size_fullscreen'),
        last:this._t('settings.map_startup_last')
      });
      const closeStartupDropdown = (returnFocus = false) => this._closeMapStartupDropdown(returnFocus);
      const renderStartupDropdown = () => {
        if (!startupDropdown) return;
        const selected = ['standard','large','fullscreen','last'].includes(this._mapStartupMode) ? this._mapStartupMode : 'last';
        const labels = startupModeLabels();
        const frag = document.createDocumentFragment();
        ['standard','large','fullscreen','last'].forEach((mode) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = `location-option${mode === selected ? ' selected' : ''}`;
          button.dataset.mapStartupOption = mode;
          button.setAttribute('role','option');
          button.setAttribute('aria-selected',mode === selected ? 'true' : 'false');
          const dot = document.createElement('i');
          dot.className = 'location-option-dot';
          dot.setAttribute('aria-hidden','true');
          const label = document.createElement('span');
          label.textContent = labels[mode] || mode;
          button.append(dot,label);
          frag.appendChild(button);
        });
        startupDropdown.replaceChildren(frag);
      };
      const positionStartupDropdown = () => {
        if (!startupButton || !startupDropdown) return;
        const rect = startupButton.getBoundingClientRect();
        const viewport = window.visualViewport;
        const viewportLeft = Number(viewport?.offsetLeft) || 0;
        const viewportTop = Number(viewport?.offsetTop) || 0;
        const viewportWidth = Number(viewport?.width) || window.innerWidth;
        const viewportHeight = Number(viewport?.height) || window.innerHeight;
        const margin = 8;
        const gap = 6;
        const width = Math.min(Math.max(190,Math.round(rect.width)),Math.max(1,viewportWidth-(margin*2)));
        const rightAlignedLeft = rect.right-width;
        const minLeft = viewportLeft+margin;
        const maxLeft = Math.max(minLeft,viewportLeft+viewportWidth-width-margin);
        startupDropdown.style.width = `${width}px`;
        startupDropdown.style.left = `${clamp(Math.round(rightAlignedLeft),minLeft,maxLeft)}px`;
        startupDropdown.style.visibility = 'hidden';
        startupDropdown.classList.add('open');
        startupButton.setAttribute('aria-expanded','true');
        const menuRect = startupDropdown.getBoundingClientRect();
        const viewportBottom = viewportTop+viewportHeight;
        const below = rect.bottom+gap;
        const above = rect.top-gap-menuRect.height;
        const top = below+menuRect.height <= viewportBottom-margin ? below : Math.max(viewportTop+margin,above);
        startupDropdown.style.top = `${Math.round(top)}px`;
        startupDropdown.style.visibility = '';
      };
      startupButton?.addEventListener('click',(event) => {
        event.preventDefault();
        event.stopPropagation();
        const open = startupDropdown?.classList.contains('open');
        if (open) {
          closeStartupDropdown(false);
          return;
        }
        renderStartupDropdown();
        positionStartupDropdown();
      });
      startupDropdown?.addEventListener('click',(event) => {
        const option = event.target?.closest?.('[data-map-startup-option]');
        const mode = option?.dataset?.mapStartupOption;
        if (!['standard','large','fullscreen','last'].includes(mode)) return;
        event.preventDefault();
        event.stopPropagation();
        this._setMapStartupMode(mode);
        closeStartupDropdown(true);
      });
      if (this._mapStartupOutsidePointerHandler) {
        document.removeEventListener('pointerdown',this._mapStartupOutsidePointerHandler,true);
      }
      this._mapStartupOutsidePointerHandler = (event) => {
        if (!startupDropdown?.classList.contains('open')) return;
        const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
        if (path.includes(startupDropdown) || path.includes(startupButton)) return;
        closeStartupDropdown(false);
      };
      document.addEventListener('pointerdown',this._mapStartupOutsidePointerHandler,true);
      compassToggle?.addEventListener('click',(event) => {
        event.preventDefault(); event.stopPropagation();
        this._setMapInstrumentVisible('compass',!this._mapCompassVisible);
      });
      medallionToggle?.addEventListener('click',(event) => {
        event.preventDefault(); event.stopPropagation();
        this._setMapInstrumentVisible('medallion',!this._mapMedallionVisible);
      });
      if (!this._mapDisplayOutsidePointerHandler) {
        this._mapDisplayOutsidePointerHandler = (event) => {
          if (!this._mapDisplayMenuOpen) return;
          if (menuWrap?.contains(event.target)) return;
          this._setMapDisplayMenuOpen(false);
        };
        this.shadow?.addEventListener('pointerdown',this._mapDisplayOutsidePointerHandler);
      }
      this.shadow?.querySelectorAll('[data-map-display-mode]').forEach((button) => {
        button.addEventListener('click',(event) => {
          event.preventDefault();
          event.stopPropagation();
          this._setMapDisplayMode(button.dataset.mapDisplayMode || 'standard');
        });
      });
      this.shadow?.getElementById('settings-map-window-open')?.addEventListener('click',(event) => {
        event.preventDefault();
        event.stopPropagation();
        this._openMapWindow();
      });
      dialog?.addEventListener('cancel',(event) => {
        event.preventDefault();
        if (this._mapWindowMode) return;
        this._setMapDisplayMode(this._mapDisplayBeforeFullscreen || 'standard');
      });
      const mapInstrumentDragBounds = (target) => {
        const card = this.shadow?.getElementById('map-card');
        const mapEl = this.shadow?.getElementById('map');
        if (!card || !mapEl || !target) return null;
        const cardRect = card.getBoundingClientRect();
        const mapRect = mapEl.getBoundingClientRect();
        const inset = 10;
        const minLeft = Math.max(0,mapRect.left-cardRect.left+inset);
        const minTop = Math.max(0,mapRect.top-cardRect.top+inset);
        const maxLeft = Math.max(minLeft,mapRect.right-cardRect.left-target.offsetWidth-inset);
        const maxTop = Math.max(minTop,mapRect.bottom-cardRect.top-target.offsetHeight-inset);
        return {minLeft,minTop,maxLeft,maxTop};
      };
      const bindMapInstrumentDrag = (target,kind) => {
        if (!target) return;
        const stateKey = kind === 'compass' ? '_mapCompassDragState' : '_mapMedallionDragState';
        const startDrag = (source,inputId,clientX,clientY) => {
          this[stateKey] = {
            source,inputId,startX:clientX,startY:clientY,
            startLeft:target.offsetLeft,startTop:target.offsetTop,moved:false
          };
          target.classList.add('dragging');
        };
        const moveDrag = (source,inputId,clientX,clientY) => {
          const drag = this[stateKey];
          if (!drag || drag.source !== source || drag.inputId !== inputId) return false;
          const dx = clientX-drag.startX, dy = clientY-drag.startY;
          if (!drag.moved && Math.hypot(dx,dy) < 6) return false;
          drag.moved = true;
          const bounds = mapInstrumentDragBounds(target);
          if (!bounds) return false;
          target.style.left = `${clamp(drag.startLeft+dx,bounds.minLeft,bounds.maxLeft)}px`;
          target.style.top = `${clamp(drag.startTop+dy,bounds.minTop,bounds.maxTop)}px`;
          return true;
        };
        const finishDrag = (source,inputId) => {
          const drag = this[stateKey];
          if (!drag || drag.source !== source || drag.inputId !== inputId) return false;
          const moved = !!drag.moved;
          const bounds = mapInstrumentDragBounds(target);
          if (moved && bounds) {
            const position = {
              x:bounds.maxLeft>bounds.minLeft ? clamp((target.offsetLeft-bounds.minLeft)/(bounds.maxLeft-bounds.minLeft),0,1) : 0,
              y:bounds.maxTop>bounds.minTop ? clamp((target.offsetTop-bounds.minTop)/(bounds.maxTop-bounds.minTop),0,1) : 0
            };
            if (kind === 'compass') {
              this._mapCompassPosition = position;
              this._persistMapCompassPosition();
            } else {
              this._mapMedallionPosition = position;
              this._persistMapMedallionPosition();
            }
          }
          this[stateKey] = null;
          target.classList.remove('dragging');
          return moved;
        };

        // Pointer Events bleiben der Primärpfad für Maus/Stift und Browser,
        // die Touch-Pointer inklusive Capture zuverlässig an das <dialog>-Overlay liefern.
        target.addEventListener('pointerdown',(event) => {
          if (target.hidden || event.isPrimary === false || (event.pointerType === 'mouse' && event.button !== 0)) return;
          // Touch wird zusätzlich durch native Touch Events abgesichert. Pointerdown
          // darf diese Android-/WebView-Fallbackkette deshalb nicht weg-canceln.
          if (event.pointerType !== 'touch') event.preventDefault();
          event.stopPropagation();
          startDrag('pointer',event.pointerId,event.clientX,event.clientY);
          try { target.setPointerCapture(event.pointerId); } catch (_error) {}
        },{capture:true});
        target.addEventListener('pointermove',(event) => {
          const drag = this[stateKey];
          if (!drag || drag.source !== 'pointer' || drag.inputId !== event.pointerId) return;
          event.preventDefault();
          event.stopPropagation();
          moveDrag('pointer',event.pointerId,event.clientX,event.clientY);
        },{capture:true});
        const finishPointerDrag = (event) => {
          const drag = this[stateKey];
          if (!drag || drag.source !== 'pointer' || drag.inputId !== event.pointerId) return;
          event.preventDefault();
          event.stopPropagation();
          const moved = finishDrag('pointer',event.pointerId);
          try { target.releasePointerCapture(event.pointerId); } catch (_error) {}
          if (kind === 'compass' && event.type === 'pointerup' && !moved) this._openCompassPicker();
        };
        target.addEventListener('pointerup',finishPointerDrag,{capture:true});
        target.addEventListener('pointercancel',finishPointerDrag,{capture:true});

        // V4.09.05 – echter Touch-Fallback. Android/HA-WebView kann Pointer-Capture
        // im nativen <dialog> verlieren, obwohl Tap/Toggle weiterhin funktioniert.
        // Touch Events bleiben dagegen über die komplette Geste an dasselbe Target
        // gebunden. passive:false ist zwingend, damit Leaflet/Browser-Panning sicher
        // unterdrückt und das Instrument selbst verschoben wird.
        const findTouch = (touchList,inputId = null) => {
          if (!touchList) return null;
          for (let index=0;index<touchList.length;index+=1) {
            const touch = touchList[index];
            if (inputId == null || touch.identifier === inputId) return touch;
          }
          return null;
        };
        target.addEventListener('touchstart',(event) => {
          if (target.hidden) return;
          const touch = findTouch(event.changedTouches) || findTouch(event.touches);
          if (!touch) return;
          event.preventDefault();
          event.stopPropagation();
          // Falls derselbe Finger vorher bereits pointerdown ausgelöst hat, übernimmt
          // bewusst der robuste Touchpfad und der Pointerpfad wird danach ignoriert.
          startDrag('touch',touch.identifier,touch.clientX,touch.clientY);
        },{passive:false,capture:true});
        target.addEventListener('touchmove',(event) => {
          const drag = this[stateKey];
          if (!drag || drag.source !== 'touch') return;
          const touch = findTouch(event.touches,drag.inputId) || findTouch(event.changedTouches,drag.inputId);
          if (!touch) return;
          event.preventDefault();
          event.stopPropagation();
          moveDrag('touch',drag.inputId,touch.clientX,touch.clientY);
        },{passive:false,capture:true});
        const finishTouchDrag = (event) => {
          const drag = this[stateKey];
          if (!drag || drag.source !== 'touch') return;
          const changedTouch = findTouch(event.changedTouches,drag.inputId);
          if (event.type === 'touchend' && !changedTouch) return;
          event.preventDefault();
          event.stopPropagation();
          const moved = finishDrag('touch',drag.inputId);
          if (kind === 'compass' && event.type === 'touchend' && !moved) this._openCompassPicker();
        };
        target.addEventListener('touchend',finishTouchDrag,{passive:false,capture:true});
        target.addEventListener('touchcancel',finishTouchDrag,{passive:false,capture:true});
      };
      bindMapInstrumentDrag(overlay,'compass');
      bindMapInstrumentDrag(medallionOverlay,'medallion');

      const mapLocationDragBounds = () => {
        const card = this.shadow?.getElementById('map-card');
        const mapEl = this.shadow?.getElementById('map');
        if (!card || !mapEl || !locationOverlay) return null;
        const cardRect = card.getBoundingClientRect();
        const mapRect = mapEl.getBoundingClientRect();
        const inset = 10;
        const minLeft = Math.max(0,mapRect.left-cardRect.left+inset);
        const minTop = Math.max(0,mapRect.top-cardRect.top+inset);
        const maxLeft = Math.max(minLeft,mapRect.right-cardRect.left-locationOverlay.offsetWidth-inset);
        const maxTop = Math.max(minTop,mapRect.bottom-cardRect.top-locationOverlay.offsetHeight-inset);
        return {minLeft,minTop,maxLeft,maxTop};
      };
      const startLocationDrag = (source,inputId,clientX,clientY) => {
        if (!locationOverlay || locationOverlay.hidden) return;
        this._mapLocationDragState = {
          source,inputId,startX:clientX,startY:clientY,
          startLeft:locationOverlay.offsetLeft,startTop:locationOverlay.offsetTop,moved:false
        };
        locationOverlay.classList.add('dragging');
      };
      const moveLocationDrag = (source,inputId,clientX,clientY) => {
        const drag = this._mapLocationDragState;
        if (!drag || drag.source !== source || drag.inputId !== inputId) return false;
        const dx = clientX-drag.startX,dy = clientY-drag.startY;
        if (!drag.moved && Math.hypot(dx,dy) < 5) return false;
        drag.moved = true;
        const bounds = mapLocationDragBounds();
        if (!bounds) return false;
        locationOverlay.style.left = `${clamp(drag.startLeft+dx,bounds.minLeft,bounds.maxLeft)}px`;
        locationOverlay.style.top = `${clamp(drag.startTop+dy,bounds.minTop,bounds.maxTop)}px`;
        this._scheduleOpenLocationDropdownPosition();
        return true;
      };
      const finishLocationDrag = (source,inputId,{tap=false}={}) => {
        const drag = this._mapLocationDragState;
        if (!drag || drag.source !== source || drag.inputId !== inputId) return false;
        const moved = !!drag.moved;
        const bounds = mapLocationDragBounds();
        if (moved && bounds) {
          this._mapLocationPosition = {
            x:bounds.maxLeft>bounds.minLeft ? clamp((locationOverlay.offsetLeft-bounds.minLeft)/(bounds.maxLeft-bounds.minLeft),0,1) : 0,
            y:bounds.maxTop>bounds.minTop ? clamp((locationOverlay.offsetTop-bounds.minTop)/(bounds.maxTop-bounds.minTop),0,1) : 0
          };
          this._persistMapLocationPosition();
          this._mapLocationSuppressClickUntil = performance.now()+350;
        }
        this._mapLocationDragState = null;
        locationOverlay?.classList.remove('dragging');
        this._scheduleOpenLocationDropdownPosition();
        if (!moved && tap && locationMainButton) setTimeout(() => locationMainButton.click(),0);
        return moved;
      };

      locationOverlay?.addEventListener('pointerdown',(event) => {
        if (locationOverlay.hidden || event.isPrimary === false || event.pointerType === 'touch' || (event.pointerType === 'mouse' && event.button !== 0)) return;
        // V4.09.11 – der Overlay-Drag darf den Desktop-Klick auf die Standort-Pille
        // nicht verschlucken. Den nativen Klick unterdrücken und bei einer echten
        // Tap/Klick-Geste nach pointerup genau einmal kontrolliert auslösen.
        event.preventDefault();
        event.stopPropagation();
        startLocationDrag('pointer',event.pointerId,event.clientX,event.clientY);
        try { locationOverlay.setPointerCapture(event.pointerId); } catch (_error) {}
      },{capture:true});
      locationOverlay?.addEventListener('pointermove',(event) => {
        const moved = moveLocationDrag('pointer',event.pointerId,event.clientX,event.clientY);
        if (!moved) return;
        event.preventDefault();event.stopPropagation();
      },{capture:true});
      const finishLocationPointer = (event) => {
        const drag = this._mapLocationDragState;
        if (!drag || drag.source !== 'pointer' || drag.inputId !== event.pointerId) return;
        event.preventDefault();event.stopPropagation();
        finishLocationDrag('pointer',event.pointerId,{tap:true});
        try { locationOverlay.releasePointerCapture(event.pointerId); } catch (_error) {}
      };
      locationOverlay?.addEventListener('pointerup',finishLocationPointer,{capture:true});
      locationOverlay?.addEventListener('pointercancel',finishLocationPointer,{capture:true});

      const locationTouchById = (list,id=null) => {
        if (!list) return null;
        for (let index=0;index<list.length;index+=1) {
          const touch=list[index];
          if (id==null || touch.identifier===id) return touch;
        }
        return null;
      };
      locationOverlay?.addEventListener('touchstart',(event) => {
        if (locationOverlay.hidden) return;
        const touch=locationTouchById(event.changedTouches) || locationTouchById(event.touches);
        if (!touch) return;
        event.preventDefault();event.stopPropagation();
        startLocationDrag('touch',touch.identifier,touch.clientX,touch.clientY);
      },{passive:false,capture:true});
      locationOverlay?.addEventListener('touchmove',(event) => {
        const drag=this._mapLocationDragState;
        if (!drag || drag.source!=='touch') return;
        const touch=locationTouchById(event.touches,drag.inputId) || locationTouchById(event.changedTouches,drag.inputId);
        if (!touch) return;
        event.preventDefault();event.stopPropagation();
        moveLocationDrag('touch',drag.inputId,touch.clientX,touch.clientY);
      },{passive:false,capture:true});
      const finishLocationTouch = (event) => {
        const drag=this._mapLocationDragState;
        if (!drag || drag.source!=='touch') return;
        if (event.type==='touchend' && !locationTouchById(event.changedTouches,drag.inputId)) return;
        event.preventDefault();event.stopPropagation();
        finishLocationDrag('touch',drag.inputId,{tap:event.type==='touchend'});
      };
      locationOverlay?.addEventListener('touchend',finishLocationTouch,{passive:false,capture:true});
      locationOverlay?.addEventListener('touchcancel',finishLocationTouch,{passive:false,capture:true});

      this._syncMapDisplayUi();
      if (this._mapWindowMode) {
        queueMicrotask(() => this._setMapDisplayMode('fullscreen',{persist:false,remember:false,closeMenu:true}));
      } else if (['large','fullscreen'].includes(this._mapDisplayMode)) {
        queueMicrotask(() => this._setMapDisplayMode(this._mapDisplayMode,{persist:false,remember:false,closeMenu:true}));
      }
    },

};});

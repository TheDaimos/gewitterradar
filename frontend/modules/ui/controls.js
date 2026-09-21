import { defineModule } from "../core/runtime.js?v=41002";
export const MODULE_META=Object.freeze({
  "id": "ui.controls",
  "version": "1.1.0",
  "group": "Oberfläche",
  "function": "Bedienbindungen",
  "subfunctions": [
    "Klick",
    "Touch",
    "Formulare",
    "Menüaktionen"
  ],
  "file": "modules/ui/controls.js"
});
export const installControls=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _bindControls() {
      this._bindMapDisplayControls();
      this.shadow.getElementById('settings-about')?.addEventListener('click', () => this._openAbout(true));
      this.shadow.getElementById('settings-help')?.addEventListener('click', () => this._openHelp());
      const obsSlider = this.shadow.getElementById('observation-slider');
      const stormSlider = this.shadow.getElementById('storm-slider');
      const dangerSlider = this.shadow.getElementById('danger-slider');
      const modeToggle = this.shadow.getElementById('mode-toggle');
      const deviceToggle = this.shadow.getElementById('device-toggle');
      const animationToggle = this.shadow.getElementById('animation-toggle');
      const statusChip = this.shadow.getElementById('status-chip');
      const settingsOpen = this.shadow.getElementById('settings-open');
      const settingsBackdrop = this.shadow.getElementById('settings-backdrop');
      const settingsDialog = this.shadow.getElementById('settings-dialog');
      const settingsClose = this.shadow.getElementById('settings-close');
      const releaseHistoryBadge = this.shadow.getElementById('app-version-badge');
      const releaseHistoryBackdrop = this.shadow.getElementById('release-history-backdrop');
      const releaseHistoryDialog = this.shadow.getElementById('release-history-dialog');
      const releaseHistoryClose = this.shadow.getElementById('release-history-close');
      const releaseHistoryLanguageButtons = [...this.shadow.querySelectorAll('[data-release-history-language]')];
      const settingsAnimationToggle = this.shadow.getElementById('settings-animation-toggle');
      const settingsTestsToggle = this.shadow.getElementById('settings-tests-toggle');
      const settingsCompassCalibrationToggle = this.shadow.getElementById('settings-compass-calibration-toggle');
      const settingsMedallionCalibrationToggle = this.shadow.getElementById('settings-medallion-calibration-toggle');
      const settingsDiagnosticsToggle = this.shadow.getElementById('settings-diagnostics-toggle');
      const settingsRadiiToggle = this.shadow.getElementById('settings-radii-toggle');
      const settingsClusterResolutionButton = this.shadow.getElementById('settings-cluster-resolution-button');
      const settingsClusterResolutionCurrent = this.shadow.getElementById('settings-cluster-resolution-current');
      const clusterResolutionDropdown = this.shadow.getElementById('cluster-resolution-dropdown');
      const settingsClusterJumpSelector = this.shadow.getElementById('settings-cluster-jump-selector');
      const settingsClusterJumpSeconds = this.shadow.getElementById('settings-cluster-jump-seconds');
      const settingsClusterJumpInfinite = this.shadow.getElementById('settings-cluster-jump-infinite');
      const settingsAuraToggle = this.shadow.getElementById('settings-aura-toggle');
      const settingsAuraWidth = this.shadow.getElementById('settings-aura-width');
      const settingsAuraIntensity = this.shadow.getElementById('settings-aura-intensity');
      const settingsAuraSection = this.shadow.getElementById('settings-aura-section');
      const settingsRadiiSection = this.shadow.getElementById('settings-radii-section');
      const settingsLocationButton = this.shadow.getElementById('settings-location-button');
      const locationDropdown = this.shadow.getElementById('location-dropdown');
      let locationDropdownAnchor = null;
      const settingsLocationMainToggle = this.shadow.getElementById('settings-location-main-toggle');
      const locationMainButton = this.shadow.getElementById('location-main-button');
      const settingsLanguageButton = this.shadow.getElementById('settings-language-button');
      const languageDropdown = this.shadow.getElementById('language-dropdown');
      const settingsDistanceUnitButtons = [...this.shadow.querySelectorAll('[data-distance-unit]')];

      const settingsObsMinus = this.shadow.getElementById('settings-observation-minus');
      const settingsObsPlus = this.shadow.getElementById('settings-observation-plus');
      const settingsStormMinus = this.shadow.getElementById('settings-storm-minus');
      const settingsStormPlus = this.shadow.getElementById('settings-storm-plus');
      const settingsDangerMinus = this.shadow.getElementById('settings-danger-minus');
      const settingsDangerPlus = this.shadow.getElementById('settings-danger-plus');

      const observationInput = this.shadow.getElementById('observation-input');
      const stormInput = this.shadow.getElementById('storm-input');
      const dangerInput = this.shadow.getElementById('danger-input');

      const settingsObsInput = this.shadow.getElementById('settings-observation-input');
      const settingsStormInput = this.shadow.getElementById('settings-storm-input');
      const settingsDangerInput = this.shadow.getElementById('settings-danger-input');

      const radiusKeypadBackdrop = this.shadow.getElementById('radius-keypad-backdrop');
      const radiusKeypadDialog = this.shadow.getElementById('radius-keypad-dialog');
      const radiusKeypadTitle = this.shadow.getElementById('radius-keypad-title');
      const radiusKeypadNumber = this.shadow.getElementById('radius-keypad-number');
      const radiusKeypadUnit = this.shadow.querySelector('.radius-keypad-unit');
      const radiusKeypadLimit = this.shadow.getElementById('radius-keypad-limit');
      const radiusKeypadGrid = this.shadow.getElementById('radius-keypad-grid');
      const radiusKeypadCancel = this.shadow.getElementById('radius-keypad-cancel');
      const radiusKeypadApply = this.shadow.getElementById('radius-keypad-apply');

      const settingsObsSlider = this.shadow.getElementById('settings-observation-slider');
      const settingsStormSlider = this.shadow.getElementById('settings-storm-slider');
      const settingsDangerSlider = this.shadow.getElementById('settings-danger-slider');
      const mapGrouped = this.shadow.getElementById('map-mode-grouped');
      const mapIndividual = this.shadow.getElementById('map-mode-individual');
      const mapRecenter = this.shadow.getElementById('map-recenter');
      const mapStrikeTarget = this.shadow.getElementById('map-strike-target');
      const recentRadiusButtons = [...this.shadow.querySelectorAll('[data-recent-radius-filter]')];
      this.shadow.getElementById('compass-design-prev')?.addEventListener('click',()=>this._stepCompassDesign(-1));
      this.shadow.getElementById('compass-design-next')?.addEventListener('click',()=>this._stepCompassDesign(1));
      this.shadow.getElementById('compass-instrument')?.addEventListener('click',(event) => {
        if (this._compassPickerDialog?.open || this._mapDisplayMode === 'fullscreen') return;
        event.preventDefault(); event.stopPropagation();
        this._openCompassPicker();
      });
      this.shadow.getElementById('selector-frame-prev')?.addEventListener('click',()=>this._stepCompassSelectorFrame(-1));
      this.shadow.getElementById('selector-frame-next')?.addEventListener('click',()=>this._stepCompassSelectorFrame(1));
      const selectorFrameImage=this.shadow.getElementById('compass-selector-frame-image');
      selectorFrameImage?.addEventListener('load',()=>this._setCompassSelectorAssetState('compass-design-selector',true));
      selectorFrameImage?.addEventListener('error',()=>this._setCompassSelectorAssetState('compass-design-selector',false));
      const settingsSelectorFrameImage=this.shadow.getElementById('settings-selector-frame-image');
      settingsSelectorFrameImage?.addEventListener('load',()=>this._setCompassSelectorAssetState('settings-selector-preview',true));
      settingsSelectorFrameImage?.addEventListener('error',()=>this._setCompassSelectorAssetState('settings-selector-preview',false));
      this._syncCompassSelectorFrame();

      const previewRadius = (kind, value) => {
        const obsValue = finiteNumber(obsSlider?.value);
        const stormValue = finiteNumber(stormSlider?.value);
        const dangerValue = finiteNumber(dangerSlider?.value);

        if (kind === 'observation') {
          this._setObservationUi(value);
          this._setObservationRadiusVisual(value);

          const nextStorm = stormValue != null ? Math.min(stormValue,value) : value;
          if (stormSlider && stormValue != null && stormValue > value) {
            stormSlider.value = String(nextStorm);
            this._setStormUi(nextStorm);
            this._setStormRadiusVisual(nextStorm);
          }

          const effectiveStorm = stormValue != null ? Math.min(stormValue,value) : value;
          if (dangerSlider && dangerValue != null && dangerValue > effectiveStorm) {
            dangerSlider.value = String(effectiveStorm);
            this._setDangerUi(effectiveStorm);
            this._setDangerRadiusVisual(effectiveStorm);
          }
        } else if (kind === 'storm') {
          const helperMin = finiteNumber(this._hass?.states?.[this._stormEntity()]?.attributes?.min) ?? 1;
          const stormMin = Math.max(5,helperMin);
          const upper = obsValue != null ? obsValue : value;
          const capped = clamp(value,Math.min(stormMin,upper),upper);
          stormSlider.value = String(capped);
          this._setStormUi(capped);
          this._setStormRadiusVisual(capped);

          if (dangerSlider && dangerValue != null && dangerValue > capped) {
            dangerSlider.value = String(capped);
            this._setDangerUi(capped);
            this._setDangerRadiusVisual(capped);
          }
        } else {
          const maxDanger = stormValue != null
            ? (obsValue != null ? Math.min(stormValue,obsValue) : stormValue)
            : obsValue;
          const capped = maxDanger != null ? Math.min(value,maxDanger) : value;
          dangerSlider.value = String(capped);
          this._setDangerUi(capped);
          this._setDangerRadiusVisual(capped);
        }
      };

      obsSlider.addEventListener('input', () => {
        const value = finiteNumber(obsSlider.value);
        if (value != null) previewRadius('observation', value);
      });
      obsSlider.addEventListener('change', () => {
        const value = finiteNumber(obsSlider.value);
        if (value == null) return;

        const stormValue = finiteNumber(stormSlider.value);
        const dangerValue = finiteNumber(dangerSlider.value);
        const storedStorm = finiteNumber(this._hass?.states?.[this._stormEntity()]?.state) ?? stormValue;
        const storedDanger = finiteNumber(this._hass?.states?.[this._dangerEntity()]?.state) ?? dangerValue;
        const nextStorm = storedStorm != null && storedStorm > value ? value : storedStorm;
        const maxDanger = nextStorm != null ? Math.min(nextStorm,value) : value;
        if (storedDanger != null && storedDanger > maxDanger) {
          this._setInputNumber(this._dangerEntity(), maxDanger);
        }

        if (storedStorm != null && storedStorm > value) {
          this._setInputNumber(this._stormEntity(), value);
        }
        this._setInputNumber(this._observationEntity(), value);
      });

      stormSlider.addEventListener('input', () => {
        const value = finiteNumber(stormSlider.value);
        if (value != null) previewRadius('storm', value);
      });
      stormSlider.addEventListener('change', () => {
        const obsValue = finiteNumber(obsSlider.value);
        const dangerValue = finiteNumber(dangerSlider.value);
        const helperMin = finiteNumber(this._hass?.states?.[this._stormEntity()]?.attributes?.min) ?? 1;
        const stormMin = Math.max(5,helperMin);
        let value = finiteNumber(stormSlider.value);
        if (value == null) return;
        const upper = obsValue != null ? obsValue : value;
        value = clamp(value,Math.min(stormMin,upper),upper);
        stormSlider.value = String(value);

        if (dangerValue != null && dangerValue > value) {
          this._setInputNumber(this._dangerEntity(), value);
        }
        this._setInputNumber(this._stormEntity(), value);
      });

      dangerSlider.addEventListener('input', () => {
        const value = finiteNumber(dangerSlider.value);
        if (value != null) previewRadius('danger', value);
      });
      dangerSlider.addEventListener('change', () => {
        const obsValue = finiteNumber(obsSlider.value);
        const stormValue = finiteNumber(stormSlider.value);
        let value = finiteNumber(dangerSlider.value);
        if (value == null) return;

        const maxDanger = stormValue != null
          ? (obsValue != null ? Math.min(stormValue,obsValue) : stormValue)
          : obsValue;

        if (maxDanger != null) value = Math.min(value,maxDanger);
        this._setInputNumber(this._dangerEntity(), value);
      });

      this.shadow.getElementById('observation-minus').addEventListener('click', () => this._stepRadius('observation', -1));
      this.shadow.getElementById('observation-plus').addEventListener('click', () => this._stepRadius('observation', 1));
      this.shadow.getElementById('storm-minus').addEventListener('click', () => this._stepRadius('storm', -1));
      this.shadow.getElementById('storm-plus').addEventListener('click', () => this._stepRadius('storm', 1));
      this.shadow.getElementById('danger-minus').addEventListener('click', () => this._stepRadius('danger', -1));
      this.shadow.getElementById('danger-plus').addEventListener('click', () => this._stepRadius('danger', 1));

      // V3.99317 – auch in der Hauptansicht öffnet ein Tipp auf den KM-Wert
      // denselben eigenen Ziffernblock wie im Einstellungsmenü.
      observationInput?.addEventListener('click',() => openRadiusKeypad('observation',observationInput));
      stormInput?.addEventListener('click',() => openRadiusKeypad('storm',stormInput));
      dangerInput?.addEventListener('click',() => openRadiusKeypad('danger',dangerInput));

      // V3.99712 – die drei Radiuswerte oben rechts in der Karte sind direkte
      // Einstiege in denselben manuellen Ziffernblock. Keine zweite Eingabelogik.
      [
        ['map-observation-radius','observation'],
        ['map-storm-radius','storm'],
        ['map-danger-radius','danger']
      ].forEach(([id,kind]) => {
        const target = this.shadow.getElementById(id);
        if (!target) return;
        const activate = () => openRadiusKeypad(kind,target);
        target.addEventListener('click',activate);
        target.addEventListener('keydown',(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          activate();
        });
      });

      modeToggle.addEventListener('click', () => {
        if (!this._hass) return;
        this._toggleSetting(this._modeEntity());
      });

      animationToggle.addEventListener('click', () => {
        if (!this._hass) return;
        this._toggleSetting(this._animationEntity());
      });

      // V3.91 – eigener Ziffernblock für die direkte Radius-Eingabe.
      // Es wird absichtlich KEIN Text-/Number-Input fokussiert. Dadurch öffnet
      // iPadOS keine Bildschirmtastatur und das Eingabefenster bleibt vollständig sichtbar.
      let radiusKeypadKind = null;
      let radiusKeypadBuffer = '';
      let radiusKeypadReplaceOnNextDigit = true;
      let radiusKeypadReturnTarget = null;

      const radiusKeypadMeta = (kind) => {
        const obsState = this._hass?.states?.[this._observationEntity()];
        const stormState = this._hass?.states?.[this._stormEntity()];
        const dangerState = this._hass?.states?.[this._dangerEntity()];
        const obs = this._radiusUiValue('observation',finiteNumber(obsState?.state));
        const storm = this._radiusUiValue('storm',finiteNumber(stormState?.state));

        if (kind === 'observation') {
          return {
            title:this._t('radius.observation_enter'),
            min:finiteNumber(obsState?.attributes?.min) ?? 10,
            max:finiteNumber(obsState?.attributes?.max) ?? 1000
          };
        }
        if (kind === 'storm') {
          const min = Math.max(5,finiteNumber(stormState?.attributes?.min) ?? 1);
          const helperMax = finiteNumber(stormState?.attributes?.max) ?? 1000;
          return {
            title:this._t('radius.storm_enter'),
            min,
            max:obs != null ? Math.min(helperMax,obs) : helperMax
          };
        }
        const min = finiteNumber(dangerState?.attributes?.min) ?? 1;
        const helperMax = finiteNumber(dangerState?.attributes?.max) ?? 250;
        const parentMax = storm != null ? storm : obs;
        return {
          title:this._t('radius.danger_enter'),
          min,
          max:parentMax != null ? Math.min(helperMax,parentMax) : helperMax
        };
      };

      const renderRadiusKeypad = () => {
        if (!radiusKeypadNumber) return;
        radiusKeypadNumber.textContent = radiusKeypadBuffer || '–';
      };

      const closeRadiusKeypad = (returnFocus = true) => {
        const returnTarget = radiusKeypadReturnTarget;
        radiusKeypadBackdrop?.classList.remove('open');
        radiusKeypadBackdrop?.setAttribute('aria-hidden','true');
        radiusKeypadKind = null;
        radiusKeypadBuffer = '';
        radiusKeypadReplaceOnNextDigit = true;
        radiusKeypadReturnTarget = null;
        if (returnFocus) returnTarget?.focus?.({ preventScroll:true });
      };

      const openRadiusKeypad = (kind,returnTarget = null) => {
        if (!this._hass || !['observation','storm','danger'].includes(kind)) return;
        const stateCurrent = kind === 'observation'
          ? this._observationRadiusValue()
          : kind === 'storm'
            ? this._stormRadiusValue()
            : this._dangerRadiusValue();
        const current = this._radiusUiValue(kind,stateCurrent);
        const meta = radiusKeypadMeta(kind);

        radiusKeypadKind = kind;
        radiusKeypadReturnTarget = returnTarget;
        const currentDisplay = this._formatRadiusDistance(current);
        radiusKeypadBuffer = currentDisplay.value;
        radiusKeypadReplaceOnNextDigit = true;
        radiusKeypadDialog?.classList.remove('observation','storm','danger');
        radiusKeypadDialog?.classList.add(kind);
        if (radiusKeypadTitle) radiusKeypadTitle.textContent = meta.title;
        if (radiusKeypadUnit) radiusKeypadUnit.textContent = currentDisplay.unit;
        if (radiusKeypadLimit) radiusKeypadLimit.textContent = this._radiusRangeText(meta.min,meta.max);
        const clearOrDecimal = radiusKeypadGrid?.querySelector?.('[data-radius-key="clear"],[data-radius-key="decimal"]');
        if (clearOrDecimal) {
          const miles = this._distanceUnitValue() === 'MI';
          clearOrDecimal.dataset.radiusKey = miles ? 'decimal' : 'clear';
          clearOrDecimal.textContent = miles ? '.' : this._t('keypad.delete');
          clearOrDecimal.setAttribute('aria-label',miles ? '.' : this._t('keypad.delete'));
        }
        renderRadiusKeypad();

        if (this._mapDisplayMode === 'fullscreen') this._setFullscreenAuxiliaryOverlayHost(true);
        radiusKeypadBackdrop?.classList.add('open');
        radiusKeypadBackdrop?.setAttribute('aria-hidden','false');
        // Fokus ausschließlich auf einen Button – niemals auf ein Eingabefeld.
        radiusKeypadGrid?.querySelector?.('[data-radius-key="5"]')?.focus?.({ preventScroll:true });
      };

      const pressRadiusKeypad = (key) => {
        if (!radiusKeypadKind) return;
        if (/^[0-9]$/.test(key)) {
          if (radiusKeypadReplaceOnNextDigit) {
            radiusKeypadBuffer = key;
            radiusKeypadReplaceOnNextDigit = false;
          } else {
            const candidate = `${radiusKeypadBuffer}${key}`.replace(/^0+(?=\d)/,'');
            // Radien sind maximal dreistellig; 1000 km bleibt als vierstelliger
            // Beobachtungswert möglich, falls der Helper entsprechend erweitert ist.
            if (candidate.length <= (this._distanceUnitValue() === 'MI' ? 5 : 4)) radiusKeypadBuffer = candidate;
          }
        } else if (key === 'decimal') {
          if (!radiusKeypadBuffer.includes('.')) radiusKeypadBuffer = radiusKeypadBuffer ? `${radiusKeypadBuffer}.` : '0.';
          radiusKeypadReplaceOnNextDigit = false;
        } else if (key === 'clear') {
          radiusKeypadBuffer = '';
          radiusKeypadReplaceOnNextDigit = false;
        } else if (key === 'backspace') {
          radiusKeypadBuffer = radiusKeypadBuffer.slice(0,-1);
          radiusKeypadReplaceOnNextDigit = false;
        }
        renderRadiusKeypad();
      };

      const applyRadiusKeypad = () => {
        if (!radiusKeypadKind) return;
        const raw = finiteNumber(radiusKeypadBuffer);
        if (raw == null) return;
        const kind = radiusKeypadKind;
        const requestedKm = this._displayRadiusToKm(raw);
        if (requestedKm == null) return;
        const next = this._setRadiusDirect(kind,Math.round(requestedKm));
        if (next == null) return;

        const main = kind === 'observation' ? obsSlider : kind === 'storm' ? stormSlider : dangerSlider;
        if (main) main.value = String(next);
        syncPopupRadiusFromMain();
        closeRadiusKeypad(true);
      };

      radiusKeypadGrid?.addEventListener('click',(event) => {
        const button = event.target?.closest?.('[data-radius-key]');
        if (!button) return;
        event.preventDefault();
        event.stopPropagation();
        pressRadiusKeypad(button.dataset.radiusKey);
      });
      radiusKeypadCancel?.addEventListener('click',() => closeRadiusKeypad(true));
      radiusKeypadApply?.addEventListener('click',applyRadiusKeypad);
      radiusKeypadBackdrop?.addEventListener('click',(event) => {
        if (event.target === radiusKeypadBackdrop) closeRadiusKeypad(true);
      });
      radiusKeypadDialog?.addEventListener('click',(event) => event.stopPropagation());

      const CLUSTER_RESOLUTION_PROFILES = ['early','balanced','late','classic'];

      const closeClusterResolutionDropdown = (returnFocus = false) => {
        clusterResolutionDropdown?.classList.remove('open');
        settingsClusterResolutionButton?.setAttribute('aria-expanded','false');
        if (returnFocus) settingsClusterResolutionButton?.focus?.({preventScroll:true});
      };

      const positionClusterResolutionDropdown = () => {
        if (!settingsClusterResolutionButton || !clusterResolutionDropdown) return;
        const rect = settingsClusterResolutionButton.getBoundingClientRect();
        const margin = 8;
        const portraitCompact = !!window.matchMedia?.('(max-width:720px) and (orientation:portrait)')?.matches;
        const width = portraitCompact ? 168 : 176;
        const rightAlignedLeft = rect.right - width + 2;
        clusterResolutionDropdown.style.width = `${width}px`;
        clusterResolutionDropdown.style.left = `${clamp(Math.round(rightAlignedLeft),margin,Math.max(margin,window.innerWidth-width-margin))}px`;
        clusterResolutionDropdown.style.visibility = 'hidden';
        clusterResolutionDropdown.classList.add('open');
        const menuRect = clusterResolutionDropdown.getBoundingClientRect();
        const below = rect.bottom + 6;
        const above = rect.top - menuRect.height - 6;
        const top = below + menuRect.height <= window.innerHeight - margin ? below : Math.max(margin,above);
        clusterResolutionDropdown.style.top = `${top}px`;
        clusterResolutionDropdown.style.visibility = '';
      };

      const renderClusterResolutionDropdown = () => {
        if (!clusterResolutionDropdown) return;
        const selected = this._clusterResolutionProfileV40822 || 'balanced';
        const languageForLabels = this._languageValue?.() || 'Deutsch';
        const frag = document.createDocumentFragment();
        CLUSTER_RESOLUTION_PROFILES.forEach((profile) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = `language-option${profile === selected ? ' selected' : ''}`;
          button.dataset.clusterResolutionProfile = profile;
          button.setAttribute('role','option');
          button.setAttribute('aria-selected',profile === selected ? 'true' : 'false');
          const dot = document.createElement('i');
          dot.className = 'language-option-dot';
          dot.setAttribute('aria-hidden','true');
          const label = document.createElement('span');
          label.textContent = getClusterResolutionProfileLabel(profile,languageForLabels);
          button.append(dot,label);
          frag.appendChild(button);
        });
        clusterResolutionDropdown.replaceChildren(frag);
      };

      // V3.973 – custom language dropdown with gold active marker and dotted
      // separator before the three deliberately humorous dialect variants.
      const closeLanguageDropdown = (returnFocus = false) => {
        languageDropdown?.classList.remove('open');
        settingsLanguageButton?.setAttribute('aria-expanded','false');
        if (returnFocus) settingsLanguageButton?.focus?.({preventScroll:true});
      };

      const positionLanguageDropdown = () => {
        if (!settingsLanguageButton || !languageDropdown) return;
        const rect = settingsLanguageButton.getBoundingClientRect();
        const margin = 8;
        const portraitCompact = !!window.matchMedia?.('(max-width:720px) and (orientation:portrait)')?.matches;
        const width = Math.max(portraitCompact ? 190 : 220,Math.round(rect.width));
        const centeredLeft = rect.left + ((rect.width - width) / 2);
        languageDropdown.style.width = `${width}px`;
        languageDropdown.style.left = `${clamp(Math.round(centeredLeft),margin,Math.max(margin,window.innerWidth-width-margin))}px`;
        languageDropdown.style.visibility = 'hidden';
        languageDropdown.classList.add('open');
        const menuRect = languageDropdown.getBoundingClientRect();
        const below = rect.bottom + 6;
        const above = rect.top - menuRect.height - 6;
        const top = below + menuRect.height <= window.innerHeight - margin ? below : Math.max(margin,above);
        languageDropdown.style.top = `${top}px`;
        languageDropdown.style.visibility = '';
      };

      const renderLanguageDropdown = () => {
        if (!languageDropdown) return;
        const selected = this._languageValue();
        const frag = document.createDocumentFragment();
        let funSeparatorAdded = false;
        LANGUAGE_DEFINITIONS.forEach((entry) => {
          if (entry.group === 'fun' && !funSeparatorAdded) {
            const sep = document.createElement('div');
            sep.className = 'language-fun-separator';
            sep.setAttribute('role','separator');
            sep.setAttribute('aria-label',this._t('settings.language_fun_separator'));
            frag.appendChild(sep);
            funSeparatorAdded = true;
          }
          const button = document.createElement('button');
          button.type = 'button';
          button.className = `language-option${entry.value === selected ? ' selected' : ''}`;
          button.dataset.language = entry.value;
          button.setAttribute('role','option');
          button.setAttribute('aria-selected',entry.value === selected ? 'true' : 'false');
          const dot = document.createElement('i');
          dot.className = 'language-option-dot';
          dot.setAttribute('aria-hidden','true');
          const label = document.createElement('span');
          label.textContent = entry.value;
          button.append(dot,label);
          frag.appendChild(button);
        });
        languageDropdown.replaceChildren(frag);
      };

      settingsLanguageButton?.addEventListener('click',(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!this._hass?.states?.[this._languageEntity()]) return;
        const open = languageDropdown?.classList.contains('open');
        if (open) {
          closeLanguageDropdown(false);
          return;
        }
        closeClusterResolutionDropdown(false);
        closeLocationDropdown?.(false);
        renderLanguageDropdown();
        positionLanguageDropdown();
      });

      languageDropdown?.addEventListener('click',(event) => {
        const option = event.target?.closest?.('.language-option');
        const value = option?.dataset?.language;
        if (!value || !LANGUAGE_DEFINITIONS.some((entry) => entry.value === value)) return;
        event.preventDefault();
        event.stopPropagation();
        this._languagePreview = value;
        closeLanguageDropdown(false);
        this._selectSetting(this._languageEntity(),value);
        this._render();
      });



      settingsClusterResolutionButton?.addEventListener('click',(event) => {
        event.preventDefault();
        event.stopPropagation();
        const open = clusterResolutionDropdown?.classList.contains('open');
        if (open) {
          closeClusterResolutionDropdown(false);
          return;
        }
        closeLanguageDropdown(false);
        closeLocationDropdown?.(false);
        renderClusterResolutionDropdown();
        positionClusterResolutionDropdown();
      });

      clusterResolutionDropdown?.addEventListener('click',(event) => {
        const option = event.target?.closest?.('[data-cluster-resolution-profile]');
        const nextProfile = option?.dataset?.clusterResolutionProfile;
        if (!CLUSTER_RESOLUTION_PROFILES.includes(nextProfile)) return;
        event.preventDefault();
        event.stopPropagation();
        this._clusterResolutionProfileV40822 = nextProfile;
        try {
          localStorage.setItem('gewitterradar:v40822:cluster-resolution-profile',nextProfile);
        } catch (_error) {}
        closeClusterResolutionDropdown(false);
        this._resetStatusClusterBrowse?.();
        this._renderMapMarkers?.();
        this._render?.();
      });

      settingsDistanceUnitButtons.forEach((button) => {
        button.addEventListener('click',(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!this._hass?.states?.[this._distanceUnitEntity()]) return;
          const unit = String(button.dataset.distanceUnit || '').toUpperCase();
          if (!['KM','MI'].includes(unit)) return;
          this._distanceUnitPreview = unit;
          this._selectSetting(this._distanceUnitEntity(),unit);
          this._render();
        });
      });

      // V3.99312 – stabiler eigener Bezugsstandort-Dropdown. Der Aufbau folgt
      // bewusst dem bewährten Sprachmenü, verwendet aber die blaue Standortfarbe.
      const closeLocationDropdown = (returnFocus = false) => {
        const focusTarget = locationDropdownAnchor;
        locationDropdown?.classList.remove('open','map-adaptive','multicolumn','open-up','open-down');
        if (locationDropdown) {
          ['column-count','column-gap','column-fill','height','overflow-x'].forEach(name => locationDropdown.style.removeProperty(name));
          locationDropdown.removeAttribute('data-columns');
          locationDropdown.removeAttribute('data-direction');
        }
        settingsLocationButton?.setAttribute('aria-expanded','false');
        locationMainButton?.setAttribute('aria-expanded','false');
        locationDropdownAnchor = null;
        if (returnFocus) focusTarget?.focus?.({preventScroll:true});
      };

      const positionLocationDropdown = (anchor = settingsLocationButton) => {
        if (!anchor || !locationDropdown) return;
        locationDropdownAnchor = anchor;
        this._locationDropdownAnchor = anchor;
        const rect = anchor.getBoundingClientRect();
        const margin = 8;
        const gap = 6;
        const columnGap = 8;
        const viewport = window.visualViewport;
        const viewportLeft = Number(viewport?.offsetLeft) || 0;
        const viewportTop = Number(viewport?.offsetTop) || 0;
        const viewportWidth = Number(viewport?.width) || window.innerWidth;
        const viewportHeight = Number(viewport?.height) || window.innerHeight;
        const viewportRight = viewportLeft + viewportWidth;
        const viewportBottom = viewportTop + viewportHeight;
        const portraitCompact = !!window.matchMedia?.('(max-width:720px) and (orientation:portrait)')?.matches;
        const fullscreenAnchor = anchor === locationMainButton
          && (this._mapDisplayMode === 'fullscreen' || this._mapWindowMode)
          && !!this.shadow?.getElementById('map-location-overlay')?.contains(anchor);

        locationDropdown.classList.remove('map-adaptive','multicolumn','open-up','open-down');
        ['column-count','column-gap','column-fill','height','overflow-x'].forEach(name => locationDropdown.style.removeProperty(name));
        locationDropdown.removeAttribute('data-columns');
        locationDropdown.removeAttribute('data-direction');

        const ipadLike = this._isIPadLike();
        const androidLike = this._isAndroidLike();
        // V4.09.12 – Android bekommt im Vollbild bewusst fast die gesamte
        // verfügbare Breite (bis 420 px) statt der früheren 190 px. Damit sind
        // gespeicherte Orte auch auf schmalen Telefonen vollständig lesbar.
        const androidReadableWidth = Math.min(420,Math.max(300,viewportWidth-(margin*2)));
        const adaptiveColumnMinWidth = fullscreenAnchor
          ? (androidLike ? androidReadableWidth : (viewportWidth<=720 ? 260 : (ipadLike ? 320 : 340)))
          : (portraitCompact ? 190 : 220);
        const baseWidth = Math.min(
          Math.max(adaptiveColumnMinWidth,Math.round(rect.width)),
          Math.max(1,viewportWidth-(margin*2))
        );
        const baseCenteredLeft = rect.left + ((rect.width-baseWidth)/2);
        const baseMinLeft = viewportLeft+margin;
        const baseMaxLeft = Math.max(baseMinLeft,viewportRight-baseWidth-margin);
        locationDropdown.style.width = `${baseWidth}px`;
        locationDropdown.style.left = `${clamp(Math.round(baseCenteredLeft),baseMinLeft,baseMaxLeft)}px`;
        locationDropdown.style.visibility = 'hidden';

        const viewportCap = Math.max(1,Math.floor(viewportHeight*.88));
        locationDropdown.style.maxHeight = fullscreenAnchor ? 'none' : `${viewportCap}px`;
        locationDropdown.classList.add('open');
        settingsLocationButton?.setAttribute('aria-expanded',anchor===settingsLocationButton?'true':'false');
        locationMainButton?.setAttribute('aria-expanded',anchor===locationMainButton?'true':'false');

        const belowAvailable = Math.max(1,viewportBottom-rect.bottom-gap-margin);
        const aboveAvailable = Math.max(1,rect.top-viewportTop-gap-margin);

        if (!fullscreenAnchor) {
          const measuredHeight = Math.min(locationDropdown.getBoundingClientRect().height,viewportCap);
          const openBelow = measuredHeight<=belowAvailable ? true : measuredHeight<=aboveAvailable ? false : belowAvailable>=aboveAvailable;
          const available = openBelow ? belowAvailable : aboveAvailable;
          const maxHeight = Math.max(1,Math.min(viewportCap,Math.floor(available)));
          locationDropdown.style.maxHeight = `${maxHeight}px`;
          const finalHeight = Math.min(locationDropdown.getBoundingClientRect().height,maxHeight);
          const top = openBelow ? rect.bottom+gap : Math.max(viewportTop+margin,rect.top-gap-finalHeight);
          locationDropdown.style.top = `${Math.round(top)}px`;
          locationDropdown.style.visibility = '';
          return;
        }

        // V4.09.06 – adaptive Vollbildlogik. Zuerst wird die reale einspaltige
        // Inhaltshöhe gemessen. Danach bestimmen Pillenposition UND verfügbarer
        // Raum gemeinsam die Richtung und die nötige Spaltenzahl.
        locationDropdown.classList.add('map-adaptive');
        locationDropdown.style.maxHeight = 'none';
        locationDropdown.style.height = 'auto';
        locationDropdown.style.overflowY = 'visible';
        const naturalHeight = Math.max(1,Math.ceil(locationDropdown.scrollHeight || locationDropdown.getBoundingClientRect().height));
        const centerY = rect.top+(rect.height/2);
        const verticalRatio = clamp((centerY-viewportTop)/Math.max(1,viewportHeight),0,1);
        const inMiddle = verticalRatio>=.34 && verticalRatio<=.66;
        let direction = verticalRatio<.34 ? 'down' : verticalRatio>.66 ? 'up' : (belowAvailable>=aboveAvailable?'down':'up');
        let available = direction==='down' ? belowAvailable : aboveAvailable;
        const otherAvailable = direction==='down' ? aboveAvailable : belowAvailable;

        const maxColumnsByWidth = Math.max(1,Math.min(
          androidLike && viewportWidth < 860 ? 1 : 2,
          Math.floor((Math.max(1,viewportWidth-(margin*2))+columnGap)/(baseWidth+columnGap))
        ));
        const requiredForPreferred = Math.max(1,Math.ceil(naturalHeight/Math.max(1,available)));
        let columns = (inMiddle || naturalHeight>available) ? Math.max(2,requiredForPreferred) : 1;
        columns = Math.min(maxColumnsByWidth,columns);

        // Ist Mehrspaltigkeit aufgrund extrem schmaler Breite nicht möglich,
        // darf die Richtung auf die größere Seite wechseln, bevor gescrollt wird.
        if (columns===1 && naturalHeight>available && otherAvailable>available) {
          direction = direction==='down'?'up':'down';
          available = otherAvailable;
        }

        const totalWidth = columns>1
          ? Math.min(viewportWidth-(margin*2),(baseWidth*columns)+(columnGap*(columns-1)))
          : baseWidth;
        const centeredLeft = rect.left+((rect.width-totalWidth)/2);
        const minLeft = viewportLeft+margin;
        const maxLeft = Math.max(minLeft,viewportRight-totalWidth-margin);
        locationDropdown.style.width = `${Math.max(1,totalWidth)}px`;
        locationDropdown.style.left = `${clamp(Math.round(centeredLeft),minLeft,maxLeft)}px`;

        const maxHeight = Math.max(1,Math.min(viewportCap,Math.floor(available)));
        locationDropdown.style.maxHeight = `${maxHeight}px`;
        locationDropdown.style.overflowY = 'auto';
        if (columns>1) {
          locationDropdown.classList.add('multicolumn');
          locationDropdown.style.setProperty('column-count',String(columns));
          locationDropdown.style.setProperty('column-gap',`${columnGap}px`);
          locationDropdown.style.setProperty('column-fill','balance');
        }
        locationDropdown.classList.add(direction==='down'?'open-down':'open-up');
        locationDropdown.dataset.columns=String(columns);
        locationDropdown.dataset.direction=direction;

        const finalHeight = Math.min(locationDropdown.getBoundingClientRect().height,maxHeight);
        const top = direction==='down'
          ? Math.min(viewportBottom-margin-finalHeight,rect.bottom+gap)
          : Math.max(viewportTop+margin,rect.top-gap-finalHeight);
        locationDropdown.style.top = `${Math.round(top)}px`;
        locationDropdown.style.visibility = '';
      };
      this._positionLocationDropdown = positionLocationDropdown;

      const renderLocationDropdown = () => {
        if (!locationDropdown) return;
        const selected = this._locationOption();
        const options = this._locationOptions();
        const frag = document.createDocumentFragment();
        const text = v407Text();

        const appendHeader = (label) => {
          const node = document.createElement('div');
          node.className = 'location-section-label';
          node.textContent = label;
          frag.appendChild(node);
        };
        const appendEmpty = () => {
          const node = document.createElement('div');
          node.className = 'location-section-empty';
          node.textContent = '—';
          frag.appendChild(node);
        };
        const appendOption = (entityId) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = `location-option${entityId === selected ? ' selected' : ''}`;
          button.dataset.location = entityId;
          button.setAttribute('role','option');
          button.setAttribute('aria-selected',entityId === selected ? 'true' : 'false');
          const dot = document.createElement('i');
          dot.className = 'location-option-dot';
          dot.setAttribute('aria-hidden','true');
          const label = document.createElement('span');
          label.textContent = this._locationLabel(entityId);
          button.append(dot,label);
          frag.appendChild(button);
        };

        const people = options.filter((entityId) => entityId.startsWith('person.'));
        const zones = options.filter((entityId) => entityId.startsWith('zone.'));
        appendHeader(text.people);
        if (people.length) people.forEach(appendOption); else appendEmpty();
        appendHeader(text.zones);
        if (zones.length) zones.forEach(appendOption); else appendEmpty();

        const dividerBeforeSearch = document.createElement('div');
        dividerBeforeSearch.className = 'location-section-divider';
        frag.appendChild(dividerBeforeSearch);
        const search = document.createElement('button');
        search.type = 'button';
        search.className = 'location-search-action';
        search.innerHTML = '<span class="location-search-icon" aria-hidden="true">🔎</span><span></span>';
        search.querySelector('span:last-child').textContent = text.searchAction;
        frag.appendChild(search);

        const dividerBeforeSaved = document.createElement('div');
        dividerBeforeSaved.className = 'location-section-divider';
        frag.appendChild(dividerBeforeSaved);
        appendHeader(text.savedPlaces);
        const savedPlaces = Array.isArray(this._v407SavedPlaces) ? this._v407SavedPlaces : [];
        const removedPlaces = Array.isArray(this._v407RemovedPlaces) ? this._v407RemovedPlaces : [];
        const appendSavedRow = (place,{removed=false} = {}) => {
          const row = document.createElement('div');
          row.className = 'location-saved-row' + (removed ? ' removed' : '');
          const labelText = place.summary || place.displayLabel || place.name;
          if (removed) {
            const label = document.createElement('div');
            label.className = 'location-removed-copy';
            const icon = document.createElement('span');
            icon.className = 'location-removed-icon';
            icon.textContent = '○';
            icon.setAttribute('aria-hidden','true');
            const copy = document.createElement('span');
            copy.textContent = labelText;
            label.append(icon,copy);
            const restore = document.createElement('button');
            restore.type = 'button';
            restore.className = 'location-saved-restore';
            restore.dataset.savedPlaceUid = place.uid || '';
            restore.textContent = '↶';
            restore.title = text.restoreSaved;
            restore.setAttribute('aria-label',text.restoreSaved + ': ' + labelText);
            row.append(label,restore);
          } else {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'location-saved-option';
            button.dataset.savedPlaceUid = place.uid || '';
            const coordinateSaved = String(place.provider || '').trim().toLowerCase() === 'lat / lon';
            const savedIcon = document.createElement('span');
            savedIcon.setAttribute('aria-hidden','true');
            if (coordinateSaved) {
              savedIcon.className = 'location-saved-target';
              const targetImage = document.createElement('img');
              targetImage.src = V407_COORDINATE_TARGET_LIST_ICON;
              targetImage.alt = '';
              targetImage.draggable = false;
              savedIcon.appendChild(targetImage);
            } else {
              savedIcon.className = 'location-saved-star';
              savedIcon.textContent = '★';
            }
            const label = document.createElement('span');
            label.className = 'location-saved-copy';
            label.textContent = labelText;
            button.append(savedIcon,label);
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'location-saved-remove';
            remove.dataset.savedPlaceUid = place.uid || '';
            remove.textContent = '×';
            remove.title = text.removeSaved;
            remove.setAttribute('aria-label',text.removeSaved + ': ' + labelText);
            row.append(button,remove);
          }
          frag.appendChild(row);
        };
        if (savedPlaces.length) savedPlaces.forEach((place) => appendSavedRow(place));
        else {
          const savedEmpty = document.createElement('div');
          savedEmpty.className = 'location-section-empty';
          savedEmpty.textContent = this._v407SavedPlacesMissing ? text.savedSetup : text.savedEmpty;
          frag.appendChild(savedEmpty);
        }
        if (removedPlaces.length) {
          appendHeader(text.removedPlaces);
          removedPlaces.forEach((place) => appendSavedRow(place,{removed:true}));
        }
        locationDropdown.replaceChildren(frag);
      };


      const V407_LANGUAGE_LOCALES = Object.freeze({
        'Deutsch':'de-DE','English':'en','Dansk':'da-DK','Español':'es-ES','Français':'fr-FR','Nederlands':'nl-NL','Polski':'pl-PL','Português':'pt-PT','Svenska':'sv-SE','Italiano':'it-IT','Norsk bokmål':'nb-NO','Suomi':'fi-FI','Čeština':'cs-CZ','Ελληνικά':'el-GR','Magyar':'hu-HU','Boarisch':'de-DE','Plattdüütsch':'de-DE','Sächs’sch':'de-DE','Schwäbisch':'de-DE'
      });
      const V407_ISO_COUNTRY_CODES = 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
      const v407Locale = () => V407_LANGUAGE_LOCALES[this._languageValue()] || navigator.language || 'en';
      const V407_LOCATION_TEXTS = Object.freeze({"Deutsch":{"people":"Personen","zones":"Zonen","searchAction":"Ort suchen …","savedPlaces":"Gespeicherte Orte","savedEmpty":"Noch keine gespeicherten Orte","title":"Weltweite Ortssuche","query":"Ort / PLZ","country":"Land (optional)","search":"Suchen","close":"Schließen","queryPlaceholder":"z. B. Tromsø oder 27804","countryPlaceholder":"Land oder ISO-Code","searching":"Suche läuft …","noResults":"Kein passender Ort gefunden.","providerError":"Die Ortssuche ist derzeit nicht erreichbar.","invalidCountry":"Bitte ein Land aus der lokalen Vorschlagsliste wählen oder das Feld leeren.","use":"Übernehmen","save":"★ Speichern","saveTitle":"Ort dauerhaft in der lokalen Gewitterradar-Ortsliste speichern.","saving":"Ort wird gespeichert …","saved":"★ Gespeichert","savedOk":"wurde gespeichert.","savedDuplicate":"ist bereits gespeichert.","saveFailed":"Ort konnte nicht gespeichert werden.","savedSetup":"Zum Speichern fehlt die lokale Liste „Gewitterradar Orte“. Home Assistant: Einstellungen → Geräte & Dienste → Integration hinzufügen → „Local to-do“ suchen/auswählen → Liste exakt „Gewitterradar Orte“ nennen.","savedPlaceFallback":"Gespeicherter Ort","removedPlaces":"Entfernte Orte","removeSaved":"Gespeicherten Ort entfernen","restoreSaved":"Ort wiederherstellen","savedRestored":"wurde wiederhergestellt.","removeFailed":"Ort konnte nicht entfernt werden.","restoreFailed":"Ort konnte nicht wiederhergestellt werden.","using":"Bezugsstandort wird gesetzt …","used":"wird jetzt als Gewitterradar-Bezugsstandort verwendet.","backendMissing":"V4.07-Tracker-Service bzw. Dashboard-Package nicht gefunden.","useFailed":"Bezugsstandort konnte nicht gesetzt werden.","providerNote":"Geocoding: Open-Meteo / GeoNames · bei Bedarf OpenStreetMap Nominatim.","safety":"Wichtig: Ein neuer Gewitterradar-Bezugsstandort bestätigt noch nicht, dass Blitzortung bereits passende Live-Daten für diesen Bereich abonniert hat.","allCountries":"Alle Länder","countryFilters":"Länderfilter","resultSummary":"{results} Treffer in {countries} Ländern","homeCountry":"Heimatland","showMore":"Weitere {count} Treffer anzeigen","unknownCountry":"Unbekanntes Land"},"English":{"people":"People","zones":"Zones","searchAction":"Search place …","savedPlaces":"Saved places","savedEmpty":"No saved places yet","title":"Worldwide place search","query":"Place / postcode","country":"Country (optional)","search":"Search","close":"Close","queryPlaceholder":"e.g. Tromsø or 27804","countryPlaceholder":"Country or ISO code","searching":"Searching …","noResults":"No matching place found.","providerError":"Location search is currently unavailable.","invalidCountry":"Choose a country from the local suggestions or clear the field.","use":"Apply","save":"★ Save","saveTitle":"Save place permanently in the local Gewitterradar place list.","saving":"Saving place …","saved":"★ Saved","savedOk":"was saved.","savedDuplicate":"is already saved.","saveFailed":"Place could not be saved.","savedSetup":"The local “Gewitterradar Orte” list is missing. Home Assistant: Settings → Devices & services → Add integration → search/select “Local to-do” → name the list exactly “Gewitterradar Orte”.","savedPlaceFallback":"Saved place","removedPlaces":"Removed places","removeSaved":"Remove saved place","restoreSaved":"Restore place","savedRestored":"was restored.","removeFailed":"Place could not be removed.","restoreFailed":"Place could not be restored.","using":"Setting reference location …","used":"is now used as the Gewitterradar reference location.","backendMissing":"V4.07 tracker service or dashboard package not found.","useFailed":"Reference location could not be set.","providerNote":"Geocoding: Open-Meteo / GeoNames · OpenStreetMap Nominatim when needed.","safety":"Important: a new Gewitterradar reference location does not prove that Blitzortung already has matching live-data subscriptions for that area.","allCountries":"All countries","countryFilters":"Country filters","resultSummary":"{results} results in {countries} countries","homeCountry":"Home country","showMore":"Show {count} more results","unknownCountry":"Unknown country"},"Dansk":{"people":"Personer","zones":"Zoner","searchAction":"Søg sted …","savedPlaces":"Gemte steder","savedEmpty":"Ingen gemte steder endnu","title":"Global stedssøgning","query":"Sted / postnr.","country":"Land (valgfrit)","search":"Søg","close":"Luk","queryPlaceholder":"f.eks. Tromsø eller 27804","countryPlaceholder":"Land eller ISO-kode","searching":"Søger …","noResults":"Intet passende sted fundet.","providerError":"Stedssøgning er ikke tilgængelig lige nu.","invalidCountry":"Vælg et land fra de lokale forslag, eller ryd feltet.","use":"Anvend","save":"★ Gem","saveTitle":"Gem stedet permanent i den lokale Gewitterradar-stedliste.","saving":"Gemmer sted …","saved":"★ Gemt","savedOk":"blev gemt.","savedDuplicate":"er allerede gemt.","saveFailed":"Stedet kunne ikke gemmes.","savedSetup":"Den lokale liste “Gewitterradar Orte” mangler. Home Assistant: Indstillinger → Enheder og tjenester → Tilføj integration → søg/vælg “Local to-do” → navngiv listen præcist “Gewitterradar Orte”.","savedPlaceFallback":"Gemt sted","removedPlaces":"Fjernede steder","removeSaved":"Fjern gemt sted","restoreSaved":"Gendan sted","savedRestored":"blev gendannet.","removeFailed":"Stedet kunne ikke fjernes.","restoreFailed":"Stedet kunne ikke gendannes.","using":"Indstiller referencested …","used":"bruges nu som Gewitterradar-referencested.","backendMissing":"V4.07-tracker-tjenesten eller dashboardpakken blev ikke fundet.","useFailed":"Referencestedet kunne ikke indstilles.","providerNote":"Geokodning: Open-Meteo / GeoNames · OpenStreetMap Nominatim efter behov.","safety":"Vigtigt: Et nyt Gewitterradar-referencested beviser ikke, at Blitzortung allerede abonnerer på passende live-data for området.","allCountries":"Alle lande","countryFilters":"Landefiltre","resultSummary":"{results} resultater i {countries} lande","homeCountry":"Hjemland","showMore":"Vis {count} flere resultater","unknownCountry":"Ukendt land"},"Español":{"people":"Personas","zones":"Zonas","searchAction":"Buscar lugar …","savedPlaces":"Lugares guardados","savedEmpty":"Aún no hay lugares guardados","title":"Búsqueda mundial de lugares","query":"Lugar / código postal","country":"País (opcional)","search":"Buscar","close":"Cerrar","queryPlaceholder":"p. ej., Tromsø o 27804","countryPlaceholder":"País o código ISO","searching":"Buscando …","noResults":"No se encontró ningún lugar adecuado.","providerError":"La búsqueda de lugares no está disponible en este momento.","invalidCountry":"Elige un país de las sugerencias locales o deja el campo vacío.","use":"Aplicar","save":"★ Guardar","saveTitle":"Guardar el lugar permanentemente en la lista local de Gewitterradar.","saving":"Guardando lugar …","saved":"★ Guardado","savedOk":"se guardó.","savedDuplicate":"ya está guardado.","saveFailed":"No se pudo guardar el lugar.","savedSetup":"Falta la lista local “Gewitterradar Orte”. Home Assistant: Ajustes → Dispositivos y servicios → Añadir integración → busca/selecciona “Local to-do” → nombra la lista exactamente “Gewitterradar Orte”.","savedPlaceFallback":"Lugar guardado","removedPlaces":"Lugares eliminados","removeSaved":"Quitar lugar guardado","restoreSaved":"Restaurar lugar","savedRestored":"se restauró.","removeFailed":"No se pudo quitar el lugar.","restoreFailed":"No se pudo restaurar el lugar.","using":"Estableciendo ubicación de referencia …","used":"se usa ahora como ubicación de referencia de Gewitterradar.","backendMissing":"No se encontró el servicio de seguimiento V4.07 ni el paquete del panel.","useFailed":"No se pudo establecer la ubicación de referencia.","providerNote":"Geocodificación: Open-Meteo / GeoNames · OpenStreetMap Nominatim cuando sea necesario.","safety":"Importante: una nueva ubicación de referencia de Gewitterradar no demuestra que Blitzortung ya tenga suscripciones de datos en vivo adecuadas para esa zona.","allCountries":"Todos los países","countryFilters":"Filtros de país","resultSummary":"{results} resultados en {countries} países","homeCountry":"País de origen","showMore":"Mostrar {count} resultados más","unknownCountry":"País desconocido"},"Français":{"people":"Personnes","zones":"Zones","searchAction":"Rechercher un lieu …","savedPlaces":"Lieux enregistrés","savedEmpty":"Aucun lieu enregistré","title":"Recherche mondiale de lieux","query":"Lieu / code postal","country":"Pays (facultatif)","search":"Rechercher","close":"Fermer","queryPlaceholder":"p. ex. Tromsø ou 27804","countryPlaceholder":"Pays ou code ISO","searching":"Recherche en cours …","noResults":"Aucun lieu correspondant trouvé.","providerError":"La recherche de lieux est actuellement indisponible.","invalidCountry":"Choisissez un pays dans les suggestions locales ou videz le champ.","use":"Appliquer","save":"★ Enregistrer","saveTitle":"Enregistrer durablement ce lieu dans la liste locale de Gewitterradar.","saving":"Enregistrement du lieu …","saved":"★ Enregistré","savedOk":"a été enregistré.","savedDuplicate":"est déjà enregistré.","saveFailed":"Impossible d’enregistrer le lieu.","savedSetup":"La liste locale « Gewitterradar Orte » manque. Home Assistant : Paramètres → Appareils et services → Ajouter une intégration → rechercher/sélectionner « Local to-do » → nommer la liste exactement « Gewitterradar Orte ».","savedPlaceFallback":"Lieu enregistré","removedPlaces":"Lieux supprimés","removeSaved":"Retirer le lieu enregistré","restoreSaved":"Restaurer le lieu","savedRestored":"a été restauré.","removeFailed":"Impossible de retirer le lieu.","restoreFailed":"Impossible de restaurer le lieu.","using":"Définition du lieu de référence …","used":"est maintenant utilisé comme lieu de référence de Gewitterradar.","backendMissing":"Service de suivi V4.07 ou paquet du tableau de bord introuvable.","useFailed":"Impossible de définir le lieu de référence.","providerNote":"Géocodage : Open-Meteo / GeoNames · OpenStreetMap Nominatim si nécessaire.","safety":"Important : un nouveau lieu de référence Gewitterradar ne prouve pas que Blitzortung dispose déjà des abonnements de données en direct correspondants pour cette zone.","allCountries":"Tous les pays","countryFilters":"Filtres par pays","resultSummary":"{results} résultats dans {countries} pays","homeCountry":"Pays d’origine","showMore":"Afficher {count} résultats supplémentaires","unknownCountry":"Pays inconnu"},"Nederlands":{"people":"Personen","zones":"Zones","searchAction":"Plaats zoeken …","savedPlaces":"Opgeslagen plaatsen","savedEmpty":"Nog geen opgeslagen plaatsen","title":"Wereldwijd plaatsen zoeken","query":"Plaats / postcode","country":"Land (optioneel)","search":"Zoeken","close":"Sluiten","queryPlaceholder":"bijv. Tromsø of 27804","countryPlaceholder":"Land of ISO-code","searching":"Bezig met zoeken …","noResults":"Geen passende plaats gevonden.","providerError":"Plaatsen zoeken is momenteel niet beschikbaar.","invalidCountry":"Kies een land uit de lokale suggesties of maak het veld leeg.","use":"Overnemen","save":"★ Opslaan","saveTitle":"Plaats permanent opslaan in de lokale Gewitterradar-plaatsenlijst.","saving":"Plaats opslaan …","saved":"★ Opgeslagen","savedOk":"is opgeslagen.","savedDuplicate":"is al opgeslagen.","saveFailed":"Plaats kon niet worden opgeslagen.","savedSetup":"De lokale lijst “Gewitterradar Orte” ontbreekt. Home Assistant: Instellingen → Apparaten & diensten → Integratie toevoegen → zoek/selecteer “Local to-do” → noem de lijst exact “Gewitterradar Orte”.","savedPlaceFallback":"Opgeslagen plaats","removedPlaces":"Verwijderde plaatsen","removeSaved":"Opgeslagen plaats verwijderen","restoreSaved":"Plaats herstellen","savedRestored":"is hersteld.","removeFailed":"Plaats kon niet worden verwijderd.","restoreFailed":"Plaats kon niet worden hersteld.","using":"Referentielocatie instellen …","used":"wordt nu gebruikt als Gewitterradar-referentielocatie.","backendMissing":"V4.07-trackerservice of dashboardpakket niet gevonden.","useFailed":"Referentielocatie kon niet worden ingesteld.","providerNote":"Geocodering: Open-Meteo / GeoNames · OpenStreetMap Nominatim indien nodig.","safety":"Belangrijk: een nieuwe Gewitterradar-referentielocatie bewijst niet dat Blitzortung al passende live-data-abonnementen voor dit gebied heeft.","allCountries":"Alle landen","countryFilters":"Landfilters","resultSummary":"{results} resultaten in {countries} landen","homeCountry":"Thuisland","showMore":"Nog {count} resultaten tonen","unknownCountry":"Onbekend land"},"Polski":{"people":"Osoby","zones":"Strefy","searchAction":"Szukaj miejsca …","savedPlaces":"Zapisane miejsca","savedEmpty":"Brak zapisanych miejsc","title":"Wyszukiwanie miejsc na świecie","query":"Miejsce / kod pocztowy","country":"Kraj (opcjonalnie)","search":"Szukaj","close":"Zamknij","queryPlaceholder":"np. Tromsø lub 27804","countryPlaceholder":"Kraj lub kod ISO","searching":"Wyszukiwanie …","noResults":"Nie znaleziono pasującego miejsca.","providerError":"Wyszukiwanie miejsc jest obecnie niedostępne.","invalidCountry":"Wybierz kraj z lokalnych podpowiedzi albo wyczyść pole.","use":"Zastosuj","save":"★ Zapisz","saveTitle":"Zapisz miejsce na stałe w lokalnej liście miejsc Gewitterradar.","saving":"Zapisywanie miejsca …","saved":"★ Zapisano","savedOk":"zostało zapisane.","savedDuplicate":"jest już zapisane.","saveFailed":"Nie udało się zapisać miejsca.","savedSetup":"Brakuje lokalnej listy „Gewitterradar Orte”. Home Assistant: Ustawienia → Urządzenia i usługi → Dodaj integrację → wyszukaj/wybierz „Local to-do” → nazwij listę dokładnie „Gewitterradar Orte”.","savedPlaceFallback":"Zapisane miejsce","removedPlaces":"Usunięte miejsca","removeSaved":"Usuń zapisane miejsce","restoreSaved":"Przywróć miejsce","savedRestored":"zostało przywrócone.","removeFailed":"Nie udało się usunąć miejsca.","restoreFailed":"Nie udało się przywrócić miejsca.","using":"Ustawianie lokalizacji odniesienia …","used":"jest teraz używane jako lokalizacja odniesienia Gewitterradar.","backendMissing":"Nie znaleziono usługi trackera V4.07 ani pakietu panelu.","useFailed":"Nie udało się ustawić lokalizacji odniesienia.","providerNote":"Geokodowanie: Open-Meteo / GeoNames · w razie potrzeby OpenStreetMap Nominatim.","safety":"Ważne: nowa lokalizacja odniesienia Gewitterradar nie dowodzi, że Blitzortung ma już odpowiednie subskrypcje danych na żywo dla tego obszaru.","allCountries":"Wszystkie kraje","countryFilters":"Filtry krajów","resultSummary":"{results} wyników w {countries} krajach","homeCountry":"Kraj macierzysty","showMore":"Pokaż jeszcze {count} wyników","unknownCountry":"Nieznany kraj"},"Português":{"people":"Pessoas","zones":"Zonas","searchAction":"Pesquisar local …","savedPlaces":"Locais guardados","savedEmpty":"Ainda não há locais guardados","title":"Pesquisa mundial de locais","query":"Local / código postal","country":"País (opcional)","search":"Pesquisar","close":"Fechar","queryPlaceholder":"ex.: Tromsø ou 27804","countryPlaceholder":"País ou código ISO","searching":"A pesquisar …","noResults":"Nenhum local correspondente encontrado.","providerError":"A pesquisa de locais está indisponível neste momento.","invalidCountry":"Escolha um país das sugestões locais ou limpe o campo.","use":"Aplicar","save":"★ Guardar","saveTitle":"Guardar o local permanentemente na lista local do Gewitterradar.","saving":"A guardar local …","saved":"★ Guardado","savedOk":"foi guardado.","savedDuplicate":"já está guardado.","saveFailed":"Não foi possível guardar o local.","savedSetup":"Falta a lista local “Gewitterradar Orte”. Home Assistant: Definições → Dispositivos e serviços → Adicionar integração → procurar/selecionar “Local to-do” → dar à lista exatamente o nome “Gewitterradar Orte”.","savedPlaceFallback":"Local guardado","removedPlaces":"Locais removidos","removeSaved":"Remover local guardado","restoreSaved":"Restaurar local","savedRestored":"foi restaurado.","removeFailed":"Não foi possível remover o local.","restoreFailed":"Não foi possível restaurar o local.","using":"A definir local de referência …","used":"é agora usado como local de referência do Gewitterradar.","backendMissing":"Serviço de tracker V4.07 ou pacote do painel não encontrado.","useFailed":"Não foi possível definir o local de referência.","providerNote":"Geocodificação: Open-Meteo / GeoNames · OpenStreetMap Nominatim quando necessário.","safety":"Importante: um novo local de referência do Gewitterradar não prova que o Blitzortung já tenha subscrições de dados em direto adequadas para essa área.","allCountries":"Todos os países","countryFilters":"Filtros de país","resultSummary":"{results} resultados em {countries} países","homeCountry":"País de origem","showMore":"Mostrar mais {count} resultados","unknownCountry":"País desconhecido"},"Svenska":{"people":"Personer","zones":"Zoner","searchAction":"Sök plats …","savedPlaces":"Sparade platser","savedEmpty":"Inga sparade platser ännu","title":"Global platssökning","query":"Plats / postnummer","country":"Land (valfritt)","search":"Sök","close":"Stäng","queryPlaceholder":"t.ex. Tromsø eller 27804","countryPlaceholder":"Land eller ISO-kod","searching":"Söker …","noResults":"Ingen passande plats hittades.","providerError":"Platssökningen är inte tillgänglig just nu.","invalidCountry":"Välj ett land från de lokala förslagen eller töm fältet.","use":"Tillämpa","save":"★ Spara","saveTitle":"Spara platsen permanent i den lokala Gewitterradar-platslistan.","saving":"Sparar plats …","saved":"★ Sparad","savedOk":"sparades.","savedDuplicate":"är redan sparad.","saveFailed":"Platsen kunde inte sparas.","savedSetup":"Den lokala listan “Gewitterradar Orte” saknas. Home Assistant: Inställningar → Enheter och tjänster → Lägg till integration → sök/välj “Local to-do” → namnge listan exakt “Gewitterradar Orte”.","savedPlaceFallback":"Sparad plats","removedPlaces":"Borttagna platser","removeSaved":"Ta bort sparad plats","restoreSaved":"Återställ plats","savedRestored":"återställdes.","removeFailed":"Platsen kunde inte tas bort.","restoreFailed":"Platsen kunde inte återställas.","using":"Ställer in referensplats …","used":"används nu som Gewitterradars referensplats.","backendMissing":"V4.07-spårningstjänsten eller dashboardpaketet hittades inte.","useFailed":"Referensplatsen kunde inte ställas in.","providerNote":"Geokodning: Open-Meteo / GeoNames · OpenStreetMap Nominatim vid behov.","safety":"Viktigt: en ny Gewitterradar-referensplats bevisar inte att Blitzortung redan har matchande live-dataabonnemang för området.","allCountries":"Alla länder","countryFilters":"Landfilter","resultSummary":"{results} resultat i {countries} länder","homeCountry":"Hemland","showMore":"Visa ytterligare {count} resultat","unknownCountry":"Okänt land"},"Italiano":{"people":"Persone","zones":"Zone","searchAction":"Cerca luogo …","savedPlaces":"Luoghi salvati","savedEmpty":"Nessun luogo salvato","title":"Ricerca mondiale dei luoghi","query":"Luogo / CAP","country":"Paese (opzionale)","search":"Cerca","close":"Chiudi","queryPlaceholder":"es. Tromsø o 27804","countryPlaceholder":"Paese o codice ISO","searching":"Ricerca in corso …","noResults":"Nessun luogo corrispondente trovato.","providerError":"La ricerca dei luoghi non è al momento disponibile.","invalidCountry":"Scegli un paese dai suggerimenti locali oppure svuota il campo.","use":"Applica","save":"★ Salva","saveTitle":"Salva il luogo in modo permanente nell’elenco locale di Gewitterradar.","saving":"Salvataggio luogo …","saved":"★ Salvato","savedOk":"è stato salvato.","savedDuplicate":"è già salvato.","saveFailed":"Impossibile salvare il luogo.","savedSetup":"Manca l’elenco locale “Gewitterradar Orte”. Home Assistant: Impostazioni → Dispositivi e servizi → Aggiungi integrazione → cerca/seleziona “Local to-do” → assegna all’elenco esattamente il nome “Gewitterradar Orte”.","savedPlaceFallback":"Luogo salvato","removedPlaces":"Luoghi rimossi","removeSaved":"Rimuovi luogo salvato","restoreSaved":"Ripristina luogo","savedRestored":"è stato ripristinato.","removeFailed":"Impossibile rimuovere il luogo.","restoreFailed":"Impossibile ripristinare il luogo.","using":"Impostazione luogo di riferimento …","used":"viene ora usato come luogo di riferimento di Gewitterradar.","backendMissing":"Servizio tracker V4.07 o pacchetto dashboard non trovato.","useFailed":"Impossibile impostare il luogo di riferimento.","providerNote":"Geocodifica: Open-Meteo / GeoNames · OpenStreetMap Nominatim se necessario.","safety":"Importante: un nuovo luogo di riferimento Gewitterradar non dimostra che Blitzortung disponga già degli abbonamenti ai dati in tempo reale adatti a quell’area.","allCountries":"Tutti i paesi","countryFilters":"Filtri paese","resultSummary":"{results} risultati in {countries} paesi","homeCountry":"Paese di origine","showMore":"Mostra altri {count} risultati","unknownCountry":"Paese sconosciuto"},"Norsk bokmål":{"people":"Personer","zones":"Soner","searchAction":"Søk etter sted …","savedPlaces":"Lagrede steder","savedEmpty":"Ingen lagrede steder ennå","title":"Globalt stedsøk","query":"Sted / postnummer","country":"Land (valgfritt)","search":"Søk","close":"Lukk","queryPlaceholder":"f.eks. Tromsø eller 27804","countryPlaceholder":"Land eller ISO-kode","searching":"Søker …","noResults":"Fant ikke noe passende sted.","providerError":"Stedsøk er ikke tilgjengelig akkurat nå.","invalidCountry":"Velg et land fra de lokale forslagene, eller tøm feltet.","use":"Angi","save":"★ Lagre","saveTitle":"Lagre stedet permanent i den lokale Gewitterradar-stedslisten.","saving":"Lagrer sted …","saved":"★ Lagret","savedOk":"ble lagret.","savedDuplicate":"er allerede lagret.","saveFailed":"Stedet kunne ikke lagres.","savedSetup":"Den lokale listen “Gewitterradar Orte” mangler. Home Assistant: Innstillinger → Enheter og tjenester → Legg til integrasjon → søk/velg “Local to-do” → gi listen nøyaktig navnet “Gewitterradar Orte”.","savedPlaceFallback":"Lagret sted","removedPlaces":"Fjernede steder","removeSaved":"Fjern lagret sted","restoreSaved":"Gjenopprett sted","savedRestored":"ble gjenopprettet.","removeFailed":"Stedet kunne ikke fjernes.","restoreFailed":"Stedet kunne ikke gjenopprettes.","using":"Angir referansested …","used":"brukes nå som referansested for Gewitterradar.","backendMissing":"V4.07-sporingstjenesten eller dashboardpakken ble ikke funnet.","useFailed":"Referansestedet kunne ikke angis.","providerNote":"Geokoding: Open-Meteo / GeoNames · OpenStreetMap Nominatim ved behov.","safety":"Viktig: Et nytt Gewitterradar-referansested beviser ikke at Blitzortung allerede har passende abonnementer på sanntidsdata for området.","allCountries":"Alle land","countryFilters":"Landfiltre","resultSummary":"{results} resultater i {countries} land","homeCountry":"Hjemland","showMore":"Vis {count} flere resultater","unknownCountry":"Ukjent land"},"Suomi":{"people":"Henkilöt","zones":"Vyöhykkeet","searchAction":"Hae paikkaa …","savedPlaces":"Tallennetut paikat","savedEmpty":"Ei tallennettuja paikkoja","title":"Maailmanlaajuinen paikkahaku","query":"Paikka / postinumero","country":"Maa (valinnainen)","search":"Hae","close":"Sulje","queryPlaceholder":"esim. Tromsø tai 27804","countryPlaceholder":"Maa tai ISO-koodi","searching":"Haetaan …","noResults":"Sopivaa paikkaa ei löytynyt.","providerError":"Paikkahaku ei ole juuri nyt käytettävissä.","invalidCountry":"Valitse maa paikallisista ehdotuksista tai tyhjennä kenttä.","use":"Aseta","save":"★ Tallenna","saveTitle":"Tallenna paikka pysyvästi paikalliseen Gewitterradar-paikkaluetteloon.","saving":"Tallennetaan paikkaa …","saved":"★ Tallennettu","savedOk":"tallennettiin.","savedDuplicate":"on jo tallennettu.","saveFailed":"Paikkaa ei voitu tallentaa.","savedSetup":"Paikallinen “Gewitterradar Orte” -luettelo puuttuu. Home Assistant: Asetukset → Laitteet ja palvelut → Lisää integraatio → etsi/valitse “Local to-do” → nimeä luettelo täsmälleen “Gewitterradar Orte”.","savedPlaceFallback":"Tallennettu paikka","removedPlaces":"Poistetut paikat","removeSaved":"Poista tallennettu paikka","restoreSaved":"Palauta paikka","savedRestored":"palautettiin.","removeFailed":"Paikkaa ei voitu poistaa.","restoreFailed":"Paikkaa ei voitu palauttaa.","using":"Asetetaan viitesijaintia …","used":"on nyt Gewitterradarin viitesijainti.","backendMissing":"V4.07-seurantapalvelua tai kojelautapakettia ei löytynyt.","useFailed":"Viitesijaintia ei voitu asettaa.","providerNote":"Geokoodaus: Open-Meteo / GeoNames · tarvittaessa OpenStreetMap Nominatim.","safety":"Tärkeää: uusi Gewitterradar-viitesijainti ei osoita, että Blitzortungilla olisi jo aluetta vastaavat reaaliaikaiset datatilaukset.","allCountries":"Kaikki maat","countryFilters":"Maasuodattimet","resultSummary":"{results} tulosta {countries} maassa","homeCountry":"Kotimaa","showMore":"Näytä vielä {count} tulosta","unknownCountry":"Tuntematon maa"},"Čeština":{"people":"Osoby","zones":"Zóny","searchAction":"Hledat místo …","savedPlaces":"Uložená místa","savedEmpty":"Zatím žádná uložená místa","title":"Celosvětové vyhledávání míst","query":"Místo / PSČ","country":"Země (volitelné)","search":"Hledat","close":"Zavřít","queryPlaceholder":"např. Tromsø nebo 27804","countryPlaceholder":"Země nebo kód ISO","searching":"Vyhledávání …","noResults":"Nebylo nalezeno odpovídající místo.","providerError":"Vyhledávání míst momentálně není dostupné.","invalidCountry":"Vyberte zemi z místních návrhů nebo pole vymažte.","use":"Nastavit","save":"★ Uložit","saveTitle":"Trvale uložit místo do místního seznamu Gewitterradar.","saving":"Ukládání místa …","saved":"★ Uloženo","savedOk":"bylo uloženo.","savedDuplicate":"je již uloženo.","saveFailed":"Místo se nepodařilo uložit.","savedSetup":"Chybí místní seznam „Gewitterradar Orte“. Home Assistant: Nastavení → Zařízení a služby → Přidat integraci → vyhledejte/vyberte „Local to-do“ → seznam pojmenujte přesně „Gewitterradar Orte“.","savedPlaceFallback":"Uložené místo","removedPlaces":"Odebraná místa","removeSaved":"Odebrat uložené místo","restoreSaved":"Obnovit místo","savedRestored":"bylo obnoveno.","removeFailed":"Místo se nepodařilo odebrat.","restoreFailed":"Místo se nepodařilo obnovit.","using":"Nastavuji referenční polohu …","used":"se nyní používá jako referenční poloha Gewitterradar.","backendMissing":"Služba trackeru V4.07 nebo balíček dashboardu nebyly nalezeny.","useFailed":"Referenční polohu se nepodařilo nastavit.","providerNote":"Geokódování: Open-Meteo / GeoNames · v případě potřeby OpenStreetMap Nominatim.","safety":"Důležité: nová referenční poloha Gewitterradar nedokazuje, že Blitzortung již odebírá odpovídající živá data pro tuto oblast.","allCountries":"Všechny země","countryFilters":"Filtry zemí","resultSummary":"{results} výsledků v {countries} zemích","homeCountry":"Domovská země","showMore":"Zobrazit dalších {count} výsledků","unknownCountry":"Neznámá země"},"Ελληνικά":{"people":"Άτομα","zones":"Ζώνες","searchAction":"Αναζήτηση τοποθεσίας …","savedPlaces":"Αποθηκευμένες τοποθεσίες","savedEmpty":"Δεν υπάρχουν ακόμη αποθηκευμένες τοποθεσίες","title":"Παγκόσμια αναζήτηση τοποθεσίας","query":"Τοποθεσία / ΤΚ","country":"Χώρα (προαιρετικά)","search":"Αναζήτηση","close":"Κλείσιμο","queryPlaceholder":"π.χ. Tromsø ή 27804","countryPlaceholder":"Χώρα ή κωδικός ISO","searching":"Αναζήτηση …","noResults":"Δεν βρέθηκε κατάλληλη τοποθεσία.","providerError":"Η αναζήτηση τοποθεσίας δεν είναι διαθέσιμη αυτή τη στιγμή.","invalidCountry":"Επιλέξτε χώρα από τις τοπικές προτάσεις ή αδειάστε το πεδίο.","use":"Εφαρμογή","save":"★ Αποθήκευση","saveTitle":"Μόνιμη αποθήκευση της τοποθεσίας στην τοπική λίστα του Gewitterradar.","saving":"Αποθήκευση τοποθεσίας …","saved":"★ Αποθηκεύτηκε","savedOk":"αποθηκεύτηκε.","savedDuplicate":"είναι ήδη αποθηκευμένη.","saveFailed":"Δεν ήταν δυνατή η αποθήκευση της τοποθεσίας.","savedSetup":"Λείπει η τοπική λίστα “Gewitterradar Orte”. Home Assistant: Ρυθμίσεις → Συσκευές και υπηρεσίες → Προσθήκη ενσωμάτωσης → αναζήτηση/επιλογή “Local to-do” → ονομάστε τη λίστα ακριβώς “Gewitterradar Orte”.","savedPlaceFallback":"Αποθηκευμένη τοποθεσία","removedPlaces":"Αφαιρεμένες τοποθεσίες","removeSaved":"Αφαίρεση αποθηκευμένης τοποθεσίας","restoreSaved":"Επαναφορά τοποθεσίας","savedRestored":"επαναφέρθηκε.","removeFailed":"Δεν ήταν δυνατή η αφαίρεση της τοποθεσίας.","restoreFailed":"Δεν ήταν δυνατή η επαναφορά της τοποθεσίας.","using":"Ορισμός τοποθεσίας αναφοράς …","used":"χρησιμοποιείται πλέον ως τοποθεσία αναφοράς του Gewitterradar.","backendMissing":"Δεν βρέθηκε η υπηρεσία tracker V4.07 ή το πακέτο dashboard.","useFailed":"Δεν ήταν δυνατός ο ορισμός της τοποθεσίας αναφοράς.","providerNote":"Γεωκωδικοποίηση: Open-Meteo / GeoNames · OpenStreetMap Nominatim όταν χρειάζεται.","safety":"Σημαντικό: μια νέα τοποθεσία αναφοράς Gewitterradar δεν αποδεικνύει ότι το Blitzortung έχει ήδη τις κατάλληλες συνδρομές ζωντανών δεδομένων για την περιοχή.","allCountries":"Όλες οι χώρες","countryFilters":"Φίλτρα χωρών","resultSummary":"{results} αποτελέσματα σε {countries} χώρες","homeCountry":"Χώρα κατοικίας","showMore":"Εμφάνιση ακόμη {count} αποτελεσμάτων","unknownCountry":"Άγνωστη χώρα"},"Magyar":{"people":"Személyek","zones":"Zónák","searchAction":"Hely keresése …","savedPlaces":"Mentett helyek","savedEmpty":"Még nincs mentett hely","title":"Világszintű helykeresés","query":"Hely / irányítószám","country":"Ország (opcionális)","search":"Keresés","close":"Bezárás","queryPlaceholder":"pl. Tromsø vagy 27804","countryPlaceholder":"Ország vagy ISO-kód","searching":"Keresés …","noResults":"Nem található megfelelő hely.","providerError":"A helykeresés jelenleg nem érhető el.","invalidCountry":"Válasszon országot a helyi javaslatok közül, vagy törölje a mezőt.","use":"Alkalmaz","save":"★ Mentés","saveTitle":"Hely végleges mentése a helyi Gewitterradar-helylistába.","saving":"Hely mentése …","saved":"★ Mentve","savedOk":"mentve.","savedDuplicate":"már el van mentve.","saveFailed":"A hely mentése nem sikerült.","savedSetup":"Hiányzik a helyi „Gewitterradar Orte” lista. Home Assistant: Beállítások → Eszközök és szolgáltatások → Integráció hozzáadása → keresse/válassza a „Local to-do” elemet → a lista neve pontosan „Gewitterradar Orte” legyen.","savedPlaceFallback":"Mentett hely","removedPlaces":"Eltávolított helyek","removeSaved":"Mentett hely eltávolítása","restoreSaved":"Hely visszaállítása","savedRestored":"visszaállítva.","removeFailed":"A hely eltávolítása nem sikerült.","restoreFailed":"A hely visszaállítása nem sikerült.","using":"Referenciahely beállítása …","used":"mostantól a Gewitterradar referenciahelye.","backendMissing":"A V4.07 tracker szolgáltatás vagy a dashboard csomag nem található.","useFailed":"A referenciahely beállítása nem sikerült.","providerNote":"Geokódolás: Open-Meteo / GeoNames · szükség esetén OpenStreetMap Nominatim.","safety":"Fontos: egy új Gewitterradar referenciahely nem bizonyítja, hogy a Blitzortung már rendelkezik a területhez illő élőadat-előfizetéssel.","allCountries":"Minden ország","countryFilters":"Országszűrők","resultSummary":"{results} találat {countries} országban","homeCountry":"Saját ország","showMore":"További {count} találat megjelenítése","unknownCountry":"Ismeretlen ország"},"Boarisch":{"people":"Leit","zones":"Zonen","searchAction":"Ort suacha …","savedPlaces":"Gspeicherte Ort","savedEmpty":"No koane gspeicherten Ort","title":"Weltweite Ortssuach","query":"Ort / PLZ","country":"Land (optional)","search":"Suacha","close":"Zumacha","queryPlaceholder":"z. B. Tromsø oder 27804","countryPlaceholder":"Land oder ISO-Code","searching":"Suach lafft …","noResults":"Koa passender Ort gfundn.","providerError":"D Ortssuach is grad ned erreichbar.","invalidCountry":"Bittschön a Land aus de lokalen Vorschläg aussuacha oder s Feld leer macha.","use":"Nehma","save":"★ Speichern","saveTitle":"Ort dauerhaft in da lokalen Gewitterradar-Ortslist speichern.","saving":"Ort werd gspeichert …","saved":"★ Gspeichert","savedOk":"is gspeichert worn.","savedDuplicate":"is scho gspeichert.","saveFailed":"Ort hot ned gspeichert wern kenna.","savedSetup":"Zum Speichern fehlt de lokale Listn „Gewitterradar Orte“. Home Assistant: Einstellungen → Geräte & Dienste → Integration hinzufügen → „Local to-do“ suacha/auswähln → Listn exakt „Gewitterradar Orte“ nennen.","savedPlaceFallback":"Gspeicherter Ort","removedPlaces":"Entfernte Ort","removeSaved":"Gspeicherten Ort entfernen","restoreSaved":"Ort wiederherstön","savedRestored":"is wiederhergstellt worn.","removeFailed":"Ort hot ned entfernt wern kenna.","restoreFailed":"Ort hot ned wiederhergstellt wern kenna.","using":"Bezugsort werd gsetzt …","used":"werd jetzt als Gewitterradar-Bezugsort verwendet.","backendMissing":"V4.07-Tracker-Service oder Dashboard-Package ned gfundn.","useFailed":"Bezugsort hot ned gsetzt wern kenna.","providerNote":"Geocoding: Open-Meteo / GeoNames · bei Bedarf OpenStreetMap Nominatim.","safety":"Wichtig: A neuer Gewitterradar-Bezugsort beweist no ned, dass Blitzortung scho passende Live-Daten für den Bereich abonniert hot.","allCountries":"Alle Länder","countryFilters":"Länderfilter","resultSummary":"{results} Treffer in {countries} Ländern","homeCountry":"Hoamatland","showMore":"No {count} Treffer anzeigen","unknownCountry":"Unbekannts Land"},"Plattdüütsch":{"people":"Lüüd","zones":"Zonen","searchAction":"Oort söken …","savedPlaces":"Spiekerte Öörd","savedEmpty":"Noch keen spiekerten Öörd","title":"Weltwiede Oortsöök","query":"Oort / PLZ","country":"Land (optschonaal)","search":"Söken","close":"Tomaken","queryPlaceholder":"t. B. Tromsø oder 27804","countryPlaceholder":"Land oder ISO-Kode","searching":"Söök löppt …","noResults":"Keen passen Oort funnen.","providerError":"De Oortsöök is opstunns nich to kriegen.","invalidCountry":"Söök en Land ut de lokalen Vörslääg ut oder maak dat Feld leddig.","use":"Övernehmen","save":"★ Spiekern","saveTitle":"Oort duerhaftig in de lokale Gewitterradar-Oortlist spiekern.","saving":"Oort warrt spiekert …","saved":"★ Spiekert","savedOk":"wöör spiekert.","savedDuplicate":"is al spiekert.","saveFailed":"Oort kunn nich spiekert warrn.","savedSetup":"De lokale List „Gewitterradar Orte“ fehlt. Home Assistant: Instellen → Reedschappen & Deensten → Integratschoon tofögen → „Local to-do“ söken/utwählen → List akraat „Gewitterradar Orte“ nömen.","savedPlaceFallback":"Spiekerter Oort","removedPlaces":"Wegnohmen Öörd","removeSaved":"Spiekerten Oort wegnehmen","restoreSaved":"Oort wedderherstellen","savedRestored":"wöör wedderherstellt.","removeFailed":"Oort kunn nich wegnohmen warrn.","restoreFailed":"Oort kunn nich wedderherstellt warrn.","using":"Bezugsoort warrt sett …","used":"warrt nu as Gewitterradar-Bezugsoort bruukt.","backendMissing":"V4.07-Tracker-Deenst oder Dashboard-Paket nich funnen.","useFailed":"Bezugsoort kunn nich sett warrn.","providerNote":"Geokoderen: Open-Meteo / GeoNames · wenn nödig OpenStreetMap Nominatim.","safety":"Wichtig: En niegen Gewitterradar-Bezugsoort bewiest noch nich, dat Blitzortung al passen Live-Daten för dat Rebeet hett.","allCountries":"All Länner","countryFilters":"Lännerfilter","resultSummary":"{results} Drepers in {countries} Länner","homeCountry":"Heimatland","showMore":"Noch {count} Drepers wiesen","unknownCountry":"Unbekannt Land"},"Sächs’sch":{"people":"Leide","zones":"Zonen","searchAction":"Ord suchn …","savedPlaces":"Gespeicherde Orde","savedEmpty":"Noch keene gespeicherden Orde","title":"Weldweide Ordssuche","query":"Ord / PLZ","country":"Land (optional)","search":"Suchn","close":"Zumachn","queryPlaceholder":"z. B. Tromsø oder 27804","countryPlaceholder":"Land oder ISO-Code","searching":"Suche loofd …","noResults":"Keen passender Ord gefundn.","providerError":"De Ordssuche is grade nich erreichbar.","invalidCountry":"Bidde een Land aus de lokalen Vorschläge wählen oder s Feld leer machn.","use":"Übernähm","save":"★ Speichern","saveTitle":"Ord dauerhaft in de lokale Gewitterradar-Ordsliste speichern.","saving":"Ord wird gespeichert …","saved":"★ Gespeichert","savedOk":"wurde gespeichert.","savedDuplicate":"is schon gespeichert.","saveFailed":"Ord konnde nich gespeichert werdn.","savedSetup":"Zum Speichern fehlt de lokale Liste „Gewitterradar Orte“. Home Assistant: Einstellungen → Geräte & Dienste → Integration hinzufügen → „Local to-do“ suchn/auswähln → Liste genau „Gewitterradar Orte“ nennen.","savedPlaceFallback":"Gespeicherder Ord","removedPlaces":"Entfernde Orde","removeSaved":"Gespeicherden Ord entfernen","restoreSaved":"Ord wiederherstelln","savedRestored":"wurde wiederhergestellt.","removeFailed":"Ord konnde nich entfernt werdn.","restoreFailed":"Ord konnde nich wiederhergestellt werdn.","using":"Bezugsord wird gesetzt …","used":"wird nu als Gewitterradar-Bezugsord verwendet.","backendMissing":"V4.07-Tracker-Service oder Dashboard-Package nich gefundn.","useFailed":"Bezugsord konnde nich gesetzt werdn.","providerNote":"Geocoding: Open-Meteo / GeoNames · wenn nötig OpenStreetMap Nominatim.","safety":"Wischdsch: Een neuer Gewitterradar-Bezugsord beweist noch nich, dass Blitzortung schon passende Live-Daten für den Bereich abonniert hat.","allCountries":"Alle Länder","countryFilters":"Länderfilter","resultSummary":"{results} Treffer in {countries} Ländern","homeCountry":"Heimatland","showMore":"Noch {count} Treffer anzeigen","unknownCountry":"Unbekanntes Land"},"Schwäbisch":{"people":"Leit","zones":"Zone","searchAction":"Ort suacha …","savedPlaces":"Gspeicherte Ort","savedEmpty":"No koi gspeicherte Ort","title":"Weltweite Ortssuach","query":"Ort / PLZ","country":"Land (optional)","search":"Suacha","close":"Zumacha","queryPlaceholder":"z. B. Tromsø oder 27804","countryPlaceholder":"Land oder ISO-Code","searching":"Suach lauft …","noResults":"Koi passender Ort gfunda.","providerError":"D Ortssuach is grad net erreichbar.","invalidCountry":"Bitte a Land aus de lokale Vorschläg auswähla oder s Feld leer macha.","use":"Übernemma","save":"★ Speichra","saveTitle":"Ort dauerhaft in dr lokale Gewitterradar-Ortslist speichra.","saving":"Ort wird gspeichrat …","saved":"★ Gspeichrat","savedOk":"isch gspeichrat worda.","savedDuplicate":"isch scho gspeichrat.","saveFailed":"Ort hot net gspeichrat werda könna.","savedSetup":"Zum Speichra fehlt d lokale List „Gewitterradar Orte“. Home Assistant: Einstellungen → Geräte & Dienste → Integration hinzufügen → „Local to-do“ suacha/auswähla → List exakt „Gewitterradar Orte“ nenna.","savedPlaceFallback":"Gspeichrter Ort","removedPlaces":"Entfernte Ort","removeSaved":"Gspeichrten Ort entferna","restoreSaved":"Ort wiederherstella","savedRestored":"isch wiederhergstellt worda.","removeFailed":"Ort hot net entfernt werda könna.","restoreFailed":"Ort hot net wiederhergstellt werda könna.","using":"Bezugsort wird gsetzt …","used":"wird jetzt als Gewitterradar-Bezugsort verwendet.","backendMissing":"V4.07-Tracker-Service oder Dashboard-Package net gfunda.","useFailed":"Bezugsort hot net gsetzt werda könna.","providerNote":"Geocoding: Open-Meteo / GeoNames · wenn nötig OpenStreetMap Nominatim.","safety":"Wichtig: A neuer Gewitterradar-Bezugsort beweist no net, dass Blitzortung scho passende Live-Daten für den Bereich abonniert hot.","allCountries":"Alle Länder","countryFilters":"Länderfilter","resultSummary":"{results} Treffer in {countries} Ländern","homeCountry":"Hoimatland","showMore":"No {count} Treffer anzeiga","unknownCountry":"Unbekannts Land"}});
      const v407Text = () => V407_LOCATION_TEXTS[this._languageValue()] || V407_LOCATION_TEXTS.English;
      const v407ClearQueryLabel = () => ({
        'Deutsch':'Eingabe löschen','English':'Clear input','Dansk':'Ryd indtastning','Español':'Borrar entrada','Français':'Effacer la saisie',
        'Nederlands':'Invoer wissen','Polski':'Wyczyść wpis','Português':'Limpar entrada','Svenska':'Rensa inmatning','Italiano':'Cancella immissione',
        'Norsk bokmål':'Tøm inntasting','Suomi':'Tyhjennä syöte','Čeština':'Vymazat zadání','Ελληνικά':'Εκκαθάριση εισαγωγής','Magyar':'Bevitel törlése',
        'Boarisch':'Eingab löschn','Plattdüütsch':'Ingaav wegmaken','Sächs’sch':'Eingabe löschn','Schwäbisch':'Eingab löscha'
      }[this._languageValue()] || 'Clear input');
      const v407NormalizeText = (value) => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').trim().toLocaleLowerCase();
      const v407CountryRecords = () => {
        const locale = v407Locale();
        let localNames = null;
        let englishNames = null;
        try { localNames = new Intl.DisplayNames([locale],{type:'region'}); } catch (_) {}
        try { englishNames = new Intl.DisplayNames(['en'],{type:'region'}); } catch (_) {}
        return V407_ISO_COUNTRY_CODES.map((code) => ({
          code,
          local: localNames?.of(code) || code,
          english: englishNames?.of(code) || code
        }));
      };
      const v407PreferredCountryCode = () => {
        const configured = String(this._hass?.config?.country || '').trim().toUpperCase();
        if (/^[A-Z]{2}$/.test(configured)) return configured;
        const region = String(navigator.language || '').match(/[-_]([A-Za-z]{2})$/)?.[1]?.toUpperCase();
        return /^[A-Z]{2}$/.test(region || '') ? region : '';
      };
      const v407ResolveExplicitCountry = (value, records) => {
        const raw = String(value || '').trim();
        if (!raw) return {code:'',record:null,valid:true};
        const normalized = v407NormalizeText(raw);
        const record = records.find((item) => [item.code,item.local,item.english,`${item.local} (${item.code})`].some((candidate) => v407NormalizeText(candidate) === normalized));
        return record ? {code:record.code,record,valid:true} : {code:'',record:null,valid:false};
      };
      const v407FetchJson = async (url, timeoutMs = 9000) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(),timeoutMs);
        try {
          const response = await fetch(url,{signal:controller.signal,headers:{Accept:'application/json'}});
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return await response.json();
        } finally { clearTimeout(timer); }
      };
      const v407CandidateLabel = (candidate) => [candidate.name,candidate.admin1,candidate.country].filter((value,index,array) => value && array.indexOf(value) === index).join(', ');
      const v407NormalizeOpenMeteo = (result) => {
        const latitude = Number(result?.latitude), longitude = Number(result?.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
        const postcodes = Array.isArray(result.postcodes) ? result.postcodes.map(String) : [];
        const candidate = {
          provider:'open-meteo', name:String(result.name || '').trim() || String(result.admin1 || '').trim() || 'Location', latitude, longitude,
          countryCode:String(result.country_code || '').toUpperCase(), country:String(result.country || '').trim(), admin1:String(result.admin1 || '').trim(),
          postcode:postcodes[0] || '', postcodes, importance:Number(result.population || 0)
        };
        candidate.displayLabel = v407CandidateLabel(candidate);
        return candidate;
      };
      const v407NormalizeNominatim = (result) => {
        const latitude = Number(result?.lat), longitude = Number(result?.lon);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
        const address = result?.address || {};
        const name = String(result?.name || address.city || address.town || address.village || address.municipality || address.hamlet || String(result?.display_name || '').split(',')[0] || 'Location').trim();
        const candidate = {
          provider:'nominatim', name, latitude, longitude, countryCode:String(address.country_code || '').toUpperCase(),
          country:String(address.country || '').trim(), admin1:String(address.state || address.region || address.county || '').trim(), postcode:String(address.postcode || '').trim(),
          postcodes:address.postcode ? [String(address.postcode)] : [], importance:Number(result?.importance || 0)
        };
        candidate.displayLabel = v407CandidateLabel(candidate) || String(result?.display_name || name);
        return candidate;
      };
      const v407Dedupe = (items) => {
        const seen = new Set();
        return items.filter((candidate) => {
          if (!candidate) return false;
          const key = `${v407NormalizeText(candidate.name)}|${candidate.countryCode}|${candidate.latitude.toFixed(4)}|${candidate.longitude.toFixed(4)}`;
          if (seen.has(key)) return false;
          seen.add(key); return true;
        });
      };
      const v407Rank = (items, query, countryCode, preferredCountryCode) => {
        const q = v407NormalizeText(query);
        return items.map((candidate,index) => {
          const name = v407NormalizeText(candidate.name), label = v407NormalizeText(candidate.displayLabel), admin = v407NormalizeText(candidate.admin1);
          const postcodes = (candidate.postcodes || [candidate.postcode]).map(v407NormalizeText);
          let score = 0;
          // Explicit country selection stays a hard, dominant signal. The automatically
          // inferred home country is deliberately only a soft preference.
          if (countryCode && candidate.countryCode === countryCode) score += 2000;
          if (!countryCode && preferredCountryCode && candidate.countryCode === preferredCountryCode) score += 55;
          if (postcodes.includes(q)) score += 1400;
          if (name === q) score += 1100;
          else if (label.startsWith(q)) score += 850;
          else if (name.startsWith(q)) score += 700;
          else if (label.includes(q)) score += 360;
          if (admin === q) score += 180;
          else if (admin.includes(q)) score += 110;
          const importance = Number(candidate.importance || 0);
          if (importance > 1) score += Math.min(300,Math.log10(importance + 1) * 40);
          else if (importance > 0) score += Math.min(220,importance * 220);
          return {...candidate,_score:score - index / 1000};
        }).sort((a,b) => b._score - a._score);
      };
      const v407PrimaryIsGood = (items, query, countryCode, preferredCountryCode) => {
        if (!items.length) return false;
        const q = v407NormalizeText(query);
        const strong = (candidate) => {
          const postcodes = (candidate.postcodes || [candidate.postcode]).map(v407NormalizeText);
          const name = v407NormalizeText(candidate.name);
          return postcodes.includes(q) || name === q || name.startsWith(q);
        };
        if (countryCode) return items.some((candidate) => candidate.countryCode === countryCode && strong(candidate));
        if (preferredCountryCode && !String(query).includes(',')) return items.some((candidate) => candidate.countryCode === preferredCountryCode && strong(candidate));
        return items.some(strong);
      };
      const v407SearchOpenMeteo = async (query, countryCode) => {
        const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
        url.searchParams.set('name',query); url.searchParams.set('count','100'); url.searchParams.set('format','json');
        url.searchParams.set('language',String(v407Locale()).split('-')[0] || 'en');
        if (countryCode) url.searchParams.set('countryCode',countryCode);
        const payload = await v407FetchJson(url);
        return (Array.isArray(payload?.results) ? payload.results : []).map(v407NormalizeOpenMeteo).filter(Boolean);
      };
      const v407SearchNominatim = async (query, countryCode, preferredCountryCode, records) => {
        const previous = Number(window.__gewitterradarV407NominatimLastCall || 0);
        const delay = Math.max(0,1000 - (Date.now() - previous));
        if (delay) await new Promise((resolve) => setTimeout(resolve,delay));
        window.__gewitterradarV407NominatimLastCall = Date.now();
        const url = new URL('https://nominatim.openstreetmap.org/search');
        const preferred = records.find((item) => item.code === preferredCountryCode);
        // The inferred home country is only a ranking preference. Do not rewrite the
        // worldwide query itself, otherwise fallback results can be unintentionally narrowed.
        url.searchParams.set('q',query); url.searchParams.set('format','jsonv2'); url.searchParams.set('addressdetails','1'); url.searchParams.set('limit','8');
        url.searchParams.set('accept-language',v407Locale());
        if (countryCode) url.searchParams.set('countrycodes',countryCode.toLowerCase());
        const payload = await v407FetchJson(url);
        return (Array.isArray(payload) ? payload : []).map(v407NormalizeNominatim).filter(Boolean);
      };
      const v407UseCandidate = async (candidate) => {
        const data = {latitude:candidate.latitude,longitude:candidate.longitude,name:candidate.name || candidate.displayLabel};
        if (this._hass?.services?.gewitterradar?.set_reference_coordinates) {
          await this._hass.callService('gewitterradar','set_reference_coordinates',data);
          return true;
        }
        if (this._hass?.states?.['script.gewitterradar_set_reference_coordinates_dashboard']) {
          await this._hass.callService('script','gewitterradar_set_reference_coordinates_dashboard',data);
          return true;
        }
        return false;
      };

      const V407_SAVED_TODO_PREFIX = 'GEWITTERRADAR_PLACE_V1\n';
      const v407SavedTodoEntity = () => {
        const hass = this._hass;
        const configured = String(this._config?.saved_places_entity || '').trim();
        if (configured && hass?.states?.[configured]) return configured;
        const preferred = ['todo.gewitterradar_orte','todo.gewitterradar_saved_places','todo.gewitterradar'];
        for (const entityId of preferred) if (hass?.states?.[entityId]) return entityId;
        const normalizedTargets = new Set(['gewitterradar orte','gewitterradar saved places','gewitterradar']);
        return Object.entries(hass?.states || {}).find(([entityId,state]) =>
          entityId.startsWith('todo.') && normalizedTargets.has(v407NormalizeText(state?.attributes?.friendly_name))
        )?.[0] || '';
      };
      const v407SavedPlaceDescription = (candidate) => V407_SAVED_TODO_PREFIX + JSON.stringify({
        version:1,
        name:String(candidate.name || candidate.displayLabel || '').trim(),
        displayLabel:String(candidate.displayLabel || candidate.name || '').trim(),
        latitude:Number(candidate.latitude),
        longitude:Number(candidate.longitude),
        countryCode:String(candidate.countryCode || '').trim(),
        country:String(candidate.country || '').trim(),
        admin1:String(candidate.admin1 || '').trim(),
        postcode:String(candidate.postcode || '').trim(),
        provider:String(candidate.provider || '').trim()
      });
      const v407ParseSavedPlace = (item) => {
        const description = String(item?.description || '');
        if (!description.startsWith(V407_SAVED_TODO_PREFIX)) return null;
        try {
          const data = JSON.parse(description.slice(V407_SAVED_TODO_PREFIX.length));
          const latitude = Number(data?.latitude), longitude = Number(data?.longitude);
          if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
          const name = String(data?.name || item?.summary || '').trim() || 'Location';
          const displayLabel = String(data?.displayLabel || item?.summary || name).trim();
          return {
            uid:String(item?.uid || ''),
            summary:String(item?.summary || displayLabel || name),
            status:String(item?.status || 'needs_action'),
            provider:String(data?.provider || 'saved'), name, displayLabel, latitude, longitude,
            countryCode:String(data?.countryCode || ''), country:String(data?.country || ''), admin1:String(data?.admin1 || ''),
            postcode:String(data?.postcode || ''), postcodes:data?.postcode ? [String(data.postcode)] : []
          };
        } catch (_) { return null; }
      };
      const v407LoadSavedPlaces = async ({force=false} = {}) => {
        const entityId = v407SavedTodoEntity();
        this._v407SavedPlacesMissing = !entityId;
        if (!entityId) {
          this._v407SavedPlaces = [];
          this._v407RemovedPlaces = [];
          this._v407SavedPlacesEntity = '';
          return [];
        }
        if (!force && this._v407SavedPlacesEntity === entityId && Array.isArray(this._v407SavedPlaces) && Array.isArray(this._v407RemovedPlaces)) return this._v407SavedPlaces;
        if (this._v407SavedPlacesLoading) return this._v407SavedPlacesLoading;
        this._v407SavedPlacesLoading = (async () => {
          try {
            const result = await this._hass.callService('todo','get_items',{status:['needs_action','completed']},{entity_id:entityId},true,true);
            const items = result?.response?.[entityId]?.items;
            const allPlaces = (Array.isArray(items) ? items : []).map(v407ParseSavedPlace).filter(Boolean);
            const byName = (a,b) => a.summary.localeCompare(b.summary,undefined,{sensitivity:'base'});
            const places = allPlaces.filter((place) => place.status !== 'completed').sort(byName);
            const removedPlaces = allPlaces.filter((place) => place.status === 'completed').sort(byName);
            this._v407SavedPlaces = places;
            this._v407RemovedPlaces = removedPlaces;
            this._v407SavedPlacesEntity = entityId;
            this._v407SavedPlacesMissing = false;
            return places;
          } catch (error) {
            console.warn('[Gewitterradar V4.07] Gespeicherte Orte konnten nicht geladen werden.',error);
            this._v407SavedPlaces = [];
            this._v407RemovedPlaces = [];
            this._v407SavedPlacesEntity = entityId;
            return [];
          } finally {
            this._v407SavedPlacesLoading = null;
          }
        })();
        return this._v407SavedPlacesLoading;
      };
      const v407UpdateSavedPlaceStatus = async (place,status) => {
        const entityId = v407SavedTodoEntity();
        if (!entityId) throw new Error('V407_TODO_MISSING');
        const item = String(place?.uid || place?.summary || '').trim();
        if (!item) throw new Error('V407_TODO_ITEM_MISSING');
        await this._hass.callService('todo','update_item',{item,status},{entity_id:entityId});
        await v407LoadSavedPlaces({force:true});
        return true;
      };
      const v407RemoveSavedPlace = async (place) => v407UpdateSavedPlaceStatus(place,'completed');
      const v407RestoreSavedPlace = async (place) => v407UpdateSavedPlaceStatus(place,'needs_action');
      const v407SaveCandidate = async (candidate) => {
        const entityId = v407SavedTodoEntity();
        if (!entityId) throw new Error('V407_TODO_MISSING');
        await v407LoadSavedPlaces({force:true});
        const sameCoordinates = (place) =>
          Math.abs(Number(place.latitude) - Number(candidate.latitude)) < 0.00001 &&
          Math.abs(Number(place.longitude) - Number(candidate.longitude)) < 0.00001;
        const duplicate = (Array.isArray(this._v407SavedPlaces) ? this._v407SavedPlaces : []).find(sameCoordinates);
        if (duplicate) return {saved:false,duplicate:true,restored:false,place:duplicate};
        const removedDuplicate = (Array.isArray(this._v407RemovedPlaces) ? this._v407RemovedPlaces : []).find(sameCoordinates);
        if (removedDuplicate) {
          await v407RestoreSavedPlace(removedDuplicate);
          const restored = (Array.isArray(this._v407SavedPlaces) ? this._v407SavedPlaces : []).find(sameCoordinates) || removedDuplicate;
          return {saved:false,duplicate:false,restored:true,place:restored};
        }
        const item = String(candidate.displayLabel || candidate.name || '').trim() || String(candidate.name || 'Location');
        await this._hass.callService('todo','add_item',{
          item,
          description:v407SavedPlaceDescription(candidate)
        },{entity_id:entityId});
        const refreshed = await v407LoadSavedPlaces({force:true});
        return {saved:true,duplicate:false,restored:false,place:refreshed.find(sameCoordinates) || null};
      };
      const v407FocusCandidate = (candidate) => {
        const latitude = Number(candidate?.latitude), longitude = Number(candidate?.longitude);
        if (!this._map || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
        this._clearRecentStrikeTarget?.();
        this._resetStatusClusterBrowse?.();
        this._statusFocusIndex = -1;
        this._statusFocusSelectedId = null;
        const reference = {
          lat:latitude, lon:longitude,
          label:String(candidate?.name || candidate?.displayLabel || v407Text().savedPlaceFallback),
          available:true
        };
        requestAnimationFrame(() => this._focusReferenceStormRadius?.(reference));
      };

      const v407EnsureLocationSearchDialog = () => {
        const requestedLanguage = String(this._languageValue() || 'English');
        let backdrop = this.shadow.getElementById('v407-location-search-backdrop');
        if (backdrop && backdrop.dataset.v407Language === requestedLanguage) return backdrop;
        if (backdrop) { backdrop.remove(); backdrop = null; }
        const text = v407Text();
        backdrop = document.createElement('div');
        backdrop.className = 'v407-location-search-backdrop';
        backdrop.id = 'v407-location-search-backdrop';
        backdrop.dataset.v407Language = requestedLanguage;
        const coordinateText = V407_COORDINATE_TEXTS[this._languageValue()] || V407_COORDINATE_TEXTS.English;
        backdrop.innerHTML = `<section class="v407-location-search-dialog" role="dialog" aria-modal="true" aria-labelledby="v407-location-search-title">
          <header class="v407-location-search-head"><span class="v407-location-search-emblem" aria-hidden="true"><img src="${V407_LOCATION_SEARCH_GLOBE_ICON}" alt="" draggable="false"></span><div class="v407-location-search-head-copy"><strong id="v407-location-search-title"></strong><div class="v407-location-search-subtitle">${coordinateText.subtitle}</div></div><button type="button" class="v407-location-search-close" aria-label="${text.close}"><img src="${ABOUT_CLOSE_IMAGE}" alt="" draggable="false"></button></header>
          <div class="v407-location-search-body"><div class="v407-location-mode-switch" role="group" aria-label="${text.title}"><button type="button" class="v407-location-mode v407-location-mode-address" aria-pressed="true"><span class="v407-location-mode-icon v407-location-mode-search-icon" aria-hidden="true"><img src="${V407_LOCATION_SEARCH_LOUPE_ICON}" alt="" draggable="false"></span><span>${text.query}</span></button><button type="button" class="v407-location-mode v407-location-mode-coordinates" aria-pressed="false"><span class="v407-location-mode-icon v407-location-mode-target" aria-hidden="true"><img src="${V407_COORDINATE_TARGET_TAB_ICON}" alt="" draggable="false"></span><span>Lat / Lon</span></button></div><form id="v407-location-address-form" class="v407-location-search-grid">
            <div class="v407-location-search-field"><label for="v407-location-query"></label><input id="v407-location-query" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" spellcheck="false"><button type="button" class="v407-location-query-clear" aria-label="${v407ClearQueryLabel()}" title="${v407ClearQueryLabel()}" aria-hidden="true" tabindex="-1">×</button></div>
            <div class="v407-location-search-field"><label for="v407-location-country"></label><input id="v407-location-country" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" spellcheck="false"><button type="button" class="v407-location-country-clear" aria-label="${v407ClearQueryLabel()}" title="${v407ClearQueryLabel()}" aria-hidden="true" tabindex="-1">×</button><div class="v407-country-suggestions"></div></div>
            <button type="submit" class="v407-location-search-submit"></button>
          </form><form class="v407-location-coordinate-form" hidden><div class="v407-location-coordinate-grid"><div class="v407-location-search-field v407-location-coordinate-name"><label for="v407-coordinate-name">${coordinateText.label}</label><input id="v407-coordinate-name" type="text" autocomplete="off" placeholder="${coordinateText.labelPlaceholder}"><button type="button" class="v407-coordinate-name-clear" aria-label="${v407ClearQueryLabel()}" title="${v407ClearQueryLabel()}" aria-hidden="true" tabindex="-1">×</button></div><div class="v407-location-search-field"><label for="v407-coordinate-latitude">${coordinateText.latitude}</label><input id="v407-coordinate-latitude" type="text" inputmode="decimal" autocomplete="off" placeholder="53.83642"><button type="button" class="v407-coordinate-latitude-clear" aria-label="${v407ClearQueryLabel()}" title="${v407ClearQueryLabel()}" aria-hidden="true" tabindex="-1">×</button></div><div class="v407-location-search-field"><label for="v407-coordinate-longitude">${coordinateText.longitude}</label><input id="v407-coordinate-longitude" type="text" inputmode="decimal" autocomplete="off" placeholder="9.95817"><button type="button" class="v407-coordinate-longitude-clear" aria-label="${v407ClearQueryLabel()}" title="${v407ClearQueryLabel()}" aria-hidden="true" tabindex="-1">×</button></div><button type="submit" class="v407-location-search-submit v407-location-coordinate-submit">${coordinateText.apply}</button><button type="button" class="v407-location-search-submit v407-location-coordinate-save" title="${text.saveTitle}">${text.save}</button></div><div class="v407-location-coordinate-hint">${coordinateText.hint}</div></form><div class="v407-location-search-status" role="status" aria-live="polite"></div><div class="v407-location-results"></div>
          <div class="v407-location-search-divider" aria-hidden="true"></div><div class="v407-location-safety-note"><span class="v407-location-safety-medallion" aria-hidden="true"><img src="${V407_LOCATION_SAFETY_ICON}" alt="" draggable="false"></span><span class="v407-location-safety-copy"></span></div><div class="v407-location-advice"><span class="v407-location-advice-medallion" aria-hidden="true"><img src="${V407_LOCATION_ADVICE_ICON}" alt="" draggable="false"></span><div class="v407-location-advice-copy"><strong>${coordinateText.adviceTitle}</strong><p>${coordinateText.helpBefore}<a href="https://www.maptiler.com/tools/coordinates/" target="_blank" rel="noopener noreferrer">MapTiler Coordinates ↗</a>${coordinateText.helpAfter}</p><div class="v407-location-provider-note"></div></div></div></div></section>`;
        const fullscreenDialog = this.shadow.getElementById('map-fullscreen-dialog');
        const overlayHost = this._mapDisplayMode === 'fullscreen' && fullscreenDialog?.open
          ? fullscreenDialog
          : this.shadow;
        overlayHost.appendChild(backdrop);
        const dialog = backdrop.querySelector('.v407-location-search-dialog');
        const queryInput = backdrop.querySelector('#v407-location-query');
        const clearQueryButton = backdrop.querySelector('.v407-location-query-clear');
        const countryInput = backdrop.querySelector('#v407-location-country');
        const clearCountryButton = backdrop.querySelector('.v407-location-country-clear');
        const suggestions = backdrop.querySelector('.v407-country-suggestions');
        const form = backdrop.querySelector('#v407-location-address-form');
        const coordinateForm = backdrop.querySelector('.v407-location-coordinate-form');
        const submit = form.querySelector('.v407-location-search-submit');
        const coordinateName = backdrop.querySelector('#v407-coordinate-name');
        const clearCoordinateNameButton = backdrop.querySelector('.v407-coordinate-name-clear');
        const coordinateLatitude = backdrop.querySelector('#v407-coordinate-latitude');
        const clearCoordinateLatitudeButton = backdrop.querySelector('.v407-coordinate-latitude-clear');
        const coordinateLongitude = backdrop.querySelector('#v407-coordinate-longitude');
        const clearCoordinateLongitudeButton = backdrop.querySelector('.v407-coordinate-longitude-clear');
        const coordinateSave = backdrop.querySelector('.v407-location-coordinate-save');
        const modeAddress = backdrop.querySelector('.v407-location-mode-address');
        const modeCoordinates = backdrop.querySelector('.v407-location-mode-coordinates');
        const providerNote = backdrop.querySelector('.v407-location-provider-note');
        const status = backdrop.querySelector('.v407-location-search-status');
        const results = backdrop.querySelector('.v407-location-results');
        const records = v407CountryRecords();
        backdrop.querySelector('#v407-location-search-title').textContent = text.title;
        queryInput.previousElementSibling.textContent = text.query; queryInput.placeholder = text.queryPlaceholder;
        countryInput.previousElementSibling.textContent = text.country; countryInput.placeholder = text.countryPlaceholder;
        submit.textContent = text.search; providerNote.textContent = text.providerNote; backdrop.querySelector('.v407-location-safety-copy').textContent = text.safety;
        const close = () => { backdrop.classList.remove('open'); suggestions.classList.remove('open'); };
        backdrop.querySelector('.v407-location-search-close').addEventListener('click',close);
        backdrop.addEventListener('click',(event) => { if (event.target === backdrop) close(); });
        backdrop.addEventListener('keydown',(event) => { if (event.key === 'Escape') { event.preventDefault(); close(); } });
        const syncV407CountryClear = () => {
          const visible = !!String(countryInput.value || '').length;
          clearCountryButton.classList.toggle('is-visible',visible);
          clearCountryButton.setAttribute('aria-hidden',visible ? 'false' : 'true');
          clearCountryButton.tabIndex = visible ? 0 : -1;
        };
        const renderSuggestions = () => {
          countryInput.dataset.countryCode = '';
          const q = v407NormalizeText(countryInput.value);
          if (!q) { suggestions.classList.remove('open'); suggestions.replaceChildren(); return; }
          const ranked = records.map((record) => {
            const code = v407NormalizeText(record.code), local = v407NormalizeText(record.local), english = v407NormalizeText(record.english);
            let score = 0; if (code === q) score += 1000; if (local === q || english === q) score += 900; if (code.startsWith(q)) score += 700; if (local.startsWith(q) || english.startsWith(q)) score += 500; if (local.includes(q) || english.includes(q)) score += 200;
            return {record,score};
          }).filter((entry) => entry.score > 0).sort((a,b) => b.score-a.score || a.record.local.localeCompare(b.record.local)).slice(0,8);
          suggestions.replaceChildren(...ranked.map(({record}) => {
            const button = document.createElement('button'); button.type='button'; button.className='v407-country-suggestion'; button.textContent=`${record.local} (${record.code})`;
            button.addEventListener('click',() => { countryInput.value=`${record.local} (${record.code})`; countryInput.dataset.countryCode=record.code; suggestions.classList.remove('open'); syncV407CountryClear(); queryInput.focus(); });
            return button;
          }));
          suggestions.classList.toggle('open',ranked.length > 0);
        };
        countryInput.addEventListener('input',renderSuggestions);
        countryInput.addEventListener('focus',renderSuggestions);
        ['input','change','keyup','search','focus'].forEach((eventName) => countryInput.addEventListener(eventName,syncV407CountryClear));
        clearCountryButton.addEventListener('click',() => {
          countryInput.value='';
          countryInput.dataset.countryCode='';
          suggestions.classList.remove('open');
          suggestions.replaceChildren();
          syncV407CountryClear();
          countryInput.focus({preventScroll:true});
        });
        syncV407CountryClear();
        const setStatus = (message,error=false) => { status.textContent=message || ''; status.classList.toggle('error',!!error); };
        const syncV407CoordinateClear = (input,button) => {
          const visible = !!String(input.value || '').length;
          button.classList.toggle('is-visible',visible);
          button.setAttribute('aria-hidden',visible ? 'false' : 'true');
          button.tabIndex = visible ? 0 : -1;
        };
        [[coordinateName,clearCoordinateNameButton],[coordinateLatitude,clearCoordinateLatitudeButton],[coordinateLongitude,clearCoordinateLongitudeButton]].forEach(([input,button]) => {
          ['input','change','keyup','search','focus'].forEach((eventName) => input.addEventListener(eventName,() => syncV407CoordinateClear(input,button)));
          button.addEventListener('click',() => {
            input.value='';
            syncV407CoordinateClear(input,button);
            input.focus({preventScroll:true});
          });
          syncV407CoordinateClear(input,button);
        });
        const v407CoordinateNumber = (value) => {
          const normalized=String(value??'').trim().replace(/\s+/g,'').replace(',','.');
          if(!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalized)) return NaN;
          return Number(normalized);
        };
        const v407CoordinatePair = (value) => {
          const source=String(value??'').trim(); let match=null;
          match=source.match(/^\s*([+-]?\d{1,2}(?:\.\d+)?)\s*,\s*([+-]?\d{1,3}(?:\.\d+)?)\s*$/);
          if(!match) match=source.match(/^\s*([+-]?\d{1,2}(?:[.,]\d+)?)\s*[;\/]\s*([+-]?\d{1,3}(?:[.,]\d+)?)\s*$/);
          if(!match) match=source.match(/^\s*([+-]?\d{1,2}(?:[.,]\d+)?)\s+([+-]?\d{1,3}(?:[.,]\d+)?)\s*$/);
          if(!match) return null;
          const latitude=v407CoordinateNumber(match[1]),longitude=v407CoordinateNumber(match[2]);
          return Number.isFinite(latitude)&&Number.isFinite(longitude)&&latitude>=-90&&latitude<=90&&longitude>=-180&&longitude<=180?{latitude,longitude}:null;
        };
        const setSearchMode = (mode,{focus=true}={}) => {
          const coordinates=mode==='coordinates';
          form.hidden=coordinates;coordinateForm.hidden=!coordinates;
          modeAddress.setAttribute('aria-pressed',String(!coordinates));modeCoordinates.setAttribute('aria-pressed',String(coordinates));
          providerNote.textContent=text.providerNote;
          suggestions.classList.remove('open');results.replaceChildren();setStatus('');
          if(focus)(coordinates?coordinateName:queryInput).focus({preventScroll:true});
        };
        modeAddress.addEventListener('click',()=>setSearchMode('address'));
        modeCoordinates.addEventListener('click',()=>setSearchMode('coordinates'));
        const pasteCoordinatePair=(event)=>{const pair=v407CoordinatePair(event.clipboardData?.getData('text')||'');if(!pair)return;event.preventDefault();coordinateLatitude.value=String(pair.latitude);coordinateLongitude.value=String(pair.longitude);syncV407CoordinateClear(coordinateLatitude,clearCoordinateLatitudeButton);syncV407CoordinateClear(coordinateLongitude,clearCoordinateLongitudeButton);};
        coordinateLatitude.addEventListener('paste',pasteCoordinatePair);coordinateLongitude.addEventListener('paste',pasteCoordinatePair);
        setSearchMode('address',{focus:false});
        let v407ActiveResultCountry = '';
        const syncV407QueryClear = () => {
          const visible = !!String(queryInput.value || '').length;
          clearQueryButton.classList.toggle('is-visible',visible);
          clearQueryButton.setAttribute('aria-hidden',visible ? 'false' : 'true');
          clearQueryButton.tabIndex = visible ? 0 : -1;
        };
        ['input','change','keyup','search','focus'].forEach((eventName) => queryInput.addEventListener(eventName,syncV407QueryClear));
        clearQueryButton.addEventListener('click',() => {
          queryInput.value='';
          v407ActiveResultCountry='';
          results.replaceChildren();
          setStatus('');
          syncV407QueryClear();
          queryInput.focus({preventScroll:true});
        });
        syncV407QueryClear();
        const v407CountryFlag = (code) => /^[A-Z]{2}$/.test(String(code || ''))
          ? [...String(code)].map((char) => String.fromCodePoint(127397 + char.charCodeAt(0))).join('')
          : '🌐';
        const v407CountryLabel = (code,candidates) => {
          const record = records.find((item) => item.code === code);
          return record?.local || candidates.find((item) => item.country)?.country || code || text.unknownCountry;
        };
        const renderResults = (candidates,{preferredCountryCode='',countryCode=''} = {}) => {
          const source = Array.isArray(candidates) ? candidates : [];
          const groupsByCode = new Map();
          source.forEach((candidate) => {
            const code = String(candidate.countryCode || '').toUpperCase() || 'ZZ';
            if (!groupsByCode.has(code)) groupsByCode.set(code,[]);
            groupsByCode.get(code).push(candidate);
          });
          const groups = [...groupsByCode.entries()].map(([code,items]) => ({
            code,
            items,
            best:Number(items[0]?._score || 0),
            label:v407CountryLabel(code,items)
          })).sort((a,b) => b.best-a.best || a.label.localeCompare(b.label,undefined,{sensitivity:'base'}));
          if (v407ActiveResultCountry && !groupsByCode.has(v407ActiveResultCountry)) v407ActiveResultCountry='';
          if (countryCode && groupsByCode.has(countryCode)) v407ActiveResultCountry=countryCode;

          const fragment = document.createDocumentFragment();
          if (!source.length) { results.replaceChildren(); return; }

          if (groups.length > 1) {
            const bar=document.createElement('div'); bar.className='v407-country-filterbar'; bar.setAttribute('role','toolbar'); bar.setAttribute('aria-label',text.countryFilters);
            const makeFilter=(code,label,count,flag='') => {
              const button=document.createElement('button'); button.type='button'; button.className='v407-country-filter' + (v407ActiveResultCountry===code ? ' active' : '');
              button.textContent=(flag ? flag+' ' : '') + label + ' ('+count+')';
              button.addEventListener('click',() => { v407ActiveResultCountry = v407ActiveResultCountry===code ? '' : code; renderResults(source,{preferredCountryCode,countryCode}); });
              return button;
            };
            const all=makeFilter('',text.allCountries,source.length); all.classList.toggle('active',!v407ActiveResultCountry); bar.appendChild(all);
            groups.forEach((group) => bar.appendChild(makeFilter(group.code,group.label,group.items.length,v407CountryFlag(group.code))));
            fragment.appendChild(bar);
          }
          const summary=document.createElement('div'); summary.className='v407-country-summary';
          summary.textContent = text.resultSummary.replace('{results}',String(source.length)).replace('{countries}',String(groups.length));
          fragment.appendChild(summary);

          const visibleGroups = v407ActiveResultCountry ? groups.filter((group) => group.code===v407ActiveResultCountry) : groups;
          const makeRow = (candidate) => {
            const row = document.createElement('article'); row.className='v407-location-result';
            const copy = document.createElement('div'); const title=document.createElement('div'); title.className='v407-location-result-title'; title.textContent=candidate.displayLabel;
            const meta=document.createElement('div'); meta.className='v407-location-result-meta'; meta.textContent=candidate.latitude.toFixed(5)+'°, '+candidate.longitude.toFixed(5)+'° · '+candidate.provider+(candidate.postcode ? ' · '+candidate.postcode : '');
            copy.append(title,meta); const actions=document.createElement('div'); actions.className='v407-location-result-actions';
            const use=document.createElement('button'); use.type='button'; use.className='v407-location-result-use'; use.textContent=text.use;
            const save=document.createElement('button'); save.type='button'; save.className='v407-location-result-save'; save.textContent=text.save; save.disabled=false; save.title=text.saveTitle;
            use.addEventListener('click',async () => {
              use.disabled=true; setStatus(text.using);
              try {
                const ok=await v407UseCandidate(candidate);
                if (!ok) throw new Error(text.backendMissing);
                close();
                v407FocusCandidate(candidate);
              } catch (error) {
                console.warn('[Gewitterradar V4.07] Bezugsstandort konnte nicht gesetzt werden.',error);
                setStatus(error?.message===text.backendMissing ? text.backendMissing : text.useFailed,true);
              } finally { use.disabled=false; }
            });
            save.addEventListener('click',async () => {
              save.disabled=true; setStatus(text.saving);
              try {
                const result=await v407SaveCandidate(candidate);
                save.textContent=text.saved;
                const saveMessage = result.restored ? text.savedRestored : (result.duplicate ? text.savedDuplicate : text.savedOk);
                setStatus(String(candidate.name || candidate.displayLabel || '') + ' ' + saveMessage);
              } catch (error) {
                console.warn('[Gewitterradar V4.07] Ort konnte nicht gespeichert werden.',error);
                setStatus(error?.message==='V407_TODO_MISSING' ? text.savedSetup : text.saveFailed,true);
                save.disabled=false;
              }
            });
            actions.append(use,save); row.append(copy,actions); return row;
          };

          visibleGroups.forEach((group,index) => {
            const details=document.createElement('details'); details.className='v407-country-group';
            details.open = !!v407ActiveResultCountry || index===0;
            const head=document.createElement('summary');
            const flag=document.createElement('span'); flag.className='v407-country-flag'; flag.textContent=v407CountryFlag(group.code); flag.setAttribute('aria-hidden','true');
            const name=document.createElement('span'); name.className='v407-country-name'; name.textContent=group.label;
            const count=document.createElement('span'); count.className='v407-country-count'; count.textContent='('+group.items.length+')';
            head.append(flag,name,count);
            if (!countryCode && preferredCountryCode && group.code===preferredCountryCode) {
              const home=document.createElement('span'); home.className='v407-country-home'; home.textContent=text.homeCountry; head.appendChild(home);
            }
            const rows=document.createElement('div'); rows.className='v407-country-rows';
            const initial = v407ActiveResultCountry ? 8 : 4;
            group.items.slice(0,initial).forEach((candidate) => rows.appendChild(makeRow(candidate)));
            if (group.items.length > initial) {
              const more=document.createElement('button'); more.type='button'; more.className='v407-country-more';
              more.textContent=text.showMore.replace('{count}',String(group.items.length-initial));
              more.addEventListener('click',(event) => {
                event.preventDefault(); event.stopPropagation();
                group.items.slice(initial).forEach((candidate) => rows.insertBefore(makeRow(candidate),more));
                more.remove();
              });
              rows.appendChild(more);
            }
            details.append(head,rows); fragment.appendChild(details);
          });
          results.replaceChildren(fragment);
        };
        const v407CoordinateCandidate = () => {
          const latitude=v407CoordinateNumber(coordinateLatitude.value),longitude=v407CoordinateNumber(coordinateLongitude.value);
          if(!Number.isFinite(latitude)||latitude<-90||latitude>90||!Number.isFinite(longitude)||longitude<-180||longitude>180){setStatus(coordinateText.invalid,true);(!Number.isFinite(latitude)||latitude<-90||latitude>90?coordinateLatitude:coordinateLongitude).focus({preventScroll:true});return null;}
          const fallback=latitude.toFixed(6)+', '+longitude.toFixed(6);const label=String(coordinateName.value||'').trim();
          return {provider:'Lat / Lon',name:label||fallback,displayLabel:label||fallback,latitude,longitude,countryCode:'',country:'',admin1:'',postcode:'',postcodes:[]};
        };
        const v407ResetCoordinateSave = () => { if (!coordinateSave.disabled) coordinateSave.textContent=text.save; };
        coordinateName.addEventListener('input',v407ResetCoordinateSave);coordinateLatitude.addEventListener('input',v407ResetCoordinateSave);coordinateLongitude.addEventListener('input',v407ResetCoordinateSave);
        coordinateSave.addEventListener('click',async () => {
          const candidate=v407CoordinateCandidate();if(!candidate)return;
          coordinateSave.disabled=true;setStatus(text.saving);
          try {
            const result=await v407SaveCandidate(candidate);
            coordinateSave.textContent=text.saved;
            const saveMessage=result.restored?text.savedRestored:(result.duplicate?text.savedDuplicate:text.savedOk);
            setStatus(String(candidate.name||candidate.displayLabel||'')+' '+saveMessage);
          } catch(error) {
            console.warn('[Gewitterradar V4.07] Koordinaten konnten nicht gespeichert werden.',error);
            setStatus(error?.message==='V407_TODO_MISSING'?text.savedSetup:text.saveFailed,true);
            coordinateSave.textContent=text.save;
          } finally { coordinateSave.disabled=false; }
        });
        coordinateForm.addEventListener('submit',async (event) => {
          event.preventDefault();
          const candidate=v407CoordinateCandidate();if(!candidate)return;
          const apply=coordinateForm.querySelector('.v407-location-coordinate-submit');apply.disabled=true;setStatus(text.using);
          try { const ok=await v407UseCandidate(candidate);if(!ok)throw new Error(text.backendMissing);close();v407FocusCandidate(candidate); }
          catch(error){console.warn('[Gewitterradar V4.07] Koordinaten konnten nicht als Bezugsstandort gesetzt werden.',error);setStatus(error?.message===text.backendMissing?text.backendMissing:text.useFailed,true);}
          finally { apply.disabled=false; }
        });
        form.addEventListener('submit',async (event) => {
          event.preventDefault(); suggestions.classList.remove('open');
          const query = String(queryInput.value || '').trim(); if (!query) { queryInput.focus(); return; }
          const country = countryInput.dataset.countryCode ? {code:countryInput.dataset.countryCode,valid:true} : v407ResolveExplicitCountry(countryInput.value,records);
          if (!country.valid) { setStatus(text.invalidCountry,true); countryInput.focus(); return; }
          const countryCode = country.code || '';
          const preferredCountryCode = countryCode ? '' : v407PreferredCountryCode();
          submit.disabled=true; results.replaceChildren(); setStatus(text.searching);
          try {
            const primary = await v407SearchOpenMeteo(query,countryCode);
            let combined = primary;
            const rankedPrimary = v407Rank(v407Dedupe(primary),query,countryCode,preferredCountryCode);
            if (!v407PrimaryIsGood(rankedPrimary,query,countryCode,preferredCountryCode)) {
              const fallback = await v407SearchNominatim(query,countryCode,preferredCountryCode,records);
              combined = [...primary,...fallback];
            }
            const ranked = v407Rank(v407Dedupe(combined),query,countryCode,preferredCountryCode);
            v407ActiveResultCountry=''; renderResults(ranked,{preferredCountryCode,countryCode}); setStatus(ranked.length ? '' : text.noResults,ranked.length === 0);
          } catch (error) { console.warn('[Gewitterradar V4.07] Ortssuche fehlgeschlagen.',error); setStatus(text.providerError,true); }
          finally { submit.disabled=false; }
        });
        dialog.addEventListener('click',(event) => event.stopPropagation());
        return backdrop;
      };
      const openV407LocationSearch = () => {
        const backdrop = v407EnsureLocationSearchDialog();
        if (this._mapDisplayMode === 'fullscreen') this._setFullscreenAuxiliaryOverlayHost(true);
        backdrop.classList.add('open');
        requestAnimationFrame(() => backdrop.querySelector('#v407-location-query')?.focus({preventScroll:true}));
      };

      settingsLocationButton?.addEventListener('click',(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!this._hass?.states?.[this._locationSelectEntity()]) return;
        const open = locationDropdown?.classList.contains('open');
        if (open) {
          closeLocationDropdown(false);
          return;
        }
        closeLanguageDropdown(false);
        closeClusterResolutionDropdown(false);
        renderLocationDropdown();
        positionLocationDropdown(settingsLocationButton);
        void v407LoadSavedPlaces().then(() => {
          if (!locationDropdown?.classList.contains('open')) return;
          renderLocationDropdown();
          if (locationDropdownAnchor) positionLocationDropdown(locationDropdownAnchor);
        });
      });

      // V3.99313 – Hauptansicht verwendet exakt dasselbe Dropdown wie die Einstellungen.
      locationMainButton?.addEventListener('click',(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (performance.now() < (this._mapLocationSuppressClickUntil || 0)) return;
        if (!this._hass?.states?.[this._locationSelectEntity()]) return;
        const openFromMain = locationDropdown?.classList.contains('open') && locationDropdownAnchor === locationMainButton;
        if (openFromMain) {
          closeLocationDropdown(false);
          return;
        }
        closeLanguageDropdown(false);
        closeClusterResolutionDropdown(false);
        closeLocationDropdown(false);
        renderLocationDropdown();
        positionLocationDropdown(locationMainButton);
        void v407LoadSavedPlaces().then(() => {
          if (!locationDropdown?.classList.contains('open')) return;
          renderLocationDropdown();
          if (locationDropdownAnchor) positionLocationDropdown(locationDropdownAnchor);
        });
      });

      locationDropdown?.addEventListener('click',async (event) => {
        const search = event.target?.closest?.('.location-search-action');
        if (search) {
          event.preventDefault(); event.stopPropagation();
          closeLocationDropdown(false);
          openV407LocationSearch();
          return;
        }
        const removeSavedButton = event.target?.closest?.('.location-saved-remove');
        if (removeSavedButton) {
          event.preventDefault(); event.stopPropagation();
          const uid = String(removeSavedButton.dataset.savedPlaceUid || '');
          const place = (Array.isArray(this._v407SavedPlaces) ? this._v407SavedPlaces : []).find((item) => String(item.uid || '') === uid);
          if (!place) return;
          removeSavedButton.disabled = true;
          try {
            await v407RemoveSavedPlace(place);
            renderLocationDropdown();
            if (locationDropdownAnchor) positionLocationDropdown(locationDropdownAnchor);
          } catch (error) {
            console.warn('[Gewitterradar V4.07] Gespeicherter Ort konnte nicht entfernt werden.',error);
            removeSavedButton.disabled = false;
          }
          return;
        }
        const restoreSavedButton = event.target?.closest?.('.location-saved-restore');
        if (restoreSavedButton) {
          event.preventDefault(); event.stopPropagation();
          const uid = String(restoreSavedButton.dataset.savedPlaceUid || '');
          const place = (Array.isArray(this._v407RemovedPlaces) ? this._v407RemovedPlaces : []).find((item) => String(item.uid || '') === uid);
          if (!place) return;
          restoreSavedButton.disabled = true;
          try {
            await v407RestoreSavedPlace(place);
            renderLocationDropdown();
            if (locationDropdownAnchor) positionLocationDropdown(locationDropdownAnchor);
          } catch (error) {
            console.warn('[Gewitterradar V4.07] Gespeicherter Ort konnte nicht wiederhergestellt werden.',error);
            restoreSavedButton.disabled = false;
          }
          return;
        }
        const savedButton = event.target?.closest?.('.location-saved-option');
        if (savedButton) {
          event.preventDefault(); event.stopPropagation();
          const uid = String(savedButton.dataset.savedPlaceUid || '');
          const place = (Array.isArray(this._v407SavedPlaces) ? this._v407SavedPlaces : []).find((item) => String(item.uid || '') === uid);
          if (!place) return;
          try {
            const ok = await v407UseCandidate(place);
            if (!ok) throw new Error(v407Text().backendMissing);
            closeLocationDropdown(false);
            v407FocusCandidate(place);
          } catch (error) {
            console.warn('[Gewitterradar V4.07] Gespeicherter Ort konnte nicht verwendet werden.',error);
          }
          return;
        }
        const option = event.target?.closest?.('.location-option');
        const value = option?.dataset?.location;
        if (!value || !this._locationOptions().includes(value)) return;
        event.preventDefault();
        event.stopPropagation();
        setLocationOption(value);
        closeLocationDropdown(false);
        this._render();
      });

      // V4.07: close the location menu when the user taps/clicks outside it.
      // Rebind on render so the handler always references the current DOM nodes.
      if (this._v407LocationOutsidePointerHandler) {
        document.removeEventListener('pointerdown',this._v407LocationOutsidePointerHandler,true);
      }
      this._v407LocationOutsidePointerHandler = (event) => {
        if (!locationDropdown?.classList.contains('open')) return;
        const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
        const mapLocationOverlay = this.shadow?.getElementById('map-location-overlay');
        if (path.includes(locationDropdown) || path.includes(settingsLocationButton) || path.includes(locationMainButton) || (mapLocationOverlay && path.includes(mapLocationOverlay))) return;
        closeLocationDropdown(false);
      };
      document.addEventListener('pointerdown',this._v407LocationOutsidePointerHandler,true);

      if (this._v40823ClusterResolutionOutsidePointerHandler) {
        document.removeEventListener('pointerdown',this._v40823ClusterResolutionOutsidePointerHandler,true);
      }
      this._v40823ClusterResolutionOutsidePointerHandler = (event) => {
        if (!clusterResolutionDropdown?.classList.contains('open')) return;
        const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
        if (path.includes(clusterResolutionDropdown) || path.includes(settingsClusterResolutionButton)) return;
        closeClusterResolutionDropdown(false);
      };
      document.addEventListener('pointerdown',this._v40823ClusterResolutionOutsidePointerHandler,true);

      // V3.519 – Einstellungs-Popup öffnen/schließen.
      const openSettings = () => {
        closeClusterResolutionDropdown(false);
        closeLocationDropdown(false);
        this._syncHelpMenu();
        this._syncModuleView?.();
        settingsBackdrop?.classList.add('open');
        settingsClose?.focus?.({ preventScroll:true });
      };
      const closeSettings = () => {
        closeLanguageDropdown(false);
        closeClusterResolutionDropdown(false);
        closeLocationDropdown(false);
        closeRadiusKeypad(false);
        settingsBackdrop?.classList.remove('open');
        settingsOpen?.focus?.({ preventScroll:true });
      };

      const releaseHistoryGermanLanguages = new Set(['Deutsch','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch']);
      const syncReleaseHistoryLanguage = (requested = '') => {
        let language = requested || this._releaseHistoryLanguage || '';
        if (!language) {
          const appLanguage = String(this._languageValue?.() || 'English');
          language = releaseHistoryGermanLanguages.has(appLanguage) ? 'de' : 'en';
        }
        if (language !== 'de' && language !== 'en') language = 'en';
        this._releaseHistoryLanguage = language;
        for (const panel of this.shadow.querySelectorAll('[data-release-history-lang]')) {
          panel.hidden = panel.dataset.releaseHistoryLang !== language;
        }
        for (const button of releaseHistoryLanguageButtons) {
          button.setAttribute('aria-pressed',button.dataset.releaseHistoryLanguage === language ? 'true' : 'false');
        }
        const german = language === 'de';
        const kicker = this.shadow.getElementById('release-history-kicker');
        const title = this.shadow.getElementById('release-history-title');
        const toggle = this.shadow.getElementById('release-history-language-toggle');
        if (kicker) kicker.textContent = german ? 'Gewitterradar · Versionsverlauf' : 'Gewitterradar · Release history';
        if (title) title.textContent = german ? 'Versionsverlauf' : 'Release history';
        if (toggle) toggle.setAttribute('aria-label',german ? 'Sprache des Versionsverlaufs' : 'Release history language');
        releaseHistoryClose?.setAttribute('aria-label',german ? 'Versionsverlauf schließen' : 'Close release history');
      };
      for (const button of releaseHistoryLanguageButtons) {
        button.addEventListener('click',() => syncReleaseHistoryLanguage(button.dataset.releaseHistoryLanguage || 'en'));
      }

      const openReleaseHistory = () => {
        syncReleaseHistoryLanguage();
        releaseHistoryBackdrop?.classList.add('open');
        releaseHistoryBackdrop?.setAttribute('aria-hidden','false');
        releaseHistoryClose?.focus?.({ preventScroll:true });
      };
      const closeReleaseHistory = (restoreFocus = true) => {
        releaseHistoryBackdrop?.classList.remove('open');
        releaseHistoryBackdrop?.setAttribute('aria-hidden','true');
        if (restoreFocus) releaseHistoryBadge?.focus?.({ preventScroll:true });
      };
      releaseHistoryBadge?.addEventListener('click',openReleaseHistory);
      releaseHistoryBadge?.addEventListener('keydown',(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openReleaseHistory();
      });
      releaseHistoryClose?.addEventListener('click',() => closeReleaseHistory(true));
      releaseHistoryBackdrop?.addEventListener('click',(event) => {
        if (event.target === releaseHistoryBackdrop) closeReleaseHistory(true);
      });
      releaseHistoryDialog?.addEventListener('click',(event) => event.stopPropagation());

      settingsOpen?.addEventListener('click',openSettings);
      settingsClose?.addEventListener('click',closeSettings);
      settingsBackdrop?.addEventListener('click',(event) => {
        closeLanguageDropdown(false);
        closeClusterResolutionDropdown(false);
        closeLocationDropdown(false);
        if (event.target === settingsBackdrop) closeSettings();
      });
      settingsDialog?.addEventListener('click',(event) => event.stopPropagation());

      // V3.99316 – vollständiges Accordion für den knappen Einstellungsdialog.
      // Alle Gruppen starten geschlossen. Sobald eine Gruppe geöffnet wird,
      // schließen sich alle übrigen Gruppen automatisch. Damit kann der Dialog
      // auch auf kleineren Displays nicht durch mehrere gleichzeitig geöffnete
      // Bereiche unnötig in die Höhe wachsen. Der interne Scrollbereich bleibt
      // als Sicherheitsnetz für einzelne hohe Gruppen erhalten.
      const settingsSections = [...this.shadow.querySelectorAll('details.settings-collapsible')];
      let settingsAccordionBusy = false;
      settingsSections.forEach((section) => {
        section.open = false;
        section.addEventListener('toggle',() => {
          // Ein zugeklappter Abschnitt darf kein frei schwebendes Custom-Menü
          // zurücklassen. Die Dropdown-Mechanik selbst bleibt unverändert.
          if (!section.open) {
            closeLanguageDropdown(false);
            closeClusterResolutionDropdown(false);
            closeLocationDropdown(false);
            return;
          }
          if (settingsAccordionBusy) return;
          settingsAccordionBusy = true;
          closeLanguageDropdown(false);
          closeClusterResolutionDropdown(false);
          closeLocationDropdown(false);
          for (const other of settingsSections) {
            if (other !== section && other.open) other.open = false;
          }
          settingsAccordionBusy = false;
        });
      });

      this.shadow.addEventListener('keydown',(event) => {
        if (radiusKeypadBackdrop?.classList.contains('open')) {
          if (/^[0-9]$/.test(event.key)) {
            event.preventDefault();
            pressRadiusKeypad(event.key);
            return;
          }
          if (event.key === 'Backspace' || event.key === 'Delete') {
            event.preventDefault();
            pressRadiusKeypad(event.key === 'Backspace' ? 'backspace' : 'clear');
            return;
          }
          if (event.key === 'Enter') {
            event.preventDefault();
            applyRadiusKeypad();
            return;
          }
          if (event.key === 'Escape') {
            event.preventDefault();
            closeRadiusKeypad(true);
            return;
          }
        }
        if (event.key === 'Escape' && releaseHistoryBackdrop?.classList.contains('open')) {
          event.preventDefault();
          closeReleaseHistory(true);
          return;
        }
        if (event.key === 'Escape' && languageDropdown?.classList.contains('open')) {
          event.preventDefault();
          closeLanguageDropdown(true);
          return;
        }
        if (event.key === 'Escape' && locationDropdown?.classList.contains('open')) {
          event.preventDefault();
          closeLocationDropdown(true);
          return;
        }
        if (event.key === 'Escape' && clusterResolutionDropdown?.classList.contains('open')) {
          event.preventDefault();
          closeClusterResolutionDropdown(true);
          return;
        }
        if (event.key === 'Escape' && settingsBackdrop?.classList.contains('open')) {
          event.preventDefault();
          closeSettings();
        }
      });

      // Gleicher HA-Helper wie der vorhandene Schalter in der Hauptansicht.
      settingsAnimationToggle?.addEventListener('click',() => {
        if (!this._hass) return;
        this._toggleSetting(this._animationEntity());
      });

      // V3.528 – persistente Gewittersimulation.
      // Der Helper speichert den Zustand in Home Assistant und bleibt damit auch
      // nach App-/Browser-Neustart erhalten. Im Popup bleiben die beiden Test-
      // buttons immer erreichbar; der Helper steuert die zusätzlichen Testbuttons
      // in der Hauptansicht.
      settingsTestsToggle?.addEventListener('click',() => {
        if (!this._hass) return;
        this._toggleSetting(this._stormSimulationEntity());
      });

      settingsCompassCalibrationToggle?.addEventListener('click',() => {
        this._setCompassCalibrationEnabled(!this._compassCalibrationEnabled);
      });
      const calibrationButton = this.shadow.getElementById('compass-calibration-measurements');
      const calibrationBackdrop = this.shadow.getElementById('compass-calibration-modal-backdrop');
      const closeCalibration = () => {
        calibrationBackdrop?.classList.remove('open');
        calibrationBackdrop?.setAttribute('aria-hidden','true');
        calibrationButton?.focus();
      };
      calibrationButton?.addEventListener('click',() => {
        this._ensureCompassCalibrationMeasurement();
        calibrationBackdrop?.classList.add('open');
        calibrationBackdrop?.setAttribute('aria-hidden','false');
        const modal=calibrationBackdrop?.querySelector('.compass-calibration-modal');
        if(modal)modal.scrollTop=0;
        this.shadow.getElementById('compass-calibration-close')?.focus();
      });
      this.shadow.getElementById('compass-calibration-close')?.addEventListener('click',closeCalibration);
      calibrationBackdrop?.addEventListener('click',(event) => { if (event.target === calibrationBackdrop) closeCalibration(); });
      const copyButton=this.shadow.getElementById('compass-calibration-copy');copyButton.dataset.labelKey='calibration.copy_core';copyButton.dataset.tooltipKey='calibration.tip_copy_core';
      const detailsButton=this.shadow.getElementById('compass-calibration-copy-details');detailsButton.dataset.labelKey='calibration.copy_all';detailsButton.dataset.tooltipKey='calibration.tip_copy_all';
      const downloadButton=this.shadow.getElementById('compass-calibration-download');downloadButton.dataset.labelKey='calibration.download';
      downloadButton.dataset.tooltipKey='calibration.tip_download';
      copyButton?.addEventListener('click',() => this._copyCompassCalibrationText(this._compassCalibrationReportText,copyButton));
      detailsButton?.addEventListener('click',() => this._copyCompassCalibrationText(this._compassCalibrationDetailText,detailsButton));
      downloadButton?.addEventListener('click',() => this._downloadCompassCalibrationLog());
      const ringLabels={circle:'calibration.ring_circle',ellipse:'calibration.ring_ellipse',maximum:'calibration.ring_maximum',safety:'calibration.ring_safety',cover:'calibration.ring_cover',target:'calibration.ring_target',visual:'calibration.ring_visual',protected:'calibration.ring_protected',backing:'calibration.ring_backing',bounding:'calibration.ring_bounding',gapring:'calibration.ring_gap',outer:'calibration.ring_outer',angles:'calibration.ring_angles',centers:'calibration.ring_centers',rays:'calibration.ring_rays'};
      const ringTips={cover:'calibration.tip_cover',target:'calibration.tip_target',visual:'calibration.tip_visual',protected:'calibration.tip_protected',backing:'calibration.tip_backing',bounding:'calibration.tip_bounding',gapring:'calibration.tip_gap'};
      this.shadow.querySelectorAll('[data-calibration-ring-controls]').forEach((ringControls)=>{ringControls.replaceChildren();Object.entries(ringLabels).forEach(([key,labelKey])=>{const row=document.createElement('div'),input=document.createElement('input'),label=document.createElement('span'),info=document.createElement('button'),help=document.createElement('div'),tipKey=ringTips[key];row.className='compass-calibration-ring-row';input.type='checkbox';input.dataset.ringKey=key;label.dataset.labelKey=labelKey;label.textContent=this._t(labelKey);info.type='button';info.className='compass-calibration-info';info.textContent='ⓘ';info.dataset.ringTipLabel=tipKey||labelKey;info.title=tipKey?this._t(tipKey):`${this._t(labelKey)}. ${this._t('calibration.tip_display_only')}`;info.setAttribute('aria-label',info.title);help.className='compass-calibration-ring-help';help.textContent=info.title;input.addEventListener('change',()=>{this._compassCalibrationRings[key]=input.checked;this._syncCompassCalibrationRingControls();this._updateCompassCalibrationOverlay();});info.addEventListener('click',()=>help.classList.toggle('open'));row.append(input,label,info,help);ringControls.append(row);});});
      this.shadow.querySelectorAll('[data-calibration-presets]').forEach((wrap)=>{wrap.replaceChildren();[['minimal','calibration.preset_minimal'],['fitting','calibration.preset_fitting'],['all','calibration.preset_all']].forEach(([preset,labelKey])=>{const button=document.createElement('button');button.type='button';button.className='compass-calibration-preset';button.dataset.labelKey=labelKey;button.textContent=this._t(labelKey);button.addEventListener('click',()=>this._applyCompassCalibrationPreset(preset));wrap.append(button);});});
      this._syncCompassCalibrationRingControls();
      const optionsButton=this.shadow.getElementById('compass-calibration-options'),quick=this.shadow.getElementById('compass-calibration-quick');
      optionsButton?.addEventListener('click',()=>{if(quick?.classList.contains('open'))this._closeCompassCalibrationQuick(true);else this._openCompassCalibrationQuick();});
      this.shadow.getElementById('compass-calibration-quick-close')?.addEventListener('click',()=>this._closeCompassCalibrationQuick(true));

      settingsMedallionCalibrationToggle?.addEventListener('click',()=>this._setMedallionCalibrationEnabled(!this._medallionCalibrationEnabled));
      const medallionButton=this.shadow.getElementById('medallion-calibration-measurements');
      const medallionBackdrop=this.shadow.getElementById('medallion-calibration-modal-backdrop');
      medallionButton?.addEventListener('click',()=>this._openMedallionCalibration());
      this.shadow.getElementById('medallion-calibration-close')?.addEventListener('click',()=>this._closeMedallionCalibration(true));
      this.shadow.getElementById('medallion-calibration-full')?.addEventListener('click',()=>this._setMedallionDiagnosticWindowLevel('full'));
      this.shadow.getElementById('medallion-calibration-compact')?.addEventListener('click',()=>this._setMedallionDiagnosticWindowLevel('compact'));
      this.shadow.getElementById('medallion-calibration-minimize')?.addEventListener('click',()=>this._setMedallionDiagnosticWindowLevel('collapsed'));
      this.shadow.getElementById('medallion-calibration-dock-left')?.addEventListener('click',()=>this._setMedallionDiagnosticDock('left'));
      this.shadow.getElementById('medallion-calibration-dock-right')?.addEventListener('click',()=>this._setMedallionDiagnosticDock('right'));
      medallionBackdrop?.addEventListener('click',(event)=>{if(event.target===medallionBackdrop)this._closeMedallionCalibration(true);});
      this._bindMedallionDiagnosticWindowDrag();
      this.shadow.getElementById('medallion-calibration-copy')?.addEventListener('click',(event)=>this._copyMedallionCalibrationText(this._medallionCalibrationReportText,event.currentTarget));
      this.shadow.getElementById('medallion-calibration-copy-details')?.addEventListener('click',(event)=>this._copyMedallionCalibrationText(this._medallionCalibrationDetailText,event.currentTarget));
      this.shadow.getElementById('medallion-calibration-download')?.addEventListener('click',()=>this._downloadMedallionCalibrationLog());
      this.shadow.querySelectorAll('[data-medallion-preset]').forEach((button)=>button.addEventListener('click',()=>this._setMedallionDiagnosticMode(button.dataset.medallionPreset)));
      this.shadow.getElementById('medallion-diagnostic-cycle')?.addEventListener('click',()=>this._cycleMedallionDiagnosticMode());
      this.shadow.querySelectorAll('[data-medallion-angle]').forEach((button)=>button.addEventListener('click',()=>this._setMedallionDiagnosticAngle(Number(button.dataset.medallionAngle))));
      this.shadow.querySelectorAll('[data-medallion-arrow]').forEach((button)=>button.addEventListener('click',()=>this._setMedallionDiagnosticArrow(button.dataset.medallionArrow==='on')));
      this.shadow.querySelectorAll('[data-medallion-animation]').forEach((button)=>button.addEventListener('click',()=>this._setMedallionDiagnosticAnimation(button.dataset.medallionAnimation==='on')));
      this.shadow.querySelectorAll('[data-medallion-freeze]').forEach((button)=>button.addEventListener('click',()=>this._setMedallionDiagnosticFreeze(button.dataset.medallionFreeze==='on')));
      settingsDiagnosticsToggle?.addEventListener('click',()=>this._diagnostics.enabled?this._stopDiagnostics():this._startDiagnostics());
      this._bindDiagnosticControls();

      settingsRadiiToggle?.addEventListener('click',() => {
        this._showMainRadii = !this._showMainRadii;
        const root = this.shadow.getElementById('card-root');
        root?.classList.toggle('radii-visible',this._showMainRadii);
        settingsRadiiToggle.classList.toggle('on',this._showMainRadii);
        settingsRadiiToggle.setAttribute('aria-checked',this._showMainRadii ? 'true' : 'false');
      });

      const applyClusterJumpSeconds = () => {
        if (!settingsClusterJumpSeconds) return;
        const seconds = Math.round(Number(settingsClusterJumpSeconds.value));
        if (!Number.isFinite(seconds) || seconds < 5 || seconds > 3600) {
          const fallback = Math.round((this._statusClusterBrowseFiniteTimeoutMs || 10000) / 1000);
          settingsClusterJumpSeconds.value = String(fallback);
          return;
        }
        this._setStatusClusterBrowseTimeoutV40802(seconds * 1000);
        this._render();
      };
      settingsClusterJumpSeconds?.addEventListener('focus',() => {
        if (Number(this._statusClusterBrowseTimeoutMs) !== 0) return;
        this._setStatusClusterBrowseTimeoutV40802(this._statusClusterBrowseFiniteTimeoutMs || 10000);
        this._render();
      });
      settingsClusterJumpSeconds?.addEventListener('change',applyClusterJumpSeconds);
      settingsClusterJumpSeconds?.addEventListener('keydown',(event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        applyClusterJumpSeconds();
        settingsClusterJumpSeconds.blur?.();
      });
      settingsClusterJumpInfinite?.addEventListener('click',() => {
        const next = Number(this._statusClusterBrowseTimeoutMs) === 0
          ? (this._statusClusterBrowseFiniteTimeoutMs || 10000)
          : 0;
        this._setStatusClusterBrowseTimeoutV40802(next);
        this._render();
      });



      // V3.9934 – Aura Ein/Aus. Die Regler werden im Renderpfad nur bei EIN gezeigt.
      settingsAuraToggle?.addEventListener('click',() => {
        if (!this._hass) return;
        const next = !this._auraEnabled();
        this._settingsAuraEnabledPreview = next;
        clearTimeout(this._settingsAuraEnabledPreviewTimer);
        this._settingsAuraEnabledPreviewTimer = setTimeout(() => {
          this._settingsAuraEnabledPreview = null;
          this._settingsAuraEnabledPreviewTimer = null;
          this._render();
        },2500);
        this._switchSetting(this._auraEntity(),next);
        this._syncRadiusAuraSvg(this._home(),true);
        this._render();
      });

      const previewAuraSlider = (kind,input) => {
        if (!input) return;
        const isWidth = kind === 'width';
        const min = isWidth ? AURA_WIDTH_MIN : AURA_INTENSITY_MIN;
        const max = isWidth ? AURA_WIDTH_MAX : AURA_INTENSITY_MAX;
        const value = clamp(Math.round(Number(input.value) || 0),min,max);
        if (isWidth) this._settingsAuraWidthPreview = value;
        else this._settingsAuraIntensityPreview = value;
        const output = this.shadow.getElementById(isWidth ? 'settings-aura-width-value' : 'settings-aura-intensity-value');
        if (output) output.textContent = `${value} %`;
        this._syncRadiusAuraSvg(this._home(),true);
      };
      const persistAuraSlider = (kind,input) => {
        if (!this._hass || !input) return;
        previewAuraSlider(kind,input);
        const isWidth = kind === 'width';
        const value = isWidth ? this._auraWidthValue() : this._auraIntensityValue();
        const timerName = isWidth ? '_settingsAuraWidthPreviewTimer' : '_settingsAuraIntensityPreviewTimer';
        clearTimeout(this[timerName]);
        // V3.9936 – Pending-Wert lange genug halten, bis HA den neuen Helper-
        // Zustand bestätigt. Der hass-Setter räumt ihn sofort nach Bestätigung auf;
        // 10 s sind nur ein Sicherheitsnetz bei fehlgeschlagenem Serviceaufruf.
        this[timerName] = setTimeout(() => {
          if (isWidth) this._settingsAuraWidthPreview = null;
          else this._settingsAuraIntensityPreview = null;
          this[timerName] = null;
          this._render();
        },10000);
        this._numberSetting(isWidth ? this._auraWidthEntity() : this._auraIntensityEntity(),value);
      };
      const bindAuraRange = (kind,input) => {
        if (!input) return;
        let lastPersistedValue = null;
        let lastPersistAt = 0;
        const begin = () => {
          input.dataset.interacting = '1';
          previewAuraSlider(kind,input);
        };
        const preview = () => {
          input.dataset.interacting = '1';
          previewAuraSlider(kind,input);
        };
        const finish = () => {
          if (input.dataset.interacting !== '1') return;
          input.dataset.interacting = '0';
          const value = Number(input.value);
          const now = performance.now();
          if (value !== lastPersistedValue || now-lastPersistAt > 500) {
            lastPersistedValue = value;
            lastPersistAt = now;
            persistAuraSlider(kind,input);
          }
        };
        input.addEventListener('pointerdown',begin,{passive:true});
        input.addEventListener('touchstart',begin,{passive:true});
        input.addEventListener('mousedown',begin,{passive:true});
        input.addEventListener('input',preview);
        input.addEventListener('change',finish);
        input.addEventListener('pointerup',finish,{passive:true});
        input.addEventListener('touchend',finish,{passive:true});
        input.addEventListener('pointercancel',finish,{passive:true});
        input.addEventListener('blur',finish);
      };
      bindAuraRange('width',settingsAuraWidth);
      bindAuraRange('intensity',settingsAuraIntensity);

      // V3.532 – beide Standort-Auswahllisten schreiben in denselben persistenten
      // input_select. Gespeichert wird direkt die Entity-ID; dadurch bleibt die Auswahl nach App-/Browser-Neustart erhalten.
      const setLocationOption = async (option) => {
        if (!this._hass || !option) return;
        this._settingsLocationPreview = option;
        clearTimeout(this._settingsLocationPreviewTimer);
        this._settingsLocationPreviewTimer = setTimeout(() => {
          this._settingsLocationPreview = null;
          this._settingsLocationPreviewTimer = null;
          this._render();
        },2500);

        const entityId = this._locationSelectEntity();
        const helper = this._hass.states?.[entityId];
        const helperOptions = Array.isArray(helper?.attributes?.options)
          ? helper.attributes.options.map((v) => String(v).trim()).filter(Boolean)
          : [];
        const wantedOptions = this._locationOptions();

        // Dynamisch entdeckte person.* / zone.* müssen vor select_option in den
        // gültigen Optionen des input_select stehen. So bleibt der Helper unsere
        // persistente Auswahl-Schnittstelle, ohne persönliche IDs im Package.
        if (this._settingEntityDomain(entityId) === 'input_select' && wantedOptions.join('|') !== helperOptions.join('|')) {
          try {
            await this._setLegacySelectOptions(entityId,wantedOptions);
          } catch (error) {
            console.warn('[Gewitterradar] Standortoptionen konnten nicht synchronisiert werden.',error);
          }
        }

        this._selectSetting(entityId,option);
      };

      settingsLocationMainToggle?.addEventListener('click',() => {
        if (!this._hass) return;
        this._toggleSetting(this._locationMainViewEntity());
      });

      // +/- im Popup verwenden exakt dieselbe bereits bewährte Radiuslogik.
      // V3.523: Auf iPadOS wird touchend direkt verarbeitet und preventDefault()
      // gesetzt. Damit entsteht beim schnellen Doppeltippen kein Browser-Zoom.
      const bindSettingsRadiusStep = (button,kind,direction) => {
        if (!button) return;

        let touchHandledAt = 0;

        button.addEventListener('touchend',(event) => {
          event.preventDefault();
          event.stopPropagation();
          touchHandledAt = performance.now();
          this._stepRadius(kind,direction);
        },{ passive:false });

        button.addEventListener('click',(event) => {
          // Synthetischen Click direkt nach touchend nicht ein zweites Mal ausführen.
          if (performance.now() - touchHandledAt < 700) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          this._stepRadius(kind,direction);
        });

        button.addEventListener('dblclick',(event) => {
          event.preventDefault();
          event.stopPropagation();
        });
      };

      bindSettingsRadiusStep(settingsObsMinus,'observation',-1);
      bindSettingsRadiusStep(settingsObsPlus,'observation',1);
      bindSettingsRadiusStep(settingsStormMinus,'storm',-1);
      bindSettingsRadiusStep(settingsStormPlus,'storm',1);
      bindSettingsRadiusStep(settingsDangerMinus,'danger',-1);
      bindSettingsRadiusStep(settingsDangerPlus,'danger',1);

      // Zusätzliche Popup-Regler spiegeln die vorhandenen Regler. V3.91 zeigt
      // daneben den aktuellen km-Wert als Taster; die eigentliche Direkteingabe
      // erfolgt ausschließlich im eigenen Zahlenfeld ohne Bildschirmtastatur.
      const syncPopupRadiusFromMain = () => {
        const pairs = [
          [obsSlider,settingsObsSlider,settingsObsInput],
          [stormSlider,settingsStormSlider,settingsStormInput],
          [dangerSlider,settingsDangerSlider,settingsDangerInput]
        ];
        pairs.forEach(([main,popup,input]) => {
          if (!main) return;
          if (popup) {
            popup.min = main.min;
            popup.max = main.max;
            popup.step = main.step;
            popup.value = main.value;
          }
          if (input) {
            input.dataset.value = main.value;
            const formatted = this._formatRadiusDistance(Number(main.value));
            const number = input.querySelector?.('.settings-radius-value-number');
            const unit = input.querySelector?.('.settings-radius-value-unit');
            if (number) number.textContent = formatted.value;
            if (unit) unit.textContent = formatted.unit;
          }
        });
      };

      // V3.91 – der sichtbare km-Wert öffnet das eigene Zahlenfeld.
      // Keine native Text-/Number-Eingabe mehr; die iPad-OSK bleibt geschlossen.
      const bindSettingsRadiusInput = (button,kind) => {
        if (!button) return;
        button.addEventListener('click',() => openRadiusKeypad(kind,button));
      };

      bindSettingsRadiusInput(settingsObsInput,'observation');
      bindSettingsRadiusInput(settingsStormInput,'storm');
      bindSettingsRadiusInput(settingsDangerInput,'danger');

      const mirrorPopupSlider = (popup,main) => {
        if (!popup || !main) return;

        popup.addEventListener('input',() => {
          main.value = popup.value;
          main.dispatchEvent(new Event('input',{ bubbles:true }));
          syncPopupRadiusFromMain();
        });

        popup.addEventListener('change',() => {
          main.value = popup.value;
          main.dispatchEvent(new Event('change',{ bubbles:true }));
          syncPopupRadiusFromMain();
        });
      };

      mirrorPopupSlider(settingsObsSlider,obsSlider);
      mirrorPopupSlider(settingsStormSlider,stormSlider);
      mirrorPopupSlider(settingsDangerSlider,dangerSlider);

      // V3.513 TEST:
      // Delegierter Capture-Handler für ALLE Warn-Testtaster. Dadurch funktioniert
      // auch der unterste Taster zuverlässig, selbst wenn benachbarte Kompass-
      // V3.987 – nur der Radiusfilter verändert die Trefferliste und die
      // visuelle Betonung der Kartenradien. Zeitlich gilt immer das vorhandene
      // 120-Minuten-Fenster. Keine zusätzlichen HA-Helfer.
      const rerenderRecent = () => {
        const now = Date.now();
        const observationRadius = this._currentObservationRadius ?? this._observationRadiusValue();
        const stormRadius = this._currentStormRadius ?? Math.min(this._stormRadiusValue(),observationRadius);
        const dangerRadius = this._currentDangerRadius ?? Math.min(this._dangerRadiusValue(),stormRadius);
        this._renderRecentStable(this._mapHistory || [],now,dangerRadius,stormRadius,observationRadius);
        this._syncRecentFilterKpi();
        this._applyRecentRadiusMapEmphasis();
      };

      recentRadiusButtons.forEach((button) => button.addEventListener('click',() => {
        const next = button.dataset.recentRadiusFilter;
        if (!['danger','storm','observation'].includes(next)) return;
        const changed = next !== this._recentRadiusFilter;
        this._recentRadiusFilter = next;
        if (changed) rerenderRecent();
        // V3.991 – Filter und Karte sprechen dieselbe räumliche Sprache:
        // Auswahl zentriert/fittet den entsprechenden Radius mit ruhigem Rand.
        this._focusRecentRadiusFilter(next);
      }));

      // Ebenen oder responsive Container eigene Pointer-/Click-Behandlung besitzen.
      // Der echte 4-Sekunden-Cooldown bleibt unverändert und wird mitgetestet.
      this.shadow.addEventListener('click', (event) => {
        const path = event.composedPath?.() || [];
        const button = path.find((node) =>
          node?.matches?.('[data-warning-test]')
        );
        if (!button) return;

        event.preventDefault();
        event.stopPropagation();

        const mode = button.dataset.warningTest === 'storm' ? 'storm' : 'danger';

        // Falls der echte 4-Sekunden-Cooldown noch läuft, passiert bewusst nichts.
        const beforeFlashAt = this._lastFlashAt;
        if (mode === 'danger') this._pulseDangerCount();
        this._triggerWarningAnimation(mode);

        // Nur wenn _triggerWarningAnimation() die Sequenz wirklich angenommen hat,
        // werden die Buttons sichtbar bis zum Ende derselben Sperrzeit deaktiviert.
        if (this._lastFlashAt !== beforeFlashAt) {
          this._setWarningTestCooldown(button);
        }
      }, true);

      mapGrouped?.addEventListener('click', () => {
        if (!this._hass) return;
        this._statusFocusSignature = '';
        this._statusFocusIndex = -1;
        this._statusFocusSelectedId = null;
        this._resetStatusClusterBrowse();
        this._switchSetting(this._mapGroupingEntity(),true);
      });

      mapIndividual?.addEventListener('click', () => {
        if (!this._hass) return;
        this._statusFocusSignature = '';
        this._statusFocusIndex = -1;
        this._statusFocusSelectedId = null;
        this._resetStatusClusterBrowse();
        this._switchSetting(this._mapGroupingEntity(),false);
      });

      // V3.988 – bewusst NUR auf Benutzeraktion. Der Geo-Button fährt
      // sanft zum ausgewählten Bezugsstandort und wählt den Kartenausschnitt so,
      // dass der eingestellte Gewitterradius vollständig sichtbar ist.
      mapRecenter?.addEventListener('click', (event) => {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        if (!this._map) return;
        this._clearRecentStrikeTarget();
        this._resetStatusClusterBrowse();
        this._statusFocusIndex = -1;
        this._statusFocusSelectedId = null;
        this._focusReferenceStormRadius(this._home());
      });

      mapStrikeTarget?.addEventListener('click', (event) => {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        this._focusSelectedRecentStrikeDetail();
      });

      // V3.551/V3.984 – Gewitter-Fokus / Ereignis-Browser im Header.
      // Im Gruppiert-Modus geht es Cluster zu Cluster, im Einzelmodus Blitz zu Blitz.
      // Nach dem letzten Treffer beginnt die Liste wieder bei 1. Einzelblitze behalten
      // den aktuellen Zoom; Cluster wechseln bei Detailzoom sanft zurück zur Übersicht.
      const toggleClusterSessionFromStatus = () => {
        if (this._statusFocusKind !== 'cluster' || !this._statusClusterBrowseActive || !Number.isInteger(this._statusFocusIndex) || this._statusFocusIndex < 0) return false;
        const nextTimeout = Number(this._statusClusterBrowseTimeoutMs) === 0
          ? (this._statusClusterBrowseFiniteTimeoutMs || 10000)
          : 0;
        this._setStatusClusterBrowseTimeoutV40802(nextTimeout);
        return true;
      };
      const statusSessionHit = (event) => {
        const target = event?.target;
        if (target?.closest?.('[data-session-toggle]')) return true;
        const toggleNode = statusChip?.querySelector?.('[data-session-toggle]');
        if (!toggleNode || event?.clientX == null || event?.clientY == null) return false;
        const rect = toggleNode.getBoundingClientRect();
        const padX = 10, padY = 8;
        return event.clientX >= rect.left - padX && event.clientX <= rect.right + padX
          && event.clientY >= rect.top - padY && event.clientY <= rect.bottom + padY;
      };
      statusChip?.addEventListener('pointerdown', (event) => {
        if (!this._map || statusChip.classList.contains('disabled')) return;
        if (event.isPrimary === false || (event.pointerType === 'mouse' && event.button !== 0)) return;
        if (!statusSessionHit(event)) return;
        if (!toggleClusterSessionFromStatus()) return;
        event.preventDefault();
        event.stopPropagation();
        this._statusSessionToggleSuppressClickUntil = performance.now() + 900;
      });
      statusChip?.addEventListener('click', (event) => {
        if (!this._map || statusChip.classList.contains('disabled')) return;

        if (Number(this._statusSessionToggleSuppressClickUntil || 0) > performance.now()) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (statusSessionHit(event) && toggleClusterSessionFromStatus()) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        let list = Array.isArray(this._statusFocusList) ? this._statusFocusList : [];
        if (!list.length) return;

        // Beim ersten Cluster-Klick wird die aktuelle Browser-Reihenfolge
        // eingefroren. Die Karte darf danach frei zoomen/reclustern, der Nutzer
        // bleibt jedoch in genau derselben Sequenz (z.B. 25/47 -> 26/47).
        if (this._statusFocusKind === 'cluster') {
          if (!this._statusClusterBrowseActive || !this._statusClusterBrowseSnapshot.length) {
            this._statusClusterBrowseSnapshot = list.map(cluster => ({
              ...cluster,
              bounds:Array.isArray(cluster?.bounds)
                ? cluster.bounds.map(point => Array.isArray(point) ? [...point] : point)
                : cluster?.bounds
            }));
            this._statusClusterBrowseActive = true;
          }
          this._touchStatusClusterBrowseSessionV40802?.();
          list = this._statusClusterBrowseSnapshot;
          this._statusFocusList = list;
        }

        let nextIndex = Number.isInteger(this._statusFocusIndex)
          ? this._statusFocusIndex + 1
          : 0;
        if (nextIndex < 0 || nextIndex >= list.length) nextIndex = 0;

        const strike = list[nextIndex];
        if (!strike || !Number.isFinite(strike.lat) || !Number.isFinite(strike.lon)) return;

        this._statusFocusIndex = nextIndex;
        this._statusFocusStrike = strike;
        this._statusFocusSelectedId = strike.id || null;

        if (this._statusFocusKind === 'cluster') {
          this._focusCluster(strike);
        } else {
          // V3.99407 – Einzelblitz-Browser im Header erhält denselben klaren
          // Detailfokus wie der explizite Trefferfokus: zentrieren und mindestens
          // Zoom 12. Ein bereits tieferer Zoom wird nicht künstlich zurückgesetzt.
          this._clearRecentStrikeTarget();
          const maxZoomRaw = finiteNumber(this._map.getMaxZoom?.());
          const maxZoom = maxZoomRaw != null && maxZoomRaw > 0 ? maxZoomRaw : 18;
          const currentZoom = finiteNumber(this._map.getZoom?.()) ?? 9;
          const targetZoom = Math.min(maxZoom,Math.max(currentZoom,12));
          if (typeof this._map.flyTo === 'function') {
            this._map.flyTo([strike.lat,strike.lon],targetZoom,{
              animate:true,
              duration:1.00,
              easeLinearity:.22
            });
          } else {
            this._map.setView([strike.lat,strike.lon],targetZoom,{ animate:true });
          }
        }

        // Zähler/Entfernung sofort aktualisieren, ohne auf den nächsten
        // Home-Assistant-Renderzyklus zu warten.
        this._updateStatusFocusUi();
      });

      deviceToggle.addEventListener('click', async () => {
        if (!this._hass || deviceToggle.disabled) return;
        const current = this._hass.states[this._deviceOrientationEntity()]?.state === 'on';
        if (!current) {
          const allowed = await this._requestOrientationPermission();
          if (!allowed) {
            const label = this.shadow.getElementById('device-main');
            if (label) label.textContent = this._t('compass.permission_required');
            setTimeout(() => { if (label) label.textContent = this._t('compass.device'); },2200);
            return;
          }
          this._startOrientationListeners();
        }
        this._toggleSetting(this._deviceOrientationEntity());
      });
    },

};});

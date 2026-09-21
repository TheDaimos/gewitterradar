import { defineModule } from "../core/runtime.js?v=41002";
export const MODULE_META=Object.freeze({
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
});
export const installRender=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _render() {
      if (!this._built || !this._hass) return;
      const aboutLabel = this.shadow.getElementById('settings-about-label');
      if (aboutLabel) aboutLabel.textContent = this._t('about.title');
      if (this.shadow.getElementById('settings-backdrop')?.classList.contains('open')) this._syncHelpMenu();
      this._maybeOpenAbout();
      if (this._aboutDialog?.open) this._syncAbout();
      if(this._diagnostics.enabled){if(!Number.isFinite(this._diagnosticTimings.firstRenderStartAt)){this._diagnosticTimings.firstRenderStartAt=performance.now();requestAnimationFrame(()=>{if(this._diagnostics.enabled&&!Number.isFinite(this._diagnosticTimings.firstRenderCompleteAt))this._diagnosticTimings.firstRenderCompleteAt=performance.now();});}this._diagnostics.renderCount+=1;}
      const now = Date.now();
      const $ = (id) => this.shadow.getElementById(id);
      this._syncMapDisplayUi();

      const language = this._languageValue();
      const languageHelperAvailable = !!this._hass.states[this._languageEntity()];
      const languageButton = $('settings-language-button');
      const languageCurrent = $('settings-language-current');
      if (languageCurrent) languageCurrent.textContent = language;
      if (languageButton) {
        languageButton.disabled = !languageHelperAvailable;
        languageButton.setAttribute('title',languageHelperAvailable
          ? this._t('settings.language_current',{language})
          : this._t('helper.not_found',{entity:this._languageEntity()}));
        languageButton.setAttribute('aria-label',this._t('settings.language_menu_aria'));
      }
      const distanceUnit = this._distanceUnitValue();
      const distanceUnitHelperAvailable = !!this._hass.states[this._distanceUnitEntity()];
      const distanceUnitLabel = $('settings-distance-unit-label');
      const distanceUnitControl = $('settings-distance-unit-control');
      const distanceUnitSettingLabel = this._distanceUnitLabel();
      if (distanceUnitLabel) distanceUnitLabel.textContent = distanceUnitSettingLabel;
      if (distanceUnitControl) distanceUnitControl.setAttribute('aria-label',distanceUnitSettingLabel);
      ['KM','MI'].forEach((unit) => {
        const button = $(`settings-distance-unit-${unit.toLowerCase()}`);
        if (!button) return;
        const active = unit === distanceUnit;
        button.classList.toggle('active',active);
        button.setAttribute('aria-pressed',active ? 'true' : 'false');
        button.disabled = !distanceUnitHelperAvailable;
        button.title = distanceUnitHelperAvailable
          ? `${distanceUnitSettingLabel} · ${unit}`
          : this._t('helper.not_found',{entity:this._distanceUnitEntity()});
      });
      const auraEnabled = this._auraEnabled();
      const auraWidth = this._auraWidthValue();
      const auraIntensity = this._auraIntensityValue();
      const auraHelperAvailable = !!this._hass.states[this._auraEntity()];
      const auraWidthHelperAvailable = !!this._hass.states[this._auraWidthEntity()];
      const auraIntensityHelperAvailable = !!this._hass.states[this._auraIntensityEntity()];
      const auraToggle = $('settings-aura-toggle');
      if (auraToggle) {
        auraToggle.classList.toggle('on',auraEnabled);
        auraToggle.setAttribute('aria-checked',auraEnabled ? 'true' : 'false');
        auraToggle.disabled = !auraHelperAvailable;
        auraToggle.setAttribute('aria-label',this._t('settings.aura_effects'));
        auraToggle.title = auraHelperAvailable
          ? `${this._t('settings.aura_effects')} · ${this._t(auraEnabled ? 'toggle.on' : 'toggle.off')}`
          : this._t('helper.not_found',{entity:this._auraEntity()});
      }
      const auraControls = $('settings-aura-controls');
      if (auraControls) auraControls.hidden = !auraEnabled;

      const auraWidthInput = $('settings-aura-width');
      const auraWidthValue = $('settings-aura-width-value');
      if (auraWidthInput) {
        if (auraWidthInput.dataset.interacting !== '1' && Number(auraWidthInput.value) !== Math.round(auraWidth)) {
          auraWidthInput.value = String(Math.round(auraWidth));
        }
        auraWidthInput.disabled = !auraWidthHelperAvailable;
        auraWidthInput.setAttribute('aria-label',this._t('settings.aura_width_aria'));
        auraWidthInput.title = auraWidthHelperAvailable
          ? `${this._t('settings.aura_width')} · ${Math.round(auraWidth)} %`
          : this._t('helper.not_found',{entity:this._auraWidthEntity()});
      }
      if (auraWidthValue) auraWidthValue.textContent = `${Math.round(auraWidth)} %`;

      const auraIntensityInput = $('settings-aura-intensity');
      const auraIntensityValue = $('settings-aura-intensity-value');
      if (auraIntensityInput) {
        if (auraIntensityInput.dataset.interacting !== '1' && Number(auraIntensityInput.value) !== Math.round(auraIntensity)) {
          auraIntensityInput.value = String(Math.round(auraIntensity));
        }
        auraIntensityInput.disabled = !auraIntensityHelperAvailable;
        auraIntensityInput.setAttribute('aria-label',this._t('settings.aura_intensity_aria'));
        auraIntensityInput.title = auraIntensityHelperAvailable
          ? `${this._t('settings.aura_intensity')} · ${Math.round(auraIntensity)} %`
          : this._t('helper.not_found',{entity:this._auraIntensityEntity()});
      }
      if (auraIntensityValue) auraIntensityValue.textContent = `${Math.round(auraIntensity)} %`;

      const auraLabel = $('settings-aura-label');
      if (auraLabel?.firstChild) auraLabel.firstChild.textContent = `${this._t('settings.aura_effects')}
                      `;
      const auraNote = $('settings-aura-note');
      if (auraNote) auraNote.textContent = this._t('settings.aura_note');
      const auraWidthLabel = $('settings-aura-width-label');
      if (auraWidthLabel?.firstChild) auraWidthLabel.firstChild.textContent = `${this._t('settings.aura_width')}
                        `;
      const auraWidthNote = $('settings-aura-width-note');
      if (auraWidthNote) auraWidthNote.textContent = this._t('settings.aura_width_note');
      const auraIntensityLabel = $('settings-aura-intensity-label');
      if (auraIntensityLabel?.firstChild) auraIntensityLabel.firstChild.textContent = `${this._t('settings.aura_intensity')}
                        `;
      const auraIntensityNote = $('settings-aura-intensity-note');
      if (auraIntensityNote) auraIntensityNote.textContent = this._t('settings.aura_intensity_note');

      const rootForAura = $('card-root');
      if (rootForAura) {
        rootForAura.classList.remove('aura-none','aura-low','aura-medium','aura-strong','aura-very-strong','aura-custom');
        rootForAura.classList.add(auraEnabled ? 'aura-custom' : 'aura-none');
      }

      if ($('language-dropdown')?.classList.contains('open')) {
        // Rebuild selection marker after a helper update while the menu is open.
        const menu = $('language-dropdown');
        menu.querySelectorAll('.language-option').forEach((option) => {
          const selected = option.dataset.language === language;
          option.classList.toggle('selected',selected);
          option.setAttribute('aria-selected',selected ? 'true' : 'false');
        });
      }

      // V3.532 – gewählter Bezugsstandort.
      const reference = this._home();
      const locationOption = reference.option;
      const locationMainState = this._hass.states[this._locationMainViewEntity()]?.state;
      const locationMainVisible = locationMainState === 'on';

      const settingsLocationButton = $('settings-location-button');
      const settingsLocationCurrent = $('settings-location-current');
      const locationMainButton = $('location-main-button');
      const locationMainCurrent = $('location-main-current');

      // Optionen kommen direkt aus input_select.lightning_detection_location.
      // Beide sichtbaren Standortfelder verwenden denselben Custom-Dropdown und
      // damit dieselbe Optionsquelle / denselben persistenten Helper.
      if (settingsLocationCurrent) settingsLocationCurrent.textContent = reference.label;
      if (locationMainCurrent) locationMainCurrent.textContent = reference.label;
      const locationHelperAvailable = !!this._hass.states[this._locationSelectEntity()];
      if (settingsLocationButton) {
        settingsLocationButton.disabled = !locationHelperAvailable;
        settingsLocationButton.setAttribute('aria-label',this._t('location.reference'));
        settingsLocationButton.title = locationHelperAvailable
          ? `${this._t('location.reference')} · ${reference.label}`
          : this._t('helper.not_found',{entity:this._locationSelectEntity()});
      }
      if (locationMainButton) {
        locationMainButton.disabled = !locationHelperAvailable;
        locationMainButton.setAttribute('aria-label',this._t('location.reference'));
        locationMainButton.title = locationHelperAvailable
          ? `${this._t('location.reference')} · ${reference.label}`
          : this._t('helper.not_found',{entity:this._locationSelectEntity()});
      }
      if ($('location-dropdown')?.classList.contains('open')) {
        $('location-dropdown').querySelectorAll('.location-option').forEach((option) => {
          const selected = option.dataset.location === locationOption;
          option.classList.toggle('selected',selected);
          option.setAttribute('aria-selected',selected ? 'true' : 'false');
        });
      }

      const settingsLocationMainToggle = $('settings-location-main-toggle');
      settingsLocationMainToggle?.classList.toggle('on',locationMainVisible);
      settingsLocationMainToggle?.setAttribute('aria-checked',locationMainVisible ? 'true' : 'false');
      settingsLocationMainToggle?.setAttribute(
        'title',
        locationMainState == null
          ? this._t('helper.not_found',{entity:this._locationMainViewEntity()})
          : this._t('helper.location_main_state',{state:this._t(locationMainVisible ? 'toggle.on' : 'toggle.off')})
      );

      $('card-root')?.classList.toggle('location-visible',locationMainVisible);

      // iPad-Hook für die harmonisierten Custom-Controls; kein nativer Standort-SELECT mehr.
      const ipadDevice = this._isIPadLike();
      $('card-root')?.classList.toggle('ipad-device',ipadDevice);
      const settingsLanguageButton = $('settings-language-button');
      settingsLanguageButton?.classList.toggle('ipad-control-tall',ipadDevice);
      settingsLocationButton?.classList.toggle('ipad-control-tall',ipadDevice);

      const coords = $('settings-location-coordinates');
      if (coords) {
        coords.textContent = reference.available
          ? `${reference.lat.toFixed(4)} · ${reference.lon.toFixed(4)}`
          : this._t('location.position_unavailable');
      }

      const mapRecenter = $('map-recenter');
      if (mapRecenter) {
        const recenterText = this._t('location.recenter',{location:reference.label});
        mapRecenter.setAttribute('title',recenterText);
        mapRecenter.setAttribute('aria-label',recenterText);
      }
      this._syncRecentStrikeTargetButton(now,this._currentDangerRadius ?? this._dangerRadiusValue());

      const subtitleLocation = $('radar-subtitle-location');
      const subtitleWindow = $('radar-subtitle-window');
      if (subtitleLocation) {
        subtitleLocation.textContent = this._t('subtitle.strikes_around',{location:reference.label});
      }
      if (subtitleWindow) {
        subtitleWindow.textContent = this._t('subtitle.last_minutes',{minutes:HISTORY_MINUTES});
      }

      this._syncReferenceMap(reference);

      const obsState = this._hass.states[this._observationEntity()];
      const stormState = this._hass.states[this._stormEntity()];
      const dangerState = this._hass.states[this._dangerEntity()];

      const observationRadius = finiteNumber(obsState?.state) ?? 200;
      const dangerHelperRadius = finiteNumber(dangerState?.state) ?? 20;
      const stormHelperRadius = finiteNumber(stormState?.state) ?? 100;
      const stormMinimum = this._stormRadiusMinimum(this._hass,dangerHelperRadius);
      const stormRadius = Math.min(Math.max(stormHelperRadius,stormMinimum),observationRadius);
      const dangerRadius = Math.min(dangerHelperRadius,stormRadius);

      this._currentObservationRadius = observationRadius;
      this._currentStormRadius = stormRadius;
      this._currentDangerRadius = dangerRadius;

      this._setObservationUi(observationRadius);
      this._setStormUi(stormRadius);
      this._setDangerUi(dangerRadius);
      const radiusUnitLabel = this._distanceUnitValue();
      [
        ['observation-input','radius.observation_enter'],['storm-input','radius.storm_enter'],['danger-input','radius.danger_enter'],
        ['settings-observation-input','radius.observation_enter'],['settings-storm-input','radius.storm_enter'],['settings-danger-input','radius.danger_enter'],
        ['map-observation-radius','radius.observation_enter'],['map-storm-radius','radius.storm_enter'],['map-danger-radius','radius.danger_enter']
      ].forEach(([id,key]) => {
        const target = $(id);
        if (!target) return;
        const label = `${this._t(key)} · ${radiusUnitLabel}`;
        target.setAttribute('aria-label',label);
        if (id.startsWith('map-')) target.setAttribute('title',label);
      });

      const obsSlider = $('observation-slider');
      const stormSlider = $('storm-slider');
      const dangerSlider = $('danger-slider');
      if (obsSlider) {
        obsSlider.min = String(finiteNumber(obsState?.attributes?.min) ?? 10);
        obsSlider.max = String(finiteNumber(obsState?.attributes?.max) ?? 1000);
        obsSlider.step = String(finiteNumber(obsState?.attributes?.step) ?? 1);
        if (this.shadow.activeElement !== obsSlider) obsSlider.value = String(observationRadius);
      }
      const stormMinimumUi = Math.max(5,finiteNumber(stormState?.attributes?.min) ?? 1);
      if (stormSlider) {
        stormSlider.min = String(Math.min(stormMinimumUi,observationRadius));
        stormSlider.max = String(Math.min(finiteNumber(stormState?.attributes?.max) ?? 1000,observationRadius));
        stormSlider.step = String(finiteNumber(stormState?.attributes?.step) ?? 1);
        if (this.shadow.activeElement !== stormSlider) stormSlider.value = String(stormRadius);
      }
      if (dangerSlider) {
        dangerSlider.min = String(finiteNumber(dangerState?.attributes?.min) ?? 1);
        dangerSlider.max = String(Math.min(finiteNumber(dangerState?.attributes?.max) ?? 250,stormRadius));
        dangerSlider.step = String(finiteNumber(dangerState?.attributes?.step) ?? 1);
        if (this.shadow.activeElement !== dangerSlider) dangerSlider.value = String(dangerRadius);
      }

      $('observation-minus').disabled = observationRadius <= (finiteNumber(obsState?.attributes?.min) ?? 10);
      $('observation-plus').disabled = observationRadius >= (finiteNumber(obsState?.attributes?.max) ?? 1000);

      $('storm-minus').disabled = stormRadius <= Math.min(stormMinimumUi,observationRadius);
      $('storm-plus').disabled = stormRadius >= Math.min(finiteNumber(stormState?.attributes?.max) ?? 1000,observationRadius);

      $('danger-minus').disabled = dangerRadius <= (finiteNumber(dangerState?.attributes?.min) ?? 1);
      $('danger-plus').disabled = dangerRadius >= Math.min(finiteNumber(dangerState?.attributes?.max) ?? 250,stormRadius);

      // Popup +/- exakt an dieselben Grenzen koppeln.
      const popupObsMinus = $('settings-observation-minus');
      const popupObsPlus = $('settings-observation-plus');
      const popupStormMinus = $('settings-storm-minus');
      const popupStormPlus = $('settings-storm-plus');
      const popupDangerMinus = $('settings-danger-minus');
      const popupDangerPlus = $('settings-danger-plus');

      if (popupObsMinus) popupObsMinus.disabled = $('observation-minus').disabled;
      if (popupObsPlus) popupObsPlus.disabled = $('observation-plus').disabled;
      if (popupStormMinus) popupStormMinus.disabled = $('storm-minus').disabled;
      if (popupStormPlus) popupStormPlus.disabled = $('storm-plus').disabled;
      if (popupDangerMinus) popupDangerMinus.disabled = $('danger-minus').disabled;
      if (popupDangerPlus) popupDangerPlus.disabled = $('danger-plus').disabled;

      this._setObservationRadiusVisual(observationRadius,reference);
      this._setStormRadiusVisual(stormRadius,reference);
      this._setDangerRadiusVisual(dangerRadius,reference);
      this._applyRecentRadiusMapEmphasis();

      const animationOn = this._hass.states[this._animationEntity()]?.state === 'on';
      const animationToggle = $('animation-toggle');
      animationToggle?.classList.toggle('on',animationOn);
      animationToggle?.classList.toggle('off',!animationOn);
      $('animation-state').textContent = this._t(animationOn ? 'toggle.on' : 'toggle.off');

      // V3.519 – Popup-Schalter und Testbutton-Sichtbarkeit synchron halten.
      const settingsAnimationToggle = $('settings-animation-toggle');
      settingsAnimationToggle?.classList.toggle('on',animationOn);
      settingsAnimationToggle?.setAttribute('aria-checked',animationOn ? 'true' : 'false');

      const simulationState = this._hass.states[this._stormSimulationEntity()]?.state;
      const simulationOn = simulationState === 'on';

      const settingsTestsToggle = $('settings-tests-toggle');
      settingsTestsToggle?.classList.toggle('on',simulationOn);
      settingsTestsToggle?.setAttribute('aria-checked',simulationOn ? 'true' : 'false');
      settingsTestsToggle?.setAttribute('aria-label',this._t('settings.warning_simulation'));
      settingsTestsToggle?.setAttribute(
        'title',
        simulationState == null
          ? this._t('helper.not_found',{entity:this._stormSimulationEntity()})
          : this._t('helper.tests_state',{state:this._t(simulationOn ? 'toggle.on' : 'toggle.off')})
      );
      $('card-root')?.classList.toggle('tests-hidden',!simulationOn);
      this.shadow.querySelectorAll('[data-warning-test]').forEach((button) => {
        button.hidden = !simulationOn;
        button.setAttribute('aria-hidden',simulationOn ? 'false' : 'true');
      });

      this._syncCompassCalibrationUi();
      this._syncMedallionCalibrationUi();
      this._syncDiagnosticUi();

      const settingsRadiiToggle = $('settings-radii-toggle');
      settingsRadiiToggle?.classList.toggle('on',this._showMainRadii);
      settingsRadiiToggle?.setAttribute('aria-checked',this._showMainRadii ? 'true' : 'false');
      $('card-root')?.classList.toggle('radii-visible',this._showMainRadii);

      const settingsClusterResolutionButton = $('settings-cluster-resolution-button');
      const settingsClusterResolutionCurrent = $('settings-cluster-resolution-current');
      const clusterResolutionProfile = this._clusterResolutionProfileV40822 || 'balanced';
      const clusterResolutionLabel = getClusterResolutionProfileLabel(clusterResolutionProfile,this._languageValue?.() || 'Deutsch');
      if (settingsClusterResolutionCurrent) settingsClusterResolutionCurrent.textContent = clusterResolutionLabel;
      if (settingsClusterResolutionButton) {
        settingsClusterResolutionButton.setAttribute('aria-label','Cluster-Auflösung auswählen');
        settingsClusterResolutionButton.setAttribute('title',`Cluster-Auflösung · ${clusterResolutionLabel}`);
      }
      if ($('cluster-resolution-dropdown')?.classList.contains('open')) {
        $('cluster-resolution-dropdown').querySelectorAll('[data-cluster-resolution-profile]').forEach((option) => {
          const selected = option.dataset.clusterResolutionProfile === clusterResolutionProfile;
          option.classList.toggle('selected',selected);
          option.setAttribute('aria-selected',selected ? 'true' : 'false');
          const label = option.querySelector('span');
          if (label) label.textContent = getClusterResolutionProfileLabel(option.dataset.clusterResolutionProfile,this._languageValue?.() || 'Deutsch');
        });
      }

      const settingsClusterJumpSelector = $('settings-cluster-jump-selector');
      const settingsClusterJumpSeconds = $('settings-cluster-jump-seconds');
      const settingsClusterJumpInfinite = $('settings-cluster-jump-infinite');
      const clusterJumpInfinite = Number(this._statusClusterBrowseTimeoutMs) === 0;
      const clusterJumpFiniteSeconds = Math.round((this._statusClusterBrowseFiniteTimeoutMs || 10000) / 1000);
      if (settingsClusterJumpSeconds && this.shadow.activeElement !== settingsClusterJumpSeconds) {
        settingsClusterJumpSeconds.value = String(clusterJumpFiniteSeconds);
      }
      settingsClusterJumpSelector?.classList.toggle('is-infinite',clusterJumpInfinite);
      settingsClusterJumpSelector?.setAttribute('data-mode',clusterJumpInfinite ? 'infinite' : 'finite');
      settingsClusterJumpInfinite?.setAttribute('aria-pressed',clusterJumpInfinite ? 'true' : 'false');

      // Popup-Radien spiegeln die aktuellen HA-Helfer einschließlich ihrer
      // dynamischen Grenzen: Gefahr <= Gewitter <= Beobachtung.
      const settingsObsSlider = $('settings-observation-slider');
      const settingsStormSlider = $('settings-storm-slider');
      const settingsDangerSlider = $('settings-danger-slider');

      if (settingsObsSlider) {
        settingsObsSlider.min = String(finiteNumber(obsState?.attributes?.min) ?? 10);
        settingsObsSlider.max = String(finiteNumber(obsState?.attributes?.max) ?? 1000);
        settingsObsSlider.step = String(finiteNumber(obsState?.attributes?.step) ?? 1);
        if (this.shadow.activeElement !== settingsObsSlider) settingsObsSlider.value = String(observationRadius);
      }
      if (settingsStormSlider) {
        settingsStormSlider.min = String(Math.min(stormMinimumUi,observationRadius));
        settingsStormSlider.max = String(Math.min(finiteNumber(stormState?.attributes?.max) ?? 1000,observationRadius));
        settingsStormSlider.step = String(finiteNumber(stormState?.attributes?.step) ?? 1);
        if (this.shadow.activeElement !== settingsStormSlider) settingsStormSlider.value = String(stormRadius);
      }
      if (settingsDangerSlider) {
        settingsDangerSlider.min = String(finiteNumber(dangerState?.attributes?.min) ?? 1);
        settingsDangerSlider.max = String(Math.min(finiteNumber(dangerState?.attributes?.max) ?? 250,stormRadius));
        settingsDangerSlider.step = String(finiteNumber(dangerState?.attributes?.step) ?? 1);
        if (this.shadow.activeElement !== settingsDangerSlider) settingsDangerSlider.value = String(dangerRadius);
      }

      const syncSettingsRadiusInput = (id,value,min,max) => {
        const el = $(id);
        if (!el) return;
        const rounded = String(Math.round(value));
        const formatted = this._formatRadiusDistance(value);
        el.dataset.value = rounded;
        el.dataset.min = String(min);
        el.dataset.max = String(max);
        const number = el.querySelector?.('.settings-radius-value-number');
        const unit = el.querySelector?.('.settings-radius-value-unit');
        if (number) number.textContent = formatted.value;
        if (unit) unit.textContent = formatted.unit;
      };
      syncSettingsRadiusInput(
        'settings-observation-input',
        observationRadius,
        finiteNumber(obsState?.attributes?.min) ?? 10,
        finiteNumber(obsState?.attributes?.max) ?? 1000
      );
      syncSettingsRadiusInput(
        'settings-storm-input',
        stormRadius,
        Math.min(stormMinimumUi,observationRadius),
        Math.min(finiteNumber(stormState?.attributes?.max) ?? 1000,observationRadius)
      );
      syncSettingsRadiusInput(
        'settings-danger-input',
        dangerRadius,
        finiteNumber(dangerState?.attributes?.min) ?? 1,
        Math.min(finiteNumber(dangerState?.attributes?.max) ?? 250,stormRadius)
      );

      this._syncCompassSelectorFrame();
      const compassDesign = this._compassDesignValue();
      this._applyCompassDesign(compassDesign);

      const useNearest = this._hass.states[this._modeEntity()]?.state === 'on';
      const modeToggle = $('mode-toggle');
      modeToggle?.classList.toggle('active',useNearest);
      $('mode-main').textContent = this._t(useNearest ? 'compass.nearest_hit' : 'compass.last_hit');

      const deviceMode = this._hass.states[this._deviceOrientationEntity()]?.state === 'on';
      const deviceToggle = $('device-toggle');
      deviceToggle?.classList.toggle('active',deviceMode);
      if (deviceMode) this._startOrientationListeners();

      const mapGrouped = this._hass.states[this._mapGroupingEntity()]?.state !== 'off';
      const mapGroupedButton = $('map-mode-grouped');
      const mapIndividualButton = $('map-mode-individual');
      mapGroupedButton?.classList.toggle('active',mapGrouped);
      mapIndividualButton?.classList.toggle('active',!mapGrouped);
      mapGroupedButton?.setAttribute('aria-pressed',mapGrouped ? 'true' : 'false');
      mapIndividualButton?.setAttribute('aria-pressed',!mapGrouped ? 'true' : 'false');

      const mapLegend = $('map-legend');
      if (mapLegend) {
        mapLegend.innerHTML = mapGrouped
          ? `<span class="map-legend-group map-legend-primary">
               <span class="legend-item"><i class="legend-dot" style="--legend-color:${C.gold}"></i>${this._t('map.active_under',{minutes:ACTIVE_MINUTES})}</span>
               <span class="legend-item"><i class="legend-dot" style="--legend-color:${C.blue}"></i>${this._t('map.age_range',{from:10,to:120})}</span>
               <span class="legend-item"><i class="legend-dot" style="--legend-color:${C.purple}"></i>${this._t('map.extreme_lightning')}</span>
             </span>
             <span class="map-legend-group map-legend-radii">
               <span class="legend-item" style="color:${C.blue}"><i class="legend-line"></i>${this._t('map.storm')} <span id="legend-storm-radius">${this._formatRadiusDistance(stormRadius).text}</span></span>
               <span class="legend-item" style="color:${C.danger}"><i class="legend-line"></i>${this._t('map.danger')} <span id="legend-danger-radius">${this._formatRadiusDistance(dangerRadius).text}</span></span>
             </span>`
          : `<span class="map-legend-group map-legend-primary">
               <span class="legend-item"><i class="legend-dot" style="--legend-color:#F3B51B"></i>${this._t('map.active_under',{minutes:ACTIVE_MINUTES})}</span>
               <span class="legend-item"><i class="legend-dot" style="--legend-color:#2E93E8"></i>${this._t('map.age_range',{from:10,to:30})}</span>
               <span class="legend-item"><i class="legend-dot" style="--legend-color:#8B49D8"></i>${this._t('map.age_range',{from:30,to:60})}</span>
               <span class="legend-item"><i class="legend-dot" style="--legend-color:#F12CFF"></i>${this._t('map.extreme_activity')}</span>
             </span>
             <span class="map-legend-group map-legend-radii">
               <span class="legend-item" style="color:${C.blue}"><i class="legend-line"></i>${this._t('map.storm')} ${this._formatRadiusDistance(stormRadius).text}</span>
               <span class="legend-item" style="color:${C.danger}"><i class="legend-dot" style="--legend-color:${C.danger}"></i>${this._t('map.danger')} ${this._formatRadiusDistance(dangerRadius).text}</span>
             </span>`;
      }

      const allHistory = [...this._strikes.values()]
        .filter(s => now - s.firstSeen <= HISTORY_MINUTES*60000)
        .sort((a,b) => a.firstSeen - b.firstSeen);

      const observed = allHistory.filter(s => s.distance == null || s.distance <= observationRadius);
      const stormHistory = observed.filter(s => s.distance != null && s.distance <= stormRadius);
      const dangerHistory = observed.filter(s => s.distance != null && s.distance <= dangerRadius);
      const strikes60 = observed.filter(s => now - s.firstSeen <= 60*60000);
      const storm60 = stormHistory.filter(s => now - s.firstSeen <= 60*60000);
      const danger60 = dangerHistory.filter(s => now - s.firstSeen <= 60*60000);
      const active10 = observed.filter(s => now - s.firstSeen <= ACTIVE_MINUTES*60000);
      const active2 = observed.filter(s => now - s.firstSeen <= 2*60000);
      const danger10 = dangerHistory.filter(s => now - s.firstSeen <= ACTIVE_MINUTES*60000);
      const storm10 = stormHistory.filter(s => now - s.firstSeen <= ACTIVE_MINUTES*60000);

      // Mechanik des Kompasses folgt der aktuellen Blitzrate:
      // viele Einschläge in kurzer Zeit = lebendigeres Überschwingen/Nachpendeln.
      this._compassMotionProfile = this._buildCompassMotionProfile(active10.length,active2.length,danger10.length);

      const latestStrike = observed.length ? observed[observed.length-1] : null;
      const nearestStrike = observed.reduce((best,s) => {
        if (s.distance == null) return best;
        return !best || s.distance < best.distance ? s : best;
      },null);
      const compassStrike = useNearest ? nearestStrike : latestStrike;
      this._lastCompassStrike = compassStrike;

      this._mapHistory = allHistory;
      this._renderMapMarkers();

      const nearestActive = active10.reduce((best,s) => {
        if (s.distance == null) return best;
        return !best || s.distance < best.distance ? s : best;
      },null);
      const dangerNow = danger10.length > 0;
      const stormNow = !dangerNow && storm10.length > 0;

      this._renderWeatherMessage({
        active10,danger10,storm10,latestStrike,observationRadius,stormRadius,now
      });

      $('card-root')?.classList.toggle('danger-state',dangerNow);
      const banner = $('warn-banner');
      banner?.classList.toggle('active',dangerNow);
      if (dangerNow && $('warn-text')) {
        const nearestDanger = danger10.reduce((best,s) => !best || s.distance < best.distance ? s : best,null);
        $('warn-text').textContent = this._distanceMessage('warning.danger_distance',nearestDanger.distance);
      }

      // V3.550 – Ereignis-Browser des Headerstatus.
      //
      // Aktive Listen werden nach Entfernung aufsteigend sortiert. Bei nahezu
      // gleichem Abstand steht der neuere Treffer zuerst.
      const sortByDistance = (list) => [...list]
        .filter(s => s.distance != null && Number.isFinite(s.distance))
        .sort((a,b) =>
          (a.distance - b.distance) ||
          (b.firstSeen - a.firstSeen) ||
          String(a.id).localeCompare(String(b.id))
        );

      let statusMode = 'disabled';
      let statusBaseText = this._t('status.no_hits');
      let statusFocusList = [];
      let statusFocusKind = mapGrouped ? 'cluster' : 'individual';

      // Die Farbe bleibt eine Statusinformation über die aktuelle Wetterlage,
      // während das Navigationsziel durch den Kartenmodus bestimmt wird.
      const semanticStatusMode =
        dangerNow ? 'danger' :
        stormNow ? 'storm' :
        active10.length ? 'activity' :
        latestStrike ? 'quiet' :
        'disabled';

      if (mapGrouped) {
        // V3.99406 – zwei getrennte Ebenen:
        // - liveStatusFocusList folgt der aktuell gerenderten Karten-Zoomstufe.
        // - ein bereits gestarteter Browser-Durchlauf behält dagegen seine feste
        //   Reihenfolge/Gesamtzahl. Passende IDs erhalten nur aktualisierte
        //   Geometrie und Zählerwerte; Reihenfolge und N bleiben unverändert.
        const liveStatusFocusList = [...(this._renderedMapClusters || [])]
          .filter(c => Number.isFinite(c.lat) && Number.isFinite(c.lon))
          .sort((a,b) =>
            (a.distance - b.distance) ||
            String(a.id).localeCompare(String(b.id))
          );

        if (this._statusClusterBrowseActive && this._statusClusterBrowseSnapshot.length) {
          const liveById = new Map(
            liveStatusFocusList.map(cluster => [cluster.id,cluster])
          );
          this._statusClusterBrowseSnapshot = this._statusClusterBrowseSnapshot.map((snapshot) => {
            const live = liveById.get(snapshot.id);
            if (!live) return snapshot;
            return {
              ...snapshot,
              ...live,
              id:snapshot.id,
              bounds:Array.isArray(live?.bounds)
                ? live.bounds.map(point => Array.isArray(point) ? [...point] : point)
                : live?.bounds
            };
          });
          statusFocusList = this._statusClusterBrowseSnapshot;
        } else {
          statusFocusList = liveStatusFocusList;
        }

        statusMode = statusFocusList.length ? semanticStatusMode : 'disabled';
        statusBaseText = statusFocusList.length ? this._t('status.cluster') : this._t('status.no_clusters');
      } else if (dangerNow) {
        statusMode = 'danger';
        statusBaseText = this._t('status.danger');
        statusFocusList = sortByDistance(danger10);
      } else if (stormNow) {
        statusMode = 'storm';
        statusBaseText = this._t('status.storm_nearby');
        statusFocusList = sortByDistance(storm10);
      } else if (active10.length) {
        statusMode = 'activity';
        statusBaseText = this._t('status.active_count',{count:active10.length});
        statusFocusList = sortByDistance(active10);
      } else if (latestStrike) {
        statusMode = 'quiet';
        statusBaseText = this._t('status.calm');
        statusFocusList = [latestStrike];
      }

      // V3.555 – unterschiedliche Reset-Strategie je Kartenmodus:
      //
      // GRUPPIERT:
      // Neue Blitze dürfen den Browser NICHT mehr auf Cluster 1 zurücksetzen.
      // Deshalb enthält die Signatur bewusst weder Statusfarbe noch die aktuelle
      // Clusterliste. Reset nur bei strukturellen Änderungen: Standort, Radien,
      // Kartenmodus oder Zoom. Der aktuell gewählte Cluster wird über seine
      // stabile Weltpixel-ID wiedergefunden.
      //
      // EINZELBLITZE:
      // Das bisherige Verhalten bleibt bewusst erhalten. Eine veränderte
      // Trefferliste startet den Einzelblitz-Durchlauf wieder bei 1.
      const statusFocusSignature = mapGrouped
        ? [
            reference.option,
            Number(reference.lat).toFixed(3),
            Number(reference.lon).toFixed(3),
            observationRadius,
            stormRadius,
            dangerRadius,
            'grouped'
          ].join('|')
        : [
            reference.option,
            Number(reference.lat).toFixed(3),
            Number(reference.lon).toFixed(3),
            observationRadius,
            stormRadius,
            dangerRadius,
            'individual',
            statusMode,
            ...statusFocusList.map(s => s.id)
          ].join('|');

      if (statusFocusSignature !== this._statusFocusSignature) {
        this._statusFocusSignature = statusFocusSignature;
        this._statusFocusIndex = -1;
        this._statusFocusSelectedId = null;
        this._resetStatusClusterBrowse();
      } else if (mapGrouped) {
        if (this._statusFocusSelectedId) {
          const preservedIndex = statusFocusList.findIndex(
            item => item.id === this._statusFocusSelectedId
          );

          if (preservedIndex >= 0) {
            // Der bisher betrachtete Cluster existiert weiterhin.
            this._statusFocusIndex = preservedIndex;
          } else if (statusFocusList.length && this._statusFocusIndex >= 0) {
            // Der betrachtete Cluster ist tatsächlich verschwunden
            // (z.B. 120-Minuten-Auslauf). Nicht auf 1 zurückspringen:
            // möglichst an derselben Listenposition weiterarbeiten.
            this._statusFocusIndex = Math.min(
              this._statusFocusIndex,
              statusFocusList.length - 1
            );
            this._statusFocusSelectedId =
              statusFocusList[this._statusFocusIndex]?.id || null;
          } else {
            this._statusFocusIndex = -1;
            this._statusFocusSelectedId = null;
          }
        } else if (this._statusFocusIndex >= statusFocusList.length) {
          this._statusFocusIndex = statusFocusList.length
            ? statusFocusList.length - 1
            : -1;
        }
      } else if (this._statusFocusIndex >= statusFocusList.length) {
        this._statusFocusIndex = -1;
        this._statusFocusSelectedId = null;
      }

      this._statusFocusList = statusFocusList;
      this._statusFocusMode = statusMode;
      this._statusFocusBaseText = statusBaseText;
      this._statusFocusKind = statusFocusKind;

      const previewIndex =
        this._statusFocusIndex >= 0 && this._statusFocusIndex < statusFocusList.length
          ? this._statusFocusIndex
          : 0;
      this._statusFocusStrike = statusFocusList[previewIndex] || null;

      this._updateStatusFocusUi();

      if (latestStrike) {
        const latestDistanceDisplay = latestStrike.distance != null ? this._formatDistance(latestStrike.distance) : null;
        $('kpi-distance').innerHTML = latestDistanceDisplay ? `${latestDistanceDisplay.value}<span class="unit">${latestDistanceDisplay.unit}</span>` : '–';
        $('kpi-distance').style.color = latestStrike.distance != null && (latestStrike.distance <= dangerRadius || latestDistanceDisplay?.near) ? C.danger : C.text;
        $('kpi-azimuth').innerHTML = latestStrike.azimuth != null ? `${Math.round(latestStrike.azimuth)}<span class="unit">°</span>` : '–';
        $('kpi-cardinal').textContent = latestStrike.azimuth != null
          ? `${this._toCardinal(latestStrike.azimuth)} · ${this._toCardinalName(latestStrike.azimuth)}`
          : this._t('kpi.direction');
        $('kpi-age').textContent = this._formatAge(now-latestStrike.firstSeen);
        $('kpi-time').textContent = this._t('kpi.at_time',{time:this._formatClock(latestStrike.firstSeen)});
      } else {
        $('kpi-distance').textContent = '–';
        $('kpi-distance').style.color = C.text;
        $('kpi-azimuth').textContent = '–';
        $('kpi-cardinal').textContent = this._t('kpi.direction');
        $('kpi-age').textContent = '–';
        $('kpi-time').textContent = this._t('kpi.no_activity');
      }

      this._recentKpiSnapshot = { observation:strikes60.length,storm:storm60.length,danger:danger60.length };
      this._syncRecentFilterKpi();
      $('hit-danger').textContent = String(danger60.length);
      $('danger-hit-group').classList.toggle('active',danger60.length > 0);
      $('hit-live').innerHTML = `<strong>${this._t('hits.active',{count:active10.length})}</strong> - <span class="danger-live">${this._t('hits.dangerous',{count:danger10.length})}</span>`;

      // V3.86 PRE-FINAL – Auto-Scroll-Fix:
      // Die Recent-Liste wird bei JEDEM Render vollständig inhaltlich aktualisiert,
      // ihre DOM-Struktur bleibt jedoch stabil. Kein innerHTML-Austausch von
      // #recent-content mehr – genau dieser Austausch war auf dem normalen iPad
      // mit geöffneter HA-Seitenleiste der Auslöser des Auto-Scrolls.
      this._renderRecentStable(allHistory,now,dangerRadius,stormRadius,observationRadius);

      this._renderCompass(compassStrike,now,dangerRadius,deviceMode);
      this._renderHistoryChart(observed,dangerRadius,now);

      const counterState = this._hass.states[this._counterEntity()];
      $('footer-total').textContent = counterState ? counterState.state : '–';
      $('footer-update').textContent = this._formatClock(now);
      this._renderLightningSourceStatus();
      this._applyStaticTranslations();
    }

    _renderWeatherMessage({active10=[],danger10=[],storm10=[],latestStrike=null,observationRadius=0,stormRadius=0,now=Date.now()} = {}) {
      const panel = this.shadow?.getElementById('weather-message-panel');
      const quote = this.shadow?.getElementById('weather-message-quote');
      const context = this.shadow?.getElementById('weather-message-context');
      if (!panel || !quote || !context) return;

      const extremeNow = (this._renderedMapClusters || []).some(cluster =>
        cluster?.extreme && cluster?.active && Number.isFinite(cluster.distance) && cluster.distance <= observationRadius
      );
      const nearestDanger = danger10.reduce((best,strike) =>
        !best || (strike.distance ?? Infinity) < (best.distance ?? Infinity) ? strike : best
      ,null);

      let mode = 'calm';
      let message = '';
      let detail = '';

      if (nearestDanger?.distance != null) {
        mode = 'danger';
        message = this._distanceMessage('warning.danger_distance',nearestDanger.distance);
        detail = `${this._t('status.danger')} · ${this._formatDistance(nearestDanger.distance).text}`;
      } else if (storm10.length) {
        mode = 'storm';
        message = this._t('status.storm_nearby');
        detail = `${this._t('status.activity')} · ${this._t('radius.storm')} ${this._formatRadiusDistance(stormRadius).text}`;
      } else if (extremeNow) {
        mode = 'extreme';
        message = this._t('map.extreme_lightning');
        detail = `${this._t('status.activity')} · ${this._t('radius.observation')}`;
      } else if (active10.length >= 6) {
        mode = 'activity';
        message = this._t('message.activity');
        detail = `${this._t('status.active_count',{count:active10.length})} · ${this._t('radius.observation')}`;
      } else if (active10.length) {
        mode = 'activity';
        message = this._t('status.active_count',{count:active10.length});
        detail = `${this._t('map.active_under',{minutes:ACTIVE_MINUTES})} · ${this._t('radius.observation')}`;
      } else if (latestStrike) {
        mode = 'calm';
        message = this._t('status.calm');
        detail = `${this._t('recent.time')} · ${this._formatAge(now-latestStrike.firstSeen)}`;
      } else {
        mode = 'calm';
        message = this._t('recent.empty');
        detail = this._t('radius.observation');
      }

      panel.classList.remove('calm','activity','extreme','storm','danger');
      panel.classList.add(mode);
      if (quote.textContent !== message) quote.textContent = message;
      let detailSpan = context.querySelector('span');
      if (!detailSpan) {
        detailSpan = document.createElement('span');
        context.appendChild(detailSpan);
      }
      if (detailSpan.textContent !== detail) detailSpan.textContent = detail;
    },

};});

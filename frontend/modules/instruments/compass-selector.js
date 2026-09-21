import { defineModule } from "../core/runtime.js?v=41002";
export const MODULE_META=Object.freeze({
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
});
export const installCompassSelector=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _normalizeCompassDesign(value) {
      const raw = String(value ?? '').trim().toLowerCase();
      if (raw === 'a' || raw === 'kompass a' || raw === 'compass a') return 'A';
      if (raw === 'b' || raw === 'kompass b' || raw === 'compass b') return 'B';
      if (raw === 'c' || raw === 'kompass c' || raw === 'compass c') return 'C';
      if (raw === 'd' || raw === 'kompass d' || raw === 'compass d') return 'D';
      return 'C';
    },

    _restorePersistedCompassDesign() {
      try {
        const raw=localStorage.getItem(COMPASS_DESIGN_STORAGE_KEY);
        if(this._compassStorageDiagnostics){this._compassStorageDiagnostics.reads+=1;this._compassStorageDiagnostics.storageAvailable=true;this._compassStorageDiagnostics.lastReadValue=raw;this._compassStorageDiagnostics.lastReadAt=Date.now();}
        if(raw===null){if(this._compassStorageDiagnostics)this._compassStorageDiagnostics.lastRestoredDesign=null;return null;}
        const descriptor=COMPASS_DESIGNS.find((entry)=>String(entry.uiIndex)===raw.trim());
        if(descriptor){if(this._compassStorageDiagnostics)this._compassStorageDiagnostics.lastRestoredDesign=descriptor.id;return descriptor.id;}
        localStorage.removeItem(COMPASS_DESIGN_STORAGE_KEY);
        if(this._compassStorageDiagnostics)this._compassStorageDiagnostics.lastRestoredDesign=null;
      } catch (_) {if(this._compassStorageDiagnostics)this._compassStorageDiagnostics.storageAvailable=false;return undefined;}
      return null;
    },

    _persistCompassDesign(design) {
      const descriptor=COMPASS_DESIGNS.find((entry)=>entry.id===design);
      if(!descriptor)return false;
      this._persistedCompassDesign=descriptor.id;
      if(this._compassStorageDiagnostics){this._compassStorageDiagnostics.writes+=1;this._compassStorageDiagnostics.lastWriteAt=Date.now();}
      try{
        const storedValue=String(descriptor.uiIndex);
        localStorage.setItem(COMPASS_DESIGN_STORAGE_KEY,storedValue);
        const written=localStorage.getItem(COMPASS_DESIGN_STORAGE_KEY)===storedValue;
        if(this._compassStorageDiagnostics){this._compassStorageDiagnostics.storageAvailable=true;if(written)this._compassStorageDiagnostics.writeSuccesses+=1;}
        return written;
      }catch(_){if(this._compassStorageDiagnostics)this._compassStorageDiagnostics.storageAvailable=false;return false;}
    },

    _compassDesignValue(hass = this._hass) {
      if(this._compassCalibrationEnabled&&COMPASS_DESIGNS.some((entry)=>entry.id===this._calibrationCompassDesign))return this._calibrationCompassDesign;
      if(!this._auraEnabled())return 'A';
      if(COMPASS_DESIGNS.some((entry)=>entry.id===this._persistedCompassDesign))return this._persistedCompassDesign;
      if(COMPASS_DESIGNS.some((entry)=>entry.id===this._localCompassDesign))return this._localCompassDesign;
      return this._normalizeCompassDesign(
        hass?.states?.[this._compassDesignEntity()]?.state
      );
    },

    _stepCompassDesign(direction) {
      const calibrationNavigation=this._compassCalibrationEnabled&&(!this._diagnostics.enabled||this._diagnostics.live);
      if(!this._auraEnabled()&&!calibrationNavigation)return;
      const currentIndex=Math.max(0,COMPASS_DESIGNS.findIndex((entry)=>entry.id===this._activeCompassDesign));
      const next=COMPASS_DESIGNS[(currentIndex+direction+COMPASS_DESIGNS.length)%COMPASS_DESIGNS.length];
      this._persistCompassDesign(next.id);
      if(calibrationNavigation){this._calibrationCompassDesign=next.id;this._applyCompassDesign(next.id);return;}
      this._applyCompassDesign(next.id);
      if(next.local){this._localCompassDesign=next.id;return;}
      this._localCompassDesign=null;
      if(!this._hass)return;
      const helperEntity=this._compassDesignEntity();
      const option=[SETTING_ENTITIES.compass_design.native,SETTING_ENTITIES.compass_design.legacy].includes(helperEntity)
        ? `Compass ${next.id}` : `Kompass ${next.id}`;
      const helperOptions=this._hass.states?.[helperEntity]?.attributes?.options;
      if(next.id==='D'&&!helperOptions?.includes(option)){this._localCompassDesign='D';return;}
      this._selectSetting(helperEntity,option);
    },

    _stepCompassSelectorFrame(direction) {
      if(!this._auraEnabled())return;
      this._compassSelectorFrameIndex=(this._compassSelectorFrameIndex+direction+COMPASS_SELECTOR_FRAME_IMAGES.length)%COMPASS_SELECTOR_FRAME_IMAGES.length;
      this._syncCompassSelectorFrame();
    },

    _syncCompassSelectorFrame() {
      if(this._diagnostics.enabled||this._compassCalibrationEnabled)this._compassSelectorDiagnostics.updates+=1;
      const effectsEnabled=this._auraEnabled();
      const renderedIndex=effectsEnabled?this._compassSelectorFrameIndex:COMPASS_SELECTOR_FRAME_IMAGES.length-1;
      const output=this.shadow?.getElementById('selector-frame-index');
      const mainSelector=this.shadow?.getElementById('compass-design-selector');
      const settingsRow=this.shadow?.getElementById('settings-selector-design-row');
      if(mainSelector?.hidden)mainSelector.hidden=false;
      if(settingsRow&&settingsRow.hidden===effectsEnabled)settingsRow.hidden=!effectsEnabled;
      this._syncCompassSelectorElement('compass-design-selector','compass-selector-frame-image',renderedIndex);
      this._syncCompassSelectorElement('settings-selector-preview','settings-selector-frame-image',this._compassSelectorFrameIndex);
      const settingsPosition=`${this._compassSelectorFrameIndex+1} / ${COMPASS_SELECTOR_FRAME_IMAGES.length}`;
      if(output&&output.textContent!==settingsPosition)output.textContent=settingsPosition;
      const labels={
        'compass-design-prev':'compass.previous','compass-design-next':'compass.next',
        'selector-frame-prev':'settings.selector_previous','selector-frame-next':'settings.selector_next'
      };
      Object.entries(labels).forEach(([id,key])=>{const button=this.shadow?.getElementById(id),label=this._t(key);if(button){button.title=label;button.setAttribute('aria-label',label);}});
      this.shadow?.querySelectorAll('[data-selector-design-label]').forEach((node)=>{node.textContent=this._t('settings.selector_design');});
      this.shadow?.getElementById('settings-selector-preview')?.setAttribute('aria-label',this._t('settings.selector_design'));
      const calibrationNavigation=this._compassCalibrationEnabled&&(!this._diagnostics.enabled||this._diagnostics.live);
      ['compass-design-prev','compass-design-next'].forEach((id)=>{const button=this.shadow?.getElementById(id),enabled=effectsEnabled||calibrationNavigation;if(button){button.disabled=!enabled;button.setAttribute('aria-disabled',enabled?'false':'true');}});
      ['selector-frame-prev','selector-frame-next'].forEach((id)=>{const button=this.shadow?.getElementById(id);if(button){button.disabled=!effectsEnabled;button.setAttribute('aria-disabled',effectsEnabled?'false':'true');}});
      if(this._compassCalibrationEnabled||this._diagnostics.enabled)requestAnimationFrame(()=>this._recordCompassSelectorGeometry());
    },

    _recordCompassSelectorGeometry() {
      const selector=this.shadow?.getElementById('compass-design-selector'),image=this.shadow?.getElementById('compass-selector-frame-image'),parent=selector?.parentElement;
      if(!selector||!image||!parent)return;
      const outer=selector.getBoundingClientRect(),asset=image.getBoundingClientRect(),parentBox=parent.getBoundingClientRect(),style=getComputedStyle(selector);
      const sample={timestamp:performance.now(),outer:`${outer.width.toFixed(2)}x${outer.height.toFixed(2)}`,image:`${asset.width.toFixed(2)}x${asset.height.toFixed(2)}`,parent:`${parentBox.width.toFixed(2)}x${parentBox.height.toFixed(2)}`,css:`${style.width}x${style.height}`,transform:style.transform,layoutShift:this._diagnostics.layoutShifts.reduce((sum,entry)=>sum+entry.value,0),mode:selector.dataset.assetMode||'unknown'};
      const last=this._compassSelectorDiagnostics.recent.at(-1);
      if(!last||last.outer!==sample.outer||last.image!==sample.image||last.parent!==sample.parent||last.css!==sample.css||last.transform!==sample.transform||last.mode!==sample.mode){this._compassSelectorDiagnostics.recent.push(sample);this._compassSelectorDiagnostics.recent=this._compassSelectorDiagnostics.recent.slice(-20);}
    },

    _compassSelectorDiagnosticLines() {
      const diagnostics=this._compassSelectorDiagnostics;
      return [`SELECTOR DIAGNOSE`,`Update calls: ${diagnostics.updates}`,`ResizeObserver callbacks: ${diagnostics.resizeCallbacks} (selector is not observed)`,...diagnostics.recent.map((entry,index)=>`${index+1}: outer ${entry.outer}; image ${entry.image}; parent ${entry.parent}px; CSS ${entry.css}; mode ${entry.mode}`)];
    },

    _syncCompassSelectorElement(selectorId,imageId,index) {
      const selector=this.shadow?.getElementById(selectorId),frame=this.shadow?.getElementById(imageId),image=COMPASS_SELECTOR_FRAME_IMAGES[index];
      if(!selector||!frame)return;
      const mode=image?'image':'css',sameMode=selector.dataset.assetMode===mode,sameSource=image&&frame.getAttribute('src')===image;
      if(mode==='css'){
        if(!sameMode){selector.classList.remove('asset-loaded','asset-error');selector.classList.add('asset-css');frame.removeAttribute('src');selector.dataset.assetMode=mode;}
        return;
      }
      selector.classList.remove('asset-css');
      if(!sameSource){selector.classList.remove('asset-loaded','asset-error');frame.setAttribute('src',image);selector.dataset.assetMode=mode;}
      if(frame.complete&&!selector.classList.contains('asset-loaded')&&!selector.classList.contains('asset-error'))this._setCompassSelectorAssetState(selectorId,frame.naturalWidth>0);
    },

    _setCompassSelectorAssetState(selectorId,loaded) {
      const selector=this.shadow?.getElementById(selectorId);
      if(selector?.dataset.assetMode!=='image')return;
      selector?.classList.toggle('asset-loaded',loaded);
      selector?.classList.toggle('asset-error',!loaded);
    },

    _diagnosticText(index) { return (DIAGNOSTIC_UI[this._languageValue()]||DIAGNOSTIC_UI[LANGUAGE_DEFAULT])[index]; },
};});

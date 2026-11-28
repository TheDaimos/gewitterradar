# MA V4.14.27 CI regression diagnostics

Branch: feature/v4.14-monitored-areas
Workflow: ma-v41426-dev-build-sync.yml
These are test results, not operator database data.

~~~
  '      let locationListTouching=false;\n' +
  '      let locationListScrollGuard=0;\n' +
  '      let locationListReleaseTimer=null;\n' +
  '      if(locationDropdown){\n' +
  "        locationDropdown.style.setProperty('touch-action','pan-y','important');\n" +
  "        locationDropdown.style.setProperty('overscroll-behavior-y','contain');\n" +
  "        locationDropdown.style.setProperty('-webkit-overflow-scrolling','touch');\n" +
  '        const releaseTouch=()=>{\n' +
  '          if(locationListReleaseTimer!==null)clearTimeout(locationListReleaseTimer);\n' +
  '          locationListReleaseTimer=setTimeout(()=>{\n' +
  '            locationListTouching=false;\n' +
  '            locationListScrollGuard=performance.now()+250;\n' +
  '          },500);\n' +
  '        };\n' +
  "        locationDropdown.addEventListener('pointerdown',event=>event.stopPropagation());\n" +
  "        locationDropdown.addEventListener('touchstart',event=>{\n" +
  '          if(locationListReleaseTimer!==null)clearTimeout(locationListReleaseTimer);\n' +
  '          locationListTouching=true;event.stopPropagation();\n' +
  '        },{passive:true});\n' +
  '        loca'... 234377 more characters

    at file:///home/runner/work/gewitterradar/gewitterradar/tests/test_ma_location_manager.mjs:28:8 {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: "import {settingsStorage} from '../core/settings-vault.js?v=4134r1';\n" +
    "import {createLocationPort} from '../monitored-areas/location-port.js?v=41427r1';\n" +
    "import {openLocationManager} from '../monitored-areas/location-manager.js?v=41427r1';\n" +
    "import {migrationRequestUUID} from '../monitored-areas/migration-wizard.js?v=41427r1';\n" +
    'import { defineModule } from "../core/runtime.js?v=41132r1";\n' +
    '// One menu tree drives both presentations. Existing controls remain single DOM instances.\n' +
    'export const SETTINGS_MENU_TREE=Object.freeze([\n' +
    "  {id:'weather-engine-section',number:'1',title:'Weather-Engine'},\n" +
    "  {id:'settings-language-section',number:'2',title:'Sprache'},\n" +
    "  {id:'settings-location-section',number:'3',title:'Standort'},\n" +
    "  {id:'settings-map-section',number:'4',title:'Kartendarstellung'},\n" +
    "  {id:'settings-aura-section',number:'5',title:'Effekte & Animationen'},\n" +
    "  {id:'settings-radii-section',number:'6',title:'Radien'},\n" +
    "  {id:'gr-vault-section',number:'',title:'Userprofile & Sicherungen'},\n" +
    "  {id:'settings-diagnostic-section',number:'7',title:'Diagnose Tools',children:Object.freeze([\n" +
    "    {id:'settings-calibration-section',number:'7.1',title:'Kalibrierung'},\n" +
    "    {id:'settings-weather-diagnostics-section',number:'7.2',title:'Weather-Engine'},\n" +
    "    {id:'settings-data-sources-section',number:'7.3',title:'Datenquellen & Verbindungen'},\n" +
    "    {id:'settings-modules-section',number:'7.4',title:'Module & Versionen'}\n" +
    '  ].map(Object.freeze))}\n' +
    '].map(Object.freeze));\n' +
    'export const MODULE_META=Object.freeze({\n' +
    '  "id": "ui.controls",\n' +
    '  "version": "1.1.96",\n' +
    '  "group": "Oberfläche",\n' +
    '  "function": "Bedienbindungen",\n' +
    '  "subfunctions": [\n' +
    '    "Klick",\n' +
    '    "Touch",\n' +
    '    "Formulare",\n' +
    '    "Menüaktionen"\n' +
    '  ],\n' +
    '  "file": "modules/ui/controls.js"\n' +
    '});\n' +
    'export const installControls=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {\n' +
    '    _clusterResolutionOptions() {\n' +
    "      const language=this._languageValue?.()||'Deutsch';\n" +
    "      return ['early','balanced','late','classic'].map(profile=>[profile,getClusterResolutionProfileLabel(profile,language)]);\n" +
    '    },\n' +
    '\n' +
    '    _setClusterResolutionProfile(profile) {\n' +
    '      if(!this._clusterResolutionOptions().some(([id])=>id===profile))return;\n' +
    '      this._clusterResolutionProfileV40822=profile;\n' +
    "      try { settingsStorage(this).setItem('gewitterradar:v40822:cluster-resolution-profile',profile); } catch (_error) {}\n" +
    '      this._resetStatusClusterBrowse?.();\n' +
    '      this._renderMapMarkers?.();\n' +
    '      this._render?.();\n' +
    '    },\n' +
    '\n' +
    '    _bindControls() {\n' +
    '      this._bindMapDisplayControls();\n' +
    "      this.shadow.getElementById('settings-about')?.addEventListener('click', () => this._openAbout(true));\n" +
    "      this.shadow.getElementById('settings-help')?.addEventListener('click', () => this._openHelp());\n" +
    "      const obsSlider = this.shadow.getElementById('observation-slider');\n" +
    "      const stormSlider = this.shadow.getElementById('storm-slider');\n" +
    "      const dangerSlider = this.shadow.getElementById('danger-slider');\n" +
    "      const modeToggle = this.shadow.getElementById('mode-toggle');\n" +
    "      const deviceToggle = this.shadow.getElementById('device-toggle');\n" +
    "      const animationToggle = this.shadow.getElementById('animation-toggle');\n" +
    "      const statusChip = this.shadow.getElementById('status-chip');\n" +
    "      const settingsOpen = this.shadow.getElementById('settings-open');\n" +
    "      const settingsBackdrop = this.shadow.getElementById('settings-backdrop');\n" +
    "      const settingsDialog = this.shadow.getElementById('settings-dialog');\n" +
    "      const settingsClose = this.shadow.getElementById('settings-close');\n" +
    "      const releaseHistoryBadge = this.shadow.getElementById('app-version-badge');\n" +
    "      const releaseHistoryBackdrop = this.shadow.getElementById('release-history-backdrop');\n" +
    "      const releaseHistoryDialog = this.shadow.getElementById('release-history-dialog');\n" +
    "      const releaseHistoryClose = this.shadow.getElementById('release-history-close');\n" +
    "      const releaseHistoryLanguageButtons = [...this.shadow.querySelectorAll('[data-release-history-language]')];\n" +
    "      const settingsAnimationToggle = this.shadow.getElementById('settings-animation-toggle');\n" +
    "      const settingsTestsToggle = this.shadow.getElementById('settings-tests-toggle');\n" +
    "      const settingsCompassCalibrationToggle = this.shadow.getElementById('settings-compass-calibration-toggle');\n" +
    "      const settingsMedallionCalibrationToggle = this.shadow.getElementById('settings-medallion-calibration-toggle');\n" +
    "      const settingsDiagnosticsToggle = this.shadow.getElementById('settings-diagnostics-toggle');\n" +
    "      const settingsRadiiToggle = this.shadow.getElementById('settings-radii-toggle');\n" +
    "      const settingsClusterResolutionButton = this.shadow.getElementById('settings-cluster-resolution-button');\n" +
    "      const settingsClusterResolutionCurrent = this.shadow.getElementById('settings-cluster-resolution-current');\n" +
    "      const clusterResolutionDropdown = this.shadow.getElementById('cluster-resolution-dropdown');\n" +
    "      const settingsClusterJumpSelector = this.shadow.getElementById('settings-cluster-jump-selector');\n" +
    "      const settingsClusterJumpSeconds = this.shadow.getElementById('settings-cluster-jump-seconds');\n" +
    "      const settingsClusterJumpInfinite = this.shadow.getElementById('settings-cluster-jump-infinite');\n" +
    "      const settingsAuraToggle = this.shadow.getElementById('settings-aura-toggle');\n" +
    "      const settingsAuraWidth = this.shadow.getElementById('settings-aura-width');\n" +
    "      const settingsAuraIntensity = this.shadow.getElementById('settings-aura-intensity');\n" +
    "      const settingsAuraSection = this.shadow.getElementById('settings-aura-section');\n" +
    "      const settingsRadiiSection = this.shadow.getElementById('settings-radii-section');\n" +
    "      const settingsLocationButton = this.shadow.getElementById('settings-location-button');\n" +
    "      const locationDropdown = this.shadow.getElementById('location-dropdown');\n" +
    '      let locationDropdownAnchor = null;\n' +
    '      // V4.11.60: standalone Android touch scrolling, isolated from map gesture handling.\n' +
    '      let locationListTouching=false;\n' +
    '      let locationListScrollGuard=0;\n' +
    '      let locationListReleaseTimer=null;\n' +
    '      if(locationDropdown){\n' +
    "        locationDropdown.style.setProperty('touch-action','pan-y','important');\n" +
    "        locationDropdown.style.setProperty('overscroll-behavior-y','contain');\n" +
    "        locationDropdown.style.setProperty('-webkit-overflow-scrolling','touch');\n" +
    '        const releaseTouch=()=>{\n' +
    '          if(locationListReleaseTimer!==null)clearTimeout(locationListReleaseTimer);\n' +
    '          locationListReleaseTimer=setTimeout(()=>{\n' +
    '            locationListTouching=false;\n' +
    '            locationListScrollGuard=performance.now()+250;\n' +
    '          },500);\n' +
    '        };\n' +
    "        locationDropdown.addEventListener('pointerdown',event=>event.stopPropagation());\n" +
    "        locationDropdown.addEventListener('touchstart',event=>{\n" +
    '          if(locationListReleaseTimer!==null)clearTimeout(locationListReleaseTimer);\n' +
    '          locationListTouching=true;event.stopPropagation();\n' +
    '        },{passive:true});\n' +
    '        loca'... 234377 more characters,
  expected: /import \{openLocationManager\} from '\.\.\/monitored-areas\/location-manager\.js\?v=41426r1'/,
  operator: 'match',
  diff: 'simple'
}

Node.js v22.23.5
~~~

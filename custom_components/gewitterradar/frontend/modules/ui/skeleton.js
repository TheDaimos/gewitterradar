import { defineModule } from "../core/runtime.js?v=41002r11";
export const MODULE_META=Object.freeze({
  "id": "ui.skeleton",
  "version": "1.1.4",
  "group": "Oberfläche",
  "function": "Grundgerüst",
  "subfunctions": [
    "HTML",
    "CSS",
    "Dialoge",
    "Menüstruktur"
  ],
  "file": "modules/ui/skeleton.js"
});
export const installSkeleton=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _buildSkeleton() {
      this._built = true;
      this.shadow = this.attachShadow({ mode: 'open' });

      this.shadow.innerHTML = `
        <link rel="stylesheet" href="${LEAFLET_CSS_URL}" id="leaflet-css-link">
        <style>
          :host {
            display:block;
            /* V3.70 – dynamische Blitz-Updates dürfen den äußeren
               Home-Assistant-Scroller nicht über Browser-Scroll-Anchoring auf
               den Kartenanfang bzw. die KPI-Zeile zurückziehen. */
            overflow-anchor:auto;
            --b-bg:${C.bg};
            --b-panel:${C.panel};
            --b-panel2:${C.panel2};
            --b-gold:${C.gold};
            --b-blue:${C.blue};
            --b-purple:${C.purple};
            --b-danger:${C.danger};
            --b-text:${C.text};
            --b-text2:${C.text2};
            --b-muted:${C.muted};
          }

          * { box-sizing:border-box; }
          button, input { font:inherit; }

          ha-card {
            position:relative;
            overflow:hidden;
            overflow-anchor:auto;
            isolation:isolate;
            contain:paint;
            color:var(--b-text);
            background:
              radial-gradient(circle at 8% -10%, rgba(79,163,247,.09), transparent 34%),
              radial-gradient(circle at 92% 8%, rgba(246,195,68,.075), transparent 30%),
              linear-gradient(180deg,#0e1118 0%,#0a0d12 100%);
            border:1px solid rgba(255,255,255,.07);
            border-radius:24px;
            box-shadow:0 22px 60px rgba(0,0,0,.32);
            transition:border-color .35s ease, box-shadow .35s ease;
          }

          ha-card.danger-state {
            border-color:rgba(255,90,103,.28);
            box-shadow:0 22px 60px rgba(0,0,0,.34), inset 0 0 36px rgba(255,51,71,.025);
          }

          ha-card::before {
            content:'';
            position:absolute;
            inset:0;
            pointer-events:none;
            background-image:
              linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px),
              linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px);
            background-size:28px 28px;
            mask-image:linear-gradient(to bottom,rgba(0,0,0,.38),transparent 56%);
          }

          .shell {
            position:relative;
            z-index:2;
            overflow-anchor:auto;
            width:100%;
            max-width:1480px;
            margin:0 auto;
            padding:18px;

            /* V3.70 – Container Queries reagieren auf die tatsächlich
               verfügbare Kartenbreite. Das ist wichtig, weil das geöffnete
               Home-Assistant-Seitenmenü die Karte schmaler macht, ohne die
               Viewport-Breite des iPads entsprechend zu verändern. */
            container-type:inline-size;
            container-name:gewitterradar-shell;
          }

          .alert-flash {
            position:absolute;
            inset:0;
            z-index:50;
            pointer-events:none;
            overflow:hidden;
            border-radius:inherit;
          }

          .flash-ambient,
          .flash-white,
          .flash-red {
            position:absolute;
            inset:0;
            opacity:0;
            pointer-events:none;
          }

          /* V3.515 – Hauptblitz:
             Kein sichtbarer Blitzkern. Stattdessen wird der Raum scheinbar von
             Fenstern/gläsernen Wänden ringsherum grell aufgehellt. Das Zentrum
             bleibt vergleichsweise ruhig, die Kanten und Ecken tragen das Licht. */
          .flash-ambient {
            z-index:2;
            background:
              radial-gradient(ellipse at 50% 50%,
                rgba(222,238,255,.015) 0%,
                rgba(228,241,255,.025) 34%,
                rgba(235,246,255,.10) 58%,
                rgba(242,249,255,.34) 79%,
                rgba(250,253,255,.72) 100%),
              linear-gradient(90deg,
                rgba(235,247,255,.42) 0%,
                rgba(235,247,255,.06) 16%,
                rgba(235,247,255,0) 34%,
                rgba(235,247,255,0) 66%,
                rgba(235,247,255,.06) 84%,
                rgba(235,247,255,.42) 100%),
              linear-gradient(180deg,
                rgba(240,249,255,.46) 0%,
                rgba(235,247,255,.055) 18%,
                rgba(235,247,255,0) 38%,
                rgba(235,247,255,0) 64%,
                rgba(235,247,255,.055) 84%,
                rgba(240,249,255,.43) 100%);
            box-shadow:
              inset 0 0 72px rgba(232,245,255,.38),
              inset 0 0 24px rgba(255,255,255,.22);
            will-change:opacity;
          }

          .flash-white {
            z-index:3;
            /* V3.514 – Position kommt bei JEDEM einzelnen Lichtimpuls aus JS.
               Dadurch wandert das Zentrum innerhalb der Karte wie bei mehreren
               Entladungen eines realen Gewitters. */
            background:
              radial-gradient(circle at var(--flash-x,50%) var(--flash-y,39%),
                rgba(255,255,255,.99) 0%,
                rgba(241,248,255,.82) 13%,
                rgba(218,235,255,.42) 34%,
                rgba(190,220,255,.14) 58%,
                rgba(255,255,255,0) 82%);
            will-change:opacity,background;
          }

          .flash-red {
            z-index:1;
            /* V3.514 – deutlich sichtbarer Gewitterschleier auch auf sehr dunklen
               Displays. Der Effekt bleibt transparent, erhält aber mehr Sättigung,
               stärkere Randglut und eine leichte flächige Rotkomponente. */
            background:
              radial-gradient(circle at var(--red-x,50%) var(--red-y,42%),
                rgba(255,76,90,.34) 0%,
                rgba(255,38,60,.19) 42%,
                rgba(255,24,45,.09) 72%,
                rgba(255,24,45,.035) 100%),
              linear-gradient(
                rgba(255,26,48,.075),
                rgba(135,7,24,.055)
              );
            box-shadow:
              inset 0 0 118px rgba(255,33,52,.29),
              inset 0 0 34px rgba(255,76,90,.15);
            mix-blend-mode:screen;
          }

          /* Der weiße Dreifachblitz wird ab V3.514 vollständig per JS erzeugt,
             damit Position UND Zwischenzeit wirklich zufällig sein können. */
          .alert-flash.fire .flash-red {
            animation:lightningRed 2.05s ease-out both;
          }

          @keyframes lightningRed {
            0%,4% { opacity:0; }
            10%   { opacity:.54; }
            24%   { opacity:.46; }
            48%   { opacity:.33; }
            72%   { opacity:.19; }
            100%  { opacity:0; }
          }

          /* Intensität des Hauptblitzes wird in JS zusätzlich anhand der
             tatsächlichen Kartenbreite geregelt. CSS liefert nur die Basis. */
          .flash-ambient { --ambient-css-scale:.86; }

          .topbar {
            display:flex;
            align-items:flex-start;
            justify-content:space-between;
            gap:16px;
            margin-bottom:14px;
          }

          .brand { min-width:0; }
          .eyebrow {
            display:flex;
            align-items:center;
            gap:7px;
            color:var(--b-gold);
            font-size:10px;
            font-weight:850;
            letter-spacing:.16em;
            text-transform:uppercase;
            margin-bottom:5px;
          }

          /* V3.99408 – echte Blitzortung-Verfügbarkeitsanzeige.
             Grün = Datenquelle aktiv, Orange = Entity vorhanden aber unavailable,
             Rot = konfigurierte Entity fehlt, Grau = noch nicht initialisiert/unknown. */
          .live-dot {
            width:7px;
            height:7px;
            border-radius:50%;
            background:#747c89;
            box-shadow:0 0 6px rgba(116,124,137,.34);
            animation:none;
            transition:background .18s ease,box-shadow .18s ease;
          }
          .live-dot.available {
            background:${C.green};
            box-shadow:0 0 0 0 rgba(68,212,156,.45);
            animation:livePulse 2s ease-out infinite;
          }
          .live-dot.degraded { background:#F59E0B;box-shadow:0 0 8px rgba(245,158,11,.52); }
          .live-dot.missing { background:${C.danger};box-shadow:0 0 8px rgba(255,90,103,.52); }
          .live-dot.initializing { background:#747c89;box-shadow:0 0 6px rgba(116,124,137,.34); }
          #source-status { cursor:help; }

          .title {
            margin:0;
            font-size:clamp(25px,3vw,34px);
            line-height:1;
            font-weight:820;
            letter-spacing:-.035em;
          }

          /* V3.974 – compact card-version plaque next to the app name.
             It is derived exclusively from CARD_VERSION; no helper can drift out of sync. */
          .app-version-badge {
            display:inline-flex;
            align-items:center;
            justify-content:center;
            min-height:18px;
            margin-left:7px;
            padding:2px 6px;
            border:1px solid rgba(246,195,68,.34);
            border-radius:7px;
            background:linear-gradient(180deg,rgba(246,195,68,.10),rgba(246,195,68,.045));
            color:var(--b-gold);
            font-size:8px;
            line-height:1;
            font-weight:880;
            letter-spacing:.065em;
            vertical-align:.30em;
            white-space:nowrap;
            box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 0 10px rgba(246,195,68,.06);
          }

          .app-version-badge:focus-visible {
            outline:1px solid rgba(246,195,68,.72);
            outline-offset:2px;
          }

          /* V3.99714 – public release history. The badge geometry above is unchanged;
             only interaction and this isolated overlay are added. */
          .release-history-backdrop {
            position:fixed;
            inset:0;
            z-index:2147483645;
            display:none;
            align-items:center;
            justify-content:center;
            box-sizing:border-box;
            padding:clamp(14px,3vw,30px);
            background:radial-gradient(circle at 50% 35%,rgba(31,44,66,.28),rgba(4,7,12,.72) 58%,rgba(1,2,4,.86) 100%);
            backdrop-filter:blur(10px) saturate(.86);
            -webkit-backdrop-filter:blur(10px) saturate(.86);
            overscroll-behavior:contain;
          }
          .release-history-backdrop.open {
            display:flex;
            animation:settingsBackdropIn .18s ease-out both;
          }
          .release-history-dialog {
            width:min(590px,100%);
            max-height:min(760px,calc(100dvh - 20px));
            overflow:hidden;
            box-sizing:border-box;
            border-radius:22px;
            color:var(--b-text);
            border:1px solid rgba(246,195,68,.24);
            background:linear-gradient(180deg,rgba(20,27,38,.99),rgba(8,12,18,.995));
            box-shadow:0 30px 90px rgba(0,0,0,.68),0 0 0 1px rgba(255,255,255,.025) inset,0 0 38px rgba(246,195,68,.045);
          }
          .release-history-head {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:12px;
            padding:13px 16px 11px;
            border-bottom:1px solid rgba(255,255,255,.07);
            background:linear-gradient(180deg,rgba(17,23,32,.995),rgba(17,23,32,.94));
          }
          .release-history-kicker {
            color:var(--b-gold);
            font-size:8px;
            font-weight:900;
            letter-spacing:.18em;
            text-transform:uppercase;
          }
          .release-history-title {
            margin-top:2px;
            font-size:17px;
            line-height:1.05;
            font-weight:850;
            letter-spacing:-.02em;
          }
          .release-history-head-actions {
            flex:0 0 auto;
            display:flex;
            align-items:center;
            gap:9px;
          }
          /* V4.07 TEST7: bilingual Release History and compact premium language switch. */
          .release-history-heading{min-width:0}
          .release-history-title-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:2px}
          .release-history-title-row .release-history-title{margin-top:0}
          .release-history-language-toggle{display:inline-grid;grid-template-columns:repeat(2,36px);gap:2px;padding:2px;border:1px solid rgba(214,172,78,.34);border-radius:999px;background:rgba(4,9,14,.55);box-shadow:inset 0 1px rgba(255,239,194,.06)}
          .release-history-language-button{appearance:none;-webkit-appearance:none;min-width:36px;height:30px;padding:0 7px;border:0;border-radius:999px;background:transparent;color:#8f98a5;font:850 9px/1 inherit;letter-spacing:.08em;cursor:pointer;transition:background .16s ease,color .16s ease,box-shadow .16s ease,transform .12s ease}
          .release-history-language-button[aria-pressed="true"]{color:#f7dfa1;background:linear-gradient(180deg,rgba(194,146,55,.32),rgba(111,75,19,.27));box-shadow:inset 0 0 0 1px rgba(244,206,121,.28),0 0 8px rgba(214,166,64,.12)}
          .release-history-language-button:focus-visible{outline:2px solid #e7c16e;outline-offset:1px}
          .release-history-language-button:active{transform:scale(.97)}
          .release-history-lang-panel[hidden]{display:none!important}
          @media(hover:hover) and (pointer:fine){.release-history-language-button:hover{color:#efd18c;background:rgba(205,158,64,.10)}}
          @media(max-width:430px){.release-history-head{gap:8px;padding-left:12px;padding-right:10px}.release-history-title-row{gap:7px}.release-history-language-toggle{grid-template-columns:repeat(2,34px)}.release-history-language-button{min-width:34px;height:30px;padding:0 6px}.release-history-head-actions{gap:5px}.release-history-current{font-size:7.5px;letter-spacing:.04em}}
          .release-history-current {
            color:#747d8a;
            font-size:8.2px;
            font-weight:720;
            letter-spacing:.08em;
            white-space:nowrap;
          }
          .release-history-close {
            appearance:none;
            width:34px;
            height:34px;
            border-radius:50%;
            border:1px solid rgba(255,255,255,.10);
            background:rgba(255,255,255,.04);
            color:#d8dde6;
            font:700 20px/1 inherit;
            cursor:pointer;
          }
          /* V4.07: Release History inherits the accepted Settings/Help premium metal treatment. */
          .release-history-dialog{
            border:2px solid transparent;
            background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%) padding-box,linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995)) padding-box,linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c) border-box;
            box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,236,181,.08),inset 0 1px rgba(255,244,213,.10),0 0 8px rgba(215,164,67,.055)
          }
          .release-history-close{position:relative;display:grid!important;place-items:center;width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important;padding:0!important;border:0!important;border-radius:8px!important;background:transparent!important;color:transparent!important;font-size:0!important;line-height:0!important;overflow:visible;box-shadow:none!important}
          .release-history-close img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}
          .release-history-close:focus-visible{outline:2px solid #e7c16e!important;outline-offset:-2px!important}
          .release-history-close:active img{transform:scale(.97);filter:brightness(.92)}
          @media(hover:hover) and (pointer:fine){.release-history-close:hover{background:transparent!important}.release-history-close:hover img{filter:brightness(1.12) drop-shadow(0 0 2px #dba34c70)}}
          @media(hover:none) and (pointer:coarse){.release-history-close:focus-visible{outline:none!important}}
          .release-history-body {
            max-height:calc(min(760px,100dvh - 20px) - 60px);
            overflow-y:auto;
            -webkit-overflow-scrolling:touch;
            padding:11px 13px 14px;
          }
          .release-history-entry {
            padding:11px 12px 12px;
            border:1px solid rgba(255,255,255,.075);
            border-radius:15px;
            background:rgba(255,255,255,.025);
          }
          .release-history-entry + .release-history-entry { margin-top:8px; }
          .release-history-version {
            color:var(--b-gold);
            font-size:8px;
            font-weight:900;
            letter-spacing:.13em;
            text-transform:uppercase;
          }
          .release-history-entry h3 {
            margin:4px 0 5px;
            font-size:13px;
            line-height:1.2;
            font-weight:850;
            color:#e7ebf1;
          }
          .release-history-entry p {
            margin:0;
            color:#aab3c0;
            font-size:10.5px;
            line-height:1.48;
          }
          .release-history-plan-list {
            margin:4px 0 0;
            padding-left:17px;
            color:#aab3c0;
            font-size:10.5px;
            line-height:1.48;
          }
          
          .release-history-plan-list li + li { margin-top:2px; }
          .release-history-future {
            margin:0 0 8px;
            border:1px solid rgba(232,188,90,.22);
            border-radius:15px;
            background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.02));
            overflow:hidden;
            box-shadow:inset 0 1px rgba(255,244,213,.04);
          }
          .release-history-future summary {
            display:grid;
            grid-template-columns:minmax(0,1fr) 18px;
            align-items:center;
            gap:10px;
            padding:11px 12px 12px;
            list-style:none;
            cursor:pointer;
          }
          .release-history-future summary::-webkit-details-marker { display:none; }
          .release-history-future-heading { min-width:0; }
          .release-history-future summary h3 {
            margin:4px 0 0;
            font-size:13px;
            line-height:1.2;
            font-weight:850;
            color:#e7ebf1;
          }
          .release-history-future-chevron {
            width:12px;
            height:12px;
            justify-self:end;
            border-right:2px solid #f1ca74;
            border-bottom:2px solid #f1ca74;
            transform:rotate(45deg);
            transition:transform .42s cubic-bezier(.22,1,.36,1), filter .28s ease;
            margin:-5px 2px 0 0;
            filter:drop-shadow(0 1px .5px #4c301c) drop-shadow(0 0 3px #d8a74a66);
          }
          .release-history-future[open] .release-history-future-chevron {
            transform:rotate(225deg);
            margin-top:5px;
            filter:brightness(1.14) drop-shadow(0 1px .5px #4c301c) drop-shadow(0 0 4px #d8a74a88);
          }
          .release-history-future-content { padding:0 12px 12px; }
          .release-history-future-content .release-history-plan-list { margin-top:0; }


          .subtitle {
            margin-top:7px;
            color:var(--b-muted);
            font-size:12px;
            display:flex;
            align-items:center;
            gap:5px;
            min-width:0;
            white-space:nowrap;
          }
          #radar-subtitle-location {
            min-width:0;
            flex:0 1 auto;
            overflow:visible;
            text-overflow:clip;
            white-space:nowrap;
          }
          .subtitle-separator,
          #radar-subtitle-window {
            flex:0 0 auto;
            white-space:nowrap;
          }

          .top-actions {
            display:flex;
            align-items:center;
            justify-content:flex-end;
            flex-wrap:wrap;
            gap:8px;
          }
          /* V3.99702 – strukturelle Gruppen für den mobilen Kopf. Auf Desktop
             bleiben beide Wrapper mit display:contents vollständig neutral. */
          .header-chip-row,
          .header-control-row {
            display:contents;
          }

          .top-chip {
            display:inline-flex;
            align-items:center;
            gap:7px;
            min-height:34px;
            padding:0 12px;
            border:1px solid rgba(255,255,255,.09);
            border-radius:999px;
            background:rgba(255,255,255,.035);
            color:var(--b-text2);
            font-size:10px;
            font-weight:760;
            white-space:nowrap;
          }

          button.top-chip { cursor:pointer;transition:.18s ease; }
          button.top-chip:hover { background:rgba(255,255,255,.055); }
          button.top-chip:active { transform:scale(.985); }
          .top-chip .bolt { color:var(--b-gold);font-size:14px; }
          .top-chip .state-dot { width:5px;height:5px;border-radius:50%;background:#747c89; }

          .animation-chip.on {
            color:#f4df9c;
            border-color:rgba(246,195,68,.28);
            background:rgba(246,195,68,.055);
          }
          .animation-chip.on .state-dot { background:var(--b-gold);box-shadow:0 0 8px rgba(246,195,68,.7); }
          .animation-chip.off { opacity:.82; }

          /* Regressions-/Abnahmewerkzeug für die Warnanimation.
             Die Sichtbarkeit wird über den bestehenden Testwerkzeug-Helfer gesteuert;
             kein zusätzlicher Home-Assistant-Helfer ist erforderlich. */
          .warning-test-chip {
            color:#ffd3d7;
            border-color:rgba(255,90,103,.44);
            background:
              linear-gradient(180deg,rgba(255,90,103,.095),rgba(255,39,61,.045));
            box-shadow:
              inset 0 0 16px rgba(255,47,68,.025),
              0 0 0 rgba(255,47,68,0);
          }
          .warning-test-chip .bolt {
            color:var(--b-danger);
            filter:drop-shadow(0 0 5px rgba(255,90,103,.38));
          }
          button.warning-test-chip:hover {
            color:#ffe5e8;
            border-color:rgba(255,90,103,.66);
            background:
              linear-gradient(180deg,rgba(255,90,103,.15),rgba(255,39,61,.075));
            box-shadow:
              inset 0 0 18px rgba(255,47,68,.04),
              0 0 14px rgba(255,47,68,.08);
          }
          button.warning-test-chip:active {
            transform:scale(.97);
          }

          .warning-test-chip.storm-test {
            color:#d9ecff;
            border-color:rgba(79,163,247,.48);
            background:linear-gradient(180deg,rgba(79,163,247,.13),rgba(79,163,247,.055));
          }
          .warning-test-chip.storm-test .bolt {
            color:#8fc8ff;
            filter:drop-shadow(0 0 6px rgba(79,163,247,.42));
          }
          button.warning-test-chip.storm-test:hover {
            color:#eef7ff;
            border-color:rgba(120,195,255,.70);
            background:linear-gradient(180deg,rgba(79,163,247,.20),rgba(79,163,247,.085));
          }

          /* V3.512 TEST – zusätzliche kompakte Prüftaster an mehreren
             Scrollpositionen. Alle rufen exakt denselben Warnanimationspfad auf. */
          .warning-test-mini {
            appearance:none;
            border:1px solid rgba(255,90,103,.44);
            outline:0;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            gap:5px;
            min-height:28px;
            box-sizing:border-box;
            padding:0 9px;
            border-radius:999px;
            background:
              linear-gradient(180deg,rgba(255,90,103,.125),rgba(255,39,61,.055));
            color:#ffd6da;
            font-family:inherit;
            font-size:7.4px;
            font-weight:880;
            line-height:1;
            letter-spacing:.045em;
            white-space:nowrap;
            cursor:pointer;
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,.035),
              inset 0 0 14px rgba(255,47,68,.025),
              0 5px 16px rgba(0,0,0,.18);
            backdrop-filter:blur(10px);
            transition:
              transform .16s ease,
              color .16s ease,
              border-color .16s ease,
              background .16s ease,
              box-shadow .16s ease;
          }
          .warning-test-mini .bolt {
            color:var(--b-danger);
            font-size:11px;
            line-height:1;
            filter:drop-shadow(0 0 5px rgba(255,90,103,.42));
          }
          .warning-test-mini.storm-test {
            color:#d9ecff;
            border-color:rgba(79,163,247,.48);
            background:linear-gradient(180deg,rgba(79,163,247,.14),rgba(79,163,247,.06));
          }
          .warning-test-mini.storm-test .bolt {
            color:#8fc8ff;
            filter:drop-shadow(0 0 5px rgba(79,163,247,.45));
          }
          .warning-test-mini:hover {
            color:#fff0f2;
            border-color:rgba(255,105,117,.68);
            background:
              linear-gradient(180deg,rgba(255,90,103,.19),rgba(255,39,61,.085));
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,.05),
              inset 0 0 16px rgba(255,47,68,.04),
              0 5px 18px rgba(255,47,68,.08);
          }
          .warning-test-mini:active {
            transform:scale(.95);
          }

          /* V3.513 – robuste Klick-/Touch-Ebene.
             Besonders der unterste Taster im Kompasskopf lag je nach Layout in
             einer konkurrierenden Stacking-Ebene. Alle Testtaster bekommen daher
             eine explizite aktive Ebene und Touch-Behandlung. */
          .warning-test-mini,
          .warning-test-chip {
            position:relative;
            z-index:80;
            pointer-events:auto !important;
            touch-action:manipulation;
            -webkit-tap-highlight-color:transparent;
          }
          /* V4.09.03 – fail-closed auch nach dem Reparenting der Karte in den
             Vollbild-Dialog. Die Sichtbarkeit hängt nicht mehr von #card-root ab. */
          [data-warning-test][hidden] { display:none!important; }
          .compass-head {
            position:relative;
            z-index:70;
            overflow:visible;
          }
          .compass-actions {
            position:relative;
            z-index:75;
            overflow:visible;
          }
          #warning-test-compass-storm,
          #warning-test-compass-danger {
            z-index:90;
            pointer-events:auto !important;
          }

          /* Im Karten-Overlay kompakter, damit die Leaflet-Bedienung frei bleibt. */
          .map-top-controls .warning-test-mini {
            min-height:29px;
            padding:0 8px;
            background:rgba(36,10,15,.84);
          }

          /* Im Kompasskopf und Verlauf bewusst unauffällig, aber gut erreichbar. */
          .compass-actions .warning-test-mini,
          .history-head .warning-test-mini {
            flex:0 0 auto;
          }

          /* V3.557 – Testwerkzeuge im Verlauf:
             Beide Taster bilden jetzt rechts einen eigenen kompakten Bedienblock.
             Dadurch verteilt justify-content:space-between die beiden Buttons
             nicht mehr über die gesamte Kopfbreite. */
          .history-test-actions {
            flex:0 0 auto;
            display:flex;
            align-items:center;
            justify-content:flex-end;
            /* V3.558 – identisches Spaltmaß wie bei den Testwerkzeugen
               im Kompasskopf bzw. den übrigen Bediengruppen. */
            gap:6px;
            margin-left:auto;
          }

          .settings-chip {
            width:36px;
            padding:0;
            justify-content:center;
            color:#d6dbe5;
            border-color:rgba(255,255,255,.11);
            background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.025));
          }
          .settings-chip .gear {
            font-size:15px;
            line-height:1;
            color:#d7b866;
            filter:drop-shadow(0 0 6px rgba(246,195,68,.15));
          }

          /* V3.981 – iPadOS/Safari renders the Unicode gear glyph with an
             optically displaced font box. Keep the established glyph on
             Desktop/Android, but use a geometrically centered HA SVG icon
             only on iPad-like devices. The button geometry itself is untouched. */
          .settings-chip .gear-ipad {
            display:none;
          }
          #card-root.ipad-device .settings-chip .gear-glyph {
            display:none;
          }
          #card-root.ipad-device .settings-chip .gear-ipad {
            display:block;
            width:1em;
            height:1em;
            min-width:1em;
            min-height:1em;
            --mdc-icon-size:1em;
            flex:0 0 1em;
            align-self:center;
          }
          .settings-chip:hover .gear {
            color:#f0cc6d;
            filter:drop-shadow(0 0 8px rgba(246,195,68,.28));
          }

          /* V3.528 – Ausblenden der Testwerkzeuge in der Hauptansicht über HA-Helper.
             Die Testbuttons IM Popup bleiben immer erreichbar. */
          #card-root.tests-hidden [data-warning-test] {
            display:none !important;
          }

          .settings-backdrop {
            position:fixed;
            inset:0;
            z-index:2147483645;
            display:none;
            align-items:center;
            justify-content:center;
            box-sizing:border-box;
            padding:clamp(14px,3vw,30px);
            background:
              radial-gradient(circle at 50% 35%,rgba(31,44,66,.28),rgba(4,7,12,.72) 58%,rgba(1,2,4,.86) 100%);
            backdrop-filter:blur(10px) saturate(.86);
            -webkit-backdrop-filter:blur(10px) saturate(.86);
            overscroll-behavior:contain;
          }
          .settings-backdrop.open {
            display:flex;
            animation:settingsBackdropIn .18s ease-out both;
          }
          @keyframes settingsBackdropIn {
            from { opacity:0; }
            to { opacity:1; }
          }

          .settings-dialog {
            position:relative;
            width:min(620px,100%);
            max-height:min(780px,calc(100dvh - 20px));
            overflow:hidden;
            touch-action:manipulation;
            box-sizing:border-box;
            padding:0;
            border-radius:22px;
            color:var(--b-text);
            border:1px solid rgba(246,195,68,.24);
            background:
              linear-gradient(180deg,rgba(20,27,38,.985),rgba(8,12,18,.99)),
              radial-gradient(circle at 18% 0%,rgba(246,195,68,.08),transparent 35%);
            box-shadow:
              0 30px 90px rgba(0,0,0,.68),
              0 0 0 1px rgba(255,255,255,.025) inset,
              0 0 38px rgba(246,195,68,.045);
            scrollbar-width:thin;
          }

          .settings-dialog-head {
            position:sticky;
            top:0;
            z-index:5;
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:12px;
            padding:13px 16px 11px;
            background:linear-gradient(180deg,rgba(17,23,32,.995),rgba(17,23,32,.94));
            border-bottom:1px solid rgba(255,255,255,.07);
            backdrop-filter:blur(14px);
          }
          .settings-kicker {
            color:var(--b-gold);
            font-size:8px;
            font-weight:900;
            letter-spacing:.18em;
            text-transform:uppercase;
          }
          .settings-title {
            margin-top:2px;
            font-size:17px;
            line-height:1.05;
            font-weight:850;
            letter-spacing:-.02em;
          }
          .settings-head-actions {
            flex:0 0 auto;
            display:flex;
            align-items:center;
            gap:9px;
          }
          .settings-version {
            color:#747d8a;
            font-size:8.2px;
            font-weight:720;
            letter-spacing:.08em;
            white-space:nowrap;
            user-select:none;
          }
          .settings-close {
            appearance:none;
            flex:0 0 auto;
            width:34px;
            height:34px;
            border-radius:50%;
            border:1px solid rgba(255,255,255,.10);
            background:rgba(255,255,255,.04);
            color:#d8dde6;
            font:700 20px/1 inherit;
            cursor:pointer;
          }
          .settings-close:hover {
            color:#fff;
            border-color:rgba(246,195,68,.28);
            background:rgba(246,195,68,.06);
          }

          .settings-body {
            display:grid;
            gap:8px;
            padding:9px 12px 11px;
          }
          .settings-section {
            border:1px solid rgba(255,255,255,.075);
            border-radius:17px;
            background:rgba(255,255,255,.025);
            overflow:hidden;
          }
          .settings-section-head {
            display:flex;
            align-items:flex-end;
            justify-content:space-between;
            gap:10px;
            padding:8px 12px 7px;
            border-bottom:1px solid rgba(255,255,255,.055);
          }
          .settings-section-title {
            color:#dce2eb;
            font-size:9px;
            font-weight:900;
            letter-spacing:.11em;
            text-transform:uppercase;
          }
          .settings-section-sub {
            margin-top:2px;
            color:#76808e;
            font-size:7.5px;
            line-height:1.2;
          }

          .settings-row {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:12px;
            min-height:43px;
            padding:6px 12px;
            border-top:1px solid rgba(255,255,255,.045);
          }
          .settings-row:first-child { border-top:0; }
          .settings-row-label {
            min-width:0;
            color:#d8dee7;
            font-size:10px;
            font-weight:760;
          }
          .settings-row-note {
            display:inline;
            margin-left:6px;
            color:#747e8b;
            font-size:7.2px;
            font-weight:580;
          }

          .settings-switch {
            appearance:none;
            position:relative;
            flex:0 0 auto;
            width:48px;
            height:26px;
            padding:0;
            border-radius:999px;
            border:1px solid rgba(255,255,255,.12);
            background:rgba(255,255,255,.055);
            cursor:pointer;
            transition:.2s ease;
          }
          .settings-switch::after {
            content:"";
            position:absolute;
            top:3px;
            left:3px;
            width:18px;
            height:18px;
            border-radius:50%;
            background:#7a838e;
            box-shadow:0 2px 6px rgba(0,0,0,.42);
            transition:.2s cubic-bezier(.22,.82,.28,1);
          }
          .settings-switch.on {
            border-color:rgba(246,195,68,.36);
            background:rgba(246,195,68,.13);
            box-shadow:inset 0 0 12px rgba(246,195,68,.05);
          }
          .settings-switch.on::after {
            left:25px;
            background:#f1c85e;
            box-shadow:0 0 10px rgba(246,195,68,.35),0 2px 6px rgba(0,0,0,.38);
          }
          .settings-switch.tests.on {
            border-color:rgba(79,163,247,.36);
            background:rgba(79,163,247,.13);
          }
          .settings-switch.tests.on::after {
            background:#78bdff;
            box-shadow:0 0 10px rgba(79,163,247,.34),0 2px 6px rgba(0,0,0,.38);
          }

          .settings-radius-list {
            display:grid;
            gap:6px;
            padding:8px;
          }
          .settings-radius {
            padding:7px 10px 8px;
            border-radius:14px;
            border:1px solid rgba(255,255,255,.065);
            background:rgba(0,0,0,.16);
          }
          .settings-radius.observation { border-color:rgba(246,195,68,.17); }
          .settings-radius.storm { border-color:rgba(79,163,247,.20); }
          .settings-radius.danger { border-color:rgba(255,90,103,.22); }

          .settings-radius-head {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            margin-bottom:5px;
          }
          .settings-radius-name {
            color:#aeb7c3;
            font-size:8.4px;
            font-weight:850;
            letter-spacing:.055em;
            text-transform:uppercase;
          }
          .settings-radius-value {
            display:inline-flex;
            align-items:center;
            justify-content:center;
            gap:3px;
            min-width:72px;
            height:28px;
            font-size:13px;
            font-weight:900;
            font-variant-numeric:tabular-nums;
            text-align:center;
          }

          /* V3.91 – direkte Kilometer-Eingabe ohne iPad-Bildschirmtastatur.
             Der sichtbare Wert ist jetzt bewusst ein BUTTON statt eines input-Feldes.
             Erst ein eigenes Zahlen-Popup übernimmt die Eingabe; dadurch wird auf
             iPad/iPadOS niemals die OSK eingeblendet oder der Radiusbereich verdeckt. */
          .settings-radius-value-button {
            appearance:none;
            -webkit-appearance:none;
            min-width:72px;
            height:28px;
            box-sizing:border-box;
            padding:0 8px;
            border:1px solid rgba(255,255,255,.12);
            border-radius:9px;
            outline:0;
            background:rgba(255,255,255,.035);
            color:inherit;
            font-family:inherit;
            font-size:13px;
            font-weight:900;
            line-height:1;
            text-align:center;
            font-variant-numeric:tabular-nums;
            cursor:pointer;
            touch-action:manipulation;
            -webkit-tap-highlight-color:transparent;
            transition:border-color .16s ease,background .16s ease,box-shadow .16s ease,transform .10s ease;
          }
          .settings-radius-value-button:hover { background:rgba(255,255,255,.06); }
          .settings-radius-value-button:active { transform:scale(.96); }
          .settings-radius-value-number { pointer-events:none; }
          .settings-radius-value-unit {
            color:currentColor;
            opacity:.78;
            font-size:8px;
            font-weight:850;
            letter-spacing:.04em;
            pointer-events:none;
          }
          .settings-radius.observation .settings-radius-value-button {
            color:var(--b-gold);
            border-color:rgba(246,195,68,.32);
            box-shadow:0 0 10px rgba(246,195,68,.045);
          }
          .settings-radius.storm .settings-radius-value-button {
            color:var(--b-blue);
            border-color:rgba(79,163,247,.34);
            box-shadow:0 0 10px rgba(79,163,247,.045);
          }
          .settings-radius.danger .settings-radius-value-button {
            color:var(--b-danger);
            border-color:rgba(255,90,103,.36);
            box-shadow:0 0 10px rgba(255,90,103,.05);
          }

          /* V3.91 – eigenes Radius-Zahlenfeld. Ausschließlich Buttons, kein
             editierbares HTML-input: damit bleibt die iPad-OSK sicher geschlossen. */
          .radius-keypad-backdrop {
            position:fixed;
            inset:0;
            z-index:2147483647;
            display:none;
            align-items:center;
            justify-content:center;
            box-sizing:border-box;
            padding:18px;
            background:rgba(2,5,9,.70);
            backdrop-filter:blur(12px) saturate(.82);
            -webkit-backdrop-filter:blur(12px) saturate(.82);
            overscroll-behavior:contain;
          }
          .radius-keypad-backdrop.open {
            display:flex;
            animation:settingsBackdropIn .16s ease-out both;
          }
          .radius-keypad-dialog {
            --radius-accent:var(--b-gold);
            --radius-accent-rgb:246,195,68;
            width:min(350px,calc(100vw - 28px));
            box-sizing:border-box;
            padding:15px;
            border-radius:20px;
            border:1px solid rgba(var(--radius-accent-rgb),.42);
            background:
              radial-gradient(circle at 50% 0%,rgba(var(--radius-accent-rgb),.085),transparent 42%),
              linear-gradient(180deg,rgba(20,27,38,.995),rgba(7,11,17,.995));
            color:var(--b-text);
            box-shadow:0 28px 82px rgba(0,0,0,.70),0 0 28px rgba(var(--radius-accent-rgb),.07);
          }
          .radius-keypad-dialog.storm {
            --radius-accent:var(--b-blue);
            --radius-accent-rgb:79,163,247;
          }
          .radius-keypad-dialog.danger {
            --radius-accent:var(--b-danger);
            --radius-accent-rgb:255,90,103;
          }
          .radius-keypad-kicker {
            color:var(--radius-accent);
            font-size:7.7px;
            font-weight:900;
            letter-spacing:.16em;
            text-transform:uppercase;
            text-align:center;
          }
          .radius-keypad-title {
            margin-top:4px;
            color:#e7ebf1;
            font-size:15px;
            font-weight:850;
            text-align:center;
          }
          /* V3.94 – echte geometrische Zentrierung des Zahlenwerts.
             Wichtig: "KM" darf die Mittelachse der Zahl nicht beeinflussen.
             Deshalb besteht die zentrierte Gruppe nur aus der Zahl selbst;
             die Einheit ist absolut rechts an diese Zahl angehängt und nimmt
             keinerlei Platz in der Zentrierungsberechnung ein. */
          .radius-keypad-display {
            display:flex;
            align-items:center;
            justify-content:center;
            min-height:62px;
            margin:11px 0 4px;
            border:1px solid rgba(var(--radius-accent-rgb),.24);
            border-radius:14px;
            background:rgba(var(--radius-accent-rgb),.055);
            box-shadow:inset 0 0 18px rgba(var(--radius-accent-rgb),.035);
          }
          .radius-keypad-center {
            position:relative;
            display:inline-block;
            flex:0 0 auto;
            line-height:1;
          }
          .radius-keypad-number {
            display:block;
            color:var(--radius-accent);
            font-size:30px;
            line-height:1;
            font-weight:900;
            letter-spacing:-.035em;
            font-variant-numeric:tabular-nums;
            text-align:center;
          }
          .radius-keypad-unit {
            position:absolute;
            left:100%;
            bottom:2px;
            margin-left:6px;
            color:var(--radius-accent);
            opacity:.78;
            font-size:10px;
            line-height:1;
            font-weight:850;
            white-space:nowrap;
          }
          .radius-keypad-limit {
            min-height:13px;
            margin-bottom:9px;
            color:#7f8998;
            font-size:8px;
            line-height:1.25;
            text-align:center;
          }
          .radius-keypad-grid {
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:7px;
          }
          .radius-keypad-key {
            appearance:none;
            -webkit-appearance:none;
            min-height:48px;
            border:1px solid rgba(255,255,255,.105);
            border-radius:13px;
            background:linear-gradient(180deg,rgba(255,255,255,.065),rgba(255,255,255,.028));
            color:#edf1f6;
            font-family:inherit;
            font-size:20px;
            font-weight:820;
            cursor:pointer;
            touch-action:manipulation;
            -webkit-tap-highlight-color:transparent;
            box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 4px 12px rgba(0,0,0,.16);
            transition:transform .09s ease,border-color .14s ease,background .14s ease;
          }
          .radius-keypad-key:active {
            transform:scale(.95);
            border-color:rgba(var(--radius-accent-rgb),.46);
            background:rgba(var(--radius-accent-rgb),.11);
          }
          .radius-keypad-key.utility {
            color:#aeb7c4;
            font-size:9px;
            font-weight:850;
            letter-spacing:.035em;
            text-transform:uppercase;
          }
          #card-root.ipad-device ~ .radius-keypad-backdrop .radius-keypad-key[data-radius-key="backspace"] {
            font-size:22px;
            line-height:1;
            font-weight:760;
            letter-spacing:0;
            text-transform:none;
          }
          .radius-keypad-actions {
            display:grid;
            grid-template-columns:1fr 1.25fr;
            gap:8px;
            margin-top:10px;
          }
          .radius-keypad-action {
            appearance:none;
            -webkit-appearance:none;
            min-height:40px;
            border-radius:12px;
            border:1px solid rgba(255,255,255,.105);
            background:rgba(255,255,255,.035);
            color:#aeb7c4;
            font-family:inherit;
            font-size:9px;
            font-weight:880;
            letter-spacing:.055em;
            text-transform:uppercase;
            cursor:pointer;
            touch-action:manipulation;
          }
          .radius-keypad-action.apply {
            color:var(--radius-accent);
            border-color:rgba(var(--radius-accent-rgb),.42);
            background:rgba(var(--radius-accent-rgb),.095);
            box-shadow:0 0 14px rgba(var(--radius-accent-rgb),.06);
          }
          .radius-keypad-action:active { transform:scale(.97); }

          /* V4.09.14 – iPad/Tablet: nur moderat kompakter als bisher. */
          @media (min-width:721px) and (max-width:1366px) {
            #card-root.ipad-device .map-display-menu { width:140px;min-width:140px;max-width:140px; }
            #card-root.ipad-device .map-display-menu-title { font-size:9.25px; }
            #card-root.ipad-device .map-display-btn { min-height:39px;font-size:10.75px; }
          }

          @media (max-width:720px) {
            .radius-keypad-backdrop { padding:12px; }
            .radius-keypad-dialog { width:min(340px,calc(100vw - 20px));padding:13px; }
            .radius-keypad-key { min-height:46px; }
          }

          .settings-radius-tools {
            display:flex;
            align-items:center;
            justify-content:flex-end;
            gap:6px;
            flex:0 0 auto;
          }
          .settings-radius-step {
            appearance:none;
            width:28px;
            height:28px;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            flex:0 0 auto;
            padding:0;
            border-radius:9px;
            border:1px solid rgba(255,255,255,.11);
            background:rgba(255,255,255,.035);
            color:#aeb7c3;
            font:850 16px/1 inherit;
            cursor:pointer;
            transition:.16s ease;

            /* V3.523 – iPadOS/Safari: schnelles wiederholtes Tippen auf +/- darf
               nicht als Doppeltipp-Zoom der Seite interpretiert werden. */
            touch-action:manipulation;
            -webkit-user-select:none;
            user-select:none;
            -webkit-touch-callout:none;
          }
          .settings-radius-step:hover {
            background:rgba(255,255,255,.065);
            transform:translateY(-1px);
          }
          .settings-radius-step:active {
            transform:scale(.95);
          }
          .settings-radius-step:disabled {
            opacity:.28;
            cursor:not-allowed;
            transform:none;
          }
          .settings-radius.observation .settings-radius-step {
            color:var(--b-gold);
            border-color:rgba(246,195,68,.25);
          }
          .settings-radius.storm .settings-radius-step {
            color:var(--b-blue);
            border-color:rgba(79,163,247,.28);
          }
          .settings-radius.danger .settings-radius-step {
            color:var(--b-danger);
            border-color:rgba(255,90,103,.30);
          }
          .settings-radius.observation .settings-radius-value { color:var(--b-gold); }
          .settings-radius.storm .settings-radius-value { color:var(--b-blue); }
          .settings-radius.danger .settings-radius-value { color:var(--b-danger); }

          .settings-radius-slider {
            width:100%;
            margin:0;
            cursor:pointer;
            touch-action:pan-x;
          }
          #settings-observation-slider { accent-color:var(--b-gold); }
          #settings-storm-slider { accent-color:var(--b-blue); }
          #settings-danger-slider { accent-color:var(--b-danger); }

          .settings-test-grid {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:7px;
            padding:8px;
          }
          .settings-test-button {
            min-height:36px;
            font-size:7.8px;
          }

          /* V3.520 – eindeutige Eskalationsfarben auch im Popup */
          .settings-test-button.storm-test {
            color:#dff1ff;
            border-color:rgba(79,163,247,.58);
            background:
              linear-gradient(180deg,rgba(79,163,247,.19),rgba(79,163,247,.075));
            box-shadow:
              inset 0 0 16px rgba(79,163,247,.035),
              0 5px 16px rgba(0,0,0,.18);
          }
          .settings-test-button:not(.storm-test) {
            color:#ffe0e3;
            border-color:rgba(255,90,103,.58);
            background:
              linear-gradient(180deg,rgba(255,90,103,.18),rgba(255,39,61,.075));
          }

          /* Sichtbare Abklingzeit:
             - der ausgelöste Button bleibt farblich präsent und bekommt Glow
             - alle Testbuttons sind während des echten 4s-Cooldowns gesperrt
             - nach Ablauf werden sie automatisch wieder normal verfügbar */
          [data-warning-test].cooldown {
            cursor:not-allowed;
            opacity:.52;
            filter:saturate(.72);
            transform:none !important;
          }
          [data-warning-test].cooldown-fired {
            opacity:.92;
            filter:saturate(1);
          }
          [data-warning-test="storm"].cooldown-fired {
            color:#eef8ff !important;
            border-color:rgba(110,196,255,.92) !important;
            background:
              linear-gradient(180deg,rgba(79,163,247,.31),rgba(79,163,247,.12)) !important;
            box-shadow:
              inset 0 0 19px rgba(79,163,247,.09),
              0 0 16px rgba(79,163,247,.22) !important;
          }
          [data-warning-test="danger"].cooldown-fired {
            color:#fff0f2 !important;
            border-color:rgba(255,105,117,.92) !important;
            background:
              linear-gradient(180deg,rgba(255,90,103,.30),rgba(255,39,61,.12)) !important;
            box-shadow:
              inset 0 0 19px rgba(255,47,68,.09),
              0 0 16px rgba(255,47,68,.22) !important;
          }
          [data-warning-test].cooldown-fired .bolt {
            animation:testCooldownPulse .82s ease-in-out infinite alternate;
          }
          @keyframes testCooldownPulse {
            from { transform:scale(.94);opacity:.72; }
            to { transform:scale(1.08);opacity:1; }
          }

          .settings-radius-note {
            display:inline;
            margin-left:6px;
            color:#687383;
            font-size:7.1px;
            font-weight:650;
            letter-spacing:.015em;
            text-transform:none;
            white-space:nowrap;
          }
          .settings-radius.observation .settings-radius-note { color:rgba(246,195,68,.58); }
          .settings-radius.storm .settings-radius-note { color:rgba(120,190,255,.68); }
          .settings-radius.danger .settings-radius-note { color:rgba(255,125,136,.70); }

          @media (max-width:720px) {
            .settings-backdrop {
              align-items:center;
              justify-content:center;
              padding:7px;
            }
            .settings-dialog {
              width:100%;
              max-height:calc(100dvh - 14px);
              border-radius:20px;
            }
            .settings-dialog-head { padding:11px 13px 9px; }
            .settings-body { padding:7px 9px 9px;gap:7px; }
            .settings-section-head { padding:7px 10px 6px; }
            .settings-row { min-height:40px;padding:5px 10px; }
            .settings-radius-list { padding:7px;gap:5px; }
            .settings-radius { padding:6px 9px 7px; }
            .settings-test-grid { grid-template-columns:1fr 1fr;padding:7px;gap:6px; }
            .settings-test-button { min-height:34px;font-size:7.4px; }
          }

          /* Besonders niedrige Viewports werden noch etwas verdichtet. Ziel:
             Popup vollständig sichtbar, ohne interne Scrollfläche. */
          @media (max-height:720px) {
            .settings-dialog-head { padding:9px 12px 7px; }
            .settings-kicker { font-size:7px; }
            .settings-title { font-size:15px; }
            .settings-close { width:30px;height:30px;font-size:18px; }
            .settings-body { padding:6px 8px 7px;gap:6px; }
            .settings-section-head { padding:6px 9px 5px; }
            .settings-section-sub { display:none; }
            .settings-row { min-height:36px;padding:4px 9px; }
            .settings-row-label { font-size:9px; }
            .settings-row-note { font-size:6.7px; }
            .settings-radius-list { padding:6px;gap:4px; }
            .settings-radius { padding:5px 8px 6px; }
            .settings-radius-head { margin-bottom:3px; }
            .settings-radius-step { width:26px;height:26px; }
            .settings-test-grid { padding:6px;gap:5px; }
            .settings-test-button { min-height:31px; }
          }

          /* V3.522 – standardmäßig bleibt die Hauptansicht aufgeräumt.
             Der neue Popup-Schalter kann die vorhandenen Regler wieder einblenden. */
          #card-root .radius-grid {
            display:none !important;
          }
          #card-root.radii-visible .radius-grid {
            display:grid !important;
            margin-bottom:12px;
          }

          /* V3.973 – own language dropdown. Native <select>/<option> rendering is
             deliberately avoided so the active gold marker and dotted separator are
             identical on Desktop, iPad/iPadOS and Android. */
          .settings-language-button {
            appearance:none;
            -webkit-appearance:none;
            min-width:166px;
            min-height:34px;
            display:inline-flex;
            align-items:center;
            justify-content:space-between;
            gap:9px;
            padding:0 11px;
            border:1px solid transparent;
            border-radius:11px;
            background:transparent;
            color:#dce4ef;
            font-family:inherit;
            font-size:10px;
            font-weight:800;
            cursor:pointer;
            touch-action:manipulation;
            box-shadow:none;
          }
          .settings-language-button:hover { border-color:transparent;background:rgba(246,195,68,.045); }
          #settings-about { min-height:44px;width:100%;justify-content:flex-start;gap:10px;white-space:normal;touch-action:manipulation; }
          .settings-language-button:disabled { opacity:.45;cursor:not-allowed; }

          /* V3.99711 – Entfernungseinheit als eigener Segment-Schalter.
             Kein nativer Select; die abgenommene mobile/iPad-Settings-Architektur
             und insbesondere die V3.99706-Backdrop-Scrolllogik bleiben erhalten. */
          .settings-distance-unit-control {
            min-width:166px;
            min-height:34px;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            overflow:hidden;
            border:1px solid rgba(246,195,68,.18);
            border-radius:11px;
            background:rgba(255,255,255,.018);
          }
          .settings-distance-unit-option {
            appearance:none;
            -webkit-appearance:none;
            flex:1 1 50%;
            min-height:32px;
            padding:0 14px;
            border:0;
            border-right:1px solid rgba(246,195,68,.11);
            background:transparent;
            color:#8e98a6;
            font-family:inherit;
            font-size:10px;
            font-weight:800;
            line-height:1;
            letter-spacing:.06em;
            cursor:pointer;
            touch-action:manipulation;
          }
          .settings-distance-unit-option:last-child { border-right:0; }
          .settings-distance-unit-option.active {
            color:var(--b-gold);
            background:rgba(246,195,68,.09);
            box-shadow:inset 0 0 14px rgba(246,195,68,.055);
          }
          .settings-distance-unit-option:disabled { opacity:.42;cursor:not-allowed; }
          @media (max-width:720px) {
            .settings-distance-unit-control { min-width:154px;min-height:36px; }
            .settings-distance-unit-option { min-height:34px;font-size:10.5px; }
          }
          .settings-language-current { display:inline-flex;align-items:center;gap:7px;min-width:0; }
          .settings-language-current-dot {
            width:6px;height:6px;flex:0 0 6px;border-radius:50%;
            background:var(--b-gold);box-shadow:0 0 8px rgba(246,195,68,.72);
          }
          .settings-language-chevron { color:#9c8650;font-size:11px;line-height:1; }

          .language-dropdown {
            position:fixed;
            z-index:2147483647;
            display:none;
            box-sizing:border-box;
            min-width:220px;
            max-width:min(320px,calc(100vw - 20px));
            max-height:min(520px,calc(100dvh - 20px));
            overflow:auto;
            padding:6px;
            border:1px solid rgba(246,195,68,.30);
            border-radius:14px;
            background:linear-gradient(180deg,rgba(20,27,38,.995),rgba(7,11,17,.995));
            box-shadow:0 24px 64px rgba(0,0,0,.68),0 0 24px rgba(246,195,68,.055);
            backdrop-filter:blur(14px);
            -webkit-backdrop-filter:blur(14px);
          }
          .language-dropdown.open { display:block;animation:settingsBackdropIn .14s ease-out both; }
          .language-option {
            appearance:none;
            -webkit-appearance:none;
            width:100%;
            min-height:36px;
            display:grid;
            grid-template-columns:16px minmax(0,1fr);
            align-items:center;
            gap:7px;
            padding:0 10px;
            border:0;
            border-radius:9px;
            background:transparent;
            color:#c8d0db;
            font-family:inherit;
            font-size:11px;
            font-weight:760;
            text-align:left;
            cursor:pointer;
            touch-action:manipulation;
          }
          .language-option:hover,
          .language-option:focus-visible { outline:none;background:rgba(255,255,255,.055);color:#f0f3f7; }
          .language-option .language-option-dot {
            width:6px;height:6px;border-radius:50%;justify-self:center;
            border:1px solid rgba(160,170,182,.25);background:transparent;
          }
          .language-option.selected { color:#ffe7a0;background:rgba(246,195,68,.07); }
          .language-option.selected .language-option-dot {
            border-color:var(--b-gold);background:var(--b-gold);box-shadow:0 0 8px rgba(246,195,68,.78);
          }
          .language-fun-separator {
            position:relative;
            height:19px;
            margin:2px 6px;
            pointer-events:none;
          }
          .language-fun-separator::before {
            content:'';
            position:absolute;
            left:5px;right:5px;top:9px;
            height:1px;
            background:linear-gradient(to right,
              rgba(246,195,68,.12) 0%,
              rgba(246,195,68,.48) calc(50% - 10px),
              transparent calc(50% - 10px),
              transparent calc(50% + 10px),
              rgba(246,195,68,.48) calc(50% + 10px),
              rgba(246,195,68,.12) 100%);
          }
          .language-fun-separator::after {
            content:'◇';
            position:absolute;
            left:50%;top:50%;
            transform:translate(-50%,-53%);
            color:rgba(246,195,68,.72);
            font-size:10px;
            line-height:1;
            text-shadow:0 0 8px rgba(246,195,68,.16);
          }
          @media (max-width:720px) {
            /* V3.997 – Mobile behält große Touch-Ziele, aber nicht die historisch
               übergroße 16-px-Typografie der eigenen Dropdowns. */
            .settings-language-button { min-height:36px;font-size:11px;min-width:154px; }
            .language-dropdown { width:190px;min-width:0;max-width:calc(100vw - 16px);max-height:calc(100dvh - 16px); }
            .language-option { min-height:34px;font-size:11px; }
          }

          /* V3.99312 – Bezugsstandort verwendet denselben stabilen eigenen
             Dropdown-Ansatz wie die final bestätigte Sprachauswahl. Kein natives
             <select>/<option> mehr im Einstellungsdialog: dadurch kein Picker-
             Flapping und auf allen Plattformen dieselbe dunkle Premium-Optik. */
          .settings-location-button {
            appearance:none;
            -webkit-appearance:none;
            min-width:166px;
            min-height:34px;
            display:inline-flex;
            align-items:center;
            justify-content:space-between;
            gap:9px;
            padding:0 11px;
            border:1px solid transparent;
            border-radius:11px;
            background:transparent;
            color:#dce8f6;
            font-family:inherit;
            font-size:10px;
            font-weight:800;
            cursor:pointer;
            touch-action:manipulation;
            box-shadow:none;
          }
          .settings-location-button:hover {
            border-color:transparent;
            background:rgba(79,163,247,.045);
          }
          .settings-location-button:disabled { opacity:.45;cursor:not-allowed; }
          .settings-location-current { display:inline-flex;align-items:center;gap:7px;min-width:0; }
          .settings-location-current-dot {
            width:6px;height:6px;flex:0 0 6px;border-radius:50%;
            background:var(--b-blue);box-shadow:0 0 8px rgba(79,163,247,.74);
          }
          .settings-location-chevron { color:#6f9fcf;font-size:11px;line-height:1; }

          .location-dropdown {
            position:fixed;
            z-index:2147483647;
            display:none;
            box-sizing:border-box;
            min-width:220px;
            max-width:min(320px,calc(100vw - 20px));
            max-height:min(420px,calc(100dvh - 20px));
            overflow:auto;
            padding:6px;
            border:1px solid rgba(79,163,247,.32);
            border-radius:14px;
            background:linear-gradient(180deg,rgba(20,27,38,.995),rgba(7,11,17,.995));
            box-shadow:0 24px 64px rgba(0,0,0,.68),0 0 24px rgba(79,163,247,.06);
            backdrop-filter:blur(14px);
            -webkit-backdrop-filter:blur(14px);
            scrollbar-width:thin;
          }
          .location-dropdown.open { display:block;animation:settingsBackdropIn .14s ease-out both; }
          /* V4.07 TEST CANDIDATE – worldwide reference-location search. */
          .location-section-label {
            padding:8px 12px 5px;color:#7f9ab5;font-size:9px;font-weight:800;
            letter-spacing:.12em;text-transform:uppercase;pointer-events:none;
          }
          .location-section-empty { padding:7px 12px 10px;color:#60758b;font-size:10px; }
          .location-section-divider { height:1px;margin:5px 9px;background:linear-gradient(90deg,transparent,rgba(79,163,247,.22),transparent); }
          .location-search-action {
            appearance:none;-webkit-appearance:none;width:100%;min-height:38px;border:0;background:transparent;
            color:#d9ecff;display:flex;align-items:center;gap:9px;padding:7px 12px;text-align:left;
            font:650 11px/1.2 inherit;cursor:pointer;
          }
          .location-search-action:hover,.location-search-action:focus-visible { outline:none;background:rgba(79,163,247,.09); }
          .location-search-action .location-search-icon { font-size:14px;line-height:1; }
          .v407-location-search-backdrop {
            position:fixed;inset:0;z-index:2147483647;display:none;place-items:center;padding:16px;
            box-sizing:border-box;background:rgba(2,7,14,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
          }
          .v407-location-search-backdrop.open { display:grid; }
          .v407-location-search-dialog {
            width:min(560px,calc(100vw - 24px));max-height:min(760px,calc(100dvh - 24px));overflow:auto;
            box-sizing:border-box;border:1px solid rgba(111,163,214,.24);border-radius:16px;
            background:linear-gradient(180deg,rgba(18,28,40,.985),rgba(8,14,23,.995));
            box-shadow:0 28px 90px rgba(0,0,0,.72),0 0 34px rgba(79,163,247,.08);color:#e8f2fb;
          }
          .v407-location-search-head { display:flex;align-items:center;justify-content:space-between;gap:16px;padding:15px 16px 11px;border-bottom:1px solid rgba(111,163,214,.14); }
          .v407-location-search-head strong { font-size:14px;letter-spacing:.01em; }
          .v407-location-search-close { appearance:none;border:0;background:transparent;color:#9fb8ce;font-size:24px;line-height:1;cursor:pointer;padding:2px 5px; }
          .v407-location-search-body { padding:14px 16px 16px; }
          /* V4.07.36 – approved premium two-mode location dialog. */
          .v407-location-search-dialog { position:relative;width:min(760px,calc(100vw - 24px));border-color:transparent;border-radius:18px;background:radial-gradient(circle at 12% 0,rgba(31,64,88,.26),transparent 38%),linear-gradient(180deg,rgba(11,24,35,.992),rgba(5,14,22,.997));box-shadow:0 30px 95px rgba(0,0,0,.76),0 0 42px rgba(67,157,231,.08),inset 0 1px 0 rgba(255,255,255,.025); }
          .v407-location-search-dialog:before { content:'';position:absolute;inset:0;border-radius:inherit;padding:1.6px;background:linear-gradient(145deg,#d4aa69 0%,#76502e 15%,#f3dcb0 29%,#76532f 43%,#bc9057 57%,#fce2b6 73%,#725031 87%,#c79b62 100%);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;z-index:3;filter:drop-shadow(0 0 2px #cda25855); }
          .v407-location-search-head { position:relative;display:grid;grid-template-columns:92px minmax(0,1fr);align-items:center;gap:16px;padding:18px 64px 15px 18px;border-bottom:1px solid rgba(100,145,180,.20); }
          .v407-location-search-emblem { width:90px;height:90px;border:none;border-radius:50%;position:relative;box-sizing:border-box;display:grid;place-items:center;background:none;box-shadow:0 10px 22px rgba(0,0,0,.52); }
          .v407-location-search-emblem img { width:90px;height:90px;display:block;object-fit:contain;filter:drop-shadow(0 3px 6px rgba(0,0,0,.50)); }
          
          .v407-location-search-head-copy { position:relative;z-index:1;min-width:0; }
          .v407-location-search-head-copy strong { display:block;color:#f1f4f7;font-size:18px;line-height:1.12;font-weight:760;letter-spacing:.005em;text-shadow:0 1px 2px rgba(0,0,0,.65); }
          .v407-location-search-subtitle { margin-top:4px;color:#a7b7c9;font-size:11px;line-height:1.35; }
          .v407-location-search-close { position:absolute!important;z-index:60;top:10px;right:10px;width:44px;height:44px;display:grid;place-items:center;padding:0!important;margin:0!important;border:0!important;border-radius:8px;background:transparent!important;overflow:visible; }
          .v407-location-search-close img { width:36px;height:36px;display:block;object-fit:contain;filter:drop-shadow(0 3px 5px rgba(0,0,0,.55)); }
          .v407-location-search-close:hover,.v407-location-search-close:focus-visible { outline:none;filter:brightness(1.08); }
          .v407-location-search-body { position:relative;z-index:1;padding:14px 18px 17px; }
          .v407-location-mode-switch { display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:0 0 15px;padding:6px;border:1px solid transparent;border-radius:16px;background:linear-gradient(180deg,rgba(9,24,36,.90),rgba(3,11,18,.92)) padding-box,linear-gradient(120deg,rgba(117,82,28,.74),rgba(234,197,109,.66) 22%,rgba(90,148,196,.45) 52%,rgba(220,178,92,.57) 80%,rgba(96,67,21,.70)) border-box;box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 8px 22px rgba(0,0,0,.24),0 0 14px rgba(207,160,69,.07); }
          .v407-location-mode { appearance:none;-webkit-appearance:none;min-height:46px;border:1px solid transparent;border-radius:10px;background:transparent;color:#d7e0e8;display:flex;align-items:center;justify-content:center;gap:10px;padding:8px 12px;font:760 12px/1.1 inherit;cursor:pointer;transition:border-color .15s ease,background .15s ease,color .15s ease,box-shadow .15s ease,filter .15s ease; }
          .v407-location-mode[aria-pressed="true"] { border-color:#4ba8f3;background:linear-gradient(180deg,rgba(30,86,132,.46),rgba(16,52,82,.40));color:#f2f7fb;box-shadow:0 0 0 1px rgba(75,168,243,.20),0 0 14px rgba(51,146,222,.22),inset 0 1px 0 rgba(255,255,255,.06); }
          .v407-location-mode:hover,.v407-location-mode:focus-visible { outline:none;border-color:rgba(75,168,243,.65);color:#f3f8fc; }
          .v407-location-mode-icon { width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;position:relative; }
          .v407-location-mode-search-icon img { width:37px;height:37px;display:block;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,.60)); }
          
          .v407-location-mode-target img { width:37px;height:37px;display:block;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,.60)) saturate(1.04);transform:scale(1.25);transform-origin:center; }
          .v407-location-coordinate-form[hidden],#v407-location-address-form[hidden]{display:none!important;}
          #v407-location-address-form,.v407-location-coordinate-form { position:relative;padding:13px;border:1px solid transparent;border-radius:14px;background:linear-gradient(180deg,rgba(6,18,29,.82),rgba(3,10,17,.90)) padding-box,linear-gradient(120deg,rgba(117,82,28,.72),rgba(234,197,109,.62) 24%,rgba(88,146,194,.40) 52%,rgba(220,178,92,.54) 79%,rgba(92,64,20,.66)) border-box;box-shadow:inset 0 1px 0 rgba(255,255,255,.03),inset 0 0 18px rgba(40,83,112,.055),0 8px 22px rgba(0,0,0,.20),0 0 10px rgba(207,160,69,.045); }
          #v407-location-address-form::before,.v407-location-coordinate-form::before { content:'';position:absolute;inset:3px;border:1px solid rgba(238,207,138,.085);border-radius:11px;pointer-events:none; }
          #v407-location-address-form > *,.v407-location-coordinate-form > * { position:relative;z-index:1; }
          .v407-location-coordinate-grid { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto auto;gap:9px;align-items:end; }
          .v407-location-coordinate-name { grid-column:1/-1; }
          .v407-location-coordinate-hint { margin:8px 0 0;color:#7e93a7;font-size:9px;line-height:1.4; }
          .v407-location-search-field label { color:#b2c2d4!important;font-size:9.5px!important;letter-spacing:.08em!important; }
          .v407-location-search-field input { min-height:42px!important;border-color:rgba(90,132,168,.40)!important;border-radius:9px!important;background:linear-gradient(180deg,rgba(5,15,24,.94),rgba(3,10,17,.94))!important;box-shadow:inset 0 1px 6px rgba(0,0,0,.38)!important; }
          .v407-location-search-field input:focus { border-color:rgba(75,168,243,.78)!important;box-shadow:0 0 0 2px rgba(75,168,243,.10),inset 0 1px 6px rgba(0,0,0,.36)!important; }
          .v407-location-search-submit { min-height:42px!important;border-color:rgba(70,153,224,.70)!important;background:linear-gradient(180deg,rgba(31,91,145,.74),rgba(20,62,101,.80))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 3px 10px rgba(0,0,0,.28);font-size:11.5px!important; }
          .v407-location-coordinate-save { border-color:rgba(211,164,74,.72)!important;background:linear-gradient(180deg,rgba(132,95,29,.78),rgba(73,47,13,.88))!important;color:#f5d98c!important;text-shadow:0 1px 0 rgba(0,0,0,.66);box-shadow:inset 0 1px 0 rgba(255,239,189,.12),0 3px 10px rgba(0,0,0,.30),0 0 8px rgba(208,157,60,.08)!important; }
          .v407-location-coordinate-save:hover,.v407-location-coordinate-save:focus-visible { outline:none;filter:brightness(1.08);border-color:rgba(235,191,96,.86)!important; }
          .v407-location-search-divider { height:1px;margin:14px 0 12px;background:linear-gradient(90deg,transparent,rgba(108,149,181,.26),transparent); }
          .v407-location-search-dialog .v407-location-safety-note { display:grid;grid-template-columns:38px minmax(0,1fr);align-items:center;gap:10px;margin-top:0;padding:10px 12px;border:1px solid transparent;border-radius:12px;background:linear-gradient(120deg,rgba(16,38,54,.62),rgba(6,18,28,.70)) padding-box,linear-gradient(120deg,rgba(92,138,172,.42),rgba(232,196,110,.18) 28%,rgba(83,142,190,.28) 58%,rgba(216,173,83,.28) 80%,rgba(62,89,111,.34)) border-box;color:#c8d2dc;font-size:9.7px;line-height:1.42;box-shadow:inset 0 1px 0 rgba(255,255,255,.03),0 5px 16px rgba(0,0,0,.16); }
          .v407-location-safety-medallion,.v407-location-advice-medallion { width:38px;height:38px;display:grid;place-items:center; }
          .v407-location-safety-medallion img { width:38px;height:38px;display:block;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,.50)); }
          .v407-location-advice-medallion img { width:34px;height:34px;display:block;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,.48)); }
          .v407-location-advice { display:grid;grid-template-columns:38px minmax(0,1fr);align-items:start;gap:10px;margin-top:11px;padding:11px 12px;border:1px solid transparent;border-radius:12px;background:linear-gradient(120deg,rgba(43,32,17,.36),rgba(7,15,20,.74)) padding-box,linear-gradient(120deg,rgba(112,79,28,.60),rgba(224,185,101,.44) 23%,rgba(83,142,190,.14) 52%,rgba(213,169,78,.36) 80%,rgba(89,62,20,.54)) border-box;color:#cdd4db;box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 5px 16px rgba(0,0,0,.16); }
          .v407-location-advice-medallion { font:800 17px/1 Georgia,serif; }
          .v407-location-advice-copy strong { display:block;margin:1px 0 4px;color:#f0cd78;font-size:11.3px; }
          .v407-location-advice-copy p { margin:0;color:#c3cbd3;font-size:9.8px;line-height:1.45; }
          .v407-location-advice-copy a { color:#71baf0;font-weight:700;text-decoration:none;border-bottom:1px solid rgba(113,186,240,.40); }
          .v407-location-advice-copy a:hover,.v407-location-advice-copy a:focus-visible { outline:none;color:#a8d8fa;border-bottom-color:#a8d8fa; }
          .v407-location-search-dialog .v407-location-provider-note { margin-top:5px;color:#63788b;font-size:8.2px;line-height:1.35; }
          .v407-location-search-grid { display:grid;grid-template-columns:minmax(0,1fr) minmax(170px,.55fr) auto;gap:9px;align-items:end; }
          .v407-location-search-field { position:relative;display:grid;gap:5px; }
          .v407-location-search-field label { color:#8aa6bf;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase; }
          .v407-location-search-field input {
            width:100%;box-sizing:border-box;min-height:38px;border:1px solid rgba(116,160,199,.24);border-radius:9px;
            background:rgba(5,12,20,.78);color:#edf7ff;padding:8px 10px;font:500 12px/1.2 inherit;outline:none;
          }
          .v407-location-search-field input:focus { border-color:rgba(79,163,247,.62);box-shadow:0 0 0 2px rgba(79,163,247,.10); }
          #v407-location-query,#v407-location-country,#v407-coordinate-name,#v407-coordinate-latitude,#v407-coordinate-longitude { padding-right:40px;-webkit-appearance:none;appearance:none;position:relative;z-index:1; }
          #v407-location-query::-webkit-search-cancel-button,#v407-location-country::-webkit-search-cancel-button { -webkit-appearance:none;appearance:none; }
          .v407-location-query-clear,.v407-location-country-clear,.v407-coordinate-name-clear,.v407-coordinate-latitude-clear,.v407-coordinate-longitude-clear {
            appearance:none;-webkit-appearance:none;position:absolute;right:4px;bottom:4px;z-index:4;touch-action:manipulation;-webkit-tap-highlight-color:transparent;
            width:30px;height:30px;display:grid;place-items:center;border:0;border-radius:7px;background:transparent;
            color:#9fb8ce;font:700 18px/1 inherit;cursor:pointer;padding:0;opacity:0;visibility:hidden;pointer-events:none;
            transform:scale(.96);transition:background .15s ease,color .15s ease,opacity .15s ease,transform .15s ease;
          }
          .v407-location-query-clear.is-visible,.v407-location-country-clear.is-visible,.v407-coordinate-name-clear.is-visible,.v407-coordinate-latitude-clear.is-visible,.v407-coordinate-longitude-clear.is-visible,
          #v407-location-query:not(:placeholder-shown) + .v407-location-query-clear,
          #v407-coordinate-name:not(:placeholder-shown) + .v407-coordinate-name-clear,
          #v407-coordinate-latitude:not(:placeholder-shown) + .v407-coordinate-latitude-clear,
          #v407-coordinate-longitude:not(:placeholder-shown) + .v407-coordinate-longitude-clear { opacity:1;visibility:visible;pointer-events:auto;transform:none; }
          .v407-location-query-clear:hover,.v407-location-query-clear:focus-visible,.v407-location-country-clear:hover,.v407-location-country-clear:focus-visible,.v407-coordinate-name-clear:hover,.v407-coordinate-name-clear:focus-visible,.v407-coordinate-latitude-clear:hover,.v407-coordinate-latitude-clear:focus-visible,.v407-coordinate-longitude-clear:hover,.v407-coordinate-longitude-clear:focus-visible { outline:none;background:rgba(79,163,247,.10);color:#e7f4ff; }
          .v407-location-search-submit {
            min-height:38px;border:1px solid rgba(79,163,247,.42);border-radius:9px;background:rgba(34,105,168,.26);
            color:#e7f4ff;padding:8px 13px;font:750 11px/1 inherit;cursor:pointer;
          }
          .v407-location-search-submit:disabled { opacity:.48;cursor:wait; }
          .v407-country-suggestions {
            position:absolute;left:0;right:0;top:100%;z-index:3;display:none;max-height:220px;overflow:auto;
            margin-top:4px;border:1px solid rgba(116,160,199,.24);border-radius:9px;background:#0b1521;box-shadow:0 16px 42px rgba(0,0,0,.55);
          }
          .v407-country-suggestions.open { display:block; }
          .v407-country-suggestion { width:100%;border:0;background:transparent;color:#dbeaf7;text-align:left;padding:8px 10px;font:500 11px/1.2 inherit;cursor:pointer; }
          .v407-country-suggestion:hover,.v407-country-suggestion:focus-visible { outline:none;background:rgba(79,163,247,.10); }
          .v407-location-search-status { min-height:20px;margin:10px 0 2px;color:#9ab3c8;font-size:10px;line-height:1.45; }
          .v407-location-search-status.error { color:#ffb2ab; }
          .v407-location-results { display:grid;gap:8px;margin-top:10px; }
          .v407-country-filterbar { display:flex;gap:6px;overflow-x:auto;overscroll-behavior-inline:contain;padding:2px 0 9px;scrollbar-width:thin; }
          .v407-country-filter { flex:0 0 auto;appearance:none;-webkit-appearance:none;min-height:30px;border:1px solid rgba(111,163,214,.18);border-radius:999px;background:rgba(255,255,255,.025);color:#adc2d5;padding:5px 9px;font:700 9px/1 inherit;cursor:pointer;white-space:nowrap; }
          .v407-country-filter:hover,.v407-country-filter:focus-visible { outline:none;border-color:rgba(79,163,247,.42);background:rgba(79,163,247,.08);color:#e2f2ff; }
          .v407-country-filter.active { border-color:rgba(79,163,247,.55);background:rgba(34,105,168,.24);color:#eef8ff;box-shadow:0 0 0 1px rgba(79,163,247,.07) inset; }
          .v407-country-summary { margin:0 0 8px;color:#7f98ad;font-size:9px;line-height:1.35; }
          .v407-country-group { border:1px solid rgba(111,163,214,.14);border-radius:11px;background:rgba(255,255,255,.018);overflow:hidden; }
          .v407-country-group + .v407-country-group { margin-top:8px; }
          .v407-country-group > summary { list-style:none;display:flex;align-items:center;gap:8px;min-height:37px;padding:7px 10px;box-sizing:border-box;cursor:pointer;color:#dceaf6;font:750 10px/1.2 inherit;background:rgba(255,255,255,.018); }
          .v407-country-group > summary::-webkit-details-marker { display:none; }
          .v407-country-group > summary::after { content:'›';margin-left:auto;color:#718ba2;font-size:16px;line-height:1;transform:rotate(0deg);transition:transform .14s ease; }
          .v407-country-group[open] > summary::after { transform:rotate(90deg); }
          .v407-country-flag { font-size:15px;line-height:1; }
          .v407-country-name { min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
          .v407-country-count { color:#6f879c;font-weight:650; }
          .v407-country-home { margin-left:3px;padding:2px 5px;border-radius:999px;background:rgba(246,195,68,.08);color:#c9aa59;font-size:8px;font-weight:750; }
          .v407-country-rows { display:grid;gap:7px;padding:0 8px 8px; }
          .v407-country-more { appearance:none;-webkit-appearance:none;width:100%;min-height:31px;border:1px dashed rgba(111,163,214,.18);border-radius:8px;background:transparent;color:#8ba6bd;font:700 9px/1 inherit;cursor:pointer; }
          .v407-country-more:hover,.v407-country-more:focus-visible { outline:none;border-color:rgba(79,163,247,.36);color:#d9edff;background:rgba(79,163,247,.05); }

          .v407-location-result { display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;padding:10px 11px;border:1px solid rgba(111,163,214,.16);border-radius:11px;background:rgba(255,255,255,.025); }
          .v407-location-result-title { font-size:12px;font-weight:750;color:#edf7ff; }
          .v407-location-result-meta { margin-top:3px;color:#8199ae;font-size:9px;line-height:1.35; }
          .v407-location-result-actions { display:flex;align-items:center;gap:6px; }
          .v407-location-result-use,.v407-location-result-save { min-height:32px;border-radius:8px;padding:6px 9px;font:750 10px/1 inherit; }
          .v407-location-result-use { border:1px solid rgba(79,163,247,.42);background:rgba(34,105,168,.24);color:#e8f5ff;cursor:pointer; }
          .v407-location-result-save { border:1px solid rgba(246,195,68,.34);background:rgba(246,195,68,.08);color:#f1cf68;cursor:pointer; }
          .v407-location-result-save:disabled { opacity:.55;cursor:default; }
          .location-saved-option { appearance:none;-webkit-appearance:none;width:100%;min-height:36px;border:0;background:transparent;color:#dceaf6;display:flex;align-items:center;gap:9px;padding:7px 12px;text-align:left;font:650 11px/1.2 inherit;cursor:pointer;border-radius:8px; }
          .location-saved-option:hover,.location-saved-option:focus-visible { outline:none;background:rgba(246,195,68,.075); }
          .location-saved-star { color:#f6c344;font-size:13px;line-height:1;font-weight:800;text-shadow:0 -1px 0 rgba(255,240,177,.18),0 1px 0 rgba(65,40,5,.9),0 1px 2px rgba(0,0,0,.42);filter:drop-shadow(0 0 1px rgba(229,174,52,.18)); }
          .location-saved-target { width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 18px;filter:drop-shadow(0 1px 1px rgba(0,0,0,.62)) contrast(1.05) saturate(1.08); }
          .location-saved-target img { display:block;width:18px;height:18px;object-fit:contain; }
          .location-saved-copy { min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
          .location-saved-row { display:grid;grid-template-columns:minmax(0,1fr) 32px;align-items:center;gap:2px;margin:0 4px;border-radius:8px; }
          .location-saved-row:hover { background:rgba(246,195,68,.045); }
          .location-saved-row .location-saved-option { padding-left:8px;padding-right:6px; }
          .location-saved-remove,.location-saved-restore { appearance:none;-webkit-appearance:none;width:30px;height:30px;border:0;border-radius:7px;background:transparent;font:800 18px/1 inherit;cursor:pointer; }
          .location-saved-remove { color:#d6a08e;border:0;background:transparent;box-shadow:none;font-family:Arial,Helvetica,sans-serif;font-weight:900;line-height:1;-webkit-text-stroke:.22px rgba(255,224,209,.28);text-shadow:0 -1px 0 rgba(255,232,218,.20),0 1px 0 rgba(65,27,21,.96),0 1px 2px rgba(0,0,0,.54);filter:drop-shadow(0 0 1px rgba(204,116,89,.18)); }
          .location-saved-remove:hover,.location-saved-remove:focus-visible { outline:none;border:0;background:transparent;color:#efb09c;box-shadow:none;-webkit-text-stroke:.22px rgba(255,231,218,.34);text-shadow:0 -1px 0 rgba(255,239,229,.25),0 1px 0 rgba(71,29,22,.96),0 1px 3px rgba(0,0,0,.56);filter:drop-shadow(0 0 2px rgba(220,132,101,.24)); }
          .location-saved-remove:active { transform:scale(.94);filter:brightness(.95) drop-shadow(0 0 1px rgba(204,116,89,.16)); }
          .location-saved-restore { color:#7da9ca;font-size:17px; }
          .location-saved-restore:hover,.location-saved-restore:focus-visible { outline:none;background:rgba(79,163,247,.10);color:#b9dcf6; }
          .location-saved-row.removed { opacity:.72; }
          .location-removed-copy { min-width:0;display:flex;align-items:center;gap:9px;padding:7px 8px;color:#8298aa;font:600 10px/1.2 inherit; }
          .location-removed-copy > span:last-child { min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
          .location-removed-icon { color:#60778b;font-size:12px;line-height:1; }
          .v407-location-provider-note { margin-top:12px;color:#61768a;font-size:9px;line-height:1.45; }
          .v407-location-safety-note { margin-top:10px;padding:9px 10px;border-radius:9px;background:rgba(224,158,54,.07);border:1px solid rgba(224,158,54,.15);color:#bca37c;font-size:9px;line-height:1.45; }
          @media (max-width:680px) {
            .v407-location-search-grid { grid-template-columns:1fr; }
            .v407-location-coordinate-grid { grid-template-columns:1fr 1fr; }
            .v407-location-coordinate-submit,.v407-location-coordinate-save { width:100%; }
            .v407-location-search-dialog { width:min(760px,100%);max-width:100%; }
            .v407-location-search-head { grid-template-columns:76px minmax(0,1fr);gap:10px;padding:14px 56px 12px 12px; }
            .v407-location-search-emblem { width:72px;height:72px; }
            .v407-location-search-emblem img { width:72px;height:72px; }
            
            .v407-location-search-head-copy strong { font-size:15px; }
            .v407-location-search-subtitle { font-size:9.5px; }
            .v407-location-search-body { padding:12px; }
            .v407-location-mode { min-height:44px;padding:7px 8px; }
            .v407-location-search-submit { width:100%; }
            .v407-location-result { grid-template-columns:1fr; }
            .v407-location-result-actions { justify-content:flex-start; }
          }
          .location-option {
            appearance:none;
            -webkit-appearance:none;
            width:100%;
            min-height:36px;
            display:grid;
            grid-template-columns:16px minmax(0,1fr);
            align-items:center;
            gap:7px;
            padding:0 10px;
            border:0;
            border-radius:9px;
            background:transparent;
            color:#c8d4e1;
            font-family:inherit;
            font-size:11px;
            font-weight:760;
            text-align:left;
            cursor:pointer;
            touch-action:manipulation;
          }
          .location-option:hover,
          .location-option:focus-visible {
            outline:none;background:rgba(79,163,247,.075);color:#f0f6fc;
          }
          .location-option .location-option-dot {
            width:6px;height:6px;border-radius:50%;justify-self:center;
            border:1px solid rgba(120,165,205,.30);background:transparent;
          }
          .location-option.selected { color:#dcefff;background:rgba(79,163,247,.085); }
          .location-option.selected .location-option-dot {
            border-color:var(--b-blue);background:var(--b-blue);box-shadow:0 0 8px rgba(79,163,247,.78);
          }
          @media (max-width:720px) {
            /* V3.997 – gleiche Typografie-Kalibrierung wie beim Sprachmenü;
               die 42-px-Touchzeilen bleiben unverändert erhalten. */
            .settings-location-button { min-height:36px;font-size:11px;min-width:154px; }
            .location-dropdown { width:190px;min-width:0;max-width:calc(100vw - 16px);max-height:calc(100dvh - 16px); }
            .location-option { min-height:34px;font-size:11px; }
          }

          /* V3.992 – Settings-Redesign:
             - der Dialog ist ein flexibler Rahmen mit eigenem Scrollbereich
             - Sprache/Standort/Warnsystem/Radien sind einklappbare Gruppen
             - Sprache, Standort und Aura teilen exakt dieselbe Control-Geometrie
             - Radiusregler liegen kompakt in einer Zeile: Name · Slider · − Wert + */
          .settings-dialog {
            display:flex;
            flex-direction:column;
          }
          .settings-dialog-head {
            flex:0 0 auto;
          }
          .settings-body {
            flex:1 1 auto;
            min-height:0;
            overflow-y:auto;
            overflow-x:hidden;
            overscroll-behavior-x:none;
            overscroll-behavior-y:contain;
            touch-action:pan-y;
            -webkit-overflow-scrolling:touch;
            scrollbar-gutter:stable;
            scrollbar-width:thin;
            scrollbar-color:rgba(120,138,160,.34) transparent;
          }
          .settings-body::-webkit-scrollbar { width:7px; }
          .settings-body::-webkit-scrollbar-track { background:transparent; }
          .settings-body::-webkit-scrollbar-thumb {
            border-radius:999px;
            background:rgba(120,138,160,.30);
          }
          .settings-collapsible > summary {
            list-style:none;
            cursor:pointer;
            user-select:none;
            -webkit-user-select:none;
            touch-action:manipulation;
          }
          .settings-collapsible > summary::-webkit-details-marker { display:none; }
          .settings-collapsible > .settings-section-head::after {
            content:'⌄';
            flex:0 0 auto;
            color:#7d8998;
            font-size:14px;
            line-height:1;
            transform:rotate(0deg);
            transform-origin:center;
            transition:transform .16s ease,color .16s ease;
          }
          .settings-collapsible[open] > .settings-section-head::after {
            transform:rotate(180deg);
            color:#b5c0cd;
          }
          .settings-collapsible:not([open]) > .settings-section-head {
            border-bottom-color:transparent;
          }
          .settings-collapsible > .settings-section-head:hover {
            background:rgba(255,255,255,.018);
          }
          .settings-section-content { min-width:0; }

          /* V3.99324 – 1:1-Signatur mit Stage-2-Speicherung: Die freigegebene Originalgrafik wird
             unverändert als PNG-Datenstrom in einem Inline-SVG gerendert.
             Keine Rekonstruktion, keine Font-Abhängigkeit, keine neu erfundene
             Geometrie. Nur gleichmäßige Skalierung bei unverändertem Seitenverhältnis. */
          .settings-signature-wrap {
            display:flex;
            justify-content:flex-end;
            align-items:center;
            padding:2px 5px 0;
            min-height:57px;
            overflow:visible;
          }
          .settings-signature {
            display:block;
            width:238px;
            max-width:58vw;
            height:auto;
            overflow:visible;
            user-select:none;
            pointer-events:none;
            image-rendering:auto;
          }
          @media (max-width:720px) {
            .settings-signature-wrap { min-height:52px;padding-right:3px; }
            .settings-signature { width:215px;max-width:72vw; }
          }

          .settings-control {
            width:174px;
            min-width:174px;
            max-width:174px;
            height:35px;
            min-height:35px;
            box-sizing:border-box;
            padding-left:11px;
            padding-right:11px;
            border-radius:11px;
            font-size:10px;
            line-height:1;
          }
          .settings-language-button.settings-control {
            display:inline-flex;
          }
          .settings-location-button.settings-control {
            flex:0 0 174px;
            display:inline-flex;
          }
          .settings-control.ipad-control-tall {
            width:174px !important;
            min-width:174px !important;
            max-width:174px !important;
            height:35px !important;
            min-height:35px !important;
            padding-left:10px !important;
            padding-right:10px !important;
            border-radius:11px !important;
            font-size:16px !important;
            line-height:35px !important;
          }

          /* V3.9936 – Aura ist ein eigener einklappbarer Bereich. Die nativen
             Range-Regler übernehmen die Geste vollständig, sobald der Finger auf
             dem Regler liegt. Dadurch kann iPadOS/Android den horizontalen Drag
             nicht als Scroll-/Seitengeste übernehmen. Außerhalb der Regler bleibt
             der Einstellungsdialog normal vertikal scrollbar. */
          .settings-aura-controls {
            display:grid;
            border-top:1px solid rgba(255,255,255,.045);
            background:linear-gradient(180deg,rgba(79,163,247,.018),rgba(246,195,68,.012));
          }
          .settings-aura-controls[hidden] { display:none !important; }
          .settings-aura-control-row {
            display:grid;
            grid-template-columns:minmax(118px,auto) minmax(110px,1fr) 54px;
            align-items:center;
            gap:10px;
            min-height:42px;
            padding:6px 12px;
            border-top:1px solid rgba(255,255,255,.04);
          }
          .settings-aura-control-row:first-child { border-top:0; }
          .settings-aura-control-label {
            min-width:0;
            color:#d8dee7;
            font-size:9.5px;
            font-weight:760;
          }
          .settings-aura-control-note {
            display:block;
            margin-top:2px;
            color:#697586;
            font-size:6.9px;
            font-weight:580;
            line-height:1.15;
          }
          .settings-aura-range {
            -webkit-appearance:auto;
            appearance:auto;
            position:relative;
            z-index:2;
            width:100%;
            min-width:80px;
            min-height:28px;
            margin:0;
            accent-color:#d7b866;
            cursor:pointer;
            pointer-events:auto !important;
            touch-action:none;
            -webkit-user-select:none;
            user-select:none;
          }
          .settings-aura-range:disabled {
            cursor:not-allowed;
            opacity:.38;
          }
          .settings-aura-range[data-interacting="1"] {
            filter:brightness(1.08);
          }
          .settings-aura-value {
            min-width:54px;
            text-align:right;
            color:#e8d79f;
            font-size:11px;
            font-weight:850;
            font-variant-numeric:tabular-nums;
            white-space:nowrap;
          }

          .settings-radius-list {
            padding:7px 8px 8px;
            gap:6px;
          }
          .settings-radius {
            padding:7px 9px;
          }
          .settings-radius-line {
            display:grid;
            grid-template-columns:minmax(118px,auto) minmax(90px,1fr) auto;
            align-items:center;
            gap:9px;
            min-width:0;
          }
          .settings-radius-line .settings-radius-name {
            min-width:0;
            white-space:nowrap;
          }
          .settings-radius-line .settings-radius-slider {
            min-width:70px;
            width:100%;
          }
          .settings-radius-line .settings-radius-tools {
            gap:5px;
          }
          .settings-radius-line .settings-radius-step {
            width:28px;
            height:28px;
          }
          .settings-radius-line .settings-radius-value-button {
            min-width:72px;
          }

          @media (max-width:720px) {
            .settings-control {
              width:174px;
              min-width:174px;
              max-width:174px;
              min-height:36px;
              height:36px;
              font-size:16px;
            }
            .settings-radius-line {
              grid-template-columns:minmax(94px,120px) minmax(58px,1fr) auto;
              gap:6px;
            }
            .settings-radius-note { display:none; }
            .settings-radius-line .settings-radius-tools { gap:4px; }
            .settings-radius-line .settings-radius-step { width:26px;height:26px; }
            .settings-radius-line .settings-radius-value-button { min-width:65px;height:26px;font-size:12px; }
          }

          @media (max-width:520px) {
            .settings-row { gap:8px; }
            .settings-aura-control-row {
              grid-template-columns:92px minmax(72px,1fr) 48px;
              gap:7px;
              padding:6px 10px;
            }
            .settings-aura-control-note { display:none; }
            .settings-aura-value { min-width:48px;font-size:10px; }
            .settings-control {
              width:min(174px,48vw);
              min-width:min(174px,48vw);
              max-width:min(174px,48vw);
            }
            .settings-radius-line {
              grid-template-columns:1fr auto;
              grid-template-areas:
                'name tools'
                'slider slider';
              gap:5px 7px;
            }
            .settings-radius-line .settings-radius-name { grid-area:name; }
            .settings-radius-line .settings-radius-slider { grid-area:slider; }
            .settings-radius-line .settings-radius-tools { grid-area:tools; }
          }

          /* V3.534 – optionale Standortwahl direkt im Kopf, unmittelbar links
             vom Zahnrad. Auf allen Zielgeräten bleibt sie dieselbe kompakte
             Instrumentensteuerung. */
          .location-main-row {
            display:none;
            align-items:center;
            justify-content:center;
            flex:0 0 auto;
          }
          #card-root.location-visible .location-main-row {
            display:flex;
          }
          .location-main-shell {
            display:inline-flex;
            align-items:center;
            gap:6px;
            min-height:34px;
            box-sizing:border-box;
            padding:0 9px;
            border:1px solid rgba(79,163,247,.24);
            border-radius:999px;
            background:
              linear-gradient(180deg,rgba(79,163,247,.07),rgba(255,255,255,.026));
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,.028),
              0 4px 14px rgba(0,0,0,.15);
          }
          .location-main-pin {
            width:18px;
            height:18px;
            --mdc-icon-size:18px;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            line-height:1;
            color:#78bdff;
            flex:0 0 18px;
            filter:drop-shadow(0 0 5px rgba(79,163,247,.28));
          }
          .location-main-separator {
            color:rgba(167,190,214,.48);
            font-size:16px;
            font-weight:850;
            line-height:1;
            margin:0 1px;
            transform:translateY(-1px);
            text-shadow:0 0 7px rgba(79,163,247,.16);
          }

          .subtitle-separator {
            display:inline-block;
            margin:0 .30em;
            color:rgba(166,181,198,.58);
            font-size:1.35em;
            font-weight:800;
            line-height:.75;
            vertical-align:-.04em;
            text-shadow:0 0 7px rgba(79,163,247,.12);
          }
          /* V3.99315 – Standortname in der Hauptansicht leicht nach rechts versetzt;
             Sprache und Bezugsstandort in den Einstellungen ohne sichtbare innere
             Button-Kontur/-Fläche, bei unveränderter Geometrie und Ausrichtung.
             V3.99314 – Standortwahl in der Hauptansicht optisch beruhigt:
             keine innere Button-Umrandung mehr; der äußere Standort-Container
             bildet die einzige sichtbare Kontur. Dropdown-Mechanik unverändert.
             V3.99313 – auch die Standortwahl in der Hauptansicht nutzt jetzt
             denselben eigenen Dropdown-Mechanismus wie die Einstellungen.
             Kein natives <select> mehr: identische dunkle Optik, kein Flapping. */
          .location-main-button {
            appearance:none;
            -webkit-appearance:none;
            min-width:104px;
            max-width:148px;
            min-height:30px;
            display:inline-flex;
            align-items:center;
            justify-content:space-between;
            gap:7px;
            padding:0 8px;
            border:0;
            border-radius:8px;
            background:transparent;
            color:#dce8f6;
            font-family:inherit;
            font-size:11.5px;
            font-weight:840;
            line-height:1;
            cursor:pointer;
            touch-action:manipulation;
            box-shadow:none;
          }
          .location-main-button:hover {
            background:rgba(79,163,247,.055);
          }
          .location-main-button:disabled { opacity:.45;cursor:not-allowed; }
          .location-main-current {
            display:block;
            min-width:0;
            margin-left:4px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
          .location-main-chevron {
            flex:0 0 auto;
            color:#6f9fcf;
            font-size:11px;
            line-height:1;
          }

          .settings-location-list {
            display:grid;
          }

          .settings-location-coordinates {
            color:#697687;
            font-size:7px;
            font-variant-numeric:tabular-nums;
            letter-spacing:.025em;
            white-space:nowrap;
          }

          @media (max-width:720px) {
            .location-main-shell {
              min-height:42px;
              height:42px;
              padding:0 9px;
              border-radius:14px;
            }
            .location-main-pin {
              width:18px;
              height:18px;
              --mdc-icon-size:18px;
              flex-basis:18px;
            }
            .location-main-separator { font-size:18px; }
            .location-main-button {
              min-width:92px;
              max-width:108px;
              min-height:34px;
              padding:0 7px;
              font-size:10.8px;
              border-radius:10px;
            }
          }

          /* V3.551 – Headerstatus ist Kartenfunktion und kontextabhängiger Ereignis-Browser:
             Rot = Gefahr, Blau = Gewitter, Gold = aktuelle Aktivität.
             Ruhige/Leere Zustände bleiben bewusst zurückhaltend. */
          .status-chip {
            cursor:pointer;
            transition:
              color .18s ease,
              border-color .18s ease,
              background .18s ease,
              box-shadow .18s ease,
              opacity .18s ease,
              transform .10s ease;
          }
          .status-chip:hover:not(.disabled) {
            transform:translateY(-1px);
          }
          .status-chip:active:not(.disabled) {
            transform:scale(.985);
          }

          .status-chip.danger {
            color:#ffd2d6;
            border-color:rgba(255,90,103,.48);
            background:rgba(255,90,103,.095);
            box-shadow:0 0 15px rgba(255,90,103,.08),inset 0 0 12px rgba(255,90,103,.035);
          }
          .status-chip.danger .bolt {
            color:var(--b-danger);
            filter:drop-shadow(0 0 5px rgba(255,90,103,.42));
          }

          .status-chip.storm {
            color:#d7ecff;
            border-color:rgba(79,163,247,.42);
            background:rgba(79,163,247,.085);
            box-shadow:0 0 14px rgba(79,163,247,.07),inset 0 0 11px rgba(79,163,247,.03);
          }
          .status-chip.storm .bolt {
            color:var(--b-blue);
            filter:drop-shadow(0 0 5px rgba(79,163,247,.38));
          }

          .status-chip.activity {
            color:#ffe9a0;
            border-color:rgba(246,195,68,.38);
            background:rgba(246,195,68,.075);
            box-shadow:0 0 13px rgba(246,195,68,.06),inset 0 0 10px rgba(246,195,68,.025);
          }
          .status-chip.activity .bolt {
            color:var(--b-gold);
            filter:drop-shadow(0 0 5px rgba(246,195,68,.34));
          }

          .status-chip.quiet {
            color:#aeb6c2;
            border-color:rgba(255,255,255,.09);
            background:rgba(255,255,255,.03);
          }
          .status-chip.quiet .bolt { color:#7f8997; }

          .status-chip.disabled {
            cursor:default;
            opacity:.56;
            color:#818996;
            border-color:rgba(255,255,255,.065);
            background:rgba(255,255,255,.018);
            box-shadow:none;
          }
          .status-chip.disabled .bolt {
            color:#69717d;
            filter:none;
          }

          .warn-banner {
            display:none;
            align-items:center;
            gap:10px;
            margin:0 0 12px;
            padding:10px 13px;
            border-radius:13px;
            color:#ffd5d8;
            background:linear-gradient(90deg,rgba(255,64,80,.15),rgba(255,64,80,.045));
            border:1px solid rgba(255,100,112,.46);
            font-size:11px;
            font-weight:760;
          }
          .warn-banner.active { display:flex; }

          .radius-grid {
            /* V3.521 TEST:
               Die drei Radiusregler bleiben technisch im DOM, werden in der
               Hauptansicht aber vollständig ausgeblendet. Das finale Popup nutzt
               weiterhin exakt dieselben Regler/Events im Hintergrund, sodass
               keine Logik dupliziert oder verändert wird. */
            display:none;
            grid-template-columns:minmax(0,2fr) minmax(180px,1fr) minmax(180px,1fr);
            gap:10px;
            margin-bottom:0;
          }

          .radius-card {
            min-width:0;
            min-height:72px;
            padding:10px 12px 11px;
            border-radius:15px;
            background:rgba(255,255,255,.035);
            border:1px solid rgba(255,255,255,.075);
          }

          .radius-card.observation { border-color:rgba(246,195,68,.18); }
          .radius-card.storm {
            border-color:rgba(79,163,247,.24);
            background:linear-gradient(180deg,rgba(79,163,247,.04),rgba(255,255,255,.022));
          }
          .radius-card.danger { border-color:rgba(255,90,103,.22);background:linear-gradient(180deg,rgba(255,90,103,.035),rgba(255,255,255,.022)); }

          .radius-head {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:10px;
            margin-bottom:8px;
          }

          .radius-title {
            min-width:0;
            color:var(--b-muted);
            font-size:8.5px;
            font-weight:850;
            letter-spacing:.13em;
            text-transform:uppercase;
            white-space:nowrap;
          }

          /* V3.99317 – Hauptansicht nutzt dieselbe kompakte Radiusbedienung wie
             das Einstellungsmenü: [−] [KM-Direkteingabe] [+]. */
          .radius-tools { display:flex;align-items:center;gap:5px;flex:0 0 auto; }
          .radius-step {
            appearance:none;
            -webkit-appearance:none;
            width:28px;
            height:28px;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            flex:0 0 28px;
            padding:0;
            border-radius:9px;
            background:rgba(255,255,255,.035);
            cursor:pointer;
            font:850 16px/1 inherit;
            text-align:center;
            touch-action:manipulation;
            -webkit-user-select:none;
            user-select:none;
            transition:transform .10s ease,background .16s ease,border-color .16s ease;
          }
          .radius-step:hover { background:rgba(255,255,255,.06); }
          .radius-step:active { transform:scale(.95); }
          .observation .radius-step { color:var(--b-gold);border:1px solid rgba(246,195,68,.32); }
          .storm .radius-step { color:var(--b-blue);border:1px solid rgba(79,163,247,.36); }
          .danger .radius-step { color:var(--b-danger);border:1px solid rgba(255,90,103,.34); }
          .radius-step:disabled { opacity:.28;cursor:default;transform:none; }

          .radius-value {
            display:inline-flex;
            align-items:center;
            justify-content:center;
            gap:3px;
            min-width:72px;
            height:28px;
            box-sizing:border-box;
            text-align:center;
            font-size:13px;
            font-weight:900;
            font-variant-numeric:tabular-nums;
            white-space:nowrap;
          }
          .radius-value-button {
            appearance:none;
            -webkit-appearance:none;
            padding:0 8px;
            border:1px solid rgba(255,255,255,.12);
            border-radius:9px;
            outline:0;
            background:rgba(255,255,255,.035);
            color:inherit;
            font-family:inherit;
            line-height:1;
            cursor:pointer;
            touch-action:manipulation;
            -webkit-tap-highlight-color:transparent;
            transition:border-color .16s ease,background .16s ease,box-shadow .16s ease,transform .10s ease;
          }
          .radius-value-button:hover { background:rgba(255,255,255,.06); }
          .radius-value-button:active { transform:scale(.96); }
          .radius-number,.radius-unit { pointer-events:none; }
          .observation .radius-value-button { color:var(--b-gold);border-color:rgba(246,195,68,.32);box-shadow:0 0 10px rgba(246,195,68,.045); }
          .storm .radius-value-button { color:var(--b-blue);border-color:rgba(79,163,247,.34);box-shadow:0 0 10px rgba(79,163,247,.045); }
          .danger .radius-value-button { color:var(--b-danger);border-color:rgba(255,90,103,.36);box-shadow:0 0 10px rgba(255,90,103,.05); }
          .radius-unit { font-size:8px;font-weight:850;letter-spacing:.04em;opacity:.80; }

          .radius-slider {
            width:100%;
            height:5px;
            margin:3px 0 0;
            border-radius:999px;
            outline:none;
          }
          #observation-slider { accent-color:var(--b-gold); }
          #storm-slider { accent-color:var(--b-blue); }
          #danger-slider { accent-color:var(--b-danger); }

          .kpi-grid {
            display:grid;
            grid-template-columns:1.02fr 1.02fr 1.25fr 1fr;
            gap:8px;
            margin-bottom:12px;
          }

          .kpi {
            position:relative;
            overflow:hidden;
            min-height:96px;
            padding:11px 12px 12px;
            border-radius:15px;
            background:linear-gradient(180deg,rgba(255,255,255,.043),rgba(255,255,255,.024));
            border:1px solid rgba(255,255,255,.075);
            box-sizing:border-box;
          }

          .kpi::after {
            content:'';
            position:absolute;
            left:10px;right:10px;bottom:0;height:1px;
            background:linear-gradient(90deg,transparent,var(--kpi-accent,rgba(255,255,255,.2)),transparent);
            opacity:.75;
          }

          .kpi-label {
            display:block;
            color:var(--b-muted);
            font-size:8px;
            line-height:1.2;
            font-weight:850;
            letter-spacing:.12em;
            text-transform:uppercase;
          }

          .kpi-simple .kpi-label,
          .kpi-simple .kpi-sub,
          .kpi-simple .kpi-foot {
            text-align:center;
          }

          .kpi-hits .kpi-label {
            text-align:center;
          }

          .kpi-distance .kpi-sub,
          .kpi-azimuth .kpi-sub {
            margin-top:12px;
          }

          /* V3.530 – KPI-Karten wieder deutlich zentrierter:
             Titel, Wert, Zusatztext und Fußzeile sitzen ruhiger in der Kartenmitte. */
          .kpi-simple,
          .kpi-hits {
            display:grid;
            grid-template-rows:auto minmax(0,1fr) auto;
          }

          .kpi-simple {
            justify-items:center;
            text-align:center;
          }

          .kpi-hits {
            justify-items:stretch;
          }

          .kpi-main {
            min-width:0;
            align-self:center;
            justify-self:center;
            width:100%;
            padding-top:3px;
            text-align:center;
          }

          .kpi-value {
            display:block;
            margin:0;
            font-size:clamp(21px,2.32vw,31px);
            line-height:.96;
            font-weight:860;
            letter-spacing:-.038em;
            font-variant-numeric:tabular-nums;
          }

          .kpi-value .unit {
            position:relative;
            top:-.04em;
            font-size:.43em;
            color:var(--b-text2);
            font-weight:720;
            margin-left:2px;
            letter-spacing:-.01em;
          }

          /* V3.540 – Gradzeichen ist kein kleiner Einheitenzusatz wie "km".
             Im Azimut-KPI sitzt es deutlich groesser und klar hochgestellt. */
          .kpi-azimuth .kpi-value .unit {
            top:-.38em;
            font-size:.72em;
            font-weight:780;
            margin-left:1px;
            letter-spacing:0;
            color:#d9e1ec;
          }

          .kpi-sub {
            display:block;
            min-width:0;
            margin-top:8px;
            color:var(--b-muted);
            font-size:9px;
            line-height:1.15;
          }

          .kpi-cardinal-detail {
            color:#8a94a2;
            letter-spacing:.01em;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          }

          .kpi-foot {
            display:block;
            min-height:9px;
            color:#65707f;
            font-size:7.5px;
            line-height:1.15;
            letter-spacing:.025em;
          }

          .kpi-last .kpi-foot {
            padding-top:2px;
          }

          /* Treffer: zwei exakt gleich breite Messpunkte auf 25/75 % der Karte. */
          .hit-columns {
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            align-items:center;
            width:100%;
            gap:0;
            margin:0;
            padding:4px 0 0;
            align-self:center;
          }

          .hit-group {
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            width:100%;
            max-width:none;
            min-width:0;
          }
          .hit-group.left,
          .hit-group.right {
            align-self:auto;
            margin:0;
          }

          .hit-number {
            font-size:clamp(24px,2.55vw,34px);
            line-height:.95;
            font-weight:870;
            letter-spacing:-.04em;
            font-variant-numeric:tabular-nums;
          }

          .hit-group.left .hit-number { color:var(--b-gold); }
          .hit-group.right .hit-number {
            color:rgba(255,255,255,.32);
            transition:.2s ease;
          }
          .hit-group.right.active .hit-number {
            color:var(--b-danger);
            text-shadow:0 0 12px rgba(255,90,103,.22);
          }

          .hit-caption {
            margin-top:6px;
            color:var(--b-muted);
            font-size:8.1px;
            line-height:1.1;
            white-space:nowrap;
            text-align:center;
          }

          .hit-live {
            align-self:end;
            display:block;
            width:100%;
            margin:0;
            padding-top:4px;
            color:var(--b-muted);
            font-size:8.5px;
            line-height:1.12;
            white-space:nowrap;
            text-align:center;
          }
          .hit-live strong { color:var(--b-text2);font-weight:760; }
          .hit-live .danger-live { color:var(--b-danger); }


          @keyframes dangerCountPulse {
            0%{transform:scale(1);text-shadow:0 0 0 rgba(255,90,103,0)}
            40%{transform:scale(1.12);text-shadow:0 0 14px rgba(255,90,103,.48)}
            100%{transform:scale(1);text-shadow:0 0 0 rgba(255,90,103,0)}
          }
          .hit-number.pulse { animation:dangerCountPulse .75s ease-out; }

          .main-grid {
            display:grid;
            grid-template-columns:minmax(0,1.95fr) minmax(320px,.82fr);
            gap:12px;
            align-items:start;
            margin-bottom:0;
          }

          .left-stack,
          .side-stack {
            min-width:0;
            display:flex;
            flex-direction:column;
            gap:10px;
          }

          :host(.map-window-host) {
            position:fixed!important;inset:0!important;z-index:2147483646!important;
            display:block!important;width:100vw!important;height:100dvh!important;
            margin:0!important;padding:0!important;background:#090b0f!important;overflow:hidden!important;
          }
          :host(.map-window-host) > ha-card {
            width:100vw!important;height:100dvh!important;max-width:none!important;max-height:none!important;
            margin:0!important;border:0!important;border-radius:0!important;background:#090b0f!important;
            overflow:hidden!important;
          }

          .map-card {
            position:relative;
            overflow:hidden;
            min-width:0;
            height:auto;
            border-radius:18px;
            border:1px solid rgba(255,255,255,.075);
            background:#090b0f;
          }

          #map {
            width:100%;
            height:auto;
            min-height:0;
            aspect-ratio:1.58 / 1;
            background:#0a0d12;
          }

          /* V4.09.01 – dieselbe Leaflet-Instanz bleibt in allen Größen erhalten. */
          .map-card.map-size-large #map { height:min(82dvh,900px);min-height:600px;aspect-ratio:auto; }
          #map-fullscreen-dialog {
            position:fixed;inset:0;z-index:2147483647;
            width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;
            color:var(--b-text);background:#090b0f;overflow:hidden;
          }
          #map-fullscreen-dialog::backdrop { background:#020408; }
          #map-fullscreen-dialog .map-card {
            width:100%;height:100%;border:0;border-radius:0;display:flex;flex-direction:column;
          }
          #map-fullscreen-dialog .map-card #map {
            flex:1 1 auto;width:100%;height:auto!important;min-height:0!important;aspect-ratio:auto!important;
          }
          #map-fullscreen-dialog .map-legend { flex:0 0 auto; }
          /* V4.09.13 – Radius-Ziffernblock und weltweite Ortssuche werden im
             Vollbild in den nativen Dialog verschoben und liegen damit sicher in
             derselben Top-Layer-Ebene wie die Karte. */
          #map-fullscreen-dialog > .radius-keypad-backdrop,
          #map-fullscreen-dialog > .v407-location-search-backdrop {
            z-index:2147483647;
          }

          .map-compass-overlay {
            position:absolute;z-index:760;width:clamp(188.5px,31.2vmin,390px);aspect-ratio:1 / 1;
            display:flex;align-items:center;justify-content:center;cursor:grab;touch-action:none;pointer-events:auto;
            user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;
            overscroll-behavior:none;filter:drop-shadow(0 14px 30px rgba(0,0,0,.44));
          }
          .map-compass-overlay[hidden] { display:none!important; }
          .map-compass-overlay.dragging { cursor:grabbing; }
          .map-compass-overlay .compass-instrument {
            width:calc(100% / var(--compass-visual-stage-scale,1));max-width:none;flex:0 0 auto;
          }
          .map-compass-overlay .compass-instrument,
          .map-compass-overlay .compass-instrument * {
            pointer-events:none!important;
            touch-action:none!important;
          }

          .map-display-fab {
            position:absolute;z-index:2147483647;width:44px;height:44px;
            left:auto;top:auto;right:10px;bottom:auto;
            pointer-events:auto;
          }
          .map-display-fab.menu-open { z-index:2147483647; }
          .map-location-overlay {
            position:absolute;z-index:2147483644;left:auto;top:auto;right:auto;bottom:auto;
            display:flex;align-items:center;justify-content:flex-end;pointer-events:auto;
            cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;
            -webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;overscroll-behavior:none;
          }
          .map-location-overlay.dragging { cursor:grabbing; }
          .map-location-overlay[hidden] { display:none!important; }
          .map-location-overlay .location-main-row { display:flex!important;pointer-events:auto; }
          #map-fullscreen-dialog .location-dropdown { z-index:2147483645; }
          /* V4.09.11 – im Vollbild darf die generische 320-px-Grenze nicht die
             gesamte Mehrspaltenbreite zusammenquetschen. */
          #map-fullscreen-dialog .location-dropdown.map-adaptive {
            max-width:calc(100vw - 20px);
          }
          #map-fullscreen-dialog .location-dropdown.map-adaptive.multicolumn {
            column-rule:1px solid rgba(79,163,247,.12);
          }
          #map-fullscreen-dialog .location-dropdown.map-adaptive.multicolumn > * {
            break-inside:avoid;-webkit-column-break-inside:avoid;
          }
          #map-fullscreen-dialog .location-dropdown.map-adaptive.multicolumn .location-section-label {
            break-after:avoid-column;-webkit-column-break-after:avoid;
          }
          #map-fullscreen-dialog .location-dropdown.map-adaptive.multicolumn .location-saved-copy,
          #map-fullscreen-dialog .location-dropdown.map-adaptive.multicolumn .location-removed-copy > span:last-child {
            white-space:normal;overflow:visible;text-overflow:clip;overflow-wrap:anywhere;
          }
          #map-fullscreen-dialog .location-dropdown.map-adaptive.multicolumn .location-option > span:last-child {
            min-width:0;white-space:normal;overflow-wrap:anywhere;
          }
          #map-fullscreen-dialog .map-top-controls { top:max(10px,calc(env(safe-area-inset-top,0px) + 10px)); }
          .map-instrument-controls {
            position:absolute;z-index:2147483646;top:10px;left:54px;
            display:flex;align-items:center;gap:5px;pointer-events:auto;
          }
          .map-instrument-controls[hidden] { display:none!important; }
          .map-instrument-toggle {
            appearance:none;-webkit-appearance:none;width:29px;height:29px;padding:0;border-radius:9px;
            border:1px solid rgba(246,195,68,.20);background:rgba(10,14,20,.90);color:#aab5c3;
            display:grid;place-items:center;line-height:0;cursor:pointer;touch-action:manipulation;
            box-shadow:0 6px 18px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.035);
            backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
          }
          .map-instrument-toggle:hover { border-color:rgba(246,195,68,.44);background:rgba(20,23,29,.96); }
          .map-instrument-toggle:active { transform:scale(.94); }
          .map-instrument-toggle.active { color:#f5cf67;border-color:rgba(246,195,68,.55);box-shadow:0 6px 18px rgba(0,0,0,.30),0 0 12px rgba(246,195,68,.10),inset 0 1px 0 rgba(255,255,255,.05); }
          .map-instrument-toggle:not(.active) { opacity:.52;filter:saturate(.55); }
          .map-instrument-toggle ha-icon { --mdc-icon-size:17px;width:17px;height:17px; }
          .map-instrument-toggle img { width:20px;height:20px;display:block;object-fit:contain;object-position:center;margin:0!important;padding:0!important;pointer-events:none; }
          .map-instrument-toggle .map-compass-toggle-icon { width:21px;height:21px; }
          .map-instrument-toggle .map-cluster-jump-toggle-icon { width:23px!important;height:16px!important;object-fit:contain!important; }
          .map-cluster-jump-overlay {
            appearance:none;-webkit-appearance:none;position:absolute;z-index:2147483646;left:auto;top:auto;
            min-width:106px;height:36px;padding:0 13px;border:1px solid rgba(246,195,68,.42);border-radius:18px;
            display:inline-flex;align-items:center;justify-content:center;gap:5px;
            background:rgba(10,14,20,.92);color:#f5d675;cursor:grab;touch-action:none;pointer-events:auto;
            user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;
            box-shadow:0 7px 20px rgba(0,0,0,.34),0 0 13px rgba(246,195,68,.08),inset 0 1px 0 rgba(255,255,255,.04);
            backdrop-filter:blur(11px);-webkit-backdrop-filter:blur(11px);
            font:800 10.5px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.015em;
            white-space:nowrap;
          }
          .map-cluster-jump-overlay[hidden] { display:none!important; }
          .map-cluster-jump-overlay.dragging { cursor:grabbing; }
          .map-cluster-jump-overlay.disabled { opacity:.52;filter:saturate(.55); }
          .map-cluster-jump-overlay:not(.disabled):hover { border-color:rgba(246,195,68,.68);background:rgba(18,21,27,.97); }
          .map-cluster-jump-overlay:focus-visible { outline:2px solid rgba(246,195,68,.76);outline-offset:2px; }
          .map-cluster-jump-overlay .status-infinity-gfx { width:28px;max-height:19px;margin-left:5px;pointer-events:auto; }
          .map-cluster-jump-overlay .status-cluster-countdown { pointer-events:auto; }
          .map-medallion-overlay {
            position:absolute;z-index:755;width:clamp(110px,18vmin,210px);aspect-ratio:1 / 1;
            padding:0!important;border:0!important;display:flex!important;align-items:center;justify-content:center;
            cursor:grab;touch-action:none;pointer-events:auto;user-select:none;-webkit-user-select:none;
            -webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;overscroll-behavior:none;
            background:transparent!important;filter:drop-shadow(0 12px 24px rgba(0,0,0,.38));
          }
          .map-medallion-overlay.android-device { width:clamp(93.5px,15.3vmin,178.5px); }
          .map-medallion-overlay::before { display:none!important; }
          .map-medallion-overlay[hidden] { display:none!important; }
          .map-medallion-overlay.dragging { cursor:grabbing; }
          .map-medallion-overlay .trend-icon {
            width:100%!important;height:100%!important;max-width:none!important;margin:0!important;
            transform:none!important;pointer-events:none!important;
            filter:drop-shadow(0 7px 10px rgba(0,0,0,.46)) drop-shadow(0 0 9px rgba(196,132,43,.10));
          }
          /* V4.09.04 – das Kartenmedaillon ist absichtlich nur das reine
             Trendinstrument. Es erbt keine Layout-/History-Eigenschaften von
             .trend; lediglich die vier produktiven Pfeilzustände werden gespiegelt. */
          .map-medallion-overlay.up .trend-medallion-arrow {
            opacity:1;transform:translate(-50%,-50%) rotate(0deg) scale(1);
          }
          .map-medallion-overlay.stable .trend-medallion-arrow {
            opacity:1;transform:translate(-50%,-50%) rotate(45deg) scale(1);
          }
          .map-medallion-overlay.down .trend-medallion-arrow {
            opacity:1;transform:translate(-50%,-50%) rotate(90deg) scale(1);
          }
          .map-medallion-overlay.none .trend-medallion-arrow {
            opacity:0;transform:translate(-50%,-50%) rotate(45deg) scale(.84);
            filter:drop-shadow(0 1px 1px rgba(47,24,4,.40)) drop-shadow(0 0 0 rgba(246,195,68,0));
          }
          .map-medallion-overlay.none .trend-icon {
            filter:drop-shadow(0 7px 10px rgba(0,0,0,.46)) drop-shadow(0 0 5px rgba(196,132,43,.055));
          }
          .map-display-fab[hidden],
          .map-card.map-window-mode .map-display-fab { display:none!important; }
          .map-display-fab-toggle {
            appearance:none;border:1px solid rgba(246,195,68,.24);outline:0;
            width:44px;height:44px;padding:0;border-radius:12px;
            display:grid;place-items:center;
            background:rgba(12,16,23,.94);
            box-shadow:0 8px 24px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,255,255,.04),0 0 14px rgba(246,195,68,.07);
            backdrop-filter:blur(12px);cursor:pointer;touch-action:manipulation;
            -webkit-tap-highlight-color:transparent;
            transition:border-color .18s ease,background .18s ease,box-shadow .18s ease,transform .10s ease;
          }
          .map-display-fab-toggle:hover,
          .map-display-fab-toggle[aria-expanded="true"] {
            border-color:rgba(246,195,68,.48);background:rgba(19,22,28,.97);
            box-shadow:0 9px 26px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.05),0 0 18px rgba(246,195,68,.15);
          }
          .map-display-fab-toggle:active { transform:scale(.95); }
          .map-display-fab-toggle:focus-visible { outline:2px solid rgba(246,195,68,.78);outline-offset:2px; }
          .map-layer-symbol { position:relative;display:block;width:26px;height:25px;pointer-events:none; }
          .map-layer-symbol-layer {
            position:absolute;left:50%;height:5px;border-radius:2px;
            transform:translateX(-50%) skewX(-20deg);
            border:1px solid currentColor;background:color-mix(in srgb,currentColor 20%,rgba(8,11,16,.92));
            box-shadow:0 0 8px color-mix(in srgb,currentColor 30%,transparent);
          }
          .map-layer-symbol-layer.gold { top:2px;width:24px;color:${C.gold};z-index:3; }
          .map-layer-symbol-layer.blue { top:10px;width:18px;color:${C.blue};z-index:2; }
          .map-layer-symbol-layer.red { top:18px;width:12px;color:${C.danger};z-index:1; }
          .map-layer-stack3d-symbol {
            display:block;width:40px;height:40px;object-fit:contain;pointer-events:none;user-select:none;-webkit-user-drag:none;
            filter:drop-shadow(0 2px 5px rgba(0,0,0,.58)) drop-shadow(0 0 4px rgba(246,195,68,.12));
          }
          /* V4.09.14 – Kartenansicht-Menü: kompaktere, inhaltsnahe Breite.
             Die Funktion und Gestaltung bleiben unverändert; nur Breite und
             Lesbarkeit werden gerätespezifisch nachgeschärft. */
          .map-display-menu {
            position:absolute;right:0;bottom:52px;width:142px;min-width:142px;max-width:142px;padding:6px;
            display:grid;gap:3px;box-sizing:border-box;
            border:1px solid rgba(246,195,68,.24);border-radius:14px;
            background:rgba(10,13,18,.97);
            box-shadow:0 15px 38px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.035);
            backdrop-filter:blur(16px);
          }
          .map-display-menu[hidden] { display:none!important; }
          .map-display-menu::after {
            content:'';position:absolute;right:15px;bottom:-5px;width:9px;height:9px;
            background:rgba(10,13,18,.97);border-right:1px solid rgba(246,195,68,.24);
            border-bottom:1px solid rgba(246,195,68,.24);transform:rotate(45deg);
          }
          .map-display-menu-title {
            padding:4px 9px 5px;color:#c9a94e;font-size:9px;font-weight:820;
            letter-spacing:.075em;text-transform:uppercase;white-space:nowrap;text-align:center;
          }
          .map-display-btn {
            appearance:none;border:0;outline:0;min-height:38px;padding:0 10px;border-radius:9px;
            display:flex;align-items:center;gap:8px;text-align:left;
            background:transparent;color:#a0a8b6;font-family:inherit;font-size:10.5px;font-weight:780;
            letter-spacing:.02em;cursor:pointer;touch-action:manipulation;white-space:nowrap;
          }
          .map-display-btn::before {
            content:'';width:7px;height:7px;flex:0 0 7px;border-radius:50%;
            border:1px solid currentColor;opacity:.74;
          }
          .map-display-btn:hover { background:rgba(255,255,255,.045);color:#d6dae1; }
          .map-display-btn.active {
            color:#ffe28b;background:rgba(246,195,68,.105);
            box-shadow:inset 0 0 0 1px rgba(246,195,68,.20);
          }
          .map-display-btn.active::before {
            background:var(--b-gold);border-color:var(--b-gold);
            box-shadow:0 0 7px rgba(246,195,68,.62);
          }
          .map-display-btn:focus-visible { outline:2px solid rgba(246,195,68,.72);outline-offset:1px; }
          /* V4.09.20 – Standardansicht verwendet keinen nativen Geräte-Picker mehr.
             Button und Liste übernehmen bewusst Geometrie, Farbe und Bedienlogik
             des bewährten Custom-Dropdowns der Standortauswahl. */
          .settings-map-startup-button { width:156px;min-width:156px;max-width:156px; }
          .settings-map-startup-button .settings-location-current { min-width:0;flex:1 1 auto; }
          .settings-map-startup-current-text { min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
          .settings-map-startup-dropdown { min-width:176px; }
          @media (max-width:720px) {
            .settings-map-startup-button { width:146px;min-width:146px;max-width:146px; }
            .settings-map-startup-dropdown { width:168px;min-width:0;max-width:calc(100vw - 16px); }
          }

          .leaflet-container { background:#0a0d12 !important;font-family:inherit; }
          .leaflet-tile-pane { filter:invert(1) hue-rotate(180deg) brightness(.62) saturate(.55) contrast(1.12); }
          .leaflet-control-zoom { border:1px solid rgba(255,255,255,.12)!important;border-radius:10px!important;overflow:hidden; }
          .leaflet-control-zoom a { background:rgba(14,17,24,.92)!important;color:#dfe4ec!important;border-color:rgba(255,255,255,.10)!important; }
          .leaflet-control-attribution { background:rgba(10,13,18,.72)!important;color:#70798a!important;font-size:8px!important; }
          .leaflet-control-attribution a { color:#94a0b1!important; }

          /* V3.985 – Geo-Recenter ist keine Zoomfunktion mehr: gleicher
             hochwertige Kartenbutton, aber freistehend unten links innerhalb
             der Leaflet-Karte. Größe und Fadenkreuz bleiben unverändert. */
          .map-recenter-btn {
            position:absolute;
            z-index:710;
            top:auto;
            bottom:10px;
            left:10px;
            width:32px;
            height:32px;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:0;
            border:1px solid rgba(79,163,247,.26);
            border-radius:10px;
            background:rgba(12,16,23,.92);
            color:#78bdff;
            box-shadow:
              0 7px 22px rgba(0,0,0,.22),
              inset 0 1px 0 rgba(255,255,255,.035),
              0 0 12px rgba(79,163,247,.055);
            backdrop-filter:blur(10px);
            cursor:pointer;
            touch-action:manipulation;
            transition:
              border-color .18s ease,
              background .18s ease,
              box-shadow .18s ease,
              transform .10s ease;
          }
          .map-recenter-btn:hover {
            border-color:rgba(79,163,247,.46);
            background:rgba(20,29,40,.95);
            box-shadow:
              0 7px 22px rgba(0,0,0,.22),
              inset 0 1px 0 rgba(255,255,255,.04),
              0 0 15px rgba(79,163,247,.14);
          }
          .map-recenter-btn:active {
            transform:scale(.95);
          }
          .map-recenter-icon {
            display:block;
            width:18px;
            height:18px;
            flex:0 0 18px;
            margin:0;
            overflow:visible;
            pointer-events:none;
          }


          /* V3.989 – zweite, bewusst optionale Detailstufe für einen in
             „Letzte Blitzaktivität“ ausgewählten Einschlag. Der Button übernimmt
             die Ring+Punkt-Sprache des Tabellenmarkers und erscheint nur solange
             ein gültiger Treffer ausgewählt ist. */
          .map-strike-target-btn {
            --target-color:#F6C344;
            position:absolute;
            z-index:710;
            left:56px;
            bottom:10px;
            width:32px;
            height:32px;
            padding:0;
            display:flex;
            align-items:center;
            justify-content:center;
            border:1px solid color-mix(in srgb,var(--target-color) 38%,rgba(255,255,255,.10));
            border-radius:10px;
            background:rgba(12,16,23,.92);
            color:var(--target-color);
            box-shadow:
              0 7px 22px rgba(0,0,0,.22),
              inset 0 1px 0 rgba(255,255,255,.035),
              0 0 12px color-mix(in srgb,var(--target-color) 9%,transparent);
            backdrop-filter:blur(10px);
            cursor:pointer;
            touch-action:manipulation;
            transition:border-color .18s ease,background .18s ease,box-shadow .18s ease,filter .18s ease;
          }
          .map-strike-target-btn[hidden] { display:none!important; }
          .map-strike-target-btn:hover {
            border-color:color-mix(in srgb,var(--target-color) 64%,white 6%);
            background:rgba(20,24,31,.96);
            filter:brightness(1.16);
            box-shadow:
              0 7px 22px rgba(0,0,0,.22),
              inset 0 1px 0 rgba(255,255,255,.04),
              0 0 17px color-mix(in srgb,var(--target-color) 22%,transparent);
          }
          .map-strike-target-btn:active { filter:brightness(1.34); }
          /* V3.991 – der zusätzliche Zielbutton verwendet exakt den gemeinsamen
             .recent-target-glyph-Baustein; keine zweite Geometrie mehr. */
          /* V3.993 – der CSS-Kreis bleibt derselbe Baustein; nur die Desktop-
             Zielbutton-Instanz nutzt ein gerades 12×12-Raster. Damit liegt das
             4-px-Zentrum nicht mehr auf einem halben Geräte-Pixel. */
          #card-root:not(.ipad-device) .map-strike-target-glyph {
            width:12px;
            height:12px;
          }
          #card-root.ipad-device .map-strike-target-btn { left:60px; }

          /* V3.985 – präziser Standortanker statt massivem Gold-Blob:
             kleiner Goldkern, feiner Ring und ruhige warme Aura. */
          .reference-position-icon {
            background:transparent!important;
            border:0!important;
          }
          .reference-position-marker {
            position:relative;
            width:24px;
            height:24px;
            display:block;
            border-radius:50%;
            pointer-events:none;
          }
          .reference-position-marker::before {
            content:'';
            position:absolute;
            left:50%;top:50%;
            width:15px;height:15px;
            transform:translate(-50%,-50%);
            border:1.25px solid rgba(246,195,68,.92);
            border-radius:50%;
            background:rgba(246,195,68,.035);
            box-shadow:
              0 0 5px rgba(246,195,68,.34),
              0 0 12px rgba(246,195,68,.15);
          }
          .reference-position-marker::after {
            content:'';
            position:absolute;
            left:50%;top:50%;
            width:7px;height:7px;
            transform:translate(-50%,-50%);
            border-radius:50%;
            background:${C.gold};
            box-shadow:
              0 0 4px rgba(246,195,68,.82),
              0 0 9px rgba(246,195,68,.30),
              0 0 17px rgba(246,195,68,.12);
          }

          .map-top-controls {
            position:absolute;
            z-index:700;
            top:10px;
            right:10px;
            display:flex;
            align-items:center;
            justify-content:flex-end;
            gap:7px;
            max-width:calc(100% - 62px);
          }

          .map-mode-switch {
            display:inline-flex;
            align-items:center;
            justify-content:center;
            min-height:29px;
            box-sizing:border-box;
            padding:2px;
            border:1px solid rgba(255,255,255,.105);
            border-radius:999px;
            background:rgba(8,11,16,.84);
            backdrop-filter:blur(12px);
            box-shadow:0 7px 22px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.025);
          }
          .map-mode-btn {
            appearance:none;
            border:0;
            outline:0;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            height:25px;
            min-height:25px;
            box-sizing:border-box;
            padding:0 9px;
            border-radius:999px;
            background:transparent;
            color:#7f8897;
            font-family:inherit;
            font-size:7.6px;
            font-weight:820;
            line-height:1;
            letter-spacing:.045em;
            cursor:pointer;
            white-space:nowrap;
            transition:background .20s ease,color .20s ease,box-shadow .20s ease;
          }
          .map-mode-btn::before {
            content:'';
            display:block;
            flex:0 0 auto;
            width:5px;height:5px;
            margin-right:5px;
            border-radius:50%;
            border:1px solid currentColor;
            opacity:.82;
          }
          .map-mode-btn.active {
            color:#ffe28b;
            background:rgba(246,195,68,.105);
            box-shadow:inset 0 0 0 1px rgba(246,195,68,.24),0 0 11px rgba(246,195,68,.055);
          }
          .map-mode-btn.active::before { background:var(--b-gold);border-color:var(--b-gold);box-shadow:0 0 6px rgba(246,195,68,.58); }

          .map-radius-chip {
            display:flex;
            align-items:center;
            gap:9px;
            min-height:29px;
            padding:0 10px;
            border-radius:999px;
            border:1px solid rgba(255,255,255,.10);
            background:rgba(9,12,17,.82);
            backdrop-filter:blur(12px);
            box-shadow:0 7px 22px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.02);
            color:var(--b-text2);
            font-size:8px;
            font-weight:800;
            letter-spacing:.05em;
            text-transform:uppercase;
            pointer-events:none;
            white-space:nowrap;
          }
          .map-radius-chip .obs { color:var(--b-gold); }
          .map-radius-chip .storm { color:var(--b-blue); }
          .map-radius-chip .danger { color:var(--b-danger); }
          .map-radius-chip i { width:7px;height:7px;border-radius:50%;display:inline-block;margin-right:3px; }
          /* V3.99713 – der Radius-Chip bleibt fuer die Karte selbst durchlaessig.
             Nur die drei eigentlichen Radiuswerte werden wieder gezielt als
             Pointer-/Touch-Ziele aktiviert. */
          .map-radius-chip [data-radius-input-kind] {
            pointer-events:auto;
            cursor:pointer;
            touch-action:manipulation;
            -webkit-tap-highlight-color:transparent;
            outline-offset:2px;
          }

          .map-legend {
            display:flex;
            gap:17px;
            align-items:center;
            justify-content:center;
            flex-wrap:wrap;
            padding:9px 10px 10px;
            background:rgba(255,255,255,.02);
            border-top:1px solid rgba(255,255,255,.055);
            color:var(--b-muted);
            font-size:10px;
          }
          .legend-item { display:inline-flex;align-items:center;gap:6px;white-space:nowrap; }
          /* V4.07.54 – Legendenstruktur: Radien bilden nur im Hochformat eine
             feste zweite Zeile. Im Querformat bleiben beide Gruppen Bestandteil
             derselben Zeile. Keine Geraete-Sonderlogik, nur Ausrichtung. */
          .map-legend-group { display:contents; }
          @media (orientation:portrait) {
            .map-legend { flex-direction:column;flex-wrap:nowrap;row-gap:8px; }
            .map-legend-group {
              display:flex;
              width:100%;
              align-items:center;
              justify-content:center;
              gap:inherit;
            }
            .map-legend-primary { flex-wrap:wrap; }
            .map-legend-radii { flex-wrap:nowrap; }
          }
          .legend-dot {
            --legend-color:currentColor;
            width:6.7px;height:6.7px;border-radius:50%;display:inline-block;
            background:var(--legend-color);
            box-shadow:
              0 0 5px color-mix(in srgb,var(--legend-color) 72%,transparent),
              0 0 12px color-mix(in srgb,var(--legend-color) 30%,transparent),
              0 0 18px color-mix(in srgb,var(--legend-color) 11%,transparent);
          }
          .legend-line { width:16px;height:0;border-top:1px dashed currentColor;opacity:.9; }

          .strike-icon,
          .cluster-icon {
            background:transparent!important;
            border:0!important;
          }

          .strike-spark {
            --strike-color:${C.blue};
            width:18px;height:18px;
            display:grid;place-items:center;
            color:var(--strike-color);
            font-size:15px;
            font-weight:800;
            line-height:1;
            text-shadow:0 0 5px var(--strike-color),0 0 10px color-mix(in srgb,var(--strike-color) 45%,transparent);
            transform:translate(-1px,-1px);
          }
          .strike-spark.danger { font-size:17px; }

          .cluster-bubble {
            --cluster-color:${C.blue};
            position:relative;
            width:var(--cluster-size,34px);
            height:var(--cluster-size,34px);
            border-radius:50%;
            display:grid;
            place-items:center;
            color:#fff;
            font-size:11px;
            font-weight:880;
            border:1px solid color-mix(in srgb,var(--cluster-color) 74%,white 26%);
            background:radial-gradient(circle at 36% 30%,color-mix(in srgb,var(--cluster-color) 36%,white 7%),rgba(10,13,18,.88) 58%,rgba(6,8,12,.96));
            box-shadow:0 0 10px color-mix(in srgb,var(--cluster-color) 42%,transparent),0 0 24px color-mix(in srgb,var(--cluster-color) 16%,transparent);
            backdrop-filter:blur(3px);
            isolation:isolate;
          }
          .cluster-bubble::before {
            content:'';
            position:absolute;
            inset:-8px;
            z-index:-1;
            opacity:.72;
            background:
              radial-gradient(circle at 15% 33%,var(--cluster-color) 0 1.2px,transparent 1.8px),
              radial-gradient(circle at 82% 24%,var(--cluster-color) 0 1px,transparent 1.7px),
              radial-gradient(circle at 93% 65%,var(--cluster-color) 0 1.1px,transparent 1.8px),
              radial-gradient(circle at 31% 91%,var(--cluster-color) 0 1px,transparent 1.7px),
              radial-gradient(circle at 7% 75%,var(--cluster-color) 0 .9px,transparent 1.6px);
            filter:drop-shadow(0 0 3px var(--cluster-color));
          }
          /* V3.985 – zusätzliche weiche Aura. Sie ergänzt die vorhandenen
             Lichtpunkte, ohne die Cluster zu größeren Leuchtblasen zu machen. */
          .cluster-bubble::after {
            content:'';
            position:absolute;
            inset:-12px;
            z-index:-2;
            border-radius:50%;
            background:radial-gradient(circle,
              color-mix(in srgb,var(--cluster-color) 23%,transparent) 0 28%,
              color-mix(in srgb,var(--cluster-color) 10%,transparent) 46%,
              transparent 72%);
            filter:blur(3.5px);
            opacity:.78;
            pointer-events:none;
          }
          .cluster-bubble.extreme::after { opacity:.96; }
          .cluster-bubble.active::after { opacity:.90; }
          .cluster-bubble.extreme { box-shadow:0 0 12px rgba(179,92,255,.55),0 0 28px rgba(179,92,255,.20); }
          .cluster-bubble.active { box-shadow:0 0 12px rgba(246,195,68,.52),0 0 25px rgba(246,195,68,.18); }

          .panel {
            min-width:0;
            border-radius:17px;
            border:1px solid rgba(255,255,255,.075);
            background:linear-gradient(180deg,rgba(255,255,255,.038),rgba(255,255,255,.022));
            padding:14px;
          }

          .panel-title {
            color:var(--b-muted);
            font-size:9px;
            font-weight:850;
            letter-spacing:.14em;
            text-transform:uppercase;
            margin-bottom:11px;
          }

          /* V3.987 – Letzte Blitzaktivität bleibt ein klarer räumlicher
             Ereignis-Browser. Kein LIVE/LETZTE-Schalter mehr; dadurch bleibt
             die Überschrift auf dem normalen iPad frei und die Filterzeile ruhig. */
          .recent-panel-head {
            display:flex;
            align-items:center;
            justify-content:center;
            min-height:20px;
            margin:-1px 0 7px;
          }
          .recent-panel-head > .panel-title {
            margin:0;
            text-align:center;
            white-space:nowrap;
          }
          .recent-filter-stack {
            display:block;
            margin:0 0 5px;
          }
          .recent-filter-group.radius {
            display:grid;
            grid-template-columns:repeat(3,minmax(0,1fr));
            gap:3px;
            width:100%;
            box-sizing:border-box;
            padding:2px;
            border:1px solid rgba(255,255,255,.085);
            border-radius:10px;
            background:rgba(8,11,16,.40);
            box-shadow:inset 0 1px 0 rgba(255,255,255,.018);
          }
          .recent-filter-btn {
            --radius-filter-color:#7E8796;
            --radius-filter-dash:2px;
            --radius-filter-gap:3px;
            appearance:none;
            position:relative;
            min-width:0;
            height:26px;
            border:0;
            border-radius:8px;
            padding:0 4px 2px;
            display:flex;
            align-items:center;
            justify-content:center;
            overflow:hidden;
            background:transparent;
            color:color-mix(in srgb,var(--radius-filter-color) 82%,var(--b-muted) 18%);
            font-family:inherit;
            font-size:7px;
            font-weight:850;
            letter-spacing:.04em;
            line-height:1;
            text-transform:uppercase;
            white-space:nowrap;
            cursor:pointer;
            touch-action:manipulation;
            transition:background .18s ease,color .18s ease,box-shadow .18s ease,transform .10s ease;
          }
          .recent-filter-btn:hover { background:rgba(255,255,255,.028);color:var(--b-text2); }
          .recent-filter-btn:active { transform:scale(.97); }
          .recent-filter-btn::after {
            content:'';
            position:absolute;
            left:18%;
            right:18%;
            /* V3.988 – Strichkennung nur minimal näher an die Beschriftung.
               Der ruhige Segmentcharakter aus V3.987 bleibt erhalten. */
            bottom:4px;
            height:1px;
            border-radius:2px;
            background:repeating-linear-gradient(to right,
              var(--radius-filter-color) 0 var(--radius-filter-dash),
              transparent var(--radius-filter-dash) calc(var(--radius-filter-dash) + var(--radius-filter-gap)));
            opacity:.44;
            filter:drop-shadow(0 0 1.5px color-mix(in srgb,var(--radius-filter-color) 32%,transparent));
            pointer-events:none;
          }
          .recent-filter-btn.active {
            color:color-mix(in srgb,var(--radius-filter-color) 92%,white 8%);
            font-weight:900;
            /* V3.991 – Bedienknöpfe bewusst zurück auf die von der Geräteabnahme
               bevorzugte zurückhaltende V3.988-Halo-Stärke. Linien bleiben FINAL. */
            background:
              linear-gradient(180deg,
                color-mix(in srgb,var(--radius-filter-color) 13%,rgba(255,255,255,.045)),
                color-mix(in srgb,var(--radius-filter-color) 8%,rgba(255,255,255,.022)));
            box-shadow:
              inset 0 0 0 1px color-mix(in srgb,var(--radius-filter-color) 44%,transparent),
              inset 0 1px 0 color-mix(in srgb,var(--radius-filter-color) 20%,white 8%),
              0 0 12px color-mix(in srgb,var(--radius-filter-color) 11%,transparent);
            text-shadow:0 0 7px color-mix(in srgb,var(--radius-filter-color) 22%,transparent);
          }
          .recent-filter-btn.active::after {
            opacity:1;
            height:1.25px;
            filter:drop-shadow(0 0 3.5px color-mix(in srgb,var(--radius-filter-color) 72%,transparent));
          }
          .recent-radius-label { min-width:0;overflow:hidden;text-overflow:ellipsis; }
          .recent-context {
            min-height:14px;
            margin:0 0 5px;
            display:flex;
            align-items:center;
            justify-content:center;
            color:var(--b-muted);
            font-size:7.2px;
            line-height:1.2;
            text-align:center;
            white-space:normal;
          }

          /* V3.987 – eigene Lage-/Spruchbühne direkt unter der Radarkarte.
             Der Spruch ist bewusst typografisch vom Messinstrument getrennt:
             warme Serifenschrift, darunter die sachliche technische Einordnung. */
          .weather-message-panel {
            --message-accent:${C.gold};
            position:relative;
            overflow:hidden;
            min-width:0;
            box-sizing:border-box;
            padding:13px 18px 12px;
            border-radius:16px;
            border:1px solid color-mix(in srgb,var(--message-accent) 34%,rgba(255,255,255,.10));
            background:
              radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--message-accent) 5%,transparent),transparent 34%),
              linear-gradient(180deg,rgba(9,17,25,.965),rgba(6,12,18,.95));
            box-shadow:
              inset 0 0 0 1px rgba(79,163,247,.075),
              inset 0 1px 0 rgba(255,255,255,.02),
              0 8px 22px rgba(0,0,0,.24);
          }
          .weather-message-panel::before,
          .weather-message-panel::after {
            content:'';
            position:absolute;
            left:50%;
            width:5px;height:2px;
            transform:translateX(-50%);
            border-radius:999px;
            background:#74C8FF;
            box-shadow:0 0 5px #4FA3F7,0 0 11px rgba(79,163,247,.48);
            opacity:.82;
            pointer-events:none;
          }
          .weather-message-panel::before { top:-1px; }
          .weather-message-panel::after { bottom:-1px; }
          .weather-message-panel.activity { --message-accent:${C.gold}; }
          .weather-message-panel.extreme { --message-accent:${C.purple}; }
          .weather-message-panel.storm { --message-accent:${C.blue}; }
          .weather-message-panel.danger { --message-accent:${C.danger}; }
          .weather-message-panel.calm { --message-accent:#8B96A7; }
          .weather-message-quote {
            margin:0;
            color:#F2DFC0;
            font-family:Georgia,Cambria,"Times New Roman",ui-serif,serif;
            font-size:clamp(16px,1.55vw,25px);
            font-weight:400;
            line-height:1.22;
            letter-spacing:-.012em;
            text-align:center;
            text-wrap:balance;
            text-shadow:0 1px 1px rgba(0,0,0,.68),0 0 10px rgba(214,163,55,.07);
          }
          .weather-message-context {
            display:flex;
            align-items:center;
            justify-content:center;
            gap:11px;
            margin-top:8px;
            color:#7893AA;
            font-size:8px;
            font-weight:650;
            line-height:1.15;
            letter-spacing:.045em;
            text-align:center;
          }
          .weather-message-context::before,
          .weather-message-context::after {
            content:'';
            flex:0 1 72px;
            max-width:72px;
            height:1px;
            background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--message-accent) 82%,#D4A72C));
            opacity:.8;
          }
          .weather-message-context::after { transform:scaleX(-1); }


          /* V3.9934 – globaler Aura-Schalter. AUS entfernt rein dekorative Glows
             möglichst weitgehend; EIN erhält die abgenommene Grundästhetik und
             ergänzt die Radius-Innenaura ausschließlich über SVG. */
          #card-root.aura-none .legend-dot,
          #card-root.aura-none .recent-dot { box-shadow:none!important; }
          #card-root.aura-none .cluster-bubble { box-shadow:none!important; }
          #card-root.aura-none .cluster-bubble::before,
          #card-root.aura-none .cluster-bubble::after { opacity:0!important;filter:none!important; }
          #card-root.aura-none .reference-position-marker::before,
          #card-root.aura-none .reference-position-marker::after,
          #card-root.aura-none .recent-marker span,
          #card-root.aura-none .recent-marker span::after,
          #card-root.aura-none .map-strike-target-glyph,
          #card-root.aura-none .map-strike-target-glyph::after { box-shadow:none!important; }
          #card-root.aura-none .strike-spark { text-shadow:none!important; }
          #card-root.aura-none .recent-filter-btn.active {
            box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--radius-filter-color) 40%,transparent)!important;
            text-shadow:none!important;
          }
          #card-root.aura-none .recent-filter-btn.active::after { filter:none!important; }

          /* Das Spruchfeld reserviert jetzt bewusst Platz für zwei Serifzeilen.
             Einzeiler bleiben durch flex-Zentrierung weiterhin ruhig mittig. */
          .weather-message-panel {
            min-height:76px;
            display:flex;
            flex-direction:column;
            justify-content:center;
          }
          .weather-message-quote { max-width:100%; }

          .recent-head,
          .recent-row {
            display:grid;
            grid-template-columns:20px minmax(72px,1fr) minmax(72px,1.05fr) minmax(64px,.82fr) 42px;
            gap:7px;
            align-items:center;
          }
          .recent-head {
            margin-bottom:5px;
            color:var(--b-muted);
            font-size:7.2px;
            font-weight:850;
            letter-spacing:.12em;
            text-transform:uppercase;
          }
          .recent-head span:first-child { opacity:0; }
          .recent-list { display:flex;flex-direction:column;gap:2px; }
          .recent-row {
            position:relative;
            min-height:27px;
            padding:3px 0;
            border-bottom:1px solid rgba(255,255,255,.035);
            color:var(--b-text2);
            font-size:9.5px;
          }
          .recent-row:last-child { border-bottom:0; }
          .recent-dot { width:7px;height:7px;border-radius:50%;display:block;box-shadow:0 0 7px currentColor; }
          .recent-direction { color:var(--b-text);font-weight:760;white-space:nowrap; }
          .recent-time { color:var(--b-text2);white-space:nowrap; }
          .recent-distance { color:var(--b-text);font-weight:720;white-space:nowrap; }
          .recent-marker {
            position:relative;
            left:-6px;
            display:flex;justify-content:center;align-items:center;
            min-width:24px;min-height:24px;
            border-radius:999px;cursor:pointer;touch-action:manipulation;
            transition:transform .16s ease,filter .16s ease,background .16s ease;
          }
          .recent-marker:hover {
            transform:none;
            filter:brightness(1.18);
            background:rgba(255,255,255,.028);
          }
          .recent-marker:active { transform:none;filter:brightness(1.34); }
          .recent-marker:focus-visible { outline:1px solid rgba(246,195,68,.62);outline-offset:1px; }
          /* Eigenes Geo-Zielsymbol: Ring + Leuchtpunkt, keine Fadenkreuzarme. */
          .recent-marker span,
          .recent-target-glyph {
            position:relative;
            width:11px;height:11px;
            box-sizing:border-box;
            border:1.15px solid currentColor;
            border-radius:50%;
            display:block;
            pointer-events:none;
            background:color-mix(in srgb,currentColor 4%,transparent);
            box-shadow:
              0 0 4px color-mix(in srgb,currentColor 62%,transparent),
              0 0 9px color-mix(in srgb,currentColor 18%,transparent);
          }
          .recent-marker span::after,
          .recent-target-glyph::after {
            content:'';
            /* V3.988 – vollständig von Font/Flex/Grid-Metriken entkoppelt.
               Absolutes 50/50-Zentrum beseitigt den letzten Desktop-Versatz. */
            position:absolute;
            left:50%;
            top:50%;
            width:4px;height:4px;
            transform:translate(-50%,-50%);
            border-radius:50%;
            background:currentColor;
            box-shadow:0 0 5px currentColor,0 0 8px color-mix(in srgb,currentColor 38%,transparent);
          }
          .recent-marker:hover span {
            border-color:currentColor;
            box-shadow:
              0 0 5px color-mix(in srgb,currentColor 76%,transparent),
              0 0 12px color-mix(in srgb,currentColor 28%,transparent);
          }
          @keyframes recentMarkerTapFlash {
            0% { filter:brightness(1);box-shadow:0 0 4px color-mix(in srgb,currentColor 62%,transparent),0 0 9px color-mix(in srgb,currentColor 18%,transparent); }
            45% { filter:brightness(1.45);box-shadow:0 0 7px currentColor,0 0 15px color-mix(in srgb,currentColor 36%,transparent); }
            100% { filter:brightness(1);box-shadow:0 0 4px color-mix(in srgb,currentColor 62%,transparent),0 0 9px color-mix(in srgb,currentColor 18%,transparent); }
          }
          .recent-marker.tap-flash span { animation:recentMarkerTapFlash .38s ease-out; }
          .recent-panel { min-height:0; }

          #recent-content { min-height:0; }
          .recent-empty { min-height:116px;display:flex;align-items:center;justify-content:center;text-align:center;color:var(--b-muted);font-size:10px; }
          /* V3.985 – HTML hidden muss unsere expliziten flex/grid-Regeln sicher
             überstimmen. Behebt den fälschlich sichtbaren Leertext und verhindert
             zugleich alte Restzeilen bei schrumpfender Trefferzahl. */
          .recent-head[hidden],
          .recent-list[hidden],
          .recent-row[hidden],
          .recent-empty[hidden] { display:none!important; }

          .compass-panel {
            min-height:0;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:flex-start;
            overflow:hidden;
            --compass-panel-inline-reserve:28px;
          }

          .compass-head {
            width:100%;
            min-height:50px;
            position:relative;
            display:block;
            align-items:start;
            column-gap:8px;
            margin-bottom:5px;
          }
          /* V3.553 – "Richtung" entfällt bewusst:
             A/B/C übernimmt links dessen Platz. Rechts bleiben die eigentlichen
             Betriebsfunktionen. Dadurch wird der Kompasskopf ruhiger und gewinnt
             auf dem kleineren iPad spürbar Breite. */
          .compass-design-left {
            flex:0 0 auto;
            position:absolute;
            left:50%;
            top:0;
            transform:translateX(-50%);
          }
          .compass-actions {
            display:flex;
            flex-direction:column;
            gap:4px;
            align-items:stretch;
            justify-content:flex-start;
            flex-wrap:nowrap;
            min-width:0;
            position:absolute;
            right:0;
            top:0;
          }
          .compass-actions .warning-test-mini {
            width:68px;
            min-height:23px;
            padding:0 5px;
          }
          .compass-corner-controls { width:min(calc(430px * var(--compass-visual-stage-scale,1)),calc(100% - var(--compass-panel-inline-reserve)));display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;gap:12px;margin-top:12px;transform:translateY(-8px); }
          .compass-corner-controls .compass-button:first-child { justify-self:start; }
          .compass-corner-controls .compass-button:last-child { justify-self:end; }

          .compass-button {
            display:inline-flex;
            align-items:center;
            gap:6px;
            min-height:31px;
            padding:0 10px;
            border-radius:10px;
            border:1px solid rgba(79,163,247,.22);
            background:linear-gradient(180deg,rgba(79,163,247,.075),rgba(79,163,247,.035));
            color:var(--b-text2);
            cursor:pointer;
            font-size:8px;
            font-weight:800;
            white-space:nowrap;
            transition:background .17s ease,border-color .17s ease,color .17s ease,box-shadow .17s ease,opacity .17s ease;
            box-shadow:inset 0 1px 0 rgba(255,255,255,.025);
          }
          .compass-button:hover { background:rgba(79,163,247,.095); }
          .compass-button.active {
            color:#e6f1ff;
            border-color:rgba(79,163,247,.52);
            background:rgba(79,163,247,.13);
            box-shadow:inset 0 0 14px rgba(79,163,247,.055),0 0 12px rgba(79,163,247,.045);
          }
          .compass-button.device {
            border-color:rgba(246,195,68,.27);
            background:linear-gradient(180deg,rgba(246,195,68,.065),rgba(246,195,68,.028));
          }
          .compass-button.device.active {
            color:#fff0b3;
            border-color:rgba(246,195,68,.58);
            background:rgba(246,195,68,.12);
            box-shadow:inset 0 0 14px rgba(246,195,68,.055),0 0 13px rgba(246,195,68,.05);
          }
          .compass-button.unavailable {
            display:inline-flex;
            opacity:.42;
            cursor:not-allowed;
            filter:saturate(.35);
          }
          .compass-button .mini-label { color:inherit; }
          .compass-button .sensor-dot {
            width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.5;
            box-shadow:0 0 7px currentColor;
          }
          .compass-button.active .sensor-dot { opacity:1; }

          /* Dekorativer Rahmen; Navigation und Zaehler bleiben echtes HTML. */
          .compass-design-switch {
            position:relative;
            display:block;
            width:150px;
            height:50px;
            aspect-ratio:3 / 1;
            padding:0;
            box-sizing:border-box;
            flex:0 0 150px;
            transform:none;
            transition:none;
          }
          .compass-design-switch.compass-design-left { transform:translateX(-50%); }
          .compass-selector-frame-image {
            position:absolute;
            inset:0;
            z-index:0;
            width:100%;
            height:100%;
            object-fit:contain;
            pointer-events:none;
            user-select:none;
            -webkit-user-drag:none;
            opacity:0;
          }
          .compass-design-switch.asset-loaded .compass-selector-frame-image {
            opacity:1;
          }
          .compass-design-button {
            position:absolute;
            top:6px;
            z-index:1;
            width:38px;
            height:38px;
            padding:0;
            border:0;
            background:transparent;
            color:transparent;
            font:800 8px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
            cursor:pointer;
            box-shadow:none;
            filter:none;
            outline:none;
            -webkit-tap-highlight-color:transparent;
            touch-action:manipulation;
          }
          .compass-design-button:first-of-type { left:6px; }
          .compass-design-button:last-of-type { right:6px; }
          .compass-design-button:hover,
          .compass-design-button:active,
          .compass-design-button:focus,
          .compass-design-button:focus-visible {
            border:0;
            background:transparent;
            box-shadow:none;
            filter:none;
            outline:none;
            transform:none;
          }
          .compass-design-button:disabled { opacity:1;cursor:default; }
          .compass-design-fallback-arrow { visibility:hidden; }
          .compass-design-switch.asset-error .compass-design-fallback-arrow {
            visibility:visible;
            color:#fff0b2;
            text-shadow:0 0 7px rgba(246,195,68,.42);
          }
          .compass-design-switch.asset-css {
            border:0;
            background:transparent;
            box-shadow:none;
          }
          .compass-design-switch.asset-css::before {
            content:'';
            position:absolute;
            z-index:0;
            left:8px;
            right:8px;
            top:50%;
            height:28px;
            box-sizing:border-box;
            transform:translateY(-50%);
            border:1px solid rgba(246,195,68,.38);
            border-radius:6px;
            background:linear-gradient(180deg,rgba(246,195,68,.04),rgba(4,7,11,.70));
            box-shadow:inset 0 1px rgba(255,255,255,.03);
            pointer-events:none;
          }
          .compass-design-switch.asset-css .compass-design-fallback-arrow { visibility:visible;color:#fff0b2;text-shadow:none; }
          .compass-design-index { position:absolute;z-index:1;left:50%;top:50%;width:58px;height:24px;transform:translate(-50%,-50%);display:grid;place-items:center;color:#fff0b2;text-align:center;font:560 11px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-variant-numeric:tabular-nums;letter-spacing:.045em;text-shadow:0 1px 2px #000;pointer-events:none; }

          .compass-wrap {
            width:100%;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            position:relative;
            padding:3px 0 0;
          }

          /* Mittlere reale Kartenbreite: der komplette quadratische Instrument-
             Wrapper waechst gemeinsam, ohne eine Designkalibrierung zu aendern. */
          @container gewitterradar-shell (min-width:721px) and (max-width:960px) {
            .compass-panel { padding-left:14px;padding-right:14px; }
            /* The complete transformed stage is capped by field C's own content
               width. 94.3396% is the reciprocal of the largest preserved outer
               stage scale (D: 1.060), so no design can create horizontal scroll. */
            .compass-panel .compass-instrument { width:min(464px,94.3396%); }
            .compass-panel .compass-corner-controls { width:min(464px,calc(100% - var(--compass-panel-inline-reserve))); }
          }

          /* Normal iPad only: the later generic selector-box rule changes the
             selector back to relative positioning. Pin it to the complete
             field-C header instead, independent of the right action stack. */
          @container gewitterradar-shell (min-width:721px) and (max-width:1100px) {
            #card-root.ipad-device .compass-design-switch.compass-design-left {
              position:absolute;
              left:50%;
              right:auto;
              margin-inline:0;
              transform:translateX(-50%);
            }
          }

          /* V3.41 – externe Metalleinfassung:
             Das bestehende finale SVG bleibt vollständig unverändert.
             Die PNG-Einfassung liegt als eigene Ebene darüber; durch die transparente
             Mitte bleibt das Instrument sichtbar. */
          .compass-instrument {
            position:relative;
            width:min(430px,calc((100% - var(--compass-panel-inline-reserve)) / var(--compass-visual-stage-scale,1)));
            aspect-ratio:1 / 1;
            display:flex;
            align-items:center;
            justify-content:center;
            isolation:isolate;
            transform:scale(var(--compass-visual-stage-scale,1));
            transform-origin:50% 50%;
            filter:drop-shadow(0 22px 40px rgba(0,0,0,.58));

            /* V3.45:
               Kompasseinfassung_V2.png besitzt eine deutlich größere transparente
               Innenöffnung. Dadurch kann der finale Premium-Kompass nahezu wieder
               seine ursprüngliche Größe vor Einführung der Metalleinfassung erhalten.
               Nur ein sehr kleiner vertikaler Ausgleich bleibt bestehen. */
            --compass-dial-size:83.2%;
            --compass-dial-shift-x:0%;
            --compass-dial-shift-y:-0.35%;
          }

          /* Kompass-Kalibrierungsraster:
             Rein visuelles Debug-Overlay fuer A/B/C/D. Es wird ausschliesslich
             ueber den lokalen Kalibrierungsschalter aktiviert und veraendert
             weder Kompassgeometrie noch Assets. */
          #card-root.compass-calibration .compass-instrument::before,
          #card-root.compass-calibration .compass-instrument::after {
            position:absolute;
            inset:0;
            z-index:20;
            pointer-events:none;
            box-sizing:border-box;
          }

          /* 10-%-Raster, Mittelachsen und 45-Grad-Diagonalen.
             Das Quadrat markiert zugleich die exakte Instrument-Bounding-Box. */
          #card-root.compass-calibration .compass-instrument::before {
            content:"";
            border:1px solid rgba(74,197,255,.58);
            background:
              linear-gradient(
                45deg,
                transparent calc(50% - .55px),
                rgba(74,197,255,.42) calc(50% - .55px),
                rgba(74,197,255,.42) calc(50% + .55px),
                transparent calc(50% + .55px)
              ),
              linear-gradient(
                -45deg,
                transparent calc(50% - .55px),
                rgba(74,197,255,.42) calc(50% - .55px),
                rgba(74,197,255,.42) calc(50% + .55px),
                transparent calc(50% + .55px)
              ),
              linear-gradient(
                to right,
                transparent calc(50% - .75px),
                rgba(74,197,255,.88) calc(50% - .75px),
                rgba(74,197,255,.88) calc(50% + .75px),
                transparent calc(50% + .75px)
              ),
              linear-gradient(
                to bottom,
                transparent calc(50% - .75px),
                rgba(74,197,255,.88) calc(50% - .75px),
                rgba(74,197,255,.88) calc(50% + .75px),
                transparent calc(50% + .75px)
              ),
              repeating-linear-gradient(
                to right,
                rgba(74,197,255,.22) 0 1px,
                transparent 1px 10%
              ),
              repeating-linear-gradient(
                to bottom,
                rgba(74,197,255,.22) 0 1px,
                transparent 1px 10%
              );
          }

          /* Konzentrische 10-%-Radien plus Zentrumspunkt.
             Die Beschriftung zeigt Rasterweite und aktives Design. */
          #card-root.compass-calibration .compass-instrument::after {
            content:"";
            display:block;
            border-radius:50%;
            background:
              radial-gradient(
                circle at 50% 50%,
                rgba(151,224,255,.98) 0 2px,
                transparent 3px
              ),
              repeating-radial-gradient(
                circle closest-side at 50% 50%,
                transparent 0 calc(10% - .7px),
                rgba(74,197,255,.30) calc(10% - .7px) 10%
              );
          }

          .compass-calibration-readout {
            display:none;
            position:absolute;
            left:7px;
            right:7px;
            bottom:7px;
            z-index:21;
            pointer-events:none;
            color:rgba(151,224,255,.98);
            font:700 9px/1.25 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
            letter-spacing:.035em;
            text-align:center;
            text-shadow:0 1px 3px rgba(0,0,0,.95);
            white-space:pre-line;
          }
          #card-root.compass-calibration .compass-calibration-readout { display:block; }

          .compass-calibration-button {
            display:none;
            margin:8px auto 0;
            min-height:40px;
            padding:8px 17px;
            border:1px solid rgba(74,197,255,.55);
            border-radius:999px;
            background:rgba(5,15,23,.92);
            color:#97e0ff;
            font:820 12px/1 system-ui,sans-serif;
            letter-spacing:.075em;
            cursor:pointer;
            align-items:center;
            gap:8px;
            box-shadow:inset 0 1px rgba(255,255,255,.08),0 0 13px rgba(74,197,255,.13);
            transition:transform .14s ease,border-color .14s ease,box-shadow .14s ease,background .14s ease;
          }
          #card-root.compass-calibration .compass-calibration-button { display:inline-flex; }
          .compass-calibration-button:hover { border-color:rgba(246,195,68,.7);background:rgba(9,24,35,.96);box-shadow:inset 0 1px rgba(255,255,255,.1),0 0 16px rgba(74,197,255,.24); }
          .compass-calibration-button:active { transform:translateY(1px) scale(.985); }
          .compass-calibration-button:focus-visible { outline:2px solid #4fa3f7;outline-offset:3px; }
          .compass-calibration-button-icon { width:20px;height:20px;display:block;flex:0 0 20px;filter:drop-shadow(0 0 4px rgba(79,163,247,.42)); }
          .compass-calibration-button-label { white-space:nowrap; }
          .compass-calibration-launchers { display:none;position:relative;align-items:center;justify-content:center;gap:7px;margin:9px auto 0; }
          #card-root.compass-calibration .compass-calibration-launchers { display:flex; }
          #card-root.compass-calibration .compass-calibration-button { display:inline-flex;margin:0; }
          .compass-calibration-options-button { width:40px;height:40px;display:grid;place-items:center;border:1px solid rgba(246,195,68,.52);border-radius:10px;background:rgba(5,15,23,.92);color:#f6c344;font-size:18px;cursor:pointer;box-shadow:0 0 12px rgba(246,195,68,.1); }
          .compass-calibration-options-button:hover { border-color:#4fa3f7;color:#9bd7ff; }
          .compass-calibration-options-button:focus-visible { outline:2px solid #4fa3f7;outline-offset:3px; }
          .compass-calibration-quick { display:none;position:fixed;z-index:10040;width:min(360px,calc(100vw - 24px));max-height:calc(100dvh - 24px);overflow-y:auto;overscroll-behavior:contain;box-sizing:border-box;padding:12px;border:1px solid rgba(79,163,247,.5);border-radius:12px;background:rgba(5,14,22,.985);box-shadow:0 18px 46px rgba(0,0,0,.68);transform:none; }
          .compass-calibration-quick.open { display:block; }
          .compass-calibration-quick.mobile-sheet { width:calc(100vw - 24px);max-height:70dvh;border-radius:16px 16px 10px 10px; }
          .compass-calibration-quick-head { display:flex;align-items:center;gap:10px;position:sticky;top:-12px;z-index:2;margin:-12px -12px 0;padding:12px 12px 8px;background:rgba(5,14,22,.985); }
          .compass-calibration-overlay-title { color:#9bd7ff;font-size:11px;font-weight:850;letter-spacing:.09em;text-transform:uppercase; }
          .compass-calibration-quick-close { margin-left:auto;width:44px;height:44px;min-width:44px;display:grid;place-items:center;border:1px solid rgba(151,224,255,.42);border-radius:9px;background:#101e29;color:#e7f7ff;font:700 24px/1 system-ui,sans-serif;cursor:pointer;touch-action:manipulation; }
          .compass-calibration-quick-close:hover { border-color:#f6c344;color:#f6c344; }
          .compass-calibration-quick-close:focus-visible { outline:2px solid #4fa3f7;outline-offset:2px; }
          .compass-calibration-overlay-note { margin:6px 0 10px;padding:8px;border-left:3px solid #f6c344;background:rgba(246,195,68,.07);font-size:10px;line-height:1.35;color:#d9e7ef; }
          .compass-calibration-presets { display:flex;flex-wrap:wrap;gap:6px;margin:8px 0; }
          .compass-calibration-preset { flex:1 1 82px;border:1px solid rgba(151,224,255,.32);border-radius:7px;background:#101e29;color:#dceef7;padding:7px;font-size:9px;font-weight:800;cursor:pointer; }
          .compass-calibration-info { margin-left:auto;border:0;background:transparent;color:#87cfff;cursor:pointer;font-size:13px; }
          .compass-calibration-info:focus-visible { outline:1px solid #4fa3f7;border-radius:50%; }
          .compass-calibration-overlay { position:absolute;inset:0;width:100%;height:100%;box-sizing:border-box;z-index:19;pointer-events:none;overflow:visible; }
          .compass-calibration-modal-backdrop { display:none;position:fixed;inset:0;z-index:10020;background:rgba(0,0,0,.78);padding:clamp(8px,2vw,24px);align-items:center;justify-content:center; }
          .compass-calibration-modal-backdrop.open { display:flex; }
          .compass-calibration-modal { width:min(880px,100%);max-height:min(92vh,920px);overflow:auto;border:1px solid rgba(74,197,255,.42);border-radius:16px;background:#071018;color:#dceaf2;box-shadow:0 24px 80px #000;padding:16px; }
          .compass-calibration-modal { overflow-anchor:none; }
          .compass-calibration-modal-head { display:flex;justify-content:space-between;gap:12px;align-items:center;position:sticky;top:-16px;z-index:2;background:#071018;padding:12px 0 10px; }
          .compass-calibration-modal h2 { margin:0;color:#97e0ff;font-size:16px; }
          .compass-calibration-close,.compass-calibration-copy { border:1px solid rgba(151,224,255,.4);border-radius:8px;background:#101e29;color:#e7f7ff;padding:8px 11px;cursor:pointer;min-width:150px; }
          .compass-calibration-feedback { min-height:18px;color:#97e0ff;font-size:11px;margin:2px 0 8px; }
          .compass-calibration-report { white-space:pre-wrap;font:600 11px/1.48 ui-monospace,SFMono-Regular,Consolas,monospace;background:#03090e;border-radius:10px;padding:12px;overflow-wrap:anywhere;user-select:text;-webkit-user-select:text;pointer-events:auto;cursor:text; }
          .compass-calibration-actions { display:flex;flex-wrap:wrap;gap:8px;margin:12px 0; }
          .compass-calibration-ring-controls { display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:6px;margin:10px 0; }
          .compass-calibration-ring-controls label { display:flex;gap:7px;align-items:center;font-size:11px; }
          .compass-calibration-ring-row { display:grid;grid-template-columns:auto 1fr auto;gap:7px;align-items:center;font-size:11px; }
          .compass-calibration-ring-help { display:none;grid-column:1/-1;padding:6px 8px;border-radius:6px;background:rgba(79,163,247,.08);color:#bcd3df;font-size:9.5px;line-height:1.35; }
          .compass-calibration-ring-help.open { display:block; }

          .compass-calibration-target {
            display:none;
            position:absolute;
            z-index:19;
            pointer-events:none;
            box-sizing:border-box;
            border:2px dashed rgba(255,80,94,.96);
            border-radius:50%;
            box-shadow:0 0 0 1px rgba(0,0,0,.7),0 0 10px rgba(255,80,94,.72);
          }
          #card-root.compass-calibration .compass-calibration-target.measured { display:block; }

          #compass {
            position:relative;
            z-index:1;
            width:var(--compass-dial-size);
            height:auto;
            overflow:visible;
            transform:translate(var(--compass-dial-shift-x),var(--compass-dial-shift-y));
            transform-origin:50% 50%;
            filter:drop-shadow(0 14px 26px rgba(0,0,0,.52));
          }

          .compass-aperture-backing {
            display:none;
            position:absolute;
            z-index:0;
            left:calc(50% - .13%);
            top:calc(50% - 1.26%);
            width:calc(84.81% + 4px);
            aspect-ratio:1 / 1;
            transform:translate(-50%,-50%);
            border-radius:50%;
            pointer-events:none;
            background:radial-gradient(circle at 39% 31%,#303844 0%,#222934 20%,#121720 50%,#090c11 77%,#030507 100%);
          }
          .compass-instrument.design-b .compass-aperture-backing { display:block; }
          .compass-instrument.design-d .compass-aperture-backing {
            display:block;
            left:49.92%;
            top:48.09%;
            width:calc(66.51% + 4px);
          }
          /* Candidate 05/06 use the real SVG dial face as aperture cover. A
             separate backing hid fit errors and made the calibration pass
             without proving congruence of the visible dial layers. */
          .compass-instrument.design-candidate-05 #compass-dial-face { r:125.30px; }
          .compass-instrument.design-candidate-06 #compass-dial-face { r:125.02px; }

          .compass-metal-frame {
            position:absolute;
            inset:0;
            z-index:3;
            width:100%;
            height:100%;
            object-fit:contain;
            display:block;
            pointer-events:none;
            user-select:none;
            -webkit-user-drag:none;
            filter:
              drop-shadow(0 12px 16px rgba(0,0,0,.52))
              drop-shadow(0 0 8px rgba(212,167,44,.06));
          }

          /* Kompass A – ursprünglicher finaler Premium-Kompass ohne Einfassung */
          .compass-instrument.design-a {
            --compass-dial-size:min(360px,98%);
            --compass-dial-shift-x:0%;
            --compass-dial-shift-y:0%;
            filter:none;
          }
          .compass-instrument.design-a #compass {
            filter:drop-shadow(0 20px 38px rgba(0,0,0,.62));
          }
          .compass-instrument.design-a .compass-metal-frame {
            display:none;
          }

          /* Kompass B – Kompasseinfassung V2
             V3.99404: getrennte Kalibrierung anhand der realen transparenten
             PNG-Öffnung. Der Gradkranz wird moderat verkleinert und horizontal/
             vertikal auf den Mittelpunkt der Öffnung gelegt. */
          /* Kreisrunder V2-Rahmen: vermessener Desktop-/Tablet-Teststand ohne
             Kompensation der frueher ovalen bzw. versetzten Rahmengeometrie. */
          .compass-instrument.design-b {
            --compass-dial-size:87.2%;
            --compass-dial-shift-x:0.05%;
            --compass-dial-shift-y:-0.05%;
            height:auto;
            aspect-ratio:1 / 1;
            flex:0 0 auto;
          }
          /* Kompass B: Frame und SVG teilen denselben quadratischen Instrument-
             Wrapper. Die zweite Bildachse wird nicht separat auf 100% gestreckt,
             sondern folgt der Breite und dem quadratischen Seitenverhaeltnis. */
          .compass-instrument.design-b .compass-metal-frame {
            inset:0 auto auto 0;
            width:100%;
            height:auto;
            aspect-ratio:1 / 1;
            object-fit:contain;
          }
          .compass-instrument.design-b #compass-outer-housing {
            display:none;
          }

          /* Kompass C – Metalleinfassung V1
             V3.99404: eigene Kalibrierung; V1 und V2 werden bewusst nicht mehr
             mit derselben Geometrie behandelt. */
          .compass-instrument.design-c {
            --compass-dial-size:74.0%;
            --compass-dial-shift-x:-0.08%;
            --compass-dial-shift-y:-1.30%;
          }

          /* Kompass D – runde Metalleinfassung V3. Konservativer Startwert
             anhand der transparenten 1254-px-Assetoeffnung; nur D-spezifisch. */
          .compass-instrument.design-d {
            --compass-dial-size:88.0%;
            --compass-dial-shift-x:-0.09%;
            --compass-dial-shift-y:-2.18%;
            height:auto;
            aspect-ratio:1 / 1;
            flex:0 0 auto;
          }
          .compass-instrument.design-d .compass-metal-frame {
            inset:0 auto auto 0;
            width:100%;
            height:auto;
            aspect-ratio:1 / 1;
            object-fit:contain;
          }
          .compass-instrument.design-candidate-05 {
            --compass-dial-size:71.4%;
            --compass-dial-shift-x:-0.03%;
            --compass-dial-shift-y:-2.96%;
            --compass-inner-rose-scale:1.090;
            height:auto;
            aspect-ratio:1 / 1;
            flex:0 0 auto;
          }
          .compass-instrument.design-candidate-05 .compass-inner-rose-art {
            transform-box:view-box;
            transform-origin:140px 140px;
            transform:scale(var(--compass-inner-rose-scale));
          }
          .compass-instrument.design-candidate-06 {
            --compass-dial-size:74.8%;
            --compass-dial-shift-x:-0.08%;
            --compass-dial-shift-y:-2.52%;
            height:auto;
            aspect-ratio:1 / 1;
            flex:0 0 auto;
          }
          .compass-instrument.design-candidate-05 .compass-metal-frame,
          .compass-instrument.design-candidate-06 .compass-metal-frame {
            inset:0 auto auto 0;
            width:100%;
            height:auto;
            aspect-ratio:1 / 1;
            object-fit:contain;
          }
          .selector-frame-test { display:inline-grid;grid-template-columns:32px 58px 32px;align-items:center;gap:4px; }
          .selector-frame-test button { width:32px;height:30px;border:1px solid rgba(151,224,255,.34);border-radius:7px;background:#101e29;color:#e7f7ff;cursor:pointer; }
          .selector-frame-test-output { text-align:center;color:#97e0ff;font:800 9px/1 system-ui,sans-serif; }
          .settings-selector-preview { margin:7px 0 7px auto; }

          .compass-readout {
            margin-top:-4px;
            display:flex;
            align-items:baseline;
            justify-content:center;
            gap:9px;
            font-size:28px;
            font-weight:860;
            color:var(--b-gold);
            letter-spacing:-.03em;
            min-height:34px;
          }
          .compass-readout .cardinal { color:var(--b-text2);font-size:.72em;font-weight:700; }
          .compass-readout-separator {
            display:inline-block;
            margin:0 .34em;
            color:#6f7885;
            font-size:.42em;
            font-weight:700;
            line-height:1;
            transform:translateY(-.08em);
            opacity:.72;
            text-shadow:none;
          }
          .compass-caption {
            min-height:12px;
            margin-top:2px;
            color:var(--b-muted);
            font-size:7.7px;
            letter-spacing:.10em;
            text-transform:uppercase;
            text-align:center;
          }
          .compass-status-legend {
            width:100%;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:13px;
            flex-wrap:wrap;
            margin-top:8px;
            color:var(--b-muted);
            font-size:7.4px;
          }
          .compass-status-item { display:inline-flex;align-items:center;gap:5px;opacity:.52;transition:opacity .2s ease,color .2s ease,text-shadow .2s ease; }
          .compass-status-item.current { opacity:1;color:var(--b-text2);text-shadow:0 0 9px currentColor; }
          .compass-status-dot { width:6px;height:6px;border-radius:50%;border:1px solid currentColor;box-shadow:0 0 7px currentColor; }

          .compass-chips {
            width:100%;
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:8px;
            margin-top:11px;
          }
          .compass-chip {
            text-align:center;
            border:1px solid rgba(255,255,255,.07);
            border-radius:12px;
            background:linear-gradient(180deg,rgba(255,255,255,.032),rgba(255,255,255,.018));
            padding:8px;
            box-shadow:inset 0 1px 0 rgba(255,255,255,.018);
          }
          .chip-label { display:block;color:var(--b-muted);font-size:7px;font-weight:850;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px; }
          .chip-value { font-size:12px;font-weight:850; }

          .history-panel { padding:10px 12px 8px; min-height:0; overflow:hidden; }
          .history-layout {
            display:grid;
            grid-template-columns:minmax(0,1fr) 184px;
            gap:13px;
            align-items:stretch;
          }
          .history-main { min-width:0;display:flex;flex-direction:column; }
          .history-head { display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin:0 0 0 2px; }
          .history-head .panel-title { margin-bottom:3px; }
          .history-sub { color:#707988;font-size:7px;letter-spacing:.014em; }
          .history-chart { width:100%;height:112px;display:block;overflow:visible;filter:drop-shadow(0 0 12px rgba(44,112,255,.05)); }
          .chart-grid { stroke:rgba(115,148,190,.12);stroke-width:.60;stroke-dasharray:1.1 2.8; }
          .chart-baseline { stroke:rgba(246,174,18,.38);stroke-width:.74; }
          .chart-now-line { stroke:rgba(130,175,240,.14);stroke-width:.60;stroke-dasharray:1.4 4.0; }
          .axis-label {
            fill:#9eacbf;
            /* V3.988 – etwas kleinere Achsenbeschriftung wirkt generell ruhiger
               und schafft auf dem normalen iPad mehr Luft zwischen -120/-90. */
            font-size:8px;
            font-weight:620;
            letter-spacing:.012em;
            font-family:inherit;
            text-rendering:geometricPrecision;
          }
          .bar { shape-rendering:geometricPrecision; } .bar-glow { shape-rendering:geometricPrecision; } .bar-aura { shape-rendering:geometricPrecision; }
          /* V3.546 – Leerzustand des Verlaufs:
             Die Meldung belegt die komplette noch freie Höhe zwischen Kopf und
             Footer. Kein SVG-Scaling, keine transform-Skalierung – der Text
             bleibt normaler HTML-Text und damit auf iPad/Desktop sauber lesbar. */
          .empty-chart {
            display:none;
            height:auto;
            min-height:0;
            flex:1 1 0;
            align-items:center;
            justify-content:center;
            box-sizing:border-box;
            padding:10px 14px;
            color:var(--b-muted);
            font-size:9.2px;
            line-height:1.40;
            text-align:center;
          }

          /* V3.22 – Tendenz aus zwei echten Grafik-Assets:
             1) freigestelltes Medaillon als Basis
             2) freigestellter Messingpfeil als drehbares Overlay.
             Dadurch bleibt die hochwertige Materialoptik auf Desktop, Tablet und Mobile identisch. */
          .trend {
            min-width:0;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            text-align:center;
            padding:3px 6px 3px 17px;
            border-left:1px solid rgba(255,255,255,.055);
            position:relative;
          }
          .trend::before {
            content:'';
            position:absolute;
            left:-1px;
            top:7%;
            bottom:7%;
            width:1px;
            background:linear-gradient(
              180deg,
              transparent,
              rgba(255,255,255,.075) 25%,
              rgba(207,161,75,.12) 52%,
              rgba(255,255,255,.045) 78%,
              transparent
            );
          }
          .trend .tlabel {
            display:block;
            color:#929aa8;
            font-size:8.1px;
            font-weight:870;
            letter-spacing:.17em;
            text-transform:uppercase;
            margin-bottom:9px;
          }

          .trend-icon {
            position:relative;
            transform:translateX(0.09765625%);
            width:132px;
            height:auto;
            aspect-ratio:1 / 1;
            min-width:0;
            min-height:0;
            max-width:100%;
            box-sizing:border-box;
            flex:0 0 auto;
            display:block;
            align-self:center;
            justify-self:center;
            border-radius:50%;
            isolation:isolate;
            filter:
              drop-shadow(0 7px 10px rgba(0,0,0,.46))
              drop-shadow(0 0 9px rgba(196,132,43,.10));
          }
          .medallion-calibration-overlay { display:none;position:absolute;inset:0;z-index:5;width:100%;height:100%;pointer-events:none;overflow:visible; }
          #card-root.medallion-calibration .medallion-calibration-overlay { display:block; }
          .medallion-calibration-launcher { display:none;margin:7px auto 0;border:1px solid rgba(74,197,255,.48);border-radius:8px;background:#081722;color:#97e0ff;padding:6px 9px;font:750 9px/1 system-ui,sans-serif;cursor:pointer; }
          #card-root.medallion-calibration .medallion-calibration-launcher { display:block; }
          .medallion-calibration-modal-backdrop { display:none;position:fixed;inset:0;z-index:10030;background:transparent;padding:10px;align-items:flex-start;justify-content:flex-end;pointer-events:none; }
          .medallion-calibration-modal-backdrop.open { display:flex; }
          .medallion-calibration-modal-backdrop.dock-left { justify-content:flex-start; }
          .medallion-calibration-modal { pointer-events:auto;width:min(560px,calc(100vw - 20px));max-height:calc(100dvh - 20px);overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;overflow-anchor:none;border:1px solid rgba(74,197,255,.42);border-radius:14px;background:rgba(7,16,24,.97);color:#dceaf2;box-shadow:0 16px 52px rgba(0,0,0,.68);padding:12px; }
          .medallion-calibration-modal-backdrop.free-position .medallion-calibration-modal { position:fixed; }
          .medallion-calibration-modal .compass-calibration-modal-head { cursor:move;touch-action:none;user-select:none;gap:6px; }
          .medallion-calibration-modal .compass-calibration-modal-head h2 { flex:1 1 150px;min-width:0; }
          .medallion-calibration-modal .compass-calibration-modal-head button { cursor:pointer;touch-action:manipulation;flex:0 0 auto; }
          .medallion-calibration-modal .compass-calibration-modal-head .compass-calibration-close { min-width:32px;width:auto;padding:5px 7px; }
          .medallion-window-state { margin-left:0;color:#74e9ff;font:800 8px/1.2 system-ui,sans-serif;white-space:nowrap;flex:0 0 auto; }
          .medallion-window-level { min-width:34px!important;padding:5px 7px!important;font-size:8px!important; }
          .medallion-calibration-modal-backdrop.compact .compass-calibration-actions,
          .medallion-calibration-modal-backdrop.compact .compass-calibration-feedback,
          .medallion-calibration-modal-backdrop.compact .compass-calibration-report { display:none; }
          .medallion-calibration-modal-backdrop.compact .medallion-calibration-modal { width:min(520px,calc(100vw - 20px));height:auto;overflow:hidden; }
          @media(max-width:620px) {
            .medallion-calibration-modal .compass-calibration-modal-head { flex-wrap:wrap; }
            .medallion-calibration-modal .compass-calibration-modal-head h2 { flex-basis:100%; }
          }
          .medallion-calibration-modal-backdrop.compact .medallion-diagnostic-controls { position:static;margin-bottom:0; }
          .medallion-calibration-modal-backdrop.collapsed .medallion-calibration-modal { width:auto;max-width:calc(100vw - 20px);height:auto;overflow:hidden;padding:7px 9px; }
          .medallion-calibration-modal-backdrop.collapsed .compass-calibration-actions,
          .medallion-calibration-modal-backdrop.collapsed .compass-calibration-feedback,
          .medallion-calibration-modal-backdrop.collapsed .compass-calibration-report,
          .medallion-calibration-modal-backdrop.collapsed .medallion-diagnostic-controls,
          .medallion-calibration-modal-backdrop.collapsed .medallion-window-full,
          .medallion-calibration-modal-backdrop.collapsed .medallion-window-collapse,
          .medallion-calibration-modal-backdrop.collapsed .medallion-window-dock { display:none; }
          /* V4.07.55 DIAG – Master indicator: existing diagnostic magenta, no geometry change. */
          ha-card.diagnostic-master-active { box-shadow:inset 0 0 0 1px rgba(255,62,174,.85),0 22px 60px rgba(0,0,0,.32); }
          ha-card.diagnostic-master-active.danger-state { box-shadow:inset 0 0 0 1px rgba(255,62,174,.85),0 22px 60px rgba(0,0,0,.34),inset 0 0 36px rgba(255,51,71,.025); }
          .diagnostic-overlay { display:none;position:fixed;inset:0;z-index:10045;pointer-events:none;overflow:visible; }
          .diagnostic-overlay.active { display:block; }
          .diagnostic-overlay.coarse { background-image:linear-gradient(rgba(45,220,255,.24) 1px,transparent 1px),linear-gradient(90deg,rgba(45,220,255,.24) 1px,transparent 1px);background-size:10vw 10vh; }
          .diagnostic-overlay.fine { background-image:linear-gradient(rgba(64,255,162,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(64,255,162,.12) 1px,transparent 1px),linear-gradient(rgba(45,220,255,.30) 1px,transparent 1px),linear-gradient(90deg,rgba(45,220,255,.30) 1px,transparent 1px);background-size:2vw 2vh,2vw 2vh,10vw 10vh,10vw 10vh; }
          .diagnostic-console { display:none;position:fixed;left:12px;top:12px;z-index:10060;width:min(920px,calc(100vw - 24px));max-height:calc(100dvh - 24px);overflow:hidden;overscroll-behavior:contain;border:1px solid rgba(255,68,178,.66);border-radius:12px;background:rgba(5,12,20,.97);color:#dceaf2;box-shadow:0 18px 60px rgba(0,0,0,.7);font:600 10px/1.35 system-ui,sans-serif; }
          .diagnostic-console.open { display:flex;flex-direction:column; }
          .diagnostic-console.columns-1 { width:min(470px,calc(100vw - 24px)); }
          .diagnostic-console.minimized .diagnostic-console-body { display:none; }
          .diagnostic-console-head { position:relative;z-index:3;display:flex;flex:0 0 auto;align-items:center;gap:7px;padding:8px 10px;background:#0a1722;cursor:move;touch-action:none;border-bottom:1px solid rgba(255,68,178,.32); }
          .diagnostic-console-title { color:#ff62c6;font-weight:850;letter-spacing:.08em;text-transform:uppercase; }
          .diagnostic-console-state { margin-left:auto;color:#74e9ff;font-size:8px;text-align:right; }
          .diagnostic-console-head-actions { display:flex;align-items:center;gap:5px; }
          .diagnostic-column-toggle { display:flex;gap:2px; }
          .diagnostic-column-toggle button { min-width:25px;padding:5px; }
          .diagnostic-console-head #diagnostic-exit-top { border-color:rgba(255,87,108,.72);color:#ff9ba8;background:rgba(112,16,31,.3); }
          .diagnostic-console button { border:1px solid rgba(126,211,255,.34);border-radius:6px;background:#102432;color:#e8f7ff;padding:6px 8px;cursor:pointer;font:700 9px/1.2 system-ui,sans-serif; }
          .diagnostic-console button.active { border-color:#ff62c6;color:#ff9cda;background:rgba(255,68,178,.10); }
          .diagnostic-console #diagnostic-visuals { border-color:rgba(236,166,45,.72);color:#ffd57c;background:rgba(177,104,14,.18); }
          .diagnostic-console-body { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;padding:8px 8px 14px;min-height:0;max-height:none;box-sizing:border-box;overflow:auto;overscroll-behavior:contain;scroll-padding-bottom:14px;flex:1 1 auto; }
          .diagnostic-console.columns-1 .diagnostic-console-body { grid-template-columns:minmax(0,1fr); }
          .diagnostic-console-section { min-width:0;margin:0;padding:7px;border:1px solid rgba(255,255,255,.08);border-radius:8px; }
          .diagnostic-primary-section,.diagnostic-export-section,.diagnostic-master-stop { grid-column:1 / -1; }
          .diagnostic-primary-section { position:sticky;top:-8px;z-index:2;background:rgba(7,16,25,.98);box-shadow:0 5px 12px rgba(0,0,0,.34); }
          .diagnostic-console-section-title { margin-bottom:6px;color:#8edfff;font-size:9px;font-weight:850;letter-spacing:.08em;text-transform:uppercase; }
          .diagnostic-lab-group { grid-column:1 / -1;min-width:0;border:1px solid rgba(126,211,255,.14);border-radius:9px;background:rgba(4,12,19,.44);overflow:clip; }
          .diagnostic-lab-group > summary { list-style:none;display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:pointer;color:#9de9ff;font:850 9px/1.2 system-ui,sans-serif;letter-spacing:.07em;text-transform:uppercase;background:rgba(13,35,49,.72);user-select:none; }
          .diagnostic-lab-group > summary::-webkit-details-marker { display:none; }
          .diagnostic-lab-group > summary::before { content:'▸';color:#ff62c6;font-size:11px;transform-origin:center;transition:transform .16s ease; }
          .diagnostic-lab-group[open] > summary::before { transform:rotate(90deg); }
          .diagnostic-lab-group-body { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;padding:8px; }
          .diagnostic-lab-field { display:flex;align-items:center;gap:5px;min-width:0;color:#9cc9dc;font:800 8px/1 system-ui,sans-serif; }
          .diagnostic-lab-field select { min-width:0;max-width:150px;border:1px solid rgba(126,211,255,.34);border-radius:6px;background:#0b1b27;color:#e8f7ff;padding:5px 7px;font:700 9px/1.2 system-ui,sans-serif; }
          .diagnostic-lab-note,.diagnostic-cluster-browser-state { margin-top:6px;color:#b9d2df;font:650 8px/1.4 ui-monospace,monospace;white-space:pre-wrap; }
          .diagnostic-weather-lab-section,.diagnostic-cluster-browser-section { grid-column:1 / -1; }
          .diagnostic-virtual-storm-state { margin-top:6px;color:#b9d2df;font:650 8px/1.35 ui-monospace,monospace;white-space:pre-wrap; }
          .diagnostic-virtual-storm-config { display:flex;align-items:center;flex-wrap:wrap;gap:5px;margin-top:6px; }
          .diagnostic-virtual-storm-config-label { color:#9cc9dc;font:800 8px/1 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase; }
          .diagnostic-virtual-storm-count { min-width:24px;text-align:center;color:#e8f7ff;font:850 10px/1.2 ui-monospace,monospace; }
          .diagnostic-console .diagnostic-storm-step { min-width:27px;padding-left:7px;padding-right:7px; }
          .diagnostic-controls { display:flex;flex-wrap:wrap;gap:5px; }
          .diagnostic-calibration-controls { display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px; }
          .diagnostic-console button.diagnostic-calibration-tool { min-height:30px;background:#111820;color:#c7d0d6; }
          .diagnostic-console button.diagnostic-calibration-compass.active { border-color:#4ce9f5;color:#a9faff;background:rgba(15,142,155,.22);box-shadow:inset 0 0 0 1px rgba(76,233,245,.18),0 0 10px rgba(76,233,245,.20); }
          .diagnostic-console button.diagnostic-calibration-medallion.active { border-color:#be82ff;color:#dfbdff;background:rgba(116,55,174,.24);box-shadow:inset 0 0 0 1px rgba(190,130,255,.18),0 0 10px rgba(190,130,255,.20); }
          .diagnostic-readout { white-space:pre-wrap;user-select:text;margin:0;padding:7px;border-radius:6px;background:#02080d;color:#cde4ee;font:600 8px/1.35 ui-monospace,monospace;max-height:128px;overflow:auto; }
          .diagnostic-panel-badge { position:fixed;z-index:10048;pointer-events:none;padding:2px 5px;border-radius:4px;background:#ff3eae;color:#16000f;font:900 10px/1.2 system-ui,sans-serif;box-shadow:0 1px 4px #000; }
          .diagnostic-main-frame { position:fixed;z-index:10046;pointer-events:none;border:2px solid rgba(77,229,255,.82);box-sizing:border-box;box-shadow:inset 0 0 0 1px rgba(0,0,0,.42); }
          .diagnostic-main-title { position:fixed;z-index:10050;pointer-events:none;padding:2px 6px;border-radius:4px;background:#09202a;color:#73e9ff;border:1px solid rgba(77,229,255,.65);font:900 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;box-shadow:0 1px 4px #000; }
          .diagnostic-main-cell { position:fixed;z-index:10047;pointer-events:none;box-sizing:border-box;border-right:1px solid rgba(77,229,255,.34);border-bottom:1px solid rgba(77,229,255,.34);color:#aef4ff;font:800 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace;text-shadow:0 1px 2px #000,0 0 4px #001820;display:flex;align-items:flex-start;justify-content:flex-start;padding:3px 4px; }
          .diagnostic-overlay.fine .diagnostic-main-cell { background-image:linear-gradient(rgba(64,255,162,.10) 1px,transparent 1px),linear-gradient(90deg,rgba(64,255,162,.10) 1px,transparent 1px);background-size:20% 20%; }
          .diagnostic-panel-box { position:fixed;z-index:10047;pointer-events:none;border:1px solid rgba(255,62,174,.85);box-sizing:border-box; }
          .diagnostic-panel-box::before,.diagnostic-panel-box::after { content:'';position:absolute;background:rgba(60,221,255,.48); }
          .diagnostic-panel-box::before { left:50%;top:0;bottom:0;width:1px; }
          .diagnostic-panel-box::after { top:50%;left:0;right:0;height:1px; }
          .diagnostic-panel-box.selected { border-width:2px;border-color:#ffe15d; }
          .diagnostic-line,.diagnostic-rect,.diagnostic-dot,.diagnostic-label { position:fixed;z-index:10049;pointer-events:none;box-sizing:border-box; }
          .diagnostic-line { height:1px;background:#4de5ff;transform-origin:0 50%; }
          .diagnostic-line.vertical { width:1px;height:auto; }
          .diagnostic-line.diagonal { background:#a985ff; }
          .diagnostic-line.baseline { background:#ffcf52; }
          .diagnostic-line.alignment { height:2px;background:#ff5fc8; }
          .diagnostic-line.gap { height:2px;background:#ff9f43; }
          .diagnostic-rect { border:1px dashed #fff; }
          .diagnostic-rect.parent { border-color:#9aa8b3; }
          .diagnostic-rect.padding { border-color:#55e6a5;background:rgba(85,230,165,.05); }
          .diagnostic-rect.margin { border-color:#ff9f43;background:rgba(255,159,67,.04); }
          .diagnostic-rect.safe { border:2px dotted #4dffdf; }
          .diagnostic-rect.overflow { border:3px solid #ff4058;box-shadow:inset 0 0 0 1px #fff; }
          .diagnostic-dot { width:7px;height:7px;margin:-3px 0 0 -3px;border-radius:50%;background:#55efff;box-shadow:0 0 0 1px #001018; }
          .diagnostic-label { padding:2px 4px;border-radius:3px;background:#241307;color:#ffc17b;font:800 8px/1.2 ui-monospace,monospace; }
          .diagnostic-panel-table { white-space:pre;max-height:150px;overflow:auto;margin:6px 0 0;padding:7px;background:#02080d;color:#aee8ff;font:600 8px/1.35 ui-monospace,monospace; }
          .diagnostic-master-stop { width:100%;border-color:rgba(255,87,108,.72)!important;color:#ff9ba8!important;background:rgba(112,16,31,.3)!important; }
          @media (max-width:700px),(max-height:620px) {
            .diagnostic-console { left:6px;top:6px;width:calc(100vw - 12px);max-height:calc(100dvh - 12px); }
            .diagnostic-console-head { flex-wrap:wrap;cursor:default; }
            .diagnostic-console-state { order:2;margin-left:0;flex:1 1 100%;text-align:left; }
            .diagnostic-console-head-actions { margin-left:auto; }
            .diagnostic-console-head #diagnostic-visuals { max-width:132px;white-space:normal;padding:4px 6px; }
            .diagnostic-console-body { display:block;min-height:0;max-height:none;flex:1 1 auto; }
            .diagnostic-console-section { margin-bottom:8px; }
            .diagnostic-lab-group { margin-bottom:8px; }
            .diagnostic-lab-group-body { grid-template-columns:minmax(0,1fr); }
            .diagnostic-primary-section { top:-8px; }
          }
          .diagnostic-visuals-hidden .diagnostic-overlay,.diagnostic-visuals-hidden .diagnostic-panel-badge,.diagnostic-visuals-hidden .diagnostic-panel-box,.diagnostic-visuals-hidden .diagnostic-main-frame,.diagnostic-visuals-hidden .diagnostic-main-title,.diagnostic-visuals-hidden .diagnostic-main-cell,.diagnostic-visuals-hidden .diagnostic-line,.diagnostic-visuals-hidden .diagnostic-rect,.diagnostic-visuals-hidden .diagnostic-dot,.diagnostic-visuals-hidden .diagnostic-label,.diagnostic-visuals-hidden .compass-calibration-overlay,.diagnostic-visuals-hidden .medallion-calibration-overlay,.diagnostic-visuals-hidden .compass-calibration-launchers,.diagnostic-visuals-hidden .medallion-calibration-launcher { display:none!important; }
          .diagnostic-childtools-hidden { visibility:hidden!important;opacity:0!important;pointer-events:none!important; }
          .diagnostic-performance-backdrop { display:none;position:fixed;inset:0;z-index:10080;place-items:center;pointer-events:none;background:radial-gradient(circle,rgba(4,8,13,.20),rgba(0,0,0,.56)); }
          .diagnostic-performance-backdrop.open { display:grid; }
          .diagnostic-performance-backdrop.actions-ready { pointer-events:auto; }
          .diagnostic-performance-card { width:min(310px,calc(100vw - 32px));padding:24px 22px 20px;text-align:center;border:2px solid #c99b39;border-radius:20px;background:radial-gradient(circle at 50% 8%,rgba(255,231,158,.18),transparent 34%),linear-gradient(145deg,#302311,#110c05 54%,#241806);box-shadow:inset 0 2px 1px rgba(255,242,190,.42),inset 0 -5px 12px rgba(0,0,0,.72),0 0 0 4px rgba(85,57,13,.72),0 22px 70px rgba(0,0,0,.78);color:#f7d980;text-shadow:0 1px 0 #000,0 0 12px rgba(246,195,68,.25); }
          .diagnostic-performance-title { font:850 13px/1.2 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#f6d474; }
          .diagnostic-performance-countdown { margin:12px 0 7px;font:900 72px/.95 Georgia,serif;color:#ffe7a1;text-shadow:0 2px 0 #4b2e05,0 5px 8px #000,0 0 22px rgba(246,195,68,.42); }
          .diagnostic-performance-note { font:750 11px/1.3 system-ui,sans-serif;color:#cdb67c;letter-spacing:.06em; }
          .diagnostic-performance-backdrop.complete .diagnostic-performance-countdown { display:none; }
          .diagnostic-performance-backdrop.complete .diagnostic-performance-note { margin-top:14px;color:#ffe6a0;font-size:13px; }
          .diagnostic-performance-actions { display:flex;justify-content:center;gap:9px;max-height:0;margin-top:0;opacity:0;overflow:hidden;transform:translateY(6px) scale(.98);transition:opacity 220ms ease,transform 220ms ease,max-height 220ms ease,margin-top 220ms ease;pointer-events:none; }
          .diagnostic-performance-backdrop.actions-ready .diagnostic-performance-actions { max-height:44px;margin-top:18px;opacity:1;transform:translateY(0) scale(1);pointer-events:auto; }
          .diagnostic-performance-actions button { min-width:112px;padding:9px 12px;border:1px solid #c99b39;border-radius:8px;color:#ffe7a1;font:850 10px/1.1 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;box-shadow:inset 0 1px rgba(255,240,184,.30),inset 0 -3px 6px rgba(0,0,0,.46),0 3px 8px rgba(0,0,0,.42);text-shadow:0 1px #000; }
          .diagnostic-performance-download { background:linear-gradient(145deg,#275f38,#102819 58%,#224f30);border-color:#a8c86d!important; }
          .diagnostic-performance-cancel { background:linear-gradient(145deg,#681f28,#2b0c10 58%,#541821);border-color:#c88b62!important; }
          .diagnostic-performance-actions button:disabled { opacity:.45;cursor:default; }

          .trend-medallion-base,
          .trend-medallion-arrow {
            position:absolute;
            display:block;
            pointer-events:none;
            user-select:none;
            -webkit-user-drag:none;
          }

          .trend-medallion-base {
            inset:0;
            width:100%;
            height:100%;
            aspect-ratio:1 / 1;
            object-fit:contain;
            z-index:1;
          }

          /* Der Pfeil ist ein eigenes freigestelltes Asset.
             Die Grafik selbst zeigt in der Basis nach rechts-oben (↗). */
          .trend-medallion-arrow {
            left:50.012238%;
            top:50.452396%;
            width:59.667391%;
            height:59.667391%;
            object-fit:contain;
            z-index:3;
            transform-origin:50% 50%;
            opacity:1;
            filter:
              drop-shadow(0 2px 1px rgba(47,24,4,.82))
              drop-shadow(0 0 4px rgba(246,195,68,.18));
            /* V3.90 – deutlich ruhigere Instrumentenbewegung:
               Der Pfeil fährt jetzt weich und langsam zwischen zunehmend, stabil
               und abnehmend. Ein-/Ausblenden folgt ebenfalls langsamer, ohne die
               Tendenzlogik oder die drei Zielwinkel zu verändern. */
            transition:
              transform 1.65s cubic-bezier(.25,.10,.25,1),
              opacity .85s ease-in-out,
              filter .85s ease-in-out;
            will-change:transform,opacity;
          }

          /* Basis-Pfeil = ↗. Nur das Overlay dreht sich; das Medaillon bleibt unbewegt. */
          .trend.up .trend-medallion-arrow {
            opacity:1;
            transform:translate(-50%,-50%) rotate(0deg) scale(1);
          }
          .trend.stable .trend-medallion-arrow {
            opacity:1;
            transform:translate(-50%,-50%) rotate(45deg) scale(1);
          }
          .trend.down .trend-medallion-arrow {
            opacity:1;
            transform:translate(-50%,-50%) rotate(90deg) scale(1);
          }

          /* V3.50 – keine Blitzaktivität:
             Das Medaillon bleibt als ruhiges Instrument sichtbar, der Pfeil wird
             vollständig ausgeblendet. Beim nächsten Zustandswechsel blendet er
             weich ein und dreht gleichzeitig in die neue Tendenzrichtung. */
          .trend.none .trend-medallion-arrow {
            opacity:0;
            transform:translate(-50%,-50%) rotate(45deg) scale(.84);
            filter:
              drop-shadow(0 1px 1px rgba(47,24,4,.40))
              drop-shadow(0 0 0 rgba(246,195,68,0));
          }
          .trend.none .trend-icon {
            filter:
              drop-shadow(0 7px 10px rgba(0,0,0,.46))
              drop-shadow(0 0 5px rgba(196,132,43,.055));
          }
          .trend.none .tvalue {
            color:#9aa2ad;
            text-shadow:none;
          }

          .trend-copy {
            margin-top:8px;
            min-width:0;
          }
          .trend .tvalue {
            display:block;
            font-size:14px;
            font-weight:880;
            color:#F6C344;
            text-transform:capitalize;
            letter-spacing:-.014em;
            text-shadow:0 1px 0 rgba(71,37,6,.9),0 0 8px rgba(246,195,68,.10);
          }
          .trend .tsub {
            display:block;
            margin-top:3px;
            color:#7f8793;
            font-size:8.2px;
            line-height:1.25;
          }

          .trend.up .tvalue { color:#F6C344; }
          .trend.down .tvalue { color:#5FAAF7; }
          .trend.stable .tvalue { color:#c4c8ce; }

          .footer-row { display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:0;padding:4px 2px 0;border-top:1px solid rgba(255,255,255,.032);color:#666f7e;font-size:6.7px; }
          .footer-row strong { color:#a8b0bc; }

          @keyframes livePulse {
            0%{box-shadow:0 0 0 0 rgba(68,212,156,.45)}
            70%{box-shadow:0 0 0 7px rgba(68,212,156,0)}
            100%{box-shadow:0 0 0 0 rgba(68,212,156,0)}
          }

          /* V3.545 – Zweispaltenlayout ab 1101 px:
             KEINE prozentualen Höhen mehr an left-/side-stack. CSS Grid streckt
             beide Spalten selbst exakt auf dieselbe Zeilenhöhe. Die jeweils
             unteren Module werden per margin-top:auto an dieselbe Unterkante
             gebunden. Das vermeidet die verbleibenden 4–8 px Abweichungen auf
             iPad/iPad Pro durch intrinsische Bild-/Subpixelhöhen. */
          @media (min-width:1101px) {
            .main-grid {
              align-items:stretch;
            }

            .empty-chart {
              padding:12px 18px;
              font-size:9.4px;
              line-height:1.42;
            }

            .left-stack,
            .side-stack {
              align-self:stretch;
              height:auto;
            }

            /* V3.548:
               In JEDER Zweispaltenansicht wird der freie Rest der linken Spalte
               vom Verlaufspanel selbst aufgenommen. Damit bleibt der definierte
               Abstand von 10 px direkt unter der Karte konstant – unabhängig
               davon, ob die Home-Assistant-Seitenleiste ein- oder ausgeklappt ist.
               Der Kompass bleibt wie bisher an der gemeinsamen Unterkante. */
            .history-panel {
              margin-top:0;
              flex:1 1 auto;
              display:flex;
              flex-direction:column;
            }

            .compass-panel {
              margin-top:auto;
              flex:0 0 auto;
            }

            .history-layout {
              height:100%;
              min-height:0;
              flex:1 1 auto;
            }

            .history-main,
            .trend {
              min-height:0;
            }

            .history-main {
              height:100%;
            }

            .history-chart {
              height:auto;
              min-height:0;
              flex:1 1 0;
            }

            .recent-panel {
              flex:1 1 auto;
              display:flex;
              flex-direction:column;
            }
            #recent-content {
              flex:1 1 auto;
              display:flex;
              flex-direction:column;
            }
            .recent-list { flex:0 0 auto; }
            .recent-empty { flex:1 1 auto;min-height:148px; }
          }

          @media (min-width:1280px) {
            .trend-icon { width:138px;height:auto; }
            .hit-columns { padding-left:38px;padding-right:38px; }
          }

          /* V3.87 – normales iPad bei ausgeklappter HA-Seitenleiste.
             Die V3.75-Diagnose zeigte für diesen realen Zustand eine Shell-Breite
             von rund 922 px. Die alte 900-px-Grenze konnte daher gar nicht greifen.
             Ab jetzt gilt die Korrektur bis 960 px tatsächlicher Kartenbreite:
             - Verlauf bekommt mehr nutzbare Breite
             - Tendenzspalte wird bewusst schmaler
             - Medaillon/Pfeil werden moderat (~12 %) verkleinert
             - "TENDENZ" etwas höher, "Zunehmend / mehr Aktivität" etwas tiefer
             Mobile bleibt vollständig unberührt; iPad Pro/Desktop liegen regulär
             oberhalb dieser tatsächlichen Kartenbreite. */
          /* V3.88 – Verlauf auf dem normalen iPad nicht mehr in die volle
             Resthöhe zwingen. Genau das hohe/schmale SVG-Verhältnis war bei
             ausgeklappter HA-Seitenleiste die Ursache für die extrem gestreckte
             Achsenbeschriftung. Das PANEL bleibt unverändert hoch; nur das
             eigentliche dynamische SVG-Balkendiagramm wird niedriger.

             Aus den V3.87-Fotos ergibt sich: 25 % wären knapp, deshalb zielen wir
             im schmalen Sidebar-Zustand auf ca. 28–30 % weniger Diagrammhöhe.
             Ohne Sidebar wird nur moderat reduziert. Die freien Pixel werden über
             automatische Außenabstände verteilt, Footer und Panelunterkante
             bleiben dadurch an ihrer bisherigen Position. */
          @media (min-width:1101px) and (max-width:1250px) {
            .history-chart {
              flex:0 0 auto;
              height:clamp(220px,22cqw,250px);
              min-height:0;
              margin-top:auto;
              margin-bottom:auto;
            }

            @container gewitterradar-shell (max-width:960px) {
              .history-layout {
                grid-template-columns:minmax(0,1fr) 154px;
                gap:10px;
              }

              .history-chart {
                height:clamp(205px,26cqw,238px);
              }

              /* V3.988 – normales iPad + ausgeklappte HA-Seitenleiste:
                 beide Achsen bewusst kleiner. So kollidiert '-120 min' nicht
                 mehr mit '-90 min', ohne die SVG-Geometrie selbst anzufassen. */
              .axis-label {
                font-size:6.7px;
                letter-spacing:0;
              }

              .trend {
                padding:3px 2px 3px 10px;
              }

              .trend .tlabel {
                transform:translateY(-6px);
              }

              .trend-icon { width:116px;height:auto; }

              .trend-copy {
                transform:translateY(8px);
              }

              /* V3.99318 – ausschließlich normales iPad mit ausgeklappter
                 Home-Assistant-Seitenleiste. In diesem Zustand ist die reale
                 Kartenbreite ~840–960 px, obwohl der Viewport im Desktop-/Tablet-
                 Bereich bleibt. Die bisherige 2:1:1-Verteilung machte Gewitter-
                 und Gefahrenradius zu schmal, sodass Titel und [−][KM][+] kollidierten.
                 Nur auf iPad wird hier auf drei nahezu gleich breite Karten
                 umgestellt und die Bedienung minimal verdichtet. Alle anderen
                 Geräte/Ansichten bleiben unverändert. */
              #card-root.ipad-device .radius-grid {
                grid-template-columns:repeat(3,minmax(0,1fr));
                gap:8px;
              }
              #card-root.ipad-device .radius-card {
                padding:9px 8px 10px;
              }
              #card-root.ipad-device .radius-head {
                gap:6px;
              }
              #card-root.ipad-device .radius-title {
                font-size:7.2px;
                letter-spacing:.065em;
              }
              #card-root.ipad-device .radius-tools {
                gap:3px;
              }
              #card-root.ipad-device .radius-step {
                width:26px;
                height:26px;
                flex-basis:26px;
                font-size:14px;
              }
              #card-root.ipad-device .radius-value {
                min-width:62px;
                height:26px;
                padding-left:6px;
                padding-right:6px;
                font-size:11.5px;
              }
            }
          }

          @media (max-width:1100px) {
            .flash-ambient { --ambient-css-scale:1; }
            .subtitle { font-size:clamp(9px,1.28vw,11.5px);gap:4px; }
            .main-grid { grid-template-columns:1fr; }
            .left-stack,.side-stack { width:100%; }
            #map { min-height:0;aspect-ratio:16/9; }

            /* V3.39 – iPad/Tablet:
               Das Medaillon bestimmt häufig die Höhe der Grid-Zeile. Der Verlauf links
               nutzt diese Höhe nun vollständig statt mit fester 112-px-Höhe oben zu enden. */
            .history-main {
              height:100%;
              min-height:0;
            }
            .history-chart {
              height:auto;
              min-height:132px;
              flex:1 1 0;
            }

            /* Legende auf Tablet bewusst besser lesbar. */
            .map-legend {
              font-size:11.5px;
              gap:15px;
              line-height:1.25;
            }
            .map-legend .legend-dot { width:7.2px;height:7.2px; }
            .map-legend .legend-line { width:18px; }
            .weather-message-panel { padding:12px 16px 11px;min-height:78px; }
            .weather-message-quote { font-size:clamp(16px,2.2vw,22px); }
            .weather-message-context { font-size:7.8px; }

            /* V3.99404 – nur iPad/Tablet: Mobile ist die optische Referenz für
               die Einpassung der Gradskala in die Metallrahmen B/C. Desktop und
               Smartphone bleiben unverändert; die PNG-Dateien werden nicht skaliert. */
            /* V3.99405 – optische Mikro-Kalibrierung der Gradskala in den
               Metallrahmen B/C. Nur CSS-Geometrie; PNG-Dateien und Kompasslogik
               bleiben unverändert. */
            #card-root.ipad-device .compass-instrument.design-b {
              --compass-dial-size:87.2%;
              --compass-dial-shift-x:0.05%;
              --compass-dial-shift-y:-0.05%;
            }
            #card-root.ipad-device .compass-instrument.design-c {
              --compass-dial-size:79.0%;
              --compass-dial-shift-x:-0.08%;
              --compass-dial-shift-y:-1.22%;
            }
          }

          /* V3.99404 – bestehende V3.99402-Querformatregel unverändert übernommen – Verlauf bleibt auf Touch-Geräten im Querformat
             der letzte Inhaltsbereich. Die DOM-Struktur wird NICHT verändert. */
          @media (min-width:721px) and (max-width:1100px) and (orientation:landscape) and (hover:none) and (pointer:coarse) {
            .main-grid { display:flex;flex-direction:column;align-items:stretch; }
            .left-stack,.side-stack { display:contents; }
            .map-card,.weather-message-panel,.recent-panel,.compass-panel,.history-panel {
              width:100%;max-width:none;box-sizing:border-box;align-self:stretch;
            }
            .map-card { order:1; }
            .weather-message-panel { order:2; }
            .recent-panel { order:3; }
            .compass-panel { order:4; }
            .history-panel { order:5; }
          }

          /* V3.99404 – ausschließlich iPad/Tablet HOCHFORMAT.
             Querformat bleibt vollständig auf dem bestätigten V3.99402-Stand.
             Die Status-/Spruchfläche bleibt direkt bei der Karte; nur die echten
             Hauptmodule werden in die gewünschte Reihenfolge gebracht:
             Karte(+Status) → Letzte Blitzaktivität → Kompass → Verlauf/Tendenz. */
          @media (min-width:721px) and (max-width:1100px) and (orientation:portrait) and (hover:none) and (pointer:coarse) {
            #card-root.ipad-device .main-grid {
              display:flex;
              flex-direction:column;
              align-items:stretch;
            }
            #card-root.ipad-device .left-stack,
            #card-root.ipad-device .side-stack {
              display:contents;
            }
            #card-root.ipad-device .map-card,
            #card-root.ipad-device .weather-message-panel,
            #card-root.ipad-device .recent-panel,
            #card-root.ipad-device .compass-panel,
            #card-root.ipad-device .history-panel {
              width:100%;
              max-width:none;
              box-sizing:border-box;
              align-self:stretch;
            }
            #card-root.ipad-device .map-card { order:1; }
            #card-root.ipad-device .weather-message-panel { order:2; }
            #card-root.ipad-device .recent-panel { order:3; }
            #card-root.ipad-device .compass-panel { order:4; }
            #card-root.ipad-device .history-panel { order:5; }
          }

          @media (min-width:1101px) and (max-width:1366px) and (orientation:landscape) and (hover:none) and (pointer:coarse) {
            /* V3.99402 – Tablet/iPad Querformat:
               V3.99324 ist die bestätigte Referenz für die perfekte gemeinsame
               Unterkante der beiden Spalten. Die bereits ab 1101 px geltenden
               Stretch-/Flex-Regeln bleiben daher unangetastet. Korrigiert wird
               ausschließlich das in V3.99401 eingeführte display:contents-
               Flattening der beiden Spalten. */
            .left-stack,
            .side-stack {
              display:flex;
              flex-direction:column;
              min-width:0;
              gap:10px;
            }
          }

          @media (max-width:720px) {
            .map-card.map-size-large #map { height:min(70dvh,640px);min-height:430px; }
            .map-compass-overlay { width:clamp(171.6px,46.8vmin,299px); }
            .map-medallion-overlay { width:clamp(92px,28vmin,150px); }
            .map-medallion-overlay.android-device { width:clamp(78.2px,23.8vmin,127.5px); }
            .map-instrument-toggle { width:27px;height:27px;border-radius:8px; }
            /* V4.09.14 – Android/kleine Viewports: weniger Leerbreite, aber
               bewusst größere Schrift und ausreichend große Touch-Zeilen. */
            .map-display-menu { width:132px;min-width:132px;max-width:132px;padding:5px;gap:3px; }
            .map-display-menu-title { padding:5px 8px 4px;font-size:9.5px;letter-spacing:.065em; }
            .map-display-btn { min-height:40px;padding:0 9px;gap:8px;font-size:11px;letter-spacing:.015em; }
            .map-display-btn::before { width:8px;height:8px;flex-basis:8px; }
            .flash-ambient { --ambient-css-scale:1.08; }
            .shell { padding:13px; }
            ha-card { border-radius:20px; }

            /* V3.534 – Zahnrad und Standort bilden gemeinsam die rechte
               Kopfsteuerung. Standort steht – wenn aktiviert – direkt links
               neben dem Zahnrad. */
            /* V3.99703 – Mobile: linker Informationsblock und rechte Bedienleiste.
               Die Chip-Zeile liegt darunter über die volle Breite und kann später
               weitere Funktionen aufnehmen, ohne Titel/Untertitel zu berühren. */
            .topbar {
              position:relative;
              display:grid;
              grid-template-columns:minmax(0,1fr) auto;
              grid-template-areas:
                "brand controls"
                "chips chips";
              column-gap:8px;
              row-gap:7px;
              align-items:start;
            }
            .brand { grid-area:brand; }
            .brand {
              width:100%;
              padding-right:0;
              box-sizing:border-box;
            }
            .brand .eyebrow,
            .brand .title {
              box-sizing:border-box;
              padding-right:0;
            }
            /* V3.99702 – Titel und Untertitel bilden wieder einen geschlossenen
               Textblock. Standort und Einstellungen folgen erst in der Bedienzeile. */
            #card-root.location-visible .brand .eyebrow,
            #card-root.location-visible .brand .title {
              padding-right:0;
            }
            .brand .subtitle {
              width:100%;
              padding-right:0;
              box-sizing:border-box;
            }
            /* V3.99702 – der Untertitel sitzt wieder unmittelbar unter dem Titel;
               die Bedienzeile benötigt keine künstliche Freifläche mehr. */
            #card-root.location-visible .brand .subtitle {
              margin-top:7px;
            }
            .settings-chip {
              position:static !important;
              width:36px;
              min-width:36px;
              height:36px;
              min-height:36px;
              padding:0 !important;
              border-radius:12px;
              z-index:120;
              flex:0 0 36px;
            }
            .settings-chip .gear {
              font-size:18px;
            }
            .location-main-row {
              position:static;
              z-index:119;
              flex:0 1 auto;
              min-width:0;
            }
            .location-main-shell {
              gap:4px;
              padding:2px 3px 2px 6px;
            }
            .location-main-pin {
              width:16px;
              height:16px;
              --mdc-icon-size:16px;
              flex-basis:16px;
            }
            .location-main-separator { font-size:14px; }

            .top-actions {
              display:contents;
            }
            .header-control-row {
              grid-area:controls;
              display:flex;
              width:auto;
              flex-direction:column;
              align-items:flex-end;
              justify-content:flex-start;
              flex-wrap:nowrap;
              gap:4px;
            }
            .header-control-row .settings-chip { order:0; }
            .header-control-row .location-main-row { order:1; }
            .header-chip-row {
              grid-area:chips;
              display:flex;
              width:100%;
              align-items:center;
              justify-content:flex-end;
              flex-wrap:wrap;
              gap:5px;
            }

            /* V3.539 – Titelmitte liegt auf Mobile auf derselben vertikalen
               Achse wie Standortwahl und Zahnrad. */
            .title {
              margin-top:15px;
            }
            .app-version-badge { min-height:16px;margin-left:5px;padding:2px 4px;font-size:7px;border-radius:6px;vertical-align:.34em; }
            .subtitle {
              font-size:clamp(8.7px,2.55vw,10.5px);
              gap:clamp(3px,1vw,5px);
            }
            #radar-subtitle-location { flex:0 1 auto; }
            #radar-subtitle-window { flex:0 0 auto; }

            .top-actions { gap:5px; }
            .top-chip { min-height:30px;padding:0 8px;font-size:8.5px; }
            .warning-test-mini {
              min-height:27px;
              padding:0 7px;
              font-size:6.8px;
              letter-spacing:.035em;
            }
            .warning-test-mini .bolt { font-size:10px; }
            .radius-grid { grid-template-columns:repeat(2,minmax(0,1fr));gap:7px; }
            .radius-card.observation { grid-column:1 / -1; }
            .radius-card { min-height:74px;padding:9px 9px 10px; }
            .radius-title { font-size:7.2px;letter-spacing:.08em; }
            .radius-tools { gap:3px; }
            .radius-step { width:26px;height:26px;flex-basis:26px;font-size:14px; }
            .radius-value { min-width:65px;height:26px;font-size:12px; }
            .kpi-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
            .kpi { min-height:96px;padding:10px 11px 11px; }
            .kpi-value { font-size:clamp(24px,7.2vw,32px); }
            .kpi-sub { margin-top:8px;font-size:8.8px; }
            .kpi-distance .kpi-sub,
            .kpi-azimuth .kpi-sub { margin-top:10px; }
            .hit-number { font-size:clamp(27px,7.3vw,34px); }
            .hit-caption { margin-top:6px;font-size:7.8px; }
            .hit-live { font-size:8.1px; }
            .main-grid { display:flex;flex-direction:column;align-items:stretch; }
            .left-stack,.side-stack { display:contents; }
            .panel,.map-card,.weather-message-panel,.recent-panel,.compass-panel,.history-panel {
              width:100%;
              max-width:none;
              box-sizing:border-box;
              align-self:stretch;
            }
            .map-card { order:1; }
            .weather-message-panel { order:2; }
            .recent-panel { order:3; }
            .compass-panel { order:4; align-items:stretch; }
            .history-panel { order:5; padding:9px 10px 8px; }
            .history-layout { grid-template-columns:minmax(0,1fr) 140px;gap:8px; }
            .history-head { margin:0; }
            .history-sub { font-size:6.8px; }
            .trend { padding:2px 2px 2px 9px; }
            .trend .tlabel { font-size:6.3px;margin-bottom:6px; }
            .trend-icon { width:94px;height:auto; }
            .trend-copy { margin-top:5px; }
            .trend .tvalue { font-size:9.2px; }
            .trend .tsub { font-size:6.4px; }
            .hit-columns { padding:0 14px; }
            #recent-content { width:100%; }
            #map { height:330px;min-height:0;aspect-ratio:auto; }
            .map-legend { gap:11px;font-size:9.6px;line-height:1.25; }
            .map-legend .legend-dot { width:6.8px;height:6.8px; }
            .map-legend .legend-line { width:17px; }
            .recent-head, .recent-row {
              grid-template-columns:14px minmax(62px,1.05fr) minmax(62px,.9fr) minmax(58px,.82fr) 28px;
              gap:5px;
            }
            .recent-head { font-size:6.6px;letter-spacing:.08em; }
            .recent-row { font-size:8.6px; }
            .recent-distance { font-size:8.4px; }
            .compass-instrument { width:min(430px,100%); }
            #compass { width:var(--compass-dial-size); align-self:auto; }
            .compass-readout { font-size:25px; }
            .history-main {
              height:100%;
              min-height:0;
              align-self:stretch;
            }
            .history-chart {
              height:auto;
              min-height:104px;
              flex:1 1 0;
            }
            .trend-icon { width:94px;height:auto; }
            .trend-medallion-arrow { width:59.667391%;height:59.667391%; }

            /* V3.545 – Mobile Leerzustand:
               keine feste 64-px-Insel mehr. Die Meldung nutzt die gleiche
               verfügbare Höhe wie ein echter Verlauf, bleibt aber normaler
               HTML-Text und wird weder skaliert noch gequetscht. */
            .empty-chart {
              height:auto;
              min-height:104px;
              flex:1 1 0;
              box-sizing:border-box;
              padding:8px 10px;
              font-size:8.6px;
              line-height:1.35;
            }
            .footer-row { font-size:6.8px; padding-top:5px; gap:6px; flex-wrap:wrap; }
            .map-top-controls { top:8px;right:8px;gap:5px;max-width:calc(100% - 54px); }
            .map-recenter-btn {
              top:auto;
              bottom:10px;
              left:10px;
              width:32px;
              height:32px;
              border-radius:9px;
            }
            .map-recenter-icon {
              width:17px;
              height:17px;
              flex-basis:17px;
            }
            .map-mode-btn { min-height:23px;padding:0 7px;font-size:6.9px; }
            .map-radius-chip { min-height:27px;padding:0 8px;font-size:7.3px;gap:6px; }
          }

          @media (max-width:430px) {
            .shell { padding:10px; }
            .title { font-size:25px; }
            .subtitle { font-size:clamp(8px,2.35vw,9.6px);gap:3px;letter-spacing:-.01em; }
            #card-root.location-visible .brand .subtitle { margin-top:7px; }
            .topbar { flex-direction:column; }
            .top-actions { width:100%;justify-content:flex-end; }
            .settings-chip {
              top:23px;
              right:0;
              width:36px;
              min-width:36px;
              height:36px;
              min-height:36px;
            }
            .location-main-row {
              position:static;
            }
            #card-root.location-visible .brand .eyebrow,
            #card-root.location-visible .brand .title {
              padding-right:0;
            }
            .radius-grid { grid-template-columns:1fr; }
            .radius-card.observation { grid-column:auto; }
            .radius-title { font-size:6.9px; }
            .radius-step { width:26px;height:26px;flex-basis:26px;font-size:14px; }
            .radius-tools { gap:4px; }
            .radius-value { min-width:65px;height:26px;font-size:12px; }
            .kpi-grid { grid-template-columns:repeat(2,minmax(0,1fr));gap:7px; }
            .kpi { min-height:94px;padding:9px 10px 10px; }
            .kpi-label { font-size:7.6px; }
            .kpi-value { font-size:clamp(23px,7.4vw,31px); }
            .kpi-sub { font-size:8.4px; }
            .kpi-distance .kpi-sub,
            .kpi-azimuth .kpi-sub { margin-top:9px; }
            .kpi-foot { font-size:7px; }
            .hit-number { font-size:clamp(26px,7.5vw,33px); }
            .hit-caption { font-size:7.5px; }
            .hit-live { font-size:7.8px; }
            #map { height:305px; }
            .map-card.map-size-large #map { height:min(68dvh,570px);min-height:390px; }
            .map-legend { gap:8px;font-size:8.9px;line-height:1.22;padding:8px 7px 9px; }
            .map-legend .legend-dot { width:6.5px;height:6.5px; }
            .map-legend .legend-line { width:15px; }
            .compass-actions { gap:4px; }
            .compass-design-switch { width:132px;height:44px;aspect-ratio:3 / 1;flex-basis:132px; }
            .compass-design-button { top:5px;width:34px;height:34px;font-size:10px; }
            .compass-button { padding:0 7px;font-size:7.4px; }
            .compass-instrument {
              width:min(390px,100%);
            }
            .compass-instrument.design-a {
              --compass-dial-size:min(340px,98%);
              --compass-dial-shift-y:0%;
            }
            /* C behaelt seine bestehende mobile V1-Kalibrierung. B erbt den
               kreisrunden V2-Referenzstand von Desktop/Tablet. */
            .compass-instrument.design-c {
              --compass-dial-size:79.0%;
              --compass-dial-shift-x:-0.08%;
              --compass-dial-shift-y:-1.22%;
            }
            #compass { width:var(--compass-dial-size); }
            .recent-head, .recent-row {
              grid-template-columns:12px minmax(56px,1fr) minmax(54px,.88fr) minmax(52px,.78fr) 22px;
              gap:4px;
            }
            .recent-head { font-size:6.1px;letter-spacing:.055em; }
            .recent-row { font-size:8px; }
            .recent-filter-btn { font-size:6.2px;padding-left:2px;padding-right:2px;letter-spacing:.025em; }
            .recent-context { font-size:6.7px; }
            .weather-message-panel { padding:11px 12px 10px;border-radius:14px;min-height:82px; }
            .weather-message-quote { font-size:clamp(14px,4.15vw,19px);line-height:1.24; }
            .weather-message-context { margin-top:7px;font-size:7px;gap:8px; }
            .weather-message-context::before,.weather-message-context::after { max-width:46px; }
            .recent-distance { font-size:7.8px; }
            .history-panel { padding:8px 8px 7px; }
            .history-layout { grid-template-columns:minmax(0,1fr) 116px;gap:6px; }
            .history-sub { display:none; }
            .trend { padding:2px 0 2px 7px; }
            .trend .tlabel { font-size:5.8px;margin-bottom:5px; }
            .trend-icon { width:80px;height:auto; }
            .trend-copy { margin-top:4px; }
            .trend .tvalue { font-size:8.2px; }
            .trend .tsub { font-size:5.8px; }
            .history-chart { height:auto;min-height:92px;flex:1 1 0; }
            .trend-icon { width:80px;height:auto; }
            .trend-medallion-arrow { width:59.667391%;height:59.667391%; }
            .empty-chart {
              height:auto;
              min-height:92px;
              flex:1 1 0;
              padding:7px 8px;
              font-size:8.2px;
              line-height:1.35;
            }
            .footer-row { font-size:6.4px; padding-top:4px; }
            .map-top-controls { flex-direction:column-reverse;align-items:flex-end;gap:4px; }
            .map-top-controls .warning-test-mini {
              min-height:25px;
              padding:0 6px;
              font-size:6.1px;
            }
            .map-mode-btn { padding:0 6px;font-size:6.4px; }
            .map-radius-chip { min-height:25px;font-size:6.8px;padding:0 7px; }
          }

          @media (prefers-reduced-motion:reduce) {
            .live-dot { animation:none; }
            /* Warnblitze bleiben sichtbar. V3.515 reduziert nur ihre Stärke in JS;
               sie werden nicht mehr komplett unterdrückt. */
            .alert-flash.fire .flash-red { animation:lightningRed 1.75s ease-out both; }
          }

          /* V3.99704 – letzte Mobile-Feinkalibrierung vor V4.00.
             Querformat: Standort links neben Zahnrad; Optionen rechtsbündig in
             der Folgezeile. Hochformat: kompaktere Standort-/Menügeometrie.
             Eigene Dropdown-Mechanik bleibt erhalten; Popup wird in JS zentriert. */
          @media (max-width:720px) {
            .settings-language-button.settings-control,
            .settings-location-button.settings-control {
              position:relative;
              justify-content:center;
              padding-left:26px;
              padding-right:26px;
            }
            .settings-language-current,
            .settings-location-current {
              justify-content:center;
            }
            .settings-language-chevron,
            .settings-location-chevron {
              position:absolute;
              right:10px;
              top:50%;
              transform:translateY(-50%);
            }
          }

          @media (max-width:720px) and (orientation:landscape) {
            .header-control-row {
              flex-direction:row;
              align-items:center;
              justify-content:flex-end;
              gap:5px;
            }
            .header-control-row .location-main-row { order:0; }
            .header-control-row .settings-chip { order:1; }
            .header-chip-row {
              justify-content:flex-end;
              align-items:center;
              flex-wrap:wrap;
            }
          }

          @media (max-width:720px) and (orientation:portrait) {
            .location-main-shell {
              gap:3px;
              padding:1px 2px 1px 5px;
            }
            .location-main-pin {
              width:14px;
              height:14px;
              --mdc-icon-size:14px;
              flex-basis:14px;
            }
            .location-main-separator { font-size:12px; }
            .location-main-button {
              min-width:86px;
              max-width:100px;
              min-height:30px;
              padding:0 6px;
              font-size:10px;
              border-radius:9px;
            }

            .settings-language-button.settings-control,
            .settings-location-button.settings-control {
              width:154px;
              min-width:154px;
              max-width:154px;
              height:34px;
              min-height:34px;
              font-size:10.5px;
            }
            .language-option,
            .location-option {
              min-height:32px;
              font-size:10.5px;
            }
          }

          /* V3.99705 – Smartphone-Querformat, gezielte Feiniteration.
             Viele Telefone liegen gedreht über 720 CSS-px Breite; deshalb wird
             hier Touch + Querformat + geringe Viewport-Höhe verwendet.
             Keine Größenänderung an den im Querformat bereits akzeptierten
             Language-/Location-Controls. */
          @keyframes medallion-diagnostic-sweep {
            0% { transform:translate(-50%,-50%) rotate(0deg) scale(1); }
            50% { transform:translate(-50%,-50%) rotate(90deg) scale(1); }
            100% { transform:translate(-50%,-50%) rotate(0deg) scale(1); }
          }
          #card-root.medallion-diagnostic-active .trend-medallion-arrow { opacity:1!important;filter:drop-shadow(0 2px 1px rgba(47,24,4,.82)) drop-shadow(0 0 4px rgba(246,195,68,.18))!important; }
          #card-root.medallion-diagnostic-arrow-off .trend-medallion-arrow { opacity:0!important;animation:none!important;transition:none!important; }
          #card-root.medallion-diagnostic-static .trend-medallion-arrow { animation:none!important;transition:none!important;transform:translate(-50%,-50%) rotate(var(--medallion-diagnostic-angle,45deg)) scale(1)!important; }
          #card-root.medallion-diagnostic-animation .trend-medallion-arrow { transition:none!important;animation:medallion-diagnostic-sweep 3s ease-in-out infinite!important; }
          #card-root.medallion-diagnostic-frozen .trend-medallion-arrow { animation-play-state:paused!important; }
          .medallion-diagnostic-controls { position:sticky;top:0;z-index:4;margin:10px 0;padding:10px;border:1px solid rgba(74,197,255,.28);border-radius:10px;background:rgba(6,20,30,.97);box-shadow:0 5px 12px rgba(0,0,0,.28); }
          .medallion-diagnostic-title { color:#75dcff;font:850 9px/1.25 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;margin-bottom:7px; }
          .medallion-diagnostic-row { display:flex;flex-wrap:wrap;gap:5px;margin-top:6px; }
          .medallion-diagnostic-row button { border:1px solid rgba(74,197,255,.35);border-radius:7px;background:#0a1b28;color:#bfeeff;padding:5px 7px;font:750 8px/1 system-ui,sans-serif;cursor:pointer; }
          .medallion-diagnostic-row button.active { border-color:#69e7ff;background:#12364a;color:#fff;box-shadow:0 0 0 1px rgba(105,231,255,.18) inset; }
          .medallion-diagnostic-state { margin-top:8px;color:#dceaf2;white-space:pre-wrap;font:700 9px/1.45 ui-monospace,monospace; }
          @media (max-width:700px) {
            .medallion-calibration-modal-backdrop { padding:6px;align-items:flex-end;justify-content:center!important; }
            .medallion-calibration-modal { width:100%;max-height:min(54dvh,470px);border-radius:12px; }
            .medallion-calibration-modal-backdrop.collapsed { align-items:flex-end; }
          }

          @media (orientation:landscape) and (hover:none) and (pointer:coarse) and (max-height:600px) {
            .topbar {
              display:grid;
              grid-template-columns:minmax(230px,32%) minmax(0,1fr);
              grid-template-areas:
                "brand controls"
                "brand chips";
              column-gap:10px;
              row-gap:6px;
              align-items:start;
            }
            .brand { grid-area:brand; }
            .top-actions { display:contents; }
            .header-control-row {
              grid-area:controls;
              display:flex;
              width:100%;
              flex-direction:row;
              align-items:center;
              justify-content:flex-end;
              flex-wrap:nowrap;
              gap:5px;
            }
            .header-control-row .location-main-row { order:0; }
            .header-control-row .settings-chip { order:1; }
            .header-chip-row {
              grid-area:chips;
              display:flex;
              width:100%;
              align-items:center;
              justify-content:flex-end;
              flex-wrap:wrap;
              gap:5px;
            }
            .settings-language-button.settings-control,
            .settings-location-button.settings-control {
              position:relative;
              justify-content:center;
              padding-left:26px;
              padding-right:26px;
            }
            .settings-language-current,
            .settings-location-current {
              justify-content:center;
            }
            .settings-language-chevron,
            .settings-location-chevron {
              position:absolute;
              right:10px;
              top:50%;
              transform:translateY(-50%);
            }
          }


          /* V3.99706 – zwei isolierte Mobile-Korrekturen.
             Hochformat Hauptansicht: nur die Hoehe der Standortwahl reduzieren;
             Schrift, Breite, Dropdown-Mechanik und Header-Anordnung bleiben gleich.
             Querformat Einstellungen: der Backdrop wird zum einzigen vertikalen
             Scrollcontainer. Der Dialog/Body darf mit einem geoeffneten Akkordeon
             auf seine reale Inhaltshoehe wachsen und wird nicht an der knappen
             Landscape-Viewporthoehe abgeschnitten. */
          @media (orientation:portrait) and (hover:none) and (pointer:coarse) and (max-width:720px) {
            .location-main-shell {
              min-height:30px;
              height:30px;
              box-sizing:border-box;
              padding-top:0;
              padding-bottom:0;
            }
            .location-main-button {
              min-height:26px;
              height:26px;
            }
          }

          @media (orientation:landscape) and (hover:none) and (pointer:coarse) and (max-height:600px) {
            .settings-backdrop {
              align-items:flex-start;
              overflow-y:auto;
              overflow-x:hidden;
              -webkit-overflow-scrolling:touch;
            }
            .settings-dialog {
              flex:0 0 auto;
              height:auto;
              max-height:none;
              overflow:visible;
            }
            .settings-body {
              flex:0 0 auto;
              min-height:auto;
              overflow:visible;
              scrollbar-gutter:auto;
            }
            .settings-collapsible,
            .settings-section-content {
              max-height:none;
            }
          }


          /* V3.99707 – drei isolierte Darstellungs-Feinkorrekturen.
             Querformat Einstellungen: der Dialog clippt wieder an seinem eigenen
             Radius, ohne die in V3.99706 eingefuehrte Backdrop-Scrolllogik zu
             veraendern. Dadurch bleibt der messingfarbene Rahmen in den oberen
             Ecken sichtbar. Hochformat Hauptansicht: Zahnrad-Badge kreisrund;
             Standortfeld leicht hoeher als V3.99706, Schrift/Breite unveraendert. */
          @media (orientation:portrait) and (hover:none) and (pointer:coarse) and (max-width:720px) {
            .settings-chip {
              border-radius:50%;
            }
            .location-main-shell {
              min-height:31px;
              height:31px;
            }
            .location-main-button {
              min-height:28px;
              height:28px;
            }
          }

          @media (orientation:landscape) and (hover:none) and (pointer:coarse) and (max-height:600px) {
            .settings-dialog {
            overflow:visible;
          }
          .compass-design-switch[hidden],
          .settings-row[hidden] { display:none !important; }
          }


          /* V3.99708 – ausschliesslich Hauptansicht Mobile.
             Hochformat: Beobachtung volle Breite; Gewitter und Gefahr teilen
             sich die zweite Zeile. In den beiden Halbbreiten-Karten liegen Titel
             und [− Wert KM +] bewusst untereinander, damit nichts kollidiert.
             Querformat: dieselbe kollisionsfreie Innenstruktur fuer die beiden
             schmalen Radiuskarten. Sind Test-Tools sichtbar, wechselt die gesamte
             Add-on-Gruppe geschlossen in die volle zweite Kopfzeile; kein einzelner
             Cluster-Chip faellt mehr alleine in eine Folgezeile.
             Das final abgenommene Einstellungsmenue bleibt unberuehrt. */
          @media (orientation:portrait) and (hover:none) and (pointer:coarse) and (max-width:720px) {
            #card-root.radii-visible .radius-grid {
              grid-template-columns:repeat(2,minmax(0,1fr));
              gap:7px;
            }
            #card-root.radii-visible .radius-card.observation {
              grid-column:1 / -1;
            }
            #card-root.radii-visible .radius-card.storm,
            #card-root.radii-visible .radius-card.danger {
              min-height:86px;
              padding:8px 8px 9px;
            }
            #card-root.radii-visible .radius-card.storm .radius-head,
            #card-root.radii-visible .radius-card.danger .radius-head {
              flex-direction:column;
              align-items:stretch;
              justify-content:flex-start;
              gap:5px;
              margin-bottom:5px;
            }
            #card-root.radii-visible .radius-card.storm .radius-title,
            #card-root.radii-visible .radius-card.danger .radius-title {
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
              font-size:6.5px;
              letter-spacing:.055em;
            }
            #card-root.radii-visible .radius-card.storm .radius-tools,
            #card-root.radii-visible .radius-card.danger .radius-tools {
              width:100%;
              justify-content:flex-end;
              gap:3px;
            }
          }

          @media (orientation:landscape) and (hover:none) and (pointer:coarse) and (max-height:600px) {
            #card-root:not(.tests-hidden) .topbar {
              grid-template-areas:
                "brand controls"
                "chips chips";
            }
            #card-root:not(.tests-hidden) .header-chip-row {
              width:100%;
              justify-content:flex-end;
              flex-wrap:wrap;
            }

            #card-root.radii-visible .radius-grid {
              grid-template-columns:minmax(0,1.65fr) repeat(2,minmax(0,1fr));
              gap:7px;
            }
            #card-root.radii-visible .radius-card.storm .radius-head,
            #card-root.radii-visible .radius-card.danger .radius-head {
              flex-direction:column;
              align-items:stretch;
              justify-content:flex-start;
              gap:5px;
              margin-bottom:5px;
            }
            #card-root.radii-visible .radius-card.storm .radius-title,
            #card-root.radii-visible .radius-card.danger .radius-title {
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
            }
            #card-root.radii-visible .radius-card.storm .radius-tools,
            #card-root.radii-visible .radius-card.danger .radius-tools {
              width:100%;
              justify-content:flex-end;
            }
          }


          /* V3.99709 – Mobile Radius-Mikrozentrierung.
             Nur die beiden kleinen Karten Gewitter/Gefahr: Titel und komplette
             [− Wert KM +]-Bediengruppe liegen auf derselben horizontalen Mittelachse.
             Beobachtung, Slider, Header und das final abgenommene Settings-Menue
             bleiben unveraendert. */
          @media (orientation:portrait) and (hover:none) and (pointer:coarse) and (max-width:720px) {
            #card-root.radii-visible .radius-card.storm .radius-title,
            #card-root.radii-visible .radius-card.danger .radius-title {
              width:100%;
              text-align:center;
            }
            #card-root.radii-visible .radius-card.storm .radius-tools,
            #card-root.radii-visible .radius-card.danger .radius-tools {
              justify-content:center;
            }
          }

          @media (orientation:landscape) and (hover:none) and (pointer:coarse) and (max-height:600px) {
            #card-root.radii-visible .radius-card.storm .radius-title,
            #card-root.radii-visible .radius-card.danger .radius-title {
              width:100%;
              text-align:center;
            }
            #card-root.radii-visible .radius-card.storm .radius-tools,
            #card-root.radii-visible .radius-card.danger .radius-tools {
              justify-content:center;
            }
          }
          /* V4.06 menu polish: premium About icon and three-level diagnostic hierarchy. */
          #settings-about > span[aria-hidden="true"] {
            display:grid;
            place-items:center;
            flex:0 0 24px;
            width:24px;
            height:24px;
            font:700 21px/1 "Segoe UI Symbol","Arial Unicode MS",sans-serif;
            color:#e2b95d;
            background:linear-gradient(135deg,#926521 6%,#f8e4a5 35%,#c18a2c 60%,#f1cf75 82%,#8d5d1a);
            -webkit-background-clip:text;
            background-clip:text;
            -webkit-text-fill-color:transparent;
            filter:drop-shadow(0 1px 0 rgba(49,29,5,.92)) drop-shadow(0 0 2px rgba(232,181,65,.28));
            transition:filter .16s ease;
          }
          #settings-about:focus-visible { outline:none; }
          #settings-about:focus-visible > span[aria-hidden="true"] {
            outline:2px solid rgba(255,225,161,.92);
            outline-offset:2px;
            border-radius:50%;
            filter:brightness(1.13) drop-shadow(0 0 3px rgba(244,197,91,.42));
          }
          @media(hover:hover) and (pointer:fine) {
            #settings-about:hover > span[aria-hidden="true"] {
              filter:brightness(1.14) saturate(1.08) drop-shadow(0 1px 0 rgba(49,29,5,.92)) drop-shadow(0 0 3px rgba(238,188,72,.38));
            }
          }
          #settings-about:active > span[aria-hidden="true"] {
            filter:brightness(.9) saturate(1.08) drop-shadow(0 1px 0 rgba(49,29,5,.92));
          }
          #settings-diagnostic-section > .settings-section-content > .settings-row-label {
            box-sizing:border-box;
            width:100%;
            padding:9px 12px 4px 22px;
            color:#d7bd82;
            font-size:8.6px;
            font-weight:820;
            line-height:1.25;
            letter-spacing:.055em;
          }
          #settings-diagnostic-section > .settings-section-content > .settings-row {
            padding-left:34px;
            padding-right:12px;
          }
          #settings-diagnostic-section > .settings-section-content > .settings-test-grid {
            padding-left:34px;
            padding-right:12px;
          }
          @media(max-width:720px) {
            #settings-diagnostic-section > .settings-section-content > .settings-row-label { padding-left:20px; }
            #settings-diagnostic-section > .settings-section-content > .settings-row { padding-left:30px;padding-right:10px; }
            #settings-diagnostic-section > .settings-section-content > .settings-test-grid { padding-left:30px;padding-right:10px; }
          }
          @media(max-height:720px) {
            #settings-diagnostic-section > .settings-section-content > .settings-row-label { padding:7px 9px 3px 20px; }
            #settings-diagnostic-section > .settings-section-content > .settings-row { padding-left:30px;padding-right:9px; }
            #settings-diagnostic-section > .settings-section-content > .settings-test-grid { padding-left:30px;padding-right:9px; }
          }
          @media(max-width:520px) and (min-height:721px) {
            #settings-diagnostic-section > .settings-section-content > .settings-row-label { padding-left:18px; }
            #settings-diagnostic-section > .settings-section-content > .settings-row { padding-left:26px; }
            #settings-diagnostic-section > .settings-section-content > .settings-test-grid { padding-left:26px; }
          }
          #settings-diagnostic-section[open]>.settings-section-content{padding-bottom:22px!important;scroll-padding-bottom:22px}
          /* V4.06 final premium settings shell and hierarchy. */
          .settings-dialog{--premium-gold:#c7a25b;--premium-gold-bright:#f1d58c;--premium-line:rgba(201,160,80,.34);border-color:var(--premium-line);background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%),linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995));box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,235,184,.055),inset 0 1px rgba(255,244,213,.08),0 0 30px rgba(207,159,60,.065)}
          .settings-premium-links{display:grid;grid-template-columns:1fr 1fr;gap:7px}.settings-premium-link{min-height:44px!important;border:1px solid rgba(190,149,69,.22)!important;border-radius:12px!important;background:linear-gradient(110deg,rgba(176,130,49,.08),rgba(12,22,29,.62))!important;box-shadow:inset 0 1px rgba(255,239,198,.055)}
          .settings-premium-icon{display:grid;place-items:center;flex:0 0 24px;width:24px;height:24px;transform:translateY(-1px);font:700 21px/1 "Segoe UI Symbol","Arial Unicode MS",sans-serif;color:#e2b95d;background:linear-gradient(135deg,#926521 6%,#f8e4a5 35%,#c18a2c 60%,#f1cf75 82%,#8d5d1a);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 1px 0 rgba(49,29,5,.92)) drop-shadow(0 0 2px rgba(232,181,65,.28));transition:filter .16s ease}
          .settings-premium-link:focus-visible{outline:2px solid rgba(255,225,161,.92)!important;outline-offset:1px!important}.settings-premium-link:focus-visible .settings-premium-icon{filter:brightness(1.15) drop-shadow(0 0 3px rgba(244,197,91,.42))}
          .settings-section{border-color:rgba(190,151,76,.22);background:linear-gradient(115deg,rgba(169,126,47,.055),rgba(255,255,255,.018) 30%,rgba(7,13,19,.36));box-shadow:inset 0 1px rgba(255,239,194,.045),0 2px 8px rgba(0,0,0,.18);transition:border-color .16s ease,box-shadow .16s ease,background .16s ease}.settings-section[open]{border-color:rgba(224,180,87,.46);background:linear-gradient(115deg,rgba(177,132,47,.10),rgba(255,255,255,.022) 35%,rgba(7,13,19,.42));box-shadow:inset 0 1px rgba(255,243,207,.08),0 0 13px rgba(208,158,55,.08)}
          .settings-collapsible>.settings-section-head{align-items:center;min-height:44px}.settings-collapsible>.settings-section-head::after{content:'';width:13px;height:13px;border-right:2px solid #d6b66e;border-bottom:2px solid #d6b66e;font-size:0;transform:rotate(45deg);margin:-6px 10px 0 0;filter:drop-shadow(0 1px .5px #4c301c) drop-shadow(0 0 3px #d8a74a66);transition:transform .42s cubic-bezier(.22,1,.36,1),filter .28s ease}.settings-collapsible[open]>.settings-section-head::after{transform:rotate(225deg);margin-top:7px;color:inherit;filter:brightness(1.14) drop-shadow(0 1px .5px #4c301c) drop-shadow(0 0 4px #d8a74a88)}
          #settings-diagnostic-section>.settings-section-content>.settings-row-label{border-left:1px solid rgba(196,153,70,.24);background:linear-gradient(90deg,rgba(190,143,52,.045),transparent 72%)}
          .settings-signature-wrap{background:radial-gradient(ellipse at 82% 52%,rgba(201,151,51,.075),transparent 56%)}.settings-signature{filter:sepia(.16) saturate(1.28) brightness(1.08) contrast(1.035) drop-shadow(0 1px .5px rgba(255,226,158,.16)) drop-shadow(0 3px 5px rgba(0,0,0,.48))}
          @media(hover:hover) and (pointer:fine){.settings-premium-link:hover .settings-premium-icon{filter:brightness(1.14) saturate(1.08) drop-shadow(0 1px 0 rgba(49,29,5,.92)) drop-shadow(0 0 3px rgba(238,188,72,.38))}.settings-collapsible>.settings-section-head:hover::after{filter:brightness(1.2) drop-shadow(0 0 3px rgba(240,193,82,.48))}}
          .settings-premium-link:active .settings-premium-icon{filter:brightness(.9) saturate(1.08)}
          @media(max-width:420px){.settings-premium-links{grid-template-columns:1fr}}
          /* V4.07.22 – Zoom-/Viewport-sicheres Accordion.
             Nur der Inhalt der aktuell geoeffneten Gruppe wird bei Bedarf
             scrollbar. Bei ausreichender Hoehe bleibt die Darstellung 1:1
             unveraendert; overflow-y:auto erzeugt keinen Scrollbereich, solange
             der Inhalt unterhalb der dynamischen Maximalhoehe bleibt. */
          .settings-collapsible[open] > .settings-section-content {
            max-height:clamp(132px,calc(100vh - 440px),520px);
            max-height:clamp(132px,calc(100dvh - 440px),520px);
            overflow-y:auto;
            overflow-x:hidden;
            overscroll-behavior-y:contain;
            -webkit-overflow-scrolling:touch;
            scrollbar-width:thin;
            scrollbar-color:rgba(120,138,160,.34) transparent;
          }
          .settings-collapsible[open] > .settings-section-content::-webkit-scrollbar { width:7px; }
          .settings-collapsible[open] > .settings-section-content::-webkit-scrollbar-track { background:transparent; }
          .settings-collapsible[open] > .settings-section-content::-webkit-scrollbar-thumb {
            border-radius:999px;
            background:rgba(120,138,160,.30);
          }
          /* V4.06 accepted UI polish: premium frame and symmetric action tiles. */
          /* V4.06 pass2: Welcome-derived 2px metal frame, reduced diffuse gold shadow. */
          .settings-dialog{
            border:2px solid transparent;
            background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%) padding-box,linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995)) padding-box,linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c) border-box;
            box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,236,181,.08),inset 0 1px rgba(255,244,213,.10),0 0 8px rgba(215,164,67,.055)
          }
          .settings-dialog::after{content:none!important}
          /* V4.06 pass5: Settings version lives in the persistent dialog shell, not the transient About style. */
          .settings-footer-version{position:absolute;left:18px;bottom:18px;z-index:3;color:#747d8a;font-size:8.2px;font-weight:720;letter-spacing:.08em;white-space:nowrap;user-select:none}
          @media(max-width:720px){.settings-footer-version{left:14px;bottom:15px}}
          .settings-chip.settings-chip-premium{width:40px!important;min-width:40px!important;height:40px!important;min-height:40px!important;flex:0 0 40px!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:visible}
          .settings-chip-premium .gear-welcome{display:block!important;width:30px;height:30px;min-width:30px;min-height:30px;overflow:visible;color:#e5bd69;stroke-width:3;filter:drop-shadow(0 1px .5px #4c301c) drop-shadow(0 2px 1.5px #0009) drop-shadow(0 -1px .4px #f5d5a555);transition:filter .16s ease,transform .16s ease}
          #card-root.ipad-device .settings-chip-premium .gear-welcome{display:block!important}
          @media(hover:hover) and (pointer:fine){.settings-chip-premium:hover .gear-welcome{filter:brightness(1.08) drop-shadow(0 1px .5px #4c301c) drop-shadow(0 2px 1.5px #0009) drop-shadow(0 0 3px #d9a84f55)}}
          .settings-chip-premium:active .gear-welcome{transform:scale(.97);filter:brightness(.92) drop-shadow(0 1px .5px #4c301c)}
          .settings-premium-link{display:flex!important;align-items:center!important;justify-content:flex-start!important;text-align:left!important}
          .settings-premium-link>span:last-child{min-width:0;text-align:left}
          .settings-dialog{position:relative}.settings-close.settings-close-premium{position:absolute!important;top:10px!important;right:10px!important;margin:0!important;z-index:60!important;display:grid!important;place-items:center;width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important;border:0!important;border-radius:8px!important;background:transparent!important;color:transparent!important;font-size:0!important;line-height:0!important;overflow:visible;box-shadow:none!important}
          .settings-close-premium img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}
          .settings-close-premium:focus-visible{outline:2px solid #e7c16e!important;outline-offset:-2px!important}.settings-close-premium:active img{transform:scale(.97);filter:brightness(.92)}
          @media(hover:hover) and (pointer:fine){.settings-close-premium:hover{background:transparent!important}.settings-close-premium:hover img{filter:brightness(1.12) drop-shadow(0 0 2px #dba34c70)}}
          @media(hover:none) and (pointer:coarse){.settings-close-premium:focus-visible{outline:none!important}}
          @media(max-width:520px) and (orientation:portrait){
            .settings-premium-links{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
            .settings-premium-link{min-width:0;padding-left:10px!important;padding-right:9px!important;gap:7px!important}
            .settings-premium-icon{flex-basis:22px;width:22px;height:22px}
            .settings-premium-link>span:last-child{white-space:normal;line-height:1.15}
          }

          /* V4.08.23 – Cluster-Auflösung übernimmt jetzt den stabilen
             Custom-Dropdown-Stil der Sprachauswahl. */
          .settings-cluster-resolution-control { position:relative;width:156px;min-width:156px; }
          .settings-cluster-resolution-button.settings-control {
            display:inline-flex;width:156px;min-width:156px;max-width:156px;
          }
          .settings-cluster-resolution-dropdown { min-width:176px; }
          @media (max-width:720px) {
            .settings-cluster-resolution-control { width:146px;min-width:146px; }
            .settings-cluster-resolution-button.settings-control { width:146px;min-width:146px;max-width:146px; }
            .settings-cluster-resolution-dropdown { width:168px;min-width:0;max-width:calc(100vw - 16px); }
          }

          /* V4.08.07 – Sitzungszeit übernimmt exakt die wertigere Einfassung
             der geöffneten Hilfe-&-Hinweise-Akkordeons. Nur der Außenrahmen
             wird veredelt; innere Auswahl und Funktion bleiben unverändert. */
          .settings-cluster-session-selector {
            width:156px;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) 46px;gap:4px;
            align-items:stretch;padding:3px;border:1px solid #c69d4f9c;border-radius:9px;overflow:visible;
            background:linear-gradient(110deg,#a4843818,#0b171e70 30%,#15202645);
            box-shadow:inset 0 1px #fff2,0 0 11px #d69a2116;
          }
          .settings-cluster-session-mode {
            min-width:0;min-height:30px;box-sizing:border-box;border:1px solid transparent;border-radius:8px;
            background:transparent;color:#d7e0e8;transition:border-color .15s ease,background .15s ease,color .15s ease,box-shadow .15s ease,opacity .15s ease;
          }
          .settings-cluster-session-finite { display:flex;align-items:center;justify-content:center;gap:3px;padding:2px 5px;cursor:text; }
          .settings-cluster-session-finite input {
            width:55px;height:24px;min-height:24px;box-sizing:border-box;border:0!important;border-radius:5px!important;
            background:transparent!important;color:#edf5fb!important;padding:1px 2px!important;text-align:right;font:760 12px/1.1 inherit!important;
            box-shadow:none!important;outline:none!important;
          }
          .settings-cluster-session-finite input:focus { outline:none!important;box-shadow:none!important; }
          .settings-cluster-session-unit { color:#aebdca;font-size:11px;font-weight:760;line-height:1; }
          .settings-cluster-session-infinite {
            appearance:none;-webkit-appearance:none;display:grid;place-items:center;padding:0 2px;cursor:pointer;font:inherit;
            border:0!important;box-shadow:none;background:transparent;position:relative;isolation:isolate;
          }
          .settings-cluster-session-infinity-gfx {
            display:block;width:39px;height:auto;max-height:29px;object-fit:contain;pointer-events:none;
            position:relative;z-index:1;filter:drop-shadow(0 2px 3px rgba(0,0,0,.58));
          }
          #header-status { display:inline-flex;align-items:center;gap:4px; }
          .status-infinity-gfx {
            display:inline-block;width:32px;height:auto;max-height:22px;object-fit:contain;vertical-align:middle;pointer-events:auto;
            position:relative;margin-left:8px;cursor:pointer;filter:drop-shadow(0 1px 2px rgba(0,0,0,.58));
          }
          .status-cluster-countdown {
            color:#d9a93e;font-weight:800;text-shadow:0 0 7px rgba(212,157,47,.20);cursor:pointer;
            display:inline-flex;align-items:center;min-height:28px;padding:5px 5px;margin:-5px -5px -5px 0;
          }
          .status-infinity-gfx[data-session-toggle] {
            padding:5px 4px;margin:-5px -4px -5px 4px;box-sizing:content-box;
          }
          .status-cluster-countdown:hover { filter:brightness(1.10); }
          .status-infinity-gfx:hover { filter:brightness(1.08) drop-shadow(0 1px 2px rgba(0,0,0,.58)); }
          .settings-cluster-session-selector:not(.is-infinite) .settings-cluster-session-finite {
            border-color:#4ba8f3;background:linear-gradient(180deg,rgba(30,86,132,.46),rgba(16,52,82,.40));
            color:#f2f7fb;box-shadow:0 0 0 1px rgba(75,168,243,.18),0 0 11px rgba(51,146,222,.18),inset 0 1px 0 rgba(255,255,255,.05);
          }
          .settings-cluster-session-selector.is-infinite .settings-cluster-session-finite { opacity:.48; }
          .settings-cluster-session-selector:not(.is-infinite) .settings-cluster-session-infinite { opacity:.82; }
          .settings-cluster-session-infinite:hover,.settings-cluster-session-infinite:focus-visible { outline:none;filter:brightness(1.10); }
          @media(max-width:520px) {
            .settings-cluster-session-selector { width:146px;grid-template-columns:minmax(0,1fr) 45px; }
            .settings-cluster-session-finite input { width:51px; }
            .settings-cluster-session-infinity-gfx { width:36px;max-height:26px; }
            .status-infinity-gfx { width:30px;max-height:21px;margin-left:7px; }
          }

          /* V4.09.27 TEST – Radien erhält einen eigenen, klar begrenzten Scroll-Viewport.
             Der V4.09.26-Ansatz über ausschließlich den äußeren Settings-Scroll konnte
             in realen Browser-/WebView-Viewports vor dem letzten Radius enden.
             Die Radiusliste scrollt deshalb wieder selbst, nutzt aber keine starre
             Resthöhenberechnung mehr. Zusätzlicher unterer Innenraum stellt sicher,
             dass der Gefahrenradius vollständig über die untere Kante gezogen werden kann. */
          #settings-radii-section[open] > .settings-radius-list {
            box-sizing:border-box;
            min-height:0;
            max-height:min(520px,calc(100vh - 180px))!important;
            max-height:min(520px,calc(100dvh - 180px))!important;
            overflow-y:auto!important;
            overflow-x:hidden!important;
            overscroll-behavior-y:contain;
            -webkit-overflow-scrolling:touch;
            touch-action:pan-y;
            scrollbar-gutter:stable;
            scrollbar-width:thin;
            scrollbar-color:rgba(205,164,84,.42) transparent;
            scroll-padding-bottom:22px;
            padding-bottom:24px;
          }
          #settings-radii-section[open] > .settings-radius-list::-webkit-scrollbar { width:7px; }
          #settings-radii-section[open] > .settings-radius-list::-webkit-scrollbar-track { background:transparent; }
          #settings-radii-section[open] > .settings-radius-list::-webkit-scrollbar-thumb {
            border-radius:999px;
            background:rgba(205,164,84,.38);
          }
          @media (orientation:landscape) and (hover:none) and (pointer:coarse) and (max-height:600px) {
            #settings-radii-section[open] > .settings-radius-list {
              max-height:min(360px,calc(100vh - 110px))!important;
              max-height:min(360px,calc(100dvh - 110px))!important;
            }
          }
          /* V4.08.09 – gewählte Variante B: statische Goldbetonung, keine Animation. */
          .settings-cluster-session-static-gold .settings-cluster-session-mode { position:relative;overflow:visible; }
          .settings-cluster-session-static-gold:not(.is-infinite) .settings-cluster-session-finite {
            border-color:rgba(232,189,88,.72);color:#fff4d6;
            box-shadow:0 0 0 1px rgba(232,189,88,.10),0 0 10px rgba(214,154,33,.16),inset 0 1px 0 rgba(255,255,255,.06);
            background:linear-gradient(110deg,rgba(116,78,15,.30),rgba(223,173,66,.30) 45%,rgba(255,218,128,.13) 70%,rgba(14,29,38,.20));
            animation:none;
          }
          .settings-cluster-session-static-gold.is-infinite .settings-cluster-session-infinite {
            color:#fff4d6;border-color:transparent!important;background:transparent;box-shadow:none;animation:none;
          }
          .settings-cluster-session-static-gold.is-infinite .settings-cluster-session-infinite::before {
            content:'';position:absolute;left:-13px;right:-13px;top:-8px;bottom:-8px;border-radius:999px;z-index:0;pointer-events:none;
            background:
              radial-gradient(ellipse 62% 98% at 25% 46%,rgba(255,251,244,.30) 0%,rgba(255,245,231,.18) 25%,rgba(255,236,208,.085) 49%,transparent 76%),
              radial-gradient(ellipse 58% 92% at 76% 54%,rgba(255,250,241,.25) 0%,rgba(255,243,226,.145) 27%,rgba(255,233,201,.065) 51%,transparent 77%),
              radial-gradient(ellipse 92% 74% at 50% 50%,rgba(255,248,235,.13) 0%,rgba(255,241,220,.065) 50%,transparent 82%);
            background-size:154% 116%,148% 112%,140% 112%;
            background-position:2% 46%,96% 54%,50% 50%;
            filter:blur(7.8px);opacity:.66;transform:translate3d(0,0,0);
            animation:none;
          }
          .settings-cluster-session-static-gold.is-infinite .settings-cluster-session-infinity-gfx {
            filter:drop-shadow(0 1px 2px rgba(0,0,0,.58)) drop-shadow(0 0 2px rgba(255,245,226,.30));
          }
          .settings-cluster-session-static-gold.is-infinite .settings-cluster-session-finite { opacity:.42; }
          .settings-cluster-session-static-gold:not(.is-infinite) .settings-cluster-session-infinite { opacity:.84; }
          .status-infinity-gfx.status-infinite-active {
            filter:drop-shadow(0 1px 2px rgba(0,0,0,.58)) drop-shadow(0 0 2px rgba(255,244,223,.26));
            transform-origin:center center;
          }

          /* V4.09.19 – separates Kartenfenster: aus dem bislang praktisch
             rahmenlosen Text-Control wird eine klar erkennbare, bewusst
             eingerückte Premium-Schaltfläche. Die Funktion bleibt unverändert. */
          #settings-map-window-open {
            appearance:none;-webkit-appearance:none;
            width:138px;min-width:138px;max-width:138px;
            height:34px;min-height:34px;
            margin-right:18px;
            padding:0 14px;
            display:inline-flex;align-items:center;justify-content:center;
            border:1px solid rgba(232,188,90,.58);
            border-radius:10px;
            background:linear-gradient(180deg,rgba(237,197,104,.115),rgba(170,119,34,.045));
            color:#f1d58c;
            font-size:10px;font-weight:850;line-height:1;letter-spacing:.015em;
            box-shadow:inset 0 1px 0 rgba(255,244,213,.07),0 2px 8px rgba(0,0,0,.18);
            text-align:center;
            transition:border-color .16s ease,background .16s ease,box-shadow .16s ease,transform .12s ease,filter .16s ease;
          }
          @media(hover:hover) and (pointer:fine) {
            #settings-map-window-open:hover {
              border-color:rgba(244,205,116,.78);
              background:linear-gradient(180deg,rgba(241,202,111,.16),rgba(178,126,39,.065));
              box-shadow:inset 0 1px 0 rgba(255,247,220,.10),0 3px 10px rgba(0,0,0,.22),0 0 8px rgba(220,170,67,.08);
              filter:brightness(1.04);
            }
          }
          #settings-map-window-open:active { transform:translateY(1px) scale(.985);filter:brightness(.94); }
          #settings-map-window-open:focus-visible { outline:2px solid rgba(236,195,101,.78);outline-offset:2px; }
          @media(max-width:720px) {
            #settings-map-window-open { width:138px;min-width:138px;max-width:138px;height:36px;min-height:36px;margin-right:18px;font-size:11px;padding:0 12px; }
          }
          @media(max-width:520px) and (orientation:portrait) {
            #settings-map-window-open { width:122px;min-width:122px;max-width:122px;margin-right:16px;font-size:10.5px; }
          }

          /* V4.10.02 – Settings-Scrollvertrag:
             Genau ein vertikaler Scroller im Einstellungsdialog. Aufgeklappte
             Bereiche wachsen vollständig in .settings-body hinein; damit können
             iPad/WebKit und Android auch sehr hohe Bereiche zuverlässig bis zum
             letzten Bedienelement erreichen. Historische innere Accordion- und
             Radien-Scroller werden hier bewusst neutralisiert. */
          .settings-body {
            grid-auto-rows:max-content;
            align-content:start;
            overflow-y:auto!important;
            overflow-x:hidden!important;
            overscroll-behavior-y:contain;
            touch-action:pan-y;
            -webkit-overflow-scrolling:touch;
            scroll-padding-top:10px;
            scroll-padding-bottom:72px;
          }
          .settings-collapsible[open] > .settings-section-content,
          #settings-radii-section[open] > .settings-radius-list {
            max-height:none!important;
            overflow:visible!important;
            overscroll-behavior:auto!important;
            -webkit-overflow-scrolling:auto!important;
            scrollbar-gutter:auto!important;
            touch-action:auto!important;
          }
          #settings-radii-section[open] > .settings-radius-list {
            padding-bottom:10px!important;
            scroll-padding-bottom:0!important;
          }

          /* Kartendarstellung: Cluster-Navigation optisch vom äußeren
             Bereichsrahmen lösen, ohne die Control-Geometrie zu verändern. */
          #settings-map-section[open] > .settings-section-content {
            padding-top:6px;
            padding-bottom:8px;
          }
          #settings-map-section .settings-cluster-session-selector {
            margin-right:10px;
          }
          @media(max-width:520px) {
            #settings-map-section .settings-cluster-session-selector { margin-right:8px; }
          }
        </style>

        <ha-card id="card-root">
          <span id="sidebar-scroll-anchor" aria-hidden="true" style="position:absolute;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none;overflow-anchor:auto;"></span>
          <div class="alert-flash" id="alert-flash"><div class="flash-red"></div><div class="flash-ambient"></div><div class="flash-white"></div></div>

          <div class="shell">
            <div class="topbar">
              <div class="brand">
                <div class="eyebrow" id="source-status"><span class="live-dot initializing" id="source-status-dot" aria-hidden="true"></span> Blitzortung.org · Live</div>
                <h1 class="title"><span>Gewitterradar</span><span class="app-version-badge" id="app-version-badge" role="button" tabindex="0" aria-haspopup="dialog" aria-label="Open release history" title="Release history">V${CARD_DISPLAY_VERSION}</span></h1>
                <div class="subtitle" id="radar-subtitle">
                  <span id="radar-subtitle-location">Blitzeinschläge rund um Home</span><span class="subtitle-separator">·</span><span id="radar-subtitle-window">letzte ${HISTORY_MINUTES} Minuten</span>
                </div>
              </div>

              <div class="top-actions">
                <div class="header-chip-row">
                <button class="top-chip animation-chip" id="animation-toggle" type="button" title="Vollflächige Warnanimation ein- oder ausschalten">
                  <span class="bolt">⚡</span><span>Warnanimation</span><span class="state-dot"></span><strong id="animation-state">–</strong>
                </button>

                <!-- V3.518 TEST: beide Eskalationsstufen getrennt reproduzierbar. -->
                <button class="top-chip warning-test-chip storm-test" id="warning-test-top-storm" type="button"
                        data-warning-test="storm"
                        title="TEST: Gewitterstufe – nur weißen Blitz auslösen">
                  <span class="bolt">⚡</span><span>GEWITTER TEST</span>
                </button>
                <button class="top-chip warning-test-chip" id="warning-test-top-danger" type="button"
                        data-warning-test="danger"
                        title="TEST: Gefahrenstufe – weißen Blitz plus roten Schleier auslösen">
                  <span class="bolt">⚡</span><span>GEFAHR TEST</span>
                </button>

                <button class="top-chip status-chip disabled" id="status-chip" type="button"
                        title="Keine Blitzaktivität zum Fokussieren"
                        aria-label="Keine Blitzaktivität zum Fokussieren"
                        aria-disabled="true">
                  <span class="bolt">⚡</span><span id="header-status">Bereit</span>
                </button>

                </div>

                <div class="header-control-row">
                <div class="location-main-row" id="location-main-row">
                  <div class="location-main-shell">
                    <ha-icon class="location-main-pin" icon="mdi:crosshairs-gps"></ha-icon>
                    <span class="location-main-separator">·</span>
                    <button class="location-main-button" id="location-main-button" type="button"
                            aria-haspopup="listbox" aria-expanded="false" aria-label="Gewitterradar Bezugsstandort">
                      <span class="location-main-current" id="location-main-current">Zuhause</span>
                      <span class="location-main-chevron" aria-hidden="true">▾</span>
                    </button>
                  </div>
                </div>

                <button class="top-chip settings-chip settings-chip-premium" id="settings-open" type="button"
                        title="Gewitterradar-Einstellungen öffnen" aria-label="Einstellungen öffnen">
                  <svg class="gear gear-welcome" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><defs><linearGradient id="mainview-settings-metal" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#fff0bc"/><stop offset=".28" stop-color="#e8bd60"/><stop offset=".48" stop-color="#92703a"/><stop offset=".62" stop-color="#ffe2a0"/><stop offset="1" stop-color="#b58b44"/></linearGradient></defs><g stroke="url(#mainview-settings-metal)"><path d="M27 7Q32 5 37 7L38 14L43 17L50 14Q55 18 57 23L52 28V36L57 41Q55 46 50 50L43 47L38 50L37 57Q32 59 27 57L26 50L21 47L14 50Q9 46 7 41L12 36V28L7 23Q9 18 14 14L21 17L26 14Z"/><circle cx="32" cy="32" r="11"/><circle cx="32" cy="32" r="17" opacity=".25"/></g></svg>
                </button>
                </div>
              </div>
            </div>

            <div class="warn-banner" id="warn-banner"><span>⚡</span><span id="warn-text">Gewitter in der Nähe</span></div>

            <div class="radius-grid">
              <div class="radius-card observation">
                <div class="radius-head">
                  <span class="radius-title">Beobachtungsradius</span>
                  <div class="radius-tools">
                    <button class="radius-step" id="observation-minus" type="button" aria-label="Beobachtungsradius verkleinern">−</button>
                    <button class="radius-value radius-value-button" id="observation-input" type="button" aria-haspopup="dialog" aria-label="Beobachtungsradius direkt in Kilometern eingeben"><span class="radius-number" id="observation-value">–</span><span class="radius-unit">KM</span></button>
                    <button class="radius-step" id="observation-plus" type="button" aria-label="Beobachtungsradius vergrößern">+</button>
                  </div>
                </div>
                <input class="radius-slider" id="observation-slider" type="range" min="10" max="1000" step="5" value="200">
              </div>

              <div class="radius-card storm">
                <div class="radius-head">
                  <span class="radius-title">Gewitterradius</span>
                  <div class="radius-tools">
                    <button class="radius-step" id="storm-minus" type="button" aria-label="Gewitterradius verkleinern">−</button>
                    <button class="radius-value radius-value-button" id="storm-input" type="button" aria-haspopup="dialog" aria-label="Gewitterradius direkt in Kilometern eingeben"><span class="radius-number" id="storm-value">–</span><span class="radius-unit">KM</span></button>
                    <button class="radius-step" id="storm-plus" type="button" aria-label="Gewitterradius vergrößern">+</button>
                  </div>
                </div>
                <input class="radius-slider" id="storm-slider" type="range" min="5" max="1000" step="1" value="100">
              </div>

              <div class="radius-card danger">
                <div class="radius-head">
                  <span class="radius-title">Gefahrenradius</span>
                  <div class="radius-tools">
                    <button class="radius-step" id="danger-minus" type="button" aria-label="Gefahrenradius verkleinern">−</button>
                    <button class="radius-value radius-value-button" id="danger-input" type="button" aria-haspopup="dialog" aria-label="Gefahrenradius direkt in Kilometern eingeben"><span class="radius-number" id="danger-value">–</span><span class="radius-unit">KM</span></button>
                    <button class="radius-step" id="danger-plus" type="button" aria-label="Gefahrenradius vergrößern">+</button>
                  </div>
                </div>
                <input class="radius-slider" id="danger-slider" type="range" min="1" max="250" step="1" value="20">
              </div>
            </div>

            <div class="kpi-grid">
              <div class="kpi kpi-simple kpi-distance" style="--kpi-accent:${C.gold}">
                <span class="kpi-label">Entfernung</span>
                <div class="kpi-main">
                  <span class="kpi-value" id="kpi-distance">–</span>
                  <span class="kpi-sub">Letzter Blitz</span>
                </div>
                <span class="kpi-foot" aria-hidden="true"></span>
              </div>

              <div class="kpi kpi-simple kpi-azimuth" style="--kpi-accent:${C.blue}">
                <span class="kpi-label">Azimut</span>
                <div class="kpi-main">
                  <span class="kpi-value" id="kpi-azimuth">–</span>
                  <span class="kpi-sub kpi-cardinal-detail" id="kpi-cardinal">Richtung</span>
                </div>
                <span class="kpi-foot" aria-hidden="true"></span>
              </div>

              <div class="kpi kpi-hits" style="--kpi-accent:${C.gold}">
                <span class="kpi-label">Treffer · 60 Min</span>
                <div class="hit-columns">
                  <div class="hit-group left">
                    <span class="hit-number" id="hit-observation">0</span>
                    <span class="hit-caption">Beobachtungen</span>
                  </div>
                  <div class="hit-group right" id="danger-hit-group">
                    <span class="hit-number" id="hit-danger">0</span>
                    <span class="hit-caption">Gefahrenzone</span>
                  </div>
                </div>
                <div class="hit-live" id="hit-live"><strong>0 aktiv</strong> - <span class="danger-live">0 gefährlich</span></div>
              </div>

              <div class="kpi kpi-simple kpi-last" style="--kpi-accent:${C.cyan}">
                <span class="kpi-label">Zuletzt</span>
                <div class="kpi-main">
                  <span class="kpi-value" id="kpi-age">–</span>
                  <span class="kpi-sub" id="kpi-time">Keine Aktivität</span>
                </div>
                <span class="kpi-foot">Letzter Einschlag</span>
              </div>
            </div>

            <div class="main-grid">
              <div class="left-stack">
                <div id="map-card-anchor" hidden></div>
                <div class="map-card" id="map-card">
                  <div class="map-top-controls">
                    <button class="warning-test-mini storm-test" id="warning-test-map-storm" type="button"
                            data-warning-test="storm"
                            title="TEST: Gewitterstufe aus Kartenposition auslösen">
                      <span class="bolt">⚡</span><span>GEWITTER</span>
                    </button>
                    <button class="warning-test-mini" id="warning-test-map-danger" type="button"
                            data-warning-test="danger"
                            title="TEST: Gefahrenstufe aus Kartenposition auslösen">
                      <span class="bolt">⚡</span><span>GEFAHR</span>
                    </button>
                    <div class="map-mode-switch" aria-label="Darstellung der Blitzkarte">
                      <button class="map-mode-btn" id="map-mode-grouped" type="button" aria-pressed="true">Gruppiert</button>
                      <button class="map-mode-btn" id="map-mode-individual" type="button" aria-pressed="false">Einzelblitze</button>
                    </div>
                    <div class="map-radius-chip">
                      <span class="obs"><i style="background:${C.gold}"></i><span id="map-observation-radius" role="button" tabindex="0" data-radius-input-kind="observation">–</span></span>
                      <span class="storm"><i style="background:${C.blue}"></i><span id="map-storm-radius" role="button" tabindex="0" data-radius-input-kind="storm">–</span></span>
                      <span class="danger"><i style="background:${C.danger}"></i><span id="map-danger-radius" role="button" tabindex="0" data-radius-input-kind="danger">–</span></span>
                    </div>
                  </div>
                  <div class="map-location-overlay" id="map-location-overlay" hidden></div>
                  <div class="map-instrument-controls" id="map-instrument-controls" hidden>
                    <button class="map-instrument-toggle active" id="map-compass-toggle" type="button" aria-pressed="true" aria-label="Kompass">
                      <img class="map-compass-toggle-icon" src="${MAP_COMPASS_TOGGLE_IMAGE}" alt="" draggable="false" aria-hidden="true">
                    </button>
                    <button class="map-instrument-toggle active" id="map-medallion-toggle" type="button" aria-pressed="true" aria-label="Tendenz">
                      <img src="${TREND_MEDALLION_IMAGE}" alt="" draggable="false" aria-hidden="true">
                    </button>
                    <button class="map-instrument-toggle active" id="map-cluster-jump-toggle" type="button" aria-pressed="true" aria-label="Cluster-Navigation">
                      <img class="map-cluster-jump-toggle-icon" src="${GEWITTERRADAR_INFINITY_GFX}" alt="" draggable="false" aria-hidden="true">
                    </button>
                  </div>
                  <button class="map-cluster-jump-overlay" id="map-cluster-jump-overlay" type="button" hidden aria-live="polite">
                    <span id="map-cluster-jump-text">Cluster</span>
                  </button>
                  <button class="map-recenter-btn" id="map-recenter" type="button"
                          title="Ausgewählten Standort auf der Karte zentrieren"
                          aria-label="Ausgewählten Standort auf der Karte zentrieren">
                    <!-- V3.551: eigenes symmetrisches SVG statt ha-icon.
                         Dadurch sitzt das Fadenkreuz geometrisch exakt mittig. -->
                    <svg class="map-recenter-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="4.1" fill="currentColor"></circle>
                      <circle cx="12" cy="12" r="7.1" fill="none" stroke="currentColor" stroke-width="2.15"></circle>
                      <path d="M12 1.7V5 M12 19V22.3 M1.7 12H5 M19 12H22.3"
                            fill="none" stroke="currentColor" stroke-width="2.15" stroke-linecap="square"></path>
                    </svg>
                  </button>
                  <button class="map-strike-target-btn" id="map-strike-target" type="button" hidden
                          title="Ausgewählten Blitz fokussieren"
                          aria-label="Ausgewählten Blitz fokussieren">
                    <span class="recent-target-glyph map-strike-target-glyph" aria-hidden="true"></span>
                  </button>
                  <div id="map"></div>
                  <div class="map-display-fab" id="map-display-control">
                    <button class="map-display-fab-toggle" id="map-display-menu-toggle" type="button"
                            aria-haspopup="menu" aria-expanded="false" aria-label="Kartenansicht auswählen">
                      <img class="map-layer-stack3d-symbol" id="map-layer-stack3d-symbol" src="${MAP_LAYER_SYMBOL_STACK3D_IMAGE}" alt="" aria-hidden="true" draggable="false">
                    </button>
                    <div class="map-display-menu" id="map-display-switch" role="menu" hidden>
                      <div class="map-display-menu-title" id="map-display-menu-title">Kartenansicht</div>
                      <button class="map-display-btn" type="button" role="menuitemradio" data-map-display-mode="standard" aria-checked="true">Standard</button>
                      <button class="map-display-btn" type="button" role="menuitemradio" data-map-display-mode="large" aria-checked="false">Groß</button>
                      <button class="map-display-btn" type="button" role="menuitemradio" data-map-display-mode="fullscreen" aria-checked="false">Vollbild</button>
                    </div>
                  </div>
                  <div class="map-compass-overlay" id="map-compass-overlay" hidden></div>
                  <div class="map-medallion-overlay none" id="map-medallion-overlay" hidden>
                    <div class="trend-icon" aria-hidden="true">
                      <img class="trend-medallion-base" src="${TREND_MEDALLION_IMAGE}" alt="" draggable="false">
                      <img class="trend-medallion-arrow" src="${TREND_ARROW_IMAGE}" alt="" draggable="false">
                    </div>
                  </div>
                  <div class="map-legend" id="map-legend">
                    <span class="map-legend-group map-legend-primary">
                      <span class="legend-item"><i class="legend-dot" style="--legend-color:${C.gold}"></i>Aktiv &lt; 10 Min</span>
                      <span class="legend-item"><i class="legend-dot" style="--legend-color:${C.blue}"></i>10–120 Min</span>
                      <span class="legend-item"><i class="legend-dot" style="--legend-color:${C.purple}"></i>Extreme Blitzaktivität</span>
                    </span>
                    <span class="map-legend-group map-legend-radii">
                      <span class="legend-item" style="color:${C.blue}"><i class="legend-line"></i>Gewitter <span id="legend-storm-radius">–</span></span>
                      <span class="legend-item" style="color:${C.danger}"><i class="legend-line"></i>Gefahr <span id="legend-danger-radius">–</span></span>
                    </span>
                  </div>

                </div>

                <div class="weather-message-panel calm" id="weather-message-panel">
                  <div class="weather-message-quote" id="weather-message-quote">Ruhige Lage.</div>
                  <div class="weather-message-context" id="weather-message-context"><span>Beobachtungsradius</span></div>
                </div>

                <div class="panel history-panel">
                  <div class="history-layout">
                    <div class="history-main">
                      <div class="history-head">
                        <div>
                          <div class="panel-title">Verlauf · letzte ${HISTORY_MINUTES} Minuten</div>
                          <div class="history-sub">Blitzaktivität je ${HISTORY_BUCKET_MINUTES}-Minuten-Fenster</div>
                        </div>
                        <div class="history-test-actions">
                          <button class="warning-test-mini storm-test" id="warning-test-history-storm" type="button"
                                  data-warning-test="storm"
                                  title="TEST: Gewitterstufe aus Verlaufsposition auslösen">
                            <span class="bolt">⚡</span><span>GEWITTER</span>
                          </button>
                          <button class="warning-test-mini" id="warning-test-history-danger" type="button"
                                  data-warning-test="danger"
                                  title="TEST: Gefahrenstufe aus Verlaufsposition auslösen">
                            <span class="bolt">⚡</span><span>GEFAHR</span>
                          </button>
                        </div>
                      </div>

                      <svg id="history-chart" class="history-chart" viewBox="0 0 1000 118" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="historyGold" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#FFD86B"/>
                            <stop offset="18%" stop-color="#F4BC36"/>
                            <stop offset="48%" stop-color="#D89516"/>
                            <stop offset="78%" stop-color="#9E5F08"/>
                            <stop offset="100%" stop-color="#4A2902"/>
                          </linearGradient>
                          <linearGradient id="historyBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#69C4FF"/>
                            <stop offset="18%" stop-color="#3B9CF4"/>
                            <stop offset="48%" stop-color="#2375D2"/>
                            <stop offset="78%" stop-color="#124B91"/>
                            <stop offset="100%" stop-color="#061E37"/>
                          </linearGradient>
                          <linearGradient id="historyPurple" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#C48CFF"/>
                            <stop offset="18%" stop-color="#A966FF"/>
                            <stop offset="48%" stop-color="#8345E9"/>
                            <stop offset="78%" stop-color="#5524A0"/>
                            <stop offset="100%" stop-color="#220B3F"/>
                          </linearGradient>
                          <linearGradient id="historyDanger" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#FF7B85"/>
                            <stop offset="18%" stop-color="#FF5361"/>
                            <stop offset="48%" stop-color="#D93446"/>
                            <stop offset="78%" stop-color="#8D1828"/>
                            <stop offset="100%" stop-color="#3A0710"/>
                          </linearGradient>
                          <filter id="historySoftGlow" x="-80%" y="-30%" width="260%" height="160%">
                            <feGaussianBlur id="historySoftBlur" stdDeviation=".72" result="blur"/>
                            <feMerge>
                              <feMergeNode in="blur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                          <filter id="historyBarAura" x="-220%" y="-45%" width="540%" height="200%" color-interpolation-filters="sRGB">
                            <!-- breite, weiche Farbaura -->
                            <feGaussianBlur id="historyAuraBlurWide" in="SourceGraphic" stdDeviation="1.72" result="blurWide"/>
                            <feColorMatrix in="blurWide" type="matrix"
                              values="1.08 0 0 0 0  0 1.08 0 0 0  0 0 1.08 0 0  0 0 0 .88 0"
                              result="glowWide"/>
                            <!-- enger, klarerer Lichtsaum -->
                            <feGaussianBlur id="historyAuraBlurTight" in="SourceGraphic" stdDeviation=".58" result="blurTight"/>
                            <feColorMatrix in="blurTight" type="matrix"
                              values="1.12 0 0 0 0  0 1.12 0 0 0  0 0 1.12 0 0  0 0 0 1 0"
                              result="glowTight"/>
                            <feMerge>
                              <feMergeNode in="glowWide"/>
                              <feMergeNode in="glowTight"/>
                            </feMerge>
                          </filter>

                          <!-- V3.36 – metallisch-blaue Hintergrundaura im Chart -->
                          <linearGradient id="historyBackdropBase" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stop-color="#020814"/>
                            <stop offset="18%" stop-color="#071226"/>
                            <stop offset="49%" stop-color="#09162a"/>
                            <stop offset="82%" stop-color="#061021"/>
                            <stop offset="100%" stop-color="#020814"/>
                          </linearGradient>
                          <linearGradient id="historyBackdropSheen" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stop-color="#5ca6ff" stop-opacity="0"/>
                            <stop offset="18%" stop-color="#4f95f1" stop-opacity=".03"/>
                            <stop offset="30%" stop-color="#7fbfff" stop-opacity=".09"/>
                            <stop offset="44%" stop-color="#4b8fe0" stop-opacity=".02"/>
                            <stop offset="62%" stop-color="#9bd0ff" stop-opacity=".08"/>
                            <stop offset="78%" stop-color="#3b7fd6" stop-opacity=".02"/>
                            <stop offset="92%" stop-color="#79b7ff" stop-opacity=".07"/>
                            <stop offset="100%" stop-color="#79b7ff" stop-opacity="0"/>
                          </linearGradient>
                          <linearGradient id="historyBrush" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#ffffff" stop-opacity=".018"/>
                            <stop offset="20%" stop-color="#ffffff" stop-opacity="0"/>
                            <stop offset="50%" stop-color="#7baee6" stop-opacity=".022"/>
                            <stop offset="100%" stop-color="#000000" stop-opacity=".06"/>
                          </linearGradient>
                          <radialGradient id="historyLeftBloom" cx="28%" cy="72%" r="55%">
                            <stop offset="0%" stop-color="#1b64d0" stop-opacity=".06"/>
                            <stop offset="40%" stop-color="#1b64d0" stop-opacity=".028"/>
                            <stop offset="100%" stop-color="#1b64d0" stop-opacity="0"/>
                          </radialGradient>
                          <radialGradient id="historyRightBloom" cx="88%" cy="18%" r="32%">
                            <stop offset="0%" stop-color="#7dbdff" stop-opacity=".08"/>
                            <stop offset="45%" stop-color="#7dbdff" stop-opacity=".022"/>
                            <stop offset="100%" stop-color="#7dbdff" stop-opacity="0"/>
                          </radialGradient>
                          <!-- horizontaler Metall-/Glanzverlauf über dem farbigen Balkenkörper -->
                          <linearGradient id="historyMetalSheen" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%"   stop-color="#000000" stop-opacity=".22"/>
                            <stop offset="14%"  stop-color="#FFFFFF" stop-opacity=".05"/>
                            <stop offset="28%"  stop-color="#FFFFFF" stop-opacity=".26"/>
                            <stop offset="43%"  stop-color="#FFFFFF" stop-opacity=".07"/>
                            <stop offset="58%"  stop-color="#000000" stop-opacity=".12"/>
                            <stop offset="76%"  stop-color="#FFFFFF" stop-opacity=".13"/>
                            <stop offset="100%" stop-color="#000000" stop-opacity=".24"/>

                        </defs>
                        <g id="history-grid"></g>
                        <g id="history-bars"></g>
                        <g id="history-labels"></g>
                      </svg>
                      <div class="empty-chart" id="empty-chart">Noch keine Blitzaktivität im Beobachtungsradius.</div>

                      <div class="footer-row">
                        <span>Gesamtzähler: <strong id="footer-total">–</strong></span>
                        <span>Letzte Aktualisierung: <strong id="footer-update">–</strong></span>
                      </div>
                    </div>

                    <div class="trend none" id="trend-box">
                      <span class="tlabel">Tendenz</span>
                      <div class="trend-icon" id="trend-icon" aria-hidden="true">
                        <img
                          class="trend-medallion-base"
                          src="${TREND_MEDALLION_IMAGE}"
                          alt=""
                          draggable="false"
                        >
                        <img
                          class="trend-medallion-arrow"
                          src="${TREND_ARROW_IMAGE}"
                          alt=""
                          draggable="false"
                        >
                        <svg class="medallion-calibration-overlay" id="medallion-calibration-overlay" viewBox="0 0 100 100" aria-hidden="true"></svg>
                      </div>
                      <div class="trend-copy">
                        <span class="tvalue" id="trend-value">Keine Aktivität</span>
                        <span class="tsub" id="trend-sub">keine Gewitteraktivität</span>
                      </div>
                      <button class="medallion-calibration-launcher" id="medallion-calibration-measurements" type="button">Medaillon-Messwerte</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="side-stack">
                <div class="panel recent-panel">
                  <div class="recent-panel-head">
                    <div class="panel-title" id="recent-panel-title">Letzte Blitzaktivität</div>
                  </div>
                  <div class="recent-filter-stack" id="recent-filter-stack">
                    <div class="recent-filter-group radius" id="recent-radius-filter" role="group" aria-label="Radiusfilter der letzten Blitzaktivität">
                      <button class="recent-filter-btn" type="button" data-recent-radius-filter="danger" aria-pressed="false" style="--radius-filter-color:${C.danger};--radius-filter-dash:5px;--radius-filter-gap:6px">
                        <span class="recent-radius-label">GEFAHR</span>
                      </button>
                      <button class="recent-filter-btn" type="button" data-recent-radius-filter="storm" aria-pressed="false" style="--radius-filter-color:${C.blue};--radius-filter-dash:3px;--radius-filter-gap:6px">
                        <span class="recent-radius-label">GEWITTER</span>
                      </button>
                      <button class="recent-filter-btn active" type="button" data-recent-radius-filter="observation" aria-pressed="true" style="--radius-filter-color:${C.gold};--radius-filter-dash:8px;--radius-filter-gap:7px">
                        <span class="recent-radius-label">BEOBACHTUNG</span>
                      </button>
                    </div>
                  </div>
                  <div class="recent-context" id="recent-context"></div>
                  <div id="recent-content"></div>
                </div>

                <div class="panel compass-panel">
                  <div class="compass-head">
                    <div class="compass-design-switch compass-design-left" id="compass-design-selector" role="group" aria-label="Kompassvariante">
                      <img class="compass-selector-frame-image" id="compass-selector-frame-image" alt="" aria-hidden="true">
                      <button class="compass-design-button" id="compass-design-prev" type="button" title="Vorherige Kompassvariante" aria-label="Vorherige Kompassvariante"><span class="compass-design-fallback-arrow" aria-hidden="true">◀</span></button>
                      <output class="compass-design-index" id="compass-design-index" aria-live="polite">1 / 6</output>
                      <button class="compass-design-button" id="compass-design-next" type="button" title="Nächste Kompassvariante" aria-label="Nächste Kompassvariante"><span class="compass-design-fallback-arrow" aria-hidden="true">▶</span></button>
                    </div>

                    <div class="compass-actions">
                      <button class="warning-test-mini storm-test" id="warning-test-compass-storm" type="button"
                              data-warning-test="storm"
                              title="TEST: Gewitterstufe aus Kompassposition auslösen">
                        <span class="bolt">⚡</span><span>GEWITTER</span>
                      </button>
                      <button class="warning-test-mini" id="warning-test-compass-danger" type="button"
                              data-warning-test="danger"
                              title="TEST: Gefahrenstufe aus Kompassposition auslösen">
                        <span class="bolt">⚡</span><span>GEFAHR</span>
                      </button>
                    </div>
                  </div>

                  <div class="compass-wrap">
                    <div class="compass-instrument design-c" id="compass-instrument">
                      <div class="compass-aperture-backing" id="compass-aperture-backing" aria-hidden="true"></div>
                      <svg id="compass" viewBox="0 0 280 280" aria-label="Premium-Kompass im Entwurfsdesign">
                      <defs>
                        <!-- tiefes, leicht glasiges Instrumentenzifferblatt -->
                        <radialGradient id="dialFace" cx="39%" cy="31%" r="76%">
                          <stop offset="0%" stop-color="#303844"/>
                          <stop offset="20%" stop-color="#222934"/>
                          <stop offset="50%" stop-color="#121720"/>
                          <stop offset="77%" stop-color="#090c11"/>
                          <stop offset="100%" stop-color="#030507"/>
                        </radialGradient>
                        <radialGradient id="dialSheen" cx="28%" cy="20%" r="72%">
                          <stop offset="0%" stop-color="rgba(255,255,255,.15)"/>
                          <stop offset="24%" stop-color="rgba(255,255,255,.035)"/>
                          <stop offset="59%" stop-color="rgba(255,255,255,0)"/>
                          <stop offset="100%" stop-color="rgba(0,0,0,.28)"/>
                        </radialGradient>

                        <!-- Gehäuse und separater äußerer Grad-Ring -->
                        <linearGradient id="metalOuter" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stop-color="#f8fafb"/>
                          <stop offset="5%" stop-color="#777e86"/>
                          <stop offset="12%" stop-color="#20252b"/>
                          <stop offset="21%" stop-color="#d9dde0"/>
                          <stop offset="32%" stop-color="#4b525a"/>
                          <stop offset="44%" stop-color="#fcfcfd"/>
                          <stop offset="55%" stop-color="#747b83"/>
                          <stop offset="68%" stop-color="#2d333a"/>
                          <stop offset="80%" stop-color="#e8ebed"/>
                          <stop offset="91%" stop-color="#555c63"/>
                          <stop offset="100%" stop-color="#c7cbce"/>
                        </linearGradient>
                        <linearGradient id="degreeMetal" x1="0" y1="1" x2="1" y2="0">
                          <stop offset="0%" stop-color="#090b0f"/>
                          <stop offset="18%" stop-color="#272c31"/>
                          <stop offset="34%" stop-color="#111419"/>
                          <stop offset="50%" stop-color="#3a3f45"/>
                          <stop offset="66%" stop-color="#101318"/>
                          <stop offset="84%" stop-color="#292e34"/>
                          <stop offset="100%" stop-color="#080a0e"/>
                        </linearGradient>

                        <!-- sehr feine Materialtexturen: Hammerschlag + gebürstetes Metall -->
                        <filter id="hammerSteel" x="-18%" y="-18%" width="136%" height="136%" color-interpolation-filters="sRGB">
                          <!-- feiner, zurückgenommener Hammerschlag: als Materialtiefe sichtbar, aber nicht dominant -->
                          <feTurbulence type="fractalNoise" baseFrequency=".048 .070" numOctaves="2" seed="27" result="steelNoise"/>
                          <feGaussianBlur in="steelNoise" stdDeviation=".24" result="steelNoiseSoft"/>
                          <feDiffuseLighting in="steelNoiseSoft" surfaceScale="1.05" diffuseConstant=".22" lighting-color="#b8bec4" result="steelDiffuse">
                            <feDistantLight azimuth="226" elevation="48"/>
                          </feDiffuseLighting>
                          <feSpecularLighting in="steelNoiseSoft" surfaceScale="1.45" specularConstant=".34" specularExponent="18" lighting-color="#ffffff" result="steelSpec">
                            <feDistantLight azimuth="224" elevation="54"/>
                          </feSpecularLighting>
                          <feComposite in="steelDiffuse" in2="SourceAlpha" operator="in" result="steelDiffuseClip"/>
                          <feComposite in="steelSpec" in2="SourceAlpha" operator="in" result="steelSpecClip"/>
                          <feBlend in="SourceGraphic" in2="steelDiffuseClip" mode="soft-light" result="steelBase"/>
                          <feBlend in="steelBase" in2="steelSpecClip" mode="screen"/>
                        </filter>
                        <filter id="hammerGold" x="-22%" y="-22%" width="144%" height="144%" color-interpolation-filters="sRGB">
                          <!-- sehr dezente Messing-Mikrostruktur für den Nadelkopf -->
                          <feTurbulence type="fractalNoise" baseFrequency=".072 .100" numOctaves="2" seed="41" result="goldNoise"/>
                          <feGaussianBlur in="goldNoise" stdDeviation=".20" result="goldNoiseSoft"/>
                          <feDiffuseLighting in="goldNoiseSoft" surfaceScale=".48" diffuseConstant=".14" lighting-color="#b98a32" result="goldDiffuse">
                            <feDistantLight azimuth="218" elevation="50"/>
                          </feDiffuseLighting>
                          <feSpecularLighting in="goldNoiseSoft" surfaceScale=".70" specularConstant=".22" specularExponent="20" lighting-color="#fff4bd" result="goldSpec">
                            <feDistantLight azimuth="220" elevation="58"/>
                          </feSpecularLighting>
                          <feComposite in="goldDiffuse" in2="SourceAlpha" operator="in" result="goldDiffuseClip"/>
                          <feComposite in="goldSpec" in2="SourceAlpha" operator="in" result="goldSpecClip"/>
                          <feBlend in="SourceGraphic" in2="goldDiffuseClip" mode="soft-light" result="goldBase"/>
                          <feBlend in="goldBase" in2="goldSpecClip" mode="screen"/>
                        </filter>

                        <!-- Premium-Nadel -->
                        <linearGradient id="needleMetal" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stop-color="#20252b"/>
                          <stop offset="13%" stop-color="#6a7179"/>
                          <stop offset="28%" stop-color="#d9dde0"/>
                          <stop offset="42%" stop-color="#ffffff"/>
                          <stop offset="53%" stop-color="#7c838b"/>
                          <stop offset="65%" stop-color="#f7f8f9"/>
                          <stop offset="81%" stop-color="#747b83"/>
                          <stop offset="100%" stop-color="#1d2126"/>
                        </linearGradient>
                        <linearGradient id="needleNeutral" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stop-color="#6e757d"/>
                          <stop offset="33%" stop-color="#d4d8dc"/>
                          <stop offset="55%" stop-color="#767d85"/>
                          <stop offset="78%" stop-color="#b6bbc1"/>
                          <stop offset="100%" stop-color="#343a41"/>
                        </linearGradient>
                        <linearGradient id="needleGold" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stop-color="#fff7cb"/>
                          <stop offset="16%" stop-color="#ffe27a"/>
                          <stop offset="38%" stop-color="#F6C344"/>
                          <stop offset="62%" stop-color="#d09216"/>
                          <stop offset="82%" stop-color="#7a4507"/>
                          <stop offset="100%" stop-color="#2f1900"/>
                        </linearGradient>
                        <linearGradient id="needleBlue" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stop-color="#eefaff"/>
                          <stop offset="17%" stop-color="#a9ddff"/>
                          <stop offset="40%" stop-color="#4FA3F7"/>
                          <stop offset="64%" stop-color="#287acb"/>
                          <stop offset="83%" stop-color="#11436f"/>
                          <stop offset="100%" stop-color="#061b2f"/>
                        </linearGradient>
                        <linearGradient id="needleRed" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stop-color="#fff0f2"/>
                          <stop offset="17%" stop-color="#ffadb5"/>
                          <stop offset="40%" stop-color="#FF5A67"/>
                          <stop offset="64%" stop-color="#da2739"/>
                          <stop offset="83%" stop-color="#7c101c"/>
                          <stop offset="100%" stop-color="#390409"/>
                        </linearGradient>
                        <linearGradient id="needleDarkFacet" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stop-color="rgba(0,0,0,.72)"/>
                          <stop offset="58%" stop-color="rgba(18,21,25,.34)"/>
                          <stop offset="100%" stop-color="rgba(255,255,255,.12)"/>
                        </linearGradient>

                        <!-- Messing-Zentrum -->
                        <radialGradient id="screwRim" cx="33%" cy="27%" r="77%">
                          <stop offset="0%" stop-color="#fffbe4"/>
                          <stop offset="14%" stop-color="#f8df8b"/>
                          <stop offset="34%" stop-color="#d39f2d"/>
                          <stop offset="53%" stop-color="#6e490d"/>
                          <stop offset="70%" stop-color="#c28c1b"/>
                          <stop offset="86%" stop-color="#f2c654"/>
                          <stop offset="100%" stop-color="#271800"/>
                        </radialGradient>
                        <radialGradient id="screwGold" cx="30%" cy="24%" r="78%">
                          <stop offset="0%" stop-color="#fffde8"/>
                          <stop offset="18%" stop-color="#ffe98e"/>
                          <stop offset="43%" stop-color="#efb832"/>
                          <stop offset="68%" stop-color="#986109"/>
                          <stop offset="100%" stop-color="#2e1a00"/>
                        </radialGradient>

                        <!-- Echte kontinuierliche Zielbogen-Verläufe: keine Segment-/Punktoptik mehr. -->
                        <linearGradient id="arcGoldFade" x1="0%" y1="50%" x2="100%" y2="50%">
                          <stop offset="0%" stop-color="${C.gold}" stop-opacity="0"/>
                          <stop offset="10%" stop-color="${C.gold}" stop-opacity=".07"/>
                          <stop offset="22%" stop-color="${C.gold}" stop-opacity=".22"/>
                          <stop offset="36%" stop-color="${C.gold}" stop-opacity=".58"/>
                          <stop offset="46%" stop-color="${C.gold}" stop-opacity=".90"/>
                          <stop offset="50%" stop-color="${C.gold}" stop-opacity="1"/>
                          <stop offset="54%" stop-color="${C.gold}" stop-opacity=".90"/>
                          <stop offset="64%" stop-color="${C.gold}" stop-opacity=".58"/>
                          <stop offset="78%" stop-color="${C.gold}" stop-opacity=".22"/>
                          <stop offset="90%" stop-color="${C.gold}" stop-opacity=".07"/>
                          <stop offset="100%" stop-color="${C.gold}" stop-opacity="0"/>
                        </linearGradient>
                        <linearGradient id="arcBlueFade" x1="0%" y1="50%" x2="100%" y2="50%">
                          <stop offset="0%" stop-color="${C.blue}" stop-opacity="0"/>
                          <stop offset="10%" stop-color="${C.blue}" stop-opacity=".07"/>
                          <stop offset="22%" stop-color="${C.blue}" stop-opacity=".22"/>
                          <stop offset="36%" stop-color="${C.blue}" stop-opacity=".58"/>
                          <stop offset="46%" stop-color="${C.blue}" stop-opacity=".90"/>
                          <stop offset="50%" stop-color="${C.blue}" stop-opacity="1"/>
                          <stop offset="54%" stop-color="${C.blue}" stop-opacity=".90"/>
                          <stop offset="64%" stop-color="${C.blue}" stop-opacity=".58"/>
                          <stop offset="78%" stop-color="${C.blue}" stop-opacity=".22"/>
                          <stop offset="90%" stop-color="${C.blue}" stop-opacity=".07"/>
                          <stop offset="100%" stop-color="${C.blue}" stop-opacity="0"/>
                        </linearGradient>
                        <linearGradient id="arcRedFade" x1="0%" y1="50%" x2="100%" y2="50%">
                          <stop offset="0%" stop-color="${C.danger}" stop-opacity="0"/>
                          <stop offset="10%" stop-color="${C.danger}" stop-opacity=".08"/>
                          <stop offset="22%" stop-color="${C.danger}" stop-opacity=".26"/>
                          <stop offset="36%" stop-color="${C.danger}" stop-opacity=".64"/>
                          <stop offset="46%" stop-color="${C.danger}" stop-opacity=".97"/>
                          <stop offset="50%" stop-color="${C.danger}" stop-opacity="1"/>
                          <stop offset="54%" stop-color="${C.danger}" stop-opacity=".97"/>
                          <stop offset="64%" stop-color="${C.danger}" stop-opacity=".64"/>
                          <stop offset="78%" stop-color="${C.danger}" stop-opacity=".26"/>
                          <stop offset="90%" stop-color="${C.danger}" stop-opacity=".08"/>
                          <stop offset="100%" stop-color="${C.danger}" stop-opacity="0"/>
                        </linearGradient>

                        <pattern id="brushPattern" width="4" height="4" patternUnits="userSpaceOnUse">
                          <path d="M0 1 H4 M0 3 H4" stroke="rgba(255,255,255,.15)" stroke-width=".32"/>
                        </pattern>
                        <filter id="ringBrushSoft" x="-8%" y="-8%" width="116%" height="116%">
                          <feGaussianBlur stdDeviation=".08"/>
                        </filter>
                        <clipPath id="targetNeedleClip">
                          <path d="M140 34 L154 124 Q156 132 146 140 L140 132 L134 140 Q124 132 126 124 Z"/>
                        </clipPath>
                        <clipPath id="tailNeedleClip">
                          <path d="M140 246 L151 154 Q152 146 146 140 L140 149 L134 140 Q128 146 129 154 Z"/>
                        </clipPath>

                        <filter id="softGlow" x="-70%" y="-70%" width="240%" height="240%">
                          <feGaussianBlur stdDeviation="2.4" result="b"/>
                          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <filter id="arcGlow" x="-100%" y="-100%" width="300%" height="300%">
                          <feGaussianBlur stdDeviation="3.8" result="blur"/>
                          <feComponentTransfer in="blur" result="soft"><feFuncA type="linear" slope=".82"/></feComponentTransfer>
                          <feMerge><feMergeNode in="soft"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <filter id="tipGlow" x="-170%" y="-170%" width="440%" height="440%">
                          <feGaussianBlur stdDeviation="3.5" result="blur"/>
                          <feComponentTransfer in="blur" result="soft"><feFuncA type="linear" slope=".9"/></feComponentTransfer>
                          <feMerge><feMergeNode in="soft"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <filter id="targetGlow" x="-120%" y="-120%" width="340%" height="340%">
                          <feGaussianBlur stdDeviation="3.1" result="b"/>
                          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <filter id="needleShadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="0" dy="3.1" stdDeviation="3" flood-color="#000" flood-opacity=".78"/>
                        </filter>
                        <filter id="capShadow" x="-60%" y="-60%" width="220%" height="220%">
                          <feDropShadow dx="0" dy="2.4" stdDeviation="2.8" flood-color="#000" flood-opacity=".80"/>
                        </filter>
                      </defs>

                      <!-- Gehäuse: mehrlagiges Metall mit feinem Hammerschlag und konzentrischer Bürstung -->
                      <g id="compass-outer-housing">
                      <circle cx="140" cy="140" r="136" fill="#020305" stroke="rgba(0,0,0,.95)" stroke-width="2"/>
                      <circle cx="140" cy="140" r="132.9" fill="none" stroke="url(#metalOuter)" stroke-width="6.2" filter="url(#hammerSteel)"/>
                      <!-- feine, leicht sichtbare konzentrische Bürstspuren; bewusst nur im äußeren Gehäusering -->
                      <g fill="none" stroke-linecap="round" filter="url(#ringBrushSoft)" opacity=".82">
                        <circle cx="140" cy="140" r="135.48" stroke="rgba(255,255,255,.28)" stroke-width=".18" stroke-dasharray="15 2.4 5 1.6"/>
                        <circle cx="140" cy="140" r="134.88" stroke="rgba(10,13,17,.62)" stroke-width=".18" stroke-dasharray="8 1.5 18 2.1"/>
                        <circle cx="140" cy="140" r="134.30" stroke="rgba(255,255,255,.23)" stroke-width=".16" stroke-dasharray="22 2.7 7 1.7"/>
                        <circle cx="140" cy="140" r="133.72" stroke="rgba(18,21,25,.58)" stroke-width=".17" stroke-dasharray="11 1.8 4 1.25"/>
                        <circle cx="140" cy="140" r="133.13" stroke="rgba(255,255,255,.20)" stroke-width=".15" stroke-dasharray="19 2.2 7 1.5"/>
                        <circle cx="140" cy="140" r="132.55" stroke="rgba(0,0,0,.54)" stroke-width=".17" stroke-dasharray="6 1.3 14 1.9"/>
                        <circle cx="140" cy="140" r="131.98" stroke="rgba(255,255,255,.14)" stroke-width=".14" stroke-dasharray="12 2.1 3 1.1 8 1.6"/>
                        <circle cx="140" cy="140" r="131.40" stroke="rgba(7,10,14,.50)" stroke-width=".15" stroke-dasharray="20 2.4 5 1.35"/>
                        <circle cx="140" cy="140" r="130.82" stroke="rgba(255,255,255,.16)" stroke-width=".14" stroke-dasharray="9 1.5 17 2.0"/>
                        <circle cx="140" cy="140" r="130.22" stroke="rgba(5,8,12,.50)" stroke-width=".15" stroke-dasharray="14 1.9 5 1.2"/>
                      </g>
                      <!-- polierte Lichtkanten bleiben über der Textur scharf -->
                      <circle cx="140" cy="140" r="135.95" fill="none" stroke="rgba(255,255,255,.34)" stroke-width=".48" opacity=".78"/>
                      <circle cx="140" cy="140" r="129.85" fill="none" stroke="rgba(10,12,16,.86)" stroke-width=".48"/>
                      <circle cx="140" cy="140" r="129.20" fill="none" stroke="rgba(255,255,255,.42)" stroke-width=".68"/>
                      </g>

                      <!-- klar abgesetzter äußerer Grad-Ring wie im Entwurf -->
                      <circle id="compass-degree-metal-ring" cx="140" cy="140" r="122.2" fill="none" stroke="url(#degreeMetal)" stroke-width="7.4"/>
                      <circle id="compass-degree-outer-ring" cx="140" cy="140" r="126.0" fill="none" stroke="rgba(246,195,68,.22)" stroke-width=".55"/>
                      <circle id="compass-degree-inner-ring" cx="140" cy="140" r="118.15" fill="none" stroke="rgba(246,195,68,.43)" stroke-width=".82"/>
                      <circle id="compass-dial-face" data-calibration-boundary="cover-contour" cx="140" cy="140" r="116.4" fill="url(#dialFace)" stroke="rgba(255,255,255,.10)" stroke-width=".7"/>
                      <circle id="compass-protected-boundary" data-calibration-boundary="protected-tick-contour" cx="140" cy="140" r="130.84" fill="none" stroke="none" pointer-events="none" visibility="hidden"/>
                      <circle id="compass-dial-sheen" cx="140" cy="140" r="115.1" fill="url(#dialSheen)"/>

                      <!-- V3.49: dynamischer Gradkranz für Kompass C.
                           Er ersetzt dort die drei statischen Kreisringe und folgt
                           unten weich der engeren Öffnung der V2-Einfassung. -->
                      <g id="compass-degree-crown"></g>

                      <!-- erdbezogene Kompassrose -->
                      <g id="compass-dial" transform="rotate(0 140 140)">
                        <!--
                          Zweistufige Zielbögen wie im Entwurf – jetzt als echte, durchgehende
                          SVG-Farbverläufe. Die Mitte leuchtet kräftig, beide Seiten laufen ohne
                          Segmentpunkte weich bis vollständig transparent aus.
                        -->
                        <g id="outer-bearing-arc-group" opacity="0" transform="rotate(0 140 140)">
                          <path id="outer-bearing-arc-halo" fill="none" stroke="url(#arcGoldFade)" stroke-width="11.0" stroke-linecap="round" opacity=".20" filter="url(#arcGlow)"/>
                          <path id="outer-bearing-arc-main" fill="none" stroke="url(#arcGoldFade)" stroke-width="5.55" stroke-linecap="round" opacity="1"/>
                          <path id="outer-bearing-arc-glint" fill="none" stroke="url(#arcGoldFade)" stroke-width="1.15" stroke-linecap="round" opacity=".64"/>
                        </g>
                        <g id="inner-bearing-arc-group" opacity="0" transform="rotate(0 140 140)">
                          <path id="inner-bearing-arc-halo" fill="none" stroke="url(#arcGoldFade)" stroke-width="6.8" stroke-linecap="round" opacity=".14" filter="url(#softGlow)"/>
                          <path id="inner-bearing-arc-main" fill="none" stroke="url(#arcGoldFade)" stroke-width="3.15" stroke-linecap="round" opacity=".88"/>
                          <path id="inner-bearing-arc-glint" fill="none" stroke="url(#arcGoldFade)" stroke-width=".72" stroke-linecap="round" opacity=".48"/>
                        </g>

                        <!-- schlanker, facettierter Lichtkeil in Zielrichtung – wie beim ursprünglichen Entwurf -->
                        <g id="bearing-sector" transform="rotate(0 140 140)" opacity="0">
                          <path id="bearing-sector-main" d="M140 140 L132 66 Q140 59 148 66 Z" fill="${C.gold}" opacity=".085"/>
                          <path id="bearing-sector-core" d="M140 140 L136.5 66 Q140 62 143.5 66 Z" fill="${C.gold}" opacity=".22"/>
                          <path id="bearing-sector-edge" d="M140 140 L139 65 Q140 63 141 65 Z" fill="rgba(255,255,255,.82)" opacity=".22"/>
                        </g>

                        <!-- klarer Zielmarker genau auf der Einschlagsrichtung -->
                        <g id="bearing-target" transform="rotate(0 140 140)" opacity="0" filter="url(#targetGlow)">
                          <line id="bearing-target-line" x1="140" y1="18.5" x2="140" y2="32.5" stroke="${C.gold}" stroke-width="1.75" stroke-linecap="round"/>
                          <circle id="bearing-target-halo" cx="140" cy="25.0" r="7.4" fill="none" stroke="${C.gold}" stroke-width="1.25" opacity=".56"/>
                          <circle id="bearing-target-core" cx="140" cy="25.0" r="3.25" fill="${C.gold}" stroke="rgba(255,255,255,.94)" stroke-width=".72"/>
                          <circle id="bearing-target-hot" cx="139.0" cy="23.9" r="1.15" fill="rgba(255,255,255,.92)"/>
                        </g>

                        <g id="compass-ring-ticks"></g>
                        <g id="compass-ticks"></g>
                        <g id="compass-degrees"></g>

                        <!-- feine innere Kompassrose -->
                        <circle class="compass-inner-rose-art" cx="140" cy="140" r="91" fill="none" stroke="rgba(255,255,255,.060)" stroke-width=".72"/>
                        <circle class="compass-inner-rose-art" cx="140" cy="140" r="63" fill="none" stroke="rgba(255,255,255,.032)" stroke-width=".62"/>
                        <g class="compass-inner-rose-art" stroke="rgba(225,230,236,.13)" fill="none">
                          <path d="M140 54 L146 126 L140 140 L134 126 Z" stroke-width=".72"/>
                          <path d="M226 140 L154 146 L140 140 L154 134 Z" stroke-width=".72"/>
                          <path d="M140 226 L134 154 L140 140 L146 154 Z" stroke-width=".72"/>
                          <path d="M54 140 L126 134 L140 140 L126 146 Z" stroke-width=".72"/>
                          <path d="M79 79 L130 130 M201 79 L150 130 M201 201 L150 150 M79 201 L130 150" stroke-width=".55" opacity=".72"/>
                        </g>

                        <!-- Himmelsrichtungen wie im Entwurf: klar innerhalb des Grad-Rings -->
                        <text class="compass-inner-rose-art" x="140" y="82" text-anchor="middle" fill="#f7f8fa" font-size="20" font-weight="790">N</text>
                        <text class="compass-inner-rose-art" x="199" y="147" text-anchor="middle" fill="#eef0f2" font-size="18" font-weight="770">O</text>
                        <text class="compass-inner-rose-art" x="140" y="211" text-anchor="middle" fill="#eef0f2" font-size="18" font-weight="770">S</text>
                        <text class="compass-inner-rose-art" x="81" y="147" text-anchor="middle" fill="#eef0f2" font-size="18" font-weight="770">W</text>
                        <text class="compass-inner-rose-art" x="184" y="99" text-anchor="middle" fill="#b1b7c0" font-size="9">NO</text>
                        <text class="compass-inner-rose-art" x="184" y="184" text-anchor="middle" fill="#b1b7c0" font-size="9">SO</text>
                        <text class="compass-inner-rose-art" x="96" y="184" text-anchor="middle" fill="#b1b7c0" font-size="9">SW</text>
                        <text class="compass-inner-rose-art" x="96" y="99" text-anchor="middle" fill="#b1b7c0" font-size="9">NW</text>
                      </g>

                      <!-- elegante zweigeteilte Entwurfs-Nadel -->
                      <g id="compass-needle" transform="rotate(0 140 140)" filter="url(#needleShadow)">
                        <!-- Ziel- bzw. Nordhälfte -->
                        <path id="needle-target" d="M140 34 L154 124 Q156 132 146 140 L140 132 L134 140 Q124 132 126 124 Z"
                              fill="url(#needleNeutral)" stroke="rgba(255,255,255,.48)" stroke-width=".72"/>
                        <path id="needle-target-left" d="M140 34 L140 132 L134 140 Q124 132 126 124 Z" fill="rgba(0,0,0,.24)"/>
                        <path id="needle-target-right" d="M140 34 L154 124 Q156 132 146 140 L140 132 Z" fill="rgba(255,255,255,.20)"/>
                        <path id="needle-target-ridge" d="M140 36 L145 123 L140 132 L135 123 Z" fill="rgba(255,255,255,.31)"/>
                        <path id="needle-north-accent" d="M140 35 L144 57 L140 52 L136 57 Z" fill="${C.gold}" opacity="0" filter="url(#softGlow)"/>
                        <!-- farblicher Einschlagsakzent an der aktiven Nadelspitze -->
                        <g id="needle-tip-impact" opacity="0" filter="url(#tipGlow)">
                          <path id="needle-tip-ray" d="M140 34 L143.8 52 L140 48.2 L136.2 52 Z" fill="${C.gold}" opacity=".92"/>
                          <circle id="needle-tip-halo" cx="140" cy="38.5" r="6.2" fill="none" stroke="${C.gold}" stroke-width="1.15" opacity=".42"/>
                          <circle id="needle-tip-core" cx="140" cy="38.5" r="2.0" fill="${C.gold}" opacity=".97"/>
                        </g>
                        <g clip-path="url(#targetNeedleClip)" opacity=".14"><rect x="122" y="36" width="36" height="101" fill="url(#brushPattern)"/></g>
                        <line x1="140" y1="39" x2="140" y2="120" stroke="rgba(255,255,255,.70)" stroke-width=".52"/>

                        <!-- Gegenhälfte -->
                        <path id="needle-tail" d="M140 246 L151 154 Q152 146 146 140 L140 149 L134 140 Q128 146 129 154 Z"
                              fill="url(#needleMetal)" stroke="rgba(255,255,255,.34)" stroke-width=".68"/>
                        <path d="M140 246 L140 149 L134 140 Q128 146 129 154 Z" fill="url(#needleDarkFacet)" opacity=".88"/>
                        <path d="M140 242 L146 155 L143 151 L140 159 Z" fill="rgba(255,255,255,.27)"/>
                        <g clip-path="url(#tailNeedleClip)" opacity=".11"><rect x="126" y="143" width="28" height="99" fill="url(#brushPattern)"/></g>
                      </g>

                      <!-- Messing-Schraubkappe: fein gehämmerte Messingoberfläche, darüber polierte Reflexe -->
                      <g filter="url(#capShadow)">
                        <circle cx="140" cy="140" r="19.2" fill="#07090c" stroke="rgba(255,255,255,.30)" stroke-width="1.15"/>
                        <circle cx="140" cy="140" r="16.5" fill="url(#screwRim)" stroke="#e0b34b" stroke-width="1.05"/>
                        <circle cx="140" cy="140" r="12.8" fill="url(#screwGold)" stroke="rgba(255,243,191,.70)" stroke-width=".9" filter="url(#hammerGold)"/>
                        <!-- sehr feine Messing-Hammerschlagpunkte, nicht grob/rustikal -->
                        <g opacity=".045" fill="rgba(255,241,181,.72)">
                          <circle cx="134.8" cy="138.3" r=".56"/><circle cx="138.0" cy="132.6" r=".42"/>
                          <circle cx="144.1" cy="135.0" r=".48"/><circle cx="146.4" cy="141.2" r=".38"/>
                          <circle cx="140.8" cy="145.4" r=".50"/><circle cx="135.7" cy="144.1" r=".34"/>
                        </g>
                        <g opacity=".038" fill="rgba(59,34,2,.78)">
                          <circle cx="136.1" cy="134.7" r=".48"/><circle cx="142.2" cy="133.1" r=".38"/>
                          <circle cx="144.8" cy="139.0" r=".54"/><circle cx="139.2" cy="142.9" r=".42"/>
                        </g>
                        <!-- feiner konzentrischer Messingschliff: sichtbarer als der Hammerschlag, aber weiterhin subtil -->
                        <g fill="none" opacity=".28">
                          <circle cx="140" cy="140" r="11.35" stroke="rgba(255,250,220,.20)" stroke-width=".20" stroke-dasharray="6 1.2 2 1"/>
                          <circle cx="140" cy="140" r="10.72" stroke="rgba(81,48,4,.24)" stroke-width=".18" stroke-dasharray="4 1 7 1.3"/>
                          <circle cx="140" cy="140" r="10.08" stroke="rgba(255,245,197,.18)" stroke-width=".18" stroke-dasharray="8 1.4 3 1"/>
                        </g>
                        <circle cx="140" cy="140" r="9.6" fill="none" stroke="rgba(255,255,255,.14)" stroke-width=".6"/>
                        <circle cx="135.7" cy="135.2" r="4.0" fill="rgba(255,255,255,.34)"/>
                        <ellipse cx="136.8" cy="133.8" rx="2.1" ry="1.25" fill="rgba(255,255,255,.43)" transform="rotate(-28 136.8 133.8)"/>
                        <path d="M131.6 146 A12.6 12.6 0 0 0 149 131.5" fill="none" stroke="rgba(0,0,0,.46)" stroke-width="1.2"/>
                      </g>
                      </svg>
                      <img
                        class="compass-metal-frame"
                        id="compass-metal-frame"
                        src="${COMPASS_METAL_FRAME_V2_IMAGE}"
                        alt=""
                        aria-hidden="true"
                        draggable="false"
                      >
                      <svg class="compass-calibration-overlay" id="compass-calibration-overlay" aria-hidden="true"></svg>
                      <div class="compass-calibration-target" id="compass-calibration-target" aria-hidden="true"></div>
                    </div>
                    <div class="compass-corner-controls">
                      <button class="compass-button" id="mode-toggle" type="button"><span>◎</span><span class="mini-label" id="mode-main">Letzter Treffer</span></button>
                      <button class="compass-button device" id="device-toggle" type="button" title="Verwendet die feste Nordausrichtung des Kompasses." aria-label="Kompass: Verwendet die feste Nordausrichtung des Kompasses."><span class="sensor-dot"></span><span class="mini-label" id="device-main">Kompass</span></button>
                    </div>
                    <div class="compass-calibration-launchers">
                    <button class="compass-calibration-button" id="compass-calibration-measurements" type="button">
                      <svg class="compass-calibration-button-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3.5 11.1 12 4l8.5 7.1v8.4H6.2v-7.1" fill="rgba(79,163,247,.16)" stroke="#4fa3f7" stroke-width="1.45" stroke-linejoin="round"/>
                        <path d="m8.2 15.8 2.25-2.3 1.45 1.45 3.7-4.15" fill="none" stroke="#f6c344" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="17.6" cy="8.6" r="1.15" fill="#f6c344"/>
                      </svg>
                      <span class="compass-calibration-button-label">Messwerte</span>
                    </button>
                    <button class="compass-calibration-options-button" id="compass-calibration-options" type="button" aria-haspopup="true" aria-expanded="false">⚙</button>
                    <div class="compass-calibration-quick" id="compass-calibration-quick" aria-hidden="true">
                      <div class="compass-calibration-quick-head">
                        <div class="compass-calibration-overlay-title" data-calibration-text="calibration.display_title">Diagnose-Anzeige</div>
                        <button class="compass-calibration-quick-close" id="compass-calibration-quick-close" type="button" aria-label="Diagnose-Anzeige schließen">×</button>
                      </div>
                      <div class="compass-calibration-overlay-note" data-calibration-text="calibration.display_note">Nur grafische Hilfslinien. Alle Messdaten werden immer vollständig erfasst.</div>
                      <div class="compass-calibration-presets" data-calibration-presets></div>
                      <div class="compass-calibration-ring-controls" data-calibration-ring-controls></div>
                    </div>
                    </div>
                  </div>

                  <div class="compass-readout" id="compass-readout"><span id="compass-degree">–°</span><span class="compass-readout-separator" aria-hidden="true">·</span><span class="cardinal" id="compass-cardinal">–</span></div>
                  <div class="compass-caption" id="compass-caption">Azimut</div>
                  <div class="compass-status-legend" id="compass-status-legend">
                    <span class="compass-status-item" id="compass-status-active" style="color:${C.gold}"><i class="compass-status-dot"></i>Aktiv &lt; 10 Min</span>
                    <span class="compass-status-item" id="compass-status-old" style="color:${C.blue}"><i class="compass-status-dot"></i>10–120 Min</span>
                    <span class="compass-status-item" id="compass-status-danger" style="color:${C.danger}"><i class="compass-status-dot"></i>Gefahr</span>
                  </div>

                  <div class="compass-chips">
                    <div class="compass-chip"><span class="chip-label">Azimut</span><span class="chip-value" id="chip-azimuth" style="color:${C.blue}">–</span></div>
                    <div class="compass-chip"><span class="chip-label">Distanz</span><span class="chip-value" id="chip-distance" style="color:${C.gold}">–</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ha-card>

        <!-- V3.519 TEST – zusätzliches Einstellungs-Popup.
             Die Hauptansicht bleibt bewusst unverändert, damit beide Bedienkonzepte
             direkt gegeneinander verglichen werden können. -->
        <dialog id="map-fullscreen-dialog" aria-label="Gewitterradar Karte"></dialog>

        <div class="settings-backdrop" id="settings-backdrop" role="presentation">
          <section class="settings-dialog" id="settings-dialog"
                   role="dialog" aria-modal="true" aria-labelledby="settings-dialog-title">
            <div class="settings-dialog-head">
              <div>
                <div class="settings-kicker">Gewitterradar · Konfiguration</div>
                <div class="settings-title" id="settings-dialog-title">Einstellungen</div>
              </div>
              <div class="settings-head-actions">
                <button class="settings-close settings-close-premium" id="settings-close" type="button"
                        aria-label="Einstellungen schließen"><img src="${ABOUT_CLOSE_IMAGE}" alt="" width="34" height="34" draggable="false"></button>
              </div>
            </div>

            <div class="settings-body">
              <div class="settings-premium-links"><button class="settings-language-button settings-premium-link" id="settings-about" type="button"><span class="settings-premium-icon" aria-hidden="true">ⓘ</span><span id="settings-about-label">Über Gewitterradar</span></button><button class="settings-language-button settings-premium-link" id="settings-help" type="button"><span class="settings-premium-icon" aria-hidden="true">?</span><span id="settings-help-label">Hilfe &amp; Hinweise</span></button></div>
              <details class="settings-section settings-collapsible">
                <summary class="settings-section-head">
                  <div>
                    <div class="settings-section-title">Sprache</div>
                    <div class="settings-section-sub">Anzeigesprache der App</div>
                  </div>
                </summary>
                <div class="settings-section-content">
                  <div class="settings-row">
                    <div class="settings-row-label">Sprache</div>
                    <button class="settings-language-button settings-control" id="settings-language-button" type="button"
                            aria-haspopup="listbox" aria-expanded="false" aria-label="Sprachauswahl">
                      <span class="settings-language-current"><i class="settings-language-current-dot"></i><span id="settings-language-current">English</span></span>
                      <span class="settings-language-chevron" aria-hidden="true">▾</span>
                    </button>
                  </div>
                  <div class="settings-row">
                    <div class="settings-row-label" id="settings-distance-unit-label">Entfernungseinheit</div>
                    <div class="settings-distance-unit-control" id="settings-distance-unit-control" role="group" aria-label="Entfernungseinheit">
                      <button class="settings-distance-unit-option" id="settings-distance-unit-km" type="button" data-distance-unit="KM">KM</button>
                      <button class="settings-distance-unit-option" id="settings-distance-unit-mi" type="button" data-distance-unit="MI">MI</button>
                    </div>
                  </div>
                </div>
              </details>

              <details class="settings-section settings-collapsible">
                <summary class="settings-section-head">
                  <div>
                    <div class="settings-section-title">Standort</div>
                    <div class="settings-section-sub">Bezugsstandort für Karte, Radien und Entfernungen</div>
                  </div>
                </summary>
                <div class="settings-section-content settings-location-list">
                  <div class="settings-row">
                    <div class="settings-row-label">
                      Bezugsstandort
                      <span class="settings-location-coordinates" id="settings-location-coordinates">–</span>
                    </div>
                    <button class="settings-location-button settings-control" id="settings-location-button" type="button"
                            aria-haspopup="listbox" aria-expanded="false" aria-label="Gewitterradar Bezugsstandort">
                      <span class="settings-location-current"><i class="settings-location-current-dot"></i><span id="settings-location-current">Zuhause</span></span>
                      <span class="settings-location-chevron" aria-hidden="true">▾</span>
                    </button>
                  </div>

                  <div class="settings-row">
                    <div class="settings-row-label">
                      Standortwahl in Hauptansicht anzeigen
                    </div>
                    <button class="settings-switch" id="settings-location-main-toggle" type="button"
                            role="switch" aria-checked="false"
                            aria-label="Standortwahl in Hauptansicht anzeigen"></button>
                  </div>
                </div>
              </details>

              <details class="settings-section settings-collapsible" id="settings-map-section">
                <summary class="settings-section-head">
                  <div>
                    <div class="settings-section-title" id="settings-map-section-title">Kartendarstellung</div>
                    <div class="settings-section-sub" id="settings-map-section-sub">Kartengröße und separates Kartenfenster</div>
                  </div>
                </summary>
                <div class="settings-section-content">
                  <div class="settings-row">
                    <div class="settings-row-label">
                      <div>Cluster-Auflösung</div>
                      <div style="font-size:.76rem;opacity:.68;margin-top:3px">Wann Cluster in Einzelblitze aufgelöst werden</div>
                    </div>
                    <div class="settings-cluster-resolution-control">
                      <button class="settings-language-button settings-control settings-cluster-resolution-button" id="settings-cluster-resolution-button" type="button"
                              aria-haspopup="listbox" aria-expanded="false" aria-label="Cluster-Auflösung auswählen">
                        <span class="settings-language-current"><i class="settings-language-current-dot"></i><span id="settings-cluster-resolution-current">Ausgewogen</span></span>
                        <span class="settings-language-chevron" aria-hidden="true">▾</span>
                      </button>
                    </div>
                  </div>

                  <div class="settings-row settings-cluster-session-row">
                    <div class="settings-row-label">
                      <div>Cluster-Navigation · Sitzungszeit</div>
                      <div style="font-size:.76rem;opacity:.68;margin-top:3px">5 - 3600 Sek. <span style="color:#e0b44f;font-size:1.18em;line-height:0;vertical-align:-0.02em">·</span> unendlich</div>
                    </div>
                    <div class="settings-cluster-session-selector settings-cluster-session-static-gold" id="settings-cluster-jump-selector" data-mode="finite" role="group" aria-label="Sitzungszeit der Cluster-Navigation">
                      <label class="settings-cluster-session-mode settings-cluster-session-finite" id="settings-cluster-jump-finite"><input id="settings-cluster-jump-seconds" type="number" min="5" max="3600" step="1" inputmode="numeric" value="10" aria-label="Sitzungszeit der Cluster-Navigation in Sekunden"><span class="settings-cluster-session-unit">s</span></label>
                      <button class="settings-cluster-session-mode settings-cluster-session-infinite" id="settings-cluster-jump-infinite" type="button" aria-pressed="false" aria-label="Cluster-Navigation unbegrenzt beibehalten" title="Unbegrenzt"><img class="settings-cluster-session-infinity-gfx" src="${GEWITTERRADAR_INFINITY_GFX}" alt="" aria-hidden="true"></button>
                    </div>
                  </div>

                  <div class="settings-row">
                    <div class="settings-row-label">
                      <span id="settings-map-startup-label">Standardansicht</span>
                      <span class="settings-row-note" id="settings-map-startup-note">Nur auf diesem Gerät und in diesem Browserprofil gespeichert</span>
                    </div>
                    <button class="settings-location-button settings-control settings-map-startup-button" id="settings-map-startup-button" type="button"
                            aria-haspopup="listbox" aria-expanded="false" aria-label="Standardansicht">
                      <span class="settings-location-current"><i class="settings-location-current-dot"></i><span class="settings-map-startup-current-text" id="settings-map-startup-current">Zuletzt verwendet</span></span>
                      <span class="settings-location-chevron" aria-hidden="true">⌄</span>
                    </button>
                  </div>
                  <div class="settings-row">
                    <div class="settings-row-label">
                      <span id="settings-map-window-label">Eigenes Kartenfenster</span>
                      <span class="settings-row-note" id="settings-map-window-note">Karte mit ausgewähltem Kompass separat öffnen</span>
                    </div>
                    <button class="settings-language-button settings-control" id="settings-map-window-open" type="button"
                            aria-label="Karte in eigenem Fenster öffnen">Öffnen</button>
                  </div>
                </div>
              </details>

              <details class="settings-section settings-collapsible" id="settings-aura-section">
                <summary class="settings-section-head">
                  <div>
                    <div class="settings-section-title">Effekte &amp; Animationen</div>
                    <div class="settings-section-sub">Radius-Aura, Warnanimation und Feinabstimmung</div>
                  </div>
                </summary>
                <div class="settings-section-content">
                  <div class="settings-row">
                    <div class="settings-row-label" id="settings-aura-label">
                      Aura-Effekte
                      <span class="settings-row-note" id="settings-aura-note">Dekorative Licht- und Halo-Effekte</span>
                    </div>
                    <button class="settings-switch" id="settings-aura-toggle" type="button"
                            role="switch" aria-checked="false" aria-label="Aura-Effekte ein oder aus"></button>
                  </div>

                  <div class="settings-aura-controls" id="settings-aura-controls" hidden>
                    <div class="settings-aura-control-row">
                      <div class="settings-aura-control-label" id="settings-aura-width-label">
                        Aura-Breite
                        <span class="settings-aura-control-note" id="settings-aura-width-note">Tiefe des weichen Radiusverlaufs</span>
                      </div>
                      <input class="settings-aura-range" id="settings-aura-width" type="range"
                             min="15" max="60" step="1" value="40" aria-label="Aura-Breite einstellen">
                      <output class="settings-aura-value" id="settings-aura-width-value">40 %</output>
                    </div>
                    <div class="settings-aura-control-row">
                      <div class="settings-aura-control-label" id="settings-aura-intensity-label">
                        Aura-Intensität
                        <span class="settings-aura-control-note" id="settings-aura-intensity-note">Leuchtstärke des Radiusverlaufs</span>
                      </div>
                      <input class="settings-aura-range" id="settings-aura-intensity" type="range"
                             min="0" max="70" step="1" value="40" aria-label="Aura-Intensität einstellen">
                      <output class="settings-aura-value" id="settings-aura-intensity-value">40 %</output>
                    </div>
                  </div>
                  <div class="settings-row">
                    <div class="settings-row-label">Warnanimation</div>
                    <button class="settings-switch" id="settings-animation-toggle" type="button"
                            role="switch" aria-checked="false" aria-label="Warnanimation ein oder aus"></button>
                  </div>
                  <div class="settings-row" id="settings-selector-design-row">
                    <div class="settings-row-label" data-selector-design-label>Selector-Design</div>
                    <div class="compass-design-switch settings-selector-preview" id="settings-selector-preview" role="group" aria-label="Selector-Design">
                      <img class="compass-selector-frame-image" id="settings-selector-frame-image" alt="" aria-hidden="true">
                      <button class="compass-design-button" id="selector-frame-prev" type="button" aria-label="Vorheriges Selector-Design"><span class="compass-design-fallback-arrow" aria-hidden="true">◀</span></button>
                      <output class="compass-design-index" id="selector-frame-index" aria-live="polite">2 / 6</output>
                      <button class="compass-design-button" id="selector-frame-next" type="button" aria-label="Nächstes Selector-Design"><span class="compass-design-fallback-arrow" aria-hidden="true">▶</span></button>
                    </div>
                  </div>
                </div>
              </details>

              <details class="settings-section settings-collapsible" id="settings-radii-section">
                <summary class="settings-section-head">
                  <div>
                    <div class="settings-section-title">Radien</div>
                    <div class="settings-section-sub">Zusätzliche Test-Bedienung · synchron mit den Reglern der Hauptansicht</div>
                  </div>
                </summary>

                <div class="settings-section-content settings-radius-list">
                  <div class="settings-row settings-radius-main-toggle-row">
                    <div class="settings-row-label">
                      Radien in Hauptansicht anzeigen
                    </div>
                    <button class="settings-switch" id="settings-radii-toggle" type="button"
                            role="switch" aria-checked="false" aria-label="Radien in Hauptansicht anzeigen"></button>
                  </div>

                  <div class="settings-radius observation">
                    <div class="settings-radius-line">
                      <span class="settings-radius-name">Beobachtungsradius<span class="settings-radius-note">Auswertung</span></span>
                      <input class="settings-radius-slider" id="settings-observation-slider"
                             type="range" min="10" max="1000" step="1" value="200">
                      <span class="settings-radius-tools">
                        <button class="settings-radius-step" id="settings-observation-minus" type="button" aria-label="Beobachtungsradius verkleinern">−</button>
                        <button class="settings-radius-value settings-radius-value-button" id="settings-observation-input" type="button" data-value="200" aria-haspopup="dialog" aria-label="Beobachtungsradius direkt in Kilometern eingeben"><span class="settings-radius-value-number">75</span><span class="settings-radius-value-unit">KM</span></button>
                        <button class="settings-radius-step" id="settings-observation-plus" type="button" aria-label="Beobachtungsradius vergrößern">+</button>
                      </span>
                    </div>
                  </div>

                  <div class="settings-radius storm">
                    <div class="settings-radius-line">
                      <span class="settings-radius-name">Gewitterradius<span class="settings-radius-note">Animation · weißer Blitz</span></span>
                      <input class="settings-radius-slider" id="settings-storm-slider"
                             type="range" min="5" max="1000" step="1" value="100">
                      <span class="settings-radius-tools">
                        <button class="settings-radius-step" id="settings-storm-minus" type="button" aria-label="Gewitterradius verkleinern">−</button>
                        <button class="settings-radius-value settings-radius-value-button" id="settings-storm-input" type="button" data-value="100" aria-haspopup="dialog" aria-label="Gewitterradius direkt in Kilometern eingeben"><span class="settings-radius-value-number">30</span><span class="settings-radius-value-unit">KM</span></button>
                        <button class="settings-radius-step" id="settings-storm-plus" type="button" aria-label="Gewitterradius vergrößern">+</button>
                      </span>
                    </div>
                  </div>

                  <div class="settings-radius danger">
                    <div class="settings-radius-line">
                      <span class="settings-radius-name">Gefahrenradius<span class="settings-radius-note">Animation · weiß + rot</span></span>
                      <input class="settings-radius-slider" id="settings-danger-slider"
                             type="range" min="1" max="250" step="1" value="20">
                      <span class="settings-radius-tools">
                        <button class="settings-radius-step" id="settings-danger-minus" type="button" aria-label="Gefahrenradius verkleinern">−</button>
                        <button class="settings-radius-value settings-radius-value-button" id="settings-danger-input" type="button" data-value="20" aria-haspopup="dialog" aria-label="Gefahrenradius direkt in Kilometern eingeben"><span class="settings-radius-value-number">15</span><span class="settings-radius-value-unit">KM</span></button>
                        <button class="settings-radius-step" id="settings-danger-plus" type="button" aria-label="Gefahrenradius vergrößern">+</button>
                      </span>
                    </div>
                  </div>
                </div>
              </details>

              <details class="settings-section settings-collapsible" id="settings-diagnostic-section">
                <summary class="settings-section-head">
                  <div>
                    <div class="settings-section-title" id="settings-diagnostic-section-title">Kalibrierung &amp; Diagnose</div>
                    <div class="settings-section-sub">Simulation und Diagnosewerkzeuge</div>
                  </div>
                </summary>
                <div class="settings-section-content">
                  <div class="settings-row-label" id="settings-calibration-tools-label">Kalibrierungstools</div>
                  <div class="settings-row">
                    <div class="settings-row-label">Kompass-Kalibrierung</div>
                    <button class="settings-switch" id="settings-compass-calibration-toggle" type="button"
                            role="switch" aria-checked="false" aria-label="Kompass-Kalibrierung"></button>
                  </div>
                  <div class="settings-row">
                    <div class="settings-row-label" id="settings-medallion-calibration-label">Medaillon-Kalibrierung</div>
                    <button class="settings-switch" id="settings-medallion-calibration-toggle" type="button"
                            role="switch" aria-checked="false" aria-label="Medaillon-Kalibrierung"></button>
                  </div>
                  <div class="settings-row-label">Layout &amp; System</div>
                  <div class="settings-row">
                    <div class="settings-row-label" id="settings-diagnostics-label">Kalibrierung &amp; Diagnose</div>
                    <button class="settings-switch" id="settings-diagnostics-toggle" type="button" role="switch" aria-checked="false" aria-label="Diagnosemodus starten"></button>
                  </div>
                  <div class="settings-row-label">Testfunktionen</div>
                  <div class="settings-row">
                    <div class="settings-row-label">Warnsystem-Simulation</div>
                    <button class="settings-switch tests" id="settings-tests-toggle" type="button"
                            role="switch" aria-checked="false" aria-label="Warnsystem-Simulation"></button>
                  </div>
                  <div class="settings-test-grid">
                    <button class="warning-test-mini storm-test settings-test-button" id="settings-warning-test-storm" type="button" data-warning-test="storm">
                      <span class="bolt">⚡</span><span>GEWITTER TEST</span>
                    </button>
                    <button class="warning-test-mini settings-test-button" id="settings-warning-test-danger" type="button" data-warning-test="danger">
                      <span class="bolt">⚡</span><span>GEFAHR TEST</span>
                    </button>
                  </div>
                </div>
              </details>

              <div class="settings-footer-version" title="Kartenversion">${BUILD_YYYY_MM} · V${CARD_DISPLAY_VERSION}</div>

              <div class="settings-signature-wrap" aria-hidden="true">
                <svg class="settings-signature" viewBox="0 0 1982 563" focusable="false" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
                  <image id="settings-signature-image" x="0" y="0" width="1982" height="563" preserveAspectRatio="xMidYMid meet"></image>
                </svg>
              </div>
            </div>
          </section>
        </div>

        <div class="compass-calibration-modal-backdrop" id="compass-calibration-modal-backdrop" aria-hidden="true">
          <section class="compass-calibration-modal" role="dialog" aria-modal="true" aria-labelledby="compass-calibration-modal-title">
            <div class="compass-calibration-modal-head">
              <h2 id="compass-calibration-modal-title">Kompass-Kalibrierung</h2>
              <button class="compass-calibration-close" id="compass-calibration-close" type="button" aria-label="Schließen">×</button>
            </div>
            <div class="compass-calibration-overlay-title" data-calibration-text="calibration.rings_title">Grafische Messringe</div>
            <div class="compass-calibration-overlay-note" data-calibration-text="calibration.rings_note">Diese Optionen verändern ausschließlich die Darstellung auf dem Kompass. Alle Messungen und Berichte enthalten unabhängig davon immer den vollständigen Messumfang.</div>
            <div class="compass-calibration-presets" data-calibration-presets></div>
            <div class="compass-calibration-ring-controls" id="compass-calibration-ring-controls" data-calibration-ring-controls></div>
            <div class="compass-calibration-actions">
              <button class="compass-calibration-copy" id="compass-calibration-copy" type="button">Kernwerte kopieren</button>
              <button class="compass-calibration-copy" id="compass-calibration-copy-details" type="button">Alle Messdaten kopieren</button>
              <button class="compass-calibration-copy" id="compass-calibration-download" type="button">Log herunterladen</button>
            </div>
            <div class="compass-calibration-overlay-note" data-calibration-scope-note>Kernwerte = kompakte Auswertung. Alle Messdaten / Log = vollständige Diagnose. Messringe beeinflussen nur die grafische Anzeige.</div>
            <div class="compass-calibration-feedback" id="compass-calibration-feedback" role="status" aria-live="polite"></div>
            <pre class="compass-calibration-report" id="compass-calibration-report"></pre>
          </section>
        </div>

        <div class="medallion-calibration-modal-backdrop" id="medallion-calibration-modal-backdrop" aria-hidden="true">
          <section class="medallion-calibration-modal compass-calibration-modal" role="dialog" aria-modal="false" aria-labelledby="medallion-calibration-modal-title">
            <div class="compass-calibration-modal-head">
              <h2 id="medallion-calibration-modal-title">Medaillon-Kalibrierung</h2>
              <span class="medallion-window-state" id="medallion-window-state">NORMAL</span>
              <button class="compass-calibration-close medallion-window-dock" id="medallion-calibration-dock-left" type="button" aria-label="Links andocken">⇤</button>
              <button class="compass-calibration-close medallion-window-dock" id="medallion-calibration-dock-right" type="button" aria-label="Rechts andocken">⇥</button>
              <button class="compass-calibration-close medallion-window-level medallion-window-full" id="medallion-calibration-full" type="button" aria-label="Vollständige Diagnose">VOLL</button>
              <button class="compass-calibration-close medallion-window-level" id="medallion-calibration-compact" type="button" aria-label="Kompakte Funktionen">FUNK</button>
              <button class="compass-calibration-close medallion-window-level medallion-window-collapse" id="medallion-calibration-minimize" type="button" aria-label="Zur Leiste minimieren">−</button>
              <button class="compass-calibration-close" id="medallion-calibration-close" type="button" aria-label="Schließen">×</button>
            </div>
            <div class="compass-calibration-actions">
              <button class="compass-calibration-copy" id="medallion-calibration-copy" type="button">Messwerte kopieren</button>
              <button class="compass-calibration-copy" id="medallion-calibration-copy-details" type="button">Diagnosebericht kopieren</button>
              <button class="compass-calibration-copy" id="medallion-calibration-download" type="button">Log herunterladen</button>
            </div>
            <div class="compass-calibration-feedback" id="medallion-calibration-feedback" role="status" aria-live="polite"></div>
            <div class="medallion-diagnostic-controls" id="medallion-diagnostic-controls">
              <div class="medallion-diagnostic-title">Diagnosezustand</div>
              <div class="medallion-diagnostic-row" aria-label="Medaillon-Diagnosepresets">
                <button type="button" data-medallion-preset="empty">LEER</button><button type="button" data-medallion-preset="static">PFEIL</button><button type="button" data-medallion-preset="animation">TREND</button><button type="button" data-medallion-preset="freeze">FREEZE</button><button type="button" data-medallion-preset="normal">NORMAL</button><button type="button" id="medallion-diagnostic-cycle">WEITER</button>
              </div>
              <div class="medallion-diagnostic-row" aria-label="Medaillon-Detailsteuerung">
                <button type="button" data-medallion-arrow="on">PFEIL EIN</button><button type="button" data-medallion-arrow="off">PFEIL AUS</button><button type="button" data-medallion-animation="on">ANIMATION EIN</button><button type="button" data-medallion-animation="off">ANIMATION AUS</button><button type="button" data-medallion-freeze="on">FREEZE EIN</button><button type="button" data-medallion-freeze="off">FREEZE AUS</button>
              </div>
              <div class="medallion-diagnostic-row" aria-label="Pfeilwinkel">
                <button type="button" data-medallion-angle="0">0°</button><button type="button" data-medallion-angle="45">45°</button><button type="button" data-medallion-angle="90">90°</button><button type="button" data-medallion-angle="180">180°</button><button type="button" data-medallion-angle="270">270°</button>
              </div>
              <div class="medallion-diagnostic-state" id="medallion-diagnostic-state" role="status" aria-live="polite"></div>
            </div>
            <pre class="compass-calibration-report" id="medallion-calibration-report"></pre>
          </section>
        </div>

        <div class="diagnostic-overlay" id="diagnostic-overlay" aria-hidden="true"></div>
        <aside class="diagnostic-console" id="diagnostic-console" aria-label="Diagnose-Konsole">
          <div class="diagnostic-console-head" id="diagnostic-console-drag">
            <span class="diagnostic-console-title" id="diagnostic-console-title">Diagnose-Konsole</span>
            <span class="diagnostic-console-state" id="diagnostic-console-state">Diagnose aktiv</span>
            <div class="diagnostic-console-head-actions">
              <button id="diagnostic-visuals" type="button">Diagnosedarstellung ausblenden</button>
              <span class="diagnostic-column-toggle" aria-label="Konsolenspalten"><button id="diagnostic-columns-1" type="button" aria-pressed="false">1</button><button id="diagnostic-columns-2" type="button" aria-pressed="true">2</button></span>
              <button id="diagnostic-minimize" type="button" aria-label="Minimieren">−</button>
              <button id="diagnostic-exit-top" type="button" title="Diagnosemodus beenden" aria-label="Diagnosemodus beenden">×</button>
            </div>
          </div>
          <div class="diagnostic-console-body">
            <div class="diagnostic-console-section diagnostic-primary-section"><div class="diagnostic-controls">
              <button id="diagnostic-live" type="button">LIVE</button><button id="diagnostic-freeze" type="button">EINGEFROREN</button><button id="diagnostic-select" type="button">Element wählen</button>
            </div><div class="diagnostic-calibration-controls">
              <button class="diagnostic-calibration-tool diagnostic-calibration-compass" id="diagnostic-compass-calibration" type="button" aria-pressed="false">Kompass-Kalibrierung</button>
              <button class="diagnostic-calibration-tool diagnostic-calibration-medallion" id="diagnostic-medallion-calibration" type="button" aria-pressed="false">Medaillon-Kalibrierung</button>
            </div></div>
            <div class="diagnostic-console-section"><div class="diagnostic-console-section-title" id="diagnostic-grid-title">Raster</div><div class="diagnostic-controls">
              <button data-diagnostic-grid="off">AUS</button><button data-diagnostic-grid="coarse">GROB</button><button data-diagnostic-grid="fine">GROB + FEIN</button>
            </div></div>
            <div class="diagnostic-console-section"><div class="diagnostic-console-section-title" id="diagnostic-overlays-title">Overlays</div><div class="diagnostic-controls">
              <button data-diagnostic-overlay="ids">IDs</button><button data-diagnostic-overlay="boxes">BOX</button><button data-diagnostic-overlay="centers">CENTER</button><button data-diagnostic-overlay="axes">AXES</button><button data-diagnostic-overlay="diagonals">DIAGONALS</button><button data-diagnostic-overlay="baselines">BASELINES</button><button data-diagnostic-overlay="padding">PADDING</button><button data-diagnostic-overlay="margin">MARGIN</button><button data-diagnostic-overlay="spacing">GAPS</button><button data-diagnostic-overlay="safe">SAFE AREAS</button><button data-diagnostic-overlay="overflow">OVERFLOW</button><button data-diagnostic-overlay="parent">PARENT</button><button data-diagnostic-overlay="alignment">ALIGN</button>
            </div></div>
            <div class="diagnostic-console-section"><div class="diagnostic-console-section-title" id="diagnostic-presets-title">Voreinstellungen</div><div class="diagnostic-controls">
              <button data-diagnostic-preset="minimal">MINIMAL</button><button data-diagnostic-preset="alignment">AUSRICHTUNG</button><button data-diagnostic-preset="spacing">ABSTÄNDE</button><button data-diagnostic-preset="full">VOLLSTÄNDIG</button>
            </div></div>
            <div class="diagnostic-console-section diagnostic-medallion-state-section"><div class="diagnostic-console-section-title" id="diagnostic-medallion-state-title">Medaillon-Zustand</div><div class="diagnostic-controls" aria-label="Medaillon-Zustand umschalten">
              <button type="button" data-medallion-preset="empty">LEER</button><button type="button" data-medallion-preset="static">PFEIL</button><button type="button" data-medallion-preset="animation">TREND</button><button type="button" data-medallion-preset="freeze">FREEZE</button><button type="button" data-medallion-preset="normal">NORMAL</button>
            </div></div>
            <div class="diagnostic-console-section diagnostic-virtual-storm-section"><div class="diagnostic-console-section-title" id="diagnostic-virtual-storm-title">Virtuelles Gewitter</div><div class="diagnostic-controls" aria-label="Virtuelles Gewitter">
              <button type="button" data-diagnostic-storm="off">AUS</button><button type="button" data-diagnostic-storm="observation">BEOBACHTUNG</button><button type="button" data-diagnostic-storm="storm">GEWITTER</button><button type="button" data-diagnostic-storm="danger">GEFAHR</button><button type="button" data-diagnostic-storm="outside">AUSSEN</button><button type="button" data-diagnostic-storm="all">GESAMT</button>
            </div><div class="diagnostic-virtual-storm-config"><span class="diagnostic-virtual-storm-config-label" id="diagnostic-virtual-storm-cells-label">Zellen</span><button class="diagnostic-storm-step" id="diagnostic-storm-cells-minus" type="button" aria-label="Zellen verringern">−</button><output class="diagnostic-virtual-storm-count" id="diagnostic-storm-cells-value">1</output><button class="diagnostic-storm-step" id="diagnostic-storm-cells-plus" type="button" aria-label="Zellen erhöhen">+</button><button id="diagnostic-storm-extreme" type="button" aria-pressed="false">EXTREM</button></div><div class="diagnostic-virtual-storm-state" id="diagnostic-virtual-storm-state" role="status" aria-live="polite"></div></div>
            <div class="diagnostic-console-section"><pre class="diagnostic-readout" id="diagnostic-readout"></pre><pre class="diagnostic-panel-table" id="diagnostic-panel-table" aria-label="Panel geometry table"></pre></div>
            <div class="diagnostic-console-section diagnostic-export-section"><div class="diagnostic-controls">
              <button id="diagnostic-copy" type="button">Auswahl kopieren</button><button id="diagnostic-copy-json" type="button">JSON</button><button id="diagnostic-compass-log" type="button">KOMPASS-LOG</button><button id="diagnostic-download" type="button">GESAMTDIAGNOSE</button><button id="diagnostic-snapshot" type="button">SNAPSHOT</button><button id="diagnostic-performance" type="button">FPS 5S</button>
            </div></div>
            <button class="diagnostic-master-stop" id="diagnostic-exit" type="button">Diagnosemodus beenden</button>
          </div>
        </aside>
        <div class="diagnostic-performance-backdrop" id="diagnostic-performance-backdrop" role="status" aria-live="polite" aria-hidden="true">
          <div class="diagnostic-performance-card" id="diagnostic-performance-card">
            <div class="diagnostic-performance-title" id="diagnostic-performance-title">Performance-Test</div>
            <div class="diagnostic-performance-countdown" id="diagnostic-performance-countdown">6</div>
            <div class="diagnostic-performance-note" id="diagnostic-performance-note">Bitte warten</div>
            <div class="diagnostic-performance-actions" id="diagnostic-performance-actions">
              <button class="diagnostic-performance-download" id="diagnostic-performance-download" type="button" disabled>DOWNLOAD</button>
              <button class="diagnostic-performance-cancel" id="diagnostic-performance-cancel" type="button">ABBRECHEN</button>
            </div>
          </div>
        </div>

        <!-- V3.973 – platform-independent language dropdown. -->
        <div class="language-dropdown" id="language-dropdown" role="listbox" aria-label="Sprachauswahl"></div>

        <!-- V3.99312 – platform-independent reference-location dropdown. -->
        <div class="location-dropdown" id="location-dropdown" role="listbox" aria-label="Gewitterradar Bezugsstandort"></div>

        <!-- V4.09.20 – Standardansicht nutzt denselben eigenen Dropdown-Stil wie Standort. -->
        <div class="location-dropdown settings-map-startup-dropdown" id="settings-map-startup-dropdown" role="listbox" aria-label="Standardansicht auswählen"></div>

        <!-- V4.08.23 – Cluster-Auflösung nutzt denselben eigenen Dropdown-Stil. -->
        <div class="language-dropdown settings-cluster-resolution-dropdown" id="cluster-resolution-dropdown" role="listbox" aria-label="Cluster-Auflösung auswählen"></div>

        <!-- V3.91 – eigener Radius-Ziffernblock ohne HTML-Eingabefeld.
             Keine fokussierbare Texteingabe = keine iPad-Bildschirmtastatur. -->
        <div class="radius-keypad-backdrop" id="radius-keypad-backdrop" role="presentation" aria-hidden="true">
          <section class="radius-keypad-dialog" id="radius-keypad-dialog"
                   role="dialog" aria-modal="true" aria-labelledby="radius-keypad-title">
            <div class="radius-keypad-kicker">Gewitterradar · Radius</div>
            <div class="radius-keypad-title" id="radius-keypad-title">Radius eingeben</div>
            <div class="radius-keypad-display" aria-live="polite">
              <span class="radius-keypad-center">
                <span class="radius-keypad-number" id="radius-keypad-number">0</span>
                <span class="radius-keypad-unit">KM</span>
              </span>
            </div>
            <div class="radius-keypad-limit" id="radius-keypad-limit">–</div>
            <div class="radius-keypad-grid" id="radius-keypad-grid" aria-label="Zahleneingabe">
              <button class="radius-keypad-key" type="button" data-radius-key="1">1</button>
              <button class="radius-keypad-key" type="button" data-radius-key="2">2</button>
              <button class="radius-keypad-key" type="button" data-radius-key="3">3</button>
              <button class="radius-keypad-key" type="button" data-radius-key="4">4</button>
              <button class="radius-keypad-key" type="button" data-radius-key="5">5</button>
              <button class="radius-keypad-key" type="button" data-radius-key="6">6</button>
              <button class="radius-keypad-key" type="button" data-radius-key="7">7</button>
              <button class="radius-keypad-key" type="button" data-radius-key="8">8</button>
              <button class="radius-keypad-key" type="button" data-radius-key="9">9</button>
              <button class="radius-keypad-key utility" type="button" data-radius-key="clear">Löschen</button>
              <button class="radius-keypad-key" type="button" data-radius-key="0">0</button>
              <button class="radius-keypad-key utility" type="button" data-radius-key="backspace" aria-label="Letzte Ziffer löschen">⌫</button>
            </div>
            <div class="radius-keypad-actions">
              <button class="radius-keypad-action" id="radius-keypad-cancel" type="button">Abbrechen</button>
              <button class="radius-keypad-action apply" id="radius-keypad-apply" type="button">Übernehmen</button>
            </div>
          </section>
        </div>

        <div class="release-history-backdrop" id="release-history-backdrop" role="presentation" aria-hidden="true">
          <section class="release-history-dialog" id="release-history-dialog"
                   role="dialog" aria-modal="true" aria-labelledby="release-history-title">
            <div class="release-history-head">
              <div class="release-history-heading">
                <div class="release-history-kicker" id="release-history-kicker">Gewitterradar · Release history</div>
                <div class="release-history-title-row">
                  <div class="release-history-title" id="release-history-title">Release history</div>
                  <div class="release-history-language-toggle" id="release-history-language-toggle" role="group" aria-label="Release history language">
                    <button class="release-history-language-button" type="button" data-release-history-language="de" aria-pressed="false" aria-label="Deutsch">DE</button>
                    <button class="release-history-language-button" type="button" data-release-history-language="en" aria-pressed="true" aria-label="English">EN</button>
                  </div>
                </div>
              </div>
              <div class="release-history-head-actions">
                <span class="release-history-current">${BUILD_YYYY_MM} · V${CARD_DISPLAY_VERSION}</span>
                <button class="release-history-close" id="release-history-close" type="button" aria-label="Close release history"><img src="${ABOUT_CLOSE_IMAGE}" alt="" width="34" height="34" draggable="false"></button>
              </div>
            </div>
            <div class="release-history-body">
              <div class="release-history-lang-panel" data-release-history-lang="en">
                <!-- PERMANENT RELEASE-HISTORY CONTRACT: keep this planning panel for the NEXT PUBLIC version. Release articles below are reserved for PUBLIC releases only; never add DEV/TEST iteration entries. -->
                <details class="release-history-future" open>
                  <summary>
                    <div class="release-history-future-heading">
                      <div class="release-history-version">Future Developments · Planned</div>
                      <h3>Planned next expansion stage</h3>
                    </div>
                    <span class="release-history-future-chevron" aria-hidden="true"></span>
                  </summary>
                  <div class="release-history-future-content">
                    <ul class="release-history-plan-list">
                      <li>Provide different Medallion designs.</li>
                      <li>Improve Compass and Medallion selection.</li>
                      <li>Implement weather services via WeatherRouter.</li>
                    </ul>
                  </div>
                </details>

                <article class="release-history-entry">
                  <div class="release-history-version">V4.09 · 2026/09</div>
                  <h3>Map views, fullscreen instruments & separate map window</h3>
                  <p>V4.09 adds the Standard, Large and Fullscreen map views with a per-device Default view, a separate storm-map window using the currently selected compass, movable fullscreen Compass and Medallion instruments with show/hide controls, a freely movable location pill with an adaptive menu for desktop, Android and iPad, the new 3D map-view selector with a responsive menu, and expanded Help &amp; Notes for map display, fullscreen controls and the separate map window.</p>
                </article>

                <article class="release-history-entry">
                  <div class="release-history-version">V4.08 · 2026/09</div>
                  <h3>Cluster resolution profiles & cluster navigation</h3>
                  <p>Cluster resolution was expanded with the profiles Early, Balanced, Late and Classic. The new cluster navigation provides a freely configurable session time with direct switching between the countdown and ∞ (Infinity) by clicking the status display. Classic, by contrast, uses the previous cluster display and resolution behavior from earlier versions. Help & Notes was updated consistently across all 19 supported languages.</p>
                </article>

                <article class="release-history-entry">
                  <div class="release-history-version">V4.07 · 2026/09</div>
                  <h3>Worldwide reference locations & saved places</h3>
                  <p>Introduced worldwide place and postcode search with country grouping and ranking, a dedicated reference tracker, direct map focus, Blitzortung location-entity handoff, Local To-do saved places with reversible removal and recovery, duplicate-safe re-saving, network and firewall guidance, and refined location-menu behavior.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.06 · 2026/09</div>
                  <h3>Unified product, help & premium refinement</h3>
                  <p>Unified the native integration and Dashboard delivery around one deterministic frontend, expanded About and Help to 15 languages plus 4 German dialect variants, added Recorder multi-device wildcard guidance and strengthened cross-device premium polish with real Android, iPad and iPad Pro acceptance.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.05 · 2026/09</div>
                  <h3>Premium About Gewitterradar experience</h3>
                  <p>Introduced the premium About Gewitterradar first-start onboarding and information experience, including the personal “Für Alkje” dedication and a Settings entry to reopen it, while preserving the proven lightning, radius, Recent/history and Home Assistant package behavior from V4.04.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.04 · 2026/09</div>
                  <h3>HACS package staging</h3>
                  <p>HACS now places the required Home Assistant helper package next to the installed card as app_gewitterradar_pkg.yaml. Users still copy or move that file manually to /config/packages/ because a HACS Dashboard repository cannot write outside its own www/community directory. Application logic and helper behavior remain unchanged.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.03 · 2026/09</div>
                  <h3>HACS release asset priority fix</h3>
                  <p>Removed custom GitHub release assets from the HACS release so HACS falls through to the tagged dist tree and installs the card together with the complete assets directory. Application logic and helper behavior remain unchanged.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.02 · 2026/09</div>
                  <h3>HACS packaging fix</h3>
                  <p>Corrected the HACS distribution so the card and all four external PNG assets are installed together. Card behavior, helper IDs, layouts and lightning-processing logic remain unchanged.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.01 · 2026/09</div>
                  <h3>Asset optimization</h3>
                  <p>Conservatively right-sized and losslessly encoded the four external PNG assets for their actual interface render limits, retained generous HiDPI reserves, reduced the combined asset payload by about 61%, and refreshed asset cache keys without changing app behavior.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.00 · 2026/09</div>
                  <h3>First stable release</h3>
                  <p>First stable Gewitterradar release, consolidating live lightning visualization, three-zone storm assessment, responsive cross-device operation, 15 languages plus 4 German dialect variants, metric and imperial units, compass navigation, and 120-minute activity history into a hardened Home Assistant card.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.997 · 2026/08</div>
                  <h3>Interface & usability refinement</h3>
                  <p>Improved mobile layouts, responsive settings, radius controls, metric and imperial distance support, near-strike distance formatting, and direct radius editing from the map.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.996 · 2026/08</div>
                  <h3>Release hardening</h3>
                  <p>Removed obsolete diagnostic code while preserving iPad/WebKit safeguards, stable recent-activity updates, custom dropdown controls, and other regression-critical compatibility paths.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.994 · 2026/08</div>
                  <h3>Stability, navigation & internationalization</h3>
                  <p>Stabilized cluster identity and browsing during live updates and zooming, refined individual-strike focus and compass behavior, added live data-source status, and expanded the interface toward the multilingual release line.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.993 · 2026/08</div>
                  <h3>Pre-release feature consolidation</h3>
                  <p>Consolidated the three-radius model, aura and warning controls, 120-minute activity history, compass modes, reference-location selection, filtering, clustering, and responsive device layouts.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.98 · 2026/08</div>
                  <h3>Core interface evolution</h3>
                  <p>Established the mature Gewitterradar interface with live strike visualization, radius-based classification, recent activity, KPI panels, filters, clustering, and mobile/tablet adaptations.</p>
                </article>
              </div>
              <div class="release-history-lang-panel" data-release-history-lang="de" hidden>
                <!-- PERMANENTER RELEASE-HISTORY-VERTRAG: Dieses Planungsfeld beschreibt die NÄCHSTE ÖFFENTLICHE Version. Darunter ausschließlich veröffentlichte Releases; keine DEV/TEST-Iterationseinträge. -->
                <details class="release-history-future" open>
                  <summary>
                    <div class="release-history-future-heading">
                      <div class="release-history-version">Zukünftige Entwicklungen · Geplant</div>
                      <h3>Geplante nächste Ausbaustufe</h3>
                    </div>
                    <span class="release-history-future-chevron" aria-hidden="true"></span>
                  </summary>
                  <div class="release-history-future-content">
                    <ul class="release-history-plan-list">
                      <li>Unterschiedliche Medaillions bereitstellen.</li>
                      <li>Verbesserungen der Kompass- und Medaillion-Auswahl.</li>
                      <li>Implementierung von Wetterdiensten via WeatherRouter.</li>
                    </ul>
                  </div>
                </details>

                <article class="release-history-entry">
                  <div class="release-history-version">V4.09 · 2026/09</div>
                  <h3>Kartenansichten, Vollbild-Instrumente &amp; separates Kartenfenster</h3>
                  <p>V4.09 ergänzt die Kartenansichten Standard, Groß und Vollbild mit gerätespezifischer Standardansicht, ein separates Gewitter-Kartenfenster mit dem aktuell ausgewählten Kompass, frei verschiebbare und ein-/ausblendbare Vollbild-Instrumente für Kompass und Medaillon, die frei bewegliche Standort-Pille mit adaptivem Standortmenü für Desktop, Android und iPad, den neuen 3D-Layer-Schalter mit responsivem Menü für die Kartenansicht sowie erweiterte Hilfe &amp; Hinweise zu Kartendarstellung, Vollbild-Bedienung und separatem Kartenfenster.</p>
                </article>

                <article class="release-history-entry">
                  <div class="release-history-version">V4.08 · 2026/09</div>
                  <h3>Cluster-Auflösungsprofile & Cluster-Navigation</h3>
                  <p>Die Cluster-Auflösung wurde um die Profile Früh, Ausgewogen, Spät und Klassisch erweitert. Die neue Cluster-Navigation besitzt eine frei wählbare Sitzungszeit mit direktem Wechsel zwischen Countdown und ∞ (Infinity) durch einen Klick in der Statusanzeige. Klassisch verwendet hingegen die bisherige Darstellung und Auflösung der Cluster aus früheren Versionen. Hilfe & Hinweise wurde einheitlich in allen 19 unterstützten Sprachen ergänzt.</p>
                </article>

                <article class="release-history-entry">
                  <div class="release-history-version">V4.07 · 2026/09</div>
                  <h3>Weltweite Referenzstandorte & gespeicherte Orte</h3>
                  <p>Ergänzt wurden die weltweite Orts- und PLZ-Suche mit Ländergruppierung und Ranking, ein eigener Referenztracker, der direkte Kartenfokus, die Übergabe an Blitzortung über eine Standort-Entität, lokal gespeicherte Orte über Local To-do mit reversiblem Entfernen und Wiederherstellen, dublettensicheres erneutes Speichern, Netzwerk- und Firewall-Hinweise sowie ein verfeinertes Verhalten der Standortwahl.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.06 · 2026/09</div>
                  <h3>Vereinheitlichung, Hilfe & Premium-Feinschliff</h3>
                  <p>Native Integration und Dashboard-Auslieferung wurden auf ein deterministisches Frontend vereinheitlicht. „Über Gewitterradar“ und „Hilfe & Hinweise“ wurden auf 15 Sprachen plus 4 deutsche Dialektvarianten erweitert, die Recorder-Hinweise für mehrere Geräte ergänzt und die Premium-Darstellung geräteübergreifend mit realen Android-, iPad- und iPad-Pro-Tests abgesichert.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.05 · 2026/09</div>
                  <h3>Premium-Erlebnis „Über Gewitterradar“</h3>
                  <p>Einführung der hochwertigen „Über Gewitterradar“-Erststart- und Informationsansicht einschließlich der persönlichen Widmung „Für Alkje“ sowie eines Einstellungs-Eintrags zum erneuten Öffnen. Die bewährte Blitz-, Radien-, Verlauf-/Historien- und Home-Assistant-Paketlogik aus V4.04 blieb erhalten.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.04 · 2026/09</div>
                  <h3>Bereitstellung des HACS-Pakets</h3>
                  <p>HACS legt das benötigte Home-Assistant-Helferpaket nun neben der installierten Karte als app_gewitterradar_pkg.yaml ab. Da ein HACS-Dashboard-Repository nicht außerhalb seines eigenen www/community-Verzeichnisses schreiben darf, wird die Datei weiterhin manuell nach /config/packages/ kopiert oder verschoben. Anwendungslogik und Helferverhalten bleiben unverändert.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.03 · 2026/09</div>
                  <h3>Korrektur der HACS-Release-Priorität</h3>
                  <p>Eigene GitHub-Release-Artefakte wurden aus dem HACS-Release entfernt, damit HACS auf den markierten dist-Baum zurückfällt und die Karte zusammen mit dem vollständigen assets-Verzeichnis installiert. Anwendungslogik und Helferverhalten bleiben unverändert.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.02 · 2026/09</div>
                  <h3>Korrektur der HACS-Paketierung</h3>
                  <p>Die HACS-Auslieferung wurde korrigiert, sodass die Karte und alle vier externen PNG-Dateien gemeinsam installiert werden. Kartenverhalten, Helfer-IDs, Layouts und Blitzverarbeitung bleiben unverändert.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.01 · 2026/09</div>
                  <h3>Optimierung der Bilddateien</h3>
                  <p>Die vier externen PNG-Dateien wurden konservativ auf ihre tatsächlichen Darstellungsgrenzen abgestimmt und verlustfrei kodiert. Großzügige HiDPI-Reserven blieben erhalten, die gemeinsame Dateigröße sank um etwa 61 Prozent und die Cache-Kennungen wurden erneuert, ohne das Verhalten der Anwendung zu verändern.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.00 · 2026/09</div>
                  <h3>Erste stabile Veröffentlichung</h3>
                  <p>Erste stabile Gewitterradar-Version mit Live-Blitzdarstellung, dreistufiger Gewitterbewertung, geräteübergreifend anpassbarer Oberfläche, 15 Sprachen plus 4 deutschen Dialektvarianten, metrischen und imperialen Einheiten, Kompassnavigation und 120-Minuten-Aktivitätsverlauf.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.997 · 2026/08</div>
                  <h3>Oberflächen- & Bedienungsfeinschliff</h3>
                  <p>Verbesserte Mobilansichten, anpassbare Einstellungen, Radiensteuerung, metrische und imperiale Entfernungsangaben, präzisere Anzeige sehr naher Blitze sowie direkte Bearbeitung der Radien aus der Karte.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.996 · 2026/08</div>
                  <h3>Stabilisierung für die Veröffentlichung</h3>
                  <p>Veralteter Diagnosecode wurde entfernt, während iPad-/WebKit-Schutzmaßnahmen, stabile Aktualisierungen der jüngsten Aktivität, eigene Auswahlfelder und weitere regressionskritische Kompatibilitätspfade erhalten blieben.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.994 · 2026/08</div>
                  <h3>Stabilität, Navigation & Internationalisierung</h3>
                  <p>Cluster-Identität und Navigation bei Live-Aktualisierungen und Zoom wurden stabilisiert, der Fokus auf einzelne Blitze und das Kompassverhalten verfeinert, der Status der Live-Datenquelle ergänzt und die Oberfläche in Richtung der mehrsprachigen Veröffentlichung ausgebaut.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.993 · 2026/08</div>
                  <h3>Bündelung der Vorab-Funktionen</h3>
                  <p>Zusammenführung des Drei-Radien-Modells, der Aura- und Warnsteuerung, des 120-Minuten-Aktivitätsverlaufs, der Kompassmodi, der Referenzstandortwahl, Filterung, Gruppierung und anpassbaren Geräteansichten.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.98 · 2026/08</div>
                  <h3>Weiterentwicklung der Kernoberfläche</h3>
                  <p>Aufbau der ausgereiften Gewitterradar-Oberfläche mit Live-Blitzdarstellung, radienbasierter Klassifizierung, jüngster Aktivität, Kennzahlenfeldern, Filtern, Gruppierung sowie Mobil- und Tablet-Anpassungen.</p>
                </article>
              </div>
            </div>
          </section>
        </div>
      `;

      const settingsSignatureImage = this.shadow.getElementById('settings-signature-image');
      _uiAsset7VerifiedUri().then((uri) => {
        if (uri && settingsSignatureImage?.isConnected) {
          settingsSignatureImage.setAttribute('href',uri);
        }
      });

      this._activeCompassDesign = null;
      this._applyCompassDesign(this._persistedCompassDesign || 'C');
      this._applyStaticTranslations();
      this._bindControls();
      this._initMap();
      this._setupOrientationCapabilityProbe();
    },

};});

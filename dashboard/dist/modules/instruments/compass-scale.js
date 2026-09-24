import { defineModule } from "../core/runtime.js?v=41002r1";
export const MODULE_META=Object.freeze({
  "id": "instruments.compass-scale",
  "version": "1.0.0",
  "group": "Instrumente",
  "function": "Kompass-Skala",
  "subfunctions": [
    "Skala",
    "Geometrie"
  ],
  "file": "modules/instruments/compass-scale.js"
});
export const installCompassScale=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _buildCompassScale(design = this._activeCompassDesign || 'C') {
      const ringTicks = this.shadow.getElementById('compass-ring-ticks');
      const ticks = this.shadow.getElementById('compass-ticks');
      const degrees = this.shadow.getElementById('compass-degrees');
      if (!ringTicks || !ticks || !degrees) return;

      const normalized = COMPASS_DESIGNS.some((entry)=>entry.id===design) ? design : 'A';
      // A = ursprünglicher Premium-Kompass ohne PNG-Rahmen.
      // B = Kompasseinfassung V2 ohne internen Hammerschlag-Gehäusering:
      //     der äußere Grad-/Tickring darf deshalb wieder deutlich größer werden
      //     und optisch direkt am inneren Messingrand der Einfassung enden.
      // C = Metalleinfassung V1 mit sicher eingerückter Skala.
      const geometry = normalized === 'A'
        ? {
            precisionOuter:116.6,
            precisionMajorInner:104.8,
            precisionMediumInner:107.9,
            precisionMinor5Inner:110.5,
            precisionFineInner:113.0,
            markerOuter:130.2,
            markerInner:121.9,
            markerDot:121.2,
            degreeRadius:125.2,
            degreeFont:7.2,
            degreeYOffset:2.45,
            safeBaseline:false,
            degreeMetalRadius:125.5,
            degreeMetalWidth:10.8,
            degreeOuterRadius:130.3,
            degreeInnerRadius:120.2,
            degreeInnerWidth:.9,
            dialFaceRadius:117.1,
            dialSheenRadius:115.8
          }
        : normalized === 'B'
          ? {
              // B: fast wieder Originalgröße – aber mit sauberer mittiger Baseline.
              precisionOuter:118.8,
              precisionMajorInner:106.2,
              precisionMediumInner:109.4,
              precisionMinor5Inner:112.1,
              precisionFineInner:115.0,
              markerOuter:130.2,
              markerInner:122.2,
              markerDot:121.55,
              degreeRadius:124.35,
              degreeFont:7.35,
              degreeYOffset:0,
              safeBaseline:true,
              degreeMetalRadius:126.0,
              degreeMetalWidth:8.6,
              degreeOuterRadius:130.15,
              degreeInnerRadius:121.65,
              degreeInnerWidth:.90,
              dialFaceRadius:120.55,
              dialSheenRadius:119.2

              // V3.99402: keine winkelabhängige Verformung mehr. Die komplette
              // Skala bleibt kreisrund und wird stattdessen als Ganzes an die
              // reale transparente Öffnung des V2-Rahmens angepasst.
            }
          : normalized === 'D'
            ? {
                // D: eigener funktionaler Innenring. Äußere Schrauben und
                // Überstände gehören zum PNG und begrenzen diese Skala nicht.
                precisionOuter:103.8,
                precisionMajorInner:92.8,
                precisionMediumInner:95.7,
                precisionMinor5Inner:98.2,
                precisionFineInner:100.5,
                markerOuter:105.0,
                markerInner:98.8,
                markerDot:98.2,
                degreeRadius:96.0,
                degreeFont:6.6,
                degreeYOffset:0,
                safeBaseline:true,
                degreeMetalRadius:102.0,
                degreeMetalWidth:7.0,
                degreeOuterRadius:104.5,
                degreeInnerRadius:97.8,
                degreeInnerWidth:.82,
                dialFaceRadius:107.0,
                dialSheenRadius:105.7
              }
            : {
              precisionOuter:112.8,
              precisionMajorInner:102.6,
              precisionMediumInner:105.7,
              precisionMinor5Inner:108.5,
              precisionFineInner:110.4,
              markerOuter:121.9,
              markerInner:117.9,
              markerDot:117.25,
              degreeRadius:115.85,
              degreeFont:6.45,
              degreeYOffset:0,
              safeBaseline:true,
              degreeMetalRadius:122.2,
              degreeMetalWidth:7.4,
              degreeOuterRadius:126.0,
              degreeInnerRadius:118.15,
              degreeInnerWidth:.82,
              dialFaceRadius:116.4,
              dialSheenRadius:115.1
            };

      // A/C/D benötigen keine winkelabhängige Korrektur; die V2-Sonderkorrektur gehört zu B.
      const lowerTickInset = geometry.lowerTickInset ?? 0;
      const lowerMarkerInset = geometry.lowerMarkerInset ?? 0;
      const lowerDegreeInset = geometry.lowerDegreeInset ?? 0;
      const lowerCrownInset = geometry.lowerCrownInset ?? 0;

      // Unterhalb der horizontalen Achse wächst der Korrekturfaktor weich von
      // 0 bei 90°/270° auf 1 bei 180°. Oberhalb bleibt er immer 0.
      const lowerHemisphereFactor = (rad) => {
        const s = Math.sin(rad);
        return s > 0 ? s * s : 0;
      };

      // Auch die statischen Ringflächen werden je Design zurückgesetzt.
      const degreeMetalRing = this.shadow.getElementById('compass-degree-metal-ring');
      const degreeOuterRing = this.shadow.getElementById('compass-degree-outer-ring');
      const degreeInnerRing = this.shadow.getElementById('compass-degree-inner-ring');
      const degreeCrown = this.shadow.getElementById('compass-degree-crown');
      const dialFace = this.shadow.getElementById('compass-dial-face');
      const dialSheen = this.shadow.getElementById('compass-dial-sheen');
      const protectedBoundary = this.shadow.getElementById('compass-protected-boundary');

      degreeMetalRing?.setAttribute('r',String(geometry.degreeMetalRadius));
      degreeMetalRing?.setAttribute('stroke-width',String(geometry.degreeMetalWidth));
      degreeOuterRing?.setAttribute('r',String(geometry.degreeOuterRadius));
      degreeInnerRing?.setAttribute('r',String(geometry.degreeInnerRadius));
      degreeInnerRing?.setAttribute('stroke-width',String(geometry.degreeInnerWidth));
      dialFace?.setAttribute('r',String(geometry.dialFaceRadius));
      dialSheen?.setAttribute('r',String(geometry.dialSheenRadius));
      // Stable diagnostic envelope of the outer 15° marker tips including
      // half their 1.28-unit round stroke. It never changes visible geometry.
      protectedBoundary?.setAttribute('r',String(geometry.markerOuter + .64));

      // V3.993_fixed – Gradkranz B (Kompasseinfassung V2):
      // Die drei bisherigen statischen Kreise bleiben für A/C unverändert.
      // Bei B werden sie ausgeblendet und durch drei geschlossene, winkelabhängige
      // Pfade ersetzt. So folgt der komplette Kranz derselben unteren Kontur wie
      // Ziffern und Ticks, statt unten als kreisförmiger Rest stehen zu bleiben.
      const useDynamicCrown = normalized === 'B';
      const hideSvgDegreeScale = normalized === 'candidate_05';

      if (degreeMetalRing) degreeMetalRing.style.display = useDynamicCrown || hideSvgDegreeScale ? 'none' : '';
      if (degreeOuterRing) degreeOuterRing.style.display = useDynamicCrown || hideSvgDegreeScale ? 'none' : '';
      if (degreeInnerRing) degreeInnerRing.style.display = useDynamicCrown || hideSvgDegreeScale ? 'none' : '';

      const crownPath = (baseRadius,insetAmount) => {
        const points = [];
        for (let deg = 0; deg <= 360; deg += 2.5) {
          const rad = (deg - 90) * Math.PI / 180;
          const factor = lowerHemisphereFactor(rad);
          const radius = baseRadius - insetAmount * factor;
          const x = 140 + radius * Math.cos(rad);
          const y = 140 + radius * Math.sin(rad);
          points.push(`${deg === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
        }
        points.push('Z');
        return points.join(' ');
      };

      if (degreeCrown) {
        if (useDynamicCrown) {
          const metalPath = crownPath(geometry.degreeMetalRadius,lowerCrownInset);
          const outerPath = crownPath(geometry.degreeOuterRadius,lowerCrownInset);
          const innerPath = crownPath(geometry.degreeInnerRadius,lowerCrownInset);

          degreeCrown.innerHTML = `
            <!-- dunkle Schattenkante unter dem Messingband -->
            <path d="${innerPath}" fill="none"
              stroke="rgba(0,0,0,.54)" stroke-width="2.05" opacity=".72"/>

            <!-- eigentlicher metallischer Gradkranz -->
            <path d="${metalPath}" fill="none"
              stroke="url(#degreeMetal)"
              stroke-width="${geometry.degreeMetalWidth}"
              stroke-linejoin="round"/>

            <!-- äußere feine Goldreferenz -->
            <path d="${outerPath}" fill="none"
              stroke="rgba(246,195,68,.28)"
              stroke-width=".58"/>

            <!-- innere präzise Messingkante -->
            <path d="${innerPath}" fill="none"
              stroke="rgba(246,195,68,.48)"
              stroke-width="${geometry.degreeInnerWidth}"/>

            <!-- sehr feiner polierter Innenreflex -->
            <path d="${crownPath(geometry.degreeInnerRadius-.72,lowerCrownInset)}" fill="none"
              stroke="rgba(255,255,255,.16)"
              stroke-width=".34" opacity=".72"/>
          `;
        } else {
          degreeCrown.innerHTML = '';
        }
      }

      let ringTickHtml = '';
      let tickHtml = '';
      let degreeHtml = '';
      const cx = 140;
      const cy = 140;

      for (let deg = 0; deg < 360; deg += 2.5) {
        const major = deg % 30 === 0;
        const medium10 = deg % 10 === 0;
        const minor5 = deg % 5 === 0;
        const innerBase = major
          ? geometry.precisionMajorInner
          : medium10
            ? geometry.precisionMediumInner
            : minor5
              ? geometry.precisionMinor5Inner
              : geometry.precisionFineInner;

        const rad = (deg - 90) * Math.PI / 180;
        const lowerFactor = normalized === 'B' ? lowerHemisphereFactor(rad) : 0;
        const inset = lowerTickInset * lowerFactor;
        const outer = geometry.precisionOuter - inset;
        const inner = innerBase - inset;

        const x1 = cx + outer * Math.cos(rad);
        const y1 = cy + outer * Math.sin(rad);
        const x2 = cx + inner * Math.cos(rad);
        const y2 = cy + inner * Math.sin(rad);

        const stroke = major
          ? 'rgba(246,195,68,.92)'
          : medium10
            ? 'rgba(241,244,247,.55)'
            : minor5
              ? 'rgba(231,235,240,.34)'
              : 'rgba(220,225,232,.21)';
        const width = major ? 1.42 : medium10 ? .92 : minor5 ? .58 : .34;

        tickHtml += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
      }

      for (let deg = 15; deg < 360; deg += 30) {
        const rad = (deg - 90) * Math.PI / 180;
        const lowerFactor = normalized === 'B' ? lowerHemisphereFactor(rad) : 0;
        const inset = lowerMarkerInset * lowerFactor;

        const markerOuter = geometry.markerOuter - inset;
        const markerInner = geometry.markerInner - inset;
        const markerDot = geometry.markerDot - inset;

        const x1 = cx + markerOuter * Math.cos(rad);
        const y1 = cy + markerOuter * Math.sin(rad);
        const x2 = cx + markerInner * Math.cos(rad);
        const y2 = cy + markerInner * Math.sin(rad);
        const dx = cx + markerDot * Math.cos(rad);
        const dy = cy + markerDot * Math.sin(rad);

        ringTickHtml += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="rgba(246,195,68,.88)" stroke-width="1.28" stroke-linecap="round"/>`;
        ringTickHtml += `<circle cx="${dx.toFixed(2)}" cy="${dy.toFixed(2)}" r=".72" fill="rgba(246,195,68,.78)"/>`;
      }

      for (let deg = 0; deg < 360; deg += 30) {
        const rad = (deg - 90) * Math.PI / 180;
        const lowerFactor = normalized === 'B' ? lowerHemisphereFactor(rad) : 0;
        const degreeRadius = geometry.degreeRadius - (lowerDegreeInset * lowerFactor);

        const x = cx + degreeRadius * Math.cos(rad);
        const y = cy + degreeRadius * Math.sin(rad) + geometry.degreeYOffset;
        const rotation = (deg > 90 && deg < 270) ? deg + 180 : deg;

        if (geometry.safeBaseline) {
          degreeHtml += `<text
            x="${x.toFixed(2)}"
            y="${y.toFixed(2)}"
            text-anchor="middle"
            dominant-baseline="middle"
            alignment-baseline="middle"
            fill="rgba(242,244,247,.94)"
            stroke="rgba(2,4,7,.72)"
            stroke-width=".48"
            paint-order="stroke fill"
            font-size="${geometry.degreeFont}"
            font-weight="720"
            letter-spacing="-.08"
            transform="rotate(${rotation} ${x.toFixed(2)} ${y.toFixed(2)})"
          >${deg}</text>`;
        } else {
          degreeHtml += `<text
            x="${x.toFixed(2)}"
            y="${y.toFixed(2)}"
            text-anchor="middle"
            fill="rgba(240,242,245,.90)"
            font-size="${geometry.degreeFont}"
            font-weight="700"
            transform="rotate(${rotation} ${x.toFixed(2)} ${y.toFixed(2)})"
          >${deg}</text>`;
        }
      }

      ringTicks.innerHTML = ringTickHtml;
      ticks.innerHTML = tickHtml;
      degrees.innerHTML = degreeHtml;
      ringTicks.style.display = hideSvgDegreeScale ? 'none' : '';
      ticks.style.display = hideSvgDegreeScale ? 'none' : '';
      degrees.style.display = hideSvgDegreeScale ? 'none' : '';
    },

};});

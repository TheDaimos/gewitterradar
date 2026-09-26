import { defineModule } from "../core/runtime.js?v=41002r13";
export const MODULE_META=Object.freeze({
  "id": "instruments.compass",
  "version": "1.0.1",
  "group": "Instrumente",
  "function": "Kompass",
  "subfunctions": [
    "Bewegungsprofil",
    "Animation",
    "Rendering"
  ],
  "file": "modules/instruments/compass.js"
});
export const installCompass=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _buildCompassMotionProfile(active10Count = 0, active2Count = 0, danger10Count = 0) {
      // Bewertet bewusst die Blitzrate und nicht nur die absolute Anzahl:
      // 2-Minuten-Fenster reagiert schnell auf eine aufziehende Zelle,
      // 10-Minuten-Fenster stabilisiert die Mechanik gegen einzelne Ausreißer.
      const rate2 = Math.max(0,Number(active2Count) || 0) / 2;
      const rate10 = Math.max(0,Number(active10Count) || 0) / ACTIVE_MINUTES;
      const blendedRate = rate2 * .68 + rate10 * .32;

      let intensity = clamp(Math.log1p(blendedRate * 3) / Math.log(10),0,1);
      if (active10Count > 0) intensity = Math.max(.18,intensity);
      if (danger10Count > 0) intensity = clamp(intensity + .10,0,1);

      return {
        intensity,
        // Unterkritisch gedämpfte Feder: selbst bei ruhiger Lage sichtbar mechanisch,
        // bei hoher Blitzrate spürbar lebendiger und länger nachschwingend.
        stiffness: 34 + 8 * intensity,
        damping: 7.2 - 1.4 * intensity,
        maxVelocity: 220 + 100 * intensity,
        kick: 5 + 12 * intensity,
        settleAngle: .08,
        settleVelocity: .35
      };
    },

    _animateCompassAzimuth(targetAzimuth, onFrame, duration = 920) {
      const target = ((Number(targetAzimuth) % 360) + 360) % 360;
      const profile = this._compassMotionProfile || this._buildCompassMotionProfile(0,0,0);
      this._compassFrameCallback = onFrame;

      // Beim allerersten Ziel nicht quer über den Kompass fahren. Ab dem zweiten
      // Ziel arbeitet die Nadel wie eine federnd gelagerte mechanische Kompassnadel.
      if (!Number.isFinite(this._compassVisualAzimuth)) {
        this._compassVisualAzimuth = target;
        this._compassTargetAzimuth = target;
        this._compassAngularVelocity = 0;
        onFrame(target,1);
        return;
      }

      const oldTarget = Number.isFinite(this._compassTargetAzimuth)
        ? this._compassTargetAzimuth
        : this._compassVisualAzimuth;
      const targetChange = ((target - oldTarget + 540) % 360) - 180;
      this._compassTargetAzimuth = target;

      // Ein neuer Einschlag gibt der mechanischen Nadel einen kleinen Impuls.
      // Dadurch schwimmt sie nicht nur zum Ziel, sondern pendelt sichtbar darum ein.
      if (Math.abs(targetChange) >= .05) {
        const direction = Math.sign(((target - this._compassVisualAzimuth + 540) % 360) - 180) || 1;
        this._compassAngularVelocity += direction * profile.kick;
        this._compassAngularVelocity = clamp(this._compassAngularVelocity,-profile.maxVelocity,profile.maxVelocity);
      } else if (this._compassAnimationFrame) {
        // Dasselbe Ziel: laufende Federbewegung nicht durch HA-Updates neu starten.
        return;
      } else {
        onFrame(this._compassVisualAzimuth,1);
        return;
      }

      if (this._compassAnimationFrame) return;

      this._compassLastFrameAt = performance.now();
      let settledFrames = 0;

      const tick = (ts) => {
        const dt = clamp((ts - this._compassLastFrameAt) / 1000,.001,.032);
        this._compassLastFrameAt = ts;

        const currentTarget = Number.isFinite(this._compassTargetAzimuth)
          ? this._compassTargetAzimuth
          : target;
        let current = Number.isFinite(this._compassVisualAzimuth)
          ? this._compassVisualAzimuth
          : currentTarget;
        const error = ((currentTarget - current + 540) % 360) - 180;

        // Feder-Dämpfer-Modell. Durch die bewusst unterkritische Dämpfung überschwingt
        // die Nadel und pendelt anschließend seitlich nach – wie bei einem echten Kompass.
        const acceleration = profile.stiffness * error - profile.damping * this._compassAngularVelocity;
        this._compassAngularVelocity += acceleration * dt;
        this._compassAngularVelocity = clamp(this._compassAngularVelocity,-profile.maxVelocity,profile.maxVelocity);
        current += this._compassAngularVelocity * dt;
        this._compassVisualAzimuth = current;

        const cb = this._compassFrameCallback || onFrame;
        cb(current,0);

        const remaining = Math.abs(((currentTarget - current + 540) % 360) - 180);
        if (remaining < profile.settleAngle && Math.abs(this._compassAngularVelocity) < profile.settleVelocity) {
          settledFrames += 1;
        } else {
          settledFrames = 0;
        }

        // Erst nach mehreren wirklich ruhigen Frames festsetzen. So bleibt das
        // charakteristische "Schwimmen" sichtbar und wird nicht zu früh abgeschnitten.
        if (settledFrames >= 5) {
          this._compassVisualAzimuth = currentTarget;
          this._compassAngularVelocity = 0;
          this._compassAnimationFrame = null;
          this._compassLastFrameAt = null;
          cb(currentTarget,1);
          return;
        }

        this._compassAnimationFrame = requestAnimationFrame(tick);
      };

      this._compassAnimationFrame = requestAnimationFrame(tick);
    },

    _renderCompass(strike,now,dangerRadius,deviceMode) {
      const $ = (id) => this.shadow.getElementById(id);
      const dial = $('compass-dial');
      const needle = $('compass-needle');
      const target = $('needle-target');
      const targetLeft = $('needle-target-left');
      const targetRight = $('needle-target-right');
      const targetRidge = $('needle-target-ridge');
      const northAccent = $('needle-north-accent');
      const needleTipImpact = $('needle-tip-impact');
      const needleTipRay = $('needle-tip-ray');
      const needleTipHalo = $('needle-tip-halo');
      const needleTipCore = $('needle-tip-core');

      const outerArcGroup = $('outer-bearing-arc-group');
      const innerArcGroup = $('inner-bearing-arc-group');
      const outerArcHalo = $('outer-bearing-arc-halo');
      const outerArcMain = $('outer-bearing-arc-main');
      const outerArcGlint = $('outer-bearing-arc-glint');
      const innerArcHalo = $('inner-bearing-arc-halo');
      const innerArcMain = $('inner-bearing-arc-main');
      const innerArcGlint = $('inner-bearing-arc-glint');

      const bearingTarget = $('bearing-target');
      const bearingCore = $('bearing-target-core');
      const bearingHot = $('bearing-target-hot');
      const bearingHalo = $('bearing-target-halo');
      const bearingLine = $('bearing-target-line');
      const bearingSector = $('bearing-sector');
      const bearingSectorMain = $('bearing-sector-main');
      const bearingSectorCore = $('bearing-sector-core');
      const bearingSectorEdge = $('bearing-sector-edge');
      const deviceButton = $('device-toggle');
      const panelTitle = $('compass-panel-title');

      const headingAvailable = deviceMode && finiteNumber(this._deviceHeading) != null;
      const heading = headingAvailable ? ((Number(this._deviceHeading)%360)+360)%360 : 0;

      // Im Gerätemodus bleibt die Rose geografisch orientiert und dreht gegen die Gerätehaltung.
      dial?.setAttribute('transform',`rotate(${headingAvailable ? -heading : 0} 140 140)`);
      if (panelTitle) panelTitle.textContent = this._t(deviceMode ? 'compass.device_orientation' : 'kpi.direction');

      const setLegend = (status=null) => {
        $('compass-status-active')?.classList.toggle('current',status === 'active');
        $('compass-status-old')?.classList.toggle('current',status === 'old');
        $('compass-status-danger')?.classList.toggle('current',status === 'danger');
      };

      const hideTargetCue = () => {
        outerArcGroup?.setAttribute('opacity','0');
        innerArcGroup?.setAttribute('opacity','0');
        bearingTarget?.setAttribute('opacity','0');
        bearingSector?.setAttribute('opacity','0');
        needleTipImpact?.setAttribute('opacity','0');
        setLegend(null);
      };

      // Liefert den echten SVG-Verlauf passend zum Status. Dadurch besteht der Bogen
      // nicht mehr aus einzelnen Segmenten oder Leuchtpunkten.
      const arcGradient = (status) => status === 'danger'
        ? 'url(#arcRedFade)'
        : status === 'active'
          ? 'url(#arcGoldFade)'
          : 'url(#arcBlueFade)';

      const showTargetCue = (azimuth,status) => {
        const color = status === 'danger' ? C.danger : status === 'active' ? C.gold : C.blue;
        const gradient = arcGradient(status);
        const strength = status === 'old' ? .84 : status === 'danger' ? 1 : .98;

        // ECHTER ÄUSSERER VERLAUFSBOGEN:
        // ein zusammenhängender Bogen von -29° bis +29° um das Ziel. Die SVG-Gradienten
        // machen die Mitte kräftig und lassen beide Enden vollständig transparent auslaufen.
        const outerPath = this._arcPath(140,140,115.6,-29,29);
        outerArcGroup?.setAttribute('transform',`rotate(${azimuth} 140 140)`);
        [outerArcHalo,outerArcMain,outerArcGlint].forEach(el => {
          el?.setAttribute('d',outerPath);
          el?.setAttribute('stroke',gradient);
        });
        outerArcHalo?.setAttribute('opacity',String(.20*strength));
        outerArcMain?.setAttribute('opacity',String(1*strength));
        outerArcGlint?.setAttribute('opacity',String(.64*strength));
        outerArcGroup?.setAttribute('opacity','1');

        // INNERER VERLAUFSBOGEN:
        // kürzer, feiner und etwas dezenter – aber ebenfalls vollständig durchgehend.
        const innerPath = this._arcPath(140,140,96.0,-21,21);
        innerArcGroup?.setAttribute('transform',`rotate(${azimuth} 140 140)`);
        [innerArcHalo,innerArcMain,innerArcGlint].forEach(el => {
          el?.setAttribute('d',innerPath);
          el?.setAttribute('stroke',gradient);
        });
        innerArcHalo?.setAttribute('opacity',String((status === 'danger' ? .18 : .14)*strength));
        innerArcMain?.setAttribute('opacity',String((status === 'old' ? .76 : .90)*strength));
        innerArcGlint?.setAttribute('opacity',String((status === 'old' ? .38 : .50)*strength));
        innerArcGroup?.setAttribute('opacity','1');

        // Schmalerer Lichtkeil zum Einschlag: am Zentrum weich, zur Spitze präziser.
        bearingSector?.setAttribute('transform',`rotate(${azimuth} 140 140)`);
        bearingSector?.setAttribute('opacity','1');
        bearingSectorMain?.setAttribute('fill',color);
        bearingSectorCore?.setAttribute('fill',color);
        bearingSectorMain?.setAttribute('opacity',status === 'danger' ? '.14' : status === 'old' ? '.060' : '.095');
        bearingSectorCore?.setAttribute('opacity',status === 'danger' ? '.31' : status === 'old' ? '.18' : '.27');
        bearingSectorEdge?.setAttribute('opacity',status === 'danger' ? '.30' : status === 'old' ? '.16' : '.24');

        // Zielpunkt sitzt exakt auf dem Einschlagswinkel und verbindet Bogen + Richtung visuell.
        bearingTarget?.setAttribute('transform',`rotate(${azimuth} 140 140)`);
        bearingTarget?.setAttribute('opacity','1');
        [bearingCore,bearingHot].forEach(el => el?.setAttribute('fill',el === bearingHot ? 'rgba(255,255,255,.94)' : color));
        bearingHalo?.setAttribute('stroke',color);
        bearingLine?.setAttribute('stroke',color);
        bearingHalo?.setAttribute('opacity',status === 'old' ? '.44' : status === 'danger' ? '.86' : '.68');
        setLegend(status);
        return {color};
      };

      const applyNeedleTheme = (theme,opacity=1) => {
        const gradient = theme === 'danger'
          ? 'url(#needleRed)'
          : theme === 'active'
            ? 'url(#needleGold)'
            : theme === 'old'
              ? 'url(#needleBlue)'
              : theme === 'north'
                ? 'url(#needleMetal)'
                : 'url(#needleNeutral)';
        target?.setAttribute('fill',gradient);
        targetLeft?.setAttribute('fill',theme === 'neutral' ? 'rgba(0,0,0,.30)' : 'rgba(0,0,0,.23)');
        targetRight?.setAttribute('fill',theme === 'neutral' ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.21)');
        targetRidge?.setAttribute('fill',theme === 'neutral' ? 'rgba(255,255,255,.17)' : 'rgba(255,255,255,.32)');
        northAccent?.setAttribute('opacity',theme === 'north' ? '1' : '0');
        needle?.setAttribute('opacity',String(opacity));
      };

      const showNeedleImpact = (status) => {
        if (!needleTipImpact) return;
        const color = status === 'danger' ? C.danger : status === 'active' ? C.gold : C.blue;
        needleTipImpact.setAttribute('opacity','1');
        needleTipRay?.setAttribute('fill',color);
        needleTipHalo?.setAttribute('stroke',color);
        needleTipCore?.setAttribute('fill',color);
        needleTipHalo?.setAttribute('opacity',status === 'danger' ? '.76' : status === 'active' ? '.60' : '.48');
      };

      if (deviceMode) {
        // ECHTER GERÄTEKOMPASS:
        // Nadel = geografische Nord/Süd-Achse. Der Blitz bleibt separat über Lichtkeil,
        // inneren + äußeren Zielbogen und Ringmarker sichtbar.
        needle?.setAttribute('transform',`rotate(${headingAvailable ? -heading : 0} 140 140)`);
        applyNeedleTheme(headingAvailable ? 'north' : 'neutral',headingAvailable ? 1 : .48);
        needleTipImpact?.setAttribute('opacity','0');

        deviceButton?.classList.toggle('active',true);
        this._syncDeviceCompassControl(true);

        if (strike && strike.azimuth != null) {
          const status = this._strikeStatus(strike,now,dangerRadius);
          this._animateCompassAzimuth(strike.azimuth,(visualAngle) => {
            showTargetCue(visualAngle,status);
            $('compass-degree').textContent = `${Math.round(((visualAngle%360)+360)%360)}°`;
            $('compass-cardinal').textContent = this._toCardinal(visualAngle);
            $('chip-azimuth').textContent = `${Math.round(((visualAngle%360)+360)%360)}°`;
          },900);

          $('compass-caption').textContent = headingAvailable
            ? this._t('compass.direction_device',{heading:Math.round(heading),cardinal:this._toCardinal(heading)})
            : this._t('compass.wait_north');
          $('chip-distance').textContent = strike.distance != null ? this._formatDistance(strike.distance).text : '–';
          $('chip-distance').style.color = status === 'danger' ? C.danger : C.gold;
        } else {
          hideTargetCue();
          if (headingAvailable) {
            $('compass-degree').textContent = `${Math.round(heading)}°`;
            $('compass-cardinal').textContent = this._toCardinal(heading);
            $('compass-caption').textContent = this._t('compass.device_orientation');
          } else {
            $('compass-degree').textContent = '–°';
            $('compass-cardinal').textContent = '–';
            $('compass-caption').textContent = this._t('compass.sensor_initializing');
          }
          $('chip-azimuth').textContent = '–';
          $('chip-distance').textContent = '–';
          $('chip-distance').style.color = C.gold;
        }
        return;
      }

      // NORD-FIX / BLITZMODUS: Rose bleibt Nord oben, Nadel zeigt den ausgewählten Treffer.
      this._syncDeviceCompassControl(false);
      if (strike && strike.azimuth != null) {
        const status = this._strikeStatus(strike,now,dangerRadius);
        applyNeedleTheme(status,1);
        showNeedleImpact(status);

        // Nadel, innerer/äußerer Zielbogen, Lichtkeil und Zielmarker fahren als ein
        // Instrument weich zum nächsten Einschlag. Die Drehrichtung nimmt immer
        // den kürzesten Weg über 0/360°, statt abrupt umzuschlagen.
        this._animateCompassAzimuth(strike.azimuth,(visualAngle) => {
          needle?.setAttribute('transform',`rotate(${visualAngle} 140 140)`);
          showTargetCue(visualAngle,status);
          const normalized = ((visualAngle%360)+360)%360;
          $('compass-degree').textContent = `${Math.round(normalized)}°`;
          $('compass-cardinal').textContent = this._toCardinal(normalized);
          $('chip-azimuth').textContent = `${Math.round(normalized)}°`;
        },940);

        $('compass-caption').textContent = this._t('compass.lightning_direction');
        $('chip-distance').textContent = strike.distance != null ? this._formatDistance(strike.distance).text : '–';
        $('chip-distance').style.color = status === 'danger' ? C.danger : C.gold;
      } else {
        if (this._compassAnimationFrame) cancelAnimationFrame(this._compassAnimationFrame);
        this._compassAnimationFrame = null;
        this._compassVisualAzimuth = null;
        this._compassTargetAzimuth = null;
        this._compassAngularVelocity = 0;
        this._compassLastFrameAt = null;
        needle?.setAttribute('transform','rotate(0 140 140)');
        applyNeedleTheme('neutral',.52);
        hideTargetCue();
        $('compass-degree').textContent = '–°';
        $('compass-cardinal').textContent = '–';
        $('compass-caption').textContent = this._t('compass.lightning_direction');
        $('chip-azimuth').textContent = '–';
        $('chip-distance').textContent = '–';
        $('chip-distance').style.color = C.gold;
      }
    },

};});

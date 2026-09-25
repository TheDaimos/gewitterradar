import { defineModule } from "../core/runtime.js?v=41002r10";
export const MODULE_META=Object.freeze({
  "id": "map.strikes-warnings",
  "version": "1.0.1",
  "group": "Karte",
  "function": "Blitze & Warnungen",
  "subfunctions": [
    "Blitzaufnahme",
    "Warnanimation",
    "Geräteorientierung"
  ],
  "file": "modules/map/strikes-warnings.js"
});
export const installStrikesWarnings=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _ingestStrikes(hass) {
      const now = Date.now();
      const newStrikes = [];
      const home = this._home();

      // Persistierte 120-Minuten-Treffer sofort auf den aktuell gewählten
      // Bezugsstandort umrechnen. So wechseln auch History/KPIs/Kompass direkt.
      for (const strike of this._strikes.values()) {
        this._rebaseStrike(strike,home);
      }

      for (const entityId in hass.states) {
        if (!entityId.startsWith('geo_location.lightning_strike')) continue;

        const st = hass.states[entityId];
        const attrs = st.attributes || {};
        const lat = finiteNumber(attrs.latitude);
        const lon = finiteNumber(attrs.longitude);
        if (lat == null || lon == null) continue;

        // attrs.distance/attrs.azimuth der Integration beziehen sich auf HA Home.
        // Für Person 1/2 müssen beide Werte zwingend aus den Koordinaten neu
        // berechnet werden – deshalb werden die Integrationswerte hier nicht genutzt.
        const distance = distanceBetweenKm(home.lat,home.lon,lat,lon);
        const azimuth = bearingBetween(home.lat,home.lon,lat,lon);
        const timestamp = Date.parse(st.last_changed || st.last_updated || '') || now;
        const existing = this._strikes.get(entityId);

        if (!existing) {
          const strike = {
            id:entityId,
            lat,lon,distance,azimuth,
            firstSeen:Math.min(timestamp,now),
            lastSeen:now
          };
          this._strikes.set(entityId,strike);
          newStrikes.push(strike);
        } else {
          existing.lat = lat;
          existing.lon = lon;
          existing.distance = distance;
          existing.azimuth = azimuth;
          existing.lastSeen = now;
          if (timestamp < existing.firstSeen) existing.firstSeen = timestamp;
        }
      }

      const maxAgeMs = HISTORY_MINUTES * 60000;
      for (const [id,strike] of this._strikes.entries()) {
        if (now - strike.firstSeen > maxAgeMs) this._strikes.delete(id);
      }

      if (this._initialIngestDone && !this._diagnosticIngestOnly) {
        const observationRadius = this._observationRadiusValue(hass);
        const stormRadius = Math.min(this._stormRadiusValue(hass),observationRadius);
        const dangerRadius = Math.min(this._dangerRadiusValue(hass),stormRadius);

        const activeNew = newStrikes
          .filter(s =>
            s.distance != null &&
            s.distance <= stormRadius &&
            now - s.firstSeen <= ACTIVE_MINUTES * 60000
          )
          .sort((a,b) => a.distance - b.distance);

        const dangerousNew = activeNew.find(s => s.distance <= dangerRadius);
        const stormNew = activeNew[0];

        if (dangerousNew) {
          this._pulseDangerCount();
          if (hass.states[this._animationEntity()]?.state === 'on') {
            this._triggerWarningAnimation('danger');
          }
        } else if (stormNew) {
          if (hass.states[this._animationEntity()]?.state === 'on') {
            this._triggerWarningAnimation('storm');
          }
        }
      }

      this._initialIngestDone = true;
      return newStrikes;
    },

    _pulseDangerCount() {
      const el = this.shadow?.getElementById('hit-danger');
      if (!el) return;
      el.classList.remove('pulse');
      void el.offsetWidth;
      el.classList.add('pulse');
      setTimeout(() => el.classList.remove('pulse'),800);
    },

    _setWarningTestCooldown(sourceButton = null) {
      const remaining = Math.max(0,FLASH_COOLDOWN_MS - (Date.now() - this._lastFlashAt));
      if (remaining <= 0) return;

      // Vorherigen Timer sauber ersetzen, falls die Methode später auch durch
      // andere UI-Wege aufgerufen wird.
      if (this._warningTestCooldownTimer) {
        clearTimeout(this._warningTestCooldownTimer);
        this._warningTestCooldownTimer = null;
      }

      const buttons = [...this.shadow.querySelectorAll('[data-warning-test]')];
      const sourceMode = sourceButton?.dataset?.warningTest || null;

      buttons.forEach((button) => {
        button.classList.add('cooldown');
        button.classList.toggle(
          'cooldown-fired',
          !!sourceMode && button.dataset.warningTest === sourceMode
        );
        button.disabled = true;
        button.setAttribute('aria-disabled','true');
      });

      this._warningTestCooldownTimer = setTimeout(() => {
        [...this.shadow.querySelectorAll('[data-warning-test]')].forEach((button) => {
          button.classList.remove('cooldown','cooldown-fired');
          button.disabled = false;
          button.removeAttribute('aria-disabled');
        });
        this._warningTestCooldownTimer = null;
      },remaining + 35);
    },

    _ensureFullscreenWarningOverlay() {
      // V4.09.25 – native <dialog>.showModal() lives in the browser top layer.
      // Warning animations rendered in the card or on document.body are therefore
      // behind fullscreen. Keep a dedicated pointer-transparent warning layer
      // inside the fullscreen dialog itself.
      const dialog = this.shadow?.getElementById('map-fullscreen-dialog');
      if (!dialog) return null;
      if (this._fullscreenWarningOverlay?.isConnected &&
          this._fullscreenWarningOverlay.parentElement === dialog) {
        return this._fullscreenWarningOverlay;
      }

      const overlay = document.createElement('div');
      overlay.className = 'alert-flash';
      overlay.setAttribute('data-gewitterradar-fullscreen-warning-overlay','');
      Object.assign(overlay.style,{
        position:'fixed',
        inset:'0',
        width:'100vw',
        height:'100dvh',
        zIndex:'2147483644',
        pointerEvents:'none',
        overflow:'hidden',
        borderRadius:'0'
      });
      overlay.innerHTML = '<div class="flash-red"></div><div class="flash-ambient"></div><div class="flash-white"></div>';
      dialog.appendChild(overlay);
      this._fullscreenWarningOverlay = overlay;
      return overlay;
    },

    _ensureMobileViewportWarningOverlay() {
      // V3.517 TEST – rein mobiles Overlay außerhalb des Karten-Shadow-DOMs.
      // Dadurch wird auch der Home-Assistant-Header sichtbar vom Blitz erfasst.
      // Pointer-Events bleiben deaktiviert; Navigation/Bedienung wird nicht blockiert.
      if (this._mobileViewportWarningOverlay?.isConnected) {
        return this._mobileViewportWarningOverlay;
      }

      const overlay = document.createElement('div');
      overlay.setAttribute('data-gewitterradar-mobile-warning-overlay','');
      Object.assign(overlay.style,{
        position:'fixed',
        inset:'0',
        width:'100vw',
        height:'100dvh',
        zIndex:'2147483646',
        pointerEvents:'none',
        overflow:'hidden',
        opacity:'1',
        borderRadius:'0',
        background:'transparent',
        contain:'paint'
      });

      const red = document.createElement('div');
      red.className = 'flash-red';
      Object.assign(red.style,{
        position:'absolute',
        inset:'0',
        opacity:'0',
        pointerEvents:'none',
        zIndex:'1',
        background:`
          radial-gradient(circle at var(--red-x,50%) var(--red-y,42%),
            rgba(255,76,90,.34) 0%,
            rgba(255,38,60,.19) 42%,
            rgba(255,24,45,.09) 72%,
            rgba(255,24,45,.035) 100%),
          linear-gradient(
            rgba(255,26,48,.075),
            rgba(135,7,24,.055)
          )`,
        boxShadow:`
          inset 0 0 118px rgba(255,33,52,.29),
          inset 0 0 34px rgba(255,76,90,.15)`,
        mixBlendMode:'screen'
      });

      const ambient = document.createElement('div');
      ambient.className = 'flash-ambient';
      Object.assign(ambient.style,{
        position:'absolute',
        inset:'0',
        opacity:'0',
        pointerEvents:'none',
        zIndex:'2',
        background:`
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
            rgba(240,249,255,.43) 100%)`,
        boxShadow:`
          inset 0 0 72px rgba(232,245,255,.38),
          inset 0 0 24px rgba(255,255,255,.22)`
      });

      const white = document.createElement('div');
      white.className = 'flash-white';
      Object.assign(white.style,{
        position:'absolute',
        inset:'0',
        opacity:'0',
        pointerEvents:'none',
        zIndex:'3',
        background:`
          radial-gradient(circle at var(--flash-x,50%) var(--flash-y,39%),
            rgba(255,255,255,.99) 0%,
            rgba(241,248,255,.82) 13%,
            rgba(218,235,255,.42) 34%,
            rgba(190,220,255,.14) 58%,
            rgba(255,255,255,0) 82%)`
      });

      overlay.append(red,ambient,white);
      document.body.appendChild(overlay);
      this._mobileViewportWarningOverlay = overlay;
      return overlay;
    },

    _triggerWarningAnimation(mode = 'danger') {
      const now = Date.now();
      if (now - this._lastFlashAt < FLASH_COOLDOWN_MS) return;
      this._lastFlashAt = now;

      const localOverlay = this.shadow?.getElementById('alert-flash');
      if (!localOverlay) return;

      const withRed = mode === 'danger';

      const randomBetween = (min,max) => min + Math.random() * (max - min);
      const randomInt = (min,max) => Math.round(randomBetween(min,max));

      const randomCenter = () => ({
        x:randomBetween(FLASH_CENTER_X_MIN,FLASH_CENTER_X_MAX),
        y:randomBetween(FLASH_CENTER_Y_MIN,FLASH_CENTER_Y_MAX)
      });

      const cardRect = this.getBoundingClientRect?.() || { top:0,width:900 };
      const cardWidth = cardRect.width || 900;

      const ua = navigator.userAgent || '';
      const platform = navigator.platform || '';
      const maxTouchPoints = navigator.maxTouchPoints || 0;
      const isIPad = /iPad/i.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1);
      const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
      const isPhoneLike =
        !isIPad &&
        cardWidth <= FLASH_MOBILE_VIEWPORT_MAX_WIDTH &&
        (maxTouchPoints > 0 || coarsePointer);

      // V4.09.25 – ein modaler Vollbild-Dialog liegt in der Browser-Top-Layer-Ebene.
      // Warnlayer außerhalb dieses Dialogs bleiben unabhängig vom z-index dahinter.
      // Im Vollbild wird die Warnanimation deshalb direkt im Dialog gerendert.
      // Außerhalb des Vollbilds bleibt das bisherige Verhalten unverändert.
      const fullscreenDialog = this.shadow?.getElementById('map-fullscreen-dialog');
      const fullscreenActive =
        (this._mapDisplayMode === 'fullscreen' || this._mapWindowMode) &&
        !!fullscreenDialog?.open;
      const overlay = fullscreenActive
        ? this._ensureFullscreenWarningOverlay()
        : (isPhoneLike ? this._ensureMobileViewportWarningOverlay() : localOverlay);

      const ambient = overlay?.querySelector('.flash-ambient');
      const white = overlay?.querySelector('.flash-white');
      const red = overlay?.querySelector('.flash-red');
      if (!overlay || !ambient || !white || !red) return;

      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

      let mainPeak = cardWidth > 1100 ? .67 : cardWidth > 720 ? .86 : .98;
      let secondaryScale = cardWidth > 1100 ? .78 : cardWidth > 720 ? .94 : 1.00;

      if (reducedMotion) {
        mainPeak *= .82;
        secondaryScale *= .82;
      }

      // iPad bleibt exakt wie V3.516 – final abgenommen.
      if (isIPad) {
        mainPeak = Math.max(mainPeak,1.0);
        secondaryScale = Math.max(secondaryScale,1.03);
        ambient.style.backgroundColor = 'rgba(238,247,255,.11)';
      } else {
        ambient.style.backgroundColor = '';
      }

      const firstCenter = randomCenter();
      overlay.style.setProperty('--red-x',`${firstCenter.x.toFixed(1)}%`);
      overlay.style.setProperty('--red-y',`${firstCenter.y.toFixed(1)}%`);

      // Die final abgenommene rote Animation ist die zweite Eskalationsstufe.
      // 'storm' = ausschließlich weißer Blitz, 'danger' = weiß + rot.
      if (!isPhoneLike) {
        overlay.classList.remove('fire');
        if (withRed) {
          void overlay.offsetWidth;
          overlay.classList.add('fire');
        }
      } else {
        red.getAnimations?.().forEach((anim) => anim.cancel());
        red.style.opacity = '0';

        if (withRed) {
          // Mobile Viewport-Layer: identischer finaler roter Verlauf wie V3.517.
          red.animate(
            [
              { opacity:0, offset:0 },
              { opacity:0, offset:.04 },
              { opacity:.54, offset:.10 },
              { opacity:.46, offset:.24 },
              { opacity:.33, offset:.48 },
              { opacity:.19, offset:.72 },
              { opacity:0, offset:1 }
            ],
            {
              duration:2050,
              easing:'ease-out',
              fill:'none'
            }
          );
        }
      }

      // Safari/iPad-Fallback ohne Web Animations API:
      // harter Lichtimpuls -> sehr kurze Schulter -> Ausblendung.
      const animateInlineOpacity = (element,peak,shoulder,duration) => {
        element.style.transition = 'none';
        element.style.opacity = '0';
        void element.offsetWidth;

        requestAnimationFrame(() => {
          element.style.opacity = String(peak);

          setTimeout(() => {
            element.style.transition = `opacity ${Math.max(55,Math.round(duration * .30))}ms linear`;
            element.style.opacity = String(shoulder);

            setTimeout(() => {
              element.style.transition = `opacity ${Math.max(70,Math.round(duration * .54))}ms linear`;
              element.style.opacity = '0';
            },Math.max(18,Math.round(duration * .22)));
          },Math.max(16,Math.round(duration * .16)));
        });
      };

      const animateAmbient = (peak,duration) => {
        if (isIPad) {
          animateInlineOpacity(ambient,peak,peak * .30,duration);
          return;
        }

        ambient.animate(
          [
            { opacity:0, offset:0 },
            { opacity:peak, offset:.12 },
            { opacity:peak * .30, offset:.48 },
            { opacity:0, offset:1 }
          ],
          {
            duration,
            easing:'linear',
            fill:'none'
          }
        );
      };

      const animateSpot = (center,peak,shoulder,duration) => {
        white.style.setProperty('--flash-x',`${center.x.toFixed(1)}%`);
        white.style.setProperty('--flash-y',`${center.y.toFixed(1)}%`);

        if (isIPad) {
          animateInlineOpacity(
            white,
            Math.min(1,peak * 1.16),
            Math.min(.36,shoulder * 1.25),
            duration
          );
          return;
        }

        white.animate(
          [
            { opacity:0, offset:0 },
            { opacity:peak, offset:.16 },
            { opacity:shoulder, offset:.58 },
            { opacity:0, offset:1 }
          ],
          {
            duration,
            easing:'linear',
            fill:'none'
          }
        );
      };

      // Hauptentladung – finaler Fenster-/Raumlichteffekt.
      animateAmbient(mainPeak,165);

      const secondaryProfiles = [
        { peak:.52 * secondaryScale, shoulder:.12 * secondaryScale, duration:118 },
        { peak:.31 * secondaryScale, shoulder:.07 * secondaryScale, duration:104 }
      ];

      let elapsed = 165;

      secondaryProfiles.forEach((profile,index) => {
        elapsed += randomInt(FLASH_GAP_MIN_MS,FLASH_GAP_MAX_MS);

        setTimeout(() => {
          const center = randomCenter();
          const useAmbient = Math.random() < .48;

          overlay.style.setProperty('--red-x',`${center.x.toFixed(1)}%`);
          overlay.style.setProperty('--red-y',`${center.y.toFixed(1)}%`);

          if (useAmbient) {
            animateAmbient(profile.peak * .92,profile.duration);
          } else {
            animateSpot(center,profile.peak,profile.shoulder,profile.duration);
          }
        },elapsed);

        elapsed += profile.duration;
      });

      const cleanupAfter = Math.max(2200,elapsed + 500);
      setTimeout(() => {
        if (!isPhoneLike) {
          overlay.classList.remove('fire');
        }

        // iPad bleibt wie V3.516 sauber zurückgesetzt.
        if (isIPad) {
          ambient.style.transition = 'none';
          ambient.style.opacity = '0';
          white.style.transition = 'none';
          white.style.opacity = '0';
        }
      },cleanupAfter);
    },

    _formatAge(ms) {
      // V3.99711 – sprachabhängige Kurzformen; U+202F bleibt als kompakter Abstand.
      const unitGap = '\u202F';
      const units = AGE_SHORT_UNITS[this._languageValue()] || AGE_SHORT_UNITS[LANGUAGE_DEFAULT];
      const sec = Math.max(0,Math.floor(ms/1000));
      if (sec < 60) return `${sec}${unitGap}${units.sec}`;
      const min = Math.floor(sec/60);
      if (min < 60) return `${min}${unitGap}${units.min}`;
      return `${Math.floor(min/60)}${unitGap}${units.hour}`;
    },

    _formatRelative(ms) {
      const sec = Math.max(0,Math.round(ms/1000));
      if (sec < 60) return this._t('relative.seconds',{count:sec});
      const min = Math.round(sec/60);
      if (min < 60) return this._t('relative.minutes',{count:min});
      return this._t('relative.hours',{count:Math.round(min/60)});
    },

    _formatClock(ts) {
      if (!ts) return '–';
      return new Date(ts).toLocaleTimeString(this._locale(),{ hour:'2-digit',minute:'2-digit',second:'2-digit' });
    },

    _setupOrientationCapabilityProbe() {
      if (!this.shadow) return;
      const btn = this.shadow.getElementById('device-toggle');
      if (!btn) return;

      const hasDeviceOrientation = typeof window !== 'undefined' && typeof window.DeviceOrientationEvent !== 'undefined';
      const hasAbsoluteSensor = typeof window !== 'undefined' && typeof window.AbsoluteOrientationSensor !== 'undefined';

      // Wichtig: den Geräte-Schalter nicht mehr nach einem kurzen Probe-Timer verstecken.
      // Gerade Home-Assistant-WebViews liefern Sensordaten häufig erst nach einer Nutzeraktion.
      if (!hasDeviceOrientation && !hasAbsoluteSensor) {
        btn.classList.add('unavailable');
        btn.disabled = true;
        this._syncDeviceCompassControl(false);
        return;
      }

      btn.classList.remove('unavailable');
      btn.disabled = false;
      this._syncDeviceCompassControl(this._hass?.states?.[this._deviceOrientationEntity()]?.state === 'on');

      // Auf Plattformen ohne explizite Freigabe können wir bereits lauschen. Auf iOS
      // bleibt der Schalter sichtbar; die Freigabe wird erst beim Tippen angefordert.
      const needsPermission = typeof window.DeviceOrientationEvent?.requestPermission === 'function';
      if (!needsPermission) this._startOrientationListeners();
    },

    _syncDeviceCompassControl(deviceMode) {
      const button=this.shadow?.getElementById('device-toggle');
      const label=this.shadow?.getElementById('device-main');
      if(!button)return;
      const active=!!deviceMode&&!button.disabled;
      const labelText=this._t(active?'compass.device_compass':'compass.device');
      const description=this._t(active?'compass.device_title':'compass.fixed_compass_title');
      if(label)label.textContent=labelText;
      button.title=description;
      button.setAttribute('aria-label',`${labelText}: ${description}`);
      button.setAttribute('aria-description',description);
    },

    async _requestOrientationPermission() {
      try {
        const OrientationEvent = window.DeviceOrientationEvent;
        if (OrientationEvent && typeof OrientationEvent.requestPermission === 'function') {
          const result = await OrientationEvent.requestPermission();
          return result === 'granted';
        }
        return !!OrientationEvent || typeof window.AbsoluteOrientationSensor !== 'undefined';
      } catch (err) {
        console.warn('Lightning Detection: device orientation permission failed.',err);
        return false;
      }
    },

    _smoothCompassHeading(previous,next,factor=.24) {
      if (previous == null || !Number.isFinite(Number(previous))) return ((next%360)+360)%360;
      const p = ((Number(previous)%360)+360)%360;
      const n = ((Number(next)%360)+360)%360;
      const delta = ((n - p + 540) % 360) - 180;
      return (p + delta*factor + 360) % 360;
    },

    _commitDeviceHeading(rawHeading,isAbsolute=true) {
      const value = finiteNumber(rawHeading);
      if (value == null) return;
      const normalized = ((value%360)+360)%360;
      this._orientationReceived = true;
      this._orientationAbsolute = !!isAbsolute;
      this._pendingDeviceHeading = normalized;

      // Sensoren können 30–60 Ereignisse pro Sekunde liefern. Ein RAF hält die Animation
      // weich und verhindert unnötige vollständige Renderdurchläufe.
      if (this._orientationFrame) return;
      this._orientationFrame = requestAnimationFrame(() => {
        this._orientationFrame = null;
        const next = this._pendingDeviceHeading;
        this._deviceHeading = this._smoothCompassHeading(this._deviceHeading,next,.24);
        const btn = this.shadow?.getElementById('device-toggle');
        btn?.classList.remove('unavailable');
        this._syncDeviceCompassControl(this._hass?.states?.[this._deviceOrientationEntity()]?.state === 'on');

        if (this._hass?.states?.[this._deviceOrientationEntity()]?.state === 'on') {
          this._renderCompass(this._lastCompassStrike || null,Date.now(),this._currentDangerRadius ?? this._dangerRadiusValue(),true);
        }
      });
    },

    _startOrientationListeners() {
      if (this._orientationListening) return;
      this._orientationListening = true;

      this._orientationHandler = (event) => {
        let heading = null;
        let absolute = false;
        const screenAngle = finiteNumber(window.screen?.orientation?.angle) ?? finiteNumber(window.orientation) ?? 0;

        // iOS / WebKit liefert mit webkitCompassHeading direkt eine magnetische Nordreferenz.
        if (finiteNumber(event.webkitCompassHeading) != null) {
          heading = finiteNumber(event.webkitCompassHeading);
          absolute = true;
        }
        // Android/Chromium: deviceorientationabsolute bzw. absolute=true.
        else if (finiteNumber(event.alpha) != null && (event.absolute === true || event.type === 'deviceorientationabsolute')) {
          heading = (360 - finiteNumber(event.alpha) + screenAngle + 360) % 360;
          absolute = true;
        }

        // Relative alpha-Werte werden bewusst NICHT als geografischer Norden ausgegeben.
        // Dadurch zeigt die Premium-Nadel nur dann N/S, wenn wirklich eine Nordreferenz vorliegt.
        if (heading == null) return;
        this._commitDeviceHeading(heading,absolute);
      };

      window.addEventListener('deviceorientationabsolute',this._orientationHandler,true);
      window.addEventListener('deviceorientation',this._orientationHandler,true);

      // Optionaler Fallback für Browser mit Generic Sensor API.
      if (typeof window.AbsoluteOrientationSensor !== 'undefined' && !this._absoluteOrientationSensor) {
        try {
          const sensor = new window.AbsoluteOrientationSensor({ frequency:30, referenceFrame:'device' });
          sensor.addEventListener('reading',() => {
            const q = sensor.quaternion;
            if (!q || q.length < 4) return;
            const [x,y,z,w] = q.map(Number);
            if (![x,y,z,w].every(Number.isFinite)) return;
            const yaw = Math.atan2(2*(w*z + x*y),1 - 2*(y*y + z*z)) * 180 / Math.PI;
            const screenAngle = finiteNumber(window.screen?.orientation?.angle) ?? finiteNumber(window.orientation) ?? 0;
            const heading = (360 - yaw + screenAngle + 360) % 360;
            this._commitDeviceHeading(heading,true);
          });
          sensor.addEventListener('error',(event) => {
            console.debug('Lightning Detection: AbsoluteOrientationSensor unavailable.',event?.error || event);
          });
          sensor.start();
          this._absoluteOrientationSensor = sensor;
        } catch (err) {
          // DeviceOrientationEvent bleibt der Hauptweg; dieser Fallback ist optional.
        }
      }
    },

    _removeOrientationListeners() {
      if (this._orientationHandler) {
        window.removeEventListener('deviceorientationabsolute',this._orientationHandler,true);
        window.removeEventListener('deviceorientation',this._orientationHandler,true);
      }
      this._orientationHandler = null;
      this._orientationListening = false;

      if (this._absoluteOrientationSensor) {
        try { this._absoluteOrientationSensor.stop(); } catch (err) {}
        this._absoluteOrientationSensor = null;
      }
      if (this._orientationFrame) {
        cancelAnimationFrame(this._orientationFrame);
        this._orientationFrame = null;
      }
    },

};});

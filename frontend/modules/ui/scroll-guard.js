import { defineModule } from "../core/runtime.js?v=41002r11";
export const MODULE_META=Object.freeze({
  "id": "ui.scroll-guard",
  "version": "1.0.2",
  "group": "Oberfläche",
  "function": "Scrollschutz",
  "subfunctions": [
    "Home-Assistant-Seitenleiste",
    "Touch",
    "iPad/WebKit",
    "HA-State"
  ],
  "file": "modules/ui/scroll-guard.js"
});
export const installScrollGuard=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _sidebarGuardWindowY() {
      const winY = Number(window?.scrollY);
      if (Number.isFinite(winY)) return winY;
      const docScroller = document.scrollingElement || document.documentElement;
      return Number(docScroller?.scrollTop) || 0;
    },

    _sidebarGuardRestoreWindowY(wantedY) {
      if (!Number.isFinite(wantedY) || wantedY < 0) return;
      this._sidebarGuardRestoring = true;
      try {
        window.scrollTo({ left:window.scrollX || 0, top:wantedY, behavior:'auto' });
      } catch (_) {
        try { window.scrollTo(window.scrollX || 0,wantedY); } catch (_) {}
      }
      const docScroller = document.scrollingElement || document.documentElement;
      if (docScroller && Math.abs((Number(docScroller.scrollTop) || 0) - wantedY) > 2) {
        try { docScroller.scrollTop = wantedY; } catch (_) {}
      }
      requestAnimationFrame(() => {
        this._sidebarGuardRestoring = false;
      });
    },

    _setupSidebarScrollGuard() {
      if (this._sidebarGuardScrollHandler || typeof window === 'undefined') return;

      // Echte Berührung startet eine neue Benutzer-Scrollsession. Während der
      // Finger auf dem Display liegt, darf die Karte niemals korrigierend scrollen.
      this._sidebarGuardTouchStartHandler = () => {
        if (!this._isSidebarNarrowIPadLayout()) return;
        const y = this._sidebarGuardWindowY();
        this._sidebarGuardTouchActive = true;
        this._sidebarGuardStartY = y;
        this._sidebarGuardLastY = y;
        this._sidebarGuardDirection = 0;
        this._sidebarProtectedY = y;
        this._sidebarAllowUpwardUntil = 0;
      };

      const endTouch = () => {
        if (!this._sidebarGuardTouchActive) return;
        const y = this._sidebarGuardWindowY();
        if (Number.isFinite(this._sidebarGuardLastY)) {
          const delta = y - this._sidebarGuardLastY;
          if (Math.abs(delta) > .5) this._sidebarGuardDirection = Math.sign(delta);
        }
        this._sidebarGuardTouchActive = false;
        this._sidebarGuardLastY = y;
        this._sidebarProtectedY = y;

        // Nur wenn der Benutzer bewusst nach OBEN gescrollt hat (scrollY sinkt),
        // darf die iOS-Trägheit noch kurz weiter nach oben laufen. Beim typischen
        // Problemfall – Benutzer scrollt nach unten zum Verlauf – gibt es bewusst
        // KEIN solches Zeitfenster. Genau dort kam der HA-Sprung unmittelbar danach.
        this._sidebarAllowUpwardUntil = this._sidebarGuardDirection < 0
          ? performance.now() + 750
          : 0;
      };
      this._sidebarGuardTouchEndHandler = endTouch;

      // Trackpad/Maus am iPad: wheel ist ein echtes Nutzersignal, aber nur sehr kurz.
      this._sidebarGuardWheelHandler = () => {
        if (!this._isSidebarNarrowIPadLayout()) return;
        this._sidebarGuardWheelUntil = performance.now() + 180;
      };

      this._sidebarGuardScrollHandler = () => {
        if (!this._isSidebarNarrowIPadLayout()) {
          this._sidebarProtectedY = null;
          return;
        }

        const y = this._sidebarGuardWindowY();
        if (!Number.isFinite(y)) return;

        if (this._sidebarGuardRestoring) {
          this._sidebarProtectedY = Math.max(Number(this._sidebarProtectedY) || 0,y);
          return;
        }

        // Während einer echten Touch-/Wheel-Aktion gehört jede Bewegung dem Nutzer.
        if (this._sidebarGuardTouchActive || performance.now() <= this._sidebarGuardWheelUntil) {
          if (Number.isFinite(this._sidebarGuardLastY)) {
            const delta = y - this._sidebarGuardLastY;
            if (Math.abs(delta) > .5) this._sidebarGuardDirection = Math.sign(delta);
          }
          this._sidebarGuardLastY = y;
          this._sidebarProtectedY = y;
          return;
        }

        if (!Number.isFinite(this._sidebarProtectedY)) {
          this._sidebarProtectedY = y;
          this._sidebarGuardLastY = y;
          return;
        }

        const protectedY = Number(this._sidebarProtectedY);

        // Nach unten gerichtete Trägheit ist legitim und wird als neuer Zielpunkt
        // übernommen. Dasselbe gilt kurzzeitig für bewusst nach oben gerichtete
        // Trägheit nach einer entsprechenden Benutzerbewegung.
        if (y >= protectedY - 3) {
          if (y > protectedY) this._sidebarProtectedY = y;
          this._sidebarGuardLastY = y;
          return;
        }
        if (performance.now() <= this._sidebarAllowUpwardUntil) {
          this._sidebarProtectedY = y;
          this._sidebarGuardLastY = y;
          return;
        }

        // V3.75-Diagnose: cardTop + window.scrollY blieb konstant (~56 px).
        // Es gab also KEINEN Layoutsprung, sondern window wurde automatisch von
        // z.B. 240 auf 132 gescrollt. Genau diese unbegleitete Aufwärtsbewegung
        // wird hier sofort zurückgenommen – noch bevor set hass() aufgerufen wird.
        if (protectedY - y > 8) {
          this._sidebarGuardRestoreWindowY(protectedY);
          return;
        }

        this._sidebarGuardLastY = y;
      };

      window.addEventListener('touchstart',this._sidebarGuardTouchStartHandler,{capture:true,passive:true});
      window.addEventListener('touchend',this._sidebarGuardTouchEndHandler,{capture:true,passive:true});
      window.addEventListener('touchcancel',this._sidebarGuardTouchEndHandler,{capture:true,passive:true});
      window.addEventListener('wheel',this._sidebarGuardWheelHandler,{capture:true,passive:true});
      window.addEventListener('scroll',this._sidebarGuardScrollHandler,{capture:true,passive:true});

      if (this._isSidebarNarrowIPadLayout()) {
        this._sidebarProtectedY = this._sidebarGuardWindowY();
      }
    },

    _teardownSidebarScrollGuard() {
      if (typeof window === 'undefined') return;
      if (this._sidebarGuardTouchStartHandler) {
        window.removeEventListener('touchstart',this._sidebarGuardTouchStartHandler,true);
      }
      if (this._sidebarGuardTouchEndHandler) {
        window.removeEventListener('touchend',this._sidebarGuardTouchEndHandler,true);
        window.removeEventListener('touchcancel',this._sidebarGuardTouchEndHandler,true);
      }
      if (this._sidebarGuardWheelHandler) {
        window.removeEventListener('wheel',this._sidebarGuardWheelHandler,true);
      }
      if (this._sidebarGuardScrollHandler) {
        window.removeEventListener('scroll',this._sidebarGuardScrollHandler,true);
      }
      this._sidebarGuardTouchStartHandler = null;
      this._sidebarGuardTouchEndHandler = null;
      this._sidebarGuardWheelHandler = null;
      this._sidebarGuardScrollHandler = null;
      this._sidebarGuardTouchActive = false;
      this._sidebarGuardRestoring = false;
    },

    _captureScrollState() {
      // V3.70 – sämtliche relevanten COMPOSED Vorfahren sichern.
      // Wichtig: nicht nur overflow:auto/scroll akzeptieren. Home Assistant nutzt
      // je nach Frontend/iPad-Version auch Container, deren effektiver ScrollTop
      // ungleich 0 ist, obwohl overflowY nicht als klassisch scrollbar gemeldet wird.
      const result = [];
      const seen = new Set();
      const docScroller = document.scrollingElement || document.documentElement;

      const add = (el) => {
        if (!el || seen.has(el)) return;
        seen.add(el);

        const top = Number(el.scrollTop) || 0;
        const left = Number(el.scrollLeft) || 0;
        const scrollHeight = Number(el.scrollHeight) || 0;
        const clientHeight = Number(el.clientHeight) || 0;
        const scrollWidth = Number(el.scrollWidth) || 0;
        const clientWidth = Number(el.clientWidth) || 0;
        const hasVerticalRange = scrollHeight > clientHeight + 2;
        const hasHorizontalRange = scrollWidth > clientWidth + 2;

        let overflowY = '';
        let overflowX = '';
        try {
          const cs = getComputedStyle(el);
          overflowY = cs.overflowY || '';
          overflowX = cs.overflowX || '';
        } catch (_) {}

        const cssScrollable = /auto|scroll|overlay/i.test(`${overflowY} ${overflowX}`);
        const carriesScrollPosition = Math.abs(top) > 0.5 || Math.abs(left) > 0.5;

        if (
          el === docScroller ||
          carriesScrollPosition ||
          hasVerticalRange ||
          hasHorizontalRange ||
          cssScrollable
        ) {
          result.push({ el, top, left });
        }
      };

      // Echte COMPOSED-Hierarchie verfolgen: bei geslotteten Lovelace-Inhalten
      // liegt der wirksame HA-Scrollcontainer häufig oberhalb von assignedSlot.
      // parentElement/getRootNode().host allein überspringt genau diesen Pfad.
      const composedParent = (node) => {
        if (!node) return null;
        if (node.assignedSlot) return node.assignedSlot;
        if (node.parentElement) return node.parentElement;
        const root = node.getRootNode?.();
        return root?.host || null;
      };

      let node = this;
      let guard = 0;
      while (node && guard++ < 120) {
        const parent = composedParent(node);
        if (!parent || parent === node) break;
        node = parent;
        add(node);
      }

      // Zusätzlich den durch ein reales Benutzer-Scrollereignis ermittelten
      // Target sichern. Das deckt HA/WebKit-Konstellationen ab, in denen der
      // Scrollcontainer selbst über die composed Hierarchie nicht erreichbar ist.
      add(this._lastUserScrollTarget);
      add(docScroller);
      return result;
    },

    _cancelScrollRememberTimers() {
      if (!Array.isArray(this._scrollRememberTimers)) this._scrollRememberTimers = [];
      this._scrollRememberTimers.forEach((timer) => clearTimeout(timer));
      this._scrollRememberTimers = [];
    },

    _cancelScrollRestoreTimers() {
      if (!Array.isArray(this._scrollRestoreTimers)) this._scrollRestoreTimers = [];
      this._scrollRestoreTimers.forEach((timer) => clearTimeout(timer));
      this._scrollRestoreTimers = [];
      this._scrollRestoreGeneration += 1;
    },

    _scheduleUserScrollRemember() {
      this._cancelScrollRememberTimers();

      // iPadOS besitzt Momentum-Scrolling. Deshalb nicht nur am Touch-Ende selbst,
      // sondern auch nach dem Ausrollen übernehmen. force=true erlaubt ausdrücklich
      // auch scrollTop=0, wenn der Nutzer bewusst wieder ganz nach oben gegangen ist.
      [0,120,360,700].forEach((delay) => {
        const timer = setTimeout(() => {
          this._rememberStableScrollState(true);
          this._rememberStableWindowScrollY(true);
          this._rememberSidebarVisualScrollAnchor(true);
          // V3.73 – nur im problematischen schmalen iPad-Zustand. Das ist
          // bewusst teurer als die normalen Captures, läuft aber ausschließlich
          // nach echter Benutzerinteraktion und nicht bei jedem HA-Update.
          if (delay >= 120) this._rememberDeepUserScrollState();
        },delay);
        this._scrollRememberTimers.push(timer);
      });
    },

    _captureDeepUserScrollState() {
      if (!this._isSidebarNarrowIPadLayout() || typeof document === 'undefined') return [];

      const found = [];
      const seen = new Set();

      const inspect = (el) => {
        if (!el || seen.has(el) || typeof el !== 'object') return;
        seen.add(el);

        let top = 0;
        let left = 0;
        let scrollHeight = 0;
        let clientHeight = 0;
        try {
          top = Number(el.scrollTop) || 0;
          left = Number(el.scrollLeft) || 0;
          scrollHeight = Number(el.scrollHeight) || 0;
          clientHeight = Number(el.clientHeight) || 0;
        } catch (_) { return; }

        // Relevant ist hier bewusst nur ein Container, der vom Benutzer bereits
        // tatsächlich vertikal bewegt wurde. Damit speichern wir keine hunderte
        // theoretisch scrollbaren HA-Komponenten mit scrollTop=0.
        if (top > 6 && scrollHeight > clientHeight + 2) {
          found.push({ el, top, left });
        }
      };

      const walkRoot = (root) => {
        if (!root?.querySelectorAll) return;
        let elements = [];
        try { elements = root.querySelectorAll('*'); } catch (_) { return; }

        for (const el of elements) {
          inspect(el);
          // Lit/Home-Assistant verwendet in der Regel offene Shadow Roots.
          // Genau dort sitzt beim ausgeklappten Drawer sehr wahrscheinlich der
          // Scroller, den window.scrollY und die Vorfahrensuche nicht sehen.
          if (el.shadowRoot) walkRoot(el.shadowRoot);
        }
      };

      inspect(document.scrollingElement || document.documentElement);
      walkRoot(document);
      return found;
    },

    _rememberDeepUserScrollState() {
      const snapshot = this._captureDeepUserScrollState();
      if (snapshot.length) this._deepUserScrollSnapshot = snapshot;
      return snapshot;
    },

    _cancelDeepScrollRestoreTimers() {
      if (!Array.isArray(this._deepScrollRestoreTimers)) this._deepScrollRestoreTimers = [];
      this._deepScrollRestoreTimers.forEach((timer) => clearTimeout(timer));
      this._deepScrollRestoreTimers = [];
      this._deepScrollRestoreGeneration += 1;
    },

    _restoreDeepUserScrollState(snapshot) {
      if (!this._isSidebarNarrowIPadLayout() || !Array.isArray(snapshot) || !snapshot.length) return false;

      const valid = snapshot.filter(({ el, top }) =>
        el && Number.isFinite(Number(top)) && Number(top) > 6
      );
      if (!valid.length) return false;

      this._cancelDeepScrollRestoreTimers();
      const generation = ++this._deepScrollRestoreGeneration;
      const userIntentGeneration = this._scrollUserIntentGeneration;

      const restore = () => {
        if (generation !== this._deepScrollRestoreGeneration) return;
        if (userIntentGeneration !== this._scrollUserIntentGeneration) return;
        if (!this._isSidebarNarrowIPadLayout()) return;

        valid.forEach(({ el, top, left }) => {
          // Die Elementreferenz bleibt über normale hass-Updates erhalten. Falls
          // Home Assistant den gesamten Container ersetzt hat, überspringen wir
          // sie statt auf einen möglicherweise falschen Scroller auszuweichen.
          if (el !== document.scrollingElement && el !== document.documentElement && !el.isConnected) return;

          let currentTop = 0;
          try { currentTop = Number(el.scrollTop) || 0; } catch (_) { return; }
          const wantedTop = Number(top) || 0;

          // Nur den bekannten automatischen Sprung nach OBEN zurücknehmen.
          if (wantedTop > 6 && currentTop < wantedTop - 3) {
            try { el.scrollTop = wantedTop; } catch (_) {}
          }

          const wantedLeft = Number(left) || 0;
          let currentLeft = 0;
          try { currentLeft = Number(el.scrollLeft) || 0; } catch (_) {}
          if (Math.abs(currentLeft - wantedLeft) > 2) {
            try { el.scrollLeft = wantedLeft; } catch (_) {}
          }
        });
      };

      restore();
      requestAnimationFrame(() => {
        restore();
        requestAnimationFrame(restore);
      });
      [35,80,150,260,420,650,900,1250].forEach((delay) => {
        const timer = setTimeout(restore,delay);
        this._deepScrollRestoreTimers.push(timer);
      });
      return true;
    },

    _rememberStableWindowScrollY(force = false) {
      if (typeof window === 'undefined') return;

      // V3.72 – der problematische Sprung endet bei der KPI-Zeile und damit
      // deutlich oberhalb 0. Ein periodischer Wächter könnte diesen FEHLER sonst
      // fälschlich als neue stabile Position übernehmen. In der schmalen
      // iPad/Sidebar-Ansicht akzeptieren wir deshalb ausschließlich Positionen,
      // die aus einem echten Benutzer-Gestenfenster stammen (force=true).
      if (this._isSidebarNarrowIPadLayout() && !force) return;

      const y = Number(window.scrollY ?? window.pageYOffset ?? 0) || 0;
      if (force || y > 6) this._lastStableWindowScrollY = y;
    },

    _cancelWindowScrollRestoreTimers() {
      if (!Array.isArray(this._windowScrollRestoreTimers)) this._windowScrollRestoreTimers = [];
      this._windowScrollRestoreTimers.forEach((timer) => clearTimeout(timer));
      this._windowScrollRestoreTimers = [];
      this._windowScrollRestoreGeneration += 1;
    },

    _restoreSidebarWindowScrollY(wantedY) {
      if (!this._isSidebarNarrowIPadLayout()) return false;
      wantedY = Number(wantedY);
      if (!Number.isFinite(wantedY) || wantedY <= 6) return false;

      this._cancelWindowScrollRestoreTimers();
      const generation = ++this._windowScrollRestoreGeneration;
      const userIntentGeneration = this._scrollUserIntentGeneration;

      const restore = () => {
        if (generation !== this._windowScrollRestoreGeneration) return;
        if (userIntentGeneration !== this._scrollUserIntentGeneration) return;
        if (!this._isSidebarNarrowIPadLayout()) return;

        const currentY = Number(window.scrollY ?? window.pageYOffset ?? 0) || 0;
        // Nur automatische Sprünge nach OBEN zurücknehmen. Ein bewusstes
        // Weiterscrollen nach unten wird niemals überschrieben.
        if (currentY < wantedY - 3) {
          try { window.scrollTo({ left:0, top:wantedY, behavior:'auto' }); }
          catch (_) { try { window.scrollTo(0,wantedY); } catch (_) {} }

          // iPad/WebKit hält window.scrollY und scrollingElement nicht in jedem
          // Paint-Zyklus synchron. Der direkte Fallback ist daher absichtlich
          // zusätzlich gesetzt.
          const docScroller = document.scrollingElement || document.documentElement;
          if (docScroller && Math.abs((Number(docScroller.scrollTop) || 0) - wantedY) > 3) {
            try { docScroller.scrollTop = wantedY; } catch (_) {}
          }
        }
      };

      restore();
      requestAnimationFrame(() => {
        restore();
        requestAnimationFrame(restore);
      });
      [30,70,140,240,380,560,780,1050].forEach((delay) => {
        const timer = setTimeout(restore,delay);
        this._windowScrollRestoreTimers.push(timer);
      });
      return true;
    },

    _isAndroidLike() {
      if (typeof navigator === 'undefined') return false;
      return /Android/i.test(navigator.userAgent || '');
    },

    _isIPadLike() {
      if (typeof navigator === 'undefined') return false;
      const ua = navigator.userAgent || '';
      const platform = navigator.platform || '';
      return /iPad/i.test(ua) || (platform === 'MacIntel' && Number(navigator.maxTouchPoints) > 1);
    },

    _isSidebarNarrowIPadLayout() {
      // Spiegelbild der bereits bewährten CSS-Bedingung:
      // Viewport bleibt iPad-Landscape/zweispaltig (>=1101 px), die tatsächlich
      // verfügbare Custom-Card-Breite fällt durch die ausgeklappte HA-Seitenleiste
      // jedoch auf <=900 px. Nur dort ist der Scrollfehler reproduzierbar.
      if (!this._isIPadLike()) return false;
      if (typeof window === 'undefined' || !window.matchMedia?.('(min-width:1101px)').matches) return false;
      const shell = this.shadow?.querySelector?.('.shell');
      const width = shell?.getBoundingClientRect?.().width || this.getBoundingClientRect?.().width || 0;
      return width > 0 && width <= 905;
    },

    _rememberSidebarVisualScrollAnchor(force = false) {
      if (!this.isConnected || !this._isSidebarNarrowIPadLayout()) {
        if (force) this._sidebarVisualScrollAnchor = null;
        return null;
      }

      const card = this.shadow?.getElementById?.('card-root');
      if (!card) return null;

      const rect = card.getBoundingClientRect();
      const viewportHeight = Math.max(1,
        Number(window.visualViewport?.height) ||
        Number(window.innerHeight) ||
        Number(document.documentElement?.clientHeight) ||
        1
      );

      const visibleTop = Math.max(0,rect.top);
      const visibleBottom = Math.min(viewportHeight,rect.bottom);
      const visibleHeight = visibleBottom - visibleTop;
      if (visibleHeight < 48 || rect.height < 2) return null;

      // Ein Punkt ungefähr in der Mitte des momentan sichtbaren Kartenausschnitts
      // ist deutlich stabiler als die Kartenoberkante selbst. Genau die wird vom
      // fehlerhaften HA-Anchoring nämlich auf die KPI-Zeile gezogen.
      const viewportY = clamp(
        visibleTop + visibleHeight * .50,
        72,
        Math.max(72,viewportHeight - 72)
      );
      const localY = clamp(viewportY - rect.top,1,Math.max(1,rect.height - 1));

      const anchor = {
        localY,
        viewportY,
        capturedAt:performance.now()
      };
      this._sidebarVisualScrollAnchor = anchor;
      return anchor;
    },

    _cancelSidebarAnchorRestoreTimers() {
      if (!Array.isArray(this._sidebarAnchorRestoreTimers)) this._sidebarAnchorRestoreTimers = [];
      this._sidebarAnchorRestoreTimers.forEach((timer) => clearTimeout(timer));
      this._sidebarAnchorRestoreTimers = [];
      this._sidebarAnchorRestoreGeneration += 1;
    },

    _restoreSidebarVisualScrollAnchor(anchor) {
      if (!anchor || !this._isSidebarNarrowIPadLayout()) return false;
      const probe = this.shadow?.getElementById?.('sidebar-scroll-anchor');
      const card = this.shadow?.getElementById?.('card-root');
      if (!probe || !card) return false;

      this._cancelSidebarAnchorRestoreTimers();
      const generation = ++this._sidebarAnchorRestoreGeneration;
      const userIntentGeneration = this._scrollUserIntentGeneration;

      const restore = () => {
        if (generation !== this._sidebarAnchorRestoreGeneration) return;
        if (userIntentGeneration !== this._scrollUserIntentGeneration) return;
        if (!this._isSidebarNarrowIPadLayout()) return;

        const cardRect = card.getBoundingClientRect();
        const maxLocalY = Math.max(1,cardRect.height - 1);
        const localY = clamp(Number(anchor.localY) || 1,1,maxLocalY);
        const viewportY = Math.max(0,Number(anchor.viewportY) || 0);

        probe.style.top = `${localY}px`;
        probe.style.scrollMarginTop = `${viewportY}px`;

        const currentY = probe.getBoundingClientRect().top;
        const delta = currentY - viewportY;

        // Nur den beobachteten automatischen Sprung NACH OBEN korrigieren.
        // Nach diesem Fehler steht unser interner Anker deutlich zu tief im Viewport
        // (delta > 0). Ein bewusstes Weiterscrollen des Nutzers wird nicht angefasst.
        if (delta > 3) {
          try {
            probe.scrollIntoView({ behavior:'auto', block:'start', inline:'nearest' });
          } catch (_) {
            try { probe.scrollIntoView(true); } catch (_) {}
          }
        }
      };

      // WebKit/HA setzt den unerwünschten Anker nicht immer im selben Paint-Zyklus.
      // Deshalb prüfen wir kurz nach dem Render mehrfach. Anders als V3.70 müssen wir
      // keinen internen HA-Scroller kennen: scrollIntoView wählt ihn selbst.
      restore();
      requestAnimationFrame(() => {
        restore();
        requestAnimationFrame(restore);
      });

      [40,90,180,320,520,800].forEach((delay) => {
        const timer = setTimeout(restore,delay);
        this._sidebarAnchorRestoreTimers.push(timer);
      });
      return true;
    },

    _rememberStableScrollState(force = false) {
      if (!this.isConnected) return;

      // V3.72 – entscheidend: Im Fehlerzustand springt HA nicht auf scrollTop=0,
      // sondern auf die Oberkante der KPI-Karten. Der alte 180-ms-Wächter hat
      // diese weiterhin positive Position deshalb als "stabil" gelernt und den
      // eigentlichen Benutzerstand überschrieben. Hier wird in genau diesem
      // Layout nur noch echtes Benutzer-Scrollen (force=true) übernommen.
      if (this._isSidebarNarrowIPadLayout() && !force) return;

      const snapshot = this._captureScrollState();
      if (!snapshot.length) return;

      const hasMeaningfulPosition = snapshot.some(({ top, left }) =>
        Math.abs(Number(top) || 0) > 6 || Math.abs(Number(left) || 0) > 6
      );

      // Das 180-ms-Wächterintervall darf einen plötzlich auf 0 gesprungenen
      // HA-Zustand NICHT als neue Wahrheit abspeichern. Nur echte Nutzereingaben
      // (force=true) dürfen scrollTop=0 absichtlich übernehmen.
      if (force || hasMeaningfulPosition) {
        this._stableScrollSnapshot = snapshot;
      }
    },

    _restoreScrollState(snapshot) {
      if (!Array.isArray(snapshot) || !snapshot.length) return;

      // Einen vorherigen Schutzzyklus sauber ablösen, damit sich bei dichter
      // Blitzfolge keine alten Timer ansammeln oder gegenseitig beeinflussen.
      this._cancelScrollRestoreTimers();
      const restoreGeneration = ++this._scrollRestoreGeneration;
      const userIntentGeneration = this._scrollUserIntentGeneration;

      const restoreIfJumped = () => {
        if (restoreGeneration !== this._scrollRestoreGeneration) return;
        if (userIntentGeneration !== this._scrollUserIntentGeneration) return;

        snapshot.forEach(({ el, top, left }) => {
          if (!el) return;
          if (!el.isConnected && el !== document.scrollingElement && el !== document.documentElement) return;

          const wantedTop = Number(top) || 0;
          const wantedLeft = Number(left) || 0;
          const currentTop = Number(el.scrollTop) || 0;
          const currentLeft = Number(el.scrollLeft) || 0;

          // Nur ungewollte Sprünge NACH OBEN zurücknehmen. Scrollt der Nutzer
          // weiter nach unten, wird seine neue Position niemals zurückgedrückt.
          if (wantedTop > 6 && currentTop < wantedTop - 3) {
            try { el.scrollTop = wantedTop; } catch (_) {}
          }

          if (Math.abs(currentLeft - wantedLeft) > 2) {
            try { el.scrollLeft = wantedLeft; } catch (_) {}
          }
        });
      };

      // Der frühere V3.60-Fix wartete nur zwei requestAnimationFrames. Auf dem
      // normalen iPad erfolgt das HA/WebKit-Scroll-Anchoring teilweise deutlich
      // später. Deshalb halten wir die gespeicherte Position für knapp 1 s gegen
      // ausschließlich automatische Aufwärtssprünge stabil. Nutzereingaben
      // brechen diese Schutzphase sofort ab.
      restoreIfJumped();
      requestAnimationFrame(() => {
        restoreIfJumped();
        requestAnimationFrame(restoreIfJumped);
      });

      [50,120,250,450,700,950].forEach((delay) => {
        const timer = setTimeout(() => {
          restoreIfJumped();
          if (delay === 950 && restoreGeneration === this._scrollRestoreGeneration) {
            this._rememberStableScrollState(false);
          }
        },delay);
        this._scrollRestoreTimers.push(timer);
      });
    },

    set hass(hass) {
      if(this._diagnosticTimings&&!Number.isFinite(this._diagnosticTimings.firstHassAt))this._diagnosticTimings.firstHassAt=performance.now();
      // V3.86 – vollständiger produktiver Aktualisierungspfad.
      // _ingestStrikes und _render laufen wieder bei jedem HA-Update;
      // der Auto-Scroll-Fix sitzt ausschließlich in der stabilen Recent-DOM-Aktualisierung.
      this._hass = hass;
      const confirmedLanguage = String(hass?.states?.[this._languageEntity()]?.state || '').trim();
      if (this._languagePreview && confirmedLanguage === this._languagePreview) this._languagePreview = null;
      const confirmedDistanceUnit = String(hass?.states?.[this._distanceUnitEntity()]?.state || '').trim().toUpperCase();
      if (this._distanceUnitPreview && confirmedDistanceUnit === this._distanceUnitPreview) this._distanceUnitPreview = null;
      const confirmedAuraState = String(hass?.states?.[this._auraEntity()]?.state || '').trim();
      const confirmedAuraEnabled = confirmedAuraState === 'on' ? true : confirmedAuraState === 'off' ? false : null;
      if (typeof this._settingsAuraEnabledPreview === 'boolean' && confirmedAuraEnabled === this._settingsAuraEnabledPreview) {
        this._settingsAuraEnabledPreview = null;
        clearTimeout(this._settingsAuraEnabledPreviewTimer);
        this._settingsAuraEnabledPreviewTimer = null;
      }
      const confirmedAuraWidth = finiteNumber(hass?.states?.[this._auraWidthEntity()]?.state);
      if (Number.isFinite(this._settingsAuraWidthPreview) && confirmedAuraWidth != null && Math.abs(confirmedAuraWidth-this._settingsAuraWidthPreview) < .001) {
        this._settingsAuraWidthPreview = null;
        clearTimeout(this._settingsAuraWidthPreviewTimer);
        this._settingsAuraWidthPreviewTimer = null;
      }
      const confirmedAuraIntensity = finiteNumber(hass?.states?.[this._auraIntensityEntity()]?.state);
      if (Number.isFinite(this._settingsAuraIntensityPreview) && confirmedAuraIntensity != null && Math.abs(confirmedAuraIntensity-this._settingsAuraIntensityPreview) < .001) {
        this._settingsAuraIntensityPreview = null;
        clearTimeout(this._settingsAuraIntensityPreviewTimer);
        this._settingsAuraIntensityPreviewTimer = null;
      }
      const confirmedLocation = String(hass?.states?.[this._locationSelectEntity()]?.state || '').trim();
      if (this._settingsLocationPreview && confirmedLocation === this._settingsLocationPreview) {
        this._settingsLocationPreview = null;
        clearTimeout(this._settingsLocationPreviewTimer);
        this._settingsLocationPreviewTimer = null;
      }
      if (!this._built) this._buildSkeleton();
      const newStrikes = this._ingestStrikes(hass);

      const grouped = hass?.states?.[this._mapGroupingEntity()]?.state !== 'off';
      const observationRadius = this._observationRadiusValue(hass);
      const stormRadius = Math.min(this._stormRadiusValue(hass),observationRadius);
      const dangerRadius = Math.min(this._dangerRadiusValue(hass),stormRadius);
      const dangerousNew = (newStrikes || []).some(
        strike => strike?.distance != null && strike.distance <= dangerRadius
      );

      // Gefahrentreffer bleiben ohne Zusatzlatenz Einzelblitze. Nur normale
      // Cluster-Updates werden kurz gesammelt, während KPI/Recent/Kompass/Verlauf
      // im aktuellen HA-Zyklus weiter sofort aktualisiert werden.
      if (dangerousNew && this._clusterRenderDebounceTimer) {
        clearTimeout(this._clusterRenderDebounceTimer);
        this._clusterRenderDebounceTimer = null;
      }

      const clusterDebounceActive =
        grouped &&
        this._mapReady &&
        !dangerousNew &&
        ((newStrikes || []).length > 0 || !!this._clusterRenderDebounceTimer);

      if (clusterDebounceActive) {
        if ((newStrikes || []).length > 0) this._scheduleClusterRender();
        this._suppressClusterRender = true;
        this._render();
        this._suppressClusterRender = false;
      } else {
        this._suppressClusterRender = false;
        this._render();
      }
    },

};});

import { defineModule } from "../core/runtime.js?v=41002r11";
export const MODULE_META=Object.freeze({
  "id": "history.chart",
  "version": "1.0.2",
  "group": "Verlauf",
  "function": "Trend & Verlauf",
  "subfunctions": [
    "Trendberechnung",
    "120-Minuten-Diagramm"
  ],
  "file": "modules/history/chart.js"
});
export const installHistoryChart=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _updateHistoryTrend(buckets) {
      const trend = this.shadow.getElementById('trend-value');
      const trendBox = this.shadow.getElementById('trend-box');
      const trendSub = this.shadow.getElementById('trend-sub');
      if (!trend || !Array.isArray(buckets)) return;

      // Tendenzlogik bleibt vollständig unverändert: geglättete 20-Minuten-Fenster
      // mit 25-%-Totzone und absoluter Mindeständerung von zwei Treffern.
      const trendBuckets = Math.max(1,Math.round(20/HISTORY_BUCKET_MINUTES));
      const current = buckets.slice(-trendBuckets).reduce((sum,b) => sum+b.count,0);
      const previous = buckets.slice(-trendBuckets*2,-trendBuckets).reduce((sum,b) => sum+b.count,0);
      const ratio = previous > 0 ? (current-previous)/previous : (current > 0 ? 1 : 0);
      const absoluteChange = current-previous;

      if (previous === 0 && current === 0) {
        trend.textContent = this._t('trend.none');
        if (trendSub) trendSub.textContent = this._t('trend.none_sub');
        if (trendBox) trendBox.className = 'trend none';
      } else if (ratio >= .25 && absoluteChange >= 2) {
        trend.textContent = this._t('trend.up');
        if (trendSub) trendSub.textContent = this._t('trend.up_sub');
        if (trendBox) trendBox.className = 'trend up';
      } else if (ratio <= -.25 && absoluteChange <= -2) {
        trend.textContent = this._t('trend.down');
        if (trendSub) trendSub.textContent = this._t('trend.down_sub');
        if (trendBox) trendBox.className = 'trend down';
      } else {
        trend.textContent = this._t('trend.stable');
        if (trendSub) trendSub.textContent = this._t('trend.stable_sub');
        if (trendBox) trendBox.className = 'trend stable';
      }
      this._syncMapMedallionState();
    },

    _renderHistoryChart(strikes,dangerRadius,now) {
      const chart = this.shadow.getElementById('history-chart');
      const empty = this.shadow.getElementById('empty-chart');
      const grid = this.shadow.getElementById('history-grid');
      const barsGroup = this.shadow.getElementById('history-bars');
      const labels = this.shadow.getElementById('history-labels');

      // V3.38:
      // Die Tendenz-/Logikberechnung bleibt unverändert auf den bewährten
      // 2-Minuten-Fenstern. Für die reine Darstellung erzeugen Tablet und Desktop
      // jedoch 1-Minuten-Fenster. Dadurch entstehen mehr SCHMALE Balken und der
      // Abstand wird kleiner, ohne die Balken selbst künstlich breiter zu machen.
      const chartPixelRect = chart?.getBoundingClientRect?.();
      const chartPixelWidth = Math.max(
        0,
        chartPixelRect?.width || chart?.clientWidth || 0
      );
      const chartPixelHeight = Math.max(
        0,
        chartPixelRect?.height || chart?.clientHeight || 0
      );

      const historyLayoutMode =
        chartPixelWidth >= 1050 ? 'desktop' :
        chartPixelWidth >= 620  ? 'tablet'  :
                                  'mobile';

      const renderBucketMinutes =
        historyLayoutMode === 'mobile'
          ? HISTORY_BUCKET_MINUTES
          : 1;

      // V3.984 – die Darstellungsachse ist an echte 1-/2-Minuten-Grenzen
      // gekoppelt. Dadurch wandern vergangene Balken nicht mehr aufgrund beliebiger
      // HA-Renderzeitpunkte. Innerhalb eines Zeitfensters wächst nur der aktuelle
      // Balken; erst an der nächsten Rastergrenze rückt die Historie geschlossen weiter.
      const renderBucketMs = renderBucketMinutes*60000;
      const renderAnchorNow = Math.floor(now/renderBucketMs)*renderBucketMs;

      const bucketCount = Math.ceil(HISTORY_MINUTES/HISTORY_BUCKET_MINUTES);
      const renderBucketCount = Math.ceil(HISTORY_MINUTES/renderBucketMinutes);

      const SLICE_MINUTES = .5; // 30-Sekunden-Impulse
      const slicesPerBucket = Math.round(HISTORY_BUCKET_MINUTES/SLICE_MINUTES);
      const renderSlicesPerBucket = Math.max(1,Math.round(renderBucketMinutes/SLICE_MINUTES));

      // Diese Buckets bleiben ausschließlich für Tendenz/Logik bestehen.
      const buckets = Array.from({length:bucketCount},() => ({
        count:0,
        danger:0,
        slices:Array.from({length:slicesPerBucket},() => ({count:0,danger:0}))
      }));

      // Reine Darstellungs-Buckets:
      // Mobile  = 2 Minuten wie bisher
      // Tablet  = 1 Minute
      // Desktop = 1 Minute
      const renderBuckets = Array.from({length:renderBucketCount},() => ({
        count:0,
        danger:0,
        slices:Array.from({length:renderSlicesPerBucket},() => ({count:0,danger:0}))
      }));

      // V3.990 – eigenes, auf allen Geräten identisches 2-Minuten-Skalenraster.
      // Anders als die responsive 1-/2-Minuten-Darstellung hängt dessen Zeitanker
      // niemals von der Gerätebreite ab. Jeder sichtbare 1-Minuten-Balken ist damit
      // eine Teilmenge eines Skalenfensters; Mobile nutzt exakt dieselben 2 Minuten.
      const scaleBucketMinutes = HISTORY_BUCKET_MINUTES;
      const scaleBucketMs = scaleBucketMinutes*60000;
      const scaleAnchorNow = Math.floor(now/scaleBucketMs)*scaleBucketMs;
      const scaleBucketCount = Math.ceil(HISTORY_MINUTES/scaleBucketMinutes);
      const scaleBuckets = Array.from({length:scaleBucketCount},() => 0);

      for (const s of strikes) {
        const ageMin = (now-s.firstSeen)/60000;
        if (ageMin < 0 || ageMin > HISTORY_MINUTES) continue;

        const fromStart = HISTORY_MINUTES-ageMin;
        const inDanger = s.distance != null && s.distance <= dangerRadius;

        // 2-Minuten-Logikbucket
        const idx = clamp(
          Math.floor(fromStart/HISTORY_BUCKET_MINUTES),
          0,
          bucketCount-1
        );
        const bucketOffset = fromStart-(idx*HISTORY_BUCKET_MINUTES);
        const sliceIdx = clamp(
          Math.floor(bucketOffset/SLICE_MINUTES),
          0,
          slicesPerBucket-1
        );

        buckets[idx].count += 1;
        buckets[idx].slices[sliceIdx].count += 1;
        if (inDanger) {
          buckets[idx].danger += 1;
          buckets[idx].slices[sliceIdx].danger += 1;
        }

        // Responsive Darstellungsbucket – an der gemeinsamen Zeitrastergrenze
        // verankert. Aktuelle Treffer nach renderAnchorNow landen kontrolliert im
        // letzten Bucket, ohne dass die komplette Achse sekündlich nachwandert.
        const renderAgeMin = (renderAnchorNow-s.firstSeen)/60000;
        const renderFromStart = HISTORY_MINUTES-renderAgeMin;
        const renderIdx = clamp(
          Math.floor(renderFromStart/renderBucketMinutes),
          0,
          renderBucketCount-1
        );
        const renderOffset = renderFromStart-(renderIdx*renderBucketMinutes);
        const renderSliceIdx = clamp(
          Math.floor(renderOffset/SLICE_MINUTES),
          0,
          renderSlicesPerBucket-1
        );

        renderBuckets[renderIdx].count += 1;
        renderBuckets[renderIdx].slices[renderSliceIdx].count += 1;
        if (inDanger) {
          renderBuckets[renderIdx].danger += 1;
          renderBuckets[renderIdx].slices[renderSliceIdx].danger += 1;
        }

        // Geräteunabhängiger Skalenbucket – exakt an 2-Minuten-Grenzen verankert.
        // Aktuelle Treffer nach scaleAnchorNow sammeln sich im letzten Bucket;
        // dadurch kann die Skala bei einem schnell anwachsenden Gewitter sofort
        // mit dem tatsächlich sichtbaren letzten Balken mitwachsen.
        const scaleAgeMin = (scaleAnchorNow-s.firstSeen)/60000;
        const scaleFromStart = HISTORY_MINUTES-scaleAgeMin;
        const scaleIdx = clamp(
          Math.floor(scaleFromStart/scaleBucketMinutes),
          0,
          scaleBucketCount-1
        );
        scaleBuckets[scaleIdx] += 1;
      }

      const historySub = this.shadow.querySelector('.history-sub');
      if (historySub) {
        historySub.textContent =
          this._t('history.bucket',{minutes:renderBucketMinutes});
      }

      const total = buckets.reduce((sum,b) => sum+b.count,0);
      this._updateHistoryTrend(buckets);
      if (!total) {
        chart.style.display = 'none';
        empty.style.display = 'flex';
        grid.innerHTML = '';
        barsGroup.innerHTML = '';
        labels.innerHTML = '';
        this._historyVisualSignature = '';
        this._historyScaleMax = null;
        this._historyScalePendingMax = null;
        this._historyScalePendingSince = 0;
        return;
      }

      chart.style.display = 'block';
      empty.style.display = 'none';

      const W = 1000,H = 118,padL = 30,padR = 9,padT = 5,padB = 20;

      // preserveAspectRatio="none" skaliert SVG-Text auf sehr breiten Desktop-
      // Karten horizontal anders als vertikal. Wir kompensieren nur den Text,
      // nicht Balken/Grid, damit die Beschriftung nicht gequetscht/verzogen wirkt.
      const svgScaleX = chartPixelWidth > 0 ? chartPixelWidth / W : 1;
      const svgScaleY = chartPixelHeight > 0 ? chartPixelHeight / H : 1;

      // V3.87 – Verlaufsbeschriftung auf dem normalen iPad entzerren.
      // Die V3.75-Diagnose hat im fehlerhaften Sidebar-Zustand ca. 922 px
      // Kartenbreite gezeigt. Die frühere <=900-px-Erkennung griff deshalb nicht
      // und die Text-Gegenkorrektur blieb bei 2.40 gedeckelt. Genau dadurch wurden
      // Y- und Zeitachsen sichtbar schmal/hoch gezogen.
      //
      // - bis 960 px Kartenbreite: volle mathematische Gegenkorrektur bis 8.00
      // - normales iPad auch ohne Sidebar: etwas großzügigeres Maximum 4.00
      //   plus sehr dezente optische Weitenkorrektur
      // - Mobile, iPad Pro und Desktop behalten ihre bisherige Charakteristik.
      const cardPixelWidth = Math.max(
        0,
        this.getBoundingClientRect?.().width || 0
      );
      const normalIPadHistory =
        this._isIPadLike() &&
        window.innerWidth >= 1101 &&
        window.innerWidth <= 1250;
      const narrowTwoColumnHistory =
        window.innerWidth >= 1101 &&
        cardPixelWidth > 0 &&
        cardPixelWidth <= 960;

      // V3.88 – nach der gezielten Höhenbegrenzung ist keine extreme
      // 8-fache Gegenstreckung mehr nötig. Ein moderater Deckel verhindert,
      // dass -120/-90/-60/-30/Jetzt bei besonders schmaler Seitenleiste
      // ineinanderlaufen, während die Zeichen trotzdem sichtbar entzerrt bleiben.
      const axisTextScaleMax = narrowTwoColumnHistory
        ? 5.25
        : normalIPadHistory
          ? 3.60
          : 2.40;
      const axisOpticalWidth = normalIPadHistory ? 1.03 : 1.00;
      const axisTextScaleX = clamp(
        (svgScaleY / Math.max(.0001,svgScaleX)) * axisOpticalWidth,
        .42,
        axisTextScaleMax
      );
      const axisTextTransform = (x) =>
        `translate(${Number(x).toFixed(2)} 0) scale(${axisTextScaleX.toFixed(4)} 1) translate(${-Number(x).toFixed(2)} 0)`;

      const plotW = W-padL-padR;
      const plotH = H-padT-padB;

      // V3.990 – die Y-Skala kommt aus dem gemeinsamen, an festen
      // 2-Minuten-Grenzen verankerten Skalenraster. Das beseitigt sowohl die
      // Geräteabweichung als auch den Lastfall, bei dem der aktuelle Balken schneller
      // wuchs als die frühere Referenzskala.
      const scalePeak = Math.max(1,...scaleBuckets);

      // Feinere Instrumentenskala mit mindestens ca. 5 % Kopfraum. Bis 1000
      // verwenden wir eng abgestufte, gut lesbare Werte. Oberhalb 2000 geht es
      // dynamisch in 250er-Schritten weiter – bewusst KEINE 500er-Sprünge.
      // Beispiele: 399 -> 450, 600 -> 650, 2000 -> 2250.
      const preferredScaleMax = (peak) => {
        const value = Math.max(0,Number(peak) || 0);
        if (value <= 0) return 5;
        const target = Math.max(value + 1,value * 1.05);
        const ladder = [
          5,10,15,20,25,30,40,50,60,75,
          100,125,150,175,200,225,250,300,350,400,
          450,500,550,600,650,700,750,800,850,900,950,1000,
          1100,1200,1300,1400,1500,1625,1750,1875,2000
        ];
        const rung = ladder.find(v => v >= target);
        if (rung != null) return rung;
        return Math.ceil(target / 250) * 250;
      };

      const desiredYMax = preferredScaleMax(scalePeak);
      const scaleBucketChanged = this._historyScaleBucketMinutes !== HISTORY_BUCKET_MINUTES;

      if (scaleBucketChanged || !Number.isFinite(this._historyScaleMax)) {
        this._historyScaleMax = desiredYMax;
        this._historyScalePendingMax = null;
        this._historyScalePendingSince = 0;
        this._historyScaleBucketMinutes = HISTORY_BUCKET_MINUTES;
      } else if (desiredYMax > this._historyScaleMax) {
        // Nach oben sofort reagieren: Spitzen dürfen niemals abgeschnitten werden.
        this._historyScaleMax = desiredYMax;
        this._historyScalePendingMax = null;
        this._historyScalePendingSince = 0;
      } else if (desiredYMax < this._historyScaleMax) {
        // V3.991 – adaptive Rückskalierung: viel Leerraum wird schneller abgebaut,
        // kleine Schwankungen bleiben dagegen bewusst träge. Die Absenkung erfolgt
        // stufenweise wie bei einem gedämpften Messinstrument.
        const currentScale = this._historyScaleMax;
        const ratio = desiredYMax / Math.max(1,currentScale);
        const delayMs = ratio < .55 ? 12000 : ratio < .70 ? 24000 : ratio < .85 ? 45000 : 90000;
        const factor = ratio < .55 ? .75 : ratio < .70 ? .82 : .90;
        const dynamicLadder = [
          5,10,15,20,25,30,40,50,60,75,100,125,150,175,200,225,250,300,350,400,
          450,500,550,600,650,700,750,800,850,900,950,1000,1100,1200,1300,1400,1500,
          1625,1750,1875,2000,2250,2500,2750,3000,3250,3500,3750,4000
        ];
        const targetFloor = Math.max(desiredYMax,currentScale*factor);
        let stepTarget = dynamicLadder.find(v => v >= targetFloor && v < currentScale);
        if (stepTarget == null && currentScale > 4000) {
          stepTarget = Math.max(desiredYMax,Math.ceil(targetFloor/250)*250);
          if (stepTarget >= currentScale) stepTarget = Math.max(desiredYMax,currentScale-250);
        }
        if (stepTarget == null) stepTarget = desiredYMax;
        stepTarget = Math.max(desiredYMax,stepTarget);

        const pendingSignature = `${desiredYMax}:${stepTarget}:${delayMs}`;
        if (this._historyScalePendingMax !== pendingSignature) {
          this._historyScalePendingMax = pendingSignature;
          this._historyScalePendingSince = now;
        } else if (now-this._historyScalePendingSince >= delayMs) {
          this._historyScaleMax = stepTarget;
          this._historyScalePendingMax = null;
          this._historyScalePendingSince = 0;
        }
      } else {
        this._historyScalePendingMax = null;
        this._historyScalePendingSince = 0;
      }

      const yMax = Math.max(desiredYMax,this._historyScaleMax || desiredYMax);
      // Unsere bevorzugten Skalen sind durch fünf sauber teilbar; daraus entstehen
      // ruhige Ganzzahlmarken (z.B. 0/3/6/9/12/15 statt 0/3/5/8/10).
      const gridLines = 5;
      const effectiveStep = yMax/gridLines;
      const slot = plotW/renderBucketCount;

      // V3.984 – teure SVG-Neuaufbauten nur noch bei einer tatsächlich sichtbaren
      // Änderung. HA darf intern beliebig oft rendern; solange Zeitraster, Messwerte,
      // Sprache, Größe und Skala identisch sind, bleibt das bestehende SVG unangetastet.
      const historyVisualSignature = [
        historyLayoutMode,
        renderBucketMinutes,
        renderAnchorNow,
        Math.round(chartPixelWidth),
        Math.round(chartPixelHeight),
        yMax,
        this._languageValue(),
        ...renderBuckets.map(b =>
          `${b.count}:${b.danger}:${b.slices.map(slice => `${slice.count}.${slice.danger}`).join(',')}`
        )
      ].join('|');

      if (historyVisualSignature === this._historyVisualSignature) return;
      this._historyVisualSignature = historyVisualSignature;

      // V3.38 – tatsächlich kleinerer Abstand OHNE breitere Balken:
      // Tablet/Desktop haben doppelt so viele Zeitspalten (1 statt 2 Minuten).
      // Die Stäbe bleiben schmal; durch die zusätzlichen Spalten rücken sie visuell
      // deutlich dichter zusammen.
      const barW =
        historyLayoutMode === 'desktop'
          ? clamp(slot*.35,1.70,2.95)
          : historyLayoutMode === 'tablet'
            ? clamp(slot*.37,1.78,3.05)
            : clamp(slot*.34,2.25,4.85);

      // Desktop bleibt schärfer als Tablet/Mobile.
      const softBlur = this.shadow.getElementById('historySoftBlur');
      const auraBlurWide = this.shadow.getElementById('historyAuraBlurWide');
      const auraBlurTight = this.shadow.getElementById('historyAuraBlurTight');

      if (softBlur && auraBlurWide && auraBlurTight) {
        if (historyLayoutMode === 'desktop') {
          softBlur.setAttribute('stdDeviation','.42');
          auraBlurWide.setAttribute('stdDeviation','1.00');
          auraBlurTight.setAttribute('stdDeviation','.34');
        } else {
          softBlur.setAttribute('stdDeviation','.72');
          auraBlurWide.setAttribute('stdDeviation','1.72');
          auraBlurTight.setAttribute('stdDeviation','.58');
        }
      }

      let gridHtml = `
        <rect x="0" y="0" width="${W}" height="${H}" fill="url(#historyBackdropBase)" opacity=".78"/>
        <rect x="${(padL-4).toFixed(1)}" y="${(padT-1).toFixed(1)}" width="${(plotW+8).toFixed(1)}" height="${(plotH+7).toFixed(1)}" rx="10" fill="url(#historyBackdropSheen)" opacity=".96"/>
        <rect x="${(padL-4).toFixed(1)}" y="${(padT-1).toFixed(1)}" width="${(plotW+8).toFixed(1)}" height="${(plotH+7).toFixed(1)}" rx="10" fill="url(#historyBrush)" opacity=".62"/>
        <ellipse cx="${(padL+plotW*.42).toFixed(1)}" cy="${(padT+plotH*.14).toFixed(1)}" rx="${(plotW*.22).toFixed(1)}" ry="${(plotH*.88).toFixed(1)}" fill="url(#historyLeftBloom)"/>
        <ellipse cx="${(padL+plotW*.92).toFixed(1)}" cy="${(padT+plotH*.10).toFixed(1)}" rx="${(plotW*.09).toFixed(1)}" ry="${(plotH*.62).toFixed(1)}" fill="url(#historyRightBloom)"/>`;
      for (let i=0;i<=gridLines;i++) {
        const value = effectiveStep*i;
        const y = padT+plotH-(value/yMax)*plotH;
        gridHtml += `<line class="${i===0 ? 'chart-baseline' : 'chart-grid'}" x1="${padL}" x2="${W-padR}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
        gridHtml += `<text class="axis-label" x="2" y="${(y+2.7).toFixed(1)}" transform="${axisTextTransform(2)}">${Math.round(value)}</text>`;
      }
      gridHtml += `<line class="chart-now-line" x1="${W-padR}" x2="${W-padR}" y1="${padT}" y2="${padT+plotH}"/>`;
      grid.innerHTML = gridHtml;

      // Die Intensität wird weiterhin aus echten 30-Sekunden-Impulsen innerhalb
      // jedes 2-Minuten-Fensters abgeleitet. Anders als zuvor wird ein starker Impuls
      // nun in Intensitätsstufen zerlegt: Gold bildet die Basis, Blau die mittlere
      // Stufe und Lila die Spitze. So erscheinen Gold/Blau/Lila wirklich übereinander,
      // statt dass ein kompletter Impuls nur eine einzige Farbe erhält.
      const positiveSliceCounts = renderBuckets
        .flatMap(b => b.slices.map(s => Math.max(0,s.count-s.danger)))
        .filter(v => v > 0)
        .sort((a,b) => a-b);

      const quantile = (arr,q) => {
        if (!arr.length) return 1;
        const pos = (arr.length-1)*q;
        const lo = Math.floor(pos),hi = Math.ceil(pos);
        if (lo === hi) return arr[lo];
        return arr[lo] + (arr[hi]-arr[lo])*(pos-lo);
      };

      // Bewusst frühere Schwellen als in V3.22, damit bei realer hoher Blitzrate
      // die gestapelten Blau-/Lila-Zonen sichtbar werden, ohne ruhige Phasen bunt zu machen.
      const mediumThreshold = Math.max(2,Math.ceil(quantile(positiveSliceCounts,.52)));
      const extremeThreshold = Math.max(
        mediumThreshold+1,
        Math.ceil(quantile(positiveSliceCounts,.80))
      );

      // Anzahl Treffer je 30s-Impuls, die maximal der Gold- bzw. Blauzone zugerechnet wird.
      const goldCap = Math.max(1,mediumThreshold-1);
      const blueCap = Math.max(1,extremeThreshold-mediumThreshold);

      let barsHtml = '';

      const roundedTopPath = (x,y,w,h,r) => {
        const rr = Math.min(r,w/2,h);
        return [
          `M ${(x).toFixed(2)} ${(y+h).toFixed(2)}`,
          `L ${(x).toFixed(2)} ${(y+rr).toFixed(2)}`,
          `Q ${(x).toFixed(2)} ${y.toFixed(2)} ${(x+rr).toFixed(2)} ${y.toFixed(2)}`,
          `L ${(x+w-rr).toFixed(2)} ${y.toFixed(2)}`,
          `Q ${(x+w).toFixed(2)} ${y.toFixed(2)} ${(x+w).toFixed(2)} ${(y+rr).toFixed(2)}`,
          `L ${(x+w).toFixed(2)} ${(y+h).toFixed(2)}`,
          'Z'
        ].join(' ');
      };

      renderBuckets.forEach((b,i) => {
        if (!b.count) return;

        let gold = 0,blue = 0,purple = 0,danger = 0;

        for (const slice of b.slices) {
          if (!slice.count) continue;

          danger += slice.danger;
          let safe = Math.max(0,slice.count-slice.danger);
          if (!safe) continue;

          const g = Math.min(safe,goldCap);
          gold += g;
          safe -= g;

          const bl = Math.min(safe,blueCap);
          blue += bl;
          safe -= bl;

          if (safe > 0) purple += safe;
        }

        const x = padL + i*slot + (slot-barW)/2;
        const barBottom = padT+plotH;
        // V3.990 – letzte Sicherheitsbarriere: selbst bei einem unerwarteten
        // Zustandsrennen darf kein SVG-Balken jemals aus dem Plot hinausragen.
        // Im Normalfall greift vorher die sofortige Skalenanhebung.
        const requestedFullH = Math.max(1.35,(b.count/yMax)*plotH);
        const fullH = Math.min(plotH,requestedFullH);
        const fullTop = Math.max(padT,barBottom-fullH);

        // Sehr schmaler farbiger Saum hinter dem gesamten Stab:
        // genug Tiefe für die Entwurfswirkung, aber kein breiter Neon-Glow.
        barsHtml += `<rect class="bar-glow" x="${(x-.26).toFixed(2)}" y="${fullTop.toFixed(2)}" width="${(barW+.52).toFixed(2)}" height="${fullH.toFixed(2)}" rx="${Math.min(.8,barW/2).toFixed(2)}" fill="rgba(246,195,68,.06)" filter="url(#historySoftGlow)" opacity=".52"/>`;

        /* V3.24:
           Nicht mehr vier getrennte Farbsegmente mit jeweils eigenem Verlauf zeichnen.
           Stattdessen bekommt der GESAMTE Balken einen einzigen, dynamisch erzeugten
           SVG-Verlauf. Nur an der 0-Linie darf die erste Farbe dunkel/transparenter
           anlaufen. Ab der ersten Farbgrenze wird ausschließlich Farbe -> Farbe
           interpoliert: Gold -> Blau -> Lila -> Rot, ohne erneuten Alpha-/Dunkelstart. */
        const palette = {
          gold:   { low:'#A86508', mid:'#D89516', high:'#F4BC36' },
          blue:   { low:'#1A66B9', mid:'#318CE8', high:'#69C4FF' },
          purple: { low:'#5A2BAA', mid:'#8B4CEB', high:'#C18AFF' },
          danger: { low:'#9E2030', mid:'#D93446', high:'#FF6875' }
        };

        const segments = [
          {key:'gold',count:gold},
          {key:'blue',count:blue},
          {key:'purple',count:purple},
          {key:'danger',count:danger}
        ].filter(seg => seg.count > 0);

        const gradientId = `historyBarGradient-${i}`;
        const totalSegmentCount = Math.max(1,segments.reduce((sum,seg) => sum+seg.count,0));

        const stopParts = [];
        const pct = (v) => `${clamp(v,0,1)*100}%`;

        /* V3.28 – adaptive Verlaufsübergänge:
           Lange Balken waren bereits sehr sauber. Kurze Balken bekommen jetzt bewusst
           eine deutlich größere relative Mischzone.

           Prinzip:
           - nur an der 0-Linie darf Transparenz vorkommen
           - danach ausschließlich voll deckende Farbe
           - Farbübergänge werden nicht mehr nur über einzelne Grenz-Stops erzeugt
           - stattdessen wird der komplette Gradient in vielen kleinen, monotonen
             Farbstops abgetastet
           - kurze Balken: breite, weiche Übergänge
           - lange Balken: schmalere Übergänge, damit die einzelnen Farbzonen erhalten bleiben
        */

        const parseHex = (hex) => {
          const h = String(hex).replace('#','');
          return [
            parseInt(h.slice(0,2),16),
            parseInt(h.slice(2,4),16),
            parseInt(h.slice(4,6),16)
          ];
        };

        const mixHex = (a,b,t) => {
          const A = parseHex(a);
          const B = parseHex(b);
          const c = A.map((v,j) => Math.round(v+(B[j]-v)*clamp(t,0,1)));
          return `#${c.map(v => v.toString(16).padStart(2,'0')).join('')}`;
        };

        const smoothstep = (t) => {
          const x = clamp(t,0,1);
          return x*x*(3-2*x);
        };

        const colorFromPath = (colors,t) => {
          if (!colors?.length) return '#FFFFFF';
          if (colors.length === 1) return colors[0];

          const pos = clamp(t,0,1)*(colors.length-1);
          const idx = Math.min(colors.length-2,Math.floor(pos));
          const local = pos-idx;
          return mixHex(colors[idx],colors[idx+1],smoothstep(local));
        };

        // Bewusst farbgeführte Übergänge statt mathematisch stumpfer RGB-Mischung.
        // So bleibt Gold -> Blau warm/klar und Blau -> Lila wirklich violett.
        const transitionPalettes = {
          'gold->blue': [
            '#F4BC36',
            '#E8BA40',
            '#D5BC5B',
            '#A5C28E',
            '#70BFC4',
            '#4BA9EA',
            '#69C4FF'
          ],
          'gold->purple': [
            '#F4BC36',
            '#E7AE46',
            '#D49767',
            '#C07E92',
            '#AC67C0',
            '#9A56E1',
            '#C18AFF'
          ],
          'gold->danger': [
            '#F4BC36',
            '#EDAA39',
            '#E79540',
            '#E17A48',
            '#DD5F50',
            '#DA4655',
            '#FF6875'
          ],
          'blue->purple': [
            '#69C4FF',
            '#5CB8FF',
            '#59A5FB',
            '#638DF7',
            '#7772F2',
            '#9459EE',
            '#C18AFF'
          ],
          'blue->danger': [
            '#69C4FF',
            '#62AFE9',
            '#6B94DA',
            '#8178CB',
            '#A15EBA',
            '#C4478B',
            '#FF6875'
          ],
          'purple->danger': [
            '#C18AFF',
            '#C978ED',
            '#D067DA',
            '#D957C1',
            '#E2499F',
            '#EB467D',
            '#FF6875'
          ]
        };

        // Segmentbereiche als normierte Positionen 0..1 aufbauen.
        let rangeCursor = 0;
        const ranges = segments.map((seg) => {
          const start = rangeCursor/totalSegmentCount;
          rangeCursor += seg.count;
          const end = rangeCursor/totalSegmentCount;
          return {
            ...seg,
            start,
            end,
            span:Math.max(.0001,end-start)
          };
        });

        const boundaries = ranges.slice(0,-1).map((range,index) => ({
          index,
          at:range.end,
          previous:range,
          next:ranges[index+1]
        }));

        // Je kürzer der sichtbare Balken, desto größer die relative Mischzone.
        // Beispiele:
        //  6 px hoher Balken  -> ca. 42 % Mischbereich
        // 20 px hoher Balken  -> ca. 38 %
        // 60 px hoher Balken  -> ca. 14 %
        // 90 px hoher Balken  -> ca. 10 %
        const adaptiveBlendFrac = clamp(8.6/Math.max(1,fullH),.095,.42);

        const transitionWindows = boundaries.map((boundary,index) => {
          const previousBoundary = index > 0 ? boundaries[index-1].at : 0;
          const nextBoundary = index < boundaries.length-1 ? boundaries[index+1].at : 1;

          // Übergänge dürfen bei kurzen Balken weit in die vorherige Farbe reichen.
          // In die nachfolgende Farbe greifen wir etwas weniger stark ein, damit deren
          // reine Endfarbe an der Spitze weiterhin sichtbar bleibt.
          const desiredBefore = adaptiveBlendFrac*.67;
          const desiredAfter = adaptiveBlendFrac*.43;

          // Bei dicht aufeinanderfolgenden Grenzen treffen sich die Übergänge höchstens
          // in der Mitte. Dadurch bleiben die Stop-Positionen immer sauber sortiert.
          const leftLimit = index > 0
            ? (previousBoundary+boundary.at)/2
            : 0;

          const rightLimit = index < boundaries.length-1
            ? (boundary.at+nextBoundary)/2
            : 1;

          const start = Math.max(leftLimit,boundary.at-desiredBefore);
          const end = Math.min(rightLimit,boundary.at+desiredAfter);

          return {
            ...boundary,
            start,
            end:Math.max(start+.0001,end),
            key:`${boundary.previous.key}->${boundary.next.key}`
          };
        });

        const segmentColorAt = (range,t) => {
          const p = palette[range.key];
          const local = clamp((t-range.start)/range.span,0,1);

          // Nur die erste Zone darf unten aus dem dunkleren Materialton kommen.
          // Alle späteren Zonen beginnen bereits satt, damit keine dunklen Nähte entstehen.
          if (range === ranges[0]) {
            if (local <= .36) {
              return mixHex(p.low,p.mid,smoothstep(local/.36));
            }
            return mixHex(p.mid,p.high,smoothstep((local-.36)/.64));
          }

          return mixHex(p.mid,p.high,smoothstep(local));
        };

        const findRangeAt = (t) => {
          for (let r=0;r<ranges.length;r++) {
            if (t <= ranges[r].end+.000001) return ranges[r];
          }
          return ranges[ranges.length-1];
        };

        const gradientColorAt = (t) => {
          // Falls der Abtastpunkt in einer Farbübergangszone liegt, verwenden wir
          // die speziell entworfene Übergangspalette.
          for (const win of transitionWindows) {
            if (t >= win.start && t <= win.end) {
              const u = smoothstep((t-win.start)/(win.end-win.start));
              const colors = transitionPalettes[win.key] || [
                palette[win.previous.key].high,
                palette[win.next.key].mid,
                palette[win.next.key].high
              ];
              return colorFromPath(colors,u);
            }
          }

          return segmentColorAt(findRangeAt(t),t);
        };

        // Mehr Stops bei sehr kurzen Balken: Dort ist jeder einzelne Pixel wichtig.
        // Auf großen Balken reichen weniger Stops, weil SVG selbst sauber interpoliert.
        const sampleCount =
          fullH < 8  ? 28 :
          fullH < 16 ? 26 :
          fullH < 30 ? 24 :
                       22;

        // Nur die untersten Pixel dürfen den gewünschten dunkleren/transparenten
        // Anlauf von der 0-Linie zeigen.
        const baseFadeFrac = Math.min(
          ranges[0]?.end ?? .1,
          clamp(2.5/Math.max(1,fullH),.025,.16)
        );

        for (let sample=0;sample<=sampleCount;sample++) {
          const t = sample/sampleCount;
          const color = gradientColorAt(t);

          let opacity = 1;
          if (t <= baseFadeFrac) {
            opacity = .42 + .58*smoothstep(t/Math.max(.0001,baseFadeFrac));
          }

          stopParts.push(
            `<stop offset="${pct(t)}" stop-color="${color}" stop-opacity="${opacity.toFixed(3)}"/>`
          );
        }

        barsHtml += `
          <defs>
            <linearGradient
              id="${gradientId}"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="${barBottom.toFixed(2)}"
              x2="0"
              y2="${fullTop.toFixed(2)}"
            >
              ${stopParts.join('')}
            </linearGradient>
          </defs>`;

                // V3.30: zweistufiger Mehrfarben-Glow.
        // Kurze Balken bekommen bewusst etwas mehr Aura, weil dort die Farbsegmente
        // optisch dichter zusammenliegen. Lange Balken bleiben kontrollierter.
        const auraExpandBase = fullH < 8 ? 1.34 : fullH < 16 ? 1.18 : fullH < 30 ? 1.00 : .82;
        const auraExpand = historyLayoutMode === 'desktop'
          ? auraExpandBase*.82
          : auraExpandBase;
        const auraOpacityBase = fullH < 8 ? .38 : fullH < 16 ? .34 : fullH < 30 ? .30 : .24;
        const auraOpacity = historyLayoutMode === 'desktop'
          ? auraOpacityBase*.88
          : auraOpacityBase;
        const auraX = x - auraExpand*.36;
        const auraW = barW + auraExpand*.72;
        const auraY = fullTop - auraExpand*.44;
        const auraH = fullH + auraExpand*.44;

        // breite Aura
        barsHtml += `<path class="bar-aura"
          d="${roundedTopPath(auraX,auraY,auraW,auraH,.94)}"
          fill="url(#${gradientId})"
          opacity="${auraOpacity.toFixed(2)}"
          filter="url(#historyBarAura)"/>`;

        // engerer Farblichtsaum direkt am Balken
        const haloPad = historyLayoutMode === 'desktop' ? .13 : .18;
        const haloGrow = historyLayoutMode === 'desktop' ? .26 : .36;
        const haloLift = historyLayoutMode === 'desktop' ? .10 : .14;
        const haloX = x-haloPad;
        const haloW = barW+haloGrow;
        const haloY = fullTop-haloLift;
        const haloH = fullH+haloLift;
        barsHtml += `<path class="bar-aura"
          d="${roundedTopPath(haloX,haloY,haloW,haloH,.80)}"
          fill="url(#${gradientId})"
          opacity=".34"
          filter="url(#historySoftGlow)"/>`;

        // Ein einziger farbiger Körper = ein zusammenhängender Instrumentenstab.
        const barPath = roundedTopPath(x,fullTop,barW,fullH,.72);
        barsHtml += `<path class="bar" d="${barPath}" fill="url(#${gradientId})" opacity=".99"/>`;

        // Metallischer Querschliff / Glanzfilm. Der farbige Gradient bleibt vollständig
        // sichtbar; die zweite Ebene modelliert nur Licht und Schatten über die Breite.
        barsHtml += `<path class="bar"
          d="${barPath}"
          fill="url(#historyMetalSheen)"
          opacity="${fullH < 10 ? '.66' : '.58'}"/>`;

        // Gezielte polierte Lichtkante links + dunklere Flanke rechts.
        // Damit wirkt der schmale Stab plastischer und weniger wie eine flache SVG-Linie.
        if (fullH >= 2.4) {
          barsHtml += `<line
            x1="${(x+.38).toFixed(2)}" x2="${(x+.38).toFixed(2)}"
            y1="${(fullTop+.62).toFixed(2)}" y2="${(barBottom-.38).toFixed(2)}"
            stroke="rgba(255,255,255,.24)" stroke-width=".28" opacity=".74"/>`;

          barsHtml += `<line
            x1="${(x+barW-.28).toFixed(2)}" x2="${(x+barW-.28).toFixed(2)}"
            y1="${(fullTop+.68).toFixed(2)}" y2="${(barBottom-.34).toFixed(2)}"
            stroke="rgba(0,0,0,.26)" stroke-width=".22" opacity=".66"/>`;

          // polierter Abschluss an der Balkenspitze
          barsHtml += `<line
            x1="${(x+.38).toFixed(2)}" x2="${(x+barW-.38).toFixed(2)}"
            y1="${(fullTop+.36).toFixed(2)}" y2="${(fullTop+.36).toFixed(2)}"
            stroke="rgba(255,255,255,.26)" stroke-width=".28" opacity=".72"/>`;
        }
      });

      barsGroup.innerHTML = barsHtml;

      const x0 = padL;
      const x25 = padL+plotW*.25;
      const x50 = padL+plotW*.50;
      const x75 = padL+plotW*.75;
      const x100 = W-padR;
      labels.innerHTML = `
        <text class="axis-label" x="${x0}" y="${H-4}" transform="${axisTextTransform(x0)}">-120 Min</text>
        <text class="axis-label" x="${x25.toFixed(1)}" y="${H-4}" text-anchor="middle" transform="${axisTextTransform(x25)}">-90 Min</text>
        <text class="axis-label" x="${x50.toFixed(1)}" y="${H-4}" text-anchor="middle" transform="${axisTextTransform(x50)}">-60 Min</text>
        <text class="axis-label" x="${x75.toFixed(1)}" y="${H-4}" text-anchor="middle" transform="${axisTextTransform(x75)}">-30 Min</text>
        <text class="axis-label" x="${x100}" y="${H-4}" text-anchor="end" transform="${axisTextTransform(x100)}">${this._t('history.now')}</text>`;

    },
};});

import { defineModule } from "../core/runtime.js?v=41002r11";
export const MODULE_META=Object.freeze({
  "id": "map.clusters-recent",
  "version": "1.0.4",
  "group": "Karte",
  "function": "Cluster & letzte Blitze",
  "subfunctions": [
    "Cluster",
    "Marker",
    "Recent-Liste",
    "Navigation"
  ],
  "file": "modules/map/clusters-recent.js"
});
export const installClustersRecent=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _arcPath(cx,cy,r,startDeg,endDeg) {
      let start = ((startDeg%360)+360)%360;
      let end = ((endDeg%360)+360)%360;
      let delta = end - start;
      if (delta < 0) delta += 360;
      if (delta === 0) delta = .01;
      const toXY = (deg) => {
        const rad = (deg - 90) * Math.PI / 180;
        return [cx + r*Math.cos(rad),cy + r*Math.sin(rad)];
      };
      const [x1,y1] = toXY(start);
      const [x2,y2] = toXY(start + delta);
      const large = delta > 180 ? 1 : 0;
      return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
    },

    _strikeStatus(strike,now,dangerRadius) {
      if (!strike) return 'old';
      const ageMin = (now - strike.firstSeen)/60000;
      if (ageMin <= ACTIVE_MINUTES && strike.distance != null && strike.distance <= dangerRadius) return 'danger';
      if (ageMin <= ACTIVE_MINUTES) return 'active';
      return 'old';
    },

    _clusterExtremeThreshold(zoom) {
      if (zoom <= 5) return 120;
      if (zoom === 6) return 80;
      if (zoom === 7) return 48;
      if (zoom === 8) return 30;
      if (zoom === 9) return 20;
      if (zoom === 10) return 12;
      return 8;
    },

    _clusterPixelSize(zoom,outsideObservation) {
      let size;
      if (zoom <= 5) size = 135;
      else if (zoom === 6) size = 115;
      else if (zoom === 7) size = 96;
      else if (zoom === 8) size = 78;
      else if (zoom === 9) size = 62;
      else if (zoom === 10) size = 48;
      else size = 36;
      return outsideObservation ? size : Math.max(26,size*.68);
    },

    _scheduleClusterRender() {
      if (this._clusterRenderDebounceTimer) clearTimeout(this._clusterRenderDebounceTimer);
      this._clusterRenderDebounceTimer = setTimeout(() => {
        this._clusterRenderDebounceTimer = null;
        if (!this.isConnected || !this._hass) return;
        this._suppressClusterRender = false;
        this._render();
      },160);
    },

    _stabilizeRenderedClusterIdentities(drafts,zoom) {
      const now = Date.now();
      const state = this._clusterIdentityState || { nextId:1, nextOrder:1, clusters:[] };
      const previous = (Array.isArray(state.clusters) ? state.clusters : [])
        .filter(cluster => now - (Number(cluster?.lastSeen) || 0) <= 15000);
      const selectedId = this._statusFocusSelectedId || null;

      const prepared = (drafts || []).map((draft,index) => ({
        ...draft,
        _draftIndex:index,
        _memberIds:new Set((draft.items || []).map(strike => String(strike?.id || '')).filter(Boolean))
      }));

      // V3.99405 – Matching alt -> neu:
      // 1) gemeinsame reale Blitz-IDs sind das stärkste Merkmal,
      // 2) räumliche Nähe in Weltpixeln fängt Zell-/Zoom-Übergänge ab,
      // 3) ähnliche Mitgliederzahl verhindert falsches Zusammenkleben.
      const candidates = [];
      for (let pIndex=0;pIndex<previous.length;pIndex++) {
        const old = previous[pIndex];
        const oldMembers = old?.memberIds instanceof Set
          ? old.memberIds
          : new Set(Array.isArray(old?.memberIds) ? old.memberIds : []);
        const oldSize = Math.max(1,oldMembers.size || Number(old?.count) || 1);

        for (let dIndex=0;dIndex<prepared.length;dIndex++) {
          const draft = prepared[dIndex];
          const draftSize = Math.max(1,draft._memberIds.size || Number(draft.count) || 1);
          let overlap = 0;
          for (const memberId of draft._memberIds) {
            if (oldMembers.has(memberId)) overlap += 1;
          }

          const union = oldMembers.size + draft._memberIds.size - overlap;
          const jaccard = union > 0 ? overlap/union : 0;
          const sizeRatio = Math.min(oldSize,draftSize) / Math.max(oldSize,draftSize);
          const oldPoint = this._map.project([old.lat,old.lon],zoom);
          const newPoint = this._map.project([draft.lat,draft.lon],zoom);
          const dx = newPoint.x-oldPoint.x;
          const dy = newPoint.y-oldPoint.y;
          const pixelDistance = Math.sqrt(dx*dx + dy*dy);
          const grid = this._clusterPixelSize(zoom,!draft.inObservation);
          const spatialLimit = Math.max(72,grid*1.45);
          const spatialScore = 1-clamp(pixelDistance/spatialLimit,0,1);

          if (!overlap && (pixelDistance > spatialLimit || sizeRatio < .32)) continue;

          const selectedBonus = old.id === selectedId ? .001 : 0;
          const score =
            (overlap ? 1000 + overlap*20 + jaccard*150 : 0) +
            spatialScore*50 +
            sizeRatio*20 +
            selectedBonus;

          candidates.push({
            pIndex,dIndex,score,overlap,jaccard,sizeRatio,pixelDistance,spatialLimit
          });
        }
      }

      candidates.sort((a,b) =>
        (b.score-a.score) ||
        (b.overlap-a.overlap) ||
        (b.jaccard-a.jaccard) ||
        (a.pixelDistance-b.pixelDistance) ||
        (a.pIndex-b.pIndex) ||
        (a.dIndex-b.dIndex)
      );

      const usedPrevious = new Set();
      const usedDrafts = new Set();
      for (const match of candidates) {
        if (usedPrevious.has(match.pIndex) || usedDrafts.has(match.dIndex)) continue;
        const old = previous[match.pIndex];
        const draft = prepared[match.dIndex];
        draft.id = old.id;
        draft.order = Number.isFinite(old.order) ? old.order : state.nextOrder++;

        // Mittelpunkt nur gedämpft nachführen. Ein aktiv gewählter Cluster erhält
        // die stärkste visuelle Ruhe; echte Umgruppierungen dürfen schneller folgen.
        const alpha = old.id === selectedId
          ? .22
          : match.overlap > 0
            ? (match.jaccard >= .45 ? .28 : .38)
            : .52;
        if (Number.isFinite(old.lat) && Number.isFinite(old.lon)) {
          draft.lat = old.lat + (draft.lat-old.lat)*alpha;
          draft.lon = old.lon + (draft.lon-old.lon)*alpha;
        }

        usedPrevious.add(match.pIndex);
        usedDrafts.add(match.dIndex);
      }

      for (const draft of prepared) {
        if (!draft.id) draft.id = `cluster-${state.nextId++}`;
        if (!Number.isFinite(draft.order)) draft.order = state.nextOrder++;
      }

      const currentSnapshots = prepared.map(draft => ({
        id:draft.id,
        order:draft.order,
        lat:draft.lat,
        lon:draft.lon,
        count:draft.count,
        lastSeen:now,
        memberIds:new Set(draft._memberIds)
      }));
      const retainedSnapshots = previous.filter((old,index) =>
        !usedPrevious.has(index) &&
        now - (Number(old?.lastSeen) || 0) <= 15000
      );

      state.clusters = [...currentSnapshots,...retainedSnapshots];
      state.nextId = Math.max(1,state.nextId);
      state.nextOrder = Math.max(1,state.nextOrder);
      this._clusterIdentityState = state;

      return prepared.map(({_draftIndex,_memberIds,...draft}) => draft);
    },

    _renderMapMarkers() {
      if (!this._mapReady || !this._markerLayer || !this._map) return;
      const allHistory = this._mapHistory || [];
      const now = Date.now();
      const observationRadius = this._currentObservationRadius ?? this._observationRadiusValue();
      const stormRadius = this._currentStormRadius ?? Math.min(this._stormRadiusValue(),observationRadius);
      const dangerRadius = this._currentDangerRadius ?? Math.min(this._dangerRadiusValue(),stormRadius);
      const zoom = this._map.getZoom();
      const L = window.L;
      const grouped = this._hass?.states?.[this._mapGroupingEntity()]?.state !== 'off';

      if (grouped && this._suppressClusterRender) return;

      this._markerLayer.clearLayers();
      this._renderedMapClusters = [];

      // Einzelblitz-Modus: filigrane diagonale Kreuze statt Punktwolken.
      // Die eigentliche Kreuzfarbe bleibt die Zeitfarbe des Einschlags; extreme lokale
      // Aktivität wird nur als magentafarbener Außen-Glow ergänzt. So bleiben Alter und
      // Intensität gleichzeitig lesbar, auch bei mehreren Tausend Treffern.
      if (!grouped) {
        const cellPx = zoom <= 6 ? 34 : zoom <= 8 ? 40 : zoom <= 10 ? 46 : 54;
        const cells = new Map();
        const pointMeta = [];
        const paddedBounds = this._map.getBounds().pad(.16);

        // Für Dichteanalyse und Rendering nur den sichtbaren Kartenausschnitt plus
        // kleinen Rand verwenden. Die 120-Minuten-Historie selbst bleibt vollständig erhalten.
        for (const s of allHistory) {
          if (!Number.isFinite(s.lat) || !Number.isFinite(s.lon)) continue;
          if (!paddedBounds.contains([s.lat,s.lon])) continue;
          const p = this._map.latLngToLayerPoint([s.lat,s.lon]);
          const key = `${Math.floor(p.x/cellPx)}:${Math.floor(p.y/cellPx)}`;
          let cell = cells.get(key);
          if (!cell) {
            cell = { total:0,fresh:0,recent30:0 };
            cells.set(key,cell);
          }
          cell.total += 1;
          const age = (now-s.firstSeen)/60000;
          if (age <= ACTIVE_MINUTES) cell.fresh += 1;
          if (age <= 30) cell.recent30 += 1;
          pointMeta.push({ s,key,age });
        }

        const extremeThreshold = this._clusterExtremeThreshold(zoom);
        // Farbwerte bewusst eng an der hochwertigen Referenz: satt, klar und ohne
        // Weißbeimischung. Extreme Aktivität bleibt eine separate Magenta-Ebene.
        const singleGold = '#F3B51B';
        const singleBlue = '#2E93E8';
        const singlePurple = '#7657EE';
        const singleOlder = '#6A737E';
        const singleExtremePurple = '#7A4EF2';
        const singleExtremeHalo = '#5A35C9';
        const singleDanger = '#FF4657';
        const halfSize = zoom <= 5 ? 1.06 : zoom <= 6 ? 1.22 : zoom <= 8 ? 1.50 : zoom <= 10 ? 1.78 : zoom <= 12 ? 2.06 : 2.34;
        const renderPoints = [];

        for (const {s,key,age} of pointMeta) {
          const cell = cells.get(key);
          const extreme = !!cell && (cell.fresh >= extremeThreshold || (cell.recent30 >= extremeThreshold*2 && cell.fresh >= Math.max(4,Math.round(extremeThreshold*.25))));
          const inDanger = s.distance != null && s.distance <= dangerRadius && age <= ACTIVE_MINUTES;

          let color;
          if (inDanger) color = singleDanger;
          else if (age <= ACTIVE_MINUTES) color = singleGold;
          else if (age <= 30) color = singleBlue;
          else if (age <= 60) color = singlePurple;
          else color = singleOlder;

          const opacity = inDanger ? .98 : age <= ACTIVE_MINUTES ? .96 : age <= 30 ? .88 : age <= 60 ? .76 : .48;
          const size = inDanger ? halfSize*1.16 : halfSize;
          const weight = inDanger ? .82 : zoom <= 6 ? .42 : zoom <= 9 ? .50 : .58;
          const glowBlur = inDanger ? 2.7 : age <= ACTIVE_MINUTES ? 1.65 : age <= 30 ? 1.10 : age <= 60 ? .85 : .45;

          renderPoints.push({
            lat:s.lat, lon:s.lon,
            radius:size,
            color,
            weight,
            opacity,
            glowBlur,
            danger:inDanger,
            extreme:extreme && !inDanger,
            extremeColor:singleExtremePurple,
            extremeHaloColor:singleExtremeHalo
          });
        }

        this._individualStrikeLayer?.setData(renderPoints);
        return;
      }

      this._individualStrikeLayer?.clear();

      // Gruppiert: bewährte dynamische Cluster-Logik unverändert erhalten.
      const individual = [];
      const clusterCandidates = [];

      // V4.08.25 TEST – Cluster-Auflösung als Profil im Stil der Sprachauswahl, jetzt mit kompakterem und weiter rechts ausgerichtetem Auswahlmenü.
      // Gefahr bleibt in allen V4.08-Profilen sofort detailliert. Die drei neuen
      // Profile verschieben den Auflösungszeitpunkt systematisch; Classic bildet
      // das geschützte V4.07.56-Verhalten exakt nach.
      const clusterResolutionProfile = ['early','balanced','late','classic'].includes(this._clusterResolutionProfileV40822)
        ? this._clusterResolutionProfileV40822
        : 'classic';
      const clusterResolutionThresholds = {
        early:{storm:9,observation:11,outside:11},
        balanced:{storm:10,observation:12,outside:12},
        late:{storm:11,observation:13,outside:13}
      };
      const profileThresholds = clusterResolutionThresholds[clusterResolutionProfile] || null;
      for (const s of allHistory) {
        const inDanger = s.distance != null && s.distance <= dangerRadius;
        const inStorm = s.distance != null && s.distance <= stormRadius;
        const inObservation = s.distance != null && s.distance <= observationRadius;
        const renderIndividual = clusterResolutionProfile === 'classic'
          ? (inDanger || (inObservation && zoom >= 8) || (!inObservation && zoom >= 12))
          : (inDanger
            || (inStorm && zoom >= profileThresholds.storm)
            || (inObservation && zoom >= profileThresholds.observation)
            || (!inObservation && zoom >= profileThresholds.outside));
        if (renderIndividual) individual.push(s);
        else clusterCandidates.push({ strike:s,inObservation });
      }

      const addStrike = (s) => {
        const status = this._strikeStatus(s,now,dangerRadius);
        const color = status === 'danger' ? C.danger : status === 'active' ? C.gold : C.blue;
        const symbol = status === 'danger' ? '✦' : '+';
        const icon = L.divIcon({
          className:'strike-icon',
          html:`<span class="strike-spark ${status === 'danger' ? 'danger' : ''}" style="--strike-color:${color}">${symbol}</span>`,
          iconSize:[18,18],
          iconAnchor:[9,9]
        });
        L.marker([s.lat,s.lon],{ icon,interactive:false }).addTo(this._markerLayer);
      };

      individual.forEach(addStrike);

      const cells = new Map();
      for (const item of clusterCandidates) {
        // V3.551 – Weltpixel statt viewportabhängiger Layerpixel.
        // Dadurch bleiben Clustergrenzen beim reinen Verschieben der Karte stabil;
        // das ist Voraussetzung für einen reproduzierbaren Cluster-Browser.
        const p = this._map.project([item.strike.lat,item.strike.lon],zoom);
        const grid = this._clusterPixelSize(zoom,!item.inObservation);
        const key = `${item.inObservation ? 'i' : 'o'}:${Math.floor(p.x/grid)}:${Math.floor(p.y/grid)}`;
        let cell = cells.get(key);
        if (!cell) {
          cell = {
            items:[],sumLat:0,sumLon:0,inObservation:item.inObservation,
            minLat:item.strike.lat,maxLat:item.strike.lat,
            minLon:item.strike.lon,maxLon:item.strike.lon
          };
          cells.set(key,cell);
        }
        cell.items.push(item.strike);
        cell.sumLat += item.strike.lat;
        cell.sumLon += item.strike.lon;
        cell.minLat = Math.min(cell.minLat,item.strike.lat);
        cell.maxLat = Math.max(cell.maxLat,item.strike.lat);
        cell.minLon = Math.min(cell.minLon,item.strike.lon);
        cell.maxLon = Math.max(cell.maxLon,item.strike.lon);
      }

      const reference = this._home();
      const clusterDrafts = [];

      for (const [clusterKey,cell] of cells.entries()) {
        if (cell.items.length === 1 && zoom >= 10) {
          addStrike(cell.items[0]);
          continue;
        }

        const fresh = cell.items.filter(s => now - s.firstSeen <= ACTIVE_MINUTES*60000).length;
        const recent30 = cell.items.filter(s => now - s.firstSeen <= 30*60000).length;
        const extremeThreshold = this._clusterExtremeThreshold(zoom);
        const extreme = fresh >= extremeThreshold || (recent30 >= extremeThreshold*2 && fresh >= Math.max(4,Math.round(extremeThreshold*.25)));
        const active = fresh > 0;
        const color = extreme ? C.purple : active ? C.gold : C.blue;
        const count = cell.items.length;
        const size = clamp(27 + Math.log2(Math.max(2,count))*4.5,30,58);
        const lat = cell.sumLat/count;
        const lon = cell.sumLon/count;

        clusterDrafts.push({
          sourceKey:`${zoom}:${clusterKey}`,
          items:cell.items,
          inObservation:cell.inObservation,
          lat,
          lon,
          count,
          bounds:[
            [cell.minLat,cell.minLon],
            [cell.maxLat,cell.maxLon]
          ],
          active,
          extreme,
          color,
          size
        });
      }

      const stableClusters = this._stabilizeRenderedClusterIdentities(clusterDrafts,zoom);
      for (const cluster of stableClusters) {
        const distance = distanceBetweenKm(reference.lat,reference.lon,cluster.lat,cluster.lon);
        this._renderedMapClusters.push({
          id:cluster.id,
          order:cluster.order,
          lat:cluster.lat,
          lon:cluster.lon,
          count:cluster.count,
          distance,
          bounds:cluster.bounds,
          active:cluster.active,
          extreme:cluster.extreme
        });

        const icon = L.divIcon({
          className:'cluster-icon',
          html:`<div class="cluster-bubble ${cluster.extreme ? 'extreme' : cluster.active ? 'active' : ''}" style="--cluster-color:${cluster.color};--cluster-size:${cluster.size.toFixed(0)}px">${cluster.count}</div>`,
          iconSize:[cluster.size,cluster.size],
          iconAnchor:[cluster.size/2,cluster.size/2]
        });
        L.marker([cluster.lat,cluster.lon],{ icon,interactive:false }).addTo(this._markerLayer);
      }
    },

    _recentStrikeInRadius(strike,filter,observationRadius,stormRadius,dangerRadius) {
      if (!strike) return false;
      const distance = finiteNumber(strike.distance);
      if (distance == null) return filter === 'observation';
      if (filter === 'danger') return distance <= dangerRadius;
      if (filter === 'storm') return distance <= stormRadius;
      return distance <= observationRadius;
    },

    _recentRadiusZone(strike,observationRadius,stormRadius,dangerRadius) {
      const distance = finiteNumber(strike?.distance);
      if (distance == null) return 'outside';
      if (distance <= dangerRadius) return 'danger';
      if (distance <= stormRadius) return 'storm';
      if (distance <= observationRadius) return 'observation';
      return 'outside';
    },

    _applyRecentRadiusMapEmphasis() {
      const selected = this._recentRadiusFilter || 'observation';
      const configs = {
        observation:{ circle:this._radiusCircle,color:C.gold,weight:1.35,fillOpacity:.012,inactiveOpacity:.80 },
        storm:{ circle:this._stormCircle,color:C.blue,weight:1.25,fillOpacity:.008,inactiveOpacity:.86 },
        danger:{ circle:this._dangerCircle,color:C.danger,weight:1.45,fillOpacity:.018,inactiveOpacity:.94 }
      };

      for (const [key,cfg] of Object.entries(configs)) {
        if (!cfg.circle?.setStyle) continue;
        const active = key === selected;
        cfg.circle.setStyle({
          color:cfg.color,
          opacity:active ? 1 : cfg.inactiveOpacity,
          weight:active ? cfg.weight*1.32 : Math.max(1.05,cfg.weight*.94),
          fillColor:cfg.color,
          fillOpacity:active ? Math.min(.040,cfg.fillOpacity*1.80) : cfg.fillOpacity*.72
        });
      }

      // Feste semantische Zeichenreihenfolge: Beobachtung hinten, Gewitter darüber,
      // Gefahrenradius immer ganz oben. So kann ein aktiv hervorgehobener großer
      // Außenradius den kleinen roten 30-km-Kreis nicht mehr optisch überdecken.
      // Aura-Layer immer hinter den eigentlichen gestrichelten Radien halten.
      Object.values(this._radiusAuraLayers || {}).flat().forEach(layer => layer?.bringToBack?.());
      this._radiusCircle?.bringToBack?.();
      this._stormCircle?.bringToFront?.();
      this._dangerCircle?.bringToFront?.();
      this._homeMarker?.bringToFront?.();
    },

    _syncRecentFilterKpi(snapshot = this._recentKpiSnapshot) {
      if (!snapshot) return;
      const number = this.shadow?.getElementById('hit-observation');
      if (!number) return;
      const filter = ['danger','storm','observation'].includes(this._recentRadiusFilter)
        ? this._recentRadiusFilter : 'observation';
      // Gefahr bleibt rechts als eigene Gefahrenzone erhalten.
      // Gewitter/Beobachtung spiegeln bewusst die
      // aktuelle räumliche Auswahl in Zahl und Farbe.
      if (filter === 'storm') {
        number.textContent = String(snapshot.storm ?? 0);
        number.style.color = C.blue;
      } else {
        number.textContent = String(snapshot.observation ?? 0);
        number.style.color = C.gold;
      }
    },

    _renderRecentList(strikes,now,dangerRadius,stormRadius,observationRadius) {
      // V3.87 HARDENING – niemals wieder den kompletten #recent-content-Container
      // per innerHTML austauschen. Die Diagnose V3.77–V3.85 hat diesen Austausch
      // eindeutig als Ursache des iPad/WebKit-Auto-Scrolls identifiziert.
      // Historische Aufrufer werden deshalb ebenfalls auf den stabilen,
      // inkrementellen DOM-Pfad umgeleitet.
      return this._renderRecentStable(strikes,now,dangerRadius,stormRadius,observationRadius);
    },

    _renderRecentStable(strikes,now,dangerRadius,stormRadius,observationRadius) {
      // V3.86/V3.87 PRE-FINAL RECENT-DOM – FINALER AUTO-SCROLL-FIX
      // ---------------------------------------------------------------
      // Die Struktur bleibt weiterhin dauerhaft erhalten. V3.987 vereinfacht
      // die Filterung auf den Radius und aktualisiert nur Styles/Text; KEIN
      // innerHTML/replaceChildren/outerHTML in diesem Updatepfad.
      const host = this.shadow?.getElementById('recent-content');
      if (!host) return;

      observationRadius = finiteNumber(observationRadius) ?? this._currentObservationRadius ?? this._observationRadiusValue();
      stormRadius = Math.min(
        finiteNumber(stormRadius) ?? this._currentStormRadius ?? this._stormRadiusValue(),
        observationRadius
      );
      dangerRadius = Math.min(
        finiteNumber(dangerRadius) ?? this._currentDangerRadius ?? this._dangerRadiusValue(),
        stormRadius
      );

      const all = [...(Array.isArray(strikes) ? strikes : [])]
        .filter(s => s && now - s.firstSeen <= HISTORY_MINUTES*60000)
        .sort((a,b) => b.firstSeen - a.firstSeen);

      const radiusFilter = ['danger','storm','observation'].includes(this._recentRadiusFilter)
        ? this._recentRadiusFilter
        : 'observation';
      this._recentRadiusFilter = radiusFilter;

      const filtered = all.filter(s =>
        this._recentStrikeInRadius(s,radiusFilter,observationRadius,stormRadius,dangerRadius)
      );
      const latest = filtered.slice(0,5);
      const countText = (count) => count > 999 ? '999+' : String(count);

      // Radiusfilter bleibt die einzige Bedienebene. Keine Zahlenbadges mehr in
      // den Segmenten – die Anzahl steht einmalig und ruhig in der Kontextzeile.
      const radiusGroup = this.shadow?.getElementById('recent-radius-filter');
      radiusGroup?.setAttribute('aria-label',this._t('recent.filter_radius_aria'));
      const recentTitle = this.shadow?.getElementById('recent-panel-title');
      const recentTitleText = this._t('recent.title');
      if (recentTitle && recentTitle.textContent !== recentTitleText) recentTitle.textContent = recentTitleText;

      const radiusKeyMap = {
        danger:'recent.filter_danger',
        storm:'recent.filter_storm',
        observation:'recent.filter_observation'
      };
      this.shadow?.querySelectorAll('[data-recent-radius-filter]').forEach((button) => {
        const key = button.dataset.recentRadiusFilter;
        const active = key === radiusFilter;
        button.classList.toggle('active',active);
        button.setAttribute('aria-pressed',active ? 'true' : 'false');
        const label = button.querySelector('.recent-radius-label');
        const text = this._t(radiusKeyMap[key] || 'recent.filter_observation');
        if (label && label.textContent !== text) label.textContent = text;
      });

      const context = this.shadow?.getElementById('recent-context');
      if (context) {
        const radiusText = this._t(radiusKeyMap[radiusFilter] || 'recent.filter_observation');
        const contextText = this._t('recent.context',{
          radius:radiusText,
          count:countText(filtered.length)
        });
        if (context.textContent !== contextText) context.textContent = contextText;
      }

      const makeSpan = (className,text='') => {
        const span = document.createElement('span');
        span.className = className;
        span.textContent = text;
        return span;
      };

      let head = host.querySelector('.recent-head');
      let list = host.querySelector('.recent-list');
      let empty = host.querySelector('.recent-empty');

      if (!head) {
        head = document.createElement('div');
        head.className = 'recent-head';
        for (let i=0;i<5;i++) head.appendChild(document.createElement('span'));
        host.appendChild(head);
      }

      const recentHeadTexts = [
        '•',
        this._t('recent.direction'),
        this._t('recent.time'),
        this._t('recent.distance'),
        this._t('recent.marker')
      ];
      [...head.children].slice(0,5).forEach((span,index) => {
        const nextText = recentHeadTexts[index] || '';
        if (span.textContent !== nextText) span.textContent = nextText;
      });

      if (!list) {
        list = document.createElement('div');
        list.className = 'recent-list';
        host.appendChild(list);
      }

      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'recent-empty';
        host.appendChild(empty);
      }
      const emptyKey = radiusFilter === 'observation'
        ? 'recent.empty'
        : 'recent.empty_filtered';
      const recentEmptyText = this._t(emptyKey);
      if (empty.textContent !== recentEmptyText) empty.textContent = recentEmptyText;

      const ensureRow = (index) => {
        let row = list.children[index];
        if (row?.classList?.contains('recent-row')) return row;

        row = document.createElement('div');
        row.className = 'recent-row';

        const dot = makeSpan('recent-dot');
        const direction = makeSpan('recent-direction','–');
        const time = makeSpan('recent-time','–');
        const distance = makeSpan('recent-distance','–');
        const marker = makeSpan('recent-marker');
        marker.appendChild(document.createElement('span'));
        marker.setAttribute('role','button');
        marker.tabIndex = -1;

        const activateMarker = (event) => {
          if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
          if (event.type === 'keydown') event.preventDefault();
          event.stopPropagation();
          const strike = row._recentStrike || null;
          if (!strike) return;
          marker.classList.remove('tap-flash');
          void marker.offsetWidth;
          marker.classList.add('tap-flash');
          window.setTimeout(() => marker.classList.remove('tap-flash'),420);
          this._focusRecentStrike(strike);
        };
        marker.addEventListener('click',activateMarker);
        marker.addEventListener('keydown',activateMarker);

        row.append(dot,direction,time,distance,marker);
        list.appendChild(row);
        return row;
      };

      for (let i=0;i<5;i++) ensureRow(i);
      const rows = [...list.querySelectorAll(':scope > .recent-row')].slice(0,5);

      if (!latest.length) {
        head.hidden = true;
        list.hidden = true;
        empty.hidden = false;
        rows.forEach((row) => {
          row.hidden = true;
          row._recentStrike = null;
        });
        this._applyRecentRadiusMapEmphasis();
        this._syncRecentStrikeTargetButton(now,dangerRadius);
        return;
      }

      head.hidden = false;
      list.hidden = false;
      empty.hidden = true;

      rows.forEach((row,index) => {
        const strike = latest[index];
        row.hidden = !strike;
        row._recentStrike = strike || null;

        const marker = row.querySelector('.recent-marker');
        if (marker) {
          marker.tabIndex = strike ? 0 : -1;
          if (strike) {
            const focusText = this._t('status.strike_focus');
            marker.setAttribute('title',focusText);
            marker.setAttribute('aria-label',focusText);
            marker.setAttribute('aria-disabled','false');
          } else {
            marker.removeAttribute('title');
            marker.removeAttribute('aria-label');
            marker.setAttribute('aria-disabled','true');
          }
        }
        if (!strike) return;

        const status = this._strikeStatus(strike,now,dangerRadius);
        const color = status === 'danger' ? C.danger : status === 'active' ? C.gold : C.blue;

        // Radius-Zone bleibt als semantisches Datum erhalten, wird in V3.986
        // aber nicht mehr zusätzlich links an jeder Zeile gezeichnet. Der Filter
        // übernimmt diese räumliche Codierung deutlich ruhiger.
        const zone = this._recentRadiusZone(strike,observationRadius,stormRadius,dangerRadius);
        row.dataset.radiusZone = zone;

        const dot = row.querySelector('.recent-dot');
        const direction = row.querySelector('.recent-direction');
        const time = row.querySelector('.recent-time');
        const distance = row.querySelector('.recent-distance');

        if (dot) {
          dot.style.color = color;
          dot.style.background = color;
        }

        const directionText = strike.azimuth != null
          ? `${this._toCardinal(strike.azimuth)} · ${Math.round(strike.azimuth)}°`
          : '–';
        if (direction && direction.textContent !== directionText) direction.textContent = directionText;

        const timeText = this._formatRelative(now-strike.firstSeen);
        if (time && time.textContent !== timeText) time.textContent = timeText;

        const distanceText = strike.distance != null && Number.isFinite(Number(strike.distance))
          ? this._formatDistance(Number(strike.distance)).text
          : '–';
        if (distance && distance.textContent !== distanceText) distance.textContent = distanceText;

        if (marker) marker.style.color = color;
      });

      this._applyRecentRadiusMapEmphasis();
      this._syncRecentStrikeTargetButton(now,dangerRadius);
    },

    _focusReferenceStormRadius(reference = this._home()) {
      if (!this._map || !reference) return;
      const lat = finiteNumber(reference.lat);
      const lon = finiteNumber(reference.lon);
      if (lat == null || lon == null) return;

      const observationRadius = Math.max(1,this._observationRadiusValue());
      const stormRadius = Math.max(5,Math.min(this._stormRadiusValue(),observationRadius));
      const L = window.L;
      const center = [lat,lon];

      /* V3.988 – Geo-Location ist jetzt ein echter räumlicher Recenter:
         nicht nur den Mittelpunkt setzen, sondern den eingestellten Gewitterradius
         vollständig sichtbar machen. Leaflet bestimmt damit für Desktop/iPad/Mobile
         selbst den passenden Zoom und fährt gleichzeitig sanft zur Bezugsposition. */
      if (L?.latLng && typeof this._map.flyToBounds === 'function') {
        const centerLatLng = L.latLng(lat,lon);
        const bounds = centerLatLng?.toBounds?.(stormRadius*2000);
        if (bounds?.isValid?.()) {
          this._map.flyToBounds(bounds,{
            padding:[34,34],
            animate:true,
            duration:1.22,
            easeLinearity:.22
          });
          return;
        }
      }

      // Robuster Fallback für ungewöhnliche Leaflet-Builds.
      const currentZoom = finiteNumber(this._map.getZoom?.()) ?? 7;
      if (typeof this._map.flyTo === 'function') {
        this._map.flyTo(center,currentZoom,{
          animate:true,
          duration:1.22,
          easeLinearity:.22
        });
      } else {
        this._map.setView(center,currentZoom,{ animate:true });
      }
    },

    _focusRecentRadiusFilter(filter) {
      if (!this._map) return;
      this._clearRecentStrikeTarget();
      const home = this._home();
      const L = window.L;
      const padding = [34,34];

      const radiusKm = filter === 'danger'
        ? (this._currentDangerRadius ?? this._dangerRadiusValue())
        : filter === 'storm'
          ? (this._currentStormRadius ?? this._stormRadiusValue())
          : (this._currentObservationRadius ?? this._observationRadiusValue());
      if (L?.latLng && typeof this._map.flyToBounds === 'function') {
        const bounds = L.latLng(home.lat,home.lon)?.toBounds?.(Math.max(1,radiusKm)*2000);
        if (bounds?.isValid?.()) {
          this._map.flyToBounds(bounds,{padding,animate:true,duration:1.08,easeLinearity:.22});
          return;
        }
      }
      this._map.flyTo?.([home.lat,home.lon],this._map.getZoom?.() ?? 7,{animate:true,duration:1.08});
    },

    _clearRecentStrikeTarget() {
      this._recentSelectedStrike = null;
      this._recentStrikeTargetMode = 'cluster';
      this._recentStrikeClusterView = null;
      const button = this.shadow?.getElementById('map-strike-target');
      if (button) {
        button.hidden = true;
        button.removeAttribute('data-focus-mode');
      }
    },

    _syncRecentStrikeTargetButton(now = Date.now(),dangerRadius = this._currentDangerRadius ?? this._dangerRadiusValue()) {
      const button = this.shadow?.getElementById('map-strike-target');
      if (!button) return;
      const strike = this._recentSelectedStrike;
      const valid = !!strike &&
        finiteNumber(strike.lat) != null &&
        finiteNumber(strike.lon) != null &&
        Number.isFinite(strike.firstSeen) &&
        now-strike.firstSeen <= HISTORY_MINUTES*60000;
      if (!valid) {
        this._clearRecentStrikeTarget();
        return;
      }

      const status = this._strikeStatus(strike,now,dangerRadius);
      const color = status === 'danger' ? C.danger : status === 'active' ? C.gold : C.blue;
      button.style.setProperty('--target-color',color);
      const detailMode = this._recentStrikeTargetMode === 'detail';
      const title = this._t(detailMode ? 'status.strike_focus_cluster' : 'status.strike_focus_detail');
      button.setAttribute('title',title);
      button.setAttribute('aria-label',title);
      button.setAttribute('data-focus-mode',detailMode ? 'detail' : 'cluster');
      button.hidden = false;
    },

    _focusRecentStrike(strike) {
      if (!this._map || !strike) return;
      const lat = finiteNumber(strike.lat);
      const lon = finiteNumber(strike.lon);
      if (lat == null || lon == null) return;

      /* V3.993 – Treffer aus der Liste öffnen bewusst zwei Stufen weiter außen.
         Zoom 7 hält die Clusterwolke und den räumlichen Kontext sichtbar; erst der
         zusätzliche ⊙-Button fordert den Einzelblitz-Detailzoom explizit an. */
      const maxZoomRaw = finiteNumber(this._map.getMaxZoom?.());
      const maxZoom = maxZoomRaw != null && maxZoomRaw > 0 ? maxZoomRaw : 18;
      const clusterZoom = Math.min(maxZoom,7);
      const latLng = [lat,lon];

      this._recentSelectedStrike = strike;
      this._recentStrikeTargetMode = 'cluster';
      this._recentStrikeClusterView = { lat,lon,zoom:clusterZoom };
      this._syncRecentStrikeTargetButton();

      if (typeof this._map.flyTo === 'function') {
        this._map.flyTo(latLng,clusterZoom,{
          animate:true,
          duration:.94,
          easeLinearity:.24
        });
      } else {
        this._map.setView(latLng,clusterZoom,{ animate:true });
      }
    },

    _focusSelectedRecentStrikeDetail() {
      const strike = this._recentSelectedStrike;
      if (!this._map || !strike) return;
      const lat = finiteNumber(strike.lat);
      const lon = finiteNumber(strike.lon);
      if (lat == null || lon == null) {
        this._clearRecentStrikeTarget();
        return;
      }

      const maxZoomRaw = finiteNumber(this._map.getMaxZoom?.());
      const maxZoom = maxZoomRaw != null && maxZoomRaw > 0 ? maxZoomRaw : 18;
      const detailMode = this._recentStrikeTargetMode === 'detail';

      if (detailMode) {
        // Zweiter Klick: exakt zur gemerkten Cluster-/Umgebungsstufe zurück.
        const view = this._recentStrikeClusterView || { lat,lon,zoom:Math.min(maxZoom,9) };
        const targetLat = finiteNumber(view.lat) ?? lat;
        const targetLon = finiteNumber(view.lon) ?? lon;
        const targetZoom = Math.min(maxZoom,finiteNumber(view.zoom) ?? 9);
        this._recentStrikeTargetMode = 'cluster';
        this._syncRecentStrikeTargetButton();

        if (typeof this._map.flyTo === 'function') {
          this._map.flyTo([targetLat,targetLon],targetZoom,{
            animate:true,
            duration:.94,
            easeLinearity:.24
          });
        } else {
          this._map.setView([targetLat,targetLon],targetZoom,{ animate:true });
        }
        return;
      }

      // Erster ⊙-Klick: bewusst tiefer Einzelblitz-Fokus.
      const currentZoom = finiteNumber(this._map.getZoom?.()) ?? 9;
      const targetZoom = Math.min(maxZoom,Math.max(currentZoom,12));
      this._recentStrikeTargetMode = 'detail';
      this._syncRecentStrikeTargetButton();

      if (typeof this._map.flyTo === 'function') {
        this._map.flyTo([lat,lon],targetZoom,{
          animate:true,
          duration:1.00,
          easeLinearity:.22
        });
      } else {
        this._map.setView([lat,lon],targetZoom,{ animate:true });
      }
    },

    _resetStatusClusterBrowse() {
      if(this._statusClusterBrowseTimer)clearTimeout(this._statusClusterBrowseTimer);this._statusClusterBrowseTimer=null;
      if(this._statusClusterBrowseUiTimer)clearInterval(this._statusClusterBrowseUiTimer);this._statusClusterBrowseUiTimer=null;
      this._statusClusterBrowseSnapshot = [];
      this._statusClusterBrowseActive = false;
      this._statusClusterBrowseLastInteraction = 0;
      this._syncDiagnosticClusterBrowseV40802?.();
    },

    _setStatusClusterBrowseTimeoutV40802(timeoutMs) {
      const raw=Number(timeoutMs);const next=raw===0?0:(Number.isFinite(raw)?Math.max(5000,Math.min(3600000,Math.round(raw/1000)*1000)):10000);
      this._statusClusterBrowseTimeoutMs=next;if(next>0)this._statusClusterBrowseFiniteTimeoutMs=next;
      try{localStorage.setItem('gewitterradar:v40804:cluster-jump-timeout',String(next));if(next>0)localStorage.setItem('gewitterradar:v40804:cluster-jump-finite-timeout',String(next));}catch(_error){}
      if(this._statusClusterBrowseActive)this._touchStatusClusterBrowseSessionV40802();else{this._updateStatusFocusUi?.();this._syncDiagnosticClusterBrowseV40802?.();}
    },

    _touchStatusClusterBrowseSessionV40802() {
      if(!this._statusClusterBrowseActive)return;this._statusClusterBrowseLastInteraction=Date.now();
      if(this._statusClusterBrowseTimer)clearTimeout(this._statusClusterBrowseTimer);this._statusClusterBrowseTimer=null;
      const timeout=Number(this._statusClusterBrowseTimeoutMs)||0;if(timeout>0)this._statusClusterBrowseTimer=setTimeout(()=>this._expireStatusClusterBrowseSessionV40802('timeout'),timeout);
      if(this._statusClusterBrowseUiTimer)clearInterval(this._statusClusterBrowseUiTimer);this._statusClusterBrowseUiTimer=null;
      if(timeout>0)this._statusClusterBrowseUiTimer=setInterval(()=>{this._updateStatusFocusUi?.();if(this._diagnostics?.enabled)this._syncDiagnosticClusterBrowseV40802?.();},250);
      this._updateStatusFocusUi?.();this._syncDiagnosticClusterBrowseV40802?.();
    },

    _expireStatusClusterBrowseSessionV40802(reason='timeout') {
      const wasActive=!!this._statusClusterBrowseActive;this._resetStatusClusterBrowse();this._statusFocusIndex=-1;this._statusFocusSelectedId=null;
      if(this._diagnostics?.weatherLab)this._diagnostics.weatherLab.lastClusterBrowseEndReason=reason;
      if(wasActive){this._renderMapMarkers?.();this._render?.();}
      this._syncDiagnosticClusterBrowseV40802?.();
    },

    _focusCluster(cluster) {
      if (!this._map || !cluster) return;
      this._clearRecentStrikeTarget();
      const lat = finiteNumber(cluster.lat);
      const lon = finiteNumber(cluster.lon);
      if (lat == null || lon == null) return;

      const currentZoom = finiteNumber(this._map.getZoom?.()) ?? 7;
      // V3.984 – Cluster sind eine Übersichtsebene. Nach einem Marker-/Einzelblitz-
      // Fokus (typisch Zoom >= 11) darf der Cluster deshalb nicht im Detailzoom
      // hängen bleiben. Maximal Zoom 9, bei bereits weiterer Ansicht jedoch niemals
      // künstlich hineinzoomen. flyToBounds kann bei räumlich großen Clustern noch
      // weiter herausgehen und schwenkt dabei gleichzeitig zum neuen Mittelpunkt.
      const profileFocusMaxZoom = this._clusterResolutionProfileV40822 === 'early'
        ? 8
        : this._clusterResolutionProfileV40822 === 'late'
          ? 10
          : 9;
      const clusterMaxZoom = Math.max(2,Math.min(currentZoom,profileFocusMaxZoom));
      const bounds = Array.isArray(cluster.bounds) ? cluster.bounds : null;
      const L = window.L;

      if (
        bounds?.length === 2 &&
        L?.latLngBounds &&
        typeof this._map.flyToBounds === 'function'
      ) {
        const leafletBounds = L.latLngBounds(bounds);
        if (leafletBounds?.isValid?.()) {
          this._map.flyToBounds(leafletBounds,{
            padding:[64,64],
            maxZoom:clusterMaxZoom,
            animate:true,
            duration:1.22,
            easeLinearity:.22
          });
          return;
        }
      }

      const latLng = [lat,lon];
      if (typeof this._map.flyTo === 'function') {
        this._map.flyTo(latLng,clusterMaxZoom,{
          animate:true,
          duration:1.22,
          easeLinearity:.22
        });
      } else {
        this._map.setView(latLng,clusterMaxZoom,{ animate:true });
      }
    },

    _updateStatusFocusUi() {
      const statusChip = this.shadow?.getElementById('status-chip');
      const statusTextEl = this.shadow?.getElementById('header-status');
      if (!statusChip || !statusTextEl) return;

      const list = Array.isArray(this._statusFocusList) ? this._statusFocusList : [];
      const total = list.length;
      const mode = this._statusFocusMode || 'disabled';
      const kind = this._statusFocusKind || 'individual';

      statusChip.classList.remove('danger','storm','activity','quiet','disabled');
      statusChip.classList.add(mode);

      if (!total || mode === 'disabled') {
        const emptyText = kind === 'cluster' ? this._t('status.no_clusters') : this._t('status.no_hits');
        const emptyTitle = kind === 'cluster'
          ? this._t('status.no_clusters_focus')
          : this._t('status.no_activity_focus');
        statusTextEl.textContent = emptyText;
        statusChip.setAttribute('title',emptyTitle);
        statusChip.setAttribute('aria-label',emptyTitle);
        statusChip.setAttribute('aria-disabled','true');
        this._syncFullscreenClusterJumpUi?.();
        return;
      }

      const selectedIndex =
        Number.isInteger(this._statusFocusIndex) &&
        this._statusFocusIndex >= 0 &&
        this._statusFocusIndex < total
          ? this._statusFocusIndex
          : -1;

      // Vor dem ersten Klick zeigt 1/N den ersten Treffer an, der beim Klick
      // tatsächlich angesteuert wird. Danach zeigt der Zähler den aktuell
      // fokussierten Treffer. Nach N beginnt der nächste Klick wieder bei 1.
      const displayIndex = selectedIndex >= 0 ? selectedIndex : 0;
      const strike = list[displayIndex];

      let nextIndex = selectedIndex + 1;
      if (nextIndex < 0 || nextIndex >= total) nextIndex = 0;
      const nextStrike = list[nextIndex];

      let label;
      let title;

      if (kind === 'cluster') {
        // Vom Nutzer bewusst kurz gehalten: keine Aktivitätszahl zusätzlich
        // in die Clusterbeschriftung packen.
        label = this._t('status.cluster_index',{index:displayIndex + 1,total});
        if (this._statusClusterBrowseActive && selectedIndex >= 0) {
          const timeout = Number(this._statusClusterBrowseTimeoutMs) || 0;
          if (timeout === 0) {
            // V4.08.16: Infinity-Fokus im Menue verstaerkt; endlicher Countdown nutzt dieselbe Goldfamilie.
          } else if (this._statusClusterBrowseLastInteraction) {
            const remainingMs = Math.max(0,timeout - (Date.now() - this._statusClusterBrowseLastInteraction));
            label += ` · ${Math.ceil(remainingMs / 1000)}s`;
          }
        }

        const nextCount = Number(nextStrike?.count) || 0;
        title = selectedIndex < 0
          ? this._t('status.cluster_focus_first',{total})
          : this._t('status.cluster_focus_next',{index:nextIndex + 1,total});

        if (nextCount > 0) {
          title += ` · ${this._tp('strike',nextCount)}`;
        }
      } else {
        label = this._statusFocusBaseText || this._t('status.activity');

        if (mode === 'danger' && strike?.distance != null) {
          label = this._distanceMessage('status.danger_distance',strike.distance);
        }

        if (total > 1 && (mode === 'danger' || mode === 'storm' || mode === 'activity')) {
          label += ` · ${displayIndex + 1}/${total}`;
        }

        if (total > 1 && (mode === 'danger' || mode === 'storm' || mode === 'activity')) {
          title = selectedIndex < 0
            ? this._t('status.strike_focus_first',{total})
            : this._t('status.strike_focus_next',{index:nextIndex + 1,total});
        } else if (mode === 'quiet') {
          title = this._t('status.last_strike_focus');
        } else {
          title = this._t('status.strike_focus');
        }

        if (nextStrike?.distance != null && mode !== 'quiet') {
          title += ` · ${this._formatDistance(nextStrike.distance).text}`;
        }
      }

      const useInfinityGfx = kind === 'cluster' && this._statusClusterBrowseActive && selectedIndex >= 0 && Number(this._statusClusterBrowseTimeoutMs) === 0;
      const useGoldCountdown = kind === 'cluster' && this._statusClusterBrowseActive && selectedIndex >= 0 && Number(this._statusClusterBrowseTimeoutMs) > 0 && !!this._statusClusterBrowseLastInteraction;
      if (useInfinityGfx) {
        statusTextEl.replaceChildren(document.createTextNode(`${label} `));
        const infinityGfx = document.createElement('img');
        infinityGfx.className = 'status-infinity-gfx status-infinite-active';
        infinityGfx.src = GEWITTERRADAR_INFINITY_GFX;
        infinityGfx.alt = '';
        infinityGfx.setAttribute('aria-hidden','true');
        infinityGfx.setAttribute('data-session-toggle','finite');
        infinityGfx.title = this._t('settings.cluster_navigation_to_session');
        statusTextEl.appendChild(infinityGfx);
      } else if (useGoldCountdown) {
        const timeout = Number(this._statusClusterBrowseTimeoutMs) || 0;
        const remainingMs = Math.max(0,timeout - (Date.now() - this._statusClusterBrowseLastInteraction));
        const baseLabel = this._t('status.cluster_index',{index:displayIndex + 1,total});
        const countdown = document.createElement('span');
        countdown.className = 'status-cluster-countdown';
        countdown.setAttribute('data-session-toggle','infinite');
        countdown.title = this._t('settings.cluster_navigation_to_infinite');
        countdown.textContent = ` · ${Math.ceil(remainingMs / 1000)}s`;
        statusTextEl.replaceChildren(document.createTextNode(baseLabel),countdown);
      } else {
        statusTextEl.textContent = label;
      }
      statusChip.setAttribute('title',title);
      statusChip.setAttribute('aria-label',title);
      statusChip.setAttribute('aria-disabled','false');
      this._syncFullscreenClusterJumpUi?.();
    },

};});

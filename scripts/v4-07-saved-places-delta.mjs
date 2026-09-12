const replaceOnce = (text, from, to) => {
  if (text.split(from).length !== 2) throw new Error(`V4.07 saved-places anchor changed: ${from.slice(0, 140)}`);
  return text.replace(from, to);
};

const SAVED_HELPERS = `
      const V407_SAVED_TODO_PREFIX = 'GEWITTERRADAR_PLACE_V1\\n';
      const v407SavedTodoEntity = () => {
        const hass = this._hass;
        const configured = String(this._config?.saved_places_entity || '').trim();
        if (configured && hass?.states?.[configured]) return configured;
        const preferred = ['todo.gewitterradar_orte','todo.gewitterradar_saved_places','todo.gewitterradar'];
        for (const entityId of preferred) if (hass?.states?.[entityId]) return entityId;
        const normalizedTargets = new Set(['gewitterradar orte','gewitterradar saved places','gewitterradar']);
        return Object.entries(hass?.states || {}).find(([entityId,state]) =>
          entityId.startsWith('todo.') && normalizedTargets.has(v407NormalizeText(state?.attributes?.friendly_name))
        )?.[0] || '';
      };
      const v407SavedPlaceDescription = (candidate) => V407_SAVED_TODO_PREFIX + JSON.stringify({
        version:1,
        name:String(candidate.name || candidate.displayLabel || '').trim(),
        displayLabel:String(candidate.displayLabel || candidate.name || '').trim(),
        latitude:Number(candidate.latitude),
        longitude:Number(candidate.longitude),
        countryCode:String(candidate.countryCode || '').trim(),
        country:String(candidate.country || '').trim(),
        admin1:String(candidate.admin1 || '').trim(),
        postcode:String(candidate.postcode || '').trim(),
        provider:String(candidate.provider || '').trim()
      });
      const v407ParseSavedPlace = (item) => {
        const description = String(item?.description || '');
        if (!description.startsWith(V407_SAVED_TODO_PREFIX)) return null;
        try {
          const data = JSON.parse(description.slice(V407_SAVED_TODO_PREFIX.length));
          const latitude = Number(data?.latitude), longitude = Number(data?.longitude);
          if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
          const name = String(data?.name || item?.summary || '').trim() || 'Location';
          const displayLabel = String(data?.displayLabel || item?.summary || name).trim();
          return {
            uid:String(item?.uid || ''),
            summary:String(item?.summary || displayLabel || name),
            status:String(item?.status || 'needs_action'),
            provider:String(data?.provider || 'saved'), name, displayLabel, latitude, longitude,
            countryCode:String(data?.countryCode || ''), country:String(data?.country || ''), admin1:String(data?.admin1 || ''),
            postcode:String(data?.postcode || ''), postcodes:data?.postcode ? [String(data.postcode)] : []
          };
        } catch (_) { return null; }
      };
      const v407LoadSavedPlaces = async ({force=false} = {}) => {
        const entityId = v407SavedTodoEntity();
        this._v407SavedPlacesMissing = !entityId;
        if (!entityId) {
          this._v407SavedPlaces = [];
          this._v407SavedPlacesEntity = '';
          return [];
        }
        if (!force && this._v407SavedPlacesEntity === entityId && Array.isArray(this._v407SavedPlaces)) return this._v407SavedPlaces;
        if (this._v407SavedPlacesLoading) return this._v407SavedPlacesLoading;
        this._v407SavedPlacesLoading = (async () => {
          try {
            const result = await this._hass.callService('todo','get_items',{status:'needs_action'},{entity_id:entityId},true,true);
            const items = result?.response?.[entityId]?.items;
            const places = (Array.isArray(items) ? items : []).map(v407ParseSavedPlace).filter(Boolean)
              .sort((a,b) => a.summary.localeCompare(b.summary,undefined,{sensitivity:'base'}));
            this._v407SavedPlaces = places;
            this._v407SavedPlacesEntity = entityId;
            this._v407SavedPlacesMissing = false;
            return places;
          } catch (error) {
            console.warn('[Gewitterradar V4.07] Gespeicherte Orte konnten nicht geladen werden.',error);
            this._v407SavedPlaces = [];
            this._v407SavedPlacesEntity = entityId;
            return [];
          } finally {
            this._v407SavedPlacesLoading = null;
          }
        })();
        return this._v407SavedPlacesLoading;
      };
      const v407SaveCandidate = async (candidate) => {
        const entityId = v407SavedTodoEntity();
        if (!entityId) throw new Error('V407_TODO_MISSING');
        const places = await v407LoadSavedPlaces({force:true});
        const duplicate = places.find((place) =>
          Math.abs(Number(place.latitude) - Number(candidate.latitude)) < 0.00001 &&
          Math.abs(Number(place.longitude) - Number(candidate.longitude)) < 0.00001
        );
        if (duplicate) return {saved:false,duplicate:true,place:duplicate};
        const item = String(candidate.displayLabel || candidate.name || '').trim() || String(candidate.name || 'Location');
        await this._hass.callService('todo','add_item',{
          item,
          description:v407SavedPlaceDescription(candidate)
        },{entity_id:entityId});
        const refreshed = await v407LoadSavedPlaces({force:true});
        return {saved:true,duplicate:false,place:refreshed.find((place) =>
          Math.abs(Number(place.latitude) - Number(candidate.latitude)) < 0.00001 &&
          Math.abs(Number(place.longitude) - Number(candidate.longitude)) < 0.00001
        ) || null};
      };
      const v407FocusCandidate = (candidate) => {
        const latitude = Number(candidate?.latitude), longitude = Number(candidate?.longitude);
        if (!this._map || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
        this._clearRecentStrikeTarget?.();
        this._resetStatusClusterBrowse?.();
        this._statusFocusIndex = -1;
        this._statusFocusSelectedId = null;
        const reference = {
          lat:latitude, lon:longitude,
          label:String(candidate?.name || candidate?.displayLabel || v407Text().savedPlaceFallback),
          available:true
        };
        requestAnimationFrame(() => this._focusReferenceStormRadius?.(reference));
      };
`;

export function v407SavedPlacesDelta(source) {
  let text = source;

  text = replaceOnce(text,
    "const GEWITTERRADAR_BUILD = 'V4.07-TEST-2026-09-12';",
    "const GEWITTERRADAR_BUILD = 'V4.07-TEST2-2026-09-12';");

  text = replaceOnce(text,
    "          .v407-location-result-save { border:1px solid rgba(153,169,183,.15);background:rgba(255,255,255,.025);color:#718395;cursor:not-allowed; }",
    "          .v407-location-result-save { border:1px solid rgba(246,195,68,.34);background:rgba(246,195,68,.08);color:#f1cf68;cursor:pointer; }\n          .v407-location-result-save:disabled { opacity:.55;cursor:default; }\n          .location-saved-option { appearance:none;-webkit-appearance:none;width:100%;min-height:36px;border:0;background:transparent;color:#dceaf6;display:flex;align-items:center;gap:9px;padding:7px 12px;text-align:left;font:650 11px/1.2 inherit;cursor:pointer;border-radius:8px; }\n          .location-saved-option:hover,.location-saved-option:focus-visible { outline:none;background:rgba(246,195,68,.075); }\n          .location-saved-star { color:#f6c344;font-size:13px;line-height:1; }\n          .location-saved-copy { min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }");

  text = replaceOnce(text,
    "        appendHeader(text.savedPlaces);\n        const savedEmpty = document.createElement('div');\n        savedEmpty.className = 'location-section-empty';\n        savedEmpty.textContent = text.savedEmpty;\n        frag.appendChild(savedEmpty);",
    `        appendHeader(text.savedPlaces);
        const savedPlaces = Array.isArray(this._v407SavedPlaces) ? this._v407SavedPlaces : [];
        if (savedPlaces.length) {
          savedPlaces.forEach((place) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'location-saved-option';
            button.dataset.savedPlaceUid = place.uid || '';
            const star = document.createElement('span');
            star.className = 'location-saved-star';
            star.textContent = '★';
            star.setAttribute('aria-hidden','true');
            const label = document.createElement('span');
            label.className = 'location-saved-copy';
            label.textContent = place.summary || place.displayLabel || place.name;
            button.append(star,label);
            frag.appendChild(button);
          });
        } else {
          const savedEmpty = document.createElement('div');
          savedEmpty.className = 'location-section-empty';
          savedEmpty.textContent = this._v407SavedPlacesMissing ? text.savedSetup : text.savedEmpty;
          frag.appendChild(savedEmpty);
        }`);

  text = replaceOnce(text,
    "        use:'Nutzen', save:'★ Speichern', saveLater:'Gespeicherte Orte folgen in einem separaten V4.07-Schritt.',",
    "        use:'Nutzen', save:'★ Speichern', saveTitle:'Ort dauerhaft in der lokalen Gewitterradar-Ortsliste speichern.', saving:'Ort wird gespeichert …', saved:'★ Gespeichert', savedOk:'wurde gespeichert.', savedDuplicate:'ist bereits gespeichert.', saveFailed:'Ort konnte nicht gespeichert werden.', savedSetup:'Zum Speichern einmalig eine lokale To-do-Liste „Gewitterradar Orte“ in Home Assistant anlegen.', savedPlaceFallback:'Gespeicherter Ort',");
  text = replaceOnce(text,
    "        use:'Use', save:'★ Save', saveLater:'Saved places will follow in a separate V4.07 step.',",
    "        use:'Use', save:'★ Save', saveTitle:'Save place permanently in the local Gewitterradar place list.', saving:'Saving place …', saved:'★ Saved', savedOk:'was saved.', savedDuplicate:'is already saved.', saveFailed:'Place could not be saved.', savedSetup:'Create a local Home Assistant to-do list named “Gewitterradar Orte” once to enable saving.', savedPlaceFallback:'Saved place',");

  text = replaceOnce(text,
    "      const v407EnsureLocationSearchDialog = () => {",
    SAVED_HELPERS + "\n      const v407EnsureLocationSearchDialog = () => {");

  text = replaceOnce(text,
    "            const save=document.createElement('button'); save.type='button'; save.className='v407-location-result-save'; save.textContent=text.save; save.disabled=true; save.title=text.saveLater;",
    "            const save=document.createElement('button'); save.type='button'; save.className='v407-location-result-save'; save.textContent=text.save; save.disabled=false; save.title=text.saveTitle;");

  text = replaceOnce(text,
    "            use.addEventListener('click',async () => { use.disabled=true; setStatus(text.using); try { const ok=await v407UseCandidate(candidate); if (!ok) throw new Error(text.backendMissing); setStatus(`${candidate.name} ${text.used}`); this._render(); } catch (error) { console.warn('[Gewitterradar V4.07] Bezugsstandort konnte nicht gesetzt werden.',error); setStatus(error?.message===text.backendMissing ? text.backendMissing : text.useFailed,true); } finally { use.disabled=false; } });",
    `            use.addEventListener('click',async () => {
              use.disabled=true; setStatus(text.using);
              try {
                const ok=await v407UseCandidate(candidate);
                if (!ok) throw new Error(text.backendMissing);
                close();
                v407FocusCandidate(candidate);
              } catch (error) {
                console.warn('[Gewitterradar V4.07] Bezugsstandort konnte nicht gesetzt werden.',error);
                setStatus(error?.message===text.backendMissing ? text.backendMissing : text.useFailed,true);
              } finally { use.disabled=false; }
            });
            save.addEventListener('click',async () => {
              save.disabled=true; setStatus(text.saving);
              try {
                const result=await v407SaveCandidate(candidate);
                save.textContent=text.saved;
                setStatus(String(candidate.name || candidate.displayLabel || '') + ' ' + (result.duplicate ? text.savedDuplicate : text.savedOk));
              } catch (error) {
                console.warn('[Gewitterradar V4.07] Ort konnte nicht gespeichert werden.',error);
                setStatus(error?.message==='V407_TODO_MISSING' ? text.savedSetup : text.saveFailed,true);
                save.disabled=false;
              }
            });`);

  text = replaceOnce(text,
    "        renderLocationDropdown();\n        positionLocationDropdown(settingsLocationButton);",
    "        renderLocationDropdown();\n        positionLocationDropdown(settingsLocationButton);\n        void v407LoadSavedPlaces().then(() => { if (locationDropdown?.classList.contains('open')) renderLocationDropdown(); });");
  text = replaceOnce(text,
    "        renderLocationDropdown();\n        positionLocationDropdown(locationMainButton);",
    "        renderLocationDropdown();\n        positionLocationDropdown(locationMainButton);\n        void v407LoadSavedPlaces().then(() => { if (locationDropdown?.classList.contains('open')) renderLocationDropdown(); });");

  text = replaceOnce(text,
    "      locationDropdown?.addEventListener('click',(event) => {\n        const search = event.target?.closest?.('.location-search-action');",
    "      locationDropdown?.addEventListener('click',async (event) => {\n        const search = event.target?.closest?.('.location-search-action');");
  text = replaceOnce(text,
    "          openV407LocationSearch();\n          return;\n        }\n        const option = event.target?.closest?.('.location-option');",
    `          openV407LocationSearch();
          return;
        }
        const savedButton = event.target?.closest?.('.location-saved-option');
        if (savedButton) {
          event.preventDefault(); event.stopPropagation();
          const uid = String(savedButton.dataset.savedPlaceUid || '');
          const place = (Array.isArray(this._v407SavedPlaces) ? this._v407SavedPlaces : []).find((item) => String(item.uid || '') === uid);
          if (!place) return;
          try {
            const ok = await v407UseCandidate(place);
            if (!ok) throw new Error(v407Text().backendMissing);
            closeLocationDropdown(false);
            v407FocusCandidate(place);
          } catch (error) {
            console.warn('[Gewitterradar V4.07] Gespeicherter Ort konnte nicht verwendet werden.',error);
          }
          return;
        }
        const option = event.target?.closest?.('.location-option');`);

  return text;
}

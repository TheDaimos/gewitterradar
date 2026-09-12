const replaceOnce = (text, from, to) => {
  if (text.split(from).length !== 2) throw new Error(`V4.07 soft-delete anchor changed: ${from.slice(0, 140)}`);
  return text.replace(from, to);
};

const replaceRangeOnce = (text, startMarker, endMarker, replacement) => {
  const start = text.indexOf(startMarker);
  if (start < 0) throw new Error(`V4.07 soft-delete range start missing: ${startMarker}`);
  const endStart = text.indexOf(endMarker, start + startMarker.length);
  if (endStart < 0) throw new Error(`V4.07 soft-delete range end missing: ${endMarker}`);
  const secondStart = text.indexOf(startMarker, start + startMarker.length);
  if (secondStart >= 0) throw new Error(`V4.07 soft-delete range start is not unique: ${startMarker}`);
  return text.slice(0, start) + replacement + text.slice(endStart);
};

const LOAD_AND_STATUS = `      const v407LoadSavedPlaces = async ({force=false} = {}) => {
        const entityId = v407SavedTodoEntity();
        this._v407SavedPlacesMissing = !entityId;
        if (!entityId) {
          this._v407SavedPlaces = [];
          this._v407RemovedPlaces = [];
          this._v407SavedPlacesEntity = '';
          return [];
        }
        if (!force && this._v407SavedPlacesEntity === entityId && Array.isArray(this._v407SavedPlaces) && Array.isArray(this._v407RemovedPlaces)) return this._v407SavedPlaces;
        if (this._v407SavedPlacesLoading) return this._v407SavedPlacesLoading;
        this._v407SavedPlacesLoading = (async () => {
          try {
            const result = await this._hass.callService('todo','get_items',{status:['needs_action','completed']},{entity_id:entityId},true,true);
            const items = result?.response?.[entityId]?.items;
            const allPlaces = (Array.isArray(items) ? items : []).map(v407ParseSavedPlace).filter(Boolean);
            const byName = (a,b) => a.summary.localeCompare(b.summary,undefined,{sensitivity:'base'});
            const places = allPlaces.filter((place) => place.status !== 'completed').sort(byName);
            const removedPlaces = allPlaces.filter((place) => place.status === 'completed').sort(byName);
            this._v407SavedPlaces = places;
            this._v407RemovedPlaces = removedPlaces;
            this._v407SavedPlacesEntity = entityId;
            this._v407SavedPlacesMissing = false;
            return places;
          } catch (error) {
            console.warn('[Gewitterradar V4.07] Gespeicherte Orte konnten nicht geladen werden.',error);
            this._v407SavedPlaces = [];
            this._v407RemovedPlaces = [];
            this._v407SavedPlacesEntity = entityId;
            return [];
          } finally {
            this._v407SavedPlacesLoading = null;
          }
        })();
        return this._v407SavedPlacesLoading;
      };
      const v407UpdateSavedPlaceStatus = async (place,status) => {
        const entityId = v407SavedTodoEntity();
        if (!entityId) throw new Error('V407_TODO_MISSING');
        const item = String(place?.uid || place?.summary || '').trim();
        if (!item) throw new Error('V407_TODO_ITEM_MISSING');
        await this._hass.callService('todo','update_item',{item,status},{entity_id:entityId});
        await v407LoadSavedPlaces({force:true});
        return true;
      };
      const v407RemoveSavedPlace = async (place) => v407UpdateSavedPlaceStatus(place,'completed');
      const v407RestoreSavedPlace = async (place) => v407UpdateSavedPlaceStatus(place,'needs_action');
`;

const SAVE_CANDIDATE = `      const v407SaveCandidate = async (candidate) => {
        const entityId = v407SavedTodoEntity();
        if (!entityId) throw new Error('V407_TODO_MISSING');
        await v407LoadSavedPlaces({force:true});
        const sameCoordinates = (place) =>
          Math.abs(Number(place.latitude) - Number(candidate.latitude)) < 0.00001 &&
          Math.abs(Number(place.longitude) - Number(candidate.longitude)) < 0.00001;
        const duplicate = (Array.isArray(this._v407SavedPlaces) ? this._v407SavedPlaces : []).find(sameCoordinates);
        if (duplicate) return {saved:false,duplicate:true,restored:false,place:duplicate};
        const removedDuplicate = (Array.isArray(this._v407RemovedPlaces) ? this._v407RemovedPlaces : []).find(sameCoordinates);
        if (removedDuplicate) {
          await v407RestoreSavedPlace(removedDuplicate);
          const restored = (Array.isArray(this._v407SavedPlaces) ? this._v407SavedPlaces : []).find(sameCoordinates) || removedDuplicate;
          return {saved:false,duplicate:false,restored:true,place:restored};
        }
        const item = String(candidate.displayLabel || candidate.name || '').trim() || String(candidate.name || 'Location');
        await this._hass.callService('todo','add_item',{
          item,
          description:v407SavedPlaceDescription(candidate)
        },{entity_id:entityId});
        const refreshed = await v407LoadSavedPlaces({force:true});
        return {saved:true,duplicate:false,restored:false,place:refreshed.find(sameCoordinates) || null};
      };
`;

const SAVED_RENDER = `        appendHeader(text.savedPlaces);
        const savedPlaces = Array.isArray(this._v407SavedPlaces) ? this._v407SavedPlaces : [];
        const removedPlaces = Array.isArray(this._v407RemovedPlaces) ? this._v407RemovedPlaces : [];
        const appendSavedRow = (place,{removed=false} = {}) => {
          const row = document.createElement('div');
          row.className = 'location-saved-row' + (removed ? ' removed' : '');
          const labelText = place.summary || place.displayLabel || place.name;
          if (removed) {
            const label = document.createElement('div');
            label.className = 'location-removed-copy';
            const icon = document.createElement('span');
            icon.className = 'location-removed-icon';
            icon.textContent = '○';
            icon.setAttribute('aria-hidden','true');
            const copy = document.createElement('span');
            copy.textContent = labelText;
            label.append(icon,copy);
            const restore = document.createElement('button');
            restore.type = 'button';
            restore.className = 'location-saved-restore';
            restore.dataset.savedPlaceUid = place.uid || '';
            restore.textContent = '↶';
            restore.title = text.restoreSaved;
            restore.setAttribute('aria-label',text.restoreSaved + ': ' + labelText);
            row.append(label,restore);
          } else {
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
            label.textContent = labelText;
            button.append(star,label);
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'location-saved-remove';
            remove.dataset.savedPlaceUid = place.uid || '';
            remove.textContent = '×';
            remove.title = text.removeSaved;
            remove.setAttribute('aria-label',text.removeSaved + ': ' + labelText);
            row.append(button,remove);
          }
          frag.appendChild(row);
        };
        if (savedPlaces.length) savedPlaces.forEach((place) => appendSavedRow(place));
        else {
          const savedEmpty = document.createElement('div');
          savedEmpty.className = 'location-section-empty';
          savedEmpty.textContent = this._v407SavedPlacesMissing ? text.savedSetup : text.savedEmpty;
          frag.appendChild(savedEmpty);
        }
        if (removedPlaces.length) {
          appendHeader(text.removedPlaces);
          removedPlaces.forEach((place) => appendSavedRow(place,{removed:true}));
        }
`;

export function v407SavedPlacesSoftDeleteDelta(source) {
  let text = source;

  text = replaceOnce(text,
    "const GEWITTERRADAR_BUILD = 'V4.07-TEST5-2026-09-13';",
    "const GEWITTERRADAR_BUILD = 'V4.07-TEST6-2026-09-13';");

  text = replaceOnce(text,
    "          .location-saved-copy { min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }",
    "          .location-saved-copy { min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }\n          .location-saved-row { display:grid;grid-template-columns:minmax(0,1fr) 32px;align-items:center;gap:2px;margin:0 4px;border-radius:8px; }\n          .location-saved-row:hover { background:rgba(246,195,68,.045); }\n          .location-saved-row .location-saved-option { padding-left:8px;padding-right:6px; }\n          .location-saved-remove,.location-saved-restore { appearance:none;-webkit-appearance:none;width:30px;height:30px;border:0;border-radius:7px;background:transparent;font:800 18px/1 inherit;cursor:pointer; }\n          .location-saved-remove { color:#b98282; }\n          .location-saved-remove:hover,.location-saved-remove:focus-visible { outline:none;background:rgba(214,91,91,.11);color:#f0a0a0; }\n          .location-saved-restore { color:#7da9ca;font-size:17px; }\n          .location-saved-restore:hover,.location-saved-restore:focus-visible { outline:none;background:rgba(79,163,247,.10);color:#b9dcf6; }\n          .location-saved-row.removed { opacity:.72; }\n          .location-removed-copy { min-width:0;display:flex;align-items:center;gap:9px;padding:7px 8px;color:#8298aa;font:600 10px/1.2 inherit; }\n          .location-removed-copy > span:last-child { min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }\n          .location-removed-icon { color:#60778b;font-size:12px;line-height:1; }");

  text = replaceRangeOnce(text,
    "        appendHeader(text.savedPlaces);",
    "        locationDropdown.replaceChildren(frag);",
    SAVED_RENDER);

  text = replaceOnce(text,
    "savedPlaceFallback:'Gespeicherter Ort',",
    "savedPlaceFallback:'Gespeicherter Ort', removedPlaces:'Entfernte Orte', removeSaved:'Gespeicherten Ort entfernen', restoreSaved:'Ort wiederherstellen', savedRestored:'wurde wiederhergestellt.', removeFailed:'Ort konnte nicht entfernt werden.', restoreFailed:'Ort konnte nicht wiederhergestellt werden.',");
  text = replaceOnce(text,
    "savedPlaceFallback:'Saved place',",
    "savedPlaceFallback:'Saved place', removedPlaces:'Removed places', removeSaved:'Remove saved place', restoreSaved:'Restore place', savedRestored:'was restored.', removeFailed:'Place could not be removed.', restoreFailed:'Place could not be restored.',");

  text = replaceRangeOnce(text,
    "      const v407LoadSavedPlaces = async ({force=false} = {}) => {",
    "      const v407SaveCandidate = async (candidate) => {",
    LOAD_AND_STATUS);
  text = replaceRangeOnce(text,
    "      const v407SaveCandidate = async (candidate) => {",
    "      const v407FocusCandidate = (candidate) => {",
    SAVE_CANDIDATE);

  text = replaceOnce(text,
    "                setStatus(String(candidate.name || candidate.displayLabel || '') + ' ' + (result.duplicate ? text.savedDuplicate : text.savedOk));",
    "                const saveMessage = result.restored ? text.savedRestored : (result.duplicate ? text.savedDuplicate : text.savedOk);\n                setStatus(String(candidate.name || candidate.displayLabel || '') + ' ' + saveMessage);");

  text = replaceOnce(text,
    "        const savedButton = event.target?.closest?.('.location-saved-option');",
    `        const removeSavedButton = event.target?.closest?.('.location-saved-remove');
        if (removeSavedButton) {
          event.preventDefault(); event.stopPropagation();
          const uid = String(removeSavedButton.dataset.savedPlaceUid || '');
          const place = (Array.isArray(this._v407SavedPlaces) ? this._v407SavedPlaces : []).find((item) => String(item.uid || '') === uid);
          if (!place) return;
          removeSavedButton.disabled = true;
          try {
            await v407RemoveSavedPlace(place);
            renderLocationDropdown();
            if (locationDropdownAnchor) positionLocationDropdown(locationDropdownAnchor);
          } catch (error) {
            console.warn('[Gewitterradar V4.07] Gespeicherter Ort konnte nicht entfernt werden.',error);
            removeSavedButton.disabled = false;
          }
          return;
        }
        const restoreSavedButton = event.target?.closest?.('.location-saved-restore');
        if (restoreSavedButton) {
          event.preventDefault(); event.stopPropagation();
          const uid = String(restoreSavedButton.dataset.savedPlaceUid || '');
          const place = (Array.isArray(this._v407RemovedPlaces) ? this._v407RemovedPlaces : []).find((item) => String(item.uid || '') === uid);
          if (!place) return;
          restoreSavedButton.disabled = true;
          try {
            await v407RestoreSavedPlace(place);
            renderLocationDropdown();
            if (locationDropdownAnchor) positionLocationDropdown(locationDropdownAnchor);
          } catch (error) {
            console.warn('[Gewitterradar V4.07] Gespeicherter Ort konnte nicht wiederhergestellt werden.',error);
            restoreSavedButton.disabled = false;
          }
          return;
        }
        const savedButton = event.target?.closest?.('.location-saved-option');`);

  text = replaceOnce(text,
    "Speicherliste einrichten: Einstellungen → Geräte & Dienste → Integration hinzufügen → nach „Local to-do“ suchen und diese Integration auswählen. Als Listenname exakt „Gewitterradar Orte“ vergeben und die Einrichtung abschließen. Danach kann „★ Speichern“ gefundene Orte dauerhaft lokal ablegen; sie erscheinen im Standortmenü unter „Gespeicherte Orte“ und können von dort ohne erneute Ortssuche direkt verwendet werden.",
    "Speicherliste einrichten: Einstellungen → Geräte & Dienste → Integration hinzufügen → nach „Local to-do“ suchen und diese Integration auswählen. Als Listenname exakt „Gewitterradar Orte“ vergeben und die Einrichtung abschließen. Danach kann „★ Speichern“ gefundene Orte dauerhaft lokal ablegen; sie erscheinen im Standortmenü unter „Gespeicherte Orte“ und können von dort ohne erneute Ortssuche direkt verwendet werden. Mit × wird ein gespeicherter Ort weich entfernt: Gewitterradar markiert den zugehörigen To-do-Eintrag nur als erledigt. Unter „Entfernte Orte“ kann er mit ↶ jederzeit wiederhergestellt werden; die gespeicherten Koordinaten und Metadaten bleiben dabei erhalten.");
  text = replaceOnce(text,
    "To set up saving: Settings → Devices & services → Add integration → search for and select 'Local to-do'. Name the list exactly 'Gewitterradar Orte' and finish setup. ★ Save can then store found places locally; they appear under Saved places and can be reused without another geocoding request.",
    "To set up saving: Settings → Devices & services → Add integration → search for and select 'Local to-do'. Name the list exactly 'Gewitterradar Orte' and finish setup. ★ Save can then store found places locally; they appear under Saved places and can be reused without another geocoding request. × performs a soft removal by marking the matching to-do item completed. Under Removed places, ↶ restores it at any time while keeping its saved coordinates and metadata.");

  return text;
}

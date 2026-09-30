# V4.10.01 – Compass Picker Test Candidate

Status: **DEV / first V4.10 iteration**  
Branch: `feature/v4.10.01-compass-picker`  
Base: public **V4.09 FINAL** (`a6a5b68ebc289f04217bc5abb55c46422dce4e4c`)

## Scope

V4.10.01 introduces the first revision of the compass-selection experience without changing compass calculation, accepted instrument geometry, calibration, fullscreen size, or the existing compass persistence backend.

Implemented behavior:

- tapping/clicking the compass opens a dedicated modal picker;
- the live compass instrument itself is displayed in the modal;
- the dialog uses the established “Über Gewitterradar” dark metallic/gold appearance;
- the protected Hi-Res premium close image is reused;
- polished metallic-gold left/right chevrons are placed below the compass;
- navigation wraps cyclically through all existing `COMPASS_DESIGNS`;
- a compact current-position indicator is shown between the chevrons;
- design changes are applied and persisted immediately through the existing `_stepCompassDesign()` / `_persistCompassDesign()` path;
- no additional Apply button is introduced;
- no new visible translation key is required in this first iteration.

## Tap-vs-drag contract

The fullscreen compass remains freely movable with mouse, pen, and touch.

- movement below **6 px**: interpreted as tap → open picker;
- movement from **6 px** onward: interpreted as drag → move and persist fullscreen position;
- `pointercancel` / `touchcancel`: never open the picker.

This threshold applies only to the movable fullscreen instrument path. The normal card compass opens the picker through its click path.

## Manual acceptance matrix

1. **Desktop · normal card**
   - click the compass;
   - picker opens centered;
   - Hi-Res close control is visible;
   - left/right chevrons switch designs immediately;
   - close and reopen: selected design remains active.

2. **Desktop · fullscreen**
   - drag compass more than 6 px: instrument moves, picker does not open;
   - short click/tap without meaningful movement: picker opens;
   - close picker: compass returns to its previous fullscreen position.

3. **Android / HA Companion WebView**
   - touch-drag remains smooth and movable;
   - short tap opens the picker;
   - chevrons are touch-safe;
   - closing restores the compass into the fullscreen overlay.

4. **Design wrap**
   - previous from first design wraps to the last;
   - next from last design wraps to the first;
   - position display matches the active `uiIndex / total`.

5. **Regression**
   - compass needle/readout behavior unchanged;
   - compass calibration unaffected;
   - Medallion drag/toggle behavior unchanged;
   - map controls and location pill remain above/below their existing protected layers as before.

## Deterministic frontend identity

All three product frontend paths must remain byte-identical:

- `frontend/gewitterradar.js`
- `dashboard/dist/gewitterradar.js`
- `custom_components/gewitterradar/frontend/gewitterradar.js`

V4.10.01 current frontend identity:

- bytes: **2,249,312**
- SHA256: `186ce9e48261419fee9e7c0625f35230e5b5c699c0742e2e699db5ec04f54db5`

Automated regression contract: `tests/test_v41001_compass_picker.py`.

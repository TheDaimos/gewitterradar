function once(source, from, to, label) {
  if (source.split(from).length !== 2) throw new Error(`V4.07.37 anchor changed (${label})`);
  return source.replace(from, to);
}

export function v407Test37CoordinateSavePremiumDelta(source, coordinateAssetBase64) {
  if (!coordinateAssetBase64) throw new Error('V4.07.37 coordinate target base64 missing');
  let result = source;

  result = once(
    result,
    "  const CARD_DISPLAY_VERSION = '4.07.36';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST36-2026-09-15';",
    "  const CARD_DISPLAY_VERSION = '4.07.37';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST37-2026-09-15';",
    'version'
  );

  result = once(
    result,
    "  const V407_COORDINATE_TARGET_ICON = new URL('./assets/gewitterradar-coordinate-target.svg?v=40736', import.meta.url).href;",
    `  const V407_COORDINATE_TARGET_ICON = 'data:image/svg+xml;base64,${coordinateAssetBase64}';`,
    'embedded-coordinate-icon'
  );

  result = once(
    result,
    "          .v407-location-mode-switch { display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:0 0 15px;padding:5px;border:1px solid rgba(91,132,166,.25);border-radius:14px;background:linear-gradient(180deg,rgba(7,20,31,.76),rgba(3,11,18,.76));box-shadow:inset 0 1px 0 rgba(255,255,255,.02); }",
    "          .v407-location-mode-switch { display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:0 0 15px;padding:5px;border:1px solid transparent;border-radius:14px;background:linear-gradient(180deg,rgba(7,20,31,.86),rgba(3,11,18,.88)) padding-box,linear-gradient(120deg,rgba(112,79,28,.66),rgba(224,185,101,.58) 24%,rgba(83,142,190,.42) 52%,rgba(213,169,78,.50) 78%,rgba(89,62,20,.62)) border-box;box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 5px 16px rgba(0,0,0,.22),0 0 13px rgba(207,160,69,.055); }",
    'premium-mode-frame'
  );

  const hiddenAnchor = "          .v407-location-coordinate-form[hidden],#v407-location-address-form[hidden]{display:none!important;}";
  result = once(
    result,
    hiddenAnchor,
    hiddenAnchor + "\n          #v407-location-address-form,.v407-location-coordinate-form { position:relative;padding:13px;border:1px solid transparent;border-radius:12px;background:linear-gradient(180deg,rgba(5,16,25,.78),rgba(3,10,17,.86)) padding-box,linear-gradient(135deg,rgba(205,163,79,.48),rgba(78,129,170,.34) 47%,rgba(221,184,104,.43)) border-box;box-shadow:inset 0 1px 0 rgba(255,255,255,.025),inset 0 0 18px rgba(40,83,112,.055),0 6px 18px rgba(0,0,0,.18); }\n          #v407-location-address-form::before,.v407-location-coordinate-form::before { content:'';position:absolute;inset:3px;border:1px solid rgba(238,207,138,.055);border-radius:9px;pointer-events:none; }\n          #v407-location-address-form > *,.v407-location-coordinate-form > * { position:relative;z-index:1; }",
    'premium-input-frame'
  );

  result = once(
    result,
    "          .v407-location-coordinate-grid { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;gap:9px;align-items:end; }",
    "          .v407-location-coordinate-grid { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto auto;gap:9px;align-items:end; }",
    'coordinate-grid-save-column'
  );

  const submitCss = "          .v407-location-search-submit { min-height:42px!important;border-color:rgba(70,153,224,.70)!important;background:linear-gradient(180deg,rgba(31,91,145,.74),rgba(20,62,101,.80))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 3px 10px rgba(0,0,0,.28);font-size:11.5px!important; }";
  result = once(
    result,
    submitCss,
    submitCss + "\n          .v407-location-coordinate-save { border-color:rgba(211,164,74,.72)!important;background:linear-gradient(180deg,rgba(132,95,29,.78),rgba(73,47,13,.88))!important;color:#f5d98c!important;text-shadow:0 1px 0 rgba(0,0,0,.66);box-shadow:inset 0 1px 0 rgba(255,239,189,.12),0 3px 10px rgba(0,0,0,.30),0 0 8px rgba(208,157,60,.08)!important; }\n          .v407-location-coordinate-save:hover,.v407-location-coordinate-save:focus-visible { outline:none;filter:brightness(1.08);border-color:rgba(235,191,96,.86)!important; }",
    'coordinate-save-css'
  );

  result = once(
    result,
    "            .v407-location-coordinate-submit { grid-column:1/-1;width:100%; }",
    "            .v407-location-coordinate-submit,.v407-location-coordinate-save { width:100%; }",
    'coordinate-mobile-buttons'
  );

  result = once(
    result,
    '<button type="submit" class="v407-location-search-submit v407-location-coordinate-submit">${coordinateText.apply}</button>',
    '<button type="submit" class="v407-location-search-submit v407-location-coordinate-submit">${coordinateText.apply}</button><button type="button" class="v407-location-search-submit v407-location-coordinate-save" title="${text.saveTitle}">${text.save}</button>',
    'coordinate-save-markup'
  );

  result = once(
    result,
    "        const coordinateLongitude = backdrop.querySelector('#v407-coordinate-longitude');",
    "        const coordinateLongitude = backdrop.querySelector('#v407-coordinate-longitude');\n        const coordinateSave = backdrop.querySelector('.v407-location-coordinate-save');",
    'coordinate-save-selector'
  );

  const oldHandler = `        coordinateForm.addEventListener('submit',async (event) => {
          event.preventDefault();
          const latitude=v407CoordinateNumber(coordinateLatitude.value),longitude=v407CoordinateNumber(coordinateLongitude.value);
          if(!Number.isFinite(latitude)||latitude<-90||latitude>90||!Number.isFinite(longitude)||longitude<-180||longitude>180){setStatus(coordinateText.invalid,true);(!Number.isFinite(latitude)||latitude<-90||latitude>90?coordinateLatitude:coordinateLongitude).focus({preventScroll:true});return;}
          const fallback=latitude.toFixed(6)+', '+longitude.toFixed(6);const label=String(coordinateName.value||'').trim();
          const candidate={provider:'Lat / Lon',name:label||fallback,displayLabel:label||fallback,latitude,longitude,countryCode:'',country:'',admin1:'',postcode:'',postcodes:[]};
          const apply=coordinateForm.querySelector('.v407-location-coordinate-submit');apply.disabled=true;setStatus(text.using);
          try { const ok=await v407UseCandidate(candidate);if(!ok)throw new Error(text.backendMissing);close();v407FocusCandidate(candidate); }
          catch(error){console.warn('[Gewitterradar V4.07] Koordinaten konnten nicht als Bezugsstandort gesetzt werden.',error);setStatus(error?.message===text.backendMissing?text.backendMissing:text.useFailed,true);}
          finally { apply.disabled=false; }
        });`;

  const newHandler = `        const v407CoordinateCandidate = () => {
          const latitude=v407CoordinateNumber(coordinateLatitude.value),longitude=v407CoordinateNumber(coordinateLongitude.value);
          if(!Number.isFinite(latitude)||latitude<-90||latitude>90||!Number.isFinite(longitude)||longitude<-180||longitude>180){setStatus(coordinateText.invalid,true);(!Number.isFinite(latitude)||latitude<-90||latitude>90?coordinateLatitude:coordinateLongitude).focus({preventScroll:true});return null;}
          const fallback=latitude.toFixed(6)+', '+longitude.toFixed(6);const label=String(coordinateName.value||'').trim();
          return {provider:'Lat / Lon',name:label||fallback,displayLabel:label||fallback,latitude,longitude,countryCode:'',country:'',admin1:'',postcode:'',postcodes:[]};
        };
        const v407ResetCoordinateSave = () => { if (!coordinateSave.disabled) coordinateSave.textContent=text.save; };
        coordinateName.addEventListener('input',v407ResetCoordinateSave);coordinateLatitude.addEventListener('input',v407ResetCoordinateSave);coordinateLongitude.addEventListener('input',v407ResetCoordinateSave);
        coordinateSave.addEventListener('click',async () => {
          const candidate=v407CoordinateCandidate();if(!candidate)return;
          coordinateSave.disabled=true;setStatus(text.saving);
          try {
            const result=await v407SaveCandidate(candidate);
            coordinateSave.textContent=text.saved;
            const saveMessage=result.restored?text.savedRestored:(result.duplicate?text.savedDuplicate:text.savedOk);
            setStatus(String(candidate.name||candidate.displayLabel||'')+' '+saveMessage);
          } catch(error) {
            console.warn('[Gewitterradar V4.07] Koordinaten konnten nicht gespeichert werden.',error);
            setStatus(error?.message==='V407_TODO_MISSING'?text.savedSetup:text.saveFailed,true);
            coordinateSave.textContent=text.save;
          } finally { coordinateSave.disabled=false; }
        });
        coordinateForm.addEventListener('submit',async (event) => {
          event.preventDefault();
          const candidate=v407CoordinateCandidate();if(!candidate)return;
          const apply=coordinateForm.querySelector('.v407-location-coordinate-submit');apply.disabled=true;setStatus(text.using);
          try { const ok=await v407UseCandidate(candidate);if(!ok)throw new Error(text.backendMissing);close();v407FocusCandidate(candidate); }
          catch(error){console.warn('[Gewitterradar V4.07] Koordinaten konnten nicht als Bezugsstandort gesetzt werden.',error);setStatus(error?.message===text.backendMissing?text.backendMissing:text.useFailed,true);}
          finally { apply.disabled=false; }
        });`;
  result = once(result, oldHandler, newHandler, 'coordinate-save-handler');

  return result;
}

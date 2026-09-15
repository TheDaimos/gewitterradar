import {buildV407CoordinateTexts} from './v4-07-test36-coordinate-texts.mjs';

function once(source,from,to,label){
  if(source.split(from).length!==2) throw new Error(`V4.07.36 anchor changed (${label})`);
  return source.replace(from,to);
}
function replaceBetween(source,startAnchor,endAnchor,replacement,label){
  const start=source.indexOf(startAnchor); if(start<0) throw new Error(`V4.07.36 start anchor changed (${label})`);
  const end=source.indexOf(endAnchor,start); if(end<0) throw new Error(`V4.07.36 end anchor changed (${label})`);
  if(source.indexOf(startAnchor,start+1)>=0) throw new Error(`V4.07.36 start anchor duplicated (${label})`);
  return source.slice(0,start)+replacement+source.slice(end);
}

export function v407Test36CoordinateInputDelta(source){
  let result=source;
  result=once(result,
    "  const CARD_DISPLAY_VERSION = '4.07.35';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST35-2026-09-15';",
    "  const CARD_DISPLAY_VERSION = '4.07.36';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST36-2026-09-15';",'version');
  const copyAsset="  const ABOUT_COPY_IMAGE = new URL('./assets/gewitterradar-about-copy-scroll.webp', import.meta.url).href;";
  result=once(result,copyAsset,copyAsset+"\n  const V407_COORDINATE_TARGET_ICON = new URL('./assets/gewitterradar-coordinate-target.svg?v=40736', import.meta.url).href;\n  const V407_COORDINATE_TEXTS = Object.freeze("+JSON.stringify(buildV407CoordinateTexts())+");",'coordinate-globals');

  const searchGrid='          .v407-location-search-grid { display:grid;grid-template-columns:minmax(0,1fr) minmax(170px,.55fr) auto;gap:9px;align-items:end; }';
  const modeCss=[
    '          /* V4.07.36 – approved premium two-mode location dialog. */',
    '          .v407-location-search-dialog { width:min(760px,calc(100vw - 24px));border-color:rgba(95,143,182,.38);border-radius:18px;background:radial-gradient(circle at 12% 0,rgba(31,64,88,.26),transparent 38%),linear-gradient(180deg,rgba(11,24,35,.992),rgba(5,14,22,.997));box-shadow:0 30px 95px rgba(0,0,0,.76),0 0 42px rgba(67,157,231,.08),inset 0 1px 0 rgba(255,255,255,.025); }',
    '          .v407-location-search-head { position:relative;display:grid;grid-template-columns:48px minmax(0,1fr) 40px;align-items:center;gap:13px;padding:17px 18px 15px;border-bottom:1px solid rgba(100,145,180,.20); }',
    '          .v407-location-search-emblem { width:42px;height:42px;border:1.5px solid #d5ad5e;border-radius:50%;position:relative;box-sizing:border-box;background:radial-gradient(circle at 38% 32%,rgba(86,157,205,.38),rgba(13,43,64,.68) 48%,rgba(3,14,23,.95) 74%);box-shadow:0 0 0 2px rgba(179,133,52,.13),0 4px 12px rgba(0,0,0,.48),inset 0 0 10px rgba(213,173,94,.14); }',
    "          .v407-location-search-emblem:before { content:'';position:absolute;left:10px;right:10px;top:5px;bottom:5px;border:1px solid rgba(229,198,131,.82);border-radius:50%; }",
    "          .v407-location-search-emblem:after { content:'';position:absolute;left:5px;right:5px;top:19px;height:1px;background:rgba(229,198,131,.78);box-shadow:0 -8px rgba(229,198,131,.34),0 8px rgba(229,198,131,.34); }",
    '          .v407-location-search-head-copy { min-width:0; }',
    '          .v407-location-search-head-copy strong { display:block;color:#f1f4f7;font-size:18px;line-height:1.12;font-weight:760;letter-spacing:.005em;text-shadow:0 1px 2px rgba(0,0,0,.65); }',
    '          .v407-location-search-subtitle { margin-top:4px;color:#a7b7c9;font-size:11px;line-height:1.35; }',
    '          .v407-location-search-close { width:36px;height:36px;display:grid;place-items:center;padding:0!important;border:0!important;border-radius:50%;background:transparent!important;justify-self:end;overflow:visible; }',
    '          .v407-location-search-close img { width:36px;height:36px;display:block;object-fit:contain;filter:drop-shadow(0 3px 5px rgba(0,0,0,.55)); }',
    '          .v407-location-search-close:hover,.v407-location-search-close:focus-visible { outline:none;filter:brightness(1.08); }',
    '          .v407-location-search-body { padding:14px 18px 17px; }',
    '          .v407-location-mode-switch { display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:0 0 15px;padding:5px;border:1px solid rgba(91,132,166,.25);border-radius:14px;background:linear-gradient(180deg,rgba(7,20,31,.76),rgba(3,11,18,.76));box-shadow:inset 0 1px 0 rgba(255,255,255,.02); }',
    '          .v407-location-mode { appearance:none;-webkit-appearance:none;min-height:46px;border:1px solid transparent;border-radius:10px;background:transparent;color:#d7e0e8;display:flex;align-items:center;justify-content:center;gap:10px;padding:8px 12px;font:760 12px/1.1 inherit;cursor:pointer;transition:border-color .15s ease,background .15s ease,color .15s ease,box-shadow .15s ease,filter .15s ease; }',
    '          .v407-location-mode[aria-pressed="true"] { border-color:#4ba8f3;background:linear-gradient(180deg,rgba(30,86,132,.46),rgba(16,52,82,.40));color:#f2f7fb;box-shadow:0 0 0 1px rgba(75,168,243,.20),0 0 14px rgba(51,146,222,.22),inset 0 1px 0 rgba(255,255,255,.06); }',
    '          .v407-location-mode:hover,.v407-location-mode:focus-visible { outline:none;border-color:rgba(75,168,243,.65);color:#f3f8fc; }',
    '          .v407-location-mode-icon { width:25px;height:25px;flex:0 0 25px;display:grid;place-items:center;position:relative; }',
    "          .v407-location-mode-search-icon::before { content:'';width:12px;height:12px;border:2px solid #e4bf73;border-radius:50%;box-shadow:0 0 5px rgba(227,184,99,.22),inset 0 0 3px rgba(255,238,184,.14); }",
    "          .v407-location-mode-search-icon::after { content:'';position:absolute;width:8px;height:2px;border-radius:2px;background:linear-gradient(90deg,#f0d08a,#bd8d3a);transform:translate(7px,7px) rotate(45deg);transform-origin:center;box-shadow:0 1px 2px rgba(0,0,0,.45); }",
    '          .v407-location-mode-target img { width:27px;height:27px;display:block;object-fit:contain;filter:drop-shadow(0 2px 3px rgba(0,0,0,.52)); }',
    '          .v407-location-coordinate-form[hidden],#v407-location-address-form[hidden]{display:none!important;}',
    '          .v407-location-coordinate-grid { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;gap:9px;align-items:end; }',
    '          .v407-location-coordinate-name { grid-column:1/-1; }',
    '          .v407-location-coordinate-hint { margin:8px 0 0;color:#7e93a7;font-size:9px;line-height:1.4; }',
    '          .v407-location-search-field label { color:#b2c2d4!important;font-size:9.5px!important;letter-spacing:.08em!important; }',
    '          .v407-location-search-field input { min-height:42px!important;border-color:rgba(90,132,168,.40)!important;border-radius:9px!important;background:linear-gradient(180deg,rgba(5,15,24,.94),rgba(3,10,17,.94))!important;box-shadow:inset 0 1px 6px rgba(0,0,0,.38)!important; }',
    '          .v407-location-search-field input:focus { border-color:rgba(75,168,243,.78)!important;box-shadow:0 0 0 2px rgba(75,168,243,.10),inset 0 1px 6px rgba(0,0,0,.36)!important; }',
    '          .v407-location-search-submit { min-height:42px!important;border-color:rgba(70,153,224,.70)!important;background:linear-gradient(180deg,rgba(31,91,145,.74),rgba(20,62,101,.80))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 3px 10px rgba(0,0,0,.28);font-size:11.5px!important; }',
    '          .v407-location-search-divider { height:1px;margin:14px 0 12px;background:linear-gradient(90deg,transparent,rgba(108,149,181,.26),transparent); }',
    '          .v407-location-search-dialog .v407-location-safety-note { display:grid;grid-template-columns:38px minmax(0,1fr);align-items:center;gap:10px;margin-top:0;padding:10px 12px;border:1px solid rgba(91,132,166,.30);border-radius:10px;background:linear-gradient(120deg,rgba(16,38,54,.60),rgba(6,18,28,.66));color:#c8d2dc;font-size:9.7px;line-height:1.42; }',
    '          .v407-location-safety-medallion,.v407-location-advice-medallion { width:31px;height:31px;border:1.4px solid #d8ad58;border-radius:50%;display:grid;place-items:center;color:#f4d384;background:radial-gradient(circle at 35% 30%,rgba(208,165,78,.18),rgba(15,23,28,.90) 68%);box-shadow:0 2px 6px rgba(0,0,0,.40),0 0 6px rgba(207,160,69,.12),inset 0 0 0 2px rgba(235,196,116,.05); }',
    '          .v407-location-safety-pin { width:9px;height:12px;border:2px solid #efd17f;border-radius:9px;position:relative;box-sizing:border-box;transform:translateY(-1px); }',
    "          .v407-location-safety-pin:before { content:'';position:absolute;width:2.5px;height:2.5px;border-radius:50%;background:#efd17f;left:1.3px;top:2.2px; }",
    "          .v407-location-safety-pin:after { content:'';position:absolute;width:5px;height:5px;border-right:2px solid #efd17f;border-bottom:2px solid #efd17f;left:.2px;bottom:-5px;transform:rotate(45deg);border-radius:0 0 2px 0; }",
    '          .v407-location-advice { display:grid;grid-template-columns:38px minmax(0,1fr);align-items:start;gap:10px;margin-top:11px;padding:11px 12px;border:1px solid rgba(159,122,57,.35);border-radius:10px;background:linear-gradient(120deg,rgba(43,32,17,.34),rgba(7,15,20,.72));color:#cdd4db; }',
    '          .v407-location-advice-medallion { font:800 17px/1 Georgia,serif; }',
    '          .v407-location-advice-copy strong { display:block;margin:1px 0 4px;color:#f0cd78;font-size:11.3px; }',
    '          .v407-location-advice-copy p { margin:0;color:#c3cbd3;font-size:9.8px;line-height:1.45; }',
    '          .v407-location-advice-copy a { color:#71baf0;font-weight:700;text-decoration:none;border-bottom:1px solid rgba(113,186,240,.40); }',
    '          .v407-location-advice-copy a:hover,.v407-location-advice-copy a:focus-visible { outline:none;color:#a8d8fa;border-bottom-color:#a8d8fa; }',
    '          .v407-location-search-dialog .v407-location-provider-note { margin-top:5px;color:#63788b;font-size:8.2px;line-height:1.35; }'
  ].join('\n')+'\n'+searchGrid;
  result=once(result,searchGrid,modeCss,'coordinate-mode-css');
  const responsive='            .v407-location-search-grid { grid-template-columns:1fr; }';
  result=once(result,responsive,responsive+'\n            .v407-location-coordinate-grid { grid-template-columns:1fr 1fr; }\n            .v407-location-coordinate-submit { grid-column:1/-1;width:100%; }\n            .v407-location-search-dialog { width:min(760px,calc(100vw - 14px)); }\n            .v407-location-search-head { grid-template-columns:40px minmax(0,1fr) 36px;gap:10px;padding:14px 12px 12px; }\n            .v407-location-search-emblem { width:36px;height:36px; }\n            .v407-location-search-emblem:before { left:8px;right:8px;top:4px;bottom:4px; }\n            .v407-location-search-emblem:after { left:4px;right:4px;top:16.5px;box-shadow:0 -7px rgba(229,198,131,.34),0 7px rgba(229,198,131,.34); }\n            .v407-location-search-head-copy strong { font-size:15px; }\n            .v407-location-search-subtitle { font-size:9.5px; }\n            .v407-location-search-body { padding:12px; }\n            .v407-location-mode { min-height:44px;padding:7px 8px; }','coordinate-responsive');

  const markup=[
    "        const coordinateText = V407_COORDINATE_TEXTS[this._languageValue()] || V407_COORDINATE_TEXTS.English;",
    '        backdrop.innerHTML = `<section class="v407-location-search-dialog" role="dialog" aria-modal="true" aria-labelledby="v407-location-search-title">',
    '          <header class="v407-location-search-head"><span class="v407-location-search-emblem" aria-hidden="true"></span><div class="v407-location-search-head-copy"><strong id="v407-location-search-title"></strong><div class="v407-location-search-subtitle">${coordinateText.subtitle}</div></div><button type="button" class="v407-location-search-close" aria-label="${text.close}"><img src="${ABOUT_CLOSE_IMAGE}" alt="" draggable="false"></button></header>',
    '          <div class="v407-location-search-body"><div class="v407-location-mode-switch" role="group" aria-label="${text.title}"><button type="button" class="v407-location-mode v407-location-mode-address" aria-pressed="true"><span class="v407-location-mode-icon v407-location-mode-search-icon" aria-hidden="true"></span><span>${text.query}</span></button><button type="button" class="v407-location-mode v407-location-mode-coordinates" aria-pressed="false"><span class="v407-location-mode-icon v407-location-mode-target" aria-hidden="true"><img src="${V407_COORDINATE_TARGET_ICON}" alt="" draggable="false"></span><span>Lat / Lon</span></button></div><form id="v407-location-address-form" class="v407-location-search-grid">',
    '            <div class="v407-location-search-field"><label for="v407-location-query"></label><input id="v407-location-query" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" spellcheck="false"><button type="button" class="v407-location-query-clear" aria-label="${v407ClearQueryLabel()}" title="${v407ClearQueryLabel()}" aria-hidden="true" tabindex="-1">×</button></div>',
    '            <div class="v407-location-search-field"><label for="v407-location-country"></label><input id="v407-location-country" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" spellcheck="false"><button type="button" class="v407-location-country-clear" aria-label="${v407ClearQueryLabel()}" title="${v407ClearQueryLabel()}" aria-hidden="true" tabindex="-1">×</button><div class="v407-country-suggestions"></div></div>',
    '            <button type="submit" class="v407-location-search-submit"></button>',
    '          </form><form class="v407-location-coordinate-form" hidden><div class="v407-location-coordinate-grid"><div class="v407-location-search-field v407-location-coordinate-name"><label for="v407-coordinate-name">${coordinateText.label}</label><input id="v407-coordinate-name" type="text" autocomplete="off" placeholder="${coordinateText.labelPlaceholder}"></div><div class="v407-location-search-field"><label for="v407-coordinate-latitude">${coordinateText.latitude}</label><input id="v407-coordinate-latitude" type="text" inputmode="decimal" autocomplete="off" placeholder="53.83642"></div><div class="v407-location-search-field"><label for="v407-coordinate-longitude">${coordinateText.longitude}</label><input id="v407-coordinate-longitude" type="text" inputmode="decimal" autocomplete="off" placeholder="9.95817"></div><button type="submit" class="v407-location-search-submit v407-location-coordinate-submit">${coordinateText.apply}</button></div><div class="v407-location-coordinate-hint">${coordinateText.hint}</div></form><div class="v407-location-search-status" role="status" aria-live="polite"></div><div class="v407-location-results"></div>',
    '          <div class="v407-location-search-divider" aria-hidden="true"></div><div class="v407-location-safety-note"><span class="v407-location-safety-medallion" aria-hidden="true"><i class="v407-location-safety-pin"></i></span><span class="v407-location-safety-copy"></span></div><div class="v407-location-advice"><span class="v407-location-advice-medallion" aria-hidden="true">i</span><div class="v407-location-advice-copy"><strong>${coordinateText.adviceTitle}</strong><p>${coordinateText.helpBefore}<a href="https://www.maptiler.com/tools/coordinates/" target="_blank" rel="noopener noreferrer">MapTiler Coordinates ↗</a>${coordinateText.helpAfter}</p><div class="v407-location-provider-note"></div></div></div></div></section>`;',''
  ].join('\n');
  result=replaceBetween(result,'        backdrop.innerHTML = `<section class="v407-location-search-dialog"','        this.shadow.appendChild(backdrop);',markup,'coordinate-dialog');

  const selectors=[
    "        const dialog = backdrop.querySelector('.v407-location-search-dialog');",
    "        const queryInput = backdrop.querySelector('#v407-location-query');",
    "        const clearQueryButton = backdrop.querySelector('.v407-location-query-clear');",
    "        const countryInput = backdrop.querySelector('#v407-location-country');",
    "        const clearCountryButton = backdrop.querySelector('.v407-location-country-clear');",
    "        const suggestions = backdrop.querySelector('.v407-country-suggestions');",
    "        const form = backdrop.querySelector('#v407-location-address-form');",
    "        const coordinateForm = backdrop.querySelector('.v407-location-coordinate-form');",
    "        const submit = form.querySelector('.v407-location-search-submit');",
    "        const coordinateName = backdrop.querySelector('#v407-coordinate-name');",
    "        const coordinateLatitude = backdrop.querySelector('#v407-coordinate-latitude');",
    "        const coordinateLongitude = backdrop.querySelector('#v407-coordinate-longitude');",
    "        const modeAddress = backdrop.querySelector('.v407-location-mode-address');",
    "        const modeCoordinates = backdrop.querySelector('.v407-location-mode-coordinates');",
    "        const providerNote = backdrop.querySelector('.v407-location-provider-note');",
    "        const status = backdrop.querySelector('.v407-location-search-status');",
    "        const results = backdrop.querySelector('.v407-location-results');",
    '        const records = v407CountryRecords();',
    "        backdrop.querySelector('#v407-location-search-title').textContent = text.title;",
    '        queryInput.previousElementSibling.textContent = text.query; queryInput.placeholder = text.queryPlaceholder;',
    '        countryInput.previousElementSibling.textContent = text.country; countryInput.placeholder = text.countryPlaceholder;',
    "        submit.textContent = text.search; providerNote.textContent = text.providerNote; backdrop.querySelector('.v407-location-safety-copy').textContent = text.safety;",''
  ].join('\n');
  result=replaceBetween(result,"        const dialog = backdrop.querySelector('.v407-location-search-dialog');",'        const close = () =>',selectors,'coordinate-selectors');

  const setStatus="        const setStatus = (message,error=false) => { status.textContent=message || ''; status.classList.toggle('error',!!error); };";
  const coordinateLogic=[
    setStatus,
    '        const v407CoordinateNumber = (value) => {',
    "          const normalized=String(value??'').trim().replace(/\\s+/g,'').replace(',','.');",
    '          if(!/^[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)$/.test(normalized)) return NaN;',
    '          return Number(normalized);','        };',
    '        const v407CoordinatePair = (value) => {',
    "          const source=String(value??'').trim(); let match=null;",
    '          match=source.match(/^\\s*([+-]?\\d{1,2}(?:\\.\\d+)?)\\s*,\\s*([+-]?\\d{1,3}(?:\\.\\d+)?)\\s*$/);',
    '          if(!match) match=source.match(/^\\s*([+-]?\\d{1,2}(?:[.,]\\d+)?)\\s*[;\\/]\\s*([+-]?\\d{1,3}(?:[.,]\\d+)?)\\s*$/);',
    '          if(!match) match=source.match(/^\\s*([+-]?\\d{1,2}(?:[.,]\\d+)?)\\s+([+-]?\\d{1,3}(?:[.,]\\d+)?)\\s*$/);',
    '          if(!match) return null;',
    '          const latitude=v407CoordinateNumber(match[1]),longitude=v407CoordinateNumber(match[2]);',
    '          return Number.isFinite(latitude)&&Number.isFinite(longitude)&&latitude>=-90&&latitude<=90&&longitude>=-180&&longitude<=180?{latitude,longitude}:null;','        };',
    '        const setSearchMode = (mode,{focus=true}={}) => {',
    "          const coordinates=mode==='coordinates';",
    '          form.hidden=coordinates;coordinateForm.hidden=!coordinates;',
    "          modeAddress.setAttribute('aria-pressed',String(!coordinates));modeCoordinates.setAttribute('aria-pressed',String(coordinates));",
    '          providerNote.textContent=text.providerNote;',
    "          suggestions.classList.remove('open');results.replaceChildren();setStatus('');",
    '          if(focus)(coordinates?coordinateName:queryInput).focus({preventScroll:true});','        };',
    "        modeAddress.addEventListener('click',()=>setSearchMode('address'));",
    "        modeCoordinates.addEventListener('click',()=>setSearchMode('coordinates'));",
    "        const pasteCoordinatePair=(event)=>{const pair=v407CoordinatePair(event.clipboardData?.getData('text')||'');if(!pair)return;event.preventDefault();coordinateLatitude.value=String(pair.latitude);coordinateLongitude.value=String(pair.longitude);};",
    "        coordinateLatitude.addEventListener('paste',pasteCoordinatePair);coordinateLongitude.addEventListener('paste',pasteCoordinatePair);",
    "        setSearchMode('address',{focus:false});"
  ].join('\n');
  result=once(result,setStatus,coordinateLogic,'coordinate-parser-mode');

  const addressSubmit="        form.addEventListener('submit',async (event) => {";
  const coordinateSubmit=[
    "        coordinateForm.addEventListener('submit',async (event) => {",
    '          event.preventDefault();',
    '          const latitude=v407CoordinateNumber(coordinateLatitude.value),longitude=v407CoordinateNumber(coordinateLongitude.value);',
    '          if(!Number.isFinite(latitude)||latitude<-90||latitude>90||!Number.isFinite(longitude)||longitude<-180||longitude>180){setStatus(coordinateText.invalid,true);(!Number.isFinite(latitude)||latitude<-90||latitude>90?coordinateLatitude:coordinateLongitude).focus({preventScroll:true});return;}',
    "          const fallback=latitude.toFixed(6)+', '+longitude.toFixed(6);const label=String(coordinateName.value||'').trim();",
    "          const candidate={provider:'Lat / Lon',name:label||fallback,displayLabel:label||fallback,latitude,longitude,countryCode:'',country:'',admin1:'',postcode:'',postcodes:[]};",
    "          const apply=coordinateForm.querySelector('.v407-location-coordinate-submit');apply.disabled=true;setStatus(text.using);",
    '          try { const ok=await v407UseCandidate(candidate);if(!ok)throw new Error(text.backendMissing);close();v407FocusCandidate(candidate); }',
    "          catch(error){console.warn('[Gewitterradar V4.07] Koordinaten konnten nicht als Bezugsstandort gesetzt werden.',error);setStatus(error?.message===text.backendMissing?text.backendMissing:text.useFailed,true);}",
    '          finally { apply.disabled=false; }',
    '        });',addressSubmit
  ].join('\n');
  result=once(result,addressSubmit,coordinateSubmit,'coordinate-submit');

  return result;
}

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
    '          .v407-location-mode-switch { display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:0 0 13px;padding:4px;border:1px solid rgba(111,163,214,.16);border-radius:12px;background:rgba(3,9,16,.52); }',
    '          .v407-location-mode { appearance:none;-webkit-appearance:none;min-height:42px;border:1px solid transparent;border-radius:9px;background:transparent;color:#9eb3c7;display:flex;align-items:center;justify-content:center;gap:9px;padding:7px 12px;font:750 11px/1.1 inherit;cursor:pointer;transition:border-color .15s ease,background .15s ease,color .15s ease,box-shadow .15s ease; }',
    '          .v407-location-mode[aria-pressed="true"] { border-color:rgba(79,163,247,.48);background:linear-gradient(180deg,rgba(38,107,167,.30),rgba(24,71,111,.23));color:#eef8ff;box-shadow:inset 0 1px rgba(255,255,255,.05),0 0 0 1px rgba(79,163,247,.05); }',
    '          .v407-location-mode:hover,.v407-location-mode:focus-visible { outline:none;border-color:rgba(79,163,247,.38);color:#e8f5ff; }',
    '          .v407-location-mode-icon { width:21px;height:21px;flex:0 0 21px;display:grid;place-items:center;position:relative; }',
    "          .v407-location-mode-search-icon::before { content:'';width:10px;height:10px;border:2px solid #a9cce9;border-radius:50%;box-shadow:0 0 4px rgba(95,176,238,.18); }",
    "          .v407-location-mode-search-icon::after { content:'';position:absolute;width:7px;height:2px;border-radius:2px;background:#a9cce9;transform:translate(6px,6px) rotate(45deg);transform-origin:center; }",
    '          .v407-location-mode-target img { width:23px;height:23px;display:block;object-fit:contain;filter:drop-shadow(0 1px 2px rgba(0,0,0,.55)); }',
    '          .v407-location-coordinate-form[hidden],#v407-location-address-form[hidden]{display:none!important;}',
    '          .v407-location-coordinate-grid { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;gap:9px;align-items:end; }',
    '          .v407-location-coordinate-name { grid-column:1/-1; }',
    '          .v407-location-coordinate-hint { margin:8px 0 0;color:#748ba0;font-size:9px;line-height:1.4; }'
  ].join('\n')+'\n'+searchGrid;
  result=once(result,searchGrid,modeCss,'coordinate-mode-css');
  const responsive='            .v407-location-search-grid { grid-template-columns:1fr; }';
  result=once(result,responsive,responsive+'\n            .v407-location-coordinate-grid { grid-template-columns:1fr 1fr; }\n            .v407-location-coordinate-submit { grid-column:1/-1;width:100%; }','coordinate-responsive');

  const markup=[
    "        const coordinateText = V407_COORDINATE_TEXTS[this._languageValue()] || V407_COORDINATE_TEXTS.English;",
    '        backdrop.innerHTML = `<section class="v407-location-search-dialog" role="dialog" aria-modal="true" aria-labelledby="v407-location-search-title">',
    '          <header class="v407-location-search-head"><strong id="v407-location-search-title"></strong><button type="button" class="v407-location-search-close" aria-label="${text.close}">×</button></header>',
    '          <div class="v407-location-search-body"><div class="v407-location-mode-switch" role="group" aria-label="${text.title}"><button type="button" class="v407-location-mode v407-location-mode-address" aria-pressed="true"><span class="v407-location-mode-icon v407-location-mode-search-icon" aria-hidden="true"></span><span>${text.query}</span></button><button type="button" class="v407-location-mode v407-location-mode-coordinates" aria-pressed="false"><span class="v407-location-mode-icon v407-location-mode-target" aria-hidden="true"><img src="${V407_COORDINATE_TARGET_ICON}" alt="" draggable="false"></span><span>Lat / Lon</span></button></div><form id="v407-location-address-form" class="v407-location-search-grid">',
    '            <div class="v407-location-search-field"><label for="v407-location-query"></label><input id="v407-location-query" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" spellcheck="false"><button type="button" class="v407-location-query-clear" aria-label="${v407ClearQueryLabel()}" title="${v407ClearQueryLabel()}" aria-hidden="true" tabindex="-1">×</button></div>',
    '            <div class="v407-location-search-field"><label for="v407-location-country"></label><input id="v407-location-country" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" spellcheck="false"><button type="button" class="v407-location-country-clear" aria-label="${v407ClearQueryLabel()}" title="${v407ClearQueryLabel()}" aria-hidden="true" tabindex="-1">×</button><div class="v407-country-suggestions"></div></div>',
    '            <button type="submit" class="v407-location-search-submit"></button>',
    '          </form><form class="v407-location-coordinate-form" hidden><div class="v407-location-coordinate-grid"><div class="v407-location-search-field v407-location-coordinate-name"><label for="v407-coordinate-name">${coordinateText.label}</label><input id="v407-coordinate-name" type="text" autocomplete="off" placeholder="${coordinateText.labelPlaceholder}"></div><div class="v407-location-search-field"><label for="v407-coordinate-latitude">${coordinateText.latitude}</label><input id="v407-coordinate-latitude" type="text" inputmode="decimal" autocomplete="off" placeholder="53.83642"></div><div class="v407-location-search-field"><label for="v407-coordinate-longitude">${coordinateText.longitude}</label><input id="v407-coordinate-longitude" type="text" inputmode="decimal" autocomplete="off" placeholder="9.95817"></div><button type="submit" class="v407-location-search-submit v407-location-coordinate-submit">${coordinateText.apply}</button></div><div class="v407-location-coordinate-hint">${coordinateText.hint}</div></form><div class="v407-location-search-status" role="status" aria-live="polite"></div><div class="v407-location-results"></div>',
    '          <div class="v407-location-provider-note"></div><div class="v407-location-safety-note"></div></div></section>`;',''
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
    "        submit.textContent = text.search; providerNote.textContent = text.providerNote; backdrop.querySelector('.v407-location-safety-note').textContent = text.safety;",''
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
    '          providerNote.textContent=coordinates?coordinateText.hint:text.providerNote;',
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
    "        coordinateForm.addEventListener('submit',(event) => {",
    '          event.preventDefault();',
    '          const latitude=v407CoordinateNumber(coordinateLatitude.value),longitude=v407CoordinateNumber(coordinateLongitude.value);',
    '          if(!Number.isFinite(latitude)||latitude<-90||latitude>90||!Number.isFinite(longitude)||longitude<-180||longitude>180){setStatus(coordinateText.invalid,true);(!Number.isFinite(latitude)||latitude<-90||latitude>90?coordinateLatitude:coordinateLongitude).focus({preventScroll:true});return;}',
    "          const fallback=latitude.toFixed(6)+', '+longitude.toFixed(6);const label=String(coordinateName.value||'').trim();",
    "          const candidate={provider:'Lat / Lon',name:label||fallback,displayLabel:label||fallback,latitude,longitude,countryCode:'',country:'',admin1:'',postcode:'',postcodes:[]};",
    "          v407ActiveResultCountry='';renderResults([candidate],{preferredCountryCode:'',countryCode:''});",
    "          const row=results.querySelector('.v407-location-result');if(row)results.replaceChildren(row);setStatus('');",
    '        });',addressSubmit
  ].join('\n');
  result=once(result,addressSubmit,coordinateSubmit,'coordinate-submit');

  const helpAnchor='.help-section-body li{margin:6px 0}.help-note{padding:9px 11px;border-left:2px solid #c69d50;background:#050d127a;color:#d9caa9}.help-entries{margin:8px 0 0}';
  const helpCss='.help-section-body li{margin:6px 0}.help-note{padding:9px 11px;border-left:2px solid #c69d50;background:#050d127a;color:#d9caa9}.help-coordinate-guide{display:grid;grid-template-columns:38px minmax(0,1fr);gap:10px;align-items:start;margin:12px 0 0;padding:10px 11px;border:1px solid rgba(101,153,199,.22);border-radius:8px;background:linear-gradient(120deg,rgba(21,44,60,.52),rgba(5,13,18,.68))}.help-coordinate-guide img{width:34px;height:34px;object-fit:contain;filter:drop-shadow(0 2px 3px rgba(0,0,0,.55))}.help-coordinate-guide strong{display:block;color:#efd18c;margin-bottom:3px}.help-coordinate-guide p{margin:0!important;color:#cbd1d7}.help-coordinate-guide a{color:#8dcaf8;font-weight:700;text-decoration:none;border-bottom:1px solid rgba(141,202,248,.34)}.help-coordinate-guide a:hover,.help-coordinate-guide a:focus-visible{color:#b8ddfa;border-bottom-color:#b8ddfa;outline:none}.help-entries{margin:8px 0 0}';
  result=once(result,helpAnchor,helpCss,'coordinate-help-css');
  const recorder="          if(section.recorder){const wrap=document.createElement('div');wrap.className='help-code-wrap';";
  const guide="          if(section.key==='location'){const coordinateText=V407_COORDINATE_TEXTS[this._languageValue()]||V407_COORDINATE_TEXTS.English;const guide=document.createElement('div');guide.className='help-coordinate-guide';const image=document.createElement('img');image.src=V407_COORDINATE_TARGET_ICON;image.alt='';image.draggable=false;const copy=document.createElement('div'),heading=document.createElement('strong'),paragraph=document.createElement('p'),link=document.createElement('a');heading.textContent=coordinateText.helpTitle;paragraph.append(document.createTextNode(coordinateText.helpBefore));link.href='https://www.maptiler.com/tools/coordinates/';link.target='_blank';link.rel='noopener noreferrer';link.textContent='MapTiler Coordinates';paragraph.append(link,document.createTextNode(coordinateText.helpAfter));copy.append(heading,paragraph);guide.append(image,copy);body.append(guide);}\n"+recorder;
  result=once(result,recorder,guide,'coordinate-help-guide');
  return result;
}

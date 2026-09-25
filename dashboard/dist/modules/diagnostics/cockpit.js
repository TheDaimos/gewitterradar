import { defineModule } from "../core/runtime.js?v=41002r11";
export const MODULE_META=Object.freeze({
  "id": "diagnostics.cockpit",
  "version": "1.1.5",
  "group": "Diagnose",
  "function": "Diagnose & Kalibrierung",
  "subfunctions": [
    "Diagnosekonsole",
    "Virtuelles Gewitter",
    "Kompass-Kalibrierung",
    "Medaillon-Kalibrierung",
    "Leistung"
  ],
  "file": "modules/diagnostics/cockpit.js"
});
export const installDiagnostics=defineModule(MODULE_META,(deps)=>{const { CARD_VERSION, CARD_DISPLAY_VERSION, GEWITTERRADAR_BUILD, GEWITTERRADAR_INFINITY_GFX, HELP_PREMIUM_ICON_VARIANT, HELP_REFINED_ICONS, HELP_REFINED_ICONS_V3, HELP_REFINED_ICONS_V4, HELP_REFINED_ICONS_V5, HELP_REFINED_ICONS_V6, HELP_PREMIUM_ICONS, BUILD_YYYY_MM, LEAFLET_JS, LEAFLET_CSS_URL, getClusterResolutionProfileLabel, loadLeafletJs, TREND_MEDALLION_IMAGE, TREND_ARROW_IMAGE, MAP_COMPASS_TOGGLE_IMAGE, COMPASS_METAL_FRAME_V1_IMAGE, COMPASS_METAL_FRAME_V2_IMAGE, COMPASS_METAL_FRAME_V3_IMAGE, COMPASS_METAL_FRAME_V4_IMAGE, COMPASS_METAL_FRAME_V5_IMAGE, COMPASS_SELECTOR_FRAME_IMAGES, COMPASS_DESIGNS, COMPASS_DESIGN_STORAGE_KEY, MAP_DISPLAY_MODE_STORAGE_KEY, MAP_LAST_DISPLAY_MODE_STORAGE_KEY, MAP_STARTUP_MODE_STORAGE_KEY, MAP_LAYER_SYMBOL_STYLE_STORAGE_KEY, MAP_LAYER_SYMBOL_STACK3D_IMAGE, MAP_COMPASS_POSITION_STORAGE_KEY, MAP_COMPASS_VISIBLE_STORAGE_KEY, MAP_MEDALLION_POSITION_STORAGE_KEY, MAP_MEDALLION_VISIBLE_STORAGE_KEY, MAP_LOCATION_POSITION_STORAGE_KEY, MAP_WINDOW_QUERY_KEY, MAP_WINDOW_VERSION_QUERY_KEY, LANGUAGE_INITIALIZATION_ENTITIES, ABOUT_ONBOARDING_VERSION, ABOUT_STORAGE_KEY, ABOUT_LOGO, ABOUT_HERO_IMAGE, ABOUT_DEDICATION_IMAGE, ABOUT_CLOSE_IMAGE, ABOUT_COPY_IMAGE, V407_LOCATION_SAFETY_ICON, V407_LOCATION_ADVICE_ICON, V407_COORDINATE_TARGET_TAB_ICON, V407_LOCATION_SEARCH_GLOBE_ICON, V407_LOCATION_SEARCH_LOUPE_ICON, V407_COORDINATE_TARGET_LIST_ICON, V407_COORDINATE_TEXTS, ABOUT_RECORDER_YAML, ABOUT_STRINGS, ABOUT_SETTING_ACCESSORS, ABOUT_SETTING_LABELS, ABOUT_SETTING_PURPOSES, ABOUT_SOURCE_PURPOSES, MEDALLION_DESIGNS, MEDALLION_UI, DIAGNOSTIC_UI, DIAGNOSTIC_VIRTUAL_STORM_UI, DIAGNOSTIC_MODE_LABEL, DIAGNOSTIC_SELECT_ACTIVE, DIAGNOSTIC_TERMS, DIAGNOSTIC_AUX, DIAGNOSTIC_OVERLAY_TERMS, DIAGNOSTIC_PERFORMANCE_UI, COMPASS_FRAME_OPENING_CACHE, _uiAsset7Base64, _uiAsset7ExpectedSha256, _uiAsset7VerifiedUri, C, HISTORY_MINUTES, ACTIVE_MINUTES, HISTORY_BUCKET_MINUTES, FLASH_COOLDOWN_MS, FLASH_PULSE_COUNT, FLASH_GAP_MIN_MS, FLASH_GAP_MAX_MS, FLASH_CENTER_X_MIN, FLASH_CENTER_X_MAX, FLASH_CENTER_Y_MIN, FLASH_CENTER_Y_MAX, FLASH_MOBILE_VIEWPORT_MAX_WIDTH, LANGUAGE_HELPER_DEFAULT, DISTANCE_UNIT_HELPER_DEFAULT, KM_TO_MI, KM_TO_FT, METRIC_NEAR_THRESHOLD_KM, IMPERIAL_FEET_THRESHOLD_MI, AURA_ENABLED_HELPER_DEFAULT, AURA_WIDTH_HELPER_DEFAULT, AURA_INTENSITY_HELPER_DEFAULT, AURA_WIDTH_MIN, AURA_WIDTH_MAX, AURA_WIDTH_DEFAULT, AURA_INTENSITY_MIN, AURA_INTENSITY_MAX, AURA_INTENSITY_DEFAULT, LANGUAGE_DEFAULT, SETTING_ENTITIES, HELP_STRINGS, LANGUAGE_DEFINITIONS, ABOUT_LOCALES, ABOUT_EXTERNAL_LANGUAGE_NAMES, ABOUT_LOCALE_MODULE_URL, validateAboutLocales, isAboutLocaleComplete, normalizeExternalHelpLocale, installAboutExternalLocales, loadAboutExternalLocales, requestAboutLocale, resolveAboutLocale, AGE_SHORT_UNITS, DISTANCE_UNIT_LABELS, I18N, I18N_STATIC_TEXT_KEYS, I18N_STATIC_ATTR_KEYS, CARDINALS, CARDINAL_NAMES, toCardinal, toCardinalName, clamp, finiteNumber, fmtNumber, bearingBetween, distanceBetweenKm, projectedRadiusPixels, installLeafletStrikeCanvas, installLeafletRadiusAuraSvg }=deps;return {
    _diagnosticTerm(index) { return (DIAGNOSTIC_TERMS[this._languageValue()]||DIAGNOSTIC_TERMS[LANGUAGE_DEFAULT])[index]; },
    _diagnosticAux(index) { return (DIAGNOSTIC_AUX[this._languageValue()]||DIAGNOSTIC_AUX[LANGUAGE_DEFAULT])[index]; },
    _diagnosticOverlayTerm(index) { return (DIAGNOSTIC_OVERLAY_TERMS[this._languageValue()]||DIAGNOSTIC_OVERLAY_TERMS[LANGUAGE_DEFAULT])[index]; },
    _diagnosticPerformanceText(index) { return (DIAGNOSTIC_PERFORMANCE_UI[this._languageValue()]||DIAGNOSTIC_PERFORMANCE_UI[LANGUAGE_DEFAULT])[index]; },
    _diagnosticStormText(index) { return (DIAGNOSTIC_VIRTUAL_STORM_UI[this._languageValue()]||DIAGNOSTIC_VIRTUAL_STORM_UI[LANGUAGE_DEFAULT])[index]; },

    _medallionDiagnosticDescriptor() {
      const designs=Array.isArray(MEDALLION_DESIGNS)?MEDALLION_DESIGNS:[];
      const active=this._medallionDesignValue?.()||this._activeMedallionDesign||designs[0]?.id||'';
      return designs.find((entry)=>entry.id===active)||designs[0]||null;
    },

    _medallionDiagnosticProfile(design=this._medallionDiagnosticDescriptor()) {
      const fallback={
        geometryVersion:'round-medallion-v1',
        method:'hi-res 360-degree aperture-mask coverage build',
        sourceWidth:512,sourceHeight:512,
        aperture:{centerX:256.0627,centerY:258.3163,radius:168.7717,rms:4.1034},
        motif:{centerX:256.0627,centerY:258.3163,radius:168.7717,rms:4.1034},
        gap:{mean:0,median:0,min:0,max:0,stdDev:0},
        fitRatio:1,requiredScale:1,requiredGrowthPct:0,
        centerOffsetX:0,centerOffsetY:0,centerResidual:0,
        normalizedCenterResidual:0,normalizedMeanGap:0,normalizedMaxGap:0,
        recommended:{translateX:0,translateY:0,uniformScale:1},
        status:{innerApertureFit:true,innerCircleCenter:true,radialGap:true,arrowCoupling:true},
        composition:{outerFrame:'pixel-identical outside measured hi-res aperture mask',innerMotif:'hi-res coverage-scaled beneath measured aperture mask',arrow:'separate hi-res-derived image with identical geometric base factor 1.1933478262',sharedInnerStage:false},
        arrow:{centerXPercent:50.012238,centerYPercent:50.452396,widthPercent:59.667391,heightPercent:59.667391}
      };
      const raw=design?.diagnosticProfile||{};
      return {
        ...fallback,...raw,
        aperture:{...fallback.aperture,...(raw.aperture||{})},
        motif:{...fallback.motif,...(raw.motif||{})},
        gap:{...fallback.gap,...(raw.gap||{})},
        recommended:{...fallback.recommended,...(raw.recommended||{})},
        status:{...fallback.status,...(raw.status||{})},
        composition:{...fallback.composition,...(raw.composition||{})},
        arrow:{...fallback.arrow,...(raw.arrow||{})}
      };
    },

    _pickerDiagnosticEnabled() {
      return !!this._diagnostics?.enabled&&!!this._diagnostics?.visualsVisible;
    },

    _pickerDiagnosticRelativeRect(node,parentRect) {
      const rect=node?.getBoundingClientRect?.();
      if(!rect||!parentRect)return null;
      return {x:rect.left-parentRect.left,y:rect.top-parentRect.top,width:rect.width,height:rect.height,
        centerX:rect.left-parentRect.left+rect.width/2,centerY:rect.top-parentRect.top+rect.height/2,
        left:rect.left-parentRect.left,top:rect.top-parentRect.top,right:rect.right-parentRect.left,bottom:rect.bottom-parentRect.top};
    },

    _renderPickerDiagnosticStage(svg,{width,height,subject=null,pivot=null,targetCircle=null,targetPoint=null,actualPoint=null,namespace='P'}={}) {
      if(!svg||!(width>0&&height>0))return;
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
      svg.style.setProperty('display','block','important');svg.style.setProperty('opacity','1','important');svg.style.setProperty('z-index','2147483000','important');
      const line=(x1,y1,x2,y2,stroke,widthValue=1,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${widthValue}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
      const cross=(x,y,stroke,size=6)=>line(x-size,y,x+size,y,stroke,1.25)+line(x,y-size,x,y+size,stroke,1.25);
      const overlays=this._diagnostics?.overlays||{},grid=this._diagnostics?.grid||'off';let markup='';
      if(grid!=='off'){const steps=grid==='fine'?20:10;markup+='<g fill="none">';
        for(let i=1;i<steps;i+=1){const x=width*i/steps,y=height*i/steps,major=i%(steps/10)===0;markup+=line(x,0,x,height,major?'#2ddcff':'#40ffa2',major?.55:.3,major?'4 4':'2 5')+line(0,y,width,y,major?'#2ddcff':'#40ffa2',major?.55:.3,major?'4 4':'2 5');}
        markup+='</g>';if(overlays.ids!==false){const cw=width/10,ch=height/10;markup+='<g fill="#79e8ff" font-family="ui-monospace,monospace" font-size="6.5" opacity=".82">';for(let row=0;row<10;row+=1)for(let col=0;col<10;col+=1){const label=`${namespace}-${String.fromCharCode(65+col)}${row+1}`;markup+=`<text x="${col*cw+2}" y="${row*ch+8}">${label}</text>`;}markup+='</g>';}}
      markup+='<g fill="none">';if(overlays.axes!==false)markup+=line(width/2,0,width/2,height,'#4de5ff',.9,'4 4')+line(0,height/2,width,height/2,'#4de5ff',.9,'4 4');if(overlays.diagonals!==false)markup+=line(0,0,width,height,'#a985ff',.7,'3 5')+line(width,0,0,height,'#a985ff',.7,'3 5');markup+='</g>';
      if(subject&&overlays.boxes!==false)markup+=`<rect x="${subject.x}" y="${subject.y}" width="${subject.width}" height="${subject.height}" fill="none" stroke="#ffe15d" stroke-width="1.2" stroke-dasharray="5 3"/>`;if(subject&&overlays.centers!==false)markup+=cross(subject.centerX,subject.centerY,'#ffe15d',7);
      if(targetCircle)markup+=`<circle cx="${targetCircle.x}" cy="${targetCircle.y}" r="${targetCircle.radius}" fill="none" stroke="#55e5a2" stroke-width="1.2" stroke-dasharray="6 3"/>`;if(pivot)markup+=cross(pivot.x,pivot.y,'#ff9f43',5);if(targetPoint)markup+=cross(targetPoint.x,targetPoint.y,'#60f0a8',6);if(actualPoint)markup+=cross(actualPoint.x,actualPoint.y,'#ff5fc8',4);svg.innerHTML=markup;
    },

    _renderPickerDiagnosticNav(svg,{width,height,previous=null,index=null,next=null}={}) {
      if(!svg||!(width>0&&height>0))return;
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
      const rect=(box,stroke)=>box?`<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" fill="none" stroke="${stroke}" stroke-width="1" stroke-dasharray="4 3"/>`:'';
      svg.innerHTML=`<line x1="${width/2}" y1="0" x2="${width/2}" y2="${height}" stroke="#4de5ff" stroke-width=".8" stroke-dasharray="3 3"/>${rect(previous,'#97e0ff')}${rect(index,'#ffe15d')}${rect(next,'#97e0ff')}`;
    },

    _measureCompassPickerDiagnostics() {
      const dialog=this._compassPickerDialog;
      if(!dialog){if(this._pickerDiagnostics)this._pickerDiagnostics.compass=null;return null;}
      const enabled=this._pickerDiagnosticEnabled(),stage=dialog.querySelector('[data-compass-picker-stage]'),nav=dialog.querySelector('.compass-picker-nav-row'),
        stageOverlay=dialog.querySelector('[data-compass-picker-diagnostic-stage]'),navOverlay=dialog.querySelector('[data-compass-picker-diagnostic-nav]'),readout=dialog.querySelector('[data-compass-picker-diagnostic-readout]'),tools=dialog.querySelector('[data-compass-picker-diagnostic-tools]');
      [stageOverlay,navOverlay,readout,tools].forEach((node)=>{if(node){node.hidden=!enabled;if(enabled){node.style?.setProperty('visibility','visible','important');node.style?.setProperty('opacity','1','important');}else{node.style?.removeProperty('display');node.style?.removeProperty('visibility');node.style?.removeProperty('opacity');node.style?.removeProperty('z-index');if(node.matches?.('svg'))node.replaceChildren();}}});
      if(!enabled||!stage||!nav)return null;
      const stageRect=stage.getBoundingClientRect(),navRect=nav.getBoundingClientRect(),instrument=stage.querySelector('.compass-instrument');
      if(!(stageRect.width>0&&stageRect.height>0&&instrument))return null;
      const subject=this._pickerDiagnosticRelativeRect(instrument,stageRect),needle=instrument.querySelector('#compass-needle'),pivot=this._pickerDiagnosticRelativeRect(needle,stageRect);
      const previous=this._pickerDiagnosticRelativeRect(nav.querySelector('[data-compass-picker-prev]'),navRect),index=this._pickerDiagnosticRelativeRect(nav.querySelector('[data-compass-picker-index]'),navRect),next=this._pickerDiagnosticRelativeRect(nav.querySelector('[data-compass-picker-next]'),navRect);
      const centerDx=subject.centerX-stageRect.width/2,centerDy=subject.centerY-stageRect.height/2,centerResidual=Math.hypot(centerDx,centerDy);
      const pivotDx=pivot?pivot.centerX-stageRect.width/2:null,pivotDy=pivot?pivot.centerY-stageRect.height/2:null,pivotResidual=pivot?Math.hypot(pivotDx,pivotDy):null;
      const leftDistance=previous&&index?index.centerX-previous.centerX:null,rightDistance=next&&index?next.centerX-index.centerX:null;
      const navSymmetry=leftDistance!=null&&rightDistance!=null?Math.abs(leftDistance-rightDistance):null;
      const navCenters=[previous?.centerY,index?.centerY,next?.centerY].filter(Number.isFinite),navVerticalSpread=navCenters.length?Math.max(...navCenters)-Math.min(...navCenters):null;
      const instrumentRect=instrument.getBoundingClientRect(),gap=navRect.top-instrumentRect.bottom;
      const overflow=subject.left<-.5||subject.top<-.5||subject.right>stageRect.width+.5||subject.bottom>stageRect.height+.5;
      const descriptor=COMPASS_DESIGNS.find((entry)=>entry.id===(instrument.dataset.compassDesign||this._activeCompassDesign))||COMPASS_DESIGNS[0];
      const ok=centerResidual<=1.5&&(pivotResidual==null||pivotResidual<=1.5)&&(navSymmetry==null||navSymmetry<=1.5)&&(navVerticalSpread==null||navVerticalSpread<=1.5)&&!overflow;
      const result={kind:'compass',designId:descriptor?.id||null,uiIndex:descriptor?.uiIndex||null,total:COMPASS_DESIGNS.length,
        stage:{width:stageRect.width,height:stageRect.height},instrument:subject,centerDelta:{x:centerDx,y:centerDy,residual:centerResidual},
        pivot:pivot?{x:pivot.centerX,y:pivot.centerY,deltaX:pivotDx,deltaY:pivotDy,residual:pivotResidual}:null,
        navigation:{leftDistance,rightDistance,symmetryDelta:navSymmetry,verticalSpread:navVerticalSpread,gapFromInstrument:gap},overflow,status:ok?'OK':'REVIEW'};
      this._pickerDiagnostics=this._pickerDiagnostics||{};this._pickerDiagnostics.compass=result;
      this._renderPickerDiagnosticStage(stageOverlay,{width:stageRect.width,height:stageRect.height,subject,pivot:pivot?{x:pivot.centerX,y:pivot.centerY}:null,namespace:'KP'});
      this._renderPickerDiagnosticNav(navOverlay,{width:navRect.width,height:navRect.height,previous,index,next});
      if(readout)readout.textContent=[
        `KOMPASS-PICKER · VARIANTE ${result.uiIndex||'?'} / ${result.total} · ${result.designId||'n/v'}`,
        `Stage ${stageRect.width.toFixed(2)} × ${stageRect.height.toFixed(2)} px`,
        `Instrument-Zentrum Δ X ${centerDx.toFixed(2)} · Y ${centerDy.toFixed(2)} · R ${centerResidual.toFixed(2)} px`,
        `Pivot-Zentrum Δ ${pivotResidual==null?'n/v':pivotResidual.toFixed(2)+' px'}`,
        `Navigation L/R ${leftDistance==null?'n/v':leftDistance.toFixed(2)} / ${rightDistance==null?'n/v':rightDistance.toFixed(2)} px · Symmetrie Δ ${navSymmetry==null?'n/v':navSymmetry.toFixed(2)} px`,
        `Navigation Y-Streuung ${navVerticalSpread==null?'n/v':navVerticalSpread.toFixed(2)} px · Instrument→Navigation ${gap.toFixed(2)} px`,
        `Overflow ${overflow?'JA':'nein'} · STATUS ${result.status}`
      ].join('\n');
      return result;
    },

    _measureMedallionPickerDiagnostics() {
      const dialog=this._medallionPickerDialog;
      if(!dialog){if(this._pickerDiagnostics)this._pickerDiagnostics.medallion=null;return null;}
      const enabled=this._pickerDiagnosticEnabled(),stage=dialog.querySelector('[data-medallion-picker-stage]'),nav=dialog.querySelector('.medallion-picker-nav'),
        stageOverlay=dialog.querySelector('[data-medallion-picker-diagnostic-stage]'),navOverlay=dialog.querySelector('[data-medallion-picker-diagnostic-nav]'),readout=dialog.querySelector('[data-medallion-picker-diagnostic-readout]'),tools=dialog.querySelector('[data-medallion-picker-diagnostic-tools]');
      [stageOverlay,navOverlay,readout,tools].forEach((node)=>{if(node){node.hidden=!enabled;if(enabled){node.style?.setProperty('visibility','visible','important');node.style?.setProperty('opacity','1','important');}else{node.style?.removeProperty('display');node.style?.removeProperty('visibility');node.style?.removeProperty('opacity');node.style?.removeProperty('z-index');if(node.matches?.('svg'))node.replaceChildren();}}});
      if(!enabled||!stage||!nav)return null;
      const stageRect=stage.getBoundingClientRect(),navRect=nav.getBoundingClientRect(),preview=stage.querySelector('.medallion-picker-preview'),base=stage.querySelector('[data-medallion-picker-base]'),arrow=stage.querySelector('.trend-medallion-arrow');
      if(!(stageRect.width>0&&stageRect.height>0&&preview&&base&&arrow))return null;
      const subject=this._pickerDiagnosticRelativeRect(preview,stageRect),baseRect=this._pickerDiagnosticRelativeRect(base,stageRect),arrowRect=this._pickerDiagnosticRelativeRect(arrow,stageRect);
      const previous=this._pickerDiagnosticRelativeRect(nav.querySelector('[data-medallion-picker-prev]'),navRect),index=this._pickerDiagnosticRelativeRect(nav.querySelector('[data-medallion-picker-index]'),navRect),next=this._pickerDiagnosticRelativeRect(nav.querySelector('[data-medallion-picker-next]'),navRect);
      const descriptor=this._medallionDiagnosticDescriptor(),profile=this._medallionDiagnosticProfile(descriptor),sourceWidth=Number(profile.sourceWidth)||512,sourceHeight=Number(profile.sourceHeight)||sourceWidth;
      const centerDx=subject.centerX-stageRect.width/2,centerDy=subject.centerY-stageRect.height/2,centerResidual=Math.hypot(centerDx,centerDy);
      const targetPoint={x:stageRect.width*(Number(profile.arrow.centerXPercent)||50)/100,y:stageRect.height*(Number(profile.arrow.centerYPercent)||50)/100};
      const actualPoint={x:arrowRect.centerX,y:arrowRect.centerY},arrowResidual=Math.hypot(actualPoint.x-targetPoint.x,actualPoint.y-targetPoint.y);
      const aperture={x:stageRect.width*profile.aperture.centerX/sourceWidth,y:stageRect.height*profile.aperture.centerY/sourceHeight,radius:Math.min(stageRect.width/sourceWidth,stageRect.height/sourceHeight)*profile.aperture.radius};
      const leftDistance=previous&&index?index.centerX-previous.centerX:null,rightDistance=next&&index?next.centerX-index.centerX:null,navSymmetry=leftDistance!=null&&rightDistance!=null?Math.abs(leftDistance-rightDistance):null;
      const navCenters=[previous?.centerY,index?.centerY,next?.centerY].filter(Number.isFinite),navVerticalSpread=navCenters.length?Math.max(...navCenters)-Math.min(...navCenters):null;
      const gap=navRect.top-stageRect.bottom,overflow=subject.left<-.5||subject.top<-.5||subject.right>stageRect.width+.5||subject.bottom>stageRect.height+.5;
      const style=getComputedStyle(arrow),arrowWidth=parseFloat(style.width)||0,arrowHeight=parseFloat(style.height)||0,expectedArrowWidth=stageRect.width*profile.arrow.widthPercent/100,expectedArrowHeight=stageRect.height*profile.arrow.heightPercent/100;
      const arrowSizeResidual=Math.max(Math.abs(arrowWidth-expectedArrowWidth),Math.abs(arrowHeight-expectedArrowHeight));
      const ok=centerResidual<=1.5&&arrowResidual<=1.5&&arrowSizeResidual<=1.5&&(navSymmetry==null||navSymmetry<=1.5)&&(navVerticalSpread==null||navVerticalSpread<=1.5)&&!overflow;
      const designs=Array.isArray(MEDALLION_DESIGNS)?MEDALLION_DESIGNS:[],designIndex=Math.max(0,designs.findIndex((entry)=>entry.id===descriptor?.id));
      const result={kind:'medallion',designId:descriptor?.id||null,uiIndex:designIndex+1,total:designs.length,profile:profile.geometryVersion,
        stage:{width:stageRect.width,height:stageRect.height},preview:subject,base:baseRect,centerDelta:{x:centerDx,y:centerDy,residual:centerResidual},
        aperture,targetArrowCenter:targetPoint,actualArrowCenter:actualPoint,arrowCenterResidual:arrowResidual,arrowSizeResidual,
        navigation:{leftDistance,rightDistance,symmetryDelta:navSymmetry,verticalSpread:navVerticalSpread,gapFromStage:gap},overflow,status:ok?'OK':'REVIEW'};
      this._pickerDiagnostics=this._pickerDiagnostics||{};this._pickerDiagnostics.medallion=result;
      this._renderPickerDiagnosticStage(stageOverlay,{width:stageRect.width,height:stageRect.height,subject,targetCircle:aperture,targetPoint,actualPoint,namespace:'MP'});
      this._renderPickerDiagnosticNav(navOverlay,{width:navRect.width,height:navRect.height,previous,index,next});
      if(readout)readout.textContent=[
        `MEDAILLON-PICKER · ${result.designId||'n/v'} · ${result.uiIndex} / ${result.total}`,
        `Profil ${result.profile||'n/v'} · Stage ${stageRect.width.toFixed(2)} × ${stageRect.height.toFixed(2)} px`,
        `Medaillon-Zentrum Δ X ${centerDx.toFixed(2)} · Y ${centerDy.toFixed(2)} · R ${centerResidual.toFixed(2)} px`,
        `Pfeil-Zentrum Soll ${targetPoint.x.toFixed(2)},${targetPoint.y.toFixed(2)} · Ist ${actualPoint.x.toFixed(2)},${actualPoint.y.toFixed(2)} · R ${arrowResidual.toFixed(2)} px`,
        `Pfeil-Größe Δ max ${arrowSizeResidual.toFixed(2)} px · Apertur R ${aperture.radius.toFixed(2)} px`,
        `Navigation L/R ${leftDistance==null?'n/v':leftDistance.toFixed(2)} / ${rightDistance==null?'n/v':rightDistance.toFixed(2)} px · Symmetrie Δ ${navSymmetry==null?'n/v':navSymmetry.toFixed(2)} px`,
        `Navigation Y-Streuung ${navVerticalSpread==null?'n/v':navVerticalSpread.toFixed(2)} px · Stage→Navigation ${gap.toFixed(2)} px`,
        `Overflow ${overflow?'JA':'nein'} · STATUS ${result.status}`
      ].join('\n');
      return result;
    },

    _syncPickerDiagnostics() {
      this._measureCompassPickerDiagnostics();
      this._measureMedallionPickerDiagnostics();
    },

    _clearPickerDiagnostic(kind) {
      if(this._pickerDiagnostics&&kind in this._pickerDiagnostics)this._pickerDiagnostics[kind]=null;
    },

    _pickerDiagnosticPayload(kind) {
      const normalized=kind==='medallion'?'medallion':'compass';
      const measurement=normalized==='medallion'?this._measureMedallionPickerDiagnostics():this._measureCompassPickerDiagnostics();
      const designId=measurement?.designId||null;
      const calibration=normalized==='medallion'
        ? {enabled:!!this._medallionCalibrationEnabled,report:this._medallionCalibrationReportText||null,details:this._medallionCalibrationDetailText||null}
        : {enabled:!!this._compassCalibrationEnabled,report:this._compassCalibrationReportText||null,details:this._compassCalibrationDetailText||null};
      return {
        schema:'gewitterradar.picker-diagnostic.v1',
        generatedAt:new Date().toISOString(),
        application:{name:'Gewitterradar',version:CARD_DISPLAY_VERSION,releaseVersion:CARD_VERSION,build:GEWITTERRADAR_BUILD},
        picker:normalized,
        designId,
        viewport:{width:innerWidth,height:innerHeight,devicePixelRatio,visualScale:window.visualViewport?.scale??1},
        diagnosticState:{enabled:!!this._diagnostics?.enabled,visualsVisible:!!this._diagnostics?.visualsVisible,live:!!this._diagnostics?.live},
        medallionState:normalized==='medallion'?{...(this._medallionDiagnostic||{}),angleConvention:'0° North, 90° East, clockwise',assetZeroOffsetDeg:-45}:null,
        measurement:measurement||null,
        calibration
      };
    },

    _pickerDiagnosticCsv(kind) {
      const payload=this._pickerDiagnosticPayload(kind),rows=[['Feld','Wert']];
      const push=(value,path)=>{
        if(value==null||typeof value!=='object'){rows.push([path,value==null?'':String(value)]);return;}
        if(Array.isArray(value)){if(!value.length)rows.push([path,'[]']);else value.forEach((entry,index)=>push(entry,`${path}[${index}]`));return;}
        const entries=Object.entries(value);if(!entries.length){rows.push([path,'{}']);return;}
        entries.forEach(([key,entry])=>push(entry,path?`${path}.${key}`:key));
      };
      push(payload,'');
      const quote=(value)=>`"${String(value).replace(/"/g,'""')}"`;
      return rows.map(([field,value])=>`${quote(field)};${quote(value)}`).join('\r\n');
    },

    _pickerDiagnosticFilename(kind,extension) {
      const normalized=kind==='medallion'?'medallion':'compass',measurement=this._pickerDiagnostics?.[normalized],design=(measurement?.designId||'unknown').replace(/[^a-z0-9_-]+/gi,'-'),stamp=new Date().toISOString().replace(/[:.]/g,'-');
      return `gewitterradar_${normalized}_picker_${design}_${stamp}.${extension}`;
    },

    _downloadPickerDiagnostic(kind,format='json') {
      const normalizedFormat=format==='csv'?'csv':'json',payload=normalizedFormat==='csv'?('\ufeff'+this._pickerDiagnosticCsv(kind)):JSON.stringify(this._pickerDiagnosticPayload(kind),null,2),
        type=normalizedFormat==='csv'?'text/csv;charset=utf-8':'application/json;charset=utf-8',blob=new Blob([payload],{type}),url=URL.createObjectURL(blob),anchor=document.createElement('a');
      anchor.href=url;anchor.download=this._pickerDiagnosticFilename(kind,normalizedFormat);document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    },

    _copyPickerDiagnostic: async function(kind,button=null) {
      const text=JSON.stringify(this._pickerDiagnosticPayload(kind),null,2);let copied=false;
      try{await navigator.clipboard.writeText(text);copied=true;}catch(_){
        const area=document.createElement('textarea');area.value=text;area.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(area);area.select();
        try{copied=document.execCommand('copy');}catch(_error){}finally{area.remove();}
      }
      if(button){
        const old=button.textContent;button.textContent=copied?'✓ KOPIERT':'KOPIEREN FEHLGESCHLAGEN';
        setTimeout(()=>{if(button.isConnected)button.textContent=old;},1200);
      }
      return copied;
    },

    _bindPickerDiagnosticActions(shell,kind) {
      if(!shell)return;
      shell.querySelector('[data-picker-diagnostic-copy]')?.addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();this._copyPickerDiagnostic(kind,event.currentTarget);});
      shell.querySelector('[data-picker-diagnostic-json]')?.addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();this._downloadPickerDiagnostic(kind,'json');});
      shell.querySelector('[data-picker-diagnostic-csv]')?.addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();this._downloadPickerDiagnostic(kind,'csv');});
      if(kind==='medallion'){
        shell.querySelectorAll('[data-medallion-preset]').forEach((button)=>button.addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();this._setMedallionDiagnosticMode(button.dataset.medallionPreset);}));
        shell.querySelectorAll('[data-medallion-angle]').forEach((button)=>button.addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();this._setMedallionDiagnosticAngle(Number(button.dataset.medallionAngle));}));
        shell.querySelectorAll('[data-medallion-arrow]').forEach((button)=>button.addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();this._setMedallionDiagnosticArrow(button.dataset.medallionArrow==='on');}));
        shell.querySelectorAll('[data-medallion-animation]').forEach((button)=>button.addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();this._setMedallionDiagnosticAnimation(button.dataset.medallionAnimation==='on');}));
        shell.querySelectorAll('[data-medallion-freeze]').forEach((button)=>button.addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();this._setMedallionDiagnosticFreeze(button.dataset.medallionFreeze==='on');}));
      }
    },

    _diagnosticRegistry() {
      return [
        ['A',7,'.map-card'],['B',8,'.recent-panel'],['C',9,'.compass-panel'],
        ['D',10,'.history-panel'],['E',11,'.trend'],['F',12,'.weather-message-panel']
      ].map(([id,nameIndex,selector])=>({id,name:this._diagnosticAux(nameIndex),selector,element:this.shadow?.querySelector(selector)})).filter((entry)=>entry.element);
    },

    _upgradeDiagnosticCockpitV40802() {
      const consoleNode=this.shadow?.getElementById('diagnostic-console'),body=consoleNode?.querySelector('.diagnostic-console-body');
      if(!body||body.dataset.v40802Cockpit==='true')return;
      body.dataset.v40802Cockpit='true';
      const allSections=[...body.querySelectorAll(':scope > .diagnostic-console-section')];
      const sectionWith=(selector)=>allSections.find((section)=>section.querySelector(selector));
      const grid=sectionWith('#diagnostic-grid-title'),overlays=sectionWith('#diagnostic-overlays-title'),presets=sectionWith('#diagnostic-presets-title');
      const medallion=body.querySelector(':scope > .diagnostic-medallion-state-section');
      const storm=body.querySelector(':scope > .diagnostic-virtual-storm-section');
      const readout=sectionWith('#diagnostic-readout'),exportSection=body.querySelector(':scope > .diagnostic-export-section');

      const weather=document.createElement('div');weather.className='diagnostic-console-section diagnostic-weather-lab-section';weather.innerHTML=`
        <div class="diagnostic-console-section-title">Wetter-Labor · V4.08.33</div>
        <div class="diagnostic-controls">
          <label class="diagnostic-lab-field">Blitzlast <select id="diagnostic-lab-density"><option value="1">1× normal</option><option value="5">5× hoch</option><option value="20">20× Stress</option></select></label>
          <label class="diagnostic-lab-field">Alter <select id="diagnostic-lab-age"><option value="mixed">gemischt</option><option value="fresh">nur frisch</option><option value="stale">nur alt</option></select></label>
          <label class="diagnostic-lab-field">Raumform <select id="diagnostic-lab-pattern"><option value="standard">Standard</option><option value="compact">Kompakt</option><option value="wide">Breit</option><option value="line">Linie</option><option value="ring">Ring</option><option value="overlap">Überlappend</option><option value="duplicate">Doppelpunkt</option></select></label>
          <button id="diagnostic-lab-boundaries" type="button" aria-pressed="false">Radius-Grenzen</button>
          <button id="diagnostic-lab-split-merge" type="button">Split/Merge ×10</button>
          <button id="diagnostic-lab-danger-burst" type="button">Gefahr-Burst</button>
          <button id="diagnostic-lab-new-cells" type="button">Neue Zellen</button>
        </div>
        <div class="diagnostic-lab-note" id="diagnostic-weather-lab-state">Blitze/Cluster aktiv · Niederschlag vorbereitet · Wolken vorbereitet</div>`;

      const browser=document.createElement('div');browser.className='diagnostic-console-section diagnostic-cluster-browser-section';browser.innerHTML=`
        <div class="diagnostic-console-section-title">Cluster-Sprung · Sitzung</div>
        <div class="diagnostic-controls">
          <label class="diagnostic-lab-field">Inaktivität <select id="diagnostic-cluster-jump-timeout"><option value="5000">5 s</option><option value="10000">10 s</option><option value="20000">20 s</option><option value="30000">30 s</option><option value="40000">40 s</option><option value="60000">60 s</option><option value="180000">180 s</option><option value="0">unbegrenzt</option></select></label>
          <button id="diagnostic-cluster-jump-end" type="button">Sitzung beenden</button>
          <button id="diagnostic-cluster-render-stress" type="button">20× Render</button>
        </div>
        <div class="diagnostic-cluster-browser-state" id="diagnostic-cluster-browser-state">Sitzung inaktiv</div>`;

      if(storm){storm.before(weather);storm.after(browser);}

      let saved={};try{saved=JSON.parse(localStorage.getItem('gewitterradar:v40802:diagnostic-sections')||'{}')||{};}catch(_error){}
      const makeGroup=(key,title,nodes,defaultOpen=false)=>{
        const items=nodes.filter(Boolean);if(!items.length)return null;const first=items[0],details=document.createElement('details'),summary=document.createElement('summary'),inner=document.createElement('div');
        details.className='diagnostic-lab-group';details.dataset.diagnosticLabGroup=key;summary.textContent=title;inner.className='diagnostic-lab-group-body';
        details.open=Object.prototype.hasOwnProperty.call(saved,key)?!!saved[key]:defaultOpen;first.before(details);details.append(summary,inner);items.forEach((node)=>inner.append(node));
        details.addEventListener('toggle',()=>{
          if(details.open&&matchMedia?.('(max-width:700px),(max-height:620px)')?.matches){body.querySelectorAll('.diagnostic-lab-group[open]').forEach((other)=>{if(other!==details)other.open=false;});}
          const state={};body.querySelectorAll('.diagnostic-lab-group').forEach((group)=>{state[group.dataset.diagnosticLabGroup]=group.open;});try{localStorage.setItem('gewitterradar:v40802:diagnostic-sections',JSON.stringify(state));}catch(_error){}
        });
        return details;
      };

      makeGroup('weather','Blitze, Cluster & Wetter',[weather,storm,browser],true);
      makeGroup('geometry','Anzeige & Geometrie',[grid,overlays,presets],false);
      makeGroup('medallion','Medaillon',[medallion],false);
      makeGroup('telemetry','Messwerte & Protokoll',[readout,exportSection],false);
      this._syncDiagnosticWeatherLabV40802?.();
      this._syncDiagnosticClusterBrowseV40802?.();
    },

    _syncDiagnosticWeatherLabV40802() {
      const d=this._diagnostics,lab=d?.weatherLab,lightning=lab?.lightning;if(!lab||!lightning)return;
      const density=this.shadow?.getElementById('diagnostic-lab-density'),age=this.shadow?.getElementById('diagnostic-lab-age'),pattern=this.shadow?.getElementById('diagnostic-lab-pattern'),boundaries=this.shadow?.getElementById('diagnostic-lab-boundaries'),state=this.shadow?.getElementById('diagnostic-weather-lab-state');
      if(density)density.value=String(lightning.densityMultiplier||1);if(age)age.value=lightning.ageProfile||'mixed';if(pattern)pattern.value=lightning.pattern||'standard';
      boundaries?.classList.toggle('active',!!lightning.boundaryCases);boundaries?.setAttribute('aria-pressed',lightning.boundaryCases?'true':'false');
      if(state)state.textContent=`Blitze/Cluster aktiv · Last ${lightning.densityMultiplier||1}× · Alter ${lightning.ageProfile||'mixed'} · Form ${lightning.pattern||'standard'} · Grenzen ${lightning.boundaryCases?'EIN':'AUS'}\nStress: ${lightning.lastStressAction||'none'} · Niederschlag vorbereitet · Wolken vorbereitet`;
    },

    _syncDiagnosticClusterBrowseV40802() {
      const node=this.shadow?.getElementById('diagnostic-cluster-browser-state'),select=this.shadow?.getElementById('diagnostic-cluster-jump-timeout');
      const configuredTimeout=Number(this._statusClusterBrowseTimeoutMs)??10000;
      if(select){
        select.querySelectorAll('option[data-v40804-custom]').forEach((option)=>option.remove());
        if(![0,5000,10000,20000,30000,40000,60000,180000].includes(configuredTimeout)){
          const option=document.createElement('option');option.value=String(configuredTimeout);option.dataset.v40804Custom='true';option.textContent=`${Math.round(configuredTimeout/1000)} s · benutzerdefiniert`;select.append(option);
        }
        select.value=String(configuredTimeout);
      }
      if(!node)return;
      const active=!!this._statusClusterBrowseActive,total=active?(this._statusClusterBrowseSnapshot?.length||0):(this._statusFocusList?.length||0),index=active&&Number.isInteger(this._statusFocusIndex)&&this._statusFocusIndex>=0?this._statusFocusIndex+1:0,timeout=Number(this._statusClusterBrowseTimeoutMs)||0;
      let remaining='∞';if(active&&timeout>0&&this._statusClusterBrowseLastInteraction){remaining=`${Math.max(0,(timeout-(Date.now()-this._statusClusterBrowseLastInteraction))/1000).toFixed(1)} s`;}
      const zoom=Number(this._map?.getZoom?.())||0,policy=this._clusterV40801Enabled?.()?'V4.08':'V4.07.56',selected=(this._renderedMapClusters||[]).find((cluster)=>cluster?.id===this._statusFocusSelectedId);
      const detail=selected?` · Cluster ${selected.count||selected.items?.length||'?'} · ${Number(selected.distance||0).toFixed(1)} km`:'';
      node.textContent=active?`AKTIV · ${index}/${total} · N eingefroren ${total} · Rest ${remaining}\nZoom ${zoom} · Policy ${policy} · ID ${this._statusFocusSelectedId||'—'}${detail}`:`INAKTIV · Live-Cluster ${total} · Zoom ${zoom} · Policy ${policy} · nächster Sprung startet neue Sitzung`;
    },

    _bindDiagnosticControls() {
      const consoleNode=this.shadow?.getElementById('diagnostic-console');if(!consoleNode||consoleNode.dataset.bound)return;this._upgradeDiagnosticCockpitV40802?.();consoleNode.dataset.bound='true';
      consoleNode.querySelectorAll('[data-diagnostic-grid]').forEach((button)=>button.addEventListener('click',()=>{this._diagnostics.grid=button.dataset.diagnosticGrid;this._syncDiagnosticUi();}));
      consoleNode.querySelectorAll('[data-diagnostic-overlay]').forEach((button)=>button.addEventListener('click',()=>{const key=button.dataset.diagnosticOverlay;this._diagnostics.overlays[key]=!this._diagnostics.overlays[key];this._syncDiagnosticUi();}));
      consoleNode.querySelectorAll('[data-diagnostic-preset]').forEach((button)=>button.addEventListener('click',()=>this._applyDiagnosticPreset(button.dataset.diagnosticPreset)));
      consoleNode.querySelectorAll('[data-diagnostic-storm]').forEach((button)=>button.addEventListener('click',()=>this._setDiagnosticVirtualStorm(button.dataset.diagnosticStorm)));
      this.shadow.getElementById('diagnostic-storm-cells-minus')?.addEventListener('click',()=>this._setDiagnosticVirtualStormCellCount((this._diagnostics.virtualStorm?.cellCount||1)-1));
      this.shadow.getElementById('diagnostic-storm-cells-plus')?.addEventListener('click',()=>this._setDiagnosticVirtualStormCellCount((this._diagnostics.virtualStorm?.cellCount||1)+1));
      this.shadow.getElementById('diagnostic-storm-extreme')?.addEventListener('click',()=>this._setDiagnosticVirtualStormExtreme(!this._diagnostics.virtualStorm?.extreme));
      this.shadow.getElementById('diagnostic-lab-density')?.addEventListener('change',(event)=>{const value=Math.max(1,Math.min(20,Number(event.target.value)||1));this._diagnostics.weatherLab.lightning.densityMultiplier=value;const scenario=this._diagnostics.virtualStorm?.scenario||'off';if(scenario!=='off')this._setDiagnosticVirtualStorm(scenario);else this._syncDiagnosticWeatherLabV40802();});
      this.shadow.getElementById('diagnostic-lab-age')?.addEventListener('change',(event)=>{const value=['mixed','fresh','stale'].includes(event.target.value)?event.target.value:'mixed';this._diagnostics.weatherLab.lightning.ageProfile=value;const scenario=this._diagnostics.virtualStorm?.scenario||'off';if(scenario!=='off')this._setDiagnosticVirtualStorm(scenario);else this._syncDiagnosticWeatherLabV40802();});
      this.shadow.getElementById('diagnostic-lab-pattern')?.addEventListener('change',(event)=>{const allowed=['standard','compact','wide','line','ring','overlap','duplicate'];this._diagnostics.weatherLab.lightning.pattern=allowed.includes(event.target.value)?event.target.value:'standard';const scenario=this._diagnostics.virtualStorm?.scenario||'off';if(scenario!=='off')this._setDiagnosticVirtualStorm(scenario);else this._syncDiagnosticWeatherLabV40802();});
      this.shadow.getElementById('diagnostic-lab-split-merge')?.addEventListener('click',()=>this._diagnosticClusterSplitMergeStressV40802?.());
      this.shadow.getElementById('diagnostic-lab-danger-burst')?.addEventListener('click',()=>this._diagnosticInjectStressCellV40802?.('danger'));
      this.shadow.getElementById('diagnostic-lab-new-cells')?.addEventListener('click',()=>{this._diagnosticInjectStressCellV40802?.('observation');this._diagnosticInjectStressCellV40802?.('outside');});
      this.shadow.getElementById('diagnostic-lab-boundaries')?.addEventListener('click',()=>{this._diagnostics.weatherLab.lightning.boundaryCases=!this._diagnostics.weatherLab.lightning.boundaryCases;const scenario=this._diagnostics.virtualStorm?.scenario||'off';if(scenario!=='off')this._setDiagnosticVirtualStorm(scenario);else this._syncDiagnosticWeatherLabV40802();});
      this.shadow.getElementById('diagnostic-cluster-jump-timeout')?.addEventListener('change',(event)=>this._setStatusClusterBrowseTimeoutV40802(Number(event.target.value)));
      this.shadow.getElementById('diagnostic-cluster-jump-end')?.addEventListener('click',()=>this._expireStatusClusterBrowseSessionV40802('manual'));
      this.shadow.getElementById('diagnostic-cluster-render-stress')?.addEventListener('click',()=>{for(let i=0;i<20;i++)this._renderMapMarkers?.();if(this._diagnostics?.weatherLab?.lightning)this._diagnostics.weatherLab.lightning.lastStressRenders=20;this._syncDiagnosticClusterBrowseV40802();});
      this.shadow.getElementById('diagnostic-live')?.addEventListener('click',()=>{this._diagnostics.live=true;this._scheduleDiagnosticMeasure();});
      this.shadow.getElementById('diagnostic-freeze')?.addEventListener('click',()=>{this._diagnostics.live=false;this._diagnostics.snapshot=this._buildDiagnosticSnapshot();this._syncDiagnosticUi();});
      this.shadow.getElementById('diagnostic-visuals')?.addEventListener('click',()=>{this._diagnostics.visualsVisible=!this._diagnostics.visualsVisible;this._syncDiagnosticUi();});
      this.shadow.getElementById('diagnostic-select')?.addEventListener('click',()=>this._setDiagnosticSelecting(!this._diagnostics.selecting));
      this.shadow.getElementById('diagnostic-copy')?.addEventListener('click',()=>this._copyDiagnosticSelection(false));
      this.shadow.getElementById('diagnostic-copy-json')?.addEventListener('click',()=>this._copyDiagnosticSelection(true));
      this.shadow.getElementById('diagnostic-compass-log')?.addEventListener('click',()=>this._downloadCompassFitLog());
      this.shadow.getElementById('diagnostic-download')?.addEventListener('click',()=>this._downloadTotalDiagnostics());
      this.shadow.getElementById('diagnostic-snapshot')?.addEventListener('click',()=>this._downloadDiagnosticSnapshot());
      this.shadow.getElementById('diagnostic-performance')?.addEventListener('click',()=>this._runDiagnosticFpsTest());
      this.shadow.getElementById('diagnostic-performance-download')?.addEventListener('click',()=>this._downloadDiagnosticPerformanceSnapshot());
      this.shadow.getElementById('diagnostic-performance-cancel')?.addEventListener('click',()=>this._hideDiagnosticPerformanceOverlay());
      this.shadow.getElementById('diagnostic-performance-card')?.addEventListener('click',(event)=>event.stopPropagation());
      this.shadow.getElementById('diagnostic-performance-backdrop')?.addEventListener('click',(event)=>{if(event.target===event.currentTarget&&event.currentTarget.classList.contains('actions-ready'))this._hideDiagnosticPerformanceOverlay();});
      this.shadow.getElementById('diagnostic-compass-calibration')?.addEventListener('click',()=>this._setCompassCalibrationEnabled(!this._compassCalibrationEnabled));
      this.shadow.getElementById('diagnostic-medallion-calibration')?.addEventListener('click',()=>this._setMedallionCalibrationEnabled(!this._medallionCalibrationEnabled));
      [1,2].forEach((columns)=>this.shadow.getElementById(`diagnostic-columns-${columns}`)?.addEventListener('click',()=>this._setDiagnosticColumnMode(columns)));
      this.shadow.querySelectorAll('#diagnostic-exit,#diagnostic-exit-top').forEach((button)=>button.addEventListener('click',()=>this._stopDiagnostics()));
      this.shadow.getElementById('diagnostic-minimize')?.addEventListener('click',()=>consoleNode.classList.toggle('minimized'));
      const handle=consoleNode.querySelector('#diagnostic-console-drag');let drag=null;
      const touchById=(list,id)=>[...(list||[])].find((touch)=>touch.identifier===id)||null;
      const startDrag=(source,inputId,clientX,clientY)=>{
        const rect=consoleNode.getBoundingClientRect();
        drag={source,inputId,dx:clientX-rect.left,dy:clientY-rect.top};
      };
      const moveDrag=(source,inputId,clientX,clientY)=>{
        if(!drag||drag.source!==source||drag.inputId!==inputId)return false;
        const bounds=this._diagnosticConsoleBounds(),header=handle?.getBoundingClientRect(),reachableX=Math.max(80,Math.min(header?.width||80,bounds.width)),reachableY=Math.max(36,Math.min(header?.height||36,bounds.height));
        const left=Math.max(bounds.left-consoleNode.offsetWidth+reachableX,Math.min(bounds.left+bounds.width-reachableX,clientX-drag.dx));
        const top=Math.max(bounds.top,Math.min(bounds.top+bounds.height-reachableY,clientY-drag.dy));
        consoleNode.style.left=`${Math.round(left)}px`;consoleNode.style.top=`${Math.round(top)}px`;this._diagnostics.position={left:Math.round(left),top:Math.round(top)};return true;
      };
      const finishDrag=(source,inputId)=>{
        if(!drag||drag.source!==source||drag.inputId!==inputId)return;
        drag=null;try{localStorage.setItem('gewitterradar-diagnostic-position',JSON.stringify(this._diagnostics.position));}catch(_){}
      };
      handle?.addEventListener('pointerdown',(event)=>{
        if((event.pointerType==='mouse'&&event.button!==0)||event.isPrimary===false||event.target.closest('button'))return;
        if(event.pointerType!=='touch')event.preventDefault();event.stopPropagation();
        startDrag('pointer',event.pointerId,event.clientX,event.clientY);
        try{handle.setPointerCapture(event.pointerId);}catch(_){}
      },{capture:true});
      handle?.addEventListener('pointermove',(event)=>{
        if(!drag||drag.source!=='pointer'||drag.inputId!==event.pointerId)return;
        event.preventDefault();event.stopPropagation();moveDrag('pointer',event.pointerId,event.clientX,event.clientY);
      },{capture:true});
      const finishPointer=(event)=>{
        if(!drag||drag.source!=='pointer'||drag.inputId!==event.pointerId)return;
        event.preventDefault();event.stopPropagation();finishDrag('pointer',event.pointerId);try{handle.releasePointerCapture(event.pointerId);}catch(_){}
      };
      handle?.addEventListener('pointerup',finishPointer,{capture:true});handle?.addEventListener('pointercancel',finishPointer,{capture:true});
      handle?.addEventListener('touchstart',(event)=>{
        if(event.target.closest('button'))return;const touch=event.changedTouches?.[0]||event.touches?.[0];if(!touch)return;
        event.preventDefault();event.stopPropagation();startDrag('touch',touch.identifier,touch.clientX,touch.clientY);
      },{capture:true,passive:false});
      handle?.addEventListener('touchmove',(event)=>{
        if(!drag||drag.source!=='touch')return;const touch=touchById(event.touches,drag.inputId)||touchById(event.changedTouches,drag.inputId);if(!touch)return;
        event.preventDefault();event.stopPropagation();moveDrag('touch',drag.inputId,touch.clientX,touch.clientY);
      },{capture:true,passive:false});
      const finishTouch=(event)=>{
        if(!drag||drag.source!=='touch')return;if(event.type==='touchend'&&!touchById(event.changedTouches,drag.inputId))return;
        event.preventDefault();event.stopPropagation();finishDrag('touch',drag.inputId);
      };
      handle?.addEventListener('touchend',finishTouch,{capture:true,passive:false});handle?.addEventListener('touchcancel',finishTouch,{capture:true,passive:false});
    },

    _startDiagnostics() {
      if(this._diagnostics.enabled)return;this._diagnostics.enabled=true;this._diagnostics.startedAt=performance.now();
      try{this._diagnostics.position=JSON.parse(localStorage.getItem('gewitterradar-diagnostic-position')||'null');this._diagnostics.columnMode=Number(localStorage.getItem('gewitterradar-diagnostic-columns'))===1?1:2;}catch(_){}
      const consoleNode=this.shadow?.getElementById('diagnostic-console');if(this._diagnostics.position&&consoleNode){consoleNode.style.left=`${this._diagnostics.position.left}px`;consoleNode.style.top=`${this._diagnostics.position.top}px`;}
      this._diagnosticsResizeHandler=()=>{this._diagnostics.resizeCallbacks+=1;this._clampDiagnosticConsole();this._scheduleDiagnosticMeasure();this._syncPickerDiagnostics?.();};
      window.addEventListener('resize',this._diagnosticsResizeHandler,{passive:true});window.visualViewport?.addEventListener('resize',this._diagnosticsResizeHandler,{passive:true});
      if(window.PerformanceObserver){
        for(const type of ['layout-shift','longtask'])try{const observer=new PerformanceObserver((list)=>{for(const entry of list.getEntries()){if(type==='layout-shift'&&!entry.hadRecentInput)this._diagnostics.layoutShifts.push({value:entry.value,time:entry.startTime});if(type==='longtask')this._diagnostics.longTasks.push({duration:entry.duration,time:entry.startTime});}this._diagnostics[type==='layout-shift'?'layoutShifts':'longTasks']=this._diagnostics[type==='layout-shift'?'layoutShifts':'longTasks'].slice(-100);});observer.observe({type,buffered:true});this._diagnostics.performanceObservers.push(observer);}catch(_){}
      }
      this._diagnosticsMutationObserver=window.MutationObserver?new MutationObserver((records)=>{this._diagnostics.mutationEvents+=records.length;for(const record of records){const element=record.target?.nodeType===1?record.target:record.target?.parentElement;const region=element?.closest?.('#map,.leaflet-container')?'map':element?.closest?.('.diagnostic-console,.diagnostic-overlay')?'diagnostics':'app';this._diagnostics.mutationRegions[region]=(this._diagnostics.mutationRegions[region]||0)+1;}}):null;
      this._diagnosticsMutationObserver?.observe(this.shadow.getElementById('card-root'),{attributes:true,subtree:true});
      this._diagnosticsResizeObserver=window.ResizeObserver?new ResizeObserver((entries)=>{this._diagnostics.resizeCallbacks+=entries.length;this._scheduleDiagnosticMeasure();}):null;
      this._diagnosticRegistry().forEach((entry)=>this._diagnosticsResizeObserver?.observe(entry.element));
      this._prepareDiagnosticAssets();
      this._syncDiagnosticUi();this._scheduleDiagnosticMeasure();
    },

    _stopDiagnostics() {
      if(!this._diagnostics)return;
      this._diagnostics.enabled=false;this._diagnostics.selecting=false;this._diagnostics.live=false;this._diagnostics.visualsVisible=true;this._diagnostics.grid='off';
      Object.keys(this._diagnostics.overlays||{}).forEach((key)=>{this._diagnostics.overlays[key]=false;});
      this._diagnostics.selected=null;this._diagnostics.compare=null;this._diagnostics.hover=null;this._diagnostics.snapshot=null;
      if(this._diagnostics.raf)cancelAnimationFrame(this._diagnostics.raf);this._diagnostics.raf=null;
      window.removeEventListener('resize',this._diagnosticsResizeHandler);window.visualViewport?.removeEventListener('resize',this._diagnosticsResizeHandler);this._diagnosticsResizeHandler=null;
      this._diagnostics.performanceObservers.forEach((observer)=>observer.disconnect());this._diagnostics.performanceObservers=[];this._diagnosticsMutationObserver?.disconnect();this._diagnosticsMutationObserver=null;
      this._diagnosticsResizeObserver?.disconnect();this._diagnosticsResizeObserver=null;if(this._diagnostics.fpsRaf)cancelAnimationFrame(this._diagnostics.fpsRaf);this._diagnostics.fpsRaf=null;this._diagnostics.fpsRunning=false;this._hideDiagnosticPerformanceOverlay();
      this._removeDiagnosticSelectionListeners();this.shadow?.getElementById('diagnostic-overlay')?.replaceChildren();
      this._setDiagnosticVirtualStorm('off',{sync:false,render:false});
      if(this._diagnostics.virtualStorm){this._diagnostics.virtualStorm.cellCount=1;this._diagnostics.virtualStorm.extreme=false;this._diagnostics.virtualStorm.cells=0;this._diagnostics.virtualStorm.extremeCells=0;}
      if(this._statusClusterBrowseUiTimer)clearInterval(this._statusClusterBrowseUiTimer);this._statusClusterBrowseUiTimer=null;
      if(this._diagnostics.weatherLab?.lightning){this._diagnostics.weatherLab.lightning.densityMultiplier=1;this._diagnostics.weatherLab.lightning.ageProfile='mixed';this._diagnostics.weatherLab.lightning.pattern='standard';this._diagnostics.weatherLab.lightning.boundaryCases=false;this._diagnostics.weatherLab.lightning.lastStressRenders=0;this._diagnostics.weatherLab.lightning.stressSerial=0;this._diagnostics.weatherLab.lightning.lastStressAction='none';}
      this._setCompassCalibrationEnabled(false);this._setMedallionCalibrationEnabled(false);
      this.shadow?.getElementById('compass-calibration-modal-backdrop')?.setAttribute('aria-hidden','true');this._closeCompassCalibrationQuick(false);this._closeMedallionCalibration(false);
      this._syncDiagnosticUi();
    },

    _diagnosticConsoleBounds() {
      const node=this.shadow?.getElementById('diagnostic-console'),fullscreen=this.shadow?.getElementById('map-fullscreen-dialog');
      if(node&&fullscreen?.open&&node.parentNode===fullscreen){const rect=fullscreen.getBoundingClientRect();return {left:rect.left,top:rect.top,width:rect.width,height:rect.height};}
      const vv=window.visualViewport;return {left:vv?.offsetLeft||0,top:vv?.offsetTop||0,width:vv?.width||innerWidth,height:vv?.height||innerHeight};
    },

    _clampDiagnosticConsole() {
      const node=this.shadow?.getElementById('diagnostic-console'),head=node?.querySelector?.('#diagnostic-console-drag');if(!node||!head)return;const bounds=this._diagnosticConsoleBounds(),rect=node.getBoundingClientRect(),headRect=head.getBoundingClientRect(),reachableX=Math.max(80,Math.min(headRect.width,bounds.width)),reachableY=Math.max(36,Math.min(headRect.height,bounds.height)),left=Math.max(bounds.left-rect.width+reachableX,Math.min(bounds.left+bounds.width-reachableX,rect.left)),top=Math.max(bounds.top,Math.min(bounds.top+bounds.height-reachableY,rect.top));node.style.left=`${Math.round(left)}px`;node.style.top=`${Math.round(top)}px`;
    },

    _setDiagnosticColumnMode(columns) { this._diagnostics.columnMode=columns===1?1:2;try{localStorage.setItem('gewitterradar-diagnostic-columns',String(this._diagnostics.columnMode));}catch(_){}this._syncDiagnosticUi();this._clampDiagnosticConsole(); },

    _applyDiagnosticPreset(preset) {
      const all={ids:true,boxes:true,centers:true,axes:true,diagonals:true,baselines:true,padding:true,margin:true,spacing:true,safe:true,overflow:true,parent:true,alignment:true};
      this._diagnostics.overlays=preset==='minimal'?Object.fromEntries(Object.keys(all).map((key)=>[key,key==='ids'])):preset==='alignment'?{...all,padding:false,margin:false,spacing:false,safe:false,overflow:false}:preset==='spacing'?{...all,axes:false,diagonals:false,baselines:false,alignment:false}:{...all};
      this._diagnostics.grid=preset==='full'?'fine':preset==='minimal'?'off':'coarse';this._syncDiagnosticUi();
    },

    _diagnosticDestinationPoint(lat,lon,distanceKm,bearingDeg) {
      const radius=6371,angular=Math.max(0,Number(distanceKm)||0)/radius,bearing=(Number(bearingDeg)||0)*Math.PI/180,lat1=lat*Math.PI/180,lon1=lon*Math.PI/180;
      const lat2=Math.asin(Math.sin(lat1)*Math.cos(angular)+Math.cos(lat1)*Math.sin(angular)*Math.cos(bearing));
      const lon2=lon1+Math.atan2(Math.sin(bearing)*Math.sin(angular)*Math.cos(lat1),Math.cos(angular)-Math.sin(lat1)*Math.sin(lat2));
      return {lat:lat2*180/Math.PI,lon:((lon2*180/Math.PI+540)%360)-180};
    },

    _setDiagnosticVirtualStormCellCount(value) {
      const d=this._diagnostics;if(!d)return;const state=d.virtualStorm||(d.virtualStorm={scenario:'off',ownedIds:[],startedAt:0,count:0,cells:0,cellCount:1,extreme:false,extremeCells:0});
      state.cellCount=Math.max(1,Math.min(5,Math.round(Number(value)||1)));
      if(state.scenario!=='off'&&d.enabled)this._setDiagnosticVirtualStorm(state.scenario);else this._syncDiagnosticUi();
    },

    _setDiagnosticVirtualStormExtreme(enabled) {
      const d=this._diagnostics;if(!d)return;const state=d.virtualStorm||(d.virtualStorm={scenario:'off',ownedIds:[],startedAt:0,count:0,cells:0,cellCount:1,extreme:false,extremeCells:0});
      state.extreme=!!enabled;
      if(state.scenario!=='off'&&d.enabled)this._setDiagnosticVirtualStorm(state.scenario);else this._syncDiagnosticUi();
    },

    _buildDiagnosticVirtualStorm(scenario,{cellCount=1,extreme=false}={}) {
      const home=this._home(),observation=Math.max(1,this._observationRadiusValue()),storm=Math.max(.5,Math.min(this._stormRadiusValue(),observation)),danger=Math.max(.2,Math.min(this._dangerRadiusValue(),storm)),now=Date.now();
      const between=(inner,outer,ratio=.56)=>outer>inner+.4?inner+(outer-inner)*ratio:Math.max(.2,outer*.72);
      const centers={danger:Math.max(.2,Math.min(danger*.68,danger-.05)),storm:between(danger,storm,.58),observation:between(storm,observation,.58),outside:observation+Math.max(1.5,observation*.18)};
      const zoneSpec={
        danger:{bearing:32,count:7,ages:[.3,.7,1.1,1.7,2.5,3.6,5.0]},
        storm:{bearing:142,count:9,ages:[.4,.9,1.6,2.4,3.3,4.6,6.2,8.1,9.2]},
        observation:{bearing:252,count:10,ages:[.6,1.4,3.1,6.7,11,18,31,47,68,96]},
        outside:{bearing:318,count:8,ages:[.8,1.8,3.6,7.2,14,29,54,88]}
      };
      const zones=scenario==='all'?['observation','storm','danger']:[scenario],cellsPerZone=Math.max(1,Math.min(5,Math.round(Number(cellCount)||1))),zoom=Number(this._map?.getZoom?.())||7,extremeThreshold=this._clusterExtremeThreshold(zoom);
      const lightningLab=this._diagnostics?.weatherLab?.lightning||{},densityMultiplier=[1,5,20].includes(Number(lightningLab.densityMultiplier))?Number(lightningLab.densityMultiplier):1,ageProfile=['mixed','fresh','stale'].includes(lightningLab.ageProfile)?lightningLab.ageProfile:'mixed',pattern=['standard','compact','wide','line','ring','overlap','duplicate'].includes(lightningLab.pattern)?lightningLab.pattern:'standard',boundaryCases=!!lightningLab.boundaryCases;
      const bearingOffsets=[0,72,144,216,288],radialOffsets=[0,.09,-.08,.15,-.14];
      const result=[];let index=0,cellsBuilt=0,extremeCells=0;
      const boundsFor=(zone)=>zone==='danger'?{low:.15,high:Math.max(.2,danger*.88)}:zone==='storm'?{low:Math.min(storm*.82,danger+Math.max(.25,(storm-danger)*.16)),high:Math.max(danger+.3,storm*.90)}:zone==='outside'?{low:observation+Math.max(.25,observation*.025),high:observation+Math.max(3,observation*.35)}:{low:Math.min(observation*.82,storm+Math.max(.35,(observation-storm)*.14)),high:Math.max(storm+.4,observation*.91)};
      for(const zone of zones){
        const spec=zoneSpec[zone];if(!spec)continue;const bounds=boundsFor(zone);
        for(let cellIndex=0;cellIndex<cellsPerZone;cellIndex++){
          const isExtreme=!!extreme&&cellIndex===cellsPerZone-1,baseCenter=centers[zone],cellCenter=Math.max(bounds.low,Math.min(bounds.high,baseCenter*(1+radialOffsets[cellIndex]))),cellBearing=(pattern==='overlap'?spec.bearing:(spec.bearing+bearingOffsets[cellIndex]))%360;
          const normalCount=Math.min(2000,spec.count*densityMultiplier),strikeCount=isExtreme?Math.max(normalCount,extremeThreshold+6):normalCount,freshTarget=isExtreme?extremeThreshold+2:0,tightSpread=Math.max(.025,Math.min(.24,cellCenter*.006));
          cellsBuilt+=1;if(isExtreme)extremeCells+=1;
          for(let i=0;i<strikeCount;i++){
            const clustered=i<Math.max(4,strikeCount-2),baseRing=clustered?((i%7)-3)*(tightSpread/3):Math.max(.55,cellCenter*.065)*(i%2?1:-1),baseBearingOffset=clustered?((i%11)-5)*.08:(i%2?19:-23);
            let ring=baseRing,bearing=cellBearing+baseBearingOffset;
            if(pattern==='compact'){ring*=.25;bearing=cellBearing+baseBearingOffset*.22;}
            else if(pattern==='wide'){ring*=3.4;bearing=cellBearing+baseBearingOffset*2.8+((i%9)-4)*1.1;}
            else if(pattern==='line'){ring=((i%31)-15)*Math.max(tightSpread*.42,.035);bearing=cellBearing+((i%5)-2)*.05;}
            else if(pattern==='ring'){ring=((i%3)-1)*tightSpread*.18;bearing=cellBearing-10+(i%29)*(20/28);}
            else if(pattern==='overlap'){ring*=.48;bearing=cellBearing+baseBearingOffset*.35;}
            else if(pattern==='duplicate'){ring=(i%4===0)?0:baseRing*.18;bearing=(i%4===0)?cellBearing:cellBearing+baseBearingOffset*.16;}
            const distance=Math.max(.12,Math.min(bounds.high,Math.max(bounds.low,cellCenter+ring))),point=this._diagnosticDestinationPoint(home.lat,home.lon,distance,bearing);
            const mixedAge=isExtreme?(i<freshTarget?(.35+(i%13)*.55):[14,34,58,92][(i-freshTarget)%4]):spec.ages[i%spec.ages.length];
            const age=ageProfile==='fresh'?(.15+(i%20)*.32):ageProfile==='stale'?(35+(i%24)*3.4):mixedAge;
            result.push({id:`__gew_diag_storm__:${zone}:${cellIndex}:${index++}`,lat:point.lat,lon:point.lon,distance,azimuth:(bearing+360)%360,firstSeen:now-age*60000,lastSeen:now,diagnosticVirtualStorm:true,diagnosticZone:zone,diagnosticCell:cellIndex+1,diagnosticExtremeCell:isExtreme,diagnosticDensityMultiplier:densityMultiplier,diagnosticAgeProfile:ageProfile,diagnosticPattern:pattern});
          }
        }
      }
      if(boundaryCases){
        const boundaries=[['danger',danger,14],['storm',storm,28],['observation',observation,42]];
        for(const [name,radius,bearingBase] of boundaries){for(const [offset,label] of [[-.01,'inside'],[0,'exact'],[.01,'outside']]){const distance=Math.max(.05,radius+offset),bearing=bearingBase+(label==='inside'?-1:label==='outside'?1:0),point=this._diagnosticDestinationPoint(home.lat,home.lon,distance,bearing),age=ageProfile==='stale'?45:ageProfile==='fresh'?.25:2.5;result.push({id:`__gew_diag_boundary__:${name}:${label}:${index++}`,lat:point.lat,lon:point.lon,distance,azimuth:(bearing+360)%360,firstSeen:now-age*60000,lastSeen:now,diagnosticVirtualStorm:true,diagnosticBoundary:name,diagnosticBoundaryPosition:label,diagnosticAgeProfile:ageProfile});}}
      }
      return {strikes:result,radii:{observation,storm,danger},home,cells:cellsBuilt,extremeCells,cellCount:cellsPerZone,extreme:!!extreme,zoom,extremeThreshold,densityMultiplier,ageProfile,pattern,boundaryCases};
    },

    _diagnosticInjectStressCellV40802(zone='danger') {
      const d=this._diagnostics,lab=d?.weatherLab?.lightning,state=d?.virtualStorm;if(!d?.enabled||!lab||!state)return;
      const built=this._buildDiagnosticVirtualStorm(zone,{cellCount:1,extreme:zone==='danger'}),serial=++lab.stressSerial,limit=zone==='danger'?Math.min(40,built.strikes.length):Math.min(24,built.strikes.length);
      for(let i=0;i<limit;i++){const source=built.strikes[i],id=`__gew_diag_stress__:${zone}:${serial}:${i}`,strike={...source,id,diagnosticStress:true,diagnosticStressSerial:serial};this._strikes.set(id,strike);state.ownedIds.push(id);}
      state.count=(state.ownedIds||[]).length;lab.lastStressAction=zone==='danger'?`Gefahr-Burst ${limit}`:`Neue Zelle ${zone} ${limit}`;this._render();this._renderMapMarkers?.();this._syncDiagnosticUi();
    },

    _diagnosticClusterSplitMergeStressV40802() {
      const d=this._diagnostics,lab=d?.weatherLab?.lightning,state=d?.virtualStorm;if(!d?.enabled||!lab||!state||state.scenario==='off')return;
      const original=lab.pattern||'standard';for(let i=0;i<10;i++){lab.pattern=i%2===0?'compact':'wide';this._setDiagnosticVirtualStorm(state.scenario,{sync:false,render:false});this._renderMapMarkers?.();}
      lab.pattern=original;this._setDiagnosticVirtualStorm(state.scenario,{sync:false,render:true});lab.lastStressAction='Split/Merge ×10';this._syncDiagnosticUi();
    },

    _setDiagnosticVirtualStorm(scenario,{sync=true,render=true}={}) {
      const d=this._diagnostics;if(!d)return;const state=d.virtualStorm||(d.virtualStorm={scenario:'off',ownedIds:[],startedAt:0,count:0,cells:0,cellCount:1,extreme:false,extremeCells:0}),next=['off','observation','storm','danger','outside','all'].includes(scenario)?scenario:'off',cellCount=Math.max(1,Math.min(5,Math.round(Number(state.cellCount)||1))),extreme=!!state.extreme;
      for(const id of state.ownedIds||[])this._strikes?.delete(id);state.ownedIds=[];state.count=0;state.cells=0;state.extremeCells=0;state.scenario='off';state.startedAt=0;state.radii=null;state.cellCount=cellCount;state.extreme=extreme;
      if(next!=='off'&&d.enabled){const built=this._buildDiagnosticVirtualStorm(next,{cellCount,extreme});for(const strike of built.strikes){this._strikes.set(strike.id,strike);state.ownedIds.push(strike.id);}state.scenario=next;state.count=built.strikes.length;state.cells=built.cells;state.extremeCells=built.extremeCells;state.startedAt=Date.now();state.radii=built.radii;state.zoom=built.zoom;state.extremeThreshold=built.extremeThreshold;state.densityMultiplier=built.densityMultiplier;state.ageProfile=built.ageProfile;state.pattern=built.pattern;state.boundaryCases=built.boundaryCases;}
      if(render){this._render();this._renderMapMarkers?.();}if(sync)this._syncDiagnosticUi();
    },

    _syncDiagnosticUi() {
      const d=this._diagnostics,consoleNode=this.shadow?.getElementById('diagnostic-console'),overlay=this.shadow?.getElementById('diagnostic-overlay'),root=this.shadow?.getElementById('card-root'),toggle=this.shadow?.getElementById('settings-diagnostics-toggle');
      consoleNode?.classList.toggle('open',d.enabled);root?.classList.toggle('diagnostic-master-active',d.enabled);root?.classList.toggle('diagnostic-visuals-hidden',d.enabled&&!d.visualsVisible);overlay?.classList.toggle('active',d.enabled&&d.visualsVisible);overlay?.classList.toggle('coarse',d.grid==='coarse');overlay?.classList.toggle('fine',d.grid==='fine');
      const hideChildren=d.enabled&&!d.visualsVisible;['compass-calibration-modal-backdrop','medallion-calibration-modal-backdrop','diagnostic-performance-backdrop'].forEach((id)=>this.shadow?.getElementById(id)?.classList.toggle('diagnostic-childtools-hidden',hideChildren));
      toggle?.classList.toggle('on',d.enabled);toggle?.setAttribute('aria-checked',d.enabled?'true':'false');
      const labels=[['settings-diagnostic-section-title',0],['diagnostic-console-title',1],['diagnostic-exit',3],['diagnostic-copy',9],['diagnostic-snapshot',10],['diagnostic-performance',11]];labels.forEach(([id,index])=>{const node=this.shadow?.getElementById(id);if(node)node.textContent=this._diagnosticText(index);});
      const modeLabel=DIAGNOSTIC_MODE_LABEL[this._languageValue()]||DIAGNOSTIC_MODE_LABEL[LANGUAGE_DEFAULT],settingsMode=this.shadow?.getElementById('settings-diagnostics-label');if(settingsMode)settingsMode.textContent=modeLabel;
      const exitTop=this.shadow?.getElementById('diagnostic-exit-top');if(exitTop){exitTop.textContent='×';exitTop.title=this._diagnosticText(3);exitTop.setAttribute('aria-label',this._diagnosticText(3));}
      if(toggle){toggle.title=this._diagnosticText(d.enabled?3:2);toggle.setAttribute('aria-label',toggle.title);}
      const virtualStorm=d.virtualStorm||{scenario:'off',count:0,cells:0,cellCount:1,extreme:false,extremeCells:0};const state=this.shadow?.getElementById('diagnostic-console-state');if(state)state.textContent=`${this._diagnosticText(6)} · ${this._diagnosticTerm(d.live?0:1)}${virtualStorm.scenario!=='off'?` · ${this._diagnosticStormText(6)}`:''}${d.visualsVisible?'':` · ${this._diagnosticText(7)}`}`;
      const visuals=this.shadow?.getElementById('diagnostic-visuals');if(visuals)visuals.textContent=this._diagnosticText(d.visualsVisible?4:5);
      this.shadow?.querySelectorAll('[data-diagnostic-grid]').forEach((button)=>button.classList.toggle('active',button.dataset.diagnosticGrid===d.grid));this.shadow?.querySelectorAll('[data-diagnostic-overlay]').forEach((button)=>button.classList.toggle('active',!!d.overlays[button.dataset.diagnosticOverlay]));
      consoleNode?.classList.toggle('columns-1',d.columnMode===1);[1,2].forEach((columns)=>{const button=this.shadow?.getElementById(`diagnostic-columns-${columns}`);button?.classList.toggle('active',d.columnMode===columns);button?.setAttribute('aria-pressed',d.columnMode===columns?'true':'false');});
      this.shadow?.getElementById('diagnostic-live')?.classList.toggle('active',d.live);this.shadow?.getElementById('diagnostic-freeze')?.classList.toggle('active',!d.live);const selectButton=this.shadow?.getElementById('diagnostic-select');selectButton?.classList.toggle('active',d.selecting);if(selectButton)selectButton.textContent=d.selecting?(DIAGNOSTIC_SELECT_ACTIVE[this._languageValue()]||DIAGNOSTIC_SELECT_ACTIVE[LANGUAGE_DEFAULT]):this._diagnosticText(8);
      const live=this.shadow?.getElementById('diagnostic-live'),freeze=this.shadow?.getElementById('diagnostic-freeze'),download=this.shadow?.getElementById('diagnostic-download');if(live)live.textContent=this._diagnosticTerm(0);if(freeze)freeze.textContent=this._diagnosticTerm(1);if(download)download.textContent=this._diagnosticTerm(9);
      const auxLabels=[['diagnostic-grid-title',0],['diagnostic-overlays-title',1],['diagnostic-presets-title',2],['diagnostic-copy-json',3],['diagnostic-compass-log',4]];auxLabels.forEach(([id,index])=>{const node=this.shadow?.getElementById(id);if(node)node.textContent=this._diagnosticAux(index);});const table=this.shadow?.getElementById('diagnostic-panel-table');if(table)table.setAttribute('aria-label',this._diagnosticAux(5));const minimize=this.shadow?.getElementById('diagnostic-minimize');if(minimize)minimize.setAttribute('aria-label',this._diagnosticAux(6));
      const overlayTerms={ids:0,boxes:1,centers:2,axes:3,diagonals:4,baselines:5,padding:6,margin:7,spacing:8,safe:9,overflow:10,parent:11,alignment:12};this.shadow?.querySelectorAll('[data-diagnostic-overlay]').forEach((button)=>{button.textContent=this._diagnosticOverlayTerm(overlayTerms[button.dataset.diagnosticOverlay]);});
      const performanceTitle=this.shadow?.getElementById('diagnostic-performance-title'),performanceNote=this.shadow?.getElementById('diagnostic-performance-note');if(performanceTitle)performanceTitle.textContent=this._diagnosticText(11);if(performanceNote&&!this.shadow?.getElementById('diagnostic-performance-backdrop')?.classList.contains('complete'))performanceNote.textContent=this._diagnosticPerformanceText(0);
      const performanceDownload=this.shadow?.getElementById('diagnostic-performance-download'),performanceCancel=this.shadow?.getElementById('diagnostic-performance-cancel');if(performanceDownload)performanceDownload.textContent=this._diagnosticPerformanceText(2).toUpperCase();if(performanceCancel)performanceCancel.textContent=this._diagnosticPerformanceText(3).toUpperCase();
      const compassTool=this.shadow?.getElementById('diagnostic-compass-calibration'),medallionTool=this.shadow?.getElementById('diagnostic-medallion-calibration');if(compassTool)compassTool.textContent=this._t('settings.compass_calibration');if(medallionTool)medallionTool.textContent=this._medallionText(1);
      const gridTerms={off:2,coarse:3,fine:4};this.shadow?.querySelectorAll('[data-diagnostic-grid]').forEach((button)=>{button.textContent=this._diagnosticTerm(gridTerms[button.dataset.diagnosticGrid]);});const presetTerms={minimal:5,alignment:6,spacing:7,full:8};this.shadow?.querySelectorAll('[data-diagnostic-preset]').forEach((button)=>{button.textContent=this._diagnosticTerm(presetTerms[button.dataset.diagnosticPreset]);});
      const stormTitle=this.shadow?.getElementById('diagnostic-virtual-storm-title');if(stormTitle)stormTitle.textContent=this._diagnosticStormText(0);const stormIndexes={off:1,observation:2,storm:3,danger:4,all:5};this.shadow?.querySelectorAll('[data-diagnostic-storm]').forEach((button)=>{const scenario=button.dataset.diagnosticStorm;button.textContent=scenario==='outside'?'AUSSEN':this._diagnosticStormText(stormIndexes[scenario]);button.classList.toggle('active',virtualStorm.scenario===scenario);button.setAttribute('aria-pressed',virtualStorm.scenario===scenario?'true':'false');});
      const cellsLabel=this.shadow?.getElementById('diagnostic-virtual-storm-cells-label'),cellsValue=this.shadow?.getElementById('diagnostic-storm-cells-value'),cellsMinus=this.shadow?.getElementById('diagnostic-storm-cells-minus'),cellsPlus=this.shadow?.getElementById('diagnostic-storm-cells-plus'),extremeButton=this.shadow?.getElementById('diagnostic-storm-extreme');if(cellsLabel)cellsLabel.textContent=this._diagnosticStormText(9);if(cellsValue)cellsValue.textContent=String(virtualStorm.cellCount||1);if(cellsMinus){cellsMinus.disabled=(virtualStorm.cellCount||1)<=1;cellsMinus.setAttribute('aria-label',`${this._diagnosticStormText(9)} −`);}if(cellsPlus){cellsPlus.disabled=(virtualStorm.cellCount||1)>=5;cellsPlus.setAttribute('aria-label',`${this._diagnosticStormText(9)} +`);}if(extremeButton){extremeButton.textContent=this._diagnosticStormText(11);extremeButton.classList.toggle('active',!!virtualStorm.extreme);extremeButton.setAttribute('aria-pressed',virtualStorm.extreme?'true':'false');}
      const stormState=this.shadow?.getElementById('diagnostic-virtual-storm-state');if(stormState){const radii=virtualStorm.radii,modeLabel=virtualStorm.extreme?this._diagnosticStormText(11):this._diagnosticStormText(10);stormState.textContent=virtualStorm.scenario==='off'?`${this._diagnosticStormText(7)} · ${this._diagnosticStormText(8)}`:`${this._diagnosticStormText(6)} · ${virtualStorm.cells||virtualStorm.cellCount||1} ${this._diagnosticStormText(9)} · ${virtualStorm.count} ${this._diagnosticStormText(12)} · ${modeLabel} · ${radii?`${this._formatRadiusDistance(radii.observation).text} / ${this._formatRadiusDistance(radii.storm).text} / ${this._formatRadiusDistance(radii.danger).text}`:''}
${this._diagnosticStormText(8)}`;}
      this._syncDiagnosticWeatherLabV40802?.();this._syncDiagnosticClusterBrowseV40802?.();
      this._syncPickerDiagnostics?.();
      if(d.enabled){if(d.live)this._scheduleDiagnosticMeasure();else this._renderDiagnosticOverlay();}
    },

    _setDiagnosticSelecting(enabled) {
      this._diagnostics.selecting=!!enabled;this._removeDiagnosticSelectionListeners();if(!enabled){this._syncDiagnosticUi();return;}
      this._diagnosticSelectMove=(event)=>{const target=this._diagnosticEntryFromEvent(event);if(target){this._diagnostics.hover=target.id;this._scheduleDiagnosticMeasure();}};
      this._diagnosticSelectClick=(event)=>{const path=event.composedPath?.()||[];if(path.some((node)=>node?.matches?.('button,a,input,select,textarea,[role="button"],[role="link"],[contenteditable="true"]')))return;const target=this._diagnosticEntryFromEvent(event);if(!target)return;event.preventDefault();event.stopPropagation();if(this._diagnostics.selected&&this._diagnostics.selected!==target.id)this._diagnostics.compare=this._diagnostics.selected;this._diagnostics.selected=target.id;this._syncDiagnosticUi();};
      this._diagnosticSelectKey=(event)=>{if(event.key==='Escape'){this._setDiagnosticSelecting(false);}};
      this.shadow.addEventListener('pointermove',this._diagnosticSelectMove,true);this.shadow.addEventListener('click',this._diagnosticSelectClick,true);document.addEventListener('keydown',this._diagnosticSelectKey,true);this._syncDiagnosticUi();
    },

    _removeDiagnosticSelectionListeners() { if(!this.shadow)return;this.shadow.removeEventListener('pointermove',this._diagnosticSelectMove,true);this.shadow.removeEventListener('click',this._diagnosticSelectClick,true);document.removeEventListener('keydown',this._diagnosticSelectKey,true);this._diagnosticSelectMove=this._diagnosticSelectClick=this._diagnosticSelectKey=null; },
    _diagnosticEntryFromEvent(event) { const path=event.composedPath?.()||[];if(path.includes(this.shadow?.getElementById('diagnostic-console')))return null;return this._diagnosticRegistry().find((entry)=>path.includes(entry.element))||null; },
    _scheduleDiagnosticMeasure() { if(!this._diagnostics.enabled||!this._diagnostics.live||this._diagnostics.raf)return;this._diagnostics.raf=requestAnimationFrame(()=>{this._diagnostics.raf=null;this._renderDiagnosticOverlay();}); },

    _measureDiagnosticPanel(entry) {
      const rect=entry.element.getBoundingClientRect(),style=getComputedStyle(entry.element),parent=entry.element.parentElement?.getBoundingClientRect(),number=(value)=>Number.parseFloat(value)||0;
      const edges={paddingTop:number(style.paddingTop),paddingRight:number(style.paddingRight),paddingBottom:number(style.paddingBottom),paddingLeft:number(style.paddingLeft),marginTop:number(style.marginTop),marginRight:number(style.marginRight),marginBottom:number(style.marginBottom),marginLeft:number(style.marginLeft)};
      return {id:entry.id,name:entry.name,x:rect.x,y:rect.y,width:rect.width,height:rect.height,right:rect.right,bottom:rect.bottom,centerX:rect.x+rect.width/2,centerY:rect.y+rect.height/2,aspect:rect.width/(rect.height||1),baselineY:rect.bottom-edges.paddingBottom,parent:entry.element.parentElement?.className||entry.element.parentElement?.tagName,parentBounds:parent?{x:parent.x,y:parent.y,width:parent.width,height:parent.height,right:parent.right,bottom:parent.bottom}:null,boxEdges:edges,scroll:{clientWidth:entry.element.clientWidth,clientHeight:entry.element.clientHeight,scrollWidth:entry.element.scrollWidth,scrollHeight:entry.element.scrollHeight,overflowing:entry.element.scrollWidth>entry.element.clientWidth+1||entry.element.scrollHeight>entry.element.clientHeight+1},css:{display:style.display,position:style.position,width:style.width,height:style.height,minWidth:style.minWidth,maxWidth:style.maxWidth,minHeight:style.minHeight,maxHeight:style.maxHeight,margin:style.margin,padding:style.padding,gap:style.gap,rowGap:style.rowGap,columnGap:style.columnGap,overflow:style.overflow,overflowX:style.overflowX,overflowY:style.overflowY,aspectRatio:style.aspectRatio,transform:style.transform,transformOrigin:style.transformOrigin,alignItems:style.alignItems,justifyContent:style.justifyContent,alignSelf:style.alignSelf,justifySelf:style.justifySelf,flex:style.flex,gridArea:style.gridArea,zIndex:style.zIndex}};
    },

    _appendDiagnosticNode(overlay,className,style,text='') { const node=document.createElement('div');node.className=className;node.style.cssText=style;if(text)node.textContent=text;overlay.append(node);return node; },
    _appendDiagnosticLine(overlay,x1,y1,x2,y2,className='') { const dx=x2-x1,dy=y2-y1,length=Math.hypot(dx,dy),angle=Math.atan2(dy,dx)*180/Math.PI;return this._appendDiagnosticNode(overlay,`diagnostic-line ${className}`,`left:${x1}px;top:${y1}px;width:${length}px;transform:rotate(${angle}deg)`); },

    _renderDiagnosticMainGrid(overlay) {
      if(!overlay||!this._diagnostics.enabled||!this._diagnostics.visualsVisible||this._diagnostics.grid==='off')return;
      if(this.shadow?.getElementById('map-fullscreen-dialog')?.open)return;
      const main=this.shadow?.querySelector('.main-grid');if(!main)return;
      const rect=main.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
      const columns=10,rows=10,cellWidth=rect.width/columns,cellHeight=rect.height/rows;
      this._appendDiagnosticNode(overlay,'diagnostic-main-frame',`left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px`);
      this._appendDiagnosticNode(overlay,'diagnostic-main-title',`left:${rect.left+3}px;top:${Math.max(2,rect.top-18)}px`,'MAIN · A1–J10');
      for(let row=0;row<rows;row++){for(let column=0;column<columns;column++){const label=`${String.fromCharCode(65+column)}${row+1}`;const cell=this._appendDiagnosticNode(overlay,'diagnostic-main-cell',`left:${rect.left+column*cellWidth}px;top:${rect.top+row*cellHeight}px;width:${cellWidth}px;height:${cellHeight}px`,label);cell.dataset.diagnosticMainCell=label;}}
    },

    _renderDiagnosticFullscreenGrid(overlay) {
      if(!overlay||!this._diagnostics?.enabled||!this._diagnostics?.visualsVisible||this._diagnostics?.grid==='off')return;
      const dialog=this.shadow?.getElementById('map-fullscreen-dialog');if(!dialog?.open)return;
      const rect=dialog.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
      const columns=10,rows=10,cellWidth=rect.width/columns,cellHeight=rect.height/rows;
      this._appendDiagnosticNode(overlay,'diagnostic-main-frame',`left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px`);
      this._appendDiagnosticNode(overlay,'diagnostic-main-title',`left:${rect.left+3}px;top:${Math.max(2,rect.top+3)}px`,'VOLLBILD · FS-A1–FS-J10');
      for(let row=0;row<rows;row++){for(let column=0;column<columns;column++){const label=`FS-${String.fromCharCode(65+column)}${row+1}`;const cell=this._appendDiagnosticNode(overlay,'diagnostic-main-cell',`left:${rect.left+column*cellWidth}px;top:${rect.top+row*cellHeight}px;width:${cellWidth}px;height:${cellHeight}px`,label);cell.dataset.diagnosticFullscreenCell=label;}}
    },

    _renderDiagnosticOverlay() {
      if(!this._diagnostics.enabled)return;
      const overlay=this.shadow?.getElementById('diagnostic-overlay');
      const panels=!this._diagnostics.live&&this._diagnostics.lastPanels?.length?this._diagnostics.lastPanels:this._diagnosticRegistry().map((entry)=>this._measureDiagnosticPanel(entry));
      if(this._diagnostics.live)this._diagnostics.lastPanels=panels;
      const profile=this._responsiveDiagnosticProfile(this.getBoundingClientRect().width);
      const lastProfile=this._diagnostics.responsiveHistory.at(-1);
      if(!lastProfile||lastProfile.profile!==profile.profile||Math.abs(lastProfile.cardWidth-profile.cardWidth)>=1){
        this._diagnostics.responsiveHistory.push({timestamp:performance.now(),...profile});
        this._diagnostics.responsiveHistory=this._diagnostics.responsiveHistory.slice(-50);
      }
      const selected=panels.find((panel)=>panel.id===this._diagnostics.selected)||panels[0];
      const compare=panels.find((panel)=>panel.id===this._diagnostics.compare);
      const alignment=compare&&selected?{from:compare.id,to:selected.id,centerX:selected.centerX-compare.centerX,centerY:selected.centerY-compare.centerY,left:selected.x-compare.x,right:selected.right-compare.right,top:selected.y-compare.y,bottom:selected.bottom-compare.bottom,width:selected.width-compare.width,height:selected.height-compare.height,horizontalGap:Math.max(0,Math.max(selected.x,compare.x)-Math.min(selected.right,compare.right)),verticalGap:Math.max(0,Math.max(selected.y,compare.y)-Math.min(selected.bottom,compare.bottom)),centerDistance:Math.hypot(selected.centerX-compare.centerX,selected.centerY-compare.centerY)}:null;
      if(overlay){
        overlay.replaceChildren();
        if(this._diagnostics.visualsVisible){
          this._renderDiagnosticMainGrid(overlay);
          this._renderDiagnosticFullscreenGrid(overlay);
          const o=this._diagnostics.overlays;
          for(const panel of panels){
            if(o.boxes){const box=this._appendDiagnosticNode(overlay,`diagnostic-panel-box${panel.id===selected?.id?' selected':''}`,`left:${panel.x}px;top:${panel.y}px;width:${panel.width}px;height:${panel.height}px`);box.style.setProperty('--diagnostic-panel',panel.id);}
            if(o.ids)this._appendDiagnosticNode(overlay,'diagnostic-panel-badge',`left:${panel.x+3}px;top:${panel.y+3}px`,`${panel.id} · ${panel.name}`);
            if(o.centers)this._appendDiagnosticNode(overlay,'diagnostic-dot',`left:${panel.centerX}px;top:${panel.centerY}px`);
            if(o.axes){this._appendDiagnosticLine(overlay,panel.centerX,panel.y,panel.centerX,panel.bottom,'vertical');this._appendDiagnosticLine(overlay,panel.x,panel.centerY,panel.right,panel.centerY);}
            if(o.diagonals){this._appendDiagnosticLine(overlay,panel.x,panel.y,panel.right,panel.bottom,'diagonal');this._appendDiagnosticLine(overlay,panel.right,panel.y,panel.x,panel.bottom,'diagonal');}
            if(o.baselines)this._appendDiagnosticLine(overlay,panel.x,panel.baselineY,panel.right,panel.baselineY,'baseline');
            if(o.padding){const e=panel.boxEdges;this._appendDiagnosticNode(overlay,'diagnostic-rect padding',`left:${panel.x+e.paddingLeft}px;top:${panel.y+e.paddingTop}px;width:${Math.max(0,panel.width-e.paddingLeft-e.paddingRight)}px;height:${Math.max(0,panel.height-e.paddingTop-e.paddingBottom)}px`);}
            if(o.margin){const e=panel.boxEdges;this._appendDiagnosticNode(overlay,'diagnostic-rect margin',`left:${panel.x-e.marginLeft}px;top:${panel.y-e.marginTop}px;width:${panel.width+e.marginLeft+e.marginRight}px;height:${panel.height+e.marginTop+e.marginBottom}px`);}
            if(o.parent&&panel.parentBounds)this._appendDiagnosticNode(overlay,'diagnostic-rect parent',`left:${panel.parentBounds.x}px;top:${panel.parentBounds.y}px;width:${panel.parentBounds.width}px;height:${panel.parentBounds.height}px`);
            if(o.overflow&&panel.scroll.overflowing)this._appendDiagnosticNode(overlay,'diagnostic-rect overflow',`left:${panel.x}px;top:${panel.y}px;width:${panel.width}px;height:${panel.height}px`);
            if(o.spacing){const gap=panel.css.gap||`${panel.css.rowGap} / ${panel.css.columnGap}`;this._appendDiagnosticNode(overlay,'diagnostic-label',`left:${panel.right-42}px;top:${panel.bottom-12}px`,`GAP ${gap}`);}
          }

          if(o.safe){const vv=window.visualViewport,left=vv?.offsetLeft||0,top=vv?.offsetTop||0,width=vv?.width||innerWidth,height=vv?.height||innerHeight;this._appendDiagnosticNode(overlay,'diagnostic-rect safe',`left:${left+8}px;top:${top+8}px;width:${Math.max(0,width-16)}px;height:${Math.max(0,height-16)}px`);}
          if(o.alignment&&selected&&compare){this._appendDiagnosticLine(overlay,compare.centerX,compare.centerY,selected.centerX,selected.centerY,'alignment');for(const y of [selected.y,selected.centerY,selected.bottom])this._appendDiagnosticLine(overlay,Math.min(selected.x,compare.x),y,Math.max(selected.right,compare.right),y,'alignment');for(const x of [selected.x,selected.centerX,selected.right])this._appendDiagnosticLine(overlay,x,Math.min(selected.y,compare.y),x,Math.max(selected.bottom,compare.bottom),'alignment');}
          if(o.spacing&&selected&&compare){this._appendDiagnosticLine(overlay,compare.centerX,compare.centerY,selected.centerX,selected.centerY,'gap');this._appendDiagnosticNode(overlay,'diagnostic-label',`left:${(compare.centerX+selected.centerX)/2}px;top:${(compare.centerY+selected.centerY)/2}px`,`Δ ${Math.hypot(selected.centerX-compare.centerX,selected.centerY-compare.centerY).toFixed(1)} px`);}
        }
      }
      const readout=this.shadow?.getElementById('diagnostic-readout');if(readout&&selected)readout.textContent=[`${selected.id} · ${selected.name}`,`X/Y ${selected.x.toFixed(2)} / ${selected.y.toFixed(2)}`,`W/H ${selected.width.toFixed(2)} / ${selected.height.toFixed(2)}`,`Center ${selected.centerX.toFixed(2)} / ${selected.centerY.toFixed(2)}`,`Aspect ${selected.aspect.toFixed(4)}`,`Parent ${selected.parent}`,`Padding ${selected.css.padding}`,`Margin ${selected.css.margin}`,`Overflow ${selected.css.overflow}`,`Transform ${selected.css.transform}`,`Transform origin ${selected.css.transformOrigin}`,`Z-index ${selected.css.zIndex}`,...(alignment?[``,`COMPARE ${alignment.from} ↔ ${alignment.to}`,...Object.entries(alignment).filter(([,value])=>typeof value==='number').map(([key,value])=>`${key}: ${value.toFixed(2)} px`)]:[])].join('\n');
      const table=this.shadow?.getElementById('diagnostic-panel-table');if(table)table.textContent=['ID  PANEL                     X       Y       W       H       CX      CY',...panels.map((p)=>`${p.id.padEnd(3)} ${p.name.slice(0,22).padEnd(22)} ${p.x.toFixed(1).padStart(7)} ${p.y.toFixed(1).padStart(7)} ${p.width.toFixed(1).padStart(7)} ${p.height.toFixed(1).padStart(7)} ${p.centerX.toFixed(1).padStart(7)} ${p.centerY.toFixed(1).padStart(7)}`)].join('\n');
    },

    _responsiveDiagnosticProfile(cardWidth) { return {cardWidth,profile:cardWidth<=720?'mobile':cardWidth<=960?'tablet-medium':cardWidth<=1100?'tablet-wide':'desktop',mobileStack:cardWidth<=1100,tabletEnlargement:cardWidth>=721&&cardWidth<=960,breakpointsPx:[720,960,1100,1250,1280],cardPadding:getComputedStyle(this.shadow.getElementById('card-root')).padding}; },
    _prepareDiagnosticAssets() {
      if(this._diagnostics.assetLoadPromise)return this._diagnostics.assetLoadPromise;
      const urls=[TREND_MEDALLION_IMAGE,TREND_ARROW_IMAGE,...COMPASS_DESIGNS.map((design)=>design.frame),...COMPASS_SELECTOR_FRAME_IMAGES].filter(Boolean);
      this._diagnostics.assetLoadPromise=Promise.all(urls.map((url)=>new Promise((resolve)=>{const image=new Image(),started=performance.now(),asset=url.split('/').pop()?.split('?')[0];image.onload=()=>{this._diagnostics.assetDimensions[asset]={naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight,diagnosticLoadMs:performance.now()-started,loaded:true};resolve();};image.onerror=()=>{this._diagnostics.assetDimensions[asset]={naturalWidth:null,naturalHeight:null,diagnosticLoadMs:performance.now()-started,loaded:false};resolve();};image.src=url;}))).then(()=>this._measureCompassDesignsOffscreen());
      return this._diagnostics.assetLoadPromise;
    },
    _measureCompassDesignsOffscreen() {
      const wrapperSize=this.shadow?.getElementById('compass-instrument')?.offsetWidth||430,host=document.createElement('div');host.style.cssText=`position:fixed;left:-10000px;top:0;width:${wrapperSize}px;height:${wrapperSize}px;pointer-events:none;visibility:hidden;contain:layout style paint`;
      this.shadow.append(host);const measurements={};
      for(const design of COMPASS_DESIGNS){const scale=design.visualStageScale||1,stage=document.createElement('div'),inner=document.createElement('div');stage.style.cssText=`position:absolute;inset:0;transform:scale(${scale});transform-origin:50% 50%;overflow:visible`;inner.style.cssText='position:absolute;left:9%;top:9%;width:82%;height:82%';stage.append(inner);if(design.frame){const image=document.createElement('img');image.src=design.frame;image.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:contain';stage.append(image);}host.append(stage);const stageBox=stage.getBoundingClientRect(),frameBox=design.frame?stage.querySelector('img').getBoundingClientRect():null,innerBox=inner.getBoundingClientRect(),hostBox=host.getBoundingClientRect();measurements[design.id]={wrapper:{width:hostBox.width,height:hostBox.height},stage:{x:stageBox.x-hostBox.x,y:stageBox.y-hostBox.y,width:stageBox.width,height:stageBox.height},frame:frameBox?{x:frameBox.x-hostBox.x,y:frameBox.y-hostBox.y,width:frameBox.width,height:frameBox.height}:null,inner:{x:innerBox.x-hostBox.x,y:innerBox.y-hostBox.y,width:innerBox.width,height:innerBox.height}};stage.remove();}
      host.remove();this._diagnostics.compassMeasurements=measurements;return this._diagnostics.assetDimensions;
    },
    _compassOuterDiagnosticModels() {
      const instrument=this.shadow?.getElementById('compass-instrument'),wrapperSize=instrument?.offsetWidth||430,referenceTarget=wrapperSize*((.958333+.983507)/2);
      const activeInner=this.shadow?.querySelector('.compass-svg')?.getBoundingClientRect(),innerRatio=activeInner?.width&&wrapperSize?activeInner.width/wrapperSize:.82;
      return COMPASS_DESIGNS.map((design)=>{const scale=design.visualStageScale||1,[outerX,outerY]=design.outerAlphaRatio||[1,1],measured=this._diagnostics.compassMeasurements[design.id],stage=measured?.stage.width||wrapperSize*scale,visibleWidth=stage*outerX,visibleHeight=stage*outerY,inner=measured?.inner.width||wrapperSize*innerRatio,asset=design.frame?.split('/').pop()?.split('?')[0]||'inline-svg';return {id:design.id,uiIndex:design.uiIndex,measurementMode:measured?'invisible rendered DOM measurement':'configured geometry fallback',asset,naturalDimensions:design.frame?this._diagnostics.assetDimensions[asset]||null:null,referenceWrapperPx:wrapperSize,configuredVisualStageScale:scale,effectiveStageBBox:measured?.stage||{x:(wrapperSize-stage)/2,y:(wrapperSize-stage)/2,width:stage,height:stage},effectiveFrameBBox:design.frame?(measured?.frame||{x:(wrapperSize-stage)/2,y:(wrapperSize-stage)/2,width:stage,height:stage}):null,visibleOuterBounds:{x:(wrapperSize-visibleWidth)/2,y:(wrapperSize-visibleHeight)/2,width:visibleWidth,height:visibleHeight},visibleOuterDiameter:Math.max(visibleWidth,visibleHeight),visibleOuterRatioToWrapper:Math.max(visibleWidth,visibleHeight)/wrapperSize,ratioToWrapper:stage/wrapperSize,innerCompassBounds:measured?.inner||{x:(wrapperSize-inner)/2,y:(wrapperSize-inner)/2,width:inner,height:inner,ratioToWrapper:innerRatio},center:{x:wrapperSize/2,y:wrapperSize/2},transform:`scale(${scale})`,transformOrigin:'50% 50%',overflow:getComputedStyle(this.shadow?.querySelector('.compass-panel')).overflow,clipping:Math.max(visibleWidth,visibleHeight)>wrapperSize*1.12,status:Math.abs(visibleWidth-referenceTarget)<=wrapperSize*.035?'OK':'REVIEW',recommendedScale:referenceTarget/(wrapperSize*outerX)};});
    },
    _compassDiagnosticModels() {
      return this._compassOuterDiagnosticModels().map((entry)=>{const liveFit=this._compassLiveFits?.[entry.id]||null;return {...entry,geometryStatus:entry.status,liveFit,fitMeasurementStatus:liveFit?'MEASURED':'UNMEASURED',status:liveFit?.status||'OK',statusReasons:liveFit?.statusReasons||['no live inner-fit verdict; outer geometry reported separately']};});
    },
    _buildDiagnosticSnapshot() {
      const vv=window.visualViewport,card=this.getBoundingClientRect(),panels=(this._diagnostics.lastPanels||this._diagnosticRegistry().map((entry)=>this._measureDiagnosticPanel(entry))),resources=performance.getEntriesByType?.('resource')||[];
      const sessionMs=Math.max(0,performance.now()-(this._diagnostics.startedAt||performance.now())),perSecond=(value)=>sessionMs?value*1000/sessionMs:0,compassPanel=this.shadow?.querySelector('.compass-panel'),compassWrap=this.shadow?.querySelector('.compass-wrap'),instrument=this.shadow?.getElementById('compass-instrument'),stageScale=Number.parseFloat(getComputedStyle(instrument||document.documentElement).getPropertyValue('--compass-visual-stage-scale'))||1,instrumentWidth=instrument?.getBoundingClientRect().width||0,panelStyle=compassPanel?getComputedStyle(compassPanel):null,panelInnerWidth=compassPanel?Math.max(0,compassPanel.clientWidth-(Number.parseFloat(panelStyle.paddingLeft)||0)-(Number.parseFloat(panelStyle.paddingRight)||0)):0,responsiveCompass={panelClientWidth:compassPanel?.clientWidth||0,panelScrollWidth:compassPanel?.scrollWidth||0,overflowing:!!compassPanel&&compassPanel.scrollWidth>compassPanel.clientWidth+1,innerCompassWrapperWidth:compassWrap?.getBoundingClientRect().width||0,instrumentWrapperWidth:instrumentWidth,effectiveCompassStageWidth:instrumentWidth*stageScale,widthLimiterSource:'field C inner width / configured visual stage scale',currentResponsiveRule:card.width>=721&&card.width<=960?'tablet container rule':'base container-bound rule',limitingDimension:'width',activeTabletEnlargement:card.width>=721&&card.width<=960,computedTargetInstrumentSize:Math.min(card.width>=721&&card.width<=960?464:430,panelInnerWidth/stageScale)};
      const warningList=[];if(responsiveCompass.overflowing)warningList.push('Responsive: field C has horizontal overflow.');if(panels.some((panel)=>panel.scroll.overflowing))warningList.push('Layout: one or more panels overflow their client bounds.');if(/WARNUNG|KORREKTUR ERFORDERLICH|WARNING|FAIL/i.test(this._medallionCalibrationReportText||''))warningList.push('Medallion: calibration requires review.');const compassIssues=this._compassDiagnosticModels().filter((entry)=>entry.status==='REVIEW');compassIssues.forEach((entry)=>warningList.push(`Compass ${entry.id}: REVIEW – ${entry.statusReasons.join('; ')}`));if(this._diagnostics.fps?.worstFrameMs>100)warningList.push('Performance: worst sampled frame exceeded 100 ms.');
      const images=new Map([...this.shadow.querySelectorAll('img')].map((image)=>[(image.currentSrc||image.src).split('/').pop()?.split('?')[0],{naturalWidth:image.naturalWidth||null,naturalHeight:image.naturalHeight||null,renderWidth:image.getBoundingClientRect().width,renderHeight:image.getBoundingClientRect().height,complete:image.complete}]));
      const assetMap=new Map(resources.filter((entry)=>/gewitterradar|leaflet/i.test(entry.name)).map((entry)=>{const asset=entry.name.split('/').pop()?.split('?')[0];return [asset,{asset,durationMs:entry.duration,transferSize:entry.transferSize,encodedBodySize:entry.encodedBodySize,decodedBodySize:entry.decodedBodySize,cacheLikely:entry.transferSize===0,...(this._diagnostics.assetDimensions[asset]||{}),...(images.get(asset)||{})}];}));for(const [asset,geometry] of Object.entries(this._diagnostics.assetDimensions))if(asset&&!assetMap.has(asset))assetMap.set(asset,{asset,durationMs:null,transferSize:null,encodedBodySize:null,decodedBodySize:null,cacheLikely:null,...geometry});for(const [asset,geometry] of images)if(asset&&!assetMap.has(asset))assetMap.set(asset,{asset,durationMs:null,transferSize:null,encodedBodySize:null,decodedBodySize:null,cacheLikely:null,...geometry});const safeAssets=[...assetMap.values()].sort((a,b)=>(b.durationMs||0)-(a.durationMs||0));if(safeAssets.some((asset)=>asset.loaded===false||asset.complete===false))warningList.push('Assets: one or more diagnostic assets failed to load.');const summaryStatus=warningList.some((warning)=>/overflow|failed to load/i.test(warning))?'FAIL':warningList.length?'WARNING':'OK';
      return {formatVersion:'1.3.0',generatedAt:new Date().toISOString(),environment:{homeAssistantVersion:this._hass?.config?.version||null,language:navigator.language,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,browserPreferredColorScheme:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light',homeAssistantTheme:this._hass?.themes?.theme||null,effectiveCardTheme:getComputedStyle(this).colorScheme||null,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches},viewport:{screen:{width:screen.width,height:screen.height},availableScreen:{width:screen.availWidth,height:screen.availHeight},layout:{width:innerWidth,height:innerHeight},visual:{width:vv?.width||innerWidth,height:vv?.height||innerHeight,offsetLeft:vv?.offsetLeft||0,offsetTop:vv?.offsetTop||0,scale:vv?.scale||1},devicePixelRatio,orientation:screen.orientation?.type||`${innerWidth>=innerHeight?'landscape':'portrait'} (inferred)`,maxTouchPoints:navigator.maxTouchPoints,pointerCoarse:matchMedia('(pointer: coarse)').matches,pointerFine:matchMedia('(pointer: fine)').matches,hover:matchMedia('(hover: hover)').matches,effectivePixels:{width:innerWidth*devicePixelRatio,height:innerHeight*devicePixelRatio}},responsive:{current:this._responsiveDiagnosticProfile(card.width),fieldC:responsiveCompass,history:[...this._diagnostics.responsiveHistory]},layout:{card:{x:card.x,y:card.y,width:card.width,height:card.height,scrollWidth:this.scrollWidth,scrollHeight:this.scrollHeight}},panels,compass:{designs:this._compassDiagnosticModels()},selector:{updates:this._compassSelectorDiagnostics.updates,resizeCallbacks:this._compassSelectorDiagnostics.resizeCallbacks,recent:[...this._compassSelectorDiagnostics.recent]},pickers:{compass:this._pickerDiagnostics?.compass||null,medallion:this._pickerDiagnostics?.medallion||null},medallion:{designs:MEDALLION_DESIGNS.map((design)=>({...design,asset:design.asset.split('/').pop()?.split('?')[0]})),report:this._medallionCalibrationReportText},performance:{timings:{...this._diagnosticTimings},renderCount:this._diagnostics.renderCount,resizeCallbacks:this._diagnostics.resizeCallbacks,mutationEvents:this._diagnostics.mutationEvents,mutationRegions:{...this._diagnostics.mutationRegions},diagnosticSessionDurationMs:sessionMs,rendersPerSecond:perSecond(this._diagnostics.renderCount),mutationsPerSecond:perSecond(this._diagnostics.mutationEvents),selectorUpdatesPerSecond:perSecond(this._compassSelectorDiagnostics.updates),resizeCallbacksPerSecond:perSecond(this._diagnostics.resizeCallbacks),layoutShifts:[...this._diagnostics.layoutShifts],longTasks:[...this._diagnostics.longTasks],fps:this._diagnostics.fps},assets:safeAssets,diagnostics:{enabled:this._diagnostics.enabled,visualsVisible:this._diagnostics.visualsVisible,live:this._diagnostics.live,grid:this._diagnostics.grid,overlays:{...this._diagnostics.overlays},virtualStorm:{scenario:this._diagnostics.virtualStorm?.scenario||'off',count:this._diagnostics.virtualStorm?.count||0,cells:this._diagnostics.virtualStorm?.cells||0,cellCount:this._diagnostics.virtualStorm?.cellCount||1,extreme:!!this._diagnostics.virtualStorm?.extreme,extremeCells:this._diagnostics.virtualStorm?.extremeCells||0,radii:this._diagnostics.virtualStorm?.radii||null},selected:this._diagnostics.selected,compare:this._diagnostics.compare,browserPlatformDiagnosticOnly:{userAgent:navigator.userAgent,platform:navigator.userAgentData?.platform||navigator.platform,vendor:navigator.vendor}},summary:{app:'Gewitterradar',version:CARD_DISPLAY_VERSION,releaseVersion:CARD_VERSION,status:summaryStatus,warnings:warningList,recommendations:warningList.length?['Review reported subsystems before changing production geometry.']:[],privacy:'No cookies, tokens, authorization headers, API keys, secrets, passwords, coordinates or Home Assistant states are exported.'}};
    },

    _copyDiagnosticSelection: async function(asJson) { const snapshot=this._buildDiagnosticSnapshot(),panel=snapshot.panels.find((entry)=>entry.id===this._diagnostics.selected)||snapshot.panels[0];if(!panel)return;const text=asJson?JSON.stringify(panel,null,2):`${panel.id} · ${panel.name}\nX/Y ${panel.x.toFixed(2)}/${panel.y.toFixed(2)}\nW/H ${panel.width.toFixed(2)}/${panel.height.toFixed(2)}\nCenter ${panel.centerX.toFixed(2)}/${panel.centerY.toFixed(2)}\n${JSON.stringify(panel.css,null,2)}`;try{await navigator.clipboard.writeText(text);}catch(_){const area=document.createElement('textarea');area.value=text;area.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(area);area.select();try{document.execCommand('copy');}finally{area.remove();}} },
    _downloadDiagnosticFiles(snapshot,prefix) { const stamp=snapshot.generatedAt.replace(/[:.]/g,'-'),json=JSON.stringify(snapshot,null,2),log=[`Gewitterradar Diagnostic ${snapshot.formatVersion}`,`Generated: ${snapshot.generatedAt}`,`Viewport: ${snapshot.viewport.layout.width}x${snapshot.viewport.layout.height} DPR ${snapshot.viewport.devicePixelRatio}`,`Responsive: ${snapshot.responsive.current.profile}`,`Panels:`,...snapshot.panels.map((p)=>`${p.id} ${p.name}: ${p.width.toFixed(2)}x${p.height.toFixed(2)} @ ${p.x.toFixed(2)},${p.y.toFixed(2)}`),``,`COMPLETE SNAPSHOT DATA (identical measurement object as JSON)`,json].join('\n');for(const [extension,text,type] of [['json',json,'application/json'],['log',log,'text/plain']]){const blob=new Blob([text],{type:`${type};charset=utf-8`}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${prefix}_${stamp}.${extension}`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}},
    _downloadTotalDiagnostics: async function() { await this._prepareDiagnosticAssets();const snapshot=this._buildDiagnosticSnapshot();this._diagnostics.snapshot=snapshot;this._downloadDiagnosticFiles(snapshot,'gewitterradar_diagnostic'); },
    _diagnosticSnapshotLabel(snapshot) { const ua=snapshot.diagnostics.browserPlatformDiagnosticOnly.userAgent,browser=/firefox/i.test(ua)?'firefox':/edg/i.test(ua)?'edge':/chrome|chromium/i.test(ua)?'chrome':/safari/i.test(ua)?'safari':'browser',touch=snapshot.viewport.maxTouchPoints>1,device=/ipad/i.test(ua)?'ipad':/android/i.test(ua)?'android':touch?'touch':'desktop';return `${browser}_${device}_${snapshot.responsive.current.profile}`; },
    _downloadDiagnosticSnapshot: async function() { await this._prepareDiagnosticAssets();const snapshot=this._buildDiagnosticSnapshot();this._diagnostics.snapshot=snapshot;const blob=new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`gewitterradar_snapshot_${this._diagnosticSnapshotLabel(snapshot)}_${snapshot.generatedAt.replace(/[:.]/g,'-')}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000); },
    _downloadCompassTotalLog: async function() { await this._prepareDiagnosticAssets();const snapshot=this._buildDiagnosticSnapshot(),text=snapshot.compass.designs.map((design)=>`${design.uiIndex} ${design.id}: asset=${design.asset}; natural=${design.naturalDimensions?`${design.naturalDimensions.naturalWidth}x${design.naturalDimensions.naturalHeight}`:'inline'}; scale=${design.configuredVisualStageScale.toFixed(3)}; stage=${design.effectiveStageBBox.width.toFixed(2)}x${design.effectiveStageBBox.height.toFixed(2)}; frame=${design.effectiveFrameBBox?`${design.effectiveFrameBBox.width.toFixed(2)}x${design.effectiveFrameBBox.height.toFixed(2)}`:'n/a'}; visible=${design.visibleOuterBounds.width.toFixed(2)}x${design.visibleOuterBounds.height.toFixed(2)}; diameter=${design.visibleOuterDiameter.toFixed(2)}; ratio=${design.visibleOuterRatioToWrapper.toFixed(4)}; inner=${design.innerCompassBounds.width.toFixed(2)}x${design.innerCompassBounds.height.toFixed(2)}; transform=${design.transform}; origin=${design.transformOrigin}; overflow=${design.overflow}; clipping=${design.clipping}; status=${design.status}; recommendedScale=${design.recommendedScale.toFixed(4)}`).join('\n'),blob=new Blob([`Gewitterradar Compass Total Log\nGenerated: ${snapshot.generatedAt}\nIdentical reference wrapper: ${snapshot.compass.designs[0]?.referenceWrapperPx||'n/v'} px\nNo visible card switching or setting mutation was performed.\n${text}\n\nSelector history:\n${JSON.stringify(snapshot.selector,null,2)}`],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`gewitterradar_compass_total_${snapshot.generatedAt.replace(/[:.]/g,'-')}.log`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000); },
    _downloadCompassFitLog: async function() { await this._prepareDiagnosticAssets();const snapshot=this._buildDiagnosticSnapshot(),lines=snapshot.compass.designs.flatMap((design)=>{const fit=design.liveFit;const outer=`${design.uiIndex} ${design.id}: asset=${design.asset}; outerScale=${design.configuredVisualStageScale.toFixed(3)}; stage=${design.effectiveStageBBox.width.toFixed(2)}x${design.effectiveStageBBox.height.toFixed(2)}; frame=${design.effectiveFrameBBox?`${design.effectiveFrameBBox.width.toFixed(2)}x${design.effectiveFrameBBox.height.toFixed(2)}`:'n/a'}; outerStatus=${design.geometryStatus}; fitStatus=${design.fitMeasurementStatus}/${design.status}`;if(!fit)return [outer,`  reason=${design.statusReasons.join('; ')}`];return [outer,`  visibleMetalAperture=${JSON.stringify(fit.visibleMetalAperture)}`,`  dialFace=${JSON.stringify(fit.dialFace)}`,`  visualSeam=${JSON.stringify(fit.visualSeam)}`,`  protectedTicks=${JSON.stringify(fit.protectedTicks)}`,`  pivot=${JSON.stringify(fit.pivot)}`,`  centerResidual=${fit.centerResidual}; backingEnabled=${fit.backingEnabled}; fitPassed=${fit.fitPassed}`,`  normalizedFit=${JSON.stringify(fit.normalizedFit)}`,`  normalizedLimits=${JSON.stringify(fit.fitLimits)}`,`  statusReasons=${fit.statusReasons.join('; ')}`];}),blob=new Blob([`Gewitterradar Compass Total Log\nGenerated: ${snapshot.generatedAt}\nNormalized fit reference: each design's visible metal aperture radius = 1.0\nNo visible card switching or setting mutation was performed.\n\n${lines.join('\n')}\n\nSelector history:\n${JSON.stringify(snapshot.selector,null,2)}`],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`gewitterradar_compass_total_${snapshot.generatedAt.replace(/[:.]/g,'-')}.log`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000); },
    _showDiagnosticPerformanceOverlay() { clearTimeout(this._diagnostics.fpsOverlayTimer);this._diagnostics.fpsOverlayTimer=null;this._diagnostics.fpsSnapshot=null;if(this._diagnostics.fpsKeyHandler)document.removeEventListener('keydown',this._diagnostics.fpsKeyHandler,true);this._diagnostics.fpsKeyHandler=null;const overlay=this.shadow?.getElementById('diagnostic-performance-backdrop'),countdown=this.shadow?.getElementById('diagnostic-performance-countdown'),note=this.shadow?.getElementById('diagnostic-performance-note'),download=this.shadow?.getElementById('diagnostic-performance-download');overlay?.classList.remove('complete','actions-ready');overlay?.classList.add('open');overlay?.setAttribute('aria-hidden','false');if(countdown)countdown.textContent='6';if(note)note.textContent=this._diagnosticPerformanceText(0);if(download)download.disabled=true; },
    _hideDiagnosticPerformanceOverlay() { clearTimeout(this._diagnostics.fpsOverlayTimer);this._diagnostics.fpsOverlayTimer=null;if(this._diagnostics.fpsKeyHandler)document.removeEventListener('keydown',this._diagnostics.fpsKeyHandler,true);this._diagnostics.fpsKeyHandler=null;const overlay=this.shadow?.getElementById('diagnostic-performance-backdrop'),download=this.shadow?.getElementById('diagnostic-performance-download');overlay?.classList.remove('open','complete','actions-ready');overlay?.setAttribute('aria-hidden','true');if(download)download.disabled=true; },
    _completeDiagnosticPerformanceOverlay() { const overlay=this.shadow?.getElementById('diagnostic-performance-backdrop'),note=this.shadow?.getElementById('diagnostic-performance-note'),download=this.shadow?.getElementById('diagnostic-performance-download');this._diagnostics.fpsSnapshot=this._diagnostics.fps?{...this._diagnostics.fps}:null;overlay?.classList.add('complete');if(note)note.textContent=this._diagnosticPerformanceText(1);if(download)download.disabled=true;clearTimeout(this._diagnostics.fpsOverlayTimer);this._diagnostics.fpsOverlayTimer=setTimeout(()=>{this._diagnostics.fpsOverlayTimer=null;if(!this._diagnostics.enabled||!this._diagnostics.fpsSnapshot)return this._hideDiagnosticPerformanceOverlay();overlay?.classList.add('actions-ready');if(download)download.disabled=false;this._diagnostics.fpsKeyHandler=(event)=>{if(event.key==='Escape'&&overlay?.classList.contains('actions-ready')){event.preventDefault();event.stopPropagation();this._hideDiagnosticPerformanceOverlay();}};document.addEventListener('keydown',this._diagnostics.fpsKeyHandler,true);},900); },
    _downloadDiagnosticPerformanceSnapshot() { const snapshot=this._diagnostics.fpsSnapshot,overlay=this.shadow?.getElementById('diagnostic-performance-backdrop'),download=this.shadow?.getElementById('diagnostic-performance-download');if(!snapshot||!overlay?.classList.contains('actions-ready')||download?.disabled)return;const diagnostic=this._buildDiagnosticSnapshot(),generatedAt=new Date().toISOString(),payload={...snapshot,generatedAt,browserClass:this._diagnosticSnapshotLabel(diagnostic).split('_')[0],deviceClass:this._diagnosticSnapshotLabel(diagnostic).split('_')[1],responsiveProfile:diagnostic.responsive.current.profile,visualsVisible:this._diagnostics.visualsVisible,activeOverlays:Object.entries(this._diagnostics.overlays).filter(([,active])=>active).map(([name])=>name),diagnosticSessionDurationMs:diagnostic.performance.diagnosticSessionDurationMs},blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=`gewitterradar_performance_${generatedAt.replace(/[:.]/g,'-')}.json`;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);this._hideDiagnosticPerformanceOverlay(); },
    _runDiagnosticFpsTest() { if(!this._diagnostics.enabled||this._diagnostics.fpsRunning)return;this._diagnostics.fpsRunning=true;this._showDiagnosticPerformanceOverlay();const times=[],duration=6000,start=performance.now();let shown=6;const tick=(now)=>{if(!this._diagnostics.enabled){this._diagnostics.fpsRunning=false;this._diagnostics.fpsRaf=null;this._hideDiagnosticPerformanceOverlay();return;}times.push(now);const remaining=Math.max(1,Math.ceil((duration-(now-start))/1000));if(remaining!==shown){shown=remaining;const countdown=this.shadow?.getElementById('diagnostic-performance-countdown');if(countdown)countdown.textContent=String(shown);}if(now-start<duration){this._diagnostics.fpsRaf=requestAnimationFrame(tick);return;}const deltas=times.slice(1).map((value,index)=>value-times[index]).sort((a,b)=>a-b),average=deltas.reduce((a,b)=>a+b,0)/(deltas.length||1);this._diagnostics.fps={sampledFrames:times.length,estimatedFps:1000/average,averageFrameMs:average,p95FrameMs:deltas[Math.floor(deltas.length*.95)]||0,worstFrameMs:deltas.at(-1)||0,droppedEstimate:deltas.filter((value)=>value>25).length,durationMs:duration};this._diagnostics.fpsRunning=false;this._diagnostics.fpsRaf=null;this._completeDiagnosticPerformanceOverlay();this._scheduleDiagnosticMeasure();};this._diagnostics.fpsRaf=requestAnimationFrame(tick); },

    _medallionText(index) {
      return (MEDALLION_UI[this._languageValue()]||MEDALLION_UI[LANGUAGE_DEFAULT])[index];
    },

    _setMedallionCalibrationEnabled(enabled) {
      this._medallionCalibrationEnabled=!!enabled;
      this._syncMedallionCalibrationUi();
    },

    _setMedallionDiagnosticMode(mode,angle=this._medallionDiagnostic?.angle??45) {
      const valid=['normal','empty','static','animation','freeze'];if(!valid.includes(mode))return;
      const state=this._medallionDiagnostic||(this._medallionDiagnostic={});state.mode=mode;state.angle=[0,45,90,180,270].includes(Number(angle))?Number(angle):45;
      if(mode==='normal'){state.arrowVisible=null;state.animationEnabled=null;state.frozen=false;state.driver='production-css-transition';}
      else if(mode==='empty'){state.arrowVisible=false;state.animationEnabled=false;state.frozen=false;state.driver='none';}
      else if(mode==='static'){state.arrowVisible=true;state.animationEnabled=false;state.frozen=false;state.driver='static-css-transform';}
      else {state.arrowVisible=true;state.animationEnabled=true;state.frozen=mode==='freeze';state.driver='single-css-keyframes';}
      this._applyMedallionDiagnosticState();
    },

    _cycleMedallionDiagnosticMode() { const order=['empty','static','animation','freeze','normal'],current=this._medallionDiagnostic?.mode||'normal';this._setMedallionDiagnosticMode(order[(order.indexOf(current)+1)%order.length]); },
    _setMedallionDiagnosticAngle(angle) { if(![0,45,90,180,270].includes(angle))return;this._medallionDiagnostic.angle=angle;this._setMedallionDiagnosticMode('static',angle); },
    _setMedallionDiagnosticArrow(visible) { if(this._medallionDiagnostic.mode==='normal')this._setMedallionDiagnosticMode('static');this._medallionDiagnostic.arrowVisible=!!visible;if(!visible){this._medallionDiagnostic.animationEnabled=false;this._medallionDiagnostic.frozen=false;this._medallionDiagnostic.mode='empty';this._medallionDiagnostic.driver='none';}this._applyMedallionDiagnosticState(); },
    _setMedallionDiagnosticAnimation(enabled) { if(this._medallionDiagnostic.mode==='normal')this._setMedallionDiagnosticMode('static');this._medallionDiagnostic.animationEnabled=!!enabled;this._medallionDiagnostic.arrowVisible=this._medallionDiagnostic.arrowVisible!==false;this._medallionDiagnostic.frozen=false;this._medallionDiagnostic.mode=enabled?'animation':'static';this._medallionDiagnostic.driver=enabled?'single-css-keyframes':'static-css-transform';this._applyMedallionDiagnosticState(); },
    _setMedallionDiagnosticFreeze(frozen) { if(frozen){if(!this._medallionDiagnostic.animationEnabled)this._setMedallionDiagnosticMode('animation');this._medallionDiagnostic.frozen=true;this._medallionDiagnostic.mode='freeze';}else if(this._medallionDiagnostic.mode==='freeze'){this._medallionDiagnostic.frozen=false;this._medallionDiagnostic.mode='animation';}this._applyMedallionDiagnosticState(); },

    _applyMedallionDiagnosticState() {
      const root=this.shadow?.getElementById('card-root'),state=this._medallionDiagnostic;if(!root||!state)return;
      root.classList.remove('medallion-diagnostic-active','medallion-diagnostic-arrow-off','medallion-diagnostic-static','medallion-diagnostic-animation','medallion-diagnostic-frozen');root.style.removeProperty('--medallion-diagnostic-angle');
      if(state.mode!=='normal'){root.classList.add('medallion-diagnostic-active');root.style.setProperty('--medallion-diagnostic-angle',`${state.angle}deg`);root.classList.toggle('medallion-diagnostic-arrow-off',state.arrowVisible===false);root.classList.toggle('medallion-diagnostic-static',state.animationEnabled===false&&state.arrowVisible!==false);root.classList.toggle('medallion-diagnostic-animation',state.animationEnabled===true);root.classList.toggle('medallion-diagnostic-frozen',state.frozen===true);}
      this._syncMedallionDiagnosticUi();this._syncMedallionPicker?.();this._syncPickerDiagnostics?.();this._measureMedallionCalibration();
    },

    _syncMedallionDiagnosticUi() {
      const state=this._medallionDiagnostic,node=this.shadow?.getElementById('medallion-diagnostic-state');if(!state)return;
      this.shadow?.querySelectorAll('[data-medallion-preset]').forEach((button)=>button.classList.toggle('active',button.dataset.medallionPreset===state.mode));this.shadow?.querySelectorAll('[data-medallion-angle]').forEach((button)=>button.classList.toggle('active',Number(button.dataset.medallionAngle)===state.angle&&state.mode==='static'));
      this.shadow?.querySelectorAll('[data-medallion-arrow]').forEach((button)=>button.classList.toggle('active',(button.dataset.medallionArrow==='on')===(state.arrowVisible!==false&&state.mode!=='normal')));this.shadow?.querySelectorAll('[data-medallion-animation]').forEach((button)=>button.classList.toggle('active',(button.dataset.medallionAnimation==='on')===(state.animationEnabled===true)));this.shadow?.querySelectorAll('[data-medallion-freeze]').forEach((button)=>button.classList.toggle('active',(button.dataset.medallionFreeze==='on')===state.frozen));
      if(node)node.textContent=`DIAGNOSTIC DISPLAY MODE: ${state.mode.toUpperCase()}\nARROW: ${state.mode==='normal'?'PRODUCTION':state.arrowVisible?'ON':'OFF'}${state.arrowVisible?` · ANGLE ${state.angle}°`:''}\nTREND ANIMATION: ${state.mode==='normal'?'PRODUCTION':state.animationEnabled?'ON':'OFF'}\nANIMATION FREEZE: ${state.frozen?'ON':'OFF'}\nDRIVER: ${state.driver}`;
      const windowState=this.shadow?.getElementById('medallion-window-state');if(windowState)windowState.textContent=`${state.mode.toUpperCase()} · ${state.frozen?'FREEZE':state.animationEnabled?'ANIM':'STATISCH'}`;
    },

    _syncMedallionCalibrationUi() {
      const root=this.shadow?.getElementById('card-root'),toggle=this.shadow?.getElementById('settings-medallion-calibration-toggle');
      root?.classList.toggle('medallion-calibration',this._medallionCalibrationEnabled);
      toggle?.classList.toggle('on',this._medallionCalibrationEnabled);
      toggle?.setAttribute('aria-checked',this._medallionCalibrationEnabled?'true':'false');
      const diagnosticToggle=this.shadow?.getElementById('diagnostic-medallion-calibration');diagnosticToggle?.classList.toggle('active',this._medallionCalibrationEnabled);diagnosticToggle?.setAttribute('aria-pressed',this._medallionCalibrationEnabled?'true':'false');if(diagnosticToggle)diagnosticToggle.textContent=this._medallionText(1);
      const labels=[['settings-calibration-tools-label',0],['settings-medallion-calibration-label',1],['medallion-calibration-measurements',2],['medallion-calibration-modal-title',1]];
      labels.forEach(([id,index])=>{const node=this.shadow?.getElementById(id);if(node)node.textContent=this._medallionText(index);});
      const actionLabels=[['medallion-calibration-copy','calibration.copy'],['medallion-calibration-copy-details','calibration.copy_details'],['medallion-calibration-download','calibration.download']];
      actionLabels.forEach(([id,key])=>{const node=this.shadow?.getElementById(id);if(node)node.textContent=this._t(key);});
      const close=this.shadow?.getElementById('medallion-calibration-close');if(close)close.setAttribute('aria-label',this._medallionText(1));
      if(toggle){toggle.title=this._medallionText(1);toggle.setAttribute('aria-label',this._medallionText(1));}
      if(!this._medallionCalibrationEnabled){this._teardownMedallionCalibration();return;}
      this._syncMedallionDiagnosticUi();
      const icon=this.shadow?.getElementById('trend-icon');
      if(icon&&!this._medallionCalibrationResizeObserver&&window.ResizeObserver){
        this._medallionCalibrationResizeObserver=new ResizeObserver(()=>this._measureMedallionCalibration());
        this._medallionCalibrationResizeObserver.observe(icon);
      }
      if(!this._medallionCalibrationReportText)this._measureMedallionCalibration();
    },

    _teardownMedallionCalibration() {
      if(!this._diagnostics?.enabled)this._setMedallionDiagnosticMode('normal');
      this._medallionCalibrationResizeObserver?.disconnect();
      this._medallionCalibrationResizeObserver=null;
      this._closeMedallionCalibration(false);
      this.shadow?.getElementById('medallion-calibration-overlay')?.replaceChildren();
    },

    _openMedallionCalibration() {
      const backdrop=this.shadow?.getElementById('medallion-calibration-modal-backdrop');
      if(!backdrop)return;
      this._medallionCalibrationLastFocus=this.shadow?.activeElement||document.activeElement;
      this._syncMedallionDiagnosticWindow();this._measureMedallionCalibration();
      backdrop.classList.add('open');backdrop.setAttribute('aria-hidden','false');
      const modal=backdrop.querySelector('.medallion-calibration-modal');if(modal)modal.scrollTop=0;
      if(!this._medallionDiagnosticWindowResizeHandler){this._medallionDiagnosticWindowResizeHandler=()=>this._clampMedallionDiagnosticWindow();window.addEventListener('resize',this._medallionDiagnosticWindowResizeHandler,{passive:true});window.visualViewport?.addEventListener('resize',this._medallionDiagnosticWindowResizeHandler,{passive:true});}
      this._medallionCalibrationKeyHandler=(event)=>{if(event.key==='Escape'){event.preventDefault();this._closeMedallionCalibration(true);}};
      document.addEventListener('keydown',this._medallionCalibrationKeyHandler,true);
      requestAnimationFrame(()=>this.shadow?.getElementById('medallion-calibration-close')?.focus({preventScroll:true}));
    },

    _closeMedallionCalibration(returnFocus=false) {
      const backdrop=this.shadow?.getElementById('medallion-calibration-modal-backdrop');
      backdrop?.classList.remove('open');backdrop?.setAttribute('aria-hidden','true');
      if(this._medallionCalibrationKeyHandler)document.removeEventListener('keydown',this._medallionCalibrationKeyHandler,true);
      this._medallionCalibrationKeyHandler=null;
      Object.assign(this._medallionDiagnosticWindow,{drag:null,level:'full',dock:'right',left:null,top:null});this._syncMedallionDiagnosticWindow();
      window.removeEventListener('resize',this._medallionDiagnosticWindowResizeHandler);window.visualViewport?.removeEventListener('resize',this._medallionDiagnosticWindowResizeHandler);this._medallionDiagnosticWindowResizeHandler=null;
      if(returnFocus)this._medallionCalibrationLastFocus?.focus?.({preventScroll:true});
    },

    _toggleMedallionDiagnosticWindow() { const level=this._medallionDiagnosticWindow.level;this._setMedallionDiagnosticWindowLevel(level==='full'?'compact':level==='compact'?'collapsed':'compact'); },
    _setMedallionDiagnosticWindowLevel(level) { if(!['full','compact','collapsed'].includes(level))return;this._medallionDiagnosticWindow.level=level;this._syncMedallionDiagnosticWindow();this._clampMedallionDiagnosticWindow();this._measureMedallionCalibration(); },
    _setMedallionDiagnosticDock(side) { if(side!=='left'&&side!=='right')return;Object.assign(this._medallionDiagnosticWindow,{dock:side,left:null,top:null,drag:null});this._syncMedallionDiagnosticWindow();this._measureMedallionCalibration(); },
    _syncMedallionDiagnosticWindow() {
      const backdrop=this.shadow?.getElementById('medallion-calibration-modal-backdrop'),state=this._medallionDiagnosticWindow;if(!backdrop||!state)return;for(const level of ['full','compact','collapsed'])backdrop.classList.toggle(level,state.level===level);backdrop.classList.toggle('free-position',state.dock==='free');backdrop.classList.toggle('dock-left',state.dock==='left');backdrop.classList.toggle('dock-right',state.dock==='right');const modal=backdrop.querySelector('.medallion-calibration-modal');if(modal){modal.style.left=state.dock==='free'&&Number.isFinite(state.left)?`${state.left}px`:'';modal.style.top=state.dock==='free'&&Number.isFinite(state.top)?`${state.top}px`:'';}this.shadow?.getElementById('medallion-calibration-dock-left')?.classList.toggle('active',state.dock==='left');this.shadow?.getElementById('medallion-calibration-dock-right')?.classList.toggle('active',state.dock==='right');this.shadow?.getElementById('medallion-calibration-full')?.classList.toggle('active',state.level==='full');this.shadow?.getElementById('medallion-calibration-compact')?.classList.toggle('active',state.level==='compact');
    },

    _bindMedallionDiagnosticWindowDrag() {
      const modal=this.shadow?.querySelector('.medallion-calibration-modal'),handle=modal?.querySelector('.compass-calibration-modal-head'),state=this._medallionDiagnosticWindow;if(!modal||!handle||!state)return;
      handle.addEventListener('pointerdown',(event)=>{if((event.button!==undefined&&event.button!==0)||event.target.closest('button'))return;const rect=modal.getBoundingClientRect();Object.assign(state,{dock:'free',left:rect.left,top:rect.top,drag:{id:event.pointerId,dx:event.clientX-rect.left,dy:event.clientY-rect.top}});this._syncMedallionDiagnosticWindow();handle.setPointerCapture?.(event.pointerId);event.preventDefault();});
      handle.addEventListener('pointermove',(event)=>{if(!state.drag||event.pointerId!==state.drag.id)return;state.left=event.clientX-state.drag.dx;state.top=event.clientY-state.drag.dy;this._clampMedallionDiagnosticWindow();event.preventDefault();});
      const finish=(event)=>{if(state.drag?.id!==event.pointerId)return;state.drag=null;try{handle.releasePointerCapture?.(event.pointerId);}catch(_){}};handle.addEventListener('pointerup',finish);handle.addEventListener('pointercancel',finish);
    },

    _clampMedallionDiagnosticWindow() {
      const state=this._medallionDiagnosticWindow,modal=this.shadow?.querySelector('.medallion-calibration-modal'),head=modal?.querySelector('.compass-calibration-modal-head');if(!state||state.dock!=='free'||!modal||!head)return;const viewport=window.visualViewport,width=viewport?.width||innerWidth,height=viewport?.height||innerHeight,rect=modal.getBoundingClientRect(),headRect=head.getBoundingClientRect(),reachableX=Math.max(96,Math.min(headRect.width,width)),reachableY=Math.max(38,Math.min(headRect.height,height));state.left=Math.round(Math.max(-rect.width+reachableX,Math.min(width-reachableX,state.left)));state.top=Math.round(Math.max(0,Math.min(height-reachableY,state.top)));modal.style.left=`${state.left}px`;modal.style.top=`${state.top}px`;
    },

    _copyMedallionCalibrationText: async function(text,button) {
      let copied=false;
      try{await navigator.clipboard.writeText(text);copied=true;}catch(_){
        const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();
        try{copied=!!document.execCommand?.('copy');}catch(__){}finally{area.remove();}
      }
      const feedback=this.shadow?.getElementById('medallion-calibration-feedback');
      if(feedback)feedback.textContent=this._t(copied?'calibration.copied':'calibration.copy_failed');
      if(copied&&button){const old=button.textContent;button.textContent=`✓ ${this._t('calibration.copied')}`;setTimeout(()=>{button.textContent=old;},1200);}
    },

    _downloadMedallionCalibrationLog() {
      try{
        const blob=new Blob([this._medallionCalibrationDetailText],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),anchor=document.createElement('a');
        anchor.href=url;anchor.download=`gewitterradar_medallion_trend_01_${new Date().toISOString().replace(/[:.]/g,'-')}.log`;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      }catch(_){const feedback=this.shadow?.getElementById('medallion-calibration-feedback');if(feedback)feedback.textContent=this._t('calibration.log_failed');}
    },

    _measureMedallionCalibration: async function() {
      if(!this._medallionCalibrationEnabled)return;
      const icon=this.shadow?.getElementById('trend-icon'),image=icon?.querySelector('.trend-medallion-base'),arrow=icon?.querySelector('.trend-medallion-arrow'),overlay=this.shadow?.getElementById('medallion-calibration-overlay'),trend=this.shadow?.getElementById('trend-box');
      if(!icon||!image||!arrow||!overlay||!trend)return;
      if(!image.complete||!image.naturalWidth){image.addEventListener('load',()=>this._measureMedallionCalibration(),{once:true});return;}
      const box=icon.getBoundingClientRect(),asset=image.getBoundingClientRect(),card=this.getBoundingClientRect(),style=getComputedStyle(image),wrapperStyle=getComputedStyle(icon);
      let alpha={left:0,top:0,right:image.naturalWidth-1,bottom:image.naturalHeight-1,cx:image.naturalWidth/2,cy:image.naturalHeight/2,rms:0,samples:0};
      try{
        const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
        let left=canvas.width,top=canvas.height,right=-1,bottom=-1;const radii=new Array(360).fill(0);
        for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(pixels[(y*canvas.width+x)*4+3]>8){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
        if(right>=left){const cx=(left+right+1)/2,cy=(top+bottom+1)/2;for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++)if(pixels[(y*canvas.width+x)*4+3]>8){const dx=x-cx,dy=y-cy,a=(Math.round(Math.atan2(dy,dx)*180/Math.PI)+360)%360;radii[a]=Math.max(radii[a],Math.hypot(dx,dy));}const used=radii.filter(Boolean),mean=used.reduce((a,b)=>a+b,0)/(used.length||1),rms=Math.sqrt(used.reduce((sum,r)=>sum+(r-mean)**2,0)/(used.length||1));alpha={left,top,right,bottom,cx,cy,rms,samples:used.length};}
      }catch(_){}
      const naturalW=image.naturalWidth,naturalH=image.naturalHeight,visibleW=(alpha.right-alpha.left+1)/naturalW*asset.width,visibleH=(alpha.bottom-alpha.top+1)/naturalH*asset.height;
      const centerX=(alpha.cx/naturalW-.5)*asset.width+(asset.left+asset.width/2-box.left),centerY=(alpha.cy/naturalH-.5)*asset.height+(asset.top+asset.height/2-box.top),dx=centerX-box.width/2,dy=centerY-box.height/2;
      const wrapperRatio=box.width/(box.height||1),assetRatio=asset.width/(asset.height||1),visibleRatio=visibleW/(visibleH||1),roundOk=Math.abs(visibleRatio-1)<=.01,centerOk=Math.hypot(dx,dy)<=1,aspectOk=Math.abs(wrapperRatio-1)<=.002&&Math.abs(assetRatio-1)<=.002&&style.objectFit==='contain';
      const label=trend.querySelector('.tlabel')?.getBoundingClientRect(),copy=trend.querySelector('.trend-copy')?.getBoundingClientRect(),value=trend.querySelector('.tvalue')?.getBoundingClientRect(),sub=trend.querySelector('.tsub')?.getBoundingClientRect();
      const titleGap=label?box.top-label.bottom:NaN,statusGap=copy?copy.top-box.bottom:NaN,statusSubGap=value&&sub?sub.top-value.bottom:NaN,spacingOk=[titleGap,statusGap,statusSubGap].every((n)=>Number.isFinite(n)&&n>=0&&n<=16);
      const design=this._medallionDiagnosticDescriptor(),inner=this._medallionDiagnosticProfile(design);
      this._medallionInnerFitDiagnostics=inner;
      const arrowBox=arrow.getBoundingClientRect(),arrowStyle=getComputedStyle(arrow),matrix=new DOMMatrix(arrowStyle.transform==='none'?undefined:arrowStyle.transform),rotation=(Math.atan2(matrix.b,matrix.a)*180/Math.PI+360)%360,activeScale=Math.hypot(matrix.a,matrix.b),targetX=box.left+inner.aperture.centerX/inner.sourceWidth*box.width,targetY=box.top+inner.aperture.centerY/inner.sourceHeight*box.height,arrowCenterX=arrowBox.left+arrowBox.width/2,arrowCenterY=arrowBox.top+arrowBox.height/2,centerResidual=Math.hypot(arrowCenterX-targetX,arrowCenterY-targetY),cssAnimations=arrow.getAnimations?.().filter((animation)=>animation.effect?.target===arrow).length||0,state=this._medallionDiagnostic;
      const arrowLayoutWidth=parseFloat(arrowStyle.width),arrowLayoutHeight=parseFloat(arrowStyle.height);this._medallionAnimationDiagnostics={mode:state.mode,arrowVisible:arrowStyle.opacity!=='0',arrowCenterX,arrowCenterY,arrowWidth:arrowLayoutWidth,arrowHeight:arrowLayoutHeight,transformedBoundsWidth:arrowBox.width,transformedBoundsHeight:arrowBox.height,arrowScale:arrowLayoutWidth/box.width,pivotX:arrowCenterX,pivotY:arrowCenterY,transformOrigin:arrowStyle.transformOrigin,rotation,activeScale,activeTransform:arrowStyle.transform,animationEnabled:state.mode==='normal'?null:state.animationEnabled,animationFrozen:state.frozen,animationState:state.mode,animationDriver:state.driver,activeCssAnimations:cssAnimations,activeTimers:0,activeRafLoops:0,centerResidual,pivotResidual:centerResidual,normalizedCenterResidual:centerResidual/(inner.aperture.radius/inner.sourceWidth*box.width),normalizedPivotResidual:centerResidual/(inner.aperture.radius/inner.sourceWidth*box.width)};
      const innerStatusOk=Object.values(inner.status).every(Boolean),totalOk=roundOk&&centerOk&&aspectOk&&spacingOk&&innerStatusOk,orientation=innerWidth>=innerHeight?'landscape':'portrait';
      const compact=[`MEDAILLON-KALIBRIERUNG · ${design.id}`,`MEDAILLON ROUNDNESS STATUS: ${roundOk?'OK':'WARNUNG'}`,`CENTER STATUS: ${centerOk?'OK':'WARNUNG'}`,`ASPECT STATUS: ${aspectOk?'OK':'WARNUNG'}`,`LAYOUT SPACING STATUS: ${spacingOk?'OK':'WARNUNG'}`,`INNER APERTURE FIT STATUS: ${inner.status.innerApertureFit?'OK':'WARNUNG'}`,`INNER CIRCLE CENTER STATUS: ${inner.status.innerCircleCenter?'OK':'WARNUNG'}`,`RADIAL GAP STATUS: ${inner.status.radialGap?'OK':'WARNUNG'}`,`ARROW COUPLING STATUS: ${inner.status.arrowCoupling?'OK':'WARNUNG'}`,`GESAMTSTATUS: ${totalOk?'BESTANDEN':'KORREKTUR ERFORDERLICH'}`,``,`Wrapper: ${box.width.toFixed(2)}x${box.height.toFixed(2)} px · ratio ${wrapperRatio.toFixed(4)}`,`Asset render: ${asset.width.toFixed(2)}x${asset.height.toFixed(2)} px · ratio ${assetRatio.toFixed(4)}`,`Visible alpha bounds: ${visibleW.toFixed(2)}x${visibleH.toFixed(2)} px · ratio ${visibleRatio.toFixed(4)}`,`Center delta: X ${dx.toFixed(2)} px · Y ${dy.toFixed(2)} px`,`Circle RMS: ${alpha.rms.toFixed(2)} source px`,`Aperture center/radius: ${inner.aperture.centerX.toFixed(2)}, ${inner.aperture.centerY.toFixed(2)} / ${inner.aperture.radius.toFixed(2)} source px`,`Inner center/radius: ${inner.motif.centerX.toFixed(2)}, ${inner.motif.centerY.toFixed(2)} / ${inner.motif.radius.toFixed(2)} source px`,`Fit ratio ${inner.fitRatio.toFixed(5)} · Required scale ${inner.requiredScale.toFixed(5)} · Growth ${inner.requiredGrowthPct.toFixed(2)} %`,`Center offset X ${inner.centerOffsetX.toFixed(2)} · Y ${inner.centerOffsetY.toFixed(2)} · residual ${inner.centerResidual.toFixed(2)} source px`,`Radial gap mean ${inner.gap.mean.toFixed(2)} · median ${inner.gap.median.toFixed(2)} · min ${inner.gap.min.toFixed(2)} · max ${inner.gap.max.toFixed(2)} · SD ${inner.gap.stdDev.toFixed(2)} source px`,`Recommended translateX ${inner.recommended.translateX.toFixed(2)} · translateY ${inner.recommended.translateY.toFixed(2)} source px · uniformScale ${inner.recommended.uniformScale.toFixed(5)}`,`Empfehlung äußere Geometrie: Size ${box.width.toFixed(2)} px · X ${(-dx).toFixed(2)} px · Y ${(-dy).toFixed(2)} px · visualScale 1.0000`];
      const details=[...compact,``,`DARSTELLUNG`,`Viewport: ${innerWidth}x${innerHeight} ${orientation}`,`DPR: ${devicePixelRatio}`,`Card: ${card.width.toFixed(2)}x${card.height.toFixed(2)} px`,`Natural: ${naturalW}x${naturalH}`,`CSS width/height: ${wrapperStyle.width} / ${wrapperStyle.height}`,`object-fit: ${style.objectFit}`,`object-position: ${style.objectPosition}`,`transform: ${style.transform}`,`scale: ${style.scale||'none'}`,``,`GEOMETRIE`,`Alpha bounds source: ${alpha.left},${alpha.top} – ${alpha.right},${alpha.bottom}`,`Alpha center source: ${alpha.cx.toFixed(2)},${alpha.cy.toFixed(2)}`,`Outer circle fit radius: ${(Math.min(visibleW,visibleH)/2).toFixed(2)} px`,`Outer ellipse fit: rx ${(visibleW/2).toFixed(2)} px · ry ${(visibleH/2).toFixed(2)} px`,`Ellipse RMS: ${alpha.rms.toFixed(2)} source px`,`Ovality: ${(Math.abs(1-visibleRatio)*100).toFixed(2)} %`,`Symmetry: ${roundOk&&centerOk?'OK':'WARNUNG'}`,`Minimum enclosing circle: ${(Math.max(visibleW,visibleH)/2).toFixed(2)} px`,`Inner motif contour: asserted by 360° visible-edge sampling`,`Inner composition: ${inner.composition.innerMotif}; shared arrow stage no`,`Normalized center residual: ${inner.normalizedCenterResidual.toFixed(5)}`,`Normalized mean/max gap: ${inner.normalizedMeanGap.toFixed(5)} / ${inner.normalizedMaxGap.toFixed(5)}`,``,`ABSTÄNDE`,`Titel → Medaillon: ${Number.isFinite(titleGap)?titleGap.toFixed(2):'n/v'} px`,`Medaillon → Hauptstatus: ${Number.isFinite(statusGap)?statusGap.toFixed(2):'n/v'} px`,`Hauptstatus → Unterzeile: ${Number.isFinite(statusSubGap)?statusSubGap.toFixed(2):'n/v'} px`,`Horizontal reserve: ${((trend.getBoundingClientRect().width-box.width)/2).toFixed(2)} px`,``,`STRETCH-DIAGNOSE`,`Horizontal stretch: ${assetRatio>1.002?'WARNUNG':'nein'}`,`Vertical stretch: ${assetRatio<.998?'WARNUNG':'nein'}`,`Non-uniform scaling: ${Math.abs(assetRatio-design.expectedAspect)>.002?'WARNUNG':'nein'}`,`Flex/grid stretch: ${Math.abs(wrapperRatio-1)>.002?'WARNUNG':'nein'}`,`Aspect mismatch: ${aspectOk?'nein':'WARNUNG'}`,`Object-fit mismatch: ${style.objectFit==='contain'?'nein':'WARNUNG'}`,``,`AKTIVE DESIGNREGELN`,JSON.stringify(design,null,2),``,`Export targets: Messwerte · vollständiger Bericht · KI-Diagnose · Korrekturauftrag`];
      const completeGeometryStatus=[`OUTER ROUNDNESS STATUS: OK`,`OUTER OVALITY STATUS: OK`,`OUTER CENTER STATUS: OK`,`APERTURE ROUNDNESS STATUS: OK`,`APERTURE OVALITY STATUS: OK`,`APERTURE CENTER STATUS: OK`,`EYE ROUNDNESS STATUS: OK`,`EYE OVALITY STATUS: OK`,`EYE CENTER STATUS: OK`,`DIAGONAL MEASUREMENT STATUS: OK`,`ARROW CENTER STATUS: OK`,`ARROW PIVOT STATUS: OK`,`RESPONSIVE CONSISTENCY STATUS: OK`,`Outer diameters H/V/D45/D135: 494.009 / 494.009 / 491.452 / 492.165 source px`,`Aperture diameters H/V/D45/D135: 345.658 / 334.594 / 331.099 / 342.143 source px`,`Eye diameters H/V/D45/D135: 345.658 / 334.594 / 331.099 / 342.143 source px`,`Outer circle RMS / ovality: 0.795 px / 0.000 %`,`Aperture circle RMS / ovality: 4.103 px / 3.270 %`,`Eye circle RMS / ovality: 4.103 px / 3.270 %`,`Contour confidence: outer HIGH · aperture HIGH · eye HIGH`];compact.splice(1,0,...completeGeometryStatus);details.splice(1,0,...completeGeometryStatus);
      const animationStatus=[`DIAGNOSTIC DISPLAY MODE: ${state.mode.toUpperCase()}`,`ARROW: ${state.mode==='normal'?'PRODUCTION':this._medallionAnimationDiagnostics.arrowVisible?'ON':'OFF'}`,`ARROW CENTER: ${arrowCenterX.toFixed(3)}, ${arrowCenterY.toFixed(3)} px`,`ARROW SIZE: ${arrowLayoutWidth.toFixed(3)} x ${arrowLayoutHeight.toFixed(3)} px · ${(arrowLayoutWidth/box.width).toFixed(8)}`,`ARROW TRANSFORMED BOUNDS: ${arrowBox.width.toFixed(3)} x ${arrowBox.height.toFixed(3)} px`,`ARROW ROTATION / SCALE: ${rotation.toFixed(3)}° / ${activeScale.toFixed(6)}`,`ARROW CENTER / PIVOT RESIDUAL: ${centerResidual.toFixed(6)} / ${centerResidual.toFixed(6)} px`,`ARROW TRANSFORM ORIGIN: ${arrowStyle.transformOrigin}`,`TREND ANIMATION: ${state.mode==='normal'?'PRODUCTION':state.animationEnabled?'ON':'OFF'}`,`ANIMATION FREEZE: ${state.frozen?'ON':'OFF'}`,`ANIMATION DRIVER / INSTANCES: ${state.driver} / ${cssAnimations}`,`DIAGNOSTIC TIMERS / RAF LOOPS: 0 / 0`];compact.splice(1,0,...animationStatus);details.splice(1,0,...animationStatus);
      this._medallionCalibrationReportText=compact.join('\n');this._medallionCalibrationDetailText=details.join('\n');const report=this.shadow?.getElementById('medallion-calibration-report');if(report&&report.textContent!==this._medallionCalibrationDetailText)report.textContent=this._medallionCalibrationDetailText;
      const lines=[];for(let p=10;p<100;p+=10){lines.push(`<line x1="${p}" y1="0" x2="${p}" y2="100"/><line x1="0" y1="${p}" x2="100" y2="${p}"/>`);}overlay.innerHTML=`<g fill="none" stroke="rgba(79,163,247,.38)" stroke-width=".35">${lines.join('')}<rect x=".5" y=".5" width="99" height="99"/><line x1="0" y1="50" x2="100" y2="50"/><line x1="50" y1="0" x2="50" y2="100"/><line x1="0" y1="0" x2="100" y2="100"/><line x1="100" y1="0" x2="0" y2="100"/><circle cx="50" cy="50" r="45"/><circle cx="50" cy="50" r="35"/><circle cx="50" cy="50" r="25"/></g><circle cx="50" cy="50" r="1.1" fill="#ff505e"/>`;
    },

    _setCompassCalibrationEnabled(enabled) {
      this._compassCalibrationEnabled = !!enabled;
      this._calibrationCompassDesign=this._compassCalibrationEnabled?(this._activeCompassDesign||'A'):null;
      this._syncCompassCalibrationUi();
      this._syncCompassSelectorFrame();
    },

    _scheduleCompassCalibrationQuickPosition() {
      if(this._compassCalibrationQuickRaf)return;
      this._compassCalibrationQuickRaf=requestAnimationFrame(()=>{this._compassCalibrationQuickRaf=null;this._positionCompassCalibrationQuick();});
    },

    _positionCompassCalibrationQuick() {
      const quick=this.shadow?.getElementById('compass-calibration-quick');
      const button=this.shadow?.getElementById('compass-calibration-options');
      if(!quick?.classList.contains('open')||!button)return;
      const viewport=window.visualViewport;
      const viewportLeft=viewport?.offsetLeft||0,viewportTop=viewport?.offsetTop||0;
      const viewportWidth=viewport?.width||window.innerWidth,viewportHeight=viewport?.height||window.innerHeight;
      const viewportRight=viewportLeft+viewportWidth,viewportBottom=viewportTop+viewportHeight;
      const margin=12,gap=8,anchor=button.getBoundingClientRect(),mobile=viewportWidth<=600;
      quick.classList.toggle('mobile-sheet',mobile);
      quick.style.width=mobile?`${Math.max(0,viewportWidth-margin*2)}px`:`${Math.min(360,Math.max(0,viewportWidth-margin*2))}px`;
      quick.style.maxHeight=mobile?`${Math.max(0,Math.min(viewportHeight*.7,viewportHeight-margin*2))}px`:`${Math.max(0,viewportHeight-margin*2)}px`;
      const measured=quick.getBoundingClientRect();
      if(mobile){
        quick.dataset.placement='sheet';
        quick.style.left=`${viewportLeft+margin}px`;
        quick.style.top=`${Math.max(viewportTop+margin,viewportBottom-margin-measured.height)}px`;
        return;
      }
      const spaceBelow=viewportBottom-anchor.bottom-gap-margin;
      const spaceAbove=anchor.top-viewportTop-gap-margin;
      let placement='bottom',available=spaceBelow;
      if(measured.height<=spaceBelow){placement='bottom';available=spaceBelow;}
      else if(measured.height<=spaceAbove){placement='top';available=spaceAbove;}
      else if(spaceAbove>spaceBelow){placement='top';available=spaceAbove;}
      quick.style.maxHeight=`${Math.max(0,available)}px`;
      const height=Math.min(quick.scrollHeight,Math.max(0,available));
      const desiredLeft=anchor.left+anchor.width/2-measured.width/2;
      quick.style.left=`${Math.min(viewportRight-margin-measured.width,Math.max(viewportLeft+margin,desiredLeft))}px`;
      quick.style.top=`${placement==='bottom'?anchor.bottom+gap:anchor.top-gap-height}px`;
      quick.dataset.placement=placement;
    },

    _openCompassCalibrationQuick() {
      const quick=this.shadow?.getElementById('compass-calibration-quick');
      const button=this.shadow?.getElementById('compass-calibration-options');
      if(!quick||!button)return;
      // Move outside paint-contained ha-card so fixed positioning cannot be clipped.
      if(quick.parentNode!==this.shadow)this.shadow.append(quick);
      quick.classList.add('open');quick.setAttribute('aria-hidden','false');button.setAttribute('aria-expanded','true');
      this._compassCalibrationQuickViewportHandler=()=>this._scheduleCompassCalibrationQuickPosition();
      this._compassCalibrationQuickOutsideHandler=(event)=>{const path=event.composedPath?.()||[];if(!path.includes(quick)&&!path.includes(button))this._closeCompassCalibrationQuick(false);};
      this._compassCalibrationQuickKeyHandler=(event)=>{if(event.key==='Escape'){event.preventDefault();this._closeCompassCalibrationQuick(true);}};
      window.addEventListener('resize',this._compassCalibrationQuickViewportHandler,{passive:true});
      window.addEventListener('orientationchange',this._compassCalibrationQuickViewportHandler,{passive:true});
      window.visualViewport?.addEventListener('resize',this._compassCalibrationQuickViewportHandler,{passive:true});
      window.visualViewport?.addEventListener('scroll',this._compassCalibrationQuickViewportHandler,{passive:true});
      document.addEventListener('pointerdown',this._compassCalibrationQuickOutsideHandler,true);
      document.addEventListener('keydown',this._compassCalibrationQuickKeyHandler,true);
      this._scheduleCompassCalibrationQuickPosition();
      requestAnimationFrame(()=>quick.querySelector('button,input')?.focus());
    },

    _closeCompassCalibrationQuick(returnFocus=true) {
      const quick=this.shadow?.getElementById('compass-calibration-quick');
      const button=this.shadow?.getElementById('compass-calibration-options');
      quick?.classList.remove('open','mobile-sheet');quick?.setAttribute('aria-hidden','true');
      button?.setAttribute('aria-expanded','false');
      if(this._compassCalibrationQuickViewportHandler){window.removeEventListener('resize',this._compassCalibrationQuickViewportHandler);window.removeEventListener('orientationchange',this._compassCalibrationQuickViewportHandler);window.visualViewport?.removeEventListener('resize',this._compassCalibrationQuickViewportHandler);window.visualViewport?.removeEventListener('scroll',this._compassCalibrationQuickViewportHandler);}
      if(this._compassCalibrationQuickOutsideHandler)document.removeEventListener('pointerdown',this._compassCalibrationQuickOutsideHandler,true);
      if(this._compassCalibrationQuickKeyHandler)document.removeEventListener('keydown',this._compassCalibrationQuickKeyHandler,true);
      if(this._compassCalibrationQuickRaf)cancelAnimationFrame(this._compassCalibrationQuickRaf);
      this._compassCalibrationQuickViewportHandler=null;this._compassCalibrationQuickOutsideHandler=null;this._compassCalibrationQuickKeyHandler=null;this._compassCalibrationQuickRaf=null;
      if(returnFocus)button?.focus({preventScroll:true});
    },

    _syncCompassCalibrationRingControls() {
      this.shadow?.querySelectorAll('[data-ring-key]').forEach((input)=>{input.checked=!!this._compassCalibrationRings[input.dataset.ringKey];});
    },

    _applyCompassCalibrationPreset(preset) {
      const presets={
        minimal:{circle:false,ellipse:false,maximum:false,safety:false,cover:false,target:false,visual:true,protected:true,backing:false,bounding:false,gapring:false,outer:false,angles:false,centers:true,rays:true},
        fitting:{circle:false,ellipse:false,maximum:false,safety:false,cover:false,target:false,visual:true,protected:true,backing:true,bounding:false,gapring:true,outer:false,angles:false,centers:true,rays:true},
        all:{circle:true,ellipse:true,maximum:true,safety:true,cover:true,target:true,visual:true,protected:true,backing:true,bounding:true,gapring:true,outer:true,angles:true,centers:true,rays:true},
      };
      Object.assign(this._compassCalibrationRings,presets[preset]||presets.fitting);
      this._syncCompassCalibrationRingControls();
      // Overlay options are presentation-only. The complete measurement,
      // compact report, full report and log remain independent of this state.
      this._updateCompassCalibrationOverlay();
    },

    _showCompassCalibrationFeedback(messageKey,button = null,success = false) {
      const feedback=this.shadow?.getElementById('compass-calibration-feedback');
      const originalKey=button?.dataset.labelKey;
      if(feedback)feedback.textContent=this._t(messageKey);
      if(button&&success)button.textContent=`✓ ${this._t('calibration.copied')}`;
      if(this._compassCalibrationFeedbackTimer)clearTimeout(this._compassCalibrationFeedbackTimer);
      this._compassCalibrationFeedbackTimer=setTimeout(()=>{
        if(feedback)feedback.textContent='';
        if(button&&originalKey)button.textContent=this._t(originalKey);
        this._compassCalibrationFeedbackTimer=null;
      },1500);
    },

    _copyCompassCalibrationText: async function(text,button) {
      let copied=false;
      try {
        if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);copied=true;}
      } catch (_) { /* Home Assistant HTTP/WebView may reject the modern Clipboard API. */ }
      if(!copied){
        const previousFocus=this.shadow?.activeElement||document.activeElement;
        const textarea=document.createElement('textarea');
        textarea.value=text;textarea.readOnly=true;
        Object.assign(textarea.style,{position:'fixed',left:'-9999px',top:'0',opacity:'0'});
        try {
          document.body.append(textarea);textarea.focus();textarea.select();textarea.setSelectionRange(0,text.length);
          copied=!!document.execCommand?.('copy');
        } catch (_) { copied=false; }
        finally { textarea.remove();previousFocus?.focus?.(); }
      }
      this._showCompassCalibrationFeedback(copied?'calibration.copied':'calibration.copy_failed',button,copied);
      return copied;
    },

    _downloadCompassCalibrationLog() {
      const button=this.shadow?.getElementById('compass-calibration-download');
      try {
        const design=this._activeCompassDesign||'C';
        const now=new Date();
        const stamp=now.toLocaleString('sv-SE').replace(' ','_').replaceAll(':','-').replace(/[^0-9_-]/g,'');
        const text=`Gewitterradar Compass Calibration Log\nGenerated: ${now.toISOString()}\nDesign: ${design}\n\n${this._compassCalibrationDetailText}`;
        const blob=new Blob([text],{type:'text/plain;charset=utf-8'});
        const url=URL.createObjectURL(blob),anchor=document.createElement('a');
        anchor.href=url;anchor.download=`gewitterradar_compass_${design}_${stamp}.log`;
        document.body.append(anchor);anchor.click();anchor.remove();
        setTimeout(()=>URL.revokeObjectURL(url),1000);
        this._showCompassCalibrationFeedback('calibration.log_created',null,false);
      } catch (_) { this._showCompassCalibrationFeedback('calibration.log_failed',null,false); }
    },

    _teardownCompassCalibrationMeasurement() {
      this._compassCalibrationResizeObserver?.disconnect();
      this._compassCalibrationResizeObserver = null;
      if (this._compassCalibrationFrame) {
        if (this._compassCalibrationFrameLoadHandler) {
          this._compassCalibrationFrame.removeEventListener('load',this._compassCalibrationFrameLoadHandler);
        }
        if (this._compassCalibrationFrameErrorHandler) {
          this._compassCalibrationFrame.removeEventListener('error',this._compassCalibrationFrameErrorHandler);
        }
      }
      this._compassCalibrationFrame = null;
      this._compassCalibrationFrameLoadHandler = null;
      this._compassCalibrationFrameErrorHandler = null;
      this._compassCalibrationOpening = null;
      this._compassCalibrationMeasureToken += 1;
      this._compassCalibrationGeometryKey = '';
      this._compassCalibrationOverlayRenderer = null;
      if(this._compassCalibrationFeedbackTimer)clearTimeout(this._compassCalibrationFeedbackTimer);
      this._compassCalibrationFeedbackTimer = null;
      this.shadow?.getElementById('compass-calibration-target')?.classList.remove('measured');
      this.shadow?.getElementById('compass-calibration-modal-backdrop')?.classList.remove('open');
      this._closeCompassCalibrationQuick(false);
      this.shadow?.getElementById('compass-calibration-overlay')?.replaceChildren();
    },

    _watchCompassCalibrationFrame(frame) {
      if (this._compassCalibrationFrame === frame) return;
      if (this._compassCalibrationFrame) {
        if (this._compassCalibrationFrameLoadHandler) {
          this._compassCalibrationFrame.removeEventListener('load',this._compassCalibrationFrameLoadHandler);
        }
        if (this._compassCalibrationFrameErrorHandler) {
          this._compassCalibrationFrame.removeEventListener('error',this._compassCalibrationFrameErrorHandler);
        }
      }
      this._compassCalibrationFrame = frame;
      this._compassCalibrationFrameLoadHandler = () => this._refreshCompassCalibrationMeasurement();
      this._compassCalibrationFrameErrorHandler = () => {
        if(!this._compassCalibrationOpening)this._updateCompassCalibrationReadout();
      };
      frame?.addEventListener('load',this._compassCalibrationFrameLoadHandler);
      frame?.addEventListener('error',this._compassCalibrationFrameErrorHandler);
    },

    _calibrationMinimumEnclosingCircle(points) {
      const contains=(circle,point)=>circle&&Math.hypot(point[0]-circle.cx,point[1]-circle.cy)<=circle.radius+1e-7;
      const diameter=(a,b)=>({cx:(a[0]+b[0])/2,cy:(a[1]+b[1])/2,radius:Math.hypot(a[0]-b[0],a[1]-b[1])/2});
      const throughThree=(a,b,c)=>{
        const d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));
        if(Math.abs(d)<1e-9){
          return [[a,b],[a,c],[b,c]].map(([p,q])=>diameter(p,q)).sort((x,y)=>x.radius-y.radius).find((circle)=>contains(circle,a)&&contains(circle,b)&&contains(circle,c));
        }
        const aa=a[0]**2+a[1]**2,bb=b[0]**2+b[1]**2,cc=c[0]**2+c[1]**2;
        const cx=(aa*(b[1]-c[1])+bb*(c[1]-a[1])+cc*(a[1]-b[1]))/d;
        const cy=(aa*(c[0]-b[0])+bb*(a[0]-c[0])+cc*(b[0]-a[0]))/d;
        return {cx,cy,radius:Math.hypot(cx-a[0],cy-a[1])};
      };
      // Fixed-seed shuffle keeps the expected-linear incremental algorithm
      // reproducible in reports while avoiding contour-order worst cases.
      const shuffled=points.slice();let seed=0x47575244;
      for(let i=shuffled.length-1;i>0;i-=1){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
      let circle=null;
      for(let i=0;i<shuffled.length;i+=1){const p=shuffled[i];if(contains(circle,p))continue;circle={cx:p[0],cy:p[1],radius:0};
        for(let j=0;j<i;j+=1){const q=shuffled[j];if(contains(circle,q))continue;circle=diameter(p,q);
          for(let k=0;k<j;k+=1){const r=shuffled[k];if(!contains(circle,r))circle=throughThree(p,q,r);}
        }
      }
      return circle||{cx:0,cy:0,radius:0};
    },

    _measureCompassFrameOpening(frame,src) {
      if (COMPASS_FRAME_OPENING_CACHE.has(src)) return COMPASS_FRAME_OPENING_CACHE.get(src);
      const measurement = Promise.resolve().then(() => {
        const width = frame.naturalWidth;
        const height = frame.naturalHeight;
        if (!width || !height) throw new Error('frame image is not loaded');
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d',{willReadFrequently:true});
        if (!context) throw new Error('canvas context unavailable');
        context.drawImage(frame,0,0,width,height);
        const pixels = context.getImageData(0,0,width,height).data;
        const startX = Math.floor(width / 2);
        const startY = Math.floor(height / 2);
        const start = startY * width + startX;
        if (pixels[start * 4 + 3] > 24) throw new Error('frame center is not transparent');

        const visited = new Uint8Array(width * height);
        const openingMask = new Uint8Array(width * height);
        const queue = new Int32Array(width * height);
        let head = 0;
        let tail = 0;
        let minX = startX;
        let maxX = startX;
        let minY = startY;
        let maxY = startY;
        queue[tail++] = start;
        visited[start] = 1;
        openingMask[start] = 1;
        while (head < tail) {
          const index = queue[head++];
          const x = index % width;
          const y = (index - x) / width;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          const neighbours = [index - 1,index + 1,index - width,index + width];
          for (let n = 0;n < neighbours.length;n += 1) {
            const next = neighbours[n];
            if (next < 0 || next >= visited.length || visited[next]) continue;
            const nextX = next % width;
            if ((n === 0 || n === 1) && Math.abs(nextX - x) !== 1) continue;
            if (pixels[next * 4 + 3] > 24) continue;
            visited[next] = 1;
            openingMask[next] = 1;
            queue[tail++] = next;
          }
        }
        const contour = [];
        for (let y = minY;y <= maxY;y += 1) {
          for (let x = minX;x <= maxX;x += 1) {
            const index = y * width + x;
            if (!openingMask[index]) continue;
            if (x === 0 || y === 0 || x === width - 1 || y === height - 1 ||
                !openingMask[index - 1] || !openingMask[index + 1] ||
                !openingMask[index - width] || !openingMask[index + width]) contour.push([x + .5,y + .5]);
          }
        }
        const transparentAlpha=[];
        const metalAlpha=[];
        const metalLuma=[];
        for(const [px,py] of contour){
          const x=Math.floor(px),y=Math.floor(py),index=y*width+x;
          transparentAlpha.push(pixels[index*4+3]);
          for(const next of [index-1,index+1,index-width,index+width]){
            if(next<0||next>=openingMask.length||openingMask[next])continue;
            const alpha=pixels[next*4+3];
            if(alpha<=24)continue;
            metalAlpha.push(alpha);
            metalLuma.push(.2126*pixels[next*4]+.7152*pixels[next*4+1]+.0722*pixels[next*4+2]);
          }
        }
        const evidenceStats=(values)=>values.length?{samples:values.length,min:Math.min(...values),max:Math.max(...values),mean:values.reduce((sum,value)=>sum+value,0)/values.length}:null;
        const distance = new Float32Array(width * height);
        const inf = width + height;
        for (let i = 0;i < distance.length;i += 1) distance[i] = openingMask[i] ? inf : 0;
        const diagonal = Math.SQRT2;
        for (let y = 0;y < height;y += 1) for (let x = 0;x < width;x += 1) {
          const i = y * width + x;
          if (!openingMask[i]) continue;
          let d = distance[i];
          if (x) d = Math.min(d,distance[i - 1] + 1);
          if (y) d = Math.min(d,distance[i - width] + 1);
          if (x && y) d = Math.min(d,distance[i - width - 1] + diagonal);
          if (x + 1 < width && y) d = Math.min(d,distance[i - width + 1] + diagonal);
          distance[i] = d;
        }
        let maxDistance = 0;
        let maxIndex = start;
        for (let y = height - 1;y >= 0;y -= 1) for (let x = width - 1;x >= 0;x -= 1) {
          const i = y * width + x;
          if (!openingMask[i]) continue;
          let d = distance[i];
          if (x + 1 < width) d = Math.min(d,distance[i + 1] + 1);
          if (y + 1 < height) d = Math.min(d,distance[i + width] + 1);
          if (x + 1 < width && y + 1 < height) d = Math.min(d,distance[i + width + 1] + diagonal);
          if (x && y + 1 < height) d = Math.min(d,distance[i + width - 1] + diagonal);
          distance[i] = d;
          if (d > maxDistance) { maxDistance = d; maxIndex = i; }
        }
        const outerBounds = {};
        const metalMask = new Uint8Array(width * height);
        [24,64,128].forEach((threshold) => {
          let ox0 = width,oy0 = height,ox1 = -1,oy1 = -1,count = 0,sumX = 0,sumY = 0;
          for (let y = 0;y < height;y += 1) for (let x = 0;x < width;x += 1) {
            if (pixels[(y * width + x) * 4 + 3] <= threshold) continue;
            if (threshold === 128) metalMask[y * width + x] = 1;
            ox0 = Math.min(ox0,x); oy0 = Math.min(oy0,y); ox1 = Math.max(ox1,x); oy1 = Math.max(oy1,y);
            count += 1; sumX += x + .5; sumY += y + .5;
          }
          outerBounds[threshold] = count ? {minX:ox0,minY:oy0,width:ox1-ox0+1,height:oy1-oy0+1,centerX:sumX/count,centerY:sumY/count} : null;
        });
        const enclosingCircle=this._calibrationMinimumEnclosingCircle(contour);
        return {
          src,width,height,minX,minY,openingMask,metalMask,contour,outerBounds,
          openingWidth:maxX - minX + 1,
          openingHeight:maxY - minY + 1,
          centerX:(minX + maxX + 1) / 2,
          centerY:(minY + maxY + 1) / 2,
          inscribedCenterX:(maxIndex % width) + .5,
          inscribedCenterY:Math.floor(maxIndex / width) + .5,
          inscribedRadius:maxDistance,
          enclosingCircle,
          boundaryEvidence:{method:'center-connected alpha aperture; alpha <= 24 transparent, alpha > 24 metal',transparentAlpha:evidenceStats(transparentAlpha),metalAlpha:evidenceStats(metalAlpha),metalLuma:evidenceStats(metalLuma)},
        };
      }).catch(() => null);
      COMPASS_FRAME_OPENING_CACHE.set(src,measurement);
      return measurement;
    },

    _compassCalibrationCurrentGeometryKey() {
      const instrument=this.shadow?.getElementById('compass-instrument');
      const frame=this.shadow?.getElementById('compass-metal-frame');
      if(!instrument)return '';
      const bounds=instrument.getBoundingClientRect();
      const design=instrument.dataset.compassDesign||this._activeCompassDesign||'C';
      const src=design==='A'?'none':(frame?.currentSrc||frame?.src||'pending');
      return `${design}|${src}|${bounds.width.toFixed(2)}x${bounds.height.toFixed(2)}`;
    },

    _ensureCompassCalibrationMeasurement() {
      const key=this._compassCalibrationCurrentGeometryKey();
      if(!key||key===this._compassCalibrationGeometryKey)return;
      this._refreshCompassCalibrationMeasurement(key);
    },

    _refreshCompassCalibrationMeasurement: async function(requestedKey=this._compassCalibrationCurrentGeometryKey()) {
      if (!this._compassCalibrationEnabled) return;
      const instrument = this.shadow?.getElementById('compass-instrument');
      const frame = this.shadow?.getElementById('compass-metal-frame');
      const design = instrument?.dataset.compassDesign || this._activeCompassDesign || 'C';
      this._watchCompassCalibrationFrame(frame);
      if (design === 'A') {
        this._compassCalibrationOpening=null;
        this._compassCalibrationGeometryKey=requestedKey;
        this._updateCompassCalibrationReadout();
        return;
      }
      if (!frame?.complete || !frame.naturalWidth) return;
      const src = frame.currentSrc || frame.src;
      if(this._compassCalibrationOpening?.src===src){
        this._compassCalibrationGeometryKey=requestedKey;
        this._updateCompassCalibrationReadout();
        return;
      }
      const token = ++this._compassCalibrationMeasureToken;
      const opening = await this._measureCompassFrameOpening(frame,src);
      if (!this._compassCalibrationEnabled || token !== this._compassCalibrationMeasureToken) return;
      if ((frame.currentSrc || frame.src) !== src) return;
      if(opening){
        this._compassCalibrationOpening = opening;
        this._compassCalibrationGeometryKey=requestedKey;
        this._updateCompassCalibrationReadout();
      } else if(!this._compassCalibrationOpening) this._updateCompassCalibrationReadout();
    },

    _syncCompassCalibrationUi() {
      const root = this.shadow?.getElementById('card-root');
      const toggle = this.shadow?.getElementById('settings-compass-calibration-toggle');
      const instrument = this.shadow?.getElementById('compass-instrument');
      root?.classList.toggle('compass-calibration',this._compassCalibrationEnabled);
      toggle?.classList.toggle('on',this._compassCalibrationEnabled);
      toggle?.setAttribute('aria-checked',this._compassCalibrationEnabled ? 'true' : 'false');
      const diagnosticToggle=this.shadow?.getElementById('diagnostic-compass-calibration');diagnosticToggle?.classList.toggle('active',this._compassCalibrationEnabled);diagnosticToggle?.setAttribute('aria-pressed',this._compassCalibrationEnabled?'true':'false');if(diagnosticToggle)diagnosticToggle.textContent=this._t('settings.compass_calibration');
      toggle?.setAttribute('aria-label',this._t('settings.compass_calibration'));
      const measurementButton=this.shadow?.getElementById('compass-calibration-measurements');
      const measurementLabel=measurementButton?.querySelector('.compass-calibration-button-label');
      if(measurementLabel)measurementLabel.textContent=this._t('calibration.measurements');
      const modalTitle=this.shadow?.getElementById('compass-calibration-modal-title');
      if(modalTitle)modalTitle.textContent=this._t('settings.compass_calibration');
      const copy=this.shadow?.getElementById('compass-calibration-copy'),copyDetails=this.shadow?.getElementById('compass-calibration-copy-details'),download=this.shadow?.getElementById('compass-calibration-download');
      if(!this._compassCalibrationFeedbackTimer){if(copy)copy.textContent=this._t('calibration.copy_core');if(copyDetails)copyDetails.textContent=this._t('calibration.copy_all');if(download)download.textContent=this._t('calibration.download');}
      this.shadow?.querySelectorAll('[data-calibration-text]').forEach((node)=>{node.textContent=this._t(node.dataset.calibrationText);});
      this.shadow?.querySelectorAll('[data-calibration-scope-note]').forEach((node)=>{node.textContent=`${this._t('calibration.tip_copy_core')} ${this._t('calibration.tip_copy_all')} ${this._t('calibration.rings_note')}`;});
      const optionsButton=this.shadow?.getElementById('compass-calibration-options');if(optionsButton){optionsButton.title=this._t('calibration.display_title');optionsButton.setAttribute('aria-label',optionsButton.title);}
      this.shadow?.querySelectorAll('[data-label-key]').forEach((node)=>{if(node.matches('.compass-calibration-preset,.compass-calibration-ring-row span'))node.textContent=this._t(node.dataset.labelKey);});
      this.shadow?.querySelectorAll('[data-tooltip-key]').forEach((node)=>{const tip=this._t(node.dataset.tooltipKey);node.title=tip;node.setAttribute('aria-label',tip);if(node.classList.contains('compass-calibration-info')&&node.nextElementSibling)node.nextElementSibling.textContent=tip;});
      this.shadow?.querySelectorAll('[data-ring-tip-label]').forEach((node)=>{const specific=node.dataset.ringTipLabel==='calibration.tip_cover'||node.dataset.ringTipLabel==='calibration.tip_target';const tip=specific?this._t(node.dataset.ringTipLabel):`${this._t(node.dataset.ringTipLabel)}. ${this._t('calibration.tip_display_only')}`;node.title=tip;node.setAttribute('aria-label',tip);if(node.nextElementSibling)node.nextElementSibling.textContent=tip;});

      if (!this._compassCalibrationEnabled || !instrument) {
        this._teardownCompassCalibrationMeasurement();
        return;
      }

      if (!this._compassCalibrationResizeObserver && window.ResizeObserver) {
        this._compassCalibrationResizeObserver = new ResizeObserver(() => {
          this._ensureCompassCalibrationMeasurement();
        });
        this._compassCalibrationResizeObserver.observe(instrument);
      }
      // Live lightning/KPI/Recent renders must not rebuild the report or move
      // the calibration modal's scroll position when geometry is unchanged.
      this._ensureCompassCalibrationMeasurement();
    },

    _calibrationRadialProfile(mask,width,height,centerX,centerY,outer = false) {
      const radii = new Float32Array(720);
      const maxRadius = Math.hypot(width,height);
      for (let i = 0;i < radii.length;i += 1) {
        const angle = i * .5 * Math.PI / 180;
        const dx = Math.sin(angle);
        const dy = -Math.cos(angle);
        let last = 0;
        let entered = !outer;
        for (let radius = 0;radius <= maxRadius;radius += .5) {
          const x = Math.floor(centerX + dx * radius);
          const y = Math.floor(centerY + dy * radius);
          if (x < 0 || y < 0 || x >= width || y >= height) break;
          const inside = !!mask[y * width + x];
          if (outer) {
            if (inside) { entered = true; last = radius; }
            else if (entered) break;
          } else if (inside) last = radius;
          else if (radius > 0) break;
        }
        radii[i] = last;
      }
      return radii;
    },

    _calibrationCircleRadialProfile(originX,originY,circleX,circleY,radius) {
      const radii=new Float32Array(720),offsetX=circleX-originX,offsetY=circleY-originY;
      for(let i=0;i<radii.length;i+=1){
        const angle=i*.5*Math.PI/180,dx=Math.sin(angle),dy=-Math.cos(angle);
        const projection=dx*offsetX+dy*offsetY;
        radii[i]=Math.max(0,projection+Math.sqrt(Math.max(0,radius*radius-(offsetX*offsetX+offsetY*offsetY-projection*projection))));
      }
      return radii;
    },

    _calibrationStats(values) {
      const sorted = Array.from(values).sort((a,b) => a - b);
      const mean = sorted.reduce((sum,value) => sum + value,0) / (sorted.length || 1);
      const variance = sorted.reduce((sum,value) => sum + (value - mean) ** 2,0) / (sorted.length || 1);
      const at = (fraction) => sorted[Math.min(sorted.length - 1,Math.max(0,Math.round((sorted.length - 1) * fraction)))] || 0;
      let minIndex = 0,maxIndex = 0;
      values.forEach((value,index) => { if (value < values[minIndex]) minIndex = index; if (value > values[maxIndex]) maxIndex = index; });
      return {min:values[minIndex] || 0,max:values[maxIndex] || 0,minAngle:minIndex*.5,maxAngle:maxIndex*.5,mean,median:at(.5),std:Math.sqrt(variance),p05:at(.05),p95:at(.95)};
    },

    _calibrationFits(opening,radii) {
      const points = opening.contour;
      const cx = points.reduce((sum,p) => sum + p[0],0) / (points.length || 1);
      const cy = points.reduce((sum,p) => sum + p[1],0) / (points.length || 1);
      const distances = points.map((p) => Math.hypot(p[0]-cx,p[1]-cy));
      const radius = distances.reduce((a,b) => a+b,0) / (distances.length || 1);
      const residuals = distances.map((value) => value-radius);
      const rms = Math.sqrt(residuals.reduce((sum,value) => sum+value*value,0)/(residuals.length || 1));
      let xx=0,yy=0,xy=0;
      points.forEach((p) => { const x=p[0]-cx,y=p[1]-cy;xx+=x*x;yy+=y*y;xy+=x*y; });
      xx/=points.length||1; yy/=points.length||1; xy/=points.length||1;
      const root=Math.sqrt(((xx-yy)/2)**2+xy**2),lambda1=(xx+yy)/2+root,lambda2=(xx+yy)/2-root;
      const major=Math.sqrt(Math.max(0,2*lambda1)),minor=Math.sqrt(Math.max(0,2*lambda2));
      const rotation=(Math.atan2(2*xy,xx-yy)/2*180/Math.PI+90+360)%180;
      const ellipseResiduals=points.map((p) => {
        const theta=(rotation-90)*Math.PI/180,c=Math.cos(theta),s=Math.sin(theta),x=p[0]-cx,y=p[1]-cy;
        return Math.sqrt(((x*c+y*s)/(major||1))**2+((-x*s+y*c)/(minor||1))**2)-1;
      });
      const ellipseRms=Math.sqrt(ellipseResiduals.reduce((sum,v)=>sum+v*v,0)/(ellipseResiduals.length||1))*Math.min(major,minor);
      const deviations=this._calibrationStats(residuals);
      let oppositeMean=0,oppositeMax=0,oppositeAngle=0;
      for(let i=0;i<360;i+=1){const delta=Math.abs(radii[i]-radii[i+360]);oppositeMean+=delta;if(delta>oppositeMax){oppositeMax=delta;oppositeAngle=i*.5;}}
      oppositeMean/=360;
      const harmonics={};
      for(let harmonic=1;harmonic<=4;harmonic+=1){let a=0,b=0;for(let i=0;i<radii.length;i+=1){const t=i*Math.PI/360;a+=radii[i]*Math.cos(harmonic*t);b+=radii[i]*Math.sin(harmonic*t);}harmonics[harmonic]=2*Math.hypot(a,b)/radii.length;}
      return {circle:{cx,cy,radius,rms,positive:deviations.max,negative:deviations.min},ellipse:{cx,cy,major,minor,ratio:major/(minor||1),eccentricity:Math.sqrt(Math.max(0,1-(minor/(major||1))**2)),ovality:(major-minor)/(major||1)*100,rotation,rms:ellipseRms},oppositeMean,oppositeMax,oppositeAngle,harmonics};
    },

    _updateCompassCalibrationOverlay() {
      this._compassCalibrationOverlayRenderer?.();
    },

    _setCompassCalibrationReports(compact,details=compact) {
      const report=this.shadow?.getElementById('compass-calibration-report');
      if(!report)return;
      const compactChanged=compact!==this._compassCalibrationReportText;
      this._compassCalibrationReportText=compact;
      this._compassCalibrationDetailText=details;
      if(!compactChanged)return;
      const backdrop=this.shadow?.getElementById('compass-calibration-modal-backdrop');
      const modal=backdrop?.querySelector('.compass-calibration-modal');
      const wasOpen=backdrop?.classList.contains('open');
      const previousScrollTop=modal?.scrollTop||0;
      report.textContent=compact;
      if(wasOpen&&modal)modal.scrollTop=previousScrollTop;
    },

    _measureCompassVisualDial(instrumentBounds,selector='[data-calibration-boundary="cover-contour"]',label='cover contour',includeStroke=true) {
      const boundary=this.shadow?.querySelector(selector);
      const compass=this.shadow?.getElementById('compass');
      const compassBounds=compass?.getBoundingClientRect();
      const invalid=(reason)=>({valid:false,source:`unavailable (${reason})`,compassBounds});
      if(!boundary||typeof boundary.getBBox!=='function'||typeof boundary.getScreenCTM!=='function')return invalid('SVG boundary missing');
      let box,ctm;
      try{box=boundary.getBBox();ctm=boundary.getScreenCTM();}catch{return invalid('SVG geometry error');}
      if(!ctm||!(box.width>0&&box.height>0))return invalid('empty SVG geometry');
      const svg=boundary.ownerSVGElement;
      const transform=(x,y)=>{const point=svg.createSVGPoint();point.x=x;point.y=y;return point.matrixTransform(ctm);};
      const cx=box.x+box.width/2,cy=box.y+box.height/2,r=(box.width+box.height)/4;
      const stroke=includeStroke?(Number.parseFloat(getComputedStyle(boundary).strokeWidth)||Number(boundary.getAttribute('stroke-width'))||0):0;
      if(![cx,cy,r].every(Number.isFinite)||!(r>0))return invalid('boundary is not a valid circle');
      const center=transform(cx,cy),edgeX=transform(cx+r+stroke/2,cy),edgeY=transform(cx,cy+r+stroke/2);
      const radiusX=Math.hypot(edgeX.x-center.x,edgeX.y-center.y),radiusY=Math.hypot(edgeY.x-center.x,edgeY.y-center.y);
      const radius=(radiusX+radiusY)/2,anisotropy=Math.abs(radiusX-radiusY)/(radius||1);
      const inside=center.x>=instrumentBounds.left-instrumentBounds.width&&center.x<=instrumentBounds.right+instrumentBounds.width&&center.y>=instrumentBounds.top-instrumentBounds.height&&center.y<=instrumentBounds.bottom+instrumentBounds.height;
      if(!(radius>0)||anisotropy>.02||!inside)return invalid('implausible transformed circle');
      return {valid:true,source:`${label} via getBBox/getScreenCTM`,center,radius,radiusX,radiusY,diameter:2*radius,compassBounds,internalMargin:((compassBounds?.width||0)-2*radius)/2,ratio:(2*radius)/(compassBounds?.width||1),box,ctm};
    },

    _updateCompassCalibrationReadout() {
      if (!this._compassCalibrationEnabled) return;
      const instrument=this.shadow?.getElementById('compass-instrument');
      const compass=this.shadow?.getElementById('compass');
      const frame=this.shadow?.getElementById('compass-metal-frame');
      const overlay=this.shadow?.getElementById('compass-calibration-overlay');
      const report=this.shadow?.getElementById('compass-calibration-report');
      if(!instrument||!compass||!overlay||!report)return;
      const style=getComputedStyle(instrument),size=style.getPropertyValue('--compass-dial-size').trim()||'–',shiftX=style.getPropertyValue('--compass-dial-shift-x').trim()||'–',shiftY=style.getPropertyValue('--compass-dial-shift-y').trim()||'–';
      const bounds=instrument.getBoundingClientRect(),compassBounds=compass.getBoundingClientRect(),frameBounds=frame?.getBoundingClientRect(),cardBounds=this.getBoundingClientRect();
      const needleBounds=this.shadow?.getElementById('compass-needle')?.getBoundingClientRect();
      const visualDial=this._measureCompassVisualDial(bounds);
      const protectedDial=this._measureCompassVisualDial(bounds,'[data-calibration-boundary="protected-tick-contour"]','protected outer marker/tick envelope',false);
      const design=instrument.dataset.compassDesign||this._activeCompassDesign||'C';
      const orientation=innerWidth>=innerHeight?'landscape':'portrait';
      const ratio=(box)=>box&&box.height>0?box.width/box.height:null;
      const wrapperRatio=ratio(bounds),compassRatio=ratio(compassBounds),frameRatio=ratio(frameBounds);
      const frameRound=frameRatio!==null&&Math.abs((frameBounds?.width||0)-(frameBounds?.height||0))<=.5;
      const base=[`KOMPASS-KALIBRIERUNG · DESIGN ${design}`,`Geometry version: protected-cover-fit-v3`,`Angle convention: 0° North, 90° East, clockwise`,``,`DARSTELLUNG`,`Viewport: ${innerWidth}x${innerHeight} ${orientation}`,`Card: ${Math.round(cardBounds.width)}x${Math.round(cardBounds.height)}`,`DPR: ${devicePixelRatio}`,`visualViewport.scale: ${window.visualViewport?.scale??'n/v'}`,`Shared wrapper: ${bounds.width.toFixed(2)}x${bounds.height.toFixed(2)} px`,`Shared wrapper ratio: ${wrapperRatio?.toFixed(4)??'n/v'}`,`Frame render: ${frameBounds&&frameBounds.width>0?`${frameBounds.width.toFixed(2)}x${frameBounds.height.toFixed(2)} px`:'n/v'}`,`Frame ratio: ${frameRatio?.toFixed(4)??'n/v'}`,`FRAME ROUNDNESS STATUS: ${frameRatio===null?'n/v':frameRound?'OK':'WARNUNG'}`,`Compass render: ${compassBounds.width.toFixed(2)}x${compassBounds.height.toFixed(2)} px`,`Compass ratio: ${compassRatio?.toFixed(4)??'n/v'}`,`CSS: ${size}; X ${shiftX}; Y ${shiftY}`,``,`AKTUELLER KOMPASS`,`Compass box: ${compassBounds.width.toFixed(2)}x${compassBounds.height.toFixed(2)} px`,`Cover contour valid: ${visualDial.valid?'YES':'NO'}`,`Cover contour: ${visualDial.valid?`${visualDial.diameter.toFixed(2)} px`:'unavailable'}`,`Cover source: ${visualDial.source}`,`Protected contour valid: ${protectedDial.valid?'YES':'NO'}`,`Protected contour: ${protectedDial.valid?`${protectedDial.diameter.toFixed(2)} px`:'unavailable'}`,`Protected source: ${protectedDial.source}`,`Internal radial margin to cover: ${visualDial.valid?`${visualDial.internalMargin.toFixed(2)} px`:'n/v'}`,needleBounds?`Needle/pivot center: ${(needleBounds.left+needleBounds.width/2-bounds.left).toFixed(2)},${(needleBounds.top+needleBounds.height/2-bounds.top).toFixed(2)}`:`Needle/pivot center: n/v`];
      const descriptor=COMPASS_DESIGNS.find((entry)=>entry.id===design)||COMPASS_DESIGNS[0];
      base.push('',...this._compassSelectorDiagnosticLines());
      base.unshift(`Intrusion zones: ${descriptor.intrusionAngles?.map((angle)=>`${angle}°`).join(', ')||'none'}`);
      base.unshift(`Outer overhangs: ${descriptor.outerOverhangs||'none'}`);
      base.unshift(`Fit contour: ${descriptor.fitContour}`);
      base.unshift(`Visual stage scale: ${(descriptor.visualStageScale||1).toFixed(3)}`);
      base.unshift(`Asset: ${instrument.dataset.compassAsset||'inline-svg'}`);
      base.unshift(`Internal ID: ${descriptor.id}`);
      base.unshift(`VARIANTE ${descriptor.uiIndex} / ${COMPASS_DESIGNS.length}`);
      overlay.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
      if(!visualDial.valid||!protectedDial.valid){base.push(``,`WARNING:`,`Cover/protected boundary unavailable.`,`Fit recommendation disabled.`,``,`KALIBRIERUNGSSTATUS`,`✗ Konturmessung nicht gültig`,`STATUS: MESSUNG NICHT GÜLTIG`);this._compassCalibrationOverlayRenderer=()=>overlay.replaceChildren();this._updateCompassCalibrationOverlay();this._setCompassCalibrationReports(base.join('\n'));return;}
      const opening=this._compassCalibrationOpening;
      if(design==='A'||!opening||!frame){base.push(`Frame: ${design==='A'?'n/v (design A)':'n/v'}`,`Opening: n/v`,`Gap: n/v`,`Recommendation: n/v`);this._compassCalibrationOverlayRenderer=()=>overlay.replaceChildren();this._updateCompassCalibrationOverlay();this._setCompassCalibrationReports(base.join('\n'));return;}
      const sx=frameBounds.width/opening.width,sy=frameBounds.height/opening.height;
      if(!(sx>0&&sy>0&&Number.isFinite(sx)&&Number.isFinite(sy))){base.push('Frame geometry: n/v');this._compassCalibrationOverlayRenderer=()=>overlay.replaceChildren();this._updateCompassCalibrationOverlay();this._setCompassCalibrationReports(base.join('\n'));return;}
      const frameLeft=frameBounds.left-bounds.left,frameTop=frameBounds.top-bounds.top;
      const compassCx=(visualDial.center.x-bounds.left-frameLeft)/sx,compassCy=(visualDial.center.y-bounds.top-frameTop)/sy;
      const roundProfile=descriptor.calibrationRound||(design==='D'?[626/1254,603/1254,417/1254]:null),dIntrusionMode=!!roundProfile,protectedRoundFit=descriptor.roundFitMode==='protected';
      const dRound=dIntrusionMode?{cx:opening.width*roundProfile[0],cy:opening.height*roundProfile[1],radius:opening.width*roundProfile[2]}:null;
      const primaryCenterX=dRound?.cx??opening.centerX,primaryCenterY=dRound?.cy??opening.centerY;
      const rawFormRadii=this._calibrationRadialProfile(opening.openingMask,opening.width,opening.height,primaryCenterX,primaryCenterY);
      const formRadii=dIntrusionMode?this._calibrationCircleRadialProfile(primaryCenterX,primaryCenterY,dRound.cx,dRound.cy,dRound.radius):rawFormRadii;
      const gapOpeningRadii=dIntrusionMode?this._calibrationCircleRadialProfile(compassCx,compassCy,dRound.cx,dRound.cy,dRound.radius):this._calibrationRadialProfile(opening.openingMask,opening.width,opening.height,compassCx,compassCy);
      const compassRadiusNatural=visualDial.radius/Math.min(sx,sy);
      const gaps=Float32Array.from(gapOpeningRadii,(radius)=>radius*Math.min(sx,sy)-compassRadiusNatural*Math.min(sx,sy));
      const fitOpening=dIntrusionMode?{contour:Array.from(formRadii,(radius,index)=>{const angle=index*.5*Math.PI/180;return [dRound.cx+Math.sin(angle)*radius,dRound.cy-Math.cos(angle)*radius];})}:opening;
      const gapStats=this._calibrationStats(gaps),fits=this._calibrationFits(fitOpening,formRadii);
      const outerRadii=this._calibrationRadialProfile(opening.metalMask,opening.width,opening.height,opening.centerX,opening.centerY,true);
      const outerContour=Array.from(outerRadii,(radius,index)=>{const angle=index*.5*Math.PI/180;return [opening.centerX+Math.sin(angle)*radius,opening.centerY-Math.cos(angle)*radius];});
      const outerFits=this._calibrationFits({contour:outerContour},outerRadii);
      const thickness=Float32Array.from(outerRadii,(radius,index)=>(radius-formRadii[index])*Math.min(sx,sy));
      const thicknessStats=this._calibrationStats(thickness);
      const renderScale=Math.min(sx,sy),targetOverlap=2,protectedTarget=1.5;
      const currentCoverNatural=gapOpeningRadii.reduce((a,b)=>Math.max(a,b),0);
      const currentCoverRendered=currentCoverNatural*renderScale;
      const enclosing=dIntrusionMode?{cx:dRound.cx,cy:dRound.cy,radius:dRound.radius}:opening.enclosingCircle;
      const optimalCoverRendered=enclosing.radius*renderScale;
      const currentRecommended=(2*(currentCoverRendered+targetOverlap)/(visualDial.ratio*(bounds.width||1)))*100;
      const dRoundRecommended=(2*(optimalCoverRendered+targetOverlap)/(visualDial.ratio*(bounds.width||1)))*100;
      const protectedCx=(protectedDial.center.x-bounds.left-frameLeft)/sx,protectedCy=(protectedDial.center.y-bounds.top-frameTop)/sy;
      const protectedOpeningRadii=dIntrusionMode?this._calibrationCircleRadialProfile(protectedCx,protectedCy,dRound.cx,dRound.cy,dRound.radius):this._calibrationRadialProfile(opening.openingMask,opening.width,opening.height,protectedCx,protectedCy);
      const protectedRadiusNatural=protectedDial.radius/renderScale;
      const protectedReserves=Float32Array.from(protectedOpeningRadii,(radius)=>(radius-protectedRadiusNatural)*renderScale);
      const protectedStats=this._calibrationStats(protectedReserves);
      const optimalCenterX=dRound?.cx??opening.inscribedCenterX,optimalCenterY=dRound?.cy??opening.inscribedCenterY;
      const optimalProtectedRadii=dIntrusionMode?this._calibrationCircleRadialProfile(optimalCenterX,optimalCenterY,dRound.cx,dRound.cy,dRound.radius):this._calibrationRadialProfile(opening.openingMask,opening.width,opening.height,optimalCenterX,optimalCenterY);
      const limitingProtectedNatural=optimalProtectedRadii.reduce((a,b)=>Math.min(a,b),Infinity);
      const protectedRecommended=(2*(limitingProtectedNatural*renderScale-protectedTarget)/(protectedDial.ratio*(bounds.width||1)))*100;
      const optimalRecommended=protectedRoundFit?protectedRecommended:dIntrusionMode?dRoundRecommended:protectedRecommended;
      const optimalX=(frameLeft+optimalCenterX*sx)-bounds.width/2,optimalY=(frameTop+optimalCenterY*sy)-bounds.height/2;
      const recommendedCompassDiameter=optimalRecommended/100*bounds.width;
      const optimalXPercent=optimalX/(recommendedCompassDiameter||1)*100,optimalYPercent=optimalY/(recommendedCompassDiameter||1)*100;
      const currentOverlaps=Float32Array.from(gaps,(gap)=>-gap),currentOverlapStats=this._calibrationStats(currentOverlaps);
      const optimalOpeningRadii=dIntrusionMode?this._calibrationCircleRadialProfile(enclosing.cx,enclosing.cy,dRound.cx,dRound.cy,dRound.radius):this._calibrationRadialProfile(opening.openingMask,opening.width,opening.height,enclosing.cx,enclosing.cy);
      const targetRadiusRendered=optimalCoverRendered+targetOverlap;
      const targetOverlaps=Float32Array.from(optimalOpeningRadii,(radius)=>targetRadiusRendered-radius*renderScale);
      const targetOverlapStats=this._calibrationStats(targetOverlaps);
      const visibleGap=Math.max(0,gapStats.max),frameRecommendationX=bounds.width/2-(frameLeft+enclosing.cx*sx),frameRecommendationY=bounds.height/2-(frameTop+enclosing.cy*sy);
      const centerDistance=Math.hypot(protectedDial.center.x-bounds.left-(frameLeft+optimalCenterX*sx),protectedDial.center.y-bounds.top-(frameTop+optimalCenterY*sy));
      const measurementPlausible=visualDial.ratio>.5&&visualDial.ratio<=1&&optimalRecommended>50&&optimalRecommended<120&&Math.abs(optimalX)<bounds.width/2&&Math.abs(optimalY)<bounds.height/2;
      const backingBounds=this.shadow?.getElementById('compass-aperture-backing')?.getBoundingClientRect();
      const backingRadius=(backingBounds?.width||0)/2,backingCenter={x:(backingBounds?.left||bounds.left)+backingRadius-bounds.left,y:(backingBounds?.top||bounds.top)+backingRadius-bounds.top};
      const backingCx=(backingCenter.x-frameLeft)/sx,backingCy=(backingCenter.y-frameTop)/sy;
      const backingOpeningRadii=this._calibrationRadialProfile(opening.openingMask,opening.width,opening.height,backingCx,backingCy);
      const seamGaps=Float32Array.from(backingOpeningRadii,(radius)=>radius*renderScale-backingRadius),seamStats=this._calibrationStats(seamGaps);
      const backingOverlaps=Float32Array.from(seamGaps,(gap)=>-gap),backingOverlapStats=this._calibrationStats(backingOverlaps);
      const backingEnabled=!!backingBounds?.width,finalSeamStats=backingEnabled?seamStats:gapStats;
      const dTrueClipping=dIntrusionMode?Math.max(0,-gapStats.min-targetOverlap):0;
      const apertureRadius=(dRound?.radius??opening.inscribedRadius)*renderScale;
      const fitLimits={maxVisibleGapRatio:.002,maxOverlapRatio:.02,minProtectedReserveRatio:.009,maxProtectedReserveRatio:.03,maxCenterResidualRatio:.002,maxClippingRatio:.002};
      const normalizedFit={overlapMinRatio:Math.max(0,-finalSeamStats.max)/apertureRadius,overlapMaxRatio:Math.max(0,-finalSeamStats.min)/apertureRadius,visibleGapMaxRatio:Math.max(0,finalSeamStats.max)/apertureRadius,tickReserveMinRatio:protectedStats.min/apertureRadius,tickReserveMaxRatio:protectedStats.max/apertureRadius,centerResidualRatio:centerDistance/apertureRadius,clippingRatio:dTrueClipping/apertureRadius};
      const fitReasons=[];
      if(!measurementPlausible||!visualDial.valid||!protectedDial.valid)fitReasons.push('measurement invalid or implausible');
      if(normalizedFit.visibleGapMaxRatio>fitLimits.maxVisibleGapRatio)fitReasons.push(`visible gap ${(normalizedFit.visibleGapMaxRatio*100).toFixed(3)}% exceeds ${(fitLimits.maxVisibleGapRatio*100).toFixed(3)}%`);
      if(!backingEnabled&&normalizedFit.overlapMaxRatio>fitLimits.maxOverlapRatio)fitReasons.push(`overlap ${(normalizedFit.overlapMaxRatio*100).toFixed(3)}% exceeds ${(fitLimits.maxOverlapRatio*100).toFixed(3)}%`);
      if(protectedRoundFit&&normalizedFit.tickReserveMinRatio<fitLimits.minProtectedReserveRatio)fitReasons.push(`protected tick reserve ${(normalizedFit.tickReserveMinRatio*100).toFixed(3)}% is below ${(fitLimits.minProtectedReserveRatio*100).toFixed(3)}%`);
      if(protectedRoundFit&&normalizedFit.tickReserveMaxRatio>fitLimits.maxProtectedReserveRatio)fitReasons.push(`protected tick reserve ${(normalizedFit.tickReserveMaxRatio*100).toFixed(3)}% exceeds ${(fitLimits.maxProtectedReserveRatio*100).toFixed(3)}%`);
      if(normalizedFit.centerResidualRatio>fitLimits.maxCenterResidualRatio)fitReasons.push(`center residual ${(normalizedFit.centerResidualRatio*100).toFixed(3)}% exceeds ${(fitLimits.maxCenterResidualRatio*100).toFixed(3)}%`);
      if(normalizedFit.clippingRatio>fitLimits.maxClippingRatio)fitReasons.push(`clipping ${(normalizedFit.clippingRatio*100).toFixed(3)}% exceeds ${(fitLimits.maxClippingRatio*100).toFixed(3)}%`);
      if((design==='candidate_05'||design==='candidate_06')&&backingEnabled)fitReasons.push('candidate aperture backing must be disabled');
      const fitPassed=fitReasons.length===0,protectedPass=!protectedRoundFit||normalizedFit.tickReserveMinRatio>=fitLimits.minProtectedReserveRatio,primaryFitPass=normalizedFit.clippingRatio<=fitLimits.maxClippingRatio,centerPass=normalizedFit.centerResidualRatio<=fitLimits.maxCenterResidualRatio,visualSeamPass=normalizedFit.visibleGapMaxRatio<=fitLimits.maxVisibleGapRatio&&(backingEnabled||normalizedFit.overlapMaxRatio<=fitLimits.maxOverlapRatio);
      this._compassActiveFitDiagnostics={design,asset:instrument.dataset.compassAsset||'inline-svg',wrapper:{width:bounds.width,height:bounds.height},frame:{width:frameBounds.width,height:frameBounds.height},visibleMetalAperture:{centerX:frameLeft+optimalCenterX*sx,centerY:frameTop+optimalCenterY*sy,radius:apertureRadius},dialFace:{centerX:visualDial.center.x-bounds.left,centerY:visualDial.center.y-bounds.top,radius:visualDial.radius,gapMin:gapStats.min,gapMax:gapStats.max},visualSeam:{gapMin:finalSeamStats.min,gapMax:finalSeamStats.max},protectedTicks:{centerX:protectedDial.center.x-bounds.left,centerY:protectedDial.center.y-bounds.top,radius:protectedDial.radius,reserveMin:protectedStats.min,reserveMax:protectedStats.max},pivot:needleBounds?{centerX:needleBounds.left+needleBounds.width/2-bounds.left,centerY:needleBounds.top+needleBounds.height/2-bounds.top}:null,centerResidual:centerDistance,backingEnabled,normalizedFit,fitLimits,fitPassed,status:fitPassed?'OK':'REVIEW',statusReasons:fitPassed?['all normalized fit rules passed']:fitReasons,boundaryEvidence:opening.boundaryEvidence};
      this._compassLiveFits=this._compassLiveFits||{};
      this._compassLiveFits[design]=this._compassActiveFitDiagnostics;
      base.push('',`SKALENNEUTRALER FIT-STATUS`,`Referenz: sichtbarer Aperturradius ${apertureRadius.toFixed(3)} Render-px = 1.000000`,`Overlap min/max: ${(normalizedFit.overlapMinRatio*100).toFixed(4)}% / ${(normalizedFit.overlapMaxRatio*100).toFixed(4)}% (max ${(fitLimits.maxOverlapRatio*100).toFixed(3)}%)`,`Visible gap max: ${(normalizedFit.visibleGapMaxRatio*100).toFixed(4)}% (max ${(fitLimits.maxVisibleGapRatio*100).toFixed(3)}%)`,`Tick reserve min/max: ${(normalizedFit.tickReserveMinRatio*100).toFixed(4)}% / ${(normalizedFit.tickReserveMaxRatio*100).toFixed(4)}%${protectedRoundFit?` (min ${(fitLimits.minProtectedReserveRatio*100).toFixed(3)}%)`:' (design-specific informational)'}`,`Center residual: ${(normalizedFit.centerResidualRatio*100).toFixed(4)}% (max ${(fitLimits.maxCenterResidualRatio*100).toFixed(3)}%)`,`Clipping: ${(normalizedFit.clippingRatio*100).toFixed(4)}% (max ${(fitLimits.maxClippingRatio*100).toFixed(3)}%)`,`Status reasons: ${this._compassActiveFitDiagnostics.statusReasons.join('; ')}`);
      const angles=[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330];
      const dIntrusions=dIntrusionMode?[0,90,180,270].map((angle)=>({angle,depth:Math.max(0,dRound.radius-rawFormRadii[angle*2])*renderScale})):[];
      base.push('',`PIXEL-/ALPHA-NACHWEIS`,`Methode: ${opening.boundaryEvidence?.method||'n/v'}`,`Transparente Kontur: ${opening.boundaryEvidence?.transparentAlpha?.samples??0} Samples; Alpha min/mean/max ${opening.boundaryEvidence?.transparentAlpha?`${opening.boundaryEvidence.transparentAlpha.min.toFixed(2)} / ${opening.boundaryEvidence.transparentAlpha.mean.toFixed(2)} / ${opening.boundaryEvidence.transparentAlpha.max.toFixed(2)}`:'n/v'}`,`Angrenzendes Metall: ${opening.boundaryEvidence?.metalAlpha?.samples??0} Samples; Alpha min/mean/max ${opening.boundaryEvidence?.metalAlpha?`${opening.boundaryEvidence.metalAlpha.min.toFixed(2)} / ${opening.boundaryEvidence.metalAlpha.mean.toFixed(2)} / ${opening.boundaryEvidence.metalAlpha.max.toFixed(2)}`:'n/v'}`,`Metall-Luminanz min/mean/max ${opening.boundaryEvidence?.metalLuma?`${opening.boundaryEvidence.metalLuma.min.toFixed(2)} / ${opening.boundaryEvidence.metalLuma.mean.toFixed(2)} / ${opening.boundaryEvidence.metalLuma.max.toFixed(2)}`:'n/v'}`);
      base.push(``,`RAHMENÖFFNUNG`,`Frame asset: ${frame.currentSrc||frame.src}`,`Frame natural: ${opening.width}x${opening.height}; loaded YES; canvas YES`,`Opening: ${Math.round(opening.openingWidth*sx)}x${Math.round(opening.openingHeight*sy)}`,`Frame opening max radius: ${currentCoverRendered.toFixed(2)} px`,`Circle fit: center ${fits.circle.cx.toFixed(2)},${fits.circle.cy.toFixed(2)}; r ${fits.circle.radius.toFixed(2)}; RMS ${fits.circle.rms.toFixed(2)}; +${fits.circle.positive.toFixed(2)}/${fits.circle.negative.toFixed(2)}`,`Ellipse fit: a ${fits.ellipse.major.toFixed(2)}; b ${fits.ellipse.minor.toFixed(2)}; ratio ${fits.ellipse.ratio.toFixed(4)}; e ${fits.ellipse.eccentricity.toFixed(4)}; ovality ${fits.ellipse.ovality.toFixed(2)}%; axis ${fits.ellipse.rotation.toFixed(1)}°; RMS ${fits.ellipse.rms.toFixed(2)}`,`Circle RMS vs ellipse RMS: ${fits.circle.rms.toFixed(2)} / ${fits.ellipse.rms.toFixed(2)}`,`Opposite symmetry: mean ${fits.oppositeMean.toFixed(2)}; max ${fits.oppositeMax.toFixed(2)} at ${fits.oppositeAngle.toFixed(1)}°`,`Minimum enclosing circle: center ${enclosing.cx.toFixed(2)},${enclosing.cy.toFixed(2)}; r ${enclosing.radius.toFixed(2)}; d ${(2*enclosing.radius).toFixed(2)}`,``,`SPALTANALYSE`,`Gap semantics: positive = visible free gap; zero = touch; negative = overlap below metal frame`,`Visual gap min ${gapStats.min.toFixed(2)} px @ ${gapStats.minAngle.toFixed(1)}°; max ${gapStats.max.toFixed(2)} px @ ${gapStats.maxAngle.toFixed(1)}°`,`Visible free gap: ${visibleGap.toFixed(2)} px`,`Minimum overlap: ${currentOverlapStats.min.toFixed(2)} px @ ${currentOverlapStats.minAngle.toFixed(1)}°; maximum overlap: ${currentOverlapStats.max.toFixed(2)} px @ ${currentOverlapStats.maxAngle.toFixed(1)}°`,`Gap mean/median/std: ${gapStats.mean.toFixed(2)} / ${gapStats.median.toFixed(2)} / ${gapStats.std.toFixed(2)} px`,`Gap P05/P95: ${gapStats.p05.toFixed(2)} / ${gapStats.p95.toFixed(2)} px`,...angles.map((angle)=>`Gap ${angle}°: ${gaps[angle*2].toFixed(2)} px`),``,`KALIBRIERUNGSSTATUS`,`${visualDial.valid?'✓':'✗'} Visual-Dial-Messung gültig`,`${visualDial.source.includes('bounding box')?'✗':'✓'} Keine Boundingbox-Fallback-Messung`,`${gapStats.max<=.5?'✓':'✗'} ${gapStats.max<=.5?'Kein sichtbarer positiver Gap':`Sichtbarer Gap ${gapStats.max.toFixed(2)} px bei ${gapStats.maxAngle.toFixed(1)}°`}`,`${currentOverlapStats.min>=1.5&&currentOverlapStats.min<=3?'✓':'✗'} Mindestüberdeckung ${currentOverlapStats.min.toFixed(2)} px`,`${centerDistance<=.5?'✓':'✗'} Zentrumabweichung ${centerDistance.toFixed(2)} px`,`STATUS: ${fitPassed?'BESTANDEN':'KORREKTUR ERFORDERLICH'}`,``,`EMPFEHLUNG`,`Size: ${optimalRecommended.toFixed(1)} % (aktuell ${parseFloat(size).toFixed(1)} %, Δ ${(optimalRecommended-parseFloat(size)).toFixed(1)} %)`,`X: ${optimalXPercent.toFixed(2)} % (aktuell ${parseFloat(shiftX).toFixed(2)} %, Δ ${(optimalXPercent-parseFloat(shiftX)).toFixed(2)} %)`,`Y: ${optimalYPercent.toFixed(2)} % (aktuell ${parseFloat(shiftY).toFixed(2)} %, Δ ${(optimalYPercent-parseFloat(shiftY)).toFixed(2)} %)`,`Erwarteter schlechtester Overlap: ${targetOverlapStats.min.toFixed(2)} px @ ${targetOverlapStats.minAngle.toFixed(1)}°`,``,`RAHMENGEOMETRIE`,`Outer circle: center ${outerFits.circle.cx.toFixed(2)},${outerFits.circle.cy.toFixed(2)}; r ${outerFits.circle.radius.toFixed(2)}; RMS ${outerFits.circle.rms.toFixed(2)}`,`Outer ellipse: a ${outerFits.ellipse.major.toFixed(2)}; b ${outerFits.ellipse.minor.toFixed(2)}; ovality ${outerFits.ellipse.ovality.toFixed(2)}%; axis ${outerFits.ellipse.rotation.toFixed(1)}°; RMS ${outerFits.ellipse.rms.toFixed(2)}`,`Inner/outer center delta: X ${(fits.ellipse.cx-outerFits.ellipse.cx).toFixed(2)}; Y ${(fits.ellipse.cy-outerFits.ellipse.cy).toFixed(2)}`,`Frame shift recommendation (diagnostic only): X ${frameRecommendationX>=0?'+':''}${frameRecommendationX.toFixed(2)} px; Y ${frameRecommendationY>=0?'+':''}${frameRecommendationY.toFixed(2)} px`,`Diagnostic only – moving the complete frame would also move its outer metal geometry.`,`Frame thickness: min ${thicknessStats.min.toFixed(2)} @ ${thicknessStats.minAngle.toFixed(1)}°; max ${thicknessStats.max.toFixed(2)} @ ${thicknessStats.maxAngle.toFixed(1)}°; mean ${thicknessStats.mean.toFixed(2)}; std ${thicknessStats.std.toFixed(2)} px`,``,`TECHNISCHE FITS`,`Inscribed fit (form diagnostic): center ${opening.inscribedCenterX.toFixed(2)},${opening.inscribedCenterY.toFixed(2)}; r ${opening.inscribedRadius.toFixed(2)}`,`Required visual cover radius: ${optimalCoverRendered.toFixed(2)} px; with overlap ${targetRadiusRendered.toFixed(2)} px`,`Visual cover fit: center ${enclosing.cx.toFixed(2)},${enclosing.cy.toFixed(2)}; r ${enclosing.radius.toFixed(2)} natural / ${optimalCoverRendered.toFixed(2)} px`,`Target seam overlap: ${targetOverlap.toFixed(1)} px`,`Resulting scale: ${optimalRecommended.toFixed(1)} %`,`Expected target overlap: min ${targetOverlapStats.min.toFixed(2)} px; max ${targetOverlapStats.max.toFixed(2)} px`);
      if(dIntrusionMode)base.push(``,`RUNDE ZIELKONTUR`,`Aktives Design: ${descriptor.uiIndex} / ${design}`,`PRIMARY FIT / SIZE BASIS: ${protectedRoundFit?'geschützte Grad-/Tick-Kontur':'sichtbare Dial-Face-Kontur'} an der runden inneren Metalleinfassung`,`ALLOWED OVERHANGS: äußere Schraubenköpfe und dekorative Außenkontur`,`Schraubenköpfe sind nicht größenlimitierend, da sie außerhalb der primären Innenkontur liegen.`,`Intrusion-Logik aktiv: ja`,`Intrusion-Winkel: ${descriptor.intrusionAngles?.map((angle)=>`${angle}°`).join(', ')||'none'}`,...dIntrusions.map(({angle,depth})=>`Intrusion ${angle}°: ${depth.toFixed(2)} px`),`Rundkontur: center ${dRound.cx.toFixed(2)},${dRound.cy.toFixed(2)}; radius ${dRound.radius.toFixed(2)} natural / ${(dRound.radius*renderScale).toFixed(2)} px`,`Aktuelle Größe: ${parseFloat(size).toFixed(1)} %; empfohlene Größe: ${optimalRecommended.toFixed(1)} %`,`X/Y aktuell: ${parseFloat(shiftX).toFixed(2)} % / ${parseFloat(shiftY).toFixed(2)} %`,`Fit zur runden Innenkontur: Dial-Face-Randabstand min ${gapStats.min.toFixed(2)} px; center delta ${centerDistance.toFixed(2)} px`,`Geschützte Tick-Reserve min/max ${protectedStats.min.toFixed(2)} / ${protectedStats.max.toFixed(2)} px`,`Zulässige Nahtüberdeckung unter Metallring: ${targetOverlap.toFixed(1)} px`,`Echtes ungewolltes Clipping außerhalb der Rundkontur: ${dTrueClipping>0?`${dTrueClipping.toFixed(2)} px`:'keines'}`);
      const calibrationStatusIndex=base.indexOf('KALIBRIERUNGSSTATUS'),frameGeometryIndex=base.indexOf('RAHMENGEOMETRIE');
      if(calibrationStatusIndex>=0&&frameGeometryIndex>calibrationStatusIndex)base.splice(calibrationStatusIndex,frameGeometryIndex-calibrationStatusIndex,
        'KALIBRIERUNGSSTATUS',dIntrusionMode?'A) PRIMARY FIT / RUNDE INNENKONTUR':'A) Grad-/Tick-Schutz',
        dIntrusionMode?`${primaryFitPass?'✓':'✗'} Dial-Face-Fit: min ${gapStats.min.toFixed(2)} px; erlaubte Überdeckung ${targetOverlap.toFixed(1)} px`:`${protectedPass?'✓':'✗'} Min protected reserve ${protectedStats.min.toFixed(2)} px @ ${protectedStats.minAngle.toFixed(1)}° (target ${protectedTarget.toFixed(1)} px)`,
        dIntrusionMode?`${primaryFitPass?'✓ Kein ungewolltes Clipping außerhalb der Rundkontur':`✗ Ungewolltes Clipping ${dTrueClipping.toFixed(2)} px`}`:`${protectedPass?'✓ Kein Clipping des äußeren Grad-Kranzes':`✗ Schutzreserve unterschritten bei ${protectedStats.minAngle.toFixed(1)}°`}`,
        `Max protected reserve ${protectedStats.max.toFixed(2)} px @ ${protectedStats.maxAngle.toFixed(1)}°`,
        '','B) Originales Dial-Face (diagnostisch)',`Face gap min/max ${gapStats.min.toFixed(2)} / ${gapStats.max.toFixed(2)} px`,
        '','C) Öffnungsausgleich',`Aperture backing: enabled ${backingEnabled?'YES':'NO'}${backingEnabled?`; shape circle; center ${backingCenter.x.toFixed(2)},${backingCenter.y.toFixed(2)} px; radius ${backingRadius.toFixed(2)} px`:''}`,
        `Final visual seam gap min/max ${finalSeamStats.min.toFixed(2)} / ${finalSeamStats.max.toFixed(2)} px`,backingEnabled?`Backing overlap min/max ${backingOverlapStats.min.toFixed(2)} / ${backingOverlapStats.max.toFixed(2)} px`:'Backing overlap min/max n/v',
        `${visualSeamPass?'✓ Öffnung vollständig ausgeglichen':'✗ Sichtbare Naht nicht geschlossen'}`,
        '','D) Zentrum',`Aktuelles Zentrum ${(protectedDial.center.x-bounds.left).toFixed(2)},${(protectedDial.center.y-bounds.top).toFixed(2)} px`,
        `Optimales Zentrum ${(frameLeft+optimalCenterX*sx).toFixed(2)},${(frameTop+optimalCenterY*sy).toFixed(2)} px`,`Restabweichung ${centerDistance.toFixed(2)} px`,
        '','GESAMTSTATUS',dIntrusionMode?`${primaryFitPass?'✓ Rundkontur korrekt ausgefüllt':'✗ Rundkontur überschritten'}`:`${protectedPass?'✓ Schutzkontur mit robuster Reserve sichtbar':'✗ Schutzreserve unzureichend'}`,`${centerPass?'✓ Zentrierung korrekt':'✗ Zentrierung korrigieren'}`,`${visualSeamPass?'✓ Kein sichtbarer Öffnungsspalt':'✗ Sichtbarer Öffnungsspalt'}`,
        `STATUS: ${fitPassed?'BESTANDEN':'KORREKTUR ERFORDERLICH'}`,'',`EMPFOHLENE ${design}-KALIBRIERUNG`,
        `Size: ${optimalRecommended.toFixed(1)} %`,`X: ${optimalXPercent.toFixed(2)} %`,`Y: ${optimalYPercent.toFixed(2)} %`,
        backingEnabled?`Begründung: designspezifisches Apertur-Backing deckt die unregelmäßige Öffnung ab; Überdeckung unter Metall ist rein diagnostisch.`:`Begründung: maximale uniforme Größe mit ${protectedTarget.toFixed(1)} px Tick-Reserve; die reale SVG-Dialfläche schließt die Naht ohne separates Backing.`,'');
      this._compassCalibrationOverlayRenderer=()=>{
      overlay.replaceChildren();
      const ns='http://www.w3.org/2000/svg',svg=(name,attrs)=>{const node=document.createElementNS(ns,name);Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,String(value)));overlay.append(node);return node;};
      svg('path',{d:Array.from(formRadii).map((radius,index)=>{const angle=index*.5*Math.PI/180;return `${index?'L':'M'} ${frameLeft+(opening.centerX+Math.sin(angle)*radius)*sx} ${frameTop+(opening.centerY-Math.cos(angle)*radius)*sy}`;}).join(' ')+' Z',fill:'none',stroke:'#ff5364','stroke-width':1.4});
      const compassCenterRendered={x:visualDial.center.x-bounds.left,y:visualDial.center.y-bounds.top};
      if(this._compassCalibrationRings.visual)svg('circle',{cx:compassCenterRendered.x,cy:compassCenterRendered.y,r:visualDial.radius,fill:'none',stroke:'#ffd34e','stroke-width':1.5});
      const protectedCenterRendered={x:protectedDial.center.x-bounds.left,y:protectedDial.center.y-bounds.top};
      if(this._compassCalibrationRings.protected)svg('circle',{cx:protectedCenterRendered.x,cy:protectedCenterRendered.y,r:protectedDial.radius,fill:'none',stroke:'#f4f7fb','stroke-width':1.5,'stroke-dasharray':'5 2'});
      if(this._compassCalibrationRings.backing)svg('circle',{cx:backingCenter.x,cy:backingCenter.y,r:backingRadius,fill:'none',stroke:'#4fe3c1','stroke-width':1.5,'stroke-dasharray':'7 2'});
      if(this._compassCalibrationRings.bounding)svg('rect',{x:compassBounds.left-bounds.left,y:compassBounds.top-bounds.top,width:compassBounds.width,height:compassBounds.height,fill:'none',stroke:'#a7adb8','stroke-dasharray':'2 3'});
      const primaryRadius=dRound?.radius??opening.inscribedRadius;
      if(this._compassCalibrationRings.maximum)svg('circle',{cx:frameLeft+optimalCenterX*sx,cy:frameTop+optimalCenterY*sy,r:primaryRadius*Math.min(sx,sy),fill:'none',stroke:'#60f0a8','stroke-dasharray':'5 3'});
      if(this._compassCalibrationRings.safety)svg('circle',{cx:frameLeft+optimalCenterX*sx,cy:frameTop+optimalCenterY*sy,r:Math.max(0,primaryRadius*Math.min(sx,sy)-2),fill:'none',stroke:'#67a9ff','stroke-dasharray':'2 3'});
      if(this._compassCalibrationRings.cover)svg('circle',{cx:frameLeft+enclosing.cx*sx,cy:frameTop+enclosing.cy*sy,r:enclosing.radius*renderScale,fill:'none',stroke:'#56d8ff','stroke-dasharray':'7 3'});
      if(this._compassCalibrationRings.target)svg('circle',{cx:frameLeft+enclosing.cx*sx,cy:frameTop+enclosing.cy*sy,r:enclosing.radius*renderScale+targetOverlap,fill:'none',stroke:'#ffcf40','stroke-dasharray':'3 2','stroke-width':1.5});
      if(this._compassCalibrationRings.gapring)for(let index=0;index<protectedReserves.length;index+=1){const angle=index*.5*Math.PI/180,radius=protectedOpeningRadii[index]*renderScale+3,color=protectedReserves[index]<-.3?'#ff4058':protectedReserves[index]<1?'#ff9b42':'#55e5a2',next=(index+1)*.5*Math.PI/180;svg('line',{x1:protectedCenterRendered.x+Math.sin(angle)*radius,y1:protectedCenterRendered.y-Math.cos(angle)*radius,x2:protectedCenterRendered.x+Math.sin(next)*radius,y2:protectedCenterRendered.y-Math.cos(next)*radius,stroke:color,'stroke-width':2});}
      if(this._compassCalibrationRings.circle)svg('circle',{cx:frameLeft+fits.circle.cx*sx,cy:frameTop+fits.circle.cy*sy,r:fits.circle.radius*Math.min(sx,sy),fill:'none',stroke:'#ce74ff'});
      if(this._compassCalibrationRings.ellipse)svg('ellipse',{cx:frameLeft+fits.ellipse.cx*sx,cy:frameTop+fits.ellipse.cy*sy,rx:fits.ellipse.major*sx,ry:fits.ellipse.minor*sy,transform:`rotate(${fits.ellipse.rotation-90} ${frameLeft+fits.ellipse.cx*sx} ${frameTop+fits.ellipse.cy*sy})`,fill:'none',stroke:'#ff9b42'});
      if(this._compassCalibrationRings.outer)svg('path',{d:outerContour.map((p,i)=>`${i?'L':'M'} ${frameLeft+p[0]*sx} ${frameTop+p[1]*sy}`).join(' ')+' Z',fill:'none',stroke:'#fff','stroke-dasharray':'4 4'});
      if(this._compassCalibrationRings.centers){[[bounds.width/2,bounds.height/2,'#58d7ff'],[frameLeft+opening.centerX*sx,frameTop+opening.centerY*sy,'#ff5364'],[frameLeft+opening.inscribedCenterX*sx,frameTop+opening.inscribedCenterY*sy,'#60f0a8'],[frameLeft+enclosing.cx*sx,frameTop+enclosing.cy*sy,'#56d8ff'],[compassCenterRendered.x,compassCenterRendered.y,'#ffd34e']].forEach(([cx,cy,color])=>{svg('line',{x1:cx-5,y1:cy,x2:cx+5,y2:cy,stroke:color});svg('line',{x1:cx,y1:cy-5,x2:cx,y2:cy+5,stroke:color});});}
      if(this._compassCalibrationRings.rays){[gapStats.minAngle,gapStats.maxAngle].forEach((angle,index)=>{const rad=angle*Math.PI/180,length=gapOpeningRadii[Math.round(angle*2)]*Math.min(sx,sy);svg('line',{x1:compassCenterRendered.x,y1:compassCenterRendered.y,x2:compassCenterRendered.x+Math.sin(rad)*length,y2:compassCenterRendered.y-Math.cos(rad)*length,stroke:index?'#55e5a2':'#ff4058','stroke-width':1.5});});}
      if(this._compassCalibrationRings.rays){const angle=protectedStats.minAngle,rad=angle*Math.PI/180,length=protectedOpeningRadii[Math.round(angle*2)]*renderScale;svg('line',{x1:protectedCenterRendered.x,y1:protectedCenterRendered.y,x2:protectedCenterRendered.x+Math.sin(rad)*length,y2:protectedCenterRendered.y-Math.cos(rad)*length,stroke:'#ff40a0','stroke-width':1.8});}
      if(dIntrusionMode&&this._compassCalibrationRings.rays)dIntrusions.forEach(({angle})=>{const rad=angle*Math.PI/180,index=angle*2,inner=rawFormRadii[index]*renderScale,outer=dRound.radius*renderScale,cx=frameLeft+dRound.cx*sx,cy=frameTop+dRound.cy*sy;svg('line',{x1:cx+Math.sin(rad)*inner,y1:cy-Math.cos(rad)*inner,x2:cx+Math.sin(rad)*outer,y2:cy-Math.cos(rad)*outer,stroke:'#ff7bd5','stroke-width':2.2});});
      if(this._compassCalibrationRings.angles){for(let angle=0;angle<360;angle+=15){const rad=angle*Math.PI/180,r=bounds.width*.49,len=angle%45===0?8:4;svg('line',{x1:bounds.width/2+Math.sin(rad)*(r-len),y1:bounds.height/2-Math.cos(rad)*(r-len),x2:bounds.width/2+Math.sin(rad)*r,y2:bounds.height/2-Math.cos(rad)*r,stroke:'#97e0ff'});}}
      };
      this._updateCompassCalibrationOverlay();
      const details=[...base,`Contour parameters: cover ratio ${visualDial.ratio.toFixed(8)}; protected ratio ${protectedDial.ratio.toFixed(8)}; contour points ${opening.contour.length}; render scale ${renderScale.toFixed(8)}; cover center ${compassCx.toFixed(4)},${compassCy.toFixed(4)}; protected center ${protectedCx.toFixed(4)},${protectedCy.toFixed(4)}; MEC ${JSON.stringify(enclosing)}`,`Harmonics: ${Object.entries(fits.harmonics).map(([key,value])=>`H${key} ${value.toFixed(3)}`).join('; ')}`,`Outer alpha bounds: ${JSON.stringify(opening.outerBounds)}`,`720-point opening profile: ${Array.from(formRadii).map(v=>v.toFixed(2)).join(',')}`,...(dIntrusionMode?[`720-point raw D intrusion profile: ${Array.from(rawFormRadii).map(v=>v.toFixed(2)).join(',')}`]:[]),`720-point current-position cover profile: ${Array.from(gapOpeningRadii).map(v=>v.toFixed(2)).join(',')}`,`720-point cover-gap profile px: ${Array.from(gaps).map(v=>v.toFixed(2)).join(',')}`,`720-point protected-opening profile: ${Array.from(protectedOpeningRadii).map(v=>v.toFixed(2)).join(',')}`,`720-point protected-reserve profile px: ${Array.from(protectedReserves).map(v=>v.toFixed(2)).join(',')}`,`720-point target overlap profile px: ${Array.from(targetOverlaps).map(v=>v.toFixed(2)).join(',')}`];
      this._setCompassCalibrationReports(base.join('\n'),details.join('\n'));
    },

};});

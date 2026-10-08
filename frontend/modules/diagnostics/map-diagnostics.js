import { defineModule } from "../core/runtime.js?v=41132r1";

export const MODULE_META=Object.freeze({
  id:"diagnostics.map",
  version:"1.0.0",
  group:"Diagnose",
  function:"Kartendiagnose",
  subfunctions:["Mobile Live-Diagnose","Pointer- und Touch-Protokoll","Leaflet-Zustand","Gesten-Recovery","Ereignisringpuffer","JSON kopieren","JSON herunterladen","Minimierbare Diagnose"],
  file:"modules/diagnostics/map-diagnostics.js"
});

export const installMapDiagnostics=defineModule(MODULE_META,(deps)=>{
  const { APPLICATION_META }=deps;
  const MAX_EVENTS=800;
  const safeNumber=(value)=>Number.isFinite(Number(value))?Number(value):null;
  const targetText=(target)=>{
    if(!target)return null;
    const id=target.id?("#"+target.id):"";
    let cls="";
    try{
      const raw=typeof target.className==="string"?target.className:target.className?.baseVal;
      if(raw)cls="."+String(raw).trim().split(/\s+/).slice(0,4).join(".");
    }catch(_error){}
    return String(target.tagName||"node").toLowerCase()+id+cls;
  };
  const clean=(value,depth=0)=>{
    if(value==null||typeof value==="string"||typeof value==="boolean")return value;
    if(typeof value==="number")return Number.isFinite(value)?value:String(value);
    if(depth>3)return "[depth]";
    if(Array.isArray(value))return value.slice(0,40).map(item=>clean(item,depth+1));
    if(value instanceof Set)return [...value].slice(0,40).map(item=>clean(item,depth+1));
    if(value instanceof Map)return [...value.entries()].slice(0,40).map(([key,item])=>[String(key),clean(item,depth+1)]);
    if(typeof value==="object"){
      const out={};
      for(const [key,item] of Object.entries(value).slice(0,60)){
        if(typeof item==="function"||key==="L"||key==="mapEl"||key==="handlers"||key==="quarantineTimer"||key==="systemGestureTimers")continue;
        try{out[key]=clean(item,depth+1);}catch(_error){out[key]="[unavailable]";}
      }
      return out;
    }
    return String(value);
  };
  return {
    _mapDiagnosticState(){
      if(this.__mapDiagnosticState)return this.__mapDiagnosticState;
      this.__mapDiagnosticState={
        startedAt:new Date().toISOString(),
        sequence:0,
        events:[],
        panelLevel:"full",
        open:false,
        liveTimer:null,
        attachedMap:null,
        mapHandlers:null,
        lastRenderAt:0,
        lastZoomLogAt:0,
        lastExportAt:null
      };
      return this.__mapDiagnosticState;
    },

    _mapDiagnosticRecoverySummary(){
      const state=this._mapGestureRecovery;
      const now=typeof performance!=="undefined"?performance.now():Date.now();
      if(!state)return null;
      return {
        pointers:[...(state.pointers||new Map()).entries()].map(([id,meta])=>({id:String(id),type:meta?.pointerType||null,surface:!!meta?.surface,lastSeen:safeNumber(meta?.lastSeen)})),
        touchIds:[...(state.touchIds||new Set())].map(String),
        globalPointers:[...(state.globalPointers||new Set())].map(String),
        surfacePointers:this._mapGestureSurfacePointerCount?.(state)??null,
        lastReportedTouches:state.lastReportedTouches??null,
        lastMultiPointerAt:safeNumber(state.lastMultiPointerAt),
        lastGlobalMultiAt:safeNumber(state.lastGlobalMultiAt),
        multitouchDirty:!!state.multitouchDirty,
        quarantineTouchSequence:!!state.quarantineTouchSequence,
        quarantineUntil:safeNumber(state.quarantineUntil),
        quarantineRemainingMs:state.quarantineTouchSequence?Math.max(0,Number(state.quarantineUntil||0)-now):0,
        blockUntilPrimaryUp:!!state.blockUntilPrimaryUp,
        recovering:!!state.recovering,
        hardResetting:!!state.hardResetting,
        synthesizing:!!state.synthesizing,
        lastSystemGestureAt:safeNumber(state.lastSystemGestureAt),
        systemGestureResetQueued:!!state.systemGestureResetQueued,
        lastRecovery:clean(state.lastRecovery),
        anomalyCount:Number(state.anomalyCount||0),
        lastAnomaly:clean(state.lastAnomaly),
        history:clean(this._mapGestureRecoveryHistory)
      };
    },

    _mapDiagnosticLeafletSummary(){
      const map=this._map,container=map?.getContainer?.()||this.shadow?.getElementById("map");
      if(!map)return {ready:false};
      const touchZoom=map.touchZoom,dragging=map.dragging,draggable=dragging?._draggable;
      let center=null;
      try{const c=map.getCenter?.();if(c)center={lat:safeNumber(c.lat),lng:safeNumber(c.lng)};}catch(_error){}
      let computed=null;
      try{
        const style=container?getComputedStyle(container):null;
        if(style)computed={touchAction:style.touchAction,pointerEvents:style.pointerEvents,userSelect:style.userSelect};
      }catch(_error){}
      return {
        ready:true,
        zoom:safeNumber(map.getZoom?.()),
        center,
        minZoom:safeNumber(map.getMinZoom?.()),
        maxZoom:safeNumber(map.getMaxZoom?.()),
        loaded:!!map._loaded,
        animatingZoom:!!map._animatingZoom,
        zoomAnimated:!!map._zoomAnimated,
        sizeChanged:!!map._sizeChanged,
        touchZoom:{
          enabled:!!touchZoom?.enabled?.(),
          zooming:!!touchZoom?._zooming,
          moved:!!touchZoom?._moved,
          animRequest:touchZoom?._animRequest??null,
          instance:touchZoom?.constructor?.name||null
        },
        dragging:{
          enabled:!!dragging?.enabled?.(),
          moving:!!draggable?._moving,
          moved:!!draggable?._moved,
          enabledInternal:!!draggable?._enabled,
          leafletGlobalDragging:!!this._mapGestureRecovery?.L?.Draggable?._dragging,
          instance:dragging?.constructor?.name||null
        },
        container:{
          className:container?.className||null,
          styleTouchAction:container?.style?.touchAction||null,
          computed
        },
        handlerCount:Array.isArray(map._handlers)?map._handlers.length:null,
        handlers:Array.isArray(map._handlers)?map._handlers.map(handler=>({name:handler?.constructor?.name||"unknown",enabled:!!handler?.enabled?.()})):null
      };
    },

    _mapDiagnosticEnvironment(){
      const vv=window.visualViewport;
      return {
        generatedAt:new Date().toISOString(),
        visibility:document.visibilityState,
        focused:document.hasFocus?.()??null,
        userAgent:navigator.userAgent,
        platform:navigator.platform||null,
        language:navigator.language||null,
        maxTouchPoints:navigator.maxTouchPoints??null,
        hardwareConcurrency:navigator.hardwareConcurrency??null,
        devicePixelRatio:window.devicePixelRatio||1,
        viewport:{width:window.innerWidth,height:window.innerHeight},
        visualViewport:vv?{width:vv.width,height:vv.height,offsetLeft:vv.offsetLeft,offsetTop:vv.offsetTop,scale:vv.scale}:null,
        orientation:screen.orientation?{type:screen.orientation.type,angle:screen.orientation.angle}:null
      };
    },

    _mapDiagnosticLog(type,data={}){
      const state=this._mapDiagnosticState();
      const event={
        seq:++state.sequence,
        at:new Date().toISOString(),
        t:typeof performance!=="undefined"?Math.round(performance.now()*10)/10:Date.now(),
        type:String(type||"event"),
        data:clean(data),
        map:{
          zoom:safeNumber(this._map?.getZoom?.()),
          touchZoomEnabled:!!this._map?.touchZoom?.enabled?.(),
          touchZooming:!!this._map?.touchZoom?._zooming,
          draggingEnabled:!!this._map?.dragging?.enabled?.(),
          draggingMoving:!!this._map?.dragging?._draggable?._moving,
          animatingZoom:!!this._map?._animatingZoom
        },
        recovery:(()=>{
          const rec=this._mapGestureRecovery;
          if(!rec)return null;
          const now=typeof performance!=="undefined"?performance.now():Date.now();
          return {
            pointers:rec.pointers?.size??0,
            surfacePointers:this._mapGestureSurfacePointerCount?.(rec)??null,
            touches:rec.touchIds?.size??0,
            globalPointers:rec.globalPointers?.size??0,
            reportedTouches:rec.lastReportedTouches??null,
            dirty:!!rec.multitouchDirty,
            quarantine:!!rec.quarantineTouchSequence,
            quarantineRemainingMs:rec.quarantineTouchSequence?Math.max(0,Number(rec.quarantineUntil||0)-now):0,
            blockUntilPrimaryUp:!!rec.blockUntilPrimaryUp
          };
        })()
      };
      state.events.push(event);
      if(state.events.length>MAX_EVENTS)state.events.splice(0,state.events.length-MAX_EVENTS);
      if(state.open&&typeof requestAnimationFrame==="function"){
        const stamp=performance.now();
        if(stamp-state.lastRenderAt>120){
          state.lastRenderAt=stamp;
          requestAnimationFrame(()=>this._mapDiagnosticRender?.());
        }
      }
      return event;
    },

    _mapDiagnosticEventData(event){
      return {
        eventType:event?.type||null,
        pointerId:event?.pointerId??null,
        pointerType:event?.pointerType||null,
        isPrimary:event?.isPrimary??null,
        button:event?.button??null,
        buttons:event?.buttons??null,
        touches:event?.touches?.length??null,
        changedTouches:event?.changedTouches?.length??null,
        cancelable:event?.cancelable??null,
        defaultPrevented:event?.defaultPrevented??null,
        target:targetText(event?.target),
        timeStamp:safeNumber(event?.timeStamp)
      };
    },

    _mapDiagnosticSnapshot(label="manual"){
      const state=this._mapDiagnosticState();
      return {
        schema:"gewitterradar.map-diagnostic.v1",
        label:String(label||"manual"),
        generatedAt:new Date().toISOString(),
        application:{
          version:APPLICATION_META.version,
          displayVersion:APPLICATION_META.displayVersion,
          build:APPLICATION_META.build,
          runtimeRevision:APPLICATION_META.runtimeRevision,
          moduleSetId:APPLICATION_META.moduleSetId
        },
        environment:this._mapDiagnosticEnvironment(),
        map:this._mapDiagnosticLeafletSummary(),
        recovery:this._mapDiagnosticRecoverySummary(),
        diagnostic:{
          startedAt:state.startedAt,
          events:state.events.length,
          sequence:state.sequence,
          panelLevel:state.panelLevel,
          lastExportAt:state.lastExportAt
        },
        events:state.events.map(item=>clean(item))
      };
    },

    _mapDiagnosticAttachMap(){
      const state=this._mapDiagnosticState(),map=this._map;
      if(!map||state.attachedMap===map)return;
      if(state.attachedMap&&state.mapHandlers){
        for(const [name,handler] of Object.entries(state.mapHandlers))try{state.attachedMap.off?.(name,handler);}catch(_error){}
      }
      const handlers={};
      const add=(name,fn)=>{handlers[name]=fn;map.on?.(name,fn);};
      add("dragstart",event=>this._mapDiagnosticLog("leaflet.dragstart",{original:this._mapDiagnosticEventData(event?.originalEvent)}));
      add("dragend",event=>this._mapDiagnosticLog("leaflet.dragend",{distance:safeNumber(event?.distance),original:this._mapDiagnosticEventData(event?.originalEvent)}));
      add("movestart",()=>this._mapDiagnosticLog("leaflet.movestart"));
      add("moveend",()=>this._mapDiagnosticLog("leaflet.moveend"));
      add("zoomstart",()=>this._mapDiagnosticLog("leaflet.zoomstart"));
      add("zoomend",()=>this._mapDiagnosticLog("leaflet.zoomend"));
      add("zoom",()=>{
        const stamp=typeof performance!=="undefined"?performance.now():Date.now();
        if(stamp-state.lastZoomLogAt<100)return;
        state.lastZoomLogAt=stamp;
        this._mapDiagnosticLog("leaflet.zoom");
      });
      add("resize",event=>this._mapDiagnosticLog("leaflet.resize",{newSize:clean(event?.newSize),oldSize:clean(event?.oldSize)}));
      state.attachedMap=map;
      state.mapHandlers=handlers;
      this._mapDiagnosticLog("diagnostic.map-attached");
    },

    _mapDiagnosticSetLevel(level){
      const state=this._mapDiagnosticState(),panel=this.shadow?.getElementById("map-diagnostic-panel");
      const next=["full","compact","minimized"].includes(level)?level:"full";
      state.panelLevel=next;
      if(panel){panel.dataset.level=next;panel.classList.toggle("mapdiag-minimized",next==="minimized");panel.classList.toggle("mapdiag-compact",next==="compact");}
      this._mapDiagnosticRender();
    },

    _mapDiagnosticRender(){
      const state=this._mapDiagnosticState(),panel=this.shadow?.getElementById("map-diagnostic-panel");
      if(!panel||panel.hidden)return;
      const map=this._mapDiagnosticLeafletSummary(),rec=this._mapDiagnosticRecoverySummary();
      const set=(id,value)=>{const node=this.shadow?.getElementById(id);if(node)node.textContent=value==null?"—":String(value);};
      set("mapdiag-zoom",map.zoom);
      set("mapdiag-events",state.events.length);
      set("mapdiag-dragging",map.dragging?.enabled?"AN":"AUS");
      set("mapdiag-touchzoom",map.touchZoom?.enabled?"AN":"AUS");
      set("mapdiag-zooming",map.touchZoom?.zooming?"JA":"NEIN");
      set("mapdiag-animating",map.animatingZoom?"JA":"NEIN");
      set("mapdiag-pointers",rec?rec.pointers.length:"—");
      set("mapdiag-touches",rec?rec.touchIds.length:"—");
      set("mapdiag-global",rec?rec.globalPointers.length:"—");
      set("mapdiag-dirty",rec?.multitouchDirty?"JA":"NEIN");
      set("mapdiag-quarantine",rec?.quarantineTouchSequence?("JA · "+Math.round(rec.quarantineRemainingMs)+" ms"):"NEIN");
      set("mapdiag-last-recovery",rec?.lastRecovery?.reason||"—");
      set("mapdiag-last-anomaly",rec?.lastAnomaly?.reason||"—");
      const mini=this.shadow?.getElementById("mapdiag-mini-state");
      if(mini)mini.textContent="Zoom "+(map.zoom??"—")+" · Events "+state.events.length+" · TouchZoom "+(map.touchZoom?.zooming?"ZOOMING":map.touchZoom?.enabled?"AN":"AUS");
      const log=this.shadow?.getElementById("mapdiag-log");
      if(log&&state.panelLevel==="full"){
        const recent=state.events.slice(-120);
        log.textContent=recent.map(item=>{
          const r=item.recovery||{};
          const data=item.data||{};
          const extra=[data.pointerId!=null?"id="+data.pointerId:"",data.touches!=null?"touches="+data.touches:"",data.isPrimary!=null?"primary="+data.isPrimary:"",data.reason?"reason="+data.reason:""].filter(Boolean).join(" ");
          return String(item.seq).padStart(4,"0")+"  "+item.at.slice(11,23)+"  "+item.type+(extra?"  "+extra:"")+"  [p:"+(r.pointers??"—")+" t:"+(r.touches??"—")+" g:"+(r.globalPointers??"—")+" q:"+(r.quarantine?"1":"0")+"]";
        }).join("\n");
        log.scrollTop=log.scrollHeight;
      }
    },

    _ensureMapDiagnostics(){
      if(!this.shadow)return null;
      this._mapDiagnosticAttachMap();
      let button=this.shadow.getElementById("settings-map-diagnostics-open");
      if(!button){
        const diagnostic=this.shadow.getElementById("settings-diagnostic-section");
        const toggle=this.shadow.getElementById("settings-diagnostics-toggle")?.closest?.(".settings-row");
        const row=document.createElement("div");
        row.className="settings-row mapdiag-settings-row";
        row.innerHTML='<div class="settings-row-label"><strong>Kartendiagnose</strong><span class="mapdiag-settings-sub">Touch · Leaflet · Gesten · Recovery</span></div><button class="mapdiag-settings-open" id="settings-map-diagnostics-open" type="button">ÖFFNEN</button>';
        if(toggle)toggle.after(row);else diagnostic?.querySelector(".settings-section-content")?.append(row);
        button=row.querySelector("#settings-map-diagnostics-open");
        button?.addEventListener("click",()=>this._openMapDiagnostics());
      }
      if(!this.shadow.getElementById("map-diagnostic-style")){
        const style=document.createElement("style");
        style.id="map-diagnostic-style";
        style.textContent='.mapdiag-settings-row .settings-row-label{display:grid;gap:2px}.mapdiag-settings-sub{font-size:8px;opacity:.62}.mapdiag-settings-open{min-width:84px;padding:8px 11px;border:1px solid rgba(93,209,255,.45);border-radius:8px;background:rgba(20,81,105,.22);color:#aeeeff;font:850 9px/1 system-ui;cursor:pointer}.mapdiag-panel{position:fixed;right:8px;bottom:8px;z-index:2147483646;width:min(560px,calc(100vw - 16px));max-height:min(72dvh,720px);display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(88,218,255,.58);border-radius:15px;background:rgba(5,13,20,.965);color:#e5f7ff;box-shadow:0 20px 70px rgba(0,0,0,.72);font:700 9px/1.35 system-ui}.mapdiag-panel[hidden]{display:none!important}.mapdiag-head{display:flex;align-items:center;gap:6px;padding:8px 9px;background:#0b202c;border-bottom:1px solid rgba(88,218,255,.23)}.mapdiag-title{font-weight:900;color:#79e7ff;letter-spacing:.08em;text-transform:uppercase}.mapdiag-mini-state{margin-left:auto;color:#b9d9e6;font:750 8px/1.2 ui-monospace,monospace}.mapdiag-head button,.mapdiag-actions button{border:1px solid rgba(88,218,255,.32);border-radius:7px;background:#102a37;color:#dcf7ff;padding:7px 8px;font:800 8px/1 system-ui;cursor:pointer}.mapdiag-body{min-height:0;overflow:auto;padding:8px;overscroll-behavior:contain}.mapdiag-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}.mapdiag-cell{min-width:0;padding:6px;border:1px solid rgba(255,255,255,.07);border-radius:8px;background:rgba(255,255,255,.025)}.mapdiag-cell span{display:block;color:#7fa5b6;font-size:7px;text-transform:uppercase}.mapdiag-cell strong{display:block;margin-top:2px;color:#e9faff;font:850 9px/1.2 ui-monospace,monospace;overflow-wrap:anywhere}.mapdiag-detail{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:4px 9px;margin:7px 0 0;padding:7px;border:1px solid rgba(255,255,255,.06);border-radius:8px}.mapdiag-detail dt{color:#7093a2}.mapdiag-detail dd{margin:0;color:#d7edf6;font:750 8px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mapdiag-log{height:220px;margin:7px 0 0;padding:7px;overflow:auto;border:1px solid rgba(255,255,255,.07);border-radius:8px;background:#02070b;color:#acd7e8;font:650 7.5px/1.45 ui-monospace,monospace;white-space:pre;overscroll-behavior:contain}.mapdiag-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px}.mapdiag-actions button[data-mapdiag-primary]{border-color:rgba(109,222,161,.55);color:#b9ffd6}.mapdiag-compact{width:min(380px,calc(100vw - 16px));max-height:46dvh}.mapdiag-compact .mapdiag-log,.mapdiag-compact .mapdiag-detail{display:none}.mapdiag-compact .mapdiag-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.mapdiag-minimized{width:min(320px,calc(100vw - 16px));max-height:none}.mapdiag-minimized .mapdiag-body{display:none}.mapdiag-minimized .mapdiag-head{padding:6px 7px}.mapdiag-minimized .mapdiag-title{font-size:8px}.mapdiag-minimized .mapdiag-mini-state{font-size:7px}.mapdiag-minimized .mapdiag-level-full,.mapdiag-minimized .mapdiag-level-compact{display:none}@media(max-width:620px){.mapdiag-panel{left:6px;right:6px;bottom:6px;width:auto;max-height:58dvh;border-radius:13px}.mapdiag-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.mapdiag-head{flex-wrap:wrap}.mapdiag-title{font-size:9px}.mapdiag-mini-state{order:2;flex:1 1 100%;margin-left:0}.mapdiag-head button{min-width:38px;min-height:34px}.mapdiag-log{height:170px}.mapdiag-actions button{min-height:36px;flex:1 1 calc(50% - 6px)}.mapdiag-minimized{left:auto;right:6px;width:min(300px,calc(100vw - 12px))}.mapdiag-minimized .mapdiag-head{flex-wrap:nowrap}.mapdiag-minimized .mapdiag-mini-state{order:0;flex:1 1 auto;margin-left:auto}}';
        this.shadow.append(style);
      }
      if(!this.shadow.getElementById("map-diagnostic-panel")){
        const panel=document.createElement("aside");
        panel.id="map-diagnostic-panel";
        panel.className="mapdiag-panel";
        panel.hidden=true;
        panel.dataset.level="full";
        panel.innerHTML='<header class="mapdiag-head"><span class="mapdiag-title">Kartendiagnose</span><span class="mapdiag-mini-state" id="mapdiag-mini-state">bereit</span><button class="mapdiag-level-full" type="button" data-mapdiag-level="full">VOLL</button><button class="mapdiag-level-compact" type="button" data-mapdiag-level="compact">KOMPAKT</button><button type="button" data-mapdiag-level="minimized" aria-label="Kartendiagnose minimieren">−</button><button type="button" data-mapdiag-close aria-label="Kartendiagnose schließen">×</button></header><div class="mapdiag-body"><div class="mapdiag-grid"><div class="mapdiag-cell"><span>Zoom</span><strong id="mapdiag-zoom">—</strong></div><div class="mapdiag-cell"><span>Events</span><strong id="mapdiag-events">0</strong></div><div class="mapdiag-cell"><span>Dragging</span><strong id="mapdiag-dragging">—</strong></div><div class="mapdiag-cell"><span>TouchZoom</span><strong id="mapdiag-touchzoom">—</strong></div><div class="mapdiag-cell"><span>_zooming</span><strong id="mapdiag-zooming">—</strong></div><div class="mapdiag-cell"><span>_animatingZoom</span><strong id="mapdiag-animating">—</strong></div><div class="mapdiag-cell"><span>Pointer / Touch / Global</span><strong><span id="mapdiag-pointers">—</span> / <span id="mapdiag-touches">—</span> / <span id="mapdiag-global">—</span></strong></div><div class="mapdiag-cell"><span>Multitouch dirty</span><strong id="mapdiag-dirty">—</strong></div><div class="mapdiag-cell"><span>Quarantäne</span><strong id="mapdiag-quarantine">—</strong></div></div><dl class="mapdiag-detail"><dt>Letzter Recovery</dt><dd id="mapdiag-last-recovery">—</dd><dt>Letzte Anomalie</dt><dd id="mapdiag-last-anomaly">—</dd></dl><pre class="mapdiag-log" id="mapdiag-log"></pre><div class="mapdiag-actions"><button type="button" data-mapdiag-mark>MARKIEREN</button><button type="button" data-mapdiag-copy data-mapdiag-primary>JSON KOPIEREN</button><button type="button" data-mapdiag-download data-mapdiag-primary>JSON HERUNTERLADEN</button><button type="button" data-mapdiag-clear>LOG LEEREN</button></div></div>';
        this.shadow.append(panel);
        panel.querySelectorAll("[data-mapdiag-level]").forEach(node=>node.addEventListener("click",()=>this._mapDiagnosticSetLevel(node.dataset.mapdiagLevel)));
        panel.querySelector("[data-mapdiag-close]")?.addEventListener("click",()=>this._closeMapDiagnostics());
        panel.querySelector("[data-mapdiag-mark]")?.addEventListener("click",()=>this._mapDiagnosticLog("manual.marker",{label:"Benutzermarkierung"}));
        panel.querySelector("[data-mapdiag-copy]")?.addEventListener("click",()=>this._copyMapDiagnostics());
        panel.querySelector("[data-mapdiag-download]")?.addEventListener("click",()=>this._downloadMapDiagnostics());
        panel.querySelector("[data-mapdiag-clear]")?.addEventListener("click",()=>{
          const state=this._mapDiagnosticState();state.events=[];state.sequence=0;state.startedAt=new Date().toISOString();this._mapDiagnosticLog("diagnostic.log-cleared");this._mapDiagnosticRender();
        });
      }
      return button;
    },

    _openMapDiagnostics(){
      this._ensureMapDiagnostics();
      const state=this._mapDiagnosticState(),panel=this.shadow?.getElementById("map-diagnostic-panel");
      if(!panel)return;
      this.shadow?.getElementById("settings-backdrop")?.classList.remove("open");
      panel.hidden=false;state.open=true;
      this._mapDiagnosticSetLevel(state.panelLevel||"full");
      if(state.liveTimer==null)state.liveTimer=setInterval(()=>this._mapDiagnosticRender(),350);
      this._mapDiagnosticLog("diagnostic.open");
      this._mapDiagnosticRender();
    },

    _closeMapDiagnostics(){
      const state=this._mapDiagnosticState(),panel=this.shadow?.getElementById("map-diagnostic-panel");
      if(panel)panel.hidden=true;
      state.open=false;
      if(state.liveTimer!=null)clearInterval(state.liveTimer);
      state.liveTimer=null;
      this._mapDiagnosticLog("diagnostic.close");
    },

    async _copyMapDiagnostics(){
      const state=this._mapDiagnosticState(),payload=this._mapDiagnosticSnapshot("copy"),text=JSON.stringify(payload,null,2);
      state.lastExportAt=new Date().toISOString();
      let copied=false;
      try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);copied=true;}}catch(_error){}
      if(!copied){
        const area=document.createElement("textarea");area.value=text;area.style.position="fixed";area.style.opacity="0";document.body.append(area);area.select();copied=!!document.execCommand?.("copy");area.remove();
      }
      this._mapDiagnosticLog("diagnostic.export-copy",{copied});
      return copied;
    },

    _downloadMapDiagnostics(){
      const state=this._mapDiagnosticState(),payload=this._mapDiagnosticSnapshot("download"),text=JSON.stringify(payload,null,2);
      state.lastExportAt=new Date().toISOString();
      const blob=new Blob([text],{type:"application/json;charset=utf-8"}),url=URL.createObjectURL(blob),link=document.createElement("a");
      const stamp=new Date().toISOString().replace(/[:.]/g,"-");
      link.href=url;link.download="gewitterradar-map-diagnostic-"+APPLICATION_META.version+"_"+stamp+".json";
      document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      this._mapDiagnosticLog("diagnostic.export-download");
    }
  };
});

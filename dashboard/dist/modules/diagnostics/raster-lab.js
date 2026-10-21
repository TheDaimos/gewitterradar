import { defineModule } from "../core/runtime.js?v=41127r1";
import { APPLICATION_RELEASE } from "../../version.js?v=411103r1";

export const MODULE_META=Object.freeze({
  id:"diagnostics.raster-lab",version:"0.1.3",group:"Diagnose",
  function:"Raster-Labor",subfunctions:["Nummerierte Layerauswahl","Live-Vorschau","Zoomprofile","Vergleich mit Referenz","Zwischenablage","JSON-Export","Sicherer Rückfall"],
  file:"modules/diagnostics/raster-lab.js"
});

// Stable UI identifiers, not an assertion that WeatherRouter offers these layers.
export const RASTER_LAB_LAYER_CATALOG=Object.freeze([
  ["precipitation","Niederschlag"],["temperature","Temperatur"],
  ["pressure","Luftdruck"],["fog","Nebel"],["hail","Hagel"],
  ["snow","Schnee"],["wind","Wind"],["clouds","Wolken"],
  ["humidity","Luftfeuchtigkeit"],["visibility","Sichtweite"],
  ["thunderstorm","Gewitter"],["lightning","Blitze"],
  ["uv","UV-Strahlung"],["air-quality","Luftqualität"],
  ["waves","Wellen"],["sea-temperature","Meerestemperatur"]
]);
const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number(v)||0));
const FIELDS=Object.freeze({
  blur:[0,220,1,"Glättung","px"],
  blend:[0,100,1,"Flächenverschmelzung","%"],
  contrast:[.5,1.6,.01,"Kontrast",""],
  saturate:[0,2,.01,"Farbsättigung",""],
  brightness:[.5,1.5,.01,"Helligkeit",""],
  opacity:[0,1,.01,"Deckkraft",""]
});
const fit=(value)=>Number(value).toFixed(2);
const family=()=>{
  const agent=String(navigator?.userAgent||"");
  const platform=String(navigator?.platform||"");
  if(/iPad|iPhone|iPod/i.test(agent)||platform==="MacIntel"&&Number(navigator?.maxTouchPoints)>1)return "iPadOS/iOS WebKit";
  if(/Android/i.test(agent))return "Android";
  if(/Firefox/i.test(agent))return "Firefox";
  if(/Edg\//.test(agent))return "Edge/Chromium";
  if(/Chrome|Chromium/i.test(agent))return "Chromium";
  if(/Safari/i.test(agent))return "Safari/WebKit";
  return "unbekannt";
};
const html=(tag,cls,inner)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(inner!==undefined)el.innerHTML=inner;return el;};

export const installRasterLab=defineModule(MODULE_META,()=>({
  _rasterLabAdapters(){
    if(!this.__rasterLabAdapters)this.__rasterLabAdapters=new Map();
    if(!this.__rasterLabAdapters.has("precipitation")){
      this.__rasterLabAdapters.set("precipitation",{
        id:"precipitation",label:"Niederschlag",
        getPane:()=>this._map?.getPane?.("gr-weather-radar")||null,
        getNativeZoom:()=>Number(this._weatherRadarState?.()?.layer?.options?.maxNativeZoom),
        getTuning:()=>this._weatherDisplayRasterTuning?.("precipitation"),
        restore:()=>this._weatherDisplayRefreshRenderedLayers?.()
      });
    }
    return this.__rasterLabAdapters;
  },
  // Future weather layers register an actual renderer adapter, not a fake
  // capability or provider endpoint. Registration does not activate the lab.
  _rasterLabRegisterAdapter(adapter){
    if(!adapter||typeof adapter.id!=="string"
      ||!/^[a-z0-9][a-z0-9._-]{0,95}$/.test(adapter.id)
      ||typeof adapter.getPane!=="function"
      ||typeof adapter.getTuning!=="function"
      ||typeof adapter.restore!=="function")return false;
    this._rasterLabAdapters().set(adapter.id,adapter);
    this._rasterLabRefreshOptions?.();
    return true;
  },
  _rasterLabState(){
    return this.__rasterLabState||(this.__rasterLabState={
      open:false,active:false,selected:"precipitation",samples:new Map(),opacityOriginal:new WeakMap(),
      controller:null,root:null,preview:true,feedback:"",position:null,
      map:null,zoomHandler:null,hostObserver:null
    });
  },
  _rasterLabEnsureTrigger(){
    // The launch control belongs to the fixed, always-visible calibration
    // toolbar inside the scrollable diagnostic body. Never append a button
    // after the body: the outer console clips those descendants.
    if(!this._diagnostics?.enabled)return;
    const btn=this.shadow?.getElementById("diagnostic-raster-lab");
    if(!btn||btn.dataset.rasterLabBound==="true")return;
    btn.addEventListener("click",()=>this._rasterLabOpen());
    btn.dataset.rasterLabBound="true";
  },
  _rasterLabAdapter(){
    return this._rasterLabAdapters().get(this._rasterLabState().selected)||null;
  },
  _rasterLabZoom(){const z=Number(this._map?.getZoom?.());return Number.isFinite(z)?Math.round(z*10)/10:10;},
  _rasterLabSnapshot(){
    const adapter=this._rasterLabAdapter(),pane=adapter?.getPane?.(),native=Number(adapter?.getNativeZoom?.()),tuning=adapter?.getTuning?.()||{};
    const base={blur:clamp(tuning.blur||0,0,220),contrast:clamp(tuning.contrast??1,.5,1.6),
      saturate:clamp(tuning.saturate??1,0,2),brightness:clamp(tuning.brightness??1,.5,1.5),
      opacity:1,blend:100};
    return {adapter,pane,nativeZoom:Number.isFinite(native)?native:null,zoom:this._rasterLabZoom(),base};
  },
  _rasterLabKey(info){return this._rasterLabState().selected+":"+info.zoom;},
  _rasterLabValues(info){
    const current=this._rasterLabState().samples.get(this._rasterLabKey(info));
    return current?.values||{...info.base};
  },
  _rasterLabRefreshOptions(){
    const s=this.__rasterLabState,select=s?.root?.querySelector("[data-lab-layer]");
    if(!select)return;
    select.replaceChildren();
    const catalog=[...RASTER_LAB_LAYER_CATALOG];
    for(const [id,adapter] of this._rasterLabAdapters()){
      if(!catalog.some(row=>row[0]===id))catalog.push([id,String(adapter.label||id)]);
    }
    catalog.forEach(([id,name],index)=>{
      const adapter=this._rasterLabAdapters().get(id);
      const availability=adapter?.getAvailability?.()||(adapter?"active":"unconnected");
      const usable=availability==="active"&&!!adapter?.getPane?.();
      const suffix=usable?"":availability==="off"?" · ausgeschaltet":availability==="no-data"?" · ohne Daten":availability==="loading"?" · lädt":" · noch nicht angebunden";
      const opt=document.createElement("option");
      opt.value=id;opt.disabled=!usable;
      opt.textContent=String(index+1).padStart(2,"0")+". "+name+suffix;
      select.append(opt);
    });
    if(!this._rasterLabAdapters().has(s.selected))s.selected="precipitation";
    select.value=s.selected;
  },
  _rasterLabRenderValues(){
    const s=this._rasterLabState(),root=s.root;if(!root)return;
    const info=this._rasterLabSnapshot(),inspectZoom=s.inspectZoom??info.zoom;
    const profile=s.samples.get(s.selected+":"+inspectZoom);
    const values=profile?.values||{...info.base};
    for(const [key,parts] of Object.entries(FIELDS)){
      const range=root.querySelector('[data-lab-field="'+key+'"]');
      const output=root.querySelector('[data-lab-out="'+key+'"]');
      if(range){range.value=String(values[key]);range.disabled=inspectZoom!==info.zoom;}
      if(output)output.textContent=fit(values[key])+" "+parts[4];
    }
    const profileSelect=root.querySelector("[data-lab-profile]");
    if(profileSelect){
      const selected=String(inspectZoom);profileSelect.replaceChildren();
      const zooms=new Set([info.zoom]);
      for(const item of s.samples.values())if(item.layer===s.selected)zooms.add(item.zoom);
      for(const zoom of [...zooms].sort((a,b)=>a-b)){
        const opt=document.createElement("option");opt.value=String(zoom);
        opt.textContent="Zoom "+zoom+(s.samples.has(s.selected+":"+zoom)?" · Gespeichert":" · Noch kein Profil")+(zoom===info.zoom?" · Karte":"");
        profileSelect.append(opt);
      }
      profileSelect.value=selected;
    }
    const line=root.querySelector("[data-lab-status]");
    const availability=info.adapter?.getAvailability?.()||(info.pane?"active":"unconnected");
    if(line)line.textContent="Kartenzoom "+info.zoom+" · native Quellzoomstufe "+
      (info.nativeZoom??"unbekannt")+" · "+family()+" · "+
      (info.pane?"Renderer bereit":availability==="off"?"Ebene ausgeschaltet":availability==="no-data"?"Keine Rasterdaten":availability==="loading"?"Raster lädt":"Renderer nicht angebunden")+
      " · "+(s.preview?"Versuch":"Referenz")+(inspectZoom!==info.zoom?" · Profilvergleich (nur Anzeige)":"");
    const status=root.querySelector("[data-lab-feedback]");
    if(status&&status.value!==s.feedback)status.value=s.feedback;
    root.querySelector("[data-lab-ab]")?.setAttribute("aria-pressed",String(s.preview));
    const ab=root.querySelector("[data-lab-ab]");
    if(ab)ab.textContent=s.preview?"Referenz zeigen":"Versuch zeigen";
  },
  _rasterLabRestore(){
    const s=this.__rasterLabState;
    if(!s)return;
    const adapter=this._rasterLabAdapters().get(s.selected);
    const wasPreview=s.preview;
    s.preview=false;
    try{adapter?.restore?.();}catch(_){}finally{s.preview=wasPreview;}
    const pane=adapter?.getPane?.();
    if(pane){
      const prior=s.opacityOriginal?.get(pane);
      if(prior===undefined)pane.style.removeProperty("opacity");
      else pane.style.opacity=prior;
      delete pane.dataset.rasterLabPreview;
    }
  },
  _rasterLabReapplyPreview(){
    const s=this.__rasterLabState;
    if(!s?.open||!s.preview)return;
    const info=this._rasterLabSnapshot(),pane=info.pane;
    if(!pane)return;
    const v=this._rasterLabValues(info);
    if(!s.opacityOriginal.has(pane))s.opacityOriginal.set(pane,pane.style.opacity);
    info.adapter?.beforePreview?.(pane);
    this._weatherDisplayReleaseSoftFilter?.(pane);
    const effectiveBlur=info.base.blur+(v.blur-info.base.blur)*clamp(v.blend??100,0,100)/100;
    pane.style.filter="blur("+fit(effectiveBlur)+"px) saturate("+fit(v.saturate)+
      ") contrast("+fit(v.contrast)+") brightness("+fit(v.brightness)+")";
    pane.style.opacity=String(v.opacity);
    pane.dataset.rasterLabPreview="true";
  },
  _rasterLabApply(){
    const s=this._rasterLabState(),info=this._rasterLabSnapshot();
    if(!info.pane)return;
    this._rasterLabRestore();
    if(s.preview)this._rasterLabReapplyPreview();
  },
  _rasterLabClose(){
    const s=this.__rasterLabState;
    if(!s)return;
    s.open=false;s.preview=false;
    if(s.map&&s.zoomHandler)try{s.map.off("zoomend",s.zoomHandler);}catch(_){}
    s.map=null;s.zoomHandler=null;
    s.hostObserver?.disconnect();s.hostObserver=null;
    s.controller?.abort();s.controller=null;
    try{this._rasterLabRestore();}finally{
      const pane=this._rasterLabAdapter()?.getPane?.();
      if(pane)delete pane.dataset.rasterLabPreview;
      s.root?.remove();s.root=null;
    }
  },
  _rasterLabExport(){
    const s=this._rasterLabState(),info=this._rasterLabSnapshot();
    const samples=[...s.samples.values()].map(item=>({
      layer:item.layer,zoom:item.zoom,nativeZoom:item.nativeZoom,
      values:{...item.values},note:item.note||""
    })).sort((a,b)=>a.layer.localeCompare(b.layer)||a.zoom-b.zoom);
    return {
      schema:"gewitterradar.raster-lab.v1",
      application:"gewitterradar",version:APPLICATION_RELEASE.version,runtimeRevision:APPLICATION_RELEASE.runtimeRevision,
      capturedAt:new Date().toISOString(),
      device:{browser:family(),pixelRatio:window.devicePixelRatio||1,
        viewport:{width:window.innerWidth,height:window.innerHeight},
        touchPoints:Number(navigator.maxTouchPoints)||0},
      selection:{layer:s.selected,zoom:info.zoom,nativeZoom:info.nativeZoom,
        activeRenderer:info.pane?"css-filter-preview":"unavailable"},
      reference:info.base,samples,feedback:s.feedback,
      exclusions:["no coordinates","no tile URLs","no secrets","no provider calls"]
    };
  },
  async _rasterLabCopy(){
    const text=JSON.stringify(this._rasterLabExport(),null,2);
    try{await navigator.clipboard.writeText(text);}
    catch(_){
      const area=document.createElement("textarea");area.value=text;
      area.style.cssText="position:fixed;left:-9999px;top:0";
      document.body.append(area);area.select();
      try{document.execCommand("copy");}finally{area.remove();}
    }
  },
  _rasterLabDownload(){
    const text=JSON.stringify(this._rasterLabExport(),null,2),
      url=URL.createObjectURL(new Blob([text],{type:"application/json;charset=utf-8"})),
      a=document.createElement("a");
    a.href=url;a.download="gewitterradar_raster-lab_"+APPLICATION_RELEASE.version+".json";
    document.body.append(a);a.click();a.remove();
    // One-shot cleanup, never recurring background work.
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  },
  _rasterLabHost(){
    const dialog=this.shadow?.getElementById("map-fullscreen-dialog");
    return dialog?.open?dialog:this.shadow;
  },
  _rasterLabRelocate(){
    const s=this.__rasterLabState;
    if(!s?.open||!s.root)return;
    const host=this._rasterLabHost();
    if(host&&s.root.parentNode!==host)host.append(s.root);
  },
  _rasterLabOpen(){
    if(!this._diagnostics?.enabled)return false;
    const s=this._rasterLabState();
    // Bind known generic raster adapters even while switched off, so the
    // dropdown distinguishes switched off from renderer not connected.
    this._weatherGenericLabAdapter?.("weather.satellite.clouds");
    this._weatherGenericLabAdapter?.("weather.model.wind_10m.layer");
    if(s.open){s.root?.focus?.();return true;}
    s.open=true;s.preview=true;s.inspectZoom=null;s.samples.clear();s.feedback="";
    const root=html("section","raster-lab","");
    root.tabIndex=-1;root.setAttribute("aria-label","Raster-Labor – Diagnose");
    root.style.cssText="position:fixed;z-index:2147483646;top:64px;right:12px;max-width:calc(100vw - 16px);width:330px;max-height:calc(100dvh - 72px);box-sizing:border-box;overflow:auto;color:#ecedf1;background:linear-gradient(150deg,#21242b,#12161c);border:1px solid #cfab62;border-radius:14px;box-shadow:0 12px 40px #000b;font:12px system-ui;padding:12px;overscroll-behavior:contain";
    const head=html("div","","<strong style='color:#f2d28b'>Raster-Labor</strong> <small style='opacity:.7'>"+APPLICATION_RELEASE.displayVersion+"</small>");
    head.style.cssText="display:flex;justify-content:space-between;gap:8px;align-items:center;cursor:grab;touch-action:none;min-height:34px";
    const close=html("button","","×");close.type="button";close.title="Schließen und Original wiederherstellen";
    close.style.cssText="min-width:40px;min-height:38px;color:#efd9a3;background:#222;border:1px solid #866d43;border-radius:9px";
    head.append(close);root.append(head);
    const label=html("label","","Layer auswählen");label.style.display="block";root.append(label);
    const select=html("select","","");select.dataset.labLayer="true";
    select.style.cssText="width:100%;min-height:42px;background:#12171e;color:#f1d69a;border:1px solid #8a7246;border-radius:8px;padding:7px";root.append(select);
    const status=html("p","","");status.dataset.labStatus="true";status.style.cssText="line-height:1.5;font-size:11px;color:#bac6d3";root.append(status);
    const profileLabel=html("label","","Zoomprofil anzeigen · Bearbeitung nur beim aktuellen Kartenzoom");profileLabel.style.display="block";root.append(profileLabel);
    const profileSelect=html("select","","");profileSelect.dataset.labProfile="true";profileSelect.style.cssText=select.style.cssText;root.append(profileSelect);
    const grid=html("div","","");grid.style.cssText="display:grid;gap:9px";
    for(const [key,[min,max,step,title,unit]] of Object.entries(FIELDS)){
      const row=html("label","","");row.style.display="grid";row.style.gap="3px";
      const caption=html("span","","");caption.textContent=title+" ("+unit+")";
      const output=html("output","","");output.dataset.labOut=key;output.style.color="#e3ba64";caption.append(output);
      const input=html("input","","");input.type="range";input.min=min;input.max=max;input.step=step;
      input.dataset.labField=key;input.style.cssText="width:100%;accent-color:#d5aa56;min-height:28px";
      row.append(caption,input);grid.append(row);
    }
    root.append(grid);
    const actions=html("div","","");actions.style.cssText="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:10px 0";
    for(const [id,title] of [["ab","Referenz zeigen"],["reset","Zoom zurücksetzen"],
      ["copy","JSON kopieren"],["export","JSON exportieren"]]){
      const b=html("button","",title);b.type="button";b.dataset["lab"+id.charAt(0).toUpperCase()+id.slice(1)]="true";
      b.style.cssText="min-height:40px;border-radius:8px;background:#30323b;color:#f2d590;border:1px solid #8d794b;font:600 11px system-ui;touch-action:manipulation";
      actions.append(b);
    }
    root.append(actions);
    const note=html("label","","Bewertung / Auffälligkeiten");
    const field=html("textarea","","");field.dataset.labFeedback="true";field.rows=2;field.maxLength=400;
    field.placeholder="z. B. Zoom 12: L-Ecke verschwindet; iPad flüssig";
    field.style.cssText="width:100%;box-sizing:border-box;border-radius:7px;background:#131820;color:white;border:1px solid #626979;font:12px system-ui;padding:8px";
    root.append(note,field);
    const hint=html("p","","Nur temporäre CSS-Vorschau. Kein Speichern in Produkteinstellungen, keine zusätzlichen Wetterabfragen. Beim Schließen wird die Originaldarstellung wiederhergestellt.");
    hint.style.cssText="font-size:10px;line-height:1.4;opacity:.72";root.append(hint);
    // Never nest the floating lab inside the overflow-clipped diagnostics
    // console. In modal fullscreen, use the dialog's native top layer;
    // otherwise use the card ShadowRoot.
    this._rasterLabHost().append(root);s.root=root;
    const fullDialog=this.shadow?.getElementById("map-fullscreen-dialog");
    if(fullDialog&&typeof MutationObserver!=="undefined"){
      s.hostObserver=new MutationObserver(()=>this._rasterLabRelocate());
      s.hostObserver.observe(fullDialog,{attributes:true,attributeFilter:["open"]});
    }
    const ctl=new AbortController();s.controller=ctl;const signal=ctl.signal;
    close.addEventListener("click",()=>this._rasterLabClose(),{signal});
    profileSelect.addEventListener("change",()=>{s.inspectZoom=Number(profileSelect.value);this._rasterLabRenderValues();},{signal});
    select.addEventListener("change",()=>{
      this._rasterLabRestore();s.selected=select.value;s.inspectZoom=null;s.feedback="";
      this._rasterLabRenderValues();this._rasterLabApply();
    },{signal});
    root.addEventListener("input",event=>{
      const key=event.target?.dataset?.labField;
      if(key&&FIELDS[key]){
        if(s.inspectZoom!==null&&s.inspectZoom!==this._rasterLabZoom())return;
        const info=this._rasterLabSnapshot(),old=this._rasterLabValues(info);
        const values={...old,[key]:clamp(event.target.value,FIELDS[key][0],FIELDS[key][1])};
        s.samples.set(this._rasterLabKey(info),{layer:s.selected,zoom:info.zoom,
          nativeZoom:info.nativeZoom,values,note:s.feedback});
        s.preview=true;this._rasterLabApply();this._rasterLabRenderValues();
      }else if(event.target?.dataset?.labFeedback!==undefined){
        s.feedback=String(event.target.value).slice(0,400);
        const record=s.samples.get(this._rasterLabKey(this._rasterLabSnapshot()));
        if(record)record.note=s.feedback;
      }
    },{signal});
    root.querySelector("[data-lab-ab]").addEventListener("click",()=>{
      s.preview=!s.preview;this._rasterLabApply();this._rasterLabRenderValues();
    },{signal});
    root.querySelector("[data-lab-reset]").addEventListener("click",()=>{
      s.samples.delete(this._rasterLabKey(this._rasterLabSnapshot()));
      s.preview=false;this._rasterLabApply();s.preview=true;
      this._rasterLabApply();this._rasterLabRenderValues();
    },{signal});
    root.querySelector("[data-lab-copy]").addEventListener("click",()=>this._rasterLabCopy(),{signal});
    root.querySelector("[data-lab-export]").addEventListener("click",()=>this._rasterLabDownload(),{signal});
    let drag=null;
    head.addEventListener("pointerdown",event=>{
      if(event.target.closest("button"))return;
      const box=root.getBoundingClientRect();drag={id:event.pointerId,x:event.clientX-box.left,y:event.clientY-box.top};
      head.setPointerCapture?.(event.pointerId);
    },{signal});
    head.addEventListener("pointermove",event=>{
      if(!drag||drag.id!==event.pointerId)return;
      const left=clamp(event.clientX-drag.x,0,Math.max(0,innerWidth-72)),
        top=clamp(event.clientY-drag.y,0,Math.max(0,innerHeight-40));
      root.style.left=left+"px";root.style.top=top+"px";root.style.right="auto";
    },{signal});
    const end=()=>{drag=null;};head.addEventListener("pointerup",end,{signal});
    head.addEventListener("pointercancel",end,{signal});
    const map=this._map;
    if(map?.on){
      s.map=map;s.zoomHandler=()=>{s.inspectZoom=null;this._rasterLabApply();this._rasterLabRenderValues();};
      map.on("zoomend",s.zoomHandler);
    }
    this._rasterLabRefreshOptions();this._rasterLabRenderValues();root.focus();
    return true;
  }
}));

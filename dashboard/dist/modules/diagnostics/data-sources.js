import {defineModule} from "../core/runtime.js?v=41129r1";
export const MODULE_META=Object.freeze({
  id:"diagnostics.data-sources",version:"0.1.5",group:"Datenquellen & Verbindungen",
  function:"Datenquellen – Übersicht und Diagnose",
  subfunctions:["Blitzortung-Untermodul","WeatherRouter-Status","Standorte je Konfiguration","Nur-Lesen-Einstellungen","Aktualisieren","JSON herunterladen"],
  file:"modules/diagnostics/data-sources.js"
});
export const installDataSourceDiagnostics=defineModule(MODULE_META,()=>({
  _dataSourcesDiagnosticPayload(){
    const store=this.__weatherEngineTraceStore||{};
    return {
      schema:"gewitterradar.data-sources.export.v1",
      capturedAt:new Date().toISOString(),
      blitzortung:this._blitzortungSourceSnapshot?.()||{status:"not_checked"},
      weatherRouter:{
        checkedAt:store.lastDiscovery?.checked_at||null,
        status:store.lastDiscovery?.status||"not_checked",
        method:"existing_consumer_v1_discovery_cache",
        note:"Keine zusätzlichen WeatherRouter-Abfragen durch diesen Diagnosebereich."
      }
    };
  },
  _ensureDataSourcesSection(){
    if(!this.shadow)return null;
    const found=this.shadow.getElementById("settings-data-sources-section");
    if(found)return found;
    const section=document.createElement("details");
    section.id="settings-data-sources-section";
    // Asynchrone HA-Daten machen die natuerliche Hoehe variabel.
    section.dataset.grDynamicHeight="true";
    section.className="settings-section settings-collapsible";
    const t=key=>this._t("diag."+key);
    section.innerHTML=`
      <summary class="settings-section-head"><div><div class="settings-section-title" data-presentation-text="diag.sources">${t("sources")}</div>
      <div class="settings-section-sub" data-presentation-text="diag.sourcesSubtitle">${t("sourcesSubtitle")}</div></div></summary>
      <div class="settings-section-content gr-sources-body">
        <style>
          #settings-data-sources-section .gr-sources-body{display:grid;gap:9px;padding:11px 12px;font-size:10px;line-height:1.5}
          #settings-data-sources-section .gr-sources-tools{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px}
          #settings-data-sources-section button.gr-sources-action{border:1px solid rgba(214,180,95,.48);border-radius:8px;padding:9px 12px;background:rgba(195,150,62,.10);color:#edd08e;font:800 10px system-ui;cursor:pointer;min-height:36px}
          #settings-data-sources-section .gr-source-card{padding:11px;border:1px solid rgba(255,255,255,.10);border-radius:12px;background:rgba(255,255,255,.025);display:grid;gap:7px}
          #settings-data-sources-section .gr-source-title{font-size:12px;font-weight:850;color:#f1db9e}
          #settings-data-sources-section .gr-source-note{font-size:9px;color:#9eafc0;overflow-wrap:anywhere}
          #settings-data-sources-section .gr-source-pairs{display:grid;grid-template-columns:minmax(110px,40%) minmax(0,1fr);gap:4px 9px;margin:0}
          #settings-data-sources-section dt{color:#96a5b7;font-size:9px}
          #settings-data-sources-section dd{margin:0;overflow-wrap:anywhere;font-size:9px;color:#e8edf5}
          #settings-data-sources-section .gr-source-entry{margin-top:5px;border:1px solid rgba(255,255,255,.09);border-radius:9px;overflow:hidden}
          #settings-data-sources-section .gr-source-entry>summary{padding:9px;color:#dae6f0;cursor:pointer;font-weight:800;overflow-wrap:anywhere}
          #settings-data-sources-section .gr-source-entry .gr-source-pairs{padding:10px;border-top:1px solid rgba(255,255,255,.07)}
          #settings-data-sources-section .gr-source-list{margin:0;padding-left:18px;overflow-wrap:anywhere}
          #settings-data-sources-section .gr-source-positive{color:#80d5a3}
          #settings-data-sources-section .gr-source-warning{color:#e9bf66}
          #settings-data-sources-section .gr-source-error{color:#f28b89}
          #settings-data-sources-section button:focus-visible,#settings-data-sources-section summary:focus-visible{outline:2px solid #f2d38b;outline-offset:2px}
          @media(max-width:540px){#settings-data-sources-section .gr-source-pairs{grid-template-columns:1fr;gap:2px}#settings-data-sources-section dt{margin-top:4px}}
        </style>
        <div class="gr-sources-tools">
          <button class="gr-sources-action" id="data-sources-refresh" type="button" data-presentation-text="diag.refresh">${t("refresh")}</button>
          <button class="gr-sources-action" id="data-sources-copy" type="button" data-presentation-text="diag.copyJson">${t("copyJson")}</button>
          <button class="gr-sources-action" id="data-sources-download" type="button" data-presentation-text="diag.downloadJson">${t("downloadJson")}</button>
        </div>
        <div class="gr-source-note" id="data-sources-checked" role="status">${t("notChecked")}</div>
        <div id="data-sources-content"></div>
      </div>`;
    const modules=this.shadow.getElementById("settings-modules-section");
    const diagnostic=this.shadow.getElementById("settings-diagnostic-section");
    if(modules)modules.after(section);else if(diagnostic)diagnostic.after(section);
    else this.shadow.querySelector(".settings-body")?.append(section);
    this._registerSettingsAccordionSection?.(section);
    section.querySelector("#data-sources-refresh")?.addEventListener("click",()=>this._refreshDataSourcesView());
    section.querySelector("#data-sources-copy")?.addEventListener("click",()=>this._copyDataSourcesDiagnostics());
    section.querySelector("#data-sources-download")?.addEventListener("click",()=>this._downloadDataSourcesDiagnostics());
    section.addEventListener("toggle",()=>{if(section.open)this._refreshDataSourcesView();});
    return section;
  },
  _renderDataSourcesView(){
    const section=this.shadow?.getElementById("settings-data-sources-section");
    const root=section?.querySelector("#data-sources-content");
    if(!root)return;
    const expanded=new Set(Array.from(root.querySelectorAll("details[open]"),entry=>entry.dataset.entryIndex));
    const focusedRow=root.contains(this.shadow.activeElement)?this.shadow.activeElement?.closest("details")?.dataset.entryIndex:null;
    root.replaceChildren();
    const payload=this._dataSourcesDiagnosticPayload(),bo=payload.blitzortung,wr=payload.weatherRouter;
    const t=key=>this._t("diag."+key),unknown=this._t("weather.source.unknown"),unavailable=this._t("weather.layer.unavailable");
    const head=(key,text)=>t(key)+": "+text;
    const create=(name,cls,content)=>{const n=document.createElement(name);if(cls)n.className=cls;if(content!==undefined)n.textContent=String(content);return n;};
    const line=(parent,label,value)=>{const dt=create("dt",null,label),dd=create("dd",null,value??unknown);parent.append(dt,dd);};
    const card=(title)=>{const n=create("div","gr-source-card");n.append(create("div","gr-source-title",title));root.append(n);return n;};
    const detail=(parent,entries)=>{const dl=create("dl","gr-source-pairs");for(const [key,val] of entries)line(dl,key,val);parent.append(dl);};
    section.querySelector("#data-sources-checked").textContent=head("lastCheck",bo.checkedAt||t("notChecked"))+" · "+t("onlyWhenOpened");
    const blitz=card("Blitzortung.org · "+({available:t("loaded"),missing:t("missing"),degraded:t("limited")}[bo.status]||unknown));
    if(bo.error)blitz.append(create("div","gr-source-note gr-source-warning",head("backendUnavailable",bo.error)));
    detail(blitz,[
      [t("configuredCounter"),bo.counter?.entityId||t("notConfigured")],
      [t("counterState"),bo.counter?.exists?bo.counter.state:t("entityMissing")],
      [t("lightningConfigs"),bo.installed==null?t("notDetermined"):(bo.entries?.length??0)],
      [t("linkedCount"),bo.linkedEntries??t("notDetermined")],
      [t("lightningEvents"),bo.geoLocationEntities],
      [t("trackers"),bo.referenceTrackers?.join(", ")||t("notDetermined")]
    ]);
    if(!bo.entries?.length)blitz.append(create("div","gr-source-note",
      t(bo.error?"noBlitzBackend":"noBlitzEntries")));
    for(const [index,entry] of (bo.entries||[]).entries()){
      const row=create("details","gr-source-entry");
      row.dataset.entryIndex=String(index);
      row.open=expanded.has(row.dataset.entryIndex);
      row.append(create("summary",null,(index+1)+". "+(entry.name||t("location"))+" · "+t(entry.loaded?"loaded":"notLoaded")+(entry.referenceTrackerLinked?" · "+t("linkedCount"):"")));
      detail(row,[
        [t("configId"),entry.entryId],
        [t("integrationState"),entry.state],
        [t("locationMode"),t(entry.configType==="entity"?"locationEntity":"fixedCoordinates")],
        [t("locationEntity"),entry.locationEntity||t("notUsed")],
        [t("entityAvailable"),t(entry.locationEntityAvailable==null?"notApplicable":entry.locationEntityAvailable?"yes":"no")],
        [t("latitude"),entry.coordinates?.latitude],
        [t("longitude"),entry.coordinates?.longitude],
        [t("trackers"),t(entry.referenceTrackerLinked?"linked":"notLinked")],
        [t("radius"),entry.settings?.radius==null?null:entry.settings.radius+" "+(entry.settings.radiusUnit||"")],
        [t("timeWindow"),entry.settings?.timeWindow==null?null:entry.settings.timeWindow+" min"],
        [t("maximumStrikes"),entry.settings?.maxTrackedLightnings],
        [t("defaultsUsed"),(entry.settings?.defaultsUsed||[]).join(", ")||t("none")],
        [t("sensors"),entry.sensors?.length||0]
      ]);
      for(const sensor of entry.sensors||[])detail(row,[[sensor.entityId,sensor.state??(sensor.disabled?t("disabled"):unavailable)]]);
      blitz.append(row);
      if(row.dataset.entryIndex===focusedRow)row.querySelector("summary")?.focus({preventScroll:true});
    }
    const saved=card("GewitterRadar · "+t("savedLocations"));
    detail(saved,[[t("locationEntity"),bo.savedLocations?.entityId],[t("currentSelection"),bo.savedLocations?.selected],[t("selectionEntries"),bo.savedLocations?.options?.length||0]]);
    if(bo.savedLocations?.options?.length){const list=create("ul","gr-source-list");for(const value of bo.savedLocations.options)list.append(create("li",null,value));saved.append(list);}
    saved.append(create("div","gr-source-note",t("locationsHelp")));
    const weather=card("WeatherRouter · Consumer V1");
    const statusKey={not_checked:"notChecked",ready:"ready",unreachable:"unreachable",not_ready:"notReady"}[wr.status];
    detail(weather,[[t("status"),statusKey?t(statusKey):wr.status],[t("lastCheck"),wr.checkedAt]]);
    weather.append(create("div","gr-source-note",t("noExtraWeatherRequests")));
    this._weatherEngineRenderSourceCards?.();
  },
  async _refreshDataSourcesView(){
    const section=this._ensureDataSourcesSection();
    const button=section?.querySelector("#data-sources-refresh");
    if(button?.disabled)return;
    if(button){button.disabled=true;button.dataset.presentationText="diag.checking";button.textContent=this._t("diag.checking");}
    try{await this._refreshBlitzortungSources?.();this._renderDataSourcesView();}
    finally{if(button){button.disabled=false;button.dataset.presentationText="diag.refresh";button.textContent=this._t("diag.refresh");}}
  },
  async _copyDataSourcesDiagnostics(){
    await this._refreshBlitzortungSources?.();
    const content=JSON.stringify(this._dataSourcesDiagnosticPayload(),null,2);
    try{await navigator.clipboard.writeText(content);}
    catch(_error){const textarea=document.createElement("textarea");textarea.value=content;textarea.style.position="fixed";textarea.style.opacity="0";document.body.append(textarea);textarea.select();document.execCommand("copy");textarea.remove();}
    this._renderDataSourcesView();
  },
  _downloadDataSourcesDiagnostics(){
    // Gespeicherten Diagnose-Snapshot im Klickereignis sichern. Fuer neue Messungen zuerst Aktualisieren waehlen.
    const content=JSON.stringify(this._dataSourcesDiagnosticPayload(),null,2);
    const blob=new Blob([content],{type:"application/json;charset=utf-8"});
    const url=URL.createObjectURL(blob),anchor=document.createElement("a");
    anchor.href=url;anchor.download="gewitterradar-data-sources-"+new Date().toISOString().replace(/[:.]/g,"-")+".json";
    document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
    this._renderDataSourcesView();
  }
}));

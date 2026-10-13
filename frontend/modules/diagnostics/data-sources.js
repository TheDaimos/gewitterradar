import {defineModule} from "../core/runtime.js?v=41129r1";
export const MODULE_META=Object.freeze({
  id:"diagnostics.data-sources",version:"0.1.3",group:"Datenquellen & Verbindungen",
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
    section.innerHTML=`
      <summary class="settings-section-head"><div><div class="settings-section-title">Datenquellen &amp; Verbindungen</div>
      <div class="settings-section-sub">Integrationen, Orte, Tracker und Einstellungen</div></div></summary>
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
          <button class="gr-sources-action" id="data-sources-refresh" type="button">Aktualisieren</button>
          <button class="gr-sources-action" id="data-sources-copy" type="button">JSON kopieren</button>
          <button class="gr-sources-action" id="data-sources-download" type="button">JSON herunterladen</button>
        </div>
        <div class="gr-source-note" id="data-sources-checked">Noch nicht geprüft</div>
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
    root.replaceChildren();
    const payload=this._dataSourcesDiagnosticPayload(),bo=payload.blitzortung,wr=payload.weatherRouter;
    const create=(name,cls,content)=>{const n=document.createElement(name);if(cls)n.className=cls;if(content!==undefined)n.textContent=String(content);return n;};
    const line=(parent,label,value)=>{const dt=create("dt",null,label),dd=create("dd",null,value==null?"Unbekannt":value);parent.append(dt,dd);};
    const card=(title)=>{const n=create("div","gr-source-card");n.append(create("div","gr-source-title",title));root.append(n);return n;};
    const detail=(parent,entries)=>{const dl=create("dl","gr-source-pairs");for(const [key,val] of entries)line(dl,key,val);parent.append(dl);};
    section.querySelector("#data-sources-checked").textContent="Blitzortung geprüft: "+(bo.checkedAt||"noch nicht")+" · Abfrage nur beim Öffnen oder Aktualisieren";
    const blitz=card("Blitzortung.org · "+(bo.status==="available"?"Integration geladen":bo.status==="missing"?"Integration nicht vorhanden":bo.status==="degraded"?"Integration eingeschränkt":"Status unbekannt"));
    if(bo.error)blitz.append(create("div","gr-source-note gr-source-warning","Backend-Prüfung nicht verfügbar: "+bo.error));
    detail(blitz,[
      ["Zähler (lokale Kartenkonfiguration)",bo.counter?.entityId||"nicht konfiguriert"],
      ["Zählerzustand",bo.counter?.exists?bo.counter.state:"Entität fehlt"],
      ["Blitzortung-Konfigurationen",bo.installed===null?"nicht ermittelt":bo.entries.length],
      ["Mit Gewitterradar gekoppelt",bo.linkedEntries===null?"nicht ermittelt":bo.linkedEntries],
      ["Blitzereignisse in HA (gesamt)",bo.geoLocationEntities],
      ["Gewitterradar-Tracker",bo.referenceTrackers?.join(", ")||"nicht ermittelt"]
    ]);
    if(!bo.entries?.length)blitz.append(create("div","gr-source-note",
      bo.error?"Die native Gewitterradar-Backend-Schnittstelle ist in dieser Ansicht möglicherweise nicht installiert. Es werden keine fremden Konfigurationsdaten geraten.":"Keine Blitzortung-Konfigurationseinträge gemeldet."));
    for(const [index,entry] of (bo.entries||[]).entries()){
      const row=create("details","gr-source-entry");
      row.append(create("summary",null,(index+1)+". "+(entry.name||"Standort")+" · "+(entry.loaded?"geladen":"nicht geladen")+(entry.referenceTrackerLinked?" · Gewitterradar gekoppelt":"")));
      detail(row,[
        ["Konfigurationskennung",entry.entryId],
        ["Integrationszustand",entry.state],
        ["Standortmodus",entry.configType==="entity"?"Standortentität":"Feste Koordinaten"],
        ["Standortentität",entry.locationEntity||"nicht verwendet"],
        ["Standortentität verfügbar",entry.locationEntityAvailable===null?"nicht anwendbar":entry.locationEntityAvailable?"Ja":"Nein"],
        ["Breitengrad",entry.coordinates?.latitude],
        ["Längengrad",entry.coordinates?.longitude],
        ["Gewitterradar-Tracker",entry.referenceTrackerLinked?"Gekoppelt":"Nicht gekoppelt"],
        ["Erfassungsradius",entry.settings?.radius+" "+(entry.settings?.radiusUnit||"")],
        ["Zeitfenster",entry.settings?.timeWindow+" Minuten"],
        ["Maximal verfolgte Blitze",entry.settings?.maxTrackedLightnings],
        ["Standardwerte statt gespeicherter Werte",(entry.settings?.defaultsUsed||[]).join(", ")||"Keine"],
        ["Sensoren",entry.sensors?.length||0]
      ]);
      for(const sensor of entry.sensors||[])detail(row,[[sensor.entityId,sensor.state??(sensor.disabled?"deaktiviert":"nicht verfügbar")]]);
      blitz.append(row);
    }
    const saved=card("Gewitterradar · Standortauswahl und gespeicherte Referenzen");
    detail(saved,[["Standort-Entität",bo.savedLocations?.entityId],["Aktuelle Auswahl",bo.savedLocations?.selected],["Auswahleinträge",bo.savedLocations?.options?.length||0]]);
    if(bo.savedLocations?.options?.length){const list=create("ul","gr-source-list");for(const value of bo.savedLocations.options)list.append(create("li",null,value));saved.append(list);}
    saved.append(create("div","gr-source-note","Die Standortauswahl stammt aus dem Home-Assistant-Helfer. Sie ist von den konfigurierten Blitzortung-Standorten zu unterscheiden."));
    const weather=card("WeatherRouter · Consumer V1");
    detail(weather,[["Letzter Discovery-Status",wr.status],["Letzte Discovery-Prüfung",wr.checkedAt]]);
    weather.append(create("div","gr-source-note",wr.note));
  },
  async _refreshDataSourcesView(){
    const section=this._ensureDataSourcesSection();
    const button=section?.querySelector("#data-sources-refresh");
    if(button?.disabled)return;
    if(button){button.disabled=true;button.textContent="Prüfung läuft …";}
    try{await this._refreshBlitzortungSources?.();this._renderDataSourcesView();}
    finally{if(button){button.disabled=false;button.textContent="Aktualisieren";}}
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

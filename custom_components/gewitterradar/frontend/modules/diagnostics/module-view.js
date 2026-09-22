import { defineModule } from "../core/runtime.js?v=41002";

export const MODULE_META=Object.freeze({
  id:"diagnostics.module-view",
  version:"1.1.1",
  group:"Diagnose",
  function:"Module & Versionen",
  subfunctions:["Geladene Module","Soll/Ist-Vergleich","Versionsstatus","Modul-Details","Diagnose kopieren","JSON herunterladen"],
  file:"modules/diagnostics/module-view.js"
});

export const installModuleView=defineModule(MODULE_META,(deps)=>{
  const { APPLICATION_META, EXPECTED_MODULES, moduleDiagnostics, moduleRegistrySnapshot, ABOUT_CLOSE_IMAGE }=deps;

  const statusLabel=(status)=>({
    ok:"korrekt",
    missing:"fehlt",
    version_mismatch:"abweichend",
    unexpected:"unerwartet"
  }[status]||status);

  const statusSymbol=(status)=>status==="ok"?"✓":status==="missing"?"✕":"!";
  const groupPriority=(group)=>group==="Diagnose"?-100:0;

  return {
    _ensureModuleView(){
      if(!this.shadow)return null;
      let section=this.shadow.getElementById("settings-modules-section");
      if(section)return section;

      section=document.createElement("details");
      section.className="settings-section settings-collapsible";
      section.id="settings-modules-section";
      section.innerHTML=`
        <summary class="settings-section-head">
          <div>
            <div class="settings-section-title">Module &amp; Versionen</div>
            <div class="settings-section-sub">Status der tatsächlich geladenen Komponenten</div>
          </div>
        </summary>
        <div class="settings-section-content gr-mod-compact-content">
          <style>
            #settings-modules-section .gr-mod-compact-content{padding:10px 12px 12px;overflow:visible!important;max-height:none!important}
            #settings-modules-section .gr-mod-summary{display:grid;gap:4px;padding:10px 11px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.025);font-size:9px}
            #settings-modules-section .gr-mod-summary strong{font-size:11px;color:#e9edf3}
            #settings-modules-section .gr-mod-state{font-weight:850}
            #settings-modules-section .gr-mod-state[data-state="ok"]{color:#78d59b}
            #settings-modules-section .gr-mod-state[data-state="warn"]{color:#e0b44f}
            #settings-modules-section .gr-mod-summary-compact{grid-template-columns:minmax(0,1fr) auto;align-items:center;column-gap:14px}
            #settings-modules-section .gr-mod-summary-copy{display:grid;gap:4px;min-width:0}
            #settings-modules-section .gr-mod-details-button,
            .gr-module-dialog .gr-mod-action{appearance:none;border:1px solid rgba(214,180,95,.42);border-radius:999px;padding:8px 13px;background:linear-gradient(180deg,rgba(205,158,64,.16),rgba(113,78,24,.12));color:#f0d58e;font-size:8.5px;font-weight:850;letter-spacing:.02em;cursor:pointer;box-shadow:inset 0 1px rgba(255,244,213,.07),0 0 10px rgba(208,158,55,.04)}
            #settings-modules-section .gr-mod-details-button:focus-visible,
            .gr-module-dialog .gr-mod-action:focus-visible{outline:2px solid rgba(255,225,161,.92);outline-offset:2px}
            @media(hover:hover) and (pointer:fine){#settings-modules-section .gr-mod-details-button:hover,.gr-module-dialog .gr-mod-action:hover{filter:brightness(1.12)}}
            @media(max-width:540px){#settings-modules-section .gr-mod-summary-compact{grid-template-columns:1fr;row-gap:9px}#settings-modules-section .gr-mod-summary-compact .gr-mod-details-button{justify-self:end}}

            .gr-module-backdrop{position:fixed;inset:0;z-index:2147483646;display:none;align-items:center;justify-content:center;padding:clamp(10px,2.5vw,28px);background:radial-gradient(circle at 50% 30%,rgba(31,44,66,.28),rgba(4,7,12,.76) 60%,rgba(1,2,4,.9) 100%);backdrop-filter:blur(10px) saturate(.86);-webkit-backdrop-filter:blur(10px) saturate(.86);overscroll-behavior:contain}
            .gr-module-backdrop.open{display:flex;animation:settingsBackdropIn .18s ease-out both}
            .gr-module-dialog{display:flex;flex-direction:column;width:min(920px,100%);max-height:min(860px,calc(100dvh - 20px));overflow:hidden;border:2px solid transparent;border-radius:22px;color:var(--b-text);background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%) padding-box,linear-gradient(180deg,rgba(20,28,38,.995),rgba(7,12,18,.998)) padding-box,linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c) border-box;box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,236,181,.08),0 0 22px rgba(215,164,67,.06)}
            .gr-module-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:13px 16px 11px;border-bottom:1px solid rgba(255,255,255,.07);background:linear-gradient(180deg,rgba(17,23,32,.995),rgba(17,23,32,.94))}
            .gr-module-kicker{color:var(--b-gold);font-size:8px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
            .gr-module-title{margin-top:2px;font-size:18px;line-height:1.05;font-weight:850;letter-spacing:-.02em}
            .gr-module-close{display:grid;place-items:center;flex:0 0 44px;width:44px;height:44px;padding:0;border:0;background:transparent;cursor:pointer}
            .gr-module-close img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;user-select:none;-webkit-user-drag:none}
            .gr-module-close:focus-visible{outline:2px solid rgba(255,225,161,.92);outline-offset:1px;border-radius:9px}
            .gr-module-body{min-height:0;overflow:auto;padding:14px 16px 18px;overscroll-behavior:contain}
            .gr-module-dialog .gr-mod-summary{margin-bottom:12px}
            .gr-module-dialog .gr-mod-group{margin-top:13px}
            .gr-module-dialog .gr-mod-group:first-of-type{margin-top:0}
            .gr-module-dialog .gr-mod-group-title{padding:0 3px 6px;color:#d6b45f;font-size:8.5px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}
            .gr-module-dialog .gr-mod-row{margin:0 0 5px;border:1px solid rgba(255,255,255,.055);border-radius:11px;background:rgba(255,255,255,.018);overflow:hidden}
            .gr-module-dialog .gr-mod-row>summary{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;padding:9px 11px;cursor:pointer;list-style:none}
            .gr-module-dialog .gr-mod-row>summary::-webkit-details-marker{display:none}
            .gr-module-dialog .gr-mod-row>summary::after{content:'';grid-column:2;width:8px;height:8px;margin:2px 3px 0 8px;border-right:1.5px solid #b99449;border-bottom:1.5px solid #b99449;transform:rotate(45deg);transition:transform .15s ease}
            .gr-module-dialog .gr-mod-row[open]>summary::after{transform:rotate(225deg);margin-top:6px}
            .gr-module-dialog .gr-mod-heading{min-width:0;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
            .gr-module-dialog .gr-mod-name{font-size:10px;font-weight:820;color:#e0e5ec}
            .gr-module-dialog .gr-mod-id{font:7.5px/1.2 ui-monospace,SFMono-Regular,Consolas,monospace;color:#7f8996;overflow-wrap:anywhere}
            .gr-module-dialog .gr-mod-version{grid-column:2;grid-row:1;text-align:right;font:800 9px/1.35 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:nowrap;margin-right:22px}
            .gr-module-dialog .gr-mod-version[data-state="ok"]{color:#78d59b}
            .gr-module-dialog .gr-mod-version[data-state="version_mismatch"],.gr-module-dialog .gr-mod-version[data-state="unexpected"]{color:#e0b44f}
            .gr-module-dialog .gr-mod-version[data-state="missing"]{color:#ef7777}
            .gr-module-dialog .gr-mod-detail{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:4px 12px;padding:0 11px 11px;border-top:1px solid rgba(255,255,255,.045);font-size:8px;line-height:1.4;color:#9aa3af}
            .gr-module-dialog .gr-mod-detail dt{color:#6f7884;font-weight:800}
            .gr-module-dialog .gr-mod-detail dd{margin:0;overflow-wrap:anywhere}
            .gr-module-dialog .gr-mod-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:13px;border-top:1px solid rgba(255,255,255,.06)}
            @media(max-width:620px){.gr-module-backdrop{padding:7px}.gr-module-dialog{max-height:calc(100dvh - 14px);border-radius:17px}.gr-module-head{padding:10px 11px}.gr-module-title{font-size:16px}.gr-module-body{padding:11px 10px 14px}.gr-module-dialog .gr-mod-row>summary{gap:7px;padding:9px}.gr-module-dialog .gr-mod-heading{display:grid;gap:2px}.gr-module-dialog .gr-mod-detail{grid-template-columns:1fr;gap:2px;padding:0 9px 10px}.gr-module-dialog .gr-mod-detail dd{margin-bottom:5px}}
          </style>
          <div class="gr-mod-summary gr-mod-summary-compact">
            <div id="settings-modules-summary" class="gr-mod-summary-copy"></div>
            <button id="settings-modules-details" class="gr-mod-details-button" type="button">Modul-Details</button>
          </div>
        </div>
        <div id="settings-modules-backdrop" class="gr-module-backdrop" aria-hidden="true">
          <section class="gr-module-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-modules-dialog-title" tabindex="-1">
            <header class="gr-module-head">
              <div>
                <div class="gr-module-kicker">Gewitterradar · Diagnose</div>
                <div class="gr-module-title" id="settings-modules-dialog-title">Modul-Details</div>
              </div>
              <button id="settings-modules-close" class="gr-module-close" type="button" aria-label="Modul-Details schließen"><img src="${ABOUT_CLOSE_IMAGE}" alt="" width="34" height="34" draggable="false"></button>
            </header>
            <div class="gr-module-body">
              <div id="settings-modules-dialog-summary" class="gr-mod-summary"></div>
              <div id="settings-modules-list"></div>
              <div class="gr-mod-actions">
                <button id="settings-modules-copy" class="gr-mod-action" type="button">Diagnose kopieren</button>
                <button id="settings-modules-download" class="gr-mod-action" type="button">JSON herunterladen</button>
              </div>
            </div>
          </section>
        </div>`;

      const diagnostic=this.shadow.getElementById("settings-diagnostic-section");
      const body=this.shadow.querySelector(".settings-body");
      if(diagnostic)diagnostic.after(section);else body?.append(section);

      section.querySelector("#settings-modules-details")?.addEventListener("click",()=>this._openModuleDetails());
      section.querySelector("#settings-modules-close")?.addEventListener("click",()=>this._closeModuleDetails());
      section.querySelector("#settings-modules-copy")?.addEventListener("click",()=>this._copyModuleDiagnostics());
      section.querySelector("#settings-modules-download")?.addEventListener("click",()=>this._downloadModuleDiagnostics());
      const backdrop=section.querySelector("#settings-modules-backdrop");
      backdrop?.addEventListener("click",event=>{if(event.target===backdrop)this._closeModuleDetails();});
      backdrop?.addEventListener("keydown",event=>{if(event.key==="Escape"){event.preventDefault();this._closeModuleDetails();}});
      section.addEventListener("toggle",()=>{if(section.open)this._syncModuleView();});
      return section;
    },

    _moduleDiagnosticsPayload(){
      return {
        application:APPLICATION_META,
        capturedAt:new Date().toISOString(),
        diagnostics:moduleRegistrySnapshot(EXPECTED_MODULES)
      };
    },

    _renderModuleSummary(target,result){
      if(!target)return;
      const issueCount=result.rows.filter(row=>row.status!=="ok").length+result.duplicateIds.length;
      target.replaceChildren();
      const title=document.createElement("strong");
      title.textContent=`Gewitterradar ${APPLICATION_META.displayVersion}`;
      const counts=document.createElement("span");
      counts.textContent=`${result.loadedCount} / ${result.expectedCount} Module geladen`;
      const state=document.createElement("span");
      state.className="gr-mod-state";
      state.dataset.state=issueCount?"warn":"ok";
      state.textContent=issueCount?`! ${issueCount} Abweichung${issueCount===1?"":"en"} erkannt`:"✓ Versionssatz konsistent";
      target.append(title,counts,state);
    },

    _renderModuleList(target,result){
      if(!target)return;
      target.replaceChildren();
      const grouped=new Map();
      for(const row of result.rows){
        const group=row.group||"Sonstige";
        if(!grouped.has(group))grouped.set(group,[]);
        grouped.get(group).push(row);
      }
      const groups=[...grouped.entries()].sort((a,b)=>groupPriority(a[0])-groupPriority(b[0])||a[0].localeCompare(b[0],"de"));
      for(const [group,rows] of groups){
        const block=document.createElement("div");
        block.className="gr-mod-group";
        const groupTitle=document.createElement("div");
        groupTitle.className="gr-mod-group-title";
        groupTitle.textContent=group;
        block.append(groupTitle);
        for(const row of rows.sort((a,b)=>String(a.function).localeCompare(String(b.function),"de"))){
          const item=document.createElement("details");
          item.className="gr-mod-row";

          const head=document.createElement("summary");
          const heading=document.createElement("div");
          heading.className="gr-mod-heading";
          const name=document.createElement("span");
          name.className="gr-mod-name";name.textContent=row.function||row.id;
          const id=document.createElement("span");
          id.className="gr-mod-id";id.textContent=row.id;
          heading.append(name,id);

          const version=document.createElement("div");
          version.className="gr-mod-version";
          version.dataset.state=row.status;
          const loaded=row.loadedVersion||"—";
          version.textContent=`${statusSymbol(row.status)} ${loaded}`;
          version.title=`Status: ${statusLabel(row.status)} · Erwartet: ${row.expectedVersion||"—"} · Geladen: ${loaded}`;
          head.append(heading,version);

          const detail=document.createElement("dl");
          detail.className="gr-mod-detail";
          const appendDetail=(label,value)=>{
            const dt=document.createElement("dt");dt.textContent=label;
            const dd=document.createElement("dd");dd.textContent=value||"—";
            detail.append(dt,dd);
          };
          appendDetail("Status",statusLabel(row.status));
          appendDetail("Version",loaded);
          appendDetail("Erwartet",row.expectedVersion||"—");
          appendDetail("Datei",row.file||"—");
          appendDetail("Geladen",row.loadedAt||"—");
          appendDetail("Funktionen",(row.subfunctions||[]).join(" · ")||"—");

          item.append(head,detail);
          block.append(item);
        }
        target.append(block);
      }
    },

    _syncModuleView(){
      const section=this._ensureModuleView();
      if(!section)return;
      const result=moduleDiagnostics(EXPECTED_MODULES);
      this._renderModuleSummary(section.querySelector("#settings-modules-summary"),result);
      this._renderModuleSummary(section.querySelector("#settings-modules-dialog-summary"),result);
      this._renderModuleList(section.querySelector("#settings-modules-list"),result);
    },

    _openModuleDetails(){
      const section=this._ensureModuleView();
      const backdrop=section?.querySelector("#settings-modules-backdrop");
      if(!backdrop)return;
      this._syncModuleView();
      backdrop.classList.add("open");
      backdrop.setAttribute("aria-hidden","false");
      requestAnimationFrame(()=>backdrop.querySelector("#settings-modules-close")?.focus());
    },

    _closeModuleDetails(){
      const backdrop=this.shadow?.getElementById("settings-modules-backdrop");
      if(!backdrop)return;
      backdrop.classList.remove("open");
      backdrop.setAttribute("aria-hidden","true");
      this.shadow?.getElementById("settings-modules-details")?.focus();
    },

    async _copyModuleDiagnostics(){
      const text=JSON.stringify(this._moduleDiagnosticsPayload(),null,2);
      try{
        await navigator.clipboard.writeText(text);
      }catch(_error){
        const area=document.createElement("textarea");
        area.value=text;area.style.position="fixed";area.style.opacity="0";
        document.body.append(area);area.select();document.execCommand("copy");area.remove();
      }
    },

    _downloadModuleDiagnostics(){
      const payload=JSON.stringify(this._moduleDiagnosticsPayload(),null,2);
      const blob=new Blob([payload],{type:"application/json;charset=utf-8"});
      const url=URL.createObjectURL(blob);
      const link=document.createElement("a");
      link.href=url;
      link.download=`gewitterradar-module-${APPLICATION_META.version}.json`;
      document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),0);
    }
  };
});

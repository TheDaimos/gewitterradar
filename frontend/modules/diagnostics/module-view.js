import { defineModule } from "../core/runtime.js?v=41002";

export const MODULE_META=Object.freeze({
  id:"diagnostics.module-view",
  version:"1.0.0",
  group:"Diagnose",
  function:"Module & Versionen",
  subfunctions:["Geladene Module","Soll/Ist-Vergleich","Versionsstatus","Diagnose kopieren","JSON herunterladen"],
  file:"modules/diagnostics/module-view.js"
});

export const installModuleView=defineModule(MODULE_META,(deps)=>{
  const { APPLICATION_META, EXPECTED_MODULES, moduleDiagnostics, moduleRegistrySnapshot }=deps;

  const statusLabel=(status)=>({
    ok:"korrekt",
    missing:"fehlt",
    version_mismatch:"abweichend",
    unexpected:"unerwartet"
  }[status]||status);

  const statusSymbol=(status)=>status==="ok"?"✓":status==="missing"?"✕":"!";

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
            <div class="settings-section-sub">Tatsächlich geladene Komponenten und Versionsprüfung</div>
          </div>
        </summary>
        <div class="settings-section-content" style="padding:10px 12px 12px">
          <style>
            #settings-modules-section .gr-mod-summary{display:grid;gap:4px;padding:9px 10px;margin-bottom:9px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.025);font-size:9px}
            #settings-modules-section .gr-mod-summary strong{font-size:11px;color:#e9edf3}
            #settings-modules-section .gr-mod-state{font-weight:850}
            #settings-modules-section .gr-mod-state[data-state="ok"]{color:#78d59b}
            #settings-modules-section .gr-mod-state[data-state="warn"]{color:#e0b44f}
            #settings-modules-section .gr-mod-group{margin-top:10px}
            #settings-modules-section .gr-mod-group-title{padding:0 2px 5px;color:#d6b45f;font-size:8px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
            #settings-modules-section .gr-mod-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:8px 9px;border-top:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.015)}
            #settings-modules-section .gr-mod-row:first-of-type{border-radius:11px 11px 0 0}
            #settings-modules-section .gr-mod-name{font-size:10px;font-weight:820;color:#e0e5ec}
            #settings-modules-section .gr-mod-id{margin-top:2px;font:7.5px/1.25 ui-monospace,SFMono-Regular,Consolas,monospace;color:#7f8996;overflow-wrap:anywhere}
            #settings-modules-section .gr-mod-functions{margin-top:4px;font-size:7.5px;line-height:1.35;color:#98a1ac}
            #settings-modules-section .gr-mod-version{text-align:right;font:800 8.5px/1.35 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:nowrap}
            #settings-modules-section .gr-mod-version[data-state="ok"]{color:#78d59b}
            #settings-modules-section .gr-mod-version[data-state="version_mismatch"],
            #settings-modules-section .gr-mod-version[data-state="unexpected"]{color:#e0b44f}
            #settings-modules-section .gr-mod-version[data-state="missing"]{color:#ef7777}
            #settings-modules-section .gr-mod-detail{grid-column:1/-1;font-size:7px;color:#68727f;overflow-wrap:anywhere}
            #settings-modules-section .gr-mod-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}
            #settings-modules-section .gr-mod-action{appearance:none;border:1px solid rgba(214,180,95,.35);border-radius:999px;padding:7px 10px;background:rgba(214,180,95,.06);color:#e6d6a4;font-size:8px;font-weight:800;cursor:pointer}
          </style>
          <div id="settings-modules-summary" class="gr-mod-summary"></div>
          <div id="settings-modules-list"></div>
          <div class="gr-mod-actions">
            <button id="settings-modules-copy" class="gr-mod-action" type="button">Diagnose kopieren</button>
            <button id="settings-modules-download" class="gr-mod-action" type="button">JSON herunterladen</button>
          </div>
        </div>`;

      const diagnostic=this.shadow.getElementById("settings-diagnostic-section");
      const body=this.shadow.querySelector(".settings-body");
      if(diagnostic)diagnostic.before(section);else body?.append(section);

      section.querySelector("#settings-modules-copy")?.addEventListener("click",()=>this._copyModuleDiagnostics());
      section.querySelector("#settings-modules-download")?.addEventListener("click",()=>this._downloadModuleDiagnostics());
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

    _syncModuleView(){
      const section=this._ensureModuleView();
      if(!section)return;
      const result=moduleDiagnostics(EXPECTED_MODULES);
      const summary=section.querySelector("#settings-modules-summary");
      const list=section.querySelector("#settings-modules-list");
      if(!summary||!list)return;

      const issueCount=result.rows.filter(row=>row.status!=="ok").length+result.duplicateIds.length;
      summary.replaceChildren();
      const title=document.createElement("strong");
      title.textContent=`Gewitterradar ${APPLICATION_META.displayVersion}`;
      const counts=document.createElement("span");
      counts.textContent=`${result.loadedCount} / ${result.expectedCount} Module geladen`;
      const state=document.createElement("span");
      state.className="gr-mod-state";
      state.dataset.state=issueCount?"warn":"ok";
      state.textContent=issueCount?`! ${issueCount} Abweichung${issueCount===1?"":"en"} erkannt`:"✓ Versionssatz konsistent";
      summary.append(title,counts,state);

      list.replaceChildren();
      const grouped=new Map();
      for(const row of result.rows){
        const group=row.group||"Sonstige";
        if(!grouped.has(group))grouped.set(group,[]);
        grouped.get(group).push(row);
      }
      for(const [group,rows] of [...grouped.entries()].sort((a,b)=>a[0].localeCompare(b[0],"de"))){
        const block=document.createElement("div");
        block.className="gr-mod-group";
        const groupTitle=document.createElement("div");
        groupTitle.className="gr-mod-group-title";
        groupTitle.textContent=group;
        block.append(groupTitle);
        for(const row of rows.sort((a,b)=>String(a.function).localeCompare(String(b.function),"de"))){
          const item=document.createElement("div");
          item.className="gr-mod-row";

          const info=document.createElement("div");
          const name=document.createElement("div");
          name.className="gr-mod-name"; name.textContent=row.function||row.id;
          const id=document.createElement("div");
          id.className="gr-mod-id"; id.textContent=row.id;
          const functions=document.createElement("div");
          functions.className="gr-mod-functions";
          functions.textContent=(row.subfunctions||[]).join(" · ")||"—";
          info.append(name,id,functions);

          const version=document.createElement("div");
          version.className="gr-mod-version";
          version.dataset.state=row.status;
          const loaded=row.loadedVersion||"—";
          version.textContent=`${statusSymbol(row.status)} ${loaded}`;
          version.title=`Status: ${statusLabel(row.status)} · Erwartet: ${row.expectedVersion||"—"} · Geladen: ${loaded}`;

          const detail=document.createElement("div");
          detail.className="gr-mod-detail";
          detail.textContent=`${row.file||"—"} · Soll ${row.expectedVersion||"—"} · Ist ${loaded}${row.loadedAt?` · geladen ${row.loadedAt}`:""}`;

          item.append(info,version,detail);
          block.append(item);
        }
        list.append(block);
      }
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

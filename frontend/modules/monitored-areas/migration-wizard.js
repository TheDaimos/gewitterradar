// MA-020 migration workflow: explicit decisions and separate destructive confirmation.
// A request UUID is required for server-side idempotency. Browsers in a non-secure
// HA context may expose getRandomValues but not randomUUID; never use Math.random.
const maPremiumClose = () => new URL("../../assets/gewitterradar-about-close-premium.webp", import.meta.url).href;

export function migrationRequestUUID(cryptoSource=globalThis.crypto) {
  if (typeof cryptoSource?.randomUUID === "function") return cryptoSource.randomUUID();
  if (typeof cryptoSource?.getRandomValues !== "function") {
    throw new Error("Sichere UUID-Erzeugung nicht verfügbar. Home Assistant über HTTPS oder eine vertrauenswürdige lokale Adresse öffnen.");
  }
  const bytes = new Uint8Array(16);
  cryptoSource.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // RFC 4122 UUID version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant
  const hex = [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
/** Shape-check and group only profile-scoped, server-returned SQLite rows. No writes. */
export function summarizeSqlitePreview(rows) {
  if(!Array.isArray(rows))throw new Error("MA_SQLITE_PREVIEW_INVALID");
  const seen=new Set(),active=[],archived=[];
  for(const item of rows) {
    if(typeof item?.location_id!=="string"||!item.location_id||
       seen.has(item.location_id)||typeof item.name!=="string"||
       !Number.isFinite(item.latitude)||!Number.isFinite(item.longitude)||
       Math.abs(item.latitude)>90||Math.abs(item.longitude)>180||
       typeof item.archived!=="boolean")throw new Error("MA_SQLITE_PREVIEW_INVALID");
    seen.add(item.location_id);
    (item.archived?archived:active).push(item);
  }
  return {total:rows.length,active,archived};
}

export async function openMigrationWizard(owner) {
  const hass = owner.hass || owner._hass || owner._vaultHass;
  const profileId = owner._settingsVault?.profile?.id;
  if (!hass?.callWS || !profileId || !owner.shadow) return null;
  const call = async (op,payload={},requestId=null) => {
    // Never render another profile’s results or commit after a Vault switch.
    if(owner._settingsVault?.profile?.id !== profileId) throw new Error("Vault-Profil gewechselt – Dialog erneut öffnen");
    const result = await hass.callWS({
      type:"gewitterradar/monitored_areas/"+op,schema:1,
      request:{profile_id:profileId,payload,...(requestId?{request_id:requestId}:{})}
    });
    if(owner._settingsVault?.profile?.id !== profileId) throw new Error("Vault-Profil gewechselt – Dialog erneut öffnen");
    return result;
  };
  // Reuse the exact gold close artwork rendered by GewitterRadar settings.
  const MA_PREMIUM_CLOSE = owner.shadow.getElementById("settings-close")?.querySelector("img")?.src || maPremiumClose();
  const shell = document.createElement("div");
  shell.innerHTML = `<style>
    .gr-ma-wizard{box-sizing:border-box;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);margin:0;z-index:2147483601;width:min(660px,calc(100vw - 20px));height:min(820px,calc(100dvh - 24px));max-height:calc(100dvh - 24px);overflow:hidden;padding:0;display:flex;flex-direction:column;border:1px solid rgba(201,160,80,.34);border-radius:22px;background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%),linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995));color:#e7ecf1;box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,235,184,.055),inset 0 1px rgba(255,244,213,.08),0 0 30px rgba(207,159,60,.065);font:14px/1.5 Segoe UI,Arial,sans-serif}
    .gr-ma-wizard h2{margin:0 35px 12px 0;color:#f3dfb1;font-size:21px}.gr-ma-wizard p{margin:8px 0}
    .gr-ma-wizard .wizard-header{flex:0 0 auto;position:relative;padding:16px 70px 12px 18px;background:linear-gradient(180deg,rgba(17,23,32,.995),rgba(17,23,32,.94));border-bottom:1px solid rgba(255,255,255,.07);z-index:2}
    .gr-ma-wizard .wizard-header h2{margin-bottom:7px}
    .gr-ma-wizard .wizard-header p{margin:0;font-size:12px;color:#c5d5e0}
    .gr-ma-wizard .ma-view-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:12px}
    .gr-ma-wizard .ma-view-tabs button{min-height:40px;padding:8px 10px!important;border:1px solid rgba(201,160,80,.34)!important;border-radius:10px;background:#101b28!important;color:#dce7ef!important;font-weight:650}
    .gr-ma-wizard .ma-view-tabs button[aria-pressed="true"]{border-color:#e1b965!important;background:linear-gradient(130deg,#443723,#172734)!important;color:#ffdf91!important;box-shadow:inset 0 1px #fff2}
    .gr-ma-wizard .ma-filter-controls{display:flex;flex-direction:column;gap:6px;margin-top:10px}
    .gr-ma-wizard .ma-filter-controls input{box-sizing:border-box;width:100%;min-height:34px;padding:6px 9px;border:1px solid #6f8796;border-radius:8px;background:#101f2a;color:#fff}
    .gr-ma-wizard .ma-letter-bar{display:flex;flex-wrap:wrap;gap:4px;max-height:76px;overflow-y:auto;overscroll-behavior:contain}
    .gr-ma-wizard .ma-letter-bar button{min-width:30px;min-height:30px;padding:3px 7px!important;border-radius:7px!important;font-size:12px}
    .gr-ma-wizard .ma-letter-bar button[aria-pressed="true"]{background:#524126!important;border-color:#e4ba65!important;color:#ffe7aa!important}
    .gr-ma-wizard .preview[hidden],.gr-ma-wizard .sql-preview[hidden]{display:none!important}
    .gr-ma-wizard .wizard-content{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:13px 18px;scrollbar-gutter:stable;contain:paint}
    .gr-ma-wizard .wizard-footer{flex:0 0 auto;position:relative;padding:11px 18px 14px;background:linear-gradient(180deg,rgba(17,23,32,.96),rgba(10,16,24,.99));border-top:1px solid rgba(201,160,80,.22);z-index:2}
    .gr-ma-wizard .wizard-footer [role=status]{max-height:5.5em;overflow-y:auto}
    .gr-ma-wizard .close{position:absolute;right:10px;top:10px;width:44px;height:44px;min-width:44px;min-height:44px;border-radius:8px;display:grid;place-items:center;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;cursor:pointer;touch-action:manipulation}
    .gr-ma-wizard .close img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}
    @media(hover:hover) and (pointer:fine){.gr-ma-wizard .close:hover img{filter:brightness(1.12) drop-shadow(0 0 2px #dba34c70)}}.gr-ma-wizard .close:active img{transform:scale(.97);filter:brightness(.92)}
    .gr-ma-wizard .close:focus-visible{outline:2px solid #e7c16e;outline-offset:-2px}
    @media(max-width:540px){.gr-ma-wizard .wizard-header{padding:12px 63px 9px 13px}.gr-ma-wizard .wizard-content{padding:10px 12px}.gr-ma-wizard .wizard-footer{padding:8px 12px 11px}.gr-ma-wizard .close{right:10px;top:10px;width:44px;height:44px}}
    @media(max-height:520px){.gr-ma-wizard .wizard-footer [role=status]{max-height:2.8em}}
    .gr-ma-wizard button:not(.close),.gr-ma-wizard select{background:#233a4b;color:#f4e5c9;border:1px solid #b99b68;border-radius:7px;padding:9px}
    .gr-ma-wizard button:disabled{opacity:.4}.gr-ma-wizard .entry{padding:9px;margin:6px 0;border:1px solid #708ca066;border-radius:8px}
    .gr-ma-wizard .entry label{display:block;font-weight:600}.gr-ma-wizard .entry select{width:100%;margin-top:5px}
    .gr-ma-wizard .controls{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:15px}
    .gr-ma-wizard [role=status]{white-space:pre-wrap;color:#f3d18a}
    .gr-ma-wizard .warning{color:#ffb4a5}.gr-ma-wizard .confirm{margin:14px 0}
    .gr-ma-wizard .sql-preview{margin:12px 0;padding:12px;border:1px solid #718a9f99;border-radius:10px;background:#102431}
    .gr-ma-wizard .sql-preview[hidden]{display:none}
    .gr-ma-wizard .sql-preview input{box-sizing:border-box;width:100%;margin:8px 0;padding:8px;border:1px solid #96aeb8;border-radius:7px;background:#172e3e;color:#fff}
    .gr-ma-wizard .sql-preview details{margin:9px 0;border:1px solid #476377;border-radius:8px;padding:8px}
    .gr-ma-wizard .sql-preview summary{cursor:pointer;font-weight:600;color:#f1d8a4}
    .gr-ma-wizard .sql-row{padding:5px 0;border-bottom:1px solid #40566966;overflow-wrap:anywhere}
    .gr-ma-wizard .sql-row:last-child{border-bottom:0}
    .gr-ma-wizard .sql-row small{display:block;color:#b9c9d5}
    .gr-ma-wizard .sql-preview .note{color:#b6c8d6;font-size:12px}

    /* V4.14.16: real GR Release-History metallic frame, not the flat Settings color token. */
    .gr-ma-wizard{
      border:2px solid transparent;
      background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%) padding-box,
        linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995)) padding-box,
        linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c) border-box;
      box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,236,181,.08),
        inset 0 1px rgba(255,244,213,.10),0 0 12px rgba(215,164,67,.12);
    }
    /* Balanced left/right inset; the scrollbar must not allocate an extra right-hand gutter. */
    .gr-ma-wizard .wizard-content{padding-inline:18px;scrollbar-gutter:auto;scrollbar-width:thin;scrollbar-color:#826b46 transparent}
    .gr-ma-wizard .wizard-header{padding-inline:18px}.gr-ma-wizard .wizard-header h2,.gr-ma-wizard .wizard-header>p{margin-right:44px}
    .gr-ma-wizard .wizard-footer{padding-inline:18px}
    .gr-ma-wizard .wizard-content::-webkit-scrollbar{width:6px}
    .gr-ma-wizard .wizard-content::-webkit-scrollbar-thumb{background:#826b46;border-radius:20px}
    .gr-ma-wizard .ma-view-tabs button,.gr-ma-wizard .ma-letter-bar button{
      appearance:none;position:relative;
      border:1px solid #73562d!important;border-radius:9px!important;
      background:linear-gradient(180deg,#f5daa1 0%,#ad8544 4%,#463822 13%,#1d2831 27%,#172029 68%,#5f4b2c 92%,#e0bc79 100%)!important;
      box-shadow:inset 0 1px 0 #f8e1ae99,inset 0 2px 6px #000b,
        0 1px 0 #161c25,0 3px 8px #0007!important;
      color:#f1d59e!important;text-shadow:0 1px 1px #05090d,0 0 5px #bd914355;
      transition:filter .16s ease,box-shadow .16s ease;
    }
    .gr-ma-wizard .ma-view-tabs button{font-weight:750;letter-spacing:.025em}
    .gr-ma-wizard .ma-letter-bar button{min-width:31px;min-height:32px;font-size:12px;
      font-weight:850;font-family:Georgia,"Times New Roman",serif;
      color:#f8e2b4!important;text-shadow:0 1px 0 #000,0 0 4px #d9ae6480;
      padding:3px 8px!important}
    .gr-ma-wizard .ma-view-tabs button[aria-pressed="true"],.gr-ma-wizard .ma-letter-bar button[aria-pressed="true"]{
      border-color:#ffe4a0!important;
      background:linear-gradient(180deg,#fff1bf 0%,#d1a256 9%,#75542d 22%,#392d21 55%,#89602e 88%,#fce5a2 100%)!important;
      box-shadow:inset 0 1px 1px #fff3bf,inset 0 3px 8px #32200f,
        0 0 0 1px #c4974b55,0 0 12px #c99d4e55!important;
      color:#fff1c6!important;
    }
    @media(hover:hover) and (pointer:fine){.gr-ma-wizard .ma-view-tabs button:hover,.gr-ma-wizard .ma-letter-bar button:hover{filter:brightness(1.2) saturate(1.12)}}
    .gr-ma-wizard .ma-view-tabs button:focus-visible,.gr-ma-wizard .ma-letter-bar button:focus-visible{outline:2px solid #ffe6af;outline-offset:2px}
    .gr-ma-wizard .wizard-footer .controls button{
      background:linear-gradient(180deg,#ddbb7b 0%,#635136 6%,#20323e 18%,#132531 79%,#5d482b 94%,#d6af6b 100%)!important;
      border:1px solid #ab854b!important;box-shadow:inset 0 1px #ffebc077,0 3px 8px #0007!important;
      color:#f7e7c7!important;text-shadow:0 1px 1px #000;
    }
    .gr-ma-wizard .entry select{border:1px solid #bb9457;background:linear-gradient(180deg,#2c4757,#193040);box-shadow:inset 0 1px #f7dfb522}
    .gr-ma-wizard .sql-preview{margin-inline:0;border:1px solid #aa854e;
      background:linear-gradient(180deg,#132937,#091a25);box-shadow:inset 0 1px #f7d99a22,0 3px 15px #0005}
    .gr-ma-wizard .sql-preview details{border:1px solid #977445;
      background:linear-gradient(180deg,#1d3240,#0e1e2b);box-shadow:inset 0 1px #f9d99a20}
    .gr-ma-wizard .sql-preview summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:12px}
    .gr-ma-wizard .sql-preview summary::-webkit-details-marker{display:none}
    .gr-ma-wizard .sql-preview summary::after{content:"";flex:none;width:12px;height:12px;
      border-right:2px solid #d6b66e;border-bottom:2px solid #d6b66e;transform:rotate(45deg);
      margin:-6px 6px 0 0;filter:drop-shadow(0 1px .5px #4c301c) drop-shadow(0 0 3px #d8a74a66);
      transition:transform .42s cubic-bezier(.22,1,.36,1),filter .28s ease}
    .gr-ma-wizard .sql-preview details[open]>summary::after{transform:rotate(225deg);margin-top:7px;filter:brightness(1.14) drop-shadow(0 1px .5px #4c301c) drop-shadow(0 0 4px #d8a74a88)}
    @media(max-width:540px){.gr-ma-wizard .wizard-content{padding-inline:12px}.gr-ma-wizard .wizard-header{padding-inline:12px}.gr-ma-wizard .wizard-footer{padding-inline:12px}}
  </style><dialog class="gr-ma-wizard" aria-label="Standortübernahme">
    <header class="wizard-header">
      <button type="button" class="close" aria-label="Schließen"><img src="${MA_PREMIUM_CLOSE}" alt="" draggable="false"></button>
      <h2>Standorte aus Local To-do übernehmen</h2>
      <p>Die alte Liste bleibt bis zur gesonderten Administratorbestätigung bestehen.</p>
      <nav class="ma-view-tabs" aria-label="Standortdatenquelle">
        <button type="button" data-todo-preview aria-pressed="true">Local To-do</button>
        <button type="button" data-sql-preview aria-pressed="false">SQL-Daten (lesend)</button>
      </nav>
      <div class="ma-filter-controls">
        <input type="search" class="ma-location-filter" placeholder="Standorte suchen …" aria-label="Standorte in der aktuellen Ansicht suchen">
        <div class="ma-letter-bar" role="group" aria-label="Anfangsbuchstaben"></div>
      </div>
    </header>
    <div class="wizard-content" tabindex="0" role="region" aria-label="Standortliste und SQLite-Kontrollansicht">
      <div class="preview"></div>
      <section class="sql-preview" hidden aria-label="SQLite-Kontrollansicht"></section>
    </div>
    <footer class="wizard-footer">
      <div class="controls">
        <button type="button" data-preview>Vorschau aktualisieren</button>
        <button type="button" data-suggest hidden>Eindeutige Bestandsorte zuordnen</button>
        <button type="button" data-import disabled>Auswahl importieren</button>
        <button type="button" data-finalize>Finalisierung prüfen</button>
      </div>
      <div class="confirm" hidden>
        <label><input type="checkbox"> Ich bestätige die dauerhafte Entfernung aller erfolgreich übernommenen Einträge aus der alten Local-To-do-Liste.</label>
        <button type="button" data-remove disabled>Jetzt Einträge leeren</button>
      </div>
      <p role="status" aria-live="polite"></p>
    </footer>
  </dialog>`;
  const dialog = shell.querySelector("dialog");
  const previewBox=dialog.querySelector(".preview");
  const feedback=dialog.querySelector("[role=status]");
  const previewButton=dialog.querySelector("[data-preview]");
  const importButton=dialog.querySelector("[data-import]");
  const suggestButton=dialog.querySelector("[data-suggest]");
  const finalizeButton=dialog.querySelector("[data-finalize]");
  const sqlPreviewButton=dialog.querySelector("[data-sql-preview]"),todoPreviewButton=dialog.querySelector("[data-todo-preview]"),sqlPreviewBox=dialog.querySelector(".sql-preview");
  const textFilter=dialog.querySelector(".ma-location-filter"),letterBar=dialog.querySelector(".ma-letter-bar");
  const removeButton=dialog.querySelector("[data-remove]");
  const confirm=dialog.querySelector(".confirm"),checkbox=confirm.querySelector("input");
  let preview=null, proof=null, busy=false;
  let currentView="todo",currentLetter="",sqlLoaded=false;
  const todoEntries=[],sqlEntries=[];
  const initial=name=>String(name||"").trim().charAt(0).toLocaleUpperCase();
  const renderFilter=()=>{
    const entries=currentView==="todo"?todoEntries:sqlEntries;
    const available=[...new Set(entries.map(x=>initial(x.name)).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    if(currentLetter&&!available.includes(currentLetter))currentLetter="";
    letterBar.replaceChildren();
    for(const letter of ["",...available]){
      const button=document.createElement("button");button.type="button";button.textContent=letter||"Alle";
      button.setAttribute("aria-pressed",String(letter===currentLetter));
      button.addEventListener("click",()=>{currentLetter=letter;renderFilter();});letterBar.append(button);
    }
    const term=textFilter.value.trim().toLocaleLowerCase();
    for(const item of entries)item.el.hidden=!!(currentLetter&&initial(item.name)!==currentLetter)||!item.name.toLocaleLowerCase().includes(term);
  };
  const switchView=kind=>{
    currentView=kind;
    previewBox.hidden=kind!=="todo";sqlPreviewBox.hidden=kind!=="sql";
    todoPreviewButton.setAttribute("aria-pressed",String(kind==="todo"));
    sqlPreviewButton.setAttribute("aria-pressed",String(kind==="sql"));
    previewButton.textContent=kind==="sql"?"SQL aktualisieren":"Vorschau aktualisieren";
    importButton.hidden=kind!=="todo";suggestButton.hidden=kind!=="todo"||!preview?.safe_existing_suggestions;
    finalizeButton.hidden=kind!=="todo";confirm.hidden=kind!=="todo"||!proof;
    currentLetter="";textFilter.value="";renderFilter();
  };
  textFilter.addEventListener("input",renderFilter);
  const status=(value,error=false)=>{feedback.textContent=value;feedback.className=error?"warning":"";};
  const fail=error=>status("Aktion nicht abgeschlossen: "+(error?.code||error?.message||"Unbekannter Fehler"),true);
  const setBusy=value=>{
    busy=value;
    previewButton.disabled=value;
    importButton.disabled=value||!preview||preview.invalid>0||!preview.valid;
    suggestButton.disabled=value||!preview;
    finalizeButton.disabled=value;
    sqlPreviewButton.disabled=value;
    removeButton.disabled=value||!proof||!checkbox.checked;
  };
  const close=()=>{if(dialog.open)dialog.close();shell.remove();};
  dialog.querySelector(".close").addEventListener("click",close);
  dialog.addEventListener("close",()=>shell.remove(),{once:true});
  checkbox.addEventListener("change",()=>{removeButton.disabled=busy||!checkbox.checked||!proof;});
  const choices=()=>{
    const options=[...previewBox.querySelectorAll("select[data-uid]")];
    return options.map(sel=>{
      const [action,location_id,revision]=sel.value.split("|");
      const decision={uid:sel.dataset.uid,action};
      if(location_id)decision.location_id=location_id;
      if(action==="replace")decision.expected_revision=Number(revision);
      return decision;
    });
  };
  const loadPreview=async()=>{
    if(busy)return;
    setBusy(true);
    try{
      proof=null;confirm.hidden=true;sqlLoaded=false;sqlEntries.length=0;sqlPreviewBox.replaceChildren();
      preview=await call("migration_preview");
      previewBox.replaceChildren();todoEntries.length=0;
      suggestButton.hidden=true;
      const summary=document.createElement("p");
      const archivedCount=(preview.candidates||[]).filter(x=>x.status==="completed").length;
      summary.textContent=`Quelle: ${preview.total} Einträge · gültig: ${preview.valid} · davon archiviert: ${archivedCount} · nicht importierbar: ${preview.invalid}`;
      previewBox.append(summary);
      const audit=document.createElement("p");audit.className="note";
      audit.textContent=`Bestandsabgleich: ${preview.safe_existing_suggestions||0} eindeutige Übereinstimmungen von ${preview.valid} Standorten. Doppelte Koordinaten und abweichender Archivstatus bleiben zur manuellen Prüfung offen.`;
      previewBox.append(audit);
      if(preview.invalid){
        const warning=document.createElement("p");
        warning.className="warning";
        warning.textContent="Ungültige oder fremde Einträge verhindern die vollständige Finalisierung. Bitte diese zunächst einzeln prüfen und korrigieren.";
        previewBox.append(warning);
      }
      // Existing locations and revisions are used ONLY as explicit options.
      const existing=await call("locations_list",{limit:100});
      const byId=new Map((existing.locations||[]).map(x=>[x.location_id,x]));
      for(const candidate of preview.candidates){
        const node=document.createElement("div");node.className="entry";
        const label=document.createElement("label");
        label.textContent=candidate.name+" · "+candidate.lat+", "+candidate.lon+(candidate.status==="completed"?" · Archiviert (bleibt archiviert)":"");
        const sel=document.createElement("select");sel.dataset.uid=candidate.uid;
        const option=(name,value)=>{const el=document.createElement("option");el.textContent=name;el.value=value;sel.append(el);};
        const hasConflict=!!(candidate.source_coordinate_duplicate||candidate.name_conflicts?.length||candidate.coordinate_matches?.length);
        option(hasConflict?"Manuell prüfen – vorerst überspringen":"Neuen Ort importieren",hasConflict?"skip":"create");
        if(hasConflict)option("Neuen Ort trotzdem importieren","create");
        for(const id of candidate.exact_matches||[]){
          if(byId.has(id))option("Bestehenden Ort übernehmen: "+byId.get(id).name+" · "+id.slice(0,8),"use_existing|"+id);
        }
        // No "use_existing" choice for divergent names, coordinates or
        // archived states; such places require explicit manual remediation.
        for(const id of candidate.name_conflicts||[]){
          const location=byId.get(id);
          if(location)option("Ort ersetzen: "+location.name,"replace|"+id+"|"+location.revision);
        }
        if(!hasConflict)option("Überspringen (verhindert abschließende Leerung)","skip");
        node.append(label,sel);previewBox.append(node);todoEntries.push({el:node,name:candidate.name});
      }
      suggestButton.hidden=!(preview.safe_existing_suggestions>0);
      renderFilter();
      status(preview.invalid?"Import/Leerung gesperrt, bis alle ungültigen Einträge geklärt sind.":"Wähle die Behandlung jedes Standorts und bestätige den Import.");
    }catch(error){preview=null;fail(error);}
    finally{setBusy(false);}
  };
  suggestButton.addEventListener("click",()=>{
    if(busy||!preview)return;
    const matches=new Map(preview.candidates
      .filter(x=>typeof x.suggested_existing_id==="string"&&x.suggested_existing_id)
      .map(x=>[x.uid,x.suggested_existing_id]));
    let selected=0;
    for(const select of previewBox.querySelectorAll("select[data-uid]")){
      const id=matches.get(select.dataset.uid);
      if(!id)continue;
      const desired="use_existing|"+id;
      if([...select.options].some(option=>option.value===desired)){
        select.value=desired;selected++;
      }
    }
    status(`${selected} eindeutige Bestandsorte zur Übernahme vorgemerkt – noch kein Import durchgeführt. Prüfe übrige manuelle Zuordnungen vor „Auswahl importieren“.`);
  });
  const importSelected=async()=>{
    if(busy||!preview||preview.invalid)return;
    setBusy(true);
    try{
      const decisions=choices();
      if(decisions.length!==preview.valid)throw Error("Unvollständige Auswahl");
      if(decisions.some(x=>x.action==="skip"))throw Error("Übersprungene Orte verhindern den vollständigen Abschluss");
      const result=await call("migration_commit",
        {preview_id:preview.preview_id,decisions},migrationRequestUUID());
      sqlLoaded=false;sqlEntries.length=0;sqlPreviewBox.replaceChildren();
      status(`Import bestätigt: ${result.imported?.length||0} Standorte. Die alte Liste ist weiterhin vorhanden. Prüfe jetzt die Finalisierung.`);
      importButton.disabled=true;suggestButton.hidden=true;
      preview=null;
    }catch(error){fail(error);}finally{setBusy(false);}
  };
  const openSqlPreview=async()=>{
    if(busy)return;
    setBusy(true);
    sqlLoaded=false;
    sqlEntries.length=0;sqlPreviewBox.replaceChildren();
    const progress=document.createElement("p");
    progress.textContent="Lese SQLite-Daten …";
    sqlPreviewBox.append(progress);
    try{
      // The WebSocket endpoint verifies the current Vault profile on every page.
      // Read only: no mutation or idempotency key; migration_pending remains authoritative.
      const rows=[],ids=new Set();
      let cursor=null;
      for(let page=0;page<20;page++){
        const result=await call("places_list",{limit:100,include_archived:true,...(cursor?{cursor}:{})});
        if(!Array.isArray(result?.places)||!["migration_pending","db_active"].includes(result.mode))
          throw new Error("Unerwartete SQLite-Antwort");
        for(const item of result.places){
          if(ids.has(item.location_id))throw new Error("Doppelte SQLite-ID");
          ids.add(item.location_id);rows.push(item);
        }
        if(!result.next_cursor){cursor=null;break;}
        if(result.next_cursor===cursor||!ids.has(result.next_cursor))throw new Error("Ungültige SQLite-Seitennummer");
        cursor=result.next_cursor;
      }
      if(cursor)throw new Error("SQLite-Vorschau begrenzt – mehr als 2000 Standorte");
      const summary=summarizeSqlitePreview(rows);
      sqlPreviewBox.replaceChildren();
      const heading=document.createElement("strong");
      heading.textContent="SQLite-Kontrollansicht (schreibgeschützt)";
      const count=document.createElement("p");
      count.textContent=`SQLite: ${summary.total} Standorte · aktiv: ${summary.active.length} · archiviert: ${summary.archived.length}`;
      const compare=document.createElement("p");compare.className="note";
      if(preview?.valid===summary.total){
        compare.textContent="Anzahl entspricht der gültigen To-do-Quelle. Inhaltliche Finalisierungsprüfung bleibt separat erforderlich.";
      }else if(preview){
        compare.textContent=`Abweichende Anzahl: Local To-do ${preview.valid}, SQLite ${summary.total}. Nicht finalisieren, bevor die Abweichung geklärt ist.`;
        compare.className="warning";
      }else{
        compare.textContent="Die ursprüngliche To-do-Liste bleibt maßgeblich, bis die separate Finalisierung bestätigt wird.";
      }
      // One shared filter controls both independent views; SQL remains read-only.
      for(const [label,items] of [["Aktiv",summary.active],["Archiviert",summary.archived]]){
        const group=document.createElement("details");group.open=label==="Aktiv";
        const title=document.createElement("summary");
        title.textContent=`${label}: ${items.length}`;
        group.append(title);
        const area=document.createElement("div");
        items.forEach(item=>{
          const el=document.createElement("div");el.className="sql-row";
          const name=document.createElement("span");name.textContent=item.name;
          const coordinates=document.createElement("small");
          coordinates.textContent=`${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)} · ${item.location_origin||"unknown"} · Revision ${item.revision}`;
          el.append(name,coordinates);area.append(el);
          sqlEntries.push({el,name:item.name});
        });
        if(!items.length){const empty=document.createElement("p");empty.textContent="Keine Standorte";area.append(empty);}
        group.append(area);sqlPreviewBox.append(group);
      }
      sqlPreviewBox.prepend(heading,count,compare);
      sqlLoaded=true;renderFilter();
    }catch(error){
      sqlPreviewBox.replaceChildren();
      const warning=document.createElement("p");warning.className="warning";
      warning.textContent="SQLite-Vorschau fehlgeschlagen: "+(error?.code||error?.message||"Unbekannter Fehler");
      sqlPreviewBox.append(warning);
    }finally{setBusy(false);}
  };
  const prepareFinalize=async()=>{
    if(busy)return;
    setBusy(true);
    try{
      proof=await call("migration_finalize_preview");
      if(proof?.source_and_sqlite_verified!==true || proof?.requires_admin!==true ||
         proof?.explicit_confirmation_required!==true ||
         !Number.isInteger(proof.item_count) || proof.item_count<0 ||
         (proof.item_count===0 && proof.resume!==true) ||
         !Number.isInteger(proof.active_count) || !Number.isInteger(proof.archived_count) ||
         proof.active_count<0 || proof.archived_count<0 ||
         proof.active_count+proof.archived_count!==proof.item_count ||
         typeof proof.nonce!=="string" || !proof.nonce)
        throw new Error("Unvollständige Sicherheitsprüfung – keine Freigabe zur Leerung");
      confirm.hidden=false;
      checkbox.checked=false;
      status(`SQLite und Quelle verifiziert: ${proof.item_count} Einträge · aktiv: ${proof.active_count} · archiviert: ${proof.archived_count}. Die alte Liste bleibt bis zur ausdrücklichen Administratorbestätigung vollständig bestehen. Die Liste selbst wird nicht gelöscht.`);
    }catch(error){proof=null;confirm.hidden=true;fail(error);}finally{setBusy(false);}
  };
  const finalize=async()=>{
    if(busy||!checkbox.checked||!proof)return;
    setBusy(true);
    try{
      const result=await call("migration_finalize_commit",
        {nonce:proof.nonce,explicit_final:true},migrationRequestUUID());
      if(result.mode!=="db_active")throw Error("db_active nicht bestätigt");
      status(`Erfolgreich abgeschlossen: ${result.items_removed} Einträge entfernt. Die Local-To-do-Liste bleibt erhalten.`);
      close();
      await owner._openMigrationCleanupHelp?.();
    }catch(error){fail(error);}finally{setBusy(false);}
  };
  previewButton.addEventListener("click",()=>{void (currentView==="sql"?openSqlPreview():loadPreview());});
  importButton.addEventListener("click",()=>{void importSelected();});
  finalizeButton.addEventListener("click",()=>{void prepareFinalize();});
  todoPreviewButton.addEventListener("click",()=>{if(!busy)switchView("todo");});
  sqlPreviewButton.addEventListener("click",()=>{if(busy)return;switchView("sql");if(!sqlLoaded)void openSqlPreview();});
  removeButton.addEventListener("click",()=>{void finalize();});
  owner.shadow.append(shell);
  dialog.show();
  switchView("todo");
  void loadPreview();
  return dialog;
}

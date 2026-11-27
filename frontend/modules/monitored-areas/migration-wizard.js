// MA-020 migration workflow: explicit decisions and separate destructive confirmation.
// A request UUID is required for server-side idempotency. Browsers in a non-secure
// HA context may expose getRandomValues but not randomUUID; never use Math.random.
const MA_PREMIUM_CLOSE = new URL("../../assets/gewitterradar-about-close-premium.webp", import.meta.url).href;

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
  const shell = document.createElement("div");
  shell.innerHTML = `<style>
    .gr-ma-wizard{box-sizing:border-box;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);margin:0;z-index:2147483601;width:min(660px,calc(100vw - 20px));height:min(820px,calc(100dvh - 24px));max-height:calc(100dvh - 24px);overflow:hidden;padding:0;display:flex;flex-direction:column;border:2px solid #d7b87b;border-radius:16px;background:linear-gradient(155deg,#263b4d,#0c1722 72%);color:#e7ecf1;box-shadow:0 15px 60px #000c;font:14px/1.5 Segoe UI,Arial,sans-serif}
    .gr-ma-wizard h2{margin:0 35px 12px 0;color:#f3dfb1;font-size:21px}.gr-ma-wizard p{margin:8px 0}
    .gr-ma-wizard .wizard-header{flex:0 0 auto;position:relative;padding:16px 70px 12px 18px;background:linear-gradient(130deg,#29465b,#152637);border-bottom:1px solid #8e744b;z-index:2}
    .gr-ma-wizard .wizard-header h2{margin-bottom:7px}
    .gr-ma-wizard .wizard-header p{margin:0;font-size:12px;color:#c5d5e0}
    .gr-ma-wizard .wizard-content{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:13px 18px;scrollbar-gutter:stable;contain:paint}
    .gr-ma-wizard .wizard-footer{flex:0 0 auto;position:relative;padding:11px 18px 14px;background:#152838;border-top:1px solid #8e744b;z-index:2}
    .gr-ma-wizard .wizard-footer [role=status]{max-height:5.5em;overflow-y:auto}
    .gr-ma-wizard .close{position:absolute;right:13px;top:12px;width:44px;height:44px;display:grid;place-items:center;padding:4px!important;border:0!important;background:transparent!important;cursor:pointer;touch-action:manipulation}
    .gr-ma-wizard .close img{display:block;width:36px;height:36px;object-fit:contain;filter:grayscale(1) brightness(1.4) contrast(.85);pointer-events:none}
    .gr-ma-wizard .close:hover img{filter:grayscale(1) brightness(1.7) contrast(.9)}
    .gr-ma-wizard .close:focus-visible{outline:2px solid #fff0ba;outline-offset:3px}
    @media(max-width:540px){.gr-ma-wizard .wizard-header{padding:12px 63px 9px 13px}.gr-ma-wizard .wizard-content{padding:10px 12px}.gr-ma-wizard .wizard-footer{padding:8px 12px 11px}.gr-ma-wizard .close{right:11px;top:10px;width:40px;height:40px}}
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
  </style><dialog class="gr-ma-wizard" aria-label="Standortübernahme">
    <header class="wizard-header">
      <button type="button" class="close" aria-label="Schließen"><img src="${MA_PREMIUM_CLOSE}" alt="" draggable="false"></button>
      <h2>Standorte aus Local To-do übernehmen</h2>
      <p>Die alte Liste bleibt bis zur gesonderten Administratorbestätigung bestehen.</p>
    </header>
    <div class="wizard-content" tabindex="0" role="region" aria-label="Standortliste und SQLite-Kontrollansicht">
      <div class="preview"></div>
      <section class="sql-preview" hidden aria-label="SQLite-Kontrollansicht"></section>
    </div>
    <footer class="wizard-footer">
      <div class="controls">
        <button type="button" data-preview>Vorschau aktualisieren</button>
        <button type="button" data-import disabled>Auswahl importieren</button>
        <button type="button" data-sql-preview>SQLite-Daten ansehen (nur lesen)</button>
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
  const finalizeButton=dialog.querySelector("[data-finalize]");
  const sqlPreviewButton=dialog.querySelector("[data-sql-preview]"),sqlPreviewBox=dialog.querySelector(".sql-preview");
  const removeButton=dialog.querySelector("[data-remove]");
  const confirm=dialog.querySelector(".confirm"),checkbox=confirm.querySelector("input");
  let preview=null, proof=null, busy=false;
  const status=(value,error=false)=>{feedback.textContent=value;feedback.className=error?"warning":"";};
  const fail=error=>status("Aktion nicht abgeschlossen: "+(error?.code||error?.message||"Unbekannter Fehler"),true);
  const setBusy=value=>{
    busy=value;
    previewButton.disabled=value;
    importButton.disabled=value||!preview||preview.invalid>0||!preview.valid;
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
      proof=null;confirm.hidden=true;sqlPreviewBox.hidden=true;sqlPreviewBox.replaceChildren();
      preview=await call("migration_preview");
      previewBox.replaceChildren();
      const summary=document.createElement("p");
      const archivedCount=(preview.candidates||[]).filter(x=>x.status==="completed").length;
      summary.textContent=`Quelle: ${preview.total} Einträge · gültig: ${preview.valid} · davon archiviert: ${archivedCount} · nicht importierbar: ${preview.invalid}`;
      previewBox.append(summary);
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
        for(const id of candidate.coordinate_matches||[]){
          if(byId.has(id))option("Bestehenden Ort übernehmen: "+byId.get(id).name,"use_existing|"+id);
        }
        for(const id of candidate.name_conflicts||[]){
          const location=byId.get(id);
          if(location)option("Ort ersetzen: "+location.name,"replace|"+id+"|"+location.revision);
        }
        if(!hasConflict)option("Überspringen (verhindert abschließende Leerung)","skip");
        node.append(label,sel);previewBox.append(node);
      }
      status(preview.invalid?"Import/Leerung gesperrt, bis alle ungültigen Einträge geklärt sind.":"Wähle die Behandlung jedes Standorts und bestätige den Import.");
    }catch(error){preview=null;fail(error);}
    finally{setBusy(false);}
  };
  const importSelected=async()=>{
    if(busy||!preview||preview.invalid)return;
    setBusy(true);
    try{
      const decisions=choices();
      if(decisions.length!==preview.valid)throw Error("Unvollständige Auswahl");
      if(decisions.some(x=>x.action==="skip"))throw Error("Übersprungene Orte verhindern den vollständigen Abschluss");
      const result=await call("migration_commit",
        {preview_id:preview.preview_id,decisions},migrationRequestUUID());
      sqlPreviewBox.hidden=true;sqlPreviewBox.replaceChildren();
      status(`Import bestätigt: ${result.imported?.length||0} Standorte. Die alte Liste ist weiterhin vorhanden. Prüfe jetzt die Finalisierung.`);
      importButton.disabled=true;
      preview=null;
    }catch(error){fail(error);}finally{setBusy(false);}
  };
  const openSqlPreview=async()=>{
    if(busy)return;
    setBusy(true);
    sqlPreviewBox.hidden=false;
    sqlPreviewBox.replaceChildren();
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
      const search=document.createElement("input");search.type="search";
      search.placeholder="SQLite-Standorte filtern (z. B. burg)";
      search.setAttribute("aria-label","SQLite-Standorte filtern");
      const groups=[];
      for(const [label,items] of [["Aktiv",summary.active],["Archiviert",summary.archived]]){
        const group=document.createElement("details");group.open=label==="Aktiv";
        const title=document.createElement("summary");
        title.textContent=`${label}: ${items.length}`;
        group.append(title);
        const area=document.createElement("div");
        const entries=items.map(item=>{
          const el=document.createElement("div");el.className="sql-row";
          const name=document.createElement("span");name.textContent=item.name;
          const coordinates=document.createElement("small");
          coordinates.textContent=`${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)} · ${item.location_origin||"unknown"} · Revision ${item.revision}`;
          el.append(name,coordinates);area.append(el);
          return {el,searchText:item.name.toLocaleLowerCase()};
        });
        if(!items.length){const empty=document.createElement("p");empty.textContent="Keine Standorte";area.append(empty);}
        group.append(area);groups.push(entries);sqlPreviewBox.append(group);
      }
      search.addEventListener("input",()=>{
        const term=search.value.trim().toLocaleLowerCase();
        for(const entries of groups)for(const {el,searchText} of entries)
          el.hidden=!searchText.includes(term);
      });
      sqlPreviewBox.prepend(heading,count,compare,search);
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
  previewButton.addEventListener("click",()=>{void loadPreview();});
  importButton.addEventListener("click",()=>{void importSelected();});
  finalizeButton.addEventListener("click",()=>{void prepareFinalize();});
  sqlPreviewButton.addEventListener("click",()=>{void openSqlPreview();});
  removeButton.addEventListener("click",()=>{void finalize();});
  owner.shadow.append(shell);
  dialog.show();
  void loadPreview();
  return dialog;
}

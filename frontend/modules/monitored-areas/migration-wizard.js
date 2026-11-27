// MA-020 migration workflow: explicit decisions and separate destructive confirmation.
// A request UUID is required for server-side idempotency. Browsers in a non-secure
// HA context may expose getRandomValues but not randomUUID; never use Math.random.
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
export async function openMigrationWizard(owner) {
  const hass = owner.hass || owner._hass || owner._vaultHass;
  const profileId = owner._settingsVault?.profile?.id;
  if (!hass?.callWS || !profileId || !owner.shadow) return null;
  const call = (op,payload={},requestId=null) => hass.callWS({
    type:"gewitterradar/monitored_areas/"+op,schema:1,
    request:{profile_id:profileId,payload,...(requestId?{request_id:requestId}:{})}
  });
  const shell = document.createElement("div");
  shell.innerHTML = `<style>
    .gr-ma-wizard{box-sizing:border-box;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);margin:0;z-index:2147483601;width:min(660px,calc(100vw - 20px));max-height:calc(100dvh - 24px);overflow:auto;padding:20px;border:2px solid #d7b87b;border-radius:16px;background:linear-gradient(155deg,#263b4d,#0c1722 72%);color:#e7ecf1;box-shadow:0 15px 60px #000c;font:14px/1.5 Segoe UI,Arial,sans-serif}
    .gr-ma-wizard h2{margin:0 35px 12px 0;color:#f3dfb1;font-size:21px}.gr-ma-wizard p{margin:8px 0}
    .gr-ma-wizard .close{position:absolute;right:8px;top:7px;font-size:24px;background:none;border:0}
    .gr-ma-wizard button,.gr-ma-wizard select{background:#233a4b;color:#f4e5c9;border:1px solid #b99b68;border-radius:7px;padding:9px}
    .gr-ma-wizard button:disabled{opacity:.4}.gr-ma-wizard .entry{padding:9px;margin:6px 0;border:1px solid #708ca066;border-radius:8px}
    .gr-ma-wizard .entry label{display:block;font-weight:600}.gr-ma-wizard .entry select{width:100%;margin-top:5px}
    .gr-ma-wizard .controls{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:15px}
    .gr-ma-wizard [role=status]{white-space:pre-wrap;color:#f3d18a}
    .gr-ma-wizard .warning{color:#ffb4a5}.gr-ma-wizard .confirm{margin:14px 0}
  </style><dialog class="gr-ma-wizard" aria-label="Standortübernahme">
    <button type="button" class="close" aria-label="Schließen">×</button>
    <h2>Standorte aus Local To-do übernehmen</h2>
    <p>Alle Standorte werden vor einer möglichen Leerung in SQLite geprüft. Die alte Liste bleibt bis zur gesonderten Administratorbestätigung bestehen.</p>
    <div class="preview"></div><div class="controls">
      <button type="button" data-preview>Vorschau aktualisieren</button>
      <button type="button" data-import disabled>Auswahl importieren</button>
      <button type="button" data-finalize>Finalisierung prüfen</button>
    </div><div class="confirm" hidden>
      <label><input type="checkbox"> Ich bestätige die dauerhafte Entfernung aller erfolgreich übernommenen Einträge aus der alten Local-To-do-Liste.</label>
      <button type="button" data-remove disabled>Jetzt Einträge leeren</button>
    </div>
    <p role="status" aria-live="polite"></p>
  </dialog>`;
  const dialog = shell.querySelector("dialog");
  const previewBox=dialog.querySelector(".preview");
  const feedback=dialog.querySelector("[role=status]");
  const previewButton=dialog.querySelector("[data-preview]");
  const importButton=dialog.querySelector("[data-import]");
  const finalizeButton=dialog.querySelector("[data-finalize]");
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
      proof=null;confirm.hidden=true;
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
      status(`Import bestätigt: ${result.imported?.length||0} Standorte. Die alte Liste ist weiterhin vorhanden. Prüfe jetzt die Finalisierung.`);
      importButton.disabled=true;
      preview=null;
    }catch(error){fail(error);}finally{setBusy(false);}
  };
  const prepareFinalize=async()=>{
    if(busy)return;
    setBusy(true);
    try{
      proof=await call("migration_finalize_preview");
      confirm.hidden=false;
      checkbox.checked=false;
      status(`SQLite und Quelle verifiziert: ${proof.item_count} Einträge. Nur mit Administratorberechtigung und ausdrücklicher Bestätigung wird die alte Liste geleert; die Liste selbst bleibt bestehen.`);
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
  removeButton.addEventListener("click",()=>{void finalize();});
  owner.shadow.append(shell);
  dialog.show();
  void loadPreview();
  return dialog;
}

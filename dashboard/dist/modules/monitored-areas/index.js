// MA-020: optional, profile-owned cleanup reminder. Never acts on To-do data.
import { registerModule } from "../core/registry.js?v=4141r1";
import { openMigrationWizard } from "./migration-wizard.js?v=41414r1";
export const MODULE_META=Object.freeze({"id":"monitored-areas.lifecycle","version":"0.2.1","group":"Monitored Areas","function":"Optional lifecycle","subfunctions":["Initialize","Teardown","Migration cleanup reminder"],"file":"modules/monitored-areas/index.js","optional":true});
registerModule(MODULE_META);
const MA_PREMIUM_CLOSE = new URL("../../assets/gewitterradar-about-close-premium.webp", import.meta.url).href;
export const CLEANUP_DISMISSED = "gewitterradar-ma020-cleanup-dismissed";
export const LEGACY_LIST = "todo.gewitterradar_orte";
const active = new WeakMap();

const COPY = Object.freeze({
  de: {
    title:"Standortübernahme erfolgreich",
    text:"Alle gespeicherten Standorte wurden erfolgreich in GewitterRadar übernommen. Die bisherige To-do-Liste wurde vollständig geleert und wird nicht mehr benötigt.",
    lead:"So entfernst du die alte Liste:",
    steps:[
      "Öffne in Home Assistant Einstellungen.",
      "Wähle Geräte & Dienste → Integrationen.",
      "Öffne die Integration Local To-do.",
      "Suche die Liste „GewitterRadar Orte“.",
      "Öffne das Drei-Punkte-Menü (⋮) dieses Eintrags und wähle Löschen.",
      "Bestätige das Entfernen."
    ],
    hint:"Die neue Standortverwaltung bleibt davon unberührt. Entferne ausschließlich die alte Liste „GewitterRadar Orte“, nicht andere To-do-Listen.",
    dismiss:"Nicht mehr anzeigen", confirm:"Verstanden", close:"Schließen",
    error:"Die Einstellung konnte nicht dauerhaft gespeichert werden. Bitte erneut versuchen."
  },
  en: {
    title:"Saved locations successfully migrated",
    text:"All saved locations were imported into GewitterRadar. The previous Local To-do list is now empty and no longer needed.",
    lead:"To remove the old list manually:",
    steps:[
      "Open Settings in Home Assistant.",
      "Select Devices & services → Integrations.",
      "Open the Local To-do integration.",
      "Find the list named „GewitterRadar Orte“.",
      "Open its three-dot menu (⋮) and select Delete.",
      "Confirm the removal."
    ],
    hint:"Your new GewitterRadar location records are unaffected. Remove only the former „GewitterRadar Orte“ list, not other To-do lists.",
    dismiss:"Don't show again", confirm:"Understood", close:"Close",
    error:"The preference could not be saved. Please retry."
  }
});

export function cleanupReminderReady({mode,listPresent,dismissed}) {
  return mode === "db_active" && listPresent === true && dismissed !== true;
}

export function initializeMonitoredAreas(owner, enabled = false) {
  if (enabled !== true) return null;
  let runtime = active.get(owner);
  if (runtime) return runtime;
  let stopped = false, checkedProfile = null, checking = false, interval = null, dialog = null, attempts = 0;
  let shadow = null;
  const vault = () => owner._settingsVault;
  const hass = () => owner.hass || owner._hass || owner._vaultHass;
  const profile = () => vault()?.profile?.id || null;
  const storageReady = () => vault()?.keys?.has(CLEANUP_DISMISSED) && vault()?.profile;
  const exists = () => {
    const state = hass()?.states?.[LEGACY_LIST];
    return state && !["unknown","unavailable"].includes(state.state);
  };
  const close = () => {
    if (dialog?.open) dialog.close();
    shadow?.remove();
    shadow = null;
    dialog = null;
  };
  const show = () => {
    if (stopped || dialog?.open || !owner.shadow || !storageReady()) return;
    const t = COPY[/Deutsch|Boarisch|Platt|Sächs|Schwäb/i.test(owner._languageValue?.() || "Deutsch")?"de":"en"];
    const MA_CLOSE_MATCH_SETTINGS = owner.shadow.getElementById("settings-close")?.querySelector("img")?.src || MA_PREMIUM_CLOSE;
    shadow = document.createElement("div");
    shadow.className="gr-ma-cleanup-wrapper";
    shadow.innerHTML = `<style>
      .gr-ma-cleanup{box-sizing:border-box;width:min(610px,calc(100vw - 24px));max-height:calc(100dvh - 28px);overflow:auto;position:fixed;inset:auto;top:50%;left:50%;transform:translate(-50%,-50%);margin:0;padding:22px;border:1px solid rgba(201,160,80,.34);border-radius:22px;background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%),linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995));color:#e6eaf0;font:14px/1.5 Segoe UI,Arial,sans-serif;box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,235,184,.055),inset 0 1px rgba(255,244,213,.08),0 0 30px rgba(207,159,60,.065);z-index:2147483600}
      .gr-ma-cleanup h2{font-size:22px;color:#f4dfad;margin:0 0 12px;line-height:1.2}.gr-ma-cleanup p{margin:8px 0 13px}
      .gr-ma-cleanup ol{padding-left:24px;margin:8px 0 14px}.gr-ma-cleanup li{padding:2px 0}
      .gr-ma-cleanup strong{color:#f4dfad}.gr-ma-cleanup .ma-note{padding:10px 12px;border:1px solid #9eb5c462;border-radius:9px;background:#142a396e}
      .gr-ma-cleanup footer{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-top:16px}.gr-ma-cleanup label{display:flex;align-items:center;gap:8px;cursor:pointer}
      .gr-ma-cleanup input{width:18px;height:18px;accent-color:#d9ba7e}.gr-ma-cleanup button{border:1px solid #d2b078;border-radius:9px;padding:9px 18px;color:#ffecbd;background:linear-gradient(#37485a,#142331);cursor:pointer;font-weight:700}
      .gr-ma-cleanup button:focus-visible,.gr-ma-cleanup input:focus-visible{outline:2px solid #ffe8ae;outline-offset:3px}
      .gr-ma-cleanup .ma-close{position:absolute;right:9px;top:8px;display:grid;place-items:center;width:44px;height:44px;min-width:44px;min-height:44px;border-radius:8px;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;cursor:pointer}
      .gr-ma-cleanup .ma-close img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}
      @media(hover:hover) and (pointer:fine){.gr-ma-cleanup .ma-close:hover img{filter:brightness(1.12) drop-shadow(0 0 2px #dba34c70)}}.gr-ma-cleanup .ma-close:active img{transform:scale(.97);filter:brightness(.92)}.gr-ma-cleanup [role=status]{color:#ffbeae;font-size:12px}
    </style>
    <dialog class="gr-ma-cleanup" aria-labelledby="gr-ma-cleanup-title">
      <button type="button" class="ma-close" aria-label="${t.close}"><img src="${MA_CLOSE_MATCH_SETTINGS}" alt="" draggable="false"></button>
      <h2 id="gr-ma-cleanup-title">✓ ${t.title}</h2>
      <p>${t.text}</p><strong>${t.lead}</strong>
      <ol>${t.steps.map(s=>'<li>'+s+'</li>').join('')}</ol>
      <p class="ma-note">ⓘ ${t.hint}</p>
      <footer><label><input type="checkbox"><span>${t.dismiss}</span></label>
      <button type="button" class="ma-confirm">${t.confirm}</button></footer>
      <p role="status" aria-live="polite"></p>
    </dialog>`;
    dialog = shadow.querySelector("dialog");
    const currentVault = vault();
    const currentProfile = profile();
    const checkbox = dialog.querySelector("input");
    const status = dialog.querySelector("[role=status]");
    checkbox.checked = currentVault.getItem(CLEANUP_DISMISSED) === "1";
    dialog.querySelector(".ma-close").addEventListener("click", close);
    dialog.querySelector(".ma-confirm").addEventListener("click", async () => {
      const client = vault();
      if (stopped || !client || client !== currentVault || profile() !== currentProfile) return;
      try {
        const expected = checkbox.checked ? "1" : null;
        const previous = client.getItem(CLEANUP_DISMISSED);
        if (previous !== expected) {
          if (expected) client.setItem(CLEANUP_DISMISSED, "1");
          else client.removeItem(CLEANUP_DISMISSED);
          if (await client.flush() !== true) throw new Error("vault_write_failed");
        }
        close();
      } catch {
        status.textContent = t.error;
      }
    });
    owner.shadow.append(shadow);
    dialog.show(); // Non-modal: the underlying map remains operable.
    dialog.addEventListener("close", () => { shadow?.remove(); shadow=null; dialog=null; }, {once:true});
  };
  const refresh = async ({manual=false}={}) => {
    if (stopped || checking || !owner.isConnected || !storageReady()) return;
    const pid = profile();
    if (!manual && checkedProfile === pid) return;
    const client = vault(), transport = hass();
    if (!transport?.callWS || !transport.user?.id) return;
    checking = true;
    try {
      const status = await transport.callWS({
        type:"gewitterradar/monitored_areas/status",schema:1,
        request:{profile_id:pid,payload:{}}
      });
      if (stopped || profile() !== pid || vault() !== client) return;
      const mode = status?.capabilities?.saved_places_mode;
      if (mode !== "db_active") {
        // Startup is checked once; the wizard explicitly reopens after cutover.
        if (mode === "migration_pending") checkedProfile = pid;
        if (interval && checkedProfile) {clearInterval(interval);interval=null;}
        return;
      }
      const present = exists();
      if (present == null) return;
      if (!manual) checkedProfile = pid;
      if (manual || cleanupReminderReady({mode,listPresent:present,
                                           dismissed:client.getItem(CLEANUP_DISMISSED)==="1"})) {
        if (present) show();
      }
      if (checkedProfile && interval) {clearInterval(interval);interval=null;}
    } catch {
      // Backend unavailable: no invented migration success.
    } finally {
      checking = false;
    }
  };
  const openWorkflow = async () => {
    if (stopped || !storageReady()) return;
    const transport = hass(), pid = profile();
    if (!transport?.callWS || !pid) return;
    try {
      const status = await transport.callWS({
        type:"gewitterradar/monitored_areas/status",schema:1,
        request:{profile_id:pid,payload:{}}
      });
      if (status?.capabilities?.saved_places_mode === "db_active")
        return refresh({manual:true});
      return openMigrationWizard(owner);
    } catch {
      // No false success dialog when the backend cannot be verified.
    }
  };
  const helpLink = event => {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [event.target];
    if (!path.some(node => node?.id === "settings-help")) return;
    queueMicrotask(() => {
      if (stopped) return;
      const topics = owner.shadow?.getElementById("gr-help-standard-topics");
      if (!topics || topics.querySelector("[data-ma020-cleanup-help]")) return;
      const link = document.createElement("button");
      link.type = "button";
      link.dataset.ma020CleanupHelp = "true";
      link.textContent = "Standortübernahme · Local To-do";
      link.style.cssText = "display:block;width:100%;min-height:44px;margin:0 0 12px;padding:10px 14px;border:1px solid #c7a15c;border-radius:9px;background:linear-gradient(#25323b,#101a22);color:#f5dc9e;font-size:14px;font-weight:600;cursor:pointer;text-align:start";
      link.addEventListener("click", () => {
        owner._closeHelp?.(false);
        void openWorkflow();
      });
      topics.prepend(link);
    });
  };
  const mutableOwner = Object.isExtensible(owner);
  if (mutableOwner) {
    owner.shadow?.addEventListener("click", helpLink, true);
    owner._openMigrationCleanupHelp = () => openWorkflow();
  }
  runtime = Object.freeze({
    get status() {return stopped?"stopped":"ready";},
    refresh,
    teardown() {
      if (stopped) return;
      stopped = true;
      if (interval) clearInterval(interval);
      if (mutableOwner) owner.shadow?.removeEventListener("click", helpLink, true);
      close();
      if (mutableOwner && owner._openMigrationCleanupHelp) delete owner._openMigrationCleanupHelp;
      if (active.get(owner) === runtime) active.delete(owner);
    }
  });
  active.set(owner,runtime);
  // The optional card can mount before Vault has resolved its HA profile.
  if (mutableOwner && owner.shadow && hass()) interval = setInterval(() => {
    if (stopped || checkedProfile || ++attempts > 20) {
      if(interval)clearInterval(interval);
      interval=null;
      return;
    }
    void refresh();
  },1500);
  void refresh();
  return runtime;
}

import {premiumEscape} from '../weather/premium-ui.js?v=41216r1';

export const FIRST_STEPS_DISMISSED = 'gewitterradar-first-steps-dismissed';
const INFO_ICON = new URL('../../assets/gewitterradar-help-info-premium-v1.webp', import.meta.url).href;
const TEXT = {
  de: {
    intro:'Deine Einrichtung auf einen Blick. Erledigte Schritte werden grün und erhalten ein Häkchen.',
    installed:'Blitzortung Integration installiert',
    linked:'Blitzortung Location: GewitterRadar Tracker',
    recorder:'configuration.yaml: Recorder-Ausschlüsse',
    todo:'Local To-do: „Gewitterradar Orte“ erstellt',
    installedHelp:'Home Assistant → Einstellungen → Geräte & Dienste → Blitzortung hinzufügen.',
    linkedHelp:'In Blitzortung als „Location entity“ den GewitterRadar-Tracker wählen: nativ device_tracker.gewitterradar, Dashboard device_tracker.gewitterradar_dashboard.',
    recorderHelp:'Die vier Blitzquellen im vorhandenen recorder:-Abschnitt ausschließen und Home Assistant neu starten. Die Live-Blitzdaten bleiben verfügbar.',
    recorderAdmin:'HA-Administratorrechte erforderlich',
    todoHelp:'Einstellungen → Geräte & Dienste → Integration hinzufügen → Local to-do. Die Liste exakt „Gewitterradar Orte“ nennen.',
    installedWhy:'Die Blitzortung.org-Integration liefert die Blitzereignisse, die GewitterRadar auf der Karte auswerten und darstellen kann.',
    linkedWhy:'Die Zuordnung zum GewitterRadar-Tracker legt den Bezugsstandort fest, für den Blitzortung.org Entfernungen und Richtungen ermittelt.',
    recorderWhy:'Dringend empfohlen: Die von Blitzortung.org gemeldeten Blitzeinschläge können sehr viele Zustandsänderungen erzeugen und die Home-Assistant-Datenbank massiv anwachsen lassen. Die Empfehlung bezieht sich auf die Blitzdaten von Blitzortung.org – nicht auf eine von GewitterRadar verursachte Datenflut. Die Live-Blitzdaten bleiben erhalten.',
    todoWhy:'GewitterRadar verwendet die Local-To-do-Liste „Gewitterradar Orte“ als zentralen Speicher für Deine gespeicherten Ortsfavoriten, etwa Städte und Länder. Ohne diese Liste steht die Ortssuche mit Favoritenspeicherung nicht vollständig zur Verfügung.',
    whyLabel:'Warum ist das sinnvoll?',
    refresh:'Erneut prüfen', checking:'Einrichtung wird geprüft …',
    unknown:'Nicht automatisch prüfbar. Bitte die Einrichtung in Home Assistant kontrollieren.',
    complete:'Erledigt', pending:'Noch offen', close:'Schließen',
  },
  en: {
    intro:'Your setup at a glance. Completed steps turn green and receive a check mark.',
    installed:'Blitzortung integration installed',
    linked:'Blitzortung location: GewitterRadar tracker',
    recorder:'configuration.yaml: Recorder exclusions',
    todo:'Local to-do: “Gewitterradar Orte” created',
    installedHelp:'Home Assistant → Settings → Devices & services → add Blitzortung.',
    linkedHelp:'In Blitzortung, select the GewitterRadar tracker as “Location entity”: native device_tracker.gewitterradar, dashboard device_tracker.gewitterradar_dashboard.',
    recorderHelp:'Exclude the four lightning sources in the existing recorder: section and restart Home Assistant. Live lightning data remains available.',
    recorderAdmin:'HA administrator permissions required',
    todoHelp:'Settings → Devices & services → Add integration → Local to-do. Name the list exactly “Gewitterradar Orte”.',
    installedWhy:'The Blitzortung.org integration supplies lightning events that GewitterRadar can evaluate and display on the map.',
    linkedWhy:'Linking the GewitterRadar tracker defines the reference location used by Blitzortung.org for lightning distance and direction calculations.',
    recorderWhy:'Strongly recommended: Lightning strikes reported by Blitzortung.org may cause a very large number of state changes and dramatically increase the Home Assistant database size. This recommendation concerns Blitzortung.org lightning data — not database growth caused by GewitterRadar. Live lightning data remains available.',
    todoWhy:'GewitterRadar uses the Local to-do list “Gewitterradar Orte” as its central storage for saved place favourites, such as cities and countries. Without the list, location search with favourite storage is not fully available.',
    whyLabel:'Why is this useful?',
    refresh:'Check again', checking:'Checking your setup …',
    unknown:'Cannot be checked automatically. Please check the setup in Home Assistant.',
    complete:'Completed', pending:'Still open', close:'Close',
  },
};
const ROWS = [
  ['installed','blitzortungInstalled'], ['linked','trackerLinked'],
  ['recorder','recorderExcluded'], ['todo','localTodoCreated'],
];
const STYLE = `
 .gr-first-steps[open]{display:flex;flex-direction:column}
 .gr-first-steps{box-sizing:border-box;width:min(700px,calc(100% - 20px));max-width:none;
   max-height:calc(100dvh - 20px);border-radius:18px;padding:3px;overflow:hidden;
   color:var(--b-text,#edf0f5);color-scheme:dark;font:15px/1.45 'Segoe UI',Arial,sans-serif;text-align:start}
 .gr-first-steps::backdrop{background:#02070da6;backdrop-filter:blur(2px)}
 .gr-first-steps:focus{outline:none}
 .gr-first-steps.gr-premium-metal-surface{border:2px solid transparent;
   background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%) padding-box,
   linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995)) padding-box,
   linear-gradient(145deg,#e3c17d,#80602d 16%,#f9e3ad 29%,#735024 45%,#ba9144 57%,#ffe5a0 74%,#614723 86%,#cba35c) border-box;
   box-shadow:0 30px 90px #000b,inset 0 0 0 1px #ffecb514,inset 0 1px #fff4d51a}
 .gr-first-scroll{min-height:0;overflow:auto;overscroll-behavior:contain;border-radius:13px;
   background:radial-gradient(ellipse at 10% 0,#30404c66,transparent 65%),#090e14}
 .gr-first-head{position:relative;padding:25px 64px 20px 26px;border-bottom:1px solid #c7a25c55}
 .gr-first-brand{display:flex;align-items:center;gap:12px;min-height:78px}
 .gr-first-brand>img{width:68px;height:68px;object-fit:contain}
 .gr-first-brand strong{font-size:clamp(24px,5vw,38px);color:#f6dc9f;line-height:1.15}
 .gr-first-brand>.gr-first-pro{width:min(100%,480px);height:auto}
 .gr-first-close{position:absolute;top:9px;inset-inline-end:9px;display:grid;place-items:center;
   width:44px;height:44px;padding:0;border:0;background:transparent;cursor:pointer;touch-action:manipulation}
 .gr-first-close img{width:100%;height:100%;pointer-events:none}
 .gr-first-body{padding:20px 26px}
 .gr-first-body h2{margin:0 0 8px;font-size:clamp(23px,4.8vw,32px);line-height:1.2;color:#f6dc9f}
 .gr-first-body>p{margin:0 0 20px;color:#cbd2db}
 .gr-first-list{padding:0;margin:0;list-style:none;display:grid;gap:10px}
 .gr-first-list li{position:relative;min-width:0;padding:0;border:1px solid #bd96513d;
   border-radius:10px;background:linear-gradient(120deg,#a17c2520,transparent 65%);overflow-wrap:anywhere}
 .gr-first-list li::before{content:'•';position:absolute;left:13px;top:12px;color:#dbb872;font-size:20px;pointer-events:none}
 .gr-first-item>summary{display:flex;align-items:center;gap:9px;min-height:56px;padding:12px 13px 12px 30px;cursor:pointer;list-style:none;touch-action:manipulation}
 .gr-first-item>summary::-webkit-details-marker,.gr-first-why>summary::-webkit-details-marker{display:none}
 .gr-first-item>summary .gr-first-label{min-width:0;flex:1}
 .gr-first-chevron{display:block;flex:none;width:10px;height:10px;border-right:2px solid #dfbc72;border-bottom:2px solid #dfbc72;transform:rotate(45deg);transition:transform .16s ease}
 .gr-first-item[open]>summary .gr-first-chevron,.gr-first-why[open]>summary .gr-first-chevron{transform:rotate(225deg)}
 .gr-first-detail{padding:0 14px 14px 30px;border-top:1px solid #b994482e}
 .gr-first-why{margin-top:10px;border-top:1px solid #b994482e}
 .gr-first-why>summary{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-height:44px;padding:4px 1px;cursor:pointer;list-style:none;touch-action:manipulation}
 .gr-first-why>summary img{width:30px;height:30px;object-fit:contain;pointer-events:none}
 .gr-first-why>p{margin:1px 0 6px;padding:10px 12px;border:1px solid #b9944833;border-radius:8px;background:#af883213;color:#d4d8df;font-size:12px;line-height:1.55}
 .gr-first-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
 .gr-first-label{font-weight:650}.gr-first-check{display:none;margin-inline-start:10px;font-size:20px;line-height:1}
 .gr-first-list li[data-state=complete] .gr-first-label,.gr-first-check{color:#7ce5a4}
 .gr-first-list li[data-state=complete] .gr-first-check{display:inline}
 .gr-first-list small{display:block;margin-top:8px;color:#c2c9d2;font-size:12px;line-height:1.5}
 .gr-first-list .gr-first-admin{color:#e3c17d}
 .gr-first-list .gr-first-unknown{color:#d2bd92}.gr-first-unknown[hidden]{display:none}
 .gr-first-yaml{margin:10px 0 0;padding:12px;border:1px solid #b99a483b;border-radius:7px;
   white-space:pre-wrap;overflow-wrap:anywhere;direction:ltr;text-align:left;font:12px/1.6 Consolas,monospace;color:#e6d3ac;background:#060b10}
 .gr-first-footer{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:0 26px 20px}
 .gr-first-footer label{display:flex;align-items:center;gap:9px;min-height:44px;flex:1 1 100%;cursor:pointer}
 .gr-first-footer input{width:20px;height:20px;margin:0;accent-color:#f6d37e}
 .gr-first-footer button{min-height:44px;padding:9px 17px;border:1px solid #b99448;border-radius:9px;
   background:linear-gradient(#22303b,#111820);color:#edf0f5;font:inherit;cursor:pointer;touch-action:manipulation}
 .gr-first-footer button:disabled{opacity:.65;cursor:wait}
 .gr-first-status{flex-basis:100%;margin:0;font-size:12px;color:#cbd2db;min-height:1.5em}
 .gr-first-steps :focus-visible{outline:2px solid #f6d37e;outline-offset:-2px}
 @media(max-width:480px){.gr-first-head{padding:20px 56px 15px 16px}.gr-first-brand{min-height:58px;gap:8px}
   .gr-first-brand>img{width:48px;height:48px}.gr-first-body{padding:18px 16px}.gr-first-footer{padding:0 16px 16px}
   .gr-first-brand strong{font-size:24px}.gr-first-yaml{font-size:11px}}
`;

export function openFirstSteps(owner, images, storage, writable) {
  const language = owner._languageValue();
  const text = TEXT[/Deutsch|Boarisch|Platt|Sächs|Schwäb/.test(language) ? 'de' : 'en'];
  const esc = premiumEscape;
  const shell = document.createElement('div');
  shell.innerHTML = `<style>${STYLE}</style><dialog class="gr-first-steps gr-premium-metal-surface" tabindex="-1" aria-labelledby="gr-first-title">
    <div class="gr-first-scroll">
      <header class="gr-first-head">
        <div class="gr-first-brand"></div>
      </header>
      <div class="gr-first-body"><h2 id="gr-first-title">First Steps &amp; Useful Tips</h2><p>${esc(text.intro)}</p>
        <ul class="gr-first-list">${ROWS.map(([key]) => `<li data-check="${key}" data-state="unknown">
          <details class="gr-first-item"><summary>
            <span class="gr-first-label">${esc(text[key])}</span><span class="gr-first-check" aria-hidden="true">✓</span>
            <span class="gr-first-chevron" aria-hidden="true"></span>
          </summary><div class="gr-first-detail">
            <small>${esc(text[key + 'Help'])}</small><small class="gr-first-unknown">${esc(text.unknown)}</small>
            ${key === 'recorder' ? `<small class="gr-first-admin">${esc(text.recorderAdmin)}</small>` : ''}
            ${key === 'recorder' ? `<pre class="gr-first-yaml">${esc(images.recorderYaml)}</pre>` : ''}
            <details class="gr-first-why"><summary aria-label="${esc(text.whyLabel)}" title="${esc(text.whyLabel)}">
              <img src="${esc(INFO_ICON)}" alt="" draggable="false"><span class="gr-first-chevron" aria-hidden="true"></span>
              <span class="gr-first-sr-only">${esc(text.whyLabel)}</span>
            </summary><p>${esc(text[key + 'Why'])}</p></details>
          </div></details>
        </li>`).join('')}</ul>
      </div>
      <footer class="gr-first-footer">
        <label><input type="checkbox" ${writable ? '' : 'disabled'}><span>${esc(owner._t('pro.welcome.dismiss'))}</span></label>
        <button type="button" data-first-refresh>${esc(text.refresh)}</button>
        <button type="button" data-first-done>${esc(text.close)}</button>
        <p class="gr-first-status" role="status" aria-live="polite"></p>
      </footer>
    </div>
    <button class="gr-first-close" type="button" aria-label="${esc(text.close)}"><img src="${esc(images.close)}" alt="" draggable="false"></button>
  </dialog>`;
  const dialog = shell.querySelector('dialog'), status = dialog.querySelector('.gr-first-status');
  // Only one primary step expands at a time; the nested explanation remains optional.
  for (const item of dialog.querySelectorAll('.gr-first-item')) item.addEventListener('toggle', () => {
    if (item.open) for (const other of dialog.querySelectorAll('.gr-first-item')) if (other !== item) other.open = false;
  });
  const refresh = dialog.querySelector('[data-first-refresh]');
  let active = true, request = null;
  const render = reply => {
    for (const [key, field] of ROWS) {
      const value = reply?.schema === 'gewitterradar.setup-status.v1' ? reply[field] : null;
      const row = dialog.querySelector(`[data-check="${key}"]`);
      row.dataset.state = value === true ? 'complete' : value === false ? 'pending' : 'unknown';
      row.querySelector('.gr-first-unknown').hidden = typeof value === 'boolean';
      row.querySelector('.gr-first-label').setAttribute('aria-label', text[key] + ': ' +
        (value === true ? text.complete : value === false ? text.pending : text.unknown));
    }
  };
  const updateBrand = () => {
    const pro = owner.__proBranding?.eyeReady === true;
    const brand = dialog.querySelector('.gr-first-brand');
    if (brand.dataset.pro === String(pro)) return;
    brand.dataset.pro = String(pro);
    brand.innerHTML = pro
      ? `<img class="gr-first-pro" src="${esc(images.wordmark)}" alt="GewitterRadar PRO" draggable="false">`
      : `<img src="${esc(images.logo)}" alt="" draggable="false"><strong>GewitterRadar</strong>`;
  };
  const check = async () => {
    if (!active || request) return;
    const token = {connection:owner._hass?.connection};
    request = token; refresh.disabled = true; status.textContent = text.checking;
    render(null);
    try {
      const send = owner._hass?.callWS;
      if (typeof send !== 'function' || token.connection?.connected === false) throw Error('Offline');
      const fetchStatus = async () => {
        try { return await send.call(owner._hass, {type:'gewitterradar/setup_status'}); }
        catch (error) {
          if (error?.code !== 'unknown_command') throw error;
          // A dashboard-only installation has no GR backend. Registry ownership
          // still proves installed integrations; linkage/Recorder remain unknown.
          const registry = await send.call(owner._hass, {type:'config/entity_registry/list'});
          if (!Array.isArray(registry)) throw Error('Invalid entity registry');
          const states = owner._hass.states || {};
          return {
            schema:'gewitterradar.setup-status.v1',
            blitzortungInstalled:registry.some(item => item.platform === 'blitzortung') ? true : null,
            trackerLinked:null, recorderExcluded:null,
            localTodoCreated:registry.some(item => item.platform === 'local_todo'
              && item.entity_id?.startsWith('todo.') && !item.disabled_by && states[item.entity_id]
              && String(item.name || item.original_name || states[item.entity_id]?.attributes?.friendly_name || '').trim().toLowerCase() === 'gewitterradar orte'),
          };
        }
      };
      const response = await Promise.race([
        fetchStatus(),
        new Promise((_, reject) => {
          token.cancel = () => reject(Error('Cancelled'));
          token.timer = setTimeout(() => reject(Error('Timeout')), 6000);
        }),
      ]);
      if (active && request === token && token.connection === owner._hass?.connection
          && token.connection?.connected !== false) {
        render(response); status.textContent = response?.schema === 'gewitterradar.setup-status.v1' ? '' : text.unknown;
      }
    } catch (_) {
      if (active && request === token) { render(null); status.textContent = text.unknown; }
    } finally {
      clearTimeout(token.timer);
      if (request === token) { request = null; if (active) refresh.disabled = false; }
    }
  };
  const checkbox = dialog.querySelector('input');
  // Reflect the currently selected profile on every opening, including Help.
  // Reading must not mutate the persisted dismissal preference.
  try { checkbox.checked = storage.getItem(FIRST_STEPS_DISMISSED) === '1'; }
  catch (_) { checkbox.disabled = true; status.textContent = owner._t('vault.genericError'); }
  checkbox.addEventListener('change', () => {
    try {
      if (checkbox.checked) storage.setItem(FIRST_STEPS_DISMISSED, '1');
      else storage.removeItem(FIRST_STEPS_DISMISSED);
      status.textContent = '';
    } catch (_) { checkbox.checked = !checkbox.checked; status.textContent = owner._t('vault.genericError'); }
  });
  refresh.addEventListener('click', check);
  for (const button of dialog.querySelectorAll('.gr-first-close,[data-first-done]')) button.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    active = false; clearTimeout(request?.timer); request?.cancel?.(); request = null; shell.remove();
    if (owner._firstStepsDialog === dialog) owner._firstStepsDialog = null;
    images.onClose?.();
  }, {once:true});
  dialog.updateBrand = updateBrand;
  dialog.invalidateChecks = () => {
    clearTimeout(request?.timer); request?.cancel?.(); request = null;
    render(null); status.textContent = text.unknown; refresh.disabled = false;
  };
  owner.shadow.append(shell); updateBrand(); dialog.showModal(); dialog.focus({preventScroll:true});
  dialog.querySelector('.gr-first-scroll').scrollTop = 0;
  void check();
  return dialog;
}

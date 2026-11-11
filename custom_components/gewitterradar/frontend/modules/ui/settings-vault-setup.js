// Uses the same product icon, gold accents and dark surfaces as the GR settings menu.
const BRAND_ICON = new URL('../../assets/gewitterradar-brand-icon.png?v=404', import.meta.url).href;

const TEMPLATE = `
<style>
.gr-vault-setup {
  --vault-gold: #c7a25b;
  --vault-bright: #f1d58c;
  --vault-line: rgba(201,160,80,.34);
  box-sizing: border-box;
  width: min(calc(100% - 24px), 456px);
  margin: clamp(12px, 5vh, 44px) auto;
  overflow: hidden;
  color: #f1eee7;
  border: 1px solid var(--vault-line);
  border-radius: 18px;
  background: radial-gradient(ellipse at 28% 0%, rgba(230,184,85,.11), transparent 42%),
    linear-gradient(180deg, #141c26, #070c12);
  box-shadow: 0 16px 42px #0008, inset 0 1px #fff4d515;
  font: 400 14px/1.5 system-ui, sans-serif;
}
.gr-vault-setup [hidden] { display: none !important; }
.gr-vault-setup :is(h1,h2,h3,p) { margin: 0; }
.gr-vault-setup header {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px clamp(14px, 4vw, 22px);
  border-bottom: 1px solid var(--vault-line);
}
.gr-vault-setup header img { width: 42px; height: 42px; object-fit: contain; }
.gr-vault-setup h1 { color: var(--vault-bright); font-size: clamp(18px, 5vw, 22px); font-weight: 720; line-height: 1.2; }
.gr-vault-setup header p { color: #d1bb90; font-size: 12px; }
.gr-vault-setup .vault-body { display: grid; gap: 13px; padding: 16px clamp(14px, 4vw, 22px) 18px; }
.gr-vault-setup h2 { font-size: 18px; }
.gr-vault-setup h3 { font-size: 15px; }
.gr-vault-setup .vault-muted { color: #bdc5d0; }
.gr-vault-setup :is(.vault-step,.vault-actions,label) { display: grid; gap: 9px; }
.gr-vault-setup .vault-actions { grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr)); }
.gr-vault-setup :is(button,input,select) {
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  min-height: 46px;
  padding: 9px 12px;
  border: 1px solid var(--vault-line);
  border-radius: 11px;
  background: linear-gradient(160deg, #233040, #111922);
  color: inherit;
  font: inherit;
}
.gr-vault-setup :is(input,select) { color-scheme: dark; font-size: 16px; }
.gr-vault-setup button { cursor: pointer; font-weight: 650; text-align: left; touch-action: manipulation; }
.gr-vault-setup .vault-primary {
  color: #f5e4bd;
  border-color: #b78e4a;
  background: linear-gradient(155deg, #473722, #1c222a 75%);
}
.gr-vault-setup .vault-choice {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 8px;
  align-items: center;
  gap: 10px;
}
.gr-vault-setup .vault-choice::after {
  content: "";
  width: 6px;
  height: 6px;
  border: solid var(--vault-gold);
  border-width: 1.5px 1.5px 0 0;
  transform: rotate(45deg);
}
.gr-vault-setup .vault-link {
  padding-inline: 0;
  border-color: transparent;
  background: transparent;
  color: var(--vault-bright);
}
.gr-vault-setup :focus-visible { outline: 2px solid var(--vault-bright); outline-offset: 2px; }
.gr-vault-setup button:disabled { opacity: .55; cursor: default; }
.gr-vault-setup :is([role=status],[role=alert]) { overflow-wrap: anywhere; }
.gr-vault-setup [role=alert] { color: #ffcfad; }
.gr-vault-setup :is([role=status],[role=alert]):empty { display: none; }
</style>
<header>
  <img alt="" width="42" height="42" decoding="async">
  <div><h1>GewitterRadar Pro</h1><p>powered by WeatherRouter</p></div>
</header>
<div class="vault-body">
  <div><h2>Userprofile &amp; Sicherungen</h2><p class="vault-muted">Einstellungen für dieses Gerät auswählen oder wiederherstellen.</p></div>
  <div class="vault-step" data-step="loading"><p role="status">Profil wird geladen …</p></div>
  <div class="vault-step" data-step="choose" hidden>
    <button type="button" class="vault-primary vault-choice" data-action="existing">Vorhandenes Profil verwenden</button>
    <button type="button" class="vault-choice" data-action="defaults">Mit Standardeinstellungen starten</button>
    <button type="button" class="vault-link" data-action="legacy" hidden>Bisherige Browsereinstellungen</button>
    <p class="vault-muted" data-recovery hidden>Letzte gültige Sicherung · schreibgeschützt</p>
    <button type="button" class="vault-link" data-action="export-server" hidden>Sicherung exportieren</button>
  </div>
  <div class="vault-step" data-step="existing" hidden>
    <h3 tabindex="-1" data-focus>Geräteprofil auswählen</h3>
    <p class="vault-muted" data-empty hidden>Für dieses Konto ist noch kein Geräteprofil vorhanden.</p>
    <label data-profile-field>Gespeichertes Profil<select aria-label="Geräteprofil"></select></label>
    <p class="vault-muted" data-link-note>Beim Zuordnen bleiben Änderungen mit diesem Profil verbunden. Eine Kopie ist unabhängig.</p>
    <div class="vault-actions">
      <button type="button" class="vault-primary" data-action="use">Dieses Profil zuordnen</button>
      <button type="button" data-action="copy">Als eigenes Profil kopieren</button>
    </div>
    <button type="button" class="vault-link" data-action="back">Zurück</button>
  </div>
  <form class="vault-step" data-step="name" hidden>
    <h3 data-name-heading>Neues Geräteprofil</h3>
    <label>Profilname<input type="text" required maxlength="64" value="Dieses Gerät" autocomplete="off" data-focus></label>
    <p class="vault-muted" data-name-note hidden>Die bisherigen Browsereinstellungen bleiben für eine spätere Übernahme verfügbar.</p>
    <button type="submit" class="vault-primary" data-submit>Profil erstellen</button>
    <button type="button" class="vault-link" data-action="back">Zurück</button>
  </form>
  <div class="vault-step" data-step="legacy" hidden>
    <h3 tabindex="-1" data-focus>Bisherige Browsereinstellungen</h3>
    <p class="vault-muted" data-legacy-info></p>
    <button type="button" data-action="preview">Übernahme prüfen</button>
    <p class="vault-muted" data-legacy-preview hidden></p>
    <button type="button" class="vault-primary" data-action="migrate" hidden>Browsereinstellungen übernehmen</button>
    <button type="button" class="vault-link" data-action="export-local">Lokale Originaldaten exportieren</button>
    <button type="button" class="vault-link" data-action="back">Zurück</button>
  </div>
  <div class="vault-step" data-step="error" hidden>
    <button type="button" class="vault-primary" data-action="retry">Erneut verbinden</button>
    <button type="button" class="vault-primary" data-action="reload" hidden>Frontend neu laden</button>
    <button type="button" data-action="local" hidden>Karte mit lokalen Einstellungen öffnen</button>
    <p class="vault-muted" data-local-note hidden>Die lokale Ansicht ist schreibgeschützt. Gespeicherte Profile bleiben für den nächsten Start verfügbar.</p>
  </div>
  <p role="status" data-action-status></p>
  <p role="alert"></p>
</div>`;

/** One mounted setup per card. Only an explicit action or its result changes the step. */
export function mountVaultSetup(owner, client, {retry, boot, safeError, fileDownload}) {
  const root = document.createElement('section');
  root.className = 'gr-vault-setup';
  root.setAttribute('aria-label', 'Userprofile & Sicherungen');
  root.innerHTML = TEMPLATE;
  root.querySelector('img').src = BRAND_ICON;
  owner.append(root);

  const find = selector => root.querySelector(selector);
  const action = id => find('[data-action="' + id + '"]');
  const picker = find('select');
  const input = find('input');
  const alert = find('[role=alert]');
  const status = find('[data-action-status]');
  const form = find('form');
  let step = 'loading';
  let nameMode;
  let busy = false;

  function show(next, focus = false) {
    step = next;
    for (const panel of root.querySelectorAll('[data-step]')) panel.hidden = panel.dataset.step !== next;
    alert.textContent = '';
    if (focus) {
      const panel = find('[data-step="' + next + '"]');
      (panel.querySelector('[data-focus]') ?? panel.querySelector('button:not([hidden]):not(:disabled)'))?.focus();
    }
  }

  function present() {
    if (client.profile || client.localOnly) return;
    if (client.status === 'loading') {
      show('loading');
      return;
    }
    if (client.status === 'choose' || client.status === 'recovery') {
      picker.replaceChildren(...client.profiles.map(profile => new Option(profile.name, profile.id)));
      action('defaults').disabled = client.recovery;
      action('legacy').hidden = client.recovery || !(Object.keys(client.legacy.values).length || client.legacy.unavailable);
      action('export-server').hidden = !client.recovery || !client.profiles.length;
      find('[data-recovery]').hidden = !client.recovery;
      show('choose');
      return;
    }
    action('retry').hidden = !client.canRetry;
    action('reload').hidden = client.status !== 'reload';
    action('local').hidden = find('[data-local-note]').hidden = !client.canOpenLocal;
    show('error');
    alert.textContent = client.status === 'offline' && client.error?.code !== 'settings_timeout'
      ? 'Keine Verbindung zum Profildienst. Prüfe die Verbindung zu Home Assistant.'
      : safeError(client.error);
  }

  async function run(operation, message = 'Profil wird geprüft …') {
    if (busy) return;
    busy = true;
    status.textContent = message;
    alert.textContent = '';
    try { await operation(); }
    catch (error) { alert.textContent = safeError(error); }
    finally {
      busy = false;
      status.textContent = '';
    }
  }

  function openExisting() {
    const available = client.profiles.length > 0;
    find('[data-empty]').hidden = available;
    find('[data-profile-field]').hidden = !available;
    find('[data-link-note]').hidden = !available || client.recovery;
    action('copy').hidden = !available || client.recovery;
    action('use').hidden = !available;
    action('use').textContent = client.recovery ? 'Sicherung ansehen' : 'Dieses Profil zuordnen';
    show('existing', true);
  }

  function nameProfile(kind) {
    nameMode = kind;
    input.value = 'Dieses Gerät';
    find('[data-name-heading]').textContent = {defaults: 'Neues Geräteprofil', copy: 'Eigenständige Profilkopie', legacy: 'Browsereinstellungen übernehmen'}[kind];
    find('[data-name-note]').hidden = kind !== 'defaults' || !Object.keys(client.legacy.values).length;
    show('name', true);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (step !== 'name') return;
    const name = input.value.trim();
    if (!name) {
      alert.textContent = 'Gib einen Namen für dieses Gerät ein.';
      input.focus();
      return;
    }
    const fields = nameMode === 'copy' ? {profileId: picker.value, name} : {
      name, ...(nameMode === 'legacy' ? {legacy: client.legacy.values} : {}),
    };
    void run(async () => {
      await client.create(nameMode === 'copy' ? 'copy' : 'create', fields);
      boot();
    }, 'Profil wird angelegt …');
  });

  const actions = {
    existing: openExisting,
    defaults: () => nameProfile('defaults'),
    copy: () => nameProfile('copy'),
    migrate: () => nameProfile('legacy'),
    use: () => run(async () => { await client.choose(picker.value); boot(); }, 'Profil wird geladen …'),
    back: () => {
      if (step !== 'name' || nameMode === 'defaults') show('choose', true);
      else if (nameMode === 'copy') openExisting();
      else show('legacy', true);
    },
    legacy: () => {
      const count = Object.keys(client.legacy.values).length;
      find('[data-legacy-info]').textContent = count
        ? count + ' lokale Einstellungsbereiche gefunden. Die Übernahme legt ein eigenes Profil an.'
        : 'Der bisherige Browserspeicher konnte nicht gelesen werden.';
      action('preview').hidden = action('export-local').hidden = !count;
      show('legacy', true);
    },
    preview: () => run(async () => {
      const result = await client.call('migration_preview', {legacy: client.legacy.values});
      const summary = find('[data-legacy-preview]');
      summary.textContent = result.keys.length + ' übernehmbare Einstellungsbereiche.'
        + (result.issues.length ? ' Unvollständig lesbar: ' + result.issues.join(', ') : '');
      summary.hidden = false;
      action('migrate').hidden = !result.keys.length;
    }),
    'export-local': () => fileDownload('gewitterradar-browser-recovery.json',
      JSON.stringify({format: 'gewitterradar.legacy-recovery', ...client.legacy}, null, 2)),
    'export-server': () => run(async () => {
      const {text} = await client.call('export');
      fileDownload('gewitterradar-profile.json', text);
    }),
    retry: () => run(retry, ''),
    reload: () => location.reload(),
    local: () => run(() => { client.openLocal(); boot(); }, ''),
  };

  root.addEventListener('click', event => {
    const control = event.target.closest('button[data-action]');
    if (control && !busy) actions[control.dataset.action]();
  });

  return {present, remove: () => root.remove()};
}

// Uses the same product icon, gold accents and dark surfaces as the GR settings menu.
const BRAND_ICON = new URL('../../assets/gewitterradar-brand-icon.png?v=404', import.meta.url).href;

const template = t => `
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
.gr-vault-setup .vault-name-field { position: relative; }
.gr-vault-setup .vault-name-field input { padding-inline-end: 49px; }
.gr-vault-setup .vault-name-clear {
  position: absolute;
  inset-inline-end: 1px;
  inset-block-end: 1px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--vault-bright);
  font-size: 22px;
  line-height: 1;
}
.gr-vault-setup .vault-name-clear:is(:hover,:focus-visible) { background: rgba(201,160,80,.14); }
.gr-vault-setup .vault-name-clear:focus-visible { outline-offset: -3px; }
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
  <div><h2>${t('title')}</h2><p class="vault-muted">${t('setupIntro')}</p></div>
  <div class="vault-step" data-step="loading"><p role="status">${t('loading')}</p></div>
  <div class="vault-step" data-step="choose" hidden>
    <button type="button" class="vault-primary vault-choice" data-action="existing">${t('existing')}</button>
    <button type="button" class="vault-choice" data-action="defaults">${t('startDefaults')}</button>
    <button type="button" class="vault-link" data-action="legacy" hidden>${t('browserSettings')}</button>
    <p class="vault-muted" data-recovery hidden>${t('recovery')}</p>
    <button type="button" class="vault-link" data-action="export-server" hidden>${t('exportBackup')}</button>
  </div>
  <div class="vault-step" data-step="existing" hidden>
    <h3 tabindex="-1" data-focus>${t('choose')}</h3>
    <p class="vault-muted" data-empty hidden>${t('noProfiles')}</p>
    <label data-profile-field>${t('storedProfile')}<select aria-label="${t('deviceProfile')}"></select></label>
    <p class="vault-muted" data-link-note>${t('linkNote')}</p>
    <div class="vault-actions">
      <button type="button" class="vault-primary" data-action="use">${t('link')}</button>
      <button type="button" data-action="copy">${t('copyOwn')}</button>
    </div>
    <button type="button" class="vault-link" data-action="back">${t('back')}</button>
  </div>
  <form class="vault-step" data-step="name" hidden>
    <h3 data-name-heading tabindex="-1" data-focus>${t('newProfile')}</h3>
    <div class="vault-name-field">
      <label>${t('profileName')}<input type="text" required maxlength="64" value="${t('thisDevice')}" autocomplete="off"></label>
      <button type="button" class="vault-name-clear" data-action="clear-name" aria-label="${t('clearName')}"><span aria-hidden="true">×</span></button>
    </div>
    <p class="vault-muted" data-name-note hidden>${t('migrateLater')}</p>
    <button type="submit" class="vault-primary" data-submit>${t('create')}</button>
    <button type="button" class="vault-link" data-action="back">${t('back')}</button>
  </form>
  <div class="vault-step" data-step="legacy" hidden>
    <h3 tabindex="-1" data-focus>${t('browserSettings')}</h3>
    <p class="vault-muted" data-legacy-info></p>
    <button type="button" data-action="preview">${t('previewMigration')}</button>
    <p class="vault-muted" data-legacy-preview hidden></p>
    <button type="button" class="vault-primary" data-action="migrate" hidden>${t('migrate')}</button>
    <button type="button" class="vault-link" data-action="export-local">${t('exportLocal')}</button>
    <button type="button" class="vault-link" data-action="back">${t('back')}</button>
  </div>
  <div class="vault-step" data-step="error" hidden>
    <button type="button" class="vault-primary" data-action="retry">${t('reconnect')}</button>
    <button type="button" class="vault-primary" data-action="reload" hidden>${t('reload')}</button>
    <button type="button" data-action="local" hidden>${t('useLocal')}</button>
    <p class="vault-muted" data-local-note hidden>${t('localNote')}</p>
  </div>
  <p role="status" data-action-status></p>
  <p role="alert"></p>
</div>`;

/** One mounted setup per card. Only an explicit action or its result changes the step. */
export function mountVaultSetup(owner, client, {retry, boot, safeError, fileDownload}) {
  const t = (key, vars) => owner._t('vault.' + key, vars);
  const root = document.createElement('section');
  root.className = 'gr-vault-setup';
  root.setAttribute('aria-label', t('title'));
  root.innerHTML = template(key => t(key).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c])));
  root.querySelector('img').src = BRAND_ICON;
  owner.append(root);

  const find = selector => root.querySelector(selector);
  const action = id => find('[data-action="' + id + '"]');
  const picker = find('select');
  const input = find('input');
  const alert = find('[role=alert]');
  const status = find('[data-action-status]');
  const form = find('form');
  const clearName = action('clear-name');
  const nameDrafts = new Map();
  let step = 'loading';
  let nameMode;
  let nameDraft;
  let keyboardListeners;
  let tabNavigation = false;
  let busy = false;

  function show(next, focus = false) {
    tabNavigation = false;
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
      ? t('offlineHelp')
      : safeError(client.error);
  }

  async function run(operation, message = t('checking')) {
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
    action('use').textContent = client.recovery ? t('viewBackup') : t('link');
    show('existing', true);
  }

  function nameProfile(kind) {
    nameMode = kind;
    const key = kind === 'copy' ? 'copy:' + picker.value : kind;
    nameDraft = nameDrafts.get(key) ?? {value: input.defaultValue, selectSuggestion: true};
    nameDrafts.set(key, nameDraft);
    input.value = nameDraft.value;
    clearName.hidden = !input.value;
    find('[data-name-heading]').textContent = {defaults: t('newProfile'), copy: t('independentCopy'), legacy: t('migrate')}[kind];
    find('[data-name-note]').hidden = kind !== 'defaults' || !Object.keys(client.legacy.values).length;
    show('name', true);
  }

  function selectSuggestion() {
    if (step !== 'name' || !nameDraft.selectSuggestion) return;
    nameDraft.selectSuggestion = false;
    if (input.value === input.defaultValue) input.select();
  }

  function updateDraft() {
    nameDraft.value = input.value;
    nameDraft.selectSuggestion = false;
    clearName.hidden = !input.value;
  }

  // Focus can also be set by the card or by validation. Only Tab and an
  // actual click/tap should select the untouched suggestion.
  function connect() {
    if (keyboardListeners) return;
    keyboardListeners = new AbortController();
    const capture = {capture: true, signal: keyboardListeners.signal};
    root.ownerDocument.addEventListener('keydown', event => {
      if (step === 'name' && event.isTrusted) tabNavigation = event.key === 'Tab';
    }, capture);
    const endTabNavigation = () => { tabNavigation = false; };
    for (const type of ['focusin', 'keyup', 'pointerdown']) {
      root.ownerDocument.addEventListener(type, endTabNavigation, capture);
    }
  }

  function disconnect() {
    keyboardListeners?.abort();
    keyboardListeners = undefined;
    tabNavigation = false;
  }

  connect();
  input.addEventListener('focus', () => {
    if (!tabNavigation) return;
    if (nameDraft.selectSuggestion) selectSuggestion();
    else {
      // Chromium selects the whole field on Tab focus. Resume at the saved caret.
      const caret = nameDraft.caret ?? input.value.length;
      input.setSelectionRange(caret, caret);
    }
  });
  input.addEventListener('blur', () => { nameDraft.caret = input.selectionEnd; });
  input.addEventListener('click', event => { if (event.isTrusted) selectSuggestion(); });
  input.addEventListener('input', updateDraft);
  clearName.addEventListener('mousedown', event => event.preventDefault());

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (step !== 'name') return;
    const name = input.value.trim();
    if (!name) {
      alert.textContent = t('nameRequired');
      input.focus();
      return;
    }
    const fields = nameMode === 'copy' ? {profileId: picker.value, name} : {
      name, ...(nameMode === 'legacy' ? {legacy: client.legacy.values} : {}),
    };
    void run(async () => {
      await client.create(nameMode === 'copy' ? 'copy' : 'create', fields);
      boot();
    }, t('creating'));
  });

  const actions = {
    existing: openExisting,
    defaults: () => nameProfile('defaults'),
    copy: () => nameProfile('copy'),
    migrate: () => nameProfile('legacy'),
    'clear-name': () => {
      input.value = '';
      input.focus({preventScroll: true});
      updateDraft();
    },
    use: () => run(async () => { await client.choose(picker.value); boot(); }, t('loading')),
    back: () => {
      if (step !== 'name' || nameMode === 'defaults') show('choose', true);
      else if (nameMode === 'copy') openExisting();
      else show('legacy', true);
    },
    legacy: () => {
      const count = Object.keys(client.legacy.values).length;
      find('[data-legacy-info]').textContent = count
        ? t('legacyFound', {count})
        : t('legacyUnreadable');
      action('preview').hidden = action('export-local').hidden = !count;
      show('legacy', true);
    },
    preview: () => run(async () => {
      const result = await client.call('migration_preview', {legacy: client.legacy.values});
      const summary = find('[data-legacy-preview]');
      summary.textContent = t('importable', {count: result.keys.length})
        + (result.issues.length ? ' ' + t('incomplete', {areas: result.issues.join(', ')}) : '');
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

  return {present, connect, disconnect, remove: () => {
    disconnect();
    root.remove();
  }};
}

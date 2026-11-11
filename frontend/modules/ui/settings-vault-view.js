import {
  acquireSettingsSlot, releaseSettingsSlot, requestId, SettingsVaultClient,
} from '../core/settings-vault.js?v=411183r1';
import {APPLICATION_RELEASE} from '../../version.js?v=411183r1';

const TITLE = 'Userprofile & Sicherungen';
const MAX_IMPORT_BYTES = 2 * 1024 * 1024;
const STATUS = {
  loading: 'Profil wird geladen …', choose: 'Geräteprofil auswählen', saved: 'Gespeichert',
  saving: 'Speichert …', offline: 'Offline', conflict: 'Konflikt', recovery: 'Letzte gültige Sicherung · schreibgeschützt',
  error: 'Speicherfehler', reload: 'Frontend neu laden', local: 'Nur lokal',
};
const ERRORS = {
  settings_conflict: 'Das Profil wurde in einer anderen Sitzung geändert.',
  settings_limit: 'Die Speichergrenze wurde erreicht.',
  settings_not_found: 'Das ausgewählte Profil ist nicht mehr verfügbar.',
  settings_pending: 'Offene Änderungen zuerst speichern oder den Konflikt auflösen.',
  settings_reload: 'Gewitterradar wurde aktualisiert. Bitte das Frontend neu laden.',
  settings_schema: 'Dieser Gewitterradar-Stand kann das Speicherschema nicht öffnen.',
  settings_storage: 'Der Server konnte den Speicherstand nicht bestätigen.',
  settings_timeout: 'Der Server hat noch nicht geantwortet. Du kannst den Vorgang erneut versuchen.',
  invalid_settings: 'Die Datei oder die Einstellungen konnten nicht validiert werden.',
  unknown_command: 'Die installierte HA-Integration stellt den Settings Vault noch nicht bereit.',
  vault_binding: 'Diese Karteninstanz benötigt eine eindeutige settings_vault_id oder verfügbaren Browserspeicher.',
};
const STYLE = '.gr-vault{display:grid;gap:12px;color:inherit}.gr-vault fieldset{display:grid;min-width:0;gap:8px;border:1px solid #cda96645;border-radius:12px;padding:10px;margin:0}.gr-vault legend{padding:0 6px;font-weight:700}.gr-vault :is(button,input,select){box-sizing:border-box;font:inherit;max-width:100%;min-height:38px;border:1px solid #cda96665;border-radius:8px;background:#17212d;color:#f5e6ca;padding:7px 10px}.gr-vault button{cursor:pointer;text-align:left;font-weight:650}.gr-vault button:disabled{opacity:.5;cursor:default}.gr-vault :focus-visible{outline:2px solid #efce86;outline-offset:2px}.gr-vault label,.gr-vault details[open]{display:grid;gap:6px}.gr-vault input[type=checkbox]{min-height:0;justify-self:start}.gr-vault .gr-vault-row{display:flex;flex-wrap:wrap;gap:8px}.gr-vault p{margin:0;overflow-wrap:anywhere}.gr-vault summary{cursor:pointer;padding:7px 0}.gr-vault [role=status]{color:#efce86}.gr-vault [role=alert]:empty{display:none}.gr-vault pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:12rem;overflow:auto}.gr-vault-setup{display:block;padding:16px;max-width:520px;margin:auto;color:var(--primary-text-color,#e8e4dc)}';

function node(tag, content) {
  const element = document.createElement(tag);
  if (content) element.textContent = content;
  return element;
}

function button(label, action) {
  const element = node('button', label);
  element.type = 'button';
  element.addEventListener('click', action);
  return element;
}

function field(label, input) {
  const wrapper = node('label');
  wrapper.append(node('span', label), input);
  return wrapper;
}

function group(label, ...children) {
  const element = node('fieldset');
  element.append(node('legend', label), ...children);
  return element;
}

function disclosure(label, ...children) {
  const element = node('details');
  element.append(node('summary', label), ...children);
  return element;
}

function selectList(options, label) {
  const select = node('select');
  select.setAttribute('aria-label', label);
  for (const [value, text] of options) {
    const option = node('option', text);
    option.value = value;
    select.append(option);
  }
  return select;
}

function profileSelect(profiles) {
  return selectList(profiles.map(item => [item.id, item.name]), 'Geräteprofil');
}

function fileDownload(filename, text) {
  const link = node('a');
  const url = URL.createObjectURL(new Blob([text], {type: 'application/json'}));
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function safeError(error) {
  return ERRORS[error?.code] || 'Vorgang konnte nicht abgeschlossen werden.';
}

function form(root, client) {
  const content = node('div');
  content.className = 'gr-vault';
  const status = node('p');
  status.setAttribute('role', 'status');
  const error = node('p');
  error.setAttribute('role', 'alert');
  const style = node('style', STYLE);
  root.replaceChildren(style, content);
  content.append(status, error);
  const update = () => {
    status.textContent = STATUS[client?.status ?? 'local'];
    if (client?.error) error.textContent = safeError(client.error);
    else if (client?.dirty && client.queueSaved === false) error.textContent = 'Offene Änderungen sind nur in dieser Ansicht verfügbar.';
    else if (!content.dataset.busy) error.textContent = '';
  };
  if (client) {
    root.vaultStatusCleanup?.();
    client.addEventListener('change', update);
    root.vaultStatusCleanup = () => client.removeEventListener('change', update);
  }
  update();
  const run = async operation => {
    if (content.dataset.busy) return;
    content.dataset.busy = 'true';
    error.textContent = '';
    const buttons = [...content.querySelectorAll('button:not(:disabled)')];
    buttons.forEach(element => { element.disabled = true; });
    try { await operation(); }
    catch (err) { error.textContent = safeError(err); }
    finally {
      delete content.dataset.busy;
      buttons.forEach(element => { element.disabled = false; });
    }
  };
  return {content, run, error};
}

function setupView(owner, retry, boot) {
  const client = owner._settingsVault;
  let setup = owner.querySelector(':scope > .gr-vault-setup');
  if (!setup) {
    setup = node('ha-card');
    setup.className = 'gr-vault-setup';
    setup.style.cssText = 'display:block;padding:16px;max-width:520px;margin:auto';
    owner.append(setup);
  }
  const {content, run} = form(setup, client);
  content.prepend(node('strong', TITLE));
  if (client.status === 'loading') return;
  if (client.status === 'reload') {
    content.append(button('Frontend neu laden', () => location.reload()));
    return;
  }
  if (client.status !== 'choose' && client.status !== 'recovery') {
    content.append(button('Erneut verbinden', () => void run(retry)));
    return;
  }

  const nameInput = node('input');
  nameInput.value = 'Dieses Gerät';
  nameInput.maxLength = 64;
  const picker = profileSelect(client.profiles);
  const select = async () => {
    const {profile} = await client.call('get', {profileId: picker.value});
    if (client.recovery) client.hydrate(profile);
    else client.select(profile);
    boot();
  };
  const use = disclosure('Vorhandenes Profil verwenden');
  if (client.profiles.length) {
    use.append(field('Gespeichertes Profil', picker));
    if (!client.recovery) {
      use.append(button('Als eigenes Profil kopieren', () => void run(async () => {
        await client.create('copy', {profileId: picker.value, name: nameInput.value});
        boot();
      })));
      use.append(disclosure('Bestehende Zuordnung wiederherstellen',
        node('p', 'Änderungen gelten danach für dieses gespeicherte Profil.'),
        button('Dieses Profil zuordnen', () => void run(select))));
    } else use.append(button('Sicherung ansehen', () => void run(select)));
  } else use.append(node('p', 'Für dieses Konto ist noch kein Geräteprofil vorhanden.'));

  const defaults = button('Mit Standardeinstellungen starten', () => void run(async () => {
    if (Object.keys(client.legacy.values).length &&
        !confirm('Die lokalen Einstellungen bleiben erhalten. Ein neues Profil mit Standardeinstellungen anlegen?')) return;
    await client.create('create', {name: nameInput.value});
    boot();
  }));
  defaults.disabled = client.recovery;
  content.append(field('Anzeigename für ein neues Profil', nameInput), use, defaults);

  if (!client.recovery && (Object.keys(client.legacy.values).length || client.legacy.unavailable)) {
    const values = Object.keys(client.legacy.values);
    const migration = disclosure('Bisherige Browsereinstellungen');
    migration.open = true;
    migration.append(node('p', values.length
      ? values.length + ' lokale Einstellungsbereiche gefunden. Die Übernahme legt ein eigenes Profil an.'
      : 'Der bisherige Browserspeicher konnte nicht gelesen werden.'));
    const preview = node('div');
    if (values.length) migration.append(
      button('Übernahme prüfen', () => void run(async () => {
        const result = await client.call('migration_preview', {legacy: client.legacy.values});
        preview.replaceChildren(node('p', result.keys.length + ' übernehmbare Einstellungsbereiche.'));
        if (result.issues.length) preview.append(node('p', 'Unvollständig lesbare Bereiche: ' + result.issues.join(', ')));
        if (result.keys.length) preview.append(button('Browsereinstellungen übernehmen', () => void run(async () => {
          await client.create('create', {name: nameInput.value, legacy: client.legacy.values});
          boot();
        })));
      })), preview,
      button('Lokale Originaldaten exportieren', () => fileDownload(
        'gewitterradar-browser-recovery.json',
        JSON.stringify({format: 'gewitterradar.legacy-recovery', ...client.legacy}, null, 2),
      )),
    );
    if (client.legacy.unreadable.length) migration.append(node('p', 'Nicht lesbare Werte: ' + client.legacy.unreadable.length));
    content.append(migration);
  }
  if (client.recovery && client.profiles.length) {
    content.append(button('Sicherung exportieren', () => void run(async () => {
      const {text} = await client.call('export');
      fileDownload('gewitterradar-profile.json', text);
    })));
  }
}

const AREAS = [
  ['Eye und Aura', /eye-bubble|premium-ui:v1:eye-hub/],
  ['Wind und Wind-Studio', /wind-ui|wind-studio|premium-ui:v1:(?:weather-)?wind-/],
  ['Temperatur', /temperature-ui|premium-ui:v1:(?:weather-)?(?:temperature|advection)-/],
  ['Niederschlag und Wetterdarstellung', /weather-(?:display|legend|engine)|premium-ui:v1:precipitation/],
  ['Karte, Instrumente und Menüs', /^(?!.*(?:eye-bubble|wind-ui|wind-studio|temperature-ui|weather-(?:display|legend|engine)|premium-ui:v1:)).*$/],
];

function changedAreas(keys) {
  return AREAS.filter(([, pattern]) => keys.some(key => pattern.test(key))).map(([label]) => label);
}

function compareFields(label, before, mine, server, rows) {
  if (JSON.stringify(before) === JSON.stringify(mine)) return;
  if ([before, mine, server].every(value => value == null || value?.constructor === Object)
      && [before, mine, server].some(value => value != null)) {
    for (const key of new Set([...Object.keys(before || {}), ...Object.keys(mine || {})])) {
      compareFields(label + ' / ' + key, before?.[key], mine?.[key], server?.[key], rows);
    }
    return;
  }
  const text = value => value === undefined ? '–' : typeof value === 'string' ? value : JSON.stringify(value);
  rows.push(label + '\n  Dieser Tab: ' + text(mine) + '\n  Server: ' + text(server));
}

function mountMenu(owner) {
  const root = owner.shadow?.getElementById('gr-vault-content');
  if (!root) return;
  const client = owner._settingsVault;
  const {content, run} = form(root, client);
  if (!client?.profile) return;
  const profile = client.profile;
  const reloadWith = chosen => {
    if (!client.binding || !client.bindingSaved) throw Object.assign(new Error(), {code: 'vault_binding'});
    client.select(chosen);
    if (!client.bindingSaved) throw Object.assign(new Error(), {code: 'vault_binding'});
    location.reload();
  };
  const edit = async action => {
    if (!await client.flush()) throw Object.assign(new Error(), {code: 'settings_pending'});
    await action();
  };
  const account = node('p', (client.hass.user.name || 'Home Assistant') + ' · ' + profile.name);
  const profileName = node('input');
  profileName.value = profile.name;
  profileName.maxLength = 64;
  content.append(group('Mein Profil', account, ...(client.recovery ? [] : [
    field('Anzeigename', profileName),
    button('Profil umbenennen', () => void run(() => edit(async () => {
      const {profile: renamed} = await client.call('rename', {
        profileId: profile.id, revision: client.revision, requestId: requestId(), name: profileName.value,
      });
      client.profile = renamed;
      client.revision = renamed.revision;
      await refreshProfiles();
      mountMenu(owner);
    }))),
  ])));

  const statusControls = node('div');
  const showConflict = () => {
    statusControls.replaceChildren();
    if (client.status === 'conflict') {
      statusControls.append(node('p', 'Eine andere Sitzung hat dieselben Einstellungen geändert.'));
      statusControls.append(button('Beide Stände vergleichen', () => void run(async () => {
        const {profile: remote} = await client.call('get', {profileId: client.profileId});
        const areas = changedAreas([...Object.keys(client.batch.changes), ...Object.keys(client.pending)]);
        const description = node('p', areas.join(' · ') + ' · Serverstand ' + new Date(remote.updatedAt).toLocaleString());
        const rows = [];
        const decode = (key, raw) => raw == null ? undefined : client.jsonKeys.has(key) ? JSON.parse(raw) : raw;
        for (const key of new Set([...Object.keys(client.batch.changes), ...Object.keys(client.pending)])) {
          const initial = client.batch.changes[key] || client.pending[key];
          compareFields(key, decode(key, initial.before), decode(key, client.getItem(key)), remote.settings[key], rows);
        }
        statusControls.append(description, node('pre', rows.join('\n\n')));
        // Keep a recoverable copy of the local proposal before selecting either version.
        statusControls.append(button('Meine Änderungen sichern', () => fileDownload(
          'gewitterradar-pending.json',
          JSON.stringify({profile: client.profileId, changes: [client.batch?.changes, client.pending]}, null, 2),
        )));
      })));
      for (const [own, label] of [[false, 'Serverstand übernehmen'], [true, 'Meine Änderungen übernehmen']]) {
        statusControls.append(button(label, () => void run(async () => {
          if (!confirm(label + '?')) return;
          if (await client.resolveConflict(own)) location.reload();
        })));
      }
    } else if (client.status === 'reload') {
      statusControls.append(button('Frontend neu laden', () => location.reload()));
    } else if (client.dirty && ['offline', 'error'].includes(client.status)) {
      statusControls.append(button('Erneut speichern', () => void run(() => client.flush())));
    }
  };
  client.addEventListener('change', showConflict);
  const cleanStatus = root.vaultStatusCleanup;
  root.vaultStatusCleanup = () => {
    cleanStatus?.();
    client.removeEventListener('change', showConflict);
  };
  showConflict();
  content.append(statusControls);

  const management = group('Profile verwalten');
  const showProfiles = () => {
    const picker = profileSelect(client.profiles);
    const copyName = node('input');
    copyName.maxLength = 64;
    copyName.value = profile.name + ' – Kopie';
    const scope = selectList([['', 'Alle Einstellungen'], ...AREAS.map(([label], i) => [String(i), label])], 'Zu kopierender Bereich');
    const copyFields = () => scope.value === '' ? {} : {
      keys: [...client.keys].filter(key => AREAS[Number(scope.value)][1].test(key)),
    };
    management.replaceChildren(node('legend', 'Profile verwalten'), picker);
    if (client.recovery) return;
    management.append(
      button('Profil wechseln', () => void run(() => edit(async () => {
        if (picker.value === client.profileId) return;
        if (!confirm('Dieses Profil diesem Gerät zuordnen? Änderungen gelten danach für das gewählte Profil.')) return;
        const {profile: chosen} = await client.call('get', {profileId: picker.value});
        reloadWith(chosen);
      }))),
      disclosure('Kopieren oder duplizieren', scope, field('Name für die Kopie', copyName),
        button('Eigenständige Kopie anlegen', () => void run(() => edit(async () => {
          await client.create('copy', {
            profileId: picker.value, name: copyName.value, ...copyFields(),
          }, {activate: false});
          showProfiles();
        }))),
        button('Auf dieses Geräteprofil kopieren', () => void run(() => edit(async () => {
          if (picker.value === client.profileId) return;
          if (!confirm('Ausgewählte Einstellungen in diesem Profil ersetzen? Der bisherige Stand wird gesichert.')) return;
          const {profile: result} = await client.call('copy', {
            profileId: picker.value, targetId: client.profileId, revision: client.revision,
            requestId: requestId(), ...copyFields(),
          });
          reloadWith(result);
        }))),
      ),
    );
  };
  async function refreshProfiles() {
    const result = await client.call('get');
    client.profiles = result.profiles;
  }
  showProfiles();
  content.append(management);

  const backups = group('Sichern & Wiederherstellen',
    button('Dieses Profil exportieren', () => void run(async () => {
      const {text} = await client.call('export', {profileId: client.profileId});
      fileDownload('gewitterradar-profil.json', text);
    })),
    button('Alle eigenen Profile exportieren', () => void run(async () => {
      const {text} = await client.call('export');
      fileDownload('gewitterradar-profile.json', text);
    })),
  );
  if (!client.recovery) {
    const file = node('input');
    file.type = 'file';
    file.accept = '.json,application/json';
    const preview = node('div');
    file.addEventListener('change', () => void run(async () => {
      preview.replaceChildren();
      const selected = file.files[0];
      if (!selected) return;
      if (selected.size > MAX_IMPORT_BYTES) throw Object.assign(new Error(), {code: 'settings_limit'});
      const text = await selected.text();
      const result = await client.call('import_preview', {text});
      const source = profileSelect(result.profiles);
      const info = node('p');
      const update = () => {
        const record = result.profiles.find(p => p.id === source.value);
        info.textContent = changedAreas(record.settingsKeys).join(' · ') || 'Standardeinstellungen';
      };
      source.addEventListener('change', update);
      update();
      const target = selectList([['new', 'Neues eigenständiges Profil'], ['current', 'Dieses Geräteprofil']], 'Importziel');
      preview.append(source, info, target, button('Import bestätigen', () => void run(() => edit(async () => {
        if (target.value === 'current' && !confirm('Dieses Geräteprofil wiederherstellbar ersetzen?')) return;
        const fields = {text, sha256: result.sha256, sourceId: source.value};
        if (target.value === 'current') {
          const {profile: imported} = await client.call('import_commit', {
            ...fields, requestId: requestId(), profileId: client.profileId, revision: client.revision,
          });
          reloadWith(imported);
        } else {
          await client.create('import_commit', fields, {activate: false});
          showProfiles();
          preview.replaceChildren(node('p', 'Profil importiert.'));
        }
      }))));
    }));
    const snapshots = node('div');
    backups.append(field('Sicherungsdatei prüfen', file), preview,
      button('Gültige Sicherungsstände anzeigen', () => void run(async () => {
        const result = await client.call('snapshots', {profileId: client.profileId});
        snapshots.replaceChildren();
        if (!result.snapshots.length) {
          snapshots.append(node('p', 'Für dieses Profil ist noch kein älterer Stand verfügbar.'));
          return;
        }
        const list = selectList(result.snapshots.map(s => [s.id, new Date(s.createdAt).toLocaleString()]), 'Sicherungsstand');
        snapshots.append(list, button('Stand wiederherstellen', () => void run(() => edit(async () => {
          if (!confirm('Diesen Sicherungsstand wiederherstellen? Der aktuelle Stand wird gesichert.')) return;
          const {profile: restored} = await client.call('restore', {
            profileId: client.profileId, revision: client.revision, snapshotId: list.value, requestId: requestId(),
          });
          reloadWith(restored);
        }))));
      })), snapshots);
  }
  content.append(backups);
  const diagnostic = disclosure('Erweitert',
    node('p', 'Bestätigt am ' + new Date(profile.updatedAt).toLocaleString()),
    node('p', 'Schema ' + 1 + ' · Revision ' + profile.revision),
  );
  if (client.bindingSaved === false) diagnostic.append(node('p', 'Die Gerätezuordnung konnte im Browser nicht gesichert werden.'));
  if (client.migrationIssues?.length) {
    diagnostic.append(node('p', 'Nicht übernommene Originale: ' + client.migrationIssues.join(', ')));
    if (!client.recovery && Object.keys(client.legacy.values).length) {
      diagnostic.append(button('Browsereinstellungen erneut als Profil übernehmen', () => void run(() => edit(async () => {
        const {keys, issues} = await client.call('migration_preview', {legacy: client.legacy.values});
        if (!keys.length) throw Object.assign(new Error(), {code: 'invalid_settings'});
        const summary = keys.length + ' Einstellungsbereiche können übernommen werden.';
        const partial = issues.length ? ' ' + issues.length + ' Bereiche sind unvollständig lesbar.' : '';
        if (!confirm(summary + partial + ' Ein eigenständiges Profil anlegen?')) return;
        await client.create('create', {name: profile.name.slice(0, 48) + ' – Browserimport', legacy: client.legacy.values}, {activate: false});
        showProfiles();
      }))));
    }
  }
  if (client.conflictArchive) diagnostic.append(button('Letzten Konflikt exportieren', () => fileDownload(
    'gewitterradar-konflikt.json', JSON.stringify(client.conflictArchive, null, 2),
  )));
  if (Object.keys(client.legacy.values).length) diagnostic.append(button('Lokale Originaldaten exportieren', () => fileDownload(
    'gewitterradar-browser-recovery.json',
    JSON.stringify({format: 'gewitterradar.legacy-recovery', ...client.legacy}, null, 2),
  )));
  content.append(diagnostic);
}

export function installSettingsVault(Card, compatible) {
  const proto = Card.prototype;
  const setConfig = proto.setConfig;
  const {set: setHass} = Object.getOwnPropertyDescriptor(proto, 'hass');
  const connect = proto.connectedCallback;
  const disconnect = proto.disconnectedCallback;

  function boot(owner) {
    if (!owner.isConnected || owner._vaultBooted || !owner._vaultHass || !owner._vaultConfig) return;
    const client = owner._settingsVault;
    if (client && !client.profile) return;
    const setup = owner.querySelector(':scope > .gr-vault-setup');
    setup?.vaultStatusCleanup?.();
    setup?.remove();
    owner._vaultBooted = true;
    setConfig.call(owner, owner._vaultConfig);
    setHass.call(owner, owner._vaultHass);
    connect.call(owner);
    mountMenu(owner);
  }

  async function init(owner) {
    const hass = owner._vaultHass;
    if (!owner.isConnected || !owner._vaultConfig || !hass || owner._vaultBooted || owner._vaultStarting) return;
    if (!hass.user?.id || typeof hass.callWS !== 'function') {
      if (hass.auth || hass.connection) return;
      boot(owner);
      return;
    }
    owner._vaultStarting = true;
    const slot = acquireSettingsSlot(owner, owner._vaultConfig, hass.user.id);
    const client = owner._settingsVault ||= new SettingsVaultClient(hass, slot, {compatible});
    client.hass = hass;
    client.paused = false;
    const retry = () => init(owner);
    const start = () => boot(owner);
    client.setStatus('loading');
    setupView(owner, retry, start);
    try {
      await client.start();
      if (!owner.isConnected) return;
      if (client.profile) boot(owner);
      else setupView(owner, retry, start);
    } finally {
      owner._vaultStarting = false;
    }
  }

  proto.setConfig = function(config) {
    this._vaultConfig = config || {};
    if (this._vaultBooted) setConfig.call(this, this._vaultConfig);
    else void init(this);
  };
  Object.defineProperty(proto, 'hass', {
    configurable: true,
    get() { return this._vaultHass; },
    set(hass) {
      const old = this._vaultHass;
      if (old?.user?.id && old.user.id !== hass?.user?.id) {
        // This element may still contain the previous user's profile. A fresh
        // document is required before it can be displayed for another user.
        this.style.visibility = 'hidden';
        if (this._settingsVault) this._settingsVault.paused = true;
        location.reload();
        return;
      }
      this._vaultHass = hass;
      if (this._settingsVault) this._settingsVault.hass = hass;
      if (this._vaultBooted) setHass.call(this, hass);
      else void init(this);
    },
  });
  proto.connectedCallback = function() {
    if (this._vaultBooted) {
      if (this._settingsVault) {
        this._settingsVault.paused = false;
        this._settingsVault.schedule();
      }
      connect.call(this);
    } else void init(this);
  };
  proto.disconnectedCallback = function() {
    if (this._settingsVault) {
      releaseSettingsSlot(this, this._settingsVault.slot);
      this._settingsVault.paused = true;
      if (this._settingsVault.dirty) void this._settingsVault.flush();
    }
    if (this._vaultBooted) disconnect.call(this);
  };
}

export function vaultModulesMatch(release, expected, diagnostics) {
  return release.moduleSetId === APPLICATION_RELEASE.moduleSetId
    && release.runtimeRevision === APPLICATION_RELEASE.runtimeRevision
    && diagnostics(expected).ok;
}

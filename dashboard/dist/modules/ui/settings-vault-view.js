import {mountVaultSetup} from './settings-vault-setup.js?v=411224r1';
import {
  acquireSettingsSlot, releaseSettingsSlot, requestId, SettingsVaultClient,
} from '../core/settings-vault.js?v=411231r1';
import {APPLICATION_RELEASE} from '../../version.js?v=411231r1';

const MAX_IMPORT_BYTES = 2 * 1024 * 1024;
const ERRORS = {
  settings_conflict: 'conflictError', settings_limit: 'limitError', settings_not_found: 'notFoundError',
  settings_pending: 'pendingError', settings_reload: 'reloadError', settings_schema: 'schemaError',
  settings_storage: 'storageError', settings_timeout: 'timeoutError', invalid_settings: 'invalidError',
  unknown_command: 'serviceMissing', vault_binding: 'bindingError',
};

const STYLE = '.gr-vault{display:grid;gap:12px;color:inherit}.gr-vault fieldset{display:grid;min-width:0;gap:8px;border:1px solid #cda96645;border-radius:12px;padding:10px;margin:0}.gr-vault legend{padding:0 6px;font-weight:700}.gr-vault :is(button,input,select){box-sizing:border-box;font:inherit;max-width:100%;min-height:38px;border:1px solid #cda96665;border-radius:8px;background:#17212d;color:#f5e6ca;padding:7px 10px}.gr-vault button{cursor:pointer;text-align:left;font-weight:650}.gr-vault button:disabled{opacity:.5;cursor:default}.gr-vault :focus-visible{outline:2px solid #efce86;outline-offset:2px}.gr-vault label,.gr-vault details[open]{display:grid;gap:6px}.gr-vault input[type=checkbox]{min-height:0;justify-self:start}.gr-vault .gr-vault-row{display:flex;flex-wrap:wrap;gap:8px}.gr-vault p{margin:0;overflow-wrap:anywhere}.gr-vault summary{cursor:pointer;padding:7px 0}.gr-vault [role=status]{color:#efce86}.gr-vault [role=alert]:empty{display:none}.gr-vault pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:12rem;overflow:auto}';

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

function profileSelect(profiles, t) {
  return selectList(profiles.map(item => [item.id, item.name]), t('deviceProfile'));
}

function fileDownload(filename, text) {
  const link = node('a');
  const url = URL.createObjectURL(new Blob([text], {type: 'application/json'}));
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function safeError(error, t) {
  return t(ERRORS[error?.code] || 'genericError');
}

function form(root, client, t) {
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
    status.textContent = t(client?.status ?? 'local');
    if (client?.error) error.textContent = safeError(client.error, t);
    else if (client?.dirty && client.queueSaved === false) error.textContent = t('volatile');
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
    catch (err) { error.textContent = safeError(err, t); }
    finally {
      delete content.dataset.busy;
      buttons.forEach(element => { element.disabled = false; });
    }
  };
  return {content, run, error};
}

const AREAS = [
  ['areaEye', /eye-bubble|premium-ui:v1:eye-hub/],
  ['areaWind', /wind-ui|wind-studio|premium-ui:v1:(?:weather-)?wind-/],
  ['areaTemperature', /temperature-ui|premium-ui:v1:(?:weather-)?(?:temperature|advection)-/],
  ['areaPrecipitation', /weather-(?:display|legend|engine)|premium-ui:v1:precipitation/],
  ['areaMap', /^(?!.*(?:eye-bubble|wind-ui|wind-studio|temperature-ui|weather-(?:display|legend|engine)|premium-ui:v1:)).*$/],
];

function changedAreas(keys, t) {
  return AREAS.filter(([, pattern]) => keys.some(key => pattern.test(key))).map(([key]) => t(key));
}

function compareFields(label, before, mine, server, rows, t) {
  if (JSON.stringify(before) === JSON.stringify(mine)) return;
  if ([before, mine, server].every(value => value == null || value?.constructor === Object)
      && [before, mine, server].some(value => value != null)) {
    for (const key of new Set([...Object.keys(before || {}), ...Object.keys(mine || {})])) {
      compareFields(label + ' / ' + key, before?.[key], mine?.[key], server?.[key], rows, t);
    }
    return;
  }
  const text = value => value === undefined ? '–' : typeof value === 'string' ? value : JSON.stringify(value);
  rows.push(label + '\n  ' + t('thisTab') + ': ' + text(mine) + '\n  ' + t('server') + ': ' + text(server));
}

function mountMenu(owner) {
  const root = owner.shadow?.getElementById('gr-vault-content');
  if (!root) return;
  const t = (key, vars) => owner._t('vault.' + key, vars);
  root.dataset.vaultLanguage = owner._languageValue();
  const title = root.parentElement.querySelector('.settings-section-title');
  if (title) title.textContent = t('title');
  const client = owner._settingsVault;
  const {content, run} = form(root, client, t);
  if (client?.localOnly) {
    content.append(node('p', t('localReadOnly')),
      button(t('connect'), () => location.reload()));
    return;
  }
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
  content.append(group(t('myProfile'), account, ...(client.recovery ? [] : [
    field(t('displayName'), profileName),
    button(t('rename'), () => void run(() => edit(async () => {
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
      statusControls.append(node('p', t('conflictHelp')));
      statusControls.append(button(t('compare'), () => void run(async () => {
        const {profile: remote} = await client.call('get', {profileId: client.profileId});
        const areas = changedAreas([...Object.keys(client.batch.changes), ...Object.keys(client.pending)], t);
        const description = node('p', areas.join(' · ') + ' · ' + t('serverVersion', {date: new Date(remote.updatedAt).toLocaleString(owner._locale())}));
        const rows = [];
        const decode = (key, raw) => raw == null ? undefined : client.jsonKeys.has(key) ? JSON.parse(raw) : raw;
        for (const key of new Set([...Object.keys(client.batch.changes), ...Object.keys(client.pending)])) {
          const initial = client.batch.changes[key] || client.pending[key];
          compareFields(key, decode(key, initial.before), decode(key, client.getItem(key)), remote.settings[key], rows, t);
        }
        statusControls.append(description, node('pre', rows.join('\n\n')));
        // Keep a recoverable copy of the local proposal before selecting either version.
        statusControls.append(button(t('backupMine'), () => fileDownload(
          'gewitterradar-pending.json',
          JSON.stringify({profile: client.profileId, changes: [client.batch?.changes, client.pending]}, null, 2),
        )));
      })));
      for (const [own, label] of [[false, t('useServer')], [true, t('useMine')]]) {
        statusControls.append(button(label, () => void run(async () => {
          if (!confirm(t(own ? 'confirmMine' : 'confirmServer'))) return;
          if (await client.resolveConflict(own)) location.reload();
        })));
      }
    } else if (client.status === 'reload') {
      statusControls.append(button(t('reload'), () => location.reload()));
    } else if (client.dirty && ['offline', 'error'].includes(client.status)) {
      statusControls.append(button(t('saveAgain'), () => void run(() => client.flush())));
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

  const management = group(t('manage'));
  const showProfiles = () => {
    const picker = profileSelect(client.profiles, t);
    const copyName = node('input');
    copyName.maxLength = 64;
    copyName.value = t('copySuffix', {name: profile.name});
    const scope = selectList([['', t('allSettings')], ...AREAS.map(([key], i) => [String(i), t(key)])], t('copyScope'));
    const copyFields = () => scope.value === '' ? {} : {
      keys: [...client.keys].filter(key => AREAS[Number(scope.value)][1].test(key)),
    };
    management.replaceChildren(node('legend', t('manage')), picker);
    if (client.recovery) return;
    management.append(
      button(t('switch'), () => void run(() => edit(async () => {
        if (picker.value === client.profileId) return;
        if (!confirm(t('confirmLink'))) return;
        const {profile: chosen} = await client.call('get', {profileId: picker.value});
        reloadWith(chosen);
      }))),
      disclosure(t('copyOrDuplicate'), scope, field(t('copyName'), copyName),
        button(t('makeCopy'), () => void run(() => edit(async () => {
          await client.create('copy', {
            profileId: picker.value, name: copyName.value, ...copyFields(),
          }, {activate: false});
          showProfiles();
        }))),
        button(t('copyToDevice'), () => void run(() => edit(async () => {
          if (picker.value === client.profileId) return;
          if (!confirm(t('confirmCopy'))) return;
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

  const backups = group(t('backupRestore'),
    button(t('exportThis'), () => void run(async () => {
      const {text} = await client.call('export', {profileId: client.profileId});
      fileDownload('gewitterradar-profil.json', text);
    })),
    button(t('exportAll'), () => void run(async () => {
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
      const source = profileSelect(result.profiles, t);
      const info = node('p');
      const update = () => {
        const record = result.profiles.find(p => p.id === source.value);
        info.textContent = changedAreas(record.settingsKeys, t).join(' · ') || t('defaultSettings');
      };
      source.addEventListener('change', update);
      update();
      const target = selectList([['new', t('newIndependent')], ['current', t('currentDevice')]], t('importTarget'));
      preview.append(source, info, target, button(t('confirmImportButton'), () => void run(() => edit(async () => {
        if (target.value === 'current' && !confirm(t('confirmImport'))) return;
        const fields = {text, sha256: result.sha256, sourceId: source.value};
        if (target.value === 'current') {
          const {profile: imported} = await client.call('import_commit', {
            ...fields, requestId: requestId(), profileId: client.profileId, revision: client.revision,
          });
          reloadWith(imported);
        } else {
          await client.create('import_commit', fields, {activate: false});
          showProfiles();
          preview.replaceChildren(node('p', t('imported')));
        }
      }))));
    }));
    const snapshots = node('div');
    backups.append(field(t('reviewBackup'), file), preview,
      button(t('showSnapshots'), () => void run(async () => {
        const result = await client.call('snapshots', {profileId: client.profileId});
        snapshots.replaceChildren();
        if (!result.snapshots.length) {
          snapshots.append(node('p', t('noSnapshots')));
          return;
        }
        const list = selectList(result.snapshots.map(s => [s.id, new Date(s.createdAt).toLocaleString()]), t('snapshot'));
        snapshots.append(list, button(t('restore'), () => void run(() => edit(async () => {
          if (!confirm(t('confirmRestore'))) return;
          const {profile: restored} = await client.call('restore', {
            profileId: client.profileId, revision: client.revision, snapshotId: list.value, requestId: requestId(),
          });
          reloadWith(restored);
        }))));
      })), snapshots);
  }
  content.append(backups);
  const diagnostic = disclosure(t('advanced'),
    node('p', t('confirmed', {date: new Date(profile.updatedAt).toLocaleString(owner._locale())})),
    node('p', 'Schema ' + 1 + ' · Revision ' + profile.revision),
  );
  if (client.bindingSaved === false) diagnostic.append(node('p', t('bindingUnsaved')));
  if (client.migrationIssues?.length) {
    diagnostic.append(node('p', t('originalsSkipped', {areas: client.migrationIssues.join(', ')})));
    if (!client.recovery && Object.keys(client.legacy.values).length) {
      diagnostic.append(button(t('retryImport'), () => void run(() => edit(async () => {
        const {keys, issues} = await client.call('migration_preview', {legacy: client.legacy.values});
        if (!keys.length) throw Object.assign(new Error(), {code: 'invalid_settings'});
        const summary = t('importable', {count: keys.length});
        const partial = issues.length ? ' ' + t('partialAreas', {count: issues.length}) : '';
        if (!confirm(summary + partial + ' ' + t('confirmSeparate'))) return;
        await client.create('create', {name: t('browserImportSuffix', {name: profile.name.slice(0, 48)}).slice(0, 64), legacy: client.legacy.values}, {activate: false});
        showProfiles();
      }))));
    }
  }
  if (client.conflictArchive) diagnostic.append(button(t('exportConflict'), () => fileDownload(
    'gewitterradar-konflikt.json', JSON.stringify(client.conflictArchive, null, 2),
  )));
  if (Object.keys(client.legacy.values).length) diagnostic.append(button(t('exportLocal'), () => fileDownload(
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

  function renderHass(owner) {
    owner._vaultRenderedHass = owner._vaultHass;
    setHass.call(owner, owner._vaultHass);
  }

  function resume(owner) {
    if (owner._vaultActive || !owner.isConnected) return;
    owner._vaultActive = true;
    if (owner._vaultRenderedHass !== owner._vaultHass) renderHass(owner);
    const client = owner._settingsVault;
    if (client && !client.localOnly) {
      client.paused = false;
      client.schedule();
    }
    connect.call(owner);
  }

  function boot(owner) {
    if (!owner.isConnected || owner._vaultBooted || owner._vaultReloading) return;
    const client = owner._settingsVault;
    if (client && !client.profile && !client.localOnly) return;
    owner._vaultSetup?.remove();
    owner._vaultSetup = null;
    owner._vaultBooted = true;
    setConfig.call(owner, owner._vaultConfig);
    resume(owner);
    mountMenu(owner);
  }

  async function lookup(owner, retry = false) {
    const client = owner._settingsVault;
    const flight = client.start({retry});
    owner._vaultSetup?.present();
    await flight;
    if (owner._vaultReloading || owner._settingsVault !== client) return;
    owner._vaultSetup?.present();
    if (client.profile) boot(owner);
  }

  function initialize(owner) {
    const hass = owner._vaultHass;
    if (!owner.isConnected || !owner._vaultConfig || !hass || owner._vaultBooted || owner._vaultReloading) return;
    // Once a client owns startup, HA state churn may refresh its transport but
    // cannot restart profile resolution or replace the setup.
    if (owner._settingsVault) {
      boot(owner);
      return;
    }
    if (!hass.user?.id || typeof hass.callWS !== 'function') {
      if (hass.auth || hass.connection) return;
      boot(owner);
      return;
    }
    const slot = acquireSettingsSlot(owner, owner._vaultConfig, hass.user.id);
    const client = owner._settingsVault = new SettingsVaultClient(hass, slot, {compatible});
    client.paused = true;
    owner._vaultSetup = mountVaultSetup(owner, client, {
      retry: () => lookup(owner, true), boot: () => boot(owner),
      safeError: error => safeError(error, key => owner._t('vault.' + key)), fileDownload,
    });
    void lookup(owner);
  }

  proto._syncVaultLanguage = function() {
    const root = this.shadow?.getElementById('gr-vault-content');
    if (!this._vaultBooted || !root || root.dataset.vaultLanguage === this._languageValue()
        || root.querySelector('[data-busy="true"]')) return;
    mountMenu(this);
  };

  proto.setConfig = function(config) {
    this._vaultConfig = config || {};
    if (this._vaultReloading) return;
    if (this._vaultBooted) setConfig.call(this, this._vaultConfig);
    else initialize(this);
  };
  Object.defineProperty(proto, 'hass', {
    configurable: true,
    get() { return this._vaultHass; },
    set(hass) {
      if (this._vaultReloading) return;
      const user = hass?.user?.id;
      const previous = this._vaultHass?.user?.id;
      if (previous && !user) return;
      if (previous && previous !== user) {
        this._vaultReloading = true;
        this.style.visibility = 'hidden';
        this._settingsVault?.retire();
        location.reload();
        return;
      }
      this._vaultHass = hass;
      if (this._settingsVault) this._settingsVault.hass = hass;
      if (this._vaultActive) renderHass(this);
      else initialize(this);
    },
  });
  proto.connectedCallback = function() {
    this._vaultSetup?.connect();
    const client = this._settingsVault;
    if (client?.slot) {
      const slot = acquireSettingsSlot(this, this._vaultConfig, client.userId);
      if (slot !== client.slot) {
        releaseSettingsSlot(this, slot);
        client.binding = null;
        client.bindingSaved = false;
      }
    }
    if (this._vaultBooted && !this._vaultReloading) resume(this);
    else initialize(this);
  };
  proto.disconnectedCallback = function() {
    this._vaultSetup?.disconnect();
    const client = this._settingsVault;
    if (client) {
      releaseSettingsSlot(this, client.slot);
      client.paused = true;
      if (client.dirty && !client.retired) void client.flush();
    }
    if (this._vaultActive) {
      this._vaultActive = false;
      disconnect.call(this);
    }
  };
}

export function vaultModulesMatch(release, expected, diagnostics) {
  return release.moduleSetId === APPLICATION_RELEASE.moduleSetId
    && release.runtimeRevision === APPLICATION_RELEASE.runtimeRevision
    && diagnostics(expected).ok;
}

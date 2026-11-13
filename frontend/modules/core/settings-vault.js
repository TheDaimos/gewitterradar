import {APPLICATION_RELEASE} from '../../version.js?v=411207r1';

export const VAULT_SCHEMA = 1;
const PREFIX = 'gewitterradar/settings/';
const LOCAL_PREFIX = 'gewitterradar:vault:v1:';
const MAX_BYTES = 192 * 1024;
const MAX_QUEUE = 2 * MAX_BYTES;
const encoder = new TextEncoder();
const usedSlots = new Map();

export function settingsStorage(owner) {
  return owner?._settingsVault ?? globalThis.localStorage;
}

export function requestId() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), value => value.toString(16).padStart(2, '0')).join('');
}

function bytes(text) {
  return encoder.encode(text).byteLength;
}

function localRead(storage, key) {
  try { return storage().getItem(key); }
  catch { return null; }
}

function localWrite(storage, key, value) {
  try {
    if (value == null) storage().removeItem(key);
    else storage().setItem(key, value);
    return true;
  } catch { return false; }
}

function readLocalJson(storage, key) {
  try { return JSON.parse(localRead(storage, key)); }
  catch { return null; }
}

function rawSettings(profile) {
  return Object.fromEntries(Object.entries(profile.settings).map(([key, value]) => [
    key, typeof value === 'string' ? value : JSON.stringify(value),
  ]));
}

function codeError(code) {
  return Object.assign(new Error(code), {code});
}

function validProfileId(id) {
  return typeof id === 'string' && /^[0-9a-f]{32}$/.test(id);
}

function validProfileHeader(profile) {
  return validProfileId(profile?.id)
    && typeof profile.name === 'string' && Number.isSafeInteger(profile.revision) && profile.revision > 0;
}

export function acquireSettingsSlot(owner, config, userId) {
  // The installation's own panel has a fixed slot. Lovelace can supply an
  // explicit slot; the first unlabelled card on each route gets a shared slot.
  const instance = typeof config?.settings_vault_id === 'string' ? config.settings_vault_id.trim().slice(0, 80) : '';
  const route = location.pathname.replace(/\/+$/, '');
  const slot = encodeURIComponent(JSON.stringify([userId, route, instance]));
  const existing = usedSlots.get(slot);
  if (existing && existing !== owner && existing.isConnected) return null;
  usedSlots.set(slot, owner);
  return slot;
}

export function releaseSettingsSlot(owner, slot) {
  if (slot && usedSlots.get(slot) === owner) usedSlots.delete(slot);
}

export class SettingsVaultClient extends EventTarget {
  constructor(hass, slot, {
    storage = () => globalThis.localStorage,
    session = () => globalThis.sessionStorage,
    compatible = () => true,
    delay = 350,
  } = {}) {
    super();
    this.hass = hass;
    this.userId = hass.user.id;
    this.slot = slot;
    this.storage = storage;
    this.session = session;
    this.compatible = compatible;
    this.delay = delay;
    this.binding = slot ? LOCAL_PREFIX + 'binding:' + slot : null;
    const bound = this.binding ? localRead(this.storage, this.binding) : null;
    this.profileId = validProfileId(bound) ? bound : null;
    this.status = 'loading';
    this.keys = new Set();
    this.jsonKeys = new Set();
    this.queueScope = slot || requestId();
    this.profiles = [];
    this.visible = {};
    this.pending = {};
    this.legacy = {values: {}, unreadable: [], unavailable: false};
  }

  setStatus(status, error = null) {
    if (this.status === status && this.error === error) return;
    this.status = status;
    this.error = error;
    this.dispatchEvent(new Event('change'));
  }

  async call(op, request = {}) {
    if (this.retired || this.hass.user?.id !== this.userId) throw codeError('unauthorized');
    if (this.localOnly) throw codeError('settings_unavailable');
    if (!this.compatible()) throw codeError('settings_reload');
    let timer;
    try {
      const result = await Promise.race([
        this.hass.callWS({
          type: PREFIX + op, schema: VAULT_SCHEMA, build: APPLICATION_RELEASE.version, request,
        }),
        new Promise((_, reject) => { timer = setTimeout(() => reject(codeError('settings_timeout')), 12000); }),
      ]);
      if (this.retired || this.hass.user?.id !== this.userId) throw codeError('unauthorized');
      return result;
    } finally {
      clearTimeout(timer);
    }
  }

  start({retry = false} = {}) {
    if (this.starting) return this.starting;
    if (this.retired || this.localOnly || (this.started && !(retry && this.canRetry))) {
      return Promise.resolve(this.profile);
    }
    this.started = true;
    this.starting = Promise.resolve().then(() => this.load()).finally(() => { this.starting = null; });
    this.setStatus('loading');
    return this.starting;
  }

  get canRetry() {
    return !this.profile && !this.localOnly && ['offline', 'error'].includes(this.status);
  }

  get canOpenLocal() {
    return this.canRetry && !this.retired && this.compatible() && this.error?.code !== 'unauthorized';
  }

  openLocal() {
    if (!this.canOpenLocal || this.starting) throw codeError('settings_unavailable');
    this.localOnly = true;
    this.paused = true;
    this.setStatus('local');
  }

  retire() {
    this.retired = true;
    this.paused = true;
    clearTimeout(this.timer);
  }

  readLookup(result) {
    if (!result || typeof result !== 'object') throw codeError('settings_storage');
    if (result.schema !== VAULT_SCHEMA) throw codeError('settings_schema');
    if (!Array.isArray(result.settingsKeys) || !result.settingsKeys.every(key => typeof key === 'string')
      || !Array.isArray(result.jsonSettingsKeys) || !result.jsonSettingsKeys.every(key => result.settingsKeys.includes(key))
      || !Array.isArray(result.profiles) || !result.profiles.every(validProfileHeader)
      || typeof result.recovery !== 'boolean') throw codeError('settings_storage');
    this.keys = new Set(result.settingsKeys);
    this.jsonKeys = new Set(result.jsonSettingsKeys);
    this.profiles = result.profiles;
    this.recovery = result.recovery;
    this.migrationIssues = Array.isArray(result.migrationIssues) ? result.migrationIssues : [];
  }

  validateProfile(profile, expectedId = profile?.id) {
    if (!validProfileHeader(profile) || profile.id !== expectedId || !profile.settings
      || Object.getPrototypeOf(profile.settings) !== Object.prototype) throw codeError('settings_storage');
    for (const [key, value] of Object.entries(profile.settings)) {
      if (!this.keys.has(key) || (this.jsonKeys.has(key)
        ? !value || Object.getPrototypeOf(value) !== Object.prototype
        : typeof value !== 'string')) throw codeError('settings_storage');
    }
  }

  async load() {
    let result;
    try {
      try {
        result = await this.call('get', this.profileId ? {profileId: this.profileId} : {});
      } catch (error) {
        if (!this.profileId || error?.code !== 'settings_not_found') throw error;
        this.profileId = null;
        result = await this.call('get');
      }
      this.readLookup(result);
      this.legacy = this.readLegacy();
      if (this.profileId) {
        this.validateProfile(result.profile, this.profileId);
        this.hydrate(result.profile);
      }
      else this.setStatus(result.recovery ? 'recovery' : 'choose');
    } catch (error) {
      this.setStatus(this.failureStatus(error), error);
    }
    return this.profile;
  }

  async choose(profileId) {
    const result = await this.call('get', {profileId});
    this.readLookup(result);
    this.validateProfile(result.profile, profileId);
    if (result.recovery) this.hydrate(result.profile);
    else this.select(result.profile);
  }

  readLegacy() {
    const values = {};
    const unreadable = [];
    let unavailable = false;
    for (const key of this.keys) {
      try {
        const value = this.storage().getItem(key);
        if (value == null) continue;
        values[key] = value;
        if (this.jsonKeys.has(key)) {
          try { JSON.parse(value); } catch { unreadable.push(key); }
        }
      } catch {
        unavailable = true;
      }
    }
    return {values, unreadable, unavailable};
  }

  get queueKey() {
    return LOCAL_PREFIX + 'pending:' + this.queueScope + ':' + this.profileId;
  }

  get conflictArchive() {
    return readLocalJson(this.session, this.queueKey + ':conflict');
  }

  hydrate(profile) {
    this.validateProfile(profile);
    this.profile = profile;
    this.profileId = profile.id;
    if (this.bindingSaved === undefined) {
      this.bindingSaved = Boolean(this.binding && localRead(this.storage, this.binding) === profile.id);
    }
    this.revision = profile.revision;
    this.visible = rawSettings(profile);
    const queued = readLocalJson(this.session, this.queueKey);
    this.batch = null;
    this.pending = {};
    if (!this.recovery && queued?.profileId === profile.id) {
      this.batch = queued.batch;
      this.pending = queued.pending || {};
      for (const changes of [this.batch?.changes || {}, this.pending]) {
        for (const [key, pair] of Object.entries(changes)) {
          if (!this.keys.has(key)) continue;
          const value = this.jsonKeys.has(key)
            ? forceChangedFields(this.getItem(key), pair.before, pair.after) : pair.after;
          if (value === null) delete this.visible[key];
          else this.visible[key] = value;
        }
      }
    }
    this.pendingRevision = queued?.pendingRevision ?? this.revision;
    this.setStatus(this.recovery ? 'recovery' : this.dirty ? 'saving' : 'saved');
    this.schedule();
  }

  // Keep the persisted binding and the idempotence receipt separate. A retry
  // after a lost reply can find the same profile without persisting any settings here.
  async create(op, fields, {activate = true} = {}) {
    const receiptKey = this.binding ? this.binding + ':creating' : null;
    const token = JSON.stringify([op, fields.name, fields.profileId, fields.keys, fields.sourceId, fields.sha256, Boolean(fields.legacy)]);
    let receipt = this.creation;
    if (receipt?.token !== token) {
      const persisted = receiptKey && readLocalJson(this.session, receiptKey);
      receipt = persisted?.token === token ? persisted : {token, requestId: requestId()};
      this.creation = receipt;
      if (receiptKey) localWrite(this.session, receiptKey, JSON.stringify(receipt));
    }
    const result = await this.call(op, {...fields, requestId: receipt.requestId});
    this.validateProfile(result?.profile);
    const checked = await this.call('get', {profileId: result.profile.id});
    this.validateProfile(checked?.profile, result.profile.id);
    if (checked.schema !== VAULT_SCHEMA || checked.recovery || checked.profile.revision < result.profile.revision) {
      throw codeError('settings_storage');
    }
    this.profiles = checked.profiles;
    if (activate) {
      this.select(checked.profile);
      this.migrationIssues = checked.migrationIssues || result.migrationIssues || [];
    }
    if (receiptKey) localWrite(this.session, receiptKey, null);
    this.creation = null;
    return checked.profile;
  }

  select(profile) {
    if (this.dirty) throw codeError('settings_pending');
    this.validateProfile(profile);
    this.bindingSaved = this.binding ? localWrite(this.storage, this.binding, profile.id) : false;
    this.hydrate(profile);
  }

  get dirty() {
    return !!this.batch || Object.keys(this.pending).length > 0;
  }

  getItem(key) {
    if (this.localOnly) return localRead(this.storage, key);
    return Object.hasOwn(this.visible, key) ? this.visible[key] : null;
  }

  setItem(key, value) {
    this.change(key, String(value));
  }

  removeItem(key) {
    this.change(key, null);
  }

  change(key, after) {
    if (this.retired || !this.profile || this.recovery) {
      throw codeError(this.recovery ? 'settings_storage' : 'settings_unavailable');
    }
    if (!this.compatible() || !this.keys.has(key)) {
      this.setStatus('reload', codeError('settings_reload'));
      throw this.error;
    }
    const before = this.getItem(key);
    if (before === after) return;
    const original = Object.hasOwn(this.pending, key) ? this.pending[key].before : before;
    const next = {...this.pending};
    if (original === after) delete next[key];
    else next[key] = {before: original, after};
    if (bytes(JSON.stringify(next)) > MAX_QUEUE) {
      this.setStatus('error', codeError('settings_limit'));
      throw this.error;
    }
    if (!Object.keys(this.pending).length) this.pendingRevision = this.revision;
    this.pending = next;
    if (after === null) delete this.visible[key];
    else this.visible[key] = after;
    this.checkpoint();
    if (this.status !== 'conflict') {
      this.setStatus(this.dirty ? 'saving' : 'saved');
      this.schedule();
    }
  }

  checkpoint() {
    const payload = this.dirty ? JSON.stringify({
      profileId: this.profileId, batch: this.batch, pending: this.pending, pendingRevision: this.pendingRevision,
    }) : null;
    this.queueSaved = (!payload || bytes(payload) <= 2 * MAX_QUEUE)
      && localWrite(this.session, this.queueKey, payload);
  }

  schedule(delay = this.delay) {
    clearTimeout(this.timer);
    if (this.dirty && !this.recovery && !this.paused && this.status !== 'conflict') {
      this.timer = setTimeout(() => { void this.flush(); }, delay);
    }
  }

  flush() {
    if (this.inFlight) return this.inFlight;
    clearTimeout(this.timer);
    this.inFlight = this.sendPending().finally(() => { this.inFlight = null; });
    return this.inFlight;
  }

  async sendPending() {
    if (!this.dirty || this.recovery || this.status === 'conflict') return !this.dirty;
    while (this.dirty) {
      if (!this.batch) {
        this.batch = {
          profileId: this.profileId, requestId: requestId(), revision: this.pendingRevision, changes: this.pending,
        };
        this.pending = {};
      }
      this.checkpoint();
      this.setStatus('saving');
      try {
        const {profile} = await this.call('patch', this.batch);
        this.revision = profile.revision;
        this.profile = profile;
        this.batch = null;
        // Edits made during the request were based on its optimistic result.
        // Keep their previous revision if other writers also advanced the profile.
        if (!Object.keys(this.pending).length) this.pendingRevision = this.revision;
        this.checkpoint();
      } catch (error) {
        this.setStatus(this.failureStatus(error), error);
        if (this.status === 'offline') this.schedule(3000);
        return false;
      }
    }
    this.setStatus('saved');
    return true;
  }

  failureStatus(error) {
    if (error?.code === 'settings_conflict') return 'conflict';
    if (['settings_reload', 'settings_schema'].includes(error?.code)) return 'reload';
    if (['settings_storage', 'settings_limit', 'invalid_settings', 'unknown_command', 'unauthorized'].includes(error?.code)) return 'error';
    return 'offline';
  }

  async resolveConflict(keepOwn) {
    if (this.status !== 'conflict' || !this.batch) return false;
    const {profile, recovery} = await this.call('get', {profileId: this.profileId});
    if (recovery) throw codeError('settings_storage');
    const current = rawSettings(profile);
    const changed = new Set([...Object.keys(this.batch.changes), ...Object.keys(this.pending)]);
    const archive = JSON.stringify({
      profile: this.profileId, revision: profile.revision, savedAt: new Date().toISOString(),
      server: Object.fromEntries([...changed].map(key => [key, current[key] ?? null])),
      changes: [this.batch.changes, this.pending],
    });
    if (bytes(archive) <= 2 * MAX_QUEUE) localWrite(this.session, this.queueKey + ':conflict', archive);
    if (!keepOwn) {
      this.batch = null;
      this.pending = {};
      this.checkpoint();
      this.hydrate(profile);
      return true;
    }

    // Rebase only the actual changed leaves. Preserve unrelated remote edits.
    const rebased = {...current};
    for (const changes of [this.batch.changes, this.pending]) {
      for (const [key, pair] of Object.entries(changes)) {
        const merged = forceChangedFields(rebased[key] ?? null, pair.before, pair.after);
        if (merged === null) delete rebased[key];
        else rebased[key] = merged;
      }
    }
    this.batch = null;
    this.pending = Object.fromEntries(
      [...new Set([...Object.keys(current), ...Object.keys(rebased)])]
        .filter(key => current[key] !== rebased[key])
        .map(key => [key, {before: current[key] ?? null, after: rebased[key] ?? null}]),
    );
    this.revision = profile.revision;
    this.pendingRevision = this.revision;
    this.profile = profile;
    this.visible = rebased;
    this.checkpoint();
    this.setStatus('saving');
    return this.flush();
  }
}

function parsedObject(raw) {
  try {
    const value = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch { return null; }
}

function forceChangedFields(current, before, after) {
  if (before === after) return current;
  const target = parsedObject(after);
  const base = parsedObject(before);
  if (!target || (before !== null && !base)) return after;
  const merged = {...parsedObject(current)};
  for (const key of new Set([...Object.keys(base || {}), ...Object.keys(target)])) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) continue;
    const value = forceChangedFields(
      Object.hasOwn(merged, key) ? JSON.stringify(merged[key]) : null,
      base && Object.hasOwn(base, key) ? JSON.stringify(base[key]) : null,
      Object.hasOwn(target, key) ? JSON.stringify(target[key]) : null,
    );
    if (value === null) delete merged[key];
    else merged[key] = JSON.parse(value);
  }
  return JSON.stringify(merged);
}

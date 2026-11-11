import test from 'node:test';
import assert from 'node:assert/strict';

import {SettingsVaultClient} from '../frontend/modules/core/settings-vault.js';

const KEY = 'gewitterradar:eye-bubble:v1';
const ID = 'ca'.repeat(16);
const payload = {
  id: ID, name: 'Telefon', revision: 1, updatedAt: '2026-11-11T10:00:00Z',
  settings: {[KEY]: {grouped: true, eyeAuraGap: 19, auraRingGap: 7}},
};
function storage() {
  const data = new Map();
  return {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: key => data.delete(key),
  };
}
const exception = code => Object.assign(new Error(code), {code});

function environment({remote = structuredClone(payload), onGet, onPatch, compatible = () => true} = {}) {
  const local = storage();
  const session = storage();
  local.setItem('gewitterradar:vault:v1:binding:scope', ID);
  local.setItem(KEY, '{"grouped":false}');
  const calls = [];
  const hass = {
    user: {id: 'user-1'},
    callWS: async message => {
      calls.push(message);
      if (message.type.endsWith('/get')) {
        await onGet?.(message.request);
        return {
          schema: 1, settingsKeys: [KEY], jsonSettingsKeys: [KEY], recovery: false,
          profiles: [remote], profile: structuredClone(remote),
        };
      }
      await onPatch?.(message.request);
      remote.settings[KEY] = JSON.parse(message.request.changes[KEY].after);
      remote.revision++;
      return {profile: structuredClone(remote)};
    },
  };
  const makeClient = () => {
    const client = new SettingsVaultClient(hass, 'scope', {storage: () => local, session: () => session, compatible});
    client.paused = true; // Drive retries deterministically.
    return client;
  };
  return {local, session, calls, remote, makeClient};
}

test('profile hydration precedes writes and old keys stay read-only', async () => {
  const {makeClient, local, calls} = environment();
  const client = makeClient();
  assert.throws(() => client.setItem(KEY, '{}'), {code: 'settings_unavailable'});
  assert.equal(calls.length, 0);
  await client.start();
  assert.equal(client.status, 'saved');
  assert.equal(JSON.parse(client.getItem(KEY)).grouped, true);
  client.setItem(KEY, '{"grouped":true,"eyeAuraGap":25,"auraRingGap":7}');
  assert.equal(client.status, 'saving');
  assert.equal(await client.flush(), true);
  assert.equal(client.status, 'saved');
  assert.equal(local.getItem(KEY), '{"grouped":false}');
  assert.equal(calls[1].request.revision, 1);
});

test('pending batch survives reload and retries with the same request identity', async () => {
  let fail = true;
  const {makeClient, remote, calls} = environment({
    onPatch: () => { if (fail) throw exception('disconnected'); },
  });
  const first = makeClient();
  await first.start();
  first.setItem(KEY, '{"grouped":true,"eyeAuraGap":22,"auraRingGap":7}');
  assert.equal(await first.flush(), false);
  assert.equal(first.status, 'offline');
  const original = calls.at(-1).request;
  const second = makeClient();
  await second.start();
  assert.equal(JSON.parse(second.getItem(KEY)).eyeAuraGap, 22);
  fail = false;
  assert.equal(await second.flush(), true);
  assert.deepEqual(calls.at(-1).request, original);
  assert.equal(remote.settings[KEY].eyeAuraGap, 22);
  assert.equal(second.dirty, false);
});

test('a conflict retains both proposals and explicit retry preserves disjoint fields', async () => {
  let conflict = true;
  const {makeClient, remote} = environment({
    onPatch: () => { if (conflict) throw exception('settings_conflict'); },
  });
  const client = makeClient();
  await client.start();
  client.setItem(KEY, '{"grouped":true,"eyeAuraGap":28,"auraRingGap":7}');
  remote.settings[KEY].eyeAuraGap = 5;
  remote.settings[KEY].auraRingGap = 4;
  remote.revision++;
  assert.equal(await client.flush(), false);
  assert.equal(client.status, 'conflict');
  assert.equal(JSON.parse(client.getItem(KEY)).eyeAuraGap, 28);
  conflict = false;
  assert.equal(await client.resolveConflict(true), true);
  assert.equal(JSON.parse(client.conflictArchive.server[KEY]).eyeAuraGap, 5);
  assert.equal(remote.settings[KEY].eyeAuraGap, 28);
  assert.equal(remote.settings[KEY].auraRingGap, 4);
});

test('mixed module identity and schema incompatibility fail before any patch', async () => {
  const {makeClient, calls} = environment({compatible: () => false});
  const client = makeClient();
  await client.start();
  assert.equal(client.status, 'reload');
  assert.equal(calls.length, 0);
});

test('startup shares one read and only an explicit retry restarts a failed lookup', async () => {
  let fail = true;
  let release;
  const waiting = new Promise(resolve => { release = resolve; });
  const {makeClient, calls} = environment({onGet: async () => {
    await waiting;
    if (fail) throw exception('disconnected');
  }});
  const client = makeClient();
  const initial = client.start();
  assert.strictEqual(client.start(), initial);
  assert.strictEqual(client.start({retry: true}), initial);
  release();
  await initial;
  assert.equal(client.status, 'offline');
  await client.start();
  assert.equal(calls.length, 1);
  fail = false;
  await client.start({retry: true});
  assert.equal(client.status, 'saved');
  assert.equal(calls.length, 2);
  await client.start({retry: true});
  assert.equal(calls.length, 2);
});

test('malformed profiles are rejected before hydration and local recovery cannot persist', async () => {
  const remote = {...payload, settings: {[KEY]: []}};
  const {makeClient, calls, local} = environment({remote});
  const client = makeClient();
  await client.start();
  assert.equal(client.status, 'error');
  assert.equal(client.profile, undefined);
  client.openLocal();
  assert.equal(client.status, 'local');
  assert.equal(client.getItem(KEY), '{"grouped":false}');
  assert.throws(() => client.setItem(KEY, '{}'), {code: 'settings_unavailable'});
  assert.throws(() => client.removeItem(KEY), {code: 'settings_unavailable'});
  await client.start({retry: true});
  assert.equal(calls.length, 1);
  assert.equal(local.getItem('gewitterradar:vault:v1:binding:scope'), ID);
  assert.equal(local.getItem(KEY), '{"grouped":false}');
});

test('an obsolete binding asks for the available profiles once and preserves the local hint', async () => {
  const {makeClient, calls, local} = environment({onGet: request => {
    if (request.profileId) throw exception('settings_not_found');
  }});
  const client = makeClient();
  await client.start();
  assert.equal(client.status, 'choose');
  assert.equal(client.profileId, null);
  assert.equal(local.getItem('gewitterradar:vault:v1:binding:scope'), ID);
  assert.deepEqual(calls.map(message => message.request), [{profileId: ID}, {}]);
  await client.start();
  assert.equal(calls.length, 2);
});

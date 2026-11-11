const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {randomUUID} = require('node:crypto');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {flowFixture} = require('./flow-curves-browser-fixture.cjs');

const legacy = JSON.parse(readFileSync(path.join(__dirname, '../tests/settings-vault-v181.json'), 'utf8'));
const EYE = 'gewitterradar:eye-bubble:v1';
const jsonKeys = Object.keys(legacy).filter(key => legacy[key].startsWith('{'));
const mock = {profiles: {}, log: [], offline: false, deferGet: null};

const view = profile => Object.fromEntries(Object.entries(profile).filter(([key]) => key !== 'settings'));
const decode = (key, raw) => jsonKeys.includes(key) ? JSON.parse(raw) : raw;
function serverCall(user, message) {
  return (async () => {
    const op = message.type.split('/').at(-1);
    assert.equal(message.schema, 1);
    assert.equal(message.build, '4.11.182');
    mock.log.push({user, op, request: message.request});
    if (mock.offline) return {error: 'disconnected'};
    const request = message.request;
    const profiles = mock.profiles[user] ||= {};
    if (op === 'get') {
      if (mock.deferGet) await mock.deferGet;
      const profile = profiles[request.profileId];
      if (request.profileId && !profile) return {error: 'settings_not_found'};
      return {
        schema: 1, settingsKeys: Object.keys(legacy), jsonSettingsKeys: jsonKeys,
        recovery: false, profiles: Object.values(profiles).map(view), profile,
      };
    }
    if (op === 'migration_preview') return {keys: Object.keys(request.legacy), issues: []};
    if (op === 'create' || op === 'copy') {
      const id = randomUUID().replaceAll('-', '');
      const settings = op === 'copy' ? profiles[request.profileId].settings : Object.fromEntries(
        Object.entries(request.legacy || {}).map(([key, value]) => [key, decode(key, value)]),
      );
      const profile = {id, name: request.name, revision: 1, updatedAt: new Date().toISOString(), settings};
      profiles[id] = structuredClone(profile);
      return {profile};
    }
    if (op === 'patch') {
      const profile = profiles[request.profileId];
      if (!profile) return {error: 'settings_not_found'};
      for (const [key, pair] of Object.entries(request.changes)) {
        if (pair.after === null) delete profile.settings[key];
        else profile.settings[key] = decode(key, pair.after);
      }
      profile.revision++;
      return {profile};
    }
    return {error: 'unknown_command'};
  })();
}

function vaultFixture() {
  return flowFixture({decorate: html => html
    .replace("localStorage.setItem('gewitterradar-about-onboarding-version','1');", '')
    .replace("card.hass={states:", "card.hass={user:{id:window.testUser,name:'Testbenutzer'},states:")
    .replace("callWS:async query=>{", "callWS:async query=>{\n if(query.type.startsWith('gewitterradar/settings/')){const result=await window.settingsVaultTestCall(query);if(result.error)throw Object.assign(new Error(result.error),{code:result.error});return result;}")
  });
}

async function open(browser, fixture, viewport, {user = 'a', initial} = {}) {
  const context = await browser.newContext({viewport, hasTouch: viewport.width < 600});
  await context.addInitScript(({user, initial}) => {
    window.testUser = user;
    if (initial && !sessionStorage.getItem('vault-fixture-seeded')) {
      for (const [key, value] of Object.entries(initial)) localStorage.setItem(key, value);
      sessionStorage.setItem('vault-fixture-seeded', '1');
    }
  }, {user, initial});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => { errors.push(error.message); console.error(error.message); });
  await page.exposeFunction('settingsVaultTestCall', message => serverCall(user, message));
  await fixture.route(page);
  await page.goto('http://127.0.0.1:' + fixture.server.address().port);
  return {context, page, errors};
}

const values = page => page.evaluate(async () => {
  const {readPremiumUi} = await import('/frontend/modules/weather/premium-ui.js?v=411182r1');
  const {WindStudioModel} = await import('/frontend/modules/weather/wind-studio-data.js');
  const eye = card._eyeHubState().config;
  const wind = card._weatherWindState().config;
  const temperature = card._weatherTemperatureState().config;
  const display = card._weatherDisplayState().config;
  const studio = new WindStudioModel(wind.snake, {storage: card._settingsVault || localStorage});
  return {
    grouped: eye.grouped, colors: eye.colors, glow: eye.glow, energy: eye.energyAccents,
    eyeGap: eye.eyeAuraGap, ringGap: eye.auraRingGap, wind: wind.mode, snake: wind.snake,
    surface: temperature.surface, labels: temperature.labels, temperatureOpacity: temperature.opacity,
    opacities: display.opacities, eyePosition: display.eyePosition,
    legend: card._weatherLegendState().ui,
    windPanel: readPremiumUi('wind-settings', card),
    studio: studio.users,
    compass: card._mapCompassPosition, medallionScale: card._fullscreenInstrumentScale('medallion'),
    clusterTimeout: card._statusClusterBrowseTimeoutMs,
  };
});

async function startProfile(page, label = 'Mit Standardeinstellungen starten') {
  await page.getByRole('button', {name: label, exact: true}).click();
  try {
    await page.waitForFunction(() => window.ready && card._map && card._settingsVault?.profile, null, {timeout: 15000});
  } catch (error) {
    console.error(await page.evaluate(() => ({
      label: document.querySelector('.gr-vault-setup')?.textContent?.slice(-800),
      status: card?._settingsVault?.status, booted: card?._vaultBooted, built: card?._built,
      ready: window.ready, compatible: window.registry?.ok,
    })));
    throw error;
  }
}

(async () => {
  const current = vaultFixture();
  const reference = flowFixture({ref: '4587b76ca254fdc62cf179560fca9f61c1214133'});
  const fixtures = [current, reference];
  for (const f of fixtures) await new Promise(resolve => f.server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({headless: true, ...(process.env.CHROME_PATH ? {executablePath: process.env.CHROME_PATH} : {})});
  try {
    const desktop = await open(browser, current, {width: 1240, height: 850});
    await startProfile(desktop.page);
    assert.deepEqual(Object.values(mock.profiles.a)[0].settings, {});

    const androidView = {width: 393, height: 851};
    const baseline = await open(browser, reference, androidView, {initial: legacy});
    await baseline.page.waitForFunction(() => window.ready && card._map);
    const expected = await values(baseline.page);
    await baseline.context.close();

    let releaseGet;
    mock.deferGet = new Promise(resolve => { releaseGet = resolve; });
    const android = await open(browser, current, androidView, {initial: legacy});
    await android.page.getByRole('status', {name: ''}).filter({hasText: 'Profil wird geladen'}).waitFor();
    assert.equal(await android.page.evaluate(() => Boolean(card._map)), false);
    assert.equal(mock.log.some(entry => entry.op === 'patch'), false);
    mock.deferGet = null;
    releaseGet();
    await android.page.getByRole('button', {name: 'Übernahme prüfen'}).click();
    await startProfile(android.page, 'Browsereinstellungen übernehmen');
    assert.deepEqual(await values(android.page), expected);
    assert.equal(await android.page.evaluate(key => localStorage.getItem(key), EYE), legacy[EYE]);
    assert.equal(mock.log.some(entry => entry.op === 'patch'), false);

    // The existing settings menu reaches the new page.
    await android.page.locator('gewitterradar-card').locator('#settings-open').click();
    await android.page.getByRole('button', {name: 'Userprofile & Sicherungen', exact: true}).click();
    await android.page.getByText('Testbenutzer · Dieses Gerät', {exact: true}).waitFor();
    await android.page.getByRole('group', {name: 'Sichern & Wiederherstellen'}).waitFor();

    // Opt-in save confirmation and retry after a WebSocket interruption.
    mock.offline = true;
    await android.page.evaluate(() => card._eyeHubPatch({eyeAuraGap: 23}));
    await android.page.waitForFunction(() => card._settingsVault.status === 'offline');
    assert.equal(await android.page.evaluate(() => card._settingsVault.dirty), true);
    mock.offline = false;
    await android.page.evaluate(() => card._settingsVault.flush());
    await android.page.waitForFunction(() => card._settingsVault.status === 'saved');
    const androidId = await android.page.evaluate(() => card._settingsVault.profileId);
    assert.equal(mock.profiles.a[androidId].settings[EYE].eyeAuraGap, 23);
    await android.page.reload();
    await android.page.waitForFunction(() => window.card?._map && window.card._settingsVault?.profile);
    assert.equal((await values(android.page)).eyeGap, 23);
    await android.context.close();

    // New context models complete client storage loss while HA keeps the server profile.
    const cleared = await open(browser, current, androidView);
    await cleared.page.getByRole('button', {name: 'Mit Standardeinstellungen starten'}).waitFor();
    await cleared.page.getByText('Vorhandenes Profil verwenden', {exact: true}).click();
    await cleared.page.getByRole('combobox', {name: 'Geräteprofil'}).selectOption(androidId);
    await cleared.page.getByText('Bestehende Zuordnung wiederherstellen', {exact: true}).click();
    await startProfile(cleared.page, 'Dieses Profil zuordnen');
    assert.deepEqual(await values(cleared.page), {...expected, eyeGap: 23});
    assert.equal(await cleared.page.evaluate(key => localStorage.getItem(key), EYE), null);

    const ipad = await open(browser, current, {width: 820, height: 1180}, {
      initial: {...legacy, 'gewitterradar:wind-ui:v1': '{"visible":true,"mode":"arrows"}'},
    });
    await ipad.page.getByRole('button', {name: 'Übernahme prüfen'}).click();
    await startProfile(ipad.page, 'Browsereinstellungen übernehmen');
    assert.equal((await values(ipad.page)).wind, 'arrows');
    assert.equal(Object.values(mock.profiles.a).length, 3);
    assert.equal(mock.profiles.a[androidId].settings['gewitterradar:wind-ui:v1'].mode, 'snake');

    const secondUser = await open(browser, current, {width: 1024, height: 768}, {user: 'b'});
    await secondUser.page.getByText('Vorhandenes Profil verwenden', {exact: true}).click();
    await secondUser.page.getByText('Für dieses Konto ist noch kein Geräteprofil vorhanden.').waitFor();
    for (const result of [desktop, android, cleared, ipad, secondUser]) assert.deepEqual(result.errors, []);
    console.log('PASS: V181 effective settings, hydration before render, profile menu, offline retry, complete client storage loss, independent devices and accounts');
  } finally {
    await browser.close();
    for (const f of fixtures) f.server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

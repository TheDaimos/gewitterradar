const assert = require('node:assert/strict');
const {readFileSync, mkdirSync} = require('node:fs');
const {randomUUID} = require('node:crypto');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {flowFixture} = require('./flow-curves-browser-fixture.cjs');

const legacy = JSON.parse(readFileSync(path.join(__dirname, '../tests/settings-vault-v181.json'), 'utf8'));
const build = readFileSync(path.join(__dirname, '../frontend/version.js'), 'utf8').match(/version:"([^"]+)"/)[1];
const EYE = 'gewitterradar:eye-bubble:v1';
const jsonKeys = Object.keys(legacy).filter(key => legacy[key].startsWith('{'));
const mock = {profiles: {}, migrationIssues: new Map(), receipts: new Map(), log: [], offline: false, deferGet: null, loseCreateReply: false};

const view = profile => Object.fromEntries(Object.entries(profile).filter(([key]) => key !== 'settings'));
const decode = (key, raw) => jsonKeys.includes(key) ? JSON.parse(raw) : raw;
function serverCall(user, message) {
  return (async () => {
    const op = message.type.split('/').at(-1);
    assert.equal(message.schema, 1);
    assert.equal(message.build, build);
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
        migrationIssues: mock.migrationIssues.get(request.profileId) || [],
      };
    }
    if (op === 'migration_preview') return {keys: Object.keys(request.legacy), issues: []};
    if (op === 'create' || op === 'copy') {
      const receipt = user + ':' + request.requestId;
      if (mock.receipts.has(receipt)) return {profile: profiles[mock.receipts.get(receipt)]};
      const id = randomUUID().replaceAll('-', '');
      const settings = op === 'copy' ? profiles[request.profileId].settings : Object.fromEntries(
        Object.entries(request.legacy || {}).map(([key, value]) => [key, decode(key, value)]),
      );
      const profile = {id, name: request.name, revision: 1, updatedAt: new Date().toISOString(), settings};
      profiles[id] = structuredClone(profile);
      mock.receipts.set(receipt, id);
      if (mock.loseCreateReply) {
        mock.loseCreateReply = false;
        return {error: 'settings_storage'};
      }
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
    .replace("card.hass={states:", "card.hass={user:{id:window.testUser,name:'Testbenutzer'},auth:{},connection:new EventTarget(),connected:true,states:")
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
  const {readPremiumUi} = await import('/frontend/modules/weather/premium-ui.js');
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
    compassVisible: card._mapCompassVisible, medallionVisible: card._mapMedallionVisible,
    clusterJumpVisible: card._mapClusterJumpVisible,
    clusterTimeout: card._statusClusterBrowseTimeoutMs,
  };
});

async function startProfile(page, label = 'Mit Standardeinstellungen starten') {
  await page.getByRole('button', {name: label, exact: true}).click();
  if (label !== 'Dieses Profil zuordnen') await page.getByRole('button', {name: 'Profil erstellen', exact: true}).click();
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

async function refreshHaCard(page, {reattach = false, partialUser = false} = {}) {
  return page.evaluate(async ({reattach, partialUser}) => {
    const setup = card.querySelector('.gr-vault-setup');
    const first = setup.querySelector('button, summary');
    const focus = document.activeElement;
    const text = focus?.value;
    const hass = card.hass;
    for (let i = 0; i < 8; i++) {
      hass.connection.dispatchEvent(new Event(i % 2 === 0 ? 'ready' : 'disconnected'));
      card.hass = {...hass, states: {...hass.states}, connected: i % 2 === 0};
      card.setConfig({initial_zoom: 7});
      if (partialUser && i === 2) card.hass = {...hass, user: undefined};
      if (reattach && i === 4) {
        const parent = card.parentNode;
        card.remove();
        parent.append(card);
      }
      await new Promise(requestAnimationFrame);
    }
    return setup.isConnected && setup.querySelector('button, summary') === first
      && (reattach || (document.activeElement === focus && focus?.value === text));
  }, {reattach, partialUser});
}

async function screenshotSetup(page, name) {
  const out = process.env.GR_VAULT_SCREENSHOTS;
  if (!out) return;
  mkdirSync(out, {recursive: true});
  await page.locator('.gr-vault-setup').screenshot({path: path.join(out, name + '.png')});
}

async function exerciseProfileName(page, {enter, heading, previous, name, touch = false}) {
  const writes = () => mock.log.filter(entry => ['create', 'copy', 'patch'].includes(entry.op)).length;
  const before = writes();
  const input = page.getByRole('textbox', {name: 'Profilname'});
  const title = page.getByRole('heading', {name: heading, exact: true});
  const clear = page.getByRole('button', {name: 'Profilnamen löschen', exact: true});
  const submit = page.getByRole('button', {name: 'Profil erstellen', exact: true});
  const focused = locator => locator.evaluate(element => element === document.activeElement);
  const selection = () => input.evaluate(element => [element.selectionStart, element.selectionEnd]);
  const back = async () => {
    await page.getByRole('button', {name: 'Zurück', exact: true}).click();
    await previous.waitFor();
  };
  const focusName = (position = {x: 25, y: 21}) => touch ? input.tap({position}) : page.keyboard.press('Tab');

  await enter();
  assert(await focused(title), 'Opening the name step must keep focus out of the text field');
  assert.equal(await input.inputValue(), 'Dieses Gerät');
  await input.evaluate(element => { element.setSelectionRange(2, 2); element.focus(); element.click(); });
  assert.deepEqual(await selection(), [2, 2], 'Programmatic focus/click must leave the selection alone');
  await title.focus();
  await focusName({x: 160, y: 21});
  assert(await focused(input));
  assert.deepEqual(await selection(), [0, 'Dieses Gerät'.length], 'First user focus must select the full suggestion');
  await page.keyboard.insertText(name);
  assert.equal(await input.inputValue(), name);
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  assert.deepEqual(await selection(), [1, 1], 'Caret movement must work after typing');
  await page.keyboard.insertText('x');
  await page.keyboard.press('Backspace');
  assert.equal(await input.inputValue(), name, 'Corrections must edit at the caret');
  await title.focus();
  await focusName();
  const [start, end] = await selection();
  assert.equal(start, end, 'A focus change must preserve the custom name without selecting it');
  if (!touch) assert.equal(start, 1, 'Keyboard focus must return to the previous caret');
  await back();
  await enter();
  assert(await focused(title));
  assert.equal(await input.inputValue(), name, 'Back navigation must retain the draft');
  await focusName({x: 100, y: 21});
  const [returnedStart, returnedEnd] = await selection();
  assert.equal(returnedStart, returnedEnd, 'Returning to the draft must not select it');
  assert.equal(await clear.getAttribute('type'), 'button');
  const target = await clear.boundingBox();
  assert(target.width >= 44 && target.height >= 44, 'The clear button must have a touch-sized target');
  if (touch) {
    await clear.tap();
    assert.equal(await input.inputValue(), '');
    assert(await focused(input), 'Touch clear must return to editing');
    await clear.waitFor({state: 'hidden'});
    await page.keyboard.insertText(name);
  }
  await page.keyboard.press('Tab');
  assert(await focused(clear));
  assert.equal(await clear.evaluate(element => getComputedStyle(element).outlineStyle), 'solid');
  await page.keyboard.press('Enter');
  assert.equal(await input.inputValue(), '');
  assert(await focused(input), 'Keyboard clear must return to editing');
  await clear.waitFor({state: 'hidden'});
  await submit.click();
  assert(await input.evaluate(element => element.validity.valueMissing));
  await input.fill('   ');
  await submit.click();
  await page.getByRole('alert').filter({hasText: 'Gib einen Namen für dieses Gerät ein.'}).waitFor();
  assert.equal(writes(), before, 'Editing and invalid submissions must never write a profile');
  await input.fill(name);
}

(async () => {
  const current = vaultFixture();
  const reference = flowFixture({ref: '4587b76ca254fdc62cf179560fca9f61c1214133'});
  const fixtures = [current, reference];
  for (const f of fixtures) await new Promise(resolve => f.server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({headless: true, ...(process.env.CHROME_PATH ? {executablePath: process.env.CHROME_PATH} : {})});
  try {
    const desktop = await open(browser, current, {width: 1240, height: 850});
    await desktop.page.getByRole('button', {name: 'Mit Standardeinstellungen starten', exact: true}).waitFor();
    const initialReads = mock.log.filter(entry => entry.op === 'get').length;
    assert(await refreshHaCard(desktop.page), 'HA state updates must not replace the profile picker');
    assert.equal(mock.log.filter(entry => entry.op === 'get').length, initialReads);
    assert.equal(await desktop.page.getByRole('textbox', {name: 'Profilname'}).count(), 0);
    const desktopDefaults = desktop.page.getByRole('button', {name: 'Mit Standardeinstellungen starten'});
    await exerciseProfileName(desktop.page, {
      enter: () => desktopDefaults.click(), heading: 'Neues Geräteprofil', previous: desktopDefaults, name: 'Desktop-Test',
    });
    const nameInput = desktop.page.getByRole('textbox', {name: 'Profilname'});
    assert(await refreshHaCard(desktop.page, {partialUser: true}), 'Focus and the typed name must survive HA updates');
    assert.equal(await nameInput.inputValue(), 'Desktop-Test');
    mock.loseCreateReply = true;
    await desktop.page.getByRole('button', {name: 'Profil erstellen'}).evaluate(button => { button.click(); button.click(); });
    await desktop.page.getByRole('alert').filter({hasText: 'konnte den Speicherstand nicht bestätigen'}).waitFor();
    assert.equal(await desktop.page.evaluate(() => Boolean(card._map)), false);
    assert.equal(await nameInput.inputValue(), 'Desktop-Test');
    assert.equal(mock.log.filter(entry => entry.op === 'create').length, 1);
    await desktop.page.getByRole('button', {name: 'Profil erstellen'}).click();
    await desktop.page.waitForFunction(() => card._map && card._settingsVault.profile);
    const desktopCreates = mock.log.filter(entry => entry.op === 'create');
    assert.equal(desktopCreates.length, 2);
    assert.equal(desktopCreates[0].request.requestId, desktopCreates[1].request.requestId);
    assert.equal(Object.values(mock.profiles.a).length, 1);
    assert.deepEqual(Object.values(mock.profiles.a)[0].settings, {});

    const androidView = {width: 393, height: 851};
    const baseline = await open(browser, reference, androidView, {initial: legacy});
    await baseline.page.waitForFunction(() => window.ready && card._map);
    const expected = await values(baseline.page);
    // The new fifth function is additive. Historical V181 baseline has four
    // functions; retain all their original colors and compare only this new key.
    expected.colors.synoptic = '#FFC442';
    await baseline.context.close();

    let releaseGet;
    mock.deferGet = new Promise(resolve => { releaseGet = resolve; });
    const android = await open(browser, current, androidView, {initial: legacy});
    await android.page.getByRole('status', {name: ''}).filter({hasText: 'Profil wird geladen'}).waitFor();
    const pendingReads = mock.log.filter(entry => entry.op === 'get').length;
    assert(await refreshHaCard(android.page, {reattach: true, partialUser: true}));
    assert.equal(mock.log.filter(entry => entry.op === 'get').length, pendingReads);
    assert.equal(await android.page.evaluate(() => Boolean(card._map)), false);
    assert.equal(mock.log.some(entry => entry.op === 'patch'), false);
    mock.deferGet = null;
    releaseGet();
    await android.page.getByRole('heading', {name: 'GewitterRadar Pro'}).waitFor();
    await android.page.getByRole('button', {name: 'Vorhandenes Profil verwenden'}).waitFor();
    assert.equal(await android.page.getByText('powered by WeatherRouter', {exact: true}).count(), 1);
    await screenshotSetup(android.page, 'android-setup');
    const androidDefaults = android.page.getByRole('button', {name: 'Mit Standardeinstellungen starten'});
    await exerciseProfileName(android.page, {
      enter: () => androidDefaults.tap(), heading: 'Neues Geräteprofil', previous: androidDefaults,
      name: 'Android-Test', touch: true,
    });
    await screenshotSetup(android.page, 'android-name');
    await android.page.getByRole('button', {name: 'Zurück', exact: true}).tap();
    await android.page.getByRole('button', {name: 'Bisherige Browsereinstellungen'}).tap();
    await android.page.getByRole('button', {name: 'Übernahme prüfen'}).click();
    const migrate = android.page.getByRole('button', {name: 'Browsereinstellungen übernehmen'});
    await exerciseProfileName(android.page, {
      enter: () => migrate.tap(), heading: 'Browsereinstellungen übernehmen', previous: migrate,
      name: 'Android-Migration', touch: true,
    });
    await android.page.getByRole('textbox', {name: 'Profilname'}).fill('Dieses Gerät');
    await android.page.getByRole('button', {name: 'Profil erstellen'}).tap();
    await android.page.waitForFunction(() => window.ready && card._map && card._settingsVault?.profile);
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

    // New context models complete client storage loss while HA keeps the server profile.
    const cleared = await open(browser, current, androidView);
    await cleared.page.getByRole('button', {name: 'Mit Standardeinstellungen starten'}).waitFor();
    await cleared.page.getByRole('button', {name: 'Vorhandenes Profil verwenden', exact: true}).tap();
    await cleared.page.getByRole('combobox', {name: 'Geräteprofil'}).selectOption(androidId);
    await screenshotSetup(cleared.page, 'android-existing');
    assert(await refreshHaCard(cleared.page, {partialUser: true}));
    assert.equal(await cleared.page.getByRole('combobox', {name: 'Geräteprofil'}).inputValue(), androidId);
    await startProfile(cleared.page, 'Dieses Profil zuordnen');
    assert.deepEqual(await values(cleared.page), {...expected, eyeGap: 23});
    assert.equal(await cleared.page.evaluate(key => localStorage.getItem(key), EYE), null);

    const ipad = await open(browser, current, {width: 820, height: 1180}, {
      initial: {...legacy, 'gewitterradar:wind-ui:v1': '{"visible":true,"mode":"arrows"}'},
    });
    await ipad.page.getByRole('button', {name: 'Bisherige Browsereinstellungen'}).click();
    await ipad.page.getByRole('button', {name: 'Übernahme prüfen'}).click();
    await startProfile(ipad.page, 'Browsereinstellungen übernehmen');
    assert.equal((await values(ipad.page)).wind, 'arrows');
    assert.equal(Object.values(mock.profiles.a).length, 3);
    assert.equal(mock.profiles.a[androidId].settings['gewitterradar:wind-ui:v1'].mode, 'snake');

    const copy = await open(browser, current, {width: 1024, height: 768});
    await copy.page.getByRole('button', {name: 'Vorhandenes Profil verwenden', exact: true}).click();
    await copy.page.getByRole('combobox', {name: 'Geräteprofil'}).selectOption(androidId);
    const copyProfile = copy.page.getByRole('button', {name: 'Als eigenes Profil kopieren', exact: true});
    await exerciseProfileName(copy.page, {
      enter: () => copyProfile.click(), heading: 'Eigenständige Profilkopie', previous: copyProfile, name: 'Android-Kopie',
    });
    await copy.page.getByRole('button', {name: 'Profil erstellen'}).click();
    await copy.page.waitForFunction(() => card._map && card._settingsVault.profile);
    const copiedId = await copy.page.evaluate(() => card._settingsVault.profileId);
    assert.notEqual(copiedId, androidId);
    assert.deepEqual(mock.profiles.a[copiedId].settings, mock.profiles.a[androidId].settings);
    assert.deepEqual(await values(copy.page), {...expected, eyeGap: 23});

    const secondUser = await open(browser, current, {width: 1024, height: 768}, {user: 'b'});
    await secondUser.page.getByRole('button', {name: 'Vorhandenes Profil verwenden', exact: true}).click();
    await secondUser.page.getByText('Für dieses Konto ist noch kein Geräteprofil vorhanden.').waitFor();

    // Profiles with a V182 migration issue can retry into a separate profile.
    mock.migrationIssues.set(androidId, ['gewitterradar:v409:map-compass-visible']);
    await android.page.reload();
    await android.page.waitForFunction(() => window.card?._map);
    await android.page.locator('gewitterradar-card').locator('#settings-open').click();
    await android.page.getByRole('button', {name: 'Userprofile & Sicherungen', exact: true}).click();
    await android.page.getByText('Erweitert', {exact: true}).click();
    android.page.once('dialog', dialog => dialog.accept());
    await android.page.getByRole('button', {name: 'Browsereinstellungen erneut als Profil übernehmen'}).click();
    await android.page.getByRole('option', {name: 'Dieses Gerät – Browserimport'}).waitFor({state: 'attached'});
    const imported = Object.values(mock.profiles.a).find(item => item.name === 'Dieses Gerät – Browserimport');
    assert.notEqual(imported.id, androidId);
    assert.equal(imported.settings['gewitterradar:v409:map-compass-visible'], 'false');
    assert.equal(mock.profiles.a[androidId].settings[EYE].eyeAuraGap, 23);
    // Startup connection failure stays recoverable and never writes defaults.
    mock.offline = true;
    const offline = await open(browser, current, androidView, {user: 'offline', initial: legacy});
    const retry = offline.page.getByRole('button', {name: 'Erneut verbinden'});
    await retry.waitFor();
    assert(await refreshHaCard(offline.page, {partialUser: true}));
    assert.equal(mock.log.filter(entry => entry.user === 'offline').length, 1);
    await retry.click();
    await retry.waitFor();
    assert.equal(mock.log.filter(entry => entry.user === 'offline').length, 2);
    await offline.page.getByRole('button', {name: 'Karte mit lokalen Einstellungen öffnen'}).click();
    await offline.page.waitForFunction(() => card._map && card._settingsVault.localOnly);
    assert.deepEqual(await values(offline.page), expected);
    await offline.page.evaluate(() => card._eyeHubPatch({eyeAuraGap: 3}));
    assert.equal(await offline.page.evaluate(key => localStorage.getItem(key), EYE), legacy[EYE]);
    assert.deepEqual(mock.log.filter(entry => entry.user === 'offline').map(entry => entry.op), ['get', 'get']);
    mock.offline = false;
    for (const result of [desktop, android, cleared, ipad, copy, secondUser, offline]) assert.deepEqual(result.errors, []);
    console.log('PASS: profile name touch and keyboard editing in all creation modes, stable startup during HA/WS churn, idempotent retry, local recovery, V181 migration and rendering, cache loss, independent devices and accounts');
  } finally {
    await browser.close();
    for (const f of fixtures) f.server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

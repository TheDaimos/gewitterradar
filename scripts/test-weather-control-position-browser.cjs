// Registered card with Leaflet and synthetic HA/WeatherRouter transport.
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {fixture} = require('./wind-perf-browser-fixture.cjs');

const ids = ['weather-wind-toggle', 'weather-temperature-toggle',
  'weather-precipitation-toggle', 'weather-display-control'];
const waitForCard = page => page.waitForFunction(() =>
  window.ready && card._mapReady && card.__eyeHub && card._weatherLayerMenuState().catalog?.status === 'ready');
const waitForLayout = page => page.evaluate(() =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const positions = page => page.evaluate(() => [
  card._weatherWindState().config.quickPositions, card._weatherTemperatureState().config.quickPositions,
  card._weatherPrecipitationConfig().quickPositions, card._weatherDisplayState().config.displayControlPosition
]);
const coordinates = page => page.evaluate(ids => ids.map(id => {
  const button = card.shadow.getElementById(id);
  return [button.style.left, button.style.top];
}), ids);

async function run() {
  const f = fixture({ref: process.env.GR_BASELINE || null});
  await new Promise(resolve => f.server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({headless: true, executablePath: process.env.CHROME_PATH});
    const context = await browser.newContext({
      viewport: {width: 393, height: 851}, hasTouch: true, isMobile: true, deviceScaleFactor: 3
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await f.route(page);
    await page.goto('http://127.0.0.1:' + f.server.address().port);
    await waitForCard(page);
    await page.evaluate(() => {
      card._weatherWindSet({quickVisibility: 'all'});
      card._weatherTemperatureSet({quickVisibility: 'all'});
      card._weatherPrecipitationPatch({quickVisibility: 'all'});
      card._eyeHubPatch({grouped: false, iconSize: 100});
    });
    if (process.env.GR_BASELINE) {
      const proof = await page.evaluate(async ids => {
        card._setMapDisplayMode('fullscreen', {persist:false});
        await new Promise(resolve => setTimeout(resolve, 500));
        card._eyeHubPatch({iconSize:140});
        const layout = card._weatherWindToggleLayout();
        const saved = [{x:.2,y:.25}, {x:.45,y:.45}, {x:.7,y:.65}];
        card._weatherWindSet({quickPositions:{[layout]:saved[0]}});
        card._weatherTemperatureSet({quickPositions:{[layout]:saved[1]}});
        card._weatherPrecipitationPatch({quickPositions:{[layout]:saved[2]}});
        card._weatherDisplayPatch({rememberPosition:true,displayControlPosition:{x:.2,y:.85}});
        await new Promise(resolve => setTimeout(resolve, 100));
        const read = () => ids.map(id => {
          const button = card.shadow.getElementById(id);
          return [button.style.left, button.style.top];
        });
        const positions = [];
        for (const method of ['_eyeHubSyncIcons','_weatherWindPositionToggle','_weatherTemperaturePositionToggle',
          '_weatherPrecipitationPositionToggle','_eyeHubSyncIcons']) {
          card[method]();
          positions.push([method,read()]);
        }
        return {layout, positions};
      },ids);
      console.log('Baseline saved positions', JSON.stringify(proof));
    }
    for (const mode of ['standard', 'large', 'fullscreen']) {
      await page.evaluate(mode => card._setMapDisplayMode(mode, {persist: false}), mode);
      await page.waitForTimeout(500); // includes both deferred map resize callbacks
      for (const id of ids) assert.equal(await page.locator('#' + id).isVisible(), true, id);
      const trace = await page.evaluate(async ids => {
        const buttons = ids.map(id => card.shadow.getElementById(id));
        const geometry = () => {
          const m = card.shadow.getElementById('map').getBoundingClientRect();
          return [m.width, m.height];
        };
        const snapshot = () => buttons.map(button => [button.style.left, button.style.top]);
        const samples = {};
        const mutations = [];
        const observer = new MutationObserver(records => mutations.push(...records.map(r => r.target.id)));
        for (const button of buttons) observer.observe(button, {attributes: true, attributeFilter: ['style']});
        samples.initial = snapshot();
        const before = geometry();
        for (let i = 0; i < 4; i++) {
          // Both entry points run in the real card during weather/status and viewport updates.
          card._map.setView([[53.55,9.99],[38.72,-9.14],[40.71,-74.01],[52.23,21.01]][i], 5+i%2, {animate:false});
          card._weatherDisplaySyncUi();
          await new Promise(resolve => requestAnimationFrame(resolve));
          samples['weather' + i] = snapshot();
          window.visualViewport.dispatchEvent(new Event('resize'));
          await new Promise(resolve => requestAnimationFrame(resolve));
          samples['resize' + i] = snapshot();
          card._weatherLayerMenuRender();
          await new Promise(resolve => requestAnimationFrame(resolve));
          samples['layer' + i] = snapshot();
        }
        observer.disconnect();
        return {geometry: before, finalGeometry: geometry(), samples, mutations};
      }, ids);
      console.log(mode, JSON.stringify({...trace, mutations: Object.fromEntries(ids.map(id =>
        [id, trace.mutations.filter(target => target === id).length]))}));
      assert.deepEqual(trace.finalGeometry, trace.geometry);
      if (process.env.GR_BASELINE) continue;
      for (const [method, sample] of Object.entries(trace.samples)) {
        assert.deepEqual(sample, trace.samples.initial, mode + ' ' + method);
      }
      assert.deepEqual(trace.mutations, [], mode + ' repeated style mutations');
    }
    if (process.env.GR_BASELINE) return;
    await page.evaluate(() => card._eyeHubPatch({iconSize: 140}));
    await waitForLayout(page);
    const scaled = await coordinates(page);
    await page.evaluate(() => {
      for (let i=0;i<8;i++) {
        card._weatherDisplaySyncUi();
        card._weatherLayerMenuRender();
        window.visualViewport.dispatchEvent(new Event('resize'));
      }
    });
    await waitForLayout(page);
    assert.deepEqual(await coordinates(page), scaled, 'collision resolution at custom size');
    await page.evaluate(() => card._eyeHubPatch({iconSize: 100}));
    await waitForLayout(page);
    const panelIds = ['weather-wind-panel', 'weather-temperature-panel', 'weather-display-panel', 'weather-display-panel'];
    const cdp = await context.newCDPSession(page);
    const touch = (type, point) => cdp.send('Input.dispatchTouchEvent', {
      type, touchPoints: point ? [point] : []
    });
    for (const [index,id] of ids.entries()) {
      const icon = page.locator('#' + id), panel = page.locator('#' + panelIds[index]);
      const pressed = await icon.getAttribute('aria-pressed');
      await icon.tap();
      if (index < 3) {
        assert.notEqual(await icon.getAttribute('aria-pressed'), pressed, id + ' short tap');
        await icon.tap();
      } else {
        await panel.waitFor({state:'visible'});
        await page.evaluate(() => card._weatherDisplayPatch({enabled:false}));
      }
      const rect = await icon.boundingBox();
      const center = {x:rect.x + rect.width/2, y:rect.y + rect.height/2};
      await touch('touchStart', center);
      await panel.waitFor({state:'visible'});
      await touch('touchEnd');
      if (index === 0) await panel.locator('[data-wind-action=close]').tap();
      else if (index === 1) await panel.locator('[data-temperature-action=close]').tap();
      else await page.evaluate(() => card._weatherDisplayPatch({enabled:false}));
      await waitForLayout(page);

      const old = (await positions(page))[index];
      const from = await icon.boundingBox();
      const start = {x:from.x + from.width/2, y:from.y + from.height/2};
      const to = {x:70 + 76*index, y:270 + 45*index};
      await touch('touchStart', start);
      for (let i=1; i<=5; i++) await touch('touchMove', {
        x:start.x + (to.x-start.x)*i/5, y:start.y + (to.y-start.y)*i/5
      });
      await touch('touchEnd');
      await waitForLayout(page);
      assert.notDeepEqual((await positions(page))[index], old, id + ' saved drag');
      const after = await icon.boundingBox();
      assert(Math.abs(after.x + after.width/2 - to.x) < 2 && Math.abs(after.y + after.height/2 - to.y) < 2, id + ' drag target');
    }

    const saved = await positions(page), portrait = await coordinates(page);
    await page.evaluate(() => {
      window.controlsBefore = card.__eyeHub.observer;
      window.resizeBefore = card._weatherDisplayState().resizeHandler;
      card._eyeHubPatch({grouped:true});
      card._eyeHubToggle();
    });
    assert.equal(await page.locator('.eye-hub-bubble:visible').count(), 5);
    for (const id of ids) assert.equal(await page.locator('#'+id).isHidden(), true);
    await page.evaluate(() => card._eyeHubPatch({grouped:false}));
    await waitForLayout(page);
    assert.deepEqual(await coordinates(page), portrait);
    for (const viewport of [{width:851,height:393}, {width:393,height:851}]) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);
      for (const id of ids) assert.equal(await page.locator('#'+id).isVisible(), true);
    }
    assert.deepEqual(await coordinates(page), portrait);
    assert.deepEqual(await positions(page), saved);
    assert.equal(await page.evaluate(() => window.controlsBefore === card.__eyeHub.observer &&
      window.resizeBefore === card._weatherDisplayState().resizeHandler), true);
    await page.reload();
    await waitForCard(page);
    await page.evaluate(() => card._setMapDisplayMode('fullscreen', {persist:false}));
    await page.waitForTimeout(500);
    assert.deepEqual(await positions(page), saved);
    assert.deepEqual(await coordinates(page), portrait);
    await page.evaluate(() => {
      card._setMapDisplayMode('standard', {persist:false});
      card._openMapDiagnostics();
    });
    const diagnostics = page.locator('#map-diagnostic-panel');
    await diagnostics.locator('[data-mapdiag-level=compact]').tap();
    assert(await diagnostics.evaluate(panel => panel.classList.contains('mapdiag-compact')));
    await diagnostics.locator('[data-mapdiag-toggle-minimize]').tap();
    assert(await diagnostics.evaluate(panel => panel.classList.contains('mapdiag-minimized')));
    await diagnostics.locator('[data-mapdiag-close]').tap();
    assert(await diagnostics.isHidden());
    console.log('Custom icon size, tap, long press, drag, grouping, rotation, reload and map diagnostics passed.');
    assert.deepEqual(errors, []);
    await context.close();
  } finally {
    await browser?.close();
    f.server.close();
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

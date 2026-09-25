const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  if (!file.startsWith(root + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404).end();
      return;
    }
    res.setHeader(
      'Content-Type',
      path.extname(file) === '.html'
        ? 'text/html'
        : path.extname(file) === '.js'
          ? 'text/javascript'
          : path.extname(file) === '.json'
            ? 'application/json'
            : 'application/octet-stream',
    );
    res.end(data);
  });
});

(async () => {
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  const browser = await chromium.launch({ executablePath: process.argv[2], headless: true });
  try {
    const profiles = [
      ['desktop', 1440, 1000, false],
      ['ipad', 1024, 768, true],
    ];
    for (const delivery of ['dashboard', 'integration']) {
      for (const [profile, width, height, hasTouch] of profiles) {
        const context = await browser.newContext({ viewport: { width, height }, hasTouch });
        const page = await context.newPage();
        await page.goto(
          `http://127.0.0.1:${server.address().port}/scripts/about-onboarding-harness.html?scenario=first&delivery=${delivery}`,
        );
        await page.waitForFunction(() => window.aboutResult);
        assert.equal(await page.evaluate(() => window.aboutResult.status), 'PASS');

        await page.evaluate(() => {
          const card = window.aboutCard;
          card._closeAbout(false, false);
          card._startDiagnostics();
          card._diagnostics.visualsVisible = true;
          card._syncDiagnosticUi();
          card._openCompassPicker();
        });
        await page.waitForFunction(() => {
          const card = window.aboutCard;
          const dialog = card._compassPickerDialog;
          const readout = dialog?.querySelector('[data-compass-picker-diagnostic-readout]');
          return !!dialog?.open && !!card._pickerDiagnostics?.compass && readout && !readout.hidden;
        });
        const compass = await page.evaluate(() => {
          const card = window.aboutCard;
          const dialog = card._compassPickerDialog;
          const state = card._pickerDiagnostics.compass;
          return {
            state,
            stageHidden: dialog.querySelector('[data-compass-picker-diagnostic-stage]').hidden,
            navHidden: dialog.querySelector('[data-compass-picker-diagnostic-nav]').hidden,
            readoutHidden: dialog.querySelector('[data-compass-picker-diagnostic-readout]').hidden,
            readout: dialog.querySelector('[data-compass-picker-diagnostic-readout]').textContent,
          };
        });
        assert.equal(compass.stageHidden, false, `${delivery}/${profile} compass stage diagnostics visible`);
        assert.equal(compass.navHidden, false, `${delivery}/${profile} compass nav diagnostics visible`);
        assert.equal(compass.readoutHidden, false, `${delivery}/${profile} compass readout visible`);
        assert.match(compass.readout, /KOMPASS-PICKER/);
        assert.ok(Number.isFinite(compass.state.centerDelta.residual));
        assert.ok(Number.isFinite(compass.state.navigation.symmetryDelta));
        assert.ok(compass.state.designId);

        await page.evaluate(() => {
          const card = window.aboutCard;
          card._diagnostics.visualsVisible = false;
          card._syncDiagnosticUi();
        });
        assert.equal(
          await page.evaluate(() => window.aboutCard._compassPickerDialog.querySelector('[data-compass-picker-diagnostic-readout]').hidden),
          true,
          `${delivery}/${profile} compass diagnostics follow global visibility`,
        );

        await page.evaluate(() => {
          const card = window.aboutCard;
          card._diagnostics.visualsVisible = true;
          card._syncDiagnosticUi();
          card._closeCompassPicker(false);
          card._openMedallionPicker();
        });
        await page.waitForFunction(() => {
          const card = window.aboutCard;
          const dialog = card._medallionPickerDialog;
          const readout = dialog?.querySelector('[data-medallion-picker-diagnostic-readout]');
          return !!dialog?.open && !!card._pickerDiagnostics?.medallion && readout && !readout.hidden;
        });
        const medallion = await page.evaluate(() => {
          const card = window.aboutCard;
          const dialog = card._medallionPickerDialog;
          const state = card._pickerDiagnostics.medallion;
          const snapshot = card._buildDiagnosticSnapshot();
          return {
            state,
            snapshotPicker: snapshot.pickers?.medallion || null,
            stageHidden: dialog.querySelector('[data-medallion-picker-diagnostic-stage]').hidden,
            navHidden: dialog.querySelector('[data-medallion-picker-diagnostic-nav]').hidden,
            readoutHidden: dialog.querySelector('[data-medallion-picker-diagnostic-readout]').hidden,
            readout: dialog.querySelector('[data-medallion-picker-diagnostic-readout]').textContent,
          };
        });
        assert.equal(medallion.stageHidden, false, `${delivery}/${profile} medallion stage diagnostics visible`);
        assert.equal(medallion.navHidden, false, `${delivery}/${profile} medallion nav diagnostics visible`);
        assert.equal(medallion.readoutHidden, false, `${delivery}/${profile} medallion readout visible`);
        assert.match(medallion.readout, /MEDAILLON-PICKER/);
        assert.equal(medallion.state.designId, 'trend_01');
        assert.equal(medallion.state.profile, 'round-medallion-v1');
        assert.ok(Number.isFinite(medallion.state.arrowCenterResidual));
        assert.ok(Number.isFinite(medallion.state.navigation.symmetryDelta));
        assert.equal(medallion.snapshotPicker.designId, 'trend_01');

        await page.evaluate(() => {
          const card = window.aboutCard;
          card._closeMedallionPicker(false);
          card._stopDiagnostics();
        });
        await context.close();
        console.log(`${delivery}/${profile}: picker diagnostics PASS`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  server.close();
  process.exitCode = 1;
});

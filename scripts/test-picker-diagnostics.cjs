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
          card._diagnostics.grid = 'fine';
          Object.assign(card._diagnostics.overlays,{ids:true,boxes:true,centers:true,axes:true,diagonals:true});
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
            toolsHidden: dialog.querySelector('[data-compass-picker-diagnostic-tools]').hidden,
            exportButtons: dialog.querySelectorAll('[data-picker-diagnostic-copy],[data-picker-diagnostic-json],[data-picker-diagnostic-csv]').length,
            readout: dialog.querySelector('[data-compass-picker-diagnostic-readout]').textContent,
            payload: card._pickerDiagnosticPayload('compass'),
            csv: card._pickerDiagnosticCsv('compass'),
            stageMarkup: dialog.querySelector('[data-compass-picker-diagnostic-stage]').innerHTML,
            consoleInDialog: card.shadow.getElementById('diagnostic-console')?.parentNode === dialog,
          };
        });
        assert.equal(compass.stageHidden, false, `${delivery}/${profile} compass stage diagnostics visible`);
        assert.equal(compass.navHidden, false, `${delivery}/${profile} compass nav diagnostics visible`);
        assert.equal(compass.readoutHidden, false, `${delivery}/${profile} compass readout visible`);
        assert.equal(compass.toolsHidden, false, `${delivery}/${profile} compass tools visible in top-layer dialog`);
        assert.equal(compass.exportButtons, 3, `${delivery}/${profile} compass copy/json/csv actions`);
        assert.equal(compass.payload.picker, 'compass');
        assert.match(compass.csv, /"picker";"compass"/);
        assert.match(compass.readout, /KOMPASS-PICKER/);
        assert.ok(Number.isFinite(compass.state.centerDelta.residual));
        assert.ok(Number.isFinite(compass.state.navigation.symmetryDelta));
        assert.ok(compass.state.designId);
        assert.match(compass.stageMarkup, /KP-A1/, `${delivery}/${profile} compass local diagnostic grid is actually rendered`);
        assert.equal(compass.consoleInDialog, true, `${delivery}/${profile} full diagnostic console follows compass top layer`);

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
          dialog.querySelector('[data-medallion-preset="static"]').click();
          card._syncMedallionCalibrationUi();
          card._syncMedallionPicker();
          card._syncPickerDiagnostics();
          const state = card._pickerDiagnostics.medallion;
          const snapshot = card._buildDiagnosticSnapshot();
          const stage = dialog.querySelector('[data-medallion-picker-stage]');
          return {
            state,
            diagnosticMode: card._medallionDiagnostic.mode,
            stageState: stage.dataset.trendState,
            stageDiagnosticMode: stage.dataset.diagnosticMode,
            staticActive: dialog.querySelector('[data-medallion-preset="static"]').classList.contains('active'),
            snapshotPicker: snapshot.pickers?.medallion || null,
            stageHidden: dialog.querySelector('[data-medallion-picker-diagnostic-stage]').hidden,
            navHidden: dialog.querySelector('[data-medallion-picker-diagnostic-nav]').hidden,
            readoutHidden: dialog.querySelector('[data-medallion-picker-diagnostic-readout]').hidden,
            toolsHidden: dialog.querySelector('[data-medallion-picker-diagnostic-tools]').hidden,
            exportButtons: dialog.querySelectorAll('[data-picker-diagnostic-copy],[data-picker-diagnostic-json],[data-picker-diagnostic-csv]').length,
            readout: dialog.querySelector('[data-medallion-picker-diagnostic-readout]').textContent,
            payload: card._pickerDiagnosticPayload('medallion'),
            csv: card._pickerDiagnosticCsv('medallion'),
            stageMarkup: dialog.querySelector('[data-medallion-picker-diagnostic-stage]').innerHTML,
            consoleInDialog: card.shadow.getElementById('diagnostic-console')?.parentNode === dialog,
          };
        });
        assert.equal(medallion.stageHidden, false, `${delivery}/${profile} medallion stage diagnostics visible`);
        assert.equal(medallion.navHidden, false, `${delivery}/${profile} medallion nav diagnostics visible`);
        assert.equal(medallion.readoutHidden, false, `${delivery}/${profile} medallion readout visible`);
        assert.equal(medallion.toolsHidden, false, `${delivery}/${profile} medallion tools visible in top-layer dialog`);
        assert.equal(medallion.exportButtons, 3, `${delivery}/${profile} medallion copy/json/csv actions`);
        assert.equal(medallion.diagnosticMode, 'static', `${delivery}/${profile} preset survives calibration sync`);
        assert.equal(medallion.stageState, 'diagnostic', `${delivery}/${profile} picker follows diagnostic state`);
        assert.equal(medallion.stageDiagnosticMode, 'static');
        assert.equal(medallion.staticActive, true);
        assert.equal(medallion.payload.picker, 'medallion');
        assert.equal(medallion.payload.medallionState.mode, 'static');
        assert.match(medallion.csv, /"medallionState.mode";"static"/);
        assert.match(medallion.readout, /MEDAILLON-PICKER/);
        assert.equal(medallion.state.designId, 'trend_01');
        assert.equal(medallion.state.profile, 'round-medallion-v1');
        assert.ok(Number.isFinite(medallion.state.arrowCenterResidual));
        assert.ok(Number.isFinite(medallion.state.navigation.symmetryDelta));
        assert.equal(medallion.snapshotPicker.designId, 'trend_01');
        assert.match(medallion.stageMarkup, /MP-A1/, `${delivery}/${profile} medallion local diagnostic grid is actually rendered`);
        assert.equal(medallion.consoleInDialog, true, `${delivery}/${profile} full diagnostic console follows medallion top layer`);
        assert.equal(medallion.payload.medallionState.angleConvention, '0° North, 90° East, clockwise');
        assert.equal(medallion.payload.medallionState.assetZeroOffsetDeg, -45);

        const staticAngles = await page.evaluate(() => {
          const card=window.aboutCard,dialog=card._medallionPickerDialog,arrow=dialog.querySelector('.trend-medallion-arrow');
          const angleOf=()=>{const value=getComputedStyle(arrow).transform,m=value.match(/^matrix\(([^)]+)\)$/);if(!m)return null;const [a,b]=m[1].split(',').map(Number);return Math.atan2(b,a)*180/Math.PI;};
          dialog.querySelector('[data-medallion-angle="0"]').click();const north=angleOf();
          dialog.querySelector('[data-medallion-angle="90"]').click();const east=angleOf();
          return {north,east};
        });
        assert.ok(Math.abs(staticAngles.north + 45) < 1, `${delivery}/${profile} diagnostic 0° compensates the +45° source asset`);
        assert.ok(Math.abs(staticAngles.east - 45) < 1, `${delivery}/${profile} diagnostic 90° points East`);

        await page.evaluate(() => window.aboutCard._medallionPickerDialog.querySelector('[data-medallion-preset="animation"]').click());
        const animA = await page.evaluate(() => getComputedStyle(window.aboutCard._medallionPickerDialog.querySelector('.trend-medallion-arrow')).transform);
        await page.waitForTimeout(420);
        const animB = await page.evaluate(() => getComputedStyle(window.aboutCard._medallionPickerDialog.querySelector('.trend-medallion-arrow')).transform);
        assert.notEqual(animA, animB, `${delivery}/${profile} medallion diagnostic animation visibly changes transform`);

        const diagnosticExitInOpenPicker = await page.evaluate(() => {
          const card=window.aboutCard,dialog=card._medallionPickerDialog;
          card._stopDiagnostics();
          const stage=dialog.querySelector('[data-medallion-picker-diagnostic-stage]');
          const nav=dialog.querySelector('[data-medallion-picker-diagnostic-nav]');
          const readout=dialog.querySelector('[data-medallion-picker-diagnostic-readout]');
          const tools=dialog.querySelector('[data-medallion-picker-diagnostic-tools]');
          return {
            pickerOpen:!!dialog?.open,
            enabled:!!card._diagnostics?.enabled,
            stageHidden:stage.hidden,
            navHidden:nav.hidden,
            readoutHidden:readout.hidden,
            toolsHidden:tools.hidden,
            stageDisplay:getComputedStyle(stage).display,
            navDisplay:getComputedStyle(nav).display,
            stageMarkup:stage.innerHTML,
            navMarkup:nav.innerHTML,
          };
        });
        assert.equal(diagnosticExitInOpenPicker.pickerOpen, true, `${delivery}/${profile} diagnostic exit keeps medallion picker open`);
        assert.equal(diagnosticExitInOpenPicker.enabled, false, `${delivery}/${profile} diagnostic exit disables diagnostics`);
        assert.equal(diagnosticExitInOpenPicker.stageHidden, true, `${delivery}/${profile} diagnostic exit hides medallion stage overlay immediately`);
        assert.equal(diagnosticExitInOpenPicker.navHidden, true, `${delivery}/${profile} diagnostic exit hides medallion nav overlay immediately`);
        assert.equal(diagnosticExitInOpenPicker.readoutHidden, true, `${delivery}/${profile} diagnostic exit hides medallion readout immediately`);
        assert.equal(diagnosticExitInOpenPicker.toolsHidden, true, `${delivery}/${profile} diagnostic exit hides medallion tools immediately`);
        assert.equal(diagnosticExitInOpenPicker.stageDisplay, 'none', `${delivery}/${profile} hidden stage overlay wins over prior inline important display`);
        assert.equal(diagnosticExitInOpenPicker.navDisplay, 'none', `${delivery}/${profile} hidden nav overlay wins over prior inline important display`);
        assert.equal(diagnosticExitInOpenPicker.stageMarkup, '', `${delivery}/${profile} diagnostic exit clears stale medallion stage raster`);
        assert.equal(diagnosticExitInOpenPicker.navMarkup, '', `${delivery}/${profile} diagnostic exit clears stale medallion nav raster`);

        await page.evaluate(() => {
          const card=window.aboutCard;
          card._startDiagnostics();
          card._diagnostics.visualsVisible=true;
          card._diagnostics.grid='fine';
          Object.assign(card._diagnostics.overlays,{ids:true,boxes:true,centers:true,axes:true,diagonals:true});
          card._syncDiagnosticUi();
        });

        const fullscreen = await page.evaluate(() => {
          const card=window.aboutCard;
          card._closeMedallionPicker(false);
          card._setMapDisplayMode('fullscreen',{persist:false,remember:false,closeMenu:false});
          card._syncDiagnosticUi();
          card._renderDiagnosticOverlay();
          const dialog=card.shadow.getElementById('map-fullscreen-dialog'),overlay=card.shadow.getElementById('diagnostic-overlay'),consoleNode=card.shadow.getElementById('diagnostic-console');
          return {open:!!dialog?.open,overlayHosted:overlay?.parentNode===dialog,consoleHosted:consoleNode?.parentNode===dialog,grid:overlay?.textContent||''};
        });
        assert.equal(fullscreen.open, true, `${delivery}/${profile} fullscreen dialog opens`);
        assert.equal(fullscreen.overlayHosted, true, `${delivery}/${profile} diagnostic overlay follows fullscreen top layer`);
        assert.equal(fullscreen.consoleHosted, true, `${delivery}/${profile} diagnostic console follows fullscreen top layer`);
        assert.match(fullscreen.grid, /FS-A1/, `${delivery}/${profile} fullscreen receives its own diagnostic numbering`);

        const fullscreenPickerHost = await page.evaluate(() => {
          const card=window.aboutCard,fullscreen=card.shadow.getElementById('map-fullscreen-dialog');
          card._openCompassPicker();
          const picker=card._compassPickerDialog,consoleNode=card.shadow.getElementById('diagnostic-console');
          const inPicker=consoleNode?.parentNode===picker;
          card._closeCompassPicker(false);
          const restored=consoleNode?.parentNode===fullscreen;
          card._setMapDisplayMode('standard',{persist:false,remember:false,closeMenu:false});
          return {inPicker,restored};
        });
        assert.equal(fullscreenPickerHost.inPicker, true, `${delivery}/${profile} fullscreen picker keeps diagnostic console reachable`);
        assert.equal(fullscreenPickerHost.restored, true, `${delivery}/${profile} closing fullscreen picker restores diagnostic console to fullscreen`);

        await page.evaluate(() => {
          const card = window.aboutCard;
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

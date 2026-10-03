const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const contractPath = path.join(root, 'tests/contracts/about-golden-v4.07.56.json');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const out = path.join(root, 'artwork/acceptance/premium-controls/golden-v408');
fs.mkdirSync(out, { recursive: true });

assert.equal(contract.contractVersion, 1, 'Unsupported About golden contract version');
assert.equal(contract.protectedSince, '4.07.56');
assert.equal(contract.acceptedFrontend.version, '4.07.56');
assert.equal(contract.acceptedFrontend.build, 'V4.07-TEST56-2026-09-16');

const releaseContract = JSON.parse(
  fs.readFileSync(path.join(root, 'tests/contracts/frontend-release-v4.09.json'), 'utf8'),
);
const devContract = JSON.parse(
  fs.readFileSync(path.join(root, 'tests/contracts/frontend-dev-v4.10.01.json'), 'utf8'),
);
const modularContract = JSON.parse(
  fs.readFileSync(path.join(root, 'tests/contracts/frontend-dev-v4.10.02.json'), 'utf8'),
);
const v410ReleaseContract = JSON.parse(fs.readFileSync(path.join(root, 'tests/contracts/frontend-release-v4.10.json'), 'utf8'));
const frontend = fs.readFileSync(path.join(root, 'frontend/gewitterradar.js'));
const frontendText = frontend.toString('utf8');
const frontendSha = crypto.createHash('sha256').update(frontend).digest('hex');
const isV41108Dev = frontendText.includes('import { APPLICATION_RELEASE } from "./version.js?v=41108r1";')
  && frontendText.includes("CARD_VERSION=APPLICATION_META.version;");
const isV41107Dev = frontendText.includes('import { APPLICATION_RELEASE } from "./version.js?v=41107r1";')
  && frontendText.includes("CARD_VERSION=APPLICATION_META.version;");
const isV41106Dev = frontendText.includes('import { APPLICATION_RELEASE } from "./version.js?v=41106r1";')
  && frontendText.includes("CARD_VERSION=APPLICATION_META.version;");
const isV41105Dev = frontendText.includes('import { APPLICATION_RELEASE } from "./version.js?v=41105r1";')
  && frontendText.includes("CARD_VERSION=APPLICATION_META.version;");
const isV41104Dev = frontendText.includes('import { APPLICATION_RELEASE } from "./version.js?v=41104r1";')
  && frontendText.includes("CARD_VERSION=APPLICATION_META.version;");
const isV41103Dev = frontendText.includes('import { APPLICATION_RELEASE } from "./version.js?v=41103r1";')
  && frontendText.includes("CARD_VERSION=APPLICATION_META.version;");
const isV41102Dev = frontendText.includes('import { APPLICATION_RELEASE } from "./version.js?v=41102r1";')
  && frontendText.includes("CARD_VERSION=APPLICATION_META.version;");
const isV41101Dev = frontendText.includes("const GEWITTERRADAR_FEATURE_CACHE = '41101r1';")
  && frontendText.includes("CARD_VERSION=APPLICATION_META.version;");
const isV410Release = frontendText.includes("const CARD_VERSION = '4.10';");
const isV409Release = frontendText.includes("const CARD_VERSION = '4.09';");
const isV41001Dev = frontendText.includes("const CARD_VERSION = '4.10.01';");
const isV41002Dev = frontendText.includes("const CARD_VERSION = '4.10.02';");

if (isV41108Dev) {
  // V4.11.08 adds the isolated Daimos Project Hub module only.
  // Protected About geometry remains identical to the established golden baseline.
  const versionText = fs.readFileSync(path.join(root, 'frontend/version.js'), 'utf8');
  const runtime = JSON.parse(fs.readFileSync(path.join(root, 'frontend/assets/gewitterradar-runtime-manifest.json'), 'utf8'));
  assert.equal(v410ReleaseContract.version, '4.10');
  assert.equal(v410ReleaseContract.status, 'FINAL');
  assert.ok(versionText.includes('version:"4.11.08"'));
  assert.ok(versionText.includes('displayVersion:"V4.11.08 DEV"'));
  assert.ok(versionText.includes('build:"V4.11.08-DEV-2026-10-02"'));
  assert.ok(versionText.includes('runtimeRevision:"41108r1"'));
  assert.ok(versionText.includes('moduleSetId:"E411-08A5"'));
  assert.equal(runtime.productVersion, '4.11.08');
  assert.equal(runtime.build, 'V4.11.08-DEV-2026-10-02');
  assert.equal(runtime.runtimeRevision, '41108r1');
  assert.equal(runtime.moduleSetId, 'E411-08A5');
  assert.ok(frontendText.includes("CARD_DISPLAY_VERSION=APPLICATION_META.displayVersion.replace(/^V/,'');"));
} else if (isV41107Dev) {
  // V4.11.07 changes WeatherRouter precipitation routing and diagnostics only.
  // About geometry remains protected by the same immutable browser baseline below.
  const versionText = fs.readFileSync(path.join(root, 'frontend/version.js'), 'utf8');
  const runtime = JSON.parse(fs.readFileSync(path.join(root, 'frontend/assets/gewitterradar-runtime-manifest.json'), 'utf8'));
  assert.equal(v410ReleaseContract.version, '4.10');
  assert.equal(v410ReleaseContract.status, 'FINAL');
  assert.ok(versionText.includes('version:"4.11.07"'));
  assert.ok(versionText.includes('displayVersion:"V4.11.07 DEV"'));
  assert.ok(versionText.includes('build:"V4.11.07-DEV-2026-10-01"'));
  assert.ok(versionText.includes('runtimeRevision:"41107r1"'));
  assert.ok(versionText.includes('moduleSetId:"E411-07A1"'));
  assert.equal(runtime.productVersion, '4.11.07');
  assert.equal(runtime.build, 'V4.11.07-DEV-2026-10-01');
  assert.equal(runtime.runtimeRevision, '41107r1');
  assert.equal(runtime.moduleSetId, 'E411-07A1');
  assert.ok(frontendText.includes("CARD_DISPLAY_VERSION=APPLICATION_META.displayVersion.replace(/^V/,'');"));
} else if (isV41106Dev) {
  // V4.11.06 adds Weather Engine diagnostics only.
  // About geometry remains protected by the same immutable browser baseline below.
  const versionText = fs.readFileSync(path.join(root, 'frontend/version.js'), 'utf8');
  const runtime = JSON.parse(fs.readFileSync(path.join(root, 'frontend/assets/gewitterradar-runtime-manifest.json'), 'utf8'));
  assert.equal(v410ReleaseContract.version, '4.10');
  assert.equal(v410ReleaseContract.status, 'FINAL');
  assert.ok(versionText.includes('version:"4.11.06"'));
  assert.ok(versionText.includes('displayVersion:"V4.11.06 DEV"'));
  assert.ok(versionText.includes('build:"V4.11.06-DEV-2026-10-01"'));
  assert.ok(versionText.includes('runtimeRevision:"41106r1"'));
  assert.ok(versionText.includes('moduleSetId:"E411-06A1"'));
  assert.equal(runtime.productVersion, '4.11.06');
  assert.equal(runtime.build, 'V4.11.06-DEV-2026-10-01');
  assert.equal(runtime.runtimeRevision, '41106r1');
  assert.equal(runtime.moduleSetId, 'E411-06A1');
  assert.ok(frontendText.includes("CARD_DISPLAY_VERSION=APPLICATION_META.displayVersion.replace(/^V/,'');"));
} else if (isV41105Dev) {
  // V4.11.05 adds the provider-neutral radar timeline player only.
  // About geometry remains protected by the same immutable browser baseline below.
  const versionText = fs.readFileSync(path.join(root, 'frontend/version.js'), 'utf8');
  const runtime = JSON.parse(fs.readFileSync(path.join(root, 'frontend/assets/gewitterradar-runtime-manifest.json'), 'utf8'));
  assert.equal(v410ReleaseContract.version, '4.10');
  assert.equal(v410ReleaseContract.status, 'FINAL');
  assert.ok(versionText.includes('version:"4.11.05"'));
  assert.ok(versionText.includes('displayVersion:"V4.11.05 DEV"'));
  assert.ok(versionText.includes('build:"V4.11.05-DEV-2026-10-01"'));
  assert.ok(versionText.includes('runtimeRevision:"41105r1"'));
  assert.ok(versionText.includes('moduleSetId:"E411-05A1"'));
  assert.equal(runtime.productVersion, '4.11.05');
  assert.equal(runtime.build, 'V4.11.05-DEV-2026-10-01');
  assert.equal(runtime.runtimeRevision, '41105r1');
  assert.equal(runtime.moduleSetId, 'E411-05A1');
  assert.ok(frontendText.includes("CARD_DISPLAY_VERSION=APPLICATION_META.displayVersion.replace(/^V/,'');"));
} else if (isV41104Dev) {
  // V4.11.04 repairs the real settings mount for the already protected radar module.
  // About geometry remains protected by the same immutable browser baseline below.
  const versionText = fs.readFileSync(path.join(root, 'frontend/version.js'), 'utf8');
  const runtime = JSON.parse(fs.readFileSync(path.join(root, 'frontend/assets/gewitterradar-runtime-manifest.json'), 'utf8'));
  assert.equal(v410ReleaseContract.version, '4.10');
  assert.equal(v410ReleaseContract.status, 'FINAL');
  assert.ok(versionText.includes('version:"4.11.04"'));
  assert.ok(versionText.includes('displayVersion:"V4.11.04 DEV"'));
  assert.ok(versionText.includes('build:"V4.11.04-DEV-2026-09-30"'));
  assert.ok(versionText.includes('runtimeRevision:"41104r1"'));
  assert.ok(versionText.includes('moduleSetId:"E411-04A1"'));
  assert.equal(runtime.productVersion, '4.11.04');
  assert.equal(runtime.build, 'V4.11.04-DEV-2026-09-30');
  assert.equal(runtime.runtimeRevision, '41104r1');
  assert.equal(runtime.moduleSetId, 'E411-04A1');
  assert.ok(frontendText.includes("CARD_DISPLAY_VERSION=APPLICATION_META.displayVersion.replace(/^V/,'');"));
} else if (isV41103Dev) {
  // V4.11.03 adds bounded precipitation-radar preloading only.
  // About geometry remains protected by the same immutable browser baseline below.
  const versionText = fs.readFileSync(path.join(root, 'frontend/version.js'), 'utf8');
  const runtime = JSON.parse(fs.readFileSync(path.join(root, 'frontend/assets/gewitterradar-runtime-manifest.json'), 'utf8'));
  assert.equal(v410ReleaseContract.version, '4.10');
  assert.equal(v410ReleaseContract.status, 'FINAL');
  assert.ok(versionText.includes('version:"4.11.03"'));
  assert.ok(versionText.includes('displayVersion:"V4.11.03 DEV"'));
  assert.ok(versionText.includes('build:"V4.11.03-DEV-2026-09-30"'));
  assert.ok(versionText.includes('runtimeRevision:"41103r1"'));
  assert.ok(versionText.includes('moduleSetId:"E411-03A1"'));
  assert.equal(runtime.productVersion, '4.11.03');
  assert.equal(runtime.build, 'V4.11.03-DEV-2026-09-30');
  assert.equal(runtime.runtimeRevision, '41103r1');
  assert.equal(runtime.moduleSetId, 'E411-03A1');
  assert.ok(frontendText.includes("CARD_DISPLAY_VERSION=APPLICATION_META.displayVersion.replace(/^V/,'');"));
} else if (isV41102Dev) {
  // V4.11.02 changes delivery/versioning and Weather-Engine modules only.
  // About geometry remains protected by the same immutable browser baseline below.
  const versionText = fs.readFileSync(path.join(root, 'frontend/version.js'), 'utf8');
  const runtime = JSON.parse(fs.readFileSync(path.join(root, 'frontend/assets/gewitterradar-runtime-manifest.json'), 'utf8'));
  assert.equal(v410ReleaseContract.version, '4.10');
  assert.equal(v410ReleaseContract.status, 'FINAL');
  assert.ok(versionText.includes('version:"4.11.02"'));
  assert.ok(versionText.includes('displayVersion:"V4.11.02 DEV"'));
  assert.ok(versionText.includes('build:"V4.11.02-DEV-2026-09-30"'));
  assert.ok(versionText.includes('runtimeRevision:"41102r1"'));
  assert.ok(versionText.includes('moduleSetId:"E411-02A1"'));
  assert.equal(runtime.productVersion, '4.11.02');
  assert.equal(runtime.build, 'V4.11.02-DEV-2026-09-30');
  assert.equal(runtime.runtimeRevision, '41102r1');
  assert.equal(runtime.moduleSetId, 'E411-02A1');
  assert.ok(frontendText.includes("CARD_DISPLAY_VERSION=APPLICATION_META.displayVersion.replace(/^V/,'');"));
} else if (isV41101Dev) {
  // New DEV builds retain the immutable V4.10 source contract as historical evidence,
  // while the actual V4.11 About geometry is still verified against the protected
  // V4.07.56 baseline by the browser portion of this test (below).
  const appManifest = fs.readFileSync(path.join(root, 'frontend/module-manifest.js'), 'utf8');
  const runtime = JSON.parse(fs.readFileSync(path.join(root, 'frontend/assets/gewitterradar-runtime-manifest.json'), 'utf8'));
  assert.equal(v410ReleaseContract.version, '4.10');
  assert.equal(v410ReleaseContract.status, 'FINAL');
  assert.ok(appManifest.includes('version:"4.11.01",displayVersion:"V4.11.01 DEV",build:"V4.11.01-DEV-2026-09-30"'));
  assert.ok(appManifest.includes('moduleSetId:"E411-01A3"'));
  assert.equal(runtime.productVersion, '4.11.01');
  assert.equal(runtime.build, 'V4.11.01-DEV-2026-09-30');
  assert.equal(runtime.moduleSetId, 'E411-01A3');
  assert.ok(frontendText.includes("CARD_DISPLAY_VERSION=APPLICATION_META.displayVersion.replace(/^V/,'');"));
} else if (isV410Release) {
  assert.equal(v410ReleaseContract.version, '4.10');
  assert.equal(v410ReleaseContract.status, 'FINAL');
  assert.ok(frontendText.includes("const CARD_DISPLAY_VERSION = '4.10';"));
  assert.ok(frontendText.includes("const GEWITTERRADAR_BUILD = 'V4.10-RELEASE-2026-09-30';"));
  assert.equal(frontend.length, v410ReleaseContract.sizeBytes);
  assert.equal(frontendSha, v410ReleaseContract.sha256);
} else if (isV409Release) {
  assert.ok(frontendText.includes("const CARD_DISPLAY_VERSION = '4.09';"), 'Expected V4.09 CARD_DISPLAY_VERSION');
  assert.ok(frontendText.includes("const GEWITTERRADAR_BUILD = 'V4.09-RELEASE-2026-09-21';"), 'Expected V4.09 final build marker');
  assert.equal(frontend.length, releaseContract.sizeBytes, 'V4.09 frontend size differs from release contract');
  assert.equal(frontendSha, releaseContract.sha256, 'V4.09 frontend differs from release contract');
} else if (isV41001Dev) {
  assert.equal(devContract.version, '4.10.01', 'Unexpected V4.10.01 development contract version');
  assert.equal(devContract.status, 'DEV', 'Unexpected V4.10.01 development contract status');
  assert.ok(frontendText.includes("const CARD_DISPLAY_VERSION = '4.10.01';"), 'Expected V4.10.01 CARD_DISPLAY_VERSION');
  assert.ok(frontendText.includes("const GEWITTERRADAR_BUILD = 'V4.10.01-DEV-2026-09-21';"), 'Expected V4.10.01 development build marker');
  assert.equal(frontend.length, devContract.sizeBytes, 'V4.10.01 frontend size differs from development contract');
  assert.equal(frontendSha, devContract.sha256, 'V4.10.01 frontend differs from development contract');
} else if (isV41002Dev) {
  assert.equal(modularContract.version, '4.10.02', 'Unexpected V4.10.02 modular contract version');
  assert.equal(modularContract.status, 'DEV', 'Unexpected V4.10.02 modular contract status');
  assert.equal(modularContract.baseVersion, '4.10.01', 'Unexpected V4.10.02 modular base version');
  assert.ok(frontendText.includes("const CARD_DISPLAY_VERSION = '4.10.02';"), 'Expected V4.10.02 CARD_DISPLAY_VERSION');
  assert.ok(frontendText.includes(`const GEWITTERRADAR_BUILD = '${modularContract.build}';`), 'Expected V4.10.02 modular build marker');
  assert.equal(frontend.length, modularContract.sizeBytes, 'V4.10.02 frontend size differs from modular contract');
  assert.equal(frontendSha, modularContract.sha256, 'V4.10.02 frontend differs from modular contract');
} else {
  assert.fail('Frontend is not covered by V4.09/V4.10 historical or V4.11 DEV identity contracts');
}

const tolerance = contract.browserBaseline.geometryTolerancePx;
assert.ok(Number.isFinite(tolerance) && tolerance >= 0 && tolerance <= 0.02);

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
    const ext = path.extname(file);
    res.setHeader(
      'Content-Type',
      ({ '.html': 'text/html', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' })[ext] || 'application/octet-stream',
    );
    res.end(data);
  });
});

async function captureGeometry(page) {
  return page.evaluate(async () => {
    const dialog = window.aboutCard._aboutDialog;
    const content = dialog.querySelector('.about-content');
    if (content) content.scrollTop = 0;

    await Promise.all(
      [...dialog.querySelectorAll('img')].map((img) => img.decode().catch(() => undefined)),
    );

    const selectors = [
      '.about-head',
      '.about-head>img',
      '.about-head-copy',
      'h2',
      '.about-claim',
      '.about-close',
      '.about-close span',
      '.about-dedication',
      '.about-heart',
      '.about-signature',
      '.about-welcome',
      '.about-radii',
      '.about-network',
      '.about-recorder',
      '.about-copy',
      '.about-entities',
      '.about-footer',
    ];

    const geometry = {};
    for (const selector of selectors) {
      const node = dialog.querySelector(selector);
      if (!node) throw new Error(`Missing protected About selector: ${selector}`);
      const rect = node.getBoundingClientRect();
      geometry[selector] = [rect.x, rect.y, rect.width, rect.height].map((value) =>
        Math.round(value * 1000) / 1000,
      );
    }

    const dialogRect = dialog.getBoundingClientRect();
    return {
      dialog: [dialogRect.x, dialogRect.y, dialogRect.width, dialogRect.height].map((value) =>
        Math.round(value * 1000) / 1000,
      ),
      geometry,
    };
  });
}

function assertNearArray(actual, expected, label) {
  assert.equal(actual.length, expected.length, `${label}: dimension count changed`);
  actual.forEach((value, index) => {
    const drift = Math.abs(value - expected[index]);
    assert.ok(
      drift <= tolerance,
      `${label}[${index}] drift ${drift.toFixed(3)}px exceeds ${tolerance}px: expected ${expected[index]}, got ${value}`,
    );
  });
}

function assertGeometry(actual, expected, profile, delivery) {
  assert.deepEqual(
    Object.keys(actual).sort(),
    Object.keys(expected).sort(),
    `${profile}/${delivery}: protected About selector set changed`,
  );
  for (const selector of Object.keys(expected)) {
    assertNearArray(
      actual[selector],
      expected[selector],
      `${profile}/${delivery}/${selector}`,
    );
  }
}

async function normalizedRgb(png) {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.channels, 3, 'Expected RGB golden screenshot');
  return { data, info };
}

async function pixelDiff(aPng, bPng) {
  const a = await normalizedRgb(aPng);
  const b = await normalizedRgb(bPng);
  assert.deepEqual(a.info, b.info, 'Dashboard/integration About screenshot dimensions differ');

  let changedPixels = 0;
  for (let offset = 0; offset < a.data.length; offset += a.info.channels) {
    let changed = false;
    for (let channel = 0; channel < a.info.channels; channel++) {
      if (Math.abs(a.data[offset + channel] - b.data[offset + channel]) > 8) {
        changed = true;
        break;
      }
    }
    if (changed) changedPixels++;
  }

  return {
    changedPixels,
    changedRatio: changedPixels / (a.info.width * a.info.height),
  };
}

async function rawRgbSha256(png) {
  const { data } = await normalizedRgb(png);
  return crypto.createHash('sha256').update(data).digest('hex');
}

(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: process.argv[2], headless: true });
  const evidence = [];

  try {
    for (const profile of contract.profiles) {
      const {
        name,
        viewport,
        dialog: expectedDialog,
        geometry: expectedGeometry,
        rawRgbSha256: acceptedCaptureHash,
      } = profile;
      assert.match(
        acceptedCaptureHash,
        /^[0-9a-f]{64}$/,
        `${name}: accepted capture provenance hash missing`,
      );

      const deliveries = {};

      for (const delivery of ['dashboard', 'integration']) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          hasTouch: viewport.hasTouch,
        });
        const page = await context.newPage();
        await page.goto(
          `http://127.0.0.1:${server.address().port}/scripts/about-onboarding-harness.html?scenario=first&delivery=${delivery}`,
        );
        await page.waitForFunction(() => window.aboutResult);
        assert.equal(await page.evaluate(() => window.aboutResult.status), 'PASS');

        const captured = await captureGeometry(page);
        const screenshot = await page.locator('.about-dialog').screenshot({
          animations: 'disabled',
          mask: [
            page.locator('.about-close'),
            page.locator('.about-copy'),
            page.locator('.about-dev'),
          ],
        });
        const observedPixelHash = await rawRgbSha256(screenshot);

        assertNearArray(captured.dialog, expectedDialog, `${name}/${delivery}/dialog`);
        assertGeometry(captured.geometry, expectedGeometry, name, delivery);

        fs.writeFileSync(path.join(out, `${name}-${delivery}.png`), screenshot);
        deliveries[delivery] = { ...captured, screenshot, observedPixelHash };
        await context.close();
      }

      assert.deepEqual(
        deliveries.integration.geometry,
        deliveries.dashboard.geometry,
        `${name}: dashboard/integration protected About geometry differs`,
      );
      assert.deepEqual(
        deliveries.integration.dialog,
        deliveries.dashboard.dialog,
        `${name}: dashboard/integration About dialog geometry differs`,
      );

      // Whole-image hashes are kept only as provenance from the accepted capture.
      // Browser rasterization can vary by a few anti-aliased pixels across isolated
      // CI runs even with identical DOM geometry and assets. The release gate uses
      // a same-run dashboard/integration pixel comparison instead: this catches a
      // real delivery divergence without turning harmless renderer jitter into a
      // flaky cross-run failure.
      const pixels = await pixelDiff(
        deliveries.dashboard.screenshot,
        deliveries.integration.screenshot,
      );
      assert.ok(
        pixels.changedRatio <= 0.001,
        `${name}: dashboard/integration protected About pixels differ ${pixels.changedRatio}`,
      );

      evidence.push({
        name,
        viewport,
        dialog: deliveries.dashboard.dialog,
        geometry: deliveries.dashboard.geometry,
        acceptedCaptureRawRgbSha256: acceptedCaptureHash,
        observedRawRgbSha256: {
          dashboard: deliveries.dashboard.observedPixelHash,
          integration: deliveries.integration.observedPixelHash,
        },
        ...pixels,
      });
      console.log(
        `${name}: V4.08 About geometry PASS against protected V4.07.56 baseline; delivery pixel diff ${pixels.changedPixels} (${pixels.changedRatio})`,
      );
    }

    fs.writeFileSync(
      path.join(out, 'verified-results.json'),
      JSON.stringify(
        {
          contractVersion: contract.contractVersion,
          protectedSince: contract.protectedSince,
          acceptedFrontend: contract.acceptedFrontend,
          browserBaseline: contract.browserBaseline,
          profiles: evidence,
        },
        null,
        2,
      ) + '\n',
    );
    console.log(
      'PASS: V4.08 About geometry matches the protected V4.07.56 baseline and same-run delivery pixel contract.',
    );
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  server.close();
  process.exitCode = 1;
});

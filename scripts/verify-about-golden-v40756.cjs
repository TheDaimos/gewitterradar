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
const out = path.join(root, 'artwork/acceptance/premium-controls/golden-v40756');
fs.mkdirSync(out, { recursive: true });

assert.equal(contract.contractVersion, 1, 'Unsupported About golden contract version');
assert.equal(contract.protectedSince, '4.07.56');
assert.equal(contract.acceptedFrontend.version, '4.07.56');
assert.equal(contract.acceptedFrontend.build, 'V4.07-TEST56-2026-09-16');

const frontend = fs.readFileSync(path.join(root, 'frontend/gewitterradar.js'));
const frontendSha = crypto.createHash('sha256').update(frontend).digest('hex');
assert.equal(
  frontendSha,
  contract.acceptedFrontend.sha256,
  'About golden contract is only valid for the exact accepted V4.07.56 frontend baseline',
);

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

async function rawRgbSha256(png) {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.channels, 3, 'Expected RGB golden screenshot');
  return crypto.createHash('sha256').update(data).digest('hex');
}

(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: process.argv[2], headless: true });
  const evidence = [];

  try {
    for (const profile of contract.profiles) {
      const { name, viewport, dialog: expectedDialog, geometry: expectedGeometry, rawRgbSha256: expectedPixels } = profile;
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
        const pixelHash = await rawRgbSha256(screenshot);

        assertNearArray(captured.dialog, expectedDialog, `${name}/${delivery}/dialog`);
        assertGeometry(captured.geometry, expectedGeometry, name, delivery);
        assert.equal(
          pixelHash,
          expectedPixels,
          `${name}/${delivery}: accepted V4.07.56 masked About pixels changed`,
        );

        fs.writeFileSync(path.join(out, `${name}-${delivery}.png`), screenshot);
        deliveries[delivery] = { ...captured, pixelHash };
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
      assert.equal(
        deliveries.integration.pixelHash,
        deliveries.dashboard.pixelHash,
        `${name}: dashboard/integration masked About pixels differ`,
      );

      evidence.push({
        name,
        viewport,
        dialog: deliveries.dashboard.dialog,
        geometry: deliveries.dashboard.geometry,
        rawRgbSha256: deliveries.dashboard.pixelHash,
      });
      console.log(`${name}: V4.07.56 About golden geometry/pixels PASS`);
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
    console.log('PASS: accepted V4.07.56 About golden contract verified for both deliveries.');
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  server.close();
  process.exitCode = 1;
});

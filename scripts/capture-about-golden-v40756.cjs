const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'artwork/acceptance/premium-controls/golden-v40756');
fs.mkdirSync(out, { recursive: true });

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

async function pixelDiff(aBuffer, bBuffer) {
  const a = await sharp(aBuffer).raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(bBuffer).raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual(a.info, b.info, 'Dashboard/integration About screenshot dimensions differ');

  let changed = 0;
  for (let i = 0; i < a.data.length; i += a.info.channels) {
    let pixelChanged = false;
    for (let channel = 0; channel < a.info.channels; channel++) {
      if (Math.abs(a.data[i + channel] - b.data[i + channel]) > 8) {
        pixelChanged = true;
        break;
      }
    }
    if (pixelChanged) changed++;
  }
  return {
    changedPixels: changed,
    changedRatio: changed / (a.info.width * a.info.height),
  };
}

(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: process.argv[2], headless: true });

  const profiles = [
    ['reference', 732, 879, false],
    ['desktop', 1440, 1000, false],
    ['ipad-landscape', 1024, 768, true],
    ['ipad-portrait', 768, 1024, true],
    ['ipad-pro', 1366, 1024, true],
    ['android-portrait', 412, 915, true],
    ['android-landscape', 915, 412, true],
  ];

  const results = [];

  try {
    for (const [name, width, height, hasTouch] of profiles) {
      const deliveries = {};

      for (const delivery of ['dashboard', 'integration']) {
        const context = await browser.newContext({ viewport: { width, height }, hasTouch });
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

        fs.writeFileSync(path.join(out, `${name}-${delivery}.png`), screenshot);
        deliveries[delivery] = { ...captured, screenshot };
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

      const pixels = await pixelDiff(
        deliveries.dashboard.screenshot,
        deliveries.integration.screenshot,
      );
      assert.ok(
        pixels.changedRatio <= 0.001,
        `${name}: dashboard/integration protected About pixels differ ${pixels.changedRatio}`,
      );

      const result = {
        name,
        viewport: { width, height, hasTouch },
        dialog: deliveries.dashboard.dialog,
        geometry: deliveries.dashboard.geometry,
        ...pixels,
      };
      results.push(result);
      console.log(`V40756_GOLDEN ${JSON.stringify(result)}`);
    }

    const evidence = {
      version: '4.07.56',
      build: 'V4.07-TEST56-2026-09-16',
      acceptedFrontendSha256: '249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a',
      profiles: results,
    };
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(evidence, null, 2) + '\n');
    console.log('PASS: V4.07.56 About golden capture is delivery-identical across all protected profiles.');
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  server.close();
  process.exitCode = 1;
});

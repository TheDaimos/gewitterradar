const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    res.setHeader('Content-Type', path.extname(file) === '.html' ? 'text/html' : path.extname(file) === '.js' ? 'text/javascript' : 'application/octet-stream');
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
      ['android-portrait', 412, 915, true],
    ];
    const expectedVersions = [
      'V4.07 · PLANNED',
      'V4.06 · 2026/09',
      'V4.05 · 2026/09',
      'V4.04 · 2026/09',
      'V4.03 · 2026/09',
      'V4.02 · 2026/09',
      'V4.01 · 2026/09',
      'V4.00 · 2026/09',
      'V3.997 · 2026/08',
      'V3.996 · 2026/08',
      'V3.994 · 2026/08',
      'V3.993 · 2026/08',
      'V3.98 · 2026/08',
    ];

    for (const delivery of ['dashboard', 'integration']) {
      for (const [profile, width, height, hasTouch] of profiles) {
        const context = await browser.newContext({ viewport: { width, height }, hasTouch });
        const page = await context.newPage();
        await page.goto(`http://127.0.0.1:${server.address().port}/scripts/about-onboarding-harness.html?scenario=first&delivery=${delivery}`);
        await page.waitForFunction(() => window.aboutResult);
        assert.equal(await page.evaluate(() => window.aboutResult.status), 'PASS');

        const welcome = await page.evaluate(() => {
          const dialog = window.aboutCard._aboutDialog;
          const footer = dialog.querySelector('.about-footer');
          return {
            text: dialog.querySelector('.about-dev').textContent,
            overflow: footer.scrollWidth > footer.clientWidth,
          };
        });
        assert.equal(welcome.text, '2026/09 · V4.06 · Gewitterradar · by CK', `${delivery}/${profile} Welcome release stamp`);
        assert.equal(welcome.overflow, false, `${delivery}/${profile} Welcome footer remains within width`);

        await page.evaluate(() => {
          const card = window.aboutCard;
          card._closeAbout(false, false);
          card.shadowRoot.getElementById('settings-open').click();
        });
        await page.waitForFunction(() => window.aboutCard.shadowRoot.getElementById('settings-backdrop')?.classList.contains('open'));
        const settings = await page.evaluate(() => {
          const dialog = window.aboutCard.shadowRoot.getElementById('settings-dialog');
          return {
            text: dialog.querySelector('.settings-footer-version').textContent,
            overflow: dialog.scrollWidth > dialog.clientWidth,
          };
        });
        assert.equal(settings.text, '2026/09 · V4.06', `${delivery}/${profile} Settings release stamp`);
        assert.equal(settings.overflow, false, `${delivery}/${profile} Settings release stamp does not overflow`);

        const history = await page.evaluate(() => {
          const root = window.aboutCard.shadowRoot;
          const backdrop = root.getElementById('release-history-backdrop');
          backdrop.classList.add('open');
          backdrop.setAttribute('aria-hidden', 'false');
          const dialog = root.getElementById('release-history-dialog');
          return {
            current: dialog.querySelector('.release-history-current').textContent,
            versions: [...dialog.querySelectorAll('.release-history-version')].map((node) => node.textContent),
            text: dialog.textContent,
            overflow: dialog.scrollWidth > dialog.clientWidth,
          };
        });
        assert.equal(history.current, '2026/09 · V4.06', `${delivery}/${profile} Release History current stamp`);
        assert.deepEqual(history.versions, expectedVersions, `${delivery}/${profile} Release History chronology`);
        assert.match(history.text, /15 languages plus 4 German dialect variants/, `${delivery}/${profile} 15+4 language scope documented`);
        assert.match(history.text, /Worldwide location search/, `${delivery}/${profile} V4.07 plan documented`);
        assert.equal(history.overflow, false, `${delivery}/${profile} Release History has no horizontal overflow`);

        await context.close();
        console.log(`${delivery}/${profile}: V4.06 release metadata/history PASS`);
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

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
      ['ipad-pro', 1366, 1024, true],
      ['android-portrait', 412, 915, true],
      ['android-landscape', 915, 412, true],
    ];

    for (const delivery of ['dashboard', 'integration']) {
      for (const [profile, width, height, hasTouch] of profiles) {
        const context = await browser.newContext({ viewport: { width, height }, hasTouch });
        const page = await context.newPage();
        await page.goto(`http://127.0.0.1:${server.address().port}/scripts/about-onboarding-harness.html?scenario=first&delivery=${delivery}`);
        await page.waitForFunction(() => window.aboutResult);
        assert.equal(await page.evaluate(() => window.aboutResult.status), 'PASS');

        const settings = await page.evaluate(() => {
          const card = window.aboutCard;
          card._closeAbout(false, false);
          card.shadowRoot.getElementById('settings-open').click();
          const root = card.shadowRoot;
          const dialog = root.getElementById('settings-dialog');
          const close = root.getElementById('settings-close');
          const image = close.querySelector('img');
          const frame = getComputedStyle(dialog, '::after');
          const links = [...root.querySelectorAll('.settings-premium-link')].map((node) => {
            const r = node.getBoundingClientRect();
            return { top:r.top, left:r.left, width:r.width, height:r.height };
          });
          return {
            closeSize:[close.offsetWidth, close.offsetHeight],
            closeImage:image ? new URL(image.src).pathname : '',
            closeText:close.textContent.trim(),
            overflow:dialog.scrollWidth > dialog.clientWidth,
            border:getComputedStyle(dialog).borderTopColor,
            radius:getComputedStyle(dialog).borderTopLeftRadius,
            frameContent:frame.content,
            frameBorder:frame.borderTopColor,
            frameWidth:frame.borderTopWidth,
            links,
          };
        });
        assert.deepEqual(settings.closeSize, [44,44], `${delivery}/${profile} settings close hit target`);
        assert.match(settings.closeImage, /gewitterradar-about-close-premium\.webp$/);
        assert.equal(settings.closeText, '', `${delivery}/${profile} no legacy settings x`);
        assert.equal(settings.overflow, false, `${delivery}/${profile} settings overflow`);
        assert.notEqual(settings.border, 'rgba(0, 0, 0, 0)');
        assert.notEqual(settings.frameContent, 'none');
        assert.notEqual(settings.frameBorder, 'rgba(0, 0, 0, 0)');
        assert.ok(parseFloat(settings.frameWidth) >= 1, `${delivery}/${profile} settings inner frame`);
        assert.ok(parseFloat(settings.radius) >= 20, `${delivery}/${profile} settings radius`);
        if (profile === 'android-portrait') {
          assert.equal(settings.links.length, 2);
          assert.ok(Math.abs(settings.links[0].top-settings.links[1].top) <= 2, 'phone portrait premium links stay side-by-side');
        }

        await page.evaluate(() => window.aboutCard._openHelp());
        await page.waitForFunction(() => window.aboutCard._helpDialog?.open);
        const help = await page.evaluate(() => {
          const dialog = window.aboutCard._helpDialog;
          const close = dialog.querySelector('.help-close');
          const closeImage = close.querySelector('img');
          const copy = dialog.querySelector('[data-help-section="recorder"] .help-copy');
          const copyImage = copy?.querySelector('img');
          const gear = dialog.querySelector('[data-help-section="functions"] .help-section-icon svg');
          const frame = getComputedStyle(dialog, '::after');
          const content = dialog.querySelector('.help-content');
          return {
            closeSize:[close.offsetWidth,close.offsetHeight],
            closeImage:closeImage ? new URL(closeImage.src).pathname : '',
            closeText:close.textContent.trim(),
            copySize:copy ? [copy.offsetWidth,copy.offsetHeight] : [],
            copyImage:copyImage ? new URL(copyImage.src).pathname : '',
            gear:!!gear,
            gearPath:gear?.querySelector('path')?.getAttribute('d') || '',
            overflow:dialog.scrollWidth > dialog.clientWidth || content.scrollWidth > content.clientWidth,
            border:getComputedStyle(dialog).borderTopColor,
            radius:getComputedStyle(dialog).borderTopLeftRadius,
            frameContent:frame.content,
            frameBorder:frame.borderTopColor,
            frameWidth:frame.borderTopWidth,
          };
        });
        assert.deepEqual(help.closeSize, [44,44]);
        assert.match(help.closeImage, /gewitterradar-about-close-premium\.webp$/);
        assert.equal(help.closeText, '', `${delivery}/${profile} no legacy help x`);
        assert.deepEqual(help.copySize, [44,44]);
        assert.match(help.copyImage, /gewitterradar-about-copy-scroll\.webp$/);
        assert.equal(help.gear, true, `${delivery}/${profile} premium functions gear`);
        assert.match(help.gearPath, /^M48 21l4 2 5-1/);
        assert.equal(help.overflow, false, `${delivery}/${profile} help overflow`);
        assert.notEqual(help.border, 'rgba(0, 0, 0, 0)');
        assert.notEqual(help.frameContent, 'none');
        assert.notEqual(help.frameBorder, 'rgba(0, 0, 0, 0)');
        assert.ok(parseFloat(help.frameWidth) >= 1, `${delivery}/${profile} help inner frame`);
        assert.ok(parseFloat(help.radius) >= 11, `${delivery}/${profile} help radius`);

        await context.close();
        console.log(`${delivery}/${profile}: V4.06 UI-polish preview PASS`);
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

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
      ['desktop', 1440, 1000, false, false],
      ['ipad', 1024, 768, true, true],
      ['ipad-pro', 1366, 1024, true, true],
      ['android-portrait', 412, 915, true, false],
      ['android-landscape', 915, 412, true, false],
    ];

    for (const delivery of ['dashboard', 'integration']) {
      for (const [profile, width, height, hasTouch, expectTabletFix] of profiles) {
        const context = await browser.newContext({ viewport: { width, height }, hasTouch });
        const page = await context.newPage();
        await page.goto(`http://127.0.0.1:${server.address().port}/scripts/about-onboarding-harness.html?scenario=first&delivery=${delivery}`);
        await page.waitForFunction(() => window.aboutResult);
        assert.equal(await page.evaluate(() => window.aboutResult.status), 'PASS');

        await page.evaluate(() => {
          const card=window.aboutCard;
          card._closeAbout(false,false);
          card.shadowRoot.getElementById('settings-open').click();
          card.shadowRoot.getElementById('settings-about').click();
        });
        await page.waitForFunction(() => window.aboutCard._aboutDialog?.open);

        const state = await page.evaluate(() => {
          const card=window.aboutCard,dialog=card._aboutDialog,close=dialog.querySelector('[data-about-close]');
          const style=getComputedStyle(close);
          return {
            touchTablet:dialog.classList.contains('about-touch-tablet'),
            activeIsDialog:card.shadowRoot.activeElement===dialog,
            activeIsClose:card.shadowRoot.activeElement===close,
            outlineStyle:style.outlineStyle,
            outlineWidth:style.outlineWidth,
            boxShadow:style.boxShadow,
            closeImage:new URL(close.querySelector('img').src).pathname,
            closeSize:[close.offsetWidth,close.offsetHeight],
          };
        });

        assert.deepEqual(state.closeSize,[44,44],`${delivery}/${profile} accepted close hit target remains`);
        assert.match(state.closeImage,/gewitterradar-about-close-premium\.webp$/);
        assert.equal(state.touchTablet,expectTabletFix,`${delivery}/${profile} touch-tablet reopen classification`);
        if (expectTabletFix) {
          assert.equal(state.activeIsDialog,true,`${delivery}/${profile} reopened About focuses dialog, not close button`);
          assert.equal(state.activeIsClose,false,`${delivery}/${profile} close button not retained as WebKit focus target`);
          assert.ok(state.outlineStyle==='none' || parseFloat(state.outlineWidth)===0,`${delivery}/${profile} no close focus outline`);
          assert.equal(state.boxShadow,'none',`${delivery}/${profile} no close focus shadow`);
        } else {
          assert.equal(state.activeIsClose,true,`${delivery}/${profile} existing non-tablet focus behavior preserved`);
        }

        await context.close();
        console.log(`${delivery}/${profile}: V4.06 UI-polish pass3 PASS`);
      }
    }
  } finally { await browser.close(); server.close(); }
})().catch((error)=>{console.error(error);server.close();process.exitCode=1;});

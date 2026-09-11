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
        await page.waitForFunction(() => !!window.aboutCard?._aboutDialog?.querySelector('#about-footer-signature-image')?.getAttribute('href'));

        const about = await page.evaluate(() => {
          const card=window.aboutCard,dialog=card._aboutDialog,footer=dialog.querySelector('.about-footer');
          const left=footer.querySelector('.about-footer-left');
          const sig=footer.querySelector('.about-footer-signature');
          const version=footer.querySelector('.about-dev');
          const understood=footer.querySelector('.about-understood');
          const rect=(el)=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,cx:r.left+r.width/2,cy:r.top+r.height/2};};
          return {
            footer:rect(footer), left:rect(left), sig:rect(sig), version:rect(version), understood:rect(understood),
            versionText:version.textContent,
            overflow:footer.scrollWidth>footer.clientWidth,
            radii:[...dialog.querySelectorAll('.about-radius')].map((row)=>{const output=row.querySelector('output');return {row:rect(row),out:rect(output),text:output.textContent};}),
          };
        });

        assert.equal(about.versionText,'V4.06 · Visual V2 · Gewitterradar · by CK',`${delivery}/${profile} compact Welcome version line`);
        assert.equal(about.overflow,false,`${delivery}/${profile} Welcome footer has no horizontal overflow`);
        if (width > 620) {
          assert.ok(about.sig.width >= 190 && about.sig.width <= 198,`${delivery}/${profile} signature enlarged about 15 percent`);
          const desired=(about.footer.left+about.understood.left)/2;
          assert.ok(Math.abs(about.sig.cx-desired)<=22,`${delivery}/${profile} signature centered between left frame and Verstanden button`);
          assert.ok(Math.abs(about.sig.cy-about.understood.cy)<=1.5,`${delivery}/${profile} signature vertically centered with footer buttons`);
          const versionLeftInset=about.version.left-about.footer.left;
          const versionBottomInset=about.footer.bottom-about.version.bottom;
          assert.ok(versionLeftInset>=0 && versionLeftInset<=32,`${delivery}/${profile} version moved into lower-left corner with small inset`);
          assert.ok(versionBottomInset>=0 && versionBottomInset<=18,`${delivery}/${profile} version keeps a small bottom inset`);
        } else {
          assert.ok(about.sig.width >= 138 && about.sig.width <= 146,`${delivery}/${profile} mobile signature enlarged about 18 percent`);
          assert.ok(about.version.top >= about.sig.bottom - 0.75,`${delivery}/${profile} mobile version remains below signature`);
          assert.ok(about.version.top - about.sig.bottom <= 10,`${delivery}/${profile} mobile version spacing below signature remains deliberate`);
        }
        assert.equal(about.radii.length,3,`${delivery}/${profile} all three radius rows present`);
        for (const [index,entry] of about.radii.entries()) {
          assert.ok(entry.out.width >= 57.5,`${delivery}/${profile} radius ${index+1} badge enlarged to 25-percent target width`);
          assert.ok(Math.abs(entry.out.cy-entry.row.cy)<=1,`${delivery}/${profile} radius ${index+1} badge vertically centered in its row`);
        }

        await page.evaluate(() => {
          const card=window.aboutCard;
          card._closeAbout(false,false);
          card.shadowRoot.getElementById('settings-open').click();
        });
        await page.waitForFunction(() => window.aboutCard.shadowRoot.getElementById('settings-backdrop')?.classList.contains('open'));

        const settings = await page.evaluate(() => {
          const card=window.aboutCard,dialog=card.shadowRoot.getElementById('settings-dialog');
          const version=dialog.querySelector('.settings-footer-version');
          const r=version.getBoundingClientRect(),d=dialog.getBoundingClientRect();
          return {
            text:version.textContent,
            headerVersionCount:dialog.querySelectorAll('.settings-head-actions .settings-version').length,
            left:r.left,top:r.top,bottom:r.bottom,
            dialog:{left:d.left,top:d.top,right:d.right,bottom:d.bottom,width:d.width,height:d.height},
            overflow:dialog.scrollWidth>dialog.clientWidth,
          };
        });
        assert.equal(settings.text,'V4.06',`${delivery}/${profile} Settings version text preserved`);
        assert.equal(settings.headerVersionCount,0,`${delivery}/${profile} Settings version removed from header`);
        assert.ok(settings.left < settings.dialog.left + settings.dialog.width/2,`${delivery}/${profile} Settings version moved to lower-left area`);
        assert.ok(settings.top > settings.dialog.top + settings.dialog.height*.72,`${delivery}/${profile} Settings version is in bottom quarter`);
        assert.ok(settings.dialog.bottom-settings.bottom <= 34,`${delivery}/${profile} Settings version remains near bottom edge`);
        assert.equal(settings.overflow,false,`${delivery}/${profile} Settings dialog has no horizontal overflow`);

        await context.close();
        console.log(`${delivery}/${profile}: V4.06 UI-polish pass5 PASS`);
      }
    }
  } finally { await browser.close(); server.close(); }
})().catch((error)=>{console.error(error);server.close();process.exitCode=1;});

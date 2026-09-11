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
        await page.waitForFunction(() => {
          const card=window.aboutCard;
          return !!card?._aboutDialog?.querySelector('#about-footer-signature-image')?.getAttribute('href') && !!card.shadowRoot.getElementById('settings-signature-image')?.getAttribute('href');
        });

        const footer = await page.evaluate(() => {
          const card=window.aboutCard,dialog=card._aboutDialog;
          const footer=dialog.querySelector('.about-footer');
          const understood=footer.querySelector('.about-understood');
          const later=footer.querySelector('.about-later');
          const gear=footer.querySelector('.about-footer-reminder .about-icon');
          const sig=footer.querySelector('.about-footer-signature');
          const sigImage=footer.querySelector('#about-footer-signature-image');
          const settingsSig=card.shadowRoot.getElementById('settings-signature-image');
          const center=(el)=>{const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height};};
          const before=getComputedStyle(understood,'::before');
          const label=getComputedStyle(understood.querySelector('span'));
          return {
            leftExists:!!footer.querySelector('.about-footer-left'),
            signatureViewBox:sig?.getAttribute('viewBox')||'',
            signatureHref:sigImage?.getAttribute('href')||'',
            settingsSignatureHref:settingsSig?.getAttribute('href')||'',
            signatureFilter:getComputedStyle(sig).filter,
            settingsSignatureFilter:getComputedStyle(card.shadowRoot.querySelector('.settings-signature')).filter,
            understood:center(understood), later:center(later), gear:center(gear),
            beforeTop:before.top,beforeBottom:before.bottom,labelTransform:label.transform,
            overflow:footer.scrollWidth>footer.clientWidth,
          };
        });
        assert.equal(footer.leftExists,true,`${delivery}/${profile} Welcome footer left group exists`);
        assert.equal(footer.signatureViewBox,'0 0 1982 563',`${delivery}/${profile} exact Settings signature geometry reused`);
        assert.equal(footer.signatureHref,footer.settingsSignatureHref,`${delivery}/${profile} exact Settings signature asset URI reused`);
        assert.equal(footer.signatureFilter,footer.settingsSignatureFilter,`${delivery}/${profile} exact Settings signature material filter reused`);
        assert.equal(footer.overflow,false,`${delivery}/${profile} Welcome footer has no horizontal overflow`);
        if (width > 620) {
          assert.ok(Math.abs(footer.understood.y-footer.gear.y)<=1.5,`${delivery}/${profile} understood button vertically centered with gear`);
          assert.ok(Math.abs(footer.later.y-footer.gear.y)<=1.5,`${delivery}/${profile} later button vertically centered with gear`);
          assert.ok(Math.abs(parseFloat(footer.beforeTop)-5)<=0.5 && Math.abs(parseFloat(footer.beforeBottom)-5)<=0.5,`${delivery}/${profile} visible button plate centered inside hit target`);
          assert.equal(footer.labelTransform,'none',`${delivery}/${profile} button label no longer shifted vertically`);
        }

        await page.evaluate(() => {
          const card=window.aboutCard;
          card._closeAbout(false,false);
          card.shadowRoot.getElementById('settings-open').click();
          card.shadowRoot.getElementById('settings-about').click();
        });
        await page.waitForFunction(() => window.aboutCard._aboutDialog?.open);

        const focus = await page.evaluate(() => {
          const card=window.aboutCard,dialog=card._aboutDialog,close=dialog.querySelector('[data-about-close]');
          const ds=getComputedStyle(dialog),cs=getComputedStyle(close);
          return {
            touchTablet:dialog.classList.contains('about-touch-tablet'),
            activeIsDialog:card.shadowRoot.activeElement===dialog,
            activeIsClose:card.shadowRoot.activeElement===close,
            dialogOutlineStyle:ds.outlineStyle,
            dialogOutlineWidth:ds.outlineWidth,
            closeOutlineStyle:cs.outlineStyle,
            closeOutlineWidth:cs.outlineWidth,
            closeImage:new URL(close.querySelector('img').src).pathname,
            closeSize:[close.offsetWidth,close.offsetHeight],
          };
        });
        assert.deepEqual(focus.closeSize,[44,44],`${delivery}/${profile} accepted close hit target remains`);
        assert.match(focus.closeImage,/gewitterradar-about-close-premium\.webp$/);
        assert.equal(focus.touchTablet,expectTabletFix,`${delivery}/${profile} touch-tablet reopen classification`);
        if (expectTabletFix) {
          assert.equal(focus.activeIsDialog,true,`${delivery}/${profile} reopened About keeps dialog focus target`);
          assert.equal(focus.activeIsClose,false,`${delivery}/${profile} close button not focused`);
          assert.ok(focus.dialogOutlineStyle==='none' || parseFloat(focus.dialogOutlineWidth)===0,`${delivery}/${profile} no blue dialog focus outline`);
          assert.ok(focus.closeOutlineStyle==='none' || parseFloat(focus.closeOutlineWidth)===0,`${delivery}/${profile} no close focus outline`);
        } else {
          assert.equal(focus.activeIsClose,true,`${delivery}/${profile} existing non-tablet focus behavior preserved`);
        }

        await context.close();
        console.log(`${delivery}/${profile}: V4.06 UI-polish pass4 PASS`);
      }
    }
  } finally { await browser.close(); server.close(); }
})().catch((error)=>{console.error(error);server.close();process.exitCode=1;});

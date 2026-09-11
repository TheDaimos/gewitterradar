const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const root = path.resolve(__dirname, '..');
const welcomeGearPath = 'M27 7Q32 5 37 7L38 14L43 17L50 14Q55 18 57 23L52 28V36L57 41Q55 46 50 50L43 47L38 50L37 57Q32 59 27 57L26 50L21 47L14 50Q9 46 7 41L12 36V28L7 23Q9 18 14 14L21 17L26 14Z';
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

        const main = await page.evaluate(() => {
          const root=window.aboutCard.shadowRoot,button=root.getElementById('settings-open'),gear=button.querySelector('.gear-welcome');
          const path=gear?.querySelector('path');
          return {button:[button.offsetWidth,button.offsetHeight],gear:[gear?.getBoundingClientRect().width||0,gear?.getBoundingClientRect().height||0],path:path?.getAttribute('d')||'',oldGlyph:!!button.querySelector('.gear-glyph'),oldIpad:!!button.querySelector('.gear-ipad')};
        });
        assert.deepEqual(main.button,[40,40],`${delivery}/${profile} main settings hit geometry`);
        assert.ok(main.gear[0] >= 29 && main.gear[1] >= 29,`${delivery}/${profile} Welcome gear visible size`);
        assert.equal(main.path,welcomeGearPath,`${delivery}/${profile} exact Welcome gear geometry`);
        assert.equal(main.oldGlyph,false);assert.equal(main.oldIpad,false);

        const settings = await page.evaluate(() => {
          const card=window.aboutCard;card._closeAbout(false,false);card.shadowRoot.getElementById('settings-open').click();
          const dialog=card.shadowRoot.getElementById('settings-dialog'),s=getComputedStyle(dialog);
          return {border:s.borderTopWidth,background:s.backgroundImage,overflow:dialog.scrollWidth>dialog.clientWidth,after:getComputedStyle(dialog,'::after').content};
        });
        assert.ok(parseFloat(settings.border)>=2,`${delivery}/${profile} settings real metal frame width`);
        assert.match(settings.background,/linear-gradient\(/);
        assert.equal(settings.overflow,false);
        assert.ok(settings.after === 'none' || settings.after === 'normal',`${delivery}/${profile} no doubled settings frame`);

        await page.evaluate(() => window.aboutCard._openHelp());
        await page.waitForFunction(() => window.aboutCard._helpDialog?.querySelectorAll('.help-section-icon svg').length >= 7);
        const help = await page.evaluate(() => {
          const dialog=window.aboutCard._helpDialog,s=getComputedStyle(dialog);
          const functions=dialog.querySelector('[data-help-section="functions"] .help-section-icon svg');
          const metrics=[...dialog.querySelectorAll('.help-section-icon')].map((badge)=>{const svg=badge.querySelector('svg'),b=badge.getBoundingClientRect(),i=svg.getBoundingClientRect();return {key:badge.dataset.helpIcon,dx:Math.abs((b.left+b.width/2)-(i.left+i.width/2)),dy:Math.abs((b.top+b.height/2)-(i.top+i.height/2)),w:i.width,h:i.height};});
          const close=dialog.querySelector('.help-close img'),copy=dialog.querySelector('[data-help-section="recorder"] .help-copy img');
          return {border:s.borderTopWidth,background:s.backgroundImage,after:getComputedStyle(dialog,'::after').content,path:functions?.querySelector('path')?.getAttribute('d')||'',viewBox:functions?.getAttribute('viewBox')||'',metrics,close:close?new URL(close.src).pathname:'',copy:copy?new URL(copy.src).pathname:''};
        });
        assert.ok(parseFloat(help.border)>=2,`${delivery}/${profile} help real metal frame width`);
        assert.equal(help.path,welcomeGearPath,`${delivery}/${profile} Help exact Welcome gear geometry`);
        assert.equal(help.viewBox,'0 0 64 64');
        assert.ok(help.after === 'none' || help.after === 'normal',`${delivery}/${profile} no doubled Help frame`);
        for(const metric of help.metrics){assert.ok(metric.dx<=1.25 && metric.dy<=1.25,`${delivery}/${profile}/${metric.key} centered icon`);}
        const house=help.metrics.find((m)=>m.key==='prerequisites'),radii=help.metrics.find((m)=>m.key==='radii');
        assert.ok(house.w>radii.w,`${delivery}/${profile} prerequisites house remains deliberately larger`);
        assert.match(help.close,/gewitterradar-about-close-premium\.webp$/);
        assert.match(help.copy,/gewitterradar-about-copy-scroll\.webp$/);

        await context.close();
        console.log(`${delivery}/${profile}: V4.06 UI-polish pass2 PASS`);
      }
    }
  } finally { await browser.close(); server.close(); }
})().catch((error)=>{console.error(error);server.close();process.exitCode=1;});

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
      ['ipad-pro', 1366, 1024, true],
      ['android-portrait', 412, 915, true],
      ['android-landscape', 915, 412, true],
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

        const metrics = await page.evaluate(() => {
          const card = window.aboutCard;
          card._closeAbout(false, false);
          card.shadowRoot.getElementById('settings-open').click();

          const root = card.shadowRoot;
          const dialog = root.getElementById('settings-dialog');
          const links = [...root.querySelectorAll('.settings-premium-link')];
          const icons = [...root.querySelectorAll('.settings-premium-icon')];
          const current = () => root.querySelector('.settings-collapsible');
          const stateNode = current();

          // Linux Chrome for Testing 151 can keep a newly created CSS transition
          // pending at timeline time 0 while wall-clock setTimeout already elapsed.
          // This assertion protects the semantic closed/open endpoint styles, not
          // browser scheduler timing. Disable only this node's transition for the
          // two endpoint reads, then restore its previous inline state exactly.
          const previousTransition = stateNode.style.getPropertyValue('transition');
          const previousTransitionPriority = stateNode.style.getPropertyPriority('transition');
          stateNode.style.setProperty('transition', 'none', 'important');

          stateNode.open = false;
          const closedNode = current();
          const closed = getComputedStyle(closedNode).borderColor;
          const closedState = {
            attribute: closedNode.hasAttribute('open'),
            property: closedNode.open,
          };

          stateNode.open = true;
          const openedNode = current();
          const opened = getComputedStyle(openedNode).borderColor;
          const openedState = {
            attribute: openedNode.hasAttribute('open'),
            property: openedNode.open,
          };
          const selectorMatched = openedNode.matches('.settings-section[open]');

          if (previousTransition) {
            stateNode.style.setProperty(
              'transition',
              previousTransition,
              previousTransitionPriority,
            );
          } else {
            stateNode.style.removeProperty('transition');
          }

          const summary = openedNode.querySelector('summary');
          const after = getComputedStyle(summary, '::after');
          const signature = getComputedStyle(root.querySelector('.settings-signature'));
          const sections = [...root.querySelectorAll('.settings-collapsible')];

          return {
            dialogBorder: getComputedStyle(dialog).borderColor,
            dialogOverflow: dialog.scrollWidth > dialog.clientWidth,
            links: links.map((node) => [node.offsetWidth, node.offsetHeight]),
            iconResiduals: icons.map((node, index) => {
              const a = node.getBoundingClientRect();
              const b = links[index].getBoundingClientRect();
              return a.top + a.height / 2 - (b.top + b.height / 2);
            }),
            sections: sections.length,
            summaryHeight: summary.offsetHeight,
            chevron: [parseFloat(after.width), parseFloat(after.height), after.borderRightColor],
            closed,
            opened,
            closedState,
            openedState,
            sameNode: closedNode === openedNode,
            selectorMatched,
            signatureFilter: signature.filter,
          };
        });

        assert.notEqual(metrics.dialogBorder, 'rgba(0, 0, 0, 0)', `${delivery}/${profile} dialog border`);
        assert.equal(metrics.dialogOverflow, false, `${delivery}/${profile} settings overflow`);
        assert.ok(
          metrics.links.length === 2 && metrics.links.every(([, h]) => h >= 44),
          `${delivery}/${profile} premium links`,
        );
        assert.ok(
          metrics.iconResiduals.every((value) => Math.abs(value) <= 3),
          `${delivery}/${profile} icon alignment`,
        );
        assert.equal(metrics.sections, 5);
        assert.ok(metrics.summaryHeight >= 44);
        assert.deepEqual(metrics.chevron.slice(0, 2), [13, 13]);
        assert.notEqual(metrics.chevron[2], 'rgba(0, 0, 0, 0)');
        assert.deepEqual(metrics.closedState, { attribute: false, property: false });
        assert.deepEqual(metrics.openedState, { attribute: true, property: true });
        assert.equal(metrics.sameNode, true, `${delivery}/${profile} stable settings node`);
        assert.equal(metrics.selectorMatched, true, `${delivery}/${profile} open selector`);
        assert.notEqual(
          metrics.closed,
          metrics.opened,
          `${delivery}/${profile} open-state border ${JSON.stringify(metrics)}`,
        );
        assert.match(metrics.signatureFilter, /sepia|drop-shadow/);

        await page.evaluate(() => window.aboutCard._openHelp());
        await page.waitForFunction(() => window.aboutCard._helpDialog?.open);
        const help = await page.evaluate(() => {
          const dialog = window.aboutCard._helpDialog;
          const content = dialog.querySelector('.help-content');
          return {
            sections: dialog.querySelectorAll('.help-section').length,
            close: [
              dialog.querySelector('.help-close').offsetWidth,
              dialog.querySelector('.help-close').offsetHeight,
            ],
            overflow: dialog.scrollWidth > dialog.clientWidth || content.scrollWidth > content.clientWidth,
            bottom: dialog.getBoundingClientRect().bottom,
          };
        });
        assert.deepEqual(help.sections, 7);
        assert.deepEqual(help.close, [44, 44]);
        assert.equal(help.overflow, false);
        assert.ok(help.bottom <= height + 0.5, `${delivery}/${profile} Help viewport`);

        await context.close();
        console.log(`${delivery}/${profile}: V4.06 Settings and Help PASS`);
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

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

          const previousTransition = stateNode.style.getPropertyValue('transition');
          const previousTransitionPriority = stateNode.style.getPropertyPriority('transition');
          stateNode.style.setProperty('transition', 'none', 'important');

          stateNode.open = false;
          const closedNode = current();
          const closedState = {
            attribute: closedNode.hasAttribute('open'),
            property: closedNode.open,
          };

          stateNode.open = true;
          const openedNode = current();
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
          const rect = dialog.getBoundingClientRect();

          return {
            dialogVisible: rect.width > 0 && rect.height > 0 && getComputedStyle(dialog).display !== 'none',
            dialogOverflow: dialog.scrollWidth > dialog.clientWidth,
            links: links.map((node) => [node.offsetWidth, node.offsetHeight]),
            iconResiduals: icons.map((node, index) => {
              const a = node.getBoundingClientRect();
              const b = links[index].getBoundingClientRect();
              return a.top + a.height / 2 - (b.top + b.height / 2);
            }),
            sections: sections.length,
            moduleSection: !!root.querySelector('#settings-modules-section'),
            summaryHeight: summary.offsetHeight,
            chevron: [parseFloat(after.width), parseFloat(after.height), after.borderRightColor],
            closedState,
            openedState,
            sameNode: closedNode === openedNode,
            selectorMatched,
            signatureFilter: signature.filter,
          };
        });

        assert.equal(metrics.dialogVisible, true, `${delivery}/${profile} settings dialog visible`);
        assert.equal(metrics.dialogOverflow, false, `${delivery}/${profile} settings horizontal overflow`);
        assert.ok(
          metrics.links.length === 2 && metrics.links.every(([, h]) => h >= 44),
          `${delivery}/${profile} premium links`,
        );
        assert.ok(
          metrics.iconResiduals.every((value) => Math.abs(value) <= 3),
          `${delivery}/${profile} icon alignment`,
        );
        assert.equal(metrics.sections, 7, `${delivery}/${profile} settings sections including Module & Versionen`);
        assert.equal(metrics.moduleSection, true, `${delivery}/${profile} Module & Versionen section`);
        assert.ok(metrics.summaryHeight >= 44, `${delivery}/${profile} summary touch target`);
        assert.deepEqual(metrics.chevron.slice(0, 2), [13, 13]);
        assert.notEqual(metrics.chevron[2], 'rgba(0, 0, 0, 0)');
        assert.deepEqual(metrics.closedState, { attribute: false, property: false });
        assert.deepEqual(metrics.openedState, { attribute: true, property: true });
        assert.equal(metrics.sameNode, true, `${delivery}/${profile} stable settings node`);
        assert.equal(metrics.selectorMatched, true, `${delivery}/${profile} open selector`);
        assert.match(metrics.signatureFilter, /sepia|drop-shadow/);

        const moduleOverlay = await page.evaluate(() => {
          const card = window.aboutCard;
          const root = card.shadowRoot;
          const section = root.getElementById('settings-modules-section');
          section.open = true;
          root.getElementById('settings-modules-details').click();
          const backdrop = root.getElementById('settings-modules-backdrop');
          const dialog = backdrop.querySelector('.gr-module-dialog');
          const head = backdrop.querySelector('.gr-module-head');
          const rect = dialog.getBoundingClientRect();
          return {
            open: backdrop.classList.contains('open'),
            directShadowChild: backdrop.parentNode === root,
            width: rect.width,
            overflow: dialog.scrollWidth > dialog.clientWidth,
            dialogBackground: getComputedStyle(dialog).backgroundImage,
            headBackground: getComputedStyle(head).backgroundImage,
          };
        });
        assert.equal(moduleOverlay.open, true, `${delivery}/${profile} module details open`);
        assert.equal(moduleOverlay.directShadowChild, true, `${delivery}/${profile} module overlay isolated from settings dialog`);
        assert.ok(moduleOverlay.width <= 780.5, `${delivery}/${profile} module details width`);
        assert.equal(moduleOverlay.overflow, false, `${delivery}/${profile} module details horizontal overflow`);
        assert.match(moduleOverlay.dialogBackground, /rgb\(20, 28, 38\)|rgb\(7, 12, 18\)/);
        assert.match(moduleOverlay.headBackground, /rgb\(17, 23, 32\)|rgb\(14, 20, 28\)/);
        await page.evaluate(() => window.aboutCard._closeModuleDetails());

        if (['ipad', 'ipad-pro', 'android-portrait'].includes(profile)) {
          const settingsScroll = await page.evaluate(async () => {
            const root = window.aboutCard.shadowRoot;
            const body = root.querySelector('.settings-body');
            const collapseAll = () => {
              for (const section of root.querySelectorAll('.settings-collapsible')) section.open = false;
              body.scrollTop = 0;
            };
            const reveal = async (sectionId, targetSelector) => {
              collapseAll();
              const dialog = root.getElementById('settings-dialog');
              const previousHeight = dialog.style.height;
              const previousMaxHeight = dialog.style.maxHeight;
              dialog.style.height = '320px';
              dialog.style.maxHeight = '320px';
              const section = root.getElementById(sectionId);
              section.open = true;
              await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
              const content = section.querySelector('.settings-section-content');
              const target = section.querySelector(targetSelector);
              body.scrollTop = Math.max(0, body.scrollHeight - body.clientHeight);
              await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
              const probeScrollTop = body.scrollTop;
              target.scrollIntoView({ block: 'center', inline: 'nearest' });
              await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
              const bodyRect = body.getBoundingClientRect();
              const targetRect = target.getBoundingClientRect();
              const bodyStyle = getComputedStyle(body);
              const dialogStyle = getComputedStyle(dialog);
              const state = {
                bodyOverflowY: bodyStyle.overflowY,
                contentOverflowY: getComputedStyle(content).overflowY,
                bodyScrollable: body.scrollHeight > body.clientHeight + 1,
                bodyClientHeight: body.clientHeight,
                bodyScrollHeight: body.scrollHeight,
                bodyFlex: bodyStyle.flex,
                bodyMinHeight: bodyStyle.minHeight,
                dialogClientHeight: dialog.clientHeight,
                dialogScrollHeight: dialog.scrollHeight,
                dialogHeight: dialogStyle.height,
                dialogMaxHeight: dialogStyle.maxHeight,
                probeScrollTop,
                scrollTop: body.scrollTop,
                visible:
                  targetRect.top >= bodyRect.top - 1 &&
                  targetRect.bottom <= bodyRect.bottom + 1,
              };
              dialog.style.height = previousHeight;
              dialog.style.maxHeight = previousMaxHeight;
              return state;
            };

            const radii = await reveal('#settings-radii-section'.slice(1), '.settings-radius.danger');
            const diagnostic = await reveal(
              '#settings-diagnostic-section'.slice(1),
              '.settings-test-grid',
            );

            collapseAll();
            const mapSection = root.getElementById('settings-map-section');
            mapSection.open = true;
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            const selector = root.getElementById('settings-cluster-jump-selector');
            const sectionRect = mapSection.getBoundingClientRect();
            const selectorRect = selector.getBoundingClientRect();
            const mapContent = mapSection.querySelector('.settings-section-content');
            return {
              radii,
              diagnostic,
              mapRightGap: sectionRect.right - selectorRect.right,
              mapPaddingTop: parseFloat(getComputedStyle(mapContent).paddingTop),
              mapPaddingBottom: parseFloat(getComputedStyle(mapContent).paddingBottom),
            };
          });

          for (const [name, state] of [
            ['radii', settingsScroll.radii],
            ['diagnostic', settingsScroll.diagnostic],
          ]) {
            assert.equal(state.bodyOverflowY, 'auto', `${delivery}/${profile} ${name} outer settings scroller`);
            assert.ok(
              ['visible', 'clip'].includes(state.contentOverflowY),
              `${delivery}/${profile} ${name} no nested vertical scroller`,
            );
            assert.equal(
              state.bodyScrollable,
              true,
              `${delivery}/${profile} ${name} settings body scrollable :: ${JSON.stringify(state)}`,
            );
            assert.ok(
              state.probeScrollTop > 0,
              `${delivery}/${profile} ${name} settings body can move :: ${JSON.stringify(state)}`,
            );
            assert.equal(
              state.visible,
              true,
              `${delivery}/${profile} ${name} final control reachable :: ${JSON.stringify(state)}`,
            );
          }
          assert.ok(settingsScroll.mapRightGap >= 12, `${delivery}/${profile} map cluster navigation frame clearance`);
          assert.ok(settingsScroll.mapPaddingTop >= 3, `${delivery}/${profile} map section top breathing room`);
          assert.ok(settingsScroll.mapPaddingBottom >= 4, `${delivery}/${profile} map section bottom breathing room`);
        }

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
        assert.equal(help.sections, 9, `${delivery}/${profile} accepted Help sections`);
        assert.deepEqual(help.close, [44, 44]);
        assert.equal(help.overflow, false);
        assert.ok(help.bottom <= height + 0.5, `${delivery}/${profile} Help viewport`);

        await context.close();
        console.log(`${delivery}/${profile}: V4.07.56 Settings and Help PASS`);
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

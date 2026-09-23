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

        const startupDropdownLifecycle = await page.evaluate(async () => {
          const card = window.aboutCard;
          const root = card.shadowRoot;
          const waitFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          const settingsBackdrop = root.getElementById('settings-backdrop');
          const mapSection = root.getElementById('settings-map-section');
          const startupButton = root.getElementById('settings-map-startup-button');
          const startupDropdown = root.getElementById('settings-map-startup-dropdown');

          if (!settingsBackdrop.classList.contains('open')) root.getElementById('settings-open').click();
          for (const section of root.querySelectorAll('.settings-collapsible')) section.open = false;
          mapSection.open = true;
          await waitFrame();

          startupButton.click();
          await waitFrame();
          const openedBeforeBackdrop = startupDropdown.classList.contains('open')
            && startupButton.getAttribute('aria-expanded') === 'true';

          settingsBackdrop.click();
          await waitFrame();
          const backdropClosedSettings = !settingsBackdrop.classList.contains('open');
          const backdropClosedDropdown = !startupDropdown.classList.contains('open')
            && startupButton.getAttribute('aria-expanded') === 'false';

          root.getElementById('settings-open').click();
          mapSection.open = true;
          await waitFrame();
          startupButton.click();
          await waitFrame();
          const reopenedBeforeAccordion = startupDropdown.classList.contains('open');
          root.getElementById('settings-radii-section').open = true;
          await waitFrame();
          const accordionClosedDropdown = !startupDropdown.classList.contains('open')
            && startupButton.getAttribute('aria-expanded') === 'false';

          return {
            openedBeforeBackdrop,
            backdropClosedSettings,
            backdropClosedDropdown,
            reopenedBeforeAccordion,
            accordionClosedDropdown,
          };
        });
        assert.equal(startupDropdownLifecycle.openedBeforeBackdrop,true,`${delivery}/${profile} startup dropdown opens`);
        assert.equal(startupDropdownLifecycle.backdropClosedSettings,true,`${delivery}/${profile} settings backdrop closes settings`);
        assert.equal(startupDropdownLifecycle.backdropClosedDropdown,true,`${delivery}/${profile} settings backdrop closes startup dropdown`);
        assert.equal(startupDropdownLifecycle.reopenedBeforeAccordion,true,`${delivery}/${profile} startup dropdown reopens`);
        assert.equal(startupDropdownLifecycle.accordionClosedDropdown,true,`${delivery}/${profile} accordion switch closes startup dropdown`);

        const moduleOverlay = await page.evaluate(async () => {
          const card = window.aboutCard;
          const root = card.shadowRoot;
          const section = root.getElementById('settings-modules-section');
          section.open = true;
          root.getElementById('settings-modules-details').click();
          const backdrop = root.getElementById('settings-modules-backdrop');
          const dialog = backdrop.querySelector('.gr-module-dialog');
          const head = backdrop.querySelector('.gr-module-head');
          const waitFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          const row = () => backdrop.querySelector('.gr-mod-row');
          const clickRow = async () => {
            row()?.querySelector('summary')?.click();
            await waitFrame();
            return !!row()?.open;
          };
          const rowOpenFirst = await clickRow();
          const rowClosedSecond = !(await clickRow());
          const rowOpenThird = await clickRow();
          const stableRow = row();
          const backgroundCycles = [];
          for (let index = 0; index < 10; index += 1) {
            stableRow?.querySelector('summary')?.click();
            await waitFrame();
            card._syncModuleView();
            card._applyStaticTranslations();
            await waitFrame();
            const current = row();
            backgroundCycles.push({
              sameNode: current === stableRow,
              open: !!current?.open,
              expectedOpen: index % 2 === 1,
            });
          }
          const rect = dialog.getBoundingClientRect();
          return {
            open: backdrop.classList.contains('open'),
            directShadowChild: backdrop.parentNode === root,
            width: rect.width,
            height: rect.height,
            overflow: dialog.scrollWidth > dialog.clientWidth,
            dialogBackground: getComputedStyle(dialog).backgroundImage,
            headBackground: getComputedStyle(head).backgroundImage,
            rowOpenFirst,
            rowClosedSecond,
            rowOpenThird,
            backgroundCycles,
          };
        });
        assert.equal(moduleOverlay.open, true, `${delivery}/${profile} module details open`);
        assert.equal(moduleOverlay.directShadowChild, true, `${delivery}/${profile} module overlay isolated from settings dialog`);
        assert.ok(moduleOverlay.width <= 660.5, `${delivery}/${profile} module details width`);
        if (['android-portrait','android-landscape'].includes(profile)) {
          assert.ok(
            moduleOverlay.height <= height - 13,
            `${delivery}/${profile} module details mobile viewport height`,
          );
        } else {
          assert.ok(moduleOverlay.height <= 760.5, `${delivery}/${profile} module details height`);
        }
        assert.equal(moduleOverlay.overflow, false, `${delivery}/${profile} module details horizontal overflow`);
        assert.equal(moduleOverlay.rowOpenFirst, true, `${delivery}/${profile} module row opens`);
        assert.equal(moduleOverlay.rowClosedSecond, true, `${delivery}/${profile} module row closes again`);
        assert.equal(moduleOverlay.rowOpenThird, true, `${delivery}/${profile} module row reopens repeatedly`);
        assert.equal(moduleOverlay.backgroundCycles.length,10,`${delivery}/${profile} module background stress cycles`);
        assert.equal(moduleOverlay.backgroundCycles.every((entry) => entry.sameNode),true,`${delivery}/${profile} module row survives background sync without rebuild`);
        assert.equal(moduleOverlay.backgroundCycles.every((entry) => entry.open === entry.expectedOpen),true,`${delivery}/${profile} module row toggles reliably during background sync`);
        assert.match(moduleOverlay.dialogBackground, /rgb\(20, 28, 38\)|rgb\(7, 12, 18\)/);
        assert.match(moduleOverlay.headBackground, /rgb\(17, 23, 32\)|rgb\(14, 20, 28\)/);
        await page.evaluate(() => window.aboutCard._closeModuleDetails());

        const modularSettings = await page.evaluate(async () => {
          const card = window.aboutCard;
          const root = card.shadowRoot;
          const languages = ['Deutsch','English','Dansk','Español','Français','Nederlands','Polski','Português','Svenska','Italiano','Norsk bokmål','Suomi','Čeština','Ελληνικά','Magyar','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
          const keys = [
            'settings.cluster_resolution',
            'settings.cluster_resolution_note',
            'settings.cluster_navigation_session',
            'settings.cluster_navigation_range',
            'settings.cluster_navigation_infinite',
            'settings.cluster_resolution_select','settings.cluster_navigation_session_aria','settings.cluster_navigation_seconds_aria',
            'settings.cluster_navigation_infinite_aria','settings.cluster_navigation_to_session','settings.cluster_navigation_to_infinite',
            'settings.map_display','settings.map_startup','settings.map_startup_note','settings.map_startup_last','settings.map_startup_select',
            'settings.map_display_sub','settings.map_window','settings.map_window_note','settings.map_window_open','settings.map_window_open_aria',
            'app.release_history','app.release_history_open','map.medallion_move','compass.picker_title','compass.picker_change',
            'compass.fixed_compass_title',
            'modules.title','modules.subtitle','modules.details','modules.copy','modules.download'
          ];
          const translations = [];
          for (const language of languages) {
            card._languagePreview = language;
            card._applyStaticTranslations();
            card._render();
            card._syncModuleView();
            await new Promise((resolve) => requestAnimationFrame(resolve));
            const resolutionRow = root.getElementById('settings-cluster-resolution-button')?.closest('.settings-row');
            const navigationRow = root.getElementById('settings-cluster-jump-selector')?.closest('.settings-row');
            const localizedModuleRows = [...root.querySelectorAll('#settings-modules-list .gr-mod-row')].map((item) => ({
              id:item.dataset.moduleId || '',
              name:item.querySelector('.gr-mod-name')?.textContent?.trim() || '',
              functions:item.querySelector('.gr-mod-detail dd:last-child')?.textContent?.trim() || '',
            }));
            const moduleSummaryParts = [...root.getElementById('settings-modules-dialog-summary')?.children || []].map((item) => item.textContent?.trim() || '');
            translations.push({
              language,
              values:Object.fromEntries(keys.map((key) => [key,card._t(key)])),
              resolutionTitle:resolutionRow?.querySelector('.settings-row-label > div:first-child')?.textContent?.trim() || '',
              navigationTitle:navigationRow?.querySelector('.settings-row-label > div:first-child')?.textContent?.trim() || '',
              moduleTitle:root.getElementById('settings-modules-title')?.textContent?.trim() || '',
              mapTitle:root.getElementById('settings-map-section-title')?.textContent?.trim() || '',
              mapSubtitle:root.getElementById('settings-map-section-sub')?.textContent?.trim() || '',
              mapStartupLabel:root.getElementById('settings-map-startup-label')?.textContent?.trim() || '',
              mapStartupNote:root.getElementById('settings-map-startup-note')?.textContent?.trim() || '',
              mapWindowLabel:root.getElementById('settings-map-window-label')?.textContent?.trim() || '',
              mapWindowNote:root.getElementById('settings-map-window-note')?.textContent?.trim() || '',
              mapWindowOpen:root.getElementById('settings-map-window-open')?.textContent?.trim() || '',
              currentProfile:root.getElementById('settings-cluster-resolution-current')?.textContent?.trim() || '',
              tooltipVersionTitle:root.getElementById('app-version-badge')?.getAttribute('title') || '',
              tooltipVersionAria:root.getElementById('app-version-badge')?.getAttribute('aria-label') || '',
              tooltipClusterTitle:root.getElementById('settings-cluster-resolution-button')?.getAttribute('title') || '',
              tooltipClusterAria:root.getElementById('settings-cluster-resolution-button')?.getAttribute('aria-label') || '',
              tooltipClusterSessionAria:root.getElementById('settings-cluster-jump-selector')?.getAttribute('aria-label') || '',
              tooltipClusterSecondsAria:root.getElementById('settings-cluster-jump-seconds')?.getAttribute('aria-label') || '',
              tooltipClusterInfiniteAria:root.getElementById('settings-cluster-jump-infinite')?.getAttribute('aria-label') || '',
              tooltipClusterInfiniteTitle:root.getElementById('settings-cluster-jump-infinite')?.getAttribute('title') || '',
              tooltipMapStartupDropdown:root.getElementById('settings-map-startup-dropdown')?.getAttribute('aria-label') || '',
              tooltipMapWindowOpen:root.getElementById('settings-map-window-open')?.getAttribute('title') || '',
              tooltipMedallionMove:root.getElementById('map-medallion-overlay')?.getAttribute('title') || '',
              tooltipDevice:root.getElementById('device-toggle')?.getAttribute('title') || '',
              localizedModuleRows,
              moduleSummaryParts,
            });
          }
          card._languagePreview = '';
          card._applyStaticTranslations();
          card._syncModuleView();

          const waitFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          const diagnostic = root.getElementById('settings-diagnostic-section');
          const modules = root.getElementById('settings-modules-section');
          const map = root.getElementById('settings-map-section');
          for (const section of root.querySelectorAll('.settings-collapsible')) section.open = false;
          diagnostic.open = true;
          await waitFrame();
          modules.open = true;
          await waitFrame();
          const diagnosticClosedByModules = !diagnostic.open && modules.open;
          map.open = true;
          await waitFrame();
          const modulesClosedByMap = !modules.open && map.open;
          const chevron = getComputedStyle(map.querySelector(':scope > .settings-section-head'),'::after');

          return {
            translations,
            diagnosticClosedByModules,
            modulesClosedByMap,
            chevronDuration:chevron.transitionDuration,
            chevronTiming:chevron.transitionTimingFunction,
          };
        });
        const englishSettings = modularSettings.translations.find((row) => row.language === 'English')?.values || {};
        const mapLocaleKeys = [
          'settings.map_display','settings.map_startup','settings.map_startup_note','settings.map_startup_last','settings.map_startup_select',
          'settings.map_display_sub','settings.map_window','settings.map_window_note','settings.map_window_open','settings.map_window_open_aria'
        ];
        const tooltipLocaleKeys = [
          'settings.cluster_resolution_select','settings.cluster_navigation_session_aria','settings.cluster_navigation_seconds_aria',
          'settings.cluster_navigation_infinite_aria','settings.cluster_navigation_to_session','settings.cluster_navigation_to_infinite',
          'app.release_history','app.release_history_open','map.medallion_move','compass.picker_title','compass.picker_change'
        ];
        for (const row of modularSettings.translations) {
          for (const [key,value] of Object.entries(row.values)) {
            assert.ok(value && value !== key, delivery+'/'+profile+' '+row.language+' '+key+' translated');
          }
          if (row.language !== 'English') {
            for (const key of [...mapLocaleKeys,...tooltipLocaleKeys]) {
              assert.notEqual(row.values[key], englishSettings[key], delivery+'/'+profile+' '+row.language+' '+key+' must not fall back to English');
            }
          }
          assert.equal(row.resolutionTitle,row.values['settings.cluster_resolution'],delivery+'/'+profile+' '+row.language+' cluster resolution title');
          assert.equal(row.navigationTitle,row.values['settings.cluster_navigation_session'],delivery+'/'+profile+' '+row.language+' cluster navigation title');
          assert.equal(row.moduleTitle,row.values['modules.title'],delivery+'/'+profile+' '+row.language+' modules title');
          assert.equal(row.mapTitle,row.values['settings.map_display'],delivery+'/'+profile+' '+row.language+' map display title');
          assert.equal(row.mapSubtitle,row.values['settings.map_display_sub'],delivery+'/'+profile+' '+row.language+' map display subtitle');
          assert.equal(row.mapStartupLabel,row.values['settings.map_startup'],delivery+'/'+profile+' '+row.language+' map startup label');
          assert.equal(row.mapStartupNote,row.values['settings.map_startup_note'],delivery+'/'+profile+' '+row.language+' map startup note');
          assert.equal(row.mapWindowLabel,row.values['settings.map_window'],delivery+'/'+profile+' '+row.language+' map window label');
          assert.equal(row.mapWindowNote,row.values['settings.map_window_note'],delivery+'/'+profile+' '+row.language+' map window note');
          assert.equal(row.mapWindowOpen,row.values['settings.map_window_open'],delivery+'/'+profile+' '+row.language+' map window button');
          assert.ok(row.currentProfile,delivery+'/'+profile+' '+row.language+' cluster profile label');
          assert.equal(row.tooltipVersionTitle,row.values['app.release_history'],delivery+'/'+profile+' '+row.language+' version hover title');
          assert.equal(row.tooltipVersionAria,row.values['app.release_history_open'],delivery+'/'+profile+' '+row.language+' version aria label');
          assert.equal(row.tooltipClusterAria,row.values['settings.cluster_resolution_select'],delivery+'/'+profile+' '+row.language+' cluster selector aria');
          assert.equal(row.tooltipClusterTitle,`${row.values['settings.cluster_resolution']} · ${row.currentProfile}`,delivery+'/'+profile+' '+row.language+' cluster selector hover title');
          assert.equal(row.tooltipClusterSessionAria,row.values['settings.cluster_navigation_session_aria'],delivery+'/'+profile+' '+row.language+' cluster session aria');
          assert.equal(row.tooltipClusterSecondsAria,row.values['settings.cluster_navigation_seconds_aria'],delivery+'/'+profile+' '+row.language+' cluster seconds aria');
          assert.equal(row.tooltipClusterInfiniteAria,row.values['settings.cluster_navigation_infinite_aria'],delivery+'/'+profile+' '+row.language+' cluster infinite aria');
          assert.equal(row.tooltipClusterInfiniteTitle,row.values['settings.cluster_navigation_infinite'],delivery+'/'+profile+' '+row.language+' cluster infinite hover title');
          assert.equal(row.tooltipMapStartupDropdown,row.values['settings.map_startup_select'],delivery+'/'+profile+' '+row.language+' startup dropdown aria');
          assert.equal(row.tooltipMapWindowOpen,row.values['settings.map_window_open_aria'],delivery+'/'+profile+' '+row.language+' map-window hover title');
          assert.equal(row.tooltipMedallionMove,row.values['map.medallion_move'],delivery+'/'+profile+' '+row.language+' medallion hover title');
          assert.equal(row.tooltipDevice,row.values['compass.fixed_compass_title'],delivery+'/'+profile+' '+row.language+' device compass hover title');
          assert.equal(row.localizedModuleRows.length,22,delivery+'/'+profile+' '+row.language+' all module rows localized');
          assert.equal(new Set(row.localizedModuleRows.map((entry) => entry.id)).size,22,delivery+'/'+profile+' '+row.language+' unique localized module ids');
          assert.equal(row.localizedModuleRows.every((entry) => entry.name && entry.functions),true,delivery+'/'+profile+' '+row.language+' module names and functions populated');
          assert.equal(row.moduleSummaryParts.length,3,delivery+'/'+profile+' '+row.language+' module summary segments');
          assert.ok(row.moduleSummaryParts[1]?.startsWith('· '),delivery+'/'+profile+' '+row.language+' module summary count separator');
          assert.ok(row.moduleSummaryParts[2]?.startsWith('· '),delivery+'/'+profile+' '+row.language+' module summary state separator');
          if (row.language === 'Ελληνικά') {
            const greek = /[\u0370-\u03ff\u1f00-\u1fff]/u;
            assert.equal(row.localizedModuleRows.every((entry) => greek.test(entry.name)),true,delivery+'/'+profile+' Greek module names fully localized');
            assert.equal(row.localizedModuleRows.every((entry) => greek.test(entry.functions)),true,delivery+'/'+profile+' Greek module functions fully localized');
            const greekText = row.localizedModuleRows.map((entry) => entry.name+' '+entry.functions).join(' | ');
            for (const forbidden of ['Diagnose & Kalibrierung','Module & Versionen','Kompass-Skala','Virtuelles Gewitter','Geladene Module','Soll/Ist-Vergleich','Bewegungsprofil','Trendberechnung']) {
              assert.equal(greekText.includes(forbidden),false,delivery+'/'+profile+' Greek module view contains no German metadata: '+forbidden);
            }
          }
        }
        assert.equal(modularSettings.diagnosticClosedByModules,true,delivery+'/'+profile+' modules participates in accordion');
        assert.equal(modularSettings.modulesClosedByMap,true,delivery+'/'+profile+' existing accordion section closes modules');
        assert.match(modularSettings.chevronDuration,/0\.42s/,delivery+'/'+profile+' settings chevron release-history duration');
        assert.match(modularSettings.chevronTiming,/cubic-bezier\(0\.22, 1, 0\.36, 1\)/,delivery+'/'+profile+' settings chevron release-history easing');

        if (['ipad','ipad-pro'].includes(profile)) {
          const medallionHeader = await page.evaluate(async () => {
            const root = window.aboutCard.shadowRoot;
            const backdrop = root.getElementById('medallion-calibration-modal-backdrop');
            const modal = backdrop.querySelector('.medallion-calibration-modal');
            const head = modal.querySelector('.compass-calibration-modal-head');
            backdrop.classList.add('open');
            backdrop.setAttribute('aria-hidden','false');
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            const modalRect = modal.getBoundingClientRect();
            const buttons = [...head.querySelectorAll('button')].map((button) => {
              const rect = button.getBoundingClientRect();
              return {left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width};
            });
            const result = {
              width:modalRect.width,
              horizontalOverflow:modal.scrollWidth > modal.clientWidth,
              headerOverflow:head.scrollWidth > head.clientWidth,
              buttonsInside:buttons.every((rect) => rect.left >= modalRect.left - 1 && rect.right <= modalRect.right + 1),
              buttons,
            };
            backdrop.classList.remove('open');
            backdrop.setAttribute('aria-hidden','true');
            return result;
          });
          assert.ok(medallionHeader.width > 430 && medallionHeader.width <= 560.5,delivery+'/'+profile+' medallion diagnostic responsive width');
          assert.equal(medallionHeader.horizontalOverflow,false,delivery+'/'+profile+' medallion diagnostic no horizontal overflow');
          assert.equal(medallionHeader.headerOverflow,false,delivery+'/'+profile+' medallion header no overflow');
          assert.equal(medallionHeader.buttonsInside,true,delivery+'/'+profile+' medallion top buttons fully visible');
        }

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
          assert.ok(settingsScroll.mapRightGap >= 16, `${delivery}/${profile} map cluster navigation frame clearance`);
          assert.ok(settingsScroll.mapPaddingTop >= 6, `${delivery}/${profile} map section top breathing room`);
          assert.ok(settingsScroll.mapPaddingBottom >= 8, `${delivery}/${profile} map section bottom breathing room`);
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

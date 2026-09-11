// Final release metadata/history layer for Gewitterradar V4.06.
// This pass is intentionally isolated after the accepted V4.06 visual passes.
// It changes only release/date labels and the Release History content.

function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.06 release-history anchor changed (${label})`);
  }
  return source.replace(from, to);
}

export function v406ReleaseHistoryDelta(source) {
  let result = source;

  const buildAnchor = `  const GEWITTERRADAR_BUILD = 'V4.06-2026-09-10';\n`;
  const buildReplacement = buildAnchor + String.raw`  const BUILD_YYYY_MM = (() => {
    const match = GEWITTERRADAR_BUILD.match(/(\d{4})-(\d{2})-(\d{2})$/);
    return match ? match[1] + '/' + match[2] : '0000/00';
  })();
`;
  result = once(result, buildAnchor, buildReplacement, 'build-yyyy-mm');

  result = once(
    result,
    '<span class="about-dev">V4.06 · Visual V2 · Gewitterradar · by CK</span>',
    '<span class="about-dev">${BUILD_YYYY_MM} · V${CARD_VERSION} · Gewitterradar · by CK</span>',
    'welcome-footer-date-version',
  );

  result = once(
    result,
    '<div class="settings-footer-version" title="Kartenversion">V${CARD_VERSION}</div>',
    '<div class="settings-footer-version" title="Kartenversion">${BUILD_YYYY_MM} · V${CARD_VERSION}</div>',
    'settings-footer-date-version',
  );

  result = once(
    result,
    '<span class="release-history-current">V${CARD_VERSION}</span>',
    '<span class="release-history-current">${BUILD_YYYY_MM} · V${CARD_VERSION}</span>',
    'release-history-current-date-version',
  );

  const historyBodyAnchor = String.raw`            <div class="release-history-body">
              <article class="release-history-entry">
                <div class="release-history-version">V4.04</div>
                <h3>HACS package staging</h3>
                <p>HACS now places the required Home Assistant helper package next to the installed card as app_gewitterradar_pkg.yaml. Users still copy or move that file manually to /config/packages/ because a HACS Dashboard repository cannot write outside its own www/community directory. Application logic and helper behavior remain unchanged.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V4.03</div>
                <h3>HACS release asset priority fix</h3>
                <p>Removed custom GitHub release assets from the HACS release so HACS falls through to the tagged dist tree and installs the card together with the complete assets directory. Application logic and helper behavior remain unchanged.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V4.02</div>
                <h3>HACS packaging fix</h3>
                <p>Corrected the HACS distribution so the card and all four external PNG assets are installed together. Card behavior, helper IDs, layouts and lightning-processing logic remain unchanged.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V4.01</div>
                <h3>Asset optimization</h3>
                <p>Conservatively right-sized and losslessly encoded the four external PNG assets for their actual interface render limits, retained generous HiDPI reserves, reduced the combined asset payload by about 61%, and refreshed asset cache keys without changing app behavior.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V4.00</div>
                <h3>First stable release</h3>
                <p>First stable Gewitterradar release, consolidating live lightning visualization, three-zone storm assessment, responsive cross-device operation, 19 language variants, metric and imperial units, compass navigation, and 120-minute activity history into a hardened Home Assistant card.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V3.997</div>
                <h3>Interface & usability refinement</h3>
                <p>Improved mobile layouts, responsive settings, radius controls, metric and imperial distance support, near-strike distance formatting, and direct radius editing from the map.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V3.996</div>
                <h3>Release hardening</h3>
                <p>Removed obsolete diagnostic code while preserving iPad/WebKit safeguards, stable recent-activity updates, custom dropdown controls, and other regression-critical compatibility paths.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V3.994</div>
                <h3>Stability, navigation & internationalization</h3>
                <p>Stabilized cluster identity and browsing during live updates and zooming, refined individual-strike focus and compass behavior, added live data-source status, and expanded the interface to 19 language variants.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V3.993</div>
                <h3>Pre-release feature consolidation</h3>
                <p>Consolidated the three-radius model, aura and warning controls, 120-minute activity history, compass modes, reference-location selection, filtering, clustering, and responsive device layouts.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V3.98</div>
                <h3>Core interface evolution</h3>
                <p>Established the mature Gewitterradar interface with live strike visualization, radius-based classification, recent activity, KPI panels, filters, clustering, and mobile/tablet adaptations.</p>
              </article>
            </div>`;

  const historyBodyReplacement = String.raw`            <div class="release-history-body">
              <article class="release-history-entry">
                <div class="release-history-version">V4.07 · PLANNED</div>
                <h3>Worldwide location search</h3>
                <p>Planned for the next development cycle: worldwide place search so a selected location can be used as the Gewitterradar reference point. Scope and implementation remain subject to the V4.07 design and validation phase.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V4.06 · 2026/09</div>
                <h3>Unified product, help & premium refinement</h3>
                <p>Unified the native integration and Dashboard delivery around one deterministic frontend, expanded About and Help to 15 languages plus 4 German dialect variants, added Recorder multi-device wildcard guidance and strengthened cross-device premium polish with real Android, iPad and iPad Pro acceptance.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V4.05 · 2026/09</div>
                <h3>Premium About Gewitterradar experience</h3>
                <p>Introduced the premium About Gewitterradar first-start onboarding and information experience, including the personal “Für Alkje” dedication and a Settings entry to reopen it, while preserving the proven lightning, radius, Recent/history and Home Assistant package behavior from V4.04.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V4.04 · 2026/09</div>
                <h3>HACS package staging</h3>
                <p>HACS now places the required Home Assistant helper package next to the installed card as app_gewitterradar_pkg.yaml. Users still copy or move that file manually to /config/packages/ because a HACS Dashboard repository cannot write outside its own www/community directory. Application logic and helper behavior remain unchanged.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V4.03 · 2026/09</div>
                <h3>HACS release asset priority fix</h3>
                <p>Removed custom GitHub release assets from the HACS release so HACS falls through to the tagged dist tree and installs the card together with the complete assets directory. Application logic and helper behavior remain unchanged.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V4.02 · 2026/09</div>
                <h3>HACS packaging fix</h3>
                <p>Corrected the HACS distribution so the card and all four external PNG assets are installed together. Card behavior, helper IDs, layouts and lightning-processing logic remain unchanged.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V4.01 · 2026/09</div>
                <h3>Asset optimization</h3>
                <p>Conservatively right-sized and losslessly encoded the four external PNG assets for their actual interface render limits, retained generous HiDPI reserves, reduced the combined asset payload by about 61%, and refreshed asset cache keys without changing app behavior.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V4.00 · 2026/09</div>
                <h3>First stable release</h3>
                <p>First stable Gewitterradar release, consolidating live lightning visualization, three-zone storm assessment, responsive cross-device operation, 15 languages plus 4 German dialect variants, metric and imperial units, compass navigation, and 120-minute activity history into a hardened Home Assistant card.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V3.997 · 2026/08</div>
                <h3>Interface & usability refinement</h3>
                <p>Improved mobile layouts, responsive settings, radius controls, metric and imperial distance support, near-strike distance formatting, and direct radius editing from the map.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V3.996 · 2026/08</div>
                <h3>Release hardening</h3>
                <p>Removed obsolete diagnostic code while preserving iPad/WebKit safeguards, stable recent-activity updates, custom dropdown controls, and other regression-critical compatibility paths.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V3.994 · 2026/08</div>
                <h3>Stability, navigation & internationalization</h3>
                <p>Stabilized cluster identity and browsing during live updates and zooming, refined individual-strike focus and compass behavior, added live data-source status, and expanded the interface toward the multilingual release line.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V3.993 · 2026/08</div>
                <h3>Pre-release feature consolidation</h3>
                <p>Consolidated the three-radius model, aura and warning controls, 120-minute activity history, compass modes, reference-location selection, filtering, clustering, and responsive device layouts.</p>
              </article>
              <article class="release-history-entry">
                <div class="release-history-version">V3.98 · 2026/08</div>
                <h3>Core interface evolution</h3>
                <p>Established the mature Gewitterradar interface with live strike visualization, radius-based classification, recent activity, KPI panels, filters, clustering, and mobile/tablet adaptations.</p>
              </article>
            </div>`;

  result = once(result, historyBodyAnchor, historyBodyReplacement, 'release-history-body');
  return result;
}

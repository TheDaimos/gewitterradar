function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.07 Help/Release-History anchor changed (${label})`);
  }
  return source.replace(from, to);
}

function replaceRangeOnce(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`V4.07 Help/Release-History range start missing (${label})`);
  if (source.indexOf(startMarker, start + startMarker.length) >= 0) throw new Error(`V4.07 Help/Release-History range start not unique (${label})`);
  const endStart = source.indexOf(endMarker, start + startMarker.length);
  if (endStart < 0) throw new Error(`V4.07 Help/Release-History range end missing (${label})`);
  const end = endStart + endMarker.length;
  return source.slice(0, start) + replacement + source.slice(end);
}

const HISTORY_BODY = String.raw`            <div class="release-history-body">
              <div class="release-history-lang-panel" data-release-history-lang="en">
                <article class="release-history-entry">
                  <div class="release-history-version">V4.07 · 2026/09</div>
                  <h3>Worldwide reference locations & saved places</h3>
                  <p>Introduced worldwide place and postcode search with country grouping and ranking, a dedicated reference tracker, direct map focus, Blitzortung location-entity handoff, Local To-do saved places with reversible removal and recovery, duplicate-safe re-saving, network and firewall guidance, and refined location-menu behavior.</p>
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
              </div>
              <div class="release-history-lang-panel" data-release-history-lang="de" hidden>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.07 · 2026/09</div>
                  <h3>Weltweite Referenzstandorte & gespeicherte Orte</h3>
                  <p>Ergänzt wurden die weltweite Orts- und PLZ-Suche mit Ländergruppierung und Ranking, ein eigener Referenztracker, der direkte Kartenfokus, die Übergabe an Blitzortung über eine Standort-Entität, lokal gespeicherte Orte über Local To-do mit reversiblem Entfernen und Wiederherstellen, dublettensicheres erneutes Speichern, Netzwerk- und Firewall-Hinweise sowie ein verfeinertes Verhalten der Standortwahl.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.06 · 2026/09</div>
                  <h3>Vereinheitlichung, Hilfe & Premium-Feinschliff</h3>
                  <p>Native Integration und Dashboard-Auslieferung wurden auf ein deterministisches Frontend vereinheitlicht. „Über Gewitterradar“ und „Hilfe & Hinweise“ wurden auf 15 Sprachen plus 4 deutsche Dialektvarianten erweitert, die Recorder-Hinweise für mehrere Geräte ergänzt und die Premium-Darstellung geräteübergreifend mit realen Android-, iPad- und iPad-Pro-Tests abgesichert.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.05 · 2026/09</div>
                  <h3>Premium-Erlebnis „Über Gewitterradar“</h3>
                  <p>Einführung der hochwertigen „Über Gewitterradar“-Erststart- und Informationsansicht einschließlich der persönlichen Widmung „Für Alkje“ sowie eines Einstellungs-Eintrags zum erneuten Öffnen. Die bewährte Blitz-, Radien-, Verlauf-/Historien- und Home-Assistant-Paketlogik aus V4.04 blieb erhalten.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.04 · 2026/09</div>
                  <h3>Bereitstellung des HACS-Pakets</h3>
                  <p>HACS legt das benötigte Home-Assistant-Helferpaket nun neben der installierten Karte als app_gewitterradar_pkg.yaml ab. Da ein HACS-Dashboard-Repository nicht außerhalb seines eigenen www/community-Verzeichnisses schreiben darf, wird die Datei weiterhin manuell nach /config/packages/ kopiert oder verschoben. Anwendungslogik und Helferverhalten bleiben unverändert.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.03 · 2026/09</div>
                  <h3>Korrektur der HACS-Release-Priorität</h3>
                  <p>Eigene GitHub-Release-Artefakte wurden aus dem HACS-Release entfernt, damit HACS auf den markierten dist-Baum zurückfällt und die Karte zusammen mit dem vollständigen assets-Verzeichnis installiert. Anwendungslogik und Helferverhalten bleiben unverändert.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.02 · 2026/09</div>
                  <h3>Korrektur der HACS-Paketierung</h3>
                  <p>Die HACS-Auslieferung wurde korrigiert, sodass die Karte und alle vier externen PNG-Dateien gemeinsam installiert werden. Kartenverhalten, Helfer-IDs, Layouts und Blitzverarbeitung bleiben unverändert.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.01 · 2026/09</div>
                  <h3>Optimierung der Bilddateien</h3>
                  <p>Die vier externen PNG-Dateien wurden konservativ auf ihre tatsächlichen Darstellungsgrenzen abgestimmt und verlustfrei kodiert. Großzügige HiDPI-Reserven blieben erhalten, die gemeinsame Dateigröße sank um etwa 61 Prozent und die Cache-Kennungen wurden erneuert, ohne das Verhalten der Anwendung zu verändern.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V4.00 · 2026/09</div>
                  <h3>Erste stabile Veröffentlichung</h3>
                  <p>Erste stabile Gewitterradar-Version mit Live-Blitzdarstellung, dreistufiger Gewitterbewertung, geräteübergreifend anpassbarer Oberfläche, 15 Sprachen plus 4 deutschen Dialektvarianten, metrischen und imperialen Einheiten, Kompassnavigation und 120-Minuten-Aktivitätsverlauf.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.997 · 2026/08</div>
                  <h3>Oberflächen- & Bedienungsfeinschliff</h3>
                  <p>Verbesserte Mobilansichten, anpassbare Einstellungen, Radiensteuerung, metrische und imperiale Entfernungsangaben, präzisere Anzeige sehr naher Blitze sowie direkte Bearbeitung der Radien aus der Karte.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.996 · 2026/08</div>
                  <h3>Stabilisierung für die Veröffentlichung</h3>
                  <p>Veralteter Diagnosecode wurde entfernt, während iPad-/WebKit-Schutzmaßnahmen, stabile Aktualisierungen der jüngsten Aktivität, eigene Auswahlfelder und weitere regressionskritische Kompatibilitätspfade erhalten blieben.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.994 · 2026/08</div>
                  <h3>Stabilität, Navigation & Internationalisierung</h3>
                  <p>Cluster-Identität und Navigation bei Live-Aktualisierungen und Zoom wurden stabilisiert, der Fokus auf einzelne Blitze und das Kompassverhalten verfeinert, der Status der Live-Datenquelle ergänzt und die Oberfläche in Richtung der mehrsprachigen Veröffentlichung ausgebaut.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.993 · 2026/08</div>
                  <h3>Bündelung der Vorab-Funktionen</h3>
                  <p>Zusammenführung des Drei-Radien-Modells, der Aura- und Warnsteuerung, des 120-Minuten-Aktivitätsverlaufs, der Kompassmodi, der Referenzstandortwahl, Filterung, Gruppierung und anpassbaren Geräteansichten.</p>
                </article>
                <article class="release-history-entry">
                  <div class="release-history-version">V3.98 · 2026/08</div>
                  <h3>Weiterentwicklung der Kernoberfläche</h3>
                  <p>Aufbau der ausgereiften Gewitterradar-Oberfläche mit Live-Blitzdarstellung, radienbasierter Klassifizierung, jüngster Aktivität, Kennzahlenfeldern, Filtern, Gruppierung sowie Mobil- und Tablet-Anpassungen.</p>
                </article>
              </div>
            </div>`;

export function v407HelpReleaseHistoryI18nDelta(source) {
  let result = source;

  result = once(
    result,
    "  const GEWITTERRADAR_BUILD = 'V4.07-TEST6-2026-09-13';",
    "  const GEWITTERRADAR_BUILD = 'V4.07-TEST7-2026-09-13';",
    'test7-build-marker',
  );

  const recorderIconAnchor = String.raw`,recorder:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="3.8" width="14" height="16.4" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 8h8M8 12h8M8 16h8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'};`;
  const networkIcon = String.raw`external_services:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.2 7.4 10.5 10.6M16.8 7.4l-3.3 3.2M12 14.4v2.7" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><circle cx="5.4" cy="5.6" r="2.05" fill="none" stroke="currentColor" stroke-width="1.45"/><circle cx="18.6" cy="5.6" r="2.05" fill="none" stroke="currentColor" stroke-width="1.45"/><circle cx="12" cy="19" r="2.05" fill="none" stroke="currentColor" stroke-width="1.45"/><circle cx="12" cy="12" r="2.65" fill="none" stroke="currentColor" stroke-width="1.65"/><circle cx="12" cy="12" r=".8" fill="currentColor"/></svg>'`;
  result = once(result, recorderIconAnchor, `,${networkIcon}${recorderIconAnchor}`, 'external-services-network-icon');

  const releaseCurrentCssAnchor = `          .release-history-current {`;
  const releaseI18nCss = String.raw`          /* V4.07 TEST7: bilingual Release History and compact premium language switch. */
          .release-history-heading{min-width:0}
          .release-history-title-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:2px}
          .release-history-title-row .release-history-title{margin-top:0}
          .release-history-language-toggle{display:inline-grid;grid-template-columns:repeat(2,36px);gap:2px;padding:2px;border:1px solid rgba(214,172,78,.34);border-radius:999px;background:rgba(4,9,14,.55);box-shadow:inset 0 1px rgba(255,239,194,.06)}
          .release-history-language-button{appearance:none;-webkit-appearance:none;min-width:36px;height:30px;padding:0 7px;border:0;border-radius:999px;background:transparent;color:#8f98a5;font:850 9px/1 inherit;letter-spacing:.08em;cursor:pointer;transition:background .16s ease,color .16s ease,box-shadow .16s ease,transform .12s ease}
          .release-history-language-button[aria-pressed="true"]{color:#f7dfa1;background:linear-gradient(180deg,rgba(194,146,55,.32),rgba(111,75,19,.27));box-shadow:inset 0 0 0 1px rgba(244,206,121,.28),0 0 8px rgba(214,166,64,.12)}
          .release-history-language-button:focus-visible{outline:2px solid #e7c16e;outline-offset:1px}
          .release-history-language-button:active{transform:scale(.97)}
          .release-history-lang-panel[hidden]{display:none!important}
          @media(hover:hover) and (pointer:fine){.release-history-language-button:hover{color:#efd18c;background:rgba(205,158,64,.10)}}
          @media(max-width:430px){.release-history-head{gap:8px;padding-left:12px;padding-right:10px}.release-history-title-row{gap:7px}.release-history-language-toggle{grid-template-columns:repeat(2,34px)}.release-history-language-button{min-width:34px;height:30px;padding:0 6px}.release-history-head-actions{gap:5px}.release-history-current{font-size:7.5px;letter-spacing:.04em}}
`;
  result = once(result, releaseCurrentCssAnchor, releaseI18nCss + releaseCurrentCssAnchor, 'release-history-i18n-css');

  const releaseHeadAnchor = String.raw`              <div>
                <div class="release-history-kicker">Gewitterradar · Release history</div>
                <div class="release-history-title" id="release-history-title">Release history</div>
              </div>`;
  const releaseHeadReplacement = String.raw`              <div class="release-history-heading">
                <div class="release-history-kicker" id="release-history-kicker">Gewitterradar · Release history</div>
                <div class="release-history-title-row">
                  <div class="release-history-title" id="release-history-title">Release history</div>
                  <div class="release-history-language-toggle" id="release-history-language-toggle" role="group" aria-label="Release history language">
                    <button class="release-history-language-button" type="button" data-release-history-language="de" aria-pressed="false" aria-label="Deutsch">DE</button>
                    <button class="release-history-language-button" type="button" data-release-history-language="en" aria-pressed="true" aria-label="English">EN</button>
                  </div>
                </div>
              </div>`;
  result = once(result, releaseHeadAnchor, releaseHeadReplacement, 'release-history-language-switch-markup');

  const historyStart = `            <div class="release-history-body">`;
  const historyEnd = String.raw`              <article class="release-history-entry">
                <div class="release-history-version">V3.98 · 2026/08</div>
                <h3>Core interface evolution</h3>
                <p>Established the mature Gewitterradar interface with live strike visualization, radius-based classification, recent activity, KPI panels, filters, clustering, and mobile/tablet adaptations.</p>
              </article>
            </div>`;
  result = replaceRangeOnce(result, historyStart, historyEnd, HISTORY_BODY, 'release-history-bilingual-body');

  const releaseVarAnchor = `      const releaseHistoryClose = this.shadow.getElementById('release-history-close');\n`;
  const releaseVarReplacement = releaseVarAnchor + `      const releaseHistoryLanguageButtons = [...this.shadow.querySelectorAll('[data-release-history-language]')];\n`;
  result = once(result, releaseVarAnchor, releaseVarReplacement, 'release-history-language-vars');

  const openHistoryAnchor = `      const openReleaseHistory = () => {\n        releaseHistoryBackdrop?.classList.add('open');`;
  const openHistoryReplacement = String.raw`      const releaseHistoryGermanLanguages = new Set(['Deutsch','Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch']);
      const syncReleaseHistoryLanguage = (requested = '') => {
        let language = requested || this._releaseHistoryLanguage || '';
        if (!language) {
          const appLanguage = String(this._languageValue?.() || 'English');
          language = releaseHistoryGermanLanguages.has(appLanguage) ? 'de' : 'en';
        }
        if (language !== 'de' && language !== 'en') language = 'en';
        this._releaseHistoryLanguage = language;
        for (const panel of this.shadow.querySelectorAll('[data-release-history-lang]')) {
          panel.hidden = panel.dataset.releaseHistoryLang !== language;
        }
        for (const button of releaseHistoryLanguageButtons) {
          button.setAttribute('aria-pressed',button.dataset.releaseHistoryLanguage === language ? 'true' : 'false');
        }
        const german = language === 'de';
        const kicker = this.shadow.getElementById('release-history-kicker');
        const title = this.shadow.getElementById('release-history-title');
        const toggle = this.shadow.getElementById('release-history-language-toggle');
        if (kicker) kicker.textContent = german ? 'Gewitterradar · Versionsverlauf' : 'Gewitterradar · Release history';
        if (title) title.textContent = german ? 'Versionsverlauf' : 'Release history';
        if (toggle) toggle.setAttribute('aria-label',german ? 'Sprache des Versionsverlaufs' : 'Release history language');
        releaseHistoryClose?.setAttribute('aria-label',german ? 'Versionsverlauf schließen' : 'Close release history');
      };
      for (const button of releaseHistoryLanguageButtons) {
        button.addEventListener('click',() => syncReleaseHistoryLanguage(button.dataset.releaseHistoryLanguage || 'en'));
      }

      const openReleaseHistory = () => {
        syncReleaseHistoryLanguage();
        releaseHistoryBackdrop?.classList.add('open');`;
  result = once(result, openHistoryAnchor, openHistoryReplacement, 'release-history-language-runtime');

  return result;
}

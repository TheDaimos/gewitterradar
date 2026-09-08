# Gewitterradar: gemeinsamer V4.05-Kandidat mit Premium-Controls

Stand: 2026-09-08. Implementierung und lokale Frontend-Prüfung bestanden; **Gesamt-Abnahme offen**, da native Linux-Laufzeitprüfungen und reale Kandidatenabnahme noch fehlen. Kein Release, Tag, Main-Merge oder Remote-Push in dieser Runde.

## Ausgangspunkt und Arbeitsbereich

- Kanonisch: TheDaimos/gewitterradar, lokaler Checkout C:/Git/gewitterradar-public.
- Arbeitsbranch: feature/integrated-dashboard-v4.05.
- Ausgangscommit nach sauberem Fast-forward von origin/main: d32615d987d69ac5eaf30c8cf7b5bab8dd96d422. Der vorhandene Feature-Branch c720057 lag davor; keine Konflikte, kein Reset/Rebase/Force-Push.
- Eingefrorene öffentliche Frontendquelle: TheDaimos/gewitterradar-dashboard, v4.05, 44a3a615f76a7d865c2d6c8690728656c18577b9. Das Release enthält die abschließende Hero-Korrektur und ist deshalb die tatsächliche Importquelle.
- Historische akzeptierte Entwicklungsreferenz: 18b64cdd9e6745200ef381a77118f5900b5bd8f1 im alten Integrations-Dev-Repository; dort wurde nichts bearbeitet.
- Die lokale Feature-Commit-SHA wird nach dem Commit im Abschlussbericht genannt; dieser Bericht liegt im selben Commit. Remote bleibt bis zur Freigabe unverändert.

## Drei freigegebene sichtbare Änderungen

Close: unverändertes 44×44-px Button-/Touchziel und 27×27-px inneres Element. Das neue transparente Bild wird auf einer zentrierten 34×34-px Bildfläche dargestellt; durch den Alpha-Rand bleibt das sichtbare Metall etwa 27 px groß. Keine Änderung der Header-Geometrie. Copy: 28×28-px dekoratives Bild im bestehenden 44×44-px Button am YAML-Bereich. Beide Bilder behalten ihr Seitenverhältnis und liegen vollständig innerhalb ihrer Hit-Flächen. Die vorhandenen lokalisierten aria-labels bleiben erhalten; die Bilder selbst haben leeres alt und keine Pointer-Events.

Hover ist auf hover-fähige Geräte mit feinem Pointer begrenzt: leichte Helligkeitsanhebung und dezenter Goldschatten. Pressed nutzt minimale Translate-/Scale-/Helligkeitsänderung ohne Layoutwirkung. Focus-visible erhält einen klaren goldenen Umriss. Die sichtbare Versionszeile lautet jetzt V4.05 · Visual V2.

**Unverändert:** Close-Handler, Escape, Fokusführung, Clipboard-API, Clipboard-Fallback, Erfolg-/Fehlerrückmeldung und kanonischer Recorder-YAML. Zeilennummern werden nicht mitkopiert. Für Alkje inklusive exaktem Widmungstext, Hero, Widmungsbild, Herz, Handschrift, Logo, Slogan, Begrüßung, Radien, Blitzortung.org, Entitäten und sämtliche Onboarding-/Persistenz-/Mehrkartenlogik bleiben erhalten. Recent, Compass, Medallion, Kalibrierung und bestehende Touch-/WebKit-Pfade wurden nicht verändert.

Der komplette gemeinsame JS-Quelltext muss exakt dem eingefrorenen Fixture plus der eng definierten Transformation in scripts/frontend-delta.mjs entsprechen. So werden auch Änderungen außerhalb des About-Bereichs abgelehnt. Das eingefrorene JS-Fixture hat SHA-256 9f594d5c23c5af5bdabf90749eb2639457a4cc14307407e20674036a02565e9b. Alle 15 importierten geschützten Bilddateien wurden gegen docs/V4_05_FRONTEND_REFERENCE_SHA256SUMS.txt geprüft.

## Neue Grafiken und Prüfsummen

Die vom Benutzer gelieferten 1254×1254-RGBA-PNGs bleiben byte-identische Master. Daraus wurden mit Sharp 256×256 große verlustfreie WebPs mit Alpha erzeugt, ohne Neugenerierung oder Retusche. Die Runtime-Dateien liegen identisch in frontend/assets, custom_components/gewitterradar/frontend/assets und dashboard/dist/assets.

- Master: artwork/about-controls/closing.png
  - SHA-256: 412af59629c9f6753acbf465b5f52b280c4fdd6d030eafb062898309b09dac1c
  - Runtime: assets/gewitterradar-about-close-premium.webp (63816 Bytes)
  - SHA-256: 206f20c56ed01bf49a989b52ea5e0281f0c2ea6f5babcb2f36bfe4ee89c0016e
- Master: artwork/about-controls/copy.png
  - SHA-256: f62932e4fdd13215f14b5c8984a43e831713f9a54f904a9ba20e438bf62cbf20
  - Runtime: assets/gewitterradar-about-copy-scroll.webp (63802 Bytes)
  - SHA-256: d269784528e9da0aa2fdfee8252300e709c7415a76a57291071085342cf192c4

Alle neuen und importierten gemeinsamen Runtime-Assets (15 geschützte Importe plus zwei neue Ableitungen):

- assets/gewitterradar-about-dedication-v4.webp — cb1e8f85ca9eef0f8831687464eb930087530bcc8ba5ed805832b9086697c6bb
- assets/gewitterradar-about-hero-v2.webp — 4b6469a3b9ec0ad2c1502eddbf5f2fa63b158c10d26a35c714d8eb9be6265e25
- assets/gewitterradar-brand-icon.png — 5389225fc801d71ba2bd4be1f40779be7eb89e2045d17afe3a508c5101340ff0
- assets/gewitterradar-compass-frame-v1.png — b09df9142df89903e2150e4767ebe3bf8bba9caf4ca7f0c4b6b78cc24318fde5
- assets/gewitterradar-compass-frame-v2.png — e24ee5ec7f56f2356013b2e8486171503777c61b77dc7d680f43440a4ebe99b3
- assets/gewitterradar-compass-frame-v3.png — 3abd63a10a067452597fe46ca9aa4a91bb5d7fa9fbcbb477930898dd3218ba57
- assets/gewitterradar-compass-frame-v4.png — 21a50737de285c3e55ddc907ba5907c5fa0a7eb7712bf0adb39c509b2f1b867d
- assets/gewitterradar-compass-frame-v5.png — d329cec759b1777bb64d1d72bada8e4b035d088c2069fdafa3738f674d01a6d0
- assets/gewitterradar-compass-selector-frame-v1.png — 8d20ab114370b6a7e689e81870fc7042fcab4d30ed089f2680edabdedf735676
- assets/gewitterradar-compass-selector-frame-v2.png — c9a3a95786c39049230698c34b49a95e3c1c7c60b752cf8d0a0280d9dd7f6cd4
- assets/gewitterradar-compass-selector-frame-v3.png — 55074440f74c0a8dc14e9c53ccaf56034c44159f32ee4ad74cd9c5c718ddaeb9
- assets/gewitterradar-compass-selector-frame-v4.png — a24bc40f2fbbb4a5c62acd12cc2093d0469a7932918ee0d88d6577c784626403
- assets/gewitterradar-compass-selector-frame-v5.png — 682899be2e38ae699351ec43e8adbf6aa0bc92b27401298badc7cbaff2e1c0dd
- assets/gewitterradar-trend-arrow.png — b781490b662970cdba20ce8f04b2e841807faa418a39873711b0bdac5f92c3ef
- assets/gewitterradar-trend-medallion.png — e54c26288716286fef786710672c17d90417c014ae99ffdf19fea55e7a6612c5
- assets/gewitterradar-about-close-premium.webp — 206f20c56ed01bf49a989b52ea5e0281f0c2ea6f5babcb2f36bfe4ee89c0016e
- assets/gewitterradar-about-copy-scroll.webp — d269784528e9da0aa2fdfee8252300e709c7415a76a57291071085342cf192c4

## Gemeinsame Quelle und Auslieferung

frontend/gewitterradar.js und frontend/assets sind die einzige Produktquelle. build-frontend.mjs erzeugt 18 gemeinsame Dateien (JS plus 17 Bilder) byte-identisch für Integration und Dashboard. Nur dashboard/dist enthält zusätzlich das unveränderte Legacy-YAML-Package. SHA256SUMS_FRONTEND.txt erfasst beide Payloads und dieses Package. verify-frontend.mjs prüft exakte Dateiinventare, Quellen, Referenzen und Hashes; test-frontend-build.mjs prüft deterministischen Wiederaufbau sowie Ablehnung manipulierter Assets, Quellen, Outputs und zusätzlicher Dateien.

Der native Adapter registriert in async_setup einmal pro Komponenten-Lifecycle /gewitterradar mit dem [unterstützten asynchronen Home-Assistant-Static-Path-API](https://developers.home-assistant.io/blog/2024/06/18/async_register_static_paths/). Das Manifest deklariert http als Abhängigkeit. Entry-Setup, Migration, Optionen und Unload bleiben unverändert. HACS erhält alle 30 Runtime-Dateien im Integrationsverzeichnis. Die Karte wird als Modulressource /gewitterradar/gewitterradar.js manuell eingetragen; keine .storage-Manipulation und keine automatische Doppelregistrierung. Installation und Ressourcenkollisionen stehen in INSTALLATION.md. Das separate beobachtete HACS-Repository-Persistenzproblem wird hier nicht behandelt.

Die CI-Workflows besitzen ausschließlich Leseberechtigungen und veröffentlichen keine Releases. Der neue Workflow prüft die Parität vor einem Neuaufbau, die negativen Build-Fälle, Golden-Referenz und beide Browser-Suites. Der vorhandene Workflow prüft weiterhin native Laufzeit, HACS und Hassfest. Es wurde keine Release-Automation hinzugefügt; eine spätere Promotion muss diese Gates gegen dieselbe Source-SHA verlangen.

## Prüfergebnisse

| Prüfung | Ergebnis |
|---|---|
| JS-, Python-, JSON- und YAML-Syntax | PASS lokal |
| Deterministischer Build, exaktes Inventar und SHA-256-Parität | PASS |
| Negative Manipulationstests | PASS: Abweichungen werden abgelehnt |
| HACS-Integration-Paketstaging | PASS: 30 byte-identische Runtime-Dateien |
| Bestehende statische Metadaten-/Paketassertionen | PASS: 7 Assertions; keine HA-Runtime-Ersatzprüfung |
| About-Suite Dashboard | PASS: 8 Profile und 5 Onboarding-Szenarien |
| About-Suite Integration-Payload | PASS: 8 Profile und 5 Onboarding-Szenarien |
| Frontend-Regressionssuite beider Payloads | PASS: Resolver, Recent, Compass, Medallion und bestehende Schutzprüfungen |
| Click/Touch/Enter/Escape, aria-label, Fokus/Rückkehrfokus | PASS im Browser-Harness |
| Clipboard-API/Fallback, exakter YAML ohne Zeilennummern | PASS im Browser-Harness |
| Native Home-Assistant-Tests einschließlich neuem HTTP-Routentest | BLOCKIERT vor Collection: Windows fehlt fcntl |
| HACS Action/Hassfest gegen neuen Kandidaten | OFFEN: noch kein Remote-Kandidatenlauf |
| Reale HACS-/HA- und iPad-/Android-Abnahme neuer Buttons | OFFEN |

Browserprofile, jeweils für beide Auslieferungen bestanden. Golden-Vergleich rendert die eingefrorene V4.05 und den Kandidaten im selben Chromium; maskiert ausschließlich Close, Copy und Versionszeile. Geometrie von 17 Selektoren wird zusätzlich exakt verglichen. Pixelabweichung zählt Kanalunterschiede größer 8; zulässige Obergrenze 0,1 %, tatsächlich überall 0.

| Profil | Beide Browser-Suites | Golden-Geometrie | Abweichende unmaskierte Pixel |
|---|---|---|---|
| reference | PASS | PASS | 0 |
| desktop | PASS | PASS | 0 |
| ipad-closed | PASS | PASS | 0 |
| ipad-open | PASS | PASS | 0 |
| ipad-portrait | PASS | PASS | 0 |
| ipad-pro | PASS | PASS | 0 |
| android-portrait | PASS | PASS | 0 |
| android-landscape | PASS | PASS | 0 |

Die Screenshots wurden visuell geprüft, darunter Referenz, iPad mit Sidebar und Android-Recorder. Scrollbedingte Ausschnitte auf kleinen Viewports entsprechen der unveränderten Baseline; die Suites prüfen Erreichbarkeit, Overflow und Clipping. Chromium-Profiltests sind keine realen Safari/WebKit- oder Gerätetests.

### Dokumentierte technische Befunde

Der lokale echte pytest-Aufruf unter Python 3.14 mit Home Assistant 2026.9.0 scheitert beim Import des Test-Harness über homeassistant.runner an ModuleNotFoundError: No module named 'fcntl'. Es wurden keine Ersatzmodule oder Mocks eingesetzt, um diesen Fehler zu kaschieren. WSL/Docker waren lokal nicht verfügbar. Deshalb bleiben native Laufzeit und Gesamt-Abnahme offen; nächster Schritt ist Linux-CI nach Freigabe des Feature-Pushs.

Ein neu hinzugefügter Rückkehrfokustest versuchte zunächst ein verstecktes Settings-Element zu fokussieren und schlug dadurch fehl. Nach Analyse wurde ausschließlich der Test auf den echten Ablauf Einstellungen öffnen → About öffnen → Schließen → Rückkehrfokus korrigiert. Die Produktlogik blieb unverändert; beide vollständigen Suites bestanden danach.

## Reproduktion und Evidenz

- node scripts/verify-frontend.mjs
- node scripts/test-frontend-build.mjs
- node --check frontend/gewitterradar.js
- Python 3.14: python scripts/check-static.py
- python scripts/verify-hacs-integration-package.py
- Mit Playwright 1.62.1, Sharp 0.34.5 und Chromium: node scripts/test-about-golden.cjs <chrome-path>
- ABOUT_DELIVERY=dashboard bzw. integration: node scripts/test-about-browser.cjs <chrome-path> artwork/acceptance/premium-controls/<delivery>
- Linux: python -m pytest -q tests (bestehende CI-Pins in .github/workflows/validate.yml).

Evidenz: artwork/acceptance/premium-controls/dashboard und integration enthalten Screenshots, about-results.json und frontend-regression.json. golden/results.json enthält alle Vergleichsmessungen; golden/v4.05-masked.png und candidate-masked.png das Referenzpaar. artwork/about-controls/provenance.json dokumentiert Master/Ableitungen. Die komplette gemeinsame Prüfsummenliste steht in SHA256SUMS_FRONTEND.txt.

## Geschützte lokale Patches / Git-Zustand

Das alte Repository bleibt auf feature/about-gewitterradar-visual-v2 bei 18b64cdd9e6745200ef381a77118f5900b5bd8f1. Diese drei Dateien bleiben untracked und unverändert:

- compass_calibration_final_review.patch: b54bf638d3c4a60fea879091b01f7a17012e1c04b439a44d4b93d9d9482bb377
- compass_calibration_review.patch: fc95da43130698007cc4b451910bfd40e7f58b57ea6975425c5733a9863c5183
- compass_measurement_review.patch: d526e25887a683c05577707903b7812c607d8fd5a861323e0f30686e4edce00c

Vor dem lokalen Commit enthält der kanonische Arbeitsbaum ausschließlich die unten aufgeführten Änderungen. Der abschließende git status und die lokale Commit-SHA werden nach Commit ausgegeben. Kein git add ., git clean, hard reset oder Eingriff in eingefrorene Referenzen.

## Vollständige Liste geänderter und neu hinzugefügter Dateien

Liste gegenüber dem oben genannten Ausgangscommit, einschließlich erzeugter Payloads und Prüfevidenz (127 Dateien):

- .gitattributes
- .github/workflows/shared-frontend.yml
- .gitignore
- CHANGELOG.md
- README.md
- SHA256SUMS_FRONTEND.txt
- artwork/about-controls/closing.png
- artwork/about-controls/copy.png
- artwork/about-controls/provenance.json
- artwork/acceptance/premium-controls/dashboard/about-android-landscape-entities.png
- artwork/acceptance/premium-controls/dashboard/about-android-landscape-recorder.png
- artwork/acceptance/premium-controls/dashboard/about-android-landscape.png
- artwork/acceptance/premium-controls/dashboard/about-android-portrait-entities.png
- artwork/acceptance/premium-controls/dashboard/about-android-portrait-recorder.png
- artwork/acceptance/premium-controls/dashboard/about-android-portrait.png
- artwork/acceptance/premium-controls/dashboard/about-desktop-entities.png
- artwork/acceptance/premium-controls/dashboard/about-desktop-recorder.png
- artwork/acceptance/premium-controls/dashboard/about-desktop.png
- artwork/acceptance/premium-controls/dashboard/about-ipad-closed.png
- artwork/acceptance/premium-controls/dashboard/about-ipad-open.png
- artwork/acceptance/premium-controls/dashboard/about-ipad-portrait.png
- artwork/acceptance/premium-controls/dashboard/about-ipad-pro.png
- artwork/acceptance/premium-controls/dashboard/about-reference.png
- artwork/acceptance/premium-controls/dashboard/about-results.json
- artwork/acceptance/premium-controls/dashboard/frontend-regression.json
- artwork/acceptance/premium-controls/focused/about-reference.png
- artwork/acceptance/premium-controls/focused/about-results.json
- artwork/acceptance/premium-controls/golden/candidate-masked.png
- artwork/acceptance/premium-controls/golden/results.json
- artwork/acceptance/premium-controls/golden/v4.05-masked.png
- artwork/acceptance/premium-controls/integration/about-android-landscape-entities.png
- artwork/acceptance/premium-controls/integration/about-android-landscape-recorder.png
- artwork/acceptance/premium-controls/integration/about-android-landscape.png
- artwork/acceptance/premium-controls/integration/about-android-portrait-entities.png
- artwork/acceptance/premium-controls/integration/about-android-portrait-recorder.png
- artwork/acceptance/premium-controls/integration/about-android-portrait.png
- artwork/acceptance/premium-controls/integration/about-desktop-entities.png
- artwork/acceptance/premium-controls/integration/about-desktop-recorder.png
- artwork/acceptance/premium-controls/integration/about-desktop.png
- artwork/acceptance/premium-controls/integration/about-ipad-closed.png
- artwork/acceptance/premium-controls/integration/about-ipad-open.png
- artwork/acceptance/premium-controls/integration/about-ipad-portrait.png
- artwork/acceptance/premium-controls/integration/about-ipad-pro.png
- artwork/acceptance/premium-controls/integration/about-reference.png
- artwork/acceptance/premium-controls/integration/about-results.json
- artwork/acceptance/premium-controls/integration/frontend-regression.json
- custom_components/gewitterradar/__init__.py
- custom_components/gewitterradar/frontend/assets/gewitterradar-about-close-premium.webp
- custom_components/gewitterradar/frontend/assets/gewitterradar-about-copy-scroll.webp
- custom_components/gewitterradar/frontend/assets/gewitterradar-about-dedication-v4.webp
- custom_components/gewitterradar/frontend/assets/gewitterradar-about-hero-v2.webp
- custom_components/gewitterradar/frontend/assets/gewitterradar-brand-icon.png
- custom_components/gewitterradar/frontend/assets/gewitterradar-compass-frame-v1.png
- custom_components/gewitterradar/frontend/assets/gewitterradar-compass-frame-v2.png
- custom_components/gewitterradar/frontend/assets/gewitterradar-compass-frame-v3.png
- custom_components/gewitterradar/frontend/assets/gewitterradar-compass-frame-v4.png
- custom_components/gewitterradar/frontend/assets/gewitterradar-compass-frame-v5.png
- custom_components/gewitterradar/frontend/assets/gewitterradar-compass-selector-frame-v1.png
- custom_components/gewitterradar/frontend/assets/gewitterradar-compass-selector-frame-v2.png
- custom_components/gewitterradar/frontend/assets/gewitterradar-compass-selector-frame-v3.png
- custom_components/gewitterradar/frontend/assets/gewitterradar-compass-selector-frame-v4.png
- custom_components/gewitterradar/frontend/assets/gewitterradar-compass-selector-frame-v5.png
- custom_components/gewitterradar/frontend/assets/gewitterradar-trend-arrow.png
- custom_components/gewitterradar/frontend/assets/gewitterradar-trend-medallion.png
- custom_components/gewitterradar/frontend/gewitterradar.js
- custom_components/gewitterradar/manifest.json
- dashboard/README.md
- dashboard/dist/app_gewitterradar_pkg.yaml
- dashboard/dist/assets/gewitterradar-about-close-premium.webp
- dashboard/dist/assets/gewitterradar-about-copy-scroll.webp
- dashboard/dist/assets/gewitterradar-about-dedication-v4.webp
- dashboard/dist/assets/gewitterradar-about-hero-v2.webp
- dashboard/dist/assets/gewitterradar-brand-icon.png
- dashboard/dist/assets/gewitterradar-compass-frame-v1.png
- dashboard/dist/assets/gewitterradar-compass-frame-v2.png
- dashboard/dist/assets/gewitterradar-compass-frame-v3.png
- dashboard/dist/assets/gewitterradar-compass-frame-v4.png
- dashboard/dist/assets/gewitterradar-compass-frame-v5.png
- dashboard/dist/assets/gewitterradar-compass-selector-frame-v1.png
- dashboard/dist/assets/gewitterradar-compass-selector-frame-v2.png
- dashboard/dist/assets/gewitterradar-compass-selector-frame-v3.png
- dashboard/dist/assets/gewitterradar-compass-selector-frame-v4.png
- dashboard/dist/assets/gewitterradar-compass-selector-frame-v5.png
- dashboard/dist/assets/gewitterradar-trend-arrow.png
- dashboard/dist/assets/gewitterradar-trend-medallion.png
- dashboard/dist/gewitterradar.js
- dashboard/hacs.json
- docs/ABOUT_GEWITTERRADAR_POST_V4_05_VISUAL_DELTAS.md
- docs/CODEX_PLAN.md
- docs/DELIVERY_ARCHITECTURE.md
- docs/INSTALLATION.md
- docs/PREMIUM_CONTROLS_2026-09-08.md
- docs/RECORDER.md
- frontend/assets.json
- frontend/assets/gewitterradar-about-close-premium.webp
- frontend/assets/gewitterradar-about-copy-scroll.webp
- frontend/assets/gewitterradar-about-dedication-v4.webp
- frontend/assets/gewitterradar-about-hero-v2.webp
- frontend/assets/gewitterradar-brand-icon.png
- frontend/assets/gewitterradar-compass-frame-v1.png
- frontend/assets/gewitterradar-compass-frame-v2.png
- frontend/assets/gewitterradar-compass-frame-v3.png
- frontend/assets/gewitterradar-compass-frame-v4.png
- frontend/assets/gewitterradar-compass-frame-v5.png
- frontend/assets/gewitterradar-compass-selector-frame-v1.png
- frontend/assets/gewitterradar-compass-selector-frame-v2.png
- frontend/assets/gewitterradar-compass-selector-frame-v3.png
- frontend/assets/gewitterradar-compass-selector-frame-v4.png
- frontend/assets/gewitterradar-compass-selector-frame-v5.png
- frontend/assets/gewitterradar-trend-arrow.png
- frontend/assets/gewitterradar-trend-medallion.png
- frontend/gewitterradar.js
- home-assistant/app_gewitterradar_pkg.yaml
- scripts/about-onboarding-harness.html
- scripts/build-frontend.mjs
- scripts/check-static.py
- scripts/compare-about-reference.cjs
- scripts/frontend-delta.mjs
- scripts/frontend-layout-harness.html
- scripts/test-about-browser.cjs
- scripts/test-about-golden.cjs
- scripts/test-frontend-build.mjs
- scripts/verify-frontend.mjs
- scripts/verify-hacs-integration-package.py
- tests/fixtures/v4_05/gewitterradar.js
- tests/test_frontend_delivery.py
- tests/test_hacs_packaging.py

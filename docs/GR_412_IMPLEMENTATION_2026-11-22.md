# GR V4.12 DEV – Arbeits- und Schutzakte

## Ausgangsbasis vor Implementierung

GR `deploy/dev`: `ad521c476a046d53ef8308bb252243d9c584ea35`, intern 4.11.254 / HA 0.25.161. Geschützte öffentliche Ausgangsreferenz: `v4.11.3`, V4.11.03 FINAL, `af70fe2bf85a88fdea402cf46e3bd6a11903189b`, ebenfalls intern 4.11.254 / HA 0.25.161. Der funktionale Frontend-Unterschied besteht nur in Kommentaren; Builddatum und Veröffentlichungsmetadaten unterscheiden sich. Kein Rücksetzen des neueren DEV-HEAD.

WR `deploy/dev` lesend geprüft: `728cf9ff8291fdb2e56b95e62ca1d48af7217039`. GR-Bootstrap, beide Modul-/Provider-Schutzregeln, Referenzpaar vom 13.11. und Eye-Randpositionierung 4.11.215 gelesen. Bestehende Betreiberreferenzen bleiben geschützt. Eine neue technische Aura-Referenz ersetzt keine ausstehende HA-/Android-Betreiberabnahme.

## Eingriffsbereich und Regressionsrisiken

Teil 1 betrifft ausschließlich Eye-UI-Geometrie, sichtbare Aura-Zuordnung, endliche Übergänge, Konfiguration und Versions-/Buildwerkzeuge. Die vorhandene Slotbelegung bleibt von der visuellen Zuordnung getrennt. Ausgeschaltete Wetter-Layer behalten ihr Icon. Gemeinsame Ressourcen: Eye-DOM, Canvas-/Frame-Scheduler, Settings Vault, Frontend-Importrevisionen. Deshalb Neon-Fusion, Profilwechsel, Touch-Recovery, Randpositionen und Modulidentität erneut prüfen.

Unbetroffen bleiben WR-Providerwahl, Freshness/Coverage, DWD-/OPERA-/NASA-Kacheln, Wind-Schlangenrenderer, Temperatur- und Synoptikdaten. Keine Datenverträge oder Wetterentscheidungen ändern. Bestehende Vertragsregressionen ausführen. PROD VM101 bleibt unverändert.

Teil 2 beginnt erst nach separat dokumentiertem, geprüftem und installierbar bereitgestelltem Aura-Zwischenstand. Ergebnisse, Versionen, Quellcommits und tatsächliche Testgrenzen werden hier beziehungsweise im zugehörigen Prüfbericht ergänzt.

## Zwischenabschluss Teil 1

Technische Aura-Referenz **4.12.1 DEV / HA 0.25.162**, Runtime `4121r1`, Modulset `E412-1A1`, Quellcommit **`66c078b72f8140656bb0ea925a1086818a484e30`** auf `deploy/dev` bereitgestellt. [Eigenständiger DEV-Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.1-dev) mit installierbaren, inhaltsgeprüften Integration-/Dashboard-ZIPs, `deployment.json` und SHA-256-Inventar. Paketidentitäten zusätzlich unter `docs/evidence/gr-v412-aura/`.

Integration: 236 Dateien, SHA-256 `bba04b2794d398c177afcbe9e1830fa74a4951366dcddbfe88c09f2715a59e68`. Dashboard: 219 Dateien, SHA-256 `ee8e6a30e8ecbc05b60e7548391c1dbe42806d32e2d091a67eda543fc5e14cf7`. 217 Frontenddateien im Paket sind bytegleich; das kanonische Build-Gate zählt davon separat 196 Kern-Frontenddateien plus zusätzliche Hilfeseiten/Assets.

Prüfbericht: [geschützte technische Aura-Referenz](GR_412_AURA_REFERENCE_2026-11-22.md). Alle dort konkret benannten lokalen Prüfungen PASS, einschließlich 29 Wetter-/Menüverträgen, drei neuen Aura-Browserformaten, alter Rand-/Recovery-/Vault-Matrix und 180 Neon-Pixelvergleichen. HACS-/DRA-Prüfung einschließlich Rückfall auf den exakten FINAL-Modulbaum PASS. Keine HA-Installation oder physische Android-Abnahme behauptet. PROD VM101 unverändert. Der technische Zwischenabschluss erlaubt jetzt den Beginn von Teil 2; die neue Aura-Referenz bleibt dabei geschützt.

## Öffentlicher CI-Nachlauf vor Teil 2

Die nach dem Push gestarteten öffentlichen Gates auf `66c078b7` ergänzten den lokalen Nachweis: HA 2026.9.0 / Python 3.14 führte 81 Tests aus, davon 78 PASS und drei ausschließlich wegen fest auf 4.11 beziehungsweise fünfstellige Runtimekennungen zugeschnittener Testannahmen fehlgeschlagen. Der Shared-Frontend-Lauf stoppte ebenfalls an einer alten 411-RegEx. Hassfest verlangt zusätzlich die Deklaration des bereits von First Steps verwendeten optionalen Recorder-Moduls. Nachweise: [HA/Hassfest-Lauf](https://github.com/TheDaimos/gewitterradar/actions/runs/45020728701), [Frontend-Lauf](https://github.com/TheDaimos/gewitterradar/actions/runs/45020728744).

Die veröffentlichte 4.12.1 wird nicht überschrieben. Neuer Nachlauf **4.12.2 DEV / HA 0.25.163**, Runtime `4122r1`, Modulset `E412-2A1`: Runtime-/Modulidentität wird aus der tatsächlichen Serie abgeleitet; Importrevisionen werden nach Serie, Patch und Revision statt als unterschiedlich lange Dezimalzahlen verglichen. Der vorhandene Recorder bleibt optional unter `after_dependencies`; keine neue Pflichtabhängigkeit und keine Änderung an Wetter-/Aura-Geometrie. Das vorhandene breite Shared-Frontend-Gate bleibt aktiv; zusätzlich wird die neue vollständige Aura-Matrix aus dem öffentlichen Workflow aufgerufen.

Lokal: 19 tatsächliche reine Python-Frontend-Vertragsfunktionen, 17 Node-Modell-/Vertragsbefehle aus dem breiten Shared-Workflow, Build-/Manipulationsproben, Aura-Modell, Vault-Schema und statische Prüfung PASS. HA-Runtime und Hassfest werden erneut öffentlich ausgeführt. **Teil 2 beginnt erst nach Klärung dieses zusätzlichen CI-Nachlaufs.** Die zuvor bestätigten lokalen Ergebnisse werden nicht als grüne öffentliche CI ausgegeben.

### 4.12.3 – Schutz der Trefferflächen während Übergängen

4.12.2 (`23c1a578867c649e48f859d3dc771562ed309bfa`) besteht öffentlich Hassfest und die vollständige HA-2026.9.0-Laufzeitprüfung. Weitere rote UI-Gates zeigten alte feste 411-Modulkennungen und einen bereits in FINAL vorhandenen elften Farbpaletteneintrag „Keine Farbe“; diese Tests prüfen jetzt die exakte kanonische Kennung beziehungsweise vollständige unveränderte Palette. Der About-Golden-Test akzeptiert die neue Versionsserie, seine historischen Geometrie-/Pixelgrenzen bleiben vollständig erhalten.

Die Synoptikregression reproduzierte außerdem eine echte temporäre Überdeckung nach Einblenden des Cluster-Knopfs: Zielpositionen waren sicher, aber eine globale CSS-Positionsüberblendung ließ die alte Trefferfläche noch 240 ms bestehen. **4.12.3 DEV / HA 0.25.164**, Runtime `4123r1`, Modulset `E412-3A1`, prüft den bisherigen und überstrichenen Trefferbereich gegen die aktuellen Hindernisse. Normale Slotänderungen bleiben animiert. Nur eine notwendige Sicherheitskorrektur durch bereits belegte Trefferflächen erfolgt sofort; ein sanfter linearer Übergang wäre dort mit der verbindlichen sofortigen Bedienbarkeit nicht vereinbar. Kein Abschalten von Auren, Icons oder Kartenknöpfen.

Lokal erneut PASS: Aura-Desktop-/Hoch-/Querformatmatrix mit unmittelbarem Hindernisfall, vollständiger Synoptik-Touch-/Darstellungsablauf, bestehende Randmatrix sowie 54 exakte V180-Energieframes über Desktop, Android-Emulation und iPad, einschließlich Kontakte, Lebensdauer, Palette, vier Modi und Budgets. Deterministischer Build mit negativen Manipulationsproben, neun Navigations-Unittests, tatsächliche reine Python-Vertragsfunktionen und statische Prüfung PASS.

Lokaler About-Golden-Lauf erreicht nach der Versionskorrektur den unveränderten historischen Referenzvergleich, scheitert auf Windows aber bereits an der **Referenz**-Geometrie (`.about-dedication`: 114 statt 123,547 px bei unveränderter Toleranz 0,02 px). Keine Produkt-/Golden-Geometrie zur Kaschierung verändert. Der verbindliche Linux-CI-Lauf bleibt erforderlich. Noch keine neue öffentliche CI-Freigabe und kein Beginn von Teil 2 behauptet.

### Öffentlicher Nachweis auf 380df6dd und letzter reiner Testnachlauf

`380df6ddbdd81dd288ac6d695b5885a543785648`: vollständiges breites Linux-Frontend-Gate **PASS**, einschließlich des unveränderten About-Golden-Masters, Sprache/Onboarding, Menüanimationen und beider Auslieferungs-Browsersuiten. Zusätzliche Aura-Matrix **PASS** (4m29s), HA-Runtime/Hassfest, HACS, Pakete, Mosaik, WR-Autorität, Weather-Control-Position, Close-Gesten, Audit, Module, Spiegel und vollständige Vault-/Neon-/Energie-Paketmatrix **PASS**. [Frontend/Aura](https://github.com/TheDaimos/gewitterradar/actions/runs/45024295522), [HA](https://github.com/TheDaimos/gewitterradar/actions/runs/45024295631).

Zwei verbleibende rote Checks betreffen reine Testkompatibilität: ein Inline-Python-Suchmuster im Navigations-Workflow akzeptierte nur 4.11; die letzte Help-Prüfung im Synoptik-Workflow erwartete ebenfalls ein 4.11-Badge und noch die vor 4.11.241/248 geltende Hilfe-DOM-Struktur. Sie prüft nun die exakte kanonische Anzeigeversion, die bestehenden Themencontainer, Summary-/Chevron-Schalter und einen echten WR-Reconnect vor dem Öffnen des nach bestehendem Vertrag geschützten Eye. Onboarding ist im synthetischen Hilfe-Testprofil explizit ausgeblendet; dedizierte Onboarding-Prüfungen bleiben aktiv. Keine Produkt-Hilfe oder Eye-Readiness abgeschwächt.

Korrigierter vollständiger Help-/PRO-Browserlauf lokal **PASS**: alle Artikelschalter, Standard/PRO, Verbindungsverlust/-wiederkehr, Reload, Assetfehler, lokalisierte Eye-Einstellungen und 320–1177-px-Geometrien. Der tatsächliche korrigierte Inline-Python-Vertrag wurde lokal ausgeführt: **PASS**. Dieser Nachlauf ändert ausschließlich Test-/Workflow-/Dokumentationsdateien; die installierbaren 4.12.3-Bäume bleiben unverändert. Die öffentliche Wiederholung wird vor Teil 2 abgewartet.

Der aktualisierte Hilfe-Test verwendet außerdem die schon in FINAL geltenden `.help-group-topics`-Container und die seit 4.11.241 vorhandenen Summary-/Chevron-Schalter anstelle entfernter redundanter PRO-Schaltflächen. Er prüft ausdrücklich weiterhin jeden Artikel und dessen Schließen; ein Reconnect stellt die unveränderte Eye-Readiness vor dem Eye-Menütest her. Vollständiger lokaler Lauf nach diesen Anpassungen erneut PASS. Änderungen am Hilfeinhalt oder am Produkt-DOM waren dafür nicht erforderlich.

## Verbindlicher Zwischenabschluss vor Teil 2: 4.12.3

Alle in der [aktualisierten technischen Aura-Referenz](GR_412_AURA_REFERENCE_2026-11-22.md) verlinkten öffentlichen Gates auf `ec1d48c61f5fd58cffbbbe46451b2cfbb15df630` sind PASS. Der reine folgende Dokumentationscommit `b96f1e350eb054972bfffe3e9a631069c4c5d358` besitzt nachweislich dieselben Produktbäume. Dieser Quellanker ist als [v4.12.3-dev](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.3-dev) mit beiden installierbaren, erneut vollständig geprüften ZIPs, Manifest und SHA-256-Inventar veröffentlicht. GitHub-Digests stimmen exakt mit den lokalen Paketen überein. Nach erneutem Versions- und Schutzabgleich darf Teil 2 beginnen; keine Betreiber- oder PROD-Freigabe daraus ableiten.

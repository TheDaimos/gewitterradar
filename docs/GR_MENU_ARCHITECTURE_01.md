# GR-MENU-ARCHITECTURE-01 – Menüstruktur und gezielte Premium-UI-Korrekturen

Stand: 09.11.2026. Projekt: TheDaimos/gewitterradar, ausschließlich `deploy/dev`.

## Basis und Lieferung

Ausgangscommit: `7213b7aeffba5c6bc6fd2afb6bd74f84c88632b6`, GR **4.11.167 DEV**, HA **0.25.74**. Die neuere laufende Entwicklung bleibt erhalten. Neue Lieferung: GR **4.11.168 DEV**, HA **0.25.75**, Runtime **411168r1**, Modulset **E411-168A1**.

Die geschützte Mosaikreferenz WR 0.10.295 / Loader 298 und GR 4.11.147 / HA 0.25.54 wurde gelesen. Ihre Dokumentation, historischen Tags und Release-Artefakte bleiben unverändert. WeatherRouter wird nicht geändert. Lizenzbereinigung und öffentliche Historie sind nicht Bestandteil dieses Auftrags.

## Gemeinsame Menüarchitektur

Eine unveränderliche Definition `SETTINGS_MENU_TREE` in `frontend/modules/ui/controls.js` liefert beiden Präsentationen dieselbe Struktur:

1. Weather-Engine
2. Sprache
3. Standort
4. Kartendarstellung
5. Effekte & Animationen
6. Radien
7. Diagnose Tools

Unter 7 stehen ausschließlich **7.1 Kalibrierung**, **7.2 Weather-Engine**, **7.3 Datenquellen & Verbindungen** und **7.4 Module & Versionen**. Datenquellen und Module sind keine Hauptmenüeinträge mehr. Nummerierung und Übersetzungen werden gemeinsam aktualisiert.

Klassisch und modern verwenden vollständige Inhaltsseiten im vorhandenen Einstellungsfenster. Es werden die vorhandenen echten DOM-Knoten gezeigt, keine neuen Formulare oder Diagnoseinstanzen angelegt. Zurück führt eine Ebene zurück; Schließen beendet das Fenster. Formularwerte und Scrollpositionen werden je Seite erhalten. Die moderne Präsentation behält ihre vorhandene compositorgestützte Bewegung; Animationen umfassen die gesamte wechselnde Inhaltsansicht einschließlich der Hauptaktionen. Temporäre animierte Abbilder sind inert, ohne duplizierte IDs oder Namen, und nach dem Übergang entfernt. Die originale Signatur und zweizeilige Fußzeile bleiben im persistenten Fensterrahmen. Beim Entfernen einer Karteninstanz werden ihr einzelner History-Listener und eine laufende Menüanimation bereinigt; beim Wiederverbinden wird derselbe Listener einmal registriert. Die vorhandenen Wetter-Lebenszyklusfunktionen bleiben unverändert.

Browser-Zurück wird über gekennzeichnete eigene History-Einträge ohne URL-Änderung unterstützt. Andere Home-Assistant-History-Einträge werden nicht umgeschrieben. Asynchrone WebView-History-Ereignisse werden beim sofortigen Schließen/Wiederöffnen berücksichtigt. Navigation und Animation respektieren `prefers-reduced-motion`.

## Weather-Engine: Bedienung und Diagnostik

Unter **1. Weather-Engine** bleiben vorhandene aktive Bedien- und Darstellungseinstellungen erhalten. Das umfasst bewusst konservativ auch bestehende Radar-, Vorlade-, Aktualisierungs- und Zeitverlaufsoptionen. Keine unklare historische Option wurde entfernt oder fachlich neu interpretiert.

Zwei responsive Statuskarten für Blitzortung.org und WeatherRouter verwenden ausschließlich vorhandene HA-/Integrations-, Discovery- und Transportzustände. Sie unterscheiden Verbunden, Gestört, Nicht erreichbar und Unbekannt. Ein vorhandener HA-Blitzzähler wird ausdrücklich als lokaler Quellenstatus beschrieben, nicht als Beweis einer externen Blitzortung-Serververbindung. Ungeprüfte oder nicht belastbare Informationen erzeugen keinen erfundenen Erfolg. Vorhandene Prüfzeitpunkte werden als solche angezeigt. Das Anzeigen der Karten verursacht keine Wetterabfrage und führt keine Datenalters- oder Gültigkeitsentscheidung ein.

Nach **7.2 Weather-Engine** wechseln die vorhandene Verbindungs-/Datenprüfung mit Ergebnis, die Darstellungs-Neuprüfung und der vollständige bestehende Diagnosebereich mit Filtern, API-Tests, Transport-/Raster-/Mosaikmonitor, Rohdaten und Exporten. Die vorhandenen Elemente und Listener werden als ein einzelner Bestand verschoben. Der bisherige Weather-Engine-Dialog wird dort als Region eingebettet; keine zweite Dialogschicht oder zweite Diagnoseverwaltung. Bestehende Diagnoseöffnungen navigieren auf diese Seite.

**7.1** erhält die vorhandenen Kalibrierungs- und Testfunktionen mit ihren IDs und Zuständen. **7.3** und **7.4** behalten ihre vollständige vorhandene Datenquellen- beziehungsweise Modulübersicht, Runtime-Abweichungsprüfung und Exportfunktionen. Der Versionswächter bleibt aktiv und fachlich unverändert.

## Zentrale Release-Metadaten und Fußzeile

Die einzige aktuelle Release-Quelle ist `frontend/version.js` mit `APPLICATION_RELEASE`. `module-manifest.js` gibt dieses Objekt unverändert als `APPLICATION_META` an die vorhandenen Modul-Abhängigkeiten weiter. Die beiden Fußzeilen in `skeleton.js` verwenden genau diese Daten:

```text
2026/11 · V4.11.168
Modulsatz-ID: E411-168A1
```

Version und Modulset stehen nicht als zusätzliche UI-Konstanten im Menü. Die Signatur erhält einen eigenen rechten Bereich; die Fußzeile bleibt links mit zwei getrennten Zeilen.

Im tatsächlichen Ausgangsstand standen Frontend und Runtime bereits auf 4.11.167, `build_info.py` und DRA-Provenienz jedoch noch auf 4.11.165. `scripts/sync-dev-release.mjs <Ausgangscommit>` leitet den nächsten Release-Stand und geänderte Modulversionen aus der expliziten Basis ab und synchronisiert Entry-/Modul-/Panel-Importkennungen, Runtime-Manifest, Asset-Prüfsumme, HA-Manifest, Build-Vergleich und DRA-Provenienz. Der vorhandene Frontend-Build erzeugt daraus die beiden Auslieferungskopien und Prüfsummen. Aktuelle Integritätsprüfungen lesen dieselbe zentrale Quelle; historische exakte Prüfungen bleiben für ihre jeweiligen alten Releases erhalten.

## Project Hub und Premium-Assets

Die vorhandenen Einstiege über die Hauptüberschrift und die `by CK`-Signatur bleiben erhalten. Der vorhandene lokale Offline-Hub öffnet unmittelbar; ein Online-Healthcheck ist keine Voraussetzung mehr. Die ausgelieferte Offline-Seite selbst bleibt unverändert.

Die ergänzende lokale Navigation zeigt **Meine Projekte · Kontakt · GitHub** mit zwei goldenen Middledots und reserviertem Platz für das vorhandene Schließen-Icon. Meine Projekte verlinkt exakt auf `https://thedaimos.github.io/project-hub/` über einen abgesicherten externen Link. Kontakt führt zum vorhandenen lokalen Kontaktbereich. GitHub behält das Project-Hub-Ziel `https://github.com/TheDaimos/project-hub`. Der Hub schließt unabhängig von der Karte und setzt deren Ansicht nicht zurück.

Das Eye-Menü verwendet exakt `deps.ABOUT_CLOSE_IMAGE` aus `modules/core/base-context.js` – dieselbe eingebettete runde Gold-X-WebP-Grafik wie `#settings-close img`, keine ähnlich aussehende Ersatzgrafik. Ihre SHA256 ist `3c0c183a50ec7367e00098f201d1500d513475afe64d35aba4b4550cca4d93bb`. Die drei Kopfaktionen erhalten einheitliche 40-px-Ziele und 34-px-Bilder; das vorhandene Info-Bild bekommt keinen zusätzlichen Ring. Schließen bleibt eine reine Eye-UI-Aktion. Das originale Niederschlags-Chevron sitzt rechts mit etwa 12 px Innenabstand.

Das Regen-PNG bleibt byteidentisch. Sein äußerer Goldring umfasst ungefähr 973 von 1254 Quellpixeln, gegenüber ungefähr 122 von 136 bei den vorhandenen Wind-/Temperatursymbolen. Desktop 64 → 58 CSS-px ergibt dadurch ungefähr 45 px sichtbaren Goldring und passt zu deren 50-px-Bildern (ungefähr 44,9 px Goldring). Der bereits akzeptierte Touch-Wert 58 px bleibt erhalten. Keine Aura, kein Asset-Umbau und keine Änderung an Toggle, Long Press, Drag, Sichtbarkeitsoptionen oder Positionsspeicherung.

## Betroffene Dateien

- Menü/Navigationsdarstellung: `modules/ui/controls.js`, `skeleton.js`, `i18n-settings.js`; zwei optionale Menü-Cleanup-/Resume-Aufrufe in `modules/core/card-lifecycle.js`.
- Bestehende Diagnoseeinordnung: `modules/diagnostics/data-sources.js`, `module-view.js`.
- Statusanzeige und Einbettung: `modules/weather/consumer-client.js`, `modules/core/source-status.js`.
- Hub/Eye/Regen: `modules/ui/project-hub.js`, `modules/weather/display-menu.js`, `precipitation-control.js`.
- Cache-/Versionssynchronisierung zusätzlich in `modules/diagnostics/raster-lab.js`, `modules/weather/layer-menu.js`, Entry, Panel, Release-/Modul-/Runtime-Metadaten, HA-Build-/Manifest-/DRA-Provenienz und Asset-/Frontend-Prüfsummen.
- Alle daraus erzeugten Dateien in `custom_components/gewitterradar/frontend` und `dashboard/dist`.
- Release-/Integritätswerkzeuge, zielgerichtete Tests und öffentliche Menü-CI; dieser Bericht.

## Schutz und Prüfgrenzen

Gezielte automatisierte Prüfungen vergleichen Wind-, Schlangen-, Temperatur-, Niederschlags-, OPERA-/NASA-Mosaik- und Blitzrenderer mit der Ausgangsrevision. Die numerischen Datenadapter, Interpolation, Providerpriorität, Beobachtungsmasken, World-Wrap, Seamless Tile Handover und WR-Verträge bleiben unverändert. Keine 900-Sekunden-Regel, kein TEST69 und keine neue Wetterdatenanalyse.

`deploy-relay.json` und `deploy-relay-channel.json` bleiben identisch. Die bestehende Projektquelle **TheDaimos/gewitterradar**, Quelltyp **branch**, Ref **deploy/dev** wird nicht umgestellt. VM109 wurde nicht aufgerufen und es findet keine automatische Installation statt. VM101 bleibt unangetastet. Ein erreichbarer GitHub-/DRA-Branchstand oder ein Browsertest ist keine reale HA-/Companion-Abnahme.

## Verifizierte Veröffentlichung

Implementierungscommit, tatsächlich abgeschlossene Prüfläufe und Paketprüfsummen werden nach ihrer Verifikation ergänzt. Installation und visuelle Realabnahme auf HA DEV VM109, Android und iPad bleiben beim Betreiber.

# Übergabe – Gewitterradar V4.09.02 Kartenansichten

Stand: **20.09.2026 · Chatabschluss**

## Sofortiger Einstieg im neuen Chat

1. `Daimos — Gewitterradar` verwenden oder beim neuen Kontext-Handshake **Gewitterradar** nennen.
2. Kanonisches Repository live prüfen: `TheDaimos/gewitterradar`.
3. Aktiver Arbeitsbranch: `feature/v4.09.02-map-display-fixes`.
4. V4.08 FINAL bleibt unveränderte Rückfallbasis.
5. Vor jeder Fortsetzung den Branch-HEAD live lesen; der letzte vollständig grüne technische Checkpoint vor dem Dokumentationsabschluss war `4d071b3cd21a2ba33a33ee6036f23430c8df6099`.

## Warum V4.09.02 existiert

V4.09.01 war der erste Testkandidat für neue Kartenansichten. Der Benutzer installierte ihn real. Dabei wurden zwei Probleme gefunden:

- **Eigenes Fenster:** Fenster öffnete, aber dort war im Wesentlichen alles außer der Karte sichtbar.
- **Main:** Standard/Groß/Vollbild existierte zwar; auf Android war die Leiste sichtbar, auf Desktop wurde sie real zunächst nicht gefunden. Das zeigte, dass die Steuerung konzeptionell zu unauffällig und außerhalb der Karte platziert war.

Diese reale Rückmeldung ist die verbindliche Ursache für V4.09.02.

## Verbindlich beschlossene V4.09.02-Oberfläche

### 1. Layer-Schaltfläche in der Karte

Eine einzige kompakte Schaltfläche sitzt **rechts unten innerhalb der Karte**, oberhalb der Leaflet-Attribution.

Symbolgeometrie:

- unten: **klein, rot**;
- Mitte: **mittel, blau**;
- oben: **groß, gold**.

Semantik: Gefahr / Gewitter / Beobachtung entsprechend der bestehenden Radien-Farblogik.

### 2. Kontextmenü

Tippen/Klicken öffnet direkt an der Schaltfläche nach oben/links:

- Standard;
- Groß;
- Vollbild.

Nach Auswahl schließt das Menü. Außenklick/-tap schließt ebenfalls.

### 3. Variante A – eigenes Fenster getrennt

**Eigenes Kartenfenster bleibt ausschließlich in den Einstellungen.** Es wird nicht in das Layer-Kontextmenü aufgenommen.

### 4. Startdarstellung pro Gerät

In Einstellungen → Kartendarstellung:

- Standard;
- Groß;
- Vollbild;
- Zuletzt verwendet.

Speicherung nur lokal im jeweiligen Browserprofil. Keine HA-Helfer, keine Cloud-/Gerätesynchronisierung. Damit kann Desktop z. B. Groß, Android Standard und iPad Zuletzt verwendet benutzen.

## Technische Umsetzung

- Produktversion im Frontend: `4.09.02` / `V4.09.02-DEV-2026-09-20`.
- Branch: `feature/v4.09.02-map-display-fixes`.
- kanonisches Frontend und beide Auslieferungsformen bytegleich;
- neue lokale Schlüssel:
  - `gewitterradar:v409:startup-map-display`;
  - `gewitterradar:v409:last-map-display-mode`;
- V4.09.01-Kompatibilität bleibt erhalten;
- separates Fenster zusätzlich über `gewitterradar_window_version=40902` markiert;
- Fensterhost und Dialog besitzen robuste Vollbild-/fixed-Fallbacks;
- keine Änderung der Leaflet-Karteninstanz beim Moduswechsel;
- Kompass wird weiterhin derselbe aktuell ausgewählte Kompass, kein Parallelkompass.

## Relevante Dateien

- `frontend/gewitterradar.js` – kanonische Frontendquelle;
- `custom_components/gewitterradar/frontend/gewitterradar.js` – native Ausleitung;
- `dashboard/dist/gewitterradar.js` – Dashboard-Ausleitung;
- `scripts/verify-v409-map-display.mjs` – statischer V4.09-Vertrag;
- `scripts/test-v409-map-display.cjs` – Browser-/Gerätetest;
- `docs/V4_09_01_MAP_DISPLAY_TEST_CANDIDATE.md` – ursprünglicher Kandidat;
- `docs/V4_09_02_MAP_DISPLAY_DEVICE_FIX.md` – Gerätefix;
- `docs/RELEASE_NOTES_V4_09_02_TEST.md` – vollständige Notes;
- `docs/ROADMAP.md`, `docs/HISTORY.md`, `docs/MILESTONES.md`, `CHANGELOG.md` – kanonische Langzeitdokumentation.

## Teststatus beim Chatabschluss

Für den letzten technischen Checkpoint `4d071b3c…` waren grün:

- **Validate shared Gewitterradar frontend**;
- **Validate Gewitterradar integration**;
- **Hi-Res asset retention**.

Der vorherige Runtime-Commit `6ce6883f…` hatte zusätzlich den Diagnosevertrag grün. Die zunächst fehlgeschlagene Shared-Frontend-Prüfung wurde nicht durch Produktfehler verursacht, sondern durch die geschützte About-Golden-Prüfung, die die neue V4.09.02-Entwicklungsidentität noch nicht akzeptierte. Commit `4d071b3c…` korrigierte ausschließlich diese Testzulassung auf V4.09.xx; der geschützte Geometrievertrag selbst wurde nicht aufgeweicht.

## Sichtbare Release History

Die bisherige „Future Developments“-Planung war beim Chatabschluss veraltet und enthielt unter anderem das verworfene **XL**. Sie wurde im V4.09.02-Branch durch einen bilingualen **V4.09.02 · DEV · 2026/09**-Eintrag ersetzt. Darin stehen die tatsächlich umgesetzte Layer-Schaltfläche, Startdarstellung, Gerätebefunde und der weiterhin offene reale Abnahmestatus.

## Dev-Toolkit

Das gemeinsame `TheDaimos/home-assistant-dev-toolkit` wurde für diesen Arbeitsblock berücksichtigt. **Kein Toolkit-Commit ist erforderlich**, weil die Änderungen projektspezifische Gewitterradar-UI/UX und lokale Darstellungspräferenzen betreffen und keine neue allgemeine Home-Assistant-/HACS-/Lifecycle-Regel entstanden ist. Allgemeine Standards bleiben unverändert anwendbar.

## Was der nächste Chat NICHT tun darf

- nicht auf V4.08 zurückentwickeln;
- nicht die Layer-Schaltfläche wieder durch die breite Leiste ersetzen;
- kein XL wieder einführen;
- „Eigenes Fenster“ nicht in das Karten-Kontextmenü mischen;
- Startdarstellung nicht als HA-Helfer synchronisieren;
- keine Radien-/Cluster-/About-/Diagnose-Refactorings nebenbei;
- keine Release-Promotion ohne reale Abnahme.

## Nächster sinnvoller Schritt

**Reale Geräteabnahme von V4.09.02.** Priorität:

1. Desktop: Layer-Schaltfläche sichtbar und Menü bedienbar?
2. Android: Symbol, Menü, Standard/Groß/Vollbild?
3. iPad/iPad Pro: Touch/Pointer, keine Layout-/Scrollregression?
4. Einstellungen: Startdarstellung je Gerät getrennt?
5. „Zuletzt verwendet“ korrekt?
6. Eigenes Fenster: wirklich Karte statt HA-Hauptoberfläche?
7. Kompass im Vollbild/Fenster weiterhin verschiebbar?

Erst wenn diese Punkte real bestätigt sind, darf der Kandidat Richtung Merge/Release vorbereitet werden.

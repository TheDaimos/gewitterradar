# GewitterRadar V4.14.16 DEV — MA Premium-Chrome und symmetrisches Dialoglayout

Datum: 27. November 2026 · Branch `feature/v4.14-monitored-areas`
Status: Quell-Implementierung und Frontend-Build-Spiegel synchron; Sichtabnahme auf DEV VM109 sowie DRA-Bereitstellung offen.

## Betreiberbefund

Die Realtests zu V4.14.15 bestätigten die lokale Teilstringsuche, die alphabetische Filterleiste, die beiden To-do-/SQLite-Register und die einklappbaren Standortgruppen. Gemeldet wurde eine noch unzureichende Premium-Oberfläche: zu flache Rahmen in allen drei MA-Dialogen, einfache Chevrons, dünne Buchstabenschaltflächen ohne Tiefe und unsymmetrische horizontale Innenabstände (besonders im Übernahmeassistenten, rechts zusätzlich durch Scrollbar und 44px reservierten Headerbereich).

## Verbindliche Code-Referenzen

- Der tatsächlich akzeptierte hochwertige Metallrahmen liegt in `frontend/modules/ui/skeleton.js`, bei `.release-history-dialog`: **2px transparenter Border**, dreilagige Hintergründe und abgestufte Goldmetall-Gradienten als `border-box`. Die einfache Gold-Linienfarbe der `.settings-dialog` erwies sich für MA-Dialoge visuell als zu flach.
- Die hochwertigen Chevrons stammen aus `.settings-collapsible>.settings-section-head::after`: 13px, Messinglichtreflexe, dunkler Dropshadow, weiche Rotation.
- Gewünschte zusätzliche Materialien: `https://thedaimos.github.io/weather-router-pub/assets/routing-flow/webp/routing-plate-core.webp`, `routing-plate-plain.webp`, `routing-plate-result.webp`. Die Live-Bilddateien waren über den Webabruf in dieser Sitzung nicht lesbar; deshalb wurde **kein ungeprüftes Asset** in GR kopiert oder behauptet. Stilumsetzung erfolgt ausschließlich über vorhandene GR-CSS-Referenzen.
- Das original eingebettete Settings-Close-WebP wird weiterhin per `owner.shadow.getElementById('settings-close')?.querySelector('img')?.src` übernommen. Keine Änderung am Artwork.

## Umsetzung

1. `frontend/modules/monitored-areas/migration-wizard.js`: echter schimmernder 2px-Rahmen; dreidimensionale metallische Buchstaben- und Registerschaltflächen; polierte aktiver/inaktiver Zustand; gleiche Goldbehandlung der Footeraktionen; goldene Chevron-Animation bei SQLite-Gruppen. Links/rechts `padding-inline` 18px (mobil 12px); **`scrollbar-gutter:auto`** statt reservierter Breite; die 44px Close-Freiraumreserve gilt nur für Überschrift und Untertitel, **nicht** für die volle Breite der Filter/Tab-Leiste. Header/Footer bleiben außerhalb der Scrollfläche fixiert.
2. `frontend/modules/monitored-areas/location-manager.js`: gleicher 2px-Metallrahmen, spiegelnde Gruppenüberschriften, echtes GR-Menü-Chevron, metallische Bedienelemente, symmetrisches List-Layout ohne reservierte Scrollbarbreite. Bereits bestehende Funktionen und getrennte Gruppen beibehalten.
3. `frontend/modules/monitored-areas/index.js`: konsistenter 2px-Metallrahmen und Footerbuttons für die optionale Cleanup-Erinnerung.
4. Metadaten: `V4.14.16 DEV`, Runtime `41416r1`, ModuleSet `E414-16A1`, Integration `0.25.202`, `BUILD_VERSION = "4.14.16"`. Nur Feature-Branch, keine öffentlichen DEV-Releases, PROD/WR unverändert.
5. Tests: `tests/test_ma_premium_chrome.mjs` (25 gezielte Assertions) zusätzlich zu den bisherigen MA-Migration-, SQLite-, Sticky-Header-, Tab-, Vault- und Standortverträgen. Der Test vergleicht den GR-Metallgradienten direkt mit den Quell-CSS-Werten, prüft Premium-Chevrons, 2px-Rahmen, unveränderte Close-Grafik, ausgeglichene Ränder und Import-/Finalisierungsschutz.

## Betreiberabnahme

Nach DEV-Installation bitte insbesondere die **Außenkanten in den Ecken**, Button-Tiefe/Hover/aktive Zustände, die Schriftprägung der Buchstabenfilter, die Chevrons in beiden Fenstern und die bündige rechte Kante von Suchfeld/Tabliste/Scrollinhalt prüfen. Bei SQLite bleibt die Ansicht nur lesend; keine Finalisierung oder To-do-Leerung für diesen reinen Sichttest.

**MA-020 weiterhin offen.** Bestehende 43 Orte (39 aktiv, vier archiviert) dürfen durch diese Iteration nicht verändert werden.

## Nachträgliche Build-Verifikation

- Build-Workflow `.github/workflows/ma-v41416-dev-build-sync.yml` führte die referenzierten MA-Tests und den kanonischen Frontend-Build aus; nach automatischem Delivery-Commit sind der Quellstand und beide Mirrors in den geprüften Pfaden synchron. Eine individuelle CI-Run-ID konnte nicht ausgelesen werden.
- GitHub-Readback nach Actions-Commit: **10 von 10** Versions-, Loader-, Panel-, Runtime-Manifest-, Modulmanifest-, MA- und Vault-Dateipfaden haben in `frontend/`, `custom_components/gewitterradar/frontend/` und `dashboard/dist/` jeweils identische Git-Blob-SHA-Werte.
- `SHA256SUMS_FRONTEND.txt`: sechs Hash-Einträge für die drei MA-Module über zwei Delivery-Mirrors. Versionsidentität abgeglichen: Produkt **4.14.16**, Revision **41416r1**, Integration **0.25.202**, DRA-Build **4.14.16**.
- MA-Premium-UI-Vertrag mit tatsächlich gelesenen Repository-Dateien ausgeführt: **25/25 PASS**; drei geänderte Module zusätzlich durch ECMAScript-Parser: **3/3 PASS**.
- **Nicht** getestet in dieser Sitzung: GUI-Rendering auf HA DEV VM109, DRA-Versionsanzeige oder Installation, vollständige Datenmigration, FINAL-Abnahme.

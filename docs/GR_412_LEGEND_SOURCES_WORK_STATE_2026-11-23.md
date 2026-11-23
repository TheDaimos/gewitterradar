# V4.12 – Quelleninformationen und Niederschlagslegenden

## Bestand und Schutzinventar vor Produktänderungen

GR `deploy/dev`: lokal und remote `5d040c538bedd0a04ee783b4bf8cf2bcc6ccc913`, Produktreferenz 4.12.8 / HA 0.25.169 / `eb2673573fb9d593818bbacdf1a1069714f291d4`. Keine vorbestehenden Änderungen an versionierten Dateien. Bestehende unversionierte Arbeitsordner bleiben erhalten. WR-Remote `728cf9ff8291fdb2e56b95e62ca1d48af7217039`; der lokale WR-Checkout ist älter und wird nicht als aktuelle Referenz verwendet oder verändert.

Bootstrap, beide Regressionsschutzdateien, Betreiber-Referenzpaar und Aura-Akte gelesen. FINAL, Aura 4.12.3, Eye-Randverhalten, native Drag-/Recovery-Pfade, Profile, Wetterwerte, Provider, Paletten und Raster-Compositing bleiben geschützt. Keine VM101-Aktion. Reale Betreiberabnahme bleibt wie vereinbart beim Betreiber.

## Rekonstruierter Stand / konkrete Änderungsgrenze

- ERLEDIGT: Hub-Transparenzregler, gemeinsame Instrumenthülle, sichere Quellen-Textbereinigung, bestehender Vorschaucontainer am Ende des Konfigurationsformulars, native Profilpersistenz und Referenznachweise.
- TEILWEISE: Der Vorschaucontainer existiert, aber der gemeinsame Descriptor liefert für Niederschlag kein Modell. Die 100-%-Glasstellung ist bei Alpha 0,18 und konstantem Blur begrenzt. Einzelskalen unterdrücken ihre Beschriftung. Die Reihenfolge berücksichtigt Updatezeit. Quellen-/Zeitinformationen werden noch als flache Texte wiederholt.
- OFFEN: gemeinsamen Niederschlags-Descriptor ergänzen, Glas-Alpha und Blur bis transparent steuern, quellenspezifische stabile Präsentationsreihenfolge, RY-Metadaten und Duplikatfälle nachweisen, optionale profilgebundene Beschriftung für alle sechs Arten, Sternchen durch dynamische Erklärung ersetzen, gemeinsame sichere strukturierte Info-Komponente, gezielte/geschützte Prüfungen und neuer DEV-Release.

Änderungen ausschließlich an Legendenpräsentation, Metadatenübernahme und neuem optionalem Vault-Bool. Meteorologische Farbtabellen, Intervallinterpretation, Wettercontroller, Routerregeln und Renderer werden nicht verändert. Der vorhandene wissenschaftliche Normalisierer und der gesamte geschützte Präfix bleiben unverändert. Eine additive Präsentationshilfe liest V2-Layer und die abweichende V1-Struktur nur für die Erklärung; keine Providerentscheidung oder Wetterdarstellung wird verändert.

## RY-Prüfung (laufend)

Aktueller WR-Quellstand definiert `radar_precipitation_quality_checked` als WMS-Produkt `RADOLAN-RY`. Die gelesene DWD-Implementierung liefert WMS-Legenden-URL und Stil; eine strukturierte Niederschlagspalette wird nur für das andere WMS-Produkt `Niederschlagsradar` mit verifiziertem Stil ergänzt. V2-Adapter und aktuelle Metadatenverträge werden vor der Entscheidung zusätzlich geprüft. Keine neue RY-Palette und kein zusätzlicher Karten-Layer.


## Implementierter Stand 23.11.2026

ERLEDIGT: alle vier Produktpakete, 19 Sprachkataloge, optionales `showCaption` im bestehenden Vault-Schema. Vorschau bleibt einmalig letzter Formularabschnitt. Alpha/Blur/Slotfläche/Schatten werden ausschließlich über Hintergrundvariablen gesteuert. Quellreihenfolge und RY A/B/C sind Präsentationsschritte nach der wissenschaftlich unveränderten Radargruppierung. RY-Äquivalenz wird auch gegen die vollständigen empfangenen Teilquelltabellen einer bereits gruppierten Radarlegende geprüft. Keine Palette wird übernommen oder verändert.

RY-Vertrag am aktuellen WR-Quellcommit `728cf9ff8291fdb2e56b95e62ca1d48af7217039`: `dwd/radar_precipitation_quality_checked`, WMS `RADOLAN-RY`, quantity `precipitation_rate`, measurement_method `quality_checked_precipitation_radar`, observation_kind `observation`, unit aus Capability derzeit `None`. WMS-Legende URL/title/style, aber keine strukturierten entries/stops/ticks. Der Adapter akzeptiert diesen Quellenvertrag einschließlich explizit unbekannter Einheit im WR-genehmigten Mosaik. Entscheidung C: Info-Status, kein farbloser Balken. Kein Nachweis einer realen aktuellen VM109-Quellenantwort behauptet; Betreiber meldete den leeren RY-Balken, der aktuelle Quellvertrag erklärt diesen Fall.

ERLEDIGT / lokal nachgewiesen: neues Quellenmodell-Gate, reale Browserausführung des Frontends mit synthetischem HA/WR-Transport Desktop/Android-Hochformat, 48 Niederschlagslayout-Kombinationen, RY A/C und Modell A/B/C, sichere Links/Malicious-Markup, mathematische Vergleichszeichen, korrekte lokale Zeit, Ein-/Mehrquellenskalen, Caption an/aus für alle sechs Arten, Vorschau live/zuletzt, Reload. Bestehende Hub-, Minimal-, Platzierungs- und authentifizierte Vault-Browserketten bestanden; echte Profilwahl stellt Caption und alle sechs Positionen wieder her. Zwei gezielte Info-Darstellungsnachbesserungen danach werden im neuen finalen Quellenlauf und der öffentlichen Gesamtkette abgedeckt. DRA-Identität nach passender Zweckbezeichnung bestanden. Schutzgates und 30 Node-Verträge bestanden. Deterministischer Build mit Negativproben bestanden.

OFFEN bis Auslieferung: finaler Spiegel/Commit, öffentliche Regression auf exakt diesem Quellstand, kanonische Pakete aus Git-Blobs, Integritätsnachweis, DEV-Prerelease, abschließender technischer Bericht. Reale VM109-/Android-Geräteabnahme verbleibt ausdrücklich beim Betreiber. Bestehende fremde Arbeitsordner unverändert.


## Zwischenprüfung des ersten Quellstands

ERLEDIGT: Quellcommit `8f6bbe50d51ace44f5f88645b0940106d3cfe18a`, zwölf öffentliche Prüfketten auf exakt diesem SHA erfolgreich. Browserbeweise aus öffentlichem Linux-Lauf archiviert. Beide kanonischen ZIPs vollständig gegen Original-Git-Blobs und bytegleich gegen die Linux-CI-Pakete geprüft. Prüfbericht: [GR_412_LEGEND_SOURCES_REPORT_2026-11-23.md](GR_412_LEGEND_SOURCES_REPORT_2026-11-23.md). DEV-Release v4.12.9-dev; keine FINAL-Promotion. Eine abschließende reine Dokumentationsversion ändert diese Produktbäume nicht. Physische Betreiberabnahme bleibt beim Betreiber, VM101 unangetastet.


## Visuelle Nachkontrolle vor Release

Die zwölf grünen Ketten auf `8f6bbe50` ersetzen keine Bildprüfung: die endgültigen Linux-Bilder zeigten eine zu hohe Mehrquellen-Vertikallegende mit Überdeckung der Android-Kartenbedienung. Veröffentlichung dieses Zwischenstands unterblieb. Konkrete Nachbesserung: aus den vorhandenen Hindernisrechtecken einen freien Instrumentbereich bestimmen, Spaltenzahl und Längsbudget gemeinsam wählen; kompakte Quellencaptions auf zwei Zeilen begrenzen (vollständiger Name in Titel und Info). Nativer Placer, Drag, Pointer und Wetterlogik bleiben unverändert.

Gezielt ERLEDIGT: Desktop und Android erneut mit 48 Layoutkombinationen geprüft, jetzt zusätzlich explizite Rechteck-Kollisionen gegen Eye, Hub, Kompass, Zoom und Kartenbedienung für sämtliche vertikalen Größen/Stile. Keine Überlagerung. Modell- und exakte Schutzgates bestanden. OFFEN: neuer Quellcommit, öffentliche Endregression und neue kanonische Pakete/Beweise; Beweise des vorherigen Zwischenstands nicht als Nachweis der geänderten Produktbäume ausgeben.


## Abschließende technische Lieferung

ERLEDIGT: Quellcommit `82fbbb2de8ef69eb41bc067531074aacb864f165`, zwölf öffentliche Prüfketten auf exakt diesem SHA erfolgreich. Browserbeweise aus öffentlichem Linux-Lauf archiviert. Beide kanonischen ZIPs vollständig gegen Original-Git-Blobs und bytegleich gegen die Linux-CI-Pakete geprüft. Prüfbericht: [GR_412_LEGEND_SOURCES_REPORT_2026-11-23.md](GR_412_LEGEND_SOURCES_REPORT_2026-11-23.md). DEV-Release v4.12.9-dev; keine FINAL-Promotion. Eine abschließende reine Dokumentationsversion ändert diese Produktbäume nicht. Physische Betreiberabnahme bleibt beim Betreiber, VM101 unangetastet.

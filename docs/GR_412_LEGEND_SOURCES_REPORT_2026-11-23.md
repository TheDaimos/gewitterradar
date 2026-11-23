# GewitterRadar PRO V4.12.9 DEV – Legend Hub, Quellenskalen und Informationen

Stand: 23.11.2026. Frontend **4.12.9 DEV**, HA **0.25.170**, Runtime `4129r1`, Modulset `E412-9A1`, 37 registrierte Module. Quellcommit **`82fbbb2de8ef69eb41bc067531074aacb864f165`** auf `deploy/dev`. Ausgangs-HEAD `5d040c538bedd0a04ee783b4bf8cf2bcc6ccc913`; unveränderliche visuelle Vergleichsbasis **V4.12.8 / `eb2673573fb9d593818bbacdf1a1069714f291d4`**.

## Ergebnis und Änderungsgrenze

Die vier Nachbesserungspakete sind implementiert. Der vorhandene letzte Vorschaucontainer verwendet für Niederschlag denselben Skalenrenderer wie das Karteninstrument und reagiert auf alle bisherigen Darstellungsoptionen. Kein zusätzlicher Vorschaucontainer, keine nachfolgenden Formularfelder. Vertikale Mehrquellen-Instrumente wählen Spalten und Skalenlänge anhand der tatsächlich freien Kartenrechtecke; kompakte Quellencaptions bleiben zweizeilig, der volle Name bleibt im Titel und Info-Menü zugänglich. Horizontal und vertikal berücksichtigen auch mehrere Quellenskalen; fehlende Farbmetadaten erzeugen keinen Balken. Ohne aktive Quelle verwendet die Vorschau ausschließlich die bereits bestehende, ausdrücklich als Referenz bezeichnete Niederschlagstabelle.

Der vorhandene Glasregler steuert Hintergrundalpha, Backdrop-Blur, Sättigung, Flächenschatten und Slot-Hintergründe getrennt: bei 0 % blickdicht, bei Zwischenwerten Frosted Glass, bei 100 % Alpha 0 / Blur 0 px / Sättigung 1. Metallkante, Reflexion, Icons und aktive Slot-Hervorhebung bleiben erhalten. Keine flächige Opacity-Steuerung des Menüs. Die bestehende kurze Öffnungsanimation bleibt unverändert.

**„Legendenbeschriftung anzeigen“** ist für alle sechs Legenden standardmäßig aktiv, auch für eine einzelne Quelle. Der optionale Bool `showCaption` liegt im vorhandenen profilgebundenen Legend-Hub-Vault-Eintrag; ältere Profile benötigen keine Migration. Deaktivieren entfernt ausschließlich die kompakte Beschriftung. Quellenbezeichnungen, Einheiten und fachliche Erklärungen bleiben im Info-Menü. Der bestehende native Drag-/Joe-Recovery-/Platzierungspfad bleibt unverändert.

Die neue gemeinsame Informationskomponente wird von Niederschlag, Wind, Temperatur, Advektion, Synoptik und weiteren Legenden verwendet. Fachliche Visualisierungen und Erklärungen bleiben erhalten; Quellen und Zeitangaben erhalten eigene Abschnitte. Provider-HTML wird in einem inerten Dokument in Text und geprüfte HTTP(S)-Links überführt. Live-DOM entsteht ausschließlich durch `createElement`/`textContent`; keine Provider-`innerHTML`, keine Scripts/Eventhandler oder URLs mit eingebetteten Zugangsdaten. Links verwenden `_blank` und `noopener noreferrer`. Mathematische Vergleichszeichen bleiben erhalten.

Zeitangaben beruhen ausschließlich auf empfangenen Metadaten, werden lokal mit expliziter IANA-Zeitzone formatiert und je Quelle dedupliziert. NASA-Regen und -Schnee teilen sich ihre Quellen-/Zeitinformationen, behalten aber getrennte fachliche Skalen: Regen als Satellitenschätzung, Schnee als Wasseräquivalent und ausdrücklich keine Schneehöhe. Altersangaben und aktuell/veraltet stammen aus WR; keine neu berechnete Freshness-Entscheidung. Die technischen Codes werden verständlich übersetzt, vollständige Rohmetadaten einschließlich ISO-Zeiten bleiben eingeklappt zugänglich. V1 liest `resource.semantics` und `freshness.data_time`; V2 liest die ursprünglichen Layer-Metadaten.

Alle neuen Einstellungen und Erklärungstexte sind in allen **19** bestehenden Sprachkatalogen enthalten. Quellnamen werden aus den tatsächlich gelieferten Metadaten übernommen.

## Stabile Reihenfolge und RY-Prüfung

Die Anordnung ist ein reiner Präsentationsschritt nach der unveränderten wissenschaftlichen DWD-/OPERA-Gruppierung. Sie verwendet die tatsächliche Quellkennung und die empfangene Phase; Updatezeit und Raster-Compositing werden nicht verwendet oder verändert.

| Rang | Quellenskala |
| --- | --- |
| 1 | DWD / OPERA Radar, gemeinsam nur bei unverändert erfülltem bisherigen Fachvergleich |
| 2 | NASA IMERG Regenrate |
| 3 | DWD RY, ausschließlich bei gültiger eigenständiger Farbskala |
| 4 | NASA IMERG Schnee/Wasseräquivalent |
| danach | Unbekannte Quellen deterministisch nach Quellkennung und Phase |

Fehlende Quellen werden ausgelassen. Unterschiedliche untere Radargrenzen bleiben fachlich unverändert und werden ohne Sternchen erklärt. Die Zahlen stammen aus den bereits verifizierten empfangenen Intervallen; beispielsweise **„Untere Nachweisgrenzen: DWD ab 0,1 mm/h; OPERA größer als 0 mm/h.“** Es gibt keine neuen meteorologischen Konstanten oder Klassen.

Die RY-Prüfung bezieht sich auf den tatsächlich gelesenen aktuellen **WR-Quellcommit `728cf9ff8291fdb2e56b95e62ca1d48af7217039`**, nicht auf eine behauptete neue VM109-Liveantwort:

| Feld | Nachgewiesener Vertrag |
| --- | --- |
| `source_id` | `dwd/radar_precipitation_quality_checked` |
| WMS-Produkt | `RADOLAN-RY` |
| Größe | `precipitation_rate` |
| Messmethode | `quality_checked_precipitation_radar` |
| Herkunft | Radar / Observation |
| Einheit | aus Provider-Capability, aktuell explizit `None` |
| Legende | WMS-URL, Titel und Stil |
| `entries`, `stops`, `ticks` | keine strukturierte RY-Farbtabelle im aktuellen Providerpfad |
| Mosaik | vorhandener WR-Kandidat für `weather.precipitation.layer`; Adapter akzeptiert WMS-Metadaten und unbekannte Einheit, tatsächliche Zulassung weiter allein durch WR |

Belege: [DWD-Provider](https://github.com/TheDaimos/weather-router-dev/blob/728cf9ff8291fdb2e56b95e62ca1d48af7217039/custom_components/weather_router/providers/dwd.py), [physischer und Quellenvertrag](https://github.com/TheDaimos/weather-router-dev/blob/728cf9ff8291fdb2e56b95e62ca1d48af7217039/custom_components/weather_router/consumer_capability_map.json), [V2-Kandidaten/Quellkennung](https://github.com/TheDaimos/weather-router-dev/blob/728cf9ff8291fdb2e56b95e62ca1d48af7217039/custom_components/weather_router/consumer_raster_mosaic_api.py), [Rasteradapter](https://github.com/TheDaimos/weather-router-dev/blob/728cf9ff8291fdb2e56b95e62ca1d48af7217039/custom_components/weather_router/raster_mosaic_adapter.py).

**Aktuelles Ergebnis: Fall C.** RY erscheint im Info-Menü mit fehlenden verifizierten Farbmetadaten; kein leerer Balken, keine übernommene Radar-/OPERA-Palette, kein neuer unabhängig schaltbarer Karten-Layer. Fall A ist additiv unterstützt und geprüft: tatsächliche gültige eigene Klassen erscheinen an Rang 3. Fall B wird nur bei vollständig identischer, expliziter Größe/Einheit/Phase/Farbklasse/Ticks zusammengefasst, auch beim exakten Vergleich mit einer ursprünglichen Teilquelltabelle der bestehenden gemeinsamen Radarskala; Quellenzuordnung bleibt in der Erklärung.

## Prüfungen

Lokal bestanden: Quellenmodell mit Reihenfolge bei Updates/fehlenden Quellen/unbekannten Quellen, RY A/B/C einschließlich gemeinsamer Radar-Teilquelle, unveränderte originale NASA-Tabellen mit jeweils 110 Klassen, exakte dynamische Untergrenzen, V1-/V2-Metadaten, sechs Caption-Defaults und alle 19 Sprachkataloge. Das tatsächliche Frontend wurde im Browser mit synthetischem HA-/WR-Transport geprüft: Desktop und Android-Hochformat, 48 neue Skalenlayout-Kombinationen, letzter Vorschauabschnitt und Live-Änderungen, Glas 0/50/100, sichere Links und bösartiges Markup, mathematische Vergleichszeichen, lokale Zeiten, NASA-Deduplizierung, alleinige Schneeskala, RY mit/ohne Farben, Caption an/aus für alle sechs Arten und Reload.

Bestehende Browserketten bestanden lokal: Legend Hub mit 336 Layouts und 216 Erscheinungsvarianten über drei Viewports, Minimalinstrumente einschließlich Maus-/Touch-Drag und Drei-Finger-Recovery, 18 Standardplatzierungen, authentifizierter Vault mit Reload, echter Profilwahl im synthetischen Backend und allen sechs unabhängigen Positionen. Caption-/Glas-Persistenz ist in die bestehende Vault-Profilwechselprüfung aufgenommen. Zusätzlich bestanden: 30 Node-Verträge, wissenschaftlicher exakter Quellschutz, Aura-/Hub-Modelle, tatsächliches Python-Vault-Schema, DRA-/Runtime-Identität, statische Prüfungen und deterministischer Frontend-Build mit Fail-Closed-Negativproben.

**Alle zwölf öffentlichen Prüfketten auf exakt demselben Quellcommit bestanden; keine Übernahme älterer Produktbäume erforderlich.**

| Öffentliche Prüfkette | Ergebnis |
| --- | --- |
| [GR Synoptik - synchronize public DEV delivery](https://github.com/TheDaimos/gewitterradar/actions/runs/45150337632) | PASS |
| [GR TEST70-55 Unified Precipitation](https://github.com/TheDaimos/gewitterradar/actions/runs/45150333168) | PASS |
| [GR Synoptik Hi-Res Close - targeted DEV check](https://github.com/TheDaimos/gewitterradar/actions/runs/45150328332) | PASS |
| [P7-010 isolierte Raster-Mosaik-Abnahme](https://github.com/TheDaimos/gewitterradar/actions/runs/45150322948) | PASS |
| [GR TEST70-58 WR authority contracts](https://github.com/TheDaimos/gewitterradar/actions/runs/45150018832) | PASS |
| [V4.11.40 module consistency and Android map preservation](https://github.com/TheDaimos/gewitterradar/actions/runs/45150018716) | PASS |
| [TEST70-76 full repository 900-second audit](https://github.com/TheDaimos/gewitterradar/actions/runs/45150018838) | PASS |
| [V4.11.106 settings navigation and runtime identity](https://github.com/TheDaimos/gewitterradar/actions/runs/45150018655) | PASS |
| [Validate Gewitterradar integration](https://github.com/TheDaimos/gewitterradar/actions/runs/45150018677) | PASS |
| [GR Synoptik DEV - targeted regression](https://github.com/TheDaimos/gewitterradar/actions/runs/45150018874) | PASS |
| [GR Settings Vault DEV acceptance](https://github.com/TheDaimos/gewitterradar/actions/runs/45150018752) | PASS |
| [Validate shared Gewitterradar frontend](https://github.com/TheDaimos/gewitterradar/actions/runs/45150018638) | PASS |

[Maschinenlesbarer Quell-/CI-Nachweis](evidence/gr-v412-sources/ci-results.json), [neue Quellen-Browserergebnisse](evidence/gr-v412-sources/source-results.json). Die Gesamtkette führt auch Aura, Eye-Ränder, verzögerte Recovery, Vault und Neon-Pixelprüfungen erneut aus.

## Visuelle Nachweise

| Ansicht | Desktop | Android-Hochformat |
| --- | --- | --- |
| Glas 0 % | [Vorher](evidence/gr-v412-sources/desktop-before-glass-0.png) · [Nachher](evidence/gr-v412-sources/desktop-after-glass-0.png) | [Vorher](evidence/gr-v412-sources/android-before-glass-0.png) · [Nachher](evidence/gr-v412-sources/android-after-glass-0.png) |
| Glas 50 % | [Vorher](evidence/gr-v412-sources/desktop-before-glass-50.png) · [Nachher](evidence/gr-v412-sources/desktop-after-glass-50.png) | [Vorher](evidence/gr-v412-sources/android-before-glass-50.png) · [Nachher](evidence/gr-v412-sources/android-after-glass-50.png) |
| Glas 100 % | [Vorher](evidence/gr-v412-sources/desktop-before-glass-100.png) · [Nachher](evidence/gr-v412-sources/desktop-after-glass-100.png) | [Vorher](evidence/gr-v412-sources/android-before-glass-100.png) · [Nachher](evidence/gr-v412-sources/android-after-glass-100.png) |
| DWD/OPERA + NASA Regen/Schnee | [Vorher](evidence/gr-v412-sources/desktop-before-multiple.png) · [Nachher](evidence/gr-v412-sources/desktop-after-multiple.png) | [Vorher](evidence/gr-v412-sources/android-before-multiple.png) · [Nachher](evidence/gr-v412-sources/android-after-multiple.png) |
| Strukturiertes Info-Menü | [Vorher](evidence/gr-v412-sources/desktop-before-info.png) · [Nachher](evidence/gr-v412-sources/desktop-after-info.png) | [Vorher](evidence/gr-v412-sources/android-before-info.png) · [Nachher](evidence/gr-v412-sources/android-after-info.png) |
| Quellenlinks | [Nachher](evidence/gr-v412-sources/desktop-after-info-sources.png) | [Nachher](evidence/gr-v412-sources/android-after-info-sources.png) |
| Aktualität / eingeklappte Rohmetadaten | [Nachher](evidence/gr-v412-sources/desktop-after-info-timeliness.png) | [Nachher](evidence/gr-v412-sources/android-after-info-timeliness.png) |
| Vorschau horizontal | [Nachher](evidence/gr-v412-sources/desktop-after-preview-horizontal.png) | [Nachher](evidence/gr-v412-sources/android-after-preview-horizontal.png) |
| Vorschau vertikal | [Nachher](evidence/gr-v412-sources/desktop-after-preview-vertical.png) | [Nachher](evidence/gr-v412-sources/android-after-preview-vertical.png) |
| Mehrere vertikale Skalen | [Nachher](evidence/gr-v412-sources/desktop-after-multiple-vertical.png) | [Nachher](evidence/gr-v412-sources/android-after-multiple-vertical.png) |
| Einzelquelle mit Beschriftung | [Nachher](evidence/gr-v412-sources/desktop-after-single.png) | [Nachher](evidence/gr-v412-sources/android-after-single.png) |
| Beschriftung AUS | [Nachher](evidence/gr-v412-sources/desktop-after-caption-off.png) | [Nachher](evidence/gr-v412-sources/android-after-caption-off.png) |
| RY mit eigenen gültigen Farbklassen | [Nachher](evidence/gr-v412-sources/desktop-after-ry-valid.png) | [Nachher](evidence/gr-v412-sources/android-after-ry-valid.png) |
| RY ohne Farbmetadaten / Info-only | [Nachher](evidence/gr-v412-sources/desktop-after-ry-metadata-only.png) | [Nachher](evidence/gr-v412-sources/android-after-ry-metadata-only.png) |

Die Bilder verwenden das tatsächliche Frontend mit synthetischem HA-/WR-Transport. Vorher ist der unveränderliche V4.12.8-Baum, nachher der oben genannte Quellcommit. Android ist Chromium-Touch-Emulation, keine physische Geräteabnahme. Der RY-Fall A im Bild verwendet ausdrücklich synthetisch eingespeiste Testklassen; das Produkt ergänzt keine RY-Palette. Die originalen NASA-Farbtabellen bleiben unverändert.

## Installationspakete und DRA

[DEV-Prerelease V4.12.9](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.9-dev). Beide ZIPs sind byteidentisch mit den Linux-CI-Paketen aus [Lauf 45150018752](https://github.com/TheDaimos/gewitterradar/actions/runs/45150018752).

| Paket | Dateien | Bytes | SHA-256 |
| --- | ---: | ---: | --- |
| [gewitterradar-0.25.170-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.9-dev/gewitterradar-0.25.170-dev.zip) | 250 | 43532505 | `d4101a3080fef5aecffded557e792d5526077f8f50d3423960d5e6ea6ebfc42a` |
| [gewitterradar-dashboard-4.12.9-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.9-dev/gewitterradar-dashboard-4.12.9-dev.zip) | 233 | 42936526 | `c0fb3cc48f4ccde55b54e4963b8a0d0c781c7a80f11f8afc9e719ef4d4b283c4` |

[Deploymentmanifest](evidence/gr-v412-sources/deployment.json), [SHA-256-Inventar](evidence/gr-v412-sources/SHA256SUMS.txt), [vollständiger Original-Blobvergleich und Linux-Parität](evidence/gr-v412-sources/original-blob-verification.json).

Die kanonischen Pakete stammen aus originalen Git-Blobs ohne Windows-Zeilenendekonvertierung. CRC, vollständiger Blobvergleich und Bytegleichheit der 231 gemeinsamen Frontenddateien sind geprüft. Geschützte Hi-Res-Inhalte: 60 Identitäten, 61 Pfade und zwölf Metadatendateien erhalten. DRA-Vertrag einschließlich vollständigem Baum, Moduldeltas, Rollback-Konvergenz und Cache-Schutz bestanden. Für den neuen profilgebundenen Caption-Bool Integration und Frontend gemeinsam aktualisieren.

**Keine FINAL-Veröffentlichung.** Geschützte Tags V4.11.03 FINAL und Aura V4.12.3 sowie das freigegebene WR-/GR-Referenzpaar bleiben unverändert. WeatherRouter und VM101 wurden nicht verändert. Die reale Installation und Abnahme auf HA DEV VM109 und physischem Android übernimmt ausdrücklich der Betreiber. Es wird keine neue Betreiberfreigabe behauptet.

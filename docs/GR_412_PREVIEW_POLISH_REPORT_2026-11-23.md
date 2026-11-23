# Legend Hub UI-Feinschliff – V4.12.11 DEV

**Frontend 4.12.11 DEV / HA 0.25.172 · Runtime `41211r1` · Modulset `E412-11A1` · 37 Module.** Quellcommit `cf64b3352eaceefe99552573f23722712a47c66f`, Branch `deploy/dev`. Ausgangsstand `11a1376f` besitzt exakt die sechs geprüften Produkt-/Testbäume der V4.12.10-Quelle `98fd56b0`; vorhandene Dokumentation bleibt erhalten.

| Nachbesserung | Umsetzung |
| --- | --- |
| Icon-Zentrierung | Sichtbare Alpha-Konturen der fünf Originaldateien einmalig vermessen; quellenspezifische Mittelpunkte beim Erzeugen der Slots verwenden. Sechs Legenden einschließlich Advektion/Weitere, dynamisch/horizontal/vertikal; maximale gemessene Mittelpunktabweichung lokal 0,014 px. Ursprünglicher einheitlicher Motivmaßstab, Halo, Hauptsymbol und Eye-Metriken unverändert. Keine Pixelanalyse im Runtime-/Animationspfad. [Originalhashes und Konturen](evidence/gr-v412-polish/icon-bounds.json). |
| Kompakte Dialoge | Individuelle Dialoge maximal 780 statt 860 px, Hauptdialog maximal 500 px, kleinere Außen-/Spalten-/Labelabstände, Auswahlfelder maximal 180 px. Zwei Formularspalten ab tatsächlich verfügbaren 680 px; darunter eine. Native Auswahl und vollständige Texte erhalten, 44-px-Touchziele, keine horizontale Überbreite. Platinmaterial und Reflexionen bleiben bestehen. |
| Große Live-Vorschau | Ursache behoben: vor `showModal` war die verfügbare Breite null; die Niederschlagsberechnung gab −28 an den Renderer, der auf 60 px begrenzte. Jetzt zuerst anzeigen, den wirklichen Vorschau-Innenraum messen und vorhandenen Renderer benutzen. Optionales Vorschau-Längenbudget berücksichtigt S/M/L/XL; kein Transform-Scaling. Ein auf die Formularbreite begrenzter ResizeObserver erneuert ausschließlich die Vorschau und erhält Eingabefokus/Einstellungen. |
| Niederschlag nebeneinander | Nur innerhalb der Vorschau ab 640 px Innenbreite zwei gleiche Kacheln für DWD/OPERA und NASA-Regen, Schnee in voller Folgezeile. Auf schmalen Geräten drei breite Zeilen. Initial lokal 293/293/599 statt dreimal 60 px am Desktop, auf Android dreimal 280 px. Beschriftungen, Paletten, Quellenreihenfolge und tatsächliche Karteninstrumente unverändert. |
| Silber-Sortierpfeile | Vorhandenes Lossless-Hi-Res-Silber-Original wiederverwendet, für oben/unten gedreht. Zentrierte 44×44-px-Tasten, ursprüngliche deaktivierte Zustände, Sortier-/Drag-/Speicherhandler unverändert. Keine Grafik erzeugt oder kopiert. |

## Gezielte Prüfung

Tatsächliches Frontend mit kontrolliertem synthetischem HA-/WR-Transport: Desktop 1280×900, Tablet 1024×768 und Android-Hochformat 393×851. Sichtbare Erstvorschau, drei Quellen/lesbare Werte, Größen S/M/L/XL, drei Skalenstile, horizontal/vertikal, Breitenwechsel mit Fokus-/Inhaltserhalt, native Dropdowns, alle sechs Icon-Zentren, Klick/Tap und Maus-/emulierter Touch-Long-Press, Slottausch und Reload bestanden. Karteninstrument-Inhalt bleibt beim Öffnen/Verkleinern/Vergrößern der Vorschau identisch. [Lokale Messwerte](evidence/gr-v412-polish/polish-results.json), [öffentliche Linux-CI-Messwerte einschließlich V4.12.10-Vergleich](evidence/gr-v412-polish/public-polish-results.json).

Der [fehlerschließende Scope-Guard](evidence/gr-v412-polish/source-proof.json) schützt sämtliche unveränderten Modul-Funktionskörper nach expliziter Versions-/Cache-Normalisierung. Erlaubt sind nur drei Präsentationsmodule. Native Formular-/Hub-/Sortier-/Draghandler, Karten-Overlay-Renderer, wissenschaftliche Skalenberechnung ohne Vorschaumarker, Quellenmetadaten, Paletten, Eye, Aura und Vault-Verträge bleiben exakt erhalten. Acht öffentliche V4.12.10-Referenzketten werden für die unveränderten Körper nachweisbar wiederverwendet; nur der neue UI-Bereich erhält die gezielte Browserprüfung statt einer weiteren vollständigen Aura/Eye/WOW-Matrix. Alle übrigen Pflichtgates bleiben aktiv.

**Alle zwölf auf diesem Quellcommit ausgelösten öffentlichen Release-Gates erfolgreich.** [Frontend einschließlich gezielter UI-Prüfung](https://github.com/TheDaimos/gewitterradar/actions/runs/45203834028), [HA](https://github.com/TheDaimos/gewitterradar/actions/runs/45203833908), [Vault und Pakete](https://github.com/TheDaimos/gewitterradar/actions/runs/45203833982), [vollständige CI-Nachweise](evidence/gr-v412-polish/ci-results.json). Lokal zusätzlich Hub-/Quellenmodelle, 19 Sprachen, Aura-/FINAL-Isolation, Syntax/JSON/YAML, Versions-/Modul-/Spiegelparität, Hi-Res-Retention und DRA-Vollbaum/Delta/Rollback/Cache-Vertrag bestanden. Einmaliger finaler Frontend-Build; keine Installation neuer lokaler Abhängigkeiten.

## Repräsentative Ansichten

| Ansicht | Nachweis |
| --- | --- |
| Desktop, drei Quellen | [V4.12.10 vorher](evidence/gr-v412-polish/desktop-before-precipitation.png) · [V4.12.11 nachher](evidence/gr-v412-polish/desktop-after-precipitation.png) |
| Tablet und Android | [Tablet](evidence/gr-v412-polish/tablet-after-precipitation.png) · [Android-Vorschau](evidence/gr-v412-polish/android-after-precipitation.png) |
| Vertikale Windvorschau | [Desktop](evidence/gr-v412-polish/desktop-after-wind-vertical.png) |
| Hauptdialog und Silberpfeile | [Desktop](evidence/gr-v412-polish/desktop-after-hub-settings.png) · [Android](evidence/gr-v412-polish/android-after-hub-settings.png) |
| Zentrierte sechs Slotmotive | [Desktop](evidence/gr-v412-polish/desktop-after-hub-icons.png) |

Vorher aus unveränderlichem V4.12.10-Git-Baum; nachher aus dem genannten Quellcommit. Ansichten visuell kontrolliert. Tablet/Android sind Browseremulationen. Ein anfänglicher Test nutzte künstliche Pointer-Ereignisse ohne echte Pointer-Capture und öffnete deshalb keinen Long Press; der Test verwendet jetzt tatsächliche Maus- bzw. CDP-Touch-Ereignisse und besteht. Keine entsprechende Produktänderung erforderlich.

## Installierbare DEV-Pakete

[DEV-Prerelease V4.12.11](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.11-dev).

| Paket | Dateien | SHA-256 |
| --- | ---: | --- |
| [gewitterradar-0.25.172-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.11-dev/gewitterradar-0.25.172-dev.zip) | 250 | `e28def9ec0d796996c1b30081e49d3f4baf7d4886f0dec3d1cf1bec2deaf4905` |
| [gewitterradar-dashboard-4.12.11-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.11-dev/gewitterradar-dashboard-4.12.11-dev.zip) | 233 | `b86712e999d36a18043656de6b8a5905ee65a2a3f981c5c701034e3efc322d03` |

Beide ZIPs aus ursprünglichen Git-Blobs ohne Windows-Zeilenendekonvertierung, CRC und jede Nutzdatei vollständig geprüft; bytegleich mit Linux-CI. 231 gemeinsame Frontenddateien identisch. [Deploymentmanifest](evidence/gr-v412-polish/deployment.json), [Prüfsummen](evidence/gr-v412-polish/SHA256SUMS.txt), [Original-Blob-/CI-Abgleich](evidence/gr-v412-polish/original-blob-verification.json). DRA-Quelle bleibt `TheDaimos/gewitterradar` / `deploy/dev`.

Keine FINAL-Veröffentlichung. V4.11.03 FINAL, Aura V4.12.3 und vorhandene Referenzpaare bleiben geschützt; keine neue Betreiberfreigabe. WeatherRouter und VM101 unverändert. Installation und physische VM109-/Android-Abnahme übernimmt der Betreiber.

# Legend Hub / Eye Control – V4.12.12 DEV

**Frontend 4.12.12 DEV / HA 0.25.173 · Runtime `41212r1` · Modulset `E412-12A1` · 37 Module.** Quellcommit `707e7c15adf6ab303b7f7b318c4e022c091944a4`, Branch `deploy/dev`. Ausgangs-HEAD `33631a67` hat dieselben sechs Produkt-/Testbäume wie die geprüfte V4.12.11-Quelle `cf64b335`.

| Punkt | Ergebnis |
| --- | --- |
| Visuelle Farb-/Materialwahl | Fünf metallische Materialbalken und sieben erkennbare Farbflächen einschließlich neutraler Automatik. Lokalisierter Name ergänzt jeden Balken; Auswahl auch im geschlossenen Feld sichtbar. Erweiterung der bisherigen Dekoration durch native Details/Radioelemente; keine neue Dropdown-Engine oder Zustandsverwaltung. Der originale Select und unveränderte Change-/Vault-Speicherpfad bleiben erhalten. Tastatur, Fokus-Rückgabe, Escape ohne Dialogschließen, Touch und deaktivierte Auswahl unterstützt. |
| Schmalere Dialoge | Maximal 624 statt 780 px: genau 20 % schmaler. Weniger Außen-/Label-/Spaltenabstand und maximal 140 px breite Auswahlfelder. Zwei Spalten ab tatsächlich verfügbaren 560 px, Smartphone einspaltig. Geöffnete Balkenauswahl nutzt die Formularbreite; keine abgeschnittenen Texte, horizontalen Scrollbalken oder verkleinerten Touchziele. Niederschlagsvorschau ab 520 px Innenbreite weiter zweispaltig, darunter breite Zeilen. Numerischer Vorschau-/Kartenrenderer unverändert. |
| Synoptik bereinigt | Sechs wirkungslose Felder werden über die gemeinsame Capability-Abfrage nicht mehr erzeugt: Dichte, Skalenstil, Strichmaterial, Zahlenposition, Tickposition und native Balken-/Klassenansicht. Neun nutzbare Felder bleiben: Darstellung, Ausrichtung, Größe, Textfarbe, Titel, Kontrastautomatik, Schatten, Kontur und Sichtbarkeit. Kein CSS-Verstecken, keine Löschung gespeicherter Werte; bisheriger Vorschauhinweis, Erklärung und Kartenlegende bleiben erhalten. |
| Aura-Goldrahmen | Bestehender zweipixeliger Welcome-/Eye-Premium-Metallrahmen mit denselben Reflexions-/Goldverläufen und Schatten. Ausschließlich der vorhandene Aura-Farbabschnitt erhält eine Rahmenklasse und wird in den bestehenden Selektor aufgenommen. Alle bisherigen Gold-CSS-Deklarationen sowie der gesamte Eye-Code nach Rücknormalisierung dieser einen Klasse sind exakt gleich. Auswahlwerte, Persistenz, Pointer und Farblogik unverändert. |

## Gezielte Nachweise

Ein kompakter Frontend-Smoke auf Desktop 1280×900, Tablet 1024×768 und Android-Hochformat 393×851: Niederschlag, Wind, Temperatur und Synoptik; 1/2 Formularspalten, breite Erstvorschauen, alle Material-/Farboptionen, Live-Übernahme, native Tastatur-/Touch-Auswahl, Fokus, Escape, deaktivierter kategorischer Materialwähler, Synoptik-Altwerte, unveränderter Synoptik-Karteninhalt, Aura-Farbauswahl und Reload bestanden. Tablet/Android sind Browseremulationen mit synthetischem HA-/WR-Transport. [Lokale Messwerte](evidence/gr-v412-swatch/swatch-results.json), [öffentliche Linux-CI-Messwerte](evidence/gr-v412-swatch/public-swatch-results.json).

[Strikter Quellschutz](evidence/gr-v412-swatch/source-proof.json): alle nativen Formular-/Hub-/Slot-/Drag-/Speicherhandler, numerischen Renderer, Karteninstrumente, Wetterdaten-/Layerpfade, Eye/Aura-Logik, Farbwerte, Vault-Schlüssel, Profile und Grafikdateien unverändert. Lediglich Formular/Dekoration und zwei eng begrenzte Rahmen-Zuordnungen angepasst. Beim bestehenden Aura-Snapshot wird ausschließlich der neue Section-Klassenname zurücknormalisiert; jede weitere Abweichung bleibt ein Fehler. Der generierte Runtime-Manifest ist Versionsmetadatum, keine neue Grafik.

**Alle zwölf auf diesem Quellcommit ausgelösten öffentlichen Pflichtketten grün.** [Frontend einschließlich gezieltem Menütest](https://github.com/TheDaimos/gewitterradar/actions/runs/45224108691), [HA](https://github.com/TheDaimos/gewitterradar/actions/runs/45224108708), [Vault/Pakete](https://github.com/TheDaimos/gewitterradar/actions/runs/45224108794), [sämtliche aktuellen und zwölf wiederverwendeten V4.12.11-Referenzketten](evidence/gr-v412-swatch/ci-results.json). Der fehlerschließende Scope-Guard begründet die Wiederverwendung ausschließlich für unveränderte Körper; nur geänderte UI wird gezielt erneut geprüft. Keine weitere vollständige lokale Wetter-/Eye-/Provider-Browsermatrix. Lokal zusätzlich Syntax, Hub-/Quellenmodelle, 19 Sprachen, Aura-/FINAL-Isolation, Hi-Res-Retention, Modul-/Spiegelidentität und DRA-Vollbaum/Delta/Rollback/Cache-Vertrag bestanden. Einmaliger finaler Build, keine neuen lokalen Abhängigkeiten.

## Repräsentative Ansichten

| Ansicht | Vergleich / Ergebnis |
| --- | --- |
| Materialwahl und Breite | [Desktop vorher](evidence/gr-v412-swatch/desktop-before-wind.png) · [Nachher](evidence/gr-v412-swatch/desktop-after-material.png) · [Tablet](evidence/gr-v412-swatch/tablet-after-material.png) · [Android](evidence/gr-v412-swatch/android-after-material.png) |
| Textfarben | [Alle Balken](evidence/gr-v412-swatch/desktop-after-text-colors.png) |
| Synoptik | [Desktop](evidence/gr-v412-swatch/desktop-after-synoptic.png) · [Android](evidence/gr-v412-swatch/android-after-synoptic.png) |
| Aura-Rahmen | [Vorher](evidence/gr-v412-swatch/desktop-before-aura.png) · [Original-Premiumrahmen nachher](evidence/gr-v412-swatch/desktop-after-aura.png) |

Vorher aus unveränderlichem V4.12.11-Git-Baum; nachher aus dem genannten Quellcommit. Layouts visuell kontrolliert. Physische VM109-/Android-Abnahme und Installation übernimmt wie vereinbart der Betreiber.

## Installierbare DEV-Version

[DEV-Prerelease V4.12.12](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.12-dev).

| Paket | Dateien | SHA-256 |
| --- | ---: | --- |
| [gewitterradar-0.25.173-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.12-dev/gewitterradar-0.25.173-dev.zip) | 250 | `99b840442fe2cd4e18a97f6c3b8a6b3a39cb1bf631e77936c95eba46e7d74fa1` |
| [gewitterradar-dashboard-4.12.12-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.12-dev/gewitterradar-dashboard-4.12.12-dev.zip) | 233 | `d6a1a8a03f4777ca361cb37cbe7962dfe97fd56fd24de66c519697030dea0b2e` |

Originale Git-Blobs ohne Windows-Zeilenendekonvertierung, CRC und jede ZIP-Nutzdatei vollständig geprüft. Beide Pakete bytegleich mit Linux-CI; 231 gemeinsame Frontenddateien identisch. [Deploymentmanifest](evidence/gr-v412-swatch/deployment.json), [Prüfsummen](evidence/gr-v412-swatch/SHA256SUMS.txt), [Original-Blob-/CI-Abgleich](evidence/gr-v412-swatch/original-blob-verification.json). DRA unverändert `TheDaimos/gewitterradar` / `deploy/dev`.

DEV, keine FINAL-Veröffentlichung. V4.11.03 FINAL, Aura V4.12.3 und vorhandene Referenzpaare bleiben geschützt. WeatherRouter und VM101 unverändert; keine neue Betreiberfreigabe behauptet.

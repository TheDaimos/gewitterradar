# Legend Hub – Positionsstabilität und Compact Glass · V4.12.13 DEV

**Frontend 4.12.13 DEV / HA 0.25.174 · Runtime `41213r1` · Modulset `E412-13A1` · 37 Module.** Quellcommit `2557a7394060be686456597484d9779179ec6e59`, Branch `deploy/dev`. Ausgangs-HEAD `60da476a` besitzt exakt die geprüften Produkt-/Testbäume der V4.12.12-Quelle `707e7c15`.

## P1: Benutzerposition bleibt maßgeblich

Der öffentliche historische Vergleich weist unter V4.12.12 manuelle Positionsverdrängungen von rund 95 bzw. 139 px nach. Im neuen Lauf bleiben die geprüften Positionen in allen drei Viewports bei den wiederholten Updates unverändert.

Die bisherige `place()`-Funktion suchte bei jedem Layoutsignal erneut eine freie Position, einschließlich anderer geöffneter Legenden als Hindernisse. Jetzt wird eine akzeptierte Platzierung je Instrument gespeichert. Nur eine noch nicht positionierte Erstöffnung darf den bisherigen Solver verwenden. Vorhandene native Positionsspeicher, explizite Positionsvorgaben und abgeschlossene Drags haben Vorrang. Zwei, drei oder sechs Legenden dürfen bewusst eng und überlappend stehen; ein anderes Instrument verdrängt sie nicht.

Daten-/Messwertupdates, Info-Popup, Sichtbarkeitswechsel, gleiche Containermaße und Kontrollmutationen starten keine neue Kollisionssuche. Unveränderte Koordinaten erzeugen keine erneuten `left`-/`top`-Schreibvorgänge. Tatsächliche Flächen-/Darstellungskonfigurationsänderungen begrenzen nur die vorhandene Position; deutlich außerhalb liegende Instrumente werden zurückgeholt. Kein gegenseitiges Ausweichen nach Rotation. Während Drag bleibt der automatische Pfad gesperrt. Bestehende Pointer-/Touch-/Joe-Binder und ihre Recovery bleiben exakt erhalten.

Native Positionsschlüssel und normalisierte Koordinaten bleiben unverändert. Die bereits existierenden Speicher erlauben die Unterscheidung unpositionierter Erstöffnungen von gespeicherten Wünschen; kein neuer Positionsspeicher und keine Profilmigration. Profilwechsel erfolgt weiterhin über den tatsächlichen Vault-Client und den bisherigen Reload-/Neuaufbaupfad.

## Premium, Glas und Rahmen

| Variante / Option | Ergebnis |
| --- | --- |
| Premium | Zweipixelige Platin-Metallfassung mit dem vorhandenen reflektierenden Verlauf, kräftigerer Hintergrund, größere Innenabstände und stärkerer Schatten. |
| Compact Glass | Schlankere Abstände/Rundung, zurückhaltender Schatten und separat konfigurierbare Füllung. Skalen, Messwerte und 44-px-Infoziel bleiben vollständig deckend und bedienbar. |
| Glasdeckkraft | 0–100 %, je Legende; bei 0 auch kein Blur. Live-Eingabe ändert gezielt die Hintergrundfläche, keine Container-Opacity. Glas-/Rahmenwerte werden im vorhandenen Legend-Hub-Vault-Zweig gespeichert. |
| Rahmen | Sichtbar an/aus, Premium Platin oder Premium Gold; Originalverläufe aus bestehenden akzeptierten Oberflächen. Eigene maskierte Konturebene, unabhängig von Glasdeckkraft. Fein 0,8 / Mittel 1,5 / Kräftig 2,5 px verändern die Kontur, nicht Padding oder Außenmaße. |
| Glaswirkung | Klar, leicht milchig oder Frosted Glass; vorhandener Backdrop-Blur mit abgestuften Radien und sinnvoller Kopplung an die Deckkraft. Keine neue Rendering-Engine. |
| Vorschau | Dieselbe Oberflächenfunktion für Karteninstrument und bestehende große Live-Vorschau. Innenraum vor dem Vermessen berücksichtigen; responsive Quellenkacheln, Skalen und Werte bleiben lesbar. Compact-Felder nur bei Compact Glass; Premium erhält keine funktionslosen Zusatzfelder. |
| Premium-Swatches | Alle fünf Material-, sieben Textfarb- und beide Rahmenmaterialoptionen verwenden symmetrisch Grundton → aufgehellten Grundton → Grundton. Breiter, weicher Mittelreflex ohne weiße Streifen, Schwarz mit anthrazitfarbener Mitte, neutrale Automatik. Nur Legendendialog-Dekoration; tatsächliche gewählte Farben und meteorologische Skalen unverändert. |

Fünf additive Optionen (`glassOpacity`, `frameVisible`, `frameMaterial`, `frameWeight`, `glassEffect`) mit kompatiblen Standards und strikter Typ-/Bereichsprüfung. Je Legende getrennt, keine entfernten Schlüssel; 19 vollständige Sprachvarianten. Ein im gezielten Test entdeckter String-/Zahl-Fehler beim nativen Range-`change` wurde vor Veröffentlichung korrigiert.

## Nachweise und Schutz

- Tatsächliches Frontend mit synthetischem authentifiziertem HA-/WR-/Vault-Transport: Desktop 1280×900, Tablet 1024×768 und Android-Hochformat 393×851. Echte Maus-/CDP-Touch-Drags aller sechs Legenden; zwei/drei/sechs nahe beziehungsweise überlappende Instrumente. Wiederholte Datenupdates ohne Positionsänderung, Info öffnen/schließen/ziehen, Layerlegende aus/ein, Kartenposition/-zoom unverändert, Rand/Rotation mit anschließender Ruhe. Alle sechs nativen Positionsspeicher nach Reload sowie zwei voneinander unabhängige echte Vault-Profile auf Desktop/Android geprüft. [Lokale Ergebnisse](evidence/gr-v412-glass/glass-results.json), [öffentliche Ergebnisse einschließlich Vorher-Diagnose](evidence/gr-v412-glass/public-glass-results.json).
- Deckkraft 0/50/100, unabhängiger Rahmen, beide Metalle, drei Konturstärken bei konstanten Außenmaßen, Rahmen aus/ein, drei Glaswirkungen, große Live-Vorschau und mobile Formularbreite bestanden. Öffentliche UI-Prüfung bestätigt identische Verlaufsenden und aufgehellte Mitte sämtlicher fünf Material- und sieben Textfarbbalken.
- [Fehlerschließender Scope-Guard](evidence/gr-v412-glass/source-proof.json): alle Eye-/Aura-Funktions- und Stylekörper, gemeinsame Skeleton-/Premium-Styles, vollständiger gemeinsamer Touch-Binder sowie numerische Skalen, Paletten, Wetterrenderer und WR-Verträge exakt unverändert. Ausschließlich regulär erzeugte Release-/Import-/Modulmetadaten werden beim Körpervergleich normalisiert. Vault-Schema ausschließlich im Legend-Hub-Zweig erweitert, Eye-Schema unverändert. Keine Grafik generiert oder Originaldatei verändert.
- Hub-/Quellenmodelle, neue Glas-/Altprofil-/Enum-/Lokalisierungstests, echte Python-Vault-Validierung einschließlich ungültiger Werte, Aura-/FINAL-Isolation, Syntax/JSON/YAML, Modul-/Spiegelidentität, Hi-Res-Retention und DRA-Vollbaum/Delta/Rollback/Cache-Vertrag bestanden. Einmaliger finaler Build; keine neuen lokalen Abhängigkeiten.

**Alle zwölf Pflichtketten nachgewiesen: vier neu auf dem finalen Quellcommit grün und acht grüne Läufe auf dem produktgleichen Implementierungscommit `d507b25c`. Zwischen beiden Commits änderten sich ausschließlich Tablet-Testfixture und Arbeitsnotiz; Produktbäume und übrige Gate-Skripte exakt identisch.** [Frontend inklusive neuer funktionaler Positions-/Glasprüfung](https://github.com/TheDaimos/gewitterradar/actions/runs/45241406294), [HA](https://github.com/TheDaimos/gewitterradar/actions/runs/45241406181), [Vault/Pakete](https://github.com/TheDaimos/gewitterradar/actions/runs/45238384927), [vier aktuelle, acht produktgleiche sowie zwölf ältere V4.12.12-Referenzketten](evidence/gr-v412-glass/ci-results.json). Wiederverwendung nur für exakt unveränderte Funktionskörper; keine ausgelassene P1-Prüfung. Keine weitere vollständige lokale Wetter-/Aura-Matrix.

## Repräsentative Vergleiche

| Ansicht | Nachweis |
| --- | --- |
| Enge Positionen | [V4.12.12 vorher](evidence/gr-v412-glass/desktop-before-position.png) · [Stabile bewusste Überlappung](evidence/gr-v412-glass/desktop-after-position.png) |
| Premium und Compact auf derselben Karte | [Desktop](evidence/gr-v412-glass/desktop-after-compact.png) · [Android](evidence/gr-v412-glass/android-after-compact.png) |
| Rahmen und Glasvorschau | [Desktop](evidence/gr-v412-glass/desktop-after-glass-preview.png) · [Android](evidence/gr-v412-glass/android-after-glass-preview.png) |
| Legenden-Swatches | [Vorher](evidence/gr-v412-glass/desktop-before-colors.png) · [Textfarben nachher](evidence/gr-v412-glass/desktop-after-premium-colors.png) · [Materialien nachher](evidence/gr-v412-glass/desktop-after-premium-materials.png) |

Der erste öffentliche Lauf bestand auf Desktop, traf im Tablet-Aufbaudrag jedoch keinen wirksamen Greifpunkt. Die Testfixture prüft nun den tatsächlichen Shadow-DOM-Trefferpunkt und stabile Kartenmaße; Zielanker und Positionsassertions unverändert. Betroffenen Tabletfall lokal sowie vollständigen öffentlichen Lauf erfolgreich wiederholt. Ein zweiter schneller CI-Lauf wies einen Profilwechsel bei noch offenen Fixture-Änderungen korrekt mit `settings_pending` zurück. Der Test wartet nun vor jedem Wechsel auf die echte Vault-Speicherbarriere und erzwingt als Gegenprobe fünf Sekunden Speicheraufschub. Betroffene lokale Fälle und vollständiger öffentlicher Lauf anschließend bestanden. Keine Änderung am Produkt oder Vault-Client; kein weiterer Frontend-Build.

Vorher aus unveränderlichem V4.12.12-Git-Baum; nachher aus genanntem Quellcommit. Layouts visuell kontrolliert. Tablet/Android sind Emulationen. Physische VM109-/Android-Abnahme und Installation übernimmt wie vereinbart der Betreiber.

## Installierbare DEV-Version

[DEV-Prerelease V4.12.13](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.13-dev).

| Paket | Dateien | SHA-256 |
| --- | ---: | --- |
| [gewitterradar-0.25.174-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.13-dev/gewitterradar-0.25.174-dev.zip) | 250 | `fbc212ea7cb83795bbd014f5104d77cc25c2fd7dd530a6bdf19292c77d48f79c` |
| [gewitterradar-dashboard-4.12.13-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.13-dev/gewitterradar-dashboard-4.12.13-dev.zip) | 233 | `d35c191ce946b9c62b02ac7db398802b115cbbeb680a621225cd7f43565078b9` |

Jede Nutzdatei gegen originale Git-Blobs ohne Windows-Zeilenendekonvertierung, CRC und SHA-256 geprüft. Beide ZIPs bytegleich mit Linux-CI, 231 gemeinsame Frontenddateien identisch. [Deploymentmanifest](evidence/gr-v412-glass/deployment.json), [Prüfsummen](evidence/gr-v412-glass/SHA256SUMS.txt), [vollständiger Original-Blob-/CI-Abgleich](evidence/gr-v412-glass/original-blob-verification.json). DRA unverändert `TheDaimos/gewitterradar` / `deploy/dev`.

DEV, keine FINAL-Veröffentlichung oder neue Betreiberfreigabe. V4.11.03 FINAL, Aura V4.12.3, aktuelle Eye-/Aura-Referenz und vorhandene Referenzpaare geschützt. WeatherRouter und VM101 unverändert.

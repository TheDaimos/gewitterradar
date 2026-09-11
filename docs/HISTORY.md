# Gewitterradar – Projektgeschichte

Dieses Dokument fasst die Entwicklungslinie zusammen, die für den gemeinsamen Produktstand von Dashboard-Karte und nativer Home-Assistant-Integration relevant ist. Technische Einzelschritte bleiben zusätzlich im `CHANGELOG.md` und in den spezialisierten Dokumenten unter `docs/` nachvollziehbar.

## Zeitachse

Das Gewitterradar-Projekt begann **2026/08**. Die sichtbaren V3.x-Meilensteine der Release History gehören deshalb zur Entwicklungsphase `2026/08`. Die erste stabile V4.00 und die darauf folgenden öffentlichen V4.01 bis V4.06 gehören zur Release-Phase `2026/09`.

Seit V4.06 ist die Monatskennung Teil des verbindlichen Releaseformats: Der aktuelle Stand wird als `YYYY/MM · Vx.xx` dargestellt, historische Einträge als `Vx.xx · YYYY/MM`. Der vollständige Ablauf ist in `docs/RELEASE_PROCESS.md` festgeschrieben.

## V4.05 · 2026/09 – eingefrorene visuelle Referenz

V4.05 wurde als geschützte visuelle Ausgangsbasis für die weitere Produktkonvergenz eingefroren. Die öffentliche V4.05 führte das Premium-Erlebnis **„Über Gewitterradar“** mit First-Start-Onboarding, wieder aufrufbarem Informationsdialog und der persönlichen Widmung **„Für Alkje“** ein. Besonders geschützt sind außerdem Hero- und Widmungsdarstellung, Radien-Semantik, Recorder-Hinweis sowie das Onboarding-Verhalten.

Aus diesem Stand wurden die freigegebenen Premium-Bedienelemente übernommen. Das betrifft insbesondere das metallische Schließen-X und die Schriftrolle für Kopieraktionen. Diese Grafiken werden nicht neu gezeichnet, sondern als freigegebene Originale wiederverwendet.

## V4.06 · 2026/09 – ein Produkt, zwei Auslieferungsformen

Mit V4.06 wird Gewitterradar fachlich und technisch als ein gemeinsames Produkt gepflegt. Die gemeinsame Frontend-Quelle wird deterministisch in zwei Auslieferungsformen erzeugt:

- native Home-Assistant-Integration;
- Dashboard-/Lovelace-Auslieferung.

Abweichungen des gemeinsamen Frontends, der Assets oder der Prüfsummen zwischen beiden Auslieferungsformen gelten als Fehler. Die Build- und Prüfkette rekonstruiert beide Varianten aus derselben Quelle und vergleicht sie bytegenau.

## V4.06 – Internationalisierung und Hilfe

Der About-/Hilfe-Bereich umfasst **15 Sprachen plus 4 Dialektvarianten – insgesamt 19 Sprachvarianten**. Nicht native Sprachpakete werden als gemeinsames, verzögert geladenes Locale-Modul bereitgestellt. Deutsch und Englisch bleiben direkt verfügbar; unbekannte oder unvollständige Sprachpakete fallen kontrolliert auf Englisch zurück.

Der Dialog **„Hilfe & Hinweise“** erklärt Voraussetzungen, Radien, Referenzstandort, wichtige Funktionen, empfohlene Grundeinstellungen, Fehlerdiagnose und Home-Assistant-Recorder. Die Recorder-Beispiele verwenden Wildcards für mehrere Blitzortungsgeräte bzw. Beobachtungspunkte.

## V4.06 – Premium-Oberfläche und reale Geräteabnahme

Die V4.06-Feinabstimmung wurde wiederholt auf Desktop, Android, iPad und iPad Pro geprüft. Dabei wurden nur gezielte Änderungen vorgenommen; bereits abgenommene Bereiche wurden nicht unnötig umgebaut.

Wesentliche Ergebnisse:

- kräftigere, metallisch schillernde Rahmen für Einstellungen und Hilfe;
- harmonisierte Premium-Schließen-Schaltflächen;
- freigegebene Schriftrolle für Recorder-Kopieraktionen;
- Zahnrad aus der Welcome-Gestaltung auch in Hauptansicht und Hilfe;
- stabilisierte Icon-Ausrichtung in **„Hilfe & Hinweise“**;
- vergrößertes Haus-Symbol bei **„Voraussetzungen“**;
- verbesserte Chevron-Ausrichtung und Abschnittshierarchie;
- mobile Widmung mit eigenem Hochformat-Textfluss;
- persönliche Signatur aus den Einstellungen unverändert auch im Welcome-Footer;
- finale Welcome-Kennung `2026/09 · V4.06 · Gewitterradar · by CK`;
- Settings-Kennung `2026/09 · V4.06` im unteren linken Freiraum;
- Release-History-Kopf `2026/09 · V4.06` und datierte Historieneinträge;
- gerätespezifische Footer-Feinabstimmung für Android sowie iPad/iPad Pro;
- um etwa 25 % vergrößerte und vertikal zentrierte Wertefelder `70 KM`, `30 KM`, `5 KM`;
- iPad-/iPad-Pro-Fokusartefakte am About-X und am Dialog selbst beseitigt, ohne das freigegebene X zu verändern.

## V4.06 – griechischer Hochformat-Sonderfall

Bei der realen Android-Hochformatprüfung zeigte die griechische About-Überschrift einen speziellen Layoutfall: Der längere Untertitel kollidierte mit dem darunter platzierten Spruch.

Die griechischen Texte bleiben unverändert. Stattdessen erhält ausschließlich **Griechisch + mobiles Hochformat** einen echten Textfluss im Kopfbereich: Der Spruch folgt dem Untertitel in einer eigenen Grid-Zeile und kann diesen dadurch nicht mehr überdecken. Für diesen Sonderfall wurde zusätzlich eine Browser-Regression eingeführt.

Die anschließende reale Sichtprüfung auf Android im Hochformat wurde erfolgreich abgeschlossen; der korrigierte griechische Kopfbereich ist damit sowohl automatisiert als auch auf dem Zielgerät abgenommen.

## V4.06 – finaler Recorder-Sprachaudit

Nach der Geräteabnahme wurde der Recorder-Bereich nochmals separat über alle **19 registrierten Sprachvarianten** geprüft. Bestätigt wurden exakt vier aktuelle Recorder-Wildcards, die Merge-Anweisung für eine vorhandene `recorder:`-Sektion, der Erhalt der Live-Zustände, das Verhalten vorhandener historischer Daten und die Mehrgeräte-/Mehrbeobachtungspunkt-Unterstützung unabhängig vom Entity-Präfix.

Der Audit ergab keinen erforderlichen Übersetzungsumbau und ist mit `scripts/test-recorder-locales.mjs` als eigener fail-closed CI-Test abgesichert. Details stehen in `docs/RECORDER_LOCALE_AUDIT_V4_06.md`.

## V4.06 – Release History vervollständigt

Die sichtbare Release History enthält ab V4.06 wieder lückenlos die öffentliche V4-Reihe einschließlich der zuvor fehlenden **V4.05**. V4.00 bis V4.06 sind `2026/09` zugeordnet; die sichtbaren V3.x-Entwicklungsmeilensteine sind `2026/08` zugeordnet.

Als nächster Entwicklungswunsch ist **V4.07 · PLANNED – Worldwide location search / Weltweite Orts-Suche** vorgemerkt. Diese Funktion ist ausdrücklich Planung und kein Bestandteil von V4.06.

## Qualitätssicherung und Freeze

V4.06 wird durch deterministischen Frontend-Neubau, SHA-/Asset-Parität, Browserprofile, Sprachschema- und Locale-Prüfungen, Recorder-Sprachaudit, Home-Assistant-Laufzeittests, HACS, Hassfest, Paketverträge und reale Geräteabnahme abgesichert.

Nach Abschluss des finalen Release-Laufs wird der exakt geprüfte V4.06-Commit eingefroren. Bereits veröffentlichte V4.05- und frühere Rückfallpunkte bleiben unverändert.

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

Als nächster Entwicklungswunsch war **V4.07 · PLANNED – Worldwide location search / Weltweite Orts-Suche** vorgemerkt. Diese Planung wurde anschließend auf dem V4.07-Feature-Branch umgesetzt und ist damit historisch überholt; V4.06 selbst bleibt davon unverändert.

## V4.07 · 2026/09 – weltweite Standortarchitektur

V4.07 erweitert das gemeinsame Produkt um einen dynamischen Gewitterradar-Bezugsstandort und eine weltweite Ortssuche. Der Standortwechsel bleibt bewusst von der tatsächlichen Blitzdatenregion getrennt: Karte, Radien, Entfernungen, Kompass und Bewertung verwenden den Gewitterradar-Bezugsstandort, während die separat installierte Blitzortung-Integration ihre Datenregion nach eigener Bewegungs- und Abonnementlogik nachführt.

Zum V4.07-Funktionsumfang gehören inzwischen:

- weltweite Orts-/PLZ-Suche mit Open-Meteo und kontrolliertem Nominatim-Rückfall;
- lokale Länder-Autovervollständigung und Ländergruppierung der Treffer;
- Gewitterradar-eigener dynamischer GPS-Tracker;
- separater Dashboard-Tracker für parallele Testkoexistenz;
- gespeicherte Orte über Local-To-do;
- `★` Speichern, reversibles `×` Entfernen und `↶` Wiederherstellen;
- automatische Kartenfokussierung nach `Nutzen`;
- dokumentierter halbautomatischer Blitzortung-Einrichtungsweg über `Location entity`;
- DE/EN-Umschalter in der Release History;
- umfassende Hilfe zu externen Diensten, Firewall-/Netzwerkpfaden und Diagnose;
- Premium-Hilfe-Icons und deterministische Hervorhebungen für Netzwerk-, Dienst- und Entity-Bezeichner;
- vollständige V4.07-Sprachmatrix mit 15 Sprachen und 4 deutschen Dialektvarianten.

## V4.07.31 – Near-Final-Testkandidat

Am 14.09.2026 erreicht V4.07 mit **V4.07.31** einen internen Reifegrad von ungefähr **95 %**. Diese Prozentangabe ist eine Projektabschätzung und keine öffentliche Release-Zusage.

V4.07.31 schließt insbesondere die letzte bekannte strukturelle Lücke in **„Hilfe & Hinweise“**: Deutsch und Englisch bleiben nativ, 17 weitere Varianten werden aus dem externen Locale-Modul geladen, und Boarisch, Plattdüütsch, Sächs’sch sowie Schwäbisch erben keine großen Standarddeutsch-Hilfeblöcke mehr. Ein eigener fail-closed Regressionstest schützt diesen Zustand.

Deterministische Identität des Near-Final-Kandidaten:

- Haupt-JavaScript: **1.779.464 Bytes**, SHA256 `2d13746361d52af29be279f0c273d7fc3ca381a531a82f26efe8c82f3a871b31`;
- externes Locale-Modul: **401.387 Bytes**, SHA256 `898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb`;
- vollständiges Actions-Artefakt `v407-test31-complete`: **2.238.710 Bytes**, ZIP-SHA256 `91f4e615029040c1f01498355071871c693c771c5bf9d82efadc1586cf9d6917`.

Der V4.07.31-spezifische Kandidatenlauf sowie HACS-Integration, Paketvertrag, Hassfest und Home-Assistant-2026.9.0-Laufzeittests sind erfolgreich. Vor einer öffentlichen V4.07-Freigabe bleiben bewusst reale Endgeräte-/Sprachprüfungen, Blitzortung-Datenregions-/Restart-/Latenzprüfungen, Netzwerk-/Filterverprobung soweit verfügbar und der finale Release-Freeze mit synchronisierten Auslieferungsformen offen.

Die vollständige Near-Final-Dokumentation steht in `docs/RELEASE_NOTES_V4_07_31_TEST.md`. Die detaillierte TEST1–TEST30-Historie bleibt separat in `docs/RELEASE_NOTES_V4_07_TEST.md` erhalten.

## Qualitätssicherung und Freeze

V4.06 wird durch deterministischen Frontend-Neubau, SHA-/Asset-Parität, Browserprofile, Sprachschema- und Locale-Prüfungen, Recorder-Sprachaudit, Home-Assistant-Laufzeittests, HACS, Hassfest, Paketverträge und reale Geräteabnahme abgesichert.

V4.07 übernimmt diese Grundsätze und ergänzt sie um die deterministische Kandidatenkette, Standort-/Blitzdatenregion-Trennung, Provider-/Netzwerkinventar, Saved-Places-Regressionsschutz sowie die vollständige 19-Varianten-Hilfeprüfung.

V4.06 bleibt bis zum ausdrücklich akzeptierten und eingefrorenen V4.07-Release unverändert die öffentliche Rückfallbasis. Erst der exakt final geprüfte V4.07-Commit darf als Release-Tag/Fallbackpunkt festgeschrieben werden.

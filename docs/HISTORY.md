# Gewitterradar – Projektgeschichte

Dieses Dokument fasst die Entwicklungslinie zusammen, die für den gemeinsamen Produktstand von Dashboard-Karte und nativer Home-Assistant-Integration relevant ist. Technische Einzelschritte bleiben zusätzlich im `CHANGELOG.md` und in den spezialisierten Dokumenten unter `docs/` nachvollziehbar.

## V4.05 – eingefrorene visuelle Referenz

V4.05 wurde als geschützte visuelle Ausgangsbasis für die weitere Produktkonvergenz eingefroren. Besonders geschützt sind der Dialog **„Über Gewitterradar“**, die Widmung **„Für Alkje“**, Hero- und Widmungsdarstellung, Radien-Semantik, Recorder-Hinweis sowie das Onboarding-Verhalten.

Aus diesem Stand wurden die freigegebenen Premium-Bedienelemente übernommen. Das betrifft insbesondere das metallische Schließen-X und die Schriftrolle für Kopieraktionen. Diese Grafiken werden nicht neu gezeichnet, sondern als freigegebene Originale wiederverwendet.

## V4.06 – ein Produkt, zwei Auslieferungsformen

Mit V4.06 wird Gewitterradar fachlich und technisch als ein gemeinsames Produkt gepflegt. Die gemeinsame Frontend-Quelle wird deterministisch in zwei Auslieferungsformen erzeugt:

- native Home-Assistant-Integration;
- Dashboard-/Lovelace-Auslieferung.

Abweichungen des gemeinsamen Frontends, der Assets oder der Prüfsummen zwischen beiden Auslieferungsformen gelten als Fehler. Die Build- und Prüfkette rekonstruiert beide Varianten aus derselben Quelle und vergleicht sie bytegenau.

## V4.06 – Internationalisierung und Hilfe

Der About-/Hilfe-Bereich wurde auf **19 Sprachvarianten** erweitert. Nicht native Sprachpakete werden als gemeinsames, verzögert geladenes Locale-Modul bereitgestellt. Deutsch und Englisch bleiben direkt verfügbar; unbekannte oder unvollständige Sprachpakete fallen kontrolliert auf Englisch zurück.

Der neue Dialog **„Hilfe & Hinweise“** erklärt Voraussetzungen, Radien, Referenzstandort, wichtige Funktionen, empfohlene Grundeinstellungen, Fehlerdiagnose und Home-Assistant-Recorder. Die Recorder-Beispiele verwenden nun Wildcards für mehrere Blitzortungsgeräte bzw. Beobachtungspunkte.

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
- neue kompakte Fußnote `V4.06 · Visual V2 · Gewitterradar · by CK`;
- gerätespezifische Footer-Feinabstimmung für Android sowie iPad/iPad Pro;
- um etwa 25 % vergrößerte und vertikal zentrierte Wertefelder `70 KM`, `30 KM`, `5 KM`;
- Versionsanzeige im Einstellungsdialog aus dem Kopfbereich in den unteren linken Freiraum verschoben;
- iPad-/iPad-Pro-Fokusartefakte am About-X und am Dialog selbst beseitigt, ohne das freigegebene X zu verändern.

## V4.06 – griechischer Hochformat-Sonderfall

Bei der realen Android-Hochformatprüfung zeigte die griechische About-Überschrift einen speziellen Layoutfall: Der längere Untertitel kollidierte mit dem darunter platzierten Spruch.

Die griechischen Texte bleiben unverändert. Stattdessen erhält ausschließlich **Griechisch + mobiles Hochformat** einen echten Textfluss im Kopfbereich: Der Spruch folgt dem Untertitel in einer eigenen Grid-Zeile und kann diesen dadurch nicht mehr überdecken. Für diesen Sonderfall wurde zusätzlich eine Browser-Regression eingeführt. Die abschließende reale Geräte-Sichtprüfung dieses letzten Feinschliffs steht noch aus.

## Qualitätssicherung

Die V4.06-Linie wird unter anderem abgesichert durch:

- deterministischen Frontend-Neubau;
- SHA-/Asset-Paritätsprüfungen;
- Browserprofile für Desktop, iPad, iPad Pro, Android Hochformat und Android Querformat;
- beide Auslieferungsformen in denselben Browserprüfungen;
- Sprachschema- und Locale-Prüfungen;
- Home-Assistant-Laufzeittests;
- HACS-Validierung;
- Hassfest;
- Paketvertragsprüfungen;
- reale Geräteabnahme zusätzlich zu automatisierten Tests.

Automatisierte Tests ersetzen dabei ausdrücklich nicht die abschließende reale Sichtprüfung auf den Zielgeräten.

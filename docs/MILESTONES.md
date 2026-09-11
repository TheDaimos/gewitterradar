# Gewitterradar – Meilensteine

Status: V4.06 gemeinsamer Produktkandidat / native Integration 0.18.0.

## Erreicht

### M1 – V4.05 als geschützte Referenz eingefroren

- veröffentlichte visuelle Ausgangsbasis gesichert;
- About-/Widmungsdarstellung als geschützte Referenz dokumentiert;
- Premium-X und Kopier-Schriftrolle als freigegebene Originale übernommen.

### M2 – Gemeinsame Frontend-Quelle

- eine kanonische Frontend-Quelle für Integration und Dashboard;
- deterministische Erzeugung beider Auslieferungsformen;
- bytegenaue Paritäts- und Asset-Prüfungen;
- fail-closed Delta- und Regressionstests gegen Quellabweichungen.

### M3 – V4.06 Sprach- und Hilfeschicht

- 19 About-/Hilfe-Sprachvarianten;
- verzögert geladenes gemeinsames Locale-Modul;
- vollständiger Dialog **„Hilfe & Hinweise“**;
- kontrollierter englischer Rückfall bei ungültigen Sprachpaketen;
- sprachabhängige Einstellungs-, Entitäts- und Hilfeinhalte.

### M4 – Recorder und Mehrgerätefähigkeit

- Recorder-Hinweise in About und Hilfe vereinheitlicht;
- feste Sensor-IDs durch Wildcard-Muster ersetzt;
- Unterstützung mehrerer Blitzortungsgeräte bzw. Beobachtungspunkte unabhängig vom Entity-Präfix dokumentiert.

### M5 – Premium-Oberfläche V4.06

- metallisch schillernde Rahmen für Einstellungen und Hilfe;
- harmonisierte Premium-Schließen-Schaltflächen;
- Schriftrolle für YAML-Kopieraktionen;
- Welcome-Zahnrad in Hauptansicht und Hilfe übernommen;
- Help-Icons geräteübergreifend ausgerichtet;
- Chevron- und Abschnittshierarchie verfeinert;
- mobile About-/Widmungsdarstellung gezielt angepasst;
- persönliche Signatur in den Welcome-Footer übernommen;
- kompakte V4.06-Autor-/Versionsfußnote ergänzt;
- Radius-Wertefelder vergrößert und vertikal zentriert;
- Versionsanzeige im Einstellungsdialog nach unten links verlegt.

### M6 – iPad-/Android-Feinabnahme

- iPad/iPad-Pro-Schließen-X ohne unerwünschten Fokusrahmen;
- kein blauer WebKit-Fokusrahmen mehr um den erneut geöffneten About-Dialog;
- gerätespezifische Footer-Positionierung für Android sowie iPad/iPad Pro;
- Android-Signatur mit stärkerer Präsenz;
- Desktop-, Android-, iPad- und iPad-Pro-Darstellung der akzeptierten Komponenten angeglichen.

## Aktueller Abschlussmeilenstein

### M7 – Griechisch im mobilen Hochformat

**Umgesetzt, automatisierte Prüfung läuft/steht als Release-Gate:**

- längerer griechischer Untertitel darf den Spruch nicht mehr überdecken;
- griechische Übersetzung bleibt unverändert;
- nur `Ελληνικά` im mobilen Hochformat erhält den zusätzlichen natürlichen Kopfzeilen-Textfluss;
- Browser-Regression prüft Abstand Untertitel → Spruch, Einhaltung des Kopfbereichs und fehlenden horizontalen Überlauf.

**Noch erforderlich:** reale Sichtprüfung auf dem betroffenen mobilen Hochformat nach dem neuen Build.

## Danach: V4.06 Release-Abschluss

Vor der Freigabe werden keine neuen gestalterischen Umbauten mehr begonnen. Der Abschluss besteht aus:

- finaler Geräte-Sichtprüfung des griechischen Hochformats;
- vollständigem grünen Frontend-, Home-Assistant-, HACS-, Hassfest- und Paketlauf;
- finaler Prüfung von Integration/Dashboard-Parität und Release-Artefakten;
- Abgleich von Changelog, Projektgeschichte, Meilensteinen und Release Notes mit dem tatsächlich ausgelieferten Stand;
- anschließender Freigabe des V4.06-Kandidaten nach erfolgreicher Gesamtabnahme.

## Nach V4.06

Weiterführende Funktionen oder größere Architekturänderungen werden getrennt vom V4.06-Abschluss behandelt. Damit bleibt der abgenommene V4.06-Stand reproduzierbar und rücksetzbar.

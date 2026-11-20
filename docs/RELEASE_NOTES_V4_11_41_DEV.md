# Gewitterradar V4.11.41 DEV – Hilfe und Hinweise

Datum: 2026-10-09

## Ausgangsbefund
Der Benutzer meldete unter V4.11.40 DEV, dass beim Antippen von „Hilfe und Hinweise“ überhaupt nichts passiert. Schalter und Klickbindung existieren; 31/31 Module sind konsistent geladen.

## Analysierter Fehlerpfad
`_openHelp()` ruft `_syncHelp()` vor `dialog.showModal()` auf. `_syncHelp()` registrierte wiederum bei jedem Aufruf `requestAboutLocale(..., () => this._syncHelp())`. Wenn der Sprachlader einen vorhandenen Datensatz unmittelbar zurückmeldet, kann dies eine rekursive Synchronisation auslösen, bevor der Dialog gezeigt wird. Der tatsächliche Rückrufzeitpunkt im Browser bleibt im Realtest zu bestätigen.

## Änderung
- Sprachdaten werden je Öffnung genau einmal **nach** `dialog.showModal()` nachgefordert.
- `_syncHelp()` rendert ohne eigene weitere Sprachladeanforderung.
- Die Rückmeldung prüft Dialogidentität, `open` und Sprache vor der Aktualisierung.
- Bestehende Hilfesprachen, Abschnitte, Grafiken, About-Dialog und Android-Kartensteuerung unverändert.
- `ui.i18n-settings` 1.3.7; sichtbare Version V4.11.41 DEV; Runtime `41141r1`; Modulsatz `E411-41A1`; Integration 0.25.0.
- Quelle, Dashboard und native Integration synchronisiert.

## Abnahme
Quellcodekorrektur eingespielt; **echter HA-/Android-Realtest noch offen**. Zu prüfen: Hilfe öffnen/schließen/wieder öffnen, Sprachenwechsel, Abschnitte und Übersetzungen, About-Dialog, Desktop/Android sowie 3-Finger-Kartenbedienung als Regression. Ältere allgemeine CI-Abweichungen werden getrennt verfolgt.

**C.K. – Eine Idee weiter gedacht.**

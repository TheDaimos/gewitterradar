# Gewitterradar V4.11.42 DEV – Sichtbare Hilfediagnose

Datum: 2026-10-09

## Anlass
V4.11.41 wird im realen Home Assistant geladen, dennoch reagiert „Hilfe und Hinweise“ weiterhin nicht sichtbar. Export bestätigt 31/31 Module, ui.i18n-settings 1.3.7 konsistent. Separat meldet die Laufzeitprüfung installiert E411-40A1/41140r1 gegenüber geladen E411-41A1/41141r1. Dies ist eine eigenständige DRA-/Runtime-Identitätsabweichung und kein Beleg für die Hilfeursache.

## V4.11.42
- Hilfeaufruf protokolliert Fehler beim Textaufbau, bei der Dialogöffnung und bei der Sprachnachladung.
- Bei Inhaltsfehler wird eine sichtbare, schließbare Fehlermeldung innerhalb des Hilfedialogs dargestellt, statt einen unbemerkten Abbruch hinzunehmen.
- `_helpLastError` enthält Fehlerstelle, Meldung und Zeitpunkt; zusätzlich Konsolenausgabe.
- Vorhandene Sprachtexte und Dialoggestaltung bleiben im Erfolgsfall unverändert.
- `ui.i18n-settings` 1.3.8, Produkt 4.11.42 DEV, Runtime 41142r1, Modulsatz E411-42A1, Integration 0.25.0.
- Keine Änderung an Android-Gesten, WeatherRouter, About oder geschützten Grafiken.

## Abnahme – noch offen
Auf HA über DRA installieren, Frontend vollständig neu laden und den Hilfe-Knopf betätigen. Erwartet: entweder Hilfedialog mit Inhalt oder ein sichtbarer Fehlertext. Falls weiterhin gar nichts geschieht, liegt die Ursache *vor* der instrumentierten Hilfeaufbereitung (Klickbindung, Element oder DOM-Ereignis) und muss an dieser Stelle verfolgt werden.

Vorher/nachher Module & Versionen prüfen. Gesondert DRA-Installationsmetadaten auf alte Kennungen untersuchen. Automatisierte CI-/HA-Realabnahme ist durch diese Quelländerung nicht nachgewiesen.

**C.K. – Eine Idee weiter gedacht.**

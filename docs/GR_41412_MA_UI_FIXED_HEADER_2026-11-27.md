# GewitterRadar V4.14.12 DEV – verbindlicher Scroll- und Header-Vertrag

## Betreiberwunsch (27.11.2026)

In der realen VM109-Migrationsvorschau mit 43 Orten wandert der Titel samt Schließen-X bisher mit der langen Liste aus dem Bild. Die neue Regel lautet: Header und Schließen-Bedienung **immer an Ort und Stelle**, ausschließlich die Liste scrollt. Einträge dürfen nicht über den goldenen Dialograhmen hinausragen oder hinter der Kopfzeile sichtbar werden. Analog bei „Standorte verwalten“ und langen Tabellen. Das runde hochwertige Schließen-X ist verbindlich.

## Implementierung

- `frontend/modules/monitored-areas/migration-wizard.js`: Flex-Dialog mit fester, platin-/goldfarbener Kopfzeile; rundes Close-X; eigener tastaturbedienbarer, durch `overflow-y:auto`, `min-height:0` und `contain:paint` begrenzter Inhalt; fester Footer mit Import, SQLite-Lesevorschau, Verifikation und expliziter Leerungsfreigabe. Dialog respektiert `100dvh` und kleinere mobile Displays. Keine Änderung an WebSocket-Kommandos, Import-/Finalisierungsprüfungen, Admin- oder Quellenrechten.
- `frontend/modules/monitored-areas/location-manager.js`: derselbe Grundsatz für den dauerhaften Standortmanager: Titel, runder Schließen-Button, Status und Suche außerhalb der scrollbaren Standortliste; Feedback im festen unteren Bereich.
- Keine automatische Migration, keine Quelllöschung, kein Wechsel auf `db_active` und keine Änderungen an geschützten Referenzmodulen.
- `tests/test_ma_sticky_dialog_layout.mjs`: Layout-Vertrag, Reihenfolge Header/Inhalt/Footer, gekapselte Scrollfläche, runde Close-Buttons und unveränderte sicherheitskritische Bestätigungsfelder.
- V4.14.12 DEV, Integration 0.25.198, Runtime 41412r1, Modulset E414-12A1.

## DEV-Realabnahme (VM109)

1. V4.14.12 DEV über den vorgesehenen DEV-Kanal installieren; Integrationsversion 0.25.198 kontrollieren.
2. **Standorte verwalten** öffnen: bei vielen Orten scrollen, Titel, Suche und rundes Schließen-X beobachten.
3. **SQLite-Übernahme prüfen** öffnen, 43 vorhandene Quelleinträge anzeigen: Nur Ortsliste scrollt, Header/X und Footer bleiben sichtbar; kein Durchscheinen außerhalb des Fensterrands.
4. **SQLite-Daten ansehen** und Teilstringfilter sowie Archiv-Accordion prüfen. Erwartet weiterhin 43/39/4 bei unverändertem Datenbestand.
5. **Finalisierung prüfen** bleibt rein lesend. **Checkbox nicht aktivieren, keine Einträge leeren, keinen erneuten Import auslösen.**
6. Chrome und Android jeweils für visuelle Scroll-Abnahme prüfen. Mobil auf mittlere und geringe Viewporthöhe achten; die Bedienung darf nicht außerhalb der Fläche verschwinden.

## Offene Nachpflege

Bei Bedarf später kompakte Sammelauswahl und weitere Auslagerung der Migration in einen ausschließlich administrativen Dialog. Erst nach fachlicher Betreiberfreigabe.

Hinweis: Die offizielle DEV-Verfügbarkeit über DRA muss auf VM109 getrennt bestätigt werden; CI-Paket und Frontend-Spiegel ersetzen keinen Gerätetest.

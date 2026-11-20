# Gewitterradar V4.11.49 DEV – Schieben, Orientierung und Project Hub

Datum: 2026-10-09

## Ausgangslage / mobile Realbeobachtung
- V4.11.48: Die Höhe des blauen Einstellungsdialogs ruckelt beim Wechsel zwischen unterschiedlich langen Unterseiten **in beide Richtungen**.
- „Über Gewitterradar“ und „Hilfe & Hinweise“ teilen sich die Breite nicht zuverlässig gleichmäßig; „Über Gewitterradar“ soll prominenter und hochwertiger wirken.
- Die Signatur öffnet trotz bestehender Internetverbindung die lokale Offline-Projektliste. Die freigegebene Online-Adresse lautet `https://thedaimos.github.io/project-hub/`.
- Für die Unterseiten soll die Nummer des Oberpunkts erhalten bleiben, zum Beispiel `3. Standort`.

## Änderungen
1. **Gekoppelter Seiten- und Höhenübergang:** Die echten Einstellungen werden bereits *unter* den kurzlebigen Animationskopien auf die Zielseite umgeschaltet und deren natürliche Dialoghöhe **vor Animationsbeginn** gemessen. Der Dialog animiert gleichzeitig mit dem horizontalen Seitenwechsel von der Ausgangs- zur Zielhöhe. Erst nach Abschluss aller Animationen werden die Kopien entfernt. Das verhindert den zusätzlichen Größenwechsel nach Ende des Schiebens. Die vorhandenen Geschwindigkeiten Schnell/Mittel/Langsam und die Bewegungsreduzierung bleiben erhalten.
2. **Symmetrische Aktionsflächen:** Ausschließlich im **blauen Testmenü** sind „Über Gewitterradar“ und „Hilfe & Hinweise“ auf zwei gleich breite Spalten mit `minmax(0,1fr)` festgelegt. „Über Gewitterradar“ erhält einen edleren Goldverlauf, Glanzkante und stärkere Hervorhebung. Das goldene Bestandsmenü ist unverändert.
3. **Nummerierte Kategorien:** Die vorhandenen Kategorien erhalten fortlaufend `1.`, `2.`, `3.` usw. Der Kopf der gewählten Unterseite zeigt dieselbe Nummer und Bezeichnung. Beim Zurückgehen erscheint wieder „Einstellungen“.
4. **Project Hub online:** Der konfigurierte Zielpfad wurde auf `https://thedaimos.github.io/project-hub/` umgestellt. Der bislang festgestellte Hauptfehler wurde behoben: Im Online-Fall wurde zuvor dennoch die Offline-URL in den iframe eingesetzt. Das Popup lädt künftig **tatsächlich die Online-Adresse**. Der vorläufige Offline-Auftritt wurde beim Verbindungscheck durch einen neutralen Ladehinweis ersetzt. Die Erreichbarkeitsprüfung erfolgt zunächst über die Website selbst; ein wegen WebView-/CSP-Einschränkungen fehlgeschlagener Prüfrückruf erzwingt nicht fälschlich die Offline-Darstellung. Bei gemeldetem Offlinezustand oder iframe-Fehlerereignis bleibt die lokale Seite als Rückfall verfügbar. Der genaue Health-Asset-Pfad des externen Auftritts konnte von hier nicht eigenständig bestätigt werden; die Hauptprüfung ist deshalb nicht davon abhängig.

## Versionsstand
- **V4.11.49 DEV** · Build `V4.11.49-DEV-2026-10-09`
- Runtime `41149r1` · Modulsatz `E411-49A1` · Integration `0.25.0`
- `ui.controls` **1.1.12**, `ui.project-hub` **1.1.16**
- Sechs geänderte Frontend-Dateien sind in Quelle, Dashboard und nativer HA-Integration bytegleich, geprüft anhand ihrer Git-Blob-Kennungen.

## Abnahmepunkte – offen
- DRA V1-Update auf HA installieren; Browser vollständig neu laden.
- Blaues Zahnrad: Lange ↔ kurze Menüseiten, alle drei Geschwindigkeiten und schnelles Zurück. Kein Sprung am Anfang oder Ende; Dialog samt Kopf und Signatur prüfen.
- Hauptmenü und Unterseite: Nummerierung muss übereinstimmen, z. B. `3. Standort`.
- Mobile und Desktop: Die beiden Aktionsschaltflächen müssen exakt gleich breit bleiben; About erhält sichtbar größere Wertigkeit. Goldene Einstellungen bleiben unverändert.
- Signatur: Bei funktionierendem Internet muss das Popup die **externe** Projekt-Hub-Seite zeigen, offline die lokale Ersatzansicht. Cross-Origin-iframe-Verhalten auf Android und HA-WebView ist ausdrücklich real zu testen.
- Android-Drei-Finger-Kartensteuerung, Hilfe, About und WeatherRouter als Regression prüfen.

Automatische CI- und HA-Realtests sind durch diese Quelländerung **noch nicht nachgewiesen**.

**C.K. – Eine Idee weiter gedacht.**

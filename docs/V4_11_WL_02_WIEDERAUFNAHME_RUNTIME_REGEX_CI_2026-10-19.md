# WL-02 – Wiederaufnahme: tatsächliche Prüfungen und weitere Korrekturen (19.10.2026)

**Entwicklungszweig ausschließlich `deploy/dev`; keine Installationsfreigabe.**

## Bestand und konkrete neue Codefehler
Der bestehende WL-02-Auftrag und die zuvor gemeldeten CI-Vertragsangleichungen wurden übernommen, ohne die öffentliche Pipeline erneut anzulegen oder Tests abzuschwächen.

Bei der erneuten Quellcodeprüfung wurden **drei zusätzliche Fehler** im aktiven WL-02-Layerpfad erkannt:
1. Die JavaScript-RegExp-Literale für ISO-UTC-Zonenprüfung und XYZ-`{z}/{x}/{y}`-Vorlagen enthielten fälschlich doppelt escapte Backslashes. Dadurch wurden gültige Rasterzeiten abgelehnt bzw. URL-Platzhalter nicht korrekt ersetzt.
2. Die Kartenersetzungsprüfung verglich `state.map` (temporäre Layerkarte, beim Detach null) statt `state.hookMap` (gespeicherte Karte der Ereignisbindung), wodurch wiederholte Event-Neubindungen möglich waren.

**Korrekturcommits:**
- `8b59ffa8b27490772e3eddf5dc5af3f085f9e431` – kanonisches `frontend/modules/weather/layer-menu.js`: RegExp für UTC, XYZ-URL und Kartenwechsel korrigiert.
- `7a728a05bbf8007a470ce3ade376d89cc83cdf79` – DRA-Spiegel `custom_components/gewitterradar/frontend/modules/weather/layer-menu.js` erneut bytegleich gespiegelt.

## Tatsächlicher GitHub-Actions-Zugriff
Die GitHub-Verbindung erlaubt mit **bekannten Laufkennungen** direkte Auftragsabfragen:
- Öffentlicher Run **39274061760**: Job `shared-frontend`, ID **118133636322**, `status=completed`, `conclusion=failure` – direkt über GitHub-API abgefragt.
- Öffentlicher Run **39274061819**: Job `settings-navigation`, ID **118133635240**, `status=completed`, `conclusion=success` – direkt über GitHub-API abgefragt.
- Öffentlicher Run **39274061794**: direkte Abfrage scheiterte an **ReadTimeout**, ohne neues Ergebnis.
Diese Runs sind **alt**, zu Commit `0b078c94f8fbcae0e722dfd48cc2d774c88628b9`; sie prüfen **nicht** die jetzigen Korrekturen.

Das verfügbare `fetch_commit_workflow_runs` liefert nach Werkzeugvertrag PR-gebundene Runs, nicht sämtliche Push-Runs; für die zwei neuen Commits wurde deshalb noch **kein erfolgreicher Push-Run nachgewiesen**. Keine privaten GitHub-Actions-Runs gestartet.

## Verbleibende technische Sperrgründe
- Im vorhandenen P7-010-Niederschlagsrenderer gilt weiterhin ein eigenständiges Ressourcenbudget; der generische Wolken-/Windpfad teilt nur seine eigene Obergrenze. Übergreifende Kachel-/Speicherbegrenzungen und ein belastbarer Laufzeittest fehlen.
- Canvas-Zeichnung erfordert echte CORS-konforme Bildantworten; nicht verifizierte WR-Provider-XYZ/WMS-Formate, Lizenz- und Legendenverträge sind nicht freigegeben.
- Vollständiger Karten-/Reconnect-Lebenszyklus, NoData-Geopixelbeweis, zeitliche Fachsemantik sowie automatisierte GR-RF-01–04/P7-010-Gesamtregressionen sind nicht nachgewiesen.
- Neue Codekorrekturen müssen über **öffentliche** Push-Prüfläufe auf `deploy/dev` nachgewiesen werden, bevor eine neue versionierte DRA-Auslieferung möglich ist.

## Freigabeentscheidung
**CODE-PASS: OFFEN. ÖFFENTLICHER CI-PASS: OFFEN. HA-REAL-PASS: OFFEN. DRA-FREIGABE: NEIN.**  
Keine Änderung an WeatherRouter, Niederschlagsrenderer, WL-03/WL-04; keine neue Produkt-DEV-Version.

C.K. – Eine Idee weiter gedacht.

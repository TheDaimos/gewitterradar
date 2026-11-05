# OPERA DEV-Bereitstellung · 2026-11-05

## Installierbare Kombination

- WeatherRouter **0.10.286 DEV / Loader 289**: privates `TheDaimos/weather-router-dev`.
- Gewitterradar **4.11.138 DEV / HA-Integration 0.25.45**: öffentliches `TheDaimos/gewitterradar`.
- Entwicklungszweig in beiden Projekten: `feature/opera-ref-2026-11-04-router-owned`.
- DRA-Installationskanal in beiden Projekten: `deploy/dev`.
- [WR-Installationspaket](https://github.com/TheDaimos/weather-router-dev/releases/download/v0.10.286-dev/weather_router-0.10.286-dev.zip) (GitHub-Anmeldung mit Zugriff auf das private Repository erforderlich).
- [GR-Integrationspaket](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.138-dev/gewitterradar-0.25.45-dev.zip).
- [GR-Dashboard-Paket](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.138-dev/gewitterradar-dashboard-4.11.138-dev.zip).

## Konkreter Installationsschritt auf VM109

In Deploy Relay beide Projektquellen aktualisieren und `deploy/dev` auswählen.
Die Vorschau muss WR **0.10.286** und GR **0.25.45** anzeigen. Mit der vorhandenen
DRA-Sicherung installieren, anschließend Home Assistant neu starten und das GR-
Frontend neu laden. Alternativ die Integrations-ZIPs nach `/config` entpacken
(sie enthalten jeweils `custom_components/<domain>/...`). Vor manueller
Installation die beiden bisherigen Integrationsordner sichern.

WR: Provider OPERA aktivieren, Dienst RATE aktivieren und Zeitpolitik speichern.
GR: reguläre Niederschlagsebene einschalten. Keine separate OPERA-Vorschau nötig.

**HA-Realabnahme wurde in diesem Arbeitslauf nicht durchgeführt.** Diese Pakete
sind DEV-Auslieferungen. VM101 wurde weder geändert noch neu gestartet.
Diagnose-/Realexporte dürfen ausschließlich nach `TheDaimos/Project-Log-And-Export@main`.

## Konsolidierungsentscheidungen

Verglichen wurden WR `09296e74e482395890699deb653e04561c1199a6` und
`d3fee836b31feb73a5b7dee483e4cec622edaf2f`, GR
`b00142eb321b11b25ac825b5ae39140f2888a5f0` und
`41f026216e0bddebe7761329df0f2b23648d534d`.

Übernommen: additive V2-Anfrage ohne Consumer-Altersgrenzen, WR-`valid_until`,
authentifizierter GR-Transport, neue Installationsidentitäten, Importrevisionen,
vollständiger Kachelwechsel, Cache für erfolgreich dekodierte Kacheln und
versionsneutrale Konsistenzprüfungen. Die GR-Mergekonflikte wurden entsprechend
aufgelöst; die Isolation der diagnostischen Vorschau und die About-Referenz
bleiben erhalten.

Bewusst verworfen wurden konkurrierende Legacy-Zeitwerte, eine Rückkehr zur
Registry mit nur einer Generation, admin-only Berechtigungen für reguläre
Consumer und der Verlust des geschützten relativen OPERA-URL-Pfads im WR-Planer.
WR übernimmt die geeigneten Änderungen gezielt. Der spätere Merge-Elternverweis
auf `deploy/dev` dokumentiert diesen geprüften Abgleich, ohne die verworfenen
Laufzeitpfade erneut einzuführen.

`opera_rate_scoped_approval.py` bleibt die bestehende interne Provenienz- und
Originalprüfung; ihre fünf Git-Blob-Fingerprints stimmen mit der unveränderten
TEST69-Implementierung überein. Es ist keine zusätzliche Benutzerfreigabe.
Die Normalisierung von CRLF zu LF im Fingerprint behandelt Windows-Checkouts
gleichwertig mit den Git-Textblobs. Keine wissenschaftlichen Module geändert,
kein TEST69 wiederholt und keine neue Testserie begonnen.

## Nachweise

WR: vorhandene lokale Provider-/V2-/Zeitpolitik-/Registry-/HTTP-/Cacheprüfungen.
GR: bestehende öffentliche CI auf dem ausgelieferten Commit, bestehende lokale
P7-010-Prüfungen, Retry-/Vertragsprüfungen, Versions- und Auslieferungsparität.
GitHub Actions im privaten WR-Repository bleiben deaktiviert. Private WR-Quellen
und Instanzexporte wurden nicht in den öffentlichen Prüfstand kopiert.
Die öffentlichen GR-Läufe sind in der Commit-/Releaseansicht referenziert.

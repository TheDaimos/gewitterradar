# OPERA RATE – Korrektur des regulären Lieferpfads · 2026-11-05

## Ergebnis der Codeanalyse

Der Ring-/Registrierungspfad war nicht gleichbedeutend mit der endgültigen
V2-Auswahl: Der Planer setzte zusätzlich eine generische Kohärenzschwelle von
180 Sekunden zu einem anderen Radarzyklus durch. Die bestehende synthetische
Serviceprüfung reproduziert die Ablehnung `outside_time_tolerance` auf dem alten
Stand und die korrekte Lieferung auf dem korrigierten Stand. Keine Originaldaten
oder Instanzwerte werden als Testfixture kopiert.

Der korrigierte Planer verwendet bei der jüngsten Darstellung das bestehende
WR-Zeitfenster des vertrauenswürdig registrierten RATE-Frames. Er veröffentlicht
den unveränderten Datenzeitpunkt, die eigene Ablaufzeit und den Zeitversatz.
Eine explizite `at_time`-Anfrage bleibt strikt. Metadaten-, Authentifizierungs-,
Herkunfts-, Produkt-, Qualitäts- und Altersprüfungen bleiben erhalten.

Die Diagnose hatte zusätzlich `registered_approved` nicht in ihrer erlaubten
Statusliste und meldete deshalb `not_attempted`. Wissenschaftliche
Kachelzulassung und aktuelle Transportfreigabe kommen nun aus der tatsächlichen
Registry. Der reine Originalspeicher und die isolierte historische Vorschau
erteilen weiterhin keine reguläre Framefreigabe. Diese Einschränkung behauptet
keine ungeprüfte geografische Orientierung des validierten RATE-Verfahrens.

GR besitzt nur eine reguläre WR-Niederschlagsdarstellung. Der bisherige
Vorschauknopf startet jetzt eine normale Niederschlagsaktualisierung. Reguläre
V2-Lieferung und Legacy-Originaldiagnose sind in Status und Export getrennt.
Der nahtlose Kachelwechsel und die vorhandene Transportlogik bleiben erhalten.

## Speicher

Die Kapazitätsgrenze wird anhand tatsächlicher Originalbytes kontrolliert.
Wiederherstellung repariert überschrittene Kapazität, ohne die UTC-Aufbewahrung
neu zu starten. Auch Duplikate führen die bestehende Bereinigung aus. Ein Fehler
beim Abfragen neuer Zyklen verhindert weder Wartung noch die Registrierung eines
vorhandenen zulässigen Originals. Die Prüfungen verwenden ausschließlich
synthetische Dateien. Es wird kein bestätigter Größenverstoß aus einer
ungeprüften UI-Lesart abgeleitet.

## Installierbare DEV-Kombination

- WR **0.10.287 / Loader 290**, privates `TheDaimos/weather-router-dev`.
- GR **4.11.139 DEV / HA 0.25.46**, öffentliches `TheDaimos/gewitterradar`.
- Integrationszweig beider Projekte: `feature/opera-ref-2026-11-04-router-owned`.
- DRA-Kanal beider Projekte: `deploy/dev`.
- [WR-ZIP](https://github.com/TheDaimos/weather-router-dev/releases/download/v0.10.287-dev/weather_router-0.10.287-dev.zip) (privater Repositoryzugriff nötig).
- [GR-ZIP](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.139-dev/gewitterradar-0.25.46-dev.zip).
- [GR-Dashboard](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.139-dev/gewitterradar-dashboard-4.11.139-dev.zip).

Nur auf VM109 beide DRA-Projektquellen aktualisieren, WR 0.10.287 und GR 0.25.46
mit bestehender Sicherung installieren, HA neu starten und GR vollständig neu
laden. OPERA und RATE in WR aktivieren, normale Niederschlagsebene in GR nutzen.
Keine Vorschaufreigabe erforderlich. Alternativ die Integrations-ZIPs nach
Sicherung der alten Ordner in `/config` entpacken.

Neue HA-Realabnahme nicht durchgeführt. VM101 wurde nicht verändert. Private
GitHub Actions bleiben deaktiviert. Reale Exporte ausschließlich im privaten
`TheDaimos/Project-Log-And-Export@main`; kein Diagnoseoriginal im Quellrepository.
TEST69 wurde nicht wiederholt; seine wissenschaftlichen Module sind unverändert.

# Gewitterradar V4.11.86 DEV – P7-010 V2-Datenalter-Vergleich

**Stand:** 16.10.2026 · **Zweig:** `deploy/dev` · **Status:** DEV-Diagnosekandidat; HA-REAL-PASS ausstehend.

## Neue Weather-Engine-Diagnose

Die bestehende Wetterdiagnose besitzt zusätzlich den Schalter **„V2-Datenalter vergleichen (15 Min. / 12 Std.)“**. Die Funktion löst zwei **aufeinanderfolgende, niemals parallel durch den Vergleich gestartete** Consumer-V2-Anfragen aus, mit identischem geografischem Kartenausschnitt, Fokus, maximal zwölf Quellen, zwölf deklarierten Bildanfragen und `latest_coherent` / 180 Sekunden Quellen-Zeitabweichung:

1. Kontrollfall: `max_data_age_seconds=900` (15 Minuten, unveränderte produktive V2-Regel).
2. Diagnosefall: `max_data_age_seconds=43200` (12 Stunden, **ausschließlich in diesem Test**).

Jeder Fall erhält eine eigene `correlation_id` für den WR-API-Monitor, ein endliches 20-Sekunden-Clientzeitbudget sowie getrennte Ergebnisse zu Antwortstatus, Quelle, Quelle-Zeitstempel (`valid_at` mit Zeitzonenbezug), tatsächlichem Alter in Sekunden, Herkunfts-/Messmethode, Qualitätskennzeichen und höchstens acht redigierten WR-Einschränkungen. Die Ergebnisse werden unter `v2_age_comparison` im Weather-Engine-JSON-Export gespeichert.

**Sicherheits- und Bestandsregeln:** Der Vergleich verändert weder Wetterkartenebenen noch die laufende produktive V2-/V1-Auswahl. Es werden keine Rasterbilder abgerufen und keine Datenanbieter in GR priorisiert. Zwei `unavailable`-Antworten sind **kein** Nachweis eines Altersfilterproblems; auch ein positiver Vergleich beweist nur, dass die größere Altersgrenze für diese Probe eine V2-Quelle zuließ – **keine** pauschale Freigabe historischer Satellitenbilder als aktuelles Niederschlagsradar.

## Grundlagen

WRs privater Bericht `docs/p7-010-coordination/WR_TO_GR_2026-10-16_REALTRACE_4XV2_UNAVAILABLE_4XV1_READY.md` bestätigt historische NASA-IMERG-Latenz von sechs Stunden und dreißig Minuten sowie einen erfolgreich simulierten Vorher-/Nachher-Test: 900 Sekunden ergibt `unavailable`, 43200 Sekunden ergibt `partial`. Dies ersetzt nicht den korrelierten Vergleich mit aktuellen Home-Assistant-Daten.

## Automatische und reale Abnahme

- Isolierter P7-010-Alterstest prüft beide Anfragewerte, unveränderte 180 Sekunden Kohärenz, unterschiedliche Korrelationskennungen, qualifizierte Zeitstempel, keinen Kartenwechsel, keinen geheimen Bildpfad im Export und die Nichtfreigabe bei zwei `unavailable`-Antworten.
- Bestehende Frontend-/Integrations-/Versionsprüfungen müssen am finalen Commit grün sein.
- Für HA: WR-API-Monitor aktivieren, in GR denselben Kartenausschnitt beibehalten, den Vergleich auslösen und **beide** Korrelationskennungen in GR- und WR-Export abgleichen. Wenn der 12-Stunden-Fall eine V2-Quelle liefert, **nicht** damit automatisch die produktive Altersregel ändern; erst WR-Messalter und fachlichen Quellenvertrag prüfen.
- Anschließend eigenständiger produktiver V2-Mosaiktest Kuba–Atlantik–Europa sowie Desktop, Android und iPad. **P7-010 noch nicht REAL-PASS, FLK-01 weiterhin separat offen.**

**Version:** V4.11.86 DEV · Laufzeit `41186r1` · Modulsatz `E411-86A1` · HA-Integration `0.25.4`.

**C.K. – Eine Idee weiter gedacht.**

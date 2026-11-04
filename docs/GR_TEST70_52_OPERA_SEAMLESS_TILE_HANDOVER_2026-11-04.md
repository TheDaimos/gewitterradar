# TEST70-52 – OPERA Seamless Tile Handover

**Datum:** 2026-11-04  
**Release:** Gewitterradar V4.11.131 DEV / Integration 0.25.40 / Runtime 411131r1 / Module E411-131A1.  
**WR-Gegenstelle:** V0.10.283 DEV (unverändert).

## Umsetzung

- Der lokale OPERA-`expiry`-Timer in GR wurde entfernt. **GR setzt keine eigene Zeitgrenze für den Kachelaustausch.** Die Existenz eines WR-Feldes `max_age_seconds` im unveränderten V2-Antwortvertrag bedeutet keine zeitgesteuerte Entfernung durch GR.
- Bei WR-Push oder Fallback-Abfrage wird ein neuer, durch WR autorisierter Zyklus unsichtbar vorbereitet. Die bestehende Karte bleibt unverändert, bis die neuen PNGs verarbeitet sind.
- `waitUntilReady()` hat keinen 15-Sekunden-Abbruch mehr. Erfolg bedeutet: mindestens ein PNG geladen, keine ausstehenden PNGs, **keine fehlgeschlagene Kachel**. 503/PNG-Fehler verhindern den Wechsel; der reguläre erneute WR-Abruf bleibt als Wiederanlauf.
- **Nur nach Erfolg** wird die neue Ebene eingeblendet und die bisherige Ebene geschlossen (`cycle_swap`). Bei ausdrücklicher WR-Verweigerung, einem Auth-Fehler oder Benutzer-Deaktivierung bleibt das bestehende Sicherheitsverhalten (Entfernung) bestehen.
- Drei synchronisierte JS-Auslieferungen: `frontend`, `custom_components/gewitterradar/frontend`, `dashboard/dist`.

## Nachweise

- Öffentliche CI TEST70-52: Run [41812184349](https://github.com/TheDaimos/gewitterradar/actions/runs/41812184349) **SUCCESS**.
- Release- und Quellstand wurden aus GitHub zurückgelesen. **Keine privaten GitHub Actions** verwendet.
- **HA-DEV-Realtest noch offen:** keine Behauptung einer unterbrechungsfreien Darstellung in Desktop, Android und iPad. Zu testen sind insbesondere 503-Ersatz, WR-Sperre, Auth-Fehler, unterschiedliche Zoomstufen und ausbleibende neue Zyklen.
- Diagnose- und Realtest-Exporte ausschließlich `TheDaimos/Project-Log-And-Export@main`.

## Architekturhinweis

Diese Änderung folgt der Anforderung, dass GR selbst keine Zeit- oder Altersentscheidung trifft. WR verantwortet Quelle, Berechtigung und Gültigkeit der Daten. Ein altes Bild kann folglich bei ausbleibendem neuen Zyklus weiterhin angezeigt werden, solange WR keine ausdrückliche Sperre an GR übermittelt. Für eine harte serverseitige Widerrufssemantik ohne Poll-Abhängigkeit wäre eine zusätzliche WR-Push-Sperrbenachrichtigung ein separater Arbeitsschritt.

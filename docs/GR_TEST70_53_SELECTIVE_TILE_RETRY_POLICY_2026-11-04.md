# TEST70-53 – Selective Tile Retry / allgemeine Kachelregel

**Datum:** 2026-11-04

## Verbindlicher projektweiter Grundsatz

Wenn eine einzelne Kachel nicht geladen, nicht dekodiert oder nur fehlerhaft übertragen wurde, **darf nicht der gesamte Kachelbestand neu heruntergeladen werden**. Erfolgreiche Kacheln bleiben erhalten; nur die fehlgeschlagene `z/x/y`-Koordinate wird erneut angefordert. Ein neuer Zyklus ersetzt den alten erst, wenn alle für die sichtbare Darstellung angeforderten Kacheln erfolgreich bereitstehen. GR trifft keine eigene Entscheidung über das Alter der Daten; Bereitstellung und Freigabe kommen von WeatherRouter.

## In 4.11.132 realisierte Umsetzung

- OPERA Diagnostic Tile Adapter: `createTile` verwaltet einen Retry je Kachelkoordinate; auf HTTP-Fehler oder PNG-Dekodierungsfehler erfolgt ein neuer Versuch nur für diese Koordinate.
- Erfolgreiche Nachbarkacheln werden nicht erneut geladen; bestehende sichtbare Kachelebene bleibt bis zum vollständig vorbereiteten Austausch erhalten.
- HTTP 401/403: **keine** Wiederholung, Authentifizierungsfehler führen weiterhin zum Abbruch.
- Weitere HTTP-/Transport-/Dekodierungsfehler: Retry mit begrenzter Transport-Backoff-Verzögerung, **ohne zeitlich begrenzte Gültigkeitsentscheidung durch GR**. Abbruch bei Deaktivierung / Disposal.
- Diagnoseereignis `tile_retry_scheduled` mit Koordinate und Versuchszahl, Zähler `metrics.retry_attempts`.
- Drei ausgelieferte Kopien des OPERA-Adapters synchronisiert (Frontend, HA, Dashboard).

## Reichweite und offene Arbeiten

**Die projektweite Regel ist festgelegt; die technische Implementierung ist bisher für den OPERA-Diagnostic-Tile-Adapter realisiert.** Für andere (V1-, V2-, Basis-/Radar-) Kachelquellen sind die jeweiligen Ladewege separat zu auditieren und dieser Regel anzupassen. Das ist kein Nachweis, dass bereits alle Anbieter selektive Retries haben.

## Prüfung

- Öffentliche GitHub Actions, TEST70-53 Run [41818568222](https://github.com/TheDaimos/gewitterradar/actions/runs/41818568222): **SUCCESS**. Keine privaten GitHub Actions.
- Gewitterradar **V4.11.132 DEV**, Integration **0.25.41**, Runtime **411132r1**; WeatherRouter **0.10.283** bleibt unverändert.
- HA DEV VM 109 Realabnahme und Fehlersimulation noch ausstehend. Exporte ausschließlich nach `TheDaimos/Project-Log-And-Export@main`.

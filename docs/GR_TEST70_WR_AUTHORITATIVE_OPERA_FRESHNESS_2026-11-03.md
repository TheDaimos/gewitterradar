# TEST70-GR-FIX-01 – WeatherRouter-authoritative OPERA preview freshness

**Datum:** 2026-11-03 · **Branches:** `TheDaimos/gewitterradar@deploy/dev`, `TheDaimos/weather-router-dev@deploy/dev` · **Testsystem:** HA DEV VM109 (Realtest ausstehend).

## Befund

Gewitterradar V4.11.120 hatte für die getrennte, nicht wissenschaftlich freigegebene OPERA-Diagnosevorschau drei unabhängige feste Altersgrenzen von 900 Sekunden (V2-Anfrage, Antwortvertrag und Ablauf-Timer). WeatherRouter V0.10.280 gibt stattdessen die konfigurierte Vorschaufrist von derzeit 1650 Sekunden zurück. Ein festes `response.max_age_seconds !== 900` verweigerte eine sonst gültige Antwort.

## Änderung

- Alle drei **ausgelieferten** GR-Adapter `frontend/`, `custom_components/gewitterradar/frontend/`, `dashboard/dist/` wurden identisch aktualisiert.
- **Nur** der explizite, auf `provider_id=opera, product_id=RATE, diagnostic=true, preview_orientation` beschränkte GR-Vorschauaufruf löscht `request.time.max_data_age_seconds`; normaler Consumer V2 bleibt unverändert.
- WR `raster_mosaic_contract.py` erlaubt das fehlende Zeitfeld **nur** für diesen expliziten diagnostischen OPERA-Preview-Aufruf. Normale V2-Anfragen brauchen weiterhin ein begrenztes `max_data_age_seconds`. Die gesonderte OPERA-Anfrage mit vorhandenem Age-Feld bleibt auf max. 900 begrenzt (Altvertrag).
- GR verlangt vom WR-Erfolgsvertrag eine ganzzahlige `max_age_seconds` zwischen 900 und 3600, verwendet die **tatsächliche WR-Frist** für einmalige Frischeprüfung und automatisches Schließen. Fehlende / fehlerhafte Antworten bleiben gesperrt; **kein GR-Fallback auf 900**.
- Andere Provider, normale Consumer-Routingpfade und die wissenschaftliche Freigabesperre werden nicht verändert.

## Quellcode- und Testnachweise

GR Commits: `f4dd92593886bd3e7c77363e9e0e78fe807ffcf9`, `67067bc545835587250e9deaea23c0d7f2dc51b7`, `e9b37e41673c69bc1c7618096be7eda786d10737`; Regressionstest `1fdacbbf1519e912dba02cb463511670304b72a6`.
WR Commit: `f9af771f410a92c55d4a80e99680305e01e99096`; Regressionstest `6f417e21eb97872649bd2975a4c88ad63369276d`.

**Ausführungsstatus:** Änderungen gespeichert; Regressionstests noch **nicht ausgeführt**. Keine Installations-/HA-Realabnahme und keine wissenschaftliche Rasterfreigabe. Der vollständige Architektur-Audit (weitere Providerentscheidungen in GR), Versionskonsistenz und automatische Generationserneuerung bleiben offen. Keine privaten GitHub Actions; Tests ausschließlich lokal oder nach Freigabe im öffentlichen Repository. Diagnose- und Realtestexporte ausschließlich nach `TheDaimos/Project-Log-And-Export@main`.

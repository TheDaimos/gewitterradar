# Wind-Kartenschalter – rahmenlos und frei konfigurierbar

**Stand:** 07.11.2026 · `deploy/dev` · Commit `0036110b1c4af0f49902246479e7f6c9c19c7c14`.

## Nutzerauftrag
Die kompakte gerahmte Darstellung durch das vorherige rahmenlose Premium-Originalbild ersetzen, Bild und Touchfläche von 42 auf 50 px (~19 % mehr) vergrößern. Verschiebbarkeit erhalten. Sichtbarkeit per Auswahl im Windmenü steuern.

## Implementiert
- 50×50 px rahmenloses Premium-Originalbild, unveränderte Quelle, keine neue SVG-Grafik.
- Dragging und positionsabhängige Speicherung unverändert; Kollisionsgeometrie an 50 px angepasst.
- Auswahlfeld **Kartenschalter anzeigen** im Windmenü mit: `Nur im Vollbild` (Standard), `In allen Kartenansichten`, `Nur Standard und Groß`, `Nirgends (ausblenden)`.
- Persistenter Konfigurationswert `quickVisibility` in der bestehenden Wind-LocalStorage-Konfiguration; kompatibler Standardwert `fullscreen`.
- Die bestehende zentralisierte Vollbild-/Kartenmodus-Synchronisation bleibt aktiv und liest den konfigurierten Sichtbarkeitsmodus.
- Windanimation, WeatherRouter, Datenfreigabe und Wind-Display-Einstellungen unverändert.
- Alle sechs geänderten Frontend-Moduldateien zwischen `frontend/`, `dashboard/dist/` und `custom_components/gewitterradar/frontend/` über Git-Blob-SHA abgeglichen.

## Status
**Implementiert, jedoch noch keine neue installierbare DRA-Version freigegeben.** Die bereits staged DRA-Identität 4.11.154/HA 0.25.61 muss für den neuen Quellstand mit Laufzeitmodulversionen, Prüfungen und Prüfsummen neu konsolidiert werden. Physische VM109-/Android-/iPad-Abnahme ausstehend. Keine Änderung an PROD, keine privaten Actions.

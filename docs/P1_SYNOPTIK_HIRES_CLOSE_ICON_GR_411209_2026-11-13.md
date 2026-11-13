# P1-Mini-Fix – rundes Hi-Res-Schließen-Icon im Synoptik-Premiummenü

**Datum:** 13.11.2026  
**Version:** GR 4.11.209 DEV · HA 0.25.116  
**Branch:** `TheDaimos/gewitterradar@deploy/dev`  
**WeatherRouter:** 0.10.322 DEV (nicht geändert)  
**Ziel:** HA DEV VM109; PROD VM101 unverändert

## Umsetzung

- Synoptik-Header: eckig wirkendes generisches Schließen-Control durch dasselbe vorhandene runde Original aus Wind-, Temperatur- und Darstellungsmenüs ersetzt (`deps.ABOUT_CLOSE_IMAGE`, mit `PREMIUM_CLOSE` als bereits vorhandener Asset-Fallback; `frontend/assets/gewitterradar-about-close-premium.webp`). Keine Bilddateien verändert.
- Wiederverwendbare `gr-premium-action`-Basis beibehalten; ausschließlich im Synoptik-Header `weather-synoptic-close` mit transparenter, runder 44×44-Pixel-Touchfläche und zentralem 34×34-Pixel-Original eingeführt. Position weiterhin rechts in `gr-premium-panel-actions`.
- Unveränderte `data-premium-action="close"`-Klickdelegation führt zu `_weatherSynopticClose()`. Minimieren, Verschieben/Drag, Scrollen, Farbpicker und Gestensteuerung bleiben auf ihren bestehenden Pfaden.
- Keine Änderungen an WR-V2-Abfrage, H/T, Isobaren, Frontsymbolen, Eye-Slot 5, Vault, Wind oder Niederschlag.

## Test und Auslieferung

Gezielter Regressionstest: `node --test tests/synoptic-close-icon-411209.test.mjs` prüft Originalasset, Rundform, 44-Pixel-Touchfläche, rechte Headerposition, Klickdelegation und Erhalt der Premium-Menübedienung. Für diese minimale Änderung ist keine neue Provider- oder Datenregression vorgesehen. Der Test prüft Quellstruktur und Event-Wiring; ein echter Fingertipp auf VM109 muss bei der nächsten realen Installation bestätigt werden.

Metadaten und Frontend-Spiegel der drei Auslieferungsorte werden auf `411209r1` synchronisiert. Die öffentliche DEV-Auslieferungs-CI erstellt die aktualisierten Integritätsprüfsummen und Pakete. Der vorhandene Modell-B-Lizenzstatus `NOASSERTION` bleibt unverändert.

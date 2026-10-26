# GR-OPERA-VIS-01 – Technische Frontend-Anbindung der echten WR-Entwicklungsvorschau (Teilstand)

**Datum:** 26.10.2026  
**Repository/Zweig:** TheDaimos/gewitterradar / ausschließlich `deploy/dev`  
**WeatherRouter-Vertrag:** V0.10.244 DEV / Loader 247, `docs/p7-010-coordination/WR_OPERA_VIS01_V010244_LOADER247_ECHTE_DEV_VORSCHAU_2026-10-26.md`  
**Gewitterradar-Version bei Beginn:** V4.11.109 DEV, noch **nicht** als neue installierbare Version hochgezählt.  
**Freigabe:** **GESPERRT – keine Realabnahme, keine DRA-Installation.**

## Tatsächlich durchgeführte Programmänderungen

1. `modules/weather/p7-010/opera-diagnostic-tile.js` auf den vorhandenen, getrennten WR-V2-Vorschauvertrag umgestellt: `weather_router/consumer/resolve_mosaic`, `source_request: {provider_id:"opera",product_id:"RATE",diagnostic:true,preview_orientation:"north_first"|"south_first"}`. Die alternative PNG-Route lautet ausschließlich `/api/weather_router/opera_preview/RATE/{stamp}/{hypothesis}/{z}/{x}/{y}.png`.
2. Positive Antworten werden **nur** bei `status=UNVERIFIED_DEV_PREVIEW`, `preview_only=true`, `raster_approved=false`, ausdrücklichem wissenschaftlichem Sperrstatus, identischer Kacheladresse, Quelle, Hypothese und transparenter NoData-Kennzeichnung angenommen. Gesperrte und unvollständige Antworten erzeugen einen sichtbaren Fehler.
3. Die bereits bestehende echte Leaflet-Kachelanbindung bleibt erhalten. Sie lädt PNG ausschließlich per authentifiziertem `fetch`/Bearer und `Blob`, ohne URLs oder Zugriffstoken ins Diagnoseprotokoll zu übernehmen. Das vorhandene 900-Sekunden-Limit sowie Abbruch und Freigabe der Objekt-URLs bleiben bestehen. Die beiden Orientierungsvarianten werden nicht wissenschaftlich bewertet.
4. `modules/weather/consumer-client.js`: Im bestehenden Weather-Engine-Diagnosefenster jetzt `OPERA-Vorschau`, Auswahl A (`north_first`) / B (`south_first`), Deckkraft und ausdrückliche Warnung. Die Auswahl betrifft ausschließlich die manuell gestartete Experimentalkartenebene. Änderung der Hypothese entfernt die bisherige Karte, damit keine alten Kacheln als neue Variante erscheinen.
5. Alle Änderungen wurden in `frontend/`, `custom_components/gewitterradar/frontend/` und `dashboard/dist/` zurückgeschrieben.

## Tatsächlich ausgeführte Prüfungen

- Originalen WeatherRouter-VIS-01-Bericht und Quellcode des V2-Servers und der getrennten HTTP-Vorschau eingelesen.
- Alle sechs geänderten Quelldateien nach GitHub-Commits zurückgelesen: **jeweils alle drei Spiegel bytegleich**.
- Statische Schutzanker für Opt-in, autorisierte HTTP-Abfrage, OPERA-Sperrstatus, Hypothese, Bedienung und Entfernung kontrolliert.
- Syntax-Parsen des angepassten `opera-diagnostic-tile.js` nach Entfernen von ES-Modul-Deklarationen erfolgreich.
- Für `consumer-client.js` ließ sich derselbe isolierte Parser wegen `import.meta` nicht verwenden; **keine Behauptung eines bestandenen Laufzeittests**.

## Noch offene Arbeiten für einen seriösen DEV-Testkandidaten

- Ausführbare Node-Regressionen im echten Repository ausführen, insbesondere `tests/test_gr_opera_diagnostic_pane.mjs`, `scripts/test-p7-010-opera-functional.mjs`, weitere relevante Weather-Engine-Prüfungen. Kontrollierten Kartenzoom, Bewegung, Opazität, Sperre und Seitenneustart prüfen.
- Die tatsächlich benutzte Kachelzeit, HTTP-Kopfwerte und das Verhalten von WR-Preview gegenüber den bestehenden Staging- und Registrierungsbedingungen auf HA DEV VM 109 live abnehmen.
- Eine neue konsistente DEV-Version samt Build-/Laufzeitkennung, Modulmanifest, Cache-Kennungen und nativer Integrationsversion erstellen. **Die vorliegenden Änderungen sind noch keine freigegebene neue Versionsinstallation.**
- Kontrolliert prüfen, dass sowohl die normale Niederschlagsdarstellung als auch der V1/V2-Wettereinsatz unabhängig von der OPERA-Vorschau bleiben. Die Zeitachse ist ausdrücklich nachrangig.
- WR-seitig zielgerichtete private Regression und ausdrückliche Betreiberfreigabe; `/config/.weather-router/opera-preview-vm109.authorized` mit Inhalt `VM109-UNVERIFIED-OPERA-PREVIEW` ausschließlich manuell auf HA DEV VM 109 anlegen, dort WR-Vorschau explizit einschalten. Keine automatische oder eigenmächtige Installation.

**Nicht erreicht:** Kein bestätigtes sichtbares Original-OPERA-Bild auf der echten Karte, keine erfolgreiche VM109-Realabnahme, keine wissenschaftliche Zulassung. Die Sperren bleiben bestehen.

C.K. – Eine Idee weiter gedacht.

# GR-R04-OPERA-02 – OPERA-V2-Quellenwunsch und sichere Rasterverweigerung

**22.10.2026 · `TheDaimos/gewitterradar@deploy/dev` · Referenz V4.11.106 DEV · keine Installationsfreigabe**

## 1. Vollständig geprüfte Eingänge

Die vollständige [verbindliche WR-F7-L24-Gegenantwort](https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/p7-010-coordination/WR_F7_L24_AN_GR_R04_OPERA_V2_QUELLENAUSWAHL_VERTRAG_2026-10-22.md) und der vollständige vorhandene GR-R04-OPERA-01-Bericht wurden per GitHub-Dateizugriff gelesen. Die vorhandenen GR-Dateien `frontend/modules/weather/display-menu.js`, `frontend/modules/weather/precipitation-layer.js` und `frontend/modules/weather/p7-010/raster-mosaic-consumer.js` wurden direkt untersucht. Bei WR ist derzeit **nur** ein negativ beantwortbarer, gezielter Quellenwunsch freigegeben; `raster_approved:true` wurde weder wissenschaftlich noch im HA-Betrieb nachgewiesen.

## 2. Tatsächlich entwickelte Programmänderung

**Commit `872f4881b0a3f35b5f9b2f12137717d123f895cd`** – Im **bestehenden** `raster-mosaic-consumer.js` akzeptieren `buildRasterMosaicV2Request` und `prepareRasterMosaicV2` einen optionalen `sourceRequest`-Wert. Ohne diesen Wert bleibt der bisherige automatische Niederschlagsvertrag unverändert. Ausschließlich `{provider_id:"opera",product_id:"RATE"}` wird angenommen, mit maximal 900 Sekunden angeforderter Frische. Der Aufruf sendet ausschließlich das WR-vertraglich nachgewiesene `source_request`, keine erfundenen Auswahlschlüssel, keine Providerliste und kein umgedeutetes `profile_id`.

Für eine explizite OPERA-Abfrage wertet der bestehende V2-Verbraucher die rückgesendete `source_request`-Identität, `provider_id`, `product_id`, `correlation_id`, `raster_approved`, `status` und `block_reason` aus. Alle Antworten liefern derzeit ausschließlich ein **nicht renderbares** Ergebnis `mode:"opera_blocked"` samt Sperrgrund und Diagnoseereignis `phase:"opera_status"`. Selbst eine überraschende künftige `raster_approved:true`-Antwort wird bis zur gesonderten Prüfung des positiven WR-Rastervertrags **nicht** als OPERA-Kachel dargestellt. Kein stillschweigender DWD-/NASA-Fallback und keine Veränderung von Gewitterradar-Kaltstart, V1, automatischem V2, Glättungsmodi, Transparenz oder Zeitspielern.

## 3. Testnachweise und Grenzen

**Commit `3a9164edb5ff5df587ee0c5f1a2c204a2b09080f`** fügt `tests/test_gr_r04_opera_02_contract.mjs` mit statischen Quellprüfungen für exakt feste OPERA-IDs, 900-Sekunden-Limit, nicht renderbare Antworten, Identität und bewahrte automatische V2-Defaults hinzu.

Die **acht entsprechenden statischen Suchprüfungen wurden tatsächlich** gegen den **von GitHub zurückgelesenen Originalquelltext** über die separate JavaScript-Ausführungsumgebung ausgeführt und meldeten jeweils `pass:true`. **Dies ist kein realer `node --test`-Prozess und kein funktionaler asynchroner V2-Test**, insbesondere wurden keine echten Fake-WebSocket-Antworten durch den Verbraucher geschickt, keine Browser-/HA-Tests durchgeführt und kein synthetisches Raster gerendert. Die acht Prüfungen sind daher **nur ein enger statischer Nachweis**.

**GitHub-Actions-Status bei Abfrage:** Für genau den Testcommit `3a9164edb5ff5df587ee0c5f1a2c204a2b09080f` wurden öffentliche GR-Actions-Läufe `39780079296` (`queued`), `39780079151` (`in_progress`), `39780079290` (`in_progress`) gesehen. **Keiner dieser Läufe war bei der Prüfung abgeschlossen; kein CI-PASS wird behauptet.** Weitere Läufe für Codecommit `872f4881b0a3f35b5f9b2f12137717d123f895cd` waren ebenfalls noch laufend. Eine spätere tatsächlich abgeschlossene Bewertung muss commitkorreliert nachgeholt werden.

## 4. Explizite Restarbeiten zur geforderten GR-Wetterebene

Die vollständige Aufgabe ist **noch nicht** erreicht. Insbesondere fehlt die tatsächliche auswählbare OPERA-Position im bestehenden Wetterebenenmenü, die verbindliche Verbindung dieser Auswahl mit dem neuen `sourceRequest`-Verbraucher, die gesicherte Abschaltung/Entwertung laufender OPERA-Anfragen bei Wechsel zu Automatik, die sichtbare Statuszeile sowie eine vollständige persistierte und exportierbare Nutzerdiagnose. Der jetzige Consumer ist **ein vorbereiteter, nicht automatisch aktivierter Schnittstellenbaustein**. Bloße Auswahl ohne bereits funktionierende Schnittstellenverdrahtung wäre eine irreführende OPERA-Ebene und wurde nicht als fertig dargestellt.

Vor jeder installierbaren Version sind mindestens funktionale WebSocket-Mocktests der tatsächlichen `disabled`-/`active_blocked`-Rückgaben sowie unzulässiger positiver und fremder Quellenidentität nötig, dazu vollständige UI-/Diagnoseintegration, Wechselregression mit Bewahrung der automatischen Niederschlagslage, Tests der 3 Frontend-Auslieferungsspiegel, echte neue erfolgreiche GitHub-Actions-Läufe und kontrollierte HA-DEV-Realabnahme.

## 5. Fortbestehende Sperren und Freigabeentscheidung

**Kein neues GR-DEV-Release, keine DRA-Installation, kein HA-Neustart, keine Änderungen an HA DEV VM109, HA PROD oder WeatherRouter.** OPERA-Raster bleibt gesperrt, da die WR-F7-L19-Native-, wissenschaftlichen Daten-, Lizenz-, UTC-, NoData-/Qualitäts- und Freigabebelege fehlen. Die GR-Standarddarstellung bleibt auf der bisherigen Referenz V4.11.106 DEV. **Entscheid: R04-02 noch nicht vollständig bestanden, kein DRA-V2-GO.**

**C.K. – Eine Idee weiter gedacht.**

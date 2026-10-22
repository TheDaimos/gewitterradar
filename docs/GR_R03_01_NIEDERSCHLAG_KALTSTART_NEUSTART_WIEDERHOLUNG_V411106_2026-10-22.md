# GR-R03-01 – Niederschlag nach Seitenneustart: Kaltstart-Lebenszyklus, begrenzte Wiederholung und bewachte Erstanfrage

**Datum:** 22.10.2026  
**Repository:** `TheDaimos/gewitterradar` · **Zweig:** ausschließlich `deploy/dev`  
**Ausgangsversion:** V4.11.105 DEV  
**Neue unterscheidbare Entwicklungsfassung:** **V4.11.106 DEV** · Build `V4.11.106-DEV-2026-10-22` · Runtime `411106r1` · Modulsatz `E411-106A1`  
**Native Integration:** `0.25.18`, bewusst unverändert.  
**Status:** gezielter Kaltstart-Hotfix im Entwicklungszweig; die endgültige CI-Lage ist separat unter Abschnitt 8 verifiziert. **Kein HA-REAL-PASS und keine Installation.**

## 1. Betreiberbefund und Evidenzgrenzen

Die gemeinsame GR-/WR-Realabnahme vom **22.10.2026** meldete, dass nach **Strg + Umschalt + R** auf **HA DEV VM 109** die Niederschlagsebene mehr als eine Minute unsichtbar blieb. Erst ein zusätzlicher Seitenneustart führte wieder zu einer sichtbaren Ebene. Der Betreiber nannte aus dem GR-Diagnoseexport die Ereignisse `stale_or_background`, `refresh_deferred`, eine etwa **11.921 ms** verschobene Folgeanfrage, nachfolgende erfolgreiche V2-Mosaikaktivierungen sowie einen erreichbaren WeatherRouter. WR-V2-Antworten lagen nach der übermittelten Gegenanalyse vielfach im Bereich einiger Dutzend Millisekunden.

**Wichtige Einschränkung:** Diese Ereigniszusammenfassung ist **kein beweissicherer vollständiger Ablauftrace** einer einzelnen Anfrage-/Layergeneration. Originale, korrelierte R03-Exportdaten mit sämtlichen Kachel-, Generations- und Sichtbarkeitswerten wurden in diesem Entwicklungsauftrag nicht neu als zusammenhängender Datensatz bereitgestellt. **Die eine eindeutige historische Ursache der beobachteten Minute ist deshalb nicht abschließend nachgewiesen.** Eine schnelle WR-Antwort beweist insbesondere nicht, dass die vollständige Leaflet-Kachelzeichnung schon sichtbar war; `stale_or_background` bedeutet nicht automatisch einen Backendfehler.

## 2. Technische Bestandsprüfung

**Produktiver Hauptpfad:** `frontend/modules/weather/precipitation-layer.js`, gespiegelt in `dashboard/dist/modules/weather/precipitation-layer.js` und `custom_components/gewitterradar/frontend/modules/weather/precipitation-layer.js`.

Für V2 werden die tatsächlich vorhandenen Module `weather/p7-010/raster-mosaic-consumer.js`, `raster-mosaic-contract.js`, `raster-mosaic-grid-layer.js` sowie der bestehende Kachel-Lebenszyklus benutzt. Keine zweite Mosaikarchitektur und keine Änderung an der WeatherRouter-Consumer-API.

Die vorhandene Methode `_refreshWeatherRadar` wurde zusammen mit diesen Kontrollpunkten analysiert:

- `_setWeatherRadarEnabled` startet nach Aktivierung eine erzwungene Anfrage und hält einen normalen periodischen Aktualisierungstimer vor.
- Ein fehlender Kartenbereich wird über `_weatherRadarEnsureMapHooks` und dessen verzögerte Initialisierung erneut geprüft.
- Die aktuelle Karten-/Viewportsignatur und `v2Generation` werden vor Nutzung von Entdeckungs-, V2- und V1-Antworten erneut verglichen. Überholte Antworten dürfen **nicht** aktiviert werden.
- `inFlightToken` verhindert, dass der verspätete `finally`-Block einer alten Anfrage eine bereits nachfolgende Anfrage entsperrt.
- `_weatherRadarTryMosaic` führt die vorhandene V2-Anfrage mit endlicher 20-Sekunden-Clientfrist aus; die anschließende Leaflet-Bereitstellung hat eigenständige Bildprüfungen.
- Bei einem technisch nicht nutzbaren V2-Mosaik bleibt der vorhandene V1-Fallback mit seinen Deckungs-, Alters-, Semantik- und UTC-Regeln bestehen.
- `_weatherRadarPreviousValid` und die bisherigen Abdeckungs-/Ablöseprüfungen erhalten eine zulässige Vorgängerebene, während ein Kandidat vorbereitet wird.
- `stale_or_background` verhindert ausdrücklich die Übernahme einer nicht mehr aktuellen Kachelgeneration.

**Nachvollziehbarer Risikopfad, aber nicht vollständige R03-Ursachenbeweisführung:** Schon vor dieser Änderung war bei fehlendem Bild eine erneute Anforderung vorgesehen, jedoch war der Mindestabstand durch
`Math.max(15000, viewportRefreshIntervalSeconds*1000)`
an das vom Benutzer gewählte Aktualisierungsintervall gekoppelt. Bei einem 60-Sekunden-Intervall konnte eine leere Karte dadurch auf diesen langen Abstand zurückfallen. Ein `refresh_deferred` mit ungefähr 11,9 Sekunden Restwartezeit ist zwar mit einer gebremsten erneuten Anfrage **vereinbar**, beweist aber weder den gesamten Ablauf noch einen WeatherRouter-Fehler. Außerdem prüfte der bestehende **35-Sekunden-In-Flight-Watchdog** nur während eines späteren Aufrufs von `_refreshWeatherRadar` oder beim Sichtbarkeitswechsel – eine dauerhaft hängende Erstanfrage musste somit nicht zeitnah wieder geprüft werden, wenn der reguläre Aufruf ausblieb.

## 3. Minimalinvasive Produktkorrektur

### 3.1 Von der normalen Aktualisierungsrate unabhängiger Kaltstart

Neue feste Kaltstart-Grenzen:

```javascript
const COLD_START_RETRY_MS = 8000;
const COLD_START_MAX_RETRIES = 3;
```

Für einen **tatsächlich fehlenden** `state.layer` wird der minimale Wiederholungsabstand nun auf 8 Sekunden begrenzt; bei gültigem vorhandenem Bild bleiben die alten Regeln für unveränderten Kartenausschnitt und nutzerkonfiguriertes Intervall bestehen. Unvollständige **bereits vorhandene** Rasterbilder behalten ihre spezifischen Schonungs- und Geometrieprüfungen.

Fehlt nach einer korrekt abgeschlossenen Anfrage immer noch ein Raster, wird eine **zusammengefasste** Folgeanfrage mit 8 Sekunden Abstand vorgesehen – **höchstens drei Kaltstart-Wiederholungen**. Der Zähler wird bei sichtbarem Layer zurückgesetzt und beim Abschalten des Niederschlags gelöscht. Nach Ausschöpfen wird statt einer Endlosschleife der Zustand `cold_start_retry_exhausted` gemeldet.

### 3.2 Separate Freigabe einer festhängenden Erstanfrage

Nur bei **fehlendem Vorgängerraster** wird während einer gestarteten Anforderung ein zeitlich begrenzter **36-Sekunden-Überwachungszeitgeber** registriert. Er prüft vor jeder weiteren Handlung erneut, ob das Projekt eingeschaltet, kein Layer aktiv und genau der damals gestartete `inFlightToken` noch gültig ist. Nur dann ruft er die bestehende Methode `_weatherRadarRecoverExpiredRequest` auf; diese invalidiert die betroffene `v2Generation`, bricht ausstehende Kachelvorbereitungen ab und löst die Sperre. Der Überwachungszeitgeber plant danach – wiederum unter **derselben Gesamtgrenze von maximal drei Kaltstart-Wiederholungen** – eine neue Anfrage. Alte V2-/V1-Antworten bleiben über den vorhandenen Generationenvertrag strikt ausgeschlossen.

Die alte Anfrage darf nachträglich aufgelöst werden, ihr `finally`-Block darf aber nur bei unverändertem `inFlightToken` den aktuellen Sperrzustand verändern. Zeitgeber werden beim normalen Abschluss und bei einer expliziten Sperrenfreigabe entfernt. Dies ist kein paralleler Dauerdienst und keine Blockierung des Browser-Hauptthreads: es werden normale einmalige asynchrone `setTimeout`-Aufrufe benutzt.

### 3.3 Klarer Lade- und Fehlerzustand

Die vorhandene Wetter-Engine-Statusanzeige zeigt während des erneuten Versuchs `Niederschlagsbild wird geladen · erneuter Versuch n/3 …` und bei nachgewiesener Ausschöpfung eine explizite Fehlermeldung. Die bestehende Zustandstabelle enthält nun zusätzlich einen dauerhaft darstellbaren deutschen Text für `cold_start_retry_exhausted`, statt bei einer späteren Oberflächenaktualisierung wieder auf eine allgemeine Warteanzeige zurückzufallen.

Die Diagnoseereignisse `missing_raster_retry_scheduled`, `cold_start_request_recovered` und `missing_raster_retry_exhausted` dokumentieren Versuchszähler, Wartezeiten und Ursache. Provider- und personenbezogene Diagnosedaten werden nicht neu gespeichert.

## 4. Geschützte bestehende Produktverträge

Unverändert gelten:

- **UTC-/Aktualitätssemantik:** WetterRouter-Quellenzeit, `valid_at`, `age_seconds`, `freshness_class`, Satelliteneinwilligung und die jeweils zulässigen Zeitfenster.
- **Consumer V1/V2:** kein neuer Aufrufname, kein zweites Mehrquellenmosaik, keine Änderung der Quellenrangfolge oder des Fallbackvertrags.
- **Asynchroner Generationsvertrag:** verworfene Antworten werden **nicht** durch den Retry-Schutz auf die Karte geschrieben; `pendingForce`, `v2Generation`, `inFlightToken`, `viewport.signature` werden weiter geprüft.
- **Vorgängerbilder:** eine noch zeitlich und räumlich zulässige Wetterebene bleibt während einer Erneuerung erhalten. Die spezielle Kaltstartbehandlung greift nur, wenn **kein** Layer vorhanden ist.
- **Sicherheit:** Authentifizierung, Endpunkte, Rechte, Ressourcenbudgets und begrenzte Provideranfragen unverändert. Keine WeatherRouter-Codeänderung; keine Änderung an Home Assistant.
- **Optische Darstellung:** keine Änderung der Wolkenprofile, des Darstellungsmenüs oder der vier Niederschlagsweichzeichnungsmodi.

## 5. Reproduzierbare Regressionen

**Neu:** `scripts/test-gr-r03-01-cold-start.mjs`, im bestehenden Integrationsworkflow `.github/workflows/validate.yml` aktiviert.

Der Node-Test lädt den **wirklichen produktiven** `installWeatherRadar`-Modulcode und simuliert kontrollierte Verbraucherantworten, ohne ein eigenes Renderverfahren zu bauen. Getrennte Prüffälle:

1. **Kein Vorgängerbild:** wiederholt nicht verfügbare Erstantworten; prüft 8-Sekunden-Wiederholung auch bei konfigurierten 60 Sekunden.
2. **Begrenzung:** exakt drei kurze Wiederholungsansätze und anschließend Diagnose `missing_raster_retry_exhausted` ohne weitere automatische Kurzschleife.
3. **Gültige Vorgängerebene:** bei vorhandenem Layer kein erneuter Kaltstart-Wiederholungslauf; Zähler wird zurückgesetzt.
4. **Veraltete Antwort:** eine während der Discovery veränderte `v2Generation` führt nicht zur V2-Aktivierung. Die erneute Anforderung bleibt im vorhandenen `pending`-Mechanismus.
5. **Festhängende Erstantwort:** simulierte noch nicht abgeschlossene Entdeckung, kontrollierte Auslösung des echten 36-Sekunden-Überwachungsrückrufs und Prüfung, dass danach höchstens drei Wiederholungen statt einer Endlosschleife anfallen. Die währenddessen abgelöste ältere Anfrage darf den neueren Zustand nicht überschreiben.
6. **Deaktivierung:** beim Ausschalten wird das Retry-Budget zurückgesetzt.

**Weiterhin vorhandene Regressionen** in demselben GitHub-Frontend-/Integrationssatz prüfen P7-010-Consumer-, Vertrags-, Coverage-, Kachel- und Mosaikbedingungen, Android-Vordergrundwiederaufnahme, Browser-/Raster-Laborprofile, Auslieferungsspiegel und Versionsidentität. Der Test `scripts/test-v41195-android-foreground.mjs` wurde ausschließlich in seiner alten festen 15-Sekunden-Erwartung an den neuen 8-Sekunden-Kaltstartvertrag angepasst, ohne die zugrundeliegenden Assertions zu entfernen. Alte statische Modulversions-/Datumsannahmen in weiteren Tests wurden entsprechend der **wirklich geänderten** Version fortgeschrieben.

**Evidenzgrenze:** Die synthetischen Testfälle beweisen den Anfragelifecycle und die Sperr-/Retry-Verträge, nicht das zuverlässige tatsächliche Zeichnen eines konkreten Wetterrouter-Mosaiks auf VM 109 nach `Strg + Umschalt + R`. Diese Realprüfung erfordert weiterhin den Betreiber und korrelierte neue Diagnoseexporte.

## 6. Version, Spiegel und Lieferintegrität

Die neue **V4.11.106 DEV** ist absichtlich unterscheidbar von der vorigen Installation. Die Versionselemente lauten:

| Kennung | Zielstand |
| --- | --- |
| Produkt | `4.11.106` / `V4.11.106 DEV` |
| Build | `V4.11.106-DEV-2026-10-22` |
| Runtime | `411106r1` |
| Modulsatz | `E411-106A1` |
| Niederschlagsmodul | `weather.precipitation-layer` **1.3.20** |
| Native Integration | `0.25.18` (**unverändert**) |
| Entwicklungszweig | **`deploy/dev`** |

Sämtliche geänderten Frontendmodule liegen synchron unter `frontend/`, `dashboard/dist/` und `custom_components/gewitterradar/frontend/`; zentrale Version, Browsercachekennung, Runtime-Manifest und abhängige unveränderte Prüfverträge wurden fortgeschrieben. `frontend/assets.json` enthält die SHA-256 des neuen Runtime-Manifests `ea6c3513e5f553a1b78d960d39cd44cd5983c3e4b6410c5caa268c5a2fbeb669`. In `SHA256SUMS_FRONTEND.txt` wurden die zwölf angepassten installierbaren Frontend-Spiegeldateien mit tatsächlichen SHA-256-Werten nachgerechnet und die Liste sortiert. Eine nachfolgende Klarstellung des Fehlerstatus erhielt eine eigene erneut berechnete Niederschlagsmodulprüfsumme (`97ff354499b5a73ddb58f9d4ae791c6f22c522a1377419c0a0e1207e6303f3fc`).

## 7. Abgetrennte R03-Nebenbefunde

Die Auffälligkeiten der neuen **aktiven Wetterebenenübersicht**, zeitweise eingeschränkte Erreichbarkeit des Darstellungsfensters, Android-Verschiebung/Positionierung sowie die bislang nicht überall vollständig sichtbaren Quelle-/Alter-/Qualitätsangaben werden **als eigenständige UI-/Diagnoseaufträge** behandelt. Der hier gezielt untersuchte P1-Kaltstart ist kein Anlass, bestehende Fensterbewegung, Ebenenlogik oder Fachinformationen ungeprüft umzubauen.

## 8. Tatsächlich ausgeführte GitHub-Prüfläufe und endgültiger Programmcommit

Die verbindlichen drei Push-Prüffamilien am finalen Programmcommit sind:
- **Einstellungen und Laufzeitidentität:** `V4.11.106 settings navigation and runtime identity`.
- **Gewitterradar-Integration:** Paket- und Sicherheitsvertrag, HACS-/hassfest-Prüfungen und `home-assistant-runtime`.
- **Gemeinsames Frontend:** Modulvertrag, beide Auslieferungsspiegel, SHA256-Inventar, bestehende und neue R03-Regressionen.

Bei den ersten echten Testausführungen wurden feste, noch auf 1.3.19, V4.11.105 beziehungsweise 15-Sekunden-Kaltstart ausgerichtete Assertions identifiziert und berichtigt. Die neuen Kaltstart- und Watchdog-Simulationen wurden durch die ursprünglichen fachlichen Bedingungen nicht abgeschwächt. **Die genauen finalen CI-Ergebnisse, Run-IDs und der eingefrorene Ziel-SHA werden nach tatsächlicher abschließender GitHub-Rückprüfung im Schlussprotokoll ergänzt**. Bis dahin liegt ausdrücklich **keine behauptete endgültige CI-Freigabe** vor.

## 9. Betreiberseitige DEV-Realabnahme und Installationssperren

**Keine DRA-Installation durchgeführt. Keine Änderung an HA DEV VM 109 oder HA PROD VM 101.**

Nach einer gesonderten Betreiberentscheidung und vollständiger CI-Prüfung kann der Entwicklungsstand über **DRA V1** als **Einzelprojekt** aus `TheDaimos/gewitterradar@deploy/dev` mit eindeutigem geprüften Commit auf **VM 109** installiert werden. Vor dem Schreiben die bisherige wirklich installierte Version, eine tatsächlich rückspielbare Sicherung und deren Kennung, Ziel-VM, Ref/Commit, Projektliste sowie die im DRA-Vertrag geforderte Home-Assistant-Neustartsequenz überprüfen.

Danach ausschließlich auf DEV: Karte mit aktiviertem Niederschlag öffnen, **Strg + Umschalt + R** ausführen; Zeitpunkt in UTC, sichtbares Bild, aktives API V1/V2, Correlation-ID, Kachelstatus, Retry-Ereignisse und Verlauf von `stale_or_background`/`refresh_deferred` dokumentieren. Mehrfach unter unverändertem sowie verändertem Ausschnitt prüfen, zeitgleich gültige alte Ebenen erhalten, V1-Fallback nur bei wirklich ungeeignetem V2 durchlaufen lassen, bei fehlender Quelle eine explizite Fehlermeldung kontrollieren. Diagnoseexporte gehören in **das private** `TheDaimos/Project-Log-And-Export`; keine realen Standort-/Zugangsmetadaten öffentlich hinterlegen.

**Freigabegrenze:** Auch drei grüne CI-Prüfläufe wären **kein HA-REAL-PASS**. Ein endgültiger P1-Abschluss setzt einen reproduzierbar erfolgreichen Neustart-Realtest auf VM 109 voraus.

**C.K. – Eine Idee weiter gedacht.**

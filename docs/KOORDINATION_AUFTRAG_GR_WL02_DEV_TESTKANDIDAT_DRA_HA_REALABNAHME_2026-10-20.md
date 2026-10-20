# Bootstrap Daimos – GR WL-02: kontrollierten DRA-DEV-Testkandidaten vorbereiten

**Datum:** 20.10.2026  
**Empfänger:** Gewitterradar-Entwicklungschat (**GR**, NICHT WeatherRouter-Entwicklungschat)  
**Repository:** `TheDaimos/gewitterradar`; Entwicklungszweig **ausschließlich** `deploy/dev`  
**Ausgangsversion:** Gewitterradar **V4.11.99 DEV**, Runtime `41199r1`, Modulset `E411-99A1`, HA-Integration `0.25.17`, `weather.layer-menu` `1.1.5`  
**Stand beim Erstellen dieses Auftrags:** GR-`deploy/dev`-HEAD `84b06690b7f44d0b82fd6ab32723bed8f4cb06d5`; jüngster nachweislich fünfmal grün getesteter fachlicher Programmcommit `169bac89850b6c5fe542d9f90897041bc3ebb199`. Vor Änderungen HEAD/CI erneut prüfen.  
**Art:** Neuer Anschlussauftrag zur **Testbereitstellung und späteren echten HA-Realabnahme**, kein produktiver Releasebefehl.

## 0. Warum dieser Auftrag notwendig ist

**WL-02 ist im bisherigen Umfang weitgehend implementiert:** GR besitzt einen providerneutralen WeatherRouter-Consumer-V1-Adapter für zwei zusätzliche schaltbare `raster_tile`-Wetterebenen:

- `weather.satellite.clouds` (Wolken/Satellitenbild)
- `weather.model.wind_10m.layer` (Windkarten in 10 m Höhe)

Die jüngsten GR-Fehler in der Rasterwarteschlange (max. 8 gleichzeitig, 64 wartend, FIFO/Abbrüche) und bei Weltkopien/Antimeridian-Geometrie sind behoben; die fünf zugehörigen öffentlichen Prüfläufe sind erfolgreich.

**Die ausstehende HA-Realabnahme ist kein guter Grund, einen kontrollierten DEV-Testkandidaten auf unbestimmte Zeit nicht einmal vorzubereiten.** Eine HA-Realabnahme braucht einen tatsächlich installierbaren, statisch und automatisch geprüften Testkandidaten. Daher sind künftig **DEV-Testinstallationsfreigabe** und **vollständige Real-/Produktfreigabe** ausdrücklich voneinander zu trennen.

Dieser Auftrag autorisiert **nicht** eigenmächtig die Installation, den Rollout auf HA PROD oder die Behauptung, die beiden WR-Datenquellen seien bereits tatsächlich lieferfähig. Er autorisiert die sorgfältige **Vorbereitung, Prüfung und bedingte Freigabe eines HA-DEV-Testpakets**, das der Benutzer später bewusst per DRA installieren kann. Bestehende Vertrags- und Schutzprüfungen dürfen nicht abgeschaltet oder umgangen werden.

## 1. Verbindliche Lektüre und Nachweisbasis

**Vollständig lesen und die aktuellen GitHub-Dateien/HEADs prüfen, statt aus dieser Momentaufnahme weitere Fakten zu erfinden:**

1. **Jüngster fachlicher GR-Bericht (maßgeblicher Fortschritt):**  
   `docs/V4_11_WL_02_P1_A_B_C_D_FORTSETZUNG_KACHELBUDGET_DATUMSGRENZE_CI_HA_OFFEN_2026-10-20.md`
2. **Vollständige GR-Entwicklungsübergabe (historischer Basisstand):**  
   `docs/HANDOFF_GR_V41199_WL02_CI_PASS_HA_REALTEST_OFFEN_2026-10-20.md`
3. Ursprünglicher Auftrag:  
   `docs/V4_11_WL_02_GENERIC_WR_RASTER_RENDERER_ENTWICKLUNGSAUFTRAG_2026-10-19.md`
4. Vorarbeiten: `docs/V4_11_WL_02_FORTSETZUNG_ZEICHENSTATUS_UTC_CI_2026-10-19.md`, `docs/V4_11_WL_02_KOORDINATION_CI_IMPLEMENTIERUNG_PRUEFBERICHT_2026-10-19.md` und `docs/GR_RF04_ABSCHLUSS_V41199_CODE_CI_HA_STATUS_2026-10-19.md`.
5. **WR Consumer V1, reale Vertragsgrenze:** `TheDaimos/weather-router-dev@deploy/dev/docs/CONSUMER_API_V1.md`; aktuellsten `consumer_capability_map.json`-Vertrag im tatsächlich vorhandenen Pfad prüfen. Weder `available` noch eine Kataloganzeige beweist `ready` oder tatsächliche Pixel.
6. **Unabhängige OPERA-F7-Gegenstelle – nur zur Abgrenzung, kein WL-02-Blocker:**  
   https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/p7-010-coordination/WR_F7_FORTSETZUNG_HTTP_WARTESCHLANGENLIMIT_CI_HA_BLOCKER_2026-10-20.md
7. **Verbindlicher Übergabestandard:**  
   https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/p7-010-coordination/REGEL_GR_WR_ENTWICKLUNGSANTWORTEN_MD_GITHUB_DIREKTLINK_2026-10-19.md

**Nicht erneut entwickeln:** V1-Wolken-/Windbasis, WR-`spatial_coverage`/global/Datumsgrenzen, kanonische XYZ/WMS-Kachel-URL, begrenzte FIFO-Konkurrenz, Leercanvas/`drawImage`-Status, explizite UTC-Offsetnormalisierung, 300-s-Sichtbarkeitsaktualisierung, Legenden-HTTPS-Link, Abbrüche/Lifecycle, vorhandene Prüfsummensynchronisierung und GR-RF-01–04-Bestand. Nur bei neu nachgewiesener Regression nacharbeiten.

## 2. P1 – Testinstallationskandidat statt Realabnahme-Zirkelschluss

**Prüfe zuerst**, ob der aktuelle `deploy/dev`-Quellstand mit seinen bestehenden Paket-/Integrations-/DRA-Verträgen **ohne neue Hauptarchitektur** als **explizit nicht produktiver HA-DEV-Testkandidat** bereitgestellt werden kann.

1. Untersuche die tatsächlichen Versions-/Laufzeit-/Modul-/HA-`manifest`-/HACS-/Frontend-/Dashboard-/Cache-/SHA-/GitHub-Prüfverträge sowie DRA-Installationsvoraussetzungen direkt aus dem Repository. Benutze vorhandene Abläufe, keine zweite Bereitstellungslösung.
2. Entscheide nachvollziehbar zwischen:
   - **A: Geeignet** – alle statischen Code-, Versions-, Auslieferungs- und Regressionstests bestanden; sichere, rückfallfähige **Testinstallationsvorbereitung** möglich, obwohl echte WR-Pixel noch nicht geprüft sind.
   - **B: Nicht geeignet** – nenne den **konkret belegten** blockierenden Code-/Paket-/Sicherheitsfehler, behebe ihn soweit eigenständig möglich und prüfe erneut. Keine Installationsfreigabe bei roten kritischen Tests, nicht vorhandenen WR-API-Verträgen oder unsicherer Paketidentität.
3. **Bei A**: Bereite **genau eine** konsistente, eindeutig neue **DEV-TEST-Version** für HA DEV vor. Bestimme die nächste Versionskennung anhand der realen bestehenden Versionierung, nicht durch blindes Übernehmen eines Musterwerts. Version/Runtime/Modulset/HA-Integration/Asset-Abfragekennungen/Dashboard-Auslieferung/Prüfsummen/Release-Hinweise nur dort ändern, wo sie laut vorhandenen Projektverträgen geändert werden müssen; Änderungen in allen betroffenen Auslieferungsbäumen bytegleich und vollständig. Eine neue Version ist **kein** HA-REAL-PASS.
4. Stelle sicher, dass DRA die **richtige Referenz `deploy/dev`**, den zugehörigen tatsächlich festgeschriebenen Commit und die neue Testversion unverwechselbar darstellen kann; installierte Version vs. Zielversion, Commit, ausgewählte Ref und erforderliche Neustart-/Cachehinweise eindeutig dokumentieren. DRA selbst nur ändern, wenn ein konkret belegtes Bereitstellungsproblem besteht und dies in den dafür zuständigen DRA-Bereich gehört.
5. Erzeuge ein präzises **Rollback-Verfahren**, das den vorangehenden nachweislich funktionierenden GR-DEV-Stand und seinen Commit nennt (diesen zuerst ermitteln). Keine ZIP-/Manifest- oder DRA-Dummyfreigabe, kein von einem ungeprüften Branch gezogener Stand.
6. Die bedingte **Freigabe zur kontrollierten Testinstallation** gilt **nur für die autorisierte HA-Entwicklungsinstanz**, nur nach vollständigem grünem Code-/CI-/Paket-/DRA-Vorprüfungsgate und **nach ausdrücklicher Zustimmung des Benutzers zur konkreten Installation**. **Keine automatische DRA-Installation, kein PROD, keine neue WR-Version und keine voreilige Aussage „real abgenommen“.**
7. Sofern echte WR-Quellen aktuell `unavailable` liefern, muss die installierte GR-Oberfläche **ehrlich „keine geeignete Quelle/kein Bild“** anzeigen; sie darf keine fiktive Tile-URL, Produktfreigabe oder erfolgreiche sichtbare Wetterschicht erzeugen. Dieser Zustand verhindert nicht die isolierte Prüfung, ob GR seinen Vertrags-/Fehlerpfad korrekt verarbeitet; er verhindert aber den **vollständigen WL-02-Real-PASS**.

**Wichtig:** Diese Testinstallationsentscheidung ist eine *bewusste Änderung der bisherigen strengen Endabnahme-Reihenfolge*, **nicht** eine rückwirkende Freigabe aus dem alten Prüfbericht. Die Freigabestufen müssen im neuen Bericht getrennt und begründet werden.

## 3. P2 – Alle ohne HA möglichen Prüfungen vor dem DRA-Testangebot

Nach dem tatsächlichen letzten Codecommit und der finalen Versions-/Paketidentität sämtliche betroffenen automatisierten Tests und **öffentliche GitHub-Actions-Pushprüfungen** mit echten Job-/Run-IDs kontrollieren; keine übersprungenen oder als Erfolg gezählten roten Läufe.

Mindestens:
- Der generische Wolken-/Wind-Consumer-V1-Vertrag: Discovery/Capabilities/Resolve, korrektes `ready/raster_tile` vs. `unavailable`, fachliche Semantik und Provenienz, sichere HTTPS-/XYZ-/WMS-Vorlage, `spatial_coverage`, Rechts-/Profil-/Coverage-Sperren und UTC-/Datenalter.
- 8/64-WL-02-FIFO-Warteschlange, Queuefull, Abbruch und Kartenwechsel; Datumsgrenze, Weltkopien, BBOX, Canvas-`drawImage` vs. echte leere Pixel; HTTPS/CORS-Ladefehler; Vorder-/Hintergrund-Timer 300 s, Reconnect, Zoom-/Fenster-/Vollbild-/Android-/iPad-Regressionsschutz soweit automatisierbar.
- P7-010-Niederschlags-V1/V2, GR-RF-01–04, DWD-/NASA-Coverage, Zoom, V1-Fallback, UTC-Radar 900 s und NASA 43.200 s nur mit Opt-in. Keine zweite Mosaik- oder Providerwahlarchitektur.
- Integrationspaket, HACS/Hassfest, Lader-/Asset-/Version-/Runtime-Spiegel, Prüfsummen und gegebenenfalls DRA-Verifikationsworkflow auf **exakt demselben zu installierenden Codecommit**.
- Falls die neue DEV-Testversion **keine** echt passende, funktionierende WR-V1-Quelle besitzt, eine **klare negative oder vorläufige Diagnose** im Bericht, keine grünen Pixelbehauptungen und kein Weglassen fehlschlagender Sicherheitsprüfungen.

Die fünf zuletzt bereits erfolgreich geprüften GR-Läufe (**am Programmcommit `169bac89850b6c5fe542d9f90897041bc3ebb199`**) sind historisch gültig und **nicht zu wiederholen**, sofern sich deren geschützte Dateien/Versionen nicht geändert haben. Bei tatsächlicher neuer Versionierung jedoch neue relevante Pushprüfungen am neuen Code-/Paketstand ausführen.

## 4. P3 – Kurzer, eindeutiger HA-DEV-/Browser-Realtestplan nach Freigabe

Wenn der Kandidat für eine Installation bereit ist, dem Benutzer eine **konkrete** DRA-Anweisung mit Quellref, Commit, Testversion, Umgebung, Prüfsummen/Verifikation und Rückfallstand bereitstellen; erst nach Benutzerfreigabe ausführen lassen.

Anschließend die Diagnosen **getrennt** erfassen und gemeinsam korrelieren:

1. Vor-/Nachstand von GR und WR in HA dokumentieren: installierte Versionen, vollständige Referenzen, Aktivität des WR-Consumer-V1-Profils. Keine Behauptung aus Git-HEAD allein.
2. Für `weather.satellite.clouds` und `weather.model.wind_10m.layer` jeweils echte `discovery`, `capabilities`, `resolve` für aktuelles BBOX und `time:{mode:"latest"}`: Ergebnis `ready` oder `unavailable`, `resource.semantics`, `provenance`, Quellenzeit UTC, Coverage, Attribution, Berechtigungen.
3. **Nur bei tatsächlichem `ready/raster_tile`**: echten HTTPS-Kachelabgriff und sichtbare, nicht nur über `drawImage` gezählte Nutzpixel, passende geografische Einpassung, native Zoomstufen, transparente NoData-Anteile, Legende/Einheit, Beobachtung vs. Modell und Lizenzangaben belegen. Falls `unavailable`, sauber als WR-Verfügbarkeits-/Routingthema melden, nicht einen GR-Rendererfehler erfinden.
4. Wolken/Wind einzeln und zusammen mit laufendem Niederschlagsmosaik prüfen; schnellen Karten-/BBOX-/Datumsgrenzenwechsel, Mobile/Desktop, Vollbild, Fensterwechsel, Hintergrund, Wiederverbindung, Abbrüche und Aktivierung/Deaktivierung. **Gemeinsame** CPU/RAM/Netzlast statt nur des isolierten 8/64-WL-02-Planers messen. Bei auffälliger Belastung abbrechen und Rückfallplan anwenden.
5. GR-RF04-`DWD coverage_timeout`-Echtfall bleibt **separat offen**, bis natürlicher/korrelierter Realverlauf vorliegt. Keine künstlichen Eingriffe bei produktiven Wetterprovidern.
6. Private Roh- und Export2Git-Diagnosen einschließlich Koordinaten **ausschließlich** `TheDaimos/Project-Log-And-Export@main` aufbewahren. Keine vollständigen Diagnosen oder Zugangsdaten ins öffentliche GR-Repo.

**Nur** bei belegtem echten Bild-/Vertrags-/Ressourcenbetrieb für beide Capabilities darf WL-02 einen entsprechenden **HA-REAL-PASS** erhalten. Eine erfolgreiche Testinstallation oder sichtbare Schaltflächen allein genügen nicht.

## 5. Abgrenzungen / optionale Gestaltungsidee

- **WeatherRouter OPERA F7** ist ein eigenständiger Niederschlags-/Reflektivitätsentwicklungszweig, derzeit **nicht installiert und nicht freigegeben**. Sein Rasterio-/musllinux-Paketblocker ist **kein** Grund, die bereits implementierten **V1-Wolken-/Windebenen** in GR nicht auf sichere Testinstallierbarkeit zu prüfen.
- **GR baut keinen OPERA-Provider oder zusätzlichen Kachelserver.** Die gesonderte F14-/OPERA-Auth-Browseranbindung über `fetch`/Bearer/`Blob`/lokale `blob:`-URL bleibt ein späteres, eigenes gemeinsames Integrationsgate.
- **WL-03 und WL-04** bleiben unverändert außer Auftrag; keine neue UV-/Temperatur-/Pollen-/Ereignis-Schicht nur wegen dieser Testbereitstellung.
- Zusätzlich hat der Benutzer eine spätere **runde Informationsschaltfläche `ⓘ` in/bei der GR-Legende** vorgeschlagen, die tatsächliche Bildzeiten, Herkunft, Aktualität, Gültigkeit, UTC und die in Home Assistant eingestellte lokale Zeitzone zeigt. Dies als **separaten UI-Folgewunsch** in die GR-Aufgabenliste aufnehmen, **nicht** als Voraussetzung für die jetzt angeforderte Testversion implementieren. Intern bleibt UTC unumstößliche einzige Providerzeitbasis; der HA-Zeitzonenwert wird lediglich für die Anzeige benutzt. Keine fiktiven Bildzeiten.

## 6. Erwartetes eigenständiges Ergebnis, getrennte Gates und Kommunikation

Bearbeite so weit wie möglich **eigenständig**, ohne Routine-Rückfragen, zusätzlichen Zweig oder unnötige Zwischenversionen. Fertige keine reine Bestandswiederholung an. Falls der sichere Testkandidat nicht möglich ist, dokumentiere einen **konkreten reproduzierbaren** blocker und behebe alle ohne HA möglichen Punkte.

**Pflichtfelder des Abschlussberichts:**
- Exakter GR-/WR-Ausgangs- und Abschlussstand samt Code-/Paketcommit und Version; Liste tatsächlich geänderter Dateien.
- **DEV-Testkandidat vorbereitet: JA/NEIN** – bei JA genauer neuer Build/Ref/Commit/DRA-Ablauf plus Rollback, bei NEIN technische Begründung.
- **CODE-PASS**, **öffentlicher CI-PASS**, **DRA-Paket-/Testinstallationskandidat**, **tatsächliche Installation**, **HA-REAL-PASS**, **Produktionsfreigabe** als **sechs getrennte Zustände**.
- Tatsächliche Jobs/Runs und echte Fehler-/Skip-Nachweise.
- Echte WR-V1-Fähigkeit oder nachweisliches `unavailable`, keine aus dem Katalog erfundene Live-Verfügbarkeit.
- Klarer Nutzer-Realtestauftrag für HA DEV, erst nach bestandener Testbereitstellungsprüfung.
- Keine eigenmächtige Installation, keine ungetestete neue WR-Funktion, kein schon behaupteter HA-PASS.

**Verbindliche Antwortregel:** Zuerst die **vollständige** technische Entwicklungsantwort als echte Markdown-Datei **auf `TheDaimos/gewitterradar@deploy/dev/docs/` speichern und committen**. Danach dieselbe Datei von GitHub **lesend prüfen**. Dem Benutzer anschließend **ausschließlich einen einzigen kopierbaren Satz mit dem vollständigen ausgeschriebenen echten GitHub-Direktlink** zur Datei geben. Kein Download-Ersatz und keine erfundenen Pfade. Kennzeichnung außerhalb des Einzeilers: **Ziel GR**.

**C.K. – Eine Idee weiter gedacht.**

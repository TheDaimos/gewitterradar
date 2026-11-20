# Gewitterradar V4.11.82 / P7-010 – Ausführliche Chatübergabe
**Stand:** 16. Oktober 2026; nach GitHub-Bestandsprüfung und vor weiterer Entwicklung  
**Verbindliches Projekt dieses Chats und aller aus dieser Übergabe gestarteten Chats:** GEWITTERRADAR  
**Auftrag:** P7-010 auf dem bestehenden V4.11.82-Stand fertigstellen und verproben. WeatherRouter ist nur externe, bereits bestehende Daten- und Routing-Schnittstelle.  
**Status:** P7-010 ACTIVE / EXPERIMENTELL. KEIN REAL-PASS. KEINE DRA-FREIGABE.

## 1. Verbindliche Projektgrenze

Dieser Entwicklungsstrang gehört ausschließlich zu Gewitterradar. Keine Änderungen an TheDaimos/weather-router-dev, WeatherRouter-Extensions oder dem öffentlichen synthetischen Prüf-Repository in diesem Chat. Ist eine WeatherRouter-Änderung wirklich erforderlich, Ursache, API-Erwartung und Reproduktionsfall schriftlich als Auftrag für den separaten WeatherRouter-Chat festhalten. Keine doppelte Routingarchitektur, keinen zweiten Wetterprovider-Selektor in Gewitterradar bauen. Gewitterradar visualisiert und bedient den WeatherRouter-Consumer; WeatherRouter entscheidet über Eignung, Quellen, Routing, Geografie, Semantik und Profile. Keine Ortsverwaltung in WeatherRouter. V1 muss als unabhängiger, stabiler Rückfall erhalten bleiben.

Die zusätzliche parallele WeatherRouter-Entwicklung im bisherigen Chat war eine Zuständigkeitsverletzung. Sie ist isoliert, nicht zusammengeführt und ausdrücklich KEIN Auftrag zur Fortsetzung hier.

## 2. GitHub – überprüfter Ausgangsstand

- Repository: TheDaimos/gewitterradar
- Regulärer Auslieferungszweig: deploy/dev
- Reguläre geprüfte Ausgangsbasis: a11d37f7dc82c3f08def273812ee045f4c9b634b
- Aktueller P7-010-Entwicklungszweig: feature/p7-010-v41182-forward-port-2026-10-16
- P7-010-Codecheckpoint vor Erstellung dieser Übergabe: 1b2b1b2f4331830ca234bd4d8196dc1792649a26
- Entwurfs-PR #37: https://github.com/TheDaimos/gewitterradar/pull/37
- Letzter GitHub-Vergleich zum regulären deploy/dev am 16.10.: Zweig 61 Commits voraus, 0 Commits zurück, 42 geänderte Dateien. Die Dokumentationsänderung dieser Übergabe fügt einen weiteren Commit hinzu.
- PR #37 ist OPEN, DRAFT, unmerged; nicht bereitstellen oder automatisch zusammenführen.
- Veralteter isolierter P7-Zweig: feature/p7-010-integration-v41178-2026-10-14, PR #32; nur gezielt vorhandene Prototypen/Tests übernehmen, nicht das gesamte alte Frontend zusammenführen.
- Verbindliche ältere Ausgangsdokumentation: TheDaimos/weather-router-dev, Zweig docs/handoff-gr-v41182-autonomous-p7-010-2026-10-15, Datei docs/HANDOFF_GR_V41182_P7_010_AUTONOME_ENTWICKLUNG_2026-10-15.md. Diese Übergabe präzisiert den späteren tatsächlichen Gewitterradar-Stand.
- Früherer Checkpoint im eigenen Repo: docs/P7_010_V41182_FORWARD_PORT_2026-10-16.md; dessen Aussage „kein aktiver Mosaikrenderer“ ist durch die nachfolgenden Commits im selben Zweig ÜBERHOLT und darf nicht mehr als aktueller Stand gelesen werden.

### Identität der regulären V4.11.82

- Produktversion: 4.11.82
- Sichtbar: V4.11.82 DEV
- Build: V4.11.82-DEV-2026-10-15
- Runtime-Revision: 41182r1
- Modulkennung: E411-82A1
- Native Integration: 0.25.1
- Registrierte Module: 34
- Diese Werte beschreiben die bestehende ausgelieferte V4.11.82. Der P7-Zweig verwendet zurzeit noch dieselbe Kennung und darf daher NICHT als eigenständige DRA-Testversion behandelt werden. Vor Auslieferung eine konsistente neue DEV-Identität für alle Spiegel, Manifest/Metadaten und Prüfsummen herstellen; Versionsnummer nicht vorab erfinden.

## 3. Was im jüngsten Gewitterradar-Chat tatsächlich geändert wurde

1. Vorhandene P7-010-Hilfsbausteine gezielt auf der V4.11.82-Basis übernommen, statt die gesamte alte V4.11.78-Entwicklung zu verschmelzen.
2. Im Quellverzeichnis src/p7-010/ liegen die sieben zentralen Bausteine:
   - raster-tile-url.js
   - raster-tile-clip.js
   - raster-compositor.js
   - raster-mosaic-contract.js
   - raster-mosaic-tile-loader.js
   - raster-mosaic-grid-layer.js
   - raster-mosaic-consumer.js
3. Diese sieben Hilfsdateien sind ebenfalls in drei Frontend-Auslieferungsspiegel unter modules/weather/p7-010/ vorhanden:
   - frontend/
   - dashboard/dist/
   - custom_components/gewitterradar/frontend/
4. Die Datei scripts/build-frontend.mjs wurde so geändert, dass diese sieben Hilfsdateien als **nicht eigenständig registrierte** Modulunterstützung in das bestehende modulare Frontend-Inventar aufgenommen werden. Die Zahl 34 registrierter Module wurde nicht eigenmächtig geändert.
5. Im bereits registrierten Niederschlagsmodul frontend/modules/weather/precipitation-layer.js einschließlich beider Auslieferungsspiegel wurde der bestehende V2-Consumer eingebunden. Die aktive Methode _refreshWeatherRadar() versucht nun nach WeatherRouter-Discovery zunächst _weatherRadarTryMosaic().
6. Diese V2-Methode ruft den vorhandenen WebSocket-Befehl weather_router/consumer/resolve_mosaic über Home Assistant callWS auf, validiert die V2-Antwort und baut das Leaflet-GridLayer-Mosaik zunächst transparent im bestehenden Niederschlags-Pane auf.
7. Nach gemeldeter Zeichnung mindestens einer Kachel wird die bisherige Darstellung gegen das vorbereitete Mosaik getauscht; andernfalls soll der bisherige V1-Resolve-Pfad weiterlaufen. Es gibt eine Begrenzung der WebSocket-Wartezeit auf fünf Sekunden und der ersten Mosaikzeichnung auf sechs Sekunden.
8. Der Kartenausschnitt wurde auf einen vollständigen Welt-BBOX-Fall und expliziten Kartenfokus vorbereitet, auch bei Leaflet-Weltwiederholung und beim Antimeridian.
9. Laufende Antworten werden anhand eines Generationszählers und der Viewport-Signatur auf Veraltung geprüft. Die aktuelle Implementierung deckt **nicht alle** Abbruch-/Speicherfälle vollständig ab.
10. Status und Legendentext können V2-Mosaikquellen sowie deren Quellenhinweise ausgeben; es gibt keine clientseitige Anbieterpriorisierung.
11. Bei einer nicht erfolgreichen Antwort soll ein vorhandenes gültiges Raster nicht blind gelöscht werden. Diese Änderung verändert teilweise die bisherige V1-Verfügbarkeitspolitik und muss explizit regressionsgeprüft werden.

**Wichtig:** Die V2-Anbindung ist tatsächlicher Quellcode im aktiven Niederschlagsmodul des isolierten Entwicklungszweigs, aber noch nicht durch einen echten Home-Assistant-Mosaiklauf bestätigt. Keine Behauptung, sie laufe bereits produktiv.

## 4. WeatherRouter-V2-Vertrag – nur als Abhängigkeit dokumentiert

- Bestehender Befehl: weather_router/consumer/resolve_mosaic
- contract_version: 2
- capability: weather.precipitation.layer
- Räumlicher Kontext: BBOX, optional Schwerpunkt/focus mit latitude und longitude.
- Zeit: latest_coherent; Anforderungen an Alter und maximale Zeitdifferenz, nicht frei erfundene Datenzeit.
- Getrennte Grenzwerte: max_layers bis 12 für Quellen im **Gesamtmosaik** und max_tile_requests als eigenes Netzwerk-/Kachelbudget.
- Je einzelner Bildkachel nur tatsächlich überdeckende und passende Quellen, derzeit höchstens 4. Bis zu 12 Gesamtquellen heißen ausdrücklich NICHT 12 verpflichtende Bilder pro Kachel.
- Nur belegte maschinenlesbare Abdeckungen; kein fälschlich globales DWD-Übernehmen wegen eines kleinen sichtbaren deutschen Kartenrands.
- Quellmetadaten: Herkunft, Attribution, Legende, Semantik, Zeit, Renderingparameter und geografische Deckung. Unsichere/geheime URL-Parameter dürfen nicht im Client landen.
- Der V2-Consumer in GR baut selbst keine Quellenprioritäten, sondern rendert die durch WeatherRouter ausgewählten, geordneten und verifizierten Deskriptoren.
- Experimenteller WR-Zweig war feature/p7-010-live-mosaic-api-2026-10-15; spätere isolierte WR-Zweige enthalten Budget-/Konkurrenzschutz. Ob dieser WR-Code auf der **tatsächlich eingesetzten HA-Instanz** installiert ist, wurde in diesem Chat nicht nachgewiesen.
- Änderungen am WeatherRouter gehören AUSSCHLIESSLICH in den gesonderten WR-Chat. Der publizierte synthetische WR-Test in TheDaimos/weather-router-dev-pub PR #5 verlief nach Korrektur mit Lauf 38853976841 erfolgreich. Das ist KEINE echte HA- oder GR-Realabnahme.

## 5. Aktuelle GitHub-Prüfungen – konkret und überprüft

Quellcodecheckpoint 1b2b1b2f4331830ca234bd4d8196dc1792649a26, PR #37:

| Prüfung | Lauf | Ergebnis |
| --- | --- | --- |
| Gemeinsames Frontend | 38854916442 | FAILURE |
| V4.11.82 Einstellungen / Laufzeitidentität | 38854916422 | SUCCESS |
| P7-010 isolierte Raster-Mosaik-Abnahme | 38854916319 | SUCCESS |
| Hochauflösende Bildbestände | 38854916310 | SUCCESS |
| Geschützter Diagnosevertrag | 38854916401 | SUCCESS |
| Gewitterradar-Integration | 38854916421 | SUCCESS |

**Ursache des einen roten Laufs:** Der Frontend-Gesamtprüfer meldet Error: Checksum inventory stale in scripts/verify-frontend.mjs:479. Das Buildskript konnte das modulare Frontend neu erzeugen und gab den neuen erwarteten SHA256SUMS_FRONTEND.txt-Inhalt im GitHub-Actions-Protokoll aus. Die regenerierten Prüfsummen wurden NICHT als bereinigter Quellstand eingecheckt. Darum ist das Prüfergebnis weiterhin ROT, obwohl die fünf anderen Prüfungen erfolgreich sind.

**Nächster Pflichtschritt:** Build-/Spiegel-/Prüfsummenstand nachvollziehbar konsistent machen, OHNE fremde Dateien, Asset-Referenzen, die geschützte Weich-Darstellung oder die ausgelieferte Versionsidentität ungeprüft zu überschreiben. Vor endgültiger Zusammenführung und DRA alle Prüfungen erneut auf dem exakt gleichen finalen Commit ausführen. Auch die grüne isolierte Abnahme prüft nur künstliche Daten, nicht Home Assistant oder WebKit.

Testquellen im Zweig: scripts/test-p7-010-raster-compositor.mjs, test-p7-010-raster-mosaic-consumer.mjs, test-p7-010-raster-mosaic-contract.mjs, test-p7-010-raster-mosaic-grid-layer.mjs, test-p7-010-raster-mosaic-tile-loader.mjs, test-p7-010-raster-tile-clip.mjs, test-p7-010-raster-tile-url.mjs, test-p7-010-world-bbox.mjs. Workflow: .github/workflows/p7-010-raster-isolated.yml. Ebenfalls regulär: node scripts/verify-frontend.mjs und node scripts/test-frontend-build.mjs.

## 6. Technische Risiken / zwingende nächste Prüfung

**Priorität 1 – tatsächliche laufende Integration:**
- Über WebSocket bestätigen, dass die eingesetzte WR-Version V2 registriert und normkonforme Bilder liefert; bei nicht vorhandener V2-Funktion bewusst in V1 fallen.
- Nachweisen, dass zwei Quellen im selben Kartenausschnitt **gleichzeitig** geografisch begrenzt erscheinen und DWD nur innerhalb belegter Deckung dominiert. Testfall Kuba/Nord-/Mittelamerika mit winzigem Deutschlandanteil ist verbindlich.
- Bereits angezeigtes gültiges Niederschlagsbild unter Netzfehler/fehlendem regionalen Bild erhalten, aber alte Daten nicht unendlich als aktuell ausgeben. Eindeutige „letzter gültiger Stand“-Kennzeichnung.
- Im aktuellen Code zählt die erste erfolgreich gezeichnete Kachel als Grund zum sichtbaren Layerwechsel; eine vollständig sinnvoll gefüllte Bildfläche ist damit NICHT nachgewiesen. Ein methodisch besserer Umschalt-/Bereitschaftstest ist offen.
- Die native V1-Zeitachse/der Zeitplayer sind auf V2-Mosaikbetrieb noch nicht kohärent eingebunden. Der aktuelle Mosaikwechsel blendet den V1-Zeitplayer aus. Zeiträume, Bezugszeit, mehrere Quellzeitpunkte und Doppelpufferung bleiben P7-010-Gates.
- Der V2-Aufruf läuft direkt über this._hass.callWS und nicht durch die bisherige V1-Diagnose-Einbindung. Einheitliche, redigierte Fehler-/Status-/Zeitdiagnose ergänzen, ohne vertrauliche Abfragedaten offenzulegen.

**Priorität 2 – Begrenzung, Stabilität und Mobilgeräte:**
- Die bestehende RasterTileRequestBudget.reserve()-Logik erhöht used noch vor Eintritt in den parallelen Ladeslot. Abbruch wartender/überholter Kacheln und Freigabe der Warteschlange müssen weiter abgesichert werden.
- Nur Timeout-Abbruch einzelner Bildanforderungen ist vorhanden; generelle Stornierung laufender Kacheln beim Karten-/Standort-/Modus-/Zeitwechsel, Schutz gegen veraltete Canvas-Rückgaben und Speicherfreigabe sind nicht vollständig real abgenommen.
- Mosaik auf 12 Gesamtquellen und höchstens 4 pro überdeckter Kachel begrenzen; Request-Budget, Parallelität, Bildgröße, DOM- und Canvas-Speicherlast unabhängig testen.
- Unterschiedliche mobile Auflösungen, Retina/iPad, Orientierung, Standard/Groß/Vollbild/Eigenes Fenster prüfen. Keine iPad-Abstürze, keine Bildschirmhänger.
- Die bisher abgenommene „Weich“-Optik insbesondere Zoom 10 schützen; Zoom 8–13 prüfen. Keine geraden/geometrischen Rasterkanten neu einführen.
- Weiterhin Schutz gegen Clusterflackern, Menüruckeln, verzögerte Touchereignisse und Seiteneffekte auf Blitzortung/Tracker.

**Priorität 3 – Diagnose und Benutzeroberfläche:**
- DIA-RL-01: Im Raster-Labor steht trotz vorhandener Niederschlags-Pane „01. Niederschlag · noch nicht verfügbar“. In frontend/modules/diagnostics/raster-lab.js, _rasterLabRefreshOptions(), wird die Verfügbarkeit aus adapter.getPane() gelesen; Lebenszyklus und Refresh genauer prüfen.
- DIA-TOUCH-02: Drei-Finger-Joe / Touch-Diagnostik – gemeldete Regression erneut prüfen und dokumentieren.
- DIA-RL-03: Abweichung zwischen sichtbaren Labor-Notizen und JSON-Diagnose; nur anhand einer identischen laufenden Sitzung vergleichen.
- Wetterdiagnose um V2-Vertragsversion, Gesamt-/Kachelquellen, Abdeckung, partielle Fehler, aktive/vorherige Darstellung, Ressourcenlimits und aktuelle vs. alte Frames ergänzen.
- Neue Anzeige darf kein Provider-Auswahlmenü in Gewitterradar erzeugen. Die Quellenentscheidung gehört zu WeatherRouter.

## 7. Abnahmematrix für die echte Erprobung

1. Kein WeatherRouter / WeatherRouter ausgeschaltet → Gewitterradar bleibt bedienbar, keine versteckte Dauerschleife; vorhandene unabhängige Blitzortung läuft.
2. WeatherRouter vorhanden, V2 nicht registriert → stabiler Consumer-V1-Rückfall.
3. V2 liefert ungültigen Vertrag, defekte URL, fehlende Deckung, zu alte Quelle oder Teilfehler → keine komplette Karte löschen, nachvollziehbarer Status.
4. Kuba fokussiert, Deutschland nur marginal im Randbereich → globale/regionale Quellen bleiben für die übrige Karte erhalten; keine vollständige DWD-Umschaltung.
5. Deutschland und weltweiter Kartenmaßstab → höhere regionale Qualität nur innerhalb belegter Quelle, globale Grundabdeckung soweit verfügbar.
6. Weltkarte, Leaflet-Weltwiederholung, Datumsgrenze/Antimeridian, Verlagerung des Kartenmittelpunkts → konsistente BBOX und Quellenmasken.
7. Bis zu zwölf zulässige Quellen im Gesamtmosaik, höchstens vier pro überdeckender Kachel, getrenntes Bildanfragebudget; keine unzulässigen/zeitlich inkohärenten Überlagerungen.
8. Zeitplayer mit Vergangenheit/aktuellem Zeitpunkt/Vorhersage, Quellenwechsel, laufender Animation und Frame-Doppelpufferung.
9. Zoomstufen 8, 9, 10, 11–13; Präzise/Ausgewogen/Weich/Auto; Transparenzerhalt; Kantenprüfung.
10. Android, iPad/WebKit und Desktop sowie Standard/Groß/Vollbild/Eigenes Fenster; Reaktionszeit, CPU, RAM, Canvas-/Bildspeicher und Touch.
11. Diagnose DIA-RL-01/02/03 und synchronisierte redigierte Exporte. Keine privaten Geheimnisse in öffentlichen Prüf-Repositorys.
12. Einheitliche Versions-/Build-/Laufzeitkennung, 3 Frontend-Auslieferungsspiegel, Prüfsummen, CI, Installation über DRA. Den DRA-Realtest erst nach gebündelter technischer Bereitschaft anbieten; keine unnötigen Zwischenversionen.

**Ergebnisse eindeutig klassifizieren:** CODE / SYNTHETISCH PASS / HA-REALTEST AUSSTEHEND / HA-REAL-PASS / FREIGEGEBEN. Keine vorgezogenen Erfolgsmeldungen.

## 8. Verbindliche Arbeitsweise im nächsten Chat

- Sofort mit der vorliegenden vollständigen Übergabe arbeiten; keine erneute Grundsatzdiskussion und keine Routine-Rückfragen.
- Gewitterradar ist alleiniger Entwicklungsauftrag. Die WR-Abhängigkeit prüfen und fehlende serverseitige Anforderungen dokumentieren, aber KEINEN WR-Quellcode in diesem Chat ändern.
- Bestehende V4.11.82-Oberfläche und die vorhandenen Mosaikbausteine erhalten. Kein zweiter Renderer oder zweites Quellenauswahlsystem neben der bestehenden Architektur.
- Immer zuerst den realen GitHub-Stand/aktuellen PR-Head, den letzten CI-Status und konkrete Fehler abgleichen. Frühere Checkpoints können überholt sein.
- Gezielte Codekorrekturen und zusammenhängende automatische Prüfungen möglichst eigenständig bis zum nächsten echten Realtestpunkt durchführen; nicht nach jedem Commit auf Zustimmung warten.
- Auslieferung ausschließlich über den vorgesehenen DRA-Weg. Vorher konsistent Version, Build, Runtime-Revision, Modulsatz, Manifest, Frontend-Spiegel und Prüfsummen setzen.
- Niemals produktives deploy/dev überschreiben oder PR #37 voreilig zusammenführen. Fehlgeschlagene Prüfung offen benennen und korrigieren.
- Bei langer Laufzeit ein kurzer sachlicher Fortschrittsstand; ansonsten autonome Fortsetzung. Keine Zusagen über Hintergrundarbeit.
- Wenn ein Chat umfangreich wird, rechtzeitig neue Übergabe statt Kontextverlust.

## 9. Unmittelbar nächster Entwicklungsauftrag

1. Von TheDaimos/gewitterradar, feature/p7-010-v41182-forward-port-2026-10-16 und PR #37 ausgehen; neuesten Head mit dem hier dokumentierten Codecheckpoint vergleichen.
2. Die fehlgeschlagene gemeinsame Frontend-CI wegen veraltetem Prüfsummenverzeichnis beheben, ohne unkontrolliertes Neugenerieren fremder Produktdateien; alle Spiegel/Assets prüfen und identische Tests wiederholen.
3. Die aktive V2-Integration in precipitation-layer.js und die sieben Hilfsdateien sorgfältig prüfen: Render-Lifecycle, Vorlade-/Wartebudget, Mehrquellen-Clipping, V1-Rückfall, Kartenwechsel, Canvas-Freigabe, Attribution/Legende.
4. Funktionalen V2-Zeitplayer und vollständige Abbruch-/Ressourcensicherung vervollständigen, regressionsgeschützt testen.
5. DIA-RL-01, DIA-TOUCH-02 und DIA-RL-03 nach fachlicher Priorität beheben; ursprüngliche Bedienoberfläche nicht destabilisieren.
6. Alle synthetischen Prüfungen und Browserabnahmen konsistent abschließen; erst danach eine einzige sauber versionierte DRA-Realtestbereitstellung von Gewitterradar vorbereiten.
7. Verbleibende WeatherRouter-Abhängigkeiten als separaten, kopierbaren WR-Auftrag dokumentieren, ohne die WR-Entwicklung selbst auszuführen.

## 10. Quellen und verbindliche Referenzen

- Gewitterradar P7-010 PR #37: https://github.com/TheDaimos/gewitterradar/pull/37
- Isolierte Vorentwicklung PR #32 (nicht als Ganzes übernehmen): https://github.com/TheDaimos/gewitterradar/pull/32
- Letzte vollständige isolierte P7-Prüfung: https://github.com/TheDaimos/gewitterradar/actions/runs/38854916319
- Letzte fehlgeschlagene gemeinsame Frontend-Prüfung: https://github.com/TheDaimos/gewitterradar/actions/runs/38854916442
- V4.11.82 Identitätsprüfung: https://github.com/TheDaimos/gewitterradar/actions/runs/38854916422
- Gewitterradar-Integrationsprüfung: https://github.com/TheDaimos/gewitterradar/actions/runs/38854916421
- Ursprüngliche ausführliche projektübergreifende Übergabe: TheDaimos/weather-router-dev, docs/handoff-gr-v41182-autonomous-p7-010-2026-10-15, docs/HANDOFF_GR_V41182_P7_010_AUTONOME_ENTWICKLUNG_2026-10-15.md
- Ergänzende private Planungsdokumente im WeatherRouter-Repository: docs/ROUTING_SCHLACHTPLAN.md und docs/THEMEN_UND_ROUTING_STRATEGIE.md. Diese beschreiben Schnittstellen-/Routinganforderungen, erteilen aber keine Freigabe zur WR-Codeentwicklung in diesem Chat.

**Übergabefazit:** Gewitterradar P7-010 ist auf einem aktuellen, 61-Commits-vorausliegenden Entwicklungszweig bereits aktiv in den Niederschlagsquellcode integriert. Fünf der sechs synthetischen GitHub-Läufe am Codecheckpoint sind grün; die Frontend-Prüfsummenprüfung ist rot. Weder die echte HA-Verprobung noch die DRA-Bereitstellung ist abgeschlossen. Der nächste Chat muss Gewitterradar fertigstellen, nicht WeatherRouter parallel umbauen.

# Gewitterradar V4.11.85 DEV – P7-010 Consumer API V2
**Stand:** 16.10.2026 · **Entwicklungszweig:** `deploy/dev` · **Status:** DEV-Realtestkandidat, **keine** REAL-PASS-/FINAL-Freigabe.

## Version und Bereitstellung
- Produktversion `4.11.85`; sichtbare Kennung `V4.11.85 DEV`
- Build `V4.11.85-DEV-2026-10-16`; Laufzeit `41185r1`; Modulsatz `E411-85A1`
- Native HA-Integration `0.25.3`.
- Auslieferungsquelle ist ausschließlich `TheDaimos/gewitterradar@deploy/dev` mit den DRA-Provenienzmetadaten. Kein Fork, keine parallele Architektur.

## Enthaltene Änderungen
1. **Weather Engine:** Eigener, kontrollierter Schalter „API V2 gezielt prüfen“. Der Einzeltest verwendet die aktuelle Karten-BBOX und den Fokus, sendet `weather_router/consumer/resolve_mosaic`, validiert Antwort/Quellen, ist auf zwölf Quellen, zwölf deklarierte Kachelanfragen und 20 Sekunden begrenzt. Er lädt keine Rasterbilder und verändert keine aktive Kartenebene.
2. **Korrelationsdiagnose:** `consumer_id: gewitterradar`, `correlation_id`, unterscheidbare Transport-, Vertrags-, Rastervorbereitungs- und Aktivierungsphasen. Dieselbe Kennung begleitet einen folgenden V1-Rückfall. Begrenzter Diagnosering und JSON-Export; keine Roh-URLs mit Geheimnissen im neuen V2-Diagnosekern.
3. **Zeitvertrag:** Vorläufiges endliches Clientbudget 20 s (`gr_v2_client_timeout`). WR besitzt unabhängig einen eigenen serverseitigen Endpunkt und muss dessen Zeit-/Abbruchsemantik selbst abnehmen.
4. **Mehrquellenrenderer:** Bestehende P7-010-Module, kein eigenes Provider-Routing. Bis zwölf Gesamtquellen, höchstens vier örtlich und hinsichtlich Zoom passende Bildquellen je Kachel, gesondertes Bildanforderungsbudget, geografische Clipping-Masken anhand der geprüften Abdeckungshülle. Eine pixelgenaue NoData-Maske wird nicht erfunden.
5. **Bildwechsel:** Alte Niederschlagsebene bleibt bis zu erfolgreich vorbereiteten und abgeschlossenen sichtbaren Leaflet-Kachel-Ladevorgängen erhalten. Bei Kartenwechsel/Entfernung werden laufende Bildabrufe und wartende Bildanfragen abgebrochen. Zeitlich abweichende `partial`-Quellen werden in der Diagnose gekennzeichnet, nicht als kohärent umgedeutet.
6. **Oberflächenstatus:** Weather Engine unterscheidet sichtbare API-V1-Ebene, API-V2-Mosaik und bloße V1-Discovery.
7. **Tests:** Bestehende P7-010-Rastertests um Abbruch der Kachelwarteschlange und Verbot weiterer Kachelanfragen nach Entfernen erweitert; isolierter P7-010-Workflow gilt auf `deploy/dev`. Frontend-, Modul-, Versions- und HA-Integrationsprüfungen sind separat zu bewerten.

## Geplante gemeinsame HA-Abnahme – jeweils getrennt protokollieren
1. WR-API-V2 nach Installation in HA registriert.
2. WR-API-Monitor für V2 bewusst eingeschaltet.
3. In GR Weather Engine „API V2 gezielt prüfen“ einmal auslösen; `correlation_id`, Status/Fehlercode, Dauer und Quellenanzahl exportieren.
4. Gleiche Anfrage im WR-Monitor mit identischer `correlation_id` nachweisen.
5. Normale Niederschlagsansicht aktivieren; API V2 tatsächlich als sichtbare Ebene nachweisen, getrennt vom isolierten Schnittstellentest.
6. Kuba–Atlantik–Europa-Ausschnitt: DWD nur innerhalb der bestätigten regionalen Coverage, geeignete globale Quellen außerhalb erhalten.
7. Alter und zeitliche Abweichungen, `partial`/`unavailable`/technische WS-Fehler, V1-Rückfall und alte Darstellung kontrollieren.
8. Quelle-/Kachel-/Zeit-/Speicherbudgets überprüfen.
9. Schnelle Kartenbewegung, Zoom 8–13 und sichtbare Bildübergänge inklusive Abbruch alter Ergebnisse prüfen.
10. Desktop, Android und iPad überprüfen. **FLK-01** in separater Testreihe untersuchen; der Fehler ist ausdrücklich **nicht** als behoben abgenommen.

**Code-PASS** oder **synthetischer PASS** ersetzen niemals den installierten **REAL-PASS**. Private Exporte nur über den vereinbarten geschützten Kanal. **C.K. – Eine Idee weiter gedacht.**

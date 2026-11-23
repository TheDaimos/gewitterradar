# GewitterRadar V4.12 — Monitored Areas: Codex-Implementierungsplan

**Stand:** 23.11.2026 · **Status:** Entwicklungsplanung, noch keine Umsetzung freigegeben.
**Repo:** `TheDaimos/gewitterradar` · **Doku-Branch:** `deploy/dev` · **Realtests:** HA DEV VM109.

**Verbindliche Fachvorgaben:** [MONITORED_AREAS_V412_KONZEPT_2026-11-23.md](MONITORED_AREAS_V412_KONZEPT_2026-11-23.md) und dort verlinkte Havanna-Referenz. Dieser Implementierungsplan ändert keine Produktentscheidungen. Historische offene To-dos aus `V4_12_TODO.md` sind gegen das neuere Konzept abzugleichen.

## Codex-Auftragsvertrag (für *jeden* MA-Task)

1. **Nur eine ID pro Auftrag** bearbeiten. Wenn ihr Umfang in einem Codex-Durchlauf nicht sicher bewältigt werden kann, mit Sub-ID `MA-xxxA/B` teilen; keine Teilfertigstellung als abgeschlossen ausgeben.
2. Vor Beginn Remote-HEAD, zuletzt akzeptierte Referenz, bestehende Integration/API und offene Parallelarbeiten prüfen; **keine alte SHA fest verdrahten**. Bei parallel bearbeitetem `deploy/dev` den aktuellen HEAD neu lesen und Fremdänderungen nicht überschreiben.
3. **Additiv, hinter default-OFF Feature-Flag** bis klar freigegeben. 4.11 FINAL, WR 1.0.2, bestehende Ortssuche/Standortflug, Legend Hub, Eye, 19 Sprachen, PROD VM101 und funktionierende Referenzen nicht verändern. Kein unautorisierter Release.
4. Pro Task: eine konkrete Funktion, minimaler Patch, gezielter Unit-/Contract-Test, ggf. DEV-Realtest; keine umfangreichen globalen Refactors oder Versionssprünge ohne Anlass.
5. Nach jedem Task eine **dauerhafte Übergabe im Repo** aktualisieren: `docs/MONITORED_AREAS_V412_STATUS.md` mit Status, HEAD/Commit, geänderten Dateien, Tests/Ergebnis, bekannten Fehlern, Abhängigkeiten, exakt nächster ID. Ohne Test = nicht als abgenommen markieren.
6. **Eindeutige Zustände:** TODO → IN_PROGRESS → IMPLEMENTED → VERIFIED_DEV → ACCEPTED_USER. Kein automatisches Weiterstarten des nächsten Tasks. Nach Budgetabbruch am letzten verifizierten Commit fortsetzen.
7. Bei Risiko/Blocker: stoppen, reproduzierbare Diagnose + Minimalbefund dokumentieren, keine blinden Wiederholungen. Keine Änderung an fremden HA-ConfigEntries, privaten HA APIs oder `.storage`.

## Phasen und kleine Arbeitspakete

### P00 — Grundgerüst und Verträge

| ID | Aufgabe | Lieferumfang / Grenze |
|---|---|---|
| **MA-001** | Ist-Analyse | Aktuelle Ortssuche, HA-Integration, Provider, Profile, Build und geschützte Referenzen dokumentieren; keine Laufzeitänderung. |
| **MA-002** | Architekturvertrag | Module, Backend-API, SQLite-Pfad, Datenflüsse, Identitäten und Abhängigkeiten definieren; kein Code-Umbau. |
| **MA-003** | Backend-Skelett | Isoliertes Modul mit Feature-Flag default OFF, Lifecycle-Hooks und testbarem Import; keine Tabellen oder Entitäten. |
| **MA-004** | Frontend-Skelett | Nicht sichtbare Dialog-/Adapter-Schnittstellen hinter Flag; aktuelle Ortssuche unverändert. |
| **MA-005** | Smoke-/Vertragstests | DEV-Nachweis: Flag OFF verursacht kein UI, keine DB, keine Entities und keine Änderung der laufenden Funktionen. |

**Phasen-Gate P00:** alle 5 Einzelaufgaben einzeln getestet und dokumentiert; kein unbeabsichtigter Seiteneffekt auf bestehende Funktionen. Nächste Phase nur nach Freigabe.

### P01 — SQLite-Fundament

| ID | Aufgabe | Lieferumfang / Grenze |
|---|---|---|
| **MA-006** | Datenbank-Lifecycle | SQLite-Verbindung, Pfad im gesicherten HA-Konfigurationsbereich, create/close; noch keine Fachdaten. |
| **MA-007** | Schema Standorte/Profile | Stabile IDs, locations, profile_links, personenspezifische Preferences, Indizes und Schemanummer. |
| **MA-008** | Schema Tracker/Alarmregeln | Monitor-, Pause-, Record-, Radius- und Alarmkonfiguration plus Trackerreferenzen; Defaults testen. |
| **MA-009** | Schema Ereignisse/Sitzungen | Einzelblitze, Quellmeldungen, Sitzungen und Ausfallintervalle, historische Ortskoordinaten, FK/Indizes. |
| **MA-010** | Transaktionale Repositories | CRUD und Schema-Migration mit atomaren Writes, Parallelzugriff- und Restore-Tests. |
| **MA-011** | Schreibfehlerbehandlung | I/O nicht im HA-Eventloop, FULL/READONLY/CORRUPT erkennen, sicher melden, niemals still resetten. |

**Phasen-Gate P01:** alle 6 Einzelaufgaben einzeln getestet und dokumentiert; kein unbeabsichtigter Seiteneffekt auf bestehende Funktionen. Nächste Phase nur nach Freigabe.

### P02 — Standorte, Profile und Rechte

| ID | Aufgabe | Lieferumfang / Grenze |
|---|---|---|
| **MA-012** | Standort-CRUD | Erstellen/Lesen/Umbenennen/Koordinatenprüfung; ohne UI-Änderung. |
| **MA-013** | Gemeinsame Profilverknüpfungen | Many-to-many Zuordnung, gemeinsame Daten vs persönliche Push-/Anzeigeeinstellungen sauber getrennt. |
| **MA-014** | Schutz- und Löschregeln | Koordinaten mit Blitzhistorie gesperrt; Reset gesondert; letzte Verknüpfung nur per expliziter Checkbox plus HA-Adminberechtigung löschbar. |
| **MA-015** | Autorisierte Backend-API | Nur unterstützte HA-Schnittstellen; Rechte- und Konfliktverträge mit Tests. |

**Phasen-Gate P02:** alle 4 Einzelaufgaben einzeln getestet und dokumentiert; kein unbeabsichtigter Seiteneffekt auf bestehende Funktionen. Nächste Phase nur nach Freigabe.

### P03 — Ortssuche & Migration

| ID | Aufgabe | Lieferumfang / Grenze |
|---|---|---|
| **MA-016** | DB-Leseadapter | Bestehende gespeicherte Ortssuche hinter Flag an DB anbinden; Standortflug/Dropdowns schützen. |
| **MA-017** | Suche und Basisbearbeitung | Teilstringsuche, Speicher-/Lesefluss, Koordinaten-Kopieren und Einfügen; noch kein großes Detailmenü. |
| **MA-018** | Migration als Vorschau | Local-To-do lesen; Kandidaten, Duplikate per Koordinaten und Konflikte anzeigen; Abbrechen ohne Änderungen. |
| **MA-019** | Migration durchführen | Transaktionaler Import, bestehende Datensätze verwenden/ersetzen/überspringen; alte Liste bleibt noch bestehen. |
| **MA-020** | Migration finalisieren | Validieren und nach gesonderter Bestätigung alte To-do-Liste entfernen; Abbruch-/Fehlerfall lässt sie unberührt. |
| **MA-021** | Havanna-Detailfenster Basis | Bewegliches responsives Fenster; Chevron standardmäßig geschlossen, kleines Display Akkordeon. |
| **MA-022** | Profil-/Freigabe-UI | Mehrfachauswahl, Verknüpfen/Freigeben/Übertragen, direkte Speicherung und Fehlerfeedback. |

**Phasen-Gate P03:** alle 7 Einzelaufgaben einzeln getestet und dokumentiert; kein unbeabsichtigter Seiteneffekt auf bestehende Funktionen. Nächste Phase nur nach Freigabe.

### P04 — Tracker & geografische Anbindung

| ID | Aufgabe | Lieferumfang / Grenze |
|---|---|---|
| **MA-023** | Trackername und Kollision | Kopierfunktion und Validierung; Namenskonflikt meldet nur 'gewählter Name nicht verfügbar'. |
| **MA-024** | Tracker-Erstellen-Button | Admin-only, sonst ausgegraut; positiver grüner Status erst nach HA-Erfolg. |
| **MA-025** | Kopplungsdiagnose | Blitzortung-Verfügbarkeit, Datenbereich, Trackerzuordnung und Radius pro Ort anzeigen; keine fremden ConfigEntries ändern. |
| **MA-026** | Parallele Tracker-/Blitzortung-Realtests | Zwei entfernte Orte mit unabhängigen Abos auf HA DEV, Belastung und Grenzen dokumentieren. |
| **MA-027** | Monitoring-Status und Radien | Ein/Pausiert, 10-km-Default, 0–50-km-Protokoll- und optional abweichender Alarmradius; Farben/Anzeige separat. |

**Phasen-Gate P04:** alle 5 Einzelaufgaben einzeln getestet und dokumentiert; kein unbeabsichtigter Seiteneffekt auf bestehende Funktionen. Nächste Phase nur nach Freigabe.

### P05 — Ereigniserfassung & Sitzungen

| ID | Aufgabe | Lieferumfang / Grenze |
|---|---|---|
| **MA-028** | Blitzortung-Eingangsadapter | Quellmeldungen normalisieren, IDs/Zeit/Koordinaten erfassen; kein UI-Feature. |
| **MA-029** | Geo-Matching und Speicherung | Je Area Ereignisdistance und Rohdaten persistieren; 0-m-Semantik vor Umsetzung klären. |
| **MA-030** | WR-Ereignisadapter | Nur geeignete, tatsächlich aktive Blitzereignis-Provider optional ergänzen; WR ist Providerautorität. |
| **MA-031** | Mögliche Quell-Doppelzählungen | Nur innerhalb desselben Orts; originäre Meldungen behalten und Verdachtsmarkierung ohne starre Schwellen. |
| **MA-032** | Quellstatus und Datenlücken | Ausfall/Wiederverfügbarkeit und HA-Neustartintervalle dauerhaft protokollieren. |
| **MA-033** | Ereignissitzungen | Erster Blitz beginnt Sitzung; Ruhezeit 15–60 Min (Schritte 5, Default 15), Neustartfortsetzung. |
| **MA-034** | Sitzungsabschluss | Anzahl, kürzeste Distanz, Beginn/Ende, Ausfälle; Abschluss ohne meteorologische Entwarnung. |

**Phasen-Gate P05:** alle 7 Einzelaufgaben einzeln getestet und dokumentiert; kein unbeabsichtigter Seiteneffekt auf bestehende Funktionen. Nächste Phase nur nach Freigabe.

### P06 — Push-Alarmierung

| ID | Aufgabe | Lieferumfang / Grenze |
|---|---|---|
| **MA-035** | HA-Benachrichtigungsziele | Dynamische Geräteauswahl und Rechte-/Capability-Prüfung, ohne Versand. |
| **MA-036** | Profilbezogene Alarmeinstellungen | Ein/Aus, kritisch wenn unterstützt, Erstanzeige+Abschluss / Einzelmeldung / nur protokollieren. |
| **MA-037** | Echtzeit-Push und Testbutton | Nachricht bei Ereignis und Test-Push, Warnhinweis wenn DB-Schreiben scheitert. |
| **MA-038** | Abschluss- und Ausfall-Push | Empfängerindividuelle Ruhezeiten, Datenlücken-/Wiederverfügbarkeitsinfo, keine falsche Entwarnung. |

**Phasen-Gate P06:** alle 4 Einzelaufgaben einzeln getestet und dokumentiert; kein unbeabsichtigter Seiteneffekt auf bestehende Funktionen. Nächste Phase nur nach Freigabe.

### P07 — Historie, Auswertung & Import/Export

| ID | Aufgabe | Lieferumfang / Grenze |
|---|---|---|
| **MA-039** | Historische Einzelereignisse | Tabellarische Liste mit Zeitraumfilter und Klick-auf-Karte; separates Fenster optional. |
| **MA-040** | Interaktive Zeit-/Entfernungsanalysen | Tag/Woche/Monat/Sitzung/individuell, Drilldown ohne Veränderung der Raw-Ereignisse. |
| **MA-041** | Exportspalten-Profile | Benutzerdefinierte Spalten, Reihenfolge, Persistenz, Standard-/Vollprofil. |
| **MA-042** | CSV-Export | Eine Zeile je Blitz; Quell-/Zeit-/Orts-/Blitzkoordinaten/Entfernung/Duplikatstatus und Datenlücken separat. |
| **MA-043** | PDF-Export | Lesbarer Einzelortbericht und optionale Zeitraumauswertung; keine Rohdatenverluste. |
| **MA-044** | JSON-/ZIP-Export | Mehrfachauswahl; JSON strukturierte Konfiguration, CSV Events, manifest mit Schemaversion; Blanko/mit Daten. |
| **MA-045** | ZIP-Import | Koordinatenbasierte Duplikatprüfung, use/replace/skip, Daten/Profilvalidierung, keine stillen Löschungen. |

**Phasen-Gate P07:** alle 7 Einzelaufgaben einzeln getestet und dokumentiert; kein unbeabsichtigter Seiteneffekt auf bestehende Funktionen. Nächste Phase nur nach Freigabe.

### P08 — HA-Entitäten und Automationen

| ID | Aufgabe | Lieferumfang / Grenze |
|---|---|---|
| **MA-046** | Optionale HA-Entitäten | Pro Ort Schalter default OFF; englische Entity-IDs sensor.gr_* / binary_sensor.gr_*, stable unique_id. |
| **MA-047** | Status- und Geokoordinaten-Entitäten | Counter, Last/Distant, Lat/Lon, EIN/PAUSIERT/Fehler, native Tracker-Attribute; beim OFF deaktivieren nicht löschen. |
| **MA-048** | HA-Event-Bus | Schmale Ereignisse mit klaren Namespaces, keine unkontrollierten Recorder-Daten, Automationstests. |
| **MA-049** | Recorder-Hilfe | Kopierbares YAML über Hi-Res-i; Ausschluss sensor.gr_* und binary_sensor.gr_*, bestehende Recorder-Konfiguration nie überschreiben. |

**Phasen-Gate P08:** alle 4 Einzelaufgaben einzeln getestet und dokumentiert; kein unbeabsichtigter Seiteneffekt auf bestehende Funktionen. Nächste Phase nur nach Freigabe.

### P09 — Betrieb, Sicherheit, UI-Feinschliff & Abschluss

| ID | Aufgabe | Lieferumfang / Grenze |
|---|---|---|
| **MA-050** | SQLite-konsistente Backups | Backup standardmäßig EIN, optional abschaltbar soweit HA-Schnittstelle erlaubt; atomare Snapshot-/Restore-Prüfung. |
| **MA-051** | Manueller Backup-/Restore-Dialog | Berechtigung/Bestätigung, Backups laden, keine stillen Schäden, Fehler-/Integritätsprüfung. |
| **MA-052** | Speicher-/DB-Fehler-UI | Wartungszustände, Datenbankkorruption, volles Dateisystem, Push-Warnungen, niemals Auto-Reset. |
| **MA-053** | Premium-UI Endausbau | Havanna-Referenz, verschiebbares Detailfenster, goldener Hi-Res-Fadenkreuz-Kartensprung, Info-Medaillon, Farbschutz. |
| **MA-054** | Übersetzungen und Hilfetexte | 19 Varianten, Assistenz, Warnungen, Recorder-/Datenquellenhinweise. |
| **MA-055** | Testmatrix und Langzeittest | Desktop/iPad/Android, DEV VM109, mehrere Orte, Parallelabo, Recovery, Recorder, Speicher- und Permission-Tests. |
| **MA-056** | Release-Kandidat und Freeze | Erst nach eigenständiger Nutzerfreigabe; Schutz der 4.11 FINAL und der parallel laufenden Legend-Hub-Arbeit nachweisen. |

**Phasen-Gate P09:** alle 7 Einzelaufgaben einzeln getestet und dokumentiert; kein unbeabsichtigter Seiteneffekt auf bestehende Funktionen. Nächste Phase nur nach Freigabe.

## Reihenfolge und kleine Abnahmemarken

- **Erstes Ziel / Grundgerüst:** ausschließlich `MA-001` bis `MA-005`. Daran lässt sich ohne angeschlossene DB oder aktive Monitoring-Funktion prüfen, dass das Modul sauber isoliert ist.
- **Zweites Ziel / DB-Kern:** `MA-006` bis `MA-011`, zunächst ohne automatische Local-To-do-Umstellung.
- **Drittes Ziel / sichere Datenmigration:** `MA-012` bis `MA-022`; To-do bleibt bis bestätigtem Import unverändert.
- **Fachfunktion:** danach sukzessive Tracker, Ereignisse, Push, Historie, optionale HA-Entitäten und Backups. Providerabhängige Tasks erst nach realen Capability-Tests.
- **Task-IDs sind stabil** und keine Versionsnummern. Version/Commit pro tatsächlicher Bereitstellung gesondert dokumentieren.

## Offene Fach- und Technik-Gates

- 0-km-Semantik: exakt 0 m vs fachlich geprüfte Mess-/Ortungstoleranz noch vor `MA-029` entscheiden.
- Blitzortung: Mehrfache unabhängige Abonnements und Grenzen auf DEV vor produktiver Überwachung bestätigen (`MA-026`).
- WR: geeignete Blitzereignis-Provider prüfen, nichts aus Wind-/Radar-Produkten erfinden (`MA-030`).
- DB-Backup in HA und Rechte für systemweite Wiederherstellung mit echten HA-APIs belegen (`MA-050/051`).
- Bei Import identischer Koordinaten nicht automatisch nahe, aber verschiedene Haus-/Garagen-Orte verschmelzen.
- Die **Havanna-Grafik liegt verifiziert in der ChatGPT Library**, aber laut Konzept nicht als Git-Asset; vor UI-Pixelabnahme eine versionierte Repo-Kopie unter zulässigem Bild-/Assetpfad sicherstellen, ohne fremde Dateien zu überschreiben.
- Paralleler Legend-Hub-Entwicklungszweig: niemals dessen Commits revertieren, überschreiben oder als Teil von Monitored Areas umsetzen.

## Status/Übergabedatei

Beim ersten Codex-Auftrag `docs/MONITORED_AREAS_V412_STATUS.md` **anlegen** und danach pro Task fortschreiben, mit `last_verified_commit`, `current_task`, `next_task`, `blocked_by`, `test_evidence`, `DEV_user_accepted` und `notes`. Ein fehlender Eintrag ist **kein** abgeschlossenes Arbeitspaket.

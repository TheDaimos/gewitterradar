# Gewitterradar V4.07.56 – Abschlussstand

Stand: **2026/09 · V4.07.56**  
Native Integration: **0.19.0**  
Status: **vom Benutzer abgenommener Produkt-/Diagnosestand; formale Promotion nach `main` noch ausstehend.**

## Kanonische Produktidentität

- Frontend-Datei: `gewitterradar.js`
- Größe: **1.955.141 Bytes**
- SHA256: `249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a`
- Externes About-/Help-Locale-Modul SHA256: `997c4fe9b357935888fdb7bedc43cdd17f105b97241a000324891cea575dd436`
- Dashboard-Paket: `app_gewitterradar_v4_07_pkg.yaml`
- Dashboard-Paket SHA256: `1b705c5686e6a7be6dfb36717903df551d4f9f93787c39bd12bddf00aefae694`
- Historisches V4.06-Paket bleibt als Rückfall-/Migrationsreferenz erhalten.

Die V4.07.56-Frontenddatei ist die verbindliche akzeptierte Quelle. Integration und Dashboard werden aus exakt diesem gemeinsamen Frontendstand erzeugt und bytegenau gegeneinander geprüft.

## Abgenommener Funktionsstand

V4.07.56 enthält den vollständig abgenommenen normalen UI-/Funktionsstand aus V4.07.54 und erweitert ihn ausschließlich um die ebenfalls abgenommenen Diagnosewerkzeuge aus V4.07.55/V4.07.56.

Zum normalen Produktumfang gehören insbesondere:

- weltweite Orts-/PLZ-Suche;
- direkte Koordinateneingabe;
- Länderfilter, Gruppierung und Ergebnisdarstellung;
- gespeicherte Orte einschließlich Speichern, Soft-Delete und Wiederherstellen;
- Gewitterradar-eigener dynamischer Bezugsstandort;
- getrennte Trackerpfade für native Integration und Dashboard;
- automatische Kartenfokussierung nach Standortübernahme;
- vollständige Hilfe-/Hinweisstruktur einschließlich Standort-, Recorder- und Netzwerkhinweisen;
- 15 Sprachen plus 4 deutsche Dialektvarianten = **19 Sprachvarianten**;
- akzeptierte Radien-, Aura-, Karten-, Kompass- und Medaillon-Darstellung;
- akzeptierte Android-/Tablet-/Desktop-Layouts des V4.07.54-Basisstands.

Der normale UI-/Funktionsstand von V4.07.54 ist für die V4.07.56-Finalisierung gesperrt. Die Diagnosefinalisierung darf Karte, Ortssuche, Sprachen, Hilfe, Radien oder normale Bedienung nicht nachträglich verändern.

## Diagnosewerkzeuge

Der Diagnosemodus ist ab V4.07.56 eine dauerhaft geschützte Produktfunktion.

Abgenommen und durch Contract-Tests geschützt sind insbesondere:

- globaler Diagnosemodus mit pinkem Aktiv-Rahmen;
- dauerhaft erreichbare Diagnosekonsole einschließlich Minimieren/Maximieren und Verschieben;
- getrenntes Ausblenden der Childtools ohne Stoppen der Simulation;
- Master-Hard-Stop sämtlicher Childtools und synthetischer Zustände;
- virtuelles Gewitter mit AUS / BEOBACHTUNG / GEWITTER / GEFAHR / GESAMT;
- deterministische 1–5 Gewitterzellen;
- EXTREM-Test über die normale produktive Extrem-/Clusterpipeline;
- normale Umschaltung zwischen Gruppiert und Einzelblitzen;
- Medaillon-Presets LEER / PFEIL / TREND / FREEZE / NORMAL;
- Kompass-/Medaillon-Kalibrierung;
- Geometrie-, Overlay-, Mess-, JSON-/Snapshot- und Performance-Diagnose;
- 19 Diagnose-Sprachvarianten.

Verbindliche Schutzquellen:

- `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md`
- `tests/contracts/diagnostic-contract-v4.07.56.json`
- `scripts/verify-diagnostic-contract.mjs`
- `.github/workflows/diagnostic-contract.yml`

## Golden-/Browser-Vertrag

Der frühere V4.05-Pixel-/Geometrievergleich bleibt als historische Referenz erhalten. Für V4.07.56 existiert ein eigener Golden-Vertrag mit der akzeptierten V4.07.56-Geometrie.

Geschützt werden:

- exakte akzeptierte Frontendidentität;
- sieben feste Darstellungsprofile;
- eingefrorene Geometrie mit maximal **0,02 px** Toleranz;
- pixelbezogener Vergleich von Dashboard- und Integrationsdarstellung innerhalb desselben CI-Laufs;
- aktuelle sichtbare X-Geometrie bei weiterhin großem 44×44-Touchbereich;
- Desktop- und Touch-Tastatur-/Fokuspfade passend zum jeweiligen Browserprofil.

## Hi-Res-/Legacy-Asset-Schutz

Nicht mehr verwendete Hi-Res-/Mastergrafiken werden nicht gelöscht. V4.07.56 besitzt zusätzlich einen fail-closed Retentionsvertrag.

Geschützt sind aktuell **32 eindeutige Master-/Legacy-Inhaltsidentitäten**; durch Duplikat-/Archivpfade liegen derzeit mehr geschützte Pfade als eindeutige Inhalte vor.

Dazu gehören insbesondere:

- sämtliche bekannten Hi-Res-Hilfe-Master;
- sämtliche Premium-/Hi-Res-Master der weltweiten Ortssuche;
- ältere Zielvarianten;
- das ursprüngliche große About-Schließen-Masterbild;
- das ursprüngliche Kopier-Masterbild;
- das ältere V4.06-Premium-X im Legacy-Bereich.

Verbindliche Schutzquellen:

- `docs/ASSET_RETENTION_POLICY.md`
- `tests/contracts/hires-asset-retention-v4.07.56.json`
- `scripts/verify-hires-asset-retention.mjs`
- `.github/workflows/hires-asset-retention.yml`

## Build- und Paketvertrag

Der kanonische Frontend-Build erzeugt bzw. prüft:

- identisches V4.07.56-Frontend für Integration und Dashboard;
- identisches externes Locale-Modul;
- 16 aktive Runtime-Assets plus 1 bewusst erhaltenes Legacy-Runtime-Asset;
- das historische V4.06-Dashboard-Paket;
- das kanonische V4.07-Dashboard-Paket;
- ein gemeinsames SHA256-Inventar einschließlich beider Pakete.

Das V4.07-Dashboard-Paket ersetzt bei einer V4.07-Installation das V4.06-Paket. Beide dürfen nicht gleichzeitig als aktive Home-Assistant-Packages geladen werden, weil sie dieselben `lightning_detection_*`-Helfer besitzen.

## Erfolgreiche technische Gates

Auf dem V4.07.56-Finalisierungszweig wurden erfolgreich ausgeführt bzw. geschützt:

- deterministischer Frontend-Neubau;
- bytegenaue Frontend-/Locale-/Asset-Parität beider Auslieferungsformen;
- JavaScript-Syntaxprüfung;
- 19-Sprachen-/Help-/Recorder-Verträge;
- V4.07.56 Settings-/Help-Browserprofile;
- V4.07.56 Golden-Vertrag;
- vollständige Browserprüfungen für beide Auslieferungsformen;
- Diagnosevertrag;
- Hi-Res-Retentionsvertrag;
- Dashboard-V4.07-Paketvertrag;
- HACS-Integrationsprüfung;
- Hassfest;
- Home-Assistant-2026.9.0-Laufzeitprüfung.

Die endgültige grüne Prüfung muss auf dem letzten Dokumentations-/Prüfsummen-Commit nochmals vollständig bestätigt werden.

## Bewusst getrennte externe Prüfungen

Folgende Punkte betreffen externe Integrationen bzw. besondere Netzumgebungen und dürfen nicht mit der bereits erfolgten V4.07.56-Produktabnahme verwechselt werden:

- reales Verhalten der separat installierten Blitzortung-Integration bei kleinen/großen Standortbewegungen;
- reale Neuabonnierungs-/Datenregions-Latenz von Blitzortung;
- Neustart-/Restore-Verhalten mit einer konkret eingerichteten Blitzortung-`Location entity`;
- Recorder-/Datenbankauswirkungen häufiger Standortwechsel;
- reale DNS-Filter-/Proxy-/TLS-Inspection-/Segmentierungsfälle, soweit eine entsprechende Umgebung verfügbar ist.

Gewitterradar behauptet nicht, dass ein Karten-/Trackerwechsel bereits die Blitzortung-Datenregion synchronisiert hat. Diese Trennung bleibt Bestandteil der Hilfe und Architektur.

## Promotion nach `main`

`main` bleibt bis zur ausdrücklichen Freigabe unverändert.

Vor einer Promotion müssen der exakte Finalisierungs-Commit, alle Release-Gates, Dokumentation, Prüfsummen und der PRE-MERGE-Snapshot des bisherigen `main` verifiziert sein. Nach dem Merge werden dieselben relevanten Gates auf dem tatsächlichen neuen `main` erneut ausgeführt. Erst danach darf aus genau diesem Commit ein Golden Master bzw. öffentlicher Release-/Tag-Stand erzeugt werden.

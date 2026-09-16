# Gewitterradar – Projektgeschichte

Dieses Dokument fasst die Entwicklungslinie zusammen, die für den gemeinsamen Produktstand von Dashboard-Karte und nativer Home-Assistant-Integration relevant ist. Technische Einzelschritte bleiben zusätzlich im `CHANGELOG.md` und in den spezialisierten Dokumenten unter `docs/` nachvollziehbar.

## Zeitachse

Das Gewitterradar-Projekt begann **2026/08**. Die sichtbaren V3.x-Meilensteine der Release History gehören zur Entwicklungsphase `2026/08`. Die erste stabile V4.00 und die darauf folgenden öffentlichen V4.01 bis V4.06 gehören zur Release-Phase `2026/09`.

Seit V4.06 ist die Monatskennung Teil des verbindlichen Releaseformats: Der aktuelle Stand wird als `YYYY/MM · Vx.xx` dargestellt, historische Einträge als `Vx.xx · YYYY/MM`. Der vollständige Ablauf ist in `docs/RELEASE_PROCESS.md` festgeschrieben.

## V4.05 · 2026/09 – eingefrorene visuelle Referenz

V4.05 wurde als geschützte visuelle Ausgangsbasis für die weitere Produktkonvergenz eingefroren. Die öffentliche V4.05 führte das Premium-Erlebnis **„Über Gewitterradar“** mit First-Start-Onboarding, wieder aufrufbarem Informationsdialog und der persönlichen Widmung **„Für Alkje“** ein.

Besonders geschützt sind Hero- und Widmungsdarstellung, Slogan, Recorder-Hinweis, Radien-Semantik, Entitätenübersicht und Onboarding-Verhalten. Die freigegebenen Premium-Bedienelemente und Mastergrafiken bleiben als Original- bzw. Legacy-Bestand erhalten.

## V4.06 · 2026/09 – ein Produkt, zwei Auslieferungsformen

Mit V4.06 wird Gewitterradar fachlich und technisch als ein gemeinsames Produkt gepflegt. Die gemeinsame Frontend-Quelle wird deterministisch in zwei Auslieferungsformen erzeugt:

- native Home-Assistant-Integration;
- Dashboard-/Lovelace-Auslieferung.

Abweichungen des gemeinsamen Frontends, der Assets oder der Prüfsummen zwischen beiden Auslieferungsformen gelten als Fehler. Die Build- und Prüfkette rekonstruiert beide Varianten aus derselben Quelle und vergleicht sie bytegenau.

V4.06 vervollständigte außerdem die Internationalisierung mit **15 Sprachen plus 4 deutschen Dialektvarianten = 19 Sprachvarianten**, den umfangreichen Dialog **„Hilfe & Hinweise“**, die Recorder-Wildcard-Regeln, die Premium-Oberfläche sowie die Geräteabnahme auf Desktop, Android, iPad und iPad Pro.

Die sichtbare Release History wurde wieder lückenlos für V4.00 bis V4.06 hergestellt. V4.06 blieb anschließend die öffentliche Rückfallbasis während der Entwicklung von V4.07.

## V4.07 · 2026/09 – weltweite Standortarchitektur

V4.07 erweitert das gemeinsame Produkt um einen dynamischen Gewitterradar-Bezugsstandort und eine weltweite Ortssuche. Der Standortwechsel bleibt bewusst von der tatsächlichen Blitzdatenregion getrennt: Karte, Radien, Entfernungen, Kompass und Bewertung verwenden den Gewitterradar-Bezugsstandort, während die separat installierte Blitzortung-Integration ihre Datenregion nach eigener Bewegungs- und Abonnementlogik nachführt.

Zum V4.07-Funktionsumfang gehören insbesondere:

- weltweite Orts-/PLZ-Suche;
- direkte Koordinateneingabe;
- Open-Meteo als primäre Geocoding-Quelle mit kontrolliertem Nominatim-Rückfall;
- lokale Länder-Autovervollständigung, Länderfilter und Gruppierung;
- Gewitterradar-eigener dynamischer GPS-Tracker;
- separater Dashboard-Tracker für die zweite Auslieferungsform;
- gespeicherte Orte über Local-To-do;
- Speichern, reversibles Entfernen und Wiederherstellen ohne Duplikatbildung;
- automatische Kartenfokussierung nach Standortübernahme;
- dokumentierter halbautomatischer Blitzortung-Einrichtungsweg über `Location entity`;
- vollständige Hilfe zu externen Diensten, Firewall-/Netzwerkpfaden und Standortarchitektur;
- vollständige 19-Varianten-Sprachmatrix.

## V4.07.31 · 2026/09 – historischer Near-Final-Punkt

V4.07.31 war am 14.09.2026 ein wichtiger Near-Final-Konsolidierungspunkt. Deutsch und Englisch blieben nativ, 17 weitere Varianten wurden aus dem externen Locale-Modul geladen, und Boarisch, Plattdüütsch, Sächs’sch sowie Schwäbisch wurden von großen Standarddeutsch-Hilfeblöcken bereinigt.

Die damalige deterministische Identität und die TEST1–TEST31-Entwicklung bleiben in `docs/RELEASE_NOTES_V4_07_31_TEST.md` und `docs/RELEASE_NOTES_V4_07_TEST.md` dokumentiert. V4.07.31 ist **nicht mehr der aktuelle Releasekandidat**.

## V4.07.54 · 2026/09 – abgenommener normaler UI-/Funktionsstand

V4.07.54 wurde als verbindlicher normaler UI-/Funktionsstand abgenommen. Ab diesem Punkt gilt für die V4.07.56-Finalisierung ein harter Funktionsschutz: Karte, Ortssuche, Sprachen, Hilfe, Radien und normale Bedienung werden nicht erneut umgebaut.

Zu den abgenommenen Bereichen gehören insbesondere die vollständige Mehrsprachigkeit, Hilfe-/Hinweisstruktur, Ortssuche und Koordinateneingabe, gespeicherte Orte, die akzeptierte Android-Kartenlegende sowie die finale normale Medaillon-/Kompass-/Radien-Darstellung.

## V4.07.55/V4.07.56 · 2026/09 – Diagnosewerkzeuge

Nach dem normalen Funktions-Freeze wurde ausschließlich der Diagnosebereich erweitert.

V4.07.55 führte den globalen Diagnosemodus mit pinkem Aktiv-Rahmen, dauerhaft erreichbarer Diagnosekonsole, getrenntem Ausblenden der Childtools und Master-Hard-Stop ein. Zusätzlich kamen virtuelle Gewitterszenarien AUS / BEOBACHTUNG / GEWITTER / GEFAHR / GESAMT hinzu.

V4.07.56 ergänzte deterministische Mehrzellen-Simulationen mit **1–5 Zellen** und den Schalter **EXTREM**. EXTREM verändert keine Produktgrenzwerte und erzwingt keine Farbe; die synthetischen Blitze werden so erzeugt, dass die bestehende produktive Cluster-/Extrempipeline selbst entscheidet.

Ebenfalls abgenommen wurden Gruppiert/Einzelblitze, Childtool-Ausblenden, Hard-Teardown und die Medaillon-Zustände **LEER / PFEIL / TREND / FREEZE / NORMAL**.

Dieser Diagnoseumfang ist seitdem dauerhaft geschützt durch:

- `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md`;
- `tests/contracts/diagnostic-contract-v4.07.56.json`;
- `scripts/verify-diagnostic-contract.mjs`;
- `.github/workflows/diagnostic-contract.yml`.

## V4.07.56 – kanonische akzeptierte Identität

Der abgenommene V4.07.56-Frontendstand besitzt folgende Identität:

- Haupt-JavaScript: **1.955.141 Bytes**;
- SHA256: `249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a`;
- externes Locale-Modul SHA256: `997c4fe9b357935888fdb7bedc43cdd17f105b97241a000324891cea575dd436`;
- native Integration: **0.19.0**;
- kanonisches Dashboard-Paket: `app_gewitterradar_v4_07_pkg.yaml`;
- Dashboard-Paket SHA256: `1b705c5686e6a7be6dfb36717903df551d4f9f93787c39bd12bddf00aefae694`.

Integration und Dashboard enthalten bytegleich dieselbe Frontend-/Locale-/Asset-Payload. Das historische V4.06-Paket bleibt als Rückfall-/Migrationsreferenz erhalten, V4.07 wird jedoch als eigener deterministischer Paketbestand gebaut und gehasht.

## V4.07.56 – Golden Master und Browservertrag

Der alte V4.05-Golden-Test bleibt als historische Referenz erhalten. Für V4.07.56 wurde ein eigener Golden-Vertrag eingeführt.

Er schützt:

- die exakte akzeptierte Frontendidentität;
- sieben feste Darstellungsprofile;
- Geometrie mit maximal **0,02 px** Toleranz;
- pixelbezogene Gleichheit von Dashboard und Integration innerhalb desselben CI-Laufs;
- aktuelle sichtbare Schließen-X-Geometrie bei weiterhin großem 44×44-Touchbereich;
- passende Desktop- und Touch-Fokus-/Tastaturpfade.

Damit wird V4.07.56 nicht auf die historische V4.05-Dialoggeometrie zurückgezwungen, sondern besitzt eine eigene reproduzierbare Abnahmebasis.

## V4.07.56 – dauerhafter Hi-Res-/Legacy-Schutz

Während der Finalisierung wurde die dauerhafte Aufbewahrung aller Hi-Res-/Mastergrafiken als globale und projektspezifische Regel festgeschrieben.

Geschützte Master dürfen ihren Runtime-Einsatz verlieren, aber nicht stillschweigend gelöscht werden. Git-Historie allein gilt nicht als ausreichendes Archiv. Nicht mehr aktive Master werden bei Bedarf in einen logischen/versionierten Legacy-/Archivbereich verschoben.

Für Gewitterradar existiert zusätzlich ein fail-closed Retentionsvertrag mit aktuell **32 eindeutigen geschützten Master-/Legacy-Inhaltsidentitäten**. Er schützt unter anderem sämtliche bekannten Hilfe-Master, die Premium-Master der weltweiten Ortssuche, frühere Zielvarianten sowie alte About-Schließen-/Kopiergrafiken.

Verbindliche Schutzquellen:

- `docs/ASSET_RETENTION_POLICY.md`;
- `tests/contracts/hires-asset-retention-v4.07.56.json`;
- `scripts/verify-hires-asset-retention.mjs`;
- `.github/workflows/hires-asset-retention.yml`.

## Qualitätssicherung und Promotion

V4.07.56 wird durch deterministischen Frontend-Neubau, SHA-/Asset-Parität, Browserprofile, Sprach-/Locale-/Recorder-Prüfungen, V4.07.56-Golden-Vertrag, Diagnosevertrag, Hi-Res-Retentionsvertrag, Home-Assistant-Laufzeittests, HACS, Hassfest und Paketverträge abgesichert.

Der PRE-MERGE-Snapshot des bisherigen `main` wurde bereits gemäß Promotion-Audit erzeugt und außerhalb GitHub gesichert. `main` bleibt jedoch bis zur ausdrücklichen Benutzerfreigabe unverändert.

Nach einer kontrollierten Promotion müssen die relevanten Gates auf dem tatsächlichen neuen `main` erneut vollständig grün sein. Erst danach darf der Golden Master aus genau diesem Commit erzeugt und derselbe Commit öffentlich getaggt/veröffentlicht werden.

Detaillierte Abschlussnotizen: `docs/RELEASE_NOTES_V4_07_56.md`.

Externe Prüfungen des separat installierten Blitzortung-Datenregionswechsels sowie spezieller DNS-/Proxy-/TLS-Inspection-Umgebungen bleiben davon getrennt und werden nicht fälschlich als bereits abgeschlossen dargestellt.

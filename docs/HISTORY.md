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

## V4.08 · 2026/09 – Cluster-Auflösung und Cluster-Navigation

V4.08 entwickelt die Cluster-Darstellung auf dem geschützten V4.07.56-Stand weiter und wurde auf Basis des akzeptierten internen Builds V4.08.40 RC als öffentliche V4.08 finalisiert. Der frühere V4.08-Testschalter **„Cluster-Auflösung · V4.08 TEST“** wird durch eine echte Profilauswahl ersetzt. Die Einstellung beschreibt nun ausdrücklich, **wann Cluster in Einzelblitze aufgelöst werden**.

Die Testprofile sind **Früh**, **Ausgewogen**, **Spät** und **Klassisch · V4.07.56**. Ausgewogen entspricht der bisher erprobten zonenabhängigen V4.08-Abstimmung. Früh löst Cluster früher auf, Spät hält sie länger zusammen. Klassisch reproduziert weiterhin exakt den geschützten V4.07.56-Rückfallpfad. Ein adaptives Profil „Automatisch“ ist zu diesem Zeitpunkt bewusst noch nicht implementiert.

Parallel wurde die bisherige Bezeichnung **„Cluster-Sprung · Sitzungszeit“** in **„Cluster-Navigation · Sitzungszeit“** überführt. Die Navigation unterstützt 5–3600 Sekunden oder `∞`; Countdown und Unendlich-Modus können direkt in der Statusanzeige umgeschaltet werden. Die in V4.08.21 korrigierte Pointer-Down-Behandlung macht diese Umschaltung auf Desktop und Touch zuverlässig, ohne gleichzeitig einen Cluster-Sprung auszulösen.

Die ornamentale Unendlichkeitsgrafik im gealterten Gold-/Messingstil bleibt als gemeinsames Bedien- und Statusmotiv erhalten. Die verkleinerte Runtime-Grafik ersetzt den später geschützten Hi-Res-Master ausdrücklich nicht.

### Repository- & Web-Dokumentation optimiert

Die Installations- und Projektdokumentation wurde visuell und inhaltlich überarbeitet. Der neue mehrsprachige Gewitterradar-Webauftritt stellt Installation und Einrichtung weiterhin in den Mittelpunkt und ergänzt eine kompakte Funktionsübersicht mit optimierten WebP-Grafiken, Galerieansicht und direkter Bildvergrößerung. Die Repository-Startseite nutzt zusätzlich absolute Bildpfade für Logo und Hero-Grafik, damit die Darstellung auch innerhalb von HACS zuverlässig funktioniert.

Die öffentliche V4.08 normalisiert gegenüber dem akzeptierten V4.08.40 RC ausschließlich Release-Metadaten. Das finale Frontend besitzt 2.028.645 Bytes mit SHA256 `b75390652fae4aa98c77162fb207d97ece408ab617bbf107bcb0f3b9466a691f`; das Locale-Modul besitzt 705.974 Bytes mit SHA256 `a57493b6291671696aeb87c267595e3ce5fede987546f702d7883ef6f07bd288`. Die native Integration wird als 0.20.0 veröffentlicht. Neue Entwicklung beginnt anschließend auf V4.09.xx.

Detaillierte Testdokumentation:

- `docs/V4_08_CLUSTER_RESOLUTION_PROFILES.md`;
- `docs/RELEASE_NOTES_V4_08_TEST.md`;
- `docs/V4_08_CLUSTER_RESOLUTION_ANALYSIS.md`;
- `docs/V4_08_INFINITY_GFX.md`.

## V4.09 · 2026/09 – Kartenansichten, Vollbildinstrumente und separates Kartenfenster

V4.09 erweitert den veröffentlichten V4.08-Stand um eine neue, geräteübergreifende Kartenbedienung. Die direkte Kartendarstellung kann zwischen **Standard**, **Groß** und **Vollbild** wechseln; die bevorzugte **Standardansicht** wird lokal je Gerät bzw. Browserprofil gespeichert. Zusätzlich kann die Gewitteransicht mit der aktuell gewählten Karte und dem aktuell gewählten Kompass in einem separaten Kartenfenster geöffnet werden, ohne die normale Dashboard-Ansicht zu ersetzen.

Im Vollbild wurden Kompass und Medaillon zu eigenständigen, ein-/ausblendbaren und frei verschiebbaren Instrumenten weiterentwickelt. Die Standort-Pille ist ebenfalls frei beweglich; ihr Menü passt Öffnungsrichtung, Spaltenzahl und Scrollverhalten an die verfügbare Bildschirmfläche an. Kartenbedienung, Radiusdialoge, Ortssuche und Layer-Schalter bleiben dabei in der vorgesehenen Vordergrundreihenfolge bedienbar.

Der neue 3D-Kartenansichtsschalter verwendet die freigegebene Gold-/Blau-/Rot-Darstellung und öffnet ein kompaktes responsives Auswahlmenü. Das Kartenansicht-Popup selbst sowie **Hilfe & Hinweise** wurden auf den vollständigen Produktumfang von **15 Sprachen plus 4 deutschen Dialektvarianten = 19 Varianten** synchronisiert.

Der sichtbare Versionsverlauf trennt seit V4.09 strikt zwischen öffentlichen Releases und internen Entwicklungsständen. Die dauerhafte Sektion **„Zukünftige Entwicklungen · Geplant“** bleibt oberhalb der veröffentlichten Historie erhalten; interne V4.09.xx-DEV-/TEST-Iterationen werden dort nicht als öffentliche Releases geführt.

Akzeptierter interner Ausgangsstand: **V4.09.24**. Die öffentliche V4.09 normalisiert daraus ausschließlich die öffentlichen Versions-/Build-Metadaten.

Release-Identität:

- Frontend: **2.234.030 Bytes**, SHA256 `2dad877e61654f5261650511f595820e55a8432fcdb0f7387f75bfb9e0271b1f`;
- externes Locale-Modul: **741.069 Bytes**, SHA256 `dc6506291dd4cfe75e3b9c829fb42f21062511fb574d335af438e6c42711802e`;
- neuer Runtime-Kompassschalter: SHA256 `bd6ce5bbd20a9db8af174f14ff284461c41e0ee620443f5e42b9c298e9072a0a`;
- native Integration: **0.21.0**;
- Build: `V4.09-RELEASE-2026-09-21`.

Als nächste öffentliche Entwicklung sind unterschiedliche Medaillions, Verbesserungen der Kompass-/Medaillion-Auswahl und die Implementierung von Wetterdiensten über WeatherRouter vorgesehen.

## Qualitätssicherung und Promotion

V4.08 wurde am **18.09.2026** vollständig nach dem verbindlichen PRE-MERGE-/Golden-Master-Vertrag veröffentlicht.

Kanonischer öffentlicher Release-Commit:

`27da94e5043a365dbe8ea5c5e2224327165750fa`

Unveränderliche Referenzen:

- Tag `v4.08`;
- Freeze-Branch `frozen/v4.08`;
- GitHub Release **Gewitterradar V4.08**;
- native Integration **0.20.0**;
- finales Frontend **2.028.645 Bytes**, SHA256 `b75390652fae4aa98c77162fb207d97ece408ab617bbf107bcb0f3b9466a691f`;
- Locale-Modul SHA256 `a57493b6291671696aeb87c267595e3ce5fede987546f702d7883ef6f07bd288`.

Die Post-Merge-Gates auf dem tatsächlichen Release-Commit waren vollständig grün: gemeinsame Frontend-/Browserprüfung, Home-Assistant-/HACS-/Hassfest-Validierung, Diagnosevertrag, Hi-Res-Retention und Source-Archive-Vertrag.

Der PRE-MERGE-Snapshot wurde aus dem alten `main`-Commit `1928649627f81b2c2c6b0888f1f5ad8601205db5` erzeugt. Der Golden Master wurde anschließend aus exakt dem veröffentlichten V4.08-Commit `27da94e...` erzeugt. Beide Archivstände wurden zusätzlich außerhalb des laufenden Repositorys gesichert.

Die abgeleitete Dashboard-/Lovelace-Auslieferung wurde ebenfalls als **V4.08** veröffentlicht und ist bei Frontend und Locale bytegleich zur kanonischen Ausleitung. Dashboard-Release-Commit: `cba234a37f20971c2f64b393202dbb70007dc19d`.

V4.08 ist damit abgeschlossen und funktional eingefroren. Neue Produktentwicklung beginnt ausschließlich auf **V4.09.xx**.

Vollständiger Release-Abschluss und Übergabe:

`docs/HANDOFF_V4_08_RELEASE_CLOSEOUT_2026-09-18.md`

Externe Prüfungen des separat installierten Blitzortung-Datenregionswechsels sowie spezieller DNS-/Proxy-/TLS-Inspection-Umgebungen bleiben fachlich getrennte Umgebungsprüfungen und sind keine nachträglichen V4.08-Release-Blocker.

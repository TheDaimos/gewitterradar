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

## V4.09.01–V4.09.06 · 2026/09 – Kartenansichten und Vollbild-Instrumente

Nach dem V4.08-Freeze begann die V4.09.xx-Linie mit einem klar begrenzten Kartenansichtsblock. V4.09.01 ergänzte **Standard · Groß · Vollbild**, ein separates Kartenfenster in den Einstellungen sowie den aktuell ausgewählten Kompass als im Vollbild wiederverwendetes und per Maus/Touch verschiebbares Overlay. Standard/Groß und die normalisierte Kompassposition wurden lokal gespeichert; die Leaflet-Instanz blieb beim Größenwechsel erhalten.

Die erste reale Geräteprüfung von V4.09.01 am 20.09.2026 lieferte zwei konkrete Befunde:

- das separate Browserfenster zeigte die Home-Assistant-Oberfläche, die Karte wurde dort jedoch nicht zuverlässig in den vorgesehenen Vollbildpfad überführt;
- die direkte Kartenansichtssteuerung war auf Android auffindbar, auf Desktop jedoch so unauffällig, dass sie real zunächst nicht gefunden wurde.

V4.09.02 ersetzte deshalb die breite Größenleiste durch **eine kompakte Layer-Schaltfläche rechts unten innerhalb der Karte**. Das Symbol verwendet verbindlich die Radien-Farblogik: **unten klein rot**, **Mitte mittel blau**, **oben groß gold**. Beim Tippen/Klicken öffnet sich unmittelbar an der Schaltfläche ein Kontextmenü mit **Standard · Groß · Vollbild**. „Eigenes Kartenfenster“ bleibt bewusst getrennt und ausschließlich in den Einstellungen. Zusätzlich kam die nur im lokalen Browserprofil gespeicherte **Startdarstellung** Standard / Groß / Vollbild / Zuletzt verwendet hinzu.

Die anschließende Vollbildprüfung führte zu V4.09.03. Der Vollbildpfad wurde dabei gezielt vervollständigt:

- Warnsystem-Testschaltflächen sind fail-closed und erscheinen nur bei ausdrücklich eingeschalteter Warnsystem-Simulation – unabhängig davon, ob die Kartenkarte im normalen DOM oder im Vollbilddialog liegt;
- die bestehende Standortanzeige samt bestehendem Standortmenü wird im Vollbild automatisch oben rechts eingesetzt;
- die Layer-Schaltfläche erhält dauerhaft die höchste Karten-Bedienebene;
- der ausgewählte Vollbild-Kompass wird **exakt 30 % größer** und bleibt frei verschiebbar;
- zwei stark verkleinerte Schalter oben links blenden Kompass und Medaillon unabhängig ein oder aus;
- das Live-Tendenzmedaillon wird als eigenes Vollbild-Overlay gerendert, spiegelt die normale Trendlogik und ist ebenfalls frei verschiebbar;
- Sichtbarkeit und Position beider Instrumente werden ausschließlich lokal pro Browserprofil gespeichert.

Der separate Fensterpfad, die Leaflet-Instanz, Cluster-/Radienlogik und die geschützten V4.08-/V4.07.56-Verträge bleiben unverändert.

Die reale Android-Prüfung von V4.09.03 zeigte anschließend zwei weitere konkrete Vollbildfehler: Der Kompass ließ sich per Touch nicht zuverlässig verschieben, obwohl die synthetische Pointer-Prüfung bestand, und das Kartenmedaillon war durch die gemeinsame `.trend`-Klasse unnötig an die Layoutregeln der History-/Tendenzeinheit gekoppelt. Zusätzlich sollte die Layer-Schaltfläche näher an die OpenStreetMap-Attribution rücken.

V4.09.04 härtet deshalb die tatsächlichen Hit-Flächen für **Desktop, Android und iPad/iPad Pro**. Beim Kompass empfängt der äußere Overlay-Container die Pointer-Ereignisse; die verschachtelte Instrumentgeometrie kann Touch-Ereignisse nicht mehr abfangen. Das Medaillon verwendet denselben Ansatz. Gleichzeitig wurde das Vollbild-Medaillon vollständig von der History-Struktur getrennt: Es besteht dort nur noch aus Medaillon-Basis und Trendpfeil und übernimmt ausschließlich die Zustände `none / up / stable / down`. Die Layer-Schaltfläche berechnet ihre untere Position nun aus der tatsächlichen Leaflet-Attributionshöhe und bleibt mit kleinem Sicherheitsabstand direkt darüber.

V4.09.04 ist weiterhin ein **DEV-/Testkandidat**; ein Merge nach `main`, Release-Tag, Freeze und Golden Master erfolgen erst nach erneuter realer Geräteabnahme auf Desktop, Android und iPad/iPad Pro.

Die Geräteprüfung von V4.09.04 bestätigte Desktop vollständig: Kompass und Medaillon waren ein-/ausblendbar und frei verschiebbar. Auf Android funktionierte zwar die Sichtbarkeitssteuerung, die Drag-Geste selbst jedoch weiterhin nicht. V4.09.05 ergänzt deshalb neben Pointer Events einen expliziten nicht-passiven Touch-Event-Pfad für die komplette Finger-Geste. Dieser Pfad ist bewusst nicht Android-exklusiv und dient auch iPad/iPad Pro als robuster Touch-Fallback. Zusätzlich wird das Medaillon anhand der Android-Kennung ausschließlich dort um exakt 15 % verkleinert; Desktop und iPad bleiben unverändert.

V4.09.05 bleibt ein **DEV-/Testkandidat**. Vor Promotion ist die reale Android-Abnahme des Finger-Draggings zwingend; iPad/iPad Pro und Desktop werden anschließend regressionsgeprüft.

V4.09.06 erweitert anschließend die bereits im Vollbild vorhandene Standortanzeige: Die Standort-Pille erhält eine eigene normalisierte, lokal gespeicherte Position und lässt sich mit Maus oder Touch frei über der Karte verschieben. Das bestehende Standortmenü bleibt dieselbe Datenquelle und Logik; nur seine Vollbilddarstellung wird adaptiv. Je nach vertikaler Pillenposition öffnet es bevorzugt nach unten oder oben. Befindet sich die Pille in der mittleren Zone oder reicht der Raum in der bevorzugten Richtung für den vollständigen Inhalt nicht aus, wechselt das Menü automatisch auf mehrere Spalten. Diese Berechnung wird bei geöffneter Liste während des Verschiebens fortlaufend aktualisiert. Erst wenn auch die verfügbaren Spalten nicht ausreichen, bleibt internes Scrollen als Rückfall.

Die reale Vollbildsicht auf Android wurde anschließend als visueller Referenzstand festgeschrieben: **Kompass und Medaillon besitzen in der aktuellen V4.09.06-Darstellung die gewünschte Größe.** Insbesondere bleibt die in V4.09.05 eingeführte Android-Verkleinerung des Medaillons um 15 % erhalten. Beide Instrumentgrößen werden ohne neuen ausdrücklichen Auftrag nicht erneut verändert.

Die frei bewegliche Standort-Pille bleibt ebenfalls im aktuell angenommenen Zustand. Die automatische Mehrspaltigkeit des Standortmenüs ist real nicht in allen Situationen zuverlässig; diese Einschränkung ist ausdrücklich akzeptiert und blockiert V4.09.06 nicht. Ohne neuen ausdrücklichen Auftrag wird dieser Teil nicht erneut geöffnet.

Zum dokumentierten Übergabezeitpunkt sind die native Integrationsprüfung und der Hi-Res-Retentionsvertrag grün. Die Shared-Frontend-Prüfung ist noch rot, jedoch im bestehenden Diagnose-FREEZE-Lifecycle-Harness: Der Test meldet `mode=freeze`, Winkel `45` und gleichzeitig keine aktive CSS-Animation, Timer oder RAF-Schleife. Dieser Prüfpfad muss vor einer Promotion geklärt werden, ohne die visuell abgenommenen Instrumentgrößen wieder zu verändern.

Verbindliche Detaildokumentation:

- `docs/V4_09_01_MAP_DISPLAY_TEST_CANDIDATE.md`;
- `docs/V4_09_02_MAP_DISPLAY_DEVICE_FIX.md`;
- `docs/V4_09_03_FULLSCREEN_CONTROLS.md` (historischer/superseded Zwischenstand);
- `docs/V4_09_04_OVERLAY_DRAG_FIXES.md` (superseded Testzwischenstand);
- `docs/V4_09_05_ANDROID_TOUCH_DRAG.md` (superseded Testzwischenstand);
- `docs/V4_09_06_MOVABLE_LOCATION_PILL.md`;
- `docs/RELEASE_NOTES_V4_09_06_TEST.md`;
- `docs/HANDOFF_V4_09_06_MOVABLE_LOCATION_PILL_2026-09-20.md`;
- `docs/CHAT_HANDOFF_V4_09_06_2026-09-20.md`.


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

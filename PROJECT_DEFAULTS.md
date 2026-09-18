# Gewitterradar Project Defaults

Dieses Repository nimmt am gemeinsamen TheDaimos-Bootstrap-Modell teil.

Kanonische globale Regeln:

`TheDaimos/project-defaults`

Vor umfangreicher Arbeit in einem frischen ChatGPT-/Codex-Kontext zuerst die aktuellen globalen Defaults, danach die aktuellen Regeln und den Zustand dieses Repositories und anschließend bei Bedarf das gemeinsame Dev-Toolkit laden.

Bevorzugte Bootstrap-Mnemoniken, vollständig gleichwertig:

> **Deimos**  
> **Daimos**

Alle Bootstrap-Aliase sind fail-closed: Die aktuelle `TheDaimos/project-defaults/START_HERE.md` muss tatsächlich geladen und befolgt werden, bevor Arbeitsbereitschaft erklärt wird. Ein alleinstehendes `Deimos`/`Daimos` darf nicht zuerst aus Erinnerung oder nur als Projektbezug beantwortet werden.

## Verbindliche Produktregel: ein Gewitterradar, zwei Auslieferungsformen

Für Christian und ChatGPT/Codex existiert fachlich nur **Gewitterradar**.

Die native Home-Assistant-Integration und die Dashboard-/Lovelace-Auslieferung sind **keine getrennten Produkte und keine getrennten Entwicklungsstände**, sondern ausschließlich zwei Auslieferungsformen desselben Gewitterradar-Produkts.

`TheDaimos/gewitterradar` ist die **kanonische Single Source of Truth für die weitere Produktentwicklung**.

Sofern der Benutzer eine Aufgabe nicht ausdrücklich auf nur eine Auslieferungsform begrenzt, gilt jede Änderung an Gewitterradar automatisch für **beide** Auslieferungsformen. Das betrifft insbesondere:

- Funktionen und Verhalten;
- Karte und Darstellung;
- Einstellungen und native Konfiguration;
- „Über Gewitterradar“, Slogan und Danksagungen;
- Kompass, Selector, Recent-Liste, Aura, Radien und Playback;
- Texte, Übersetzungen und Barrierefreiheit;
- Assets, Grafiken und Styling;
- Fehlerbehebungen, Regression Guards und Plattformkompatibilität.

Gemeinsamer Frontend-/Produktcode darf nicht unabhängig in zwei Repositories gepflegt werden. Er wird einmal in diesem Repository entwickelt und daraus deterministisch für beide Auslieferungsformen gebaut bzw. synchronisiert.

## Harte Schutzregel: „Über Gewitterradar“ V4.05

Der am 2026-09-07/08 ausdrücklich abgenommene V4.05-Stand des **„Über Gewitterradar“-Dialogs / About-Dialogs** ist eine geschützte Acceptance-Baseline.

Verbindliche Schutzquelle:

`docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md`

Die dort dokumentierte Danksagung/Widmung „Für Alkje“, der Slogan, die Texte, die visuelle Gestaltung, Hero-/Widmungs-Assets, Recorder-Darstellung, Radien-Semantik, Blitzortung.org-Danksagung, Entitätenübersicht und das Onboarding-/Dialogverhalten müssen bei der Konvergenz vollständig erhalten bleiben.

Dieser Stand darf **nicht** aus Kostengründen, bei Refactoring, beim Packaging, beim Wechsel der Auslieferungsform oder aus technischer Bequemlichkeit vereinfacht, weggelassen, ersetzt oder neu gestaltet werden. Änderungen an dieser Acceptance-Baseline benötigen eine ausdrückliche Benutzerentscheidung.

Ein gemeinsamer Build oder Release ist **nicht releasefähig**, solange der geschützte About-Stand nicht in beiden Auslieferungsformen vorhanden und gegen die eingefrorene Referenz bzw. den daraus entwickelten aktuellen Golden-Vertrag verifiziert ist.

## Harte Schutzregel: normaler UI-/Funktionsstand V4.07.54

Der ausdrücklich abgenommene normale UI-/Funktionsstand von **V4.07.54** ist für die V4.07.56-Finalisierung gesperrt.

Ohne ausdrückliche neue Benutzerentscheidung werden insbesondere **nicht** erneut verändert:

- Kartenlogik und normale Darstellung;
- weltweite Ortssuche und Koordinateneingabe;
- gespeicherte Orte;
- Sprachen und Dialekte;
- „Hilfe & Hinweise“;
- Radien und Aura;
- normale Kompass-/Medaillon-Funktion;
- normale Bedienung, Controls und akzeptierte gerätespezifische Layouts.

V4.07.55/V4.07.56 dürfen diesen Stand ausschließlich um Diagnose-/Schutzfunktionen ergänzen. Algorithmische Änderungen, insbesondere an Cluster-/Zoom-Verhalten, gehören in den separaten V4.08-Arbeitsblock.

## Permanente Schutzregel für Hi-Res-Mastergrafiken

Nicht mehr verwendete, ersetzte oder überarbeitete Hi-Res-Mastergrafiken werden **niemals automatisch gelöscht**.

Sie bleiben dauerhaft im Repository erhalten. Wenn sie nicht mehr aktiv verwendet werden, dürfen sie in einen logisch benannten und vorzugsweise versionierten `legacy/`- oder `archive/`-Bereich verschoben werden. Git-Historie allein ist kein ausreichender Ersatz für die direkte Aufbewahrung im aktuellen kanonischen Repositorystand.

Eine Löschung ist ausschließlich zulässig, wenn Christian die konkrete Löschung ausdrücklich anfordert **und** ausdrücklich bestätigt. Aufräumen, Refactoring, Deduplizierung, Repository-Verkleinerung, Ersatz durch ein neues Design, fehlende Runtime-Verwendung oder ein Versionswechsel sind niemals eine Löschfreigabe.

Vor jedem Merge in `main` und vor jedem Release ist der Hi-Res-/Masterbestand zu prüfen. Verschwindet ein Master ohne dokumentierte ausdrückliche Löschfreigabe, ist der Merge/Release blockiert.

Verbindliche Schutzquellen:

- `docs/ASSET_RETENTION_POLICY.md`
- `tests/contracts/hires-asset-retention-v4.07.56.json`
- `scripts/verify-hires-asset-retention.mjs`
- `.github/workflows/hires-asset-retention.yml`

Der Retentionsvertrag ist inhaltsbasiert. Ein geschützter Master darf kontrolliert zwischen zugelassenen Hi-Res-/Legacy-Bereichen verschoben werden, aber nicht aus dem aktuellen kanonischen Repository verschwinden. Runtime-/Derived-Dateien gelten nicht als Ersatz. Neu hinzukommende eindeutige Master-/Legacy-Inhalte müssen fail-closed in den Vertrag aufgenommen werden.

## Harte Schutzregel: Diagnosemodus ab V4.07.56

Der mit V4.07.56 auf realen Geräten abgenommene Diagnosemodus ist eine **dauerhaft geschützte Produktfunktion**. Er darf nicht durch Cleanup, Refactoring, Vereinfachung, Dateiverkleinerung oder fehlende aktuelle Nutzung teilweise entfernt, semantisch abgeschwächt oder unbeabsichtigt beschädigt werden.

Geschützt sind insbesondere:

- Master-Diagnosemodus mit pinkem Aktiv-Rahmen;
- dauerhaft erreichbare, minimier-/maximier- und verschiebbare Diagnose-Konsole;
- getrennte Zustände für „Childtools ausblenden“ und „Diagnose beenden“;
- Master-Hard-Stop für sämtliche Childtools und Simulationen;
- virtuelles Gewitter mit AUS / BEOBACHTUNG / GEWITTER / GEFAHR / GESAMT;
- 1–5 deterministische virtuelle Gewitterzellen;
- EXTREM über die vorhandene produktive Extrem-/Violett-Logik;
- normale Umschaltung Gruppiert / Einzelblitze über die Produktpipeline;
- Medaillon-Presets LEER / PFEIL / TREND / FREEZE / NORMAL einschließlich Detailsteuerung;
- Kompass-/Medaillon-Kalibrierung, Geometrie-/Overlay-/Messwerkzeuge, JSON-/Snapshot-/Performance-Diagnose;
- der Diagnose-Sprachumfang mit 19 Sprachvarianten.

Eine absichtliche Änderung dieses Diagnosevertrags benötigt eine ausdrückliche Benutzerentscheidung, Aktualisierung der Schutzdokumentation und Contract-Tests sowie erneute Abnahme der betroffenen Diagnosebereiche.

Verbindliche Schutzquellen:

- `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md`
- `tests/contracts/diagnostic-contract-v4.07.56.json`
- `scripts/verify-diagnostic-contract.mjs`
- `.github/workflows/diagnostic-contract.yml`

Ein fehlgeschlagener Diagnosevertrag blockiert Freeze, Merge und Release.

## Verbindliche V4.07.56-Golden-/Browserregel

Der historische V4.05-Golden-Test bleibt als Referenz erhalten. Für den abgenommenen V4.07.56-Stand gilt zusätzlich der eigene aktuelle Golden-Vertrag:

- `tests/contracts/about-golden-v4.07.56.json`
- `scripts/verify-about-golden-v40756.cjs`
- `scripts/test-about-browser-v40756.cjs`

Er schützt die exakte akzeptierte Frontendidentität, sieben feste Darstellungsprofile und die eingefrorene Geometrie mit maximal **0,02 px** Toleranz. Dashboard und Integration werden innerhalb desselben CI-Laufs pixelbezogen verglichen. Nicht deterministische Vollbild-Hashes über getrennte CI-Läufe sind Abnahmebeleg, aber kein flackernder Lauf-zu-Lauf-Blocker.

## Verbindliche PRE-MERGE- und Golden-Master-Regel

Bei jeder wesentlichen Promotion eines abgenommenen Gewitterradar-Stands nach `main` wird die kanonische Linie auf beiden Seiten des Übergangs archiviert:

- **vor der Veränderung von `main`**: unveränderlicher PRE-MERGE-Snapshot des exakten alten `main`-Commits;
- **nach dem Merge und erst nach vollständig grünen Abschlussprüfungen**: unveränderlicher Golden Master des exakten neuen `main`-Commits.

Ein Kandidat, Freeze-/Feature-Branch oder PRE-MERGE-Snapshot ist niemals ein Golden Master.

Golden Master und HACS-/Installationspaket sind ausdrücklich verschiedene Artefakte. Der Golden Master enthält den vollständigen in Git geführten Quell-, Test-, Dokumentations-, Workflow- und Assetbestand einschließlich aller aktiven und archivierten Hi-Res-Master sowie Manifest, Dateiinventar und Prüfsummen. Zusätzlich wird eine Git-Bundle-Notfallkopie erzeugt.

Der spätere öffentliche Release-Tag muss auf denselben Commit zeigen, der im Golden-Master-Manifest dokumentiert ist. Archive werden niemals überschrieben; erneute Erzeugungen erhalten einen eindeutig unterscheidbaren Namen.

Verbindliche Detailrichtlinie und Automatisierung:

- `docs/GOLDEN_MASTER_POLICY.md`
- `scripts/create-source-archive.sh`
- `.github/workflows/source-archive.yml`

## Repository-Rollen

- `TheDaimos/gewitterradar` — kanonische Produkt- und Entwicklungsquelle.
- `TheDaimos/gewitterradar-dashboard` — abgeleitete öffentliche Dashboard-/Lovelace-Auslieferung; keine unabhängige Entwicklungsquelle.
- `TheDaimos/gewitterradar-dev` — historisches privates Entwicklungs-/Regressionsrepository.
- `TheDaimos/gewitterradar-integration-dev` — historisches Integrationsentwicklungs-, Test-, Migrations- und Handoff-Repository.
- `TheDaimos/gewitterradar-maplibre-dev` — separater experimenteller Engine-Zweig bis zur ausdrücklich freigegebenen Integration.

Historische Repositories, Handoffs, veröffentlichte Tags und ausdrücklich eingefrorene Release-Stände bleiben als Evidenz und Rückfallpunkte erhalten und werden nicht stillschweigend umgeschrieben oder gelöscht.

### Verbindliche Branch-Lebensdauer

Branches sind **nicht automatisch dauerhafte Archivobjekte**. Für neue normale Entwicklung gilt bewusst ein schlankes Modell:

- `main` ist die laufende kanonische Linie;
- `feature/<thema>` wird nur für einen klar abgegrenzten Arbeitsblock angelegt und nach erfolgreicher Integration/Abnahme wieder entfernt;
- veröffentlichte Versionen werden durch den unveränderlichen Tag `vX.XX` verankert;
- optional bleibt genau ein `frozen/vX.XX` als ausdrücklich benannter Release-/Rückfallanker bestehen;
- routinemäßige `backup/*`, `freeze/*-candidate`, `handoff/*` oder mehrfach redundante Sicherheitsbranches sollen künftig vermieden werden.

Bereits vorhandene Branches dürfen im Rahmen einer **ausdrücklich freigegebenen Aufräumaktion** entfernt werden, wenn vorher verifiziert wurde, dass ihr relevanter Stand vollständig über `main`, einen Release-Tag oder einen ausdrücklich erhaltenen Freeze-Punkt erreichbar bzw. ersetzt ist. Vollständig integrierte/redundante temporäre Branches sollen nach dieser Prüfung gelöscht werden, damit sie nicht fälschlich als aktive Entwicklungsstände erscheinen.

Ein Branch mit **nicht integrierten/abweichenden eindeutigen Commits** wird nicht allein zur optischen Bereinigung gelöscht. Solche Branches bleiben bis zur bewussten fachlichen Prüfung bzw. Archiventscheidung erhalten.

Veröffentlichte Tags und `frozen/vX.XX` werden niemals nachträglich auf einen anderen Commit verschoben.

## Paritäts- und Release-Regel

Build-/Release-Prüfungen sollen verhindern, dass sich Integration und Dashboard unbeabsichtigt auseinanderentwickeln. Wo technisch möglich, müssen mindestens folgende Abweichungen fail-closed behandelt werden:

- unterschiedliche gemeinsame Frontend-Versionen;
- unterschiedliche gemeinsame Frontend-Builds;
- fehlende oder abweichende Assets;
- fehlender oder abweichender geschützter About-/Golden-Stand;
- nicht reproduzierbare Dashboard-Ausleitung aus dem kanonischen Quellstand;
- inkonsistente Prüfsummen oder Release-Metadaten;
- verschwundene geschützte Hi-Res-/Legacy-Master;
- abgeschwächte oder beschädigte Diagnosefunktionen.

Ein Dashboard-spezifischer Notfallfix ist nur nach ausdrücklicher Anweisung zulässig und muss vor dem nächsten normalen Release in die kanonische Quelle zurückgeführt werden.

## Verbindliche Release-Chronologie

Jeder öffentliche Gewitterradar-Release führt zusätzlich zur Version eine Monatskennung `YYYY/MM`. Der vollständige Ablauf steht in `docs/RELEASE_PROCESS.md` und ist bei jeder neuen Version anzuwenden.

Verbindlich sind insbesondere:

- aktueller Stand in Welcome, Einstellungen und Release-History-Kopf: `YYYY/MM · Vx.xx`;
- veröffentlichte History-Einträge: `Vx.xx · YYYY/MM`;
- geplante, noch nicht veröffentlichte Versionen: `Vx.xx · PLANNED`;
- `YYYY/MM` wird aus `GEWITTERRADAR_BUILD` abgeleitet und nicht unabhängig mehrfach hart codiert;
- bei jedem Release werden Welcome-Footer, Settings-Kennung, Release History, Changelog, Projektgeschichte, Meilensteine, Release Notes und relevante README-/Installationsangaben abgeglichen;
- die Release History darf keine öffentliche Version überspringen;
- bereits veröffentlichte Monats-/Versionszuordnungen, Tags und Freeze-Punkte werden nicht stillschweigend umgeschrieben.

Der aktuelle V4.07.56-Sprachumfang bleibt **15 Sprachen plus 4 Dialektvarianten = 19 Sprachvarianten**. Änderungen am Sprachumfang müssen künftig ebenfalls in History und Release Notes nachvollziehbar sein.

## Aktueller Release-/Promotionsstand

Aktueller finaler Promotionsstand ist **2026/09 · V4.08 / native Integration 0.20.0**.

V4.08 basiert funktional auf dem ausdrücklich akzeptierten internen Build **V4.08.40 RC**. Für die öffentliche Version werden ausschließlich Release-Metadaten normalisiert; der deterministische Buildvertrag rekonstruiert RC40 aus dem finalen Frontend und blockiert jede darüber hinausgehende Abweichung.

Kanonische V4.08-Identität:

- Frontend: **2.028.645 Bytes**;
- Frontend-SHA256: `b75390652fae4aa98c77162fb207d97ece408ab617bbf107bcb0f3b9466a691f`;
- akzeptierter RC40: **2.028.691 Bytes**, SHA256 `2c94af487b1142fd9da450e3bbe9751c3ac17631a621b3878fd9665b557d9570`;
- Locale-Modul: **705.974 Bytes**, SHA256 `a57493b6291671696aeb87c267595e3ce5fede987546f702d7883ef6f07bd288`;
- Build: `V4.08-RELEASE-2026-09-18`;
- native Integration: **0.20.0**;
- Dashboard-Pakete V4.06 und V4.07 bleiben als bestehende Rückfall-/Kompatibilitätsbestände erhalten;
- HTML-v14 und acht lossless-WebP-Dokumentationsscreenshots sind Bestandteil des V4.08-Repository-Stands.
- veröffentlichter Release-Commit: `27da94e5043a365dbe8ea5c5e2224327165750fa`;
- unveränderliche Release-Referenzen: `v4.08` und `frozen/v4.08`;
- abgeleiteter Dashboard-V4.08-Release-Commit: `cba234a37f20971c2f64b393202dbb70007dc19d`;

V4.08 ist nach Veröffentlichung funktional eingefroren. **Neue Entwicklung beginnt ausschließlich auf V4.09.xx.** Die Vorbereitung und Einreichung in den offiziellen HACS-Standardkatalog sowie das HACS-Update-Icon-Thema sind für V4.09.xx in `docs/ROADMAP.md` vorgemerkt.

Die V4.07.56-/V4.07.57-Tags, Freeze-Punkte und Schutzverträge bleiben unverändert historische Referenzen.

Verbindliche Dokumente:

- `docs/DELIVERY_ARCHITECTURE.md`
- `docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md`
- `docs/ASSET_RETENTION_POLICY.md`
- `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md`
- `docs/GOLDEN_MASTER_POLICY.md`
- `docs/RELEASE_PROCESS.md`
- `docs/RELEASE_NOTES_V4_08.md`
- `docs/ROADMAP.md`
- `docs/HANDOFF_V4_08_RELEASE_CLOSEOUT_2026-09-18.md`

## Dev-Toolkit

Wiederverwendbare Entwicklungswerkzeuge und allgemeines Home-Assistant-/Frontend-Engineering-Wissen gehören nach `TheDaimos/home-assistant-dev-toolkit`. Dieses öffentliche Produktrepository darf zur Laufzeit keine Abhängigkeit von privaten Shared-Repositories besitzen.

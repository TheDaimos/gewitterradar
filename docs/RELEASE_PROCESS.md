# Gewitterradar – verbindlicher Release-Ablauf

Dieses Dokument ist Bestandteil des Gewitterradar-Releasevertrags. Es gilt für jede öffentliche Version, unabhängig davon, ob sie als native Home-Assistant-Integration, Dashboard-/Lovelace-Auslieferung oder in beiden Formen veröffentlicht wird.

## Versions- und Monatsformat

Jeder Release trägt zusätzlich zur Versionsnummer eine Monatskennung im Format `YYYY/MM`.

Verbindliche Darstellung:

- aktueller Stand in Welcome, Einstellungen und Kopf der Release History: `YYYY/MM · Vx.xx`;
- historischer Eintrag in der Release History: `Vx.xx · YYYY/MM`;
- geplante, noch nicht veröffentlichte Versionen: `Vx.xx · PLANNED` und ausdrücklich als Planung beschreiben.

Die Monatskennung wird aus dem kanonischen Build-Metadatum (`GEWITTERRADAR_BUILD`) abgeleitet. Sie darf nicht unabhängig an mehreren Stellen manuell gepflegt werden. Ein Versionswechsel oder ein Release in einem neuen Monat muss deshalb zuerst die Build-Metadaten aktualisieren; daraus folgt die sichtbare `YYYY/MM`-Kennung.

## Pflichtabgleich vor jedem Release

Vor dem Freeze müssen mindestens folgende Stellen gegen Version und Monat abgeglichen werden:

1. Welcome-Footer: `YYYY/MM · Vx.xx · Gewitterradar · by CK`;
2. Einstellungen unten links: `YYYY/MM · Vx.xx`;
3. Release-History-Kopf rechts: `YYYY/MM · Vx.xx`;
4. neuer History-Eintrag: `Vx.xx · YYYY/MM`;
5. `CHANGELOG.md`;
6. `docs/HISTORY.md`;
7. `docs/MILESTONES.md`;
8. Release Notes der Version;
9. README-/Installationsangaben, sofern sie den aktuellen Release- oder Kandidatenstatus nennen;
10. beide Auslieferungsformen einschließlich bytegleicher gemeinsamer Frontend-Dateien.

Die Release History darf keine veröffentlichte öffentliche Version überspringen. Historische Monatsangaben werden nicht stillschweigend umgeschrieben. Geplante Funktionen werden nur als `PLANNED` aufgenommen und dürfen nicht wie bereits ausgelieferte Funktionen formuliert sein.

## Sprachumfang

Der V4.06-Stand umfasst **15 Sprachen plus 4 Dialektvarianten = 19 Sprachvarianten**. Bei zukünftigen Releases ist der tatsächlich unterstützte Sprachumfang im Changelog, in den Release Notes und bei Änderungen am Sprachumfang auch in der Release History abzugleichen.

## Hi-Res-Asset-Aufbewahrung

Die Richtlinie `docs/ASSET_RETENTION_POLICY.md` ist bei **jedem** Merge in `main` und bei **jedem** öffentlichen Release verbindlich.

Der maschinenlesbare Schutzvertrag ist:

`tests/contracts/hires-asset-retention-v4.07.56.json`

Vor jedem Freeze, Merge in `main` und öffentlichen Release muss zusätzlich

`node scripts/verify-hires-asset-retention.mjs`

erfolgreich durchlaufen. Der zugehörige CI-Workflow `.github/workflows/hires-asset-retention.yml` läuft auf jedem relevanten Commit und darf nicht umgangen oder stillschweigend abgeschwächt werden.

Der Retentionsvertrag ist inhaltsbasiert: Ein geschützter Master darf aus einem aktiven `hires/`-Bereich in einen zugelassenen `legacy/`-/Archivbereich verschoben werden, sofern exakt derselbe geschützte Inhalt im aktuellen kanonischen Repositorystand erhalten bleibt. Eine Runtime-/Derived-Kopie ist kein Ersatz für den Masterbestand. Neu hinzukommender eindeutiger Master-/Legacy-Inhalt muss in den Vertrag aufgenommen werden, bevor der Stand releasefähig ist.

Vor Freigabe muss ein Asset-Audit mindestens Folgendes prüfen:

- Hi-Res-/Masterbestand von Basis und Kandidat vergleichen;
- gelöschte, verschobene und umbenannte Master identifizieren;
- bestätigen, dass nicht mehr aktive Master weiterhin im aktiven Artwork-Bereich oder unter einem logischen/versionierten `legacy/` bzw. `archive/` vorhanden sind;
- sicherstellen, dass Runtime-/Derived-Aufräumarbeiten keine Hi-Res-Master mit entfernt haben;
- bei archivierten Altbeständen sinnvolle Versions-/Provenienzangaben erhalten;
- jeden verschwundenen Master ohne dokumentierte ausdrückliche Löschanforderung **und** ausdrückliche Bestätigung als Release-/Merge-Blocker behandeln.

Nichtverwendung, Ersatz durch eine neue Grafik, Aufräumen, Refactoring, Deduplizierung oder Repository-Verkleinerung sind niemals ausreichende Löschgründe.

## Diagnose-Schutzvertrag

Ab V4.07.56 ist `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md` Bestandteil des Releasevertrags.

Vor jedem Freeze, Merge in `main` und öffentlichen Release muss

`node scripts/verify-diagnostic-contract.mjs`

erfolgreich durchlaufen. Der zugehörige CI-Workflow `.github/workflows/diagnostic-contract.yml` darf nicht umgangen oder stillschweigend abgeschwächt werden.

Ein Release ist blockiert, wenn insbesondere einer der folgenden Bestandteile fehlt oder semantisch beschädigt wurde:

- Master-Diagnosemodus, pinker Aktiv-Rahmen oder Diagnose-Konsole;
- Trennung von „Childtools ausblenden“ und „Diagnose beenden“;
- Hard-Stop aller Childtools beim Beenden;
- virtuelles Gewitter einschließlich AUS / BEOBACHTUNG / GEWITTER / GEFAHR / GESAMT;
- 1–5 Zellen oder EXTREM-Test über die produktive Extrem-/Violett-Logik;
- Gruppiert-/Einzelblitz-Test über die normale Produktpipeline;
- Medaillon-Zustände LEER / PFEIL / TREND / FREEZE / NORMAL;
- Kalibrier-, Geometrie-, Mess-, JSON-/Snapshot- oder Performance-Diagnose;
- Diagnose-Sprachumfang mit 19 Sprachvarianten.

Eine absichtliche Änderung des Schutzvertrags erfordert vorab ausdrückliche Benutzerfreigabe, Anpassung von Schutzdokumentation und Contract-Test sowie erneute Abnahme der betroffenen Diagnosefunktionen.

## PRE-MERGE-Snapshot und Golden Master

`docs/GOLDEN_MASTER_POLICY.md` ist bei jeder wesentlichen Promotion nach `main` verbindlich.

### Phase A – vor dem Merge

Unmittelbar bevor der bisherige `main` durch die Promotion verändert wird:

1. aktuellen vollständigen `main`-Commit-SHA bestimmen;
2. PRE-MERGE-Snapshot aus exakt diesem Commit erzeugen;
3. Quell-ZIP, Git-Bundle und SHA-256-Datei prüfen;
4. Snapshot lokal/offline bzw. außerhalb des laufenden Repositorys sichern;
5. erst danach den kontrollierten Merge bzw. die Synchronisierung nach `main` beginnen.

Ein fehlender oder nicht verifizierbarer PRE-MERGE-Snapshot blockiert die Promotion.

### Phase B – nach dem Merge

Nach Integration in `main` werden sämtliche vorgesehenen Release-Gates gegen den **tatsächlichen neuen `main`-Commit** erneut ausgeführt.

Erst wenn diese Prüfungen vollständig grün sind:

1. exakten neuen `main`-Commit-SHA bestimmen;
2. Golden-Master-ZIP aus genau diesem Commit erzeugen;
3. Git-Bundle erzeugen;
4. internes Manifest, vollständiges Dateiinventar und per-file SHA-256-Inventar prüfen;
5. externen SHA-256-Wert für ZIP und Bundle prüfen;
6. Golden Master unabhängig/lokal sichern;
7. öffentlichen Release-Tag auf exakt denselben Commit setzen;
8. GitHub-/HACS-Release aus diesem Stand veröffentlichen.

Ein Kandidat, Freeze-Branch oder PRE-MERGE-Archiv darf nicht als Golden Master bezeichnet werden.

### Archivierungstools

Kanonische Erzeugung:

```bash
scripts/create-source-archive.sh PRE_MERGE <ref> <version>
scripts/create-source-archive.sh GOLDEN_MASTER <ref> <version>
```

Automatisiert verfügbar über:

`.github/workflows/source-archive.yml`

Golden Master und HACS-/Installationspaket bleiben ausdrücklich unterschiedliche Artefakte.

## Release-Gates

Ein Release wird nur eingefroren, wenn die für den Stand vorgesehenen Prüfungen grün sind. Dazu gehören je nach betroffenem Bereich insbesondere:

- deterministischer Frontend-Neubau und Parität beider Auslieferungsformen;
- statische Delta- und Syntaxprüfungen;
- Browserprofile für Desktop, Tablet und Mobilgeräte;
- Locale-/Sprachaudits;
- Home-Assistant-Laufzeittests;
- HACS und Hassfest;
- Paket-/Asset-Verträge und Prüfsummen;
- **automatischer Hi-Res-Master-Retentionsvertrag über `scripts/verify-hires-asset-retention.mjs`;**
- **Hi-Res-Master-Audit gemäß `docs/ASSET_RETENTION_POLICY.md`;**
- **Diagnose-Contract-Test gemäß `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md`;**
- **PRE-MERGE-/Golden-Master-Archivvertrag gemäß `docs/GOLDEN_MASTER_POLICY.md`;**
- reale Geräteabnahme für zuvor als offen markierte Plattform- oder Layoutfälle.

Nach dem erfolgreichen Abschluss wird der exakt geprüfte Commit eingefroren. Bereits veröffentlichte Tags, eingefrorene Releases, PRE-MERGE-Snapshots und Golden Master werden niemals nachträglich umgeschrieben.

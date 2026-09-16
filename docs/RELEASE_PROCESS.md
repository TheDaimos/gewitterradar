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

## Release-Gates

Ein Release wird nur eingefroren, wenn die für den Stand vorgesehenen Prüfungen grün sind. Dazu gehören je nach betroffenem Bereich insbesondere:

- deterministischer Frontend-Neubau und Parität beider Auslieferungsformen;
- statische Delta- und Syntaxprüfungen;
- Browserprofile für Desktop, Tablet und Mobilgeräte;
- Locale-/Sprachaudits;
- Home-Assistant-Laufzeittests;
- HACS und Hassfest;
- Paket-/Asset-Verträge und Prüfsummen;
- **Hi-Res-Master-Audit gemäß `docs/ASSET_RETENTION_POLICY.md`;**
- **Diagnose-Contract-Test gemäß `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md`;**
- reale Geräteabnahme für zuvor als offen markierte Plattform- oder Layoutfälle.

Nach dem erfolgreichen Abschluss wird der exakt geprüfte Commit eingefroren. Bereits veröffentlichte Tags, eingefrorene Releases und Rückfallpunkte werden niemals nachträglich umgeschrieben.

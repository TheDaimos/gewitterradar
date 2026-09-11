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

## Release-Gates

Ein Release wird nur eingefroren, wenn die für den Stand vorgesehenen Prüfungen grün sind. Dazu gehören je nach betroffenem Bereich insbesondere:

- deterministischer Frontend-Neubau und Parität beider Auslieferungsformen;
- statische Delta- und Syntaxprüfungen;
- Browserprofile für Desktop, Tablet und Mobilgeräte;
- Locale-/Sprachaudits;
- Home-Assistant-Laufzeittests;
- HACS und Hassfest;
- Paket-/Asset-Verträge und Prüfsummen;
- reale Geräteabnahme für zuvor als offen markierte Plattform- oder Layoutfälle.

Nach dem erfolgreichen Abschluss wird der exakt geprüfte Commit eingefroren. Bereits veröffentlichte Tags, eingefrorene Releases und Rückfallpunkte werden niemals nachträglich umgeschrieben.

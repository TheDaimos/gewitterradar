# Gewitterradar – V4.08 Release-Abschluss und Handoff

Stand: **2026-09-18**  
Status: **V4.08 FINAL vollständig veröffentlicht**  
Nächste Entwicklungsline: **V4.09.xx**

Dieses Dokument ist der verbindliche Übergabepunkt nach Abschluss von V4.08. Es fasst den tatsächlich veröffentlichten Git-/HACS-/Archivstand zusammen und soll in einem neuen Chat nach dem normalen Daimos/Deimos-Bootstrap zuerst gelesen werden.

## 1. Kanonischer V4.08-Release

Repository:

`TheDaimos/gewitterradar`

Öffentlicher Release-Commit:

`27da94e5043a365dbe8ea5c5e2224327165750fa`

Unveränderliche Release-Referenzen:

- Tag: `v4.08`
- Freeze-Branch: `frozen/v4.08`
- GitHub Release: **Gewitterradar V4.08**
- GitHub Release ID: `391553565`
- Veröffentlichung: `2026-09-18T14:46:54Z`
- Tag, Freeze und Golden Master zeigen auf denselben Release-Commit.

Wichtig: `main` darf nach dem Release wieder durch Dokumentations- oder V4.09-Arbeit weiterlaufen. Der unveränderliche V4.08-Produktstand ist durch `v4.08`, `frozen/v4.08` und den Golden Master verankert.

## 2. Produktidentität

Öffentliche Produktversion: **V4.08**  
Native Home-Assistant-Integration: **0.20.0**  
Build: `V4.08-RELEASE-2026-09-18`

Finales gemeinsames Frontend:

- Größe: **2.028.645 Bytes**
- SHA256: `b75390652fae4aa98c77162fb207d97ece408ab617bbf107bcb0f3b9466a691f`

Externes Locale-Modul:

- Größe: **705.974 Bytes**
- SHA256: `a57493b6291671696aeb87c267595e3ce5fede987546f702d7883ef6f07bd288`

Akzeptierte interne Ausgangsbasis:

- Build: **V4.08.40 RC**
- Größe: **2.028.691 Bytes**
- SHA256: `2c94af487b1142fd9da450e3bbe9751c3ac17631a621b3878fd9665b557d9570`

V4.08 FINAL normalisiert gegenüber V4.08.40 RC ausschließlich die freigegebenen Release-Metadaten. Die funktionale RC40-Basis darf nicht nachträglich umgedeutet oder durch einen anderen V4.08-Zwischenstand ersetzt werden.

## 3. V4.08 Funktionsumfang

V4.08 veröffentlicht insbesondere:

- Cluster-Auflösungsprofile **Früh / Ausgewogen / Spät / Klassisch · V4.07.56**;
- Cluster-Navigation mit **5–3600 Sekunden** oder **∞**;
- zuverlässige Countdown-/Unendlich-Umschaltung auf Desktop und Touch;
- geschützte Pointer-Down-Behandlung ohne zusätzlichen Cluster-Sprung;
- vollständige Hilfe-/Release-History-Anpassungen für den V4.08-Umfang;
- mehrsprachigen HTML-Webauftritt mit 15 regulären Dokumentationssprachen;
- Funktionsgalerie mit integrierter Bildvergrößerung;
- acht verlustfreie WebP-Dokumentationsscreenshots.

Dokumentationsgrafiken:

- PNG-Ausgangsvolumen: **3.192.091 Bytes**
- lossless WebP: **2.065.430 Bytes**
- Einsparung: **1.126.661 Bytes / 35,3 %**

Geschützte Hi-Res-/Mastergrafiken wurden dabei nicht ersetzt oder gelöscht.

## 4. Dashboard-/Lovelace-Auslieferung

Abgeleitetes Repository:

`TheDaimos/gewitterradar-dashboard`

Öffentlicher Dashboard-V4.08-Commit:

`cba234a37f20971c2f64b393202dbb70007dc19d`

Unveränderliche Referenzen:

- Tag: `v4.08`
- GitHub Release: **Gewitterradar Dashboard V4.08**
- GitHub Release ID: `391556036`
- Veröffentlichung: `2026-09-18T14:49:42Z`

Dashboard-Laufzeitdateien sind bytegleich zur kanonischen V4.08-Ausleitung:

- Frontend SHA256: `b75390652fae4aa98c77162fb207d97ece408ab617bbf107bcb0f3b9466a691f`
- Locale SHA256: `a57493b6291671696aeb87c267595e3ce5fede987546f702d7883ef6f07bd288`

Das vorhandene `app_gewitterradar_v4_07_pkg.yaml` bleibt die aktuelle Dashboard-Helferbasis. V4.08.40 führte kein neues YAML-Helferpaket ein.

## 5. Release-Gates – tatsächlich grün

Post-Merge auf dem exakten Release-Commit `27da94e...`:

- Validate Gewitterradar integration – Run `35357929270` – **success**
- Validate shared Gewitterradar frontend – Run `35357929289` – **success**
- Diagnostic contract – Run `35357929266` – **success**
- Hi-Res asset retention – Run `35357929279` – **success**
- Source archive contract – Run `35357929291` – **success**
- Publish Gewitterradar V4.08 – Run `35357929341` – **success**

Dashboard:

- Validate HACS Dashboard V4.08 – Run `35358564453` – **success**
- Publish Dashboard V4.08 – Run `35358564540` – **success**

Die historischen V4.07.56-Diagnose-, About-/Golden- und Hi-Res-Schutzverträge bleiben weiterhin verbindlich.

## 6. PRE-MERGE-Snapshot

Alter `main` unmittelbar vor V4.08:

`1928649627f81b2c2c6b0888f1f5ad8601205db5`

Workflow-Run:

`35356945744`

Actions-Artefakt:

- ID: `10551789738`
- Name: `Gewitterradar_MAIN_PRE_V4.08_2026-09-18_1928649627f8`
- Actions-Artefakt-Digest: `sha256:7ebbb83a2504b06778fa2a8ef0212a9960e65dbe65c8bc88747fd22130ed5824`

Interne Archivprüfsummen:

- ZIP: `b1397e284c288e6400c827a7e2b05720ada6e597fe636b965401aa0cbc513a0f`
- Bundle: `8c0220613e9438f5a86ab04d8d2fa610c05b85c782efdf899db20143acdfd810`

Das PRE-MERGE-Archiv wurde zusätzlich außerhalb des laufenden GitHub-Repositories gesichert.

## 7. Golden Master V4.08

Quelle:

`27da94e5043a365dbe8ea5c5e2224327165750fa`

Workflow:

`35357929341`

Actions-Artefakt:

- ID: `10552877379`
- Name: `Gewitterradar_V4.08_GOLDEN_MASTER`
- Actions-Artefakt-Digest: `sha256:68c9cd3ac3286289809d61ec08ac8a88bb717b8ab49a47be36b0a2bd13a9641f`

Interne Golden-Master-Prüfsummen:

- ZIP `Gewitterradar_V4.08_GOLDEN_MASTER_2026-09-18_27da94e5043a.zip`
  - SHA256: `ba158ce037bb447d7c0c79a962a1bac1fd0a6bce156c298c309128911a2cbfb1`
- Bundle `Gewitterradar_V4.08_GOLDEN_MASTER_2026-09-18_27da94e5043a.bundle`
  - SHA256: `7168f5fd07ea6510955f16f284e2f342573f8b78cd491eb3147b7e4bd8a59d25`

Der Golden Master wurde zusätzlich außerhalb des laufenden GitHub-Repositories gesichert.

## 8. HACS-/Branding-Stand

V4.08 enthält den überarbeiteten Repository-/HACS-Auftritt:

- README-Logo über absoluten GitHub-Rohpfad;
- vorhandene Hero-Grafik eingebunden;
- HTML-v14 als ausführliche Web-/Installationsdarstellung.

Beobachtung aus realer Produktion:

- das Gewitterradar-Branding wird in der Home-Assistant-Integrationsansicht korrekt angezeigt;
- im HACS-Updateeintrag kann weiterhin **„icon not available“** erscheinen;
- dies wird nicht durch Umbau des funktionierenden Integrationsbrandings gelöst.

## 9. Verbindlicher Startpunkt V4.09.xx

Neue Produktarbeit beginnt ausschließlich auf **V4.09.xx**.

Bereits fest vorgemerkt:

1. Gewitterradar für die Aufnahme in den offiziellen **HACS-Standardkatalog / hacs/default** vorbereiten und einreichen;
2. die dann aktuellen HACS-/Hassfest-Anforderungen erneut prüfen;
3. reale Update-Latenz von benutzerdefiniertem Repository vs. Standardkatalog messen;
4. HACS-Update-Entity-/Brands-Verhalten für das fehlende Update-Icon erneut gegen den dann aktuellen HACS-/Home-Assistant-Stand prüfen;
5. keine eigene Branding-Umgehung einführen, solange das Integrationsbranding selbst korrekt funktioniert.

Weitere V4.09-Ideen werden nicht automatisch umgesetzt. Maßgeblich bleibt `docs/ROADMAP.md`.

## 10. Offene Repository-Hygiene nach dem Release

Folgende Punkte sind **keine Release-Blocker** und gehören in eine bewusste Aufräumrunde:

- temporären `release/v4.08`-Branch nach Verifikation entfernen;
- `feature/v4.08-cluster-zoom-and-cleanup` nur löschen, wenn bestätigt ist, dass keine eindeutigen, nicht anderweitig verankerten Commits mehr benötigt werden;
- historische/superseded Pull Requests schließen;
- veröffentlichte Tags und `frozen/v4.08` niemals verschieben oder löschen.

## 11. Startanweisung für den nächsten Chat

1. Mit **Daimos** oder **Deimos** bootstrappen.
2. Aktuelle `TheDaimos/project-defaults/START_HERE.md` und globale Regeln laden.
3. Danach `TheDaimos/gewitterradar/PROJECT_DEFAULTS.md` laden.
4. Dieses Dokument lesen:
   `docs/HANDOFF_V4_08_RELEASE_CLOSEOUT_2026-09-18.md`
5. V4.08 als abgeschlossen und eingefroren behandeln.
6. Keine funktionalen Änderungen mehr unter V4.08 vornehmen.
7. Neue Entwicklungsarbeit erst auf einer klar benannten **V4.09.xx**-Linie beginnen.
8. Vor Beginn eines größeren neuen Arbeitsblocks den aktuellen `main` erneut prüfen; `v4.08` und `frozen/v4.08` bleiben die unveränderliche Release-Referenz.

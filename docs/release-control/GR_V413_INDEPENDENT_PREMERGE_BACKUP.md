# V4.13 PRE-MERGE – unabhängig verifizierter Rückfallnachweis

**Sicherungsidentität:** `0bbb47772667c8ff252157ac6a6fab269877a0d6`, unveränderter früherer `main`.  
**Ursprung:** öffentlicher GitHub-Actions-Lauf [45496499861](https://github.com/TheDaimos/gewitterradar/actions/runs/45496499861), `success`.  
**Offsite-Ziel:** ChatGPT-Dateibibliothek (nicht GitHub), Ordner `/DAIMOS-GewitterRadar-Backups/`; Dateiname `GR_PRE_MERGE_V4.13_0bbb47772667_ARCHIVE.zip`.  
**Library-Datei:** `libfile_e6bc229e6c948191b1a654caf7678c1e`.

## Tatsächlich ausgeführte Prüfungen

- Original-Archiv aus GitHub Actions heruntergeladen: 423.307.399 Bytes, ZIP-Struktur fehlerfrei (4 Einträge).
- Enthaltene Quell-ZIP: 2.303 Einträge, ZIP-Test ohne Fehler.
- Enthaltene Quell-ZIP und Git-Bundle: beide SHA256-Prüfungen aus der beigefügten `_SHA256SUMS.txt` erfolgreich.
- Git-Bundle in einem neu initialisierten, unabhängigen lokalen Test-Git-Repository mit `git bundle verify` geprüft: Exit-Code 0, vollständige Historie und erwarteter Ref `0bbb47772667...`.
- Das vollständige Archiv in die ChatGPT-Dateibibliothek außerhalb von GitHub hochgeladen, **von dort wieder materialisiert**, Bytezahl und SHA256 des gespeicherten Exemplars mit GitHub-Original verglichen: beide **identisch**.
- **SHA256 Original und extern erneut abgerufene Datei:** `c28e8c71251bffb2264a6f223746a9809b8d2694b2570f7a0ad50436bb2c8642`.

## Verwendungsgrenzen

Dieser Nachweis bezieht sich **ausschließlich** auf die unveränderliche PRE-MERGE-Sicherung des oben genannten alten `main`-Commits. Bei anderem altem `main`-SHA ist eine neue Sicherung verpflichtend. Er bestätigt weder erfolgreiche FINAL-CI noch einen Golden Master. Das Release darf erst nach gesonderter Kandidaten-, Merge-, CI-, Golden-Master- und Tag-Prüfung veröffentlicht werden. Das Offsite-Archiv darf nicht überschrieben werden.

## FINAL-Kandidaten-Spiegelprüfung

Der getrennte öffentliche GitHub-Runner [45562538664](https://github.com/TheDaimos/gewitterradar/actions/runs/45562538664) hat nach dem späten Legend-Hub-Platzierungsfix die beiden Frontend-Spiegel und das SHA256-Inventar aus dem kanonischen FINAL-Kandidaten deterministisch neu erzeugt, alle zugehörigen Build-/Paket-/Diagnoseprüfungen bestanden und den Kandidaten als Commit `ee5ce2a1e4debd6e729545c64bd06d9557d06370` gespeichert. Der endgültige PR-/POST-MERGE-CI-Nachweis für einen späteren SHA ist gesondert zu prüfen.

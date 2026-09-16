# Gewitterradar – PRE-MERGE- und Golden-Master-Richtlinie

Diese Richtlinie ist Bestandteil des verbindlichen Gewitterradar-Merge- und Releasevertrags.

## Zweck

`main` ist die fortlaufende kanonische stabile Entwicklungslinie von Gewitterradar. Ein HACS-/Installationspaket, ein GitHub-Release und ein vollständiges Quellarchiv erfüllen unterschiedliche Aufgaben und dürfen nicht miteinander verwechselt werden.

Für jede größere Promotion eines abgenommenen Release-/Finalstandes nach `main` werden deshalb zwei unterschiedliche Archive verwendet:

1. **PRE-MERGE-Snapshot** – exakter alter `main`-Stand unmittelbar vor seiner Veränderung.
2. **Golden Master** – exakter neuer `main`-Stand erst nach erfolgreichem Merge und vollständig grünen Abschlussprüfungen.

Ein Freeze-/Feature-Branch, Release Candidate oder PRE-MERGE-Snapshot darf niemals als Golden Master bezeichnet werden.

## Verbindliche Reihenfolge

```text
abgenommener Kandidat
  -> alten main-Commit exakt auflösen
  -> PRE-MERGE-Snapshot erzeugen und prüfen
  -> Kandidat kontrolliert nach main integrieren
  -> vollständige Post-Merge-Prüfungen
  -> neuen akzeptierten main-Commit exakt auflösen
  -> Golden Master erzeugen und prüfen
  -> Release-Tag auf exakt diesen Commit setzen
  -> GitHub-/HACS-Release aus diesem Stand veröffentlichen
```

Der Golden Master wird **nicht vorgezogen**. Solange die Post-Merge-Gates nicht vollständig grün sind, heißt ein Archiv höchstens Kandidat/PRE-MERGE – niemals Golden Master.

## PRE-MERGE-Snapshot

Vor jeder wesentlichen Änderung von `main` durch eine Release-/Final-Promotion muss:

- der vollständige aktuelle `main`-Commit-SHA festgehalten werden;
- aus exakt diesem Commit ein vollständiges Quell-ZIP erzeugt werden;
- das ZIP einen eigenen SHA-256-Wert erhalten;
- ein Manifest mit Repository, Archivtyp, Zielversion/Promotion, Quell-Ref, Commit-SHA und UTC-Erzeugungszeit enthalten sein;
- ein vollständiges Dateiinventar enthalten sein;
- eine Git-Notfallkopie (`.bundle`) des eingefrorenen Commit-Verlaufs erzeugt werden.

Der PRE-MERGE-Snapshot ist der unmittelbare Rückfallanker für den Zustand von `main` vor der Promotion.

## Golden Master

Ein Golden Master darf nur vom exakten **post-merge `main`-Commit** erzeugt werden, nachdem insbesondere folgende Gewitterradar-Gates bestanden sind:

- deterministischer Frontend-/Build-Abgleich;
- Parität der beiden Auslieferungsformen;
- Syntax-/Delta-/Regressionstests;
- HACS/Hassfest bzw. die für die Version vorgesehenen Home-Assistant-Prüfungen;
- 19-Sprachen-/Locale-Prüfungen, sofern betroffen;
- Diagnose-Schutzvertrag gemäß `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md`;
- Hi-Res-/Legacy-Asset-Audit gemäß `docs/ASSET_RETENTION_POLICY.md`;
- Versions-, Dokumentations-, Paket- und Prüfsummenabgleich;
- alle für die Version ausdrücklich offenen realen Geräteabnahmen.

## Inhalt des Golden Masters

Der Golden-Master-ZIP enthält **alle in Git versionierten Dateien** des akzeptierten Commits. Damit sind insbesondere eingeschlossen:

- kanonischer Gewitterradar-Quellcode;
- native Home-Assistant-Integration;
- Dashboard-/Lovelace-Ausleitung und gemeinsam versionierte Frontend-Bestände;
- Skripte und Build-/Validierungswerkzeuge;
- Tests und sämtliche Regression Guards;
- GitHub-Actions-/CI-Definitionen;
- Dokumentation, Changelog, History, Meilensteine und Releaseverträge;
- alle Sprach-/Locale-Dateien;
- alle in Git geführten Runtime-/Derived-Assets;
- **sämtliche aktiven Hi-Res-Master**;
- **sämtliche erhaltenen Hi-Res-Master unter `legacy/` / `archive/`**;
- Branding-, Lizenz-, Provenienz- und Acceptance-Unterlagen.

Zusätzlich wird im Archiv unter `_snapshot/` erzeugt:

- `MANIFEST.txt`;
- `TRACKED_FILES.txt`;
- `FILE_SHA256SUMS.txt`.

Das ZIP selbst erhält zusätzlich einen externen SHA-256-Eintrag.

## Git-Bundle

Zu jedem Gewitterradar-PRE-MERGE-Snapshot und Golden Master wird zusätzlich eine `.bundle`-Datei erzeugt, die die Git-Historie bis zu dem eingefrorenen Commit offline rekonstruierbar macht.

ZIP und Bundle erfüllen verschiedene Aufgaben:

- ZIP = sofort lesbarer, vollständiger Dateistand;
- Bundle = Git-Notfallkopie mit Commit-Historie.

## Benennung

Verbindliches Schema:

```text
Gewitterradar_MAIN_PRE_<Version>_<YYYY-MM-DD>_<sha12>.zip
Gewitterradar_MAIN_PRE_<Version>_<YYYY-MM-DD>_<sha12>.bundle

Gewitterradar_<Version>_GOLDEN_MASTER_<YYYY-MM-DD>_<sha12>.zip
Gewitterradar_<Version>_GOLDEN_MASTER_<YYYY-MM-DD>_<sha12>.bundle
```

Dazu gehört jeweils eine `SHA256SUMS.txt`.

## Golden Master vs. HACS

Der Golden Master ist **kein HACS-Paket**.

HACS darf weiterhin nur die für die Installation erforderlichen Release-/Runtime-Dateien ausliefern. Der Golden Master dagegen ist das vollständige Quell-, Test-, Dokumentations- und Asset-Archiv des freigegebenen kanonischen Stands.

Die öffentliche Release-/Tag-Version muss auf denselben Commit zeigen, der im Golden-Master-Manifest festgehalten ist.

## Unveränderlichkeit

Ein erzeugter PRE-MERGE-Snapshot oder Golden Master wird niemals stillschweigend überschrieben oder nachträglich inhaltlich verändert.

Muss ein Archiv aus technischem Grund neu erzeugt oder korrigiert werden, bleibt das bisherige Artefakt erhalten und die neue Erzeugung erhält einen unterscheidbaren Namen bzw. ein neues Manifest.

## Unabhängige Aufbewahrung

Golden Master und wichtige PRE-MERGE-Snapshots werden zusätzlich außerhalb des laufenden GitHub-Repositories aufbewahrt. Eine lokal gespeicherte Kopie mit zugehöriger SHA-256-Datei ist ausdrücklich Teil der gewünschten Gewitterradar-Notfallvorsorge.

## Automatisierung

Kanonische Erzeugung:

- `scripts/create-source-archive.sh`
- `.github/workflows/source-archive.yml`

Das Skript archiviert aus einem exakt aufgelösten Git-Commit und niemals aus einem ungeprüften/uncommitteten Arbeitsverzeichnis.
# Gewitterradar – verbindliche Hi-Res-Asset-Aufbewahrung

Diese Richtlinie ist Bestandteil des Gewitterradar-Merge- und Releasevertrags. Sie konkretisiert die globale TheDaimos-Regel zur dauerhaften Aufbewahrung von Hi-Res-Mastergrafiken.

## Absolute Schutzregel

**Nicht mehr verwendete, ersetzte oder überarbeitete Hi-Res-Mastergrafiken werden niemals automatisch gelöscht.**

Eine Grafik darf ihren aktiven Runtime-/UI-Einsatz verlieren, ohne ihren Status als dauerhaft aufzubewahrender Master zu verlieren.

## Verbindliches Verhalten

- Aktuell verwendete Hi-Res-Master bleiben im jeweiligen aktiven `artwork/<feature>/hires/`-Bereich.
- Ersetzte oder nicht mehr verwendete Master werden bei Bedarf in einen logisch benannten und vorzugsweise versionierten `legacy/`- oder `archive/`-Bereich überführt.
- Eine Verschiebung in `legacy/` ist Archivierung, keine Löschung. Dateiinhalt, Herkunft und sinnvolle Versions-/Provenienzangaben sollen erhalten bleiben.
- Runtime-/Derived-Assets dürfen ersetzt, regeneriert oder bei Nichtverwendung entfernt werden. Dies berechtigt **niemals** zur Entfernung des dazugehörigen Hi-Res-Masters.
- Git-Historie allein gilt nicht als ausreichendes Archiv. Geschützte Master müssen im aktuellen kanonischen Repositorystand direkt vorhanden bleiben, aktiv oder unter `legacy/`/`archive/`.
- Reorganisation, Repository-Aufräumen, Größenoptimierung, Deduplizierung, neues Design, fehlende Runtime-Referenz oder „wird nicht mehr benutzt“ sind **keine** Löschfreigabe.

## Löschung nur nach ausdrücklicher Freigabe

Eine Hi-Res-Mastergrafik darf nur gelöscht werden, wenn Christian

1. die Löschung der konkreten Grafik bzw. eindeutig benannten Grafikgruppe ausdrücklich anfordert, **und**
2. diese Löschung ausdrücklich bestätigt.

Fehlt eine dieser beiden Voraussetzungen oder ist die Anweisung mehrdeutig, muss die Grafik erhalten bzw. archiviert werden.

## Verbindliche Gewitterradar-Struktur

Bevorzugtes Muster:

```text
artwork/
  help-icons/
    hires/
    legacy/
      <version-oder-thema>/
  location-search/
    hires/
    runtime/
    legacy/
      <version-oder-thema>/
  about-controls/
    ...
    legacy/
      <version-oder-thema>/
```

Historische Varianten dürfen zusätzlich mit README-/Provenienzdateien dokumentiert werden.

## Bekannte geschützte Bestände

Insbesondere dauerhaft aufzubewahren sind:

- sämtliche Hi-Res-/Mastergrafiken von „Hilfe & Hinweise“;
- sämtliche Hi-Res-/Premium-Master der weltweiten Ortssuche;
- frühere Schließen-/X-Grafiken, auch wenn aktuell ein anderes X verwendet wird;
- frühere About-/Dialog-Bedienelemente und andere ersetzte Premiumgrafiken, soweit sie als Hi-Res/Master vorliegen.

Diese Liste ist nicht abschließend. Die Schutzregel gilt für **alle** bestehenden und zukünftigen Hi-Res-Master.

## Maschinenlesbarer Retentionsvertrag

Ab V4.07.56 wird die Richtlinie zusätzlich fail-closed technisch abgesichert.

Kanonischer Vertrag:

`tests/contracts/hires-asset-retention-v4.07.56.json`

Kanonischer Prüfer:

`node scripts/verify-hires-asset-retention.mjs`

CI-Gate:

`.github/workflows/hires-asset-retention.yml`

Der Vertrag schützt nicht nur Dateipfade, sondern die identifizierten Git-Blobs und damit den konkreten Dateiinhalt. Ein geschützter Master darf deshalb später aus einem aktiven `hires/`-Pfad in einen zugelassenen `legacy/`-/Archivbereich verschoben werden, ohne seinen Schutz zu verlieren. Entscheidend ist, dass derselbe geschützte Inhalt im aktuellen kanonischen Repository weiterhin direkt vorhanden ist.

Runtime-, Paket- oder Derived-Verzeichnisse zählen nicht als Masterarchiv. Eine verkleinerte oder konvertierte Runtime-Datei ersetzt niemals den geschützten Hi-Res-/Masterinhalt.

Der Prüfer arbeitet außerdem fail-closed für neue Master: Taucht in einem geschützten `hires/`-/`legacy/`-Bereich neuer eindeutiger Grafikinhalt auf, der noch nicht im Vertrag registriert ist, schlägt der Test fehl. Der neue Master muss bewusst in den Retentionsvertrag aufgenommen werden. Dadurch werden zukünftige Master automatisch Teil des dauerhaften Schutzmodells und können später nicht unbemerkt verschwinden.

Eine absichtliche Löschung eines bereits registrierten geschützten Inhalts setzt weiterhin die oben definierte ausdrückliche Löschanforderung **und** ausdrückliche Bestätigung voraus; erst danach darf der Vertrag bewusst angepasst werden.

## Pflichtprüfung vor jedem Merge/Release

Vor jedem Merge in `main` und vor jedem öffentlichen Release muss ein Asset-Audit erfolgen:

1. Hi-Res-/Masterbestand von Basis und Kandidat erfassen.
2. Gelöschte, verschobene oder umbenannte Master identifizieren.
3. Für jeden nicht mehr aktiven Master nachweisen, dass er weiterhin unter aktivem Artwork oder `legacy/`/`archive/` vorhanden ist.
4. Prüfen, dass Runtime-Aufräumarbeiten keine Masterdateien mit entfernt haben.
5. Bei verschobenen Altbeständen sinnvolle Version/Provenienz erhalten.
6. `node scripts/verify-hires-asset-retention.mjs` erfolgreich ausführen.
7. Fehlt ein Master ohne ausdrücklich dokumentierte Löschfreigabe oder meldet der Retentionsvertrag einen unregistrierten/verschwundenen Master, ist der Merge/Release **blockiert**.

## Fail-safe-Regel

Im Zweifel gilt immer: **behalten, archivieren, nicht löschen.**


## Geschützte Kompass-Chevrons

Die Hi-Res-Chevrons der Kompassauswahl liegen dauerhaft unter `artwork/compass-chevron/hires/`. Die Materialfamilien **Messing** und **Alt-Silber** sowie die Richtungen **links/rechts/oben/unten** sind eigenständige geschützte Master-Assets. Laufzeitkopien ersetzen diese Master ausdrücklich nicht. Neue oder ersetzte Chevron-Master müssen vor Aufnahme in den geschützten Repositoryzustand im Hi-Res-Retentionsvertrag registriert werden.

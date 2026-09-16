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

## Pflichtprüfung vor jedem Merge/Release

Vor jedem Merge in `main` und vor jedem öffentlichen Release muss ein Asset-Audit erfolgen:

1. Hi-Res-/Masterbestand von Basis und Kandidat erfassen.
2. Gelöschte, verschobene oder umbenannte Master identifizieren.
3. Für jeden nicht mehr aktiven Master nachweisen, dass er weiterhin unter aktivem Artwork oder `legacy/`/`archive/` vorhanden ist.
4. Prüfen, dass Runtime-Aufräumarbeiten keine Masterdateien mit entfernt haben.
5. Bei verschobenen Altbeständen sinnvolle Version/Provenienz erhalten.
6. Fehlt ein Master ohne ausdrücklich dokumentierte Löschfreigabe, ist der Merge/Release **blockiert**.

## Fail-safe-Regel

Im Zweifel gilt immer: **behalten, archivieren, nicht löschen.**

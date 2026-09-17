# Gewitterradar V4.08 – Unendlichkeitsgrafik

## Verbindliche Auswahl

Für die Sitzungszeit des Cluster-Sprungs ist ab V4.08 die zuletzt bestätigte ornamentale Unendlichkeitsgrafik im gealterten Gold-/Messingstil verbindlich. Sie besitzt einen transparenten Hintergrund, keine zusätzlichen Schleifen, keine Fremdelemente und keine neu erfundene Geometrie.

## Hi-Res-Master

Die aktuell bestätigte Hi-Res-Quelle hat 1536 × 1024 Pixel im RGBA-PNG-Format.

SHA256 der bestätigten Hi-Res-Quelle:

`afcb2653cb7ecec60edceaf218e148a7cda83d6953462323693d34321bb65544`

Diese Hi-Res-Quelle muss später gemäß `docs/ASSET_RETENTION_POLICY.md` als geschützter Master im kanonischen Artwork-/Hi-Res-Bestand hinterlegt und in den Retentionsvertrag aufgenommen werden. Die Runtime-Version ersetzt den Hi-Res-Master ausdrücklich nicht.

## Runtime-/UI-Version

Bis zur endgültigen Masterablage wird eine verkleinerte, transparente PNG-Ableitung mit verlustfreier PNG-Kompression verwendet. Sie ist ausschließlich für die Darstellung in der Oberfläche vorgesehen.

Aktuelle Runtime-Abmessungen: 96 × 63 Pixel, RGBA-PNG.

SHA256 der Runtime-PNG:

`e41966f3645c9a50509af8dc24042e75655327d03fdfcffe2e3520b33dcaf3f6`

Die Runtime-Grafik wird in V4.08.10 direkt im Frontend eingebettet, damit Integration und Dashboard exakt dieselbe Grafik verwenden und keine zusätzlichen Ressourcen registriert werden müssen.

## Verbindliche Verwendung

- Einstellungen → Radien → Cluster-Sprung → Sitzungszeit: Die Grafik ersetzt das bisherige Unicode-Zeichen `∞` in der anklickbaren Unendlich-Auswahl.
- Aktive Cluster-Sprung-Sitzung mit unbegrenzter Dauer: Die gleiche Grafik ersetzt das bisherige Unicode-Zeichen in der Karten-/Statusanzeige.
- Die beschreibende Textzeile `∞ = unbegrenzt` darf als erklärender Text bestehen bleiben; die eigentlichen Bedien- und Statusgrafiken verwenden das Asset.
- Keine Animation der Grafik. Die in V4.08.09 gewählte statische Goldbetonung bleibt erhalten.

## Schutzregel

Die Hi-Res-Quelle darf beim späteren Übergang in den Masterbestand nicht durch die verkleinerte Runtime-Datei ersetzt, überschrieben oder als entbehrlich behandelt werden. Für beide Dateien gilt: Master und Derived Asset sind unterschiedliche Rollen.
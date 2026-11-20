# GR 4.11.233 DEV · Größenabgleich der Wetter-Icons

**Paketquellcommit** `394131292b929575c2aba7dd01380d0064bd6e9e` · **HA** `0.25.140` · **Runtime** `411233r1` · **Modulset** `E411-233A1`.

Ausgangsstand war GR 4.11.232 DEV (`73d67444`), geprüft gegen WR `2b38696a`. Synoptik, Wolken und Gewitter verwenden jetzt die vorhandene Größenkalibrierung der Wetter-Icons. Maßgeblich ist die sichtbare Breite des Motivs bei Alpha ≥ 32. Eye-Größe, Layout-Geometrie und Tippflächen verwenden ihre eigenen, bestehenden Werte.

Ein gezielter Chromium-Lauf mit Touch prüfte alle sieben Wetter-Icons im ausgelieferten HA-Frontend. Sichtbare Breite in der Vorschau 46,99–47,00 CSS-Pixel bei 100 Prozent und 140,99–141,00 bei 300 Prozent. Die einzelnen Kartenschalter hatten im Vollbild dieselbe sichtbare Breite bei 100 Prozent und je 50 Pixel Tippfläche. Ein Touch-Tipp auf das Gewitter-Icon funktionierte. Frontend-Spiegel, Prüfsummen und Release-Identität wurden geprüft. Die breiten CI-Läufe wurden für diese Korrektur per `[skip ci]` ausgelassen. Die reale Sichtung auf DEV VM109 steht aus.

[DRA-Quelle `deploy/dev`](https://github.com/TheDaimos/gewitterradar/tree/deploy/dev) · [DEV-Pakete und SHA-256](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.233-dev)

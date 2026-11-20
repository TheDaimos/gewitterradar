# GewitterRadar 4.11.228 DEV – Unabhängige Niederschlagsdarstellung

Ausgangsstand: GR 4.11.227 DEV / HA 0.25.134, WR 0.10.325 DEV. Geschützte Referenzen bleiben unverändert.

## Betreiberbefund

NASA, OPERA und DWD erscheinen nach längerer Wartezeit gemeinsam. Insbesondere bei aktiver NASA-Quelle war die radarinterne `onProgress`-Darstellung abgeschaltet, während die Leaflet-Kachel erst nach Abschluss der übrigen Radarabrufe freigegeben wurde. DWD-NoData-Maskierung und die violette Umrandung sind separate, weiterhin offene bzw. unveränderte Belange.

## Änderung

- Die bereits vorhandene inkrementelle WR-Kachelauslieferung wird auch bei gleichzeitig zugelassener NASA-Quelle ausgewertet.
- Beim ersten tatsächlich gezeichneten Providerfragment wird die Leaflet-Kachel freigegeben; spätere Fragmente treffen unabhängig ein.
- Für jede Kachel werden die bereits angekommenen NASA- und Radarbilder im Speicher gehalten und bei einem neuen Fragment in stabiler Reihenfolge erneut zusammengesetzt: NASA zuerst, Radar danach gemäß WeatherRouter-Priorität.
- Der abschließende Loader-Audit zeichnet auf eine getrennte Canvas-Fläche und überschreibt die sichtbare Zwischenanzeige nicht.
- NASA-Revoke entfernt nur den alten NASA-Untergrund und komponiert bereits geladene Radarfragmente erneut.
- Keine Änderung der DWD/OPERA-Providerwahl, der violetten Umrandung, der DWD-NoData-Maskierung, der Freshness-Regel und der WR-API.

## Abnahme

Automatisiert: `tests/nasa-mosaic-ui04.test.mjs`, `tests/viewport-palette-performance-01.test.mjs`, `tests/gr-p0-runtime-manifest-progressive-192.test.mjs` und Frontend-Build/Verifikation. Der tatsächlich erreichte Teststatus ist anhand des Build-/CI-Laufs festzuhalten; ein Live-Test auf HA DEV VM109 wurde hier nicht ausgeführt.

Manuell auf DEV VM109: NASA/OPERA/DWD einzeln und kombiniert aktivieren; DWD-Antwort künstlich verzögern/unterbrechen; OPERA muss bereits angezeigt bleiben, NASA darf ebenfalls nicht warten. Dieselben Kacheln nach später eintreffendem DWD vergleichen. Anschließend OPERA-Maskenfehler gesondert beurteilen. PROD VM101 unverändert lassen.

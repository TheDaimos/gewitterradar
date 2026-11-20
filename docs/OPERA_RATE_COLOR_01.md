# OPERA-RATE-COLOR-01 · 2026-11-05

WR 0.10.289 / Loader 292; GR 4.11.141 / HA 0.25.48. Entwicklung ausschließlich deploy/dev.

DWD definiert die Referenz serverseitig, nicht in GR:
https://maps.dwd.de/geoserver/dwd/wms?service=WMS&request=GetStyles&version=1.1.1&layers=dwd:Niederschlagsradar
Stil niederschlagsradar, intervals. Die SLD-quantity-Werte sind gerundete
5-Minuten-Mengen; die Legendenlabels geben mm/h an. Verwendet werden die
mm/h-Grenzen der Labels, keine dBZ-Schwellen und keine Änderung der OPERA-Werte.

Untergrenzen mm/h / RGB hex (jeweils bis zur nächsten Grenze):
>0 #019934; 1 #4db31b; 2 #99cc01; 3 #cce601; 5 #ffff01;
7.5 #ffc401; 10 #ff8901; 15 #ff4501; 30 #fe0000;
45 #b20000; 75 #8b0000; 100 #6e0000; 150 #500000.
Die mittleren DWD-Farben sind unverändert. Gewünschte Abweichungen:
DWD <.4 verwendet #33ffff/#1acc9a, hier Grün; DWD >=45 verwendet
#e5004c/#cc0098/#6600cb/#0000fe, hier abgestuftes Dunkelrot.
Keine Skalierung oder Verstärkung der gemessenen RATE-Werte.

Vorher: opera_odim_tile.py berechnete RGB linear aus RATE/50 mit Rot und Blau;
opera_rate_scoped_approval.py enthielt dieselbe skalare Rampe. Beide verwenden
jetzt dieselbe numerische Präsentationspalette opera_rate_palette.py.
NoData/Undetect/NaN/Inf/negative Werte und Null bleiben transparent.
Positive gültige Werte haben wie bisher Alpha 255; GR-Deckkraft bleibt unverändert.

Nur der abgegrenzte Farbblock im vorhandenen Renderer wird ersetzt. Die fünf
ursprünglichen TEST69-Hashes bleiben unverändert: Beim Herkunftsvergleich wird
ausschließlich der exakt bekannte Präsentationsblock auf den historischen
Farbblock normalisiert. Jede andere Änderung an Projektion, Sampling,
Dekodierung oder Masken scheitert weiterhin am ursprünglichen Fingerprint.
TEST69 wurde nicht geändert oder wiederholt. Keine wissenschaftliche Neuberechnung.

GR enthält ausschließlich Versions-/Installationsupdates. Weich/Ausgewogen/Pixelig,
Filter, Auflösung und Zoom bleiben unverändert. Provider, V2, Transport, Zeitpolitik,
Ringpuffer und Generationswechsel bleiben unverändert. DWD bleibt eigenständig.

Beide DEV-Pakete zusammen auf VM109 installieren, HA neustarten und GR vollständig
neu laden (auch um alte dekodierte Kacheln aus dem Browserspeicher zu entfernen).
Visuelle Realabnahme erfolgt anschließend auf VM109. VM101 unangetastet.
Private Actions bleiben deaktiviert; keine neuen allgemeinen Testserien.

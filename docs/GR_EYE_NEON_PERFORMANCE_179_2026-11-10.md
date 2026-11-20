# Neon-Studio-Optimierung in GR 4.11.179 DEV

10.11.2026 · HA 0.25.86 · Runtime `411179r1` · Modulsatz `E411-179A1`

Ausgangsstand ist V4.11.178 auf `5a3f0a6b64978194991e8a94dacd6aa86195bc3a`. V4.11.177 auf `2a644f206483ca696482a0b8f2396b264e7b040a` bleibt die geschützte Referenz. Die vier Regler behalten ihre Bereiche und die vorhandenen Speicherfelder. Der V177-Restore und der Basisrenderer laufen über die vorhandenen Pfade.

## Android-Beobachtung und Profiling

Die lokale Aufnahme `77771.mp4` hat 36,9 Sekunden und 1200 × 2608 Pixel. Die sechs über die Aufnahme verteilten Stichproben enthalten die Reglereinstellungen und Ansichten der geschlossenen Vorschau. Darin sind stark überlagerte Lichtfäden, wechselnde Farben und ein breiter Leuchthof zu sehen. Der Betreiber meldet Ruckeln bei Maximalwerten. Die Aufnahme liefert keine instrumentierten Geräte-FPS. Sie wurde lokal betrachtet.

V178 zeichnete die Lichtmaske bei jedem Draw neu. Im Desktop-Maximalprofil wurden über 108 Aufrufe 6680 Maskenstriche und 81 Blur-Durchläufe gezählt. Der Zusatzpfad kostete im Messfenster durchschnittlich 2,43 ms pro Draw. Die Kontaktprüfung beanspruchte in diesem Durchlauf insgesamt 0,2 ms gemessene JS-Zeit. Die Zählung zeigt den Umfang der wiederholten Maskenarbeit. Einzelne GPU- und Composite-Kosten lassen sich damit nicht bestimmen.

## Umsetzung

`frontend/modules/weather/eye-neon-wow.js` bereitet die Lichtmaske erst zur nächsten Halo-Aktualisierung vor. Konfiguration, Modus, Puffergröße, Ringfarbe und Aktivstatus lösen bei Bedarf eine sofortige Aktualisierung aus. Ein gewöhnlicher Sync mit denselben Daten zeichnet die Maske nicht neu. Der lebende Glow kombiniert zwei Streuradien in einem Puffer von höchstens 192 × 192 Pixeln. Die statische Komposition behält drei Radien. Scharfe Fäden und Impulse bleiben auf der getrennten Zusatzfläche in Anzeigeauflösung.

Der Pfadaufbau liest die bereits vorhandenen Stützpunkte direkt. Ein Pfad lässt sich für Farbkörper, Lichtkern und fällige Maske wiederverwenden. Zusatzfäden werden abhängig von Größe und Budget an 40 bis 80 Stützpunkten erzeugt. Ein räumlicher Stichprobenvergleich führt fast deckungsgleiche gleichfarbige Zusatzfäden zusammen. Die Deckkraft des organischen Farbkörpers berücksichtigt den kombinierten Beitrag. Die ursprünglichen V177-Fäden bleiben vollständig im Basisrenderer. Die Zusatzperlen konzentrieren sich auf ausgewählte Bahnen und erhalten stetige Deckkraftübergänge. Bei voller Qualität können weiterhin alle 24 Zusatzfäden sichtbar sein, wenn sie räumlich unterscheidbar sind.

Die Kontaktprüfung priorisiert kurze sichtbare Verbindungen an voneinander getrennten Winkelpositionen. Bereits aktive Brücken dürfen ihre Lebensdauer auslaufen. Das Budget begrenzt nur neue Kontakte. Der Impuls und der ausklingende Farbtransfer entlang der Zielbahn bleiben eigenständige Phasen. Kurze Transfersegmente brauchen 13 Stützpunkte. Die ursprüngliche Ringfarbe bleibt im Basispfad.

Die adaptive Stufe berücksichtigt die gemittelte Zusatz-JS-Zeit und die Frameintervalle. Bei Last sinken die ergänzende Detaildichte und die Aktualisierungsrate des Halos. Die Anzahl neuer Kontakte hat ein eigenes Limit. Nach stabiler Leistungsreserve wird die Detaildichte allmählich angehoben. Verdeckte lebende Zusatzflächen werden über Sichtbarkeit und die Begrenzung durch Scrollcontainer ausgesetzt. Bei Moduswechsel oder Freigabe gelten die bestehenden Regeln für Kartenfläche, Vorschau und Puffer.

## Vorher-Nachher-Messung

`scripts/benchmark-eye-neon.cjs --baseline` lädt den V178-Releasecommit. Derselbe Aufruf ohne Option lädt die Arbeitsversion. Beide Läufe verwenden den vollständigen GR-Modulbaum mit synthetischem Windfeld in Chromium unter Windows. Der Harness zeichnet 108 Frames pro Szenario mit identischer Animationszeitfolge und misst nach 24 Aufwärmframes. Der kontrollierte Draw-Aufruf pro RAF beansprucht die Engine stärker als der Produktionsscheduler. Die Browser-Regressionen prüfen zusätzlich die regulären Menü- und Kartenpfade.

`max` verwendet 127,8 % Eye-Größe, 128 % Icongröße, 85 % Kontrastschattierung und alle vier Studio-Regler bei 100 %. `preview` verwendet ein großes Eye mit 126 CSS-Pixeln und 1,25-facher Vorschauprojektion. `light-max` setzt nur die drei Lichtregler auf 100 %. `two` verwendet zwei aktive Farben. Die Pufferwerte enthalten Zusatzfläche und Masken. Die Zusatz-JS-Zeit stammt aus dem internen Timer der jeweiligen Version. Die neue Sichtbarkeitsprüfung liegt vor dem Zusatz-Timer. Ihr Aufwand ist im gesamten Draw-JS enthalten. Die Zeiten enthalten keine getrennte GPU-Messung.

| Ansicht | Profil | Zusatz-JS ms V178 → V179 | RAF p50/p95 ms V178 → V179 | Draw-JS p95/max ms V178 → V179 | Maskenstriche V178 → V179 | Blur-Durchläufe V178 → V179 |
|---|---|---:|---:|---:|---:|---:|
| desktop | zero | 0.00 → 0.00 | 17.8/35.9 → 18.1/35.9 | 2.7/3.5 → 2.5/2.8 | 0 → 0 | 0 → 0 |
| desktop | moderate | 3.10 → 0.96 | 53.7/89.6 → 18.6/36.4 | 8.6/10.4 → 4.1/4.4 | 4809 → 953 | 78 → 44 |
| desktop | high | 2.37 → 1.07 | 35.0/54.1 → 17.8/35.8 | 5.2/6.5 → 3.4/3.8 | 6026 → 1163 | 81 → 44 |
| desktop | light-max | 3.07 → 1.29 | 52.6/70.7 → 18.6/53.3 | 7.8/8.8 → 4.2/6.0 | 6680 → 1283 | 81 → 44 |
| desktop | max | 2.43 → 1.11 | 35.2/53.1 → 18.1/36.0 | 4.9/5.3 → 3.5/4.0 | 6680 → 1283 | 81 → 44 |
| desktop | two | 1.26 → 0.59 | 18.0/36.0 → 17.7/18.2 | 2.7/3.2 → 2.1/2.4 | 3421 → 711 | 81 → 44 |
| desktop | preview | 3.21 → 1.59 | 52.4/71.2 → 35.6/53.8 | 8.2/13.0 → 7.6/9.3 | 7544 → 1459 | 81 → 44 |
| hidpi | zero | 0.00 → 0.00 | 18.6/53.2 → 34.9/52.7 | 3.2/4.3 → 3.1/3.5 | 0 → 0 | 0 → 0 |
| hidpi | moderate | 1.68 → 0.93 | 35.3/53.6 → 35.1/36.3 | 4.4/5.0 → 3.4/3.7 | 4809 → 953 | 81 → 44 |
| hidpi | high | 2.03 → 1.08 | 35.2/53.2 → 34.3/36.2 | 4.4/5.2 → 3.6/3.9 | 6026 → 1163 | 81 → 44 |
| hidpi | light-max | 2.62 → 1.16 | 35.8/54.6 → 35.1/36.3 | 5.7/7.6 → 3.3/3.5 | 6680 → 1283 | 81 → 44 |
| hidpi | max | 2.53 → 1.16 | 35.3/53.9 → 35.2/53.7 | 5.0/8.4 → 3.3/4.0 | 6680 → 1283 | 81 → 44 |
| hidpi | two | 1.23 → 0.69 | 34.9/53.2 → 34.8/53.5 | 2.8/3.3 → 2.3/3.3 | 3421 → 711 | 81 → 44 |
| hidpi | preview | 2.92 → 1.53 | 70.9/89.1 → 55.3/72.0 | 7.9/15.1 → 5.9/7.0 | 7544 → 1459 | 81 → 44 |
| android | zero | 0.00 → 0.00 | 17.6/18.2 → 17.7/18.2 | 2.5/2.7 → 2.4/2.6 | 0 → 0 | 0 → 0 |
| android | moderate | 1.64 → 0.96 | 17.7/35.1 → 17.8/18.6 | 4.3/4.8 → 4.4/5.5 | 4809 → 953 | 81 → 44 |
| android | high | 2.22 → 1.25 | 18.1/36.2 → 18.0/35.8 | 5.3/9.4 → 3.8/4.9 | 6026 → 1163 | 81 → 44 |
| android | light-max | 2.44 → 1.17 | 18.1/36.0 → 17.7/18.3 | 5.4/7.9 → 3.6/5.0 | 6680 → 1283 | 81 → 44 |
| android | max | 2.65 → 1.22 | 18.2/53.8 → 17.6/18.5 | 7.1/10.1 → 3.6/4.3 | 6265 → 1283 | 63 → 44 |
| android | two | 1.22 → 0.74 | 17.8/18.5 → 17.7/18.2 | 2.8/3.3 → 2.2/2.6 | 3421 → 711 | 81 → 44 |
| android | preview | 2.53 → 1.65 | 52.9/54.2 → 53.1/71.4 | 5.9/6.5 → 7.0/8.7 | 7544 → 1459 | 81 → 44 |
| landscape | zero | 0.00 → 0.00 | 17.8/18.3 → 17.6/18.2 | 2.4/2.5 → 2.5/2.8 | 0 → 0 | 0 → 0 |
| landscape | moderate | 1.95 → 0.79 | 17.9/36.4 → 17.7/18.3 | 5.9/8.2 → 3.0/3.5 | 4809 → 953 | 81 → 44 |
| landscape | high | 2.27 → 1.14 | 18.1/36.0 → 17.7/35.7 | 4.8/5.8 → 3.8/4.1 | 6026 → 1163 | 81 → 44 |
| landscape | light-max | 2.54 → 1.17 | 18.6/37.4 → 17.8/35.9 | 5.5/6.2 → 3.7/3.9 | 6680 → 1283 | 81 → 44 |
| landscape | max | 2.44 → 1.18 | 18.1/36.0 → 17.8/18.6 | 5.1/5.8 → 3.6/4.6 | 6680 → 1283 | 81 → 44 |
| landscape | two | 1.33 → 0.69 | 17.7/18.6 → 17.8/18.2 | 3.0/3.8 → 2.4/2.6 | 3421 → 711 | 81 → 44 |
| landscape | preview | 2.92 → 1.31 | 53.2/71.2 → 52.1/54.2 | 8.2/10.8 → 4.4/5.2 | 7544 → 1459 | 81 → 44 |
| ipad | zero | 0.00 → 0.00 | 18.1/36.4 → 18.0/35.7 | 3.1/3.5 → 2.4/3.0 | 0 → 0 | 0 → 0 |
| ipad | moderate | 1.68 → 0.90 | 18.6/36.1 → 18.1/36.1 | 4.2/4.6 → 3.7/4.7 | 4809 → 953 | 81 → 44 |
| ipad | high | 2.12 → 1.06 | 35.1/53.6 → 18.2/36.1 | 4.7/5.5 → 3.5/4.4 | 6026 → 1163 | 81 → 44 |
| ipad | light-max | 2.72 → 1.17 | 35.9/71.8 → 18.1/36.0 | 8.6/11.8 → 3.6/3.8 | 6232 → 1283 | 60 → 44 |
| ipad | max | 2.47 → 1.38 | 35.1/53.9 → 34.9/53.5 | 5.1/7.0 → 5.1/6.3 | 6680 → 1283 | 81 → 44 |
| ipad | two | 1.23 → 0.82 | 17.8/36.0 → 18.0/36.3 | 2.7/3.1 → 2.9/4.3 | 3421 → 711 | 81 → 44 |
| ipad | preview | 2.62 → 1.46 | 58.8/89.4 → 53.5/71.4 | 6.2/8.8 → 5.8/6.6 | 7544 → 1459 | 81 → 44 |


Im Maximalprofil auf der Karte sank die mittlere Zusatz-JS-Zeit je nach Ansicht um 44–54 %. In der großen Vorschau sank sie um 35–55 %. Die Android-Hochformat-Emulation erreichte bei Maximalwerten auf der Karte 2,65 → 1,22 ms Zusatz-JS und 53,8 → 18,5 ms RAF-p95. In der großen Vorschau derselben Emulation stieg das RAF-p95 von 54,2 auf 71,4 ms trotz niedrigerer Zusatz-JS-Zeit. Desktop-HiDPI und iPad zeigen beim Karten-Maximalprofil nur geringe p95-Änderungen. Diese Läufe erlauben daher eine Aussage über geringeren Renderaufwand und keine Zusage einer flüssigeren Darstellung in jeder Ansicht.

Die folgende Tabelle weist die Zusatzphasen der optimierten Version je gemessenem Draw aus. Für V178 wurden nur Zusatz-JS insgesamt, Kontaktprüfung und die Aufrufzahlen instrumentiert. Eine getrennte V178-Zeit für Fäden, Perlen, Bloom, Brücken und Transfer ist aus diesem Lauf nicht zuverlässig ableitbar.

| Ansicht bei Karten-Maximalwerten | Fäden und Perlen ms | Bloom ms | Kontakt ms | Brücken ms | Transfer ms | Zusatzfäden/Perlen V178 → V179 | Brücken/Transfers V178 → V179 | Zusatzpuffer Bytes V178 → V179 | Stufe V179 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| desktop | 0.968 | 0.046 | 0.000 | 0.035 | 0.013 | 24/423 → 24/171 | 12/8 → 6/6 | 596748 → 493828 | 0 |
| hidpi | 0.986 | 0.061 | 0.012 | 0.056 | 0.012 | 24/423 → 24/171 | 12/8 → 6/6 | 970512 → 741136 | 0 |
| android | 1.027 | 0.069 | 0.004 | 0.051 | 0.019 | 16/222 → 24/171 | 7/7 → 6/6 | 1312832 → 1083456 | 0 |
| landscape | 1.019 | 0.048 | 0.004 | 0.045 | 0.024 | 24/423 → 24/171 | 12/8 → 6/6 | 1312832 → 1083456 | 0 |
| ipad | 1.176 | 0.065 | 0.005 | 0.055 | 0.019 | 24/423 → 24/171 | 12/8 → 6/6 | 1312832 → 1083456 | 0 |

Die letzten Stichproben zeigen bei voller Stufe weiterhin räumlich unterscheidbare Zusatzfäden. Unter Last verringert die adaptive Stufe die zusätzliche Fadenzahl. Der Cache im Desktop-Maximalprofil wurde im Messlauf 27-mal bei V178 und 22-mal bei V179 aktualisiert. Das entspricht 7,5 beziehungsweise 6,1 Aktualisierungen pro simulierter Animationssekunde. Die Anzahl der Filterdurchläufe sank zusätzlich von drei auf zwei pro animierter Aktualisierung.

## Reguläre Menüvorschau mit den Videoeinstellungen

Der Zusatzlauf `--live-preview` nutzt den tatsächlichen Scheduler, das echte Eye-Bubble-Menü und den Eye-Master mit vier simulierten Funktionsfarben. In der Android-Hochformat-Emulation bei DPR 3 und aktiver synthetischer Windanimation wurden über 3,6 Sekunden nach sichtbarem Farbtransfer 99 Draws bei V178 und 101 bei V179 gemessen. Die Zusatz-JS-Zeit sank von 2,01 auf 1,03 ms je Draw. Das RAF-p50 lag bei 17,8 → 17,7 ms und das p95 bei 35,1 → 18,5 ms. Die sichtbaren Vorschaupuffer sanken von 1 695 012 auf 1 465 636 Byte. Beide Läufe zeigten aktive Farbtransfers. Die Screenshots heißen `178-android-live-preview.png` und `179-android-live-preview.png`. Sie wurden zu laufenden Animationszeitpunkten aufgenommen. Der obige isolierte Bildvergleich verwendet dagegen dieselbe Zeitfolge.

## Visueller Vergleich und Prüfungen

Die lokalen PNG-Paare in `C:/Git/Work/Temp/gr-eye-179/` zeigen V178 und V179 unter gleicher Geometrie, Farbe, Animationszeit und Hintergrundfarbe. Im Desktop-Maximalbild und der großen Android-Vorschau bleiben die gesättigten Farbbänder, helle Kerne und der weiche äußere Bloom erkennbar. Die hellen Perlen überdecken weniger Fadenfläche. Die Vergleichsaufnahmen isolieren die Aura. Die Tests der regulären Vorschau zeigen zusätzlich den Eye-Master.

Die gezielte Browserserie prüft 180 exakte V177-Pixelvergleiche, alle Regler einschließlich Wiederherstellung und Speicherung, statischen Glow, lebende Brücken und Transfer. Zusätzliche Assertions prüfen Cache-Wiederverwendung, geringere Detailzahl bei hoher Last, Transfer auch in reduzierter Stufe und das Aussetzen der Zusatzarbeit im verdeckten Scrollbereich. Der geschützte Windrenderer, Wetterdatenpfade, Originalgrafiken und DRA-Kanal bleiben auf ihrem bisherigen Stand.

Die fünf Browserprofile sind Desktop, Desktop HiDPI, Android Hoch- und Querformat sowie iPad. Physisches Android, iPad, WebKit und HA Companion bleiben offen. GPU-Kosten und physische Geräte-FPS wurden nicht instrumentiert.

## Auslieferung

Der DEV-Kanal bleibt `TheDaimos/gewitterradar@deploy/dev`. Die Lieferung umfasst die synchronisierten Frontend-Kopien, Runtime- und Modulkennungen, HA- und Dashboard-ZIPs, Deployment-Metadaten und SHA256-Prüfsummen. Die öffentliche Eye-CI und die Paketidentitäten folgen im Release-Nachweis.

## Implementierung und deterministische Installationspakete

Implementierungscommit: `f62070a431e227a2b96a30a66f6a33066e35a0ec`.

- `gewitterradar-0.25.86-dev.zip`: SHA256 `1da012217841072b88c76d40866a56d13599230406bc86ff383b71746decd75a`
- `gewitterradar-dashboard-4.11.179-dev.zip`: SHA256 `8aa010148492fea75751cb5a0f0900ecc64e7d0b769d10da7b5fcccd45bebebd`

HA-/Dashboard-ZIPs aus committed Git-Baum, CRC und jede enthaltene UI-/WOW-Quelle mit kanonischen UTF-8-Dateien verglichen. Deployment-Metadaten nennen den finalen Bericht-/Releasecommit; ZIP-Nutzdaten bleiben über reine Berichtsnachträge identisch.

## Erfolgreiche öffentliche CI

[Gezielter Eye-Bubble-/Neon-Studio-Lauf](https://github.com/TheDaimos/gewitterradar/actions/runs/42917487820), Quellcommit `f13b4f018bb85bff1cd929e5c39894ec5b533b88`. Bestehende Eye-Gesten-, Schnellmenü- und177-Regressionsserien sowie neue fünf WOW-Ansichten erfolgreich. Keine privaten Actions oder meteorologischen Prüfkampagnen.

Ubuntu/Chromium-Emulation, je1,6s-RAF-Messfenster, synthetisches Schlangenwindfeld. Nullmessung nach Maximalbetrieb derselben Sitzung; adaptive Zustände können nachwirken.

|Ansicht|Null p50/p95 ms|Max Karte p50/p95 ms|Max Vorschau p50/p95 ms|Zusatz-JS Karte Mittel/Max ms|
|---|---|---|---|---|
|desktop|16.7/16.7|16.7/16.8|33.4/50.1|1.98/7.60|
|desktop-hidpi|33.3/50.0|33.4/50.0|83.4/116.7|2.18/9.10|
|android|16.7/16.7|16.7/33.3|16.7/33.4|2.13/12.20|
|android-landscape|16.7/16.7|16.7/33.2|16.7/33.4|2.05/9.60|
|ipad|16.7/33.4|33.3/33.4|50.0/50.1|2.18/10.60|

|Ansicht|Basis/Zusatzfilamente|Basis/Zusatzperlen|Brücken/Transfers|Zusatz-LOD|Canvas-/Sprite-/Geometriebytes Zusatz|
|---|---|---|---|---|---|
|desktop|28/20|364/132|5/3|1|779328/65536/15360|
|desktop-hidpi|24/16|240/88|5/3|2|1384848/65536/15360|
|android|28/20|364/132|5/3|1|1933312/65536/15360|
|android-landscape|28/20|364/132|5/3|1|1933312/65536/15360|
|ipad|28/16|364/116|5/3|2|1933312/65536/15360|

180 exakte nichtleere V177-Pixelvergleiche bestanden. Zusatzeffekte sind bei Null inaktiv; Originalfarben und Originalrenderer erhalten. Reale Geräte-/WebKit-/VM109-Sichtabnahme bleibt offen. Maximalstellung hat ausdrücklich messbare Zusatzlast. Der nachfolgende reine Berichtsnachtrag ändert keine installierbaren Dateien.

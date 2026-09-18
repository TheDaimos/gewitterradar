# Gewitterradar V4.08 · 2026/09

Status: **FINAL**  
Öffentliche Produktversion: **V4.08**  
Akzeptierter interner Ausgangsbuild: **V4.08.40 RC**  
Native Integration: **0.20.0**

## Neu in V4.08

### Cluster-Auflösungsprofile

Die bisherige Cluster-Auflösung wurde zu vier reproduzierbaren Profilen weiterentwickelt:

- **Früh** – löst Cluster vergleichsweise früh in Einzelblitze auf.
- **Ausgewogen** – ausgewogene zonenabhängige V4.08-Abstimmung.
- **Spät** – hält Cluster beim Hineinzoomen länger zusammen.
- **Klassisch · V4.07.56** – stellt das geschützte klassische Verhalten als Rückfallpfad wieder her.

Die Gefahrenzone behält in den neuen V4.08-Profilen die bevorzugte Einzelblitzdarstellung.

### Cluster-Navigation · Sitzungszeit

- frei wählbare Sitzungszeit von **5 bis 3600 Sekunden**;
- **∞** für unbegrenzte Cluster-Navigation;
- direkter Wechsel Countdown ↔ ∞ in der Statusanzeige;
- Rückwechsel von ∞ startet den gespeicherten endlichen Wert vollständig neu;
- Pointer-/Touch-Schutz verhindert einen unbeabsichtigten zusätzlichen Cluster-Sprung beim Umschalten.

### Dokumentation und Webauftritt

- Repository-/HACS-Darstellung mit absolut referenziertem Branding und vorhandener Hero-Grafik überarbeitet;
- vollständiges mehrsprachiges HTML-Handbuch V4.08 mit **15 regulären Dokumentationssprachen**;
- kompakte Funktionsgalerie mit integrierter Bildvergrößerung;
- acht Dokumentationsscreenshots verlustfrei nach WebP überführt;
- PNG-Ausgangsvolumen **3.192.091 Bytes** → lossless WebP **2.065.430 Bytes** (**−35,3 %**);
- geschützte Hi-Res-/Mastergrafiken bleiben unverändert erhalten.

## Release-Identität

- Finales Frontend: **2.028.645 Bytes**
- Frontend SHA256: `b75390652fae4aa98c77162fb207d97ece408ab617bbf107bcb0f3b9466a691f`
- Locale-Modul: **705.974 Bytes**
- Locale SHA256: `a57493b6291671696aeb87c267595e3ce5fede987546f702d7883ef6f07bd288`
- Build: `V4.08-RELEASE-2026-09-18`
- Native Integration: **0.20.0**

## Provenienz

V4.08 FINAL basiert funktional auf dem ausdrücklich akzeptierten internen Build **V4.08.40 RC**.

RC40-Identität:

- Frontend: **2.028.691 Bytes**
- SHA256: `2c94af487b1142fd9da450e3bbe9751c3ac17631a621b3878fd9665b557d9570`

Der Releasevertrag normalisiert ausschließlich die öffentliche Versions-/Build-Metadaten und die beiden sichtbaren RC-Zusätze im Versionsverlauf. Darüber hinausgehende Änderungen gegenüber dem akzeptierten RC40 blockieren den deterministischen Build.

## Schutz und Qualität

V4.08 behält die bestehenden Schutzverträge bei, insbesondere:

- geschützte About-/Premium-Basis;
- V4.07.56-Diagnosevertrag;
- Hi-Res-/Legacy-Retentionsvertrag;
- deterministische Parität zwischen nativer Integration und Dashboard-Auslieferung;
- HACS-/Hassfest-/Home-Assistant-Prüfungen;
- PRE-MERGE- und Golden-Master-Vertrag.

## Nächste Entwicklung

V4.08 ist nach Veröffentlichung eingefroren. Neue Produktarbeit beginnt ausschließlich auf **V4.09.xx**.

Für V4.09.xx ist unter anderem die Vorbereitung und Einreichung in den offiziellen **HACS-Standardkatalog (hacs/default)** sowie die weitere Beobachtung des fehlenden HACS-Update-Icons vorgesehen.

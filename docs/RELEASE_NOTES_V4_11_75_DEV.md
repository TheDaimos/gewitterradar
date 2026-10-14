# V4.11.75 DEV – Quellauflösungsbewusste Niederschlags-Glättung

**Datum:** 14.10.2026 · **Basis:** V4.11.74 DEV · **Status:** Implementiert; GitHub- und Geräteabnahme stehen noch aus.

## Ursachenprüfung
- Die bestehende V4.11.74-Kurve erhöht den Filter unabhängig von der tatsächlichen Übervergrößerung der Quellkacheln nur additiv. Bei Zoom 9/10 wachsen Quellzellen schneller als der Filter.
- Ein festes Limit von mindestens 48 px kann für bereits stark geglättete Quellen die gesamte weitere Änderung verhindern. Das bleibt aus Gründen der iPad-Leistungsreferenz V4.11.68 bewusst bestehen.
- Die CSS-Glättung erfolgt auf dem gemeinsamen Leaflet-Pane **nach** dem Zusammenführen der Kacheln. Der Quelladapter setzt `maxNativeZoom` korrekt. Eine separate Kachelnaht-Ursache ist ohne echte Rasterprobe bislang nicht nachgewiesen.
- Die genaue Rasterzellgröße innerhalb einer gelieferten WeatherRouter-Kachel ist aus `max_zoom` allein nicht ableitbar. Es werden keine unbelegten Aussagen über die Quellpixelgröße gemacht.

## Gezielte Korrektur
- Nur **Weich**: Zoom 8 bleibt mit dem Auto-Profil bei Zoom 6 unverändert.
- Ab Zoom 9 bestimmt die relative Übervergrößerung der Quellkacheln den zusätzlichen Filterbedarf. Der bisherige Mindestanstieg bleibt erhalten.
- Der maximale Weich-Filter bleibt bei 48 px bzw. dem bereits höheren Zoom-8-Referenzwert. Keine neue Kachelpipeline, kein Canvas-Aufbau, keine zusätzliche dauerhafte Ereignis- oder Animationsschleife.
- Eine kleine, begrenzte Kontrastabsenkung vermeidet überbetonte harte Rasterübergänge. **Präzise, Ausgewogen, Auto** und die Quellkacheldaten sind unverändert.

## Prüfnachweis
- Neue synthetische Regression `scripts/test-v41175-soft-raster.mjs` prüft native Zoomstufen 5–11, Zoom 8/9/10, Begrenzung, alte V4.11.74-Werte, Quellkachel-Vertrag und einen modellierten kantigen Niederschlagsstreifen.
- Die Modellprobe prüft den erwarteten Glättungstrend, **nicht** tatsächliche Bildqualität auf Desktop/iPad.
- Weitere Verträge: Frontend-Spiegelung, Prüfsummen, Versionsidentität, CI. Eine reale Geräteabnahme bleibt nötig.

**V4.11.75 DEV** · **41175r1** · **E411-75A1** · **33 Module** · **weather.display-menu 0.4.12** · **Integration 0.25.1**.

**C.K. – Eine Idee weiter gedacht.**

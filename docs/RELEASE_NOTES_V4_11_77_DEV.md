# Gewitterradar V4.11.77 DEV – iPad-Darstellungs-Hotfix

**14. Oktober 2026 · Grundlage V4.11.76 DEV · Erneute Geräteabnahme ausstehend**

## Ausgangsproblem

Nach V4.11.76 zeigte die Auswahl „Weich“ am iPad bei Zoom 9 wieder scharfkantige, praktisch ungeglättete Niederschlagsblöcke. Die Funktion war gegenüber V4.11.75 optisch rückläufig. Keine privaten Gerätebilder, Standortdaten oder Exporte wurden übernommen.

## Analyse

Die neue SVG-Mehrskalenglättung aus V4.11.76 ersetzte den bewährten CSS-`blur(...)` durch einen CSS-URL-Filter. Die vermeintliche Rückfallerkennung kontrollierte nur, ob die Zeichenfolge `url(` nach dem Setzen in `pane.style.filter` erhalten blieb. Sie konnte nicht prüfen, ob Safari die SVG-Filterreferenz innerhalb der abgeschirmten Oberfläche tatsächlich ausführt. Chromium-Tests mit künstlichen Beispielen konnten dieses reale Verhalten nicht absichern. Das ist eine gesicherte Lücke in der Schutzprüfung, nicht bereits eine nachgewiesene interne Safari-Ursache.

## Korrektur

- Produktive Niederschlagsdarstellung `frontend/modules/weather/display-menu.js` vollständig auf den abgenommenen V4.11.75-Quellinhalt zurückgeführt; ausschließlich Modulversion auf **0.4.14** erhöht.
- Entfernt aus dem aktiven Renderweg: SVG-Filter, Mehrskalengewichtung, experimentelle Rückfallprüfung und Filter-Aufräumlogik.
- **Weich** verwendet wieder den einfachen CSS-Unschärfefilter aus V4.11.75. **Präzise, Ausgewogen und Auto** unverändert.
- Keine zusätzliche Render-Schleife, keine zweite Kachelebene, keine weiteren Kachelabfragen. Referenz V4.11.68 bleibt geschützt.
- Automatischer Regressionstest vergleicht die gesamte normalisierte Moduldatei per SHA-256 **exakt** mit der V4.11.75-Baseline. Historische V4.11.76-Experimenttests bleiben dokumentiert, werden aber nicht mehr als Freigabekriterien für die produktive Glättung ausgeführt.

**Version V4.11.77 DEV** · Build `V4.11.77-DEV-2026-10-14` · Laufzeit `41177r1` · Modulsatz `E411-77A1` · Integration `0.25.1`.

**Abnahme:** Weich bei Zoom 9/10 auf iPad kontrollieren und mit V4.11.75 vergleichen. Dieses Update behebt gezielt den Rückschritt; es behauptet noch keine zusätzliche Entpixelung.

*C.K. – Eine Idee weiter gedacht.*

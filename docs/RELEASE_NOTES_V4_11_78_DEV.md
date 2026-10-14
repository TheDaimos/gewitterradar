# V4.11.78 DEV – Browserabhängige Niederschlagsglättung

**Datum:** 14.10.2026 · **Ausgangsbasis:** V4.11.77 DEV · **Status:** Entwicklung; iPad-Realabnahme ausstehend.

## Ursachenlage
- V4.11.76 führte SVG-Mehrskalenglättung ein. Der auf einem iPad beobachtete Modus „Weich“ blieb bei Zoom 9/10 jedoch nahezu ungefiltert.
- Die nachgereichten Vergleiche zeigen, dass die Glättung in Chromium-basierten Android- und Desktop-Browsern wirkte. Das spricht für einen WebKit-spezifischen Fehler im Renderpfad, ohne dessen interne Ursache abschließend zu beweisen.
- V4.11.77 setzte den aktiven Filterweg für alle Plattformen auf die V4.11.75-CSS-Unschärfe zurück.

## V4.11.78: begrenzte, ausfallsichere Auswahl
- **Nur erkannte Chromium-Browser** erhalten wieder das zweistufige, gewichtete Mehrskalenprofil aus V4.11.76.
- **iPadOS und iOS (alle Browser), macOS-Safari und unbekannte Browser** verwenden ausschließlich den V4.11.75-CSS-Weichzeichner. Insbesondere iPadOS im Desktopmodus (`MacIntel` mit mehreren Berührungspunkten) wird geschützt.
- Die Browserweiche greift **vor** dem Erstellen einer SVG-Filterreferenz. Die reine Annahme einer gültigen CSS-Schreibweise zählt ausdrücklich nicht als Bildnachweis.
- Das gewählte Filterverfahren wird ohne sensible Daten am Niederschlags-Pane als `data-weather-display-soft-filter` (`css-blur`, `multiscale`, `inactive`) kenntlich.
- Keine zusätzliche Kartenebene, keine zweite Kachelanforderung und keine neue laufende Berechnungsschleife. Die mathematische Kurve für Weich bleibt aus V4.11.76 erhalten; der WebKit-CSS-Pfad benutzt exakt deren V4.11.75-Einzelprofil.
- Präzise, Ausgewogen, Auto und Zoom 8 bleiben unverändert; Referenz V4.11.68 bleibt Leistungsgrenze.

## Tests und Grenzen
- Neue Browsererkennungs-Vertragsprüfung mit Fällen für Android-Chromium, Android-WebView, Windows Chrome/Edge, iPad-Safari, iPad Desktopdarstellung, Chrome iOS, macOS-Safari, Firefox und unbekannte Browser.
- Vorhandene synthetische Raster- und Chromium-Renderprüfung werden wieder als zusätzliche Regression aktiviert.
- Eine Prüfung auf echtem iPad/echtem Safari und eine Leistungsprüfung bleiben unverzichtbar; synthetische Tests können das nicht ersetzen.
- Keine privaten Standortangaben, Gerätebilder oder Diagnoseexporte im öffentlichen Repository.

**Anwendung:** V4.11.78 DEV · `41178r1` · Modulsatz `E411-78A1` · `weather.display-menu 0.4.15` · `core.manifest 1.2.139` · native Integration `0.25.1`.

**C.K. – Eine Idee weiter gedacht.**

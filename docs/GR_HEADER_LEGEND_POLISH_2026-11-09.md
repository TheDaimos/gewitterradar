# Wind-/Temperatur-/Eye-Kopfzeilen und Legendenwahl

Basis: `4fd12ea9134897ef8ba7b73b910455a6e8f64aa9` auf `deploy/dev`.
Lieferung: **GR 4.11.169 DEV / HA 0.25.76**, Runtime **411169r1**, Modulset **E411-169A1**.

- Wind und Temperatur: gemeinsame 34-px-Symbolspalte, 10 px Abstand zum Titel, eingerückte Header-Aktionen und einheitliche 40-px-Bedienflächen. Schließen sitzt weiter innerhalb des Panels.
- Eye: Abstand zwischen Symbol und Titel vergrößert; Untertitel ausschließlich „WeatherRouter“. Der vorhandene `premiumAction`-Minimieren-Baustein wird direkt wiederverwendet. Ereignisbindung und Minimieren-/Maximieren-Zustand bleiben erhalten.
- Legende Auto/Ein/Aus: vorhandene originale offene/geschlossene Eye-Grafiken, metallische Verläufe und Rahmen, Licht-/Schattenkanten sowie hervorgehobener Auswahlzustand. Die bestehenden Aktionen, Speicherwerte und `aria-pressed` bleiben erhalten.

Gestalterische Änderungen ausschließlich in `modules/weather/premium-ui.js` und `display-menu.js`. Weitere generierte Änderungen betreffen Versions-/Cache-Importkennungen, Modulmanifest, Runtime-Manifest, HA-Metadaten, DRA-Provenienz und die beiden Frontend-Auslieferungskopien. Keine neuen Assets, keine Änderungen an Wetterdaten, Renderingalgorithmen oder DRA-Projekt/Kanal.

Gezielte lokale Prüfung: JavaScript-Syntax, aktuelle Release-/Paketparität mit `verify-frontend.mjs` und tatsächlicher vollständiger GR-Modulbaum in drei Chromium-Ansichten (Desktop, Android-Touchformat, iPad-Touchformat). Jeweils Wind- und Temperaturabstand, Schließen-Einrückung, identischer Eye-Minimieren-Baustein, Untertitel sowie alle drei Legendenaktionen erfolgreich; Screenshots visuell geprüft. Keine umfangreiche CI-Serie gestartet, entsprechend Auftrag. Keine physische Geräteabnahme und keine HA-Installation durchgeführt.

Bereitstellung über den unveränderten Branch-Kanal `TheDaimos/gewitterradar@deploy/dev`; installierbare Pakete und SHA256 unter dem neuen [DEV-Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.169-dev).

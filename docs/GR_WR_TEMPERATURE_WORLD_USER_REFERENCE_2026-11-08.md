# Neue Benutzerreferenz – Temperature World und WeatherRouter · 08.11.2026

## Verbindliche Referenzentscheidung des Benutzers
Der Benutzer bestätigt ausdrücklich **„Funktioniert sehr sehr gut. Neue Referenzversion! Speichern und merken!“** für den aktuellen Temperaturkarten-Entwicklungsstand. Diese Referenz gilt als **positiv vom Benutzer bewerteter Funktionsstand**, nicht automatisch als vollständig nachgewiesene Realtest-/FINAL-Abnahme aller Komponenten.

## Exakt abgefragte GitHub-Stände
- **Gewitterradar 4.11.156 DEV**, HA-Integration **0.25.63**, Runtime **411156r1**, Modulsatz **E411-156A1**.
- GR `deploy/dev` Commit zum Referenzzeitpunkt: **a607639ad2a6373c62e04ce8acfc39f72feb280a**.
- **WeatherRouter 0.10.298 DEV**, Loader **301** (`0.10-loader-301`).
- WR `deploy/dev` Commit zum Referenzzeitpunkt: **1b777a1b9593a5fd5b1f71ba6332ecb2883a39d5**.
- Die GR- und WR-Versionskennungen wurden direkt aus `frontend/version.js`, HA-`manifest.json` und WR-Loader-Datei zurückgelesen.
- Datum der Benutzerbestätigung: **08.11.2026**, Ortszeit Europe/Berlin.

## Geschützte Funktionen
- Weltweite Temperaturdarstellung aus dem aktuellen Temperature-World-Entwicklungsstand mitsamt Temperaturfarbfläche, einstellbaren Temperatureinheiten und weiteren im laufenden Auftrag integrierten Funktionen.
- Farbgrundsatz: **Extreme Hitze violett**, extreme Kälte blau; klare Abgrenzung der Paletten.
- Vorhandener Premium-Temperaturkartenschalter auf Basis der vom Nutzer bereitgestellten transparenten Originalgrafik, keine Nachzeichnung.
- Die zuvor vom Nutzer bestätigte besonders flüssige Winddarstellung bleibt regressionsgeschützt.
- Gemeinsame GeoPoint-Inspector-Grundlage und WR-/GR-Aufgabentrennung beibehalten.
- Keine GR-eigenen Provider-/Freshnessentscheidungen; WeatherRouter autoritativ.

## Freigabegrenzen
Die Benutzerbestätigung belegt Zufriedenheit mit der Funktion, nicht automatisch eine unabhängige Installation auf allen Endgeräten. Keine unbewiesene Behauptung einer abgeschlossenen Gesamt-CI oder wissenschaftlichen bzw. vollständigen FINAL-Abnahme. Vor Promotion zu FINAL CI, DRA-Pakete und Realabnahme explizit separat ausweisen.

## Nächste geplante Entwicklungsphase
Nach Abschluss Temperature World: **Feature-Freeze** mit systematischer Funktions-/Capability-Inventur, WeatherRouter-Menü- und Renderer-Abgleich, Konsolidierung, DEV-Rubrik, Hilfe, Sprachenangleichung, schrittweiser Modularisierung und anschließendem FINAL-Kandidaten. Jeder neue Entwicklungsauftrag mit neuer installierbarer DEV-Version über DRA.

## Schutzregel
Diese Referenz nicht stillschweigend durch neuere ungeprüfte Entwicklungsstände überschreiben. Neue Versionen nur nach erneuter expliziter Benutzerbestätigung als neue Funktionsreferenz setzen. Keine privaten GitHub Actions. PROD VM101 nicht automatisch verändern.

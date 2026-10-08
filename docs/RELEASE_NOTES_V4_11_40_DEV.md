# Gewitterradar V4.11.40 DEV · Modulmanifest-Konsistenz
Datum: 2026-10-08

## Ausgangsbefund
Android-Realabnahme V4.11.39 erfolgreich. Neuer Moduldiagnose-Export 2026-10-08T15:14:32.753Z:
- 31 von 31 Modulen geladen
- 0 Doppelregistrierungen
- 1 Abweichung: core.manifest geladen 1.2.108 / erwartet 1.2.110
- Produkt-/Revisionskennung E411-39A1 / 41139r1 korrekt, Laufzeit-Fingerabdruck wegen der Modulversion falsch.

## Änderung
- core.manifest.MODULE_META.version wird direkt aus EXPECTED_MODULES fuer 'core.manifest' hergeleitet, statt veraltete Zeichenfolge zu duplizieren.
- Test importiert das echte Manifest und Modulregister, kontrolliert die registrierte Modulversion gegen das Soll sowie alle relevanten unveraenderten V4.11.39-Android-Gestenkontrakte.
- Bump auf 4.11.40 / 41140r1 / E411-40A1 fuer UI, DRA und beide Auslieferungswege.
- Die Android-Gestenmodule, die Karte und WeatherRouter wurden **nicht** geaendert.

## HA-Realabnahme
DRA V4.11.40 DEV installieren, vollstaendig neu laden und Diagnosen > Module & Versionen oeffnen. Soll: 31/31, 0 Abweichungen, Modulmanifest 1.2.110, Fingerabdruck ohne Differenz, 'stale: false'. Bei alter Browser-Sitzung vollstaendig neu laden.

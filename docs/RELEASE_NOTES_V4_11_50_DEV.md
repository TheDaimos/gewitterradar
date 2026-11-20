# Gewitterradar V4.11.50 DEV – horizontales Einstellungsmenü

Datum: 2026-10-09

## Korrekturen

- Der dynamisch durch `diagnostics.module-view` angelegte Abschnitt **Module & Versionen** wird auch im horizontalen Einstellungsmenü erfasst. Er erscheint nach den bisherigen sieben Bereichen als **8. Module & Versionen**. Die Moduldiagnose selbst bleibt unverändert.
- Die Navigation baut die verfügbaren Abschnitte beim Öffnen neu auf. Nachträglich ergänzte Bereiche werden damit nicht mehr übersehen; doppelte Schaltflächen entstehen nicht.
- Höhenänderung und horizontaler Wechsel haben denselben zeitlichen Abschluss. Während der Animation wird das Ein-/Ausblenden des inneren Scrollbalkens unterbunden, um Ruckeln insbesondere bei **Langsam** zu reduzieren.
- Der mitgelieferte Laufzeit-Manifeststand war irrtümlich noch auf V4.11.40 eingefroren. Er wurde auf V4.11.50 synchronisiert, einschließlich der 31 erwarteten Module und ihrer Versionsstände. Bisherige falsche Soll/Ist-Warnungen waren deshalb nicht zwangsläufig eine fehlerhafte Home-Assistant-Installation.

## Versionsdaten

- Produkt: `V4.11.50 DEV`
- Laufzeit: `41150r1`
- Modulsatz: `E411-50A1`
- Modul `ui.controls`: `1.1.13`
- Modul `core.manifest`: `1.2.111`
- Integration unverändert: `0.25.0`

## Abnahme

Statische Prüfung und GitHub Actions sind vor Bereitstellung erforderlich.
Ein Home-Assistant-Realtest ist nach Installation notwendig, insbesondere auf Android bei Seitenwechsel **Langsam**, Vorwärts-/Rückwärtsnavigation, Modulansicht und Versionsdiagnose. Diese Datei behauptet keine bereits erfolgte Realabnahme.

Keine Änderungen an Provider-, Karten-, WeatherRouter- oder DRA-Runtime.

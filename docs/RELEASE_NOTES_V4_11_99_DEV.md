# Gewitterradar V4.11.99 DEV – GR-RF-04

19.10.2026 · deploy/dev · Integration 0.25.17 · Runtime 41199r1 · Modulsatz E411-99A1

Die Realdiagnose `v2_layer_swapped` wies `render_order_verified: true` trotz leerer `render_order` und `observed_draw_orders` aus. Nachgewiesene Ursache: Der generische Diagnose-Ringpuffer filterte verschachtelte Arrays und Objekte aus den realen Ereignissen heraus. Zulässige, begrenzte Zeichenfolgen und Quellenmetadaten bleiben jetzt datensparsam erhalten. Leere Beobachtungen können nicht mehr positiv verifiziert werden. Ein `drawImage` ist kein Niederschlagspixelnachweis. Quellenwahl, Rasterrenderer, RF02-Ausfallschutz und V1/V2 bleiben unverändert.

Test: `scripts/test-p7-010-rf-04.mjs`. Die sieben Schutzfälle und die vollständige HA-Realabnahme sind noch getrennt zu prüfen. Kein HA-REAL-PASS.

C.K. – Eine Idee weiter gedacht.

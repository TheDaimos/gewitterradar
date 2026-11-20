# V4.11.57 DEV – compositorbasierte Android-Menüanimation

**12.10.2026 · Ausgangsbasis:** V4.11.56 DEV, `4a59c97dd6a802e11540c6fa66075bfe3206ee13`.

## Nutzerbefund
Auf Android ist das Signatur-Flackern in V4.11.56 beseitigt, aber der horizontale Menüwechsel ruckelt weiterhin. Der bestehende Code animiert die Höhe des vollständigen Flexdialogs über die Dauer jedes Seitenwechsels, wodurch pro Animationsbild Layout berechnet werden muss. Noch nicht nachgewiesen ist, ob dies die einzige verbleibende Ursache ist.

## Enger Korrekturumfang
Natürliche Zielhöhe wird wie bisher vor dem Verbergen der ursprünglichen Steuerelemente gemessen. Das tatsächliche Dialoglayout wird dann einmalig auf diese Zielhöhe gesetzt. Statt `height` wird die sichtbare Höhe per `scaleY` auf der Compositor-Ebene bewegt; der Dialogkopf, der Menükörper, die originale Signatur und die Versionsangabe erhalten eine gegenläufige Skalierung. Die bestehenden Seitenkopien nutzen weiterhin `translateX`. Dauer: Schnell 220 ms, Mittel 440 ms, Langsam 760 ms.

## Versions- und Schutzrahmen
**V4.11.57 DEV** · `41157r1` · `E411-57A1` · `ui.controls` 1.1.17 · `core.manifest` 1.2.118 · `ui.skeleton` unverändert 1.1.22 · `map.clusters-recent` unverändert 1.0.6 · Integration 0.25.0.

Drei Frontend-Auslieferungen, Manifest, DRA-Identität und Prüfsummen werden synchronisiert. Bestehender Chromium-Test wird gezielt erweitert und die bekannten Karten-/Gestenverträge bleiben erhalten. WeatherRouter wird nicht verändert.

**GitHub-CI ist keine Android-Realabnahme.** Eine Installation erfolgt erst nach grünen Prüfungen und kontrollierter Übernahme nach `deploy/dev`; die flüssige Bewegung muss anschließend auf Android bestätigt werden.

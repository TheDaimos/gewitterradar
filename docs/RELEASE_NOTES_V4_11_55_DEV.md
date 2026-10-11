# V4.11.55 DEV – vereinigte Freigabe (Blitzmarker und Menüanimation)

Datum: 2026-10-11

## Zusammenführung ohne Überschreiben

Zwei Entwicklungsstände trugen zeitgleich die Kennung V4.11.54: Der zwischenzeitlich nach `deploy/dev` übernommene Stand stabilisierte rote **Einzelblitze**, während `feature/v4.11-development` die **horizontale Einstellungsanimation** korrigierte. V4.11.55 vereint beide Änderungen; V4.11.54 bleibt historisch die freigegebene Einzelblitz-Korrektur. Ein erzwungenes Zurücksetzen des Bereitstellungszweigs ist unzulässig.

## Einzelblitze / Cluster

Die auf `deploy/dev` geprüfte stabile Wiederverwendung einzelner Blitzmarker aus V4.11.54 bleibt vollständig erhalten, einschließlich `scripts/test-v41154-individual-markers.mjs`. Die bereits aus V4.11.53 stabile Cluster-Ebene bleibt ebenfalls unverändert. Keine Änderungen an den Android-Kartengesten.

## Horizontale Einstellungen

Der Modus `gr-horizontal-detail` blendete vor Abschluss des sichtbaren Seitenwechsels die auslaufende **Kopie** der Hauptübersicht aus. CSS-Regeln werden jetzt ausschließlich für die animierten Kopien übersteuert, damit aus- und einlaufende Seite dauerhaft sichtbar bleiben. Beide Kopien verwenden die Innenabstände des echten Scrollbereichs und `border-box`.

Die Originalsignatur sitzt als eigenes Flex-Kind des äußeren Einstellungsdialogs – **außerhalb des vertikal scrollenden Hauptbereichs**. Die Versionsangabe bleibt ebenfalls am äußeren Rahmen. Dadurch sollen sie beim Wechsel und bei Höhenanpassungen ihre Position ohne nachträgliches Verschieben beibehalten.

Ein nach Schließen verzögert beendeter Übergang darf die Höhe nicht erneut fixieren.

## Version und Komponenten

- **V4.11.55 DEV** / `41155r1` / `E411-55A1`
- `core.manifest` 1.2.116, `ui.controls` 1.1.15, `ui.skeleton` 1.1.22
- `map.clusters-recent` bleibt 1.0.6 (Einzelblitz- und Clusterkorrekturen)
- Native Integration unverändert 0.25.0

## Abnahme

Neben den bestehenden CI- und Geometrieverträgen werden `test-v41154-individual-markers.mjs` und `test-v41154-settings-motion.cjs` verpflichtend ausgeführt. Letzterer verwendet das reale Frontend in Chromium und prüft beide Auslieferungsarten, Android- und Desktopfenster, alle drei Geschwindigkeiten und beide Navigationsrichtungen. Der Schutz der bestehenden Blitzanzeige und die Beständigkeit der Korrektur sind parallel zu prüfen.

Die Bereitstellung erfolgt nur nach grünen Tests und einem konfliktfreien Fast-Forward von `deploy/dev`. Die optische Android-Realabnahme durch den Anwender bleibt notwendig.

# Codex-Arbeitsplan

Stand: **12.09.2026**

Der frühere V4.05/V4.06-Kandidatenplan vom 08.09.2026 ist abgeschlossen und darf nicht mehr als aktueller Arbeitsauftrag verwendet werden.

## Aktueller Ausgangspunkt

- V4.06 ist veröffentlicht und eingefroren.
- Integration und Dashboard sind zwei Auslieferungsformen desselben kanonischen Gewitterradar-Produkts.
- Neue Produktentwicklung beginnt auf der nächsten Linie; V4.06 wird nicht für neue Funktionen wieder geöffnet.
- `docs/ROADMAP.md` ist die kanonische Zukunfts-/Backlog-Liste.
- V4.07 ist als **Weltweite Orts-Suche** vorgemerkt.

## Verbindliche Codex-Arbeitsweise

Codex-Aufträge werden ab jetzt bewusst klein und überprüfbar gehalten:

1. genau ein logisches Ziel pro Auftrag;
2. erlaubte Dateien/Bereiche benennen, wenn der Auftrag nicht ohnehin eindeutig lokal ist;
3. geschützte Baselines/Regressionen ausdrücklich nennen, wenn sie betroffen sein könnten;
4. klare Akzeptanzkriterien festlegen;
5. keine ungefragten Refactorings oder Nebenbaustellen;
6. bei wachsendem Umfang stoppen und in einen neuen Auftrag aufteilen;
7. nach jedem logischen Schritt Diff und passende Tests prüfen, bevor der nächste Auftrag folgt.

Ein Roadmap-/Backlog-Eintrag ist **kein Codex-Auftrag**. Ideen werden erst nach ausdrücklicher Freigabe geplant bzw. umgesetzt.

## Nächster Entwicklungsblock

Nach Abschluss der Repository-/Branch-/Dokumentationsbereinigung wird V4.07 zunächst als Design-/Machbarkeitsblock zur weltweiten Ortssuche vorbereitet. Providerwahl, Home-Assistant-Standortadapter und die Kopplung zum aktiven Blitzdatenbereich werden vor Implementierung verifiziert.

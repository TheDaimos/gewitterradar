# GR 4.12 – Dynamische Aura-Anordnung (früher Arbeitsblock)

**Beschluss des Betreibers: 18.11.2026.** Als **eine der ersten Funktionen für GR 4.12** vormerken. Kein Eingriff in den GR-4.11-Feature-Freeze. Dieser Eintrag ist Planung, noch kein Implementierungsauftrag.

## Ziel
Bei individuell deaktivierten Auren können im gruppierten Eye-Bubble-Hub große Freiräume entstehen. Eine neue Option im bestehenden Aura-Menü ordnet ausschließlich die **tatsächlich sichtbaren Aura-Ringe** ohne reservierte Leerpositionen hintereinander an.

## Bedienung
- Einstellung **„Aura-Anordnung“** im vorhandenen Aura-Menü mit **„Feste Positionen“** (bestehendes Verhalten, Standard) und **„Dynamisch“**.
- Reihenfolge der Ringe entspricht **immer der bestehenden Eye-Slot-Belegung**.
- Dynamisch: Ein Slot ohne sichtbare Aura beansprucht keinen Ringplatz; aktiviert man die betreffende Funktion bzw. Aura wieder, wird der Ring entsprechend der Slot-Reihenfolge eingefügt, und nachfolgende Ringe rücken auf.
- Die Option steuert **nur die Aura-Ringe**, nicht die Icons, Slotreihenfolge, deren Positionierung oder Wetterdarstellungen.
- **Bestehende Ringgrößen/Durchmesser beibehalten und nur Lücken schließen**; kein automatisches Strecken auf die gesamte Aura-Fläche.
- Die bisherige feste Anordnung bleibt voreingestellt, insbesondere bei Bestandsprofilen.
- Auswahl dauerhaft im bestehenden Eye-/Settings-Vault-Profil speichern.

## Sichtbarkeit und Grenzfälle
Ein Ring zählt nur dann als sichtbar, wenn alle bereits vorhandenen Voraussetzungen erfüllt sind:
1. Slot ist mit einer Bubble belegt.
2. Wetterfunktion ist aktiv/verfügbar.
3. Individuelle Aura steht auf **Aktiv**.
4. Globale Aura ist eingeschaltet und die vorhandenen Farb-/Effektvoraussetzungen sind erfüllt.

Null aktive Ringe → keine Aura-Zeichenarbeit; ein aktiver Ring → erster Ringplatz. Umschalten und Profilwechsel müssen ohne überflüssige Neuberechnung/Flackern funktionieren.

## Strenger Schutz
- Bestehende Aura-Farben, Intensitäten, Animationen, Neon Fusion und die einzelnen Aktiv/Inaktiv-Werte unverändert lassen.
- Eye-Positionierung, 8-Slot-Verwaltung, Drag, Long-Press, Touch-/Screenshot-Recovery und mobile Bedienung nicht ändern.
- Nur vorhandenen Aura-Renderer und sichtbare Slotliste nutzen; keine neue Ring-Engine entwickeln.
- Referenzstände und PROD VM101 schützen; gezielte Tests auf DEV VM109, insbesondere Android (ein-/ausblenden, Profilwechsel, Reload, gruppiertes Eye).
- Keine implizite Erweiterung für 4.11. Nach Umsetzung in 4.12 ist das Aura-Menü im geplanten Umfang als **funktional vollständig** abzunehmen.

## Akzeptanzbeispiel
Slots 1–7, sichtbare Auren nur 1, 3, 5, 6: dynamisch Ring 1→Slot 1, Ring 2→Slot 3, Ring 3→Slot 5, Ring 4→Slot 6. Wird Slot 2 aktiviert und seine Aura sichtbar, lautet die Folge 1, 2, 3, 5, 6 – jeweils ohne Lücken.

**Einordnung:** GR 4.12 / frühe Priorität, nach Abschluss von 4.11 FINAL.

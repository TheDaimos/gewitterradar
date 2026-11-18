# GR 4.11.240 DEV · Android-UI-Feinschliff

**Quellcommit** `fe19ae24e039233dea15d2ae21d600544cc92244` · **HA** `0.25.147` · **Runtime** `411240r1` · **Modulset** `E411-240A1`.

Basis ist GR 4.11.239 DEV (`1c862651`). WR-DEV wurde lesend auf `2b38696a` geprüft. Die Kennzeichnung im Versionsverlauf erhält eine eigene volle Kopfzeile mit moderat responsiver Schriftgröße. Das Gewittermenü verwendet gekapselte Grid-Zeilen mit Abständen, breiten Auswahlfeldern, separater Unendlich-Option und lesbaren Radiuswerten. Schmale Radiuszeilen verteilen sich auf zwei Zeilen. Formularzeilen, Auswahlfelder und Zahlenfeld bieten mindestens 44 CSS-Pixel Höhe.

| Gezielte Chromium-Prüfung | Ergebnis |
|---|---|
| Android-Hochformat | 320, 360, 393 und 430 × 851 CSS-Pixel bestanden. |
| Android-Querformat | 851 × 320, 360, 393 und 430 CSS-Pixel bestanden. |
| Gewittermenü | Alle fünf Bereiche geöffnet, einzeln geschlossen und erneut geöffnet. Checkboxen, beide Auswahllisten, Zahlenfeld, Unendlich und beide Radien bedient. Keine Kollisionen zwischen Zeileninhalten und keine horizontalen Überläufe gemessen. |
| Versionsverlauf DE / EN | Kennzeichnung in allen acht Ansichten einzeilig. Erster und letzter Eintrag durch Scrollen erreichbar. |
| Reload und Profilwechsel | Sämtliche Gewitterfelder nach Reload verglichen. Eigenen Auflösungswert des zweiten Profils geprüft und gespeicherten Wert des ersten Profils nach Rückwechsel wiederhergestellt. |
| Eye Hub | Konfiguration geöffnet, Gewitter einem zusätzlichen Slot zugewiesen, Aura ausgewählt und über das runde X geschlossen. |
| Lieferung | Kanonischer Build, 37 Modulidentitäten, Frontend-Spiegel, SHA-256, HA-Sidebar-Revision und DRA-Vertrag bestanden. |

Der Test verwendet das ausgelieferte HA-Frontend, Chromium-Touchsimulation, den regulären Vault-Client und simulierte HA-/WR-Antworten. Die reale Abnahme auf HA DEV VM109 mit Android steht aus. Die funktionalen Quelldifferenzen beschränken sich auf Layout-CSS und die zugehörigen Formular-Markup-Elemente in drei UI-Dateien. Andere Runtime-Differenzen bestehen aus generierten Importrevisionen und Modulversionen. Breite CI wurde per `[skip ci]` ausgelassen. Der Feature-Freeze gilt weiter.

[Paketquellcommit](https://github.com/TheDaimos/gewitterradar/commit/fe19ae24e039233dea15d2ae21d600544cc92244) · [DRA-V2-DEV-Quelle](https://github.com/TheDaimos/gewitterradar/tree/deploy/dev) · [Installationspakete und SHA-256](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.240-dev)

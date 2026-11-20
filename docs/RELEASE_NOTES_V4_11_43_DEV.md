# Gewitterradar V4.11.43 DEV – Fenster- und Ebenendiagnose

Datum: 2026-10-09

## Anlass
„Hilfe und Hinweise“ reagiert auf dem Realgerät auch mit V4.11.41 nicht sichtbar. Neben dem bereits untersuchten Sprach-/Renderingpfad ist ein verdeckter Dialog oder eine überlagernde Ebene möglich. Die Modulregistrierung allein beweist weder Sichtbarkeit noch Klickbarkeit.

## Neue Funktion
Die bisherigen Exporte in „Module & Versionen“ enthalten zusätzlich das Objekt `layers`. Es erfasst nur beim bewussten Export, ohne fortlaufende Listener:
- sichtbare und offene Dialoge, wichtige Fenster, Hintergründe und die Schaltflächen „Hilfe“/„Über“;
- DOM-Status, `open`, `aria-modal`, `display`, `visibility`, `opacity`, `position`, `z-index`, `pointer-events`, `transform`;
- Pixelrechtecke, Elementtreffer in der Fenstermitte per `ShadowRoot.elementsFromPoint`, die oberen Treffer und `stackingAncestors`;
- Hilfedialog vorhanden/geöffnet und den letzten Hilfe-Fehler aus V4.11.42.

Die Aufnahme unterscheidet bewusst errechneten `z-index` von wirklicher Treffertopologie: Native `dialog.showModal()`-Elemente gehören zur Browser-Top-Layer und sind nicht anhand eines einfachen z-index-Rankings einzuordnen.

## Version
V4.11.43 DEV; Runtime `41143r1`; Modulsatz `E411-43A1`; `diagnostics.module-view` 1.3.7; Integration unverändert 0.25.0. Alle geänderten Dateien sind in Quelle, Dashboard und nativer Integration identisch.

## Realtest (noch nicht durchgeführt)
1. V4.11.43 über DRA installieren, Frontend vollständig neu laden.
2. Einstellungen öffnen, „Hilfe und Hinweise“ antippen.
3. Ohne andere Fenster zu schließen unter „Module & Versionen“ beide JSON-Exporte erzeugen.
4. In `layers.helpState` nach `dialogPresent`, `dialogOpen` und `lastError` sehen; in `layers.elements` auf `#help-shell`, `.help-dialog`, `#settings-backdrop`, `#settings-help` achten.
5. Parallel die DRA-/Runtime-Manifestabweichung getrennt untersuchen.

Kein Eingriff in Touch-/Pointer-Kartenbedienung, WeatherRouter, About-Baseline oder Hi-Res-Master.

**C.K. – Eine Idee weiter gedacht.**

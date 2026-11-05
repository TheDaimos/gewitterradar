# GR TEST70-58: WR besitzt die Niederschlagsentscheidung – Entwicklungsstand

Datum 2026-11-04; Branch `deploy/dev`; **nicht als installierbarer Release abgenommen**.

## Implementierte Änderungen

- GR sendet bei normaler V2-Niederschlagsabfrage nur Geometrie, Ressourcenbudget und boolesche Benutzerpräferenz für ältere Satellitenbilder, **keine eigene Gültigkeitsdauer, Providerliste oder Priorität**.
- GR prüft Datenalter nicht selbst; es verwendet bei V2 ausschließlich das von WR ausgestellte `layer.times.valid_until` und rendert die WR-geordneten Ebenen.
- Starre 900s-Sperren aus aktivem GR-V1/V2-Renderer, Kachelbeibehaltung und Diagnoseanfragen entfernt. 900 Millisekunden UI-Debounce ist hiervon ausdrücklich nicht betroffen.
- GR trennt die explizite administrative Diagnoseansicht von der normalen WR-gesteuerten Niederschlagsdarstellung.
- WR meldet neue zugelassene RATE-Zyklen; GR reagiert darauf mit erneutem regulärem V2-Refresh, **nicht** durch Aktivierung einer OPERA-Sonderebene.
- Frontend-Quelldateien mit beiden Auslieferungskopien (HA-Integration und Dashboard) synchronisiert.
- Test `tests/test70-58-wr-validity-authority.test.mjs` kontrolliert GR-Vertrag, serverseitiges Ablaufdatum und das Verbot neuer 900s-Regeln.

## CI / Ergebnisse

Öffentliche CI `GR TEST70-58 WR authority contracts`: **SUCCESS**, Run `41861627865`.
Die ältere GR-Gesamt-CI ist am aktuellen Branch noch **nicht vollständig grün**. Zahlreiche historische Tests verwenden fest eingetragene 4.11.106/4.11.109- oder Modulfassungen. Die nachweislich veralteten Pins wurden teilweise korrigiert, ohne Tests abzuschalten. Die neuesten Gesamt-CI-Läufe sind derzeit in der Queue.
GR-Frontend-Release V4.11.136 ist **noch nicht** freigegeben/committet. GR V4.11.135 ist der letzte bestätigte Release und enthält den neuen V2-Transport nicht.
WR entwickelt im privaten `TheDaimos/weather-router-dev@deploy/dev` auf V0.10.285 DEV / Loader 288; Details im privaten Audit `WR_P0_VALIDITY_ROUTING_AUDIT_V010285_2026-11-04.md`. Python-Gesamtregression und HA DEV Realtest bleiben offen.

## Freigabesperre

Keine Behauptung eines abgeschlossenen HA DEV VM 109 Realtests ohne tatsächliche Tests. Keine Änderung an PROD VM 101. **Keine privaten GitHub Actions** – alle Actions ausschließlich im öffentlichen GR- bzw. WR-Public-Repository. Diagnose-/Realtest-Exporte ausschließlich nach `TheDaimos/Project-Log-And-Export@main`.

Erforderlich für eine Freigabe: GR Releasebuild + Manifest-/Checksum-/DRA-Abgleich, grüne relevante CI, WR Python-Regression, anschließender DRA-Test auf HA DEV 109 mit DWD-in-Deutschland, OPERA-in-Europa, gemischtem Ausschnitt, selektivem Tile-Retry und nahtlosem Handover.

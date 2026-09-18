# Gewitterradar V4.07.57 – Release-Abschluss

Stand: **16.09.2026**  
Produkt: **V4.07.57**  
Native Integration: **0.19.1**  
Geschützte Laufzeit-/Diagnosebasis: **V4.07.56**

V4.07.57 ist bewusst ein Dokumentations-/Installations-Patch. Die normale Karten-, Ortssuche-, Sprach-, Hilfe-, Radien-, Medaillon-, Diagnose- und Bedienlogik bleibt auf dem akzeptierten V4.07.56-Stand.

## Identität

- Frontend: **1.955.144 Bytes**
- Frontend-SHA256: `ac921b5fc40f2d7f36733bb7262fdb1595790674695ad0eb83ccde8bc7146571`
- Build: `V4.07-RELEASE57-2026-09-16`
- geschützte V4.07.56-SHA256 nach Rücknormalisierung: `249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a`
- Dashboard-Paket-SHA256: `1b705c5686e6a7be6dfb36717903df551d4f9f93787c39bd12bddf00aefae694`

## Release-Gates

- [x] V4.07.56 bleibt unverändert als historische/protected Baseline erhalten.
- [x] V4.07.57-Frontend unterscheidet sich nur in Versions-/Build-Metadatenankern.
- [x] Native Integration auf `0.19.1` angehoben.
- [x] README und Installationsdokumentation auf Integration-first umgebaut.
- [x] Vollständiger nativer View-Block dokumentiert.
- [x] Dashboard-/Package-README im gleichen Stil vorbereitet.
- [x] PRE-MERGE-Snapshot des bisherigen `main` als geprüftes GitHub-Actions-Artefakt erzeugt.
- [x] V4.07.57-Release-Notes angelegt.
- [ ] Merge nach `main`, vollständige Post-Merge-Gates, Golden-Master-Artefakt und öffentlicher Tag/Release werden durch den kontrollierten Veröffentlichungsablauf abgeschlossen.

Der öffentliche `v4.07.57`-Tag darf nur auf exakt dem Commit liegen, der nach dem Merge auf `main` die Release-Gates bestanden hat und aus dem der Golden Master erzeugt wurde.

## Externe Nachprüfungen

Reale Blitzortung-Datenregions-/Latenztests sowie besondere DNS-/Proxy-/TLS-Inspection-Szenarien bleiben getrennte Umgebungsprüfungen. Sie werden durch diesen Dokumentationspatch nicht fälschlich als erledigt markiert und verändern die bereits geschützte Produktlogik nicht.

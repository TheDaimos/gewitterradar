# GR 4.11.248 DEV – Hilfe & Hinweise: Standard und PRO einklappbar

**Datum:** 20.11.2026 · **DRA:** `deploy/dev` · **HA:** 0.25.155 · **Runtime:** `411248r1`

## Umsetzung

- Zwei unabhängig schaltbare Bereiche: **GewitterRadar Standard** und **GewitterRadar PRO**.
- Beide Logos/Brandings bleiben selbst bei eingeklappten Themen dauerhaft sichtbar.
- Standard verwendet das **bestehende GewitterRadar-Globus-Logo**. Seine obere und untere Linie erhalten die goldene Farbvariante der vorhandenen PRO-Liniengestaltung.
- Das **originale PRO-Wordmark und die bestehende blaue obere Linie sind unverändert**. Unter dem PRO-Bereich befindet sich jetzt eine zweite Linie mit demselben blauen Farbverlauf.
- Rechts im jeweiligen Branding-Bereich sitzt ein passend gefärbter Chevron. Nur die darunterliegenden Hilfethemen werden ein-/ausgeblendet. Die inneren Hilfe-Chevrons bleiben unverändert.
- Beide Zustände werden unabhängig über den HA-**Settings Vault** im Benutzer-/Geräteprofil gespeichert (`gr.help.group.standard.v1`, `gr.help.group.pro.v1`). Ausgangszustand: beide Bereiche offen.
- Keine Veränderung von Help-Inhalten, Sprachkatalogen, PRO-Erkennung, Wetterdarstellung oder Datenanbindung. Die bestehenden 19 Sprachvarianten werden weiterhin verwendet.

## Schutzprüfung

| Prüfung | Ergebnis |
| --- | --- |
| Eigener Help-Gruppen-/Branding-/Vault-Vertrag | PASS |
| Alle 19 Hilfesprache-Untertitel | PASS |
| Vault-Schlüsselvalidierung für beide Zustände | PASS |
| Frontend-/DRA-Identitäten und Mirrors | PASS (37 Module, 195 Dateien) |
| HACS-Paket | PASS (234 Dateien) |
| WeatherRouter-/Provider-Isolation | PASS (3 Tests) |
| Modul-/Gestenvertrag und deterministischer Build | PASS |
| `git diff --check` | PASS |

**Offen:** Visuelle Prüfung im echten Home Assistant auf Notebook, iPad und Smartphone. Ein lokaler Chromium-Start war in der isolierten Testumgebung nicht möglich; es wurde kein Browser-Sichttest als bestanden ausgegeben. Die vollständige Python-Pytest-Suite konnte mangels installiertem `pytest` nicht ausgeführt werden. Automatisierte Quell-/Vertragstests und Vault-Validator sind ausgeführt.

**PROD VM101, FINAL-Tag und Lizenz bleiben unverändert.** Kein neuer geschützter Referenzstand ohne Betreiber-Abnahme.

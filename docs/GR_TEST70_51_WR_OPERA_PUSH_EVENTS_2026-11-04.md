# TEST70-51 – OPERA Push-Events (GR ↔ WR)

Datum: 2026-11-04. **Ziel: aktiv durch WR angekündigte OPERA-Zyklen**, statt ausschließlich clientlokalen 30-Sekunden-Timern.

## Implementiert

- WR `TheDaimos/weather-router-dev@deploy/dev`: V0.10.282 DEV / Loader 285. In `opera_monitor.py` wird nach `RingRateBridge.stage_latest` bei `status=registered_diagnostic` und geändertem `stamp` das HA-Bus-Ereignis `weather_router_opera_cycle_available` gesendet. Payload nur provider_id=opera, product_id=RATE, stamp und scientific_approval=false. Keine PNGs, Tokens, URL oder Freigabe im Ereignis.
- GR `TheDaimos/gewitterradar@deploy/dev`: V4.11.130 DEV / Integration 0.25.39 / Runtime 411130r1. Bei aktivierter OPERA-Vorschau wird `hass.connection.subscribeEvents` genutzt. Bei passender Benachrichtigung führt GR **die bestehende autorisierte Consumer-V2-Abfrage** durch, einschließlich auth-preflight, Readiness-Gate und WR-Freshness-Check. Bereits laufende Abfragen werden nicht überlappt. Bei Deaktivierung bzw. Auth-Abbruch wird das Abonnement abgemeldet.
- Der 30-Sekunden-Poll läuft vorerst als Recovery-Fallback weiter. Der Push informiert, autorisiert aber nie selbst eine Kachel.
- Diagnoseereignisse `cycle_push_received` und `cycle_push_subscription_failed` fließen in das vorhandene `opera_cycle_lifecycle` ein.

## Prüfungen

- Öffentliche GitHub Actions, ausschließlich Public-Repo GR: Run **41797750005 SUCCESS**: https://github.com/TheDaimos/gewitterradar/actions/runs/41797750005
- Es wurden **keine privaten GitHub Actions** gestartet. WR-Code wurde im privaten `deploy/dev` gespeichert und muss unter HA DEV VM109 auf Funktion geprüft werden.

## Realtest VM109 (nicht PROD)

1. WR V0.10.282 DEV und danach GR V4.11.130 DEV über DRA V2 aus genau den genannten deploy/dev Repos installieren.
2. OPERA-Vorschau starten; bestehende WR-Opt-ins/Freigaben nicht ändern.
3. Den nächsten automatisch von WR registrierten OPERA-Zyklus abwarten, auf Desktop und Android gleichzeitig offen lassen.
4. GR Weather-Engine-JSON exportieren und `opera_cycle_lifecycle` prüfen. Erfolg: `cycle_push_received` → `cycle_poll_started` → `cycle_poll_response` → `cycle_staging_started` → `cycle_swap_complete`. Wenn Ereignis verpasst, muss Fallback weiterhin greifen.
5. Diagnostics/Realtest-Exporte ausschließlich in `TheDaimos/Project-Log-And-Export@main` sichern.

## Freigabegrenzen

Build und Syntax/Regressionsprüfung für GR öffentlich erfolgreich; **kein HA-DEV-Realtest, kein Nachweis der Geräteübergreifenden Zustellung und keine PROD-Freigabe**. Ohne aktive Verbindung können Geräte Ereignisse verpassen; ein Fallback ist Pflicht. Die Status-Anzeige kann weiterhin bis zur nächsten Altersaktualisierung um bis zu 30 Sekunden abweichen; dies ist keine WR-Zeitabweichung.

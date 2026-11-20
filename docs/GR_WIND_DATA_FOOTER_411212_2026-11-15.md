# GR 4.11.212 DEV – Winddatenstatus am Ende der Einstellungen

**Ausgangsbasis:** GR 4.11.211 DEV, `deploy/dev` HEAD `92f2afe2313ffa494c8853d730fd06190eb4b1e3`.

**Betreiberwunsch:** Die missverständliche Anzeige „Aus · 0 Punkte“ und die Schaltfläche „WR-Wind aktualisieren“ aus dem Bereich unter der Windgeschwindigkeits-Farbfläche an das untere Ende des Windmenüs verlegen und besser benennen.

## Umsetzung

- Nach dem letzten Menüabschnitt „Performance-Diagnose“ steht jetzt ein eigener Abschlussblock für WR-Winddaten.
- Der Status unterscheidet „WR-Windpunktdaten“ und „Numerisches WR-Windfeld“ und zeigt weiterhin unveränderte Livewerte bzw. Gitterknotenzahl.
- Der Button heißt „Winddaten jetzt aktualisieren“. Sein `data-wind-action="refresh"`, die Freigabebedingung und der bestehende Aufruf `_weatherWindQueue({force:true})` bleiben unverändert.
- Modellquelle, Modelllauf, Gültigkeits- und WR-Freigabedaten werden zusammen mit der Statusanzeige nach unten verschoben.
- Keine Änderung an Winddatenerhebung, Renderern, Windschlangenanimation, Einstellungen, Persistenz oder WeatherRouter.

## Lieferstand und Prüfungen

- Neue Version **GR V4.11.212 DEV / HA 0.25.119**, Runtime `411212r1`, Modulset `E411-212A1`.
- Frontend-Kanon, HA-Frontend und Dashboard-Frontend gespiegelt; Runtime- und DRA-Metadaten synchronisiert.
- Statische Tests und Spiegel-/Versionenprüfung im Build. Eine tatsächliche Android-/HA-DEV-VM109-Sichtprüfung ist vom Betreiber noch nachzuholen.
- Der geschützte Referenzstand und PROD VM101 bleiben unberührt.

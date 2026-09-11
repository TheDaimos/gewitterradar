# Home Assistant Recorder recommendation

Gewitterradar uses short-lived lightning entities and frequently updated lightning sensors. For installations with frequent lightning activity, excluding these entities from long-term Home Assistant Recorder storage is recommended:

```yaml
recorder:
  exclude:
    entity_globs:
      - "geo_location.lightning_strike*"
      - "sensor.*_lightning_distance"
      - "sensor.*_lightning_azimuth"
      - "sensor.*_lightning_counter"
```

Apply this configuration in `configuration.yaml`. If a `recorder:` section already exists, integrate these entries into the existing section. Do not create a second top-level `recorder:` key.

The exclusion affects future Recorder/History storage for these entities; it does not disable their current live states for Gewitterradar. Existing historical data is not removed automatically. The wildcard patterns cover multiple lightning-detection devices or observation points regardless of their entity prefix.

The actual number of lightning entities available to Home Assistant depends on the Blitzortung.org integration settings, especially detection radius, time window and the configured maximum number of lightning events. Larger values can increase system load during high lightning activity.

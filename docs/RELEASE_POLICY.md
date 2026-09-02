# Release policy

## Frozen V4.04 baseline

Gewitterradar V4.04 is the first release that combines the verified HACS `dist/` installation path with the staged Home Assistant package. It is treated as a frozen regression baseline.

The approved V4.04 release anchor is:

```text
Tag:    v4.04
Commit: 8ada0e06aef47627d31224b9e46d58de459fb24b
Backup: frozen/v4.04
```

The tag, its release target and the frozen backup branch must continue to resolve to this exact commit. CI checks all three anchors. Existing stable releases must not be retagged, rebuilt in place or silently replaced. Functional or packaging changes start a new version.

The V4.04 release keeps the HACS-compatible rule of publishing zero custom GitHub release assets. HACS therefore installs the tagged `dist/` tree containing `gewitterradar.js`, `assets/` and `app_gewitterradar_pkg.yaml`.

## Latest release policy

Normal HACS installations should use the newest/default version offered by HACS rather than deliberately selecting a fixed historical version. In documentation this channel is called **Latest**.

At the time this policy was introduced, GitHub `releases/latest` resolves to `v4.04`.

Every future stable Gewitterradar release must:

- use a new version tag instead of changing an existing stable tag;
- be published as the GitHub **Latest** release (`gh release create ... --latest`);
- preserve the zero-custom-release-asset HACS distribution model unless a future HACS implementation is deliberately revalidated;
- pass the complete distribution, package, asset and HACS validation before publication;
- update release notes and the changelog.

HACS checks repository metadata for newer versions and offers updates when a newer stable release is published. Users who simply use the default newest version therefore remain on the normal update path. Selecting an older version should be reserved for an intentional rollback or compatibility requirement.

## GitHub immutable releases

GitHub also supports repository-level immutable releases. When enabled, future published release tags and release assets cannot be changed after publication. GitHub currently applies this setting only to releases published after the setting is enabled, so it cannot retroactively convert the already published V4.04 release into an immutable release.

For V4.04, the fixed commit SHA, `v4.04` tag, `frozen/v4.04` backup branch and CI anchor checks provide the repository regression guard. For future releases, enabling GitHub release immutability is additionally recommended before publication.

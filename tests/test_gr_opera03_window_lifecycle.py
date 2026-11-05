"""OPERA UI isolation and release identity contracts on the pinned GR baseline."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRONTENDS = [
    ROOT / "frontend",
    ROOT / "custom_components/gewitterradar/frontend",
    ROOT / "dashboard/dist",
]


def source(relative):
    return (FRONTENDS[0] / relative).read_text(encoding="utf-8")


def test_all_three_frontend_mirrors_match():
    for relative in ("modules/weather/consumer-client.js",
                     "modules/weather/p7-010/opera-diagnostic-tile.js",
                     "modules/weather/precipitation-layer.js"):
        assert len({(p / relative).read_bytes() for p in FRONTENDS}) == 1


def test_regular_precipitation_does_not_own_diagnostic_pane():
    precip = source("modules/weather/precipitation-layer.js")
    # Disabling precipitation may close an already open diagnostic pane;
    # ordinary precipitation must never start or own that pane.
    assert "autoFromPrecipitation:true" not in precip
    assert "__operaDiagnosticPane" not in precip
    # WR Consumer V2 is the normal precipitation route.
    assert "prepareRasterMosaicV2" in precip


def test_opera_diagnostic_path_remains_admin_only_and_unapproved():
    adapter = source("modules/weather/p7-010/opera-diagnostic-tile.js")
    assert 'request.source_request={provider_id:"opera",product_id:"RATE",diagnostic:true' in adapter
    assert "response.raster_approved!==false" in adapter
    assert 'Authorization:"Bearer "+token' in adapter
    assert "getUint32(16)!==256" in adapter and "getUint32(20)!==256" in adapter
    assert "URLRef.revokeObjectURL" in adapter


def test_pinned_version_identity_is_consistent():
    expected = "4.11.138"
    build = (ROOT / "custom_components/gewitterradar/build_info.py").read_text()
    assert f'BUILD_VERSION = "{expected}"' in build
    for base in FRONTENDS:
        version = (base / "version.js").read_text(encoding="utf-8")
        runtime = json.loads((base / "assets/gewitterradar-runtime-manifest.json").read_text())
        assert f'version:"{expected}"' in version
        assert runtime["productVersion"] == expected
        assert runtime["moduleSetId"] == "E411-138A1"
        assert sum(x["id"] == "weather.consumer-client" for x in runtime["modules"]) == 1

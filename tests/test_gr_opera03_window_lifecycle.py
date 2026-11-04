"""GR-OPERA-03 source-level regressions, no Home Assistant needed."""
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CONSUMERS=[
    ROOT/"frontend/modules/weather/consumer-client.js",
    ROOT/"custom_components/gewitterradar/frontend/modules/weather/consumer-client.js",
    ROOT/"dashboard/dist/modules/weather/consumer-client.js",
]
ADAPTERS=[
    ROOT/"frontend/modules/weather/p7-010/opera-diagnostic-tile.js",
    ROOT/"custom_components/gewitterradar/frontend/modules/weather/p7-010/opera-diagnostic-tile.js",
    ROOT/"dashboard/dist/modules/weather/p7-010/opera-diagnostic-tile.js",
]

def test_all_three_frontend_mirrors_match():
    assert len({p.read_bytes() for p in CONSUMERS}) == 1
    assert len({p.read_bytes() for p in ADAPTERS}) == 1

def test_closing_weather_engine_does_not_close_map_owned_opera():
    source=CONSUMERS[0].read_text(encoding="utf-8")
    method=source.split("_weatherEngineDiagnosticClose(){",1)[1].split("_mountWeatherEngineDiagnostics()",1)[0]
    assert "__operaDiagnosticPane.close()" not in method
    assert "backdrop.classList.remove('open')" in method
    assert "this.__operaDiagnosticPane.close();this.__operaDiagnosticPane=null;" in source
    assert "this.__operaDiagnosticPane?.active===false" in source
    assert "pane.metrics?.loaded" in source

def test_opera_is_explicit_and_never_promotes_unverified_tiles():
    source=ADAPTERS[0].read_text(encoding="utf-8")
    assert 'request.source_request={provider_id:"opera",product_id:"RATE",diagnostic:true,preview_orientation:orientation}' in source
    assert "response.raster_approved!==false" in source
    assert "UNVERIFIED_DEV_PREVIEW" in source
    assert "response.max_age_seconds" in source
    assert "getUint32(16)!==256" in source
    assert "getUint32(20)!==256" in source
    assert "image.onload=()=>{metrics.loaded++" in source
    assert "get active(){return !disposed;}" in source
    assert "controller.abort()" in source
    assert "URLRef.revokeObjectURL" in source

def test_current_version_is_coherent():
    import json
    import re
    version_text = (ROOT / "frontend/version.js").read_text(encoding="utf-8")
    match = re.search(r'version:"([0-9.]+)"', version_text)
    assert match is not None
    expected = match.group(1)
    for base in [ROOT / "frontend", ROOT / "dashboard/dist",
                 ROOT / "custom_components/gewitterradar/frontend"]:
        version = (base / "version.js").read_text(encoding="utf-8")
        manifest = json.loads((base / "assets/gewitterradar-runtime-manifest.json").read_text(encoding="utf-8"))
        assert f'version:"{expected}"' in version
        assert manifest["productVersion"] == expected
        assert manifest["runtimeRevision"] in version
        assert manifest["moduleSetId"] in version

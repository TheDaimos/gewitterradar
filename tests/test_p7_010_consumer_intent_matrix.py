"""Verify P7-010 inventory against Gewitterradar's actual frontend source."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MATRIX = ROOT / "docs/p7_010_gewitterradar_intent_matrix.v1.json"
MANIFEST = ROOT / "frontend/module-manifest.js"
VERSION = ROOT / "frontend/version.js"
CONSUMER = ROOT / "frontend/modules/weather/consumer-client.js"
PRECIPITATION = ROOT / "frontend/modules/weather/precipitation-layer.js"
LAYER_MENU = ROOT / "frontend/modules/weather/layer-menu.js"


def _blob_sha(raw: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest()


def _actual_modules() -> list[dict]:
    body = MANIFEST.read_text(encoding="utf-8").split(
        "export const EXPECTED_MODULES=Object.freeze(", 1
    )[1].split("].map(item=>Object.freeze(item))", 1)[0] + "]"
    return json.loads(body)


def test_inventory_matches_exact_checked_deploy_baseline():
    matrix = json.loads(MATRIX.read_text(encoding="utf-8"))
    expected = matrix["consumer"]
    assert _blob_sha(MANIFEST.read_bytes()) == expected["module_manifest_sha"]
    assert expected["version"] == "4.11.74 DEV"
    assert 'version:"4.11.74"' in VERSION.read_text(encoding="utf-8")
    modules = _actual_modules()
    assert len(modules) == expected["module_count"] == 33
    assert len({x["id"] for x in modules}) == len(modules)
    groups = {}
    for module in modules:
        groups[module["group"]] = groups.get(module["group"], 0) + 1
        assert (ROOT / "frontend" / module["file"]).is_file(), module["file"]
    assert groups == expected["module_groups"]
    assert len([x for x in modules if x["id"].startswith("weather.")]) == 5


def test_explicit_contract_uses_no_invented_implementation():
    matrix = json.loads(MATRIX.read_text(encoding="utf-8"))
    source = CONSUMER.read_text(encoding="utf-8")
    for id_ in matrix["consumer"]["current_explicit_capabilities"]:
        assert id_ in source
    assert "weather_router/consumer/discovery" in source
    assert "weather_router/consumer/capabilities" in source
    assert "weather_router/consumer/resolve" in source
    assert 'const CAPABILITY="weather.precipitation.layer"' in PRECIPITATION.read_text(encoding="utf-8")
    layer = LAYER_MENU.read_text(encoding="utf-8")
    assert 'rendererId=capability=>capability?.id===WEATHER_ROUTER_CAPABILITIES.precipitation?"precipitation":null' in layer
    assert matrix["consumer"]["actual_resolve_implemented"] == ["weather.precipitation.layer"]
    assert matrix["consumer"]["frontend_renderer_capabilities"] == ["weather.precipitation.layer"]
    assert sum(row["status"] == "implemented" for row in matrix["intents"]) == 1
    assert not matrix["migration_approved"]


def test_routing_policy_does_not_absorb_local_features():
    matrix = json.loads(MATRIX.read_text(encoding="utf-8"))
    ids = {x["id"] for x in matrix["local_only"]}
    assert len(ids) == 10
    assert {"tracking_and_radius", "local_lightning_markers", "compass_and_medallion"} <= ids
    policy = matrix["policy"]
    assert policy["router_optional"]
    assert policy["local_data_independent"]
    assert policy["profile_can_only_restrict"]
    assert not policy["consumer_provider_selection"]
    assert not policy["consumer_scoring"]
    assert not policy["consumer_auto_coverage_decision"]
    assert matrix["phase_status"] == "ACTIVE"

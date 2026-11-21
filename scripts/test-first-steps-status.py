"""Execute setup logic with doubles on hosts without Home Assistant.

This is a unit check of actual function bodies, not an HA runtime test. The
full authenticated websocket test lives in tests/test_setup_status.py.
"""
import ast
import asyncio
from fnmatch import fnmatchcase
from pathlib import Path
import sys
from types import ModuleType, SimpleNamespace as NS
from typing import Any

path = Path(__file__).resolve().parents[1] / "custom_components/gewitterradar/setup_status.py"
tree = ast.parse(path.read_text(encoding="utf-8"))
tree.body = [item for item in tree.body if isinstance(item, (ast.Assign, ast.FunctionDef, ast.AsyncFunctionDef))]
for item in tree.body:
    if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef)):
        item.decorator_list = []
namespace = {"fnmatchcase": fnmatchcase, "Any": Any, "HomeAssistant": object}
exec(compile(tree, str(path), "exec"), namespace)
globs = namespace["SOURCE_GLOBS"]
covers = namespace["recorder_config_covers_sources"]
config = {"recorder": {"exclude": {"entity_globs": list(globs)}}}
assert covers(config)
for count in range(4):
    assert not covers({"recorder": {"exclude": {"entity_globs": list(globs[:count])}}})
assert not covers({})
assert not covers({"recorder": None})
assert covers({"recorder": {"exclude": {"domains": ["sensor", "geo_location"]}}})
assert covers({"recorder": {"exclude": {"entity_globs": ["sensor.*", "geo_location.*"]}}})
for include in ({"entities": ["sensor.test_lightning_counter"]}, {"entity_globs": ["sensor.*"]}):
    assert not covers({"recorder": {**config["recorder"], "include": include}})
assert covers({"recorder": {**config["recorder"], "include": {"entities": ["sensor.temperature"]}}})


async def run():
    registry = NS(entities={
        "device_tracker.renamed_radar": NS(entity_id="device_tracker.renamed_radar", domain="device_tracker", platform="gewitterradar"),
        "todo.renamed_places": NS(entity_id="todo.renamed_places", domain="todo", platform="local_todo", name=None, original_name="Gewitterradar Orte", disabled_by=None),
    })
    foreign = NS(data={"location_entity": "device_tracker.renamed_radar"})
    entries = [foreign]
    states = {"todo.renamed_places": NS(entity_id="todo.renamed_places", state="0")}
    hass = NS(config=NS(components={"recorder"}),
        config_entries=NS(async_entries=lambda domain: entries),
        states=NS(get=states.get, async_all=lambda: list(states.values())))
    replies = []
    connection = NS(user=NS(is_admin=True), send_result=lambda id, result: replies.append(result))
    namespace["er"] = NS(async_get=lambda _: registry)
    mode = {"recorded": False, "failure": False, "reads": 0}

    async def yaml(_):
        mode["reads"] += 1
        if mode["failure"]:
            raise OSError("Synthetic YAML failure")
        return config
    namespace["async_hass_config_yaml"] = yaml
    recorder = ModuleType("homeassistant.components.recorder")
    recorder.is_entity_recorded = lambda _hass, _entity: mode["recorded"]
    sys.modules["homeassistant.components.recorder"] = recorder
    check = namespace["ws_setup_status"]
    await check(hass, connection, {"id": 1})
    assert replies[-1] == {"schema": "gewitterradar.setup-status.v1", "blitzortungInstalled": True,
        "trackerLinked": True, "recorderExcluded": True, "localTodoCreated": True}
    mode["recorded"] = True
    await check(hass, connection, {"id": 2})
    assert replies[-1]["recorderExcluded"] is False
    mode["failure"] = True
    await check(hass, connection, {"id": 3})
    assert replies[-1]["recorderExcluded"] is None
    assert replies[-1]["trackerLinked"] is True
    connection.user.is_admin = False
    reads = mode["reads"]
    registry.entities["todo.renamed_places"].platform = "shopping_list"
    foreign.data = {"location_entity": "device_tracker.unrelated"}
    await check(hass, connection, {"id": 4})
    assert mode["reads"] == reads
    assert replies[-1]["recorderExcluded"] is None
    assert replies[-1]["localTodoCreated"] is False
    assert replies[-1]["trackerLinked"] is False
    assert replies[-1]["blitzortungInstalled"] is True
    foreign.data = {"config_type": "coordinates", "location_entity": "device_tracker.renamed_radar"}
    await check(hass, connection, {"id": 5})
    assert replies[-1]["trackerLinked"] is False
    entries.clear()
    await check(hass, connection, {"id": 6})
    assert replies[-1]["blitzortungInstalled"] is False
    assert foreign.data == {"config_type": "coordinates", "location_entity": "device_tracker.renamed_radar"}

asyncio.run(run())
print("PASS: setup handler units with doubles; Recorder precedence, restart, partial failures, renamed registry entities, Local-to-do ownership and non-admin boundary (not HA runtime).")

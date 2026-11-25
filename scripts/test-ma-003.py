"""MA-003 targeted stdlib tests; no Home Assistant installation required."""

import ast
import asyncio
import importlib
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import AsyncMock, patch

ROOT = Path(__file__).resolve().parents[1]
GR = ROOT / "custom_components" / "gewitterradar"
# Load the actual MA package without importing the HA-dependent parent.
parent = types.ModuleType("_ma_test_gr")
parent.__path__ = [str(GR)]
sys.modules[parent.__name__] = parent
ma = importlib.import_module("_ma_test_gr.monitored_areas")
config = importlib.import_module("_ma_test_gr.monitored_areas.config")
contracts = importlib.import_module("_ma_test_gr.monitored_areas.contracts")


class NoHA:
    """Any attempted HA resource access fails."""

    def __getattr__(self, name):
        raise AssertionError(f"Unexpected HA access: {name}")


class LifecycleTests(unittest.IsolatedAsyncioTestCase):
    async def test_off(self):
        for options in ({}, {config.CONF_MONITORED_AREAS_ENABLED: False},
                        {config.CONF_MONITORED_AREAS_ENABLED: 1},
                        {config.CONF_MONITORED_AREAS_ENABLED: "true"}):
            before = dict(options)
            with patch.object(ma, "MonitoredAreasRuntime", side_effect=AssertionError) as factory, \
                 patch("builtins.open", side_effect=AssertionError) as file_open, \
                 patch("sqlite3.connect", side_effect=AssertionError) as db, \
                 patch("asyncio.create_task", side_effect=AssertionError) as task, \
                 self.assertNoLogs(ma._LOGGER, level="ERROR"):
                self.assertIsNone(await ma.async_setup_monitored_areas(
                    NoHA(), types.SimpleNamespace(options=options)))
                await ma.async_unload_monitored_areas(None)
                for spy in (factory, file_open, db, task):
                    spy.assert_not_called()
            self.assertEqual(options, before)

    async def test_on_inert_restart(self):
        entry = types.SimpleNamespace(options={config.CONF_MONITORED_AREAS_ENABLED: True})
        with patch("builtins.open", side_effect=AssertionError), \
             patch("sqlite3.connect", side_effect=AssertionError), \
             patch("asyncio.create_task", side_effect=AssertionError), \
             self.assertNoLogs(ma._LOGGER, level="ERROR"):
            before = asyncio.all_tasks()
            runtime = await ma.async_setup_monitored_areas(NoHA(), entry)
            self.assertEqual(runtime.status, contracts.LifecycleStatus.READY)
            await runtime.async_start()
            await ma.async_unload_monitored_areas(runtime)
            await ma.async_unload_monitored_areas(runtime)
            self.assertEqual(runtime.status, contracts.LifecycleStatus.STOPPED)
            await runtime.async_start()
            self.assertEqual(runtime.status, contracts.LifecycleStatus.READY)
            await runtime.async_stop()
            self.assertEqual(asyncio.all_tasks(), before)

    async def test_failure_isolated(self):
        entry = types.SimpleNamespace(options={config.CONF_MONITORED_AREAS_ENABLED: True})
        runtime = ma.MonitoredAreasRuntime()
        with patch.object(ma, "MonitoredAreasRuntime", return_value=runtime), \
             patch.object(runtime, "async_start", new=AsyncMock(side_effect=RuntimeError("injected"))), \
             patch.object(runtime, "async_stop", new=AsyncMock(wraps=runtime.async_stop)) as stop, \
             self.assertLogs(ma._LOGGER, level="ERROR"):
            self.assertIsNone(await ma.async_setup_monitored_areas(NoHA(), entry))
            stop.assert_awaited_once()
        with patch.object(ma, "MonitoredAreasRuntime", side_effect=RuntimeError("constructor")), \
             self.assertLogs(ma._LOGGER, level="ERROR"):
            self.assertIsNone(await ma.async_setup_monitored_areas(NoHA(), entry))
        with patch.object(runtime, "async_stop", new=AsyncMock(side_effect=RuntimeError("stop"))), \
             self.assertLogs(ma._LOGGER, level="ERROR"):
            await ma.async_unload_monitored_areas(runtime)

    async def test_native_hook_contract(self):
        # Compile the actual integration lifecycle functions with narrow HA fakes.
        # This tests the hook wiring, not a full native HA integration import.
        source = (GR / "__init__.py").read_text(encoding="utf-8")
        tree = ast.parse(source)
        hooks = [node for node in tree.body if isinstance(node, ast.AsyncFunctionDef)
                 and node.name in {"async_setup_entry", "async_unload_entry"}]
        self.assertEqual(len(hooks), 2)
        calls = []
        async def forward(entry, platforms):
            calls.append("forward")
        async def unload(entry, platforms):
            calls.append("unload")
            return allowed[0]
        allowed = [True]
        def runtime_data(hass, entry):
            return types.SimpleNamespace(monitored_areas=None)
        ns = {
            "HomeAssistant": object, "GewitterradarConfigEntry": object,
            "CONF_LANGUAGE_INITIALIZED": "language_initialized",
            "CONF_TRACKER_LATITUDE": "lat", "CONF_TRACKER_LONGITUDE": "lon",
            "CONF_TRACKER_NAME": "name", "DEFAULT_TRACKER_NAME": "GR",
            "CONF_LEGACY_IMPORT_VERSION": "legacy", "LEGACY_IMPORT_VERSION": 1,
            "CONF_SHOW_SIDEBAR_PANEL": "sidebar", "PLATFORMS": ("existing",),
            "_options_with_defaults": dict, "_options_after_legacy_import": lambda h, x: dict(x),
            "ConfigEntryError": ValueError, "_async_remove_legacy_sidebar_switch_entity": lambda h: None,
            "GewitterradarRuntimeData": runtime_data, "_async_remove_sidebar_panel": lambda h: calls.append("sidebar"),
            "async_setup_monitored_areas": ma.async_setup_monitored_areas,
            "async_unload_monitored_areas": ma.async_unload_monitored_areas,
        }
        exec(compile(ast.Module(body=hooks, type_ignores=[]), str(GR / "__init__.py"), "exec"), ns)
        hass = types.SimpleNamespace(config_entries=types.SimpleNamespace(
            async_forward_entry_setups=forward, async_unload_platforms=unload))
        for enabled in (False, True):
            entry = types.SimpleNamespace(data={"lat": 1, "lon": 2, "name": "GR", "legacy": 1},
                options={"language_initialized": True, "sidebar": False,
                         config.CONF_MONITORED_AREAS_ENABLED: enabled})
            self.assertTrue(await ns["async_setup_entry"](hass, entry))
            self.assertEqual(entry.runtime_data.monitored_areas is not None, enabled)
            runtime = entry.runtime_data.monitored_areas
            allowed[0] = False
            self.assertFalse(await ns["async_unload_entry"](hass, entry))
            self.assertIs(entry.runtime_data.monitored_areas, runtime)
            allowed[0] = True
            self.assertTrue(await ns["async_unload_entry"](hass, entry))
            self.assertIsNone(entry.runtime_data.monitored_areas)
        with patch.object(ma, "MonitoredAreasRuntime", side_effect=RuntimeError("injected")), \
             self.assertLogs(ma._LOGGER, level="ERROR"):
            self.assertTrue(await ns["async_setup_entry"](hass, entry))
            self.assertIsNone(entry.runtime_data.monitored_areas)
        self.assertEqual(calls.count("forward"), 3)


if __name__ == "__main__":
    unittest.main(verbosity=2)

"""V4.14.6: protect legacy storage and explicitly gate MA SQLite opt-in.

Standard-library checks exercise the pure feature flag and assert integration/UI
wiring without importing Home Assistant's runtime or triggering any mutation.
"""
import ast
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "gewitterradar"


class MAOptInContracts(unittest.TestCase):
    def test_feature_flag_rejects_non_boolean_truthy(self):
        ns = {}
        tree = ast.parse((INTEGRATION / "monitored_areas/config.py").read_text())
        exec(compile(tree, "config.py", "exec"), ns)
        enabled = ns["is_enabled"]
        for value in (False, None, "true", 1, [], {}):
            with self.subTest(value=value):
                self.assertFalse(enabled({"monitored_areas_enabled": value}))
        self.assertTrue(enabled({"monitored_areas_enabled": True}))

    def test_native_integration_options_require_explicit_checkbox(self):
        src = (INTEGRATION / "config_flow.py").read_text()
        self.assertIn("CONF_MONITORED_AREAS_ENABLED", src)
        self.assertIn("vol.Optional(CONF_MONITORED_AREAS_ENABLED, default=False): bool", src)
        self.assertIn("user_input.get(CONF_MONITORED_AREAS_ENABLED, False)", src)
        for file in ("strings.json", "translations/de.json", "translations/en.json"):
            options = json.loads((INTEGRATION / file).read_text())["options"]["step"]["init"]
            self.assertIn("monitored_areas_enabled", options["data"])
            self.assertIn("Local To-do", options["description"])
        startup = (INTEGRATION / "monitored_areas/__init__.py").read_text()
        self.assertIn("if not is_enabled(entry.options)", startup)

    def test_legacy_is_authority_until_server_verified_cutover(self):
        controls = (ROOT / "frontend/modules/ui/controls.js").read_text()
        port = (ROOT / "frontend/modules/monitored-areas/location-port.js").read_text()
        wizard = (ROOT / "frontend/modules/monitored-areas/migration-wizard.js").read_text()
        manager = (ROOT / "frontend/modules/monitored-areas/location-manager.js").read_text()
        self.assertIn("await port.reconcileMode()", controls)
        self.assertIn("this._maSavedMode !== 'db_active'", controls)
        self.assertIn("if (maPort?.mode==='db_active')", controls)
        self.assertIn("const entityId = v407SavedTodoEntity()", controls)
        self.assertIn("serverMode===\"db_active\"", port)
        self.assertIn("result?.mode!==\"db_active\"", port)
        self.assertIn("migrate:loaded && enabled && mode==='migration_pending'", controls)
        self.assertIn("migrationButton.hidden", manager)
        self.assertIn("const result=await call(\"migration_finalize_commit\"", wizard)
        self.assertIn("!checkbox.checked", wizard)
        self.assertIn("explicit_final:true", wizard)
        self.assertIn("preview.invalid", wizard)

    def test_no_implicit_migration_or_direct_todo_delete_in_manager(self):
        manager = (ROOT / "frontend/modules/monitored-areas/location-manager.js").read_text()
        controls = (ROOT / "frontend/modules/ui/controls.js").read_text()
        self.assertNotIn("migration_finalize_commit", manager)
        self.assertNotIn("todo.remove_item", manager)
        self.assertNotIn("innerHTML", manager)
        self.assertIn("if (!sameProfile()) throw new Error('MA_PROFILE_CHANGED')", controls)


if __name__ == "__main__":
    unittest.main()

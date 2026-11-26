"""V4.14.5 DEV: optional MA module must be discoverable without activation.

Pure standard-library regression gate; no Home Assistant installation required.
"""
from __future__ import annotations

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "frontend"
MIRROR = ROOT / "custom_components" / "gewitterradar" / "frontend"


class MonitoredAreasFrontendRegistrationTests(unittest.TestCase):
    def test_mirrored_frontend_artifacts_match(self):
        for path in (
            "gewitterradar.js",
            "panel.js",
            "modules/ui/settings-vault-view.js",
            "module-manifest.js",
            "version.js",
            "assets/gewitterradar-runtime-manifest.json",
            "modules/monitored-areas/index.js",
            "modules/monitored-areas/location-manager.js",
            "modules/ui/controls.js",
        ):
            with self.subTest(path=path):
                self.assertEqual((FRONTEND / path).read_bytes(), (MIRROR / path).read_bytes())

    def test_optional_registration_does_not_activate_ha_runtime(self):
        main = (FRONTEND / "gewitterradar.js").read_text(encoding="utf-8")
        module = (FRONTEND / "modules/monitored-areas/index.js").read_text(encoding="utf-8")
        self.assertIn("let monitoredAreas = null;", main)
        self.assertIn("monitoredAreas = await gewitterradarImport('./modules/monitored-areas/index.js');", main)
        self.assertIn("Optional Monitored Areas registration unavailable", main)
        self.assertIn("({ initializeMonitoredAreas } = monitoredAreas || {});", main)
        self.assertIn("card._config?.monitored_areas_enabled !== true", main)
        self.assertIn("slot.runtime = initializeMonitoredAreas(card, true);", main)
        self.assertNotIn("optional.initializeMonitoredAreas(card, true)", main)
        self.assertIn("registerModule(MODULE_META);", module)
        self.assertIn("if (enabled !== true) return null;", module)
        self.assertIn("if (typeof initializeMonitoredAreas !== 'function') return;", main)

    def test_location_manager_is_discoverable_but_opt_in_writes_are_guarded(self):
        manager = (FRONTEND / "modules/monitored-areas/location-manager.js").read_text(encoding="utf-8")
        controls = (FRONTEND / "modules/ui/controls.js").read_text(encoding="utf-8")
        self.assertIn("export function openLocationManager(", manager)
        self.assertIn("Standorte verwalten", manager)
        self.assertIn("gr-ma-manage-action", controls)
        self.assertIn("openLocationManager(this,{", controls)
        self.assertIn("this._config?.monitored_areas_enabled === true", controls)
        self.assertIn("port?.mode !== 'db_active'", controls)
        self.assertIn("this._map.flyTo([position.latitude,position.longitude]", controls)
        self.assertNotIn("callWS(", manager)
        self.assertNotIn("migration_commit", manager)
        self.assertNotIn("innerHTML", manager)

    def test_manifest_versions_and_module_identity(self):
        expected = (FRONTEND / "module-manifest.js").read_text(encoding="utf-8")
        version = (FRONTEND / "version.js").read_text(encoding="utf-8")
        runtime = json.loads((FRONTEND / "assets/gewitterradar-runtime-manifest.json").read_text(encoding="utf-8"))
        integration = json.loads((ROOT / "custom_components/gewitterradar/manifest.json").read_text(encoding="utf-8"))
        self.assertIn('"id": "monitored-areas.lifecycle"', expected)
        self.assertIn('"optional": true', expected)
        ma = [item for item in runtime["modules"] if item["id"] == "monitored-areas.lifecycle"]
        self.assertEqual(len(ma), 1)
        self.assertTrue(ma[0]["optional"])
        self.assertEqual(len(runtime["modules"]), 38)
        self.assertEqual(len({item["id"] for item in runtime["modules"]}), 38)
        self.assertEqual(runtime["productVersion"], "4.14.5")
        self.assertEqual(runtime["runtimeRevision"], "4145r1")
        self.assertIn('version:"4.14.5"', version)
        self.assertEqual(integration["version"], "0.25.191")
        # DRA checks this stronger BUILD_VERSION marker before integration/frontend labels.
        build = (ROOT / "custom_components/gewitterradar/build_info.py").read_text(encoding="utf-8")
        import re
        version_match = re.search(r'^BUILD_VERSION\s*=\s*"([^"]+)"', build, re.MULTILINE)
        self.assertIsNotNone(version_match)
        self.assertEqual(version_match.group(1), runtime["productVersion"])
        self.assertIn(f'version:"{version_match.group(1)}"', version)
        panel = (FRONTEND / "panel.js").read_text(encoding="utf-8")
        const = (ROOT / "custom_components/gewitterradar/const.py").read_text(encoding="utf-8")
        self.assertIn("version.js?v=4145r1", panel)
        self.assertIn("/gewitterradar/panel.js?v=4145r1", const)
        vault = (FRONTEND / "modules/ui/settings-vault-view.js").read_text(encoding="utf-8")
        self.assertIn("from '../../version.js?v=4145r1'", vault)
        self.assertNotIn("version.js?v=4141r1", vault)


if __name__ == "__main__":
    unittest.main()

"""V4.14.4 DEV: optional MA module must be discoverable without activation.

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
        ):
            with self.subTest(path=path):
                self.assertEqual((FRONTEND / path).read_bytes(), (MIRROR / path).read_bytes())

    def test_optional_registration_does_not_activate_ha_runtime(self):
        main = (FRONTEND / "gewitterradar.js").read_text(encoding="utf-8")
        module = (FRONTEND / "modules/monitored-areas/index.js").read_text(encoding="utf-8")
        self.assertIn("const monitoredAreas = await gewitterradarImport('./modules/monitored-areas/index.js');", main)
        self.assertIn("({ initializeMonitoredAreas } = monitoredAreas);", main)
        self.assertIn("card._config?.monitored_areas_enabled !== true", main)
        self.assertIn("slot.runtime = initializeMonitoredAreas(card, true);", main)
        self.assertNotIn("optional.initializeMonitoredAreas(card, true)", main)
        self.assertIn("registerModule(MODULE_META);", module)
        self.assertIn("if (enabled !== true) return null;", module)
        self.assertNotIn("initializeMonitoredAreas(", main.split("const monitoredAreas =", 1)[1].split("} catch (error)", 1)[0])

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
        self.assertEqual(runtime["productVersion"], "4.14.4")
        self.assertEqual(runtime["runtimeRevision"], "4144r1")
        self.assertIn('version:"4.14.4"', version)
        self.assertEqual(integration["version"], "0.25.190")
        panel = (FRONTEND / "panel.js").read_text(encoding="utf-8")
        const = (ROOT / "custom_components/gewitterradar/const.py").read_text(encoding="utf-8")
        self.assertIn("version.js?v=4144r1", panel)
        self.assertIn("/gewitterradar/panel.js?v=4144r1", const)
        vault = (FRONTEND / "modules/ui/settings-vault-view.js").read_text(encoding="utf-8")
        self.assertIn("from '../../version.js?v=4144r1'", vault)
        self.assertNotIn("version.js?v=4141r1", vault)


if __name__ == "__main__":
    unittest.main()

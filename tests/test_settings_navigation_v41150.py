"""Regressionsprüfungen für das horizontale Gewitterradar-Einstellungsmenü."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
FRONTENDS = [
    ROOT / "frontend",
    ROOT / "dashboard" / "dist",
    ROOT / "custom_components" / "gewitterradar" / "frontend",
]


class HorizontalSettingsV41150Tests(unittest.TestCase):
    def test_all_delivery_copies_identical(self):
        for relative in ("modules/ui/controls.js", "version.js", "module-manifest.js", "assets/gewitterradar-runtime-manifest.json", "gewitterradar.js"):
            contents = [(directory / relative).read_bytes() for directory in FRONTENDS]
            self.assertTrue(all(content == contents[0] for content in contents), relative)

    def test_module_section_is_collected_after_opening(self):
        text = (FRONTENDS[0] / "modules/ui/controls.js").read_text()
        self.assertIn("const refreshNavigationSections=()=>", text)
        self.assertIn("openSettings();\n        refreshNavigationSections();", text)
        self.assertIn("navRoot.querySelectorAll(':scope > .gr-horizontal-item')", text)
        self.assertIn("let navSections=[];", text)

    def test_slow_motion_is_synchronized_and_scrollbar_locked(self):
        text = (FRONTENDS[0] / "modules/ui/controls.js").read_text()
        self.assertIn("Langsam:760", text)
        self.assertIn("const resizeDuration=duration;", text)
        self.assertIn("navBody.style.setProperty('overflow-y','hidden','important')", text)
        self.assertIn("navBody.style.removeProperty('overflow-y')", text)
        self.assertIn("Keep the exact animated end height.", text)
        self.assertIn("settingsDialog?.style.removeProperty('height'); // Restore natural size when opening", text)
        self.assertIn("page.style.padding=bodyPadding.paddingTop", text)
        self.assertIn("gr-horizontal-transition > .gr-horizontal-slide-page > .gr-horizontal-root", text)
        self.assertIn("oldContent.setAttribute('aria-hidden','true')", text)
        self.assertIn("clonedSelects[index].value=select.value", text)
        self.assertIn("content-visibility:hidden!important", text)
        self.assertIn("const scaleStart=before/after", text)
        self.assertIn("const contentStart=after/before", text)
        self.assertNotIn("settingsDialog.animate([{height:", text)
        self.assertIn("pane.dataset.grSettling='1'", text)
        self.assertIn("requestAnimationFrame(()=>requestAnimationFrame(dissolve))", text)
        self.assertIn("crossfade.finished.then(cleanup,cleanup)", text)
        self.assertIn("settingsBackdrop?.classList.remove('gr-horizontal-motion-active')", text)

    def test_version_footer_anchored_to_dialog_and_current_build_month(self):
        skeleton = (FRONTENDS[0] / "modules/ui/skeleton.js").read_text()
        self.assertIn("const displayedBuildMonth=buildMonthMatch", skeleton)
        self.assertIn("${displayedBuildMonth} · V${CARD_DISPLAY_VERSION}", skeleton)
        self.assertEqual(skeleton.count('class="settings-footer-version" title="Kartenversion"'), 1)
        self.assertIn('            </div>\n            <div class="settings-signature-wrap"', skeleton)
        self.assertIn("2026-10-12", (FRONTENDS[0] / "version.js").read_text())

    def test_runtime_manifest_is_current_and_complete(self):
        version = (FRONTENDS[0] / "version.js").read_text()
        runtime = json.loads((FRONTENDS[0] / "assets/gewitterradar-runtime-manifest.json").read_text())
        manifest = (FRONTENDS[0] / "module-manifest.js").read_text()
        self.assertIn('version:"4.11.58"', version)
        self.assertEqual(runtime["productVersion"], "4.11.58")
        self.assertEqual(runtime["runtimeRevision"], "41158r1")
        self.assertEqual(runtime["moduleSetId"], "E411-58A1")
        self.assertEqual(len(runtime["modules"]), 31)
        by_id = {item["id"]: item["version"] for item in runtime["modules"]}
        self.assertEqual(by_id["ui.controls"], "1.1.18")
        self.assertEqual(by_id["ui.skeleton"], "1.1.22")
        self.assertEqual(by_id["core.manifest"], "1.2.119")
        self.assertIn('"id": "ui.controls",\n    "version": "1.1.18"', manifest)


if __name__ == "__main__":
    unittest.main()

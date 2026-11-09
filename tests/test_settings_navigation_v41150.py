"""Regressionsprüfungen der gemeinsamen klassischen/animierten Menüarchitektur."""
import json
import re
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
        text = (FRONTENDS[0] / "modules/ui/controls.js").read_text(encoding="utf-8")
        self.assertIn("const refreshNavigationSections=()=>", text)
        self.assertIn("openSettings();\n        refreshNavigationSections();", text)
        self.assertIn("renderNavigationList(navRoot,SETTINGS_MENU_TREE)", text)
        self.assertIn("navSections=menuEntries.map(entry=>this.shadow.getElementById(entry.id)).filter(Boolean)", text)
        self.assertIn("renderNavigationList(this.shadow.querySelector('[data-settings-diagnostic-menu]'),SETTINGS_MENU_TREE.at(-1).children)", text)
        self.assertIn("let navSections=[];", text)

    def test_slow_motion_is_synchronized_and_scrollbar_locked(self):
        text = (FRONTENDS[0] / "modules/ui/controls.js").read_text(encoding="utf-8")
        self.assertIn("Langsam:760", text)
        self.assertIn("const resizeDuration=duration;", text)
        self.assertIn("navBody.style.setProperty('overflow-y','hidden','important')", text)
        self.assertIn("navBody.style.removeProperty('overflow-y')", text)
        self.assertIn("settingsDialog.style.height=after+'px'", text)
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

    def test_selectable_classic_modern_menu(self):
        text=(FRONTENDS[0] / "modules/ui/controls.js").read_text(encoding="utf-8")
        self.assertIn("const menuStyleKey='gr-settings-menu-style'", text)
        self.assertIn("selectedMenuStyle='classic'", text)
        self.assertIn("localStorage.setItem(menuStyleKey,selectedMenuStyle)", text)
        self.assertIn("settingsOpen?.setAttribute('data-menu-style',selectedMenuStyle)", text)
        self.assertIn("const effectsSection=this.shadow.getElementById('settings-aura-section')",text)
        self.assertIn("effectsControls?.append(menuStyleRow,speedRow,referenceZoomChoice.row)",text)
        self.assertIn("Zoomstufe nach Standortwechsel",text)
        self.assertIn("referenceZoomChoices",text)
        self.assertIn("speedRow.hidden=!modern",text)
        self.assertIn("dropdown.className='language-dropdown gr-menu-choice-dropdown'",text)
        self.assertIn('#card-root #settings-open-horizontal {display:none!important}', text)
        self.assertIn('#card-root #settings-open .gear-welcome.gear-modern {display:none!important}', text)
        self.assertIn('#card-root #settings-open[data-menu-style="modern"] .gear-welcome.gear-classic {display:none!important}', text)
        self.assertIn('#card-root #settings-open[data-menu-style="modern"] .gear-welcome.gear-modern {display:block!important', text)

    def test_android_location_scroll_protection(self):
        text=(FRONTENDS[0] / "modules/ui/controls.js").read_text(encoding="utf-8")
        self.assertIn("locationDropdown.style.setProperty('touch-action','pan-y','important')",text)
        self.assertIn("locationListTouching || performance.now()<locationListScrollGuard",text)
        self.assertIn("const previousScroll=alreadyOpen ? locationDropdown.scrollTop : 0",text)
        self.assertIn("locationDropdown.scrollTop=previousScroll",text)

    def test_reference_place_camera_flight(self):
        source=(FRONTENDS[0] / "modules/location/radii-map.js").read_text(encoding="utf-8")
        self.assertIn("map.flyTo(latLng,zoom,{animate:true,duration})",source)
        self.assertIn("const optionChanged = this._mapReferenceOption !== reference.option",source)
        self.assertIn("if(!atTarget)",source)

    def test_saved_place_flight_handoff(self):
        controls=(FRONTENDS[0] / "modules/ui/controls.js").read_text(encoding="utf-8")
        location=(FRONTENDS[0] / "modules/location/radii-map.js").read_text(encoding="utf-8")
        self.assertIn("this._referenceFlightHandoff={",controls)
        self.assertIn("phase:'service',until:Date.now()+12000",controls)
        self.assertIn("handoff.phase='flying'",controls)
        self.assertIn("this._focusReferenceStormRadius?.(reference)",controls)
        self.assertIn("geo.reference.handoff.flight",controls)
        self.assertIn("if(held)",location)
        self.assertIn("geo.reference.handoff.deferred",location)

    def test_version_footer_anchored_to_dialog_and_current_build_month(self):
        skeleton = (FRONTENDS[0] / "modules/ui/skeleton.js").read_text(encoding="utf-8")
        self.assertIn("const displayedBuildMonth=buildMonthMatch", skeleton)
        self.assertIn("const releaseMetadata=deps.APPLICATION_META", skeleton)
        self.assertIn('<span>${displayedBuildMonth} · V${releaseMetadata.version}</span><span>Modulsatz-ID: ${releaseMetadata.moduleSetId}</span>', skeleton)
        self.assertEqual(skeleton.count('class="settings-footer-version" title="Kartenversion"'), 1)
        self.assertIn('            </div>\n            <div class="settings-signature-wrap"', skeleton)
        self.assertIn("2026-", (FRONTENDS[0] / "version.js").read_text(encoding="utf-8"))

    def test_runtime_manifest_is_current_and_complete(self):
        version = (FRONTENDS[0] / "version.js").read_text(encoding="utf-8")
        runtime = json.loads((FRONTENDS[0] / "assets/gewitterradar-runtime-manifest.json").read_text(encoding="utf-8"))
        manifest = (FRONTENDS[0] / "module-manifest.js").read_text(encoding="utf-8")
        self.assertIn('version:"' + runtime["productVersion"] + '"', version)
        self.assertIn('runtimeRevision:"' + runtime["runtimeRevision"] + '"', version)
        self.assertIn('moduleSetId:"' + runtime["moduleSetId"] + '"', version)
        expected = json.loads(re.search(
            r"EXPECTED_MODULES=Object\.freeze\((\[[\s\S]+?\])\.map", manifest
        ).group(1))
        self.assertEqual(len(runtime["modules"]), len(expected))
        by_id = {item["id"]: item["version"] for item in runtime["modules"]}
        self.assertEqual(len(by_id), len(expected))
        self.assertEqual(by_id, {item["id"]: item["version"] for item in expected})
        for module_id, relative in [("ui.controls", "modules/ui/controls.js"), ("ui.skeleton", "modules/ui/skeleton.js")]:
            source = (FRONTENDS[0] / relative).read_text(encoding="utf-8")
            metadata = re.search(r"const\s+MODULE_META\s*=\s*Object\.freeze\(\{([\s\S]*?)\}\)", source).group(1)
            declared_version = re.search(r'''["']?version["']?\s*:\s*["']([^"']+)["']''', metadata).group(1)
            self.assertEqual(by_id[module_id], declared_version)
        self.assertEqual(by_id["core.manifest"], next(x["version"] for x in runtime["modules"] if x["id"] == "core.manifest"))
        self.assertIn('"id": "ui.controls",\n    "version": "' + by_id["ui.controls"] + '"', manifest)


if __name__ == "__main__":
    unittest.main()

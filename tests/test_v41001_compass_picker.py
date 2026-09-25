"""Compass-picker regression carried into modular V4.10.02."""
from pathlib import Path
import base64
import re

ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "frontend"
PICKER_DIR = FRONTEND / "modules" / "fullscreen"

PICKER_MODULES = (
    "compass-picker-chevron-left-brass.js",
    "compass-picker-chevron-right-brass.js",
    "compass-picker-chevron-left-silver.js",
    "compass-picker-chevron-right-silver.js",
)


def _decode_lossless_webp_module(path: Path) -> bytes:
    text = path.read_text(encoding="utf-8")
    match = re.fullmatch(r'export default "data:image/webp;base64,([A-Za-z0-9+/=]+)";\n?', text)
    assert match, f"{path.name} must remain a picker-local data URL module"
    data = base64.b64decode(match.group(1), validate=True)
    assert data[:4] == b"RIFF"
    assert data[8:12] == b"WEBP"
    assert data[12:16] == b"VP8L", f"{path.name} must remain lossless WebP"
    assert data[20] == 0x2F
    packed = int.from_bytes(data[21:25], "little")
    width = (packed & 0x3FFF) + 1
    height = ((packed >> 14) & 0x3FFF) + 1
    assert (width, height) == (104, 104), f"{path.name} must remain exact 2x Retina for 52px UI"
    return data


def test_v41001_compass_picker_contract():
    main = (FRONTEND / "gewitterradar.js").read_text(encoding="utf-8")
    source = "\n".join(
        path.read_text(encoding="utf-8")
        for path in sorted(FRONTEND.rglob("*.js"))
    )
    map_display = (PICKER_DIR / "map-display.js").read_text(encoding="utf-8")

    assert "const CARD_VERSION = '4.10.02';" in main
    assert "V4.10.02-MODULAR-DEV-R10-2026-09-25" in main
    assert "const GEWITTERRADAR_MODULE_CACHE = '41002r10';" in main

    # Preserve the established picker behaviour.
    for marker in (
        "compass-picker-shell-v41001",
        "data-compass-picker-close",
        "ABOUT_CLOSE_IMAGE",
        "border:1px solid #c9a050",
        "this._stepCompassDesign(-1);",
        "this._stepCompassDesign(1);",
        "this._persistCompassDesign(next.id);",
        "Math.hypot(dx,dy) < 6",
        "event.type === 'pointerup' && !moved",
        "event.type === 'touchend' && !moved",
        "compass-picker-close:focus-visible",
        "outline:0!important",
        "-webkit-appearance:none",
        'data-chevron-material="silver"',
        "querySelectorAll('[data-compass-picker-prev]')",
        "querySelectorAll('[data-compass-picker-next]')",
    ):
        assert marker in source

    # Picker-only contract: four local Retina modules are imported only by map-display.
    imports = (
        'import COMPASS_PICKER_LEFT_BRASS from "./compass-picker-chevron-left-brass.js?v=41002r10";',
        'import COMPASS_PICKER_RIGHT_BRASS from "./compass-picker-chevron-right-brass.js?v=41002r10";',
        'import COMPASS_PICKER_LEFT_SILVER from "./compass-picker-chevron-left-silver.js?v=41002r10";',
        'import COMPASS_PICKER_RIGHT_SILVER from "./compass-picker-chevron-right-silver.js?v=41002r10";',
    )
    for marker in imports:
        assert marker in map_display
    assert "Picker-only Retina assets. Other menu/accordion/UI chevrons intentionally remain untouched." in map_display

    for module_name in PICKER_MODULES:
        path = PICKER_DIR / module_name
        assert path.is_file()
        data = _decode_lossless_webp_module(path)
        assert len(data) < 15_000, f"{module_name} should stay storage-optimised"
        references = [
            js_path
            for js_path in FRONTEND.rglob("*.js")
            if js_path.name != module_name and module_name in js_path.read_text(encoding="utf-8")
        ]
        assert references == [PICKER_DIR / "map-display.js"], (
            f"{module_name} must only be referenced by the compass picker"
        )

    # Compass uses only the silver pair; brass stays available for the analogous Medallion picker.
    assert 'data-chevron-material="brass"' not in map_display
    for marker in (
        "medallion-picker-shell-v41002",
        "data-medallion-picker-close",
        "data-medallion-picker-index",
        "COMPASS_PICKER_LEFT_BRASS",
        "COMPASS_PICKER_RIGHT_BRASS",
        "this._stepMedallionDesign(-1)",
        "this._stepMedallionDesign(1)",
        "gewitterradar:v41002:medallion-design",
    ):
        assert marker in map_display

    # Superseded picker implementations must not return unnoticed.
    assert "compass-picker-gold-prev" not in source
    assert "compass-picker-gold-next" not in source
    assert "-hires.svg" not in source


def test_v41002_superseded_runtime_svg_assets_removed():
    for asset in (
        "gewitterradar-chevron-left-brass-runtime.svg",
        "gewitterradar-chevron-right-brass-runtime.svg",
        "gewitterradar-chevron-left-silver-runtime.svg",
        "gewitterradar-chevron-right-silver-runtime.svg",
    ):
        assert not (FRONTEND / "assets" / asset).exists(), (
            "superseded compass-picker runtime SVG assets must stay removed"
        )

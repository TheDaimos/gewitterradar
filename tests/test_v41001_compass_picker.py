"""Compass-picker regression carried into modular V4.10.02."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "frontend"


def test_v41001_compass_picker_contract():
    main = (FRONTEND / "gewitterradar.js").read_text(encoding="utf-8")
    source = "\n".join(
        path.read_text(encoding="utf-8")
        for path in sorted(FRONTEND.rglob("*.js"))
    )

    assert "const CARD_VERSION = '4.10.02';" in main
    assert "V4.10.02-MODULAR-DEV-2026-09-21" in main

    # Preserve the established V4.10.01 picker behaviour while allowing
    # the V4.10.02 Hi-Res Chevron material comparison to replace the old
    # inline gold SVG arrows.
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
    ):
        assert marker in source

    # V4.10.02 comparison contract: brass on top, aged silver underneath.
    for marker in (
        'data-chevron-material="brass"',
        'data-chevron-material="silver"',
        "gewitterradar-chevron-left-brass-hires.svg",
        "gewitterradar-chevron-right-brass-hires.svg",
        "gewitterradar-chevron-left-silver-hires.svg",
        "gewitterradar-chevron-right-silver-hires.svg",
        "querySelectorAll('[data-compass-picker-prev]')",
        "querySelectorAll('[data-compass-picker-next]')",
    ):
        assert marker in source

    # Runtime assets must exist in the canonical frontend source.
    for asset in (
        "gewitterradar-chevron-left-brass-hires.svg",
        "gewitterradar-chevron-right-brass-hires.svg",
        "gewitterradar-chevron-left-silver-hires.svg",
        "gewitterradar-chevron-right-silver-hires.svg",
    ):
        assert (FRONTEND / "assets" / asset).is_file()

    # The superseded inline-arrow implementation must not return unnoticed.
    assert "compass-picker-gold-prev" not in source
    assert "compass-picker-gold-next" not in source

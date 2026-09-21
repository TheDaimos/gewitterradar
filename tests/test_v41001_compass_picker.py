"""Regression contract for the V4.10.01 compass picker."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRONTEND_PATHS = (
    ROOT / "frontend" / "gewitterradar.js",
    ROOT / "dashboard" / "dist" / "gewitterradar.js",
    ROOT / "custom_components" / "gewitterradar" / "frontend" / "gewitterradar.js",
)


def test_v41001_frontend_delivery_is_byte_identical() -> None:
    """All product delivery paths must ship exactly the same frontend."""
    payloads = [path.read_bytes() for path in FRONTEND_PATHS]
    assert payloads[0] == payloads[1] == payloads[2]


def test_v41001_compass_picker_contract() -> None:
    """Protect the first V4.10 compass-picker interaction contract."""
    source = FRONTEND_PATHS[0].read_text(encoding="utf-8")

    assert "const CARD_VERSION = '4.10.01';" in source
    assert "V4.10.01-DEV-2026-09-21" in source

    # Premium picker: existing Hi-Res close asset, gold dialog frame and chevrons.
    assert "compass-picker-shell-v41001" in source
    assert 'data-compass-picker-close' in source
    assert 'src="' + ABOUT_CLOSE_IMAGE + '"' in source
    assert "border:1px solid #c9a050" in source
    assert "compass-picker-gold-prev" in source
    assert "compass-picker-gold-next" in source

    # Live cyclic selection keeps using the established persistence path.
    assert "this._stepCompassDesign(-1);" in source
    assert "this._stepCompassDesign(1);" in source
    assert "this._persistCompassDesign(next.id);" in source

    # Fullscreen tap and drag must remain distinct on pointer and touch paths.
    assert "Math.hypot(dx,dy) < 6" in source
    assert "event.type === 'pointerup' && !moved" in source
    assert "event.type === 'touchend' && !moved" in source

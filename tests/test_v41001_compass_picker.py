"""V4.10.01 compass-picker regression carried into modular V4.10.02."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];FRONTEND=ROOT/"frontend"
def test_v41001_compass_picker_contract():
 main=(FRONTEND/"gewitterradar.js").read_text(encoding="utf-8")
 source="\n".join(path.read_text(encoding="utf-8") for path in sorted(FRONTEND.rglob("*.js")))
 assert "const CARD_VERSION = '4.10.02';" in main
 assert "V4.10.02-MODULAR-DEV-2026-09-21" in main
 for marker in ("compass-picker-shell-v41001","data-compass-picker-close","ABOUT_CLOSE_IMAGE","border:1px solid #c9a050","compass-picker-gold-prev","compass-picker-gold-next","this._stepCompassDesign(-1);","this._stepCompassDesign(1);","this._persistCompassDesign(next.id);","Math.hypot(dx,dy) < 6","event.type === 'pointerup' && !moved","event.type === 'touchend' && !moved","compass-picker-close:focus-visible","outline:0!important","-webkit-appearance:none"):assert marker in source

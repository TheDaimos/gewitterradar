#!/usr/bin/env python3
"""Prepare accepted 4.13.7 DEV for V4.13 FINAL without changing feature logic.
Run on the isolated release candidate; build and CI must verify generated mirrors.
"""
from pathlib import Path
from datetime import date
import hashlib, json, re
ROOT=Path(__file__).resolve().parents[1]
OLD_REV="4137r1"; NEW_REV="4137r2"
OLD_BUILD="V4.13.7-DEV-2026-11-24"
NEW_BUILD="V4.13-FINAL-2026-11-25"
OLD_DISPLAY="V4.13.7 DEV"; NEW_DISPLAY="V4.13 FINAL"
OLD_SET="E413-7A1"; NEW_SET="E413-7A2"
OLD_HA="0.25.185"; NEW_HA="0.25.186"

def replace_exact(path,changes):
    p=ROOT/path
    s=p.read_text(encoding="utf-8")
    for old,new in changes.items():
        if s.count(old)<1:
            raise RuntimeError(f"{path}: missing required identity {old!r}")
        s=s.replace(old,new)
    p.write_text(s,encoding="utf-8")

replace_exact("frontend/version.js",{OLD_DISPLAY:NEW_DISPLAY,OLD_BUILD:NEW_BUILD,OLD_REV:NEW_REV,OLD_SET:NEW_SET,
    'integrationVersion:"'+OLD_HA+'"':'integrationVersion:"'+NEW_HA+'"'})
replace_exact("frontend/assets/gewitterradar-runtime-manifest.json",
    {OLD_DISPLAY:NEW_DISPLAY,OLD_BUILD:NEW_BUILD,OLD_REV:NEW_REV,OLD_SET:NEW_SET})
replace_exact("custom_components/gewitterradar/dra-deployment-provenance.json",
    {OLD_BUILD:NEW_BUILD,OLD_REV:NEW_REV,OLD_SET:NEW_SET})
replace_exact("custom_components/gewitterradar/manifest.json",
    {'"version": "'+OLD_HA+'"':'"version": "'+NEW_HA+'"'})
replace_exact("custom_components/gewitterradar/const.py",
    {'panel.js?v='+OLD_REV:'panel.js?v='+NEW_REV})
for p in (ROOT/"frontend").rglob("*"):
    if not p.is_file() or p.suffix not in {".js",".json",".html",".css"}:continue
    if p.name in {"version.js","gewitterradar-runtime-manifest.json"}:continue
    try:s=p.read_text(encoding="utf-8")
    except UnicodeDecodeError:continue
    if OLD_REV in s:p.write_text(s.replace(OLD_REV,NEW_REV),encoding="utf-8")

p=ROOT/"frontend/assets.json"
assets=json.loads(p.read_text(encoding="utf-8"))
raw=(ROOT/"frontend/assets/gewitterradar-runtime-manifest.json").read_bytes()
matching=[a for a in assets if a.get("file")=="assets/gewitterradar-runtime-manifest.json"]
assert len(matching)==1
matching[0]["sha256"]=hashlib.sha256(raw).hexdigest()
matching[0]["sizeBytes"]=len(raw)
p.write_text(json.dumps(assets,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

# The active 4.13 developer branch already includes a strict 4.11/4.12/4.13 FINAL identity guard.
# Preserve it; never replace the canonical check with a weaker historical exception.
build_guard=(ROOT/"scripts/build-frontend.mjs").read_text(encoding="utf-8")
assert "const finalSeries={'4.11.249':'4.11','4.12.15':'4.12','4.13.7':'4.13'}" in build_guard
assert "identityIsDev||identityIsFinal" in build_guard
assert "Canonical release identity mismatch" in build_guard
v=(ROOT/"frontend/version.js").read_text()
assert 'version:"4.13.7"' in v and 'displayVersion:"V4.13 FINAL"' in v
assert 'runtimeRevision:"4137r2"' in v and 'moduleSetId:"E413-7A2"' in v
assert json.loads((ROOT/"custom_components/gewitterradar/manifest.json").read_text())["version"]==NEW_HA
print("PREPARED: V4.13 FINAL / product 4.13.7 / HA 0.25.186, strict identity, asset inventory")

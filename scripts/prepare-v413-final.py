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

p=ROOT/"scripts/build-frontend.mjs"
s=p.read_text(encoding="utf-8")
needle="  const identityIsFinal=release.version==='4.11.249'"
if needle not in s:raise RuntimeError("Unrecognized build-frontend identity section")
if "identityIs413Final" in s:raise RuntimeError("V4.13 FINAL guard already exists; avoid double application")
lines=s.splitlines(keepends=True)
identity=[i for i,l in enumerate(lines) if "const identityIsFinal=release.version==='4.11.249'" in l]
assert len(identity)==1
idx=identity[0]
lines.insert(idx+1, "  const identityIs412Final=release.version==='4.12.15'&&release.displayVersion==='V4.12 FINAL'&&/^V4\\.12-FINAL-\\d{4}-\\d\\d-\\d\\d$/.test(release.build);\n"
    if not any("identityIs412Final" in l for l in lines) else "")
lines=[line for line in lines if line]
idx=[i for i,l in enumerate(lines) if "const identityIsFinal=release.version==='4.11.249'" in l][0]
# Insert the new guard immediately after historical guards.
position=idx+2 if any("const identityIs412Final" in l for l in lines[idx+1:idx+3]) else idx+1
lines.insert(position,
    "  const identityIs413Final=release.version==='4.13.7'&&release.displayVersion==='V4.13 FINAL'&&/^V4\\.13-FINAL-\\d{4}-\\d\\d-\\d\\d$/.test(release.build);\n")
s="".join(lines)
s=s.replace("identityIsDev||identityIsFinal||identityIs412Final)", "identityIsDev||identityIsFinal||identityIs412Final||identityIs413Final)")
s=s.replace("identityIsDev||identityIsFinal)", "identityIsDev||identityIsFinal||identityIs412Final||identityIs413Final)")
assert "identityIs413Final)||!revision" in s
p.write_text(s,encoding="utf-8")
v=(ROOT/"frontend/version.js").read_text()
assert 'version:"4.13.7"' in v and 'displayVersion:"V4.13 FINAL"' in v
assert 'runtimeRevision:"4137r2"' in v and 'moduleSetId:"E413-7A2"' in v
assert json.loads((ROOT/"custom_components/gewitterradar/manifest.json").read_text())["version"]==NEW_HA
print("PREPARED: V4.13 FINAL / product 4.13.7 / HA 0.25.186, strict identity, asset inventory")

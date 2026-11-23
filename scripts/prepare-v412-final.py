#!/usr/bin/env python3
"""Promote the accepted 4.12.15 DEV source to a fresh stable V4.12 FINAL identity.
Only release metadata/cache keys are changed; weather, Eye/Aura and legend logic remain untouched.
Run on the freeze candidate only; regenerate mirrors using scripts/build-frontend.mjs.
"""
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]
OLD_REV="41215r1"
NEW_REV="41215r2"
OLD_BUILD="V4.12.15-DEV-2026-11-23"
NEW_BUILD="V4.12-FINAL-2026-11-23"
OLD_DISPLAY="V4.12.15 DEV"
NEW_DISPLAY="V4.12 FINAL"
OLD_SET="E412-15A1"
NEW_SET="E412-15A2"

def replace_exact(path:str,substitutions:dict[str,str])->None:
    target=ROOT/path
    content=target.read_text(encoding="utf-8")
    for original,new in substitutions.items():
        if original not in content:
            raise RuntimeError(f"{path}: expected {original!r} not found")
        content=content.replace(original,new)
    target.write_text(content,encoding="utf-8")

replace_exact("frontend/version.js",{
    OLD_DISPLAY:NEW_DISPLAY, OLD_BUILD:NEW_BUILD, OLD_REV:NEW_REV,OLD_SET:NEW_SET,
    'integrationVersion:"0.25.176"':'integrationVersion:"0.25.177"',
})
replace_exact("frontend/assets/gewitterradar-runtime-manifest.json",{
    OLD_DISPLAY:NEW_DISPLAY,OLD_BUILD:NEW_BUILD,OLD_REV:NEW_REV,OLD_SET:NEW_SET,
})
replace_exact("custom_components/gewitterradar/dra-deployment-provenance.json",{
    OLD_BUILD:NEW_BUILD,OLD_REV:NEW_REV,OLD_SET:NEW_SET,
})
replace_exact("custom_components/gewitterradar/manifest.json",{
    '"version": "0.25.176"':'"version": "0.25.177"',
})
replace_exact("custom_components/gewitterradar/const.py",{
    "panel.js?v="+OLD_REV:"panel.js?v="+NEW_REV,
})

for target in (ROOT/"frontend").rglob("*"):
    if not target.is_file() or target.suffix not in {".js",".json",".html",".css"}:
        continue
    if target.name in {"version.js","gewitterradar-runtime-manifest.json"}:
        continue
    try: content=target.read_text(encoding="utf-8")
    except UnicodeDecodeError: continue
    if OLD_REV in content:
        target.write_text(content.replace(OLD_REV,NEW_REV),encoding="utf-8")

path=ROOT/"scripts/build-frontend.mjs"
content=path.read_text(encoding="utf-8")
needle="const identityIsFinal=release.version==='4.11.249'&&release.displayVersion==='V4.11 FINAL'&&/^V4\\.11-FINAL-\\d{4}-\\d\\d-\\d\\d$/.test(release.build);"
replacement=needle+"\n  const identityIs412Final=release.version==='4.12.15'&&release.displayVersion==='V4.12 FINAL'&&/^V4\\.12-FINAL-\\d{4}-\\d\\d-\\d\\d$/.test(release.build);"
if needle not in content: raise RuntimeError("build-frontend: final release identity contract changed")
content=content.replace(needle,replacement)
content=content.replace("if(!(identityIsDev||identityIsFinal)||!revision", "if(!(identityIsDev||identityIsFinal||identityIs412Final)||!revision")
path.write_text(content,encoding="utf-8")

release=(ROOT/"frontend/version.js").read_text()
assert 'displayVersion:"V4.12 FINAL"' in release and 'runtimeRevision:"41215r2"' in release
assert json.loads((ROOT/"custom_components/gewitterradar/manifest.json").read_text())["version"]=="0.25.177"
print("V4.12 FINAL canonical identity prepared without changes to Eye/Aura logic")

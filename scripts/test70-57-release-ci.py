#!/usr/bin/env python3
"""TEST70-57 event-driven OPERA release; no approvals or provider policy changes."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys

OLD = "4.11.135"
NEW = "4.11.136"
substitutions = {
    "frontend/version.js": [("4.11.135", "4.11.136"), ("411135r1","411136r1"), ("E411-135A1","E411-136A1"), ("0.25.44","0.25.45")],
    "frontend/gewitterradar.js": [("4.11.135","4.11.136"),("411135r1","411136r1")],
    "frontend/module-manifest.js": [("411135r1","411136r1")],
    "frontend/panel.js": [("411135r1","411136r1")],
    "frontend/modules/weather/consumer-client.js": [("411135r1","411136r1")],
    "frontend/assets/gewitterradar-runtime-manifest.json": [("4.11.135","4.11.136"),("411135r1","411136r1"),("E411-135A1","E411-136A1")],
    "custom_components/gewitterradar/build_info.py": [("4.11.135","4.11.136")],
    "custom_components/gewitterradar/const.py": [("411135r1","411136r1")],
    "custom_components/gewitterradar/manifest.json": [("0.25.44","0.25.45")],
    "custom_components/gewitterradar/dra-deployment-provenance.json": [("4.11.135","4.11.136"),("411135r1","411136r1"),("E411-135A1","E411-136A1")],
    "scripts/build-frontend.mjs": [("4.11.135","4.11.136"),("411135r1","411136r1"),("E411-135A1","E411-136A1")],
}
pending = {}
for filename, replacements in substitutions.items():
    path = Path(filename)
    content = path.read_text(encoding="utf-8")
    for before, after in replacements:
        if before not in content:
            raise SystemExit("Missing expected version marker: "+filename+" : "+before)
        content = content.replace(before,after)
    pending[path] = content

for path, content in pending.items():
    path.write_text(content,encoding="utf-8")

runtime = Path("frontend/assets/gewitterradar-runtime-manifest.json")
data = json.loads(runtime.read_text())
assert data["productVersion"] == NEW and data["runtimeRevision"] == "411136r1" and data["moduleSetId"] == "E411-136A1"
inventory = Path("frontend/assets.json")
entries = json.loads(inventory.read_text())
matches = [e for e in entries if e.get("file") == "assets/gewitterradar-runtime-manifest.json"]
assert len(matches) == 1
raw = runtime.read_bytes()
matches[0]["sha256"] = hashlib.sha256(raw).hexdigest()
matches[0]["sizeBytes"] = len(raw)
inventory.write_text(json.dumps(entries,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

assert "tile_retry_scheduled" in Path("frontend/modules/weather/p7-010/opera-diagnostic-tile.js").read_text()
assert "authRejected=true;for(const pending of controllers)pending.abort()" in Path("frontend/modules/weather/p7-010/opera-diagnostic-tile.js").read_text()
subprocess.run(["node","scripts/build-frontend.mjs"],check=True)
subprocess.run(["sha256sum","-c","SHA256SUMS_FRONTEND.txt"],check=True,stdout=subprocess.DEVNULL)
subprocess.run(["node","--test","tests/test_gr_opera_wr_authoritative_freshness.mjs","tests/test70-opera-auth-preflight.test.mjs","tests/wl02-coverage-contract.test.mjs","tests/wl02-raster-geometry.test.mjs","tests/test70-54-selective-raster-retry.test.mjs","tests/test70-55-unified-precipitation.test.mjs","tests/test70-57-opera-runtime-v2.test.mjs"],check=True)
for folder in ("custom_components/gewitterradar/frontend","dashboard/dist"):
    for rel in ("version.js","assets/gewitterradar-runtime-manifest.json"):
        assert (Path(folder)/rel).read_bytes() == (Path("frontend")/rel).read_bytes(), (folder,rel)
assert json.loads(Path("custom_components/gewitterradar/manifest.json").read_text())["version"]=="0.25.45"
print("TEST70_GR_RELEASE_READY=1")

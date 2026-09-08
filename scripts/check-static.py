"""Local static gates; intentionally not a substitute for HA runtime fixtures."""
import ast
import json
from pathlib import Path
import runpy
import tempfile
import yaml

ROOT = Path(__file__).resolve().parents[1]
for directory in ("custom_components", "tests", "scripts"):
    for file in (ROOT / directory).rglob("*.py"):
        ast.parse(file.read_text(encoding="utf-8"), filename=str(file))
for directory in ("custom_components", "frontend"):
    for file in (ROOT / directory).rglob("*.json"):
        json.loads(file.read_text(encoding="utf-8"))
for file in [*(ROOT / ".github" / "workflows").glob("*.yml"), ROOT / "home-assistant/app_gewitterradar_pkg.yaml", ROOT / "dashboard/dist/app_gewitterradar_pkg.yaml"]:
    yaml.safe_load(file.read_text(encoding="utf-8"))
count = 0
for file in ("test_manifest.py", "test_hacs_packaging.py"):
    module = runpy.run_path(str(ROOT / "tests" / file))
    for name, function in module.items():
        if not name.startswith("test_"):
            continue
        if "tmp_path" in function.__code__.co_varnames:
            with tempfile.TemporaryDirectory(prefix="gewitterradar-static-") as temporary:
                function(Path(temporary))
        else:
            function()
        count += 1
print(f"PASS: Python/JSON/YAML syntax and {count} existing static metadata/package assertions (not HA runtime tests).")

#!/usr/bin/env python3
"""Stage and verify the standard HACS Integration repository payload."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "custom_components" / "gewitterradar"
REQUIRED = {
    "__init__.py",
    "brand/icon.png",
    "brand/icon@2x.png",
    "config_flow.py",
    "const.py",
    "manifest.json",
    "number.py",
    "select.py",
    "strings.json",
    "switch.py",
    "translations/de.json",
    "translations/en.json",
}
REQUIRED |= {"frontend/gewitterradar.js", "frontend/locales/about-locales.js"} | {
    "frontend/" + asset["file"]
    for asset in json.loads((ROOT / "frontend" / "assets.json").read_text(encoding="utf-8"))
}
FORBIDDEN_SUFFIXES = {".patch", ".pyc"}


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify(stage_root: Path) -> dict[str, str]:
    target = stage_root / "custom_components" / "gewitterradar"
    if target.exists():
        shutil.rmtree(target)
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(SOURCE, target, ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))

    integrations = [path for path in target.parent.iterdir() if path.is_dir()]
    if integrations != [target]:
        raise RuntimeError(f"Expected exactly one staged integration: {integrations}")

    files = {
        path.relative_to(target).as_posix(): path
        for path in target.rglob("*")
        if path.is_file()
    }
    missing = sorted(REQUIRED - files.keys())
    if missing:
        raise RuntimeError(f"Missing integration files: {missing}")
    forbidden = sorted(
        name for name, path in files.items() if path.suffix in FORBIDDEN_SUFFIXES
    )
    if forbidden:
        raise RuntimeError(f"Forbidden staged files: {forbidden}")

    manifest = json.loads(files["manifest.json"].read_text(encoding="utf-8"))
    if manifest["domain"] != "gewitterradar" or manifest["version"] != "0.17.0":
        raise RuntimeError("Unexpected integration manifest identity")

    source_hashes = {
        name: digest(SOURCE / name) for name in sorted(files)
    }
    staged_hashes = {name: digest(path) for name, path in sorted(files.items())}
    if staged_hashes != source_hashes:
        raise RuntimeError("Staged integration is not byte-identical to its source")
    return staged_hashes


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--stage", type=Path, help="Keep a staging tree here")
    args = parser.parse_args()
    if args.stage:
        hashes = verify(args.stage.resolve())
    else:
        with tempfile.TemporaryDirectory(prefix="gewitterradar-hacs-") as temporary:
            hashes = verify(Path(temporary))
    print(f"HACS Integration staging verified: {len(hashes)} byte-identical files")


if __name__ == "__main__":
    main()

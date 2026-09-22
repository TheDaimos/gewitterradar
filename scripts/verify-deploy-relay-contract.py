"""Fail-closed Deploy Relay consumer contract for Gewitterradar."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _load_json(name: str) -> dict:
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def _files(root: Path) -> dict[str, bytes]:
    return {
        path.relative_to(root).as_posix(): path.read_bytes()
        for path in root.rglob("*")
        if path.is_file()
    }


def main() -> None:
    manifest = _load_json("deploy-relay.json")
    channel = _load_json("deploy-relay-channel.json")

    assert manifest["schema"] == "deploy-relay.deployment.v1"
    assert manifest["project"] == {"id": "gewitterradar", "name": "Gewitterradar"}
    assert manifest["source"] == {
        "repository": "TheDaimos/gewitterradar",
        "mode": "repository_contents",
    }
    assert manifest["deployment"]["root"] == "/config"
    assert manifest["deployment"]["groups"] == [
        {
            "id": "integration",
            "source": "custom_components/gewitterradar",
            "target": "custom_components/gewitterradar",
            "mode": "replace_directory",
        }
    ]
    assert manifest["lifecycle"]["after_install"] == "home_assistant_restart"
    assert manifest["policy"]["allow_symlinks"] is False

    assert channel == {
        "schema": "deploy-relay.channel.v1",
        "project_id": "gewitterradar",
        "recommended": {
            "channel": "dev",
            "kind": "branch",
            "ref": "deploy/dev",
        },
    }

    source_frontend = ROOT / "frontend"
    deployed_frontend = ROOT / "custom_components" / "gewitterradar" / "frontend"
    source_modules = _files(source_frontend / "modules")
    deployed_modules = _files(deployed_frontend / "modules")

    assert source_modules, "modular source tree is empty"
    assert source_modules.keys() == deployed_modules.keys(), (
        "DRA-managed integration module inventory differs from canonical frontend/modules"
    )
    mismatched = [
        name for name in source_modules if source_modules[name] != deployed_modules[name]
    ]
    assert not mismatched, f"DRA-managed module bytes differ: {mismatched!r}"

    for relative in ("gewitterradar.js", "module-manifest.js", "locales/about-locales.js"):
        assert (deployed_frontend / relative).is_file(), (
            f"DRA-managed integration is missing frontend/{relative}"
        )

    print(
        "Deploy Relay contract OK: full Gewitterradar integration replacement, "
        f"{len(source_modules)} modular files, promoted deploy/dev channel."
    )


if __name__ == "__main__":
    main()

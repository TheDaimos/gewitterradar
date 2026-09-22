"""Fail-closed Deploy Relay consumer contract for Gewitterradar."""

from __future__ import annotations

import argparse
import ast
import hashlib
import json
from pathlib import Path
import shutil
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def _load_json(name: str) -> dict:
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def _files(root: Path) -> dict[str, bytes]:
    return {
        path.relative_to(root).as_posix(): path.read_bytes()
        for path in root.rglob("*")
        if path.is_file()
    }


def _digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def _inventory(root: Path) -> dict[str, str]:
    return {name: _digest(raw) for name, raw in _files(root).items()}


def _diff(source: Path, target: Path) -> dict[str, list[str]]:
    src = _inventory(source)
    dst = _inventory(target)
    names = sorted(set(src) | set(dst))
    result = {"add": [], "change": [], "remove": [], "unchanged": []}
    for name in names:
        if name not in dst:
            result["add"].append(name)
        elif name not in src:
            result["remove"].append(name)
        elif src[name] != dst[name]:
            result["change"].append(name)
        else:
            result["unchanged"].append(name)
    return result


def _verify_rollback_source(rollback_root: Path, current_integration: Path) -> None:
    rollback_manifest = json.loads(
        (rollback_root / "deploy-relay.json").read_text(encoding="utf-8")
    )
    assert rollback_manifest["project"]["id"] == "gewitterradar"
    assert rollback_manifest["deployment"]["groups"] == [
        {
            "id": "integration",
            "source": "custom_components/gewitterradar",
            "target": "custom_components/gewitterradar",
            "mode": "replace_directory",
        }
    ]

    rollback_integration = rollback_root / "custom_components" / "gewitterradar"
    assert rollback_integration.is_dir()
    rollback_plan = _diff(rollback_integration, current_integration)
    modular_removals = [
        name for name in rollback_plan["remove"]
        if name.startswith("frontend/modules/")
    ]
    assert modular_removals, (
        "V4.09 rollback must remove V4.10 modular files instead of leaving a mixed tree"
    )
    assert (
        "frontend/gewitterradar.js" in rollback_plan["change"]
        or "frontend/gewitterradar.js" in rollback_plan["unchanged"]
    )

    with tempfile.TemporaryDirectory(prefix="gewitterradar-dra-rollback-") as tmp:
        restored = Path(tmp) / "custom_components" / "gewitterradar"
        shutil.copytree(current_integration, restored)
        shutil.rmtree(restored)
        shutil.copytree(rollback_integration, restored)
        converged = _diff(rollback_integration, restored)
        assert not converged["add"] and not converged["change"] and not converged["remove"]
        assert not (restored / "frontend" / "modules").exists(), (
            "rollback left V4.10 modular files behind"
        )


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

    integration_root = ROOT / "custom_components" / "gewitterradar"
    parser = argparse.ArgumentParser()
    parser.add_argument("--rollback-root", type=Path)
    args = parser.parse_args()
    if args.rollback_root is not None:
        _verify_rollback_source(args.rollback_root.resolve(), integration_root)
    module_rel = "frontend/modules/core/base-context.js"
    module_path = integration_root / module_rel
    assert module_path.is_file(), f"representative module missing: {module_rel}"

    with tempfile.TemporaryDirectory(prefix="gewitterradar-dra-contract-") as tmp:
        target = Path(tmp) / "custom_components" / "gewitterradar"

        # Complete-tree deployment: a clean replace_directory target must converge
        # byte-for-byte to the repository integration tree.
        shutil.copytree(integration_root, target)
        clean = _diff(integration_root, target)
        assert not clean["add"] and not clean["change"] and not clean["remove"]

        # Exactly one stale module must be detected as exactly one change. DRA's
        # engine mutates only non-UNCHANGED preview entries.
        changed_module = target / module_rel
        changed_module.write_bytes(changed_module.read_bytes() + b"\n// stale-module-sentinel\n")
        one_change = _diff(integration_root, target)
        assert one_change["change"] == [module_rel], one_change
        assert not one_change["add"] and not one_change["remove"]

        # A missing module must be an ADD and therefore be restored by the full
        # managed-tree deployment.
        changed_module.write_bytes(module_path.read_bytes())
        changed_module.unlink()
        missing = _diff(integration_root, target)
        assert missing["add"] == [module_rel], missing
        assert not missing["change"] and not missing["remove"]

        # An obsolete/stale file inside the managed subtree must be a REMOVE.
        shutil.copy2(module_path, changed_module)
        stale_rel = "frontend/modules/stale-dra-test-module.js"
        stale_path = target / stale_rel
        stale_path.write_text("// obsolete DRA test module\n", encoding="utf-8")
        stale = _diff(integration_root, target)
        assert stale["remove"] == [stale_rel], stale
        assert not stale["add"] and not stale["change"]

    # Home Assistant serves the DRA-managed frontend with cache headers disabled.
    # This is the consumer-side browser-cache safety contract after a restart.
    init_source = (ROOT / "custom_components" / "gewitterradar" / "__init__.py").read_text(
        encoding="utf-8"
    )
    tree = ast.parse(init_source)
    static_calls = [
        node for node in ast.walk(tree)
        if isinstance(node, ast.Call)
        and isinstance(node.func, ast.Name)
        and node.func.id == "StaticPathConfig"
        and len(node.args) >= 3
        and isinstance(node.args[0], ast.Constant)
        and node.args[0].value == "/gewitterradar"
    ]
    assert len(static_calls) == 1, "expected exactly one /gewitterradar StaticPathConfig"
    cache_arg = static_calls[0].args[2]
    assert isinstance(cache_arg, ast.Constant) and cache_arg.value is False, (
        "Gewitterradar static frontend cache headers must stay disabled"
    )

    print(
        "Deploy Relay contract OK: complete tree, single-module delta, missing/stale "
        f"module detection, rollback convergence, cache-safe static serving, "
        f"{len(source_modules)} modular files and promoted deploy/dev channel."
    )


if __name__ == "__main__":
    main()

"""Deterministic install payloads from a committed DEV tree; no HA/DRA mutation."""
from pathlib import Path
import ast
import hashlib
import io
import json
import re
import subprocess
import sys
import tarfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(sys.argv[1]).resolve()
OUT.mkdir(parents=True, exist_ok=True)

def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT)

assert git("branch", "--show-current").decode().strip() == "deploy/dev"
head = git("rev-parse", "HEAD").decode().strip()
source = git("show", "HEAD:frontend/version.js").decode()
def field(name):
    return re.search(name + r':"([^"]+)"', source).group(1)

version, integration = field("version"), field("integrationVersion")
packages, payloads = {}, {}
for tree, prefix, filename in [
    ("custom_components/gewitterradar", "custom_components/gewitterradar/", f"gewitterradar-{integration}-dev.zip"),
    ("dashboard/dist", "www/gewitterradar/", f"gewitterradar-dashboard-{version}-dev.zip"),
]:
    content = {}
    with tarfile.open(fileobj=io.BytesIO(git("archive", "--format=tar", "HEAD", tree))) as archive:
        for member in archive.getmembers():
            if not member.isfile():
                continue
            assert member.name.startswith(tree + "/") and ".." not in Path(member.name).parts
            assert "__pycache__" not in member.name and not member.name.endswith(".pyc")
            data = archive.extractfile(member).read()
            assert not data.startswith(b"version https://git-lfs.github.com/spec/")
            content[prefix + member.name.removeprefix(tree + "/")] = data
            if member.name.endswith(".py"):
                ast.parse(data.decode("utf-8"))
    target = OUT / filename
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name, data in sorted(content.items()):
            entry = zipfile.ZipInfo(name, (1980, 1, 1, 0, 0, 0))
            entry.compress_type, entry.create_system, entry.external_attr = zipfile.ZIP_DEFLATED, 3, 0o100644 << 16
            archive.writestr(entry, data)
    with zipfile.ZipFile(target) as archive:
        assert archive.testzip() is None
        assert all(archive.read(name) == data for name, data in content.items())
    packages[filename] = {"sha256": hashlib.sha256(target.read_bytes()).hexdigest(), "files": len(content), "bytes": target.stat().st_size}
    payloads[tree] = content

ha, dashboard = payloads["custom_components/gewitterradar"], payloads["dashboard/dist"]
front = "custom_components/gewitterradar/frontend/"
assert json.loads(ha["custom_components/gewitterradar/manifest.json"])["version"] == integration
assert f'BUILD_VERSION = "{version}"'.encode() in ha["custom_components/gewitterradar/build_info.py"]
runtime = json.loads(ha[front + "assets/gewitterradar-runtime-manifest.json"])
assert runtime["productVersion"] == version and runtime["runtimeRevision"] == field("runtimeRevision") and runtime["moduleSetId"] == field("moduleSetId")
for name, data in ha.items():
    if name.startswith(front):
        assert dashboard["www/gewitterradar/" + name.removeprefix(front)] == data

metadata = {"schema": "gewitterradar.dev-install-payload.v1", "commit": head, "version": version,
            "integrationVersion": integration, "runtimeRevision": field("runtimeRevision"), "moduleSetId": field("moduleSetId"),
            "source": {"repository": "TheDaimos/gewitterradar", "type": "branch", "ref": "deploy/dev"},
            "packages": packages, "frontendParityFiles": sum(n.startswith(front) for n in ha),
            "realInstallation": "not_performed", "draConfigurationChanged": False}
(OUT / "deployment.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
names = [*packages, "deployment.json"]
(OUT / "SHA256SUMS.txt").write_text("".join(hashlib.sha256((OUT/n).read_bytes()).hexdigest() + "  " + n + "\n" for n in names), encoding="utf-8", newline="\n")
print(json.dumps(metadata, ensure_ascii=False, indent=2))

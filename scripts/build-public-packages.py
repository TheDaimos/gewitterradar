"""Build deterministic public integration and dashboard ZIPs for a GitHub release."""
from pathlib import Path
import hashlib
import io
import json
import subprocess
import sys
import tarfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(sys.argv[1]).resolve()
VERSION = sys.argv[2] if len(sys.argv) > 2 else "4.11.3"
OUT.mkdir(parents=True, exist_ok=True)


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT)


head = git("rev-parse", "HEAD").decode().strip()
packages = {}
payloads = {}
for tree, prefix, filename in [
    ("custom_components/gewitterradar", "custom_components/gewitterradar/", f"gewitterradar-{VERSION}-ha.zip"),
    ("dashboard/dist", "www/gewitterradar/", f"gewitterradar-dashboard-{VERSION}.zip"),
]:
    content = {}
    with tarfile.open(fileobj=io.BytesIO(git("archive", "--format=tar", "HEAD", tree))) as source:
        for member in source.getmembers():
            if not member.isfile():
                continue
            assert member.name.startswith(tree + "/") and ".." not in Path(member.name).parts
            data = source.extractfile(member).read()
            assert not data.startswith(b"version https://git-lfs.github.com/spec/")
            content[prefix + member.name.removeprefix(tree + "/")] = data
    target = OUT / filename
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name, data in sorted(content.items()):
            entry = zipfile.ZipInfo(name, (1980, 1, 1, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, data)
    with zipfile.ZipFile(target) as archive:
        assert archive.testzip() is None
        assert all(archive.read(name) == data for name, data in content.items())
    packages[filename] = {"sha256": hashlib.sha256(target.read_bytes()).hexdigest(), "files": len(content)}
    payloads[tree] = content

frontend = "custom_components/gewitterradar/frontend/"
for name, data in payloads["custom_components/gewitterradar"].items():
    if name.startswith(frontend):
        assert payloads["dashboard/dist"]["www/gewitterradar/" + name.removeprefix(frontend)] == data

metadata = {"release": VERSION, "commit": head, "packages": packages,
            "frontendParity": "verified", "haRuntimeTest": "not_performed"}
(OUT / "deployment.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
(OUT / "SHA256SUMS.txt").write_text("".join(
    hashlib.sha256((OUT / name).read_bytes()).hexdigest() + "  " + name + "\n"
    for name in [*packages, "deployment.json"]), encoding="utf-8")
print(json.dumps(metadata, indent=2))

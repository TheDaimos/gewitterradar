#!/usr/bin/env python3
from __future__ import annotations

import hashlib
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "frontend" / "gewitterradar.js"
INTEGRATION = ROOT / "custom_components" / "gewitterradar" / "frontend" / "gewitterradar.js"
DASHBOARD = ROOT / "dashboard" / "dist" / "gewitterradar.js"
INPUT_SHA256 = "c9f54f5fcea55c7ad62d06767890deccda132c28cd258f1115c322ebe897c8b4"


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def replace_once(card: str, label: str, needle: str, replacement: str) -> str:
    count = card.count(needle)
    if count != 1:
        raise RuntimeError(f"V4.08.06 {label}: expected exactly one anchor, found {count}")
    return card.replace(needle, replacement, 1)


card = SOURCE.read_text(encoding="utf-8")
input_hash = sha256_text(card)
if input_hash != INPUT_SHA256:
    raise RuntimeError(f"V4.08.06 builder refuses unknown V4.08.05 input: {input_hash}")

card = replace_once(card, "header", "/* Gewitterradar Card V4.08.05 TEST", "/* Gewitterradar Card V4.08.06 TEST")
card = replace_once(card, "CARD_VERSION", "const CARD_VERSION = '4.08.05';", "const CARD_VERSION = '4.08.06';")
card = replace_once(card, "CARD_DISPLAY_VERSION", "const CARD_DISPLAY_VERSION = '4.08.05';", "const CARD_DISPLAY_VERSION = '4.08.06';")
card = replace_once(
    card,
    "GEWITTERRADAR_BUILD",
    "const GEWITTERRADAR_BUILD = 'V4.08.05-SESSION-CONTROL-POLISH-2026-09-17';",
    "const GEWITTERRADAR_BUILD = 'V4.08.06-SESSION-FIELD-FRAME-2026-09-17';",
)
card = replace_once(card, "weather lab version", "version:'4.08.05',seed:40802", "version:'4.08.06',seed:40802")
card = replace_once(card, "weather lab title", "Wetter-Labor · V4.08.05", "Wetter-Labor · V4.08.06")

card = replace_once(
    card,
    "session selector comment",
    """          /* V4.08.05 – Sitzungszeit wie die Premium-Auswahl der Ortssuche:\n             gemeinsamer Metallrahmen, kompakte aktive Hälfte, kein separater\n             Kleinbutton um das Unendlich-Zeichen. Das Unicode-Zeichen ist bis\n             zur späteren Hi-Res-Grafik nur ein Platzhalter. */""",
    """          /* V4.08.06 – Sitzungszeit im Radien-Block mit demselben schlichten\n             Feldrahmen wie die übrigen Radius-Werte. Die innere Auswahl und\n             das Unicode-Unendlich-Zeichen bleiben funktional unverändert. */""",
)

card = replace_once(
    card,
    "session selector outer frame",
    """          .settings-cluster-session-selector {\n            width:156px;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) 46px;gap:4px;\n            align-items:stretch;padding:3px;border:1px solid transparent;border-radius:12px;\n            background:linear-gradient(180deg,rgba(9,24,36,.90),rgba(3,11,18,.92)) padding-box,\n                       linear-gradient(120deg,rgba(117,82,28,.74),rgba(234,197,109,.66) 22%,rgba(90,148,196,.45) 52%,rgba(220,178,92,.57) 80%,rgba(96,67,21,.70)) border-box;\n            box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 5px 14px rgba(0,0,0,.20),0 0 10px rgba(207,160,69,.05);\n          }""",
    """          .settings-cluster-session-selector {\n            width:156px;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) 46px;gap:4px;\n            align-items:stretch;padding:3px;border:1px solid rgba(255,255,255,.12);border-radius:9px;\n            background:rgba(255,255,255,.035);box-shadow:none;\n          }""",
)

required = [
    "const CARD_VERSION = '4.08.06';",
    "V4.08.06-SESSION-FIELD-FRAME-2026-09-17",
    "border:1px solid rgba(255,255,255,.12);border-radius:9px;",
    "background:rgba(255,255,255,.035);box-shadow:none;",
    "transform:scale(1.25);transform-origin:center;",
    "settings-cluster-session-infinity-glyph",
]
for marker in required:
    if marker not in card:
        raise RuntimeError(f"V4.08.06 missing required marker: {marker}")

for path in (SOURCE, INTEGRATION, DASHBOARD):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(card, encoding="utf-8")

print("V4.08.06 frontend SHA256", sha256_text(card))
print("V4.08.06 session field frame applied")

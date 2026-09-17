#!/usr/bin/env python3
from __future__ import annotations

import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "frontend" / "gewitterradar.js"
INTEGRATION = ROOT / "custom_components" / "gewitterradar" / "frontend" / "gewitterradar.js"
DASHBOARD = ROOT / "dashboard" / "dist" / "gewitterradar.js"
INPUT_SHA256 = "1b892f43f8db6aa927e507e288a252610b9d1ffa6574a473b97bac1f89574554"


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def replace_once(card: str, label: str, needle: str, replacement: str) -> str:
    count = card.count(needle)
    if count != 1:
        raise RuntimeError(f"V4.08.07 {label}: expected exactly one anchor, found {count}")
    return card.replace(needle, replacement, 1)


card = SOURCE.read_text(encoding="utf-8")
input_hash = sha256_text(card)
if input_hash != INPUT_SHA256:
    raise RuntimeError(f"V4.08.07 builder refuses unknown V4.08.06 input: {input_hash}")

card = replace_once(card, "header", "/* Gewitterradar Card V4.08.06 TEST", "/* Gewitterradar Card V4.08.07 TEST")
card = replace_once(card, "CARD_VERSION", "const CARD_VERSION = '4.08.06';", "const CARD_VERSION = '4.08.07';")
card = replace_once(card, "CARD_DISPLAY_VERSION", "const CARD_DISPLAY_VERSION = '4.08.06';", "const CARD_DISPLAY_VERSION = '4.08.07';")
card = replace_once(card, "GEWITTERRADAR_BUILD", "const GEWITTERRADAR_BUILD = 'V4.08.06-SESSION-FIELD-FRAME-2026-09-17';", "const GEWITTERRADAR_BUILD = 'V4.08.07-HELP-FRAME-2026-09-17';")
card = replace_once(card, "weather lab version", "version:'4.08.06',seed:40802", "version:'4.08.07',seed:40802")
card = replace_once(card, "weather lab title", "Wetter-Labor · V4.08.06", "Wetter-Labor · V4.08.07")

old = """          /* V4.08.06 – Sitzungszeit im Radien-Block mit demselben schlichten
             Feldrahmen wie die übrigen Radius-Werte. Die innere Auswahl und
             das Unicode-Unendlich-Zeichen bleiben funktional unverändert. */
          .settings-cluster-session-selector {
            width:156px;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) 46px;gap:4px;
            align-items:stretch;padding:3px;border:1px solid rgba(255,255,255,.12);border-radius:9px;
            background:rgba(255,255,255,.035);box-shadow:none;
          }"""
new = """          /* V4.08.07 – Sitzungszeit übernimmt exakt die wertigere Einfassung
             der geöffneten Hilfe-&-Hinweise-Akkordeons. Nur der Außenrahmen
             wird veredelt; innere Auswahl und Funktion bleiben unverändert. */
          .settings-cluster-session-selector {
            width:156px;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) 46px;gap:4px;
            align-items:stretch;padding:3px;border:1px solid #c69d4f9c;border-radius:9px;
            background:linear-gradient(110deg,#a4843818,#0b171e70 30%,#15202645);
            box-shadow:inset 0 1px #fff2,0 0 11px #d69a2116;
          }"""
card = replace_once(card, "help frame", old, new)

required = [
    "const CARD_VERSION = '4.08.07';",
    "V4.08.07-HELP-FRAME-2026-09-17",
    "border:1px solid #c69d4f9c;border-radius:9px;",
    "background:linear-gradient(110deg,#a4843818,#0b171e70 30%,#15202645);",
    "box-shadow:inset 0 1px #fff2,0 0 11px #d69a2116;",
    "transform:scale(1.25);transform-origin:center;",
    "settings-cluster-session-infinity-glyph",
    "label += ' ∞';",
    "label += ` · ${Math.ceil(remainingMs / 1000)}s`;",
]
for marker in required:
    if marker not in card:
        raise RuntimeError(f"V4.08.07 missing required marker: {marker}")

for path in (SOURCE, INTEGRATION, DASHBOARD):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(card, encoding="utf-8")

print("V4.08.07 frontend SHA256", sha256_text(card))
print("V4.08.07 help frame applied")

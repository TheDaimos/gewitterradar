#!/usr/bin/env python3
from __future__ import annotations

import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "frontend" / "gewitterradar.js"
INTEGRATION = ROOT / "custom_components" / "gewitterradar" / "frontend" / "gewitterradar.js"
DASHBOARD = ROOT / "dashboard" / "dist" / "gewitterradar.js"
INPUT_SHA256 = "eaacbadf1de52b441dddd9b58b5b7a623c23a66159fac027f5e5bd01aabe1618"


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def replace_once(card: str, label: str, needle: str, replacement: str) -> str:
    count = card.count(needle)
    if count != 1:
        raise RuntimeError(f"V4.08.11 {label}: expected exactly one anchor, found {count}")
    return card.replace(needle, replacement, 1)


card = SOURCE.read_text(encoding="utf-8")
input_hash = sha256_text(card)
if input_hash != INPUT_SHA256:
    raise RuntimeError(f"V4.08.11 builder refuses unknown V4.08.10 input: {input_hash}")

card = replace_once(card, "header", "/* Gewitterradar Card V4.08.10 TEST", "/* Gewitterradar Card V4.08.11 TEST")
card = replace_once(card, "CARD_VERSION", "const CARD_VERSION = '4.08.10';", "const CARD_VERSION = '4.08.11';")
card = replace_once(card, "CARD_DISPLAY_VERSION", "const CARD_DISPLAY_VERSION = '4.08.10';", "const CARD_DISPLAY_VERSION = '4.08.11';")
card = replace_once(card, "build", "const GEWITTERRADAR_BUILD = 'V4.08.10-INFINITY-GFX-2026-09-17';", "const GEWITTERRADAR_BUILD = 'V4.08.11-INFINITY-CONTROL-POLISH-2026-09-17';")
card = replace_once(card, "weather lab version", "version:'4.08.10',seed:40802", "version:'4.08.11',seed:40802")
card = replace_once(card, "weather lab title", "Wetter-Labor · V4.08.10", "Wetter-Labor · V4.08.11")

old_gfx_css = '''          .settings-cluster-session-infinity-gfx {
            display:block;width:34px;height:auto;max-height:25px;object-fit:contain;pointer-events:none;
            filter:drop-shadow(0 2px 3px rgba(0,0,0,.58));
          }
          #header-status { display:inline-flex;align-items:center;gap:4px; }
          .status-infinity-gfx {
            display:inline-block;width:27px;height:auto;max-height:18px;object-fit:contain;vertical-align:middle;pointer-events:none;
            filter:drop-shadow(0 1px 2px rgba(0,0,0,.58));
          }'''
new_gfx_css = '''          .settings-cluster-session-infinity-gfx {
            display:block;width:36px;height:auto;max-height:25px;object-fit:contain;pointer-events:none;
            filter:drop-shadow(0 2px 3px rgba(0,0,0,.58));
          }
          #header-status { display:inline-flex;align-items:center;gap:7px; }
          .status-infinity-gfx {
            display:inline-block;width:30px;height:auto;max-height:20px;object-fit:contain;vertical-align:middle;pointer-events:none;
            filter:drop-shadow(0 1px 2px rgba(0,0,0,.58));
          }'''
card = replace_once(card, "infinity sizes and status spacing", old_gfx_css, new_gfx_css)

css_anchor = "        </style>"
css = '''          /* V4.08.11 – Das Infinity-Asset selbst ist das Bedienelement.
             Kein sichtbarer Kleinbutton / keine Innenkontur. Die vorhandene
             46px breite Klickflaeche bleibt fuer Touch erhalten. */
          .settings-cluster-session-infinite,
          .settings-cluster-session-static-gold.is-infinite .settings-cluster-session-infinite,
          .settings-cluster-session-static-gold:not(.is-infinite) .settings-cluster-session-infinite {
            border-color:transparent!important;
            border-radius:0!important;
            box-shadow:none!important;
          }
          .settings-cluster-session-static-gold:not(.is-infinite) .settings-cluster-session-infinite {
            background:transparent!important;
            opacity:.68!important;
          }
          .settings-cluster-session-static-gold.is-infinite .settings-cluster-session-infinite {
            background:radial-gradient(ellipse at center,rgba(224,173,66,.24) 0%,rgba(204,148,38,.13) 42%,rgba(204,148,38,0) 78%)!important;
            opacity:1!important;
          }
          .settings-cluster-session-infinite:hover,
          .settings-cluster-session-infinite:focus-visible {
            outline:none!important;
            filter:brightness(1.10);
          }
'''
card = replace_once(card, "final infinity control CSS", css_anchor, css + css_anchor)

required = [
    "const CARD_VERSION = '4.08.11';",
    "V4.08.11-INFINITY-CONTROL-POLISH-2026-09-17",
    "const GEWITTERRADAR_INFINITY_GFX = 'data:image/png;base64,",
    "display:block;width:36px;height:auto;max-height:25px",
    "#header-status { display:inline-flex;align-items:center;gap:7px; }",
    "display:inline-block;width:30px;height:auto;max-height:20px",
    "border-color:transparent!important;",
    "border-radius:0!important;",
    "background:radial-gradient(ellipse at center,rgba(224,173,66,.24)",
    "infinityGfx.src = GEWITTERRADAR_INFINITY_GFX;",
    "transform:scale(1.25);transform-origin:center;",
    "max-height:clamp(230px,calc(100dvh - 490px),560px)!important",
]
for marker in required:
    if marker not in card:
        raise RuntimeError(f"V4.08.11 missing required marker: {marker}")

for forbidden in (
    "const CARD_VERSION = '4.08.10';",
    "#header-status { display:inline-flex;align-items:center;gap:4px; }",
    "display:block;width:34px;height:auto;max-height:25px",
    "display:inline-block;width:27px;height:auto;max-height:18px",
):
    if forbidden in card:
        raise RuntimeError(f"V4.08.11 still contains retired marker: {forbidden}")

for path in (SOURCE, INTEGRATION, DASHBOARD):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(card, encoding="utf-8")

print("V4.08.11 frontend SHA256", sha256_text(card))
print("V4.08.11 infinity control polish applied")

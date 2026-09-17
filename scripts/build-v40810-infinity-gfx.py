#!/usr/bin/env python3
from __future__ import annotations

import base64
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "frontend" / "gewitterradar.js"
INTEGRATION = ROOT / "custom_components" / "gewitterradar" / "frontend" / "gewitterradar.js"
DASHBOARD = ROOT / "dashboard" / "dist" / "gewitterradar.js"
INPUT_SHA256 = "2cd4f63aa574571807c20bb41dd1da3d9ca32af1aa13929338aad6115904bcdf"
UI_PNG_SHA256 = "e41966f3645c9a50509af8dc24042e75655327d03fdfcffe2e3520b33dcaf3f6"
UI_PNG_B64 = """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"""


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def replace_once(card: str, label: str, needle: str, replacement: str) -> str:
    count = card.count(needle)
    if count != 1:
        raise RuntimeError(f"V4.08.10 {label}: expected exactly one anchor, found {count}")
    return card.replace(needle, replacement, 1)


png_bytes = base64.b64decode(UI_PNG_B64)
if hashlib.sha256(png_bytes).hexdigest() != UI_PNG_SHA256:
    raise RuntimeError("V4.08.10 embedded infinity UI PNG checksum mismatch")

card = SOURCE.read_text(encoding="utf-8")
input_hash = sha256_text(card)
if input_hash != INPUT_SHA256:
    raise RuntimeError(f"V4.08.10 builder refuses unknown V4.08.09 input: {input_hash}")

card = replace_once(card, "header", "/* Gewitterradar Card V4.08.09 TEST", "/* Gewitterradar Card V4.08.10 TEST")
card = replace_once(card, "CARD_VERSION", "const CARD_VERSION = '4.08.09';", "const CARD_VERSION = '4.08.10';")
card = replace_once(card, "CARD_DISPLAY_VERSION", "const CARD_DISPLAY_VERSION = '4.08.09';", "const CARD_DISPLAY_VERSION = '4.08.10';")
card = replace_once(card, "build", "const GEWITTERRADAR_BUILD = 'V4.08.09-SESSION-STATIC-GOLD-2026-09-17';", "const GEWITTERRADAR_BUILD = 'V4.08.10-INFINITY-GFX-2026-09-17';")
card = replace_once(card, "weather lab version", "version:'4.08.09',seed:40802", "version:'4.08.10',seed:40802")
card = replace_once(card, "weather lab title", "Wetter-Labor · V4.08.09", "Wetter-Labor · V4.08.10")

build_anchor = "  const GEWITTERRADAR_BUILD = 'V4.08.10-INFINITY-GFX-2026-09-17';\n"
data_uri = "data:image/png;base64," + UI_PNG_B64
card = replace_once(card, "infinity gfx constant", build_anchor, build_anchor + f"  const GEWITTERRADAR_INFINITY_GFX = '{data_uri}';\n")

card = replace_once(
    card,
    "menu infinity image",
    '<span class="settings-cluster-session-infinity-glyph" aria-hidden="true">∞</span>',
    '<img class="settings-cluster-session-infinity-gfx" src="${GEWITTERRADAR_INFINITY_GFX}" alt="" aria-hidden="true">',
)

old_css = '''          .settings-cluster-session-infinity-glyph {
            display:block;color:#e8bd58;font-size:23px;font-weight:620;line-height:1;filter:drop-shadow(0 2px 3px rgba(0,0,0,.58));
          }'''
new_css = '''          .settings-cluster-session-infinity-gfx {
            display:block;width:34px;height:auto;max-height:25px;object-fit:contain;pointer-events:none;
            filter:drop-shadow(0 2px 3px rgba(0,0,0,.58));
          }
          #header-status { display:inline-flex;align-items:center;gap:4px; }
          .status-infinity-gfx {
            display:inline-block;width:27px;height:auto;max-height:18px;object-fit:contain;vertical-align:middle;pointer-events:none;
            filter:drop-shadow(0 1px 2px rgba(0,0,0,.58));
          }'''
card = replace_once(card, "infinity gfx CSS", old_css, new_css)

old_timeout = '''          if (timeout === 0) {
            label += ' ∞';
          } else if (this._statusClusterBrowseLastInteraction) {'''
new_timeout = '''          if (timeout === 0) {
            // V4.08.10: Unbegrenzt wird als echtes Grafik-Asset dargestellt.
          } else if (this._statusClusterBrowseLastInteraction) {'''
card = replace_once(card, "status infinity text removal", old_timeout, new_timeout)

old_status_write = '''      statusTextEl.textContent = label;
      statusChip.setAttribute('title',title);'''
new_status_write = '''      const useInfinityGfx = kind === 'cluster' && this._statusClusterBrowseActive && selectedIndex >= 0 && Number(this._statusClusterBrowseTimeoutMs) === 0;
      if (useInfinityGfx) {
        statusTextEl.replaceChildren(document.createTextNode(`${label} `));
        const infinityGfx = document.createElement('img');
        infinityGfx.className = 'status-infinity-gfx';
        infinityGfx.src = GEWITTERRADAR_INFINITY_GFX;
        infinityGfx.alt = '';
        infinityGfx.setAttribute('aria-hidden','true');
        statusTextEl.appendChild(infinityGfx);
      } else {
        statusTextEl.textContent = label;
      }
      statusChip.setAttribute('title',title);'''
card = replace_once(card, "status infinity gfx render", old_status_write, new_status_write)

required = [
    "const CARD_VERSION = '4.08.10';",
    "V4.08.10-INFINITY-GFX-2026-09-17",
    "const GEWITTERRADAR_INFINITY_GFX = 'data:image/png;base64,",
    'settings-cluster-session-infinity-gfx',
    'status-infinity-gfx',
    "infinityGfx.src = GEWITTERRADAR_INFINITY_GFX;",
    "label += ` · ${Math.ceil(remainingMs / 1000)}s`;",
    "transform:scale(1.25);transform-origin:center;",
    "max-height:clamp(230px,calc(100dvh - 490px),560px)!important",
]
for marker in required:
    if marker not in card:
        raise RuntimeError(f"V4.08.10 missing required marker: {marker}")

for forbidden in (
    'settings-cluster-session-infinity-glyph',
    "label += ' ∞';",
):
    if forbidden in card:
        raise RuntimeError(f"V4.08.10 still contains retired infinity marker: {forbidden}")

for path in (SOURCE, INTEGRATION, DASHBOARD):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(card, encoding="utf-8")

print("V4.08.10 frontend SHA256", sha256_text(card))
print("V4.08.10 antique infinity gfx applied")

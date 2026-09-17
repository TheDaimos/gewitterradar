#!/usr/bin/env python3
from __future__ import annotations

import hashlib
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "frontend" / "gewitterradar.js"
INTEGRATION = ROOT / "custom_components" / "gewitterradar" / "frontend" / "gewitterradar.js"
DASHBOARD = ROOT / "dashboard" / "dist" / "gewitterradar.js"
INPUT_SHA256 = "b3ca696dd77e144157986947463c4e4f108f5900ca79fa15d8110bec1d1e704e"


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def replace_once(card: str, label: str, needle: str, replacement: str) -> str:
    count = card.count(needle)
    if count != 1:
        raise RuntimeError(f"V4.08.05 {label}: expected exactly one anchor, found {count}")
    return card.replace(needle, replacement, 1)


card = SOURCE.read_text(encoding="utf-8")
input_hash = sha256_text(card)
if input_hash != INPUT_SHA256:
    raise RuntimeError(f"V4.08.05 builder refuses unknown V4.08.04 input: {input_hash}")

card = replace_once(card, "header", "/* Gewitterradar Card V4.08.04 TEST", "/* Gewitterradar Card V4.08.05 TEST")
card = replace_once(card, "CARD_VERSION", "const CARD_VERSION = '4.08.04';", "const CARD_VERSION = '4.08.05';")
card = replace_once(card, "CARD_DISPLAY_VERSION", "const CARD_DISPLAY_VERSION = '4.08.04';", "const CARD_DISPLAY_VERSION = '4.08.05';")
card = replace_once(
    card,
    "GEWITTERRADAR_BUILD",
    "const GEWITTERRADAR_BUILD = 'V4.08.04-CLUSTER-SESSION-COUNTDOWN-2026-09-17';",
    "const GEWITTERRADAR_BUILD = 'V4.08.05-SESSION-CONTROL-POLISH-2026-09-17';",
)
card = replace_once(card, "weather lab version", "version:'4.08.04',seed:40802", "version:'4.08.05',seed:40802")
card = replace_once(card, "weather lab title", "Wetter-Labor · V4.08.04", "Wetter-Labor · V4.08.05")

# Exactly +25% visual size, while keeping the same layout footprint and center.
card = replace_once(
    card,
    "coordinate target 125 percent",
    ".v407-location-mode-target img { width:37px;height:37px;display:block;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,.60)) saturate(1.04); }",
    ".v407-location-mode-target img { width:37px;height:37px;display:block;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,.60)) saturate(1.04);transform:scale(1.25);transform-origin:center; }",
)

old_row = """                  <div class=\"settings-row settings-radius-main-toggle-row\">\n                    <div class=\"settings-row-label\">\n                      <div>Cluster-Sprung · Sitzungszeit</div>\n                      <div style=\"font-size:.76rem;opacity:.68;margin-top:3px\">5–3600 Sekunden · ∞ = unbegrenzt</div>\n                    </div>\n                    <div style=\"display:flex;align-items:center;gap:6px\">\n                      <input id=\"settings-cluster-jump-seconds\" type=\"number\" min=\"5\" max=\"3600\" step=\"1\" inputmode=\"numeric\" value=\"10\"\n                             aria-label=\"Sitzungszeit des Cluster-Sprungs in Sekunden\"\n                             style=\"width:68px;box-sizing:border-box;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:rgba(0,0,0,.20);color:inherit;padding:6px 7px;text-align:right;font:inherit\">\n                      <span style=\"font-size:.82rem;opacity:.72\">s</span>\n                      <button class=\"settings-radius-step\" id=\"settings-cluster-jump-infinite\" type=\"button\" aria-pressed=\"false\" aria-label=\"Cluster-Sprung unbegrenzt beibehalten\" title=\"Unbegrenzt\">∞</button>\n                    </div>\n                  </div>"""
new_row = """                  <div class=\"settings-row settings-radius-main-toggle-row settings-cluster-session-row\">\n                    <div class=\"settings-row-label\">\n                      <div>Cluster-Sprung · Sitzungszeit</div>\n                      <div style=\"font-size:.76rem;opacity:.68;margin-top:3px\">5–3600 Sekunden · ∞ = unbegrenzt</div>\n                    </div>\n                    <div class=\"settings-cluster-session-selector\" id=\"settings-cluster-jump-selector\" data-mode=\"finite\" role=\"group\" aria-label=\"Sitzungszeit des Cluster-Sprungs\">\n                      <label class=\"settings-cluster-session-mode settings-cluster-session-finite\" id=\"settings-cluster-jump-finite\">\n                        <input id=\"settings-cluster-jump-seconds\" type=\"number\" min=\"5\" max=\"3600\" step=\"1\" inputmode=\"numeric\" value=\"10\" aria-label=\"Sitzungszeit des Cluster-Sprungs in Sekunden\">\n                        <span class=\"settings-cluster-session-unit\">s</span>\n                      </label>\n                      <button class=\"settings-cluster-session-mode settings-cluster-session-infinite\" id=\"settings-cluster-jump-infinite\" type=\"button\" aria-pressed=\"false\" aria-label=\"Cluster-Sprung unbegrenzt beibehalten\" title=\"Unbegrenzt\"><span class=\"settings-cluster-session-infinity-glyph\" aria-hidden=\"true\">∞</span></button>\n                    </div>\n                  </div>"""
card = replace_once(card, "premium session selector row", old_row, new_row)

css_anchor = "        </style>"
css = r"""          /* V4.08.05 – Sitzungszeit wie die Premium-Auswahl der Ortssuche:
             gemeinsamer Metallrahmen, kompakte aktive Hälfte, kein separater
             Kleinbutton um das Unendlich-Zeichen. Das Unicode-Zeichen ist bis
             zur späteren Hi-Res-Grafik nur ein Platzhalter. */
          .settings-cluster-session-selector {
            width:156px;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) 46px;gap:4px;
            align-items:stretch;padding:3px;border:1px solid transparent;border-radius:12px;
            background:linear-gradient(180deg,rgba(9,24,36,.90),rgba(3,11,18,.92)) padding-box,
                       linear-gradient(120deg,rgba(117,82,28,.74),rgba(234,197,109,.66) 22%,rgba(90,148,196,.45) 52%,rgba(220,178,92,.57) 80%,rgba(96,67,21,.70)) border-box;
            box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 5px 14px rgba(0,0,0,.20),0 0 10px rgba(207,160,69,.05);
          }
          .settings-cluster-session-mode {
            min-width:0;min-height:30px;box-sizing:border-box;border:1px solid transparent;border-radius:8px;
            background:transparent;color:#d7e0e8;transition:border-color .15s ease,background .15s ease,color .15s ease,box-shadow .15s ease,opacity .15s ease;
          }
          .settings-cluster-session-finite { display:flex;align-items:center;justify-content:center;gap:3px;padding:2px 5px;cursor:text; }
          .settings-cluster-session-finite input {
            width:55px;height:24px;min-height:24px;box-sizing:border-box;border:0!important;border-radius:5px!important;
            background:transparent!important;color:#edf5fb!important;padding:1px 2px!important;text-align:right;font:760 12px/1.1 inherit!important;
            box-shadow:none!important;outline:none!important;
          }
          .settings-cluster-session-finite input:focus { outline:none!important;box-shadow:none!important; }
          .settings-cluster-session-unit { color:#aebdca;font-size:11px;font-weight:760;line-height:1; }
          .settings-cluster-session-infinite {
            appearance:none;-webkit-appearance:none;display:grid;place-items:center;padding:0;cursor:pointer;font:inherit;
          }
          .settings-cluster-session-infinity-glyph {
            display:block;color:#e8bd58;font-size:23px;font-weight:620;line-height:1;filter:drop-shadow(0 2px 3px rgba(0,0,0,.58));
          }
          .settings-cluster-session-selector:not(.is-infinite) .settings-cluster-session-finite,
          .settings-cluster-session-selector.is-infinite .settings-cluster-session-infinite {
            border-color:#4ba8f3;background:linear-gradient(180deg,rgba(30,86,132,.46),rgba(16,52,82,.40));
            color:#f2f7fb;box-shadow:0 0 0 1px rgba(75,168,243,.18),0 0 11px rgba(51,146,222,.18),inset 0 1px 0 rgba(255,255,255,.05);
          }
          .settings-cluster-session-selector.is-infinite .settings-cluster-session-finite { opacity:.48; }
          .settings-cluster-session-selector:not(.is-infinite) .settings-cluster-session-infinite { opacity:.82; }
          .settings-cluster-session-infinite:hover,.settings-cluster-session-infinite:focus-visible { outline:none;filter:brightness(1.10); }
          @media(max-width:520px) {
            .settings-cluster-session-selector { width:146px;grid-template-columns:minmax(0,1fr) 43px; }
            .settings-cluster-session-finite input { width:51px; }
          }

          /* V4.08.05 – Radien-Akkordeon bleibt am Kopf verankert; nur sein
             Inhalt scrollt, wenn die reale Fensterhoehe nicht ausreicht.
             Die spaeteren Regeln stehen absichtlich am Ende des Stylesheets,
             damit auch die historische Landscape-Ausnahme nicht mehr auf
             max-height:none zurueckfaellt. */
          #settings-radii-section[open] > .settings-radius-list {
            min-height:0;max-height:clamp(230px,calc(100dvh - 490px),560px)!important;
            overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior-y:contain;
            -webkit-overflow-scrolling:touch;touch-action:pan-y;scrollbar-gutter:stable;
            scrollbar-width:thin;scrollbar-color:rgba(205,164,84,.42) transparent;scroll-padding-bottom:12px;
          }
          #settings-radii-section[open] > .settings-radius-list::-webkit-scrollbar { width:7px; }
          #settings-radii-section[open] > .settings-radius-list::-webkit-scrollbar-track { background:transparent; }
          #settings-radii-section[open] > .settings-radius-list::-webkit-scrollbar-thumb { border-radius:999px;background:rgba(205,164,84,.38); }
          @media (orientation:landscape) and (hover:none) and (pointer:coarse) and (max-height:600px) {
            #settings-radii-section[open] > .settings-radius-list {
              max-height:clamp(180px,calc(100dvh - 210px),340px)!important;overflow-y:auto!important;
            }
          }
"""
card = replace_once(card, "V4.08.05 CSS block", css_anchor, css + css_anchor)

card = replace_once(
    card,
    "session selector lookup",
    """      const settingsClusterJumpSeconds = this.shadow.getElementById('settings-cluster-jump-seconds');
      const settingsClusterJumpInfinite = this.shadow.getElementById('settings-cluster-jump-infinite');""",
    """      const settingsClusterJumpSelector = this.shadow.getElementById('settings-cluster-jump-selector');
      const settingsClusterJumpSeconds = this.shadow.getElementById('settings-cluster-jump-seconds');
      const settingsClusterJumpInfinite = this.shadow.getElementById('settings-cluster-jump-infinite');""",
)

card = replace_once(
    card,
    "finite focus mode",
    """      settingsClusterJumpSeconds?.addEventListener('change',applyClusterJumpSeconds);
      settingsClusterJumpSeconds?.addEventListener('keydown',(event) => {""",
    """      settingsClusterJumpSeconds?.addEventListener('focus',() => {
        if (Number(this._statusClusterBrowseTimeoutMs) !== 0) return;
        this._setStatusClusterBrowseTimeoutV40802(this._statusClusterBrowseFiniteTimeoutMs || 10000);
        this._render();
      });
      settingsClusterJumpSeconds?.addEventListener('change',applyClusterJumpSeconds);
      settingsClusterJumpSeconds?.addEventListener('keydown',(event) => {""",
)

old_sync = """      const settingsClusterJumpSeconds = $('settings-cluster-jump-seconds');
      const settingsClusterJumpInfinite = $('settings-cluster-jump-infinite');
      const clusterJumpInfinite = Number(this._statusClusterBrowseTimeoutMs) === 0;
      const clusterJumpFiniteSeconds = Math.round((this._statusClusterBrowseFiniteTimeoutMs || 10000) / 1000);
      if (settingsClusterJumpSeconds && this.shadow.activeElement !== settingsClusterJumpSeconds) {
        settingsClusterJumpSeconds.value = String(clusterJumpFiniteSeconds);
      }
      if (settingsClusterJumpInfinite) {
        settingsClusterJumpInfinite.setAttribute('aria-pressed',clusterJumpInfinite ? 'true' : 'false');
        settingsClusterJumpInfinite.style.color = clusterJumpInfinite ? '#f2c45c' : '';
        settingsClusterJumpInfinite.style.borderColor = clusterJumpInfinite ? 'rgba(242,196,92,.72)' : '';
        settingsClusterJumpInfinite.style.boxShadow = clusterJumpInfinite ? '0 0 9px rgba(242,196,92,.20)' : '';
      }"""
new_sync = """      const settingsClusterJumpSelector = $('settings-cluster-jump-selector');
      const settingsClusterJumpSeconds = $('settings-cluster-jump-seconds');
      const settingsClusterJumpInfinite = $('settings-cluster-jump-infinite');
      const clusterJumpInfinite = Number(this._statusClusterBrowseTimeoutMs) === 0;
      const clusterJumpFiniteSeconds = Math.round((this._statusClusterBrowseFiniteTimeoutMs || 10000) / 1000);
      if (settingsClusterJumpSeconds && this.shadow.activeElement !== settingsClusterJumpSeconds) {
        settingsClusterJumpSeconds.value = String(clusterJumpFiniteSeconds);
      }
      settingsClusterJumpSelector?.classList.toggle('is-infinite',clusterJumpInfinite);
      settingsClusterJumpSelector?.setAttribute('data-mode',clusterJumpInfinite ? 'infinite' : 'finite');
      settingsClusterJumpInfinite?.setAttribute('aria-pressed',clusterJumpInfinite ? 'true' : 'false');"""
card = replace_once(card, "session selector synchronisation", old_sync, new_sync)

card = replace_once(card, "infinity map label", "label += '   ∞';", "label += ' ∞';")
card = replace_once(card, "finite map label", "label += `   ${Math.ceil(remainingMs / 1000)}s`;", "label += ` · ${Math.ceil(remainingMs / 1000)}s`;")

required = [
    "const CARD_VERSION = '4.08.05';",
    "V4.08.05-SESSION-CONTROL-POLISH-2026-09-17",
    "settings-cluster-session-selector",
    "settings-cluster-session-infinity-glyph",
    "label += ' ∞';",
    "label += ` · ${Math.ceil(remainingMs / 1000)}s`;",
    "transform:scale(1.25)",
    "#settings-radii-section[open] > .settings-radius-list",
    "max-height:clamp(230px,calc(100dvh - 490px),560px)!important",
]
for marker in required:
    if marker not in card:
        raise RuntimeError(f"V4.08.05 missing result marker: {marker}")

decl = card.index('const stormRadius = this._currentStormRadius ?? Math.min(this._stormRadiusValue(),observationRadius);')
use = card.index('const inStorm = s.distance != null && s.distance <= stormRadius;')
if decl >= use:
    raise RuntimeError('V4.08.05 runtime guard: stormRadius declaration must stay before cluster policy use')

SOURCE.write_text(card, encoding="utf-8")
shutil.copyfile(SOURCE, INTEGRATION)
shutil.copyfile(SOURCE, DASHBOARD)
print(f"V4.08.05 frontend built: {len(card.encode('utf-8'))} bytes")
print(f"SHA256 {sha256_text(card)}")
print("Polish: premium cluster-session selector, finite middle dot, infinity without dot, radii internal scroll, Lat/Lon target +25%.")

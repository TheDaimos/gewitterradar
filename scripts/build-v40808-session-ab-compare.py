#!/usr/bin/env python3
from __future__ import annotations

import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "frontend" / "gewitterradar.js"
INTEGRATION = ROOT / "custom_components" / "gewitterradar" / "frontend" / "gewitterradar.js"
DASHBOARD = ROOT / "dashboard" / "dist" / "gewitterradar.js"
INPUT_SHA256 = "23f3ff2348c184c9a828b52fcfcabebaa174f7d7d1e8b713a1d95632765dcd6a"


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def replace_once(card: str, label: str, needle: str, replacement: str) -> str:
    count = card.count(needle)
    if count != 1:
        raise RuntimeError(f"V4.08.08 {label}: expected exactly one anchor, found {count}")
    return card.replace(needle, replacement, 1)


card = SOURCE.read_text(encoding="utf-8")
input_hash = sha256_text(card)
if input_hash != INPUT_SHA256:
    raise RuntimeError(f"V4.08.08 builder refuses unknown V4.08.07 input: {input_hash}")

card = replace_once(card, "header", "/* Gewitterradar Card V4.08.07 TEST", "/* Gewitterradar Card V4.08.08 TEST")
card = replace_once(card, "CARD_VERSION", "const CARD_VERSION = '4.08.07';", "const CARD_VERSION = '4.08.08';")
card = replace_once(card, "CARD_DISPLAY_VERSION", "const CARD_DISPLAY_VERSION = '4.08.07';", "const CARD_DISPLAY_VERSION = '4.08.08';")
card = replace_once(card, "build", "const GEWITTERRADAR_BUILD = 'V4.08.07-HELP-FRAME-2026-09-17';", "const GEWITTERRADAR_BUILD = 'V4.08.08-SESSION-AB-COMPARE-2026-09-17';")
card = replace_once(card, "weather lab version", "version:'4.08.07',seed:40802", "version:'4.08.08',seed:40802")
card = replace_once(card, "weather lab title", "Wetter-Labor · V4.08.07", "Wetter-Labor · V4.08.08")

old_row = '''                  <div class="settings-row settings-radius-main-toggle-row settings-cluster-session-row">
                    <div class="settings-row-label">
                      <div>Cluster-Sprung · Sitzungszeit</div>
                      <div style="font-size:.76rem;opacity:.68;margin-top:3px">5–3600 Sekunden · ∞ = unbegrenzt</div>
                    </div>
                    <div class="settings-cluster-session-selector" id="settings-cluster-jump-selector" data-mode="finite" role="group" aria-label="Sitzungszeit des Cluster-Sprungs">
                      <label class="settings-cluster-session-mode settings-cluster-session-finite" id="settings-cluster-jump-finite">
                        <input id="settings-cluster-jump-seconds" type="number" min="5" max="3600" step="1" inputmode="numeric" value="10" aria-label="Sitzungszeit des Cluster-Sprungs in Sekunden">
                        <span class="settings-cluster-session-unit">s</span>
                      </label>
                      <button class="settings-cluster-session-mode settings-cluster-session-infinite" id="settings-cluster-jump-infinite" type="button" aria-pressed="false" aria-label="Cluster-Sprung unbegrenzt beibehalten" title="Unbegrenzt"><span class="settings-cluster-session-infinity-glyph" aria-hidden="true">∞</span></button>
                    </div>
                  </div>'''
new_row = '''                  <div class="settings-row settings-radius-main-toggle-row settings-cluster-session-row settings-cluster-session-ab-row">
                    <div class="settings-row-label">
                      <div>Cluster-Sprung · Sitzungszeit</div>
                      <div style="font-size:.76rem;opacity:.68;margin-top:3px">A/B-Vergleich · 5–3600 Sekunden · ∞ = unbegrenzt</div>
                    </div>
                    <div class="settings-cluster-session-ab-stack">
                      <div class="settings-cluster-session-ab-line"><span class="settings-cluster-session-ab-badge">A</span><div class="settings-cluster-session-selector settings-cluster-session-variant-a" id="settings-cluster-jump-selector-a" data-mode="finite" role="group" aria-label="Variante A der Sitzungszeit">
                        <label class="settings-cluster-session-mode settings-cluster-session-finite" id="settings-cluster-jump-finite-a"><input id="settings-cluster-jump-seconds-a" type="number" min="5" max="3600" step="1" inputmode="numeric" value="10" aria-label="Sitzungszeit Variante A in Sekunden"><span class="settings-cluster-session-unit">s</span></label>
                        <button class="settings-cluster-session-mode settings-cluster-session-infinite" id="settings-cluster-jump-infinite-a" type="button" aria-pressed="false" aria-label="Variante A unbegrenzt" title="Unbegrenzt"><span class="settings-cluster-session-infinity-glyph" aria-hidden="true">∞</span></button>
                      </div></div>
                      <div class="settings-cluster-session-ab-line"><span class="settings-cluster-session-ab-badge">B</span><div class="settings-cluster-session-selector settings-cluster-session-variant-b" id="settings-cluster-jump-selector-b" data-mode="finite" role="group" aria-label="Variante B der Sitzungszeit">
                        <label class="settings-cluster-session-mode settings-cluster-session-finite" id="settings-cluster-jump-finite-b"><input id="settings-cluster-jump-seconds-b" type="number" min="5" max="3600" step="1" inputmode="numeric" value="10" aria-label="Sitzungszeit Variante B in Sekunden"><span class="settings-cluster-session-unit">s</span></label>
                        <button class="settings-cluster-session-mode settings-cluster-session-infinite" id="settings-cluster-jump-infinite-b" type="button" aria-pressed="false" aria-label="Variante B unbegrenzt" title="Unbegrenzt"><span class="settings-cluster-session-infinity-glyph" aria-hidden="true">∞</span></button>
                      </div></div>
                    </div>
                  </div>'''
card = replace_once(card, "A/B markup", old_row, new_row)

css_anchor = "        </style>"
css = r'''          /* V4.08.08 – direkter A/B-Vergleich der Sitzungszeit.
             A: bewegter Goldschimmer, finite links->rechts / unendlich rechts->links.
             B: statische Goldbetonung nur auf der aktiven Seite. */
          .settings-cluster-session-ab-stack { display:grid;gap:5px; }
          .settings-cluster-session-ab-line { display:flex;align-items:center;justify-content:flex-end;gap:6px; }
          .settings-cluster-session-ab-badge { width:15px;text-align:center;color:#e9bd58;font:800 10px/1 inherit;letter-spacing:.04em;text-shadow:0 1px 4px rgba(0,0,0,.7); }
          .settings-cluster-session-ab-row { align-items:center; }
          .settings-cluster-session-variant-a .settings-cluster-session-mode,
          .settings-cluster-session-variant-b .settings-cluster-session-mode { position:relative;overflow:hidden; }
          .settings-cluster-session-variant-a:not(.is-infinite) .settings-cluster-session-finite,
          .settings-cluster-session-variant-a.is-infinite .settings-cluster-session-infinite,
          .settings-cluster-session-variant-b:not(.is-infinite) .settings-cluster-session-finite,
          .settings-cluster-session-variant-b.is-infinite .settings-cluster-session-infinite {
            border-color:rgba(232,189,88,.72);color:#fff4d6;
            box-shadow:0 0 0 1px rgba(232,189,88,.10),0 0 10px rgba(214,154,33,.16),inset 0 1px 0 rgba(255,255,255,.06);
          }
          .settings-cluster-session-variant-a:not(.is-infinite) .settings-cluster-session-finite {
            background:linear-gradient(105deg,rgba(76,49,7,.20) 0%,rgba(230,180,70,.42) 36%,rgba(255,224,139,.22) 50%,rgba(75,48,7,.16) 66%,rgba(12,24,31,.22) 100%);
            background-size:230% 100%;animation:v40808-gold-ltr 4.8s ease-in-out infinite;
          }
          .settings-cluster-session-variant-a.is-infinite .settings-cluster-session-infinite {
            background:linear-gradient(255deg,rgba(76,49,7,.20) 0%,rgba(230,180,70,.42) 36%,rgba(255,224,139,.22) 50%,rgba(75,48,7,.16) 66%,rgba(12,24,31,.22) 100%);
            background-size:230% 100%;animation:v40808-gold-rtl 4.8s ease-in-out infinite;
          }
          .settings-cluster-session-variant-b:not(.is-infinite) .settings-cluster-session-finite,
          .settings-cluster-session-variant-b.is-infinite .settings-cluster-session-infinite {
            background:linear-gradient(110deg,rgba(116,78,15,.30),rgba(223,173,66,.30) 45%,rgba(255,218,128,.13) 70%,rgba(14,29,38,.20));
            animation:none;
          }
          .settings-cluster-session-variant-a.is-infinite .settings-cluster-session-finite,
          .settings-cluster-session-variant-b.is-infinite .settings-cluster-session-finite { opacity:.44; }
          .settings-cluster-session-variant-a:not(.is-infinite) .settings-cluster-session-infinite,
          .settings-cluster-session-variant-b:not(.is-infinite) .settings-cluster-session-infinite { opacity:.72; }
          @keyframes v40808-gold-ltr { 0%,12%{background-position:100% 0} 58%,100%{background-position:0% 0} }
          @keyframes v40808-gold-rtl { 0%,12%{background-position:0% 0} 58%,100%{background-position:100% 0} }
          @media (prefers-reduced-motion:reduce) {
            .settings-cluster-session-variant-a:not(.is-infinite) .settings-cluster-session-finite,
            .settings-cluster-session-variant-a.is-infinite .settings-cluster-session-infinite { animation:none!important;background-position:50% 0!important; }
          }
          @media(max-width:520px) {
            .settings-cluster-session-ab-row { align-items:flex-start; }
            .settings-cluster-session-ab-stack { margin-left:8px; }
          }
'''
card = replace_once(card, "A/B CSS", css_anchor, css + css_anchor)

old_lookup = '''      const settingsClusterJumpSelector = this.shadow.getElementById('settings-cluster-jump-selector');
      const settingsClusterJumpSeconds = this.shadow.getElementById('settings-cluster-jump-seconds');
      const settingsClusterJumpInfinite = this.shadow.getElementById('settings-cluster-jump-infinite');'''
new_lookup = '''      const settingsClusterJumpSelectors = ['a','b'].map(v => this.shadow.getElementById(`settings-cluster-jump-selector-${v}`)).filter(Boolean);
      const settingsClusterJumpSecondsInputs = ['a','b'].map(v => this.shadow.getElementById(`settings-cluster-jump-seconds-${v}`)).filter(Boolean);
      const settingsClusterJumpInfiniteButtons = ['a','b'].map(v => this.shadow.getElementById(`settings-cluster-jump-infinite-${v}`)).filter(Boolean);'''
card = replace_once(card, "A/B lookup", old_lookup, new_lookup)

old_handlers = '''      const applyClusterJumpSeconds = () => {
        if (!settingsClusterJumpSeconds) return;
        const seconds = Math.round(Number(settingsClusterJumpSeconds.value));
        if (!Number.isFinite(seconds) || seconds < 5 || seconds > 3600) {
          const fallback = Math.round((this._statusClusterBrowseFiniteTimeoutMs || 10000) / 1000);
          settingsClusterJumpSeconds.value = String(fallback);
          return;
        }
        this._setStatusClusterBrowseTimeoutV40802(seconds * 1000);
        this._render();
      };
      settingsClusterJumpSeconds?.addEventListener('focus',() => {
        if (Number(this._statusClusterBrowseTimeoutMs) !== 0) return;
        this._setStatusClusterBrowseTimeoutV40802(this._statusClusterBrowseFiniteTimeoutMs || 10000);
        this._render();
      });
      settingsClusterJumpSeconds?.addEventListener('change',applyClusterJumpSeconds);
      settingsClusterJumpSeconds?.addEventListener('keydown',(event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        applyClusterJumpSeconds();
        settingsClusterJumpSeconds.blur?.();
      });
      settingsClusterJumpInfinite?.addEventListener('click',() => {
        const next = Number(this._statusClusterBrowseTimeoutMs) === 0
          ? (this._statusClusterBrowseFiniteTimeoutMs || 10000)
          : 0;
        this._setStatusClusterBrowseTimeoutV40802(next);
        this._render();
      });'''
new_handlers = '''      const applyClusterJumpSeconds = (input) => {
        if (!input) return;
        const seconds = Math.round(Number(input.value));
        if (!Number.isFinite(seconds) || seconds < 5 || seconds > 3600) {
          const fallback = Math.round((this._statusClusterBrowseFiniteTimeoutMs || 10000) / 1000);
          input.value = String(fallback);
          return;
        }
        this._setStatusClusterBrowseTimeoutV40802(seconds * 1000);
        this._render();
      };
      settingsClusterJumpSecondsInputs.forEach((input) => {
        input.addEventListener('focus',() => {
          if (Number(this._statusClusterBrowseTimeoutMs) !== 0) return;
          this._setStatusClusterBrowseTimeoutV40802(this._statusClusterBrowseFiniteTimeoutMs || 10000);
          this._render();
        });
        input.addEventListener('change',() => applyClusterJumpSeconds(input));
        input.addEventListener('keydown',(event) => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          applyClusterJumpSeconds(input);
          input.blur?.();
        });
      });
      settingsClusterJumpInfiniteButtons.forEach((button) => button.addEventListener('click',() => {
        const next = Number(this._statusClusterBrowseTimeoutMs) === 0
          ? (this._statusClusterBrowseFiniteTimeoutMs || 10000)
          : 0;
        this._setStatusClusterBrowseTimeoutV40802(next);
        this._render();
      }));'''
card = replace_once(card, "A/B handlers", old_handlers, new_handlers)

old_sync = '''      const settingsClusterJumpSelector = $('settings-cluster-jump-selector');
      const settingsClusterJumpSeconds = $('settings-cluster-jump-seconds');
      const settingsClusterJumpInfinite = $('settings-cluster-jump-infinite');
      const clusterJumpInfinite = Number(this._statusClusterBrowseTimeoutMs) === 0;
      const clusterJumpFiniteSeconds = Math.round((this._statusClusterBrowseFiniteTimeoutMs || 10000) / 1000);
      if (settingsClusterJumpSeconds && this.shadow.activeElement !== settingsClusterJumpSeconds) {
        settingsClusterJumpSeconds.value = String(clusterJumpFiniteSeconds);
      }
      settingsClusterJumpSelector?.classList.toggle('is-infinite',clusterJumpInfinite);
      settingsClusterJumpSelector?.setAttribute('data-mode',clusterJumpInfinite ? 'infinite' : 'finite');
      settingsClusterJumpInfinite?.setAttribute('aria-pressed',clusterJumpInfinite ? 'true' : 'false');'''
new_sync = '''      const settingsClusterJumpSelectors = ['a','b'].map(v => $(`settings-cluster-jump-selector-${v}`)).filter(Boolean);
      const settingsClusterJumpSecondsInputs = ['a','b'].map(v => $(`settings-cluster-jump-seconds-${v}`)).filter(Boolean);
      const settingsClusterJumpInfiniteButtons = ['a','b'].map(v => $(`settings-cluster-jump-infinite-${v}`)).filter(Boolean);
      const clusterJumpInfinite = Number(this._statusClusterBrowseTimeoutMs) === 0;
      const clusterJumpFiniteSeconds = Math.round((this._statusClusterBrowseFiniteTimeoutMs || 10000) / 1000);
      settingsClusterJumpSecondsInputs.forEach((input) => {
        if (this.shadow.activeElement !== input) input.value = String(clusterJumpFiniteSeconds);
      });
      settingsClusterJumpSelectors.forEach((selector) => {
        selector.classList.toggle('is-infinite',clusterJumpInfinite);
        selector.setAttribute('data-mode',clusterJumpInfinite ? 'infinite' : 'finite');
      });
      settingsClusterJumpInfiniteButtons.forEach((button) => button.setAttribute('aria-pressed',clusterJumpInfinite ? 'true' : 'false'));'''
card = replace_once(card, "A/B sync", old_sync, new_sync)

required = [
    "const CARD_VERSION = '4.08.08';",
    "V4.08.08-SESSION-AB-COMPARE-2026-09-17",
    "settings-cluster-session-variant-a",
    "settings-cluster-session-variant-b",
    "v40808-gold-ltr",
    "v40808-gold-rtl",
    "settings-cluster-jump-seconds-a",
    "settings-cluster-jump-seconds-b",
    "settings-cluster-jump-infinite-a",
    "settings-cluster-jump-infinite-b",
    "label += ' ∞';",
    "label += ` · ${Math.ceil(remainingMs / 1000)}s`;",
]
for marker in required:
    if marker not in card:
        raise RuntimeError(f"V4.08.08 missing required marker: {marker}")

for path in (SOURCE, INTEGRATION, DASHBOARD):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(card, encoding="utf-8")

print("V4.08.08 frontend SHA256", sha256_text(card))
print("V4.08.08 session A/B comparison applied")

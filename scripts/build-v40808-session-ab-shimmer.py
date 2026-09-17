#!/usr/bin/env python3
from __future__ import annotations

import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'frontend' / 'gewitterradar.js'
INTEGRATION = ROOT / 'custom_components' / 'gewitterradar' / 'frontend' / 'gewitterradar.js'
DASHBOARD = ROOT / 'dashboard' / 'dist' / 'gewitterradar.js'
INPUT_SHA256 = '23f3ff2348c184c9a828b52fcfcabebaa174f7d7d1e8b713a1d95632765dcd6a'


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode('utf-8')).hexdigest()


def replace_once(card: str, label: str, needle: str, replacement: str) -> str:
    count = card.count(needle)
    if count != 1:
        raise RuntimeError(f'V4.08.08 {label}: expected exactly one anchor, found {count}')
    return card.replace(needle, replacement, 1)


card = SOURCE.read_text(encoding='utf-8')
input_hash = sha256_text(card)
if input_hash != INPUT_SHA256:
    raise RuntimeError(f'V4.08.08 builder refuses unknown V4.08.07 input: {input_hash}')

card = replace_once(card, 'header', '/* Gewitterradar Card V4.08.07 TEST', '/* Gewitterradar Card V4.08.08 TEST')
card = replace_once(card, 'CARD_VERSION', "const CARD_VERSION = '4.08.07';", "const CARD_VERSION = '4.08.08';")
card = replace_once(card, 'CARD_DISPLAY_VERSION', "const CARD_DISPLAY_VERSION = '4.08.07';", "const CARD_DISPLAY_VERSION = '4.08.08';")
card = replace_once(card, 'GEWITTERRADAR_BUILD', "const GEWITTERRADAR_BUILD = 'V4.08.07-HELP-FRAME-2026-09-17';", "const GEWITTERRADAR_BUILD = 'V4.08.08-SESSION-AB-SHIMMER-2026-09-17';")
card = replace_once(card, 'weather lab version', "version:'4.08.07',seed:40802", "version:'4.08.08',seed:40802")
card = replace_once(card, 'weather lab title', 'Wetter-Labor · V4.08.07', 'Wetter-Labor · V4.08.08')

old_css = """          @media(max-width:520px) {
            .settings-cluster-session-selector { width:146px;grid-template-columns:minmax(0,1fr) 43px; }
            .settings-cluster-session-finite input { width:51px; }
          }
"""
new_css = """          @media(max-width:520px) {
            .settings-cluster-session-selector { width:146px;grid-template-columns:minmax(0,1fr) 43px; }
            .settings-cluster-session-finite input { width:51px; }
          }

          /* V4.08.08 – direkter A/B-Vergleich des Recorder-Goldschimmers.
             A: aktive Seite + richtungsabhängiger Verlauf.
             B: nur aktive Seite, Verlauf immer links nach rechts.
             Beide Bedienelemente steuern exakt dieselbe Sitzungszeit. */
          .settings-cluster-session-row { align-items:flex-start; }
          .settings-cluster-session-compare {
            display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;align-items:start;
          }
          .settings-cluster-session-variant {
            display:grid;grid-template-columns:18px auto;gap:5px;align-items:center;
          }
          .settings-cluster-session-variant-tag {
            display:grid;place-items:center;width:18px;height:18px;border:1px solid rgba(198,157,79,.48);border-radius:50%;
            color:#efd18c;background:linear-gradient(145deg,rgba(141,103,41,.24),rgba(7,16,23,.82));
            box-shadow:inset 0 1px rgba(255,255,255,.10);font-size:9px;font-weight:850;line-height:1;
          }
          .settings-cluster-session-variant .settings-cluster-session-selector { width:156px; }
          .settings-cluster-session-variant-a .settings-cluster-session-selector:not(.is-infinite) .settings-cluster-session-finite {
            border-color:#c69d4f9c;color:#fff3cf;
            background:linear-gradient(90deg,rgba(224,173,76,.22),rgba(224,173,76,.035));
            box-shadow:inset 0 1px rgba(255,245,211,.08),0 0 8px rgba(224,173,76,.10);
          }
          .settings-cluster-session-variant-a .settings-cluster-session-selector.is-infinite .settings-cluster-session-infinite {
            border-color:#c69d4f9c;color:#fff3cf;
            background:linear-gradient(270deg,rgba(224,173,76,.22),rgba(224,173,76,.035));
            box-shadow:inset 0 1px rgba(255,245,211,.08),0 0 8px rgba(224,173,76,.10);
          }
          .settings-cluster-session-variant-b .settings-cluster-session-selector:not(.is-infinite) .settings-cluster-session-finite,
          .settings-cluster-session-variant-b .settings-cluster-session-selector.is-infinite .settings-cluster-session-infinite {
            border-color:#c69d4f9c;color:#fff3cf;
            background:linear-gradient(90deg,rgba(224,173,76,.22),rgba(224,173,76,.035));
            box-shadow:inset 0 1px rgba(255,245,211,.08),0 0 8px rgba(224,173,76,.10);
          }
          .settings-cluster-session-variant .settings-cluster-session-selector:not(.is-infinite) .settings-cluster-session-infinite,
          .settings-cluster-session-variant .settings-cluster-session-selector.is-infinite .settings-cluster-session-finite {
            border-color:transparent;background:transparent;box-shadow:none;
          }
          @media(max-width:680px) {
            .settings-cluster-session-row { flex-direction:column;align-items:stretch; }
            .settings-cluster-session-compare { grid-template-columns:1fr 1fr;align-self:flex-end; }
          }
          @media(max-width:430px) {
            .settings-cluster-session-compare { grid-template-columns:1fr;align-self:flex-end; }
          }
"""
card = replace_once(card, 'A/B shimmer CSS', old_css, new_css)

old_html = """                    <div class=\"settings-cluster-session-selector\" id=\"settings-cluster-jump-selector\" data-mode=\"finite\" role=\"group\" aria-label=\"Sitzungszeit des Cluster-Sprungs\">
                      <label class=\"settings-cluster-session-mode settings-cluster-session-finite\" id=\"settings-cluster-jump-finite\">
                        <input id=\"settings-cluster-jump-seconds\" type=\"number\" min=\"5\" max=\"3600\" step=\"1\" inputmode=\"numeric\" value=\"10\" aria-label=\"Sitzungszeit des Cluster-Sprungs in Sekunden\">
                        <span class=\"settings-cluster-session-unit\">s</span>
                      </label>
                      <button class=\"settings-cluster-session-mode settings-cluster-session-infinite\" id=\"settings-cluster-jump-infinite\" type=\"button\" aria-pressed=\"false\" aria-label=\"Cluster-Sprung unbegrenzt beibehalten\" title=\"Unbegrenzt\"><span class=\"settings-cluster-session-infinity-glyph\" aria-hidden=\"true\">∞</span></button>
                    </div>"""
new_html = """                    <div class=\"settings-cluster-session-compare\" aria-label=\"A/B-Vergleich Sitzungszeit\">
                      <div class=\"settings-cluster-session-variant settings-cluster-session-variant-a\">
                        <span class=\"settings-cluster-session-variant-tag\" aria-hidden=\"true\">A</span>
                        <div class=\"settings-cluster-session-selector\" id=\"settings-cluster-jump-selector\" data-mode=\"finite\" role=\"group\" aria-label=\"Variante A · Sitzungszeit des Cluster-Sprungs\">
                          <label class=\"settings-cluster-session-mode settings-cluster-session-finite\" id=\"settings-cluster-jump-finite\">
                            <input id=\"settings-cluster-jump-seconds\" type=\"number\" min=\"5\" max=\"3600\" step=\"1\" inputmode=\"numeric\" value=\"10\" aria-label=\"Variante A · Sitzungszeit des Cluster-Sprungs in Sekunden\">
                            <span class=\"settings-cluster-session-unit\">s</span>
                          </label>
                          <button class=\"settings-cluster-session-mode settings-cluster-session-infinite\" id=\"settings-cluster-jump-infinite\" type=\"button\" aria-pressed=\"false\" aria-label=\"Variante A · Cluster-Sprung unbegrenzt beibehalten\" title=\"Unbegrenzt\"><span class=\"settings-cluster-session-infinity-glyph\" aria-hidden=\"true\">∞</span></button>
                        </div>
                      </div>
                      <div class=\"settings-cluster-session-variant settings-cluster-session-variant-b\">
                        <span class=\"settings-cluster-session-variant-tag\" aria-hidden=\"true\">B</span>
                        <div class=\"settings-cluster-session-selector\" id=\"settings-cluster-jump-selector-b\" data-mode=\"finite\" role=\"group\" aria-label=\"Variante B · Sitzungszeit des Cluster-Sprungs\">
                          <label class=\"settings-cluster-session-mode settings-cluster-session-finite\" id=\"settings-cluster-jump-finite-b\">
                            <input id=\"settings-cluster-jump-seconds-b\" type=\"number\" min=\"5\" max=\"3600\" step=\"1\" inputmode=\"numeric\" value=\"10\" aria-label=\"Variante B · Sitzungszeit des Cluster-Sprungs in Sekunden\">
                            <span class=\"settings-cluster-session-unit\">s</span>
                          </label>
                          <button class=\"settings-cluster-session-mode settings-cluster-session-infinite\" id=\"settings-cluster-jump-infinite-b\" type=\"button\" aria-pressed=\"false\" aria-label=\"Variante B · Cluster-Sprung unbegrenzt beibehalten\" title=\"Unbegrenzt\"><span class=\"settings-cluster-session-infinity-glyph\" aria-hidden=\"true\">∞</span></button>
                        </div>
                      </div>
                    </div>"""
card = replace_once(card, 'A/B HTML', old_html, new_html)

old_bind_decl = """      const settingsClusterJumpSelector = this.shadow.getElementById('settings-cluster-jump-selector');
      const settingsClusterJumpSeconds = this.shadow.getElementById('settings-cluster-jump-seconds');
      const settingsClusterJumpInfinite = this.shadow.getElementById('settings-cluster-jump-infinite');"""
new_bind_decl = """      const settingsClusterJumpSelector = this.shadow.getElementById('settings-cluster-jump-selector');
      const settingsClusterJumpSeconds = this.shadow.getElementById('settings-cluster-jump-seconds');
      const settingsClusterJumpInfinite = this.shadow.getElementById('settings-cluster-jump-infinite');
      const settingsClusterJumpSelectorB = this.shadow.getElementById('settings-cluster-jump-selector-b');
      const settingsClusterJumpSecondsB = this.shadow.getElementById('settings-cluster-jump-seconds-b');
      const settingsClusterJumpInfiniteB = this.shadow.getElementById('settings-cluster-jump-infinite-b');"""
card = replace_once(card, 'bind declarations', old_bind_decl, new_bind_decl)

old_listeners = """      const applyClusterJumpSeconds = () => {
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
      });"""
new_listeners = """      const applyClusterJumpSeconds = (input) => {
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
      const bindClusterJumpSeconds = (input) => {
        input?.addEventListener('focus',() => {
          if (Number(this._statusClusterBrowseTimeoutMs) !== 0) return;
          this._setStatusClusterBrowseTimeoutV40802(this._statusClusterBrowseFiniteTimeoutMs || 10000);
          this._render();
        });
        input?.addEventListener('change',() => applyClusterJumpSeconds(input));
        input?.addEventListener('keydown',(event) => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          applyClusterJumpSeconds(input);
          input.blur?.();
        });
      };
      bindClusterJumpSeconds(settingsClusterJumpSeconds);
      bindClusterJumpSeconds(settingsClusterJumpSecondsB);
      const toggleClusterJumpInfinite = () => {
        const next = Number(this._statusClusterBrowseTimeoutMs) === 0
          ? (this._statusClusterBrowseFiniteTimeoutMs || 10000)
          : 0;
        this._setStatusClusterBrowseTimeoutV40802(next);
        this._render();
      };
      settingsClusterJumpInfinite?.addEventListener('click',toggleClusterJumpInfinite);
      settingsClusterJumpInfiniteB?.addEventListener('click',toggleClusterJumpInfinite);"""
card = replace_once(card, 'A/B listeners', old_listeners, new_listeners)

old_render = """      const settingsClusterJumpSelector = $('settings-cluster-jump-selector');
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
new_render = """      const settingsClusterJumpSelector = $('settings-cluster-jump-selector');
      const settingsClusterJumpSeconds = $('settings-cluster-jump-seconds');
      const settingsClusterJumpInfinite = $('settings-cluster-jump-infinite');
      const settingsClusterJumpSelectorB = $('settings-cluster-jump-selector-b');
      const settingsClusterJumpSecondsB = $('settings-cluster-jump-seconds-b');
      const settingsClusterJumpInfiniteB = $('settings-cluster-jump-infinite-b');
      const clusterJumpInfinite = Number(this._statusClusterBrowseTimeoutMs) === 0;
      const clusterJumpFiniteSeconds = Math.round((this._statusClusterBrowseFiniteTimeoutMs || 10000) / 1000);
      for (const input of [settingsClusterJumpSeconds,settingsClusterJumpSecondsB]) {
        if (input && this.shadow.activeElement !== input) input.value = String(clusterJumpFiniteSeconds);
      }
      for (const selector of [settingsClusterJumpSelector,settingsClusterJumpSelectorB]) {
        selector?.classList.toggle('is-infinite',clusterJumpInfinite);
        selector?.setAttribute('data-mode',clusterJumpInfinite ? 'infinite' : 'finite');
      }
      for (const button of [settingsClusterJumpInfinite,settingsClusterJumpInfiniteB]) {
        button?.setAttribute('aria-pressed',clusterJumpInfinite ? 'true' : 'false');
      }"""
card = replace_once(card, 'A/B render sync', old_render, new_render)

required = [
    "const CARD_VERSION = '4.08.08';",
    'V4.08.08-SESSION-AB-SHIMMER-2026-09-17',
    'settings-cluster-session-variant-a',
    'settings-cluster-session-variant-b',
    'settings-cluster-jump-selector-b',
    'settings-cluster-jump-seconds-b',
    'settings-cluster-jump-infinite-b',
    'linear-gradient(90deg,rgba(224,173,76,.22),rgba(224,173,76,.035))',
    'linear-gradient(270deg,rgba(224,173,76,.22),rgba(224,173,76,.035))',
    'bindClusterJumpSeconds(settingsClusterJumpSecondsB);',
    'settingsClusterJumpInfiniteB?.addEventListener',
    "label += ' ∞';",
    "label += ` · ${Math.ceil(remainingMs / 1000)}s`;",
    'transform:scale(1.25);transform-origin:center;',
]
for marker in required:
    if marker not in card:
        raise RuntimeError(f'V4.08.08 missing required marker: {marker}')

for path in (SOURCE, INTEGRATION, DASHBOARD):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(card, encoding='utf-8')

print('V4.08.08 frontend SHA256', sha256_text(card))
print('V4.08.08 A/B session shimmer applied')

#!/usr/bin/env python3
from __future__ import annotations

import hashlib
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "frontend" / "gewitterradar.js"
INTEGRATION = ROOT / "custom_components" / "gewitterradar" / "frontend" / "gewitterradar.js"
DASHBOARD = ROOT / "dashboard" / "dist" / "gewitterradar.js"

INPUT_SHA256 = "d39da7be0c7798ecaeeb223ebaffd77c01973009bfb12091f38dcd42a5dde69f"


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def replace_once(card: str, label: str, needle: str, replacement: str) -> str:
    count = card.count(needle)
    if count != 1:
        raise RuntimeError(f"V4.08.04 {label}: expected exactly one anchor, found {count}")
    return card.replace(needle, replacement, 1)


card = SOURCE.read_text(encoding="utf-8")
input_hash = sha256_text(card)
if input_hash != INPUT_SHA256:
    raise RuntimeError(f"V4.08.04 builder refuses unknown V4.08.03 input: {input_hash}")

card = replace_once(card, "header", "/* Gewitterradar Card V4.08.03 TEST", "/* Gewitterradar Card V4.08.04 TEST")
card = replace_once(card, "CARD_VERSION", "const CARD_VERSION = '4.08.03';", "const CARD_VERSION = '4.08.04';")
card = replace_once(card, "CARD_DISPLAY_VERSION", "const CARD_DISPLAY_VERSION = '4.08.03';", "const CARD_DISPLAY_VERSION = '4.08.04';")
card = replace_once(
    card,
    "GEWITTERRADAR_BUILD",
    "const GEWITTERRADAR_BUILD = 'V4.08.03-STORM-RADIUS-FIX-2026-09-17';",
    "const GEWITTERRADAR_BUILD = 'V4.08.04-CLUSTER-SESSION-COUNTDOWN-2026-09-17';",
)
card = replace_once(card, "weather lab version", "version:'4.08.03',seed:40802", "version:'4.08.04',seed:40802")
card = replace_once(card, "weather lab title", "Wetter-Labor · V4.08.03", "Wetter-Labor · V4.08.04")

card = replace_once(
    card,
    "cluster session state",
    """      this._statusClusterBrowseTimeoutMs = Number.isFinite(this._statusClusterBrowseTimeoutMs) ? this._statusClusterBrowseTimeoutMs : 10000;
      this._statusClusterBrowseLastInteraction = Number(this._statusClusterBrowseLastInteraction)||0;
      this._statusClusterBrowseTimer = this._statusClusterBrowseTimer || null;
      this._statusClusterBrowseUiTimer = this._statusClusterBrowseUiTimer || null;
      try {
        const savedBrowseTimeout = Number(localStorage.getItem('gewitterradar:v40802:cluster-jump-timeout'));
        if ([0,5000,10000,20000].includes(savedBrowseTimeout)) this._statusClusterBrowseTimeoutMs = savedBrowseTimeout;
      } catch (_error) {}
""",
    """      this._statusClusterBrowseTimeoutMs = Number.isFinite(this._statusClusterBrowseTimeoutMs) ? this._statusClusterBrowseTimeoutMs : 10000;
      this._statusClusterBrowseFiniteTimeoutMs = Number.isFinite(this._statusClusterBrowseFiniteTimeoutMs) ? this._statusClusterBrowseFiniteTimeoutMs : 10000;
      this._statusClusterBrowseLastInteraction = Number(this._statusClusterBrowseLastInteraction)||0;
      this._statusClusterBrowseTimer = this._statusClusterBrowseTimer || null;
      this._statusClusterBrowseUiTimer = this._statusClusterBrowseUiTimer || null;
      try {
        const savedRaw = localStorage.getItem('gewitterradar:v40804:cluster-jump-timeout');
        const legacyRaw = localStorage.getItem('gewitterradar:v40802:cluster-jump-timeout');
        const savedSource = savedRaw != null ? savedRaw : legacyRaw;
        if (savedSource != null) {
          const savedBrowseTimeout = Number(savedSource);
          if (savedBrowseTimeout === 0 || (Number.isFinite(savedBrowseTimeout) && savedBrowseTimeout >= 5000 && savedBrowseTimeout <= 3600000)) {
            this._statusClusterBrowseTimeoutMs = Math.round(savedBrowseTimeout / 1000) * 1000;
          }
        }
        const savedFiniteRaw = localStorage.getItem('gewitterradar:v40804:cluster-jump-finite-timeout');
        const savedFinite = Number(savedFiniteRaw);
        if (Number.isFinite(savedFinite) && savedFinite >= 5000 && savedFinite <= 3600000) {
          this._statusClusterBrowseFiniteTimeoutMs = Math.round(savedFinite / 1000) * 1000;
        } else if (this._statusClusterBrowseTimeoutMs > 0) {
          this._statusClusterBrowseFiniteTimeoutMs = this._statusClusterBrowseTimeoutMs;
        }
      } catch (_error) {}
""",
)

card = replace_once(
    card,
    "product session setting row",
    """                  <div class=\"settings-row settings-radius-main-toggle-row\">
                    <div class=\"settings-row-label\">
                      <div>Cluster-Auflösung · V4.08 TEST</div>
                      <div style=\"font-size:.76rem;opacity:.68;margin-top:3px\">AUS: V4.07.56 · EIN: zonenabhängig</div>
                    </div>
                    <button class=\"settings-switch\" id=\"settings-cluster-v40801-toggle\" type=\"button\"
                            role=\"switch\" aria-checked=\"false\" aria-label=\"Zonenabhängige Cluster-Auflösung V4.08.01 testen\"></button>
                  </div>

                  <div class=\"settings-radius observation\">""",
    """                  <div class=\"settings-row settings-radius-main-toggle-row\">
                    <div class=\"settings-row-label\">
                      <div>Cluster-Auflösung · V4.08 TEST</div>
                      <div style=\"font-size:.76rem;opacity:.68;margin-top:3px\">AUS: V4.07.56 · EIN: zonenabhängig</div>
                    </div>
                    <button class=\"settings-switch\" id=\"settings-cluster-v40801-toggle\" type=\"button\"
                            role=\"switch\" aria-checked=\"false\" aria-label=\"Zonenabhängige Cluster-Auflösung V4.08.01 testen\"></button>
                  </div>

                  <div class=\"settings-row settings-radius-main-toggle-row\">
                    <div class=\"settings-row-label\">
                      <div>Cluster-Sprung · Sitzungszeit</div>
                      <div style=\"font-size:.76rem;opacity:.68;margin-top:3px\">5–3600 Sekunden · ∞ = unbegrenzt</div>
                    </div>
                    <div style=\"display:flex;align-items:center;gap:6px\">
                      <input id=\"settings-cluster-jump-seconds\" type=\"number\" min=\"5\" max=\"3600\" step=\"1\" inputmode=\"numeric\" value=\"10\"
                             aria-label=\"Sitzungszeit des Cluster-Sprungs in Sekunden\"
                             style=\"width:68px;box-sizing:border-box;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:rgba(0,0,0,.20);color:inherit;padding:6px 7px;text-align:right;font:inherit\">
                      <span style=\"font-size:.82rem;opacity:.72\">s</span>
                      <button class=\"settings-radius-step\" id=\"settings-cluster-jump-infinite\" type=\"button\" aria-pressed=\"false\" aria-label=\"Cluster-Sprung unbegrenzt beibehalten\" title=\"Unbegrenzt\">∞</button>
                    </div>
                  </div>

                  <div class=\"settings-radius observation\">""",
)

card = replace_once(
    card,
    "settings element lookup",
    """      const settingsClusterV40801Toggle = this.shadow.getElementById('settings-cluster-v40801-toggle');
      const settingsAuraToggle = this.shadow.getElementById('settings-aura-toggle');""",
    """      const settingsClusterV40801Toggle = this.shadow.getElementById('settings-cluster-v40801-toggle');
      const settingsClusterJumpSeconds = this.shadow.getElementById('settings-cluster-jump-seconds');
      const settingsClusterJumpInfinite = this.shadow.getElementById('settings-cluster-jump-infinite');
      const settingsAuraToggle = this.shadow.getElementById('settings-aura-toggle');""",
)

card = replace_once(
    card,
    "settings session handlers",
    """      settingsClusterV40801Toggle?.addEventListener('click',() => {
        this._clusterPolicyV40801 = this._clusterPolicyV40801 === 'zoned' ? 'legacy' : 'zoned';
        const enabled = this._clusterPolicyV40801 === 'zoned';
        try {
          localStorage.setItem('gewitterradar:v40801:cluster-policy',this._clusterPolicyV40801);
        } catch (_error) {}
        settingsClusterV40801Toggle.classList.toggle('on',enabled);
        settingsClusterV40801Toggle.setAttribute('aria-checked',enabled ? 'true' : 'false');
        // Ein bewusster Policy-Wechsel startet eine neue Browser-Sitzung; normale
        // Renderzyklen dürfen den eingefrorenen Cluster-Jump dagegen nicht zurücksetzen.
        this._resetStatusClusterBrowse?.();
        this._renderMapMarkers?.();
      });



      // V3.9934 – Aura Ein/Aus.""",
    """      settingsClusterV40801Toggle?.addEventListener('click',() => {
        this._clusterPolicyV40801 = this._clusterPolicyV40801 === 'zoned' ? 'legacy' : 'zoned';
        const enabled = this._clusterPolicyV40801 === 'zoned';
        try {
          localStorage.setItem('gewitterradar:v40801:cluster-policy',this._clusterPolicyV40801);
        } catch (_error) {}
        settingsClusterV40801Toggle.classList.toggle('on',enabled);
        settingsClusterV40801Toggle.setAttribute('aria-checked',enabled ? 'true' : 'false');
        // Ein bewusster Policy-Wechsel startet eine neue Browser-Sitzung; normale
        // Renderzyklen dürfen den eingefrorenen Cluster-Jump dagegen nicht zurücksetzen.
        this._resetStatusClusterBrowse?.();
        this._renderMapMarkers?.();
      });

      const applyClusterJumpSeconds = () => {
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
      });



      // V3.9934 – Aura Ein/Aus.""",
)

card = replace_once(
    card,
    "settings session synchronisation",
    """      const settingsClusterV40801Toggle = $('settings-cluster-v40801-toggle');
      const clusterV40801Enabled = this._clusterPolicyV40801 === 'zoned';
      settingsClusterV40801Toggle?.classList.toggle('on',clusterV40801Enabled);
      settingsClusterV40801Toggle?.setAttribute('aria-checked',clusterV40801Enabled ? 'true' : 'false');

      // Popup-Radien spiegeln""",
    """      const settingsClusterV40801Toggle = $('settings-cluster-v40801-toggle');
      const clusterV40801Enabled = this._clusterPolicyV40801 === 'zoned';
      settingsClusterV40801Toggle?.classList.toggle('on',clusterV40801Enabled);
      settingsClusterV40801Toggle?.setAttribute('aria-checked',clusterV40801Enabled ? 'true' : 'false');

      const settingsClusterJumpSeconds = $('settings-cluster-jump-seconds');
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
      }

      // Popup-Radien spiegeln""",
)

card = replace_once(
    card,
    "diagnostic timeout choices",
    """<label class=\"diagnostic-lab-field\">Inaktivität <select id=\"diagnostic-cluster-jump-timeout\"><option value=\"5000\">5 s</option><option value=\"10000\">10 s</option><option value=\"20000\">20 s</option><option value=\"0\">unbegrenzt</option></select></label>""",
    """<label class=\"diagnostic-lab-field\">Inaktivität <select id=\"diagnostic-cluster-jump-timeout\"><option value=\"5000\">5 s</option><option value=\"10000\">10 s</option><option value=\"20000\">20 s</option><option value=\"30000\">30 s</option><option value=\"40000\">40 s</option><option value=\"60000\">60 s</option><option value=\"180000\">180 s</option><option value=\"0\">unbegrenzt</option></select></label>""",
)

card = replace_once(
    card,
    "diagnostic custom timeout synchronisation",
    """    _syncDiagnosticClusterBrowseV40802() {
      const node=this.shadow?.getElementById('diagnostic-cluster-browser-state'),select=this.shadow?.getElementById('diagnostic-cluster-jump-timeout');if(select)select.value=String(this._statusClusterBrowseTimeoutMs??10000);if(!node)return;
      const active=!!this._statusClusterBrowseActive,total=active?(this._statusClusterBrowseSnapshot?.length||0):(this._statusFocusList?.length||0),index=active&&Number.isInteger(this._statusFocusIndex)&&this._statusFocusIndex>=0?this._statusFocusIndex+1:0,timeout=Number(this._statusClusterBrowseTimeoutMs)||0;
""",
    """    _syncDiagnosticClusterBrowseV40802() {
      const node=this.shadow?.getElementById('diagnostic-cluster-browser-state'),select=this.shadow?.getElementById('diagnostic-cluster-jump-timeout');
      const configuredTimeout=Number(this._statusClusterBrowseTimeoutMs)??10000;
      if(select){
        select.querySelectorAll('option[data-v40804-custom]').forEach((option)=>option.remove());
        if(![0,5000,10000,20000,30000,40000,60000,180000].includes(configuredTimeout)){
          const option=document.createElement('option');option.value=String(configuredTimeout);option.dataset.v40804Custom='true';option.textContent=`${Math.round(configuredTimeout/1000)} s · benutzerdefiniert`;select.append(option);
        }
        select.value=String(configuredTimeout);
      }
      if(!node)return;
      const active=!!this._statusClusterBrowseActive,total=active?(this._statusClusterBrowseSnapshot?.length||0):(this._statusFocusList?.length||0),index=active&&Number.isInteger(this._statusFocusIndex)&&this._statusFocusIndex>=0?this._statusFocusIndex+1:0,timeout=Number(this._statusClusterBrowseTimeoutMs)||0;
""",
)

card = replace_once(
    card,
    "timeout setter and countdown ticker",
    """    _setStatusClusterBrowseTimeoutV40802(timeoutMs) {
      const next=[0,5000,10000,20000].includes(Number(timeoutMs))?Number(timeoutMs):10000;this._statusClusterBrowseTimeoutMs=next;try{localStorage.setItem('gewitterradar:v40802:cluster-jump-timeout',String(next));}catch(_error){}
      if(this._statusClusterBrowseActive)this._touchStatusClusterBrowseSessionV40802();else this._syncDiagnosticClusterBrowseV40802?.();
    }

    _touchStatusClusterBrowseSessionV40802() {
      if(!this._statusClusterBrowseActive)return;this._statusClusterBrowseLastInteraction=Date.now();
      if(this._statusClusterBrowseTimer)clearTimeout(this._statusClusterBrowseTimer);this._statusClusterBrowseTimer=null;
      const timeout=Number(this._statusClusterBrowseTimeoutMs)||0;if(timeout>0)this._statusClusterBrowseTimer=setTimeout(()=>this._expireStatusClusterBrowseSessionV40802('timeout'),timeout);
      if(this._statusClusterBrowseUiTimer)clearInterval(this._statusClusterBrowseUiTimer);this._statusClusterBrowseUiTimer=null;if(this._diagnostics?.enabled)this._statusClusterBrowseUiTimer=setInterval(()=>this._syncDiagnosticClusterBrowseV40802?.(),250);
      this._syncDiagnosticClusterBrowseV40802?.();
    }
""",
    """    _setStatusClusterBrowseTimeoutV40802(timeoutMs) {
      const raw=Number(timeoutMs);const next=raw===0?0:(Number.isFinite(raw)?Math.max(5000,Math.min(3600000,Math.round(raw/1000)*1000)):10000);
      this._statusClusterBrowseTimeoutMs=next;if(next>0)this._statusClusterBrowseFiniteTimeoutMs=next;
      try{localStorage.setItem('gewitterradar:v40804:cluster-jump-timeout',String(next));if(next>0)localStorage.setItem('gewitterradar:v40804:cluster-jump-finite-timeout',String(next));}catch(_error){}
      if(this._statusClusterBrowseActive)this._touchStatusClusterBrowseSessionV40802();else{this._updateStatusFocusUi?.();this._syncDiagnosticClusterBrowseV40802?.();}
    }

    _touchStatusClusterBrowseSessionV40802() {
      if(!this._statusClusterBrowseActive)return;this._statusClusterBrowseLastInteraction=Date.now();
      if(this._statusClusterBrowseTimer)clearTimeout(this._statusClusterBrowseTimer);this._statusClusterBrowseTimer=null;
      const timeout=Number(this._statusClusterBrowseTimeoutMs)||0;if(timeout>0)this._statusClusterBrowseTimer=setTimeout(()=>this._expireStatusClusterBrowseSessionV40802('timeout'),timeout);
      if(this._statusClusterBrowseUiTimer)clearInterval(this._statusClusterBrowseUiTimer);this._statusClusterBrowseUiTimer=null;
      if(timeout>0)this._statusClusterBrowseUiTimer=setInterval(()=>{this._updateStatusFocusUi?.();if(this._diagnostics?.enabled)this._syncDiagnosticClusterBrowseV40802?.();},250);
      this._updateStatusFocusUi?.();this._syncDiagnosticClusterBrowseV40802?.();
    }
""",
)

card = replace_once(
    card,
    "compact cluster countdown",
    """        label = this._t('status.cluster_index',{index:displayIndex + 1,total});

        const nextCount = Number(nextStrike?.count) || 0;""",
    """        label = this._t('status.cluster_index',{index:displayIndex + 1,total});
        if (this._statusClusterBrowseActive && selectedIndex >= 0) {
          const timeout = Number(this._statusClusterBrowseTimeoutMs) || 0;
          if (timeout === 0) {
            label += '   ∞';
          } else if (this._statusClusterBrowseLastInteraction) {
            const remainingMs = Math.max(0,timeout - (Date.now() - this._statusClusterBrowseLastInteraction));
            label += `   ${Math.ceil(remainingMs / 1000)}s`;
          }
        }

        const nextCount = Number(nextStrike?.count) || 0;""",
)

required = [
    "const CARD_VERSION = '4.08.04';",
    "V4.08.04-CLUSTER-SESSION-COUNTDOWN-2026-09-17",
    "settings-cluster-jump-seconds",
    "settings-cluster-jump-infinite",
    "Math.ceil(remainingMs / 1000)",
    "label += '   ∞';",
    "3600000",
    "data-v40804-custom",
    "const stormRadius = this._currentStormRadius ?? Math.min(this._stormRadiusValue(),observationRadius);",
    "const inStorm = s.distance != null && s.distance <= stormRadius;",
]
for marker in required:
    if marker not in card:
        raise RuntimeError(f"V4.08.04 result marker missing: {marker}")

in_storm = card.index("const inStorm = s.distance != null && s.distance <= stormRadius;")
storm_decl = card.rfind(
    "const stormRadius = this._currentStormRadius ?? Math.min(this._stormRadiusValue(),observationRadius);",
    0,
    in_storm,
)
if storm_decl < 0:
    raise RuntimeError("V4.08.04 runtime guard: stormRadius declaration lost before policy use")

SOURCE.write_text(card, encoding="utf-8")
shutil.copyfile(SOURCE, INTEGRATION)
shutil.copyfile(SOURCE, DASHBOARD)

print(f"V4.08.04 frontend built: {len(card.encode('utf-8'))} bytes")
print(f"SHA256 {sha256_text(card)}")
print("Cluster session: 5-3600 s freely configurable or unlimited; compact countdown in header cluster pill.")

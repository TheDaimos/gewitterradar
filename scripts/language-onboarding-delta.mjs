// Explicit first-start delta; the canonical frontend remains a single shared payload.
export function languageOnboardingDelta(source) {
 const once=(from,to)=>{if(source.split(from).length!==2)throw Error('Language onboarding anchor changed: '+from.slice(0,80));source=source.replace(from,to);};
 once('  const ABOUT_ONBOARDING_VERSION = 1;',`  const LANGUAGE_INITIALIZATION_ENTITIES = Object.freeze({native:'switch.gewitterradar_language_initialized',legacy:'input_boolean.lightning_detection_language_initialized'});
  let languageOnboardingOwner = null;
  const ABOUT_ONBOARDING_VERSION = 1;`);
 once('    disconnectedCallback() {\n      this._closeAbout(false, false);','    disconnectedCallback() {\n      this._closeLanguageOnboarding(false);\n      this._closeAbout(false, false);');
 once('      if (!this.isConnected || !this._built || !this._hass || aboutClaimedVersion >= ABOUT_ONBOARDING_VERSION) return;', '      if (!this.isConnected || !this._built || !this._hass) return;');
 once("      let seen = 0;\n      try { seen = Number(localStorage.getItem(ABOUT_STORAGE_KEY)) || 0; } catch (_) {}", "      if (!this._languageOnboardingComplete()) { this._openLanguageOnboarding(); return; }\n      if (languageOnboardingOwner?._languageOnboardingSubmitting) return;\n      this._closeLanguageOnboarding(true);\n      if (aboutClaimedVersion >= ABOUT_ONBOARDING_VERSION) return;\n      let seen = 0;\n      try { seen = Number(localStorage.getItem(ABOUT_STORAGE_KEY)) || 0; } catch (_) {}");
 once('    _openAbout() {\n', '    _openAbout() {\n      if (!this._languageOnboardingComplete()) { this._maybeOpenAbout(); return; }\n');
 once('    _maybeOpenAbout() {',methods+'    _maybeOpenAbout() {');
 return source;
}
const methods=String.raw`    _languageOnboardingComplete() {
      return this._hass?.states?.[this._languageInitializationEntity()]?.state === 'on';
    }

    _languageInitializationEntity() {
      // A present native marker remains authoritative even while unavailable.
      const mapping = LANGUAGE_INITIALIZATION_ENTITIES;
      return this._config.language_initialized_entity || (this._hass?.states?.[mapping.native] ? mapping.native : mapping.legacy);
    }

    _initialLanguageChoice() {
      const raw = this._hass?.locale?.language || this._hass?.language || '';
      const base = String(raw).trim().toLowerCase().replace(/_/g,'-').split('-')[0];
      const code = base === 'no' ? 'nb' : base;
      return LANGUAGE_DEFINITIONS.find(entry => entry.group === 'main' && entry.code === code)?.value || LANGUAGE_DEFAULT;
    }

    _openLanguageOnboarding() {
      if (this._languageOnboardingDialog || languageOnboardingOwner?.isConnected || !this.shadow) return;
      languageOnboardingOwner = this;
      const shell = document.createElement('div');
      shell.id = 'language-onboarding-shell';
      shell.innerHTML = '<style>' +
        '.language-onboarding{box-sizing:border-box;width:min(540px,calc(100vw - 24px));max-width:calc(100vw - 24px);max-height:calc(100dvh - 24px);padding:0;border:1px solid #c9a86a;border-radius:14px;color:#e7e3db;background:radial-gradient(ellipse at 100% 0,#263d4d66,transparent 60%),linear-gradient(145deg,#111e27,#081117);box-shadow:0 24px 70px #0009,inset 0 0 0 3px #b18b3520;font:14px/1.45 Segoe UI,Arial,sans-serif;overflow:hidden;color-scheme:dark}' +
        '.language-onboarding::backdrop{background:#03070bdd}.language-onboarding *{box-sizing:border-box}.language-onboarding form{display:flex;flex-direction:column;max-height:calc(100dvh - 26px);margin:0}.language-onboarding header{display:flex;align-items:center;gap:16px;padding:22px 22px 12px;flex:none}.language-onboarding header img{width:62px;height:62px;object-fit:contain}.language-onboarding h2{font-size:22px;line-height:1.2;color:#f5dfac;margin:0 0 4px}.language-onboarding header p{margin:0;color:#c5b58f}.language-onboarding .language-intro{margin:0;padding:0 22px 16px;color:#c4cbd0;font-size:12px;flex:none}.language-onboarding .language-options{padding:0 22px 6px;overflow:auto;min-height:0;overscroll-behavior:contain;scrollbar-color:#a4864c #0a141c;touch-action:pan-y}.language-onboarding fieldset{border:0;padding:0;margin:0 0 14px;min-width:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.language-onboarding legend{padding:0 0 8px;color:#c8aa70;font-size:12px}.language-onboarding label{display:flex;align-items:center;gap:10px;min-height:44px;padding:9px 12px;border:1px solid #a488453b;border-radius:7px;background:#101e28;cursor:pointer}.language-onboarding label:has(:checked){border-color:#e4c17b;background:linear-gradient(115deg,#6a51254a,#172630);color:#ffe4ad}.language-onboarding input{accent-color:#e7c274;margin:0;flex:none}.language-onboarding :focus-visible{outline:2px solid #ffe1a1;outline-offset:3px}.language-onboarding label:has(:focus-visible){outline:2px solid #ffe1a1;outline-offset:1px}.language-onboarding footer{padding:12px 22px 18px;border-top:1px solid #b99a483b;flex:none;background:#08131b}.language-onboarding button{min-height:44px;width:100%;border:1px solid #f3d18b;border-radius:7px;background:linear-gradient(#f3d28e,#bc9346);color:#211b10;font:600 14px Segoe UI,Arial,sans-serif;cursor:pointer;touch-action:manipulation}.language-onboarding button:disabled{opacity:.65;cursor:wait}.language-onboarding .language-error{margin:0 0 8px;color:#ffceaa;font-size:12px}.language-onboarding .language-error:empty{display:none}@media(hover:hover){.language-onboarding label:hover{background:#233442}.language-onboarding button:hover{filter:brightness(1.06)}}@media(max-width:380px){.language-onboarding fieldset{grid-template-columns:1fr}.language-onboarding header{padding:16px 16px 10px;gap:10px}.language-onboarding h2{font-size:19px}.language-onboarding .language-options{padding-left:16px;padding-right:16px}.language-onboarding .language-intro{padding-left:16px;padding-right:16px}}' +
        '</style><dialog class="language-onboarding" aria-modal="true" aria-labelledby="language-onboarding-title" aria-describedby="language-onboarding-intro"><form><header><img src="' + ABOUT_LOGO + '" alt="Gewitterradar" width="62" height="62"><div><h2 id="language-onboarding-title">Choose your language</h2><p lang="de">Sprache wählen</p></div></header><p id="language-onboarding-intro" class="language-intro"><span lang="en">Choose the language for Gewitterradar.<br>You can change it again at any time in Settings.</span><br><span lang="de">Wähle die Sprache für Gewitterradar.<br>Du kannst sie jederzeit in den Einstellungen ändern.</span></p><div class="language-options"></div><footer><p class="language-error" role="alert"></p><button type="submit">Weiter / Continue</button></footer></form></dialog>';
      const dialog = shell.querySelector('dialog'),choice = this._initialLanguageChoice();
      for (const [group,title] of [['main','Sprachen / Languages'],['fun','Deutsche Dialekte / German dialects']]) {
        const fieldset = document.createElement('fieldset'),legend = document.createElement('legend');
        legend.textContent = title;fieldset.append(legend);
        for (const entry of LANGUAGE_DEFINITIONS.filter(item => item.group === group)) {
          const label = document.createElement('label'),input = document.createElement('input'),text = document.createElement('span');
          input.type = 'radio';input.name = 'language';input.value = entry.value;input.checked = entry.value === choice;
          text.textContent = entry.value;label.append(input,text);fieldset.append(label);
        }
        shell.querySelector('.language-options').append(fieldset);
      }
      this._languageOnboardingReturnFocus = this.shadow.activeElement;
      this.shadow.append(shell);this._languageOnboardingDialog = dialog;
      dialog.addEventListener('cancel',event => { event.preventDefault();event.stopPropagation(); });
      dialog.addEventListener('keydown',event => {
        if (event.key === 'Escape') { event.preventDefault();event.stopPropagation(); }
        if (event.key !== 'Tab') return;
        const first = dialog.querySelector('input:checked'),last = dialog.querySelector('button');
        const active = this.shadow.activeElement;
        if (event.shiftKey && active === first) { event.preventDefault();last.focus(); }
        else if (!event.shiftKey && active === last) { event.preventDefault();first.focus(); }
      });
      dialog.querySelector('form').addEventListener('submit',event => {event.preventDefault();this._confirmLanguageOnboarding();});
      dialog.showModal();dialog.querySelector('input:checked').focus();
    }

    async _confirmLanguageOnboarding() {
      const dialog = this._languageOnboardingDialog;
      if (!dialog || this._languageOnboardingSubmitting) return;
      const value = dialog.querySelector('input:checked')?.value;
      if (!LANGUAGE_DEFINITIONS.some(entry => entry.value === value)) return;
      const button = dialog.querySelector('button'),error = dialog.querySelector('.language-error');
      this._languageOnboardingSubmitting = true;button.disabled = true;error.textContent = '';
      try {
        if (this._languageOnboardingComplete()) { this._closeLanguageOnboarding(true); return; }
        const marker = this._languageInitializationEntity(),markerState = this._hass?.states?.[marker]?.state;
        if (!['on','off'].includes(markerState) || !['switch','input_boolean'].includes(marker?.split('.')[0])) throw Error('Global language marker unavailable');
        const entity = this._languageEntity(),state = this._hass?.states?.[entity];
        if (!state || ['unknown','unavailable'].includes(state.state)) throw Error('Language setting unavailable');
        const written = await this._selectSetting(entity,value);
        if (written === false) throw Error('Language setting cannot be written');
        if (this._languageOnboardingDialog !== dialog || !this.isConnected) return;
        // Reuse the regular selector's transient preview until HA confirms its state.
        this._languagePreview = value;
        await this._hass.callService(marker.split('.')[0],'turn_on',{entity_id:marker});
        // Advance only after the global HA state is visible, never from a local marker.
        const deadline = Date.now() + 10000;
        while (!this._languageOnboardingComplete()) {
          if (this._languageOnboardingDialog !== dialog || !this.isConnected) return;
          if (Date.now() >= deadline) throw Error('Global language marker not confirmed');
          await new Promise(resolve => setTimeout(resolve,50));
        }
        this._closeLanguageOnboarding(true);
        this._render();this._maybeOpenAbout();
      } catch (_) {
        if (this._languageOnboardingDialog === dialog) {
          error.textContent = 'Sprache konnte nicht gespeichert werden. Bitte erneut versuchen. / Could not save the language. Please try again.';
          button.disabled = false;button.focus();
        }
      } finally { this._languageOnboardingSubmitting = false; if (this._languageOnboardingComplete()) this._maybeOpenAbout(); }
    }

    _closeLanguageOnboarding(restoreFocus = false) {
      const dialog = this._languageOnboardingDialog,previous = this._languageOnboardingReturnFocus;
      this._languageOnboardingDialog = null;this._languageOnboardingReturnFocus = null;
      if (dialog) { dialog.close();dialog.parentElement?.remove(); }
      if (languageOnboardingOwner === this) languageOnboardingOwner = null;
      if (restoreFocus && previous?.isConnected) previous.focus({preventScroll:true});
    }

`;
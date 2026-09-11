// Accepted post-V4.06 UI polish. This layer is intentionally narrow and fail-closed.
// It changes only presentation details approved during real-device review and leaves
// the frozen V4.05 baseline plus the existing V4.06 functional delta untouched.

function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.06 UI polish anchor changed (${label})`);
  }
  return source.replace(from, to);
}

export function v406UiPolishDelta(source) {
  let result = source;

  const settingsAnchor = `          @media(max-width:420px){.settings-premium-links{grid-template-columns:1fr}}\n`;
  const settingsPolish = String.raw`          /* V4.06 accepted UI polish: premium frame and symmetric action tiles. */
          .settings-dialog{
            border-color:rgba(232,188,96,.92);
            box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,236,181,.18),inset 0 0 0 3px rgba(205,169,80,.065),inset 0 1px rgba(255,244,213,.13),0 0 34px rgba(215,164,67,.18),0 0 0 1px rgba(205,151,48,.08)
          }
          .settings-dialog::after{content:'';position:absolute;inset:1px;border:1px solid rgba(255,221,145,.38);border-radius:20.75px;box-shadow:inset 0 0 0 1px rgba(120,76,12,.13),0 0 10px rgba(229,178,78,.09);pointer-events:none;z-index:40}
          .settings-premium-link{display:flex!important;align-items:center!important;justify-content:flex-start!important;text-align:left!important}
          .settings-premium-link>span:last-child{min-width:0;text-align:left}
          .settings-close.settings-close-premium{position:relative;display:grid!important;place-items:center;width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important;border:0!important;border-radius:8px!important;background:transparent!important;color:transparent!important;font-size:0!important;line-height:0!important;overflow:visible;box-shadow:none!important}
          .settings-close-premium img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}
          .settings-close-premium:focus-visible{outline:2px solid #e7c16e!important;outline-offset:-2px!important}.settings-close-premium:active img{transform:scale(.97);filter:brightness(.92)}
          @media(hover:hover) and (pointer:fine){.settings-close-premium:hover{background:transparent!important}.settings-close-premium:hover img{filter:brightness(1.12) drop-shadow(0 0 2px #dba34c70)}}
          @media(hover:none) and (pointer:coarse){.settings-close-premium:focus-visible{outline:none!important}}
          @media(max-width:520px) and (orientation:portrait){
            .settings-premium-links{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
            .settings-premium-link{min-width:0;padding-left:10px!important;padding-right:9px!important;gap:7px!important}
            .settings-premium-icon{flex-basis:22px;width:22px;height:22px}
            .settings-premium-link>span:last-child{white-space:normal;line-height:1.15}
          }
`;
  result = once(result, settingsAnchor, settingsAnchor + settingsPolish, 'settings-frame-and-action-tiles');

  const settingsCloseAnchor = `                <button class="settings-close" id="settings-close" type="button"\n                        aria-label="Einstellungen schließen">×</button>`;
  const settingsCloseReplacement = `                <button class="settings-close settings-close-premium" id="settings-close" type="button"\n                        aria-label="Einstellungen schließen"><img src="\${ABOUT_CLOSE_IMAGE}" alt="" width="34" height="34" draggable="false"></button>`;
  result = once(result, settingsCloseAnchor, settingsCloseReplacement, 'settings-premium-close-markup');

  const aboutAnchor = `filter:brightness(1.18) drop-shadow(0 0 3px #e6b95777)}`;
  const aboutPolish = String.raw`
        /* V4.06 accepted UI polish: About chevron spacing, iPad focus rendering, mobile dedication. */
        .about-dialog summary:after{margin-right:22px}
        .about-mobile-break{display:none}
        @media(max-width:620px) and (orientation:portrait){
          .about-dialog summary:after{margin-right:18px}
          .about-dedication-copy{transform:translateY(7px)}
          .about-dedication-copy p{max-width:none}
          .about-mobile-break{display:block;height:0}
        }
        @media(hover:none) and (pointer:coarse) and (min-width:700px) and (max-width:1100px){
          .about-close{-webkit-appearance:none;appearance:none;-webkit-tap-highlight-color:transparent}
          .about-close:focus-visible{outline:none!important}
          .about-close:focus-visible img{filter:brightness(1.04) drop-shadow(0 0 3px rgba(224,173,76,.42))}
        }
`;
  result = once(result, aboutAnchor, aboutAnchor + aboutPolish, 'about-chevron-ipad-mobile-dedication');

  const syncAnchor = `      for (const node of dialog.querySelectorAll('[data-about-text]')) {\n        const text = t(node.dataset.aboutText);\n        if (node.textContent !== text) node.textContent = text;\n      }`;
  const syncReplacement = `      const mobileDedicationParts = [\n        'Danke, dass du mir die Zeit',\n        ' lässt, meinen Interessen und',\n        ' meiner Begeisterung für Technik,',\n        ' Wetter und all den Ideen dazwischen',\n        ' nachzugehen – und mich Projekten',\n        ' wie Gewitterradar mit so viel Freude',\n        ' und Ausdauer zu widmen.'\n      ];\n      const mobileDedicationText = mobileDedicationParts.join('');\n      for (const node of dialog.querySelectorAll('[data-about-text]')) {\n        const text = t(node.dataset.aboutText);\n        const isGermanDedication = node.dataset.aboutText === 'dedicationText' && language === 'Deutsch' && text === mobileDedicationText;\n        if (isGermanDedication) {\n          if (node.dataset.mobilePortraitLayout !== text) {\n            node.replaceChildren();\n            mobileDedicationParts.forEach((part, index) => {\n              if (index) {\n                const lineBreak = document.createElement('span');\n                lineBreak.className = 'about-mobile-break';\n                lineBreak.setAttribute('aria-hidden', 'true');\n                node.append(lineBreak);\n              }\n              node.append(document.createTextNode(part));\n            });\n            node.dataset.mobilePortraitLayout = text;\n          }\n          continue;\n        }\n        if (node.dataset.mobilePortraitLayout) delete node.dataset.mobilePortraitLayout;\n        if (node.textContent !== text) node.textContent = text;\n      }`;
  result = once(result, syncAnchor, syncReplacement, 'mobile-dedication-line-flow');

  const helpShellAnchor = `        '</style><dialog class="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title"><header class="help-head"><span class="help-emblem" aria-hidden="true">?</span><div><h2 id="help-title"></h2><p class="help-subtitle"></p></div><button class="help-close" type="button" aria-label="Close">×</button></header><div class="help-content"></div></dialog>';`;
  const helpShellReplacement = `        /* V4.06 accepted UI polish: stable Help frame and shared premium controls. */\n        '.help-dialog{position:relative;border-color:rgba(232,188,96,.90);box-shadow:0 24px 90px #000c,inset 0 0 0 1px rgba(255,235,184,.08),inset 0 1px rgba(255,247,224,.12),0 0 28px rgba(215,164,67,.14)}.help-dialog::after{content:"";position:absolute;inset:1px;border:1px solid rgba(255,221,145,.34);border-radius:11.75px;box-shadow:inset 0 0 0 1px rgba(120,76,12,.11),0 0 9px rgba(229,178,78,.08);pointer-events:none;z-index:40}.help-close{position:relative;display:grid;place-items:center;color:transparent;font-size:0;line-height:0;background:transparent}.help-close img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}.help-copy{display:grid;place-items:center;color:transparent;font-size:0;line-height:0}.help-copy img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}.help-section-icon svg{display:block;width:24px;height:24px;overflow:visible;filter:drop-shadow(0 0 2px rgba(226,180,74,.26))}.help-close:active img,.help-copy:active img{transform:scale(.97);filter:brightness(.92)}@media(hover:hover) and (pointer:fine){.help-close:hover,.help-copy:hover{filter:none;background:transparent}.help-close:hover img,.help-copy:hover img{filter:brightness(1.12) drop-shadow(0 0 2px #dba34c70)}}@media(hover:none) and (pointer:coarse){.help-close:focus-visible{outline:none}}' +\n        '</style><dialog class="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title"><header class="help-head"><span class="help-emblem" aria-hidden="true">?</span><div><h2 id="help-title"></h2><p class="help-subtitle"></p></div><button class="help-close" type="button" aria-label="Close"><img src="' + ABOUT_CLOSE_IMAGE + '" alt="" width="34" height="34" draggable="false"></button></header><div class="help-content"></div></dialog>';`;
  result = once(result, helpShellAnchor, helpShellReplacement, 'help-frame-and-premium-close');

  const helpIconsAnchor = `        const icons={prerequisites:'⌂',radii:'◎',location:'⌖',functions:'⚙',defaults:'✓',troubleshooting:'!',recorder:'▤'};`;
  const helpIconsReplacement = `        const icons={prerequisites:'⌂',radii:'◎',location:'⌖',functions:'⚙',defaults:'✓',troubleshooting:'!',recorder:'▤'};\n        /* Trial only: Welcome-screen gear for “Wichtige Funktionen”. Isolated for one-step rollback. */\n        const premiumFunctionsIcon='<svg viewBox="0 0 96 96" aria-hidden="true" focusable="false"><defs><linearGradient id="helpFunctionsMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7f5a1b"/><stop offset=".28" stop-color="#fff1b6"/><stop offset=".55" stop-color="#c68a2f"/><stop offset=".78" stop-color="#ffe49a"/><stop offset="1" stop-color="#6e4712"/></linearGradient></defs><g fill="none" stroke="url(#helpFunctionsMetal)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="48" cy="48" r="12"/><path d="M48 21l4 2 5-1 5 9 4 3 8 1v10l-6 5v5l5 7-7 7-8-3-5 2-5 8H38l-4-8-5-2-8 3-7-7 5-7v-5l-6-5V35l8-1 4-3 5-9 5 1 3-2z"/></g></svg>';`;
  result = once(result, helpIconsAnchor, helpIconsReplacement, 'help-functions-premium-gear-source');

  const helpIconAssignAnchor = `          icon.className='help-section-icon';icon.setAttribute('aria-hidden','true');icon.textContent=icons[section.key]||'•';title.textContent=section.title;chevron.className='help-chevron';`;
  const helpIconAssignReplacement = `          icon.className='help-section-icon';icon.setAttribute('aria-hidden','true');if(section.key==='functions')icon.innerHTML=premiumFunctionsIcon;else icon.textContent=icons[section.key]||'•';title.textContent=section.title;chevron.className='help-chevron';`;
  result = once(result, helpIconAssignAnchor, helpIconAssignReplacement, 'help-functions-premium-gear-render');

  const helpCopyAnchor = `button.setAttribute('aria-label',help.copy);button.textContent='⧉';status.className='help-copy-status';`;
  const helpCopyReplacement = `button.setAttribute('aria-label',help.copy);const copyImage=document.createElement('img');copyImage.src=ABOUT_COPY_IMAGE;copyImage.alt='';copyImage.width=34;copyImage.height=34;copyImage.draggable=false;button.append(copyImage);status.className='help-copy-status';`;
  result = once(result, helpCopyAnchor, helpCopyReplacement, 'help-recorder-premium-scroll-copy');

  return result;
}

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
            border:1px solid transparent;
            background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%) padding-box,linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995)) padding-box,conic-gradient(from 214deg,rgba(156,108,30,.94) 0deg,rgba(222,174,74,.96) 18deg,rgba(255,236,168,1) 29deg,rgba(190,139,45,.92) 43deg,rgba(230,186,89,.98) 66deg,rgba(252,222,142,.99) 84deg,rgba(176,121,31,.91) 103deg,rgba(221,172,68,.97) 132deg,rgba(255,233,158,1) 150deg,rgba(185,131,38,.92) 170deg,rgba(231,181,79,.97) 194deg,rgba(255,228,148,1) 212deg,rgba(171,116,29,.91) 230deg,rgba(223,173,68,.97) 260deg,rgba(252,218,132,.99) 284deg,rgba(178,121,31,.92) 307deg,rgba(232,184,83,.98) 334deg,rgba(255,235,165,1) 350deg,rgba(156,108,30,.94) 360deg) border-box;
            box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,236,181,.15),inset 0 0 0 3px rgba(205,169,80,.045),inset 0 1px rgba(255,244,213,.12),0 0 31px rgba(215,164,67,.14),0 0 0 1px rgba(205,151,48,.07)
          }
          .settings-dialog::after{content:'';position:absolute;inset:1px;border:1px solid rgba(255,222,148,.26);border-radius:20.75px;box-shadow:inset 0 0 0 1px rgba(120,76,12,.11),0 0 8px rgba(229,178,78,.065);pointer-events:none;z-index:40}
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
  const helpShellReplacement = `        /* V4.06 accepted UI polish: stable Help frame and shared premium controls. */\n        '.help-dialog{position:relative;border-color:rgba(238,194,99,.94);box-shadow:0 24px 90px #000c,inset 0 0 0 1px rgba(255,235,184,.09),inset 0 1px rgba(255,247,224,.13),0 0 28px rgba(215,164,67,.14)}.help-dialog::after{content:"";position:absolute;inset:1px;border:1px solid rgba(255,222,148,.38);border-radius:11.75px;box-shadow:inset 0 0 0 1px rgba(120,76,12,.10),0 0 9px rgba(229,178,78,.08);pointer-events:none;z-index:40}.help-close{position:relative;display:grid;place-items:center;color:transparent;font-size:0;line-height:0;background:transparent}.help-close img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}.help-copy{display:grid;place-items:center;color:transparent;font-size:0;line-height:0}.help-copy img{display:block;width:34px;height:34px;object-fit:contain;pointer-events:none;transition:transform .16s ease,filter .16s ease}.help-section-icon{display:grid!important;place-items:center!important;line-height:0!important;text-align:center}.help-section-icon svg{display:block;width:24px;height:24px;overflow:visible;filter:drop-shadow(0 0 2px rgba(226,180,74,.22))}.help-section-icon[data-help-icon="prerequisites"] svg{width:27px;height:27px}.help-section-icon[data-help-icon="functions"] svg{width:25px;height:25px}.help-close:active img,.help-copy:active img{transform:scale(.97);filter:brightness(.92)}@media(hover:hover) and (pointer:fine){.help-dialog{border-color:rgba(244,201,108,.99);box-shadow:0 24px 90px #000c,inset 0 0 0 1px rgba(255,235,184,.10),inset 0 1px rgba(255,247,224,.14),0 0 0 1px rgba(246,203,110,.42),0 0 30px rgba(215,164,67,.16)}.help-dialog::after{border-color:rgba(255,228,158,.50);box-shadow:inset 0 0 0 1px rgba(120,76,12,.10),0 0 10px rgba(229,178,78,.11)}.help-close:hover,.help-copy:hover{filter:none;background:transparent}.help-close:hover img,.help-copy:hover img{filter:brightness(1.12) drop-shadow(0 0 2px #dba34c70)}}@media(hover:none) and (pointer:coarse){.help-close:focus-visible{outline:none}}' +\n        '</style><dialog class="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title"><header class="help-head"><span class="help-emblem" aria-hidden="true">?</span><div><h2 id="help-title"></h2><p class="help-subtitle"></p></div><button class="help-close" type="button" aria-label="Close"><img src="' + ABOUT_CLOSE_IMAGE + '" alt="" width="34" height="34" draggable="false"></button></header><div class="help-content"></div></dialog>';`;
  result = once(result, helpShellAnchor, helpShellReplacement, 'help-frame-and-premium-close');

  const helpIconsAnchor = `        const icons={prerequisites:'⌂',radii:'◎',location:'⌖',functions:'⚙',defaults:'✓',troubleshooting:'!',recorder:'▤'};`;
  const helpIconsReplacement = `        const icons={prerequisites:'⌂',radii:'◎',location:'⌖',functions:'⚙',defaults:'✓',troubleshooting:'!',recorder:'▤'};\n        /* Deterministic Help icons remove platform font-baseline drift on iPad/iPad Pro. */\n        const premiumFunctionsIcon='<svg viewBox="0 0 96 96" aria-hidden="true" focusable="false"><defs><linearGradient id="helpFunctionsRingV3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8f6420"/><stop offset=".28" stop-color="#ffe8a6"/><stop offset=".56" stop-color="#c48a30"/><stop offset=".82" stop-color="#f7d77f"/><stop offset="1" stop-color="#704813"/></linearGradient></defs><path d="M39.2,26.8 L42.4,25.7 L42.8,18.5 L53.2,18.5 L53.6,25.7 L56.8,26.8 L59.8,28.3 L65.2,23.4 L72.6,30.8 L67.7,36.2 L69.2,39.2 L70.3,42.4 L77.5,42.8 L77.5,53.2 L70.3,53.6 L69.2,56.8 L67.7,59.8 L72.6,65.2 L65.2,72.6 L59.8,67.7 L56.8,69.2 L53.6,70.3 L53.2,77.5 L42.8,77.5 L42.4,70.3 L39.2,69.2 L36.2,67.7 L30.8,72.6 L23.4,65.2 L28.3,59.8 L26.8,56.8 L25.7,53.6 L18.5,53.2 L18.5,42.8 L25.7,42.4 L26.8,39.2 L28.3,36.2 L23.4,30.8 L30.8,23.4 L36.2,28.3 Z" fill="#c99b3f" stroke="#efcb73" stroke-width="1.6" stroke-linejoin="round"/><circle cx="48" cy="48" r="16.5" fill="#0c161d" stroke="url(#helpFunctionsRingV3)" stroke-width="4"/><circle cx="48" cy="48" r="5.5" fill="none" stroke="#f2cf78" stroke-width="2"/></svg>';\n        const deterministicHelpIcons={prerequisites:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 10.5 12 3.5l8.5 7v9h-6v-5h-5v5h-6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>',radii:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4.7" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="1.25" fill="currentColor"/></svg>',location:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 2.8v4M12 17.2v4M2.8 12h4M17.2 12h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',functions:premiumFunctionsIcon,defaults:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m4.8 12.5 4.2 4.2 10.2-10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',troubleshooting:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4.3v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="18.4" r="1.35" fill="currentColor"/></svg>',recorder:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="3.8" width="14" height="16.4" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 8h8M8 12h8M8 16h8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'};`;
  result = once(result, helpIconsAnchor, helpIconsReplacement, 'help-functions-premium-gear-source');

  const helpIconAssignAnchor = `          icon.className='help-section-icon';icon.setAttribute('aria-hidden','true');icon.textContent=icons[section.key]||'•';title.textContent=section.title;chevron.className='help-chevron';`;
  const helpIconAssignReplacement = `          icon.className='help-section-icon';icon.dataset.helpIcon=section.key;icon.setAttribute('aria-hidden','true');icon.innerHTML=deterministicHelpIcons[section.key]||icons[section.key]||'•';title.textContent=section.title;chevron.className='help-chevron';`;
  result = once(result, helpIconAssignAnchor, helpIconAssignReplacement, 'help-functions-premium-gear-render');

  const helpCopyAnchor = `button.setAttribute('aria-label',help.copy);button.textContent='⧉';status.className='help-copy-status';`;
  const helpCopyReplacement = `button.setAttribute('aria-label',help.copy);const copyImage=document.createElement('img');copyImage.src=ABOUT_COPY_IMAGE;copyImage.alt='';copyImage.width=34;copyImage.height=34;copyImage.draggable=false;button.append(copyImage);status.className='help-copy-status';`;
  result = once(result, helpCopyAnchor, helpCopyReplacement, 'help-recorder-premium-scroll-copy');

  return result;
}

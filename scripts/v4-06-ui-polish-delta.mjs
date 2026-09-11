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
            border-color:rgba(213,171,83,.78);
            box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,236,181,.16),inset 0 0 0 3px rgba(205,169,80,.045),inset 0 1px rgba(255,244,213,.10),0 0 26px rgba(207,159,60,.075)
          }
          .settings-premium-link{display:flex!important;align-items:center!important;justify-content:flex-start!important;text-align:left!important}
          .settings-premium-link>span:last-child{min-width:0;text-align:left}
          @media(max-width:520px) and (orientation:portrait){
            .settings-premium-links{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
            .settings-premium-link{min-width:0;padding-left:10px!important;padding-right:9px!important;gap:7px!important}
            .settings-premium-icon{flex-basis:22px;width:22px;height:22px}
            .settings-premium-link>span:last-child{white-space:normal;line-height:1.15}
          }
`;
  result = once(result, settingsAnchor, settingsAnchor + settingsPolish, 'settings-frame-and-action-tiles');

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

  return result;
}

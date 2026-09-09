import {languageOnboardingDelta} from './language-onboarding-delta.mjs';
// Explicit, reviewable exceptions to the frozen public V4.05 frontend.
export function approvedDelta(baseline) {
  const once=(text,from,to)=>{if(text.split(from).length!==2)throw Error('Baseline anchor changed: '+from.slice(0,80));return text.replace(from,to);};
  let result=once(baseline,"  const ABOUT_DEDICATION = 'Danke, dass du mir die Zeit lässt, meinen Interessen und meiner Begeisterung für Technik, Wetter und all den Ideen dazwischen nachzugehen – und mich Projekten wie Gewitterradar mit so viel Freude und Ausdauer zu widmen.';", "  const ABOUT_CLOSE_IMAGE = new URL('./assets/gewitterradar-about-close-premium.webp', import.meta.url).href;\n  const ABOUT_COPY_IMAGE = new URL('./assets/gewitterradar-about-copy-scroll.webp', import.meta.url).href;");
  result=once(result,"      entities:'Verwendete Entitäten & Funktionen', entitiesSubtitle:'Eine Übersicht aller verwendeten Entitäten und ihrer Funktionen.', native:'Native Gewitterradar-Konfiguration', legacy:'Legacy-Fallback / Kompatibilität',", "      entities:'Verwendete Entitäten & Funktionen', entitiesSubtitle:'Eine Übersicht aller verwendeten Entitäten und ihrer Funktionen.', native:'Native Gewitterradar-Konfiguration', sourceNative:'Native', legacy:'Legacy-Fallback / Kompatibilität',");
  result=once(result,"      entities:'Entities & functions used', entitiesSubtitle:'An overview of the entities used and their functions.', native:'Native Gewitterradar configuration', legacy:'Legacy fallback / compatibility',", "      entities:'Entities & functions used', entitiesSubtitle:'An overview of the entities used and their functions.', native:'Native Gewitterradar configuration', sourceNative:'Native', legacy:'Legacy fallback / compatibility',");
  result=once(result,"      footer:'Jederzeit über Einstellungen → Über Gewitterradar erneut aufrufbar.'", "      dedicationTitle:'Für Alkje', dedicationText:'Danke, dass du mir die Zeit lässt, meinen Interessen und meiner Begeisterung für Technik, Wetter und all den Ideen dazwischen nachzugehen – und mich Projekten wie Gewitterradar mit so viel Freude und Ausdauer zu widmen.',\n      footer:'Jederzeit über Einstellungen → Über Gewitterradar erneut aufrufbar.'");
  result=once(result,"      footer:'Available any time under Settings → About Gewitterradar.'", "      dedicationTitle:'For Alkje', dedicationText:'Thank you for giving me the time to pursue the interests and enthusiasm I have for technology, weather, and all the ideas in between – and to devote myself to projects like Gewitterradar with so much joy and perseverance.',\n      footer:'Available any time under Settings → About Gewitterradar.'");
  result=once(result,'<h3>Für Alkje</h3><p></p>', '<h3 data-about-text="dedicationTitle"></h3><p data-about-text="dedicationText"></p>');
  result=once(result,'      shell.querySelector(\'.about-dedication p\').textContent = ABOUT_DEDICATION;\n','');
  result=once(result,"resolved === mapping.native ? 'Native' :", "resolved === mapping.native ? t('sourceNative') :");
  result=once(result,'<span aria-hidden="true">×</span></button></header>','<span aria-hidden="true"><img src="${ABOUT_CLOSE_IMAGE}" alt="" width="34" height="34" draggable="false"></span></button></header>');
  result=once(result,'aria-label="Copy YAML">${icon(\'copy\')}</button>','aria-label="Copy YAML"><img src="${ABOUT_COPY_IMAGE}" alt="" width="28" height="28" draggable="false"></button>');
  result=once(result,'V4.05 DEV · Visual V2','V4.05 · Visual V2');
  result=once(result,"radiusInfo:'Die Radien helfen, Gewitter frühzeitig einzuschätzen und die aktuelle Situation schnell und übersichtlich zu beurteilen.'","radiusInfo:'Die Radien helfen, Gewitter frühzeitig einzuschätzen und die aktuelle Situation schnell und übersichtlich zu beurteilen. Die Radien bauen aufeinander auf: Ein Blitz im Gefahrenradius zählt zugleich zum Gewitter- und Beobachtungsradius.'");
  const css=`        /* Approved post-V4.05 controls: visual shell only; handlers/hit targets unchanged. */
        .about-close span{position:relative;border:0;background:none;overflow:visible}
        .about-close span img{position:absolute;left:50%;top:50%;width:34px;height:34px;max-width:none;object-fit:contain;transform:translate(-50%,-50%);filter:none;pointer-events:none}
        .about-dialog .about-code-meta .about-copy{appearance:none;border:0;background:none;box-shadow:none;outline:none;-webkit-tap-highlight-color:transparent}
        .about-code-wrap code{font-family:inherit}
        @media(max-width:620px){.about-dedication-copy p{max-width:60%}}
        .about-code-meta .about-copy::before{content:none}
        .about-copy>img{position:relative;display:block;width:28px;height:28px;object-fit:contain;pointer-events:none;filter:none}
        .about-close:focus-visible{outline:2px solid #ffe1a1;outline-offset:-2px;border-radius:5px}
        .about-copy:focus-visible>img{filter:brightness(1.15) drop-shadow(1px 0 0 #ffe1a1) drop-shadow(-1px 0 0 #ffe1a1) drop-shadow(0 1px 0 #ffe1a1) drop-shadow(0 -1px 0 #ffe1a1)}
        @media(hover:hover) and (pointer:fine){.about-close:hover img,.about-copy:hover:not(:focus-visible) img{filter:brightness(1.12) drop-shadow(0 0 2px #dba34c70)}}
        .about-close:active img{transform:translate(-50%,calc(-50% + .5px)) scale(.97);filter:brightness(.92)}.about-copy:active:not(:focus-visible) img{transform:translateY(.5px) scale(.97);filter:brightness(.92)}
`;
  return languageOnboardingDelta(once(result,'      </style>\n      <dialog class="about-dialog"',css+'      </style>\n      <dialog class="about-dialog"'));
}

import { PREMIUM_INFO, premiumEscape } from '../weather/premium-ui.js?v=41213r1';

export const PRO_WELCOME_DISMISSED = 'gewitterradar-pro-welcome-dismissed';
const WEATHER_ROUTER_GITHUB = 'https://github.com/TheDaimos/weather-router-pub';

const PRECIPITATION = new URL('../../assets/gr-precipitation-premium-original.png', import.meta.url).href;
const WIND = new URL('../../assets/gr-wind-animation-toggle-premium-v1-272.webp', import.meta.url).href;
const TEMPERATURE = new URL('../../assets/gr-temperature-premium-v1-272.webp', import.meta.url).href;
const SYNOPTIC = new URL('../../assets/gr-synoptic-high-low-isobars-premium-original.png', import.meta.url).href;

const STYLE = `
  .gr-pro-welcome[open]{display:flex;flex-direction:column}
  .gr-pro-welcome{box-sizing:border-box;width:min(736px,calc(100% - 20px));max-width:none;
    max-height:calc(100% - 20px);max-height:calc(100dvh - 20px);color:#f4f5f7;color-scheme:dark;
    border-radius:18px;padding:3px;overflow:hidden;isolation:isolate;container-type:inline-size;
    font:15px/1.35 'Segoe UI',Arial,sans-serif;text-align:start}
  .gr-pro-welcome::backdrop{background:#02070da6;backdrop-filter:blur(2px)}
  .gr-pro-scroll{min-height:0;overflow:auto;overscroll-behavior:contain;border-radius:13px;
    background:radial-gradient(ellipse at 8% 40%,#24374644,transparent 65%),#090e14}
  .gr-pro-hero{position:relative;isolation:isolate;display:flex;align-items:center;padding:26px 9% 16px 5%;min-height:106px}
  .gr-pro-hero::before,.gr-pro-hero::after{position:absolute;inset:0;z-index:-1;content:''}
  .gr-pro-hero::before{background:var(--gr-pro-storm) right 40%/cover no-repeat;
    filter:grayscale(1) sepia(.8) hue-rotate(155deg) saturate(2) brightness(1.12)}
  .gr-pro-hero::after{background:linear-gradient(90deg,#090e14 0%,#090e1490 50%,transparent 82%),linear-gradient(0deg,#0d151e,transparent 39%)}
  .gr-pro-wordmark{display:block;width:min(100%,590px);height:auto;filter:drop-shadow(0 2px 4px #03070b)}
  .gr-pro-close{position:absolute;z-index:1;top:7px;inset-inline-end:7px;display:grid;place-items:center;
    width:52px;height:52px;padding:0;border:0;border-radius:50%;background:#0a111bd9;cursor:pointer;touch-action:manipulation}
  .gr-pro-close img{width:100%;height:100%;pointer-events:none}
  .gr-pro-welcome :focus-visible{outline:2px solid #76e2ff;outline-offset:2px}
  .gr-pro-intro{position:relative;padding:16px 5% 13px;text-align:center}
  .gr-pro-intro::before,.gr-pro-intro::after{position:absolute;inset-inline:7%;height:1px;content:'';
    background:linear-gradient(90deg,transparent,#55cdec 50%,transparent);filter:drop-shadow(0 0 5px #00cfff)}
  .gr-pro-intro::before{top:0}.gr-pro-intro::after{bottom:0}
  .gr-pro-intro h2{margin:0 0 6px;color:#ffdd8e;font-size:clamp(24px,6cqi,42px);line-height:1.1;font-weight:750}
  .gr-pro-intro p{max-width:54ch;margin:0 auto;color:#e0e5eb;font-size:clamp(14px,2.7cqi,20px)}
  .gr-pro-features{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;list-style:none;margin:0;padding:15px 4%}
  .gr-pro-feature.gr-premium-metal-surface{display:grid;grid-template-columns:clamp(30px,10cqi,72px) minmax(0,1fr);
    gap:clamp(5px,2cqi,14px);align-items:center;min-height:clamp(58px,12cqi,85px);box-sizing:border-box;
    padding:6px clamp(5px,1.7cqi,13px);border-width:1px;border-radius:11px;box-shadow:0 3px 10px #0008}
  .gr-pro-feature img,.gr-pro-isobars{width:100%;aspect-ratio:1;object-fit:contain}
  .gr-pro-isobars{position:relative;display:grid;place-items:center}
  .gr-pro-isobars i,.gr-pro-isobars::before,.gr-pro-isobars::after{position:absolute;content:'';aspect-ratio:1.37;
    border:1.5px solid #edc267;border-radius:45% 55% 52% 48%;transform:rotate(-16deg);box-shadow:0 0 5px #edc2678a}
  .gr-pro-isobars::before{width:85%}.gr-pro-isobars::after{width:65%}.gr-pro-isobars i{width:42%;border-color:#7fe1ed}
  .gr-pro-tile-copy{border-inline-start:1px solid #c5a35c80;padding-inline-start:clamp(5px,2cqi,14px);
    font-size:clamp(12px,2.65cqi,19px);line-height:1.18;overflow-wrap:anywhere}
  .gr-pro-tile-copy small{display:block;margin-top:3px;color:#d7dbe0;font-size:.88em}
  .gr-pro-note{display:flex;justify-content:center;align-items:center;gap:9px;margin:0;padding:11px 5%;text-align:center;
    color:#dbe4eb;border-block:1px solid #a4bfd93c;background:linear-gradient(90deg,transparent,#50698029,transparent)}
  .gr-pro-note img{width:22px;height:22px;object-fit:contain;filter:hue-rotate(150deg) saturate(1.4)}
  .gr-pro-actions{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.62fr) minmax(0,1.36fr);
    align-items:center;gap:12px;padding:16px 4% 19px}
  .gr-pro-actions label{display:flex;align-items:center;min-height:44px;gap:9px;cursor:pointer;overflow-wrap:anywhere}
  .gr-pro-actions input{flex:none;width:20px;height:20px;margin:0;accent-color:#f6d37e}
  .gr-pro-actions button,.gr-pro-actions a{box-sizing:border-box;min-height:44px;display:flex;align-items:center;justify-content:center;
    gap:8px;border:1px solid #b99448;border-radius:10px;padding:7px 9px;font:inherit;text-align:center;line-height:1.15;
    color:#f7f7f7;background:#111820;text-decoration:none;touch-action:manipulation;cursor:pointer;overflow-wrap:anywhere}
  .gr-pro-actions a{background:linear-gradient(165deg,#fff1bd,#efc971 51%,#ad772f);color:#16120a;font-weight:750;
    box-shadow:0 0 0 1px #70dbf9,0 0 12px #008dd480,inset 0 0 0 1px #fff0c9}
  .gr-pro-actions a span[aria-hidden]{font-size:1.35em;flex:none}
  .gr-pro-error{grid-column:1/-1;margin:0;color:#ffcf88}.gr-pro-error:empty{display:none}
  @container(max-width:560px){
    .gr-pro-close{width:44px;height:44px}
    .gr-pro-hero{padding:26px 10% 7px 4%;min-height:0}
    .gr-pro-actions{grid-template-columns:minmax(0,.7fr) minmax(0,1.3fr);gap:8px;padding-block:9px 12px}
    .gr-pro-actions label{grid-column:1/-1}
  }
`;

export function openProWelcome(owner, images, storage, writable) {
  const t = key => premiumEscape(owner._t('pro.welcome.' + key));
  const art = src => `<img src="${src}" alt="" draggable="false">`;
  const tiles = [
    ['precipitation', art(PRECIPITATION), 'DWD · OPERA · NASA'],
    ['wind', art(WIND), t('windDetail')],
    ['temperature', art(TEMPERATURE)],
    ['fronts', art(SYNOPTIC)],
    ['isobars', '<span class="gr-pro-isobars" aria-hidden="true"><i></i></span>'],
    ['layers', art(images.layers)],
  ];
  const shell = document.createElement('div');
  shell.innerHTML = `<style>${STYLE}</style>
    <dialog class="gr-pro-welcome gr-premium-metal-surface" tabindex="-1" aria-labelledby="gr-pro-title" aria-describedby="gr-pro-intro gr-pro-note">
      <button class="gr-pro-close" type="button" aria-label="${premiumEscape(owner._t('about.close'))}">${art(images.close)}</button>
      <div class="gr-pro-scroll">
        <header class="gr-pro-hero" style="--gr-pro-storm:url('${images.hero}')">
          <img class="gr-pro-wordmark" src="${images.wordmark}" alt="GewitterRadar PRO – powered by · WeatherRouter" width="1190" height="348" draggable="false">
        </header>
        <div class="gr-pro-intro"><h2 id="gr-pro-title">${t('title')}</h2><p id="gr-pro-intro">${t('description')}</p></div>
        <ul class="gr-pro-features">${tiles.map(([key, icon, detail]) => `
          <li class="gr-pro-feature gr-premium-metal-surface">${icon}<span class="gr-pro-tile-copy"><strong>${t(key)}</strong>${detail ? `<small>${detail}</small>` : ''}</span></li>`).join('')}
        </ul>
        <p class="gr-pro-note" id="gr-pro-note">${art(PREMIUM_INFO)}<span>${t('missing')}</span></p>
        <footer class="gr-pro-actions">
          <label><input type="checkbox" ${writable ? '' : 'disabled'}><span>${t('dismiss')}</span></label>
          <button class="gr-pro-later" type="button">${t('later')}</button>
          <a href="${WEATHER_ROUTER_GITHUB}" target="_blank" rel="noopener noreferrer"><span>${t('github')}</span><span aria-hidden="true">↗</span></a>
          <p class="gr-pro-error" role="status"></p>
        </footer>
      </div>
    </dialog>`;
  const dialog = shell.querySelector('dialog');
  const checkbox = dialog.querySelector('input');
  checkbox.addEventListener('change', () => {
    const error = dialog.querySelector('.gr-pro-error');
    try {
      if (checkbox.checked) storage.setItem(PRO_WELCOME_DISMISSED, '1');
      else storage.removeItem(PRO_WELCOME_DISMISSED);
      error.textContent = '';
    } catch (_) {
      checkbox.checked = !checkbox.checked;
      error.textContent = owner._t('vault.genericError');
    }
  });
  for (const button of dialog.querySelectorAll('button')) button.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    shell.remove();
    if (owner._proWelcomeDialog === dialog) owner._proWelcomeDialog = null;
    images.onClose?.();
    owner._maybeShowFirstSteps?.();
  }, {once:true});
  owner.shadow.append(shell);
  dialog.showModal();
  // Focus the dialog on first open, without highlighting the premium close
  // artwork. Real keyboard navigation still uses the existing :focus-visible.
  dialog.focus({preventScroll:true});
  return dialog;
}

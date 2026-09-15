function once(source,from,to,label){
  if(source.split(from).length!==2) throw new Error(`V4.07.39 anchor changed (${label})`);
  return source.replace(from,to);
}

export function v407Test39CoordinateSavedTargetDelta(source){
  let result=source;
  result=once(result,
    "  const CARD_DISPLAY_VERSION = '4.07.38';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST38-2026-09-15';",
    "  const CARD_DISPLAY_VERSION = '4.07.39';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST39-2026-09-15';",'version');

  result=once(result,
    "          .location-saved-star { color:#f6c344;font-size:13px;line-height:1;font-weight:800;text-shadow:0 -1px 0 rgba(255,240,177,.18),0 1px 0 rgba(65,40,5,.9),0 1px 2px rgba(0,0,0,.42);filter:drop-shadow(0 0 1px rgba(229,174,52,.18)); }",
    "          .location-saved-star { color:#f6c344;font-size:13px;line-height:1;font-weight:800;text-shadow:0 -1px 0 rgba(255,240,177,.18),0 1px 0 rgba(65,40,5,.9),0 1px 2px rgba(0,0,0,.42);filter:drop-shadow(0 0 1px rgba(229,174,52,.18)); }\n          .location-saved-target { width:15px;height:15px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 15px;filter:drop-shadow(0 0 1px rgba(86,170,236,.28)); }\n          .location-saved-target img { display:block;width:15px;height:15px;object-fit:contain; }",
    'saved-target-css');

  result=once(result,
`            const star = document.createElement('span');
            star.className = 'location-saved-star';
            star.textContent = '★';
            star.setAttribute('aria-hidden','true');
            const label = document.createElement('span');
            label.className = 'location-saved-copy';
            label.textContent = labelText;
            button.append(star,label);`,
`            const coordinateSaved = String(place.provider || '').trim().toLowerCase() === 'lat / lon';
            const savedIcon = document.createElement('span');
            savedIcon.setAttribute('aria-hidden','true');
            if (coordinateSaved) {
              savedIcon.className = 'location-saved-target';
              const targetImage = document.createElement('img');
              targetImage.src = V407_COORDINATE_TARGET_ICON;
              targetImage.alt = '';
              targetImage.draggable = false;
              savedIcon.appendChild(targetImage);
            } else {
              savedIcon.className = 'location-saved-star';
              savedIcon.textContent = '★';
            }
            const label = document.createElement('span');
            label.className = 'location-saved-copy';
            label.textContent = labelText;
            button.append(savedIcon,label);`,
    'saved-target-render');

  return result;
}

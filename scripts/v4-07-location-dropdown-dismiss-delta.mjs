// V4.07 focused location-menu dismissal polish.
// A pointer/touch outside the open location menu closes it, while interactions
// inside the menu or on either location trigger remain untouched.

function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.07 location-dismiss anchor changed (${label})`);
  }
  return source.replace(from, to);
}

export function v407LocationDropdownDismissDelta(source) {
  const anchor = `      // V3.519 – Einstellungs-Popup öffnen/schließen.`;
  const replacement = `      // V4.07: close the location menu when the user taps/clicks outside it.\n      // Rebind on render so the handler always references the current DOM nodes.\n      if (this._v407LocationOutsidePointerHandler) {\n        document.removeEventListener('pointerdown',this._v407LocationOutsidePointerHandler,true);\n      }\n      this._v407LocationOutsidePointerHandler = (event) => {\n        if (!locationDropdown?.classList.contains('open')) return;\n        const path = typeof event.composedPath === 'function' ? event.composedPath() : [];\n        if (path.includes(locationDropdown) || path.includes(settingsLocationButton) || path.includes(locationMainButton)) return;\n        closeLocationDropdown(false);\n      };\n      document.addEventListener('pointerdown',this._v407LocationOutsidePointerHandler,true);\n\n${anchor}`;

  return once(source, anchor, replacement, 'outside-pointer-dismiss');
}

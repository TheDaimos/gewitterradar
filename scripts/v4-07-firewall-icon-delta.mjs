function once(source, from, to, label) {
  if (source.split(from).length !== 2) {
    throw new Error(`V4.07 firewall-icon anchor changed (${label})`);
  }
  return source.replace(from, to);
}

export function v407FirewallIconDelta(source) {
  let result = source;

  result = once(
    result,
    "  const GEWITTERRADAR_BUILD = 'V4.07-TEST7-2026-09-13';",
    "  const GEWITTERRADAR_BUILD = 'V4.07-TEST8-2026-09-13';",
    'test8-build-marker',
  );

  const previousIcon = String.raw`external_services:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.2 7.4 10.5 10.6M16.8 7.4l-3.3 3.2M12 14.4v2.7" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><circle cx="5.4" cy="5.6" r="2.05" fill="none" stroke="currentColor" stroke-width="1.45"/><circle cx="18.6" cy="5.6" r="2.05" fill="none" stroke="currentColor" stroke-width="1.45"/><circle cx="12" cy="19" r="2.05" fill="none" stroke="currentColor" stroke-width="1.45"/><circle cx="12" cy="12" r="2.65" fill="none" stroke="currentColor" stroke-width="1.65"/><circle cx="12" cy="12" r=".8" fill="currentColor"/></svg>'`;

  const selectedFirewallIcon = String.raw`external_services:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.8c2.25 1.76 4.62 2.75 7.35 3.06v5.25c0 4.72-2.88 8.27-7.35 10.09-4.47-1.82-7.35-5.37-7.35-10.09V5.86C7.38 5.55 9.75 4.56 12 2.8Z" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><rect x="7.15" y="8" width="2.25" height="1.7" rx=".28" fill="currentColor"/><rect x="9.85" y="8" width="2.45" height="1.7" rx=".28" fill="currentColor"/><rect x="7.15" y="10.2" width="3" height="1.7" rx=".28" fill="currentColor"/><rect x="10.6" y="10.2" width="1.7" height="1.7" rx=".28" fill="currentColor"/><rect x="7.15" y="12.4" width="2.25" height="1.7" rx=".28" fill="currentColor"/><rect x="9.85" y="12.4" width="2.45" height="1.7" rx=".28" fill="currentColor"/><path d="M13.2 8.95h3.25m-1.15-1.15 1.2 1.15-1.2 1.15M16.5 13.55h-3.25m1.15-1.15-1.2 1.15 1.2 1.15" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"/></svg>'`;

  result = once(result, previousIcon, selectedFirewallIcon, 'selected-firewall-network-icon');

  return result;
}

const replaceOnce = (source, from, to, label) => {
  if (source.split(from).length !== 2) throw new Error(`V4.07 TEST10 firewall-icon anchor changed (${label})`);
  return source.replace(from,to);
};

export function v407FirewallIconVariant2Delta(source) {
  let result = source;

  result = replaceOnce(
    result,
    "const GEWITTERRADAR_BUILD = 'V4.07-TEST9R2-2026-09-13';",
    "const GEWITTERRADAR_BUILD = 'V4.07-TEST10-2026-09-13';",
    'build marker'
  );

  const test8FirewallIcon = String.raw`external_services:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.8c2.25 1.76 4.62 2.75 7.35 3.06v5.25c0 4.72-2.88 8.27-7.35 10.09-4.47-1.82-7.35-5.37-7.35-10.09V5.86C7.38 5.55 9.75 4.56 12 2.8Z" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><rect x="7.15" y="8" width="2.25" height="1.7" rx=".28" fill="currentColor"/><rect x="9.85" y="8" width="2.45" height="1.7" rx=".28" fill="currentColor"/><rect x="7.15" y="10.2" width="3" height="1.7" rx=".28" fill="currentColor"/><rect x="10.6" y="10.2" width="1.7" height="1.7" rx=".28" fill="currentColor"/><rect x="7.15" y="12.4" width="2.25" height="1.7" rx=".28" fill="currentColor"/><rect x="9.85" y="12.4" width="2.45" height="1.7" rx=".28" fill="currentColor"/><path d="M13.2 8.95h3.25m-1.15-1.15 1.2 1.15-1.2 1.15M16.5 13.55h-3.25m1.15-1.15-1.2 1.15 1.2 1.15" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"/></svg>'`;

  // Shield variant 2: intentionally reduced to the protective shield plus a clear
  // RJ45/network-port motif so it remains legible at the small Help-menu icon size.
  const shieldNetworkPortIcon = String.raw`external_services:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.8c2.25 1.76 4.62 2.75 7.35 3.06v5.25c0 4.72-2.88 8.27-7.35 10.09-4.47-1.82-7.35-5.37-7.35-10.09V5.86C7.38 5.55 9.75 4.56 12 2.8Z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><rect x="7.7" y="7.55" width="8.6" height="8.15" rx="1" fill="none" stroke="currentColor" stroke-width="1.45"/><path d="M9.35 9v1.55M10.7 9v1.55M12 9v1.55M13.3 9v1.55M14.65 9v1.55M9.1 11.7h5.8v2.05h-1.35v1.05h-3.1v-1.05H9.1Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>'`;

  result = replaceOnce(result,test8FirewallIcon,shieldNetworkPortIcon,'shield-variant-2');
  return result;
}

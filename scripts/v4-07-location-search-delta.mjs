const replaceOnce = (text, from, to) => {
  if (text.split(from).length !== 2) throw new Error(`V4.07 anchor changed: ${from.slice(0, 120)}`);
  return text.replace(from, to);
};

const replaceRangeOnce = (text, startMarker, endMarker, replacement) => {
  const start = text.indexOf(startMarker);
  if (start < 0) throw new Error(`V4.07 range start missing: ${startMarker}`);
  const endStart = text.indexOf(endMarker, start + startMarker.length);
  if (endStart < 0) throw new Error(`V4.07 range end missing: ${endMarker}`);
  const secondStart = text.indexOf(startMarker, start + startMarker.length);
  if (secondStart >= 0) throw new Error(`V4.07 range start is not unique: ${startMarker}`);
  const end = endStart + endMarker.length;
  return text.slice(0, start) + replacement + text.slice(end);
};

const SEARCH_CSS = `          /* V4.07 TEST CANDIDATE – worldwide reference-location search. */
          .location-section-label {
            padding:8px 12px 5px;color:#7f9ab5;font-size:9px;font-weight:800;
            letter-spacing:.12em;text-transform:uppercase;pointer-events:none;
          }
          .location-section-empty { padding:7px 12px 10px;color:#60758b;font-size:10px; }
          .location-section-divider { height:1px;margin:5px 9px;background:linear-gradient(90deg,transparent,rgba(79,163,247,.22),transparent); }
          .location-search-action {
            appearance:none;-webkit-appearance:none;width:100%;min-height:38px;border:0;background:transparent;
            color:#d9ecff;display:flex;align-items:center;gap:9px;padding:7px 12px;text-align:left;
            font:650 11px/1.2 inherit;cursor:pointer;
          }
          .location-search-action:hover,.location-search-action:focus-visible { outline:none;background:rgba(79,163,247,.09); }
          .location-search-action .location-search-icon { font-size:14px;line-height:1; }
          .v407-location-search-backdrop {
            position:fixed;inset:0;z-index:2147483647;display:none;place-items:center;padding:16px;
            box-sizing:border-box;background:rgba(2,7,14,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
          }
          .v407-location-search-backdrop.open { display:grid; }
          .v407-location-search-dialog {
            width:min(560px,calc(100vw - 24px));max-height:min(760px,calc(100dvh - 24px));overflow:auto;
            box-sizing:border-box;border:1px solid rgba(111,163,214,.24);border-radius:16px;
            background:linear-gradient(180deg,rgba(18,28,40,.985),rgba(8,14,23,.995));
            box-shadow:0 28px 90px rgba(0,0,0,.72),0 0 34px rgba(79,163,247,.08);color:#e8f2fb;
          }
          .v407-location-search-head { display:flex;align-items:center;justify-content:space-between;gap:16px;padding:15px 16px 11px;border-bottom:1px solid rgba(111,163,214,.14); }
          .v407-location-search-head strong { font-size:14px;letter-spacing:.01em; }
          .v407-location-search-close { appearance:none;border:0;background:transparent;color:#9fb8ce;font-size:24px;line-height:1;cursor:pointer;padding:2px 5px; }
          .v407-location-search-body { padding:14px 16px 16px; }
          .v407-location-search-grid { display:grid;grid-template-columns:minmax(0,1fr) minmax(170px,.55fr) auto;gap:9px;align-items:end; }
          .v407-location-search-field { position:relative;display:grid;gap:5px; }
          .v407-location-search-field label { color:#8aa6bf;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase; }
          .v407-location-search-field input {
            width:100%;box-sizing:border-box;min-height:38px;border:1px solid rgba(116,160,199,.24);border-radius:9px;
            background:rgba(5,12,20,.78);color:#edf7ff;padding:8px 10px;font:500 12px/1.2 inherit;outline:none;
          }
          .v407-location-search-field input:focus { border-color:rgba(79,163,247,.62);box-shadow:0 0 0 2px rgba(79,163,247,.10); }
          .v407-location-search-submit {
            min-height:38px;border:1px solid rgba(79,163,247,.42);border-radius:9px;background:rgba(34,105,168,.26);
            color:#e7f4ff;padding:8px 13px;font:750 11px/1 inherit;cursor:pointer;
          }
          .v407-location-search-submit:disabled { opacity:.48;cursor:wait; }
          .v407-country-suggestions {
            position:absolute;left:0;right:0;top:100%;z-index:3;display:none;max-height:220px;overflow:auto;
            margin-top:4px;border:1px solid rgba(116,160,199,.24);border-radius:9px;background:#0b1521;box-shadow:0 16px 42px rgba(0,0,0,.55);
          }
          .v407-country-suggestions.open { display:block; }
          .v407-country-suggestion { width:100%;border:0;background:transparent;color:#dbeaf7;text-align:left;padding:8px 10px;font:500 11px/1.2 inherit;cursor:pointer; }
          .v407-country-suggestion:hover,.v407-country-suggestion:focus-visible { outline:none;background:rgba(79,163,247,.10); }
          .v407-location-search-status { min-height:20px;margin:10px 0 2px;color:#9ab3c8;font-size:10px;line-height:1.45; }
          .v407-location-search-status.error { color:#ffb2ab; }
          .v407-location-results { display:grid;gap:8px;margin-top:10px; }
          .v407-location-result { display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;padding:10px 11px;border:1px solid rgba(111,163,214,.16);border-radius:11px;background:rgba(255,255,255,.025); }
          .v407-location-result-title { font-size:12px;font-weight:750;color:#edf7ff; }
          .v407-location-result-meta { margin-top:3px;color:#8199ae;font-size:9px;line-height:1.35; }
          .v407-location-result-actions { display:flex;align-items:center;gap:6px; }
          .v407-location-result-use,.v407-location-result-save { min-height:32px;border-radius:8px;padding:6px 9px;font:750 10px/1 inherit; }
          .v407-location-result-use { border:1px solid rgba(79,163,247,.42);background:rgba(34,105,168,.24);color:#e8f5ff;cursor:pointer; }
          .v407-location-result-save { border:1px solid rgba(153,169,183,.15);background:rgba(255,255,255,.025);color:#718395;cursor:not-allowed; }
          .v407-location-provider-note { margin-top:12px;color:#61768a;font-size:9px;line-height:1.45; }
          .v407-location-safety-note { margin-top:10px;padding:9px 10px;border-radius:9px;background:rgba(224,158,54,.07);border:1px solid rgba(224,158,54,.15);color:#bca37c;font-size:9px;line-height:1.45; }
          @media (max-width:680px) {
            .v407-location-search-grid { grid-template-columns:1fr; }
            .v407-location-search-submit { width:100%; }
            .v407-location-result { grid-template-columns:1fr; }
            .v407-location-result-actions { justify-content:flex-start; }
          }
`;

const SEARCH_RENDER = `      const renderLocationDropdown = () => {
        if (!locationDropdown) return;
        const selected = this._locationOption();
        const options = this._locationOptions();
        const frag = document.createDocumentFragment();
        const text = v407Text();

        const appendHeader = (label) => {
          const node = document.createElement('div');
          node.className = 'location-section-label';
          node.textContent = label;
          frag.appendChild(node);
        };
        const appendEmpty = () => {
          const node = document.createElement('div');
          node.className = 'location-section-empty';
          node.textContent = '—';
          frag.appendChild(node);
        };
        const appendOption = (entityId) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = \`location-option\${entityId === selected ? ' selected' : ''}\`;
          button.dataset.location = entityId;
          button.setAttribute('role','option');
          button.setAttribute('aria-selected',entityId === selected ? 'true' : 'false');
          const dot = document.createElement('i');
          dot.className = 'location-option-dot';
          dot.setAttribute('aria-hidden','true');
          const label = document.createElement('span');
          label.textContent = this._locationLabel(entityId);
          button.append(dot,label);
          frag.appendChild(button);
        };

        const people = options.filter((entityId) => entityId.startsWith('person.'));
        const zones = options.filter((entityId) => entityId.startsWith('zone.'));
        appendHeader(text.people);
        if (people.length) people.forEach(appendOption); else appendEmpty();
        appendHeader(text.zones);
        if (zones.length) zones.forEach(appendOption); else appendEmpty();

        const dividerBeforeSearch = document.createElement('div');
        dividerBeforeSearch.className = 'location-section-divider';
        frag.appendChild(dividerBeforeSearch);
        const search = document.createElement('button');
        search.type = 'button';
        search.className = 'location-search-action';
        search.innerHTML = '<span class="location-search-icon" aria-hidden="true">🔎</span><span></span>';
        search.querySelector('span:last-child').textContent = text.searchAction;
        frag.appendChild(search);

        const dividerBeforeSaved = document.createElement('div');
        dividerBeforeSaved.className = 'location-section-divider';
        frag.appendChild(dividerBeforeSaved);
        appendHeader(text.savedPlaces);
        const savedEmpty = document.createElement('div');
        savedEmpty.className = 'location-section-empty';
        savedEmpty.textContent = text.savedEmpty;
        frag.appendChild(savedEmpty);
        locationDropdown.replaceChildren(frag);
      };`;

const SEARCH_HELPERS = `
      const V407_LANGUAGE_LOCALES = Object.freeze({
        'Deutsch':'de-DE','English':'en','Dansk':'da-DK','Español':'es-ES','Français':'fr-FR','Nederlands':'nl-NL','Polski':'pl-PL','Português':'pt-PT','Svenska':'sv-SE','Italiano':'it-IT','Norsk bokmål':'nb-NO','Suomi':'fi-FI','Čeština':'cs-CZ','Ελληνικά':'el-GR','Magyar':'hu-HU','Boarisch':'de-DE','Plattdüütsch':'de-DE','Sächs’sch':'de-DE','Schwäbisch':'de-DE'
      });
      const V407_ISO_COUNTRY_CODES = 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
      const v407Locale = () => V407_LANGUAGE_LOCALES[this._languageValue()] || navigator.language || 'en';
      const v407IsGermanUi = () => /^de(?:-|$)/i.test(v407Locale());
      const v407Text = () => v407IsGermanUi() ? {
        people:'Personen', zones:'Zonen', searchAction:'Ort suchen …', savedPlaces:'Gespeicherte Orte', savedEmpty:'Noch keine gespeicherten Orte',
        title:'Weltweite Ortssuche', query:'Ort / PLZ', country:'Land (optional)', search:'Suchen', close:'Schließen',
        queryPlaceholder:'z. B. Tromsø oder 27804', countryPlaceholder:'Land oder ISO-Code', searching:'Suche läuft …', noResults:'Kein passender Ort gefunden.',
        providerError:'Die Ortssuche ist derzeit nicht erreichbar.', invalidCountry:'Bitte ein Land aus der lokalen Vorschlagsliste wählen oder das Feld leeren.',
        use:'Nutzen', save:'★ Speichern', saveLater:'Gespeicherte Orte folgen in einem separaten V4.07-Schritt.',
        using:'Bezugsstandort wird gesetzt …', used:'wird jetzt als Gewitterradar-Bezugsstandort verwendet.',
        backendMissing:'V4.07-Tracker-Service bzw. Dashboard-Package nicht gefunden.', useFailed:'Bezugsstandort konnte nicht gesetzt werden.',
        providerNote:'Geocoding: Open-Meteo / GeoNames · bei Bedarf OpenStreetMap Nominatim.',
        safety:'Wichtig: Ein neuer Gewitterradar-Bezugsstandort bestätigt noch nicht, dass Blitzortung bereits passende Live-Daten für diesen Bereich abonniert hat.'
      } : {
        people:'People', zones:'Zones', searchAction:'Search place …', savedPlaces:'Saved places', savedEmpty:'No saved places yet',
        title:'Worldwide place search', query:'Place / postcode', country:'Country (optional)', search:'Search', close:'Close',
        queryPlaceholder:'e.g. Tromsø or 27804', countryPlaceholder:'Country or ISO code', searching:'Searching …', noResults:'No matching place found.',
        providerError:'Location search is currently unavailable.', invalidCountry:'Choose a country from the local suggestions or clear the field.',
        use:'Use', save:'★ Save', saveLater:'Saved places will follow in a separate V4.07 step.',
        using:'Setting reference location …', used:'is now used as the Gewitterradar reference location.',
        backendMissing:'V4.07 tracker service or dashboard package not found.', useFailed:'Reference location could not be set.',
        providerNote:'Geocoding: Open-Meteo / GeoNames · OpenStreetMap Nominatim when needed.',
        safety:'Important: a new Gewitterradar reference location does not prove that Blitzortung already has matching live-data subscriptions for that area.'
      };
      const v407NormalizeText = (value) => String(value || '').normalize('NFKD').replace(/[\\u0300-\\u036f]/g,'').trim().toLocaleLowerCase();
      const v407CountryRecords = () => {
        const locale = v407Locale();
        let localNames = null;
        let englishNames = null;
        try { localNames = new Intl.DisplayNames([locale],{type:'region'}); } catch (_) {}
        try { englishNames = new Intl.DisplayNames(['en'],{type:'region'}); } catch (_) {}
        return V407_ISO_COUNTRY_CODES.map((code) => ({
          code,
          local: localNames?.of(code) || code,
          english: englishNames?.of(code) || code
        }));
      };
      const v407PreferredCountryCode = () => {
        const configured = String(this._hass?.config?.country || '').trim().toUpperCase();
        if (/^[A-Z]{2}$/.test(configured)) return configured;
        const region = String(navigator.language || '').match(/[-_]([A-Za-z]{2})$/)?.[1]?.toUpperCase();
        return /^[A-Z]{2}$/.test(region || '') ? region : '';
      };
      const v407ResolveExplicitCountry = (value, records) => {
        const raw = String(value || '').trim();
        if (!raw) return {code:'',record:null,valid:true};
        const normalized = v407NormalizeText(raw);
        const record = records.find((item) => [item.code,item.local,item.english,\`\${item.local} (\${item.code})\`].some((candidate) => v407NormalizeText(candidate) === normalized));
        return record ? {code:record.code,record,valid:true} : {code:'',record:null,valid:false};
      };
      const v407FetchJson = async (url, timeoutMs = 9000) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(),timeoutMs);
        try {
          const response = await fetch(url,{signal:controller.signal,headers:{Accept:'application/json'}});
          if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
          return await response.json();
        } finally { clearTimeout(timer); }
      };
      const v407CandidateLabel = (candidate) => [candidate.name,candidate.admin1,candidate.country].filter((value,index,array) => value && array.indexOf(value) === index).join(', ');
      const v407NormalizeOpenMeteo = (result) => {
        const latitude = Number(result?.latitude), longitude = Number(result?.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
        const postcodes = Array.isArray(result.postcodes) ? result.postcodes.map(String) : [];
        const candidate = {
          provider:'open-meteo', name:String(result.name || '').trim() || String(result.admin1 || '').trim() || 'Location', latitude, longitude,
          countryCode:String(result.country_code || '').toUpperCase(), country:String(result.country || '').trim(), admin1:String(result.admin1 || '').trim(),
          postcode:postcodes[0] || '', postcodes, importance:Number(result.population || 0)
        };
        candidate.displayLabel = v407CandidateLabel(candidate);
        return candidate;
      };
      const v407NormalizeNominatim = (result) => {
        const latitude = Number(result?.lat), longitude = Number(result?.lon);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
        const address = result?.address || {};
        const name = String(result?.name || address.city || address.town || address.village || address.municipality || address.hamlet || String(result?.display_name || '').split(',')[0] || 'Location').trim();
        const candidate = {
          provider:'nominatim', name, latitude, longitude, countryCode:String(address.country_code || '').toUpperCase(),
          country:String(address.country || '').trim(), admin1:String(address.state || address.region || address.county || '').trim(), postcode:String(address.postcode || '').trim(),
          postcodes:address.postcode ? [String(address.postcode)] : [], importance:Number(result?.importance || 0)
        };
        candidate.displayLabel = v407CandidateLabel(candidate) || String(result?.display_name || name);
        return candidate;
      };
      const v407Dedupe = (items) => {
        const seen = new Set();
        return items.filter((candidate) => {
          if (!candidate) return false;
          const key = \`\${v407NormalizeText(candidate.name)}|\${candidate.countryCode}|\${candidate.latitude.toFixed(4)}|\${candidate.longitude.toFixed(4)}\`;
          if (seen.has(key)) return false;
          seen.add(key); return true;
        });
      };
      const v407Rank = (items, query, countryCode, preferredCountryCode) => {
        const q = v407NormalizeText(query);
        return items.map((candidate,index) => {
          const name = v407NormalizeText(candidate.name), label = v407NormalizeText(candidate.displayLabel), admin = v407NormalizeText(candidate.admin1);
          const postcodes = (candidate.postcodes || [candidate.postcode]).map(v407NormalizeText);
          let score = 0;
          if (countryCode && candidate.countryCode === countryCode) score += 1200;
          if (!countryCode && preferredCountryCode && candidate.countryCode === preferredCountryCode) score += 260;
          if (postcodes.includes(q)) score += 800;
          if (name === q) score += 650;
          else if (name.startsWith(q)) score += 420;
          else if (label.includes(q)) score += 240;
          if (admin.includes(q)) score += 90;
          score += Math.min(80,Math.log10(Math.max(1,Number(candidate.importance || 0))) * 8);
          return {...candidate,_score:score - index / 1000};
        }).sort((a,b) => b._score - a._score);
      };
      const v407PrimaryIsGood = (items, query, countryCode, preferredCountryCode) => {
        if (!items.length) return false;
        const q = v407NormalizeText(query);
        const strong = (candidate) => {
          const postcodes = (candidate.postcodes || [candidate.postcode]).map(v407NormalizeText);
          const name = v407NormalizeText(candidate.name);
          return postcodes.includes(q) || name === q || name.startsWith(q);
        };
        if (countryCode) return items.some((candidate) => candidate.countryCode === countryCode && strong(candidate));
        if (preferredCountryCode && !String(query).includes(',')) return items.some((candidate) => candidate.countryCode === preferredCountryCode && strong(candidate));
        return items.some(strong);
      };
      const v407SearchOpenMeteo = async (query, countryCode) => {
        const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
        url.searchParams.set('name',query); url.searchParams.set('count','100'); url.searchParams.set('format','json');
        url.searchParams.set('language',String(v407Locale()).split('-')[0] || 'en');
        if (countryCode) url.searchParams.set('countryCode',countryCode);
        const payload = await v407FetchJson(url);
        return (Array.isArray(payload?.results) ? payload.results : []).map(v407NormalizeOpenMeteo).filter(Boolean);
      };
      const v407SearchNominatim = async (query, countryCode, preferredCountryCode, records) => {
        const previous = Number(window.__gewitterradarV407NominatimLastCall || 0);
        const delay = Math.max(0,1000 - (Date.now() - previous));
        if (delay) await new Promise((resolve) => setTimeout(resolve,delay));
        window.__gewitterradarV407NominatimLastCall = Date.now();
        const url = new URL('https://nominatim.openstreetmap.org/search');
        const preferred = records.find((item) => item.code === preferredCountryCode);
        const biasedQuery = !countryCode && preferredCountryCode && !String(query).includes(',') && preferred ? \`\${query}, \${preferred.english}\` : query;
        url.searchParams.set('q',biasedQuery); url.searchParams.set('format','jsonv2'); url.searchParams.set('addressdetails','1'); url.searchParams.set('limit','8');
        url.searchParams.set('accept-language',v407Locale());
        if (countryCode) url.searchParams.set('countrycodes',countryCode.toLowerCase());
        const payload = await v407FetchJson(url);
        return (Array.isArray(payload) ? payload : []).map(v407NormalizeNominatim).filter(Boolean);
      };
      const v407UseCandidate = async (candidate) => {
        const data = {latitude:candidate.latitude,longitude:candidate.longitude,name:candidate.name || candidate.displayLabel};
        if (this._hass?.services?.gewitterradar?.set_reference_coordinates) {
          await this._hass.callService('gewitterradar','set_reference_coordinates',data);
          return true;
        }
        if (this._hass?.states?.['script.gewitterradar_set_reference_coordinates_dashboard']) {
          await this._hass.callService('script','gewitterradar_set_reference_coordinates_dashboard',data);
          return true;
        }
        return false;
      };
      const v407EnsureLocationSearchDialog = () => {
        let backdrop = this.shadow.getElementById('v407-location-search-backdrop');
        if (backdrop) return backdrop;
        const text = v407Text();
        backdrop = document.createElement('div');
        backdrop.className = 'v407-location-search-backdrop';
        backdrop.id = 'v407-location-search-backdrop';
        backdrop.innerHTML = \`<section class="v407-location-search-dialog" role="dialog" aria-modal="true" aria-labelledby="v407-location-search-title">
          <header class="v407-location-search-head"><strong id="v407-location-search-title"></strong><button type="button" class="v407-location-search-close" aria-label="\${text.close}">×</button></header>
          <div class="v407-location-search-body"><form class="v407-location-search-grid">
            <div class="v407-location-search-field"><label for="v407-location-query"></label><input id="v407-location-query" type="search" autocomplete="off" spellcheck="false"></div>
            <div class="v407-location-search-field"><label for="v407-location-country"></label><input id="v407-location-country" type="search" autocomplete="off" spellcheck="false"><div class="v407-country-suggestions"></div></div>
            <button type="submit" class="v407-location-search-submit"></button>
          </form><div class="v407-location-search-status" role="status" aria-live="polite"></div><div class="v407-location-results"></div>
          <div class="v407-location-provider-note"></div><div class="v407-location-safety-note"></div></div></section>\`;
        this.shadow.appendChild(backdrop);
        const dialog = backdrop.querySelector('.v407-location-search-dialog');
        const queryInput = backdrop.querySelector('#v407-location-query');
        const countryInput = backdrop.querySelector('#v407-location-country');
        const suggestions = backdrop.querySelector('.v407-country-suggestions');
        const form = backdrop.querySelector('form');
        const submit = backdrop.querySelector('.v407-location-search-submit');
        const status = backdrop.querySelector('.v407-location-search-status');
        const results = backdrop.querySelector('.v407-location-results');
        const records = v407CountryRecords();
        backdrop.querySelector('#v407-location-search-title').textContent = text.title;
        queryInput.previousElementSibling.textContent = text.query; queryInput.placeholder = text.queryPlaceholder;
        countryInput.previousElementSibling.textContent = text.country; countryInput.placeholder = text.countryPlaceholder;
        submit.textContent = text.search; backdrop.querySelector('.v407-location-provider-note').textContent = text.providerNote; backdrop.querySelector('.v407-location-safety-note').textContent = text.safety;
        const close = () => { backdrop.classList.remove('open'); suggestions.classList.remove('open'); };
        backdrop.querySelector('.v407-location-search-close').addEventListener('click',close);
        backdrop.addEventListener('click',(event) => { if (event.target === backdrop) close(); });
        backdrop.addEventListener('keydown',(event) => { if (event.key === 'Escape') { event.preventDefault(); close(); } });
        const renderSuggestions = () => {
          countryInput.dataset.countryCode = '';
          const q = v407NormalizeText(countryInput.value);
          if (!q) { suggestions.classList.remove('open'); suggestions.replaceChildren(); return; }
          const ranked = records.map((record) => {
            const code = v407NormalizeText(record.code), local = v407NormalizeText(record.local), english = v407NormalizeText(record.english);
            let score = 0; if (code === q) score += 1000; if (local === q || english === q) score += 900; if (code.startsWith(q)) score += 700; if (local.startsWith(q) || english.startsWith(q)) score += 500; if (local.includes(q) || english.includes(q)) score += 200;
            return {record,score};
          }).filter((entry) => entry.score > 0).sort((a,b) => b.score-a.score || a.record.local.localeCompare(b.record.local)).slice(0,8);
          suggestions.replaceChildren(...ranked.map(({record}) => {
            const button = document.createElement('button'); button.type='button'; button.className='v407-country-suggestion'; button.textContent=\`\${record.local} (\${record.code})\`;
            button.addEventListener('click',() => { countryInput.value=\`\${record.local} (\${record.code})\`; countryInput.dataset.countryCode=record.code; suggestions.classList.remove('open'); queryInput.focus(); });
            return button;
          }));
          suggestions.classList.toggle('open',ranked.length > 0);
        };
        countryInput.addEventListener('input',renderSuggestions);
        countryInput.addEventListener('focus',renderSuggestions);
        const setStatus = (message,error=false) => { status.textContent=message || ''; status.classList.toggle('error',!!error); };
        const renderResults = (candidates) => {
          results.replaceChildren(...candidates.slice(0,8).map((candidate) => {
            const row = document.createElement('article'); row.className='v407-location-result';
            const copy = document.createElement('div'); const title=document.createElement('div'); title.className='v407-location-result-title'; title.textContent=candidate.displayLabel;
            const meta=document.createElement('div'); meta.className='v407-location-result-meta'; meta.textContent=\`\${candidate.latitude.toFixed(5)}°, \${candidate.longitude.toFixed(5)}° · \${candidate.provider}\${candidate.postcode ? ' · '+candidate.postcode : ''}\`;
            copy.append(title,meta); const actions=document.createElement('div'); actions.className='v407-location-result-actions';
            const use=document.createElement('button'); use.type='button'; use.className='v407-location-result-use'; use.textContent=text.use;
            const save=document.createElement('button'); save.type='button'; save.className='v407-location-result-save'; save.textContent=text.save; save.disabled=true; save.title=text.saveLater;
            use.addEventListener('click',async () => { use.disabled=true; setStatus(text.using); try { const ok=await v407UseCandidate(candidate); if (!ok) throw new Error(text.backendMissing); setStatus(\`\${candidate.name} \${text.used}\`); this._render(); } catch (error) { console.warn('[Gewitterradar V4.07] Bezugsstandort konnte nicht gesetzt werden.',error); setStatus(error?.message===text.backendMissing ? text.backendMissing : text.useFailed,true); } finally { use.disabled=false; } });
            actions.append(use,save); row.append(copy,actions); return row;
          }));
        };
        form.addEventListener('submit',async (event) => {
          event.preventDefault(); suggestions.classList.remove('open');
          const query = String(queryInput.value || '').trim(); if (!query) { queryInput.focus(); return; }
          const country = countryInput.dataset.countryCode ? {code:countryInput.dataset.countryCode,valid:true} : v407ResolveExplicitCountry(countryInput.value,records);
          if (!country.valid) { setStatus(text.invalidCountry,true); countryInput.focus(); return; }
          const countryCode = country.code || '';
          const preferredCountryCode = countryCode ? '' : v407PreferredCountryCode();
          submit.disabled=true; results.replaceChildren(); setStatus(text.searching);
          try {
            const primary = await v407SearchOpenMeteo(query,countryCode);
            let combined = primary;
            const rankedPrimary = v407Rank(v407Dedupe(primary),query,countryCode,preferredCountryCode);
            if (!v407PrimaryIsGood(rankedPrimary,query,countryCode,preferredCountryCode)) {
              const fallback = await v407SearchNominatim(query,countryCode,preferredCountryCode,records);
              combined = [...primary,...fallback];
            }
            const ranked = v407Rank(v407Dedupe(combined),query,countryCode,preferredCountryCode);
            renderResults(ranked); setStatus(ranked.length ? '' : text.noResults,ranked.length === 0);
          } catch (error) { console.warn('[Gewitterradar V4.07] Ortssuche fehlgeschlagen.',error); setStatus(text.providerError,true); }
          finally { submit.disabled=false; }
        });
        dialog.addEventListener('click',(event) => event.stopPropagation());
        return backdrop;
      };
      const openV407LocationSearch = () => {
        const backdrop = v407EnsureLocationSearchDialog();
        backdrop.classList.add('open');
        requestAnimationFrame(() => backdrop.querySelector('#v407-location-query')?.focus({preventScroll:true}));
      };
`;

export function v407LocationSearchDelta(source) {
  let result = source;
  result = replaceOnce(result,"  const CARD_VERSION = '4.06';\n  const GEWITTERRADAR_BUILD = 'V4.06-2026-09-10';","  const CARD_VERSION = '4.07';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST-2026-09-12';");
  result = replaceOnce(result,
    "          .location-dropdown.open { display:block;animation:settingsBackdropIn .14s ease-out both; }\n          .location-option {",
    "          .location-dropdown.open { display:block;animation:settingsBackdropIn .14s ease-out both; }\n" + SEARCH_CSS + "          .location-option {");
  result = replaceOnce(result,
    "      if (entityId === 'zone.home') return this._t('location.home');\n\n      const friendly = hass?.states?.[entityId]?.attributes?.friendly_name;",
    "      if (entityId === 'zone.home') return this._t('location.home');\n\n      const referenceName = hass?.states?.[entityId]?.attributes?.reference_name;\n      if (referenceName) return String(referenceName);\n\n      const friendly = hass?.states?.[entityId]?.attributes?.friendly_name;");
  result = replaceRangeOnce(result,
    "      const renderLocationDropdown = () => {",
    "        locationDropdown.replaceChildren(frag);\n      };",
    SEARCH_RENDER);
  result = replaceOnce(result,
    "      settingsLocationButton?.addEventListener('click',(event) => {",
    SEARCH_HELPERS + "\n      settingsLocationButton?.addEventListener('click',(event) => {");
  result = replaceRangeOnce(result,
    "      locationDropdown?.addEventListener('click',(event) => {",
    "      });\n\n      // V3.519 – Einstellungs-Popup öffnen/schließen.",
    `      locationDropdown?.addEventListener('click',(event) => {
        const search = event.target?.closest?.('.location-search-action');
        if (search) {
          event.preventDefault(); event.stopPropagation();
          closeLocationDropdown(false);
          openV407LocationSearch();
          return;
        }
        const option = event.target?.closest?.('.location-option');
        const value = option?.dataset?.location;
        if (!value || !this._locationOptions().includes(value)) return;
        event.preventDefault();
        event.stopPropagation();
        setLocationOption(value);
        closeLocationDropdown(false);
        this._render();
      });

      // V3.519 – Einstellungs-Popup öffnen/schließen.`);
  return result;
}

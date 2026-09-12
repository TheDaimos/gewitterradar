const replaceOnce = (text, from, to) => {
  if (text.split(from).length !== 2) throw new Error(`V4.07 country-groups anchor changed: ${from.slice(0, 140)}`);
  return text.replace(from, to);
};

const replaceRangeOnce = (text, startMarker, endMarker, replacement) => {
  const start = text.indexOf(startMarker);
  if (start < 0) throw new Error(`V4.07 country-groups range start missing: ${startMarker}`);
  const end = text.indexOf(endMarker, start + startMarker.length);
  if (end < 0) throw new Error(`V4.07 country-groups range end missing: ${endMarker}`);
  const secondStart = text.indexOf(startMarker, start + startMarker.length);
  if (secondStart >= 0) throw new Error(`V4.07 country-groups range start is not unique: ${startMarker}`);
  return text.slice(0, start) + replacement + text.slice(end);
};

const COUNTRY_GROUP_CSS = `
          .v407-country-filterbar { display:flex;gap:6px;overflow-x:auto;overscroll-behavior-inline:contain;padding:2px 0 9px;scrollbar-width:thin; }
          .v407-country-filter { flex:0 0 auto;appearance:none;-webkit-appearance:none;min-height:30px;border:1px solid rgba(111,163,214,.18);border-radius:999px;background:rgba(255,255,255,.025);color:#adc2d5;padding:5px 9px;font:700 9px/1 inherit;cursor:pointer;white-space:nowrap; }
          .v407-country-filter:hover,.v407-country-filter:focus-visible { outline:none;border-color:rgba(79,163,247,.42);background:rgba(79,163,247,.08);color:#e2f2ff; }
          .v407-country-filter.active { border-color:rgba(79,163,247,.55);background:rgba(34,105,168,.24);color:#eef8ff;box-shadow:0 0 0 1px rgba(79,163,247,.07) inset; }
          .v407-country-summary { margin:0 0 8px;color:#7f98ad;font-size:9px;line-height:1.35; }
          .v407-country-group { border:1px solid rgba(111,163,214,.14);border-radius:11px;background:rgba(255,255,255,.018);overflow:hidden; }
          .v407-country-group + .v407-country-group { margin-top:8px; }
          .v407-country-group > summary { list-style:none;display:flex;align-items:center;gap:8px;min-height:37px;padding:7px 10px;box-sizing:border-box;cursor:pointer;color:#dceaf6;font:750 10px/1.2 inherit;background:rgba(255,255,255,.018); }
          .v407-country-group > summary::-webkit-details-marker { display:none; }
          .v407-country-group > summary::after { content:'›';margin-left:auto;color:#718ba2;font-size:16px;line-height:1;transform:rotate(0deg);transition:transform .14s ease; }
          .v407-country-group[open] > summary::after { transform:rotate(90deg); }
          .v407-country-flag { font-size:15px;line-height:1; }
          .v407-country-name { min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
          .v407-country-count { color:#6f879c;font-weight:650; }
          .v407-country-home { margin-left:3px;padding:2px 5px;border-radius:999px;background:rgba(246,195,68,.08);color:#c9aa59;font-size:8px;font-weight:750; }
          .v407-country-rows { display:grid;gap:7px;padding:0 8px 8px; }
          .v407-country-more { appearance:none;-webkit-appearance:none;width:100%;min-height:31px;border:1px dashed rgba(111,163,214,.18);border-radius:8px;background:transparent;color:#8ba6bd;font:700 9px/1 inherit;cursor:pointer; }
          .v407-country-more:hover,.v407-country-more:focus-visible { outline:none;border-color:rgba(79,163,247,.36);color:#d9edff;background:rgba(79,163,247,.05); }
`;

const RANK_OLD = `      const v407Rank = (items, query, countryCode, preferredCountryCode) => {
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
      };`;

const RANK_NEW = `      const v407Rank = (items, query, countryCode, preferredCountryCode) => {
        const q = v407NormalizeText(query);
        return items.map((candidate,index) => {
          const name = v407NormalizeText(candidate.name), label = v407NormalizeText(candidate.displayLabel), admin = v407NormalizeText(candidate.admin1);
          const postcodes = (candidate.postcodes || [candidate.postcode]).map(v407NormalizeText);
          let score = 0;
          // Explicit country selection stays a hard, dominant signal. The automatically
          // inferred home country is deliberately only a soft preference.
          if (countryCode && candidate.countryCode === countryCode) score += 2000;
          if (!countryCode && preferredCountryCode && candidate.countryCode === preferredCountryCode) score += 55;
          if (postcodes.includes(q)) score += 1400;
          if (name === q) score += 1100;
          else if (label.startsWith(q)) score += 850;
          else if (name.startsWith(q)) score += 700;
          else if (label.includes(q)) score += 360;
          if (admin === q) score += 180;
          else if (admin.includes(q)) score += 110;
          const importance = Number(candidate.importance || 0);
          if (importance > 1) score += Math.min(300,Math.log10(importance + 1) * 40);
          else if (importance > 0) score += Math.min(220,importance * 220);
          return {...candidate,_score:score - index / 1000};
        }).sort((a,b) => b._score - a._score);
      };`;

const RENDER_RESULTS = `        let v407ActiveResultCountry = '';
        const v407CountryFlag = (code) => /^[A-Z]{2}$/.test(String(code || ''))
          ? [...String(code)].map((char) => String.fromCodePoint(127397 + char.charCodeAt(0))).join('')
          : '🌐';
        const v407CountryLabel = (code,candidates) => {
          const record = records.find((item) => item.code === code);
          return record?.local || candidates.find((item) => item.country)?.country || code || text.unknownCountry;
        };
        const renderResults = (candidates,{preferredCountryCode='',countryCode=''} = {}) => {
          const source = Array.isArray(candidates) ? candidates : [];
          const groupsByCode = new Map();
          source.forEach((candidate) => {
            const code = String(candidate.countryCode || '').toUpperCase() || 'ZZ';
            if (!groupsByCode.has(code)) groupsByCode.set(code,[]);
            groupsByCode.get(code).push(candidate);
          });
          const groups = [...groupsByCode.entries()].map(([code,items]) => ({
            code,
            items,
            best:Number(items[0]?._score || 0),
            label:v407CountryLabel(code,items)
          })).sort((a,b) => b.best-a.best || a.label.localeCompare(b.label,undefined,{sensitivity:'base'}));
          if (v407ActiveResultCountry && !groupsByCode.has(v407ActiveResultCountry)) v407ActiveResultCountry='';
          if (countryCode && groupsByCode.has(countryCode)) v407ActiveResultCountry=countryCode;

          const fragment = document.createDocumentFragment();
          if (!source.length) { results.replaceChildren(); return; }

          if (groups.length > 1) {
            const bar=document.createElement('div'); bar.className='v407-country-filterbar'; bar.setAttribute('role','toolbar'); bar.setAttribute('aria-label',text.countryFilters);
            const makeFilter=(code,label,count,flag='') => {
              const button=document.createElement('button'); button.type='button'; button.className='v407-country-filter' + (v407ActiveResultCountry===code ? ' active' : '');
              button.textContent=(flag ? flag+' ' : '') + label + ' ('+count+')';
              button.addEventListener('click',() => { v407ActiveResultCountry = v407ActiveResultCountry===code ? '' : code; renderResults(source,{preferredCountryCode,countryCode}); });
              return button;
            };
            const all=makeFilter('',text.allCountries,source.length); all.classList.toggle('active',!v407ActiveResultCountry); bar.appendChild(all);
            groups.forEach((group) => bar.appendChild(makeFilter(group.code,group.label,group.items.length,v407CountryFlag(group.code))));
            fragment.appendChild(bar);
          }
          const summary=document.createElement('div'); summary.className='v407-country-summary';
          summary.textContent = text.resultSummary.replace('{results}',String(source.length)).replace('{countries}',String(groups.length));
          fragment.appendChild(summary);

          const visibleGroups = v407ActiveResultCountry ? groups.filter((group) => group.code===v407ActiveResultCountry) : groups;
          const makeRow = (candidate) => {
            const row = document.createElement('article'); row.className='v407-location-result';
            const copy = document.createElement('div'); const title=document.createElement('div'); title.className='v407-location-result-title'; title.textContent=candidate.displayLabel;
            const meta=document.createElement('div'); meta.className='v407-location-result-meta'; meta.textContent=candidate.latitude.toFixed(5)+'°, '+candidate.longitude.toFixed(5)+'° · '+candidate.provider+(candidate.postcode ? ' · '+candidate.postcode : '');
            copy.append(title,meta); const actions=document.createElement('div'); actions.className='v407-location-result-actions';
            const use=document.createElement('button'); use.type='button'; use.className='v407-location-result-use'; use.textContent=text.use;
            const save=document.createElement('button'); save.type='button'; save.className='v407-location-result-save'; save.textContent=text.save; save.disabled=false; save.title=text.saveTitle;
            use.addEventListener('click',async () => {
              use.disabled=true; setStatus(text.using);
              try {
                const ok=await v407UseCandidate(candidate);
                if (!ok) throw new Error(text.backendMissing);
                close();
                v407FocusCandidate(candidate);
              } catch (error) {
                console.warn('[Gewitterradar V4.07] Bezugsstandort konnte nicht gesetzt werden.',error);
                setStatus(error?.message===text.backendMissing ? text.backendMissing : text.useFailed,true);
              } finally { use.disabled=false; }
            });
            save.addEventListener('click',async () => {
              save.disabled=true; setStatus(text.saving);
              try {
                const result=await v407SaveCandidate(candidate);
                save.textContent=text.saved;
                setStatus(String(candidate.name || candidate.displayLabel || '') + ' ' + (result.duplicate ? text.savedDuplicate : text.savedOk));
              } catch (error) {
                console.warn('[Gewitterradar V4.07] Ort konnte nicht gespeichert werden.',error);
                setStatus(error?.message==='V407_TODO_MISSING' ? text.savedSetup : text.saveFailed,true);
                save.disabled=false;
              }
            });
            actions.append(use,save); row.append(copy,actions); return row;
          };

          visibleGroups.forEach((group,index) => {
            const details=document.createElement('details'); details.className='v407-country-group';
            details.open = !!v407ActiveResultCountry || index===0;
            const head=document.createElement('summary');
            const flag=document.createElement('span'); flag.className='v407-country-flag'; flag.textContent=v407CountryFlag(group.code); flag.setAttribute('aria-hidden','true');
            const name=document.createElement('span'); name.className='v407-country-name'; name.textContent=group.label;
            const count=document.createElement('span'); count.className='v407-country-count'; count.textContent='('+group.items.length+')';
            head.append(flag,name,count);
            if (!countryCode && preferredCountryCode && group.code===preferredCountryCode) {
              const home=document.createElement('span'); home.className='v407-country-home'; home.textContent=text.homeCountry; head.appendChild(home);
            }
            const rows=document.createElement('div'); rows.className='v407-country-rows';
            const initial = v407ActiveResultCountry ? 8 : 4;
            group.items.slice(0,initial).forEach((candidate) => rows.appendChild(makeRow(candidate)));
            if (group.items.length > initial) {
              const more=document.createElement('button'); more.type='button'; more.className='v407-country-more';
              more.textContent=text.showMore.replace('{count}',String(group.items.length-initial));
              more.addEventListener('click',(event) => {
                event.preventDefault(); event.stopPropagation();
                group.items.slice(initial).forEach((candidate) => rows.insertBefore(makeRow(candidate),more));
                more.remove();
              });
              rows.appendChild(more);
            }
            details.append(head,rows); fragment.appendChild(details);
          });
          results.replaceChildren(fragment);
        };
`;

export function v407CountryGroupsDelta(source) {
  let text = source;
  text = replaceOnce(text,
    "const GEWITTERRADAR_BUILD = 'V4.07-TEST2-2026-09-12';",
    "const GEWITTERRADAR_BUILD = 'V4.07-TEST3-2026-09-12';");

  text = replaceOnce(text,
    "          .v407-location-results { display:grid;gap:8px;margin-top:10px; }",
    "          .v407-location-results { display:grid;gap:8px;margin-top:10px; }" + COUNTRY_GROUP_CSS);

  text = replaceOnce(text,RANK_OLD,RANK_NEW);

  text = replaceOnce(text,
    "        const biasedQuery = !countryCode && preferredCountryCode && !String(query).includes(',') && preferred ? `${query}, ${preferred.english}` : query;\n        url.searchParams.set('q',biasedQuery);",
    "        // The inferred home country is only a ranking preference. Do not rewrite the\n        // worldwide query itself, otherwise fallback results can be unintentionally narrowed.\n        url.searchParams.set('q',query);");

  text = replaceOnce(text,
    "        safety:'Wichtig: Ein neuer Gewitterradar-Bezugsstandort bestätigt noch nicht, dass Blitzortung bereits passende Live-Daten für diesen Bereich abonniert hat.'",
    "        safety:'Wichtig: Ein neuer Gewitterradar-Bezugsstandort bestätigt noch nicht, dass Blitzortung bereits passende Live-Daten für diesen Bereich abonniert hat.', allCountries:'Alle Länder', countryFilters:'Länderfilter', resultSummary:'{results} Treffer in {countries} Ländern', homeCountry:'Heimatland', showMore:'Weitere {count} Treffer anzeigen', unknownCountry:'Unbekanntes Land'");
  text = replaceOnce(text,
    "        safety:'Important: a new Gewitterradar reference location does not prove that Blitzortung already has matching live-data subscriptions for that area.'",
    "        safety:'Important: a new Gewitterradar reference location does not prove that Blitzortung already has matching live-data subscriptions for that area.', allCountries:'All countries', countryFilters:'Country filters', resultSummary:'{results} results in {countries} countries', homeCountry:'Home country', showMore:'Show {count} more results', unknownCountry:'Unknown country'");

  text = replaceRangeOnce(text,
    "        const renderResults = (candidates) => {",
    "        form.addEventListener('submit',async (event) => {",
    RENDER_RESULTS);

  text = replaceOnce(text,
    "            renderResults(ranked); setStatus(ranked.length ? '' : text.noResults,ranked.length === 0);",
    "            v407ActiveResultCountry=''; renderResults(ranked,{preferredCountryCode,countryCode}); setStatus(ranked.length ? '' : text.noResults,ranked.length === 0);");

  return text;
}

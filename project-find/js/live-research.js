(() => {
  const esc = (v) => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const money = (v) => Number.isFinite(Number(v)) ? Number(v).toLocaleString('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}) : 'Preis unbekannt';
  const km = (v) => Number.isFinite(Number(v)) ? `${Number(v).toLocaleString('de-DE')} km` : '';

  function renderCriteria(q) {
    const i = q || {};
    const rows = [['Marke',i.brand],['Modell',i.model],['Karosserie',i.body],['Kraftstoff',i.fuel],['Baujahr',i.minYear ? `${i.minYear}+` : null],['Leistung',i.minPowerPs ? `${i.minPowerPs} PS+` : null],['Budget',i.maxPriceEur ? `≤ ${money(i.maxPriceEur)}` : null],['Kilometer',i.maxMileageKm ? `≤ ${km(i.maxMileageKm)}` : null],['Getriebe',i.transmission],['Ort',i.location]].filter(([,v])=>v);
    document.getElementById('criteria').innerHTML = rows.length ? rows.map(([k,v])=>`<div class="pill"><b>${esc(k)}:</b> ${esc(v)}</div>`).join('') : '<div class="pill"><b>Anfrage:</b> Freie Suche</div>';
  }

  function renderFindings(findings=[]) {
    const el = document.getElementById('results');
    if (!findings.length) {
      el.innerHTML = '<div class="empty"><strong>Keine verifizierten Angebote gefunden</strong>Find zeigt bewusst keine erfundenen Fahrzeuge. Lockerere Kriterien oder ein anderer Ort können helfen.</div>';
      return;
    }
    el.innerHTML = findings.map((f,i)=>{
      const specs = [['Baujahr',f.year],['km',km(f.mileageKm)],['Leistung',f.powerPs ? `${f.powerPs} PS` : null],['Kraftstoff',f.fuel],['Getriebe',f.transmission],['Ort',f.location]].filter(([,v])=>v).map(([k,v])=>`<span class="spec">${esc(k)}: ${esc(v)}</span>`).join('');
      const why = (f.whyMatch||[]).map(x=>`<div class="flag"><span class="dot green"></span><span>${esc(x)}</span></div>`).join('');
      const caution = (f.caution||[]).map(x=>`<div class="flag"><span class="dot"></span><span>${esc(x)}</span></div>`).join('');
      const verified = f.verifiedLiveSource === true;
      const photo = verified && f.imageUrl ? `<div class="photo"><img loading="lazy" src="${esc(f.imageUrl)}" alt="${esc(f.title)}"><div class="match">VERIFIZIERT</div><button class="heart" type="button">♡</button></div>` : `<div class="photo" style="display:flex;align-items:center;justify-content:center;position:relative"><div class="match">VERIFIZIERT · OHNE BILD</div><span style="color:#666;font-size:11px">Kein Bild zuverlässig verifiziert</span><button class="heart" type="button">♡</button></div>`;
      return `<article class="car" data-source-url="${esc(f.sourceUrl||'')}"><div class="body" style="padding-top:12px">${photo}<div class="meta">#${i+1} · ${esc(f.sourceName||'Öffentliche Quelle')}</div><div class="name">${esc(f.title)}</div><div class="price">${money(f.priceEur)}</div><div class="specs">${specs}</div><div class="details"><div class="analysis"><h4>Warum Find das zeigt</h4>${why || '<div class="flag"><span class="dot"></span><span>Keine zusätzlichen Match-Gründe geliefert.</span></div>'}${caution}</div></div><div class="actionbar"><button class="action primary details-btn" type="button">Details</button><button class="action inspect-btn" type="button">Teilen</button><a class="action" style="text-align:center;text-decoration:none" href="${esc(f.sourceUrl||'#')}" target="_blank" rel="noopener">Originalangebot ↗</a></div><div class="source">Quelle verifiziert · ${esc(f.sourceName||'Webquelle')}</div></div></article>`;
    }).join('');
  }

  window.run = async function() {
    const input = document.getElementById('q');
    const panel = document.getElementById('panel');
    const q = input?.value.trim();
    if (!q) return;
    panel?.classList.add('show');
    document.getElementById('resultTitle').textContent = 'Live-Recherche läuft…';
    document.getElementById('results').innerHTML = '<div class="thinking"><b>Find recherchiert das Live-Web…</b><small>Es werden echte Angebotsseiten gesucht und verifiziert.</small></div>';
    document.getElementById('near').innerHTML='';
    document.getElementById('smart').style.display='none';
    document.getElementById('sources').textContent='…';
    try {
      const location = document.getElementById('location')?.value.trim() || null;
      const res = await fetch('/api/research',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query:q,location,detailLevel:'standard'})});
      const data = await res.json().catch(() => ({}));
      if(!res.ok){
        const rawDetails = data?.details;
        let detail = '';
        if (typeof rawDetails === 'string') {
          try {
            const parsed = JSON.parse(rawDetails);
            detail = parsed?.error?.message || parsed?.message || rawDetails;
          } catch { detail = rawDetails; }
        } else if (rawDetails?.error?.message) detail = rawDetails.error.message;
        const status = data?.status ? ` (${data.status})` : ` (HTTP ${res.status})`;
        throw new Error(`${data?.error || 'Research fehlgeschlagen'}${status}${detail ? `: ${detail}` : ''}`);
      }
      renderCriteria(data.interpretedQuery);
      if(data.marketReality?.statement){const smart=document.getElementById('smart');smart.style.display='block';smart.innerHTML=`🧠 <b>Marktrealität:</b> ${esc(data.marketReality.statement)}`;}
      const count=Array.isArray(data.findings)?data.findings.length:0;
      document.getElementById('sources').textContent=count;
      document.getElementById('resultCount').textContent=`${count} verifiziert`;
      document.getElementById('resultTitle').textContent=count?`${count} verifizierte Angebote`:'Keine verifizierten Angebote';
      renderFindings(data.findings);
      const plan=Array.isArray(data.researchPlan)?data.researchPlan:[];
      document.getElementById('near').innerHTML=plan.length?`<div class="nearbox"><b>Transparenz:</b><br>${plan.map(x=>`• ${esc(x)}`).join('<br>')}</div>`:'';
    } catch(err){
      document.getElementById('sources').textContent='—';
      document.getElementById('resultCount').textContent='Fehler';
      document.getElementById('resultTitle').textContent='Live-Recherche nicht verfügbar';
      document.getElementById('results').innerHTML=`<div class="empty"><strong>OpenAI-Anfrage fehlgeschlagen</strong><br><span style="color:#aaa">${esc(err.message)}</span><br><br><span style="color:#777">Der genaue API-Fehler wird jetzt angezeigt, damit wir nicht mehr blind debuggen müssen.</span></div>`;
    }
    document.getElementById('panel')?.scrollIntoView({behavior:'smooth',block:'start'});
  };

  window.demo = function(chip){const input=document.getElementById('q');if(input) input.value=chip?.textContent?.replace(' · ', ', ')||'';window.run();};
})();

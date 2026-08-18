(() => {
  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const money = (value) => Number.isFinite(Number(value)) ? Number(value).toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }) : "Preis unbekannt";
  const fmtKm = (value) => Number.isFinite(Number(value)) ? `${Number(value).toLocaleString("de-DE")} km` : "";

  const renderCriteria = (q) => {
    const i = q || {};
    const rows = [["Marke", i.brand],["Modell", i.model],["Karosserie", i.body],["Kraftstoff", i.fuel],["Baujahr", i.minYear ? `${i.minYear}+` : null],["Leistung", i.minPowerPs ? `${i.minPowerPs} PS+` : null],["Budget", i.maxPriceEur ? `≤ ${money(i.maxPriceEur)}` : null],["Kilometer", i.maxMileageKm ? `≤ ${fmtKm(i.maxMileageKm)}` : null],["Getriebe", i.transmission],["Ort", i.location]].filter(([,v]) => v);
    document.getElementById("criteria").innerHTML = rows.length ? rows.map(([k,v]) => `<div class="pill"><b>${escapeHtml(k)}:</b> ${escapeHtml(v)}</div>`).join("") : `<div class="pill"><b>Anfrage:</b> Freie Suche</div>`;
  };

  const renderFindings = (findings = []) => {
    const el = document.getElementById("results");
    if (!findings.length) {
      el.innerHTML = `<div class="nearbox">Keine verifizierten aktuellen Angebote gefunden. Find erfindet keine Fahrzeuge.</div>`;
      return;
    }
    el.innerHTML = findings.map((f, idx) => {
      const specs = [["Jahr", f.year],["km", fmtKm(f.mileageKm)],["PS", f.powerPs ? `${f.powerPs} PS` : null],["Kraftstoff", f.fuel],["Getriebe", f.transmission],["Ort", f.location]].filter(([,v]) => v).map(([k,v]) => `<span class="spec">${escapeHtml(k)}: ${escapeHtml(v)}</span>`).join("");
      const cautions = (f.caution || []).map(x => `<div class="flag"><span class="dot"></span><span>${escapeHtml(x)}</span></div>`).join("");
      const why = (f.whyMatch || []).map(x => `<div class="flag"><span class="dot green"></span><span>${escapeHtml(x)}</span></div>`).join("");
      const image = f.imageUrl ? `<div class="photo"><img loading="lazy" src="${escapeHtml(f.imageUrl)}" alt="${escapeHtml(f.title)}"><div class="match">Live-Treffer</div><button class="heart" type="button">♡</button></div>` : `<div class="photo" style="display:flex;align-items:center;justify-content:center"><div class="match">Live-Treffer</div><span style="color:#666">Kein verifiziertes Bild geliefert</span><button class="heart" type="button" style="position:absolute;right:12px;top:12px">♡</button></div>`;
      return `<article class="car">${image}<div class="body"><div class="meta">#${idx + 1} · ${escapeHtml(f.sourceName || "Webquelle")}</div><div class="name">${escapeHtml(f.title)}</div><div class="price">${money(f.priceEur)}</div><div class="specs">${specs}</div><div class="details" style="display:block"><div class="analysis"><h4>Warum Find das zeigt</h4>${why || '<div class="flag"><span class="dot"></span><span>Keine zusätzlichen Match-Argumente geliefert.</span></div>'}${cautions}</div></div><div class="sharebar"><button class="sharebtn inspect-btn" type="button">🔎 Prüfen</button><a class="sharebtn" style="text-align:center;text-decoration:none" href="${escapeHtml(f.sourceUrl)}" target="_blank" rel="noopener">Originalangebot ↗</a></div><div class="source">Quelle: ${escapeHtml(f.sourceName || "Webquelle")}</div></div></article>`;
    }).join("");
  };

  window.run = async function liveRun() {
    const input = document.getElementById("q"); const panel = document.getElementById("panel"); const q = input?.value.trim();
    if (!q || !panel) return;
    panel.classList.add("show");
    document.getElementById("resultTitle").textContent = "Ich recherchiere…";
    document.getElementById("results").innerHTML = `<div class="thinking"><b>Find recherchiert live…</b><small>Quellen werden geprüft und reale Treffer verifiziert.</small></div>`;
    document.getElementById("near").innerHTML = ""; document.getElementById("smart").style.display = "none"; document.getElementById("sources").textContent = "…";
    try {
      const res = await fetch("/api/research", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: q, detailLevel: "standard" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Research failed");
      renderCriteria(data.interpretedQuery);
      const reality = data.marketReality?.statement;
      if (reality) { const smart = document.getElementById("smart"); smart.style.display = "block"; smart.innerHTML = `🧠 <b>Marktrealität:</b> ${escapeHtml(reality)}`; }
      const count = Array.isArray(data.findings) ? data.findings.length : 0;
      document.getElementById("sources").textContent = count; document.getElementById("resultTitle").textContent = `${count} echte Recherche-Ergebnisse`;
      renderFindings(data.findings);
      document.getElementById("near").innerHTML = Array.isArray(data.researchPlan) && data.researchPlan.length ? `<div class="nearbox"><b>Rechercheplan:</b><br>${data.researchPlan.map(x => `• ${escapeHtml(x)}`).join("<br>")}</div>` : "";
    } catch (error) {
      document.getElementById("sources").textContent = "—"; document.getElementById("resultTitle").textContent = "Research nicht verfügbar";
      document.getElementById("results").innerHTML = `<div class="nearbox">${escapeHtml(error.message)}<br><br><small>Der Cloudflare Worker braucht das Secret <b>OPENAI_API_KEY</b>, damit Live-Webrecherche läuft.</small></div>`;
    }
  };

  window.demo = function demo(chip) { const q = chip?.textContent?.replace(" · ", ", ") || ""; const input = document.getElementById("q"); if (input) input.value = q; window.run(); };
})();

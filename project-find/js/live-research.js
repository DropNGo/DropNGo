(() => {
  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const money = (value) => Number.isFinite(Number(value))
    ? Number(value).toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
    : "Preis unbekannt";

  const renderCriteria = (q) => {
    const i = q || {};
    const rows = [
      ["Marke", i.brand], ["Modell", i.model], ["Karosserie", i.body],
      ["Kraftstoff", i.fuel], ["Baujahr", i.minYear ? `${i.minYear}+` : null],
      ["Leistung", i.minPowerPs ? `${i.minPowerPs} PS+` : null],
      ["Budget", i.maxPriceEur ? `≤ ${money(i.maxPriceEur)}` : null],
      ["Kilometer", i.maxMileageKm ? `≤ ${Number(i.maxMileageKm).toLocaleString("de-DE")} km` : null],
      ["Getriebe", i.transmission], ["Ort", i.location]
    ].filter(([, v]) => v);
    document.getElementById("criteria").innerHTML = rows.length
      ? rows.map(([k, v]) => `<div class="pill"><b>${escapeHtml(k)}:</b> ${escapeHtml(v)}</div>`).join("")
      : `<div class="pill"><b>Anfrage:</b> Freie Suche</div>`;
  };

  const renderFindings = (findings = []) => {
    const el = document.getElementById("results");
    if (!findings.length) {
      el.innerHTML = `<div class="nearbox">Noch keine verifizierten aktuellen Angebote in den gefundenen Quellen. Find zeigt keine erfundenen Treffer.</div>`;
      return;
    }
    el.innerHTML = findings.map((f, idx) => {
      const cautions = (f.caution || []).map(x => `<div class="flag"><span class="dot"></span><span>${escapeHtml(x)}</span></div>`).join("");
      const why = (f.whyMatch || []).map(x => `<div class="flag"><span class="dot green"></span><span>${escapeHtml(x)}</span></div>`).join("");
      return `<article class="car"><div class="body"><div class="meta">#${idx + 1} · ${escapeHtml(f.sourceName || "Webquelle")}</div><div class="name">${escapeHtml(f.title)}</div><div class="price">${money(f.priceEur)}</div><div class="why">${why}${cautions}</div><div class="source"><a href="${escapeHtml(f.sourceUrl)}" target="_blank" rel="noopener">Originalquelle öffnen ↗</a></div></div></article>`;
    }).join("");
  };

  window.run = async function liveRun() {
    const input = document.getElementById("q");
    const panel = document.getElementById("panel");
    const q = input?.value.trim();
    if (!q || !panel) return;

    panel.classList.add("show");
    document.getElementById("resultTitle").textContent = "Ich recherchiere…";
    document.getElementById("results").innerHTML = `<div class="thinking"><b>Find denkt + recherchiert gerade…</b><small>Live-Webrecherche wird ausgewertet.</small></div>`;
    document.getElementById("near").innerHTML = "";
    document.getElementById("smart").style.display = "none";
    document.getElementById("sources").textContent = "…";

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: q, detailLevel: "standard" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Research failed");

      renderCriteria(data.interpretedQuery);
      const reality = data.marketReality?.statement;
      if (reality) {
        const smart = document.getElementById("smart");
        smart.style.display = "block";
        smart.innerHTML = `🧠 <b>Marktrealität:</b> ${escapeHtml(reality)}`;
      }
      document.getElementById("sources").textContent = Array.isArray(data.findings) ? data.findings.length : "0";
      document.getElementById("resultTitle").textContent = `${Array.isArray(data.findings) ? data.findings.length : 0} Recherche-Ergebnisse`;
      renderFindings(data.findings);
      document.getElementById("near").innerHTML = Array.isArray(data.researchPlan) && data.researchPlan.length
        ? `<div class="nearbox"><b>Rechercheplan:</b><br>${data.researchPlan.map(x => `• ${escapeHtml(x)}`).join("<br>")}</div>` : "";
    } catch (error) {
      document.getElementById("sources").textContent = "—";
      document.getElementById("resultTitle").textContent = "Research nicht verfügbar";
      document.getElementById("results").innerHTML = `<div class="nearbox">${escapeHtml(error.message)}<br><br><small>Für den Live-Gehirn-Call muss im Cloudflare Worker das Secret <b>OPENAI_API_KEY</b> gesetzt sein.</small></div>`;
    }
  };

  // Demo chips now trigger the live pipeline rather than fake local data.
  window.demo = function demo(chip) {
    const q = chip?.textContent?.replace(" · ", ", ") || "";
    const input = document.getElementById("q");
    if (input) input.value = q;
    window.run();
  };
})();

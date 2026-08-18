const OPENAI_URL = "https://api.openai.com/v1/responses";

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    interpretedQuery: {
      type: "object", additionalProperties: false,
      properties: {
        summary: { type: "string" }, brand: { type: ["string", "null"] }, model: { type: ["string", "null"] }, body: { type: ["string", "null"] }, fuel: { type: ["string", "null"] }, minYear: { type: ["integer", "null"] }, maxPriceEur: { type: ["number", "null"] }, minPowerPs: { type: ["number", "null"] }, maxMileageKm: { type: ["number", "null"] }, transmission: { type: ["string", "null"] }, location: { type: ["string", "null"] }, missingCriticalInfo: { type: "array", items: { type: "string" } }
      },
      required: ["summary","brand","model","body","fuel","minYear","maxPriceEur","minPowerPs","maxMileageKm","transmission","location","missingCriticalInfo"]
    },
    marketReality: { type: "object", additionalProperties: false, properties: { statement: { type: "string" }, confidence: { type: "number" }, evidence: { type: "array", items: { type: "string" } } }, required: ["statement","confidence","evidence"] },
    researchPlan: { type: "array", items: { type: "string" } },
    findings: { type: "array", items: { type: "object", additionalProperties: false, properties: { title: { type: "string" }, sourceUrl: { type: "string" }, sourceName: { type: "string" }, priceEur: { type: ["number","null"] }, year: { type: ["integer","null"] }, mileageKm: { type: ["number","null"] }, powerPs: { type: ["number","null"] }, fuel: { type: ["string","null"] }, transmission: { type: ["string","null"] }, location: { type: ["string","null"] }, imageUrl: { type: ["string","null"] }, whyMatch: { type: "array", items: { type: "string" } }, caution: { type: "array", items: { type: "string" } } }, required: ["title","sourceUrl","sourceName","priceEur","year","mileageKm","powerPs","fuel","transmission","location","imageUrl","whyMatch","caution"] } }
  },
  required: ["interpretedQuery","marketReality","researchPlan","findings"]
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": "*" } });
}

function collectWebUrls(output = []) {
  const urls = new Set();
  for (const item of output) {
    if (item?.type !== "web_search_call") continue;
    const sources = item?.action?.sources || [];
    for (const source of sources) if (typeof source?.url === "string") urls.add(source.url);
    if (typeof item?.action?.url === "string") urls.add(item.action.url);
  }
  return [...urls];
}

function sameUrl(a, b) {
  try {
    const x = new URL(a); const y = new URL(b);
    x.hash = ""; y.hash = "";
    return x.toString().replace(/\/$/, "") === y.toString().replace(/\/$/, "");
  } catch { return false; }
}

function isMarketplaceListing(url) {
  try {
    const u = new URL(url); const host = u.hostname.replace(/^www\./, "");
    const known = ["mobile.de", "autoscout24.de", "autoscout24.com", "kleinanzeigen.de", "hey.car"];
    return known.some(domain => host === domain || host.endsWith(`.${domain}`));
  } catch { return false; }
}

async function research(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type" } });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!env.OPENAI_API_KEY) return json({ error: "OPENAI_API_KEY is not configured", setup: "Add OPENAI_API_KEY as a Cloudflare Worker secret." }, 503);
  let body; try { body = await request.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }
  const query = typeof body?.query === "string" ? body.query.trim() : "";
  const detailLevel = ["short","standard","full"].includes(body?.detailLevel) ? body.detailLevel : "standard";
  const location = typeof body?.location === "string" ? body.location.trim() : null;
  if (!query) return json({ error: "query is required" }, 400);
  if (query.length > 1500) return json({ error: "query too long" }, 400);

  const system = `You are Project Find, an evidence-first LIVE vehicle research engine.

Your job is to find REAL, CURRENT vehicle listings on the public web, not to invent examples. The user expects clickable offers that exist right now.

STRICT REAL-LISTING RULES:
1. Use web search aggressively. Search multiple relevant queries when useful, including the exact vehicle constraints and German marketplace terms.
2. Prioritize current listing pages on mobile.de, AutoScout24, Kleinanzeigen, hey.car, reputable dealer inventory and other legitimate public vehicle marketplaces.
3. Open promising result pages when possible and inspect the page evidence before accepting a vehicle.
4. A finding is valid only when you have evidence that the page is an actual vehicle offer/listing and contains enough information to identify the vehicle. Search-result pages, generic category pages, articles, reviews, forum posts and invented URLs are NOT listings.
5. sourceUrl MUST be the exact URL of the real page you inspected. Never invent, normalize into, or guess a URL. Never use a search-engine result URL.
6. If you cannot verify a real listing, DO NOT return it. Return fewer results or an empty findings array rather than hallucinating.
7. Do not fabricate image URLs. Only return an imageUrl when the source actually provides a usable image URL you can verify.
8. Treat price, mileage, year, power, fuel and transmission as source facts only when supported by the page. If unknown, return null.
9. Distinguish seller claims from your own assessment. Never claim a photo proves a hidden accident or mechanical defect.
10. The current date is August 18, 2026. Prefer current inventory and avoid stale pages when the page clearly indicates an old or sold offer.

For German vehicle searches, try several marketplace searches rather than relying on one result. The goal is live retrieval, not a plausible answer.

Detail level: ${detailLevel}. User location: ${location || "unknown"}.
Return only the requested JSON schema.`;

  const payload = {
    model: "gpt-5.6",
    store: false,
    tools: [{ type: "web_search", search_context_size: "high" }],
    input: [
      { role: "system", content: [{ type: "input_text", text: system }] },
      { role: "user", content: [{ type: "input_text", text: `Find real current vehicle listings for this request. Do not create demo vehicles. Search the live web now and return only offers you can verify from the pages you used:\n${query}` }] }
    ],
    text: { format: { type: "json_schema", name: "find_research_result", strict: true, schema: RESULT_SCHEMA } }
  };

  const response = await fetch(OPENAI_URL, { method: "POST", headers: { "authorization": `Bearer ${env.OPENAI_API_KEY}`, "content-type": "application/json" }, body: JSON.stringify(payload) });
  const raw = await response.text();
  if (!response.ok) return json({ error: "OpenAI request failed", status: response.status, details: raw.slice(0, 1200) }, 502);

  try {
    const api = JSON.parse(raw);
    const text = api.output_text || api.output?.flatMap(item => item.content || []).find(part => part.type === "output_text")?.text;
    const parsed = JSON.parse(text || "{}");
    const webUrls = collectWebUrls(api.output || []);
    const verified = [];
    for (const finding of Array.isArray(parsed.findings) ? parsed.findings : []) {
      const matchedUrl = webUrls.find(url => sameUrl(url, finding.sourceUrl));
      if (!matchedUrl) continue;
      const sourceIsMarketplace = isMarketplaceListing(matchedUrl);
      verified.push({ ...finding, sourceUrl: matchedUrl, verifiedLiveSource: true, marketplace: sourceIsMarketplace });
    }
    parsed.findings = verified;
    parsed.researchPlan = Array.isArray(parsed.researchPlan) ? parsed.researchPlan : [];
    parsed.researchPlan.unshift(`Live-Webquellen geprüft: ${webUrls.length}`, `Verifizierte Angebotsseiten: ${verified.length}`);
    return json({ requestId: api.id || null, status: "complete", live: true, ...parsed });
  } catch (error) {
    return json({ error: "OpenAI returned an unexpected response format", details: String(error?.message || error) }, 502);
  }
}

async function health(request, env) { return json({ ok: true, openaiConfigured: Boolean(env.OPENAI_API_KEY), version: "find-live-3" }); }

async function serveApp(request, env) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/") && url.pathname !== "/" && url.pathname !== "/index.html") return env.ASSETS.fetch(new Request(url, request));
  const assetUrl = new URL(request.url); assetUrl.pathname = "/index.html";
  return env.ASSETS.fetch(new Request(assetUrl, request));
}

export default { async fetch(request, env) { const url = new URL(request.url); if (url.pathname === "/api/research") return research(request, env); if (url.pathname === "/api/health") return health(request, env); if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-origin": "*" } }); return serveApp(request, env); } };

const OPENAI_URL = "https://api.openai.com/v1/responses";

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    interpretedQuery: {
      type: "object",
      additionalProperties: false,
      properties: {
        summary: { type: "string" },
        brand: { type: ["string", "null"] },
        model: { type: ["string", "null"] },
        body: { type: ["string", "null"] },
        fuel: { type: ["string", "null"] },
        minYear: { type: ["integer", "null"] },
        maxPriceEur: { type: ["number", "null"] },
        minPowerPs: { type: ["number", "null"] },
        maxMileageKm: { type: ["number", "null"] },
        transmission: { type: ["string", "null"] },
        location: { type: ["string", "null"] },
        missingCriticalInfo: { type: "array", items: { type: "string" } }
      },
      required: ["summary", "brand", "model", "body", "fuel", "minYear", "maxPriceEur", "minPowerPs", "maxMileageKm", "transmission", "location", "missingCriticalInfo"]
    },
    marketReality: {
      type: "object",
      additionalProperties: false,
      properties: {
        statement: { type: "string" },
        confidence: { type: "number" },
        evidence: { type: "array", items: { type: "string" } }
      },
      required: ["statement", "confidence", "evidence"]
    },
    researchPlan: {
      type: "array",
      items: { type: "string" }
    },
    findings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          sourceUrl: { type: "string" },
          sourceName: { type: "string" },
          priceEur: { type: ["number", "null"] },
          whyMatch: { type: "array", items: { type: "string" } },
          caution: { type: "array", items: { type: "string" } }
        },
        required: ["title", "sourceUrl", "sourceName", "priceEur", "whyMatch", "caution"]
      }
    }
  },
  required: ["interpretedQuery", "marketReality", "researchPlan", "findings"]
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*"
    }
  });
}

async function research(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type"
      }
    });
  }

  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  if (!env.OPENAI_API_KEY) {
    return json({
      error: "OPENAI_API_KEY is not configured",
      setup: "Add OPENAI_API_KEY as a Cloudflare Worker secret."
    }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const query = typeof body?.query === "string" ? body.query.trim() : "";
  const detailLevel = ["short", "standard", "full"].includes(body?.detailLevel) ? body.detailLevel : "standard";
  const location = typeof body?.location === "string" ? body.location.trim() : null;

  if (!query) return json({ error: "query is required" }, 400);
  if (query.length > 1500) return json({ error: "query too long" }, 400);

  const system = `You are Project Find, an evidence-first vehicle research engine.\nYour job is to understand a user's natural-language request, identify hard constraints versus preferences, assess market reality, and research current public information.\nNever invent listings, prices, specifications, or evidence. A URL must be a real source URL returned by web search. Distinguish facts from inference.\nFor vehicle requests, think like a highly experienced automotive researcher and inspection advisor, but never claim that a photo proves a hidden accident or mechanical defect.\nDetail level: ${detailLevel}. User location: ${location || "unknown"}. Return only the requested JSON schema.`;

  const payload = {
    model: "gpt-5.6",
    store: false,
    tools: [{ type: "web_search" }],
    input: [
      { role: "system", content: [{ type: "input_text", text: system }] },
      { role: "user", content: [{ type: "input_text", text: query }] }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "find_research_result",
        strict: true,
        schema: RESULT_SCHEMA
      }
    }
  };

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const raw = await response.text();
  if (!response.ok) return json({ error: "OpenAI request failed", status: response.status, details: raw.slice(0, 1200) }, 502);

  try {
    const api = JSON.parse(raw);
    const text = api.output_text || api.output?.flatMap(item => item.content || []).find(part => part.type === "output_text")?.text;
    const parsed = JSON.parse(text || "{}");
    return json({ requestId: api.id || null, status: "complete", ...parsed });
  } catch {
    return json({ error: "OpenAI returned an unexpected response format" }, 502);
  }
}

async function serveApp(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== "/" && url.pathname !== "/index.html") {
    return env.ASSETS.fetch(new Request(url, request));
  }

  const assetUrl = new URL(request.url);
  assetUrl.pathname = "/index.html";
  const response = await env.ASSETS.fetch(new Request(assetUrl, request));
  if (!response.ok) return response;

  const html = await response.text();
  const injected = html.replace("</body>", '<script src="/js/live-research.js"></script></body>');
  return new Response(injected, {
    status: response.status,
    headers: new Headers(response.headers)
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/research") return research(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-origin": "*" } });
    return serveApp(request, env);
  }
};

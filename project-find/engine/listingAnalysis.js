// Project Find — Listing Analysis Contract
// Keeps text analysis and future vision analysis structured and honest.
// No model should turn uncertainty into a fact.

export function analyzeListing(listing) {
  const text = listing.description || '';
  const result = {
    summary: summarizeText(text),
    facts: [],
    warnings: [],
    missing: [],
    contradictions: [],
    vision: {status: listing.images?.length ? 'pending_vision' : 'no_images'}
  };
  if (/unfallfrei|unfallfrei/i.test(text)) result.facts.push('Verkäufer beschreibt das Fahrzeug als unfallfrei.');
  if (/scheckheft|serviceheft/i.test(text)) result.facts.push('Service-/Scheckheft wird erwähnt.');
  if (/bastler|defekt|motorschaden|getriebeschaden/i.test(text)) result.warnings.push('Beschreibung enthält einen möglichen Defekt-Hinweis.');
  if (!text) result.missing.push('Keine Verkäuferbeschreibung vorhanden.');
  return result;
}

function summarizeText(text) {
  if (!text) return 'Keine Beschreibung vorhanden.';
  const cleaned=text.replace(/\s+/g,' ').trim();
  return cleaned.length>240 ? cleaned.slice(0,237)+'…' : cleaned;
}

// Future vision provider output must follow this shape:
export const visionResultSchema = {
  visibleModel: {value:null, confidence:0},
  bodyType: {value:null, confidence:0},
  visibleDamage: [],
  visibleEquipment: [],
  imageQuality: null,
  contradictions: []
};

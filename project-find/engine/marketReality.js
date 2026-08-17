// Project Find — Market Reality Layer
// Turns raw constraints into a research plan before asking the user questions.
// IMPORTANT: this layer never invents live market facts. It only labels what
// needs verification and uses conservative heuristics until real market data is connected.

const modelHeuristics = [
  {match:/kia\s+stinger/i, typicalMin:18000, note:'Kia Stinger-Angebote sind typischerweise deutlich über einem sehr niedrigen Budget zu erwarten.'},
  {match:/porsche/i, typicalMin:20000, note:'Porsche-Modelle können je nach Modell deutlich über einem niedrigen Budget liegen.'},
  {match:/bmw\s*440|440i/i, typicalMin:20000, note:'BMW 440i ist auf dem Gebrauchtmarkt häufig oberhalb eines niedrigen Budgets.'}
];

export function assess(query, intent) {
  const candidate = modelHeuristics.find(x => x.match.test(query));
  if (!candidate || !intent.must.some(x=>x.key==='price')) {
    return {status:'needs_live_verification', source:'heuristic_only', message:null, suggestedChange:null};
  }
  const budget = intent.must.find(x=>x.key==='price').value;
  if (budget < candidate.typicalMin) {
    return {
      status:'budget_likely_unrealistic',
      source:'heuristic_only',
      message:candidate.note,
      suggestedChange:{key:'price', minimumForResearch:candidate.typicalMin}
    };
  }
  return {status:'plausible_but_unverified', source:'heuristic_only', message:null, suggestedChange:null};
}

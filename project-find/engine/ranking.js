// Project Find — Explainable Ranking
// Hard constraints are gates. Preferences influence score. Soft preferences only break ties.

export function rank(listings, intent) {
  return listings.map(listing => {
    const hard = scoreHard(listing, intent.must);
    const preference = scorePreferences(listing, intent.preferences);
    const score = Math.round(hard * 0.78 + preference * 0.22);
    return {
      ...listing,
      matchScore: score,
      exact: hard === 100,
      reasons: explain(listing, intent, hard, preference),
      failedMust: failedMust(listing, intent.must)
    };
  }).sort((a,b) => b.matchScore - a.matchScore);
}

function scoreHard(item, constraints) {
  if (!constraints.length) return 50;
  let passed = 0;
  for (const c of constraints) if (passes(item,c)) passed++;
  return Math.round(passed / constraints.length * 100);
}
function scorePreferences(item, constraints) {
  if (!constraints.length) return 50;
  let passed = 0;
  for (const c of constraints) if (passes(item,c)) passed++;
  return Math.round(passed / constraints.length * 100);
}
function passes(item,c) {
  const v=item[c.key];
  if (v == null) return false;
  if (c.op==='<=') return v<=c.value;
  if (c.op==='>=') return v>=c.value;
  return String(v).toLowerCase()===String(c.value).toLowerCase();
}
function failedMust(item,constraints){return constraints.filter(c=>!passes(item,c)).map(c=>c.label)}
function explain(item,intent,hard,preference){
  const failed=failedMust(item,intent.must);
  return {scoreBreakdown:{hard,preference}, positives:intent.must.filter(c=>passes(item,c)).map(c=>c.label), warnings:failed};
}

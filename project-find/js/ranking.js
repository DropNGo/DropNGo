export function scoreListing(listing, query) {
  const hard = query.hard_constraints || {};
  const preferences = query.preferences || {};
  const checks = {};
  let hardPassed = 0, hardTotal = 0, preferenceScore = 0, preferenceTotal = 0;

  for (const [key, expected] of Object.entries(hard)) {
    hardTotal++;
    const actual = listing[key];
    checks[key] = { expected, actual, pass: actual !== null && actual !== undefined && actual === expected };
    if (checks[key].pass) hardPassed++;
  }
  for (const [key, expected] of Object.entries(preferences)) {
    preferenceTotal++;
    const actual = listing[key];
    if (actual !== undefined && actual !== null && actual === expected) preferenceScore++;
  }

  const hardScore = hardTotal ? hardPassed / hardTotal : 1;
  const softScore = preferenceTotal ? preferenceScore / preferenceTotal : 1;
  const score = Math.round((hardScore * 0.78 + softScore * 0.22) * 100);

  return {
    score,
    eligible: hardScore === 1,
    checks,
    explanation: { hard_score: hardScore, preference_score: softScore }
  };
}

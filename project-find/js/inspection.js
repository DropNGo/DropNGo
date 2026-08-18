const INSPECTION_CATEGORIES = [
  'body_damage', 'paint', 'panel_gaps', 'lights', 'glass', 'wheels', 'tires',
  'interior', 'warning_lights', 'engine_bay', 'undercarriage', 'water_damage'
];

export function createInspectionFinding({ category, severity = 'unknown', confidence = 0, observation, recommendation }) {
  return {
    category,
    severity,
    confidence,
    observation: observation || null,
    recommendation: recommendation || null,
    evidence: 'image_only',
    disclaimer: 'Image analysis cannot prove hidden damage or an accident history.'
  };
}

export function summarizeInspection(findings = []) {
  const visible = findings.filter(f => f.confidence > 0);
  return {
    findings: visible,
    high_attention: visible.filter(f => ['high','critical'].includes(f.severity)),
    uncertain: visible.filter(f => f.confidence < 0.7),
    cannot_determine: INSPECTION_CATEGORIES.filter(c => !visible.some(f => f.category === c))
  };
}

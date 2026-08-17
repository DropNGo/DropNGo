export const RESEARCH_STAGES = [
  'intent', 'market_reality', 'source_discovery', 'listing_extraction',
  'vehicle_resolution', 'verification', 'image_inspection', 'ranking'
];

export function createResearchJob(query) {
  return {
    id: crypto.randomUUID(),
    query,
    status: 'planned',
    stages: RESEARCH_STAGES.map(name => ({ name, status: 'pending', evidence: [] })),
    created_at: new Date().toISOString()
  };
}

export function markStage(job, name, status, evidence = []) {
  const stage = job.stages.find(s => s.name === name);
  if (!stage) throw new Error(`Unknown research stage: ${name}`);
  stage.status = status;
  stage.evidence = evidence;
  job.status = status === 'failed' ? 'failed' : 'running';
  return job;
}

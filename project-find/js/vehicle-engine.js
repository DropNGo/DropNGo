const VEHICLE_CONFIDENCE = { UNKNOWN: 0, INFERRED: 0.45, MATCHED: 0.7, VERIFIED: 0.95 };

export function normalizeVehicle(input = {}) {
  const value = structuredClone(input);
  value.identity ??= {};
  value.powertrain ??= {};
  value.dimensions ??= {};
  value.capacity ??= {};
  value.running ??= {};
  value.wheels ??= {};
  value.systems ??= {};
  value.maintenance ??= {};
  value.sources ??= [];

  // Never invent missing vehicle facts. Unknown remains null.
  for (const section of ['identity','powertrain','dimensions','capacity','running','systems']) {
    for (const [key, v] of Object.entries(value[section])) {
      if (v === undefined || v === '') value[section][key] = null;
    }
  }
  return value;
}

export function scoreSource(source = {}) {
  if (source.verified === true) return VEHICLE_CONFIDENCE.VERIFIED;
  if (source.structured === true) return VEHICLE_CONFIDENCE.MATCHED;
  if (source.inferred === true) return VEHICLE_CONFIDENCE.INFERRED;
  return VEHICLE_CONFIDENCE.UNKNOWN;
}

export function resolveIdentity(candidate, references = []) {
  const normalized = normalizeVehicle(candidate);
  const matches = references.filter(ref => {
    if (normalized.identity.make && ref.make?.toLowerCase() !== normalized.identity.make.toLowerCase()) return false;
    if (normalized.identity.model && ref.model?.toLowerCase() !== normalized.identity.model.toLowerCase()) return false;
    return true;
  });
  return { vehicle: normalized, matches, confidence: matches.length ? VEHICLE_CONFIDENCE.MATCHED : VEHICLE_CONFIDENCE.UNKNOWN };
}

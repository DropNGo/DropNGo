// Project Find vehicle identity resolver foundation.
// This is intentionally provider-agnostic: aliases map into a canonical identity;
// live listings are handled by separate research providers.

const aliases = {
  'mercedes benz': 'Mercedes-Benz',
  'mercedes-benz': 'Mercedes-Benz',
  'mercedes': 'Mercedes-Benz',
  'benz': 'Mercedes-Benz',
  'bmw': 'BMW',
  'vw': 'Volkswagen',
  'volkswagen': 'Volkswagen',
  'audi': 'Audi',
  'kia': 'Kia',
  'ford': 'Ford',
  'opel': 'Opel',
  'toyota': 'Toyota',
  'tesla': 'Tesla',
  'porsche': 'Porsche',
};

const bodyAliases = {
  'coupé': 'coupe', 'coupe': 'coupe', '2-türer': 'coupe',
  'limousine': 'sedan', 'limo': 'sedan',
  'kombi': 'wagon', 'estate': 'wagon',
  'suv': 'suv', 'geländewagen': 'suv',
  'cabrio': 'convertible', 'cabriolet': 'convertible',
  'hatchback': 'hatchback', 'kompakt': 'hatchback'
};

const fuelAliases = {
  diesel: 'diesel', benzin: 'petrol', petrol: 'petrol',
  hybrid: 'hybrid', 'plug-in': 'phev', 'plug in': 'phev',
  elektro: 'electric', elektrisch: 'electric', electric: 'electric'
};

export function normalizeText(value = '') {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
}

export function resolveVehicleMention(text = '') {
  const normalized = normalizeText(text);
  const make = Object.entries(aliases).find(([alias]) => normalized.includes(alias))?.[1] ?? null;
  const body = Object.entries(bodyAliases).find(([alias]) => normalized.includes(normalizeText(alias)))?.[1] ?? null;
  const fuel = Object.entries(fuelAliases).find(([alias]) => normalized.includes(alias))?.[1] ?? null;
  const year = normalized.match(/\b(19\d{2}|20\d{2})\b/);
  const power = normalized.match(/\b(\d{2,4})\s*(?:ps|hp)\b/);
  const generation = normalized.match(/\b(?:w|f|g|8v|8p|8v)\d{2,3}\b/i)?.[0]?.toUpperCase() ?? null;

  return {
    make,
    body,
    fuel,
    year: year ? Number(year[1]) : null,
    powerPs: power ? Number(power[1]) : null,
    generation,
    raw: text,
    confidence: make ? 0.75 : 0.25,
    needsKnowledgeLookup: true
  };
}

// Project Find — Intent Engine
// Converts natural-language vehicle requests into structured constraints.
// This is deterministic foundation code; an LLM can later enrich ambiguous cases.

const aliases = {
  diesel: ['diesel','tdi','cdi','d','crdi','bluehdi'],
  petrol: ['benzin','benziner','tsi','tfsi','tce','turbo benziner'],
  coupe: ['coupé','coupe'],
  suv: ['suv','geländewagen'],
  automatic: ['automatik','automatikgetriebe','dsg','9g-tronic','8hp'],
  manual: ['schalter','handschaltung','manuell']
};

function firstNumber(pattern, text) {
  const m = text.match(pattern);
  return m ? Number(String(m[1]).replace(/\./g, '').replace(',', '.')) : null;
}

export function understand(query) {
  const text = query.toLowerCase().trim();
  const must = [];
  const preferences = [];
  const soft = [];

  const budgetMatch = text.match(/(?:unter|max(?:imal)?|bis|für)\s*([\d.,]+)\s*(k|tausend|€)?/i);
  const budget = budgetMatch ? Number(budgetMatch[1].replace(/\./g,'')) * (/k|tausend/i.test(budgetMatch[2] || '') ? 1000 : 1) : null;
  if (budget) must.push({key:'price', op:'<=', value:budget, label:`Budget ≤ ${budget.toLocaleString('de-DE')} €`});

  const year = firstNumber(/(?:ab|seit|baujahr\s*(?:ab)?)[^\d]*(20\d{2})/i, text);
  if (year) must.push({key:'year', op:'>=', value:year, label:`Baujahr ab ${year}`});

  const power = firstNumber(/(?:mindestens|min\.?|mehr als|über)\s*(\d+)\s*(?:ps|hp)/i, text);
  if (power) must.push({key:'power', op:'>=', value:power, label:`Leistung ≥ ${power} PS`});

  const km = firstNumber(/(?:unter|max(?:imal)?|höchstens)\s*([\d.]+)\s*km/i, text);
  if (km) must.push({key:'mileage', op:'<=', value:km, label:`Kilometer ≤ ${km.toLocaleString('de-DE')} km`});

  const fuel = aliases.diesel.some(x=>text.includes(x)) ? 'Diesel' : aliases.petrol.some(x=>text.includes(x)) ? 'Benzin' : null;
  if (fuel) must.push({key:'fuel', op:'=', value:fuel, label:fuel});

  const body = aliases.coupe.some(x=>text.includes(x)) ? 'Coupé' : aliases.suv.some(x=>text.includes(x)) ? 'SUV' : null;
  if (body) must.push({key:'body', op:'=', value:body, label:body});

  const transmission = aliases.automatic.some(x=>text.includes(x)) ? 'Automatik' : aliases.manual.some(x=>text.includes(x)) ? 'Schaltung' : null;
  if (transmission) preferences.push({key:'transmission', op:'=', value:transmission, label:transmission});

  const brands = [
    ['Mercedes-Benz',['mercedes','benz']],['BMW',['bmw']],['Audi',['audi']],['Volkswagen',['vw','volkswagen']],
    ['Kia',['kia']],['Porsche',['porsche']],['Tesla',['tesla']],['Ford',['ford']],['Toyota',['toyota']],['Skoda',['skoda','škoda']]
  ];
  const brand = brands.find(([name, words]) => words.some(w=>text.includes(w)));
  if (brand) must.push({key:'make', op:'=', value:brand[0], label:brand[0]});

  return {
    originalQuery: query,
    must,
    preferences,
    soft,
    confidence: Math.min(0.99, 0.45 + must.length * 0.08),
    needsClarification: must.length === 0,
    clarificationReason: must.length === 0 ? 'Keine verwertbaren Fahrzeugkriterien erkannt.' : null
  };
}

/* Project Find — Vehicle Resolver
 * Converts messy human/listing language into a canonical vehicle identity.
 * No invented facts: unresolved fields remain null/unknown.
 */
const VEHICLE_ALIASES = {
  mercedes: ['mercedes','mercedes-benz','benz','mb'],
  bmw: ['bmw','bayerische motoren werke'],
  audi: ['audi'],
  volkswagen: ['vw','volkswagen'],
  kia: ['kia'],
  porsche: ['porsche'],
  ford: ['ford'],
  opel: ['opel'],
  skoda: ['skoda','škoda']
};
const BODY_ALIASES = {
  coupe:['coupé','coupe','2-türer','2 türer'],
  sedan:['limousine','sedan'],
  wagon:['kombi','estate','touring','avant','variant'],
  suv:['suv','geländewagen'],
  hatchback:['hatchback','kompakt'],
  convertible:['cabrio','cabriolet','roadster']
};
const FUEL_ALIASES = {
  diesel:['diesel','tdi','cdi','d','crdi','hdi','dci'],
  petrol:['benzin','petrol','tsi','tfsi','tfsI','fsi','i'],
  hybrid:['hybrid','phev','plug-in','plug in'],
  electric:['elektro','electric','ev']
};
const TRANSMISSION_ALIASES = {
  automatic:['automatik','automatic','dsg','dct','9g-tronic','9g tronic','8g-tronic','steptronic','tiptronic'],
  manual:['schalter','handschaltung','manual','6-gang','5-gang']
};

function normalizeText(value=''){
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
}
function firstAlias(text, map){
  const t=normalizeText(text);
  for(const [canonical, aliases] of Object.entries(map)){
    if(aliases.some(a=>t.includes(normalizeText(a)))) return canonical;
  }
  return null;
}
function numberMatch(text, regex){ const m=text.match(regex); return m?Number(m[1].replace(/\./g,'')):null; }

export function resolveVehicle(input=''){
  const text=normalizeText(input);
  const make=firstAlias(text,VEHICLE_ALIASES);
  const body=firstAlias(text,BODY_ALIASES);
  const fuel=firstAlias(text,FUEL_ALIASES);
  const transmission=firstAlias(text,TRANSMISSION_ALIASES);
  const year=numberMatch(text,/(?:ab|seit|baujahr)\s*(20\d{2})/i);
  const power=numberMatch(text,/(?:mindestens|min|>=)\s*(\d+)\s*(?:ps|hp)/i);
  const km=numberMatch(text,/(?:unter|maximal|höchstens|bis)\s*([\d.]+)\s*km/i);
  const priceRaw=text.match(/(?:unter|maximal|höchstens|bis)\s*([\d.,]+)\s*(k|tausend|€)?/i);
  let maxPrice=null;
  if(priceRaw){ maxPrice=Number(priceRaw[1].replace(/\./g,'').replace(',','.')); if(priceRaw[2]==='k'||priceRaw[2]==='tausend') maxPrice*=1000; }
  const generation=(text.match(/\b(w\d{3}|f\d{2}|g\d{2}|8v|8p|b8|c7|c8)\b/i)||[])[1]||null;
  const engineCode=(text.match(/\b([a-z]{1,4}\d{2,4}[a-z]?|m\d{2,3})\b/i)||[])[1]||null;
  return {
    raw:input,
    identity:{make,model:null,generation,facelift:null,body,variant:null},
    constraints:{year_from:year,power_min_ps:power,max_price_eur:maxPrice,max_km:km,fuel,transmission},
    engine:{code:engineCode},
    unresolved:['model','variant'],
    confidence:{make:make?0.94:0,body:body?0.9:0,fuel:fuel?0.88:0,generation:generation?0.82:0,engine_code:engineCode?0.6:0},
    status: make?'partial_identity':'unresolved'
  };
}

export function explainResolution(result){
  const known=Object.entries(result.identity).filter(([,v])=>v!==null).map(([k,v])=>`${k}: ${v}`);
  const constraints=Object.entries(result.constraints).filter(([,v])=>v!==null).map(([k,v])=>`${k}: ${v}`);
  return {known, constraints, unresolved:result.unresolved};
}

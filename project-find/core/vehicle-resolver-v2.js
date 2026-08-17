// Project Find — Vehicle Resolver v2
// Deterministic normalization layer. Unknown values stay unknown.
const ALIASES={
 mercedes:['mercedes','mercedes-benz','benz'],
 bmw:['bmw'],
 volkswagen:['vw','volkswagen'],
 audi:['audi'],
 kia:['kia'],
 porsche:['porsche'],
 ford:['ford'],
 opel:['opel'],
 skoda:['skoda','škoda']
};
const BODY=['coupé','coupe','limousine','sedan','suv','kombi','estate','wagon','cabrio','cabriolet','hatchback','van'];
const FUEL=['diesel','benzin','petrol','gasoline','hybrid','plug-in hybrid','elektro','electric'];
function findAlias(text,map){for(const [canonical,aliases] of Object.entries(map)){if(aliases.some(a=>new RegExp(`\\b${a.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\b`,'i').test(text)))return canonical}return null}
function resolveVehicle(input){
 const text=String(input||'').trim(); const low=text.toLowerCase();
 const year=(low.match(/\b(19|20)\d{2}\b/)||[])[0]||null;
 const ps=(low.match(/\b(\d{3,4})\s*(?:ps|hp)\b/)||[])[1];
 const engine=(low.match(/\b(\d(?:\.\d)?\s*(?:tdi|cdi|d|i|tsi|tfsi|gti|tdci|crdi|d4d|dci))\b/i)||[])[1]||null;
 const generation=(low.match(/\b(w\d{3}|f\d{2,3}|g\d{2,3}|8v|8y|b9|c8|mk\s?\d|e\d{2})\b/i)||[])[1]||null;
 const body=BODY.find(x=>low.includes(x))||null;
 const fuel=FUEL.find(x=>low.includes(x))||null;
 const brand=findAlias(low,ALIASES);
 return {raw:text,brand,model:null,generation,variant:null,engine,body,fuel,year:year?Number(year):null,powerPs:ps?Number(ps):null,confidence:{brand:!!brand,generation:!!generation,engine:!!engine,body:!!body,fuel:!!fuel},needsEnrichment:true};
}
if(typeof module!=='undefined')module.exports={resolveVehicle};
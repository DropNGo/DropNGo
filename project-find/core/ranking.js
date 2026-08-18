// Project Find — transparent ranking
function scoreListing(listing,criteria){
 const reasons=[]; let hard=true;
 const check=(ok,label)=>{if(ok)reasons.push({label,pass:true});else{hard=false;reasons.push({label,pass:false});}};
 if(criteria.brand)check((listing.title||'').toLowerCase().includes(criteria.brand.toLowerCase()),'Marke');
 if(criteria.fuel)check((listing.fuel||'').toLowerCase()===criteria.fuel.toLowerCase(),'Kraftstoff');
 if(criteria.year)check(Number(listing.year)>=criteria.year,'Baujahr');
 if(criteria.powerPs)check(Number(listing.powerPs)>=criteria.powerPs,'Leistung');
 if(criteria.maxPrice)check(Number(listing.priceEur)<=criteria.maxPrice,'Budget');
 if(criteria.maxKm)check(Number(listing.mileageKm)<=criteria.maxKm,'Kilometer');
 const passed=reasons.filter(x=>x.pass).length, total=Math.max(reasons.length,1);
 const finalScore=Math.round((passed/total)*85 + (listing.verification?.confidence||0)*15);
 return {hardConstraintPass:hard,finalScore,reasons};
}
if(typeof module!=='undefined')module.exports={scoreListing};
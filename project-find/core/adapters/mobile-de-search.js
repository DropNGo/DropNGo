// Project Find — mobile.de Search API adapter
// Credentials must be supplied server-side. Never expose them in the browser.
const BASE='https://services.mobile.de/search-api/search';
function buildMobileDeSearch(criteria={}){
 const p=new URLSearchParams();
 if(criteria.country)p.set('country',criteria.country);
 if(criteria.makeModel)p.set('makeModel',criteria.makeModel);
 if(criteria.fuel)p.set('fuel',criteria.fuel);
 if(criteria.priceMax!=null)p.set('priceMax',String(criteria.priceMax));
 if(criteria.powerMin!=null)p.set('powerMin',String(criteria.powerMin));
 if(criteria.mileageMax!=null)p.set('mileageMax',String(criteria.mileageMax));
 if(criteria.firstRegistrationMin)p.set('firstRegistrationMin',criteria.firstRegistrationMin);
 p.set('page.number',String(criteria.page||1));
 p.set('page.size',String(Math.min(criteria.size||20,100)));
 return `${BASE}?${p.toString()}`;
}
module.exports={buildMobileDeSearch};
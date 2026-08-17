// Project Find — price intelligence v0
// No invented market value: a range is only emitted when comparable observed listings exist.
function priceAssessment(target,comparables=[]){
 const prices=comparables.map(x=>Number(x.priceEur)).filter(Number.isFinite).filter(x=>x>0);
 if(!prices.length)return {status:'insufficient-data',range:null,explanation:'Keine verifizierten Vergleichspreise vorhanden.'};
 prices.sort((a,b)=>a-b); const median=prices[Math.floor(prices.length/2)];
 const min=Math.min(...prices),max=Math.max(...prices);
 const targetPrice=Number(target.priceEur);
 let label='unknown'; if(Number.isFinite(targetPrice)){if(targetPrice<min)label='below-observed-range';else if(targetPrice>max)label='above-observed-range';else label='within-observed-range';}
 return {status:'observed-comparables',range:{min,max,median},targetPrice,label,comparablesUsed:prices.length};
}
if(typeof module!=='undefined')module.exports={priceAssessment};
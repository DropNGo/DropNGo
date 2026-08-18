// Project Find — Listing Inspector contract
function inspectListing(listing){
 const text=(listing.description||'').toLowerCase();
 const flags=[];
 const patterns=[
  [/unfall|unfallfrei|unfallfahrzeug/,'accident-language'],
  [/nachlackiert|lackiert|smart repair/,'paint-repair-language'],
  [/motorlampe|motorkontroll|airbag|abs|esp/,'warning-light-language'],
  [/reifen.*(abgefahren|profil)|profil.*(abgefahren|gering)/,'tyre-wear-language'],
  [/bastler|export|händler.*im auftrag/,'seller-risk-language']
 ];
 for(const [re,type] of patterns)if(re.test(text))flags.push({type,evidence:text.match(re)?.[0]||null,confidence:'textual'});
 return {flags,imageInspection:'not_run',disclaimer:'Text and images can reveal indicators, not prove hidden mechanical or accident history.'};
}
if(typeof module!=='undefined')module.exports={inspectListing};
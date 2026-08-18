// Project Find — Link Inspector v0
// A source adapter must fetch the page; this module only normalizes what is supplied.
function inspectUrlResult(sourceUrl,page){
 return {
  sourceUrl,
  title:page?.title||null,
  description:page?.description||null,
  images:Array.isArray(page?.images)?page.images:[],
  observedFields:page?.fields||{},
  next:['vehicle-resolve','listing-inspect','image-inspect','price-compare','rank']
 };
}
if(typeof module!=='undefined')module.exports={inspectUrlResult};
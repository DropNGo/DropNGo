// Project Find — Research Planner
// Produces the work plan shown to the UI. A step is marked complete only when
// the corresponding provider actually returns data.

export function plan(intent) {
  return [
    {id:'understand', label:'Anfrage verstehen', status:'ready'},
    {id:'market', label:'Marktrealität prüfen', status:'ready'},
    {id:'search', label:'Quellen durchsuchen', status:'ready'},
    {id:'normalize', label:'Angebote normalisieren', status:'ready'},
    {id:'verify', label:'Inserat & Bilder prüfen', status:'ready'},
    {id:'rank', label:'Treffer bewerten', status:'ready'}
  ];
}

export function markStep(trace, id, status, meta={}) {
  return trace.map(step => step.id===id ? {...step,status,meta} : step);
}

(() => {
  const style = document.createElement('style');
  style.textContent = `
    .growth-strip{margin:0 0 22px;padding:11px 13px;border:1px solid #2f2640;background:linear-gradient(90deg,#120d1a,#0e0e13);border-radius:14px;color:#bfb5c9;font-size:11px;line-height:1.45}
    .growth-strip b{color:#eee}
    .proof{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:18px 0 4px}
    .proof-card{background:#0d0d12;border:1px solid #26252d;border-radius:14px;padding:11px;text-align:center}
    .proof-card strong{display:block;color:#f4f4f8;font-size:14px;margin-bottom:3px}
    .proof-card span{color:#777;font-size:10px}
    .usecases{display:grid;gap:9px;margin:18px 0}
    .usecase{display:flex;gap:10px;align-items:flex-start;background:#0d0d12;border:1px solid #26252d;border-radius:15px;padding:12px}
    .usecase b{display:block;font-size:12px;margin-bottom:3px}.usecase span{color:#888;font-size:11px;line-height:1.4}
    .sharebar{display:flex;gap:8px;margin-top:12px}.sharebtn{flex:1;background:#121217;border:1px solid #2b2932;color:#d7d5dd;border-radius:12px;padding:10px;font-size:11px}.sharebtn:hover{border-color:#6f39a2}
    .result-note{margin-top:12px;color:#777;font-size:10px;line-height:1.4}
  `;
  document.head.appendChild(style);

  const hero = document.querySelector('.hero');
  if (!hero || document.querySelector('.growth-strip')) return;

  const strip = document.createElement('div');
  strip.className = 'growth-strip';
  strip.innerHTML = '<b>Find macht Schluss mit endlosem Suchen.</b><br>Du beschreibst dein Ziel. Find zerlegt die Anfrage, prüft die Realität und recherchiert die passenden Optionen.';
  hero.prepend(strip);

  const proof = document.createElement('div');
  proof.className = 'proof';
  proof.innerHTML = `
    <div class="proof-card"><strong>01</strong><span>Anfrage verstehen</span></div>
    <div class="proof-card"><strong>02</strong><span>Quellen prüfen</span></div>
    <div class="proof-card"><strong>03</strong><span>Ergebnis erklären</span></div>`;
  hero.appendChild(proof);

  const usecases = document.createElement('section');
  usecases.className = 'usecases';
  usecases.innerHTML = `
    <div class="usecase"><div>🔎</div><div><b>„Find mir …“</b><span>Du musst keine perfekte Suchanfrage formulieren. Schreib wie mit einem Freund.</span></div></div>
    <div class="usecase"><div>🧠</div><div><b>„Ist das realistisch?“</b><span>Find soll nicht einfach gehorchen, sondern Budget, Markt und Anforderungen gegeneinander prüfen.</span></div></div>
    <div class="usecase"><div>🛡️</div><div><b>„Worauf muss ich achten?“</b><span>Risiken und offene Punkte werden sichtbar gemacht, statt schöngeredet.</span></div></div>`;
  hero.appendChild(usecases);

  const share = document.createElement('div');
  share.className = 'sharebar';
  share.innerHTML = '<button class="sharebtn" id="shareFind">↗ Find teilen</button><button class="sharebtn" id="tryFind">✦ Beispiel starten</button>';
  hero.appendChild(share);

  document.getElementById('shareFind')?.addEventListener('click', async () => {
    const text = 'Project Find – beschreibe einfach, was du suchst, und Find recherchiert dafür.';
    try { await navigator.share?.({ title: 'Project Find', text, url: location.href }); }
    catch { await navigator.clipboard?.writeText(location.href); const b=document.getElementById('shareFind'); if(b){b.textContent='✓ Link kopiert';setTimeout(()=>b.textContent='↗ Find teilen',1800);} }
  });
  document.getElementById('tryFind')?.addEventListener('click', () => {
    const input = document.getElementById('q');
    if (!input) return;
    input.value = 'Find mir ein Mercedes Coupé Diesel, ab 2015, mindestens 250 PS, unter 15.000 €';
    input.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

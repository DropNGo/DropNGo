(() => {
  const root = document;
  const KEY = 'find:favorites:v2';
  const getFavs = () => { try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { return new Set(); } };
  const saveFavs = (set) => localStorage.setItem(KEY, JSON.stringify([...set]));

  function toast(message) {
    let el = root.getElementById('findToast');
    if (!el) { el = root.createElement('div'); el.id='findToast'; el.style.cssText='position:fixed;left:50%;bottom:82px;transform:translateX(-50%) translateY(12px);background:#15151c;color:#fff;border:1px solid #3a3545;border-radius:999px;padding:10px 14px;font-size:12px;opacity:0;pointer-events:none;transition:.2s;z-index:9999;box-shadow:0 10px 30px #0008'; root.body.appendChild(el); }
    el.textContent=message; el.style.opacity='1'; el.style.transform='translateX(-50%) translateY(0)'; clearTimeout(window.__findToastTimer); window.__findToastTimer=setTimeout(()=>{el.style.opacity='0';el.style.transform='translateX(-50%) translateY(12px)'},1600);
  }

  function cardId(card) { return card.getAttribute('data-source-url') || card.querySelector('.name')?.textContent?.trim() || Math.random().toString(36).slice(2); }

  function syncFavorites() {
    const favs=getFavs();
    root.querySelectorAll('.car').forEach(card=>{
      const heart=card.querySelector('.heart'); if(!heart) return;
      const id=cardId(card); heart.dataset.favId=id; const on=favs.has(id); heart.textContent=on?'♥':'♡'; heart.setAttribute('aria-label',on?'Aus Favoriten entfernen':'Zu Favoriten hinzufügen');
    });
  }

  function showAll() { root.querySelectorAll('.car').forEach(card=>card.style.display=''); }
  function showFavorites() {
    const favs=getFavs(); let shown=0;
    root.querySelectorAll('.car').forEach(card=>{const id=cardId(card);const keep=favs.has(id);card.style.display=keep?'':'none';if(keep)shown++;});
    const title=root.getElementById('resultTitle');if(title)title.textContent=shown?`${shown} Favoriten`:'Keine Favoriten in diesem Suchlauf';
    if(!shown) root.getElementById('results').insertAdjacentHTML('afterbegin','<div id="favEmpty" class="empty"><strong>Noch keine Favoriten</strong>Tippe auf ♡ bei einem verifizierten Angebot.</div>');
    toast(shown?`${shown} Favorit${shown===1?'':'en'} angezeigt`:'Noch keine Favoriten');
  }

  root.addEventListener('click',async (event)=>{
    const heart=event.target.closest('.heart');
    if(heart){event.preventDefault();const favs=getFavs(),id=heart.dataset.favId;if(!id)return;if(favs.has(id)){favs.delete(id);heart.textContent='♡';toast('Aus Favoriten entfernt')}else{favs.add(id);heart.textContent='♥';toast('Zu Favoriten gespeichert')}saveFavs(favs);return;}

    const detail=event.target.closest('.details-btn');
    if(detail){const card=detail.closest('.car');const details=card?.querySelector('.details');if(details){const hidden=details.style.display==='none';details.style.display=hidden?'block':'none';detail.textContent=hidden?'Weniger':'Details'}return;}

    const inspect=event.target.closest('.inspect-btn');
    if(inspect){const card=inspect.closest('.car');const title=card?.querySelector('.name')?.textContent?.trim()||'Fahrzeug';const url=card?.getAttribute('data-source-url')||card?.querySelector('a[href]')?.href||'';const text=url?`${title}\n${url}`:title;try{if(navigator.share)await navigator.share({title:'Find',text,url:url||location.href});else{await navigator.clipboard.writeText(text);toast('Link kopiert')}}catch{}return;}

    const tab=event.target.closest('.tab');
    if(tab){root.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');if(tab.dataset.tab==='all'){showAll();toast('Alle verifizierten Treffer')}else{showAll();toast('Beste Treffer')}return;}

    const nav=event.target.closest('.navitem');
    if(nav){root.querySelectorAll('.navitem').forEach(n=>n.classList.remove('active'));nav.classList.add('active');const label=nav.textContent.trim().toLowerCase();if(label.includes('favoriten'))showFavorites();else if(label.includes('ergebnisse')){showAll();root.getElementById('panel')?.classList.add('show');root.getElementById('panel')?.scrollIntoView({behavior:'smooth',block:'start'});}else if(label.includes('profil')){const modal=root.getElementById('modal');if(modal){root.getElementById('modalTitle').textContent='Find-Profil';root.getElementById('modalText').textContent='Noch kein Konto nötig. Favoriten werden auf diesem Gerät lokal gespeichert. Cloud-Sync kommt später.';modal.classList.add('show')}}else{root.getElementById('q')?.focus();window.scrollTo({top:0,behavior:'smooth'})}return;}

    if(event.target.id==='modalClose'||event.target.id==='modal') root.getElementById('modal')?.classList.remove('show');
  });

  new MutationObserver(()=>syncFavorites()).observe(root.body,{childList:true,subtree:true});
  syncFavorites();
})();

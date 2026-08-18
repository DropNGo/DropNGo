(() => {
  const root = document;
  const KEY = 'find:favorites:v1';

  const getFavs = () => {
    try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { return new Set(); }
  };
  const saveFavs = (set) => localStorage.setItem(KEY, JSON.stringify([...set]));

  const slug = (name) => String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

  function toast(message) {
    let el = root.getElementById('findToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'findToast';
      el.style.cssText = 'position:fixed;left:50%;bottom:82px;transform:translateX(-50%) translateY(12px);background:#15151c;color:#fff;border:1px solid #3a3545;border-radius:999px;padding:10px 14px;font-size:12px;opacity:0;pointer-events:none;transition:.2s;z-index:9999;box-shadow:0 10px 30px #0008';
      root.body.appendChild(el);
    }
    el.textContent = message;
    el.style.opacity = '1';
    el.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(window.__findToastTimer);
    window.__findToastTimer = setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(-50%) translateY(12px)'; }, 1600);
  }

  function wireCards() {
    const favs = getFavs();
    root.querySelectorAll('.car').forEach((card, idx) => {
      const name = card.querySelector('.name')?.textContent?.trim();
      if (!name) return;
      const id = slug(name) + '-' + idx;
      const heart = card.querySelector('.heart');
      if (heart) {
        heart.dataset.favId = id;
        heart.textContent = favs.has(id) ? '♥' : '♡';
        heart.setAttribute('aria-label', favs.has(id) ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen');
      }
      const body = card.querySelector('.body');
      if (body && !body.querySelector('.card-actions')) {
        const actions = document.createElement('div');
        actions.className = 'card-actions';
        actions.style.cssText = 'display:flex;gap:8px;margin-top:12px';
        actions.innerHTML = '<button class="card-btn details-btn" type="button">Details</button><button class="card-btn inspect-btn" type="button">Prüfen</button>';
        body.appendChild(actions);
      }
    });
  }

  function showFavorites() {
    const favs = getFavs();
    const cards = [...root.querySelectorAll('.car')];
    cards.forEach(card => {
      const heart = card.querySelector('.heart');
      card.style.display = heart && favs.has(heart.dataset.favId) ? '' : 'none';
    });
    const title = root.getElementById('resultTitle');
    if (title) title.textContent = 'Favoriten';
    toast(favs.size ? `${favs.size} Favorit${favs.size === 1 ? '' : 'en'} in diesem Suchlauf` : 'Noch keine Favoriten');
  }

  function showAll() {
    root.querySelectorAll('.car').forEach(card => card.style.display = '');
  }

  root.addEventListener('click', (event) => {
    const heart = event.target.closest('.heart');
    if (heart) {
      event.preventDefault();
      const favs = getFavs();
      const id = heart.dataset.favId;
      if (!id) return;
      if (favs.has(id)) { favs.delete(id); heart.textContent = '♡'; toast('Aus Favoriten entfernt'); }
      else { favs.add(id); heart.textContent = '♥'; toast('Zu Favoriten gespeichert'); }
      saveFavs(favs);
      return;
    }

    const detail = event.target.closest('.details-btn');
    if (detail) {
      const card = detail.closest('.car');
      const details = card?.querySelector('.details');
      if (details) { details.style.display = details.style.display === 'none' ? 'block' : 'none'; }
      else toast('Keine zusätzlichen geprüften Details vorhanden');
      return;
    }

    const inspect = event.target.closest('.inspect-btn');
    if (inspect) {
      const card = inspect.closest('.car');
      const title = card?.querySelector('.name')?.textContent?.trim() || 'Dieses Fahrzeug';
      const url = card?.querySelector('a[href]')?.href || '';
      const text = url ? `${title}\n${url}` : title;
      if (navigator.share) navigator.share({ title: 'Project Find', text }).catch(() => {});
      else navigator.clipboard?.writeText(text).then(() => toast('Fahrzeug-Link kopiert')).catch(() => toast('Keine Quelle zum Teilen verfügbar'));
      return;
    }

    const tab = event.target.closest('.tab');
    if (tab) {
      root.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const label = tab.textContent.trim().toLowerCase();
      if (label.includes('favorit')) showFavorites(); else showAll();
      return;
    }

    const nav = event.target.closest('.navitem');
    if (nav) {
      const label = nav.textContent.trim().toLowerCase();
      if (label.includes('favoriten')) {
        showFavorites();
        root.getElementById('panel')?.classList.add('show');
        root.getElementById('panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (label.includes('ergebnisse')) {
        showAll();
        root.getElementById('panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (label.includes('profil')) {
        toast('Profil kommt als nächster Schritt – dein Suchverlauf bleibt bis dahin lokal.');
      } else {
        root.getElementById('q')?.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      root.querySelectorAll('.navitem').forEach(n => n.classList.remove('active'));
      nav.classList.add('active');
    }
  });

  const observer = new MutationObserver(() => wireCards());
  observer.observe(root.body, { childList: true, subtree: true });
  wireCards();
})();

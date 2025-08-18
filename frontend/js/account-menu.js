// account-menu.js
const SLOT_ID = 'accountSlot';
const ICON = `
  <svg class="acc-glyph" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5Zm0 2c-4 0-7 2.6-7 5.8 0 .7.6 1.2 1.3 1.2h11.5c.7 0 1.3-.5 1.3-1.2C19 16.6 16 14 12 14Z"
          stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

function renderButton(slot, loggedIn=false){
  slot.innerHTML = `
    <button class="acc-btn" id="accBtn" title="Mein Konto" aria-label="Mein Konto">
      ${ICON}
      ${loggedIn ? '<i class="acc-dot" aria-hidden="true"></i>' : ''}
    </button>`;
  slot.querySelector('#accBtn')?.addEventListener('click', ()=> location.href='account.html');
}

async function init() {
  const slot = document.getElementById(SLOT_ID);
  if (!slot) return;

  // Immer ein sichtbares Icon rendern (Fallback)
  renderButton(slot, false);

  // Wenn Keys existieren, Session prüfen
  if (window.SUPABASE_URL && window.SUPABASE_ANON) {
    try {
      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      const supabase = createClient(window.SUPABASE_URL, window.SUPABASE_ANON);
      const { data:{ session } } = await supabase.auth.getSession();
      if (session) renderButton(slot, true);
    } catch (_) { /* leise failen → Fallback bleibt */ }
  }
}

document.readyState !== 'loading' ? init() : document.addEventListener('DOMContentLoaded', init);

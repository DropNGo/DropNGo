// auth.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Keys kommen aus auth-config.js (muss vorher geladen werden)
const supabase = createClient(window.SUPABASE_URL, window.SUPABASE_ANON)

// Helper
const $  = s => document.querySelector(s)
function show(el, text, ok=true){
  if(!el) return
  el.style.display = 'block'
  el.className = 'alert ' + (ok ? 'alert--ok' : 'alert--warn')
  el.textContent = text
}

/* ---------- LOGIN ---------- */
const loginForm = $('#panel-login')
loginForm?.addEventListener('submit', async (e)=>{
  e.preventDefault()
  const email = $('#login-email').value.trim()
  const pass  = $('#login-password').value
  const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
  if(error) return show($('#login-msg'), 'Fehler: '+error.message, false)
  show($('#login-msg'), 'Erfolgreich angemeldet. Weiterleitung …', true)
  setTimeout(()=> location.href = 'index.html', 800)
})

// --- SIGNUP (→ Danke-Seite & E-Mail-Bestätigung) ---
document.getElementById('panel-signup')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name  = document.getElementById('name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass  = document.getElementById('signup-password').value;

  const { error } = await supabase.auth.signUp({
    email, password: pass,
    options: {
      data: { full_name: name },
      // WICHTIG: Nach dem Bestätigungs-Klick führt der Link zu danke.html
      emailRedirectTo: `${location.origin}/danke.html`
    }
  });

  const msg = document.getElementById('signup-msg');
  if (error) {
    if (msg) { msg.style.display='block'; msg.className='alert alert--warn'; msg.textContent='Fehler: ' + error.message; }
    return;
  }

  // Direkt nach erstem Registrieren zur Danke-Seite:
  location.href = 'danke.html?checkmail=1';
});


/* ---------- FORGOT ---------- */
const forgotForm = $('#panel-forgot')
forgotForm?.addEventListener('submit', async (e)=>{
  e.preventDefault()
  const email = $('#forgot-email').value.trim()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/reset.html`
  })
  if(error) return show($('#forgot-msg'), 'Fehler: '+error.message, false)
  show($('#forgot-msg'), 'Wir haben dir einen Link zum Zurücksetzen geschickt.', true)
})


// ===== DropNGo Mobile System =====
(() => {
  const btn = document.getElementById('dngNavToggle');
  const drawer = document.getElementById('dngMobileMenu');
  const overlay = document.getElementById('dngOverlay');
  if (!btn || !drawer || !overlay) return;

  let lastFocus = null;
  const focusablesSel = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

  const open = () => {
    lastFocus = document.activeElement;
    drawer.hidden = false; overlay.hidden = false;
    drawer.classList.add('open'); overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    btn.setAttribute('aria-expanded','true');
    const first = drawer.querySelector(focusablesSel);
    first?.focus();
    document.addEventListener('focus', trap, true);
  };

  const close = () => {
    drawer.classList.remove('open'); overlay.classList.remove('open');
    document.body.style.overflow = '';
    btn.setAttribute('aria-expanded','false');
    drawer.hidden = true; overlay.hidden = true;
    document.removeEventListener('focus', trap, true);
    lastFocus?.focus();
  };

  const trap = (e) => {
    if (!drawer.contains(e.target)) {
      const first = drawer.querySelector(focusablesSel);
      first?.focus(); e.stopPropagation();
    }
  };

  btn.addEventListener('click', () => {
    const openState = btn.getAttribute('aria-expanded') === 'true';
    openState ? close() : open();
  });
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

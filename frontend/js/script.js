
// ========== DropNGo base script (cleaned) ==========
// Runs after DOM is ready
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => root.querySelectorAll(sel);

document.addEventListener('DOMContentLoaded', () => {
  // ---- Product name (optional) ----
  const productNameEl = $('[data-product-name]') || $('.product-title');
  const productName = productNameEl ? productNameEl.textContent.trim() : null;
  if (productName) console.log('Produkt geklickt:', productName);

  // ---- Announcement close (optional) ----
  const announcement = $('.announcement');
  const announceClose = $('.announcement-close');
  if (announcement && announceClose) {
    announceClose.addEventListener('click', () => {
      announcement.style.display = 'none';
    });
  }

  // ---- Cookie banner (requires #cookie-container in HTML) ----
  const cookieContainer = $('#cookie-container');
  if (cookieContainer) {
    const consent = localStorage.getItem('cookieConsent');
    if (consent !== 'accepted' && consent !== 'declined') {
      cookieContainer.innerHTML = `
        <div id="cookie-banner" class="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie Hinweis">
          <p>
            Wir nutzen Cookies für das beste Erlebnis. Mit der Nutzung unserer Website stimmst du zu.
            <a href="datenschutz.html" style="color:rgb(24,161,150); text-decoration: underline;">Mehr Infos</a>
          </p>
          <div class="cookie-buttons">
            <button id="accept-cookies-btn" aria-label="Cookies akzeptieren">Akzeptieren</button>
            <button id="decline-cookies-btn" aria-label="Cookies ablehnen">Ablehnen</button>
          </div>
        </div>
      `;

      const banner = $('#cookie-banner');
      const acceptBtn = $('#accept-cookies-btn');
      const declineBtn = $('#decline-cookies-btn');
      if (acceptBtn && declineBtn && banner) {
        acceptBtn.addEventListener('click', () => {
          localStorage.setItem('cookieConsent', 'accepted');
          banner.classList.add('hide');
        });
        declineBtn.addEventListener('click', () => {
          localStorage.setItem('cookieConsent', 'declined');
          banner.classList.add('hide');
        });
      }
    }
  }

  // ---- Optional demo button (#openBtn) ----
  const openBtn = $('#openBtn');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      console.log('Button wurde geklickt!');
    });
  }
});

// ========== Notes ==========
// - Alle Warenkorb-Funktionen/Referenzen wurden entfernt.
// - Alle DOM-Zugriffe sind null-sicher (prüfen Existenz vor Nutzung).
// - Falls du ein Element per ID/Selector ansprechen willst, stelle sicher,
//   dass es im HTML existiert oder prüfe vorher mit if(el) {...}.

// ===== Mobile-Navi (drop-in replacement: Scroll-Lock, ESC, Outside-Click, MQ) =====
document.addEventListener('DOMContentLoaded', () => {
  const navToggle  = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!navToggle || !mobileMenu) return;

  // ARIA/Wiring
  navToggle.setAttribute('aria-controls', mobileMenu.id);
  navToggle.setAttribute('aria-expanded', 'false');

  // Backdrop erstellen (einmalig)
  let backdrop = document.getElementById('mobileMenuBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'mobileMenuBackdrop';
    backdrop.className = 'mobile-menu-backdrop';
    document.body.appendChild(backdrop);
  }

  const focusablesSel = 'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])';

  const openMenu = () => {
    mobileMenu.hidden = false;
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    backdrop.dataset.open = 'true';

    // Fokus auf erstes Element im Menü
    (mobileMenu.querySelector(focusablesSel) || navToggle).focus();

    // Beim Klick auf einen Menülink schließen
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', closeMenu, { once: true })
    );
  };

  const closeMenu = () => {
    mobileMenu.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    backdrop.dataset.open = 'false';
    navToggle.focus();
  };

  const isOpen = () => !mobileMenu.hasAttribute('hidden');

  // Toggle-Button
  navToggle.addEventListener('click', () => (isOpen() ? closeMenu() : openMenu()));

  // Backdrop klickbar
  backdrop.addEventListener('click', closeMenu);

  // ESC schließt
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeMenu();
  });

  // Bei Desktop-Breite automatisch schließen
  const mq = window.matchMedia('(min-width: 900px)');
  const onMQ = () => { if (mq.matches && isOpen()) closeMenu(); };
  mq.addEventListener ? mq.addEventListener('change', onMQ) : mq.addListener(onMQ);

  // ---- Aktiven Link markieren (wie vorher) ----
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.setAttribute('aria-current','page');
    
  });
});





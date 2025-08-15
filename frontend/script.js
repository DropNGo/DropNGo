
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


// Mobile menu toggle (global)
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const open = !mobileMenu.hasAttribute('hidden');
      if (open) {
        mobileMenu.setAttribute('hidden', '');
        navToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.removeAttribute('hidden');
        navToggle.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Aktiven Link markieren
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.setAttribute('aria-current','page');
  });
});




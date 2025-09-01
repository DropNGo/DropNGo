// js/cookie-banner.js
// This script dynamically injects a cookie consent banner into the page and
// persists the user’s choice in localStorage. It mirrors the markup and
// behaviour previously embedded in index.html so the same banner can be
// referenced across any page by simply including this script and the
// accompanying CSS.

document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'dng_cookies_v1';

  // Optional development shortcut: appending ?cookies=reset to the URL will
  // clear the stored consent so the banner reappears without reloading.
  if (new URLSearchParams(location.search).get('cookies') === 'reset') {
    localStorage.removeItem(KEY);
    // Do not reload here so the banner shows immediately.
  }

  // If a consent value is already saved, do not render the banner again.
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return;
  } catch (_) {
    // If reading localStorage throws, fall through to show the banner.
  }

  // Locate or create the mount container for the banner. Any element with
  // id="cookieBanner" will be used; otherwise one is appended to the body.
  let mount = document.getElementById('cookieBanner');
  if (!mount) {
    mount = document.createElement('div');
    mount.id = 'cookieBanner';
    document.body.appendChild(mount);
  }

  // Inject the banner markup. The classes and structure match those used on
  // the original index page so the CSS will style it identically. The
  // datenschutz link uses a relative URL; adjust if necessary.
  mount.innerHTML = `
    <div class="cookie" role="dialog" aria-live="polite" aria-label="Cookie Hinweis">
      <div class="cookie__row">
        <div>
          <strong>Cookies für ein besseres Erlebnis</strong>
          <p class="cookie__text">
            Wir verwenden Cookies für grundlegende Funktionen, Statistiken und um Inhalte zu verbessern.
            Details findest du in unserer <a href="datenschutz.html" style="color:var(--brand); text-decoration:underline;">Datenschutz</a>.
          </p>
        </div>
        <div class="cookie__actions">
          <button class="btn btn--ghost" id="cookieDecline">Nur nötig</button>
          <button class="btn" id="cookieAccept">Akzeptieren</button>
        </div>
      </div>
    </div>
  `;

  const banner = mount.querySelector('.cookie');
  const accept = mount.querySelector('#cookieAccept');
  const decline = mount.querySelector('#cookieDecline');

  // Make the banner visible when mounted.
  banner.style.display = 'block';

  function save(val) {
    // Save the user’s choice (necessary always true; analytics equal to val) along with timestamp.
    localStorage.setItem(KEY, JSON.stringify({
      necessary: true,
      analytics: val,
      date: new Date().toISOString(),
    }));
    banner.style.display = 'none';
  }

  accept.addEventListener('click', () => save(true));
  decline.addEventListener('click', () => save(false));
});
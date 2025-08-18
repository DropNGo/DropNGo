// account-slot.js  (OHNE <script> Tags!)
(function () {
  const onReady = (fn) =>
    document.readyState !== 'loading'
      ? fn()
      : document.addEventListener('DOMContentLoaded', fn);

  onReady(() => {
    // Passenden Header suchen
    const header =
      document.querySelector('.site-header .nav') ||
      document.querySelector('header .nav') ||
      document.querySelector('header');

    if (!header) return; // keine Header-Navigation gefunden

    // Slot nur anlegen, wenn noch nicht vorhanden
    if (document.getElementById('accountSlot')) return;

    const slot = document.createElement('div');
    slot.id = 'accountSlot';
    slot.className = 'account';

    // Möglichst direkt vor den Burger setzen, sonst ans Ende
    const burger = header.querySelector('#navToggle, .nav-toggle');
    if (burger && burger.parentNode === header) {
      header.insertBefore(slot, burger);
    } else {
      header.appendChild(slot);
    }

    // Optionales Event für Scripts, die warten möchten
    document.dispatchEvent(
      new CustomEvent('accountSlot:ready', { detail: { slot } })
    );
  });
})();

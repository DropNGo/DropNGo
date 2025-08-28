import { getProducts } from './product-data.js';

async function init() {
  const products = await getProducts();
  const path = location.pathname;
  let idMatch = path.match(/produkt-detail(\d+)\.html/);
  if (!idMatch) idMatch = path.match(/(?:^|\/)(\d+)-[^/]*\.html$/);
  const currentId = idMatch ? idMatch[1] : null;
  const product = products.find(p => p.id === currentId);

  if (product) {
    const displayTitle = `${product.id}. ${product.title}`;

    // Title / OG title
    document.title = `${displayTitle} | DropNGo`;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `${displayTitle} | DropNGo`);

    // H1 and breadcrumb
    const nameEl = document.querySelector('[data-product-name]');
    if (nameEl) nameEl.textContent = displayTitle;
    const bcCurrent = document.querySelector('.breadcrumbs [aria-current="page"]');
    if (bcCurrent) bcCurrent.textContent = displayTitle;

    // Prices: sticky and main
    const stickyName = document.getElementById('scName');
    if (stickyName) stickyName.textContent = displayTitle;
    const stickyPrice = document.querySelector('.sticky-cta .price');
    if (stickyPrice) stickyPrice.textContent = product.price;
    const infoPrice = document.querySelector('.info .price');
    if (infoPrice) infoPrice.textContent = product.price;

    // Unify partner link across all primary CTAs
    const primaryLinks = Array.from(document.querySelectorAll('a.cta-primary'));
    const firstHref = primaryLinks.find(a => a.getAttribute('href'))?.getAttribute('href');
    if (firstHref) {
      primaryLinks.forEach(a => {
        a.setAttribute('href', firstHref);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'nofollow noopener');
      });
    }
  }

  // fill related products
  const relGrid = document.querySelector('.related .rel-grid');
  if (relGrid) {
    const related = products.filter(p => p.id !== currentId).slice(0, 3);
    relGrid.innerHTML = related.map(p => `
      <article class="rel-card">
        <a href="${p.link}">
          <img src="${p.image}" alt="${p.title}">
          <div class="body">
            <strong>${p.title}</strong>
            <span class="price">${p.price}</span>
          </div>
        </a>
      </article>
    `).join('');
  }

  // gallery slider
  const heroImg = document.getElementById('heroImg');
  const thumbs = Array.from(document.querySelectorAll('.thumbs [data-src]'));
  const images = [
    { src: heroImg?.src, alt: heroImg?.alt },
    ...thumbs.map(t => ({ src: t.dataset.src, alt: t.getAttribute('alt') }))
  ];
  let index = 0;

  function show(i) {
    if (!heroImg) return;
    index = (i + images.length) % images.length;
    heroImg.src = images[index].src;
    heroImg.alt = images[index].alt || '';
  }

  document.querySelector('.gallery-prev')?.addEventListener('click', () => show(index - 1));
  document.querySelector('.gallery-next')?.addEventListener('click', () => show(index + 1));
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => show(i + 1)));

  // touch swipe
  let startX = 0;
  heroImg?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  heroImg?.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 30) show(index + 1);
    else if (endX - startX > 30) show(index - 1);
  });
}

init();

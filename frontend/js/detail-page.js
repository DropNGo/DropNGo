import { getProducts } from './product-data.js';

async function init() {
  const products = await getProducts();
  const idMatch = location.pathname.match(/produkt-detail(\d+)\.html/);
  const currentId = idMatch ? idMatch[1] : null;
  const product = products.find(p => p.id === currentId);

  if (product) {
    const nameEl = document.querySelector('[data-product-name]');
    const priceEl = document.querySelector('.price');
    if (nameEl) nameEl.textContent = product.title;
    if (priceEl) priceEl.textContent = product.price;
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

export async function getProducts() {
  if (!window.__productData) {
    window.__productData = fetch('products.html')
      .then(r => r.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return Array.from(doc.querySelectorAll('.card.card--product')).map(card => {
          const link = card.querySelector('a')?.getAttribute('href') || '';
          const idMatch = link.match(/produkt-detail(\d+)\.html/);
          const id = idMatch ? idMatch[1] : '';
          const title = card.querySelector('h3')?.textContent.trim() || '';
          const price = card.querySelector('.price')?.textContent.trim() || '';
          const image = card.querySelector('.card__img img')?.getAttribute('src') || '';
          return { id, title, price, image, link };
        });
      });
  }
  return window.__productData;
}

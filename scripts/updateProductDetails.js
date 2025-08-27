const fs = require('fs');
const path = require('path');

// Parse products.html to get product data (name, price, image)
const productsHtml = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'products.html'), 'utf8');
const productRegex = /<a href="produkt-detail(\d+)\.html"[\s\S]*?<img src="([^"]+)" alt="([^"]+)"[\s\S]*?<span class="price">([^<]+)<\/span>/g;
let match;
const products = {};
while ((match = productRegex.exec(productsHtml)) !== null) {
  const id = parseInt(match[1], 10);
  let image = match[2].trim();
  let name = match[3].trim();
  let price = match[4].trim();
  // Ensure price has space before €
  price = price.replace(/\s*€/, ' €');
  products[id] = { id, name, price, image };
}

// Helper to sanitize affiliate links by removing price-related query params
function sanitizeLink(url) {
  try {
    const u = new URL(url);
    ['price', 'amount', 'preis'].forEach(param => u.searchParams.delete(param));
    return u.toString();
  } catch (e) {
    return url;
  }
}

// Read affiliate links (and optional price from text file if present)
const namesDir = path.join(__dirname, '..', 'frontend', 'ProduktNamen');
for (const dir of fs.readdirSync(namesDir)) {
  const m = dir.match(/^(\d+)\s/);
  if (!m) continue;
  const id = parseInt(m[1], 10);
  const p = products[id];
  if (!p) continue;
  const txtPath = path.join(namesDir, dir, 'Beschreibung und Link.txt');
  const lines = fs.readFileSync(txtPath, 'utf8').split(/\r?\n/);
  const link = sanitizeLink(lines[0].trim());
  p.link = link;
  if (lines[1] && lines[1].trim()) {
    const price = lines[1].trim().replace(/\s*€/, ' €');
    p.price = price; // override if provided
  }
}

const ids = Object.keys(products).map(Number).sort((a,b)=>a-b);

// Generate related products for each id using next three ids
function relatedFor(id) {
  const idx = ids.indexOf(id);
  const rel = [ids[(idx+1)%ids.length], ids[(idx+2)%ids.length], ids[(idx+3)%ids.length]];
  return rel.map(rid => products[rid]);
}

function generateRelatedHTML(id) {
  const rel = relatedFor(id);
  const items = rel.map(p => `          <article class="rel-card">
            <a href="produkt-detail${p.id}.html">
              <img src="${p.image}" alt="${p.name}" />
              <div class="body">
                <strong>${p.name}</strong>
                <span class="price">${p.price}</span>
              </div>
            </a>
          </article>`).join('\n\n');
  return `      <section class="related" aria-labelledby="related-head">
        <h2 id="related-head">Ähnliche Produkte</h2>
        <div class="rel-grid">
${items}
        </div>
      </section>`;
}

// Update each product detail page
for (const id of ids) {
  const p = products[id];
  const filePath = path.join(__dirname, '..', 'frontend', `produkt-detail${id}.html`);
  let html = fs.readFileSync(filePath, 'utf8');

  // Product name placeholders
  html = html.replace(/<strong id="scName">[^<]*<\/strong>/, `<strong id="scName">${p.name}</strong>`);
  html = html.replace(/(<a href="index.html">Home<\/a> &nbsp;\/&nbsp; <a href="products.html">Produkte<\/a> &nbsp;\/&nbsp; <span aria-current="page">)[^<]*(<\/span>)/, `$1${p.name}$2`);
  html = html.replace(/<h1 data-product-name>[^<]*<\/h1>/, `<h1 data-product-name>${p.name}</h1>`);
  html = html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${p.name} – Details, Preis, Merkmale und Affiliate‑Kaufoptionen." />`);
  html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${p.name} – Details, Preis, Merkmale und Affiliate‑Kaufoptionen." />`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${p.name} | DropNGo<\/title>`);
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${p.name} | DropNGo" \/>`);
  // Alt texts for hero image and thumbs
  html = html.replace(/alt="Produkt[^"]*?"/g, (m) => {
    // Preserve suffix like " – Ansicht 1" if exists
    const suffixMatch = m.match(/Produkt(?:name|\s*\d+)([^\"]*)"/);
    const suffix = suffixMatch ? suffixMatch[1] : '';
    return `alt="${p.name}${suffix}"`;
  });
  html = html.replace(/alt="Produktbild: [^"]*"/, `alt="Produktbild: ${p.name}"`);

  // Affiliate link in main CTA
  html = html.replace(/<a class="cta-primary" href="[^"]*"[^>]*>[^<]*<\/a>/, `<a class="cta-primary" href="${p.link}" target="_blank" rel="nofollow noopener">Bei Partner kaufen<\/a>`);

  // Affiliate link in sticky CTA
  html = html.replace(/<a class="btn btn--primary"[^>]*>Beim Partner kaufen<\/a>/, `<a class="btn btn--primary" href="${p.link}" target="_blank" rel="nofollow noopener">Beim Partner kaufen<\/a>`);

  // Prices
  html = html.replace(/(<div class="price">)[^<]*(<\/div>)/, `$1${p.price}$2`);
  html = html.replace(/(<div class="sc-title">\s*<strong id="scName">[^<]*<\/strong>\s*<span class="price">)[^<]*(<\/span>)/, `$1${p.price}$2`);

  // Replace related section
  html = html.replace(/\n\s*<section class="related"[\s\S]*?<\/section>/, `\n${generateRelatedHTML(id)}\n`);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated produkt-detail${id}.html`);
}

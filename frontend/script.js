// Produkt in den Warenkorb legen (mit Menge)
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!Array.isArray(cart)) cart = [];

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${name} wurde zum Warenkorb hinzugefügt!`);
}

// Warenkorb-Anzahl im Header aktualisieren
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!Array.isArray(cart)) cart = [];

  let count = 0;
  cart.forEach(item => {
    count += item.quantity || 1;
  });

  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = count;
    cartCountEl.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

// Warenkorb anzeigen und Interaktionen binden
function loadCart() {
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!Array.isArray(cart)) cart = [];

  const cartList = document.getElementById('cart-items');
  const totalElem = document.getElementById('total');

  if (!cartList || !totalElem) return;

  cartList.innerHTML = '';

  if (cart.length === 0) {
    cartList.innerHTML = '<li>Dein Warenkorb ist leer.</li>';
    totalElem.textContent = '';
    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.marginBottom = '10px';

    const infoSpan = document.createElement('span');
    infoSpan.textContent = `${item.name} – ${item.price.toFixed(2)} € x ${item.quantity}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Entfernen';
    removeBtn.style.marginLeft = '10px';
    removeBtn.style.backgroundColor = '#cc0000';
    removeBtn.style.color = 'white';
    removeBtn.style.border = 'none';
    removeBtn.style.borderRadius = '4px';
    removeBtn.style.padding = '5px 10px';
    removeBtn.style.cursor = 'pointer';

    removeBtn.addEventListener('click', () => {
      removeFromCart(index);
    });

    li.appendChild(infoSpan);
    li.appendChild(removeBtn);
    cartList.appendChild(li);

    totalPrice += item.price * item.quantity;
  });

  totalElem.textContent = `Gesamt: ${totalPrice.toFixed(2)} €`;
}

// Einzelnes Produkt aus dem Warenkorb entfernen
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!Array.isArray(cart)) cart = [];

  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartCount();
}

// Warenkorb komplett leeren
function clearCart() {
  localStorage.removeItem('cart');
  loadCart();
  updateCartCount();
}

// Initialisierung bei Seitenlade
window.addEventListener('load', () => {
  updateCartCount();
  if (document.getElementById('cart-items')) {
    loadCart();
  }
});



function animateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (!cartCountEl) return;

  cartCountEl.classList.remove('animate-pop'); // Reset Animation
  // Trigger neu (reflow)
  void cartCountEl.offsetWidth;
  cartCountEl.classList.add('animate-pop');
}



function clearCart() {
  const cartList = document.getElementById('cart-items');
  const cartCountEl = document.getElementById('cart-count');
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!Array.isArray(cart)) cart = [];

  if (cart.length === 0) return; // Schon leer

  const listItems = Array.from(cartList.children);

  // Führe Shrink-Animation nacheinander aus
  listItems.forEach((li, idx) => {
    setTimeout(() => {
      li.classList.add('shrink-animate');
      li.style.animationName = 'shrinkAndFade';

      li.addEventListener('animationend', () => {
        if (idx === listItems.length -1) {
          // Letztes Item fertig -> leeren und UI aktualisieren
          localStorage.removeItem('cart');
          loadCart();
          updateCartCount();
          animateCartCount();
        }
      }, { once: true });
    }, idx * 100); // Verzögerung pro Item
  });
}

function loadCart() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartList = document.getElementById('cart-items');
  const totalElem = document.getElementById('total');
  if (!cartList || !totalElem) return;

  cartList.innerHTML = '';

  if (cartItems.length === 0) {
    cartList.innerHTML = '<li>Dein Warenkorb ist leer.</li>';
    totalElem.textContent = '';
    return;
  }

  let totalPrice = 0;

  cartItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} – ${item.price} € x ${item.quantity}
      <button class="remove-one-btn" data-index="${index}" aria-label="1 Stück entfernen">-1</button>
    `;
    cartList.appendChild(li);
    totalPrice += item.price * item.quantity;
  });

  totalElem.textContent = `Gesamt: ${totalPrice.toFixed(2)} €`;

  // EventListener für Entfernen-Buttons
  document.querySelectorAll('.remove-one-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.target.dataset.index);
      removeOneFromCart(idx);
    });
  });
}

function removeOneFromCart(index) {
  const cartList = document.getElementById('cart-items');
  const cartIcon = document.getElementById('cart-icon');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (index < 0 || index >= cart.length) return;

  const listItem = cartList.children[index];
  if (!listItem) return;

  // Berechne Position zum Warenkorb-Icon für Animation
  const iconRect = cartIcon.getBoundingClientRect();
  const itemRect = listItem.getBoundingClientRect();
  const flyX = (iconRect.left + iconRect.width / 2) - (itemRect.left + itemRect.width / 2);
  const flyY = (iconRect.top + iconRect.height / 2) - (itemRect.top + itemRect.height / 2);

  if (cart[index].quantity > 1) {
    // Nur Menge reduzieren (ohne Animation)
    cart[index].quantity--;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
  } else {
    // Menge 1 -> Animation + Entfernen
    listItem.style.setProperty('--fly-x', `${flyX}px`);
    listItem.style.setProperty('--fly-y', `${flyY}px`);
    listItem.classList.add('fly-animate');
    listItem.style.animationName = 'flyToCart';

    listItem.addEventListener('animationend', () => {
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCart();
      updateCartCount();
      animateCartCount();
    }, { once: true });
  }
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let count = 0;
  cart.forEach(item => {
    count += item.quantity || 1;
  });
  const cartCountEl = document.getElementById('cart-count');
  if (!cartCountEl) return;
  cartCountEl.textContent = count;
  cartCountEl.style.display = count > 0 ? 'inline-block' : 'none';
}

function animateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (!cartCountEl) return;

  cartCountEl.classList.remove('animate-pop');
  void cartCountEl.offsetWidth; // Trigger Reflow
  cartCountEl.classList.add('animate-pop');
}

window.addEventListener('load', () => {
  updateCartCount();
  if (document.getElementById('cart-items')) {
    loadCart();
  }
});


function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let count = 0;
  cart.forEach(item => {
    count += item.quantity || 1;
  });

  const cartCountEl = document.getElementById('cart-count');
  if (!cartCountEl) return;

  cartCountEl.textContent = count;
  cartCountEl.style.display = count > 0 ? 'inline-block' : 'none';

  animateCartCount();
}

function animateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (!cartCountEl) return;

  cartCountEl.classList.remove('animate-pop');
  void cartCountEl.offsetWidth; // Reflow Trigger
  cartCountEl.classList.add('animate-pop');
}

function removeOneFromCart(index) {
  const cartList = document.getElementById('cart-items');
  const cartIcon = document.getElementById('cart-icon');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (index < 0 || index >= cart.length) return;

  const listItem = cartList.children[index];
  if (!listItem) return;

  // Berechne Flugrichtung zum Icon
  const iconRect = cartIcon.getBoundingClientRect();
  const itemRect = listItem.getBoundingClientRect();
  const flyX = (iconRect.left + iconRect.width / 2) - (itemRect.left + itemRect.width / 2);
  const flyY = (iconRect.top + iconRect.height / 2) - (itemRect.top + itemRect.height / 2);

  if (cart[index].quantity > 1) {
    cart[index].quantity--;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
  } else {
    listItem.style.setProperty('--fly-x', `${flyX}px`);
    listItem.style.setProperty('--fly-y', `${flyY}px`);
    listItem.classList.add('fly-animate');
    listItem.style.animationName = 'flyToCart';

    listItem.addEventListener('animationend', () => {
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCart();
      updateCartCount();
      animateCartCount();
    }, { once: true });
  }
}

function clearCart() {
  const cartList = document.getElementById('cart-items');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) return;

  const listItems = Array.from(cartList.children);

  listItems.forEach((li, idx) => {
    setTimeout(() => {
      li.classList.add('shrink-animate');
      li.style.animationName = 'shrinkAndFade';

      li.addEventListener('animationend', () => {
        if (idx === listItems.length - 1) {
          localStorage.removeItem('cart');
          loadCart();
          updateCartCount();
          animateCartCount();
        }
      }, { once: true });
    }, idx * 100);
  });
}








function loadCart() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartList = document.getElementById('cart-items');
  const totalElem = document.getElementById('total');
  if (!cartList || !totalElem) return;

  cartList.innerHTML = '';

  if (cart.length === 0) {
    cartList.innerHTML = '<li>Dein Warenkorb ist leer.</li>';
    totalElem.textContent = '';
    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');

    li.innerHTML = `
      <div class="item-info">${item.name} – ${item.price.toFixed(2)} €</div>
      <div class="quantity-controls">
        <button class="decrease-btn" data-index="${index}" aria-label="Menge verringern">-</button>
        <span>${item.quantity}</span>
        <button class="increase-btn" data-index="${index}" aria-label="Menge erhöhen">+</button>
        <button class="remove-btn" data-index="${index}" aria-label="Artikel entfernen" style="background:#cc0000; margin-left: 8px;">x</button>
      </div>
    `;

    cartList.appendChild(li);
    totalPrice += item.price * item.quantity;
  });

  totalElem.textContent = `Gesamt: ${totalPrice.toFixed(2)} €`;

  // Eventlistener für Buttons
  document.querySelectorAll('.decrease-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = Number(e.target.dataset.index);
      decreaseQuantity(idx);
    });
  });
  document.querySelectorAll('.increase-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = Number(e.target.dataset.index);
      increaseQuantity(idx);
    });
  });
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = Number(e.target.dataset.index);
      removeFromCart(idx);
    });
  });
}

function decreaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartCount();
}

function increaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart[index].quantity++;
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartCount();
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartCount();
}


document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('open-support-btn');
  const modal = document.getElementById('support-modal');
  const closeBtn = document.getElementById('close-support-btn');
  const form = document.getElementById('support-form');
  const response = document.getElementById('form-response');

  if (openBtn && modal && closeBtn) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      if (form) clearForm();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        if (form) clearForm();
      }
    });
  }

  if (form && response) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        response.style.color = 'red';
        response.textContent = 'Bitte alle Felder ausfüllen.';
        return;
      }

      response.style.color = '#0f0';
      response.textContent = 'Danke für deine Nachricht! Wir melden uns bald.';
      form.reset();
    });
  }

  function clearForm() {
    if (form && response) {
      form.reset();
      response.textContent = '';
    }
  }
});








// HTML für das Cookie-Banner als Template-String
const cookieBannerHTML = `
  <div id="cookie-banner" class="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie Hinweis">
    <p>
      Wir nutzen Cookies für das beste Erlebnis. Mit der Nutzung unserer Website stimmst du zu. 
      <a href="datenschutz.html" style="color:rgb(24, 161, 150); text-decoration: underline;">Mehr Infos</a>
    </p>
    <div class="cookie-buttons">
      <button id="accept-cookies-btn" aria-label="Cookies akzeptieren">Akzeptieren</button>
      <button id="decline-cookies-btn" aria-label="Cookies ablehnen">Ablehnen</button>
    </div>
  </div>
`;

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cookie-container');
  const consent = localStorage.getItem('cookieConsent');

  // Wenn noch keine Entscheidung getroffen wurde, Banner anzeigen
  if (consent !== 'accepted' && consent !== 'declined') {
    container.innerHTML = cookieBannerHTML;

    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies-btn');
    const declineBtn = document.getElementById('decline-cookies-btn');

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      banner.classList.add('hide');
      // Hier evtl. Cookies aktivieren
    });

    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      banner.classList.add('hide');
      // Hier evtl. Cookies deaktivieren / Tracking verhindern
    });
  }
});




document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".announcement-close");
  const announcement = document.querySelector(".announcement");

  if (closeBtn && announcement) {
    closeBtn.addEventListener("click", () => {
      announcement.style.display = "none";
    });
  }
});




const openBtn = document.querySelector("#openBtn");
if (openBtn) {
  openBtn.addEventListener("click", () => {
    // ...
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.querySelector("#openBtn");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      // ...
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.querySelector("#openBtn");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      console.log("Button wurde geklickt!");
    });
  }
});


























const cartIcon = document.getElementById("cart-icon");
if (cartIcon) {
  cartIcon.style.display = "none";
}




document.querySelectorAll('#warenkorb, .cart, .shopping-cart').forEach(el => {
  el.style.display = 'none';
});


document.addEventListener('DOMContentLoaded', () => {
  const cart = document.querySelector('.cart');
  if (cart) {
    cart.style.display = 'none';
  }
});
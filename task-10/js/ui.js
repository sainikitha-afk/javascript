// ── UI Rendering Module ───────────────────────────────
import {
  addItem, removeItem, updateQty,
  getCart, getCount, calcTotals, formatPrice,
  applyCoupon, removeCoupon, getActiveCoupon
} from './cart.js';

import products from '../data/products.js';

// ── State ─────────────────────────────────────────────
let activeCategory = 'all';
let searchQuery    = '';
let maxPrice       = 200000;
let sortMode       = 'default';

// ── DOM refs ──────────────────────────────────────────
const grid        = document.getElementById('product-grid');
const noResults   = document.getElementById('no-results');
const resultsCount= document.getElementById('results-count');
const cartDrawer  = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItems   = document.getElementById('cart-items');
const cartEmpty   = document.getElementById('cart-empty');
const cartFooter  = document.getElementById('cart-footer');
const cartCount   = document.getElementById('cart-count');
const toast       = document.getElementById('toast');

let toastTimer;

// ── Toast notification ────────────────────────────────
export function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2500);
}

// ── Render Products ───────────────────────────────────
export function renderProducts() {
  let filtered = products.filter(p => {
    const matchCat    = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery) ||
                        p.description.toLowerCase().includes(searchQuery);
    const matchPrice  = p.price <= maxPrice;
    return matchCat && matchSearch && matchPrice;
  });

  // Sort
  if (sortMode === 'price-asc')  filtered.sort((a,b) => a.price - b.price);
  if (sortMode === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  if (sortMode === 'name-asc')   filtered.sort((a,b) => a.name.localeCompare(b.name));

  grid.innerHTML = '';
  resultsCount.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`;

  if (filtered.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');

  const cart = getCart();

  filtered.forEach((p, i) => {
    const inCart = cart.some(c => c.id === p.id);
    const card   = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div class="product-img">${p.emoji}</div>
      <div class="product-body">
        <span class="product-category">${p.category}</span>
        <p class="product-name">${p.name}</p>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <span class="product-price">${formatPrice(p.price)}</span>
          <button
            class="btn-add ${inCart ? 'added' : ''}"
            data-id="${p.id}"
          >${inCart ? '✓ Added' : '+ Add'}</button>
        </div>
      </div>
    `;

    card.querySelector('.btn-add').addEventListener('click', () => {
      addItem(p);
      renderProducts();
      renderCart();
      showToast(`🛒 ${p.name} added to cart!`);
    });

    grid.appendChild(card);
  });
}

// ── Render Cart ───────────────────────────────────────
export function renderCart() {
  const items = getCart();
  cartCount.textContent = getCount();

  if (items.length === 0) {
    cartItems.innerHTML = '';
    cartEmpty.classList.remove('hidden');
    cartFooter.style.display = 'none';
    return;
  }

  cartEmpty.classList.add('hidden');
  cartFooter.style.display = 'block';

  cartItems.innerHTML = '';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="cart-item-emoji">${item.emoji}</div>
      <div>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${formatPrice(item.price)} each</p>
        <div class="qty-controls">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="remove-btn" data-id="${item.id}" aria-label="Remove">🗑</button>
    `;

    el.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = btn.dataset.action === 'inc' ? 1 : -1;
        updateQty(Number(btn.dataset.id), delta);
        renderCart();
        renderProducts();
      });
    });

    el.querySelector('.remove-btn').addEventListener('click', () => {
      removeItem(Number(el.querySelector('.remove-btn').dataset.id));
      renderCart();
      renderProducts();
      showToast('🗑 Item removed from cart');
    });

    cartItems.appendChild(el);
  });

  renderTotals();
}

// ── Render Totals ─────────────────────────────────────
function renderTotals() {
  const { subtotal, discount, tax, total } = calcTotals();
  const coupon = getActiveCoupon();

  document.getElementById('subtotal').textContent      = formatPrice(subtotal);
  document.getElementById('tax-amount').textContent    = formatPrice(tax);
  document.getElementById('total-amount').textContent  = formatPrice(total);

  const discountRow = document.getElementById('discount-row');
  if (discount > 0) {
    document.getElementById('discount-amount').textContent = `− ${formatPrice(discount)}`;
    discountRow.style.display = 'flex';
  } else {
    discountRow.style.display = 'none';
  }
}

// ── Cart Drawer open/close ────────────────────────────
export function openCart() {
  cartDrawer.classList.remove('hidden');
  cartOverlay.classList.remove('hidden');
  renderCart();
}

export function closeCart() {
  cartDrawer.classList.add('hidden');
  cartOverlay.classList.add('hidden');
}

// ── Filter listeners ──────────────────────────────────
export function initFilters() {
  // Category
  document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener('change', e => {
      activeCategory = e.target.value;
      renderProducts();
    });
  });

  // Search
  document.getElementById('search-input').addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderProducts();
  });

  // Price range
  const rangeInput   = document.getElementById('price-range');
  const priceDisplay = document.getElementById('price-display');
  rangeInput.addEventListener('input', e => {
    maxPrice = Number(e.target.value);
    priceDisplay.textContent = Number(maxPrice).toLocaleString('en-IN');
    renderProducts();
  });

  // Sort
  document.getElementById('sort-select').addEventListener('change', e => {
    sortMode = e.target.value;
    renderProducts();
  });

  // Reset
  document.getElementById('reset-filters').addEventListener('click', () => {
    activeCategory = 'all';
    searchQuery    = '';
    maxPrice       = 200000;
    sortMode       = 'default';
    document.querySelector('input[name="category"][value="all"]').checked = true;
    document.getElementById('search-input').value   = '';
    document.getElementById('price-range').value    = 200000;
    document.getElementById('price-display').textContent = '2,00,000';
    document.getElementById('sort-select').value    = 'default';
    renderProducts();
  });
}
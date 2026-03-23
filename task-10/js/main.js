// ── Entry Point ───────────────────────────────────────
import { renderProducts, renderCart, openCart, closeCart, initFilters } from './ui.js';
import { applyCoupon, removeCoupon } from './cart.js';

// Initial render
renderProducts();
renderCart();
initFilters();

// Cart open / close
document.getElementById('cart-toggle').addEventListener('click', openCart);
document.getElementById('cart-close').addEventListener('click',  closeCart);
document.getElementById('cart-overlay').addEventListener('click', closeCart);

// Coupon
document.getElementById('coupon-apply').addEventListener('click', () => {
  const code   = document.getElementById('coupon-input').value.trim();
  const msgEl  = document.getElementById('coupon-msg');
  if (!code) return;

  const result = applyCoupon(code);
  msgEl.textContent  = result.msg;
  msgEl.className    = `coupon-msg ${result.success ? 'success' : 'error'}`;

  if (result.success) {
    renderCart();
    document.getElementById('coupon-input').value = '';
  }

  setTimeout(() => { msgEl.textContent = ''; }, 3000);
});

// Checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
  alert('✅ Order placed successfully! Thank you for shopping at TechStore.');
  removeCoupon();
  localStorage.removeItem('techstore_cart');
  location.reload();
});

// Keyboard — close cart on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCart();
});
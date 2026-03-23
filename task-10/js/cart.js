// ── Cart State Module ─────────────────────────────────
// Manages all cart state and localStorage persistence

const CART_KEY    = 'techstore_cart';
const COUPON_KEY  = 'techstore_coupon';
const TAX_RATE    = 0.18;

const VALID_COUPONS = {
  'SAVE10':  { type: 'percent', value: 10,    label: '10% off' },
  'TECH20':  { type: 'percent', value: 20,    label: '20% off' },
  'FLAT500': { type: 'flat',    value: 500,   label: '₹500 off' },
  'SAVE50':  { type: 'percent', value: 50,    label: '50% off' },
};

// Load from localStorage or start fresh
let cart   = JSON.parse(localStorage.getItem(CART_KEY))   || [];
let coupon = JSON.parse(localStorage.getItem(COUPON_KEY)) || null;

function save() {
  localStorage.setItem(CART_KEY,   JSON.stringify(cart));
  localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
}

// ── Cart Operations ───────────────────────────────────
export function addItem(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  save();
}

export function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  save();
}

export function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeItem(id);
  else save();
}

export function getCart()  { return [...cart]; }
export function getCount() { return cart.reduce((sum, i) => sum + i.qty, 0); }

// ── Coupon ────────────────────────────────────────────
export function applyCoupon(code) {
  const found = VALID_COUPONS[code.toUpperCase()];
  if (!found) return { success: false, msg: '❌ Invalid coupon code.' };
  coupon = { code: code.toUpperCase(), ...found };
  save();
  return { success: true, msg: `✅ Coupon applied — ${found.label}!` };
}

export function removeCoupon() {
  coupon = null;
  save();
}

export function getActiveCoupon() { return coupon; }

// ── Price Calculations ────────────────────────────────
export function calcTotals() {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percent') {
      discount = subtotal * (coupon.value / 100);
    } else {
      discount = Math.min(coupon.value, subtotal);
    }
  }

  const taxable = subtotal - discount;
  const tax     = taxable * TAX_RATE;
  const total   = taxable + tax;

  return { subtotal, discount, tax, total };
}

export function formatPrice(n) {
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}
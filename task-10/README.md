# Full-Featured eCommerce Shopping Cart

A comprehensive eCommerce simulation built with vanilla HTML, CSS, and
modular JavaScript (ES6 modules). Features a full product catalog,
shopping cart, dynamic pricing, coupons, and persistent state.

## Demo

![TechStore Demo](demo.mp4)

## Features

- 🛍️ 8 tech products dynamically rendered from a data source
- 🔍 Live search by name or description
- 🗂️ Filter by category, max price slider, and sort options
- 🛒 Add to cart, adjust quantities, remove items
- 💰 Dynamic subtotal, 18% GST tax, and grand total calculation
- 🎟️ Coupon code system (SAVE10, TECH20, FLAT500, SAVE50)
- 💾 Cart and coupon persisted via localStorage
- 📱 Fully responsive — works on mobile, tablet, desktop
- ⌨️ Keyboard accessible (Escape closes cart)

## Tech Stack

- HTML5 (Semantic markup)
- CSS3 (Grid, Flexbox, Custom Properties, Animations)
- Vanilla JavaScript — ES6 Modules
  - `main.js` — entry point, event listeners
  - `cart.js` — state management, localStorage, price calculations
  - `ui.js` — DOM rendering, filters, product/cart display
  - `data/products.js` — product data source

## How to Run

1. Clone or download the repo
2. Open the `task-12-ecommerce/` folder in VS Code
3. Right-click `index.html` → **Open with Live Server**

> ⚠️ Must use Live Server — opening index.html directly
> will break ES6 module imports (CORS restriction)

## Coupon Codes

| Code | Discount |
|------|----------|
| `SAVE10` | 10% off |
| `TECH20` | 20% off |
| `FLAT500` | ₹500 flat off |
| `SAVE50` | 50% off |

## Folder Structure
```
task-10/
├── index.html
├── styles.css
├── data/
│   └── products.js
└── js/
    ├── main.js
    ├── cart.js
    └── ui.js
```

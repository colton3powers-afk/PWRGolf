# PWR Golf Co. — website v1 (static)

Open `index.html` in a browser. No build step, no server needed. Every page is plain HTML + one stylesheet + one JS file.

## What's here

| Area | Files |
|---|---|
| Home | `index.html` |
| Shop / used / finds / arrivals / brands | `shop.html`, `used-clubs.html`, `club.html?sku=…`, `pwr-finds.html`, `new-arrivals.html`, `brands.html` |
| Cart / checkout / account / rewards | `cart.html`, `checkout.html`, `account.html`, `rewards.html` |
| Services | `trade-in.html`, `fitting.html`, `repair.html`, `custom-builds.html`, `simulator.html`, `book.html` |
| About / team / reviews / store / contact | `about.html`, `team.html`, `reviews.html`, `store.html`, `contact.html` |
| Content | `guides.html`, `guides/*.html` |
| Trust pages | `faq.html`, `shipping-policy.html`, `returns.html`, `condition-guide.html`, `privacy.html`, `terms.html`, `warranty.html`, `accessibility.html` |
| Staff | `admin/inventory.html` — mark a SKU "sold in store" and it vanishes from the site |
| Design system | `assets/css/pwr.css` (colors, plywood signs, cards, forms, tables) |
| Engine | `assets/js/site.js` (cart, filters, PDP, estimator, booking, configurator, account, admin) |
| Icons | `assets/js/icons.js` (jaguar mark, club silhouettes, UI glyphs) |
| Inventory | `data/inventory.js` — 110 SKUs. Edit this file to change what's on the site. |

## How the demo state works
Cart, orders, bookings, trade-in quotes, custom builds, saved clubs, signups and "sold in store" flags all live in the browser's localStorage. Clear site data to reset. Promo codes that work: `PWRFINDS` (10%), `JAGUAR` (5%), `FIRSTBAG` (15%).

## SKU format
`PWR-[BRAND]-[MODEL]-[CLUB]-[SERIAL]` e.g. `PWR-TM-P770-4PW-00120`. Serial never repeats.

## Before launch — swap these placeholders
- Address, phone, email, hours (`assets/js/site.js` has none; they're in each page's HTML — search for `1140 Industry Loop` and `555-0147`)
- Real photos: store, workbench, sim, team, and per-club photos (cards show a silhouette until then)
- Google Maps embed on `index.html` and `store.html`
- Google Reviews + Instagram embeds
- Real prices for services and inventory
- Payment provider (Apple Pay / Google Pay / Shop Pay buttons are placeholders)
- Legal review of privacy / terms
- Fonts load from Google Fonts; self-host Barlow + Barlow Condensed if you want zero external requests.

## Going live for real
This static build is the design + UX spec. For real commerce, the sensible path is Shopify (or similar) with this design ported into a theme; `data/inventory.js` maps 1:1 onto product/variant fields, and the admin "sold in store" toggle becomes the POS ↔ online inventory sync.

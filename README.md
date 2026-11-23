# yourstripes — beekeeping gear storefront

A small-catalog (10 SKUs) e-commerce site for beekeeping equipment. The look is **a bright meadow seen through an old video game**: smooth, soft typography on top of pixel-art landscapes, flying pixel bees, notched "16-bit window" panels and arcade-style buttons, with a cinematic AI-generated bee-flight video in the hero.

Built with **Vite + React 19 + TypeScript + Tailwind CSS v4**, with **motion** for UI animation and **GSAP** for the full-screen menu.

---

## Quick start

```bash
npm install
npm run fetch-media   # optional: self-host the hero video (see "Media" below)
npm run dev           # http://localhost:5173
npm run build         # production build → dist/
npm run preview       # serve dist/ locally
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check + production build (clean URLs, `BrowserRouter`) |
| `npm run build:static` | Portable build: relative paths + hash routing; drops into any static host or sub-folder |
| `npm run fetch-media` | Downloads the hero video from the Higgsfield CDN into `public/media/` |
| `npm run lint` | oxlint |

### Deploying

`npm run build` produces a static SPA in `dist/`. Clean URLs need a "serve `index.html` for unknown paths" rule, which is already included for:

- **Netlify:** `public/_redirects`
- **Vercel:** `vercel.json`
- **Anywhere else** (GitHub Pages, S3, a sub-folder): use `npm run build:static`, which uses `#/` routes and needs no rewrites.

---

## What's on the site

| Area | Details |
| --- | --- |
| **Hero** | Full-bleed looping video of a honeybee seen from behind, flying low through a wildflower meadow. It sits inside an RPG-style dialogue box, with a "flight cam" HUD, a pause button and an **8-bit mode** toggle that re-renders the video live with a 16-color meadow palette and Bayer dithering. Scrolling past the hero progressively pixelates it into the pixel world below. |
| **Shop** | 10 products in 5 categories, filter chips and sort. The home page shows the full catalog as a 4×4 bento grid. |
| **Product pages** | Size picker (jacket and gloves), quantity, RPG-style **item stats** bars, specs, what's in the box, warranty, related items, schema.org `Product` JSON-LD, and an "8-bit view" toggle on the photo. |
| **Cart** | Slide-over drawer with a free-shipping XP bar, plus the **Starter Quest**: add all five starter essentials and 10% comes off automatically. |
| **Checkout** | Contact, address, delivery method, order summary and order confirmation. It is a front-end demo that collects **no** payment details; see "Before you launch". |
| **Accounts** | Sign up / log in dialog and dedicated `/login` and `/signup` pages; `/account` shows order history with status. |
| **Help center** | FAQ, Shipping, Returns & exchanges, Warranty, Track an order, Contact, Privacy, Terms, Cookies, Accessibility. |
| **Footer** | Newsletter sign-up, Shop / Help / Company / Legal columns, contact details, socials, payment marks, back-to-top, all sitting on a pixel-grass strip. |
| **Extras** | Cookie banner, toasts, pixel "dissolve" route transitions, custom 404, favicon. |

### 21st.dev components

Two components were pulled from the 21st.dev catalog through the 21st.dev connector, then adapted. The free tier allows two retrievals per day.

| Component | Author | Used for | Changes |
| --- | --- | --- | --- |
| **Immersive Full Screen Navigation** | hyperiux | The **Menu** button: GSAP clip-path wipe, staggered link/image/social reveals, character-split link hover, focus trap and Escape-to-close | Controlled `open` prop, react-router links, meadow palette, pixel grass and flying bees in the panel, numbered links |
| **Auth Dialog** | ruixen.ui | **Sign up / Log in**: one dialog that toggles modes, password show/hide, Google button, terms note | Sliding pill mode switch, animated fields and headings, pixel-heart password strength, validation with a shake, loading and success states; reused on `/login`, `/signup` and `/account` |

The **click animation** (`src/components/pixel/ClickSparks.tsx`) is modeled on 21st.dev's *ClickTriggerParticles*: a particle burst from the click point with automatic cleanup. It is rebuilt as one full-screen canvas so every click on the page gets square, grid-snapped "pixel" sparks. A bigger honey burst fires on add-to-cart, sign-up, newsletter and order completion.

The 21st.dev registry primitives (`button`, `dialog`, `input`, `label`) live in `src/components/ui/` and are restyled as pixel controls.

### Higgsfield assets

Everything photographic was generated with the Higgsfield connector:

- **Hero video:** Kling 3.0 (image-to-video), driven from a GPT Image 2.6 keyframe. It was cut into an 8.8 s seamless loop with a 1.2 s crossfade at the seam, then encoded at 1080p (7.3 MB) and 720p (4.1 MB).
- **10 product shots:** GPT Image 2.6, on a matching buttercream backdrop so they blend into the product cards.
- **Scenes:** a beekeeper lifting a frame, a honeycomb macro, and a second meadow flight.

All images are committed in `public/media/` as optimized JPEGs.

### Media (hero video)

The hero `<video>` tries `/media/hero-1080.mp4` and `/media/hero-720.mp4` first, then falls back to the same files on Higgsfield's CDN. Run `npm run fetch-media` once to download them, and the site becomes fully self-hosted with no code change. Until then, the poster frame shows instantly and the CDN copy streams in behind it.

---

## Project structure

```
src/
  components/
    pixel/      sprites, procedural meadow/landscape canvases, flying bees,
                click sparks, route dissolve, live 8-bit pixel shader
    ui/         21st.dev components (nav, auth) + registry primitives, toast, accordion
    layout/     header, footer, cart drawer, cookie banner, page/info layouts
    home/       hero + home sections
    product/    product card
  data/         products, FAQ, policies, site settings
  store/        cart, auth (demo), orders (demo)
  pages/        routes
public/media/   generated photography (+ hero video after fetch-media)
```

**Editing products:** everything lives in `src/data/products.ts`: name, price, copy, specs, stats, sizes, and which items count toward the Starter Quest. Photos go in `public/media/products/`.

---

## Before you launch

The storefront is complete on the front end. These parts are deliberately stubbed and marked `PLACEHOLDER` in code:

1. **Payments and orders:** connect a commerce backend (Shopify Storefront API, Stripe Checkout, or similar). Checkout currently creates a demo order in `localStorage` and takes no payment.
2. **Accounts:** `src/store/auth.tsx` is a local demo (no passwords are stored). Swap in Shopify customer accounts, Supabase, Clerk or similar. The Google button needs your OAuth client.
3. **Forms:** the newsletter (`Footer.tsx`) and contact form (`Contact.tsx`) need your email/helpdesk provider.
4. **Contact details and socials:** `src/data/site.ts`.
5. **Legal pages:** `src/data/policies.tsx` holds sensible templates for a small US store. Have them reviewed for your business.
6. **Brand story copy** (home "Why yourstripes" and `/about`) is written as a starting point. Make it yours.
7. **Domain and SEO:** add your domain to `index.html` (canonical and `og:url`) and an absolute `og:image` URL.

## Accessibility and performance

- Body text meets WCAG AA (most pairs AAA); see `DESIGN-RATIONALE.md` for ratios.
- Keyboard-navigable with a visible focus ring and a skip link. The menu traps focus and closes on Escape.
- The hero video can be paused. All motion (video, flying sprites, wipes, sparks, dissolves) respects `prefers-reduced-motion`.
- Routes are code-split, and the hero poster is preloaded as the LCP image.

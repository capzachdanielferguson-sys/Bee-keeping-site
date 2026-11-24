# yourstripes — design rationale

**Category:** e-commerce, with a small catalog (10 SKUs) and high consideration (a $349 hive).
**Audience:** new and second-season backyard beekeepers, aged 25–55, who are nervous about getting it wrong and research before they buy.
**Brief:** bright and nature-based, with a digital feel like an old video game set in a meadow full of bees. Smooth letters, while the backgrounds and other pieces are digital. Sleek and professional. The hero shows a bee flying through a field of flowers, seen from behind.

## Core idea

> **A real meadow, framed by a game world.**

The hero is real, cinematic footage, left untouched with no filters or pixel effects so it reads as premium. The game world frames it: the RPG dialogue box holding the headline, and the pixel-grass strip at its bottom edge that leads into the pixel-art world the rest of the site lives in. Everything structural (panels, buttons, landscapes, sprites, labels) is pixel art. Everything you *read* (headlines, body copy, prices) stays smooth and high-contrast. That split is the brief made literal: smooth letters, digital pieces.

## References (from the curated set)

| Site | What we borrowed |
| --- | --- |
| **Allbirds** | A cream base and products shot on one consistent seamless backdrop. Every product photo here sits on buttercream `#F8E6C4`, which is also the card color, so photos and cards merge. |
| **Mejuri** | No pure black anywhere. The ink is a deep olive (`#17200F`), so the palette stays warm against honey and cream. |
| **Patagonia** | Earthy greens used as structure (footer, menu, HiveSense band), and brand values given real estate next to product. |

Retro-game references guide the motifs rather than the layout: RPG dialogue boxes (the hero copy panel), item-stat bars (product pages), a quest log (the bundle), a HUD-style dashboard (HiveSense), selection-cursor brackets on hover, and screen-dissolve transitions.

## Palette

Base: **Buttercream** (palettes-100 p039), extended with a bright pixel-game accent set.

| Token | Hex | Use | Contrast |
| --- | --- | --- | --- |
| cream | `#FBF3D8` | Page background | — |
| paper | `#FFFBEE` | Panels | — |
| ink | `#17200F` | Primary text | **15.1:1** on cream |
| ink-soft | `#3B4230` | Secondary text | **9.4:1** on cream |
| muted | `#5F5A3C` | Tertiary text | **6.3:1** on cream |
| honey | `#F5B700` | Primary buttons, fills (never small text on cream) | ink on honey **9.3:1** |
| honey-deep | `#8B5A0B` | Honey as text (eyebrows) | **5.3:1** on cream |
| meadow-deep | `#173D1F` | Footer, menu | cream on it **11.0:1** |
| leaf / meadow / sky / poppy / petal / lilac | `#7BC043` `#2E7D32` `#6EC6F5` `#E8483C` `#FF8FA3` `#9B7BE0` | Pixel art, accents | Decorative |

## Type

| Role | Face | Why |
| --- | --- | --- |
| Display | **Fraunces** 500–700, `SOFT 100`, `WONK 0`, optical sizing | The SOFT axis rounds every terminal. These are literally "smooth letters", warm and organic, and they read as premium at 72px. |
| Body / UI | **Manrope** 400–800 | A geometric-warm sans that stays crisp at 14–16px. Prices and numbers use tabular figures. |
| HUD accents | **Silkscreen** (pixel) | Used **only** for short uppercase labels (eyebrows, badges, HUD, SKUs) and never for sentences, so it stays a "digital piece" rather than reading text. |

Fallbacks: `ui-serif, Georgia` / `system-ui` / `ui-monospace`. Pair basis: fp025 (Fraunces + Manrope).

## Hero

A full-bleed video of a bee flying away from camera, low over poppies, cornflowers and daisies. It is the single focal point. The copy sits in an RPG dialogue box at bottom-left, clear of the bee at center-right, with a "Level 1 · New keeper" speaker tab and a blinking ▼ continue marker. Proof sits in the fold: free shipping over $99, a 2-year hive warranty and 30-day returns. A pixel-grass strip grows over the bottom edge of the footage, which is where nature meets the game. On phones, the footage gets its own window above the box, so the bee is always visible.

The headline is **"Beekeeping gear that earns its stripes."** It is specific to the category and carries the brand name. The primary CTA names the product and price: "Shop the Starter Hive · $349".

## Motion budget

| Motion | Where | What it communicates |
| --- | --- | --- |
| Looping bee-flight footage (unfiltered) | Hero | The product's world in one shot; pausable |
| Clip-path wipe and staggered reveal (21st.dev) | Full-screen menu | Spatial: the menu is a separate "screen" |
| Sliding pill and field reveal (21st.dev) | Sign up / log in | Which mode you're in, and which fields appear |
| Pixel click sparks; honey burst | Every click; add to cart, sign up, orders | Feedback: the click registered and the action succeeded |
| Arcade press (shadow collapses) | Buttons | Physical affordance |
| Selection cursor brackets | Product cards | Which item is focused |
| HiveSense bars grow in view | Dashboard | Data: weight climbs as a nectar flow starts |
| Pixel dissolve | Route change | Continuity between "screens" |
| Flying sprites | Pixel landscapes | Ambient life, kept off reading areas |

Everything respects `prefers-reduced-motion`. The hero also has a pause button.

## Decisions

**1. Hero layout: full-bleed video with a dialogue-box overlay.**
*For:* the brief explicitly asks for a bee POV flight, and video is the only medium that delivers it. The dialogue box turns a generic overlay into a game reference.
*Against:* text over video can be illegible and video is heavy. *Rebuttal:* the box is an opaque panel (16:1 contrast), the poster is the LCP image, and the video streams after first paint.

**2. Primary color: honey `#F5B700`, not indigo or violet.**
*For:* it is the product's own color, carries meaning (honey, bees, warning-stripe "stripes"), and is unmistakable on cream.
*Against:* yellow on light backgrounds fails contrast. *Rebuttal:* honey is only ever a fill under ink text (9.3:1). Honey used as text switches to honey-deep (5.3:1).

**3. Type: Fraunces SOFT + Manrope + Silkscreen accents.**
*For:* it is the "smooth letters, digital pieces" brief, split by role.
*Against:* three families risk noise. *Rebuttal:* Silkscreen is confined to 9–12px uppercase labels and never competes with the headline voice.

**4. Texture: pixel art plus notched frames, no glass and no gradients-as-brand.**
*For:* this is the digital layer the brief asks for, procedurally drawn so it stays crisp at any size.
*Against:* pixel art can feel toy-like. *Rebuttal:* it is confined to frames, scenery and accents. Product photography, type and spacing stay editorial.

**5. Motion energy: measured, with a few signature moments.**
*For:* most motion is feedback; the spectacle is concentrated in the hero, menu and route changes.
*Against:* game sites tend toward constant motion. *Rebuttal:* a store has to sell first. Ambient sprites stay off text, and everything can be paused or reduced.

**6. Density: balanced and product-first.**
*For:* with 10 SKUs, the entire catalog fits on the home page, so the second section *is* the shop.
*Against:* that skips storytelling. *Rebuttal:* story, the bundle and the FAQ follow, ordered by purchase intent.

**7. Light by default.**
*For:* the brief says "bright", and a sunny meadow is light.
*Against:* the dark sections could suggest a theme. *Rebuttal:* the dark bands (HiveSense, footer, menu) are deliberate tonal contrast within one light theme, and every pairing is AA.

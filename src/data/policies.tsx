import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { SITE } from './site'

/**
 * Policy page copy. These are sensible starting templates for a small US
 * online store — have them reviewed for your business and state before
 * launch (see README).
 */

export type PolicyId = 'shipping' | 'returns' | 'warranty' | 'privacy' | 'terms' | 'cookies' | 'accessibility'

export interface Policy {
  title: string
  eyebrow: string
  summary: string
  updated: string
  body: ReactNode
}

const UPDATED = 'November 23, 2026'

const Mail = () => (
  <a href={`mailto:${SITE.email}`} className="font-semibold text-ink underline decoration-2 underline-offset-4 hover:decoration-honey">
    {SITE.email}
  </a>
)

export const POLICIES: Record<PolicyId, Policy> = {
  shipping: {
    title: 'Shipping',
    eyebrow: 'Help · Delivery',
    summary: 'Free over $99, out the door in 1–2 business days.',
    updated: UPDATED,
    body: (
      <>
        <h2>Rates</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Method</th>
              <th scope="col">Delivery time</th>
              <th scope="col">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Standard</td>
              <td>3–6 business days</td>
              <td>Free over $99 · otherwise $9</td>
            </tr>
            <tr>
              <td>Express</td>
              <td>1–3 business days</td>
              <td>$19</td>
            </tr>
          </tbody>
        </table>
        <p>The free-shipping threshold is calculated after discounts, including the Starter Quest bonus.</p>
        <h2>Processing time</h2>
        <p>
          In-stock orders placed before 1pm CT on a business day ship the same day. Everything else ships within 1–2
          business days. Large items (the Meadow Starter Hive and the Spinner extractor) ship by ground freight and may
          arrive in more than one box.
        </p>
        <h2>Where we ship</h2>
        <p>
          We currently ship to the 48 contiguous United States, including APO/FPO addresses for small items. We don’t yet
          ship to Alaska, Hawaii, US territories or internationally.
        </p>
        <h2>Tracking</h2>
        <p>
          You’ll get a tracking link by email as soon as your order leaves us. You can also check any order on our{' '}
          <Link to="/track-order">order tracking page</Link>.
        </p>
        <h2>Damaged or lost parcels</h2>
        <p>
          If something arrives damaged, take a photo of the box and the item and email <Mail /> within 7 days. We’ll send a
          replacement — no need to wait for a carrier claim.
        </p>
      </>
    ),
  },
  returns: {
    title: 'Returns & exchanges',
    eyebrow: 'Help · Returns',
    summary: '30 days to return unused gear. Size exchanges are free.',
    updated: UPDATED,
    body: (
      <>
        <h2>30-day returns</h2>
        <p>
          If something isn’t right, return it within 30 days of delivery for a full refund to your original payment
          method. Items must be unused and in their original packaging.
        </p>
        <h2>Free size exchanges</h2>
        <p>
          Jacket or gloves don’t fit? We’ll exchange them for another size at no cost, including return shipping. Email{' '}
          <Mail /> with your order number and the size you need.
        </p>
        <h2>A note on hive equipment</h2>
        <p>
          Hives and frames can be returned unassembled and unused only. Once wood has been in an apiary or frames have
          been in contact with bees, we can’t resell them — this protects other keepers’ colonies from disease.
        </p>
        <h2>How to start a return</h2>
        <ol>
          <li>Email <Mail /> with your order number and what you’d like to return.</li>
          <li>We’ll reply within one business day with a prepaid label (refund minus $9 return shipping for non-defective items).</li>
          <li>Refunds are issued within 3 business days of the return arriving.</li>
        </ol>
        <h2>Defects</h2>
        <p>
          Anything faulty is covered by our <Link to="/warranty">warranty</Link>, and return shipping is always on us.
        </p>
      </>
    ),
  },
  warranty: {
    title: 'Warranty',
    eyebrow: 'Help · Warranty',
    summary: '2 years on hives, the extractor and HiveSense. 1 year on everything else.',
    updated: UPDATED,
    body: (
      <>
        <h2>What’s covered</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Coverage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Meadow Starter Hive, Spinner 4-Frame Extractor, HiveSense Monitor</td>
              <td>2 years</td>
            </tr>
            <tr>
              <td>All other products</td>
              <td>1 year</td>
            </tr>
          </tbody>
        </table>
        <p>
          The warranty covers defects in materials and workmanship from the date of delivery: split joints, failed welds,
          broken cranks, seams that let go, electronics that stop working.
        </p>
        <h2>What’s not covered</h2>
        <ul>
          <li>Normal wear, weathering of cedar, propolis and wax build-up, and smoker scorch marks.</li>
          <li>Damage from misuse, modification, fire, animals or extreme weather.</li>
          <li>Batteries (HiveSense batteries are a consumable).</li>
        </ul>
        <h2>Making a claim</h2>
        <p>
          Email <Mail /> with your order number and a photo of the problem. We’ll repair, replace or refund — usually
          within a week, and we cover shipping both ways.
        </p>
      </>
    ),
  },
  privacy: {
    title: 'Privacy policy',
    eyebrow: 'Legal',
    summary: 'What we collect, why, and the choices you have.',
    updated: UPDATED,
    body: (
      <>
        <p>
          This policy explains how yourstripes (“we”, “us”) collects and uses personal information when you visit our
          website or buy from us.
        </p>
        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Information you give us:</strong> your name, email, shipping address and phone number when you create an
            account, place an order, contact us or subscribe to emails.
          </li>
          <li>
            <strong>Payment information:</strong> handled directly by our payment processor. We never see or store full card
            numbers.
          </li>
          <li>
            <strong>Usage information:</strong> pages viewed, device and browser type, and approximate location from your IP
            address, collected through cookies and similar technologies (see our <Link to="/cookies">cookie policy</Link>).
          </li>
        </ul>
        <h2>How we use it</h2>
        <ul>
          <li>To process and ship orders, provide customer support and handle returns and warranty claims.</li>
          <li>To send order updates and, if you opt in, our monthly email. You can unsubscribe at any time.</li>
          <li>To keep the site secure, prevent fraud and understand how the store is used so we can improve it.</li>
        </ul>
        <h2>Sharing</h2>
        <p>
          We share information only with service providers who help us run the store — payment processing, shipping
          carriers, email delivery, hosting and analytics — and only as needed for them to do that work. We do not sell
          your personal information.
        </p>
        <h2>Your choices and rights</h2>
        <p>
          You can access, correct or delete your personal information, and opt out of marketing emails, by emailing{' '}
          <Mail />. Depending on where you live (for example California, Colorado, Virginia or Connecticut), you may have
          additional rights; we honor those requests for all customers.
        </p>
        <h2>Retention</h2>
        <p>We keep order records as long as required for tax and accounting, and account information until you ask us to delete it.</p>
        <h2>Children</h2>
        <p>Our store is not directed to children under 13, and we do not knowingly collect their information.</p>
        <h2>Contact</h2>
        <p>
          Questions about privacy? Email <Mail />.
        </p>
      </>
    ),
  },
  terms: {
    title: 'Terms of service',
    eyebrow: 'Legal',
    summary: 'The rules for using our site and buying from us.',
    updated: UPDATED,
    body: (
      <>
        <p>By using this website or placing an order, you agree to these terms.</p>
        <h2>Orders and pricing</h2>
        <p>
          All prices are in US dollars. We may correct pricing errors and may cancel orders affected by an error, with a
          full refund. An order is accepted when it ships.
        </p>
        <h2>Products and safety</h2>
        <p>
          Beekeeping involves live, stinging insects. Protective equipment reduces but does not eliminate the risk of
          stings. If you are allergic to bee stings, consult a doctor before keeping bees. Follow local laws and
          ordinances for keeping bees.
        </p>
        <h2>Returns and warranty</h2>
        <p>
          Our <Link to="/returns">returns policy</Link> and <Link to="/warranty">warranty</Link> are part of these terms.
        </p>
        <h2>Accounts</h2>
        <p>You’re responsible for keeping your account credentials secure and for activity under your account.</p>
        <h2>Intellectual property</h2>
        <p>Site content, including text, images and graphics, belongs to yourstripes or its licensors and may not be reused without permission.</p>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, our liability for any claim related to a product is limited to the
          amount you paid for that product.
        </p>
        <h2>Changes</h2>
        <p>We may update these terms; the date above shows the latest version.</p>
        <h2>Contact</h2>
        <p>
          <Mail />
        </p>
      </>
    ),
  },
  cookies: {
    title: 'Cookie policy',
    eyebrow: 'Legal',
    summary: 'The small files that keep your cart working — and how to control them.',
    updated: UPDATED,
    body: (
      <>
        <h2>What we use</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Purpose</th>
              <th scope="col">Can I turn it off?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Essential</td>
              <td>Your cart, account login, checkout and security.</td>
              <td>No — the store won’t work without them.</td>
            </tr>
            <tr>
              <td>Analytics</td>
              <td>Counting visits and seeing which pages help keepers most.</td>
              <td>Yes — choose “Essential only”.</td>
            </tr>
            <tr>
              <td>Marketing</td>
              <td>Measuring whether our ads are useful.</td>
              <td>Yes — choose “Essential only”.</td>
            </tr>
          </tbody>
        </table>
        <h2>Your choices</h2>
        <p>
          You can choose “Accept all” or “Essential only” in the banner when you first visit. To change your choice later,
          clear this site’s cookies and storage in your browser settings and the banner will appear again.
        </p>
      </>
    ),
  },
  accessibility: {
    title: 'Accessibility',
    eyebrow: 'Our commitment',
    summary: 'A store everyone can use — retro looks included.',
    updated: UPDATED,
    body: (
      <>
        <p>
          We want every keeper to be able to browse and buy from yourstripes. We aim to meet the Web Content
          Accessibility Guidelines (WCAG) 2.2 at level AA.
        </p>
        <h2>What we do</h2>
        <ul>
          <li>Body text meets AA contrast; the pixel display font is used only for short labels, never for long reading.</li>
          <li>Every page works with a keyboard, with a visible focus outline and a skip-to-content link.</li>
          <li>The hero video can be paused, and all motion — flying sprites, wipes and sparks — respects your system’s reduced-motion setting.</li>
          <li>Images have text alternatives; decorative pixel art is hidden from screen readers.</li>
        </ul>
        <h2>Feedback</h2>
        <p>
          If anything on the site is hard to use, email <Mail /> or call {SITE.phone}. We’ll help you complete your order and
          fix the problem.
        </p>
      </>
    ),
  },
}

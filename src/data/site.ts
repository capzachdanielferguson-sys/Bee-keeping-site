/**
 * Store-wide settings. Placeholder contact details are marked — replace
 * them before launch (see README → "Before you launch").
 */
export const SITE = {
  name: 'yourstripes',
  tagline: 'Gear that earns its stripes.',
  /* PLACEHOLDER: replace with your real support inbox + phone. */
  email: 'hello@yourstripes.com',
  phone: '(555) 010-2026',
  hours: 'Mon–Sat, 8am–6pm CT',
  shipsFrom: 'Ships across the contiguous US',
  /* PLACEHOLDER: replace with your social profiles. */
  socials: {
    instagram: 'https://instagram.com/',
    tiktok: 'https://tiktok.com/',
    youtube: 'https://youtube.com/',
    pinterest: 'https://pinterest.com/',
  },
}

export const MAIN_NAV = [
  { label: 'Shop all', to: '/shop' },
  { label: 'Hives', to: '/shop?c=hives' },
  { label: 'Protective', to: '/shop?c=protective' },
  { label: 'Tools', to: '/shop?c=tools' },
  { label: 'Harvest', to: '/shop?c=harvest' },
]

export const MENU_LINKS = [
  { label: 'Shop all gear', to: '/shop' },
  { label: 'Starter hive', to: '/product/meadow-starter-hive', note: 'Start here' },
  { label: 'Protective wear', to: '/shop?c=protective' },
  { label: 'HiveSense', to: '/product/hivesense-monitor', note: 'New' },
  { label: 'Our story', to: '/about' },
  { label: 'Help & FAQ', to: '/faq' },
  { label: 'My account', to: '/account' },
]

export const FOOTER_COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All gear', to: '/shop' },
      { label: 'Hives & frames', to: '/shop?c=hives' },
      { label: 'Protective wear', to: '/shop?c=protective' },
      { label: 'Hive tools', to: '/shop?c=tools' },
      { label: 'Harvest', to: '/shop?c=harvest' },
      { label: 'HiveSense monitor', to: '/product/hivesense-monitor' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Shipping', to: '/shipping' },
      { label: 'Returns & exchanges', to: '/returns' },
      { label: 'Warranty', to: '/warranty' },
      { label: 'Track an order', to: '/track-order' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our story', to: '/about' },
      { label: 'Beekeeping basics', to: '/faq#getting-started' },
      { label: 'My account', to: '/account' },
      { label: 'Sign up', to: '/signup' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', to: '/privacy' },
      { label: 'Terms of service', to: '/terms' },
      { label: 'Cookie policy', to: '/cookies' },
      { label: 'Accessibility', to: '/accessibility' },
    ],
  },
]

export const HELP_PAGES = [
  { label: 'FAQ', to: '/faq' },
  { label: 'Shipping', to: '/shipping' },
  { label: 'Returns & exchanges', to: '/returns' },
  { label: 'Warranty', to: '/warranty' },
  { label: 'Track an order', to: '/track-order' },
  { label: 'Contact us', to: '/contact' },
  { label: 'Privacy policy', to: '/privacy' },
  { label: 'Terms of service', to: '/terms' },
  { label: 'Cookie policy', to: '/cookies' },
  { label: 'Accessibility', to: '/accessibility' },
]

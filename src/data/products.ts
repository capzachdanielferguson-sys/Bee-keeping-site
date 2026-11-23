export type CategoryId = 'hives' | 'protective' | 'tools' | 'harvest' | 'tech'

export interface Category {
  id: CategoryId
  label: string
  blurb: string
}

export const CATEGORIES: Category[] = [
  { id: 'hives', label: 'Hives & frames', blurb: 'Cedar Langstroth boxes and waxed frames.' },
  { id: 'protective', label: 'Protective wear', blurb: 'Vented jackets and gauntlet gloves.' },
  { id: 'tools', label: 'Hive tools', blurb: 'Smokers, hive tools and queen gear.' },
  { id: 'harvest', label: 'Harvest', blurb: 'Extracting and straining honey.' },
  { id: 'tech', label: 'Hive tech', blurb: 'Sensors that watch the hive for you.' },
]

export interface ProductStat {
  label: string
  /** 0–10 */
  value: number
}

export interface Product {
  id: string
  slug: string
  sku: string
  name: string
  category: CategoryId
  price: number
  tagline: string
  description: string
  image: string
  imageAlt: string
  badge?: string
  /** Shown as pixel "item stats" bars. */
  stats: ProductStat[]
  features: string[]
  specs: [string, string][]
  inTheBox: string[]
  sizes?: string[]
  /** Warranty in years. */
  warranty: number
  /** Part of the Starter Quest bundle (10% off when all five are in the cart). */
  starter?: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: 'p01',
    slug: 'meadow-starter-hive',
    sku: 'YS-HIV-010',
    name: 'Meadow Starter Hive',
    category: 'hives',
    price: 349,
    tagline: 'A 10-frame cedar Langstroth, ready for your first colony.',
    description:
      'Western red cedar boxes with finger-jointed corners, dipped in food-grade beeswax so they shrug off rain without paint. You get a deep brood box for the colony, a medium super for your first honey, and twenty waxed frames to fill them. The galvanized lid sheds weather for decades.',
    image: 'media/products/hive-kit.jpg',
    imageAlt: 'Cedar Langstroth beehive with a galvanized lid and two waxed frames leaning against it',
    badge: 'Starter pick',
    stats: [
      { label: 'Weatherproofing', value: 9 },
      { label: 'Room to grow', value: 8 },
      { label: 'Ease of setup', value: 8 },
    ],
    features: [
      'Western red cedar — naturally rot-resistant, no paint required',
      'Beeswax-dipped finish, safe for bees and honey',
      'Pre-assembled boxes: about 20 minutes from box to apiary',
      'Standard 10-frame Langstroth dimensions — every add-on fits',
    ],
    specs: [
      ['Format', '10-frame Langstroth'],
      ['Material', 'Western red cedar, beeswax-dipped'],
      ['Footprint', '16¼ × 19⅞ in'],
      ['Weight (empty)', '38 lb'],
      ['Assembly', 'Boxes pre-assembled; ~20 min'],
    ],
    inTheBox: [
      '1 deep brood box',
      '1 medium honey super',
      '20 wooden frames with waxed foundation',
      'Inner cover + galvanized telescoping lid',
      'Bottom board with entrance reducer',
    ],
    warranty: 2,
    starter: true,
  },
  {
    id: 'p02',
    slug: 'airflow-vented-jacket',
    sku: 'YS-PRO-201',
    name: 'Airflow Vented Jacket',
    category: 'protective',
    price: 159,
    tagline: 'Three-layer mesh that stings can’t reach and breezes can.',
    description:
      'Three layers of open mesh hold the fabric a stinger’s length away from your skin while air moves straight through — so July inspections stop feeling like a sauna. The round fencing veil zips on and off, keeps the mesh off your face, and folds flat for washing.',
    image: 'media/products/jacket.jpg',
    imageAlt: 'White three-layer mesh beekeeping jacket with a round veil and honey-yellow zip',
    badge: 'Cool in July',
    stats: [
      { label: 'Sting protection', value: 9 },
      { label: 'Airflow', value: 10 },
      { label: 'Lightness', value: 8 },
    ],
    features: [
      'Three-layer mesh body — ventilated, sting-resistant',
      'Removable round fencing veil with wide visibility',
      'Elastic cuffs and hem with thumb loops',
      'Machine washable once the veil is off',
    ],
    specs: [
      ['Shell', '3-layer polyester air mesh'],
      ['Veil', 'Round fencing veil, removable'],
      ['Closure', 'YKK two-way zip'],
      ['Care', 'Machine wash cold, hang dry'],
    ],
    inTheBox: ['1 vented jacket', '1 detachable round veil', 'Wash bag'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    warranty: 1,
    starter: true,
  },
  {
    id: 'p03',
    slug: 'ember-stainless-smoker',
    sku: 'YS-TOL-301',
    name: 'Ember Stainless Smoker',
    category: 'tools',
    price: 49,
    tagline: 'Cool, steady smoke — with a heat shield that saves your hands.',
    description:
      'A wide stainless canister holds enough pine needles or burlap for a full inspection, while the riveted leather bellows pump an even, cool plume. The perforated cage keeps fingers and gloves off the hot wall, and the hinged spout clips shut to smother it when you’re done.',
    image: 'media/products/smoker.jpg',
    imageAlt: 'Stainless steel bee smoker with a perforated heat shield and leather bellows',
    stats: [
      { label: 'Burn time', value: 8 },
      { label: 'Heat shielding', value: 9 },
      { label: 'Capacity', value: 7 },
    ],
    features: [
      '4 × 7 in stainless canister with internal grate',
      'Perforated heat-shield cage',
      'Leather and oak bellows, riveted',
      'Hinged spout with latch for safe snuffing',
    ],
    specs: [
      ['Canister', '4 × 7 in, 304 stainless'],
      ['Bellows', 'Leather + oak'],
      ['Weight', '1.4 lb'],
    ],
    inTheBox: ['1 smoker', 'Starter pack of cotton fuel'],
    warranty: 1,
    starter: true,
  },
  {
    id: 'p04',
    slug: 'hive-tool-duo',
    sku: 'YS-TOL-302',
    name: 'Hive Tool Duo',
    category: 'tools',
    price: 26,
    tagline: 'J-hook and flat blade in hardened stainless, with high-vis grips.',
    description:
      'Bees glue everything shut with propolis. The flat blade pries boxes apart and scrapes burr comb; the J-hook lifts frames out one-handed. Both handles are powder-coated honey yellow, so you’ll actually find them when you set one down in the grass.',
    image: 'media/products/hive-tools.jpg',
    imageAlt: 'Two stainless hive tools with honey-yellow handles: a J-hook and a flat blade',
    stats: [
      { label: 'Leverage', value: 9 },
      { label: 'Durability', value: 10 },
      { label: 'Findability', value: 10 },
    ],
    features: [
      'Hardened 420 stainless — no bending, no rust',
      'Bevelled blade edge for scraping propolis',
      'Powder-coated grips in high-vis honey yellow',
      'Lanyard hole on each handle',
    ],
    specs: [
      ['Length', '10 in (J-hook) · 9½ in (flat)'],
      ['Material', '420 stainless steel'],
    ],
    inTheBox: ['1 J-hook hive tool', '1 flat hive tool'],
    warranty: 1,
    starter: true,
  },
  {
    id: 'p05',
    slug: 'goatskin-gauntlet-gloves',
    sku: 'YS-PRO-202',
    name: 'Goatskin Gauntlet Gloves',
    category: 'protective',
    price: 34,
    tagline: 'Supple leather fingers, vented sleeves, elastic elbow cuffs.',
    description:
      'Goatskin is thin enough to feel a frame lug and tough enough to turn a sting. The long canvas gauntlets are vented so your forearms breathe, and the elastic cuffs seal over your jacket sleeves — no gap for curious bees to find.',
    image: 'media/products/gloves.jpg',
    imageAlt: 'Cream goatskin beekeeping gloves with long white ventilated canvas sleeves',
    stats: [
      { label: 'Dexterity', value: 8 },
      { label: 'Sting protection', value: 8 },
      { label: 'Airflow', value: 7 },
    ],
    features: [
      'Soft goatskin palms and fingers',
      'Ventilated canvas gauntlets to the elbow',
      'Elastic cuffs seal over jacket sleeves',
    ],
    specs: [
      ['Palm', 'Goatskin leather'],
      ['Gauntlet', 'Vented cotton canvas'],
      ['Length', '17 in'],
    ],
    inTheBox: ['1 pair of gloves'],
    sizes: ['S', 'M', 'L', 'XL'],
    warranty: 1,
    starter: true,
  },
  {
    id: 'p06',
    slug: 'spinner-4-frame-extractor',
    sku: 'YS-HRV-401',
    name: 'Spinner 4‑Frame Extractor',
    category: 'harvest',
    price: 279,
    tagline: 'A food-grade stainless drum with a geared crank and honey gate.',
    description:
      'Slot in four uncapped frames, turn the crank, and centrifugal force flings honey out of the comb — the comb goes back to the hive intact so your bees can refill it faster. Geared at 1:3 so a gentle turn spins it fast, with a clear lid to watch it work.',
    image: 'media/products/extractor.jpg',
    imageAlt: 'Stainless steel 4-frame honey extractor on three legs with a hand crank and clear lid',
    stats: [
      { label: 'Capacity', value: 6 },
      { label: 'Spin speed', value: 7 },
      { label: 'Build quality', value: 9 },
    ],
    features: [
      'Food-grade 304 stainless drum and basket',
      '1:3 geared crank with locking handle',
      'Clear split lid — watch the spin',
      'Self-closing honey gate at the base',
    ],
    specs: [
      ['Frames', '4 deep, medium or shallow'],
      ['Drum', '304 stainless, 15¾ in diameter'],
      ['Height', '36 in on legs'],
      ['Weight', '24 lb'],
    ],
    inTheBox: ['Extractor drum + basket', '3 legs', 'Crank assembly', 'Honey gate', 'Clear lid'],
    warranty: 2,
  },
  {
    id: 'p07',
    slug: 'waxed-frames-10-pack',
    sku: 'YS-HIV-011',
    name: 'Waxed Frames · 10 Pack',
    category: 'hives',
    price: 52,
    tagline: 'Pine frames with beeswax-coated foundation bees draw out fast.',
    description:
      'Every frame ships assembled with a rigid foundation sheet that’s been rolled in an extra layer of pure beeswax. Bees accept it faster than bare plastic, which means comb built sooner and honey stored sooner.',
    image: 'media/products/frames.jpg',
    imageAlt: 'Ten pine beehive frames fitted with golden beeswax-coated foundation',
    stats: [
      { label: 'Bee acceptance', value: 9 },
      { label: 'Rigidity', value: 8 },
      { label: 'Value', value: 9 },
    ],
    features: [
      'Assembled pine frames, glued and nailed',
      'Rigid foundation with an extra beeswax coat',
      'Fits any 10-frame or 8-frame Langstroth deep',
    ],
    specs: [
      ['Size', 'Deep, 9⅛ in'],
      ['Count', '10 frames'],
    ],
    inTheBox: ['10 waxed deep frames'],
    warranty: 1,
  },
  {
    id: 'p08',
    slug: 'queen-marking-kit',
    sku: 'YS-TOL-303',
    name: 'Queen Marking Kit',
    category: 'tools',
    price: 24,
    tagline: 'Catcher clip, marking tube and five year-color pens.',
    description:
      'A dot of paint on the queen makes her easy to spot in a crowd of 50,000 — and the color tells you the year she was born. Clip her gently, ease her into the tube, mark, release. The pens follow the international color code (2026 queens get white).',
    image: 'media/products/queen-kit.jpg',
    imageAlt: 'Queen marking tube, queen catcher clip and five colored marking pens',
    stats: [
      { label: 'Gentleness', value: 9 },
      { label: 'Visibility', value: 10 },
      { label: 'Ease of use', value: 7 },
    ],
    features: [
      'Spring queen-catcher clip',
      'Marking tube with soft foam plunger',
      'Five water-based, bee-safe pens: white, yellow, red, green, blue',
    ],
    specs: [
      ['Pens', 'Water-based, quick-dry'],
      ['Color code', 'Years ending 1/6 white · 2/7 yellow · 3/8 red · 4/9 green · 5/0 blue'],
    ],
    inTheBox: ['1 queen catcher', '1 marking tube + plunger', '5 marking pens'],
    warranty: 1,
  },
  {
    id: 'p09',
    slug: 'double-sieve-bucket',
    sku: 'YS-HRV-402',
    name: 'Double Sieve Bucket',
    category: 'harvest',
    price: 44,
    tagline: 'A two-stage stainless strainer over a 3-gallon gated bucket.',
    description:
      'The coarse top screen catches wax cappings, the fine bottom screen catches everything else, and clear honey settles into the food-grade bucket below. Open the gate and jar straight from the bottom — no ladle, no drips.',
    image: 'media/products/sieve-bucket.jpg',
    imageAlt: 'White honey bucket with a gate valve and a double stainless steel strainer on top',
    stats: [
      { label: 'Filtering', value: 9 },
      { label: 'Capacity', value: 7 },
      { label: 'Mess control', value: 9 },
    ],
    features: [
      'Double stainless mesh: 400 µm over 200 µm',
      'Extendable arms fit buckets 9–14 in wide',
      '3-gallon food-grade bucket with gate valve',
    ],
    specs: [
      ['Bucket', '3 gal, food-grade HDPE'],
      ['Strainer', 'Stainless, double layer'],
    ],
    inTheBox: ['Double sieve', 'Bucket with lid', 'Honey gate'],
    warranty: 1,
  },
  {
    id: 'p10',
    slug: 'hivesense-monitor',
    sku: 'YS-TEC-501',
    name: 'HiveSense Monitor',
    category: 'tech',
    price: 139,
    tagline: 'Weight, temperature and humidity from inside your hive, on your phone.',
    description:
      'Slide the scale plate under your hive and drop the sensor pod between frames. HiveSense logs weight every 15 minutes — so you see a nectar flow start, a swarm leave, or winter stores run low without lifting a lid. One battery lasts a full season.',
    image: 'media/products/hivesense.jpg',
    imageAlt: 'White sensor pod with a honey-yellow ring beside a charcoal hive scale plate and cable',
    badge: 'New',
    stats: [
      { label: 'Battery life', value: 9 },
      { label: 'Data detail', value: 10 },
      { label: 'Setup speed', value: 8 },
    ],
    features: [
      'Hive scale accurate to ±0.1 lb, up to 440 lb',
      'In-hive temperature + humidity sensor pod',
      'Bluetooth sync to the free iOS / Android app',
      'Alerts for sudden weight drops (possible swarm)',
    ],
    specs: [
      ['Scale', '0–440 lb, ±0.1 lb'],
      ['Sensors', 'Temperature, humidity, weight'],
      ['Battery', '12 months (2× AA, included)'],
      ['Connectivity', 'Bluetooth LE 5.3'],
    ],
    inTheBox: ['Scale plate', 'Sensor pod', '1 m cable', '2× AA batteries'],
    warranty: 2,
  },
]

export const STARTER_IDS = PRODUCTS.filter((p) => p.starter).map((p) => p.id)
export const STARTER_DISCOUNT = 0.1
export const FREE_SHIPPING_THRESHOLD = 99
export const FLAT_SHIPPING = 9

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id)
}

export function categoryLabel(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}

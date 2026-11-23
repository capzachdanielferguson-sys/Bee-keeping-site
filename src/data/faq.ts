export interface FaqItem {
  q: string
  a: string
}

export interface FaqGroup {
  id: string
  title: string
  items: FaqItem[]
}

export const FAQ: FaqGroup[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    items: [
      {
        q: 'I’ve never kept bees. What do I actually need?',
        a: 'Five things: a hive, a jacket with a veil, gloves, a smoker and a hive tool. That’s exactly our Starter Quest — add all five and the cart takes 10% off. Bees themselves come separately from a local supplier as a “package” or “nuc”, usually ordered in winter for spring pickup.',
      },
      {
        q: 'When should I set up my first hive?',
        a: 'Order and assemble your gear in late winter, then install bees in spring when daytime temperatures stay above about 55°F and the first flowers are blooming. That gives the colony a full season to build comb and store honey for winter.',
      },
      {
        q: 'Will I get honey in my first year?',
        a: 'Sometimes, but plan on your bees keeping most of it. A first-year colony spends the season drawing comb and building stores. A strong colony in a good flow can fill a honey super by late summer — the HiveSense scale will tell you when it’s happening.',
      },
      {
        q: 'How much time does beekeeping take?',
        a: 'About 30–45 minutes every 7–10 days during spring and summer, much less in fall and almost nothing in winter. Harvest day takes an afternoon.',
      },
      {
        q: 'Do I need permission to keep bees?',
        a: 'Many towns allow backyard hives with simple rules (distance from property lines, a water source). Check your city or county ordinance and HOA before you start, and register your apiary if your state asks you to.',
      },
    ],
  },
  {
    id: 'orders',
    title: 'Orders & shipping',
    items: [
      {
        q: 'How fast do orders ship?',
        a: 'In-stock orders placed by 1pm CT on a business day ship the same day; everything else ships within 1–2 business days. Standard delivery takes 3–6 business days in the contiguous US.',
      },
      {
        q: 'How much is shipping?',
        a: 'Free on orders over $99 after discounts. Under $99 it’s a flat $9 for standard shipping. Express (1–3 business days) is $19.',
      },
      {
        q: 'Do you ship outside the contiguous US?',
        a: 'Not yet. We currently ship to the 48 contiguous states. Alaska, Hawaii and international shipping are on our list.',
      },
      {
        q: 'Can I change or cancel my order?',
        a: 'Yes, until it ships. Email us with your order number and we’ll update it. Once it’s on the way, you can return it within 30 days.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & warranty',
    items: [
      {
        q: 'What’s your return policy?',
        a: 'Return unused gear within 30 days of delivery for a full refund. Clothing can be exchanged for a different size for free. Hives and frames must be unassembled and unused, since bees are fussy about strangers’ wax.',
      },
      {
        q: 'What does the warranty cover?',
        a: 'Hives, the extractor and HiveSense carry a 2-year warranty against defects in materials and workmanship; everything else carries 1 year. Normal wear, propolis and smoker scorch marks are part of the job and not covered.',
      },
    ],
  },
  {
    id: 'products',
    title: 'Gear & sizing',
    items: [
      {
        q: 'How should the Airflow jacket fit?',
        a: 'Roomy. You want air between the mesh and your skin, and room for a shirt underneath. If you’re between sizes, size up. Exchanges are free.',
      },
      {
        q: 'Do your hives fit other Langstroth equipment?',
        a: 'Yes. The Meadow Starter Hive uses standard 10-frame Langstroth dimensions, so frames, supers, feeders and excluders from any standard supplier fit.',
      },
      {
        q: 'Is the cedar hive treated with anything?',
        a: 'Only beeswax. Western red cedar is naturally rot-resistant, and the wax dip adds weather protection without paint or chemicals near your bees.',
      },
    ],
  },
  {
    id: 'hivesense',
    title: 'HiveSense',
    items: [
      {
        q: 'Do I need Wi-Fi at my hives for HiveSense?',
        a: 'No. HiveSense stores readings on the device and syncs over Bluetooth whenever your phone is within about 30 feet — usually during a regular hive visit.',
      },
      {
        q: 'Does the sensor bother the bees?',
        a: 'The pod is sealed, silent and about the size of a matchbox. Bees will propolize it to the frame, which is normal and doesn’t affect readings.',
      },
    ],
  },
]

export const STARTER_FAQ = FAQ[0].items.slice(0, 4)

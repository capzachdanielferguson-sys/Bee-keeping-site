import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHero } from '@/components/layout/PageHero'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { FLOWER_CORN, FLOWER_POPPY, HONEY_DROP, TULIP_LILAC } from '@/components/pixel/sprites'
import { useDocumentTitle } from '@/lib/hooks'
import { asset } from '@/lib/utils'

const PRINCIPLES = [
  {
    sprite: FLOWER_POPPY,
    title: 'A short list on purpose',
    body: 'Ten pieces cover a first season end to end. Every extra gadget is one more thing a beginner has to learn, so we only add gear that earns its place.',
  },
  {
    sprite: HONEY_DROP,
    title: 'Materials bees agree with',
    body: 'Cedar and beeswax instead of paint, food-grade steel for anything that touches honey, and nothing in the hive that off-gasses.',
  },
  {
    sprite: FLOWER_CORN,
    title: 'Repair over replace',
    body: 'Standard Langstroth sizes, spare parts on request and real warranties. The greenest hive is the one you never have to buy twice.',
  },
  {
    sprite: TULIP_LILAC,
    title: 'Keepers answer the phone',
    body: 'When your first inspection goes sideways, you’ll talk to someone who has been stung on the same frame.',
  },
]

export default function About() {
  useDocumentTitle('Our story')
  return (
    <>
      <PageHero
        seed={8}
        crumbs={[{ label: 'Our story' }]}
        eyebrow="Our story"
        title="Gear that earns its stripes."
        description="yourstripes makes beekeeping equipment for people who are just getting started — and want gear they’ll still be using in ten seasons."
      />

      <section className="mx-auto grid max-w-[1400px] gap-12 px-4 pt-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10 lg:pt-24">
        <div className="px-notch-2 overflow-hidden bg-card">
          <img src={asset('media/meadow-flight.jpg')} alt="A honeybee flying low through a meadow of sunflowers, poppies and lavender" className="aspect-[16/11] w-full object-cover" loading="lazy" />
        </div>
        <div className="max-w-xl">
          <p className="font-pixel text-xs text-honey-deep">Why we started</p>
          <h2 className="mt-3 text-[clamp(2rem,1.3rem+2vw,3rem)] font-semibold">Beginner kits shouldn’t be the worst gear you ever own.</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              Most people meet beekeeping through a cheap starter bundle: a veil that collapses onto your nose, pine boxes
              that warp by August, a hive tool that bends on the first stuck frame. Plenty of them quit before the bees do.
            </p>
            <p>
              We think the first season deserves the best gear, not the flimsiest. So we kept the catalog small, picked
              materials that last, and wrote down everything we wish someone had told us before our first hive day.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles" className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-6 lg:px-10">
        <p className="font-pixel text-xs text-honey-deep">What we believe</p>
        <h2 id="principles" className="mt-3 max-w-2xl text-[clamp(2rem,1.3rem+2vw,3rem)] font-semibold">
          Four rules we don’t break.
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="flex gap-5 border-2 border-ink bg-paper p-6">
              <span className="px-notch grid size-14 shrink-0 place-items-center bg-wax" aria-hidden="true">
                <PixelSprite sprite={p.sprite} scale={4} />
              </span>
              <div>
                <p className="font-pixel text-[0.6rem] text-muted">Rule {String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 font-sans text-xl font-bold tracking-normal">{p.title}</h3>
                <p className="mt-2 text-ink-soft">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden">
          <img src={asset('media/honeycomb.jpg')} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-ink/60" aria-hidden="true" />
          <div className="relative flex flex-col items-start gap-6 p-8 sm:p-14">
            <p className="font-pixel text-xs text-honey">Start your first season</p>
            <h2 className="max-w-xl text-[clamp(2rem,1.3rem+2vw,3rem)] font-semibold text-cream">Five pieces. One colony. A lot of honey, eventually.</h2>
            <Button asChild size="lg">
              <Link to="/product/meadow-starter-hive">
                Start with the Starter Hive <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

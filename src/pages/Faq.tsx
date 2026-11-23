import { Link } from 'react-router'
import { InfoLayout } from '@/components/layout/InfoLayout'
import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { FAQ } from '@/data/faq'
import { useDocumentTitle } from '@/lib/hooks'

export default function Faq() {
  useDocumentTitle('FAQ')
  return (
    <InfoLayout
      eyebrow="Help · Questions"
      title="Frequently asked questions"
      description="From your first hive day to harvest — plus shipping, returns and sizing."
      crumb="FAQ"
      seed={31}
      aside={
        <ul className="mt-8 hidden space-y-1 lg:block" aria-label="Jump to section">
          {FAQ.map((g) => (
            <li key={g.id}>
              <a href={`#${g.id}`} className="font-pixel text-[0.6rem] text-muted hover:text-ink">
                › {g.title}
              </a>
            </li>
          ))}
        </ul>
      }
    >
      <div className="space-y-14">
        {FAQ.map((group) => (
          <section key={group.id} id={group.id} aria-labelledby={`${group.id}-t`} className="scroll-mt-28">
            <h2 id={`${group.id}-t`} className="mb-5 text-3xl font-semibold">
              {group.title}
            </h2>
            <Accordion items={group.items} />
          </section>
        ))}
      </div>
      <div className="mt-14 flex flex-col items-start gap-4 border-2 border-ink bg-honey/20 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-ink">Still stuck?</p>
          <p className="text-ink-soft">A real beekeeper answers every message, usually within a business day.</p>
        </div>
        <Button asChild>
          <Link to="/contact">Contact us</Link>
        </Button>
      </div>
    </InfoLayout>
  )
}

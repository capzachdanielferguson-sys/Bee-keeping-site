import { NavLink } from 'react-router'
import { PageHero } from './PageHero'
import { HELP_PAGES } from '@/data/site'
import { cn } from '@/lib/utils'

/** Help-center layout: pixel hero, sticky help nav, readable prose column. */
export function InfoLayout({
  eyebrow,
  title,
  description,
  crumb,
  children,
  seed,
  aside,
}: {
  eyebrow: string
  title: string
  description?: string
  crumb: string
  children: React.ReactNode
  seed?: number
  aside?: React.ReactNode
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} crumbs={[{ label: crumb }]} seed={seed} />
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 pt-12 sm:px-6 lg:grid-cols-[240px_1fr] lg:gap-20 lg:px-10 lg:pt-16">
        <nav aria-label="Help pages" className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-pixel text-[0.65rem] text-muted">Help center</p>
          <ul className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-0.5 lg:px-0">
            {HELP_PAGES.map((p) => (
              <li key={p.to} className="shrink-0">
                <NavLink
                  to={p.to}
                  className={({ isActive }) =>
                    cn(
                      'block border-2 px-3 py-2 text-sm font-semibold transition-colors lg:border-0 lg:border-l-4',
                      isActive
                        ? 'border-ink bg-honey/25 text-ink lg:border-honey'
                        : 'border-ink/15 text-ink-soft hover:text-ink lg:border-transparent',
                    )
                  }
                >
                  {p.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {aside}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </>
  )
}

/** Typographic styles for long-form policy copy. */
export const PROSE =
  'max-w-[72ch] text-[1.03rem] leading-relaxed text-ink-soft [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-4 hover:[&_a]:decoration-honey [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-sans [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-normal [&_h2]:text-ink first:[&_h2]:mt-0 [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:text-ink [&_table]:mt-4 [&_table]:w-full [&_table]:border-2 [&_table]:border-ink [&_table]:text-left [&_table]:text-sm [&_td]:border-t-2 [&_td]:border-dashed [&_td]:border-ink/15 [&_td]:p-3 [&_td]:align-top [&_th]:bg-wax/60 [&_th]:p-3 [&_th]:font-bold [&_th]:text-ink [&_ul]:list-[square] [&_ul]:pl-6 [&_ul]:marker:text-honey-deep'

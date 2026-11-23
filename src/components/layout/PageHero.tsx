import { Link } from 'react-router'
import { PixelScene } from '@/components/pixel/PixelScenery'
import { cn } from '@/lib/utils'

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs = [],
  seed = 4,
  children,
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  crumbs?: { label: string; to?: string }[]
  seed?: number
  children?: React.ReactNode
  className?: string
}) {
  return (
    <PixelScene className={cn('min-h-[400px] sm:min-h-[440px]', className)} seed={seed} bees={3} meadowGround={null}>
      <div className="mx-auto max-w-[1400px] px-3 pb-28 pt-[104px] sm:px-6 sm:pt-[128px] lg:px-10">
        <div className="max-w-3xl px-shadow">
          <div className="px-frame px-notch-2">
            <div className="px-fill px-notch-2 bg-paper/[0.97] p-6 sm:p-8">
              {crumbs.length > 0 && (
                <nav aria-label="Breadcrumb" className="mb-3">
                  <ol className="font-pixel flex flex-wrap items-center gap-2 text-[0.6rem] text-muted">
                    <li>
                      <Link to="/" className="hover:text-ink">
                        Home
                      </Link>
                    </li>
                    {crumbs.map((c) => (
                      <li key={c.label} className="flex items-center gap-2">
                        <span aria-hidden="true">›</span>
                        {c.to ? (
                          <Link to={c.to} className="hover:text-ink">
                            {c.label}
                          </Link>
                        ) : (
                          <span aria-current="page" className="text-ink">
                            {c.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              {eyebrow && <p className="font-pixel text-xs text-honey-deep">{eyebrow}</p>}
              <h1 className="mt-2 text-[clamp(2.25rem,1.4rem+2.8vw,3.75rem)] font-semibold">{title}</h1>
              {description && <p className="mt-3 max-w-[60ch] text-lg text-ink-soft">{description}</p>}
              {children}
            </div>
          </div>
        </div>
      </div>
    </PixelScene>
  )
}

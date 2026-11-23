import { Link, useNavigate } from 'react-router'
import { LogOut, Package } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AuthForm } from '@/components/ui/auth-dialog'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { BEE_TOP } from '@/components/pixel/sprites'
import { useAuth } from '@/store/auth'
import { loadOrders, orderStage } from '@/store/orders'
import { useDocumentTitle } from '@/lib/hooks'
import { asset, formatPrice } from '@/lib/utils'
import { useState } from 'react'
import type { AuthMode } from '@/store/auth'

const STAGES = ['Placed', 'Packed', 'Shipped', 'Delivered']

export default function Account() {
  const { user, logOut } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('login')
  useDocumentTitle(user ? 'My account' : 'Log in')

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col px-4 pb-10 pt-32">
        <AuthForm headingAs="page" mode={mode} onModeChange={setMode} onDone={() => navigate('/account')} />
      </div>
    )
  }

  const orders = loadOrders().filter((o) => o.email === user.email)
  const since = new Date(user.joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-[110px] sm:px-6 sm:pt-[130px]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="px-notch grid size-20 place-items-center bg-honey">
            <PixelSprite sprite={BEE_TOP} scale={5} />
          </div>
          <div>
            <p className="font-pixel text-xs text-honey-deep">Keeper since {since}</p>
            <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">Hi, {user.name.split(' ')[0]}.</h1>
            <p className="text-ink-soft">{user.email}</p>
          </div>
        </div>
        <Button variant="paper" onClick={() => { logOut(); navigate('/') }}>
          <LogOut className="size-4" /> Log out
        </Button>
      </div>

      <section aria-labelledby="orders-title" className="mt-14">
        <h2 id="orders-title" className="font-sans text-xl font-bold tracking-normal">Orders</h2>
        {orders.length === 0 ? (
          <div className="mt-4 flex flex-col items-start gap-4 border-2 border-dashed border-ink/30 bg-paper p-8">
            <Package className="size-8 text-honey-deep" aria-hidden="true" />
            <p className="text-lg font-semibold">No orders yet.</p>
            <p className="text-ink-soft">When you place an order with {user.email}, it shows up here with live status.</p>
            <Button asChild><Link to="/shop">Start shopping</Link></Button>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {orders.map((o) => {
              const stage = orderStage(o)
              return (
                <li key={o.number} className="border-2 border-ink bg-paper p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <p className="font-pixel text-sm">{o.number}</p>
                    <p className="text-sm text-muted">{new Date(o.placed).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                    <p className="tabular font-extrabold">{formatPrice(o.total)}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {o.items.slice(0, 6).map((i) => (
                      <img key={i.name + i.size} src={asset(i.image)} alt={i.name} className="size-14 bg-card object-cover" />
                    ))}
                  </div>
                  <ol className="mt-4 grid grid-cols-4 gap-1" aria-label={`Status: ${STAGES[stage]}`}>
                    {STAGES.map((s, i) => (
                      <li key={s} className="text-center">
                        <span className={`block h-2 ${i <= stage ? 'bg-leaf' : 'bg-ink/10'}`} />
                        <span className={`font-pixel mt-1.5 block text-[0.55rem] ${i <= stage ? 'text-ink' : 'text-muted'}`}>{s}</span>
                      </li>
                    ))}
                  </ol>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

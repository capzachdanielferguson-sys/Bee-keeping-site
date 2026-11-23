import { readStorage, writeStorage } from '@/lib/utils'

/** Demo order history kept in localStorage (replace with your commerce backend). */
export interface StoredOrder {
  number: string
  email: string
  name: string
  placed: string
  total: number
  items: { name: string; qty: number; size?: string; price: number; image: string }[]
  shippingMethod: 'standard' | 'express'
}

const ORDERS_KEY = 'ys_orders_v1'

export function loadOrders(): StoredOrder[] {
  return readStorage<StoredOrder[]>(ORDERS_KEY, [])
}

export function saveOrder(order: StoredOrder) {
  writeStorage(ORDERS_KEY, [order, ...loadOrders()])
}

/** Demo fulfilment stage from order age: placed → packed → shipped → delivered. */
export function orderStage(order: StoredOrder, now = Date.now()) {
  const hours = (now - new Date(order.placed).getTime()) / 36e5
  if (hours < 2) return 0
  if (hours < 24) return 1
  if (hours < 24 * 4) return 2
  return 3
}

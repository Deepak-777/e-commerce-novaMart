// src/services/orderService.js
// Firestore helpers for the top-level `orders` collection.

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const ORDERS_COL = 'orders'

/**
 * Save a new order after successful Stripe checkout.
 * @param {{ userId: string, items: Array, total: number, stripeSessionId?: string }} order
 */
export async function createOrder({ userId, items, total, stripeSessionId = '' }) {
  const ref = await addDoc(collection(db, ORDERS_COL), {
    userId,
    items,
    total,
    stripeSessionId,
    status: 'paid',
    createdAt: serverTimestamp(),
  })
  return ref.id
}

/** Fetch all orders belonging to a user, newest first */
export async function fetchUserOrders(userId) {
  const q = query(
    collection(db, ORDERS_COL),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

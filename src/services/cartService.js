// src/services/cartService.js
// Reads and writes the cart stored at users/{userId}/cart (a single document).

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
} from 'firebase/firestore'
import { db } from '../firebase/config'

/** Path helper */
const cartRef = (userId) => doc(db, 'users', userId, 'cart', 'items')

/** Load cart items array from Firestore. Returns [] if none. */
export async function loadCart(userId) {
  const snap = await getDoc(cartRef(userId))
  if (!snap.exists()) return []
  return snap.data().items ?? []
}

/** Persist the entire cart items array to Firestore */
export async function saveCart(userId, items) {
  await setDoc(cartRef(userId), { items, updatedAt: new Date().toISOString() }, { merge: true })
}

/** Wipe the user's cart (after successful checkout) */
export async function clearCart(userId) {
  await deleteDoc(cartRef(userId))
}

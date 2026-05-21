// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { loadCart, saveCart, clearCart } from '../services/cartService'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState(() => {
    // Initial load from localStorage
    try {
      const saved = localStorage.getItem('cart_items')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.error('Error loading cart from localStorage:', e)
      return []
    }
  })
  const [syncing, setSyncing]   = useState(false)

  // ── Load cart from Firestore when user logs in ─────────────────
  useEffect(() => {
    if (!user) return // Don't clear local cart if user is guest

    setSyncing(true)
    loadCart(user.uid)
      .then((saved) => {
        // If user has items in Firestore, use them. 
        // Otherwise, keep the local ones (they will be synced to Firestore in the next effect)
        if (saved && saved.length > 0) {
          setItems(saved)
        }
      })
      .catch(console.error)
      .finally(() => setSyncing(false))
  }, [user])

  // ── Persist to localStorage whenever items change ──────────────
  useEffect(() => {
    try {
      localStorage.setItem('cart_items', JSON.stringify(items))
    } catch (e) {
      console.warn('Could not save to localStorage', e)
    }
  }, [items])

  // ── Persist to Firestore whenever items change (debounced) ────
  useEffect(() => {
    if (!user || syncing) return
    const timer = setTimeout(() => {
      saveCart(user.uid, items).catch(console.error)
    }, 600) // 600ms debounce to avoid hammering Firestore
    return () => clearTimeout(timer)
  }, [items, user, syncing])

  // ── Cart mutations ─────────────────────────────────────────────

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id)
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
    )
  }, [])

  const emptyCart = useCallback(async () => {
    setItems([])
    if (user) await clearCart(user.uid)
  }, [user])

  // ── Derived values ─────────────────────────────────────────────
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, emptyCart, syncing }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

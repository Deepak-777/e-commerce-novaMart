import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartItem from '../components/cart/CartItem'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatCurrency } from '../utils/helpers'
import { checkout } from '../services/stripeService'
import toast from 'react-hot-toast'
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, CreditCard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SHIPPING_THRESHOLD = 50 // Free shipping above $50

export default function CartPage() {
  const { items, totalPrice, totalItems } = useCart()
  const { user }     = useAuth()
  const navigate     = useNavigate()
  const [loading, setLoading] = useState(false)

  const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0 : 4.99
  const tax      = totalPrice * 0.08
  const grandTotal = totalPrice + shipping + tax

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to checkout')
      navigate('/login')
      return
    }
    if (!items.length) return

    setLoading(true)
    try {
      await checkout(items, {
        userId: user.uid,
        shipping,
        tax,
      })
    } catch (err) {
      toast.error(err.message || 'Checkout failed')
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag size={56} className="text-brand-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-slate-500 dark:text-slate-400">Looks like you haven't added anything yet. Explore our top products and find something you love!</p>
          </div>
          <Button asChild size="lg" className="w-full sm:w-auto px-8 rounded-full">
            <Link to="/">Start Shopping</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Shopping Cart
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              You have {totalItems} items in your cart.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ── Cart items ─────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Order summary ──────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-4">
            <Card className="sticky top-24 overflow-hidden border-0 shadow-xl dark:shadow-none dark:border dark:border-slate-800 ring-1 ring-slate-900/5 dark:ring-0">
              <div className="p-6">
                <h2 className="font-bold text-slate-900 dark:text-white text-xl mb-6">Order Summary</h2>

                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-slate-900 dark:text-white">{formatCurrency(totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-bold' : 'text-slate-900 dark:text-white'}>
                      {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-slate-900 dark:text-white">{formatCurrency(tax)}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white text-xl pt-2">
                    <span>Total</span>
                    <span className="text-brand-600 dark:text-brand-400">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* Free shipping progress */}
                {totalPrice < SHIPPING_THRESHOLD ? (
                  <div className="mt-6 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-brand-700 dark:text-brand-300">
                      <Truck size={16} />
                      <span>You're {formatCurrency(SHIPPING_THRESHOLD - totalPrice)} away from Free Shipping!</span>
                    </div>
                    <div className="h-2 bg-brand-100 dark:bg-brand-900/40 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(totalPrice / SHIPPING_THRESHOLD) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-brand-500 rounded-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center gap-3 text-sm font-semibold text-green-700 dark:text-green-400">
                    <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded-full">
                      <Check size={16} />
                    </div>
                    <span>You've unlocked Free Shipping!</span>
                  </div>
                )}

                <Button
                  size="lg"
                  isLoading={loading}
                  onClick={handleCheckout}
                  className="w-full mt-6 rounded-xl shadow-md text-base"
                >
                  Proceed to Checkout <ArrowRight size={18} className="ml-2" />
                </Button>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck size={16} className="text-brand-500" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CreditCard size={16} className="text-brand-500" />
                    <span>Stripe Payments</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="mt-6 text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Check(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../services/orderService'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { motion } from 'framer-motion'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'

export default function SuccessPage() {
  const { items, totalPrice, emptyCart } = useCart()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const processedRef = useRef(false)

  useEffect(() => {
    // Prevent double-processing in StrictMode or on re-renders
    if (processedRef.current) return
    
    const finalizeOrder = async () => {
      if (items.length > 0 && user) {
        try {
          processedRef.current = true
          await createOrder({
            userId: user.uid,
            items: [...items],
            total: totalPrice,
            stripeSessionId: sessionId || '',
          })
          emptyCart()
          toast.success('Order placed successfully!')
        } catch (err) {
          console.error('Failed to create order:', err)
          toast.error('Payment confirmed, but failed to record order. Please contact support.')
        }
      }
    }

    finalizeOrder()
  }, [items, user, totalPrice, emptyCart, sessionId])

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-20 relative overflow-hidden">
      
      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="p-8 sm:p-10 text-center border-0 ring-1 ring-slate-900/5 dark:ring-0 shadow-2xl shadow-green-500/10 dark:shadow-none dark:border dark:border-slate-800">
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.6 }}
            className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative"
          >
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
            <CheckCircle2 size={48} className="text-green-600 dark:text-green-400 relative z-10" />
          </motion.div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Payment Successful!
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Thank you for your purchase. Your order has been placed and is being processed. We'll send you an email with the tracking details shortly.
          </p>

          <div className="space-y-3">
            <Button asChild size="lg" className="w-full rounded-xl">
              <Link to="/orders">
                <Package size={18} className="mr-2" /> View Order Status
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full rounded-xl">
              <Link to="/">
                Continue Shopping <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
          
        </Card>
      </motion.div>

    </div>
  )
}
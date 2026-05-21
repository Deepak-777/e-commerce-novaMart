import { useOrders } from '../hooks/useOrders'
import OrderCard from '../components/orders/OrderCard'
import { Skeleton } from '../components/ui/Skeleton'
import { Link } from 'react-router-dom'
import { PackageOpen, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { motion } from 'framer-motion'

export default function OrdersPage() {
  const { orders, loading, error } = useOrders()

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Order History</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Check the status of recent orders, manage returns, and discover similar products.
            </p>
          </div>
          <Button variant="outline" asChild className="shrink-0 rounded-full">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageOpen size={48} className="text-brand-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No orders found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
              Looks like you haven't made any purchases yet. Let's find something amazing for you!
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/">
                Start Shopping <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, i) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
